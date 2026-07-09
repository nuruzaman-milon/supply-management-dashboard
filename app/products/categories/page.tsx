'use client'

import { useState, useMemo, useEffect } from 'react'
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
  Filter,
  Tag,
} from 'lucide-react'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  type CategoryDTO,
  type CategoryInput,
} from '@/app/actions/category.actions'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDTO[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isFetching, setIsFetching] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CategoryDTO | null>(null)

  // Load categories from the backend
  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch((error) => {
        console.error('Failed to load categories', error)
        alert((error as Error).message || 'Failed to load categories')
      })
      .finally(() => {
        if (active) setIsFetching(false)
      })
    return () => {
      active = false
    }
  }, [])

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const matchesSearch =
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' || cat.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [categories, searchTerm, statusFilter])

  // Handle Add Category
  const handleAddCategory = async (data: CategoryInput) => {
    setIsSaving(true)
    try {
      const created = await createCategory(data)
      setCategories((prev) => [created, ...prev])
      setAddModalOpen(false)
    } catch (error) {
      console.error('Failed to add category', error)
      alert((error as Error).message || 'Failed to add category')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Edit Category
  const handleEditCategory = async (data: CategoryInput) => {
    if (!selectedCategory) return
    setIsSaving(true)
    try {
      const updated = await updateCategory(selectedCategory.id, data)
      setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      )
      setEditModalOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Failed to update category', error)
      alert((error as Error).message || 'Failed to update category')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle Delete Category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return
    setIsSaving(true)
    try {
      await deleteCategory(selectedCategory.id)
      setCategories((prev) => prev.filter((c) => c.id !== selectedCategory.id))
      setDeleteModalOpen(false)
      setSelectedCategory(null)
    } catch (error) {
      console.error('Failed to delete category', error)
      alert((error as Error).message || 'Failed to delete category')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle View Details
  const handleViewDetails = (category: CategoryDTO) => {
    setSelectedCategory(category)
    setViewModalOpen(true)
  }

  // Handle Edit
  const handleEdit = (category: CategoryDTO) => {
    setSelectedCategory(category)
    setEditModalOpen(true)
  }

  // Handle Delete
  const handleDelete = (category: CategoryDTO) => {
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
              Manage product categories and organize your inventory ({filteredCategories.length})
            </p>
          </div>
          <Button className="gap-2" onClick={() => setAddModalOpen(true)}>
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-4">
            <div className="flex-1">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Search Category
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="w-full md:w-48">
              <label className="mb-2 block text-sm font-medium text-foreground">
                Status
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
              }}
              className="gap-2"
            >
              <Filter className="size-4" />
              Clear
            </Button>
          </div>
        </Card>

        {/* Categories Table */}
        <Card className="overflow-hidden">
          {isFetching ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 inline-block">
                  <div className="size-12 animate-spin rounded-full border-4 border-border border-t-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Loading categories...
                </p>
              </div>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="flex h-96 items-center justify-center">
              <div className="text-center">
                <Tag className="mx-auto mb-4 size-12 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground">
                  No categories found
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Try adjusting your filters or search query'
                    : 'Get started by adding your first category'}
                </p>
              </div>
            </div>
          ) : (
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
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {category.description || '—'}
                    </TableCell>
                    <TableCell>{category.productCount}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          category.status === 'ACTIVE' ? 'default' : 'secondary'
                        }
                      >
                        {category.status === 'ACTIVE' ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(category.createdAt).toLocaleDateString()}
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
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Modals */}
        <AddCategoryModal
          open={addModalOpen}
          onOpenChange={setAddModalOpen}
          onSubmit={handleAddCategory}
          isLoading={isSaving}
        />

        <EditCategoryModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          category={selectedCategory}
          onSubmit={handleEditCategory}
          isLoading={isSaving}
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
          isLoading={isSaving}
        />
      </div>
    </DashboardLayout>
  )
}
