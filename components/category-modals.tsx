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

interface Category {
  id: string | number
  name: string
  description: string
  productCount: number
  status: string
  createdDate: string
}

interface CategoryFormProps {
  category?: Category
  onSubmit: (data: Category) => void
  isLoading?: boolean
}

function CategoryForm({ category, onSubmit, isLoading = false }: CategoryFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Category = {
      id: category?.id || Date.now(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      productCount: category?.productCount || 0,
      status: formData.get('status') as string,
      createdDate: category?.createdDate || new Date().toISOString().split('T')[0],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Category Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Electronics"
            defaultValue={category?.name || ''}
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
            placeholder="Enter category description"
            defaultValue={category?.description || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
            required
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={category?.status || 'active'}>
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
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  )
}

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Category) => void
  isLoading?: boolean
}

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onSubmit: (data: Category) => void
  isLoading?: boolean
}

interface ViewCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
}

interface DeleteCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: Category | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AddCategoryModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddCategoryModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Category"
      description="Enter the category details below. All fields marked with"
      helpText="Adding a new category will make it available for organizing products in your system."
    >
      <CategoryForm onSubmit={onSubmit} isLoading={isLoading} />
    </GenericAddModal>
  )
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
  onSubmit,
  isLoading,
}: EditCategoryModalProps) {
  if (!category) return null

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Category"
      description="Update the information for"
      entityName={category.name}
      helpText="Changes will be saved immediately. You can edit this category anytime."
    >
      <CategoryForm category={category} onSubmit={onSubmit} isLoading={isLoading} />
    </GenericEditModal>
  )
}

export function ViewCategoryModal({
  open,
  onOpenChange,
  category,
}: ViewCategoryModalProps) {
  if (!category) return null

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={category.name}
      subtitle="Complete category information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-4">Category Details</h4>
          <div className="grid gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Category Name
              </p>
              <p className="text-base font-semibold text-foreground">{category.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Description
              </p>
              <p className="text-base text-foreground">{category.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </p>
                <p className="text-base font-semibold text-foreground capitalize">
                  {category.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Products
                </p>
                <p className="text-base font-semibold text-foreground">
                  {category.productCount}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {new Date(category.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </GenericViewModal>
  )
}

export function DeleteCategoryModal({
  open,
  onOpenChange,
  category,
  onConfirm,
  isLoading,
}: DeleteCategoryModalProps) {
  if (!category) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Category"
      message="Are you sure you want to permanently delete"
      itemName={category.name}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
