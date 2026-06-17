'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

const suppliesData = [
  { id: 'SUP001', supplier: 'Global Supplies Inc', item: 'Office Paper A4', qty: 500, status: 'Delivered', date: '2024-01-15' },
  { id: 'SUP002', supplier: 'Tech Components Ltd', item: 'Computer Monitors', qty: 45, status: 'In Transit', date: '2024-01-14' },
  { id: 'SUP003', supplier: 'Furniture Pro', item: 'Office Chairs', qty: 120, status: 'Pending', date: '2024-01-13' },
  { id: 'SUP004', supplier: 'Stationery World', item: 'Pens & Markers', qty: 2000, status: 'Delivered', date: '2024-01-12' },
  { id: 'SUP005', supplier: 'Industrial Supply', item: 'Safety Equipment', qty: 85, status: 'Processing', date: '2024-01-11' },
]

const statusColors: Record<string, string> = {
  Delivered: 'bg-green-100 text-green-800',
  'In Transit': 'bg-blue-100 text-blue-800',
  Pending: 'bg-amber-100 text-amber-800',
  Processing: 'bg-purple-100 text-purple-800',
  Cancelled: 'bg-red-100 text-red-800',
}

export function RecentSuppliesTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-border bg-secondary">
            <TableHead className="font-semibold text-foreground">ID</TableHead>
            <TableHead className="font-semibold text-foreground">Supplier</TableHead>
            <TableHead className="font-semibold text-foreground">Item</TableHead>
            <TableHead className="text-right font-semibold text-foreground">Qty</TableHead>
            <TableHead className="font-semibold text-foreground">Status</TableHead>
            <TableHead className="font-semibold text-foreground">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliesData.map((supply) => (
            <TableRow key={supply.id} className="border-border hover:bg-secondary/50">
              <TableCell className="text-sm font-medium text-foreground">{supply.id}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{supply.supplier}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{supply.item}</TableCell>
              <TableCell className="text-right text-sm text-foreground">{supply.qty.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={`${statusColors[supply.status] || 'bg-gray-100 text-gray-800'}`}>
                  {supply.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{supply.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
