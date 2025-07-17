export interface CampaignData {
  campaign: string
  cabang: string
  week: string
  date: string
  content: number
  ctr: number
  cpl: number
  wamasuk: number
  reservasi: number
  resRate: number
  conRate: number
  cac: number
  checkIn: number
  budgetBulanan?: string
  budgetMingguan?: string
  targetCAC?: string
}

export interface TargetData {
  wamasuk: number
  reservasi: number
  checkin: number
  content: number
}

export interface MetricCard {
  title: string
  actual: number
  target?: number // Made optional
  achievement?: number // Made optional
  change?: number // Made optional
  unit?: string
}

export interface Filters {
  campaign: string[]
  week: string[]
  cabang: string[]
  dateRange: string[]
}
