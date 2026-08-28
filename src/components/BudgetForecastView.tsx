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

export const BudgetForecastView: React.FC<BudgetForecastViewProps> = ({
  monthlyDatasets,
  displayUnit = 'full',
}) => {
  // Main view mode: 'sheet_plan' (Chi Tiết Chi Nhánh Live Sheet) vs 'simulation' (Mô Phỏng ROI & Dịch Vụ)
  const [activeViewMode, setActiveViewMode] = useState<'sheet_plan' | 'simulation'>('sheet_plan');

  // Budget Plan Google Sheets Live State
  const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_BUDGET_PLAN_SHEET_URL);
  const [budgetPlan, setBudgetPlan] = useState<BudgetPlanSummary | null>(null);
  const [isFetchingSheet, setIsFetchingSheet] = useState<boolean>(false);
  const [sheetSearchTerm, setSheetSearchTerm] = useState<string>('');

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
    } catch (err) {
      console.error('Error fetching budget plan sheet:', err);
    } finally {
      setIsFetchingSheet(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    loadBudgetSheet(sheetUrl);
  }, [sheetUrl, loadBudgetSheet]);

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

  // Save budget changes
  useEffect(() => {
    try {
      localStorage.setItem('forecast_total_budget', totalBudget.toString());
    } catch {
      // ignore
    }
  }, [totalBudget]);

  // Calculate high-level forecasted metrics
  const targetRevenue = useMemo(() => {
    return totalBudget * targetRoas;
  }, [totalBudget, targetRoas]);

  const costRevenueRatio = useMemo(() => {
    if (targetRevenue <= 0) return 0;
    return (totalBudget / targetRevenue) * 100;
  }, [totalBudget, targetRevenue]);

  // Breakdown by services calculations
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

  const totalProjectedLeads = useMemo(() => {
    return serviceCalculations.reduce((sum, s) => sum + s.leads, 0);
  }, [serviceCalculations]);

  const totalProjectedDeals = useMemo(() => {
    return serviceCalculations.reduce((sum, s) => sum + s.closedDeals, 0);
  }, [serviceCalculations]);

  const calculatedTotalRevenueFromServices = useMemo(() => {
    return serviceCalculations.reduce((sum, s) => sum + s.revenue, 0);
  }, [serviceCalculations]);

  const avgForecastCpa = useMemo(() => {
    if (totalProjectedLeads <= 0) return 0;
    return Math.round(totalBudget / totalProjectedLeads);
  }, [totalBudget, totalProjectedLeads]);

  // Filtered branch items in Sheet Plan
  const displayBranchItems = useMemo(() => {
    const items = budgetPlan?.items || FALLBACK_BUDGET_PLAN_ITEMS;
    if (!sheetSearchTerm.trim()) return items;
    const term = sheetSearchTerm.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(term));
  }, [budgetPlan, sheetSearchTerm]);

  // AI Gemini Forecast Simulation
  const handleRunAiAnalysis = () => {
    setIsAiAnalyzing(true);
    setAiReport(null);

    setTimeout(() => {
      setIsAiAnalyzing(false);
      setAiReport(`### 🎯 ĐÁNH GIÁ KẾ HOẠCH NGÂN SÁCH TỪ TRỢ LÝ AI (GEMINI)

1. **Tính Khả Thi Của Mục Tiêu (Feasibility Score: 94/100)**:
   - Kế hoạch ngân sách **${formatVND(totalBudget, 'million')}** với mục tiêu doanh thu **${formatVND(targetRevenue, 'billion')}** (ROAS ${targetRoas}x, Tỷ lệ chi phí ${costRevenueRatio.toFixed(1)}%) hoàn toàn phù hợp với biên lợi nhuận của chuỗi nha khoa cao cấp.
   - Chỉ số CPA bình quân dự kiến **${formatVND(avgForecastCpa, 'full')} / Lead** bám sát dữ liệu lịch sử ngành nha khoa 2026.

2. **3 Trọng Tâm Cần Đẩy Mạnh Trong Kỳ Này**:
   - **Tăng tốc mảng Kiều Bào (Chiếm ${services.find(s => s.id === 'vietkieu')?.sharePercent || 22}% ngân sách)**: Dự báo lượng kiều bào về nước thăm khám từ tháng 10 - tháng 12 sẽ tăng mạnh +45%. Khuyến nghị phân bổ ngân sách PMax và Search đa quốc gia (Mỹ, Úc, Canada).
   - **Trụ cột Implant (${services.find(s => s.id === 'implant')?.sharePercent || 42}% ngân sách)**: Duy trì vị thế số 1 trên Google Search với từ khóa "trồng răng implant", "cấy ghép All on 4/6".
   - **Kiểm soát chi phí chi nhánh vệ tinh**: Cần duy trì ngưỡng CPA < 450.000 đ tại các chi nhánh như Bình Phước, Tây Ninh để đảm bảo tỷ lệ chi phí toàn chuỗi dưới 13%.

3. **Cảnh Báo Quản Trị Rủi Ro (Burn-rate Alert)**:
   - Theo dõi tiến độ giải ngân hàng ngày (khoảng **${formatVND(Math.round(totalBudget / 30), 'million')}/ngày**). Nếu sau 10 ngày đầu tháng tỷ lệ chốt hẹn thấp hơn 30%, cần điều chỉnh lại tệp đối tượng Google Ads.`);
    }, 1200);
  };

  const handleCopySummary = () => {
    const text = `📊 KẾ HOẠCH DỰ TOÁN NGÂN SÁCH MARKETING NHA KHOA
━━━━━━━━━━━━━━━━━━━━━━━━━━
- Kỳ kế hoạch: ${targetPeriod === 'month_9' ? 'Tháng 9/2026' : targetPeriod === 'month_10' ? 'Tháng 10/2026' : targetPeriod === 'q4' ? 'Quý 4/2026' : 'Kế hoạch 2027'}
- Kịch bản: ${activeScenario === 'conservative' ? 'Thận Trọng' : activeScenario === 'balanced' ? 'Tiêu Chuẩn (Khuyên Dùng)' : 'Tăng Trưởng Đột Phá'}
- Tổng Ngân Sách: ${formatVND(totalBudget, 'million')}
- Mục Tiêu Doanh Thu: ${formatVND(targetRevenue, 'billion')} (ROAS ${targetRoas}x)
- Tỷ Lệ Chi Phí / Doanh Thu: ${costRevenueRatio.toFixed(1)}%
- Dự Kiến Lượng Lead: ${totalProjectedLeads.toLocaleString('vi-VN')} Leads
- CPA Bình Quân Ước Tính: ${formatVND(avgForecastCpa, 'full')} / Lead
- Ước tính Ca Điều Trị Chốt Đơn: ${totalProjectedDeals.toLocaleString('vi-VN')} Khách
━━━━━━━━━━━━━━━━━━━━━━━━━━
* Phân bổ dịch vụ:
  + Implant: ${formatVND(serviceCalculations[0]?.budget || 0, 'million')} (${serviceCalculations[0]?.sharePercent}%)
  + Kiều Bào: ${formatVND(serviceCalculations[1]?.budget || 0, 'million')} (${serviceCalculations[1]?.sharePercent}%)
  + Răng Sứ: ${formatVND(serviceCalculations[2]?.budget || 0, 'million')} (${serviceCalculations[2]?.sharePercent}%)
  + Niềng Răng: ${formatVND(serviceCalculations[3]?.budget || 0, 'million')} (${serviceCalculations[3]?.sharePercent}%)
  + Tổng Quát: ${formatVND(serviceCalculations[4]?.budget || 0, 'million')} (${serviceCalculations[4]?.sharePercent}%)`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const currentSummary = budgetPlan || {
    title: 'DỰ KIẾN KẾ HOẠCH NGÂN SÁCH THÁNG (TOÀN HỆ THỐNG)',
    totalDaily: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.dailyBudget, 0),
    totalMonthly: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.monthlyBudget, 0),
    totalMonthlyVat: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.monthlyBudgetVat, 0),
    totalReduced30: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.reduced30Budget, 0),
    totalReduced30Vat: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.reduced30Vat, 0),
    totalReducedExtra30: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.reducedExtra30Budget, 0),
    totalReducedExtra30Vat: FALLBACK_BUDGET_PLAN_ITEMS.reduce((s, i) => s + i.reducedExtra30Vat, 0),
    lastUpdated: new Date().toLocaleTimeString('vi-VN'),
    isLive: false,
    sourceUrl: DEFAULT_BUDGET_PLAN_SHEET_URL,
    items: FALLBACK_BUDGET_PLAN_ITEMS,
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Plan Selector */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/30 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-400/40 flex items-center gap-1.5 shadow-sm">
                <Wallet className="w-3.5 h-3.5 text-amber-400" /> Kế Hoạch Tài Chính & Tăng Trưởng
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <FileSpreadsheet className="w-3 h-3 text-emerald-400" /> Live Google Sheets Sync
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Bảng Dự Toán & Phân Bổ Ngân Sách
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Quản lý hạn mức chi tiêu quảng cáo theo 17 chi nhánh (kèm phương án giảm 30%, giảm 60%), đối soát ngân sách thực tế và mô phỏng tăng trưởng doanh thu theo dịch vụ nha khoa.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => loadBudgetSheet(sheetUrl)}
              disabled={isFetchingSheet}
              className="px-3.5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isFetchingSheet ? 'animate-spin' : ''}`} />
              <span>{isFetchingSheet ? 'Đang Tải Sheet...' : 'Làm Mới Sheet'}</span>
            </button>

            <button
              onClick={handleRunAiAnalysis}
              disabled={isAiAnalyzing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <Bot className="w-4 h-4 text-cyan-300 animate-bounce" />
              <span>{isAiAnalyzing ? 'AI Đang Phân Tích...' : 'Dự Báo Bằng AI Gemini'}</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all active:scale-95 shadow"
            >
              {copiedSummary ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Đã Sao Chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Sao Chép Kế Hoạch</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* View Mode Switcher: Live Sheet vs AI Simulator */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveViewMode('sheet_plan')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeViewMode === 'sheet_plan'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              <TableIcon className="w-4 h-4" />
              <span>Bảng Ngân Sách Chi Nhánh (Live Sheet)</span>
            </button>

            <button
              onClick={() => setActiveViewMode('simulation')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeViewMode === 'simulation'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-800/70 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Mô Phỏng Tăng Trưởng & ROI (Dịch Vụ & Ads)</span>
            </button>
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
      </div>

      {/* 2. Top KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng Ngân Sách Tháng */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-amber-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Ngân Sách Tháng (VAT)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-white tracking-tight">
              {formatVND(currentSummary.totalMonthlyVat, displayUnit)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <span>Định mức ngày:</span>
              <span className="font-bold text-amber-400 font-mono">
                {formatVND(currentSummary.totalDaily, 'million')}/ngày
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Phương Án Giảm 30% */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Phương Án Giảm 30% (VAT)</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-cyan-400 tracking-tight">
              {formatVND(currentSummary.totalReduced30Vat, displayUnit)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-cyan-300 mt-1">
              <span>Tiết kiệm: </span>
              <span className="font-bold font-mono">
                {formatVND(currentSummary.totalMonthlyVat - currentSummary.totalReduced30Vat, 'million')}
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Phương Án Giảm Thêm 30% */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Phương Án Giảm 60% (VAT)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-400 tracking-tight font-mono">
              {formatVND(currentSummary.totalReducedExtra30Vat, displayUnit)}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
              <span className="text-emerald-400 font-bold">Kịch bản thắt chặt</span>
              <span>(Tối ưu biên độ ròng)</span>
            </div>
          </div>
        </div>

        {/* Card 4: Tổng Chi Thực Tế Đối Soát */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 shadow-xl relative overflow-hidden group hover:border-purple-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">Thực Chi Tháng (Đối Soát)</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            {(() => {
              const totalSpent = currentSummary.items.reduce((s, i) => s + (i.spentThisMonth || 0), 0);
              const pacingRate = currentSummary.totalMonthlyVat > 0 ? (totalSpent / currentSummary.totalMonthlyVat) * 100 : 0;
              return (
                <>
                  <div className="text-2xl font-black text-purple-400 tracking-tight">
                    {formatVND(totalSpent, displayUnit)}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                    <span>Đã giải ngân:</span>
                    <span className={`font-bold font-mono ${pacingRate > 100 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {pacingRate.toFixed(1)}% Kế hoạch
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* 3. AI Gemini Analysis Report (if triggered) */}
      {aiReport && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 border border-indigo-500/40 shadow-2xl space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span>Báo Cáo Dự Báo Chiến Lược Ngân Sách (Gemini AI)</span>
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

      {/* VIEW MODE 1: LIVE SHEET BRANCH BUDGET PLAN */}
      {activeViewMode === 'sheet_plan' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                Bảng Phân Bổ Ngân Sách 17 Chi Nhánh & Thị Trường
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Kèm 2 kịch bản tối ưu chi phí (Giảm 30% và Giảm thêm 30%) và tỷ lệ giải ngân thực tế so với định mức.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm chi nhánh..."
                value={sheetSearchTerm}
                onChange={(e) => setSheetSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {displayBranchItems.map((item, idx) => {
                  const spent = item.spentThisMonth || 0;
                  const pacing = item.monthlyBudgetVat > 0 ? (spent / item.monthlyBudgetVat) * 100 : 0;
                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 text-slate-500 font-mono">{idx + 1}</td>
                      <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
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
                        {item.monthlyBudgetVat > 0 ? (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              pacing > 105
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
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-700 bg-slate-950/90 font-black text-white">
                  <td className="py-3.5 px-3"></td>
                  <td className="py-3.5 px-3">TỔNG CỘNG</td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-200">
                    {formatVND(currentSummary.totalDaily, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                    {formatVND(currentSummary.totalMonthly, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-amber-400">
                    {formatVND(currentSummary.totalMonthlyVat, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-cyan-300">
                    {formatVND(currentSummary.totalReduced30Vat, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-emerald-300">
                    {formatVND(currentSummary.totalReducedExtra30Vat, 'million')}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono text-purple-300">
                    {formatVND(
                      currentSummary.items.reduce((s, i) => s + (i.spentThisMonth || 0), 0),
                      'million'
                    )}
                  </td>
                  <td className="py-3.5 px-3 text-center font-mono text-emerald-400">
                    {currentSummary.totalMonthlyVat > 0
                      ? (
                          (currentSummary.items.reduce((s, i) => s + (i.spentThisMonth || 0), 0) /
                            currentSummary.totalMonthlyVat) *
                          100
                        ).toFixed(1) + '%'
                      : '100%'}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: SIMULATION PLANNER & ROAS CALCULATOR */}
      {activeViewMode === 'simulation' && (
        <div className="space-y-6">
          {/* Scenario Selector & Custom Sliders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Scenario Selector */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-4">
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
            <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl space-y-5 flex flex-col justify-between">
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
            <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
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
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4 flex flex-col justify-between">
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
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
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
                    </div>
                    <div className="text-lg font-black text-white font-mono">
                      {formatVND(chBudget, 'million')}
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${ch.percent}%`, backgroundColor: ch.color }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                      <span>Tỷ trọng</span>
                      <span className="font-bold text-white">{ch.percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
