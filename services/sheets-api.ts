import type { CampaignData } from "./types" // Assuming CampaignData is declared in a types file

const GOOGLE_SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID

export async function fetchSheetsData(range = "2025!A:R") {
  if (!GOOGLE_SHEETS_API_KEY || !SPREADSHEET_ID) {
    throw new Error("Missing Google Sheets API configuration")
  }

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return data.values || []
  } catch (error) {
    console.error("Error fetching sheets data:", error)
    throw error
  }
}

export function transformSheetsData(rawData: any[][]): CampaignData[] {
  if (!rawData || rawData.length < 2) return []

  const [headers, ...rows] = rawData

  return rows
    .filter((row) => {
      const campaign = row[0]?.trim()
      return (
        campaign &&
        campaign !== "Results / Month" &&
        campaign !== "CAMPAIGN NAME"
      )
    })
    .map((row) => ({
      campaign: row[0] || "",
      cabang: row[1] || "",
      week: row[2] || "",
      date: row[3] || "",
      content: parseInt(row[4]) || 0,
      wamasuk: parseInt(row[8]) || 0,
      reservasi: parseInt(row[12]) || 0,
      resRate: parseInt(row[12]) / parseInt(row[8]) * 100 || 0,
    }))
}
