import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users2,
  Megaphone,
  Lightbulb,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Activity,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  Flame,
  Award,
  Bot,
  Zap,
  Swords,
  Download,
  Copy,
  Check,
  Filter,
  PieChart,
  Share2,
  Percent,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { MonthDataset } from '../data/revenueData';
import { DisplayUnit, SidebarTab } from '../types';
import { isVietKieuRegion, formatVND, formatPercent, formatChartAxisVND } from '../utils/formatters';
import { getActiveAIModelBadge } from '../utils/aiBadgeHelper';

interface WorkOverviewProps {
  monthlyDatasets: MonthDataset[];
  displayUnit: DisplayUnit;
  onNavigateToTab: (tab: SidebarTab) => void;
  isLive: boolean;
  lastUpdated: Date | null;
}

type PeriodFilter = 'all' | 'q1' | 'q2' | 'month_1' | 'month_2' | 'month_3' | 'month_4' | 'month_5' | 'month_6';

export const WorkOverview: React.FC<WorkOverviewProps> = ({
  monthlyDatasets,
  displayUnit,
  onNavigateToTab,
  isLive,
  lastUpdated,
}) => {
  const [currentAiBadge, setCurrentAiBadge] = useState(() => getActiveAIModelBadge());
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodFilter>('all');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [viewMode, setViewMode] = useState<'both' | 'chart' | 'table'>('both');

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentAiBadge(getActiveAIModelBadge());
    };
    window.addEventListener('storage', handleUpdate);
    return () => window.removeEventListener('storage', handleUpdate);
  }, []);

  // Filter datasets based on selected period
  const filteredDatasets = useMemo(() => {
    if (selectedPeriod === 'all') return monthlyDatasets;
    if (selectedPeriod === 'q1') {
      return monthlyDatasets.filter((m) => m.month >= 1 && m.month <= 3);
    }
    if (selectedPeriod === 'q2') {
      return monthlyDatasets.filter((m) => m.month >= 4 && m.month <= 6);
    }
    if (selectedPeriod.startsWith('month_')) {
      const mNum = parseInt(selectedPeriod.replace('month_', ''), 10);
      return monthlyDatasets.filter((m) => m.month === mNum);
    }
    return monthlyDatasets;
  }, [monthlyDatasets, selectedPeriod]);

  // Aggregate revenue (excluding Việt Kiều) & costs across filtered months
  const totalRevenue = useMemo(() => {
    return filteredDatasets.reduce(
      (sum, m) =>
        sum +
        m.regions.reduce(
          (rSum, r) => rSum + (isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
          0
        ),
      0
    );
  }, [filteredDatasets]);

  const totalVietKieuRevenue = useMemo(() => {
    return filteredDatasets.reduce(
      (sum, m) =>
        sum +
        m.regions.reduce(
          (rSum, r) => rSum + (isVietKieuRegion(r.name) ? (r.revenue || 0) : 0),
          0
        ),
      0
    );
  }, [filteredDatasets]);

  const totalCostVAT = useMemo(() => {
    return filteredDatasets.reduce(
      (sum, m) => sum + m.regions.reduce((rSum, r) => rSum + (r.costVAT || 0), 0),
      0
    );
  }, [filteredDatasets]);

  // Calculate Data Thô across filtered months
  const totalDataTho = useMemo(() => {
    return filteredDatasets.reduce((sum, m) => {
      return (
        sum +
        m.regions.reduce((rSum, r) => {
          const svcSum = r.services?.reduce((sSum, s) => sSum + (s.dataCount || 0), 0) || 0;
          return rSum + (svcSum > 0 ? svcSum : (r.totalData || 0));
        }, 0)
      );
    }, 0);
  }, [filteredDatasets]);

  // Calculate Data CL (Chất Lượng) across filtered months
  const totalDataCL = useMemo(() => {
    return filteredDatasets.reduce((sum, m) => {
      return (
        sum +
        m.regions.reduce((rSum, r) => rSum + (r.dataChatLuong || 0), 0)
      );
    }, 0);
  }, [filteredDatasets]);

  // Total Leads = Data Thô + Data CL
  const totalLeads = totalDataTho + totalDataCL;
  const overallProfit = totalRevenue - totalCostVAT;
  const roas = totalCostVAT > 0 ? (totalRevenue / totalCostVAT).toFixed(1) : '0';
  const costRatio = totalRevenue > 0 ? ((totalCostVAT / totalRevenue) * 100).toFixed(1) : '0';
  const grandRatio = totalRevenue > 0 ? (totalCostVAT / totalRevenue) * 100 : 0;
  const isGrandKpiMet = grandRatio <= 15.0;
  const qualityLeadRate = totalDataTho > 0 ? (totalDataCL / totalDataTho) * 100 : 0;

  // Aggregate list by month for Table and Chart
  const monthlyAggregateList = useMemo(() => {
    const list = monthlyDatasets.map((m) => {
      const dataDichVu = m.regions.reduce((sum, r) => {
        const svcSum = r.services?.reduce((sSum, s) => sSum + (s.dataCount || 0), 0) || 0;
        return sum + (svcSum > 0 ? svcSum : (r.totalData || 0));
      }, 0);

      const dataChatLuong = m.regions.reduce((sum, r) => sum + (r.dataChatLuong || 0), 0);
      const tyLeCL = dataDichVu > 0 ? (dataChatLuong / dataDichVu) * 100 : 0;

      const revenue = m.regions.reduce(
        (s, r) => s + (isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
        0
      );
      const costVAT = m.regions.reduce((s, r) => s + (r.costVAT || 0), 0);
      const profit = revenue - costVAT;
      const hasData = revenue > 0 || costVAT > 0 || dataDichVu > 0;
      const ratio = revenue > 0 ? (costVAT / revenue) * 100 : 0;
      const isKpiMet = hasData && ratio <= 15.0;

      return {
        monthLabel: m.label,
        monthNum: m.month,
        dataDichVu,
        dataChatLuong,
        tyLeCL,
        revenue,
        costVAT,
        profit,
        hasData,
        ratio,
        isKpiMet,
      };
    });

    return list;
  }, [monthlyDatasets]);

  // Find max revenue month to award Top Performer badge
  const maxRevenue = useMemo(() => {
    return Math.max(...monthlyAggregateList.filter((m) => m.hasData).map((m) => m.revenue), 0);
  }, [monthlyAggregateList]);

  // Data formatted for Recharts
  const chartData = useMemo(() => {
    return monthlyAggregateList
      .filter((m) => m.hasData)
      .map((m) => ({
        name: m.monthLabel,
        DoanhThu: m.revenue,
        ChiPhi: m.costVAT,
        LoiNhuan: m.profit,
        TyLeCP: parseFloat(m.ratio.toFixed(1)),
        DataDichVu: m.dataDichVu,
        DataCL: m.dataChatLuong,
      }));
  }, [monthlyAggregateList]);

  const formatCurrency = (val: number) => {
    if (displayUnit === 'billion') {
      return (val / 1_000_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 2 }) + ' Tỷ';
    }
    if (displayUnit === 'million') {
      return (val / 1_000_000).toLocaleString('vi-VN', { maximumFractionDigits: 1 }) + ' Tr';
    }
    return val.toLocaleString('vi-VN') + ' đ';
  };

  // Export CSV function
  const handleExportCSV = () => {
    const headers = [
      'Thang',
      'Data Dich Vu',
      'Data Chat Luong',
      'Ty Le CL (%)',
      'Doanh Thu (VND)',
      'Chi Phi VAT (VND)',
      'Loi Nhuan (VND)',
      'Ty Le CP/DT (%)',
      'Dat KPI (<=15%)',
    ];

    const rows = monthlyAggregateList.map((m) => [
      `"${m.monthLabel}"`,
      m.dataDichVu,
      m.dataChatLuong,
      m.tyLeCL.toFixed(1),
      Math.round(m.revenue),
      Math.round(m.costVAT),
      Math.round(m.profit),
      m.hasData ? m.ratio.toFixed(1) : '0',
      m.isKpiMet ? 'Dat KPI' : 'Chua Dat',
    ]);

    // Add total row
    rows.push([
      '"TONG CONG"',
      totalDataTho,
      totalDataCL,
      qualityLeadRate.toFixed(1),
      Math.round(totalRevenue),
      Math.round(totalCostVAT),
      Math.round(overallProfit),
      grandRatio.toFixed(1),
      isGrandKpiMet ? 'Dat KPI' : 'Chua Dat',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Bao_Cao_Tong_Quan_Marketing_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Executive summary for Zalo/Telegram
  const handleCopySummary = () => {
    const summaryText = `📊 BÁO CÁO HIỆU SUẤT MARKETING TỔNG QUAN
----------------------------------------
💰 Tổng Doanh Thu: ${(totalRevenue / 1_000_000_000).toFixed(2)} Tỷ VNĐ (ROAS: ${roas}x)
📉 Tổng Chi Phí Ads: ${(totalCostVAT / 1_000_000_000).toFixed(2)} Tỷ VNĐ (Tỷ lệ: ${costRatio}%)
💎 Lợi Nhuận Chênh Lệch: ${(overallProfit / 1_000_000_000).toFixed(2)} Tỷ VNĐ
👥 Tổng Data Leads: ${totalLeads.toLocaleString('vi-VN')} (Thô: ${totalDataTho.toLocaleString('vi-VN')} | CL: ${totalDataCL.toLocaleString('vi-VN')} ~ ${qualityLeadRate.toFixed(1)}%)
🎯 Trạng Thái KPI: ${isGrandKpiMet ? '✅ ĐẠT CHỈ TIÊU (≤15%)' : '⚠️ VƯỢT MỨC TRẦN KPI'}
----------------------------------------
Xuất từ Dashboard Quản Trị Marketing Tâm Đức Smile`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 3000);
  };

  const initiatives = [
    {
      id: 1,
      title: 'Gói Implant Kiều Bào "3 Ngày Hoàn Tất Trước Khi Bay"',
      target: 'Tối ưu phễu khách Việt Kiều về nước thăm thân / nghỉ hè',
      status: 'Đang test',
      statusColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      expectedImpact: '+35% Doanh thu Việt Kiều',
      leadsEstimate: '180+ case/tháng',
    },
    {
      id: 2,
      title: 'Chiến Dịch Google Ads "Thẩm Mỹ Nụ Cười — Trả Góp 0%"',
      target: 'Thu hút tệp khách hàng văn phòng làm Răng Sứ thẩm mỹ',
      status: 'Đã triển khai',
      statusColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
      expectedImpact: '+28% Tỷ lệ chốt',
      leadsEstimate: '450+ leads/tháng',
    },
    {
      id: 3,
      title: 'Landing Page VIP Cá Nhân Hóa Theo Dịch Vụ Cấp Cao',
      target: 'Hạ chi phí CPA Google Ads xuống dưới 12% doanh thu',
      status: 'Tối ưu A/B',
      statusColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      expectedImpact: '-15% Chi phí VAT',
      leadsEstimate: 'Tối ưu chi phí CPA',
    },
    {
      id: 4,
      title: 'Trợ Lý Ảo AI Phân Loại & Đề Xuất Kịch Bản Telesales',
      target: 'Nâng tỷ lệ khách đến phòng khám thực tế sau khi để lại SĐT',
      status: 'Đang phát triển',
      statusColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      expectedImpact: '+22% Show-up Rate',
      leadsEstimate: '100% tự động',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Overview Mission, Period Filter & Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950/80 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Trung Tâm Quản Trị Hiệu Suất C-Level
              </span>
              {isLive && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Sync
                </span>
              )}
              {lastUpdated && (
                <span className="text-[11px] text-slate-400">
                  Cập nhật: {lastUpdated.toLocaleTimeString('vi-VN')}
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tổng Quan Doanh Thu & Hiệu Quả Tăng Trưởng
            </h2>
            <p className="text-slate-400 text-sm max-w-3xl leading-relaxed">
              Phân tích chỉ số tài chính, tốc độ đốt ngân sách Google Ads, năng suất phễu chuyển đổi và radar tăng trưởng hệ thống nha khoa.
            </p>
          </div>

          {/* Quick Action Tools: Export CSV, Copy Summary, View Google Ads */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Xuất bảng số liệu tổng hợp định dạng CSV / Excel"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Xuất Excel/CSV</span>
            </button>

            <button
              onClick={handleCopySummary}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm cursor-pointer ${
                copiedSummary
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-500'
              }`}
              title="Sao chép bản tóm tắt số liệu để gửi Zalo / Telegram nội bộ"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copiedSummary ? 'Đã Sao Chép!' : 'Copy Gửi Zalo'}</span>
            </button>

            <button
              onClick={() => onNavigateToTab('google_ads')}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Xem Báo Cáo Chi Tiết</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Interactive Quick Time Filter Bar */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-300">Bộ Lọc Kỳ Báo Cáo:</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setSelectedPeriod('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              Toàn Bộ Dữ Liệu
            </button>

            <button
              onClick={() => setSelectedPeriod('q1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === 'q1'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              Quý 1 (T1 - T3)
            </button>

            <button
              onClick={() => setSelectedPeriod('q2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === 'q2'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                  : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
              }`}
            >
              Quý 2 (T4 - T6)
            </button>

            {monthlyDatasets.map((m) => (
              <button
                key={m.month}
                onClick={() => setSelectedPeriod(`month_${m.month}` as PeriodFilter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedPeriod === `month_${m.month}`
                    ? 'bg-indigo-500 text-white font-bold shadow-md shadow-indigo-500/30'
                    : 'bg-slate-800/50 hover:bg-slate-700 text-slate-400 border border-slate-700/40'
                }`}
              >
                T{m.month}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1: Total Revenue */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <TrendingUp className="w-3.5 h-3.5" /> ROAS {roas}x
              </span>
              <span className="text-slate-500">• (Đã trừ Việt Kiều)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Total Cost VAT */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Chi Phí VAT</span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatCurrency(totalCostVAT)}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className={`font-bold ${isGrandKpiMet ? 'text-emerald-400' : 'text-rose-400'}`}>
                Tỷ lệ chi phí: {costRatio}%
              </span>
              <span className="text-slate-500">• {isGrandKpiMet ? 'Mức an toàn' : 'Vượt trần'}</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Lợi Nhuận Gộp */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lợi Nhuận Chênh Lệch</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
              {formatCurrency(overallProfit)}
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
              <span className="text-emerald-400 font-semibold">Biên lợi nhuận {totalRevenue > 0 ? ((overallProfit / totalRevenue) * 100).toFixed(1) : 0}%</span>
              <span>• Sau trừ Ads</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Total Leads / Data */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng Data Khách Hàng</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Users2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
              <span>{totalLeads.toLocaleString('vi-VN')}</span>
              <span className="text-sm font-semibold text-purple-300">leads</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-medium">
                Thô: <strong className="font-bold text-white">{totalDataTho.toLocaleString('vi-VN')}</strong>
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-medium">
                CL: <strong className="font-bold text-white">{totalDataCL.toLocaleString('vi-VN')}</strong> ({qualityLeadRate.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Marketing Health & Strategic Pulse (4 Strategic Indicators) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kiểm Soát Ngân Sách</div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <span>Tỷ Lệ Chi Phí {costRatio}%</span>
              {isGrandKpiMet ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold">An Toàn</span>
              ) : (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold">Cần Giảm</span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hệ Số Sinh Lời (ROAS)</div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <span>{roas}x Doanh Thu / Ads</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 font-bold">Rất Tốt</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
            <Users2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chất Lượng Khách Hàng</div>
            <div className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
              <span>{qualityLeadRate.toFixed(1)}% Lead Chuẩn</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 font-bold">Đúng Tệp</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3.5 shadow-md">
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doanh Thu Việt Kiều</div>
            <div className="text-sm font-extrabold text-amber-300 flex items-center gap-1.5 mt-0.5">
              <span>{formatCurrency(totalVietKieuRevenue)}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-bold">Phân Khúc VIP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Quick Work Category Cards - 2 Rows Professional Layout */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-sm">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Phân Chia Tab Công Việc</h3>
              <p className="text-xs text-slate-400">Chọn nhanh luồng làm việc chuyên biệt theo 2 nhóm chức năng</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-400 bg-slate-800/60 px-3 py-1 rounded-full border border-slate-700/60 self-start sm:self-auto">
            6 Phân Hệ Vận Hành & Tăng Trưởng
          </span>
        </div>

        {/* DÒNG 1: QUẢN TRỊ DOANH THU & CHIẾN DỊCH CHUYỂN ĐỔI */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/50" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300/90">
              Nhóm 1: Quản Trị Doanh Thu, Phễu & Chiến Dịch Quảng Cáo
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {/* Card 1: Google Ads Dashboard */}
            <div
              onClick={() => onNavigateToTab('google_ads')}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 hover:from-slate-800 hover:to-slate-850 border border-slate-700/70 hover:border-cyan-400/60 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-cyan-500/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    Live Sheet
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-3.5 group-hover:text-cyan-300 transition-colors">
                  Google Ads Dashboard
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                  Báo cáo chi phí (VAT), doanh thu từng tháng, data dịch vụ ngày và thống kê khách Việt Kiều.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Mở bảng dữ liệu</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 2: Lead & Phễu Chuyển Đổi */}
            <div
              onClick={() => onNavigateToTab('leads_funnel')}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 hover:from-slate-800 hover:to-slate-850 border border-slate-700/70 hover:border-blue-400/60 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-blue-500/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users2 className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Phễu Sales
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-3.5 group-hover:text-blue-300 transition-colors">
                  Lead & Phễu Chuyển Đổi
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                  Theo dõi hành trình khách hàng từ lúc bấm quảng cáo đến khi tư vấn, chốt hẹn và đến phòng khám.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                <span>Xem phân tích phễu</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 3: Chiến Dịch Quảng Cáo */}
            <div
              onClick={() => onNavigateToTab('campaigns')}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 hover:from-slate-800 hover:to-slate-850 border border-slate-700/70 hover:border-amber-400/60 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-amber-500/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                    Active Ads
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-3.5 group-hover:text-amber-300 transition-colors">
                  Chiến Dịch Quảng Cáo
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                  Chiến dịch Google Search, Performance Max, Youtube & Mạng hiển thị theo từng tỉnh thành.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-amber-400 group-hover:text-amber-300">
                <span>Quản lý chiến dịch</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* DÒNG 2: ĐỐI THỦ CẠNH TRANH, SÁNG TẠO & TRÍ TUỆ AI */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 shadow-sm shadow-purple-400/50" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300/90">
              Nhóm 2: Radar Đối Thủ, Sáng Kiến Mới & Trí Tuệ Nhân Tạo AI
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
            {/* Card 4: Theo dõi đối thủ */}
            <div
              onClick={() => onNavigateToTab('competitor')}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 hover:from-slate-800 hover:to-slate-850 border border-slate-700/70 hover:border-indigo-400/60 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-indigo-500/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Swords className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    Radar AI
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-3.5 group-hover:text-indigo-300 transition-colors">
                  Theo Dõi Đối Thủ
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                  Auction insights, radar mẫu quảng cáo, so sánh bảng giá và chiến lược phản công đè đối thủ.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Xem radar đối thủ</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 5: Sáng Tạo & Đổi Mới */}
            <div
              onClick={() => onNavigateToTab('innovation')}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800/70 to-slate-900/90 hover:from-slate-800 hover:to-slate-850 border border-slate-700/70 hover:border-purple-400/60 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-purple-500/10 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30">
                    AI Gợi Ý
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-3.5 group-hover:text-purple-300 transition-colors">
                  Sáng Tạo & Đổi Mới
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                  Khám phá ý tưởng mới: Livestream, mini-tool nụ cười, tối ưu Google Ads & kịch bản đón kiều bào.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:text-purple-300">
                <span>Mở phòng thử nghiệm</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>

            {/* Card 6: Trợ Lý AI Copilot */}
            <div
              onClick={() => onNavigateToTab('ai_agent')}
              className="group p-5 rounded-2xl bg-gradient-to-b from-slate-800/80 via-indigo-950/40 to-slate-900/95 hover:from-slate-800 hover:to-indigo-950/60 border border-indigo-500/40 hover:border-cyan-400/70 cursor-pointer transition-all duration-200 shadow-lg hover:shadow-cyan-500/15 relative overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform">
                    <Bot className="w-5 h-5 text-cyan-300" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all ${currentAiBadge.color}`}>
                    {currentAiBadge.shortName}
                  </span>
                </div>
                <h4 className="text-base font-bold text-white mt-3.5 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
                  Trợ Lý AI
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                </h4>
                <p className="text-xs leading-relaxed text-slate-400 mt-1.5 line-clamp-2">
                  Chat trực tiếp với AI thông minh phân tích số liệu thực tế, tối ưu Ads & kịch bản Telesales tự động.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                <span>Trò chuyện cùng AI</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Analytics & Aggregated Performance Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Chế Độ Hiển Thị Phân Tích & Báo Cáo</h3>
            <p className="text-xs text-slate-400">Chuyển đổi linh hoạt giữa biểu đồ trực quan, bảng số liệu hoặc hiển thị cả hai</p>
          </div>
        </div>

        <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              viewMode === 'both' ? 'bg-cyan-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tất Cả
          </button>
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              viewMode === 'chart' ? 'bg-cyan-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chỉ Biểu Đồ
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
              viewMode === 'table' ? 'bg-cyan-500 text-slate-950 shadow font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Chỉ Bảng Số Liệu
          </button>
        </div>
      </div>

      {/* Executive Visual Combo Chart (Biểu Đồ Trực Quan Tăng Trưởng Doanh Thu vs Chi Phí Ads) */}
      {(viewMode === 'both' || viewMode === 'chart') && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Biểu Đồ Tương Quan Doanh Thu & Tỷ Lệ Chi Phí Ads</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                    KPI Line: 15%
                  </span>
                </h3>
                <p className="text-xs text-slate-400">So sánh trực quan Doanh thu, Chi phí, Lợi nhuận và đường % CP/DT theo từng tháng</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-cyan-300 border border-slate-700">
                Dữ liệu theo {selectedPeriod === 'all' ? 'Toàn Bộ Dữ Liệu' : selectedPeriod === 'q1' ? 'Quý 1' : selectedPeriod === 'q2' ? 'Quý 2' : selectedPeriod.replace('month_', 'Tháng ')}
              </span>
            </div>
          </div>

          <div className="h-80 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="colorDoanhThu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="colorChiPhi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3} />
                  </linearGradient>
                  <linearGradient id="colorLoiNhuan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  tickFormatter={(val) => formatChartAxisVND(val)}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#ec4899"
                  tick={{ fill: '#ec4899', fontSize: 11 }}
                  tickFormatter={(val) => `${val}%`}
                  domain={[0, 30]}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-xs space-y-2 min-w-56">
                          <div className="font-bold text-white border-b border-slate-800 pb-1.5 flex items-center justify-between">
                            <span>{label}</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              data.TyLeCP <= 15 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {data.TyLeCP <= 15 ? 'Đạt KPI' : 'Vượt KPI'}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-cyan-300">
                              <span>Doanh Thu:</span>
                              <strong className="text-white">{formatVND(data.DoanhThu, displayUnit)}</strong>
                            </div>
                            <div className="flex justify-between items-center text-amber-300">
                              <span>Chi Phí Ads:</span>
                              <strong className="text-white">{formatVND(data.ChiPhi, displayUnit)}</strong>
                            </div>
                            <div className="flex justify-between items-center text-emerald-300">
                              <span>Lợi Nhuận:</span>
                              <strong className="text-white">{formatVND(data.LoiNhuan, displayUnit)}</strong>
                            </div>
                            <div className="flex justify-between items-center text-pink-400 pt-1 border-t border-slate-800">
                              <span>Tỷ Lệ % CP/DT:</span>
                              <strong className="font-bold">{data.TyLeCP}%</strong>
                            </div>
                            <div className="flex justify-between items-center text-purple-300">
                              <span>Data CL / Thô:</span>
                              <span>{data.DataCL} / {data.DataDichVu} leads</span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }}
                  formatter={(value) => {
                    const labels: Record<string, string> = {
                      DoanhThu: 'Doanh Thu (VND)',
                      ChiPhi: 'Chi Phí Ads (VAT)',
                      LoiNhuan: 'Lợi Nhuận Chênh Lệch',
                      TyLeCP: 'Tỷ Lệ % CP/DT (Trục phải)',
                    };
                    return <span className="text-slate-300">{labels[value] || value}</span>;
                  }}
                />
                <ReferenceLine
                  yAxisId="right"
                  y={15}
                  stroke="#ef4444"
                  strokeDasharray="4 4"
                  label={{
                    value: 'Trần KPI 15%',
                    position: 'top',
                    fill: '#ef4444',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                />
                <Bar yAxisId="left" dataKey="DoanhThu" fill="url(#colorDoanhThu)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar yAxisId="left" dataKey="ChiPhi" fill="url(#colorChiPhi)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Bar yAxisId="left" dataKey="LoiNhuan" fill="url(#colorLoiNhuan)" radius={[6, 6, 0, 0]} maxBarSize={32} />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="TyLeCP"
                  stroke="#ec4899"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3. Bảng Aggregate Tổng Quan với Mini Progress Bars & Top Performer Badge */}
      {(viewMode === 'both' || viewMode === 'table') && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Bảng Aggregate Tổng Quan Hiệu Suất Từng Tháng</span>
            </h3>
            <div className="text-xs text-slate-400 flex items-center gap-2">
              <span className="font-medium">Chỉ tiêu KPI % CP/DT:</span>
              <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
                ≤ 15.0%
              </span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">Tháng</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Data Dịch Vụ</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Data CL</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Tỷ Lệ CL</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Doanh Thu</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Chi Phí (VAT)</th>
                  <th className="py-3.5 px-4 text-right whitespace-nowrap">Lợi Nhuận</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap">% CP/DT</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap">Đạt KPI (≤15%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-900/50">
                {monthlyAggregateList.map((m) => {
                  const isTopRevenue = m.hasData && m.revenue === maxRevenue && maxRevenue > 0;
                  return (
                    <tr key={m.monthNum} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white text-sm whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span>{m.monthLabel}</span>
                          {isTopRevenue && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold flex items-center gap-0.5" title="Tháng có doanh thu cao nhất">
                              <Award className="w-3 h-3 text-amber-400" />
                              Top 1
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-cyan-400 text-sm whitespace-nowrap">
                        {m.dataDichVu.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white text-sm whitespace-nowrap">
                        {m.dataChatLuong.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-semibold text-slate-200 text-sm">{formatPercent(m.tyLeCL)}</span>
                          <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-cyan-400"
                              style={{ width: `${Math.min(m.tyLeCL, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                        {formatVND(m.revenue, displayUnit)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-amber-400 text-sm whitespace-nowrap">
                        {formatVND(m.costVAT, displayUnit)}
                      </td>
                      <td className={`py-3.5 px-4 text-right font-bold text-sm whitespace-nowrap ${m.profit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                        {formatVND(m.profit, displayUnit)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {m.hasData ? (
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-bold text-sm ${m.ratio <= 15 ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {formatPercent(m.ratio)}
                            </span>
                            <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className={`h-full rounded-full ${m.ratio <= 15 ? 'bg-emerald-400' : 'bg-rose-500'}`}
                                style={{ width: `${Math.min((m.ratio / 25) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {!m.hasData ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                            Chưa có số liệu
                          </span>
                        ) : m.isKpiMet ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Đạt KPI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3.5 h-3.5" />
                            Chưa Đạt
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-slate-800 font-bold text-white border-t-2 border-slate-700 whitespace-nowrap">
                <tr>
                  <td className="py-3.5 px-4 text-sm whitespace-nowrap">TỔNG QUAN</td>
                  <td className="py-3.5 px-4 text-right text-cyan-400 text-base whitespace-nowrap">
                    {totalDataTho.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3.5 px-4 text-right text-white text-base whitespace-nowrap">
                    {totalDataCL.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3.5 px-4 text-right text-slate-200 text-sm font-semibold whitespace-nowrap">
                    {formatPercent(totalDataTho > 0 ? (totalDataCL / totalDataTho) * 100 : 0)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400 text-base whitespace-nowrap">
                    {formatVND(totalRevenue, displayUnit)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-amber-400 text-base whitespace-nowrap">
                    {formatVND(totalCostVAT, displayUnit)}
                  </td>
                  <td className={`py-3.5 px-4 text-right text-base whitespace-nowrap ${overallProfit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                    {formatVND(overallProfit, displayUnit)}
                  </td>
                  <td className="py-3.5 px-4 text-center text-slate-200 text-sm whitespace-nowrap">
                    {formatPercent(grandRatio)}
                  </td>
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    {isGrandKpiMet ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Đạt KPI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        <XCircle className="w-3.5 h-3.5" />
                        Chưa Đạt
                      </span>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 4. Sáng Kiến / Tháng - Nằm ngay dưới Bảng Aggregate */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Sáng Kiến / Tháng</span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Tham Khảo Test
                </span>
              </h3>
              <p className="text-xs text-slate-400">Đi tìm cái CHƯA CÓ — sinh động & tăng tốc tăng trưởng</p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('innovation')}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <span>Xem Toàn Bộ Sáng Tạo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Initiatives Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {initiatives.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/70 hover:border-indigo-400/50 transition-all flex flex-col justify-between space-y-3 hover:bg-slate-800"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                    <span>💡</span>
                    <span>{item.title}</span>
                  </h4>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${item.statusColor}`}
                  >
                    {item.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400">
                  <span className="text-rose-400 font-semibold mr-1">🎯 Mục tiêu:</span>
                  {item.target}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 text-slate-400 border-t border-slate-700/50">
                <span className="text-emerald-400 font-bold">{item.expectedImpact}</span>
                <span className="text-slate-300 text-[11px] font-medium">{item.leadsEstimate}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Notice Card */}
        <div className="rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-900 border border-emerald-500/30 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-emerald-300">Tiến Độ Tháng Này Vượt Chỉ Tiêu</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chi phí VAT được tối ưu ổn định ở mức dưới 15% tổng doanh thu. Data dịch vụ Implant & Răng Sứ tăng trưởng mạnh tại khu vực miền Tây & TP.HCM.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab('google_ads')}
            className="shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 transition-all self-start sm:self-auto cursor-pointer"
          >
            Xem Google Ads
          </button>
        </div>
      </div>
    </div>
  );
};

