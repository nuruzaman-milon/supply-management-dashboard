'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import {
  GenericAddModal,
  GenericEditModal,
  GenericViewModal,
  GenericDeleteModal,
} from '@/components/generic-modals'
import { unitLabel } from '@/lib/units'
import type {
  SupplyDetailDTO,
  SupplyInput,
  SupplyStatus,
  DiscountKind,
} from '@/app/actions/supply.actions'

export type CompanyOption = { id: string; name: string }
export type ProductOption = {
  id: string
  name: string
  sku: string
  unit: string
  sellingPrice: number
}

const STATUS_OPTIONS: { value: SupplyStatus; label: string }[] = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'PARTIAL_DELIVERED', label: 'Partially Delivered' },
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

function statusLabel(status: SupplyStatus) {
  return STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

// ---- Form ----------------------------------------------------------------

type LineRow = { productId: string; quantity: string; unitPrice: string }

interface SupplyFormProps {
  supply?: SupplyDetailDTO
  companies: CompanyOption[]
  products: ProductOption[]
  onSubmit: (data: SupplyInput) => void
  isLoading?: boolean
}

function todayISO() {
  // yyyy-mm-dd for the date input; supply?.supplyDate is a full ISO string.
  return new Date().toISOString().split('T')[0]
}

function SupplyForm({
  supply,
  companies,
  products,
  onSubmit,
  isLoading = false,
}: SupplyFormProps) {
  const [companyId, setCompanyId] = useState(supply?.companyId || '')
  const [supplyDate, setSupplyDate] = useState(
    supply ? supply.supplyDate.split('T')[0] : todayISO()
  )
  const [status, setStatus] = useState<SupplyStatus>(supply?.status || 'PENDING')
  const [rows, setRows] = useState<LineRow[]>(
    supply && supply.items.length
      ? supply.items.map((it) => ({
          productId: it.productId,
          quantity: String(it.quantity),
          unitPrice: String(it.unitPrice),
        }))
      : [{ productId: '', quantity: '1', unitPrice: '' }]
  )
  const [discountType, setDiscountType] = useState<DiscountKind>(
    supply?.discountType || 'NONE'
  )
  const [discountValue, setDiscountValue] = useState(
    supply?.discountValue ? String(supply.discountValue) : ''
  )
  const [supplyExpense, setSupplyExpense] = useState(
    supply?.supplyExpense ? String(supply.supplyExpense) : ''
  )
  const [supplyExpenseReason, setSupplyExpenseReason] = useState(
    supply?.supplyExpenseReason || ''
  )
  const [remarks, setRemarks] = useState(supply?.remarks || '')

  const productMap = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  )

  const updateRow = (index: number, patch: Partial<LineRow>) => {
    setRows((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...patch } : r))
    )
  }

  const handleProductChange = (index: number, productId: string) => {
    const product = productMap.get(productId)
    updateRow(index, {
      productId,
      // Auto-fill unit price from the product's selling price (editable).
      unitPrice: product ? String(product.sellingPrice) : '',
    })
  }

  const addRow = () =>
    setRows((prev) => [...prev, { productId: '', quantity: '1', unitPrice: '' }])

  const removeRow = (index: number) =>
    setRows((prev) =>
      prev.length === 1 ? prev : prev.filter((_, i) => i !== index)
    )

  // ---- Live totals (mirror of the server-side math) ----
  const lineTotals = rows.map(
    (r) => (Number(r.quantity) || 0) * (Number(r.unitPrice) || 0)
  )
  const subtotal = lineTotals.reduce((sum, t) => sum + t, 0)
  const discountAmount =
    discountType === 'PERCENTAGE'
      ? (subtotal * (Number(discountValue) || 0)) / 100
      : discountType === 'FIXED'
        ? Number(discountValue) || 0
        : 0
  const expense = Number(supplyExpense) || 0
  const grandTotal = subtotal - discountAmount + expense

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data: SupplyInput = {
      companyId,
      supplyDate,
      status,
      discountType,
      discountValue: Number(discountValue) || 0,
      supplyExpense: Number(supplyExpense) || 0,
      supplyExpenseReason,
      remarks,
      items: rows
        .filter((r) => r.productId)
        .map((r) => ({
          productId: r.productId,
          quantity: Number(r.quantity) || 0,
          unitPrice: Number(r.unitPrice) || 0,
        })),
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="companyId" className="text-sm font-semibold text-foreground">
            Company <span className="text-destructive">*</span>
          </Label>
          <select
            id="companyId"
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            required
            className={selectClass}
          >
            <option value="" disabled>
              Select company
            </option>
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="supplyDate" className="text-sm font-semibold text-foreground">
            Supply Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supplyDate"
            type="date"
            value={supplyDate}
            onChange={(e) => setSupplyDate(e.target.value)}
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
            onChange={(e) => setStatus(e.target.value as SupplyStatus)}
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

      {/* Line items */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">
            Products <span className="text-destructive">*</span>
          </Label>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addRow}>
            <Plus className="size-4" /> Add Product
          </Button>
        </div>

        <div className="space-y-2 rounded-lg border-2 border-border bg-card p-3">
          {/* Column labels */}
          <div className="hidden grid-cols-12 gap-2 px-1 text-xs font-medium text-muted-foreground sm:grid">
            <div className="col-span-5">Product</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Unit Price</div>
            <div className="col-span-2 text-right">Total</div>
            <div className="col-span-1" />
          </div>

          {rows.map((row, index) => {
            const product = productMap.get(row.productId)
            return (
              <div
                key={index}
                className="grid grid-cols-12 items-center gap-2 rounded-md bg-secondary/20 p-2 sm:bg-transparent sm:p-0"
              >
                <div className="col-span-12 sm:col-span-5">
                  <select
                    value={row.productId}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    required
                    className={selectClass}
                  >
                    <option value="" disabled>
                      Select product
                    </option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.sku})
                      </option>
                    ))}
                  </select>
                  {product && (
                    <p className="mt-1 px-1 text-xs text-muted-foreground">
                      Unit: {unitLabel(product.unit)}
                    </p>
                  )}
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Qty"
                    value={row.quantity}
                    onChange={(e) => updateRow(index, { quantity: e.target.value })}
                    className={cn(inputClass, 'text-right')}
                    required
                  />
                </div>
                <div className="col-span-4 sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Price"
                    value={row.unitPrice}
                    onChange={(e) => updateRow(index, { unitPrice: e.target.value })}
                    className={cn(inputClass, 'text-right')}
                    required
                  />
                </div>
                <div className="col-span-3 text-right text-sm font-semibold sm:col-span-2">
                  {formatCurrency(lineTotals[index] || 0)}
                </div>
                <div className="col-span-1 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive hover:text-destructive"
                    onClick={() => removeRow(index)}
                    disabled={rows.length === 1}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Discount + expense */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="discountType" className="text-sm font-semibold text-foreground">
            Discount
          </Label>
          <div className="flex gap-2">
            <select
              id="discountType"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value as DiscountKind)}
              className={cn(selectClass, 'w-40')}
            >
              <option value="NONE">No discount</option>
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed (৳)</option>
            </select>
            <Input
              type="number"
              min="0"
              step="0.01"
              placeholder="0"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              disabled={discountType === 'NONE'}
              className={cn(inputClass, 'text-right')}
            />
          </div>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="supplyExpense" className="text-sm font-semibold text-foreground">
            Supply Expense
          </Label>
          <Input
            id="supplyExpense"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={supplyExpense}
            onChange={(e) => setSupplyExpense(e.target.value)}
            className={cn(inputClass, 'text-right')}
          />
        </div>

        {expense > 0 && (
          <div className="space-y-2.5 sm:col-span-2">
            <Label htmlFor="supplyExpenseReason" className="text-sm font-semibold text-foreground">
              Expense Reason
            </Label>
            <Input
              id="supplyExpenseReason"
              placeholder="e.g., Transport / loading cost"
              value={supplyExpenseReason}
              onChange={(e) => setSupplyExpenseReason(e.target.value)}
              className={inputClass}
            />
          </div>
        )}

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="remarks" className="text-sm font-semibold text-foreground">
            Remarks
          </Label>
          <Textarea
            id="remarks"
            placeholder="Any additional notes about this supply..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Totals summary */}
      <div className="rounded-lg border border-border/50 bg-secondary/30 p-4">
        <div className="ml-auto max-w-xs space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Discount</span>
            <span className="font-medium text-amber-600">
              − {formatCurrency(discountAmount)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Expense</span>
            <span className="font-medium">+ {formatCurrency(expense)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold">
            <span>Grand Total</span>
            <span className="text-green-600">{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Indicates required fields
        </p>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? 'Saving...' : supply ? 'Update Supply' : 'Create Supply'}
        </Button>
      </div>
    </form>
  )
}

// ---- Modals --------------------------------------------------------------

interface AddSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  companies: CompanyOption[]
  products: ProductOption[]
  onSubmit: (data: SupplyInput) => void
  isLoading?: boolean
}

export function AddSupplyModal({
  open,
  onOpenChange,
  companies,
  products,
  onSubmit,
  isLoading,
}: AddSupplyModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="New Supply"
      description="Enter the supply details below. All fields marked with"
      helpText="A supply groups the products delivered to a company. Totals are calculated automatically."
    >
      <SupplyForm
        companies={companies}
        products={products}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </GenericAddModal>
  )
}

interface EditSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: SupplyDetailDTO | null
  companies: CompanyOption[]
  products: ProductOption[]
  onSubmit: (data: SupplyInput) => void
  isLoading?: boolean
}

export function EditSupplyModal({
  open,
  onOpenChange,
  supply,
  companies,
  products,
  onSubmit,
  isLoading,
}: EditSupplyModalProps) {
  if (!supply) return null

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Supply"
      description="Update the information for"
      entityName={supply.supplyNo}
      helpText="Changes will be saved immediately. Totals are recalculated automatically."
    >
      <SupplyForm
        supply={supply}
        companies={companies}
        products={products}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </GenericEditModal>
  )
}

interface ViewSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: SupplyDetailDTO | null
}

export function ViewSupplyModal({
  open,
  onOpenChange,
  supply,
}: ViewSupplyModalProps) {
  if (!supply) return null

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={supply.supplyNo}
      subtitle="Complete supply information"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="grid gap-4 rounded-lg border border-border/50 bg-secondary/20 p-4 sm:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Company</p>
            <p className="text-base font-semibold text-foreground">{supply.companyName}</p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Supply Date</p>
            <p className="text-base font-semibold text-foreground">
              {new Date(supply.supplyDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Status</p>
            <Badge variant={statusVariant(supply.status)}>
              {statusLabel(supply.status)}
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Invoice</p>
            <Badge variant={supply.invoiceGenerated ? 'default' : 'secondary'}>
              {supply.invoiceGenerated ? 'Generated' : 'Pending'}
            </Badge>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-muted-foreground">Created By</p>
            <p className="text-base font-semibold text-foreground">{supply.createdByName}</p>
          </div>
        </div>

        {/* Items */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="mb-3 font-semibold text-foreground">
            Products ({supply.items.length})
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
                {supply.items.map((it) => (
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

        {/* Totals */}
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <div className="ml-auto max-w-xs space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatCurrency(supply.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Discount
                {supply.discountType === 'PERCENTAGE'
                  ? ` (${supply.discountValue}%)`
                  : ''}
              </span>
              <span className="font-medium text-amber-600">
                − {formatCurrency(supply.discountAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Expense</span>
              <span className="font-medium">+ {formatCurrency(supply.supplyExpense)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-1.5 text-base font-bold">
              <span>Grand Total</span>
              <span className="text-green-600">{formatCurrency(supply.grandTotal)}</span>
            </div>
          </div>
        </div>

        {(supply.supplyExpenseReason || supply.remarks) && (
          <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/20 p-4">
            {supply.supplyExpenseReason && (
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  Expense Reason
                </p>
                <p className="text-base text-foreground">{supply.supplyExpenseReason}</p>
              </div>
            )}
            {supply.remarks && (
              <div>
                <p className="mb-1 text-sm font-medium text-muted-foreground">Remarks</p>
                <p className="text-base text-foreground">{supply.remarks}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </GenericViewModal>
  )
}

interface DeleteSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: SupplyDetailDTO | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteSupplyModal({
  open,
  onOpenChange,
  supply,
  onConfirm,
  isLoading,
}: DeleteSupplyModalProps) {
  if (!supply) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Supply"
      message="Are you sure you want to permanently delete"
      itemName={supply.supplyNo}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
