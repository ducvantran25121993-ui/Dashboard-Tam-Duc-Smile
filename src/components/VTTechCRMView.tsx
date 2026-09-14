import React, { useState, useEffect, useMemo } from 'react';
import {
  Ticket,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  CalendarCheck,
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
  Globe,
  Megaphone,
  Target,
  Zap,
  BellRing,
  Radio,
  Play,
  Pause,
} from 'lucide-react';
import { VTTechTicket } from '../types/vttech';
import {
  fetchVTTechConfig,
  saveVTTechConfig,
  fetchCachedVTTechTickets,
  syncVTTechTickets,
  importVTTechCurl,
} from '../services/vttechService';

// Helper to get today's date in YYYY-MM-DD (Vietnam time GMT+7)
const getVietnamTodayStr = (): string => {
  const d = new Date();
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  const vnTime = new Date(utc + 7 * 3600000);
  const year = vnTime.getFullYear();
  const month = String(vnTime.getMonth() + 1).padStart(2, '0');
  const day = String(vnTime.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const VTTechCRMView: React.FC = () => {
  const [tickets, setTickets] = useState<VTTechTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Search & Filter state
  const [channelScope, setChannelScope] = useState<'web' | 'online_web' | 'hotline_web' | 'all' | 'gclid'>('web');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  // Default to Today ("Hôm nay") when entering the app
  const [dateFrom, setDateFrom] = useState<string>(() => getVietnamTodayStr());
  const [dateTo, setDateTo] = useState<string>(() => getVietnamTodayStr());

  // Real-time Auto-Sync state
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState<boolean>(true);
  const [syncIntervalSeconds, setSyncIntervalSeconds] = useState<number>(30);
  const [countdown, setCountdown] = useState<number>(30);
  const [isBackgroundSyncing, setIsBackgroundSyncing] = useState<boolean>(false);
  const [newTicketAlert, setNewTicketAlert] = useState<{
    message: string;
    count: number;
    webCount: number;
    ticket?: VTTechTicket;
  } | null>(null);

  // Config modal / expand state
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [configTab, setConfigTab] = useState<'curl' | 'manual'>('curl');
  const [curlInput, setCurlInput] = useState<string>('');
  const [curlLoading, setCurlLoading] = useState<boolean>(false);
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

  const handleSync = async (overrideFrom?: string, overrideTo?: string) => {
    setSyncing(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const fromVal = overrideFrom !== undefined ? overrideFrom : dateFrom;
      const toVal = overrideTo !== undefined ? overrideTo : dateTo;
      const res = await syncVTTechTickets({
        dateFrom: fromVal ? `${fromVal} 00:00:00` : undefined,
        dateTo: toVal ? `${toVal} 23:59:59` : undefined,
        limit: 500,
      });

      if (res.success && res.data) {
        setTickets(res.data);
        setLastSyncTime(res.cachedAt);
        const timeScopeDesc = (!fromVal && !toVal) ? 'toàn thời gian' : `từ ${fromVal || 'bắt đầu'} đến ${toVal || 'nay'}`;
        setSuccessMessage(`Đã đồng bộ ${res.data.length} Ticket (${timeScopeDesc}) từ VTTech CRM!`);
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

  // Background Real-time auto-sync
  const triggerBackgroundSync = async () => {
    if (isBackgroundSyncing || syncing) return;
    setIsBackgroundSyncing(true);
    try {
      const res = await syncVTTechTickets({
        dateFrom: dateFrom ? `${dateFrom} 00:00:00` : undefined,
        dateTo: dateTo ? `${dateTo} 23:59:59` : undefined,
        limit: 500,
      });

      if (res.success && Array.isArray(res.data)) {
        // Detect newly arrived tickets
        setTickets((prev) => {
          const prevMap = new Set(prev.map((t) => t.TicketID));
          const newItems = res.data.filter((t) => !prevMap.has(t.TicketID));
          if (newItems.length > 0) {
            const webNew = newItems.filter((t) => t.SourceName === 'OL WB' || t.SourceName === 'HL WB');
            setNewTicketAlert({
              message: `Vừa nhận ${newItems.length} vé mới (${webNew.length > 0 ? `${webNew.length} từ Kênh Web` : newItems[0].SourceName})`,
              count: newItems.length,
              webCount: webNew.length,
              ticket: newItems[0],
            });
            // Auto hide alert after 10s
            setTimeout(() => {
              setNewTicketAlert((curr) => (curr?.count === newItems.length ? null : curr));
            }, 10000);
          }
          return res.data;
        });

        if (res.cachedAt) {
          setLastSyncTime(res.cachedAt);
        }
      }
    } catch (e) {
      console.warn('Real-time background sync warning:', e);
    } finally {
      setIsBackgroundSyncing(false);
    }
  };

  // Real-time interval timer
  useEffect(() => {
    if (!isRealTimeEnabled) {
      setCountdown(syncIntervalSeconds);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          triggerBackgroundSync();
          return syncIntervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRealTimeEnabled, syncIntervalSeconds, dateFrom, dateTo, syncing, isBackgroundSyncing]);

  const handleChangeInterval = (secs: number) => {
    setSyncIntervalSeconds(secs);
    setCountdown(secs);
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

  const handleImportCurl = async () => {
    if (!curlInput.trim()) {
      setErrorMessage('Vui lòng dán lệnh cURL từ tab Network (Mạng)');
      return;
    }
    setCurlLoading(true);
    setErrorMessage('');
    try {
      const res = await importVTTechCurl(curlInput);
      if (res.success) {
        setSuccessMessage('Đã trích xuất Cookie & Token từ cURL thành công! Đang đồng bộ lại dữ liệu...');
        setCurlInput('');
        setIsConfigOpen(false);
        await handleSync();
      } else {
        throw new Error(res.error || 'Không thể trích xuất thông tin từ cURL');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setCurlLoading(false);
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

  // Source counts & distribution
  const sourceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    tickets.forEach((t) => {
      const s = t.SourceName ? t.SourceName.trim() : 'Khác';
      counts[s] = (counts[s] || 0) + 1;
    });
    return counts;
  }, [tickets]);

  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (t.StatusName) set.add(t.StatusName.trim());
    });
    return Array.from(set);
  }, [tickets]);

  const getSourceBadgeColor = (source: string) => {
    switch (source) {
      case 'OL FB':
        return 'bg-blue-500/15 text-blue-300 border-blue-500/30 hover:bg-blue-500/25';
      case 'OL WB':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25';
      case 'OL TT':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30 hover:bg-rose-500/25';
      case 'HL WB':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25';
      case 'OL GT':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25';
      case 'TT TĐ':
        return 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-teal-500/25';
      case 'TT GT':
        return 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25';
      case 'OF KM':
        return 'bg-orange-500/15 text-orange-300 border-orange-500/30 hover:bg-orange-500/25';
      case 'OF VC':
        return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/25';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700';
    }
  };

  // Helper to check if a source belongs to Web channels
  const isWebSource = (source?: string): boolean => {
    return source === 'OL WB' || source === 'HL WB' || source === 'KC WB';
  };

  // Helper to extract comparable date (YYYY-MM-DD) from date string
  const parseToDateStr = (raw?: string | null): string | null => {
    if (!raw || raw.startsWith('1900')) return null;
    const clean = raw.trim();
    // ISO format: 2026-09-14...
    const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
    // Vietnamese format: 14-09-2026 or 13:25 14-09-2026
    const vnMatch = clean.match(/(\d{2})-(\d{2})-(\d{4})/);
    if (vnMatch) return `${vnMatch[3]}-${vnMatch[2]}-${vnMatch[1]}`;
    return null;
  };

  // Format date time for display (e.g., 13:25 14/09/2026)
  const formatTicketDateTime = (raw?: string | null): string => {
    if (!raw || raw.startsWith('1900')) return '—';
    const clean = raw.trim();
    const parts = clean.split(' ');
    if (parts.length >= 2 && parts[1].includes('-')) {
      return `${parts[0]} ${parts[1].replace(/-/g, '/')}`;
    }
    const m = clean.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/);
    if (m) {
      return `${m[4]}:${m[5]} ${m[3]}/${m[2]}/${m[1]}`;
    }
    return clean;
  };

  // Check if ticket matches date range - strictly follows Created date (Ngày tạo) for accuracy
  const ticketMatchesDate = (t: VTTechTicket, from: string, to: string): boolean => {
    if (!from && !to) return true;
    // Lấy chuẩn theo Ngày Tạo (Created) của Ticket
    const createdDate = parseToDateStr(t.Created) || parseToDateStr(t.ExecutedDate);
    if (!createdDate) return true;

    if (from && createdDate < from) return false;
    if (to && createdDate > to) return false;
    return true;
  };

  // Preset helpers for date filter
  const setAllTime = () => {
    setDateFrom('');
    setDateTo('');
  };

  const setPresetToday = () => {
    const today = getVietnamTodayStr();
    setDateFrom(today);
    setDateTo(today);
  };

  const setPresetLast7Days = () => {
    const now = new Date();
    const d7 = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    setDateFrom(d7.toISOString().slice(0, 10));
    setDateTo(now.toISOString().slice(0, 10));
  };

  const setPresetThisMonth = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    setDateFrom(firstDay.toISOString().slice(0, 10));
    setDateTo(now.toISOString().slice(0, 10));
  };

  // Scope Counts for quick switch tabs
  const scopeCounts = useMemo(() => {
    const web = tickets.filter((t) => isWebSource(t.SourceName)).length;
    const onlineWeb = tickets.filter((t) => t.SourceName === 'OL WB').length;
    const hotlineWeb = tickets.filter((t) => t.SourceName === 'HL WB').length;
    const gclid = tickets.filter((t) => t.Gclid && t.Gclid.length > 5).length;
    return {
      web,
      onlineWeb,
      hotlineWeb,
      all: tickets.length,
      gclid,
    };
  }, [tickets]);

  // Available sources matching the current channelScope
  const scopedAvailableSources = useMemo(() => {
    if (channelScope === 'web') {
      return availableSources.filter(isWebSource);
    }
    if (channelScope === 'online_web') {
      return availableSources.filter((s) => s === 'OL WB');
    }
    if (channelScope === 'hotline_web') {
      return availableSources.filter((s) => s === 'HL WB');
    }
    return availableSources;
  }, [channelScope, availableSources]);

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

      // Scope match
      let matchScope = true;
      if (channelScope === 'web') {
        if (selectedSource === 'all') {
          matchScope = isWebSource(t.SourceName);
        } else {
          matchScope = t.SourceName === selectedSource;
        }
      } else if (channelScope === 'online_web') {
        matchScope = t.SourceName === 'OL WB';
      } else if (channelScope === 'hotline_web') {
        matchScope = t.SourceName === 'HL WB';
      } else if (channelScope === 'gclid') {
        matchScope = Boolean(t.Gclid && t.Gclid.length > 5);
        if (matchScope && selectedSource !== 'all') {
          matchScope = t.SourceName === selectedSource;
        }
      } else {
        // all
        if (selectedSource !== 'all') {
          matchScope = t.SourceName === selectedSource;
        }
      }

      const matchStatus = selectedStatus === 'all' || t.StatusName === selectedStatus;

      // Filter by date matching any relevant ticket date
      const matchDate = ticketMatchesDate(t, dateFrom, dateTo);

      return matchSearch && matchScope && matchStatus && matchDate;
    });
  }, [tickets, searchTerm, channelScope, selectedSource, selectedStatus, dateFrom, dateTo]);

  // Source & Date filtered tickets specifically for KPI summary cards
  const kpiTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Scope match
      let matchScope = true;
      if (channelScope === 'web') {
        if (selectedSource === 'all') {
          matchScope = isWebSource(t.SourceName);
        } else {
          matchScope = t.SourceName === selectedSource;
        }
      } else if (channelScope === 'online_web') {
        matchScope = t.SourceName === 'OL WB';
      } else if (channelScope === 'hotline_web') {
        matchScope = t.SourceName === 'HL WB';
      } else if (channelScope === 'gclid') {
        matchScope = Boolean(t.Gclid && t.Gclid.length > 5);
        if (matchScope && selectedSource !== 'all') {
          matchScope = t.SourceName === selectedSource;
        }
      } else {
        // all
        if (selectedSource !== 'all') {
          matchScope = t.SourceName === selectedSource;
        }
      }

      const matchDate = ticketMatchesDate(t, dateFrom, dateTo);

      return matchScope && matchDate;
    });
  }, [tickets, channelScope, selectedSource, dateFrom, dateTo]);

  // Key KPI metrics reflecting the selected source & date
  const kpis = useMemo(() => {
    const total = kpiTickets.length;

    // Online Web tickets (OL WB) in current date scope
    const onlineWebTickets = tickets.filter((t) => {
      const matchSource = t.SourceName === 'OL WB';
      const matchScope = channelScope === 'gclid' ? Boolean(t.Gclid && t.Gclid.length > 5) : true;
      const matchDate = ticketMatchesDate(t, dateFrom, dateTo);
      return matchSource && matchScope && matchDate;
    });
    const onlineWeb = onlineWebTickets.length;

    // Hotline Web tickets (HL WB) in current date scope
    const hotlineWebTickets = tickets.filter((t) => {
      const matchSource = t.SourceName === 'HL WB';
      const matchScope = channelScope === 'gclid' ? Boolean(t.Gclid && t.Gclid.length > 5) : true;
      const matchDate = ticketMatchesDate(t, dateFrom, dateTo);
      return matchSource && matchScope && matchDate;
    });
    const hotlineWeb = hotlineWebTickets.length;

    // Total web tickets in current date scope for percentage
    const webTotalTickets = tickets.filter((t) => {
      const matchSource = isWebSource(t.SourceName);
      const matchScope = channelScope === 'gclid' ? Boolean(t.Gclid && t.Gclid.length > 5) : true;
      const matchDate = ticketMatchesDate(t, dateFrom, dateTo);
      return matchSource && matchScope && matchDate;
    });
    const webTotal = webTotalTickets.length;
    const onlineRate = webTotal > 0 ? Math.round((onlineWeb / webTotal) * 100) : 0;
    const hotlineRate = webTotal > 0 ? Math.round((hotlineWeb / webTotal) * 100) : 0;

    const booked = kpiTickets.filter((t) => t.IsBook === 1 || (t.StatusName && t.StatusName.toLowerCase().includes('lịch hẹn'))).length;
    const hasGclid = kpiTickets.filter((t) => t.Gclid && t.Gclid.length > 5).length;
    const isNew = kpiTickets.filter((t) => t.StatusName && t.StatusName.toLowerCase().includes('mới')).length;
    const arrived = kpiTickets.filter((t) => t.StatusName && t.StatusName.toLowerCase().includes('đến')).length;

    return {
      total,
      onlineWeb,
      onlineRate,
      hotlineWeb,
      webTotal,
      hotlineRate,
      booked,
      bookedRate: total > 0 ? Math.round((booked / total) * 100) : 0,
      hasGclid,
      isNew,
      arrived,
    };
  }, [tickets, kpiTickets, channelScope, dateFrom, dateTo]);

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
              onClick={() => handleSync()}
              disabled={syncing}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-sm font-semibold shadow-lg shadow-orange-600/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              <span>{syncing ? 'Đang Đồng Bộ...' : 'Đồng Bộ VTTech Ngay'}</span>
            </button>
          </div>
        </div>

        {/* Sync Status Info & Real-time Bar */}
        <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Máy chủ VTTech: <strong className="text-slate-200">nktamduc.vttechsolution.com</strong>
            </span>
            <span>
              Người thao tác: <strong className="text-slate-200">Văn Đức (ID: 1412)</strong>
            </span>
            {lastSyncTime && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                Lần đồng bộ gần nhất: <strong className="text-slate-300">{new Date(lastSyncTime).toLocaleTimeString('vi-VN')}</strong>
              </span>
            )}
          </div>

          {/* Real-time Widget Controls */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
            {/* Real-time status toggle */}
            <button
              onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                isRealTimeEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-slate-200'
              }`}
              title={isRealTimeEnabled ? 'Bấm để tạm dừng chế độ Real-time' : 'Bấm để bật chế độ Real-time'}
            >
              <Zap className={`w-3.5 h-3.5 ${isRealTimeEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span>Real-time: {isRealTimeEnabled ? 'BẬT' : 'TẮT'}</span>
            </button>

            {isRealTimeEnabled && (
              <>
                <span className="text-slate-600">|</span>

                {/* Background sync indicator or countdown */}
                {isBackgroundSyncing ? (
                  <span className="flex items-center gap-1.5 text-amber-300 font-medium animate-pulse">
                    <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
                    <span>Đang quét CRM...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                    <span>Quét sau: <strong className="text-emerald-400 font-mono">{countdown}s</strong></span>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Real-time New Ticket Alert Notification */}
      {newTicketAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20 border border-emerald-500/40 flex items-center justify-between gap-3 text-emerald-200 text-sm shadow-lg shadow-emerald-950/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <BellRing className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>⚡ Real-time: {newTicketAlert.message}</span>
                {newTicketAlert.webCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500 text-slate-950 font-black tracking-wider uppercase">
                    Kênh Website
                  </span>
                )}
              </div>
              {newTicketAlert.ticket && (
                <div className="text-xs text-emerald-300/90 mt-0.5">
                  Khách: <strong>{newTicketAlert.ticket.TicketName || 'Khách hàng'}</strong> | SĐT: {newTicketAlert.ticket.Phone || '---'} | Nguồn: <span className="font-semibold text-white">{newTicketAlert.ticket.SourceName}</span>
                </div>
              )}
            </div>
          </div>
          <button
            onClick={() => setNewTicketAlert(null)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 text-xs font-medium border border-emerald-500/30 shrink-0 cursor-pointer"
          >
            Đã xem
          </button>
        </div>
      )}

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

      {/* Quick Switch Tabs for Web & Marketing Channels */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-2 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Tab 1: Kênh Website */}
          <button
            onClick={() => {
              setChannelScope('web');
              setSelectedSource('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              channelScope === 'web'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/50'
                : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <Globe className={`w-4 h-4 ${channelScope === 'web' ? 'text-white' : 'text-emerald-400'}`} />
            <span>Kênh Website (OL WB + HL WB)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              channelScope === 'web' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {scopeCounts.web}
            </span>
          </button>

          {/* Tab 2: Online Web */}
          <button
            onClick={() => {
              setChannelScope('online_web');
              setSelectedSource('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              channelScope === 'online_web'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400/50'
                : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <Globe className={`w-4 h-4 ${channelScope === 'online_web' ? 'text-white' : 'text-blue-400'}`} />
            <span>Online Web</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              channelScope === 'online_web' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {scopeCounts.onlineWeb}
            </span>
          </button>

          {/* Tab 3: Hotline Web */}
          <button
            onClick={() => {
              setChannelScope('hotline_web');
              setSelectedSource('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              channelScope === 'hotline_web'
                ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg shadow-sky-500/25 ring-1 ring-sky-400/50'
                : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <Phone className={`w-4 h-4 ${channelScope === 'hotline_web' ? 'text-white' : 'text-sky-400'}`} />
            <span>Hotline Web</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              channelScope === 'hotline_web' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {scopeCounts.hotlineWeb}
            </span>
          </button>

          {/* Tab 4: Toàn Bộ Marketing */}
          <button
            onClick={() => {
              setChannelScope('all');
              setSelectedSource('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              channelScope === 'all'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 ring-1 ring-orange-400/50'
                : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <Megaphone className={`w-4 h-4 ${channelScope === 'all' ? 'text-white' : 'text-orange-400'}`} />
            <span>Toàn Bộ Marketing</span>
          </button>

          {/* Tab 5: Google Ads GCLID */}
          <button
            onClick={() => {
              setChannelScope('gclid');
              setSelectedSource('all');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              channelScope === 'gclid'
                ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-lg shadow-amber-500/25 ring-1 ring-amber-400/50'
                : 'bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80'
            }`}
          >
            <Target className={`w-4 h-4 ${channelScope === 'gclid' ? 'text-white' : 'text-amber-400'}`} />
            <span>Google Ads (Có GCLID)</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
              channelScope === 'gclid' ? 'bg-white/25 text-white' : 'bg-slate-800 text-slate-300'
            }`}>
              {scopeCounts.gclid}
            </span>
          </button>
        </div>

        {/* Current mode badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800 shrink-0">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              channelScope === 'web'
                ? 'bg-emerald-400'
                : channelScope === 'online_web'
                ? 'bg-blue-400'
                : channelScope === 'hotline_web'
                ? 'bg-sky-400'
                : channelScope === 'all'
                ? 'bg-orange-400'
                : 'bg-amber-400'
            }`}
          />
          <span>
            Đang xem:{' '}
            <strong className="text-slate-200">
              {channelScope === 'web'
                ? 'Chuyên sâu Website (OL WB + HL WB)'
                : channelScope === 'online_web'
                ? 'Kênh Online Web (OL WB)'
                : channelScope === 'hotline_web'
                ? 'Kênh Hotline Web (HL WB)'
                : channelScope === 'all'
                ? 'Toàn bộ kênh Marketing'
                : 'Vé có GCLID Google Ads'}
            </strong>
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Đặt Hẹn (Đổi từ Tổng Quan theo yêu cầu) */}
        <div 
          onClick={() => {
            if (selectedSource !== 'all') {
              setSelectedSource('all');
            }
          }}
          className={`bg-slate-900/60 border rounded-xl p-4 shadow-sm transition-all cursor-pointer hover:border-emerald-500/50 group ${
            selectedSource === 'all'
              ? 'border-emerald-500/50 ring-1 ring-emerald-500/30'
              : 'border-slate-800 hover:border-slate-700'
          }`}
          title="Bấm để xem toàn bộ danh sách khách đặt hẹn"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors truncate max-w-[140px]">
              Đặt Hẹn
            </span>
            <CalendarCheck className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white">{kpis.total.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {selectedSource !== 'all'
              ? `Đang lọc: ${selectedSource}`
              : channelScope === 'web'
              ? 'Tổng hợp OL WB & HL WB'
              : channelScope === 'online_web'
              ? 'Nguồn Online Web (OL WB)'
              : channelScope === 'hotline_web'
              ? 'Nguồn Hotline Web (HL WB)'
              : channelScope === 'gclid'
              ? 'Có mã đối soát chuyển đổi'
              : 'Dữ liệu toàn bộ nguồn'}
          </div>
        </div>

        {/* Card 2: Online Web */}
        <div 
          onClick={() => {
            setSelectedSource((prev) => (prev === 'OL WB' ? 'all' : 'OL WB'));
          }}
          className={`bg-slate-900/60 border rounded-xl p-4 shadow-sm transition-all cursor-pointer group ${
            selectedSource === 'OL WB'
              ? 'border-blue-500/60 bg-blue-950/30 ring-1 ring-blue-500/50'
              : 'border-slate-800 hover:border-blue-500/50'
          }`}
          title="Bấm để lọc riêng Online Web (OL WB)"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-blue-300 group-hover:text-blue-200 transition-colors">Online Web</span>
            <Globe className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{kpis.onlineWeb.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {selectedSource === 'OL WB'
              ? 'Đang lọc riêng Online Web'
              : `Nguồn OL WB (${kpis.onlineRate}% Web)`}
          </div>
        </div>

        {/* Card 3: Hotline Web */}
        <div 
          onClick={() => {
            setSelectedSource((prev) => (prev === 'HL WB' ? 'all' : 'HL WB'));
          }}
          className={`bg-slate-900/60 border rounded-xl p-4 shadow-sm transition-all cursor-pointer group ${
            selectedSource === 'HL WB'
              ? 'border-sky-500/60 bg-sky-950/30 ring-1 ring-sky-500/50'
              : 'border-slate-800 hover:border-sky-500/50'
          }`}
          title="Bấm để lọc riêng Hotline Web (HL WB)"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-sky-300 group-hover:text-sky-200 transition-colors">Hotline Web</span>
            <Phone className="w-4 h-4 text-sky-400 shrink-0 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-sky-400">{kpis.hotlineWeb.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {selectedSource === 'HL WB'
              ? 'Đang lọc riêng Hotline Web'
              : `Nguồn HL WB (${kpis.hotlineRate}% Web)`}
          </div>
        </div>

        {/* Card 4: Đã Đặt Lịch Hẹn */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đã Đặt Lịch Hẹn</span>
            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
          </div>
          <div className="text-2xl font-bold text-emerald-400">{kpis.booked.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400/90 mt-1 font-medium">Tỷ lệ đặt: {kpis.bookedRate}%</div>
        </div>

        {/* Card 5: Đã Đến Khám */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Đã Đến Khám</span>
            <Award className="w-4 h-4 text-purple-400 shrink-0" />
          </div>
          <div className="text-2xl font-bold text-purple-400">{kpis.arrived.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {selectedSource !== 'all'
              ? `Đến từ ${selectedSource}`
              : channelScope === 'web' || channelScope === 'online_web' || channelScope === 'hotline_web'
              ? 'Đến khám từ Website'
              : 'Tại 17 cơ sở Tâm Đức'}
          </div>
        </div>

        {/* Card 6: GCLID Google Ads */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 shadow-sm transition-all hover:border-slate-700">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>GCLID Google Ads</span>
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{kpis.hasGclid.toLocaleString()}</div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {selectedSource !== 'all'
              ? `GCLID từ ${selectedSource}`
              : channelScope === 'web' || channelScope === 'online_web' || channelScope === 'hotline_web'
              ? 'GCLID từ Website'
              : 'Có mã đối soát chuyển đổi'}
          </div>
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
          <div className="w-full md:w-64">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">
                {channelScope === 'web'
                  ? 'Tất cả Nguồn Web (OL WB + HL WB)'
                  : channelScope === 'online_web'
                  ? 'Nguồn Online Web (OL WB)'
                  : channelScope === 'hotline_web'
                  ? 'Nguồn Hotline Web (HL WB)'
                  : channelScope === 'gclid'
                  ? 'Tất cả Nguồn có GCLID'
                  : 'Tất cả Nguồn'}
              </option>
              {scopedAvailableSources.map((src) => (
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
              <option value="all">Tất cả Trạng Thái</option>
              {availableStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Source Pills Navigation */}
        <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 font-medium flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-orange-400" />
            {channelScope === 'web'
              ? 'Nguồn Kênh Web:'
              : channelScope === 'online_web'
              ? 'Nguồn Online Web:'
              : channelScope === 'hotline_web'
              ? 'Nguồn Hotline Web:'
              : 'Nguồn CRM:'}
          </span>
          <button
            onClick={() => setSelectedSource('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedSource === 'all'
                ? channelScope === 'web'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : channelScope === 'online_web'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : channelScope === 'hotline_web'
                  ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                  : 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {channelScope === 'web'
              ? `Tất cả Web (${scopeCounts.web})`
              : channelScope === 'online_web'
              ? `Online Web (${scopeCounts.onlineWeb})`
              : channelScope === 'hotline_web'
              ? `Hotline Web (${scopeCounts.hotlineWeb})`
              : `Tất cả (${channelScope === 'gclid' ? scopeCounts.gclid : tickets.length})`}
          </button>
          {scopedAvailableSources.map((src) => {
            const count = sourceStats[src] || 0;
            const isSelected = selectedSource === src;
            return (
              <button
                key={src}
                onClick={() => setSelectedSource(isSelected ? 'all' : src)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? channelScope === 'web' || channelScope === 'online_web' || channelScope === 'hotline_web'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                    : getSourceBadgeColor(src)
                }`}
              >
                <span>{src}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    isSelected ? 'bg-white/25 text-white' : 'bg-slate-950/60 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Date Filter & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 text-xs border-t border-slate-800/60 text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>Hiển thị: <strong className="text-white">{filteredTickets.length}</strong> / {tickets.length} Ticket</span>
            
            {/* Active Time Badge */}
            {!dateFrom && !dateTo ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-medium">
                Toàn thời gian (Tất cả)
              </span>
            ) : dateFrom === dateTo && dateFrom === getVietnamTodayStr() ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Ngày tạo: Hôm nay ({dateFrom.split('-').reverse().join('/')})</span>
                <button
                  type="button"
                  onClick={setAllTime}
                  title="Xóa bộ lọc để xem toàn thời gian"
                  className="hover:text-white font-bold text-xs ml-0.5"
                >
                  &times;
                </button>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-500/15 text-orange-300 border border-orange-500/30 text-[11px] font-medium">
                <span>Ngày tạo: {dateFrom ? dateFrom.split('-').reverse().join('/') : '...'} &rarr; {dateTo ? dateTo.split('-').reverse().join('/') : 'nay'}</span>
                <button
                  type="button"
                  onClick={setAllTime}
                  title="Xóa bộ lọc ngày để xem toàn thời gian"
                  className="hover:text-white font-bold text-xs"
                >
                  &times;
                </button>
              </span>
            )}

            {(searchTerm || selectedSource !== 'all' || selectedStatus !== 'all' || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSource('all');
                  setSelectedStatus('all');
                  setAllTime();
                }}
                className="text-orange-400 hover:underline ml-1 text-xs"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Quick Presets */}
            <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={setAllTime}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  !dateFrom && !dateTo
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Toàn thời gian
              </button>
              <button
                type="button"
                onClick={setPresetToday}
                className={`px-2 py-1 rounded-md font-medium transition-colors ${
                  dateFrom === dateTo && dateFrom === getVietnamTodayStr()
                    ? 'bg-orange-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Hôm nay
              </button>
              <button
                type="button"
                onClick={setPresetLast7Days}
                className="px-2 py-1 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                7 ngày qua
              </button>
              <button
                type="button"
                onClick={setPresetThisMonth}
                className="px-2 py-1 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-colors"
              >
                Tháng này
              </button>
            </div>

            {/* Custom Date Pickers */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                title="Chọn ngày bắt đầu"
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              />
              <span className="text-slate-500 text-[11px]">đến</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                title="Chọn ngày kết thúc"
                className="bg-transparent text-slate-200 text-xs focus:outline-none cursor-pointer"
              />
              {(dateFrom || dateTo) && (
                <button
                  type="button"
                  onClick={setAllTime}
                  title="Về toàn thời gian"
                  className="text-slate-400 hover:text-white px-1 text-xs font-bold"
                >
                  &times;
                </button>
              )}
            </div>

            <button
              onClick={() => handleSync()}
              disabled={syncing}
              title={!dateFrom && !dateTo ? 'Tải lại toàn bộ dữ liệu từ VTTech' : 'Tải lại danh sách theo ngày đã chọn'}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600/90 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium text-xs shadow-sm transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{!dateFrom && !dateTo ? 'Tải lại (Toàn bộ)' : 'Tải theo ngày'}</span>
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
                <th className="px-4 py-3.5">Ngày Tạo</th>
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
                filteredTickets.map((t, index) => {
                  const hasValidAppointment = t.AppDateFrom && !t.AppDateFrom.startsWith('1900');
                  return (
                    <tr
                      key={`${t.TicketID}-${t.CustCode || ''}-${index}`}
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
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getSourceBadgeColor(t.SourceName)}`}>
                          {t.SourceName || 'Trực tiếp'}
                        </span>
                        {t.SourceDetailName && (
                          <div className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                            {t.SourceDetailName}
                          </div>
                        )}
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
                      <td className="px-4 py-3.5 whitespace-nowrap text-xs text-slate-300 font-mono">
                        {formatTicketDateTime(t.Created)}
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

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setConfigTab('curl')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  configTab === 'curl'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Dán cURL Từ Network (Nhanh nhất)
              </button>
              <button
                type="button"
                onClick={() => setConfigTab('manual')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  configTab === 'manual'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Nhập Thủ Công
              </button>
            </div>

            {configTab === 'curl' ? (
              <div className="p-6 space-y-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
                  <div className="font-semibold text-orange-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Cách lấy mã cURL nhanh từ Chrome / Edge:</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-slate-400 leading-relaxed pl-1">
                    <li>Mở tab VTTech CRM tại trình duyệt & bấm <kbd className="px-1 py-0.5 rounded bg-slate-800 font-mono text-[11px] text-white">F12</kbd> (Network / Mạng).</li>
                    <li>Tìm yêu cầu <code className="text-orange-300">TicketList/?handler=LoadList</code>.</li>
                    <li>Chuột phải vào yêu cầu đó &rarr; chọn <strong>Copy</strong> &rarr; <strong>Copy as cURL (bash)</strong>.</li>
                    <li>Dán toàn bộ vào ô dưới đây và bấm nút bên dưới.</li>
                  </ol>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
                    <span>Mã lệnh cURL:</span>
                    <span className="text-[11px] text-slate-500">Tự động bóc tách Cookie, SecretKey, XSRF</span>
                  </label>
                  <textarea
                    rows={6}
                    value={curlInput}
                    onChange={(e) => setCurlInput(e.target.value)}
                    placeholder="curl 'https://nktamduc.vttechsolution.com/Marketing/TicketList/?handler=LoadList' -H 'Cookie: ...' -H 'SecretKey: ...' ..."
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsConfigOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium"
                  >
                    Đóng
                  </button>
                  <button
                    type="button"
                    disabled={curlLoading || !curlInput.trim()}
                    onClick={handleImportCurl}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-orange-600/30 transition-all"
                  >
                    <RefreshCw className={`w-4 h-4 ${curlLoading ? 'animate-spin' : ''}`} />
                    <span>{curlLoading ? 'Đang trích xuất...' : 'Trích Xuất & Kết Nối Ngay'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveConfig} className="p-6 space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Hệ thống kết nối trực tiếp với tài khoản <strong>Văn Đức (ID: 1412)</strong>. Bạn có thể tự chỉnh sửa thủ công từng trường:
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};
