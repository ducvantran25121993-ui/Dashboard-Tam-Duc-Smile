import { ThemePalette } from '../types';

export const DARK_PALETTES: ThemePalette[] = [
  {
    id: 'default_slate',
    name: 'Than Chì (Mặc Định)',
    badge: 'Chuẩn gốc',
    mode: 'dark',
    canvasBg: '#0b1120', // Đậm đà, sạch mắt, dễ phân biệt
    cardBg: '#131d33',   // Thẻ nổi bật hơn canvas rõ ràng
    cardElevated: '#1e2d4d', // Khối phụ sắc nét
    borderColor: '#2d3f66', // Đường viền cân đối
    headerBg: 'rgba(19, 29, 51, 0.94)',
    sidebarBg: 'rgba(11, 17, 32, 0.96)',
    accentGlow: '#38bdf8',
    previewColor: '#131d33',
  },
  {
    id: 'ocean_navy',
    name: 'Xanh Biển Sâu (Navy)',
    badge: 'Tập trung',
    mode: 'dark',
    canvasBg: '#07162c', // Xanh navy đậm rõ ràng
    cardBg: '#0f2445',   // Thẻ xanh navy nổi bật
    cardElevated: '#173663', // Khối phụ
    borderColor: '#244c85', // Đường viền tương phản tốt
    headerBg: 'rgba(15, 36, 69, 0.94)',
    sidebarBg: 'rgba(7, 22, 44, 0.96)',
    accentGlow: '#60a5fa',
    previewColor: '#0f2445',
  },
  {
    id: 'emerald_forest',
    name: 'Xanh Rêu Thảo Mộc',
    badge: 'Dịu mắt',
    mode: 'dark',
    canvasBg: '#071d14', // Xanh rêu đậm dễ chịu
    cardBg: '#0e2f22',   // Thẻ xanh lục dịu mắt
    cardElevated: '#154532', // Khối phụ
    borderColor: '#1f6348', // Viền xanh hài hòa
    headerBg: 'rgba(14, 47, 34, 0.94)',
    sidebarBg: 'rgba(7, 29, 20, 0.96)',
    accentGlow: '#34d399',
    previewColor: '#0e2f22',
  },
  {
    id: 'onyx_charcoal',
    name: 'Đen Khói Tối Giản (Onyx)',
    badge: 'Tương phản cao',
    mode: 'dark',
    canvasBg: '#121316', // Đen khói trung tính
    cardBg: '#1c1e24',   // Thẻ tương phản sắc nét
    cardElevated: '#282b34', // Khối phụ
    borderColor: '#3a3e4b', // Viền tinh gọn
    headerBg: 'rgba(28, 30, 36, 0.94)',
    sidebarBg: 'rgba(18, 19, 22, 0.96)',
    accentGlow: '#a1a1aa',
    previewColor: '#1c1e24',
  },
  {
    id: 'warm_espresso',
    name: 'Cà Phê Ấm (Espresso)',
    badge: 'Chống mỏi mắt',
    mode: 'dark',
    canvasBg: '#1a110d', // Tông nâu gỗ ấm áp
    cardBg: '#291b15',   // Thẻ nâu ấm tương phản
    cardElevated: '#3d2920', // Khối phụ
    borderColor: '#593c2f', // Viền đồng nhất
    headerBg: 'rgba(41, 27, 21, 0.94)',
    sidebarBg: 'rgba(26, 17, 13, 0.96)',
    accentGlow: '#fbbf24',
    previewColor: '#291b15',
  },
  {
    id: 'deep_amethyst',
    name: 'Thạch Anh Tím (Amethyst)',
    badge: 'Sang trọng',
    mode: 'dark',
    canvasBg: '#160d24', // Tím thạch anh huyền bí
    cardBg: '#231539',   // Thẻ tím nổi bật
    cardElevated: '#342054', // Khối phụ
    borderColor: '#4d307a', // Viền tím sang trọng
    headerBg: 'rgba(35, 21, 57, 0.94)',
    sidebarBg: 'rgba(22, 13, 36, 0.96)',
    accentGlow: '#c084fc',
    previewColor: '#231539',
  },
];

export const LIGHT_PALETTES: ThemePalette[] = [
  {
    id: 'light_slate',
    name: 'Trắng Băng (Mặc Định)',
    badge: 'Chuẩn gốc',
    mode: 'light',
    canvasBg: '#f8fafc',
    cardBg: '#ffffff',
    cardElevated: '#f1f5f9',
    borderColor: '#e2e8f0',
    headerBg: 'rgba(255, 255, 255, 0.94)',
    sidebarBg: 'rgba(255, 255, 255, 0.96)',
    accentGlow: '#0284c7',
    previewColor: '#f8fafc',
  },
  {
    id: 'light_warm_ivory',
    name: 'Trắng Ngà Ấm Áp',
    badge: 'Chống lóa',
    mode: 'light',
    canvasBg: '#fdfbf7',
    cardBg: '#ffffff',
    cardElevated: '#f7f2ea',
    borderColor: '#e8ded0',
    headerBg: 'rgba(253, 251, 247, 0.94)',
    sidebarBg: 'rgba(255, 255, 255, 0.96)',
    accentGlow: '#b45309',
    previewColor: '#fdfbf7',
  },
  {
    id: 'light_soft_sky',
    name: 'Mây Trời Xanh Nhẹ',
    badge: 'Tươi mới',
    mode: 'light',
    canvasBg: '#f0f5fa',
    cardBg: '#ffffff',
    cardElevated: '#e2edf7',
    borderColor: '#d0dfed',
    headerBg: 'rgba(240, 245, 250, 0.94)',
    sidebarBg: 'rgba(255, 255, 255, 0.96)',
    accentGlow: '#0284c7',
    previewColor: '#f0f5fa',
  },
  {
    id: 'light_mint',
    name: 'Bạc Hà Dịu Mát',
    badge: 'Thư thái',
    mode: 'light',
    canvasBg: '#f1f8f5',
    cardBg: '#ffffff',
    cardElevated: '#e3f2ec',
    borderColor: '#cde4d9',
    headerBg: 'rgba(241, 248, 245, 0.94)',
    sidebarBg: 'rgba(255, 255, 255, 0.96)',
    accentGlow: '#059669',
    previewColor: '#f1f8f5',
  },
];

/* Helper color conversion */
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let cleanHex = hex.replace('#', '').trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map((c) => c + c).join('');
  }
  if (cleanHex.length !== 6) {
    return { h: 220, s: 20, l: 6 };
  }

  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h = Math.round(h * 60);
  }

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h: number, s: number, l: number): string {
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);

  const r = Math.round(f(0) * 255);
  const g = Math.round(f(8) * 255);
  const b = Math.round(f(4) * 255);

  const toHex = (n: number) => n.toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function normalizeHex(hex: string): string {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map((c) => c + c).join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return '#4d2a6f';
  }
  return '#' + clean.toLowerCase();
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const norm = normalizeHex(hex).replace('#', '');
  return {
    r: parseInt(norm.substring(0, 2), 16),
    g: parseInt(norm.substring(2, 4), 16),
    b: parseInt(norm.substring(4, 6), 16),
  };
}

/**
 * Generates an accurate, harmonious and high-contrast theme palette.
 * In Light Mode: Converts any color/hue into a luxurious, soft pastel "màu nhạt"
 * (94-96% lightness) ensuring zero eye-strain and high contrast with white cards.
 * In Dark Mode: Converts into a deep, rich luxury dark surface (7-10% lightness).
 */
export function generateSafeThemeFromHex(
  rawHex: string,
  forceMode?: 'dark' | 'light',
  customLightness?: number
): ThemePalette {
  const inputHex = normalizeHex(rawHex);
  const { h, s, l } = hexToHsl(inputHex);

  const mode = forceMode || (l < 45 ? 'dark' : 'light');

  if (mode === 'dark') {
    // DARK MODE:
    // If the input is already a deep dark color (l <= 13%) and no customLightness, use it.
    // Otherwise derive a deep dark canvas (default ~8.5% lightness)
    const targetL = customLightness !== undefined
      ? Math.max(4, Math.min(customLightness, 18))
      : (l <= 13 ? l : 8.5);

    const safeSat = Math.max(18, Math.min(s, 45));
    const canvasBg = l <= 13 && customLightness === undefined
      ? inputHex
      : hslToHex(h, safeSat, targetL);

    // Harmonious card surfaces matching the user's chosen hue and depth
    const cardL = Math.min(24, Math.max(12, targetL + 6));
    const cardElevatedL = Math.min(32, Math.max(16, targetL + 12));
    const borderL = Math.min(50, Math.max(24, targetL + 18));

    const cardBg = hslToHex(h, Math.max(15, safeSat - 5), cardL);
    const cardElevated = hslToHex(h, Math.max(15, safeSat - 5), cardElevatedL);
    const borderColor = hslToHex(h, Math.min(65, safeSat + 10), borderL);
    const accentGlow = hslToHex(h, Math.max(65, s), 65);

    const cardRgb = hexToRgb(cardBg);
    const canvasRgb = hexToRgb(canvasBg);

    return {
      id: `custom_${mode}`,
      name: 'Màu Tối Tùy Chỉnh',
      badge: 'Đêm sâu lắng',
      mode: 'dark',
      canvasBg,
      cardBg,
      cardElevated,
      borderColor,
      headerBg: `rgba(${cardRgb.r}, ${cardRgb.g}, ${cardRgb.b}, 0.94)`,
      sidebarBg: `rgba(${canvasRgb.r}, ${canvasRgb.g}, ${canvasRgb.b}, 0.96)`,
      accentGlow,
      previewColor: inputHex,
    };
  } else {
    // LIGHT MODE ("MÀU NHẠT"):
    // If the input is already a pastel light color (l >= 91%) and no customLightness, use it directly.
    // If the input is mid-tone/saturated (like #6aaf97 or #3b82f6), derive a soothing,
    // eye-friendly pastel background (default ~95.5% lightness) so it never becomes a dark/muddy swamp.
    const targetL = customLightness !== undefined
      ? Math.max(88, Math.min(customLightness, 98))
      : (l >= 91 ? l : 95.5);

    const safeSat = l >= 91 ? s : Math.max(18, Math.min(s, 35));
    const canvasBg = l >= 91 && customLightness === undefined
      ? inputHex
      : hslToHex(h, safeSat, targetL);

    // Cards are crisp white #ffffff
    const cardBg = '#ffffff';
    // Elevated secondary panels: soft subtle tint
    const cardElevated = hslToHex(h, Math.min(22, safeSat), Math.max(89, targetL - 5.5));
    // Border color: refined pastel outline
    const borderColor = hslToHex(h, Math.min(30, safeSat + 6), Math.max(82, targetL - 10));
    // Accent color: vibrant, accessible version of the user's chosen hue
    const accentGlow = hslToHex(h, Math.max(65, s), 38);

    const canvasRgb = hexToRgb(canvasBg);

    return {
      id: `custom_${mode}`,
      name: 'Màu Nhạt Tùy Chỉnh',
      badge: 'Pastel dịu mắt',
      mode: 'light',
      canvasBg,
      cardBg,
      cardElevated,
      borderColor,
      headerBg: 'rgba(255, 255, 255, 0.95)',
      sidebarBg: `rgba(${canvasRgb.r}, ${canvasRgb.g}, ${canvasRgb.b}, 0.97)`,
      accentGlow,
      previewColor: inputHex,
    };
  }
}

const STORAGE_PALETTE_ID_DARK = 'dashboard_theme_palette_dark_id';
const STORAGE_PALETTE_ID_LIGHT = 'dashboard_theme_palette_light_id';
const STORAGE_CUSTOM_HEX_DARK = 'dashboard_theme_custom_hex_dark';
const STORAGE_CUSTOM_HEX_LIGHT = 'dashboard_theme_custom_hex_light';
const STORAGE_CUSTOM_LIGHTNESS_DARK = 'dashboard_theme_custom_lightness_dark';
const STORAGE_CUSTOM_LIGHTNESS_LIGHT = 'dashboard_theme_custom_lightness_light';

export function getStoredPaletteId(mode: 'dark' | 'light'): string {
  try {
    const key = mode === 'dark' ? STORAGE_PALETTE_ID_DARK : STORAGE_PALETTE_ID_LIGHT;
    const val = localStorage.getItem(key);
    if (val) return val;
  } catch {
    // ignore
  }
  return mode === 'dark' ? 'default_slate' : 'light_slate';
}

export function saveStoredPaletteId(id: string, mode: 'dark' | 'light'): void {
  try {
    const key = mode === 'dark' ? STORAGE_PALETTE_ID_DARK : STORAGE_PALETTE_ID_LIGHT;
    localStorage.setItem(key, id);
  } catch {
    // ignore
  }
}

export function getStoredCustomHex(mode: 'dark' | 'light'): string {
  try {
    const key = mode === 'dark' ? STORAGE_CUSTOM_HEX_DARK : STORAGE_CUSTOM_HEX_LIGHT;
    const val = localStorage.getItem(key);
    if (val) return val;
  } catch {
    // ignore
  }
  return mode === 'dark' ? '#140d24' : '#edf7f2';
}

export function saveStoredCustomHex(hex: string, mode: 'dark' | 'light'): void {
  try {
    const key = mode === 'dark' ? STORAGE_CUSTOM_HEX_DARK : STORAGE_CUSTOM_HEX_LIGHT;
    localStorage.setItem(key, hex);
  } catch {
    // ignore
  }
}

export function getStoredCustomLightness(mode: 'dark' | 'light'): number {
  try {
    const key = mode === 'dark' ? STORAGE_CUSTOM_LIGHTNESS_DARK : STORAGE_CUSTOM_LIGHTNESS_LIGHT;
    const val = localStorage.getItem(key);
    if (val) {
      const parsed = parseFloat(val);
      if (!isNaN(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return mode === 'dark' ? 8.5 : 95.5;
}

export function saveStoredCustomLightness(lightness: number, mode: 'dark' | 'light'): void {
  try {
    const key = mode === 'dark' ? STORAGE_CUSTOM_LIGHTNESS_DARK : STORAGE_CUSTOM_LIGHTNESS_LIGHT;
    localStorage.setItem(key, String(lightness));
  } catch {
    // ignore
  }
}

export function getActivePalette(mode: 'dark' | 'light'): ThemePalette {
  const selectedId = getStoredPaletteId(mode);
  const list = mode === 'dark' ? DARK_PALETTES : LIGHT_PALETTES;

  if (selectedId === `custom_${mode}`) {
    const customHex = getStoredCustomHex(mode);
    const customL = getStoredCustomLightness(mode);
    return generateSafeThemeFromHex(customHex, mode, customL);
  }

  const found = list.find((p) => p.id === selectedId);
  return found || list[0];
}

/**
 * Applies palette variables to document root and body
 */
export function applyPaletteToDOM(palette: ThemePalette): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  const body = document.body;
  const isDefault = palette.id === 'default_slate' || palette.id === 'light_slate';

  if (isDefault) {
    root.setAttribute('data-custom-theme', 'false');
    body.setAttribute('data-custom-theme', 'false');
    root.style.removeProperty('--app-canvas-bg');
    root.style.removeProperty('--app-card-bg');
    root.style.removeProperty('--app-card-elevated');
    root.style.removeProperty('--app-border-color');
    root.style.removeProperty('--app-header-bg');
    root.style.removeProperty('--app-sidebar-bg');
    root.style.removeProperty('--app-accent-glow');

    body.style.removeProperty('--app-canvas-bg');
    body.style.removeProperty('background-color');

    const container = document.getElementById('dashboard-root-container');
    if (container) {
      container.style.removeProperty('background-color');
    }
  } else {
    root.setAttribute('data-custom-theme', 'true');
    body.setAttribute('data-custom-theme', 'true');

    // Đồng bộ class theme (theme-dark vs theme-light) trực tiếp theo mode của palette
    if (palette.mode === 'dark') {
      root.classList.remove('theme-light');
      body.classList.remove('theme-light');
      root.classList.add('theme-dark', 'dark');
      body.classList.add('theme-dark', 'dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.add('theme-light');
      body.classList.add('theme-light');
      root.classList.remove('theme-dark', 'dark');
      body.classList.remove('theme-dark', 'dark');
      root.setAttribute('data-theme', 'light');
    }
    
    // Set CSS variables trên cả html root và body
    const vars = [
      ['--app-canvas-bg', palette.canvasBg],
      ['--app-card-bg', palette.cardBg],
      ['--app-card-elevated', palette.cardElevated],
      ['--app-border-color', palette.borderColor],
      ['--app-header-bg', palette.headerBg],
      ['--app-sidebar-bg', palette.sidebarBg],
      ['--app-accent-glow', palette.accentGlow],
    ];

    vars.forEach(([k, v]) => {
      root.style.setProperty(k, v);
      body.style.setProperty(k, v);
    });

    // Trực tiếp đổi màu nền của body và container chính để phản hồi tức thì
    body.style.setProperty('background-color', palette.canvasBg);
    const container = document.getElementById('dashboard-root-container');
    if (container) {
      container.style.setProperty('background-color', palette.canvasBg);
    }
  }

  try {
    window.dispatchEvent(
      new CustomEvent('palette_changed', {
        detail: { palette, isDefault },
      })
    );
  } catch {
    // ignore
  }
}
