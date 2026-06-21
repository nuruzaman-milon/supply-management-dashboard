'use client'

import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AddCompanyModal,
  EditCompanyModal,
  ViewCompanyModal,
  DeleteCompanyModal,
} from '@/components/company-modals'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Filter,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface Company {
  id: string
  name: string
  contactPerson: string
  phone: string
  email: string
  totalRevenue: number
  totalDue: number
  status: 'Active' | 'Inactive' | 'Pending'
  createdAt: string
}

const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    contactPerson: 'John Smith',
    phone: '+1-555-0101',
    email: 'john@acme.com',
    totalRevenue: 125000,
    totalDue: 15000,
    status: 'Active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Global Tech Solutions',
    contactPerson: 'Sarah Johnson',
    phone: '+1-555-0102',
    email: 'sarah@globaltech.com',
    totalRevenue: 89000,
    totalDue: 8900,
    status: 'Active',
    createdAt: '2024-02-20',
  },
  {
    id: '3',
    name: 'Innovative Supply Co',
    contactPerson: 'Michael Chen',
    phone: '+1-555-0103',
    email: 'michael@innovsupply.com',
    totalRevenue: 156000,
    totalDue: 0,
    status: 'Active',
    createdAt: '2023-12-10',
  },
  {
    id: '4',
    name: 'Prime Distribution',
    contactPerson: 'Emily Davis',
    phone: '+1-555-0104',
    email: 'emily@primedist.com',
    totalRevenue: 92000,
    totalDue: 12000,
    status: 'Inactive',
    createdAt: '2024-03-05',
  },
  {
    id: '5',
    name: 'Connected Logistics',
    contactPerson: 'David Wilson',
    phone: '+1-555-0105',
    email: 'david@conlogistics.com',
    totalRevenue: 234000,
    totalDue: 28000,
    status: 'Active',
    createdAt: '2024-01-25',
  },
  {
    id: '6',
    name: 'Quantum Materials',
    contactPerson: 'Lisa Rodriguez',
    phone: '+1-555-0106',
    email: 'lisa@quantummaterials.com',
    totalRevenue: 178000,
    totalDue: 22000,
    status: 'Pending',
    createdAt: '2024-04-01',
  },
  {
    id: '7',
    name: 'Nexus Imports Ltd',
    contactPerson: 'James Brown',
    phone: '+1-555-0107',
    email: 'james@nexusimports.com',
    totalRevenue: 65000,
    totalDue: 5000,
    status: 'Active',
    createdAt: '2024-02-14',
  },
  {
    id: '8',
    name: 'Strategic Partners Inc',
    contactPerson: 'Amanda Martinez',
    phone: '+1-555-0108',
    email: 'amanda@stratpartners.com',
    totalRevenue: 201000,
    totalDue: 35000,
    status: 'Active',
    createdAt: '2023-11-30',
  },
  {
    id: '9',
    name: 'Elite Manufacturing',
    contactPerson: 'Robert Taylor',
    phone: '+1-555-0109',
    email: 'robert@elitemanufacturing.com',
    totalRevenue: 145000,
    totalDue: 18000,
    status: 'Active',
    createdAt: '2024-01-08',
  },
  {
    id: '10',
    name: 'Universal Trade Group',
    contactPerson: 'Jennifer Garcia',
    phone: '+1-555-0110',
    email: 'jennifer@universaltrade.com',
    totalRevenue: 112000,
    totalDue: 9000,
    status: 'Inactive',
    createdAt: '2024-03-20',
  },
]

const ITEMS_PER_PAGE = 5

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>(mockCompanies)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)

  // Filter companies
  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || company.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [companies, searchQuery, statusFilter])

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  )

  // Reset page when filter changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'default'
      case 'Inactive':
        return 'secondary'
      case 'Pending':
        return 'outline'
      default:
        return 'default'
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(value)
  }

  // Handle Add Company
  const handleAddCompany = (data: Company) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newCompany: Company = {
        ...data,
        id: (companies.length + 1).toString(),
        totalRevenue: 0,
        totalDue: 0,
        createdAt: new Date().toISOString().split('T')[0],
      }
      setCompanies([...companies, newCompany])
      setIsLoading(false)
      setAddModalOpen(false)
    }, 500)
  }

  // Handle Edit Company
  const handleEditCompany = (data: Company) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCompanies(
        companies.map((c) =>
          c.id === data.id
            ? { ...c, ...data }
            : c
        )
      )
      setIsLoading(false)
      setEditModalOpen(false)
      setSelectedCompany(null)
    }, 500)
  }

  // Handle Delete Company
  const handleDeleteCompany = () => {
    if (!selectedCompany) return
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCompanies(companies.filter((c) => c.id !== selectedCompany.id))
      setIsLoading(false)
      setDeleteModalOpen(false)
      setSelectedCompany(null)
    }, 500)
  }

  // Handle View Details
  const handleViewDetails = (company: Company) => {
    setSelectedCompany(company)
    setViewModalOpen(true)
  }

  // Handle Edit
  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setEditModalOpen(true)
  }

  // Handle Delete
  const handleDelete = (company: Company) => {
    setSelectedCompany(company)
    setDeleteModalOpen(true)
  }

  return (
    <DashboardLayout
      title="Companies"
      breadcrumbs={[{ label: 'Companies', active: true }]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Companies</h2>
            <p className="text-sm text-muted-foreground">
              Manage all company profiles and information ({filteredCompanies.length})
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="size-4" />
            Add Company
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
            {/* Search */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search Company
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, contact, or email..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="w-full md:w-48">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Status
              </label>
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters Button */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setCurrentPage(1)
              }}
              className="gap-2"
            >
              <Filter className="size-4" />
              Clear
            </Button>
          </div>
        </Card>

        {/* Companies Table */}
        <Card>
          {isLoading ? (
            // Loading State
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Loading companies...
                </p>
              </div>
            </div>
          ) : paginatedCompanies.length === 0 ? (
            // Empty State
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <Building2 className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">
                  No companies found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Get started by adding your first company'}
                </p>
                {(searchQuery || statusFilter !== 'all') && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery('')
                      setStatusFilter('all')
                      setCurrentPage(1)
                    }}
                    className="mt-4"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Total Revenue</TableHead>
                      <TableHead className="text-right">Total Due</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedCompanies.map((company) => (
                      <TableRow key={company.id} className="hover:bg-secondary/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-secondary p-2">
                              <Building2 className="size-4 text-primary" />
                            </div>
                            <span className="font-medium">{company.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {company.contactPerson}
                        </TableCell>
                        <TableCell className="text-sm">
                          {company.phone}
                        </TableCell>
                        <TableCell className="text-sm">
                          {company.email}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatCurrency(company.totalRevenue)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={
                              company.totalDue > 0
                                ? 'font-semibold text-amber-600'
                                : 'text-green-600'
                            }
                          >
                            {formatCurrency(company.totalDue)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(company.status)}>
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="size-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => handleViewDetails(company)}
                              >
                                <Eye className="size-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => handleEdit(company)}
                              >
                                <Edit className="size-4" />
                                Edit Company
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                                onClick={() => handleDelete(company)}
                              >
                                <Trash2 className="size-4" />
                                Delete Company
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between border-t border-border px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredCompanies.length)} of{' '}
                  {filteredCompanies.length} companies
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.max(1, p - 1))
                    }
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Modals */}
      <AddCompanyModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddCompany}
        isLoading={isLoading}
      />

      <EditCompanyModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        company={selectedCompany}
        onSubmit={handleEditCompany}
        isLoading={isLoading}
      />

      <ViewCompanyModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        company={selectedCompany}
      />

      <DeleteCompanyModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        company={selectedCompany}
        onConfirm={handleDeleteCompany}
        isLoading={isLoading}
      />
    </DashboardLayout>
  )
}
