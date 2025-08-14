"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Download, Search } from "lucide-react"
import type { CampaignData } from "@/lib/types"

interface DataTableProps {
  data: CampaignData[]
}

export function DataTable({ data }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Headers for table and CSV
  const headers = [
    "Campaign",
    "Week",
    "Cabang",
    "Date Range",
    "Content",
    "WA Masuk",
    "Reservasi",
    "Check-In",
    "Res Rate%",
    "Con Rate%",
    "CAC",
    "Budget Bulanan",
    "Budget Mingguan",
    "Target CAC",
    "Reach",
    "Impressions",
    "CPM",
    "Clicks",
    "CPC",
    "CPR",
    "CTR2",
    "Regular Count",
    "Senior Count",
    "Omzet",
    "Cost",
  ]

  const filteredData = data
    .slice(1) // Skip the first row (assumed header)
    .filter(
      (item) =>
        item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cabang.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const exportToCSV = () => {
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.campaign,
          row.week,
          row.cabang,
          row.date,
          row.content,
          row.wamasuk,
          row.reservasi,
          row.checkIn,
          row.resRate.toFixed(1).replace(".", ",") + "%",
          row.conRate.toFixed(1).replace(".", ",") + "%",
          row.cac.toLocaleString("id-ID"),
          row.budgetBulanan || "",
          row.budgetMingguan || "",
          row.targetCAC || "",
          row.reach,
          row.impressions,
          row.cpm,
          row.click,
          row.cpc,
          row.cpr,
          typeof row.ctr2 === "number" ? row.ctr2.toFixed(1).replace(".", ",") + "%" : row.ctr2, 
          row.reg,
          row.sen,
          row.omz,
          row.cost,
        ].join(",")
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "campaign-data.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Detailed Data Table</CardTitle>
            <CardDescription>
              Campaign Dashboard - Last updated: {new Date().toLocaleString("id-ID")}
            </CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                {headers.map((header) => (
                  <th key={header} className="text-left p-2 font-medium">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index} className="border-b hover:bg-muted/50">
                  {headers.map((header) => {
                    let value: any = ""
                    switch (header) {
                      case "Campaign":
                        value = row.campaign
                        break
                      case "Week":
                        value = row.week
                        break
                      case "Cabang":
                        value = row.cabang
                        break
                      case "Date Range":
                        value = row.date
                        break
                      case "Content":
                        value = row.content.toLocaleString("id-ID")
                        break
                      case "WA Masuk":
                        value = row.wamasuk.toLocaleString("id-ID")
                        break
                      case "Reservasi":
                        value = row.reservasi.toLocaleString("id-ID")
                        break
                      case "Check-In":
                        value = row.checkIn.toLocaleString("id-ID")
                        break
                      case "Res Rate%":
                        value = row.resRate.toFixed(1).replace(".", ",") + "%"
                        break
                      case "Con Rate%":
                        value = row.conRate.toFixed(1).replace(".", ",") + "%"
                        break
                      case "CAC":
                        value = row.cac.toLocaleString("id-ID")
                        break
                      case "Budget Bulanan":
                        value = row.budgetBulanan || ""
                        break
                      case "Budget Mingguan":
                        value = row.budgetMingguan || ""
                        break
                      case "Target CAC":
                        value = row.targetCAC || ""
                        break
                      case "Reach":
                        value = row.reach.toLocaleString("id-ID")
                        break
                      case "Impressions":
                        value = row.impressions.toLocaleString("id-ID")
                        break
                      case "CPM":
                        value = row.cpm
                        break
                      case "Clicks":
                        value = row.click
                        break
                      case "CPC":
                        value = row.cpc
                        break
                      case "CPR":
                        value = row.cpr
                        break
                      case "CTR2":
                        value = row.ctr2
                        break
                      case "Regular Count":
                        value = row.reg
                        break
                      case "Senior Count":
                        value = row.sen
                        break
                      case "Omzet":
                        value = row.omz.toLocaleString("id-ID")
                        break
                      case "Cost":
                        value = row.cost.toLocaleString("id-ID")
                        break
                    }
                    return (
                      <td key={header} className="p-2">
                        {value}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          Page 1 of 1 - Showing {filteredData.length} of {data.length} entries
        </div>
      </CardContent>
    </Card>
  )
}
