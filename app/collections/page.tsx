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
  Edit2,
  Trash2,
} from 'lucide-react'

const mockCollections = [
  {
    id: 1,
    number: 'COL-001',
    company: 'Global Tech Solutions',
    invoiceNumber: 'INV-001',
    collectionDate: '2024-06-15',
    amount: 125000,
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 2,
    number: 'COL-002',
    company: 'Innovation Hub',
    invoiceNumber: 'INV-003',
    collectionDate: '2024-06-14',
    amount: 162500,
    paymentMethod: 'Check',
  },
  {
    id: 3,
    number: 'COL-003',
    company: 'Digital Innovations Ltd',
    invoiceNumber: 'INV-002',
    collectionDate: '2024-06-13',
    amount: 42500,
    paymentMethod: 'Cash',
  },
  {
    id: 4,
    number: 'COL-004',
    company: 'Tech Ventures',
    invoiceNumber: 'INV-004',
    collectionDate: '2024-06-12',
    amount: 45000,
    paymentMethod: 'Bank Transfer',
  },
  {
    id: 5,
    number: 'COL-005',
    company: 'Smart Solutions',
    invoiceNumber: 'INV-005',
    collectionDate: '2024-06-11',
    amount: 107500,
    paymentMethod: 'Check',
  },
]

const paymentMethods = ['All', 'Bank Transfer', 'Check', 'Cash', 'Card']

export default function CollectionsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMethod, setSelectedMethod] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCollections = mockCollections.filter((collection) => {
    const matchesSearch =
      collection.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      collection.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMethod =
      selectedMethod === 'All' || collection.paymentMethod === selectedMethod

    return matchesSearch && matchesMethod
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage)
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatAmount = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Collections">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collections</h1>
            <p className="text-sm text-muted-foreground">
              Track all payment collections and receipts
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            New Collection
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
                  placeholder="Search by collection or invoice number..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Payment Method Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Payment Method
              </label>
              <Select
                value={selectedMethod}
                onValueChange={(value) => {
                  setSelectedMethod(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedMethod !== 'All') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedMethod('All')
                setCurrentPage(1)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </Card>

        {/* Collections Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Collection Number</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Collection Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCollections.length > 0 ? (
                paginatedCollections.map((collection) => (
                  <TableRow key={collection.id}>
                    <TableCell className="font-medium font-mono">
                      {collection.number}
                    </TableCell>
                    <TableCell>{collection.company}</TableCell>
                    <TableCell className="font-mono text-sm">
                      {collection.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      {new Date(collection.collectionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatAmount(collection.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {collection.paymentMethod}
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
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No collections found
                    </p>
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
              {Math.min(
                (currentPage - 1) * itemsPerPage + 1,
                filteredCollections.length
              )}{' '}
              to {Math.min(currentPage * itemsPerPage, filteredCollections.length)} of{' '}
              {filteredCollections.length} collections
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
