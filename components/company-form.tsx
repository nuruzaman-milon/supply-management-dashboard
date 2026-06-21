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
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium">
            Company Name
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter company name"
            defaultValue={company?.name || ''}
            required
          />
        </div>

        {/* Contact Person */}
        <div className="space-y-2">
          <Label htmlFor="contactPerson" className="text-sm font-medium">
            Contact Person
          </Label>
          <Input
            id="contactPerson"
            name="contactPerson"
            placeholder="Enter contact person name"
            defaultValue={company?.contactPerson || ''}
            required
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            defaultValue={company?.phone || ''}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email address"
            defaultValue={company?.email || ''}
            required
          />
        </div>

        {/* Status */}
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="status" className="text-sm font-medium">
            Status
          </Label>
          <Select name="status" defaultValue={company?.status || 'Active'}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 border-t border-border pt-6">
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : company ? 'Update Company' : 'Add Company'}
        </Button>
      </div>
    </form>
  )
}
