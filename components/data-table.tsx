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
      item.cabang.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const exportToCSV = () => {
    const headers = [
      "Campaign",
      "Week",
      "Cabang",
      "Date Range",
      "Content",
      "WA",
      "Res Rate%",
      "Budget Bulanan",
      "Budget Mingguan",
      "Target CAC per Reservasi",
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
          row.resRate.toFixed(0).replace(".", ",") + "%",
          row.budgetBulanan || "",
          row.budgetMingguan || "",
          row.targetCAC || "",
        ].join(","),
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
            <CardDescription>Campaign Dashboard - Last updated: {new Date().toLocaleString("id-ID")}</CardDescription>
          </div>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download CSV
          </Button>
        </div>
        <div className="relative">
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
                <th className="text-left p-2 font-medium">Campaign</th>
                <th className="text-left p-2 font-medium">Week</th>
                <th className="text-left p-2 font-medium">Cabang</th>
                <th className="text-left p-2 font-medium">Date Range</th>
                <th className="text-left p-2 font-medium">Content</th>
                <th className="text-left p-2 font-medium">WA</th>
                <th className="text-left p-2 font-medium">Res Rate%</th>
                <th className="text-left p-2 font-medium">Budget Bulanan</th>
                <th className="text-left p-2 font-medium">Budget Mingguan</th>
                <th className="text-left p-2 font-medium">Target CAC per Reservasi</th>
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
                  <td className="p-2">{row.resRate.toFixed(0).replace(".", ",")}%</td>
                  <td className="p-2">{row.budgetBulanan}</td>
                  <td className="p-2">{row.budgetMingguan}</td>
                  <td className="p-2">{row.targetCAC}</td>
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
