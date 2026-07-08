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
  Edit2,
  Eye,
  FileText,
} from 'lucide-react'

const mockSupplies = [
  {
    id: 1,
    number: 'SUP-001',
    date: '2024-06-10',
    company: 'Global Tech Solutions',
    amount: 125000,
    invoiceGenerated: 'Yes',
    createdBy: 'Admin User',
  },
  {
    id: 2,
    number: 'SUP-002',
    date: '2024-06-09',
    company: 'Digital Innovations Ltd',
    amount: 85000,
    invoiceGenerated: 'No',
    createdBy: 'Sales User',
  },
  {
    id: 3,
    number: 'SUP-003',
    date: '2024-06-08',
    company: 'Innovation Hub',
    amount: 325000,
    invoiceGenerated: 'Yes',
    createdBy: 'Admin User',
  },
  {
    id: 4,
    number: 'SUP-004',
    date: '2024-06-07',
    company: 'Tech Ventures',
    amount: 45000,
    invoiceGenerated: 'Yes',
    createdBy: 'Sales User',
  },
  {
    id: 5,
    number: 'SUP-005',
    date: '2024-06-06',
    company: 'Smart Solutions',
    amount: 215000,
    invoiceGenerated: 'No',
    createdBy: 'Accounts User',
  },
]

export default function SuppliesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCompany, setSelectedCompany] = useState('all')
  const [invoiceStatus, setInvoiceStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const companies = [
    'All',
    ...new Set(mockSupplies.map((s) => s.company)),
  ]

  const filteredSupplies = mockSupplies.filter((supply) => {
    const matchesSearch =
      supply.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supply.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCompany =
      selectedCompany === 'all' || supply.company === selectedCompany
    const matchesInvoice =
      invoiceStatus === 'all' ||
      (invoiceStatus === 'generated' && supply.invoiceGenerated === 'Yes') ||
      (invoiceStatus === 'pending' && supply.invoiceGenerated === 'No')

    return matchesSearch && matchesCompany && matchesInvoice
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredSupplies.length / itemsPerPage)
  const paginatedSupplies = filteredSupplies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatAmount = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Supplies">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supplies</h1>
            <p className="text-sm text-muted-foreground">
              Manage supply orders and generate invoices
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            New Supply
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by supply number or company..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Company Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Company
              </label>
              <Select
                value={selectedCompany}
                onValueChange={(value) => {
                  setSelectedCompany(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.slice(1).map((company) => (
                    <SelectItem key={company} value={company}>
                      {company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Invoice Status
              </label>
              <Select
                value={invoiceStatus}
                onValueChange={(value) => {
                  setInvoiceStatus(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="generated">Generated</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCompany !== 'all' || invoiceStatus !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCompany('all')
                setInvoiceStatus('all')
                setCurrentPage(1)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </Card>

        {/* Supplies Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supply Number</TableHead>
                <TableHead>Supply Date</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="text-right">Total Amount</TableHead>
                <TableHead>Invoice Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSupplies.length > 0 ? (
                paginatedSupplies.map((supply) => (
                  <TableRow key={supply.id}>
                    <TableCell className="font-medium font-mono">
                      {supply.number}
                    </TableCell>
                    <TableCell>
                      {new Date(supply.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{supply.company}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(supply.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          supply.invoiceGenerated === 'Yes'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {supply.invoiceGenerated === 'Yes'
                          ? 'Generated'
                          : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {supply.createdBy}
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
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          {supply.invoiceGenerated === 'No' && (
                            <DropdownMenuItem className="gap-2">
                              <FileText className="size-4" />
                              Generate Invoice
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <p className="text-muted-foreground">No supplies found</p>
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
              {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSupplies.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredSupplies.length)} of{' '}
              {filteredSupplies.length} supplies
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
