import { TransparencyAdItem, TransparencyDomainProfile } from './transparencyTypes';
import { generateBrandAds } from './adGeneratorHelper';

export * from './transparencyTypes';

// ============================================================================
// BASE CURATED ADS FOR NHA KHOA KIM (MATCHING EXACT GOOGLE ADS TRANSPARENCY SCREENSHOT)
// ============================================================================
const KIM_BASE_ADS: TransparencyAdItem[] = [
  // Row 1, Col 1: Quy trình trồng Implant chỉ 2 lần hẹn
  {
    id: 'kim-ad-1',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '20/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'implant',
    visual: {
      theme: 'clinic_blue',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'MÁNG ĐỊNH VỊ 3D',
      headlineMain: 'QUY TRÌNH TRỒNG IMPLANT CHỈ 2 LẦN HẸN - MÁNG ĐỊNH VỊ',
      subHeadline: 'Lần 1: Chụp CT 3D & Quét răng • Lần 2: Cắm trụ & Phục hình',
      highlightPill: 'Không Đau - Nhanh Chóng',
      photoType: 'doctor_guide',
      duration: '0:40',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Giải tỏa nỗi sợ tốn thời gian và đau đớn cho người bận rộn khi trồng răng Implant.',
      psychologicalHook: 'Cam kết cụ thể về số lần hẹn "Chỉ 2 lần" giúp khách hàng cảm thấy việc trồng răng rất nhanh và nhẹ nhàng.',
      targetAudience: 'Người trung niên mất răng, doanh nhân bận rộn, khách hàng ở xa hoặc Việt kiều về nước ngắn ngày.',
      estimatedDailySpend: '20.000.000 đ/ngày',
      competitorWeakness: 'Máng định vị bị tính thêm phí từ 3-5 triệu ngoài tiền trụ, ca tiêu xương nặng vẫn phải ghép xương nhiều lần.',
      counterAdTemplate: {
        headline: 'Trồng Răng Implant Tâm Đức Smile - Ăn Nhai Sau 48H Miễn Phí Máng Phẫu Thuật 3D',
        description: 'Tặng trọn bộ Chụp CT ConeBeam 3D + Máng định vị 3.5Tr. Trụ Implant chính hãng chỉ từ 9.9Tr trọn gói.',
        sitelinks: ['Trọn Gói 9.9Tr', 'Miễn Phí Máng 3D', 'Bảo Hành Trọn Đời', 'Đưa Đón Miễn Phí'],
        biddingAdvice: 'Đấu thầu từ khóa "trồng răng implant nhanh không đau" và đẩy mạnh sitelink "Miễn Phí Máng Định Vị".',
        uniqueSellingPoint: 'Tặng kèm miễn phí máng hướng dẫn phẫu thuật 3D và bảo hành chính hãng trọn đời.'
      }
    }
  },
  // Row 1, Col 2: Bảng Giá Nha Khoa 2025 - Google Search Ad
  {
    id: 'kim-ad-2',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'text',
    platform: 'Google Search',
    firstSeen: '18/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'general',
    searchAd: {
      displayDomain: 'nhakhoakim.com',
      path: 'www.nhakhoakim.com/',
      headline: 'Bảng Giá Nha Khoa 2025 - Nha Khoa Quận Đống Đa Uy Tín',
      description: '100% KH được điều trị bởi Bác sĩ có chuyên môn và năng lực, đầy đủ bằng cấp, chứng chỉ. Đối tác toàn cầu của Đại học Harvard, đạt chất lượng ISO 9001:2015 Anh Quốc...',
      sitelinks: [
        'Bảng Giá Nha Khoa 2025',
        'Đội Ngũ 200+ Bác Sĩ Giỏi',
        'Dịch Vụ Chăm Sóc Chu Đáo',
        'An Toàn Trong Điều Trị'
      ],
      callouts: ['ISO 9001:2015', 'Đối Tác Harvard', 'Bác Sĩ Giỏi']
    },
    intel: {
      campaignGoal: 'Đón trọn lưu lượng tìm kiếm từ khóa "bảng giá nha khoa" và định hướng người dùng vào trang danh mục.',
      psychologicalHook: 'Từ khóa "Bảng giá 2025/2026" đánh trúng tâm lý so sánh chi phí trước khi đến khám.',
      targetAudience: 'Người dùng Google Search đang trong giai đoạn so sánh giá và tìm phòng khám uy tín.',
      estimatedDailySpend: '12.000.000 đ/ngày',
      competitorWeakness: 'Bảng giá trên web của Kim thường là "giá từ" chưa gồm chi phí phát sinh phụ kiện.',
      counterAdTemplate: {
        headline: 'Bảng Giá Nha Khoa Tâm Đức Smile 2026 - Niêm Yết Trọn Gói Cam Kết Không Phát Sinh',
        description: 'Trồng răng Implant từ 9.9Tr, Răng sứ chỉ 1.2Tr/răng, Niềng răng trả góp 800k/tháng. Miễn phí khám & chụp phim 3D.',
        sitelinks: ['Bảng Giá Chi Tiết 2026', 'Ưu Đãi Hôm Nay', '17 Chi Nhánh', 'Đặt Hẹn Giảm Thêm 10%'],
        biddingAdvice: 'Đặt Top 1 Google Search cho các từ khóa "bảng giá nha khoa tâm đức smile" và "bảng giá nha khoa tphcm".',
        uniqueSellingPoint: 'Bảng giá cam kết trọn gói minh bạch 100%, không phí ẩn.'
      }
    }
  },
  // Row 1, Col 3: Invisalign Đừng chỉ nhận khay hãy nhận kết quả
  {
    id: 'kim-ad-3',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '16/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'ortho',
    visual: {
      theme: 'invisalign_cyan',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'INVISALIGN TOP TIER',
      headlineMain: 'INVISALIGN - ĐỪNG CHỈ NHẬN KHAY HÃY NHẬN KẾT QUẢ',
      subHeadline: 'Bác Sĩ Chuyên Chỉnh Nha Lên Phác Đồ 3D ClinCheck Chuẩn Xác',
      highlightPill: 'Kết Quả Thật',
      photoType: 'aligner_girl',
      duration: '0:35',
      imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Tập trung vào giá trị phác đồ bác sĩ thay vì chỉ bán khay niềng, nhằm chốt hợp đồng Invisalign giá cao (80-120Tr).',
      psychologicalHook: 'Nhắc nhở khách hàng rằng khay chỉ là công cụ, tay nghề bác sĩ mới quyết định kết quả gương mặt.',
      targetAudience: 'Nữ giới 20-35 tuổi, nhân viên văn phòng, người làm nghề giao tiếp nhiều tại TP.HCM & Hà Nội.',
      estimatedDailySpend: '16.000.000 đ/ngày',
      competitorWeakness: 'Giá gói Invisalign tại Kim thường cao hơn 15-20 triệu so với các nha khoa khác cùng hạng khay.',
      counterAdTemplate: {
        headline: 'Niềng Răng Trong Suốt Invisalign Tâm Đức Smile - Trả Góp 0% Tặng Gói Tẩy Trắng 3Tr',
        description: 'Bác sĩ hạng Platinum Invisalign trực tiếp điều trị. Quét dấu răng iTero 5D thấy trước nụ cười sau 60 giây.',
        sitelinks: ['Gói Invisalign Ưu Đãi', 'Quét iTero 5D Miễn Phí', 'Trả Góp 2Tr/Tháng', 'Hình Ảnh Khách Hàng'],
        biddingAdvice: 'Nhắm từ khóa "niềng răng invisalign trả góp" và hiển thị ưu đãi tặng tẩy trắng răng 3 triệu.',
        uniqueSellingPoint: 'Bác sĩ hạng Platinum, miễn phí quét 3D iTero 5D và hỗ trợ trả góp 0% lãi suất.'
      }
    }
  },
  // Row 1, Col 4: Từ Mỹ trở về trồng răng toàn hàm
  {
    id: 'kim-ad-4',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '14/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'implant',
    visual: {
      theme: 'flag_us',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'VIỆT KIỀU MỸ TIN CHỌN',
      headlineMain: 'TỪ MỸ TRỞ VỀ TRỒNG RĂNG TOÀN HÀM - 2 NGÀY CÓ HÀM TẠM',
      subHeadline: 'Khách Hàng Việt Kiều Mỹ Chia Sẻ Hành Trình Lấy Lại Nụ Cười',
      highlightPill: '2 Ngày Có Hàm Tạm',
      photoType: 'viet_kieu_smile',
      duration: '0:50',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Thu hút kiều bào Mỹ, Úc, Canada về nước làm răng với dịch vụ toàn hàm All-on-4 / All-on-6.',
      psychologicalHook: 'Đánh vào yếu tố tốc độ "2 ngày có hàm tạm" để kiều bào tranh thủ kỳ nghỉ ngắn ngày tại Việt Nam.',
      targetAudience: 'Việt kiều Mỹ, Úc, Châu Âu về thăm quê hương và người thân ở Việt Nam giới thiệu.',
      estimatedDailySpend: '22.000.000 đ/ngày',
      competitorWeakness: 'Chi phí toàn hàm tại Kim vẫn ở mức cao so với mặt bằng chung và không có chính sách hỗ trợ đưa đón sân bay tận nơi.',
      counterAdTemplate: {
        headline: 'Trồng Răng Toàn Hàm Cho Việt Kiều Tâm Đức Smile - Trọn Gói Tiết Kiệm Đến 70% So Với Mỹ',
        description: 'Có răng tạm sau 24h. Bảo hành quốc tế trọn đời. Hỗ trợ xe đưa đón sân bay Tân Sơn Nhất & khách sạn nghỉ dưỡng.',
        sitelinks: ['Gói Kiều Bào Trọn Gói', 'Xe Đưa Đón Sân Bay', 'Ăn Nhai Trong 24H', 'Tư Vấn Online 24/7'],
        biddingAdvice: 'Chạy chiến dịch nhắm đối tượng có người thân ở nước ngoài hoặc truy cập từ IP US/AU/CA.',
        uniqueSellingPoint: 'Dịch vụ chuẩn VIP đưa đón sân bay, khách sạn, hoàn tất phục hình trong thời gian ngắn nhất.'
      }
    }
  },
  // Row 2, Col 1: Bảng Giá Nha Khoa Kim 2026 - An Toàn Tận Tâm Thẩm Mỹ Cao
  {
    id: 'kim-ad-5',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'text',
    platform: 'Google Search',
    firstSeen: '12/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'general',
    searchAd: {
      displayDomain: 'nhakhoakim.com',
      path: 'www.nhakhoakim.com/dia-chi/phong-kham',
      headline: 'Bảng Giá Nha Khoa Kim 2026 - An Toàn-Tận Tâm-Thẩm Mỹ Cao',
      description: '100% KH được điều trị bởi Bác sĩ giỏi chuyên môn và năng lực, đầy đủ bằng cấp, chứng chỉ. Chuỗi Nha khoa chiếm trọn 14 vị trí đầu...',
      sitelinks: [
        'Bảng Giá Nha Khoa 2026',
        'An Toàn Trong Điều Trị',
        '17 Chi Nhánh Toàn Quốc',
        'Đội Ngũ Bác Sĩ CKI'
      ],
      callouts: ['ISO 9001:2015', 'Chi Nhánh Gần Bạn', 'Bác Sĩ Trực Tiếp Khám']
    },
    intel: {
      campaignGoal: 'Đón traffic tìm kiếm địa chỉ phòng khám và bảng giá tổng quát.',
      psychologicalHook: 'Thông điệp An toàn - Tận tâm - Thẩm mỹ cao tạo sự tin tưởng toàn diện.',
      targetAudience: 'Người tìm kiếm chuỗi nha khoa uy tín tại TP.HCM & các tỉnh.',
      estimatedDailySpend: '14.000.000 đ/ngày',
      competitorWeakness: 'Đông bệnh nhân dẫn đến thời gian chờ đợi lâu tại một số chi nhánh trung tâm.',
      counterAdTemplate: {
        headline: 'Tâm Đức Smile - Đặt Hẹn Trước Khám Ngay Không Chờ Đợi • Bác Sĩ CKI',
        description: 'Tặng trọn gói chụp CT 3D & Vệ sinh răng 0đ khi đặt lịch online. Bảng giá trọn gói niêm yết công khai.',
        sitelinks: ['Đặt Hẹn 0đ Chờ Đợi', 'Bảng Giá Gốc', '17 Chi Nhánh'],
        biddingAdvice: 'Đánh vào lợi thế "Khám ngay không phải chờ đợi" và miễn phí gói chụp phim.',
        uniqueSellingPoint: 'Quy trình tiếp đón 1:1 nhanh chóng, không phải bốc số chờ đợi lâu.'
      }
    }
  },
  // Row 2, Col 2: Big 4 kiểm chứng quản trị
  {
    id: 'kim-ad-6',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '10/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'general',
    visual: {
      theme: 'navy_gold',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'CHUẨN QUỐC TẾ',
      headlineMain: 'BIG4 KIỂM CHỨNG QUẢN TRỊ NHA KHOA KIM',
      subBadgeText: 'Deloitte • EY • PwC • KPMG',
      highlightPill: 'Quản Trị Minh Bạch',
      photoType: 'big4_trust',
      duration: '0:30',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Xây dựng uy tín tối thượng, khẳng định vị thế chuỗi nha khoa đạt chuẩn kiểm toán quốc tế.',
      psychologicalHook: 'Đòn bẩy tâm lý "Big 4" - tạo cảm giác an tâm tuyệt đối về chất lượng và tính minh bạch tài chính/vận hành.',
      targetAudience: 'Khách hàng trung lưu, người có thu nhập cao và khách hàng kỹ tính tại TP.HCM & Hà Nội.',
      estimatedDailySpend: '15.000.000 đ/ngày',
      competitorWeakness: 'Đánh bóng thương hiệu quá mức nhưng chi phí vận hành lớn khiến bảng giá dịch vụ luôn cao hơn 25-40% so với thị trường.',
      counterAdTemplate: {
        headline: 'Nha Khoa Tâm Đức Smile - Trực Tiếp Bác Sĩ CKI Điều Trị Không Qua Trung Gian',
        description: '17 chi nhánh TP.HCM & Miền Tây. Cam kết bảng giá niêm yết trọn gói 100%, không phụ phí. Hơn 100.000 nụ cười tin chọn.',
        sitelinks: ['Bảng Giá Gốc 2026', '17 Chi Nhánh Gần Bạn', 'Bác Sĩ CKI Khám 0đ', 'Xem Khách Hàng Thực Tế'],
        biddingAdvice: 'Nhắm từ khóa thương hiệu "nha khoa kim uy tín" và nhấn mạnh "Giá Gốc Trọn Gói - Bác Sĩ Trực Tiếp".',
        uniqueSellingPoint: 'Chi phí hợp lý, tiết kiệm hơn 30% với chất lượng điều trị tương đương và phủ rộng khắp miền Tây.'
      }
    }
  },
  // Row 2, Col 3: Harvard Nâng Chuẩn Điều Trị
  {
    id: 'kim-ad-7',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '08/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'general',
    visual: {
      theme: 'harvard_gold',
      brandLogoText: 'NHA KHOA KIM & HARVARD',
      topBadgeText: 'ĐẠI HỌC HARVARD',
      headlineMain: 'NÂNG CHUẨN ĐIỀU TRỊ NHA KHOA',
      subHeadline: 'Case Study Được Giảng Dạy Tại Harvard Business School',
      highlightPill: 'Harvard Business School',
      photoType: 'harvard_group',
      duration: '0:45',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Định vị Nha Khoa Kim là nha khoa duy nhất tại VN được Harvard đưa vào tài liệu giảng dạy nghiên cứu điển hình.',
      psychologicalHook: 'Hiệu ứng hào quang (Halo Effect) từ thương hiệu Harvard để bán các gói dịch vụ giá cao.',
      targetAudience: 'Giới trí thức, doanh nhân, kiều bào và người có yêu cầu khắt khe về tiêu chuẩn điều trị.',
      estimatedDailySpend: '18.000.000 đ/ngày',
      competitorWeakness: 'Harvard chỉ nghiên cứu về mô hình kinh doanh chuỗi, không phản ánh tay nghề từng bác sĩ tại chi nhánh lẻ.',
      counterAdTemplate: {
        headline: 'Tâm Đức Smile - Đội Ngũ Bác Sĩ CKI Tốt Nghiệp ĐH Y Dược Hơn 15 Năm Kinh Nghiệm',
        description: 'Điều trị tận tâm, 1 Bác sĩ theo sát 1 Bệnh nhân từ đầu đến cuối. Trang thiết bị Đức & Thụy Sĩ chuẩn y khoa.',
        sitelinks: ['Hồ Sơ Bác Sĩ CKI', 'Bảng Giá Trọn Gói', 'Cam Kết Bằng Văn Bản', 'Tư Vấn Miễn Phí'],
        biddingAdvice: 'Đánh mạnh vào yếu tố "Bác sĩ trực tiếp làm từ A-Z, không chuyển giao cho phụ tá".',
        uniqueSellingPoint: 'Chăm sóc 1:1 tận tụy, cam kết chất lượng trực tiếp từ bác sĩ chuyên khoa I.'
      }
    }
  },
  // Row 2, Col 4 (Ad 8): Trồng Implant chỉ trong 1 giờ nghỉ trưa
  {
    id: 'kim-ad-8',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '06/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'implant',
    visual: {
      theme: 'clinic_blue',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'NHANH CHÓNG',
      headlineMain: 'TRỒNG IMPLANT CHỈ TRONG 1 GIỜ NGHỈ TRƯA',
      subHeadline: 'Phục hồi răng tức thì với máng định vị kỹ thuật số 3D',
      highlightPill: '1 Giờ Nghỉ Trưa',
      photoType: 'implant_lunch_hour',
      duration: '0:30',
      imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Đánh vào tệp nhân viên văn phòng và người bận rộn cần cắm Implant nhanh chóng trong giờ nghỉ trưa.',
      psychologicalHook: 'Thông điệp "Chỉ trong 1 giờ nghỉ trưa" xóa tan nỗi sợ mất nhiều ngày nghỉ làm để trồng răng.',
      targetAudience: 'Nhân viên văn phòng, quản lý, chủ doanh nghiệp bận rộn tại các thành phố lớn.',
      estimatedDailySpend: '18.000.000 đ/ngày',
      competitorWeakness: '1 giờ chỉ đủ cắm trụ, chưa tính thời gian xét nghiệm máu và chụp phim CT ban đầu.',
      counterAdTemplate: {
        headline: 'Trồng Răng Implant Không Đau Tâm Đức Smile - Cắm Trụ Nhẹ Nhàng 15 Phút • Bác Sĩ CKI',
        description: 'Chụp CT ConeBeam 3D khảo sát xương miễn phí 100%. Tặng máng phẫu thuật định vị chính xác.',
        sitelinks: ['Khám Xương 3D 0đ', 'Trụ Implant 9.9Tr', 'Đặt Hẹn Giờ Nghỉ'],
        biddingAdvice: 'Đấu thầu từ khóa "trồng răng implant nhanh cho người bận rộn".',
        uniqueSellingPoint: 'Quy trình tiếp đón ưu tiên cho người bận rộn, phục hình răng nhanh.'
      }
    }
  },
  // Row 3, Col 2 (Ad 9): Từ Mỹ trở về trồng răng toàn hàm (Biến thể 2)
  {
    id: 'kim-ad-9',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '05/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'implant',
    visual: {
      theme: 'flag_us',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'VIỆT KIỀU MỸ',
      headlineMain: 'TỪ MỸ TRỞ VỀ TRỒNG RĂNG TOÀN HÀM',
      subHeadline: 'Khách hàng Việt kiều Mỹ chia sẻ trải nghiệm dịch vụ',
      highlightPill: 'Việt Kiều Mỹ',
      photoType: 'viet_kieu_smile_2',
      duration: '0:45',
      imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Tăng cường tần suất hiển thị thông điệp Việt kiều Mỹ về nước trồng răng toàn hàm.',
      psychologicalHook: 'Social Proof từ đồng hương kiều bào giúp tăng tỷ lệ chuyển đổi.',
      targetAudience: 'Việt kiều Mỹ, Canada, Úc và người thân tại Việt Nam.',
      estimatedDailySpend: '20.000.000 đ/ngày',
      competitorWeakness: 'Không có chính sách hỗ trợ đưa đón sân bay và xe đưa rước các buổi tái khám.',
      counterAdTemplate: {
        headline: 'Gói Kiều Bào Tâm Đức Smile - Trọn Gói Răng Toàn Hàm Tiết Kiệm 70% So Với Nước Ngoài',
        description: 'Bảo hành quốc tế. Miễn phí xe đưa đón sân bay Tân Sơn Nhất & khách sạn nghỉ dưỡng.',
        sitelinks: ['Gói Kiều Bào', 'Đưa Đón Sân Bay', 'Tư Vấn Online 24/7'],
        biddingAdvice: 'Nhắm target kiều bào và người dùng tìm kiếm nha khoa cho người thân ở nước ngoài.',
        uniqueSellingPoint: 'Dịch vụ chuẩn VIP toàn diện từ đón sân bay đến hoàn thiện răng.'
      }
    }
  },
  // Row 3, Col 3 (Ad 10): Môi trường làm việc tại Nha Khoa Kim Vũng Tàu
  {
    id: 'kim-ad-10',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '03/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'general',
    visual: {
      theme: 'clinic_blue',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'CHI NHÁNH VŨNG TÀU',
      headlineMain: 'MÔI TRƯỜNG LÀM VIỆC TẠI NHA KHOA KIM VŨNG TÀU',
      subHeadline: 'Cơ sở vật chất hiện đại chuẩn quốc tế phục vụ người dân Bà Rịa - Vũng Tàu',
      highlightPill: 'Vũng Tàu',
      photoType: 'vung_tau_clinic',
      duration: '0:35',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Đẩy mạnh nhận diện thương hiệu chi nhánh Vũng Tàu và thu hút bệnh nhân địa phương.',
      psychologicalHook: 'Hình ảnh phòng khám khang trang, nhân sự chuyên nghiệp tạo sự an tâm khi đến khám tại tỉnh.',
      targetAudience: 'Người dân sinh sống tại TP. Vũng Tàu, Bà Rịa và khu vực lân cận.',
      estimatedDailySpend: '10.000.000 đ/ngày',
      competitorWeakness: 'Chi phí dịch vụ tại chi nhánh tỉnh vẫn giữ nguyên mức giá cao như TP.HCM.',
      counterAdTemplate: {
        headline: 'Nha Khoa Tâm Đức Smile Vũng Tàu - Bác Sĩ CKI Khám Trực Tiếp • Ưu Đãi 50%',
        description: 'Chi nhánh hiện đại tại Vũng Tàu. Khám & chụp CT 3D miễn phí. Bảng giá ưu đãi dành riêng cho người dân địa phương.',
        sitelinks: ['Chi Nhánh Vũng Tàu', 'Bảng Giá Ưu Đãi', 'Đặt Lịch Ngay'],
        biddingAdvice: 'Target địa lý TP. Vũng Tàu và bán kính 20km.',
        uniqueSellingPoint: 'Chi nhánh hiện đại ngay trung tâm Vũng Tàu, giá cả hợp lý phù hợp người dân địa phương.'
      }
    }
  },
  // Row 3, Col 4 (Ad 11): Implant Toàn Hàm Chỉ 2 Lần Hẹn - Ăn Nhai Thoải Mái
  {
    id: 'kim-ad-11',
    advertiserName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    domain: 'nhakhoakim.com',
    isVerified: true,
    format: 'video',
    platform: 'YouTube',
    firstSeen: '01/02/2025',
    lastSeen: 'Đang chạy hôm nay',
    category: 'implant',
    visual: {
      theme: 'clinic_blue',
      brandLogoText: 'NHA KHOA KIM',
      topBadgeText: 'IMPLANT TOÀN HÀM',
      headlineMain: 'IMPLANT TOÀN HÀM CHỈ 2 LẦN HẸN - ĂN NHAI THOẢI MÁI',
      subHeadline: 'Giải pháp phục hình răng nguyên hàm bền chắc trọn đời cho người lớn tuổi',
      highlightPill: 'Ăn Nhai Thoải Mái',
      photoType: 'implant_senior_male',
      duration: '0:40',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80'
    },
    intel: {
      campaignGoal: 'Thúc đẩy dịch vụ Implant toàn hàm All On 4/6 với cam kết chỉ 2 lần hẹn.',
      psychologicalHook: 'Hình ảnh chú lớn tuổi cười rạng rỡ và thông điệp "Ăn nhai thoải mái" kích thích nhu cầu phục hồi răng mất.',
      targetAudience: 'Người cao tuổi từ 50-75 tuổi bị mất nhiều răng hoặc mất toàn bộ răng.',
      estimatedDailySpend: '24.000.000 đ/ngày',
      competitorWeakness: 'Chi phí trọn gói rất cao, phụ thu tiền máng định vị và răng sứ trên trụ.',
      counterAdTemplate: {
        headline: 'Trồng Răng Toàn Hàm All On 4 Tâm Đức Smile - Ăn Nhai Bền Chắc Trọn Đời • Giảm 50Tr',
        description: 'Tặng trọn bộ CT 3D + Răng sứ chính hãng. Bác sĩ CKI hơn 15 năm kinh nghiệm. Đưa đón tận nhà.',
        sitelinks: ['Gói Toàn Hàm 2026', 'Xem Khách Hàng U70', 'Đưa Đón 0đ'],
        biddingAdvice: 'Đánh vào từ khóa "trồng răng toàn hàm cho người già" và nhấn mạnh ưu đãi trọn gói.',
        uniqueSellingPoint: 'Gói hỗ trợ toàn hàm tốt nhất cho người lớn tuổi kèm chế độ chăm sóc đưa đón 1:1.'
      }
    }
  }
];

// Rich Template Matrix for procedural expansion to reach 200 ads for Nha Khoa Kim
const KIM_TEMPLATES = [
  {
    category: 'implant' as const,
    format: 'text' as const,
    platform: 'Google Search' as const,
    serviceName: 'Trồng Răng Implant Straumann Thụy Sĩ',
    hook: 'Tích hợp xương nhanh 3-4 tuần',
    theme: 'clinic_blue' as const,
    photoType: 'surgery_room' as const,
    badge: 'STRAUMANN CHÍNH HÃNG',
    headlineMain: 'TRỒNG RĂNG IMPLANT STRAUMANN THỤY SĨ - BẢO HÀNH TOÀN CẦU',
    subHeadline: 'Tích Hợp Xương Nhanh • Ăn Nhai Chắc Khỏe Trọn Đời',
    highlightPill: 'Thụy Sĩ Chính Hãng',
    searchHeadline: 'Trồng Răng Implant Straumann Thụy Sĩ - Nha Khoa Kim Chuẩn Quốc Tế',
    searchDesc: 'Dòng trụ số 1 thế giới tích hợp xương siêu tốc trong 3 tuần. Bác sĩ CKI hơn 15 năm kinh nghiệm. Thẻ bảo hành điện tử chính hãng toàn cầu.',
    sitelinks: ['Bảng Giá Trụ Straumann', 'Quy Trình 3D Không Đau', 'Bác Sĩ CKI Trực Tiếp', 'Ưu Đãi Trả Góp 0%'],
    callouts: ['Trụ Thụy Sĩ Chính Hãng', 'Bảo Hành Toàn Cầu', 'Tích Hợp 3 Tuần', 'Quét 3D Miễn Phí'],
    intelGoal: 'Thống trị nhóm khách hàng cao cấp tìm kiếm trụ Implant tốt nhất thế giới (Straumann SLA/SLActive).',
    intelHook: 'Thương hiệu Straumann Thụy Sĩ là bảo chứng vàng về tỉ lệ thành công 99.8%.',
    intelAudience: 'Người có thu nhập cao, người có bệnh lý nền nhẹ (tiểu đường ổn định).',
    intelWeakness: 'Giá trụ Straumann tại Kim lên tới 35-45 triệu/trụ, chênh lệch lớn so với các nha khoa khác.',
    counterHeadline: 'Trụ Implant Straumann Thụy Sĩ Tâm Đức Smile - Trọn Gói Giá Gốc Tiết Kiệm 30%',
    counterDesc: 'Bảo hành chính hãng toàn cầu. Đã bao gồm khớp nối Abutment & răng sứ Zirconia. Miễn phí chụp CT 3D & xe đưa đón.',
    counterSitelinks: ['Bảng Giá Straumann Gốc', 'Xe Đưa Đón 0đ', 'Bác Sĩ CKI Khám'],
    counterAdvice: 'Đấu thầu đối kháng từ khóa "implant straumann nha khoa kim", nhấn mạnh giá trọn gói tiết kiệm 30%.',
    counterUsp: 'Giá trụ Straumann tốt nhất miền Nam kèm dịch vụ đưa đón xe riêng.'
  },
  {
    category: 'implant' as const,
    format: 'video' as const,
    platform: 'YouTube' as const,
    serviceName: 'Robot Định Vị X-Guide Cấy Ghép Implant',
    hook: 'Chính xác gấp 11 lần mắt thường',
    theme: 'navy_gold' as const,
    photoType: 'doctor_guide' as const,
    badge: 'CÔNG NGHỆ ROBOT X-GUIDE',
    headlineMain: 'ĐỘT PHÁ CẤY IMPLANT BẰNG ROBOT X-GUIDE THỜI GIAN THỰC',
    subHeadline: 'Độ Chính Xác Đến 0.1mm • Không Rạch Nướu • Không Chảy Máu',
    highlightPill: 'Robot X-Guide 3D',
    searchHeadline: 'Cấy Ghép Implant Robot X-Guide - Độ Chuẩn Xác Tuyệt Đối Không Rạch Nướu',
    searchDesc: 'Công nghệ phẫu thuật định vị thời gian thực của Mỹ. Nhẹ nhàng, êm ái, hồi phục sau 24h. Bác sĩ chuyên khoa trực tiếp điều trị.',
    sitelinks: ['Xem Video Robot X-Guide', 'Bảng Giá Trọn Gói', 'Khám & Tư Vấn 0đ'],
    callouts: ['Độ Chính Xác 0.1mm', 'Không Rạch Nướu', 'Lành Thương 24h'],
    intelGoal: 'Tạo sự khác biệt công nghệ phẫu thuật robot để nâng tầm đẳng cấp thương hiệu.',
    intelHook: 'Từ khóa "Robot" và "Định vị thời gian thực" xua tan nỗi lo cắm lệch trụ hay chạm dây thần kinh.',
    intelAudience: 'Người mất răng sợ biến chứng phẫu thuật, khách hàng kỹ tính.',
    intelWeakness: 'Phí dịch vụ robot bị phụ thu thêm 5-10 triệu mỗi ca cấy ghép.',
    counterHeadline: 'Cấy Ghép Implant Máng Định Vị 3D Kỹ Thuật Số - Chuẩn Xác Tuyệt Đối',
    counterDesc: 'Tặng miễn phí 100% máng hướng dẫn phẫu thuật 3D. Bác sĩ CKI trên 15 năm kinh nghiệm thực hiện hơn 10.000 ca an toàn.',
    counterSitelinks: ['Miễn Phí Máng 3D', 'Bác Sĩ CKI Giỏi', 'Bảng Giá 2026'],
    counterAdvice: 'Nhấn mạnh tặng miễn phí máng phẫu thuật 3D thay vì thu thêm phụ phí như đối thủ.',
    counterUsp: 'Miễn phí công nghệ định vị 3D, không phát sinh chi phí phụ.'
  },
  {
    category: 'implant' as const,
    format: 'text' as const,
    platform: 'Google Search' as const,
    serviceName: 'Trồng Răng Implant Quận Đống Đa & Cầu Giấy Hà Nội',
    hook: 'Cơ sở gần bạn - Khám miễn phí',
    theme: 'clinic_blue' as const,
    photoType: 'surgery_room' as const,
    badge: 'CHI NHÁNH HÀ NỘI',
    headlineMain: 'TRỒNG RĂNG IMPLANT TẠI HÀ NỘI - NHA KHOA KIM CHUẨN ISO',
    subHeadline: 'Chi Nhánh Đống Đa, Cầu Giấy, Hai Bà Trưng • Bác Sĩ Đại Học Y Hà Nội',
    highlightPill: 'Hà Nội - Đống Đa & Cầu Giấy',
    searchHeadline: 'Trồng Răng Implant Nha Khoa Kim Hà Nội - Bác Sĩ Chuyên Khoa Y Hà Nội',
    searchDesc: 'Hệ thống phòng khám tại Đống Đa, Cầu Giấy, Hai Bà Trưng. Máy chụp CT ConeBeam 3D tại chỗ. Trả góp 0% lãi suất. Đặt hẹn ngay!',
    sitelinks: ['Chi Nhánh Đống Đa', 'Chi Nhánh Cầu Giấy', 'Bảng Giá Hà Nội', 'Đặt Hẹn Khám 0đ'],
    callouts: ['Gần Bạn Nhất', 'Máy CT 3D Tại Chỗ', 'Bác Sĩ Y Hà Nội'],
    intelGoal: 'Chiếm lĩnh các từ khóa tìm kiếm địa phương khu vực Hà Nội.',
    intelHook: 'Sự tiện lợi về địa lý và danh tiếng bác sĩ Y Hà Nội.',
    intelAudience: 'Người dân sinh sống tại các quận trung tâm Hà Nội.',
    intelWeakness: 'Giá tại Hà Nội của Kim thường cao hơn các phòng khám nha khoa tư nhân chất lượng cao.',
    counterHeadline: 'Trồng Răng Implant Uy Tín Miền Nam - Đưa Đón Miễn Phí Cho Khách Hàng',
    counterDesc: 'Bảng giá trọn gói niêm yết minh bạch. Tặng răng sứ Zirconia chính hãng. Đội ngũ bác sĩ CKI hàng đầu.',
    counterSitelinks: ['Bảng Giá Trọn Gói', 'Hỗ Trợ Đi Lại', 'Tư Vấn Miễn Phí'],
    counterAdvice: 'Target khách hàng tìm kiếm nha khoa uy tín với chính sách bảo hành rõ ràng.',
    counterUsp: 'Chính sách giá trọn gói và cam kết chất lượng chuẩn y khoa.'
  },
  {
    category: 'ortho' as const,
    format: 'text' as const,
    platform: 'Google Search' as const,
    serviceName: 'Niềng Răng Trong Suốt Invisalign Trả Góp 0%',
    hook: 'Thấy trước nụ cười sau 60s bằng iTero 5D',
    theme: 'invisalign_cyan' as const,
    photoType: 'aligner_girl' as const,
    badge: 'INVISALIGN PLATINUM',
    headlineMain: 'NIỀNG RĂNG INVISALIGN - QUÉT DẤU 3D ITERO 5D MIỄN PHÍ',
    subHeadline: 'Khay Trong Suốt Vô Hình • Ăn Uống Thoải Mái • Tự Tin Giao Tiếp',
    highlightPill: 'Trả Góp 0% Lãi Suất',
    searchHeadline: 'Niềng Răng Trong Suốt Invisalign Nha Khoa Kim - Quét 3D iTero Thấy Kết Quả',
    searchDesc: 'Bác sĩ hạng Platinum trực tiếp lên phác đồ ClinCheck 3D. Khay niềng chính hãng Hoa Kỳ. Trả góp linh hoạt chỉ từ 2 triệu/tháng. Đăng ký ngay!',
    sitelinks: ['Bảng Giá Invisalign 2026', 'Quét 3D iTero Miễn Phí', 'Trả Góp 2Tr/Tháng', 'Feedback Khách Hàng'],
    callouts: ['Khay Mỹ Chính Hãng', 'Bác Sĩ Platinum', 'Quét 3D Miễn Phí', 'Trả Góp 0%'],
    intelGoal: 'Thu hút khách hàng niềng răng thẩm mỹ cao cấp với thiết bị scan 3D iTero.',
    intelHook: 'Quét 3D thấy trước kết quả nụ cười tạo động lực mạnh mẽ để ký hợp đồng niềng răng.',
    intelAudience: 'Giới trẻ 18-35 tuổi, người làm văn phòng, mẫu ảnh, KOLs.',
    intelWeakness: 'Giá gói Invisalign tại Kim từ 80 - 130 triệu, thuộc nhóm đắt nhất thị trường.',
    counterHeadline: 'Niềng Răng Invisalign Tâm Đức Smile - Trả Góp 0% Tặng Gói Tẩy Trắng 3Tr',
    counterDesc: 'Bác sĩ chuyên khoa chỉnh nha trực tiếp điều trị. Tặng máy tăm nước cao cấp và miễn phí quét iTero 5D.',
    counterSitelinks: ['Gói Invisalign Tiết Kiệm', 'Tặng Tẩy Trắng 3Tr', 'Trả Góp Linh Hoạt'],
    counterAdvice: 'Đấu thầu từ khóa "niềng răng invisalign nha khoa kim", tặng quà gói phụ kiện 5 triệu.',
    counterUsp: 'Chi phí Invisalign mềm hơn 20% và tặng kèm toàn bộ gói chăm sóc sau niềng.'
  },
  {
    category: 'porcelain' as const,
    format: 'image' as const,
    platform: 'Google Display Network' as const,
    serviceName: 'Dán Sứ Veneer Emax Không Mài Nhỏ Răng',
    hook: 'Bảo tồn 100% răng thật - Nụ cười chuẩn tỉ lệ vàng',
    theme: 'dark_luxury' as const,
    photoType: 'porcelain_smile' as const,
    badge: 'DÁN SỨ VENEER EMAX',
    headlineMain: 'DÁN SỨ VENEER EMAX KHÔNG MÀI RĂNG - CHỈ DÀY 0.2MM',
    subHeadline: 'Thiết Kế Nụ Cười Chuẩn Nhân Tướng Học • Bảo Hành Chính Hãng 15 Năm',
    highlightPill: 'Không Mài Nhỏ Răng',
    searchHeadline: 'Dán Sứ Veneer Emax Nha Khoa Kim - Bảo Tồn Răng Thật Tối Đa',
    searchDesc: 'Mặt dán sứ siêu mỏng 0.2mm nhập khẩu chính hãng Ivoclar Vivadent Thụy Sĩ. Không ê buốt, không hôi miệng, nụ cười tự nhiên rạng rỡ.',
    sitelinks: ['Bảng Giá Veneer Emax', 'Hình Ảnh Trước Sau', 'Thiết Kế Nụ Cười 3D'],
    callouts: ['Chính Hãng Thụy Sĩ', 'Siêu Mỏng 0.2mm', 'Bảo Hành 15 Năm'],
    intelGoal: 'Thu hút khách thẩm mỹ nụ cười lo ngại bị mài nhỏ răng thật.',
    intelHook: 'Thông điệp "Không mài nhỏ răng" xóa bỏ hoàn toàn nỗi sợ hỏng răng gốc.',
    intelAudience: 'Nữ giới 25-45 tuổi yêu thích làm đẹp tự nhiên.',
    intelWeakness: 'Giá dán sứ Veneer tại Kim từ 8-12 triệu/răng, kén khách làm số lượng nhiều.',
    counterHeadline: 'Dán Sứ Veneer Emax Tâm Đức Smile - Trợ Giá Chỉ 4.5Tr/Răng Chính Hãng',
    counterDesc: 'Thiết kế dáng răng theo phong thủy và tỉ lệ vàng khuôn mặt. Không đau, không mài nhỏ răng. Bảo hành 15 năm.',
    counterSitelinks: ['Veneer Giá 4.5Tr', 'Xem Dáng Răng 3D', 'Bác Sĩ CKI Thực Hiện'],
    counterAdvice: 'Đẩy mạnh GDN Banner với thông điệp "Dán sứ Veneer Emax Thụy Sĩ chỉ 4.5Tr".',
    counterUsp: 'Chính sách giá 4.5Tr cho dòng Emax chính hãng kèm bảo hành 15 năm.'
  },
  {
    category: 'general' as const,
    format: 'video' as const,
    platform: 'YouTube' as const,
    serviceName: 'Nhổ Răng Khôn Sóng Siêu Âm Piezotome Không Đau',
    hook: '5 phút nhổ xong 1 răng - Không sưng má',
    theme: 'white_clean' as const,
    photoType: 'doctor_guide' as const,
    badge: 'SÓNG SIÊU ÂM PIEZOTOME',
    headlineMain: 'NHỔ RĂNG KHÔN BẰNG SÓNG SIÊU ÂM PIEZOTOME - KHÔNG ĐAU',
    subHeadline: 'Nhẹ Nhàng Tách Răng • Lành Thương Cực Nhanh • Ăn Uống Bình Thường',
    highlightPill: 'Không Sưng - Không Đau',
    searchHeadline: 'Nhổ Răng Khôn Không Đau Nha Khoa Kim - Công Nghệ Sóng Siêu Âm Piezotome',
    searchDesc: 'Xử lý răng khôn mọc lệch, mọc ngầm, đâm ngang an toàn tuyệt đối. Chụp CT 3D xác định dây thần kinh miễn phí. Đặt lịch khám ngay!',
    sitelinks: ['Bảng Giá Nhổ Răng Khôn', 'Quy Trình Sóng Siêu Âm', 'Đặt Lịch Không Chờ Đợi'],
    callouts: ['Sóng Siêu Âm Piezotome', 'Không Sưng Má', 'Bác Sĩ Giỏi'],
    intelGoal: 'Khai thác lượng tìm kiếm khổng lồ của khách hàng trẻ tuổi về nhổ răng khôn.',
    intelHook: 'Nỗi sợ đau khi nhổ răng khôn được giải quyết triệt để bằng "sóng siêu âm không đau".',
    intelAudience: 'Sinh viên, người trẻ tuổi 18-30 tuổi.',
    intelWeakness: 'Chi phí nhổ răng khôn tại Kim từ 2.5 - 5 triệu/răng (tính thêm tiền sóng siêu âm).',
    counterHeadline: 'Nhổ Răng Khôn Sóng Siêu Âm Tâm Đức Smile - Chỉ Từ 990K/Răng Trọn Gói',
    counterDesc: 'Tặng trọn bộ Chụp X-Quang Panorex + Thuốc sau nhổ. Bác sĩ CKI nhẹ nhàng thực hiện trong 5 phút. Không đau, không sưng.',
    counterSitelinks: ['Gói Nhổ Răng 990K', 'Miễn Phí Chụp Phim', '17 Chi Nhánh'],
    counterAdvice: 'Đặt thầu vị trí Top 1 từ khóa "nhổ răng khôn giá rẻ tphcm", thông điệp trọn gói từ 990k.',
    counterUsp: 'Mức giá 990k cực kỳ cạnh tranh kèm công nghệ sóng siêu âm êm ái.'
  },
  {
    category: 'general' as const,
    format: 'text' as const,
    platform: 'Google Search' as const,
    serviceName: 'Tẩy Trắng Răng Laser Whitening Bật 3 Tông',
    hook: 'Trắng sáng bật tông sau 45 phút',
    theme: 'invisalign_cyan' as const,
    photoType: 'porcelain_smile' as const,
    badge: 'TẨY TRẮNG LASER 45P',
    headlineMain: 'TẨY TRẮNG RĂNG LASER CÔNG NGHỆ MỸ - TRẮNG SÁNG TỨC THÌ',
    subHeadline: 'Không Ê Buốt • An Toàn Men Răng • Giữ Màu Đến 3 Năm',
    highlightPill: 'Bật 3-5 Tông Sau 45P',
    searchHeadline: 'Tẩy Trắng Răng Laser Nha Khoa Kim - Trắng Sáng Bật Tông Chỉ Sau 45 Phút',
    searchDesc: 'Công nghệ tẩy trắng Laser Beyond Polus Hoa Kỳ. An toàn cho nướu và men răng, không ê buốt. Tặng gói cạo vôi răng & đánh bóng 500k.',
    sitelinks: ['Bảng Giá Tẩy Trắng', 'Hình Ảnh Khách Hàng', 'Đặt Lịch Nhận Quà'],
    callouts: ['Công Nghệ Laser Mỹ', 'Không Ê Buốt', 'Bật 3-5 Tông'],
    intelGoal: 'Thu hút khách hàng cần làm trắng răng cấp tốc đi tiệc, cưới hỏi, phỏng vấn.',
    intelHook: 'Thời gian 45 phút và cam kết không ê buốt.',
    intelAudience: 'Người đi làm, cô dâu chú rể, khách chuẩn bị sự kiện quan trọng.',
    intelWeakness: 'Chi phí tẩy trắng tại Kim từ 2.5 - 3.5 triệu.',
    counterHeadline: 'Tẩy Trắng Răng Laser Hoa Kỳ Tâm Đức Smile - Trọn Gói Chỉ 1.2Tr Tặng Cạo Vôi Răng',
    counterDesc: 'Bật 3-5 tông tức thì trong 45 phút. Gel tẩy trắng chính hãng bảo vệ men răng tuyệt đối. 17 chi nhánh phục vụ chu đáo.',
    counterSitelinks: ['Gói Tẩy Trắng 1.2Tr', 'Tặng Cạo Vôi Răng', 'Chi Nhánh Gần Bạn'],
    counterAdvice: 'Đẩy mạnh quảng cáo Search từ khóa "tẩy trắng răng giá bao nhiêu", "tẩy trắng răng uy tín".',
    counterUsp: 'Mức giá 1.2 triệu hấp dẫn, kèm quà tặng cạo vôi răng miễn phí.'
  }
];

// Generate Full 200 Ads Catalog for Nha Khoa Kim
const ALL_KIM_ADS = generateBrandAds(
  'kim',
  'Nha Khoa Kim',
  'CÔNG TY TNHH NHA KHOA KIM',
  'nhakhoakim.com',
  KIM_BASE_ADS,
  200,
  KIM_TEMPLATES
);

// Other competitors templates & base ads
const VIETHAN_TEMPLATES = KIM_TEMPLATES.map(t => ({
  ...t,
  badge: 'VIỆT HÀN 04 DENTAL',
  headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'VIỆT HÀN 04'),
  searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Nha Khoa Việt Hàn 04'),
  intelWeakness: 'Thường phát sinh phụ phí ghế nha sau khi khách đến khám.',
  counterAdvice: 'Nhấn mạnh cam kết giá trọn gói 100% không phát sinh.'
}));

const SAIGONBH_TEMPLATES = KIM_TEMPLATES.map(t => ({
  ...t,
  badge: 'SÀI GÒN B.H DENTAL',
  headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'SÀI GÒN B.H'),
  searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Nha Khoa Sài Gòn B.H'),
  intelWeakness: 'Chi phí ở phân khúc trung cao, ít khuyến mãi giảm sốc.',
  counterAdvice: 'Đánh mạnh vào ưu đãi đưa đón khách tỉnh và quà tặng kèm.'
}));

const TRONGRANG_TEMPLATES = KIM_TEMPLATES.map(t => ({
  ...t,
  badge: 'CHUYÊN SÂU IMPLANT',
  headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'NHA KHOA TRỒNG RĂNG'),
  searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Nha Khoa Trồng Răng'),
  intelWeakness: 'Chỉ có cơ sở tại trung tâm TP.HCM, khách hàng ở xa khó tiếp cận.',
  counterAdvice: 'Nhấn mạnh hệ thống mạng lưới chi nhánh rộng khắp và xe đưa đón.'
}));

const SAIGONIMPLANT_TEMPLATES = KIM_TEMPLATES.map(t => ({
  ...t,
  badge: 'SÀI GÒN IMPLANT',
  headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'SÀI GÒN IMPLANT'),
  searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Sài Gòn Implant'),
  intelWeakness: 'Thương hiệu mới, số lượng phòng khám ít.',
  counterAdvice: 'Khẳng định uy tín lâu năm trên 100.000 ca điều trị thành công.'
}));

const PARIS_TEMPLATES = KIM_TEMPLATES.map(t => ({
  ...t,
  badge: 'CÔNG NGHỆ PHÁP',
  headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'NHA KHOA PARIS'),
  searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Nha Khoa Paris'),
  intelWeakness: 'Giá mồi thấp nhưng giá thực tế các gói cao cấp tương đối đắt.',
  counterAdvice: 'Tấn công vào sự minh bạch giá và cam kết bằng hợp đồng pháp lý.'
}));

export const TRANSPARENCY_DOMAINS_DATA: Record<string, TransparencyDomainProfile> = {
  'nhakhoakim.com': {
    domain: 'nhakhoakim.com',
    brandName: 'Nha Khoa Kim',
    legalEntity: 'CÔNG TY TNHH NHA KHOA KIM',
    approxActiveAds: 200,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant Máng Định Vị', 'Niềng Răng Invisalign', 'Bọc Răng Sứ Thẩm Mỹ', 'Tẩy Trắng Răng Laser'],
    ads: ALL_KIM_ADS
  },

  'nhakhoaparis.vn': {
    domain: 'nhakhoaparis.vn',
    brandName: 'Nha Khoa Paris',
    legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
    approxActiveAds: 145,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Niềng Răng Mắc Cài 3D Speed', 'Trồng Răng Implant 4S', 'Bọc Răng Sứ Nano Shining', 'Tẩy Trắng Răng WhiteMax'],
    ads: generateBrandAds(
      'paris',
      'Nha Khoa Paris',
      'CÔNG TY CỔ PHẦN NHA KHOA PARIS',
      'nhakhoaparis.vn',
      [],
      145,
      PARIS_TEMPLATES
    )
  },

  'nhakhoaviethan04.com': {
    domain: 'nhakhoaviethan04.com',
    brandName: 'Nha Khoa Việt Hàn 04',
    legalEntity: 'CÔNG TY TNHH NHA KHOA QUỐC TẾ VIỆT HÀN (HỆ THỐNG VIỆT HÀN 04)',
    approxActiveAds: 68,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant Giá Rẻ 5.9Tr', 'Bọc Răng Sứ Thẩm Mỹ 990K', 'Niềng Răng Mắc Cài Trả Góp 0%'],
    ads: generateBrandAds(
      'viethan',
      'Nha Khoa Việt Hàn 04',
      'CÔNG TY TNHH NHA KHOA QUỐC TẾ VIỆT HÀN (HỆ THỐNG VIỆT HÀN 04)',
      'nhakhoaviethan04.com',
      [],
      68,
      VIETHAN_TEMPLATES
    )
  },

  'nhakhoasaigonbh.com': {
    domain: 'nhakhoasaigonbh.com',
    brandName: 'Nha Khoa Sài Gòn B.H',
    legalEntity: 'CÔNG TY TNHH NHA KHOA SÀI GÒN B.H',
    approxActiveAds: 85,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Cấy Ghép Implant Kỹ Thuật Số', 'Chỉnh Nha Niềng Răng Chuyên Sâu', 'Răng Sứ Thẩm Mỹ Cao Cấp'],
    ads: generateBrandAds(
      'saigonbh',
      'Nha Khoa Sài Gòn B.H',
      'CÔNG TY TNHH NHA KHOA SÀI GÒN B.H',
      'nhakhoasaigonbh.com',
      [],
      85,
      SAIGONBH_TEMPLATES
    )
  },

  'nhakhoatrongrang.com': {
    domain: 'nhakhoatrongrang.com',
    brandName: 'Nha Khoa Trồng Răng',
    legalEntity: 'CÔNG TY TNHH NHA KHOA TRỒNG RĂNG SÀI GÒN',
    approxActiveAds: 72,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Chuyên Khoa Cấy Ghép Răng Implant', 'Trồng Răng Toàn Hàm All-on-4 / All-on-6', 'Trồng Răng Không Đau Bác Sĩ CKI'],
    ads: generateBrandAds(
      'trongrang',
      'Nha Khoa Trồng Răng',
      'CÔNG TY TNHH NHA KHOA TRỒNG RĂNG SÀI GÒN',
      'nhakhoatrongrang.com',
      [],
      72,
      TRONGRANG_TEMPLATES
    )
  },

  'saigonimplant.com': {
    domain: 'saigonimplant.com',
    brandName: 'Sài Gòn Implant',
    legalEntity: 'HỆ THỐNG NHA KHOA SÀI GÒN IMPLANT',
    approxActiveAds: 54,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Cấy Ghép Trụ Implant Chuẩn Y Khoa', 'Nâng Xoang Ghép Xương Nhân Tạo', 'Phục Hình Răng Mất Lâu Năm'],
    ads: generateBrandAds(
      'saigonimplant',
      'Sài Gòn Implant',
      'HỆ THỐNG NHA KHOA SÀI GÒN IMPLANT',
      'saigonimplant.com',
      [],
      54,
      SAIGONIMPLANT_TEMPLATES
    )
  },

  'drcareimplant.com': {
    domain: 'drcareimplant.com',
    brandName: 'Dr. Care Implant',
    legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA DR. CARE',
    approxActiveAds: 90,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Trồng Răng Implant Người Trung Niên', 'Cấy Ghép Implant Toàn Hàm', 'Liệu Pháp Trồng Răng Không Đau'],
    ads: generateBrandAds(
      'drcare',
      'Dr. Care Implant',
      'CÔNG TY CỔ PHẦN NHA KHOA DR. CARE',
      'drcareimplant.com',
      [],
      90,
      KIM_TEMPLATES.map(t => ({
        ...t,
        badge: 'DR. CARE IMPLANT',
        headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'DR. CARE'),
        searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Dr. Care Implant')
      }))
    )
  },

  'nhakhoashark.vn': {
    domain: 'nhakhoashark.vn',
    brandName: 'Nha Khoa Shark',
    legalEntity: 'CÔNG TY CỔ PHẦN NHA KHOA THẨM MỸ SHARK',
    approxActiveAds: 110,
    isVerified: true,
    description: 'Miền này bao gồm kết quả cho nhiều tài khoản nhà quảng cáo có quảng cáo trỏ đến miền này. Bạn có thể lọc theo từng nhà quảng cáo bên dưới.',
    primaryServices: ['Bọc Răng Sứ Thẩm Mỹ Khuyến Mãi', 'Cấy Ghép Răng Implant Ưu Đãi', 'Niềng Răng Mắc Cài Trả Góp'],
    ads: generateBrandAds(
      'shark',
      'Nha Khoa Shark',
      'CÔNG TY CỔ PHẦN NHA KHOA THẨM MỸ SHARK',
      'nhakhoashark.vn',
      [],
      110,
      KIM_TEMPLATES.map(t => ({
        ...t,
        badge: 'NHA KHOA SHARK',
        headlineMain: t.headlineMain.replace('NHA KHOA KIM', 'NHA KHOA SHARK'),
        searchHeadline: t.searchHeadline.replace('Nha Khoa Kim', 'Nha Khoa Shark')
      }))
    )
  }
};
