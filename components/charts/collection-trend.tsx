'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', collections: 28000, outstanding: 4000 },
  { month: 'Feb', collections: 35000, outstanding: 4000 },
  { month: 'Mar', collections: 38000, outstanding: 4000 },
  { month: 'Apr', collections: 43000, outstanding: 5000 },
  { month: 'May', collections: 49000, outstanding: 5000 },
  { month: 'Jun', collections: 55000, outstanding: 6000 },
  { month: 'Jul', collections: 59000, outstanding: 6000 },
  { month: 'Aug', collections: 65000, outstanding: 7000 },
  { month: 'Sep', collections: 61000, outstanding: 7000 },
  { month: 'Oct', collections: 68000, outstanding: 7000 },
  { month: 'Nov', collections: 74000, outstanding: 8000 },
  { month: 'Dec', collections: 80000, outstanding: 9000 },
]

export function CollectionTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
        <Area
          type="monotone"
          dataKey="collections"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--accent))"
          name="Collections"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="outstanding"
          fill="hsl(var(--destructive))"
          stroke="hsl(var(--destructive))"
          name="Outstanding"
          fillOpacity={0.4}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
