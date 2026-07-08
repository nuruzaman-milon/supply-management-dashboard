'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { CompanyDTO, CompanyInput } from '@/app/actions/company.actions'

interface CompanyFormProps {
  company?: CompanyDTO
  onSubmit: (data: CompanyInput) => void
  isLoading?: boolean
}

export function CompanyForm({
  company,
  onSubmit,
  isLoading = false,
}: CompanyFormProps) {
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(
    company?.status || 'ACTIVE'
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const data: CompanyInput = {
      name: formData.get('name') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      address: formData.get('address') as string,
      notes: formData.get('notes') as string,
      status: formData.get('status') as 'ACTIVE' | 'INACTIVE',
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Company Name */}
        <div className="space-y-2.5">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground">
            Company Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Global Tech Solutions"
            defaultValue={company?.name || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Contact Person */}
        <div className="space-y-2.5">
          <Label htmlFor="contactPerson" className="text-sm font-semibold text-foreground">
            Contact Person <span className="text-destructive">*</span>
          </Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            placeholder="e.g., John Smith"
            defaultValue={company?.contactPerson || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2.5">
          <Label htmlFor="phone" className="text-sm font-semibold text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="e.g., +880 1234 567890"
            defaultValue={company?.phone || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2.5">
          <Label htmlFor="email" className="text-sm font-semibold text-foreground">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., contact@company.com"
            defaultValue={company?.email || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Address */}
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="address" className="text-sm font-semibold text-foreground">
            Address
          </Label>
          <Input
            id="address"
            name="address"
            placeholder="e.g., 123 Main St, Dhaka"
            defaultValue={company?.address || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        {/* Status */}
        <div className="space-y-2.5">
          <Label className="text-sm font-semibold text-foreground">
            Company Status <span className="text-destructive">*</span>
          </Label>
          {/* Submitted with the form via FormData */}
          <input type="hidden" name="status" value={status} />
          <div
            role="radiogroup"
            aria-label="Company Status"
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

        {/* Notes */}
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="notes" className="text-sm font-semibold text-foreground">
            Notes
          </Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Any additional information about this company..."
            defaultValue={company?.notes || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        <p className="text-xs text-muted-foreground">
          <span className="text-destructive">*</span> Indicates required fields
        </p>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[140px]"
        >
          {isLoading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
        </Button>
      </div>
    </form>
  )
}
