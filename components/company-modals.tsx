'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { CompanyForm } from '@/components/company-form'
import { AlertTriangle } from 'lucide-react'

interface Company {
  id?: string
  name: string
  contactPerson: string
  phone: string
  email: string
  totalRevenue?: number
  totalDue?: number
  status: 'Active' | 'Inactive' | 'Pending'
  createdAt?: string
}

// Add Company Modal
interface AddCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: Company) => void
  isLoading?: boolean
}

export function AddCompanyModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: AddCompanyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Add New Company
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Enter the company details below. All fields marked with <span className="text-destructive font-semibold">*</span> are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-secondary/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Adding a new company will make it available in your system for invoicing and supply management.
          </p>
        </div>
        
        <CompanyForm
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

// Edit Company Modal
interface EditCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
  onSubmit: (data: Company) => void
  isLoading?: boolean
}

export function EditCompanyModal({
  open,
  onOpenChange,
  company,
  onSubmit,
  isLoading = false,
}: EditCompanyModalProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            Edit Company Details
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Update the information for <span className="font-semibold text-foreground">{company.name}</span>. All fields marked with <span className="text-destructive font-semibold">*</span> are required.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-secondary/30 rounded-lg p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            Changes will be saved immediately. You can edit this company anytime.
          </p>
        </div>
        
        <CompanyForm
          company={company}
          onSubmit={(data) => {
            onSubmit(data)
            onOpenChange(false)
          }}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

// View Details Modal
interface ViewCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
}

export function ViewCompanyModal({
  open,
  onOpenChange,
  company,
}: ViewCompanyModalProps) {
  if (!company) return null

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-2 border-border bg-card">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {company.name}
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            Complete company information and financial details
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-4 rounded-lg bg-secondary/40 p-4">
            <div className="flex-1">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Current Status
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`size-3 rounded-full ${
                    company.status === 'Active'
                      ? 'bg-green-500'
                      : company.status === 'Inactive'
                        ? 'bg-gray-500'
                        : 'bg-amber-500'
                  }`}
                />
                <span className="font-semibold text-foreground">
                  {company.status}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Created Date
              </p>
              <p className="font-semibold text-foreground">
                {company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
            <h4 className="font-semibold text-foreground mb-4">Contact Information</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Company Name
                </p>
                <p className="text-base font-semibold text-foreground">{company.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Contact Person
                </p>
                <p className="text-base font-semibold text-foreground">
                  {company.contactPerson}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Phone Number
                </p>
                <p className="text-base font-semibold text-foreground">{company.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Email Address
                </p>
                <p className="text-base font-semibold text-foreground">{company.email}</p>
              </div>
            </div>
          </div>

          {/* Financial Summary */}
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-4">
            <h4 className="font-semibold text-foreground mb-4">Financial Summary</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Revenue
                </p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(company.totalRevenue || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  Total Due
                </p>
                <p
                  className={`text-lg font-bold ${
                    (company.totalDue || 0) > 0
                      ? 'text-amber-600'
                      : 'text-green-600'
                  }`}
                >
                  {formatCurrency(company.totalDue || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-border pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Delete Confirmation Modal
interface DeleteCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company: Company | null
  onConfirm: () => void
  isLoading?: boolean
}

export function DeleteCompanyModal({
  open,
  onOpenChange,
  company,
  onConfirm,
  isLoading = false,
}: DeleteCompanyModalProps) {
  if (!company) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-2 border-destructive/30 bg-card">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex size-14 flex-shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
              <AlertTriangle className="size-7 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-foreground">
                Delete Company
              </DialogTitle>
              <DialogDescription className="mt-3 text-base text-muted-foreground">
                Are you sure you want to permanently delete{' '}
                <span className="font-bold text-foreground">
                  {company.name}
                </span>
                ? This action cannot be undone and will remove all associated data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 my-4">
          <p className="text-sm text-red-700 dark:text-red-400 font-medium">
            Warning: This will permanently delete the company and cannot be reversed.
          </p>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
