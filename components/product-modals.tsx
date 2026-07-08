'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  GenericAddModal,
  GenericEditModal,
  GenericViewModal,
  GenericDeleteModal,
} from '@/components/generic-modals'

interface Product {
  id: string | number
  name: string
  category: string
  description: string
  price: number
  quantity: number
  status: string
  createdDate: string
}

interface ProductFormProps {
  product?: Product
  categories: Array<{ id: string; name: string }>
  onSubmit: (data: Product) => void
  isLoading?: boolean
}

function ProductForm({
  product,
  categories,
  onSubmit,
  isLoading = false,
}: ProductFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Product = {
      id: product?.id || Date.now(),
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      quantity: parseInt(formData.get('quantity') as string),
      status: formData.get('status') as string,
      createdDate: product?.createdDate || new Date().toISOString().split('T')[0],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Product Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Wireless Mouse"
            defaultValue={product?.name || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="category" className="text-sm font-semibold text-foreground">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select name="category" defaultValue={product?.category || ''}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="price" className="text-sm font-semibold text-foreground">
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={product?.price || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="quantity" className="text-sm font-semibold text-foreground">
            Quantity <span className="text-destructive">*</span>
          </Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            placeholder="0"
            defaultValue={product?.quantity || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            defaultValue={product?.description || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
            required
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={product?.status || 'active'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
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
  categories: Array<{ id: string; name: string }>
  onSubmit: (data: Product) => void
  isLoading?: boolean
}

interface EditProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  categories: Array<{ id: string; name: string }>
  onSubmit: (data: Product) => void
  isLoading?: boolean
}

interface ViewProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
}

interface DeleteProductModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
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
                Category
              </p>
              <p className="text-base font-semibold text-foreground">
                {product.category}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Price
              </p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(product.price)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Quantity in Stock
              </p>
              <p className="text-base font-semibold text-foreground">
                {product.quantity} units
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className="text-base font-semibold text-foreground capitalize">
                {product.status}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {new Date(product.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-3">Description</h4>
          <p className="text-base text-foreground">{product.description}</p>
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
