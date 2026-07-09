"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { PRODUCT_UNIT_VALUES } from "@/lib/units";

export type ProductStatus = "ACTIVE" | "INACTIVE";

export type ProductVariantDTO = {
  id: string;
  name: string;
  sku: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  status: ProductStatus;
};

export type ProductDTO = {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  categoryName: string;
  description: string;
  status: ProductStatus;
  createdAt: string;
  variants: ProductVariantDTO[];
};

export type ProductVariantInput = {
  id?: string; // present when editing an existing variant
  name: string;
  sku: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  status?: ProductStatus;
};

export type ProductInput = {
  name: string;
  brand?: string;
  categoryId: string;
  description?: string;
  status: ProductStatus;
  variants: ProductVariantInput[];
};

const productInclude = {
  category: { select: { name: true } },
  variants: { orderBy: { createdAt: "asc" } },
} as const;

async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");
  return session;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toDTO(product: any): ProductDTO {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand ?? "",
    categoryId: product.categoryId,
    categoryName: product.category.name,
    description: product.description ?? "",
    status: product.status,
    createdAt: product.createdAt.toISOString(),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variants: product.variants.map((v: any) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      unit: v.unit,
      purchasePrice: Number(v.purchasePrice),
      sellingPrice: Number(v.sellingPrice),
      status: v.status,
    })),
  };
}

type CleanVariant = {
  id?: string;
  name: string;
  sku: string;
  unit: string;
  purchasePrice: number;
  sellingPrice: number;
  status: ProductStatus;
};

function validate(input: ProductInput): {
  name: string;
  brand: string | null;
  categoryId: string;
  description: string | null;
  status: ProductStatus;
  variants: CleanVariant[];
} {
  const name = input.name?.trim();
  const categoryId = input.categoryId?.trim();

  if (!name) throw new Error("Product name is required");
  if (!categoryId) throw new Error("Category is required");
  if (!Array.isArray(input.variants) || input.variants.length === 0)
    throw new Error("Add at least one variant");

  const seenSkus = new Set<string>();
  const variants: CleanVariant[] = input.variants.map((v, i) => {
    const vName = v.name?.trim();
    const sku = v.sku?.trim();
    const unit = v.unit?.trim();
    const purchasePrice = Number(v.purchasePrice);
    const sellingPrice = Number(v.sellingPrice);

    if (!vName) throw new Error(`Variant ${i + 1}: name is required`);
    if (!sku) throw new Error(`Variant ${i + 1}: SKU is required`);
    const skuKey = sku.toLowerCase();
    if (seenSkus.has(skuKey))
      throw new Error(`Duplicate SKU "${sku}" among variants`);
    seenSkus.add(skuKey);
    if (!unit || !PRODUCT_UNIT_VALUES.includes(unit))
      throw new Error(`Variant ${i + 1}: invalid unit`);
    if (!Number.isFinite(purchasePrice) || purchasePrice < 0)
      throw new Error(`Variant ${i + 1}: purchase price must be non-negative`);
    if (!Number.isFinite(sellingPrice) || sellingPrice < 0)
      throw new Error(`Variant ${i + 1}: selling price must be non-negative`);

    return {
      id: v.id,
      name: vName,
      sku,
      unit,
      purchasePrice,
      sellingPrice,
      status: v.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    };
  });

  return {
    name,
    brand: input.brand?.trim() || null,
    categoryId,
    description: input.description?.trim() || null,
    status: input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    variants,
  };
}

// Prisma throws P2002 on a unique-constraint clash (variant sku).
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function skuClashMessage(): string {
  return "A variant with that SKU already exists";
}

export async function getProducts(): Promise<ProductDTO[]> {
  await requireSession();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: productInclude,
  });

  return products.map(toDTO);
}

export async function createProduct(input: ProductInput): Promise<ProductDTO> {
  await requireSession();

  const data = validate(input);

  let product;
  try {
    product = await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        categoryId: data.categoryId,
        description: data.description,
        status: data.status,
        variants: {
          create: data.variants.map((v) => ({
            name: v.name,
            sku: v.sku,
            unit: v.unit,
            purchasePrice: v.purchasePrice,
            sellingPrice: v.sellingPrice,
            status: v.status,
          })),
        },
      },
      include: productInclude,
    });
  } catch (error) {
    if (isUniqueViolation(error)) throw new Error(skuClashMessage());
    throw error;
  }

  revalidatePath("/products");
  return toDTO(product);
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ProductDTO> {
  await requireSession();
  if (!id) throw new Error("Product id is required");

  const data = validate(input);

  const existing = await prisma.productVariant.findMany({
    where: { productId: id },
    select: { id: true, name: true },
  });
  const existingIds = new Set(existing.map((v) => v.id));
  const keptIds = new Set(
    data.variants.filter((v) => v.id).map((v) => v.id as string)
  );

  // Variants removed in the form — allowed only if unreferenced by supplies.
  const toDelete = existing.filter((v) => !keptIds.has(v.id));
  if (toDelete.length) {
    const referenced = await prisma.supplyItem.findMany({
      where: { variantId: { in: toDelete.map((v) => v.id) } },
      select: { variantId: true },
    });
    if (referenced.length) {
      const blocked = toDelete.find((v) =>
        referenced.some((r) => r.variantId === v.id)
      );
      throw new Error(
        `Variant "${blocked?.name}" is used in supplies and can't be removed`
      );
    }
  }

  try {
    const product = await prisma.$transaction(async (tx) => {
      // Update parent fields.
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          brand: data.brand,
          categoryId: data.categoryId,
          description: data.description,
          status: data.status,
        },
      });

      // Delete removed variants.
      if (toDelete.length) {
        await tx.productVariant.deleteMany({
          where: { id: { in: toDelete.map((v) => v.id) } },
        });
      }

      // Update existing + create new variants.
      for (const v of data.variants) {
        if (v.id && existingIds.has(v.id)) {
          await tx.productVariant.update({
            where: { id: v.id },
            data: {
              name: v.name,
              sku: v.sku,
              unit: v.unit,
              purchasePrice: v.purchasePrice,
              sellingPrice: v.sellingPrice,
              status: v.status,
            },
          });
        } else {
          await tx.productVariant.create({
            data: {
              productId: id,
              name: v.name,
              sku: v.sku,
              unit: v.unit,
              purchasePrice: v.purchasePrice,
              sellingPrice: v.sellingPrice,
              status: v.status,
            },
          });
        }
      }

      return tx.product.findUniqueOrThrow({
        where: { id },
        include: productInclude,
      });
    });

    revalidatePath("/products");
    return toDTO(product);
  } catch (error) {
    if (isUniqueViolation(error)) throw new Error(skuClashMessage());
    throw error;
  }
}

export async function deleteProduct(id: string): Promise<{ success: true }> {
  await requireSession();
  if (!id) throw new Error("Product id is required");

  const referenced = await prisma.supplyItem.count({
    where: { variant: { productId: id } },
  });
  if (referenced > 0)
    throw new Error(
      "This product has variants used in supplies and cannot be deleted."
    );

  try {
    await prisma.$transaction(async (tx) => {
      await tx.productVariant.deleteMany({ where: { productId: id } });
      await tx.product.delete({ where: { id } });
    });
  } catch {
    throw new Error("Unable to delete this product.");
  }

  revalidatePath("/products");
  return { success: true };
}
