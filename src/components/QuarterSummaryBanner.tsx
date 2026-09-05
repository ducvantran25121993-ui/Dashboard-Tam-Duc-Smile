import React from 'react';
import {
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Wallet,
  Users,
  Percent,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { MonthDataset } from '../data/revenueData';
import { DisplayUnit, MonthTab } from '../types';
import {
  QuarterId,
  getQuarterBreakdown,
  QuarterBreakdownSummary,
} from '../utils/quarterAggregator';
import { formatVND, formatPercent } from '../utils/formatters';

interface QuarterSummaryBannerProps {
  quarterId: QuarterId;
  monthlyData: MonthDataset[];
  displayUnit: DisplayUnit;
  onSelectTab: (tab: MonthTab) => void;
}

const MONTH_COLORS = [
  { bg: 'bg-cyan-500', text: 'text-cyan-400', border: 'border-cyan-500/40', bar: '#06b6d4' },
  { bg: 'bg-indigo-500', text: 'text-indigo-400', border: 'border-indigo-500/40', bar: '#6366f1' },
  { bg: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500/40', bar: '#10b981' },
];

export const QuarterSummaryBanner: React.FC<QuarterSummaryBannerProps> = ({
  quarterId,
  monthlyData,
  displayUnit,
  onSelectTab,
}) => {
  const summary: QuarterBreakdownSummary = getQuarterBreakdown(
    quarterId,
    monthlyData
  );
  const { config, months } = summary;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-blue-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden mb-6 quarter-summary-banner">
      {/* Subtle background glow */}
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Top Banner Title */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-500/20 text-blue-300 border border-blue-400/40 uppercase tracking-wider">
                {config.label}
              </span>
              <span className="text-xs text-slate-400">
                Lũy kế 3 tháng: {config.rangeLabel} / 2026
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
              <span>{config.fullName}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold hidden md:inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Đã Hợp Nhất Số Liệu
              </span>
            </h2>
          </div>
        </div>

        {/* Quarter Stats Pill */}
        <div className="flex items-center gap-3 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80 self-start lg:self-center quarter-stat-pill">
          <div className="text-right">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">
              Tổng Doanh Thu Quý
            </p>
            <p className="text-lg font-black text-emerald-400 leading-tight">
              {formatVND(summary.totalRevenue, displayUnit)}
            </p>
          </div>
          <div className="h-7 w-px bg-slate-800" />
          <div className="text-left">
            <p className="text-[11px] font-semibold text-slate-400 uppercase">
              Tổng Chi Phí VAT
            </p>
            <p className="text-lg font-black text-amber-400 leading-tight">
              {formatVND(summary.totalCostVAT, displayUnit)}
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown across the 3 months in the Quarter */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Chi tiết đóng góp 3 tháng trong {config.label}
          </h3>
          <span className="text-xs text-slate-400">
            Bấm "Xem riêng" để xem chi tiết từng tháng
          </span>
        </div>

        {/* 3 Monthly Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {months.map((m, idx) => {
            const color = MONTH_COLORS[idx % MONTH_COLORS.length];

            return (
              <div
                key={m.monthNum}
                className="bg-slate-950/80 border border-slate-800 hover:border-slate-700 rounded-xl p-3.5 flex flex-col justify-between transition-all group quarter-month-card"
              >
                {/* Header of month card */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        m.hasData ? color.bg : 'bg-slate-600'
                      }`}
                    />
                    <span className="font-bold text-white text-sm">
                      {m.label}
                    </span>
                    {m.hasData && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {m.revenueShare.toFixed(1)}% DT Quý
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectTab(m.monthNum as MonthTab)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                    title={`Chuyển sang xem chi tiết ${m.label}`}
                  >
                    <span>Xem riêng</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Metrics */}
                {m.hasData ? (
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                        Doanh Thu:
                      </span>
                      <span className="font-bold text-emerald-400">
                        {formatVND(m.revenue, displayUnit)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Wallet className="w-3.5 h-3.5 text-amber-400" />
                        Chi Phí VAT:
                      </span>
                      <span className="font-bold text-amber-400">
                        {formatVND(m.costVAT, displayUnit)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                        Lợi Nhuận:
                      </span>
                      <span
                        className={`font-bold ${
                          m.profit >= 0 ? 'text-blue-400' : 'text-rose-400'
                        }`}
                      >
                        {formatVND(m.profit, displayUnit)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Percent className="w-3.5 h-3.5 text-purple-400" />
                        Tỷ Lệ CP/DT:
                      </span>
                      <span className="font-bold text-purple-300">
                        {formatPercent(m.costRatio)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        Data DV / Data CL:
                      </span>
                      <span className="font-bold text-cyan-300">
                        {m.dataDV.toLocaleString('vi-VN')} /{' '}
                        {m.dataCL.toLocaleString('vi-VN')}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-5 text-center text-xs text-slate-500 italic">
                    Chờ cập nhật số liệu {m.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Visual Revenue Share Bar across the Quarter */}
        {summary.totalRevenue > 0 && (
          <div className="mt-3.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-medium text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Tỷ trọng đóng góp doanh thu giữa các tháng trong {config.label}:
              </span>
              <span className="text-slate-400 font-semibold">
                100% {config.label}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
              {months.map((m, idx) => {
                if (!m.hasData || m.revenueShare <= 0) return null;
                const color = MONTH_COLORS[idx % MONTH_COLORS.length];
                return (
                  <div
                    key={m.monthNum}
                    style={{ width: `${m.revenueShare}%`, backgroundColor: color.bar }}
                    className="h-full relative group transition-all"
                    title={`${m.label}: ${m.revenueShare.toFixed(1)}% (${formatVND(
                      m.revenue,
                      displayUnit
                    )})`}
                  />
                );
              })}
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 flex-wrap gap-2">
              {months.map((m, idx) => {
                const color = MONTH_COLORS[idx % MONTH_COLORS.length];
                return (
                  <div key={m.monthNum} className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-sm shrink-0"
                      style={{ backgroundColor: color.bar }}
                    />
                    <span>
                      {m.label}:{' '}
                      <strong className="text-slate-200">
                        {m.revenueShare.toFixed(1)}%
                      </strong>{' '}
                      ({formatVND(m.revenue, displayUnit)})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
