"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type CompanyStatus = "ACTIVE" | "INACTIVE";

export type CompanyDTO = {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  notes: string;
  status: CompanyStatus;
  totalRevenue: number;
  totalDue: number;
  createdAt: string;
};

export type CompanyInput = {
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  notes?: string;
  status: CompanyStatus;
};

// Company row with the invoice/collection data needed to derive revenue & due.
type CompanyWithFinancials = {
  id: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: CompanyStatus;
  createdAt: Date;
  invoices: {
    totalAmount: unknown;
    collections: { amount: unknown }[];
  }[];
};

function toDTO(company: CompanyWithFinancials): CompanyDTO {
  const totalRevenue = company.invoices.reduce(
    (sum, invoice) => sum + Number(invoice.totalAmount),
    0
  );

  const totalCollected = company.invoices.reduce(
    (sum, invoice) =>
      sum +
      invoice.collections.reduce((cSum, c) => cSum + Number(c.amount), 0),
    0
  );

  return {
    id: company.id,
    name: company.companyName,
    contactPerson: company.contactPerson,
    phone: company.phone,
    email: company.email ?? "",
    address: company.address ?? "",
    notes: company.notes ?? "",
    status: company.status,
    totalRevenue,
    totalDue: totalRevenue - totalCollected,
    createdAt: company.createdAt.toISOString(),
  };
}

const financialsInclude = {
  invoices: {
    select: {
      totalAmount: true,
      collections: { select: { amount: true } },
    },
  },
} as const;

async function requireSession() {
  const session = await getSession();
  if (!session) {
    throw new Error("Not authenticated");
  }
  return session;
}

function validate(input: CompanyInput): {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string | null;
  address: string | null;
  notes: string | null;
  status: CompanyStatus;
} {
  const name = input.name?.trim();
  const contactPerson = input.contactPerson?.trim();
  const phone = input.phone?.trim();

  if (!name) throw new Error("Company name is required");
  if (!contactPerson) throw new Error("Contact person is required");
  if (!phone) throw new Error("Phone number is required");

  return {
    companyName: name,
    contactPerson,
    phone,
    email: input.email?.trim() || null,
    address: input.address?.trim() || null,
    notes: input.notes?.trim() || null,
    status: input.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };
}

export async function getCompanies(): Promise<CompanyDTO[]> {
  await requireSession();

  const companies = await prisma.company.findMany({
    orderBy: { createdAt: "desc" },
    include: financialsInclude,
  });

  return companies.map((c) => toDTO(c as unknown as CompanyWithFinancials));
}

export async function createCompany(input: CompanyInput): Promise<CompanyDTO> {
  await requireSession();

  const data = validate(input);

  const company = await prisma.company.create({
    data,
    include: financialsInclude,
  });

  revalidatePath("/companies");

  return toDTO(company as unknown as CompanyWithFinancials);
}

export async function updateCompany(
  id: string,
  input: CompanyInput
): Promise<CompanyDTO> {
  await requireSession();

  if (!id) throw new Error("Company id is required");

  const data = validate(input);

  const company = await prisma.company.update({
    where: { id },
    data,
    include: financialsInclude,
  });

  revalidatePath("/companies");

  return toDTO(company as unknown as CompanyWithFinancials);
}

export async function deleteCompany(id: string): Promise<{ success: true }> {
  await requireSession();

  if (!id) throw new Error("Company id is required");

  try {
    await prisma.company.delete({ where: { id } });
  } catch {
    throw new Error(
      "Unable to delete this company. It may have related supplies or invoices."
    );
  }

  revalidatePath("/companies");

  return { success: true };
}
