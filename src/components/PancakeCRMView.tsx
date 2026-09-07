import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  Calendar,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  Copy,
  Check,
  Tag as TagIcon,
  ShieldCheck,
  UserCheck,
  Building2,
  Clock,
  Sparkles,
  Layers,
  Settings,
  AlertCircle,
  TrendingUp,
  ExternalLink,
  ChevronDown,
  Play,
  Pause,
  CalendarDays,
  CalendarRange,
} from 'lucide-react';

interface PancakeTag {
  id: number;
  text: string;
  color: string;
}

interface PancakeNote {
  id: string;
  message: string;
  author: string;
  time: number;
}

interface PancakeLead {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  hasPhone: boolean;
  snippet: string;
  insertedAt: string;
  updatedAt: string;
  messageCount: number;
  tags: PancakeTag[];
  notes: PancakeNote[];
  branch: string;
  service: string;
  isWon: boolean;
  isLost: boolean;
  isBooked: boolean;
}

interface PancakeStatus {
  connected: boolean;
  pageId?: string;
  pageName?: string;
  tokenMasked?: string;
  totalTags?: number;
  tags?: PancakeTag[];
  autoSync?: boolean;
  updatedAt?: string;
  error?: string;
}

interface PancakeSummary {
  totalLeads: number;
  withPhone: number;
  booked: number;
  won: number;
  lost: number;
  byService: {
    implant: number;
    porcelain: number;
    ortho: number;
    vietKieu: number;
    general: number;
  };
}

export const getCleanPhone = (phone: any): string => {
  if (!phone) return '';
  if (typeof phone === 'string') return phone.trim();
  if (typeof phone === 'object') {
    return String(phone.phone_number || phone.captured || '').trim();
  }
  return String(phone).trim();
};

export const PancakeCRMView: React.FC = () => {
  const [status, setStatus] = useState<PancakeStatus | null>(null);
  const [leads, setLeads] = useState<PancakeLead[]>([]);
  const [summary, setSummary] = useState<PancakeSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState<boolean>(false);
  const [cacheAgeSeconds, setCacheAgeSeconds] = useState<number>(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'phone' | 'booked' | 'won' | 'lost'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('');
  
  // Date & Time Range Filters
  const [timeFilterMode, setTimeFilterMode] = useState<string>('today');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [filterLabel, setFilterLabel] = useState<string>('Hôm nay');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState<boolean>(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [isRealtimeActive, setIsRealtimeActive] = useState<boolean>(true);
  const [countdownSeconds, setCountdownSeconds] = useState<number>(15);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(new Date().toLocaleTimeString('vi-VN'));

  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  // All-time history sync state
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [syncAllProgress, setSyncAllProgress] = useState<{
    isRunning: boolean;
    currentWindow: string;
    totalCollected: number;
    windowsCompleted: number;
    totalWindows: number;
    percent: number;
    lastError?: string | null;
  } | null>(null);

  // Settings Modal
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);
  const [editToken, setEditToken] = useState<string>('');
  const [isSavingConfig, setIsSavingConfig] = useState<boolean>(false);
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null);

  const fetchPancakeData = async (showLoading = true, force = false) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      // 1. Fetch Status safely
      try {
        const statusRes = await fetch('/api/pancake/status');
        if (statusRes.ok) {
          const contentType = statusRes.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const statusData = await statusRes.json();
            setStatus(statusData);
          }
        }
      } catch (stErr) {
        console.warn('Pancake status fetch warning:', stErr);
      }

      // 2. Fetch Conversations & Leads safely with parameters
      let queryParams = `mode=${timeFilterMode}`;
      if (timeFilterMode === 'month') {
        queryParams += `&month=${selectedMonth}`;
      } else if (timeFilterMode === 'custom' && customStartDate && customEndDate) {
        queryParams += `&startDate=${customStartDate}&endDate=${customEndDate}`;
      }
      if (force) {
        queryParams += '&force=true';
      }

      const convRes = await fetch(`/api/pancake/conversations?${queryParams}`);

      const contentType = convRes.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Máy chủ Pancake đang xử lý tải dữ liệu. Vui lòng bấm "Thử lại ngay" để kết nối.'
        );
      }

      const convData = await convRes.json();

      if (convData.success) {
        const rawLeads: any[] = Array.isArray(convData.leads) ? convData.leads : [];
        const cleanLeads: PancakeLead[] = rawLeads.map((l) => {
          const cleanPhone = getCleanPhone(l.phone);
          return {
            ...l,
            phone: cleanPhone,
            hasPhone: Boolean(cleanPhone || l.hasPhone),
          };
        });
        setLeads(cleanLeads);
        setSummary(convData.summary || null);
        setIsFromCache(!!convData.fromCache);
        setCacheAgeSeconds(convData.cacheAgeSeconds || 0);
        if (convData.filterLabel) {
          setFilterLabel(convData.filterLabel);
        }
        setLastSyncedTime(new Date().toLocaleTimeString('vi-VN'));
      } else {
        setError(convData.error || 'Không thể tải danh sách khách từ Pancake');
      }
    } catch (err: any) {
      console.error('Fetch Pancake error:', err);
      setError(err.message || 'Lỗi mạng khi kết nối Pancake API');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Re-fetch on filter mode or date changes
  useEffect(() => {
    fetchPancakeData(true, timeFilterMode === 'today');
  }, [timeFilterMode, selectedMonth, customStartDate, customEndDate]);

  // Real-time polling effect when 'today' mode is active (mỗi 15s auto-refresh)
  useEffect(() => {
    if (timeFilterMode !== 'today' || !isRealtimeActive) return;

    setCountdownSeconds(15);
    const countdownTimer = setInterval(() => {
      setCountdownSeconds((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);

    const realtimeTimer = setInterval(() => {
      fetchPancakeData(false, true); // silent refresh từ Pancake API
      setCountdownSeconds(15);
    }, 15000);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(realtimeTimer);
    };
  }, [timeFilterMode, isRealtimeActive]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPancakeData(false, true);
  };

  const startSyncAllHistory = async (windowsToScan = 28) => {
    try {
      setIsSyncingAll(true);
      const res = await fetch('/api/pancake/sync-all-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ windows: windowsToScan }),
      });
      const data = await res.json();
      if (!data.success) {
        alert(data.error || 'Không thể bắt đầu đồng bộ toàn bộ lịch sử');
        setIsSyncingAll(false);
        return;
      }

      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch('/api/pancake/sync-all-status');
          if (statusRes.ok) {
            const statusData = await statusRes.json();
            setSyncAllProgress(statusData);
            if (!statusData.isRunning) {
              clearInterval(pollInterval);
              setIsSyncingAll(false);
              setTimeFilterMode('all');
              fetchPancakeData(false, false);
            }
          }
        } catch (_) {}
      }, 1500);
    } catch (err: any) {
      alert('Lỗi khởi động đồng bộ: ' + err.message);
      setIsSyncingAll(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPhone(id);
    setTimeout(() => setCopiedPhone(null), 2000);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editToken.trim()) return;
    setIsSavingConfig(true);
    setConfigSuccessMsg(null);
    try {
      const res = await fetch('/api/pancake/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: editToken.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setConfigSuccessMsg('Đã lưu cấu hình Token thành công!');
        setTimeout(() => {
          setIsConfigModalOpen(false);
          setConfigSuccessMsg(null);
          fetchPancakeData();
        }, 1200);
      }
    } catch (err: any) {
      alert('Lỗi lưu cấu hình: ' + err.message);
    } finally {
      setIsSavingConfig(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((item) => {
    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchPhone = item.phone.includes(q);
      const matchSnippet = item.snippet.toLowerCase().includes(q);
      const matchBranch = item.branch.toLowerCase().includes(q);
      const matchService = item.service.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSnippet && !matchBranch && !matchService) {
        return false;
      }
    }

    // Service filter
    if (selectedService !== 'all' && item.service !== selectedService) {
      return false;
    }

    // Status filter
    if (selectedStatusFilter === 'phone' && !item.hasPhone) return false;
    if (selectedStatusFilter === 'booked' && !item.isBooked) return false;
    if (selectedStatusFilter === 'won' && !item.isWon) return false;
    if (selectedStatusFilter === 'lost' && !item.isLost) return false;

    // Tag filter
    if (selectedTag) {
      const hasTag = item.tags.some((t) => t.text.toLowerCase() === selectedTag.toLowerCase());
      if (!hasTag) return false;
    }

    return true;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedService, selectedStatusFilter, selectedTag, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = filteredLeads.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-6">
      {/* Top Banner Connection Status */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 p-6 shadow-xl relative z-30">
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Kết Nối Trực Tiếp Pancake (Zalo OA)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                Page ID: {status?.pageId || 'pzl_329635242261010723'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Public API Active
              </span>
              {isFromCache && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Lưu đệm tốc độ cao ({cacheAgeSeconds > 60 ? `${Math.round(cacheAgeSeconds / 60)} phút trước` : `${cacheAgeSeconds}s trước`})
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {status?.pageName || 'Hệ Thống Nha Khoa Tâm Đức Smile (Zalo OA)'}
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Hệ thống tự động đồng bộ hội thoại tư vấn, số điện thoại khách hàng, phân loại chuyên khoa (Implant, Sứ, Niềng răng) và điều phối về 17 cơ sở.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center flex-wrap">
            <button
              onClick={() => startSyncAllHistory(28)}
              disabled={isSyncingAll || syncAllProgress?.isRunning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold flex items-center gap-2 transition shadow-md active:scale-95 disabled:opacity-50"
              title="Quét và kéo toàn bộ hội thoại từ trước đến nay (từ năm 2024 đến nay) qua nhiều đợt an toàn"
            >
              <Layers className={`w-4 h-4 ${isSyncingAll || syncAllProgress?.isRunning ? 'animate-spin' : ''}`} />
              {isSyncingAll || syncAllProgress?.isRunning ? 'Đang kéo toàn bộ...' : 'Kéo Toàn Bộ Lịch Sử Từ Trước Đến Nay'}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isSyncingAll}
              className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-sm font-semibold flex items-center gap-2 transition shadow-sm active:scale-95 disabled:opacity-50"
              title="Cập nhật dữ liệu mới nhất từ Pancake"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Đang đồng bộ...' : 'Đồng Bộ Nhanh'}
            </button>

            <button
              onClick={() => {
                setEditToken(status?.tokenMasked || '');
                setIsConfigModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm font-medium flex items-center gap-1.5 transition"
              title="Quản lý Token hoặc thêm Page"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              Cấu hình Token
            </button>
          </div>
        </div>

        {/* Date & Time Range Selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-300">Khoảng thời gian:</span>

            {/* Hôm Nay (Real-time Live) */}
            <button
              onClick={() => {
                setTimeFilterMode('today');
                setIsMonthPickerOpen(false);
                setIsDatePickerOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 shadow-sm ${
                timeFilterMode === 'today'
                  ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400/50'
                  : 'bg-slate-800/90 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-950/40'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${timeFilterMode === 'today' ? 'bg-slate-950 animate-pulse' : 'bg-emerald-400 animate-ping'}`} />
              Hôm Nay (Live)
            </button>

            {/* Hôm Qua */}
            <button
              onClick={() => {
                setTimeFilterMode('yesterday');
                setIsMonthPickerOpen(false);
                setIsDatePickerOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                timeFilterMode === 'yesterday'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Hôm Qua
            </button>

            {/* Standard Presets */}
            {[
              { label: '3 Ngày', value: '3' },
              { label: '7 Ngày', value: '7' },
              { label: '14 Ngày', value: '14' },
              { label: '30 Ngày', value: '30' },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setTimeFilterMode(r.value);
                  setIsMonthPickerOpen(false);
                  setIsDatePickerOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  timeFilterMode === r.value
                    ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}

            {/* Chọn Tháng (Lịch tháng) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsMonthPickerOpen(!isMonthPickerOpen);
                  setIsDatePickerOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 border ${
                  timeFilterMode === 'month'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-800 text-cyan-400 border-cyan-500/30 hover:bg-slate-700'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                {timeFilterMode === 'month'
                  ? `Tháng ${selectedMonth.split('-')[1]}/${selectedMonth.split('-')[0]}`
                  : 'Chọn Tháng 📅'}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Month Picker Dropdown */}
              {isMonthPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsMonthPickerOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 p-3.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                      <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-cyan-400" />
                        Chọn Tháng Báo Cáo
                      </span>
                      <button
                        onClick={() => setIsMonthPickerOpen(false)}
                        className="text-slate-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Chọn tháng bất kỳ:</label>
                        <input
                          type="month"
                          value={selectedMonth}
                          onChange={(e) => {
                            if (e.target.value) {
                              setSelectedMonth(e.target.value);
                              setTimeFilterMode('month');
                              setIsMonthPickerOpen(false);
                            }
                          }}
                          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div>
                        <div className="text-[11px] text-slate-400 font-medium mb-1.5">Các tháng nhanh:</div>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { label: 'Tháng 9/2026 (Này)', value: '2026-09' },
                            { label: 'Tháng 8/2026', value: '2026-08' },
                            { label: 'Tháng 7/2026', value: '2026-07' },
                            { label: 'Tháng 6/2026', value: '2026-06' },
                            { label: 'Tháng 5/2026', value: '2026-05' },
                            { label: 'Tháng 4/2026', value: '2026-04' },
                            { label: 'Tháng 3/2026', value: '2026-03' },
                            { label: 'Tháng 2/2026', value: '2026-02' },
                            { label: 'Tháng 1/2026', value: '2026-01' },
                            { label: 'Tháng 12/2025', value: '2025-12' },
                          ].map((m) => (
                            <button
                              key={m.value}
                              onClick={() => {
                                setSelectedMonth(m.value);
                                setTimeFilterMode('month');
                                setIsMonthPickerOpen(false);
                              }}
                              className={`px-2 py-1.5 text-[11px] rounded-lg text-left transition ${
                                selectedMonth === m.value && timeFilterMode === 'month'
                                  ? 'bg-cyan-500 text-slate-950 font-bold'
                                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                              }`}
                            >
                              {m.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Chọn Ngày Tùy Biến (Lịch) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsDatePickerOpen(!isDatePickerOpen);
                  setIsMonthPickerOpen(false);
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 border ${
                  timeFilterMode === 'custom'
                    ? 'bg-indigo-500 text-white border-indigo-400 font-bold shadow-sm'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                <CalendarRange className="w-3.5 h-3.5 text-indigo-400" />
                {timeFilterMode === 'custom' && customStartDate && customEndDate
                  ? `${customStartDate.slice(5)} → ${customEndDate.slice(5)}`
                  : 'Lịch Ngày'}
              </button>

              {/* Date Range Dropdown */}
              {isDatePickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDatePickerOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 p-3.5 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                      <span className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        Chọn Khoảng Ngày Cụ Thể
                      </span>
                      <button
                        onClick={() => setIsDatePickerOpen(false)}
                        className="text-slate-400 hover:text-white text-xs px-1"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Từ ngày:</label>
                        <input
                          type="date"
                          value={customStartDate}
                          onChange={(e) => setCustomStartDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Đến ngày:</label>
                        <input
                          type="date"
                          value={customEndDate}
                          onChange={(e) => setCustomEndDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <button
                        onClick={() => {
                          if (customStartDate && customEndDate) {
                            setTimeFilterMode('custom');
                            setIsDatePickerOpen(false);
                          } else {
                            alert('Vui lòng chọn cả ngày bắt đầu và kết thúc');
                          }
                        }}
                        className="w-full py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition mt-1"
                      >
                        Áp Dụng Khoảng Ngày
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Tất Cả Lịch Sử */}
            <button
              onClick={() => {
                setTimeFilterMode('all');
                setIsMonthPickerOpen(false);
                setIsDatePickerOpen(false);
              }}
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition ${
                timeFilterMode === 'all'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              Tất Cả Lịch Sử (Đã lưu)
            </button>
          </div>

          {/* Real-time Status / Sync Indicator */}
          <div className="flex items-center gap-3">
            {timeFilterMode === 'today' && (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs">
                <span className="relative flex h-2 w-2">
                  {isRealtimeActive && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isRealtimeActive ? 'bg-emerald-500' : 'bg-slate-500'}`}></span>
                </span>
                <span className="font-bold text-[11px] tracking-wide">
                  {isRealtimeActive ? `REAL-TIME (${countdownSeconds}s)` : 'TẠM DỪNG'}
                </span>
                <button
                  onClick={() => setIsRealtimeActive(!isRealtimeActive)}
                  className="p-0.5 rounded hover:bg-emerald-500/20 text-emerald-300 ml-1"
                  title={isRealtimeActive ? 'Tạm dừng Real-time' : 'Bật lại Real-time'}
                >
                  {isRealtimeActive ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                </button>
              </div>
            )}
            <div className="text-slate-400 text-xs">
              Đồng bộ: <span className="text-slate-300 font-mono font-semibold">{lastSyncedTime}</span>
            </div>
          </div>
        </div>

        {/* Live All-time Progress Banner */}
        {syncAllProgress && (syncAllProgress.isRunning || isSyncingAll) && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-teal-950/80 to-slate-900 border border-teal-500/40 shadow-xl space-y-2.5 animate-in fade-in">
            <div className="flex items-center justify-between text-xs flex-wrap gap-2">
              <span className="font-bold text-teal-300 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-teal-400 animate-spin" />
                {syncAllProgress.currentWindow || 'Đang đồng bộ dữ liệu toàn thời gian...'}
              </span>
              <span className="font-mono text-teal-300 font-bold px-2 py-0.5 rounded bg-teal-500/20 border border-teal-500/30">
                {syncAllProgress.totalCollected.toLocaleString('vi-VN')} khách ({syncAllProgress.percent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-400 to-teal-400 h-2 transition-all duration-500 rounded-full"
                style={{ width: `${Math.max(5, syncAllProgress.percent)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Hệ thống tự động chia theo các cửa sổ 28 ngày và gộp loại bỏ trùng lặp. Không ảnh hưởng nhân viên trực chat.</span>
              <span className="font-medium text-slate-300">{syncAllProgress.windowsCompleted} / {syncAllProgress.totalWindows} đợt</span>
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tổng Hội Thoại</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary?.totalLeads || leads.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            {filterLabel}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-emerald-500/20 bg-emerald-950/10 shadow-md">
          <div className="flex items-center justify-between text-emerald-400 text-xs mb-1">
            <span>Data Có SĐT</span>
            <Phone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {summary?.withPhone || leads.filter((l) => l.hasPhone).length}
          </div>
          <div className="text-[11px] text-emerald-500/70 mt-1">
            Tỉ lệ có SĐT:{' '}
            {summary?.totalLeads ? Math.round((summary.withPhone / summary.totalLeads) * 100) : 0}%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-blue-500/20 bg-blue-950/10 shadow-md">
          <div className="flex items-center justify-between text-blue-400 text-xs mb-1">
            <span>Đã Đặt Hẹn (DDH)</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">
            {summary?.booked || leads.filter((l) => l.isBooked).length}
          </div>
          <div className="text-[11px] text-blue-500/70 mt-1">Hẹn đến 17 cơ sở</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-amber-500/20 bg-amber-950/10 shadow-md">
          <div className="flex items-center justify-between text-amber-400 text-xs mb-1">
            <span>Chốt Ca (#ĐẬU)</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">
            {summary?.won || leads.filter((l) => l.isWon).length}
          </div>
          <div className="text-[11px] text-amber-500/70 mt-1">Khách đã làm dịch vụ</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/90 border border-purple-500/20 bg-purple-950/10 shadow-md col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-purple-400 text-xs mb-1">
            <span>Ca Trọng Điểm</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">
            {(summary?.byService.implant || 0) + (summary?.byService.porcelain || 0)}
          </div>
          <div className="text-[11px] text-purple-500/70 mt-1">
            {summary?.byService.implant || 0} Implant • {summary?.byService.porcelain || 0} Sứ
          </div>
        </div>
      </div>

      {/* Tag cloud from Pancake */}
      {status?.tags && status.tags.length > 0 && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <TagIcon className="w-3.5 h-3.5 text-cyan-400" />
              Thẻ Nhãn Pancake (Nhấp để lọc nhanh):
            </span>
            {selectedTag && (
              <button
                onClick={() => setSelectedTag('')}
                className="text-xs text-rose-400 hover:underline"
              >
                Hủy lọc thẻ [{selectedTag}]
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {status.tags.slice(0, 24).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(selectedTag === t.text ? '' : t.text)}
                style={{
                  backgroundColor: selectedTag === t.text ? t.color : `${t.color}22`,
                  borderColor: t.color,
                  color: selectedTag === t.text ? '#ffffff' : '#e2e8f0',
                }}
                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border transition ${
                  selectedTag === t.text ? 'shadow-md scale-105' : 'hover:opacity-80'
                }`}
              >
                {t.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between shadow-lg">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên, SĐT, cơ sở, nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
          {/* Service filter */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-200 focus:outline-none focus:border-teal-500"
          >
            <option value="all">Tất Cả Dịch Vụ</option>
            <option value="Implant">Implant</option>
            <option value="Răng Sứ">Răng Sứ</option>
            <option value="Niềng Răng / Chỉnh Nha">Niềng Răng</option>
            <option value="Khám Tổng Quát">Khám Tổng Quát</option>
            <option value="Việt Kiều">Việt Kiều</option>
            <option value="Tư Vấn Chung">Tư Vấn Chung</option>
          </select>

          {/* Status filter */}
          <div className="flex rounded-xl bg-slate-800 p-0.5 border border-slate-700 text-xs">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedStatusFilter === 'all'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setSelectedStatusFilter('phone')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedStatusFilter === 'phone'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Có SĐT
            </button>
            <button
              onClick={() => setSelectedStatusFilter('booked')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedStatusFilter === 'booked'
                  ? 'bg-blue-500 text-white font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Đã Hẹn
            </button>
            <button
              onClick={() => setSelectedStatusFilter('won')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedStatusFilter === 'won'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              #ĐẬU
            </button>
          </div>
        </div>
      </div>

      {/* Main Leads List / Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-teal-400" />
            Danh Sách Khách Hàng Đồng Bộ Từ Pancake
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 font-mono font-bold border border-slate-700">
              {filteredLeads.length} / {leads.length} khách (Đã gom đầy đủ tất cả các trang)
            </span>
          </h3>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Tự động trích xuất SĐT & Nhánh cơ sở từ ghi chú
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
            <p className="text-sm text-slate-400">Đang đồng bộ dữ liệu từ Pancake Zalo OA...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300">{error}</p>
            <button
              onClick={() => fetchPancakeData(true, true)}
              className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition shadow-lg inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Thử lại kết nối ngay
            </button>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Không tìm thấy hội thoại nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {paginatedLeads.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 hover:bg-slate-800/40 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                {/* Left: Customer info */}
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="relative flex-shrink-0">
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-11 h-11 rounded-full object-cover border border-slate-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-sm border border-teal-500/30">
                        {item.name.charAt(0)}
                      </div>
                    )}
                    {item.hasPhone && (
                      <span
                        className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] text-white"
                        title="Đã có số điện thoại"
                      >
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm hover:text-teal-300 transition">
                        {String(item.name || 'Khách hàng')}
                      </span>

                      {/* Phone pill */}
                      {(() => {
                        const phoneDisplay = getCleanPhone(item.phone);
                        if (phoneDisplay) {
                          return (
                            <button
                              onClick={() => handleCopy(phoneDisplay, item.id)}
                              className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1 transition"
                              title="Nhấp để copy số điện thoại"
                            >
                              <Phone className="w-3 h-3 text-emerald-400" />
                              {phoneDisplay}
                              {copiedPhone === item.id ? (
                                <Check className="w-3 h-3 text-emerald-300" />
                              ) : (
                                <Copy className="w-2.5 h-2.5 opacity-60" />
                              )}
                            </button>
                          );
                        }
                        return <span className="text-[11px] text-slate-500 italic">Chưa có SĐT</span>;
                      })()}

                      {/* Branch badge */}
                      {item.branch && item.branch !== 'Toàn Hệ Thống' && (
                        <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold flex items-center gap-1">
                          <Building2 className="w-2.5 h-2.5" />
                          {item.branch}
                        </span>
                      )}

                      {/* Service badge */}
                      {item.service && item.service !== 'Tư Vấn Chung' && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-semibold">
                          {item.service}
                        </span>
                      )}
                    </div>

                    {/* Snippet message */}
                    <p className="text-xs text-slate-300 line-clamp-2 pr-2">
                      {item.snippet || 'Chưa có nội dung xem trước.'}
                    </p>

                    {/* Notes from staff if any */}
                    {item.notes.length > 0 && (
                      <div className="mt-1.5 p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                        <span className="font-bold text-amber-400 flex items-center gap-1">
                          📝 Ghi chú tư vấn viên ({item.notes[0].author}):
                        </span>
                        <p className="font-mono text-slate-200">{item.notes[0].message}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Tags & Timestamp */}
                <div className="flex flex-col lg:items-end gap-2 flex-shrink-0">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 lg:justify-end">
                    {item.tags.map((t) => (
                      <span
                        key={t.id}
                        style={{
                          backgroundColor: `${t.color}25`,
                          borderColor: t.color,
                          color: '#f8fafc',
                        }}
                        className="px-2 py-0.5 rounded-full text-[10px] font-bold border"
                      >
                        {t.text}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(item.updatedAt || item.insertedAt).toLocaleString('vi-VN')}
                    </span>
                    <span>• {item.messageCount} tin</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {!loading && !error && filteredLeads.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/80">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Hiển thị:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-teal-500"
              >
                <option value={25}>25 / trang</option>
                <option value={50}>50 / trang</option>
                <option value={100}>100 / trang</option>
                <option value={200}>200 / trang</option>
                <option value={1000}>Tất cả ({filteredLeads.length})</option>
              </select>
              <span>
                (Đang xem {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, filteredLeads.length)} trong tổng{' '}
                {filteredLeads.length} khách)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage <= 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Trang trước
              </button>
              <span className="px-3 py-1 text-xs font-mono font-bold text-teal-400">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage >= totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Config Modal */}
      {isConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-teal-400" />
                Cấu Hình Public API Pancake
              </h3>
              <button
                onClick={() => setIsConfigModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Public API Access Token (Pancake Zalo OA / Pages.fm)
                </label>
                <textarea
                  rows={3}
                  value={editToken}
                  onChange={(e) => setEditToken(e.target.value)}
                  placeholder="Dán chuỗi token Pancake vào đây (bắt đầu bằng eyJhbGci...)"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Lấy từ mục <strong>Cài đặt → Công cụ → Public API access token</strong> trên Pancake.
                </p>
              </div>

              {configSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold">
                  {configSuccessMsg}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={isSavingConfig}
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition disabled:opacity-50"
                >
                  {isSavingConfig ? 'Đang kiểm tra & lưu...' : 'Lưu Token Mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
