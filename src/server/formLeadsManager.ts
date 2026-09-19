import fs from 'fs';
import path from 'path';
import { FormLeadItem, FormLeadsStats, FormLeadsResponse } from '../types/formLead';

const STORAGE_DIR = path.join(process.cwd(), 'data_storage');
if (!fs.existsSync(STORAGE_DIR)) {
  try {
    fs.mkdirSync(STORAGE_DIR, { recursive: true });
  } catch {}
}

const CONFIG_FILE = path.join(STORAGE_DIR, 'form_leads_config.json');
const CACHE_FILE = path.join(STORAGE_DIR, 'form_leads_cache.json');

export interface FormLeadsConfig {
  sheetUrl: string;
  startDate: string; // '2026-01-01'
  lastSyncTime: string;
  autoSync: boolean;
}

const DEFAULT_CONFIG: FormLeadsConfig = {
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1gG7aLnjQ2DkuKUMsma-XS4ii3FbJoAU-hreaI46nOX8/edit?pli=1&gid=0#gid=0',
  startDate: '2026-01-01',
  lastSyncTime: '',
  autoSync: true,
};

let configStore: FormLeadsConfig = { ...DEFAULT_CONFIG };
try {
  if (fs.existsSync(CONFIG_FILE)) {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed) configStore = { ...configStore, ...parsed };
  } else {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configStore, null, 2), 'utf-8');
  }
} catch (e) {
  console.warn('Failed to load form_leads_config.json:', e);
}

// In-memory cache
let leadsCacheStore: {
  lastFetched: number;
  totalSubmissions: number;
  uniqueLeads: number;
  duplicateSubmissions: number;
  duplicateRate: number;
  invalidPhones: number;
  todaySubmissions: number;
  todayUnique: number;
  yesterdaySubmissions: number;
  stats: FormLeadsStats;
  leads: FormLeadItem[];
  cachedAt: string;
} | null = null;

try {
  if (fs.existsSync(CACHE_FILE)) {
    const rawCache = fs.readFileSync(CACHE_FILE, 'utf-8');
    const parsed = JSON.parse(rawCache);
    if (parsed && Array.isArray(parsed.leads) && parsed.leads.length > 0) {
      leadsCacheStore = parsed;
    }
  }
} catch (e) {
  console.warn('Failed to load form_leads_cache.json:', e);
}

// Helper: Normalize phone numbers
export function cleanPhoneNumber(raw: any): { phone: string; isValid: boolean } {
  if (!raw) return { phone: '', isValid: false };
  let s = String(raw).replace(/[^0-9]/g, '');
  if (s.startsWith('84') && s.length >= 11) {
    s = '0' + s.slice(2);
  }
  if (s.length === 9 && !s.startsWith('0')) {
    s = '0' + s;
  }
  const isValid = s.length >= 9 && s.length <= 11 && s.startsWith('0');
  return { phone: s, isValid };
}

// Helper: Parse CSV
function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let current = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (c === '"' && inQuotes && next === '"') {
      current += '"';
      i++;
    } else if (c === '"') {
      inQuotes = !inQuotes;
    } else if (c === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') i++;
      row.push(current.trim());
      if (row.length > 1 || row[0] !== '') lines.push(row);
      row = [];
      current = '';
    } else {
      current += c;
    }
  }
  if (row.length > 0) {
    row.push(current.trim());
    lines.push(row);
  }
  return lines;
}

// Service categorizer
export function detectService(content: string, url: string): string {
  const txt = ((content || '') + ' ' + (url || '')).toLowerCase();
  if (txt.includes('implant') || txt.includes('trong-rang') || txt.includes('trồng răng') || txt.includes('cấy ghép')) return 'Implant';
  if (txt.includes('sứ') || txt.includes('bọc răng') || txt.includes('rang-su') || txt.includes('dán sứ')) return 'Răng Sứ';
  if (txt.includes('niềng') || txt.includes('chỉnh nha') || txt.includes('invisalign') || txt.includes('mắc cài')) return 'Niềng Răng';
  if (txt.includes('cạo vôi') || txt.includes('tay trang') || txt.includes('tẩy trắng') || txt.includes('tram rang') || txt.includes('trám')) return 'Tổng Quát';
  if (txt.includes('nhổ răng') || txt.includes('răng khôn') || txt.includes('sâu răng')) return 'Nhổ Răng & Bệnh Lý';
  return 'Tư Vấn Chung';
}

// Branch categorizer
export function detectBranch(branchRaw: string, content: string, url: string): string {
  const txt = ((branchRaw || '') + ' ' + (content || '') + ' ' + (url || '')).toLowerCase();
  if (txt.includes('cần thơ') || txt.includes('can tho') || txt.includes('trần hưng đạo')) return 'Cần Thơ';
  if (txt.includes('tây ninh') || txt.includes('tay ninh')) return 'Tây Ninh';
  if (txt.includes('bình dương') || txt.includes('binh duong') || txt.includes('thủ dầu một')) return 'Bình Dương';
  if (txt.includes('đồng nai') || txt.includes('biên hòa') || txt.includes('bien hoa')) return 'Đồng Nai / Biên Hòa';
  if (txt.includes('tiền giang') || txt.includes('mỹ tho') || txt.includes('my tho')) return 'Tiền Giang';
  if (txt.includes('kiên giang') || txt.includes('rạch giá')) return 'Kiên Giang';
  if (txt.includes('cà mau') || txt.includes('ca mau')) return 'Cà Mau';
  if (txt.includes('vũng tàu') || txt.includes('bà rịa')) return 'Vũng Tàu';
  if (
    txt.includes('bình thạnh') ||
    txt.includes('phan văn trị') ||
    txt.includes('quận 3') ||
    txt.includes('tân phú') ||
    txt.includes('bình tân') ||
    txt.includes('hóc môn') ||
    txt.includes('gò vấp') ||
    txt.includes('tphcm') ||
    txt.includes('hcm') ||
    txt.includes('quận 10') ||
    txt.includes('sài gòn')
  ) {
    return 'TP. Hồ Chí Minh';
  }
  return 'Toàn Hệ Thống / Chưa rõ';
}

// Get Vietnam today/yesterday date strings (DD/MM/YYYY)
function getVietnamDateStrings() {
  const now = new Date(Date.now() + (7 * 60 + new Date().getTimezoneOffset()) * 60 * 1000);
  const todayD = String(now.getDate()).padStart(2, '0');
  const todayM = String(now.getMonth() + 1).padStart(2, '0');
  const todayY = now.getFullYear();
  const todayStr = `${todayD}/${todayM}/${todayY}`;

  const yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yestD = String(yest.getDate()).padStart(2, '0');
  const yestM = String(yest.getMonth() + 1).padStart(2, '0');
  const yestY = yest.getFullYear();
  const yestStr = `${yestD}/${yestM}/${yestY}`;

  return { todayStr, yestStr };
}

// Read CRM phones for cross-checking
function getCrmPhoneSet(): Set<string> {
  const phones = new Set<string>();
  const vtFile = path.join(STORAGE_DIR, 'vttech_cache.json');
  try {
    if (fs.existsSync(vtFile)) {
      const raw = fs.readFileSync(vtFile, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.data)) {
        parsed.data.forEach((t: any) => {
          const { phone, isValid } = cleanPhoneNumber(t.Phone);
          if (isValid) phones.add(phone);
        });
      }
    }
  } catch {}
  return phones;
}

// Fetch and process Form Leads from Google Sheet
export async function syncFormLeads(force = false): Promise<typeof leadsCacheStore> {
  const now = Date.now();
  if (!force && leadsCacheStore && now - leadsCacheStore.lastFetched < 5 * 60 * 1000) {
    return leadsCacheStore;
  }

  const match = configStore.sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
  const sheetId = match ? match[1] : '1gG7aLnjQ2DkuKUMsma-XS4ii3FbJoAU-hreaI46nOX8';
  const gid = (configStore.sheetUrl.match(/gid=([0-9]+)/) || [])[1] || '0';
  const cacheBust = now;

  const targetUrls = [
    `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}&_t=${cacheBust}`,
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&gid=${gid}&_t=${cacheBust}`,
  ];

  let csvText = '';
  for (const url of targetUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 18000);
      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'TamDucSmile-DataCenter/2.0',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (resp.ok) {
        const text = await resp.text();
        if (text && !text.includes('<!DOCTYPE html>') && text.length > 50) {
          csvText = text;
          break;
        }
      }
    } catch (err: any) {
      console.warn('Form sheet fetch attempt failed:', err.message);
    }
  }

  if (!csvText) {
    if (leadsCacheStore) return leadsCacheStore;
    throw new Error('Không thể tải dữ liệu từ Google Sheet Form Data');
  }

  const rows = parseCSV(csvText);
  if (rows.length < 2) {
    if (leadsCacheStore) return leadsCacheStore;
    throw new Error('Dữ liệu Google Sheet rỗng');
  }

  const crmPhones = getCrmPhoneSet();
  const rawItems: {
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
    dateStr: string;
    timeStr: string;
    branch: string;
    branchStandard: string;
    url: string;
    service: string;
    gclid?: string;
    campaignId?: string;
  }[] = [];

  // Filter 2026 onwards:
  // Row structure: HỌ VÀ TÊN [0], SỐ ĐIỆN THOẠI [1], EMAIL [2], NỘI DUNG TƯ VẤN [3], IP [4], THỜI GIAN [5], CHI NHÁNH [6], ... URL [9 or 8 or 7]
  for (let i = 1; i < rows.length; i++) {
    const r = rows[i];
    const rawTime = (r[5] || '').trim();
    // Parse timestamp: (HH:mm:ss)? DD/MM/YYYY
    const timeMatch = rawTime.match(/(?:(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?)?\s*(\d{1,2})\/(\d{1,2})\/(\d{4})/);
    if (!timeMatch) continue;

    const hour = parseInt(timeMatch[1] || '0', 10);
    const minute = parseInt(timeMatch[2] || '0', 10);
    const second = parseInt(timeMatch[3] || '0', 10);
    const day = parseInt(timeMatch[4], 10);
    const month = parseInt(timeMatch[5], 10);
    const year = parseInt(timeMatch[6], 10);

    // Filter strictly 2026 onwards
    if (year < 2026) continue;

    // ISO timestamp in Vietnam UTC+7
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}+07:00`;
    const timestamp = new Date(isoDate).getTime() || 0;
    const dateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    const timeStr = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;

    const { phone: phoneNormalized, isValid: isValidPhone } = cleanPhoneNumber(r[1]);
    const branchRaw = r[6] || '';
    const content = r[3] || '';
    // Find URL column (some rows have empty columns in between)
    let url = '';
    for (let c = 7; c < r.length; c++) {
      if (r[c] && (r[c].startsWith('http://') || r[c].startsWith('https://'))) {
        url = r[c];
        break;
      }
    }

    // Extract GCLID and CampaignID from URL if present
    const gclidMatch = url.match(/gclid=([^&#]+)/);
    const campMatch = url.match(/gad_campaignid=([^&#]+)/) || url.match(/campaign_id=([^&#]+)/);

    const service = detectService(content, url);
    const branchStandard = detectBranch(branchRaw, content, url);

    rawItems.push({
      rowNumber: i + 1,
      name: (r[0] || 'Khách hàng').trim(),
      phone: (r[1] || '').trim(),
      phoneNormalized,
      isValidPhone,
      email: (r[2] || '').trim(),
      content: content.trim(),
      ip: (r[4] || '').trim(),
      rawTime,
      timestamp,
      dateStr,
      timeStr,
      branch: branchRaw.trim(),
      branchStandard,
      url: url.trim(),
      service,
      gclid: gclidMatch ? gclidMatch[1] : undefined,
      campaignId: campMatch ? campMatch[1] : undefined,
    });
  }

  // Sort chronologically ascending to evaluate duplicates
  rawItems.sort((a, b) => a.timestamp - b.timestamp);

  // Deduplication logic
  const phoneSubmissionHistory = new Map<string, { firstSeenAt: string; count: number }>();
  let duplicateCount = 0;
  let invalidPhoneCount = 0;

  const processedLeads: FormLeadItem[] = rawItems.map((item, idx) => {
    let isDuplicate = false;
    let duplicateIndex = 1;
    let firstSeenAt = item.rawTime;

    if (!item.isValidPhone) {
      invalidPhoneCount++;
    } else {
      const existing = phoneSubmissionHistory.get(item.phoneNormalized);
      if (existing) {
        isDuplicate = true;
        duplicateCount++;
        existing.count++;
        duplicateIndex = existing.count;
        firstSeenAt = existing.firstSeenAt;
      } else {
        phoneSubmissionHistory.set(item.phoneNormalized, {
          firstSeenAt: item.rawTime,
          count: 1,
        });
      }
    }

    const inVTTech = item.isValidPhone ? crmPhones.has(item.phoneNormalized) : false;

    return {
      id: `fl_${item.rowNumber}_${idx}`,
      ...item,
      isDuplicate,
      duplicateIndex,
      firstSeenAt,
      inVTTech,
    };
  });

  // Re-sort descending (newest first) for viewing
  processedLeads.sort((a, b) => b.timestamp - a.timestamp);

  const { todayStr, yestStr } = getVietnamDateStrings();
  const todayItems = processedLeads.filter((l) => l.dateStr === todayStr);
  const todayUnique = new Set(todayItems.filter((l) => l.isValidPhone && !l.isDuplicate).map((l) => l.phoneNormalized)).size;
  const yestItems = processedLeads.filter((l) => l.dateStr === yestStr);

  // Monthly stats (Month 1 to Month 12 of 2026)
  const monthlyStats = Array.from({ length: 12 }, (_, i) => {
    const monthNum = i + 1;
    const monthLeads = processedLeads.filter((l) => {
      const parts = l.dateStr.split('/');
      return parseInt(parts[1], 10) === monthNum;
    });
    const unique = new Set(monthLeads.filter((l) => l.isValidPhone && !l.isDuplicate).map((l) => l.phoneNormalized)).size;
    const duplicates = monthLeads.filter((l) => l.isDuplicate).length;
    return {
      month: monthNum,
      label: `Tháng ${monthNum}/2026`,
      total: monthLeads.length,
      unique,
      duplicates,
    };
  }).filter((m) => m.total > 0);

  // Service breakdown
  const serviceMap = new Map<string, number>();
  processedLeads.forEach((l) => {
    serviceMap.set(l.service, (serviceMap.get(l.service) || 0) + 1);
  });
  const byService = Array.from(serviceMap.entries())
    .map(([service, count]) => ({
      service,
      count,
      percentage: Number(((count / processedLeads.length) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);

  // Branch breakdown
  const branchMap = new Map<string, number>();
  processedLeads.forEach((l) => {
    branchMap.set(l.branchStandard, (branchMap.get(l.branchStandard) || 0) + 1);
  });
  const byBranch = Array.from(branchMap.entries())
    .map(([branch, count]) => ({
      branch,
      count,
      percentage: Number(((count / processedLeads.length) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.count - a.count);

  const matchedCrmCount = processedLeads.filter((l) => l.inVTTech && !l.isDuplicate).length;
  const uniqueCount = phoneSubmissionHistory.size;
  const totalSubmissions = processedLeads.length;

  const stats: FormLeadsStats = {
    totalSubmissions,
    uniqueLeads: uniqueCount,
    duplicateSubmissions: duplicateCount,
    duplicateRate: Number(((duplicateCount / (totalSubmissions || 1)) * 100).toFixed(1)),
    invalidPhones: invalidPhoneCount,
    todaySubmissions: todayItems.length,
    todayUnique,
    yesterdaySubmissions: yestItems.length,
    monthly: monthlyStats,
    byService,
    byBranch,
    overlapWithCRM: {
      matchedCount: matchedCrmCount,
      matchedPercentage: Number(((matchedCrmCount / (uniqueCount || 1)) * 100).toFixed(1)),
    },
  };

  leadsCacheStore = {
    lastFetched: now,
    totalSubmissions,
    uniqueLeads: uniqueCount,
    duplicateSubmissions: duplicateCount,
    duplicateRate: stats.duplicateRate,
    invalidPhones: invalidPhoneCount,
    todaySubmissions: todayItems.length,
    todayUnique,
    yesterdaySubmissions: yestItems.length,
    stats,
    leads: processedLeads,
    cachedAt: new Date(now).toISOString(),
  };

  configStore.lastSyncTime = leadsCacheStore.cachedAt;

  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configStore, null, 2), 'utf-8');
    fs.writeFileSync(CACHE_FILE, JSON.stringify(leadsCacheStore, null, 2), 'utf-8');
  } catch (saveErr) {
    console.warn('Failed to save form leads cache to disk:', saveErr);
  }

  return leadsCacheStore;
}

export function getFormLeadsCache(): typeof leadsCacheStore {
  return leadsCacheStore;
}

export function getFormLeadsConfig(): FormLeadsConfig {
  return configStore;
}

export function updateFormLeadsConfig(newCfg: Partial<FormLeadsConfig>): FormLeadsConfig {
  configStore = { ...configStore, ...newCfg };
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(configStore, null, 2), 'utf-8');
  } catch {}
  return configStore;
}
