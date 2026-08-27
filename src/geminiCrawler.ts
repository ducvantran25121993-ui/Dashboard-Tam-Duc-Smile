import { GoogleGenAI } from '@google/genai';

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing.');
  return new GoogleGenAI({ apiKey });
}

export interface CrawlChatResult {
  success: boolean;
  engine: string;
  url: string;
  title: string;
  aiResponse: string;
  markdownPreview: string;
}

export async function handleDashboardChat(userPromptOrUrl: string, customNgrokUrl?: string): Promise<CrawlChatResult> {
  const targetUrl = userPromptOrUrl.trim().match(/(https?:\/\/[^\s]+)/i)?.[1] || userPromptOrUrl.trim();
  const ngrokEndpoint = (customNgrokUrl || "https://ngrok-free.dev").trim();
  
  let markdown = `Yêu cầu xử lý URL: ${targetUrl}`;
  let engine = 'crawl4ai-fallback';

  try {
    const res = await fetch(`${ngrokEndpoint}/api/crawl?url=${encodeURIComponent(targetUrl)}`, {
      method: 'GET',
      headers: { 'Accept': 'application/json', 'ngrok-skip-browser-warning': '69420' },
      cache: 'no-store'
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.markdown) {
        markdown = data.markdown;
        engine = 'crawl4ai-ngrok-bridge-activated';
      }
    }
  } catch (e) {}

  let aiResponse = '';
  try {
    const ai = getGemini();
    const resp = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: `Hãy phân tích dữ liệu bảng giá đối thủ nha khoa sau đây:\n${markdown}`,
      config: { 
        systemInstruction: "Bạn là chuyên gia phân tích đối thủ cho Nha Khoa Tâm Đức Smile. Hãy đọc văn bản cào được và lập bảng so sánh giá dịch vụ chi tiết.",
        temperature: 0.2 
      }
    });
    aiResponse = resp.text || '';
  } catch (err) {}

  return {
    success: true,
    engine,
    url: targetUrl,
    title: "Nha Khoa Đối Thủ",
    aiResponse: aiResponse || "Không nhận được phản hồi phân tích.",
    markdownPreview: markdown.substring(0, 100)
  };
}
