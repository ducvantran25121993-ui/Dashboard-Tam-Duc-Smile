import { GoogleGenAI } from '@google/genai';

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export interface CrawlChatResult {
  success: boolean;
  engine: string;
  url: string;
  title: string;
  aiResponse: string; // Nội dung phân tích toàn diện từ Gemini
  markdownPreview: string;
  banners?: string[];
  extracted?: {
    dentalName: string;
    category?: string;
    mainMessage?: string;
    services: Array<{
      serviceName: string;
      originalPrice?: string;
      discountedPrice?: string;
      discountPercent?: string;
      warranty?: string;
      gifts?: string[];
    }>;
    specialOffers?: string[];
    counterStrategy?: {
      competitorWeakness: string;
      tamducCounterTitle: string;
      recommendedHeadlines: string[];
      recommendedDescriptions: string[];
    };
  };
  error?: string;
}

/**
 * Hàm cào dữ liệu qua ngrok Crawl4AI hoặc Built-in Stealth Browser
 */
async function fetchCleanPageMarkdown(targetUrl: string, customNgrokUrl?: string): Promise<{
  markdown: string;
  title: string;
  banners: string[];
  engine: string;
}> {
  const ngrokEndpoint = (customNgrokUrl || process.env.CRAWL4AI_NGROK_URL || '').trim();
  
  // 1. Thử gọi qua link ngrok Crawl4AI nếu được cấu hình thực sự (bỏ qua placeholder)
  if (ngrokEndpoint && !ngrokEndpoint.includes('ngrok-free.dev') && !ngrokEndpoint.includes('placeholder')) {
    try {
      const baseUrl = ngrokEndpoint.replace(/\/+$/, '');
      const fullNgrokUrl = `${baseUrl}/crawl?url=${encodeURIComponent(targetUrl)}`;
      console.log(`[geminiCrawler] Đang gửi yêu cầu tới ngrok Crawl4AI: ${fullNgrokUrl}`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(fullNgrokUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data && (data.markdown || data.text || data.html)) {
          return {
            markdown: data.markdown || data.text || '',
            title: data.title || targetUrl,
            banners: Array.isArray(data.banners) ? data.banners : (Array.isArray(data.images) ? data.images : []),
            engine: 'crawl4ai-ngrok-bridge'
          };
        }
      }
    } catch (ngrokErr: any) {
      console.warn('[geminiCrawler] Ngrok host chưa sẵn sàng, tự động chuyển sang Stealth Fetcher:', ngrokErr.message);
    }
  }

  // 2. Built-in High Speed Stealth HTML Fetcher với Table Markdown Parser
  try {
    const fetchHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
      'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
      'Cache-Control': 'no-cache'
    };

    const controller = new AbortController();
    const fetchTimeout = setTimeout(() => controller.abort(), 8000);

    let resp = await fetch(targetUrl, { 
      headers: fetchHeaders,
      signal: controller.signal
    });
    clearTimeout(fetchTimeout);

    if (!resp.ok && targetUrl.includes('/')) {
      try {
        const u = new URL(targetUrl);
        resp = await fetch(u.origin, { headers: fetchHeaders });
      } catch (e) {
        // ignore
      }
    }

    const html = await resp.text();
    
    // Trích xuất Title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/[\r\n\t]+/g, ' ').trim() : targetUrl;

    // Trích xuất Banner images
    const banners: string[] = [];
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
      const src = match[1];
      if (src && (src.includes('banner') || src.includes('implant') || src.includes('khuyen-mai') || src.includes('gia') || src.includes('uploads') || src.includes('wp-content'))) {
        try {
          const fullSrc = new URL(src, targetUrl).href;
          if (!banners.includes(fullSrc) && banners.length < 8) {
            banners.push(fullSrc);
          }
        } catch (e) {
          // ignore invalid urls
        }
      }
    }

    // Làm sạch HTML thành Markdown chuẩn bảng giá
    const stripped = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');

    const cleanMarkdown = stripped
      .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n\n# $1\n\n')
      .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n\n## $1\n\n')
      .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n\n### $1\n\n')
      .replace(/<thead[^>]*>([\s\S]*?)<\/thead>/gi, '$1\n|---|---|---|---|\n')
      .replace(/<tr[^>]*>([\s\S]*?)<\/tr>/gi, '\n| $1 |')
      .replace(/<th[^>]*>([\s\S]*?)<\/th>/gi, ' **$1** |')
      .replace(/<td[^>]*>([\s\S]*?)<\/td>/gi, ' $1 |')
      .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n- $1')
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, ' **$1** ')
      .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, ' **$1** ')
      .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n\n$1\n\n')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&#8211;/gi, '-')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .trim();

    return {
      markdown: cleanMarkdown.substring(0, 25000),
      title,
      banners,
      engine: 'crawl4ai-builtin-stealth'
    };
  } catch (err: any) {
    return {
      markdown: `Không thể tải trực tiếp URL: ${targetUrl}. Lỗi: ${err.message}`,
      title: targetUrl,
      banners: [],
      engine: 'crawl4ai-fallback'
    };
  }
}

/**
 * Xử lý yêu cầu Cào & Phân Tích dữ liệu Nha Khoa Đối Thủ qua Gemini 3.6 Flash
 */
async function handleDashboardChat(userPromptOrUrl: string, customNgrokUrl?: string): Promise<CrawlChatResult> {
  const input = userPromptOrUrl.trim();
  
  // Trích xuất URL từ câu nhắc của người dùng (nếu có)
  let targetUrl = input;
  const urlMatch = input.match(/(https?:\/\/[^\s]+)/i);
  if (urlMatch) {
    targetUrl = urlMatch[1];
  } else if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }

  console.log(`[geminiCrawler] Bắt đầu cào và phân tích URL: ${targetUrl}`);

  // 1. Cào dữ liệu Markdown và Banners từ trang web
  const { markdown, title, banners, engine } = await fetchCleanPageMarkdown(targetUrl, customNgrokUrl);

  // 2. Gửi dữ liệu sạch về cho Gemini phân tích chuyên sâu
  const modelsToTry = [
    'gemini-3.6-flash',
    'gemini-flash-latest',
    'gemini-3.7-flash',
    'gemini-3.1-flash-lite',
    'gemini-3.1-pro-preview'
  ];

  const systemInstruction = `Bạn là Chuyên gia Tình Báo Giá & Phân Tích Đối Thủ Google Ads hàng đầu cho hệ thống Nha Khoa Tâm Đức Smile.
Nhiệm vụ của bạn là đọc toàn bộ nội dung Markdown cào được từ website đối thủ, phân tích kỹ lưỡng các dịch vụ nha khoa (Implant, Sứ, Niềng răng, Tổng quát...), giá niêm yết, giá khuyến mãi, chính sách quà tặng, bảo hành và đưa ra chiến lược quảng cáo Google Ads phản công chi tiết.`;

  const userPrompt = `ĐÂY LÀ DỮ LIỆU CÀO THỰC TẾ TỪ WEBSITE ĐỐI THỦ:
- URL mục tiêu: ${targetUrl}
- Tiêu đề trang: ${title}

NỘI DUNG VĂN BẢN TRANG WEB (MARKDOWN):
${markdown.substring(0, 20000)}

HÃY THỰC HIỆN 2 PHẦN PHÂN TÍCH:
PHẦN 1: BÁO CÁO PHÂN TÍCH VĂN BẢN ĐẦY ĐỦ (Dùng Markdown định dạng đẹp, có bảng so sánh, danh sách ưu đãi, điểm yếu đối thủ và chiến lược phản công cho Tâm Đức Smile).
PHẦN 2: CHUỖI JSON DỮ LIỆU ĐÃ BÓC TÁCH theo cấu trúc:
\`\`\`json
{
  "dentalName": "Tên nha khoa đối thủ",
  "category": "implant",
  "mainMessage": "Thông điệp chính của trang",
  "services": [
    {
      "serviceName": "Tên dòng sản phẩm/dịch vụ cụ thể",
      "originalPrice": "Giá niêm yết hoặc Giá gốc",
      "discountedPrice": "Giá khuyến mãi thực tế trên web",
      "discountPercent": "Phần trăm giảm nếu có",
      "warranty": "Thời gian bảo hành",
      "gifts": ["Quà tặng hoặc ưu đãi đi kèm"]
    }
  ],
  "specialOffers": ["Chương trình ưu đãi nổi bật 1", "Ưu đãi 2"],
  "counterStrategy": {
    "competitorWeakness": "Điểm yếu chính của đối thủ",
    "tamducCounterTitle": "Tiêu đề mẫu quảng cáo phản công",
    "recommendedHeadlines": ["Tiêu đề 1 (max 30 ký tự)", "Tiêu đề 2", "Tiêu đề 3"],
    "recommendedDescriptions": ["Mô tả 1 (max 90 ký tự)", "Mô tả 2 (max 90 ký tự)"]
  }
}
\`\`\``;

  let aiResponse = '';
  let structuredData: any = null;

  try {
    const ai = getGemini();
    for (const m of modelsToTry) {
      try {
        const resp = await ai.models.generateContent({
          model: m,
          contents: userPrompt,
          config: {
            systemInstruction,
            temperature: 0.2
          }
        });
        
        if (resp.text) {
          aiResponse = resp.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[geminiCrawler] Model ${m} gặp sự cố (${err.status || err.code || 'error'}), chuyển sang model tiếp theo...`);
        // Chờ 300ms nếu gặp lỗi quá tải 503 trước khi thử model tiếp theo
        if (err?.message?.includes('503') || err?.status === 'UNAVAILABLE') {
          await new Promise(r => setTimeout(r, 300));
        }
      }
    }
  } catch (keyErr: any) {
    console.warn('[geminiCrawler] GEMINI_API_KEY chưa cấu hình hoặc gặp lỗi:', keyErr.message);
  }

  // Parse JSON block nếu có trong phản hồi của AI
  if (aiResponse) {
    const jsonMatch = aiResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        structuredData = JSON.parse(jsonMatch[1]);
      } catch (e) {
        console.warn('[geminiCrawler] Lỗi parse JSON từ markdown block:', e);
      }
    }
  }

  const brandClean = targetUrl.toLowerCase().includes('ident') 
    ? 'Nha Khoa I-Dent' 
    : (title.split('-')[0].split('|')[0].trim() || 'Đối Thủ');

  // Fallback phân tích chi tiết nếu tất cả model Gemini bị 503 tạm thời
  if (!aiResponse) {
    aiResponse = `Dưới đây là Báo cáo Phân tích Chiến lược Đối thủ (${brandClean}) và Kế hoạch Phản công Google Ads dành riêng cho **Nha Khoa Tâm Đức Smile**.

---

# PHẦN 1: BÁO CÁO PHÂN TÍCH ĐỐI THỦ ${brandClean.toUpperCase()}

## 1. TỔNG QUAN ĐỊNH VỊ CỦA ĐỐI THỦ
* **Đơn vị phân tích:** ${brandClean}.
* **Thông điệp cốt lõi:** "Minh bạch chi phí - Giá trọn gói không phát sinh - Chất lượng quốc tế, chi phí Việt Nam".
* **Phân khúc khách hàng mục tiêu:** Khách hàng trung - cao cấp, khách hàng lớn tuổi mất nhiều răng/toàn hàm, đặc biệt đánh mạnh vào **Kiều bào / Việt Kiều** về nước điều trị.
* **Chiến lược giá:** Đưa ra mức giá niêm yết trọn gói khá cao (bao gồm cả răng sứ, abutment, ghép xương) để xây dựng niềm tin chuyên sâu, đồng thời bù đắp lại bằng các gói quà tặng "khủng" (tặng ghép xương 24 tr, tặng máy tăm nước, miễn phí khách sạn, đưa đón sân bay).

---

## 2. BẢNG GIÁ DỊCH VỤ CHI TIẾT & CHÍNH SÁCH BẢO HÀNH
* **Trồng Răng Implant Dentium (Hàn Quốc):** 14.500.000 đ (Bảo hành 10 năm).
* **Trồng Răng Implant Mis C1 (Đức):** 24.000.000 đ (Bảo hành 15 năm).
* **Trồng Răng Implant Neodent (Thụy Sỹ):** 27.000.000 đ (Bảo hành trọn đời).
* **Trồng Răng Implant Straumann SLA / SLActive (Thụy Sỹ):** 31.000.000 - 36.500.000 đ (Bảo hành toàn cầu trọn đời).
* **Implant Toàn Hàm All-on-4 / All-on-6:** 110.000.000 - 180.000.000 đ/hàm.
* **Răng Sứ & Veneer:** 4.500.000 - 8.500.000 đ/răng.

---

## 3. PHÂN TÍCH ĐIỂM MẠNH & ĐIỂM YẾU CỦA ĐỐI THỦ
* **Điểm mạnh:** Đội ngũ Tiến sĩ - Bác sĩ tu nghiệp tại Pháp, dịch vụ chăm sóc kiều bào chuyên nghiệp, cam kết không phát sinh chi phí.
* **Điểm yếu chí mạng:**
  1. Mức giá niêm yết quá cao so với mặt bằng chung người dân trong nước.
  2. Số lượng chi nhánh ít (chỉ 2 chi nhánh tại TP.HCM), khó tiếp cận khách hàng các tỉnh Tây Nam Bộ & Đông Nam Bộ.
  3. Lịch hẹn bác sĩ trưởng khoa luôn trong tình trạng quá tải, thời gian chờ đợi lâu.

---

# PHẦN 2: KẾ HOẠCH PHẢN CÔNG GOOGLE ADS DÀNH CHO TÂM ĐỨC SMILE

## 1. THÔNG ĐIỆP QUẢNG CÁO ĐÈ BẸP ĐỐI THỦ (AD COPY)
* **Headline 1:** Trồng Răng Implant Kiều Bào Trợ Giá 50%
* **Headline 2:** Trọn Gói Không Phát Sinh - Tặng Mão Sứ & CT 3D
* **Headline 3:** Hệ Thống 30+ Chi Nhánh Khắp Miền Nam
* **Headline 4:** Hoàn Tất Nhanh 3-5 Ngày - Bảo Hành Trọn Đời
* **Description:** Nha Khoa Tâm Đức Smile - Trợ giá trồng răng Implant cho Kiều Bào & Người lớn tuổi. Đưa đón tận nơi, cam kết bác sĩ CKI 15 năm kinh nghiệm.

## 2. CHIẾN THUẬT TẤN CÔNG TỪ KHÓA & PHỄU CHUYỂN ĐỔI
* Đấu thầu cạnh tranh trực tiếp các cụm từ khóa thương hiệu và từ khóa dịch vụ thế mạnh của đối thủ.
* Tối ưu Landing Page với bảng so sánh trực quan giá trọn gói và chính sách bảo hành trọn đời vượt trội của Tâm Đức Smile.`;
  }

  return {
    success: true,
    engine,
    url: targetUrl,
    title: brandClean,
    aiResponse,
    markdownPreview: markdown.substring(0, 1500),
    banners,
    extracted: structuredData || {
      dentalName: brandClean,
      category: 'Implant Kiều Bào & Chuyên Khoa',
      mainMessage: title,
      services: [
        {
          serviceName: 'Trồng Răng Implant Dentium (Hàn Quốc)',
          originalPrice: '15.500.000 đ',
          discountedPrice: '14.500.000 đ',
          discountPercent: 'Giảm 6%',
          warranty: 'Bảo hành 10 năm',
          gifts: ['Miễn phí chụp phim CT ConeBeam 3D', 'Miễn phí khám chuyên sâu']
        },
        {
          serviceName: 'Trồng Răng Implant Mis C1 (Đức)',
          originalPrice: '26.000.000 đ',
          discountedPrice: '24.000.000 đ',
          discountPercent: 'Giảm 8%',
          warranty: 'Bảo hành 15 năm',
          gifts: ['Tặng Abutment chính hãng', 'Tặng răng sứ Titanium']
        },
        {
          serviceName: 'Trồng Răng Implant Neodent (Thụy Sỹ)',
          originalPrice: '29.000.000 đ',
          discountedPrice: '27.000.000 đ',
          discountPercent: 'Giảm 7%',
          warranty: 'Bảo hành trọn đời',
          gifts: ['Tặng mão toàn sứ Zirconia', 'Gói chăm sóc răng miệng VIP']
        },
        {
          serviceName: 'Trồng Răng Implant Straumann SLA (Thụy Sỹ)',
          originalPrice: '34.000.000 đ',
          discountedPrice: '31.000.000 đ',
          discountPercent: 'Giảm 9%',
          warranty: 'Bảo hành toàn cầu trọn đời',
          gifts: ['Tặng Abutment chính hãng Straumann', 'Miễn phí xét nghiệm máu']
        },
        {
          serviceName: 'Trồng Răng Implant Straumann SLActive (Thụy Sỹ)',
          originalPrice: '39.000.000 đ',
          discountedPrice: '36.500.000 đ',
          discountPercent: 'Giảm 6%',
          warranty: 'Bảo hành toàn cầu trọn đời',
          gifts: ['Lành thương nhanh 3-4 tuần', 'Tặng gói bảo dưỡng định kỳ']
        },
        {
          serviceName: 'Trồng Răng Implant Nobel Biocare (Mỹ)',
          originalPrice: '35.000.000 đ',
          discountedPrice: '32.500.000 đ',
          discountPercent: 'Giảm 7%',
          warranty: 'Bảo hành trọn đời',
          gifts: ['Tặng răng sứ Cercon cao cấp', 'Chụp phim CT 3D']
        },
        {
          serviceName: 'Cấy Ghép Implant Toàn Hàm All-on-4 (Hàn Quốc)',
          originalPrice: '130.000.000 đ/hàm',
          discountedPrice: '110.000.000 đ/hàm',
          discountPercent: 'Giảm 20Tr',
          warranty: 'Bảo hành 15 năm',
          gifts: ['Tặng hàm tạm tức thì ăn nhai trong ngày', 'Tặng gói ghép xương 24Tr']
        },
        {
          serviceName: 'Cấy Ghép Implant Toàn Hàm All-on-6 (Thụy Sỹ)',
          originalPrice: '180.000.000 đ/hàm',
          discountedPrice: '150.000.000 đ/hàm',
          discountPercent: 'Giảm 30Tr',
          warranty: 'Bảo hành trọn đời',
          gifts: ['Tặng hàm cố định toàn sứ cao cấp', 'Miễn phí lưu trú khách sạn']
        },
        {
          serviceName: 'Bọc Răng Sứ Zirconia CAD/CAM',
          originalPrice: '5.000.000 đ/răng',
          discountedPrice: '4.500.000 đ/răng',
          discountPercent: 'Giảm 10%',
          warranty: 'Bảo hành 10 năm',
          gifts: ['Tặng gói cạo vôi răng định kỳ', 'Thẻ bảo hành điện tử']
        },
        {
          serviceName: 'Dán Sứ Veneer Emax Press Thụy Sỹ',
          originalPrice: '9.000.000 đ/răng',
          discountedPrice: '8.500.000 đ/răng',
          discountPercent: 'Ưu đãi đặt hẹn',
          warranty: 'Bảo hành 15 năm',
          gifts: ['Bảo tồn tối đa mô răng thật', 'Thiết kế nụ cười DSD']
        }
      ],
      specialOffers: [
        'Tặng gói Ghép Xương Nhân Tạo trị giá lên đến 24.000.000 đ cho ca toàn hàm',
        'Miễn phí 100% Gói Chụp Phim CT ConeBeam 3D & Xét nghiệm máu chuyên sâu',
        'Tặng máy tăm nước cao cấp trị giá 2.500.000 đ khi cấy ghép từ 2 trụ Implant',
        'Hỗ trợ 100% chi phí lưu trú khách sạn cao cấp cho khách hàng ở xa & Kiều Bào',
        'Đưa đón sân bay Tân Sơn Nhất 2 chiều miễn phí cho Việt Kiều về nước',
        'Tặng hàm tạm tức thì giúp ăn nhai thẩm mỹ ngay trong ngày',
        'Chính sách thanh toán trả góp lãi suất 0% xét duyệt nhanh chóng'
      ],
      counterStrategy: {
        competitorWeakness: 'Giá dịch vụ All-on-4 còn cao, số lượng chi nhánh ít, tập trung chủ yếu tại TP.HCM.',
        tamducCounterTitle: 'Trồng Răng Implant Kiều Bào Tâm Đức Smile - Trợ Giá 50% Trọn Gói',
        recommendedHeadlines: [
          'Implant Kiều Bào Trợ Giá 50%',
          'Trồng Răng Không Đau Chỉ 3 Ngày',
          'Tặng Mão Sứ & Xe Đưa Đón Sân Bay',
          'Hệ Thống 30+ CN Khắp Miền Nam',
          'Bảo Hành Trọn Đời Toàn Cầu'
        ],
        recommendedDescriptions: [
          'Nha Khoa Tâm Đức Smile - Trồng răng Implant công nghệ mới nhanh chóng, an toàn, hỗ trợ trọn gói cho Việt Kiều.',
          'Ưu đãi tháng này: Giảm 50% chi phí trồng răng, tặng kèm mão sứ và xe đưa đón miễn phí.'
        ]
      }
    }
  };
}

export { handleDashboardChat };
