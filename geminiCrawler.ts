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
  // Tự động dùng đường link ngrok đang online của máy bạn, nếu không có mới tìm biến môi trường
  const ngrokEndpoint = (customNgrokUrl || "https://ngrok-free.dev").trim();
  
  // 1. GỬI YÊU CẦU TỚI MÁY CHỦ CRAWL4AI CỦA BẠN (ĐÃ KHỬ CACHE VÀ BỎ QUA CHẶN LINK)
  if (ngrokEndpoint && !ngrokEndpoint.includes('placeholder')) {
    try {
      const baseUrl = ngrokEndpoint.replace(/\/+$/, '');
      const fullNgrokUrl = `${baseUrl}/api/crawl?url=${encodeURIComponent(targetUrl)}`;
      console.log(`[geminiCrawler] Đang gửi yêu cầu tới ngrok Crawl4AI: ${fullNgrokUrl}`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000); // Đợi 45s cho cào nâng cao tải xong trang
      
      const res = await fetch(fullNgrokUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        cache: 'no-store', // ◄ ÉP VERCEL KHÔNG LƯU CACHE CŨ, LUÔN LẤY GIÁ THỰC TẾ
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
            engine: 'crawl4ai-ngrok-bridge-activated'
          };
        }
      }
    } catch (ngrokErr: any) {
      console.warn('[geminiCrawler] Không gọi được Ngrok máy cá nhân, chuyển sang bộ cào dự phòng:', ngrokErr.message);
    }
  }

  // 2. Built-in High Speed Stealth HTML Fetcher với Table Markdown Parser (Bộ dự phòng khi tắt máy tính)
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
      cache: 'no-store',
      signal: controller.signal
    });
    clearTimeout(fetchTimeout);

    if (!resp.ok && targetUrl.includes('/')) {
      try {
        const u = new URL(targetUrl);
        resp = await fetch(u.origin, { headers: fetchHeaders, cache: 'no-store' });
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
 * Xử lý yêu cầu Cào & Phân Tích dữ liệu Nha Khoa Đối Thủ qua Gemini 2.5 Flash
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

  // 1. Cào dữ liệu Markdown và Banners từ trang web thông qua trạm cá nhân
  const { markdown, title, banners, engine } = await fetchCleanPageMarkdown(targetUrl, customNgrokUrl);

  // 2. Gửi dữ liệu sạch về cho Gemini phân tích chuyên sâu
  const modelsToTry = [
    'models/gemini-2.5-flash',
    'models/gemini-1.5-pro',
    'models/gemini-1.5-flash'
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
        console.warn(`[geminiCrawler] Model ${m} gặp sự cố, chuyển sang model tiếp theo...`);
      }
    }
  } catch (keyErr: any) {
    console.warn('[geminiCrawler] GEMINI_API_KEY chưa cấu hình hoặc gặp lỗi:', keyErr.message);
  }

