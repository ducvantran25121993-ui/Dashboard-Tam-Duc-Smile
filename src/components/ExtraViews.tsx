import React from 'react';
import { Bot, MessageSquare, CheckSquare, Sparkles, Send, PhoneCall, CheckCircle2, Clock, ThumbsUp, AlertTriangle } from 'lucide-react';

export const SalesCopilotView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-purple-400" /> AI Assistant
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Sales Copilot — Trợ Lý Tư Vấn Nha Khoa</h2>
          <p className="text-slate-400 text-sm mt-1">Hỗ trợ gợi ý bảng giá, phát hiện mối quan tâm và đề xuất kịch bản chốt đơn tức thì.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Kịch Bản AI Gợi Ý Theo Dịch Vụ
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-cyan-300">Trồng Răng Implant Toàn Hàm</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Tỉ lệ chốt 82%</span>
              </div>
              <p className="text-xs text-slate-300">Gợi ý: Nhấn mạnh công nghệ định vị GPS không đau, bảo hành trọn đời và gói hỗ trợ chi phí đi lại cho khách tỉnh/Việt Kiều.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-amber-300">Bọc Răng Sứ Thẩm Mỹ</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Tỉ lệ chốt 78%</span>
              </div>
              <p className="text-xs text-slate-300">Gợi ý: Cho khách xem video mô phỏng cung cười DSD, cam kết bảo tồn răng thật tối đa và trả góp 0% lãi suất.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white">Thống Kê Hiệu Quả AI</h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-800/60 flex justify-between items-center">
              <span className="text-slate-400">Cuộc gọi được hỗ trợ:</span>
              <span className="font-bold text-white">1.450+ cuộc</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 flex justify-between items-center">
              <span className="text-slate-400">Thời gian chốt hẹn giảm:</span>
              <span className="font-bold text-emerald-400">-35% thời gian</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 flex justify-between items-center">
              <span className="text-slate-400">Điểm hài lòng khách hàng:</span>
              <span className="font-bold text-purple-300">4.9 / 5.0 ⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ConsultationView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-teal-950/60 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" /> Nhật Ký Hội Thoại
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Hội Thoại Tư Vấn Khách Hàng</h2>
          <p className="text-slate-400 text-sm mt-1">Giám sát chất lượng cuộc gọi tư vấn, tin nhắn Zalo/Fanpage từ các kênh Google Ads.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white">Lịch Sử Tương Tác Gần Nhất</h3>
        <div className="space-y-3">
          {[
            { name: 'Nguyễn Văn H.', service: 'Implant All-on-4', phone: '0908.xxx.123', status: 'Đã đặt lịch hẹn 14:00 Thứ 7', time: '5 phút trước' },
            { name: 'Trần Thị Mai', service: 'Bọc 16 Răng Sứ Emax', phone: '0912.xxx.456', status: 'Cần gửi thêm ảnh nụ cười qua Zalo', time: '18 phút trước' },
            { name: 'David Le (Việt Kiều Mỹ)', service: 'Trồng Răng + Tẩy Trắng', phone: '+1 714.xxx.789', status: 'Đã cọc giữ chỗ ngày 20/09', time: '42 phút trước' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="font-bold text-white text-sm">{item.name} — <span className="text-cyan-400">{item.service}</span></div>
                <div className="text-xs text-slate-400 mt-0.5">SĐT: {item.phone} • {item.status}</div>
              </div>
              <span className="text-[11px] text-slate-500 font-medium self-end sm:self-auto">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DecisionBoardView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-400" /> Bảng Quyết Định
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Decision Board — Quyết Định Chiến Lược</h2>
          <p className="text-slate-400 text-sm mt-1">Các quyết định điều chỉnh ngân sách, mở rộng chi nhánh và phân bổ kênh Marketing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> Đã Phê Duyệt Triển Khai
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
              <span className="font-bold text-white">Tăng 25% ngân sách Google Ads cho chiến dịch Implant TP.HCM</span>
              <p className="text-slate-400">Hiệu quả ROAS đạt 8.4x, đang dư địa tăng trưởng thêm 120 khách.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
              <span className="font-bold text-white">Đẩy mạnh gói chăm sóc răng Việt Kiều mùa cao điểm tháng 9 - 12</span>
              <p className="text-slate-400">Tặng kèm dịch vụ đưa đón sân bay và gói chụp phim CT Cone Beam miễn phí.</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Đang Thảo Luận & Xem Xét
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
              <span className="font-bold text-white">Mở rộng chi nhánh mới tại Cần Thơ & Rạch Giá</span>
              <p className="text-slate-400">Lượng data khách hàng khu vực miền Tây vượt 35% kỳ vọng ban đầu.</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-800/70 border border-slate-700/80 space-y-1">
              <span className="font-bold text-white">Triển khai thêm kênh Tiktok Ads dịch vụ Niềng Răng Học Sinh</span>
              <p className="text-slate-400">Thử nghiệm ngân sách 15tr/tháng để đánh giá chất lượng lead trẻ tuổi.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
