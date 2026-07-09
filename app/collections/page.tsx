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
  NewCollectionModal,
  EditCollectionModal,
  ViewCollectionModal,
  DeleteCollectionModal,
  methodLabel,
} from '@/components/collections-modals'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
  Wallet,
} from 'lucide-react'
import {
  getCollections,
  getCollection,
  getPayableInvoices,
  createCollection,
  updateCollection,
  deleteCollection,
  type CollectionListDTO,
  type CollectionDetailDTO,
  type CollectionInput,
  type PayableInvoiceDTO,
  type PaymentMethod,
} from '@/app/actions/collection.actions'

const ITEMS_PER_PAGE = 10

const METHOD_FILTERS = [
  { value: 'all', label: 'All Methods' },
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'MOBILE_BANKING', label: 'Mobile Banking' },
  { value: 'CHEQUE', label: 'Cheque' },
]

export default function CollectionsPage() {
  const [collections, setCollections] = useState<CollectionListDTO[]>([])
  const [payableInvoices, setPayableInvoices] = useState<PayableInvoiceDTO[]>([])

  const [searchTerm, setSearchTerm] = useState('')
  const [methodFilter, setMethodFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [newModalOpen, setNewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selected, setSelected] = useState<CollectionDetailDTO | null>(null)

  const refreshPayable = () =>
    getPayableInvoices().then(setPayableInvoices).catch(() => {})

  useEffect(() => {
    let active = true
    Promise.all([getCollections(), getPayableInvoices()])
      .then(([collectionData, invoiceData]) => {
        if (!active) return
        setCollections(collectionData)
        setPayableInvoices(invoiceData)
      })
      .catch((error) => {
        console.error('Failed to load collections', error)
        alert((error as Error).message || 'Failed to load collections')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredCollections = useMemo(() => {
    return collections.filter((c) => {
      const matchesSearch =
        c.collectionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesMethod =
        methodFilter === 'all' || c.paymentMethod === methodFilter
      return matchesSearch && matchesMethod
    })
  }, [collections, searchTerm, methodFilter])

  const totalCollected = useMemo(
    () => filteredCollections.reduce((sum, c) => sum + c.amount, 0),
    [filteredCollections]
  )

  const totalPages = Math.ceil(filteredCollections.length / ITEMS_PER_PAGE)
  const paginatedCollections = filteredCollections.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatAmount = (amount: number) =>
    '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(amount)

  // ---- Handlers ----
  const handleCreate = async (data: CollectionInput) => {
    setIsSaving(true)
    try {
      const created = await createCollection(data)
      setCollections((prev) => [created, ...prev])
      await refreshPayable() // due changed → refresh dropdown
      setNewModalOpen(false)
    } catch (error) {
      console.error('Failed to record collection', error)
      alert((error as Error).message || 'Failed to record collection')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = async (data: CollectionInput) => {
    if (!selected) return
    setIsSaving(true)
    try {
      const updated = await updateCollection(selected.id, data)
      setCollections((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      await refreshPayable()
      setEditModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to update collection', error)
      alert((error as Error).message || 'Failed to update collection')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setIsSaving(true)
    try {
      await deleteCollection(selected.id)
      setCollections((prev) => prev.filter((c) => c.id !== selected.id))
      await refreshPayable()
      setDeleteModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to delete collection', error)
      alert((error as Error).message || 'Failed to delete collection')
    } finally {
      setIsSaving(false)
    }
  }

  const openWithDetail = async (
    id: string,
    which: 'view' | 'edit' | 'delete'
  ) => {
    try {
      const detail = await getCollection(id)
      setSelected(detail)
      if (which === 'view') setViewModalOpen(true)
      else if (which === 'edit') setEditModalOpen(true)
      else setDeleteModalOpen(true)
    } catch (error) {
      console.error('Failed to load collection', error)
      alert((error as Error).message || 'Failed to load collection')
    }
  }

  return (
    <DashboardLayout title="Collections">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Collections</h1>
            <p className="text-sm text-muted-foreground">
              Track all payment collections ({filteredCollections.length}) ·{' '}
              <span className="font-semibold text-green-600">
                {formatAmount(totalCollected)}
              </span>{' '}
              collected
            </p>
          </div>
          <Button className="gap-2" onClick={() => setNewModalOpen(true)}>
            <Plus className="size-4" />
            New Collection
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
                  placeholder="Search by collection, invoice, or company..."
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
                Payment Method
              </label>
              <Select
                value={methodFilter}
                onValueChange={(value) => {
                  setMethodFilter(value as string)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METHOD_FILTERS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {(searchTerm || methodFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setMethodFilter('all')
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
                <p className="text-sm text-muted-foreground">Loading collections...</p>
              </div>
            </div>
          ) : filteredCollections.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <Wallet className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">
                  No collections found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || methodFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Record a payment against an invoice to get started'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Collection No</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCollections.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-medium">
                      {c.collectionNo}
                    </TableCell>
                    <TableCell>{c.companyName}</TableCell>
                    <TableCell className="font-mono text-sm">{c.invoiceNo}</TableCell>
                    <TableCell>
                      {new Date(c.collectionDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-green-600">
                      {formatAmount(c.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{methodLabel(c.paymentMethod as PaymentMethod)}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {c.referenceNo || '—'}
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
                            onClick={() => openWithDetail(c.id, 'view')}
                          >
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => openWithDetail(c.id, 'edit')}
                          >
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => openWithDetail(c.id, 'delete')}
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
              {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredCollections.length)}{' '}
              to {Math.min(currentPage * ITEMS_PER_PAGE, filteredCollections.length)} of{' '}
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

        {/* Modals */}
        <NewCollectionModal
          open={newModalOpen}
          onOpenChange={setNewModalOpen}
          invoices={payableInvoices}
          onSubmit={handleCreate}
          isLoading={isSaving}
        />

        <EditCollectionModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          collection={selected}
          onSubmit={handleEdit}
          isLoading={isSaving}
        />

        <ViewCollectionModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          collection={selected}
        />

        <DeleteCollectionModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          collection={selected}
          onConfirm={handleDelete}
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  )
}
