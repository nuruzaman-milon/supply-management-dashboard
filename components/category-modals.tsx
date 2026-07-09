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
import type { CategoryDTO, CategoryInput } from '@/app/actions/category.actions'

interface CategoryFormProps {
  category?: CategoryDTO
  onSubmit: (data: CategoryInput) => void
  isLoading?: boolean
}

function CategoryForm({ category, onSubmit, isLoading = false }: CategoryFormProps) {
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(
    category?.status || 'ACTIVE'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: CategoryInput = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      status,
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
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Enter category description"
            defaultValue={category?.description || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <div
            role="radiogroup"
            aria-label="Category Status"
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
          {isLoading ? 'Saving...' : category ? 'Update Category' : 'Add Category'}
        </Button>
      </div>
    </form>
  )
}

interface AddCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CategoryInput) => void
  isLoading?: boolean
}

interface EditCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryDTO | null
  onSubmit: (data: CategoryInput) => void
  isLoading?: boolean
}

interface ViewCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryDTO | null
}

interface DeleteCategoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CategoryDTO | null
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
              <p className="text-base text-foreground">{category.description || '—'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Status
                </p>
                <p className="text-base font-semibold text-foreground">
                  {category.status === 'ACTIVE' ? 'Active' : 'Inactive'}
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
                {category.createdAt
                  ? new Date(category.createdAt).toLocaleDateString()
                  : 'N/A'}
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
