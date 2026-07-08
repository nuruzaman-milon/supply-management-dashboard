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

interface Supply {
  id: string | number
  name: string
  description: string
  quantity: number
  unit: string
  cost: number
  supplier: string
  status: string
  createdDate: string
}

interface SupplyFormProps {
  supply?: Supply
  onSubmit: (data: Supply) => void
  isLoading?: boolean
}

function SupplyForm({ supply, onSubmit, isLoading = false }: SupplyFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Supply = {
      id: supply?.id || Date.now(),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      quantity: parseInt(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      cost: parseFloat(formData.get('cost') as string),
      supplier: formData.get('supplier') as string,
      status: formData.get('status') as string,
      createdDate: supply?.createdDate || new Date().toISOString().split('T')[0],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Supply Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Office Paper A4"
            defaultValue={supply?.name || ''}
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
            defaultValue={supply?.quantity || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="unit" className="text-sm font-semibold text-foreground">
            Unit <span className="text-destructive">*</span>
          </Label>
          <Select name="unit" defaultValue={supply?.unit || 'pcs'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pcs">Pieces</SelectItem>
              <SelectItem value="box">Box</SelectItem>
              <SelectItem value="kg">Kilogram</SelectItem>
              <SelectItem value="ltr">Liter</SelectItem>
              <SelectItem value="pack">Pack</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2.5">
          <Label htmlFor="cost" className="text-sm font-semibold text-foreground">
            Cost <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cost"
            name="cost"
            type="number"
            step="0.01"
            placeholder="0.00"
            defaultValue={supply?.cost || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="supplier" className="text-sm font-semibold text-foreground">
            Supplier <span className="text-destructive">*</span>
          </Label>
          <Input
            id="supplier"
            name="supplier"
            placeholder="e.g., Global Supplies Ltd"
            defaultValue={supply?.supplier || ''}
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
            placeholder="Enter supply description"
            defaultValue={supply?.description || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
            required
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={supply?.status || 'active'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Indicates required fields
        </p>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? 'Saving...' : supply ? 'Update Supply' : 'Add Supply'}
        </Button>
      </div>
    </form>
  )
}

interface AddSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Supply) => void
  isLoading?: boolean
}

interface EditSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: Supply | null
  onSubmit: (data: Supply) => void
  isLoading?: boolean
}

interface ViewSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: Supply | null
}

interface DeleteSupplyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supply: Supply | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AddSupplyModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddSupplyModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Supply"
      description="Enter the supply details below. All fields marked with"
      helpText="Adding a new supply will make it available for inventory management and ordering."
    >
      <SupplyForm onSubmit={onSubmit} isLoading={isLoading} />
    </GenericAddModal>
  )
}

export function EditSupplyModal({
  open,
  onOpenChange,
  supply,
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
      entityName={supply.name}
      helpText="Changes will be saved immediately. You can edit this supply anytime."
    >
      <SupplyForm supply={supply} onSubmit={onSubmit} isLoading={isLoading} />
    </GenericEditModal>
  )
}

export function ViewSupplyModal({
  open,
  onOpenChange,
  supply,
}: ViewSupplyModalProps) {
  if (!supply) return null

  const formatCurrency = (value: number) => {
    return '৳' + new Intl.NumberFormat('en-BD', {
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <GenericViewModal
      open={open}
      onOpenChange={onOpenChange}
      title={supply.name}
      subtitle="Complete supply information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-4">Supply Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Supply Name
              </p>
              <p className="text-base font-semibold text-foreground">{supply.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Supplier
              </p>
              <p className="text-base font-semibold text-foreground">
                {supply.supplier}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Quantity
              </p>
              <p className="text-base font-semibold text-foreground">
                {supply.quantity} {supply.unit}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Cost per Unit
              </p>
              <p className="text-base font-bold text-blue-600">
                {formatCurrency(supply.cost)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Cost
              </p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(supply.cost * supply.quantity)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className="text-base font-semibold text-foreground capitalize">
                {supply.status}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-3">Description</h4>
          <p className="text-base text-foreground">{supply.description}</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Created: {new Date(supply.createdDate).toLocaleDateString()}</p>
        </div>
      </div>
    </GenericViewModal>
  )
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
      itemName={supply.name}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
