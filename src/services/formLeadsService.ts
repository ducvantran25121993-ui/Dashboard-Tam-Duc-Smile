import { FormLeadsResponse, FormLeadItem, FormLeadsStats } from '../types/formLead';

export interface FormLeadsFilterParams {
  search?: string;
  service?: string;
  branch?: string;
  filterDuplicate?: 'all' | 'unique' | 'duplicate' | 'invalid';
  month?: number | 'all';
  mode?: 'all' | 'today' | 'yesterday' | 'month';
  page?: number;
  limit?: number;
  force?: boolean;
}

export async function fetchFormLeads(params: FormLeadsFilterParams = {}): Promise<FormLeadsResponse> {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.service && params.service !== 'all') query.set('service', params.service);
  if (params.branch && params.branch !== 'all') query.set('branch', params.branch);
  if (params.filterDuplicate && params.filterDuplicate !== 'all') query.set('filterDuplicate', params.filterDuplicate);
  if (params.month && params.month !== 'all') query.set('month', String(params.month));
  if (params.mode && params.mode !== 'all') query.set('mode', params.mode);
  if (params.page) query.set('page', String(params.page));
  if (params.limit) query.set('limit', String(params.limit));
  if (params.force) query.set('force', 'true');

  const res = await fetch(`/api/form-leads?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Lỗi khi tải dữ liệu Form Leads (${res.status})`);
  }
  return await res.json();
}

export async function triggerSyncFormLeads(): Promise<any> {
  const res = await fetch('/api/form-leads/sync', { method: 'POST' });
  if (!res.ok) {
    throw new Error(`Đồng bộ thất bại (${res.status})`);
  }
  return await res.json();
}
