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

interface Invoice {
  id: string | number
  invoiceNumber: string
  company: string
  amount: number
  description: string
  dueDate: string
  status: string
  createdDate: string
}

interface InvoiceFormProps {
  invoice?: Invoice
  onSubmit: (data: Invoice) => void
  isLoading?: boolean
}

function InvoiceForm({ invoice, onSubmit, isLoading = false }: InvoiceFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: Invoice = {
      id: invoice?.id || Date.now(),
      invoiceNumber: formData.get('invoiceNumber') as string,
      company: formData.get('company') as string,
      amount: parseFloat(formData.get('amount') as string),
      description: formData.get('description') as string,
      dueDate: formData.get('dueDate') as string,
      status: formData.get('status') as string,
      createdDate: invoice?.createdDate || new Date().toISOString().split('T')[0],
    }
    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="invoiceNumber" className="text-sm font-semibold text-foreground">
            Invoice Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="invoiceNumber"
            name="invoiceNumber"
            placeholder="INV-001"
            defaultValue={invoice?.invoiceNumber || ''}
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
            defaultValue={invoice?.company || ''}
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
            defaultValue={invoice?.amount || ''}
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
            defaultValue={invoice?.dueDate || ''}
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
            placeholder="Invoice description / items"
            defaultValue={invoice?.description || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-24"
            required
          />
        </div>

        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={invoice?.status || 'pending'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Indicates required fields
        </p>
        <Button type="submit" disabled={isLoading} className="min-w-[140px]">
          {isLoading ? 'Saving...' : invoice ? 'Update Invoice' : 'Add Invoice'}
        </Button>
      </div>
    </form>
  )
}

interface AddInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Invoice) => void
  isLoading?: boolean
}

interface EditInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSubmit: (data: Invoice) => void
  isLoading?: boolean
}

interface ViewInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
}

interface DeleteInvoiceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onConfirm: () => void
  isLoading?: boolean
}

export function AddInvoiceModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: AddInvoiceModalProps) {
  return (
    <GenericAddModal
      open={open}
      onOpenChange={onOpenChange}
      title="Add New Invoice"
      description="Enter the invoice details below. All fields marked with"
      helpText="Adding a new invoice will record the transaction for accounting and tracking purposes."
    >
      <InvoiceForm onSubmit={onSubmit} isLoading={isLoading} />
    </GenericAddModal>
  )
}

export function EditInvoiceModal({
  open,
  onOpenChange,
  invoice,
  onSubmit,
  isLoading,
}: EditInvoiceModalProps) {
  if (!invoice) return null

  return (
    <GenericEditModal
      open={open}
      onOpenChange={onOpenChange}
      title="Edit Invoice"
      description="Update the information for"
      entityName={`Invoice ${invoice.invoiceNumber}`}
      helpText="Changes will be saved immediately. You can edit this invoice anytime."
    >
      <InvoiceForm invoice={invoice} onSubmit={onSubmit} isLoading={isLoading} />
    </GenericEditModal>
  )
}

export function ViewInvoiceModal({
  open,
  onOpenChange,
  invoice,
}: ViewInvoiceModalProps) {
  if (!invoice) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-600'
      case 'overdue':
        return 'text-red-600'
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
      title={`Invoice ${invoice.invoiceNumber}`}
      subtitle="Complete invoice information"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-4">Invoice Details</h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Invoice Number
              </p>
              <p className="text-base font-semibold text-foreground">
                {invoice.invoiceNumber}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Company
              </p>
              <p className="text-base font-semibold text-foreground">
                {invoice.company}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Amount
              </p>
              <p className="text-base font-bold text-green-600">
                {formatCurrency(invoice.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Status
              </p>
              <p className={`text-base font-semibold capitalize ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Due Date
              </p>
              <p className="text-base font-semibold text-foreground">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
          <h4 className="font-semibold text-foreground mb-3">Description</h4>
          <p className="text-base text-foreground whitespace-pre-wrap">{invoice.description}</p>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Created: {new Date(invoice.createdDate).toLocaleDateString()}</p>
        </div>
      </div>
    </GenericViewModal>
  )
}

export function DeleteInvoiceModal({
  open,
  onOpenChange,
  invoice,
  onConfirm,
  isLoading,
}: DeleteInvoiceModalProps) {
  if (!invoice) return null

  return (
    <GenericDeleteModal
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Invoice"
      message="Are you sure you want to permanently delete"
      itemName={`Invoice ${invoice.invoiceNumber}`}
      onConfirm={onConfirm}
      isLoading={isLoading}
    />
  )
}
