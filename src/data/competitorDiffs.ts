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
    id: 'diff-1',
    competitorId: 'comp-1',
    competitorName: 'Nha Khoa Kim',
    domain: 'nhakhoakim.com',
    url: 'https://nhakhoakim.com/bang-gia-implant',
    detectedDate: '08:30 Hôm nay (21/08/2026)',
    category: 'pricing',
    mediaType: 'price_table',
    title: 'Giảm giá sâu trụ Implant Biotem Hàn Quốc & Straumann Thụy Sĩ',
    oldValue: 'Trụ Biotem: 14.500.000đ/trụ • Straumann SLA: 32.000.000đ/trụ (Chưa bao gồm Abutment)',
    newValue: 'Trụ Biotem: 11.900.000đ/trụ (Giảm -18%) • Straumann: 27.500.000đ/trụ (Trọn gói Abutment)',
    diffType: 'price_drop',
    diffBadge: 'Giảm -18% Giá Thầu',
    impactLevel: 'Rất cao',
    aiAnalysis: 'Nha Khoa Kim vừa hạ giá niêm yết trên Landing Page Search để cạnh tranh trực tiếp tệp khách hàng nhạy cảm về giá tại TP.HCM & Bình Dương.',
    counterAction: 'Đẩy mạnh thông điệp "Bảo hành trọn đời + Trả góp 0% chỉ 990k/tháng" trên mẫu quảng cáo Search và tăng 15% ngân sách khung giờ 11h-13h.'
  },
  {
    id: 'diff-2',
    competitorId: 'comp-2',
    competitorName: 'Nha Khoa Paris',
    domain: 'nhakhoaparis.vn',
    url: 'https://nhakhoaparis.vn/khuyen-mai-nieng-rang',
    detectedDate: '19:45 Hôm qua (20/08/2026)',
    category: 'promotion',
    mediaType: 'popup_modal',
    title: 'Xuất hiện Popup Ưu Đãi Trả Góp 0% duyệt hồ sơ trong 5 phút',
    oldValue: 'Popup cũ: "Đặt lịch thăm khám nhận voucher 500k"',
    newValue: 'Popup mới: "Flash Sale Niềng Răng: Trả góp 0% chỉ 1 Tr/tháng • Tặng Máy Tăm Nước 1.8 Tr • Miễn phí Chụp Phim CT 3D"',
    diffType: 'promo_added',
    diffBadge: 'Popup Khuyến Mãi Mới',
    impactLevel: 'Rất cao',
    aiAnalysis: 'Paris chuyển trọng tâm từ tặng Voucher tiền mặt sang tặng hiện vật giá trị cao (Máy tăm nước) và cam kết duyệt hồ sơ trả góp nhanh để chốt form học sinh/sinh viên.',
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
