import { AdminUser } from '../components/AdminHubView';
import { ROLE_PRESET_TABS } from '../components/AdminHubView';

export const DEFAULT_SUPER_ADMIN_USER: AdminUser = {
  id: 'u1',
  name: 'Trần Đức',
  email: 'TranDuc474@gmail.com',
  role: 'admin',
  roleLabel: 'Super Admin (Ban Giám Đốc)',
  status: 'active',
  lastActive: 'Vừa xong',
  department: 'Ban Điều Hành',
  allowedTabs: [
    'overview',
    'google_ads',
    'budget_forecast',
    'leads_funnel',
    'campaigns',
    'competitor',
    'consultation',
    'vttech_crm',
    'innovation',
    'landing_builder',
    'ai_agent',
    'admin_hub',
  ],
};

const STORAGE_KEY = 'dashboard_admin_users_list';

/**
 * Fetch synchronized users list from backend server first, fallback to localStorage,
 * and if none exists, strictly default to only Trần Đức (TranDuc474@gmail.com).
 */
export async function fetchUsersFromCloud(): Promise<AdminUser[]> {
  try {
    const res = await fetch('/api/admin/users', {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.users) && data.users.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.users));
        return data.users.map((u: any) => {
          const tabs = u.allowedTabs || ROLE_PRESET_TABS[u.role] || ROLE_PRESET_TABS.marketer;
          const merged = [...tabs];
          if (!merged.includes('budget_forecast')) merged.push('budget_forecast');
          if (!merged.includes('landing_builder')) merged.push('landing_builder');
          return {
            ...u,
            allowedTabs: merged,
          };
        });
      }
    }
  } catch (err) {
    console.warn('[CloudUsers] Server fetch fallback to local storage:', err);
  }

  // Fallback to local storage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((u: any) => {
          const tabs = u.allowedTabs || ROLE_PRESET_TABS[u.role] || ROLE_PRESET_TABS.marketer;
          const merged = [...tabs];
          if (!merged.includes('budget_forecast')) merged.push('budget_forecast');
          if (!merged.includes('landing_builder')) merged.push('landing_builder');
          return {
            ...u,
            allowedTabs: merged,
          };
        });
      }
    }
  } catch {
    // ignore
  }

  return [DEFAULT_SUPER_ADMIN_USER];
}

/**
 * Save users list to both localStorage and the backend server for cross-device synchronization
 */
export async function saveUsersToCloud(users: AdminUser[]): Promise<{ success: boolean }> {
  // Always save locally immediately
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch {
    // ignore
  }

  // Sync to server
  try {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users }),
      signal: AbortSignal.timeout(4000),
    });
    if (res.ok) {
      return { success: true };
    }
  } catch (err) {
    console.warn('[CloudUsers] Failed to sync users to server:', err);
  }

  return { success: false };
}
