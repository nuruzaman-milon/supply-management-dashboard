'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertTriangle } from 'lucide-react'

const overdueInvoices = [
  { invoice: 'INV003', company: 'Global Enterprises', amount: '$15,780', daysOverdue: 11, dueDate: '2024-02-10' },
  { invoice: 'INV009', company: 'Enterprise Group', amount: '$19,450', daysOverdue: 7, dueDate: '2024-02-14' },
  { invoice: 'INV012', company: 'Strategic Partners', amount: '$12,340', daysOverdue: 3, dueDate: '2024-02-18' },
]

export function OverdueInvoicesWidget() {
  return (
    <Card className="border-red-200 bg-red-50 p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900">Overdue Invoices</h3>
        </div>
        <Badge className="bg-red-200 text-red-800">{overdueInvoices.length}</Badge>
      </div>
      <div className="space-y-4">
        {overdueInvoices.map((invoice) => (
          <div key={invoice.invoice} className="flex items-center justify-between border-b border-red-200 pb-4 last:border-0">
            <div className="flex-1">
              <p className="font-medium text-red-900">{invoice.company}</p>
              <p className="text-xs text-red-700">{invoice.invoice}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-semibold text-red-900">{invoice.amount}</p>
              <p className="text-xs text-red-600">{invoice.daysOverdue} days overdue</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
