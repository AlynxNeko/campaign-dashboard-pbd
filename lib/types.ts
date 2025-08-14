export interface CampaignData {
  campaign: string;
  cabang: string;
  week: string;
  date: string;
  content: number;
  ctr: number;
  cost: number;
  reach: number;
  impressions: number;
  cpm: number;
  click: number;
  cpc: number;
  wamasuk: number;
  cpr: number;
  ctr2: number;
  reservasi: number;
  resRate: number;
  conRate: number;
  cac: number;
  checkIn: number;
  targetCAC?: number;
  budgetMingguan?: string;
  budgetBulanan?: string;
  reg?: number;
  sen?: number;
  omz?: number;
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
