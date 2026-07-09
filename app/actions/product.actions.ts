"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { PRODUCT_UNIT_VALUES } from "@/lib/units";

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type ProductDTO = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  categoryId: string;
  categoryName: string;
  purchasePrice: number;
  sellingPrice: number;
  description: string;
  status: ProductStatus;
  createdAt: string;
};

export type ProductInput = {
  name: string;
  sku: string;
  unit: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  description?: string;
  status: ProductStatus;
};

// Product row with its category name for display.
type ProductWithCategory = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  categoryId: string;
  purchasePrice: unknown;
  sellingPrice: unknown;
  description: string | null;
  status: ProductStatus;
  createdAt: Date;
  category: { name: string };
};

function toDTO(product: ProductWithCategory): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    unit: product.unit,
    categoryId: product.categoryId,
    categoryName: product.category.name,
    purchasePrice: Number(product.purchasePrice),
    sellingPrice: Number(product.sellingPrice),
    description: product.description ?? "",
    status: product.status,
    createdAt: product.createdAt.toISOString(),
  };
}

const categoryInclude = {
  category: { select: { name: true } },
} as const;

async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

function validate(input: ProductInput): {
  name: string;
  sku: string;
  unit: string;
  categoryId: string;
  purchasePrice: number;
  sellingPrice: number;
  description: string | null;
  status: ProductStatus;
} {
  const name = input.name?.trim();
  const sku = input.sku?.trim();
  const unit = input.unit?.trim();
  const categoryId = input.categoryId?.trim();
  const purchasePrice = Number(input.purchasePrice);
  const sellingPrice = Number(input.sellingPrice);

  if (!name) throw new Error("Product name is required");
  if (!sku) throw new Error("SKU is required");
  if (!unit) throw new Error("Unit is required");
  if (!PRODUCT_UNIT_VALUES.includes(unit))
    throw new Error("Invalid unit selected");
  if (!categoryId) throw new Error("Category is required");
  if (!Number.isFinite(purchasePrice) || purchasePrice < 0)
    throw new Error("Purchase price must be a valid non-negative number");
  if (!Number.isFinite(sellingPrice) || sellingPrice < 0)
    throw new Error("Selling price must be a valid non-negative number");

  return {
    name,
    sku,
    unit,
    categoryId,
    purchasePrice,
    sellingPrice,
    description: input.description?.trim() || null,
    status: input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };
}

// Prisma throws P2002 on a unique-constraint clash (here: sku).
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function getProducts(): Promise<ProductDTO[]> {
  await requireSession();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: categoryInclude,
  });

  return products.map((p) => toDTO(p as unknown as ProductWithCategory));
}

export async function createProduct(input: ProductInput): Promise<ProductDTO> {
  await requireSession();

  const data = validate(input);

  let product;
  try {
    product = await prisma.product.create({
      data,
      include: categoryInclude,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(`A product with SKU "${data.sku}" already exists`);
    }
    throw error;
  }

  revalidatePath("/products");

  return toDTO(product as unknown as ProductWithCategory);
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ProductDTO> {
  await requireSession();

  if (!id) throw new Error("Product id is required");

  const data = validate(input);

  let product;
  try {
    product = await prisma.product.update({
      where: { id },
      data,
      include: categoryInclude,
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new Error(`A product with SKU "${data.sku}" already exists`);
    }
    throw error;
  }

  revalidatePath("/products");

  return toDTO(product as unknown as ProductWithCategory);
}

export async function deleteProduct(id: string): Promise<{ success: true }> {
  await requireSession();

  if (!id) throw new Error("Product id is required");

  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    throw new Error(
      "Unable to delete this product. It may be used in existing supplies."
    );
  }

  revalidatePath("/products");

  return { success: true };
}
