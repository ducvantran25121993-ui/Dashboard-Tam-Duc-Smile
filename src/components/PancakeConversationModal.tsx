import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Phone,
  ExternalLink,
  Copy,
  Check,
  MessageSquare,
  Calendar,
  Clock,
  User,
  RefreshCw,
  Tag as TagIcon,
  Building2,
  FileText,
  Send,
  AlertCircle,
  Image as ImageIcon,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { PancakeLead, PancakeTag, PancakeNote, getCleanPhone } from './PancakeCRMView';

interface PancakeConversationModalProps {
  lead: PancakeLead | null;
  onClose: () => void;
}

interface MessageItem {
  id: string;
  message: string;
  inserted_at?: string;
  created_at?: string;
  from?: {
    id?: string;
    name?: string;
    avatar_url?: string;
    phone_number?: string;
  };
  attachments?: Array<{
    id?: string;
    type?: string;
    url?: string;
    preview_url?: string;
    payload?: { url?: string };
  }>;
  type?: string;
}

export const PancakeConversationModal: React.FC<PancakeConversationModalProps> = ({ lead, onClose }) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [rawDetails, setRawDetails] = useState<any>(null);
  const [mobileTab, setMobileTab] = useState<'chat' | 'info'>('chat');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const fetchConversationMessages = async () => {
    if (!lead) return;
    setLoading(true);
    setError(null);

    try {
      const pageId = lead.pageId || 'all';
      const conversationId = encodeURIComponent(lead.id);
      const res = await fetch(`/api/pancake/conversations/${pageId}/${conversationId}/messages`);
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tải tin nhắn từ Pancake');
      }

      setMessages(Array.isArray(data.messages) ? data.messages : []);
      setRawDetails(data);
    } catch (err: any) {
      console.error('Error fetching conversation messages:', err);
      setError(err.message || 'Lỗi kết nối khi tải lịch sử tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lead) {
      fetchConversationMessages();
    } else {
      setMessages([]);
      setRawDetails(null);
      setError(null);
    }
  }, [lead?.id]);

  useEffect(() => {
    if (!loading && messages.length > 0) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!lead) return null;

  const phone = getCleanPhone(lead.phone);

  const handleCopyPhone = () => {
    if (!phone) return;
    navigator.clipboard.writeText(phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanMessageText = (htmlOrText: string): string => {
    if (!htmlOrText) return '';
    return htmlOrText
      .replace(/<br\s*[\/]?>/gi, '\n')
      .replace(/<\/p>/gi, '\n')
      .replace(/<\/div>/gi, '\n')
      .replace(/<[^>]+>/g, '')
      .trim();
  };

  const isCustomerMessage = (m: MessageItem): boolean => {
    if (!m.from) return false;
    const fromId = String(m.from.id || '').toLowerCase();
    const leadId = String(lead.id || '').toLowerCase();
    const pageId = String(lead.pageId || '').toLowerCase();

    if (pageId && (fromId === pageId || fromId.startsWith(pageId))) {
      return false;
    }
    if (leadId && (fromId === leadId || leadId.includes(fromId) || fromId.includes(leadId))) {
      return true;
    }
    if (m.from.name && lead.name && m.from.name.trim().toLowerCase() === lead.name.trim().toLowerCase()) {
      return true;
    }
    const fn = (m.from.name || '').toLowerCase();
    if (
      fn.includes('tâm đức') ||
      fn.includes('nha khoa') ||
      fn.includes('fanpage') ||
      fn.includes('hotline') ||
      fn.includes('hệ thống') ||
      fn.includes('page')
    ) {
      return false;
    }
    return true;
  };

  const formatMessageTime = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const cleanStr = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return '';
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatFullDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      const cleanStr = dateStr.endsWith('Z') || dateStr.includes('+') ? dateStr : `${dateStr}Z`;
      const d = new Date(cleanStr);
      if (isNaN(d.getTime())) return 'N/A';
      return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="px-4 py-3.5 sm:px-6 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-3 flex-shrink-0">
          {/* Customer & Channel Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex-shrink-0">
              {lead.avatar ? (
                <img
                  src={lead.avatar}
                  alt={lead.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-teal-500/40"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-base border border-teal-500/30">
                  {lead.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900" title="Hoạt động" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-white text-base sm:text-lg truncate">
                  {lead.name || 'Khách hàng'}
                </h3>

                {/* Page Badge */}
                {lead.pageName && (
                  <span
                    className={`px-2 py-0.5 rounded-md text-xs font-bold border flex items-center gap-1 ${
                      lead.channelType === 'facebook'
                        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                        : 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                    }`}
                  >
                    <span>{lead.channelType === 'facebook' ? '📘' : '💬'}</span>
                    <span className="truncate max-w-[180px]">{lead.pageName}</span>
                  </span>
                )}

                {/* Branch */}
                {lead.branch && lead.branch !== 'Toàn Hệ Thống' && (
                  <span className="px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {lead.branch}
                  </span>
                )}
              </div>

              {/* Phone & ID row */}
              <div className="flex items-center gap-2.5 text-xs text-slate-400 mt-0.5">
                {phone ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyPhone}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 font-mono font-bold flex items-center gap-1 transition"
                      title="Bấm để copy SĐT"
                    >
                      <Phone className="w-3 h-3 text-emerald-400" />
                      <span>{phone}</span>
                      {copied ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-2.5 h-2.5 opacity-60" />}
                    </button>
                    <a
                      href={`tel:${phone}`}
                      className="text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-0.5"
                    >
                      Gọi ngay
                    </a>
                  </div>
                ) : (
                  <span className="italic text-slate-500">Chưa có số điện thoại</span>
                )}
                <span>•</span>
                <span className="text-[11px] font-mono text-slate-500 truncate max-w-[160px]" title={lead.id}>
                  ID: {lead.id}
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons on Header */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Refresh Messages */}
            <button
              onClick={fetchConversationMessages}
              disabled={loading}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition border border-slate-700 disabled:opacity-50"
              title="Tải lại tin nhắn mới nhất"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-teal-400' : ''}`} />
            </button>

            {/* Link to Pancake Web */}
            <a
              href={lead.pageId ? `https://pages.fm/${lead.pageId}` : 'https://pages.fm'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 text-xs font-semibold transition"
              title="Mở trực tiếp trên trang Pancake Web"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Mở Pancake Web</span>
            </a>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition border border-slate-700"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="flex sm:hidden border-b border-slate-800 bg-slate-900/90 text-xs font-bold">
          <button
            onClick={() => setMobileTab('chat')}
            className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'chat'
                ? 'border-teal-400 text-teal-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Tin Nhắn ({messages.length})
          </button>
          <button
            onClick={() => setMobileTab('info')}
            className={`flex-1 py-2.5 text-center border-b-2 transition flex items-center justify-center gap-1.5 ${
              mobileTab === 'info'
                ? 'border-teal-400 text-teal-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Hồ Sơ & Thẻ ({lead.tags.length})
          </button>
        </div>

        {/* Main Body (2 Columns Layout on Desktop) */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          {/* Left Column: Chat Conversation Stream (65% width) */}
          <div
            className={`flex-1 flex flex-col bg-slate-950/60 min-w-0 border-r border-slate-800/80 ${
              mobileTab === 'chat' ? 'flex' : 'hidden sm:flex'
            }`}
          >
            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {loading && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 py-16 space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-teal-400" />
                  <p className="text-sm">Đang tải toàn bộ cuộc trò chuyện từ Pancake...</p>
                </div>
              )}

              {error && (
                <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">{error}</p>
                    <p className="text-xs text-rose-400/80">
                      Vui lòng kiểm tra lại kết nối hoặc thử mở trên Pancake Web.
                    </p>
                    <button
                      onClick={fetchConversationMessages}
                      className="mt-2 px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 rounded-lg text-xs font-semibold transition"
                    >
                      Thử lại ngay
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-500 py-16 space-y-2">
                  <MessageSquare className="w-10 h-10 opacity-30" />
                  <p className="text-sm">Chưa có tin nhắn nào trong cuộc hội thoại này.</p>
                </div>
              )}

              {/* Chat Timeline */}
              {messages.map((m, idx) => {
                const isCustomer = isCustomerMessage(m);
                const text = cleanMessageText(m.message);
                const senderName = isCustomer
                  ? m.from?.name || lead.name || 'Khách hàng'
                  : m.from?.name || 'Tư vấn viên / Nha Khoa';
                const timeStr = formatMessageTime(m.inserted_at || m.created_at);

                return (
                  <div
                    key={m.id || idx}
                    className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                      isCustomer ? 'mr-auto items-start' : 'ml-auto flex-row-reverse items-start'
                    }`}
                  >
                    {/* Avatar */}
                    <div className="flex-shrink-0 mt-0.5">
                      {isCustomer ? (
                        m.from?.avatar_url || lead.avatar ? (
                          <img
                            src={m.from?.avatar_url || lead.avatar}
                            alt={senderName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center border border-slate-700">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                        )
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold flex items-center justify-center border border-teal-500/40">
                          <span>🦷</span>
                        </div>
                      )}
                    </div>

                    {/* Speech Bubble */}
                    <div
                      className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} space-y-1 min-w-0`}
                    >
                      {/* Sender label */}
                      <span className="text-[11px] text-slate-400 px-1 font-medium">
                        {senderName}
                      </span>

                      {/* Bubble content */}
                      <div
                        className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm break-words whitespace-pre-wrap ${
                          isCustomer
                            ? 'bg-slate-800 border border-slate-700/80 text-slate-100 rounded-tl-sm'
                            : 'bg-gradient-to-br from-teal-600 to-emerald-700 text-white rounded-tr-sm shadow-teal-950/20'
                        }`}
                      >
                        {text ? (
                          <p>{text}</p>
                        ) : (
                          <p className="italic text-xs opacity-75">(Hình ảnh / Đính kèm)</p>
                        )}

                        {/* Attachments */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {m.attachments.map((att, attIdx) => {
                              const attUrl = att.url || att.preview_url || att.payload?.url;
                              if (attUrl) {
                                return (
                                  <a
                                    key={att.id || attIdx}
                                    href={attUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block group relative overflow-hidden rounded-lg border border-white/20 max-w-xs"
                                  >
                                    <img
                                      src={attUrl}
                                      alt="Hình ảnh đính kèm"
                                      className="max-h-60 rounded-lg object-contain bg-black/40 group-hover:scale-105 transition duration-200"
                                      referrerPolicy="no-referrer"
                                    />
                                    <span className="absolute bottom-1 right-1 bg-slate-900/80 text-[10px] text-white px-1.5 py-0.5 rounded">
                                      Mở ảnh ↗
                                    </span>
                                  </a>
                                );
                              }
                              return (
                                <div key={attIdx} className="text-xs opacity-80 flex items-center gap-1">
                                  <ImageIcon className="w-3.5 h-3.5" />
                                  <span>Tệp đính kèm</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Time */}
                      {timeStr && (
                        <span className="text-[10px] text-slate-500 px-1 font-mono">{timeStr}</span>
                      )}
                    </div>
                  </div>
                );
              })}

              <div ref={chatBottomRef} />
            </div>

            {/* Bottom Status Bar */}
            <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="truncate">
                  Đang đồng bộ trực tiếp với Pancake • Tổng cộng {messages.length} tin nhắn
                </span>
              </div>

              <a
                href={lead.pageId ? `https://pages.fm/${lead.pageId}` : 'https://pages.fm'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1 flex-shrink-0 hover:underline"
              >
                Trả lời trên Pancake ↗
              </a>
            </div>
          </div>

          {/* Right Column: Customer Profile, Tags & Staff Notes (35% width) */}
          <div
            className={`w-full sm:w-80 md:w-96 bg-slate-900 overflow-y-auto p-4 sm:p-5 space-y-5 flex-shrink-0 ${
              mobileTab === 'info' ? 'block' : 'hidden sm:block'
            }`}
          >
            {/* Section 1: Thẻ Nhãn Pancake */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <TagIcon className="w-3.5 h-3.5 text-cyan-400" />
                  Thẻ Nhãn ({lead.tags.length})
                </h4>
              </div>

              {lead.tags.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.map((t) => (
                    <span
                      key={t.id}
                      style={{
                        backgroundColor: `${t.color}25`,
                        borderColor: t.color,
                        color: '#f8fafc',
                      }}
                      className="px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1 shadow-sm"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                      {t.text}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Chưa gắn thẻ nhãn nào.</p>
              )}
            </div>

            {/* Section 2: Ghi Chú Tư Vấn Viên (Staff Notes) */}
            <div className="space-y-2.5 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                Ghi Chú Tư Vấn ({lead.notes.length})
              </h4>

              {lead.notes.length > 0 ? (
                <div className="space-y-2">
                  {lead.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between text-[11px] text-amber-300/90 font-medium">
                        <span className="font-bold flex items-center gap-1">
                          👤 {note.author || 'Tư vấn viên'}
                        </span>
                        {note.time && (
                          <span className="text-slate-400 font-mono">
                            {new Date(note.time * 1000).toLocaleString('vi-VN', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {note.message}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">Chưa có ghi chú nội bộ.</p>
              )}
            </div>

            {/* Section 3: Chi Tiết Khách Hàng */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
                <User className="w-3.5 h-3.5 text-teal-400" />
                Chi Tiết Hội Thoại
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Khách hàng:</span>
                  <span className="font-bold text-white text-right">{lead.name}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Số điện thoại:</span>
                  <span className="font-mono font-bold text-emerald-400 text-right">
                    {phone || 'Chưa trích xuất'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Trang tiếp nhận:</span>
                  <span className="font-semibold text-slate-200 text-right truncate max-w-[170px]">
                    {lead.pageName || 'Pancake'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Chi nhánh:</span>
                  <span className="font-semibold text-cyan-300 text-right">{lead.branch}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Dịch vụ:</span>
                  <span className="font-semibold text-purple-300 text-right">{lead.service}</span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Trạng thái:</span>
                  <div className="flex gap-1 justify-end">
                    {lead.isWon && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        #ĐẬU
                      </span>
                    )}
                    {lead.isLost && (
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                        #RỚT
                      </span>
                    )}
                    {lead.isBooked && (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                        ĐÃ HẸN
                      </span>
                    )}
                    {!lead.isWon && !lead.isLost && !lead.isBooked && (
                      <span className="text-slate-400 italic">Đang tư vấn</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Bắt đầu:</span>
                  <span className="font-mono text-slate-300 text-right">
                    {formatFullDate(lead.insertedAt)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
                  <span className="text-slate-400">Cập nhật cuối:</span>
                  <span className="font-mono text-slate-300 text-right">
                    {formatFullDate(lead.updatedAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="pt-2">
              <a
                href={lead.pageId ? `https://pages.fm/${lead.pageId}` : 'https://pages.fm'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-950/40 transition"
              >
                <span>Mở trong Pancake (pages.fm)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
