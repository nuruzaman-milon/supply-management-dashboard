"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type AdjustmentType = "DISCOUNT" | "WAIVER" | "CORRECTION" | "WRITE_OFF";

const ADJUSTMENT_TYPES: AdjustmentType[] = [
  "DISCOUNT",
  "WAIVER",
  "CORRECTION",
  "WRITE_OFF",
];

export type DueListDTO = {
  invoiceId: string;
  invoiceNo: string;
  companyId: string;
  companyName: string;
  invoiceAmount: number;
  paidAmount: number;
  adjustmentTotal: number;
  dueAmount: number;
  invoiceDate: string;
  dueDate: string;
  daysOverdue: number;
  overdue: boolean;
};

export type DueCollectionDTO = {
  id: string;
  collectionNo: string;
  collectionDate: string;
  amount: number;
  paymentMethod: string;
  referenceNo: string;
};

export type DueAdjustmentDTO = {
  id: string;
  adjustmentType: AdjustmentType;
  amount: number;
  reason: string;
  createdAt: string;
  createdByName: string;
};

export type DueDetailDTO = DueListDTO & {
  collections: DueCollectionDTO[];
  adjustments: DueAdjustmentDTO[];
};

export type AdjustmentInput = {
  invoiceId: string;
  adjustmentType: AdjustmentType;
  amount: number;
  reason?: string;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(from: Date, to: Date): number {
  const a = new Date(from);
  a.setHours(0, 0, 0, 0);
  const b = new Date(to);
  b.setHours(0, 0, 0, 0);
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0];

// Keep the invoice's stored status in sync after an adjustment change.
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDueRow(inv: any): DueListDTO {
  const invoiceAmount = Number(inv.totalAmount);
  const paidAmount = round2(
    inv.collections.reduce((s: number, c: { amount: unknown }) => s + Number(c.amount), 0)
  );
  const adjustmentTotal = round2(
    inv.adjustments.reduce((s: number, a: { amount: unknown }) => s + Number(a.amount), 0)
  );
  const dueAmount = round2(invoiceAmount - paidAmount - adjustmentTotal);
  const daysOverdue = Math.max(0, daysBetween(new Date(inv.dueDate), startOfToday()));
  return {
    invoiceId: inv.id,
    invoiceNo: inv.invoiceNo,
    companyId: inv.companyId,
    companyName: inv.company.companyName,
    invoiceAmount,
    paidAmount,
    adjustmentTotal,
    dueAmount,
    invoiceDate: inv.invoiceDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    daysOverdue,
    overdue: dueAmount > 0.005 && daysOverdue > 0,
  };
}

const dueInclude = {
  company: { select: { companyName: true } },
  collections: { select: { amount: true } },
  adjustments: { select: { amount: true } },
} as const;

// Invoices that still owe money — the due list.
export async function getDueList(): Promise<DueListDTO[]> {
  await requireSession();
  const invoices = await prisma.invoice.findMany({
    where: { status: { notIn: ["PAID", "CANCELLED"] } },
    orderBy: { dueDate: "asc" },
    include: dueInclude,
  });
  return invoices.map(toDueRow).filter((d) => d.dueAmount > 0.005);
}

export async function getDueDetail(invoiceId: string): Promise<DueDetailDTO> {
  await requireSession();
  if (!invoiceId) throw new Error("Invoice id is required");

  const inv = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      company: { select: { companyName: true } },
      collections: {
        orderBy: { collectionDate: "desc" },
        select: {
          id: true,
          collectionNo: true,
          collectionDate: true,
          amount: true,
          paymentMethod: true,
          referenceNo: true,
        },
      },
      adjustments: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          adjustmentType: true,
          amount: true,
          reason: true,
          createdAt: true,
          createdBy: { select: { username: true } },
        },
      },
    },
  });
  if (!inv) throw new Error("Invoice not found");

  const base = toDueRow(inv);
  return {
    ...base,
    collections: inv.collections.map((c) => ({
      id: c.id,
      collectionNo: c.collectionNo,
      collectionDate: c.collectionDate.toISOString(),
      amount: Number(c.amount),
      paymentMethod: c.paymentMethod,
      referenceNo: c.referenceNo ?? "",
    })),
    adjustments: inv.adjustments.map((a) => ({
      id: a.id,
      adjustmentType: a.adjustmentType,
      amount: Number(a.amount),
      reason: a.reason ?? "",
      createdAt: a.createdAt.toISOString(),
      createdByName: a.createdBy.username,
    })),
  };
}

// Current outstanding due for an invoice (excludes nothing — the live balance).
async function availableDue(tx: TxClient, invoiceId: string) {
  const inv = await tx.invoice.findUnique({
    where: { id: invoiceId },
    select: {
      totalAmount: true,
      status: true,
      collections: { select: { amount: true } },
      adjustments: { select: { amount: true } },
    },
  });
  if (!inv) throw new Error("Invoice not found");
  const total = Number(inv.totalAmount);
  const paid = inv.collections.reduce((s, c) => s + Number(c.amount), 0);
  const adj = inv.adjustments.reduce((s, a) => s + Number(a.amount), 0);
  return { due: round2(total - paid - adj), status: inv.status };
}

export async function createAdjustment(
  input: AdjustmentInput
): Promise<{ success: true }> {
  const session = await requireSession();

  if (!input.invoiceId?.trim()) throw new Error("Invoice is required");
  if (!ADJUSTMENT_TYPES.includes(input.adjustmentType))
    throw new Error("Invalid adjustment type");
  const amount = Number(input.amount);
  if (!Number.isFinite(amount) || amount <= 0)
    throw new Error("Amount must be greater than 0");

  await prisma.$transaction(async (tx) => {
    const { due, status } = await availableDue(tx, input.invoiceId);
    if (status === "CANCELLED")
      throw new Error("Cannot adjust a cancelled invoice");
    if (amount - due > 0.005)
      throw new Error(
        `Adjustment exceeds the outstanding due of ৳${due.toLocaleString("en-BD")}`
      );

    await tx.invoiceAdjustment.create({
      data: {
        invoiceId: input.invoiceId,
        adjustmentType: input.adjustmentType,
        amount,
        reason: input.reason?.trim() || null,
        createdById: session.id,
      },
    });

    await recomputeInvoiceStatus(tx, input.invoiceId);
  });

  revalidatePath("/due-list");
  revalidatePath("/invoices");
  return { success: true };
}

export async function deleteAdjustment(
  id: string
): Promise<{ success: true }> {
  await requireSession();
  if (!id) throw new Error("Adjustment id is required");

  await prisma.$transaction(async (tx) => {
    const existing = await tx.invoiceAdjustment.findUnique({
      where: { id },
      select: { invoiceId: true },
    });
    if (!existing) throw new Error("Adjustment not found");
    await tx.invoiceAdjustment.delete({ where: { id } });
    await recomputeInvoiceStatus(tx, existing.invoiceId);
  });

  revalidatePath("/due-list");
  revalidatePath("/invoices");
  return { success: true };
}
