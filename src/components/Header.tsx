import React from 'react';
import { Calendar, DollarSign, TrendingUp, Building2, BarChart2, Lock, KeyRound, ShieldCheck, Users, Menu, Sliders } from 'lucide-react';
import { MonthTab, DisplayUnit } from '../types';

interface HeaderProps {
  activeTab: MonthTab;
  onSelectTab: (tab: MonthTab) => void;
  displayUnit: DisplayUnit;
  onSelectUnit: (unit: DisplayUnit) => void;
  userRole?: 'admin' | 'staff' | null;
  onLockDashboard?: () => void;
  onChangePassword?: () => void;
  onOpenTabPermissions?: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  displayUnit,
  onSelectUnit,
  userRole,
  onLockDashboard,
  onChangePassword,
  onOpenTabPermissions,
  onToggleSidebar,
}) => {
  const months: { id: MonthTab; label: string }[] = [
    { id: 1, label: 'Tháng 1' },
    { id: 2, label: 'Tháng 2' },
    { id: 3, label: 'Tháng 3' },
    { id: 4, label: 'Tháng 4' },
    { id: 5, label: 'Tháng 5' },
    { id: 6, label: 'Tháng 6' },
    { id: 7, label: 'Tháng 7' },
    { id: 8, label: 'Tháng 8' },
    { id: 9, label: 'Tháng 9' },
    { id: 'overview', label: 'Tổng Quan' },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-md">
      <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar: Title & Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-slate-800">
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

          {/* Controls: Display Unit Selector & Security Lock */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
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

        {/* Month Navigation Tabs - White Glass & Shimmer Light Sweep */}
        <div className="pt-3 pb-2 flex items-center justify-between gap-2 overflow-x-auto overflow-y-hidden no-scrollbar">
          <div className="inline-flex items-center gap-1 sm:gap-2 p-1.5 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-800/90 shadow-2xl max-w-full overflow-x-auto overflow-y-hidden no-scrollbar">
            {months.map((m) => {
              const isActive = activeTab === m.id;
              const isOverview = m.id === 'overview';
              const shortLabel = typeof m.id === 'number' ? `T${m.id}` : 'Tổng Quan';

              if (isOverview) {
                return (
                  <React.Fragment key={m.id}>
                    {/* Divider */}
                    <div className="h-6 w-px bg-slate-800 mx-1 shrink-0" />
                    <button
                      onClick={() => onSelectTab(m.id)}
                      title={m.label}
                      className={`group relative flex items-center justify-center gap-1.5 px-4 sm:px-4.5 py-2 text-xs sm:text-sm font-black rounded-full whitespace-nowrap transition-all duration-300 shrink-0 select-none overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-100 via-white to-cyan-100 text-slate-950 border-2 border-cyan-400 ring-2 ring-cyan-300/80 shadow-[0_0_25px_rgba(6,182,212,0.7)] scale-[1.05] -translate-y-0.5'
                          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-2 border-emerald-300/90 ring-2 ring-emerald-400/60 shadow-[0_0_22px_rgba(20,184,166,0.75)] hover:shadow-[0_0_30px_rgba(20,184,166,0.95)] hover:scale-[1.04]'
                      }`}
                    >
                      {/* Light Sweep Shimmer Effect for Active and Inactive */}
                      <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-10">
                        <span className={`absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent ${
                          isActive ? 'via-white/90' : 'via-white/75'
                        } to-transparent animate-shimmer`} />
                      </span>

                      <TrendingUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors z-20 ${
                        isActive ? 'text-cyan-700' : 'text-white animate-pulse drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                      }`} />
                      <span className={`sm:hidden z-20 font-black ${
                        isActive ? 'text-slate-950' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                      }`}>{shortLabel}</span>
                      <span className={`hidden sm:inline z-20 font-black ${
                        isActive ? 'text-slate-950' : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]'
                      }`}>{m.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-[3.5px] rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] z-20" />
                      )}
                    </button>
                  </React.Fragment>
                );
              }

              return (
                <button
                  key={m.id}
                  onClick={() => onSelectTab(m.id)}
                  title={m.label}
                  className={`group relative flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl whitespace-nowrap transition-all duration-300 shrink-0 select-none overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-white via-slate-50 to-white text-slate-950 border border-white ring-2 ring-cyan-400/80 shadow-[0_0_25px_rgba(255,255,255,0.7),0_0_40px_rgba(56,189,248,0.35)] scale-[1.03] -translate-y-0.5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {isActive && (
                    <>
                      <span className="absolute -inset-1.5 rounded-2xl bg-cyan-400/30 blur-md pointer-events-none -z-10" />
                      {/* Light Sweep Shimmer Effect */}
                      <span className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none z-10">
                        <span className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/90 to-transparent animate-shimmer" />
                      </span>
                    </>
                  )}
                  <Calendar className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors z-20 ${
                    isActive ? 'text-cyan-700' : 'text-slate-500 group-hover:text-slate-300'
                  }`} />
                  <span className={`sm:hidden z-20 ${isActive ? 'text-slate-950 font-extrabold' : ''}`}>{shortLabel}</span>
                  <span className={`hidden sm:inline z-20 ${isActive ? 'text-slate-950 font-extrabold' : ''}`}>{m.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 sm:w-12 h-[3.5px] rounded-full bg-cyan-500 shadow-[0_0_10px_#06b6d4] z-20" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
