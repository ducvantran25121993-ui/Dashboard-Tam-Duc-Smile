import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Search,
  Building2,
  Calendar,
  Sparkles,
  TrendingUp,
  Wallet,
  Users2,
  Megaphone,
  Swords,
  Bot,
  LayoutDashboard,
  ShieldCheck,
  Download,
  RefreshCw,
  DollarSign,
  Sun,
  Moon,
  Lock,
  ArrowRight,
  CornerDownLeft,
  X,
  History,
  Check,
  Layers,
  FileCode,
  MessageSquare,
  Wand2,
  Ticket,
} from 'lucide-react';
import { SidebarTab, MonthTab, DisplayUnit } from '../types';
import { QuarterId } from '../utils/quarterAggregator';
import { exportToCSV } from '../utils/formatters';
import { MonthDataset } from '../data/revenueData';
import { setThemeMode } from '../utils/themeManager';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  activeSidebarTab: SidebarTab;
  onSelectSidebarTab: (tab: SidebarTab) => void;
  activeMonthTab: MonthTab;
  onSelectMonthTab: (tab: MonthTab) => void;
  displayUnit: DisplayUnit;
  onSelectDisplayUnit: (unit: DisplayUnit) => void;
  monthlyDatasets: MonthDataset[];
  onRefreshData?: () => void;
  onLogout?: () => void;
  onSelectRegionFilter?: (regionName: string | null) => void;
  onSelectServiceFilter?: (serviceName: string | null) => void;
  userRole?: 'admin' | 'staff' | null;
}

interface CommandItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'branch' | 'service' | 'month' | 'tab' | 'action';
  categoryLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  badge?: string;
  keywords: string[];
  action: () => void;
}

const BRANCH_LIST = [
  { name: 'Cần Thơ 1 + 2+TN', aliases: ['can tho', 'ct', 'can tho 1 2 tn'], region: 'Miền Tây' },
  { name: 'Cà Mau', aliases: ['ca mau', 'cm'], region: 'Miền Tây' },
  { name: 'Đồng Tháp', aliases: ['dong thap', 'dt', 'sa dec', 'cao lanh'], region: 'Miền Tây' },
  { name: 'Bạc Liêu', aliases: ['bac lieu', 'bl'], region: 'Miền Tây' },
  { name: 'Sóc Trăng', aliases: ['soc trang', 'st'], region: 'Miền Tây' },
  { name: 'Bình Dương', aliases: ['binh duong', 'bd', 'thu dau mot'], region: 'Đông Nam Bộ' },
  { name: 'Phước Tỉnh+Xuyên Mộc + Bacu + Bà Rịa', aliases: ['vung tau', 'ba ria', 'phuoc tinh', 'xuyen moc', 'bacu', 'vt', 'brvt'], region: 'Đông Nam Bộ' },
  { name: 'Biên Hòa + Đại Phước', aliases: ['bien hoa', 'dai phuoc', 'dong nai', 'bh', 'dn'], region: 'Đông Nam Bộ' },
  { name: 'HỒ CHÍ MINH lân cận', aliases: ['ho chi minh', 'hcm', 'sai gon', 'tp hcm', 'sg'], region: 'TP. Hồ Chí Minh' },
  { name: 'Việt Kiều', aliases: ['viet kieu', 'vk', 'overseas', 'khach viet kieu'], region: 'Khách Hải Ngoại' },
  { name: 'Quy Nhơn', aliases: ['quy nhon', 'qn', 'binh dinh'], region: 'Miền Trung' },
  { name: 'Tây Ninh', aliases: ['tay ninh', 'tn'], region: 'Đông Nam Bộ' },
  { name: 'Đà Nẵng', aliases: ['da nang', 'dn'], region: 'Miền Trung' },
  { name: 'Đà Lạt', aliases: ['da lat', 'dl', 'lam dong'], region: 'Tây Nguyên' },
  { name: 'Dĩ An', aliases: ['di an', 'da'], region: 'Đông Nam Bộ' },
  { name: 'Gia Kiệm', aliases: ['gia kiem', 'gk', 'thong nhat'], region: 'Đông Nam Bộ' },
  { name: 'Bình Phước', aliases: ['binh phuoc', 'bp', 'dong xoai'], region: 'Đông Nam Bộ' },
];

const SERVICE_LIST = [
  { name: 'Implant', aliases: ['implant', 'trong rang', 'cay ghep implant', 'im'], desc: 'Cấy ghép trụ Implant chính hãng' },
  { name: 'Niềng', aliases: ['nieng', 'nieng rang', 'chinh nha', 'invisalign', 'mac cai'], desc: 'Chỉnh nha mắc cài & máng trong suốt' },
  { name: 'Sứ', aliases: ['su', 'rang su', 'boc su', 'veneer', 'dan su'], desc: 'Bọc răng sứ thẩm mỹ & mặt dán Veneer' },
  { name: 'TH', aliases: ['th', 'tong quat', 'nha khoa tong hop', 'nho rang', 'tay trang'], desc: 'Nha khoa tổng quát, cạo vôi, nhổ răng' },
  { name: 'Việt Kiều', aliases: ['viet kieu', 'khach nuoc ngoai', 'vk'], desc: 'Dịch vụ toàn diện cho khách Việt Kiều' },
];

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  activeSidebarTab,
  onSelectSidebarTab,
  activeMonthTab,
  onSelectMonthTab,
  displayUnit,
  onSelectDisplayUnit,
  monthlyDatasets,
  onRefreshData,
  onLogout,
  onSelectRegionFilter,
  onSelectServiceFilter,
  userRole,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tamduc_palette_recent');
      return saved ? JSON.parse(saved) : ['Cần Thơ', 'Việt Kiều', 'Tháng 9', 'Ngân Sách Dự Kiến'];
    } catch {
      return ['Cần Thơ', 'Việt Kiều', 'Tháng 9'];
    }
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 900);
  };

  const saveRecent = (term: string) => {
    try {
      const updated = [term, ...recentSearches.filter((t) => t !== term)].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem('tamduc_palette_recent', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Reset query and focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle Export CSV
  const handleExportCurrentMonth = () => {
    const currentMonthNum = typeof activeMonthTab === 'number' ? activeMonthTab : 9;
    const currentData = monthlyDatasets.find((m) => m.month === currentMonthNum) || monthlyDatasets[monthlyDatasets.length - 1];
    if (!currentData || !currentData.regions.length) {
      showToast('⚠️ Không có dữ liệu để xuất');
      return;
    }

    const rows: Record<string, string | number>[] = [];
    currentData.regions.forEach((r) => {
      rows.push({
        'Khu Vực': r.name,
        'Doanh Thu (VNĐ)': r.revenue,
        'Chi Phí VAT (VNĐ)': r.costVAT,
        'Lợi Nhuận (VNĐ)': r.revenue - r.costVAT,
        '% CP / DT': r.revenue > 0 ? `${((r.costVAT / r.revenue) * 100).toFixed(1)}%` : '0%',
        'Tổng Data': r.totalData || 0,
        'Data Chất Lượng': r.dataChatLuong || 0,
      });
    });

    exportToCSV(`Bao_Cao_Doanh_Thu_Tam_Duc_${currentData.label.replace(/\s+/g, '_')}.csv`, rows);
    showToast(`✅ Đã xuất báo cáo CSV: ${currentData.label}`);
  };

  // Build commands list
  const allCommands = useMemo<CommandItem[]>(() => {
    const items: CommandItem[] = [];

    // 1. BRANCHES (17 cơ sở)
    BRANCH_LIST.forEach((b) => {
      items.push({
        id: `branch_${b.name}`,
        title: b.name,
        subtitle: `Cơ sở ${b.region} • Nhảy vào biểu đồ & bảng đối soát`,
        category: 'branch',
        categoryLabel: 'Chi Nhánh',
        icon: Building2,
        iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        badge: b.region,
        keywords: [b.name, ...b.aliases, 'co so', 'chi nhanh', 'phong kham', 'nha khoa'],
        action: () => {
          saveRecent(b.name);
          onSelectSidebarTab('google_ads');
          if (onSelectRegionFilter) {
            onSelectRegionFilter(b.name);
          }
          // Smooth scroll to regional table
          setTimeout(() => {
            const tableElem = document.querySelector('table');
            if (tableElem) {
              tableElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
          showToast(`🎯 Đang lọc theo cơ sở: ${b.name}`);
        },
      });
    });

    // 2. SERVICES
    SERVICE_LIST.forEach((s) => {
      items.push({
        id: `service_${s.name}`,
        title: `Dịch vụ ${s.name}`,
        subtitle: s.desc,
        category: 'service',
        categoryLabel: 'Dịch Vụ',
        icon: Sparkles,
        iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        badge: 'Chuyên khoa',
        keywords: [s.name, ...s.aliases, 'dich vu', 'chuyen khoa', 'chuyen mon'],
        action: () => {
          saveRecent(s.name);
          onSelectSidebarTab('google_ads');
          if (onSelectServiceFilter) {
            onSelectServiceFilter(s.name);
          }
          showToast(`✨ Đang lọc chéo dịch vụ: ${s.name}`);
        },
      });
    });

    // 3. MONTHS & QUARTERS
    for (let m = 1; m <= 11; m++) {
      const mStr = m < 10 ? `0${m}` : `${m}`;
      items.push({
        id: `month_${m}`,
        title: `Tháng ${m} (${mStr}/2026)`,
        subtitle: `Xem báo cáo chi tiết doanh thu & chi phí VAT Tháng ${m}`,
        category: 'month',
        categoryLabel: 'Thời Gian',
        icon: Calendar,
        iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        badge: m === 10 ? 'Tháng Hiện Tại' : undefined,
        keywords: [`thang ${m}`, `t${m}`, `thang ${m}/2026`, `thang${mStr}`],
        action: () => {
          saveRecent(`Tháng ${m}`);
          onSelectSidebarTab('google_ads');
          onSelectMonthTab(m as MonthTab);
          showToast(`📅 Đã chuyển sang: Tháng ${m}`);
        },
      });
    }

    // Quarters
    const quarters: { id: QuarterId; label: string; sub: string }[] = [
      { id: 'q1', label: 'Quý 1 (T1 - T3)', sub: 'Báo cáo hợp nhất Quý 1' },
      { id: 'q2', label: 'Quý 2 (T4 - T6)', sub: 'Báo cáo hợp nhất Quý 2' },
      { id: 'q3', label: 'Quý 3 (T7 - T9)', sub: 'Báo cáo hợp nhất Quý 3' },
      { id: 'q4', label: 'Quý 4 (T10 - T11)', sub: 'Báo cáo hợp nhất Quý 4' },
    ];
    quarters.forEach((q) => {
      items.push({
        id: `quarter_${q.id}`,
        title: q.label,
        subtitle: q.sub,
        category: 'month',
        categoryLabel: 'Thời Gian',
        icon: Calendar,
        iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
        keywords: [q.label, q.id, `quy ${q.id.replace('q', '')}`, 'quy'],
        action: () => {
          saveRecent(q.label);
          onSelectSidebarTab('google_ads');
          onSelectMonthTab(q.id);
          showToast(`📊 Đã chuyển sang: ${q.label}`);
        },
      });
    });

    items.push({
      id: 'month_overview',
      title: 'Tổng Quan Toàn Bộ 6-9 Tháng',
      subtitle: 'Xem toàn bộ biểu đồ lũy kế & xu hướng nhiều tháng',
      category: 'month',
      categoryLabel: 'Thời Gian',
      icon: Layers,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      keywords: ['tong quan', 'overview', 'tat ca thang', 'luy ke', 'xu huong'],
      action: () => {
        saveRecent('Tổng Quan Các Tháng');
        onSelectSidebarTab('google_ads');
        onSelectMonthTab('overview');
        showToast('📈 Đã mở: Tổng Quan Các Tháng');
      },
    });

    // 4. SIDEBAR WORK TABS
    const tabs: { id: SidebarTab; title: string; subtitle: string; icon: any; iconColor: string; keywords?: string[] }[] = [
      { id: 'overview', title: 'Tổng Quan Quản Trị (Hub)', subtitle: 'Thẻ hiệu suất toàn diện hệ thống Tâm Đức Smile', icon: LayoutDashboard, iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
      { id: 'google_ads', title: 'Báo Cáo Doanh Thu (Live Sheet)', subtitle: 'Biểu đồ chi phí VAT, doanh thu & phân tích chi nhánh', icon: TrendingUp, iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
      { id: 'budget_forecast', title: 'Ngân Sách Dự Kiến & 4 Kịch Bản', subtitle: 'Hạn mức kế hoạch 17 cơ sở, burn-rate & tối ưu chi phí', icon: Wallet, iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
      { id: 'leads_funnel', title: 'Lead & Phễu Chuyển Đổi (Funnel)', subtitle: 'Theo dõi hành trình khách hàng từ data đến chốt khám', icon: Users2, iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
      { id: 'campaigns', title: 'Quản Lý Google Ads (59 Active)', subtitle: 'Chiến dịch tìm kiếm, PMax, ngân sách ngày & từ khóa', icon: Megaphone, iconColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30' },
      { id: 'competitor', title: 'Theo Dõi Đối Thủ (Crawl4AI)', subtitle: 'Quét giá, khuyến mãi & thị phần quảng cáo đối thủ', icon: Swords, iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
      { id: 'consultation', title: 'Pancake CRM (Live Zalo OA)', subtitle: 'Đồng bộ data khách hàng, số điện thoại, tag dịch vụ & 17 cơ sở từ Pancake', icon: MessageSquare, iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', keywords: ['pancake', 'crm', 'zalo', 'tin nhan', 'hoi thoai', 'lead', 'sdt'] },
      { id: 'vttech_crm', title: 'VTTech CRM (Vé & Lịch Hẹn)', subtitle: 'Đồng bộ Ticket, trạng thái hẹn khám, đối soát Gclid và cơ sở từ VTTech Solution', icon: Ticket, iconColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30', keywords: ['vttech', 'ticket', 've', 'lich hen', 'tam duc', 'gclid'] },
      { id: 'innovation', title: 'Sáng Tạo & Đổi Mới (Innovation)', subtitle: 'Đề xuất ý tưởng marketing & tối ưu quy trình', icon: Sparkles, iconColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
      { id: 'landing_builder', title: 'Tạo Landing Page AI (Vision to Code)', subtitle: 'Sinh trang đích từ ảnh mẫu & giao diện chuẩn nha khoa', icon: Wand2, iconColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30' },
      { id: 'ai_agent', title: 'AI — Trợ Lý Tăng Trưởng (Gemini 3.8)', subtitle: 'Hỏi đáp chiến lược & trợ lý phân tích dữ liệu marketing', icon: Bot, iconColor: 'text-violet-400 bg-violet-500/10 border-violet-500/30' },
    ];

    if (userRole === 'admin') {
      tabs.push({
        id: 'admin_hub',
        title: 'Trang Quản Trị Admin Master Hub',
        subtitle: 'Cấu hình link Sheet, phân quyền Staff & đổi mật khẩu',
        icon: ShieldCheck,
        iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      });
    }

    tabs
      .filter((t) => {
        if (userRole === 'staff') {
          return t.id !== 'vttech_crm';
        }
        return true;
      })
      .forEach((t) => {
        items.push({
          id: `tab_${t.id}`,
          title: t.title,
          subtitle: t.subtitle,
          category: 'tab',
          categoryLabel: 'Chức Năng',
          icon: t.icon,
          iconColor: t.iconColor,
          keywords: [t.title, t.id, 'chuc nang', 'tab', 'menu', 'trang'],
          action: () => {
            saveRecent(t.title);
            onSelectSidebarTab(t.id);
            showToast(`🚀 Đã mở: ${t.title}`);
          },
        });
      });

    // 5. QUICK ACTIONS
    items.push({
      id: 'action_export_csv',
      title: 'Xuất Dữ Liệu Báo Cáo Ra Excel / CSV',
      subtitle: `Tải xuống file bảng kê chi phí & doanh thu tháng đang chọn`,
      category: 'action',
      categoryLabel: 'Tác Vụ Nhanh',
      icon: Download,
      iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      badge: '1-Click Export',
      keywords: ['xuat bao cao', 'export', 'csv', 'excel', 'tai file', 'download'],
      action: () => {
        handleExportCurrentMonth();
      },
    });

    if (onRefreshData) {
      items.push({
        id: 'action_refresh_live',
        title: 'Làm Mới & Đồng Bộ Google Sheet Live',
        subtitle: 'Cập nhật tức thì dữ liệu mới nhất từ file trang tính Google Sheet',
        category: 'action',
        categoryLabel: 'Tác Vụ Nhanh',
        icon: RefreshCw,
        iconColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
        badge: 'Live Sync',
        keywords: ['tai lai', 'dong bo', 'refresh', 'sync', 'sheet', 'cap nhat'],
        action: () => {
          onRefreshData();
          showToast('🔄 Đang đồng bộ lại dữ liệu từ Google Sheet...');
        },
      });
    }

    // Units
    items.push({
      id: 'action_unit_full',
      title: 'Đổi đơn vị tiền tệ: VNĐ (Đầy đủ)',
      subtitle: 'Hiển thị chính xác từng số đơn vị đồng (VD: 8.453.892.350 ₫)',
      category: 'action',
      categoryLabel: 'Tác Vụ Nhanh',
      icon: DollarSign,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      badge: displayUnit === 'full' ? 'Đang chọn' : undefined,
      keywords: ['vnd', 'dong', 'day du', 'tien'],
      action: () => {
        onSelectDisplayUnit('full');
        showToast('💵 Đã đổi đơn vị: VNĐ đầy đủ');
      },
    });

    items.push({
      id: 'action_unit_million',
      title: 'Đổi đơn vị tiền tệ: Triệu VNĐ',
      subtitle: 'Làm tròn số liệu dạng triệu đồng (VD: 8.453,9 tr ₫)',
      category: 'action',
      categoryLabel: 'Tác Vụ Nhanh',
      icon: DollarSign,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      badge: displayUnit === 'million' ? 'Đang chọn' : undefined,
      keywords: ['trieu', 'trieu dong', 'tr d', 'million'],
      action: () => {
        onSelectDisplayUnit('million');
        showToast('💵 Đã đổi đơn vị: Triệu VNĐ');
      },
    });

    items.push({
      id: 'action_unit_billion',
      title: 'Đổi đơn vị tiền tệ: Tỷ VNĐ',
      subtitle: 'Hiển thị theo tỷ đồng thích hợp cho báo cáo tài chính cấp cao (VD: 8,45 tỷ ₫)',
      category: 'action',
      categoryLabel: 'Tác Vụ Nhanh',
      icon: DollarSign,
      iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      badge: displayUnit === 'billion' ? 'Đang chọn' : undefined,
      keywords: ['ty', 'ty dong', 'billion'],
      action: () => {
        onSelectDisplayUnit('billion');
        showToast('💵 Đã đổi đơn vị: Tỷ VNĐ');
      },
    });

    // Theme toggles
    items.push({
      id: 'action_theme_dark',
      title: 'Giao diện: Chế Độ Tối (Dark Charcoal)',
      subtitle: 'Tối ưu dịu mắt khi làm việc buổi tối và theo dõi dữ liệu',
      category: 'action',
      categoryLabel: 'Tác Vụ Nhanh',
      icon: Moon,
      iconColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      keywords: ['toi', 'dark', 'night', 'theme'],
      action: () => {
        setThemeMode('dark');
        showToast('🌙 Đã kích hoạt giao diện Tối');
      },
    });

    items.push({
      id: 'action_theme_light',
      title: 'Giao diện: Chế Độ Sáng (Light Clean)',
      subtitle: 'Giao diện sáng thanh lịch, độ tương phản cao khi in ấn / họp',
      category: 'action',
      categoryLabel: 'Tác Vụ Nhanh',
      icon: Sun,
      iconColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      keywords: ['sang', 'light', 'white', 'theme'],
      action: () => {
        setThemeMode('light');
        showToast('☀️ Đã kích hoạt giao diện Sáng');
      },
    });

    if (onLogout) {
      items.push({
        id: 'action_logout',
        title: 'Khóa Màn Hình & Đăng Xuất',
        subtitle: 'Đăng xuất tài khoản để bảo mật dữ liệu doanh thu nội bộ',
        category: 'action',
        categoryLabel: 'Tác Vụ Nhanh',
        icon: Lock,
        iconColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
        keywords: ['dang xuat', 'khoa', 'logout', 'lock', 'thoat'],
        action: () => {
          onLogout();
          onClose();
        },
      });
    }

    return items;
  }, [
    activeMonthTab,
    activeSidebarTab,
    displayUnit,
    monthlyDatasets,
    onClose,
    onLogout,
    onRefreshData,
    onSelectDisplayUnit,
    onSelectMonthTab,
    onSelectRegionFilter,
    onSelectServiceFilter,
    onSelectSidebarTab,
    userRole,
  ]);

  // Filter commands based on user query
  const filteredCommands = useMemo(() => {
    const raw = query.trim().toLowerCase();
    if (!raw) return allCommands.slice(0, 16);

    // Natural multi-target detection (e.g. "Can tho t8" or "Viet kieu thang 9")
    // Match against keywords & title
    return allCommands
      .filter((cmd) => {
        const titleMatch = cmd.title.toLowerCase().includes(raw);
        const subMatch = cmd.subtitle.toLowerCase().includes(raw);
        const keywordMatch = cmd.keywords.some((k) => k.toLowerCase().includes(raw) || raw.includes(k.toLowerCase()));
        return titleMatch || subMatch || keywordMatch;
      })
      .slice(0, 20);
  }, [allCommands, query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeElement = listRef.current.querySelector(`[data-index="${selectedIndex}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] ring-1 ring-white/10 animate-in zoom-in-95 duration-150">
        {/* Top Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/90 gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0 animate-pulse" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm nhanh 17 cơ sở, dịch vụ, tháng, xuất file... (Ctrl + K)"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-400 text-sm sm:text-base font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-400 bg-slate-800 border border-slate-700 rounded-md">
            ESC
          </kbd>
        </div>

        {/* Recent Search Chips (Shown when query is empty) */}
        {!query && recentSearches.length > 0 && (
          <div className="px-4 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 flex items-center gap-1 font-medium shrink-0">
              <History className="w-3 h-3 text-slate-400" /> Gần đây:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    setQuery(term);
                    inputRef.current?.focus();
                  }}
                  className="px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700/60 font-medium"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div ref={listRef} className="flex-1 overflow-y-auto p-2 divide-y divide-slate-800/40">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <p className="text-sm">Không tìm thấy kết quả nào cho &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400">
                Thử gõ tên chi nhánh (ví dụ: &quot;Cần Thơ&quot;, &quot;Hồ Chí Minh&quot;), dịch vụ (&quot;Implant&quot;) hoặc tác vụ (&quot;Xuất báo cáo&quot;)
              </p>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = cmd.icon;

              return (
                <button
                  key={cmd.id}
                  data-index={idx}
                  onClick={() => cmd.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-600/20 text-white border border-blue-500/50 shadow-sm shadow-blue-500/10'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${cmd.iconColor}`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{cmd.title}</span>
                        {cmd.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-slate-800 text-cyan-300 border border-slate-700 shrink-0">
                            {cmd.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] px-2 py-0.5 rounded-md font-medium text-slate-400 bg-slate-800/60 border border-slate-800">
                      {cmd.categoryLabel}
                    </span>
                    {isSelected && (
                      <CornerDownLeft className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300">↑</kbd>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300">↓</kbd>
              di chuyển
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300">↵</kbd>
              chọn
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] bg-slate-800 border border-slate-700 rounded text-slate-300">ESC</kbd>
              đóng
            </span>
          </div>

          <div className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Tâm Đức Spotlight
          </div>
        </div>

        {/* Feedback Toast */}
        {toastMessage && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl flex items-center gap-2 border border-emerald-300 animate-in fade-in slide-in-from-top duration-200">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
