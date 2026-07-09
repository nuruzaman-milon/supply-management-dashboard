"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getInvoices, type InvoiceListDTO } from "@/app/actions/invoice.actions";
import {
  getCollections,
  type CollectionListDTO,
} from "@/app/actions/collection.actions";
import { getCompanies } from "@/app/actions/company.actions";
import { getSupplies, type SupplyListDTO } from "@/app/actions/supply.actions";
import { getDueList, type DueListDTO } from "@/app/actions/due.actions";

export type DashboardKpis = {
  companies: number;
  products: number;
  supplies: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalCollections: number;
  outstandingDue: number;
  overdueAmount: number;
};

export type MonthlyPoint = {
  month: string; // short label, e.g. "Jan"
  revenue: number;
  collection: number;
};

export type TopCompany = {
  id: string;
  name: string;
  revenue: number;
  percentage: number; // relative to the top company, for the bar width
};

export type DashboardData = {
  kpis: DashboardKpis;
  monthly: MonthlyPoint[];
  recentSupplies: SupplyListDTO[];
  recentInvoices: InvoiceListDTO[];
  recentCollections: CollectionListDTO[];
  topCompanies: TopCompany[];
  upcomingDue: DueListDTO[];
  overdueInvoices: DueListDTO[];
};

function monthKey(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth()}`;
}

export async function getDashboardData(): Promise<DashboardData> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const [invoices, collections, companies, supplies, dues, productCount] =
    await Promise.all([
      getInvoices(),
      getCollections(),
      getCompanies(),
      getSupplies(),
      getDueList(),
      prisma.product.count(),
    ]);

  // ---- Monthly buckets (last 12 months incl. current) ----
  const now = new Date();
  const monthly: MonthlyPoint[] = [];
  const indexByKey = new Map<string, number>();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    indexByKey.set(monthKey(d), monthly.length);
    monthly.push({
      month: d.toLocaleString("en-US", { month: "short" }),
      revenue: 0,
      collection: 0,
    });
  }
  for (const inv of invoices) {
    const idx = indexByKey.get(monthKey(new Date(inv.invoiceDate)));
    if (idx !== undefined) monthly[idx].revenue += inv.totalAmount;
  }
  for (const c of collections) {
    const idx = indexByKey.get(monthKey(new Date(c.collectionDate)));
    if (idx !== undefined) monthly[idx].collection += c.amount;
  }

  // ---- KPIs ----
  const totalRevenue = invoices.reduce((s, i) => s + i.totalAmount, 0);
  const totalCollections = collections.reduce((s, c) => s + c.amount, 0);
  const outstandingDue = dues.reduce((s, d) => s + d.dueAmount, 0);
  const overdueAmount = dues
    .filter((d) => d.overdue)
    .reduce((s, d) => s + d.dueAmount, 0);

  const kpis: DashboardKpis = {
    companies: companies.length,
    products: productCount,
    supplies: supplies.length,
    totalRevenue,
    monthlyRevenue: monthly[monthly.length - 1]?.revenue ?? 0,
    totalCollections,
    outstandingDue,
    overdueAmount,
  };

  // ---- Top revenue companies ----
  const ranked = [...companies]
    .filter((c) => c.totalRevenue > 0)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5);
  const maxRevenue = ranked[0]?.totalRevenue ?? 0;
  const topCompanies: TopCompany[] = ranked.map((c) => ({
    id: c.id,
    name: c.name,
    revenue: c.totalRevenue,
    percentage: maxRevenue > 0 ? Math.round((c.totalRevenue / maxRevenue) * 100) : 0,
  }));

  return {
    kpis,
    monthly,
    recentSupplies: supplies.slice(0, 5),
    recentInvoices: invoices.slice(0, 5),
    recentCollections: collections.slice(0, 5),
    topCompanies,
    upcomingDue: dues.filter((d) => !d.overdue).slice(0, 5),
    overdueInvoices: dues.filter((d) => d.overdue).slice(0, 5),
  };
}
