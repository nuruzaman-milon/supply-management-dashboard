import { DashboardLayout } from '@/components/dashboard-layout'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Building2 } from 'lucide-react'

export default function CompaniesPage() {
  const companies = [
    { id: 1, name: 'Acme Corp', status: 'Active', employees: 245 },
    { id: 2, name: 'Tech Solutions', status: 'Active', employees: 156 },
    { id: 3, name: 'Global Supplies', status: 'Inactive', employees: 89 },
    { id: 4, name: 'Innovation Labs', status: 'Active', employees: 312 },
    { id: 5, name: 'Supply Chain Pro', status: 'Active', employees: 178 },
  ]

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
              Manage all company profiles and information
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Company
          </Button>
        </div>

        {/* Companies Table */}
        <Card className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Company Name
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                    Employees
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr
                    key={company.id}
                    className="border-b border-border hover:bg-secondary transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-secondary p-2">
                          <Building2 className="size-4 text-primary" />
                        </div>
                        <span className="font-medium text-foreground">
                          {company.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          company.status === 'Active'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {company.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground">
                      {company.employees}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center justify-center rounded-lg hover:bg-secondary p-2 transition-colors">
                        <MoreHorizontal className="size-4 text-muted-foreground" />
                      </button>
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
