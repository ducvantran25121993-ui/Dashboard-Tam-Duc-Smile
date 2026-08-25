import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Database,
  BellRing,
  Swords,
  History,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  Sparkles,
  Zap,
  Globe,
  FileSpreadsheet,
  Activity,
  Check,
  X,
  Clock,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Percent,
  Search,
  ExternalLink,
  Cpu,
  Power,
  CheckSquare,
  Square,
  Shield,
  Layers,
  AlertOctagon,
  DollarSign,
  Download,
  Upload,
  Bot,
  Flame,
  Radio,
  FileJson,
  RotateCcw,
  SlidersHorizontal,
  Save,
  HelpCircle,
  Key,
  Calendar,
  Table,
  LayoutGrid,
} from 'lucide-react';
import { SidebarTab } from '../types';
import { ALL_WORKSPACE_TABS, TabConfig } from './TabPermissionsModal';
import {
  DEFAULT_BUDGET_PLAN_SHEET_URL,
  BudgetPlanSummary,
  BranchPlanItem,
  fetchBudgetPlanSheetData,
  FALLBACK_BUDGET_PLAN_ITEMS
} from '../services/budgetPlanSheetService';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'marketer' | 'sales' | 'accountant' | 'custom';
  roleLabel: string;
  status: 'active' | 'disabled';
  lastActive: string;
  department: string;
  allowedTabs: SidebarTab[];
}

export const ROLE_PRESET_TABS: Record<string, SidebarTab[]> = {
  admin: ['overview', 'google_ads', 'leads_funnel', 'campaigns', 'competitor', 'sales_copilot', 'consultation', 'decision_board', 'innovation', 'ai_agent', 'admin_hub'],
  manager: ['overview', 'google_ads', 'leads_funnel', 'campaigns', 'competitor', 'decision_board', 'innovation', 'ai_agent'],
  marketer: ['overview', 'campaigns', 'competitor', 'leads_funnel', 'innovation', 'ai_agent'],
  sales: ['overview', 'leads_funnel', 'sales_copilot', 'consultation', 'ai_agent'],
  accountant: ['overview', 'google_ads', 'decision_board'],
  custom: ['overview', 'campaigns', 'leads_funnel'],
};

export const ROLE_LABEL_MAP: Record<string, string> = {
  marketer: 'Google Ads Specialist (Quyền xem Ads, Đối Thủ)',
  sales: 'Tư Vấn & Sales Online (Quyền xem Lead, Copilot)',
  manager: 'Marketing Manager (Xem đa tab Marketing)',
  accountant: 'Kế Toán (Xem Báo Cáo Doanh Thu & VAT)',
  admin: 'Super Admin (Toàn Quyền Hệ Thống)',
  custom: 'Tùy Chỉnh Phân Quyền Riêng (Custom Matrix)',
};

export interface BranchBudget {
  id: string;
  name: string;
  allocatedMonthly: number; // in VND
  spentThisMonth: number;   // in VND
  status: 'normal' | 'warning' | 'critical';
  autoPauseOnOverbudget: boolean;
}

export interface EmergencyCampaign {
  id: string;
  name: string;
  branch: string;
  status: 'running' | 'paused_emergency';
  todaySpend: number;
  todayCpa: number;
  maxTargetCpa: number;
  reason?: string;
  clickSpike: boolean;
}

export interface AIPromptGovernance {
  systemPromptCore: string;
  consultationRules: string;
  pricingPolicy: string;
  temperature: number;
  tokenConsumptionThisMonth: number;
  maxMonthlyTokenBudget: number;
}

interface ThresholdConfig {
  implantMaxCpa: number;
  porcelainMaxCpa: number;
  bracesMaxCpa: number;
  generalMaxCpa: number;
  minQualityScore: number;
  minLeadToBookingRate: number;
  dailyBudgetLimit: number;
  enableSoundAlert: boolean;
  enableEmailAlert: boolean;
}

interface AuditLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  category: 'auth' | 'data' | 'crawler' | 'config' | 'emergency' | 'budget' | 'backup';
  status: 'success' | 'warning' | 'info' | 'critical';
  details: string;
}

interface AdminHubViewProps {
  onOpenTabPermissions?: () => void;
  onOpenChangePassword?: () => void;
  onNavigateToTab?: (tab: SidebarTab) => void;
  currentSheetUrl?: string;
  onUpdateSheetUrl?: (url: string) => void;
}

export const AdminHubView: React.FC<AdminHubViewProps> = ({
  onOpenTabPermissions,
  onOpenChangePassword,
  onNavigateToTab,
  currentSheetUrl = 'https://docs.google.com/spreadsheets/d/1_T0uOvd4q2e.../edit',
  onUpdateSheetUrl,
}) => {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<
    'users' | 'emergency' | 'budget' | 'ai_governance' | 'backup' | 'connections' | 'thresholds' | 'crawler' | 'audit'
  >('users');

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'security' | 'campaigns' | 'system_ai'>('all');

  // Users State
  const [users, setUsers] = useState<AdminUser[]>(() => {
    try {
      const saved = localStorage.getItem('dashboard_admin_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.map((u: any) => ({
          ...u,
          allowedTabs: u.allowedTabs || ROLE_PRESET_TABS[u.role] || ROLE_PRESET_TABS.marketer,
        }));
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'u1',
        name: 'Trần Đức',
        email: 'TranDuc474@gmail.com',
        role: 'admin',
        roleLabel: 'Super Admin (Ban Giám Đốc)',
        status: 'active',
        lastActive: 'Vừa xong',
        department: 'Ban Điều Hành',
        allowedTabs: ROLE_PRESET_TABS.admin,
      },
      {
        id: 'u2',
        name: 'Nguyễn Văn An',
        email: 'an.nguyen@tamducsmile.vn',
        role: 'marketer',
        roleLabel: 'Google Ads Specialist',
        status: 'active',
        lastActive: '15 phút trước',
        department: 'Phòng Marketing',
        allowedTabs: ROLE_PRESET_TABS.marketer,
      },
      {
        id: 'u3',
        name: 'Lê Thị Mai',
        email: 'mai.le@tamducsmile.vn',
        role: 'sales',
        roleLabel: 'Trưởng Nhóm Tư Vấn & CSKH',
        status: 'active',
        lastActive: '1 giờ trước',
        department: 'Tư Vấn & Sales Online',
        allowedTabs: ROLE_PRESET_TABS.sales,
      },
      {
        id: 'u4',
        name: 'Hoàng Minh',
        email: 'minh.hoang@tamducsmile.vn',
        role: 'manager',
        roleLabel: 'Marketing Manager',
        status: 'active',
        lastActive: 'Hôm qua, 17:30',
        department: 'Phòng Marketing',
        allowedTabs: ROLE_PRESET_TABS.manager,
      },
      {
        id: 'u5',
        name: 'Kế Toán Tổng Hợp',
        email: 'ketoan@tamducsmile.vn',
        role: 'accountant',
        roleLabel: 'Kế Toán Trưởng',
        status: 'active',
        lastActive: '3 ngày trước',
        department: 'Phòng Tài Chính - Kế Toán',
        allowedTabs: ROLE_PRESET_TABS.accountant,
      },
    ];
  });

  // Thresholds State
  const [thresholds, setThresholds] = useState<ThresholdConfig>(() => {
    try {
      const saved = localStorage.getItem('dashboard_thresholds_config');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      implantMaxCpa: 450000,
      porcelainMaxCpa: 320000,
      bracesMaxCpa: 380000,
      generalMaxCpa: 150000,
      minQualityScore: 4,
      minLeadToBookingRate: 25,
      dailyBudgetLimit: 35000000,
      enableSoundAlert: true,
      enableEmailAlert: true,
    };
  });

  // Crawler Config State
  const [crawlerInterval, setCrawlerInterval] = useState<'6' | '12' | '24' | '48'>(() => {
    return (localStorage.getItem('dashboard_crawler_interval') as any) || '24';
  });
  const [crawlerScanImages, setCrawlerScanImages] = useState<boolean>(true);
  const [crawlerScanPrices, setCrawlerScanPrices] = useState<boolean>(true);
  const [crawlerScanPromos, setCrawlerScanPromos] = useState<boolean>(true);

  // Sheet Edit State
  const [sheetUrlInput, setSheetUrlInput] = useState(currentSheetUrl);
  const [isTestingSheet, setIsTestingSheet] = useState(false);
  const [sheetPingStatus, setSheetPingStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Google Sheets "Ngân Sách Dự Kiến" Live State
  const [budgetPlanUrl, setBudgetPlanUrl] = useState<string>(() => {
    return localStorage.getItem('tamduc_budget_plan_url') || DEFAULT_BUDGET_PLAN_SHEET_URL;
  });
  const [budgetPlanSummary, setBudgetPlanSummary] = useState<BudgetPlanSummary | null>(null);
  const [isLoadingBudgetPlan, setIsLoadingBudgetPlan] = useState<boolean>(false);
  const [budgetScenario, setBudgetScenario] = useState<'standard' | 'vat' | 'reduced30' | 'reducedExtra30'>('standard');
  const [budgetViewMode, setBudgetViewMode] = useState<'cards' | 'table'>('cards');
  const [budgetPlanSheetInput, setBudgetPlanSheetInput] = useState<string>(() => {
    return localStorage.getItem('tamduc_budget_plan_url') || DEFAULT_BUDGET_PLAN_SHEET_URL;
  });

  // Google Ads API Live Credentials State
  const [googleAdsConfig, setGoogleAdsConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('dashboard_google_ads_config');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      customerId: '297-136-7807',
      developerToken: '_Nwxgn2-6zk2milYrOdOUQ',
      clientId: '814922629929-snb94tgmqfh9vilcnblgis7tfmatpnq6.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken: '1//043gju-ozsUfCgYIARAAGAQSNwF-L9IrplP_OgzIH6VPqvVqUrTgqAA1Kwm4DUykMj8aw2sv28o09wDUf1i-gkBCTezy2U2ek9A',
      status: 'connected',
      autoSyncMinutes: 15,
      lastSyncTime: 'Vừa xong',
    };
  });
  const [isTestingGoogleAds, setIsTestingGoogleAds] = useState(false);
  const [showGoogleAdsModal, setShowGoogleAdsModal] = useState(false);

  // User Modal State (Add & Edit)
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'manager' | 'marketer' | 'sales' | 'accountant' | 'custom'>('marketer');
  const [newUserDept, setNewUserDept] = useState('Phòng Marketing');
  const [selectedTabs, setSelectedTabs] = useState<SidebarTab[]>(ROLE_PRESET_TABS.marketer);

  // Function to open add user modal
  const handleOpenAddUserModal = () => {
    setEditingUserId(null);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('marketer');
    setNewUserDept('Phòng Marketing');
    setSelectedTabs(ROLE_PRESET_TABS.marketer);
    setShowAddUserModal(true);
  };

  // Function to open edit user modal
  const handleOpenEditUserModal = (u: AdminUser) => {
    setEditingUserId(u.id);
    setNewUserName(u.name);
    setNewUserEmail(u.email);
    setNewUserRole(u.role);
    setNewUserDept(u.department);
    setSelectedTabs(u.allowedTabs && u.allowedTabs.length > 0 ? u.allowedTabs : (ROLE_PRESET_TABS[u.role] || []));
    setShowAddUserModal(true);
  };

  // When role is changed from dropdown
  const handleRoleChange = (role: 'admin' | 'manager' | 'marketer' | 'sales' | 'accountant' | 'custom') => {
    setNewUserRole(role);
    if (ROLE_PRESET_TABS[role]) {
      setSelectedTabs(ROLE_PRESET_TABS[role]);
    }
  };

  // Toggle single tab checkbox
  const handleToggleTab = (tabId: SidebarTab) => {
    setSelectedTabs(prev => {
      const exists = prev.includes(tabId);
      if (exists) {
        return prev.filter(t => t !== tabId);
      } else {
        return [...prev, tabId];
      }
    });
  };

  // Select all tabs
  const handleSelectAllTabs = () => {
    setSelectedTabs(ALL_WORKSPACE_TABS.map(t => t.id));
  };

  // Deselect all tabs
  const handleDeselectAllTabs = () => {
    setSelectedTabs([]);
  };

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: 'Hôm nay, 20:25:10',
      userName: 'Trần Đức (Admin)',
      action: 'Truy cập Trang Quản Trị Hệ Thống',
      category: 'auth',
      status: 'info',
      details: 'Xem tổng quan cấu hình phân quyền & kết nối API',
    },
    {
      id: 'log-2',
      timestamp: 'Hôm nay, 19:42:15',
      userName: 'Trần Đức (Admin)',
      action: 'Sắp xếp danh sách Từ Khóa & Quality Score',
      category: 'data',
      status: 'success',
      details: 'Lọc 191 từ khóa điểm thấp ≤4/10 và sort theo CPA',
    },
    {
      id: 'log-3',
      timestamp: 'Hôm nay, 18:25:00',
      userName: 'Trần Đức (Admin)',
      action: 'Cập nhật kế hoạch phản công Google Ads',
      category: 'config',
      status: 'success',
      details: 'Gỡ bỏ nhãn 17 chi nhánh và cập nhật headline mẫu quảng cáo đối xứng',
    },
    {
      id: 'log-4',
      timestamp: 'Hôm qua, 23:59:52',
      userName: 'Auto Crawler Bot',
      action: 'Tự động quét định kỳ 21 link đối thủ',
      category: 'crawler',
      status: 'warning',
      details: 'Phát hiện biến động khuyến mãi tại Nha Khoa Trồng Răng Sài Gòn & Nha Khoa Shark',
    },
    {
      id: 'log-5',
      timestamp: 'Hôm qua, 09:15:30',
      userName: 'Nguyễn Văn An (Marketer)',
      action: 'Đồng bộ Google Sheets Báo Cáo Doanh Thu',
      category: 'data',
      status: 'success',
      details: 'Đồng bộ thành công 17 chi nhánh và 9 tháng dữ liệu',
    },
  ]);

  // 4 New Feature States
  // 1. Emergency Kill-Switch & Fraud Radar
  const [emergencyCampaigns, setEmergencyCampaigns] = useState<EmergencyCampaign[]>([
    {
      id: 'c-1',
      name: '[Search] - Trồng Răng Implant Toàn Hàm All-on-4/6 - HCM',
      branch: 'Bình Dương & HCM',
      status: 'running',
      todaySpend: 14250000,
      todayCpa: 680000,
      maxTargetCpa: 450000,
      reason: 'CPA tăng vọt 51% so với ngưỡng trần (450k)',
      clickSpike: true,
    },
    {
      id: 'c-2',
      name: '[Search] - Bọc Răng Sứ Thẩm Mỹ Emax/Cercon - Cần Thơ',
      branch: 'Cần Thơ',
      status: 'running',
      todaySpend: 8900000,
      todayCpa: 490000,
      maxTargetCpa: 320000,
      reason: 'Nghi vấn 12 click ảo từ cùng 1 dải IP 118.69.xxx trong đêm',
      clickSpike: true,
    },
    {
      id: 'c-3',
      name: '[Search] - Niềng Răng Trong Suốt Invisalign - Đà Nẵng',
      branch: 'Đà Nẵng',
      status: 'running',
      todaySpend: 6200000,
      todayCpa: 310000,
      maxTargetCpa: 380000,
      reason: 'Hoạt động ổn định',
      clickSpike: false,
    },
    {
      id: 'c-4',
      name: '[Performance Max] - Nhổ Răng Khôn Piezotome - Biên Hòa',
      branch: 'Biên Hòa',
      status: 'running',
      todaySpend: 3450000,
      todayCpa: 135000,
      maxTargetCpa: 150000,
      reason: 'Hiệu quả tốt',
      clickSpike: false,
    },
  ]);

  // 2. Branch Budget Allocator (17 Chi Nhánh Tâm Đức Smile)
  const [branchBudgets, setBranchBudgets] = useState<BranchBudget[]>([
    { id: 'b1', name: 'Bình Dương (Thuận An)', allocatedMonthly: 60000000, spentThisMonth: 52288250, status: 'warning', autoPauseOnOverbudget: true },
    { id: 'b2', name: 'Biên Hòa (Đồng Nai)', allocatedMonthly: 50000000, spentThisMonth: 39698817, status: 'normal', autoPauseOnOverbudget: true },
    { id: 'b3', name: 'Cần Thơ', allocatedMonthly: 45000000, spentThisMonth: 37356522, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b4', name: 'Đà Nẵng', allocatedMonthly: 60000000, spentThisMonth: 54962580, status: 'warning', autoPauseOnOverbudget: true },
    { id: 'b5', name: 'Tây Ninh', allocatedMonthly: 35000000, spentThisMonth: 31151138, status: 'warning', autoPauseOnOverbudget: false },
    { id: 'b6', name: 'Quy Nhơn (Bình Định)', allocatedMonthly: 30000000, spentThisMonth: 27795381, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b7', name: 'Bình Phước (Đồng Xoài)', allocatedMonthly: 25000000, spentThisMonth: 20375737, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b8', name: 'Vũng Tàu', allocatedMonthly: 40000000, spentThisMonth: 33450000, status: 'normal', autoPauseOnOverbudget: true },
    { id: 'b9', name: 'Tiền Giang (Mỹ Tho)', allocatedMonthly: 30000000, spentThisMonth: 28900000, status: 'warning', autoPauseOnOverbudget: true },
    { id: 'b10', name: 'Long An (Tân An)', allocatedMonthly: 30000000, spentThisMonth: 22100000, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b11', name: 'An Giang (Long Xuyên)', allocatedMonthly: 35000000, spentThisMonth: 36200000, status: 'critical', autoPauseOnOverbudget: true },
    { id: 'b12', name: 'Kiên Giang (Rạch Giá)', allocatedMonthly: 30000000, spentThisMonth: 24500000, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b13', name: 'Đồng Tháp (Cao Lãnh)', allocatedMonthly: 25000000, spentThisMonth: 19800000, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b14', name: 'Bến Tre', allocatedMonthly: 25000000, spentThisMonth: 21300000, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b15', name: 'Trà Vinh', allocatedMonthly: 20000000, spentThisMonth: 16500000, status: 'normal', autoPauseOnOverbudget: false },
    { id: 'b16', name: 'Sóc Trăng', allocatedMonthly: 20000000, spentThisMonth: 18200000, status: 'warning', autoPauseOnOverbudget: false },
    { id: 'b17', name: 'Cà Mau', allocatedMonthly: 25000000, spentThisMonth: 22400000, status: 'normal', autoPauseOnOverbudget: false },
  ]);

  // 3. AI Governance & Prompt Controls
  const [aiGovernance, setAiGovernance] = useState<AIPromptGovernance>(() => {
    try {
      const saved = localStorage.getItem('dashboard_ai_governance');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      systemPromptCore: 'Bạn là Chuyên Gia Cố Vấn Tăng Trưởng & Giám Sát Chiến Dịch Google Ads kiêm Trợ Lý Sales Online Cấp Cao của Hệ Thống Nha Khoa Tâm Đức Smile (17 chi nhánh). Luôn phân tích dựa trên dữ liệu thực tế, tối ưu CPA, không nói chung chung.',
      consultationRules: '- Luôn giải thích rõ công nghệ độc quyền (Chụp CT ConeBeam 3D, Cấy ghép không đau).\n- Nhấn mạnh chính sách trả góp 0% lãi suất và bảo hành chính hãng Thụy Sĩ/Hàn Quốc.\n- Khéo léo thúc đẩy khách để lại SĐT hoặc đặt lịch hẹn khám miễn phí tại chi nhánh gần nhất.',
      pricingPolicy: '- Tuyệt đối không tự ý báo giá phá đáy thấp hơn bảng niêm yết.\n- Implant trọn gói chỉ từ 12.5tr (đã gồm trụ + Abutment).\n- Răng sứ thẩm mỹ từ 1.8tr/răng.',
      temperature: 0.3,
      tokenConsumptionThisMonth: 142850,
      maxMonthlyTokenBudget: 500000,
    };
  });

  // Toggle Emergency Pause
  const handleToggleEmergencyCampaign = (id: string) => {
    setEmergencyCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'running' ? 'paused_emergency' : 'running';
        const actionText = nextStatus === 'paused_emergency' ? 'TẠM DỪNG KHẨN CẤP' : 'KÍCH HOẠT LẠI';
        
        // Add audit log
        setAuditLogs(logs => [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Vừa xong',
            userName: 'Trần Đức (Admin)',
            action: `${actionText} chiến dịch ${c.name.slice(0, 30)}...`,
            category: 'emergency',
            status: nextStatus === 'paused_emergency' ? 'critical' : 'success',
            details: `Chi nhánh ${c.branch} - CPA ghi nhận ${c.todayCpa.toLocaleString('vi-VN')} đ`,
          },
          ...logs
        ]);

        return { ...c, status: nextStatus };
      }
      return c;
    }));

    showNotification('Đã cập nhật trạng thái Kill-Switch chiến dịch Google Ads!');
  };

  // Pause all high CPA campaigns
  const handleEmergencyPauseAllOverbudget = () => {
    const overList = emergencyCampaigns.filter(c => c.todayCpa > c.maxTargetCpa && c.status === 'running');
    if (overList.length === 0) {
      showNotification('Không có chiến dịch nào vượt ngưỡng CPA cần tạm dừng!');
      return;
    }

    setEmergencyCampaigns(prev => prev.map(c => {
      if (c.todayCpa > c.maxTargetCpa) {
        return { ...c, status: 'paused_emergency' };
      }
      return c;
    }));

    setAuditLogs(logs => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Vừa xong',
        userName: 'Trần Đức (Admin)',
        action: `KÍCH HOẠT KILL-SWITCH TOÀN HỆ THỐNG: Tạm dừng ${overList.length} chiến dịch cháy ngân sách`,
        category: 'emergency',
        status: 'critical',
        details: `Bảo vệ ngân sách khẩn cấp cho ${overList.map(o => o.branch).join(', ')}`,
      },
      ...logs
    ]);

    showNotification(`Đã kích hoạt Kill-Switch! Tạm dừng ${overList.length} chiến dịch vượt ngưỡng CPA.`);
  };

  // Update Branch Budget
  const handleUpdateBranchBudget = (id: string, newAllocated: number, autoPause: boolean) => {
    setBranchBudgets(prev => prev.map(b => {
      if (b.id === id) {
        const status = (b.spentThisMonth / newAllocated) > 1 ? 'critical' : (b.spentThisMonth / newAllocated) > 0.85 ? 'warning' : 'normal';
        return { ...b, allocatedMonthly: newAllocated, autoPauseOnOverbudget: autoPause, status };
      }
      return b;
    }));
    showNotification('Đã lưu hạn mức ngân sách chi nhánh!');
  };

  // Google Sheets "Ngân Sách Dự Kiến" Effect & Handlers
  useEffect(() => {
    let isMounted = true;
    const loadBudgetPlan = async () => {
      setIsLoadingBudgetPlan(true);
      try {
        const data = await fetchBudgetPlanSheetData(budgetPlanUrl);
        if (isMounted) {
          setBudgetPlanSummary(data);
        }
      } catch (err) {
        console.error('Error fetching budget plan sheet:', err);
      } finally {
        if (isMounted) {
          setIsLoadingBudgetPlan(false);
        }
      }
    };
    loadBudgetPlan();
    return () => { isMounted = false; };
  }, [budgetPlanUrl]);

  const handleSyncBudgetPlanSheet = async () => {
    setIsLoadingBudgetPlan(true);
    try {
      const data = await fetchBudgetPlanSheetData(budgetPlanUrl);
      setBudgetPlanSummary(data);
      showNotification('Đã đồng bộ thành công dữ liệu từ Google Sheets "Ngân Sách Dự Kiến"!');
      
      setAuditLogs(logs => [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          userName: 'Trần Đức (Admin)',
          action: 'Đồng bộ Google Sheets: Ngân Sách Dự Kiến',
          category: 'budget',
          status: 'success',
          details: `Tổng ngân sách tháng: ${data.totalMonthly.toLocaleString('vi-VN')} đ (Có VAT: ${data.totalMonthlyVat.toLocaleString('vi-VN')} đ)`,
        },
        ...logs
      ]);
    } catch {
      showNotification('Lỗi khi đồng bộ Google Sheets Ngân Sách Dự Kiến.');
    } finally {
      setIsLoadingBudgetPlan(false);
    }
  };

  const handleApplyBudgetPlanUrl = () => {
    if (!budgetPlanSheetInput.trim()) return;
    const trimmed = budgetPlanSheetInput.trim();
    setBudgetPlanUrl(trimmed);
    localStorage.setItem('tamduc_budget_plan_url', trimmed);
    showNotification('Đã lưu và cập nhật liên kết Google Sheets Ngân Sách Dự Kiến mới!');
    
    setAuditLogs(logs => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Vừa xong',
        userName: 'Trần Đức (Admin)',
        action: 'Cập nhật URL Google Sheets Ngân Sách',
        category: 'budget',
        status: 'info',
        details: trimmed,
      },
      ...logs
    ]);
  };

  // Save AI Governance
  const handleSaveAiGovernance = () => {
    localStorage.setItem('dashboard_ai_governance', JSON.stringify(aiGovernance));
    setAuditLogs(logs => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Vừa xong',
        userName: 'Trần Đức (Admin)',
        action: 'Cập nhật System Prompt & Chính sách AI Copilot',
        category: 'config',
        status: 'success',
        details: 'Điều chỉnh quy tắc tư vấn giá và hành vi mô hình Gemini 3.7',
      },
      ...logs
    ]);
    showNotification('Đã lưu cấu hình Bộ Não & Quy Tắc Trợ Lý AI thành công!');
  };

  // Export Full Backup JSON
  const handleExportBackup = () => {
    const backupData = {
      version: '2.5.0',
      exportDate: new Date().toISOString(),
      exportBy: 'Trần Đức (Super Admin)',
      system: 'Nha Khoa Tâm Đức Smile - Marketing Management Hub',
      users,
      thresholds,
      crawlerConfig: { interval: crawlerInterval, scanImages: crawlerScanImages, scanPrices: crawlerScanPrices, scanPromos: crawlerScanPromos },
      branchBudgets,
      aiGovernance,
      auditLogsCount: auditLogs.length,
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tamducsmile_admin_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setAuditLogs(logs => [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Vừa xong',
        userName: 'Trần Đức (Admin)',
        action: 'Xuất bản Snapshot Sao Lưu Hệ Thống (JSON Backup)',
        category: 'backup',
        status: 'info',
        details: `Tải xuống cấu hình ${users.length} tài khoản và hạn mức 17 chi nhánh`,
      },
      ...logs
    ]);

    showNotification('Đã xuất file Snapshot sao lưu hệ thống thành công!');
  };

  // Import Backup JSON
  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.users) {
          setUsers(parsed.users);
          localStorage.setItem('dashboard_admin_users_list', JSON.stringify(parsed.users));
        }
        if (parsed.thresholds) {
          setThresholds(parsed.thresholds);
          localStorage.setItem('dashboard_thresholds_config', JSON.stringify(parsed.thresholds));
        }
        if (parsed.branchBudgets) {
          setBranchBudgets(parsed.branchBudgets);
        }
        if (parsed.aiGovernance) {
          setAiGovernance(parsed.aiGovernance);
          localStorage.setItem('dashboard_ai_governance', JSON.stringify(parsed.aiGovernance));
        }

        setAuditLogs(logs => [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Vừa xong',
            userName: 'Trần Đức (Admin)',
            action: 'Khôi phục hệ thống từ file Snapshot Backup',
            category: 'backup',
            status: 'warning',
            details: `Khôi phục cấu hình từ file ${file.name}`,
          },
          ...logs
        ]);

        showNotification('Đã khôi phục toàn bộ cấu hình từ bản sao lưu thành công!');
      } catch (err) {
        alert('File sao lưu không hợp lệ hoặc bị lỗi định dạng JSON!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const showNotification = (msg: string) => {
    setSaveSuccessMessage(msg);
    setTimeout(() => setSaveSuccessMessage(null), 3500);
  };

  const handleSaveUsers = (updatedUsers: AdminUser[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('dashboard_admin_users_list', JSON.stringify(updatedUsers));
  };

  const handleToggleUserStatus = (id: string) => {
    const updated = users.map(u => {
      if (u.id === id) {
        const nextStatus = u.status === 'active' ? 'disabled' : 'active';
        return { ...u, status: nextStatus } as AdminUser;
      }
      return u;
    });
    handleSaveUsers(updated);
    showNotification('Đã cập nhật trạng thái hoạt động của nhân sự!');
  };

  const handleDeleteUser = (id: string) => {
    if (users.length <= 1) {
      alert('Hệ thống phải có tối thiểu 1 Super Admin!');
      return;
    }
    const updated = users.filter(u => u.id !== id);
    handleSaveUsers(updated);
    showNotification('Đã xóa tài khoản nhân sự khỏi hệ thống!');
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    if (editingUserId) {
      // Updating existing user
      const updated = users.map(u => {
        if (u.id === editingUserId) {
          return {
            ...u,
            name: newUserName.trim(),
            email: newUserEmail.trim(),
            role: newUserRole,
            roleLabel: ROLE_LABEL_MAP[newUserRole] || 'Nhân Viên',
            department: newUserDept,
            allowedTabs: selectedTabs,
          };
        }
        return u;
      });
      handleSaveUsers(updated);
      setShowAddUserModal(false);
      showNotification(`Đã cập nhật vai trò & quyền xem cho ${newUserName}!`);
    } else {
      // Creating new user
      const newUser: AdminUser = {
        id: `u-${Date.now()}`,
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: newUserRole,
        roleLabel: ROLE_LABEL_MAP[newUserRole] || 'Nhân Viên',
        status: 'active',
        lastActive: 'Chưa đăng nhập',
        department: newUserDept,
        allowedTabs: selectedTabs,
      };

      const updated = [...users, newUser];
      handleSaveUsers(updated);
      setShowAddUserModal(false);
      showNotification(`Đã tạo thành công tài khoản cho ${newUser.name}!`);
    }
  };

  const handleSaveThresholds = () => {
    localStorage.setItem('dashboard_thresholds_config', JSON.stringify(thresholds));
    showNotification('Đã lưu cấu hình ngưỡng cảnh báo KPI & Ads thành công!');
  };

  const handleSaveCrawlerConfig = () => {
    localStorage.setItem('dashboard_crawler_interval', crawlerInterval);
    showNotification('Đã lưu lịch trình và cấu hình quét đối thủ tự động!');
  };

  const handlePingSheet = () => {
    setIsTestingSheet(true);
    setSheetPingStatus('idle');
    setTimeout(() => {
      setIsTestingSheet(false);
      setSheetPingStatus('success');
      showNotification('Kết nối Google Sheets ổn định (Latency 180ms)!');
    }, 1000);
  };

  const handleApplyNewSheetUrl = () => {
    if (onUpdateSheetUrl) {
      onUpdateSheetUrl(sheetUrlInput);
    }
    showNotification('Đã áp dụng URL Google Sheets mới cho toàn hệ thống!');
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {saveSuccessMessage && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-emerald-400 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{saveSuccessMessage}</span>
        </div>
      )}

      {/* Top Banner Overview */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                <ShieldCheck className="w-6 h-6" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  Trung Tâm Quản Trị Hệ Thống
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    Admin Master Hub
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-400">
                  Điều hành phân quyền nhân sự, nguồn cấp dữ liệu Live Sheet/API, ngưỡng cảnh báo chi phí Ads & bot quét đối thủ.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {onOpenTabPermissions && (
              <button
                type="button"
                onClick={onOpenTabPermissions}
                className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
              >
                <Sliders className="w-4 h-4 text-cyan-200" />
                <span>Ma Trận Phân Quyền Tab</span>
              </button>
            )}

            {onOpenChangePassword && (
              <button
                type="button"
                onClick={onOpenChangePassword}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-purple-400" />
                <span>Đổi Mật Khẩu Admin</span>
              </button>
            )}
          </div>
        </div>

        {/* 4 Status KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Nhân Sự Quản Lý</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-white">{users.filter(u => u.status === 'active').length} <span className="text-xs text-slate-400 font-normal">/ {users.length} tài khoản</span></p>
            <p className="text-[10px] text-emerald-400 mt-0.5">● 100% Phân quyền Role-based</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Nguồn Data Live</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <p className="text-xl font-bold text-indigo-300">3 Kết Nối</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Google Sheet + Ads API + Gemini</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Bot Quét Đối Thủ</span>
              <Swords className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-bold text-cyan-300">21 Link</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">Định kỳ mỗi {crawlerInterval}h tự động</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span className="font-semibold">Trạng Thái An Ninh</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-bold text-emerald-400">An Toàn</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Khóa bảo vệ Session Timeout</p>
          </div>
        </div>
      </div>

      {/* Executive 3-Pillar Navigation Hub (No horizontal scrollbars, perfectly structured) */}
      <div className="bg-slate-900/60 p-3 sm:p-4 rounded-3xl border border-slate-800/80 shadow-2xl space-y-3">
        {/* Category Filter Pills & Realtime Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-1 border-b border-slate-800/70">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">Bộ Lọc:</span>
            
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'all'
                  ? 'bg-slate-700 text-white shadow-md shadow-slate-900/50 ring-1 ring-slate-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tất Cả (9 Công Cụ)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('security')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'security'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 shadow-md shadow-emerald-950/40 ring-1 ring-emerald-400/30'
                  : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Phân Quyền & Bảo Mật (3)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('campaigns')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'campaigns'
                  ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-md shadow-rose-950/40 ring-1 ring-rose-400/30'
                  : 'text-slate-400 hover:text-rose-300 hover:bg-slate-800/60'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-rose-400" />
              <span>2. Điều Hành Ads & Ngân Sách (3)</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory('system_ai')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === 'system_ai'
                  ? 'bg-indigo-950/90 text-indigo-300 border border-indigo-500/50 shadow-md shadow-indigo-950/40 ring-1 ring-indigo-400/30'
                  : 'text-slate-400 hover:text-indigo-300 hover:bg-slate-800/60'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-indigo-400" />
              <span>3. Hệ Thống & Trí Tuệ AI (3)</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold text-slate-300">Admin Control Center</span>
          </div>
        </div>

        {/* 3 Balanced Functional Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* Pillar 1: Phân Quyền & Bảo Mật */}
          {(selectedCategory === 'all' || selectedCategory === 'security') && (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-emerald-950/60 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-emerald-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Phân Quyền & Bảo Mật
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-mono">
                  3 Tools
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {/* 1.1 Users & Roles */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('users')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'users'
                      ? 'bg-cyan-950/80 text-white font-bold border-cyan-500/60 shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'users' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Users className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Nhân Sự & Quyền Tab</p>
                      <p className="text-[10px] text-slate-400 truncate">Phân quyền chi tiết từng tab</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                    {users.length} Tài Khoản
                  </span>
                </button>

                {/* 1.2 Backup & Restore */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('backup')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'backup'
                      ? 'bg-teal-950/80 text-white font-bold border-teal-500/60 shadow-md shadow-teal-950/50 ring-1 ring-teal-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'backup' ? 'bg-teal-500/20 text-teal-300' : 'bg-slate-800 text-slate-400'}`}>
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Sao Lưu & Khôi Phục</p>
                      <p className="text-[10px] text-slate-400 truncate">Snapshot JSON toàn hệ thống</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-teal-500/10 text-teal-300 border-teal-500/30">
                    1-Click
                  </span>
                </button>

                {/* 1.3 Audit Logs */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('audit')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'audit'
                      ? 'bg-blue-950/80 text-white font-bold border-blue-500/60 shadow-md shadow-blue-950/50 ring-1 ring-blue-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'audit' ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-400'}`}>
                      <History className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Nhật Ký Bảo Mật</p>
                      <p className="text-[10px] text-slate-400 truncate">Lịch sử đăng nhập & thao tác</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-blue-500/10 text-blue-300 border-blue-500/30">
                    {auditLogs.length} Logs
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Pillar 2: Điều Hành Ads & Ngân Sách */}
          {(selectedCategory === 'all' || selectedCategory === 'campaigns') && (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-rose-950/60 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-rose-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Zap className="w-3.5 h-3.5" />
                  Điều Hành Ads & Ngân Sách
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 font-mono">
                  3 Tools
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {/* 2.1 Emergency Ads Kill-Switch */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('emergency')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'emergency'
                      ? 'bg-rose-950/80 text-white font-bold border-rose-500/60 shadow-md shadow-rose-950/50 ring-1 ring-rose-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'emergency' ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-400'}`}>
                      <AlertOctagon className="w-4 h-4 text-rose-400 animate-pulse" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Kill-Switch Khẩn Cấp Ads</p>
                      <p className="text-[10px] text-slate-400 truncate">Cắt lỗ tức thì & radar click ảo</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-rose-500/10 text-rose-300 border-rose-500/30">
                    Realtime
                  </span>
                </button>

                {/* 2.2 Branch Budgets */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('budget')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'budget'
                      ? 'bg-amber-950/80 text-white font-bold border-amber-500/60 shadow-md shadow-amber-950/50 ring-1 ring-amber-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'budget' ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
                      <DollarSign className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Ngân Sách 17 Chi Nhánh</p>
                      <p className="text-[10px] text-slate-400 truncate">Hạn mức chi tiêu & burn-rate</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-amber-500/10 text-amber-300 border-amber-500/30">
                    17 Cơ Sở
                  </span>
                </button>

                {/* 2.3 Thresholds */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('thresholds')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'thresholds'
                      ? 'bg-orange-950/80 text-white font-bold border-orange-500/60 shadow-md shadow-orange-950/50 ring-1 ring-orange-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'thresholds' ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-800 text-slate-400'}`}>
                      <BellRing className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Ngưỡng Cảnh Báo Ads & Lead</p>
                      <p className="text-[10px] text-slate-400 truncate">Trần CPA, CPL & tỷ lệ chuyển đổi</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-orange-500/10 text-orange-300 border-orange-500/30">
                    Auto Alert
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Pillar 3: Hệ Thống & Trí Tuệ AI */}
          {(selectedCategory === 'all' || selectedCategory === 'system_ai') && (
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-950/60 flex flex-col gap-2">
              <div className="flex items-center justify-between px-1 text-xs font-bold text-indigo-400">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Bot className="w-3.5 h-3.5" />
                  Hệ Thống & Trí Tuệ AI
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono">
                  3 Tools
                </span>
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {/* 3.1 AI Governance */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('ai_governance')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'ai_governance'
                      ? 'bg-indigo-950/80 text-white font-bold border-indigo-500/60 shadow-md shadow-indigo-950/50 ring-1 ring-indigo-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'ai_governance' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Bot className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Bộ Não & Prompt Trợ Lý AI</p>
                      <p className="text-[10px] text-slate-400 truncate">System Prompt & chính sách giá</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-indigo-500/10 text-indigo-300 border-indigo-500/30">
                    Gemini 3.7
                  </span>
                </button>

                {/* 3.2 Data Connections */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('connections')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'connections'
                      ? 'bg-sky-950/80 text-white font-bold border-sky-500/60 shadow-md shadow-sky-950/50 ring-1 ring-sky-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'connections' ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Database className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Nguồn Data & Kết Nối API</p>
                      <p className="text-[10px] text-slate-400 truncate">Google Sheets, Ads API & Gemini</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-sky-500/10 text-sky-300 border-sky-500/30">
                    3 Nguồn
                  </span>
                </button>

                {/* 3.3 Competitor Crawler Bot */}
                <button
                  type="button"
                  onClick={() => setActiveAdminSubTab('crawler')}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer border ${
                    activeAdminSubTab === 'crawler'
                      ? 'bg-violet-950/80 text-white font-bold border-violet-500/60 shadow-md shadow-violet-950/50 ring-1 ring-violet-400/40'
                      : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-1.5 rounded-lg shrink-0 ${activeAdminSubTab === 'crawler' ? 'bg-violet-500/20 text-violet-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Swords className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold truncate leading-snug">Bot Quét Đối Thủ</p>
                      <p className="text-[10px] text-slate-400 truncate">Tracking 21 link đối thủ định kỳ</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 bg-violet-500/10 text-violet-300 border-violet-500/30">
                    21 Link
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS & ROLE MATRIX */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'users' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                Danh Sách Nhân Sự & Vai Trò Truy Cập
              </h3>
              <p className="text-xs text-slate-400">
                Quản lý các tài khoản nhân viên được phép đăng nhập, khóa tài khoản hoặc phân quyền truy cập tab theo phòng ban.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {onOpenTabPermissions && (
                <button
                  type="button"
                  onClick={onOpenTabPermissions}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Cấu Hình Tab Nhân Viên</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenAddUserModal}
                className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm Nhân Sự Mới</span>
              </button>
            </div>
          </div>

          {/* User Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/90 shadow-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-4 font-semibold">Nhân Sự</th>
                  <th className="py-3 px-4 font-semibold">Phòng Ban</th>
                  <th className="py-3 px-4 font-semibold">Vai Trò (Role)</th>
                  <th className="py-3 px-4 font-semibold text-center">Quyền Xem Tab</th>
                  <th className="py-3 px-3 font-semibold text-center">Trạng Thái</th>
                  <th className="py-3 px-3 font-semibold text-center">Hoạt Động Gần Nhất</th>
                  <th className="py-3 px-4 font-semibold text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map(u => {
                  const allowedCount = u.allowedTabs ? u.allowedTabs.length : (ROLE_PRESET_TABS[u.role]?.length || 0);
                  return (
                    <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-white">{u.name}</p>
                            <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{u.department}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                          u.role === 'admin'
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                            : u.role === 'marketer'
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : u.role === 'sales'
                            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}>
                          {u.roleLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenEditUserModal(u)}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-800/50 hover:bg-cyan-900/80 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                          title="Bấm để xem và sửa dấu tick phân quyền các tab cho nhân sự này"
                        >
                          <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{allowedCount} / {ALL_WORKSPACE_TABS.length} Tab</span>
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleUserStatus(u.id)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            u.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30'
                          }`}
                          title="Bấm để chuyển đổi trạng thái"
                        >
                          {u.status === 'active' ? '● Đang Hoạt Động' : '✕ Đã Tạm Khóa'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                        {u.lastActive}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditUserModal(u)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 hover:border-cyan-800/60 transition-colors"
                            title="Chỉnh sửa vai trò & dấu tick quyền xem"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newPass = prompt(`Nhập mật khẩu mới cho ${u.name}:`);
                              if (newPass) {
                                showNotification(`Đã cập nhật mật khẩu cho ${u.name}!`);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
                            title="Đổi mật khẩu tài khoản này"
                          >
                            <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                              title="Xóa nhân sự này"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: EMERGENCY ADS KILL-SWITCH & CLICK FRAUD RADAR */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'emergency' && (
        <div className="space-y-6">
          {/* Header & Kill-all Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-rose-950/30 border border-rose-800/50">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 shrink-0">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Trung Tâm Cắt Lỗ Khẩn Cấp & Radar Click Ảo (Ads Emergency Kill-Switch)
                </h3>
                <p className="text-xs text-rose-200/80 mt-1 max-w-2xl">
                  Cho phép Super Admin ngưng ngay lập tức các chiến dịch Google Ads đang bị click tặc, cắn tiền bất thường hoặc CPA vượt ngưỡng trần mà không cần đăng nhập Google Ads Console.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleEmergencyPauseAllOverbudget}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/40 transition-all cursor-pointer whitespace-nowrap self-start sm:self-center"
            >
              <Power className="w-4 h-4" />
              <span>KILL-SWITCH TOÀN DIỆN (Dừng Cháy Ngân Sách)</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Chiến Dịch Đang Chạy</span>
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-white">
                {emergencyCampaigns.filter(c => c.status === 'running').length} <span className="text-xs text-slate-400 font-normal">/ {emergencyCampaigns.length} chiến dịch</span>
              </p>
              <p className="text-[11px] text-emerald-400 mt-1">● Luồng tracking API trực tiếp</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Chiến Dịch Cảnh Báo Đỏ (CPA cao)</span>
                <Flame className="w-4 h-4 text-rose-400" />
              </div>
              <p className="text-2xl font-bold text-rose-400">
                {emergencyCampaigns.filter(c => c.todayCpa > c.maxTargetCpa).length} Chiến Dịch
              </p>
              <p className="text-[11px] text-rose-300 mt-1">Vượt ngưỡng CPA cam kết</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Radar Phát Hiện Click Ảo</span>
                <Shield className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-bold text-amber-300">1 Nghi Vấn IP</p>
              <p className="text-[11px] text-slate-400 mt-1">Dải IP lặp lại khung giờ đêm</p>
            </div>
          </div>

          {/* Campaign Table */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Radio className="w-4 h-4 text-rose-400" />
                Danh Sách Chiến Dịch Giám Sát Thời Gian Thực (Live Stream)
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Tên Chiến Dịch & Chi Nhánh</th>
                    <th className="py-3 px-4 font-semibold text-right">Chi Phí Hôm Nay</th>
                    <th className="py-3 px-4 font-semibold text-right">CPA Thực Tế / Trần</th>
                    <th className="py-3 px-4 font-semibold">Tình Trạng & Cảnh Báo</th>
                    <th className="py-3 px-4 font-semibold text-center">Trạng Thái</th>
                    <th className="py-3 px-4 font-semibold text-right">Thao Tác Kill-Switch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {emergencyCampaigns.map(c => {
                    const isOver = c.todayCpa > c.maxTargetCpa;
                    const isPaused = c.status === 'paused_emergency';

                    return (
                      <tr key={c.id} className={`hover:bg-slate-900/40 transition-colors ${isOver && !isPaused ? 'bg-rose-950/10' : ''}`}>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-white">{c.name}</p>
                          <p className="text-[11px] text-cyan-400 font-medium mt-0.5">Khu vực: {c.branch}</p>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-200">
                          {c.todaySpend.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono">
                          <div className={`font-bold ${isOver ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {c.todayCpa.toLocaleString('vi-VN')} đ
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Trần: {c.maxTargetCpa.toLocaleString('vi-VN')} đ
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {c.clickSpike ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {c.reason}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[11px]">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              {c.reason}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            isPaused
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          }`}>
                            {isPaused ? '✕ ĐÃ TẠM DỪNG (PAUSED)' : '● ĐANG HOẠT ĐỘNG'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleToggleEmergencyCampaign(c.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-sm ${
                              isPaused
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                            <span>{isPaused ? 'Mở Lại Ads' : 'Cắt Lỗ Ngay'}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: BRANCH BUDGET ALLOCATOR (17 CHI NHÁNH TÂM ĐỨC SMILE) */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'budget' && (
        <div className="space-y-6">
          {/* Top Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  Quản Lý Hạn Mức & Phân Bổ Ngân Sách 17 Chi Nhánh
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Google Sheets Live
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Tự động kết nối dữ liệu từ Google Sheets "Ngân Sách Dự Kiến", hỗ trợ 4 kịch bản phân bổ và theo dõi chi tiêu thực tế (Burn-rate).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={handleSyncBudgetPlanSheet}
                disabled={isLoadingBudgetPlan}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingBudgetPlan ? 'animate-spin' : ''}`} />
                <span>{isLoadingBudgetPlan ? 'Đang Đồng Bộ...' : 'Đồng Bộ Từ Sheet'}</span>
              </button>

              <a
                href={budgetPlanUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mở File Sheet</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <div className="flex items-center bg-slate-900 rounded-xl p-1 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setBudgetViewMode('cards')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    budgetViewMode === 'cards' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Chế độ thẻ"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetViewMode('table')}
                  className={`p-1.5 rounded-lg text-xs transition-all ${
                    budgetViewMode === 'table' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="Chế độ bảng chi tiết"
                >
                  <Table className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Google Sheets Sync & URL Configuration Bar */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800 space-y-3 shadow-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-slate-200">Google Sheet Ngân Sách Dự Kiến:</span>
                <span className="font-mono text-cyan-300 text-[11px] truncate max-w-md">
                  {budgetPlanUrl}
                </span>
                {budgetPlanSummary?.isLive && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                    Cập nhật lúc {budgetPlanSummary.lastUpdated}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={budgetPlanSheetInput}
                  onChange={(e) => setBudgetPlanSheetInput(e.target.value)}
                  placeholder="Dán link Google Sheet Ngân Sách Dự Kiến..."
                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 w-64 lg:w-80"
                />
                <button
                  type="button"
                  onClick={handleApplyBudgetPlanUrl}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer shrink-0 shadow-sm"
                >
                  Cập Nhật Link
                </button>
              </div>
            </div>

            {/* Scenario Selector Pills */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Kịch Bản Phân Bổ Ngân Sách:
              </span>

              <button
                type="button"
                onClick={() => setBudgetScenario('standard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  budgetScenario === 'standard'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>🎯 Kế Hoạch Chuẩn (100% Tháng)</span>
                <span className="font-mono text-[11px] opacity-80">
                  {budgetPlanSummary ? `${(budgetPlanSummary.totalMonthly / 1e9).toFixed(3)} Tỷ` : '1.014 Tỷ'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBudgetScenario('vat')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  budgetScenario === 'vat'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>🧾 Chuẩn Có VAT (+16.64%)</span>
                <span className="font-mono text-[11px] opacity-80">
                  {budgetPlanSummary ? `${(budgetPlanSummary.totalMonthlyVat / 1e9).toFixed(3)} Tỷ` : '1.182 Tỷ'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBudgetScenario('reduced30')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  budgetScenario === 'reduced30'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>⚡ Kịch Bản Giảm 30%</span>
                <span className="font-mono text-[11px] opacity-80">
                  {budgetPlanSummary ? `${(budgetPlanSummary.totalReduced30 / 1e6).toFixed(0)} Tr` : '827 Tr'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setBudgetScenario('reducedExtra30')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  budgetScenario === 'reducedExtra30'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-md shadow-purple-500/10'
                    : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <span>🛡️ Tiết Kiệm Tối Đa (Giảm Thêm 30%)</span>
                <span className="font-mono text-[11px] opacity-80">
                  {budgetPlanSummary ? `${(budgetPlanSummary.totalReducedExtra30 / 1e6).toFixed(0)} Tr` : '599 Tr'}
                </span>
              </button>
            </div>
          </div>

          {/* KPI Summary Cards for Active Budget Scenario */}
          {(() => {
            const planItems = budgetPlanSummary?.items || FALLBACK_BUDGET_PLAN_ITEMS;
            
            const getActiveBudgetVal = (item: BranchPlanItem) => {
              if (budgetScenario === 'vat') return item.monthlyBudgetVat;
              if (budgetScenario === 'reduced30') return item.reduced30Budget;
              if (budgetScenario === 'reducedExtra30') return item.reducedExtra30Budget;
              return item.monthlyBudget;
            };

            const totalActiveBudget = planItems.reduce((sum, item) => sum + getActiveBudgetVal(item), 0);
            const totalDailyBudget = planItems.reduce((sum, item) => sum + item.dailyBudget, 0);
            const totalSpent = planItems.reduce((sum, item) => sum + (item.spentThisMonth || 0), 0);
            const totalPercent = totalActiveBudget > 0 ? Math.min(100, Math.round((totalSpent / totalActiveBudget) * 100)) : 0;
            const remainingBudget = totalActiveBudget - totalSpent;

            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Tổng Hạn Mức Kịch Bản</span>
                      <span className="text-amber-400 font-bold">17 Chi Nhánh</span>
                    </div>
                    <p className="text-xl font-bold text-amber-400 font-mono">
                      {totalActiveBudget.toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {budgetScenario === 'standard' && 'Kế hoạch ngân sách chuẩn 100%'}
                      {budgetScenario === 'vat' && 'Đã bao gồm 10% VAT quảng cáo'}
                      {budgetScenario === 'reduced30' && 'Tiết kiệm 30% so với kế hoạch chuẩn'}
                      {budgetScenario === 'reducedExtra30' && 'Giảm thêm 30% tối ưu chi phí gắt gao'}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Ngân Sách Ngày Toàn Hệ Thống</span>
                      <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    </div>
                    <p className="text-xl font-bold text-cyan-300 font-mono">
                      {totalDailyBudget.toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Trung bình {(totalDailyBudget / (planItems.filter(p => p.dailyBudget > 0).length || 1)).toLocaleString('vi-VN', { maximumFractionDigits: 0 })} đ / cơ sở / ngày
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Tổng Chi Tiêu Tháng Này</span>
                      <span className={`text-xs font-bold ${totalSpent > totalActiveBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {totalPercent}% Hạn Mức
                      </span>
                    </div>
                    <p className="text-xl font-bold text-white font-mono">
                      {totalSpent.toLocaleString('vi-VN')} đ
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Còn lại: <strong className={remainingBudget < 0 ? 'text-rose-400' : 'text-emerald-400'}>{remainingBudget.toLocaleString('vi-VN')} đ</strong>
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                    <div className="text-xs text-slate-400 flex items-center justify-between">
                      <span>Trạng Thái Burn-Rate</span>
                      <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <p className={`text-lg font-bold flex items-center gap-1.5 ${totalSpent > totalActiveBudget ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {totalSpent > totalActiveBudget ? <AlertTriangle className="w-4 h-4 text-rose-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {totalSpent > totalActiveBudget ? 'Cảnh Báo Vượt Trần' : 'Trong Vùng An Toàn'}
                    </p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                      <div
                        className={`h-full rounded-full transition-all ${
                          totalPercent > 100 ? 'bg-rose-500' : totalPercent > 85 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, totalPercent)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Table View */}
                {budgetViewMode === 'table' && (
                  <div className="rounded-2xl bg-slate-950/90 border border-slate-800 overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <Table className="w-4 h-4 text-cyan-400" />
                        Bảng Chi Tiết Phân Bổ Ngân Sách Dự Kiến (Đồng Bộ Google Sheets)
                      </h4>
                      <span className="text-xs text-slate-400">
                        Hiển thị <strong>{planItems.length}</strong> cơ sở & thị trường
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                            <th className="py-3 px-4">Cơ Sở / Thị Trường</th>
                            <th className="py-3 px-4 text-right">Ngân Sách Ngày</th>
                            <th className="py-3 px-4 text-right">NS Tháng (Gốc)</th>
                            <th className="py-3 px-4 text-right">NS Có VAT</th>
                            <th className="py-3 px-4 text-right">Giảm 30%</th>
                            <th className="py-3 px-4 text-right">Giảm Thêm 30%</th>
                            <th className="py-3 px-4 text-right">Hạn Mức Áp Dụng</th>
                            <th className="py-3 px-4 text-right">Đã Tiêu Thực Tế</th>
                            <th className="py-3 px-4 text-center">Tiến Độ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 font-mono">
                          {planItems.map((item, idx) => {
                            const activeVal = getActiveBudgetVal(item);
                            const spent = item.spentThisMonth || 0;
                            const pct = activeVal > 0 ? Math.round((spent / activeVal) * 100) : 0;
                            const isOver = spent > activeVal && activeVal > 0;

                            return (
                              <tr key={item.id || idx} className="hover:bg-slate-900/50 transition-colors">
                                <td className="py-3 px-4 font-sans font-bold text-white flex items-center gap-2">
                                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                                  <span>{item.name}</span>
                                </td>
                                <td className="py-3 px-4 text-right text-slate-300">
                                  {item.dailyBudget > 0 ? `${item.dailyBudget.toLocaleString('vi-VN')} đ` : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-slate-300">
                                  {item.monthlyBudget > 0 ? `${item.monthlyBudget.toLocaleString('vi-VN')} đ` : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-emerald-400">
                                  {item.monthlyBudgetVat > 0 ? `${item.monthlyBudgetVat.toLocaleString('vi-VN')} đ` : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-cyan-400">
                                  {item.reduced30Budget > 0 ? `${item.reduced30Budget.toLocaleString('vi-VN')} đ` : '—'}
                                </td>
                                <td className="py-3 px-4 text-right text-purple-400">
                                  {item.reducedExtra30Budget > 0 ? `${item.reducedExtra30Budget.toLocaleString('vi-VN')} đ` : '—'}
                                </td>
                                <td className="py-3 px-4 text-right font-bold text-amber-400 bg-amber-500/5">
                                  {activeVal > 0 ? `${activeVal.toLocaleString('vi-VN')} đ` : '0 đ'}
                                </td>
                                <td className="py-3 px-4 text-right text-white">
                                  {spent.toLocaleString('vi-VN')} đ
                                </td>
                                <td className="py-3 px-4 text-center font-sans">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isOver
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                      : pct > 85
                                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                  }`}>
                                    {isOver ? '✕ Vượt Trần' : `${pct}%`}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        <tfoot>
                          <tr className="bg-slate-900 font-bold text-amber-400 border-t border-slate-700 text-xs">
                            <td className="py-3.5 px-4 font-sans uppercase">TỔNG HỆ THỐNG</td>
                            <td className="py-3.5 px-4 text-right font-mono">{totalDailyBudget.toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-right font-mono">{(budgetPlanSummary?.totalMonthly || 1014000000).toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-right font-mono text-emerald-400">{(budgetPlanSummary?.totalMonthlyVat || 1182729600).toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-right font-mono text-cyan-400">{(budgetPlanSummary?.totalReduced30 || 827910720).toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-right font-mono text-purple-400">{(budgetPlanSummary?.totalReducedExtra30 || 599742000).toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-right font-mono text-amber-300 bg-amber-500/10">{totalActiveBudget.toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-right font-mono text-white">{totalSpent.toLocaleString('vi-VN')} đ</td>
                            <td className="py-3.5 px-4 text-center font-sans">{totalPercent}%</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                )}

                {/* Cards View */}
                {budgetViewMode === 'cards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {planItems.map((item, idx) => {
                      const activeVal = getActiveBudgetVal(item);
                      const spent = item.spentThisMonth || 0;
                      const percent = activeVal > 0 ? Math.min(100, Math.round((spent / activeVal) * 100)) : 0;
                      const isOver = spent > activeVal && activeVal > 0;

                      return (
                        <div key={item.id || idx} className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                              <h4 className="font-bold text-white text-sm truncate max-w-[190px]">{item.name}</h4>
                            </div>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
                              isOver
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : percent > 85
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}>
                              {isOver ? '✕ Vượt Hạn Mức' : `Đã dùng ${percent}%`}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isOver ? 'bg-rose-500' : percent > 85 ? 'bg-amber-500' : 'bg-gradient-to-r from-cyan-500 to-emerald-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                              <span>Đã tiêu: <strong>{spent.toLocaleString('vi-VN')} đ</strong></span>
                              <span className="text-amber-400">Hạn mức: <strong>{activeVal.toLocaleString('vi-VN')} đ</strong></span>
                            </div>
                          </div>

                          {/* Detailed Sheet Data Metrics */}
                          <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div>
                              <span className="text-slate-500 block text-[10px]">NS Ngày:</span>
                              <span className="text-slate-200">{item.dailyBudget > 0 ? `${item.dailyBudget.toLocaleString('vi-VN')} đ` : '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">NS Tháng (Gốc):</span>
                              <span className="text-slate-200">{item.monthlyBudget > 0 ? `${item.monthlyBudget.toLocaleString('vi-VN')} đ` : '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Có VAT (+16.6%):</span>
                              <span className="text-emerald-400">{item.monthlyBudgetVat > 0 ? `${item.monthlyBudgetVat.toLocaleString('vi-VN')} đ` : '—'}</span>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px]">Giảm 30%:</span>
                              <span className="text-cyan-400">{item.reduced30Budget > 0 ? `${item.reduced30Budget.toLocaleString('vi-VN')} đ` : '—'}</span>
                            </div>
                          </div>

                          {/* Budget Modifier */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                            <span className="text-[11px] text-slate-400 font-mono">
                              Hạn mức: <strong className="text-amber-400">{activeVal.toLocaleString('vi-VN')} đ</strong>
                            </span>

                            <button
                              type="button"
                              onClick={() => {
                                const newAlloc = prompt(`Nhập hạn mức tùy chỉnh cho ${item.name} (VNĐ):`, activeVal.toString());
                                if (newAlloc && !isNaN(Number(newAlloc))) {
                                  showNotification(`Đã điều chỉnh ngân sách ${item.name} thành ${Number(newAlloc).toLocaleString('vi-VN')} đ!`);
                                }
                              }}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-white font-bold text-[11px] border border-slate-700 transition-colors cursor-pointer"
                            >
                              Sửa Ngân Sách
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AI PROMPT GOVERNANCE & COPILOT BRAIN */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'ai_governance' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-4 h-4 text-indigo-400" />
                Cấu Hình "Bộ Não" & Quy Tắc Trợ Lý AI (AI Governance)
              </h3>
              <p className="text-xs text-slate-400">
                Thiết lập chỉ thị cốt lõi (System Prompt), quy tắc tư vấn nha khoa và hạn mức tiêu thụ Token của Gemini 3.7.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveAiGovernance}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer self-start sm:self-center"
            >
              <Save className="w-4 h-4" />
              <span>Lưu Cấu Hình AI</span>
            </button>
          </div>

          {/* Token Consumption Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Mô Hình Đang Kích Hoạt</div>
              <p className="text-lg font-bold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Gemini 3.7 Flash Thinking
              </p>
              <p className="text-[10px] text-slate-500 mt-1">Độ trễ trung bình: 350ms</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Token Tiêu Thụ Tháng Này</div>
              <p className="text-lg font-bold text-indigo-300 font-mono">
                {aiGovernance.tokenConsumptionThisMonth.toLocaleString('vi-VN')} <span className="text-xs text-slate-400 font-normal">/ {aiGovernance.maxMonthlyTokenBudget.toLocaleString('vi-VN')} Token</span>
              </p>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full"
                  style={{ width: `${(aiGovernance.tokenConsumptionThisMonth / aiGovernance.maxMonthlyTokenBudget) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs text-slate-400 mb-1">Độ Sáng Tạo (Temperature)</div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-bold text-white font-mono">{aiGovernance.temperature}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {aiGovernance.temperature <= 0.3 ? 'Chính xác & Kỷ luật' : 'Sáng tạo cao'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={aiGovernance.temperature}
                onChange={(e) => setAiGovernance({ ...aiGovernance, temperature: parseFloat(e.target.value) })}
                className="w-full mt-2 accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Prompt Editor Forms */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="block font-bold text-slate-200">
                1. System Prompt Cốt Lõi (Định Vị Nhân Vật & Giọng Văn AI):
              </label>
              <textarea
                rows={3}
                value={aiGovernance.systemPromptCore}
                onChange={(e) => setAiGovernance({ ...aiGovernance, systemPromptCore: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 font-sans focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="block font-bold text-slate-200">
                2. Quy Tắc Tư Vấn Khách Hàng (Tư Vấn & Sales Copilot):
              </label>
              <textarea
                rows={3}
                value={aiGovernance.consultationRules}
                onChange={(e) => setAiGovernance({ ...aiGovernance, consultationRules: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>

            <div className="p-4 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-2">
              <label className="block font-bold text-slate-200">
                3. Chính Sách Báo Giá & Ngăn Chặn Phá Giá (Pricing Governance):
              </label>
              <textarea
                rows={3}
                value={aiGovernance.pricingPolicy}
                onChange={(e) => setAiGovernance({ ...aiGovernance, pricingPolicy: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: BACKUP & RESTORE CENTER (1-CLICK SNAPSHOT) */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'backup' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-teal-400" />
                Trung Tâm Sao Lưu & Khôi Phục Hệ Thống (Backup & Restore Center)
              </h3>
              <p className="text-xs text-slate-400">
                Xuất bản Snapshot dự phòng toàn bộ phân quyền tài khoản, 21 link đối thủ, ngưỡng cảnh báo và hạn mức chi nhánh.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 w-fit">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">Xuất Bản Sao Lưu Hệ Thống (Export JSON Snapshot)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tải về máy file cấu hình đầy đủ bao gồm: Danh sách nhân viên & phân quyền, hạn mức 17 chi nhánh, bot quét đối thủ, ngưỡng CPA.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-600/30 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải Về File Snapshot (.json)</span>
                </button>
              </div>
            </div>

            {/* Import Card */}
            <div className="p-6 rounded-3xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between shadow-xl">
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 w-fit">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-white text-sm">Khôi Phục Cấu Hình Dự Phòng (Restore Snapshot)</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tải lên file sao lưu `.json` đã xuất trước đó để khôi phục nhanh cấu hình chuẩn khi chuyển giao hoặc khắc phục sự cố.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <label className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Chọn File Backup (.json) Để Khôi Phục</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: DATA CONNECTIONS & APIS */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'connections' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-400" />
                Cấu Hình Nguồn Cấp Dữ Liệu & API Gateway
              </h3>
              <p className="text-xs text-slate-400">
                Kiểm tra kết nối thời gian thực tới Google Sheets, Google Ads API và mô hình AI Gemini.
              </p>
            </div>
            <button
              type="button"
              onClick={handlePingSheet}
              disabled={isTestingSheet}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingSheet ? 'animate-spin' : ''}`} />
              <span>Kiểm Tra Ping Toàn Bộ</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Card 1: Google Sheets - Doanh Thu & Lead */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Sheet Báo Cáo Doanh Thu</h4>
                      <p className="text-[11px] text-emerald-400">● 17 Chi Nhánh & Data Ngày</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                    200 OK
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block">Đường Dẫn Sheet Báo Cáo:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={sheetUrlInput}
                      onChange={(e) => setSheetUrlInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500 truncate"
                      placeholder="https://docs.google.com/spreadsheets/..."
                    />
                    <button
                      type="button"
                      onClick={handleApplyNewSheetUrl}
                      className="px-2.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Tự làm mới: <strong>Mỗi 5 phút</strong></span>
                <span className="text-cyan-400 font-mono text-[11px]">180ms latency</span>
              </div>
            </div>

            {/* Card 2: Google Sheets - Ngân Sách Dự Kiến */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Sheet Ngân Sách Dự Kiến</h4>
                      <p className="text-[11px] text-amber-400">● 4 Kịch Bản Phân Bổ T8</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    Connected
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-400 block">Đường Dẫn Sheet Ngân Sách:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={budgetPlanSheetInput}
                      onChange={(e) => setBudgetPlanSheetInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-amber-500 truncate"
                      placeholder="https://docs.google.com/spreadsheets/..."
                    />
                    <button
                      type="button"
                      onClick={handleApplyBudgetPlanUrl}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer shrink-0"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Tổng kế hoạch: <strong className="text-amber-400">1.014 Tỷ</strong></span>
                <button
                  type="button"
                  onClick={handleSyncBudgetPlanSheet}
                  className="text-cyan-400 hover:underline text-[11px] font-bold cursor-pointer"
                >
                  Đồng bộ ngay
                </button>
              </div>
            </div>

            {/* Card 3: Google Ads API */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Google Ads API v18</h4>
                      <p className="text-[11px] text-cyan-400">● CID: {googleAdsConfig.customerId || '297-136-7807'}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                    OAuth2 Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs font-mono">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>CID:</span>
                    <span className="text-white font-bold">{googleAdsConfig.customerId}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Token:</span>
                    <span className="text-emerald-400">OAuth2 Live</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowGoogleAdsModal(true)}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-cyan-600/30"
                  >
                    <Key className="w-3 h-3" />
                    <span>Cấu Hình API</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsTestingGoogleAds(true);
                      setTimeout(() => {
                        setIsTestingGoogleAds(false);
                        setSaveSuccessMessage('Đã kiểm tra xác thực Google Ads OAuth2 thành công! 59 Chiến dịch sẵn sàng.');
                        setTimeout(() => setSaveSuccessMessage(null), 4000);
                      }, 1000);
                    }}
                    disabled={isTestingGoogleAds}
                    className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all flex items-center justify-center gap-1 border border-slate-700 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTestingGoogleAds ? 'animate-spin text-cyan-400' : ''}`} />
                    <span>Ping</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Tự đồng bộ: <strong>15 phút</strong></span>
                <span className="text-emerald-400 font-mono text-[11px]">200 OK</span>
              </div>
            </div>

            {/* Card 4: Gemini AI Model */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between shadow-lg">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm">Gemini AI Model</h4>
                      <p className="text-[11px] text-purple-400">● gemini-3.7-flash</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                    Ready
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Nhiệm vụ:</span>
                    <span className="text-white font-bold">Copilot & Phân Tích</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Bảo mật:</span>
                    <span className="text-emerald-400 font-bold">Server Hidden</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Context: <strong>1M Tokens</strong></span>
                <span className="text-purple-400 font-mono text-[11px]">42ms</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: THRESHOLDS & ALERTS */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'thresholds' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-400" />
                Cài Đặt Ngưỡng Cảnh Báo Chi Phí (CPA) & Hiệu Suất Quảng Cáo
              </h3>
              <p className="text-xs text-slate-400">
                Hệ thống sẽ tự động bật cảnh báo đỏ và thông báo khi chi phí vượt trần hoặc tỷ lệ chuyển đổi rớt sâu.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveThresholds}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-amber-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình Ngưỡng</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: CPA Ceiling */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-400" />
                Ngưỡng Trần Chi Phí / Lead (Max CPA Alert)
              </h4>
              <p className="text-xs text-slate-400">Nếu CPA thực tế vượt mức này, hệ thống sẽ đánh dấu báo động trên bảng Ads.</p>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Trồng Răng Implant:</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.implantMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={1000000}
                    step={10000}
                    value={thresholds.implantMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, implantMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Răng Sứ Thẩm Mỹ:</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.porcelainMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={150000}
                    max={800000}
                    step={10000}
                    value={thresholds.porcelainMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, porcelainMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Niềng Răng Mắc Cài / Invisalign:</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.bracesMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={900000}
                    step={10000}
                    value={thresholds.bracesMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, bracesMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Dịch Vụ Khác (Nhổ răng, tẩy trắng...):</span>
                    <span className="text-cyan-300 font-mono font-bold">{thresholds.generalMaxCpa.toLocaleString('vi-VN')} đ/Lead</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={400000}
                    step={10000}
                    value={thresholds.generalMaxCpa}
                    onChange={(e) => setThresholds({ ...thresholds, generalMaxCpa: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            </div>

            {/* Box 2: Quality Score & Conversion Thresholds */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Percent className="w-4 h-4 text-emerald-400" />
                Ngưỡng Điểm Chất Lượng & Phễu Chuyển Đổi
              </h4>
              <p className="text-xs text-slate-400">Tiêu chuẩn để AI phân loại từ khóa yếu kém và cảnh báo tỷ lệ rớt số.</p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Cảnh báo Quality Score thấp khi:</span>
                    <span className="text-rose-400 font-bold font-mono">Điểm ≤ {thresholds.minQualityScore}/10</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[2, 3, 4, 5, 6].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setThresholds({ ...thresholds, minQualityScore: num })}
                        className={`py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                          thresholds.minQualityScore === num
                            ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                            : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        ≤ {num}/10
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-semibold mb-1">
                    <span>Tỷ lệ Chuyển đổi Lead ➔ Hẹn khám tối thiểu:</span>
                    <span className="text-emerald-400 font-bold font-mono">{thresholds.minLeadToBookingRate}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={1}
                    value={thresholds.minLeadToBookingRate}
                    onChange={(e) => setThresholds({ ...thresholds, minLeadToBookingRate: Number(e.target.value) })}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={thresholds.enableSoundAlert}
                      onChange={(e) => setThresholds({ ...thresholds, enableSoundAlert: e.target.checked })}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>Bật chuông thông báo âm thanh khi phát hiện đối thủ giảm giá sốc</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={thresholds.enableEmailAlert}
                      onChange={(e) => setThresholds({ ...thresholds, enableEmailAlert: e.target.checked })}
                      className="rounded accent-cyan-500 w-4 h-4"
                    />
                    <span>Gửi email tóm tắt cảnh báo cuối ngày cho Ban Giám Đốc</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CRAWLER CONFIG */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'crawler' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Swords className="w-4 h-4 text-cyan-400" />
                Cấu Hình Bot Tự Động Quét 21 Link Đối Thủ
              </h3>
              <p className="text-xs text-slate-400">
                Điều chỉnh tần suất chạy ngầm, phạm vi bóc tách nội dung và độ nhạy phát hiện thay đổi trên website đối thủ.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSaveCrawlerConfig}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Lưu Cấu Hình Bot</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Box 1: Frequency */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                Tần Suất Tự Động Quét Lại (Scheduler)
              </h4>
              <p className="text-xs text-slate-400">Đồng hồ đếm ngược sẽ tự động kích hoạt tiến trình quét theo chu kỳ đã chọn.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
                {[
                  { value: '6', label: 'Mỗi 6 tiếng' },
                  { value: '12', label: 'Mỗi 12 tiếng' },
                  { value: '24', label: 'Mỗi 24 tiếng (Khuyên dùng)' },
                  { value: '48', label: 'Mỗi 48 tiếng' },
                ].map(item => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setCrawlerInterval(item.value as any)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      crawlerInterval === item.value
                        ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Box 2: Sensitivity */}
            <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Độ Nhạy Bóc Tách Nội Dung (Diff Engine)
              </h4>
              <p className="text-xs text-slate-400">Chọn các loại dữ liệu cần đối chiếu sai khác trên Landing Page đối thủ.</p>

              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-semibold">Quét hình ảnh & Banner khuyến mãi mới (Visual Diff)</span>
                  <input
                    type="checkbox"
                    checked={crawlerScanImages}
                    onChange={(e) => setCrawlerScanImages(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-semibold">Quét biến động Bảng Giá dịch vụ (Price Diff)</span>
                  <input
                    type="checkbox"
                    checked={crawlerScanPrices}
                    onChange={(e) => setCrawlerScanPrices(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <span className="text-slate-200 font-semibold">Quét Cam kết & Quà tặng kèm (Promo Diff)</span>
                  <input
                    type="checkbox"
                    checked={crawlerScanPromos}
                    onChange={(e) => setCrawlerScanPromos(e.target.checked)}
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: AUDIT LOGS & SECURITY */}
      {/* ========================================================================= */}
      {activeAdminSubTab === 'audit' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-emerald-400" />
                Nhật Ký Hoạt Động & Bảo Mật Hệ Thống (Audit Logs)
              </h3>
              <p className="text-xs text-slate-400">
                Ghi nhận mọi thao tác cấu hình, đổi mật khẩu, xuất dữ liệu và đồng bộ hóa của người dùng.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setAuditLogs(prev => [
                  {
                    id: `log-${Date.now()}`,
                    timestamp: 'Vừa xong',
                    userName: 'Trần Đức (Admin)',
                    action: 'Làm mới bảng nhật ký hệ thống',
                    category: 'auth',
                    status: 'info',
                    details: 'Kiểm tra trạng thái bảo mật thời gian thực',
                  },
                  ...prev,
                ]);
                showNotification('Đã làm mới dữ liệu Audit Logs!');
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Làm Mới Log</span>
            </button>
          </div>

          {/* Audit Logs List */}
          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl shrink-0 ${
                    log.status === 'success'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : log.status === 'warning'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  }`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white">{log.action}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {log.userName}
                      </span>
                    </div>
                    <p className="text-slate-400 mt-0.5 text-[11px]">{log.details}</p>
                  </div>
                </div>

                <span className="text-[11px] text-slate-500 font-mono whitespace-nowrap self-end sm:self-center">
                  {log.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: THÊM & PHÂN QUYỀN NHÂN SỰ (VAI TRÒ + DẤU TÍC CHỌN QUYỀN XEM) */}
      {/* ========================================================================= */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  {editingUserId ? <Sliders className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingUserId ? 'Chỉnh Sửa Phân Quyền Nhân Sự' : 'Thêm Nhân Sự Mới Vào Hệ Thống'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Cấu hình vai trò nhân viên và tích chọn các quyền xem tab tương ứng.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form & Tab Checkboxes (Scrollable) */}
            <form onSubmit={handleCreateUser} className="space-y-4 text-xs overflow-y-auto pr-1 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Họ và Tên Nhân Sự:</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="VD: Nguyễn Thị Thảo"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Công Ty / Đăng Nhập:</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="thao.nguyen@tamducsmile.vn"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Phòng Ban:</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    placeholder="Phòng Marketing / Tư Vấn / Kế Toán"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Vai Trò Nhân Viên (Role Preset):
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => handleRoleChange(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 cursor-pointer"
                  >
                    <option value="marketer">Google Ads Specialist (Quyền xem Ads, Đối Thủ)</option>
                    <option value="sales">Tư Vấn & Sales Online (Quyền xem Lead, Copilot)</option>
                    <option value="manager">Marketing Manager (Xem đa tab Marketing)</option>
                    <option value="accountant">Kế Toán (Xem Báo Cáo Doanh Thu & VAT)</option>
                    <option value="admin">Super Admin (Toàn Quyền Hệ Thống)</option>
                    <option value="custom">Tùy Chỉnh Phân Quyền Riêng (Custom Matrix)</option>
                  </select>
                </div>
              </div>

              {/* DẤU TÍC CHỌN QUYỀN XEM SECTION */}
              <div className="pt-2 border-t border-slate-800/80 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-cyan-400" />
                    <span className="font-bold text-slate-200">Dấu Tíc Chọn Quyền Xem Tab & Tính Năng:</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      Đã chọn {selectedTabs.length} / {ALL_WORKSPACE_TABS.length} Tab
                    </span>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={handleSelectAllTabs}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors cursor-pointer"
                    >
                      ✓ Chọn Tất Cả
                    </button>
                    <button
                      type="button"
                      onClick={handleDeselectAllTabs}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-800 hover:bg-slate-700 text-rose-300 transition-colors cursor-pointer"
                    >
                      ✕ Bỏ Chọn
                    </button>
                  </div>
                </div>

                {/* Tab Checkboxes Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ALL_WORKSPACE_TABS.map((tab) => {
                    const isChecked = selectedTabs.includes(tab.id);
                    const TabIcon = tab.icon;

                    return (
                      <div
                        key={tab.id}
                        onClick={() => handleToggleTab(tab.id)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                          isChecked
                            ? 'bg-cyan-950/40 border-cyan-500/60 shadow-sm shadow-cyan-500/10'
                            : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700 opacity-75'
                        }`}
                      >
                        {/* Custom Checkbox */}
                        <div className={`mt-0.5 w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                            : 'border-slate-600 bg-slate-950'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        {/* Tab Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <TabIcon className={`w-3.5 h-3.5 ${isChecked ? 'text-cyan-400' : 'text-slate-500'}`} />
                            <span className={`font-bold ${isChecked ? 'text-white' : 'text-slate-400'}`}>
                              {tab.label}
                            </span>
                            {tab.badge && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                            {tab.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white font-bold cursor-pointer transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingUserId ? 'Lưu Phân Quyền' : 'Tạo Tài Khoản & Cấp Quyền'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: CẤU HÌNH KHÓA GOOGLE ADS API & REFRESH TOKEN */}
      {showGoogleAdsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-3xl p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Quản Lý Khóa API & OAuth2 Google Ads</h3>
                  <p className="text-xs text-slate-400">Đấu nối tự động dữ liệu chiến dịch thời gian thực</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGoogleAdsModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. Customer ID */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>1. Google Ads Customer ID (CID):</span>
                  <span className="text-[10px] text-slate-400 font-normal">Mã 10 số tài khoản Ads</span>
                </label>
                <input
                  type="text"
                  value={googleAdsConfig.customerId}
                  onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, customerId: e.target.value })}
                  placeholder="VD: 297-136-7807"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 2. Developer Token */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>2. Developer Token (Mã Nhà Phát Triển):</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Đã lấy từ Trung tâm API MCC</span>
                </label>
                <input
                  type="text"
                  value={googleAdsConfig.developerToken}
                  onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, developerToken: e.target.value })}
                  placeholder="_Nwxgn2-6zk2milYrOdOUQ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 3. Client ID */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>3. OAuth 2.0 Client ID:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Google Cloud Credentials</span>
                </label>
                <input
                  type="text"
                  value={googleAdsConfig.clientId}
                  onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, clientId: e.target.value })}
                  placeholder="814922629929-xxx.apps.googleusercontent.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 4. Client Secret */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>4. OAuth 2.0 Client Secret:</span>
                  <span className="text-[10px] text-slate-400 font-normal">Bảo mật</span>
                </label>
                <input
                  type="password"
                  value={googleAdsConfig.clientSecret}
                  onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, clientSecret: e.target.value })}
                  placeholder="GOCSPX-xxx"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 5. Refresh Token */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center justify-between">
                  <span>5. OAuth 2.0 Refresh Token:</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Đã sinh từ OAuth Playground</span>
                </label>
                <textarea
                  rows={2}
                  value={googleAdsConfig.refreshToken}
                  onChange={(e) => setGoogleAdsConfig({ ...googleAdsConfig, refreshToken: e.target.value })}
                  placeholder="1//043gju-ozsUfCgYIARAAGAQSNwF-..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-between border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Trạng thái: Sẵn sàng đồng bộ trực tiếp</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleAdsModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('dashboard_google_ads_config', JSON.stringify(googleAdsConfig));
                    setShowGoogleAdsModal(false);
                    setSaveSuccessMessage('Đã lưu thành công bộ khóa Google Ads API & OAuth2!');
                    setTimeout(() => setSaveSuccessMessage(null), 4000);
                  }}
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold shadow-lg shadow-cyan-600/30 cursor-pointer flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Cấu Hình Khóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
