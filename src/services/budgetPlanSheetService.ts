// Service kết nối và đồng bộ trực tiếp File Google Sheets "Ngân Sách Dự Kiến"
// URL mặc định: https://docs.google.com/spreadsheets/d/1cUszmTk5RJLPZxkEyrs4uLm_0_yzc3NRjXPIKhA6FUs/edit?gid=0#gid=0

export interface BranchPlanItem {
  id: string;
  name: string;
  dailyBudget: number;         // Ngân sách ngày
  monthlyBudget: number;       // Ngân sách tháng (gốc)
  monthlyBudgetVat: number;    // Ngân sách tháng có VAT
  reduced30Budget: number;     // Giảm 30%
  reduced30Vat: number;        // Giảm 30% có VAT
  reducedExtra30Budget: number;// Giảm thêm 30%
  reducedExtra30Vat: number;   // Giảm thêm 30% có VAT
  spentThisMonth?: number;     // Số tiền thực tế đã chi tiêu (đối soát)
}

export interface BudgetPlanSummary {
  title: string;
  totalDaily: number;
  totalMonthly: number;
  totalMonthlyVat: number;
  totalReduced30: number;
  totalReduced30Vat: number;
  totalReducedExtra30: number;
  totalReducedExtra30Vat: number;
  items: BranchPlanItem[];
  lastUpdated: string;
  isLive: boolean;
  sourceUrl: string;
}

export const DEFAULT_BUDGET_PLAN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1cUszmTk5RJLPZxkEyrs4uLm_0_yzc3NRjXPIKhA6FUs/edit?gid=0#gid=0';

export const FALLBACK_BUDGET_PLAN_ITEMS: BranchPlanItem[] = [
  {
    id: 'ct',
    name: 'Cần Thơ 1 + 2+TN',
    dailyBudget: 1800000,
    monthlyBudget: 54000000,
    monthlyBudgetVat: 62985600,
    reduced30Budget: 44089920,
    reduced30Vat: 51426483,
    reducedExtra30Budget: 30862944,
    reducedExtra30Vat: 35998538,
    spentThisMonth: 37356522,
  },
  {
    id: 'cm',
    name: 'Cà Mau',
    dailyBudget: 700000,
    monthlyBudget: 21000000,
    monthlyBudgetVat: 24494400,
    reduced30Budget: 17146080,
    reduced30Vat: 19999188,
    reducedExtra30Budget: 12002256,
    reducedExtra30Vat: 13999431,
    spentThisMonth: 15848719,
  },
  {
    id: 'dt',
    name: 'Đồng Tháp',
    dailyBudget: 200000,
    monthlyBudget: 6000000,
    monthlyBudgetVat: 6998400,
    reduced30Budget: 4898880,
    reduced30Vat: 5714054,
    reducedExtra30Budget: 6000000,
    reducedExtra30Vat: 6998400,
    spentThisMonth: 18319653,
  },
  {
    id: 'bl',
    name: 'Bạc Liêu',
    dailyBudget: 200000,
    monthlyBudget: 6000000,
    monthlyBudgetVat: 6998400,
    reduced30Budget: 4898880,
    reduced30Vat: 5714054,
    reducedExtra30Budget: 6000000,
    reducedExtra30Vat: 6998400,
    spentThisMonth: 12369172,
  },
  {
    id: 'st',
    name: 'Sóc Trăng',
    dailyBudget: 200000,
    monthlyBudget: 6000000,
    monthlyBudgetVat: 6998400,
    reduced30Budget: 4898880,
    reduced30Vat: 5714054,
    reducedExtra30Budget: 6000000,
    reducedExtra30Vat: 6998400,
    spentThisMonth: 11876628,
  },
  {
    id: 'bd',
    name: 'Bình Dương',
    dailyBudget: 1400000,
    monthlyBudget: 42000000,
    monthlyBudgetVat: 48988800,
    reduced30Budget: 34292160,
    reduced30Vat: 39998375,
    reducedExtra30Budget: 34292160,
    reducedExtra30Vat: 39998375,
    spentThisMonth: 52288250,
  },
  {
    id: 'vt',
    name: 'Vũng Tàu (Phước Tỉnh + Xuyên Mộc + Bacu)',
    dailyBudget: 1200000,
    monthlyBudget: 36000000,
    monthlyBudgetVat: 41990400,
    reduced30Budget: 29393280,
    reduced30Vat: 34284322,
    reducedExtra30Budget: 20575296,
    reducedExtra30Vat: 23999025,
    spentThisMonth: 33450000,
  },
  {
    id: 'bh',
    name: 'Biên Hòa + Đại Phước',
    dailyBudget: 1500000,
    monthlyBudget: 45000000,
    monthlyBudgetVat: 52488000,
    reduced30Budget: 36741600,
    reduced30Vat: 42855402,
    reducedExtra30Budget: 25719120,
    reducedExtra30Vat: 29998782,
    spentThisMonth: 39698817,
  },
  {
    id: 'hcm',
    name: 'Hồ Chí Minh & Lân Cận',
    dailyBudget: 19000000,
    monthlyBudget: 570000000,
    monthlyBudgetVat: 664848000,
    reduced30Budget: 465393600,
    reduced30Vat: 542835095,
    reducedExtra30Budget: 325775520,
    reducedExtra30Vat: 379984567,
    spentThisMonth: 717592304,
  },
  {
    id: 'vk',
    name: 'Việt Kiều Toàn Cầu',
    dailyBudget: 4000000,
    monthlyBudget: 120000000,
    monthlyBudgetVat: 139968000,
    reduced30Budget: 97977600,
    reduced30Vat: 114281073,
    reducedExtra30Budget: 68584320,
    reducedExtra30Vat: 79996751,
    spentThisMonth: 128450000,
  },
  {
    id: 'qn',
    name: 'Quy Nhơn',
    dailyBudget: 900000,
    monthlyBudget: 27000000,
    monthlyBudgetVat: 31492800,
    reduced30Budget: 22044960,
    reduced30Vat: 25713241,
    reducedExtra30Budget: 15431472,
    reducedExtra30Vat: 17999269,
    spentThisMonth: 27795381,
  },
  {
    id: 'tn',
    name: 'Tây Ninh',
    dailyBudget: 900000,
    monthlyBudget: 27000000,
    monthlyBudgetVat: 31492800,
    reduced30Budget: 22044960,
    reduced30Vat: 25713241,
    reducedExtra30Budget: 15431472,
    reducedExtra30Vat: 17999269,
    spentThisMonth: 31151138,
  },
  {
    id: 'dn',
    name: 'Đà Nẵng',
    dailyBudget: 900000,
    monthlyBudget: 27000000,
    monthlyBudgetVat: 31492800,
    reduced30Budget: 22044960,
    reduced30Vat: 25713241,
    reducedExtra30Budget: 15431472,
    reducedExtra30Vat: 17999269,
    spentThisMonth: 54962580,
  },
  {
    id: 'dl',
    name: 'Đà Lạt',
    dailyBudget: 600000,
    monthlyBudget: 18000000,
    monthlyBudgetVat: 20995200,
    reduced30Budget: 14696640,
    reduced30Vat: 17142161,
    reducedExtra30Budget: 10287648,
    reducedExtra30Vat: 11999513,
    spentThisMonth: 14200000,
  },
  {
    id: 'da',
    name: 'Dĩ An',
    dailyBudget: 300000,
    monthlyBudget: 9000000,
    monthlyBudgetVat: 10497600,
    reduced30Budget: 7348320,
    reduced30Vat: 8571080,
    reducedExtra30Budget: 7348320,
    reducedExtra30Vat: 8571080,
    spentThisMonth: 7850000,
  },
  {
    id: 'gk',
    name: 'Gia Kiệm',
    dailyBudget: 0,
    monthlyBudget: 0,
    monthlyBudgetVat: 0,
    reduced30Budget: 0,
    reduced30Vat: 0,
    reducedExtra30Budget: 0,
    reducedExtra30Vat: 0,
    spentThisMonth: 0,
  },
  {
    id: 'bp',
    name: 'Bình Phước',
    dailyBudget: 0,
    monthlyBudget: 0,
    monthlyBudgetVat: 0,
    reduced30Budget: 0,
    reduced30Vat: 0,
    reducedExtra30Budget: 0,
    reducedExtra30Vat: 0,
    spentThisMonth: 20375737,
  },
];

// Helper to extract Spreadsheet ID
export function extractSpreadsheetId(url: string): string {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : '1cUszmTk5RJLPZxkEyrs4uLm_0_yzc3NRjXPIKhA6FUs';
}

// Parse CSV text with quote safety
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

// Parse Vietnamese and financial numbers
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

// Parse CSV into BranchPlanItem list
export function parseBudgetPlanCSV(csvText: string, sourceUrl: string): BudgetPlanSummary {
  const rows = parseCSV(csvText);
  if (!rows || rows.length < 2) {
    return {
      title: 'Ngân Sách Dự Kiến T8',
      totalDaily: 33800000,
      totalMonthly: 1014000000,
      totalMonthlyVat: 1182729600,
      totalReduced30: 827910720,
      totalReduced30Vat: 965675064,
      totalReducedExtra30: 599742000,
      totalReducedExtra30Vat: 699539069,
      items: FALLBACK_BUDGET_PLAN_ITEMS,
      lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      isLive: false,
      sourceUrl,
    };
  }

  const items: BranchPlanItem[] = [];
  let totalDaily = 0;
  let totalMonthly = 0;
  let totalMonthlyVat = 0;
  let totalReduced30 = 0;
  let totalReduced30Vat = 0;
  let totalReducedExtra30 = 0;
  let totalReducedExtra30Vat = 0;

  // Header is row 0
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const name = (row[0] || '').trim();
    if (!name) continue;

    const daily = parseNumber(row[1]);
    const monthly = parseNumber(row[2]);
    const monthlyVat = parseNumber(row[3]);
    const red30 = parseNumber(row[4]);
    const red30Vat = parseNumber(row[5]);
    const redExtra30 = parseNumber(row[6]);
    const redExtra30Vat = parseNumber(row[7]);

    if (name.toUpperCase().includes('TỔNG') || name.toUpperCase().includes('TOTAL')) {
      totalDaily = daily || totalDaily;
      totalMonthly = monthly || totalMonthly;
      totalMonthlyVat = monthlyVat || totalMonthlyVat;
      totalReduced30 = red30 || totalReduced30;
      totalReduced30Vat = red30Vat || totalReduced30Vat;
      totalReducedExtra30 = redExtra30 || totalReducedExtra30;
      totalReducedExtra30Vat = redExtra30Vat || totalReducedExtra30Vat;
      continue;
    }

    const fallbackMatch = FALLBACK_BUDGET_PLAN_ITEMS.find(f => 
      f.name.toLowerCase().includes(name.toLowerCase().slice(0, 5)) ||
      name.toLowerCase().includes(f.name.toLowerCase().slice(0, 5))
    );

    items.push({
      id: `bp_${i}`,
      name,
      dailyBudget: daily,
      monthlyBudget: monthly,
      monthlyBudgetVat: monthlyVat,
      reduced30Budget: red30,
      reduced30Vat: red30Vat,
      reducedExtra30Budget: redExtra30,
      reducedExtra30Vat: redExtra30Vat,
      spentThisMonth: fallbackMatch ? fallbackMatch.spentThisMonth : 0,
    });
  }

  // Calculate totals if not present
  if (totalMonthly === 0 && items.length > 0) {
    totalDaily = items.reduce((sum, item) => sum + item.dailyBudget, 0);
    totalMonthly = items.reduce((sum, item) => sum + item.monthlyBudget, 0);
    totalMonthlyVat = items.reduce((sum, item) => sum + item.monthlyBudgetVat, 0);
    totalReduced30 = items.reduce((sum, item) => sum + item.reduced30Budget, 0);
    totalReduced30Vat = items.reduce((sum, item) => sum + item.reduced30Vat, 0);
    totalReducedExtra30 = items.reduce((sum, item) => sum + item.reducedExtra30Budget, 0);
    totalReducedExtra30Vat = items.reduce((sum, item) => sum + item.reducedExtra30Vat, 0);
  }

  return {
    title: 'Ngân Sách Dự Kiến T8 (Google Sheets Live)',
    totalDaily,
    totalMonthly,
    totalMonthlyVat,
    totalReduced30,
    totalReduced30Vat,
    totalReducedExtra30,
    totalReducedExtra30Vat,
    items: items.length > 0 ? items : FALLBACK_BUDGET_PLAN_ITEMS,
    lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    isLive: true,
    sourceUrl,
  };
}

// Fetch live from Google Sheet with multiple fallbacks
export async function fetchBudgetPlanSheetData(sheetUrl: string = DEFAULT_BUDGET_PLAN_SHEET_URL): Promise<BudgetPlanSummary> {
  const spreadsheetId = extractSpreadsheetId(sheetUrl);
  const cacheBust = Date.now();

  const endpoints = [
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=0&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&_t=${cacheBust}`,
  ];

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    }
  };

  for (const url of endpoints) {
    try {
      const res = await fetch(url, fetchOptions);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('<!DOCTYPE html>') && !text.includes('accounts.google.com') && text.length > 30) {
          const parsed = parseBudgetPlanCSV(text, sheetUrl);
          if (parsed && parsed.items.length > 0) {
            try {
              localStorage.setItem('tamduc_budget_plan_cache', JSON.stringify(parsed));
            } catch {}
            return parsed;
          }
        }
      }
    } catch {
      // try next endpoint
    }
  }

  // Fallback to cached or hardcoded
  try {
    const cached = localStorage.getItem('tamduc_budget_plan_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, isLive: false, sourceUrl: sheetUrl };
    }
  } catch {}

  return {
    title: 'Ngân Sách Dự Kiến T8 (Dữ Liệu Mẫu)',
    totalDaily: 33800000,
    totalMonthly: 1014000000,
    totalMonthlyVat: 1182729600,
    totalReduced30: 827910720,
    totalReduced30Vat: 965675064,
    totalReducedExtra30: 599742000,
    totalReducedExtra30Vat: 699539069,
    items: FALLBACK_BUDGET_PLAN_ITEMS,
    lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    isLive: false,
    sourceUrl: sheetUrl,
  };
}
