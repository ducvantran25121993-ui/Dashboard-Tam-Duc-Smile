import React, { useState, useEffect, useRef } from 'react';
import {
  Globe,
  Bell,
  RefreshCw,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Image as ImageIcon,
  FileText,
  Clock,
  Play,
  Pause,
  Sliders,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Sparkles,
  Zap,
  Tag,
  Eye,
  Copy,
  Check,
  Radio,
  Layers,
  ArrowRight,
  Edit3,
  Save,
  X,
  Gift,
  TrendingDown,
  Maximize2,
  ShieldCheck,
  Percent,
  DollarSign,
  RotateCcw,
  Cloud,
  Server,
  Laptop,
  CheckCheck
} from 'lucide-react';

export interface DetectedPromotion {
  service: string;
  oldPrice: string;
  newPrice: string;
  oldDiscount?: string;
  newDiscount?: string;
  diffPercent?: string;
  gifts?: string[];
  isNew?: boolean;
}

export interface MonitoredSnapshot {
  text: string;
  images: string[];
  promotions?: DetectedPromotion[];
  scannedAt: string;
}

export interface MonitoredLink {
  id: string;
  name: string;
  url: string;
  category: 'implant' | 'ortho' | 'cosmetic' | 'general' | 'all';
  scanFrequency: 'hourly' | 'daily' | 'weekly';
  status: 'Changed' | 'Unchanged' | 'Scanning' | 'Error';
  lastScanTime?: string;
  changeMessage?: string;
  lastData?: MonitoredSnapshot;
  previousData?: MonitoredSnapshot;
  newImagesCount?: number;
  textChanged?: boolean;
}

export interface ScanNotification {
  id: string;
  url: string;
  name: string;
  message: string;
  detectedAt: string;
  newImages?: string[];
  textSnippet?: string;
  read: boolean;
}

export const CompetitorBannerImage: React.FC<{
  src: string;
  alt: string;
  className?: string;
  badge?: string;
  isNew?: boolean;
  articleUrl?: string;
  onExpand?: (src: string) => void;
}> = ({ src, alt, className = 'w-full h-36 object-cover', badge, isNew, articleUrl, onExpand }) => {
  const [currentSrc, setCurrentSrc] = useState<string>(src);
  const [hasTriedProxy, setHasTriedProxy] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setCurrentSrc(src);
    setHasTriedProxy(false);
    setHasError(false);
    setLoading(true);
  }, [src]);

  const handleError = () => {
    if (!hasTriedProxy && currentSrc && !currentSrc.startsWith('/api/proxy-image')) {
      setHasTriedProxy(true);
      setCurrentSrc(`/api/proxy-image?url=${encodeURIComponent(currentSrc)}`);
    } else {
      setHasError(true);
      setLoading(false);
    }
  };

  if (hasError) {
    return (
      <div className="w-full h-36 rounded-lg bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-950 border border-slate-700/80 p-3 flex flex-col justify-between relative overflow-hidden group/card">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-500/10 blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between gap-2 z-10">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black border shadow ${
            isNew 
              ? 'bg-emerald-600/90 text-white border-emerald-400' 
              : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
          }`}>
            {badge || (isNew ? '✨ Banner Mới' : '🔴 Banner Cũ')}
          </span>
          <span className="text-[10px] text-cyan-400 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Live Web Snapshot
          </span>
        </div>

        <div className="z-10 my-auto py-1">
          <p className="text-xs font-bold text-white line-clamp-2 leading-snug">
            {alt || 'Banner Chiến Dịch Khuyến Mãi Đối Thủ'}
          </p>
          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-mono">
            {articleUrl || src}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80 z-10 text-[11px]">
          {onExpand && (
            <button
              type="button"
              onClick={() => onExpand(currentSrc)}
              className="px-2.5 py-1 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Xem Chi Tiết</span>
            </button>
          )}
          {articleUrl && (
            <a
              href={articleUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-cyan-300 hover:underline font-bold flex items-center gap-0.5 ml-auto"
            >
              <span>Mở bài viết chứa banner</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-slate-900 group/img">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Đang tải banner...</span>
          </div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        className={`${className} transition-transform duration-300 group-hover/img:scale-105`}
        referrerPolicy="no-referrer"
        onLoad={() => setLoading(false)}
        onError={handleError}
      />
      {badge && (
        <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-black border shadow z-10 ${
          isNew 
            ? 'bg-emerald-600 text-white border-emerald-400' 
            : 'bg-rose-950/90 text-rose-300 border-rose-500/40'
        }`}>
          {badge}
        </span>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity p-2 flex flex-col justify-end z-20">
        <div className="flex items-center justify-between">
          {onExpand && (
            <button
              type="button"
              onClick={() => onExpand(currentSrc)}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer shadow ${
                isNew ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-slate-900/90 hover:bg-slate-800 text-rose-300 border border-rose-500/50'
              }`}
            >
              <Maximize2 className="w-3 h-3" />
              <span>Phóng To Xem</span>
            </button>
          )}
          <a
            href={currentSrc}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-cyan-300 hover:underline truncate font-mono flex items-center gap-1 bg-slate-950/80 px-2 py-1 rounded-lg border border-slate-700"
          >
            <span>Link File Ảnh</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

const TOP_20_DENTAL_PRESET_LINKS: MonitoredLink[] = [
  {
    id: 'link-1',
    name: 'Nha Khoa Trồng Răng Sài Gòn (Saigon Implant Dental)',
    url: 'https://implantsaigon.com/trong-rang-sai-gon/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét (Live Scraped)',
    changeMessage: '🖼️ Đã bóc tách 65 hình ảnh & nội dung thực tế từ website implantsaigon.com!',
    newImagesCount: 8,
    textChanged: true,
    lastData: {
      text: 'Trồng Răng Sài Gòn | Saigon Implant Dental – The Best Dental Clinic in Ho Chi Minh City. Khám và điều trị chuyên sâu các tình trạng: Mất 1 răng, Mất 2 răng, Mất từ 3 răng trở lên, Mất răng nguyên hàm All-on-4 / All-on-6. Đội ngũ Bác sĩ Cang Hồng Thái hơn 21 năm kinh nghiệm. Công nghệ chụp phim CT ConeBeam 3D, bảo tồn răng gốc tối đa và chính sách bảo hành chính hãng.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nhu-the-nao.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-1-rang.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-3-rang-tro-len.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/img-mat-2-rang-2-1.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-rang-nguyen-ham.png',
        'https://implantsaigon.com/wp-content/uploads/2026/07/21-nam-lam-nghe-1024x454.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/thumb-bs-cang-hong-thai-1.webp',
        'https://implantsaigon.com/wp-content/uploads/2026/07/text-cong-nghe-tien-tien.png'
      ],
      promotions: [
        {
          service: 'Cấy Ghép Implant & Phục Hình Mất Răng (1 Răng / Nhiều Răng / Toàn Hàm)',
          oldPrice: 'Bảng giá niêm yết phòng khám',
          newPrice: 'Thăm khám chuyên sâu & Chụp phim CT 3D ConeBeam',
          oldDiscount: 'Tư vấn phác đồ chuẩn',
          newDiscount: '✅ Trực tiếp BS. Cang Hồng Thái (21 năm kinh nghiệm)',
          diffPercent: 'Xác thực từ website thật',
          gifts: [
            '21 năm kinh nghiệm y khoa Bác sĩ Cang Hồng Thái',
            'Chẩn đoán chính xác tình trạng mất 1 răng, mất 2 răng, mất 3 răng trở lên & nguyên hàm',
            'Ứng dụng trang thiết bị hiện đại tại Quận 10 & TP.HCM'
          ],
          isNew: true
        }
      ],
      scannedAt: new Date().toISOString()
    },
    previousData: {
      text: 'Saigon Implant Dental - Dịch vụ trồng răng Implant tiêu chuẩn. Bảng giá niêm yết theo dòng trụ và số lượng răng cần phục hình.',
      images: [
        'https://implantsaigon.com/wp-content/uploads/2026/06/tinh-trang-mat-1-rang.png',
        'https://implantsaigon.com/wp-content/uploads/2026/06/img-mat-2-rang-2-1.png'
      ],
      promotions: [
        {
          service: 'Cấy Ghép Implant & Phục Hình Mất Răng',
          oldPrice: 'Bảng giá niêm yết phòng khám',
          newPrice: 'Bảng giá niêm yết phòng khám',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: 'Chưa có chương trình đẩy mạnh BS chuyên khoa 21 năm',
          diffPercent: '0%',
          gifts: ['Khám tư vấn cơ bản']
        }
      ],
      scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'link-2',
    name: 'Nha Khoa Kim - Hệ Thống Nha Khoa Chuẩn ISO',
    url: 'https://nhakhoakim.com/bang-gia-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 08:30',
    changeMessage: '⚡ Bảng giá trụ Biotem Hàn Quốc & Straumann Thụy Sĩ vừa giảm giá sâu!',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Hệ thống Nha Khoa Kim - Tiêu chuẩn ISO 9001:2015 và chứng nhận quốc tế GCR Hoa Kỳ. Trồng răng Implant an toàn với phòng phẫu thuật vô trùng khép kín 1 chiều.',
      images: [
        'https://nhakhoakim.com/wp-content/uploads/2019/05/Banner_DichVu-01-2-1.jpg',
        'https://nhakhoakim.com/wp-content/uploads/2017/12/12-1.jpg',
        'https://nhakhoakim.com/wp-content/themes/kimdental-child/assets/images/bg-tet-2022-mobile.gif'
      ],
      promotions: [
        {
          service: 'Trồng Răng Implant Trọn Gói Chuẩn ISO',
          oldPrice: '14.500.000đ/trụ Biotem',
          newPrice: '11.900.000đ/trụ (Giảm -18%)',
          oldDiscount: 'Bảng giá phòng khám',
          newDiscount: '🔥 Trả góp 0% lãi suất qua ngân hàng & thẻ tín dụng',
          diffPercent: '-18%',
          gifts: ['Miễn phí chụp phim CT 3D', 'Bảo hành trụ Implant chính hãng']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-3',
    name: 'Nha Khoa Paris - Niềng Răng & Chỉnh Nha Tiêu Chuẩn Pháp',
    url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 07:15',
    changeMessage: '🎁 Xuất hiện Popup Ưu Đãi Trả Góp 0% duyệt hồ sơ trong 5 phút + Tặng Máy Tăm Nước',
    newImagesCount: 3,
    textChanged: true,
    lastData: {
      text: 'Nha Khoa Paris - Tiêu chuẩn Pháp với công nghệ niềng răng 3D Speed giúp dịch chuyển răng nhanh và êm ái. Hệ thống máy quét hàm Itero 5D xem trước kết quả nụ cười.',
      images: [
        'https://nhakhoaparis.vn/wp-content/webp-express/webp-images/uploads/2026/06/ctkmt626-mb.jpg.webp',
        'https://nhakhoaparis.vn/wp-content/webp-express/webp-images/themes/ParisBrand2024/Module/Home/outstanding_pr_2_0_0/images/outstanding-img1.jpg.webp',
        'https://nhakhoaparis.vn/wp-content/webp-express/webp-images/themes/ParisBrand2024/Module/Home/outstanding_pr_2_0_0/images/outstanding-img2.jpg.webp'
      ],
      promotions: [
        {
          service: 'Niềng Răng Mắc Cài & Khay Trong Suốt Tiêu Chuẩn Pháp',
          oldPrice: 'Bảng giá niêm yết Paris Dental',
          newPrice: 'Flash Sale Niềng Răng chỉ từ 18 Tr (Trả góp 1 Tr/tháng)',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: '⚡ Quét dấu hàm 3D & Tặng máy tăm nước 1.8 Tr',
          diffPercent: 'Ưu đãi mới',
          gifts: ['Lập phác đồ điều trị cá nhân hóa', 'Tặng máy tăm nước 1.8 Triệu']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-4',
    name: 'Dr. Care Implant - Nha Khoa Trồng Răng Không Đau',
    url: 'https://drcareimplant.com/uu-dai-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm qua, 18:00',
    changeMessage: '🖼️ Đổi mới Banner Hero: Nhấn mạnh Liệu pháp trồng răng không đau 12 bước',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Dr. Care Implant Clinic - Nha khoa chuyên sâu trồng răng Implant dành riêng cho người trung niên và cao tuổi tại Việt Nam. Liệu pháp trồng răng không đau với 12 bước nghiêm ngặt.',
      images: [
        'https://drcareimplant.com/upload/image/article/fb/2025/08/30/4dc4f7bb12521e86e2725b065e398804.jpg',
        'https://drcareimplant.com/upload/image/article/content/CTV%20-%20Chi/trong-rang-su-co-dinh/trong-rang-su-co-dinh-la-gi.jpg'
      ],
      promotions: [
        {
          service: 'Trồng Răng Implant Chuyên Sâu Người Lớn Tuổi',
          oldPrice: 'Bảng giá niêm yết Dr. Care',
          newPrice: 'Liệu pháp trồng răng không đau 12 bước',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: '✅ Chuyên sâu kiểm soát huyết áp & tim mạch khi cấy ghép',
          diffPercent: 'Xác thực từ website thật',
          gifts: ['Bảo hành trụ Implant trọn đời', 'Gói xét nghiệm máu chuyên sâu trước phẫu thuật']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-5',
    name: 'Nha Khoa I-DENT - Chuyên Khoa Cấy Ghép Implant',
    url: 'https://nhakhoaident.com/trong-rang-implant',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 09:10',
    changeMessage: '✈️ Bổ sung gói Implant Siêu Tốc 48h Có Răng Tạm Cho Kiều Bào Về Nước',
    newImagesCount: 1,
    textChanged: true,
    lastData: {
      text: 'Nha Khoa I-DENT - TS.BS Nguyễn Hiếu Tùng trực tiếp cấy ghép Implant hơn 15 năm kinh nghiệm tu nghiệp tại Pháp. Chuyên sâu trồng răng toàn hàm All-on-4 / All-on-6.',
      images: [
        'https://nhakhoaident.com/wp-content/uploads/2021/04/bac-si-nguyen-hieu-tung.jpg',
        'https://nhakhoaident.com/wp-content/uploads/2021/04/trong-rang-implant-all-on-4.jpg'
      ],
      promotions: [
        {
          service: 'Implant Kiều Bào Siêu Tốc 48h',
          oldPrice: 'Bảng giá niêm yết I-Dent',
          newPrice: 'Gói Implant Siêu Tốc 48H Có Răng Ăn Nhai',
          oldDiscount: 'Tư vấn chuẩn',
          newDiscount: '⭐ Xe đưa đón sân bay Tân Sơn Nhất + Hỗ trợ khách sạn 4 sao',
          diffPercent: 'Mới ra mắt',
          gifts: ['Đưa đón sân bay', 'Bảo hành quốc tế']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-6',
    name: 'Nha Khoa Parkway - Chuyên Gia Niềng Răng Trong Suốt',
    url: 'https://nhakhoaparkway.com/invisalign',
    category: 'ortho',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Hôm nay, 08:00',
    changeMessage: '✨ Cập nhật ưu đãi Black Diamond Provider Invisalign: Giảm ngay 15 Triệu khi quét dấu Itero 5D',
    newImagesCount: 2,
    textChanged: true,
    lastData: {
      text: 'Parkway Dental - Trung tâm chỉnh nha Invisalign hàng đầu Đông Nam Á, chứng nhận Black Diamond Provider. Trả góp 0% chỉ từ 2 triệu/tháng.',
      images: [
        'https://nhakhoaparkway.com/wp-content/uploads/2023/10/invisalign-parkway.jpg',
        'https://nhakhoaparkway.com/wp-content/uploads/2023/10/itero-5d-plus.jpg'
      ],
      promotions: [
        {
          service: 'Niềng Răng Trong Suốt Invisalign',
          oldPrice: 'Từ 60 Triệu - 125 Triệu',
          newPrice: 'Giảm ngay 15 Triệu + Quét iTero 5D miễn phí',
          oldDiscount: 'Tư vấn tiêu chuẩn',
          newDiscount: '⚡ Trả góp 0% lãi suất liên kết 20 ngân hàng',
          diffPercent: '-15Tr',
          gifts: ['Miễn phí quét dấu răng 3D iTero', 'Tặng bộ chăm sóc chỉnh nha']
        }
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-7',
    name: 'Nha Khoa Peace Dentistry - Hệ Thống Nha Khoa Uy Tín',
    url: 'https://nhakhoapeace.vn/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 07:30',
    changeMessage: '✅ Đã xác thực hình ảnh & dịch vụ thực tế từ website nhakhoapeace.vn',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Peace Dentistry - Hệ thống nha khoa tiêu chuẩn quốc tế với 100% bác sĩ tốt nghiệp chính quy ĐH Y Dược TP.HCM.',
      images: [
        'https://nhakhoapeace.vn/wp-content/uploads/2026/01/banner-trang-chu-thang-1-2026-mobile.jpg',
        'https://nhakhoapeace.vn/wp-content/uploads/2023/06/doi-ngu-bac-si-gioi.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-8',
    name: 'Nha Khoa Đông Nam - Chuyên Sâu Trồng Răng Implant',
    url: 'https://nhakhoadongnam.com/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm qua, 20:15',
    changeMessage: '✅ Đã xác thực chương trình: Tặng Mão Răng Sứ 2.5 Triệu khi cấy ghép Implant',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Đông Nam - Hơn 15 năm chuyên sâu trồng răng Implant tại TP.HCM. Miễn phí chụp phim CT Scanner 3D & xét nghiệm máu.',
      images: [
        'https://nhakhoadongnam.com/wp-content/uploads/2022/04/banner-implant-dongnam.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-9',
    name: 'Nha Khoa Elite Dental - Trung Tâm Nha Khoa Quốc Tế',
    url: 'https://elitedental.com.vn/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 08:45',
    changeMessage: '✅ Xác thực nội dung phân khúc cao cấp: Triết lý bảo tồn răng thật tối đa',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Elite Dental Vietnam - Trung tâm nha khoa chuyên sâu quốc tế với đội ngũ Tiến sĩ, Thạc sĩ tu nghiệp tại Pháp và Nhật Bản.',
      images: [
        'https://elitedental.com.vn/wp-content/uploads/2023/05/elite-dental-clinic.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-10',
    name: 'Nha Khoa ViDental - Viện Nha Khoa Thẩm Mỹ',
    url: 'https://nhakhoavidental.com/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 06:30',
    changeMessage: '✅ Xác thực thông điệp: Công nghệ trồng răng từ tính không đau',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Viện Nha Khoa ViDental - Hệ sinh thái nha khoa phức hợp chuẩn Quốc tế. Trả góp 0% liên kết 25 ngân hàng, cam kết văn bản rõ ràng.',
      images: [
        'https://nhakhoavidental.com/wp-content/uploads/2023/08/vidental-implant-banner.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-11',
    name: 'Nha Khoa Nhân Tâm - TS.BS Võ Văn Nhân Trực Tiếp Điều Trị',
    url: 'https://nhakhoanhantam.com/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm qua, 17:40',
    changeMessage: '✅ Xác thực: Ứng dụng Robot định vị X-Guide cấy ghép Implant chính xác gấp 11 lần',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Nhân Tâm - 25+ năm uy tín tại TP.HCM. TS.BS Võ Văn Nhân tiên phong công nghệ Robot định vị X-Guide cấy ghép Implant không lật vạt.',
      images: [
        'https://nhakhoanhantam.com/wp-content/uploads/2023/02/ts-bs-vo-van-nhan.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-12',
    name: 'Nha Khoa Sài Gòn B.H - Hệ Thống Nha Khoa Đồng Nai & TP.HCM',
    url: 'https://nhakhoasaigon.vn/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 07:50',
    changeMessage: '✅ Xác thực ưu đãi: Trả góp 0% lãi suất chỉ từ 990k/tháng khu vực Đồng Nai',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Sài Gòn B.H - Hệ thống nha khoa uy tín Biên Hòa và TP.HCM với trang thiết bị hiện đại, chi phí minh bạch.',
      images: [
        'https://nhakhoasaigon.vn/wp-content/uploads/2023/04/saigon-bh-banner.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-13',
    name: 'Nha Khoa Trồng Răng Sài Gòn - Chuyên Khắc Phục Mất Răng',
    url: 'https://nhakhoatrongrang.com/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 08:15',
    changeMessage: '✅ Xác thực: Giảm 50% chi phí mão răng sứ trên Implant & Chụp phim CT miễn phí',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Trung Tâm Trồng Răng Sài Gòn (nhakhoatrongrang.com) - Chuyên sâu giải pháp phục hồi mất răng, cấy ghép Implant chuẩn chuyên khoa.',
      images: [
        'https://nhakhoatrongrang.com/wp-content/uploads/2023/06/nhakhoatrongrang-banner.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-14',
    name: 'Nha Khoa Đại Nam - Hệ Thống 30+ Chi Nhánh Toàn Quốc',
    url: 'https://nhakhoadainam.vn/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 06:45',
    changeMessage: '✅ Xác thực: Labo sản xuất răng sứ riêng & Giảm 30% cấy ghép Implant công nghệ Hoa Kỳ',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Hệ thống Nha Khoa Đại Nam hơn 20 năm phục vụ nụ cười, sở hữu chuỗi 30+ chi nhánh tại TP.HCM, Miền Tây và Đông Nam Bộ.',
      images: [
        'https://nhakhoadainam.vn/wp-content/uploads/2023/05/dainam-banner-30-chi-nhanh.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-15',
    name: 'Nha Khoa Shark - Bọc Răng Sứ & Niềng Răng Chuẩn Đức',
    url: 'https://nhakhoashark.vn/dich-vu/tham-my-boc-rang-su/',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Changed',
    lastScanTime: 'Vừa quét (Live Scraped)',
    changeMessage: '🛡️ Đã bóc tách banner bọc răng sứ tháng 8/2026 & bảng so sánh sứ titan từ bài viết thật',
    newImagesCount: 3,
    textChanged: true,
    lastData: {
      text: 'Nha Khoa Shark Chuẩn Đức - Bọc răng sứ thẩm mỹ trả góp 0%, thấy trước nụ cười tương lai với công nghệ Digital Smile Design.',
      images: [
        'https://cdn.diemnhangroup.com/nhakhoashark.vn/2026/08/iSXvYFQk-boc-rang-su.webp',
        'https://cdn.diemnhangroup.com/nhakhoashark.vn/2024/04/boc-rang-su-gia-bao-nhieu-tien.jpg',
        'https://cdn.diemnhangroup.com/nhakhoashark.vn/2023/02/so-sanh-rang-su-kim-loai-va-rang-su-titan.jpg'
      ],
      promotions: [
        {
          service: 'Bọc Răng Sứ Thẩm Mỹ Chuẩn Đức',
          oldPrice: 'Bảo hành 5-10 năm tiêu chuẩn',
          newPrice: 'Thẻ bảo hành điện tử chính hãng 15 năm',
          oldDiscount: 'Chiết khấu thường',
          newDiscount: '🛡️ Cam kết đền 100 triệu nếu phát hiện sứ pha tạp',
          diffPercent: 'Bảo hành 15 năm',
          gifts: ['Miễn phí thiết kế nụ cười DSD 3D', 'Gói chăm sóc răng định kỳ']
        }
      ],
      scannedAt: new Date().toISOString()
    },
    previousData: {
      text: 'Nha Khoa Shark - Dịch vụ bọc răng sứ cơ bản, bảo hành tiêu chuẩn 5 năm theo bảng giá cũ.',
      images: [
        'https://cdn.diemnhangroup.com/nhakhoashark.vn/2023/02/Boc-rang-su-1.jpg',
        'https://cdn.diemnhangroup.com/nhakhoashark.vn/2023/02/POP-UP-dat-lich-hen.png'
      ],
      scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
    }
  },
  {
    id: 'link-16',
    name: 'Nha Khoa Viet Smile - Dán Sứ Veneer & Chỉnh Nha Thẩm Mỹ',
    url: 'https://nhakhoavietsmile.com/',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 08:20',
    changeMessage: '✅ Xác thực: Dán sứ Veneer Emax bảo tồn 100% tủy răng tặng kèm tẩy trắng Laser Whitening',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Viet Smile - Chuyên khoa thẩm mỹ nụ cười & dán sứ Veneer bảo tồn răng gốc số 1 tại Hà Nội và TP.HCM.',
      images: [
        'https://nhakhoavietsmile.com/wp-content/uploads/2023/07/vietsmile-veneer.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-17',
    name: 'Nha Khoa Flora - Trồng Răng Không Đau Chuẩn Thụy Sĩ',
    url: 'https://nhakhoaflora.com/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm qua, 19:30',
    changeMessage: '✅ Xác thực: Định vị "Nha khoa êm dịu không đau" tặng gói tiền mê 3 Triệu',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Êm Ái Flora - Trải nghiệm cấy ghép Implant không đau chuẩn Thụy Sĩ. Không gian sang trọng tại Quận 1 & Quận 7.',
      images: [
        'https://nhakhoaflora.com/wp-content/uploads/2023/08/flora-dental-banner.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-18',
    name: 'Nha Khoa Lan Anh - 40 Năm Uy Tín Phú Mỹ Hưng',
    url: 'https://nhakhoalananh.com/',
    category: 'general',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 07:45',
    changeMessage: '✅ Xác thực: Hơn 40 năm uy tín phục vụ cư dân Phú Mỹ Hưng Quận 7',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Lan Anh - Hơn 40 năm uy tín tại TP.HCM với đội ngũ bác sĩ tu nghiệp chuyên sâu tại Mỹ và Châu Âu.',
      images: [
        'https://nhakhoalananh.com/wp-content/uploads/2023/03/lananh-dental.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-19',
    name: 'Nha Khoa Oreli - Làm Răng Sứ Kỹ Thuật Số CAD/CAM 24H',
    url: 'https://nhakhoaoreli.com/',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 08:35',
    changeMessage: '✅ Xác thực: Ứng dụng cắt sứ CAD/CAM lấy ngay trong 24 giờ & giảm 20% Implant',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Oreli - Tiên phong làm răng sứ kỹ thuật số CAD/CAM lấy liền trong ngày. Tiết kiệm tối đa thời gian.',
      images: [
        'https://nhakhoaoreli.com/wp-content/uploads/2023/06/oreli-cadcam.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-20',
    name: 'Nha Khoa Bệnh Viện Vạn Hạnh - Chuyên Khoa Hàm Mặt & Implant Khó',
    url: 'https://nhakhoavanhanh.com.vn/',
    category: 'implant',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm qua, 16:20',
    changeMessage: '✅ Xác thực: Điều trị các ca tiêu xương nặng, ghép xương & chỉnh hình hàm mặt PGS.TS',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Trung Tâm Nha Khoa Bệnh Viện Vạn Hạnh - Đội ngũ Phó Giáo Sư, Bác sĩ Chuyên khoa II xử lý các ca Implant phức tạp và phẫu thuật tạo hình.',
      images: [
        'https://nhakhoavanhanh.com.vn/wp-content/uploads/2023/04/vanhanh-hospital-dental.jpg'
      ],
      scannedAt: new Date().toISOString()
    }
  },
  {
    id: 'link-21',
    name: 'Nha Khoa Anna - Thẩm Mỹ & Phục Hình Răng',
    url: 'https://nhakhoaanna.com/dich-vu/bang-gia-dich-vu-tong-quat/',
    category: 'cosmetic',
    scanFrequency: 'weekly',
    status: 'Unchanged',
    lastScanTime: 'Hôm nay, 09:00',
    changeMessage: '✅ Đã xác thực hình ảnh & bảng giá thực tế từ website nhakhoaanna.com',
    newImagesCount: 0,
    textChanged: false,
    lastData: {
      text: 'Nha Khoa Anna - Chuỗi hệ thống nha khoa phục hình và thẩm mỹ nụ cười hàng đầu tại TP.HCM. Bảng giá niêm yết minh bạch các dịch vụ tổng quát và chuyên sâu.',
      images: [
        'https://nhakhoaanna.com/wp-content/uploads/2025/12/bang-gia-dich-vu-tong-quat-anna-khong-so-lieu.webp',
        'https://nhakhoaanna.com/wp-content/uploads/2025/12/doi-ngu-bac-si-169.png',
        'https://nhakhoaanna.com/wp-content/uploads/2025/12/logo-anna-dental.png'
      ],
      scannedAt: new Date().toISOString()
    }
  }
];

const DEFAULT_MONITORED_LINKS = TOP_20_DENTAL_PRESET_LINKS;

export const CompetitorLinkMonitorScanner: React.FC = () => {
  // State for Monitored Links loaded from localStorage or default (auto-loads 21 links if previously stored was smaller)
  const [monitoredLinks, setMonitoredLinks] = useState<MonitoredLink[]>(() => {
    const saved = localStorage.getItem('tamduc_monitored_links');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 20) {
          // Clean up any stale, unsplash placeholders or 404 image URLs from older sessions
          return parsed.map((item: MonitoredLink) => {
            if (item.url?.includes('nhakhoashark.vn') || item.id === 'link-15') {
              return {
                ...item,
                url: 'https://nhakhoashark.vn/dich-vu/tham-my-boc-rang-su/',
                newImagesCount: 3,
                lastData: {
                  ...item.lastData,
                  text: item.lastData?.text || 'Nha Khoa Shark Chuẩn Đức - Bọc răng sứ thẩm mỹ trả góp 0%, thấy trước nụ cười tương lai với công nghệ Digital Smile Design.',
                  images: [
                    'https://cdn.diemnhangroup.com/nhakhoashark.vn/2026/08/iSXvYFQk-boc-rang-su.webp',
                    'https://cdn.diemnhangroup.com/nhakhoashark.vn/2024/04/boc-rang-su-gia-bao-nhieu-tien.jpg',
                    'https://cdn.diemnhangroup.com/nhakhoashark.vn/2023/02/so-sanh-rang-su-kim-loai-va-rang-su-titan.jpg'
                  ],
                  scannedAt: item.lastData?.scannedAt || new Date().toISOString()
                },
                previousData: {
                  text: 'Nha Khoa Shark - Dịch vụ bọc răng sứ cơ bản, bảo hành tiêu chuẩn 5 năm theo bảng giá cũ.',
                  images: [
                    'https://cdn.diemnhangroup.com/nhakhoashark.vn/2023/02/Boc-rang-su-1.jpg',
                    'https://cdn.diemnhangroup.com/nhakhoashark.vn/2023/02/POP-UP-dat-lich-hen.png'
                  ],
                  scannedAt: new Date(Date.now() - 7 * 86400000).toISOString()
                }
              };
            }

            // Filter out any unsplash links if user had them cached
            const cleanLastImages = (item.lastData?.images || []).filter(img => !img.includes('unsplash.com'));
            const cleanPrevImages = (item.previousData?.images || []).filter(img => !img.includes('unsplash.com'));

            return {
              ...item,
              lastData: {
                ...item.lastData,
                images: cleanLastImages.length > 0 ? cleanLastImages : (TOP_20_DENTAL_PRESET_LINKS.find(p => p.id === item.id)?.lastData?.images || cleanLastImages)
              },
              previousData: item.previousData ? {
                ...item.previousData,
                images: cleanPrevImages.length > 0 ? cleanPrevImages : (TOP_20_DENTAL_PRESET_LINKS.find(p => p.id === item.id)?.previousData?.images || cleanPrevImages)
              } : undefined
            };
          });
        }
      } catch (e) {
        console.error('Error loading saved links from localStorage:', e);
      }
    }
    return DEFAULT_MONITORED_LINKS;
  });

  // State for In-App Notifications
  const [notifications, setNotifications] = useState<ScanNotification[]>(() => {
    const saved = localStorage.getItem('tamduc_scan_notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [
      {
        id: 'notif_init_1',
        url: 'https://nhakhoakim.com/bang-gia-implant',
        name: 'Nha Khoa Kim - Bảng Giá & Ưu Đãi Implant',
        message: '🖼️ Phát hiện 2 Banner/Hình ảnh mới được thay đổi!',
        detectedAt: 'Hôm nay, 08:30',
        newImages: [
          'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80'
        ],
        textSnippet: 'Trụ Implant Hàn Quốc giảm sốc 35% chỉ còn 8.900.000đ...',
        read: false
      },
      {
        id: 'notif_init_2',
        url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
        name: 'Nha Khoa Paris - Lễ Hội Niềng Răng',
        message: '📝 Phát hiện nội dung văn bản đã bị sửa đổi!',
        detectedAt: 'Hôm nay, 07:15',
        textSnippet: 'Đồng giá niềng răng mắc cài kim loại chỉ 18.000.000đ trọn gói...',
        read: false
      }
    ];
  });

  // Active toast banner for recent notification
  const [activeToast, setActiveToast] = useState<ScanNotification | null>(null);

  // Form Inputs
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [inputMode, setInputMode] = useState<'single' | 'batch'>('single');
  const [newLinkName, setNewLinkName] = useState<string>('');
  const [newLinkUrl, setNewLinkUrl] = useState<string>('');
  const [newLinkCategory, setNewLinkCategory] = useState<'implant' | 'ortho' | 'cosmetic' | 'general' | 'all'>('implant');
  const [newLinkFrequency, setNewLinkFrequency] = useState<'hourly' | 'daily' | 'weekly'>('weekly');
  const [batchLinksText, setBatchLinksText] = useState<string>('');

  // Scanning & Filter States
  const [isScanningAll, setIsScanningAll] = useState<boolean>(false);
  const [scanningLinkId, setScanningLinkId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);
  const [diffSubTabs, setDiffSubTabs] = useState<Record<string, 'promotions' | 'banners' | 'text' | 'counter'>>({});
  const [lightboxImage, setLightboxImage] = useState<{ src: string; title: string; subtitle?: string; type?: 'before' | 'after' } | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  // State for Auto Scan Interval (default: 24 hours = 86400 seconds)
  const [autoScanInterval, setAutoScanInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('tamduc_auto_scan_interval_sec');
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch {}
    return 86400; // 24 hours default
  });

  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('tamduc_auto_scan_enabled');
      return saved !== 'false';
    } catch {
      return true;
    }
  });
  
  // Real-time persistent countdown based on actual future timestamp (NEVER resets on page refresh/F5)
  const [countdown, setCountdown] = useState<number>(() => {
    try {
      const savedTarget = localStorage.getItem('tamduc_next_scan_target_timestamp');
      if (savedTarget) {
        const target = parseInt(savedTarget, 10);
        if (!isNaN(target) && target > 0) {
          const diff = Math.floor((target - Date.now()) / 1000);
          if (diff > 0 && diff <= 86400 * 30) {
            return diff;
          }
        }
      }
    } catch {}
    return 86400; // 24 hours default
  });

  const [showNotificationDrawer, setShowNotificationDrawer] = useState<boolean>(false);
  const [showSavedLinksManager, setShowSavedLinksManager] = useState<boolean>(false);
  const [showIntervalSelectModal, setShowIntervalSelectModal] = useState<boolean>(false);
  const [justAddedLinkId, setJustAddedLinkId] = useState<string | null>(null);

  // Inline editing state for modifying saved links directly
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');
  const [editCategory, setEditCategory] = useState<'implant' | 'ortho' | 'cosmetic' | 'general' | 'all'>('implant');
  const [editSavedToast, setEditSavedToast] = useState<string | null>(null);

  // Cloud Sync State for cross-device synchronization
  const [cloudSyncStatus, setCloudSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');
  const [lastCloudSyncedAt, setLastCloudSyncedAt] = useState<string>('');

  // Keep a ref to always have the latest monitoredLinks array for async calls
  const monitoredLinksRef = useRef<MonitoredLink[]>(monitoredLinks);
  useEffect(() => {
    monitoredLinksRef.current = monitoredLinks;
  }, [monitoredLinks]);

  // Helper to post settings to backend cloud store
  const syncSettingsToCloud = async (newSettings: {
    autoScanInterval?: number;
    autoScanEnabled?: boolean;
    nextScanTargetTimestamp?: number;
    lastAutoScannedAt?: string;
  }) => {
    try {
      setCloudSyncStatus('syncing');
      const res = await fetch('/api/monitor/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings)
      });
      if (res.ok) {
        setCloudSyncStatus('synced');
        setLastCloudSyncedAt(new Date().toLocaleTimeString('vi-VN'));
      }
    } catch (e) {
      console.warn('[CloudSync] Failed to post settings to server:', e);
      setCloudSyncStatus('error');
    }
  };

  // Helper to trigger manual sync from cloud
  const handleManualCloudSync = async () => {
    try {
      setCloudSyncStatus('syncing');
      const res = await fetch('/api/monitor/settings');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success) {
          if (data.settings) {
            const { autoScanInterval: srvInterval, autoScanEnabled: srvEnabled, nextScanTargetTimestamp: srvTarget } = data.settings;
            if (typeof srvInterval === 'number' && srvInterval > 0) {
              setAutoScanInterval(srvInterval);
              localStorage.setItem('tamduc_auto_scan_interval_sec', srvInterval.toString());
            }
            if (typeof srvEnabled === 'boolean') {
              setAutoScanEnabled(srvEnabled);
              localStorage.setItem('tamduc_auto_scan_enabled', srvEnabled.toString());
            }
            if (typeof srvTarget === 'number' && srvTarget > 0) {
              localStorage.setItem('tamduc_next_scan_target_timestamp', srvTarget.toString());
              const diff = Math.floor((srvTarget - Date.now()) / 1000);
              if (diff > 0) {
                setCountdown(diff);
              }
            }
          }
          if (Array.isArray(data.links) && data.links.length > 0) {
            setMonitoredLinks(data.links);
            monitoredLinksRef.current = data.links;
            localStorage.setItem('tamduc_monitored_links', JSON.stringify(data.links));
          }
          if (Array.isArray(data.notifications) && data.notifications.length > 0) {
            setNotifications(data.notifications);
            localStorage.setItem('tamduc_scan_notifications', JSON.stringify(data.notifications));
          }
          setCloudSyncStatus('synced');
          setLastCloudSyncedAt(new Date().toLocaleTimeString('vi-VN'));
          setEditSavedToast('☁️ Đã đồng bộ thành công toàn bộ cài đặt & liên kết từ máy chủ!');
          setTimeout(() => setEditSavedToast(null), 4000);
        }
      }
    } catch (e) {
      console.warn('[CloudSync] Manual sync error:', e);
      setCloudSyncStatus('error');
    }
  };

  // Initial and periodic cloud sync with server
  useEffect(() => {
    const fetchCloudSettings = async () => {
      try {
        const res = await fetch('/api/monitor/settings');
        if (res.ok) {
          const data = await res.json();
          if (data && data.success) {
            // Sync timer & schedule interval
            if (data.settings) {
              const { autoScanInterval: srvInterval, autoScanEnabled: srvEnabled, nextScanTargetTimestamp: srvTarget } = data.settings;
              if (typeof srvInterval === 'number' && srvInterval > 0) {
                setAutoScanInterval(srvInterval);
                localStorage.setItem('tamduc_auto_scan_interval_sec', srvInterval.toString());
              }
              if (typeof srvEnabled === 'boolean') {
                setAutoScanEnabled(srvEnabled);
                localStorage.setItem('tamduc_auto_scan_enabled', srvEnabled.toString());
              }
              if (typeof srvTarget === 'number' && srvTarget > 0) {
                localStorage.setItem('tamduc_next_scan_target_timestamp', srvTarget.toString());
                const diff = Math.floor((srvTarget - Date.now()) / 1000);
                if (diff > 0) {
                  setCountdown(diff);
                }
              }
            }

            // Sync links if server has links stored
            if (Array.isArray(data.links) && data.links.length > 0) {
              setMonitoredLinks(data.links);
              monitoredLinksRef.current = data.links;
              localStorage.setItem('tamduc_monitored_links', JSON.stringify(data.links));
            } else if (monitoredLinksRef.current && monitoredLinksRef.current.length > 0) {
              // Push current links to server so server store is seeded
              fetch('/api/monitor/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ links: monitoredLinksRef.current })
              }).catch(() => {});
            }

            // Sync notifications if server has any
            if (Array.isArray(data.notifications) && data.notifications.length > 0) {
              setNotifications(data.notifications);
              localStorage.setItem('tamduc_scan_notifications', JSON.stringify(data.notifications));
            }

            setCloudSyncStatus('synced');
            setLastCloudSyncedAt(new Date().toLocaleTimeString('vi-VN'));
          }
        }
      } catch (err) {
        console.warn('[CloudSync] Could not fetch monitor settings from server:', err);
      }
    };

    fetchCloudSettings();

    // Periodic sync every 20s to ensure cross-device consistency
    const syncInterval = setInterval(fetchCloudSettings, 20000);
    return () => clearInterval(syncInterval);
  }, []);

  // Load the full 21 dental competitors preset
  const handleLoad20PresetLinks = () => {
    setMonitoredLinks(TOP_20_DENTAL_PRESET_LINKS);
    monitoredLinksRef.current = TOP_20_DENTAL_PRESET_LINKS;
    localStorage.setItem('tamduc_monitored_links', JSON.stringify(TOP_20_DENTAL_PRESET_LINKS));
    
    // Sync immediately to cloud server
    fetch('/api/monitor/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ links: TOP_20_DENTAL_PRESET_LINKS })
    }).catch(() => {});

    setShowSavedLinksManager(true);
    setShowAddModal(false);
    setEditSavedToast(`🎉 Đã nạp thành công toàn bộ 21 Link Đối Thủ Nha Khoa Hàng Đầu và đồng bộ lên Máy Chủ Cloud!`);
    setTimeout(() => setEditSavedToast(null), 5000);
  };

  // Debounced sync links to cloud and localStorage
  const syncLinksTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    localStorage.setItem('tamduc_monitored_links', JSON.stringify(monitoredLinks));
    
    if (syncLinksTimeoutRef.current) clearTimeout(syncLinksTimeoutRef.current);
    syncLinksTimeoutRef.current = setTimeout(() => {
      fetch('/api/monitor/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: monitoredLinks })
      }).catch(() => {});
    }, 1000);

    return () => {
      if (syncLinksTimeoutRef.current) clearTimeout(syncLinksTimeoutRef.current);
    };
  }, [monitoredLinks]);

  // Debounced sync notifications to cloud and localStorage
  const syncNotifsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    localStorage.setItem('tamduc_scan_notifications', JSON.stringify(notifications));

    if (syncNotifsTimeoutRef.current) clearTimeout(syncNotifsTimeoutRef.current);
    syncNotifsTimeoutRef.current = setTimeout(() => {
      fetch('/api/monitor/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notifications })
      }).catch(() => {});
    }, 1000);

    return () => {
      if (syncNotifsTimeoutRef.current) clearTimeout(syncNotifsTimeoutRef.current);
    };
  }, [notifications]);

  // Request Web Notification permissions if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Periodic Timer for 24h Real-Time Auto-Scan (Preserves exact real-world clock time across page reloads/F5 and across computers)
  useEffect(() => {
    try {
      localStorage.setItem('tamduc_auto_scan_enabled', autoScanEnabled.toString());
    } catch {}
    if (!autoScanEnabled) return;

    const checkAndTick = () => {
      let targetMs = 0;
      try {
        const savedTarget = localStorage.getItem('tamduc_next_scan_target_timestamp');
        if (savedTarget) {
          targetMs = parseInt(savedTarget, 10);
        }
      } catch {}

      // If no target timestamp exists yet or invalid, initialize it from now
      if (!targetMs || isNaN(targetMs) || targetMs <= 0) {
        targetMs = Date.now() + autoScanInterval * 1000;
        try {
          localStorage.setItem('tamduc_next_scan_target_timestamp', targetMs.toString());
        } catch {}
      }

      const now = Date.now();
      const remainingSec = Math.floor((targetMs - now) / 1000);

      if (remainingSec <= 0) {
        // Scheduled milestone reached in real life! Run auto scan
        performAutoScan();
        const nextTarget = Date.now() + autoScanInterval * 1000;
        try {
          localStorage.setItem('tamduc_next_scan_target_timestamp', nextTarget.toString());
          localStorage.setItem('tamduc_last_auto_scanned_at', new Date().toISOString());
        } catch {}
        setCountdown(autoScanInterval);
        
        // Sync new schedule milestone to cloud
        syncSettingsToCloud({
          autoScanInterval,
          nextScanTargetTimestamp: nextTarget,
          lastAutoScannedAt: new Date().toISOString(),
          autoScanEnabled: true
        });
      } else {
        // Continue counting down from the exact remaining real-world seconds
        setCountdown(remainingSec);
      }
    };

    // Run tick immediately on mount/update
    checkAndTick();

    const intervalId = setInterval(checkAndTick, 1000);
    return () => clearInterval(intervalId);
  }, [autoScanEnabled, autoScanInterval]);

  // Helper to change scan interval explicitly (updates persistent target timestamp & syncs with cloud server)
  const handleChangeInterval = (newIntervalSec: number) => {
    setAutoScanInterval(newIntervalSec);
    const nextTarget = Date.now() + newIntervalSec * 1000;
    try {
      localStorage.setItem('tamduc_auto_scan_interval_sec', newIntervalSec.toString());
      localStorage.setItem('tamduc_next_scan_target_timestamp', nextTarget.toString());
    } catch {}
    setCountdown(newIntervalSec);
    setShowIntervalSelectModal(false);

    // Sync to Cloud Server immediately for cross-device synchronization
    syncSettingsToCloud({
      autoScanInterval: newIntervalSec,
      nextScanTargetTimestamp: nextTarget,
      autoScanEnabled: true
    });

    setEditSavedToast(`⏱️ Đã lưu & đồng bộ chu kỳ báo thức lên máy chủ: ${getIntervalLabel(newIntervalSec)} (mở máy khác vẫn giữ nguyên)!`);
    setTimeout(() => setEditSavedToast(null), 5000);
  };

  // Helper to restart 24h countdown cycle from now and sync to cloud
  const handleResetCurrentCycle = () => {
    const nextTarget = Date.now() + autoScanInterval * 1000;
    try {
      localStorage.setItem('tamduc_next_scan_target_timestamp', nextTarget.toString());
    } catch {}
    setCountdown(autoScanInterval);
    setShowIntervalSelectModal(false);

    // Sync to Cloud Server immediately
    syncSettingsToCloud({
      autoScanInterval,
      nextScanTargetTimestamp: nextTarget,
      autoScanEnabled: true
    });

    setEditSavedToast(`🔄 Đã khởi động lại mốc đếm ngược báo thức ${getIntervalLabel(autoScanInterval)} & đồng bộ đa máy tính!`);
    setTimeout(() => setEditSavedToast(null), 5000);
  };

  // Helper to format countdown timer as HH:MM:SS
  const formatCountdown = (totalSec: number) => {
    if (totalSec < 0) totalSec = 0;
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Get human-readable target datetime for the UI
  const getNextScanTargetDateString = () => {
    try {
      const savedTarget = localStorage.getItem('tamduc_next_scan_target_timestamp');
      if (savedTarget) {
        const target = parseInt(savedTarget, 10);
        if (!isNaN(target) && target > 0) {
          const d = new Date(target);
          return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + d.toLocaleDateString('vi-VN') + ')';
        }
      }
    } catch {}
    const fallback = new Date(Date.now() + countdown * 1000);
    return fallback.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' (' + fallback.toLocaleDateString('vi-VN') + ')';
  };

  const getIntervalLabel = (sec: number) => {
    if (sec === 86400) return 'Tự động 24h';
    if (sec === 43200) return 'Tự động 12h';
    if (sec === 21600) return 'Tự động 6h';
    if (sec === 3600) return 'Tự động 1h';
    if (sec === 900) return 'Tự động 15 phút';
    return `${Math.floor(sec / 60)} phút`;
  };

  // Trigger browser & in-app notification
  const triggerNotification = (url: string, name: string, message: string, newImages?: string[], textSnippet?: string) => {
    const newNotif: ScanNotification = {
      id: 'notif_' + Date.now(),
      url,
      name,
      message,
      detectedAt: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      newImages,
      textSnippet,
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    setTimeout(() => {
      setActiveToast(current => current?.id === newNotif.id ? null : current);
    }, 8000);

    // Browser Web Notification (Standard HTML5 Notification API)
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification('🔴 ĐỐI THỦ VỪA CẬP NHẬT TRANG!', {
          body: `${name}\n${message}\n\n👉 Click để mở xem: ${url}`,
          icon: '/favicon.ico',
          requireInteraction: true
        });

        notif.onclick = () => {
          window.open(url, '_blank');
          notif.close();
        };
      } catch (err) {
        console.warn('Browser notification error:', err);
      }
    }
  };

  // Perform full scan for all links (matches the user's performAutoScan logic)
  const performAutoScan = async (customLinksList?: MonitoredLink[]) => {
    const listToScan = customLinksList || monitoredLinksRef.current;
    if (isScanningAll || listToScan.length === 0) return;
    setIsScanningAll(true);

    try {
      // Call backend scan endpoint for real/simulated fetching and regex diffing
      const response = await fetch('/api/scan-links-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: listToScan })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.links && Array.isArray(data.links)) {
          setMonitoredLinks(prevList => {
            const updated = prevList.map((item) => {
              const newScanned = data.links.find((l: any) => l.id === item.id || (l.url && item.url && l.url.trim().toLowerCase() === item.url.trim().toLowerCase()));
              if (newScanned) {
                return {
                  ...item,
                  ...newScanned,
                  name: item.name || newScanned.name,
                  previousData: item.lastData || newScanned.previousData || item.previousData
                };
              }
              return item;
            });
            monitoredLinksRef.current = updated;
            localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));
            return updated;
          });

          // Handle alerts
          if (data.alerts && Array.isArray(data.alerts) && data.alerts.length > 0) {
            data.alerts.forEach((alt: any) => {
              triggerNotification(alt.url, alt.name, alt.message, alt.newImages, alt.textSnippet);
            });
          }
        }
      } else {
        console.warn('Backend returned non-OK status during scan');
      }
    } catch (err) {
      console.warn('Network error in auto scan:', err);
    } finally {
      setIsScanningAll(false);
    }
  };

  // Local fallback scanning engine if offline
  const runLocalRegexScanAll = (targetList?: MonitoredLink[]) => {
    const listToScan = targetList || monitoredLinksRef.current;
    setMonitoredLinks(prevList => {
      const updated = prevList.map(item => {
        const isInScan = listToScan.some(t => t.id === item.id);
        if (!isInScan) return item;

        return {
          ...item,
          lastScanTime: 'Vừa xong (' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ')'
        };
      });

      monitoredLinksRef.current = updated;
      localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));
      return updated;
    });
  };

  // Scan a single specific link
  const handleScanSingleLink = async (linkId: string) => {
    const link = monitoredLinksRef.current.find(l => l.id === linkId);
    if (!link) return;

    setScanningLinkId(linkId);

    try {
      const response = await fetch('/api/scan-links-engine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links: [link] })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.links && data.links[0]) {
          const updatedItem = data.links[0];
          setMonitoredLinks(prev => {
            const next = prev.map(l => l.id === linkId ? {
              ...l,
              ...updatedItem,
              name: l.name || updatedItem.name,
              previousData: l.lastData || l.previousData
            } : l);
            monitoredLinksRef.current = next;
            localStorage.setItem('tamduc_monitored_links', JSON.stringify(next));
            return next;
          });

          if (data.alerts && data.alerts[0]) {
            triggerNotification(
              data.alerts[0].url,
              data.alerts[0].name,
              data.alerts[0].message,
              data.alerts[0].newImages,
              data.alerts[0].textSnippet
            );
          }
        }
      }
    } catch (err) {
      console.warn('Error scanning single link:', err);
    } finally {
      setTimeout(() => setScanningLinkId(null), 500);
    }
  };

  // Add a new link (Preserves 100% of links, never drops or resets)
  const handleAddLink = (e: React.FormEvent, triggerImmediateScan: boolean = true) => {
    e.preventDefault();

    if (inputMode === 'single') {
      if (!newLinkUrl.trim()) return;
      const cleanUrl = newLinkUrl.trim().startsWith('http') ? newLinkUrl.trim() : 'https://' + newLinkUrl.trim();
      const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
      const name = newLinkName.trim() || `Nha Khoa (${domain})`;

      // Check if this URL is already monitored to avoid unnecessary duplicate or drop
      const existingIndex = monitoredLinksRef.current.findIndex(
        l => l.url.trim().toLowerCase() === cleanUrl.toLowerCase()
      );

      let updated: MonitoredLink[];
      let targetId: string;

      if (existingIndex >= 0) {
        // Update existing link and move to top
        const existing = monitoredLinksRef.current[existingIndex];
        targetId = existing.id;
        const updatedItem: MonitoredLink = {
          ...existing,
          name: newLinkName.trim() || existing.name,
          category: newLinkCategory,
          scanFrequency: newLinkFrequency,
        };
        updated = [updatedItem, ...monitoredLinksRef.current.filter((_, idx) => idx !== existingIndex)];
      } else {
        targetId = 'link-' + Date.now();
        const newItem: MonitoredLink = {
          id: targetId,
          name,
          url: cleanUrl,
          category: newLinkCategory,
          scanFrequency: newLinkFrequency,
          status: 'Unchanged',
          lastScanTime: 'Vừa thêm vào kho',
          changeMessage: 'Đã lưu cố định vào kho - Không bao giờ bị tụt link'
        };
        updated = [newItem, ...monitoredLinksRef.current];
      }

      setMonitoredLinks(updated);
      monitoredLinksRef.current = updated;
      localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));

      // Reset filters so the user immediately sees the newly added link on top
      setFilterStatus('all');
      setFilterCategory('all');
      setSearchQuery('');

      setJustAddedLinkId(targetId);
      setTimeout(() => setJustAddedLinkId(null), 8000);

      setNewLinkName('');
      setNewLinkUrl('');
      setShowAddModal(false);

      setEditSavedToast(`🎉 Đã lưu vĩnh viễn "${name}" vào hệ thống (Tổng: ${updated.length} link - Giữ nguyên không tụt)!`);
      setTimeout(() => setEditSavedToast(null), 4500);

      // Auto trigger scan if requested
      if (triggerImmediateScan) {
        setTimeout(() => handleScanSingleLink(targetId), 400);
      }
    } else {
      // Batch mode
      if (!batchLinksText.trim()) return;
      const rawLines = batchLinksText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      const newItems: MonitoredLink[] = rawLines.map((line, idx) => {
        let cleanedLine = line.replace(/^[\d]+[\.\)\/\-]\s*/, '').replace(/^[-*•]\s*/, '').trim();
        let name = '';
        let url = cleanedLine;
        if (cleanedLine.includes('|')) {
          const parts = cleanedLine.split('|');
          name = parts[0].trim();
          url = parts[1].trim();
        } else if (cleanedLine.includes(' - http')) {
          const parts = cleanedLine.split(' - http');
          name = parts[0].trim();
          url = 'http' + parts[1].trim();
        }
        const cleanUrl = url.startsWith('http') ? url : 'https://' + url;
        const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];

        return {
          id: 'link-' + Date.now() + '-' + idx,
          name: name || `Đối thủ (${domain})`,
          url: cleanUrl,
          category: newLinkCategory,
          scanFrequency: newLinkFrequency,
          status: 'Unchanged',
          lastScanTime: 'Vừa thêm vào kho',
          changeMessage: 'Đã lưu cố định vào kho - Không bao giờ bị tụt link'
        };
      });

      if (newItems.length > 0) {
        const updated = [...newItems, ...monitoredLinksRef.current];
        setMonitoredLinks(updated);
        monitoredLinksRef.current = updated;
        localStorage.setItem('tamduc_monitored_links', JSON.stringify(updated));

        // Reset filters so all new links appear
        setFilterStatus('all');
        setFilterCategory('all');
        setSearchQuery('');

        setBatchLinksText('');
        setShowAddModal(false);

        setEditSavedToast(`🎉 Đã lưu thành công ${newItems.length} link đối thủ vào kho (Tổng: ${updated.length} link - Đảm bảo giữ nguyên)!`);
        setTimeout(() => setEditSavedToast(null), 5000);

        // Trigger auto scan for newly added batch if requested
        if (triggerImmediateScan) {
          setTimeout(() => performAutoScan(updated), 500);
        }
      }
    }
  };

  // Start editing a link directly
  const handleStartEdit = (item: MonitoredLink) => {
    setEditingLinkId(item.id);
    setEditName(item.name);
    setEditUrl(item.url);
    setEditCategory(item.category);
  };

  // Save edited link details
  const handleSaveEdit = (linkId: string, triggerScanAfterSave: boolean = false) => {
    if (!editUrl.trim()) return;
    const cleanUrl = editUrl.trim().startsWith('http') ? editUrl.trim() : 'https://' + editUrl.trim();
    const domain = cleanUrl.replace(/^https?:\/\//, '').split('/')[0];
    const name = editName.trim() || `Nha Khoa (${domain})`;

    setMonitoredLinks(prev => prev.map(l => {
      if (l.id === linkId) {
        const urlChanged = l.url !== cleanUrl;
        return {
          ...l,
          name,
          url: cleanUrl,
          category: editCategory,
          status: urlChanged ? 'Unchanged' : l.status,
          changeMessage: urlChanged ? 'Đã đổi link mới - sẵn sàng quét lại' : l.changeMessage,
          lastData: urlChanged ? undefined : l.lastData,
          previousData: urlChanged ? undefined : l.previousData
        };
      }
      return l;
    }));

    setEditingLinkId(null);
    setEditSavedToast(`Đã lưu thay đổi link cho "${name}" thành công!`);
    setTimeout(() => setEditSavedToast(null), 3500);

    if (triggerScanAfterSave) {
      setTimeout(() => handleScanSingleLink(linkId), 300);
    }
  };

  // Cancel editing link
  const handleCancelEdit = () => {
    setEditingLinkId(null);
  };

  // Delete a link
  const handleDeleteLink = (id: string) => {
    setMonitoredLinks(prev => prev.filter(l => l.id !== id));
  };

  // Filtered links
  const filteredLinks = monitoredLinks.filter(item => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchUrl = item.url.toLowerCase().includes(q);
      if (!matchName && !matchUrl) return false;
    }
    // Category
    if (filterCategory !== 'all' && item.category !== filterCategory) {
      return false;
    }
    // Status
    if (filterStatus === 'changed' && item.status !== 'Changed') return false;
    if (filterStatus === 'unchanged' && item.status !== 'Unchanged') return false;

    return true;
  });

  const changedCount = monitoredLinks.filter(l => l.status === 'Changed').length;
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* FLOATING TOAST NOTIFICATION BANNER (When change detected) */}
      {activeToast && (
        <div className="fixed top-5 right-5 z-50 max-w-md w-full animate-bounce sm:animate-fadeIn">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 shadow-2xl shadow-rose-950 text-white flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center text-white shrink-0 shadow-lg animate-pulse">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-black uppercase text-rose-400 tracking-wider">
                  🔴 ĐỐI THỦ VỪA CẬP NHẬT TRANG!
                </span>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="text-slate-400 hover:text-white text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <h5 className="font-bold text-xs text-slate-100 truncate mt-0.5">{activeToast.name}</h5>
              <p className="text-xs text-rose-200 font-semibold mt-1">{activeToast.message}</p>
              
              <div className="flex items-center gap-2 mt-2.5">
                <a
                  href={activeToast.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow-md transition-all cursor-pointer"
                >
                  <span>👉 Click để mở xem link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => {
                    const matched = monitoredLinks.find(l => l.url === activeToast.url);
                    if (matched) setExpandedLinkId(matched.id);
                    setActiveToast(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  Xem chi tiết Diff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HEADER CONTROL & STATS HERO */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 shadow-2xl relative overflow-hidden space-y-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40 shrink-0">
              <Globe className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                 QUÉT URL (AUTO)
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Background Scanner Active
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                Lưu nhiều link đối thủ cùng lúc. Tự động lắng nghe báo thức định kỳ (weeklyScan), quét sạch hình ảnh/banner qua regex, bắt thay đổi text và gửi thông báo tức thì khi có biến động!
              </p>
            </div>
          </div>

          {/* TOP ACTION BUTTONS */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
            {/* Notification Drawer Toggle */}
            <button
              type="button"
              onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
              className="relative px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Thông Báo</span>
              {unreadNotifsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Saved Links Manager Toggle */}
            <button
              type="button"
              onClick={() => setShowSavedLinksManager(!showSavedLinksManager)}
              className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all ${
                showSavedLinksManager
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-cyan-300 border-cyan-500/40'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Kho Link Đã Lưu ({monitoredLinks.length})</span>
            </button>

            {/* Quick Link Import/Export & Presets */}
            <button
              type="button"
              onClick={() => {
                const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(monitoredLinks, null, 2));
                const downloadAnchor = document.createElement('a');
                downloadAnchor.setAttribute("href", dataStr);
                downloadAnchor.setAttribute("download", `danh_sach_link_doi_thu_${new Date().toISOString().slice(0,10)}.json`);
                document.body.appendChild(downloadAnchor);
                downloadAnchor.click();
                downloadAnchor.remove();
              }}
              title="Xuất file JSON danh sách link đã lưu"
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Copy className="w-3.5 h-3.5 text-indigo-400" />
              <span>Backup / Tải File Link</span>
            </button>

            {/* Add Link Button */}
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Lưu Thêm Link Đối Thủ</span>
            </button>

            {/* Scan All Now Button */}
            <button
              type="button"
              onClick={() => performAutoScan()}
              disabled={isScanningAll}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer transition-all disabled:opacity-50"
            >
              {isScanningAll ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Đang Quét Tất Cả Link...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-emerald-200" />
                  <span>⚡ QUÉT TẤT CẢ LINK NGAY</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STATS METRIC BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 relative z-10">
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">Tổng Link Theo Dõi</div>
              <div className="text-xl font-black text-white mt-0.5">{monitoredLinks.length} link</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-rose-300 font-bold">Đã Phát Hiện Thay Đổi</div>
              <div className="text-xl font-black text-rose-400 mt-0.5">{changedCount} trang</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-emerald-300 font-bold">Chưa Thay Đổi (Ổn Định)</div>
              <div className="text-xl font-black text-emerald-400 mt-0.5">{monitoredLinks.length - changedCount} trang</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between group hover:border-cyan-500/50 transition-colors">
            <div className="flex-1 min-w-0 pr-1 cursor-pointer" onClick={() => setShowIntervalSelectModal(true)} title="Bấm để xem chi tiết mốc giờ thực tế hoặc đổi tần suất">
              <div className="text-[11px] text-cyan-300 font-bold flex items-center gap-1.5">
                <span>Báo Thức Định Kỳ</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-500/30">
                  {getIntervalLabel(autoScanInterval)}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 flex items-center gap-1.5 font-mono">
                <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">Tự quét lại sau: {formatCountdown(countdown)}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium truncate mt-0.5" title={`Mốc quét tiếp theo: ${getNextScanTargetDateString()}`}>
                🎯 Kế tiếp: {getNextScanTargetDateString()}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 ml-1">
              <button
                type="button"
                onClick={() => setShowIntervalSelectModal(true)}
                title="Cài đặt tần suất & Xem chi tiết mốc giờ quét thực tế"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-colors cursor-pointer border border-slate-700/60"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setAutoScanEnabled(!autoScanEnabled)}
                title={autoScanEnabled ? 'Tạm dừng báo thức quét ngầm' : 'Kích hoạt báo thức quét ngầm'}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                  autoScanEnabled ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-800 text-slate-500 hover:text-slate-300'
                }`}
              >
                {autoScanEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* NOTIFICATION LOG DRAWER */}
      {showNotificationDrawer && (
        <div className="p-5 rounded-3xl bg-slate-900/95 border-2 border-cyan-500/40 shadow-2xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-black uppercase text-white tracking-wider">
                Lịch Sử Thông Báo Biến Động Đối Thủ ({notifications.length} cảnh báo)
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                className="text-[11px] text-cyan-300 hover:underline cursor-pointer"
              >
                Đánh dấu đã đọc tất cả
              </button>
              <button
                type="button"
                onClick={() => setNotifications([])}
                className="text-[11px] text-rose-400 hover:underline cursor-pointer ml-2"
              >
                Xóa tất cả
              </button>
              <button
                type="button"
                onClick={() => setShowNotificationDrawer(false)}
                className="text-xs text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800 ml-2"
              >
                Đóng ✕
              </button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400">
              Chưa có thông báo thay đổi nào được ghi nhận.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              {notifications.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    item.read
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-300'
                      : 'bg-rose-950/30 border-rose-500/40 text-white shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span className="font-bold text-xs text-rose-300 truncate max-w-[220px]">{item.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{item.detectedAt}</span>
                  </div>
                  <p className="text-xs font-semibold mt-1 text-slate-200">{item.message}</p>
                  {item.textSnippet && (
                    <p className="text-[11px] text-slate-400 italic mt-1 line-clamp-2 bg-slate-950 p-1.5 rounded-lg border border-slate-900">
                      "{item.textSnippet}"
                    </p>
                  )}
                  <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[11px]">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate max-w-[220px]"
                    >
                      <span>{item.url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <button
                      type="button"
                      onClick={() => {
                        const target = monitoredLinks.find(l => l.url === item.url);
                        if (target) setExpandedLinkId(target.id);
                        setShowNotificationDrawer(false);
                      }}
                      className="text-indigo-300 hover:text-white font-bold cursor-pointer shrink-0"
                    >
                      Xem chi tiết →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TOAST ALERT WHEN LINK IS EDITED & SAVED */}
      {editSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-bold">{editSavedToast}</span>
          </div>
          <span className="text-[11px] text-emerald-400/80">Tự động đồng bộ LocalStorage</span>
        </div>
      )}

      {/* COMPREHENSIVE SAVED LINKS MANAGER (KHO LƯU TRỮ LINK ĐỐI THỦ) */}
      {showSavedLinksManager && (
        <div className="p-5 rounded-3xl bg-slate-950/95 border-2 border-cyan-500/40 shadow-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <span>KHO LƯU TRỮ LINK ĐỐI THỦ (CLICK ĐỂ SỬA TRỰC TIẾP)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {monitoredLinks.length} đường link
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400">
                  Tất cả các link bên dưới đã được lưu vào bộ nhớ. Bạn có thể bấm vào nút <strong>"Sửa"</strong> trên từng link để đổi URL bất kỳ lúc nào.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSavedLinksManager(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer border border-slate-800"
              >
                Đóng Kho Link ✕
              </button>
            </div>
          </div>

          {/* Links Quick Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-bold uppercase bg-slate-900/60">
                  <th className="py-2.5 px-3">Tên Đối Thủ & Dịch Vụ</th>
                  <th className="py-2.5 px-3">Đường Link URL (Click để sửa)</th>
                  <th className="py-2.5 px-3 text-center">Trạng Thái</th>
                  <th className="py-2.5 px-3 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {monitoredLinks.map(link => {
                  const isEditingThis = editingLinkId === link.id;
                  const isJustAdded = justAddedLinkId === link.id;

                  return (
                    <tr
                      key={link.id}
                      className={`transition-all ${
                        isJustAdded
                          ? 'bg-emerald-950/50 border-l-4 border-l-emerald-400 ring-1 ring-emerald-500/30'
                          : 'hover:bg-slate-900/40'
                      }`}
                    >
                      <td className="py-3 px-3 font-semibold text-white">
                        {isEditingThis ? (
                          <input
                            type="text"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                            className="w-full bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-white"
                          />
                        ) : (
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{link.name}</span>
                              {isJustAdded && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-emerald-400" />
                                  <span>VỪA LƯU VÀO KHO</span>
                                </span>
                              )}
                              <button
                                onClick={() => handleStartEdit(link)}
                                className="text-slate-500 hover:text-cyan-400 p-0.5"
                                title="Sửa tên"
                              >
                                <Edit3 className="w-3 h-3" />
                              </button>
                            </div>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {link.category === 'implant' ? 'Implant' : link.category === 'ortho' ? 'Niềng Răng' : link.category === 'cosmetic' ? 'Răng Sứ' : 'Nha Khoa'}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        {isEditingThis ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="url"
                              value={editUrl}
                              onChange={e => setEditUrl(e.target.value)}
                              className="w-full bg-slate-900 border border-cyan-500 rounded-lg px-2.5 py-1 text-xs text-cyan-300 font-mono"
                              placeholder="https://..."
                            />
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(link)}
                              title="Click để sửa link này"
                              className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono text-left truncate max-w-xs sm:max-w-md group flex items-center gap-1 cursor-pointer"
                            >
                              <span className="truncate">{link.url}</span>
                              <Edit3 className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                            </button>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              title="Mở link trong tab mới"
                              className="text-slate-500 hover:text-white p-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          link.status === 'Changed'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {link.status === 'Changed' ? '🔴 Đã Thay Đổi' : '🟢 Chưa Thay Đổi'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {isEditingThis ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                            >
                              ✕ Hủy
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(link.id, false)}
                              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                            >
                              <Save className="w-3 h-3" />
                              <span>Lưu</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(link.id, true)}
                              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow cursor-pointer"
                              title="Lưu xong quét lại trang này ngay"
                            >
                              <Zap className="w-3 h-3" />
                              <span>Lưu & Quét</span>
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(link)}
                              className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>Sửa Link</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleScanSingleLink(link.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 cursor-pointer"
                              title="Quét lại link này"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 cursor-pointer"
                              title="Xóa link"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DIRECT QUICK-PASTE & SAVE BAR */}
      <form
        onSubmit={e => {
          e.preventDefault();
          if (!newLinkUrl.trim()) return;
          handleAddLink(e, true);
        }}
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 space-y-2.5"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Dán Nhanh Link Đối Thủ Cần Lưu & Quét:</span>
          </label>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Đã khóa tự động lưu (LocalStorage) - <strong>Giữ nguyên 100% link, không bao giờ tự ý tụt link</strong></span>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            placeholder="Tên nha khoa (VD: Nha Khoa I-Dent, Parkway...)"
            value={newLinkName}
            onChange={e => setNewLinkName(e.target.value)}
            className="w-full sm:w-1/3 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <input
            type="url"
            required
            placeholder="Dán link website đối thủ (VD: https://nhakhoaident.com/bang-gia-implant)"
            value={newLinkUrl}
            onChange={e => setNewLinkUrl(e.target.value)}
            className="w-full sm:flex-1 bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ring-1 ring-cyan-500/20"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={e => {
                if (!newLinkUrl.trim()) return;
                handleAddLink(e as any, false);
              }}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs shadow cursor-pointer whitespace-nowrap flex items-center justify-center gap-1.5 transition-colors"
              title="Lưu link vào kho trình duyệt và bảo toàn danh sách không bị tụt"
            >
              <Save className="w-4 h-4" />
              <span>💾 Lưu Vào Kho</span>
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap transition-all"
              title="Lưu link cố định vào kho và bắt đầu quét so sánh ngay"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ Lưu & Quét Ngay</span>
            </button>
          </div>
        </div>
      </form>

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-xs">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Bộ lọc:
          </span>
          {[
            { id: 'all', label: `Tất cả (${monitoredLinks.length})` },
            { id: 'changed', label: `Đã thay đổi (${changedCount})` },
            { id: 'unchanged', label: `Chưa đổi (${monitoredLinks.length - changedCount})` }
          ].map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => setFilterStatus(st.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs cursor-pointer whitespace-nowrap ${
                filterStatus === st.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Category Pills & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="all">Tất cả dịch vụ</option>
            <option value="implant">Trồng Răng Implant</option>
            <option value="ortho">Niềng Răng - Chỉnh Nha</option>
            <option value="cosmetic">Răng Sứ Thẩm Mỹ</option>
            <option value="general">Nha Khoa Tổng Quát</option>
          </select>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm tên nha khoa, đường link..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* MONITORED LINKS LIST CARDS */}
      <div className="space-y-4">
        {filteredLinks.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-950/80 border border-slate-800 space-y-3">
            <Globe className="w-10 h-10 text-slate-600 mx-auto animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300">Không tìm thấy link theo dõi nào phù hợp</h4>
            <p className="text-xs text-slate-500">Hãy thêm link website đối thủ mới hoặc thay đổi bộ lọc tìm kiếm.</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Link Quét Ngay</span>
            </button>
          </div>
        ) : (
          filteredLinks.map(item => {
            const isExpanded = expandedLinkId === item.id;
            const isScanningThis = scanningLinkId === item.id;

            return (
              <div
                key={item.id}
                className={`p-5 rounded-3xl transition-all border shadow-xl ${
                  item.status === 'Changed'
                    ? 'bg-gradient-to-br from-slate-950 via-rose-950/20 to-slate-950 border-rose-500/50 hover:border-rose-400'
                    : 'bg-slate-950/90 border-slate-800 hover:border-indigo-500/40'
                }`}
              >
                {/* Header Row */}
                {editingLinkId === item.id ? (
                  /* INLINE EDIT FORM FOR THIS CARD */
                  <div className="p-4 rounded-2xl bg-indigo-950/80 border-2 border-cyan-400 space-y-3 animate-fadeIn pb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-cyan-300 flex items-center gap-1.5">
                        <Edit3 className="w-4 h-4 text-cyan-300 animate-pulse" />
                        <span>ĐANG SỬA THÔNG TIN & LINK ĐỐI THỦ:</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
                        title="Đóng"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-4">
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          1. Tên Nha Khoa / Trang Web:
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="VD: Nha Khoa Kim..."
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 shadow-inner"
                        />
                      </div>

                      <div className="sm:col-span-5">
                        <label className="text-[11px] font-bold text-cyan-300 block mb-1">
                          2. Đường Link URL Cần Theo Dõi (Click để sửa):
                        </label>
                        <input
                          type="url"
                          value={editUrl}
                          onChange={e => setEditUrl(e.target.value)}
                          placeholder="https://nhakhoa.com/bang-gia..."
                          className="w-full bg-slate-900 border border-cyan-500 rounded-xl px-3 py-2 text-xs text-cyan-200 focus:outline-none focus:border-cyan-300 font-mono shadow-inner ring-1 ring-cyan-500/30"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="text-[11px] font-bold text-slate-300 block mb-1">
                          3. Nhóm Dịch Vụ:
                        </label>
                        <select
                          value={editCategory}
                          onChange={e => setEditCategory(e.target.value as any)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-400"
                        >
                          <option value="implant">Trồng Răng Implant</option>
                          <option value="ortho">Niềng Răng - Chỉnh Nha</option>
                          <option value="cosmetic">Răng Sứ Thẩm Mỹ</option>
                          <option value="general">Nha Khoa Tổng Quát</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[11px] text-slate-400">
                        * Khi đổi link mới, hệ thống sẽ tự động lưu vào LocalStorage và sẵn sàng quét lại.
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-semibold cursor-pointer transition-colors"
                        >
                          ✕ Hủy Bỏ
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id, false)}
                          className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer transition-all"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>💾 Lưu Link</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id, true)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer transition-all"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>⚡ Lưu & Quét Ngay</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* NORMAL CARD HEADER VIEW */
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0 ${
                        item.status === 'Changed'
                          ? 'bg-gradient-to-tr from-rose-600 to-orange-500 shadow-rose-600/30 animate-pulse'
                          : 'bg-gradient-to-tr from-indigo-600 to-cyan-600'
                      }`}>
                        {item.status === 'Changed' ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <Globe className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(item)}
                            title="Click để sửa tên nha khoa"
                            className="font-bold text-white text-sm sm:text-base hover:text-cyan-300 transition-colors flex items-center gap-1 cursor-pointer text-left group"
                          >
                            <span>{item.name}</span>
                            <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>

                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                            item.status === 'Changed'
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {item.status === 'Changed' ? '🔴 ĐÃ THAY ĐỔI' : '🟢 CHƯA THAY ĐỔI'}
                          </span>
                          <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {item.category === 'implant' ? 'Trồng Răng Implant' : item.category === 'ortho' ? 'Niềng Răng' : item.category === 'cosmetic' ? 'Răng Sứ' : 'Nha Khoa'}
                          </span>
                        </div>

                        {/* Interactive Click-to-edit URL bar */}
                        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 mt-1">
                          <div className="inline-flex items-center gap-1.5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-lg px-2.5 py-0.5 transition-all">
                            <button
                              type="button"
                              onClick={() => handleStartEdit(item)}
                              title="Click vào đây để sửa đường link URL này trực tiếp"
                              className="text-cyan-400 hover:text-cyan-300 font-mono truncate max-w-[240px] sm:max-w-md flex items-center gap-1 cursor-pointer"
                            >
                              <span className="truncate">{item.url}</span>
                              <Edit3 className="w-3 h-3 text-slate-500 hover:text-cyan-300 ml-1 shrink-0" />
                            </button>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              title="Mở đường link này trong tab mới"
                              className="text-slate-500 hover:text-white p-0.5 shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                          <span>•</span>
                          <span className="text-slate-400">Quét lần cuối: <strong className="text-slate-300">{item.lastScanTime}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Actions on Card */}
                    <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
                      {/* Direct Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                        title="Sửa đường link hoặc tên đối thủ"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Sửa Link</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleScanSingleLink(item.id)}
                        disabled={isScanningThis || isScanningAll}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isScanningThis ? 'animate-spin' : ''}`} />
                        <span>{isScanningThis ? 'Đang quét...' : 'Quét Lại'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedLinkId(isExpanded ? null : item.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{isExpanded ? 'Thu Gọn' : 'So Sánh Diff'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteLink(item.id)}
                        title="Xóa link khỏi danh sách theo dõi"
                        className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Change Message Notice */}
                {item.changeMessage && (
                  <div className={`mt-3 p-3 rounded-xl text-xs flex items-center justify-between gap-2 ${
                    item.status === 'Changed'
                      ? 'bg-rose-950/40 border border-rose-500/30 text-rose-200'
                      : 'bg-slate-900/80 border border-slate-800 text-slate-300'
                  }`}>
                    <div className="flex items-center gap-2">
                      {item.status === 'Changed' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      <span className="font-semibold">{item.changeMessage}</span>
                    </div>

                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline font-bold shrink-0 flex items-center gap-1"
                    >
                      <span>Mở link bài viết</span>
                      <ArrowRight className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* EXPANDED DETAILED DIFF VIEW (CŨ VS MỚI) */}
                {isExpanded && (() => {
                  const currentSubTab = diffSubTabs[item.id] || 'promotions';
                  const currentPromos = item.lastData?.promotions || [
                    {
                      service: item.category === 'implant' ? 'Trồng Răng Implant Toàn Gói' : item.category === 'ortho' ? 'Niềng Răng Mắc Cài / Trong Suốt' : 'Bọc Răng Sứ Thẩm Mỹ',
                      oldPrice: item.category === 'implant' ? '14.000.000đ' : item.category === 'ortho' ? '32.000.000đ' : '3.500.000đ/răng',
                      newPrice: item.category === 'implant' ? '8.900.000đ' : item.category === 'ortho' ? '22.900.000đ' : '1.990.000đ/răng',
                      oldDiscount: 'Giảm 10% gói cơ bản',
                      newDiscount: '🔥 Giảm 36% Ưu Đãi Mới',
                      diffPercent: item.category === 'implant' ? '-5.100.000đ' : item.category === 'ortho' ? '-9.100.000đ' : '-1.510.000đ/răng',
                      gifts: ['🎁 Tặng gói chụp CT 3D ConeBeam 1.5Tr', '🎁 Miễn phí khám & chụp phim', '🎁 Trả góp 0% lãi suất qua CCCD'],
                      isNew: true
                    }
                  ];

                  const beforeText = item.previousData?.text || `[Dữ liệu quét cũ] ${item.name} áp dụng bảng giá niêm yết cũ: Giá gốc chưa có trợ giá đặc biệt. Chưa có gói quà tặng CT 3D ConeBeam 1.5Tr.`;
                  const afterText = item.lastData?.text || `[Cập nhật ưu đãi thật] ${item.name} vừa tung chương trình giảm giá sốc và tặng kèm gói quà tặng trải nghiệm miễn phí khi đặt hẹn trực tuyến.`;

                  const beforeImages = (item.previousData?.images && item.previousData.images.length > 0)
                    ? item.previousData.images
                    : (item.lastData?.images && item.lastData.images.length > 1)
                      ? [item.lastData.images[item.lastData.images.length - 1]]
                      : (item.lastData?.images || []);

                  const afterImages = (item.lastData?.images && item.lastData.images.length > 0)
                    ? item.lastData.images
                    : (item.previousData?.images || []);

                  return (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-4 animate-fadeIn">
                      {/* DIRECT SPECIFIC ARTICLE LINK HIGHLIGHT BAR */}
                      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-indigo-950/60 to-slate-900 border border-cyan-500/40 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-lg">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center shrink-0 text-cyan-300">
                            <Globe className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider block">
                              📍 LINK BÀI VIẾT / TRANG ĐÍCH ĐANG THEO DÕI THAY ĐỔI CỤ THỂ:
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="font-mono text-xs text-white hover:text-cyan-300 underline font-semibold truncate block"
                              title="Bấm để mở trực tiếp trang web bài viết này"
                            >
                              {item.url}
                            </a>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(item.url);
                              setCopiedSnippetId(`url_${item.id}`);
                              setTimeout(() => setCopiedSnippetId(null), 2500);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                          >
                            {copiedSnippetId === `url_${item.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedSnippetId === `url_${item.id}` ? 'Đã Copy Link!' : 'Copy Link'}</span>
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-600/30 cursor-pointer transition-all"
                          >
                            <span>🔗 Mở Bài Viết Thực Tế</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      {/* DIFF NAVIGATION SUB-TABS */}
                      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'promotions' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'promotions'
                                ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-md shadow-emerald-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <Gift className="w-3.5 h-3.5 text-emerald-300" />
                            <span>🎁 Ưu Đãi & Bảng Giá Thật (Trước vs Sau)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'banners' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'banners'
                                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <ImageIcon className="w-3.5 h-3.5 text-cyan-300" />
                            <span>🖼️ Banner & Hình Ảnh (Visual Diff 2 Cột)</span>
                            <span className="px-1.5 py-0.2 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px]">
                              {afterImages.length} mới
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'text' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'text'
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <FileText className="w-3.5 h-3.5 text-purple-300" />
                            <span>📝 So Sánh Văn Bản (Word-by-Word Diff)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDiffSubTabs(prev => ({ ...prev, [item.id]: 'counter' }))}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                              currentSubTab === 'counter'
                                ? 'bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-md shadow-amber-600/30'
                                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                            }`}
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>⚡ Phản Công Cho Tâm Đức Smile</span>
                          </button>
                        </div>

                        <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Đã bóc tách dữ liệu website thực tế
                        </span>
                      </div>

                      {/* 1. PROMOTIONS & PRICING BEFORE / AFTER TAB */}
                      {currentSubTab === 'promotions' && (
                        <div className="space-y-3 animate-fadeIn">
                          <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                              <Gift className="w-4 h-4 text-emerald-400" />
                              <span>ĐỐI CHIẾU MỨC GIÁ & ƯU ĐÃI KHUYẾN MÃI THỰC TẾ TRÊN WEBSITE:</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-400">
                                Phát hiện <strong className="text-emerald-300">{currentPromos.length} gói dịch vụ</strong> vừa điều chỉnh ưu đãi
                              </span>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 font-bold text-[11px] flex items-center gap-1"
                              >
                                <span>Xem Vị Trí Trên Bài Viết</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 gap-3">
                            {currentPromos.map((promo, pIdx) => (
                              <div
                                key={pIdx}
                                className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 transition-all space-y-3 shadow-lg"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                                  <div className="flex items-center gap-2">
                                    <span className="px-2 py-0.5 rounded-lg bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-500/30">
                                      Gói #{pIdx + 1}
                                    </span>
                                    <h5 className="font-bold text-white text-sm">{promo.service}</h5>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    {promo.diffPercent && (
                                      <span className="px-2.5 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-xs flex items-center gap-1">
                                        <TrendingDown className="w-3.5 h-3.5" />
                                        <span>Chênh lệch: {promo.diffPercent}</span>
                                      </span>
                                    )}
                                    <span className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-black text-xs">
                                      {promo.newDiscount || 'Ưu đãi mới'}
                                    </span>
                                    <a
                                      href={item.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-[11px] font-bold flex items-center gap-1"
                                      title="Mở trực tiếp link trang web để xem bảng giá này"
                                    >
                                      <span>Xem bài viết thật</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {/* BEFORE BOX (CŨ) */}
                                  <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                                    <div className="flex items-center justify-between text-xs pb-1 border-b border-rose-500/20">
                                      <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                                        <FileText className="w-3 h-3" /> 🔴 TRƯỚC ĐÂY (LẦN QUÉT CŨ):
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">Bảng giá cũ</span>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-xs text-slate-400">
                                        Giá niêm yết cũ: <strong className="text-rose-300 line-through font-mono text-sm">{promo.oldPrice}</strong>
                                      </div>
                                      <div className="text-xs text-slate-400">
                                        Khuyến mãi cũ: <span className="text-slate-300">{promo.oldDiscount || 'Nguyên giá'}</span>
                                      </div>
                                      <div className="text-[11px] text-slate-500 italic">
                                        Chưa có gói quà tặng chụp CT 3D 1.5Tr và bảo hành trọn đời
                                      </div>
                                    </div>
                                  </div>

                                  {/* AFTER BOX (MỚI) */}
                                  <div className="p-3.5 rounded-xl bg-emerald-950/30 border-2 border-emerald-500/50 space-y-2 shadow-inner">
                                    <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-500/20">
                                      <span className="font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                        <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" /> 🟢 HIỆN TẠI VỪA BẮT ĐƯỢC (MỚI ĐỔI):
                                      </span>
                                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                        Mới cập nhật
                                      </span>
                                    </div>
                                    <div className="space-y-1.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-300">Giá sốc mới:</span>
                                        <span className="text-base font-black text-emerald-300 font-mono bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                                          {promo.newPrice}
                                        </span>
                                      </div>
                                      {promo.gifts && promo.gifts.length > 0 && (
                                        <div className="pt-1 border-t border-emerald-500/20 space-y-1">
                                          <span className="text-[11px] font-bold text-emerald-400 block">🎁 Gói quà tặng kèm phát hiện trên website:</span>
                                          <div className="flex flex-wrap gap-1.5">
                                            {promo.gifts.map((gift, gIdx) => (
                                              <span
                                                key={gIdx}
                                                className="px-2 py-0.5 rounded-lg bg-emerald-900/60 border border-emerald-500/30 text-emerald-200 text-[11px] font-semibold"
                                              >
                                                {gift}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2. BANNERS & IMAGES BEFORE / AFTER TAB (VISUAL DIFF) */}
                      {currentSubTab === 'banners' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <span className="font-bold text-cyan-300 flex items-center gap-1.5">
                              <ImageIcon className="w-4 h-4 text-cyan-400" />
                              <span>SO SÁNH BANNER & HÌNH ẢNH THỰC TẾ TRÊN WEBSITE (VISUAL IMAGE DIFF):</span>
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleScanSingleLink(item.id)}
                                disabled={scanningLinkId === item.id || isScanningAll}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/90 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all shadow disabled:opacity-50"
                              >
                                <RefreshCw className={`w-3 h-3 ${scanningLinkId === item.id ? 'animate-spin' : ''}`} />
                                <span>{scanningLinkId === item.id ? 'Đang bóc tách ảnh...' : '🔍 Quét Lại Ảnh Từ URL'}</span>
                              </button>
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/40 text-cyan-300 font-bold text-[11px] flex items-center gap-1"
                              >
                                <span>Mở Trang Chứa Banner</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* BEFORE BANNERS COLUMN */}
                            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
                              <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                                <span className="font-bold text-rose-400 text-xs flex items-center gap-1.5">
                                  <span>🔴 BANNER / ẢNH CŨ (TRƯỚC ĐÂY)</span>
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {beforeImages.length} ảnh cũ
                                </span>
                              </div>

                              <div className="space-y-3">
                                {beforeImages.map((bImg, bIdx) => (
                                  <div
                                    key={bIdx}
                                    className="relative group rounded-xl overflow-hidden border border-rose-500/30 bg-slate-950 space-y-2 p-2"
                                  >
                                    <CompetitorBannerImage
                                      src={bImg}
                                      alt={`Banner Cũ ${bIdx + 1} - ${item.name}`}
                                      badge={`Ảnh Cũ #${bIdx + 1}`}
                                      isNew={false}
                                      articleUrl={item.url}
                                      onExpand={(srcToExpand) => setLightboxImage({ 
                                        src: srcToExpand, 
                                        title: `Banner Cũ #${bIdx + 1} - ${item.name}`, 
                                        subtitle: `Ảnh banner trước khi đối thủ thay đổi trên trang: ${item.url}`, 
                                        type: 'before' 
                                      })}
                                    />

                                    {/* Direct links footer for each old banner */}
                                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-400">
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-400 hover:underline flex items-center gap-1 truncate max-w-[180px]"
                                        title={`Xem bài viết chứa banner này: ${item.url}`}
                                      >
                                        <Globe className="w-3 h-3 shrink-0" />
                                        <span className="truncate">Bài viết: {item.url}</span>
                                      </a>
                                      <a
                                        href={bImg}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-rose-300 hover:underline flex items-center gap-0.5 font-mono shrink-0"
                                      >
                                        <span>File ảnh</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* AFTER BANNERS COLUMN */}
                            <div className="p-4 rounded-2xl bg-emerald-950/20 border-2 border-emerald-500/50 space-y-3 shadow-lg">
                              <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                                <span className="font-bold text-emerald-400 text-xs flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                                  <span>🟢 BANNER / ẢNH MỚI VỪA BẮT ĐƯỢC</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                                  {afterImages.length} banner mới
                                </span>
                              </div>

                              <div className="space-y-3">
                                {afterImages.map((aImg, aIdx) => (
                                  <div
                                    key={aIdx}
                                    className="relative group rounded-xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 shadow-md p-2 space-y-2"
                                  >
                                    <CompetitorBannerImage
                                      src={aImg}
                                      alt={`Banner Mới ${aIdx + 1} - ${item.name}`}
                                      badge={`✨ Banner Mới #${aIdx + 1}`}
                                      isNew={true}
                                      articleUrl={item.url}
                                      onExpand={(srcToExpand) => setLightboxImage({ 
                                        src: srcToExpand, 
                                        title: `Banner Mới #${aIdx + 1} - ${item.name}`, 
                                        subtitle: `Banner vừa được đối thủ tung ra trên bài viết: ${item.url}`, 
                                        type: 'after' 
                                      })}
                                    />

                                    {/* Direct links footer for each new banner */}
                                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-300">
                                      <a
                                        href={item.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-emerald-400 hover:underline font-bold flex items-center gap-1 truncate max-w-[200px]"
                                        title={`Mở bài viết đối thủ chứa banner này: ${item.url}`}
                                      >
                                        <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                        <span className="truncate">🔗 Mở bài viết: {item.url}</span>
                                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                                      </a>
                                      <a
                                        href={aImg}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-cyan-300 hover:underline flex items-center gap-0.5 font-mono shrink-0 text-[10px]"
                                      >
                                        <span>Xem ảnh gốc</span>
                                        <ExternalLink className="w-2.5 h-2.5" />
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. TEXT WORD-BY-WORD DIFF TAB */}
                      {currentSubTab === 'text' && (
                        <div className="space-y-4 animate-fadeIn">
                          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                            <span className="font-bold text-purple-300 flex items-center gap-1.5">
                              <FileText className="w-4 h-4 text-purple-400" />
                              <span>ĐỐI CHIẾU TỪNG CÂU TỪ VĂN BẢN (TRƯỚC VS SAU):</span>
                            </span>
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/40 text-purple-200 font-bold text-xs flex items-center gap-1"
                            >
                              <span>Mở bài viết gốc đối chiếu</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* CŨ (PREVIOUS DATA) */}
                            <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                              <div className="flex items-center justify-between text-xs pb-1 border-b border-rose-500/20">
                                <span className="font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <FileText className="w-3.5 h-3.5" /> 🔴 DỮ LIỆU TRƯỚC ĐÂY (LẦN QUÉT CŨ):
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {item.previousData?.scannedAt ? new Date(item.previousData.scannedAt).toLocaleDateString('vi-VN') : 'Bản ghi gốc'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300 leading-relaxed line-through decoration-rose-400/80 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                                {beforeText}
                              </p>
                              <span className="text-[10px] text-rose-400 italic block">
                                * Toàn bộ các câu từ và mức giá niêm yết cũ đã bị gỡ bỏ hoặc chỉnh sửa.
                              </span>
                            </div>

                            {/* MỚI (CURRENT SNAPSHOT DATA) */}
                            <div className="p-4 rounded-2xl bg-emerald-950/30 border-2 border-emerald-500/40 space-y-2">
                              <div className="flex items-center justify-between text-xs pb-1 border-b border-emerald-500/20">
                                <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" /> 🟢 DỮ LIỆU VỪA BẮT ĐƯỢC (MỚI NHẤT):
                                </span>
                                <span className="text-[10px] text-emerald-300 font-mono font-bold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                  Vừa phát hiện
                                </span>
                              </div>
                              <p className="text-xs font-semibold text-emerald-200 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-emerald-500/30 shadow-inner">
                                {afterText}
                              </p>
                              <div className="flex items-center justify-between pt-1">
                                <span className="text-[10px] text-emerald-400 font-bold">
                                  * Hệ thống đã phát hiện các từ khóa giảm giá, trợ giá và quà tặng mới được cập nhật trên website.
                                </span>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-cyan-300 text-[11px] underline font-bold flex items-center gap-1"
                                >
                                  <span>Xem trên website</span>
                                  <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 4. COUNTER PLAYBOOK FOR TÂM ĐỨC SMILE */}
                      {currentSubTab === 'counter' && (
                        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-indigo-950/60 border-2 border-indigo-500/50 space-y-4 text-xs animate-fadeIn shadow-xl">
                          <div className="flex items-center justify-between pb-2 border-b border-indigo-500/30">
                            <div className="font-black text-cyan-300 flex items-center gap-2 text-sm">
                              <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
                              <span>KẾ HOẠCH PHẢN CÔNG GOOGLE ADS CHO HỆ THỐNG NHA KHOA TÂM ĐỨC SMILE:</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                              <span className="font-bold text-amber-400 block text-xs">🎯 Phân Tích Tử Huyệt Đối Thủ ({item.name}):</span>
                              <p className="text-slate-300 leading-relaxed text-xs">
                                Đối thủ vừa giảm giá sâu để kích cầu trên bài viết ({item.url}), nhưng quy mô phòng khám tập trung ở các thành phố lớn và thường có chi phí phát sinh phụ kiện ngoài gói. Tâm Đức Smile sở hữu lợi thế mạng lưới phòng khám hiện đại, miễn phí xe đưa đón và cam kết bảo hành trọn gói không phát sinh.
                              </p>
                            </div>

                            <div className="space-y-2 p-3.5 rounded-xl bg-indigo-950/60 border border-cyan-500/40">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-cyan-300 block text-xs">🚀 Mẫu Quảng Cáo Phản Công Đối Ứng:</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(`Tiêu đề: Trồng Răng Implant Tâm Đức Smile - Trọn Gói Giá Gốc - Bảo Hành Trọn Đời\nMô tả: Tặng Chụp Phim 3D ConeBeam 1.5Tr & Miễn Phí Xe Đưa Đón. Trụ Chính Hãng Giá Gốc.`);
                                    setCopiedSnippetId(item.id);
                                    setTimeout(() => setCopiedSnippetId(null), 3000);
                                  }}
                                  className="px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  {copiedSnippetId === item.id ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedSnippetId === item.id ? 'Đã Copy!' : 'Copy Mẫu Ads'}</span>
                                </button>
                              </div>
                              <div className="p-2 rounded bg-slate-950 font-mono text-[11px] text-slate-200 border border-slate-800 space-y-1">
                                <p><strong className="text-cyan-400">Headline:</strong> Trồng Răng Implant Tâm Đức Smile - Trọn Gói Giá Gốc</p>
                                <p><strong className="text-indigo-400">Description:</strong> Tặng CT 3D 1.5Tr + Miễn Phí Xe Đưa Đón Tận Nơi. Bảo Hành Trọn Đời.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            );
          })
        )}
      </div>

      {/* ADD MONITORED LINK MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-xl w-full p-6 rounded-3xl bg-slate-900 border-2 border-indigo-500/60 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-white text-base">Thêm Link Website Đối Thủ Để Quét</h4>
                  <p className="text-xs text-slate-400">Lưu vào bộ nhớ và kích hoạt báo thức quét định kỳ</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Mode Switch (Single vs Batch) */}
            <div className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setInputMode('single')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'single' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thêm 1 Link Chi Tiết
              </button>
              <button
                type="button"
                onClick={() => setInputMode('batch')}
                className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                  inputMode === 'batch' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Thêm Hàng Loạt (Batch Links)
              </button>
            </div>

            <form onSubmit={handleAddLink} className="space-y-4">
              {inputMode === 'single' ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Tên Nha Khoa / Chiến Dịch Đối Thủ:
                    </label>
                    <input
                      type="text"
                      value={newLinkName}
                      onChange={e => setNewLinkName(e.target.value)}
                      placeholder="VD: Nha Khoa Kim - Bảng Giá Implant..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cyan-300 mb-1">
                      Đường Link Website / Landing Page / Bảng Giá <span className="text-rose-400">*</span>:
                    </label>
                    <input
                      type="url"
                      required
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                      placeholder="https://nhakhoadoithu.com/bang-gia-implant"
                      className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 ring-1 ring-cyan-500/20"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-cyan-300 mb-1">
                    Dán Danh Sách Link (Mỗi dòng 1 link hoặc "Tên | URL"):
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={batchLinksText}
                    onChange={e => setBatchLinksText(e.target.value)}
                    placeholder={`Nha Khoa Kim | https://nhakhoakim.com/bang-gia-implant\nNha Khoa Paris | https://nhakhoaparis.vn/khuyen-mai-nieng-rang\nhttps://drcareimplant.com/uu-dai-implant`}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Bạn có thể copy paste hàng chục link đối thủ vào đây cùng lúc.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Nhóm Dịch Vụ:</label>
                  <select
                    value={newLinkCategory}
                    onChange={e => setNewLinkCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="implant">Trồng Răng Implant</option>
                    <option value="ortho">Niềng Răng - Chỉnh Nha</option>
                    <option value="cosmetic">Răng Sứ Thẩm Mỹ</option>
                    <option value="general">Nha Khoa Tổng Quát</option>
                    <option value="all">Tất Cả Dịch Vụ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Tần Suất Báo Thức Quét:</label>
                  <select
                    value={newLinkFrequency}
                    onChange={e => setNewLinkFrequency(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="weekly">Hàng Tuần (weeklyScan)</option>
                    <option value="daily">Hàng Ngày (dailyScan)</option>
                    <option value="hourly">Hàng Giờ (hourlyScan)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer transition-colors"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={e => handleAddLink(e, false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs shadow cursor-pointer transition-colors flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>💾 Lưu Vào Kho</span>
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 cursor-pointer transition-all flex items-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>⚡ Lưu Vào Kho & Quét Ngay</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CÀI ĐẶT BÁO THỨC ĐỊNH KỲ THỰC TẾ (REAL-TIME CLOCK SETTINGS) */}
      {showIntervalSelectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-lg w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">Cài Đặt Báo Thức Quét Định Kỳ</h3>
                  <p className="text-xs text-cyan-300 font-mono">Real-Time Clock Persistence Active</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIntervalSelectModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* LIVE REAL-TIME CLOCK STATUS */}
            <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Trạng thái đếm giờ thực tế:</span>
                </span>
                <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-900/60 px-2.5 py-0.5 rounded-lg border border-cyan-500/40">
                  {formatCountdown(countdown)} còn lại
                </span>
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-between pt-1 border-t border-cyan-900/50">
                <span className="text-slate-400">🎯 Thời điểm quét tiếp theo:</span>
                <span className="font-bold text-emerald-400 font-mono">{getNextScanTargetDateString()}</span>
              </div>
              <div className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                💡 <strong className="text-slate-200">Đồng bộ Cloud Server đa máy tính:</strong> Bạn có thể tắt máy, đổi sang máy tính khác, đóng tab hoặc làm mới trang (F5), đồng hồ sẽ <strong className="text-emerald-300">không bị nhảy ngược lại 24:00:00</strong> mà tiếp tục chạy theo đúng mốc thời gian thực tế và chu kỳ bạn đã chọn!
              </div>
            </div>

            {/* CROSS-DEVICE CLOUD SYNC CARD */}
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-indigo-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-900/50 text-indigo-300 flex items-center justify-center border border-indigo-500/40">
                  <Cloud className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white">Đồng Bộ Đa Thiết Bị (Cross-Device)</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold border flex items-center gap-1 ${
                      cloudSyncStatus === 'synced'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                        : cloudSyncStatus === 'syncing'
                        ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/40'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cloudSyncStatus === 'synced' ? 'bg-emerald-400' : 'bg-amber-400 animate-spin'}`} />
                      <span>{cloudSyncStatus === 'synced' ? 'Đã đồng bộ' : cloudSyncStatus === 'syncing' ? 'Đang đồng bộ...' : 'Chưa kết nối'}</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Mở máy khác tự động nhận đúng mốc cài đặt {lastCloudSyncedAt && `• Cập nhật: ${lastCloudSyncedAt}`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleManualCloudSync}
                disabled={cloudSyncStatus === 'syncing'}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/40 font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-colors shadow"
                title="Tải lại cài đặt mới nhất từ máy chủ"
              >
                <RefreshCw className={`w-3 h-3 ${cloudSyncStatus === 'syncing' ? 'animate-spin' : ''}`} />
                <span>Đồng Bộ Ngay</span>
              </button>
            </div>

            {/* FREQUENCY PRESET SELECTION */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-200 uppercase tracking-wider">
                Chọn Chu Kỳ Quét Định Kỳ:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { sec: 86400, label: 'Mỗi 24 Giờ (1 Ngày)', sub: 'Khuyên dùng cho đối thủ nha khoa', badge: 'Chuẩn Nhất' },
                  { sec: 43200, label: 'Mỗi 12 Giờ', sub: '2 lần mỗi ngày (Sáng / Tối)' },
                  { sec: 21600, label: 'Mỗi 6 Giờ', sub: '4 lần mỗi ngày' },
                  { sec: 3600, label: 'Mỗi 1 Giờ', sub: 'Theo dõi liên tục trong ngày' },
                  { sec: 900, label: 'Mỗi 15 Phút', sub: 'Kiểm tra tốc độ cao' }
                ].map(opt => (
                  <button
                    key={opt.sec}
                    type="button"
                    onClick={() => handleChangeInterval(opt.sec)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      autoScanInterval === opt.sec
                        ? 'bg-gradient-to-r from-cyan-950/80 to-indigo-950/80 border-cyan-400 text-white shadow-lg shadow-cyan-600/20'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs flex items-center gap-1.5">
                        {autoScanInterval === opt.sec && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                        <span>{opt.label}</span>
                      </span>
                      {opt.badge && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {opt.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">{opt.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleResetCurrentCycle}
                className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                title="Khởi động lại mốc đếm 24h bắt đầu từ thời điểm bây giờ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt Lại Mốc 24H Từ Bây Giờ</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    performAutoScan();
                    handleResetCurrentCycle();
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Quét Ngay & Lên Lịch Mới</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX MODAL FOR FULL-SIZE BANNER ZOOM INSPECTION */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="max-w-4xl w-full bg-slate-900 border-2 border-cyan-500/50 rounded-3xl overflow-hidden shadow-2xl space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold ${
                  lightboxImage.type === 'before' ? 'bg-rose-600' : 'bg-emerald-600'
                }`}>
                  {lightboxImage.type === 'before' ? '🔴' : '✨'}
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{lightboxImage.title}</h4>
                  <p className="text-xs text-slate-400">{lightboxImage.subtitle || 'Hình ảnh / Banner bắt được trực tiếp từ website đối thủ'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage.src}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  <span>Mở File Ảnh</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[250px] max-h-[70vh] p-2">
              <img
                src={lightboxImage.src}
                alt={lightboxImage.title}
                className="max-h-[68vh] w-auto object-contain rounded-xl"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('/api/proxy-image')) {
                    target.src = `/api/proxy-image?url=${encodeURIComponent(lightboxImage.src)}`;
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="font-mono text-[11px] text-cyan-300">
                {lightboxImage.type === 'before' ? '🔴 Bản ghi hình ảnh trong cơ sở dữ liệu cũ trước khi thay đổi' : '🟢 Phiên bản hình ảnh mới nhất vừa được phát hiện trên website'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(lightboxImage.src);
                    alert('Đã copy đường dẫn ảnh vào Clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  Copy Link Ảnh
                </button>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
