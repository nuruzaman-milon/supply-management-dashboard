'use client'

import { Card } from '@/components/ui/card'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import type { DueListDTO } from '@/app/actions/due.actions'

function formatAmount(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

function dueInLabel(dueDateISO: string) {
  const due = new Date(dueDateISO)
  due.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const days = Math.round((due.getTime() - today.getTime()) / 86400000)
  if (days <= 0) return 'due today'
  return `in ${days} day${days === 1 ? '' : 's'}`
}

export function UpcomingDuePaymentsWidget({ items }: { items: DueListDTO[] }) {
  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Due Payments</h3>
        <Link href="/due-list" className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">No upcoming dues</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.invoiceId} className="flex items-center justify-between border-b border-border pb-4 last:border-0">
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.companyName}</p>
                <p className="text-xs text-muted-foreground">{item.invoiceNo}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-foreground">{formatAmount(item.dueAmount)}</p>
                <div className="mt-1 flex items-center justify-end gap-1 text-xs text-amber-600">
                  <Clock className="size-3" />
                  {dueInLabel(item.dueDate)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
