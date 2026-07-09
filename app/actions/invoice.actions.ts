"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type InvoiceStatus =
  | "DRAFT"
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED";

// Statuses a user can set manually. OVERDUE is derived at read time, never set.
const INVOICE_STATUS_OPTIONS: InvoiceStatus[] = [
  "DRAFT",
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "CANCELLED",
];

export type InvoiceListDTO = {
  id: string;
  invoiceNo: string;
  supplyId: string;
  supplyNo: string;
  companyId: string;
  companyName: string;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: InvoiceStatus;
  isOverdue: boolean;
  createdByName: string;
  createdAt: string;
};

export type InvoiceItemDTO = {
  id: string;
  productName: string;
  variantName: string;
  productSku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

export type InvoiceCollectionDTO = {
  id: string;
  collectionNo: string;
  collectionDate: string;
  amount: number;
  paymentMethod: "CASH" | "BANK_TRANSFER" | "MOBILE_BANKING" | "CHEQUE";
  referenceNo: string;
  createdByName: string;
};

export type InvoiceDetailDTO = InvoiceListDTO & {
  notes: string;
  adjustmentTotal: number;
  items: InvoiceItemDTO[];
  collections: InvoiceCollectionDTO[];
};

export type UpdateInvoiceInput = {
  invoiceDate: string;
  dueDate: string;
  status: InvoiceStatus;
  notes?: string;
};

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

function validateDates(input: { invoiceDate: string; dueDate: string }) {
  if (!input.invoiceDate) throw new Error("Invoice date is required");
  if (!input.dueDate) throw new Error("Due date is required");
  const invoiceDate = new Date(input.invoiceDate);
  const dueDate = new Date(input.dueDate);
  if (Number.isNaN(invoiceDate.getTime()))
    throw new Error("Invoice date is invalid");
  if (Number.isNaN(dueDate.getTime())) throw new Error("Due date is invalid");
  if (dueDate < invoiceDate)
    throw new Error("Due date cannot be before the invoice date");
  return { invoiceDate, dueDate };
}

function validateStatus(status: InvoiceStatus) {
  if (!INVOICE_STATUS_OPTIONS.includes(status))
    throw new Error("Invalid invoice status");
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function computePayments(inv: any) {
  const totalAmount = Number(inv.totalAmount);
  const paidAmount = round2(
    (inv.collections ?? []).reduce(
      (sum: number, c: { amount: unknown }) => sum + Number(c.amount),
      0
    )
  );
  const adjustmentTotal = round2(
    (inv.adjustments ?? []).reduce(
      (sum: number, a: { amount: unknown }) => sum + Number(a.amount),
      0
    )
  );
  const dueAmount = round2(
    Math.max(0, totalAmount - paidAmount - adjustmentTotal)
  );
  const isOverdue =
    (inv.status === "UNPAID" || inv.status === "PARTIALLY_PAID") &&
    dueAmount > 0 &&
    new Date(inv.dueDate) < startOfToday();
  return { totalAmount, paidAmount, adjustmentTotal, dueAmount, isOverdue };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListDTO(inv: any): InvoiceListDTO {
  const { totalAmount, paidAmount, dueAmount, isOverdue } =
    computePayments(inv);
  return {
    id: inv.id,
    invoiceNo: inv.invoiceNo,
    supplyId: inv.supplyId,
    supplyNo: inv.supply.supplyNo,
    companyId: inv.companyId,
    companyName: inv.company.companyName,
    invoiceDate: inv.invoiceDate.toISOString(),
    dueDate: inv.dueDate.toISOString(),
    totalAmount,
    paidAmount,
    dueAmount,
    status: inv.status,
    isOverdue,
    createdByName: inv.createdBy.username,
    createdAt: inv.createdAt.toISOString(),
  };
}

const listInclude = {
  supply: { select: { supplyNo: true } },
  company: { select: { companyName: true } },
  createdBy: { select: { username: true } },
  collections: { select: { amount: true } },
  adjustments: { select: { amount: true } },
} as const;

export async function getInvoices(): Promise<InvoiceListDTO[]> {
  await requireSession();
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: listInclude,
  });
  return invoices.map(toListDTO);
}

export async function getInvoice(id: string): Promise<InvoiceDetailDTO> {
  await requireSession();
  if (!id) throw new Error("Invoice id is required");

  const inv = await prisma.invoice.findUnique({
    where: { id },
    include: {
      ...listInclude,
      // Full collection rows for the invoice's payment history (newest first).
      collections: {
        orderBy: { collectionDate: "desc" },
        select: {
          id: true,
          collectionNo: true,
          collectionDate: true,
          amount: true,
          paymentMethod: true,
          referenceNo: true,
          createdBy: { select: { username: true } },
        },
      },
      supply: {
        select: {
          supplyNo: true,
          items: {
            include: {
              variant: {
                select: {
                  name: true,
                  sku: true,
                  unit: true,
                  product: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });
  if (!inv) throw new Error("Invoice not found");

  const base = toListDTO(inv);
  const { adjustmentTotal } = computePayments(inv);

  return {
    ...base,
    notes: inv.notes ?? "",
    adjustmentTotal,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: inv.supply.items.map((it: any) => ({
      id: it.id,
      productName: it.variant.product.name,
      variantName: it.variant.name,
      productSku: it.variant.sku,
      unit: it.variant.unit,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
      total: Number(it.total),
    })),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    collections: inv.collections.map((c: any) => ({
      id: c.id,
      collectionNo: c.collectionNo,
      collectionDate: c.collectionDate.toISOString(),
      amount: Number(c.amount),
      paymentMethod: c.paymentMethod,
      referenceNo: c.referenceNo ?? "",
      createdByName: c.createdBy.username,
    })),
  };
}

export async function updateInvoice(
  id: string,
  input: UpdateInvoiceInput
): Promise<InvoiceListDTO> {
  await requireSession();
  if (!id) throw new Error("Invoice id is required");

  const { invoiceDate, dueDate } = validateDates(input);
  validateStatus(input.status);

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      invoiceDate,
      dueDate,
      status: input.status,
      notes: input.notes?.trim() || null,
    },
    include: listInclude,
  });

  revalidatePath("/invoices");
  return toListDTO(updated);
}
