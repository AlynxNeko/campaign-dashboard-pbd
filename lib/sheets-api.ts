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

  // Map header names to column index

  let lastCampaign = "";
  let lastCabang = "";

  return rows
    .filter((row) => {
      const date =
        row[3]; // fallback index if header messed up
      return date && date.toString().trim() !== "" && date !== "Results / Month";
    })
    .map((row) => {
      // Carry down campaign & cabang
      lastCampaign =
        row[0]?.toString().trim() ||
        lastCampaign;
      lastCabang =
        row[1]?.toString().trim() ||
        lastCabang;

      const wamasuk =
        Number.parseInt(row[15] || "0");
      const reservasi =
        Number.parseInt(row[21] || "0");
      const checkIn =
        Number.parseInt(row[23] || "0");
      const budgetMingguan =
        parseRupiah(row[30] || "0");

      const cac = reservasi !== 0 ? budgetMingguan / reservasi : 0;
      const resRate = wamasuk !== 0 ? (reservasi / wamasuk) * 100 : 0;
      const conRate = reservasi !== 0 ? (checkIn / reservasi) * 100 : 0;

      return {
        campaign: lastCampaign,
        cabang: lastCabang,
        week: row[2] || "",
        date: row[3] || "",
        content:
          Number.parseInt(
            row[4] || "0"
          ),
        ctr: Number.parseFloat(
          row[5] || "0"
        ),
        cost: Number.parseFloat(row[9] || "0"),
        reach: Number.parseInt(row[10] || "0"),
        impressions: Number.parseInt(row[11] || "0"),
        cpm: Number.parseFloat(row[12] || "0"),
        click: Number.parseInt(row[13] || "0"),
        cpc: Number.parseFloat(row[14] || "0"),
        wamasuk,
        cpr: Number.parseFloat(row[16] || "0"),
        ctr2: Number.parseFloat(row[17] || "0"),
        reservasi,
        resRate,
        conRate,
        cac,
        checkIn,
        targetCAC: Number.parseFloat(
          row[23] || "0"
        ),
        budgetMingguan: row[30] || "",
        budgetBulanan: row[31] || "",
        reg: Number.parseInt(row[32] || "0"),
        sen: Number.parseInt(row[34] || "0"),
        omz: Number.parseFloat(row[36] || "0")
      };
    });
}
