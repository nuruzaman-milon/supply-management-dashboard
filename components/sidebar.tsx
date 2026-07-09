"use client";

import Link from "next/link";
import {
  X,
  LayoutDashboard,
  Building2,
  Package,
  Layers,
  FileText,
  Boxes,
  Clock,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="size-5" />,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: <Building2 className="size-5" />,
    label: "Companies",
    href: "/companies",
  },
  {
    icon: <Layers className="size-5" />,
    label: "Categories",
    href: "/products/categories",
  },
  {
    icon: <Package className="size-5" />,
    label: "Products",
    href: "/products",
  },
  {
    icon: <Boxes className="size-5" />,
    label: "Supplies",
    href: "/supplies",
  },
  {
    icon: <FileText className="size-5" />,
    label: "Invoices",
    href: "/invoices",
  },
  {
    icon: <Package className="size-5" />,
    label: "Collections",
    href: "/collections",
  },
  {
    icon: <Clock className="size-5" />,
    label: "Due Management",
    href: "/due-list",
  },
  {
    icon: <Settings className="size-5" />,
    label: "Settings",
    href: "/settings",
  },
];

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collapsed?: boolean;
}

export function Sidebar({ open, onOpenChange, collapsed = false }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Pick the most specific matching nav item so /products/categories
  // highlights "Categories" and not also "Products".
  const activeHref = navItems
    .filter(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    )
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-all duration-300 ease-in-out md:relative md:z-auto",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          collapsed ? "md:w-16" : "md:w-64",
        )}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center justify-between border-b border-border px-6 py-5",
            collapsed && "md:justify-center md:px-3",
          )}
        >
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary font-semibold text-primary-foreground">
              SM
            </div>

            <div className={cn(collapsed && "md:hidden")}>
              <h1 className="text-sm font-semibold whitespace-nowrap">
                Supply Management
              </h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <button onClick={() => onOpenChange(false)} className="md:hidden">
            <X className="size-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = item.href === activeHref;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={collapsed ? item.label : undefined}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary",
                    collapsed && "md:justify-center md:px-2",
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className={cn("whitespace-nowrap", collapsed && "md:hidden")}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className={cn("text-center", collapsed && "md:hidden")}>
            <p className="text-xs text-muted-foreground">Supply Management</p>
            <p className="text-xs text-muted-foreground">v1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
