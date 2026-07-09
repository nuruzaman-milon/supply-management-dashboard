'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Plus, Trash2 } from 'lucide-react'
import {
  GenericAddModal,
  GenericEditModal,
  GenericViewModal,
  GenericDeleteModal,
} from '@/components/generic-modals'
import type { ProductDTO, ProductInput } from '@/app/actions/product.actions'
import { PRODUCT_UNITS, unitLabel } from '@/lib/units'

type CategoryOption = { id: string; name: string }

const inputClass =
  'border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'
const selectClass = cn(
  inputClass,
  'flex h-9 w-full rounded-lg px-3 py-2 text-sm outline-none'
)

// Build a SKU slug from product + variant, e.g. "Rice" + "500g" -> "RICE-500G"
function skuFromName(value: string): string {
  return value
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function formatCurrency(value: number) {
  return '৳' + new Intl.NumberFormat('en-BD', { minimumFractionDigits: 0 }).format(value)
}

type VariantRow = {
  id?: string
  name: string
  sku: string
  skuEdited: boolean
  unit: string
  purchasePrice: string
  sellingPrice: string
}

function emptyVariant(): VariantRow {
  return { name: '', sku: '', skuEdited: false, unit: 'pcs', purchasePrice: '', sellingPrice: '' }
}

interface ProductFormProps {
  product?: ProductDTO
  categories: CategoryOption[]
  onSubmit: (data: ProductInput) => void
  isLoading?: boolean
}

function ProductForm({ product, categories, onSubmit, isLoading = false }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [brand, setBrand] = useState(product?.brand || '')
  const [categoryId, setCategoryId] = useState(product?.categoryId || '')
  const [description, setDescription] = useState(product?.description || '')
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(product?.status || 'ACTIVE')
  const [rows, setRows] = useState<VariantRow[]>(
    product && product.variants.length
      ? product.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          skuEdited: true,
          unit: v.unit,
          purchasePrice: String(v.purchasePrice),
          sellingPrice: String(v.sellingPrice),
        }))
      : [emptyVariant()]
  )

  const updateRow = (index: number, patch: Partial<VariantRow>) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  // Auto-fill a variant SKU from "<product> <variant label>" until manually edited.
  const syncSku = (index: number, nextName: string, nextVariantName: string) => {
    setRows((prev) =>
      prev.map((r, i) =>
        i === index && !r.skuEdited
          ? { ...r, sku: skuFromName(`${nextName} ${nextVariantName}`.trim()) }
          : r
      )
    )
  }

  const handleNameChange = (value: string) => {
    setName(value)
    // Refresh untouched variant SKUs when the product name changes.
    setRows((prev) =>
      prev.map((r) =>
        r.skuEdited ? r : { ...r, sku: skuFromName(`${value} ${r.name}`.trim()) }
      )
    )
  }

  const addRow = () => setRows((prev) => [...prev, emptyVariant()])
  const removeRow = (index: number) =>
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((_, i) => i !== index)))

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data: ProductInput = {
      name,
      brand,
      categoryId,
      description,
      status,
      variants: rows.map((r) => ({
        id: r.id,
        name: r.name,
        sku: r.sku,
        unit: r.unit,
        purchasePrice: parseFloat(r.purchasePrice) || 0,
        sellingPrice: parseFloat(r.sellingPrice) || 0,
      })),
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Parent fields */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Rice"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="brand" className="text-sm font-semibold text-foreground">
            Brand
          </Label>
          <Input
            id="brand"
            placeholder="e.g., Pusa (optional)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="categoryId" className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={selectClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <div
            role="radiogroup"
            aria-label="Product Status"
            className="grid grid-cols-2 gap-1 rounded-lg border-2 border-border bg-card p-1"
          >
            {(['ACTIVE', 'INACTIVE'] as const).map((value) => {
              const selected = status === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setStatus(value)}
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                    selected
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-secondary'
                  )}
                >
                  <span
                    className={cn(
                      'size-2 rounded-full',
                      value === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400',
                      selected && value === 'ACTIVE' && 'bg-green-300',
                      selected && value === 'INACTIVE' && 'bg-gray-200'
                    )}
                  />
                  {value === 'ACTIVE' ? 'Active' : 'Inactive'}
                </button>
              )
            })}
          </div>
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Enter product description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={cn(inputClass, 'min-h-20')}
          />
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold text-foreground">
            Variants <span className="text-destructive">*</span>
          </Label>
          <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addRow}>
            <Plus className="size-4" /> Add Variant
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Each size/pack is a variant with its own SKU and prices (e.g. 500g, 1kg, 5kg bag).
        </p>

        <div className="space-y-3 rounded-lg border-2 border-border bg-card p-3">
          {rows.map((row, index) => (
            <div
              key={index}
              className="space-y-2 rounded-md bg-secondary/20 p-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Variant {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-destructive hover:text-destructive"
                  onClick={() => removeRow(index)}
                  disabled={rows.length === 1}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-12">
                {/* Label */}
                <div className="col-span-2 sm:col-span-3">
                  <Input
                    placeholder="Label e.g. 500g"
                    value={row.name}
                    onChange={(e) => {
                      updateRow(index, { name: e.target.value })
                      syncSku(index, name, e.target.value)
                    }}
                    className={inputClass}
                    required
                  />
                </div>
                {/* Unit */}
                <div className="col-span-1 sm:col-span-2">
                  <select
                    value={row.unit}
                    onChange={(e) => updateRow(index, { unit: e.target.value })}
                    className={selectClass}
                  >
                    {PRODUCT_UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* SKU */}
                <div className="col-span-1 sm:col-span-3">
                  <Input
                    placeholder="SKU"
                    value={row.sku}
                    onChange={(e) => updateRow(index, { sku: e.target.value, skuEdited: true })}
                    className={cn(inputClass, 'font-mono')}
                    required
                  />
                </div>
                {/* Purchase */}
                <div className="col-span-1 sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Buy ৳"
                    value={row.purchasePrice}
                    onChange={(e) => updateRow(index, { purchasePrice: e.target.value })}
                    className={cn(inputClass, 'text-right')}
                    required
                  />
                </div>
                {/* Selling */}
                <div className="col-span-1 sm:col-span-2">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Sell ৳"
                    value={row.sellingPrice}
                    onChange={(e) => updateRow(index, { sellingPrice: e.target.value })}
                    className={cn(inputClass, 'text-right')}
                    required
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Indicates required fields
        </p>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
        </Button>
      </div>
    </form>
  )
}

interface AddProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  categories: CategoryOption[]
  onSubmit: (data: ProductInput) => void
  isLoading?: boolean
}

interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDTO | null
  categories: CategoryOption[]
  onSubmit: (data: ProductInput) => void
  isLoading?: boolean
}

interface ViewProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDTO | null
}

interface DeleteProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: ProductDTO | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AddProductModal({
  open,
  onOpenChange,
  categories,
  onSubmit,
  isLoading,
}: AddProductModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Product"
      description="Enter the product details below. All fields marked with"
      helpText="A product groups one or more variants (sizes/packs), each with its own SKU and prices."
    >
      <ProductForm categories={categories} onSubmit={onSubmit} isLoading={isLoading} />
    </GenericAddModal>
  )
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
  categories,
  onSubmit,
  isLoading,
}: EditProductModalProps) {
  if (!product) return null

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Product"
      description="Update the information for"
      entityName={product.name}
      helpText="Changes will be saved immediately. Variants used in supplies can't be removed."
    >
      <ProductForm
        key={product.id}
        product={product}
        categories={categories}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </GenericEditModal>
  )
}

export function ViewProductModal({ open, onOpenChange, product }: ViewProductModalProps) {
  if (!product) return null

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={product.name}
      subtitle="Complete product information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Brand</p>
              <p className="text-base font-semibold text-foreground">{product.brand || '—'}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Category</p>
              <p className="text-base font-semibold text-foreground">{product.categoryName}</p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Status</p>
              <p className="text-base font-semibold text-foreground">
                {product.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">Variants</p>
              <p className="text-base font-semibold text-foreground">{product.variants.length}</p>
            </div>
          </div>
          {product.description && (
            <div className="mt-4">
              <p className="mb-1 text-sm font-medium text-muted-foreground">Description</p>
              <p className="text-base text-foreground">{product.description}</p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="mb-3 font-semibold text-foreground">Variants</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="py-2 font-medium">Variant</th>
                  <th className="py-2 font-medium">SKU</th>
                  <th className="py-2 font-medium">Unit</th>
                  <th className="py-2 text-right font-medium">Purchase</th>
                  <th className="py-2 text-right font-medium">Selling</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((v) => (
                  <tr key={v.id} className="border-b border-border/40">
                    <td className="py-2 font-medium text-foreground">{v.name}</td>
                    <td className="py-2 font-mono text-xs text-muted-foreground">{v.sku}</td>
                    <td className="py-2">{unitLabel(v.unit)}</td>
                    <td className="py-2 text-right">{formatCurrency(v.purchasePrice)}</td>
                    <td className="py-2 text-right font-semibold text-green-600">
                      {formatCurrency(v.sellingPrice)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GenericViewModal>
  )
}

export function DeleteProductModal({
  open,
  onOpenChange,
  product,
  onConfirm,
  isLoading,
}: DeleteProductModalProps) {
  if (!product) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Product"
      message="Are you sure you want to permanently delete"
      itemName={product.name}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
