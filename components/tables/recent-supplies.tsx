'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { SupplyListDTO } from '@/app/actions/supply.actions'

const statusColors: Record<string, string> = {
  DELIVERED: 'bg-green-100 text-green-800',
  PARTIAL_DELIVERED: 'bg-blue-100 text-blue-800',
  PENDING: 'bg-amber-100 text-amber-800',
  CANCELLED: 'bg-red-100 text-red-800',
}

const statusLabels: Record<string, string> = {
  DELIVERED: 'Delivered',
  PARTIAL_DELIVERED: 'Partial',
  PENDING: 'Pending',
  CANCELLED: 'Cancelled',
}

function formatAmount(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

export function RecentSuppliesTable({ supplies }: { supplies: SupplyListDTO[] }) {
  if (supplies.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No supplies yet</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary">
            <TableHead className="font-semibold text-foreground">Supply No</TableHead>
            <TableHead className="font-semibold text-foreground">Company</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Items</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {supplies.map((supply) => (
            <TableRow key={supply.id} className="border-border hover:bg-secondary/50">
              <TableCell className="font-mono text-sm font-medium text-foreground">{supply.supplyNo}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{supply.companyName}</TableCell>
              <TableCell className="text-right text-sm text-foreground">{supply.itemCount}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-foreground">{formatAmount(supply.grandTotal)}</TableCell>
              <TableCell>
                <Badge className={statusColors[supply.status] || 'bg-gray-100 text-gray-800'}>
                  {statusLabels[supply.status] || supply.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(supply.supplyDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
