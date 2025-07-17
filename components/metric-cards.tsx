import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { MetricCard } from "@/lib/types"

interface MetricCardsProps {
  metrics: MetricCard[]
}

export function MetricCards({ metrics }: MetricCardsProps) {
  const formatNumber = (value: number, unit?: string) => {
    if (unit === "Rp") {
      return `Rp ${value.toLocaleString("id-ID")}`
    }
    if (unit === "%") {
      return `${value.toLocaleString("id-ID", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`
    }
    return value.toLocaleString("id-ID")
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{metric.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-xs text-muted-foreground">Actual</div>
                <div className="text-2xl font-bold">{formatNumber(metric.actual, metric.unit)}</div>
              </div>
              {metric.target !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">Target</div>
                  <div className="text-lg">{formatNumber(metric.target, metric.unit)}</div>
                </div>
              )}
              {metric.achievement !== undefined && (
                <div>
                  <div className="text-xs text-muted-foreground">Achievement</div>
                  <div className="text-lg font-semibold">{metric.achievement.toFixed(1).replace(".", ",")}%</div>
                </div>
              )}
              {metric.change !== undefined && (
                <div className="flex items-center gap-2">
                  {metric.change >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <Badge variant={metric.change >= 0 ? "default" : "destructive"}>
                    {metric.change >= 0 ? "+" : ""}
                    {metric.change.toFixed(1).replace(".", ",")}% vs target
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
