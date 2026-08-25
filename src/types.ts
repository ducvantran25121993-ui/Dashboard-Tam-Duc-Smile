import { RegionData } from './data/revenueData';

export type MonthTab = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'overview';

export type SidebarTab =
  | 'overview'
  | 'google_ads'
  | 'leads_funnel'
  | 'campaigns'
  | 'competitor'
  | 'sales_copilot'
  | 'consultation'
  | 'decision_board'
  | 'innovation'
  | 'ai_agent'
  | 'admin_hub';

export type DisplayUnit = 'full' | 'million' | 'billion';

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
