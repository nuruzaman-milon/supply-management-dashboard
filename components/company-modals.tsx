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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Company</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new company to your system.
          </DialogDescription>
        </DialogHeader>
        
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Company</DialogTitle>
          <DialogDescription>
            Update the company information below.
          </DialogDescription>
        </DialogHeader>
        
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{company.name}</DialogTitle>
          <DialogDescription>
            Complete company information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Company Name */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Company Name
              </p>
              <p className="mt-1 text-base font-semibold">{company.name}</p>
            </div>

            {/* Contact Person */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Person
              </p>
              <p className="mt-1 text-base font-semibold">
                {company.contactPerson}
              </p>
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Phone Number
              </p>
              <p className="mt-1 text-base font-semibold">{company.phone}</p>
            </div>

            {/* Email */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Email Address
              </p>
              <p className="mt-1 text-base font-semibold">{company.email}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <p className="mt-1 text-base font-semibold">{company.status}</p>
            </div>

            {/* Created Date */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Created Date
              </p>
              <p className="mt-1 text-base font-semibold">
                {company.createdAt
                  ? new Date(company.createdAt).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>

            {/* Total Revenue */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </p>
              <p className="mt-1 text-base font-semibold">
                {formatCurrency(company.totalRevenue || 0)}
              </p>
            </div>

            {/* Total Due */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Due
              </p>
              <p
                className={`mt-1 text-base font-semibold ${
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

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-6 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Company</DialogTitle>
              <DialogDescription className="mt-2">
                Are you sure you want to delete{' '}
                <span className="font-semibold text-foreground">
                  {company.name}
                </span>
                ? This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Deleting...' : 'Delete Company'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
