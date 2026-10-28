import { MonthDataset, RegionData, ServiceData } from '../data/revenueData';
import { isVietKieuRegion } from './formatters';

export type QuarterId = 'q1' | 'q2' | 'q3' | 'q4';

export interface QuarterConfig {
  id: QuarterId;
  label: string;
  name: string;
  fullName: string;
  shortLabel: string;
  months: number[];
  rangeLabel: string;
  color: string;
  accentGradient: string;
}

export const QUARTER_CONFIGS: Record<QuarterId, QuarterConfig> = {
  q1: {
    id: 'q1',
    label: 'Quý 1',
    name: 'Quý 1 (T1 - T3)',
    fullName: 'Báo Cáo Quý 1 (Tháng 1 - Tháng 3)',
    shortLabel: 'Q1',
    months: [1, 2, 3],
    rangeLabel: 'Tháng 1 - Tháng 3',
    color: '#06b6d4',
    accentGradient: 'from-cyan-500 to-blue-600',
  },
  q2: {
    id: 'q2',
    label: 'Quý 2',
    name: 'Quý 2 (T4 - T6)',
    fullName: 'Báo Cáo Quý 2 (Tháng 4 - Tháng 6)',
    shortLabel: 'Q2',
    months: [4, 5, 6],
    rangeLabel: 'Tháng 4 - Tháng 6',
    color: '#8b5cf6',
    accentGradient: 'from-purple-500 to-indigo-600',
  },
  q3: {
    id: 'q3',
    label: 'Quý 3',
    name: 'Quý 3 (T7 - T9)',
    fullName: 'Báo Cáo Quý 3 (Tháng 7 - Tháng 9)',
    shortLabel: 'Q3',
    months: [7, 8, 9],
    rangeLabel: 'Tháng 7 - Tháng 9',
    color: '#10b981',
    accentGradient: 'from-emerald-500 to-teal-600',
  },
  q4: {
    id: 'q4',
    label: 'Quý 4',
    name: 'Quý 4 (T10 - T11)',
    fullName: 'Báo Cáo Quý 4 (Tháng 10 - Tháng 11)',
    shortLabel: 'Q4',
    months: [10, 11],
    rangeLabel: 'Tháng 10 - Tháng 11',
    color: '#f59e0b',
    accentGradient: 'from-amber-500 to-orange-600',
  },
};

/**
 * Check if a tab value is a Quarter identifier
 */
export function isQuarterTab(tab: unknown): tab is QuarterId {
  return tab === 'q1' || tab === 'q2' || tab === 'q3' || tab === 'q4';
}

/**
 * Get configuration for a quarter
 */
export function getQuarterConfig(tab: unknown): QuarterConfig | null {
  if (isQuarterTab(tab)) {
    return QUARTER_CONFIGS[tab];
  }
  return null;
}

/**
 * Consolidate all months in a quarter into a single unified MonthDataset.
 * This aggregates:
 * - Total Revenue per region across all months in the quarter
 * - Total Cost VAT per region across all months in the quarter
 * - Total Data DV and Data CL per region across all months in the quarter
 * - All services (Implant, Niềng, Sứ, TH,...) with aggregated cost, data count, and data quality
 */
export function getQuarterDataset(
  quarterId: QuarterId,
  monthlyData: MonthDataset[]
): MonthDataset {
  const config = QUARTER_CONFIGS[quarterId];
  const targetMonthDatasets = monthlyData.filter((m) =>
    config.months.includes(m.month as number)
  );

  // Preserve ordered list of all regions across the quarter months
  const regionNamesOrder: string[] = [];
  targetMonthDatasets.forEach((m) => {
    m.regions.forEach((r) => {
      if (!regionNamesOrder.includes(r.name)) {
        regionNamesOrder.push(r.name);
      }
    });
  });

  const combinedRegions: RegionData[] = regionNamesOrder.map((regName) => {
    let costVAT = 0;
    let revenue = 0;
    let cpDichVu = 0;
    let cpTong = 0;
    let totalData = 0;
    let dataChatLuong = 0;

    // Aggregate services across months for this region
    const serviceMap: Record<
      string,
      { cp: number; dataCount: number; dataChatLuong: number }
    > = {};

    targetMonthDatasets.forEach((m) => {
      const reg = m.regions.find((r) => r.name === regName);
      if (reg) {
        costVAT += reg.costVAT || 0;
        revenue += reg.revenue || 0;
        cpDichVu += reg.cpDichVu || 0;
        cpTong += reg.cpTong || 0;
        totalData += reg.totalData || 0;
        dataChatLuong += reg.dataChatLuong || 0;

        (reg.services || []).forEach((s) => {
          const sName = s.name ? s.name.trim() : 'Khác';
          if (!serviceMap[sName]) {
            serviceMap[sName] = { cp: 0, dataCount: 0, dataChatLuong: 0 };
          }
          serviceMap[sName].cp += s.cp || 0;
          serviceMap[sName].dataCount += s.dataCount || 0;
          serviceMap[sName].dataChatLuong += s.dataChatLuong || 0;
        });
      }
    });

    const combinedServices: ServiceData[] = Object.entries(serviceMap).map(
      ([name, vals]) => ({
        name,
        cp: vals.cp,
        dataCount: vals.dataCount,
        dataChatLuong: vals.dataChatLuong,
      })
    );

    return {
      name: regName,
      costVAT,
      revenue,
      cpDichVu,
      cpTong,
      totalData,
      dataChatLuong,
      services: combinedServices,
    };
  });

  // Numeric month ID for quarter: 101 for Q1, 102 for Q2, 103 for Q3, 104 for Q4
  const quarterMonthNumber =
    quarterId === 'q1' ? 101 : quarterId === 'q2' ? 102 : quarterId === 'q3' ? 103 : 104;

  return {
    month: quarterMonthNumber,
    label: `Báo Cáo ${config.label} (${config.rangeLabel} / 2026)`,
    regions: combinedRegions,
  };
}

export interface MonthContribution {
  monthNum: number;
  label: string;
  revenue: number;
  costVAT: number;
  profit: number;
  costRatio: number;
  dataDV: number;
  dataCL: number;
  qualityRatio: number;
  revenueShare: number; // % of total quarter revenue
  hasData: boolean;
}

export interface QuarterBreakdownSummary {
  config: QuarterConfig;
  months: MonthContribution[];
  totalRevenue: number;
  totalCostVAT: number;
  totalProfit: number;
  avgCostRatio: number;
  totalDataDV: number;
  totalDataCL: number;
  qualityRatio: number;
  topMonthByRevenue: MonthContribution | null;
}

/**
 * Computes month-by-month contribution and quarter totals for a specific quarter
 */
export function getQuarterBreakdown(
  quarterId: QuarterId,
  monthlyData: MonthDataset[]
): QuarterBreakdownSummary {
  const config = QUARTER_CONFIGS[quarterId];

  // 1. Calculate each month's contribution
  const months: MonthContribution[] = config.months.map((mNum) => {
    const ds = monthlyData.find((d) => d.month === mNum);
    if (!ds) {
      return {
        monthNum: mNum,
        label: `Tháng ${mNum}`,
        revenue: 0,
        costVAT: 0,
        profit: 0,
        costRatio: 0,
        dataDV: 0,
        dataCL: 0,
        qualityRatio: 0,
        revenueShare: 0,
        hasData: false,
      };
    }

    const revenue = ds.regions.reduce(
      (sum, r) => sum + (isVietKieuRegion(r.name) ? 0 : r.revenue || 0),
      0
    );
    const costVAT = ds.regions.reduce((sum, r) => sum + (r.costVAT || 0), 0);
    const profit = revenue - costVAT;
    const costRatio = revenue > 0 ? (costVAT / revenue) * 100 : 0;

    const dataDV = ds.regions.reduce((sum, r) => {
      const svcSum = (r.services || []).reduce(
        (sSum, s) => sSum + (s.dataCount || 0),
        0
      );
      return sum + (svcSum > 0 ? svcSum : r.totalData || 0);
    }, 0);

    const dataCL = ds.regions.reduce(
      (sum, r) => sum + (r.dataChatLuong || 0),
      0
    );
    const qualityRatio = dataDV > 0 ? (dataCL / dataDV) * 100 : 0;

    const hasData = ds.regions.some(
      (r) =>
        (r.costVAT || 0) > 0 ||
        (r.revenue || 0) > 0 ||
        (r.totalData || 0) > 0
    );

    return {
      monthNum: mNum,
      label: `Tháng ${mNum}`,
      revenue,
      costVAT,
      profit,
      costRatio,
      dataDV,
      dataCL,
      qualityRatio,
      revenueShare: 0,
      hasData,
    };
  });

  // 2. Compute Quarter Totals
  const totalRevenue = months.reduce((s, m) => s + m.revenue, 0);
  const totalCostVAT = months.reduce((s, m) => s + m.costVAT, 0);
  const totalProfit = totalRevenue - totalCostVAT;
  const avgCostRatio =
    totalRevenue > 0 ? (totalCostVAT / totalRevenue) * 100 : 0;
  const totalDataDV = months.reduce((s, m) => s + m.dataDV, 0);
  const totalDataCL = months.reduce((s, m) => s + m.dataCL, 0);
  const qualityRatio =
    totalDataDV > 0 ? (totalDataCL / totalDataDV) * 100 : 0;

  // 3. Compute revenue shares
  months.forEach((m) => {
    m.revenueShare = totalRevenue > 0 ? (m.revenue / totalRevenue) * 100 : 0;
  });

  const validMonths = months.filter((m) => m.hasData && m.revenue > 0);
  const topMonthByRevenue =
    validMonths.length > 0
      ? [...validMonths].sort((a, b) => b.revenue - a.revenue)[0]
      : null;

  return {
    config,
    months,
    totalRevenue,
    totalCostVAT,
    totalProfit,
    avgCostRatio,
    totalDataDV,
    totalDataCL,
    qualityRatio,
    topMonthByRevenue,
  };
}

/**
 * Check if a tab value is a custom range identifier
 * Formats: 'range:1-6', 'custom:1,2,3,4,5,6'
 */
export function isCustomRange(tab: unknown): boolean {
  if (typeof tab !== 'string') return false;
  return tab.startsWith('range:') || tab.startsWith('custom:');
}

/**
 * Parse any MonthTab (quarter, range, custom, single month, or overview) into an array of month numbers.
 */
export function parseCustomRange(tab: unknown): number[] | null {
  if (typeof tab === 'number') {
    return [tab];
  }
  if (typeof tab !== 'string') return null;

  if (tab === 'q1') return [1, 2, 3];
  if (tab === 'q2') return [4, 5, 6];
  if (tab === 'q3') return [7, 8, 9];
  if (tab === 'q4') return [10, 11];
  if (tab === 'overview') return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  if (tab.startsWith('range:')) {
    const parts = tab.replace('range:', '').split('-');
    if (parts.length === 2) {
      const start = parseInt(parts[0], 10);
      const end = parseInt(parts[1], 10);
      if (!isNaN(start) && !isNaN(end) && start <= end) {
        const result: number[] = [];
        for (let i = start; i <= end; i++) {
          if (i >= 1 && i <= 11) result.push(i);
        }
        return result.length > 0 ? result : null;
      }
    }
  }

  if (tab.startsWith('custom:')) {
    const parts = tab.replace('custom:', '').split(',');
    const result = parts
      .map((p) => parseInt(p.trim(), 10))
      .filter((n) => !isNaN(n) && n >= 1 && n <= 11);
    return result.length > 0 ? Array.from(new Set(result)).sort((a, b) => a - b) : null;
  }

  return null;
}

/**
 * Format human-readable label for a range of months
 * e.g. [1, 2, 3, 4, 5, 6] -> "Tháng 1 - Tháng 6"
 */
export function formatRangeLabel(months: number[]): string {
  if (!months || months.length === 0) return '';
  const sorted = [...months].sort((a, b) => a - b);

  let isConsecutive = true;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      isConsecutive = false;
      break;
    }
  }

  if (isConsecutive && sorted.length > 1) {
    return `Tháng ${sorted[0]} - Tháng ${sorted[sorted.length - 1]}`;
  }
  return `Tháng ${sorted.join(', ')}`;
}

/**
 * Consolidate any list of months into a single unified MonthDataset.
 */
export function getCustomRangeDataset(
  months: number[],
  monthlyData: MonthDataset[],
  customTitle?: string
): MonthDataset {
  const targetMonthDatasets = monthlyData.filter((m) =>
    months.includes(m.month as number)
  );

  const regionNamesOrder: string[] = [];
  targetMonthDatasets.forEach((m) => {
    m.regions.forEach((r) => {
      if (!regionNamesOrder.includes(r.name)) {
        regionNamesOrder.push(r.name);
      }
    });
  });

  const combinedRegions: RegionData[] = regionNamesOrder.map((regName) => {
    let costVAT = 0;
    let revenue = 0;
    let cpDichVu = 0;
    let cpTong = 0;
    let totalData = 0;
    let dataChatLuong = 0;

    const serviceMap: Record<
      string,
      { cp: number; dataCount: number; dataChatLuong: number }
    > = {};

    targetMonthDatasets.forEach((m) => {
      const reg = m.regions.find((r) => r.name === regName);
      if (reg) {
        costVAT += reg.costVAT || 0;
        revenue += reg.revenue || 0;
        cpDichVu += reg.cpDichVu || 0;
        cpTong += reg.cpTong || 0;
        totalData += reg.totalData || 0;
        dataChatLuong += reg.dataChatLuong || 0;

        (reg.services || []).forEach((s) => {
          const sName = s.name ? s.name.trim() : 'Khác';
          if (!serviceMap[sName]) {
            serviceMap[sName] = { cp: 0, dataCount: 0, dataChatLuong: 0 };
          }
          serviceMap[sName].cp += s.cp || 0;
          serviceMap[sName].dataCount += s.dataCount || 0;
          serviceMap[sName].dataChatLuong += s.dataChatLuong || 0;
        });
      }
    });

    const combinedServices: ServiceData[] = Object.entries(serviceMap).map(
      ([name, vals]) => ({
        name,
        cp: vals.cp,
        dataCount: vals.dataCount,
        dataChatLuong: vals.dataChatLuong,
      })
    );

    return {
      name: regName,
      costVAT,
      revenue,
      cpDichVu,
      cpTong,
      totalData,
      dataChatLuong,
      services: combinedServices,
    };
  });

  const rangeLabel = formatRangeLabel(months);

  return {
    month: 999,
    label: customTitle || `Báo Cáo Tổng Hợp ${rangeLabel} (${months.length} Tháng / 2026)`,
    regions: combinedRegions,
  };
}

export interface CustomRangeBreakdownSummary {
  months: MonthContribution[];
  monthNumbers: number[];
  rangeLabel: string;
  totalRevenue: number;
  totalCostVAT: number;
  totalProfit: number;
  avgCostRatio: number;
  totalDataDV: number;
  totalDataCL: number;
  qualityRatio: number;
  topMonthByRevenue: MonthContribution | null;
}

/**
 * Computes month-by-month contribution and combined totals for any custom month array
 */
export function getCustomRangeBreakdown(
  monthsList: number[],
  monthlyData: MonthDataset[]
): CustomRangeBreakdownSummary {
  const sortedMonths = [...monthsList].sort((a, b) => a - b);

  const months: MonthContribution[] = sortedMonths.map((mNum) => {
    const ds = monthlyData.find((d) => d.month === mNum);
    if (!ds) {
      return {
        monthNum: mNum,
        label: `Tháng ${mNum}`,
        revenue: 0,
        costVAT: 0,
        profit: 0,
        costRatio: 0,
        dataDV: 0,
        dataCL: 0,
        qualityRatio: 0,
        revenueShare: 0,
        hasData: false,
      };
    }

    const revenue = ds.regions.reduce(
      (sum, r) => sum + (isVietKieuRegion(r.name) ? 0 : r.revenue || 0),
      0
    );
    const costVAT = ds.regions.reduce((sum, r) => sum + (r.costVAT || 0), 0);
    const profit = revenue - costVAT;
    const costRatio = revenue > 0 ? (costVAT / revenue) * 100 : 0;

    const dataDV = ds.regions.reduce((sum, r) => {
      const svcSum = (r.services || []).reduce(
        (sSum, s) => sSum + (s.dataCount || 0),
        0
      );
      return sum + (svcSum > 0 ? svcSum : r.totalData || 0);
    }, 0);

    const dataCL = ds.regions.reduce(
      (sum, r) => sum + (r.dataChatLuong || 0),
      0
    );
    const qualityRatio = dataDV > 0 ? (dataCL / dataDV) * 100 : 0;

    const hasData = ds.regions.some(
      (r) =>
        (r.costVAT || 0) > 0 ||
        (r.revenue || 0) > 0 ||
        (r.totalData || 0) > 0
    );

    return {
      monthNum: mNum,
      label: `Tháng ${mNum}`,
      revenue,
      costVAT,
      profit,
      costRatio,
      dataDV,
      dataCL,
      qualityRatio,
      revenueShare: 0,
      hasData,
    };
  });

  const totalRevenue = months.reduce((s, m) => s + m.revenue, 0);
  const totalCostVAT = months.reduce((s, m) => s + m.costVAT, 0);
  const totalProfit = totalRevenue - totalCostVAT;
  const avgCostRatio = totalRevenue > 0 ? (totalCostVAT / totalRevenue) * 100 : 0;
  const totalDataDV = months.reduce((s, m) => s + m.dataDV, 0);
  const totalDataCL = months.reduce((s, m) => s + m.dataCL, 0);
  const qualityRatio = totalDataDV > 0 ? (totalDataCL / totalDataDV) * 100 : 0;

  months.forEach((m) => {
    m.revenueShare = totalRevenue > 0 ? (m.revenue / totalRevenue) * 100 : 0;
  });

  const validMonths = months.filter((m) => m.hasData && m.revenue > 0);
  const topMonthByRevenue =
    validMonths.length > 0
      ? [...validMonths].sort((a, b) => b.revenue - a.revenue)[0]
      : null;

  return {
    months,
    monthNumbers: sortedMonths,
    rangeLabel: formatRangeLabel(sortedMonths),
    totalRevenue,
    totalCostVAT,
    totalProfit,
    avgCostRatio,
    totalDataDV,
    totalDataCL,
    qualityRatio,
    topMonthByRevenue,
  };
}

