'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Package,
  Layers,
  FileText,
  Boxes,
  Clock,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
}

const navItems: NavItem[] = [
  {
    icon: <LayoutDashboard className="size-5" />,
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    icon: <Building2 className="size-5" />,
    label: 'Company',
    href: '/companies',
  },
  {
    icon: <Layers className="size-5" />,
    label: 'Category',
    href: '/products/categories',
  },
  {
    icon: <Package className="size-5" />,
    label: 'Product',
    href: '/products',
  },
  {
    icon: <Boxes className="size-5" />,
    label: 'Supplies',
    href: '/supplies',
  },
  {
    icon: <FileText className="size-5" />,
    label: 'Invoices',
    href: '/invoices',
  },
  {
    icon: <Package className="size-5" />,
    label: 'Collections',
    href: '/collections',
  },
  {
    icon: <Clock className="size-5" />,
    label: 'Due Management',
    href: '/due-list',
  },
  {
    icon: <Settings className="size-5" />,
    label: 'Settings',
    href: '/settings',
  },
]

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ open = true, onOpenChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(open)

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => handleOpenChange(!isOpen)}
        className="fixed left-4 top-4 z-40 inline-flex items-center justify-center rounded-lg bg-white p-2 text-foreground md:hidden"
      >
        {isOpen ? (
          <X className="size-6" />
        ) : (
          <Menu className="size-6" />
        )}
      </button>

      {/* Sidebar backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => handleOpenChange(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo/Brand */}
        <div className="flex items-center gap-3 border-b border-border px-6 py-6">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            SM
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-foreground">Supply</h1>
            <p className="text-xs text-muted-foreground">Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-6">
          <div className="space-y-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <p className="text-xs text-muted-foreground text-center">
            v1.0.0
          </p>
        </div>
      </aside>
    </>
  )
}
