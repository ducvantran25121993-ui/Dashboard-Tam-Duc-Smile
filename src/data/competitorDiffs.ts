export interface CompetitorDiffItem {
  id: string;
  competitorId: string;
  competitorName: string;
  domain: string;
  url: string;
  detectedDate: string;
  category: 'pricing' | 'promotion' | 'banner' | 'popup' | 'text' | 'service';
  mediaType: 'price_table' | 'banner_image' | 'popup_modal' | 'headline_text';
  title: string;
  oldValue: string;
  newValue: string;
  diffType: 'price_drop' | 'price_increase' | 'promo_added' | 'new' | 'updated';
  diffBadge: string;
  impactLevel: 'Rất cao' | 'Cao' | 'Trung bình';
  aiAnalysis: string;
  counterAction: string;
}

export const INITIAL_COMPETITOR_DIFFS: CompetitorDiffItem[] = [
  {
    id: 'diff-viethan-1',
    competitorId: 'viethan04',
    competitorName: 'Nha Khoa Việt Hàn 04',
    domain: 'nhakhoaviethan04.com.vn',
    url: 'https://nhakhoaviethan04.com.vn/bang-gia',
    detectedDate: 'Vừa phát hiện (Live Alert)',
    category: 'pricing',
    mediaType: 'price_table',
    title: 'Giảm 40% Trồng Răng Implant Không Rạch Nướu chỉ 7.999.000 đ/trụ (7TR999)',
    oldValue: 'Trụ Implant chính hãng: 13.500.000đ/trụ • Bảng giá niêm yết phòng khám',
    newValue: 'Trụ Implant Không Rạch Nướu: 7.999.000đ/trụ (Giảm 40%) • Miễn phí Chụp Phim CT ConeBeam 3D & Khám bác sĩ CKI 0đ',
    diffType: 'price_drop',
    diffBadge: 'Giảm -40% Trụ Implant',
    impactLevel: 'Rất cao',
    aiAnalysis: 'Nha Khoa Việt Hàn 04 tung deal giá sốc 7.999.000 đ/trụ (7TR999) và All-on-4 chỉ 39 Triệu trên website để kéo khách hàng tìm kiếm giá rẻ. Mức giá này chưa gồm mão răng sứ bên trên.',
    counterAction: 'Tâm Đức Smile đẩy mạnh thông điệp "Implant Trọn Gói 9.9Tr ĐÃ BAO GỒM RĂNG SỨ + Khớp Nối Abutment Chính Hãng + Bảo Hành 10 Năm" để dập tan chiêu trò phụ phí phát sinh của đối thủ.'
  },
  {
    id: 'diff-viethan-2',
    competitorId: 'viethan04',
    competitorName: 'Nha Khoa Việt Hàn 04',
    domain: 'nhakhoaviethan04.com.vn',
    url: 'https://nhakhoaviethan04.com.vn/bang-gia',
    detectedDate: 'Hôm nay, 07:30',
    category: 'promotion',
    mediaType: 'popup_modal',
    title: 'Combo 16 Răng Bọc Sứ Đức Giảm 70% chỉ 12.960.000 đ (810k/răng)',
    oldValue: 'Bọc răng sứ Đức niêm yết: 43.200.000đ/combo 16 răng (2.700.000đ/răng)',
    newValue: 'Combo 16 răng bọc sứ Đức: 12.960.000đ (Chỉ 810.000đ/răng, Giảm 70%) • Bảo hành 10 năm & Miễn phí cạo vôi răng',
    diffType: 'promo_added',
    diffBadge: 'Giảm 70% Sứ Toàn Hàm',
    impactLevel: 'Cao',
    aiAnalysis: 'Việt Hàn 04 đang đánh mạnh vào khách hàng làm răng thẩm mỹ số lượng lớn theo combo 16 răng chỉ 12.960.000 đ (810.000 đ/răng).',
    counterAction: 'Triển khai chiến dịch "Răng Sứ Thẩm Mỹ Chuẩn Đức Labo Riêng 24H" của Tâm Đức với chính sách trả góp 0% và bảo hành điện tử chính hãng.'
  },
  {
    id: 'diff-1',
    competitorId: 'comp-1',
    competitorName: 'Nha Khoa Kim',
    domain: 'nhakhoakim.com',
    url: 'https://nhakhoakim.com/bang-gia-nha-khoa-nieng-rang-rang-su-implant.html',
    detectedDate: '08:30 Hôm nay',
    category: 'pricing',
    mediaType: 'price_table',
    title: 'Công bố bảng giá: Cạo vôi 500k, Liệu trình Implant Biotem 21Tr, Mắc cài 40Tr',
    oldValue: 'Khám tổng quát: 100.000đ • Bảng giá cũ chưa cập nhật liệu trình máng 3D',
    newValue: 'Khám 0đ • Cạo vôi: 500.000đ/2 hàm • Liệu trình Implant Biotem/Dio: 21.000.000đ • Mắc cài: 40.000.000đ',
    diffType: 'price_drop',
    diffBadge: 'Bảng Giá Công Khai',
    impactLevel: 'Rất cao',
    aiAnalysis: 'Nha Khoa Kim áp dụng giá liệu trình trọn gói Implant 21.000.000đ (đã gồm máng định vị 3D) và niềng răng mắc cài 40.000.000đ, mức giá khá cao so với mặt bằng.',
    counterAction: 'Đẩy mạnh thông điệp "Implant Tâm Đức Smile chỉ từ 9.9Tr trọn gói + Trả góp 0% chỉ 990k/tháng" đè bẹp mức giá 21Tr của Nha Khoa Kim.'
  },
  {
    id: 'diff-2',
    competitorId: 'comp-2',
    competitorName: 'Nha Khoa Paris',
    domain: 'nhakhoaparis.vn',
    url: 'https://nhakhoaparis.vn/',
    detectedDate: '19:45 Hôm qua',
    category: 'promotion',
    mediaType: 'popup_modal',
    title: 'Flash Sale: Trụ Dentium 4S giảm còn 12.8Tr & Sứ Nano 5S từ 2.2Tr/răng',
    oldValue: 'Trụ Dentium chuẩn Pháp: 16.000.000đ • Răng sứ Nano 5S: 3.500.000đ/răng',
    newValue: 'Trụ Dentium 4S: 12.800.000đ (Giảm 20%) • Sứ Nano 5S: 2.200.000đ/răng (Giảm 35%) • Miễn phí Chụp CT 3D',
    diffType: 'promo_added',
    diffBadge: 'Giảm 20% - 35%',
    impactLevel: 'Rất cao',
    aiAnalysis: 'Paris giảm 20% trụ Dentium xuống 12.8Tr và bọc sứ Nano 5S xuống 2.2Tr/răng kèm trả góp 0% duyệt hồ sơ nhanh.',
    counterAction: 'Bổ sung Sitelink Extension "Tặng Gói Chăm Sóc Răng Miệng Toàn Diện 2 Tr" vào chiến dịch Niềng Răng Tâm Đức Smile.'
  },
  {
    id: 'diff-3',
    competitorId: 'comp-4',
    competitorName: 'Dr. Care Implant',
    domain: 'drcareimplant.com',
    url: 'https://drcareimplant.com/uu-dai-implant',
    detectedDate: '14:15 Ngày 19/08/2026',
    category: 'banner',
    mediaType: 'banner_image',
    title: 'Thay Banner Hero: Đẩy mạnh cam kết "Trồng răng không đau cho người trung niên"',
    oldValue: 'Banner ảnh bác sĩ phẫu thuật thông thường + slogan "Chuyên sâu trồng răng"',
    newValue: 'Banner mới: Hình ảnh khách hàng 65 tuổi ăn nhai thoải mái + Cam kết "Liệu pháp trồng răng không đau độc quyền 12 bước"',
    diffType: 'updated',
    diffBadge: 'Thay Đổi Banner Hero',
    impactLevel: 'Cao',
    aiAnalysis: 'Dr. Care đang định vị lại thông điệp xoáy sâu vào nỗi sợ đau của người lớn tuổi để tăng tỷ lệ chuyển đổi cuộc gọi (Call Ads).',
    counterAction: 'Tối ưu lại tiện ích mở rộng cuộc gọi và mở rộng tệp đối tượng trên 45 tuổi với thông điệp "Bác sĩ trưởng khoa trực tiếp thực hiện nhẹ nhàng êm ái".'
  },
  {
    id: 'diff-4',
    competitorId: 'comp-6',
    competitorName: 'Nha Khoa Shark',
    domain: 'nhakhoashark.vn',
    url: 'https://nhakhoashark.vn/boc-rang-su',
    detectedDate: '10:00 Ngày 18/08/2026',
    category: 'text',
    mediaType: 'headline_text',
    title: 'Bổ sung cam kết "Bảo hành sứ chính hãng 15 năm - Đền gấp 10 nếu hàng giả"',
    oldValue: 'Cam kết tiêu chuẩn: Bảo hành theo hãng từ 5 - 10 năm',
    newValue: 'Văn bản mới: "Cam kết thẻ bảo hành điện tử chính hãng 15 năm • Quét mã QR nguồn gốc phôi sứ Đức • Đền 100 triệu nếu phát hiện sứ pha tạp"',
    diffType: 'updated',
    diffBadge: 'Tăng Thời Hạn Bảo Hành',
    impactLevel: 'Trung bình',
    aiAnalysis: 'Shark đang củng cố niềm tin khách hàng bằng chính sách đền bù tài chính lớn nhằm cạnh tranh với phân khúc sứ cao cấp.',
    counterAction: 'Làm nổi bật phòng Labo sứ riêng tại Tâm Đức Smile giúp chế tác chuẩn xác trong 24h và bảo hành điện tử minh bạch.'
  },
  {
    id: 'diff-5',
    competitorId: 'comp-3',
    competitorName: 'Nha Khoa I-Dent',
    domain: 'nhakhoaident.com',
    url: 'https://nhakhoaident.com/implant-viet-kieu',
    detectedDate: '16:20 Ngày 17/08/2026',
    category: 'service',
    mediaType: 'headline_text',
    title: 'Ra mắt Landing Page Gói "Implant Siêu Tốc 48h Cho Kiều Bào Về Nước"',
    oldValue: 'Chưa có gói chuyên biệt cho Việt Kiều',
    newValue: 'Gói mới: "Implant Siêu Tốc 48h Có Răng Tạm Ăn Nhai • Xe đưa đón sân bay Tân Sơn Nhất • Hỗ trợ đặt khách sạn 4 sao"',
    diffType: 'new',
    diffBadge: 'Gói Dịch Vụ Mới',
    impactLevel: 'Rất cao',
    aiAnalysis: 'I-Dent đang đón đầu làn sóng kiều bào về nước mùa thu - đông với gói chăm sóc toàn diện từ sân bay đến phòng khám.',
    counterAction: 'Kích hoạt ngay chiến dịch Search định vị IP nước ngoài (Mỹ, Úc, Canada) với dịch vụ xe đưa đón miễn phí và phác đồ điều trị rút gọn 3 ngày của Tâm Đức.'
  }
];
