import React from 'react';
import { DollarSign, Wallet, TrendingUp, Percent, Award, ArrowUpRight, Users } from 'lucide-react';
import { DisplayUnit } from '../types';
import { formatVND, formatPercent, isVietKieuRegion } from '../utils/formatters';
import { MonthDataset } from '../data/revenueData';

interface KPISummaryProps {
  monthData: MonthDataset;
  displayUnit: DisplayUnit;
}

export const KPISummary: React.FC<KPISummaryProps> = ({ monthData, displayUnit }) => {
  // Exclude Việt Kiều revenue from total revenue calculation as requested
  const totalRevenue = monthData.regions.reduce(
    (acc, r) => acc + (isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
    0
  );
  const totalCostVAT = monthData.regions.reduce((acc, r) => acc + (r.costVAT || 0), 0);
  const totalProfit = totalRevenue - totalCostVAT;
  const avgCostRatio = totalRevenue > 0 ? (totalCostVAT / totalRevenue) * 100 : 0;

  // Calculate total Data Dịch Vụ and Data Chat Luong for the month
  const totalDataDichVu = monthData.regions.reduce((acc, r) => {
    const svcSum = r.services.reduce((sSum, s) => sSum + (s.dataCount || 0), 0);
    return acc + (svcSum > 0 ? svcSum : (r.totalData || 0));
  }, 0);

  const totalDataChatLuong = monthData.regions.reduce((acc, r) => {
    return acc + (r.dataChatLuong || 0);
  }, 0);

  const qualityRatio = totalDataDichVu > 0 ? (totalDataChatLuong / totalDataDichVu) * 100 : 0;

  // Find top revenue region (excluding Việt Kiều)
  const nonVietKieuRegions = monthData.regions.filter((r) => !isVietKieuRegion(r.name));
  const topRevenueRegion = [...nonVietKieuRegions].sort((a, b) => b.revenue - a.revenue)[0];

  // Find lowest cost ratio region with revenue > 0 (excluding Việt Kiều)
  const validRatioRegions = nonVietKieuRegions.filter((r) => r.revenue > 0);
  const topRatioRegion = [...validRatioRegions].sort(
    (a, b) => (a.costVAT / a.revenue) - (b.costVAT / b.revenue)
  )[0];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {/* Total Revenue */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tổng Doanh Thu
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-white tracking-tight">
            {formatVND(totalRevenue, displayUnit)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-emerald-400 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Toàn khu vực (Đã trừ DT Việt Kiều)</span>
          </div>
        </div>
      </div>

      {/* Total Cost VAT */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tổng Chi Phí (VAT)
          </span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-amber-400 tracking-tight">
            {formatVND(totalCostVAT, displayUnit)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
            <span>Chi Phí (VAT) toàn khu vực</span>
          </div>
        </div>
      </div>

      {/* Net Profit & Margin */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Lợi Nhuận Thuần
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <p className={`text-2xl font-bold tracking-tight ${totalProfit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
            {formatVND(totalProfit, displayUnit)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-400 font-medium">
            <span>Doanh Thu - Chi Phí VAT</span>
          </div>
        </div>
      </div>

      {/* Cost Ratio % & Top Region */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Tỷ Lệ CP / DT
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-purple-300 tracking-tight">
              {formatPercent(avgCostRatio)}
            </p>
            {topRevenueRegion && (
              <span className="text-xs font-medium text-slate-400 truncate max-w-[120px]">
                Top: <strong className="text-white">{topRevenueRegion.name}</strong>
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">
              Tối ưu: {topRatioRegion ? topRatioRegion.name : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Total Data DV & Data CL */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Data DV & Data CL
          </span>
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl font-bold text-cyan-400 tracking-tight">
              {totalDataDichVu.toLocaleString('vi-VN')}
            </p>
            <span className="text-xs text-slate-400 font-normal">DV</span>
            <span className="text-slate-600 font-bold mx-0.5">•</span>
            <span className="text-xl font-bold text-emerald-400">
              {totalDataChatLuong.toLocaleString('vi-VN')}
            </span>
            <span className="text-xs text-slate-400 font-normal">CL</span>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-slate-400 font-medium">
            <span>Tỷ lệ chất lượng:</span>
            <strong className="text-emerald-400">{formatPercent(qualityRatio)}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
