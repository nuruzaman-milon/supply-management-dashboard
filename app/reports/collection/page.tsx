'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download, FileText, CreditCard, TrendingUp, Calendar } from 'lucide-react'

const mockCollectionData = [
  {
    id: 1,
    month: 'January 2024',
    collections: 14,
    totalAmount: 525000,
    bankTransfer: 315000,
    check: 157500,
    cash: 52500,
  },
  {
    id: 2,
    month: 'February 2024',
    collections: 18,
    totalAmount: 680000,
    bankTransfer: 408000,
    check: 204000,
    cash: 68000,
  },
  {
    id: 3,
    month: 'March 2024',
    collections: 21,
    totalAmount: 850000,
    bankTransfer: 510000,
    check: 255000,
    cash: 85000,
  },
  {
    id: 4,
    month: 'April 2024',
    collections: 16,
    totalAmount: 625000,
    bankTransfer: 375000,
    check: 187500,
    cash: 62500,
  },
  {
    id: 5,
    month: 'May 2024',
    collections: 19,
    totalAmount: 715000,
    bankTransfer: 429000,
    check: 214500,
    cash: 71500,
  },
  {
    id: 6,
    month: 'June 2024',
    collections: 12,
    totalAmount: 350000,
    bankTransfer: 210000,
    check: 105000,
    cash: 35000,
  },
]

export default function CollectionReportPage() {
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-06-30')

  // Calculate totals
  const totalCollections = mockCollectionData.reduce(
    (sum, item) => sum + item.collections,
    0
  )
  const totalAmount = mockCollectionData.reduce(
    (sum, item) => sum + item.totalAmount,
    0
  )
  const avgCollectionAmount = Math.round(totalAmount / mockCollectionData.length)

  const formatAmount = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Collection Report">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Collection Report
            </h1>
            <p className="text-sm text-muted-foreground">
              Track collection performance and payment methods
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="size-4" />
              Export PDF
            </Button>
            <Button variant="outline" className="gap-2">
              <FileText className="size-4" />
              Export Excel
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Collections
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {totalCollections}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <CreditCard className="size-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Amount
                </p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatAmount(totalAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-green-100 p-3">
                <TrendingUp className="size-5 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Average Monthly
                </p>
                <p className="mt-2 text-2xl font-bold text-blue-600">
                  {formatAmount(avgCollectionAmount)}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <Calendar className="size-5 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Avg per Collection
                </p>
                <p className="mt-2 text-2xl font-bold text-purple-600">
                  {formatAmount(
                    Math.round(totalAmount / totalCollections)
                  )}
                </p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <CreditCard className="size-5 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Date From
              </label>
              <Input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Date To
              </label>
              <Input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </Card>

        {/* Collection Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Collections</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Bank Transfer</TableHead>
                <TableHead className="text-right">Check</TableHead>
                <TableHead className="text-right">Cash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCollectionData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.month}</TableCell>
                  <TableCell className="text-right">
                    {item.collections}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatAmount(item.totalAmount)}
                  </TableCell>
                  <TableCell className="text-right text-blue-600">
                    {formatAmount(item.bankTransfer)}
                  </TableCell>
                  <TableCell className="text-right text-amber-600">
                    {formatAmount(item.check)}
                  </TableCell>
                  <TableCell className="text-right text-green-600">
                    {formatAmount(item.cash)}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-secondary font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {totalCollections}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(totalAmount)}
                </TableCell>
                <TableCell className="text-right text-blue-600">
                  {formatAmount(
                    mockCollectionData.reduce(
                      (sum, item) => sum + item.bankTransfer,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="text-right text-amber-600">
                  {formatAmount(
                    mockCollectionData.reduce(
                      (sum, item) => sum + item.check,
                      0
                    )
                  )}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatAmount(
                    mockCollectionData.reduce(
                      (sum, item) => sum + item.cash,
                      0
                    )
                  )}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
