"use client";

import {
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Settings,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useRouter } from "next/navigation";
import { logout } from "@/app/actions/auth.actions";

interface TopNavProps {
  title?: string;
  onMenuClick?: () => void;
  onToggleCollapse?: () => void;
  collapsed?: boolean;
}

export function TopNav({
  title = "Dashboard",
  onMenuClick,
  onToggleCollapse,
  collapsed = false,
}: TopNavProps) {
  const { user, isLoading } = useCurrentUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Left Section */}
        <div className="flex flex-1 items-center gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="inline-flex size-10 items-center justify-center rounded-lg hover:bg-secondary md:hidden"
          >
            <Menu className="size-5" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden size-10 items-center justify-center rounded-lg text-foreground hover:bg-secondary md:inline-flex"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-5" />
            ) : (
              <PanelLeftClose className="size-5" />
            )}
          </button>

          {/* Page Title */}
          <div className="hidden md:block">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          </div>

          {/* Search */}
          <div className="flex flex-1 md:flex-none">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <button className="relative inline-flex size-10 items-center justify-center rounded-lg hover:bg-secondary transition-colors">
            <Bell className="size-5 text-foreground" />

            <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
          </button>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-border sm:block" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-secondary">
                {isLoading ? (
                  <>
                    <div className="size-8 rounded-full bg-muted animate-pulse" />
                    <div className="hidden sm:flex sm:flex-col gap-1.5">
                      <div className="h-4 w-16 rounded bg-muted animate-pulse" />
                      <div className="h-4 w-12 rounded bg-muted animate-pulse" />
                    </div>
                  </>
                ) : (
                  <>
                    <Avatar className="size-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <div className="hidden text-left sm:flex sm:flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {user?.username || "John Doe"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user?.role || "Admin"}
                      </span>
                    </div>
                  </>
                )}
                <ChevronDown className="size-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
              {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}

              {/* <DropdownMenuSeparator /> */}

              {/* <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator /> */}

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer hover:bg-black!"
              >
                <LogOut className="mr-2 size-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
