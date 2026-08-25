import React, { useState, useEffect, useCallback } from 'react';
import { MONTHLY_DATA, MonthDataset } from './data/revenueData';
import { MonthTab, DisplayUnit, SidebarTab } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WorkOverview } from './components/WorkOverview';
import { InnovationView } from './components/InnovationView';
import { AIAgentView } from './components/AIAgentView';
import { AdminHubView } from './components/AdminHubView';
import { LeadsFunnelView } from './components/LeadsFunnelView';
import { CampaignsView } from './components/CampaignsView';
import { CompetitorTrackingView } from './components/CompetitorTrackingView';
import { SalesCopilotView, ConsultationView, DecisionBoardView } from './components/ExtraViews';
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
import { LoginModal } from './components/LoginModal';
import { ChangePasswordModal } from './components/ChangePasswordModal';
import {
  TabPermissionsModal,
  DEFAULT_STAFF_ALLOWED_TABS,
} from './components/TabPermissionsModal';
import { fetchPermissionsFromCloud } from './services/cloudPermissionsService';
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
} from 'lucide-react';
import {
  fetchGoogleSheetData,
  DEFAULT_SHEET_URL,
  DailyRecord,
} from './services/googleSheetsService';

export default function App() {
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('google_ads');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<MonthTab>(1);
  const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('full');

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
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return DEFAULT_STAFF_ALLOWED_TABS;
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState<boolean>(false);
  const [isTabPermissionsOpen, setIsTabPermissionsOpen] = useState<boolean>(false);

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
    setAllowedStaffTabs(tabs);
    try {
      localStorage.setItem('dashboard_staff_allowed_tabs', JSON.stringify(tabs));
    } catch {
      // ignore
    }
  };

  // Sync staff tab permissions from Cloud on app startup (supports all devices, mobile & incognito)
  useEffect(() => {
    let isMounted = true;
    async function syncCloudPermissions() {
      const cloudTabs = await fetchPermissionsFromCloud();
      if (isMounted && cloudTabs && Array.isArray(cloudTabs) && cloudTabs.length > 0) {
        setAllowedStaffTabs(cloudTabs);
      }
    }
    syncCloudPermissions();
    return () => {
      isMounted = false;
    };
  }, []);

  // If staff logs in and the active tab is not allowed, automatically switch to first available allowed tab
  useEffect(() => {
    if (userRole === 'staff' && allowedStaffTabs.length > 0) {
      if (!allowedStaffTabs.includes(activeSidebarTab)) {
        setActiveSidebarTab(allowedStaffTabs[0]);
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
      const cached = localStorage.getItem('monthly_sheet_datasets_v5');
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
        localStorage.setItem('monthly_sheet_datasets_v5', JSON.stringify(result.monthlyData));
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

  // Find dataset for active month
  const currentMonthNum = typeof activeTab === 'number' ? activeTab : 1;
  const currentMonthData = monthlyDatasets.find((m) => m.month === currentMonthNum) || monthlyDatasets[0] || MONTHLY_DATA[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-blue-500 selection:text-white flex flex-col">
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

      {/* Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeSidebarTab}
        onSelectTab={setActiveSidebarTab}
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
            onSelectTab={setActiveTab}
            displayUnit={displayUnit}
            onSelectUnit={setDisplayUnit}
            userRole={userRole}
            onLockDashboard={handleLogout}
            onChangePassword={() => setIsChangePasswordOpen(true)}
            onOpenTabPermissions={() => setIsTabPermissionsOpen(true)}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
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
                    {activeSidebarTab === 'sales_copilot' && 'Sales Copilot AI'}
                    {activeSidebarTab === 'consultation' && 'Hội Thoại Tư Vấn'}
                    {activeSidebarTab === 'decision_board' && 'Decision Board'}
                    {activeSidebarTab === 'innovation' && 'Sáng Tạo & Đổi Mới'}
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
          {userRole === 'staff' && !allowedStaffTabs.includes(activeSidebarTab) ? (
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
              onNavigateToTab={setActiveSidebarTab}
              isLive={isLive}
              lastUpdated={lastUpdated}
            />
          )}

          {activeSidebarTab === 'leads_funnel' && (
            <LeadsFunnelView monthlyDatasets={monthlyDatasets} />
          )}

          {activeSidebarTab === 'campaigns' && (
            <CampaignsView displayUnit={displayUnit} userRole={userRole} />
          )}

          {activeSidebarTab === 'competitor' && (
            <CompetitorTrackingView />
          )}

          {activeSidebarTab === 'sales_copilot' && <SalesCopilotView />}

          {activeSidebarTab === 'consultation' && <ConsultationView />}

          {activeSidebarTab === 'decision_board' && <DecisionBoardView />}

          {activeSidebarTab === 'innovation' && <InnovationView />}

          {activeSidebarTab === 'ai_agent' && (
            <AIAgentView monthlyDatasets={monthlyDatasets} />
          )}

          {activeSidebarTab === 'admin_hub' && (
            <AdminHubView
              onOpenTabPermissions={() => setIsTabPermissionsOpen(true)}
              onOpenChangePassword={() => setIsChangePasswordOpen(true)}
              onNavigateToTab={setActiveSidebarTab}
              currentSheetUrl={sheetUrl}
              onUpdateSheetUrl={(newUrl) => {
                setSheetUrl(newUrl);
                loadSheetData(newUrl);
              }}
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
              ) : currentMonthData ? (
                /* Individual Month View (Tháng 1 - Tháng 9) */
                <div className="space-y-6">
                  {/* Top KPI Cards */}
                  <KPISummary
                    monthData={currentMonthData}
                    displayUnit={displayUnit}
                  />

                  {/* Grid 1: Chi Phí (VAT) & Doanh Thu */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 1: Chi Phí (VAT) Theo Khu Vực */}
                    <CostChart
                      regions={currentMonthData.regions}
                      monthLabel={currentMonthData.label}
                      displayUnit={displayUnit}
                    />

                    {/* Chart 2: Doanh Thu Theo Khu Vực */}
                    <RevenueChart
                      regions={currentMonthData.regions}
                      monthLabel={currentMonthData.label}
                      displayUnit={displayUnit}
                    />
                  </div>

                  {/* Grid 2: Data Tháng Theo Khu Vực & Data Tháng Theo Dịch Vụ */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Chart 3: Data Tháng Theo Từng Khu Vực (Cột Data) */}
                    <RegionDataChart
                      regions={currentMonthData.regions}
                      monthLabel={currentMonthData.label}
                    />

                    {/* Chart 4: Data Tháng Theo Từng Dịch Vụ (Cột Data Dịch Vụ) */}
                    <ServiceDataChart
                      regions={currentMonthData.regions}
                      monthLabel={currentMonthData.label}
                      displayUnit={displayUnit}
                    />
                  </div>

                  {/* Chart 5: Data Ngày Theo Từng Dịch Vụ & Từng Tháng */}
                  <DailyDataChart
                    dailyRecords={dailyRecords}
                    activeMonth={currentMonthNum}
                    monthLabel={currentMonthData.label}
                    regions={currentMonthData?.regions}
                  />

                  {/* Combined Comparison Chart: Revenue vs Cost VAT */}
                  <CombinedChart
                    regions={currentMonthData.regions}
                    monthLabel={currentMonthData.label}
                    displayUnit={displayUnit}
                  />

                  {/* Dedicated Viet Kieu Revenue & Cost Chart */}
                  <VietKieuChart
                    monthlyData={monthlyDatasets}
                    activeMonth={currentMonthNum}
                    displayUnit={displayUnit}
                  />

                  {/* Detailed Data Table */}
                  <RegionalDetailTable
                    regions={currentMonthData.regions}
                    monthLabel={currentMonthData.label}
                    displayUnit={displayUnit}
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
