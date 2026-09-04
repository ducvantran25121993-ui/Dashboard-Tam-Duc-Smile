import React, { useState, useEffect, useRef } from 'react';
import {
  Sun,
  Moon,
  Clock,
  ChevronDown,
  Check,
  Sparkles,
  Palette,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react';
import { ThemeMode, ThemePalette } from '../types';
import {
  getStoredThemeMode,
  saveThemeMode,
  resolveEffectiveTheme,
  applyThemeToDOM,
  isDaytimeNow,
  getAutoTimeDescription,
} from '../utils/themeManager';
import {
  DARK_PALETTES,
  LIGHT_PALETTES,
  getActivePalette,
  getStoredPaletteId,
  saveStoredPaletteId,
  getStoredCustomHex,
  saveStoredCustomHex,
  getStoredCustomLightness,
  saveStoredCustomLightness,
  generateSafeThemeFromHex,
  applyPaletteToDOM,
} from '../utils/customThemePalettes';

interface ThemeToggleProps {
  variant?: 'compact' | 'dropdown' | 'segmented';
  className?: string;
}

const QUICK_PASTEL_COLORS = [
  { hex: '#edf7f2', label: 'Bạc Hà Nhạt', name: 'Bạc Hà' },
  { hex: '#edf4fa', label: 'Mây Lam Nhạt', name: 'Mây Lam' },
  { hex: '#f5f0fa', label: 'Oải Hương Nhạt', name: 'Oải Hương' },
  { hex: '#faf0f4', label: 'Hồng Phấn Nhạt', name: 'Hồng Phấn' },
  { hex: '#f0f5eb', label: 'Trà Xanh Nhạt', name: 'Trà Xanh' },
  { hex: '#fdfbf5', label: 'Trắng Ngà Nhạt', name: 'Trắng Ngà' },
  { hex: '#fdf5ee', label: 'Đào Mơ Nhạt', name: 'Đào Mơ' },
  { hex: '#f1f5f9', label: 'Ghi Băng Nhạt', name: 'Ghi Băng' },
];

const QUICK_DARK_COLORS = [
  { hex: '#0a1424', label: 'Navy Thẫm', name: 'Navy' },
  { hex: '#061a12', label: 'Rừng Đêm', name: 'Rừng Đêm' },
  { hex: '#170b24', label: 'Thạch Anh Tím', name: 'Tím Đêm' },
  { hex: '#1a110a', label: 'Cà Phê Trầm', name: 'Cà Phê' },
  { hex: '#1c0a10', label: 'Rượu Vang Đậm', name: 'Rượu Vang' },
  { hex: '#080b12', label: 'Đen Huyền Bí', name: 'Đen Tuyền' },
  { hex: '#061626', label: 'Biển Sâu', name: 'Biển Sâu' },
  { hex: '#121417', label: 'Than Núi Lửa', name: 'Than Đá' },
];

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() =>
    resolveEffectiveTheme(getStoredThemeMode())
  );
  const [activePalette, setActivePalette] = useState<ThemePalette>(() =>
    getActivePalette(resolveEffectiveTheme(getStoredThemeMode()))
  );
  const [activeTab, setActiveTab] = useState<'mode' | 'palette'>('mode');
  const [customHex, setCustomHex] = useState<string>(() =>
    getStoredCustomHex(resolveEffectiveTheme(getStoredThemeMode()))
  );
  const [customLightness, setCustomLightness] = useState<number>(() =>
    getStoredCustomLightness(resolveEffectiveTheme(getStoredThemeMode()))
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and apply theme on mount + listen to changes
  useEffect(() => {
    const updateTheme = () => {
      const currentMode = getStoredThemeMode();
      setThemeMode(currentMode);
      const effective = resolveEffectiveTheme(currentMode);
      setEffectiveTheme(effective);
      const palette = getActivePalette(effective);
      setActivePalette(palette);
      setCustomHex(getStoredCustomHex(effective));
      setCustomLightness(getStoredCustomLightness(effective));
      applyThemeToDOM(effective, currentMode);
    };

    updateTheme();

    const interval = setInterval(updateTheme, 30000); // 30s check for auto-time transition

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.mode) {
        setThemeMode(customEvent.detail.mode);
        setEffectiveTheme(customEvent.detail.effectiveTheme);
        const palette = getActivePalette(customEvent.detail.effectiveTheme);
        setActivePalette(palette);
        setCustomHex(getStoredCustomHex(customEvent.detail.effectiveTheme));
        setCustomLightness(getStoredCustomLightness(customEvent.detail.effectiveTheme));
      }
    };

    const handlePaletteEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.palette) {
        setActivePalette(customEvent.detail.palette);
      }
    };

    window.addEventListener('theme_changed', handleCustomEvent);
    window.addEventListener('palette_changed', handlePaletteEvent);
    window.addEventListener('focus', updateTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('theme_changed', handleCustomEvent);
      window.removeEventListener('palette_changed', handlePaletteEvent);
      window.removeEventListener('focus', updateTheme);
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    saveThemeMode(mode);
    const effective = resolveEffectiveTheme(mode);
    setEffectiveTheme(effective);
    applyThemeToDOM(effective, mode);
    const palette = getActivePalette(effective);
    setActivePalette(palette);
    setCustomHex(getStoredCustomHex(effective));
    setCustomLightness(getStoredCustomLightness(effective));
  };

  const handleSelectPalette = (palette: ThemePalette) => {
    setActivePalette(palette);
    saveStoredPaletteId(palette.id, palette.mode);
    if (palette.mode !== effectiveTheme) {
      setEffectiveTheme(palette.mode);
      saveThemeMode(palette.mode);
      setThemeMode(palette.mode);
      setCustomHex(getStoredCustomHex(palette.mode));
      setCustomLightness(getStoredCustomLightness(palette.mode));
    }
    applyPaletteToDOM(palette);
  };

  const handleApplyCustomTheme = (
    hex: string,
    targetMode: 'dark' | 'light',
    lightness?: number
  ) => {
    setCustomHex(hex);
    const lVal = lightness !== undefined ? lightness : getStoredCustomLightness(targetMode);
    setCustomLightness(lVal);

    const generated = generateSafeThemeFromHex(hex, targetMode, lVal);
    setActivePalette(generated);
    saveStoredCustomHex(hex, targetMode);
    saveStoredCustomLightness(lVal, targetMode);
    saveStoredPaletteId(generated.id, targetMode);

    if (targetMode !== effectiveTheme) {
      setEffectiveTheme(targetMode);
      saveThemeMode(targetMode);
      setThemeMode(targetMode);
    }
    applyPaletteToDOM(generated);
  };

  const handleResetToDefault = () => {
    const defaultId = effectiveTheme === 'dark' ? 'default_slate' : 'light_slate';
    const list = effectiveTheme === 'dark' ? DARK_PALETTES : LIGHT_PALETTES;
    const defaultPal = list.find((p) => p.id === defaultId) || list[0];
    handleSelectPalette(defaultPal);
  };

  const autoInfo = getAutoTimeDescription();

  // Quick 1-click cycle: Light -> Dark -> Auto -> Light
  const handleQuickCycle = () => {
    let nextMode: ThemeMode = 'light';
    if (themeMode === 'light') nextMode = 'dark';
    else if (themeMode === 'dark') nextMode = 'auto';
    else nextMode = 'light';

    handleSelectMode(nextMode);
  };

  const currentPalettesList = effectiveTheme === 'dark' ? DARK_PALETTES : LIGHT_PALETTES;
  const isCustomActive = activePalette.id.startsWith('custom_');
  const isDefaultActive = activePalette.id === 'default_slate' || activePalette.id === 'light_slate';

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 shadow-sm">
        {/* Main 1-Click Toggle Sáng / Tối */}
        <button
          type="button"
          onClick={handleQuickCycle}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none ${
            effectiveTheme === 'light'
              ? 'text-amber-400 hover:text-amber-300 hover:bg-amber-500/10'
              : 'text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10'
          }`}
          title={
            themeMode === 'auto'
              ? `Chế độ: Tự động theo giờ (${autoInfo.title}) - Nhấn để đổi`
              : themeMode === 'light'
              ? 'Chế độ: Sáng (Light) - Nhấn để đổi'
              : 'Chế độ: Tối (Dark) - Nhấn để đổi'
          }
        >
          {themeMode === 'auto' ? (
            <div className="flex items-center gap-1">
              <div className="relative">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <span className="hidden sm:inline text-[11px] font-bold text-emerald-300">
                Tự Động ({effectiveTheme === 'light' ? '☀️' : '🌙'})
              </span>
            </div>
          ) : effectiveTheme === 'light' ? (
            <div className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline text-[11px] font-bold text-amber-300">Sáng</span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Moon className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline text-[11px] font-bold text-blue-300">Tối</span>
            </div>
          )}
        </button>

        {/* Dedicated Harmonious Palette Button with live color indicator */}
        <button
          type="button"
          onClick={() => {
            setActiveTab('palette');
            setIsOpen(true);
          }}
          className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none ${
            !isDefaultActive
              ? 'bg-blue-600/25 text-cyan-300 border border-cyan-400/40'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
          }`}
          title={`Phối màu nền: ${activePalette.name} (Nhấn để tùy chỉnh màu)`}
        >
          <Palette className="w-3.5 h-3.5 text-cyan-400" />
          <div
            className="w-2.5 h-2.5 rounded-full border border-white/40 shadow-sm shrink-0"
            style={{ backgroundColor: activePalette.canvasBg }}
          />
          <span className="hidden md:inline text-[11px] font-medium max-w-[85px] truncate">
            {activePalette.name.split(' ')[0]}
          </span>
        </button>

        {/* Dropdown Chevron */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1.5 py-1 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors cursor-pointer"
          title="Tùy chọn hiển thị & bảng màu"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Expanded Multi-Tab Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900/98 backdrop-blur-xl border border-slate-700 shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-slate-100">
          {/* Header Segmented Tabs */}
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 mb-3">
            <button
              type="button"
              onClick={() => setActiveTab('mode')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'mode'
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <span>Chế Độ Sáng / Tối</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('palette')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'palette'
                  ? 'bg-slate-800 text-cyan-300 shadow-sm border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Phối Màu Nền</span>
              {!isDefaultActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              )}
            </button>
          </div>

          {/* TAB 1: SÁNG / TỐI / THEO GIỜ */}
          {activeTab === 'mode' && (
            <div className="space-y-1.5">
              <div className="px-1 pb-1">
                <p className="text-[11px] text-slate-400">
                  Chọn chế độ tương phản phù hợp với điều kiện ánh sáng môi trường:
                </p>
              </div>

              {/* Light Option */}
              <button
                type="button"
                onClick={() => handleSelectMode('light')}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                  themeMode === 'light'
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Sun className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Chế Độ Sáng (Light)</div>
                    <div className="text-[10px] text-slate-400">Giao diện sáng sủa, thích hợp làm việc ban ngày</div>
                  </div>
                </div>
                {themeMode === 'light' && <Check className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Dark Option */}
              <button
                type="button"
                onClick={() => handleSelectMode('dark')}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                  themeMode === 'dark'
                    ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Chế Độ Tối (Dark)</div>
                    <div className="text-[10px] text-slate-400">Giao diện tối huyền bí, bảo vệ mắt khi làm việc ban đêm</div>
                  </div>
                </div>
                {themeMode === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
              </button>

              {/* Auto Schedule Option */}
              <button
                type="button"
                onClick={() => handleSelectMode('auto')}
                className={`w-full px-3 py-2.5 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                  themeMode === 'auto'
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white flex items-center gap-1.5">
                      <span>Tự Động Theo Thời Gian</span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      06:00 - 18:00: Sáng | 18:00 - 06:00: Tối
                    </div>
                  </div>
                </div>
                {themeMode === 'auto' && <Check className="w-4 h-4 text-emerald-400" />}
              </button>

              {/* Live status banner */}
              <div className="mt-2 pt-2 border-t border-slate-800 px-1">
                <div className="bg-slate-950/80 rounded-lg p-2 text-[11px] text-slate-400 border border-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Đang hoạt động:
                  </span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {effectiveTheme === 'light' ? '☀️ Giao diện Sáng' : '🌙 Giao diện Tối'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BẢNG MÀU NỀN HÀI HÒA & TÙY CHỌN */}
          {activeTab === 'palette' && (
            <div className="space-y-3">
              {/* Presets Grid */}
              <div>
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    Bộ Màu Hài Hòa ({effectiveTheme === 'dark' ? 'Chế độ Tối' : 'Chế độ Sáng'})
                  </span>
                  <span className="text-[10px] text-slate-400">Chuẩn công thái học</span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-[190px] overflow-y-auto pr-0.5 no-scrollbar">
                  {currentPalettesList.map((pal) => {
                    const isSelected = activePalette.id === pal.id;
                    return (
                      <button
                        key={pal.id}
                        type="button"
                        onClick={() => handleSelectPalette(pal)}
                        className={`p-2 rounded-xl text-left transition-all border flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-400/70 shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-white/30 shadow-inner shrink-0"
                              style={{ backgroundColor: pal.canvasBg }}
                            />
                            <span
                              className="w-3 h-3 rounded border border-white/20 shrink-0"
                              style={{ backgroundColor: pal.cardBg }}
                              title="Màu thẻ nổi"
                            />
                          </div>
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                        </div>
                        <div>
                          <div className={`text-[11px] font-bold truncate ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                            {pal.name}
                          </div>
                          {pal.badge && (
                            <span className="inline-block mt-0.5 text-[9px] text-slate-400 font-medium">
                              {pal.badge}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Color Input Section */}
              <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-400" />
                    Tùy Chọn Màu Tự Do
                  </span>
                  {isCustomActive ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold">
                      Đang áp dụng
                    </span>
                  ) : (
                    <span className="text-[10px] text-slate-400">Tùy biến theo ý muốn</span>
                  )}
                </div>

                {/* Phong cách hiển thị: Nền Nhạt Pastel vs Nền Tối */}
                <div className="grid grid-cols-2 gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleApplyCustomTheme(customHex, 'light')}
                    className={`py-1 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      effectiveTheme === 'light'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span>Nền Nhạt (Pastel)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCustomTheme(customHex, 'dark')}
                    className={`py-1 px-2 rounded-md text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      effectiveTheme === 'dark'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Moon className="w-3 h-3 text-cyan-400" />
                    <span>Nền Tối (Dark)</span>
                  </button>
                </div>

                {/* Hàng chọn màu & nhập mã hex */}
                <div className="flex items-center gap-2">
                  <label className="relative cursor-pointer shrink-0" title="Nhấn để mở bảng chọn màu tự do">
                    <input
                      type="color"
                      value={customHex}
                      onChange={(e) => handleApplyCustomTheme(e.target.value, effectiveTheme)}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                    />
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-slate-700 shadow-inner flex items-center justify-center transition-transform hover:scale-105"
                      style={{ backgroundColor: customHex }}
                    >
                      <Palette className="w-4 h-4 text-white drop-shadow" />
                    </div>
                  </label>

                  <div className="flex-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={customHex}
                      onChange={(e) => handleApplyCustomTheme(e.target.value, effectiveTheme)}
                      placeholder="#edf7f2"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-100 font-mono focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Màu chọn nhanh theo phong cách hiện tại */}
                <div>
                  <div className="text-[10px] text-slate-400 mb-1 flex items-center justify-between">
                    <span>
                      {effectiveTheme === 'light' ? 'Gợi ý các gam Màu Nhạt Pastel:' : 'Gợi ý các gam Màu Tối Sang Trọng:'}
                    </span>
                    <span className="text-[9px] text-slate-500">Bấm để đổi ngay</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1">
                    {(effectiveTheme === 'light' ? QUICK_PASTEL_COLORS : QUICK_DARK_COLORS).map((item) => (
                      <button
                        key={item.hex}
                        type="button"
                        onClick={() => handleApplyCustomTheme(item.hex, effectiveTheme)}
                        className={`px-1.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer text-left ${
                          customHex.toLowerCase() === item.hex.toLowerCase()
                            ? 'border-cyan-400 bg-slate-800 text-white font-bold shadow-sm'
                            : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300'
                        }`}
                        title={`Chọn gam ${item.label} (${item.hex})`}
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/40 shrink-0 shadow-inner"
                          style={{ backgroundColor: item.hex }}
                        />
                        <span className="text-[10px] truncate">{item.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thanh trượt tinh chỉnh độ sáng/đậm nhạt của nền */}
                <div className="pt-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-semibold text-slate-300 flex items-center gap-1">
                      <Sliders className="w-3 h-3 text-cyan-400" />
                      {effectiveTheme === 'light' ? 'Độ nhạt của màu nền:' : 'Độ sâu của màu tối:'}
                    </span>
                    <span className="font-mono text-cyan-300 font-bold text-[11px]">
                      {customLightness.toFixed(1)}%
                    </span>
                  </div>

                  <input
                    type="range"
                    min={effectiveTheme === 'light' ? 90 : 4}
                    max={effectiveTheme === 'light' ? 98 : 16}
                    step={0.5}
                    value={customLightness}
                    onChange={(e) =>
                      handleApplyCustomTheme(customHex, effectiveTheme, parseFloat(e.target.value))
                    }
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />

                  <div className="flex items-center justify-between text-[9px] text-slate-500 mt-1">
                    <span>{effectiveTheme === 'light' ? 'Đậm màu hơn (90%)' : 'Đen tuyền (4%)'}</span>
                    <span>{effectiveTheme === 'light' ? 'Nhạt dịu mắt (98%)' : 'Sáng dịu (16%)'}</span>
                  </div>
                </div>

                {/* Khung xem trước trực quan (Mini Live Preview Card) */}
                <div className="p-2 rounded-lg border border-slate-800 bg-slate-900/60">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
                    <span className="flex items-center gap-1 text-slate-300 font-semibold">
                      <Eye className="w-3 h-3 text-cyan-400" />
                      Xem trước giao diện thực tế
                    </span>
                    <span className="font-mono text-[9px] text-slate-400 truncate max-w-[140px]">
                      {activePalette.canvasBg}
                    </span>
                  </div>

                  {/* Mô phỏng Canvas + Thẻ Card nổi bật */}
                  <div
                    className="p-2 rounded-lg border transition-colors shadow-inner"
                    style={{
                      backgroundColor: activePalette.canvasBg,
                      borderColor: activePalette.borderColor,
                    }}
                  >
                    <div
                      className="p-2 rounded-md border shadow-sm flex items-center justify-between gap-2"
                      style={{
                        backgroundColor: activePalette.cardBg,
                        borderColor: activePalette.borderColor,
                      }}
                    >
                      <div>
                        <div
                          className="text-[11px] font-bold"
                          style={{ color: effectiveTheme === 'light' ? '#0f172a' : '#f8fafc' }}
                        >
                          Doanh Thu: 54,6 tỷ ₫
                        </div>
                        <div
                          className="text-[9px]"
                          style={{ color: effectiveTheme === 'light' ? '#475569' : '#94a3b8' }}
                        >
                          Tăng trưởng +18.4%
                        </div>
                      </div>

                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${activePalette.accentGlow}25`,
                          color: activePalette.accentGlow,
                          border: `1px solid ${activePalette.accentGlow}50`,
                        }}
                      >
                        ROI 650%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Accuracy & High Contrast Guarantee */}
                <p className="text-[10px] text-slate-400 flex items-start gap-1.5 leading-tight">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>
                    {effectiveTheme === 'light'
                      ? 'Mọi màu bạn chọn được tự động tinh chỉnh thành gam màu nhạt (Pastel) êm dịu, thẻ trắng sắc nét chống mỏi mắt và chữ tương phản tuyệt đối.'
                      : 'Hệ thống tự động tinh chỉnh thành không gian làm việc tối sâu lắng, chữ trắng sắc nét và viền phát sáng tương phản cao.'}
                  </span>
                </p>
              </div>

              {/* Reset to Default Button */}
              <div className="pt-1 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Khôi phục chuẩn gốc</span>
                </button>

                <span className="text-[10px] text-slate-400 font-mono">
                  {activePalette.id.replace('_', ' ')}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
