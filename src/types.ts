import { RegionData } from './data/revenueData';

export type MonthTab = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'q1' | 'q2' | 'q3' | 'q4' | 'overview' | string;

export type SidebarTab =
  | 'overview'
  | 'google_ads'
  | 'budget_forecast'
  | 'leads_funnel'
  | 'campaigns'
  | 'competitor'
  | 'consultation'
  | 'vttech_crm'
  | 'innovation'
  | 'landing_builder'
  | 'ai_agent'
  | 'admin_hub';

export type DisplayUnit = 'full' | 'million' | 'billion';

export type ThemeMode = 'light' | 'dark' | 'auto';

export type ChartType = 'bar' | 'horizontalBar' | 'area';

export interface FilterState {
  searchTerm: string;
  selectedRegion: string;
  sortBy: 'revenue' | 'cost' | 'profit' | 'ratio' | 'name';
  sortOrder: 'asc' | 'desc';
}

export interface ComputedRegionMetrics extends RegionData {
  profit: number;               // Revenue - CostVAT
  costRatioPercent: number;     // (CostVAT / Revenue) * 100 or 0
  totalServicesCount: number;
  totalCustomerData: number;
}

export interface ThemePalette {
  id: string;
  name: string;
  badge?: string;
  mode: 'dark' | 'light';
  canvasBg: string;
  cardBg: string;
  cardElevated: string;
  borderColor: string;
  headerBg: string;
  sidebarBg: string;
  accentGlow: string;
  previewColor: string;
}
