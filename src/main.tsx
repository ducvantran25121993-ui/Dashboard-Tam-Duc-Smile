import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { getStoredThemeMode, resolveEffectiveTheme, applyThemeToDOM } from './utils/themeManager';
import { getActivePalette, applyPaletteToDOM } from './utils/customThemePalettes';

// Tự động nâng cấp mô hình Gemini lên 3.8 Flash nếu đang lưu 3.7 hoặc cũ hơn
try {
  const currentModel = localStorage.getItem('ai_agent_model');
  const autoUpdate = localStorage.getItem('ai_agent_auto_update_model') !== 'false';
  if (autoUpdate && (!currentModel || currentModel.includes('3.7') || currentModel.includes('3.6') || currentModel.includes('2.0'))) {
    localStorage.setItem('ai_agent_model', 'gemini-3.8-flash');
  }
} catch (e) {
  // ignore
}

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
