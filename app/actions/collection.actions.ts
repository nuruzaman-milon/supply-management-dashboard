"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type PaymentMethod =
  | "CASH"
  | "BANK_TRANSFER"
  | "MOBILE_BANKING"
  | "CHEQUE";

const PAYMENT_METHODS: PaymentMethod[] = [
  "CASH",
  "BANK_TRANSFER",
  "MOBILE_BANKING",
  "CHEQUE",
];

export type CollectionListDTO = {
  id: string;
  collectionNo: string;
  invoiceId: string;
  invoiceNo: string;
  companyName: string;
  collectionDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNo: string;
  createdByName: string;
  createdAt: string;
};

export type CollectionDetailDTO = CollectionListDTO & {
  remarks: string;
  invoiceTotal: number;
  // Largest this collection may be: invoice total minus OTHER collections and adjustments.
  maxAmount: number;
};

// Invoice that can still receive a payment (shown in the "new collection" dropdown).
export type PayableInvoiceDTO = {
  id: string;
  invoiceNo: string;
  companyName: string;
  totalAmount: number;
  dueAmount: number;
};

export type CollectionInput = {
  invoiceId: string;
  collectionDate: string;
  amount: number;
  paymentMethod: PaymentMethod;
  referenceNo?: string;
  remarks?: string;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

// COL-0001, COL-0002, ...
async function nextCollectionNo(
  tx: Pick<typeof prisma, "collection">
): Promise<string> {
  const count = await tx.collection.count();
  return `COL-${String(count + 1).padStart(4, "0")}`;
}

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

// Sum paid (optionally excluding one collection) + adjustments for an invoice.
async function invoiceBalance(
  tx: TxClient,
  invoiceId: string,
  excludeCollectionId?: string
) {
  const inv = await tx.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      totalAmount: true,
      status: true,
      collections: { select: { id: true, amount: true } },
      adjustments: { select: { amount: true } },
    },
  });
  if (!inv) throw new Error("Invoice not found");

  const total = Number(inv.totalAmount);
  const paidByOthers = round2(
    inv.collections
      .filter((c) => c.id !== excludeCollectionId)
      .reduce((sum, c) => sum + Number(c.amount), 0)
  );
  const adjustments = round2(
    inv.adjustments.reduce((sum, a) => sum + Number(a.amount), 0)
  );
  // Outstanding available for this (new or edited) collection.
  const availableDue = round2(total - paidByOthers - adjustments);
  return { total, paidByOthers, adjustments, availableDue, status: inv.status };
}

// After a collection change, keep the invoice's stored status in sync.
async function recomputeInvoiceStatus(tx: TxClient, invoiceId: string) {
  const inv = await tx.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      totalAmount: true,
      status: true,
      collections: { select: { amount: true } },
      adjustments: { select: { amount: true } },
    },
  });
  if (!inv || inv.status === "CANCELLED") return;

  const total = Number(inv.totalAmount);
  const paid = inv.collections.reduce((s, c) => s + Number(c.amount), 0);
  const adjustments = inv.adjustments.reduce((s, a) => s + Number(a.amount), 0);
  const due = round2(total - paid - adjustments);

  let status: "PAID" | "PARTIALLY_PAID" | "UNPAID";
  if (due <= 0.005) status = "PAID";
  else if (paid > 0) status = "PARTIALLY_PAID";
  else status = "UNPAID";

  if (status !== inv.status) {
    await tx.invoice.update({ where: { id: invoiceId }, data: { status } });
  }
}

function validate(input: CollectionInput) {
  if (!input.invoiceId?.trim()) throw new Error("Select an invoice");
  if (!input.collectionDate) throw new Error("Collection date is required");
  const collectionDate = new Date(input.collectionDate);
  if (Number.isNaN(collectionDate.getTime()))
    throw new Error("Collection date is invalid");
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Amount must be greater than 0");
  if (!PAYMENT_METHODS.includes(input.paymentMethod))
    throw new Error("Invalid payment method");
  return { collectionDate, amount };
}

const listInclude = {
  invoice: {
    select: { invoiceNo: true, company: { select: { companyName: true } } },
  },
  createdBy: { select: { username: true } },
} as const;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListDTO(c: any): CollectionListDTO {
  return {
    id: c.id,
    collectionNo: c.collectionNo,
    invoiceId: c.invoiceId,
    invoiceNo: c.invoice.invoiceNo,
    companyName: c.invoice.company.companyName,
    collectionDate: c.collectionDate.toISOString(),
    amount: Number(c.amount),
    paymentMethod: c.paymentMethod,
    referenceNo: c.referenceNo ?? "",
    createdByName: c.createdBy.username,
    createdAt: c.createdAt.toISOString(),
  };
}

export async function getCollections(): Promise<CollectionListDTO[]> {
  await requireSession();
  const collections = await prisma.collection.findMany({
    orderBy: { createdAt: "desc" },
    include: listInclude,
  });
  return collections.map(toListDTO);
}

export async function getCollection(id: string): Promise<CollectionDetailDTO> {
  await requireSession();
  if (!id) throw new Error("Collection id is required");

  const c = await prisma.collection.findUnique({
    where: { id },
    include: {
      ...listInclude,
      invoice: {
        select: {
          invoiceNo: true,
          totalAmount: true,
          company: { select: { companyName: true } },
          collections: { select: { id: true, amount: true } },
          adjustments: { select: { amount: true } },
        },
      },
    },
  });
  if (!c) throw new Error("Collection not found");

  const total = Number(c.invoice.totalAmount);
  const paidByOthers = c.invoice.collections
    .filter((x) => x.id !== c.id)
    .reduce((s, x) => s + Number(x.amount), 0);
  const adjustments = c.invoice.adjustments.reduce(
    (s, a) => s + Number(a.amount),
    0
  );

  return {
    ...toListDTO(c),
    remarks: c.remarks ?? "",
    invoiceTotal: total,
    maxAmount: round2(total - paidByOthers - adjustments),
  };
}

export async function getPayableInvoices(): Promise<PayableInvoiceDTO[]> {
  await requireSession();
  const invoices = await prisma.invoice.findMany({
    where: { status: { notIn: ["PAID", "CANCELLED"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      invoiceNo: true,
      totalAmount: true,
      company: { select: { companyName: true } },
      collections: { select: { amount: true } },
      adjustments: { select: { amount: true } },
    },
  });

  return invoices
    .map((inv) => {
      const total = Number(inv.totalAmount);
      const paid = inv.collections.reduce((s, c) => s + Number(c.amount), 0);
      const adj = inv.adjustments.reduce((s, a) => s + Number(a.amount), 0);
      const dueAmount = round2(total - paid - adj);
      return {
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        companyName: inv.company.companyName,
        totalAmount: total,
        dueAmount,
      };
    })
    .filter((inv) => inv.dueAmount > 0.005);
}

export async function createCollection(
  input: CollectionInput
): Promise<CollectionListDTO> {
  const session = await requireSession();
  const { collectionDate, amount } = validate(input);

  const created = await prisma.$transaction(async (tx) => {
    const { availableDue, status } = await invoiceBalance(tx, input.invoiceId);
    if (status === "CANCELLED")
      throw new Error("Cannot record a payment against a cancelled invoice");
    if (amount - availableDue > 0.005)
      throw new Error(
        `Amount exceeds the outstanding due of ৳${availableDue.toLocaleString(
          "en-BD"
        )}`
      );

    const collectionNo = await nextCollectionNo(tx);
    const collection = await tx.collection.create({
      data: {
        collectionNo,
        invoiceId: input.invoiceId,
        collectionDate,
        amount,
        paymentMethod: input.paymentMethod,
        referenceNo: input.referenceNo?.trim() || null,
        remarks: input.remarks?.trim() || null,
        createdById: session.id,
      },
      include: listInclude,
    });

    await recomputeInvoiceStatus(tx, input.invoiceId);
    return collection;
  });

  revalidatePath("/collections");
  revalidatePath("/invoices");
  return toListDTO(created);
}

export async function updateCollection(
  id: string,
  input: CollectionInput
): Promise<CollectionListDTO> {
  await requireSession();
  if (!id) throw new Error("Collection id is required");
  const { collectionDate, amount } = validate(input);

  const updated = await prisma.$transaction(async (tx) => {
    const existing = await tx.collection.findUnique({
      where: { id },
      select: { invoiceId: true },
    });
    if (!existing) throw new Error("Collection not found");

    // Validate against the invoice due, ignoring this collection's own amount.
    const { availableDue, status } = await invoiceBalance(
      tx,
      existing.invoiceId,
      id
    );
    if (status === "CANCELLED")
      throw new Error("Cannot edit a payment on a cancelled invoice");
    if (amount - availableDue > 0.005)
      throw new Error(
        `Amount exceeds the outstanding due of ৳${availableDue.toLocaleString(
          "en-BD"
        )}`
      );

    const collection = await tx.collection.update({
      where: { id },
      data: {
        collectionDate,
        amount,
        paymentMethod: input.paymentMethod,
        referenceNo: input.referenceNo?.trim() || null,
        remarks: input.remarks?.trim() || null,
      },
      include: listInclude,
    });

    await recomputeInvoiceStatus(tx, existing.invoiceId);
    return collection;
  });

  revalidatePath("/collections");
  revalidatePath("/invoices");
  return toListDTO(updated);
}

export async function deleteCollection(
  id: string
): Promise<{ success: true }> {
  await requireSession();
  if (!id) throw new Error("Collection id is required");

  await prisma.$transaction(async (tx) => {
    const existing = await tx.collection.findUnique({
      where: { id },
      select: { invoiceId: true },
    });
    if (!existing) throw new Error("Collection not found");

    await tx.collection.delete({ where: { id } });
    await recomputeInvoiceStatus(tx, existing.invoiceId);
  });

  revalidatePath("/collections");
  revalidatePath("/invoices");
  return { success: true };
}
