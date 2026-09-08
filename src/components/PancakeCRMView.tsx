import React, { useState, useEffect, useRef } from 'react';
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
  Plus,
  Trash2,
  Globe,
  Smartphone,
  Share2,
} from 'lucide-react';

export interface PancakePageItem {
  id: string;
  name: string;
  alias?: string;
  type: 'zalo' | 'facebook';
  active: boolean;
  tokenMasked?: string;
  totalTags?: number;
  connected?: boolean;
}

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
  pageId?: string;
  pageName?: string;
  channelType?: 'zalo' | 'facebook';
}

interface PancakeStatus {
  connected: boolean;
  totalPages?: number;
  connectedPages?: number;
  pages?: PancakePageItem[];
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
  byPage?: {
    pageId: string;
    pageName: string;
    type: 'zalo' | 'facebook';
    totalLeads: number;
    withPhone: number;
    booked: number;
    won: number;
  }[];
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

  // Multi-Page Filtering
  const [selectedPageFilter, setSelectedPageFilter] = useState<string>('all');
  const [selectedChannelFilter, setSelectedChannelFilter] = useState<'all' | 'zalo' | 'facebook'>('all');

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
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);
  const [calendarTab, setCalendarTab] = useState<'month' | 'custom'>('month');
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

  // Multi-page Management Modal
  const [isManagePagesModalOpen, setIsManagePagesModalOpen] = useState<boolean>(false);
  const [newPageId, setNewPageId] = useState<string>('');
  const [newPageToken, setNewPageToken] = useState<string>('');
  const [newPageName, setNewPageName] = useState<string>('');
  const [newPageType, setNewPageType] = useState<'zalo' | 'facebook'>('zalo');
  const [isAddingPage, setIsAddingPage] = useState<boolean>(false);
  const [pageActionMsg, setPageActionMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchPancakeData = async (showLoading = true, force = false) => {
    if (isFetchingRef.current && !showLoading && !force) {
      return; // Bỏ qua nếu đang có tiến trình fetch khác chạy ngầm
    }
    isFetchingRef.current = true;
    if (showLoading) setLoading(true);
    setError(null);
    try {
      // 1. Fetch Status safely (includes list of all configured pages)
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
      if (selectedPageFilter && selectedPageFilter !== 'all') {
        queryParams += `&pageId=${encodeURIComponent(selectedPageFilter)}`;
      }
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
      isFetchingRef.current = false;
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  // Re-fetch on filter mode or date changes or selected page
  useEffect(() => {
    fetchPancakeData(true, timeFilterMode === 'today');
  }, [timeFilterMode, selectedMonth, customStartDate, customEndDate, selectedPageFilter]);

  // Real-time polling effect when 'today' mode is active (mỗi 20s auto-refresh thông minh theo TTL)
  useEffect(() => {
    if (timeFilterMode !== 'today' || !isRealtimeActive) return;

    setCountdownSeconds(20);
    const countdownTimer = setInterval(() => {
      setCountdownSeconds((prev) => (prev <= 1 ? 20 : prev - 1));
    }, 1000);

    const realtimeTimer = setInterval(() => {
      fetchPancakeData(false, false); // polling thông minh theo cache TTL của server
      setCountdownSeconds(20);
    }, 20000);

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

  const handleTogglePageActive = async (page: PancakePageItem) => {
    try {
      const res = await fetch(`/api/pancake/pages/${encodeURIComponent(page.id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !page.active }),
      });
      const data = await res.json();
      if (data.success) {
        setPageActionMsg({ text: `Đã ${!page.active ? 'kích hoạt' : 'tạm dừng'} trang ${page.name}` });
        fetchPancakeData(false, true);
        setTimeout(() => setPageActionMsg(null), 2500);
      }
    } catch (err: any) {
      setPageActionMsg({ text: 'Lỗi: ' + err.message, isError: true });
    }
  };

  const handleDeletePage = async (pageId: string, pageName: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa trang "${pageName}" khỏi danh sách đồng bộ?`)) return;
    try {
      const res = await fetch(`/api/pancake/pages/${encodeURIComponent(pageId)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setPageActionMsg({ text: `Đã xóa trang ${pageName} thành công.` });
        if (selectedPageFilter === pageId) {
          setSelectedPageFilter('all');
        }
        fetchPancakeData(false, true);
        setTimeout(() => setPageActionMsg(null), 2500);
      } else {
        alert(data.error || 'Không thể xóa trang');
      }
    } catch (err: any) {
      alert('Lỗi: ' + err.message);
    }
  };

  const handleAddNewPage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageId.trim() || !newPageToken.trim()) {
      setPageActionMsg({ text: 'Vui lòng nhập đầy đủ Page ID và Token API.', isError: true });
      return;
    }
    setIsAddingPage(true);
    setPageActionMsg(null);
    try {
      const res = await fetch('/api/pancake/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newPageId.trim(),
          token: newPageToken.trim(),
          name: newPageName.trim() || undefined,
          type: newPageType,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPageActionMsg({ text: `Đã kết nối thành công trang "${data.page.name}"!` });
        setNewPageId('');
        setNewPageToken('');
        setNewPageName('');
        fetchPancakeData(false, true);
      } else {
        setPageActionMsg({ text: data.error || 'Không thể kết nối trang với Token này.', isError: true });
      }
    } catch (err: any) {
      setPageActionMsg({ text: 'Lỗi kết nối: ' + err.message, isError: true });
    } finally {
      setIsAddingPage(false);
    }
  };

  // Filter leads
  const filteredLeads = leads.filter((item) => {
    // Page filter
    if (selectedPageFilter !== 'all' && item.pageId && item.pageId !== selectedPageFilter) {
      return false;
    }

    // Channel filter
    if (selectedChannelFilter !== 'all' && (item.channelType || 'zalo') !== selectedChannelFilter) {
      return false;
    }

    // Search
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchPhone = item.phone.includes(q);
      const matchSnippet = item.snippet.toLowerCase().includes(q);
      const matchBranch = item.branch.toLowerCase().includes(q);
      const matchService = item.service.toLowerCase().includes(q);
      const matchPage = (item.pageName || '').toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchSnippet && !matchBranch && !matchService && !matchPage) {
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
  }, [searchTerm, selectedService, selectedStatusFilter, selectedTag, selectedPageFilter, selectedChannelFilter, pageSize]);

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
                Đang kết nối {status?.connectedPages || (status?.pages?.length || 4)}/{status?.totalPages || (status?.pages?.length || 4)} Trang (Pancake API Đa Kênh)
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Tự động gom hội thoại tập trung
              </span>
              {isFromCache && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  Lưu đệm tốc độ cao ({cacheAgeSeconds > 60 ? `${Math.round(cacheAgeSeconds / 60)} phút trước` : `${cacheAgeSeconds}s trước`})
                </span>
              )}
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Hệ Thống Đa Kênh Pancake CRM - Nha Khoa Tâm Đức Smile
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Tự động gom hội thoại, số điện thoại, phân loại chuyên khoa (Implant, Sứ, Niềng răng) từ tất cả các Zalo OA và Fanpage Facebook vào một màn hình duy nhất.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-center flex-wrap">
            <button
              onClick={() => startSyncAllHistory(28)}
              disabled={isSyncingAll || syncAllProgress?.isRunning}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold flex items-center gap-2 transition shadow-md active:scale-95 disabled:opacity-50"
              title="Quét và kéo toàn bộ hội thoại từ trước đến nay của tất cả các trang qua nhiều đợt an toàn"
            >
              <Layers className={`w-4 h-4 ${isSyncingAll || syncAllProgress?.isRunning ? 'animate-spin' : ''}`} />
              {isSyncingAll || syncAllProgress?.isRunning ? 'Đang kéo toàn bộ...' : `Kéo Toàn Bộ Lịch Sử (${status?.connectedPages || 4} Trang)`}
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing || isSyncingAll}
              className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-sm font-semibold flex items-center gap-2 transition shadow-sm active:scale-95 disabled:opacity-50"
              title="Cập nhật dữ liệu mới nhất từ Pancake cho tất cả các trang"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Đang đồng bộ...' : 'Đồng Bộ Nhanh'}
            </button>

            <button
              onClick={() => {
                setPageActionMsg(null);
                setIsManagePagesModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-teal-300 border border-teal-500/40 text-sm font-semibold flex items-center gap-1.5 transition shadow-sm"
              title="Quản lý danh sách các trang Zalo OA / Fanpage và thêm API Token mới"
            >
              <Settings className="w-4 h-4 text-teal-400" />
              Quản Lý & Thêm Trang ({status?.pages?.length || 4})
            </button>
          </div>
        </div>

        {/* Multi-Page Selector Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <Share2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Kênh & Trang Đồng Bộ:</span>
            </div>
            
            {/* Kênh Toggle (Zalo / Facebook / All) */}
            <div className="flex items-center rounded-lg bg-slate-800/80 p-0.5 border border-slate-700 text-xs">
              <button
                onClick={() => setSelectedChannelFilter('all')}
                className={`px-2.5 py-1 rounded-md transition font-medium ${
                  selectedChannelFilter === 'all'
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tất cả kênh
              </button>
              <button
                onClick={() => setSelectedChannelFilter('zalo')}
                className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                  selectedChannelFilter === 'zalo'
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'text-teal-400 hover:text-white'
                }`}
              >
                💬 Zalo OA
              </button>
              <button
                onClick={() => setSelectedChannelFilter('facebook')}
                className={`px-2.5 py-1 rounded-md transition font-medium flex items-center gap-1 ${
                  selectedChannelFilter === 'facebook'
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'text-indigo-400 hover:text-white'
                }`}
              >
                📘 Facebook
              </button>
            </div>
          </div>

          {/* Individual Page Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedPageFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border shadow-sm ${
                selectedPageFilter === 'all'
                  ? 'bg-teal-500 text-slate-950 border-teal-400 ring-2 ring-teal-400/30'
                  : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Gom Tất Cả Các Trang ({status?.pages?.length || 4} Trang)</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedPageFilter === 'all' ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-700 text-teal-300'
              }`}>
                {leads.length}
              </span>
            </button>

            {(status?.pages || []).map((page) => {
              const pageSummary = summary?.byPage?.find((p) => p.pageId === page.id);
              const isSelected = selectedPageFilter === page.id;
              const isZalo = page.type === 'zalo';

              return (
                <button
                  key={page.id}
                  onClick={() => setSelectedPageFilter(page.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-2 border shadow-sm ${
                    isSelected
                      ? isZalo
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold ring-2 ring-emerald-400/40'
                        : 'bg-indigo-600 text-white border-indigo-400 font-bold ring-2 ring-indigo-400/40'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
                  }`}
                  title={`Page ID: ${page.id}`}
                >
                  <span className="text-sm">{isZalo ? '💬' : '📘'}</span>
                  <span className="max-w-[170px] truncate">{page.name}</span>
                  {pageSummary && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isSelected
                        ? isZalo ? 'bg-slate-950/20 text-slate-950' : 'bg-white/20 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}>
                      {pageSummary.totalLeads}
                    </span>
                  )}
                  <span className={`w-1.5 h-1.5 rounded-full ${page.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                </button>
              );
            })}

            <button
              onClick={() => {
                setPageActionMsg(null);
                setIsManagePagesModalOpen(true);
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 flex items-center gap-1 transition"
              title="Thêm trang mới bằng Token API Pancake"
            >
              <Plus className="w-3.5 h-3.5" />
              Thêm Trang API Mới
            </button>
          </div>
        </div>

        {/* Date & Time Range Selector */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              Khoảng thời gian:
            </span>
            <span className="px-2 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 text-[11px] font-medium hidden sm:inline-flex items-center gap-1" title="Hệ thống tính đúng theo ngày bắt đầu hội thoại: Khách hôm qua đã chat, hôm nay chat lại thì vẫn tính vào ngày hôm qua.">
              <CheckCircle2 className="w-3 h-3 text-teal-400" />
              Tính đúng theo ngày bắt đầu chat
            </span>

            {/* Hôm Nay (Real-time Live) */}
            <button
              onClick={() => {
                setTimeFilterMode('today');
                setIsCalendarOpen(false);
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
                setIsCalendarOpen(false);
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
                  setIsCalendarOpen(false);
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

            {/* Chọn Tháng & Lịch Ngày (Gộp chung) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  if (timeFilterMode === 'custom') {
                    setCalendarTab('custom');
                  } else {
                    setCalendarTab('month');
                  }
                }}
                className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1.5 border ${
                  timeFilterMode === 'month' || timeFilterMode === 'custom'
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold shadow-sm'
                    : 'bg-slate-800 text-cyan-400 border-cyan-500/30 hover:bg-slate-700'
                }`}
                title="Chọn Tháng hoặc Lịch Ngày cụ thể"
              >
                {timeFilterMode === 'custom' ? (
                  <CalendarRange className="w-3.5 h-3.5" />
                ) : (
                  <CalendarDays className="w-3.5 h-3.5" />
                )}
                {timeFilterMode === 'month'
                  ? `Tháng ${selectedMonth.split('-')[1]}/${selectedMonth.split('-')[0]}`
                  : timeFilterMode === 'custom' && customStartDate && customEndDate
                  ? `${customStartDate.slice(5)} → ${customEndDate.slice(5)}`
                  : 'Chọn Tháng / Lịch Ngày 📅'}
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {/* Dropdown Gộp: Chọn Tháng & Lịch Ngày */}
              {isCalendarOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCalendarOpen(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-80 p-3.5 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95">
                    {/* Header Tabs Chuyển đổi */}
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                      <div className="flex bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/60 w-full mr-2">
                        <button
                          type="button"
                          onClick={() => setCalendarTab('month')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                            calendarTab === 'month'
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <CalendarDays className="w-3.5 h-3.5" />
                          Chọn Tháng
                        </button>
                        <button
                          type="button"
                          onClick={() => setCalendarTab('custom')}
                          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                            calendarTab === 'custom'
                              ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          <CalendarRange className="w-3.5 h-3.5" />
                          Lịch Ngày
                        </button>
                      </div>
                      <button
                        onClick={() => setIsCalendarOpen(false)}
                        className="text-slate-400 hover:text-white text-xs px-1.5 py-1 rounded hover:bg-slate-800 transition"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Tab 1: Chọn Tháng */}
                    {calendarTab === 'month' && (
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
                                setIsCalendarOpen(false);
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
                                  setIsCalendarOpen(false);
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
                    )}

                    {/* Tab 2: Lịch Ngày Tùy Biến */}
                    {calendarTab === 'custom' && (
                      <div className="space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Từ ngày:</label>
                            <input
                              type="date"
                              value={customStartDate}
                              onChange={(e) => setCustomStartDate(e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] text-slate-400 block mb-1">Đến ngày:</label>
                            <input
                              type="date"
                              value={customEndDate}
                              onChange={(e) => setCustomEndDate(e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>

                        {/* Các phím chọn khoảng ngày nhanh */}
                        <div>
                          <div className="text-[10px] text-slate-400 font-medium mb-1">Chọn nhanh:</div>
                          <div className="grid grid-cols-3 gap-1">
                            {[
                              {
                                label: 'Hôm nay',
                                getDates: () => {
                                  const today = new Date().toISOString().slice(0, 10);
                                  return { start: today, end: today };
                                },
                              },
                              {
                                label: '7 ngày qua',
                                getDates: () => {
                                  const end = new Date().toISOString().slice(0, 10);
                                  const d = new Date();
                                  d.setDate(d.getDate() - 6);
                                  return { start: d.toISOString().slice(0, 10), end };
                                },
                              },
                              {
                                label: 'Tháng này',
                                getDates: () => {
                                  const now = new Date();
                                  const y = now.getFullYear();
                                  const m = String(now.getMonth() + 1).padStart(2, '0');
                                  const last = new Date(y, now.getMonth() + 1, 0).getDate();
                                  return { start: `${y}-${m}-01`, end: `${y}-${m}-${last}` };
                                },
                              },
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => {
                                  const { start, end } = preset.getDates();
                                  setCustomStartDate(start);
                                  setCustomEndDate(end);
                                }}
                                className="py-1 px-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-[10px] text-center transition"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (customStartDate && customEndDate) {
                              setTimeFilterMode('custom');
                              setIsCalendarOpen(false);
                            } else {
                              alert('Vui lòng chọn cả ngày bắt đầu và kết thúc');
                            }
                          }}
                          className="w-full py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition mt-2 shadow-sm"
                        >
                          Áp Dụng Khoảng Ngày
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Tất Cả Lịch Sử */}
            <button
              onClick={() => {
                setTimeFilterMode('all');
                setIsCalendarOpen(false);
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

      {/* Multi-Page Performance Breakdown (khi đang xem Tổng Hợp Tất Cả) */}
      {selectedPageFilter === 'all' && summary?.byPage && summary.byPage.length > 0 && (
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 shadow-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              Phân Bổ Số Liệu Từng Kênh & Trang ({summary.byPage.length} Trang):
            </span>
            <span className="text-[11px] text-slate-400">
              Nhấp vào trang bất kỳ để lọc xem chi tiết
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {summary.byPage.map((p) => {
              const phonePercent = p.totalLeads > 0 ? Math.round((p.withPhone / p.totalLeads) * 100) : 0;
              const isZalo = p.type === 'zalo';

              return (
                <div
                  key={p.pageId}
                  onClick={() => setSelectedPageFilter(p.pageId)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer hover:scale-[1.02] flex flex-col justify-between gap-3 ${
                    isZalo
                      ? 'bg-gradient-to-b from-slate-900 to-teal-950/20 border-teal-500/30 hover:border-teal-400'
                      : 'bg-gradient-to-b from-slate-900 to-indigo-950/20 border-indigo-500/30 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold mb-1 ${
                        isZalo ? 'bg-teal-500/20 text-teal-300' : 'bg-indigo-500/20 text-indigo-300'
                      }`}>
                        {isZalo ? '💬 Zalo OA' : '📘 Fanpage'}
                      </span>
                      <h4 className="font-bold text-white text-xs truncate" title={p.pageName}>
                        {p.pageName}
                      </h4>
                    </div>
                    <span className="text-lg font-black text-teal-400 font-mono">
                      {p.totalLeads}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-800/80 text-center">
                    <div className="p-1 rounded bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">Có SĐT</div>
                      <div className="text-xs font-bold text-emerald-400">{p.withPhone} ({phonePercent}%)</div>
                    </div>
                    <div className="p-1 rounded bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">Đã Hẹn</div>
                      <div className="text-xs font-bold text-blue-400">{p.booked}</div>
                    </div>
                    <div className="p-1 rounded bg-slate-800/60">
                      <div className="text-[10px] text-slate-400">#ĐẬU</div>
                      <div className="text-xs font-bold text-amber-400">{p.won}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

                      {/* Page Origin Badge */}
                      {item.pageName && (
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border flex items-center gap-1 ${
                          item.channelType === 'facebook'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                        }`}>
                          <span>{item.channelType === 'facebook' ? '📘' : '💬'}</span>
                          <span className="max-w-[140px] truncate">{item.pageName}</span>
                        </span>
                      )}

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

                  {/* Conversation timestamps */}
                  {(() => {
                    const startRaw = item.insertedAt || item.updatedAt;
                    const cleanStart = startRaw ? (startRaw.endsWith('Z') || startRaw.includes('+') ? startRaw : `${startRaw}Z`) : '';
                    const startDate = cleanStart ? new Date(cleanStart) : null;
                    const startDisplay = startDate && !isNaN(startDate.getTime())
                      ? startDate.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                      : 'N/A';

                    const updateRaw = item.updatedAt;
                    const cleanUpdate = updateRaw ? (updateRaw.endsWith('Z') || updateRaw.includes('+') ? updateRaw : `${updateRaw}Z`) : '';
                    const updateDate = cleanUpdate ? new Date(cleanUpdate) : null;
                    const hasLaterActivity = startDate && updateDate && !isNaN(startDate.getTime()) && !isNaN(updateDate.getTime()) &&
                      (updateDate.getTime() - startDate.getTime() > 60000);

                    return (
                      <div className="flex flex-col sm:items-end gap-1 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-300 font-medium" title="Thời điểm bắt đầu hội thoại (chia đúng theo ngày)">
                          <Calendar className="w-3 h-3 text-teal-400" />
                          <span className="text-slate-400">Bắt đầu:</span>
                          <span className="font-mono text-slate-200 font-bold">{startDisplay}</span>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          {hasLaterActivity && updateDate && (
                            <span className="flex items-center gap-1 text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 font-medium" title="Tin nhắn tương tác gần nhất">
                              <Clock className="w-2.5 h-2.5 text-amber-400" />
                              <span>Chat lại: {updateDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </span>
                          )}
                          <span className="text-slate-400 font-mono">• {item.messageCount} tin</span>
                        </div>
                      </div>
                    );
                  })()}
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

      {/* Manage Multi-Page & Token Configuration Modal */}
      {isManagePagesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 my-8 max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-teal-400" />
                  Quản Lý Cấu Hình Đa Trang (Pancake CRM)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Quản lý kết nối các trang Zalo OA và Fanpage Facebook thông qua Public API Pancake.
                </p>
              </div>
              <button
                onClick={() => setIsManagePagesModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto pr-1 space-y-5 flex-1">
              {/* Guidance Box (Answering user's question) */}
              <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-200 text-xs flex items-start gap-3">
                <span className="text-xl flex-shrink-0">💡</span>
                <div className="space-y-1">
                  <p className="font-bold text-white text-xs">
                    Tôi có nhiều trang khác thì chỉ cần đưa API là được đúng không?
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    <strong>Chính xác 100%!</strong> Bất cứ khi nào bạn có thêm trang Zalo OA hoặc Fanpage Facebook mới trên Pancake, bạn chỉ cần lấy <strong>Page ID</strong> và <strong>Access Token</strong> rồi dán vào khung thêm mới bên dưới. Hệ thống sẽ tự động liên kết, đồng bộ hội thoại và gom toàn bộ khách hàng về cùng một bảng điều khiển duy nhất mà không cần can thiệp mã nguồn.
                  </p>
                </div>
              </div>

              {pageActionMsg && (
                <div className={`p-3 rounded-xl border text-xs font-semibold ${
                  pageActionMsg.isError
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                }`}>
                  {pageActionMsg.text}
                </div>
              )}

              {/* List of currently connected pages */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Danh Sách Trang Đang Đồng Bộ ({status?.pages?.length || 0}):
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Bật/tắt hoặc xóa trang khi không còn sử dụng
                  </span>
                </div>

                <div className="space-y-2">
                  {(status?.pages || []).map((page) => {
                    const isZalo = page.type === 'zalo';
                    return (
                      <div
                        key={page.id}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-xl flex-shrink-0">{isZalo ? '💬' : '📘'}</span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-white text-xs truncate max-w-xs" title={page.name}>
                                {page.name}
                              </span>
                              <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                                isZalo ? 'bg-teal-500/20 text-teal-300' : 'bg-indigo-500/20 text-indigo-300'
                              }`}>
                                {isZalo ? 'Zalo OA' : 'Fanpage Facebook'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 mt-0.5 flex-wrap">
                              <span>ID: {page.id}</span>
                              {page.alias && (
                                <span className="px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/20">
                                  Hotline: {page.alias}
                                </span>
                              )}
                              {page.tokenMasked && (
                                <span className="text-slate-500">({page.tokenMasked})</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                          <button
                            onClick={() => handleTogglePageActive(page)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                              page.active
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                            }`}
                            title={page.active ? 'Đang bật - Nhấp để tạm dừng' : 'Đang dừng - Nhấp để kích hoạt lại'}
                          >
                            {page.active ? '🟢 Đang bật' : '⚪ Tạm dừng'}
                          </button>

                          <button
                            onClick={() => handleDeletePage(page.id, page.name)}
                            className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
                            title="Xóa trang này khỏi hệ thống"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Form to add a new page */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-teal-400" />
                  Thêm Trang / Kênh Mới Bằng API Pancake
                </h4>

                <form onSubmit={handleAddNewPage} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Page ID (Pancake ID) *
                      </label>
                      <input
                        type="text"
                        value={newPageId}
                        onChange={(e) => setNewPageId(e.target.value)}
                        placeholder="Ví dụ: pzl_... hoặc ID Fanpage"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-teal-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                        Loại Kênh *
                      </label>
                      <select
                        value={newPageType}
                        onChange={(e) => setNewPageType(e.target.value as 'zalo' | 'facebook')}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                      >
                        <option value="zalo">💬 Zalo Official Account (Zalo OA)</option>
                        <option value="facebook">📘 Fanpage Facebook</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Tên Gợi Nhớ (Tùy chọn - Tự động lấy nếu để trống)
                    </label>
                    <input
                      type="text"
                      value={newPageName}
                      onChange={(e) => setNewPageName(e.target.value)}
                      placeholder="Ví dụ: Nha Khoa Tâm Đức CN Bình Dương, Hotline 090..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                      Public API Access Token (JWT Token từ Pancake) *
                    </label>
                    <textarea
                      rows={2}
                      value={newPageToken}
                      onChange={(e) => setNewPageToken(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-teal-500"
                      required
                    />
                    <p className="text-[10px] text-slate-500 mt-1">
                      Lấy tại: Pancake → Chọn Trang → <strong>Cài đặt → Công cụ → Public API access token</strong>.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isAddingPage}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    {isAddingPage ? 'Đang kiểm tra kết nối với Pancake...' : 'Xác Thực & Kết Nối Trang Này Ngay'}
                  </button>
                </form>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-3 border-t border-slate-800 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsManagePagesModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
