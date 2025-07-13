"use client"

import { useState, useEffect, useMemo } from "react"
import { FilterSidebar } from "./components/filter-sidebar"
import { KPIMetricsComponent } from "./components/kpi-metrics"
import { WATrendChart } from "./components/wa-trend-chart"
import { CampaignTable } from "./components/campaign-table"
import { fetchSheetsData, transformSheetsData } from "./services/sheets-api"
import type { CampaignData, FilterState, KPIMetrics } from "./types/dashboard"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import IntroScreen from "./components/intro-screen"

// Mock data for development - replace with actual Google Sheets data
// Update the mock data to remove unnecessary fields:
const mockData: CampaignData[] = [
  {
    campaign: "Holiday Special",
    week: "Week 2",
    cabang: "Medan",
    date: "01 Juli - 07 Juli 2025",
    content: 6,
    wamasuk: 164,
    reservasi: 64,
    resRate: 41.4,
  },
  {
    campaign: "Weekend Promo",
    week: "Week 3",
    cabang: "Bandung",
    date: "08 Juli - 15 Juli 2025",
    content: 15,
    wamasuk: 597,
    reservasi: 83,
    resRate: 32.6,
  },
  {
    campaign: "Holiday Special",
    week: "Week 3",
    cabang: "Jakarta Selatan",
    date: "08 Juli - 15 Juli 2025",
    content: 23,
    wamasuk: 1086,
    reservasi: 62,
    resRate: 31.2,
  },
  {
    campaign: "50% New Customer",
    week: "Week 4",
    cabang: "Bandung",
    date: "16 Juli - 23 Juli 2025",
    content: 18,
    wamasuk: 1313,
    reservasi: 94,
    resRate: 43.3,
  },
  {
    campaign: "Weekend Promo",
    week: "Week 2",
    cabang: "Bandung",
    date: "01 Juli - 07 Juli 2025",
    content: 6,
    wamasuk: 934,
    reservasi: 54,
    resRate: 37.3,
  },
]

export default function Dashboard() {
  const [data, setData] = useState<CampaignData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // Update the initial filters state:
  const [filters, setFilters] = useState<FilterState>({
    campaign: "all",
    week: "all",
    cabang: [],
    dateRange: [],
  })
  const [showIntro, setShowIntro] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowIntro(false)
    }, 2500)

    return () => clearTimeout(timeout)
  }, [])  

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        // Try to fetch from Google Sheets, fallback to mock data
        try {
          const rawData = await fetchSheetsData()
          const transformedData = transformSheetsData(rawData)
          setData(transformedData.length > 0 ? transformedData : mockData)
        } catch (sheetsError) {
          console.warn("Failed to fetch from Google Sheets, using mock data:", sheetsError)
          setData(mockData)
        }
      } catch (err) {
        setError("Failed to load data")
        setData(mockData) // Fallback to mock data
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Update the filteredData logic to include date range filtering:
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      if (filters.campaign !== "all" && item.campaign !== filters.campaign) return false
      if (filters.week !== "all" && item.week !== filters.week) return false
      if (filters.cabang.length > 0 && !filters.cabang.includes(item.cabang)) return false
      if (
        filters.dateRange.length > 0 &&
        !filters.dateRange.includes(item.date)
      ) return false
      return true
    })
  }, [data, filters])

  // Update the KPI metrics calculation to remove omzet and booking rate:
  const kpiMetrics: KPIMetrics = useMemo(() => {
    const totalContent = filteredData.reduce((sum, item) => sum + item.content, 0)
    const totalWaMasuk = filteredData.reduce((sum, item) => sum + item.wamasuk, 0)
    const totalReservasi = filteredData.reduce((sum, item) => sum + item.reservasi, 0)

    return {
      contentProduction: totalContent,
      contentTarget: 1067,
      waMasuk: totalWaMasuk,
      waMasukTarget: 10911,
      totalReservasi: totalReservasi,
      reservasiTarget: 5165,
    }
  }, [filteredData])

  if (showIntro) return <IntroScreen />

  const uniqueCampaigns = [...new Set(data.map((item) => item.campaign))]
  const uniqueWeeks = [...new Set(data.map((item) => item.week))].sort()
  const uniqueBranches = [...new Set(data.map((item) => item.cabang))]
  const dateRanges = [...new Set(data.map((item) => item.date))].filter(Boolean).sort()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <CardContent className="flex items-center space-x-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <div>
              <h3 className="font-semibold">Loading Dashboard</h3>
              <p className="text-sm text-muted-foreground">Fetching data from Google Sheets...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8">
          <CardContent className="flex items-center space-x-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <div>
              <h3 className="font-semibold text-red-700">Error Loading Data</h3>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">📊 Campaign Performance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor all stages of your campaigns across branches and weeks</p>
        </div>

        <div className="flex gap-6">
          {/* Update the FilterSidebar props to include dateRanges: */}
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            campaigns={uniqueCampaigns}
            weeks={uniqueWeeks}
            branches={uniqueBranches}
            dateRanges={dateRanges}
          />

          <div className="flex-1">
            <KPIMetricsComponent metrics={kpiMetrics} />
            <WATrendChart data={filteredData} />
            <CampaignTable data={filteredData} />
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Campaign Dashboard | Last updated: {new Date().toLocaleString("id-ID")}
        </div>
      </div>
    </div>
  )
}
