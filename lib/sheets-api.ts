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
  const headerIndex: Record<string, number> = {};
  headers.forEach((h, idx) => {
    if (h) headerIndex[h.toString().trim()] = idx;
  });

  let lastCampaign = "";
  let lastCabang = "";

  return rows
    .filter((row) => {
      const date =
        row[headerIndex["DATE"]] ||
        row[3]; // fallback index if header messed up
      return date && date.toString().trim() !== "" && date !== "Results / Month" && date !== "DATE";
    })
    .map((row) => {
      // Carry down campaign & cabang
      lastCampaign =
        row[headerIndex["CAMPAIGN NAME"]]?.toString().trim() ||
        row[0]?.toString().trim() ||
        lastCampaign;
      lastCabang =
        row[headerIndex["CABANG"]]?.toString().trim() ||
        row[1]?.toString().trim() ||
        lastCabang;

      const wamasuk =
        Number.parseInt(row[headerIndex["WA MASUK / RESULT"]] || row[15] || "0");
      const reservasi =
        Number.parseInt(row[headerIndex["JUMLAH RESERVASI"]] || row[21] || "0");
      const checkIn =
        Number.parseInt(row[headerIndex["JUMLAH CHECK-IN"]] || row[23] || "0");
      const budgetMingguan =
        parseRupiah(row[headerIndex["Budget / Week"]] || row[30] || "0");

      const cac = reservasi !== 0 ? budgetMingguan / reservasi : 0;
      const resRate = wamasuk !== 0 ? (reservasi / wamasuk) * 100 : 0;
      const conRate = reservasi !== 0 ? (checkIn / reservasi) * 100 : 0;

      return {
        campaign: lastCampaign,
        cabang: lastCabang,
        week: row[headerIndex["WEEK"]] || row[2] || "",
        date: row[headerIndex["DATE"]] || row[3] || "",
        content:
          Number.parseInt(
            row[headerIndex["Output Konten Ads Baru / Minggu"]] || row[4] || "0"
          ),
        ctr: Number.parseFloat(
          row[headerIndex["Click Through Rate (CTR)"]] || row[5] || "0"
        ),
        cost: Number.parseFloat(row[headerIndex["Cost"]] || row[9] || "0"),
        reach: Number.parseInt(row[headerIndex["Reach"]] || row[10] || "0"),
        impressions: Number.parseInt(
          row[headerIndex["Impressions"]] || row[11] || "0"
        ),
        cpm: Number.parseFloat(row[headerIndex["CPM"]] || row[12] || "0"),
        click: Number.parseInt(row[headerIndex["Link Clicks"]] || row[13] || "0"),
        cpc: Number.parseFloat(row[headerIndex["CPC"]] || row[14] || "0"),
        wamasuk,
        cpr: Number.parseFloat(row[headerIndex["CPR"]] || row[16] || "0"),
        ctr2: Number.parseFloat(row[headerIndex["CTR"]] || row[17] || "0"),
        reservasi,
        resRate,
        conRate,
        cac,
        checkIn,
        targetCAC: Number.parseFloat(
          row[headerIndex["Ideal CAC"]] || row[23] || "0"
        ),
        budgetMingguan: row[headerIndex["Budget / Week"]] || row[30] || "",
        budgetBulanan: row[headerIndex["Budget Bulanan"]] || row[31] || "",
        reg: Number.parseInt(row[headerIndex["Regular Count"]] || row[32] || "0"),
        sen: Number.parseInt(row[headerIndex["Senior Count"]] || row[34] || "0"),
        omz: Number.parseFloat(row[headerIndex["Omzet"]] || row[36] || "0")
      };
    });
}
