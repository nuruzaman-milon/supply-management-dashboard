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
  Trash2,
  Eye,
} from 'lucide-react'

const mockProducts = [
  {
    id: 1,
    name: 'Laptop - Dell XPS 13',
    sku: 'DELL-XPS-13',
    category: 'Electronics',
    unit: 'pcs',
    price: 125000,
    status: 'active',
  },
  {
    id: 2,
    name: 'Office Chair - Ergonomic',
    sku: 'CHAIR-ERG-001',
    category: 'Furniture',
    unit: 'pcs',
    price: 8500,
    status: 'active',
  },
  {
    id: 3,
    name: 'Monitor - 27" LED',
    sku: 'MON-27-LED',
    category: 'Electronics',
    unit: 'pcs',
    price: 18000,
    status: 'active',
  },
  {
    id: 4,
    name: 'Desk - Wooden',
    sku: 'DESK-WOD-001',
    category: 'Furniture',
    unit: 'pcs',
    price: 12000,
    status: 'inactive',
  },
  {
    id: 5,
    name: 'Keyboard - Mechanical',
    sku: 'KEY-MCH-001',
    category: 'Electronics',
    unit: 'pcs',
    price: 4500,
    status: 'active',
  },
  {
    id: 6,
    name: 'Mouse - Wireless',
    sku: 'MOUSE-WLS-001',
    category: 'Electronics',
    unit: 'pcs',
    price: 1200,
    status: 'active',
  },
  {
    id: 7,
    name: 'File Cabinet - Metal',
    sku: 'CAB-MET-001',
    category: 'Furniture',
    unit: 'pcs',
    price: 6500,
    status: 'active',
  },
  {
    id: 8,
    name: 'Printer - Laser',
    sku: 'PRINT-LAS-001',
    category: 'Electronics',
    unit: 'pcs',
    price: 35000,
    status: 'active',
  },
  {
    id: 9,
    name: 'Whiteboard - 4x8',
    sku: 'BOARD-WH-001',
    category: 'Office Supplies',
    unit: 'pcs',
    price: 3500,
    status: 'inactive',
  },
  {
    id: 10,
    name: 'Projector - HD',
    sku: 'PROJ-HD-001',
    category: 'Electronics',
    unit: 'pcs',
    price: 45000,
    status: 'active',
  },
]

const categories = ['All', 'Electronics', 'Furniture', 'Office Supplies']

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    const matchesStatus =
      selectedStatus === 'all' || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const itemsPerPage = 8
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatPrice = (amount) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <DashboardLayout title="Products">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Product
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
                  placeholder="Search by name or SKU..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedCategory !== 'All' || selectedStatus !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
                setSelectedStatus('all')
                setCurrentPage(1)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </Card>

        {/* Products Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.unit}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'active'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {product.status === 'active' ? 'Active' : 'Inactive'}
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
                            View
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
                    <p className="text-muted-foreground">No products found</p>
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
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredProducts.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
              {filteredProducts.length} products
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
