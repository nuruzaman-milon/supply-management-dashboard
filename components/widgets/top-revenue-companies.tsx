'use client'

import { Card } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

const companies = [
  { name: 'Acme Corporation', revenue: '$156,230', percentage: 24.8, trend: '+12.5%' },
  { name: 'Tech Solutions Ltd', revenue: '$98,450', percentage: 15.6, trend: '+8.2%' },
  { name: 'Global Enterprises', revenue: '$87,920', percentage: 13.9, trend: '+5.1%' },
  { name: 'Industry Leaders Inc', revenue: '$76,340', percentage: 12.1, trend: '+3.7%' },
  { name: 'Market Dynamics', revenue: '$62,810', percentage: 10.0, trend: '+2.3%' },
]

export function TopRevenueCompaniesWidget() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Top Revenue Companies</h3>
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-5">
        {companies.map((company, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-medium text-foreground">{company.name}</p>
              <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-secondary">
                <div
                  className="bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${company.percentage}%` }}
                />
              </div>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-semibold text-foreground">{company.revenue}</p>
              <p className="text-xs text-green-600 flex items-center justify-end gap-1">
                <TrendingUp className="size-3" />
                {company.trend}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
