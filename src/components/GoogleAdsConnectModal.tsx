import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle, AlertCircle, RefreshCw, Key, ShieldCheck, 
  ExternalLink, Copy, Check, Sparkles, Database, ArrowRight, Zap, Code
} from 'lucide-react';

interface GoogleAdsConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncSuccess?: (data: any) => void;
}

export const GoogleAdsConnectModal: React.FC<GoogleAdsConnectModalProps> = ({
  isOpen,
  onClose,
  onSyncSuccess,
}) => {
  const [developerToken, setDeveloperToken] = useState('_Nwxgn2-6zk2milYrOdOUQ');
  const [customerId, setCustomerId] = useState('297-136-7807');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [activeTab, setActiveTab] = useState<'api_direct' | 'ads_script'>('api_direct');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; data?: any } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    try {
      const savedDevToken = localStorage.getItem('gads_dev_token');
      const savedCid = localStorage.getItem('gads_customer_id');
      const savedClientId = localStorage.getItem('gads_client_id');
      const savedClientSecret = localStorage.getItem('gads_client_secret');
      const savedRefreshToken = localStorage.getItem('gads_refresh_token');

      if (savedDevToken) setDeveloperToken(savedDevToken);
      if (savedCid) setCustomerId(savedCid);
      if (savedClientId) setClientId(savedClientId);
      if (savedClientSecret) setClientSecret(savedClientSecret);
      if (savedRefreshToken) setRefreshToken(savedRefreshToken);
    } catch {
      // ignore
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveConfig = () => {
    try {
      localStorage.setItem('gads_dev_token', developerToken);
      localStorage.setItem('gads_customer_id', customerId);
      localStorage.setItem('gads_client_id', clientId);
      localStorage.setItem('gads_client_secret', clientSecret);
      localStorage.setItem('gads_refresh_token', refreshToken);
    } catch {
      // ignore
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    handleSaveConfig();

    const cleanCid = customerId.replace(/-/g, '').trim();

    try {
      const response = await fetch('/api/google-ads/test-connection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          developerToken,
          customerId: cleanCid,
          clientId,
          clientSecret,
          refreshToken,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        setTestResult({
          success: true,
          message: `Kết nối thành công đến tài khoản Google Ads (${customerId})! Đã sẵn sàng truy vấn báo cáo.`,
          data: resData,
        });
        if (onSyncSuccess) onSyncSuccess(resData);
      } else {
        setTestResult({
          success: false,
          message: resData.error || 'Chưa đủ thông tin xác thực OAuth 2.0 (Client ID / Refresh Token). Hãy xem tab "Google Ads Script" để kết nối tức thì 100%!',
        });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Lỗi kiểm tra kết nối API.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const googleAdsScriptCode = `/**
 * GOOGLE ADS SCRIPT ĐỒNG BỘ TỰ ĐỘNG - NHA KHOA TÂM ĐỨC SMILE (CID: 297-136-7807)
 * Thu thập toàn bộ số liệu tất cả các tháng từ trước đến nay
 */
function main() {
  // Google Sheet kết nối với Dashboard Tâm Đức Smile
  var spreadsheetUrl = "https://docs.google.com/spreadsheets/d/1w182-MqSp-W1lL3885aglEhbABwhx4bsasblqirJnMg/edit?gid=0#gid=0";
  var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = ss.getActiveSheet();
  sheet.clear(); // Làm mới số liệu

  // Lấy ngày hiện tại
  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = ('0' + (today.getMonth() + 1)).slice(-2);
  var dd = ('0' + today.getDate()).slice(-2);
  var todayStr = yyyy + '-' + mm + '-' + dd;
  
  // Truy vấn toàn bộ chiến dịch theo từng ngày (tất cả các tháng)
  var query = "SELECT segments.date, campaign.name, campaign.status, metrics.impressions, " +
              "metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.ctr, metrics.average_cpc " +
              "FROM campaign " +
              "WHERE segments.date BETWEEN '2024-01-01' AND '" + todayStr + "' " +
              "ORDER BY segments.date DESC, metrics.cost_micros DESC";
              
  var report = AdsApp.report(query);
  report.exportToSheet(sheet);
  Logger.log("✅ Đã đồng bộ thành công toàn bộ số liệu tất cả các tháng vào Dashboard!");
}`;

  const copyScriptToClipboard = () => {
    navigator.clipboard.writeText(googleAdsScriptCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Kết Nối Google Ads API
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  TDS: {customerId}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Đọc dữ liệu chiến dịch, chi phí, click & chuyển đổi từ tài khoản Tâm Đức Smile
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 border-b border-slate-800 bg-slate-950/50 flex gap-2">
          <button
            onClick={() => setActiveTab('api_direct')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'api_direct'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            1. Kết Nối Google Ads REST API (Developer Token)
          </button>
          <button
            onClick={() => setActiveTab('ads_script')}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'ads_script'
                ? 'text-cyan-400 border-cyan-400'
                : 'text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            2. Google Ads Script (Đồng Bộ Tức Thì 1-Click)
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm">
          {activeTab === 'api_direct' ? (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-1">
                <p className="font-semibold text-blue-100 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Thông tin API của bạn đã được thiết lập:
                </p>
                <p>
                  • <strong>Developer Token:</strong> Đã điền sẵn mã <code className="text-cyan-300">_Nwxgn2-6zk2milYrOdOUQ</code> (Quyền truy cập người khám phá)
                </p>
                <p>
                  • <strong>Customer ID (CID):</strong> <code className="text-cyan-300">297-136-7807</code> (TDS - nhakhoatamducsmile.com)
                </p>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Developer Token
                  </label>
                  <input
                    type="text"
                    value={developerToken}
                    onChange={(e) => setDeveloperToken(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-cyan-300 font-mono focus:border-cyan-500 outline-none"
                    placeholder="Mã Developer Token..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Google Ads Customer ID (CID)
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                    placeholder="xxx-xxx-xxxx"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    Xác Thực OAuth 2.0 (Bắt buộc theo chuẩn Google Ads API)
                  </span>
                  <span className="text-[10px] text-slate-400">Google Cloud Console</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      OAuth Client ID (Tùy chọn)
                    </label>
                    <input
                      type="text"
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
                      placeholder="...apps.googleusercontent.com"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">
                      OAuth Client Secret
                    </label>
                    <input
                      type="password"
                      value={clientSecret}
                      onChange={(e) => setClientSecret(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
                      placeholder="GOCSPX-..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    OAuth Refresh Token
                  </label>
                  <input
                    type="password"
                    value={refreshToken}
                    onChange={(e) => setRefreshToken(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono outline-none focus:border-cyan-500"
                    placeholder="1//04..."
                  />
                </div>
              </div>

              {testResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                    testResult.success
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold">{testResult.message}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 space-y-1.5">
                <p className="font-bold text-emerald-100 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  Cách đơn giản nhất: Sử dụng Google Ads Script (Không cần OAuth phức tạp)
                </p>
                <p>
                  Bạn chỉ cần copy đoạn script dưới đây và dán vào mục <strong>Công cụ & Cài đặt &gt; Tập lệnh (Scripts)</strong> trong tài khoản Google Ads <code>297-136-7807</code>.
                </p>
              </div>

              <div className="relative rounded-xl bg-slate-950 border border-slate-800 p-3.5 font-mono text-xs text-slate-300 max-h-56 overflow-y-auto">
                <button
                  onClick={copyScriptToClipboard}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-cyan-300 border border-slate-700 flex items-center gap-1 transition-all"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? 'Đã sao chép!' : 'Copy Script'}</span>
                </button>
                <pre>{googleAdsScriptCode}</pre>
              </div>

              <div className="space-y-2 text-xs text-slate-400">
                <p className="font-bold text-slate-300">3 Bước thực hiện nhanh:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1">
                  <li>Đăng nhập tài khoản Google Ads <strong>297-136-7807</strong>.</li>
                  <li>Vào <strong>Công cụ & Cài đặt (Tools) &gt; Tập lệnh (Scripts) &gt; Bấm dấu (+)</strong>.</li>
                  <li>Dán đoạn mã trên và chọn lịch chạy <strong>Mỗi ngày lúc 06:00 AM</strong>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            Tài khoản: <span className="font-bold text-cyan-400">297-136-7807 (TDS)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Đóng
            </button>
            {activeTab === 'api_direct' ? (
              <button
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center gap-1.5 shadow-lg transition-all disabled:opacity-50"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
                <span>{isTesting ? 'Đang kết nối...' : 'Kiểm Tra & Đồng Bộ'}</span>
              </button>
            ) : (
              <button
                onClick={copyScriptToClipboard}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 shadow-lg transition-all"
              >
                {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedScript ? 'Đã copy' : 'Sao chép đoạn Script'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
