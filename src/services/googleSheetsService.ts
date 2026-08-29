import { MonthDataset, RegionData, ServiceData, MONTHLY_DATA } from '../data/revenueData';

export interface DailyRecord {
  date: string;          // e.g. '1/3/26'
  dayNum: number;        // e.g. 1
  monthNum: number;      // e.g. 3
  yearNum: number;       // e.g. 2026
  region: string;        // e.g. 'Bình Dương'
  service: string;       // e.g. 'IMP', 'NIỀNG', 'SỨ', 'TQ', 'Việt Kiều'
  totalBudget: number;
  budgetVnd: number;
  costVat?: number;
  leadTho: number;
  leadChatLuong: number;
  cpl: number;
}

export interface SheetFetchResult {
  monthlyData: MonthDataset[];
  dailyData: DailyRecord[];
  lastUpdated: Date;
  isLive: boolean;
  sourceUrl: string;
}

export const DEFAULT_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1P5TRZCUnGjQEb1pg4pBhzTqOZZ3_M104v2N7C5AHx5w/edit?gid=918582651#gid=918582651';

// Helper to extract Spreadsheet ID from Google Sheet URL
export function extractSpreadsheetId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : '1P5TRZCUnGjQEb1pg4pBhzTqOZZ3_M104v2N7C5AHx5w';
}

// Parse CSV string safely respecting quoted cells
function parseCSV(csv: string): string[][] {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i++) {
    const char = csv[i];
    if (char === '"') inQuotes = !inQuotes;
    if (char === '\n' && !inQuotes) {
      lines.push(currentLine);
      currentLine = '';
    } else if (char !== '\r') {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine);

  return lines.map(l => {
    const row: string[] = [];
    let cell = '';
    let q = false;
    for (let j = 0; j < l.length; j++) {
      const c = l[j];
      if (c === '"') {
        if (q && l[j + 1] === '"') { cell += '"'; j++; }
        else { q = !q; }
      } else if (c === ',' && !q) {
        row.push(cell.trim());
        cell = '';
      } else {
        cell += c;
      }
    }
    row.push(cell.trim());
    return row;
  });
}

// Parse numbers with Vietnamese formatting (e.g. 21.147.878 or 10,98% or 200.814 đ)
function parseNumber(val: string | undefined): number {
  if (!val) return 0;
  const clean = val
    .replace(/[đ%]/gi, '')
    .replace(/\./g, '')
    .replace(/,/g, '.')
    .replace(/\s/g, '');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
}

// Parse 'Doanh Thu Theo Tháng' sheet
export function parseMonthlySheet(csvText: string): MonthDataset[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return MONTHLY_DATA;

  const monthConfigs = [
    { month: 1, label: 'Tháng 1', regionCol: 0, svcCol: 1, cpSvcCol: 2, cpTongCol: 3, vatCol: 4, revCol: 5, pctCol: 6, svcDataCol: 7, regDataCol: 8 },
    { month: 2, label: 'Tháng 2', regionCol: 9, svcCol: 10, cpSvcCol: 11, cpTongCol: 12, vatCol: 13, revCol: 14, pctCol: 15, svcDataCol: 16, regDataCol: 17 },
    { month: 3, label: 'Tháng 3', regionCol: 18, svcCol: 19, cpSvcCol: 20, cpTongCol: -1, vatCol: 21, revCol: 22, pctCol: 23, svcDataCol: 24, regDataCol: 25 },
    { month: 4, label: 'Tháng 4', regionCol: 26, svcCol: 27, cpSvcCol: 28, cpTongCol: -1, vatCol: 29, revCol: 30, pctCol: 31, svcDataCol: 32, regDataCol: 33 },
    { month: 5, label: 'Tháng 5', regionCol: 34, svcCol: 35, cpSvcCol: 36, cpTongCol: -1, vatCol: 37, revCol: 38, pctCol: 39, svcDataCol: 40, regDataCol: 41 },
    { month: 6, label: 'Tháng 6', regionCol: 42, svcCol: 43, cpSvcCol: 44, cpTongCol: -1, vatCol: 45, revCol: 46, pctCol: 47, svcDataCol: 48, regDataCol: 49 },
    { month: 7, label: 'Tháng 7', regionCol: 50, svcCol: 51, cpSvcCol: 52, cpTongCol: -1, vatCol: 53, revCol: 54, pctCol: 55, svcDataCol: 56, regDataCol: 57 },
    { month: 8, label: 'Tháng 8', regionCol: 58, svcCol: 59, cpSvcCol: 60, cpTongCol: -1, vatCol: 61, revCol: 62, pctCol: 63, svcDataCol: 64, regDataCol: 65 },
    { month: 9, label: 'Tháng 9', regionCol: 66, svcCol: 67, cpSvcCol: 68, cpTongCol: -1, vatCol: 69, revCol: 70, pctCol: 71, svcDataCol: 72, regDataCol: 73 },
  ];

  const datasets: MonthDataset[] = [];

  const getCell = (row: string[], colIdx: number) =>
    colIdx >= 0 && colIdx < row.length ? row[colIdx] : '';

  monthConfigs.forEach((cfg) => {
    let currentRegion: RegionData | null = null;
    const regions: RegionData[] = [];

    const defaultSvcNames = ['Implant', 'Niềng', 'Sứ', 'TH'];

    for (let r = 1; r < rows.length; r++) {
      if (r >= 70) break; // Row 70 is the "Tổng" summary row for all months
      const row = rows[r];
      if (!row) continue;

      let regName = getCell(row, cfg.regionCol).trim();
      let svcName = getCell(row, cfg.svcCol).trim();

      const vat = parseNumber(getCell(row, cfg.vatCol));
      const rev = parseNumber(getCell(row, cfg.revCol));
      const rowDataCL = parseNumber(getCell(row, cfg.regDataCol));
      const svcCp = parseNumber(getCell(row, cfg.cpSvcCol));
      const svcDataCount = parseNumber(getCell(row, cfg.svcDataCol));

      const isHeaderOrTotal = (name: string) => {
        const lower = name.toLowerCase().trim();
        return (
          lower === 'tổng' ||
          lower.startsWith('tổng tất cả') ||
          lower.startsWith('tháng') ||
          lower.startsWith('khu vực') ||
          lower === 'dịch vụ' ||
          lower.includes('cp dịch vụ') ||
          lower.includes('doanh thu')
        );
      };

      if (isHeaderOrTotal(regName) || isHeaderOrTotal(svcName)) {
        continue;
      }

      if (!regName && currentRegion && currentRegion.services.length >= 4 && (svcDataCount > 0 || rowDataCL > 0 || vat > 0 || rev > 0)) {
        regName = 'Không Địa Chỉ';
      }

      if (regName) {
        currentRegion = {
          name: regName,
          costVAT: vat,
          revenue: rev,
          cpDichVu: 0,
          cpTong: cfg.cpTongCol >= 0 ? parseNumber(getCell(row, cfg.cpTongCol)) : vat,
          totalData: 0,
          dataChatLuong: rowDataCL || 0,
          services: [],
        };
        regions.push(currentRegion);
      }

      if (currentRegion && !svcName && (svcDataCount > 0 || rowDataCL > 0 || svcCp > 0)) {
        const idx = currentRegion.services.length % 4;
        svcName = defaultSvcNames[idx] || 'Dịch Vụ Khác';
      }

      if (currentRegion && svcName) {
        if (!currentRegion.dataChatLuong && rowDataCL) {
          currentRegion.dataChatLuong = rowDataCL;
        }
        currentRegion.services.push({
          name: normalizeServiceName(svcName),
          cp: svcCp,
          dataCount: svcDataCount,
          dataChatLuong: rowDataCL || 0,
        });
      }
    }

    // Accurately sum service CPs, Data Dịch Vụ, and Data Chất Lượng
    regions.forEach((reg) => {
      reg.cpDichVu = reg.services.reduce((acc, s) => acc + (s.cp || 0), 0);
      if (!reg.cpDichVu && reg.costVAT) reg.cpDichVu = reg.costVAT;
      if (!reg.cpTong) reg.cpTong = reg.cpDichVu;

      const totalDataDV = reg.services.reduce((acc, s) => acc + (s.dataCount || 0), 0);
      reg.totalData = totalDataDV;

      const regCL = reg.dataChatLuong || 0;
      reg.services.forEach((s) => {
        if (totalDataDV > 0 && regCL > 0) {
          s.dataChatLuong = Math.round((s.dataCount / totalDataDV) * regCL);
        } else {
          s.dataChatLuong = s.dataCount || 0;
        }
      });
    });

    if (regions.length > 0) {
      datasets.push({
        month: cfg.month,
        label: cfg.label,
        regions,
      });
    }
  });

  return datasets.length > 0 ? datasets : MONTHLY_DATA;
}

function normalizeServiceName(raw: string): string {
  if (!raw) return 'Khác';
  const s = raw.trim();
  const upper = s.toUpperCase();
  if (upper === 'IMP' || upper === 'IMPLANT') return 'Implant';
  if (upper === 'NIỀNG' || upper === 'NIENG') return 'Niềng';
  if (upper === 'SỨ' || upper === 'SU') return 'Sứ';
  if (upper === 'TH' || upper === 'TQ' || upper === 'TỔNG HỢP' || upper === 'TONG HOP') return 'TH';
  if (upper === 'VIỆT KIỀU' || upper === 'VIET KIEU' || upper === 'VK') return 'Việt Kiều';
  return s;
}

// Parse 'Data Ngày' sheet
function parseDailySheet(csvText: string): DailyRecord[] {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return [];

  // Detect header row and column mapping dynamically
  let headerRowIndex = -1;
  let colDate = -1;
  let colRegion = -1;
  let colService = -1;
  let colTotalBudget = -1;
  let colBudgetVnd = -1;
  let colCostVat = -1;
  let colLeadTho = -1;
  let colLeadCL = -1;
  let colCpl = -1;

  for (let r = 0; r < Math.min(5, rows.length); r++) {
    const row = rows[r];
    if (!row) continue;
    const rowStr = row.join(' ').toLowerCase();

    if (
      rowStr.includes('ngày') || rowStr.includes('dịch vụ') || rowStr.includes('lead') ||
      rowStr.includes('chi phí') || rowStr.includes('miền') || rowStr.includes('khu vực')
    ) {
      headerRowIndex = r;
      row.forEach((cell, idx) => {
        const c = cell.toLowerCase().trim();
        if (c.includes('ngày') || c === 'date') {
          colDate = idx;
        } else if (c.includes('miền') || c.includes('khu vực') || c.includes('chi nhánh') || c === 'region') {
          colRegion = idx;
        } else if (c.includes('dịch vụ') || c === 'service') {
          colService = idx;
        } else if (c.includes('vat') || c.includes('chi phí (vat)') || c.includes('chi phí vat')) {
          colCostVat = idx;
        } else if (c.includes('cpl')) {
          if (colCpl === -1) colCpl = idx;
        } else if (c.includes('thô') || c.includes('lead thô') || c.includes('data thô')) {
          colLeadTho = idx;
        } else if (c.includes('chất lượng') || c.includes('lead cl') || c.includes('data cl') || c === 'cl' || c.endsWith(' cl')) {
          colLeadCL = idx;
        } else if (c.includes('chi phí') || c.includes('ngân sách') || c.includes('budget')) {
          if (c.includes('$') || c.includes('usd')) {
            colTotalBudget = idx;
          } else {
            if (colBudgetVnd === -1) colBudgetVnd = idx;
          }
        }
      });
      break;
    }
  }

  // Fallback defaults if header search yielded incomplete results
  if (colDate === -1) colDate = 0;
  if (colRegion === -1) colRegion = 1;
  if (colService === -1) colService = 2;
  if (colTotalBudget === -1) colTotalBudget = 3;

  if (colBudgetVnd === -1) colBudgetVnd = 4;
  if (colCostVat === -1 && colBudgetVnd !== -1 && rows[headerRowIndex]?.[colBudgetVnd + 1]?.toLowerCase().includes('vat')) {
    colCostVat = colBudgetVnd + 1;
  }

  if (colLeadTho === -1) {
    if (colCostVat !== -1 && colCostVat >= 4) {
      colLeadTho = colCostVat + 1;
    } else {
      colLeadTho = 5;
    }
  }

  if (colLeadCL === -1) {
    colLeadCL = colLeadTho + 1;
  }

  if (colCpl === -1) {
    colCpl = colLeadCL + 1;
  }

  const startIndex = headerRowIndex !== -1 ? headerRowIndex + 1 : 1;
  const records: DailyRecord[] = [];
  let lastDate = '';
  let lastRegion = '';

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 3) continue;

    const dateCell = row[colDate] || '';
    const regionCell = row[colRegion] || '';
    const serviceCell = row[colService] || '';

    if (dateCell && dateCell.trim()) {
      lastDate = dateCell.trim();
    }
    if (regionCell && regionCell.trim()) {
      lastRegion = regionCell.trim();
    }

    if (!lastDate || !serviceCell || !serviceCell.trim()) continue;

    const dateParts = lastDate.split('/');
    if (dateParts.length < 2) continue;

    const dayNum = parseInt(dateParts[0], 10);
    const monthNum = parseInt(dateParts[1], 10);
    const yearSuffix = dateParts[2] ? parseInt(dateParts[2], 10) : 26;
    const yearNum = yearSuffix < 100 ? 2000 + yearSuffix : yearSuffix;

    if (isNaN(dayNum) || isNaN(monthNum)) continue;

    const leadTho = parseNumber(row[colLeadTho]);
    const leadChatLuong = parseNumber(row[colLeadCL]);

    // Use VAT column if present and has value, else fallback to budget VND column
    const vatVal = colCostVat !== -1 ? parseNumber(row[colCostVat]) : 0;
    const rawBudgetVnd = parseNumber(row[colBudgetVnd]);
    const budgetVnd = vatVal > 0 ? vatVal : rawBudgetVnd;

    records.push({
      date: lastDate,
      dayNum,
      monthNum,
      yearNum,
      region: lastRegion || 'Tổng',
      service: normalizeServiceName(serviceCell),
      totalBudget: parseNumber(row[colTotalBudget]),
      budgetVnd,
      costVat: vatVal > 0 ? vatVal : budgetVnd,
      leadTho,
      leadChatLuong,
      cpl: parseNumber(row[colCpl])
    });
  }

  return records;
}

function findMatchingDailyRegion(
  dailyRegMap: Map<string, any>,
  regionName: string
) {
  if (dailyRegMap.has(regionName)) return dailyRegMap.get(regionName);
  const targetLower = regionName.toLowerCase().trim();
  for (const [k, v] of dailyRegMap.entries()) {
    const kLower = k.toLowerCase().trim();
    if (kLower === targetLower) return v;
    if (
      (targetLower.includes('hồ chí minh') || targetLower === 'hcm') &&
      (kLower.includes('hồ chí minh') || kLower === 'hcm')
    ) return v;
    if (
      (targetLower.includes('bình dương') || targetLower === 'bd') &&
      (kLower.includes('bình dương') || kLower === 'bd')
    ) return v;
    if (
      (targetLower.includes('hà nội') || targetLower === 'hn') &&
      (kLower.includes('hà nội') || kLower === 'hn')
    ) return v;
    if (
      (targetLower.includes('cần thơ') || targetLower === 'ct') &&
      (kLower.includes('cần thơ') || kLower === 'ct')
    ) return v;
    if (
      (targetLower.includes('đà nẵng') || targetLower === 'đn') &&
      (kLower.includes('đà nẵng') || kLower === 'đn')
    ) return v;
  }
  return undefined;
}

// Merge daily records from 'Data Ngày' into monthly datasets when present
export function mergeDailyIntoMonthly(monthlyData: MonthDataset[], dailyData: DailyRecord[]): MonthDataset[] {
  if (!dailyData || dailyData.length === 0) return monthlyData;

  const dailyByMonth = new Map<
    number,
    Map<
      string,
      {
        totalData: number;
        qualityData: number;
        costVat: number;
        services: Map<string, { cp: number; dataCount: number; dataChatLuong: number }>;
      }
    >
  >();

  dailyData.forEach((rec) => {
    const m = rec.monthNum;
    if (!m) return;
    if (!dailyByMonth.has(m)) dailyByMonth.set(m, new Map());
    const regMap = dailyByMonth.get(m)!;

    const regName = rec.region || 'HCM';
    if (!regMap.has(regName)) {
      regMap.set(regName, {
        totalData: 0,
        qualityData: 0,
        costVat: 0,
        services: new Map(),
      });
    }

    const regObj = regMap.get(regName)!;
    regObj.totalData += rec.leadTho || 0;
    regObj.qualityData += rec.leadChatLuong || 0;
    regObj.costVat += rec.budgetVnd || 0;

    const svcName = rec.service || 'Khác';
    if (!regObj.services.has(svcName)) {
      regObj.services.set(svcName, { cp: 0, dataCount: 0, dataChatLuong: 0 });
    }
    const svcObj = regObj.services.get(svcName)!;
    svcObj.cp += rec.budgetVnd || 0;
    svcObj.dataCount += rec.leadTho || 0;
    svcObj.dataChatLuong += rec.leadChatLuong || 0;
  });

  return monthlyData.map((mDataset) => {
    const mNum = mDataset.month;
    const dailyRegMap = dailyByMonth.get(mNum);
    if (!dailyRegMap) return mDataset;

    const updatedRegions = mDataset.regions.map((reg) => {
      const dReg = findMatchingDailyRegion(dailyRegMap, reg.name);
      if (!dReg) return reg;

      const totalData = dReg.totalData > 0 ? dReg.totalData : reg.totalData;
      const dataChatLuong = dReg.qualityData > 0 ? dReg.qualityData : reg.dataChatLuong;

      const updatedServices = reg.services.map((svc) => {
        const dSvc = dReg.services.get(svc.name);
        if (!dSvc) return svc;
        return {
          ...svc,
          dataCount: dSvc.dataCount > 0 ? dSvc.dataCount : svc.dataCount,
          dataChatLuong: dSvc.dataChatLuong > 0 ? dSvc.dataChatLuong : (svc as any).dataChatLuong,
          cp: dSvc.cp > 0 ? dSvc.cp : svc.cp,
        };
      });

      return {
        ...reg,
        totalData,
        dataChatLuong,
        services: updatedServices,
      };
    });

    return {
      ...mDataset,
      regions: updatedRegions,
    };
  });
}

// Fetch live Google Sheet data
export async function fetchGoogleSheetData(sheetUrl: string = DEFAULT_SHEET_URL): Promise<SheetFetchResult> {
  const spreadsheetId = extractSpreadsheetId(sheetUrl);
  const cacheBust = Date.now();

  // Multiple fallback endpoints with cache-busting to prevent browser caching stale CSVs
  const monthCsvUrls = [
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=918582651&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Doanh Thu Theo Tháng')}&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=918582651&_t=${cacheBust}`
  ];

  const dailyCsvUrls = [
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent('Data Ngày')}&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&sheet=${encodeURIComponent('Data Ngày')}&_t=${cacheBust}`
  ];

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    }
  };

  let monthText = '';
  for (const url of monthCsvUrls) {
    try {
      const res = await fetch(url, fetchOptions);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('<!DOCTYPE html>') && !text.includes('Error') && text.length > 50) {
          monthText = text;
          break;
        }
      }
    } catch {
      // try next fallback URL
    }
  }

  let dailyText = '';
  for (const url of dailyCsvUrls) {
    try {
      const res = await fetch(url, fetchOptions);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('<!DOCTYPE html>') && !text.includes('Error') && text.length > 50) {
          dailyText = text;
          break;
        }
      }
    } catch {
      // try next fallback URL
    }
  }

  try {
    let monthlyData = MONTHLY_DATA;
    let dailyData: DailyRecord[] = [];
    let isLive = false;

    if (monthText) {
      const parsed = parseMonthlySheet(monthText);
      if (parsed && parsed.length > 0) {
        monthlyData = parsed;
        isLive = true;
      }
    }

    if (dailyText) {
      dailyData = parseDailySheet(dailyText);
    }

    return {
      monthlyData,
      dailyData,
      lastUpdated: new Date(),
      isLive,
      sourceUrl: sheetUrl,
    };
  } catch (error) {
    console.error('Failed to parse live Google Sheet data:', error);
    return {
      monthlyData: MONTHLY_DATA,
      dailyData: [],
      lastUpdated: new Date(),
      isLive: false,
      sourceUrl: sheetUrl,
    };
  }
}
