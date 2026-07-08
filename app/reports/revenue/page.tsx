'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Download, FileText, DollarSign, TrendingUp } from 'lucide-react'

const mockRevenueData = [
  {
    id: 1,
    month: 'January 2024',
    invoices: 12,
    totalRevenue: 545000,
    collections: 525000,
    outstanding: 20000,
  },
  {
    id: 2,
    month: 'February 2024',
    invoices: 15,
    totalRevenue: 725000,
    collections: 680000,
    outstanding: 45000,
  },
  {
    id: 3,
    month: 'March 2024',
    invoices: 18,
    totalRevenue: 895000,
    collections: 850000,
    outstanding: 45000,
  },
  {
    id: 4,
    month: 'April 2024',
    invoices: 14,
    totalRevenue: 625000,
    collections: 625000,
    outstanding: 0,
  },
  {
    id: 5,
    month: 'May 2024',
    invoices: 16,
    totalRevenue: 765000,
    collections: 715000,
    outstanding: 50000,
  },
  {
    id: 6,
    month: 'June 2024',
    invoices: 10,
    totalRevenue: 495000,
    collections: 350000,
    outstanding: 145000,
  },
]

export default function RevenueReportPage() {
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-06-30')
  const [selectedMonth, setSelectedMonth] = useState('all')

  // Calculate totals
  const totalRevenue = mockRevenueData.reduce(
    (sum, item) => sum + item.totalRevenue,
    0
  )
  const totalCollections = mockRevenueData.reduce(
    (sum, item) => sum + item.collections,
    0
  )
  const totalOutstanding = mockRevenueData.reduce(
    (sum, item) => sum + item.outstanding,
    0
  )
  const avgRevenue = Math.round(totalRevenue / mockRevenueData.length)

  const formatAmount = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Revenue Report">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Revenue Report
            </h1>
            <p className="text-sm text-muted-foreground">
              Analyze your revenue trends and performance
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
                  Total Revenue
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatAmount(totalRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <DollarSign className="size-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Collections
                </p>
                <p className="mt-2 text-2xl font-bold text-green-600">
                  {formatAmount(totalCollections)}
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
                  Outstanding
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {formatAmount(totalOutstanding)}
                </p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <DollarSign className="size-5 text-amber-600" />
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
                  {formatAmount(avgRevenue)}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <TrendingUp className="size-5 text-blue-600" />
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

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Month
              </label>
              <Select
                value={selectedMonth}
                onValueChange={setSelectedMonth}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {mockRevenueData.map((item) => (
                    <SelectItem key={item.id} value={item.month}>
                      {item.month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button className="w-full">Apply Filters</Button>
            </div>
          </div>
        </Card>

        {/* Revenue Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Invoices</TableHead>
                <TableHead className="text-right">Total Revenue</TableHead>
                <TableHead className="text-right">Collections</TableHead>
                <TableHead className="text-right">Outstanding</TableHead>
                <TableHead className="text-right">Collection %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRevenueData.map((item) => {
                const collectionPercent = Math.round(
                  (item.collections / item.totalRevenue) * 100
                )
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell className="text-right">
                      {item.invoices}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(item.totalRevenue)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatAmount(item.collections)}
                    </TableCell>
                    <TableCell className="text-right text-amber-600">
                      {formatAmount(item.outstanding)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-blue-600">
                        {collectionPercent}%
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-secondary font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {mockRevenueData.reduce((sum, item) => sum + item.invoices, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(totalRevenue)}
                </TableCell>
                <TableCell className="text-right text-green-600">
                  {formatAmount(totalCollections)}
                </TableCell>
                <TableCell className="text-right text-amber-600">
                  {formatAmount(totalOutstanding)}
                </TableCell>
                <TableCell className="text-right text-blue-600">
                  {Math.round((totalCollections / totalRevenue) * 100)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
