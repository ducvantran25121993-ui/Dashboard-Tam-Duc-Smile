import { ThemeMode } from '../types';

const THEME_STORAGE_KEY = 'dashboard_theme_mode';

/**
 * Checks if current local time is daytime (06:00 to 18:00).
 */
export function isDaytimeNow(): boolean {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18;
}

/**
 * Gets the stored theme mode ('light', 'dark', or 'auto'). Defaults to 'dark'.
 */
export function getStoredThemeMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'dark';
}

/**
 * Saves theme mode to localStorage.
 */
export function saveThemeMode(mode: ThemeMode): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

/**
 * Resolves the effective active theme ('light' or 'dark') based on the current mode and time.
 */
export function resolveEffectiveTheme(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'light') return 'light';
  if (mode === 'dark') return 'dark';
  // auto mode: day = light, night = dark
  return isDaytimeNow() ? 'light' : 'dark';
}

/**
 * Applies the effective theme class to HTML root and document body.
 */
export function applyThemeToDOM(effectiveTheme: 'light' | 'dark', mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;

  if (effectiveTheme === 'light') {
    root.classList.add('theme-light');
    root.classList.remove('theme-dark', 'dark');
    body.classList.add('theme-light');
    body.classList.remove('theme-dark', 'dark');
    root.setAttribute('data-theme', 'light');
  } else {
    root.classList.remove('theme-light');
    root.classList.add('theme-dark', 'dark');
    body.classList.remove('theme-light');
    body.classList.add('theme-dark', 'dark');
    root.setAttribute('data-theme', 'dark');
  }

  root.setAttribute('data-theme-mode', mode);

  // Dispatch custom event for real-time reactivity
  try {
    window.dispatchEvent(
      new CustomEvent('theme_changed', {
        detail: { mode, effectiveTheme, isDaytime: isDaytimeNow() },
      })
    );
  } catch {
    // ignore
  }
}

/**
 * Human-readable description of current auto schedule.
 */
export function getAutoTimeDescription(): { title: string; subtitle: string; isDay: boolean } {
  const isDay = isDaytimeNow();
  const currentHour = new Date().getHours();
  const currentMin = String(new Date().getMinutes()).padStart(2, '0');
  const timeStr = `${currentHour}:${currentMin}`;

  if (isDay) {
    return {
      title: `Ban Ngày (${timeStr}) → Chế Độ Sáng`,
      subtitle: 'Tự động Sáng từ 06:00 đến 18:00',
      isDay: true,
    };
  } else {
    return {
      title: `Ban Đêm (${timeStr}) → Chế Độ Tối`,
      subtitle: 'Tự động Tối từ 18:00 đến 06:00 hôm sau',
      isDay: false,
    };
  }
}
