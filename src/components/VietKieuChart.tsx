import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import {
  Plane,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  BarChart3,
  Calendar,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { MonthDataset } from '../data/revenueData';
import { DisplayUnit } from '../types';
import { formatVND, formatChartAxisVND, formatPercent, isVietKieuRegion } from '../utils/formatters';

interface VietKieuChartProps {
  monthlyData: MonthDataset[];
  activeMonth?: number; // Optional month highlight (1-6)
  displayUnit: DisplayUnit;
}

export const VietKieuChart: React.FC<VietKieuChartProps> = ({
  monthlyData,
  activeMonth,
  displayUnit,
}) => {
  const [chartType, setChartType] = useState<'revenue' | 'data'>('revenue');

  // Extract month-by-month data for Việt Kiều
  const vietKieuMonthly = monthlyData.map((m) => {
    const vkRegion = m.regions.find((r) => isVietKieuRegion(r.name));

    const revenue = vkRegion?.revenue || 0;
    const costVAT = vkRegion?.costVAT || 0;
    const cpDichVu =
      vkRegion?.cpDichVu ||
      vkRegion?.cpTong ||
      vkRegion?.services?.reduce((sum, s) => sum + (s.cp || 0), 0) ||
      0;
    const profit = revenue - costVAT;
    const ratio = revenue > 0 ? (costVAT / revenue) * 100 : 0;
    const rawDataSvc =
      vkRegion?.services?.reduce((sum, s) => sum + (s.dataCount || 0), 0) || 0;
    const rawDataCL = vkRegion?.dataChatLuong ?? vkRegion?.totalData ?? 0;
    const dataDichVu = rawDataSvc > 0 ? rawDataSvc : rawDataCL;
    const dataChatLuong = rawDataCL;
    const qualityRatio = dataDichVu > 0 ? (dataChatLuong / dataDichVu) * 100 : 0;
    const cpPerDataSvc = dataDichVu > 0 ? cpDichVu / dataDichVu : 0;
    const cpPerDataCL = dataChatLuong > 0 ? cpDichVu / dataChatLuong : 0;
    const isKpiMet = ratio <= 15.0;

    return {
      monthNum: m.month,
      monthLabel: m.label,
      revenue,
      costVAT,
      cpDichVu,
      profit,
      ratio,
      dataDichVu,
      dataChatLuong,
      qualityRatio,
      cpPerDataSvc,
      cpPerDataCL,
      isKpiMet,
    };
  });

  // Calculate totals across all months
  const grandRevenue = vietKieuMonthly.reduce((sum, m) => sum + m.revenue, 0);
  const grandCostVAT = vietKieuMonthly.reduce((sum, m) => sum + m.costVAT, 0);
  const grandCpDichVu = vietKieuMonthly.reduce((sum, m) => sum + m.cpDichVu, 0);
  const grandProfit = grandRevenue - grandCostVAT;
  const grandRatio = grandRevenue > 0 ? (grandCostVAT / grandRevenue) * 100 : 0;
  const grandDataDichVu = vietKieuMonthly.reduce((sum, m) => sum + m.dataDichVu, 0);
  const grandDataChatLuong = vietKieuMonthly.reduce((sum, m) => sum + m.dataChatLuong, 0);
  const grandQualityRatio = grandDataDichVu > 0 ? (grandDataChatLuong / grandDataDichVu) * 100 : 0;
  const avgCpPerDataSvc = grandDataDichVu > 0 ? grandCpDichVu / grandDataDichVu : 0;
  const avgCpPerDataCL = grandDataChatLuong > 0 ? grandCpDichVu / grandDataChatLuong : 0;

  // Active months with actual data for Việt Kiều
  const vkActiveMonths = vietKieuMonthly.filter((m) => m.revenue > 0 || m.costVAT > 0 || m.dataDichVu > 0);
  const vkActiveCount = vkActiveMonths.length || 1;

  // Selected month metrics if activeMonth is provided
  const activeMonthMetrics = activeMonth
    ? vietKieuMonthly.find((m) => m.monthNum === activeMonth)
    : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-2 z-50 min-w-[230px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Plane className="w-4 h-4" />
              Việt Kiều ({label})
            </span>
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-emerald-400 font-medium">Doanh Thu:</span>
              <span className="font-bold text-emerald-300">
                {formatVND(data.revenue, displayUnit)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-amber-400 font-medium">Chi Phí (VAT):</span>
              <span className="font-bold text-amber-300">
                {formatVND(data.costVAT, displayUnit)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-purple-400 font-medium">Chi Phí Dịch Vụ:</span>
              <span className="font-bold text-purple-300">
                {formatVND(data.cpDichVu, displayUnit)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300 border-t border-slate-800 pt-1">
              <span className="text-blue-400 font-medium">Lợi Nhuận:</span>
              <span className="font-bold text-blue-400">
                {formatVND(data.profit, displayUnit)}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400 pt-1 border-t border-slate-800">
              <span>% CP/DT:</span>
              <span className="font-bold text-purple-300">{formatPercent(data.ratio)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-cyan-400 font-medium">Data Dịch Vụ:</span>
              <span className="font-bold text-cyan-300">
                {data.dataDichVu.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-emerald-400 font-medium">Data CL (Chất Lượng):</span>
              <span className="font-bold text-emerald-300">
                {data.dataChatLuong.toLocaleString('vi-VN')}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Tỷ Lệ Chất Lượng:</span>
              <span className="font-bold text-emerald-400">{formatPercent(data.qualityRatio)}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>CP / 1 Data DV:</span>
              <span className="font-bold text-amber-300">{formatVND(data.cpPerDataSvc, displayUnit)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Biểu Đồ Doanh Thu & Chi Phí (VAT) Từng Tháng</span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Việt Kiều
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Báo cáo độc lập do đặc thù riêng (không cộng gộp vào doanh thu tổng hệ thống)
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start sm:self-auto">
          <button
            onClick={() => setChartType('revenue')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              chartType === 'revenue'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Doanh Thu & Chi Phí</span>
          </button>
          <button
            onClick={() => setChartType('data')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              chartType === 'data'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Data & CP/Data</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Doanh Thu Việt Kiều {activeMonth ? `(${activeMonthMetrics?.monthLabel})` : ''}
          </span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {formatVND(
              activeMonthMetrics ? activeMonthMetrics.revenue : grandRevenue,
              displayUnit
            )}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {activeMonth
              ? `Tỷ trọng: ${formatPercent(
                  grandRevenue > 0 ? (activeMonthMetrics!.revenue / grandRevenue) * 100 : 0
                )}`
              : `Trung bình: ${formatVND(grandRevenue / vkActiveCount, displayUnit)} / tháng`}
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Chi Phí VAT
          </span>
          <p className="text-xl font-bold text-amber-400 mt-1">
            {formatVND(
              activeMonthMetrics ? activeMonthMetrics.costVAT : grandCostVAT,
              displayUnit
            )}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            % CP/DT:
            <strong className="text-purple-300 ml-1">
              {formatPercent(activeMonthMetrics ? activeMonthMetrics.ratio : grandRatio)}
            </strong>
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Lợi Nhuận Việt Kiều
          </span>
          <p className="text-xl font-bold text-blue-400 mt-1">
            {formatVND(
              activeMonthMetrics ? activeMonthMetrics.profit : grandProfit,
              displayUnit
            )}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Chi phí dịch vụ: {formatVND(activeMonthMetrics ? activeMonthMetrics.cpDichVu : grandCpDichVu, displayUnit)}
          </p>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
            Data Dịch Vụ & Data CL Việt Kiều
          </span>
          <p className="text-xl font-bold text-cyan-400 mt-1">
            {(activeMonthMetrics ? activeMonthMetrics.dataDichVu : grandDataDichVu).toLocaleString('vi-VN')}{' '}
            <span className="text-xs text-slate-400 font-normal">DV</span>
            <span className="text-slate-500 mx-1">•</span>
            <span className="text-emerald-400 font-bold">
              {(activeMonthMetrics ? activeMonthMetrics.dataChatLuong : grandDataChatLuong).toLocaleString('vi-VN')}
            </span>{' '}
            <span className="text-xs text-slate-400 font-normal">CL</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Tỷ lệ CL: <strong className="text-emerald-300">{formatPercent(activeMonthMetrics ? activeMonthMetrics.qualityRatio : grandQualityRatio)}</strong> • CP/Data DV: <strong className="text-amber-300">{formatVND(activeMonthMetrics ? activeMonthMetrics.cpPerDataSvc : avgCpPerDataSvc, displayUnit)}</strong>
          </p>
        </div>
      </div>

      {/* Interactive Main Chart */}
      <div className="h-[320px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'revenue' ? (
            <ComposedChart data={vietKieuMonthly} margin={{ top: 15, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={11} tickLine={false} />
              <YAxis
                yAxisId="left"
                tickFormatter={formatChartAxisVND}
                stroke="#94a3b8"
                fontSize={11}
                width={65}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }} />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                name="Doanh Thu Việt Kiều"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="costVAT"
                name="Chi Phí (VAT)"
                fill="#f59e0b"
                radius={[6, 6, 0, 0]}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="profit"
                name="Lợi Nhuận"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 4, fill: '#3b82f6' }}
              />
            </ComposedChart>
          ) : (
            <BarChart data={vietKieuMonthly} margin={{ top: 15, right: 10, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="monthLabel" stroke="#cbd5e1" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} width={50} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }} />
              <Bar
                dataKey="dataDichVu"
                name="Data Dịch Vụ"
                fill="#06b6d4"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="dataChatLuong"
                name="Data CL (Chất Lượng)"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Detailed Monthly Breakdown Table for Việt Kiều */}
      <div className="space-y-2 pt-2 border-t border-slate-800">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            Bảng Chi Tiết Việt Kiều Từng Tháng
          </span>
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 uppercase tracking-wider font-semibold whitespace-nowrap">
              <tr>
                <th className="py-2.5 px-3">Tháng</th>
                <th className="py-2.5 px-3 text-right">Doanh Thu</th>
                <th className="py-2.5 px-3 text-right">Chi Phí (VAT)</th>
                <th className="py-2.5 px-3 text-right">Lợi Nhuận</th>
                <th className="py-2.5 px-3 text-center">% CP/DT</th>
                <th className="py-2.5 px-3 text-right">Data Dịch Vụ</th>
                <th className="py-2.5 px-3 text-right">Data CL</th>
                <th className="py-2.5 px-3 text-right">Tỷ Lệ CL</th>
                <th className="py-2.5 px-3 text-right">CP / Data DV</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {vietKieuMonthly.map((m) => {
                const isCurrentActive = activeMonth === m.monthNum;
                return (
                  <tr
                    key={m.monthNum}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      isCurrentActive ? 'bg-amber-500/10 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5 whitespace-nowrap">
                      {m.monthLabel}
                      {isCurrentActive && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 py-0.5 rounded whitespace-nowrap">
                          Đang xem
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-emerald-400 whitespace-nowrap">
                      {formatVND(m.revenue, displayUnit)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-amber-400 whitespace-nowrap">
                      {formatVND(m.costVAT, displayUnit)}
                    </td>
                    <td
                      className={`py-2.5 px-3 text-right font-bold whitespace-nowrap ${
                        m.profit >= 0 ? 'text-blue-400' : 'text-rose-400'
                      }`}
                    >
                      {formatVND(m.profit, displayUnit)}
                    </td>
                    <td className="py-2.5 px-3 text-center font-semibold text-purple-300 whitespace-nowrap">
                      {formatPercent(m.ratio)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-cyan-400 whitespace-nowrap">
                      {m.dataDichVu.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-400 whitespace-nowrap">
                      {m.dataChatLuong.toLocaleString('vi-VN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-semibold text-emerald-300 whitespace-nowrap">
                      {formatPercent(m.qualityRatio)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-300 whitespace-nowrap">
                      {formatVND(m.cpPerDataSvc, displayUnit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-slate-800/90 font-bold text-white border-t border-slate-700 whitespace-nowrap">
              <tr>
                <td className="py-2.5 px-3 whitespace-nowrap">TỔNG QUAN</td>
                <td className="py-2.5 px-3 text-right text-emerald-400 font-bold whitespace-nowrap">
                  {formatVND(grandRevenue, displayUnit)}
                </td>
                <td className="py-2.5 px-3 text-right text-amber-400 font-bold whitespace-nowrap">
                  {formatVND(grandCostVAT, displayUnit)}
                </td>
                <td className={`py-2.5 px-3 text-right font-bold whitespace-nowrap ${grandProfit >= 0 ? 'text-blue-400' : 'text-rose-400'}`}>
                  {formatVND(grandProfit, displayUnit)}
                </td>
                <td className="py-2.5 px-3 text-center text-purple-300 font-bold whitespace-nowrap">
                  {formatPercent(grandRatio)}
                </td>
                <td className="py-2.5 px-3 text-right text-cyan-400 font-bold whitespace-nowrap">
                  {grandDataDichVu.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-400 font-bold whitespace-nowrap">
                  {grandDataChatLuong.toLocaleString('vi-VN')}
                </td>
                <td className="py-2.5 px-3 text-right text-emerald-300 font-bold whitespace-nowrap">
                  {formatPercent(grandQualityRatio)}
                </td>
                <td className="py-2.5 px-3 text-right text-slate-300 font-bold whitespace-nowrap">
                  {formatVND(avgCpPerDataSvc, displayUnit)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
