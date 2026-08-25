import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  X,
  CheckCircle2,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
  LayoutDashboard,
  TrendingUp,
  Users2,
  Megaphone,
  Swords,
  Bot,
  MessageSquare,
  CheckSquare,
  Lightbulb,
  Zap,
  Info,
  Check,
  RotateCcw,
  Cloud,
  Globe,
  Loader2,
} from 'lucide-react';
import { SidebarTab } from '../types';
import { savePermissionsToCloud } from '../services/cloudPermissionsService';

export interface TabConfig {
  id: SidebarTab;
  label: string;
  category: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const ALL_WORKSPACE_TABS: TabConfig[] = [
  {
    id: 'overview',
    label: 'Tổng Quan',
    category: 'Báo Cáo & Quản Trị',
    description: 'Hub tổng hợp số liệu hiệu suất, doanh thu, tăng trưởng và KPI toàn hệ thống.',
    icon: LayoutDashboard,
    badge: 'Hub',
  },
  {
    id: 'google_ads',
    label: 'Doanh Thu (Live Sheet)',
    category: 'Báo Cáo & Quản Trị',
    description: 'Báo cáo chi tiết doanh thu, chi phí VAT theo 17 chi nhánh và nhóm dịch vụ.',
    icon: TrendingUp,
    badge: 'Live Sheet',
  },
  {
    id: 'leads_funnel',
    label: 'Lead & Phễu Chuyển Đổi',
    category: 'Marketing & Tăng Trưởng',
    description: 'Theo dõi hành trình khách hàng từ click, lead, lịch hẹn đến doanh thu thực tế.',
    icon: Users2,
    badge: '1.2k Leads',
  },
  {
    id: 'campaigns',
    label: 'Google Ads (Chiến Dịch)',
    category: 'Marketing & Tăng Trưởng',
    description: 'Bảng quản lý 59+ chiến dịch quảng cáo, ngân sách, CTR, CPC và trợ lý AI phân tích.',
    icon: Megaphone,
    badge: '59 Active',
  },
  {
    id: 'competitor',
    label: 'Theo Dõi Đối Thủ & URL Scanner',
    category: 'Nghiên Cứu Thị Trường',
    description: 'Quét tự động URL, phát hiện thay đổi banner, bảng giá và phân tích Auction Insights.',
    icon: Swords,
    badge: 'Auto Diff',
  },
  {
    id: 'sales_copilot',
    label: 'Sales Copilot AI',
    category: 'Công Cụ Bán Hàng & CSKH',
    description: 'Trợ lý AI hỗ trợ nhân viên tư vấn kịch bản chốt đơn, xử lý từ chối và chăm sóc khách.',
    icon: Bot,
    badge: 'AI Copilot',
  },
  {
    id: 'consultation',
    label: 'Hội Thoại Tư Vấn',
    category: 'Công Cụ Bán Hàng & CSKH',
    description: 'Phân tích hội thoại, ghi âm và chỉ số đánh giá kỹ năng tư vấn nha khoa.',
    icon: MessageSquare,
    badge: '98% Điểm',
  },
  {
    id: 'decision_board',
    label: 'Decision Board',
    category: 'Chiến Lược & Ra Quyết Định',
    description: 'Bảng điều hành đề xuất quyết định phân bổ ngân sách, tối ưu chi phí đa kênh.',
    icon: CheckSquare,
    badge: 'Executive',
  },
  {
    id: 'innovation',
    label: 'Sáng Tạo & Đổi Mới',
    category: 'Chiến Lược & Ra Quyết Định',
    description: 'Kho lưu trữ 6 sáng kiến tăng trưởng, thử nghiệm A/B và tối ưu trải nghiệm khách hàng.',
    icon: Lightbulb,
    badge: '6 Sáng Kiến',
  },
  {
    id: 'ai_agent',
    label: 'Trợ Lý Tăng Trưởng AI',
    category: 'Trí Tuệ Nhân Tạo',
    description: 'Trợ lý AI chuyên sâu phân tích số liệu, dự báo xu hướng và gợi ý giải pháp.',
    icon: Zap,
    badge: 'Gemini AI',
  },
  {
    id: 'admin_hub',
    label: 'Trung Tâm Quản Trị Hệ Thống',
    category: 'Báo Cáo & Quản Trị',
    description: 'Điều hành người dùng, kết nối Google Sheets/API, cài đặt ngưỡng cảnh báo CPA và bot quét đối thủ.',
    icon: ShieldCheck,
    badge: 'Master Admin',
  },
];

export const DEFAULT_STAFF_ALLOWED_TABS: SidebarTab[] = [
  'overview',
  'google_ads',
  'campaigns',
  'competitor',
  'innovation',
  'ai_agent',
];

interface TabPermissionsModalProps {
  allowedTabs: SidebarTab[];
  onSaveAllowedTabs: (tabs: SidebarTab[]) => void;
  onClose: () => void;
}

export const TabPermissionsModal: React.FC<TabPermissionsModalProps> = ({
  allowedTabs,
  onSaveAllowedTabs,
  onClose,
}) => {
  const [selectedTabs, setSelectedTabs] = useState<SidebarTab[]>(() => {
    return allowedTabs.length > 0 ? [...allowedTabs] : [...DEFAULT_STAFF_ALLOWED_TABS];
  });
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const toggleTab = (tabId: SidebarTab) => {
    setSelectedTabs((prev) => {
      if (prev.includes(tabId)) {
        // Prevent deselecting all tabs (at least 1 tab must remain accessible)
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== tabId);
      } else {
        return [...prev, tabId];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedTabs(ALL_WORKSPACE_TABS.map((t) => t.id));
  };

  const handleSelectBasicOnly = () => {
    // Only basic reporting tabs
    setSelectedTabs(['overview', 'google_ads', 'leads_funnel', 'sales_copilot']);
  };

  const handleResetDefault = () => {
    setSelectedTabs([...DEFAULT_STAFF_ALLOWED_TABS]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 1. Save locally in React state & localStorage
    onSaveAllowedTabs(selectedTabs);

    // 2. Broadcast to Cloud KV & Backend API
    const result = await savePermissionsToCloud(selectedTabs);
    setIsSaving(false);
    setSuccessMsg(result.message || 'Đã lưu & đồng bộ Cloud cho mọi thiết bị!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const filteredTabs = ALL_WORKSPACE_TABS.filter(
    (t) =>
      t.label.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      t.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      t.category.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const allowedCount = selectedTabs.length;
  const totalCount = ALL_WORKSPACE_TABS.length;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Phân Quyền Xem Tab Cho Nhân Viên
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Quản Trị Viên
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                  <Globe className="w-3 h-3 text-cyan-400" /> Đồng Bộ Mọi Thiết Bị (Cloud)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Chọn các tab chức năng mà tài khoản <strong>Nhân viên</strong> được phép xem hoặc bị ẩn.
              </p>
            </div>
          </div>
        </div>

        {/* Stats & Quick Actions Toolbar */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400">Nhân viên được xem:</span>
              <span className="font-bold text-cyan-300">
                {allowedCount} / {totalCount} Tab
              </span>
            </div>
            {allowedCount < totalCount && (
              <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Đã khóa {totalCount - allowedCount} tab
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={handleSelectAll}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
            >
              Mở Tất Cả ({totalCount})
            </button>
            <button
              type="button"
              onClick={handleSelectBasicOnly}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors"
            >
              Chỉ Mở Tab Cơ Bản
            </button>
            <button
              type="button"
              onClick={handleResetDefault}
              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
              title="Khôi phục mặc định"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Tab List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5 no-scrollbar">
          {filteredTabs.map((tab) => {
            const Icon = tab.icon;
            const isAllowed = selectedTabs.includes(tab.id);

            return (
              <div
                key={tab.id}
                onClick={() => toggleTab(tab.id)}
                className={`group p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 select-none ${
                  isAllowed
                    ? 'bg-slate-900/90 border-cyan-500/40 hover:border-cyan-400 shadow-md shadow-cyan-950/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-85'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isAllowed
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm sm:text-base font-bold ${
                          isAllowed ? 'text-white' : 'text-slate-400 line-through'
                        }`}
                      >
                        {tab.label}
                      </span>
                      {tab.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                          {tab.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-500 font-medium">
                        ({tab.category})
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {tab.description}
                    </p>
                  </div>
                </div>

                {/* Status Switch Toggle */}
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`hidden sm:inline-flex text-xs font-bold px-2.5 py-1 rounded-full border ${
                      isAllowed
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isAllowed ? (
                      <span className="flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Được Xem
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Bị Khóa / Ẩn
                      </span>
                    )}
                  </span>

                  {/* Switch Pill */}
                  <div
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 flex items-center ${
                      isAllowed ? 'bg-cyan-500 justify-end' : 'bg-slate-800 justify-start'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full bg-white shadow-md flex items-center justify-center">
                      {isAllowed ? (
                        <Check className="w-3 h-3 text-cyan-700 stroke-[3]" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 text-slate-500" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-cyan-400 shrink-0" />
            <span className="hidden sm:inline">
              Cài đặt có hiệu lực ngay lập tức cho tất cả phiên đăng nhập Nhân viên.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`px-5 py-2 text-xs sm:text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300 rounded-xl shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5 ${
                isSaving ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 text-slate-950 animate-spin" />
                  <span>Đang Đồng Bộ Cloud...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Lưu & Đồng Bộ Toàn Hệ Thống</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
