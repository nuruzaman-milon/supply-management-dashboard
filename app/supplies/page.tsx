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
  AddSupplyModal,
  EditSupplyModal,
  ViewSupplyModal,
  DeleteSupplyModal,
  type CompanyOption,
  type ProductOption,
} from '@/components/supplies-modals'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Eye,
  Trash2,
  PackageOpen,
} from 'lucide-react'
import {
  getSupplies,
  getSupply,
  createSupply,
  updateSupply,
  deleteSupply,
  type SupplyListDTO,
  type SupplyDetailDTO,
  type SupplyInput,
  type SupplyStatus,
} from '@/app/actions/supply.actions'
import { getCompanies } from '@/app/actions/company.actions'
import { getProducts } from '@/app/actions/product.actions'

const ITEMS_PER_PAGE = 10

const STATUS_LABELS: Record<SupplyStatus, string> = {
  PENDING: 'Pending',
  DELIVERED: 'Delivered',
  PARTIAL_DELIVERED: 'Partial',
  CANCELLED: 'Cancelled',
}

function statusVariant(status: SupplyStatus) {
  switch (status) {
    case 'DELIVERED':
      return 'default'
    case 'CANCELLED':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export default function SuppliesPage() {
  const [supplies, setSupplies] = useState<SupplyListDTO[]>([])
  const [companies, setCompanies] = useState<CompanyOption[]>([])
  const [products, setProducts] = useState<ProductOption[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [companyFilter, setCompanyFilter] = useState('all')
  const [invoiceFilter, setInvoiceFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selected, setSelected] = useState<SupplyDetailDTO | null>(null)

  // Load supplies + companies + products
  useEffect(() => {
    let active = true
    Promise.all([getSupplies(), getCompanies(), getProducts()])
      .then(([supplyData, companyData, productData]) => {
        if (!active) return
        setSupplies(supplyData)
        setCompanies(companyData.map((c) => ({ id: c.id, name: c.name })))
        setProducts(
          productData
            .filter((p) => p.status === 'ACTIVE')
            .map((p) => ({
              id: p.id,
              name: p.name,
              variants: p.variants
                .filter((v) => v.status === 'ACTIVE')
                .map((v) => ({
                  id: v.id,
                  name: v.name,
                  sku: v.sku,
                  unit: v.unit,
                  sellingPrice: v.sellingPrice,
                })),
            }))
            // Only offer products that have at least one active variant.
            .filter((p) => p.variants.length > 0)
        )
      })
      .catch((error) => {
        console.error('Failed to load supplies', error)
        alert((error as Error).message || 'Failed to load supplies')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredSupplies = useMemo(() => {
    return supplies.filter((s) => {
      const matchesSearch =
        s.supplyNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCompany =
        companyFilter === 'all' || s.companyId === companyFilter
      const matchesInvoice =
        invoiceFilter === 'all' ||
        (invoiceFilter === 'generated' && s.invoiceGenerated) ||
        (invoiceFilter === 'pending' && !s.invoiceGenerated)
      return matchesSearch && matchesCompany && matchesInvoice
    })
  }, [supplies, searchTerm, companyFilter, invoiceFilter])

  const totalPages = Math.ceil(filteredSupplies.length / ITEMS_PER_PAGE)
  const paginatedSupplies = filteredSupplies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatAmount = (amount: number) =>
    '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(amount)

  // ---- Handlers ----
  const handleAdd = async (data: SupplyInput) => {
    setIsSaving(true)
    try {
      const created = await createSupply(data)
      setSupplies((prev) => [created, ...prev])
      setAddModalOpen(false)
    } catch (error) {
      console.error('Failed to create supply', error)
      alert((error as Error).message || 'Failed to create supply')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (data: SupplyInput) => {
    if (!selected) return
    setIsSaving(true)
    try {
      const updated = await updateSupply(selected.id, data)
      setSupplies((prev) => prev.map((s) => (s.id === updated.id ? updated : s)))
      setEditModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to update supply', error)
      alert((error as Error).message || 'Failed to update supply')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setIsSaving(true)
    try {
      await deleteSupply(selected.id)
      setSupplies((prev) => prev.filter((s) => s.id !== selected.id))
      setDeleteModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to delete supply', error)
      alert((error as Error).message || 'Failed to delete supply')
    } finally {
      setIsSaving(false)
    }
  }

  // Open view/edit — fetch full detail (list rows don't carry line items).
  const openWithDetail = async (
    id: string,
    which: 'view' | 'edit' | 'delete'
  ) => {
    try {
      const detail = await getSupply(id)
      setSelected(detail)
      if (which === 'view') setViewModalOpen(true)
      else if (which === 'edit') setEditModalOpen(true)
      else setDeleteModalOpen(true)
    } catch (error) {
      console.error('Failed to load supply', error)
      alert((error as Error).message || 'Failed to load supply')
    }
  }

  return (
    <DashboardLayout title="Supplies">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Supplies</h1>
            <p className="text-sm text-muted-foreground">
              Manage supply orders ({filteredSupplies.length})
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="size-4" />
            New Supply
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Company
              </label>
              <Select
                value={companyFilter}
                onValueChange={(value) => {
                  setCompanyFilter(value as string)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Invoice Status
              </label>
              <Select
                value={invoiceFilter}
                onValueChange={(value) => {
                  setInvoiceFilter(value as string)
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

          {(searchTerm || companyFilter !== 'all' || invoiceFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setCompanyFilter('all')
                setInvoiceFilter('all')
                setCurrentPage(1)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </Card>

        {/* Table */}
        <Card className="overflow-hidden">
          {isFetching ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Loading supplies...</p>
              </div>
            </div>
          ) : filteredSupplies.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <PackageOpen className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">
                  No supplies found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || companyFilter !== 'all' || invoiceFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Get started by creating your first supply'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Supply No</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Grand Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSupplies.map((supply) => (
                  <TableRow key={supply.id}>
                    <TableCell className="font-mono font-medium">
                      {supply.supplyNo}
                    </TableCell>
                    <TableCell>
                      {new Date(supply.supplyDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(supply.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{supply.companyName}</TableCell>
                    <TableCell className="text-center">{supply.itemCount}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(supply.grandTotal)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(supply.status)}>
                        {STATUS_LABELS[supply.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {supply.invoiceNo || '—'}
                    </TableCell>
                    <TableCell className="text-sm">{supply.createdByName}</TableCell>
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
                            onClick={() => openWithDetail(supply.id, 'view')}
                          >
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => openWithDetail(supply.id, 'edit')}
                          >
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => openWithDetail(supply.id, 'delete')}
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
              Showing{' '}
              {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredSupplies.length)}{' '}
              to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSupplies.length)} of{' '}
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

        {/* Modals */}
        <AddSupplyModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          companies={companies}
          products={products}
          onSubmit={handleAdd}
          isLoading={isSaving}
        />

        <EditSupplyModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          supply={selected}
          companies={companies}
          products={products}
          onSubmit={handleEdit}
          isLoading={isSaving}
        />

        <ViewSupplyModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          supply={selected}
        />

        <DeleteSupplyModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          supply={selected}
          onConfirm={handleDelete}
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  )
}
