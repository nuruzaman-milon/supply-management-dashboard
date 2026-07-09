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
  CollectPaymentModal,
  AdjustmentModal,
  ViewDueModal,
} from '@/components/due-management-modals'
import {
  AlertCircle,
  Clock,
  Search,
  MoreHorizontal,
  Eye,
  DollarSign,
  TrendingUp,
  SlidersHorizontal,
} from 'lucide-react'
import {
  getDueList,
  getDueDetail,
  createAdjustment,
  deleteAdjustment,
  type DueListDTO,
  type DueDetailDTO,
  type AdjustmentInput,
} from '@/app/actions/due.actions'
import {
  createCollection,
  type CollectionInput,
} from '@/app/actions/collection.actions'

const ITEMS_PER_PAGE = 10

export default function DueListPage() {
  const [dues, setDues] = useState<DueListDTO[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)

  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [deletingAdjustmentId, setDeletingAdjustmentId] = useState<string | null>(null)

  const [collectModalOpen, setCollectModalOpen] = useState(false)
  const [adjustModalOpen, setAdjustModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selected, setSelected] = useState<DueListDTO | null>(null)
  const [detail, setDetail] = useState<DueDetailDTO | null>(null)

  const loadDues = async () => {
    const data = await getDueList()
    setDues(data)
  }

  useEffect(() => {
    let active = true
    getDueList()
      .then((data) => {
        if (active) setDues(data)
      })
      .catch((error) => {
        console.error('Failed to load dues', error)
        alert((error as Error).message || 'Failed to load dues')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  // Summary totals
  const { totalDue, overdueDue, upcomingDue } = useMemo(() => {
    let total = 0
    let overdue = 0
    let upcoming = 0
    for (const d of dues) {
      total += d.dueAmount
      if (d.overdue) overdue += d.dueAmount
      else upcoming += d.dueAmount
    }
    return { totalDue: total, overdueDue: overdue, upcomingDue: upcoming }
  }, [dues])

  const filteredDues = useMemo(() => {
    return dues.filter((d) => {
      const matchesSearch =
        d.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'overdue' && d.overdue) ||
        (statusFilter === 'upcoming' && !d.overdue)
      return matchesSearch && matchesStatus
    })
  }, [dues, searchTerm, statusFilter])

  const totalPages = Math.ceil(filteredDues.length / ITEMS_PER_PAGE)
  const paginatedDues = filteredDues.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatAmount = (amount: number) =>
    '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(amount)

  // ---- Handlers ----
  const handleCollect = async (data: CollectionInput) => {
    setIsSaving(true)
    try {
      await createCollection(data)
      await loadDues()
      setCollectModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to record payment', error)
      alert((error as Error).message || 'Failed to record payment')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAdjust = async (data: AdjustmentInput) => {
    setIsSaving(true)
    try {
      await createAdjustment(data)
      await loadDues()
      setAdjustModalOpen(false)
      setSelected(null)
    } catch (error) {
      console.error('Failed to record adjustment', error)
      alert((error as Error).message || 'Failed to record adjustment')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAdjustment = async (id: string) => {
    if (!detail) return
    setDeletingAdjustmentId(id)
    try {
      await deleteAdjustment(id)
      // Refresh the open detail + the list behind it.
      const [refreshedDetail] = await Promise.all([
        getDueDetail(detail.invoiceId).catch(() => null),
        loadDues(),
      ])
      if (refreshedDetail) setDetail(refreshedDetail)
      else setViewModalOpen(false) // invoice fully settled → no longer a due
    } catch (error) {
      console.error('Failed to delete adjustment', error)
      alert((error as Error).message || 'Failed to delete adjustment')
    } finally {
      setDeletingAdjustmentId(null)
    }
  }

  const openCollect = (due: DueListDTO) => {
    setSelected(due)
    setCollectModalOpen(true)
  }

  const openAdjust = (due: DueListDTO) => {
    setSelected(due)
    setAdjustModalOpen(true)
  }

  const openView = async (due: DueListDTO) => {
    try {
      const d = await getDueDetail(due.invoiceId)
      setDetail(d)
      setViewModalOpen(true)
    } catch (error) {
      console.error('Failed to load due detail', error)
      alert((error as Error).message || 'Failed to load due detail')
    }
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

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
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

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Overdue
                </p>
                <p className="mt-2 text-2xl font-bold text-destructive">
                  {formatAmount(overdueDue)}
                </p>
              </div>
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-950/40">
                <AlertCircle className="size-5 text-destructive" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Upcoming
                </p>
                <p className="mt-2 text-2xl font-bold text-amber-600">
                  {formatAmount(upcomingDue)}
                </p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3 dark:bg-amber-950/40">
                <Clock className="size-5 text-amber-600" />
              </div>
            </div>
          </Card>
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
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
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

        {/* Due table */}
        <Card className="overflow-hidden">
          {isFetching ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
                <p className="text-sm text-muted-foreground">Loading dues...</p>
              </div>
            </div>
          ) : filteredDues.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <DollarSign className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">No dues found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'All invoices are fully settled'}
                </p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Invoice</TableHead>
                  <TableHead className="text-right">Invoice Amount</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Days Overdue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDues.map((due) => (
                  <TableRow key={due.invoiceId}>
                    <TableCell className="font-medium">{due.companyName}</TableCell>
                    <TableCell className="font-mono text-sm">{due.invoiceNo}</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatAmount(due.invoiceAmount)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      {formatAmount(due.paidAmount)}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-amber-600">
                      {formatAmount(due.dueAmount)}
                    </TableCell>
                    <TableCell>{new Date(due.dueDate).toLocaleDateString()}</TableCell>
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
                      <Badge variant={due.overdue ? 'destructive' : 'secondary'}>
                        {due.overdue ? 'Overdue' : 'Upcoming'}
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
                            onClick={() => openView(due)}
                          >
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => openCollect(due)}
                          >
                            <TrendingUp className="size-4" />
                            Collect Payment
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => openAdjust(due)}
                          >
                            <SlidersHorizontal className="size-4" />
                            Record Adjustment
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
              {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredDues.length)} to{' '}
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredDues.length)} of{' '}
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

        {/* Modals */}
        <CollectPaymentModal
          open={collectModalOpen}
          onOpenChange={setCollectModalOpen}
          due={selected}
          onSubmit={handleCollect}
          isLoading={isSaving}
        />

        <AdjustmentModal
          open={adjustModalOpen}
          onOpenChange={setAdjustModalOpen}
          due={selected}
          onSubmit={handleAdjust}
          isLoading={isSaving}
        />

        <ViewDueModal
          open={viewModalOpen}
          onOpenChange={setViewModalOpen}
          detail={detail}
          onDeleteAdjustment={handleDeleteAdjustment}
          deletingAdjustmentId={deletingAdjustmentId}
        />
      </div>
    </DashboardLayout>
  )
}
