import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Clock, ChevronDown, Check, Sparkles } from 'lucide-react';
import { ThemeMode } from '../types';
import {
  getStoredThemeMode,
  saveThemeMode,
  resolveEffectiveTheme,
  applyThemeToDOM,
  isDaytimeNow,
  getAutoTimeDescription,
} from '../utils/themeManager';

interface ThemeToggleProps {
  variant?: 'compact' | 'dropdown' | 'segmented';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => getStoredThemeMode());
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>(() =>
    resolveEffectiveTheme(getStoredThemeMode())
  );
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize and apply theme on mount + auto-check time every 30s
  useEffect(() => {
    const updateTheme = () => {
      const currentMode = getStoredThemeMode();
      setThemeMode(currentMode);
      const effective = resolveEffectiveTheme(currentMode);
      setEffectiveTheme(effective);
      applyThemeToDOM(effective, currentMode);
    };

    updateTheme();

    const interval = setInterval(updateTheme, 30000); // 30s check for auto-time transition

    const handleCustomEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail?.mode) {
        setThemeMode(customEvent.detail.mode);
        setEffectiveTheme(customEvent.detail.effectiveTheme);
      }
    };

    window.addEventListener('theme_changed', handleCustomEvent);
    window.addEventListener('focus', updateTheme);

    return () => {
      clearInterval(interval);
      window.removeEventListener('theme_changed', handleCustomEvent);
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
    setIsOpen(false);
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

  if (variant === 'segmented') {
    return (
      <div
        className={`flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 ${className}`}
      >
        <button
          type="button"
          onClick={() => handleSelectMode('light')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            themeMode === 'light'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
          title="Chế độ Sáng"
        >
          <Sun className="w-3.5 h-3.5 text-amber-300" />
          <span>Sáng</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMode('dark')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            themeMode === 'dark'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
          title="Chế độ Tối"
        >
          <Moon className="w-3.5 h-3.5 text-blue-300" />
          <span>Tối</span>
        </button>

        <button
          type="button"
          onClick={() => handleSelectMode('auto')}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
            themeMode === 'auto'
              ? 'bg-emerald-600 text-white font-bold shadow-sm'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
          title="Tự động theo giờ (06:00 - 18:00 Sáng, 18:00 - 06:00 Tối)"
        >
          <Clock className="w-3.5 h-3.5 text-emerald-300" />
          <span>Theo Giờ</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/60 shadow-sm">
        {/* Main 1-Click Toggle Button */}
        <button
          type="button"
          onClick={handleQuickCycle}
          className={`px-2.5 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer select-none ${
            effectiveTheme === 'light'
              ? 'text-amber-300 hover:text-amber-200 hover:bg-amber-500/10'
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
          ) : themeMode === 'light' ? (
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

        {/* Dropdown Chevron */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="px-1 py-1 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-md transition-colors cursor-pointer"
          title="Tùy chọn chế độ sáng / tối & tự động theo giờ"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/98 backdrop-blur-xl border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-800">
            <p className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Giao Diện Sáng / Tối
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Tùy chỉnh chế độ hiển thị phù hợp với mắt
            </p>
          </div>

          <div className="py-1.5 space-y-1">
            {/* Light Option */}
            <button
              type="button"
              onClick={() => handleSelectMode('light')}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sun className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Chế Độ Sáng</div>
                  <div className="text-[10px] text-slate-400">Giao diện sáng, dễ nhìn ban ngày</div>
                </div>
              </div>
              {themeMode === 'light' && <Check className="w-4 h-4 text-amber-400" />}
            </button>

            {/* Dark Option */}
            <button
              type="button"
              onClick={() => handleSelectMode('dark')}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">Chế Độ Tối</div>
                  <div className="text-[10px] text-slate-400">Giao diện tối dịu mắt, huyền bí</div>
                </div>
              </div>
              {themeMode === 'dark' && <Check className="w-4 h-4 text-blue-400" />}
            </button>

            {/* Auto Schedule Option */}
            <button
              type="button"
              onClick={() => handleSelectMode('auto')}
              className={`w-full px-3 py-2 rounded-xl text-left text-xs flex items-center justify-between transition-all cursor-pointer ${
                themeMode === 'auto'
                  ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
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
                    6h - 18h: Sáng | 18h - 6h: Tối
                  </div>
                </div>
              </div>
              {themeMode === 'auto' && <Check className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>

          {/* Auto status live banner */}
          <div className="mt-1 pt-2 border-t border-slate-800/80 px-2 pb-1">
            <div className="bg-slate-950/80 rounded-lg p-2 text-[10px] text-slate-400 border border-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Hiện tại:
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {isDaytimeNow() ? '☀️ Ban Ngày (Sáng)' : '🌙 Ban Đêm (Tối)'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
