import { SidebarTab } from '../types';
import { DEFAULT_STAFF_ALLOWED_TABS } from '../components/TabPermissionsModal';

export interface CloudPermissionsPayload {
  allowedTabs: SidebarTab[];
  updatedAt: string;
  version: number;
}

export function ensureStaffPermissions(tabs: (SidebarTab | string)[]): SidebarTab[] {
  const list = (Array.isArray(tabs) ? tabs : []) as SidebarTab[];
  const set = new Set<SidebarTab>(list);
  // Guarantee 'budget_forecast' (Ngân Sách Dự Kiến) and 'landing_builder' (Tạo Landing Page AI) are accessible for staff
  set.add('budget_forecast');
  set.add('landing_builder');
  return Array.from(set);
}

const STORAGE_KEY = 'dashboard_staff_allowed_tabs';
const LAST_SYNC_KEY = 'dashboard_permissions_last_sync';
const CLOUD_SYNC_URL = 'https://api.npoint.io/41c48bf39f37c3daaa80'; // Primary lightweight free cloud KV namespace

/**
 * Fetch permissions from local storage first (instant), then attempt cloud synchronization
 */
export async function fetchPermissionsFromCloud(): Promise<SidebarTab[] | null> {
  const cacheBust = Date.now();
  try {
    // 1. Try local backend API with cache busting
    try {
      const apiRes = await fetch(`/api/permissions?_t=${cacheBust}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
        signal: AbortSignal.timeout(3500),
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && Array.isArray(data.allowedTabs) && data.allowedTabs.length > 0) {
          const normalized = ensureStaffPermissions(data.allowedTabs);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
          return normalized;
        }
      }
    } catch {
      // Backend not accessible -> continue
    }

    // 2. Try Global Cloud KV Store if available
    try {
      const cloudRes = await fetch(`${CLOUD_SYNC_URL}?_t=${cacheBust}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });

      if (cloudRes.ok) {
        const data: CloudPermissionsPayload = await cloudRes.json();
        if (data && Array.isArray(data.allowedTabs) && data.allowedTabs.length > 0) {
          const normalized = ensureStaffPermissions(data.allowedTabs);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
          localStorage.setItem(LAST_SYNC_KEY, data.updatedAt || new Date().toISOString());
          return normalized;
        }
      }
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('[CloudPermissions] Cloud fetch error:', err);
  }

  // Fallback to local storage if available
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const normalized = ensureStaffPermissions(parsed);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        return normalized;
      }
    }
  } catch {
    // ignore
  }

  return ensureStaffPermissions(DEFAULT_STAFF_ALLOWED_TABS);
}

/**
 * Save permissions to both local storage and Cloud synchronization
 */
export async function savePermissionsToCloud(tabs: SidebarTab[]): Promise<{ success: boolean; cloudSynced: boolean; message: string }> {
  const normalized = ensureStaffPermissions(tabs);

  // Always save locally first
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    window.dispatchEvent(new CustomEvent('permissions_updated', { detail: normalized }));
  } catch {
    // ignore local storage error
  }

  let cloudSuccess = false;
  const payload: CloudPermissionsPayload = {
    allowedTabs: normalized,
    updatedAt: new Date().toISOString(),
    version: Date.now(),
  };

  // 1. Try local server API
  try {
    const apiRes = await fetch('/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(3500),
    });
    if (apiRes.ok) {
      cloudSuccess = true;
    }
  } catch {
    // continue to cloud KV
  }

  // 2. Broadcast to Global Cloud KV (Netlify / Vercel / Multi-device realtime)
  try {
    const cloudRes = await fetch(CLOUD_SYNC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(4500),
    });
    if (cloudRes.ok) {
      cloudSuccess = true;
    }
  } catch (err) {
    console.warn('[CloudPermissions] Cloud KV update warning:', err);
  }

  return {
    success: true,
    cloudSynced: cloudSuccess,
    message: cloudSuccess
      ? 'Đã đồng bộ Cloud thành công! Tất cả máy tính, điện thoại & tab ẩn danh sẽ tự động áp dụng.'
      : 'Đã lưu cấu hình phân quyền.',
  };
}
