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

interface Collection {
  id: string | number
  collectionId: string
  company: string
  amount: number
  description: string
  collectionDate: string
  method: string
  status: string
  createdDate: string
}

interface CollectionFormProps {
  collection?: Collection
  onSubmit: (data: Collection) => void
  isLoading?: boolean
}

function CollectionForm({
  collection,
  onSubmit,
  isLoading = false,
}: CollectionFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Collection = {
      id: collection?.id || Date.now(),
      collectionId: formData.get('collectionId') as string,
      company: formData.get('company') as string,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      collectionDate: formData.get('collectionDate') as string,
      method: formData.get('method') as string,
      status: formData.get('status') as string,
      createdDate: collection?.createdDate || new Date().toISOString().split('T')[0],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="collectionId" className="text-sm font-semibold text-foreground">
            Collection ID <span className="text-destructive">*</span>
          </Label>
          <Input
            id="collectionId"
            name="collectionId"
            placeholder="COL-001"
            defaultValue={collection?.collectionId || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="company" className="text-sm font-semibold text-foreground">
            Company <span className="text-destructive">*</span>
          </Label>
          <Input
            id="company"
            name="company"
            placeholder="Company name"
            defaultValue={collection?.company || ''}
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
            defaultValue={collection?.amount || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="collectionDate" className="text-sm font-semibold text-foreground">
            Collection Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="collectionDate"
            name="collectionDate"
            type="date"
            defaultValue={collection?.collectionDate || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="method" className="text-sm font-semibold text-foreground">
            Payment Method <span className="text-destructive">*</span>
          </Label>
          <Select name="method" defaultValue={collection?.method || 'cash'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="check">Check</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={collection?.status || 'collected'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="collected">Collected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
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
            placeholder="Collection details/notes"
            defaultValue={collection?.description || ''}
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
          {isLoading ? 'Saving...' : collection ? 'Update Collection' : 'Add Collection'}
        </Button>
      </div>
    </form>
  )
}

interface AddCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Collection) => void
  isLoading?: boolean
}

interface EditCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection | null
  onSubmit: (data: Collection) => void
  isLoading?: boolean
}

interface ViewCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection | null
}

interface DeleteCollectionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  collection: Collection | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AddCollectionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddCollectionModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Collection"
      description="Enter the collection details below. All fields marked with"
      helpText="Recording a collection will update your payment tracking and cash flow records."
    >
      <CollectionForm onSubmit={onSubmit} isLoading={isLoading} />
    </GenericAddModal>
  )
}

export function EditCollectionModal({
  open,
  onOpenChange,
  collection,
  onSubmit,
  isLoading,
}: EditCollectionModalProps) {
  if (!collection) return null

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Collection"
      description="Update the information for"
      entityName={`Collection ${collection.collectionId}`}
      helpText="Changes will be saved immediately. You can edit this collection anytime."
    >
      <CollectionForm
        collection={collection}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </GenericEditModal>
  )
}

export function ViewCollectionModal({
  open,
  onOpenChange,
  collection,
}: ViewCollectionModalProps) {
  if (!collection) return null

  const formatCurrency = (value: number) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected':
        return 'text-green-600'
      case 'pending':
        return 'text-amber-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={`Collection ${collection.collectionId}`}
      subtitle="Complete collection information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-4">Collection Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Collection ID
              </p>
              <p className="text-base font-semibold text-foreground">
                {collection.collectionId}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Company
              </p>
              <p className="text-base font-semibold text-foreground">
                {collection.company}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Amount
              </p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(collection.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Collection Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {new Date(collection.collectionDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Payment Method
              </p>
              <p className="text-base font-semibold text-foreground capitalize">
                {collection.method.replace('_', ' ')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className={`text-base font-semibold capitalize ${getStatusColor(collection.status)}`}>
                {collection.status}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-3">Description</h4>
          <p className="text-base text-foreground whitespace-pre-wrap">{collection.description}</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Created: {new Date(collection.createdDate).toLocaleDateString()}</p>
        </div>
      </div>
    </GenericViewModal>
  )
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
      itemName={`Collection ${collection.collectionId}`}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
