import React, { useState, useEffect, useRef } from 'react';
import {
  Calendar,
  ChevronDown,
  TrendingUp,
  Layers,
  CalendarRange,
  Check,
  RotateCcw,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { MonthTab, DisplayUnit } from '../types';
import { MonthDataset } from '../data/revenueData';
import { formatVND, getCurrentVietnamMonth } from '../utils/formatters';
import {
  isCustomRange,
  parseCustomRange,
  formatRangeLabel,
} from '../utils/quarterAggregator';

interface MonthNavigationProps {
  activeTab: MonthTab;
  onSelectTab: (tab: MonthTab) => void;
  monthlyData?: MonthDataset[];
  displayUnit?: DisplayUnit;
}

interface QuarterGroup {
  id: 'q1' | 'q2' | 'q3' | 'q4';
  label: string;
  shortLabel: string;
  rangeLabel: string;
  months: (1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)[];
}

const QUARTERS: QuarterGroup[] = [
  { id: 'q1', label: 'Quý 1', shortLabel: 'Q1', rangeLabel: 'T1 - T3', months: [1, 2, 3] },
  { id: 'q2', label: 'Quý 2', shortLabel: 'Q2', rangeLabel: 'T4 - T6', months: [4, 5, 6] },
  { id: 'q3', label: 'Quý 3', shortLabel: 'Q3', rangeLabel: 'T7 - T9', months: [7, 8, 9] },
  { id: 'q4', label: 'Quý 4', shortLabel: 'Q4', rangeLabel: 'T10', months: [10] },
];

export const MonthNavigation: React.FC<MonthNavigationProps> = ({
  activeTab,
  onSelectTab,
  monthlyData = [],
  displayUnit = 'full',
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tab inside popover: 'single' (từng tháng) | 'range' (chọn chung / khoảng tháng)
  const [popoverTab, setPopoverTab] = useState<'single' | 'range'>('single');

  // Range dropdown selection state (default T1 -> T6)
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(6);

  // Custom multi-select months (chips)
  const [selectedMonths, setSelectedMonths] = useState<number[]>([1, 2, 3, 4, 5, 6]);

  // Sync internal state when activeTab changes
  useEffect(() => {
    if (isCustomRange(activeTab)) {
      const parsed = parseCustomRange(activeTab);
      if (parsed && parsed.length > 0) {
        setRangeStart(parsed[0]);
        setRangeEnd(parsed[parsed.length - 1]);
        setSelectedMonths(parsed);
        setPopoverTab('range');
      }
    }
  }, [activeTab]);

  // Close dropdown on click outside or ESC
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  // Month data statistics helper
  const getMonthStats = (monthNum: number) => {
    const ds = monthlyData.find((d) => d.month === monthNum);
    if (!ds) return { hasData: false, totalRev: 0, totalCost: 0 };
    const totalRev = ds.regions.reduce((sum, r) => sum + (r.revenue || 0), 0);
    const totalCost = ds.regions.reduce((sum, r) => sum + (r.costVAT || 0), 0);
    const hasData = ds.regions.some(
      (r) => (r.costVAT || 0) > 0 || (r.revenue || 0) > 0 || (r.totalData || 0) > 0
    );
    return { hasData, totalRev, totalCost };
  };

  const currentCalMonth = getCurrentVietnamMonth();

  // Toggle month selection chip
  const toggleMonthChip = (mNum: number) => {
    setSelectedMonths((prev) => {
      if (prev.includes(mNum)) {
        if (prev.length <= 1) return prev; // Keep at least 1 month
        return prev.filter((m) => m !== mNum);
      } else {
        return [...prev, mNum].sort((a, b) => a - b);
      }
    });
  };

  // Apply Range (Start -> End)
  const handleApplyRange = () => {
    const start = Math.min(rangeStart, rangeEnd);
    const end = Math.max(rangeStart, rangeEnd);
    onSelectTab(`range:${start}-${end}`);
    setIsDropdownOpen(false);
  };

  // Apply Multi-select Chips
  const handleApplyMultiSelect = () => {
    if (selectedMonths.length === 0) return;
    const sorted = [...selectedMonths].sort((a, b) => a - b);
    
    // If consecutive, use range:start-end format
    let isConsecutive = true;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] !== sorted[i - 1] + 1) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive && sorted.length > 1) {
      onSelectTab(`range:${sorted[0]}-${sorted[sorted.length - 1]}`);
    } else {
      onSelectTab(`custom:${sorted.join(',')}`);
    }
    setIsDropdownOpen(false);
  };

  // Apply a quick preset
  const handleApplyPreset = (tabVal: string) => {
    onSelectTab(tabVal);
    setIsDropdownOpen(false);
  };

  // Button label formatting
  let triggerLabel = 'Xem Theo Tháng';
  const isRangeActive = isCustomRange(activeTab);

  if (typeof activeTab === 'number') {
    triggerLabel = `Đang xem: Tháng ${activeTab}`;
  } else if (isRangeActive) {
    const parsed = parseCustomRange(activeTab) || [];
    triggerLabel = `${formatRangeLabel(parsed)} (${parsed.length}T)`;
  }

  return (
    <div className="pt-3 pb-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
      {/* LEFT: Quý 1, Quý 2, Quý 3, 6 Tháng & Tổng Quan */}
      <div className="flex items-center flex-wrap gap-2">
        <div className="inline-flex items-center gap-1 sm:gap-1.5 p-1 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-slate-800/90 shadow-xl overflow-x-auto no-scrollbar">
          {/* Quarter Tabs Pill Group */}
          <div className="inline-flex items-center p-0.5 bg-slate-950/60 rounded-xl border border-slate-800/60 gap-0.5">
            {QUARTERS.map((q) => {
              const isQuarterActive = activeTab === q.id;
              const isCurrentMonthInQ = typeof activeTab === 'number' && q.months.includes(activeTab as any);

              return (
                <button
                  key={q.id}
                  onClick={() => onSelectTab(q.id)}
                  className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                    isQuarterActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 ring-2 ring-blue-400/50'
                      : isCurrentMonthInQ
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={`Xem tổng hợp toàn bộ doanh thu, chi phí, data của ${q.label} (${q.rangeLabel})`}
                >
                  <span>{q.label}</span>
                  <span className={`text-[10px] font-normal px-1 py-0.2 rounded ${
                    isQuarterActive ? 'bg-blue-900/80 text-blue-100' : 'text-slate-500'
                  }`}>
                    {q.rangeLabel}
                  </span>
                  {isQuarterActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Subtle Divider */}
          <div className="h-5 w-px bg-slate-800/90 mx-0.5 shrink-0" />

          {/* Tổng Quan Button */}
          <button
            onClick={() => onSelectTab('overview')}
            className={`group relative flex items-center justify-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 shrink-0 select-none overflow-hidden cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 text-slate-950 font-black border-2 border-white ring-4 ring-emerald-400/60 shadow-[0_0_20px_rgba(52,211,153,0.8)] scale-[1.03] -translate-y-0.5 z-20'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-slate-700/60'
            }`}
            title="Xem tổng quan doanh thu & chi phí toàn bộ các tháng"
          >
            <TrendingUp className={`w-3.5 h-3.5 shrink-0 ${
              activeTab === 'overview' ? 'text-slate-950 stroke-[2.5]' : 'text-emerald-400'
            }`} />
            <span>Tổng Quan</span>
          </button>
        </div>
      </div>

      {/* RIGHT: Nút Xem Từng Tháng / Chọn Chung Sổ Xuống */}
      <div className="relative shrink-0 self-start sm:self-auto" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className={`group relative flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer border select-none ${
            typeof activeTab === 'number' || isRangeActive
              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400 shadow-md shadow-blue-500/30 ring-2 ring-blue-400/50'
              : isDropdownOpen
              ? 'bg-slate-800 text-white border-slate-600 shadow-sm'
              : 'bg-slate-900/90 hover:bg-slate-800/90 text-slate-300 hover:text-white border-slate-800/80 hover:border-slate-700 shadow-md'
          }`}
          title="Bấm để mở menu sổ xuống chọn xem chi tiết từng tháng hoặc chọn chung nhiều tháng"
        >
          {isRangeActive ? (
            <CalendarRange className="w-4 h-4 shrink-0 text-white" />
          ) : (
            <Calendar className={`w-4 h-4 shrink-0 ${
              typeof activeTab === 'number' ? 'text-white' : 'text-cyan-400'
            }`} />
          )}

          <span>{triggerLabel}</span>

          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ml-0.5 ${
            isDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400 group-hover:text-slate-200'
          }`} />
        </button>

        {/* DROPDOWN MENU POPOVER */}
        {isDropdownOpen && (
          <div className="absolute top-full right-0 mt-2 z-50 w-[330px] sm:w-[410px] p-3.5 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-2xl shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 month-nav-popover">
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  <CalendarRange className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Tùy Chọn Xem Dữ Liệu</h4>
                  <p className="text-[10px] text-slate-400">Xem 1 tháng lẻ hoặc chọn các tháng</p>
                </div>
              </div>
              
              {/* Active Badge */}
              {isRangeActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/40">
                  Đang Chọn Khoảng
                </span>
              )}
              {typeof activeTab === 'number' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/40">
                  T{activeTab} Đang Chọn
                </span>
              )}
            </div>

            {/* Switcher: Tháng vs Tuỳ Chọn */}
            <div className="grid grid-cols-2 p-1 bg-slate-950/70 rounded-xl border border-slate-800/80 mb-3 gap-1">
              <button
                onClick={() => setPopoverTab('single')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  popoverTab === 'single'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Tháng</span>
              </button>

              <button
                onClick={() => setPopoverTab('range')}
                className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  popoverTab === 'range'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Tuỳ Chọn</span>
              </button>
            </div>

            {/* TAB 1: XEM 1 THÁNG LẺ */}
            {popoverTab === 'single' && (
              <div className="space-y-2.5">
                {QUARTERS.map((q) => (
                  <div key={q.id} className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/70 month-nav-quarter-card">
                    <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-slate-800/60">
                      <span className="text-[11px] font-bold text-blue-400">
                        {q.label}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {q.rangeLabel}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {q.months.map((mNum) => {
                        const isActive = activeTab === mNum;
                        const isCurrentMonth = mNum === currentCalMonth;
                        const stats = getMonthStats(mNum);

                        return (
                          <button
                            key={`quarter-${q.id}-m-${mNum}`}
                            onClick={() => {
                              onSelectTab(mNum);
                              setIsDropdownOpen(false);
                            }}
                            className={`p-1.5 rounded-lg text-xs font-semibold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer text-center relative ${
                              isActive
                                ? 'bg-blue-600 text-white font-bold shadow-md ring-1 ring-blue-400'
                                : isCurrentMonth
                                ? 'bg-blue-500/20 text-blue-200 border-2 border-blue-400/60 shadow-sm'
                                : stats.hasData
                                ? 'text-slate-200 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700'
                                : 'text-slate-500 hover:text-slate-300 bg-slate-900/40 hover:bg-slate-800/40'
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isActive
                                    ? 'bg-white'
                                    : isCurrentMonth
                                    ? 'bg-cyan-300 shadow-[0_0_6px_rgba(6,182,212,0.9)] animate-pulse'
                                    : stats.hasData
                                    ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,0.8)]'
                                    : 'bg-slate-600'
                                }`}
                              />
                              <span>{`Tháng ${mNum}`}</span>
                              {isCurrentMonth && (
                                <span className={`text-[8px] font-bold px-1 py-0.2 rounded leading-none ${
                                  isActive ? 'bg-white/20 text-white' : 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/40'
                                }`}>
                                  Hiện tại
                                </span>
                              )}
                            </div>
                            {stats.hasData && stats.totalRev > 0 && (
                              <span className={`text-[9px] font-mono leading-none ${
                                isActive ? 'text-blue-100 font-bold' : 'text-slate-400'
                              }`}>
                                {formatVND(stats.totalRev, displayUnit)}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: GOM CHUNG CÁC THÁNG (VÍ DỤ T1 - T6) */}
            {popoverTab === 'range' && (
              <div className="space-y-3">
                {/* 1. Chọn Khoảng Từ - Đến */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-blue-400" />
                      Chọn Khoảng Tháng
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                      {Math.abs(rangeEnd - rangeStart) + 1} Tháng
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Từ Tháng */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Từ Tháng:</label>
                      <select
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
                          <option key={`opt-range-start-${m}`} value={m}>
                            Tháng {m} {m === currentCalMonth ? '(Hiện tại)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Đến Tháng */}
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">Đến Tháng:</label>
                      <select
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Number(e.target.value))}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => (
                          <option key={`opt-range-end-${m}`} value={m}>
                            Tháng {m} {m === currentCalMonth ? '(Hiện tại)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Nút Thực Hiện Gom Khoảng */}
                  <button
                    onClick={handleApplyRange}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>🚀 Tổng Hợp Số Liệu Tháng {Math.min(rangeStart, rangeEnd)} → Tháng {Math.max(rangeStart, rangeEnd)}</span>
                  </button>
                </div>

                {/* 2. Lối Tắt Nhanh Phổ Biến (1 Bấm) */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-300 block">Lối Tắt Nhanh:</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {/* 6 Tháng Đầu Năm: Exactly matches the user's prompt! */}
                    <button
                      onClick={() => handleApplyPreset('range:1-6')}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        activeTab === 'range:1-6'
                          ? 'bg-blue-600/30 text-white border-blue-400 ring-1 ring-blue-400'
                          : 'bg-slate-950/50 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                      title="Xem tổng hợp 6 tháng đầu năm (Tháng 1 đến Tháng 6)"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>6 Tháng Đầu</span>
                      </div>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                        T1 - T6
                      </span>
                    </button>

                    {/* 6 Tháng Cuối (T4 - T9) */}
                    <button
                      onClick={() => handleApplyPreset('range:4-9')}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        activeTab === 'range:4-9'
                          ? 'bg-blue-600/30 text-white border-blue-400 ring-1 ring-blue-400'
                          : 'bg-slate-950/50 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                      title="Xem tổng hợp 6 tháng từ Tháng 4 đến Tháng 9"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        <span>T4 - T9</span>
                      </div>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono font-bold">
                        T4 - T9
                      </span>
                    </button>

                    {/* Quý 1 + Quý 2 */}
                    <button
                      onClick={() => handleApplyPreset('range:1-6')}
                      className="p-2 rounded-xl border bg-slate-950/50 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700 text-xs font-semibold flex items-center justify-between cursor-pointer transition-all"
                      title="Quý 1 + Quý 2 (T1 - T6)"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Q1 + Q2</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        T1 - T6
                      </span>
                    </button>

                    {/* Toàn bộ 10 Tháng */}
                    <button
                      onClick={() => handleApplyPreset('range:1-10')}
                      className={`p-2 rounded-xl border text-xs font-semibold flex items-center justify-between cursor-pointer transition-all ${
                        activeTab === 'range:1-10'
                          ? 'bg-blue-600/30 text-white border-blue-400 ring-1 ring-blue-400'
                          : 'bg-slate-950/50 hover:bg-slate-800 text-slate-200 border-slate-800 hover:border-slate-700'
                      }`}
                      title="Xem tổng hợp 10 tháng từ Tháng 1 đến Tháng 10"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>Cả 10 Tháng</span>
                      </div>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">
                        T1 - T10
                      </span>
                    </button>
                  </div>
                </div>

                {/* 3. Tự Tích Chọn Từng Tháng Bất Kỳ */}
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-300">
                      Tự Chọn Từng Tháng:
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <button
                        onClick={() => setSelectedMonths([1, 2, 3, 4, 5, 6])}
                        className="text-cyan-400 hover:underline cursor-pointer"
                      >
                        T1-T6
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        onClick={() => setSelectedMonths([7, 8, 9, 10])}
                        className="text-cyan-400 hover:underline cursor-pointer"
                      >
                        T7-T10
                      </button>
                      <span className="text-slate-600">•</span>
                      <button
                        onClick={() => setSelectedMonths([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}
                        className="text-cyan-400 hover:underline cursor-pointer"
                      >
                        Tất cả (10T)
                      </button>
                    </div>
                  </div>

                  {/* 10 Month Chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => {
                      const isSelected = selectedMonths.includes(m);
                      const isCurrentMonth = m === currentCalMonth;
                      return (
                        <button
                          key={`month-chip-select-${m}`}
                          onClick={() => toggleMonthChip(m)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? 'bg-blue-600 text-white font-bold shadow-sm'
                              : isCurrentMonth
                              ? 'bg-blue-950/80 text-blue-200 border border-blue-500/50'
                              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-400 border border-slate-800'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>Tháng {m}</span>
                          {isCurrentMonth && !isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Nút Xác Nhận Tự Chọn */}
                  <button
                    onClick={handleApplyMultiSelect}
                    disabled={selectedMonths.length === 0}
                    className="w-full mt-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Tổng Hợp {selectedMonths.length} Tháng Đã Chọn</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
