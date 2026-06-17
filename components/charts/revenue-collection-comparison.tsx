'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', revenue: 32000, collections: 28000 },
  { month: 'Feb', revenue: 39000, collections: 35000 },
  { month: 'Mar', revenue: 42000, collections: 38000 },
  { month: 'Apr', revenue: 48000, collections: 43000 },
  { month: 'May', revenue: 54000, collections: 49000 },
  { month: 'Jun', revenue: 61000, collections: 55000 },
  { month: 'Jul', revenue: 65000, collections: 59000 },
  { month: 'Aug', revenue: 72000, collections: 65000 },
  { month: 'Sep', revenue: 68000, collections: 61000 },
  { month: 'Oct', revenue: 75000, collections: 68000 },
  { month: 'Nov', revenue: 82000, collections: 74000 },
  { month: 'Dec', revenue: 89000, collections: 80000 },
]

export function RevenueCollectionComparisonChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="month" className="text-xs text-muted-foreground" />
        <YAxis className="text-xs text-muted-foreground" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
          }}
          labelStyle={{ color: 'hsl(var(--foreground))' }}
        />
        <Legend />
        <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue" radius={[8, 8, 0, 0]} />
        <Bar dataKey="collections" fill="hsl(var(--accent))" name="Collections" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
