'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const collectionsData = [
  { id: 'COL001', invoice: 'INV001', company: 'Acme Corporation', amount: '$12,450', paymentDate: '2024-01-20', method: 'Bank Transfer' },
  { id: 'COL002', invoice: 'INV004', company: 'Industry Leaders Inc', amount: '$22,340', paymentDate: '2024-01-19', method: 'Credit Card' },
  { id: 'COL003', invoice: 'INV007', company: 'Market Dynamics', amount: '$8,760', paymentDate: '2024-01-18', method: 'Cheque' },
  { id: 'COL004', invoice: 'INV010', company: 'Strategic Ventures', amount: '$16,200', paymentDate: '2024-01-17', method: 'Bank Transfer' },
  { id: 'COL005', invoice: 'INV013', company: 'Future Growth Ltd', amount: '$11,550', paymentDate: '2024-01-16', method: 'Online Payment' },
]

export function RecentCollectionsTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary">
            <TableHead className="font-semibold text-foreground">Collection ID</TableHead>
            <TableHead className="font-semibold text-foreground">Invoice</TableHead>
            <TableHead className="font-semibold text-foreground">Company</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
            <TableHead className="font-semibold text-foreground">Method</TableHead>
            <TableHead className="font-semibold text-foreground">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collectionsData.map((collection) => (
            <TableRow key={collection.id} className="border-border hover:bg-secondary/50">
              <TableCell className="text-sm font-medium text-foreground">{collection.id}</TableCell>
              <TableCell className="text-sm font-medium text-primary">{collection.invoice}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{collection.company}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-foreground">{collection.amount}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {collection.method}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{collection.paymentDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
