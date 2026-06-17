'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const data = [
  { month: 'Jan', revenue: 32000, target: 24000 },
  { month: 'Feb', revenue: 39000, target: 36000 },
  { month: 'Mar', revenue: 42000, target: 38000 },
  { month: 'Apr', revenue: 48000, target: 42000 },
  { month: 'May', revenue: 54000, target: 45000 },
  { month: 'Jun', revenue: 61000, target: 50000 },
  { month: 'Jul', revenue: 65000, target: 55000 },
  { month: 'Aug', revenue: 72000, target: 60000 },
  { month: 'Sep', revenue: 68000, target: 65000 },
  { month: 'Oct', revenue: 75000, target: 70000 },
  { month: 'Nov', revenue: 82000, target: 75000 },
  { month: 'Dec', revenue: 89000, target: 80000 },
]

export function RevenueTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
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
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ fill: 'hsl(var(--primary))' }}
          name="Monthly Revenue"
        />
        <Line
          type="monotone"
          dataKey="target"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth={2}
          strokeDasharray="5 5"
          dot={{ fill: 'hsl(var(--muted-foreground))' }}
          name="Revenue Target"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
