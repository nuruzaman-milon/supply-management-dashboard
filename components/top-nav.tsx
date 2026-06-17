'use client'

import { Bell, Search, ChevronDown, LogOut, Settings } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface TopNavProps {
  title?: string
}

export function TopNav({ title = 'Dashboard' }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        {/* Left side - Title and search */}
        <div className="flex flex-1 items-center gap-4">
          <div className="hidden md:flex md:flex-1">
            <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex flex-1 md:flex-none">
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative inline-flex size-9 items-center justify-center rounded-lg hover:bg-secondary transition-colors">
            <Bell className="size-5 text-foreground" />
            <span className="absolute top-1 right-1 size-2 rounded-full bg-destructive" />
          </button>

          {/* Divider */}
          <div className="hidden h-6 w-px bg-border sm:block" />

          {/* User profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-lg hover:bg-secondary transition-colors px-2 py-1.5">
                <Avatar className="size-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Supply" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:flex sm:flex-col">
                  <span className="text-sm font-medium text-foreground">
                    John Doe
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Admin
                  </span>
                </div>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                <Settings className="size-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-destructive">
                <LogOut className="size-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
