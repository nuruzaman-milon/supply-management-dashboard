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

interface DueItem {
  id: string | number
  company: string
  amount: number
  description: string
  dueDate: string
  status: string
  priority: string
  createdDate: string
}

interface DueFormProps {
  item?: DueItem
  onSubmit: (data: DueItem) => void
  isLoading?: boolean
}

function DueForm({ item, onSubmit, isLoading = false }: DueFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: DueItem = {
      id: item?.id || Date.now(),
      company: formData.get('company') as string,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      status: formData.get('status') as string,
      priority: formData.get('priority') as string,
      createdDate: item?.createdDate || new Date().toISOString().split('T')[0],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="company" className="text-sm font-semibold text-foreground">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="Company name"
            defaultValue={item?.company || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="amount" className="text-sm font-semibold text-foreground">
            Amount <span className="text-destructive">*</span>
          </Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={item?.amount || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="dueDate" className="text-sm font-semibold text-foreground">
            Due Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dueDate"
            name="dueDate"
            type="date"
            defaultValue={item?.dueDate || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="priority" className="text-sm font-semibold text-foreground">
            Priority <span className="text-destructive">*</span>
          </Label>
          <Select name="priority" defaultValue={item?.priority || 'normal'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={item?.status || 'pending'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="description" className="text-sm font-semibold text-foreground">
            Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="Due amount details/notes"
            defaultValue={item?.description || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Indicates required fields
        </p>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? 'Saving...' : item ? 'Update Due' : 'Add Due'}
        </Button>
      </div>
    </form>
  )
}

interface AddDueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: DueItem) => void
  isLoading?: boolean
}

interface EditDueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: DueItem | null
  onSubmit: (data: DueItem) => void
  isLoading?: boolean
}

interface ViewDueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: DueItem | null
}

interface DeleteDueModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: DueItem | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AddDueModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddDueModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Due"
      description="Enter the due amount details below. All fields marked with"
      helpText="Recording a due will help track outstanding payments and manage cash flow."
    >
      <DueForm onSubmit={onSubmit} isLoading={isLoading} />
    </GenericAddModal>
  )
}

export function EditDueModal({
  open,
  onOpenChange,
  item,
  onSubmit,
  isLoading,
}: EditDueModalProps) {
  if (!item) return null

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Due"
      description="Update the information for"
      entityName={`Due from ${item.company}`}
      helpText="Changes will be saved immediately. You can edit this due anytime."
    >
      <DueForm item={item} onSubmit={onSubmit} isLoading={isLoading} />
    </GenericEditModal>
  )
}

export function ViewDueModal({
  open,
  onOpenChange,
  item,
}: ViewDueModalProps) {
  if (!item) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50 dark:bg-red-950/20'
      case 'high':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-950/20'
      case 'normal':
        return 'text-blue-600 bg-blue-50 dark:bg-blue-950/20'
      case 'low':
        return 'text-green-600 bg-green-50 dark:bg-green-950/20'
      default:
        return 'text-gray-600 bg-gray-50 dark:bg-gray-950/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'text-green-600'
      case 'overdue':
        return 'text-red-600'
      case 'processing':
        return 'text-blue-600'
      case 'pending':
        return 'text-amber-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Due from ${item.company}`}
      subtitle="Complete due information"
    >
      <div className="space-y-6">
        <div className={`rounded-lg p-4 ${getPriorityColor(item.priority)}`}>
          <p className="font-semibold capitalize">Priority: {item.priority}</p>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-4">Due Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Company
              </p>
              <p className="text-base font-semibold text-foreground">
                {item.company}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Amount Due
              </p>
              <p className="text-base font-bold text-amber-600">
                {formatCurrency(item.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Due Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {new Date(item.dueDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className={`text-base font-semibold capitalize ${getStatusColor(item.status)}`}>
                {item.status}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-3">Description</h4>
          <p className="text-base text-foreground whitespace-pre-wrap">{item.description}</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Created: {new Date(item.createdDate).toLocaleDateString()}</p>
        </div>
      </div>
    </GenericViewModal>
  )
}

export function DeleteDueModal({
  open,
  onOpenChange,
  item,
  onConfirm,
  isLoading,
}: DeleteDueModalProps) {
  if (!item) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Due"
      message="Are you sure you want to permanently delete the due from"
      itemName={item.company}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
