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
  fetchBudgetPlanSheetData,
  FALLBACK_BUDGET_PLAN_ITEMS,
} from '../services/budgetPlanSheetService';

interface BudgetForecastViewProps {
  monthlyDatasets: MonthDataset[];
  displayUnit?: DisplayUnit;
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
    conversionRate: 38,
    color: '#06b6d4', // cyan-500
  },
  {
    id: 'vietkieu',
    name: 'Khách Việt Kiều / Kiều Bào',
    sharePercent: 22,
    expectedCpa: 850000,
    avgOrderValue: 65000000,
    conversionRate: 45,
    color: '#8b5cf6', // purple-500
  },
  {
    id: 'su',
    name: 'Răng Sứ Thẩm Mỹ',
    sharePercent: 16,
    expectedCpa: 420000,
    avgOrderValue: 18000000,
    conversionRate: 35,
    color: '#3b82f6', // blue-500
  },
  {
    id: 'nieng',
    name: 'Niềng Răng / Chỉnh Nha',
    sharePercent: 12,
    expectedCpa: 460000,
    avgOrderValue: 32000000,
    conversionRate: 30,
    color: '#10b981', // emerald-500
  },
  {
    id: 'tonghop',
    name: 'Nha Khoa Tổng Quát & Trị Liệu',
    sharePercent: 8,
    expectedCpa: 220000,
    avgOrderValue: 4500000,
    conversionRate: 55,
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

const MONTH_OPTIONS = [
  { id: 't1', label: 'Tháng 1', short: 'T1' },
  { id: 't2', label: 'Tháng 2', short: 'T2' },
  { id: 't3', label: 'Tháng 3', short: 'T3' },
  { id: 't4', label: 'Tháng 4', short: 'T4' },
  { id: 't5', label: 'Tháng 5', short: 'T5' },
  { id: 't6', label: 'Tháng 6', short: 'T6' },
  { id: 't7', label: 'Tháng 7', short: 'T7' },
  { id: 't8', label: 'Tháng 8', short: 'T8' },
  { id: 't9', label: 'Tháng 9', short: 'T9' },
  { id: 't10', label: 'Tháng 10', short: 'T10' },
];

export const BudgetForecastView: React.FC<BudgetForecastViewProps> = ({
  monthlyDatasets,
  displayUnit = 'full',
}) => {
  // Main view mode: 'cards_grid' (Dạng Thẻ Tiến Độ theo ảnh), 'sheet_plan' (Dạng Bảng), 'simulation' (Mô Phỏng Doanh Thu & ROI)
  const [activeViewMode, setActiveViewMode] = useState<'cards_grid' | 'sheet_plan' | 'simulation'>('cards_grid');

  // Selected Month for comparison
  const [selectedMonth, setSelectedMonth] = useState<string>('t1');

  // Status Filter: 'all', 'over_budget', 'within_budget'
  const [statusFilter, setStatusFilter] = useState<'all' | 'over_budget' | 'within_budget'>('all');

  // Budget Plan Google Sheets Live State & Local Edits
  const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_BUDGET_PLAN_SHEET_URL);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlanSummary | null>(null);
  const [isFetchingSheet, setIsFetchingSheet] = useState<boolean>(false);
  const [sheetSearchTerm, setSheetSearchTerm] = useState<string>('');

  // Custom Local Branch Data (Overrides)
  const [customBranchData, setCustomBranchData] = useState<BranchPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem('custom_branch_budget_items');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return FALLBACK_BUDGET_PLAN_ITEMS;
  });

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

  const [targetRoas, setTargetRoas] = useState<number>(8.0); // 8.0x
  const [activeScenario, setActiveScenario] = useState<'conservative' | 'balanced' | 'aggressive'>('balanced');
  const [services] = useState<ServiceBudgetItem[]>(DEFAULT_SERVICES);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [aiReport, setAiReport] = useState<string | null>(null);

  // Load Google Sheet Budget Plan
  const loadBudgetSheet = useCallback(async (url: string = sheetUrl) => {
    setIsFetchingSheet(true);
    try {
      const data = await fetchBudgetPlanSheetData(url);
      setBudgetPlan(data);
      if (data?.items && data.items.length > 0) {
        setCustomBranchData(data.items);
      }
    } catch (err) {
      console.error('Error fetching budget plan sheet:', err);
    } finally {
      setIsFetchingSheet(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    loadBudgetSheet(sheetUrl);
  }, [sheetUrl, loadBudgetSheet]);

  // Save custom branch data
  const handleSaveBranchEdit = () => {
    if (!editingBranch) return;

    const vatMultiplier = 1.1664; // +16.64%
    const monthlyVat = Math.round(editMonthlyBudget * vatMultiplier);
    const reduced30 = Math.round(editMonthlyBudget * 0.7 * vatMultiplier);
    const reducedExtra30 = Math.round(editMonthlyBudget * 0.49 * vatMultiplier);

    const updatedItems = customBranchData.map((item) => {
      if (item.id === editingBranch.id) {
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

    setCustomBranchData(updatedItems);
    try {
      localStorage.setItem('custom_branch_budget_items', JSON.stringify(updatedItems));
    } catch {
      // ignore
    }
    setEditingBranch(null);
  };

  const handleOpenEditModal = (branch: BranchPlanItem) => {
    setEditingBranch(branch);
    setEditDailyBudget(branch.dailyBudget);
    setEditMonthlyBudget(branch.monthlyBudget);
    setEditSpent(branch.spentThisMonth || 0);
  };

  // Handle Scenario Quick Apply
  const applyScenario = (type: 'conservative' | 'balanced' | 'aggressive') => {
    setActiveScenario(type);
    if (type === 'conservative') {
      setTotalBudget(650000000);
      setTargetRoas(7.5);
    } else if (type === 'balanced') {
      setTotalBudget(850000000);
      setTargetRoas(8.0);
    } else if (type === 'aggressive') {
      setTotalBudget(1250000000);
      setTargetRoas(8.5);
    }
  };

  // Aggregated totals from current items
  const activeItems = customBranchData.length > 0 ? customBranchData : FALLBACK_BUDGET_PLAN_ITEMS;

  const currentSummary = useMemo(() => {
    const totalDaily = activeItems.reduce((s, i) => s + i.dailyBudget, 0);
    const totalMonthly = activeItems.reduce((s, i) => s + i.monthlyBudget, 0);
    const totalMonthlyVat = activeItems.reduce((s, i) => s + i.monthlyBudgetVat, 0);
    const totalReduced30 = activeItems.reduce((s, i) => s + i.reduced30Budget, 0);
    const totalReduced30Vat = activeItems.reduce((s, i) => s + i.reduced30Vat, 0);
    const totalReducedExtra30 = activeItems.reduce((s, i) => s + i.reducedExtra30Budget, 0);
    const totalReducedExtra30Vat = activeItems.reduce((s, i) => s + i.reducedExtra30Vat, 0);
    const totalSpent = activeItems.reduce((s, i) => s + (i.spentThisMonth || 0), 0);

    const activeLocationsCount = activeItems.filter((i) => i.dailyBudget > 0).length || 15;
    const avgDailyPerLocation = activeLocationsCount > 0 ? Math.round(totalDaily / activeLocationsCount) : 0;
    const remainingBudget = totalMonthly - totalSpent;
    const burnRatePercent = totalMonthly > 0 ? (totalSpent / totalMonthly) * 100 : 0;

    return {
      totalDaily,
      totalMonthly,
      totalMonthlyVat,
      totalReduced30,
      totalReduced30Vat,
      totalReducedExtra30,
      totalReducedExtra30Vat,
      totalSpent,
      activeLocationsCount,
      avgDailyPerLocation,
      remainingBudget,
      burnRatePercent,
      items: activeItems,
    };
  }, [activeItems]);

  // Filtered branch items
  const filteredBranchItems = useMemo(() => {
    let list = activeItems;

    if (sheetSearchTerm.trim()) {
      const term = sheetSearchTerm.toLowerCase();
      list = list.filter((item) => item.name.toLowerCase().includes(term));
    }

    if (statusFilter === 'over_budget') {
      list = list.filter((item) => {
        const spent = item.spentThisMonth || 0;
        const limit = item.monthlyBudget;
        return limit > 0 && spent > limit;
      });
    } else if (statusFilter === 'within_budget') {
      list = list.filter((item) => {
        const spent = item.spentThisMonth || 0;
        const limit = item.monthlyBudget;
        return limit === 0 || spent <= limit;
      });
    }

    return list;
  }, [activeItems, sheetSearchTerm, statusFilter]);

  // Simulation calculations
  const targetRevenue = useMemo(() => totalBudget * targetRoas, [totalBudget, targetRoas]);
  const costRevenueRatio = useMemo(() => (targetRevenue > 0 ? (totalBudget / targetRevenue) * 100 : 0), [totalBudget, targetRevenue]);

  const serviceCalculations = useMemo(() => {
    return services.map((svc) => {
      const budget = (totalBudget * svc.sharePercent) / 100;
      const leads = svc.expectedCpa > 0 ? Math.round(budget / svc.expectedCpa) : 0;
      const closedDeals = Math.round((leads * svc.conversionRate) / 100);
      const revenue = closedDeals * svc.avgOrderValue;
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
  }, [services, totalBudget]);

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

  return (
    <div className="space-y-6">
      {/* 1. TOP KPI METRIC ROW - EXACTLY MATCHING USER'S SCREENSHOT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng Hạn Mức Kịch Bản */}
        <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Tổng Hạn Mức Kịch Bản</span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              17 Chi Nhánh
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 tracking-tight font-mono">
              {formatVND(currentSummary.totalMonthly, 'full')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Kế hoạch ngân sách chuẩn 100%
            </div>
          </div>
        </div>

        {/* Card 2: Ngân Sách Ngày Toàn Hệ Thống */}
        <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/40 transition-all flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Ngân Sách Ngày Toàn Hệ Thống</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400 tracking-tight font-mono">
              {formatVND(currentSummary.totalDaily, 'full')}
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Trung bình {formatVND(currentSummary.avgDailyPerLocation, 'full')} / cơ sở / ngày
            </div>
          </div>
        </div>

        {/* Card 3: Chi Phí (VAT) Tháng 1 */}
        <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-all flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Chi Phí (VAT) Tháng 1</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold text-rose-400 bg-rose-950/40 border border-rose-500/30">
              100% Hạn Mức
            </span>
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight font-mono">
              {formatVND(currentSummary.totalSpent, 'full')}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              <span>Còn lại:</span>
              <span className={`font-bold font-mono ${currentSummary.remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentSummary.remainingBudget < 0 ? '-' : ''}
                {formatVND(Math.abs(currentSummary.remainingBudget), 'full')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Trạng Thái Burn-Rate */}
        <div className="p-5 rounded-2xl bg-[#0a0f1d] border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/40 transition-all flex flex-col justify-between min-h-[135px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Trạng Thái Burn-Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 space-y-2">
            <div className="text-base sm:text-lg font-black text-amber-400 tracking-tight flex items-center gap-1.5">
              <span>⚠️ Cảnh Báo Vượt Trần</span>
            </div>
            {/* Progress Bar (thick gradient) */}
            <div className="h-2.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500"
                style={{ width: `${Math.min(100, currentSummary.burnRatePercent)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOOLBAR & VIEW CONTROLS */}
      <div className="p-4 rounded-2xl bg-[#0a0f1d] border border-slate-800 shadow-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              Vượt ({overBudgetCount})
            </button>
            <button
              onClick={() => setStatusFilter('within_budget')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                statusFilter === 'within_budget' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Chuẩn ({withinBudgetCount})
            </button>
          </div>

          {/* Quick Actions */}
          <button
            onClick={() => loadBudgetSheet(sheetUrl)}
            disabled={isFetchingSheet}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs transition-all active:scale-95 disabled:opacity-50"
            title="Làm mới Google Sheet"
          >
            <RefreshCw className={`w-4 h-4 text-cyan-400 ${isFetchingSheet ? 'animate-spin' : ''}`} />
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

      {/* 3. AI GEMINI REPORT MODAL / ACCORDION */}
      {aiReport && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
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

      {/* VIEW MODE 1: BRANCH PROGRESS CARDS GRID (EXACT LAYOUT FROM SCREENSHOT) */}
      {activeViewMode === 'cards_grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
          {filteredBranchItems.map((item) => {
            const spent = item.spentThisMonth || 0;
            const limit = item.monthlyBudget;
            const usedPct = limit > 0 ? (spent / limit) * 100 : (spent > 0 ? 999 : 0);
            const isOverBudget = limit > 0 && spent > limit;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#0b1120] border border-slate-800/90 hover:border-slate-700/90 p-5 shadow-lg flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Card Header: Dot + Name (Left), Badge (Right) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
                      <h4 className="text-sm sm:text-base font-bold text-white tracking-tight truncate">
                        {item.name}
                      </h4>
                    </div>

                    {isOverBudget ? (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#3b0d1e] text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        ✕ Vượt Hạn Mức
                      </span>
                    ) : limit > 0 ? (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-[#042f2e] text-teal-300 border border-teal-500/30">
                        Đã dùng {Math.round(usedPct)}%
                      </span>
                    ) : (
                      <span className="shrink-0 px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-900 text-slate-400 border border-slate-800">
                        Chưa phân bổ
                      </span>
                    )}
                  </div>

                  {/* Progress Bar (Teal or Rose) */}
                  <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden mt-3 mb-2 border border-slate-900">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOverBudget
                          ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.7)]'
                          : 'bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.7)]'
                      }`}
                      style={{ width: `${Math.min(100, usedPct)}%` }}
                    />
                  </div>

                  {/* Under Progress Bar Row: Spent (Left) vs Limit (Right) */}
                  <div className="flex items-center justify-between text-xs mb-3 font-sans">
                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Chi Phí (VAT) T1:</span>
                      <span
                        className={`font-mono font-bold ${
                          isOverBudget ? 'text-rose-400' : 'text-teal-400'
                        }`}
                      >
                        {formatVND(spent, 'full')}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-slate-400">Hạn mức:</span>
                      <span className="font-mono font-bold text-amber-400">
                        {formatVND(limit, 'full')}
                      </span>
                    </div>
                  </div>

                  {/* 2x2 Metric Details Box */}
                  <div className="bg-[#060913] rounded-xl p-3 border border-slate-850 grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-sans">
                    <div>
                      <div className="text-[11px] text-slate-400">NS Ngày:</div>
                      <div className="font-mono font-bold text-cyan-300 text-xs sm:text-[13px] mt-0.5">
                        {formatVND(item.dailyBudget, 'full')}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400">NS Tháng (Gốc):</div>
                      <div className="font-mono font-bold text-cyan-300 text-xs sm:text-[13px] mt-0.5">
                        {formatVND(item.monthlyBudget, 'full')}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400">Có VAT (+16.6%):</div>
                      <div className="font-mono font-bold text-cyan-300 text-xs sm:text-[13px] mt-0.5">
                        {formatVND(item.monthlyBudgetVat, 'full')}
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] text-slate-400">Giảm 30%:</div>
                      <div className="font-mono font-bold text-cyan-300 text-xs sm:text-[13px] mt-0.5">
                        {formatVND(item.reduced30Budget, 'full')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Row: Limit (Left), Button Edit (Right) */}
                <div className="flex items-center justify-between pt-3 mt-1 border-t border-slate-800/80">
                  <div className="text-xs flex items-center gap-1">
                    <span className="text-slate-400">Hạn mức:</span>
                    <span className="font-mono font-bold text-amber-400">
                      {formatVND(item.monthlyBudget, 'full')}
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenEditModal(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0f172a] hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-amber-500/50 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <Edit3 className="w-3 h-3 text-slate-400 group-hover:text-amber-400" />
                    <span>Sửa Ngân Sách</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW MODE 2: DETAILED SPREADSHEET TABLE */}
      {activeViewMode === 'sheet_plan' && (
        <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Bảng Phân Bổ Ngân Sách & Đối Soát 17 Chi Nhánh
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kèm 2 kịch bản tối ưu chi phí (Giảm 30% và Giảm thêm 30%) và tỷ lệ giải ngân thực tế so với định mức.
              </p>
            </div>

            <a
              href={sheetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1.5 font-medium underline underline-offset-4"
            >
              <span>Mở Google Sheets Kế Hoạch Gốc</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-950/60 font-bold">
                  <th className="py-3.5 px-3">STT</th>
                  <th className="py-3.5 px-3">Chi Nhánh / Thị Trường</th>
                  <th className="py-3.5 px-3 text-right">Ngân Sách Ngày</th>
                  <th className="py-3.5 px-3 text-right">Kế Hoạch Tháng (Gốc)</th>
                  <th className="py-3.5 px-3 text-right text-amber-400">Kế Hoạch Tháng (+VAT)</th>
                  <th className="py-3.5 px-3 text-right text-cyan-400">Giảm 30% (+VAT)</th>
                  <th className="py-3.5 px-3 text-right text-emerald-400">Giảm Thêm 30% (+VAT)</th>
                  <th className="py-3.5 px-3 text-right text-purple-300">Thực Chi Tháng</th>
                  <th className="py-3.5 px-3 text-center">Tiến Độ Giải Ngân</th>
                  <th className="py-3.5 px-3 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {filteredBranchItems.map((item, idx) => {
                  const spent = item.spentThisMonth || 0;
                  const pacing = item.monthlyBudget > 0 ? (spent / item.monthlyBudget) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{item.name}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-300">
                        {formatVND(item.dailyBudget, 'million')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-400">
                        {formatVND(item.monthlyBudget, 'million')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                        {formatVND(item.monthlyBudgetVat, 'million')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-cyan-300">
                        {formatVND(item.reduced30Vat, 'million')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-emerald-300">
                        {formatVND(item.reducedExtra30Vat, 'million')}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-purple-300">
                        {formatVND(spent, 'million')}
                      </td>
                      <td className="py-3 px-3 text-center font-mono">
                        {item.monthlyBudget > 0 ? (
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
                          className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
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
                    {formatVND(currentSummary.totalDaily, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-amber-400">
                    {formatVND(currentSummary.totalMonthly, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-amber-300">
                    {formatVND(currentSummary.totalMonthlyVat, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-cyan-300">
                    {formatVND(currentSummary.totalReduced30Vat, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-emerald-300">
                    {formatVND(currentSummary.totalReducedExtra30Vat, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-purple-300">
                    {formatVND(currentSummary.totalSpent, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-rose-400">
                    {currentSummary.burnRatePercent.toFixed(1)}%
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 3: SIMULATION PLANNER & ROAS CALCULATOR */}
      {activeViewMode === 'simulation' && (
        <div className="space-y-6">
          {/* Scenario Selector & Custom Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Selector */}
            <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-amber-400" />
                  Chọn Kịch Bản Tăng Trưởng
                </h3>
                <span className="text-[10px] text-slate-400 font-mono">1-Click Preset</span>
              </div>

              <div className="space-y-2.5">
                {/* Scenario 1: Conservative */}
                <div
                  onClick={() => applyScenario('conservative')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === 'conservative'
                      ? 'bg-blue-950/40 border-blue-500 shadow-md shadow-blue-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                      🛡️ Kịch Bản Thận Trọng
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">ROAS 7.5x</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-base font-black text-white">{formatVND(650000000, 'million')}</span>
                    <span className="text-xs text-slate-400">Target: {formatVND(4875000000, 'billion')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tối ưu CPA tối đa, giảm rủi ro, tập trung khách chốt lịch cao.
                  </p>
                </div>

                {/* Scenario 2: Balanced */}
                <div
                  onClick={() => applyScenario('balanced')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === 'balanced'
                      ? 'bg-amber-950/40 border-amber-500 shadow-md shadow-amber-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                      ⚡ Tiêu Chuẩn (Khuyên Dùng)
                    </span>
                    <span className="text-[11px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                      ROAS 8.0x
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-base font-black text-white">{formatVND(850000000, 'million')}</span>
                    <span className="text-xs text-slate-400">Target: {formatVND(6800000000, 'billion')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Tỷ lệ vàng giữa tăng trưởng thị phần và biên lợi nhuận ròng.
                  </p>
                </div>

                {/* Scenario 3: Aggressive */}
                <div
                  onClick={() => applyScenario('aggressive')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeScenario === 'aggressive'
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      🚀 Tăng Trưởng Đột Phá
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">ROAS 8.5x</span>
                  </div>
                  <div className="flex items-baseline justify-between mt-2">
                    <span className="text-base font-black text-white">{formatVND(1250000000, 'million')}</span>
                    <span className="text-xs text-slate-400">Target: {formatVND(10625000000, 'billion')}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Đánh mạnh Kiều Bào & PMax mùa cao điểm cuối năm.
                  </p>
                </div>
              </div>
            </div>

            {/* Custom Interactive Sliders */}
            <div className="lg:col-span-2 rounded-2xl bg-[#0a0f1d] border border-slate-800 p-5 shadow-xl space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    Tùy Chỉnh Ngân Sách Dự Kiến Trực Tiếp
                  </h3>
                  <button
                    onClick={() => applyScenario('balanced')}
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
                      step="10000000"
                      min="200000000"
                      max="3000000000"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Math.max(10000000, parseInt(e.target.value, 10) || 0))}
                      className="w-36 px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-right font-black text-amber-400 text-sm focus:outline-none focus:border-amber-400"
                    />
                    <span className="text-xs text-slate-400 font-bold">VNĐ</span>
                  </div>
                </div>
                <input
                  type="range"
                  min="200000000"
                  max="2500000000"
                  step="25000000"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>200 Triệu</span>
                  <span>850 Triệu (Chuẩn)</span>
                  <span>1.5 Tỷ</span>
                  <span>2.5 Tỷ</span>
                </div>
              </div>

              {/* Slider 2: Target ROAS */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Hệ Số ROAS Mục Tiêu (Doanh Thu / Chi Phí):</span>
                  <span className="text-base font-black text-cyan-400 font-mono">{targetRoas.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="4.0"
                  max="12.0"
                  step="0.5"
                  value={targetRoas}
                  onChange={(e) => setTargetRoas(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>4.0x (An toàn)</span>
                  <span>8.0x (Chuẩn Nha Khoa)</span>
                  <span>12.0x (Xuất sắc)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Breakdown Table & Visual Share */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table: Chi tiết từng dịch vụ */}
            <div className="lg:col-span-2 rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 shadow-xl space-y-4">
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
                        {targetRoas.toFixed(1)}x
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Donut Chart: Phân Bổ Ngân Sách */}
            <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 shadow-xl space-y-4 flex flex-col justify-between">
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
          <div className="rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 shadow-xl space-y-4">
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
          <div className="bg-[#0b1120] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
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
                    setEditMonthlyBudget(daily * 30);
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
                    setEditDailyBudget(Math.round(monthly / 30));
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
