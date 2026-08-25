import React, { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  Building2,
  BarChart2,
  BarChart3,
  LineChart as LineIcon,
  Zap,
  CheckCircle2,
  XCircle,
  Target,
  Users,
  Layers,
  PieChart as PieIcon,
  Activity,
  DollarSign,
} from 'lucide-react';
import { MONTHLY_DATA, MonthDataset } from '../data/revenueData';
import { DailyRecord } from '../services/googleSheetsService';
import { DisplayUnit } from '../types';
import { formatVND, formatChartAxisVND, formatPercent, isVietKieuRegion } from '../utils/formatters';
import { VietKieuChart } from './VietKieuChart';

interface SixMonthOverviewProps {
  displayUnit: DisplayUnit;
  monthlyData?: MonthDataset[];
  dailyRecords?: DailyRecord[];
}

const SERVICE_COLORS = [
  '#06b6d4', // Cyan
  '#ec4899', // Pink (Niềng)
  '#8b5cf6', // Purple (Sứ)
  '#10b981', // Emerald (TH)
  '#f59e0b', // Amber (Việt Kiều)
  '#3b82f6', // Blue
  '#f97316', // Orange
];

const OVERVIEW_SERVICE_COLORS: Record<string, string> = {
  'Implant': '#38bdf8',   // Sky Cyan
  'Niềng': '#a855f7',     // Purple
  'Sứ': '#f59e0b',        // Amber
  'TH': '#10b981',        // Emerald
  'Việt Kiều': '#ec4899', // Pink
  'Khác': '#64748b',      // Slate
};

function getOverviewServiceColor(svcName: string, index: number = 0): string {
  if (OVERVIEW_SERVICE_COLORS[svcName]) return OVERVIEW_SERVICE_COLORS[svcName];
  const fallback = ['#6366f1', '#8b5cf6', '#06b6d4', '#f43f5e', '#84cc16'];
  return fallback[index % fallback.length];
}

function normalizeOverviewServiceName(rawName: string, regionName: string): string {
  if (!rawName) return 'Khác';
  if (isVietKieuRegion(regionName) || rawName.includes('Việt Kiều') || rawName.includes('VK')) {
    return 'Việt Kiều';
  }
  let s = rawName.trim();
  if (s.startsWith('HCM-')) {
    s = s.replace('HCM-', '');
  }
  if (s === 'Imp' || s.toLowerCase().includes('implant')) return 'Implant';
  if (s === 'Niềng' || s.toLowerCase().includes('niềng')) return 'Niềng';
  if (s === 'Sứ' || s.toLowerCase().includes('sứ')) return 'Sứ';
  if (s === 'TH' || s.toLowerCase().includes('th')) return 'TH';
  return s;
}

export const SixMonthOverview: React.FC<SixMonthOverviewProps> = ({
  displayUnit,
  monthlyData = MONTHLY_DATA,
  dailyRecords = [],
}) => {
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string>('all');
  const [serviceChartMode, setServiceChartMode] = useState<'donut' | 'bar'>('donut');
  const [dataTab, setDataTab] = useState<'month' | 'region'>('month');
  const [monthlyServiceMetric, setMonthlyServiceMetric] = useState<'data' | 'cp'>('data');
  const [monthlyServiceChartType, setMonthlyServiceChartType] = useState<'line' | 'bar' | 'area'>('line');

  // Extract list of unique regions across all months
  const allRegions = Array.from(
    new Set(monthlyData.flatMap((m) => m.regions.map((r) => r.name)))
  ).sort((a, b) => a.localeCompare(b));

  // Compute aggregated data for each month
  const monthlySummary = monthlyData.map((month) => {
    const filteredRegions =
      selectedRegionFilter === 'all'
        ? month.regions
        : month.regions.filter((r) => r.name === selectedRegionFilter);

    const revenue = filteredRegions.reduce(
      (sum, r) => sum + (selectedRegionFilter === 'all' && isVietKieuRegion(r.name) ? 0 : (r.revenue || 0)),
      0
    );
    const costVAT = filteredRegions.reduce((sum, r) => sum + (r.costVAT || 0), 0);
    const profit = revenue - costVAT;

    // Calculate Data Tổng for this month
    const dataTong = filteredRegions.reduce((sum, r) => {
      const svcSum = r.services.reduce((sSum, s) => sSum + (s.dataCount || 0), 0);
      return sum + (svcSum > 0 ? svcSum : (r.totalData || 0));
    }, 0);

    const ratio = revenue > 0 ? (costVAT / revenue) * 100 : 0;
    const hasData = revenue > 0 || costVAT > 0 || dataTong > 0;
    const isKpiMet = hasData && ratio <= 15.0;

    // Calculate Data Chất Lượng for this month
    const regionQualitySum = filteredRegions.reduce(
      (sum, r) => sum + (r.dataChatLuong || 0),
      0
    );

    let dataChatLuong = regionQualitySum;
    if (dataChatLuong === 0) {
      const monthDailyRecords = dailyRecords.filter((dr) => {
        const matchMonth = dr.monthNum === month.month;
        const matchRegion =
          selectedRegionFilter === 'all'
            ? true
            : dr.region === selectedRegionFilter;
        return matchMonth && matchRegion;
      });
      dataChatLuong = monthDailyRecords.reduce(
        (sum, dr) => sum + (dr.leadChatLuong || 0),
        0
      );
    }

    return {
      monthLabel: month.label,
      monthNum: month.month,
      revenue,
      costVAT,
      profit,
      ratio,
      hasData,
      isKpiMet,
      dataTong,
      dataChatLuong,
    };
  });

  // Calculate total metrics across all available months
  const grandRevenue = monthlySummary.reduce((acc, m) => acc + m.revenue, 0);
  const grandCostVAT = monthlySummary.reduce((acc, m) => acc + m.costVAT, 0);
  const grandProfit = grandRevenue - grandCostVAT;
  const grandRatio = grandRevenue > 0 ? (grandCostVAT / grandRevenue) * 100 : 0;
  const isGrandKpiMet = grandRatio <= 15.0;

  const grandTotalData = monthlySummary.reduce((sum, m) => sum + m.dataTong, 0);
  const grandQualityData = monthlySummary.reduce((sum, m) => sum + m.dataChatLuong, 0);

  // Filter months that actually have data
  const monthsWithData = monthlySummary.filter((m) => m.hasData);
  const activeMonthsCount = monthsWithData.length || 1;
  const metKpiCount = monthsWithData.filter((m) => m.isKpiMet).length;

  // 1. Compute Total Data by Month across All Months
  const monthlyTotalData = monthlyData.map((m) => {
    const filteredRegions =
      selectedRegionFilter === 'all'
        ? m.regions
        : m.regions.filter((r) => r.name === selectedRegionFilter);

    const dataDichVu = filteredRegions.reduce((sum, r) => {
      const svcSum = r.services.reduce((sSum, s) => sSum + (s.dataCount || 0), 0);
      return sum + (svcSum > 0 ? svcSum : (r.totalData || 0));
    }, 0);

    const dataChatLuong = filteredRegions.reduce((sum, r) => {
      return sum + (r.dataChatLuong || 0);
    }, 0);

    return {
      monthLabel: m.label,
      monthNum: m.month,
      dataDichVu,
      dataChatLuong,
      totalData: dataDichVu,
    };
  });

  const grandTotalData6Months = monthlyTotalData.reduce((sum, m) => sum + m.dataDichVu, 0);

  // 2. Compute Aggregated Data by Region across All Months
  const regionDataMap: Record<string, { name: string; dataDichVu: number; dataChatLuong: number; totalData: number; costVAT: number; revenue: number }> = {};
  monthlyData.forEach((m) => {
    m.regions.forEach((r) => {
      if (selectedRegionFilter !== 'all' && r.name !== selectedRegionFilter) return;
      if (!regionDataMap[r.name]) {
        regionDataMap[r.name] = { name: r.name, dataDichVu: 0, dataChatLuong: 0, totalData: 0, costVAT: 0, revenue: 0 };
      }
      const svcSum = r.services.reduce((sum, s) => sum + (s.dataCount || 0), 0);
      const rDataSvc = svcSum > 0 ? svcSum : (r.totalData || 0);
      regionDataMap[r.name].dataDichVu += rDataSvc;
      regionDataMap[r.name].dataChatLuong += r.dataChatLuong || 0;
      regionDataMap[r.name].totalData += rDataSvc;
      regionDataMap[r.name].costVAT += r.costVAT || 0;
      regionDataMap[r.name].revenue += (selectedRegionFilter === 'all' && isVietKieuRegion(r.name) ? 0 : (r.revenue || 0));
    });
  });

  const regionDataList = Object.values(regionDataMap).sort((a, b) => b.dataDichVu - a.dataDichVu);

  // 3. Compute Aggregated Data by Region across All Months
  const serviceDataMap: Record<string, { name: string; totalData: number; totalCp: number }> = {};
  monthlyData.forEach((m) => {
    m.regions.forEach((r) => {
      if (selectedRegionFilter !== 'all' && r.name !== selectedRegionFilter) return;
      r.services.forEach((s) => {
        let normalizedName = s.name;
        if (normalizedName.startsWith('HCM-')) {
          const sub = normalizedName.replace('HCM-', '');
          if (sub === 'Imp') normalizedName = 'Implant';
          else if (sub === 'Niềng') normalizedName = 'Niềng';
          else if (sub === 'Sứ') normalizedName = 'Sứ';
          else if (sub === 'TH') normalizedName = 'TH';
        }

        if (!serviceDataMap[normalizedName]) {
          serviceDataMap[normalizedName] = { name: normalizedName, totalData: 0, totalCp: 0 };
        }
        serviceDataMap[normalizedName].totalData += s.dataCount || 0;
        serviceDataMap[normalizedName].totalCp += s.cp || 0;
      });
    });
  });

  const totalServiceData6Months = Object.values(serviceDataMap).reduce((sum, s) => sum + s.totalData, 0);

  const serviceDataList = Object.values(serviceDataMap)
    .sort((a, b) => b.totalData - a.totalData)
    .map((s, idx) => ({
      ...s,
      sharePercent: totalServiceData6Months > 0 ? (s.totalData / totalServiceData6Months) * 100 : 0,
      cpPerData: s.totalData > 0 ? s.totalCp / s.totalData : 0,
      color: getOverviewServiceColor(s.name, idx),
    }));

  // 4. Compute Monthly Service Trends across All Months
  const allServiceNamesSet = new Set<string>();

  const monthlyServiceTrends = monthlyData.map((m) => {
    const filteredRegions =
      selectedRegionFilter === 'all'
        ? m.regions
        : m.regions.filter((r) => r.name === selectedRegionFilter);

    const row: Record<string, any> = {
      monthLabel: m.label,
      monthNum: m.month,
      totalMonthData: 0,
      totalMonthCp: 0,
    };

    filteredRegions.forEach((r) => {
      r.services.forEach((s) => {
        const norm = normalizeOverviewServiceName(s.name, r.name);
        allServiceNamesSet.add(norm);

        const dKey = `data_${norm}`;
        const cKey = `cp_${norm}`;

        row[dKey] = (row[dKey] || 0) + (s.dataCount || 0);
        row[cKey] = (row[cKey] || 0) + (s.cp || 0);
        row.totalMonthData += s.dataCount || 0;
        row.totalMonthCp += s.cp || 0;
      });
    });

    return row;
  });

  const sortedOverviewServices = Array.from(allServiceNamesSet).sort((a, b) => {
    const order = ['Implant', 'Niềng', 'Sứ', 'TH', 'Việt Kiều'];
    const iA = order.indexOf(a);
    const iB = order.indexOf(b);
    if (iA !== -1 && iB !== -1) return iA - iB;
    if (iA !== -1) return -1;
    if (iB !== -1) return 1;
    return a.localeCompare(b);
  });

  // Calculate total metrics for each service over the multi-month period
  const serviceMultiMonthStats = sortedOverviewServices.map((svc, idx) => {
    let totalData = 0;
    let totalCp = 0;
    monthlyServiceTrends.forEach((row) => {
      totalData += row[`data_${svc}`] || 0;
      totalCp += row[`cp_${svc}`] || 0;
    });
    const color = getOverviewServiceColor(svc, idx);
    const cpPerData = totalData > 0 ? totalCp / totalData : 0;
    return {
      name: svc,
      totalData,
      totalCp,
      cpPerData,
      color,
    };
  });

  const grandTotalSvcData = serviceMultiMonthStats.reduce((sum, s) => sum + s.totalData, 0);

  const MonthlyServiceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataObj = payload[0].payload;
      const isDataMode = monthlyServiceMetric === 'data';
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs space-y-2 z-50 min-w-[240px] backdrop-blur-md">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1.5 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-purple-400 font-semibold">
              {isDataMode ? 'Tổng Data' : 'Tổng Chi Phí'}
            </span>
          </p>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {sortedOverviewServices.map((svc, i) => {
              const val = isDataMode ? dataObj[`data_${svc}`] || 0 : dataObj[`cp_${svc}`] || 0;
              const color = getOverviewServiceColor(svc, i);
              const totalVal = isDataMode ? dataObj.totalMonthData : dataObj.totalMonthCp;
              const pct = totalVal > 0 ? (val / totalVal) * 100 : 0;
              return (
                <div key={svc} className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 font-medium" style={{ color }}>
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                    {svc}:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">
                      {isDataMode ? `${val.toLocaleString('vi-VN')} data` : formatVND(val, displayUnit)}
                    </span>
                    <span className="text-[10px] text-slate-400">({formatPercent(pct)})</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="border-t border-slate-800 pt-1.5 flex justify-between items-center text-xs font-bold">
            <span className="text-slate-400">Tổng Tháng:</span>
            <span className={isDataMode ? 'text-cyan-300' : 'text-amber-300'}>
              {isDataMode
                ? `${dataObj.totalMonthData.toLocaleString('vi-VN')} data`
                : formatVND(dataObj.totalMonthCp, displayUnit)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 z-50 min-w-[210px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{label}</span>
            <span className="text-emerald-400 font-semibold">Tổng Cộng</span>
          </p>
          <div className="flex justify-between items-center text-slate-300 pt-1">
            <span className="text-emerald-400 font-medium">Doanh Thu:</span>
            <span className="font-bold text-emerald-300">
              {formatVND(payload[0]?.value || 0, displayUnit)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-amber-400 font-medium">Chi Phí (VAT):</span>
            <span className="font-bold text-amber-300">
              {formatVND(payload[1]?.value || 0, displayUnit)}
            </span>
          </div>
          {payload[0] && payload[1] && (
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-1">
              <span className="text-blue-400 font-medium">Lợi Nhuận:</span>
              <span className="font-bold text-blue-400">
                {formatVND(payload[0].value - payload[1].value, displayUnit)}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const ServiceTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 z-50 min-w-[220px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
              {data.name}
            </span>
            <span className="text-cyan-400 font-semibold">Tổng Cộng</span>
          </p>
          <div className="flex justify-between items-center text-slate-300 pt-1">
            <span className="text-cyan-400 font-medium">Tổng Data:</span>
            <span className="font-bold text-cyan-300 text-sm">
              {data.totalData.toLocaleString('vi-VN')} data
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
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tổng Doanh Thu (Tổng Quan)
          </span>
          <p className="text-2xl font-bold text-emerald-400 mt-2">
            {formatVND(grandRevenue, displayUnit)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Đã trừ DT Việt Kiều • TB: {formatVND(grandRevenue / activeMonthsCount, displayUnit)} / tháng
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tổng Chi Phí VAT (Tổng Quan)
          </span>
          <p className="text-2xl font-bold text-amber-400 mt-2">
            {formatVND(grandCostVAT, displayUnit)}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Trung bình: {formatVND(grandCostVAT / activeMonthsCount, displayUnit)} / tháng
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Data Dịch Vụ & Data CL (Tổng Quan)
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <div>
              <p className="text-xl font-bold text-cyan-400">
                {grandTotalData.toLocaleString('vi-VN')}{' '}
                <span className="text-xs text-slate-400 font-normal">Data Dịch Vụ</span>
              </p>
            </div>
            <div>
              <p className="text-xl font-bold text-emerald-400">
                {grandQualityData.toLocaleString('vi-VN')}{' '}
                <span className="text-xs text-slate-400 font-normal">Data CL</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Tỷ lệ CL: <strong className="text-emerald-300">{formatPercent(grandTotalData > 0 ? (grandQualityData / grandTotalData) * 100 : 0)}</strong> • TB: {Math.round(grandTotalData / activeMonthsCount).toLocaleString('vi-VN')} Data DV / tháng
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              KPI Chỉ Tiêu (≤15%)
            </span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline justify-between mt-2">
            <p className="text-2xl font-bold text-purple-300">
              {formatPercent(grandRatio)}
            </p>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                isGrandKpiMet
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {isGrandKpiMet ? 'Đạt' : 'Vượt KPI'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Đạt KPI: <strong className="text-emerald-400">{metKpiCount}/{activeMonthsCount} tháng</strong> (mục tiêu ≤ 15.0%)
          </p>
        </div>
      </div>

      {/* Main Multi-month Trend Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Xu Hướng Doanh Thu vs Chi Phí (VAT) Theo Tháng</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              So sánh tăng trưởng doanh thu và biến động chi phí VAT qua các tháng
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedRegionFilter}
              onChange={(e) => setSelectedRegionFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              <option value="all">Tất cả Khu Vực ({allRegions.length})</option>
              {allRegions.map((region) => (
                <option key={region} value={region}>
                  Khu vực: {region}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="h-[360px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlySummary} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={12} tickLine={false} />
              <YAxis tickFormatter={formatChartAxisVND} stroke="#94a3b8" fontSize={11} width={65} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '15px' }} />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Doanh Thu"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="costVAT"
                name="Chi Phí (VAT)"
                stroke="#f59e0b"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorCost)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dedicated Multi-Month Service Overview Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-400" />
              <span>Biểu Đồ Tổng Hợp Các Dịch Vụ Qua Các Tháng</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              So sánh Data & Chi phí Marketing của từng dịch vụ (Implant, Niềng, Sứ, TH, Việt Kiều) theo từng tháng
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Chart Type Toggle */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setMonthlyServiceChartType('line')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  monthlyServiceChartType === 'line'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Dây Dịch Vụ"
              >
                <LineIcon className="w-3.5 h-3.5" />
                <span>Dây Dịch Vụ</span>
              </button>
              <button
                onClick={() => setMonthlyServiceChartType('bar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  monthlyServiceChartType === 'bar'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Cột Chồng"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Cột Chồng</span>
              </button>
              <button
                onClick={() => setMonthlyServiceChartType('area')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  monthlyServiceChartType === 'area'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Miền Chồng"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Miền Chồng</span>
              </button>
            </div>

            {/* Metric Toggle */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setMonthlyServiceMetric('data')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  monthlyServiceMetric === 'data'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Data Dịch Vụ
              </button>
              <button
                onClick={() => setMonthlyServiceMetric('cp')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  monthlyServiceMetric === 'cp'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Chi Phí (CP)
              </button>
            </div>
          </div>
        </div>

        {/* Chart Render */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {monthlyServiceChartType === 'line' ? (
              <LineChart data={monthlyServiceTrends} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  width={monthlyServiceMetric === 'cp' ? 65 : 45}
                  tickFormatter={(v) => {
                    if (monthlyServiceMetric === 'cp') {
                      return formatChartAxisVND(v);
                    }
                    return v.toLocaleString('vi-VN');
                  }}
                />
                <Tooltip content={<MonthlyServiceTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="center"
                  height={36}
                  wrapperStyle={{ fontSize: '12px', color: '#cbd5e1', paddingBottom: '10px' }}
                />
                {sortedOverviewServices.map((svc, idx) => {
                  const color = getOverviewServiceColor(svc, idx);
                  const dataKey = monthlyServiceMetric === 'data' ? `data_${svc}` : `cp_${svc}`;
                  return (
                    <Line
                      key={svc}
                      type="monotone"
                      dataKey={dataKey}
                      name={svc}
                      stroke={color}
                      strokeWidth={3}
                      dot={{ r: 3.5, fill: color }}
                      activeDot={{ r: 6 }}
                    />
                  );
                })}
              </LineChart>
            ) : monthlyServiceChartType === 'area' ? (
              <AreaChart data={monthlyServiceTrends} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  width={monthlyServiceMetric === 'cp' ? 65 : 45}
                  tickFormatter={(v) => {
                    if (monthlyServiceMetric === 'cp') {
                      return formatChartAxisVND(v);
                    }
                    return v.toLocaleString('vi-VN');
                  }}
                />
                <Tooltip content={<MonthlyServiceTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="center"
                  height={36}
                  wrapperStyle={{ fontSize: '12px', color: '#cbd5e1', paddingBottom: '10px' }}
                />
                {sortedOverviewServices.map((svc, idx) => {
                  const color = getOverviewServiceColor(svc, idx);
                  const dataKey = monthlyServiceMetric === 'data' ? `data_${svc}` : `cp_${svc}`;
                  return (
                    <Area
                      key={svc}
                      type="monotone"
                      stackId="1"
                      dataKey={dataKey}
                      name={svc}
                      stroke={color}
                      fill={color}
                      fillOpacity={0.45}
                    />
                  );
                })}
              </AreaChart>
            ) : (
              <BarChart data={monthlyServiceTrends} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={12} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  width={monthlyServiceMetric === 'cp' ? 65 : 45}
                  tickFormatter={(v) => {
                    if (monthlyServiceMetric === 'cp') {
                      return formatChartAxisVND(v);
                    }
                    return v.toLocaleString('vi-VN');
                  }}
                />
                <Tooltip content={<MonthlyServiceTooltip />} />
                <Legend
                  verticalAlign="top"
                  align="center"
                  height={36}
                  wrapperStyle={{ fontSize: '12px', color: '#cbd5e1', paddingBottom: '10px' }}
                />
                {sortedOverviewServices.map((svc, idx) => {
                  const color = getOverviewServiceColor(svc, idx);
                  const dataKey = monthlyServiceMetric === 'data' ? `data_${svc}` : `cp_${svc}`;
                  return (
                    <Bar
                      key={svc}
                      stackId="1"
                      dataKey={dataKey}
                      name={svc}
                      fill={color}
                      radius={idx === sortedOverviewServices.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  );
                })}
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Summary Service Metric Cards for the whole period */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {serviceMultiMonthStats.map((s) => {
            const pct = grandTotalSvcData > 0 ? (s.totalData / grandTotalSvcData) * 100 : 0;
            return (
              <div
                key={s.name}
                className="bg-slate-800/60 border border-slate-700/70 hover:border-slate-600 rounded-xl p-3 space-y-1.5 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-white">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.name}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                    {formatPercent(pct)}
                  </span>
                </div>
                <div>
                  <p className="text-base font-bold text-cyan-400">
                    {s.totalData.toLocaleString('vi-VN')}{' '}
                    <span className="text-[11px] font-normal text-slate-400">data</span>
                  </p>
                  {s.totalCp > 0 && (
                    <div className="text-[11px] space-y-0.5 mt-1 border-t border-slate-700/50 pt-1">
                      <p className="text-amber-400 font-medium">
                        CP: {formatVND(s.totalCp, displayUnit)}
                      </p>
                      <p className="text-emerald-400 font-medium">
                        TB: {formatVND(s.cpPerData, displayUnit)}/data
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid: 1) Biểu Đồ Data Dịch Vụ & Data CL 6 Tháng & 2) Biểu Đồ Data Tổng Hợp Từng Dịch Vụ 6 Tháng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Biểu Đồ Data Dịch Vụ & Data CL 6 Tháng (Theo Tháng / Khu Vực) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-400" />
                <span>Biểu Đồ Data Dịch Vụ & Data CL</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {grandTotalData.toLocaleString('vi-VN')} Data Dịch Vụ • {grandQualityData.toLocaleString('vi-VN')} Data Chất Lượng
              </p>
            </div>

            {/* View Mode Switcher: Theo Tháng vs Theo Khu Vực */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setDataTab('month')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  dataTab === 'month'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Theo Tháng
              </button>
              <button
                onClick={() => setDataTab('region')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  dataTab === 'region'
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Theo Khu Vực
              </button>
            </div>
          </div>

          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {dataTab === 'month' ? (
                <BarChart data={monthlyTotalData} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} width={45} />
                  <Tooltip
                    content={({ active, payload, label }: any) => {
                      if (active && payload && payload.length) {
                        const dSvc = payload.find((p: any) => p.dataKey === 'dataDichVu')?.value || 0;
                        const dCL = payload.find((p: any) => p.dataKey === 'dataChatLuong')?.value || 0;
                        const pct = dSvc > 0 ? (dCL / dSvc) * 100 : 0;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                            <p className="font-bold text-white border-b border-slate-800 pb-1">{label}</p>
                            <p className="text-cyan-400 font-semibold flex justify-between gap-4">
                              <span>Data Dịch Vụ:</span> <span>{Number(dSvc).toLocaleString('vi-VN')}</span>
                            </p>
                            <p className="text-emerald-400 font-semibold flex justify-between gap-4">
                              <span>Data CL:</span> <span>{Number(dCL).toLocaleString('vi-VN')}</span>
                            </p>
                            <p className="text-slate-300 text-[11px] pt-1 border-t border-slate-800 flex justify-between gap-4">
                              <span>Tỷ Lệ Chất Lượng:</span> <span className="font-bold text-emerald-400">{formatPercent(pct)}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px' }} />
                  <Bar dataKey="dataDichVu" name="Data Dịch Vụ" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="dataChatLuong" name="Data CL (Chất Lượng)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : (
                <BarChart
                  layout="vertical"
                  data={regionDataList}
                  margin={{ top: 10, right: 20, left: 50, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis type="category" dataKey="name" stroke="#cbd5e1" fontSize={11} width={80} tickLine={false} />
                  <Tooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const pct = data.dataDichVu > 0 ? (data.dataChatLuong / data.dataDichVu) * 100 : 0;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 z-50">
                            <p className="font-bold text-white border-b border-slate-800 pb-1">{data.name}</p>
                            <p className="text-cyan-400 font-semibold flex justify-between gap-4">
                              <span>Data Dịch Vụ:</span> <span>{Number(data.dataDichVu).toLocaleString('vi-VN')}</span>
                            </p>
                            <p className="text-emerald-400 font-semibold flex justify-between gap-4">
                              <span>Data CL:</span> <span>{Number(data.dataChatLuong).toLocaleString('vi-VN')}</span>
                            </p>
                            <p className="text-slate-300 text-[11px] pt-1 border-t border-slate-800 flex justify-between gap-4">
                              <span>Tỷ Lệ Chất Lượng:</span> <span className="font-bold text-emerald-400">{formatPercent(pct)}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '10px' }} />
                  <Bar dataKey="dataDichVu" name="Data Dịch Vụ" fill="#0891b2" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="dataChatLuong" name="Data CL" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Biểu Đồ Data Tổng Hợp Từng Dịch Vụ (6 Tháng) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <span>Data Tổng Hợp Theo Từng Dịch Vụ</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Phân bổ {totalServiceData6Months.toLocaleString('vi-VN')} Data dịch vụ toàn hệ thống
              </p>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setServiceChartMode('donut')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  serviceChartMode === 'donut'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Tròn</span>
              </button>
              <button
                onClick={() => setServiceChartMode('bar')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  serviceChartMode === 'bar'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Cột</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-7 h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {serviceChartMode === 'donut' ? (
                  <PieChart>
                    <Pie
                      data={serviceDataList}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={95}
                      paddingAngle={4}
                      dataKey="totalData"
                      nameKey="name"
                    >
                      {serviceDataList.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="#0f172a" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip content={<ServiceTooltip />} />
                  </PieChart>
                ) : (
                  <BarChart data={serviceDataList} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#cbd5e1" fontSize={11} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} width={45} />
                    <Tooltip content={<ServiceTooltip />} />
                    <Bar dataKey="totalData" name="Data Dịch Vụ" radius={[6, 6, 0, 0]}>
                      {serviceDataList.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            {/* Service Breakdown List */}
            <div className="sm:col-span-5 space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {serviceDataList.map((svc) => (
                <div
                  key={svc.name}
                  className="bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 rounded-xl p-2.5 flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full shrink-0 shadow-sm"
                      style={{ backgroundColor: svc.color }}
                    />
                    <div>
                      <p className="font-bold text-white text-xs">{svc.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Tỷ trọng: <strong className="text-slate-200">{formatPercent(svc.sharePercent)}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-cyan-400">
                      {svc.totalData.toLocaleString('vi-VN')} <span className="text-[10px] font-normal text-slate-400">data</span>
                    </p>
                    {svc.totalCp > 0 && (
                      <p className="text-[10px] text-amber-400 font-medium">
                        {formatVND(svc.totalCp, displayUnit)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dedicated Viet Kieu 6-Month Breakdown & Chart */}
      <VietKieuChart monthlyData={monthlyData} displayUnit={displayUnit} />

      {/* Monthly Summary Breakdown Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>Bảng Aggregate Tổng Quan</span>
          </h3>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="font-medium">Chỉ tiêu KPI % CP/DT:</span>
            <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              ≤ 15.0%
            </span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800 text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">Tháng</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Data Dịch Vụ</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Data CL</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Tỷ Lệ CL</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Doanh Thu</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Chi Phí (VAT)</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Lợi Nhuận</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">% CP/DT</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Đạt KPI (≤15%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/50">
              {monthlySummary.map((m) => (
                <tr key={m.monthNum} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white text-sm whitespace-nowrap">{m.monthLabel}</td>
                  <td className="py-3 px-4 text-right font-bold text-cyan-400 text-sm whitespace-nowrap">
                    {m.dataTong.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                    {m.dataChatLuong.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-3 px-4 text-right font-semibold text-emerald-300 text-sm whitespace-nowrap">
                    {formatPercent(m.dataTong > 0 ? (m.dataChatLuong / m.dataTong) * 100 : 0)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                    {formatVND(m.revenue, displayUnit)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-amber-400 text-sm whitespace-nowrap">
                    {formatVND(m.costVAT, displayUnit)}
                  </td>
                  <td className={`py-3 px-4 text-right font-bold text-sm whitespace-nowrap ${m.profit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                    {formatVND(m.profit, displayUnit)}
                  </td>
                  <td className="py-3 px-4 text-center font-semibold text-purple-300 whitespace-nowrap">
                    {m.hasData ? formatPercent(m.ratio) : '-'}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
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
              ))}
            </tbody>
            <tfoot className="bg-slate-800 font-bold text-white border-t-2 border-slate-700 whitespace-nowrap">
              <tr>
                <td className="py-3.5 px-4 text-sm whitespace-nowrap">TỔNG QUAN</td>
                <td className="py-3.5 px-4 text-right text-cyan-400 text-base whitespace-nowrap">
                  {grandTotalData.toLocaleString('vi-VN')}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-400 text-base whitespace-nowrap">
                  {grandQualityData.toLocaleString('vi-VN')}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-300 text-sm font-semibold whitespace-nowrap">
                  {formatPercent(grandTotalData > 0 ? (grandQualityData / grandTotalData) * 100 : 0)}
                </td>
                <td className="py-3.5 px-4 text-right text-emerald-400 text-base whitespace-nowrap">
                  {formatVND(grandRevenue, displayUnit)}
                </td>
                <td className="py-3.5 px-4 text-right text-amber-400 text-base whitespace-nowrap">
                  {formatVND(grandCostVAT, displayUnit)}
                </td>
                <td className={`py-3.5 px-4 text-right text-base whitespace-nowrap ${grandProfit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                  {formatVND(grandProfit, displayUnit)}
                </td>
                <td className="py-3.5 px-4 text-center text-purple-300 text-sm whitespace-nowrap">
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


    </div>
  );
};
