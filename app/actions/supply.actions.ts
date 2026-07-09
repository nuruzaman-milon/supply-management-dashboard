"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type SupplyStatus =
  | "PENDING"
  | "DELIVERED"
  | "PARTIAL_DELIVERED"
  | "CANCELLED";

export type DiscountKind = "NONE" | "PERCENTAGE" | "FIXED";

// Row shown in the supplies table.
export type SupplyListDTO = {
  id: string;
  supplyNo: string;
  supplyDate: string;
  dueDate: string;
  companyId: string;
  companyName: string;
  itemCount: number;
  subtotal: number;
  grandTotal: number;
  status: SupplyStatus;
  invoiceGenerated: boolean;
  invoiceNo: string;
  createdByName: string;
  createdAt: string;
};

export type SupplyItemDTO = {
  id: string;
  variantId: string;
  productName: string;
  variantName: string;
  productSku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
};

// Full supply for the view/edit modals.
export type SupplyDetailDTO = SupplyListDTO & {
  discountType: "PERCENTAGE" | "FIXED" | null;
  discountValue: number;
  discountAmount: number;
  supplyExpense: number;
  supplyExpenseReason: string;
  remarks: string;
  items: SupplyItemDTO[];
};

export type SupplyItemInput = {
  variantId: string;
  quantity: number;
  unitPrice: number;
};

export type SupplyInput = {
  companyId: string;
  supplyDate: string;
  dueDate: string;
  status: SupplyStatus;
  discountType: DiscountKind;
  discountValue: number;
  supplyExpense: number;
  supplyExpenseReason?: string;
  remarks?: string;
  items: SupplyItemInput[];
};

const STATUS_VALUES: SupplyStatus[] = [
  "PENDING",
  "DELIVERED",
  "PARTIAL_DELIVERED",
  "CANCELLED",
];

// Give the interactive transaction room to acquire a pool connection under
// load (default maxWait is only 2s) before failing.
const TX_OPTS = { maxWait: 15_000, timeout: 20_000 };

function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

// Server-side money math — client totals are never trusted.
function computeTotals(input: SupplyInput) {
  const items = input.items.map((it) => {
    const quantity = Number(it.quantity);
    const unitPrice = Number(it.unitPrice);
    return {
      variantId: it.variantId,
      quantity,
      unitPrice,
      total: round2(quantity * unitPrice),
    };
  });

  const subtotal = round2(items.reduce((sum, it) => sum + it.total, 0));

  let discountAmount = 0;
  if (input.discountType === "PERCENTAGE") {
    discountAmount = round2((subtotal * Number(input.discountValue)) / 100);
  } else if (input.discountType === "FIXED") {
    discountAmount = round2(Number(input.discountValue));
  }

  // Supply expense is the admin's own cost (borne by us, not billed to the
  // customer), so it is stored but NOT part of the grand total / invoice.
  const supplyExpense = round2(Number(input.supplyExpense) || 0);
  const grandTotal = round2(subtotal - discountAmount);

  return { items, subtotal, discountAmount, supplyExpense, grandTotal };
}

function validate(input: SupplyInput) {
  const companyId = input.companyId?.trim();
  if (!companyId) throw new Error("Company is required");

  if (!input.supplyDate) throw new Error("Supply date is required");
  const supplyDate = new Date(input.supplyDate);
  if (Number.isNaN(supplyDate.getTime()))
    throw new Error("Supply date is invalid");

  if (!input.dueDate) throw new Error("Payment due date is required");
  const dueDate = new Date(input.dueDate);
  if (Number.isNaN(dueDate.getTime()))
    throw new Error("Payment due date is invalid");

  if (!STATUS_VALUES.includes(input.status))
    throw new Error("Invalid supply status");

  if (!Array.isArray(input.items) || input.items.length === 0)
    throw new Error("Add at least one product line item");

  for (const [i, it] of input.items.entries()) {
    if (!it.variantId?.trim())
      throw new Error(`Select a product variant for line ${i + 1}`);
    if (!Number.isFinite(Number(it.quantity)) || Number(it.quantity) <= 0)
      throw new Error(`Quantity must be greater than 0 on line ${i + 1}`);
    if (!Number.isFinite(Number(it.unitPrice)) || Number(it.unitPrice) < 0)
      throw new Error(`Unit price must be valid on line ${i + 1}`);
  }

  if (
    input.discountType !== "NONE" &&
    (!Number.isFinite(Number(input.discountValue)) ||
      Number(input.discountValue) < 0)
  )
    throw new Error("Discount value must be a valid non-negative number");

  if (Number(input.supplyExpense) < 0)
    throw new Error("Supply expense cannot be negative");

  return { companyId, supplyDate, dueDate };
}

// SUP-0001, SUP-0002, ... based on the current row count.
async function nextSupplyNo(
  tx: Pick<typeof prisma, "supply">
): Promise<string> {
  const count = await tx.supply.count();
  return `SUP-${String(count + 1).padStart(4, "0")}`;
}

// INV-0001, INV-0002, ... (mirrors invoice.actions; a supply auto-creates its invoice).
async function nextInvoiceNo(
  tx: Pick<typeof prisma, "invoice">
): Promise<string> {
  const count = await tx.invoice.count();
  return `INV-${String(count + 1).padStart(4, "0")}`;
}

function listSelect() {
  return {
    id: true,
    supplyNo: true,
    supplyDate: true,
    dueDate: true,
    companyId: true,
    subtotal: true,
    grandTotal: true,
    status: true,
    invoiceGenerated: true,
    createdAt: true,
    company: { select: { companyName: true } },
    createdBy: { select: { username: true } },
    invoice: { select: { invoiceNo: true } },
    _count: { select: { items: true } },
  } as const;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListDTO(s: any): SupplyListDTO {
  return {
    id: s.id,
    supplyNo: s.supplyNo,
    supplyDate: s.supplyDate.toISOString(),
    dueDate: s.dueDate.toISOString(),
    companyId: s.companyId,
    companyName: s.company.companyName,
    itemCount: s._count.items,
    subtotal: Number(s.subtotal),
    grandTotal: Number(s.grandTotal),
    status: s.status,
    invoiceGenerated: s.invoiceGenerated,
    invoiceNo: s.invoice?.invoiceNo ?? "",
    createdByName: s.createdBy.username,
    createdAt: s.createdAt.toISOString(),
  };
}

export async function getSupplies(): Promise<SupplyListDTO[]> {
  await requireSession();

  const supplies = await prisma.supply.findMany({
    orderBy: { createdAt: "desc" },
    select: listSelect(),
  });

  return supplies.map(toListDTO);
}

export async function getSupply(id: string): Promise<SupplyDetailDTO> {
  await requireSession();
  if (!id) throw new Error("Supply id is required");

  const s = await prisma.supply.findUnique({
    where: { id },
    include: {
      company: { select: { companyName: true } },
      createdBy: { select: { username: true } },
      invoice: { select: { invoiceNo: true } },
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
  });

  if (!s) throw new Error("Supply not found");

  const subtotal = Number(s.subtotal);
  const discountValue = s.discountValue ? Number(s.discountValue) : 0;
  let discountAmount = 0;
  if (s.discountType === "PERCENTAGE")
    discountAmount = round2((subtotal * discountValue) / 100);
  else if (s.discountType === "FIXED") discountAmount = round2(discountValue);

  return {
    id: s.id,
    supplyNo: s.supplyNo,
    supplyDate: s.supplyDate.toISOString(),
    dueDate: s.dueDate.toISOString(),
    companyId: s.companyId,
    companyName: s.company.companyName,
    itemCount: s.items.length,
    subtotal,
    grandTotal: Number(s.grandTotal),
    status: s.status,
    invoiceGenerated: s.invoiceGenerated,
    invoiceNo: s.invoice?.invoiceNo ?? "",
    createdByName: s.createdBy.username,
    createdAt: s.createdAt.toISOString(),
    discountType: s.discountType,
    discountValue,
    discountAmount,
    supplyExpense: Number(s.supplyExpense),
    supplyExpenseReason: s.supplyExpenseReason ?? "",
    remarks: s.remarks ?? "",
    items: s.items.map((it) => ({
      id: it.id,
      variantId: it.variantId,
      productName: it.variant.product.name,
      variantName: it.variant.name,
      productSku: it.variant.sku,
      unit: it.variant.unit,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
      total: Number(it.total),
    })),
  };
}

export async function createSupply(input: SupplyInput): Promise<SupplyListDTO> {
  const session = await requireSession();

  const { companyId, supplyDate, dueDate } = validate(input);
  const { items, subtotal, supplyExpense, grandTotal } = computeTotals(input);

  const created = await prisma.$transaction(async (tx) => {
    const supplyNo = await nextSupplyNo(tx);

    const supply = await tx.supply.create({
      data: {
        supplyNo,
        companyId,
        supplyDate,
        dueDate,
        subtotal,
        discountType:
          input.discountType === "NONE" ? null : input.discountType,
        discountValue: input.discountType === "NONE" ? null : Number(input.discountValue),
        supplyExpense,
        supplyExpenseReason: input.supplyExpenseReason?.trim() || null,
        grandTotal,
        remarks: input.remarks?.trim() || null,
        status: input.status,
        invoiceGenerated: true,
        createdById: session.id,
        items: {
          create: items.map((it) => ({
            variantId: it.variantId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.total,
          })),
        },
      },
      select: { id: true },
    });

    // Auto-create the linked invoice (1:1). invoiceDate = supplyDate,
    // dueDate = the payment due date entered on the supply.
    const invoiceNo = await nextInvoiceNo(tx);
    await tx.invoice.create({
      data: {
        invoiceNo,
        supplyId: supply.id,
        companyId,
        invoiceDate: supplyDate,
        dueDate,
        totalAmount: grandTotal,
        status: "UNPAID",
        createdById: session.id,
      },
    });

    return tx.supply.findUniqueOrThrow({
      where: { id: supply.id },
      select: listSelect(),
    });
  }, TX_OPTS);

  revalidatePath("/supplies");
  revalidatePath("/invoices");
  return toListDTO(created);
}

// A supply can be edited/deleted only until money is recorded against its
// invoice (a collection or an adjustment). Returns a blocking error string or null.
async function paymentLock(
  tx: Pick<typeof prisma, "invoice">,
  supplyId: string
): Promise<string | null> {
  const invoice = await tx.invoice.findUnique({
    where: { supplyId },
    select: { _count: { select: { collections: true, adjustments: true } } },
  });
  if (!invoice) return null;
  if (invoice._count.collections > 0)
    return "This supply's invoice has recorded collections and can't be changed.";
  if (invoice._count.adjustments > 0)
    return "This supply's invoice has adjustments and can't be changed.";
  return null;
}

export async function updateSupply(
  id: string,
  input: SupplyInput
): Promise<SupplyListDTO> {
  await requireSession();
  if (!id) throw new Error("Supply id is required");

  const existing = await prisma.supply.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new Error("Supply not found");

  const { companyId, supplyDate, dueDate } = validate(input);
  const { items, subtotal, supplyExpense, grandTotal } = computeTotals(input);

  const updated = await prisma.$transaction(async (tx) => {
    const lock = await paymentLock(tx, id);
    if (lock) throw new Error(lock);

    // Replace line items wholesale — simplest correct approach for an edit.
    await tx.supplyItem.deleteMany({ where: { supplyId: id } });

    const supply = await tx.supply.update({
      where: { id },
      data: {
        companyId,
        supplyDate,
        dueDate,
        subtotal,
        discountType:
          input.discountType === "NONE" ? null : input.discountType,
        discountValue: input.discountType === "NONE" ? null : Number(input.discountValue),
        supplyExpense,
        supplyExpenseReason: input.supplyExpenseReason?.trim() || null,
        grandTotal,
        remarks: input.remarks?.trim() || null,
        status: input.status,
        items: {
          create: items.map((it) => ({
            variantId: it.variantId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.total,
          })),
        },
      },
      select: listSelect(),
    });

    // Keep the linked invoice in sync (no payments exist, so status stays UNPAID).
    await tx.invoice.update({
      where: { supplyId: id },
      data: {
        companyId,
        invoiceDate: supplyDate,
        dueDate,
        totalAmount: grandTotal,
      },
    });

    return supply;
  }, TX_OPTS);

  revalidatePath("/supplies");
  revalidatePath("/invoices");
  return toListDTO(updated);
}

export async function deleteSupply(id: string): Promise<{ success: true }> {
  await requireSession();
  if (!id) throw new Error("Supply id is required");

  const existing = await prisma.supply.findUnique({
    where: { id },
    select: { id: true },
  });
  if (!existing) throw new Error("Supply not found");

  await prisma.$transaction(async (tx) => {
    const lock = await paymentLock(tx, id);
    if (lock)
      throw new Error(lock.replace("can't be changed", "can't be deleted"));

    // Delete the linked invoice first (1:1), then the supply's items, then the supply.
    await tx.invoice.deleteMany({ where: { supplyId: id } });
    await tx.supplyItem.deleteMany({ where: { supplyId: id } });
    await tx.supply.delete({ where: { id } });
  }, TX_OPTS);

  revalidatePath("/supplies");
  revalidatePath("/invoices");
  return { success: true };
}
