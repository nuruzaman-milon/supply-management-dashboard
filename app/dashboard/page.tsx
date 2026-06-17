import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Package,
  TrendingUp,
  ShoppingCart,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react'

export default function DashboardPage() {
  const stats = [
    {
      label: 'Total Supplies',
      value: '2,543',
      icon: Package,
      change: '+12.5%',
      positive: true,
    },
    {
      label: 'Total Revenue',
      value: '$45,231',
      icon: TrendingUp,
      change: '+8.2%',
      positive: true,
    },
    {
      label: 'Active Orders',
      value: '342',
      icon: ShoppingCart,
      change: '-2.4%',
      positive: false,
    },
    {
      label: 'Overdue Items',
      value: '24',
      icon: AlertCircle,
      change: '+1.2%',
      positive: false,
    },
  ]

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-8 p-6">
        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      {stat.positive ? (
                        <>
                          <ArrowUpRight className="size-4 text-green-600" />
                          <span className="text-sm font-medium text-green-600">
                            {stat.change}
                          </span>
                        </>
                      ) : (
                        <>
                          <ArrowDownLeft className="size-4 text-amber-600" />
                          <span className="text-sm font-medium text-amber-600">
                            {stat.change}
                          </span>
                        </>
                      )}
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg bg-secondary p-3">
                    <Icon className="size-6 text-primary" />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity & Quick Actions */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 p-6">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Recent Activity
              </h3>
              <a href="#" className="text-sm font-medium text-primary hover:underline">
                View all
              </a>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      Order #{Math.random().toString(36).slice(2, 8).toUpperCase()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supply delivery updated
                    </p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="mb-6 text-lg font-semibold text-foreground">
              Quick Stats
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Companies', value: '28' },
                { label: 'Categories', value: '12' },
                { label: 'Users', value: '156' },
                { label: 'Roles', value: '4' },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {stat.label}
                  </span>
                  <span className="font-semibold text-foreground">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
