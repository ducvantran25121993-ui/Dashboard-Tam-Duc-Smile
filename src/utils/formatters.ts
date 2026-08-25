import { RegionData } from '../data/revenueData';
import { ComputedRegionMetrics, DisplayUnit } from '../types';

/**
 * Format raw numbers as VND currency
 */
export function formatVND(value: number, unit: DisplayUnit = 'full'): string {
  if (isNaN(value) || value === null || value === undefined) return '0 ₫';

  if (unit === 'billion') {
    const billionVal = value / 1_000_000_000;
    return `${billionVal.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} tỷ ₫`;
  }

  if (unit === 'million') {
    const millionVal = value / 1_000_000;
    return `${millionVal.toLocaleString('vi-VN', { minimumFractionDigits: 0, maximumFractionDigits: 1 })} tr ₫`;
  }

  // Full format
  return `${Math.round(value).toLocaleString('vi-VN')} ₫`;
}

/**
 * Format percent string safely
 */
export function formatPercent(value: number): string {
  if (isNaN(value) || !isFinite(value) || value === null || value === undefined) return '0%';
  return `${value.toFixed(1)}%`;
}

/**
 * Format short number for chart axes (e.g., 50M, 1B, 500k)
 */
export function formatChartAxisVND(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(0)} tr`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)}k`;
  }
  return `${value}`;
}

/**
 * Helper to check if a region or service name is "Việt Kiều"
 */
export function isVietKieuRegion(name: string): boolean {
  if (!name) return false;
  const lower = name.toLowerCase().trim();
  return lower.includes('việt kiều') || lower.includes('viet kieu');
}

/**
 * Enrich region data with computed metrics
 */
export function enrichRegionData(region: RegionData): ComputedRegionMetrics {
  const profit = region.revenue - region.costVAT;
  const costRatioPercent = region.revenue > 0 ? (region.costVAT / region.revenue) * 100 : 0;
  const totalCustomerData = region.services.reduce((acc, s) => acc + (s.dataCount || 0), 0);

  return {
    ...region,
    profit,
    costRatioPercent,
    totalServicesCount: region.services.length,
    totalCustomerData
  };
}

/**
 * Convert data table to CSV and trigger browser download
 */
export function exportToCSV(filename: string, rows: Record<string, string | number>[]) {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(header => {
        const val = row[header] ?? '';
        const escaped = String(val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(',')
    )
  ].join('\n');

  // Add BOM for UTF-8 in Excel
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
