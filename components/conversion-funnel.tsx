import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

interface FunnelData {
  wamasuk: number
  reservasi: number
  checkin: number
}

interface ConversionFunnelProps {
  data: FunnelData
}

export function ConversionFunnel({ data }: ConversionFunnelProps) {
  const waToRes = (data.reservasi / data.wamasuk) * 100
  const resToCheckin = (data.checkin / data.reservasi) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Journey Funnel</CardTitle>
        <CardDescription>Track conversion from WA inquiries to successful check-ins</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          {/* WA Masuk */}
          <div className="flex-1 p-6 bg-blue-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{data.wamasuk.toLocaleString()}</div>
            <div className="text-sm text-blue-600 mb-2">(100%)</div>
            <div className="font-semibold text-blue-900">WA Masuk</div>
            <div className="text-xs text-blue-700 mt-1">Total WhatsApp inquiries received</div>
          </div>

          {/* Arrow and conversion rate */}
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <Badge variant={waToRes >= 30 ? "default" : "destructive"}>{waToRes.toFixed(0)}%</Badge>
          </div>

          {/* Reservasi */}
          <div className="flex-1 p-6 bg-green-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{data.reservasi.toLocaleString()}</div>
            <div className="text-sm text-green-600 mb-2">({waToRes.toFixed(0)}%)</div>
            <div className="font-semibold text-green-900">Reservasi</div>
            <div className="text-xs text-green-700 mt-1">Converted to reservations</div>
          </div>

          {/* Arrow and conversion rate */}
          <div className="flex flex-col items-center gap-2">
            <ArrowRight className="h-6 w-6 text-muted-foreground" />
            <Badge variant={resToCheckin >= 75 ? "default" : "destructive"}>{resToCheckin.toFixed(0)}%</Badge>
          </div>

          {/* Check-in */}
          <div className="flex-1 p-6 bg-purple-50 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">{data.checkin.toLocaleString()}</div>
            <div className="text-sm text-purple-600 mb-2">({((data.checkin / data.wamasuk) * 100).toFixed(0)}%)</div>
            <div className="font-semibold text-purple-900">Check-in</div>
            <div className="text-xs text-purple-700 mt-1">Successfully checked in</div>
          </div>
        </div>

        {/* Conversion insights */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium">WA → Reservasi</div>
            <div className="text-2xl font-bold">{waToRes.toFixed(0)}%</div>
            <div className={`text-sm ${waToRes >= 30 ? "text-green-600" : "text-red-600"}`}>
              {waToRes >= 30 ? "Performing Well" : "Bottleneck Identified"}
            </div>
            <div className="text-xs text-muted-foreground">
              {waToRes >= 30 ? "Above target (30%)" : "Below target (30%)"}
            </div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="text-sm font-medium">Reservasi → Check-in</div>
            <div className="text-2xl font-bold">{resToCheckin.toFixed(0)}%</div>
            <div className={`text-sm ${resToCheckin >= 75 ? "text-green-600" : "text-red-600"}`}>
              {resToCheckin >= 75 ? "Performing Well" : "Needs Improvement"}
            </div>
            <div className="text-xs text-muted-foreground">
              {resToCheckin >= 75 ? "Above target (75%)" : "Below target (75%)"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
