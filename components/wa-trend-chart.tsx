"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"
import type { CampaignData } from "../types/dashboard"

interface WATrendChartProps {
  data: CampaignData[]
}

export function WATrendChart({ data }: WATrendChartProps) {
  // Group data by week and sum WA Masuk
  const chartData = data
    .reduce(
      (acc, item) => {
        const existing = acc.find((d) => d.week === item.week)
        if (existing) {
          existing.waMasuk += item.wamasuk
        } else {
          acc.push({
            week: item.week,
            waMasuk: item.wamasuk,
            date: item.date || item.week,
          })
        }
        return acc
      },
      [] as Array<{ week: string; waMasuk: number; date: string }>,
    )
    .sort((a, b) => a.week.localeCompare(b.week))

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>WA Masuk Trend Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            waMasuk: {
              label: "WA Masuk",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="week" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="waMasuk"
                stroke="var(--color-waMasuk)"
                strokeWidth={2}
                dot={{ fill: "var(--color-waMasuk)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
