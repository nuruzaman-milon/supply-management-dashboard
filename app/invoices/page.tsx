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
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Printer,
} from 'lucide-react'

const mockInvoices = [
  {
    id: 1,
    number: 'INV-001',
    company: 'Global Tech Solutions',
    invoiceDate: '2024-06-10',
    dueDate: '2024-07-10',
    totalAmount: 125000,
    dueAmount: 0,
    status: 'paid',
  },
  {
    id: 2,
    number: 'INV-002',
    company: 'Digital Innovations Ltd',
    invoiceDate: '2024-06-09',
    dueDate: '2024-07-09',
    totalAmount: 85000,
    dueAmount: 85000,
    status: 'unpaid',
  },
  {
    id: 3,
    number: 'INV-003',
    company: 'Innovation Hub',
    invoiceDate: '2024-06-08',
    dueDate: '2024-07-08',
    totalAmount: 325000,
    dueAmount: 162500,
    status: 'partially-paid',
  },
  {
    id: 4,
    number: 'INV-004',
    company: 'Tech Ventures',
    invoiceDate: '2024-06-07',
    dueDate: '2024-05-15',
    totalAmount: 45000,
    dueAmount: 45000,
    status: 'overdue',
  },
  {
    id: 5,
    number: 'INV-005',
    company: 'Smart Solutions',
    invoiceDate: '2024-06-06',
    dueDate: '2024-07-06',
    totalAmount: 215000,
    dueAmount: 215000,
    status: 'draft',
  },
  {
    id: 6,
    number: 'INV-006',
    company: 'Global Tech Solutions',
    invoiceDate: '2024-06-05',
    dueDate: '2024-06-30',
    totalAmount: 95000,
    dueAmount: 0,
    status: 'paid',
  },
]

const statuses = ['all', 'draft', 'unpaid', 'partially-paid', 'paid', 'overdue', 'cancelled']

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredInvoices = mockInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      selectedStatus === 'all' || invoice.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage)
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default'
      case 'unpaid':
        return 'destructive'
      case 'partially-paid':
        return 'secondary'
      case 'overdue':
        return 'destructive'
      case 'draft':
        return 'outline'
      case 'cancelled':
        return 'secondary'
      default:
        return 'default'
    }
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatStatus = (status: string) => {
    return status
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <DashboardLayout title="Invoices">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track all invoices
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Create Invoice
          </Button>
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
                  placeholder="Search by invoice number or company..."
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
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === 'all' ? 'All Status' : formatStatus(status)}
                    </SelectItem>
                  ))}
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

        {/* Invoices Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Invoice Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead className="text-right">Due Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedInvoices.length > 0 ? (
                paginatedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium font-mono">
                      {invoice.number}
                    </TableCell>
                    <TableCell>{invoice.company}</TableCell>
                    <TableCell>
                      {new Date(invoice.invoiceDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(invoice.totalAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          invoice.dueAmount > 0
                            ? 'font-semibold text-amber-600'
                            : 'text-green-600'
                        }
                      >
                        {formatAmount(invoice.dueAmount)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {formatStatus(invoice.status)}
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
                            <Printer className="size-4" />
                            Print
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Download className="size-4" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="py-8 text-center">
                    <p className="text-muted-foreground">No invoices found</p>
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
              Showing{' '}
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredInvoices.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} of{' '}
              {filteredInvoices.length} invoices
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
