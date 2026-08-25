import { SidebarTab } from '../types';
import { DEFAULT_STAFF_ALLOWED_TABS } from '../components/TabPermissionsModal';

export interface CloudPermissionsPayload {
  allowedTabs: SidebarTab[];
  updatedAt: string;
  version: number;
}

const STORAGE_KEY = 'dashboard_staff_allowed_tabs';
const LAST_SYNC_KEY = 'dashboard_permissions_last_sync';
const CLOUD_SYNC_URL = 'https://api.npoint.io/41c48bf39f37c3daaa80'; // Primary lightweight free cloud KV namespace

/**
 * Fetch permissions from local storage first (instant), then attempt cloud synchronization
 */
export async function fetchPermissionsFromCloud(): Promise<SidebarTab[] | null> {
  try {
    // 1. Try local backend API if available (Express / Node / Vercel serverless)
    try {
      const apiRes = await fetch('/api/permissions', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      });
      if (apiRes.ok) {
        const data = await apiRes.json();
        if (data && Array.isArray(data.allowedTabs) && data.allowedTabs.length > 0) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.allowedTabs));
          localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
          return data.allowedTabs as SidebarTab[];
        }
      }
    } catch {
      // Backend not accessible or static host (Netlify/Vercel static) -> continue to Cloud KV
    }

    // 2. Try Global Cloud KV Store (Free, works across all devices, mobile, incognito, Netlify)
    const cloudRes = await fetch(CLOUD_SYNC_URL, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (cloudRes.ok) {
      const data: CloudPermissionsPayload = await cloudRes.json();
      if (data && Array.isArray(data.allowedTabs) && data.allowedTabs.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.allowedTabs));
        localStorage.setItem(LAST_SYNC_KEY, data.updatedAt || new Date().toISOString());
        return data.allowedTabs;
      }
    }
  } catch (err) {
    console.warn('[CloudPermissions] Cloud fetch fallback to local/default:', err);
  }

  // Fallback to local storage if available
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as SidebarTab[];
      }
    }
  } catch {
    // ignore
  }

  return DEFAULT_STAFF_ALLOWED_TABS;
}

/**
 * Save permissions to both local storage and Cloud synchronization
 */
export async function savePermissionsToCloud(tabs: SidebarTab[]): Promise<{ success: boolean; cloudSynced: boolean; message: string }> {
  // Always save locally first
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tabs));
    localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
  } catch {
    // ignore local storage error
  }

  let cloudSuccess = false;
  const payload: CloudPermissionsPayload = {
    allowedTabs: tabs,
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
