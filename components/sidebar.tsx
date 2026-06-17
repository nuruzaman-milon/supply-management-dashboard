'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
  Building2,
  Package,
  Layers,
  FileText,
  Boxes,
  Clock,
  BarChart3,
  Users,
  Settings,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavSection {
  title: string
  items: NavItem[]
}

interface NavItem {
  icon: React.ReactNode
  label: string
  href: string
  badge?: string
}

const navSections: NavSection[] = [
  {
    title: '',
    items: [
      {
        icon: <LayoutDashboard className="size-5" />,
        label: 'Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    title: 'COMPANY MANAGEMENT',
    items: [
      {
        icon: <Building2 className="size-5" />,
        label: 'Companies',
        href: '/companies',
      },
    ],
  },
  {
    title: 'PRODUCT MANAGEMENT',
    items: [
      {
        icon: <Layers className="size-5" />,
        label: 'Categories',
        href: '/categories',
      },
      {
        icon: <Package className="size-5" />,
        label: 'Products',
        href: '/products',
      },
    ],
  },
  {
    title: 'SUPPLY MANAGEMENT',
    items: [
      {
        icon: <Boxes className="size-5" />,
        label: 'Supplies',
        href: '/supplies',
      },
      {
        icon: <Package className="size-5" />,
        label: 'New Supply',
        href: '/supplies/new',
        badge: 'New',
      },
    ],
  },
  {
    title: 'INVOICE MANAGEMENT',
    items: [
      {
        icon: <FileText className="size-5" />,
        label: 'Invoices',
        href: '/invoices',
      },
    ],
  },
  {
    title: 'COLLECTION MANAGEMENT',
    items: [
      {
        icon: <Boxes className="size-5" />,
        label: 'Collections',
        href: '/collections',
      },
    ],
  },
  {
    title: 'DUE MANAGEMENT',
    items: [
      {
        icon: <Clock className="size-5" />,
        label: 'Due List',
        href: '/due-list',
      },
      {
        icon: <Clock className="size-5" />,
        label: 'Overdue List',
        href: '/overdue-list',
      },
    ],
  },
  {
    title: 'REPORTS',
    items: [
      {
        icon: <BarChart3 className="size-5" />,
        label: 'Revenue Report',
        href: '/reports/revenue',
      },
      {
        icon: <BarChart3 className="size-5" />,
        label: 'Collection Report',
        href: '/reports/collection',
      },
      {
        icon: <BarChart3 className="size-5" />,
        label: 'Due Report',
        href: '/reports/due',
      },
    ],
  },
  {
    title: 'USER MANAGEMENT',
    items: [
      {
        icon: <Users className="size-5" />,
        label: 'Users',
        href: '/users',
      },
      {
        icon: <Users className="size-5" />,
        label: 'Roles',
        href: '/roles',
      },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        icon: <Settings className="size-5" />,
        label: 'Settings',
        href: '/settings',
      },
    ],
  },
]

interface SidebarProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function Sidebar({ open = true, onOpenChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(open)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(navSections.slice(1).map((_, i) => i.toString()))
  )

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index.toString())) {
      newExpanded.delete(index.toString())
    } else {
      newExpanded.add(index.toString())
    }
    setExpandedSections(newExpanded)
  }

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
          <div className="space-y-1">
            {navSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="mb-6">
                {section.title && (
                  <div className="mb-3 px-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      {section.items.length > 1 &&
                      section.title &&
                      itemIndex === 0 ? (
                        <button
                          onClick={() => toggleSection(sectionIndex)}
                          className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown
                            className={cn(
                              'size-4 transition-transform',
                              expandedSections.has(sectionIndex.toString()) &&
                                'rotate-180'
                            )}
                          />
                        </button>
                      ) : (
                        <Link
                          href={item.href}
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                        >
                          {item.icon}
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto inline-flex items-center rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
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
