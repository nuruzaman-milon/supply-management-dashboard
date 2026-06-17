'use client'

import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronRight, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'
import Link from 'next/link'

const reports = [
  {
    id: 1,
    title: 'Revenue Report',
    description: 'Analyze your revenue trends and performance metrics',
    icon: DollarSign,
    href: '/reports/revenue',
    color: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    id: 2,
    title: 'Collection Report',
    description: 'Track collection performance and payment methods',
    icon: TrendingUp,
    href: '/reports/collection',
    color: 'bg-green-100',
    textColor: 'text-green-600',
  },
  {
    id: 3,
    title: 'Due Report',
    description: 'Analyze outstanding dues and aging analysis',
    icon: AlertCircle,
    href: '/reports/due',
    color: 'bg-red-100',
    textColor: 'text-red-600',
  },
]

export default function ReportsPage() {
  return (
    <DashboardLayout title="Reports">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-sm text-muted-foreground">
            Access detailed analytics and business insights
          </p>
        </div>

        {/* Reports Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon
            return (
              <Link key={report.id} href={report.href}>
                <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${report.color} p-3 rounded-lg`}>
                      <Icon className={`size-6 ${report.textColor}`} />
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {report.title}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    {report.description}
                  </p>
                  <div className="flex items-center text-primary hover:text-primary/80">
                    <span className="text-sm font-medium">View Report</span>
                    <ChevronRight className="size-4 ml-2" />
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Total Reports Generated
            </p>
            <p className="text-3xl font-bold text-foreground">1,247</p>
            <p className="text-xs text-muted-foreground mt-2">
              In the last 12 months
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Average Export Time
            </p>
            <p className="text-3xl font-bold text-foreground">2.3s</p>
            <p className="text-xs text-muted-foreground mt-2">
              Export to PDF/Excel
            </p>
          </Card>

          <Card className="p-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Last Generated
            </p>
            <p className="text-3xl font-bold text-foreground">Today</p>
            <p className="text-xs text-muted-foreground mt-2">
              Revenue Report at 10:30 AM
            </p>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
