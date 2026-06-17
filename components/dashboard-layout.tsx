'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { TopNav } from './top-nav'
import { BreadcrumbNav, type BreadcrumbNav as BreadcrumbNavType } from './breadcrumb-nav'

interface DashboardLayoutProps {
  children: React.ReactNode
  title?: string
  breadcrumbs?: Parameters<typeof BreadcrumbNav>[0]['items']
}

export function DashboardLayout({
  children,
  title = 'Dashboard',
  breadcrumbs = [],
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden md:ml-0">
        {/* Top Navigation */}
        <TopNav title={title} />

        {/* Breadcrumb */}
        {breadcrumbs.length > 0 && (
          <BreadcrumbNav items={breadcrumbs} />
        )}

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
