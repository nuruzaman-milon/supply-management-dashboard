import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  Package,
  Zap,
  TrendingUp,
  DollarSign,
  CreditCard,
  AlertCircle,
  BarChart3,
  ArrowUpRight,
  ArrowDownLeft,
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

export default function DashboardPage() {
  const kpiStats = [
    {
      label: 'Total Companies',
      value: '28',
      icon: Building2,
      change: '+4.2%',
      positive: true,
    },
    {
      label: 'Total Products',
      value: '1,243',
      icon: Package,
      change: '+12.5%',
      positive: true,
    },
    {
      label: 'Total Supplies',
      value: '8,932',
      icon: Zap,
      change: '+18.3%',
      positive: true,
    },
    {
      label: 'Total Revenue',
      value: '$628,230',
      icon: DollarSign,
      change: '+24.8%',
      positive: true,
    },
    {
      label: 'Monthly Revenue',
      value: '$89,000',
      icon: TrendingUp,
      change: '+15.6%',
      positive: true,
    },
    {
      label: 'Total Collections',
      value: '$542,100',
      icon: CreditCard,
      change: '+19.2%',
      positive: true,
    },
    {
      label: 'Outstanding Due',
      value: '$86,130',
      icon: AlertCircle,
      change: '+5.1%',
      positive: false,
    },
    {
      label: 'Overdue Amount',
      value: '$47,560',
      icon: BarChart3,
      change: '+3.7%',
      positive: false,
    },
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 p-6">
        {/* KPI Cards Grid */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {kpiStats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold text-foreground">
                      {stat.value}
                    </p>
                    <div className="mt-3 flex items-center gap-1">
                      {stat.positive ? (
                        <>
                          <ArrowUpRight className="size-3 text-green-600" />
                          <span className="text-xs font-semibold text-green-600">
                            {stat.change}
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="size-3 text-amber-600" />
                          <span className="text-xs font-semibold text-amber-600">
                            {stat.change}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
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
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Monthly Revenue Trend
            </h3>
            <RevenueTrendChart />
          </Card>

          <Card className="p-6">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Monthly Collection Trend
            </h3>
            <CollectionTrendChart />
          </Card>

          <Card className="p-6 lg:col-span-2">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Revenue vs Collection Comparison
            </h3>
            <RevenueCollectionComparisonChart />
          </Card>
        </div>

        {/* Tables Section */}
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Supplies
              </h3>
              <a href="/supplies" className="text-sm font-medium text-primary hover:underline">
                View all
              </a>
            </div>
            <RecentSuppliesTable />
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Invoices
              </h3>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                View all
              </a>
            </div>
            <RecentInvoicesTable />
          </Card>

          <Card className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Collections
              </h3>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                View all
              </a>
            </div>
            <RecentCollectionsTable />
          </Card>
        </div>

        {/* Widgets Section */}
        <div className="grid gap-6 lg:grid-cols-3">
          <TopRevenueCompaniesWidget />
          <UpcomingDuePaymentsWidget />
          <OverdueInvoicesWidget />
        </div>
      </div>
    </DashboardLayout>
  )
}
