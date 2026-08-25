import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { DollarSign, ArrowUpDown, BarChart2, LayoutList } from 'lucide-react';
import { RegionData } from '../data/revenueData';
import { DisplayUnit } from '../types';
import { formatVND, formatChartAxisVND, formatPercent, isVietKieuRegion } from '../utils/formatters';

interface RevenueChartProps {
  regions: RegionData[];
  monthLabel: string;
  displayUnit: DisplayUnit;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({
  regions,
  monthLabel,
  displayUnit,
}) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc' | 'alpha'>('desc');
  const [isHorizontal, setIsHorizontal] = useState(false);

  // Calculate total revenue for percent share (excluding Việt Kiều revenue)
  const totalRevenue = regions.reduce(
    (acc, r) => acc + (isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
    0
  );

  // Prepare and sort data
  const chartData = [...regions]
    .map((r) => ({
      name: r.name,
      revenue: r.revenue || 0,
      costVAT: r.costVAT || 0,
      profit: (r.revenue || 0) - (r.costVAT || 0),
      sharePercent: totalRevenue > 0 ? ((r.revenue || 0) / totalRevenue) * 100 : 0,
    }))
    .sort((a, b) => {
      if (sortOrder === 'desc') return b.revenue - a.revenue;
      if (sortOrder === 'asc') return a.revenue - b.revenue;
      return a.name.localeCompare(b.name);
    });

  // Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 z-50 min-w-[210px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{data.name}</span>
            <span className="text-emerald-400 font-semibold">{monthLabel}</span>
          </p>
          <div className="flex justify-between items-center text-slate-300 pt-1">
            <span className="text-emerald-400 font-medium">Doanh Thu:</span>
            <span className="font-bold text-emerald-300">
              {formatVND(data.revenue, displayUnit)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Tỷ trọng doanh thu:</span>
            <span className="font-semibold text-slate-200">
              {formatPercent(data.sharePercent)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400 border-t border-slate-800/80 pt-1">
            <span>Chi Phí (VAT):</span>
            <span className="font-medium text-amber-400">
              {formatVND(data.costVAT, displayUnit)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Lợi Nhuận:</span>
            <span
              className={`font-bold ${
                data.profit >= 0 ? 'text-blue-400' : 'text-rose-400'
              }`}
            >
              {formatVND(data.profit, displayUnit)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <span>Doanh Thu Tháng Theo Từng Khu Vực</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {monthLabel} • Tổng doanh thu hệ thống (đã trừ Việt Kiều):{' '}
            <strong className="text-emerald-400">{formatVND(totalRevenue, displayUnit)}</strong>
          </p>
        </div>

        {/* Sort & Orientation buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setIsHorizontal(false)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                !isHorizontal
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Cột đứng"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Đứng</span>
            </button>
            <button
              onClick={() => setIsHorizontal(true)}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                isHorizontal
                  ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Cột ngang"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ngang</span>
            </button>
          </div>

          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() =>
                setSortOrder((prev) =>
                  prev === 'desc' ? 'asc' : prev === 'asc' ? 'alpha' : 'desc'
                )
              }
              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white font-medium flex items-center gap-1.5"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {sortOrder === 'desc'
                  ? 'Giảm dần'
                  : sortOrder === 'asc'
                  ? 'Tăng dần'
                  : 'Tên A-Z'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {isHorizontal ? (
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 10, right: 30, left: 60, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis
                type="number"
                tickFormatter={formatChartAxisVND}
                stroke="#94a3b8"
                fontSize={11}
              />
              <YAxis
                type="category"
                dataKey="name"
                stroke="#cbd5e1"
                fontSize={11}
                tickLine={false}
                width={85}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="revenue" name="Doanh Thu" radius={[0, 6, 6, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#10b981' : '#059669'}
                    opacity={index === 0 ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 10, left: 10, bottom: 45 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#cbd5e1"
                fontSize={11}
                interval={0}
                angle={-35}
                textAnchor="end"
                tickLine={false}
              />
              <YAxis
                tickFormatter={formatChartAxisVND}
                stroke="#94a3b8"
                fontSize={11}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar dataKey="revenue" name="Doanh Thu" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? '#10b981' : '#059669'}
                    opacity={index === 0 ? 1 : 0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
