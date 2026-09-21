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
  EyeOff,
  KeyRound,
  Lock,
  Unlock,
  UserCheck,
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
  ChevronLeft,
  BarChart3,
} from 'lucide-react';
import { VTTechTicket } from '../types/vttech';
import {
  fetchVTTechConfig,
  saveVTTechConfig,
  fetchCachedVTTechTickets,
  syncVTTechTickets,
  importVTTechCurl,
  checkVTTechSession,
  importVTTechTickets,
  loginVTTechAccount,
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

// Shift date string (YYYY-MM-DD) by delta days
const shiftDateStr = (dateStr: string, deltaDays: number): string => {
  if (!dateStr) return getVietnamTodayStr();
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + deltaDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get yesterday's date in YYYY-MM-DD (Vietnam time GMT+7)
const getYesterdayStr = (): string => {
  return shiftDateStr(getVietnamTodayStr(), -1);
};

// Vietnamese day of the week
const getDayOfWeekVN = (dateStr: string): string => {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  return days[date.getDay()] || '';
};

// Interface for Daily Breakdown Summary
interface DailySummary {
  date: string;
  formattedDate: string;
  dayOfWeek: string;
  total: number;
  webTotal: number;
  onlineWeb: number;
  hotlineWeb: number;
  booked: number;
  bookedRate: number;
  arrived: number;
  arrivedRate: number;
  gclidCount: number;
}

// Helper to extract comparable date (YYYY-MM-DD) from date string
const parseToDateStr = (raw?: string | null): string | null => {
  if (!raw || raw.startsWith('1900')) return null;
  const clean = raw.trim();
  const isoMatch = clean.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;
  const vnMatch = clean.match(/(\d{2})[/-](\d{2})[/-](\d{4})/);
  if (vnMatch) return `${vnMatch[3]}-${vnMatch[2]}-${vnMatch[1]}`;
  return null;
};

// Helper to check if a source belongs to Web channels
const isWebSource = (source?: string): boolean => {
  return source === 'OL WB' || source === 'HL WB' || source === 'KC WB';
};

// Helper to get newest date with tickets based on Created date (Ngày tạo)
const getLatestDateFromTickets = (list: VTTechTicket[]): string => {
  for (const t of list) {
    const d = parseToDateStr(t.Created);
    if (d) return d;
  }
  return getVietnamTodayStr();
};

// Dental Specialty Service names for VTTech
export const VTTECH_SERVICES = [
  'Răng Sứ',
  'Implant',
  'Niềng Răng',
  'Trám Răng',
  'Nhổ Răng',
  'Cạo Vôi',
  'Tẩy Trắng',
  'Chữa Tủy',
  'Hàm Tháo Lắp',
  'Khám Tổng Quát',
  'Điều Trị',
  'Tư Vấn',
];

// Helper to detect dental service from VTTech ticket fields (ServiceCare IDs, Content, TypeName)
export const getTicketService = (t: VTTechTicket): string => {
  const sc = (t.ServiceCare || '').trim();
  const services: string[] = [];

  // Mapped from VTTech ServiceCare ID numbers to Dental Specialties
  if (sc.includes('8,')) services.push('Implant');
  if (sc.includes('1,') || sc.includes('11,')) {
    if (!services.includes('Răng Sứ')) services.push('Răng Sứ');
  }
  if (sc.includes('9,') || sc.includes('10,')) {
    if (!services.includes('Niềng Răng')) services.push('Niềng Răng');
  }
  if (sc.includes('4,')) services.push('Trám Răng');
  if (sc.includes('3,')) services.push('Nhổ Răng');
  if (sc.includes('5,')) services.push('Chữa Tủy');
  if (sc.includes('6,')) services.push('Hàm Tháo Lắp');
  if (sc.includes('7,')) services.push('Tẩy Trắng');
  if (sc.includes('12,') || sc.includes('2,')) {
    if (!services.includes('Cạo Vôi')) services.push('Cạo Vôi');
  }

  if (services.length > 0) return services.join(', ');

  // Parse from Content / ContentLast / Campaign / SourceDetailName
  const text = `${t.Content || ''} ${t.ContentLast || ''} ${t.Campaign || ''} ${t.SourceDetailName || ''}`.toLowerCase();
  
  if (text.includes('implant') || /\bimp\b/.test(text) || text.includes('cấy ghép') || text.includes('all on') || text.includes('all-on')) return 'Implant';
  if (text.includes('răng sứ') || text.includes('bọc sứ') || text.includes('dán sứ') || text.includes('veneer') || /\bnrs\b/.test(text) || /\btv sứ\b/.test(text) || /\bktv sứ\b/.test(text)) return 'Răng Sứ';
  if (text.includes('niềng') || text.includes('chỉnh nha') || text.includes('mắc cài') || text.includes('invisalign') || /\btvcn\b/.test(text) || /\bktv cn\b/.test(text)) return 'Niềng Răng';
  if (text.includes('trám') || /\btram\b/.test(text) || /\bktv trám\b/.test(text)) return 'Trám Răng';
  if (text.includes('nhổ') || /\bnr\b/.test(text) || /\bnrk\b/.test(text) || text.includes('tiểu phẫu')) return 'Nhổ Răng';
  if (text.includes('tủy') || /\bctuy\b/.test(text) || text.includes('nội nha')) return 'Chữa Tủy';
  if (text.includes('tháo lắp') || /\bktv tl\b/.test(text)) return 'Hàm Tháo Lắp';
  if (text.includes('tẩy trắng') || /\bttr\b/.test(text)) return 'Tẩy Trắng';
  if (text.includes('cạo vôi') || /\bcvr\b/.test(text)) return 'Cạo Vôi';
  if (text.includes('tổng quát') || text.includes('ktra răng') || text.includes('kiểm tra')) return 'Khám Tổng Quát';

  if (t.TypeName && t.TypeName.trim()) return t.TypeName.trim();

  return '—';
};

// Distinctive badge styling for dental services
export const getServiceBadgeColor = (serviceName: string): string => {
  if (serviceName.includes('Implant')) return 'bg-purple-500/10 text-purple-300 border-purple-500/30';
  if (serviceName.includes('Răng Sứ')) return 'bg-sky-500/10 text-sky-300 border-sky-500/30';
  if (serviceName.includes('Niềng')) return 'bg-teal-500/10 text-teal-300 border-teal-500/30';
  if (serviceName.includes('Trám')) return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
  if (serviceName.includes('Nhổ')) return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
  if (serviceName.includes('Cạo Vôi')) return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
  if (serviceName.includes('Tẩy Trắng')) return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
  if (serviceName.includes('Tủy')) return 'bg-orange-500/10 text-orange-300 border-orange-500/30';
  if (serviceName.includes('Tháo Lắp')) return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  if (serviceName.includes('Khám')) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  if (serviceName.includes('Điều Trị')) return 'bg-blue-500/10 text-blue-300 border-blue-500/30';
  if (serviceName.includes('Tư Vấn')) return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30';
  return 'bg-slate-800 text-slate-300 border-slate-700';
};

export const VTTechCRMView: React.FC = () => {
  const [tickets, setTickets] = useState<VTTechTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Primary View Mode: Danh Sách Ticket Theo Ngày vs Báo Cáo Thống Kê Theo Ngày
  const [mainViewMode, setMainViewMode] = useState<'tickets' | 'daily_report'>('tickets');

  // Search & Filter state
  const [channelScope, setChannelScope] = useState<'web' | 'all' | 'gclid'>('web');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');
  // Default to today view so user immediately sees real-time stats for today
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
  const [configTab, setConfigTab] = useState<'account' | 'curl' | 'json' | 'manual'>('account');
  const [accountUsername, setAccountUsername] = useState<string>('VanDuc');
  const [accountPassword, setAccountPassword] = useState<string>('mktduc');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [accountLoggingIn, setAccountLoggingIn] = useState<boolean>(false);
  const [curlInput, setCurlInput] = useState<string>('');
  const [curlLoading, setCurlLoading] = useState<boolean>(false);
  const [jsonTicketsInput, setJsonTicketsInput] = useState<string>('');
  const [jsonLoading, setJsonLoading] = useState<boolean>(false);
  const [configCookie, setConfigCookie] = useState<string>('');
  const [configSecretKey, setConfigSecretKey] = useState<string>('');
  const [configXsrfToken, setConfigXsrfToken] = useState<string>('');
  const [configUserId, setConfigUserId] = useState<number>(1412);
  const [savingConfig, setSavingConfig] = useState<boolean>(false);

  // Session & Auth state
  const [sessionStatus, setSessionStatus] = useState<{
    checked: boolean;
    isValid: boolean;
    authExpired: boolean;
    username?: string;
    autoLoginEnabled?: boolean;
    todayTotal?: number;
    todayOL?: number;
    todayHL?: number;
  }>({ checked: false, isValid: true, authExpired: false, username: 'VanDuc', autoLoginEnabled: true });

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
      const [cacheRes, configRes, sessionRes] = await Promise.all([
        fetchCachedVTTechTickets(),
        fetchVTTechConfig(),
        checkVTTechSession(),
      ]);

      if (sessionRes) {
        setSessionStatus({
          checked: true,
          isValid: sessionRes.isValid,
          authExpired: sessionRes.authExpired,
          username: sessionRes.username || 'VanDuc',
          autoLoginEnabled: sessionRes.autoLoginEnabled !== false,
          todayTotal: sessionRes.todayTotal,
          todayOL: sessionRes.todayOL,
          todayHL: sessionRes.todayHL,
        });
        if (sessionRes.username) {
          setAccountUsername(sessionRes.username);
        }
      }

      if (cacheRes.data && cacheRes.data.length > 0) {
        setTickets(cacheRes.data);
        setLastSyncTime(cacheRes.cachedAt);

        // Smart initial date selection: check if today has tickets
        const todayStr = getVietnamTodayStr();
        const hasTodayTickets = cacheRes.data.some((t: any) => parseToDateStr(t.Created) === todayStr);
        if (!hasTodayTickets) {
          const latest = getLatestDateFromTickets(cacheRes.data);
          if (latest) {
            setDateFrom(latest);
            setDateTo(latest);
          }
        }
      } else {
        // Auto-sync if cache is empty
        handleSync();
      }

      if (configRes.success && configRes.config) {
        setConfigUserId(configRes.config.userID || 1412);
        if (configRes.config.username) {
          setAccountUsername(configRes.config.username);
        }
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

  const handleAccountLogin = async () => {
    if (!accountUsername.trim() || !accountPassword.trim()) {
      setErrorMessage('Vui lòng nhập tên tài khoản và mật khẩu CRM');
      return;
    }
    setAccountLoggingIn(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const res = await loginVTTechAccount(accountUsername.trim(), accountPassword.trim());
      if (res.success) {
        setSuccessMessage(res.message || 'Đăng nhập CRM thành công và đã đồng bộ dữ liệu mới nhất!');
        setSessionStatus((prev) => ({
          ...prev,
          isValid: true,
          authExpired: false,
          username: res.user || accountUsername.trim(),
        }));
        setIsConfigOpen(false);
        await loadInitialData();
      } else {
        throw new Error(res.error || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setAccountLoggingIn(false);
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

      if (res.authExpired) {
        setSessionStatus((prev) => ({ ...prev, checked: true, isValid: false, authExpired: true }));
      }

      if (res.success && res.data) {
        setTickets(res.data);
        setLastSyncTime(res.cachedAt);
        const timeScopeDesc = (!fromVal && !toVal) ? 'toàn thời gian' : `từ ${fromVal || 'bắt đầu'} đến ${toVal || 'nay'}`;
        if (res.authExpired) {
          setSuccessMessage(`Đã đối chiếu ${res.data.length} vé từ dữ liệu lưu (${timeScopeDesc}). Phiên VTTech cần cập nhật mã cURL mới để tự động nhận vé tiếp theo.`);
        } else {
          setSuccessMessage(`Đã đồng bộ ${res.data.length} Ticket (${timeScopeDesc}) trực tiếp từ VTTech CRM!`);
        }
        setTimeout(() => setSuccessMessage(''), 6000);
      } else {
        throw new Error(res.error || 'Đồng bộ không thành công');
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi đồng bộ: ${err.message}. Đang hiển thị dữ liệu lưu gần nhất.`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSyncAll2026 = async () => {
    setSyncing(true);
    setErrorMessage('');
    setSuccessMessage('Đang lấy toàn bộ dữ liệu từ 01/01/2026 đến nay từ VTTech CRM (vui lòng chờ)...');
    try {
      const today = getVietnamTodayStr();
      setDateFrom('2026-01-01');
      setDateTo(today);
      const res = await syncVTTechTickets({
        dateFrom: '2026-01-01 00:00:00',
        dateTo: `${today} 23:59:59`,
        limit: 15000,
        fetchAll: true,
      });

      if (res.authExpired) {
        setSessionStatus((prev) => ({ ...prev, checked: true, isValid: false, authExpired: true }));
      }

      if (res.success && res.data) {
        setTickets(res.data);
        setLastSyncTime(res.cachedAt);
        setSuccessMessage(`Đã lấy thành công toàn bộ ${res.data.length.toLocaleString('vi-VN')} vé từ 01/01/2026 đến nay!`);
        setTimeout(() => setSuccessMessage(''), 8000);
      } else {
        throw new Error(res.error || 'Đồng bộ toàn bộ thất bại');
      }
    } catch (err: any) {
      setErrorMessage(`Lỗi đồng bộ toàn bộ: ${err.message}`);
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
        setSuccessMessage('Đã cập nhật kết nối VTTech thành công! Đang đồng bộ lại dữ liệu...');
        setCurlInput('');
        setIsConfigOpen(false);
        const sessionCheck = await checkVTTechSession();
        if (sessionCheck) {
          setSessionStatus({
            checked: true,
            isValid: sessionCheck.isValid,
            authExpired: sessionCheck.authExpired,
            todayTotal: sessionCheck.todayTotal,
            todayOL: sessionCheck.todayOL,
            todayHL: sessionCheck.todayHL,
          });
        }
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

  const handleImportJson = async () => {
    if (!jsonTicketsInput.trim()) {
      setErrorMessage('Vui lòng dán chuỗi JSON danh sách vé');
      return;
    }
    setJsonLoading(true);
    setErrorMessage('');
    try {
      let parsed: any;
      try {
        parsed = JSON.parse(jsonTicketsInput.trim());
      } catch (e: any) {
        throw new Error('Dữ liệu không đúng định dạng JSON hợp lệ: ' + e.message);
      }
      let ticketArray = Array.isArray(parsed) ? parsed : (Array.isArray(parsed.data) ? parsed.data : null);
      if (Array.isArray(ticketArray) && ticketArray.length >= 2 && Array.isArray(ticketArray[1])) {
        ticketArray = ticketArray[1];
      }
      if (!ticketArray || ticketArray.length === 0) {
        throw new Error('Không tìm thấy danh sách vé trong JSON (cần mảng các đối tượng vé hoặc { data: [...] })');
      }
      const res = await importVTTechTickets(ticketArray);
      if (res.success) {
        setSuccessMessage(`Đã nạp thành công ${ticketArray.length} vé vào hệ thống!`);
        setJsonTicketsInput('');
        setIsConfigOpen(false);
        await loadInitialData();
      } else {
        throw new Error(res.error || 'Lỗi khi nạp dữ liệu vé');
      }
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setJsonLoading(false);
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
    // Lấy chuẩn 100% theo Ngày Tạo (Created) của Ticket
    const createdDate = parseToDateStr(t.Created);
    if (!createdDate) return false;

    if (from && createdDate < from) return false;
    if (to && createdDate > to) return false;
    return true;
  };

  // Latest available date that contains tickets
  const latestAvailableDate = useMemo(() => {
    return getLatestDateFromTickets(tickets);
  }, [tickets]);

  // Ticket count for today
  const todayTicketCount = useMemo(() => {
    const today = getVietnamTodayStr();
    return tickets.filter((t) => ticketMatchesDate(t, today, today)).length;
  }, [tickets]);

  const todayWebCount = useMemo(() => {
    const today = getVietnamTodayStr();
    return tickets.filter((t) => isWebSource(t.SourceName) && ticketMatchesDate(t, today, today)).length;
  }, [tickets]);

  // Ticket count for yesterday
  const yesterdayTicketCount = useMemo(() => {
    const yest = getYesterdayStr();
    return tickets.filter((t) => ticketMatchesDate(t, yest, yest)).length;
  }, [tickets]);

  const yesterdayWebCount = useMemo(() => {
    const yest = getYesterdayStr();
    return tickets.filter((t) => isWebSource(t.SourceName) && ticketMatchesDate(t, yest, yest)).length;
  }, [tickets]);

  // Ticket count for the latest available date
  const latestDayTicketCount = useMemo(() => {
    if (!latestAvailableDate) return 0;
    return tickets.filter((t) => ticketMatchesDate(t, latestAvailableDate, latestAvailableDate)).length;
  }, [tickets, latestAvailableDate]);

  // Global All-Time CRM stats for always-available context
  const allTimeStats = useMemo(() => {
    const web = tickets.filter((t) => isWebSource(t.SourceName)).length;
    const onlineWeb = tickets.filter((t) => t.SourceName === 'OL WB').length;
    const hotlineWeb = tickets.filter((t) => t.SourceName === 'HL WB').length;
    const booked = tickets.filter((t) => 
      (t.IsBook && t.IsBook > 0) || 
      (t.AppDateFrom && !t.AppDateFrom.startsWith('1900')) || 
      (t.StatusName && t.StatusName.toLowerCase().includes('lịch hẹn'))
    ).length;
    const arrived = tickets.filter((t) => 
      (t.StatusName && t.StatusName.toLowerCase().includes('đến')) ||
      (t.TypeStatusScheduleID !== undefined && [2, 3, 4].includes(t.TypeStatusScheduleID))
    ).length;
    const gclid = tickets.filter((t) => t.Gclid && t.Gclid.length > 5).length;
    return {
      total: tickets.length,
      web,
      onlineWeb,
      hotlineWeb,
      booked,
      arrived,
      gclid,
    };
  }, [tickets]);

  // Daily Navigation & Presets
  const goToPrevDay = () => {
    const current = (dateFrom && dateFrom === dateTo) ? dateFrom : (dateFrom || dateTo || latestAvailableDate || getVietnamTodayStr());
    const prev = shiftDateStr(current, -1);
    setDateFrom(prev);
    setDateTo(prev);
  };

  const goToNextDay = () => {
    const current = (dateFrom && dateFrom === dateTo) ? dateFrom : (dateFrom || dateTo || latestAvailableDate || getVietnamTodayStr());
    const next = shiftDateStr(current, 1);
    setDateFrom(next);
    setDateTo(next);
  };

  const setPresetToday = () => {
    const today = getVietnamTodayStr();
    setDateFrom(today);
    setDateTo(today);
  };

  const setPresetYesterday = () => {
    const yesterday = getYesterdayStr();
    setDateFrom(yesterday);
    setDateTo(yesterday);
  };

  const setPresetSpecificDay = (dateStr: string) => {
    setDateFrom(dateStr);
    setDateTo(dateStr);
  };

  const setAllTime = () => {
    setDateFrom('');
    setDateTo('');
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

  const setPresetYear2026 = () => {
    setDateFrom('2026-01-01');
    setDateTo(getVietnamTodayStr());
  };

  // Aggregated Daily Statistics across all dates for the "Báo Cáo Theo Ngày" view
  const dailySummaries = useMemo<DailySummary[]>(() => {
    const dayMap = new Map<string, {
      date: string;
      total: number;
      webTotal: number;
      onlineWeb: number;
      hotlineWeb: number;
      booked: number;
      arrived: number;
      gclidCount: number;
    }>();

    tickets.forEach((t) => {
      if (selectedBranch !== 'all' && t.AppBranch !== selectedBranch) return;
      if (channelScope === 'web' && !isWebSource(t.SourceName)) return;
      if (channelScope === 'gclid' && (!t.Gclid || t.Gclid.length <= 5)) return;

      const dt = parseToDateStr(t.Created);
      if (!dt) return;

      if (!dayMap.has(dt)) {
        dayMap.set(dt, {
          date: dt,
          total: 0,
          webTotal: 0,
          onlineWeb: 0,
          hotlineWeb: 0,
          booked: 0,
          arrived: 0,
          gclidCount: 0,
        });
      }

      const stat = dayMap.get(dt)!;
      stat.total++;
      if (isWebSource(t.SourceName)) stat.webTotal++;
      if (t.SourceName === 'OL WB') stat.onlineWeb++;
      if (t.SourceName === 'HL WB') stat.hotlineWeb++;

      if (
        (t.IsBook && t.IsBook > 0) ||
        (t.AppDateFrom && !t.AppDateFrom.startsWith('1900')) ||
        (t.StatusName && t.StatusName.toLowerCase().includes('lịch hẹn'))
      ) {
        stat.booked++;
      }

      if (
        (t.StatusName && t.StatusName.toLowerCase().includes('đến')) ||
        (t.TypeStatusScheduleID !== undefined && [2, 3, 4].includes(t.TypeStatusScheduleID))
      ) {
        stat.arrived++;
      }

      if (t.Gclid && t.Gclid.length > 5) {
        stat.gclidCount++;
      }
    });

    const sortedList = Array.from(dayMap.values()).sort((a, b) => b.date.localeCompare(a.date));

    return sortedList.map((s) => {
      const bookedRate = s.total > 0 ? Math.round((s.booked / s.total) * 100) : 0;
      const arrivedRate = s.booked > 0 ? Math.round((s.arrived / s.booked) * 100) : 0;
      const parts = s.date.split('-');
      const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
      return {
        ...s,
        formattedDate,
        dayOfWeek: getDayOfWeekVN(s.date),
        bookedRate,
        arrivedRate,
      };
    });
  }, [tickets, channelScope, selectedBranch]);

  // Scope Counts for quick switch tabs (both for current selected date range and overall)
  const scopeCounts = useMemo(() => {
    const inDateTickets = tickets.filter((t) => ticketMatchesDate(t, dateFrom, dateTo));
    const web = inDateTickets.filter((t) => isWebSource(t.SourceName)).length;
    const onlineWeb = inDateTickets.filter((t) => t.SourceName === 'OL WB').length;
    const hotlineWeb = inDateTickets.filter((t) => t.SourceName === 'HL WB').length;
    const gclid = inDateTickets.filter((t) => t.Gclid && t.Gclid.length > 5).length;
    return {
      web,
      onlineWeb,
      hotlineWeb,
      all: inDateTickets.length,
      gclid,
      allTimeWeb: tickets.filter((t) => isWebSource(t.SourceName)).length,
      allTimeTotal: tickets.length,
    };
  }, [tickets, dateFrom, dateTo]);

  // Available sources matching the current channelScope
  const scopedAvailableSources = useMemo(() => {
    if (channelScope === 'web') {
      return availableSources.filter(isWebSource);
    }
    if (channelScope === 'gclid') {
      const gclidSources = new Set(
        tickets.filter((t) => t.Gclid && t.Gclid.length > 5 && t.SourceName).map((t) => t.SourceName.trim())
      );
      return availableSources.filter((src) => gclidSources.has(src));
    }
    return availableSources;
  }, [channelScope, availableSources, tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const search = searchTerm.toLowerCase();
      const serviceName = getTicketService(t);
      const matchSearch =
        !searchTerm ||
        (t.TicketName && t.TicketName.toLowerCase().includes(search)) ||
        (t.Phone && t.Phone.includes(search)) ||
        (t.CustCode && t.CustCode.toLowerCase().includes(search)) ||
        (t.Content && t.Content.toLowerCase().includes(search)) ||
        (t.TicketID && String(t.TicketID).includes(search)) ||
        serviceName.toLowerCase().includes(search);

      // Scope match
      let matchScope = true;
      if (channelScope === 'web') {
        if (selectedSource === 'all') {
          matchScope = isWebSource(t.SourceName);
        } else {
          matchScope = t.SourceName === selectedSource;
        }
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
      const matchService = selectedService === 'all' || serviceName.toLowerCase().includes(selectedService.toLowerCase());

      // Filter by date matching any relevant ticket date
      const matchDate = ticketMatchesDate(t, dateFrom, dateTo);

      return matchSearch && matchScope && matchStatus && matchService && matchDate;
    });
  }, [tickets, searchTerm, channelScope, selectedSource, selectedStatus, selectedService, dateFrom, dateTo]);

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

    const booked = kpiTickets.filter((t) => 
      (t.IsBook && t.IsBook > 0) || 
      (t.AppDateFrom && !t.AppDateFrom.startsWith('1900')) || 
      (t.StatusName && t.StatusName.toLowerCase().includes('lịch hẹn'))
    ).length;
    const hasGclid = kpiTickets.filter((t) => t.Gclid && t.Gclid.length > 5).length;
    const isNew = kpiTickets.filter((t) => t.StatusName && t.StatusName.toLowerCase().includes('mới')).length;
    const arrived = kpiTickets.filter((t) => 
      (t.StatusName && t.StatusName.toLowerCase().includes('đến')) ||
      (t.ExecuteStatus && t.ExecuteStatus.toLowerCase().includes('đến')) ||
      (t.TypeStatusScheduleID !== undefined && [2, 3, 4].includes(t.TypeStatusScheduleID))
    ).length;

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
    const headers = ['Mã Ticket', 'Khách hàng', 'SĐT', 'Nguồn', 'Dịch vụ', 'Trạng thái', 'Chi nhánh', 'Thời gian hẹn', 'GCLID Google Ads', 'Nội dung tư vấn', 'Ngày tạo'];
    const rows = filteredTickets.map((t) => [
      t.TicketID,
      `"${(t.TicketName || '').replace(/"/g, '""')}"`,
      `"${t.Phone || ''}"`,
      `"${(t.SourceName || '').replace(/"/g, '""')}"`,
      `"${(getTicketService(t) || '').replace(/"/g, '""')}"`,
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
                  {sessionStatus.authExpired ? (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Cần Cập Nhật cURL
                    </span>
                  ) : (
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live API Connected
                    </span>
                  )}
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

      {/* 24/7 Auto-Sync Connected Banner */}
      {sessionStatus.isValid && !sessionStatus.authExpired && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-900/50 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4 text-emerald-200 text-xs shadow-lg shadow-emerald-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <span>🟢 Tự động đồng bộ số liệu CRM 24/7 (Đang hoạt động)</span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Tài khoản: {sessionStatus.username || 'VanDuc'}
                </span>
              </div>
              <div className="text-xs text-emerald-300/85 mt-0.5 max-w-3xl leading-relaxed">
                Hệ thống tự động đăng nhập ngầm và quét vé CRM Nha Khoa Tâm Đức định kỳ mỗi 8 phút. Bạn có thể mở web xem bất kỳ lúc nào mà không cần nhập lại mật khẩu hay dán cURL thủ công.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setConfigTab('account');
                setIsConfigOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span>Quản Lý Tài Khoản</span>
            </button>
            <button
              onClick={handleAccountLogin}
              disabled={accountLoggingIn}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${accountLoggingIn ? 'animate-spin' : ''}`} />
              <span>{accountLoggingIn ? 'Đang xác thực...' : 'Làm Mới Phiên Ngay'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Auth Expired Warning Banner */}
      {sessionStatus.authExpired && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-4 text-amber-200 shadow-lg shadow-amber-950/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm flex items-center gap-2">
                <span>⚠️ Phiên kết nối VTTech CRM cần kích hoạt lại</span>
              </div>
              <div className="text-xs text-amber-300/85 mt-0.5 max-w-3xl leading-relaxed">
                Máy chủ VTTech (<code className="text-amber-200">nktamduc.vttechsolution.com</code>) yêu cầu làm mới phiên. Bấm nút <strong>"Đăng Nhập Lại Tự Động"</strong> bên cạnh để máy chủ tự động xác thực lại bằng tài khoản <strong>VanDuc</strong> ngay lập tức.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleAccountLogin}
              disabled={accountLoggingIn}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${accountLoggingIn ? 'animate-spin' : ''}`} />
              <span>{accountLoggingIn ? 'Đang Đăng Nhập...' : 'Đăng Nhập Lại Tự Động'}</span>
            </button>
            <button
              onClick={() => {
                setConfigTab('curl');
                setIsConfigOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-400" />
              <span>Dán cURL</span>
            </button>
          </div>
        </div>
      )}

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
            <span>Kênh Website ({scopeCounts.web.toLocaleString()})</span>
          </button>

          {/* Tab 2: Toàn Bộ Marketing */}
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
            <span>Toàn Bộ CRM ({scopeCounts.all.toLocaleString()})</span>
          </button>

          {/* Tab 3: Google Ads GCLID */}
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
            <span>Google Ads ({scopeCounts.gclid.toLocaleString()})</span>
          </button>
        </div>

        {/* Current mode badge */}
        <div className="flex items-center gap-2 text-xs text-slate-400 px-3 py-1.5 bg-slate-950/60 rounded-xl border border-slate-800 shrink-0">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              channelScope === 'web'
                ? 'bg-emerald-400'
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
                : channelScope === 'all'
                ? 'Toàn bộ kênh Marketing'
                : 'Vé có GCLID Google Ads'}
            </strong>
          </span>
        </div>
      </div>

      {/* Global CRM Data Reference Strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex flex-wrap items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1.5 font-semibold text-white">
            <Database className="w-3.5 h-3.5 text-orange-400" />
            Tổng Dữ Liệu CRM: <strong className="text-orange-400 font-bold">{allTimeStats.total.toLocaleString()} Ticket</strong>
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300">
            Kênh Website: <strong className="text-emerald-400 font-semibold">{allTimeStats.web.toLocaleString()}</strong> ({allTimeStats.onlineWeb.toLocaleString()} OL WB + {allTimeStats.hotlineWeb.toLocaleString()} HL WB)
          </span>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <span className="text-slate-300">
            Đã đặt hẹn: <strong className="text-emerald-400 font-semibold">{allTimeStats.booked.toLocaleString()}</strong>
          </span>
          <span className="text-slate-600 hidden md:inline">•</span>
          <span className="text-slate-300 hidden md:inline">
            Đã đến khám: <strong className="text-purple-400 font-semibold">{allTimeStats.arrived.toLocaleString()}</strong>
          </span>
          <span className="text-slate-600 hidden lg:inline">•</span>
          <span className="text-slate-300 hidden lg:inline">
            Google Ads GCLID: <strong className="text-amber-400 font-semibold">{allTimeStats.gclid.toLocaleString()}</strong>
          </span>
        </div>

        {(!dateFrom && !dateTo) ? (
          <span className="text-[11px] text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Đang hiển thị toàn thời gian ({allTimeStats.total.toLocaleString()} vé)
          </span>
        ) : (
          <button
            type="button"
            onClick={setAllTime}
            className="text-[11px] text-orange-400 hover:text-orange-300 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>Bấm xem toàn bộ {allTimeStats.total.toLocaleString()} vé CRM</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Tổng Ticket */}
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
          title="Bấm để xem toàn bộ danh sách ticket"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold text-emerald-300 group-hover:text-emerald-200 transition-colors truncate max-w-[140px]">
              {channelScope === 'web'
                ? 'Tổng Ticket Web'
                : channelScope === 'gclid'
                ? 'Tổng Ticket Google Ads'
                : 'Tổng Ticket CRM'}
            </span>
            <Ticket className="w-4 h-4 text-emerald-400 shrink-0 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-white flex items-baseline gap-2">
            <span>{kpis.total.toLocaleString()}</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 truncate">
            {selectedSource !== 'all'
              ? `Đang lọc: ${selectedSource}`
              : channelScope === 'web'
              ? `${kpis.onlineWeb.toLocaleString()} OL WB • ${kpis.hotlineWeb.toLocaleString()} HL WB`
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
          <div className="text-[11px] text-emerald-400/90 mt-1 font-medium">
            Tỷ lệ đặt: {kpis.bookedRate}%
          </div>
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
              : channelScope === 'web'
              ? 'Đến khám từ Website'
              : 'Tại các cơ sở Tâm Đức'}
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
              : channelScope === 'web'
              ? 'GCLID từ Website'
              : 'Có mã đối soát chuyển đổi'}
          </div>
        </div>
      </div>

      {/* Content View: Either Daily Report OR Ticket Table */}
      {mainViewMode === 'daily_report' ? (
        <div className="space-y-6">
          {/* Daily Report KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Số Ngày Ghi Nhận Vé</span>
              <div className="text-2xl font-bold text-white flex items-baseline gap-2">
                <span>{dailySummaries.length}</span>
                <span className="text-xs text-slate-400 font-normal">ngày</span>
              </div>
              <p className="text-[11px] text-slate-500">Toàn bộ chu kỳ lưu trữ trong CRM</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Ngày Cao Điểm Nhất</span>
              <div className="text-2xl font-bold text-orange-400 flex items-baseline gap-2">
                <span>{dailySummaries.length > 0 ? Math.max(...dailySummaries.map((d) => d.total)) : 0}</span>
                <span className="text-xs text-slate-400 font-normal">ticket</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {dailySummaries.length > 0
                  ? `Ngày ${dailySummaries.reduce((prev, curr) => (curr.total > prev.total ? curr : prev), dailySummaries[0]).formattedDate}`
                  : '—'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Trung Bình Ticket / Ngày</span>
              <div className="text-2xl font-bold text-emerald-400 flex items-baseline gap-2">
                <span>
                  {dailySummaries.length > 0
                    ? Math.round(dailySummaries.reduce((sum, d) => sum + d.total, 0) / dailySummaries.length)
                    : 0}
                </span>
                <span className="text-xs text-slate-400 font-normal">ticket/ngày</span>
              </div>
              <p className="text-[11px] text-slate-500">Theo phạm vi kênh hiện tại</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-medium">Tỷ Lệ Đặt Hẹn Bình Quân</span>
              <div className="text-2xl font-bold text-teal-400 flex items-baseline gap-2">
                <span>
                  {dailySummaries.length > 0
                    ? Math.round(
                        (dailySummaries.reduce((sum, d) => sum + d.booked, 0) /
                          Math.max(1, dailySummaries.reduce((sum, d) => sum + d.total, 0))) *
                          100
                      )
                    : 0}%
                </span>
                <span className="text-xs text-slate-400 font-normal">đã đặt hẹn</span>
              </div>
              <p className="text-[11px] text-slate-500">Trên tổng lượng khách tiếp nhận</p>
            </div>
          </div>

          {/* Visual Trend Chart: 14 ngày gần nhất */}
          {dailySummaries.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-orange-400" />
                    <span>Biểu Đồ Lượng Ticket 14 Ngày Gần Nhất</span>
                  </h3>
                  <p className="text-xs text-slate-400">Bấm vào cột của bất kỳ ngày nào để xem danh sách chi tiết các vé</p>
                </div>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className="w-3 h-3 rounded bg-emerald-500 inline-block" />
                    Kênh Website (OL WB + HL WB)
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-3 rounded bg-slate-700 inline-block" />
                    Kênh Khác
                  </span>
                </div>
              </div>

              {/* Chart Bars */}
              <div className="pt-6 pb-2 overflow-x-auto">
                <div className="flex items-end gap-2 sm:gap-3 min-w-[650px] h-48 border-b border-slate-800 pb-2">
                  {(() => {
                    const recentDays = [...dailySummaries].slice(0, 14).reverse();
                    const maxTotal = Math.max(...recentDays.map((d) => d.total), 1);

                    return recentDays.map((d) => {
                      const heightPercent = Math.max(12, Math.round((d.total / maxTotal) * 100));
                      const webPercent = d.total > 0 ? Math.round((d.webTotal / d.total) * 100) : 0;
                      const isToday = d.date === getVietnamTodayStr();
                      const isYesterday = d.date === getYesterdayStr();

                      return (
                        <div
                          key={d.date}
                          onClick={() => {
                            setPresetSpecificDay(d.date);
                            setMainViewMode('tickets');
                          }}
                          className="flex-1 flex flex-col items-center gap-1.5 group cursor-pointer"
                          title={`Ngày ${d.formattedDate}: ${d.total} vé (${d.webTotal} web, ${d.booked} hẹn). Bấm để xem.`}
                        >
                          <span className="text-[10px] font-bold text-slate-300 group-hover:text-orange-400 transition-colors">
                            {d.total}
                          </span>

                          <div
                            className="w-full bg-slate-800/80 rounded-t-lg overflow-hidden flex flex-col justify-end transition-all group-hover:ring-2 group-hover:ring-orange-400/50"
                            style={{ height: `${heightPercent}%` }}
                          >
                            {/* Web portion */}
                            <div
                              className="w-full bg-emerald-500 group-hover:bg-emerald-400 transition-colors"
                              style={{ height: `${webPercent}%` }}
                            />
                            {/* Other portion */}
                            <div
                              className="w-full bg-slate-700 group-hover:bg-slate-600 transition-colors"
                              style={{ height: `${100 - webPercent}%` }}
                            />
                          </div>

                          <div className="text-center">
                            <span
                              className={`block text-[10px] font-semibold ${
                                isToday ? 'text-emerald-400' : isYesterday ? 'text-amber-400' : 'text-slate-400'
                              }`}
                            >
                              {d.formattedDate.slice(0, 5)}
                            </span>
                            <span className="block text-[9px] text-slate-500">
                              {d.dayOfWeek.replace('Thứ ', 'T')}
                            </span>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Daily Table */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-white text-base">Bảng Tổng Hợp Chi Tiết Từng Ngày</h3>
                <p className="text-xs text-slate-400">
                  Thống kê đầy đủ số lượng tiếp nhận, kênh Website, tỷ lệ đặt lịch hẹn và tỷ lệ đến khám từng ngày
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMainViewMode('tickets')}
                className="px-3.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Ticket className="w-3.5 h-3.5" />
                <span>Xem Danh Sách Vé</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950/90 text-xs uppercase text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Ngày</th>
                    <th className="px-4 py-3.5">Thứ</th>
                    <th className="px-4 py-3.5 text-center">Tổng Ticket</th>
                    <th className="px-4 py-3.5">Kênh Website</th>
                    <th className="px-4 py-3.5">Đã Đặt Lịch Hẹn</th>
                    <th className="px-4 py-3.5">Đã Đến Khám</th>
                    <th className="px-4 py-3.5 text-center">Google Ads (GCLID)</th>
                    <th className="px-4 py-3.5 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {dailySummaries.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                        Chưa có dữ liệu thống kê theo ngày.
                      </td>
                    </tr>
                  )}

                  {dailySummaries.map((day) => {
                    const isToday = day.date === getVietnamTodayStr();
                    const isYesterday = day.date === getYesterdayStr();

                    return (
                      <tr
                        key={day.date}
                        className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                        onClick={() => {
                          setPresetSpecificDay(day.date);
                          setMainViewMode('tickets');
                        }}
                      >
                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{day.formattedDate}</span>
                            {isToday && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                                Hôm nay
                              </span>
                            )}
                            {isYesterday && (
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                                Hôm qua
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 text-xs">
                          {day.dayOfWeek}
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <span className="font-bold text-base text-white">{day.total}</span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-emerald-400">{day.webTotal} vé</span>
                              <span className="text-[11px] text-slate-500">
                                ({day.total > 0 ? Math.round((day.webTotal / day.total) * 100) : 0}%)
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              OL: <strong className="text-slate-200">{day.onlineWeb}</strong> | HL: <strong className="text-slate-200">{day.hotlineWeb}</strong>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-teal-300">{day.booked}</span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] bg-teal-500/10 text-teal-400 border border-teal-500/20 font-medium">
                              {day.bookedRate}%
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-emerald-300">{day.arrived}</span>
                            <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              {day.arrivedRate}% hẹn
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-center">
                          <span className={`font-mono text-xs font-semibold ${day.gclidCount > 0 ? 'text-amber-400' : 'text-slate-600'}`}>
                            {day.gclidCount}
                          </span>
                        </td>

                        <td className="px-4 py-3.5 whitespace-nowrap text-right">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPresetSpecificDay(day.date);
                              setMainViewMode('tickets');
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-orange-600 hover:text-white text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                          >
                            <span>Xem {day.total} vé</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <>
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
              <option value="all">
                {channelScope === 'web'
                  ? 'Tất cả Nguồn Web (OL WB + HL WB)'
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

          {/* Filter Service */}
          <div className="w-full md:w-52">
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">Tất cả Dịch Vụ</option>
              {VTTECH_SERVICES.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div className="w-full md:w-52">
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
            {channelScope === 'web' ? 'Nguồn Kênh Web:' : 'Nguồn CRM:'}
          </span>
          <button
            onClick={() => setSelectedSource('all')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedSource === 'all'
                ? channelScope === 'web'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'bg-orange-500 text-white shadow-md shadow-orange-500/30'
                : 'bg-slate-950/70 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {channelScope === 'web' ? 'Tất cả Web' : 'Tất cả'}
          </button>
          {scopedAvailableSources.map((src) => {
            const isSelected = selectedSource === src;
            return (
              <button
                key={src}
                onClick={() => setSelectedSource(isSelected ? 'all' : src)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? channelScope === 'web'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-600/30'
                      : 'bg-orange-600 text-white border-orange-500 shadow-md shadow-orange-600/30'
                    : getSourceBadgeColor(src)
                }`}
              >
                <span>{src}</span>
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

            {(searchTerm || selectedSource !== 'all' || selectedStatus !== 'all' || selectedService !== 'all' || dateFrom || dateTo) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSource('all');
                  setSelectedStatus('all');
                  setSelectedService('all');
                  setAllTime();
                }}
                className="text-orange-400 hover:underline ml-1 text-xs"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Day Navigation Stepper */}
            <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={goToPrevDay}
                title="Lùi 1 ngày"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 px-2.5 text-xs font-semibold text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-orange-400" />
                <span>
                  {dateFrom && dateFrom === dateTo
                    ? `${dateFrom.split('-').reverse().join('/')} (${getDayOfWeekVN(dateFrom)})`
                    : dateFrom || dateTo
                    ? `${dateFrom ? dateFrom.split('-').reverse().join('/') : '...'} - ${dateTo ? dateTo.split('-').reverse().join('/') : 'nay'}`
                    : 'Toàn thời gian'}
                </span>
              </div>

              <button
                type="button"
                onClick={goToNextDay}
                title="Tiến 1 ngày"
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="inline-flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                type="button"
                onClick={setPresetToday}
                className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  dateFrom === dateTo && dateFrom === getVietnamTodayStr()
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Xem vé ngày hôm nay"
              >
                Hôm nay ({channelScope === 'web' ? todayWebCount : channelScope === 'gclid' ? tickets.filter(t => t.Gclid && t.Gclid.length > 5 && ticketMatchesDate(t, getVietnamTodayStr(), getVietnamTodayStr())).length : todayTicketCount})
              </button>
              <button
                type="button"
                onClick={setPresetYesterday}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  dateFrom === dateTo && dateFrom === getYesterdayStr()
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Xem vé ngày hôm qua"
              >
                Hôm qua ({channelScope === 'web' ? yesterdayWebCount : channelScope === 'gclid' ? tickets.filter(t => t.Gclid && t.Gclid.length > 5 && ticketMatchesDate(t, getYesterdayStr(), getYesterdayStr())).length : yesterdayTicketCount})
              </button>
              <button
                type="button"
                onClick={setPresetLast7Days}
                className="px-2 py-1 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                7 ngày
              </button>
              <button
                type="button"
                onClick={setPresetThisMonth}
                className="px-2 py-1 rounded-md font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                Tháng này
              </button>
              <button
                type="button"
                onClick={setPresetYear2026}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  dateFrom === '2026-01-01'
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'text-amber-400 hover:text-amber-300 font-semibold'
                }`}
                title="Xem toàn bộ dữ liệu năm 2026 (từ 01/01/2026)"
              >
                Năm 2026
              </button>
              <button
                type="button"
                onClick={setAllTime}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  !dateFrom && !dateTo
                    ? 'bg-orange-600 text-white shadow-sm font-bold'
                    : 'text-emerald-400 hover:text-emerald-300 font-semibold'
                }`}
                title="Xem toàn bộ dữ liệu CRM"
              >
                Toàn bộ ({channelScope === 'web' ? allTimeStats.web.toLocaleString() : channelScope === 'gclid' ? allTimeStats.gclid.toLocaleString() : tickets.length.toLocaleString()})
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
                  className="text-slate-400 hover:text-white px-1 text-xs font-bold cursor-pointer"
                >
                  &times;
                </button>
              )}
            </div>

            <button
              onClick={() => handleSync()}
              disabled={syncing}
              title={!dateFrom && !dateTo ? 'Tải lại toàn bộ dữ liệu từ VTTech' : 'Tải lại danh sách theo ngày đã chọn'}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-600/90 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg font-medium text-xs shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>{!dateFrom && !dateTo ? 'Tải lại' : 'Tải ngày này'}</span>
            </button>

            <button
              onClick={handleSyncAll2026}
              disabled={syncing}
              title="Kéo toàn bộ vé năm 2026 (từ 01/01/2026 đến nay) từ VTTech CRM"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
              <span>Lấy hết dữ liệu 2026</span>
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
                <th className="px-4 py-3.5">Dịch Vụ</th>
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
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin text-orange-400" />
                      <span>Đang tải danh sách vé VTTech...</span>
                    </div>
                  </td>
                </tr>
              )}

              {!loading && filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-slate-500">
                    <div className="max-w-xl mx-auto space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                        <Calendar className="w-7 h-7" />
                      </div>

                      <div>
                        <p className="text-slate-100 font-bold text-base sm:text-lg">
                          Chưa có ticket nào phù hợp với bộ lọc hiện tại
                        </p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-lg mx-auto">
                          Hệ thống CRM đang quản lý {tickets.length.toLocaleString()} ticket ({allTimeStats.web.toLocaleString()} vé Web). Bấm nút bên dưới để xem toàn bộ hoặc tải lại dữ liệu.
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={setPresetToday}
                          className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-lg shadow-orange-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Xem Hôm Nay ({todayTicketCount} vé)</span>
                        </button>
                        <button
                          type="button"
                          onClick={setPresetYesterday}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-amber-400" />
                          <span>Xem Hôm Qua ({yesterdayTicketCount} vé - {yesterdayWebCount} vé Web)</span>
                        </button>
                        <button
                          type="button"
                          onClick={setAllTime}
                          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer inline-flex items-center gap-2"
                        >
                          <Ticket className="w-4 h-4" />
                          <span>Xem Toàn Bộ CRM ({tickets.length.toLocaleString()} vé)</span>
                        </button>
                      </div>

                      {/* Quick preview of latest available tickets */}
                      {tickets.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-800/80 text-left">
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                            <span className="font-semibold text-slate-300">
                              Vé mới nhất ghi nhận trong hệ thống CRM:
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {tickets.slice(0, 3).map((t, idx) => (
                              <div
                                key={`empty-preview-${t.TicketID}-${idx}`}
                                onClick={() => setSelectedTicket(t)}
                                className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono font-bold text-orange-400 shrink-0">#{t.TicketID}</span>
                                  <span className="font-semibold text-white truncate">{t.TicketName || 'Khách hàng'}</span>
                                  <span className={`px-2 py-0.5 rounded text-[10px] border ${getSourceBadgeColor(t.SourceName)} shrink-0`}>
                                    {t.SourceName || 'Trực tiếp'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 shrink-0 text-slate-400 font-mono text-[11px]">
                                  <span>{formatTicketDateTime(t.Created)}</span>
                                  <Eye className="w-3.5 h-3.5 text-slate-500 hover:text-white" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
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

                      {/* Service (Dịch vụ) */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {(() => {
                          const svc = getTicketService(t);
                          if (svc !== '—') {
                            return (
                              <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${getServiceBadgeColor(svc)}`}>
                                {svc}
                              </span>
                            );
                          }
                          return <span className="text-xs text-slate-500 italic">Chưa xác định</span>;
                        })()}
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
      </>
      )}

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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Số Điện Thoại</span>
                  <div className="font-mono text-sm font-semibold text-white">{selectedTicket.Phone || 'Không có'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Nguồn Khách Hàng</span>
                  <div className="text-sm font-semibold text-blue-400">{selectedTicket.SourceName || 'OL-HL'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Dịch Vụ Quan Tâm</span>
                  <div className="text-sm font-semibold text-purple-300">
                    {getTicketService(selectedTicket) !== '—' ? getTicketService(selectedTicket) : 'Chưa xác định'}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                  <span className="text-xs text-slate-500">Trạng Thái Ticket</span>
                  <div className="text-sm font-semibold text-orange-400">{selectedTicket.StatusName || 'Dữ Liệu Mới'}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1 sm:col-span-2">
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
            <div className="flex border-b border-slate-800 bg-slate-950/50 px-6 pt-3 gap-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setConfigTab('account')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  configTab === 'account'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                🤖 Tự Động Đăng Nhập CRM (24/7)
              </button>
              <button
                type="button"
                onClick={() => setConfigTab('curl')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  configTab === 'curl'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Dán cURL
              </button>
              <button
                type="button"
                onClick={() => setConfigTab('json')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  configTab === 'json'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                📋 Dán JSON Dữ Liệu Vé
              </button>
              <button
                type="button"
                onClick={() => setConfigTab('manual')}
                className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  configTab === 'manual'
                    ? 'border-orange-500 text-orange-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Nhập Thủ Công
              </button>
            </div>

            {configTab === 'account' ? (
              <div className="p-6 space-y-4">
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3.5 space-y-2 text-xs text-emerald-200">
                  <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Tự Động Kéo Dữ Liệu Mỗi Ngày (Không Cần Thao Tác Lại):</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed text-[11px]">
                    Hệ thống lưu trữ tài khoản của bạn, tự động thực hiện đăng nhập ngầm với máy chủ CRM (<code className="text-emerald-300">nktamduc.vttechsolution.com</code>), trích xuất SecretKey và Cookie xác thực, tự động phục hồi phiên khi hết hạn và quét vé định kỳ mỗi 8 phút.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-orange-400" />
                      <span>Tên Đăng Nhập CRM VTTech:</span>
                    </label>
                    <input
                      type="text"
                      value={accountUsername}
                      onChange={(e) => setAccountUsername(e.target.value)}
                      placeholder="VD: VanDuc"
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-medium text-slate-100 focus:outline-none focus:border-orange-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-orange-400" />
                      <span>Mật Khẩu CRM:</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={accountPassword}
                        onChange={(e) => setAccountPassword(e.target.value)}
                        placeholder="Mật khẩu đăng nhập CRM..."
                        className="w-full p-2.5 pr-10 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>Chế độ tự động đăng nhập & đồng bộ vé ngầm: <strong className="text-emerald-400">ĐANG BẬT (24/7)</strong></span>
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
                    disabled={accountLoggingIn || !accountUsername.trim() || !accountPassword.trim()}
                    onClick={handleAccountLogin}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 text-white text-sm font-bold shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 ${accountLoggingIn ? 'animate-spin' : ''}`} />
                    <span>{accountLoggingIn ? 'Đang kết nối CRM...' : 'Đăng Nhập & Đồng Bộ Dữ Liệu Ngay'}</span>
                  </button>
                </div>
              </div>
            ) : configTab === 'curl' ? (
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
            ) : configTab === 'json' ? (
              <div className="p-6 space-y-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
                  <div className="font-semibold text-sky-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Dán dữ liệu vé JSON trực tiếp (Dành cho trường hợp phiên đăng nhập hết hạn):</span>
                  </div>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    Từ tab Network (F12) trên trình duyệt, chọn request <code className="text-sky-300">LoadList</code> &rarr; tab <strong>Response</strong> &rarr; copy toàn bộ nội dung JSON và dán vào ô bên dưới.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium flex items-center justify-between">
                    <span>Chuỗi JSON danh sách vé:</span>
                    <span className="text-[11px] text-slate-500">Mảng JSON hoặc đối tượng {'{ data: [...] }'}</span>
                  </label>
                  <textarea
                    rows={6}
                    value={jsonTicketsInput}
                    onChange={(e) => setJsonTicketsInput(e.target.value)}
                    placeholder='[ { "TicketID": 543688, "TicketName": "NGUYỄN VĂN HẢI", "SourceName": "OL WB", ... } ]'
                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
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
                    disabled={jsonLoading || !jsonTicketsInput.trim()}
                    onClick={handleImportJson}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-sm font-semibold shadow-lg shadow-sky-600/30 transition-all"
                  >
                    <Download className={`w-4 h-4 ${jsonLoading ? 'animate-spin' : ''}`} />
                    <span>{jsonLoading ? 'Đang nạp...' : 'Nạp Vé Vào Hệ Thống'}</span>
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
