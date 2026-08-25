import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Scale, ArrowUpDown } from 'lucide-react';
import { RegionData } from '../data/revenueData';
import { DisplayUnit } from '../types';
import { formatVND, formatChartAxisVND, formatPercent } from '../utils/formatters';

interface CombinedChartProps {
  regions: RegionData[];
  monthLabel: string;
  displayUnit: DisplayUnit;
}

export const CombinedChart: React.FC<CombinedChartProps> = ({
  regions,
  monthLabel,
  displayUnit,
}) => {
  const [sortKey, setSortKey] = useState<'revenue' | 'cost' | 'profit'>('revenue');

  const chartData = [...regions]
    .map((r) => {
      const revenue = r.revenue || 0;
      const costVAT = r.costVAT || 0;
      const profit = revenue - costVAT;
      const ratio = revenue > 0 ? (costVAT / revenue) * 100 : 0;
      return {
        name: r.name,
        revenue,
        costVAT,
        profit,
        ratio,
      };
    })
    .sort((a, b) => {
      if (sortKey === 'revenue') return b.revenue - a.revenue;
      if (sortKey === 'cost') return b.costVAT - a.costVAT;
      return b.profit - a.profit;
    });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 z-50 min-w-[210px]">
          <p className="font-bold text-white text-sm border-b border-slate-800 pb-1 flex items-center justify-between">
            <span>{data.name}</span>
            <span className="text-blue-400 font-semibold">{monthLabel}</span>
          </p>
          <div className="flex justify-between items-center text-slate-300 pt-1">
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
          <div className="flex justify-between items-center text-slate-300 border-t border-slate-800/80 pt-1">
            <span className="text-blue-400 font-medium">Lợi Nhuận:</span>
            <span
              className={`font-bold ${
                data.profit >= 0 ? 'text-blue-400' : 'text-rose-400'
              }`}
            >
              {formatVND(data.profit, displayUnit)}
            </span>
          </div>
          <div className="flex justify-between items-center text-slate-400">
            <span>Tỷ lệ % CP/DT:</span>
            <span
              className={`font-semibold ${
                data.ratio <= 20
                  ? 'text-emerald-400'
                  : data.ratio <= 50
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }`}
            >
              {formatPercent(data.ratio)}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Scale className="w-4 h-4" />
            </div>
            <span>So Sánh Doanh Thu vs Chi Phí (VAT)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {monthLabel} • Quan sát tương quan giữa Doanh Thu và Chi Phí (VAT) theo từng khu vực
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3 h-3 text-slate-400" /> Sắp xếp theo:
          </span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as any)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="revenue">Doanh Thu cao nhất</option>
            <option value="cost">Chi Phí cao nhất</option>
            <option value="profit">Lợi Nhuận cao nhất</option>
          </select>
        </div>
      </div>

      <div className="h-[380px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 10, left: 10, bottom: 45 }}>
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
            <YAxis tickFormatter={formatChartAxisVND} stroke="#94a3b8" fontSize={11} width={65} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: '15px', fontSize: '12px' }}
            />
            <Bar dataKey="revenue" name="Doanh Thu" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="costVAT" name="Chi Phí (VAT)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
