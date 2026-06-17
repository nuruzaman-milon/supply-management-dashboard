'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Plus, MoreHorizontal, Edit2, Trash2 } from 'lucide-react'

const mockRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access and administrative privileges',
    userCount: 1,
    permissions: [
      'Create Users',
      'Edit Users',
      'Delete Users',
      'View Reports',
      'Configure Settings',
      'Manage Roles',
    ],
  },
  {
    id: 2,
    name: 'Sales Manager',
    description: 'Manage sales operations and company information',
    userCount: 1,
    permissions: [
      'Create Company',
      'Edit Company',
      'View Products',
      'Create Supply',
      'View Reports',
    ],
  },
  {
    id: 3,
    name: 'Accounts Officer',
    description: 'Handle invoicing and payment collections',
    userCount: 1,
    permissions: [
      'Create Invoice',
      'Edit Invoice',
      'Record Collection',
      'View Due Management',
      'View Reports',
    ],
  },
  {
    id: 4,
    name: 'Finance Manager',
    description: 'Analyze financial reports and performance',
    userCount: 1,
    permissions: [
      'View Revenue Report',
      'View Collection Report',
      'View Due Report',
      'Export Reports',
    ],
  },
  {
    id: 5,
    name: 'Data Entry',
    description: 'Enter and manage basic operational data',
    userCount: 0,
    permissions: ['Create Supply', 'Create Collection', 'View Products'],
  },
]

export default function RolesPage() {
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10
  const totalPages = Math.ceil(mockRoles.length / itemsPerPage)
  const paginatedRoles = mockRoles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <DashboardLayout title="Roles">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Roles</h1>
            <p className="text-sm text-muted-foreground">
              Manage user roles and permissions
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Create Role
          </Button>
        </div>

        {/* Roles Cards */}
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {paginatedRoles.map((role) => (
            <Card key={role.id} className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {role.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {role.description}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit2 className="size-4" />
                      Edit Role
                    </DropdownMenuItem>
                    <DropdownMenuItem className="gap-2 text-red-600">
                      <Trash2 className="size-4" />
                      Delete Role
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Users
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {role.userCount}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
                  Permissions
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.slice(0, 3).map((perm, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                  {role.permissions.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{role.permissions.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Roles Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Users Count</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRoles.length > 0 ? (
                paginatedRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell className="font-semibold">
                      {role.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {role.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{role.userCount}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {role.permissions.slice(0, 2).map((perm, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs"
                          >
                            {perm}
                          </Badge>
                        ))}
                        {role.permissions.length > 2 && (
                          <Badge
                            variant="outline"
                            className="text-xs cursor-pointer"
                            title={role.permissions.slice(2).join(', ')}
                          >
                            +{role.permissions.length - 2}
                          </Badge>
                        )}
                      </div>
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
                            Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-red-600">
                            <Trash2 className="size-4" />
                            Delete Role
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center">
                    <p className="text-muted-foreground">No roles found</p>
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
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, mockRoles.length)} to{' '}
              {Math.min(currentPage * itemsPerPage, mockRoles.length)} of{' '}
              {mockRoles.length} roles
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
