'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertCircle,
  Clock,
  Search,
  MoreHorizontal,
  Eye,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

const mockDues = [
  {
    id: 1,
    company: 'Digital Innovations Ltd',
    invoiceNumber: 'INV-002',
    invoiceAmount: 85000,
    paidAmount: 0,
    dueAmount: 85000,
    dueDate: '2024-07-09',
    daysOverdue: 0,
    status: 'upcoming',
  },
  {
    id: 2,
    company: 'Innovation Hub',
    invoiceNumber: 'INV-003',
    invoiceAmount: 325000,
    paidAmount: 162500,
    dueAmount: 162500,
    dueDate: '2024-07-08',
    daysOverdue: 0,
    status: 'upcoming',
  },
  {
    id: 3,
    company: 'Tech Ventures',
    invoiceNumber: 'INV-004',
    invoiceAmount: 45000,
    paidAmount: 0,
    dueAmount: 45000,
    dueDate: '2024-05-15',
    daysOverdue: 33,
    status: 'overdue',
  },
  {
    id: 4,
    company: 'Smart Solutions',
    invoiceNumber: 'INV-005',
    invoiceAmount: 215000,
    paidAmount: 0,
    dueAmount: 215000,
    dueDate: '2024-07-06',
    daysOverdue: 0,
    status: 'upcoming',
  },
]

export default function DueListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Calculate totals
  const totalDue = mockDues.reduce((sum, due) => sum + due.dueAmount, 0)
  const overdueDue = mockDues
    .filter((due) => due.status === 'overdue')
    .reduce((sum, due) => sum + due.dueAmount, 0)
  const upcomingDue = mockDues
    .filter((due) => due.status === 'upcoming')
    .reduce((sum, due) => sum + due.dueAmount, 0)

  const filteredDues = mockDues.filter((due) => {
    const matchesSearch =
      due.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      due.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      selectedStatus === 'all' || due.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredDues.length / itemsPerPage)
  const paginatedDues = filteredDues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatAmount = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Due Management">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Due Management</h1>
          <p className="text-sm text-muted-foreground">
            Track and manage outstanding dues
          </p>
        </div>

        {/* Top Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Total Due */}
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
                <DollarSign className="size-5 text-primary" />
              </div>
            </div>
          </Card>

          {/* Overdue Due */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Overdue Due
                </p>
                <p className="mt-2 text-2xl font-bold text-destructive">
                  {formatAmount(overdueDue)}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-3">
                <AlertCircle className="size-5 text-destructive" />
              </div>
            </div>
          </Card>

          {/* Upcoming Due */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Upcoming Due
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {formatAmount(upcomingDue)}
                </p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <Clock className="size-5 text-amber-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by company or invoice number..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedStatus !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedStatus('all')
                setCurrentPage(1)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </Card>

        {/* Due Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead className="text-right">Invoice Amount</TableHead>
                <TableHead className="text-right">Paid Amount</TableHead>
                <TableHead className="text-right">Due Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Days Overdue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDues.length > 0 ? (
                paginatedDues.map((due) => (
                  <TableRow key={due.id}>
                    <TableCell className="font-medium">
                      {due.company}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {due.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(due.invoiceAmount)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatAmount(due.paidAmount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-amber-600">
                      {formatAmount(due.dueAmount)}
                    </TableCell>
                    <TableCell>
                      {new Date(due.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {due.daysOverdue > 0 ? (
                        <span className="font-semibold text-destructive">
                          {due.daysOverdue} days
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          due.status === 'overdue'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {due.status === 'overdue'
                          ? 'Overdue'
                          : 'Upcoming'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <TrendingUp className="size-4" />
                            Collect Payment
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="py-8 text-center">
                    <p className="text-muted-foreground">No dues found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredDues.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredDues.length)} of{' '}
              {filteredDues.length} dues
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
