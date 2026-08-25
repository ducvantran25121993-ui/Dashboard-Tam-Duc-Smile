import React from 'react';
import { Users2, Filter, ArrowDown, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { MonthDataset } from '../data/revenueData';

interface LeadsFunnelViewProps {
  monthlyDatasets: MonthDataset[];
}

export const LeadsFunnelView: React.FC<LeadsFunnelViewProps> = ({ monthlyDatasets }) => {
  const totalDataTho = monthlyDatasets.reduce((sum, m) => {
    return (
      sum +
      m.regions.reduce((rSum, r) => {
        const svcSum = r.services?.reduce((sSum, s) => sSum + (s.dataCount || 0), 0) || 0;
        return rSum + (svcSum > 0 ? svcSum : (r.totalData || 0));
      }, 0)
    );
  }, 0);

  const totalDataCL = monthlyDatasets.reduce((sum, m) => {
    return (
      sum +
      m.regions.reduce((rSum, r) => rSum + (r.dataChatLuong || 0), 0)
    );
  }, 0);

  const totalLeads = totalDataTho + totalDataCL;

  const funnelSteps = [
    {
      title: '1. Lượt xem quảng cáo (Impressions)',
      count: '1.850.000+',
      rate: '100%',
      color: 'from-blue-600 to-indigo-600',
      note: 'Tiếp cận khách hàng mục tiêu tại TP.HCM & Miền Tây',
    },
    {
      title: '2. Lượt truy cập Landing Page & Web (Clicks)',
      count: '92.500',
      rate: '5.0% CTR',
      color: 'from-cyan-600 to-blue-600',
      note: 'Traffic chất lượng từ tìm kiếm dịch vụ nha khoa',
    },
    {
      title: '3. Data / Lead để lại thông tin (Total Data)',
      count: totalLeads > 0 ? `${totalLeads.toLocaleString('vi-VN')} Leads` : '1.240 Leads',
      rate: '3.8% CVR',
      color: 'from-teal-600 to-cyan-600',
      note: 'Đăng ký nhận báo giá & đặt hẹn tư vấn',
    },
    {
      title: '4. Khách hàng đến thăm khám trực tiếp (Appointments)',
      count: '640 Khách',
      rate: '51.6% Tới phòng khám',
      color: 'from-emerald-600 to-teal-600',
      note: 'Telesales xác nhận lịch hẹn thành công',
    },
    {
      title: '5. Chốt dịch vụ & Điều trị (Deals Closed)',
      count: '495 Khách',
      rate: '77.3% Chốt đơn',
      color: 'from-emerald-500 to-green-600',
      note: 'Doanh thu trung bình cao từ Trồng Răng & Bọc Sứ',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1">
              <Users2 className="w-3.5 h-3.5 text-blue-400" /> Báo Cáo Phễu Khách Hàng
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white">Hành Trình Chuyển Đổi Lead & Sales</h2>
          <p className="text-slate-400 text-sm mt-1">
            Đo lường hiệu quả chuyển đổi từ lúc chi tiền quảng cáo đến khi khách hoàn tất dịch vụ.
          </p>
        </div>
      </div>

      {/* Funnel visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Filter className="w-4 h-4 text-cyan-400" />
            Các Tầng Phễu Marketing & Bán Hàng
          </h3>

          <div className="space-y-3 pt-2">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="p-4 rounded-xl bg-slate-800/70 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-cyan-500/40 transition-all">
                  <div className="space-y-1">
                    <span className="text-xs sm:text-sm font-bold text-white">{step.title}</span>
                    <p className="text-xs text-slate-400">{step.note}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto">
                    <span className="text-base sm:text-lg font-black text-cyan-300">{step.count}</span>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-900 border border-slate-700 text-emerald-400">
                      {step.rate}
                    </span>
                  </div>
                </div>

                {idx < funnelSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Funnel Insights */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white">Chỉ Số Phễu Cốt Lõi</h3>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-300">Tỷ lệ hẹn khám thành công:</span>
                <span className="text-sm font-bold text-emerald-400">51.6%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-300">Tỷ lệ chốt hợp đồng tại chỗ:</span>
                <span className="text-sm font-bold text-cyan-400">77.3%</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-300">Thời gian phản hồi lead trung bình:</span>
                <span className="text-sm font-bold text-amber-400">&lt; 3 Phút</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
