"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { BreadcrumbNav } from "./breadcrumb-nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Parameters<typeof BreadcrumbNav>[0]["items"];
}

export function DashboardLayout({
  children,
  title = "Dashboard",
  breadcrumbs = [],
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Restore the collapsed preference (desktop only) from a previous session.
  useEffect(() => {
    setCollapsed(localStorage.getItem("sidebar-collapsed") === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sidebar-collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        collapsed={collapsed}
      />

      <div className="flex h-screen flex-1 flex-col overflow-hidden">
        <TopNav
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          onToggleCollapse={toggleCollapsed}
          collapsed={collapsed}
        />

        {breadcrumbs.length > 0 && <BreadcrumbNav items={breadcrumbs} />}

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
