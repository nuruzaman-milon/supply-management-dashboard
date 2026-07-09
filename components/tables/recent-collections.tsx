'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import type { CollectionListDTO } from '@/app/actions/collection.actions'

const methodLabels: Record<string, string> = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  MOBILE_BANKING: 'Mobile Banking',
  CHEQUE: 'Cheque',
}

function formatAmount(v: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(v)
}

export function RecentCollectionsTable({ collections }: { collections: CollectionListDTO[] }) {
  if (collections.length === 0) {
    return <p className="py-8 text-center text-sm text-muted-foreground">No collections yet</p>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary">
            <TableHead className="font-semibold text-foreground">Collection No</TableHead>
            <TableHead className="font-semibold text-foreground">Invoice</TableHead>
            <TableHead className="font-semibold text-foreground">Company</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Amount</TableHead>
            <TableHead className="font-semibold text-foreground">Method</TableHead>
            <TableHead className="font-semibold text-foreground">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {collections.map((collection) => (
            <TableRow key={collection.id} className="border-border hover:bg-secondary/50">
              <TableCell className="font-mono text-sm font-medium text-foreground">{collection.collectionNo}</TableCell>
              <TableCell className="font-mono text-sm font-medium text-primary">{collection.invoiceNo}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{collection.companyName}</TableCell>
              <TableCell className="text-right text-sm font-semibold text-green-600">{formatAmount(collection.amount)}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {methodLabels[collection.paymentMethod] || collection.paymentMethod}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(collection.collectionDate).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
