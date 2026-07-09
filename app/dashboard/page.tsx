'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import {
  Building2,
  Package,
  Zap,
  TrendingUp,
  DollarSign,
  CreditCard,
  AlertCircle,
  BarChart3,
  type LucideIcon,
} from 'lucide-react'
import { RevenueTrendChart } from '@/components/charts/revenue-trend'
import { CollectionTrendChart } from '@/components/charts/collection-trend'
import { RevenueCollectionComparisonChart } from '@/components/charts/revenue-collection-comparison'
import { RecentSuppliesTable } from '@/components/tables/recent-supplies'
import { RecentInvoicesTable } from '@/components/tables/recent-invoices'
import { RecentCollectionsTable } from '@/components/tables/recent-collections'
import { TopRevenueCompaniesWidget } from '@/components/widgets/top-revenue-companies'
import { UpcomingDuePaymentsWidget } from '@/components/widgets/upcoming-due-payments'
import { OverdueInvoicesWidget } from '@/components/widgets/overdue-invoices'
import {
  getDashboardData,
  type DashboardData,
} from '@/app/actions/dashboard.actions'

function formatCurrency(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

function formatNumber(v: number) {
  return new Intl.NumberFormat('en-BD').format(v)
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    getDashboardData()
      .then((d) => {
        if (active) setData(d)
      })
      .catch((error) => {
        console.error('Failed to load dashboard', error)
        alert((error as Error).message || 'Failed to load dashboard')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const kpiStats: {
    label: string
    value: string
    icon: LucideIcon
    accent?: 'danger'
  }[] = data
    ? [
        { label: 'Total Companies', value: formatNumber(data.kpis.companies), icon: Building2 },
        { label: 'Total Products', value: formatNumber(data.kpis.products), icon: Package },
        { label: 'Total Supplies', value: formatNumber(data.kpis.supplies), icon: Zap },
        { label: 'Total Revenue', value: formatCurrency(data.kpis.totalRevenue), icon: DollarSign },
        { label: 'This Month Revenue', value: formatCurrency(data.kpis.monthlyRevenue), icon: TrendingUp },
        { label: 'Total Collections', value: formatCurrency(data.kpis.totalCollections), icon: CreditCard },
        { label: 'Outstanding Due', value: formatCurrency(data.kpis.outstandingDue), icon: AlertCircle, accent: 'danger' },
        { label: 'Overdue Amount', value: formatCurrency(data.kpis.overdueAmount), icon: BarChart3, accent: 'danger' },
      ]
    : []

  if (isLoading || !data) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex h-[70vh] items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block">
              <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
            </div>
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 p-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpiStats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="p-5 transition-shadow hover:shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      {stat.label}
                    </p>
                    <p
                      className={`mt-2 text-2xl font-bold ${
                        stat.accent === 'danger' ? 'text-amber-600' : 'text-foreground'
                      }`}
                    >
                      {stat.value}
                    </p>
                  </div>
                  <div className="rounded-lg bg-secondary p-2.5">
                    <Icon className="size-5 text-primary" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-6 text-lg font-semibold text-foreground">Monthly Revenue Trend</h3>
            <RevenueTrendChart data={data.monthly} />
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-lg font-semibold text-foreground">Monthly Collection Trend</h3>
            <CollectionTrendChart data={data.monthly} />
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="mb-6 text-lg font-semibold text-foreground">Revenue vs Collection Comparison</h3>
            <RevenueCollectionComparisonChart data={data.monthly} />
          </Card>
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Supplies</h3>
              <Link href="/supplies" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <RecentSuppliesTable supplies={data.recentSupplies} />
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Invoices</h3>
              <Link href="/invoices" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <RecentInvoicesTable invoices={data.recentInvoices} />
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Recent Collections</h3>
              <Link href="/collections" className="text-sm font-medium text-primary hover:underline">
                View all
              </Link>
            </div>
            <RecentCollectionsTable collections={data.recentCollections} />
          </Card>
        </div>

        {/* Widgets Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <TopRevenueCompaniesWidget companies={data.topCompanies} />
          <UpcomingDuePaymentsWidget items={data.upcomingDue} />
          <OverdueInvoicesWidget items={data.overdueInvoices} />
        </div>
      </div>
    </DashboardLayout>
  )
}
