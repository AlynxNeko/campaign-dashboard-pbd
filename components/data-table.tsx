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

  const filteredData = data.filter(
    (item) =>
      item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cabang.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportToCSV = () => {
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
          row.ctr2,
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
          <table className="w-full border-collapse text-sm">
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
                  <td className="p-2">{row.campaign}</td>
                  <td className="p-2">{row.week}</td>
                  <td className="p-2">{row.cabang}</td>
                  <td className="p-2">{row.date}</td>
                  <td className="p-2">{row.content.toLocaleString("id-ID")}</td>
                  <td className="p-2">{row.wamasuk.toLocaleString("id-ID")}</td>
                  <td className="p-2">{row.reservasi.toLocaleString("id-ID")}</td>
                  <td className="p-2">{row.checkIn.toLocaleString("id-ID")}</td>
                  <td className="p-2">{row.resRate.toFixed(1).replace(".", ",")}%</td>
                  <td className="p-2">{row.conRate.toFixed(1).replace(".", ",")}%</td>
                  <td className="p-2">{row.cac.toLocaleString("id-ID")}</td>
                  <td className="p-2">{row.budgetBulanan}</td>
                  <td className="p-2">{row.budgetMingguan}</td>
                  <td className="p-2">{row.targetCAC}</td>
                  <td className="p-2">{row.reach}</td>
                  <td className="p-2">{row.impressions}</td>
                  <td className="p-2">{row.cpm}</td>
                  <td className="p-2">{row.click}</td>
                  <td className="p-2">{row.cpc}</td>
                  <td className="p-2">{row.cpr}</td>
                  <td className="p-2">{row.ctr2}</td>
                  <td className="p-2">{row.reg}</td>
                  <td className="p-2">{row.sen}</td>
                  <td className="p-2">{row.omz}</td>
                  <td className="p-2">{row.cost}</td>
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
