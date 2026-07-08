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
import { Download, FileText, AlertCircle, Clock, TrendingDown } from 'lucide-react'

const mockDueData = [
  {
    id: 1,
    month: 'January 2024',
    totalDue: 45000,
    overdue: 15000,
    upcomingDue: 30000,
    itemsCount: 5,
  },
  {
    id: 2,
    month: 'February 2024',
    totalDue: 85000,
    overdue: 22000,
    upcomingDue: 63000,
    itemsCount: 8,
  },
  {
    id: 3,
    month: 'March 2024',
    totalDue: 95000,
    overdue: 35000,
    upcomingDue: 60000,
    itemsCount: 9,
  },
  {
    id: 4,
    month: 'April 2024',
    totalDue: 52000,
    overdue: 18000,
    upcomingDue: 34000,
    itemsCount: 6,
  },
  {
    id: 5,
    month: 'May 2024',
    totalDue: 72000,
    overdue: 28000,
    upcomingDue: 44000,
    itemsCount: 7,
  },
  {
    id: 6,
    month: 'June 2024',
    totalDue: 162500,
    overdue: 45000,
    upcomingDue: 117500,
    itemsCount: 4,
  },
]

export default function DueReportPage() {
  const [dateFrom, setDateFrom] = useState('2024-01-01')
  const [dateTo, setDateTo] = useState('2024-06-30')

  // Calculate totals
  const totalDue = mockDueData.reduce((sum, item) => sum + item.totalDue, 0)
  const totalOverdue = mockDueData.reduce(
    (sum, item) => sum + item.overdue,
    0
  )
  const totalUpcoming = mockDueData.reduce(
    (sum, item) => sum + item.upcomingDue,
    0
  )
  const avgMonthlyDue = Math.round(totalDue / mockDueData.length)

  const formatAmount = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Due Report">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Due Report</h1>
            <p className="text-sm text-muted-foreground">
              Analyze outstanding dues and aging analysis
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
                  Total Due
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {formatAmount(totalDue)}
                </p>
              </div>
              <div className="rounded-lg bg-secondary p-3">
                <TrendingDown className="size-5 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Overdue Amount
                </p>
                <p className="mt-2 text-2xl font-bold text-destructive">
                  {formatAmount(totalOverdue)}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-3">
                <AlertCircle className="size-5 text-destructive" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Upcoming Due
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {formatAmount(totalUpcoming)}
                </p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <Clock className="size-5 text-amber-600" />
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
                  {formatAmount(avgMonthlyDue)}
                </p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <TrendingDown className="size-5 text-blue-600" />
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

        {/* Due Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Items Count</TableHead>
                <TableHead className="text-right">Total Due</TableHead>
                <TableHead className="text-right">Overdue Amount</TableHead>
                <TableHead className="text-right">Upcoming Due</TableHead>
                <TableHead className="text-right">Overdue %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDueData.map((item) => {
                const overduePercent = Math.round(
                  (item.overdue / item.totalDue) * 100
                )
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.month}</TableCell>
                    <TableCell className="text-right">
                      {item.itemsCount}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(item.totalDue)}
                    </TableCell>
                    <TableCell className="text-right text-destructive">
                      {formatAmount(item.overdue)}
                    </TableCell>
                    <TableCell className="text-right text-amber-600">
                      {formatAmount(item.upcomingDue)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-destructive">
                        {overduePercent}%
                      </span>
                    </TableCell>
                  </TableRow>
                )
              })}
              <TableRow className="bg-secondary font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right">
                  {mockDueData.reduce((sum, item) => sum + item.itemsCount, 0)}
                </TableCell>
                <TableCell className="text-right">
                  {formatAmount(totalDue)}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  {formatAmount(totalOverdue)}
                </TableCell>
                <TableCell className="text-right text-amber-600">
                  {formatAmount(totalUpcoming)}
                </TableCell>
                <TableCell className="text-right text-destructive">
                  {Math.round((totalOverdue / totalDue) * 100)}%
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
}
