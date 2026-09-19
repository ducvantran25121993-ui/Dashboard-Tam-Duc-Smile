import { VTTechTicket, VTTechConfig, VTTechSyncResponse } from '../types/vttech';

export async function fetchVTTechConfig(): Promise<{ success: boolean; config: any }> {
  try {
    const res = await fetch('/api/vttech/config');
    if (!res.ok) throw new Error('Không thể tải cấu hình VTTech');
    return await res.json();
  } catch (err: any) {
    return { success: false, config: null };
  }
}

export async function saveVTTechConfig(config: Partial<VTTechConfig>): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/vttech/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function fetchCachedVTTechTickets(): Promise<{ success: boolean; total: number; cachedAt: string; data: VTTechTicket[] }> {
  try {
    const res = await fetch('/api/vttech/tickets');
    if (!res.ok) throw new Error('Không thể lấy danh sách vé từ cache');
    const json = await res.json();
    if (typeof window !== 'undefined' && json.success) {
      window.dispatchEvent(new CustomEvent('vttech-updated', { detail: json }));
    }
    return json;
  } catch (err: any) {
    return { success: false, total: 0, cachedAt: '', data: [] };
  }
}

export async function syncVTTechTickets(options?: { dateFrom?: string; dateTo?: string; limit?: number; sourceID?: number; fetchAll?: boolean }): Promise<VTTechSyncResponse> {
  try {
    const res = await fetch('/api/vttech/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options || { limit: 500 }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `Lỗi máy chủ (${res.status})` }));
      throw new Error(err.error || err.details || 'Lỗi khi đồng bộ VTTech');
    }
    const json = await res.json();
    if (typeof window !== 'undefined' && json.success) {
      window.dispatchEvent(new CustomEvent('vttech-updated', { detail: json }));
    }
    return json;
  } catch (err: any) {
    return {
      success: false,
      total: 0,
      cachedAt: new Date().toISOString(),
      data: [],
      error: err.message,
    };
  }
}

export function notifyVTTechUpdated(detail?: any) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vttech-updated', { detail }));
  }
}

export async function importVTTechCurl(curlCommand: string): Promise<{ success: boolean; message?: string; error?: string; liveConnected?: boolean }> {
  try {
    const res = await fetch('/api/vttech/import-curl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ curlCommand }),
    });
    const json = await res.json();
    if (typeof window !== 'undefined' && json.success) {
      window.dispatchEvent(new CustomEvent('vttech-updated', { detail: json }));
    }
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function checkVTTechSession(): Promise<{
  success: boolean;
  isValid: boolean;
  authExpired: boolean;
  lastSyncTime: string | null;
  totalCached: number;
  todayTotal: number;
  todayOL: number;
  todayHL: number;
  todayDate: string;
  username?: string;
  autoLoginEnabled?: boolean;
  error?: string;
}> {
  try {
    const res = await fetch('/api/vttech/check-session');
    if (!res.ok) throw new Error('Không thể kiểm tra phiên VTTech');
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      isValid: false,
      authExpired: true,
      lastSyncTime: null,
      totalCached: 0,
      todayTotal: 0,
      todayOL: 0,
      todayHL: 0,
      todayDate: '',
      error: err.message,
    };
  }
}

export async function importVTTechTickets(tickets: any[]): Promise<{ success: boolean; message?: string; total?: number; error?: string }> {
  try {
    const res = await fetch('/api/vttech/import-tickets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets }),
    });
    const json = await res.json();
    if (typeof window !== 'undefined' && json.success) {
      window.dispatchEvent(new CustomEvent('vttech-updated', { detail: json }));
    }
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function loginVTTechAccount(username?: string, password?: string): Promise<{
  success: boolean;
  message?: string;
  error?: string;
  user?: string;
  todayCount?: number;
  yesterdayCount?: number;
  total?: number;
}> {
  try {
    const res = await fetch('/api/vttech/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await res.json();
    if (typeof window !== 'undefined' && json.success) {
      window.dispatchEvent(new CustomEvent('vttech-updated', { detail: json }));
    }
    return json;
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}


