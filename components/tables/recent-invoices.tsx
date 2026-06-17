'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const invoicesData = [
  { id: 'INV001', company: 'Acme Corporation', amount: '$12,450', dueDate: '2024-02-15', status: 'Paid', issuedDate: '2024-01-15' },
  { id: 'INV002', company: 'Tech Solutions Ltd', amount: '$8,920', dueDate: '2024-02-20', status: 'Pending', issuedDate: '2024-01-20' },
  { id: 'INV003', company: 'Global Enterprises', amount: '$15,780', dueDate: '2024-02-10', status: 'Overdue', issuedDate: '2024-01-10' },
  { id: 'INV004', company: 'Industry Leaders Inc', amount: '$22,340', dueDate: '2024-02-25', status: 'Paid', issuedDate: '2024-01-25' },
  { id: 'INV005', company: 'Professional Services', amount: '$9,650', dueDate: '2024-02-18', status: 'Pending', issuedDate: '2024-01-18' },
]

const statusColors: Record<string, string> = {
  Paid: 'bg-green-100 text-green-800',
  Pending: 'bg-amber-100 text-amber-800',
  Overdue: 'bg-red-100 text-red-800',
  Cancelled: 'bg-gray-100 text-gray-800',
}

export function RecentInvoicesTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary">
            <TableHead className="font-semibold text-foreground">Invoice ID</TableHead>
            <TableHead className="font-semibold text-foreground">Company</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground">Due Date</TableHead>
            <TableHead className="font-semibold text-foreground">Issued</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoicesData.map((invoice) => (
            <TableRow key={invoice.id} className="border-border hover:bg-secondary/50">
              <TableCell className="text-sm font-medium text-foreground">{invoice.id}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{invoice.company}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-foreground">{invoice.amount}</TableCell>
              <TableCell>
                <Badge className={statusColors[invoice.status] || 'bg-gray-100 text-gray-800'}>
                  {invoice.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{invoice.dueDate}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{invoice.issuedDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
