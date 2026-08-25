import React, { useState } from 'react';
import {
  Search,
  Download,
  ChevronDown,
  ChevronRight,
  Filter,
  Layers,
  ArrowUpDown,
  Building2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { RegionData } from '../data/revenueData';
import { DisplayUnit } from '../types';
import { formatVND, formatPercent, exportToCSV, isVietKieuRegion } from '../utils/formatters';

interface RegionalDetailTableProps {
  regions: RegionData[];
  monthLabel: string;
  displayUnit: DisplayUnit;
}

export const RegionalDetailTable: React.FC<RegionalDetailTableProps> = ({
  regions,
  monthLabel,
  displayUnit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
  const [sortField, setSortField] = useState<'revenue' | 'costVAT' | 'profit' | 'ratio' | 'name' | 'dataTong' | 'dataChatLuong'>('revenue');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const toggleExpand = (regionName: string) => {
    setExpandedRegions((prev) => ({
      ...prev,
      [regionName]: !prev[regionName],
    }));
  };

  const handleSort = (field: 'revenue' | 'costVAT' | 'profit' | 'ratio' | 'name' | 'dataTong' | 'dataChatLuong') => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // Process rows
  const processedRegions = regions
    .map((r) => {
      const revenue = r.revenue || 0;
      const costVAT = r.costVAT || 0;
      const profit = revenue - costVAT;
      const ratio = revenue > 0 ? (costVAT / revenue) * 100 : 0;
      const dataTong = r.services.reduce((sum, s) => sum + (s.dataCount || 0), 0) || r.totalData || 0;
      const dataChatLuong = r.dataChatLuong || 0;
      const tyLeCL = dataTong > 0 ? (dataChatLuong / dataTong) * 100 : 0;
      const cpPerData = dataTong > 0 ? costVAT / dataTong : 0;
      return {
        ...r,
        revenue,
        costVAT,
        profit,
        ratio,
        dataTong,
        dataChatLuong,
        tyLeCL,
        cpPerData,
      };
    })
    .filter((r) => {
      const search = searchTerm.toLowerCase();
      const matchRegion = r.name.toLowerCase().includes(search);
      const matchService = r.services.some((s) => s.name.toLowerCase().includes(search));
      return matchRegion || matchService;
    })
    .sort((a, b) => {
      let result = 0;
      if (sortField === 'name') result = a.name.localeCompare(b.name);
      else if (sortField === 'revenue') result = a.revenue - b.revenue;
      else if (sortField === 'costVAT') result = a.costVAT - b.costVAT;
      else if (sortField === 'profit') result = a.profit - b.profit;
      else if (sortField === 'ratio') result = a.ratio - b.ratio;
      else if (sortField === 'dataTong') result = a.dataTong - b.dataTong;
      else if (sortField === 'dataChatLuong') result = a.dataChatLuong - b.dataChatLuong;

      return sortOrder === 'desc' ? -result : result;
    });

  // Calculate totals (excluding Việt Kiều revenue as requested)
  const totalRevenue = processedRegions.reduce((sum, r) => {
    if (isVietKieuRegion(r.name)) return sum;
    return sum + r.revenue;
  }, 0);
  const totalCostVAT = processedRegions.reduce((sum, r) => sum + r.costVAT, 0);
  const totalProfit = totalRevenue - totalCostVAT;
  const totalRatio = totalRevenue > 0 ? (totalCostVAT / totalRevenue) * 100 : 0;
  const totalDataTong = processedRegions.reduce((sum, r) => sum + r.dataTong, 0);
  const totalDataChatLuong = processedRegions.reduce((sum, r) => sum + r.dataChatLuong, 0);

  const handleExportCSV = () => {
    const csvRows = processedRegions.flatMap((r) => {
      if (r.services.length === 0) {
        return [
          {
            'Khu Vực': r.name,
            'Dịch Vụ': 'Tổng',
            'Data Dịch Vụ': r.dataTong,
            'Data CL': r.dataChatLuong,
            'Doanh Thu (VNĐ)': r.revenue,
            'Chi Phí VAT (VNĐ)': r.costVAT,
            'CP Dịch Vụ (VNĐ)': r.cpDichVu || 0,
            'CP Tổng (VNĐ)': r.cpTong || 0,
            'Lợi Nhuận (VNĐ)': r.profit,
            'Tỷ Lệ CP/DT (%)': r.ratio.toFixed(2),
          },
        ];
      }
      return r.services.map((s) => {
        const svcDataDV = s.dataCount || 0;
        const svcDataCL =
          s.dataChatLuong !== undefined
            ? s.dataChatLuong
            : r.dataTong > 0
            ? Math.round(svcDataDV * (r.dataChatLuong / r.dataTong))
            : svcDataDV;
        return {
          'Khu Vực': r.name,
          'Dịch Vụ': s.name,
          'Data Dịch Vụ': svcDataDV,
          'Data CL': svcDataCL,
          'Doanh Thu (VNĐ)': r.revenue,
          'Chi Phí VAT (VNĐ)': r.costVAT,
          'CP Dịch Vụ (VNĐ)': s.cp,
          'Lợi Nhuận (VNĐ)': r.profit,
          'Tỷ Lệ CP/DT (%)': r.ratio.toFixed(2),
        };
      });
    });

    exportToCSV(`Bao_Cao_Khu_Vuc_${monthLabel.replace(/\s+/g, '_')}.csv`, csvRows);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg mt-6">
      {/* Table Header Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span>Bảng Chi Tiết Doanh Thu & Chi Phí Theo Khu Vực</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {monthLabel} • Hiển thị dữ liệu chi tiết, các gói dịch vụ và tỷ lệ chi phí trên doanh thu
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm khu vực hoặc dịch vụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* CSV Export */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Xuất CSV</span>
          </button>
        </div>
      </div>

      {/* Table View */}
      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-800/80 text-slate-300 uppercase tracking-wider font-semibold border-b border-slate-800 text-[11px] sm:text-xs">
            <tr>
              <th className="py-3 px-3 w-10 whitespace-nowrap"></th>
              <th
                onClick={() => handleSort('name')}
                className="py-3 px-3 cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center gap-1 whitespace-nowrap">
                  <span>Khu Vực</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th
                onClick={() => handleSort('dataTong')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  <span>Data Dịch Vụ</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th
                onClick={() => handleSort('dataChatLuong')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  <span>Data CL</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th
                onClick={() => handleSort('revenue')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  <span>Doanh Thu</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th
                onClick={() => handleSort('costVAT')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  <span>Chi Phí (VAT)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th
                onClick={() => handleSort('profit')}
                className="py-3 px-3 text-right cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                  <span>Lợi Nhuận</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th
                onClick={() => handleSort('ratio')}
                className="py-3 px-3 text-center cursor-pointer hover:text-white whitespace-nowrap"
              >
                <div className="flex items-center justify-center gap-1 whitespace-nowrap">
                  <span>% CP/DT (≤15%)</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400 shrink-0" />
                </div>
              </th>
              <th className="py-3 px-3 text-center whitespace-nowrap">Dịch Vụ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {processedRegions.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-slate-500">
                  Không tìm thấy khu vực nào phù hợp với từ khóa "{searchTerm}".
                </td>
              </tr>
            ) : (
              processedRegions.map((r) => {
                const isExpanded = expandedRegions[r.name];
                const hasServices = r.services && r.services.length > 0;

                return (
                  <React.Fragment key={r.name}>
                    <tr
                      onClick={() => hasServices && toggleExpand(r.name)}
                      className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                        isExpanded ? 'bg-slate-800/30' : ''
                      }`}
                    >
                      <td className="py-3 px-3 text-slate-500 text-center">
                        {hasServices ? (
                          isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-blue-400 inline" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400 inline" />
                          )
                        ) : null}
                      </td>
                      <td className="py-3 px-3 font-bold text-white text-sm whitespace-nowrap">
                        {r.name}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-cyan-400 text-sm whitespace-nowrap">
                        {r.dataTong.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                        {r.dataChatLuong.toLocaleString('vi-VN')}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-400 text-sm whitespace-nowrap">
                        {formatVND(r.revenue, displayUnit)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-amber-400 text-sm whitespace-nowrap">
                        {formatVND(r.costVAT, displayUnit)}
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-bold text-sm whitespace-nowrap ${
                          r.profit >= 0 ? 'text-blue-400' : 'text-rose-400'
                        }`}
                      >
                        {formatVND(r.profit, displayUnit)}
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                            r.ratio <= 15
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : r.ratio <= 35
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {r.ratio <= 15 ? (
                            <CheckCircle2 className="w-3 h-3 shrink-0" />
                          ) : (
                            <AlertCircle className="w-3 h-3 shrink-0" />
                          )}
                          {formatPercent(r.ratio)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">
                        <span className="bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-300">
                          {r.services.length} gói dịch vụ
                        </span>
                      </td>
                    </tr>

                    {/* Sub-rows for Services if expanded */}
                    {isExpanded && (
                      <>
                        {r.services.map((svc, idx) => {
                          const svcDataDV = svc.dataCount || 0;
                          const svcDataCL =
                            svc.dataChatLuong && svc.dataChatLuong > 0
                              ? svc.dataChatLuong
                              : r.dataTong > 0 && r.dataChatLuong > 0
                              ? Math.round(svcDataDV * (r.dataChatLuong / r.dataTong))
                              : svcDataDV;

                          return (
                            <tr
                              key={`${r.name}-svc-${idx}`}
                              className="bg-slate-950/60 border-l-2 border-l-blue-500 text-slate-400"
                            >
                              <td></td>
                              <td className="py-2.5 px-3 pl-8 flex items-center gap-2 font-medium text-slate-300 whitespace-nowrap">
                                <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <span className="whitespace-nowrap">{svc.name}</span>
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-cyan-300 whitespace-nowrap">
                                {svcDataDV ? `${svcDataDV.toLocaleString('vi-VN')} data` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-emerald-400 whitespace-nowrap">
                                {svcDataCL ? `${svcDataCL.toLocaleString('vi-VN')} data` : '—'}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-500 whitespace-nowrap">—</td>
                              <td className="py-2.5 px-3 text-right text-amber-300/90 font-medium whitespace-nowrap">
                                CP DV: {formatVND(svc.cp, displayUnit)}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-500 whitespace-nowrap">—</td>
                              <td className="py-2.5 px-3 text-center text-slate-500 whitespace-nowrap">—</td>
                              <td></td>
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>

          {/* Table Footer with Summary */}
          {processedRegions.length > 0 && (
            <tfoot className="bg-slate-800/90 font-bold text-white border-t-2 border-slate-700 whitespace-nowrap">
              <tr>
                <td className="py-3 px-3 whitespace-nowrap"></td>
                <td className="py-3.5 px-3 text-sm font-extrabold uppercase text-slate-200 whitespace-nowrap">
                  TỔNG KHU VỰC
                  <span className="block text-[11px] normal-case text-emerald-400 font-normal whitespace-nowrap">
                    ({processedRegions.length} Khu Vực • Đã trừ Doanh Thu Việt Kiều)
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right text-cyan-400 text-base font-extrabold whitespace-nowrap">
                  {totalDataTong.toLocaleString('vi-VN')}
                </td>
                <td className="py-3.5 px-3 text-right text-emerald-400 text-base font-extrabold whitespace-nowrap">
                  {totalDataChatLuong.toLocaleString('vi-VN')}
                </td>
                <td className="py-3.5 px-3 text-right text-emerald-400 text-base font-extrabold whitespace-nowrap">
                  {formatVND(totalRevenue, displayUnit)}
                </td>
                <td className="py-3.5 px-3 text-right text-amber-400 text-base font-extrabold whitespace-nowrap">
                  {formatVND(totalCostVAT, displayUnit)}
                </td>
                <td
                  className={`py-3.5 px-3 text-right text-base font-extrabold whitespace-nowrap ${
                    totalProfit >= 0 ? 'text-blue-400' : 'text-rose-400'
                  }`}
                >
                  {formatVND(totalProfit, displayUnit)}
                </td>
                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span className="bg-slate-700/80 text-purple-300 px-3 py-1 rounded-full text-xs font-bold border border-slate-600">
                    {formatPercent(totalRatio)}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-center text-slate-400 text-xs font-semibold whitespace-nowrap">
                  {processedRegions.reduce((sum, r) => sum + r.services.length, 0)} gói DV
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
