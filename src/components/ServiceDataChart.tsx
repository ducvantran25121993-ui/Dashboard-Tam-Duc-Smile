import React, { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Layers, PieChart as PieIcon, BarChart2, DollarSign } from 'lucide-react';
import { RegionData } from '../data/revenueData';
import { DisplayUnit } from '../types';
import { formatVND, formatPercent } from '../utils/formatters';

interface ServiceDataChartProps {
  regions: RegionData[];
  monthLabel: string;
  displayUnit: DisplayUnit;
}

const SERVICE_COLORS = [
  '#3b82f6', // Blue (Implant / Imp)
  '#ec4899', // Pink (Niềng)
  '#8b5cf6', // Purple (Sứ)
  '#10b981', // Emerald (TH / Tổng hợp)
  '#f59e0b', // Amber (Việt Kiều)
  '#06b6d4', // Cyan
  '#f97316', // Orange
];

export const ServiceDataChart: React.FC<ServiceDataChartProps> = ({
  regions,
  monthLabel,
  displayUnit,
}) => {
  const [chartMode, setChartMode] = useState<'donut' | 'bar'>('donut');

  // Aggregate service data across all regions for the active month
  const serviceMap: Record<string, { name: string; dataCount: number; totalCp: number }> = {};

  const normalizeSvc = (rawName: string) => {
    let s = rawName.trim();
    if (s.startsWith('HCM-')) s = s.replace('HCM-', '');
    const upper = s.toUpperCase();
    if (upper === 'IMP' || upper === 'IMPLANT') return 'Implant';
    if (upper === 'NIỀNG' || upper === 'NIENG') return 'Niềng';
    if (upper === 'SỨ' || upper === 'SU') return 'Sứ';
    if (upper === 'TH' || upper === 'TQ' || upper === 'TỔNG HỢP') return 'TH';
    if (upper === 'VIỆT KIỀU' || upper === 'VIET KIEU' || upper === 'VK') return 'Việt Kiều';
    return s;
  };

  regions.forEach((region) => {
    region.services.forEach((service) => {
      const normalizedName = normalizeSvc(service.name);

      if (!serviceMap[normalizedName]) {
        serviceMap[normalizedName] = {
          name: normalizedName,
          dataCount: 0,
          totalCp: 0,
        };
      }

      serviceMap[normalizedName].dataCount += service.dataCount || 0;
      serviceMap[normalizedName].totalCp += service.cp || 0;
    });
  });

  const serviceList = Object.values(serviceMap).sort((a, b) => b.dataCount - a.dataCount);
  const totalServiceData = serviceList.reduce((acc, s) => acc + s.dataCount, 0);
  const totalServiceCp = serviceList.reduce((acc, s) => acc + s.totalCp, 0);

  const chartData = serviceList.map((s, idx) => ({
    ...s,
    sharePercent: totalServiceData > 0 ? (s.dataCount / totalServiceData) * 100 : 0,
    cpPerData: s.dataCount > 0 ? s.totalCp / s.dataCount : 0,
    color: SERVICE_COLORS[idx % SERVICE_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 z-50 min-w-[210px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
              {data.name}
            </span>
            <span className="text-blue-400 font-semibold">{monthLabel}</span>
          </p>
          <div className="flex justify-between items-center text-slate-300 pt-1">
            <span className="text-blue-400 font-medium">Data Dịch Vụ:</span>
            <span className="font-bold text-blue-300 text-sm">
              {data.dataCount.toLocaleString('vi-VN')} data
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Tỷ trọng:</span>
            <span className="font-semibold text-slate-200">
              {formatPercent(data.sharePercent)}
            </span>
          </div>
          {data.totalCp > 0 && (
            <div className="border-t border-slate-800/80 pt-1 space-y-1">
              <div className="flex justify-between items-center text-slate-300">
                <span>CP Dịch Vụ:</span>
                <span className="font-semibold text-amber-300">
                  {formatVND(data.totalCp, displayUnit)}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>CP / 1 Data:</span>
                <span className="font-semibold text-emerald-400">
                  {formatVND(data.cpPerData, displayUnit)}
                </span>
              </div>
            </div>
          )}
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
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-4 h-4" />
            </div>
            <span>Data Tháng Theo Từng Dịch Vụ (Cột Data Dịch Vụ)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {monthLabel} • Phân bổ tổng {totalServiceData.toLocaleString('vi-VN')} Data dịch vụ
          </p>
        </div>

        {/* Chart View Toggle */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
          <button
            onClick={() => setChartMode('donut')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              chartMode === 'donut'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Hình Tròn</span>
          </button>
          <button
            onClick={() => setChartMode('bar')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              chartMode === 'bar'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Cột</span>
          </button>
        </div>
      </div>

      {/* Main Content: Chart + Legend Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Chart Area */}
        <div className="lg:col-span-7 h-[340px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartMode === 'donut' ? (
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="dataCount"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} width={45} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="dataCount" name="Data Dịch Vụ" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Breakdown List Cards */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
          {chartData.map((svc) => (
            <div
              key={svc.name}
              className="bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl p-3 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: svc.color }}
                />
                <div>
                  <p className="font-bold text-white text-xs sm:text-sm">{svc.name}</p>
                  <p className="text-[11px] text-slate-400">
                    Tỷ trọng: <strong className="text-slate-200">{formatPercent(svc.sharePercent)}</strong>
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-extrabold text-blue-400">
                  {svc.dataCount.toLocaleString('vi-VN')} <span className="text-xs font-normal text-slate-400">data</span>
                </p>
                {svc.totalCp > 0 && (
                  <p className="text-[11px] text-amber-400 font-medium">
                    {formatVND(svc.totalCp, displayUnit)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
