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
  CollectionDetailDTO,
  CollectionInput,
  PaymentMethod,
  PayableInvoiceDTO,
} from '@/app/actions/collection.actions'

const METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'CASH', label: 'Cash' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
  { value: 'MOBILE_BANKING', label: 'Mobile Banking' },
  { value: 'CHEQUE', label: 'Cheque' },
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

export function methodLabel(method: PaymentMethod) {
  return METHOD_OPTIONS.find((m) => m.value === method)?.label ?? method
}

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

// ---- New collection modal ------------------------------------------------

interface NewCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoices: PayableInvoiceDTO[]
  onSubmit: (data: CollectionInput) => void
  isLoading?: boolean
}

export function NewCollectionModal({
  open,
  onOpenChange,
  invoices,
  onSubmit,
  isLoading = false,
}: NewCollectionModalProps) {
  const [invoiceId, setInvoiceId] = useState('')
  const [collectionDate, setCollectionDate] = useState(todayISO())
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH')
  const [referenceNo, setReferenceNo] = useState('')
  const [remarks, setRemarks] = useState('')

  const invoiceMap = useMemo(
    () => new Map(invoices.map((i) => [i.id, i])),
    [invoices]
  )
  const selected = invoiceMap.get(invoiceId)

  const handleInvoiceChange = (id: string) => {
    setInvoiceId(id)
    const inv = invoiceMap.get(id)
    // Default to paying the full outstanding due (editable).
    setAmount(inv ? String(inv.dueAmount) : '')
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      invoiceId,
      collectionDate,
      amount: Number(amount) || 0,
      paymentMethod,
      referenceNo,
      remarks,
    })
  }

  const over = selected ? (Number(amount) || 0) - selected.dueAmount > 0.005 : false

  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Record Collection"
      description="Record a payment against an invoice. All fields marked with"
      helpText="Recording a payment updates the invoice's paid amount and status automatically."
    >
      {invoices.length === 0 ? (
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No invoices are awaiting payment. Every invoice is either fully paid
            or cancelled.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2.5">
            <Label htmlFor="invoiceId" className="text-sm font-semibold text-foreground">
              Invoice <span className="text-destructive">*</span>
            </Label>
            <select
              id="invoiceId"
              value={invoiceId}
              onChange={(e) => handleInvoiceChange(e.target.value)}
              required
              className={selectClass}
            >
              <option value="" disabled>
                Select an invoice with a due balance
              </option>
              {invoices.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNo} — {inv.companyName} (due {formatCurrency(inv.dueAmount)})
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
              <div>
                <p className="text-sm text-muted-foreground">{selected.companyName}</p>
                <p className="font-semibold text-foreground">{selected.invoiceNo}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Outstanding Due</p>
                <p className="text-lg font-bold text-amber-600">
                  {formatCurrency(selected.dueAmount)}
                </p>
              </div>
            </div>
          )}

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
                max={selected?.dueAmount}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={cn(inputClass, 'text-right', over && 'border-destructive')}
                required
              />
              {over && (
                <p className="text-xs text-destructive">
                  Amount exceeds the outstanding due.
                </p>
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
            <Button
              type="submit"
              disabled={isLoading || !invoiceId || over}
              className="min-w-[140px]"
            >
              {isLoading ? 'Saving...' : 'Record Collection'}
            </Button>
          </div>
        </form>
      )}
    </GenericAddModal>
  )
}

// ---- Edit collection modal -----------------------------------------------

interface EditCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: CollectionDetailDTO | null
  onSubmit: (data: CollectionInput) => void
  isLoading?: boolean
}

export function EditCollectionModal({
  open,
  onOpenChange,
  collection,
  onSubmit,
  isLoading = false,
}: EditCollectionModalProps) {
  if (!collection) return null
  return (
    <EditCollectionForm
      key={collection.id}
      open={open}
      onOpenChange={onOpenChange}
      collection={collection}
      onSubmit={onSubmit}
      isLoading={isLoading}
    />
  )
}

function EditCollectionForm({
  open,
  onOpenChange,
  collection,
  onSubmit,
  isLoading,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: CollectionDetailDTO
  onSubmit: (data: CollectionInput) => void
  isLoading: boolean
}) {
  const [collectionDate, setCollectionDate] = useState(
    collection.collectionDate.split('T')[0]
  )
  const [amount, setAmount] = useState(String(collection.amount))
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    collection.paymentMethod
  )
  const [referenceNo, setReferenceNo] = useState(collection.referenceNo)
  const [remarks, setRemarks] = useState(collection.remarks)

  const over = (Number(amount) || 0) - collection.maxAmount > 0.005

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit({
      invoiceId: collection.invoiceId,
      collectionDate,
      amount: Number(amount) || 0,
      paymentMethod,
      referenceNo,
      remarks,
    })
  }

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Collection"
      description="Update the information for"
      entityName={collection.collectionNo}
      helpText="The invoice cannot be changed. Its status updates automatically after saving."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-4">
          <div>
            <p className="text-sm text-muted-foreground">{collection.companyName}</p>
            <p className="font-semibold text-foreground">{collection.invoiceNo}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Max Payable</p>
            <p className="text-lg font-bold text-amber-600">
              {formatCurrency(collection.maxAmount)}
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
              max={collection.maxAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={cn(inputClass, 'text-right', over && 'border-destructive')}
              required
            />
            {over && (
              <p className="text-xs text-destructive">
                Amount exceeds the invoice&apos;s payable balance.
              </p>
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
            {isLoading ? 'Saving...' : 'Update Collection'}
          </Button>
        </div>
      </form>
    </GenericEditModal>
  )
}

// ---- View collection modal -----------------------------------------------

interface ViewCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: CollectionDetailDTO | null
}

export function ViewCollectionModal({
  open,
  onOpenChange,
  collection,
}: ViewCollectionModalProps) {
  if (!collection) return null

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={collection.collectionNo}
      subtitle="Complete collection information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Company</p>
              <p className="text-base font-semibold text-foreground">
                {collection.companyName}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Invoice</p>
              <p className="font-mono text-base font-semibold text-foreground">
                {collection.invoiceNo}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Amount</p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(collection.amount)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Collection Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {new Date(collection.collectionDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Payment Method
              </p>
              <Badge variant="outline">{methodLabel(collection.paymentMethod)}</Badge>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Reference No
              </p>
              <p className="text-base font-semibold text-foreground">
                {collection.referenceNo || '—'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                Invoice Total
              </p>
              <p className="text-base font-semibold text-foreground">
                {formatCurrency(collection.invoiceTotal)}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Created By</p>
              <p className="text-base font-semibold text-foreground">
                {collection.createdByName}
              </p>
            </div>
          </div>
        </div>

        {collection.remarks && (
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
            <h4 className="mb-2 font-semibold text-foreground">Remarks</h4>
            <p className="whitespace-pre-wrap text-base text-foreground">
              {collection.remarks}
            </p>
          </div>
        )}
      </div>
    </GenericViewModal>
  )
}

// ---- Delete collection modal ---------------------------------------------

interface DeleteCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: CollectionDetailDTO | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteCollectionModal({
  open,
  onOpenChange,
  collection,
  onConfirm,
  isLoading,
}: DeleteCollectionModalProps) {
  if (!collection) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Collection"
      message="Are you sure you want to permanently delete"
      itemName={collection.collectionNo}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
