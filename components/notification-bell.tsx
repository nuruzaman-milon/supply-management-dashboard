"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Bell, AlertCircle, Clock, FileWarning, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  getNotifications,
  type NotificationItem,
  type NotificationSeverity,
} from "@/app/actions/notification.actions";

const SEEN_KEY = "notifications-seen-ids";

function loadSeen(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SEEN_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSeen(ids: string[]) {
  try {
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota / private-mode errors
  }
}

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const day = 86400000;
  const abs = Math.abs(diff);
  if (abs < day) return "today";
  const days = Math.floor(abs / day);
  const label = `${days} day${days === 1 ? "" : "s"}`;
  return diff >= 0 ? `${label} ago` : `in ${label}`;
}

const SEVERITY_STYLES: Record<
  NotificationSeverity,
  { icon: React.ReactNode; dot: string }
> = {
  high: {
    icon: <AlertCircle className="size-4 text-destructive" />,
    dot: "bg-destructive",
  },
  medium: {
    icon: <Clock className="size-4 text-amber-600" />,
    dot: "bg-amber-500",
  },
  low: {
    icon: <FileWarning className="size-4 text-muted-foreground" />,
    dot: "bg-muted-foreground",
  },
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [seen, setSeen] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(() => {
    setIsLoading(true);
    getNotifications()
      .then(setItems)
      .catch((error) => console.error("Failed to load notifications", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setSeen(loadSeen());
    load();
  }, [load]);

  const unreadCount = items.filter((i) => !seen.includes(i.id)).length;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) load(); // refresh each time it's opened
  };

  const markAllRead = () => {
    const ids = items.map((i) => i.id);
    setSeen(ids);
    saveSeen(ids);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        aria-label="Notifications"
        className="relative inline-flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-secondary"
      >
        <Bell className="size-5 text-foreground" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 gap-0 p-0"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground">
              {items.length} alert{items.length === 1 ? "" : "s"}
            </p>
          </div>
          {items.length > 0 && unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-secondary"
            >
              <Check className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <div className="size-6 animate-spin rounded-full border-2 border-border border-t-primary" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-32 flex-col items-center justify-center gap-2 px-4 text-center">
              <Bell className="size-8 text-muted-foreground opacity-40" />
              <p className="text-sm text-muted-foreground">You&apos;re all caught up</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => {
                const isUnread = !seen.includes(item.id);
                const s = SEVERITY_STYLES[item.severity];
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex gap-3 px-4 py-3 transition-colors hover:bg-secondary",
                        isUnread && "bg-primary/[0.04]",
                      )}
                    >
                      <span className="mt-0.5 shrink-0">{s.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-foreground">
                            {item.title}
                          </p>
                          {isUnread && (
                            <span className={cn("size-2 shrink-0 rounded-full", s.dot)} />
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.message}
                        </p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">
                          {relativeTime(item.timestamp)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
