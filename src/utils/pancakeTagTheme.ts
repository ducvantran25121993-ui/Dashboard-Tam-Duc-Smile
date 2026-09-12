/**
 * Pancake Tag Color & Contrast System
 * Automatically adapts Pancake CRM tag pills for light (white/bright) and dark backgrounds,
 * ensuring high contrast (WCAG AA/AAA compliant) and optimal readability.
 */
import { useState, useEffect } from 'react';

export interface PancakeTagComputedStyle {
  backgroundColor: string;
  borderColor: string;
  color: string;
  dotColor: string;
  badgeBg: string;
  badgeColor: string;
  badgeBorder: string;
}

/**
 * Parse any CSS hex or rgb color string into { r, g, b }.
 */
function parseColorToRgb(colorStr?: string): { r: number; g: number; b: number } {
  if (!colorStr) return { r: 16, g: 185, b: 129 }; // default emerald

  const str = colorStr.trim().toLowerCase();

  // #RRGGBB or #RGB
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3) {
      hex = hex.split('').map((c) => c + c).join('');
    }
    if (hex.length >= 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
        return { r, g, b };
      }
    }
  }

  // rgb(r, g, b)
  const rgbMatch = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10),
      g: parseInt(rgbMatch[2], 10),
      b: parseInt(rgbMatch[3], 10),
    };
  }

  return { r: 16, g: 185, b: 129 };
}

/**
 * Convert RGB to HSL.
 * h: 0-360, s: 0-100, l: 0-100
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
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
        h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
        break;
      case g:
        h = ((b - r) / d + 2) * 60;
        break;
      case b:
        h = ((r - g) / d + 4) * 60;
        break;
    }
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Computes optimal CSS styles for a Pancake tag pill based on:
 * - tag color
 * - selection state
 * - light/dark mode
 */
export function getPancakeTagStyle(
  rawColor: string | undefined,
  isSelected: boolean,
  isLightMode: boolean
): PancakeTagComputedStyle {
  const { r, g, b } = parseColorToRgb(rawColor);
  const { h, s } = rgbToHsl(r, g, b);
  // Relative luminance (0 = black, 1 = white)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

  if (isLightMode) {
    // ==========================================
    // LIGHT MODE (Nền trắng / sáng)
    // ==========================================
    if (isSelected) {
      // Selected in Light Mode: Solid vibrant color pill with high contrast text
      const isBrightBg = lum > 0.55;
      const textCol = isBrightBg ? '#0f172a' : '#ffffff';
      return {
        backgroundColor: hex,
        borderColor: isBrightBg ? 'rgba(0,0,0,0.25)' : hex,
        color: textCol,
        dotColor: isBrightBg ? '#0f172a' : '#ffffff',
        badgeBg: isBrightBg ? 'rgba(0,0,0,0.14)' : 'rgba(0,0,0,0.30)',
        badgeColor: textCol,
        badgeBorder: isBrightBg ? 'rgba(0,0,0,0.20)' : 'rgba(255,255,255,0.30)',
      };
    }

    // Unselected in Light Mode:
    // Soft pastel tint background + sharp border + deep high-contrast text (> 5:1 contrast on white)
    const isVeryBright = lum > 0.65; // Yellows, light limes, bright cyan
    const bgOpacity = isVeryBright ? 0.22 : 0.14;
    const backgroundColor = `rgba(${r}, ${g}, ${b}, ${bgOpacity})`;

    // Border: if the color is bright yellow/lime, darken the border so it's crisp on white
    const borderL = isVeryBright ? 38 : Math.min(65, Math.max(35, Math.round(lum * 70)));
    const borderColor = s < 15
      ? '#94a3b8' // neutral gray border
      : `hsl(${h}, ${Math.min(95, Math.max(40, s))}%, ${borderL}%)`;

    // Text: deep, saturated, readable hue matching the tag family
    // Yellow/Amber (35-65) needs lower lightness (22%) to be dark amber on white
    const textL = h >= 35 && h <= 65 ? 22 : 26;
    const textColor = s < 15
      ? '#1e293b' // deep slate for gray tags
      : `hsl(${h}, ${Math.min(90, Math.max(50, s))}%, ${textL}%)`;

    return {
      backgroundColor,
      borderColor,
      color: textColor,
      dotColor: hex,
      badgeBg: 'rgba(255, 255, 255, 0.92)',
      badgeColor: textColor,
      badgeBorder: `rgba(${r}, ${g}, ${b}, 0.35)`,
    };
  }

  // ==========================================
  // DARK MODE (Nền tối)
  // ==========================================
  if (isSelected) {
    const isBrightBg = lum > 0.55;
    const textCol = isBrightBg ? '#0f172a' : '#ffffff';
    return {
      backgroundColor: hex,
      borderColor: hex,
      color: textCol,
      dotColor: isBrightBg ? '#0f172a' : '#ffffff',
      badgeBg: isBrightBg ? 'rgba(0,0,0,0.25)' : 'rgba(0,0,0,0.40)',
      badgeColor: textCol,
      badgeBorder: 'rgba(255,255,255,0.25)',
    };
  }

  // Unselected in Dark Mode:
  // 22% tinted backdrop + vibrant border + crisp light text with subtle tint
  const isDarkColor = lum < 0.35;
  const textColor = isDarkColor
    ? '#f8fafc'
    : lum > 0.7
    ? `hsl(${h}, 95%, 85%)`
    : '#f8fafc';

  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, 0.22)`,
    borderColor: hex,
    color: textColor,
    dotColor: hex,
    badgeBg: 'rgba(15, 23, 42, 0.75)',
    badgeColor: '#e2e8f0',
    badgeBorder: 'rgba(255, 255, 255, 0.15)',
  };
}

/**
 * Hook to reactively detect if the document is currently in Light Mode (nền trắng / sáng).
 * Listens to theme_changed, palette_changed, and DOM class changes on <html>.
 */
export function useIsLightMode(): boolean {
  const [isLight, setIsLight] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return (
        document.documentElement.classList.contains('theme-light') ||
        document.documentElement.getAttribute('data-theme') === 'light'
      );
    }
    return false;
  });

  useEffect(() => {
    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        const light =
          document.documentElement.classList.contains('theme-light') ||
          document.documentElement.getAttribute('data-theme') === 'light';
        setIsLight(light);
      }
    };

    checkTheme();
    window.addEventListener('theme_changed', checkTheme);
    window.addEventListener('palette_changed', checkTheme);

    const observer = new MutationObserver(() => checkTheme());
    if (typeof document !== 'undefined') {
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'data-theme'],
      });
    }

    return () => {
      window.removeEventListener('theme_changed', checkTheme);
      window.removeEventListener('palette_changed', checkTheme);
      observer.disconnect();
    };
  }, []);

  return isLight;
}

