import React from 'react';
import { Video as VideoIcon } from 'lucide-react';
import { TransparencyAdItem } from '../data/transparencyTypes';

interface TransparencyAdVisualProps {
  ad: TransparencyAdItem;
}

export const TransparencyAdVisual: React.FC<TransparencyAdVisualProps> = ({ ad }) => {
  const isVideo = ad.format === 'video';
  const isText = ad.format === 'text';
  const photoType = ad.visual?.photoType;

  // Search Text Ad in Google Ads Transparency Center format
  if (isText && ad.searchAd) {
    return (
      <div className="w-full h-full bg-white p-3 flex flex-col justify-between text-left overflow-hidden select-none">
        <div className="space-y-1">
          {/* Sponsored label */}
          <div className="text-[9px] text-slate-500 font-medium">
            Được tài trợ
          </div>

          {/* Domain row with Favicon */}
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded-full bg-blue-600 text-white text-[8px] flex items-center justify-center font-bold shrink-0">
              {ad.domain.charAt(0).toUpperCase()}
            </div>
            <div className="leading-none min-w-0">
              <div className="text-[11px] font-medium text-slate-900 leading-none truncate">
                {ad.searchAd.displayDomain}
              </div>
              <div className="text-[9px] text-slate-500 leading-none mt-0.5 truncate">
                {ad.searchAd.path}
              </div>
            </div>
          </div>

          {/* Headline in Google Blue */}
          <h4 className="text-[12px] font-medium text-[#1a0dab] leading-snug hover:underline line-clamp-2 pt-0.5">
            {ad.searchAd.headline}
          </h4>

          {/* Snippet Description */}
          <p className="text-[10px] text-[#4d5156] line-clamp-2 leading-tight">
            {ad.searchAd.description}
          </p>
        </div>

        {/* Sitelinks in Google Blue */}
        <div className="space-y-0.5 pt-1 border-t border-slate-100 text-[10px] text-[#1a0dab]">
          {ad.searchAd.sitelinks.slice(0, 3).map((stk, sIdx) => (
            <div key={sIdx} className="hover:underline truncate">
              {stk}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render authentic Google Ads Transparency Thumbnails tailored to the exact screenshot
  if (isVideo) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-[#0a1e3f] select-none flex flex-col justify-between">
        {/* Google Ads Transparency authentic top-right camera icon */}
        <div className="absolute top-2 right-2 z-30 w-6 h-6 rounded bg-black/70 backdrop-blur-xs flex items-center justify-center text-white shadow-sm border border-white/10">
          <VideoIcon className="w-3.5 h-3.5 fill-white text-white" />
        </div>

        {/* THUMBNAIL 1: QUY TRÌNH TRỒNG IMPLANT CHỈ 2 LẦN HẸN - MÁNG ĐỊNH VỊ */}
        {photoType === 'doctor_guide' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#0d2a58] via-[#103a7a] to-[#0a234b]">
            {/* Left Doctor Illustration/Portrait */}
            <div className="relative z-10 w-[38%] h-full flex items-end justify-center">
              <div className="relative w-full h-[95%] rounded-full overflow-hidden border-2 border-white/20 shadow-lg bg-blue-900/50">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
                  alt="Bác sĩ Implant"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Flowchart & Big Yellow Headline */}
            <div className="relative z-10 w-[60%] flex flex-col justify-center space-y-1.5 pl-1">
              {/* 2 Step Badges */}
              <div className="flex items-center gap-1.5">
                <div className="flex-1 bg-[#09254d]/90 border border-cyan-400/40 rounded-md p-1 text-center shadow-xs">
                  <div className="inline-block px-1 py-0.2 rounded bg-cyan-600 text-white text-[7px] font-black uppercase">
                    LẦN HẸN 1
                  </div>
                  <div className="text-[7px] font-bold text-cyan-200 mt-0.5 leading-tight">
                    CHỤP CT • QUÉT RĂNG 3D
                  </div>
                </div>
                <div className="flex-1 bg-[#09254d]/90 border border-cyan-400/40 rounded-md p-1 text-center shadow-xs">
                  <div className="inline-block px-1 py-0.2 rounded bg-blue-600 text-white text-[7px] font-black uppercase">
                    LẦN HẸN 2
                  </div>
                  <div className="text-[7px] font-bold text-cyan-200 mt-0.5 leading-tight">
                    CẮM TRỤ & PHỤC HÌNH
                  </div>
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-0.5">
                <div className="text-[9px] font-black text-cyan-300 uppercase tracking-tight">
                  QUY TRÌNH TRỒNG IMPLANT
                </div>
                <div className="text-[14px] sm:text-[15px] font-black text-amber-300 uppercase leading-none tracking-tight drop-shadow-md">
                  CHỈ 2 LẦN HẸN
                </div>
                <div className="inline-block px-1.5 py-0.5 rounded bg-blue-700/80 text-white text-[8px] font-black uppercase tracking-wider">
                  MÁNG ĐỊNH VỊ 3D
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 2: INVISALIGN - ĐỪNG CHỈ NHẬN KHAY HÃY NHẬN KẾT QUẢ */}
        {photoType === 'aligner_girl' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#062c5a] via-[#094182] to-[#041e3d]">
            {/* Left Model Holding Aligner */}
            <div className="relative z-10 w-[42%] h-full flex items-end justify-center">
              <div className="relative w-full h-[95%] rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400&auto=format&fit=crop&q=80"
                  alt="Niềng răng Invisalign"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Invisalign Content & Before-After comparison */}
            <div className="relative z-10 w-[56%] flex flex-col justify-center space-y-1.5">
              <div className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-black text-[8px] tracking-wider uppercase">
                  INVISALIGN
                </span>
                <span className="text-[9px] text-white font-bold tracking-tight">
                  NHA KHOA KIM
                </span>
              </div>

              <div>
                <div className="text-[11px] font-black text-white leading-tight uppercase">
                  ĐỪNG CHỈ NHẬN KHAY
                </div>
                <div className="text-[12px] font-black text-amber-300 leading-tight uppercase drop-shadow">
                  HÃY NHẬN KẾT QUẢ
                </div>
              </div>

              {/* Before / After Mini Photo Box */}
              <div className="flex items-center gap-1 bg-black/50 border border-white/20 rounded-md p-1">
                <div className="flex-1 text-center">
                  <div className="text-[7px] text-rose-300 font-bold">TRƯỚC</div>
                  <div className="text-[7px] text-slate-300">Răng Khấp Khểnh</div>
                </div>
                <div className="text-white text-[8px]">▶</div>
                <div className="flex-1 text-center">
                  <div className="text-[7px] text-emerald-300 font-bold">SAU</div>
                  <div className="text-[7px] text-emerald-200">Đều Đẹp Chuẩn</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 3: TỪ MỸ TRỞ VỀ TRỒNG RĂNG TOÀN HÀM - 2 NGÀY CÓ HÀM TẠM */}
        {photoType === 'viet_kieu_smile' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#0a2f64] via-[#0d448f] to-[#082247]">
            {/* Left Content */}
            <div className="relative z-10 w-[58%] flex flex-col justify-center space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-red-600 border border-white flex items-center justify-center text-[10px]">
                  🇺🇸
                </div>
                <span className="text-[10px] font-black text-white uppercase tracking-tight">
                  TỪ MỸ TRỞ VỀ
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="text-[13px] font-black text-amber-300 uppercase leading-none tracking-tight drop-shadow">
                  TRỒNG RĂNG TOÀN HÀM
                </div>
                <div className="inline-block px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-tight">
                  2 NGÀY CÓ HÀM TẠM
                </div>
              </div>

              <div className="text-[8px] font-medium text-slate-200 pt-0.5">
                ★ Khách hàng Việt kiều Mỹ tin chọn
              </div>
            </div>

            {/* Right Smiling Woman */}
            <div className="relative z-10 w-[40%] h-full flex items-end justify-center">
              <div className="relative w-full h-[95%] rounded-full overflow-hidden border-2 border-amber-400/40 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
                  alt="Việt kiều Mỹ trồng răng"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 4: BIG4 KIỂM CHỨNG QUẢN TRỊ NHA KHOA KIM */}
        {photoType === 'big4_trust' && (
          <div className="w-full h-full relative flex flex-col justify-between p-3.5 bg-gradient-to-br from-[#061a38] via-[#092c5e] to-[#041228] text-center">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">
                NHA KHOA KIM
              </span>
            </div>

            <div className="space-y-1 my-auto">
              <div className="text-[14px] sm:text-[16px] font-black text-amber-300 uppercase tracking-tight leading-tight drop-shadow">
                BIG4 KIỂM CHỨNG
              </div>
              <div className="text-[10px] sm:text-[11px] font-black text-white uppercase tracking-wider">
                QUẢN TRỊ NHA KHOA KIM
              </div>

              {/* Big4 Logos */}
              <div className="flex items-center justify-center gap-2 pt-1">
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[8px]">Deloitte.</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[8px]">KPMG</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[8px]">EY</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold text-[8px]">pwc</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-[8px] font-semibold text-amber-200/90">
              <span>🏆</span>
              <span>Minh Bạch Tài Chính & Tiêu Chuẩn Vận Hành</span>
            </div>
          </div>
        )}

        {/* THUMBNAIL 5: NHA KHOA KIM & HARVARD NÂNG CHUẨN ĐIỀU TRỊ */}
        {photoType === 'harvard_group' && (
          <div className="w-full h-full relative flex flex-col justify-between p-3 bg-gradient-to-br from-[#1e070e] via-[#3d0f1c] to-[#0f0407] text-center">
            {/* Top Harvard Bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span className="w-4 h-4 rounded bg-rose-900 border border-rose-400/50 flex items-center justify-center text-[8px] font-bold text-white">
                  H
                </span>
                <span className="text-[9px] font-black text-rose-200 tracking-tight">
                  HARVARD BUSINESS SCHOOL
                </span>
              </div>
            </div>

            {/* Middle Harvard Headline */}
            <div className="space-y-0.5 my-auto">
              <div className="text-[10px] font-bold text-slate-300 uppercase">
                NHA KHOA KIM & HARVARD
              </div>
              <div className="text-[14px] sm:text-[15px] font-black text-amber-300 uppercase leading-tight drop-shadow">
                NÂNG CHUẨN ĐIỀU TRỊ
              </div>
            </div>

            {/* Doctors & Professors Group photo overlay */}
            <div className="relative w-full h-[40%] rounded-md overflow-hidden border border-white/20 shadow">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&auto=format&fit=crop&q=80"
                alt="Nghiên cứu Harvard"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center pb-0.5">
                <span className="text-[8px] text-white font-semibold">Case Study Quốc Tế</span>
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 6: TRỒNG IMPLANT CHỈ TRONG 1 NGÀY */}
        {photoType === 'surgery_room' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#09244c] via-[#0e3b78] to-[#071c3b]">
            <div className="relative z-10 w-[60%] flex flex-col justify-center space-y-1">
              <div className="text-[8px] font-bold text-cyan-300 uppercase">
                NHA KHOA KIM
              </div>
              <div className="text-[13px] font-black text-amber-300 uppercase leading-none tracking-tight drop-shadow">
                TRỒNG IMPLANT
              </div>
              <div className="text-[12px] font-black text-white uppercase leading-none tracking-tight">
                CHỈ TRONG 1 NGÀY
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-cyan-600 text-white text-[8px] font-bold uppercase mt-1">
                ĂN NHAI TỨC THÌ
              </div>
            </div>

            <div className="relative z-10 w-[38%] h-full flex items-center justify-center">
              <div className="w-full h-[90%] rounded-xl overflow-hidden border border-white/20 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&auto=format&fit=crop&q=80"
                  alt="Phòng phẫu thuật Implant"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 7: IMPLANT TOÀN HÀM ALL ON 4 & 6 */}
        {photoType === 'senior_couple' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#072247] via-[#0c3975] to-[#061b38]">
            <div className="relative z-10 w-[58%] flex flex-col justify-center space-y-1">
              <div className="text-[8px] font-bold text-amber-300 uppercase">
                CHUYÊN GIA IMPLANT
              </div>
              <div className="text-[12px] font-black text-white uppercase leading-tight">
                IMPLANT TOÀN HÀM
              </div>
              <div className="text-[11px] font-black text-amber-300 uppercase leading-tight">
                ALL ON 4 • ALL ON 6
              </div>
              <div className="text-[8px] text-slate-200 pt-0.5">
                Khôi phục 100% sức nhai
              </div>
            </div>

            <div className="relative z-10 w-[40%] h-full flex items-center justify-center">
              <div className="w-full h-[90%] rounded-full overflow-hidden border-2 border-amber-400/40 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400&auto=format&fit=crop&q=80"
                  alt="Implant toàn hàm"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 8: TRỒNG IMPLANT CHỈ TRONG 1 GIỜ NGHỈ TRƯA */}
        {photoType === 'implant_lunch_hour' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#0b2956] via-[#0f3d7c] to-[#082046]">
            {/* Left Doctor in white coat with glasses */}
            <div className="relative z-10 w-[38%] h-full flex items-end justify-center">
              <div className="relative w-full h-[95%] rounded-full overflow-hidden border-2 border-cyan-400/30 shadow-lg bg-blue-950/60">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80"
                  alt="Bác sĩ Implant"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Right Clock & Headline */}
            <div className="relative z-10 w-[60%] flex flex-col justify-center space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black text-cyan-300 tracking-tight">
                  NHA KHOA KIM
                </span>
              </div>

              <div>
                <div className="text-[10px] font-black text-white uppercase leading-tight">
                  TRỒNG IMPLANT CHỈ TRONG
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[17px] sm:text-[19px] font-black text-amber-300 uppercase leading-none tracking-tight drop-shadow">
                    1 GIỜ
                  </span>
                  <div className="w-6 h-6 rounded-full border border-amber-300/40 bg-amber-400/20 flex items-center justify-center text-[10px]">
                    ⏱️
                  </div>
                </div>
                <div className="text-[11px] font-black text-white uppercase tracking-tight leading-none mt-0.5">
                  NGHỈ TRƯA
                </div>
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 9: TỪ MỸ TRỞ VỀ TRỒNG RĂNG TOÀN HÀM (VAR 2) */}
        {photoType === 'viet_kieu_smile_2' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#0a2f64] via-[#0d448f] to-[#082247]">
            {/* Left Content */}
            <div className="relative z-10 w-[58%] flex flex-col justify-center space-y-1">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-black text-cyan-300 uppercase">
                  NHA KHOA KIM
                </span>
              </div>

              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-red-600 border border-white flex items-center justify-center text-[9px]">
                  🇺🇸
                </div>
                <span className="text-[9px] font-black text-white uppercase tracking-tight">
                  TỪ MỸ TRỞ VỀ
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="text-[13px] font-black text-amber-300 uppercase leading-none tracking-tight drop-shadow">
                  TRỒNG RĂNG
                </div>
                <div className="text-[12px] font-black text-amber-300 uppercase leading-none tracking-tight">
                  TOÀN HÀM
                </div>
              </div>
            </div>

            {/* Right Smiling Woman */}
            <div className="relative z-10 w-[40%] h-full flex items-end justify-center">
              <div className="relative w-full h-[95%] rounded-full overflow-hidden border-2 border-amber-400/40 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80"
                  alt="Việt kiều Mỹ trồng răng"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 10: MÔI TRƯỜNG LÀM VIỆC TẠI NHA KHOA KIM VŨNG TÀU */}
        {photoType === 'vung_tau_clinic' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#07244a] via-[#0b366e] to-[#061c3b]">
            <div className="relative z-10 w-[55%] flex flex-col justify-center space-y-1">
              <div className="text-[8px] font-black text-cyan-300 uppercase">
                NHA KHOA KIM
              </div>
              <div className="text-[11px] font-black text-white uppercase leading-tight">
                MÔI TRƯỜNG LÀM VIỆC
              </div>
              <div className="text-[9px] font-bold text-slate-200 leading-tight">
                TẠI NHA KHOA KIM
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider w-fit">
                VŨNG TÀU
              </div>
              <div className="text-[7px] text-cyan-200 pt-0.5">
                ★ Cơ sở vật chất chuẩn y khoa
              </div>
            </div>

            <div className="relative z-10 w-[42%] h-full flex items-center justify-center">
              <div className="w-full h-[90%] rounded-xl overflow-hidden border border-white/20 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&auto=format&fit=crop&q=80"
                  alt="Nha Khoa Kim Vũng Tàu"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* THUMBNAIL 11: IMPLANT TOÀN HÀM CHỈ 2 LẦN HẸN ĂN NHAI THOẢI MÁI */}
        {photoType === 'implant_senior_male' && (
          <div className="w-full h-full relative flex items-center justify-between p-3 bg-gradient-to-r from-[#092954] via-[#0d3f82] to-[#072044]">
            <div className="relative z-10 w-[58%] flex flex-col justify-center space-y-1">
              <div className="text-[8px] font-black text-cyan-300 uppercase">
                NHA KHOA KIM
              </div>
              <div className="text-[10px] font-black text-white uppercase leading-tight">
                IMPLANT TOÀN HÀM
              </div>
              <div className="text-[14px] font-black text-amber-300 uppercase leading-none tracking-tight drop-shadow">
                CHỈ 2 LẦN HẸN
              </div>
              <div className="inline-block px-1.5 py-0.5 rounded bg-blue-700 text-white font-bold text-[8px] uppercase tracking-tight w-fit">
                ĂN NHAI THOẢI MÁI
              </div>
            </div>

            <div className="relative z-10 w-[40%] h-full flex items-end justify-center">
              <div className="relative w-full h-[95%] rounded-full overflow-hidden border-2 border-amber-400/40 shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80"
                  alt="Chú lớn tuổi trồng răng"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        )}

        {/* FALLBACK DEFAULT VIDEO THUMBNAIL */}
        {!['doctor_guide', 'aligner_girl', 'viet_kieu_smile', 'big4_trust', 'harvard_group', 'surgery_room', 'senior_couple', 'implant_lunch_hour', 'viet_kieu_smile_2', 'vung_tau_clinic', 'implant_senior_male'].includes(photoType || '') && (
          <div className="w-full h-full relative flex flex-col justify-between p-3 bg-gradient-to-br from-[#0a234b] to-[#06152d]">
            <div className="text-[9px] font-black text-cyan-400 uppercase">
              {ad.visual?.brandLogoText || 'NHA KHOA KIM'}
            </div>
            <div className="my-auto">
              <div className="text-[13px] font-black text-amber-300 uppercase leading-tight">
                {ad.visual?.headlineMain || 'QUẢNG CÁO NHA KHOA'}
              </div>
              {ad.visual?.subHeadline && (
                <div className="text-[9px] text-slate-200 line-clamp-1 mt-0.5">
                  {ad.visual.subHeadline}
                </div>
              )}
            </div>
            <div className="text-[8px] text-slate-300">
              Google Video Ad
            </div>
          </div>
        )}
      </div>
    );
  }

  // GDN Banner image
  return (
    <div className="w-full h-full relative overflow-hidden bg-slate-900 flex flex-col justify-between">
      <img
        src={ad.visual?.imageUrl || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'}
        alt={ad.visual?.headlineMain || 'Quảng cáo hình ảnh'}
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/50 to-blue-950/60" />
      <div className="relative z-10 p-2 flex justify-between items-start">
        <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-white font-bold text-[9px]">
          {ad.visual?.brandLogoText || 'NHA KHOA KIM'}
        </span>
      </div>
      <div className="relative z-10 p-2.5 space-y-0.5 mt-auto">
        <h3 className="text-[12px] font-black text-amber-300 uppercase leading-tight">
          {ad.visual?.headlineMain}
        </h3>
        <p className="text-[9px] text-slate-200 line-clamp-1">
          {ad.visual?.subHeadline}
        </p>
      </div>
    </div>
  );
};
