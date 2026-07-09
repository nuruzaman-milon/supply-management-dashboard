'use client'

import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { AlertTriangle } from 'lucide-react'
import type { DueListDTO } from '@/app/actions/due.actions'

function formatAmount(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

export function OverdueInvoicesWidget({ items }: { items: DueListDTO[] }) {
  return (
    <Card className="border-red-200 bg-red-50 p-6 dark:border-red-900/40 dark:bg-red-950/20">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-5 text-red-600" />
          <h3 className="text-lg font-semibold text-red-900 dark:text-red-300">Overdue Invoices</h3>
        </div>
        <Badge className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200">{items.length}</Badge>
      </div>
      {items.length === 0 ? (
        <p className="py-8 text-center text-sm text-red-700/70 dark:text-red-300/70">No overdue invoices 🎉</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Link
              key={item.invoiceId}
              href="/due-list"
              className="flex items-center justify-between border-b border-red-200 pb-4 last:border-0 dark:border-red-900/40"
            >
              <div className="flex-1">
                <p className="font-medium text-red-900 dark:text-red-300">{item.companyName}</p>
                <p className="text-xs text-red-700 dark:text-red-400">{item.invoiceNo}</p>
              </div>
              <div className="ml-4 text-right">
                <p className="text-sm font-semibold text-red-900 dark:text-red-300">{formatAmount(item.dueAmount)}</p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {item.daysOverdue} day{item.daysOverdue === 1 ? '' : 's'} overdue
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Card>
  )
}
