import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, FileSpreadsheet, ExternalLink, Settings, Clock } from 'lucide-react';
import { DEFAULT_SHEET_URL } from '../services/googleSheetsService';

interface SheetStatusBannerProps {
  isLive: boolean;
  isFetching: boolean;
  lastUpdated: Date | null;
  sheetUrl: string;
  onRefresh: () => void;
  onUpdateSheetUrl: (newUrl: string) => void;
  autoRefreshEnabled: boolean;
  onToggleAutoRefresh: () => void;
  userRole?: 'admin' | 'staff' | null;
}

export const SheetStatusBanner: React.FC<SheetStatusBannerProps> = ({
  isLive,
  isFetching,
  lastUpdated,
  sheetUrl,
  onRefresh,
  onUpdateSheetUrl,
  autoRefreshEnabled,
  onToggleAutoRefresh,
  userRole,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [tempUrl, setTempUrl] = useState(sheetUrl);

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUrl.trim()) {
      onUpdateSheetUrl(tempUrl.trim());
      setShowModal(false);
    }
  };

  const formattedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'N/A';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
      {/* Left: Connection Status */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
          <FileSpreadsheet className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm">Kết Nối Google Sheet Live</span>
            {isLive ? (
              <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                <CheckCircle2 className="w-3 h-3" /> Đang Đồng Bộ Tự Động
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-[11px] font-semibold">
                <AlertCircle className="w-3 h-3" /> Dữ Liệu Bộ Nhớ Đệm
              </span>
            )}
          </div>
          <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1.5 flex-wrap">
            <span>
              Lần cập nhật cuối: <strong className="text-slate-200">{formattedTime}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">
              Cập nhật tự động 30s/lần
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400/90 text-[11px]">
              (Google Sheet mất 1-2 phút xuất CSV sau khi bạn sửa)
            </span>
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
        {/* Open Sheet external link - Only for Admin */}
        {userRole !== 'staff' && (
          <a
            href={sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 font-medium flex items-center gap-1.5 transition-all"
            title="Mở Google Sheet trên tab mới"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Mở Sheet</span>
          </a>
        )}

        {/* Change URL button - Only for Admin */}
        {userRole !== 'staff' && (
          <button
            onClick={() => {
              setTempUrl(sheetUrl);
              setShowModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/80 font-medium flex items-center gap-1.5 transition-all"
          >
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <span>Cấu hình Sheet</span>
          </button>
        )}

        {/* Refresh Now Button */}
        <button
          onClick={onRefresh}
          disabled={isFetching}
          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-900/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          <span>{isFetching ? 'Đang cập nhật...' : 'Đồng Bộ Ngay'}</span>
        </button>
      </div>

      {/* Config Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <span>Cấu Hình Đường Dẫn Google Sheet</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nhập đường dẫn Google Sheet để bảng điều khiển tự động đọc dữ liệu mới nhất từ các sheet: <strong className="text-white">Doanh Thu Theo Tháng</strong> và <strong className="text-white">Data Ngày</strong>.
            </p>

            <form onSubmit={handleSaveUrl} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Link Google Sheet (Đã mở quyền xem):
                </label>
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full bg-slate-950 border border-slate-700 text-slate-100 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  required
                />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setTempUrl(DEFAULT_SHEET_URL)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Khôi phục link mặc định
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/30"
                  >
                    Lưu & Cập Nhật
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
