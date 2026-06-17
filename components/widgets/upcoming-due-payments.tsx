'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

const upcomingPayments = [
  { invoice: 'INV002', company: 'Tech Solutions Ltd', amount: '$8,920', dueIn: '5 days', dueDate: '2024-02-20' },
  { invoice: 'INV005', company: 'Professional Services', amount: '$9,650', dueIn: '8 days', dueDate: '2024-02-23' },
  { invoice: 'INV006', company: 'Creative Agency', amount: '$7,340', dueIn: '12 days', dueDate: '2024-02-27' },
  { invoice: 'INV008', company: 'Digital Solutions', amount: '$14,200', dueIn: '15 days', dueDate: '2024-03-01' },
]

export function UpcomingDuePaymentsWidget() {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Due Payments</h3>
        <a href="#" className="text-sm font-medium text-primary hover:underline">
          View all
        </a>
      </div>
      <div className="space-y-4">
        {upcomingPayments.map((payment) => (
          <div key={payment.invoice} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
            <div className="flex-1">
              <p className="font-medium text-foreground">{payment.company}</p>
              <p className="text-xs text-muted-foreground">{payment.invoice}</p>
            </div>
            <div className="ml-4 text-right">
              <p className="text-sm font-semibold text-foreground">{payment.amount}</p>
              <div className="mt-1 flex items-center justify-end gap-1 text-xs text-amber-600">
                <Clock className="size-3" />
                {payment.dueIn}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
