import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Wallet,
  TrendingUp,
  Target,
  Sparkles,
  DollarSign,
  PieChart,
  Layers,
  ArrowUpRight,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Copy,
  Check,
  Zap,
  Info,
  Building2,
  Users2,
  Calendar,
  Share2,
  Download,
  Bot,
  Flame,
  Globe,
  Compass,
  FileSpreadsheet,
  RefreshCw,
  Search,
  ExternalLink,
  Table as TableIcon,
  LayoutGrid,
  ShieldCheck,
  Edit3,
  X,
  Save,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell,
  PieChart as RechartsPie,
  Pie,
} from 'recharts';
import { MonthDataset } from '../data/revenueData';
import { DisplayUnit } from '../types';
import { formatVND, formatPercent } from '../utils/formatters';
import {
  DEFAULT_BUDGET_PLAN_SHEET_URL,
  BudgetPlanSummary,
  BranchPlanItem,
  MultiMonthBudgetPlan,
  DEFAULT_MULTI_MONTH_PLAN,
  fetchMultiMonthBudgetPlan,
  FALLBACK_PLAN_T6_ITEMS,
  FALLBACK_PLAN_T7_ITEMS,
  FALLBACK_PLAN_T8_ITEMS,
  FALLBACK_BUDGET_PLAN_ITEMS,
  EMPTY_BRANCH_PLAN_ITEMS,
} from '../services/budgetPlanSheetService';

interface BudgetForecastViewProps {
  monthlyDatasets: MonthDataset[];
  displayUnit?: DisplayUnit;
  activeMonth?: number | string;
  onSelectMonth?: (month: number | string) => void;
}

interface ServiceBudgetItem {
  id: string;
  name: string;
  sharePercent: number;
  expectedCpa: number; // VND per lead
  avgOrderValue: number; // Giá trị đơn hàng trung bình
  conversionRate: number; // % Chốt đơn từ Lead
  color: string;
}

const DEFAULT_SERVICES: ServiceBudgetItem[] = [
  {
    id: 'implant',
    name: 'Trồng Răng Implant',
    sharePercent: 42,
    expectedCpa: 580000,
    avgOrderValue: 28000000,
    conversionRate: 16, // % Chốt thực tế toàn phễu (Lead Online -> Đến khám -> Chốt ca) ~99 ca
    color: '#06b6d4', // cyan-500
  },
  {
    id: 'vietkieu',
    name: 'Khách Việt Kiều / Kiều Bào',
    sharePercent: 22,
    expectedCpa: 850000,
    avgOrderValue: 65000000,
    conversionRate: 18, // ~40 ca combo toàn hàm / sứ cao cấp
    color: '#8b5cf6', // purple-500
  },
  {
    id: 'su',
    name: 'Răng Sứ Thẩm Mỹ',
    sharePercent: 16,
    expectedCpa: 420000,
    avgOrderValue: 18000000,
    conversionRate: 15, // ~49 ca bọc sứ / dán veneer
    color: '#3b82f6', // blue-500
  },
  {
    id: 'nieng',
    name: 'Niềng Răng / Chỉnh Nha',
    sharePercent: 12,
    expectedCpa: 460000,
    avgOrderValue: 32000000,
    conversionRate: 12, // ~27 ca niềng mắc cài / invisalign
    color: '#10b981', // emerald-500
  },
  {
    id: 'tonghop',
    name: 'Nha Khoa Tổng Quát & Trị Liệu',
    sharePercent: 8,
    expectedCpa: 220000,
    avgOrderValue: 4500000,
    conversionRate: 28, // ~87 ca điều trị tổng quát / nhổ răng khôn / tẩy trắng
    color: '#f59e0b', // amber-500
  },
];

const CHANNELS = [
  { name: 'Google Ads Search (Từ Khóa Ý Định Cao)', percent: 50, color: '#3b82f6' },
  { name: 'Google Performance Max (PMax Đa Kênh)', percent: 25, color: '#06b6d4' },
  { name: 'YouTube Video & GDN Remarketing', percent: 10, color: '#8b5cf6' },
  { name: 'Facebook / TikTok Social Ads', percent: 10, color: '#ec4899' },
  { name: 'Google Maps Local & SEO Referral', percent: 5, color: '#10b981' },
];

const MONTH_TABS = [
  { id: 't1', monthNum: 1, label: 'Tháng 1', short: 'T1' },
  { id: 't2', monthNum: 2, label: 'Tháng 2', short: 'T2' },
  { id: 't3', monthNum: 3, label: 'Tháng 3', short: 'T3' },
  { id: 't4', monthNum: 4, label: 'Tháng 4', short: 'T4' },
  { id: 't5', monthNum: 5, label: 'Tháng 5', short: 'T5' },
  { id: 't6', monthNum: 6, label: 'Tháng 6', short: 'T6' },
  { id: 't7', monthNum: 7, label: 'Tháng 7', short: 'T7' },
  { id: 't8', monthNum: 8, label: 'Tháng 8', short: 'T8' },
  { id: 't9', monthNum: 9, label: 'Tháng 9', short: 'T9' },
  { id: 'all', monthNum: 0, label: 'Cả Năm / Tổng Hợp', short: 'Cả Năm' },
];

function normalizeBranchName(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

function getBranchCostFromMonthDataset(branchName: string, monthDataset: MonthDataset): number {
  if (!monthDataExists(monthDataset)) return 0;
  const bNorm = normalizeBranchName(branchName);

  let totalCost = 0;

  monthDataset.regions.forEach((r) => {
    const rNorm = normalizeBranchName(r.name);
    let matched = false;

    if (rNorm === bNorm || bNorm.includes(rNorm) || rNorm.includes(bNorm)) {
      matched = true;
    } else if (
      (bNorm.includes('phuoctinh') || bNorm.includes('baria') || bNorm.includes('vungtau') || bNorm.includes('bacu') || bNorm.includes('xuyenmoc')) &&
      (rNorm.includes('vungtau') || rNorm.includes('baria') || rNorm.includes('phuoctinh') || rNorm.includes('bacu') || rNorm.includes('xuyenmoc'))
    ) {
      matched = true;
    } else if (
      bNorm.includes('cantho') && rNorm.includes('cantho')
    ) {
      matched = true;
    } else if (
      bNorm.includes('camau') && rNorm.includes('camau')
    ) {
      matched = true;
    } else if (
      bNorm.includes('dongthap') && rNorm.includes('dongthap')
    ) {
      matched = true;
    } else if (
      bNorm.includes('baclieu') && rNorm.includes('baclieu')
    ) {
      matched = true;
    } else if (
      bNorm.includes('soctrang') && rNorm.includes('soctrang')
    ) {
      matched = true;
    } else if (
      bNorm.includes('binhduong') && rNorm.includes('binhduong')
    ) {
      matched = true;
    } else if (
      (bNorm.includes('bienhoa') || bNorm.includes('daiphuoc')) && (rNorm.includes('bienhoa') || rNorm.includes('daiphuoc'))
    ) {
      matched = true;
    } else if (
      (bNorm.includes('hochiminh') || bNorm.includes('hcm')) && (rNorm.includes('hcm') || rNorm.includes('hochiminh') || rNorm.includes('saigon'))
    ) {
      matched = true;
    } else if (
      (bNorm.includes('vietkieu') || bNorm.includes('vk')) && (rNorm.includes('vietkieu') || rNorm.includes('vk'))
    ) {
      matched = true;
    } else if (
      bNorm.includes('quynhon') && rNorm.includes('quynhon')
    ) {
      matched = true;
    } else if (
      bNorm.includes('tayninh') && rNorm.includes('tayninh')
    ) {
      matched = true;
    } else if (
      bNorm.includes('danang') && rNorm.includes('danang')
    ) {
      matched = true;
    } else if (
      bNorm.includes('dalat') && rNorm.includes('dalat')
    ) {
      matched = true;
    } else if (
      bNorm.includes('binhphuoc') && rNorm.includes('binhphuoc')
    ) {
      matched = true;
    } else if (
      bNorm.includes('dian') && rNorm.includes('dian')
    ) {
      matched = true;
    } else if (
      bNorm.includes('giakiem') && rNorm.includes('giakiem')
    ) {
      matched = true;
    } else if (
      bNorm.includes('phanthiet') && rNorm.includes('phanthiet')
    ) {
      matched = true;
    }

    if (matched) {
      totalCost += (r.costVAT || 0);
    }
  });

  return totalCost;
}

function monthDataExists(m: MonthDataset | undefined): m is MonthDataset {
  return !!(m && Array.isArray(m.regions) && m.regions.length > 0);
}

export const BudgetForecastView: React.FC<BudgetForecastViewProps> = ({
  monthlyDatasets,
  displayUnit = 'full',
  activeMonth,
  onSelectMonth,
}) => {
  // Main view mode: 'cards_grid' (Dạng Thẻ Tiến Độ theo ảnh), 'sheet_plan' (Dạng Bảng), 'simulation' (Mô Phỏng Doanh Thu & ROI)
  const [activeViewMode, setActiveViewMode] = useState<'cards_grid' | 'sheet_plan' | 'simulation'>('cards_grid');

  // Budget Scenario for Progress Cards: 'base_100' (Kế hoạch 100%), 'reduced_30' (Giảm 30%), 'reduced_extra_30' (Giảm thêm 30%), 'custom' (Tùy chỉnh)
  const [budgetScenario, setBudgetScenario] = useState<'base_100' | 'reduced_30' | 'reduced_extra_30' | 'custom'>('base_100');
  const [customReductionPct, setCustomReductionPct] = useState<number>(20); // % giảm tùy chỉnh

  // Helper to resolve month tab key (e.g. 9 -> 't9', 't9' -> 't9', 'all' -> 'all')
  const resolveMonthKey = (m?: number | string) => {
    if (!m) {
      const currentCalendarMonth = new Date().getMonth() + 1;
      return currentCalendarMonth >= 1 && currentCalendarMonth <= 9 ? `t${currentCalendarMonth}` : 't9';
    }
    if (typeof m === 'number') return `t${m}`;
    const lower = String(m).toLowerCase();
    if (lower === 'all' || lower.startsWith('t')) return lower;
    return `t${lower}`;
  };

  // Selected Month for comparison (Synced with activeMonth, default T8)
  const [selectedMonth, setSelectedMonth] = useState<string>(() => resolveMonthKey(activeMonth));

  // Sync with parent activeMonth prop if it changes
  useEffect(() => {
    if (activeMonth !== undefined && activeMonth !== null) {
      setSelectedMonth(resolveMonthKey(activeMonth));
    }
  }, [activeMonth]);
  const [tableSubMode, setTableSubMode] = useState<'single_month' | 'all_months_matrix'>('single_month');

  // Status Filter: 'all', 'over_budget', 'within_budget'
  const [statusFilter, setStatusFilter] = useState<'all' | 'over_budget' | 'within_budget'>('all');

  // Multi-Month Budget Plan Google Sheets Live State
  const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_BUDGET_PLAN_SHEET_URL);
  const [multiMonthPlan, setMultiMonthPlan] = useState<MultiMonthBudgetPlan>(DEFAULT_MULTI_MONTH_PLAN);
  const [isFetchingSheet, setIsFetchingSheet] = useState<boolean>(false);
  const [sheetSearchTerm, setSheetSearchTerm] = useState<string>('');

  // Edit Modal State
  const [editingBranch, setEditingBranch] = useState<BranchPlanItem | null>(null);
  const [editDailyBudget, setEditDailyBudget] = useState<number>(0);
  const [editMonthlyBudget, setEditMonthlyBudget] = useState<number>(0);
  const [editSpent, setEditSpent] = useState<number>(0);

  // Simulation Planner State
  const [targetPeriod, setTargetPeriod] = useState<'month_9' | 'month_10' | 'q4' | 'year_2027'>('month_9');
  const [totalBudget, setTotalBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('forecast_total_budget');
      return saved ? parseInt(saved, 10) : 850000000;
    } catch {
      return 850000000;
    }
  });

  const [targetRoas, setTargetRoas] = useState<number>(6.0); // 6.0x (Chuẩn KPI 7.5 Tỷ với ngân sách theo file)
  const [activeScenario, setActiveScenario] = useState<'kpi125_75' | 'reduce30' | 'reduce60'>('kpi125_75');
  const [services] = useState<ServiceBudgetItem[]>(DEFAULT_SERVICES);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Load Google Sheet Budget Plan (Reads multi-month T6, T7, T8 in Real-Time)
  const [syncStatusMsg, setSyncStatusMsg] = useState<string>('');

  const loadBudgetSheet = useCallback(async (url: string = sheetUrl, isSilent: boolean = false) => {
    if (!isSilent) setIsFetchingSheet(true);
    try {
      // 1. Check if backend has a configured budget sheet URL
      let targetUrl = url;
      try {
        const configRes = await fetch('/api/config/budget-sheet', { signal: AbortSignal.timeout(2500) });
        if (configRes.ok) {
          const configData = await configRes.json();
          if (configData.url && typeof configData.url === 'string' && configData.url.trim().length > 0) {
            targetUrl = configData.url.trim();
            if (targetUrl !== sheetUrl) {
              setSheetUrl(targetUrl);
            }
          }
        }
      } catch {}

      const data = await fetchMultiMonthBudgetPlan(targetUrl);
      if (data && data.availableMonths.length > 0) {
        setMultiMonthPlan(data);
        setSyncStatusMsg(`Đã đồng bộ lúc ${data.lastUpdated || new Date().toLocaleTimeString('vi-VN')}`);
      }
    } catch (err) {
      console.error('Error fetching multi-month budget plan sheet:', err);
    } finally {
      if (!isSilent) setIsFetchingSheet(false);
    }
  }, [sheetUrl]);

  // Initial load + Real-time Window Focus listener + 30s Auto-polling interval
  useEffect(() => {
    loadBudgetSheet(sheetUrl);

    // Auto-refresh every 30 seconds to catch spreadsheet edits automatically
    const interval = setInterval(() => {
      loadBudgetSheet(sheetUrl, true);
    }, 30000);

    // Auto-refresh immediately when user switches back to this browser tab
    const handleFocus = () => {
      loadBudgetSheet(sheetUrl, true);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadBudgetSheet(sheetUrl, true);
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sheetUrl, loadBudgetSheet]);

  // Selected Month Number Helper
  const selectedMonthNum = useMemo(() => {
    if (selectedMonth === 'all') return 0;
    const tab = MONTH_TABS.find((t) => t.id === selectedMonth);
    return tab ? tab.monthNum : 8;
  }, [selectedMonth]);

  // Dynamic days count in selected month (e.g. T6 = 30 ngày, T7 = 31 ngày, T8 = 31 ngày, T2 = 28 ngày)
  const currentMonthDays = useMemo(() => {
    if (selectedMonth === 'all' || selectedMonthNum === 0) return 365;
    const daysMap: Record<number, number> = {
      1: 31,
      2: 28,
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31,
    };
    return daysMap[selectedMonthNum] || 30;
  }, [selectedMonth, selectedMonthNum]);

  const hasPlanDataForSelectedMonth = useMemo(() => {
    if (selectedMonthNum === 0) return true;
    const plan = multiMonthPlan.monthPlans[selectedMonthNum];
    if (plan && (plan.totalMonthlyVat > 0 || plan.totalMonthly > 0)) return true;
    return (multiMonthPlan.availableMonths || []).includes(selectedMonthNum);
  }, [selectedMonthNum, multiMonthPlan]);

  // Active items dynamically resolved:
  // - If sheet has plan data for selected month, use that month's parsed items
  // - For T6, T7, T8 with built-in fallbacks if sheet not yet loaded
  // - For months without plan data in sheet yet (T1-T5, T9, etc.), returns EMPTY_BRANCH_PLAN_ITEMS (all 0s waiting for sheet update)
  const activeItems = useMemo(() => {
    if (selectedMonthNum === 0) {
      return multiMonthPlan.monthPlans[8]?.items || FALLBACK_PLAN_T8_ITEMS;
    }
    const monthPlan = multiMonthPlan.monthPlans[selectedMonthNum];
    if (monthPlan && monthPlan.items && monthPlan.items.length > 0 && (monthPlan.totalMonthlyVat > 0 || monthPlan.totalMonthly > 0)) {
      return monthPlan.items;
    }
    if (selectedMonthNum === 6) {
      return multiMonthPlan.monthPlans[6]?.items || FALLBACK_PLAN_T6_ITEMS;
    }
    if (selectedMonthNum === 7) {
      return multiMonthPlan.monthPlans[7]?.items || FALLBACK_PLAN_T7_ITEMS;
    }
    if (selectedMonthNum === 8) {
      return multiMonthPlan.monthPlans[8]?.items || FALLBACK_PLAN_T8_ITEMS;
    }
    // For months 1 to 5 (or any month without plan data), return empty items with 0s waiting for update
    return EMPTY_BRANCH_PLAN_ITEMS;
  }, [selectedMonthNum, multiMonthPlan]);

  // Check if current active month / dataset actually has reduction columns (Giảm 30%, Giảm thêm 30%)
  const hasReduced30 = useMemo(() => {
    if (selectedMonth === 'all') {
      return Object.values(multiMonthPlan.monthPlans || {}).some(
        (p) => p.hasReduced30 || (p.totalReduced30 || 0) > 0 || (p.totalReduced30Vat || 0) > 0
      );
    }
    return activeItems.some((i) => (i.reduced30Budget || 0) > 0 || (i.reduced30Vat || 0) > 0);
  }, [activeItems, selectedMonth, multiMonthPlan]);

  const hasReducedExtra30 = useMemo(() => {
    if (selectedMonth === 'all') {
      return Object.values(multiMonthPlan.monthPlans || {}).some(
        (p) => p.hasReducedExtra30 || (p.totalReducedExtra30 || 0) > 0 || (p.totalReducedExtra30Vat || 0) > 0
      );
    }
    return activeItems.some((i) => (i.reducedExtra30Budget || 0) > 0 || (i.reducedExtra30Vat || 0) > 0);
  }, [activeItems, selectedMonth, multiMonthPlan]);

  // Auto fallback scenario if selected month doesn't have the active reduction scenario
  useEffect(() => {
    if (budgetScenario === 'reduced_30' && !hasReduced30) {
      setBudgetScenario('base_100');
    }
    if (budgetScenario === 'reduced_extra_30' && !hasReducedExtra30) {
      setBudgetScenario('base_100');
    }
  }, [hasReduced30, hasReducedExtra30, budgetScenario]);

  // Save custom branch data for active month
  const handleSaveBranchEdit = () => {
    if (!editingBranch) return;

    const vatMultiplier = 1.1664; // +16.64%
    const monthlyVat = Math.round(editMonthlyBudget * vatMultiplier);
    const reduced30 = Math.round(editMonthlyBudget * 0.7 * vatMultiplier);
    const reducedExtra30 = Math.round(editMonthlyBudget * 0.49 * vatMultiplier);

    const mNum = selectedMonthNum > 0 ? selectedMonthNum : 8;
    const currentMonthPlan = multiMonthPlan.monthPlans[mNum] || multiMonthPlan.monthPlans[8];
    if (!currentMonthPlan) return;

    const updatedItems = currentMonthPlan.items.map((item) => {
      if (item.id === editingBranch.id || item.name === editingBranch.name) {
        return {
          ...item,
          dailyBudget: editDailyBudget,
          monthlyBudget: editMonthlyBudget,
          monthlyBudgetVat: monthlyVat,
          reduced30Budget: Math.round(editMonthlyBudget * 0.7),
          reduced30Vat: reduced30,
          reducedExtra30Budget: Math.round(editMonthlyBudget * 0.49),
          reducedExtra30Vat: reducedExtra30,
          spentThisMonth: editSpent,
        };
      }
      return item;
    });

    const updatedPlan: MultiMonthBudgetPlan = {
      ...multiMonthPlan,
      monthPlans: {
        ...multiMonthPlan.monthPlans,
        [mNum]: {
          ...currentMonthPlan,
          items: updatedItems,
        },
      },
    };

    setMultiMonthPlan(updatedPlan);
    try {
      localStorage.setItem('tamduc_multi_month_plan_cache', JSON.stringify(updatedPlan));
    } catch {
      // ignore
    }
    setEditingBranch(null);
  };

  // Helper to resolve a branch's spent amount for any selected month
  const getBranchSpentForMonth = useCallback(
    (branch: BranchPlanItem, monthKey: string): number => {
      if (monthKey === 'all') {
        let sum = 0;
        let foundAny = false;
        (monthlyDatasets || []).forEach((m) => {
          const cost = getBranchCostFromMonthDataset(branch.name, m);
          if (cost > 0) {
            sum += cost;
            foundAny = true;
          }
        });
        return foundAny ? sum : (branch.spentThisMonth || 0);
      }

      const tab = MONTH_TABS.find((t) => t.id === monthKey);
      if (!tab || tab.monthNum === 0) {
        return branch.spentThisMonth || 0;
      }

      const targetDataset = (monthlyDatasets || []).find((m) => m.month === tab.monthNum);
      if (!targetDataset) {
        return tab.monthNum === 1 ? (branch.spentThisMonth || 0) : 0;
      }

      const datasetCost = getBranchCostFromMonthDataset(branch.name, targetDataset);
      return datasetCost > 0 ? datasetCost : (tab.monthNum === 1 ? (branch.spentThisMonth || 0) : 0);
    },
    [monthlyDatasets]
  );

  const handleOpenEditModal = (branch: BranchPlanItem) => {
    setEditingBranch(branch);
    setEditDailyBudget(branch.dailyBudget);
    setEditMonthlyBudget(branch.monthlyBudget);
    setEditSpent(getBranchSpentForMonth(branch, selectedMonth));
  };

  // Helper to compute effective limit for a branch under active scenario
  const getBranchEffectiveLimit = useCallback((item: BranchPlanItem) => {
    if (budgetScenario === 'base_100') {
      return item.monthlyBudgetVat || item.monthlyBudget;
    } else if (budgetScenario === 'reduced_30') {
      return item.reduced30Vat || item.reduced30Budget || item.monthlyBudgetVat || item.monthlyBudget;
    } else if (budgetScenario === 'reduced_extra_30') {
      return item.reducedExtra30Vat || item.reducedExtra30Budget || item.monthlyBudgetVat || item.monthlyBudget;
    } else {
      const factor = Math.max(0, (100 - customReductionPct) / 100);
      return Math.round((item.monthlyBudgetVat || item.monthlyBudget) * factor);
    }
  }, [budgetScenario, customReductionPct]);

  const currentSummary = useMemo(() => {
    const totalDaily = activeItems.reduce((s, i) => s + i.dailyBudget, 0);
    const totalMonthly = activeItems.reduce((s, i) => s + i.monthlyBudget, 0);
    const totalMonthlyVat = activeItems.reduce((s, i) => s + i.monthlyBudgetVat, 0);
    const totalReduced30 = activeItems.reduce((s, i) => s + i.reduced30Budget, 0);
    const totalReduced30Vat = activeItems.reduce((s, i) => s + i.reduced30Vat, 0);
    const totalReducedExtra30 = activeItems.reduce((s, i) => s + i.reducedExtra30Budget, 0);
    const totalReducedExtra30Vat = activeItems.reduce((s, i) => s + i.reducedExtra30Vat, 0);

    // Dynamic total spent for the active selected month directly aligned with Tab Doanh Thu
    let totalSpent = 0;
    if (selectedMonth === 'all') {
      const datasetSum = (monthlyDatasets || []).reduce((acc, m) => acc + (m.regions || []).reduce((rAcc, r) => rAcc + (r.costVAT || 0), 0), 0);
      totalSpent = datasetSum > 0 ? datasetSum : activeItems.reduce((s, i) => s + getBranchSpentForMonth(i, 'all'), 0);
    } else {
      const tab = MONTH_TABS.find((t) => t.id === selectedMonth);
      const targetDataset = (monthlyDatasets || []).find((m) => m.month === tab?.monthNum);
      if (targetDataset && targetDataset.regions && targetDataset.regions.length > 0) {
        totalSpent = targetDataset.regions.reduce((acc, r) => acc + (r.costVAT || 0), 0);
      } else {
        totalSpent = activeItems.reduce((s, i) => s + getBranchSpentForMonth(i, selectedMonth), 0);
      }
    }

    // Calculate dynamic effective total budget under selected reduction scenario
    let activeScenarioTotalBudget = totalMonthlyVat > 0 ? totalMonthlyVat : totalMonthly;
    let scenarioLabel = 'Chuẩn Kế Hoạch (+VAT)';
    if (budgetScenario === 'reduced_30') {
      activeScenarioTotalBudget = totalReduced30Vat > 0 ? totalReduced30Vat : (totalReduced30 || totalMonthlyVat);
      scenarioLabel = 'Kịch Bản Giảm 30% (+VAT)';
    } else if (budgetScenario === 'reduced_extra_30') {
      activeScenarioTotalBudget = totalReducedExtra30Vat > 0 ? totalReducedExtra30Vat : (totalReducedExtra30 || totalMonthlyVat);
      scenarioLabel = 'Kịch Bản Giảm Thêm 30% (-51% +VAT)';
    } else if (budgetScenario === 'custom') {
      const factor = Math.max(0, (100 - customReductionPct) / 100);
      activeScenarioTotalBudget = Math.round(totalMonthlyVat * factor);
      scenarioLabel = `Kịch Bản Giảm ${customReductionPct}%`;
    }

    if (selectedMonth === 'all') {
      const activeMonthsCount = (monthlyDatasets || []).filter((m) => m.regions && m.regions.some((r) => r.costVAT > 0)).length || 7;
      activeScenarioTotalBudget = activeScenarioTotalBudget * activeMonthsCount;
      scenarioLabel = `${scenarioLabel} (Lũy kế ${activeMonthsCount} Tháng)`;
    }

    const activeLocationsCount = activeItems.filter((i) => i.dailyBudget > 0).length || 15;
    const avgDailyPerLocation = activeLocationsCount > 0 ? Math.round(totalDaily / activeLocationsCount) : 0;
    const remainingBudget = activeScenarioTotalBudget - totalSpent;
    const burnRatePercent = activeScenarioTotalBudget > 0 ? (totalSpent / activeScenarioTotalBudget) * 100 : 0;

    return {
      totalDaily,
      totalMonthly,
      totalMonthlyVat,
      totalReduced30,
      totalReduced30Vat,
      totalReducedExtra30,
      totalReducedExtra30Vat,
      activeScenarioTotalBudget,
      scenarioLabel,
      totalSpent,
      activeLocationsCount,
      avgDailyPerLocation,
      remainingBudget,
      burnRatePercent,
      items: activeItems,
    };
  }, [activeItems, budgetScenario, customReductionPct, selectedMonth, getBranchSpentForMonth, monthlyDatasets]);

  // Dynamic growth / KPI scenarios calculated directly from Google Sheet / plan file data
  const dynamicPlanBudgets = useMemo(() => {
    // 1. Base monthly budget (+VAT) from current file/sheet data
    const baseBudget = currentSummary.totalMonthlyVat > 0 
      ? currentSummary.totalMonthlyVat 
      : (currentSummary.totalMonthly > 0 ? currentSummary.totalMonthly : 1250000000);

    // 2. Reduced 30% (+VAT) directly from file column or 70% of base
    const reduced30Budget = currentSummary.totalReduced30Vat > 0 
      ? currentSummary.totalReduced30Vat 
      : Math.round(baseBudget * 0.7);

    // 3. Reduced Extra 30% (+VAT) directly from file column or 70% of reduced 30%
    const reduced60Budget = currentSummary.totalReducedExtra30Vat > 0 
      ? currentSummary.totalReducedExtra30Vat 
      : Math.round(reduced30Budget * 0.7);

    // Mức Gốc KPI:
    // Nếu ngân sách >= 1.25 Tỷ: KPI Doanh thu là 7.5 Tỷ (hoặc cao hơn nếu theo 15% CIR = baseBudget / 0.15)
    // Nếu ngân sách < 1.25 Tỷ (ví dụ Tháng 9 là 867.8 Tr): Tự động tính KPI Doanh thu theo chuẩn Chi phí <= 15% DT (tức KPI DT = baseBudget / 0.15, ROAS = 6.67x)
    let baseTargetRevenue = 7500000000;
    let baseRoas = 6.0;
    let baseCir = 16.7;

    if (baseBudget < 1125000000) {
      // Khi ngân sách thấp hơn ngưỡng (chi phí < 1.125 - 1.25 Tỷ), để đảm bảo chi phí <= 15% DT thì KPI DT = baseBudget / 15%
      baseTargetRevenue = Math.round(baseBudget / 0.15);
      baseRoas = 6.67;
      baseCir = 15.0;
    } else {
      baseRoas = Math.round((baseTargetRevenue / baseBudget) * 10) / 10;
      baseCir = Math.round((baseBudget / baseTargetRevenue) * 1000) / 10;
    }

    // Kịch bản Giảm 30%: Giữ ROAS 6.67x (Chi phí <= 15% Doanh thu)
    const reduced30TargetRevenue = Math.round(reduced30Budget / 0.15);

    // Kịch bản Giảm tiếp 30%: Giữ ROAS 6.67x (Chi phí <= 15% Doanh thu)
    const reduced60TargetRevenue = Math.round(reduced60Budget / 0.15);

    return {
      baseBudget,
      baseTargetRevenue,
      baseRoas,
      baseCir,
      reduced30Budget,
      reduced30TargetRevenue,
      reduced60Budget,
      reduced60TargetRevenue,
    };
  }, [currentSummary]);

  const applyScenario = useCallback((type: 'kpi125_75' | 'reduce30' | 'reduce60') => {
    setActiveScenario(type);
    if (type === 'kpi125_75') {
      setTotalBudget(dynamicPlanBudgets.baseBudget);
      setTargetRoas(dynamicPlanBudgets.baseRoas);
    } else if (type === 'reduce30') {
      setTotalBudget(dynamicPlanBudgets.reduced30Budget);
      setTargetRoas(6.67);
    } else if (type === 'reduce60') {
      setTotalBudget(dynamicPlanBudgets.reduced60Budget);
      setTargetRoas(6.67);
    }
  }, [dynamicPlanBudgets]);

  // Auto-sync totalBudget & targetRoas when file data changes while a preset is active
  useEffect(() => {
    if (activeScenario === 'kpi125_75') {
      setTotalBudget(dynamicPlanBudgets.baseBudget);
      setTargetRoas(dynamicPlanBudgets.baseRoas);
    } else if (activeScenario === 'reduce30') {
      setTotalBudget(dynamicPlanBudgets.reduced30Budget);
      setTargetRoas(6.67);
    } else if (activeScenario === 'reduce60') {
      setTotalBudget(dynamicPlanBudgets.reduced60Budget);
      setTargetRoas(6.67);
    }
  }, [dynamicPlanBudgets, activeScenario]);

  // Month pills summary stats (Total spent per month)
  const monthTabSummaries = useMemo(() => {
    return MONTH_TABS.map((tab) => {
      let spent = 0;
      const mNum = tab.monthNum;
      const isAvailableInSheet = mNum === 6 || mNum === 7 || mNum === 8;
      const planForTab = multiMonthPlan.monthPlans[mNum];

      if (tab.id === 'all') {
        const datasetSum = (monthlyDatasets || []).reduce((sum, m) => sum + (m.regions || []).reduce((rSum, r) => rSum + (r.costVAT || 0), 0), 0);
        spent = datasetSum > 0 ? datasetSum : activeItems.reduce((s, i) => s + getBranchSpentForMonth(i, 'all'), 0);
      } else {
        const targetDataset = (monthlyDatasets || []).find((m) => m.month === tab.monthNum);
        if (targetDataset && targetDataset.regions && targetDataset.regions.length > 0) {
          spent = targetDataset.regions.reduce((acc, r) => acc + (r.costVAT || 0), 0);
        } else {
          spent = activeItems.reduce((s, i) => s + getBranchSpentForMonth(i, tab.id), 0);
        }
      }

      const planVatBudget = planForTab?.totalMonthlyVat || 0;
      const limit = planVatBudget || currentSummary.activeScenarioTotalBudget;
      const isOver = spent > limit && limit > 0;

      return {
        ...tab,
        spent,
        isOver,
        hasData: spent > 0,
        hasSheetPlan: isAvailableInSheet,
        sheetPlanBudget: planVatBudget,
        planTitle: planForTab?.title,
      };
    });
  }, [activeItems, getBranchSpentForMonth, currentSummary.activeScenarioTotalBudget, multiMonthPlan, monthlyDatasets]);

  // Filtered branch items based on effective limit & active month's spent
  const filteredBranchItems = useMemo(() => {
    let list = activeItems;

    if (sheetSearchTerm.trim()) {
      const term = sheetSearchTerm.toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(term));
    }

    if (statusFilter === 'over_budget') {
      list = list.filter((item) => {
        const spent = getBranchSpentForMonth(item, selectedMonth);
        const limit = getBranchEffectiveLimit(item);
        return limit > 0 && spent > limit;
      });
    } else if (statusFilter === 'within_budget') {
      list = list.filter((item) => {
        const spent = getBranchSpentForMonth(item, selectedMonth);
        const limit = getBranchEffectiveLimit(item);
        return limit === 0 || spent <= limit;
      });
    }

    return list;
  }, [activeItems, sheetSearchTerm, statusFilter, getBranchEffectiveLimit, getBranchSpentForMonth, selectedMonth]);

  // Simulation calculations
  const targetRevenue = useMemo(() => totalBudget * targetRoas, [totalBudget, targetRoas]);
  const costRevenueRatio = useMemo(() => (targetRevenue > 0 ? (totalBudget / targetRevenue) * 100 : 0), [totalBudget, targetRevenue]);

  const serviceCalculations = useMemo(() => {
    // 1. Tính toán trọng số doanh thu của từng dịch vụ từ các chỉ số phễu cốt lõi
    const rawWeights = services.map((svc) => {
      const cpa = svc.expectedCpa > 0 ? svc.expectedCpa : 500000;
      const weight = (svc.sharePercent / 100) * (svc.conversionRate / 100) * (svc.avgOrderValue / cpa);
      return Math.max(0.001, weight);
    });
    const totalWeight = rawWeights.reduce((sum, w) => sum + w, 0) || 1;

    let accumulatedRevenue = 0;

    return services.map((svc, index) => {
      const budget = (totalBudget * svc.sharePercent) / 100;
      const leads = svc.expectedCpa > 0 ? Math.round(budget / svc.expectedCpa) : 0;
      
      // Doanh thu mục tiêu từng dịch vụ phân bổ chuẩn theo KPI Target của kịch bản
      let revenue = 0;
      if (index === services.length - 1) {
        revenue = Math.max(0, targetRevenue - accumulatedRevenue);
      } else {
        const weightShare = rawWeights[index] / totalWeight;
        revenue = Math.round(targetRevenue * weightShare);
        accumulatedRevenue += revenue;
      }

      const closedDeals = svc.avgOrderValue > 0 ? Math.round(revenue / svc.avgOrderValue) : 0;
      const roas = budget > 0 ? (revenue / budget).toFixed(1) : '0.0';
      return {
        ...svc,
        budget,
        leads,
        closedDeals,
        revenue,
        roas,
      };
    });
  }, [services, totalBudget, targetRevenue]);

  const totalProjectedLeads = useMemo(() => serviceCalculations.reduce((sum, s) => sum + s.leads, 0), [serviceCalculations]);
  const totalProjectedDeals = useMemo(() => serviceCalculations.reduce((sum, s) => sum + s.closedDeals, 0), [serviceCalculations]);
  const calculatedTotalRevenueFromServices = useMemo(() => serviceCalculations.reduce((sum, s) => sum + s.revenue, 0), [serviceCalculations]);
  const avgForecastCpa = useMemo(() => (totalProjectedLeads > 0 ? Math.round(totalBudget / totalProjectedLeads) : 0), [totalBudget, totalProjectedLeads]);

  // AI Gemini Forecast
  const handleRunAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setAiReport(null);

    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiReport(`### 🎯 BÁO CÁO TIẾN ĐỘ & DỰ BÁO NGÂN SÁCH CHI NHÁNH (AI GEMINI)

1. **Tổng Quan Tiến Độ Toàn Hệ Thống**:
   - Tổng hạn mức kịch bản: **${formatVND(currentSummary.totalMonthly, 'full')}** (17 Chi Nhánh).
   - Chi phí thực tế đã giải ngân: **${formatVND(currentSummary.totalSpent, 'full')}** (Vượt trần **${formatVND(Math.abs(currentSummary.remainingBudget), 'full')}**).
   - Trạng thái Burn-rate: **Cảnh Báo Vượt Trần (${currentSummary.burnRatePercent.toFixed(1)}%)**.

2. **Chi Nhánh Cần Kiểm Soát Khẩn Cấp (Over-Budget Alert)**:
   - **Đà Nẵng**: Chi 54.9M đ / Hạn mức 27.0M đ (+204%). Cần rà soát ngay chiến dịch PMax và chi phí giá thầu từ khóa.
   - **Đồng Tháp**: Chi 18.3M đ / Hạn mức 6.0M đ (+305%).
   - **Bình Dương**: Chi 52.2M đ / Hạn mức 42.0M đ (+124%).
   - **Bình Phước**: Đang chi 20.3M đ nhưng chưa được duyệt hạn mức chính thức trong kế hoạch gốc.

3. **Khuyến Nghị Tối Ưu Hóa**:
   - Kích hoạt **Phương án Giảm 30%** đối với các cơ sở vệ tinh miền Tây để đưa tổng chi phí toàn hệ thống về ngưỡng an toàn < 1.050.000.000 đ.
   - Dồn ngân sách trọng điểm cho Implant tại TP.HCM và Khách Kiều Bào để bù đắp doanh thu.`);
    }, 1200);
  };

  const handleCopySummary = () => {
    const text = `📊 BÁO CÁO TIẾN ĐỘ & DỰ TOÁN NGÂN SÁCH 17 CHI NHÁNH
━━━━━━━━━━━━━━━━━━━━━━━━━━
- Tổng Hạn Mức Kịch Bản: ${formatVND(currentSummary.totalMonthly, 'full')} (17 Chi Nhánh)
- Ngân Sách Ngày Toàn Hệ Thống: ${formatVND(currentSummary.totalDaily, 'full')} (TB ${formatVND(currentSummary.avgDailyPerLocation, 'full')} / cơ sở / ngày)
- Chi Phí Thực Tế (Tháng 1): ${formatVND(currentSummary.totalSpent, 'full')}
- Ngân Sách Còn Lại: ${formatVND(currentSummary.remainingBudget, 'full')}
- Trạng Thái Burn-Rate: ${currentSummary.burnRatePercent > 100 ? '⚠️ Cảnh Báo Vượt Trần (' + currentSummary.burnRatePercent.toFixed(1) + '%)' : '✅ Trong Hạn Mức (' + currentSummary.burnRatePercent.toFixed(1) + '%)'}
━━━━━━━━━━━━━━━━━━━━━━━━━━
* Các Chi Nhánh Vượt Hạn Mức:
${activeItems
  .filter((i) => (i.spentThisMonth || 0) > i.monthlyBudget && i.monthlyBudget > 0)
  .map((i) => `  + ${i.name}: ${formatVND(i.spentThisMonth || 0, 'full')} / Hạn mức ${formatVND(i.monthlyBudget, 'full')} (${Math.round(((i.spentThisMonth || 0) / i.monthlyBudget) * 100)}%)`)
  .join('\n')}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const overBudgetCount = activeItems.filter((i) => (i.spentThisMonth || 0) > i.monthlyBudget && i.monthlyBudget > 0).length;
  const withinBudgetCount = activeItems.length - overBudgetCount;

  const handleSelectMonthTab = (tabId: string, monthNum: number) => {
    setSelectedMonth(tabId);
    if (onSelectMonth) {
      if (tabId === 'all') {
        onSelectMonth('all');
      } else if (monthNum > 0) {
        onSelectMonth(monthNum);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* 0. BỘ CHỌN & CHIA THEO TỪNG THÁNG (MONTH SELECTOR BAR) */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Chia & Theo Dõi Ngân Sách Từng Tháng
            </span>
            <span className="text-[11px] px-3 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-extrabold border border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.3)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#fbbf24]" />
              {selectedMonth === 'all'
                ? 'Tổng Hợp Cả Năm (Lũy kế)'
                : `Đang Xem: ${MONTH_TABS.find((t) => t.id === selectedMonth)?.label || `Tháng ${new Date().getMonth() + 1}`}`}
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" /> An toàn
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(244,63,94,0.8)]" /> Vượt hạn mức
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-600" /> Chưa có dữ liệu
            </span>
          </div>
        </div>

        {/* 10 Month Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-1">
          {monthTabSummaries.map((tab) => {
            const isSelected = selectedMonth === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleSelectMonthTab(tab.id, tab.monthNum)}
                className={`p-2.5 rounded-xl border text-left transition-all duration-300 relative flex flex-col justify-between cursor-pointer overflow-hidden ${
                  isSelected
                    ? 'month-tab-border-glow bg-slate-900/90 border-2 border-amber-400 ring-2 ring-amber-400/40 shadow-[0_0_18px_rgba(251,191,36,0.6),inset_0_0_10px_rgba(251,191,36,0.06)] scale-[1.03] -translate-y-0.5 z-20'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700 hover:scale-[1.02]'
                }`}
              >
                {/* Luminous Top Beacon for the Active Month Tab */}
                {isSelected && (
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-amber-400 shadow-[0_0_10px_#fbbf24] z-30" />
                )}

                <div className="flex items-center justify-between z-20 relative">
                  <span
                    className={`text-xs font-black transition-all ${
                      isSelected
                        ? 'text-amber-400 text-[13px] tracking-tight drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                        : 'text-slate-200'
                    }`}
                  >
                    {tab.short}
                  </span>
                  <div className="flex items-center gap-1">
                    <span
                      className={`w-2.5 h-2.5 rounded-full transition-all ${
                        !tab.hasData
                          ? 'bg-slate-600'
                          : tab.isOver
                          ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.9)]'
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]'
                      }`}
                    />
                  </div>
                </div>

                <div className="mt-1 font-mono text-[11px] font-bold truncate z-20 relative">
                  {tab.hasData ? (
                    <span
                      className={`transition-all ${
                        isSelected
                          ? 'text-white font-black text-xs'
                          : tab.isOver
                          ? 'text-rose-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {formatVND(tab.spent, 'million')}
                    </span>
                  ) : (
                    <span className={isSelected ? 'text-slate-400 font-bold' : 'text-slate-600 font-normal'}>--</span>
                  )}
                </div>

                <div className="mt-0.5 text-[9px] truncate z-20 relative">
                  {tab.hasSheetPlan ? (
                    <span
                      className={`font-mono transition-all ${
                        isSelected
                          ? 'text-amber-300 font-bold'
                          : 'text-amber-400/80'
                      }`}
                    >
                      Plan {formatVND(tab.sheetPlanBudget, 'million')}
                    </span>
                  ) : tab.id === 'all' ? (
                    <span className={isSelected ? 'text-cyan-300 font-bold' : 'text-cyan-400/80'}>Cả năm</span>
                  ) : (
                    <span className={isSelected ? 'text-slate-400 font-medium' : 'text-slate-600'}>Chưa có KH</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 1. TOP KPI METRIC ROW - DYNAMICALLY COMPUTED FOR SELECTED MONTH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng Hạn Mức Kịch Bản */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Tổng Hạn Mức Kế Hoạch (+VAT)</span>
            <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
              budgetScenario === 'base_100'
                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                : budgetScenario === 'reduced_30'
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                : budgetScenario === 'reduced_extra_30'
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
            }`}>
              {currentSummary.activeScenarioTotalBudget > 0
                ? (budgetScenario === 'base_100' ? '17 Chi Nhánh (100%)' : currentSummary.scenarioLabel)
                : 'Chờ cập nhật'}
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-mono">
              {currentSummary.activeScenarioTotalBudget > 0
                ? formatVND(currentSummary.activeScenarioTotalBudget, 'full')
                : '--'}
            </div>
            <div className="text-xs text-slate-400 mt-1.5 flex flex-col gap-0.5">
              {currentSummary.activeScenarioTotalBudget > 0 ? (
                budgetScenario === 'base_100' ? (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Gốc (Chưa VAT):</span>
                    <span className="font-mono text-cyan-300 font-bold">{formatVND(currentSummary.totalMonthly, 'full')}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>{currentSummary.scenarioLabel}</span>
                    <span className="text-slate-500 line-through font-mono text-[11px]">
                      VAT Gốc: {formatVND(currentSummary.totalMonthlyVat, 'million')}
                    </span>
                  </div>
                )
              ) : (
                <div className="flex items-center justify-between text-slate-500">
                  <span>Chờ cập nhật kế hoạch từ file</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Card 2: Ngân Sách Ngày Toàn Hệ Thống */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Ngân Sách Ngày Toàn Hệ Thống</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">
              {currentSummary.totalDaily > 0
                ? formatVND(
                    budgetScenario === 'reduced_30'
                      ? Math.round(currentSummary.totalDaily * 0.7)
                      : budgetScenario === 'reduced_extra_30'
                      ? Math.round(currentSummary.totalDaily * 0.49)
                      : budgetScenario === 'custom'
                      ? Math.round(currentSummary.totalDaily * ((100 - customReductionPct) / 100))
                      : currentSummary.totalDaily,
                    'full'
                  )
                : '--'}
            </div>
            <div className="text-xs text-slate-400 mt-1.5 flex items-center justify-between">
              {currentSummary.totalDaily > 0 ? (
                <>
                  <span>
                    {selectedMonth === 'all' ? '365 ngày (Cả Năm)' : `${currentMonthDays} ngày`} = {formatVND(currentSummary.totalMonthly, 'million')}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    TB: ~{formatVND(currentSummary.avgDailyPerLocation, 'million')}/cơ sở
                  </span>
                </>
              ) : (
                <span className="text-slate-500">Chờ cập nhật từ file</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 3: Chi Phí (VAT) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Chi Phí (VAT)</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30">
              {selectedMonth === 'all' ? 'Lũy Kế Cả Năm' : `Thực Chi ${MONTH_TABS.find((t) => t.id === selectedMonth)?.label || ''}`}
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {currentSummary.totalSpent > 0 ? formatVND(currentSummary.totalSpent, 'full') : (hasPlanDataForSelectedMonth ? '0 đ' : '--')}
            </div>
            <div className="text-xs text-slate-400 mt-1.5 flex items-center justify-between">
              {currentSummary.activeScenarioTotalBudget > 0 ? (
                <>
                  <span>Chênh lệch (+VAT):</span>
                  <span className={`font-bold font-mono ${currentSummary.remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {currentSummary.remainingBudget < 0 ? '-' : '+'}
                    {formatVND(Math.abs(currentSummary.remainingBudget), 'full')}
                  </span>
                </>
              ) : (
                <span className="text-slate-500">Chờ kế hoạch đối soát</span>
              )}
            </div>
          </div>
        </div>

        {/* Card 4: Trạng Thái Burn-Rate */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between min-h-[145px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Trạng Thái Burn-Rate</span>
            <ShieldCheck className={`w-4 h-4 ${
              currentSummary.activeScenarioTotalBudget === 0
                ? 'text-slate-500'
                : currentSummary.burnRatePercent > 100
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`} />
          </div>
          <div className="mt-2 space-y-2">
            <div className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-1.5 ${
              currentSummary.activeScenarioTotalBudget === 0
                ? 'text-slate-400'
                : currentSummary.burnRatePercent > 100
                ? 'text-rose-400'
                : 'text-emerald-400'
            }`}>
              <span>
                {currentSummary.activeScenarioTotalBudget === 0
                  ? '⏳ Chờ Cập Nhật'
                  : currentSummary.burnRatePercent > 100
                  ? `⚠️ Vượt Trần (${currentSummary.burnRatePercent.toFixed(1)}%)`
                  : `✅ An Toàn (${currentSummary.burnRatePercent.toFixed(1)}%)`}
              </span>
            </div>
            {/* Progress Bar (thick gradient) */}
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className={`h-full rounded-full transition-all ${
                  currentSummary.activeScenarioTotalBudget === 0
                    ? 'bg-slate-800'
                    : currentSummary.burnRatePercent > 100
                    ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500'
                    : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                }`}
                style={{ width: `${currentSummary.activeScenarioTotalBudget === 0 ? 0 : Math.min(100, currentSummary.burnRatePercent)}%` }}
              />
            </div>
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Đã chi: {currentSummary.totalSpent > 0 ? formatVND(currentSummary.totalSpent, 'million') : '0 đ'}</span>
              <span>Hạn mức: {currentSummary.activeScenarioTotalBudget > 0 ? formatVND(currentSummary.activeScenarioTotalBudget, 'million') : '--'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. KỊCH BẢN GIẢM CHI PHÍ & ĐIỀU HƯỚNG TỐI ƯU (SCENARIO SELECTOR BAR) */}
      <div className="p-4.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              Kịch Bản Giảm Chi Phí & Hạn Mức Tối Ưu Hệ Thống
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-bold border border-amber-500/30">
              Tự Động Áp Dụng Cho Tất Cả Chi Nhánh
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Chuyển nhanh hạn mức mục tiêu để kiểm tra tỷ lệ vượt trần của từng chi nhánh
          </span>
        </div>

        {/* Scenario Quick Buttons - Dynamically hide reductions if month does not have them */}
        <div className={`grid gap-2.5 ${
          hasReduced30 && hasReducedExtra30
            ? 'grid-cols-2 md:grid-cols-4'
            : (hasReduced30 || hasReducedExtra30)
            ? 'grid-cols-1 sm:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2'
        }`}>
          {/* Scenario 1: 100% Gốc */}
          <button
            onClick={() => setBudgetScenario('base_100')}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
              budgetScenario === 'base_100'
                ? 'bg-amber-500/15 border-amber-400 text-white shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                100% Kế Hoạch (+VAT)
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                Chuẩn
              </span>
            </div>
            <div className="mt-2 font-mono font-black text-sm text-amber-400">
              {(currentSummary.totalMonthlyVat || currentSummary.totalMonthly) > 0
                ? formatVND(currentSummary.totalMonthlyVat || currentSummary.totalMonthly, 'full')
                : '--'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
              <span>Gốc (Chưa VAT):</span>
              <span className="font-mono text-cyan-300 font-bold">
                {currentSummary.totalMonthly > 0 ? formatVND(currentSummary.totalMonthly, 'million') : '--'}
              </span>
            </div>
          </button>

          {/* Scenario 2: Giảm 30% (Chỉ hiện khi tháng có cột Giảm 30%) */}
          {hasReduced30 && (
            <button
              onClick={() => setBudgetScenario('reduced_30')}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                budgetScenario === 'reduced_30'
                  ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400/50'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Kịch Bản Giảm 30%
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold">
                  -30%
                </span>
              </div>
              <div className="mt-2 font-mono font-black text-sm text-cyan-400">
                {currentSummary.totalReduced30Vat > 0
                  ? formatVND(currentSummary.totalReduced30Vat, 'full')
                  : (currentSummary.totalReduced30 > 0 ? formatVND(currentSummary.totalReduced30, 'full') : '--')}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {(currentSummary.totalMonthlyVat || currentSummary.totalMonthly) > 0 && currentSummary.totalReduced30Vat > 0
                  ? `Tiết kiệm ${formatVND((currentSummary.totalMonthlyVat || currentSummary.totalMonthly) - currentSummary.totalReduced30Vat, 'million')} (+VAT)`
                  : 'Chờ cập nhật'}
              </div>
            </button>
          )}

          {/* Scenario 3: Giảm thêm 30% (tổng giảm 51% - Chỉ hiện khi tháng có cột Giảm thêm 30%) */}
          {hasReducedExtra30 && (
            <button
              onClick={() => setBudgetScenario('reduced_extra_30')}
              className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer ${
                budgetScenario === 'reduced_extra_30'
                  ? 'bg-emerald-500/15 border-emerald-400 text-white shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/50'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Giảm Thêm 30% (-51%)
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  -51%
                </span>
              </div>
              <div className="mt-2 font-mono font-black text-sm text-emerald-400">
                {currentSummary.totalReducedExtra30Vat > 0
                  ? formatVND(currentSummary.totalReducedExtra30Vat, 'full')
                  : (currentSummary.totalReducedExtra30 > 0 ? formatVND(currentSummary.totalReducedExtra30, 'full') : '--')}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {(currentSummary.totalMonthlyVat || currentSummary.totalMonthly) > 0 && currentSummary.totalReducedExtra30Vat > 0
                  ? `Tiết kiệm ${formatVND((currentSummary.totalMonthlyVat || currentSummary.totalMonthly) - currentSummary.totalReducedExtra30Vat, 'million')} (+VAT)`
                  : 'Chờ cập nhật'}
              </div>
            </button>
          )}

          {/* Scenario 4: Tùy Chỉnh % Giảm */}
          <div
            className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
              budgetScenario === 'custom'
                ? 'bg-purple-500/15 border-purple-400 text-white shadow-lg shadow-purple-500/10 ring-1 ring-purple-400/50'
                : 'bg-slate-950/60 border-slate-800/80 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setBudgetScenario('custom')}>
              <span className="text-xs font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                Tùy Chỉnh Giảm %
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                -{customReductionPct}%
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-2">
              <input
                type="range"
                min="5"
                max="70"
                step="5"
                value={customReductionPct}
                onChange={(e) => {
                  setCustomReductionPct(parseInt(e.target.value, 10));
                  setBudgetScenario('custom');
                }}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
              <span className="text-xs font-bold font-mono text-purple-400 shrink-0">
                {customReductionPct}%
              </span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Hạn mức: {(currentSummary.totalMonthlyVat || currentSummary.totalMonthly) > 0
                ? formatVND(Math.round((currentSummary.totalMonthlyVat || currentSummary.totalMonthly) * ((100 - customReductionPct) / 100)), 'million')
                : '--'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR & VIEW CONTROLS */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* View Mode Toggle: Cards Grid (default) vs Table View vs AI Simulation */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveViewMode('cards_grid')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewMode === 'cards_grid'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>Thẻ Tiến Độ Chi Nhánh</span>
          </button>

          <button
            onClick={() => setActiveViewMode('sheet_plan')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewMode === 'sheet_plan'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <TableIcon className="w-4 h-4" />
            <span>Bảng Đối Soát Chi Tiết</span>
          </button>

          <button
            onClick={() => setActiveViewMode('simulation')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeViewMode === 'simulation'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Mô Phỏng ROI & Dịch Vụ</span>
          </button>
        </div>

        {/* Search, Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search */}
          <div className="relative w-full sm:w-56">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm chi nhánh..."
              value={sheetSearchTerm}
              onChange={(e) => setSheetSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tất cả ({activeItems.length})
            </button>
            <button
              onClick={() => setStatusFilter('over_budget')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'over_budget' ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              Vượt ({filteredBranchItems.filter((i) => (i.spentThisMonth || 0) > getBranchEffectiveLimit(i) && getBranchEffectiveLimit(i) > 0).length})
            </button>
            <button
              onClick={() => setStatusFilter('within_budget')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'within_budget' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Chuẩn ({filteredBranchItems.filter((i) => (i.spentThisMonth || 0) <= getBranchEffectiveLimit(i) || getBranchEffectiveLimit(i) === 0).length})
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => loadBudgetSheet(sheetUrl)}
            disabled={isFetchingSheet}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-500/40 text-cyan-300 text-xs font-bold transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
            title="Nhấn để cập nhật ngay số liệu mới nhất từ file Google Sheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingSheet ? 'animate-spin' : ''}`} />
            <span>{isFetchingSheet ? 'Đang tải số mới...' : 'Đồng Bộ Ngay'}</span>
          </button>

          <button
            onClick={handleRunAiAnalysis}
            disabled={isAiAnalyzing}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <Bot className="w-3.5 h-3.5 text-cyan-300" />
            <span>AI Đánh Giá</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs transition-all active:scale-95"
            title="Sao chép báo cáo"
          >
            {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {/* REAL-TIME LIVE SYNC NOTIFICATION / STATUS PILL */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-300">
            Trạng Thái Dữ Liệu: <span className="text-emerald-400 font-bold">Thời Gian Thực (Real-time Live Sync)</span>
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400 font-mono">
            {multiMonthPlan.lastUpdated ? `Cập nhật lúc: ${multiMonthPlan.lastUpdated}` : syncStatusMsg || 'Vừa xong'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400">
          <span className="text-slate-400 text-[10px]">
            ⚡ Tự động quét lại mỗi 30s hoặc khi bạn quay lại tab này sau khi chỉnh Google Sheet
          </span>
        </div>
      </div>

      {/* 3. AI GEMINI REPORT MODAL / ACCORDION */}
      {aiReport && (
        <div className="p-6 rounded-3xl bg-slate-900 border border-indigo-500/40 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>Báo Cáo Đánh Giá Tiến Độ & Rủi Ro Ngân Sách (Gemini AI)</span>
            </div>
            <button
              onClick={() => setAiReport(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ Đóng
            </button>
          </div>
          <div className="text-xs sm:text-sm text-slate-200 whitespace-pre-line leading-relaxed font-sans pt-2 border-t border-indigo-500/20">
            {aiReport}
          </div>
        </div>
      )}

      {/* VIEW MODE 1: BRANCH PROGRESS CARDS GRID (WITH FULL REDUCTION SCENARIOS) */}
      {activeViewMode === 'cards_grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300">
                Tiến độ chi tiêu:{' '}
                <span className="text-amber-400 font-mono">
                  {selectedMonth === 'all'
                    ? 'Tổng Hợp Lũy Kế 9 Tháng'
                    : MONTH_TABS.find((t) => t.id === selectedMonth)?.label || 'Tháng 1'}
                </span>
              </span>
              <span className="text-[11px] text-slate-500">
                ({filteredBranchItems.length} chi nhánh)
              </span>
            </div>

            <div className="text-xs text-slate-400">
              Mẹo: Nhấp vào các tab tháng ở trên để xem tiến độ từng tháng
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {filteredBranchItems.map((item) => {
              const spent = getBranchSpentForMonth(item, selectedMonth);
              const effectiveLimit = getBranchEffectiveLimit(item);
              const baseLimit = item.monthlyBudget;
              const usedPct = effectiveLimit > 0 ? (spent / effectiveLimit) * 100 : (spent > 0 ? 999 : 0);
              const isOverBudget = effectiveLimit > 0 && spent > effectiveLimit;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl bg-slate-900 border p-5 shadow-lg flex flex-col justify-between transition-all group ${
                    isOverBudget
                      ? 'border-rose-500/40 hover:border-rose-500/70 shadow-rose-950/20'
                      : 'border-slate-800/90 hover:border-slate-700/90'
                  }`}
                >
                  <div>
                    {/* Card Header: Dot + Name (Left), Badge (Right) */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-2 h-2 rounded-full shrink-0 shadow-[0_0_8px] ${
                          isOverBudget
                            ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.8)]'
                            : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]'
                        }`} />
                        <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                          {item.name}
                        </h4>
                      </div>

                      {isOverBudget ? (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-rose-950/50 text-rose-300 border border-rose-500/40 flex items-center gap-1">
                          ✕ Vượt {Math.round(usedPct - 100)}%
                        </span>
                      ) : effectiveLimit > 0 ? (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-950/50 text-emerald-300 border border-emerald-500/30">
                          Đã dùng {Math.round(usedPct)}%
                        </span>
                      ) : (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                          Chưa phân bổ
                        </span>
                      )}
                    </div>

                    {/* Progress Bar (Teal or Rose) */}
                    <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mt-3 mb-2 border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isOverBudget
                            ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                            : 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.7)]'
                        }`}
                        style={{ width: `${Math.min(100, usedPct)}%` }}
                      />
                    </div>

                    {/* Under Progress Bar Row: Spent (Left) vs Effective Limit (Right) */}
                    <div className="flex items-center justify-between text-xs mb-3 font-sans">
                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">Chi Phí (VAT):</span>
                        <span
                          className={`font-mono font-bold ${
                            isOverBudget ? 'text-rose-400' : 'text-teal-400'
                          }`}
                        >
                          {spent > 0 ? formatVND(spent, 'full') : (effectiveLimit > 0 ? '0 đ' : '--')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">
                          {budgetScenario === 'base_100' ? 'Hạn mức:' : 'Hạn mức mục tiêu:'}
                        </span>
                        <span className={`font-mono font-bold ${effectiveLimit > 0 ? (budgetScenario !== 'base_100' ? 'text-cyan-300' : 'text-amber-400') : 'text-slate-500'}`}>
                          {effectiveLimit > 0 ? formatVND(effectiveLimit, 'full') : '--'}
                        </span>
                      </div>
                    </div>

                    {/* Scenario Details Box - Only render reduction blocks if present in month */}
                    <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans">
                      <div>
                        <div className="text-[11px] text-slate-400">NS Ngày (Gốc):</div>
                        <div className="font-mono font-bold text-cyan-300 text-xs sm:text-[13px] mt-0.5">
                          {item.dailyBudget > 0 ? formatVND(item.dailyBudget, 'full') : '--'}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-400 flex items-center justify-between">
                          <span>Kế Hoạch (+VAT):</span>
                          {budgetScenario === 'base_100' && (item.monthlyBudgetVat || item.monthlyBudget) > 0 && (
                            <span className="text-[9px] px-1 bg-amber-500/20 text-amber-300 rounded font-bold">Đang xem</span>
                          )}
                        </div>
                        <div className="font-mono font-bold text-amber-400 text-xs sm:text-[13px] mt-0.5">
                          {(item.monthlyBudgetVat || item.monthlyBudget) > 0
                            ? formatVND(item.monthlyBudgetVat || item.monthlyBudget, 'full')
                            : '--'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {item.monthlyBudget > 0 ? `Gốc: ${formatVND(item.monthlyBudget, 'million')}` : 'Chờ cập nhật'}
                        </div>
                      </div>

                      {hasReduced30 && (
                        <div className={budgetScenario === 'reduced_30' ? 'p-1.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 -m-1' : ''}>
                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Giảm 30% (+VAT):</span>
                            {budgetScenario === 'reduced_30' && (item.monthlyBudgetVat || item.monthlyBudget) > 0 && (
                              <span className="text-[9px] px-1 bg-cyan-500/20 text-cyan-300 rounded font-bold">Đang áp dụng</span>
                            )}
                          </div>
                          <div className="font-mono font-bold text-cyan-300 text-xs sm:text-[13px] mt-0.5">
                            {item.reduced30Vat > 0
                              ? formatVND(item.reduced30Vat, 'full')
                              : (item.reduced30Budget > 0 ? formatVND(item.reduced30Budget, 'full') : '--')}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.reduced30Budget > 0
                              ? `Gốc: ${formatVND(item.reduced30Budget, 'million')}`
                              : 'Chờ cập nhật'}
                          </div>
                        </div>
                      )}

                      {hasReducedExtra30 && (
                        <div className={budgetScenario === 'reduced_extra_30' ? 'p-1.5 rounded-lg bg-emerald-950/30 border border-emerald-500/30 -m-1' : ''}>
                          <div className="text-[11px] text-slate-400 flex items-center justify-between">
                            <span>Giảm Thêm 30% (-51%):</span>
                            {budgetScenario === 'reduced_extra_30' && (item.monthlyBudgetVat || item.monthlyBudget) > 0 && (
                              <span className="text-[9px] px-1 bg-emerald-500/20 text-emerald-300 rounded font-bold">Đang áp dụng</span>
                            )}
                          </div>
                          <div className="font-mono font-bold text-emerald-300 text-xs sm:text-[13px] mt-0.5">
                            {item.reducedExtra30Vat > 0
                              ? formatVND(item.reducedExtra30Vat, 'full')
                              : (item.reducedExtra30Budget > 0 ? formatVND(item.reducedExtra30Budget, 'full') : '--')}
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {item.reducedExtra30Budget > 0
                              ? `Gốc: ${formatVND(item.reducedExtra30Budget, 'million')}`
                              : 'Chờ cập nhật'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer Row: Scenario Limit info (Left), Button Edit (Right) */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80">
                    <div className="text-xs flex items-center gap-1.5 truncate">
                      <span className="text-slate-400 shrink-0">
                        {budgetScenario === 'base_100' ? 'Hạn mức gốc:' : 'Hạn mức kịch bản:'}
                      </span>
                      <span className={`font-mono font-bold ${
                        budgetScenario === 'reduced_30'
                          ? 'text-cyan-300'
                          : budgetScenario === 'reduced_extra_30'
                          ? 'text-emerald-300'
                          : budgetScenario === 'custom'
                          ? 'text-purple-300'
                          : 'text-amber-400'
                      }`}>
                        {effectiveLimit > 0 ? formatVND(effectiveLimit, 'full') : '--'}
                      </span>
                      {budgetScenario !== 'base_100' && baseLimit > 0 && (
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          ({formatVND(baseLimit, 'million')})
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/50 transition-all cursor-pointer flex items-center gap-1 shadow-sm shrink-0"
                    >
                      <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                      <span>Sửa Ngân Sách</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: DETAILED SPREADSHEET TABLE */}
      {activeViewMode === 'sheet_plan' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Bảng Phân Bổ Ngân Sách & Đối Soát 17 Chi Nhánh
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Xem chi tiết từng tháng hoặc bảng ma trận toàn diện 9 tháng đối chiếu với định mức kế hoạch.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sub Mode Toggle */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setTableSubMode('single_month')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    tableSubMode === 'single_month'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Đối Soát {selectedMonth === 'all' ? 'Tất Cả' : MONTH_TABS.find((t) => t.id === selectedMonth)?.short || 'T1'}
                </button>
                <button
                  onClick={() => setTableSubMode('all_months_matrix')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    tableSubMode === 'all_months_matrix'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Ma Trận 9 Tháng (T1 - T9)
                </button>
              </div>

              <a
                href={sheetUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-medium underline underline-offset-4"
              >
                <span>Google Sheets</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* TABLE SUB-MODE 1: SINGLE MONTH DETAILED BREAKDOWN */}
          {tableSubMode === 'single_month' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 font-bold">
                    <th className="py-3.5 px-3">STT</th>
                    <th className="py-3.5 px-3">Chi Nhánh / Thị Trường</th>
                    <th className="py-3.5 px-3 text-right">Ngân Sách Ngày</th>
                    <th className="py-3.5 px-3 text-right">Kế Hoạch Tháng (Gốc)</th>
                    <th className="py-3.5 px-3 text-right text-amber-400">Kế Hoạch (+VAT)</th>
                    {hasReduced30 && <th className="py-3.5 px-3 text-right text-cyan-400">Giảm 30% (+VAT)</th>}
                    {hasReducedExtra30 && <th className="py-3.5 px-3 text-right text-emerald-400">Giảm Thêm 30% (+VAT)</th>}
                    <th className="py-3.5 px-3 text-right text-purple-300">
                      Thực Chi ({selectedMonth === 'all' ? 'Cả Năm' : MONTH_TABS.find((t) => t.id === selectedMonth)?.short})
                    </th>
                    <th className="py-3.5 px-3 text-center">Tiến Độ Giải Ngân</th>
                    <th className="py-3.5 px-3 text-center">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredBranchItems.map((item, idx) => {
                    const spent = getBranchSpentForMonth(item, selectedMonth);
                    const effectiveLimit = getBranchEffectiveLimit(item);
                    const pacing = effectiveLimit > 0 ? (spent / effectiveLimit) * 100 : 0;
                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                          <span>{item.name}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-300">
                          {item.dailyBudget > 0 ? formatVND(item.dailyBudget, 'million') : '--'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {item.monthlyBudget > 0 ? formatVND(item.monthlyBudget, 'million') : '--'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                          {item.monthlyBudgetVat > 0 ? formatVND(item.monthlyBudgetVat, 'million') : '--'}
                        </td>
                        {hasReduced30 && (
                          <td className="py-3 px-3 text-right font-mono text-cyan-300">
                            {item.reduced30Vat > 0
                              ? formatVND(item.reduced30Vat, 'million')
                              : (item.reduced30Budget > 0 ? formatVND(item.reduced30Budget, 'million') : '--')}
                          </td>
                        )}
                        {hasReducedExtra30 && (
                          <td className="py-3 px-3 text-right font-mono text-emerald-300">
                            {item.reducedExtra30Vat > 0
                              ? formatVND(item.reducedExtra30Vat, 'million')
                              : (item.reducedExtra30Budget > 0 ? formatVND(item.reducedExtra30Budget, 'million') : '--')}
                          </td>
                        )}
                        <td className="py-3 px-3 text-right font-mono font-bold text-purple-300">
                          {spent > 0 ? formatVND(spent, 'million') : (effectiveLimit > 0 ? '0' : '--')}
                        </td>
                        <td className="py-3 px-3 text-center font-mono">
                          {effectiveLimit > 0 ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                pacing > 100
                                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                  : pacing >= 70
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              }`}
                            >
                              {pacing.toFixed(1)}%
                            </span>
                          ) : (
                            <span className="text-slate-600 text-[10px]">--</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                            title="Sửa ngân sách chi nhánh"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-slate-700 bg-slate-950/90 font-black text-white">
                    <td className="py-3.5 px-3"></td>
                    <td className="py-3.5 px-3">TỔNG CỘNG</td>
                    <td className="py-3.5 px-3 text-right font-mono text-cyan-400">
                      {currentSummary.totalDaily > 0 ? formatVND(currentSummary.totalDaily, 'million') : '--'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-amber-400">
                      {currentSummary.totalMonthly > 0 ? formatVND(currentSummary.totalMonthly, 'million') : '--'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                      {currentSummary.totalMonthlyVat > 0 ? formatVND(currentSummary.totalMonthlyVat, 'million') : '--'}
                    </td>
                    {hasReduced30 && (
                      <td className="py-3.5 px-3 text-right font-mono text-cyan-300">
                        {currentSummary.totalReduced30Vat > 0 ? formatVND(currentSummary.totalReduced30Vat, 'million') : '--'}
                      </td>
                    )}
                    {hasReducedExtra30 && (
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-300">
                        {currentSummary.totalReducedExtra30Vat > 0 ? formatVND(currentSummary.totalReducedExtra30Vat, 'million') : '--'}
                      </td>
                    )}
                    <td className="py-3.5 px-3 text-right font-mono text-purple-300">
                      {currentSummary.totalSpent > 0 ? formatVND(currentSummary.totalSpent, 'million') : (currentSummary.totalMonthly > 0 ? '0' : '--')}
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono text-rose-400">
                      {currentSummary.activeScenarioTotalBudget > 0 ? `${currentSummary.burnRatePercent.toFixed(1)}%` : '--'}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            /* TABLE SUB-MODE 2: 9-MONTH MULTI-MONTH MATRIX VIEW */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 font-bold">
                    <th className="py-3.5 px-3 sticky left-0 bg-slate-950 z-10">STT</th>
                    <th className="py-3.5 px-3 sticky left-8 bg-slate-950 z-10">Chi Nhánh</th>
                    <th className="py-3.5 px-3 text-right text-amber-400">Hạn Mức/Tháng</th>
                    <th className="py-3.5 px-3 text-right">T1</th>
                    <th className="py-3.5 px-3 text-right">T2</th>
                    <th className="py-3.5 px-3 text-right">T3</th>
                    <th className="py-3.5 px-3 text-right">T4</th>
                    <th className="py-3.5 px-3 text-right">T5</th>
                    <th className="py-3.5 px-3 text-right">T6</th>
                    <th className="py-3.5 px-3 text-right">T7</th>
                    <th className="py-3.5 px-3 text-right">T8</th>
                    <th className="py-3.5 px-3 text-right">T9</th>
                    <th className="py-3.5 px-3 text-right text-purple-300 font-bold">Tổng Lũy Kế</th>
                    <th className="py-3.5 px-3 text-right text-cyan-300">TB Tháng</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredBranchItems.map((item, idx) => {
                    const mCosts = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((mNum) =>
                      getBranchSpentForMonth(item, `t${mNum}`)
                    );
                    const totalCumulative = mCosts.reduce((s, c) => s + c, 0);
                    const monthsWithData = mCosts.filter((c) => c > 0).length || 1;
                    const avgMonthly = Math.round(totalCumulative / monthsWithData);
                    const effectiveLimit = getBranchEffectiveLimit(item);

                    return (
                      <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 text-slate-500 font-mono sticky left-0 bg-slate-900">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-3 font-bold text-white sticky left-8 bg-slate-900">
                          {item.name}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                          {hasPlanDataForSelectedMonth ? formatVND(effectiveLimit, 'million') : '--'}
                        </td>
                        {mCosts.map((cost, mIdx) => {
                          const mNum = mIdx + 1;
                          const mPlan = multiMonthPlan.monthPlans[mNum];
                          const mBranch = mPlan?.items.find((b) => b.name === item.name || b.id === item.id);
                          const mLimit = mBranch ? getBranchEffectiveLimit(mBranch) : 0;
                          const isOver = mLimit > 0 && cost > mLimit;

                          return (
                            <td
                              key={mIdx}
                              className={`py-3 px-3 text-right font-mono ${
                                cost === 0
                                  ? 'text-slate-600'
                                  : isOver
                                  ? 'text-rose-400 font-bold bg-rose-950/20'
                                  : 'text-slate-300'
                              }`}
                            >
                              {cost > 0 ? formatVND(cost, 'million') : '--'}
                            </td>
                          );
                        })}
                        <td className="py-3 px-3 text-right font-mono font-bold text-purple-300">
                          {formatVND(totalCumulative, 'million')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-cyan-300">
                          {formatVND(avgMonthly, 'million')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 3: SIMULATION PLANNER & ROAS CALCULATOR */}
      {activeViewMode === 'simulation' && (
        <div className="space-y-6">
          {/* Scenario Selector & Custom Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Selector */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Chọn Kịch Bản Tăng Trưởng
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">1-Click Preset</span>
              </div>

              <div className="space-y-2.5">
                {/* Scenario 1: Mức Gốc Theo File (KPI Doanh thu tính theo Chi phí <= 15% DT) */}
                <div
                  onClick={() => applyScenario('kpi125_75')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === 'kpi125_75'
                      ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10 ring-1 ring-amber-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      🟢 Mức Gốc Theo File
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30 font-bold">
                      ROAS {dynamicPlanBudgets.baseRoas}x ({dynamicPlanBudgets.baseCir}%)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-base font-black text-white">{formatVND(dynamicPlanBudgets.baseBudget, dynamicPlanBudgets.baseBudget >= 1000000000 ? 'billion' : 'million')}</span>
                    <span className="text-xs text-amber-300 font-bold">KPI Target: {formatVND(dynamicPlanBudgets.baseTargetRevenue, 'billion')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Cập nhật theo file ({formatVND(dynamicPlanBudgets.baseBudget, 'million')}), KPI Doanh thu tự động tính để Chi phí Ads ≤ 15% DT.
                  </p>
                </div>

                {/* Scenario 2: Giảm 30% Theo File (ROAS 6.67x, CIR <= 15%) */}
                <div
                  onClick={() => applyScenario('reduce30')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === 'reduce30'
                      ? 'bg-yellow-950/40 border-yellow-500 shadow-md shadow-yellow-500/10 ring-1 ring-yellow-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-yellow-400 flex items-center gap-1.5">
                      🟡 Giảm 30% Theo File
                    </span>
                    <span className="text-[11px] font-mono text-yellow-300 bg-yellow-500/20 px-1.5 py-0.5 rounded border border-yellow-500/30 font-bold">
                      ROAS 6.67x (≤15%)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-base font-black text-white">{formatVND(dynamicPlanBudgets.reduced30Budget, 'million')}</span>
                    <span className="text-xs text-yellow-300 font-bold">KPI Target: {formatVND(dynamicPlanBudgets.reduced30TargetRevenue, 'billion')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Giảm 30% theo file ({formatVND(dynamicPlanBudgets.reduced30Budget, 'million')}), giữ chi phí Ads ≤ 15.0% DT.
                  </p>
                </div>

                {/* Scenario 3: Giảm tiếp 30% Theo File (ROAS 6.67x, CIR <= 15%) */}
                <div
                  onClick={() => applyScenario('reduce60')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === 'reduce60'
                      ? 'bg-rose-950/40 border-rose-500 shadow-md shadow-rose-500/10 ring-1 ring-rose-500/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      🔴 Giảm Tiếp 30% Theo File
                    </span>
                    <span className="text-[11px] font-mono text-rose-300 bg-rose-500/20 px-1.5 py-0.5 rounded border border-rose-500/30 font-bold">
                      ROAS 6.67x (≤15%)
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-base font-black text-white">{formatVND(dynamicPlanBudgets.reduced60Budget, 'million')}</span>
                    <span className="text-xs text-rose-300 font-bold">KPI Target: {formatVND(dynamicPlanBudgets.reduced60TargetRevenue, 'billion')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Giảm thêm 30% theo file ({formatVND(dynamicPlanBudgets.reduced60Budget, 'million')}), giữ chi phí Ads ≤ 15.0% DT.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Interactive Sliders */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Tùy Chỉnh Ngân Sách Dự Kiến Trực Tiếp
                  </h3>
                  <button
                    onClick={() => applyScenario('kpi125_75')}
                    className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Đặt lại mặc định
                  </button>
                </div>
                <p className="text-xs text-slate-400">
                  Kéo thanh trượt hoặc nhập số tiền để xem mô phỏng biến động doanh thu & lượng Lead tự động nhảy số theo thời gian thực.
                </p>
              </div>

              {/* Slider 1: Total Budget */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Tổng Ngân Sách Chi Phí (VAT):</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="50000000"
                      min="200000000"
                      max="10000000000"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Math.max(10000000, parseInt(e.target.value, 10) || 0))}
                      className="w-40 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-right font-black text-amber-400 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-slate-400 font-bold">VNĐ</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="200000000"
                  max="10000000000"
                  step="50000000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>200 Tr</span>
                  <span>850 Tr (Chuẩn)</span>
                  <span>1.25 Tỷ</span>
                  <span>7.5 Tỷ (Max KPI)</span>
                  <span>10 Tỷ</span>
                </div>
              </div>

              {/* Slider 2: Target ROAS */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Hệ Số ROAS Mục Tiêu & Tỷ Lệ Chi Phí:</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-amber-300 font-mono font-bold">
                      Chi phí: {targetRoas > 0 ? (100 / targetRoas).toFixed(1) : 0}% DT
                    </span>
                    <span className="text-base font-black text-cyan-400 font-mono">{targetRoas.toFixed(1)}x</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="16.0"
                  step="0.1"
                  value={targetRoas}
                  onChange={(e) => setTargetRoas(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>4.0x (25% Chi phí)</span>
                  <span>6.7x (15% Chi phí)</span>
                  <span>8.8x (11.3% Chi phí)</span>
                  <span>15.0x (6.7% Chi phí)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Breakdown Table & Visual Share */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table: Chi tiết từng dịch vụ */}
            <div className="lg:col-span-2 rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Phân Bổ Ngân Sách Theo Nhóm Dịch Vụ Cốt Lõi
                </h3>
                <span className="text-xs text-slate-400">5 Dịch vụ chủ lực</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/40 font-bold">
                      <th className="py-3 px-3">Dịch Vụ</th>
                      <th className="py-3 px-3 text-right">Tỷ Trọng (%)</th>
                      <th className="py-3 px-3 text-right">Ngân Sách Dự Kiến</th>
                      <th className="py-3 px-3 text-right">Lead Kỳ Vọng</th>
                      <th className="py-3 px-3 text-right">CPA Mục Tiêu</th>
                      <th className="py-3 px-3 text-right">Doanh Thu Mục Tiêu</th>
                      <th className="py-3 px-3 text-right">ROAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {serviceCalculations.map((svc) => (
                      <tr key={svc.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ backgroundColor: svc.color }}
                          />
                          <span>{svc.name}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                          {svc.sharePercent}%
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-200">
                          {formatVND(svc.budget, 'million')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-cyan-300">
                          {svc.leads.toLocaleString('vi-VN')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-400">
                          {formatVND(svc.expectedCpa, 'full')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                          {formatVND(svc.revenue, 'million')}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-black text-cyan-400">
                          {svc.roas}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-700 bg-slate-950/80 font-black text-white">
                      <td className="py-3.5 px-3">TỔNG CỘNG</td>
                      <td className="py-3.5 px-3 text-right font-mono text-amber-400">100%</td>
                      <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                        {formatVND(totalBudget, 'million')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-cyan-300">
                        {totalProjectedLeads.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        {formatVND(avgForecastCpa, 'full')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-emerald-300">
                        {formatVND(calculatedTotalRevenueFromServices, 'billion')}
                      </td>
                      <td className="py-3.5 px-3 text-right font-mono text-cyan-300">
                        {totalBudget > 0 ? (calculatedTotalRevenueFromServices / totalBudget).toFixed(1) : '0.0'}x
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Donut Chart: Phân Bổ Ngân Sách */}
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-purple-400" />
                  Tỷ Trọng Ngân Sách Từng Dịch Vụ
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Implant và Khách Kiều Bào chiếm 64% tổng ngân sách nhằm tối đa hóa biên lợi nhuận.
                </p>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={serviceCalculations}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="sharePercent"
                    >
                      {serviceCalculations.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any, name: any, item: any) => [
                        `${val}% (${formatVND(item.payload.budget, 'million')})`,
                        item.payload.name,
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '0.75rem',
                        color: '#f8fafc',
                        fontSize: '12px',
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                {serviceCalculations.map((svc) => (
                  <div key={svc.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: svc.color }} />
                      <span className="text-slate-300 font-medium truncate max-w-[130px]">{svc.name}</span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {svc.sharePercent}% ({formatVND(svc.budget, 'million')})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Channel Strategy */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              Chiến Lược Phân Bổ Theo Kênh Quảng Cáo & Định Dạng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
              {CHANNELS.map((ch, idx) => {
                const chBudget = (totalBudget * ch.percent) / 100;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 truncate">{ch.name}</span>
                      <span className="text-xs font-mono font-bold text-amber-400">{ch.percent}%</span>
                    </div>
                    <div className="text-base font-black text-white font-mono">{formatVND(chBudget, 'million')}</div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${ch.percent * 2}%`, backgroundColor: ch.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 4. MODAL: SỬA NGÂN SÁCH CHI NHÁNH */}
      {editingBranch && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                <h3 className="text-lg font-black text-white">
                  Cập Nhật Ngân Sách: {editingBranch.name}
                </h3>
              </div>
              <button
                onClick={() => setEditingBranch(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Daily Budget */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Ngân Sách Ngày (VNĐ):</span>
                  <span className="font-mono text-cyan-400 font-bold">{formatVND(editDailyBudget, 'full')}</span>
                </label>
                <input
                  type="number"
                  step="100000"
                  value={editDailyBudget}
                  onChange={(e) => {
                    const daily = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setEditDailyBudget(daily);
                    setEditMonthlyBudget(daily * (currentMonthDays === 365 ? 30 : currentMonthDays));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              {/* Monthly Budget (Gốc) */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Ngân Sách Tháng Gốc (VNĐ):</span>
                  <span className="font-mono text-amber-400 font-bold">{formatVND(editMonthlyBudget, 'full')}</span>
                </label>
                <input
                  type="number"
                  step="1000000"
                  value={editMonthlyBudget}
                  onChange={(e) => {
                    const monthly = Math.max(0, parseInt(e.target.value, 10) || 0);
                    setEditMonthlyBudget(monthly);
                    const days = currentMonthDays === 365 ? 30 : currentMonthDays;
                    setEditDailyBudget(Math.round(monthly / (days || 30)));
                  }}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              {/* Actual Spent */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 flex items-center justify-between">
                  <span>Thực Chi Tháng Này (VNĐ):</span>
                  <span className="font-mono text-purple-400 font-bold">{formatVND(editSpent, 'full')}</span>
                </label>
                <input
                  type="number"
                  step="100000"
                  value={editSpent}
                  onChange={(e) => setEditSpent(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono focus:outline-none focus:border-amber-400 text-sm"
                />
              </div>

              {/* Calculated Auto Previews */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hệ số tự động tính:</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Có VAT (+16.64%):</span>
                    <span className="font-mono font-bold text-amber-300">{formatVND(Math.round(editMonthlyBudget * 1.1664), 'million')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Giảm 30%:</span>
                    <span className="font-mono font-bold text-cyan-300">{formatVND(Math.round(editMonthlyBudget * 0.7), 'million')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setEditingBranch(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveBranchEdit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all cursor-pointer flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
              >
                <Save className="w-4 h-4" />
                <span>Lưu Ngân Sách</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
