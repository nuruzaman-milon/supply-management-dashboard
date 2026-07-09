'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'
import {
  GenericAddModal,
  GenericViewModal,
} from '@/components/generic-modals'
import type { CollectionInput, PaymentMethod } from '@/app/actions/collection.actions'
import type {
  DueListDTO,
  DueDetailDTO,
  AdjustmentInput,
  AdjustmentType,
} from '@/app/actions/due.actions'

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'MOBILE_BANKING', label: 'Mobile Banking' },
  { value: 'CHEQUE', label: 'Cheque' },
]

const ADJUSTMENT_OPTIONS: { value: AdjustmentType; label: string }[] = [
  { value: 'DISCOUNT', label: 'Discount' },
  { value: 'WAIVER', label: 'Waiver' },
  { value: 'CORRECTION', label: 'Correction' },
  { value: 'WRITE_OFF', label: 'Write-off' },
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

export function methodLabel(method: string) {
  return METHOD_OPTIONS.find((m) => m.value === method)?.label ?? method
}
export function adjustmentLabel(type: AdjustmentType) {
  return ADJUSTMENT_OPTIONS.find((a) => a.value === type)?.label ?? type
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ---- Collect Payment modal (scoped to one invoice) -----------------------

interface CollectPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  due: DueListDTO | null
  onSubmit: (data: CollectionInput) => void
  isLoading?: boolean
}

export function CollectPaymentModal({
  open,
  onOpenChange,
  due,
  onSubmit,
  isLoading = false,
}: CollectPaymentModalProps) {
  if (!due) return null
  return (
    <CollectPaymentForm
      key={due.invoiceId}
      open={open}
      onOpenChange={onOpenChange}
      due={due}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  )
}

function CollectPaymentForm({
  open,
  onOpenChange,
  due,
  onSubmit,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  due: DueListDTO
  onSubmit: (data: CollectionInput) => void
  isLoading: boolean
}) {
  const [collectionDate, setCollectionDate] = useState(todayISO())
  const [amount, setAmount] = useState(String(due.dueAmount))
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [referenceNo, setReferenceNo] = useState('')
  const [remarks, setRemarks] = useState('')

  const over = (Number(amount) || 0) - due.dueAmount > 0.005

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      invoiceId: due.invoiceId,
      collectionDate,
      amount: Number(amount) || 0,
      paymentMethod,
      referenceNo,
      remarks,
    })
  }

  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Collect Payment"
      description="Record a payment against this invoice. All fields marked with"
      helpText="This updates the invoice's paid amount and status automatically."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
          <div>
            <p className="text-sm text-muted-foreground">{due.companyName}</p>
            <p className="font-mono font-semibold text-foreground">{due.invoiceNo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Outstanding Due</p>
            <p className="text-lg font-bold text-amber-600">
              {formatCurrency(due.dueAmount)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
              Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              max={due.dueAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(inputClass, 'text-right', over && 'border-destructive')}
              required
            />
            {over && (
              <p className="text-xs text-destructive">Amount exceeds the outstanding due.</p>
            )}
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="collectionDate" className="text-sm font-semibold text-foreground">
              Collection Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="collectionDate"
              type="date"
              value={collectionDate}
              onChange={(e) => setCollectionDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="paymentMethod" className="text-sm font-semibold text-foreground">
              Payment Method <span className="text-destructive">*</span>
            </Label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className={selectClass}
            >
              {METHOD_OPTIONS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="referenceNo" className="text-sm font-semibold text-foreground">
              Reference No
            </Label>
            <Input
              id="referenceNo"
              placeholder="Txn / cheque no (optional)"
              value={referenceNo}
              onChange={(e) => setReferenceNo(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="remarks" className="text-sm font-semibold text-foreground">
            Remarks
          </Label>
          <Textarea
            id="remarks"
            placeholder="Any additional notes..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> Indicates required fields
          </p>
          <Button type="submit" disabled={isLoading || over} className="min-w-[140px]">
            {isLoading ? 'Saving...' : 'Record Payment'}
          </Button>
        </div>
      </form>
    </GenericAddModal>
  )
}

// ---- Adjustment modal ----------------------------------------------------

interface AdjustmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  due: DueListDTO | null
  onSubmit: (data: AdjustmentInput) => void
  isLoading?: boolean
}

export function AdjustmentModal({
  open,
  onOpenChange,
  due,
  onSubmit,
  isLoading = false,
}: AdjustmentModalProps) {
  if (!due) return null
  return (
    <AdjustmentForm
      key={due.invoiceId}
      open={open}
      onOpenChange={onOpenChange}
      due={due}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  )
}

function AdjustmentForm({
  open,
  onOpenChange,
  due,
  onSubmit,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  due: DueListDTO
  onSubmit: (data: AdjustmentInput) => void
  isLoading: boolean
}) {
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType>('DISCOUNT')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')

  const over = (Number(amount) || 0) - due.dueAmount > 0.005

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      invoiceId: due.invoiceId,
      adjustmentType,
      amount: Number(amount) || 0,
      reason,
    })
  }

  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Adjustment"
      description="Reduce the outstanding due without a cash payment. All fields marked with"
      helpText="Use adjustments for discounts, waivers, corrections, or writing off bad debt."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
          <div>
            <p className="text-sm text-muted-foreground">{due.companyName}</p>
            <p className="font-mono font-semibold text-foreground">{due.invoiceNo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Outstanding Due</p>
            <p className="text-lg font-bold text-amber-600">
              {formatCurrency(due.dueAmount)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2.5">
            <Label htmlFor="adjustmentType" className="text-sm font-semibold text-foreground">
              Type <span className="text-destructive">*</span>
            </Label>
            <select
              id="adjustmentType"
              value={adjustmentType}
              onChange={(e) => setAdjustmentType(e.target.value as AdjustmentType)}
              className={selectClass}
            >
              {ADJUSTMENT_OPTIONS.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2.5">
            <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
              Amount <span className="text-destructive">*</span>
            </Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              max={due.dueAmount}
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(inputClass, 'text-right', over && 'border-destructive')}
              required
            />
            {over && (
              <p className="text-xs text-destructive">Adjustment exceeds the outstanding due.</p>
            )}
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="reason" className="text-sm font-semibold text-foreground">
            Reason
          </Label>
          <Textarea
            id="reason"
            placeholder="Why is this adjustment being made?"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
          <p className="text-xs text-muted-foreground">
            <span className="text-destructive">*</span> Indicates required fields
          </p>
          <Button type="submit" disabled={isLoading || over} className="min-w-[140px]">
            {isLoading ? 'Saving...' : 'Record Adjustment'}
          </Button>
        </div>
      </form>
    </GenericAddModal>
  )
}

// ---- View Due modal ------------------------------------------------------

interface ViewDueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  detail: DueDetailDTO | null
  onDeleteAdjustment: (id: string) => void
  deletingAdjustmentId?: string | null
}

export function ViewDueModal({
  open,
  onOpenChange,
  detail,
  onDeleteAdjustment,
  deletingAdjustmentId,
}: ViewDueModalProps) {
  if (!detail) return null

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={detail.invoiceNo}
      subtitle={`Due details · ${detail.companyName}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="grid gap-4 rounded-lg border border-border/50 bg-secondary/20 p-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Invoice Date</p>
            <p className="text-base font-semibold text-foreground">
              {new Date(detail.invoiceDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Due Date</p>
            <p className="text-base font-semibold text-foreground">
              {new Date(detail.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Overdue</p>
            {detail.overdue ? (
              <Badge variant="destructive">{detail.daysOverdue} days overdue</Badge>
            ) : (
              <Badge variant="secondary">Not overdue</Badge>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Invoice Amount</span>
              <span className="font-medium">{formatCurrency(detail.invoiceAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Paid</span>
              <span className="font-medium text-green-600">
                {formatCurrency(detail.paidAmount)}
              </span>
            </div>
            {detail.adjustmentTotal > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Adjustments</span>
                <span className="font-medium">− {formatCurrency(detail.adjustmentTotal)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold">
              <span>Due</span>
              <span className="text-amber-600">{formatCurrency(detail.dueAmount)}</span>
            </div>
          </div>
        </div>

        {/* Collections */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="mb-3 font-semibold text-foreground">
            Collections ({detail.collections.length})
          </h4>
          {detail.collections.length === 0 ? (
            <p className="rounded-md bg-secondary/40 px-3 py-4 text-center text-sm text-muted-foreground">
              No payments recorded yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="py-2 font-medium">Collection</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Method</th>
                    <th className="py-2 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.collections.map((c) => (
                    <tr key={c.id} className="border-b border-border/40">
                      <td className="py-2 font-mono text-xs">{c.collectionNo}</td>
                      <td className="py-2">
                        {new Date(c.collectionDate).toLocaleDateString()}
                      </td>
                      <td className="py-2">
                        <Badge variant="outline">{methodLabel(c.paymentMethod)}</Badge>
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

        {/* Adjustments */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="mb-3 font-semibold text-foreground">
            Adjustments ({detail.adjustments.length})
          </h4>
          {detail.adjustments.length === 0 ? (
            <p className="rounded-md bg-secondary/40 px-3 py-4 text-center text-sm text-muted-foreground">
              No adjustments on this invoice.
            </p>
          ) : (
            <div className="space-y-2">
              {detail.adjustments.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-3 rounded-md border border-border/40 bg-card p-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{adjustmentLabel(a.adjustmentType)}</Badge>
                      <span className="font-semibold text-foreground">
                        {formatCurrency(a.amount)}
                      </span>
                    </div>
                    {a.reason && (
                      <p className="mt-1 truncate text-xs text-muted-foreground">{a.reason}</p>
                    )}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {new Date(a.createdAt).toLocaleDateString()} · {a.createdByName}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 shrink-0 text-destructive hover:text-destructive"
                    onClick={() => onDeleteAdjustment(a.id)}
                    disabled={deletingAdjustmentId === a.id}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GenericViewModal>
  )
}
