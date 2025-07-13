export interface CampaignData {
  campaign: string
  cabang: string
  week: string
  date: string
  content: number
  wamasuk: number
  reservasi: number
  resRate: number
}

export interface KPIMetrics {
  contentProduction: number
  contentTarget: number
  waMasuk: number
  waMasukTarget: number
  totalReservasi: number
  reservasiTarget: number
}

export interface FilterState {
  campaign: string
  week: string
  cabang: string[]
  dateRange: string[]
}
