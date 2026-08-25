import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Users2,
  Megaphone,
  Bot,
  MessageSquare,
  CheckSquare,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Users,
  Sparkles,
  Zap,
  Swords,
  Sliders,
} from 'lucide-react';
import { SidebarTab } from '../types';
import { getActiveAIModelBadge } from '../utils/aiBadgeHelper';

interface SidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  isOpen: boolean;
  onToggle: () => void;
  userRole?: 'admin' | 'staff' | null;
  totalMonthlyRevenue?: number;
  allowedStaffTabs?: SidebarTab[];
  onOpenTabPermissions?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onToggle,
  userRole,
  allowedStaffTabs,
  onOpenTabPermissions,
}) => {
  const [currentAiBadge, setCurrentAiBadge] = useState(() => getActiveAIModelBadge());
  const [campaignsCount, setCampaignsCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('gads_active_campaigns_count');
      return saved ? parseInt(saved, 10) : 59;
    } catch {
      return 59;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      setCurrentAiBadge(getActiveAIModelBadge());
      try {
        const saved = localStorage.getItem('gads_active_campaigns_count');
        if (saved) setCampaignsCount(parseInt(saved, 10));
      } catch {
        // ignore
      }
    };
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('campaigns_updated', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('campaigns_updated', handleUpdate);
    };
  }, []);

  const navItems: {
    id: SidebarTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
    badgeColor?: string;
  }[] = [
    {
      id: 'overview',
      label: 'Tổng Quan',
      icon: LayoutDashboard,
      badge: 'Hub',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'google_ads',
      label: 'Doanh Thu',
      icon: TrendingUp,
      badge: 'Live Sheet',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    {
      id: 'leads_funnel',
      label: 'Lead & Phễu',
      icon: Users2,
      badge: '1.2k',
      badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    {
      id: 'campaigns',
      label: 'Google Ads',
      icon: Megaphone,
      badge: `${campaignsCount} Active`,
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'competitor',
      label: 'Theo Dõi Đối Thủ',
      icon: Swords,
      badge: 'URL',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 animate-pulse',
    },
    {
      id: 'sales_copilot',
      label: 'Sales Copilot',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
    {
      id: 'consultation',
      label: 'Hội thoại tư vấn',
      icon: MessageSquare,
      badge: '98%',
      badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    },
    {
      id: 'decision_board',
      label: 'Decision Board',
      icon: CheckSquare,
    },
    {
      id: 'innovation',
      label: 'Sáng Tạo',
      icon: Lightbulb,
      badge: '6 Sáng kiến',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'ai_agent',
      label: 'Trợ Lý AI',
      icon: Zap,
      badge: currentAiBadge.shortName,
      badgeColor: currentAiBadge.color,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onToggle}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-950/95 backdrop-blur-xl border-r border-slate-800/80 transition-all duration-300 ease-in-out ${
          isOpen
            ? 'w-64 translate-x-0'
            : '-translate-x-full lg:translate-x-0 lg:w-20'
        }`}
      >
        {/* Workspace Brand / Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Zap className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-white tracking-tight truncate flex items-center gap-1.5">
                  Tâm Đức Smile
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  Dashboard Marketing
                </span>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
          >
            {isOpen ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* User / Workspace Role Info */}
        {isOpen && (
          <div className="px-3 py-2.5 mx-3 mt-3 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                {userRole === 'admin' ? (
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Users className="w-4 h-4 text-sky-400" />
                )}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">
                  {userRole === 'admin' ? 'Quản Trị Viên' : 'Nhân Viên'}
                </p>
              </div>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>
        )}

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 no-scrollbar">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-3 mb-2 flex items-center justify-between">
            <span>{isOpen ? 'Không gian làm việc' : 'Tabs'}</span>
            {userRole === 'staff' && allowedStaffTabs && (
              <span className="text-[9px] text-sky-400 font-normal">
                {allowedStaffTabs.length} tab mở
              </span>
            )}
          </div>

          {navItems
            .filter((item) => {
              if (userRole === 'staff' && allowedStaffTabs && allowedStaffTabs.length > 0) {
                return allowedStaffTabs.includes(item.id);
              }
              return true;
            })
            .map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                title={!isOpen ? item.label : undefined}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-slate-900 text-white font-semibold shadow-lg shadow-black/40 border border-slate-700/60 ring-1 ring-cyan-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50 border border-transparent'
                }`}
              >
                {/* Active left indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-cyan-400 to-blue-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                )}

                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />

                {isOpen && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          item.badgeColor ||
                          'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Dedicated Admin Hub Section at Bottom */}
        {userRole === 'admin' && (
          <div className="px-3 py-2.5 border-t border-slate-800/90 bg-slate-950/70 shrink-0">
            <button
              onClick={() => onSelectTab('admin_hub')}
              title={!isOpen ? 'Quản Trị Admin' : undefined}
              className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 select-none cursor-pointer ${
                activeTab === 'admin_hub'
                  ? 'bg-emerald-950/60 text-white font-semibold shadow-lg shadow-emerald-950/50 border border-emerald-600/50 ring-1 ring-emerald-400/40'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900/80 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Active left indicator bar */}
              {activeTab === 'admin_hub' && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              )}

              <ShieldCheck
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  activeTab === 'admin_hub'
                    ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                    : 'text-emerald-400/80 group-hover:text-emerald-300'
                }`}
              />

              {isOpen && (
                <div className="flex-1 flex items-center justify-between min-w-0">
                  <span className="truncate font-semibold">Quản Trị Admin</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-500/20 text-emerald-300 border-emerald-500/40">
                    Master
                  </span>
                </div>
              )}
            </button>
          </div>
        )}

        {/* Footer info in sidebar */}
        {isOpen && (
          <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span></span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Trực tuyến
            </span>
          </div>
        )}
      </aside>
    </>
  );
};
