import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, 
  Search, 
  Globe, 
  X, 
  RefreshCw, 
  BellRing, 
  Bell, 
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface GoogleAdsTransparencyCenterProps {
  onSelectCompetitorForRadar?: (competitorName: string) => void;
}

interface NewAdAlert {
  id: string;
  domain: string;
  advertiserName: string;
  detectedTime: string;
  adTitle: string;
  format: 'video' | 'text' | 'image';
  isRead: boolean;
  legalEntity?: string;
}

export const GoogleAdsTransparencyCenter: React.FC<GoogleAdsTransparencyCenterProps> = () => {
  const [searchInput, setSearchInput] = useState<string>('nhakhoakim.com');
  
  // Notification Engine State
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [autoMonitorAlerts, setAutoMonitorAlerts] = useState<boolean>(true);
  const [isCheckingNewAds, setIsCheckingNewAds] = useState<boolean>(false);

  // Initial list of detected ads alerts
  const [notifications, setNotifications] = useState<NewAdAlert[]>([
    {
      id: 'alert-1',
      domain: 'nhakhoakim.com',
      advertiserName: 'Nha Khoa Kim',
      legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
      detectedTime: 'Vừa phát hiện (5 phút trước)',
      adTitle: 'Quy trình trồng Implant chỉ 2 lần hẹn - Máng định vị 3D',
      format: 'video',
      isRead: false
    },
    {
      id: 'alert-2',
      domain: 'nhakhoaparis.vn',
      advertiserName: 'Nha Khoa Paris',
      legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
      detectedTime: '35 phút trước',
      adTitle: 'Niềng Răng Paris 2026 - Đồng Giá 18 Triệu Trọn Gói',
      format: 'text',
      isRead: false
    },
    {
      id: 'alert-3',
      domain: 'nhakhoaviethan04.com',
      advertiserName: 'Nha Khoa Việt Hàn 04',
      legalEntity: 'NHA KHOA QUỐC TẾ VIỆT HÀN',
      detectedTime: '2 giờ trước',
      adTitle: 'Trồng Răng Implant Trợ Giá 6.5Tr - Bác Sĩ CKI Khám Trực Tiếp',
      format: 'video',
      isRead: true
    },
    {
      id: 'alert-4',
      domain: 'drcareimplant.com',
      advertiserName: 'Dr. Care Implant',
      legalEntity: 'CÔNG TY TNHH NHA KHOA DR. CARE',
      detectedTime: '4 giờ trước',
      adTitle: 'Trồng Răng Không Đau Cho Người Trung Niên U50-U70',
      format: 'text',
      isRead: true
    }
  ]);

  // Toast real-time alert
  const [toastAlert, setToastAlert] = useState<{
    show: boolean;
    alert: NewAdAlert | null;
  }>({ show: false, alert: null });

  const unreadAlertsCount = useMemo(() => {
    return notifications.filter(n => !n.isRead).length;
  }, [notifications]);

  // Clean domain helper
  const cleanDomainName = (input: string): string => {
    return input
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/.*$/, '')
      .trim()
      .toLowerCase();
  };

  // Google Ads Transparency Official Link Generator
  const getGoogleTransparencyLink = (domainOrUrl: string) => {
    const clean = cleanDomainName(domainOrUrl) || 'nhakhoakim.com';
    return `https://adstransparency.google.com/?region=VN&domain=${encodeURIComponent(clean)}`;
  };

  // Open Google Ads Transparency in a new tab
  const handleOpenGoogleTransparency = (domainToOpen?: string) => {
    const target = domainToOpen || searchInput;
    const clean = cleanDomainName(target);
    if (!clean) return;
    const url = getGoogleTransparencyLink(clean);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    handleOpenGoogleTransparency(searchInput);
  };

  // Quick preset click
  const handlePresetSelect = (domain: string) => {
    setSearchInput(domain);
    handleOpenGoogleTransparency(domain);
  };

  // Check / simulate detecting new ads from Ads Transparency
  const handleScanForNewAds = () => {
    setIsCheckingNewAds(true);
    setTimeout(() => {
      setIsCheckingNewAds(false);
      
      const sampleCompetitors = [
        {
          domain: 'nhakhoakim.com',
          name: 'Nha Khoa Kim',
          legal: 'CÔNG TY TNHH NHA KHOA KIM',
          title: 'Trồng Implant Chỉ Trong 1 Giờ Nghỉ Trưa - Ăn Nhai Tức Thì',
          format: 'video' as const
        },
        {
          domain: 'nhakhoaparis.vn',
          name: 'Nha Khoa Paris',
          legal: 'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
          title: 'Bọc Răng Sứ Nano 5S - Trả Góp 0% Lãi Suất 2026',
          format: 'text' as const
        },
        {
          domain: 'saigonimplant.com',
          name: 'Sài Gòn Implant',
          legal: 'NHA KHOA TRỒNG RĂNG SÀI GÒN',
          title: 'Ưu Đãi Trồng Răng Toàn Hàm All-On-4 Giảm 40 Triệu',
          format: 'video' as const
        }
      ];

      const picked = sampleCompetitors[Math.floor(Math.random() * sampleCompetitors.length)];

      const newAlert: NewAdAlert = {
        id: `alert-${Date.now()}`,
        domain: picked.domain,
        advertiserName: picked.name,
        legalEntity: picked.legal,
        detectedTime: 'Vừa phát hiện tức thì',
        adTitle: picked.title,
        format: picked.format,
        isRead: false
      };

      setNotifications(prev => [newAlert, ...prev]);
      setToastAlert({ show: true, alert: newAlert });

      setTimeout(() => {
        setToastAlert(prev => ({ ...prev, show: false }));
      }, 7000);
    }, 1200);
  };

  const handleOpenAlertUrl = (alert: NewAdAlert) => {
    setNotifications(prev =>
      prev.map(n => (n.id === alert.id ? { ...n, isRead: true } : n))
    );
    setToastAlert({ show: false, alert: null });
    handleOpenGoogleTransparency(alert.domain);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const competitorPresets = [
    { domain: 'nhakhoakim.com', label: 'Nha Khoa Kim' },
    { domain: 'nhakhoaparis.vn', label: 'Nha Khoa Paris' },
    { domain: 'nhakhoaviethan04.com', label: 'Nha Khoa Việt Hàn 04' },
    { domain: 'nhakhoasaigonbh.com', label: 'Nha Khoa Sài Gòn B.H' },
    { domain: 'nhakhoatrongrang.com', label: 'Nha Khoa Trồng Răng' },
    { domain: 'saigonimplant.com', label: 'Sài Gòn Implant' },
    { domain: 'drcareimplant.com', label: 'Dr. Care Implant' },
    { domain: 'nhakhoashark.vn', label: 'Nha Khoa Shark' },
    { domain: 'parkway.com.vn', label: 'Nha Khoa Parkway' },
    { domain: 'nhakhoaident.com', label: 'Nha Khoa I-Dent' },
    { domain: 'nhakhoatamducsmile.com', label: 'Tâm Đức Smile' }
  ];

  return (
    <div className="space-y-5">
      
      {/* ========================================================================= */}
      {/* 1. POPUP TOAST CẢNH BÁO MẪU QUẢNG CÁO MỚI PHÁT HIỆN                        */}
      {/* ========================================================================= */}
      {toastAlert.show && toastAlert.alert && (
        <div className="p-4 rounded-2xl bg-slate-900/95 border-2 border-emerald-500 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in text-white backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
              <BellRing className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-500 text-slate-950 uppercase tracking-wider">
                  PHÁT HIỆN QUẢNG CÁO MỚI
                </span>
                <span className="text-xs text-slate-400">
                  {toastAlert.alert.detectedTime}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white mt-1">
                Đối thủ <strong className="text-cyan-300">{toastAlert.alert.advertiserName} ({toastAlert.alert.domain})</strong> vừa xuất hiện mẫu: "{toastAlert.alert.adTitle}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => handleOpenAlertUrl(toastAlert.alert!)}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Xem Trên Google Ads</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setToastAlert({ show: false, alert: null })}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Ô TÌM KIẾM TRA CỨU VÀ CHUYỂN TRANG ADSTRANSPARENCY.GOOGLE.COM          */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header Title & Notification Trigger */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Globe className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Tra Cứu Google Ads Transparency Center
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Nhập tên miền hoặc URL đối thủ để chuyển trực tiếp sang trang Google Ads Transparency Center chính thức xem toàn bộ mẫu quảng cáo đang chạy.
            </p>
          </div>

          {/* Right Action Tools: Quét Ads Mới & Chuông Thông Báo */}
          <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
            <button
              type="button"
              onClick={handleScanForNewAds}
              disabled={isCheckingNewAds}
              className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800/50 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              title="Quét và kiểm tra mẫu quảng cáo mới phát hiện"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isCheckingNewAds ? 'animate-spin' : ''}`} />
              <span>{isCheckingNewAds ? 'Đang Quét...' : 'Quét Ads Mới'}</span>
            </button>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                className={`relative p-2.5 rounded-2xl border transition-all cursor-pointer ${
                  unreadAlertsCount > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Thông báo mẫu quảng cáo mới"
              >
                <Bell className={`w-4 h-4 ${unreadAlertsCount > 0 ? 'animate-bounce' : ''}`} />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 min-w-[18px] h-[18px] rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center border-2 border-slate-900 shadow-sm">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>

              {/* Notification Drawer */}
              {isNotificationPanelOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-4 z-50 animate-fade-in space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">Thông Báo Quảng Cáo Mới</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        {unreadAlertsCount} mới
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {unreadAlertsCount > 0 && (
                        <button
                          type="button"
                          onClick={handleMarkAllRead}
                          className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                        >
                          Đã đọc tất cả
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsNotificationPanelOpen(false)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* List of Detected Alerts */}
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        Chưa có thông báo quảng cáo mới nào
                      </div>
                    ) : (
                      notifications.map(alert => (
                        <div
                          key={alert.id}
                          onClick={() => handleOpenAlertUrl(alert)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-1.5 ${
                            alert.isRead
                              ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-950'
                              : 'bg-emerald-950/30 border-emerald-500/40 text-slate-200 hover:bg-emerald-950/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-cyan-300">
                              {alert.advertiserName}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {alert.detectedTime}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-white line-clamp-2">
                            {alert.adTitle}
                          </p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                              {alert.format.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-emerald-400 hover:underline font-bold flex items-center gap-1">
                              Mở trên Google Ads <ExternalLink className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-slate-800 pt-2 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Tự động phát hiện quảng cáo mới</span>
                    <button
                      type="button"
                      onClick={() => setAutoMonitorAlerts(!autoMonitorAlerts)}
                      className={`font-bold ${autoMonitorAlerts ? 'text-emerald-400' : 'text-slate-500'}`}
                    >
                      {autoMonitorAlerts ? 'Đang bật' : 'Đã tắt'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Big Search Input & Action Button Form */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-cyan-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Nhập tên miền đối thủ hoặc dán link website (ví dụ: nhakhoakim.com, nhakhoaparis.vn, ...)"
                className="w-full bg-slate-950 border-2 border-slate-700 focus:border-cyan-400 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none transition-all shadow-inner font-medium"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* BUTTON CHUYỂN TRỰC TIẾP QUA ADSTRANSPARENCY.GOOGLE.COM */}
            <button
              type="submit"
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-lg shadow-blue-600/30 shrink-0"
            >
              <span>Mở Trang adstransparency.google.com</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Target URL Preview */}
          <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-500 shrink-0">Đường dẫn đích:</span>
              <span className="font-mono text-cyan-300 truncate">
                {getGoogleTransparencyLink(searchInput || 'nhakhoakim.com')}
              </span>
            </div>
            <span className="text-emerald-400 font-semibold shrink-0 hidden sm:inline">
              Khu vực: Việt Nam (VN)
            </span>
          </div>
        </form>

        {/* Quick Competitor Preset Chips */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Hoặc chọn nhanh đối thủ nha khoa hàng đầu:</span>
            <span>Nhấn để mở ngay 1-Click</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {competitorPresets.map(preset => (
              <button
                key={preset.domain}
                type="button"
                onClick={() => handlePresetSelect(preset.domain)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 ${
                  cleanDomainName(searchInput) === preset.domain
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 border border-cyan-400'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{preset.label}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Live Detected Ads Feed List */}
        <div className="border-t border-slate-800 pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Mẫu Quảng Cáo Mới Nhất Vừa Ghi Nhận Từ Google Ads Transparency
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Tổng cộng {notifications.length} mẫu đã phát hiện
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {notifications.map(item => (
              <div
                key={item.id}
                onClick={() => handleOpenAlertUrl(item)}
                className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer flex items-start justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-cyan-300">
                      {item.advertiserName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      • {item.domain}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-200 line-clamp-2 group-hover:text-cyan-200 transition-colors">
                    {item.adTitle}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-mono">
                      {item.format.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {item.detectedTime}
                    </span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 group-hover:bg-cyan-600/20 text-slate-400 group-hover:text-cyan-300 transition-all shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
