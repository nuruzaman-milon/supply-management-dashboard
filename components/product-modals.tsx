'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  GenericAddModal,
  GenericEditModal,
  GenericViewModal,
  GenericDeleteModal,
} from '@/components/generic-modals'
import type { ProductDTO, ProductInput } from '@/app/actions/product.actions'
import { PRODUCT_UNITS, unitLabel } from '@/lib/units'

type CategoryOption = { id: string; name: string }

// Build a SKU slug from the product name: uppercase, alphanumeric runs
// joined by dashes. e.g. "Wireless Mouse 2.0" -> "WIRELESS-MOUSE-2-0"
function skuFromName(name: string): string {
  return name
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

interface ProductFormProps {
  product?: ProductDTO
  categories: CategoryOption[]
  onSubmit: (data: ProductInput) => void
  isLoading?: boolean
}

function ProductForm({
  product,
  categories,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const [name, setName] = useState<string>(product?.name || '')
  const [sku, setSku] = useState<string>(product?.sku || '')
  // Existing products keep their SKU; only auto-fill an untouched SKU on add.
  const [skuEdited, setSkuEdited] = useState<boolean>(Boolean(product))
  const [categoryId, setCategoryId] = useState<string>(
    product?.categoryId || ''
  )
  const [unit, setUnit] = useState<string>(product?.unit || 'pcs')
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(
    product?.status || 'ACTIVE'
  )

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    if (!skuEdited) setSku(skuFromName(value))
  }

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSku(e.target.value)
    setSkuEdited(true)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: ProductInput = {
      name,
      sku,
      unit,
      categoryId,
      purchasePrice: parseFloat(formData.get('purchasePrice') as string),
      sellingPrice: parseFloat(formData.get('sellingPrice') as string),
      description: formData.get('description') as string,
      status,
    }
    onSubmit(data)
  }

  const inputClass =
    'border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Product Name */}
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Wireless Mouse"
            value={name}
            onChange={handleNameChange}
            className={inputClass}
            required
          />
        </div>

        {/* SKU — auto-generated from the product name, editable */}
        <div className="space-y-2.5">
          <Label htmlFor="sku" className="text-sm font-semibold text-foreground">
            SKU <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sku"
            name="sku"
            placeholder="Auto-generated from name"
            value={sku}
            onChange={handleSkuChange}
            className={cn(inputClass, 'font-mono')}
            required
          />
          <p className="text-xs text-muted-foreground">
            Auto-filled from the product name — you can edit it.
          </p>
        </div>

        {/* Category (native select — reliable inside the dialog) */}
        <div className="space-y-2.5">
          <Label htmlFor="categoryId" className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            className={cn(
              inputClass,
              'flex h-9 w-full rounded-lg px-3 py-2 text-sm outline-none'
            )}
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

        {/* Unit (native select — reliable inside the dialog) */}
        <div className="space-y-2.5">
          <Label htmlFor="unit" className="text-sm font-semibold text-foreground">
            Unit <span className="text-destructive">*</span>
          </Label>
          <select
            id="unit"
            name="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            className={cn(
              inputClass,
              'flex h-9 w-full rounded-lg px-3 py-2 text-sm outline-none'
            )}
          >
            {PRODUCT_UNITS.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        {/* Purchase Price */}
        <div className="space-y-2.5">
          <Label htmlFor="purchasePrice" className="text-sm font-semibold text-foreground">
            Purchase Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={product?.purchasePrice ?? ''}
            className={inputClass}
            required
          />
        </div>

        {/* Selling Price */}
        <div className="space-y-2.5">
          <Label htmlFor="sellingPrice" className="text-sm font-semibold text-foreground">
            Selling Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            defaultValue={product?.sellingPrice ?? ''}
            className={inputClass}
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            defaultValue={product?.description || ''}
            className={cn(inputClass, 'min-h-24')}
          />
        </div>

        {/* Status */}
        <div className="space-y-2.5 sm:col-span-2">
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
      helpText="Adding a new product will make it available for invoicing and supply management."
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
      helpText="Changes will be saved immediately. You can edit this product anytime."
    >
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </GenericEditModal>
  )
}

export function ViewProductModal({
  open,
  onOpenChange,
  product,
}: ViewProductModalProps) {
  if (!product) return null

  const formatCurrency = (value: number) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={product.name}
      subtitle="Complete product information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-4">Product Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Product Name
              </p>
              <p className="text-base font-semibold text-foreground">{product.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                SKU
              </p>
              <p className="text-base font-semibold text-foreground font-mono">
                {product.sku}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Category
              </p>
              <p className="text-base font-semibold text-foreground">
                {product.categoryName}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Unit
              </p>
              <p className="text-base font-semibold text-foreground">
                {unitLabel(product.unit)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Purchase Price
              </p>
              <p className="text-base font-semibold text-foreground">
                {formatCurrency(product.purchasePrice)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Selling Price
              </p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(product.sellingPrice)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className="text-base font-semibold text-foreground">
                {product.status === 'ACTIVE' ? 'Active' : 'Inactive'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {product.description && (
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
            <h4 className="font-semibold text-foreground mb-3">Description</h4>
            <p className="text-base text-foreground">{product.description}</p>
          </div>
        )}
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
