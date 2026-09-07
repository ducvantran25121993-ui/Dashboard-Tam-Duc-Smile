import React from 'react';
import { DollarSign, Building2, BarChart2, Lock, KeyRound, ShieldCheck, Users, Menu, Search, Command } from 'lucide-react';
import { MonthTab, DisplayUnit } from '../types';
import { MonthDataset } from '../data/revenueData';
import { ThemeToggle } from './ThemeToggle';
import { MonthNavigation } from './MonthNavigation';

interface HeaderProps {
  activeTab: MonthTab;
  onSelectTab: (tab: MonthTab) => void;
  displayUnit: DisplayUnit;
  onSelectUnit: (unit: DisplayUnit) => void;
  monthlyData?: MonthDataset[];
  userRole?: 'admin' | 'staff' | null;
  onLockDashboard?: () => void;
  onChangePassword?: () => void;
  onOpenTabPermissions?: () => void;
  onToggleSidebar?: () => void;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  displayUnit,
  onSelectUnit,
  monthlyData = [],
  userRole,
  onLockDashboard,
  onChangePassword,
  onOpenTabPermissions,
  onToggleSidebar,
  onOpenCommandPalette,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top bar: Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white transition-colors lg:hidden"
                title="Mở menu tab công việc"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <BarChart2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  Dashboard Báo Cáo Doanh Thu
                </h1>
                {userRole === 'admin' && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Admin
                  </span>
                )}
                {userRole === 'staff' && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/15 text-sky-400 border border-sky-500/30 flex items-center gap-1">
                    <Users className="w-3 h-3" /> Nhân viên
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                Phân Tích Doanh Thu & Chi Phí (VAT) Theo Khu Vực & Dịch Vụ
              </p>
            </div>
          </div>

          {/* Controls: Quick Search Palette, Display Unit Selector, Theme Toggle & Security Lock */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {/* Quick Command Palette Button */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 hover:border-cyan-500/40 transition-all text-xs font-medium shadow-sm group"
                title="Mở thanh tìm kiếm nhanh cơ sở, dịch vụ, tháng (Phím tắt: Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline">Tìm nhanh...</span>
                <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-700/80 rounded">
                  Ctrl K
                </kbd>
              </button>
            )}

            {/* Theme Toggle (Sáng / Tối / Tự động theo giờ) */}
            <ThemeToggle />

            {/* Unit Selector */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              <span className="text-xs text-slate-400 px-2 font-medium flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-400" /> Đơn vị:
              </span>
              <button
                onClick={() => onSelectUnit('full')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  displayUnit === 'full'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                VNĐ
              </button>
              <button
                onClick={() => onSelectUnit('million')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  displayUnit === 'million'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Triệu VNĐ
              </button>
              <button
                onClick={() => onSelectUnit('billion')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  displayUnit === 'billion'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                Tỷ VNĐ
              </button>
            </div>

            {/* Change Pass & Lock buttons */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
              {onChangePassword && userRole === 'admin' && (
                <button
                  onClick={onChangePassword}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-700/60 rounded-lg flex items-center gap-1 transition-all"
                  title="Thay đổi mật khẩu truy cập (Admin & Staff)"
                >
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">Đổi MK</span>
                </button>
              )}
              {onLockDashboard && (
                <button
                  onClick={onLockDashboard}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-lg flex items-center gap-1 transition-all"
                  title="Đăng xuất khỏi Dashboard"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>Đăng xuất</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Month Navigation - Compact Grouped Tabs by Quarter or Dropdown */}
        <MonthNavigation
          activeTab={activeTab}
          onSelectTab={onSelectTab}
          monthlyData={monthlyData}
          displayUnit={displayUnit}
        />
      </div>
    </header>
  );
};
