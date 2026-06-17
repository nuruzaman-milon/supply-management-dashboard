'use client'

import { useState } from 'react'
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
  Plus,
  Search,
  MoreHorizontal,
  Edit2,
  Lock,
  Unlock,
  Trash2,
} from 'lucide-react'

const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@company.com',
    role: 'Admin',
    status: 'Active',
    lastLogin: '2024-06-17',
  },
  {
    id: 2,
    name: 'Sales User',
    email: 'sales@company.com',
    role: 'Sales Manager',
    status: 'Active',
    lastLogin: '2024-06-16',
  },
  {
    id: 3,
    name: 'Accounts User',
    email: 'accounts@company.com',
    role: 'Accounts Officer',
    status: 'Active',
    lastLogin: '2024-06-15',
  },
  {
    id: 4,
    name: 'Reporting User',
    email: 'reporting@company.com',
    role: 'Finance Manager',
    status: 'Active',
    lastLogin: '2024-06-14',
  },
  {
    id: 5,
    name: 'Inactive User',
    email: 'inactive@company.com',
    role: 'Data Entry',
    status: 'Inactive',
    lastLogin: '2024-05-10',
  },
]

const roles = [
  'All Roles',
  'Admin',
  'Sales Manager',
  'Accounts Officer',
  'Finance Manager',
  'Data Entry',
]

const statuses = ['All Status', 'Active', 'Inactive']

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole =
      selectedRole === 'All Roles' || user.role === selectedRole
    const matchesStatus =
      selectedStatus === 'All Status' || user.status === selectedStatus

    return matchesSearch && matchesRole && matchesStatus
  })

  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <DashboardLayout title="Users">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-sm text-muted-foreground">
              Manage system users and permissions
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add User
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Status
              </label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => {
                  setSelectedStatus(value)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedRole !== 'All Roles' || selectedStatus !== 'All Status') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedRole('All Roles')
                setSelectedStatus('All Status')
                setCurrentPage(1)
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          )}
        </Card>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === 'Active'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Edit2 className="size-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            {user.status === 'Active' ? (
                              <>
                                <Lock className="size-4" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Unlock className="size-4" />
                                Activate
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="size-4" />
                            Delete User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, filteredUsers.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of{' '}
              {filteredUsers.length} users
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
