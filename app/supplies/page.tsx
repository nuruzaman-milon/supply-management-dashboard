import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Trash2, Boxes } from 'lucide-react'

export default function SuppliesPage() {
  const supplies = [
    {
      id: 'SUP001',
      product: 'Stainless Steel Bolts',
      quantity: 5000,
      unit: 'pieces',
      supplier: 'Metal Supply Co',
      status: 'Available',
    },
    {
      id: 'SUP002',
      product: 'Rubber Gaskets',
      quantity: 1200,
      unit: 'pieces',
      supplier: 'Industrial Rubber',
      status: 'Available',
    },
    {
      id: 'SUP003',
      product: 'Copper Wiring',
      quantity: 250,
      unit: 'meters',
      supplier: 'Electric Supply',
      status: 'Low',
    },
    {
      id: 'SUP004',
      product: 'Plastic Containers',
      quantity: 0,
      unit: 'units',
      supplier: 'Packaging Plus',
      status: 'Out',
    },
    {
      id: 'SUP005',
      product: 'Lubricating Oil',
      quantity: 750,
      unit: 'liters',
      supplier: 'Oil Distributors',
      status: 'Available',
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      Available: 'default',
      Low: 'secondary',
      Out: 'destructive',
    }
    return variants[status] || 'default'
  }

  return (
    <DashboardLayout
      title="Supplies"
      breadcrumbs={[{ label: 'Supply Management', href: '#' }, { label: 'Supplies', active: true }]}
    >
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Supply Inventory</h2>
            <p className="text-sm text-muted-foreground">
              Track and manage your supply levels across all warehouses
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Supply
          </Button>
        </div>

        {/* Supplies Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Product
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Supplier
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {supplies.map((supply) => (
                  <tr
                    key={supply.id}
                    className="border-b border-border hover:bg-secondary transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-medium text-foreground">
                        {supply.id}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Boxes className="size-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {supply.product}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {supply.quantity} {supply.unit}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {supply.supplier}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={getStatusBadge(supply.status)}>
                        {supply.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex items-center justify-center rounded-lg hover:bg-secondary p-2 transition-colors">
                          <Edit2 className="size-4 text-muted-foreground" />
                        </button>
                        <button className="inline-flex items-center justify-center rounded-lg hover:bg-secondary p-2 transition-colors">
                          <Trash2 className="size-4 text-destructive" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
