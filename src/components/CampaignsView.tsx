import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Megaphone, Play, Pause, TrendingUp, DollarSign, Target, CheckCircle, 
  Zap, ShieldCheck, RefreshCw, Filter, Search, ExternalLink, Link2, 
  Sparkles, Check, AlertCircle, ArrowUpRight, BarChart3, Eye, MousePointerClick,
  Calendar, Table, LineChart, ChevronLeft, ChevronRight, ChevronDown, Download, CalendarRange,
  Percent, CircleDot, ArrowUpDown, Sliders, Edit3, Save, X, SlidersHorizontal
} from 'lucide-react';
import { DisplayUnit } from '../types';
import { GoogleAdsConnectModal } from './GoogleAdsConnectModal';
import { CampaignAiAnalystModal } from './CampaignAiAnalystModal';
import { CampaignAi7DayAnalysis } from './CampaignAi7DayAnalysis';
import { 
  fetchCampaignsSheet, 
  CampaignItem, 
  DailyCampaignRecord,
  DEFAULT_CAMPAIGNS_SHEET_URL, 
  DEFAULT_CAMPAIGNS, 
  generateMockDailyRecords,
  formatVND,
  normalizeDate
} from '../services/campaignsSheetService';

interface CampaignsViewProps {
  displayUnit: DisplayUnit;
  userRole?: 'admin' | 'staff' | null;
}

type DatePreset = 'all' | 'today' | 'yesterday' | 'last7days' | 'last30days' | 'thisMonth' | 'lastMonth' | 'custom';

export const CampaignsView: React.FC<CampaignsViewProps> = ({ displayUnit, userRole = 'admin' }) => {
  const isAdmin = userRole !== 'staff';
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiFocusCampaign, setAiFocusCampaign] = useState<CampaignItem | null>(null);
  
  // Campaign Quick Edit Modal State
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    status: 'Đang chạy',
    budget: '1.000.000 đ',
    maxCpc: '25.000 đ',
    targetCpa: '250.000 đ',
    biddingStrategy: 'Tối đa hóa lượt chuyển đổi (Target CPA)',
    negativeKeywords: '',
    notes: '',
  });
  const [editSaveSuccess, setEditSaveSuccess] = useState(false);

  const [sheetUrl, setSheetUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('gads_campaigns_sheet_url') || DEFAULT_CAMPAIGNS_SHEET_URL;
    } catch {
      return DEFAULT_CAMPAIGNS_SHEET_URL;
    }
  });

  const [viewMode, setViewMode] = useState<'campaigns' | 'daily'>('campaigns');
  
  // Date filter state
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  const [campaigns, setCampaigns] = useState<CampaignItem[]>(DEFAULT_CAMPAIGNS);
  const [dailyRecords, setDailyRecords] = useState<DailyCampaignRecord[]>(generateMockDailyRecords());
  const [searchTerms, setSearchTerms] = useState<any[]>([]);
  const [keywords, setKeywords] = useState<any[]>([]);
  const [hourlyData, setHourlyData] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'enabled' | 'paused'>('enabled');
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState(sheetUrl);

  // Pagination for daily logs
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  const enabledCount = useMemo(() => campaigns.filter((c) => c.status === 'Đang chạy').length, [campaigns]);
  const pausedCount = useMemo(() => campaigns.filter((c) => c.status !== 'Đang chạy').length, [campaigns]);
  const totalCount = campaigns.length;

  const loadData = useCallback(async (urlToFetch: string = sheetUrl) => {
    setIsLoading(true);
    try {
      const result = await fetchCampaignsSheet(urlToFetch);
      if (result.campaigns && result.campaigns.length > 0) {
        setCampaigns(result.campaigns);
        const activeCount = result.campaigns.filter((c) => c.status === 'Đang chạy').length || result.campaigns.length;
        try {
          localStorage.setItem('gads_active_campaigns_count', String(activeCount));
          window.dispatchEvent(new Event('campaigns_updated'));
        } catch {
          // ignore
        }
      }
      if (result.dailyRecords && result.dailyRecords.length > 0) {
        setDailyRecords(result.dailyRecords);
      }
      if (result.searchTerms && result.searchTerms.length > 0) {
        setSearchTerms(result.searchTerms);
      }
      if (result.keywords && result.keywords.length > 0) {
        setKeywords(result.keywords);
      }
      if (result.hourlyData && result.hourlyData.length > 0) {
        setHourlyData(result.hourlyData);
      }
      if (result.locationData && result.locationData.length > 0) {
        setLocationData(result.locationData);
      }
      setIsLive(result.isLive);
      setLastUpdated(result.lastUpdated);
    } catch (e) {
      console.error('Failed to fetch campaigns:', e);
    } finally {
      setIsLoading(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    loadData(sheetUrl);
  }, [sheetUrl, loadData]);

  const handleSaveSheetUrl = () => {
    const trimmed = tempUrl.trim();
    if (!trimmed) return;
    setSheetUrl(trimmed);
    try {
      localStorage.setItem('gads_campaigns_sheet_url', trimmed);
    } catch {
      // ignore
    }
    setIsUrlModalOpen(false);
    loadData(trimmed);
  };

  // Open Quick Edit Modal for Campaign (or via name from AI analysis / alerts)
  const handleOpenEditModal = useCallback((campaignNameOrItem: string | CampaignItem) => {
    if (!isAdmin) return;
    let target: CampaignItem | undefined;
    if (typeof campaignNameOrItem === 'string') {
      const q = campaignNameOrItem.trim().toLowerCase();
      target = campaigns.find(c => c.name.toLowerCase() === q) ||
               campaigns.find(c => c.name.toLowerCase().includes(q) || q.includes(c.name.toLowerCase())) ||
               campaigns[0];
    } else {
      target = campaignNameOrItem;
    }
    if (target) {
      setEditingCampaign(target);
      setEditForm({
        status: target.status || 'Đang chạy',
        budget: target.budget || '1.000.000 đ',
        maxCpc: target.cpc || '25.000 đ',
        targetCpa: target.cpa || '250.000 đ',
        biddingStrategy: 'Tối đa hóa lượt chuyển đổi (Target CPA)',
        negativeKeywords: '',
        notes: '',
      });
      setEditSaveSuccess(false);
      setIsEditModalOpen(true);
    }
  }, [campaigns, isAdmin]);

  // Save changes to local state & session storage
  const handleSaveCampaignEdit = () => {
    if (!isAdmin || !editingCampaign) return;
    setCampaigns(prev => prev.map(c => {
      if (c.name === editingCampaign.name) {
        return {
          ...c,
          status: editForm.status,
          budget: editForm.budget,
          cpc: editForm.maxCpc,
          cpa: editForm.targetCpa,
        };
      }
      return c;
    }));
    setDailyRecords(prev => prev.map(r => {
      if (r.campaignName === editingCampaign.name) {
        return {
          ...r,
          status: editForm.status,
        };
      }
      return r;
    }));
    setEditSaveSuccess(true);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setEditSaveSuccess(false);
    }, 1000);
  };

  // Direct toggle campaign running/paused
  const handleToggleCampaignStatus = useCallback((campaignName: string) => {
    if (!isAdmin) return;
    setCampaigns(prev => prev.map(c => {
      if (c.name === campaignName) {
        const nextStatus = c.status === 'Đang chạy' ? 'Tạm dừng' : 'Đang chạy';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
    setDailyRecords(prev => prev.map(r => {
      if (r.campaignName === campaignName) {
        const nextStatus = r.status === 'Đang chạy' ? 'Tạm dừng' : 'Đang chạy';
        return { ...r, status: nextStatus };
      }
      return r;
    }));
  }, [isAdmin]);

  // Direct scroll and filter to Campaigns Table
  const handleNavigateToTable = useCallback((query?: string, status?: string) => {
    setViewMode('campaigns');
    if (query) {
      setSearchQuery(query);
    }
    if (status === 'all' || status === 'enabled' || status === 'paused') {
      setStatusFilter(status);
    }
    setTimeout(() => {
      const el = document.getElementById('campaigns-table-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 150);
  }, []);

  // Helper to format Date to YYYY-MM-DD
  const toInputDateStr = (d: Date): string => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Helper to normalize date string to Date object
  const parseRecordDate = (rec: DailyCampaignRecord): Date | null => {
    const { dateObj } = normalizeDate(rec.date || rec.dateFormatted);
    return dateObj;
  };

  // Apply preset quick filters
  const applyPreset = (preset: DatePreset) => {
    setDatePreset(preset);
    setSelectedMonth('all');
    setCurrentPage(1);

    const now = new Date();

    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === 'today') {
      const s = toInputDateStr(now);
      setStartDate(s);
      setEndDate(s);
    } else if (preset === 'yesterday') {
      const yd = new Date(now);
      yd.setDate(yd.getDate() - 1);
      const s = toInputDateStr(yd);
      setStartDate(s);
      setEndDate(s);
    } else if (preset === 'last7days') {
      // Standard Google Ads standard: Last 7 completed days ending yesterday
      const endD = new Date(now);
      endD.setDate(endD.getDate() - 1);
      const startD = new Date(endD);
      startD.setDate(startD.getDate() - 6);
      setStartDate(toInputDateStr(startD));
      setEndDate(toInputDateStr(endD));
    } else if (preset === 'last30days') {
      // Standard Google Ads standard: Last 30 completed days ending yesterday
      const endD = new Date(now);
      endD.setDate(endD.getDate() - 1);
      const startD = new Date(endD);
      startD.setDate(startD.getDate() - 29);
      setStartDate(toInputDateStr(startD));
      setEndDate(toInputDateStr(endD));
    } else if (preset === 'thisMonth') {
      // From 1st of this month up to yesterday (or today if 1st day of month)
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      const endD = new Date(now);
      if (now.getDate() > 1) {
        endD.setDate(endD.getDate() - 1);
      }
      setStartDate(toInputDateStr(firstDay));
      setEndDate(toInputDateStr(endD));
    } else if (preset === 'lastMonth') {
      const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
      setStartDate(toInputDateStr(firstDay));
      setEndDate(toInputDateStr(lastDay));
    }
  };

  // Extract all available months from daily records dynamically (auto-detects months 1..12 and years)
  const availableMonthsList = useMemo(() => {
    const map = new Map<string, { month: number; year: number; label: string }>();
    
    dailyRecords.forEach((rec) => {
      const { dateObj } = normalizeDate(rec.date || rec.dateFormatted);
      if (dateObj) {
        const m = dateObj.getMonth() + 1;
        const y = dateObj.getFullYear() || new Date().getFullYear();
        const key = `${y}-${m}`;
        if (!map.has(key)) {
          map.set(key, { month: m, year: y, label: `Tháng ${m}/${y}` });
        }
      }
    });

    if (map.size === 0) {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const fallbackList: Array<{ month: number; year: number; label: string }> = [];
      for (let m = currentMonth; m >= 1; m--) {
        fallbackList.push({ month: m, year: currentYear, label: `Tháng ${m}/${currentYear}` });
      }
      return fallbackList;
    }

    return Array.from(map.values()).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year;
      return b.month - a.month;
    });
  }, [dailyRecords]);

  // Filter daily records by custom date range, preset, month, and search query
  const filteredDailyRecords = useMemo(() => {
    return dailyRecords.filter((rec) => {
      const matchesSearch = rec.campaignName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            rec.dateFormatted.includes(searchQuery);

      if (!matchesSearch) return false;

      const { dateIso, dateObj } = normalizeDate(rec.date || rec.dateFormatted);

      // Month pill filtering
      if (selectedMonth !== 'all') {
        const m = dateObj.getMonth() + 1;
        if (m !== parseInt(selectedMonth, 10)) return false;
      }

      // Start Date & End Date filtering via direct ISO string comparisons (zero timezone drift)
      if (startDate) {
        if (dateIso < startDate) return false;
      }

      if (endDate) {
        if (dateIso > endDate) return false;
      }

      return true;
    });
  }, [dailyRecords, searchQuery, selectedMonth, startDate, endDate]);

  // Active campaigns running count (currently 59, automatically scales as new campaigns are added)
  const activeCampaignsCount = useMemo(() => {
    const activeOnly = campaigns.filter(
      (c) => c.status === 'Đang chạy' || !c.status.toLowerCase().includes('dừng')
    );
    return activeOnly.length > 0 ? activeOnly.length : campaigns.length;
  }, [campaigns]);

  // Paginated daily records
  const paginatedDaily = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredDailyRecords.slice(start, start + itemsPerPage);
  }, [filteredDailyRecords, currentPage]);

  const totalPages = Math.ceil(filteredDailyRecords.length / itemsPerPage) || 1;

  // Filtered campaigns for Campaign Mode - dynamically aggregated from filteredDailyRecords
  const filteredCampaigns = useMemo(() => {
    // Base map initialized with all campaigns to ensure no active campaign is lost
    const campMap = new Map<string, {
      name: string;
      type: string;
      status: string;
      spent: number;
      leads: number;
      clicks: number;
      impressions: number;
      budget?: string;
    }>();

    campaigns.forEach((c) => {
      campMap.set(c.name, {
        name: c.name,
        type: c.type,
        status: c.status,
        spent: 0,
        leads: 0,
        clicks: 0,
        impressions: 0,
        budget: c.budget,
      });
    });

    if (filteredDailyRecords.length > 0) {
      filteredDailyRecords.forEach((rec) => {
        if (!campMap.has(rec.campaignName)) {
          let type = 'Google Search';
          const lower = rec.campaignName.toLowerCase();
          if (lower.includes('pmax') || lower.includes('performance max')) type = 'PMax';
          else if (lower.includes('video') || lower.includes('youtube')) type = 'Youtube Video';
          else if (lower.includes('display') || lower.includes('gdn')) type = 'Google Display';
          else if (lower.includes('re') || lower.includes('remarketing')) type = 'Remarketing';

          campMap.set(rec.campaignName, {
            name: rec.campaignName,
            type,
            status: rec.status,
            spent: rec.spent,
            leads: rec.leads,
            clicks: rec.clicks,
            impressions: rec.impressions,
          });
        } else {
          const prev = campMap.get(rec.campaignName)!;
          prev.spent += rec.spent;
          prev.leads += rec.leads;
          prev.clicks += rec.clicks;
          prev.impressions += rec.impressions;
          if (rec.status === 'Đang chạy') {
            prev.status = 'Đang chạy';
          }
        }
      });
    }

    const list: CampaignItem[] = Array.from(campMap.values()).map((c, idx) => {
      const cpa = c.leads > 0 ? Math.round(c.spent / c.leads) : 0;
      const ctr = c.impressions > 0 ? `${((c.clicks / c.impressions) * 100).toFixed(2)}%` : '0.00%';
      const cpcNum = c.clicks > 0 ? Math.round(c.spent / c.clicks) : 0;
      const convRate = c.clicks > 0 ? `${((c.leads / c.clicks) * 100).toFixed(2)}%` : '0.00%';

      return {
        id: idx + 1,
        name: c.name,
        status: c.status,
        spent: `${c.spent.toLocaleString('vi-VN')} đ`,
        spentNum: c.spent,
        impressions: c.impressions,
        clicks: c.clicks,
        leads: `${Math.round(c.leads).toLocaleString('vi-VN')}`,
        leadsNum: c.leads,
        cpa: `${cpa.toLocaleString('vi-VN')} đ`,
        roas: '8.0x',
        ctr,
        cpc: `${cpcNum.toLocaleString('vi-VN')} đ`,
        cpcNum,
        convRate,
        type: c.type,
        budget: c.budget,
      };
    });

    return list.filter((camp) => {
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'enabled' ? camp.status === 'Đang chạy' :
        camp.status !== 'Đang chạy';

      const matchesSearch = camp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            camp.type.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || camp.type.toLowerCase().includes(selectedType.toLowerCase());

      return matchesStatus && matchesSearch && matchesType;
    });
  }, [filteredDailyRecords, campaigns, searchQuery, selectedType, statusFilter]);

  // Dynamic totals calculation based on filtered results
  const totalSpent = useMemo(() => {
    return filteredDailyRecords.reduce((s, d) => s + d.spent, 0);
  }, [filteredDailyRecords]);

  const totalConversions = useMemo(() => {
    return Math.round(filteredDailyRecords.reduce((s, d) => s + d.leads, 0));
  }, [filteredDailyRecords]);

  const totalClicks = useMemo(() => {
    return filteredDailyRecords.reduce((s, d) => s + d.clicks, 0);
  }, [filteredDailyRecords]);

  const totalImpressions = useMemo(() => {
    return filteredDailyRecords.reduce((s, d) => s + d.impressions, 0);
  }, [filteredDailyRecords]);

  const avgCpa = totalConversions > 0 ? Math.round(totalSpent / totalConversions) : 0;
  const avgCpc = totalClicks > 0 ? Math.round(totalSpent / totalClicks) : 0;
  const avgCtr = totalImpressions > 0 ? `${((totalClicks / totalImpressions) * 100).toFixed(2)}%` : '0.00%';
  const avgConvRate = totalClicks > 0 ? `${((totalConversions / totalClicks) * 100).toFixed(2)}%` : '0.00%';

  return (
    <div className="space-y-6 font-sans">
      {/* Google Ads Header Bar */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-emerald-400" /> {enabledCount} Chiến Dịch Đang Chạy (Enabled)
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">
              {pausedCount} Tạm Dừng
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> CID: 297-136-7807 (Tâm Đức Smile)
            </span>
            {isLive ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                Live Google Sheet ({dailyRecords.length.toLocaleString('vi-VN')} bản ghi)
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Dữ liệu mẫu
              </span>
            )}
          </div>
          <h2 className="text-2xl font-black text-white">Quản Lý & Hiệu Suất Chiến Dịch Google Ads</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2 flex-wrap">
            <span>Theo dõi chỉ số chi phí, lượt hiển thị, lượt nhấp, CTR, CPC trung bình và lượt chuyển đổi.</span>
            {lastUpdated && (
              <span className="text-xs text-slate-500">
                (Đồng bộ lúc: {lastUpdated.toLocaleTimeString('vi-VN')})
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => loadData(sheetUrl)}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Làm mới dữ liệu từ Google Sheet"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <button
            onClick={() => {
              setAiFocusCampaign(null);
              setIsAiModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-300" />
            <span>✨ AI Phân Tích & Tối Ưu Chiến Dịch</span>
          </button>

          {/* Admin-only Configuration Buttons */}
          {isAdmin && (
            <>
              <button
                onClick={() => {
                  setTempUrl(sheetUrl);
                  setIsUrlModalOpen(true);
                }}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                title="Đổi link Google Sheet"
              >
                <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Google Sheet URL</span>
              </button>

              <button
                onClick={() => setIsConnectModalOpen(true)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 shadow-lg shadow-cyan-500/20 border border-cyan-400/40 flex items-center gap-2 transition-all shrink-0 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Lấy Code Script Toàn Bộ Lịch Sử</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* DATE RANGE SELECTOR & FILTER TOOLBAR (Trực quan, dễ chọn ngày cụ thể) */}
      <div className="p-5 rounded-2xl bg-slate-900/95 border border-slate-800 shadow-xl space-y-4">
        {/* Top row: View Switcher & Quick Date Presets */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800 shrink-0">
            <button
              onClick={() => setViewMode('campaigns')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'campaigns'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>Bảng Chiến Dịch (Google Ads)</span>
            </button>
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'daily'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>
                {datePreset === 'all' && !startDate && !endDate && selectedMonth === 'all'
                  ? 'Chi Tiết Từng Dòng'
                  : `Chi Tiết Từng Ngày (${activeCampaignsCount} dòng)`}
              </span>
            </button>
          </div>

          {/* Quick Date Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mr-1">
              <CalendarRange className="w-3.5 h-3.5 text-cyan-400" />
              Khoảng Thời Gian:
            </span>
            {[
              { id: 'all', label: 'Tất Cả' },
              { id: 'today', label: 'Hôm Nay' },
              { id: 'yesterday', label: 'Hôm Qua' },
              { id: 'last7days', label: '7 Ngày Qua' },
              { id: 'last30days', label: '30 Ngày Qua' },
              { id: 'thisMonth', label: 'Tháng Này' },
              { id: 'lastMonth', label: 'Tháng Trước' },
            ].map((p) => {
              const isActive = (datePreset === p.id && selectedMonth === 'all') || (p.id === 'all' && datePreset === 'all' && !startDate && !endDate && selectedMonth === 'all');
              return (
                <button
                  key={p.id}
                  onClick={() => applyPreset(p.id as DatePreset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white font-bold shadow ring-1 ring-indigo-400'
                      : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/70'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom row: Custom Date Picker Inputs & Quick Month Tags */}
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
          {/* Specific Date Range Inputs (Chọn ngày cụ thể) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Chọn ngày cụ thể:
            </span>
            
            <div 
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                try {
                  input?.showPicker?.();
                } catch {
                  input?.focus();
                }
              }}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-cyan-500/60 transition-all cursor-pointer group"
            >
              <label className="text-[11px] text-slate-400 group-hover:text-cyan-300 font-medium cursor-pointer">Từ:</label>
              <input
                type="date"
                value={startDate}
                onClick={(e) => {
                  try {
                    (e.target as HTMLInputElement).showPicker?.();
                  } catch {}
                }}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDatePreset('custom');
                  setSelectedMonth('all');
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-cyan-300 font-mono focus:outline-none cursor-pointer [color-scheme:dark]"
              />
              <Calendar className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform cursor-pointer" />
            </div>

            <div 
              onClick={(e) => {
                const input = e.currentTarget.querySelector('input');
                try {
                  input?.showPicker?.();
                } catch {
                  input?.focus();
                }
              }}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700/80 hover:border-cyan-500/60 transition-all cursor-pointer group"
            >
              <label className="text-[11px] text-slate-400 group-hover:text-cyan-300 font-medium cursor-pointer">Đến:</label>
              <input
                type="date"
                value={endDate}
                onClick={(e) => {
                  try {
                    (e.target as HTMLInputElement).showPicker?.();
                  } catch {}
                }}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDatePreset('custom');
                  setSelectedMonth('all');
                  setCurrentPage(1);
                }}
                className="bg-transparent text-xs text-cyan-300 font-mono focus:outline-none cursor-pointer [color-scheme:dark]"
              />
              <Calendar className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform cursor-pointer" />
            </div>

            {(startDate || endDate || selectedMonth !== 'all') && (
              <button
                onClick={() => applyPreset('all')}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 border border-amber-500/30 transition-all hover:bg-amber-500/20"
              >
                ✕ Xóa bộ lọc ngày
              </button>
            )}
          </div>

          {/* Dropdown Lọc Theo Tháng */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="relative inline-flex items-center">
              <Calendar className="w-4 h-4 text-cyan-400 absolute left-3 pointer-events-none z-10" />
              <select
                id="select-month-filter"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setDatePreset('custom');
                  setStartDate('');
                  setEndDate('');
                  setCurrentPage(1);
                }}
                className="appearance-none bg-slate-950 text-xs font-bold text-slate-200 pl-9 pr-8 py-2 rounded-xl border border-slate-800 hover:border-indigo-500/50 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 cursor-pointer shadow-inner transition-all"
              >
                <option value="all" className="bg-slate-900 text-slate-300 py-1.5 font-medium">
                  Tất cả các tháng
                </option>
                {availableMonthsList.map((item) => (
                  <option key={`${item.year}-${item.month}`} value={String(item.month)} className="bg-slate-900 text-slate-100 py-1.5 font-bold">
                    {item.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 pointer-events-none z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* KPI METRIC CARDS (Formatted like Google Ads Overview) */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cost (Chi phí) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Chi Phí (Cost)</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white">
            {formatVND(totalSpent)}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Chi phí trung bình:</span>
            <span className="font-bold text-slate-200">{avgCpc.toLocaleString('vi-VN')} đ / click</span>
          </div>
        </div>

        {/* Metric 2: Conversions (Lượt chuyển đổi) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lượt Chuyển Đổi (Conversions)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">
            {totalConversions.toLocaleString('vi-VN')} <span className="text-sm font-semibold">chuyển đổi</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 font-medium">
            Tỷ lệ chuyển đổi: <strong className="text-emerald-300">{avgConvRate}</strong>
          </div>
        </div>

        {/* Metric 3: Cost / Conv. (Chi phí / Lượt chuyển đổi) */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Chi Phí / Lượt Chuyển Đổi (CPA)</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            {avgCpa.toLocaleString('vi-VN')} <span className="text-sm font-semibold">đ</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Chi phí tối ưu/chuyển đổi (số liệu tham khảo)
          </div>
        </div>

        {/* Metric 4: Clicks & CTR % */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>Lượt Nhấp & CTR (%)</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-300">
            {totalClicks.toLocaleString('vi-VN')} <span className="text-sm font-semibold">clicks</span>
          </div>
          <div className="text-[11px] text-purple-400 font-semibold">
            CTR: <span className="text-white font-bold">{avgCtr}</span> ({totalImpressions.toLocaleString('vi-VN')} hiển thị)
          </div>
        </div>
      </div>

      {/* 7-DAY AI AUTOMATIC ANALYSIS & RECOMMENDATIONS ENGINE */}
      <CampaignAi7DayAnalysis
        dailyRecords={dailyRecords}
        campaigns={campaigns}
        searchTerms={searchTerms}
        keywords={keywords}
        hourlyData={hourlyData}
        locationData={locationData}
        isAdmin={isAdmin}
        onApply7DayFilter={() => applyPreset('last7days')}
        onOpenDetailedAiModal={() => {
          setAiFocusCampaign(null);
          setIsAiModalOpen(true);
        }}
        onEditCampaign={(name) => handleOpenEditModal(name)}
        onNavigateToCampaignsTable={handleNavigateToTable}
        onToggleCampaignStatus={handleToggleCampaignStatus}
      />

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder={viewMode === 'daily' ? 'Tìm theo ngày (DD/MM/YYYY) hoặc chiến dịch...' : 'Tìm kiếm chiến dịch (Implant, Sứ...)'}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-all"
          />
        </div>

        {/* Status and Type Filter Pills for Campaign Mode */}
        {viewMode === 'campaigns' ? (
          <div className="flex items-center gap-3 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 flex-wrap sm:flex-nowrap">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'enabled', label: `Đang chạy (${enabledCount})` },
                { id: 'all', label: `Tất cả (${totalCount})` },
                { id: 'paused', label: `Tạm dừng (${pausedCount})` },
              ].map((st) => (
                <button
                  key={st.id}
                  onClick={() => setStatusFilter(st.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st.id
                      ? st.id === 'enabled'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : st.id === 'paused'
                        ? 'bg-amber-600 text-white shadow-md'
                        : 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Type Filter */}
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'Tất Cả Loại' },
                { id: 'search', label: 'Search' },
                { id: 'pmax', label: 'PMax' },
                { id: 'video', label: 'Video' },
                { id: 'display', label: 'Display' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedType(tab.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedType === tab.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <span>Đang hiển thị:</span>
            <span className="font-bold text-cyan-300">{filteredDailyRecords.length.toLocaleString('vi-VN')}</span>
            <span>ngày có số liệu</span>
          </div>
        )}
      </div>

      {/* GOOGLE ADS CAMPAIGN REPORTING TABLES */}
      {viewMode === 'campaigns' ? (
        /* 1. GOOGLE ADS CAMPAIGNS SUMMARY TABLE */
        <div id="campaigns-table-section" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl overflow-hidden space-y-4 scroll-mt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              Hiệu Suất Chiến Dịch Google Ads
            </h3>
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <span>Đang hiển thị:</span>
              <span className="text-emerald-400 font-black">{filteredCampaigns.length}</span>
              <span>/ {totalCount} chiến dịch</span>
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px] bg-slate-950/60 uppercase tracking-wider">
                  <th className="py-3.5 px-3 min-w-[240px]">Chiến Dịch</th>
                  <th className="py-3.5 px-3">Trạng Thái</th>
                  <th className="py-3.5 px-3 text-right">Lượt Hiển Thị</th>
                  <th className="py-3.5 px-3 text-right">Lượt Nhấp</th>
                  <th className="py-3.5 px-3 text-right">CTR (%)</th>
                  <th className="py-3.5 px-3 text-right">CPC Trung Bình</th>
                  <th className="py-3.5 px-3 text-right">Chi Phí</th>
                  <th className="py-3.5 px-3 text-right">Lượt Chuyển Đổi</th>
                  <th className="py-3.5 px-3 text-right">Chi Phí / Lượt Chuyển Đổi</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Chuyển Đổi</th>
                  <th className="py-3.5 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredCampaigns.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-800/50 transition-colors">
                    {/* Chiến dịch */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        {camp.name}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-cyan-400 border border-slate-700">
                          {camp.type}
                        </span>
                        {camp.budget && (
                          <span className="text-[11px] text-slate-400">
                            Ngân sách: {camp.budget}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-3">
                      {isAdmin ? (
                        <button
                          type="button"
                          onClick={() => handleToggleCampaignStatus(camp.name)}
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit cursor-pointer transition-all hover:scale-105 ${
                            camp.status === 'Đang chạy'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                          }`}
                          title="Bấm để Đổi trạng thái Bật / Tạm dừng"
                        >
                          <span className={`w-2 h-2 rounded-full ${camp.status === 'Đang chạy' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          {camp.status}
                        </button>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 w-fit ${
                          camp.status === 'Đang chạy'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${camp.status === 'Đang chạy' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                          {camp.status}
                        </span>
                      )}
                    </td>

                    {/* Lượt hiển thị */}
                    <td className="py-3.5 px-3 text-right font-medium text-slate-300">
                      {camp.impressions ? camp.impressions.toLocaleString('vi-VN') : '--'}
                    </td>

                    {/* Lượt nhấp */}
                    <td className="py-3.5 px-3 text-right font-bold text-slate-200">
                      {camp.clicks ? camp.clicks.toLocaleString('vi-VN') : '--'}
                    </td>

                    {/* CTR % */}
                    <td className="py-3.5 px-3 text-right font-black text-cyan-400">
                      {camp.ctr || '0.00%'}
                    </td>

                    {/* CPC trung bình */}
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-200">
                      {camp.cpc || '--'}
                    </td>

                    {/* Chi phí */}
                    <td className="py-3.5 px-3 text-right font-extrabold text-white">
                      {camp.spent}
                    </td>

                    {/* Lượt chuyển đổi */}
                    <td className="py-3.5 px-3 text-right font-black text-emerald-300">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                        {camp.leads}
                      </span>
                    </td>

                    {/* Chi phí / Lượt chuyển đổi (CPA) */}
                    <td className="py-3.5 px-3 text-right font-bold text-amber-300">
                      {camp.cpa}
                    </td>

                    {/* Tỷ lệ chuyển đổi % */}
                    <td className="py-3.5 px-3 text-right font-bold text-purple-300">
                      {camp.convRate || '0.00%'}
                    </td>

                    {/* Actions: Edit & AI Audit */}
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(camp)}
                            className="px-2 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 inline-flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                            title="Chỉnh sửa ngân sách, giá thầu, trạng thái"
                          >
                            <Sliders className="w-3 h-3 text-cyan-400" />
                            <span>Sửa</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setAiFocusCampaign(camp);
                            setIsAiModalOpen(true);
                          }}
                          className="px-2 py-1 rounded-lg text-[11px] font-bold bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 hover:text-white border border-indigo-500/30 inline-flex items-center gap-1 transition-all shadow-sm cursor-pointer"
                          title="Dùng AI phân tích riêng chiến dịch này"
                        >
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>AI</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {/* Google Ads Total Summary Row */}
                <tr className="bg-slate-950/80 font-bold border-t-2 border-slate-700 text-xs sm:text-sm">
                  <td className="py-4 px-3 text-white font-extrabold flex items-center gap-1.5">
                    <span>Tổng cộng: Tất cả chiến dịch</span>
                  </td>
                  <td className="py-4 px-3 text-slate-400 font-semibold">
                    {filteredCampaigns.length} Active
                  </td>
                  <td className="py-4 px-3 text-right text-slate-300 font-bold">
                    {totalImpressions.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-4 px-3 text-right text-slate-200 font-bold">
                    {totalClicks.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-4 px-3 text-right text-cyan-400 font-black">
                    {avgCtr}
                  </td>
                  <td className="py-4 px-3 text-right text-slate-200 font-bold">
                    {avgCpc.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-3 text-right text-white font-black text-sm sm:text-base">
                    {formatVND(totalSpent)}
                  </td>
                  <td className="py-4 px-3 text-right text-emerald-300 font-black text-sm sm:text-base">
                    {totalConversions.toLocaleString('vi-VN')}
                  </td>
                  <td className="py-4 px-3 text-right text-amber-300 font-black">
                    {avgCpa.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="py-4 px-3 text-right text-purple-300 font-black">
                    {avgConvRate}
                  </td>
                  <td className="py-4 px-3 text-right text-slate-500 font-medium">
                    --
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* 2. GOOGLE ADS DAILY BREAKDOWN TABLE */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              Chi Tiết Theo Từng Ngày (Đầy Đủ Cột Google Ads)
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              Trang {currentPage} / {totalPages} (Tổng số: {filteredDailyRecords.length.toLocaleString('vi-VN')} ngày)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px] bg-slate-950/60 uppercase tracking-wider">
                  <th className="py-3.5 px-3 min-w-[120px]">Ngày</th>
                  <th className="py-3.5 px-3 min-w-[200px]">Chiến Dịch</th>
                  <th className="py-3.5 px-3">Trạng Thái</th>
                  <th className="py-3.5 px-3 text-right">Lượt Hiển Thị</th>
                  <th className="py-3.5 px-3 text-right">Lượt Nhấp</th>
                  <th className="py-3.5 px-3 text-right">CTR (%)</th>
                  <th className="py-3.5 px-3 text-right">CPC Trung Bình</th>
                  <th className="py-3.5 px-3 text-right">Chi Phí</th>
                  <th className="py-3.5 px-3 text-right">Lượt Chuyển Đổi</th>
                  <th className="py-3.5 px-3 text-right">Chi Phí / Lượt Chuyển Đổi</th>
                  <th className="py-3.5 px-3 text-right">Tỷ Lệ Chuyển Đổi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {paginatedDaily.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                    {/* Ngày */}
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-cyan-500/70" />
                        {row.dateFormatted}
                      </div>
                    </td>

                    {/* Chiến dịch */}
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200 line-clamp-1">{row.campaignName}</div>
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                        row.status === 'Đang chạy'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Đang chạy' ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                        {row.status}
                      </span>
                    </td>

                    {/* Lượt hiển thị */}
                    <td className="py-3.5 px-3 text-right font-medium text-slate-300">
                      {row.impressions.toLocaleString('vi-VN')}
                    </td>

                    {/* Lượt nhấp */}
                    <td className="py-3.5 px-3 text-right font-bold text-slate-200">
                      {row.clicks.toLocaleString('vi-VN')}
                    </td>

                    {/* CTR % */}
                    <td className="py-3.5 px-3 text-right font-black text-cyan-400">
                      {row.ctr}
                    </td>

                    {/* CPC Trung Bình */}
                    <td className="py-3.5 px-3 text-right font-semibold text-slate-200">
                      {row.cpc.toLocaleString('vi-VN')} đ
                    </td>

                    {/* Chi Phí */}
                    <td className="py-3.5 px-3 text-right font-black text-white">
                      {row.spent.toLocaleString('vi-VN')} đ
                    </td>

                    {/* Lượt chuyển đổi */}
                    <td className="py-3.5 px-3 text-right font-black text-emerald-300">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30">
                        {row.leads}
                      </span>
                    </td>

                    {/* Chi phí / Lượt chuyển đổi (CPA) */}
                    <td className="py-3.5 px-3 text-right font-bold text-amber-300">
                      {row.cpa.toLocaleString('vi-VN')} đ
                    </td>

                    {/* Tỷ lệ chuyển đổi % */}
                    <td className="py-3.5 px-3 text-right font-bold text-purple-300">
                      {row.convRate || '0.00%'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-800 gap-3">
            <div className="text-xs text-slate-400">
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredDailyRecords.length)} trên tổng số {filteredDailyRecords.length.toLocaleString('vi-VN')} ngày
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Trang trước</span>
              </button>
              <span className="text-xs font-bold text-cyan-300 px-2">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 transition-all"
              >
                <span>Trang sau</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google Ads Script Modal */}
      <GoogleAdsConnectModal
        isOpen={isConnectModalOpen}
        onClose={() => setIsConnectModalOpen(false)}
        onSyncSuccess={() => loadData(sheetUrl)}
      />

      {/* Google Sheet URL Config Modal */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Link2 className="w-5 h-5 text-cyan-400" />
                Cấu Hình Google Sheet Báo Cáo Chiến Dịch
              </h3>
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-300">
                Link Google Sheet Báo Cáo Google Ads:
              </label>
              <input
                type="text"
                value={tempUrl}
                onChange={(e) => setTempUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../edit"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono focus:border-cyan-500 outline-none"
              />
              <p className="text-[11px] text-slate-400">
                Bảng tính Google Sheet cần được bật quyền <strong>"Bất kỳ ai có liên kết (Viewer)"</strong> để hệ thống đọc tự động.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={tempUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>Mở Google Sheet</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveSheetUrl}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg"
                >
                  Lưu & Đồng Bộ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI CAMPAIGN ANALYST & OPTIMIZATION MODAL */}
      <CampaignAiAnalystModal
        isOpen={isAiModalOpen}
        onClose={() => {
          setIsAiModalOpen(false);
          setAiFocusCampaign(null);
        }}
        campaigns={filteredCampaigns}
        summaryMetrics={{
          totalSpent,
          totalConversions,
          totalClicks,
          totalImpressions,
          avgCpa,
          avgCpc,
          avgCtr,
          avgConvRate,
        }}
        timeRangeLabel={
          selectedMonth !== 'all'
            ? `Tháng ${selectedMonth}/2026`
            : startDate && endDate
            ? `${startDate} đến ${endDate}`
            : 'Toàn bộ thời gian'
        }
        initialFocusCampaign={aiFocusCampaign}
      />

      {/* QUICK CAMPAIGN EDIT & OPTIMIZATION MODAL */}
      {isEditModalOpen && editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <SlidersHorizontal className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-white">Chỉnh Sửa & Tối Ưu Chiến Dịch</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-bold text-cyan-300 truncate max-w-[280px] sm:max-w-md">
                      {editingCampaign.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {editingCampaign.type}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Status Switch */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <label className="font-bold text-slate-200 block text-xs">Trạng thái chiến dịch:</label>
                  <span className="text-[11px] text-slate-400">Bật hoặc tạm dừng phân phối quảng cáo trên Google</span>
                </div>
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setEditForm(f => ({ ...f, status: 'Đang chạy' }))}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      editForm.status === 'Đang chạy'
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ▶️ Đang chạy
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditForm(f => ({ ...f, status: 'Tạm dừng' }))}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${
                      editForm.status === 'Tạm dừng'
                        ? 'bg-rose-500 text-white shadow-md font-black'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    ⏸️ Tạm dừng
                  </button>
                </div>
              </div>

              {/* Budget and Bid Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Daily Budget */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <label className="font-bold text-slate-200 block">
                    Ngân sách ngày (Daily Budget):
                  </label>
                  <input
                    type="text"
                    value={editForm.budget}
                    onChange={(e) => setEditForm(f => ({ ...f, budget: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-cyan-500 outline-none"
                    placeholder="VD: 1.000.000 đ"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {['500.000 đ', '1.000.000 đ', '1.500.000 đ', '2.000.000 đ'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setEditForm(f => ({ ...f, budget: val }))}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max CPC Bid */}
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <label className="font-bold text-slate-200 block">
                    Giá thầu trần tối đa (Max CPC):
                  </label>
                  <input
                    type="text"
                    value={editForm.maxCpc}
                    onChange={(e) => setEditForm(f => ({ ...f, maxCpc: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-cyan-500 outline-none"
                    placeholder="VD: 25.000 đ"
                  />
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {['15.000 đ', '20.000 đ', '25.000 đ', '35.000 đ', '50.000 đ'].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setEditForm(f => ({ ...f, maxCpc: val }))}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target CPA & Bidding Strategy */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <label className="font-bold text-slate-200 block">
                    CPA mục tiêu (Target CPA):
                  </label>
                  <input
                    type="text"
                    value={editForm.targetCpa}
                    onChange={(e) => setEditForm(f => ({ ...f, targetCpa: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-cyan-500 outline-none"
                    placeholder="VD: 250.000 đ"
                  />
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                  <label className="font-bold text-slate-200 block">
                    Chiến lược giá thầu:
                  </label>
                  <select
                    value={editForm.biddingStrategy}
                    onChange={(e) => setEditForm(f => ({ ...f, biddingStrategy: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-cyan-500 outline-none"
                  >
                    <option value="Tối đa hóa lượt chuyển đổi (Target CPA)">Tối đa hóa lượt chuyển đổi (Target CPA)</option>
                    <option value="Tối đa hóa lượt nhấp (Maximize Clicks)">Tối đa hóa lượt nhấp (Maximize Clicks)</option>
                    <option value="CPC thủ công (Manual CPC)">CPC thủ công (Manual CPC)</option>
                    <option value="Tỷ lệ hiển thị mục tiêu (Target Impression Share)">Tỷ lệ hiển thị mục tiêu</option>
                  </select>
                </div>
              </div>

              {/* Negative Keywords Input */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <label className="font-bold text-slate-200 block">
                  Thêm từ khóa phủ định nhanh (Negative Keywords - mỗi từ 1 dòng):
                </label>
                <textarea
                  rows={2}
                  value={editForm.negativeKeywords}
                  onChange={(e) => setEditForm(f => ({ ...f, negativeKeywords: e.target.value }))}
                  placeholder="VD: miễn phí&#10;tuyển dụng&#10;học nghề"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-cyan-500 outline-none"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="text-xs">
                {editSaveSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-4 h-4" /> Đã lưu thay đổi thành công!
                  </span>
                ) : (
                  <span className="text-slate-500 text-[11px]">Thay đổi áp dụng ngay trên bảng theo dõi</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveCampaignEdit}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Thay Đổi</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
