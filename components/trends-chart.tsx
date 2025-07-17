"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface TrendsChartProps {
  data: any[]
  title: string
  description: string
}

export function TrendsChart({ data, title, description }: TrendsChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            wamasuk: {
              label: "WA Masuk",
              color: "hsl(var(--chart-1))",
            },
            reservasi: {
              label: "Reservasi",
              color: "hsl(var(--chart-2))",
            },
            rate: {
              label: "Conversion Rate",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[300px] w-full min-w-0"
        >
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="wamasuk" stroke="var(--color-wamasuk)" strokeWidth={2} />
              <Line type="monotone" dataKey="reservasi" stroke="var(--color-reservasi)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
