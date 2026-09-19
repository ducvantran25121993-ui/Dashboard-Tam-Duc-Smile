export interface FormLeadItem {
  id: string;
  rowNumber: number;
  name: string;
  phone: string;
  phoneNormalized: string;
  isValidPhone: boolean;
  email: string;
  content: string;
  ip: string;
  rawTime: string;
  timestamp: number;
  dateStr: string;   // DD/MM/YYYY
  timeStr: string;   // HH:mm:ss
  branch: string;
  branchStandard: string;
  url: string;
  service: string;
  gclid?: string;
  campaignId?: string;
  isDuplicate: boolean;
  duplicateIndex: number; // 1 = first / original, 2 = 2nd time, etc.
  firstSeenAt?: string;
  inVTTech?: boolean;
}

export interface FormLeadsStats {
  totalSubmissions: number;
  uniqueLeads: number;
  duplicateSubmissions: number;
  duplicateRate: number;
  invalidPhones: number;
  todaySubmissions: number;
  todayUnique: number;
  yesterdaySubmissions: number;
  monthly: {
    month: number;
    label: string;
    total: number;
    unique: number;
    duplicates: number;
  }[];
  byService: {
    service: string;
    count: number;
    percentage: number;
  }[];
  byBranch: {
    branch: string;
    count: number;
    percentage: number;
  }[];
  overlapWithCRM: {
    matchedCount: number;
    matchedPercentage: number;
  };
}

export interface FormLeadsResponse {
  success: boolean;
  sourceUrl: string;
  startDate: string;
  cachedAt: string;
  totalSubmissions: number;
  uniqueLeads: number;
  duplicateSubmissions: number;
  duplicateRate: number;
  invalidPhones: number;
  todaySubmissions: number;
  todayUnique: number;
  stats: FormLeadsStats;
  leads: FormLeadItem[];
  filteredCount?: number;
  totalCount?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}
