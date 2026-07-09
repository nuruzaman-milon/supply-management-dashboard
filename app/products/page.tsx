'use client'

import { useState, useMemo, useEffect } from 'react'
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
  AddProductModal,
  EditProductModal,
  ViewProductModal,
  DeleteProductModal,
} from '@/components/product-modals'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  Package,
} from 'lucide-react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type ProductDTO,
  type ProductInput,
} from '@/app/actions/product.actions'
import {
  getCategories,
  type CategoryDTO,
} from '@/app/actions/category.actions'

const ITEMS_PER_PAGE = 8

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductDTO[]>([])
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null)

  // Load products + categories from the backend
  useEffect(() => {
    let active = true
    Promise.all([getProducts(), getCategories()])
      .then(([productData, categoryData]) => {
        if (!active) return
        setProducts(productData)
        setCategories(categoryData)
      })
      .catch((error) => {
        console.error('Failed to load products', error)
        alert((error as Error).message || 'Failed to load products')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  const categoryOptions = useMemo(
    () => categories.map((c) => ({ id: c.id, name: c.name })),
    [categories]
  )

  const filteredProducts = useMemo(() => {
    const q = searchTerm.toLowerCase()
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.variants.some((v) => v.sku.toLowerCase().includes(q))
      const matchesCategory =
        categoryFilter === 'all' || product.categoryId === categoryFilter
      const matchesStatus =
        statusFilter === 'all' || product.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [products, searchTerm, categoryFilter, statusFilter])

  const priceRange = (product: ProductDTO) => {
    const prices = product.variants.map((v) => v.sellingPrice)
    if (prices.length === 0) return '—'
    const min = Math.min(...prices)
    const max = Math.max(...prices)
    return min === max ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`
  }

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatPrice = (amount: number) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Handle Add Product
  const handleAddProduct = async (data: ProductInput) => {
    setIsSaving(true)
    try {
      const created = await createProduct(data)
      setProducts((prev) => [created, ...prev])
      setAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add product', error)
      alert((error as Error).message || 'Failed to add product')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Edit Product
  const handleEditProduct = async (data: ProductInput) => {
    if (!selectedProduct) return
    setIsSaving(true)
    try {
      const updated = await updateProduct(selectedProduct.id, data)
      setProducts((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      )
      setEditModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Failed to update product', error)
      alert((error as Error).message || 'Failed to update product')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Delete Product
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    setIsSaving(true)
    try {
      await deleteProduct(selectedProduct.id)
      setProducts((prev) => prev.filter((p) => p.id !== selectedProduct.id))
      setDeleteModalOpen(false)
      setSelectedProduct(null)
    } catch (error) {
      console.error('Failed to delete product', error)
      alert((error as Error).message || 'Failed to delete product')
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewDetails = (product: ProductDTO) => {
    setSelectedProduct(product)
    setViewModalOpen(true)
  }

  const handleEdit = (product: ProductDTO) => {
    setSelectedProduct(product)
    setEditModalOpen(true)
  }

  const handleDelete = (product: ProductDTO) => {
    setSelectedProduct(product)
    setDeleteModalOpen(true)
  }

  return (
    <DashboardLayout title="Products">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog ({filteredProducts.length})
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
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
                  placeholder="Search by name, brand, or variant SKU..."
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
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value as string)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
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
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as string)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setCategoryFilter('all')
                setStatusFilter('all')
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
          {isFetching ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Loading products...
                </p>
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <Package className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">
                  No products found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Get started by adding your first product'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Brand</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Variants</TableHead>
                  <TableHead className="text-right">Price Range</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {product.brand || '—'}
                    </TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell className="text-center">{product.variants.length}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {priceRange(product)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.status === 'ACTIVE' ? 'default' : 'secondary'
                        }
                      >
                        {product.status === 'ACTIVE' ? 'Active' : 'Inactive'}
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
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => handleViewDetails(product)}
                          >
                            <Eye className="size-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => handleEdit(product)}
                          >
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => handleDelete(product)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredProducts.length)} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of{' '}
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

        {/* Modals */}
        <AddProductModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          categories={categoryOptions}
          onSubmit={handleAddProduct}
          isLoading={isSaving}
        />

        <EditProductModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          product={selectedProduct}
          categories={categoryOptions}
          onSubmit={handleEditProduct}
          isLoading={isSaving}
        />

        <ViewProductModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          product={selectedProduct}
        />

        <DeleteProductModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          product={selectedProduct}
          onConfirm={handleDeleteProduct}
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  )
}
