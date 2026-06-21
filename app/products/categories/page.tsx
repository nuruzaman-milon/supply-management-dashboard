'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  AddCategoryModal,
  EditCategoryModal,
  ViewCategoryModal,
  DeleteCategoryModal,
} from '@/components/category-modals'
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
} from 'lucide-react'

const mockCategories = [
  {
    id: 1,
    name: 'Electronics',
    description: 'Computer hardware and electronic devices',
    productCount: 4,
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: 2,
    name: 'Furniture',
    description: 'Office and home furniture',
    productCount: 3,
    status: 'active',
    createdDate: '2024-01-15',
  },
  {
    id: 3,
    name: 'Office Supplies',
    description: 'Stationery and office materials',
    productCount: 1,
    status: 'active',
    createdDate: '2024-01-16',
  },
]

interface Category {
  id: string | number
  name: string
  description: string
  productCount: number
  status: string
  createdDate: string
}

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<Category[]>(mockCategories as Category[])
  const [isLoading, setIsLoading] = useState(false)

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle Add Category
  const handleAddCategory = (data: Category) => {
    setIsLoading(true)
    setTimeout(() => {
      setCategories([...categories, data])
      setIsLoading(false)
      setAddModalOpen(false)
    }, 500)
  }

  // Handle Edit Category
  const handleEditCategory = (data: Category) => {
    setIsLoading(true)
    setTimeout(() => {
      setCategories(
        categories.map((c) =>
          c.id === data.id ? data : c
        )
      )
      setIsLoading(false)
      setEditModalOpen(false)
      setSelectedCategory(null)
    }, 500)
  }

  // Handle Delete Category
  const handleDeleteCategory = () => {
    if (!selectedCategory) return
    setIsLoading(true)
    setTimeout(() => {
      setCategories(categories.filter((c) => c.id !== selectedCategory.id))
      setIsLoading(false)
      setDeleteModalOpen(false)
      setSelectedCategory(null)
    }, 500)
  }

  // Handle View Details
  const handleViewDetails = (category: Category) => {
    setSelectedCategory(category)
    setViewModalOpen(true)
  }

  // Handle Edit
  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setEditModalOpen(true)
  }

  // Handle Delete
  const handleDelete = (category: Category) => {
    setSelectedCategory(category)
    setDeleteModalOpen(true)
  }

  return (
    <DashboardLayout title="Product Categories">
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Product Categories
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage product categories and organize your inventory
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>

        {/* Search */}
        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Categories Table */}
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Total Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {category.description}
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <Badge variant="default">
                        {category.status === 'active' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(category.createdDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => handleViewDetails(category)}
                          >
                            <Eye className="size-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer"
                            onClick={() => handleEdit(category)}
                          >
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                            onClick={() => handleDelete(category)}
                          >
                            <Trash2 className="size-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center">
                    <p className="text-muted-foreground">
                      No categories found
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>

      {/* Modals */}
      <AddCategoryModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
        onSubmit={handleAddCategory}
        isLoading={isLoading}
      />

      <EditCategoryModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        category={selectedCategory}
        onSubmit={handleEditCategory}
        isLoading={isLoading}
      />

      <ViewCategoryModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        category={selectedCategory}
        onConfirm={handleDeleteCategory}
        isLoading={isLoading}
      />
      </div>
    </DashboardLayout>
  )
}
