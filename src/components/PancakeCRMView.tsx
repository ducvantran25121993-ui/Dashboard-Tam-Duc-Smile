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
  const [daysRange, setDaysRange] = useState<number>(7);
  const [copiedPhone, setCopiedPhone] = useState<string | null>(null);

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

      // 2. Fetch Conversations & Leads safely
      const convRes = await fetch(
        `/api/pancake/conversations?days=${daysRange}${force ? '&force=true' : ''}`
      );

      const contentType = convRes.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          'Máy chủ Pancake đang xử lý tải dữ liệu. Vui lòng bấm "Thử lại ngay" để kết nối.'
        );
      }

      const convData = await convRes.json();

      if (convData.success) {
        setLeads(convData.leads || []);
        setSummary(convData.summary || null);
        setIsFromCache(!!convData.fromCache);
        setCacheAgeSeconds(convData.cacheAgeSeconds || 0);
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

  useEffect(() => {
    fetchPancakeData();
  }, [daysRange]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchPancakeData(false, true);
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

  return (
    <div className="space-y-6">
      {/* Top Banner Connection Status */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-teal-500/30 p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
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
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 text-sm font-semibold flex items-center gap-2 transition shadow-sm active:scale-95 disabled:opacity-50"
              title="Cập nhật dữ liệu mới nhất từ Pancake"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Đang đồng bộ...' : 'Đồng Bộ Ngay'}
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

        {/* Days range selector */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <span>Khoảng thời gian đồng bộ:</span>
            {[
              { label: '3 Ngày', value: 3 },
              { label: '7 Ngày', value: 7 },
              { label: '14 Ngày', value: 14 },
              { label: '30 Ngày', value: 30 },
            ].map((r) => (
              <button
                key={r.value}
                onClick={() => setDaysRange(r.value)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  daysRange === r.value
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <div>
            Đồng bộ lúc: <span className="text-slate-300 font-mono">{new Date().toLocaleTimeString('vi-VN')}</span>
          </div>
        </div>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Tổng Hội Thoại</span>
            <MessageSquare className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{summary?.totalLeads || leads.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Trong {daysRange} ngày qua</div>
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
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {filteredLeads.length} / {leads.length} khách
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
            {filteredLeads.map((item) => (
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
                        {item.name}
                      </span>

                      {/* Phone pill */}
                      {item.phone ? (
                        <button
                          onClick={() => handleCopy(item.phone, item.id)}
                          className="px-2 py-0.5 rounded-md bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1 transition"
                          title="Nhấp để copy số điện thoại"
                        >
                          <Phone className="w-3 h-3 text-emerald-400" />
                          {item.phone}
                          {copiedPhone === item.id ? (
                            <Check className="w-3 h-3 text-emerald-300" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 opacity-60" />
                          )}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Chưa có SĐT</span>
                      )}

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
