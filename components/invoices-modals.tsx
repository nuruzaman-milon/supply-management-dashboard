'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  GenericAddModal,
  GenericEditModal,
  GenericViewModal,
  GenericDeleteModal,
} from '@/components/generic-modals'
import type {
  InvoiceDetailDTO,
  InvoiceStatus,
  GenerateInvoiceInput,
  UpdateInvoiceInput,
  UninvoicedSupplyDTO,
} from '@/app/actions/invoice.actions'

const STATUS_OPTIONS: { value: InvoiceStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'UNPAID', label: 'Unpaid' },
  { value: 'PARTIALLY_PAID', label: 'Partially Paid' },
  { value: 'PAID', label: 'Paid' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const inputClass =
  'border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
const selectClass = cn(
  inputClass,
  'flex h-9 w-full rounded-lg px-3 py-2 text-sm outline-none'
)

function formatCurrency(value: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(value)
}

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: 'Cash',
  BANK_TRANSFER: 'Bank Transfer',
  MOBILE_BANKING: 'Mobile Banking',
  CHEQUE: 'Cheque',
}

function paymentMethodLabel(method: string) {
  return PAYMENT_METHOD_LABELS[method] ?? method
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// dueDate default: 30 days out from today.
function defaultDueISO() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().split('T')[0]
}

export function statusBadgeVariant(status: InvoiceStatus, isOverdue: boolean) {
  if (isOverdue) return 'destructive' as const
  switch (status) {
    case 'PAID':
      return 'default' as const
    case 'PARTIALLY_PAID':
      return 'secondary' as const
    case 'CANCELLED':
      return 'outline' as const
    case 'DRAFT':
      return 'outline' as const
    default:
      return 'secondary' as const
  }
}

export function statusLabel(status: InvoiceStatus, isOverdue: boolean) {
  if (isOverdue) return 'Overdue'
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

// ---- Generate (create) modal --------------------------------------------

interface GenerateInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplies: UninvoicedSupplyDTO[]
  onSubmit: (data: GenerateInvoiceInput) => void
  isLoading?: boolean
}

export function GenerateInvoiceModal({
  open,
  onOpenChange,
  supplies,
  onSubmit,
  isLoading = false,
}: GenerateInvoiceModalProps) {
  const [supplyId, setSupplyId] = useState('')
  const [invoiceDate, setInvoiceDate] = useState(todayISO())
  const [dueDate, setDueDate] = useState(defaultDueISO())
  const [status, setStatus] = useState<InvoiceStatus>('UNPAID')
  const [notes, setNotes] = useState('')

  const supplyMap = useMemo(
    () => new Map(supplies.map((s) => [s.id, s])),
    [supplies]
  )
  const selectedSupply = supplyMap.get(supplyId)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ supplyId, invoiceDate, dueDate, status, notes })
  }

  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Generate Invoice"
      description="Create an invoice from a supply. All fields marked with"
      helpText="The invoice total is taken from the selected supply's grand total."
    >
      {supplies.length === 0 ? (
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No un-invoiced supplies available. Create a supply first, or every
            supply already has an invoice.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="supplyId" className="text-sm font-semibold text-foreground">
              Supply <span className="text-destructive">*</span>
            </Label>
            <select
              id="supplyId"
              value={supplyId}
              onChange={(e) => setSupplyId(e.target.value)}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Select an un-invoiced supply
              </option>
              {supplies.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.supplyNo} — {s.companyName} ({formatCurrency(s.grandTotal)})
                </option>
              ))}
            </select>
          </div>

          {selectedSupply && (
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div>
                <p className="text-sm text-muted-foreground">Invoice for</p>
                <p className="font-semibold text-foreground">
                  {selectedSupply.companyName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(selectedSupply.grandTotal)}
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2.5">
              <Label htmlFor="invoiceDate" className="text-sm font-semibold text-foreground">
                Invoice Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="invoiceDate"
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
                Due Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
                required
              />
            </div>
            <div className="space-y-2.5">
              <Label htmlFor="status" className="text-sm font-semibold text-foreground">
                Status <span className="text-destructive">*</span>
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className={selectClass}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes for this invoice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
            <p className="text-xs text-muted-foreground">
              <span className="text-destructive">*</span> Indicates required fields
            </p>
            <Button type="submit" disabled={isLoading || !supplyId} className="min-w-[140px]">
              {isLoading ? 'Generating...' : 'Generate Invoice'}
            </Button>
          </div>
        </form>
      )}
    </GenericAddModal>
  )
}

// ---- Edit modal ----------------------------------------------------------

interface EditInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: InvoiceDetailDTO | null
  onSubmit: (data: UpdateInvoiceInput) => void
  isLoading?: boolean
}

export function EditInvoiceModal({
  open,
  onOpenChange,
  invoice,
  onSubmit,
  isLoading = false,
}: EditInvoiceModalProps) {
  if (!invoice) return null
  return (
    <EditInvoiceForm
      key={invoice.id}
      open={open}
      onOpenChange={onOpenChange}
      invoice={invoice}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  )
}

function EditInvoiceForm({
  open,
  onOpenChange,
  invoice,
  onSubmit,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: InvoiceDetailDTO
  onSubmit: (data: UpdateInvoiceInput) => void
  isLoading: boolean
}) {
  const [invoiceDate, setInvoiceDate] = useState(invoice.invoiceDate.split('T')[0])
  const [dueDate, setDueDate] = useState(invoice.dueDate.split('T')[0])
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status)
  const [notes, setNotes] = useState(invoice.notes)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({ invoiceDate, dueDate, status, notes })
  }

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Invoice"
      description="Update the information for"
      entityName={invoice.invoiceNo}
      helpText="The amount comes from the linked supply and cannot be changed here."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {invoice.companyName} · Supply {invoice.supplyNo}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-lg font-bold text-green-600">
              {formatCurrency(invoice.totalAmount)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor="invoiceDate" className="text-sm font-semibold text-foreground">
              Invoice Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="invoiceDate"
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
              Due Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="status" className="text-sm font-semibold text-foreground">
              Status <span className="text-destructive">*</span>
            </Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
              className={selectClass}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
            Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any additional notes for this invoice..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> Indicates required fields
          </p>
          <Button type="submit" disabled={isLoading} className="min-w-[140px]">
            {isLoading ? 'Saving...' : 'Update Invoice'}
          </Button>
        </div>
      </form>
    </GenericEditModal>
  )
}

// ---- View modal ----------------------------------------------------------

interface ViewInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: InvoiceDetailDTO | null
}

export function ViewInvoiceModal({
  open,
  onOpenChange,
  invoice,
}: ViewInvoiceModalProps) {
  if (!invoice) return null

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={invoice.invoiceNo}
      subtitle="Complete invoice information"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="grid gap-4 rounded-lg border border-border/50 bg-secondary/20 p-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Company</p>
            <p className="text-base font-semibold text-foreground">{invoice.companyName}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Supply</p>
            <p className="text-base font-semibold font-mono text-foreground">
              {invoice.supplyNo}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Invoice Date</p>
            <p className="text-base font-semibold text-foreground">
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Due Date</p>
            <p className="text-base font-semibold text-foreground">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={statusBadgeVariant(invoice.status, invoice.isOverdue)}>
              {statusLabel(invoice.status, invoice.isOverdue)}
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Created By</p>
            <p className="text-base font-semibold text-foreground">{invoice.createdByName}</p>
          </div>
        </div>

        {/* Line items */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="mb-3 font-semibold text-foreground">
            Items ({invoice.items.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 font-medium">Product</th>
                  <th className="py-2 text-right font-medium">Qty</th>
                  <th className="py-2 text-right font-medium">Unit Price</th>
                  <th className="py-2 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((it) => (
                  <tr key={it.id} className="border-b border-border/40">
                    <td className="py-2">
                      <span className="font-medium text-foreground">{it.productName}</span>
                      <span className="ml-2 font-mono text-xs text-muted-foreground">
                        {it.productSku}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      {it.quantity} {it.unit}
                    </td>
                    <td className="py-2 text-right">{formatCurrency(it.unitPrice)}</td>
                    <td className="py-2 text-right font-semibold">
                      {formatCurrency(it.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Payment summary */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-medium">{formatCurrency(invoice.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid</span>
              <span className="font-medium text-green-600">
                {formatCurrency(invoice.paidAmount)}
              </span>
            </div>
            {invoice.adjustmentTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adjustments</span>
                <span className="font-medium">
                  − {formatCurrency(invoice.adjustmentTotal)}
                </span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold">
              <span>Due</span>
              <span className={invoice.dueAmount > 0 ? 'text-amber-600' : 'text-green-600'}>
                {formatCurrency(invoice.dueAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment history — an invoice can have multiple collections */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="font-semibold text-foreground">
              Collections ({invoice.collections.length})
            </h4>
            {invoice.collections.length > 0 && (
              <span className="text-sm text-muted-foreground">
                {formatCurrency(invoice.paidAmount)} collected
              </span>
            )}
          </div>

          {invoice.collections.length === 0 ? (
            <p className="rounded-md bg-secondary/40 px-3 py-4 text-center text-sm text-muted-foreground">
              No payments recorded against this invoice yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 font-medium">Collection</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Method</th>
                    <th className="py-2 font-medium">Reference</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.collections.map((c) => (
                    <tr key={c.id} className="border-b border-border/40">
                      <td className="py-2 font-mono text-xs font-medium text-foreground">
                        {c.collectionNo}
                      </td>
                      <td className="py-2">
                        {new Date(c.collectionDate).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline">
                          {paymentMethodLabel(c.paymentMethod)}
                        </Badge>
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {c.referenceNo || '—'}
                      </td>
                      <td className="py-2 text-right font-semibold text-green-600">
                        {formatCurrency(c.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {invoice.notes && (
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
            <h4 className="mb-2 font-semibold text-foreground">Notes</h4>
            <p className="whitespace-pre-wrap text-base text-foreground">{invoice.notes}</p>
          </div>
        )}
      </div>
    </GenericViewModal>
  )
}

// ---- Delete modal --------------------------------------------------------

interface DeleteInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: InvoiceDetailDTO | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteInvoiceModal({
  open,
  onOpenChange,
  invoice,
  onConfirm,
  isLoading,
}: DeleteInvoiceModalProps) {
  if (!invoice) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Invoice"
      message="Are you sure you want to permanently delete"
      itemName={invoice.invoiceNo}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
