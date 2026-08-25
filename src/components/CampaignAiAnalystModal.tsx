import React, { useState } from 'react';
import { 
  X, Sparkles, Brain, Bot, Send, RefreshCw, CheckCircle2, 
  AlertTriangle, TrendingUp, DollarSign, Target, MousePointerClick, 
  Zap, HelpCircle, Layers, ArrowRight, ShieldCheck, ChevronRight
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { CampaignItem } from '../services/campaignsSheetService';

interface CampaignAiAnalystModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: CampaignItem[];
  summaryMetrics: {
    totalSpent: number;
    totalConversions: number;
    totalClicks: number;
    totalImpressions: number;
    avgCpa: number;
    avgCpc: number;
    avgCtr: string;
    avgConvRate: string;
  };
  timeRangeLabel?: string;
  initialFocusCampaign?: CampaignItem | null;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const CampaignAiAnalystModal: React.FC<CampaignAiAnalystModalProps> = ({
  isOpen,
  onClose,
  campaigns,
  summaryMetrics,
  timeRangeLabel = 'Toàn bộ thời gian',
  initialFocusCampaign = null,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'single' | 'chat'>(
    initialFocusCampaign ? 'single' : 'overview'
  );
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(
    initialFocusCampaign || campaigns[0] || null
  );

  // States for overview analysis
  const [overviewAnalysis, setOverviewAnalysis] = useState<string>('');
  const [isAnalyzingOverview, setIsAnalyzingOverview] = useState(false);
  const [overviewError, setOverviewError] = useState<string | null>(null);

  // States for single campaign analysis
  const [singleAnalysis, setSingleAnalysis] = useState<string>('');
  const [isAnalyzingSingle, setIsAnalyzingSingle] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);

  // States for chat
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Xin chào! Tôi là **AI Trợ Lý Tối Ưu Google Ads** của Tâm Đức Smile. Tôi đã nạp toàn bộ số liệu của **${campaigns.length} chiến dịch** (${campaigns.filter(c => c.status === 'Đang chạy').length} đang chạy) với tổng chi phí **${(summaryMetrics.totalSpent / 1_000_000).toFixed(1)} Tr đ** và **${summaryMetrics.totalConversions.toLocaleString('vi-VN')} chuyển đổi**.\n\nBạn có thể hỏi tôi bất kỳ điều gì về cách tối ưu chi phí, giảm CPA, tăng lead hoặc đánh giá từng chiến dịch cụ thể!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  if (!isOpen) return null;

  // Run full overview analysis
  const runOverviewAnalysis = async () => {
    setIsAnalyzingOverview(true);
    setOverviewError(null);
    try {
      const res = await fetch('/api/analyze-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaigns: campaigns.slice(0, 50),
          summaryMetrics,
          timeRange: timeRangeLabel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi phân tích từ máy chủ');
      }

      setOverviewAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setOverviewError(err.message || 'Không thể kết nối đến Gemini API. Hãy kiểm tra kết nối mạng.');
    } finally {
      setIsAnalyzingOverview(false);
    }
  };

  // Run single campaign analysis
  const runSingleCampaignAnalysis = async (campaign: CampaignItem) => {
    setIsAnalyzingSingle(true);
    setSingleError(null);
    try {
      const res = await fetch('/api/analyze-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaigns: [campaign],
          focusCampaign: campaign,
          summaryMetrics,
          timeRange: timeRangeLabel,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Lỗi khi phân tích chiến dịch');
      }

      setSingleAnalysis(data.analysis);
    } catch (err: any) {
      console.error(err);
      setSingleError(err.message || 'Không thể phân tích chiến dịch này.');
    } finally {
      setIsAnalyzingSingle(false);
    }
  };

  // Send question in chat
  const handleSendQuestion = async (questionToSend?: string) => {
    const query = questionToSend || inputQuestion;
    if (!query.trim() || isChatLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/analyze-campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaigns: campaigns.slice(0, 50),
          summaryMetrics,
          timeRange: timeRangeLabel,
          customQuestion: query,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không nhận được câu trả lời từ AI');
      }

      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.analysis,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: `⚠️ **Lỗi:** ${err.message || 'Không thể phản hồi lúc này.'}`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const quickPrompts = [
    'Phân tích tự động 7 ngày qua & gợi ý tối ưu ngân sách cho các chiến dịch',
    'Chiến dịch nào đang có CPA tốt nhất & mang lại nhiều chuyển đổi nhất?',
    'Có chiến dịch nào đang lãng phí ngân sách hoặc CPA quá cao cần tắt/giảm giá thầu không?',
    'Đánh giá hiệu quả nhóm chiến dịch Trồng Răng Implant và Bọc Răng Sứ',
    'Nhóm khách hàng Việt Kiều (Mỹ, Úc, Châu Á) đang chạy hiệu quả ra sao?',
    'Đề xuất kế hoạch phân bổ lại ngân sách và tối ưu giá thầu cho 7 ngày tới',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* MODAL HEADER */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  AI Phân Tích & Tối Ưu Chiến Dịch Google Ads
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Gemini 3.7 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Đang phân tích {campaigns.length} chiến dịch • {timeRangeLabel} • CID: 297-136-7807
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODAL TABS NAVIGATION */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-800 bg-slate-900/90 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Báo Cáo Tối Ưu Toàn Diện (Full Audit)
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'single'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Soi Chi Tiết 1 Chiến Dịch
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Hỏi Đáp Trực Tiếp Với AI
          </button>
        </div>

        {/* TAB 1: OVERVIEW FULL AUDIT */}
        {activeTab === 'overview' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Tổng chi phí</span>
                <p className="text-sm font-black text-white">{(summaryMetrics.totalSpent / 1_000_000).toFixed(2)} Tr đ</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">Chuyển đổi</span>
                <p className="text-sm font-black text-emerald-400">{summaryMetrics.totalConversions.toLocaleString('vi-VN')} leads</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">CPA Trung bình</span>
                <p className="text-sm font-black text-amber-300">{summaryMetrics.avgCpa.toLocaleString('vi-VN')} đ</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-medium">CTR / CPC</span>
                <p className="text-sm font-black text-cyan-300">{summaryMetrics.avgCtr} • {summaryMetrics.avgCpc.toLocaleString('vi-VN')} đ</p>
              </div>
            </div>

            {/* Main Action Trigger or Analysis Display */}
            {!overviewAnalysis && !isAnalyzingOverview && (
              <div className="py-12 px-4 text-center rounded-2xl bg-gradient-to-b from-slate-950/80 to-slate-900 border border-slate-800 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Brain className="w-7 h-7 animate-pulse" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h4 className="text-base font-black text-white">Khởi Động Báo Cáo Kiểm Tra Toàn Diện</h4>
                  <p className="text-xs text-slate-400">
                    AI sẽ phân tích toàn bộ {campaigns.length} chiến dịch, tìm ra các chiến dịch mang lại ROI cao nhất, các chiến dịch đang ngốn ngân sách và đề xuất hành động tối ưu trong 7 ngày tới.
                  </p>
                </div>
                <button
                  onClick={runOverviewAnalysis}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Bắt Đầu Phân Tích Bằng Gemini
                </button>
              </div>
            )}

            {isAnalyzingOverview && (
              <div className="py-16 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Gemini đang phân tích số liệu {campaigns.length} chiến dịch...</p>
                  <p className="text-xs text-slate-400">Đang tính toán CPA, CTR, phân loại nhóm dịch vụ và lập kế hoạch tối ưu...</p>
                </div>
              </div>
            )}

            {overviewError && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{overviewError}</span>
                </div>
                <button
                  onClick={runOverviewAnalysis}
                  className="px-3 py-1 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-500 transition-colors"
                >
                  Thử lại
                </button>
              </div>
            )}

            {overviewAnalysis && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    Báo Cáo Tối Ưu Chiến Dịch Hoàn Tất
                  </span>
                  <button
                    onClick={runOverviewAnalysis}
                    disabled={isAnalyzingOverview}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzingOverview ? 'animate-spin' : ''}`} />
                    Phân tích lại
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-amber-300">
                  <ReactMarkdown>{overviewAnalysis}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SINGLE CAMPAIGN DEEP-DIVE */}
        {activeTab === 'single' && (
          <div className="p-5 flex-1 overflow-y-auto space-y-5">
            {/* Campaign Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-cyan-400" />
                Chọn chiến dịch cần mổ xẻ chi tiết:
              </label>
              <select
                value={selectedCampaign?.name || ''}
                onChange={(e) => {
                  const camp = campaigns.find((c) => c.name === e.target.value) || null;
                  setSelectedCampaign(camp);
                  setSingleAnalysis('');
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white focus:border-cyan-500 outline-none"
              >
                {campaigns.map((c) => (
                  <option key={c.name} value={c.name}>
                    [{c.status}] {c.name} — Chi phí: {c.spent} — {c.leads} leads (CPA: {c.cpa})
                  </option>
                ))}
              </select>
            </div>

            {/* Campaign Summary Card */}
            {selectedCampaign && (
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">{selectedCampaign.type}</span>
                    <h4 className="text-sm sm:text-base font-black text-white">{selectedCampaign.name}</h4>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      selectedCampaign.status === 'Đang chạy'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {selectedCampaign.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-slate-800/80 text-xs">
                  <div>
                    <span className="text-slate-500">Chi phí:</span>
                    <p className="font-bold text-white">{selectedCampaign.spent}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Lượt nhấp:</span>
                    <p className="font-bold text-purple-300">{selectedCampaign.clicks.toLocaleString('vi-VN')} ({selectedCampaign.ctr})</p>
                  </div>
                  <div>
                    <span className="text-slate-500">CPC:</span>
                    <p className="font-bold text-slate-300">{selectedCampaign.cpc}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Chuyển đổi:</span>
                    <p className="font-bold text-emerald-400">{selectedCampaign.leads} leads</p>
                  </div>
                  <div>
                    <span className="text-slate-500">CPA:</span>
                    <p className="font-bold text-amber-300">{selectedCampaign.cpa}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => runSingleCampaignAnalysis(selectedCampaign)}
                    disabled={isAnalyzingSingle}
                    className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                  >
                    {isAnalyzingSingle ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Đang phân tích chiến dịch này...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Soi Điểm Nghẽn & Đề Xuất Tối Ưu Cho Chiến Dịch Này
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Single Analysis Content */}
            {singleError && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{singleError}</span>
              </div>
            )}

            {singleAnalysis && (
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none prose-headings:text-white prose-a:text-cyan-400 prose-strong:text-amber-300">
                <ReactMarkdown>{singleAnalysis}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: INTERACTIVE CHAT WITH AI */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Prompt Pills */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto">
              <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> Gợi ý câu hỏi:
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuestion(prompt)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Messages List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-cyan-600 text-white rounded-tr-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none prose prose-invert max-w-none prose-headings:text-white prose-strong:text-cyan-300'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    )}
                    <span className="block text-[10px] text-slate-400/80 mt-2 text-right">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                    AI đang suy nghĩ và tính toán dựa trên dữ liệu Google Ads...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2">
              <input
                type="text"
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuestion();
                }}
                placeholder="Hỏi bất kỳ điều gì về chiến dịch (ví dụ: Làm sao giảm CPA cho Trồng Răng Implant?)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-cyan-500 outline-none transition-colors"
              />
              <button
                onClick={() => handleSendQuestion()}
                disabled={!inputQuestion.trim() || isChatLoading}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </div>
          </div>
        )}

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Mô hình phân tích thông minh cho Nha Khoa Tâm Đức Smile</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
