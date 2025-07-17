import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Calendar, Lightbulb, TrendingDown } from "lucide-react"
import type { CampaignData } from "@/lib/types"

interface WeeklyInsightsProps {
  data: CampaignData[]
}

export function WeeklyInsights({ data }: WeeklyInsightsProps) {
  // Group data by week and calculate aggregates
  const weeklyAggregates = data.reduce(
    (acc, item) => {
      const weekKey = item.week // Use the string directly, e.g., "Week 1"

      if (!acc[weekKey]) {
        acc[weekKey] = {
          week: weekKey,
          wamasuk: 0,
          reservasi: 0,
          resRateSum: 0,
          count: 0,
        }
      }
      acc[weekKey].wamasuk += item.wamasuk
      acc[weekKey].reservasi += item.reservasi
      acc[weekKey].resRateSum += item.resRate
      acc[weekKey].count += 1
      return acc
    },
    {} as Record<string, { week: string; wamasuk: number; reservasi: number; resRateSum: number; count: number }>,
  )

  // Convert to array and sort by week number (extract number from "Week X")
  const insights = Object.values(weeklyAggregates)
    .map((agg) => ({
      week: agg.week,
      wamasuk: agg.wamasuk,
      reservasi: agg.reservasi,
      resRate: agg.count > 0 ? agg.resRateSum / agg.count : 0,
    }))
    .sort((a, b) => {
      const weekNumA = Number.parseInt(a.week.replace("Week ", ""))
      const weekNumB = Number.parseInt(b.week.replace("Week ", ""))
      return weekNumA - weekNumB
    })

  // Calculate week-over-week changes
  const insightsWithChanges = insights.map((currentWeek, index) => {
    const previousWeek = insights[index - 1]
    if (!previousWeek) {
      return { ...currentWeek, waChange: undefined, resChange: undefined, resRateChange: undefined }
    }

    const waChange =
      previousWeek.wamasuk > 0 ? ((currentWeek.wamasuk - previousWeek.wamasuk) / previousWeek.wamasuk) * 100 : 0
    const resChange =
      previousWeek.reservasi > 0 ? ((currentWeek.reservasi - previousWeek.reservasi) / previousWeek.reservasi) * 100 : 0
    const resRateChange = currentWeek.resRate - previousWeek.resRate // in percentage points

    return { ...currentWeek, waChange, resChange, resRateChange }
  })

  // Find best weeks based on actual data
  const bestWaWeek = insightsWithChanges.reduce((best, current) => (current.wamasuk > best.wamasuk ? current : best), {
    week: "",
    wamasuk: -1,
    reservasi: 0,
    resRate: 0,
  })
  const bestConversionWeek = insightsWithChanges.reduce(
    (best, current) => (current.resRate > best.resRate ? current : best),
    { week: "", wamasuk: 0, reservasi: 0, resRate: -1 },
  )
  const mostReservationsWeek = insightsWithChanges.reduce(
    (best, current) => (current.reservasi > best.reservasi ? current : best),
    { week: "", wamasuk: 0, reservasi: -1, resRate: 0 },
  )

  // Generate Key Insight text
  const latestWeek = insightsWithChanges[insightsWithChanges.length - 1]
  let keyInsightText = "No significant trends observed yet."

  if (latestWeek) {
    const waTrend = latestWeek.waChange !== undefined ? (latestWeek.waChange > 0 ? "growth" : "decline") : null
    const resTrend = latestWeek.resChange !== undefined ? (latestWeek.resChange > 0 ? "increase" : "decrease") : null
    const resRateTrend =
      latestWeek.resRateChange !== undefined ? (latestWeek.resRateChange > 0 ? "improved" : "declined") : null

    const parts = []
    if (waTrend && latestWeek.waChange !== undefined) {
      parts.push(`${latestWeek.waChange.toFixed(1)}% WA ${waTrend}`)
    }
    if (resTrend && latestWeek.resChange !== undefined) {
      parts.push(`${latestWeek.resChange.toFixed(1)}% reservation ${resTrend}`)
    }
    if (resRateTrend && latestWeek.resRateChange !== undefined) {
      parts.push(`conversion rate ${resRateTrend} by ${Math.abs(latestWeek.resRateChange).toFixed(1)}pp`)
    }

    if (parts.length > 0) {
      keyInsightText = `Week ${latestWeek.week} showed ${parts.join(" and ")}.`
      if (latestWeek.resRateChange !== undefined && Math.abs(latestWeek.resRateChange) < 1) {
        keyInsightText += " Conversion rate has stabilized in recent weeks."
      }
    }
  }

  const renderChange = (change?: number) => {
    if (change === undefined) return null
    const isPositive = change >= 0
    const icon = isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
    return (
      <span className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {icon}
        {change.toFixed(1)}%
      </span>
    )
  }

  const renderPpChange = (change?: number) => {
    if (change === undefined) return null
    const isPositive = change >= 0
    const icon = isPositive ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    )
    return (
      <span className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
        {icon}
        {change.toFixed(1)}pp
      </span>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Performance Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Best WA Week</span>
            </div>
            <div className="text-lg font-bold">{bestWaWeek.week}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {bestWaWeek.wamasuk} inquiries
              {insightsWithChanges.find((i) => i.week === bestWaWeek.week)?.waChange !== undefined &&
                renderChange(insightsWithChanges.find((i) => i.week === bestWaWeek.week)?.waChange)}
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Best Conversion Week</span>
            </div>
            <div className="text-lg font-bold">{bestConversionWeek.week}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {bestConversionWeek.resRate.toFixed(1)}% rate
              {insightsWithChanges.find((i) => i.week === bestConversionWeek.week)?.resRateChange !== undefined &&
                renderPpChange(insightsWithChanges.find((i) => i.week === bestConversionWeek.week)?.resRateChange)}
            </div>
          </div>
          <div className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Most Reservations</span>
            </div>
            <div className="text-lg font-bold">{mostReservationsWeek.week}</div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {mostReservationsWeek.reservasi} bookings
              {insightsWithChanges.find((i) => i.week === mostReservationsWeek.week)?.resChange !== undefined &&
                renderChange(insightsWithChanges.find((i) => i.week === mostReservationsWeek.week)?.resChange)}
            </div>
          </div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <div className="font-medium text-blue-900 mb-1">Key Insight</div>
              <div className="text-sm text-blue-800">{keyInsightText}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
