import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Users,
  Copy,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  Building2,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Tag
} from 'lucide-react';
import { FormLeadItem, FormLeadsResponse, FormLeadsStats } from '../types/formLead';
import { fetchFormLeads, triggerSyncFormLeads, FormLeadsFilterParams } from '../services/formLeadsService';

export const FormLeadsTable: React.FC = () => {
  const [data, setData] = useState<FormLeadsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedMonth, setSelectedMonth] = useState<number | 'all'>('all');
  const [selectedMode, setSelectedMode] = useState<'all' | 'today' | 'yesterday'>('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [filterDuplicate, setFilterDuplicate] = useState<'all' | 'unique' | 'duplicate' | 'invalid'>('all');
  const [page, setPage] = useState(1);
  const limit = 50;

  const loadData = async (force = false) => {
    try {
      if (force) setSyncing(true);
      else setLoading(true);
      setError(null);

      const params: FormLeadsFilterParams = {
        search,
        service: selectedService,
        branch: selectedBranch,
        filterDuplicate,
        month: selectedMonth,
        mode: selectedMode,
        page,
        limit,
        force,
      };

      const res = await fetchFormLeads(params);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Không thể tải dữ liệu form leads');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMonth, selectedMode, selectedService, selectedBranch, filterDuplicate, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  const handleSyncNow = async () => {
    try {
      setSyncing(true);
      await triggerSyncFormLeads();
      await loadData(true);
    } catch (err: any) {
      setError(err.message || 'Đồng bộ thất bại');
      setSyncing(false);
    }
  };

  const stats = data?.stats;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Card 1: Gross Submissions */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Tổng Lượt Điền Form</span>
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">
            {stats ? stats.totalSubmissions.toLocaleString('vi-VN') : '---'}
          </div>
          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <span className="text-blue-400 font-bold">100% Data thô</span> từ 01/01/2026
          </p>
        </div>

        {/* Card 2: Unique Leads */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-900/50 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Khách Hàng Độc Nhất</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-300">
            {stats ? stats.uniqueLeads.toLocaleString('vi-VN') : '---'}
          </div>
          <p className="text-[11px] text-emerald-400/90 mt-1">
            {stats ? `${((stats.uniqueLeads / (stats.totalSubmissions || 1)) * 100).toFixed(1)}% Data thực tế` : 'Đã lọc trùng số điện thoại'}
          </p>
        </div>

        {/* Card 3: Duplicates */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300">Lượt Điền Trùng (Spam)</span>
            <Copy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">
            {stats ? stats.duplicateSubmissions.toLocaleString('vi-VN') : '---'}
          </div>
          <p className="text-[11px] text-amber-400/90 mt-1">
            {stats ? `${stats.duplicateRate}% Tỷ lệ trùng tự gom nhóm` : 'Phát hiện theo lịch sử SĐT'}
          </p>
        </div>

        {/* Card 4: Today Real-time */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-purple-900/40 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">Hôm Nay (Realtime)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-300">
            {stats ? `+${stats.todaySubmissions}` : '---'}
          </div>
          <p className="text-[11px] text-purple-400/90 mt-1">
            {stats ? `${stats.todayUnique} khách mới • Hôm qua: ${stats.yesterdaySubmissions}` : 'Tự động đồng bộ'}
          </p>
        </div>
      </div>

      {/* Sync Status Banner */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Nguồn: Google Sheet Form Khách Hàng (Tự Động Làm Sạch & Lọc Trùng)</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                01/01/2026 ➔ Hiện tại
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Khớp nối với VTTech CRM ({stats?.overlapWithCRM?.matchedCount || 0} khách) • Tự động chuẩn hóa SĐT (+84, 0x) và nhóm các lần gửi trùng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto">
          <a
            href="https://docs.google.com/spreadsheets/d/1gG7aLnjQ2DkuKUMsma-XS4ii3FbJoAU-hreaI46nOX8/edit?pli=1&gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" /> Mở Sheet Gốc
          </a>
          <button
            onClick={handleSyncNow}
            disabled={syncing}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Đang đồng bộ...' : 'Làm mới từ Sheet'}
          </button>
        </div>
      </div>

      {/* Monthly distribution preview */}
      {stats && stats.monthly && (
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Xu Hướng Form Điền Qua Các Tháng Trong Năm 2026
            </span>
            <span className="text-xs text-slate-400">Bấm vào tháng để lọc nhanh</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
            {stats.monthly.map((m) => {
              const isSelected = selectedMonth === m.month && selectedMode === 'all';
              return (
                <button
                  key={m.month}
                  onClick={() => {
                    if (isSelected) {
                      setSelectedMonth('all');
                    } else {
                      setSelectedMonth(m.month);
                      setSelectedMode('all');
                      setPage(1);
                    }
                  }}
                  className={`p-2.5 rounded-lg border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                      : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">{m.label.replace('/2026', '')}</div>
                  <div className="text-sm font-black text-cyan-300 mt-0.5">{m.total.toLocaleString('vi-VN')}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">{m.unique} thật ({m.duplicates} trùng)</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Quick Date Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Thời gian:
            </span>
            {[
              { id: 'all', label: 'Tất cả (2026)' },
              { id: 'today', label: `Hôm nay (+${stats?.todaySubmissions || 0})` },
              { id: 'yesterday', label: 'Hôm qua' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setSelectedMode(btn.id as any);
                  if (btn.id !== 'all') setSelectedMonth('all');
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedMode === btn.id && (btn.id !== 'all' || selectedMonth === 'all')
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Deduplication Status Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lọc trùng:
            </span>
            {[
              { id: 'all', label: 'Tất cả' },
              { id: 'unique', label: 'Chỉ Data Độc Nhất (7.427)' },
              { id: 'duplicate', label: 'Chỉ Điền Trùng (1.195)' },
              { id: 'invalid', label: 'SĐT lỗi (143)' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setFilterDuplicate(btn.id as any);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterDuplicate === btn.id
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary row: Service, Branch dropdowns and Search input */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-1">
          {/* Service Dropdown */}
          <div>
            <select
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Tất cả dịch vụ ({stats?.totalSubmissions || 0})</option>
              {stats?.byService.map((s) => (
                <option key={s.service} value={s.service}>
                  {s.service} ({s.count.toLocaleString('vi-VN')})
                </option>
              ))}
            </select>
          </div>

          {/* Branch Dropdown */}
          <div>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="all">Tất cả khu vực ({stats?.totalSubmissions || 0})</option>
              {stats?.byBranch.map((b) => (
                <option key={b.branch} value={b.branch}>
                  {b.branch} ({b.count.toLocaleString('vi-VN')})
                </option>
              ))}
            </select>
          </div>

          {/* Search box */}
          <div className="sm:col-span-2">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên khách, SĐT, nội dung..."
                className="w-full pl-8 pr-16 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-[11px] font-bold text-white transition-colors cursor-pointer"
              >
                Tìm
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-3.5 bg-slate-800/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
          <div className="font-semibold flex items-center gap-2">
            <span>Danh Sách Khách Điền Form</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-700 text-cyan-300 font-bold">
              {data ? `${data.filteredCount?.toLocaleString('vi-VN')} kết quả` : 'Đang tải...'}
            </span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Hiển thị trang {page} / {data?.totalPages || 1} (50 dòng/trang)
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/50 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-700">
              <tr>
                <th className="py-2.5 px-3 whitespace-nowrap">Thời Gian Điền</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Họ Tên Khách</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Số Điện Thoại</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Dịch Vụ Quan Tâm</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Chi Nhánh</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">Trạng Thái Trùng</th>
                <th className="py-2.5 px-3 whitespace-nowrap text-center">Khớp CRM</th>
                <th className="py-2.5 px-3 min-w-[200px]">Nội Dung Tư Vấn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    Đang tải dữ liệu từ Google Sheet...
                  </td>
                </tr>
              ) : !data || data.leads.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy dữ liệu phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                data.leads.map((lead) => {
                  return (
                    <tr
                      key={lead.id}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        lead.isDuplicate ? 'bg-amber-950/10' : ''
                      }`}
                    >
                      {/* Time */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-300">
                        <div>{lead.timeStr}</div>
                        <div className="text-[10px] text-slate-500">{lead.dateStr}</div>
                      </td>

                      {/* Name */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-bold text-white">
                        {lead.name}
                      </td>

                      {/* Phone */}
                      <td className="py-2.5 px-3 whitespace-nowrap font-mono text-cyan-300">
                        {lead.phoneNormalized || lead.phone || (
                          <span className="text-rose-400 text-[10px]">Thiếu SĐT</span>
                        )}
                      </td>

                      {/* Service */}
                      <td className="py-2.5 px-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            lead.service === 'Implant'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
                              : lead.service === 'Răng Sứ'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-400/30'
                              : lead.service === 'Niềng Răng'
                              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                              : lead.service === 'Tổng Quát'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : 'bg-slate-700/60 text-slate-300 border border-slate-600/40'
                          }`}
                        >
                          {lead.service}
                        </span>
                      </td>

                      {/* Branch */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-slate-300">
                        <div className="font-medium text-slate-200">{lead.branchStandard}</div>
                        {lead.branch && lead.branch !== lead.branchStandard && (
                          <div className="text-[10px] text-slate-500 truncate max-w-[150px]">{lead.branch}</div>
                        )}
                      </td>

                      {/* Duplicate status badge */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-center">
                        {!lead.isValidPhone ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            <AlertTriangle className="w-3 h-3 text-rose-400" /> SĐT lỗi
                          </span>
                        ) : lead.isDuplicate ? (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 cursor-help"
                            title={`Khách này đã điền form lần ${lead.duplicateIndex}. Lần đầu lúc: ${lead.firstSeenAt}`}
                          >
                            <Copy className="w-3 h-3 text-amber-400" /> Trùng (Lần {lead.duplicateIndex})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Mới (Độc nhất)
                          </span>
                        )}
                      </td>

                      {/* CRM Overlap */}
                      <td className="py-2.5 px-3 whitespace-nowrap text-center">
                        {lead.inVTTech ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            Có vé CRM
                          </span>
                        ) : (
                          <span className="text-slate-600 text-[11px]">-</span>
                        )}
                      </td>

                      {/* Content & URL */}
                      <td className="py-2.5 px-3">
                        <div className="line-clamp-2 text-slate-300" title={lead.content || 'Không có ghi chú'}>
                          {lead.content || <span className="text-slate-500 italic">Không có ghi chú</span>}
                        </div>
                        {lead.url && (
                          <a
                            href={lead.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 mt-0.5 truncate max-w-[280px]"
                          >
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" /> {lead.url}
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.totalPages > 1 && (
          <div className="p-3 bg-slate-800/60 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, data.filteredCount || 0)} trong tổng số{' '}
              {data.filteredCount?.toLocaleString('vi-VN')} dòng
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Trước
              </button>
              <span className="text-xs font-bold text-white px-2">
                Trang {page} / {data.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                disabled={page >= data.totalPages}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold text-slate-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                Sau <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
