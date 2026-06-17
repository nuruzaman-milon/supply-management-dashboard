'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
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

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState(mockCategories)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCategory = () => {
    if (formData.name.trim()) {
      const newCategory = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        name: formData.name,
        description: formData.description,
        productCount: 0,
        status: 'active',
        createdDate: new Date().toISOString().split('T')[0],
      }
      setCategories([...categories, newCategory])
      setFormData({ name: '', description: '' })
      setIsAddOpen(false)
    }
  }

  const handleEditCategory = () => {
    if (editingId && formData.name.trim()) {
      setCategories(
        categories.map((cat) =>
          cat.id === editingId
            ? { ...cat, name: formData.name, description: formData.description }
            : cat
        )
      )
      setFormData({ name: '', description: '' })
      setEditingId(null)
      setIsEditOpen(false)
    }
  }

  const handleDeleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id))
  }

  const openEditDialog = (category) => {
    setEditingId(category.id)
    setFormData({ name: category.name, description: category.description })
    setIsEditOpen(true)
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
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new product category
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cat-name">Category Name</Label>
                  <Input
                    id="cat-name"
                    placeholder="e.g., Electronics"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="cat-desc">Description</Label>
                  <Textarea
                    id="cat-desc"
                    placeholder="Category description..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddCategory}>Add Category</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
                            className="gap-2"
                            onClick={() => openEditDialog(category)}
                          >
                            <Edit2 className="size-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="gap-2 text-red-600"
                            onClick={() => handleDeleteCategory(category.id)}
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

        {/* Edit Category Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>
                Update the category details
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-cat-name">Category Name</Label>
                <Input
                  id="edit-cat-name"
                  placeholder="e.g., Electronics"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="edit-cat-desc">Description</Label>
                <Textarea
                  id="edit-cat-desc"
                  placeholder="Category description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingId(null)
                    setFormData({ name: '', description: '' })
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleEditCategory}>Update Category</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
