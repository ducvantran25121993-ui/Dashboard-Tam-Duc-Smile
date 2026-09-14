import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  Clock,
  Phone,
  User,
  Building2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Download,
  FileSpreadsheet,
  AlertCircle,
  Eye,
  KeyRound,
  Save,
  ChevronRight,
  Database,
  Layers,
  Sparkles,
  Award,
  DollarSign,
  Tag,
  ArrowUpRight,
  SlidersHorizontal,
} from 'lucide-react';
import { VTTechTicket } from '../types/vttech';
import {
  fetchVTTechConfig,
  saveVTTechConfig,
  fetchCachedVTTechTickets,
  syncVTTechTickets,
} from '../services/vttechService';

export const VTTechCRMView: React.FC = () => {
  const [tickets, setTickets] = useState<VTTechTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  // Config modal / expand state
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [configCookie, setConfigCookie] = useState<string>('');
  const [configSecretKey, setConfigSecretKey] = useState<string>('');
  const [configXsrfToken, setConfigXsrfToken] = useState<string>('');
  const [configUserId, setConfigUserId] = useState<number>(1412);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);

  // Selected Ticket detail modal
  const [selectedTicket, setSelectedTicket] = useState<VTTechTicket | null>(null);

  // Initial load
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const [cacheRes, configRes] = await Promise.all([
        fetchCachedVTTechTickets(),
        fetchVTTechConfig(),
      ]);

      if (cacheRes.data && cacheRes.data.length > 0) {
        setTickets(cacheRes.data);
        setLastSyncTime(cacheRes.cachedAt);
      } else {
        // Auto-sync if cache is empty
        handleSync();
      }

      if (configRes.success && configRes.config) {
        setConfigUserId(configRes.config.userID || 1412);
        if (configRes.config.lastSyncTime) {
          setLastSyncTime(configRes.config.lastSyncTime);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải dữ liệu ban đầu');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await syncVTTechTickets({
        dateFrom: dateFrom ? `${dateFrom} 00:00:00` : undefined,
        dateTo: dateTo ? `${dateTo} 23:59:59` : undefined,
        limit: 500,
      });

      if (res.success && res.data) {
        setTickets(res.data);
        setLastSyncTime(res.cachedAt);
        setSuccessMessage(`Đã đồng bộ thành công ${res.data.length} Ticket từ VTTech Tâm Đức Smile!`);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        throw new Error(res.error || 'Đồng bộ không thành công');
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi đồng bộ: ${err.message}. Đang hiển thị dữ liệu lưu gần nhất.`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await saveVTTechConfig({
        cookie: configCookie || undefined,
        secretKey: configSecretKey || undefined,
        xsrfToken: configXsrfToken || undefined,
        userID: configUserId,
      });
      if (res.success) {
        setSuccessMessage('Đã cập nhật cấu hình bảo mật VTTech thành công!');
        setIsConfigOpen(false);
        setTimeout(() => setSuccessMessage(''), 4000);
      } else {
        throw new Error(res.error || 'Không thể lưu cấu hình');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setSavingConfig(false);
    }
  };

  // Extract unique sources & branches for dropdowns
  const availableSources = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (t.SourceName) set.add(t.SourceName.trim());
    });
    return Array.from(set);
  }, [tickets]);

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (t.StatusName) set.add(t.StatusName.trim());
    });
    return Array.from(set);
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const search = searchTerm.toLowerCase();
      const matchSearch =
        !searchTerm ||
        (t.TicketName && t.TicketName.toLowerCase().includes(search)) ||
        (t.Phone && t.Phone.includes(search)) ||
        (t.CustCode && t.CustCode.toLowerCase().includes(search)) ||
        (t.Content && t.Content.toLowerCase().includes(search)) ||
        (t.TicketID && String(t.TicketID).includes(search));

      const matchSource = selectedSource === 'all' || t.SourceName === selectedSource;
      const matchStatus = selectedStatus === 'all' || t.StatusName === selectedStatus;

      return matchSearch && matchSource && matchStatus;
    });
  }, [tickets, searchTerm, selectedSource, selectedStatus]);

  // Key KPI metrics
  const kpis = useMemo(() => {
    const total = tickets.length;
    const booked = tickets.filter((t) => t.IsBook === 1 || (t.StatusName && t.StatusName.toLowerCase().includes('lịch hẹn'))).length;
    const hasGclid = tickets.filter((t) => t.Gclid && t.Gclid.length > 5).length;
    const isNew = tickets.filter((t) => t.StatusName && t.StatusName.toLowerCase().includes('mới')).length;
    const arrived = tickets.filter((t) => t.StatusName && t.StatusName.toLowerCase().includes('đến')).length;

    return {
      total,
      booked,
      bookedRate: total > 0 ? Math.round((booked / total) * 100) : 0,
      hasGclid,
      isNew,
      arrived,
    };
  }, [tickets]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredTickets.length === 0) return;
    const headers = ['Mã Ticket', 'Khách hàng', 'SĐT', 'Nguồn', 'Trạng thái', 'Chi nhánh', 'Thời gian hẹn', 'GCLID Google Ads', 'Nội dung tư vấn', 'Ngày tạo'];
    const rows = filteredTickets.map((t) => [
      t.TicketID,
      `"${(t.TicketName || '').replace(/"/g, '""')}"`,
      `"${t.Phone || ''}"`,
      `"${(t.SourceName || '').replace(/"/g, '""')}"`,
      `"${(t.StatusName || '').replace(/"/g, '""')}"`,
      `"${(t.AppBranch || '').replace(/"/g, '""')}"`,
      `"${t.AppDateFrom && !t.AppDateFrom.startsWith('1900') ? t.AppDateFrom : ''}"`,
      `"${t.Gclid || ''}"`,
      `"${(t.Content || '').replace(/"/g, '""')}"`,
      `"${t.Created || ''}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `VTTech_Ticket_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-orange-900/40 via-amber-900/20 to-slate-900/50 rounded-2xl border border-orange-500/30 p-6 backdrop-blur-md shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 text-white font-bold">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  VTTech Solution CRM
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-orange-500/20 text-orange-300 border border-orange-500/40">
                    Live API Connected
                  </span>
                </h1>
                <p className="text-sm text-slate-300">
                  Đồng bộ tự động danh sách Ticket Marketing từ hệ thống Nha Khoa Tâm Đức Smile (nktamduc.vttechsolution.com)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-medium transition-all shadow-sm"
              title="Cấu hình Token / Cookie VTTech"
            >
              <KeyRound className="w-4 h-4 text-orange-400" />
              <span>Cấu Hình API</span>
            </button>

            <button
              onClick={handleExportCSV}
              disabled={filteredTickets.length === 0}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-sm font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Xuất Excel/CSV</span>
            </button>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Đang Đồng Bộ...' : 'Đồng Bộ VTTech Ngay'}</span>
            </button>
          </div>
        </div>

        {/* Sync Status Info */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Máy chủ VTTech: <strong className="text-slate-200">nktamduc.vttechsolution.com</strong>
            </span>
            <span>
              Người thao tác: <strong className="text-slate-200">Văn Đức (ID: 1412)</strong>
            </span>
          </div>
          {lastSyncTime && (
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Lần đồng bộ gần nhất: <strong className="text-slate-300">{new Date(lastSyncTime).toLocaleString('vi-VN')}</strong>
            </span>
          )}
        </div>
      </div>

      {/* Alert Banners */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong>Thông báo:</strong> {errorMessage}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>{successMessage}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tổng Vé (Ticket)</span>
            <Database className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-white">{kpis.total.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Dữ liệu từ VTTech</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Data Mới Tiếp Nhận</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold text-cyan-400">{kpis.isNew.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cần gọi xử lý ngay</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đã Đặt Lịch Hẹn</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{kpis.booked.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400/80 mt-1">Tỷ lệ đặt hẹn: {kpis.bookedRate}%</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đã Đến Khám</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{kpis.arrived.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Tại 17 cơ sở Tâm Đức</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>GCLID Google Ads</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{kpis.hasGclid.toLocaleString()}</div>
          <div className="text-[11px] text-slate-500 mt-1">Có mã đối soát chuyển đổi</div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo Mã Ticket, Tên khách hàng, Số điện thoại, Nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          {/* Filter Source */}
          <div className="w-full md:w-56">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả Nguồn ({availableSources.length})</option>
              {availableSources.map((src) => (
                <option key={src} value={src}>
                  {src}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="w-full md:w-56">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả Trạng Thái ({availableStatuses.length})</option>
              {availableStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date Filter & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-t border-slate-800/60 text-slate-400">
          <div className="flex items-center gap-2">
            <span>Hiển thị: <strong className="text-white">{filteredTickets.length}</strong> / {tickets.length} Ticket</span>
            {(searchTerm || selectedSource !== 'all' || selectedStatus !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSource('all');
                  setSelectedStatus('all');
                }}
                className="text-orange-400 hover:underline ml-2"
              >
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span>Lọc ngày tải từ VTTech:</span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
            />
            <span>đến</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs"
            />
            <button
              onClick={handleSync}
              className="px-2.5 py-1 bg-orange-600/80 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors"
            >
              Tải lại
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs uppercase text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Mã Ticket</th>
                <th className="px-4 py-3.5">Khách Hàng</th>
                <th className="px-4 py-3.5">Số Điện Thoại</th>
                <th className="px-4 py-3.5">Nguồn</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
                <th className="px-4 py-3.5">Lịch Hẹn / Cơ Sở</th>
                <th className="px-4 py-3.5">Nội Dung Tư Vấn</th>
                <th className="px-4 py-3.5">Thời Gian</th>
                <th className="px-4 py-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-orange-400" />
                      <span>Đang tải danh sách vé VTTech...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    <div className="max-w-md mx-auto space-y-3">
                      <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
                      <p className="text-slate-300 font-medium">Chưa có ticket nào phù hợp với bộ lọc</p>
                      <p className="text-xs text-slate-500">
                        Bấm nút <strong>"Đồng Bộ VTTech Ngay"</strong> ở trên để kéo dữ liệu mới nhất về.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {!loading &&
                filteredTickets.map((t) => {
                  const hasValidAppointment = t.AppDateFrom && !t.AppDateFrom.startsWith('1900');
                  return (
                    <tr
                      key={t.TicketID}
                      onClick={() => setSelectedTicket(t)}
                      className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                    >
                      {/* TicketID */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono text-xs text-orange-400 font-semibold">
                        #{t.TicketID}
                      </td>

                      {/* Customer Name */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="font-semibold text-white flex items-center gap-1.5">
                          <span>{t.TicketName || 'Khách vãng lai'}</span>
                          {t.CustCode && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
                              {t.CustCode}
                            </span>
                          )}
                        </div>
                        {t.Gclid && (
                          <div className="text-[10px] text-amber-400 flex items-center gap-1 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            <span>Google Ads GCLID</span>
                          </div>
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="font-mono text-xs text-slate-200 bg-slate-950/60 px-2 py-1 rounded border border-slate-800">
                          {t.Phone ? `${t.Phone.slice(0, 4)}***${t.Phone.slice(-3)}` : 'Chưa có SĐT'}
                        </span>
                      </td>

                      {/* Source */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/30">
                          {t.SourceName || 'Trực tiếp'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs font-medium border"
                          style={{
                            backgroundColor: t.StatusDetailColor ? `${t.StatusDetailColor}20` : '#f9731620',
                            color: t.StatusDetailColor || '#fb923c',
                            borderColor: t.StatusDetailColor ? `${t.StatusDetailColor}50` : '#f9731650',
                          }}
                        >
                          {t.StatusName || 'Đang xử lý'}
                        </span>
                      </td>

                      {/* Appointment / Branch */}
                      <td className="px-4 py-3.5">
                        {hasValidAppointment ? (
                          <div className="text-xs">
                            <div className="text-emerald-400 font-medium flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{new Date(t.AppDateFrom!).toLocaleDateString('vi-VN')}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{t.AppBranch || 'Cơ sở Tâm Đức'}</div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">Chưa đặt hẹn</span>
                        )}
                      </td>

                      {/* Content Preview */}
                      <td className="px-4 py-3.5 max-w-xs truncate text-xs text-slate-300" title={t.Content}>
                        {t.Content || '—'}
                      </td>

                      {/* Created Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-400">
                        {t.Created ? new Date(t.Created).toLocaleDateString('vi-VN') : '—'}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 whitespace-nowrap text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTicket(t);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold">
                  #{selectedTicket.TicketID}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedTicket.TicketName}</h3>
                  <p className="text-xs text-slate-400">Mã khách hàng: {selectedTicket.CustCode || 'N/A'}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Số Điện Thoại</span>
                  <div className="font-mono text-sm font-semibold text-white">{selectedTicket.Phone || 'Không có'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Nguồn Khách Hàng</span>
                  <div className="text-sm font-semibold text-blue-400">{selectedTicket.SourceName || 'OL-HL'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Trạng Thái Ticket</span>
                  <div className="text-sm font-semibold text-orange-400">{selectedTicket.StatusName || 'Dữ Liệu Mới'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Chi Nhánh / Cơ Sở Hẹn</span>
                  <div className="text-sm font-semibold text-emerald-400">{selectedTicket.AppBranch || 'Chưa chọn'}</div>
                </div>
              </div>

              {/* Consultation Note */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">Nội Dung Tư Vấn / Ghi Chú</span>
                <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.Content || 'Chưa có ghi chú nội dung tư vấn cho ticket này.'}
                </p>
              </div>

              {/* Marketing & GCLID */}
              {selectedTicket.Gclid && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold">
                    <Sparkles className="w-4 h-4" />
                    <span>Mã Đối Soát Google Ads (GCLID)</span>
                  </div>
                  <div className="font-mono text-xs text-amber-200 break-all">{selectedTicket.Gclid}</div>
                </div>
              )}

              {/* Timestamps */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                <span>Ngày tạo: {selectedTicket.Created ? new Date(selectedTicket.Created).toLocaleString('vi-VN') : '—'}</span>
                {selectedTicket.ExecutedDate && (
                  <span>Xử lý lần cuối: {new Date(selectedTicket.ExecutedDate).toLocaleString('vi-VN')}</span>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Config Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold">
                <KeyRound className="w-5 h-5 text-orange-400" />
                <span>Cấu Hình Kết Nối VTTech Solution</span>
              </div>
              <button
                onClick={() => setIsConfigOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống hiện tại đã kết nối tự động với tài khoản <strong>Văn Đức (ID: 1412)</strong>. Khi VTTech hết hạn phiên đăng nhập, bạn chỉ cần F12 lấy lại Cookie hoặc Token mới và dán vào đây:
              </p>

              <div className="space-y-1">
                <label className="text-xs text-slate-300 font-medium">Cookie Xác Thực (.AspNetCore.Session & Cookie)</label>
                <textarea
                  rows={3}
                  value={configCookie}
                  onChange={(e) => setConfigCookie(e.target.value)}
                  placeholder="Dán toàn bộ Cookie từ cURL nếu cần cập nhật phiên đăng nhập mới..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">XSRF-TOKEN</label>
                  <input
                    type="text"
                    value={configXsrfToken}
                    onChange={(e) => setConfigXsrfToken(e.target.value)}
                    placeholder="CfDJ8..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-300 font-medium">SecretKey Header</label>
                  <input
                    type="text"
                    value={configSecretKey}
                    onChange={(e) => setConfigSecretKey(e.target.value)}
                    placeholder="bDpiCF..."
                    className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/30"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingConfig ? 'Đang lưu...' : 'Lưu Cấu Hình'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
