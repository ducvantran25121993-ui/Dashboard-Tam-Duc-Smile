import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { MONTHLY_DATA, MonthDataset } from './data/revenueData';
import { MonthTab, DisplayUnit, SidebarTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WorkOverview } from './components/WorkOverview';
import { BudgetForecastView } from './components/BudgetForecastView';
import { InnovationView } from './components/InnovationView';
import { AIAgentView } from './components/AIAgentView';
import { AdminHubView } from './components/AdminHubView';
import { LeadsFunnelView } from './components/LeadsFunnelView';
import { CampaignsView } from './components/CampaignsView';
import { CompetitorTrackingView } from './components/CompetitorTrackingView';
import { ConsultationView } from './components/ExtraViews';
import LandingBuilderView from './components/LandingBuilderView';
import { KPISummary } from './components/KPISummary';
import { CostChart } from './components/CostChart';
import { RevenueChart } from './components/RevenueChart';
import { RegionDataChart } from './components/RegionDataChart';
import { ServiceDataChart } from './components/ServiceDataChart';
import { DailyDataChart } from './components/DailyDataChart';
import { CombinedChart } from './components/CombinedChart';
import { VietKieuChart } from './components/VietKieuChart';
import { RegionalDetailTable } from './components/RegionalDetailTable';
import { SixMonthOverview } from './components/SixMonthOverview';
import { SheetStatusBanner } from './components/SheetStatusBanner';
import { QuarterSummaryBanner } from './components/QuarterSummaryBanner';
import { CustomRangeBanner } from './components/CustomRangeBanner';
import {
  isQuarterTab,
  getQuarterDataset,
  QuarterId,
  isCustomRange,
  parseCustomRange,
  getCustomRangeDataset,
} from './utils/quarterAggregator';
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import { TabPermissionsModal, DEFAULT_STAFF_ALLOWED_TABS } from './components/TabPermissionsModal';
import { CommandPalette } from './components/CommandPalette';
import { PancakeCRMView } from './components/PancakeCRMView';
import { VTTechCRMView } from './components/VTTechCRMView';
import { ThemeToggle } from './components/ThemeToggle';
import { fetchPermissionsFromCloud, ensureStaffPermissions } from './services/cloudPermissionsService';
import {
  Menu,
  DollarSign,
  Lock,
  KeyRound,
  ShieldCheck,
  Users,
  LayoutDashboard,
  TrendingUp,
  Sliders,
  AlertTriangle,
  Clock,
  ArrowRight,
  Search,
} from 'lucide-react';
import {
  fetchGoogleSheetData,
  DEFAULT_SHEET_URL,
  DailyRecord,
} from './services/googleSheetsService';
import { getStoredThemeMode, resolveEffectiveTheme } from './utils/themeManager';
import { getActivePalette } from './utils/customThemePalettes';
import { getCurrentVietnamMonth } from './utils/formatters';

export default function App() {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>(() => {
    try {
      const saved = localStorage.getItem('dashboard_active_sidebar_tab');
      if (saved && (saved as string) !== 'sales_copilot') return saved as SidebarTab;
    } catch {}
    return 'google_ads';
  });

  const handleSelectSidebarTab = (tab: SidebarTab) => {
    setActiveSidebarTab(tab);
    try {
      localStorage.setItem('dashboard_active_sidebar_tab', tab);
    } catch {}
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // Ensure window and document are scrolled to top whenever activeSidebarTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeSidebarTab]);

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Initialize month tab with current real-world month (đang tháng nào thì theo đúng tháng đó, tối đa theo dữ liệu Sheet thực tế)
  const [activeTab, setActiveTab] = useState<MonthTab>(() => {
    const currentCalMonth = Math.min(getCurrentVietnamMonth(), 11);
    try {
      const savedAnchor = localStorage.getItem('dashboard_active_month_cal_anchor');
      const saved = localStorage.getItem('dashboard_active_month_tab');
      // Nếu cùng tháng hiện tại và người dùng đã chủ động chọn xem tab khác, tôn trọng lựa chọn;
      // Nếu sang tháng mới hoặc chưa có lưu, tự động theo đúng tháng hiện tại!
      if (saved && savedAnchor === String(currentCalMonth)) {
        if (saved === 'overview' || saved === 'q1' || saved === 'q2' || saved === 'q3' || saved === 'q4') return saved as MonthTab;
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 11) {
          return parsed as MonthTab;
        }
      }
    } catch {}

    return currentCalMonth as MonthTab;
  });

  const handleSelectMonthTab = (tab: MonthTab) => {
    setActiveTab(tab);
    try {
      localStorage.setItem('dashboard_active_month_tab', String(tab));
      localStorage.setItem('dashboard_active_month_cal_anchor', String(Math.min(getCurrentVietnamMonth(), 11)));
    } catch {}
  };

  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('full');

  // Dynamic Theme & Custom Background Color State for 100% instant reactivity
  const [currentCanvasBg, setCurrentCanvasBg] = useState<string>(() => {
    try {
      const mode = getStoredThemeMode();
      const eff = resolveEffectiveTheme(mode);
      const pal = getActivePalette(eff);
      return pal.canvasBg;
    } catch {
      return '#0b1120';
    }
  });

  useEffect(() => {
    const handleThemeOrPaletteUpdate = () => {
      try {
        const mode = getStoredThemeMode();
        const eff = resolveEffectiveTheme(mode);
        const pal = getActivePalette(eff);
        setCurrentCanvasBg(pal.canvasBg);
      } catch {
        // ignore
      }
    };

    window.addEventListener('theme_changed', handleThemeOrPaletteUpdate);
    window.addEventListener('palette_changed', handleThemeOrPaletteUpdate);

    return () => {
      window.removeEventListener('theme_changed', handleThemeOrPaletteUpdate);
      window.removeEventListener('palette_changed', handleThemeOrPaletteUpdate);
    };
  }, []);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('dashboard_authenticated') === 'true' ||
        sessionStorage.getItem('dashboard_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [userRole, setUserRole] = useState<'admin' | 'staff' | null>(() => {
    try {
      return (
        (localStorage.getItem('dashboard_user_role') as 'admin' | 'staff') ||
        (sessionStorage.getItem('dashboard_user_role') as 'admin' | 'staff') ||
        'admin'
      );
    } catch {
      return 'admin';
    }
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('dashboard_password') || '123456';
    } catch {
      return '123456';
    }
  });

  const [staffPassword, setStaffPassword] = useState<string>(() => {
    try {
      return localStorage.getItem('dashboard_staff_password') || '123@!';
    } catch {
      return '123@!';
    }
  });

  // Allowed tabs for staff (configured by Admin)
  const [allowedStaffTabs, setAllowedStaffTabs] = useState<SidebarTab[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_staff_allowed_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = ensureStaffPermissions(parsed);
          try {
            localStorage.setItem('dashboard_staff_allowed_tabs', JSON.stringify(normalized));
          } catch {}
          return normalized;
        }
      }
    } catch {
      // ignore
    }
    return ensureStaffPermissions(DEFAULT_STAFF_ALLOWED_TABS);
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isTabPermissionsOpen, setIsTabPermissionsOpen] = useState<boolean>(false);

  // Command Palette & Interactive Cross-Filters
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [selectedRegionFilter, setSelectedRegionFilter] = useState<string | null>(null);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string | null>(null);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLoginSuccess = (role: 'admin' | 'staff') => {
    setUserRole(role);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('dashboard_authenticated');
      localStorage.removeItem('dashboard_user_role');
      sessionStorage.removeItem('dashboard_authenticated');
      sessionStorage.removeItem('dashboard_user_role');
    } catch {
      // ignore
    }
    setUserRole(null);
    setIsAuthenticated(false);
  };

  const handleSaveAdminPassword = (newPass: string) => {
    setAdminPassword(newPass);
    try {
      localStorage.setItem('dashboard_password', newPass);
    } catch {
      // ignore
    }
  };

  const handleSaveStaffPassword = (newPass: string) => {
    setStaffPassword(newPass);
    try {
      localStorage.setItem('dashboard_staff_password', newPass);
    } catch {
      // ignore
    }
  };

  const handleSaveAllowedStaffTabs = (tabs: SidebarTab[]) => {
    const normalized = ensureStaffPermissions(tabs);
    setAllowedStaffTabs(normalized);
    try {
      localStorage.setItem('dashboard_staff_allowed_tabs', JSON.stringify(normalized));
    } catch {
      // ignore
    }
  };

  // Sync staff tab permissions from Cloud on startup and auto-sync in background
  useEffect(() => {
    let isMounted = true;
    async function syncCloudPermissions() {
      const cloudTabs = await fetchPermissionsFromCloud();
      if (isMounted && cloudTabs && Array.isArray(cloudTabs) && cloudTabs.length > 0) {
        const normalized = ensureStaffPermissions(cloudTabs);
        setAllowedStaffTabs((prev) => {
          if (JSON.stringify(prev) !== JSON.stringify(normalized)) {
            return normalized;
          }
          return prev;
        });
      }
    }

    // Initial fetch
    syncCloudPermissions();

    // Listen to localStorage changes across browser tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dashboard_staff_allowed_tabs' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAllowedStaffTabs(ensureStaffPermissions(parsed));
          }
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Periodic cloud poll every 15 seconds so staff devices update dynamically when Admin updates permissions
    const syncInterval = setInterval(syncCloudPermissions, 15000);

    // Also sync on window focus
    const handleFocus = () => {
      syncCloudPermissions();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(syncInterval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // If staff logs in and the active tab is not allowed, automatically switch to first available allowed tab
  useEffect(() => {
    if (userRole === 'staff') {
      if (!allowedStaffTabs.includes(activeSidebarTab) || activeSidebarTab === 'vttech_crm') {
        const fallback = allowedStaffTabs.find((t) => t !== 'vttech_crm') || 'google_ads';
        setActiveSidebarTab(fallback);
      }
    }
  }, [userRole, allowedStaffTabs, activeSidebarTab]);

  // Google Sheet live synchronization state
  const [sheetUrl, setSheetUrl] = useState<string>(DEFAULT_SHEET_URL);
  const [monthlyDatasets, setMonthlyDatasets] = useState<MonthDataset[]>(() => {
    try {
      localStorage.removeItem('monthly_sheet_datasets');
      localStorage.removeItem('monthly_sheet_datasets_v2');
      localStorage.removeItem('monthly_sheet_datasets_v3');
      localStorage.removeItem('monthly_sheet_datasets_v4');
      localStorage.removeItem('monthly_sheet_datasets_v5');
      localStorage.removeItem('monthly_sheet_datasets_v6');
      localStorage.removeItem('monthly_sheet_datasets_v7');
      localStorage.removeItem('monthly_sheet_datasets_v8');
      const cached = localStorage.getItem('monthly_sheet_datasets_v9');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore storage error
    }
    return MONTHLY_DATA;
  });
  const [dailyRecords, setDailyRecords] = useState<DailyRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState<boolean>(true);

  // Fetch live Google Sheet data
  const loadSheetData = useCallback(async (url: string = sheetUrl) => {
    setIsFetching(true);
    const result = await fetchGoogleSheetData(url);
    if (result.monthlyData && result.monthlyData.length > 0) {
      setMonthlyDatasets(result.monthlyData);
      try {
        localStorage.setItem('monthly_sheet_datasets_v9', JSON.stringify(result.monthlyData));
      } catch {
        // ignore storage error
      }
    }
    setDailyRecords(result.dailyData);
    setLastUpdated(result.lastUpdated);
    setIsLive(result.isLive);
    setIsFetching(false);
  }, [sheetUrl]);

  // Initial load
  useEffect(() => {
    document.title = "Dashboard Báo Cáo Doanh Thu";
    loadSheetData(sheetUrl);
  }, [sheetUrl, loadSheetData]);

  // Periodic Auto Refresh (every 30 seconds for live updates when Google Sheet changes)
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const interval = setInterval(() => {
      loadSheetData(sheetUrl);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefreshEnabled, sheetUrl, loadSheetData]);

  // Find dataset for active month or consolidated quarter/range (defaults to current real calendar month)
  const currentCalendarMonth = Math.min(getCurrentVietnamMonth(), 11);
  const defaultCurrentMonth = currentCalendarMonth >= 1 && currentCalendarMonth <= 11 ? currentCalendarMonth : 10;
  const isQuarter = isQuarterTab(activeTab);
  const isRange = isCustomRange(activeTab);
  const customMonths = useMemo(() => {
    return isRange ? parseCustomRange(activeTab) || [] : [];
  }, [isRange, activeTab]);

  const currentDataset: MonthDataset = useMemo(() => {
    if (isQuarterTab(activeTab)) {
      return getQuarterDataset(activeTab, monthlyDatasets);
    }
    if (isCustomRange(activeTab)) {
      const months = parseCustomRange(activeTab) || [];
      if (months.length > 0) {
        return getCustomRangeDataset(months, monthlyDatasets);
      }
    }
    const monthNum = typeof activeTab === 'number' ? activeTab : defaultCurrentMonth;
    return monthlyDatasets.find((m) => m.month === monthNum) || monthlyDatasets[0] || MONTHLY_DATA[0];
  }, [activeTab, monthlyDatasets, defaultCurrentMonth]);

  const currentMonthNum = typeof activeTab === 'number' ? activeTab : defaultCurrentMonth;

  return (
    <div
      id="dashboard-root-container"
      style={{ backgroundColor: currentCanvasBg }}
      className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col transition-colors duration-200"
    >
      {/* Login Authentication Modal Gate */}
      {!isAuthenticated && (
        <LoginModal
          onLoginSuccess={handleLoginSuccess}
          adminPassword={adminPassword}
          staffPassword={staffPassword}
          onResetToDefaultPassword={() => {
            handleSaveAdminPassword('123456');
            handleSaveStaffPassword('123@!');
          }}
        />
      )}

      {/* Change Password Modal */}
      {isChangePasswordOpen && (
        <ChangePasswordModal
          adminPassword={adminPassword}
          staffPassword={staffPassword}
          onSaveAdminPassword={handleSaveAdminPassword}
          onSaveStaffPassword={handleSaveStaffPassword}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      )}

      {/* Staff Tab Permissions Modal (Admin Only) */}
      {isTabPermissionsOpen && userRole === 'admin' && (
        <TabPermissionsModal
          allowedTabs={allowedStaffTabs}
          onSaveAllowedTabs={handleSaveAllowedStaffTabs}
          onClose={() => setIsTabPermissionsOpen(false)}
        />
      )}

      {/* Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        activeSidebarTab={activeSidebarTab}
        onSelectSidebarTab={handleSelectSidebarTab}
        activeMonthTab={activeTab}
        onSelectMonthTab={handleSelectMonthTab}
        displayUnit={displayUnit}
        onSelectDisplayUnit={setDisplayUnit}
        monthlyDatasets={monthlyDatasets}
        onRefreshData={() => loadSheetData(sheetUrl)}
        onLogout={handleLogout}
        onSelectRegionFilter={(regionName) => {
          setSelectedRegionFilter(regionName);
          if (regionName) {
            const elem = document.getElementById('regional-detail-table-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onSelectServiceFilter={(serviceName) => {
          setSelectedServiceFilter(serviceName);
          if (serviceName) {
            const elem = document.getElementById('regional-detail-table-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        userRole={userRole}
      />

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeSidebarTab}
        onSelectTab={handleSelectSidebarTab}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        userRole={userRole}
        allowedStaffTabs={allowedStaffTabs}
        onOpenTabPermissions={() => setIsTabPermissionsOpen(true)}
      />

      {/* Main Content Area offset by Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'
        }`}
      >
        {/* Top Header */}
        {activeSidebarTab === 'google_ads' ? (
          <Header
            activeTab={activeTab}
            onSelectTab={handleSelectMonthTab}
            displayUnit={displayUnit}
            onSelectUnit={setDisplayUnit}
            monthlyData={monthlyDatasets}
            userRole={userRole}
            onLockDashboard={handleLogout}
            onChangePassword={() => setIsChangePasswordOpen(true)}
            onOpenTabPermissions={() => setIsTabPermissionsOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          />
        ) : (
          /* General Top Navigation for other tabs */
          <header className="bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
            <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Đóng / Mở Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                    {activeSidebarTab === 'overview' && 'Tổng Quan Quản Trị Hiệu Suất'}
                    {activeSidebarTab === 'leads_funnel' && 'Lead & Phễu Chuyển Đổi'}
                    {activeSidebarTab === 'campaigns' && 'Chiến Dịch Quảng Cáo'}
                    {activeSidebarTab === 'competitor' && 'Theo Dõi Đối Thủ & Auction Insights'}
                    {activeSidebarTab === 'consultation' && 'Pancake'}
                    {activeSidebarTab === 'innovation' && 'Sáng Tạo & Đổi Mới'}
                    {activeSidebarTab === 'landing_builder' && 'Tạo Landing Page AI (Vision to Code)'}
                    {activeSidebarTab === 'ai_agent' && 'AI — Trợ Lý Tăng Trưởng'}
                  </h1>
                  {userRole === 'admin' && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hidden sm:inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  )}
                  {userRole === 'staff' && (
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 hidden sm:inline-flex items-center gap-1">
                      <Users className="w-3 h-3" /> Nhân Viên
                    </span>
                  )}
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                {/* Command Palette Trigger Button */}
                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 hover:border-cyan-500/40 transition-all text-xs font-medium shadow-sm group cursor-pointer"
                  title="Tìm nhanh cơ sở, dịch vụ, chuyển tab (Phím tắt: Ctrl + K)"
                >
                  <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="hidden sm:inline">Tìm nhanh...</span>
                  <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700/80 rounded">
                    Ctrl K
                  </kbd>
                </button>

                {/* Theme Toggle (Sáng / Tối / Tự động theo thời gian) */}
                <ThemeToggle />

                {userRole === 'admin' && (
                  <button
                    onClick={() => setActiveSidebarTab('admin_hub')}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeSidebarTab === 'admin_hub'
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/80'
                    }`}
                    title="Mở Trang Quản Trị Admin Master Hub"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="hidden md:inline">Quản Trị Admin</span>
                  </button>
                )}

                {userRole === 'admin' && (
                  <button
                    onClick={() => setIsChangePasswordOpen(true)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 flex items-center gap-1 transition-all"
                    title="Đổi mật khẩu"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                    <span className="hidden md:inline">Đổi MK</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveSidebarTab('google_ads')}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 hover:bg-cyan-500/30 transition-all flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Xem Báo Cáo Doanh Thu</span>
                  <span className="sm:hidden">Doanh Thu</span>
                </button>

                {/* Unit Selector */}
                <div className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 px-1.5 font-medium flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  </span>
                  <button
                    onClick={() => setDisplayUnit('full')}
                    className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                      displayUnit === 'full' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    VNĐ
                  </button>
                  <button
                    onClick={() => setDisplayUnit('million')}
                    className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                      displayUnit === 'million' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Triệu
                  </button>
                  <button
                    onClick={() => setDisplayUnit('billion')}
                    className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all ${
                      displayUnit === 'billion' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    Tỷ
                  </button>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl flex items-center gap-1 transition-all"
                  title="Đăng xuất"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Main Content Container */}
        <main className="flex-1 max-w-[1650px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Permission Check for Staff */}
          {userRole === 'staff' && (!allowedStaffTabs.includes(activeSidebarTab) || activeSidebarTab === 'vttech_crm') ? (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center max-w-lg mx-auto my-12 space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Quyền Truy Cập Bị Giới Hạn</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Tài khoản Nhân viên của bạn chưa được Quản trị viên cấp quyền xem tab này. Vui lòng liên hệ Quản trị viên hệ thống để được hỗ trợ.
                </p>
              </div>
              <div className="pt-2">
                <button
                  onClick={() => setActiveSidebarTab(allowedStaffTabs[0] || 'overview')}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
                >
                  Quay Lại Tab Được Cho Phép
                </button>
              </div>
            </div>
          ) : (
            <>
          {activeSidebarTab === 'overview' && (
            <WorkOverview
              monthlyDatasets={monthlyDatasets}
              displayUnit={displayUnit}
              onNavigateToTab={handleSelectSidebarTab}
              isLive={isLive}
              lastUpdated={lastUpdated}
            />
          )}

          {activeSidebarTab === 'budget_forecast' && (
            <BudgetForecastView
              monthlyDatasets={monthlyDatasets}
              displayUnit={displayUnit}
              activeMonth={typeof activeTab === 'number' ? activeTab : defaultCurrentMonth}
              onSelectMonth={(m) => {
                if (typeof m === 'number' && m >= 1 && m <= 11) {
                  handleSelectMonthTab(m as MonthTab);
                } else if (m === 'all') {
                  handleSelectMonthTab('overview');
                }
              }}
            />
          )}

          {activeSidebarTab === 'leads_funnel' && (
            <LeadsFunnelView monthlyDatasets={monthlyDatasets} userRole={userRole} />
          )}

          {activeSidebarTab === 'campaigns' && (
            <CampaignsView displayUnit={displayUnit} userRole={userRole} />
          )}

          {activeSidebarTab === 'competitor' && (
            <CompetitorTrackingView />
          )}

          {activeSidebarTab === 'consultation' && <PancakeCRMView />}

          {activeSidebarTab === 'vttech_crm' && <VTTechCRMView />}

          {activeSidebarTab === 'innovation' && <InnovationView />}

          {activeSidebarTab === 'landing_builder' && <LandingBuilderView />}

          {activeSidebarTab === 'ai_agent' && (
            <AIAgentView monthlyDatasets={monthlyDatasets} />
          )}

          {activeSidebarTab === 'admin_hub' && (
            <AdminHubView
              onOpenTabPermissions={() => setIsTabPermissionsOpen(true)}
              onOpenChangePassword={() => setIsChangePasswordOpen(true)}
              onNavigateToTab={handleSelectSidebarTab}
              currentSheetUrl={sheetUrl}
              onUpdateSheetUrl={(newUrl) => {
                setSheetUrl(newUrl);
                loadSheetData(newUrl);
              }}
              monthlyDatasets={monthlyDatasets}
              activeMonth={typeof activeTab === 'number' ? activeTab : defaultCurrentMonth}
            />
          )}

          {activeSidebarTab === 'google_ads' && (
            <>
              {/* Live Google Sheet Status Banner */}
              <SheetStatusBanner
                isLive={isLive}
                isFetching={isFetching}
                lastUpdated={lastUpdated}
                sheetUrl={sheetUrl}
                onRefresh={() => loadSheetData(sheetUrl)}
                onUpdateSheetUrl={(newUrl) => {
                  setSheetUrl(newUrl);
                  loadSheetData(newUrl);
                }}
                autoRefreshEnabled={autoRefreshEnabled}
                onToggleAutoRefresh={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                userRole={userRole}
              />

              {activeTab === 'overview' ? (
                /* 6-Month Combined Overview View */
                <SixMonthOverview
                  displayUnit={displayUnit}
                  monthlyData={monthlyDatasets}
                  dailyRecords={dailyRecords}
                />
              ) : currentDataset ? (
                /* Individual Month View or Consolidated Quarter View */
                <div className="space-y-6">
                  {/* If viewing a Quarter (Quý 1, Quý 2, Quý 3), display Quarter Banner */}
                  {isQuarter && (
                    <QuarterSummaryBanner
                      quarterId={activeTab as QuarterId}
                      monthlyData={monthlyDatasets}
                      displayUnit={displayUnit}
                      onSelectTab={handleSelectMonthTab}
                    />
                  )}

                  {/* If viewing a Custom Range of Months (e.g. Tháng 1 - Tháng 6), display Range Banner */}
                  {isRange && customMonths.length > 0 && (
                    <CustomRangeBanner
                      months={customMonths}
                      monthlyData={monthlyDatasets}
                      displayUnit={displayUnit}
                      onSelectTab={handleSelectMonthTab}
                    />
                  )}

                  {/* Top KPI Cards (Consolidated if Quarter or Custom Range) */}
                  <KPISummary
                    monthData={currentDataset}
                    displayUnit={displayUnit}
                  />

                  {/* Grid 1: Chi Phí (VAT) & Doanh Thu */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Chi Phí (VAT) Theo Khu Vực */}
                    <CostChart
                      regions={currentDataset.regions}
                      monthLabel={currentDataset.label}
                      displayUnit={displayUnit}
                    />

                    {/* Chart 2: Doanh Thu Theo Khu Vực */}
                    <RevenueChart
                      regions={currentDataset.regions}
                      monthLabel={currentDataset.label}
                      displayUnit={displayUnit}
                    />
                  </div>

                  {/* Grid 2: Data Tháng Theo Khu Vực & Data Tháng Theo Dịch Vụ */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 3: Data Tháng Theo Từng Khu Vực (Cột Data) */}
                    <RegionDataChart
                      regions={currentDataset.regions}
                      monthLabel={currentDataset.label}
                    />

                    {/* Chart 4: Data Tháng Theo Từng Dịch Vụ (Cột Data Dịch Vụ) */}
                    <ServiceDataChart
                      regions={currentDataset.regions}
                      monthLabel={currentDataset.label}
                      displayUnit={displayUnit}
                      selectedService={selectedServiceFilter}
                      onSelectService={setSelectedServiceFilter}
                    />
                  </div>

                  {/* Chart 5: Data Ngày Theo Từng Dịch Vụ & Từng Tháng / Quý / Khoảng */}
                  <DailyDataChart
                    dailyRecords={dailyRecords}
                    activeMonth={isQuarter || isRange ? (activeTab as any) : currentMonthNum}
                    monthLabel={currentDataset.label}
                    regions={currentDataset?.regions}
                  />

                  {/* Combined Comparison Chart: Revenue vs Cost VAT */}
                  <CombinedChart
                    regions={currentDataset.regions}
                    monthLabel={currentDataset.label}
                    displayUnit={displayUnit}
                  />

                  {/* Dedicated Viet Kieu Revenue & Cost Chart */}
                  <VietKieuChart
                    monthlyData={monthlyDatasets}
                    activeMonth={typeof activeTab === 'number' ? activeTab : undefined}
                    displayUnit={displayUnit}
                  />

                  {/* Detailed Data Table (Consolidated for the whole Quarter or Month) */}
                  <RegionalDetailTable
                    regions={currentDataset.regions}
                    monthLabel={currentDataset.label}
                    displayUnit={displayUnit}
                    selectedRegionFilter={selectedRegionFilter}
                    onClearRegionFilter={() => setSelectedRegionFilter(null)}
                    selectedServiceFilter={selectedServiceFilter}
                    onClearServiceFilter={() => setSelectedServiceFilter(null)}
                    onSelectRegionFilter={setSelectedRegionFilter}
                  />
                </div>
              ) : null}
            </>
          )}
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-auto">
          <div className="max-w-[1650px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p></p>
            <p className="text-slate-600">
              © 2026 Team Google Ads. Tài Liệu Bảo Mật - Lưu Hành Nội Bộ
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
