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
  companyId: string;
  companyName: string;
  itemCount: number;
  subtotal: number;
  grandTotal: number;
  status: SupplyStatus;
  invoiceGenerated: boolean;
  createdByName: string;
  createdAt: string;
};

export type SupplyItemDTO = {
  id: string;
  productId: string;
  productName: string;
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
  productId: string;
  quantity: number;
  unitPrice: number;
};

export type SupplyInput = {
  companyId: string;
  supplyDate: string;
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
      productId: it.productId,
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

  const supplyExpense = round2(Number(input.supplyExpense) || 0);
  const grandTotal = round2(subtotal - discountAmount + supplyExpense);

  return { items, subtotal, discountAmount, supplyExpense, grandTotal };
}

function validate(input: SupplyInput) {
  const companyId = input.companyId?.trim();
  if (!companyId) throw new Error("Company is required");

  if (!input.supplyDate) throw new Error("Supply date is required");
  const supplyDate = new Date(input.supplyDate);
  if (Number.isNaN(supplyDate.getTime()))
    throw new Error("Supply date is invalid");

  if (!STATUS_VALUES.includes(input.status))
    throw new Error("Invalid supply status");

  if (!Array.isArray(input.items) || input.items.length === 0)
    throw new Error("Add at least one product line item");

  for (const [i, it] of input.items.entries()) {
    if (!it.productId?.trim())
      throw new Error(`Select a product for line ${i + 1}`);
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

  return { companyId, supplyDate };
}

// SUP-0001, SUP-0002, ... based on the current row count.
async function nextSupplyNo(
  tx: Pick<typeof prisma, "supply">
): Promise<string> {
  const count = await tx.supply.count();
  return `SUP-${String(count + 1).padStart(4, "0")}`;
}

function listSelect() {
  return {
    id: true,
    supplyNo: true,
    supplyDate: true,
    companyId: true,
    subtotal: true,
    grandTotal: true,
    status: true,
    invoiceGenerated: true,
    createdAt: true,
    company: { select: { companyName: true } },
    createdBy: { select: { username: true } },
    _count: { select: { items: true } },
  } as const;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toListDTO(s: any): SupplyListDTO {
  return {
    id: s.id,
    supplyNo: s.supplyNo,
    supplyDate: s.supplyDate.toISOString(),
    companyId: s.companyId,
    companyName: s.company.companyName,
    itemCount: s._count.items,
    subtotal: Number(s.subtotal),
    grandTotal: Number(s.grandTotal),
    status: s.status,
    invoiceGenerated: s.invoiceGenerated,
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
      items: {
        include: {
          product: { select: { name: true, sku: true, unit: true } },
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
    companyId: s.companyId,
    companyName: s.company.companyName,
    itemCount: s.items.length,
    subtotal,
    grandTotal: Number(s.grandTotal),
    status: s.status,
    invoiceGenerated: s.invoiceGenerated,
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
      productId: it.productId,
      productName: it.product.name,
      productSku: it.product.sku,
      unit: it.product.unit,
      quantity: Number(it.quantity),
      unitPrice: Number(it.unitPrice),
      total: Number(it.total),
    })),
  };
}

export async function createSupply(input: SupplyInput): Promise<SupplyListDTO> {
  const session = await requireSession();

  const { companyId, supplyDate } = validate(input);
  const { items, subtotal, supplyExpense, grandTotal } = computeTotals(input);

  const created = await prisma.$transaction(async (tx) => {
    const supplyNo = await nextSupplyNo(tx);

    return tx.supply.create({
      data: {
        supplyNo,
        companyId,
        supplyDate,
        subtotal,
        discountType:
          input.discountType === "NONE" ? null : input.discountType,
        discountValue: input.discountType === "NONE" ? null : Number(input.discountValue),
        supplyExpense,
        supplyExpenseReason: input.supplyExpenseReason?.trim() || null,
        grandTotal,
        remarks: input.remarks?.trim() || null,
        status: input.status,
        createdById: session.id,
        items: {
          create: items.map((it) => ({
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.total,
          })),
        },
      },
      select: listSelect(),
    });
  });

  revalidatePath("/supplies");
  return toListDTO(created);
}

export async function updateSupply(
  id: string,
  input: SupplyInput
): Promise<SupplyListDTO> {
  await requireSession();
  if (!id) throw new Error("Supply id is required");

  const existing = await prisma.supply.findUnique({
    where: { id },
    select: { invoiceGenerated: true },
  });
  if (!existing) throw new Error("Supply not found");
  if (existing.invoiceGenerated)
    throw new Error("This supply has an invoice and can no longer be edited");

  const { companyId, supplyDate } = validate(input);
  const { items, subtotal, supplyExpense, grandTotal } = computeTotals(input);

  const updated = await prisma.$transaction(async (tx) => {
    // Replace line items wholesale — simplest correct approach for an edit.
    await tx.supplyItem.deleteMany({ where: { supplyId: id } });

    return tx.supply.update({
      where: { id },
      data: {
        companyId,
        supplyDate,
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
            productId: it.productId,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            total: it.total,
          })),
        },
      },
      select: listSelect(),
    });
  });

  revalidatePath("/supplies");
  return toListDTO(updated);
}

export async function deleteSupply(id: string): Promise<{ success: true }> {
  await requireSession();
  if (!id) throw new Error("Supply id is required");

  const existing = await prisma.supply.findUnique({
    where: { id },
    select: { invoiceGenerated: true },
  });
  if (!existing) throw new Error("Supply not found");
  if (existing.invoiceGenerated)
    throw new Error("This supply has an invoice and cannot be deleted");

  await prisma.$transaction(async (tx) => {
    await tx.supplyItem.deleteMany({ where: { supplyId: id } });
    await tx.supply.delete({ where: { id } });
  });

  revalidatePath("/supplies");
  return { success: true };
}
