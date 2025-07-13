"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { FilterState } from "../types/dashboard"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  campaigns: string[]
  weeks: string[]
  branches: string[]
  dateRanges: string[]
}

export function FilterSidebar({
  filters,
  onFiltersChange,
  campaigns,
  weeks,
  branches,
  dateRanges,
}: FilterSidebarProps) {
  const handleCabangChange = (cabang: string, checked: boolean) => {
    const newCabang = checked ? [...filters.cabang, cabang] : filters.cabang.filter((c) => c !== cabang)

    onFiltersChange({
      ...filters,
      cabang: newCabang,
    })
  }

  return (
    <Card className="w-80 h-fit">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Campaign Filter */}
        <div className="space-y-2">
          <Label htmlFor="campaign">Campaign</Label>
          <Select value={filters.campaign} onValueChange={(value) => onFiltersChange({ ...filters, campaign: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Week Filter */}
        <div className="space-y-2">
          <Label htmlFor="week">Week</Label>
          <Select value={filters.week} onValueChange={(value) => onFiltersChange({ ...filters, week: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {weeks.map((week) => (
                <SelectItem key={week} value={week}>
                  {week}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cabang Filter */}
        <div className="space-y-2">
          <Label>Cabang</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.cabang.length > 0
                  ? `${filters.cabang.length} selected`
                  : "All"}
                <span className="ml-2 text-muted-foreground">▼</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-64 overflow-auto">
              <div className="space-y-2">
                {branches.map((branch) => {
                  const checked = filters.cabang.includes(branch)
                  return (
                    <div key={branch} className="flex items-center space-x-2">
                      <Checkbox
                        id={`branch-${branch}`}
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          const newCabang = isChecked
                            ? [...filters.cabang, branch]
                            : filters.cabang.filter((b) => b !== branch)

                          onFiltersChange({
                            ...filters,
                            cabang: newCabang,
                          })
                        }}
                      />
                      <Label htmlFor={`branch-${branch}`} className="text-sm font-normal">
                        {branch}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Multi-Select */}
        <div className="space-y-2">
          <Label>Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {filters.dateRange.length > 0
                  ? `${filters.dateRange.length} selected`
                  : "All"}
                <span className="ml-2 text-muted-foreground">▼</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 max-h-64 overflow-auto">
              <div className="space-y-2">
                {dateRanges.map((range) => {
                  const checked = filters.dateRange.includes(range)
                  return (
                    <div key={range} className="flex items-center space-x-2">
                      <Checkbox
                        id={`range-${range}`}
                        checked={checked}
                        onCheckedChange={(isChecked) => {
                          const newDateRange = isChecked
                            ? [...filters.dateRange, range]
                            : filters.dateRange.filter((r) => r !== range)

                          onFiltersChange({
                            ...filters,
                            dateRange: newDateRange,
                          })
                        }}
                      />
                      <Label htmlFor={`range-${range}`} className="text-sm font-normal">
                        {range}
                      </Label>
                    </div>
                  )
                })}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  )
}
