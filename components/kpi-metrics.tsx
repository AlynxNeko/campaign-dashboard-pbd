"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { KPIMetrics } from "../types/dashboard"

interface KPIMetricsProps {
  metrics: KPIMetrics
}

export function KPIMetricsComponent({ metrics }: KPIMetricsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("id-ID").format(num)
  }

  const getPercentage = (current: number, target: number) => {
    return ((current / target) * 100).toFixed(1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Content Production</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(metrics.contentProduction)}</div>
          {/*<p className="text-xs text-muted-foreground">
            {getPercentage(metrics.contentProduction, metrics.contentTarget)}% of target (
            {formatNumber(metrics.contentTarget)})
          </p>*/}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">WA Masuk (Weekly)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(metrics.waMasuk)}</div>
          {/*<p className="text-xs text-muted-foreground">
            {getPercentage(metrics.waMasuk, metrics.waMasukTarget)}% of target ({formatNumber(metrics.waMasukTarget)})
          </p>*/}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Total Reservasi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(metrics.totalReservasi)}</div>
          {/*<p className="text-xs text-muted-foreground">
            {getPercentage(metrics.totalReservasi, metrics.reservasiTarget)}% of target (
            {formatNumber(metrics.reservasiTarget)})
          </p>*/}
        </CardContent>
      </Card>
    </div>
  )
}
