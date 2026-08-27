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
  aiResponse: string;
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

async function fetchCleanPageMarkdown(targetUrl: string, customNgrokUrl?: string): Promise<{
  markdown: string;
  title: string;
  banners: string[];
  engine: string;
}> {
  const ngrokEndpoint = (customNgrokUrl || "https://ngrok-free.dev").trim();
  
  if (ngrokEndpoint && !ngrokEndpoint.includes('placeholder')) {
    try {
      const baseUrl = ngrokEndpoint.replace(/\/+$/, '');
      const fullNgrokUrl = `${baseUrl}/api/crawl?url=${encodeURIComponent(targetUrl)}`;
      console.log(`[geminiCrawler] Connecting: ${fullNgrokUrl}`);
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);
      
      const res = await fetch(fullNgrokUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'ngrok-skip-browser-warning': '69420'
        },
        cache: 'no-store',
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (data && data.markdown) {
          return {
            markdown: data.markdown,
            title: data.title || targetUrl,
            banners: [],
            engine: 'crawl4ai-ngrok-bridge-activated'
          };
        }
      }
    } catch (ngrokErr: any) {
      console.warn('[geminiCrawler] Ngrok offline, switching template:', ngrokErr.message);
    }
  }

  return {
    markdown: `Yêu cầu xử lý URL: ${targetUrl}`,
    title: "Nha Khoa Đối Thủ",
    banners: [],
    engine: 'crawl4ai-fallback-template'
  };
}

export async function handleDashboardChat(userPromptOrUrl: string, customNgrokUrl?: string): Promise<CrawlChatResult> {
  const input = userPromptOrUrl.trim();
  let targetUrl = input;
  const urlMatch = input.match(/(https?:\/\/[^\s]+)/i);
  if (urlMatch) {
    targetUrl = urlMatch[1];
  } else if (!targetUrl.startsWith('http')) {
    targetUrl = 'https://' + targetUrl;
  }

  const { markdown, title, banners, engine } = await fetchCleanPageMarkdown(targetUrl, customNgrokUrl);

  const modelsToTry = [
    'models/gemini-2.5-flash',
    'models/gemini-1.5-pro'
  ];

  const systemInstruction = `Bạn là Chuyên gia Tình Báo Giá nha khoa Tâm Đức Smile. Hãy đọc văn bản cào được và phân tích chiến lược đối thủ.`;
  const userPrompt = `URL mục tiêu: ${targetUrl}\nNội dung văn bản:\n${markdown}`;

  let aiResponse = '';
  try {
    const ai = getGemini();
    for (const m of modelsToTry) {
      try {
        const resp = await ai.models.generateContent({
          model: m,
          contents: userPrompt,
          config: { systemInstruction, temperature: 0.2 }
        });
        if (resp.text) {
          aiResponse = resp.text;
          break;
        }
      } catch (err: any) {
        console.warn(`[geminiCrawler] Model error: ${m}`);
      }
    }
  } catch (keyErr: any) {
    console.warn('[geminiCrawler] Key error:', keyErr.message);
  }

  return {
    success: true,
    engine,
    url: targetUrl,
    title: title || "Đối Thủ Nha Khoa",
    aiResponse: aiResponse || "Không nhận được phản hồi phân tích.",
    markdownPreview: markdown.substring(0, 100)
  };
}
