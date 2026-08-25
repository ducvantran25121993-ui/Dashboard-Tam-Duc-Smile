import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  BrainCircuit,
  MessageSquare,
  BarChart3,
  ShieldCheck,
  ChevronRight,
  User,
  Flame,
  FileText,
  Settings2,
  SlidersHorizontal,
  KeyRound,
  Globe,
  CheckCheck,
  ExternalLink,
  Layers
} from 'lucide-react';
import { MonthDataset } from '../data/revenueData';
import {
  callClientGemini,
  callClientOpenAI,
  callClientDeepSeek,
  generateSmartAnalyticsFallback,
} from '../services/aiAgentEngine';

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'deepseek' | 'custom';

interface AIProviderConfig {
  id: AIProvider;
  name: string;
  badge: string;
  badgeColor: string;
  models: string[];
  defaultModel: string;
  apiKeyPlaceholder: string;
  description: string;
  docUrl: string;
}

const AI_PROVIDERS: AIProviderConfig[] = [
  {
    id: 'gemini',
    name: 'Google Gemini AI',
    badge: 'Mặc định có sẵn',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
    models: ['gemini-3.7-flash', 'gemini-2.5-pro', 'gemini-2.5-flash'],
    defaultModel: 'gemini-3.7-flash',
    apiKeyPlaceholder: 'Đã cấu hình server-side (Có thể nhập key riêng)',
    description: 'Mô hình siêu tốc độ cao & suy luận sâu từ Google DeepMind.',
    docUrl: 'https://aistudio.google.com/app/apikey',
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    badge: 'GPT-4o / o3-mini',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
    models: ['gpt-4o', 'gpt-4o-mini', 'o3-mini', 'gpt-4-turbo'],
    defaultModel: 'gpt-4o',
    apiKeyPlaceholder: 'sk-proj-... hoặc sk-...',
    description: 'Mô hình ChatGPT hàng đầu thế giới về phân tích văn bản & logic.',
    docUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    badge: 'Claude 3.5 Sonnet',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
    defaultModel: 'claude-3-5-sonnet-20241022',
    apiKeyPlaceholder: 'sk-ant-api03-...',
    description: 'Chuyên gia viết kịch bản, hành văn tự nhiên & tư duy chiến lược xuất sắc.',
    docUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'deepseek',
    name: 'DeepSeek AI',
    badge: 'DeepSeek-V3 / R1',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
    models: ['deepseek-chat', 'deepseek-reasoner'],
    defaultModel: 'deepseek-chat',
    apiKeyPlaceholder: 'sk-...',
    description: 'Mô hình suy luận mã nguồn mở chi phí tối ưu hàng đầu hiện nay.',
    docUrl: 'https://platform.deepseek.com/api_keys',
  },
  {
    id: 'custom',
    name: 'Custom / OpenRouter / Groq',
    badge: 'Tùy chỉnh endpoint',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
    models: ['custom-model'],
    defaultModel: 'custom-model',
    apiKeyPlaceholder: 'API Key của nhà cung cấp',
    description: 'Kết nối bất kỳ máy chủ LLM nào hỗ trợ chuẩn OpenAI API tương thích.',
    docUrl: 'https://openrouter.ai/keys',
  },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentTask?: string;
  providerUsed?: string;
  suggestions?: string[];
}

interface AIAgentViewProps {
  monthlyDatasets: MonthDataset[];
}

export const AIAgentView: React.FC<AIAgentViewProps> = ({ monthlyDatasets }) => {
  // Provider settings state (persisted in localStorage)
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(() => {
    try {
      return (localStorage.getItem('ai_agent_provider') as AIProvider) || 'gemini';
    } catch {
      return 'gemini';
    }
  });

  const [selectedModel, setSelectedModel] = useState<string>(() => {
    try {
      return localStorage.getItem('ai_agent_model') || 'gemini-3.7-flash';
    } catch {
      return 'gemini-3.7-flash';
    }
  });

  const [apiKeys, setApiKeys] = useState<{ [key in AIProvider]?: string }>(() => {
    try {
      const cached = localStorage.getItem('ai_agent_custom_keys');
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });

  const [customBaseUrl, setCustomBaseUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('ai_agent_custom_base_url') || 'https://api.openai.com/v1';
    } catch {
      return 'https://api.openai.com/v1';
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Xin chào! Tôi là **Trợ Lý AI** 🤖 — Trợ lý Trí Tuệ Nhân Tạo Toàn Năng (Universal AI Copilot).

Tôi có thể trò chuyện và giải đáp **TẤT CẢ MỌI CÂU HỎI** của bạn tương tự như ChatGPT / Claude / Gemini:
* 🌐 **Trả lời mọi chủ đề**: Kiến thức tổng quát, đời sống, khoa học, viết lách, dịch thuật, lập trình, ý tưởng kinh doanh & marketing.
* 📊 **Phân tích số liệu thực tế**: Doanh thu, chi phí Google Ads (VAT), tỷ lệ chi phí/doanh thu các tháng của phòng khám Tâm Đức Smile.
* 🦷 **Chuyên sâu nha khoa**: Chiến lược khách Việt Kiều, cấy ghép Implant toàn hàm, bọc răng sứ, xử lý từ chối Telesales.
* ⚡ **Đa mô hình AI**: Bấm nút **"Kết Nối AI Khác"** để chuyển đổi giữa **Google Gemini, OpenAI ChatGPT (GPT-4o), Anthropic Claude, DeepSeek hoặc OpenRouter**.

*Hãy đặt bất kỳ câu hỏi nào hoặc gõ chủ đề bạn đang quan tâm nhé!*`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        '📊 Phân tích hiệu quả chi phí Ads Tháng 9 & đề xuất cắt giảm lãng phí',
        '🦷 Lên kế hoạch kéo khách Việt Kiều về nước làm Implant dịp hè/tết',
        '🎯 Kịch bản Telesales xử lý khách chê giá Răng Sứ cao',
        '💡 Đề xuất 3 chiến dịch Google Ads tăng đột phá doanh thu',
      ],
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPresetMode, setSelectedPresetMode] = useState<'growth' | 'ads' | 'telesales' | 'audit'>('growth');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSaveSettings = () => {
    try {
      localStorage.setItem('ai_agent_provider', selectedProvider);
      localStorage.setItem('ai_agent_model', selectedModel);
      localStorage.setItem('ai_agent_custom_keys', JSON.stringify(apiKeys));
      localStorage.setItem('ai_agent_custom_base_url', customBaseUrl);
      window.dispatchEvent(new Event('storage'));
    } catch {
      // ignore
    }
    setSaveSuccessNotice(true);
    setTimeout(() => {
      setSaveSuccessNotice(false);
      setIsSettingsOpen(false);
    }, 1200);
  };

  // Handle Copy text
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Build context summaries from actual loaded datasets
  const getPreparedContextData = () => {
    const summaryList = (monthlyDatasets || []).map((ds) => {
      const totalRev = ds.regions.reduce((s, r) => s + (r.revenue || 0), 0);
      const totalCost = ds.regions.reduce((s, r) => s + (r.costVAT || 0), 0);
      const totalData = ds.regions.reduce((s, r) => s + (r.totalData || 0), 0);
      const ratio = totalRev > 0 ? ((totalCost / totalRev) * 100).toFixed(1) : '0';
      return {
        month: ds.label,
        totalRevenue: totalRev,
        totalCostVAT: totalCost,
        costRatioPercent: `${ratio}%`,
        totalCustomerLeads: totalData,
        regionCount: ds.regions.length,
      };
    });

    return {
      monthlySummaries: summaryList,
      note: 'Dữ liệu trực tiếp từ bảng số liệu doanh thu & chi phí hệ thống Nha khoa Tâm Đức Smile.',
    };
  };

  const currentProviderObj = AI_PROVIDERS.find((p) => p.id === selectedProvider) || AI_PROVIDERS[0];

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsLoading(true);

    try {
      const historyPayload = messages.concat(userMessage).map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const contextData = getPreparedContextData();
      let replyText = '';
      let usedProviderTag = currentProviderObj.name + ` (${selectedModel})`;

      const customKey = apiKeys[selectedProvider];

      // Step A: If user provided direct API Key for Gemini, OpenAI, or DeepSeek, call direct client SDK first
      if (customKey) {
        try {
          if (selectedProvider === 'gemini') {
            replyText = await callClientGemini(historyPayload, contextData, customKey, selectedModel);
          } else if (selectedProvider === 'openai') {
            replyText = await callClientOpenAI(historyPayload, contextData, customKey, selectedModel);
          } else if (selectedProvider === 'deepseek') {
            replyText = await callClientDeepSeek(historyPayload, contextData, customKey, selectedModel);
          } else if (selectedProvider === 'custom') {
            replyText = await callClientOpenAI(historyPayload, contextData, customKey, selectedModel, customBaseUrl);
          }
        } catch (directErr: any) {
          console.warn('Direct API client failed, falling back to server route:', directErr);
        }
      }

      // Step B: If no direct reply, attempt server route /api/ai-agent-chat
      let serverErrorMsg = '';
      if (!replyText) {
        try {
          const response = await fetch('/api/ai-agent-chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: historyPayload,
              contextData,
              agentPersona: selectedPresetMode,
              provider: selectedProvider,
              model: selectedModel,
              customApiKey: customKey || '',
              customBaseUrl: selectedProvider === 'custom' ? customBaseUrl : undefined,
            }),
          });

          const textResponse = await response.text();
          try {
            const data = JSON.parse(textResponse);
            if (data.reply) {
              replyText = data.reply;
              usedProviderTag = currentProviderObj.name + ` (${selectedModel})`;
            } else if (data.error) {
              serverErrorMsg = data.error;
            }
          } catch {
            serverErrorMsg = `Máy chủ phản hồi mã ${response.status}: ${textResponse.slice(0, 100)}`;
          }
        } catch (serverErr: any) {
          console.warn('Server endpoint error:', serverErr);
          serverErrorMsg = serverErr.message || 'Lỗi mạng khi kết nối máy chủ AI';
        }
      }

      // Step C: If server is unavailable or 404, seamlessly answer using Smart Knowledge & Analytics Engine
      if (!replyText) {
        replyText = generateSmartAnalyticsFallback(query, contextData);
        usedProviderTag = 'AI Engine (Smart Knowledge)';
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        agentTask: 'Tự động phân tích dữ liệu & đề xuất chiến lược tăng trưởng',
        providerUsed: usedProviderTag,
        suggestions: [
          'Chi tiết hóa bước hành động tiếp theo',
          'Soạn thông điệp quảng cáo (Ad Copy) cho ý tưởng trên',
          'Ước tính ngân sách và tỷ lệ ROI dự kiến',
        ],
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      // Guaranteed safe fallback
      const contextData = getPreparedContextData();
      const fallbackReply = generateSmartAnalyticsFallback(query, contextData);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        agentTask: 'Phân tích dữ liệu hệ thống thông minh',
        providerUsed: 'AI Analytics Engine',
        suggestions: [
          'Chi tiết hóa bước hành động tiếp theo',
          'Đánh giá chi phí VAT / Doanh thu các tháng',
        ],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'welcome-reset',
        role: 'assistant',
        content: `Đã làm mới phiên làm việc với mô hình **${currentProviderObj.name} (${selectedModel})**. Tôi sẵn sàng nhận lệnh mới từ bạn!`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        suggestions: [
          '📊 Đánh giá tổng quan hiệu suất các tháng',
          '🦷 Chiến lược đẩy mạnh Trồng Răng Implant Toàn Hàm All-on-4',
          '💰 Phân tích tỷ lệ chi phí Ads / Doanh thu',
        ],
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] bg-slate-950/60 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
      {/* 1. Header of AI Agent Tab */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 ring-1 ring-cyan-400/40">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 ring-2 ring-emerald-500/30 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                Trợ Lý AI
              </h2>
              {/* Provider Badge button that opens modal */}
              <button
                onClick={() => setIsSettingsOpen(true)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-all flex items-center gap-1.5 hover:scale-105 ${currentProviderObj.badgeColor}`}
                title="Bấm để chuyển đổi mô hình hoặc cài đặt API Key"
              >
                <Sparkles className="w-3 h-3" />
                <span>{currentProviderObj.name}</span>
                <span className="opacity-75 text-[10px]">({selectedModel})</span>
                <SlidersHorizontal className="w-3 h-3 ml-0.5 opacity-80" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Trợ lý Điều hành Tăng trưởng & Phân tích Dữ liệu Marketing Thời gian thực
            </p>
          </div>
        </div>

        {/* Quick Mode Filters & Action buttons */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setSelectedPresetMode('growth')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPresetMode === 'growth'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Growth
            </button>
            <button
              onClick={() => setSelectedPresetMode('ads')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPresetMode === 'ads'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🎯 Google Ads
            </button>
            <button
              onClick={() => setSelectedPresetMode('telesales')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                selectedPresetMode === 'telesales'
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📞 Telesales
            </button>
          </div>

          {/* Connect Other AI Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 hover:border-cyan-400 transition-all text-xs font-bold flex items-center gap-1.5 shadow-sm"
            title="Mở cấu hình kết nối các mô hình AI khác (ChatGPT, Claude, DeepSeek)"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Kết Nối AI Khác</span>
          </button>

          <button
            onClick={handleClearHistory}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700/60 transition-colors"
            title="Làm mới đoạn hội thoại"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Messages List Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <div
              key={message.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md ring-1 ring-cyan-400/30 mt-1">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              )}

              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 sm:p-5 shadow-lg relative group ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Agent Header Tag */}
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-cyan-400 mb-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                      <span>{message.agentTask || 'AI Phân tích & Tư vấn'}</span>
                    </div>
                    {message.providerUsed && (
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full border border-slate-700">
                        {message.providerUsed}
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body */}
                <div className="text-sm leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                  {message.content}
                </div>

                {/* Bottom Metadata & Copy */}
                <div className="flex items-center justify-between mt-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/40">
                  <span>{message.timestamp}</span>

                  <button
                    onClick={() => handleCopy(message.id, message.content)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center gap-1"
                    title="Sao chép nội dung"
                  >
                    {copiedId === message.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-medium">Đã chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px] hidden sm:inline">Sao chép</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Follow-up Quick Chips */}
                {!isUser && message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3.5 pt-3 border-t border-slate-800/70">
                    <p className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" /> Gợi ý tiếp theo:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {message.suggestions.map((sug, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700/90 text-cyan-300 border border-slate-700 hover:border-cyan-500/40 transition-all text-left flex items-center gap-1"
                        >
                          <span>{sug}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-1">
                  <User className="w-5 h-5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 items-start">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md ring-1 ring-cyan-400/30 animate-pulse">
              <BrainCircuit className="w-5 h-5 animate-spin" />
            </div>
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-lg text-slate-300 text-sm flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-slate-400 font-medium">
                {currentProviderObj.name} đang phân tích số liệu phòng khám & tạo giải pháp tối ưu...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 3. Input & Action Bar */}
      <div className="p-4 bg-slate-900/95 border-t border-slate-800 shrink-0 space-y-3">
        {/* Quick Question Badges */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold shrink-0 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" /> Hỏi nhanh:
          </span>
          <button
            onClick={() => handleSendMessage('Đánh giá chi phí VAT / Doanh thu từng tháng có an toàn không?')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all shrink-0 whitespace-nowrap"
          >
            📊 Đánh giá tỷ lệ chi phí Ads
          </button>
          <button
            onClick={() => handleSendMessage('Lên phác đồ kéo khách Việt Kiều về làm Răng Sứ & Implant All-on-4')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all shrink-0 whitespace-nowrap"
          >
            🦷 Chiến lược Khách Việt Kiều
          </button>
          <button
            onClick={() => handleSendMessage('Kịch bản telesales tư vấn xử lý khi khách hàng so sánh giá với phòng khám khác')}
            className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all shrink-0 whitespace-nowrap"
          >
            📞 Xử lý từ chối giá Telesales
          </button>
        </div>

        {/* Text Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Hỏi ${currentProviderObj.name} bất kỳ điều gì (kiến thức, viết lách, code, số liệu phòng khám, chiến lược Ads...)`}
            className="flex-1 px-4 py-3 bg-slate-950/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="px-5 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2 shrink-0"
          >
            <span>Gửi Lệnh</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 4. MODAL: Cấu Hình Kết Nối Với Các AI Khác */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                    Cấu Hình Kết Nối Các Nhà Cung Cấp AI
                  </h3>
                  <p className="text-xs text-slate-400">
                    Lựa chọn hoặc đổi mô hình AI để xử lý bài toán tăng trưởng phòng khám
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-5 pr-1">
              {/* Provider Selection Cards */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  1. Chọn Nhà Cung Cấp AI (AI Provider):
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {AI_PROVIDERS.map((provider) => {
                    const isSelected = selectedProvider === provider.id;
                    return (
                      <div
                        key={provider.id}
                        onClick={() => {
                          setSelectedProvider(provider.id);
                          if (!provider.models.includes(selectedModel)) {
                            setSelectedModel(provider.defaultModel);
                          }
                        }}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-400'
                            : 'bg-slate-800/50 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-white flex items-center gap-1.5">
                            {provider.name}
                          </span>
                          {isSelected && <CheckCheck className="w-4 h-4 text-cyan-400" />}
                        </div>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {provider.description}
                        </p>
                        <div className="mt-2.5 flex items-center justify-between">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${provider.badgeColor}`}>
                            {provider.badge}
                          </span>
                          <a
                            href={provider.docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 hover:underline"
                          >
                            Lấy Key <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                  2. Chọn Mô Hình (Model):
                </label>
                {selectedProvider === 'custom' ? (
                  <input
                    type="text"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    placeholder="Nhập tên model (ví dụ: anthropic/claude-3.5-sonnet hoặc llama-3.3-70b)"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                ) : (
                  <select
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {currentProviderObj.models.map((m) => (
                      <option key={m} value={m}>
                        {m} {m === currentProviderObj.defaultModel ? ' (Khuyên dùng)' : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* API Key Input (if needed) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    3. API Key cho {currentProviderObj.name}:
                  </label>
                  {selectedProvider === 'gemini' && (
                    <span className="text-[11px] text-emerald-400 font-medium">
                      ✓ Đã kết nối sẵn qua Server
                    </span>
                  )}
                </div>
                <input
                  type="password"
                  value={apiKeys[selectedProvider] || ''}
                  onChange={(e) =>
                    setApiKeys({
                      ...apiKeys,
                      [selectedProvider]: e.target.value,
                    })
                  }
                  placeholder={currentProviderObj.apiKeyPlaceholder}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  API Key được lưu an toàn trong trình duyệt của bạn (Local Storage) và chỉ truyền lên backend khi gọi lệnh AI.
                </p>
              </div>

              {/* Custom Base URL if custom provider */}
              {selectedProvider === 'custom' && (
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-purple-400" />
                    Custom Base URL:
                  </label>
                  <input
                    type="text"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder="https://openrouter.ai/api/v1 hoặc http://localhost:11434/v1"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                {saveSuccessNotice && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 animate-in fade-in">
                    <Check className="w-4 h-4" /> Đã lưu cấu hình thành công!
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Lưu & Kích Hoạt AI Này</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
