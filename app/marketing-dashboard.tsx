"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Filter } from "lucide-react"

import { MetricCards } from "../components/metric-cards"
import { PerformanceChart } from "../components/performance-chart"
import { TrendsChart } from "../components/trends-chart"
import { ConversionRateTrendsChart } from "../components/conversion-rate-trends-chart"
import { ConversionFunnel } from "../components/conversion-funnel"
import { DataTable } from "../components/data-table"
import { WeeklyInsights } from "../components/weekly-insights"
import { MultiSelectFilter } from "../components/multi-select-filter"
import { fetchSheetsData, transformSheetsData } from "../lib/sheets-api"
import type { CampaignData, MetricCard, Filters } from "../lib/types"
import { TargetModal } from "../components/target-modal"

type TargetData = {
  wamasuk: number
  reservasi: number
  checkin: number
  content: number
}

export default function MarketingDashboard() {
  const [data, setData] = useState<CampaignData[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<Filters>({
    campaign: [],
    week: [],
    cabang: [],
    dateRange: [],
  })

  const [targets, setTargets] = useState<TargetData>({
    wamasuk: 200,
    reservasi: 50,
    checkin: 40,
    content: 8,
  })
  const [showTargetModal, setShowTargetModal] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchSheetsData()
        const transformedData = transformSheetsData(rawData)
        setData(transformedData)
      } catch (error) {
        console.error("Failed to load data:", error)
        // Use mock data for demo
        setData([
          {
            campaign: "Master Campaign",
            cabang: "All",
            week: "Week 1",
            date: "01–07 Jul 2025",
            content: 7,
            ctr: 0.05,
            cpl: 10000,
            wamasuk: 140,
            reservasi: 35,
            resRate: 25,
            conRate: 80,
            cac: 150000,
            checkIn: 28,
            budgetBulanan: "Rp 50.000.000",
            budgetMingguan: "Rp 12.500.000",
            targetCAC: "Rp 142.857",
          },
          {
            campaign: "Summer Promo",
            cabang: "Jakarta",
            week: "Week 2",
            date: "08–14 Jul 2025",
            content: 5,
            ctr: 0.04,
            cpl: 12000,
            wamasuk: 120,
            reservasi: 28,
            resRate: 23.3,
            conRate: 75,
            cac: 160000,
            checkIn: 21,
            budgetBulanan: "Rp 30.000.000",
            budgetMingguan: "Rp 7.500.000",
            targetCAC: "Rp 107.143",
          },
          {
            campaign: "Flash Sale",
            cabang: "Bandung",
            week: "Week 3",
            date: "15–21 Jul 2025",
            content: 3,
            ctr: 0.06,
            cpl: 9000,
            wamasuk: 95,
            reservasi: 20,
            resRate: 21,
            conRate: 85,
            cac: 130000,
            checkIn: 17,
            budgetBulanan: "Rp 20.000.000",
            budgetMingguan: "Rp 5.000.000",
            targetCAC: "Rp 100.000",
          },
          {
            campaign: "Master Campaign",
            cabang: "All",
            week: "Week 4",
            date: "22–28 Jul 2025",
            content: 8,
            ctr: 0.07,
            cpl: 8500,
            wamasuk: 180,
            reservasi: 45,
            resRate: 25,
            conRate: 82,
            cac: 120000,
            checkIn: 37,
            budgetBulanan: "Rp 60.000.000",
            budgetMingguan: "Rp 15.000.000",
            targetCAC: "Rp 110.000",
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Get unique values for dropdowns from actual data
  const uniqueValues = useMemo(() => {
    return {
      campaigns: [...new Set(data.map((item) => item.campaign))],
      weeks: [...new Set(data.map((item) => item.week))].sort((a, b) => {
        const numA = Number.parseInt(a.replace("Week ", ""))
        const numB = Number.parseInt(b.replace("Week ", ""))
        return numA - numB
      }),
      cabangs: [...new Set(data.map((item) => item.cabang))],
      dateRanges: [...new Set(data.map((item) => item.date))],
    }
  }, [data])

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.campaign.length > 0 && !filters.campaign.includes(item.campaign)) return false
      if (filters.week.length > 0 && !filters.week.includes(item.week)) return false
      if (filters.cabang.length > 0 && !filters.cabang.includes(item.cabang)) return false
      if (filters.dateRange.length > 0 && !filters.dateRange.includes(item.date)) return false
      return true
    })
  }, [data, filters])

  // Calculate metrics from filtered data
  const totalWAMasuk = filteredData.reduce((sum, item) => sum + item.wamasuk, 0)
  const totalReservasi = filteredData.reduce((sum, item) => sum + item.reservasi, 0)
  const totalContent = filteredData.reduce((sum, item) => sum + item.content, 0)
  const totalCheckin = filteredData.reduce((sum, item) => sum + item.checkIn, 0)
  const validCTR = filteredData.filter((item) => item.ctr !== 0)
  const totalCTR = validCTR.reduce((sum, item) => sum + item.ctr, 0) / (validCTR.length || 1) / 100

  const validCPL = filteredData.filter((item) => item.cpl !== 0)
  const totalCPL = validCPL.reduce((sum, item) => sum + item.cpl, 0) / (validCPL.length || 1)

  const validCAC = filteredData.filter((item) => item.cac !== 0)
  const totalCAC = validCAC.reduce((sum, item) => sum + item.cac, 0) / (validCAC.length || 1)
  const totalTargetCAC =
    filteredData.reduce((sum, item) => sum + Number.parseFloat(item.targetCAC || "0"), 0) / filteredData.length || 0

  const metrics: MetricCard[] = [
    {
      title: "WA Masuk",
      actual: totalWAMasuk,
      target: targets.wamasuk,
      achievement: (totalWAMasuk / targets.wamasuk) * 100,
      change: ((totalWAMasuk - targets.wamasuk) / targets.wamasuk) * 100,
    },
    {
      title: "Reservasi",
      actual: totalReservasi,
      target: targets.reservasi,
      achievement: (totalReservasi / targets.reservasi) * 100,
      change: ((totalReservasi - targets.reservasi) / targets.reservasi) * 100,
    },
    {
      title: "Check-in",
      actual: Math.round(totalCheckin),
      target: targets.checkin,
      achievement: (Math.round(totalCheckin) / targets.checkin) * 100,
      change: ((Math.round(totalCheckin) - targets.checkin) / targets.checkin) * 100,
    },
    {
      title: "Content",
      actual: totalContent,
      target: targets.content,
      achievement: (totalContent / targets.content) * 100,
      change: ((totalContent - targets.content) / targets.content) * 100,
    },
    {
      title: "CTR",
      actual: totalCTR * 100, // Display as percentage
      unit: "%",
    },
    {
      title: "CPL",
      actual: totalCPL,
      unit: "Rp",
    },
    {
      title: "CAC",
      actual: totalCAC,
      unit: "Rp",
    },
  ]

  const performanceData = [
    { name: "WA Masuk", actual: totalWAMasuk, target: targets.wamasuk },
    { name: "Reservasi", actual: totalReservasi, target: targets.reservasi },
    { name: "Check-in", actual: Math.round(totalCheckin), target: targets.checkin },
    { name: "Content", actual: totalContent, target: targets.content },
  ]

  const trendsData = filteredData.map((item) => ({
    week: item.week,
    wamasuk: item.wamasuk,
    reservasi: item.reservasi,
    rate: item.resRate,
  }))

  const conversionRateTrendsData = filteredData.map((item) => ({
    week: item.week,
    rate: item.resRate,
  }))

  const funnelData = {
    wamasuk: totalWAMasuk,
    reservasi: totalReservasi,
    checkin: Math.round(totalCheckin),
  }

  const targetsMet = metrics.filter((m) => m.achievement && m.achievement >= 100).length
  const avgAchievement =
    metrics.filter((m) => m.achievement !== undefined).reduce((sum, m) => sum + (m.achievement || 0), 0) /
      metrics.filter((m) => m.achievement !== undefined).length || 0
  const biggestGap = Math.min(...metrics.filter((m) => m.change !== undefined).map((m) => m.change || 0))

  // Summary for new metrics (now just showing actual values)
  const financialMetrics = metrics.filter((m) => ["CTR", "CPL", "CAC"].includes(m.title))
  const avgCTR = financialMetrics.find((m) => m.title === "CTR")?.actual || 0
  const avgCPL = financialMetrics.find((m) => m.title === "CPL")?.actual || 0
  const avgCAC = financialMetrics.find((m) => m.title === "CAC")?.actual || 0

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Marketing Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <MultiSelectFilter
                label="Campaign"
                options={uniqueValues.campaigns}
                selected={filters.campaign}
                onChange={(selected) => setFilters({ ...filters, campaign: selected })}
              />

              <MultiSelectFilter
                label="Week"
                options={uniqueValues.weeks}
                selected={filters.week}
                onChange={(selected) => setFilters({ ...filters, week: selected })}
              />

              <MultiSelectFilter
                label="Cabang"
                options={uniqueValues.cabangs}
                selected={filters.cabang}
                onChange={(selected) => setFilters({ ...filters, cabang: selected })}
              />

              <MultiSelectFilter
                label="Date Range"
                options={uniqueValues.dateRanges}
                selected={filters.dateRange}
                onChange={(selected) => setFilters({ ...filters, dateRange: selected })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowTargetModal(true)}>
                Add Target
              </Button>
              <span className="text-sm text-muted-foreground">Track performance against targets</span>
            </div>
          </CardContent>
        </Card>
        {/* Metrics Cards */}
        <MetricCards metrics={metrics} />
        {/* Performance Charts and Summaries */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Actual vs Target Performance Chart */}
          <PerformanceChart
            data={performanceData}
            title="Actual vs Target Performance"
            description={`Comparing actual performance against targets (${filteredData.length} records)`}
          />
          {/* Summary Cards side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Overall Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Targets Met</div>
                    <div className="text-2xl font-bold">{targetsMet}/4</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Avg Achievement</div>
                    <div className="text-2xl font-bold">{avgAchievement.toFixed(1).replace(".", ",")}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Biggest Gap</div>
                    <div className="text-2xl font-bold">{biggestGap.toFixed(1).replace(".", ",")}%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-0">
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Average CTR</div>
                    <div className="text-2xl font-bold">{avgCTR.toFixed(1).replace(".", ",")}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Average CPL</div>
                    <div className="text-2xl font-bold">Rp {avgCPL.toLocaleString("id-ID")}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Average CAC</div>
                    <div className="text-2xl font-bold">Rp {avgCAC.toLocaleString("id-ID")}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Trends and Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TrendsChart
            data={trendsData}
            title="WA Masuk & Reservasi Trends"
            description={`Track leads and conversion volume over time (${filteredData.length} records)`}
          />
          <ConversionRateTrendsChart
            data={conversionRateTrendsData}
            title="Conversion Rate Trend"
            description="WA Masuk to Reservasi conversion percentage"
          />
        </div>
        <WeeklyInsights data={data} /> {/* Pass the unfiltered 'data' here */}
        {/* Conversion Funnel */}
        <ConversionFunnel data={funnelData} />
        {/* Data Table */}
        <DataTable data={filteredData} />
        {/* Target Modal */}
        <TargetModal
          open={showTargetModal}
          onOpenChange={setShowTargetModal}
          onSave={setTargets}
          currentTargets={targets}
        />
      </div>
    </div>
  )
}
