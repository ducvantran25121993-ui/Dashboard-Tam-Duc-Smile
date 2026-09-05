import React from 'react';
import {
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Wallet,
  Users,
  Percent,
  Sparkles,
  CalendarRange,
} from 'lucide-react';
import { MonthDataset } from '../data/revenueData';
import { DisplayUnit, MonthTab } from '../types';
import {
  getCustomRangeBreakdown,
  CustomRangeBreakdownSummary,
  formatRangeLabel,
} from '../utils/quarterAggregator';
import { formatVND, formatPercent } from '../utils/formatters';

interface CustomRangeBannerProps {
  months: number[];
  monthlyData: MonthDataset[];
  displayUnit: DisplayUnit;
  onSelectTab: (tab: MonthTab) => void;
}

const MONTH_PALETTE = [
  { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/40', bar: '#06b6d4' },
  { bg: 'bg-blue-500', text: 'text-blue-400', border: 'border-blue-500/40', bar: '#3b82f6' },
  { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/40', bar: '#6366f1' },
  { bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/40', bar: '#a855f7' },
  { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: '#10b981' },
  { bg: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/40', bar: '#f59e0b' },
  { bg: 'bg-rose-500', text: 'text-rose-400', border: 'border-rose-500/40', bar: '#f43f5e' },
  { bg: 'bg-teal-500', text: 'text-teal-400', border: 'border-teal-500/40', bar: '#14b8a6' },
  { bg: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/40', bar: '#f97316' },
  { bg: 'bg-violet-500', text: 'text-violet-400', border: 'border-violet-500/40', bar: '#8b5cf6' },
];

export const CustomRangeBanner: React.FC<CustomRangeBannerProps> = ({
  months,
  monthlyData,
  displayUnit,
  onSelectTab,
}) => {
  const summary: CustomRangeBreakdownSummary = getCustomRangeBreakdown(
    months,
    monthlyData
  );
  const {
    months: monthContributions,
    rangeLabel,
    totalRevenue,
    totalCostVAT,
    totalProfit,
    avgCostRatio,
    totalDataDV,
    totalDataCL,
    topMonthByRevenue,
  } = summary;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-blue-500/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-6 quarter-summary-banner">
      {/* Background glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Title */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
            <CalendarRange className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40 uppercase tracking-wider">
                Tổng Hợp {months.length} Tháng
              </span>
              <span className="text-xs text-slate-400">
                Lũy kế {months.length} tháng: {rangeLabel} / 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>Báo Cáo Tổng Hợp {rangeLabel}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold hidden md:inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Hợp Nhất {months.length} Tháng
              </span>
            </h2>
          </div>
        </div>

        {/* Quick Highlights Pill */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Tổng DT {months.length} Tháng:</span>
            <span className="font-bold text-emerald-300">
              {formatVND(totalRevenue, displayUnit)}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">CP/DT TB:</span>
            <span className="font-bold text-amber-300">
              {formatPercent(avgCostRatio)}
            </span>
          </div>

          {topMonthByRevenue && (
            <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-1.5">
              <span className="text-slate-400">Tháng DT Cao Nhất:</span>
              <span className="font-bold text-cyan-300">
                {topMonthByRevenue.label} ({formatVND(topMonthByRevenue.revenue, displayUnit)})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Revenue Share Bar */}
      <div className="pt-4 pb-3">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
          <span>Tỷ Trọng Đóng Góp Doanh Thu Từng Tháng ({months.length} Tháng):</span>
          <span>Tổng: 100%</span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full bg-slate-800/80 rounded-full overflow-hidden flex p-0.5 gap-0.5 border border-slate-700/50">
          {monthContributions.map((m, idx) => {
            const palette = MONTH_PALETTE[idx % MONTH_PALETTE.length];
            const widthPct = Math.max(m.revenueShare, 0);
            if (widthPct === 0) return null;

            return (
              <div
                key={m.monthNum}
                style={{ width: `${widthPct}%`, backgroundColor: palette.bar }}
                className="h-full rounded-full transition-all duration-500 relative group cursor-pointer"
                title={`${m.label}: ${formatVND(m.revenue, displayUnit)} (${formatPercent(m.revenueShare)})`}
                onClick={() => onSelectTab(m.monthNum as any)}
              />
            );
          })}
        </div>
      </div>

      {/* Month Breakdown Cards Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${months.length >= 6 ? 'lg:grid-cols-6' : 'lg:grid-cols-' + months.length} gap-3 pt-2`}>
        {monthContributions.map((m, idx) => {
          const palette = MONTH_PALETTE[idx % MONTH_PALETTE.length];
          const isTop = topMonthByRevenue && topMonthByRevenue.monthNum === m.monthNum;

          return (
            <div
              key={m.monthNum}
              className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                isTop
                  ? 'bg-gradient-to-b from-blue-950/40 to-slate-900 border-blue-500/50 ring-1 ring-blue-400/30'
                  : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Month Title & Share Badge */}
                <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-slate-800/70">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: palette.bar }}
                    />
                    <span className="text-xs font-bold text-white tracking-tight">
                      {m.label}
                    </span>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${palette.text} bg-slate-900 border ${palette.border}`}>
                    {formatPercent(m.revenueShare)} DT
                  </span>
                </div>

                {/* Key Month Metrics */}
                <div className="space-y-1.5 pt-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      Doanh Thu:
                    </span>
                    <span className="font-bold text-emerald-400">
                      {formatVND(m.revenue, displayUnit)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-amber-400" />
                      Chi Phí VAT:
                    </span>
                    <span className="font-semibold text-amber-300">
                      {formatVND(m.costVAT, displayUnit)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Percent className="w-3 h-3 text-cyan-400" />
                      Tỷ Lệ CP:
                    </span>
                    <span className={`font-semibold ${
                      m.costRatio > 25 ? 'text-rose-400' : 'text-cyan-300'
                    }`}>
                      {formatPercent(m.costRatio)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Users className="w-3 h-3 text-purple-400" />
                      Data DV / CL:
                    </span>
                    <span className="font-mono text-slate-300">
                      {m.dataDV.toLocaleString('vi-VN')} / <span className="text-purple-300 font-bold">{m.dataCL.toLocaleString('vi-VN')}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Drill-down button to view single month */}
              <button
                onClick={() => onSelectTab(m.monthNum as any)}
                className="mt-3 pt-2 border-t border-slate-800/60 w-full flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-400 hover:text-blue-300 group cursor-pointer transition-colors"
                title={`Bấm để xem chi tiết riêng ${m.label}`}
              >
                <span>Xem riêng {m.label}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
