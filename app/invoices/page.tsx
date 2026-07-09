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
  GenerateInvoiceModal,
  EditInvoiceModal,
  ViewInvoiceModal,
  DeleteInvoiceModal,
  statusBadgeVariant,
  statusLabel,
} from '@/components/invoices-modals'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  FileText,
} from 'lucide-react'
import {
  getInvoices,
  getInvoice,
  getUninvoicedSupplies,
  generateInvoice,
  updateInvoice,
  deleteInvoice,
  type InvoiceListDTO,
  type InvoiceDetailDTO,
  type GenerateInvoiceInput,
  type UpdateInvoiceInput,
  type UninvoicedSupplyDTO,
} from '@/app/actions/invoice.actions'

const ITEMS_PER_PAGE = 10

const STATUS_FILTERS = [
  { value: 'all', label: 'All Status' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListDTO[]>([])
  const [uninvoicedSupplies, setUninvoicedSupplies] = useState<
    UninvoicedSupplyDTO[]
  >([])

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [generateModalOpen, setGenerateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selected, setSelected] = useState<InvoiceDetailDTO | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([getInvoices(), getUninvoicedSupplies()])
      .then(([invoiceData, supplyData]) => {
        if (!active) return
        setInvoices(invoiceData)
        setUninvoicedSupplies(supplyData)
      })
      .catch((error) => {
        console.error('Failed to load invoices', error)
        alert((error as Error).message || 'Failed to load invoices')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const matchesSearch =
        inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      const effectiveStatus = inv.isOverdue ? 'OVERDUE' : inv.status
      const matchesStatus =
        statusFilter === 'all' || effectiveStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [invoices, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredInvoices.length / ITEMS_PER_PAGE)
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatAmount = (amount: number) =>
    '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(amount)

  // ---- Handlers ----
  const handleGenerate = async (data: GenerateInvoiceInput) => {
    setIsSaving(true)
    try {
      const created = await generateInvoice(data)
      setInvoices((prev) => [created, ...prev])
      // The supply is now invoiced — drop it from the dropdown.
      setUninvoicedSupplies((prev) => prev.filter((s) => s.id !== data.supplyId))
      setGenerateModalOpen(false)
    } catch (error) {
      console.error('Failed to generate invoice', error)
      alert((error as Error).message || 'Failed to generate invoice')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (data: UpdateInvoiceInput) => {
    if (!selected) return
    setIsSaving(true)
    try {
      const updated = await updateInvoice(selected.id, data)
      setInvoices((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
      setEditModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to update invoice', error)
      alert((error as Error).message || 'Failed to update invoice')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setIsSaving(true)
    try {
      await deleteInvoice(selected.id)
      setInvoices((prev) => prev.filter((i) => i.id !== selected.id))
      // Freed supply becomes invoiceable again — refresh the dropdown.
      await getUninvoicedSupplies().then(setUninvoicedSupplies).catch(() => {})
      setDeleteModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to delete invoice', error)
      alert((error as Error).message || 'Failed to delete invoice')
    } finally {
      setIsSaving(false)
    }
  }

  // View/Edit/Delete need the full detail (line items, notes).
  const openWithDetail = async (
    id: string,
    which: 'view' | 'edit' | 'delete'
  ) => {
    try {
      const detail = await getInvoice(id)
      setSelected(detail)
      if (which === 'view') setViewModalOpen(true)
      else if (which === 'edit') setEditModalOpen(true)
      else setDeleteModalOpen(true)
    } catch (error) {
      console.error('Failed to load invoice', error)
      alert((error as Error).message || 'Failed to load invoice')
    }
  }

  return (
    <DashboardLayout title="Invoices">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track all invoices ({filteredInvoices.length})
            </p>
          </div>
          <Button className="gap-2" onClick={() => setGenerateModalOpen(true)}>
            <Plus className="size-4" />
            Generate Invoice
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                  {STATUS_FILTERS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || statusFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
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
                <p className="text-sm text-muted-foreground">Loading invoices...</p>
              </div>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <FileText className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">
                  No invoices found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Generate an invoice from a supply to get started'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice No</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-mono font-medium">
                      {invoice.invoiceNo}
                    </TableCell>
                    <TableCell>{invoice.companyName}</TableCell>
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
                      <Badge
                        variant={statusBadgeVariant(invoice.status, invoice.isOverdue)}
                      >
                        {statusLabel(invoice.status, invoice.isOverdue)}
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
                            onClick={() => openWithDetail(invoice.id, 'view')}
                          >
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => openWithDetail(invoice.id, 'edit')}
                          >
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => openWithDetail(invoice.id, 'delete')}
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
              {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredInvoices.length)}{' '}
              to {Math.min(currentPage * ITEMS_PER_PAGE, filteredInvoices.length)} of{' '}
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

        {/* Modals */}
        <GenerateInvoiceModal
          open={generateModalOpen}
          onOpenChange={setGenerateModalOpen}
          supplies={uninvoicedSupplies}
          onSubmit={handleGenerate}
          isLoading={isSaving}
        />

        <EditInvoiceModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          invoice={selected}
          onSubmit={handleEdit}
          isLoading={isSaving}
        />

        <ViewInvoiceModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          invoice={selected}
        />

        <DeleteInvoiceModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          invoice={selected}
          onConfirm={handleDelete}
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  )
}
