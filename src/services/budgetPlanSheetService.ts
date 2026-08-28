// Service kết nối và đồng bộ trực tiếp File Google Sheets "Ngân Sách Dự Kiến"
// URL: https://docs.google.com/spreadsheets/d/1cUszmTk5RJLPZxkEyrs4uLm_0_yzc3NRjXPIKhA6FUs/edit?gid=0#gid=0

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
  monthNum: number;
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
  hasPlanData: boolean;
}

export interface MultiMonthBudgetPlan {
  monthPlans: Record<number, BudgetPlanSummary>;
  availableMonths: number[];
  lastUpdated: string;
  isLive: boolean;
  sourceUrl: string;
}

export const DEFAULT_BUDGET_PLAN_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1cUszmTk5RJLPZxkEyrs4uLm_0_yzc3NRjXPIKhA6FUs/edit?gid=0#gid=0';

// EXACT FALLBACK DATA FOR THÁNG 6 (Từ Sheet 06/2026: 1.054.000.000 đ Gốc, 1.230.285.520 đ VAT)
export const FALLBACK_PLAN_T6_ITEMS: BranchPlanItem[] = [
  { id: 't6_ct', name: 'Cần Thơ 1 + 2+TN', dailyBudget: 2000000, monthlyBudget: 62000000, monthlyBudgetVat: 72316800, reduced30Budget: 43400000, reduced30Vat: 50621760, reducedExtra30Budget: 30380000, reducedExtra30Vat: 35435232 },
  { id: 't6_cm', name: 'Cà Mau', dailyBudget: 700000, monthlyBudget: 21700000, monthlyBudgetVat: 25310800, reduced30Budget: 15190000, reduced30Vat: 17717560, reducedExtra30Budget: 10633000, reducedExtra30Vat: 12402292 },
  { id: 't6_dt', name: 'Đồng Tháp', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 3038000, reducedExtra30Vat: 3543523 },
  { id: 't6_bl', name: 'Bạc Liêu', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 3038000, reducedExtra30Vat: 3543523 },
  { id: 't6_st', name: 'Sóc Trăng', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 3038000, reducedExtra30Vat: 3543523 },
  { id: 't6_bd', name: 'Bình Dương', dailyBudget: 1400000, monthlyBudget: 43400000, monthlyBudgetVat: 50621760, reduced30Budget: 30380000, reduced30Vat: 35435232, reducedExtra30Budget: 21266000, reducedExtra30Vat: 24804662 },
  { id: 't6_vt', name: 'Phước Tỉnh+Xuyên Mộc + Bacu + Bà Rịa', dailyBudget: 1200000, monthlyBudget: 37200000, monthlyBudgetVat: 43390080, reduced30Budget: 26040000, reduced30Vat: 30373056, reducedExtra30Budget: 18228000, reducedExtra30Vat: 21261139 },
  { id: 't6_bh', name: 'Biên Hòa + Đại Phước', dailyBudget: 1200000, monthlyBudget: 37200000, monthlyBudgetVat: 43390080, reduced30Budget: 26040000, reduced30Vat: 30373056, reducedExtra30Budget: 18228000, reducedExtra30Vat: 21261139 },
  { id: 't6_hcm', name: 'HỒ CHÍ MINH lân cận', dailyBudget: 19000000, monthlyBudget: 589000000, monthlyBudgetVat: 687909600, reduced30Budget: 412300000, reduced30Vat: 481536720, reducedExtra30Budget: 288610000, reducedExtra30Vat: 337075704 },
  { id: 't6_vk', name: 'Việt Kiều', dailyBudget: 4000000, monthlyBudget: 124000000, monthlyBudgetVat: 144633600, reduced30Budget: 86800000, reduced30Vat: 101243520, reducedExtra30Budget: 60760000, reducedExtra30Vat: 70870464 },
  { id: 't6_qn', name: 'Quy Nhơn', dailyBudget: 900000, monthlyBudget: 27900000, monthlyBudgetVat: 32542560, reduced30Budget: 19530000, reduced30Vat: 22779792, reducedExtra30Budget: 13671000, reducedExtra30Vat: 15945854 },
  { id: 't6_tn', name: 'Tây Ninh', dailyBudget: 900000, monthlyBudget: 27900000, monthlyBudgetVat: 32542560, reduced30Budget: 19530000, reduced30Vat: 22779792, reducedExtra30Budget: 13671000, reducedExtra30Vat: 15945854 },
  { id: 't6_dn', name: 'Đà Nẵng', dailyBudget: 900000, monthlyBudget: 27900000, monthlyBudgetVat: 32542560, reduced30Budget: 19530000, reduced30Vat: 22779792, reducedExtra30Budget: 13671000, reducedExtra30Vat: 15945854 },
  { id: 't6_dl', name: 'Đà Lạt', dailyBudget: 600000, monthlyBudget: 18600000, monthlyBudgetVat: 21695040, reduced30Budget: 13020000, reduced30Vat: 15186528, reducedExtra30Budget: 9114000, reducedExtra30Vat: 10630570 },
  { id: 't6_da', name: 'Dĩ An', dailyBudget: 300000, monthlyBudget: 9300000, monthlyBudgetVat: 10847520, reduced30Budget: 6510000, reduced30Vat: 7593264, reducedExtra30Budget: 4557000, reducedExtra30Vat: 5315285 },
  { id: 't6_gk', name: 'Gia Kiệm', dailyBudget: 100000, monthlyBudget: 3100000, monthlyBudgetVat: 3615840, reduced30Budget: 2170000, reduced30Vat: 2531088, reducedExtra30Budget: 1519000, reducedExtra30Vat: 1771762 },
  { id: 't6_bp', name: 'Bình Phước', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 3038000, reducedExtra30Vat: 3543523 },
];

// EXACT FALLBACK DATA FOR THÁNG 7 (Từ Sheet 07/2026)
export const FALLBACK_PLAN_T7_ITEMS: BranchPlanItem[] = [
  { id: 't7_ct', name: 'Cần Thơ 1 + 2+TN', dailyBudget: 2000000, monthlyBudget: 62000000, monthlyBudgetVat: 72316800, reduced30Budget: 43400000, reduced30Vat: 50621760, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_cm', name: 'Cà Mau', dailyBudget: 700000, monthlyBudget: 21700000, monthlyBudgetVat: 25310800, reduced30Budget: 15190000, reduced30Vat: 17716716, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_dt', name: 'Đồng Tháp', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_bl', name: 'Bạc Liêu', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_st', name: 'Sóc Trăng', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_bd', name: 'Bình Dương', dailyBudget: 1400000, monthlyBudget: 43400000, monthlyBudgetVat: 50621760, reduced30Budget: 30380000, reduced30Vat: 35435232, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_vt', name: 'Phước Tỉnh+Xuyên Mộc + Bacu + Bà Rịa', dailyBudget: 1200000, monthlyBudget: 37200000, monthlyBudgetVat: 43390080, reduced30Budget: 26040000, reduced30Vat: 30373056, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_bh', name: 'Biên Hòa + Đại Phước', dailyBudget: 1200000, monthlyBudget: 37200000, monthlyBudgetVat: 43390080, reduced30Budget: 26040000, reduced30Vat: 30373056, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_hcm', name: 'HỒ CHÍ MINH lân cận', dailyBudget: 19000000, monthlyBudget: 589000000, monthlyBudgetVat: 687909600, reduced30Budget: 412300000, reduced30Vat: 480906720, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_vk', name: 'Việt Kiều', dailyBudget: 4000000, monthlyBudget: 124000000, monthlyBudgetVat: 144633600, reduced30Budget: 86800000, reduced30Vat: 101243520, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_qn', name: 'Quy Nhơn', dailyBudget: 900000, monthlyBudget: 27900000, monthlyBudgetVat: 32542560, reduced30Budget: 19530000, reduced30Vat: 22779792, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_tn', name: 'Tây Ninh', dailyBudget: 900000, monthlyBudget: 27900000, monthlyBudgetVat: 32542560, reduced30Budget: 19530000, reduced30Vat: 22779792, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_dn', name: 'Đà Nẵng', dailyBudget: 900000, monthlyBudget: 27900000, monthlyBudgetVat: 32542560, reduced30Budget: 19530000, reduced30Vat: 22779792, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_dl', name: 'Đà Lạt', dailyBudget: 600000, monthlyBudget: 18600000, monthlyBudgetVat: 21695040, reduced30Budget: 13020000, reduced30Vat: 15186528, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_da', name: 'Dĩ An', dailyBudget: 300000, monthlyBudget: 9300000, monthlyBudgetVat: 10847520, reduced30Budget: 6510000, reduced30Vat: 7593264, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_gk', name: 'Gia Kiệm', dailyBudget: 100000, monthlyBudget: 3100000, monthlyBudgetVat: 3615840, reduced30Budget: 2170000, reduced30Vat: 2531088, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't7_bp', name: 'Bình Phước', dailyBudget: 200000, monthlyBudget: 6200000, monthlyBudgetVat: 7231680, reduced30Budget: 4340000, reduced30Vat: 5062176, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
];

// EXACT FALLBACK DATA FOR THÁNG 8 (Từ Sheet 08/2026)
export const FALLBACK_PLAN_T8_ITEMS: BranchPlanItem[] = [
  { id: 't8_ct', name: 'Cần Thơ 1 + 2+TN', dailyBudget: 1800000, monthlyBudget: 54000000, monthlyBudgetVat: 62985600, reduced30Budget: 44089920, reduced30Vat: 51426483, reducedExtra30Budget: 30862944, reducedExtra30Vat: 35998538 },
  { id: 't8_cm', name: 'Cà Mau', dailyBudget: 700000, monthlyBudget: 21000000, monthlyBudgetVat: 24494400, reduced30Budget: 17146080, reduced30Vat: 19999188, reducedExtra30Budget: 12002256, reducedExtra30Vat: 13999431 },
  { id: 't8_dt', name: 'Đồng Tháp', dailyBudget: 200000, monthlyBudget: 6000000, monthlyBudgetVat: 6998400, reduced30Budget: 4898880, reduced30Vat: 5714054, reducedExtra30Budget: 6000000, reducedExtra30Vat: 6998400 },
  { id: 't8_bl', name: 'Bạc Liêu', dailyBudget: 200000, monthlyBudget: 6000000, monthlyBudgetVat: 6998400, reduced30Budget: 4898880, reduced30Vat: 5714054, reducedExtra30Budget: 6000000, reducedExtra30Vat: 6998400 },
  { id: 't8_st', name: 'Sóc Trăng', dailyBudget: 200000, monthlyBudget: 6000000, monthlyBudgetVat: 6998400, reduced30Budget: 4898880, reduced30Vat: 5714054, reducedExtra30Budget: 6000000, reducedExtra30Vat: 6998400 },
  { id: 't8_bd', name: 'Bình Dương', dailyBudget: 1400000, monthlyBudget: 42000000, monthlyBudgetVat: 48988800, reduced30Budget: 34292160, reduced30Vat: 39998375, reducedExtra30Budget: 34292160, reducedExtra30Vat: 39998375 },
  { id: 't8_vt', name: 'Phước Tỉnh+Xuyên Mộc + Bacu + Bà Rịa', dailyBudget: 1200000, monthlyBudget: 36000000, monthlyBudgetVat: 41990400, reduced30Budget: 29393280, reduced30Vat: 34284322, reducedExtra30Budget: 20575296, reducedExtra30Vat: 23999025 },
  { id: 't8_bh', name: 'Biên Hòa + Đại Phước', dailyBudget: 1500000, monthlyBudget: 45000000, monthlyBudgetVat: 52488000, reduced30Budget: 36741600, reduced30Vat: 42855402, reducedExtra30Budget: 25719120, reducedExtra30Vat: 29998782 },
  { id: 't8_hcm', name: 'HỒ CHÍ MINH lân cận', dailyBudget: 19000000, monthlyBudget: 570000000, monthlyBudgetVat: 664848000, reduced30Budget: 465393600, reduced30Vat: 542835095, reducedExtra30Budget: 325775520, reducedExtra30Vat: 379984567 },
  { id: 't8_vk', name: 'Việt Kiều', dailyBudget: 4000000, monthlyBudget: 120000000, monthlyBudgetVat: 139968000, reduced30Budget: 97977600, reduced30Vat: 114281073, reducedExtra30Budget: 68584320, reducedExtra30Vat: 79996751 },
  { id: 't8_qn', name: 'Quy Nhơn', dailyBudget: 900000, monthlyBudget: 27000000, monthlyBudgetVat: 31492800, reduced30Budget: 22044960, reduced30Vat: 25713241, reducedExtra30Budget: 15431472, reducedExtra30Vat: 17999269 },
  { id: 't8_tn', name: 'Tây Ninh', dailyBudget: 900000, monthlyBudget: 27000000, monthlyBudgetVat: 31492800, reduced30Budget: 22044960, reduced30Vat: 25713241, reducedExtra30Budget: 15431472, reducedExtra30Vat: 17999269 },
  { id: 't8_dn', name: 'Đà Nẵng', dailyBudget: 900000, monthlyBudget: 27000000, monthlyBudgetVat: 31492800, reduced30Budget: 22044960, reduced30Vat: 25713241, reducedExtra30Budget: 15431472, reducedExtra30Vat: 17999269 },
  { id: 't8_dl', name: 'Đà Lạt', dailyBudget: 600000, monthlyBudget: 18000000, monthlyBudgetVat: 20995200, reduced30Budget: 14696640, reduced30Vat: 17142161, reducedExtra30Budget: 10287648, reducedExtra30Vat: 11999513 },
  { id: 't8_da', name: 'Dĩ An', dailyBudget: 300000, monthlyBudget: 9000000, monthlyBudgetVat: 10497600, reduced30Budget: 7348320, reduced30Vat: 8571080, reducedExtra30Budget: 7348320, reducedExtra30Vat: 8571080 },
  { id: 't8_gk', name: 'Gia Kiệm', dailyBudget: 0, monthlyBudget: 0, monthlyBudgetVat: 0, reduced30Budget: 0, reduced30Vat: 0, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
  { id: 't8_bp', name: 'Bình Phước', dailyBudget: 0, monthlyBudget: 0, monthlyBudgetVat: 0, reduced30Budget: 0, reduced30Vat: 0, reducedExtra30Budget: 0, reducedExtra30Vat: 0 },
];

export const FALLBACK_BUDGET_PLAN_ITEMS = FALLBACK_PLAN_T8_ITEMS;

export const DEFAULT_MULTI_MONTH_PLAN: MultiMonthBudgetPlan = {
  monthPlans: {
    6: {
      monthNum: 6,
      title: 'Ngân Sách Dự Kiến T6 (06/2026)',
      totalDaily: 34000000,
      totalMonthly: 1054000000,
      totalMonthlyVat: 1230285520,
      totalReduced30: 737800000,
      totalReduced30Vat: 861199864,
      totalReducedExtra30: 516460000,
      totalReducedExtra30Vat: 602839905,
      items: FALLBACK_PLAN_T6_ITEMS,
      lastUpdated: '12:00',
      isLive: false,
      sourceUrl: DEFAULT_BUDGET_PLAN_SHEET_URL,
      hasPlanData: true,
    },
    7: {
      monthNum: 7,
      title: 'Ngân Sách Dự Kiến T7 (07/2026)',
      totalDaily: 34000000,
      totalMonthly: 1054000000,
      totalMonthlyVat: 1230285520,
      totalReduced30: 737800000,
      totalReduced30Vat: 860569020,
      totalReducedExtra30: 516460000,
      totalReducedExtra30Vat: 602839905,
      items: FALLBACK_PLAN_T7_ITEMS,
      lastUpdated: '12:00',
      isLive: false,
      sourceUrl: DEFAULT_BUDGET_PLAN_SHEET_URL,
      hasPlanData: true,
    },
    8: {
      monthNum: 8,
      title: 'Ngân Sách Dự Kiến T8 (08/2026)',
      totalDaily: 33800000,
      totalMonthly: 1014000000,
      totalMonthlyVat: 1182729600,
      totalReduced30: 827910720,
      totalReduced30Vat: 965675064,
      totalReducedExtra30: 599742000,
      totalReducedExtra30Vat: 699539069,
      items: FALLBACK_PLAN_T8_ITEMS,
      lastUpdated: '12:00',
      isLive: false,
      sourceUrl: DEFAULT_BUDGET_PLAN_SHEET_URL,
      hasPlanData: true,
    },
  },
  availableMonths: [6, 7, 8],
  lastUpdated: '12:00',
  isLive: false,
  sourceUrl: DEFAULT_BUDGET_PLAN_SHEET_URL,
};

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

// Parse CSV into MultiMonthBudgetPlan with full support for T6, T7, T8 sections
export function parseMultiMonthBudgetPlanCSV(csvText: string, sourceUrl: string): MultiMonthBudgetPlan {
  const rows = parseCSV(csvText);
  if (!rows || rows.length < 5) {
    return DEFAULT_MULTI_MONTH_PLAN;
  }

  const monthPlans: Record<number, BudgetPlanSummary> = {};
  const availableMonths: number[] = [];

  interface RawSection {
    monthNum: number;
    title: string;
    items: BranchPlanItem[];
    totalRow: {
      daily: number;
      monthly: number;
      monthlyVat: number;
      red30: number;
      red30Vat: number;
      redExtra30: number;
      redExtra30Vat: number;
    } | null;
  }

  let currentSection: RawSection | null = null;

  rows.forEach((r, idx) => {
    const col0 = r[0] || '';
    const col1 = r[1] || '';
    const rowStr = (col0 + ' ' + col1).toLowerCase();

    // Check for Section Header (e.g. 06/2026 Ngân Sách Dự Kiến T6)
    if (rowStr.includes('dự kiến') || col0.includes('/2026') || col0.includes('/2025') || rowStr.includes('ngân sách dự kiến')) {
      let monthNum = 0;
      if (rowStr.includes('t6') || col0.includes('06/')) monthNum = 6;
      else if (rowStr.includes('t7') || col0.includes('07/')) monthNum = 7;
      else if (rowStr.includes('t8') || col0.includes('08/')) monthNum = 8;
      else if (rowStr.includes('t9') || col0.includes('09/')) monthNum = 9;
      else if (rowStr.includes('t10') || col0.includes('10/')) monthNum = 10;
      else if (rowStr.includes('t11') || col0.includes('11/')) monthNum = 11;
      else if (rowStr.includes('t12') || col0.includes('12/')) monthNum = 12;

      if (monthNum > 0) {
        currentSection = {
          monthNum,
          title: (col0 + ' ' + col1).trim() || `Ngân Sách Dự Kiến T${monthNum}`,
          items: [],
          totalRow: null,
        };
        return;
      }
    }

    if (!currentSection) return;

    // Skip empty or header rows
    if (col1.toLowerCase().includes('phòng') || col1.toLowerCase().includes('chi nhánh') || col1 === '') {
      return;
    }

    const name = col1.trim();
    const daily = parseNumber(r[2]);
    const monthly = parseNumber(r[3]);
    const monthlyVat = parseNumber(r[4]);
    const red30 = parseNumber(r[5]);
    const red30Vat = parseNumber(r[6]);
    const redExtra30 = parseNumber(r[7]);
    const redExtra30Vat = parseNumber(r[8]);

    if (name.toUpperCase().includes('TỔNG') || name.toUpperCase().includes('TOTAL')) {
      // Calculate missing reduction totals if not explicitly in sheet
      const computedMonthly = monthly || currentSection.items.reduce((s, i) => s + i.monthlyBudget, 0);
      const computedMonthlyVat = monthlyVat || currentSection.items.reduce((s, i) => s + i.monthlyBudgetVat, 0);

      currentSection.totalRow = {
        daily: daily || currentSection.items.reduce((s, i) => s + i.dailyBudget, 0),
        monthly: computedMonthly,
        monthlyVat: computedMonthlyVat,
        red30: red30 || Math.round(computedMonthly * 0.7),
        red30Vat: red30Vat || Math.round(computedMonthlyVat * 0.7),
        redExtra30: redExtra30 || Math.round(computedMonthly * 0.49),
        redExtra30Vat: redExtra30Vat || Math.round(computedMonthlyVat * 0.49),
      };

      // Wrap up section
      const mNum = currentSection.monthNum;
      const secItems = currentSection.items;
      
      // Calculate totals
      const totalDaily = currentSection.totalRow.daily || secItems.reduce((s, i) => s + i.dailyBudget, 0);
      const totalMonthly = currentSection.totalRow.monthly || secItems.reduce((s, i) => s + i.monthlyBudget, 0);
      const totalMonthlyVat = currentSection.totalRow.monthlyVat || secItems.reduce((s, i) => s + i.monthlyBudgetVat, 0);
      const totalReduced30 = currentSection.totalRow.red30 || secItems.reduce((s, i) => s + i.reduced30Budget, 0);
      const totalReduced30Vat = currentSection.totalRow.red30Vat || secItems.reduce((s, i) => s + i.reduced30Vat, 0);
      const totalReducedExtra30 = currentSection.totalRow.redExtra30 || secItems.reduce((s, i) => s + i.reducedExtra30Budget, 0);
      const totalReducedExtra30Vat = currentSection.totalRow.redExtra30Vat || secItems.reduce((s, i) => s + i.reducedExtra30Vat, 0);

      monthPlans[mNum] = {
        monthNum: mNum,
        title: currentSection.title,
        totalDaily,
        totalMonthly: totalMonthly || (mNum === 7 ? 1054000000 : 0),
        totalMonthlyVat,
        totalReduced30,
        totalReduced30Vat,
        totalReducedExtra30,
        totalReducedExtra30Vat,
        items: secItems,
        lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        isLive: true,
        sourceUrl,
        hasPlanData: true,
      };

      if (!availableMonths.includes(mNum)) {
        availableMonths.push(mNum);
      }

      currentSection = null;
    } else {
      const calcMonthly = monthly || (daily > 0 ? daily * 31 : 0);
      const calcMonthlyVat = monthlyVat || Math.round(calcMonthly * 1.1672538);
      const calcRed30 = red30 || Math.round(calcMonthly * 0.7);
      const calcRed30Vat = red30Vat || Math.round(calcMonthlyVat * 0.7);
      const calcRedExtra30 = redExtra30 || Math.round(calcMonthly * 0.49);
      const calcRedExtra30Vat = redExtra30Vat || Math.round(calcMonthlyVat * 0.49);

      currentSection.items.push({
        id: `t${currentSection.monthNum}_${idx}`,
        name,
        dailyBudget: daily,
        monthlyBudget: calcMonthly,
        monthlyBudgetVat: calcMonthlyVat,
        reduced30Budget: calcRed30,
        reduced30Vat: calcRed30Vat,
        reducedExtra30Budget: calcRedExtra30,
        reducedExtra30Vat: calcRedExtra30Vat,
      });
    }
  });

  if (availableMonths.length === 0) {
    return DEFAULT_MULTI_MONTH_PLAN;
  }

  return {
    monthPlans,
    availableMonths: availableMonths.sort((a, b) => a - b),
    lastUpdated: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    isLive: true,
    sourceUrl,
  };
}

// Fetch live from Google Sheet with multiple fallbacks and server proxy
export async function fetchMultiMonthBudgetPlan(sheetUrl: string = DEFAULT_BUDGET_PLAN_SHEET_URL): Promise<MultiMonthBudgetPlan> {
  const spreadsheetId = extractSpreadsheetId(sheetUrl);
  const cacheBust = Date.now();

  const endpoints = [
    `/api/proxy-sheet?url=${encodeURIComponent(sheetUrl)}&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=0&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv&gid=0&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&_t=${cacheBust}`,
  ];

  const fetchOptions: RequestInit = {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  };

  for (const url of endpoints) {
    try {
      const res = await fetch(url, fetchOptions);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('<!DOCTYPE html>') && !text.includes('accounts.google.com') && text.length > 30) {
          const parsed = parseMultiMonthBudgetPlanCSV(text, sheetUrl);
          if (parsed && parsed.availableMonths.length > 0) {
            parsed.lastUpdated = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            parsed.isLive = true;
            try {
              localStorage.setItem('tamduc_multi_month_plan_cache', JSON.stringify(parsed));
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
    const cached = localStorage.getItem('tamduc_multi_month_plan_cache');
    if (cached) {
      const parsed = JSON.parse(cached);
      return { ...parsed, isLive: false, sourceUrl: sheetUrl };
    }
  } catch {}

  return DEFAULT_MULTI_MONTH_PLAN;
}

// Legacy single-month summary wrapper
export async function fetchBudgetPlanSheetData(sheetUrl: string = DEFAULT_BUDGET_PLAN_SHEET_URL): Promise<BudgetPlanSummary> {
  const multiPlan = await fetchMultiMonthBudgetPlan(sheetUrl);
  return multiPlan.monthPlans[8] || multiPlan.monthPlans[7] || multiPlan.monthPlans[6] || {
    monthNum: 8,
    title: 'Ngân Sách Dự Kiến T8',
    totalDaily: 33800000,
    totalMonthly: 1014000000,
    totalMonthlyVat: 1182729600,
    totalReduced30: 827910720,
    totalReduced30Vat: 965675064,
    totalReducedExtra30: 599742000,
    totalReducedExtra30Vat: 699539069,
    items: FALLBACK_PLAN_T8_ITEMS,
    lastUpdated: '12:00',
    isLive: false,
    sourceUrl: sheetUrl,
    hasPlanData: true,
  };
}
