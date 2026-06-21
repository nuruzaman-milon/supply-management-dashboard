'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface CompanyFormProps {
  company?: Company
  onSubmit: (data: Company) => void
  isLoading?: boolean
}

export function CompanyForm({
  company,
  onSubmit,
  isLoading = false,
}: CompanyFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const data: Company = {
      id: company?.id,
      name: formData.get('name') as string,
      contactPerson: formData.get('contactPerson') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      status: formData.get('status') as 'Active' | 'Inactive' | 'Pending',
      totalRevenue: company?.totalRevenue || 0,
      totalDue: company?.totalDue || 0,
      createdAt: company?.createdAt || new Date().toISOString().split('T')[0],
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
            Email Address <span className="text-destructive">*</span>
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="e.g., contact@company.com"
            defaultValue={company?.email || ''}
            className="border-2 border-border bg-card text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
            required
          />
        </div>

        {/* Status */}
        <div className="space-y-2.5 sm:col-span-2">
          <Label htmlFor="status" className="text-sm font-semibold text-foreground">
            Company Status <span className="text-destructive">*</span>
          </Label>
          <Select name="status" defaultValue={company?.status || 'Active'}>
            <SelectTrigger className="border-2 border-border bg-card text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active - Currently Operational</SelectItem>
              <SelectItem value="Inactive">Inactive - Not Operational</SelectItem>
              <SelectItem value="Pending">Pending - Approval Required</SelectItem>
            </SelectContent>
          </Select>
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
