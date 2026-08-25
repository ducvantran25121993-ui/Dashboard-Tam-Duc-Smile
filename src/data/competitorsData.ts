export interface CompetitorData {
  id: string;
  name: string;
  domain: string;
  brandColor: string;
  isSelf?: boolean;
  impressionShare: number; // %
  overlapRate: number; // %
  outrankingShare: number; // %
  topOfPageRate: number; // %
  absTopOfPageRate: number; // %
  estimatedMonthlyBudget: string;
  mainServices: string[];
  strengths: string[];
  weaknesses: string[];
  currentPromotion: string;
  sampleAd: {
    headline: string;
    description: string;
    sitelinks: string[];
    callout: string;
  };
  pricingComparison: {
    implant: string;
    suCercon: string;
    invisalign: string;
    nhorang: string;
  };
  threatLevel: 'Cao' | 'Trung bình' | 'Thấp';
  targetRegion: string;
}

export const TWENTY_COMPETITORS: CompetitorData[] = [
  {
    id: 'self',
    name: 'Hệ Thống Của Bạn (Tâm Đức Smile)',
    domain: 'nhakhoatamducsmile.com',
    brandColor: 'from-cyan-500 to-emerald-400',
    isSelf: true,
    impressionShare: 43.5,
    overlapRate: 100,
    outrankingShare: 100,
    topOfPageRate: 84.2,
    absTopOfPageRate: 46.8,
    estimatedMonthlyBudget: '150 - 220 Tr',
    mainServices: ['Trồng răng Implant', 'Bọc Răng Sứ', 'Niềng Răng', 'Nhổ Răng Khôn'],
    strengths: ['Bác sĩ chuyên khoa >15 năm', 'Bảo hành điện tử ID Card', 'Trả góp 0%', 'Công nghệ Piezotome'],
    weaknesses: ['Độ phủ thương hiệu tuyến tỉnh phía Bắc chưa sâu'],
    currentPromotion: 'Tặng CT Cone Beam 3D (1.5 Tr) + Trả góp 0% + Giảm 30% trụ Implant',
    sampleAd: {
      headline: 'Trồng Răng Implant Chuẩn Y Khoa | Bác Sĩ CKI Trực Tiếp Khám',
      description: 'Công nghệ cấy ghép không đau với sóng siêu âm Piezotome. Bảo hành trọn đời, hỗ trợ trả góp 0% lãi suất. Đặt hẹn giữ ưu đãi ngay hôm nay!',
      sitelinks: ['Bảng Giá Trụ Implant 2026', 'Đội Ngũ Bác Sĩ Chuyên Gia', 'Hình Ảnh Khách Hàng', 'Đăng Ký Khám Miễn Phí'],
      callout: 'Khám Miễn Phí • Trả Góp 0% • Trụ Nhập Khẩu 100%'
    },
    pricingComparison: {
      implant: '11.5 Tr - 26 Tr / trụ',
      suCercon: '3.8 Tr - 6.5 Tr / răng',
      invisalign: '45 Tr - 95 Tr / gói',
      nhorang: '800k - 2.5 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'TP.HCM & Miền Tây (Cần Thơ, Cà Mau, Tiền Giang, Vĩnh Long)'
  },
  {
    id: 'comp-1',
    name: 'Nha Khoa Kim',
    domain: 'nhakhoakim.com',
    brandColor: 'from-blue-600 to-indigo-600',
    impressionShare: 38.2,
    overlapRate: 72.4,
    outrankingShare: 41.5,
    topOfPageRate: 78.6,
    absTopOfPageRate: 39.2,
    estimatedMonthlyBudget: '350 - 500 Tr',
    mainServices: ['Implant', 'Răng Sứ', 'Niềng Răng', 'Nha Khoa Trẻ Em'],
    strengths: ['Hệ thống hơn 30 chi nhánh toàn quốc', 'Đầu tư thương hiệu TV/KOLs rất mạnh', 'Quy trình chuẩn ISO'],
    weaknesses: ['Chi phí dịch vụ cao hơn mặt bằng chung', 'Tỷ lệ khách phàn nàn về phát sinh phụ phí'],
    currentPromotion: 'Đại tiệc nụ cười - Ưu đãi Implant giảm 25% + Tặng gói chăm sóc răng 1 năm',
    sampleAd: {
      headline: 'Nha Khoa Kim - Chuẩn Quốc Tế ISO | Hệ Thống 30+ Phòng Khám',
      description: 'Trồng răng Implant kỹ thuật số Safi không đau. Đội ngũ bác sĩ tu nghiệp nước ngoài. Đặt hẹn ngay nhận ưu đãi 25%.',
      sitelinks: ['Chi Nhánh Gần Bạn', 'Bảng Giá Niêm Yết', 'Bác Sĩ Giỏi', 'Ưu Đãi Tháng Này'],
      callout: 'Chuẩn ISO 9001:2015 • Máy CT 3D Hiện Đại • Trả Góp Linh Hoạt'
    },
    pricingComparison: {
      implant: '14 Tr - 32 Tr / trụ',
      suCercon: '4.5 Tr - 8 Tr / răng',
      invisalign: '55 Tr - 110 Tr / gói',
      nhorang: '1.2 Tr - 3.5 Tr / răng'
    },
    threatLevel: 'Cao',
    targetRegion: 'Toàn quốc (TP.HCM, Hà Nội, Bình Dương, Đồng Nai, Tiền Giang)'
  },
  {
    id: 'comp-2',
    name: 'Nha Khoa Paris',
    domain: 'nhakhoaparis.vn',
    brandColor: 'from-rose-600 to-red-600',
    impressionShare: 34.6,
    overlapRate: 65.8,
    outrankingShare: 38.2,
    topOfPageRate: 72.4,
    absTopOfPageRate: 32.1,
    estimatedMonthlyBudget: '280 - 400 Tr',
    mainServices: ['Niềng Răng Mắc Cài', 'Invisalign', 'Bọc Răng Sứ Thẩm Mỹ'],
    strengths: ['Mạnh mảng chỉnh nha niềng răng & sinh viên', 'Content video TikTok/Reels viral tốt', 'Chiết khấu giá niềng hấp dẫn'],
    weaknesses: ['Khâu chăm sóc sau điều trị (After-care) hay bị quá tải', 'CPA mảng Implant khá cao'],
    currentPromotion: 'Niềng răng sinh viên chỉ từ 18 Triệu - Trả góp 1 triệu/tháng không lãi suất',
    sampleAd: {
      headline: 'Niềng Răng Paris Tiêu Chuẩn Pháp | Trả Góp Chỉ 1Tr/Tháng',
      description: 'Công nghệ niềng răng 3D Speed rút ngắn 6 tháng. Thấy trước kết quả sau 3 ngày với máy quét Trios 3D.',
      sitelinks: ['Niềng Răng Trả Góp 0%', 'Khay Trong Suốt', 'Bác Sĩ Niềng Giỏi', 'Bảng Giá Răng Sứ'],
      callout: 'Công Nghệ Pháp • Trả Góp 1Tr/Tháng • Rút Ngắn 6 Tháng'
    },
    pricingComparison: {
      implant: '13 Tr - 28 Tr / trụ',
      suCercon: '4 Tr - 7.5 Tr / răng',
      invisalign: '40 Tr - 85 Tr / gói',
      nhorang: '900k - 2.8 Tr / răng'
    },
    threatLevel: 'Cao',
    targetRegion: 'TP.HCM, Hà Nội, Đà Nẵng, Hải Phòng'
  },
  {
    id: 'comp-3',
    name: 'Nha Khoa I-Dent',
    domain: 'nhakhoaident.com',
    brandColor: 'from-amber-600 to-orange-600',
    impressionShare: 29.8,
    overlapRate: 58.4,
    outrankingShare: 34.0,
    topOfPageRate: 69.5,
    absTopOfPageRate: 28.6,
    estimatedMonthlyBudget: '200 - 300 Tr',
    mainServices: ['Trồng Răng Implant Kiều Bào', 'Trồng Răng Toàn Hàm All-on-4 / All-on-6'],
    strengths: ['Rất mạnh phân khúc Việt kiều & Implant toàn hàm', 'TS.BS đầu ngành trực tiếp phẫu thuật', 'Website chuẩn SEO y khoa'],
    weaknesses: ['Chiến dịch Search tập trung hẹp, ít đa dạng mảng thẩm mỹ trẻ'],
    currentPromotion: 'Gói Implant Kiều Bào: Đón sân bay miễn phí + Tặng phòng nghỉ khách sạn + Bảo hành quốc tế',
    sampleAd: {
      headline: 'Trồng Răng Implant I-Dent | TS.BS Đắc Khoa Thực Hiện',
      description: 'Chuyên khoa trồng răng Implant kiều bào hàng đầu TP.HCM. Cấy ghép tức thì sau 3 ngày có răng ăn nhai. Bảo hành trọn đời.',
      sitelinks: ['Bảng Giá Trồng Răng 2026', 'Implant Toàn Hàm All-on-4', 'Chính Sách Cho Kiều Bào', 'Tư Vấn Online 24/7'],
      callout: 'TS.BS Tu Nghiệp Pháp • Đưa Đón Sân Bay • Bảo Hành Trọn Đời'
    },
    pricingComparison: {
      implant: '12 Tr - 35 Tr / trụ',
      suCercon: '4.2 Tr - 7 Tr / răng',
      invisalign: '50 Tr - 100 Tr / gói',
      nhorang: '1 Tr - 3 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'TP.HCM (Bình Thạnh, Quận 5) & Khách Kiều Bào'
  },
  {
    id: 'comp-4',
    name: 'Nha Khoa Parkway',
    domain: 'parkway.com.vn',
    brandColor: 'from-teal-600 to-cyan-600',
    impressionShare: 24.5,
    overlapRate: 46.2,
    outrankingShare: 29.5,
    topOfPageRate: 65.2,
    absTopOfPageRate: 22.4,
    estimatedMonthlyBudget: '180 - 260 Tr',
    mainServices: ['Niềng Răng Trẻ Em', 'Invisalign Black Diamond', 'Nha Khoa Thẩm Mỹ'],
    strengths: ['Hạng Black Diamond Provider Invisalign', 'Không gian phòng khám cao cấp', 'Tập khách hàng thu nhập cao'],
    weaknesses: ['Giá dịch vụ đắt hơn 20-30% so với thị trường', 'Chiến dịch Implant yếu hơn'],
    currentPromotion: 'Ngày hội Invisalign - Scan răng miễn phí với iTero 5D + Giảm ngay 15 Triệu',
    sampleAd: {
      headline: 'Niềng Răng Invisalign Parkway | Top 1 Hạng Black Diamond',
      description: 'Trung tâm chỉnh nha Invisalign hàng đầu Đông Nam Á. Xem trước kết quả 3D ClinCheck. Trả góp 0% lãi suất.',
      sitelinks: ['Gói Niềng Răng Trẻ Em', 'Invisalign Người Lớn', 'Đặt Hẹn Scan 3D', 'Bảng Giá Chi Tiết'],
      callout: 'Black Diamond Invisalign • Scan iTero 5D • Trả Góp 0%'
    },
    pricingComparison: {
      implant: '16 Tr - 38 Tr / trụ',
      suCercon: '5 Tr - 9 Tr / răng',
      invisalign: '60 Tr - 125 Tr / gói',
      nhorang: '1.5 Tr - 4 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'TP.HCM, Hà Nội, Bình Dương'
  },
  {
    id: 'comp-5',
    name: 'Nha Khoa Flora',
    domain: 'nhakhoaflora.com',
    brandColor: 'from-pink-600 to-purple-600',
    impressionShare: 19.4,
    overlapRate: 38.0,
    outrankingShare: 22.8,
    topOfPageRate: 58.6,
    absTopOfPageRate: 18.2,
    estimatedMonthlyBudget: '120 - 180 Tr',
    mainServices: ['Implant Không Đau Thụy Sĩ', 'Bọc Răng Sứ Không Mài Nhỏ'],
    strengths: ['Định vị "Nha khoa êm dịu không đau"', 'Thiết kế thương hiệu trẻ trung, sang trọng'],
    weaknesses: ['Số lượng ghế khám ít, hay kín lịch', 'Ngân sách Search mỏng ở các từ khóa ngách'],
    currentPromotion: 'Trồng răng êm ái - Tặng gói tiền mê giảm đau trị giá 3 Triệu',
    sampleAd: {
      headline: 'Nha Khoa Êm Ái Flora | Trồng Răng Không Đau Chuẩn Thụy Sĩ',
      description: 'Trải nghiệm trồng răng và nhổ răng không đau với công nghệ độc quyền. Không sưng, lành thương nhanh.',
      sitelinks: ['Công Nghệ Không Đau', 'Bác Sĩ Flora', 'Bảng Giá Ưu Đãi', 'Tư Vấn Miễn Phí'],
      callout: 'Công Nghệ Êm Dịu • Trụ Thụy Sĩ Chính Hãng • Bảo Hành 15 Năm'
    },
    pricingComparison: {
      implant: '13.5 Tr - 30 Tr / trụ',
      suCercon: '4.2 Tr - 7.5 Tr / răng',
      invisalign: '52 Tr - 98 Tr / gói',
      nhorang: '1 Tr - 3 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'TP.HCM (Quận 1, Quận 7)'
  },
  {
    id: 'comp-6',
    name: 'Nha Khoa Peace Dentistry',
    domain: 'nhakhoapeace.com',
    brandColor: 'from-emerald-600 to-teal-700',
    impressionShare: 26.8,
    overlapRate: 51.2,
    outrankingShare: 31.4,
    topOfPageRate: 67.8,
    absTopOfPageRate: 25.3,
    estimatedMonthlyBudget: '160 - 240 Tr',
    mainServices: ['Cấy Ghép Implant', 'Thẩm Mỹ Răng Sứ', 'Chỉnh Nha Chuyên Sâu'],
    strengths: ['Đội ngũ bác sĩ ĐH Y Dược TP.HCM', 'Công khai minh bạch xuất xứ vật liệu', 'Chuyên môn y khoa chuẩn mực'],
    weaknesses: ['Ít chạy các gói khuyến mãi sốc, tiếp cận khách hàng trẻ chậm hơn'],
    currentPromotion: 'Ưu đãi Implant Straumann & bảo hành trọn đời bằng văn bản cam kết',
    sampleAd: {
      headline: 'Nha Khoa Peace Dentistry | Bác Sĩ ĐH Y Dược Trực Tiếp Điều Trị',
      description: 'Hơn 18 năm kinh nghiệm cấy ghép Implant và răng sứ thẩm mỹ. 100% bác sĩ tốt nghiệp chính quy ĐH Y Dược TP.HCM.',
      sitelinks: ['Bác Sĩ Trưởng Khoa', 'Bảng Giá Niêm Yết', 'Cam Kết Bảo Hành', 'Đặt Hẹn Khám'],
      callout: '100% Bác Sĩ Y Dược • Trụ Nhập Khẩu • Minh Bạch Chi Phí'
    },
    pricingComparison: {
      implant: '13 Tr - 34 Tr / trụ',
      suCercon: '4.5 Tr - 8 Tr / răng',
      invisalign: '55 Tr - 105 Tr / gói',
      nhorang: '1 Tr - 3.2 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'TP.HCM (Quận 1, Quận 7, Quận 10)'
  },
  {
    id: 'comp-7',
    name: 'Nha Khoa Đông Nam',
    domain: 'nhakhoadongnam.com',
    brandColor: 'from-blue-700 to-cyan-600',
    impressionShare: 22.4,
    overlapRate: 44.6,
    outrankingShare: 27.2,
    topOfPageRate: 63.5,
    absTopOfPageRate: 21.0,
    estimatedMonthlyBudget: '140 - 200 Tr',
    mainServices: ['Trồng Răng Implant Giá Tốt', 'Bọc Răng Sứ', 'Cắt Nướu'],
    strengths: ['Chuyên sâu Implant phân khúc trung bình', 'Hỗ trợ khách tỉnh chi phí đi lại', 'Nhiều case thực tế lâu năm'],
    weaknesses: ['Website và giao diện nhận diện thương hiệu truyền thống, chưa hiện đại'],
    currentPromotion: 'Trồng răng trọn gói tặng Abutment & Mão sứ trên Implant trị giá 2.5 Triệu',
    sampleAd: {
      headline: 'Trồng Răng Implant Đông Nam | Tặng Mão Răng Sứ 2.5 Triệu',
      description: 'Chuyên khoa cấy ghép Implant 15 năm uy tín. Miễn phí chụp phim CT Scanner 3D & xét nghiệm máu trước phẫu thuật.',
      sitelinks: ['Chi Phí Trọn Gói', 'Ưu Đãi Cấy Ghép', 'Hình Ảnh Trước Sau', 'Tư Vấn Miễn Phí'],
      callout: 'Tặng Răng Sứ 2.5Tr • Miễn Phí CT 3D • Bảo Hành Lâu Dài'
    },
    pricingComparison: {
      implant: '11 Tr - 25 Tr / trụ',
      suCercon: '3.5 Tr - 6 Tr / răng',
      invisalign: '45 Tr - 85 Tr / gói',
      nhorang: '700k - 2.2 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'TP.HCM (Phú Nhuận, Bình Thạnh) & Khách Tỉnh'
  },
  {
    id: 'comp-8',
    name: 'Nha Khoa Elite Dental',
    domain: 'elitedental.com.vn',
    brandColor: 'from-amber-700 to-yellow-600',
    impressionShare: 21.0,
    overlapRate: 40.5,
    outrankingShare: 24.6,
    topOfPageRate: 66.0,
    absTopOfPageRate: 24.8,
    estimatedMonthlyBudget: '150 - 230 Tr',
    mainServices: ['Implant Chuyên Sâu', 'Niềng Răng Trẻ Em & Người Lớn', 'Nha Khoa Tổng Quát'],
    strengths: ['Phòng khám cao cấp chuẩn quốc tế', 'Đội ngũ chuyên gia tu nghiệp Pháp & Nhật', 'Tỷ lệ khách hàng hài lòng cao'],
    weaknesses: ['Mức giá thuộc phân khúc cao cấp (Premium), kén khách hàng bình dân'],
    currentPromotion: 'Gói chăm sóc răng gia đình toàn diện & Tư vấn chỉnh nha không mắc cài',
    sampleAd: {
      headline: 'Elite Dental Vietnam | Trung Tâm Nha Khoa Chuyên Sâu Quốc Tế',
      description: 'Điều trị toàn diện với triết lý bảo tồn răng thật tối đa. Đội ngũ Tiến sĩ, Thạc sĩ trực tiếp thăm khám và lên phác đồ.',
      sitelinks: ['Đội Ngũ Chuyên Gia', 'Cấy Ghép Implant', 'Chỉnh Nha Invisalign', 'Không Gian Phòng Khám'],
      callout: 'Bác Sĩ Tu Nghiệp Pháp • Máy Móc Tiêu Chuẩn Châu Âu • Bảo Tồn Tối Đa'
    },
    pricingComparison: {
      implant: '16 Tr - 40 Tr / trụ',
      suCercon: '5.5 Tr - 9.5 Tr / răng',
      invisalign: '65 Tr - 130 Tr / gói',
      nhorang: '1.5 Tr - 4.5 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'TP.HCM (Quận 2, Quận 3) & Khách Nước Ngoài'
  },
  {
    id: 'comp-9',
    name: 'Nha Khoa ViDental',
    domain: 'nhakhoavidental.com',
    brandColor: 'from-red-600 to-orange-600',
    impressionShare: 18.5,
    overlapRate: 36.2,
    outrankingShare: 21.0,
    topOfPageRate: 59.0,
    absTopOfPageRate: 17.5,
    estimatedMonthlyBudget: '130 - 190 Tr',
    mainServices: ['Trồng Răng ViDental Care', 'Niềng Răng Thẩm Mỹ', 'Trị Viêm Lợi'],
    strengths: ['Mạng lưới truyền thông đa kênh phủ sóng mạnh trên Google/Facebook', 'Hệ sinh thái nha khoa phức hợp'],
    weaknesses: ['Chi nhánh phía Nam chưa nhiều bằng phía Bắc'],
    currentPromotion: 'Trồng răng công nghệ từ tính không đau - Trả góp 0% lãi suất xét duyệt 5 phút',
    sampleAd: {
      headline: 'ViDental - Viện Nha Khoa Thẩm Mỹ | Công Nghệ Trồng Răng Từ Tính',
      description: 'Hệ thống nha khoa chuẩn Quốc tế. Cam kết hiệu quả bằng văn bản, trả góp 0% liên kết 25 ngân hàng.',
      sitelinks: ['Gói Trồng Răng ViDental', 'Bảng Giá Mới Nhất', 'Khách Hàng Review', 'Đăng Ký Online'],
      callout: 'Công Nghệ Từ Tính • Không Đau • Trả Góp 0% Duyệt Nhanh'
    },
    pricingComparison: {
      implant: '12 Tr - 27 Tr / trụ',
      suCercon: '3.9 Tr - 7 Tr / răng',
      invisalign: '48 Tr - 92 Tr / gói',
      nhorang: '800k - 2.6 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'Hà Nội & TP.HCM'
  },
  {
    id: 'comp-10',
    name: 'Nha Khoa Nhân Tâm',
    domain: 'nhakhoanhantam.com',
    brandColor: 'from-sky-700 to-indigo-800',
    impressionShare: 25.1,
    overlapRate: 48.0,
    outrankingShare: 28.5,
    topOfPageRate: 68.2,
    absTopOfPageRate: 26.4,
    estimatedMonthlyBudget: '170 - 250 Tr',
    mainServices: ['Implant Navigation Robot X-Guide', 'Răng Sứ Thẩm Mỹ', 'Phẫu Thuật Hàm'],
    strengths: ['TS.BS Võ Văn Nhân (chuyên gia Implant đầu ngành)', 'Ứng dụng định vị Robot X-Guide cấy ghép chính xác', 'Thương hiệu hơn 25 năm'],
    weaknesses: ['Chi phí khám chuyên gia cao, thời gian đặt lịch bác sĩ trưởng khoa khá lâu'],
    currentPromotion: 'Ứng dụng định vị X-Guide cấy ghép Implant chuẩn xác gấp 11 lần không lật vạt',
    sampleAd: {
      headline: 'Nha Khoa Nhân Tâm | TS.BS Võ Văn Nhân Trực Tiếp Điều Trị',
      description: 'Ứng dụng công nghệ Robot định vị X-Guide cấy ghép Implant an toàn, chính xác tuyệt đối. 25+ năm uy tín tại TP.HCM.',
      sitelinks: ['Công Nghệ Robot X-Guide', 'TS.BS Võ Văn Nhân', 'Bảng Giá Trụ Implant', 'Liên Hệ Đặt Lịch'],
      callout: 'Robot Định Vị X-Guide • Chuyên Gia 25 Năm • Chính Xác Tuyệt Đối'
    },
    pricingComparison: {
      implant: '14.5 Tr - 38 Tr / trụ',
      suCercon: '4.8 Tr - 8.5 Tr / răng',
      invisalign: '58 Tr - 115 Tr / gói',
      nhorang: '1.2 Tr - 3.5 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'TP.HCM (Quận 10) & Khách Quốc Tế'
  },
  {
    id: 'comp-11',
    name: 'Nha Khoa Sài Gòn B.H',
    domain: 'nhakhoasaigon.vn',
    brandColor: 'from-blue-600 to-cyan-500',
    impressionShare: 17.8,
    overlapRate: 35.0,
    outrankingShare: 20.4,
    topOfPageRate: 57.5,
    absTopOfPageRate: 16.8,
    estimatedMonthlyBudget: '100 - 160 Tr',
    mainServices: ['Implant', 'Niềng Răng', 'Nha Khoa Gia Đình'],
    strengths: ['Chiếm lĩnh thị phần khu vực Đồng Nai & Biên Hòa', 'Chi phí hợp lý cho công nhân & hộ gia đình'],
    weaknesses: ['Độ phủ tại trung tâm TP.HCM còn mỏng'],
    currentPromotion: 'Trồng răng Implant trả góp 0% lãi suất chỉ từ 990k/tháng',
    sampleAd: {
      headline: 'Nha Khoa Sài Gòn B.H | Hệ Thống Nha Khoa Uy Tín Biên Hòa & TP.HCM',
      description: 'Khám răng chuẩn y khoa với đội ngũ bác sĩ lành nghề. Trả góp linh hoạt không lãi suất, chi phí minh bạch.',
      sitelinks: ['Chi Nhánh Biên Hòa', 'Chi Nhánh TP.HCM', 'Bảng Giá Dịch Vụ', 'Đặt Hẹn Ngay'],
      callout: 'Trả Góp 990k/Tháng • Bác Sĩ Giỏi • Thiết Bị Hiện Đại'
    },
    pricingComparison: {
      implant: '10.5 Tr - 24 Tr / trụ',
      suCercon: '3.2 Tr - 5.8 Tr / răng',
      invisalign: '42 Tr - 82 Tr / gói',
      nhorang: '600k - 2 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'Đồng Nai (Biên Hòa), Bình Dương & Thủ Đức'
  },
  {
    id: 'comp-12',
    name: 'Nha Khoa Trồng Răng Sài Gòn',
    domain: 'nhakhoatrongrang.com',
    brandColor: 'from-emerald-700 to-green-600',
    impressionShare: 20.5,
    overlapRate: 39.8,
    outrankingShare: 23.5,
    topOfPageRate: 61.2,
    absTopOfPageRate: 19.5,
    estimatedMonthlyBudget: '120 - 170 Tr',
    mainServices: ['Trồng Răng Khắc Phục Mất Răng', 'Trồng Răng Sứ', 'Implant Nhanh'],
    strengths: ['Tên miền SEO trực tiếp đúng từ khóa tìm kiếm (nhakhoatrongrang.com)', 'Tập trung chuyên sâu giải pháp mất răng'],
    weaknesses: ['Mảng niềng răng và nha khoa trẻ em gần như không đẩy mạnh'],
    currentPromotion: 'Giảm 50% chi phí trồng răng sứ trên Implant & Tặng gói chụp CT Cone Beam 3D',
    sampleAd: {
      headline: 'Trung Tâm Trồng Răng Sài Gòn | Trồng Răng Implant Chuẩn Chuyên Khoa',
      description: 'Giải pháp khôi phục răng mất hoàn hảo ăn nhai như răng thật. Bác sĩ 15 năm kinh nghiệm, trang thiết bị đồng bộ.',
      sitelinks: ['Bảng Giá Trồng Răng', 'Quy Trình Cấy Ghép', 'Hình Ảnh Thực Tế', 'Tư Vấn Trực Tuyến'],
      callout: 'Chuyên Sâu Trồng Răng • Giảm 50% Mão Sứ • Khám Miễn Phí'
    },
    pricingComparison: {
      implant: '11 Tr - 26 Tr / trụ',
      suCercon: '3.6 Tr - 6.2 Tr / răng',
      invisalign: '45 Tr - 88 Tr / gói',
      nhorang: '750k - 2.4 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'TP.HCM (Quận 10, Quận 5)'
  },
  {
    id: 'comp-13',
    name: 'Nha Khoa Đại Nam',
    domain: 'nhakhoadainam.vn',
    brandColor: 'from-red-700 to-rose-600',
    impressionShare: 27.5,
    overlapRate: 53.0,
    outrankingShare: 32.0,
    topOfPageRate: 70.1,
    absTopOfPageRate: 27.2,
    estimatedMonthlyBudget: '220 - 320 Tr',
    mainServices: ['Trồng Răng Implant', 'Răng Sứ Thẩm Mỹ', 'Niềng Răng'],
    strengths: ['Hơn 30 chi nhánh khắp TP.HCM & các tỉnh Miền Tây, Đông Nam Bộ', 'Có labo sản xuất răng sứ riêng', 'Chính sách bảo hành dài hạn'],
    weaknesses: ['Chất lượng dịch vụ giữa các cơ sở tỉnh và trung tâm chưa đồng đều'],
    currentPromotion: 'Trồng răng Implant công nghệ Hoa Kỳ giảm 30% + Miễn phí chụp CT 3D',
    sampleAd: {
      headline: 'Nha Khoa Đại Nam | Hệ Thống 30+ Chi Nhánh Uy Tín Toàn Quốc',
      description: 'Hơn 20 năm phục vụ nụ cười. Sở hữu Labo răng sứ độc quyền, công nghệ cấy ghép Implant không đau chuẩn Hoa Kỳ.',
      sitelinks: ['Chi Nhánh Gần Nhất', 'Bảng Giá Răng Sứ', 'Ưu Đãi Trồng Răng', 'Đặt Hẹn Bác Sĩ'],
      callout: '30+ Chi Nhánh • Labo Riêng • Bảo Hành Dài Hạn'
    },
    pricingComparison: {
      implant: '12 Tr - 28 Tr / trụ',
      suCercon: '3.8 Tr - 6.8 Tr / răng',
      invisalign: '45 Tr - 95 Tr / gói',
      nhorang: '800k - 2.5 Tr / răng'
    },
    threatLevel: 'Cao',
    targetRegion: 'TP.HCM, Cần Thơ, Bình Dương, Tiền Giang, Bến Tre'
  },
  {
    id: 'comp-14',
    name: 'Nha Khoa Shark',
    domain: 'nhakhoashark.vn',
    brandColor: 'from-cyan-700 to-blue-800',
    impressionShare: 24.2,
    overlapRate: 47.8,
    outrankingShare: 26.5,
    topOfPageRate: 64.0,
    absTopOfPageRate: 23.0,
    estimatedMonthlyBudget: '200 - 300 Tr',
    mainServices: ['Bọc Răng Sứ Thẩm Mỹ', 'Niềng Răng Sinh Viên', 'Trồng Răng Implant'],
    strengths: ['Marketing phủ sóng mạng xã hội và KOLs rất mạnh', 'Giá dịch vụ mềm, đánh mạnh vào giới trẻ & sinh viên', 'Ưu đãi liên tục'],
    weaknesses: ['Độ chuyên sâu mảng Implant toàn hàm phức tạp chưa bằng các bệnh viện lớn'],
    currentPromotion: 'Bọc răng sứ chỉ từ 999k/răng + Niềng răng sinh viên trả góp 1tr/tháng',
    sampleAd: {
      headline: 'Nha Khoa Shark Chuẩn Đức | Bọc Răng Sứ Trả Góp 0%',
      description: 'Trải nghiệm dịch vụ nha khoa chuẩn Đức không đau. Tặng gói chăm sóc răng miệng trọn đời khi đặt lịch hôm nay.',
      sitelinks: ['Bọc Răng Sứ 999k', 'Niềng Răng Trả Góp', 'Bác Sĩ Giỏi', 'Đăng Ký Nhận Ưu Đãi'],
      callout: 'Chuẩn Đức • Trả Góp 0% • Thấy Trước Nụ Cười'
    },
    pricingComparison: {
      implant: '10 Tr - 24 Tr / trụ',
      suCercon: '2.5 Tr - 5.5 Tr / răng',
      invisalign: '38 Tr - 78 Tr / gói',
      nhorang: '500k - 1.8 Tr / răng'
    },
    threatLevel: 'Cao',
    targetRegion: 'TP.HCM (Quận 10, Gò Vấp, Thủ Đức) & Hà Nội'
  },
  {
    id: 'comp-15',
    name: 'Nha Khoa Viet Smile',
    domain: 'nhakhoavietsmile.com',
    brandColor: 'from-pink-700 to-rose-500',
    impressionShare: 21.8,
    overlapRate: 42.1,
    outrankingShare: 25.0,
    topOfPageRate: 65.5,
    absTopOfPageRate: 22.8,
    estimatedMonthlyBudget: '150 - 220 Tr',
    mainServices: ['Dán Sứ Veneer', 'Niềng Răng Mắc Cài & Máng Trong Suốt', 'Nhổ Răng Piezotome'],
    strengths: ['Thế mạnh số 1 về Dán sứ Veneer bảo tồn răng & Chỉnh nha thẩm mỹ', 'Hình ảnh truyền thông sang trọng, chuyên nghiệp'],
    weaknesses: ['Mảng Implant không phải trọng tâm marketing chính'],
    currentPromotion: 'Dán sứ Veneer Emax bảo tồn 100% tủy răng tặng kèm gói làm trắng Laser Whitening',
    sampleAd: {
      headline: 'Nha Khoa Viet Smile | Dán Sứ Veneer Bảo Tồn Răng Gốc',
      description: 'Chuyên khoa thẩm mỹ nụ cười & niềng răng chuyên sâu. Bác sĩ trưởng khoa trực tiếp thực hiện, cam kết không đau không biến chứng.',
      sitelinks: ['Dán Sứ Veneer Emax', 'Niềng Răng Trả Góp', 'Bảng Giá Mới Nhất', 'Khám & Tư Vấn'],
      callout: 'Bảo Tồn Răng Thật • Bác Sĩ CKI • Bảo Hành 15 Năm'
    },
    pricingComparison: {
      implant: '13 Tr - 30 Tr / trụ',
      suCercon: '4.5 Tr - 8.5 Tr / răng',
      invisalign: '48 Tr - 98 Tr / gói',
      nhorang: '1 Tr - 2.8 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'Hà Nội & TP.HCM (Quận 10, Bình Thạnh)'
  },
  {
    id: 'comp-16',
    name: 'Nha Khoa Dr. Care Implant',
    domain: 'drcareimplant.com',
    brandColor: 'from-emerald-800 to-teal-900',
    impressionShare: 28.9,
    overlapRate: 56.4,
    outrankingShare: 33.5,
    topOfPageRate: 74.0,
    absTopOfPageRate: 31.2,
    estimatedMonthlyBudget: '250 - 380 Tr',
    mainServices: ['Trồng Răng Implant Người Trung Niên', 'All-on-4 / All-on-6 Không Đau'],
    strengths: ['Định vị ngách độc quyền số 1: Nha khoa chuyên sâu trồng răng Implant cho người trung niên', 'Liệu pháp trồng răng không đau độc quyền 12 bước'],
    weaknesses: ['Chỉ làm duy nhất Implant, không làm niềng răng hay răng sứ thẩm mỹ phổ thông'],
    currentPromotion: 'Trồng răng Implant không đau cho người lớn tuổi - Hỗ trợ xe đưa đón tận nhà',
    sampleAd: {
      headline: 'Nha Khoa Dr. Care | Chuyên Sâu Trồng Răng Implant Người Trung Niên',
      description: 'Nha khoa đầu tiên tại VN chỉ chuyên sâu cấy ghép Implant cho người trung niên. Liệu pháp trồng răng không đau chuẩn quốc tế.',
      sitelinks: ['Bảng Giá Trụ Implant 2026', 'Trồng Răng Toàn Hàm', 'Liệu Pháp Không Đau', 'Đăng Ký Tư Vấn'],
      callout: 'Chuyên Sâu Trung Niên • Liệu Pháp Không Đau • Đưa Đón Tận Nhà'
    },
    pricingComparison: {
      implant: '13.5 Tr - 38 Tr / trụ',
      suCercon: '4.5 Tr - 7.5 Tr / răng',
      invisalign: '55 Tr - 100 Tr / gói',
      nhorang: '1.2 Tr - 3 Tr / răng'
    },
    threatLevel: 'Cao',
    targetRegion: 'TP.HCM (Quận Bình Thạnh) & Khách Việt Kiều'
  },
  {
    id: 'comp-17',
    name: 'Nha Khoa Lan Anh',
    domain: 'nhakhoalananh.com',
    brandColor: 'from-teal-800 to-cyan-900',
    impressionShare: 19.5,
    overlapRate: 37.5,
    outrankingShare: 22.0,
    topOfPageRate: 62.5,
    absTopOfPageRate: 20.1,
    estimatedMonthlyBudget: '130 - 180 Tr',
    mainServices: ['Nha Khoa Gia Đình Phú Mỹ Hưng', 'Implant Cao Cấp', 'Niềng Răng Trẻ Em'],
    strengths: ['Thương hiệu lâu đời hơn 40 năm tại TP.HCM', 'Chiếm trọn tập khách hàng thượng lưu khu đô thị Phú Mỹ Hưng Quận 7'],
    weaknesses: ['Ngân sách chạy Google Ads không quá ồ ạt, chủ yếu sống nhờ khách quen giới thiệu'],
    currentPromotion: 'Gói chăm sóc răng miệng gia đình định kỳ & Khám chỉnh nha sớm cho trẻ em',
    sampleAd: {
      headline: 'Nha Khoa Lan Anh | Hơn 40 Năm Uy Tín Tại TP.HCM',
      description: 'Đội ngũ bác sĩ tu nghiệp chuyên sâu tại Mỹ và Châu Âu. Cơ sở vật chất hiện đại, tiêu chuẩn kiểm soát nhiễm khuẩn khắt khe.',
      sitelinks: ['Chi Nhánh Phú Mỹ Hưng', 'Đội Ngũ Bác Sĩ', 'Dịch Vụ Implant', 'Liên Hệ Khám'],
      callout: '40 Năm Uy Tín • Bác Sĩ Tu Nghiệp Mỹ • Chuẩn Quốc Tế'
    },
    pricingComparison: {
      implant: '15 Tr - 42 Tr / trụ',
      suCercon: '5 Tr - 9 Tr / răng',
      invisalign: '60 Tr - 120 Tr / gói',
      nhorang: '1.2 Tr - 3.8 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'TP.HCM (Quận 7, Phú Mỹ Hưng, Quận 2)'
  },
  {
    id: 'comp-18',
    name: 'Nha Khoa Oreli',
    domain: 'nhakhoaoreli.com',
    brandColor: 'from-violet-700 to-purple-800',
    impressionShare: 16.2,
    overlapRate: 32.4,
    outrankingShare: 18.9,
    topOfPageRate: 55.0,
    absTopOfPageRate: 15.5,
    estimatedMonthlyBudget: '90 - 140 Tr',
    mainServices: ['Nha Khoa Kỹ Thuật Số', 'Implant Không Đau', 'Răng Sứ CAD/CAM'],
    strengths: ['Ứng dụng công nghệ CAD/CAM chế tác răng sứ lấy ngay trong ngày', 'Trang thiết bị kỹ thuật số tân tiến'],
    weaknesses: ['Hệ sinh thái thương hiệu còn nhỏ, ngân sách Ads mỏng'],
    currentPromotion: 'Làm răng sứ kỹ thuật số lấy liền trong 24h & Giảm 20% gói Implant',
    sampleAd: {
      headline: 'Nha Khoa Oreli | Làm Răng Sứ Kỹ Thuật Số Lấy Liền 24H',
      description: 'Công nghệ quét 3D và cắt sứ CAD/CAM tự động tại chỗ. Tiết kiệm thời gian, bảo hành 10 năm chính hãng.',
      sitelinks: ['Răng Sứ Lấy Liền', 'Trồng Răng Không Đau', 'Bảng Giá Oreli', 'Đặt Lịch Hẹn'],
      callout: 'Răng Sứ Lấy Liền 24h • Công Nghệ CAD/CAM • Bảo Hành 10 Năm'
    },
    pricingComparison: {
      implant: '11.5 Tr - 26 Tr / trụ',
      suCercon: '3.6 Tr - 6.5 Tr / răng',
      invisalign: '46 Tr - 88 Tr / gói',
      nhorang: '800k - 2.2 Tr / răng'
    },
    threatLevel: 'Thấp',
    targetRegion: 'TP.HCM (Quận 10, Tân Bình)'
  },
  {
    id: 'comp-19',
    name: 'Nha Khoa Vạn Hạnh',
    domain: 'nhakhoavanhanh.com.vn',
    brandColor: 'from-blue-900 to-slate-800',
    impressionShare: 23.6,
    overlapRate: 45.2,
    outrankingShare: 26.8,
    topOfPageRate: 66.8,
    absTopOfPageRate: 24.0,
    estimatedMonthlyBudget: '160 - 230 Tr',
    mainServices: ['Phẫu Thuật Hàm Mặt Chuyên Sâu', 'Cấy Ghép Implant Khó / Ghép Xương', 'Chữa Khớp Thái Dương Hàm'],
    strengths: ['Thuộc Bệnh viện Vạn Hạnh với thế mạnh phẫu thuật tạo hình hàm mặt & case cấy ghép tiêu xương nặng', 'Bác sĩ đầu ngành PGS.TS'],
    weaknesses: ['Quy trình thủ tục bệnh viện hơi phức tạp, marketing số chưa linh hoạt'],
    currentPromotion: 'Hội chẩn cùng PGS.TS chuyên khoa Hàm Mặt & Cấy ghép Implant tiêu xương nặng',
    sampleAd: {
      headline: 'Trung Tâm Nha Khoa Bệnh Viện Vạn Hạnh | Chuyên Khoa Răng Hàm Mặt',
      description: 'Điều trị các case Implant phức tạp, tiêu xương, phẫu thuật chỉnh hình hàm mặt. Đội ngũ Phó Giáo Sư, Bác Sĩ chuyên khoa II.',
      sitelinks: ['Implant Ghép Xương', 'Phẫu Thuật Hàm Mặt', 'Đội Ngũ PGS.BS', 'Đăng Ký Khám'],
      callout: 'Chuẩn Bệnh Viện • PGS.TS Trực Tiếp Khám • Xử Lý Case Khó'
    },
    pricingComparison: {
      implant: '13 Tr - 35 Tr / trụ',
      suCercon: '4 Tr - 7.5 Tr / răng',
      invisalign: '50 Tr - 105 Tr / gói',
      nhorang: '1 Tr - 3.5 Tr / răng'
    },
    threatLevel: 'Trung bình',
    targetRegion: 'TP.HCM (Quận 10) & Các tỉnh phía Nam'
  }
];
