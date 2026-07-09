"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type CategoryDTO = {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  productCount: number;
  createdAt: string;
};

export type CategoryInput = {
  name: string;
  description?: string;
  status: CategoryStatus;
};

// Category row plus the product count needed for the table.
type CategoryWithCount = {
  id: string;
  name: string;
  description: string | null;
  status: CategoryStatus;
  createdAt: Date;
  _count: { products: number };
};

function toDTO(category: CategoryWithCount): CategoryDTO {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? "",
    status: category.status,
    productCount: category._count.products,
    createdAt: category.createdAt.toISOString(),
  };
}

const countInclude = {
  _count: { select: { products: true } },
} as const;

async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

function validate(input: CategoryInput): {
  name: string;
  description: string | null;
  status: CategoryStatus;
} {
  const name = input.name?.trim();

  if (!name) throw new Error("Category name is required");

  return {
    name,
    description: input.description?.trim() || null,
    status: input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };
}

export async function getCategories(): Promise<CategoryDTO[]> {
  await requireSession();

  const categories = await prisma.category.findMany({
    orderBy: { createdAt: "desc" },
    include: countInclude,
  });

  return categories.map((c) => toDTO(c as unknown as CategoryWithCount));
}

export async function createCategory(
  input: CategoryInput
): Promise<CategoryDTO> {
  await requireSession();

  const data = validate(input);

  const category = await prisma.category.create({
    data,
    include: countInclude,
  });

  revalidatePath("/products/categories");

  return toDTO(category as unknown as CategoryWithCount);
}

export async function updateCategory(
  id: string,
  input: CategoryInput
): Promise<CategoryDTO> {
  await requireSession();

  if (!id) throw new Error("Category id is required");

  const data = validate(input);

  const category = await prisma.category.update({
    where: { id },
    data,
    include: countInclude,
  });

  revalidatePath("/products/categories");

  return toDTO(category as unknown as CategoryWithCount);
}

export async function deleteCategory(id: string): Promise<{ success: true }> {
  await requireSession();

  if (!id) throw new Error("Category id is required");

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new Error(
      "Unable to delete this category. It may still have products assigned to it."
    );
  }

  revalidatePath("/products/categories");

  return { success: true };
}
