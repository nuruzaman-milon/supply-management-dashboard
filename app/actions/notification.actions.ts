"use server";

import { getSession } from "@/lib/session";
import { getDueList } from "@/app/actions/due.actions";

export type NotificationType = "overdue" | "due-soon";
export type NotificationSeverity = "high" | "medium" | "low";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  severity: NotificationSeverity;
  title: string;
  message: string;
  href: string;
  timestamp: string;
};

const DUE_SOON_DAYS = 7;

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysUntil(dateISO: string): number {
  const target = new Date(dateISO);
  target.setHours(0, 0, 0, 0);
  return Math.floor((target.getTime() - startOfToday().getTime()) / 86400000);
}

function formatAmount(value: number): string {
  return "৳" + new Intl.NumberFormat("en-BD", { minimumFractionDigits: 0 }).format(value);
}

export async function getNotifications(): Promise<NotificationItem[]> {
  const session = await getSession();
  if (!session) throw new Error("Not authenticated");

  const items: NotificationItem[] = [];

  // 1 + 2. Overdue and due-soon invoices — reuse the due/overdue math.
  const dues = await getDueList();
  for (const d of dues) {
    if (d.overdue) {
      items.push({
        id: `overdue:${d.invoiceId}`,
        type: "overdue",
        severity: "high",
        title: `Overdue: ${d.invoiceNo}`,
        message: `${d.companyName} — ${formatAmount(d.dueAmount)} overdue by ${d.daysOverdue} day${d.daysOverdue === 1 ? "" : "s"}`,
        href: "/due-list",
        timestamp: d.dueDate,
      });
    } else {
      const until = daysUntil(d.dueDate);
      if (until >= 0 && until <= DUE_SOON_DAYS) {
        items.push({
          id: `due-soon:${d.invoiceId}`,
          type: "due-soon",
          severity: "medium",
          title: `Due soon: ${d.invoiceNo}`,
          message: `${d.companyName} — ${formatAmount(d.dueAmount)} due ${until === 0 ? "today" : `in ${until} day${until === 1 ? "" : "s"}`}`,
          href: "/due-list",
          timestamp: d.dueDate,
        });
      }
    }
  }

  // Sort: overdue (most overdue first) → due-soon (soonest due date first).
  const rank: Record<NotificationType, number> = {
    overdue: 0,
    "due-soon": 1,
  };
  items.sort((a, b) => {
    if (rank[a.type] !== rank[b.type]) return rank[a.type] - rank[b.type];
    return a.timestamp.localeCompare(b.timestamp);
  });

  return items;
}
