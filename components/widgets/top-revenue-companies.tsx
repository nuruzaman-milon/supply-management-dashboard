'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import type { TopCompany } from '@/app/actions/dashboard.actions'

function formatAmount(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

export function TopRevenueCompaniesWidget({ companies }: { companies: TopCompany[] }) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Top Revenue Companies</h3>
        <Link href="/companies" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      {companies.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No revenue yet</p>
      ) : (
        <div className="space-y-5">
          {companies.map((company) => (
            <div key={company.id} className="flex items-center justify-between">
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
                <p className="text-sm font-semibold text-foreground">{formatAmount(company.revenue)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
