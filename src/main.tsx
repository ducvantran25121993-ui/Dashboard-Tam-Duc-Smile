import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getStoredThemeMode, resolveEffectiveTheme, applyThemeToDOM } from './utils/themeManager';
import { getActivePalette, applyPaletteToDOM } from './utils/customThemePalettes';

// Áp dụng theme và bảng màu tùy chỉnh ngay khi khởi động trang
try {
  const initialMode = getStoredThemeMode();
  const effectiveTheme = resolveEffectiveTheme(initialMode);
  applyThemeToDOM(effectiveTheme, initialMode);
  const activePalette = getActivePalette(effectiveTheme);
  applyPaletteToDOM(activePalette);
} catch (e) {
  console.error('Error initializing theme on boot:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
