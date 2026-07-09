'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { InvoiceListDTO } from '@/app/actions/invoice.actions'

const statusColors: Record<string, string> = {
  PAID: 'bg-green-100 text-green-800',
  PARTIALLY_PAID: 'bg-blue-100 text-blue-800',
  UNPAID: 'bg-amber-100 text-amber-800',
  DRAFT: 'bg-gray-100 text-gray-800',
  OVERDUE: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
}

const statusLabels: Record<string, string> = {
  PAID: 'Paid',
  PARTIALLY_PAID: 'Partially Paid',
  UNPAID: 'Unpaid',
  DRAFT: 'Draft',
  CANCELLED: 'Cancelled',
}

function formatAmount(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

export function RecentInvoicesTable({ invoices }: { invoices: InvoiceListDTO[] }) {
  if (invoices.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No invoices yet</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary">
            <TableHead className="font-semibold text-foreground">Invoice No</TableHead>
            <TableHead className="font-semibold text-foreground">Company</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Due</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground">Due Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => {
            const label = invoice.isOverdue ? 'Overdue' : statusLabels[invoice.status] || invoice.status
            const color = invoice.isOverdue ? statusColors.OVERDUE : statusColors[invoice.status] || 'bg-gray-100 text-gray-800'
            return (
              <TableRow key={invoice.id} className="border-border hover:bg-secondary/50">
                <TableCell className="font-mono text-sm font-medium text-foreground">{invoice.invoiceNo}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{invoice.companyName}</TableCell>
                <TableCell className="text-right text-sm font-semibold text-foreground">{formatAmount(invoice.totalAmount)}</TableCell>
                <TableCell className="text-right text-sm text-amber-600">{formatAmount(invoice.dueAmount)}</TableCell>
                <TableCell>
                  <Badge className={color}>{label}</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
