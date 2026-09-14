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
    return await res.json();
  } catch (err: any) {
    return { success: false, total: 0, cachedAt: '', data: [] };
  }
}

export async function syncVTTechTickets(options?: { dateFrom?: string; dateTo?: string; limit?: number }): Promise<VTTechSyncResponse> {
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
    return await res.json();
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
