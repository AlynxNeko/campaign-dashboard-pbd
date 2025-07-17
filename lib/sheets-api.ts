import type { CampaignData } from "./types"

const GOOGLE_SHEETS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY
const SPREADSHEET_ID = process.env.NEXT_PUBLIC_SPREADSHEET_ID

export async function fetchSheetsData(range = "2025!A:Z") {
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

function parseRupiah(rpString: string): number {
  if (!rpString || typeof rpString !== "string") return 0;
  return Number(
    rpString
      .replace(/[^0-9,-]+/g, "") // remove Rp, dots
      .replace(",", ".") // convert comma to dot if decimal
  );
}

export function transformSheetsData(rawData: any[][]): CampaignData[] {
  if (!rawData || rawData.length < 2) return [];

  const [headers, ...rows] = rawData;

  return rows
    .filter((row) => {
      const campaign = row[0]?.toString().trim();
      return campaign && campaign !== "Results / Month" && campaign !== "CAMPAIGN NAME";
    })
    .map((row) => {
      const wamasuk = Number.parseInt(row[11]) || 0;
      const reservasi = Number.parseInt(row[15]) || 0;
      const checkIn = Number.parseInt(row[17]) || 0;
      const budgetMingguan = parseRupiah(row[24]);
      const budgetBulanan = parseRupiah(row[25]);

      const cpl = wamasuk !== 0 ? budgetMingguan / wamasuk : 0;
      const cac = reservasi !== 0 ? budgetMingguan / reservasi : 0;
      const resRate = wamasuk !== 0 ? (reservasi / wamasuk) * 100 : 0;
      const conRate = reservasi !== 0 ? (checkIn / reservasi) * 100 : 0;

      return {
        campaign: row[0] || "",
        cabang: row[1] || "",
        week: row[2] || "",
        date: row[3] || "",
        content: Number.parseInt(row[4]) || 0,
        ctr: Number.parseFloat(row[5]) || 0,
        cpl,
        wamasuk,
        reservasi,
        resRate,
        conRate,
        cac,
        checkIn,
        targetCAC: Number.parseFloat(row[23]) || 0,
        budgetMingguan: row[24] || "",
        budgetBulanan: row[25] || "",
      };
    });
}
