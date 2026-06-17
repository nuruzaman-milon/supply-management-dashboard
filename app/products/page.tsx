import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Package, Zap } from 'lucide-react'

export default function ProductsPage() {
  const products = [
    { id: 1, name: 'Industrial Fasteners', category: 'Hardware', stock: 1240, status: 'In Stock' },
    { id: 2, name: 'Electronic Components', category: 'Electronics', stock: 856, status: 'In Stock' },
    { id: 3, name: 'Safety Equipment', category: 'Safety', stock: 42, status: 'Low Stock' },
    { id: 4, name: 'Packaging Materials', category: 'Supplies', stock: 0, status: 'Out of Stock' },
    { id: 5, name: 'Hydraulic Fluids', category: 'Fluids', stock: 523, status: 'In Stock' },
  ]

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'In Stock':
        return 'default'
      case 'Low Stock':
        return 'secondary'
      case 'Out of Stock':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <DashboardLayout
      title="Products"
      breadcrumbs={[{ label: 'Products', active: true }]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Products</h2>
            <p className="text-sm text-muted-foreground">
              Browse and manage your product inventory
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-video bg-secondary flex items-center justify-center">
                <Package className="size-8 text-muted-foreground" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {product.category}
                    </p>
                  </div>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    Stock: {product.stock}
                  </span>
                  <Badge variant={getStatusVariant(product.status)}>
                    {product.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <Zap className="size-3 mr-2" />
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
