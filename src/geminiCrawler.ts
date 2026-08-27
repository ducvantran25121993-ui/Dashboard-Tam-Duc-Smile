import { GoogleGenAI } from '@google/genai';

function getGeminiAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY environment variable is missing.");
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
  const targetUrl = userPromptOrUrl.trim();
  // 🟢 ĐỔI THÀNH LINK CLOUD RUN CHUẨN CỦA BẠN VÀ KHÔNG ĐỂ KÝ TỰ LẠ
  const backendEndpoint = (customNgrokUrl || "https://run.app").trim();

  let markdown = "Yêu cầu xử lý URL: " + targetUrl;
  let engine = "crawl4ai-fallback";
  
  // Khởi tạo các giá trị mặc định tránh lỗi undefined
  let aiResponse = "Không nhận được phản hồi phân tích.";
  let markdownPreview = "";

  try {
    // 🟢 TỐI ƯU FETCH: Xóa bỏ các Header của ngrok cũ để tránh bị Cloud Run chặn
    const res = await fetch(`${backendEndpoint}/api/crawl?url=${encodeURIComponent(targetUrl)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.markdown) {
        markdown = data.markdown;
        engine = "crawl4ai-cloudrun-activated";
      }
    }
  } catch (e) {
    console.error("Lỗi khi cào dữ liệu từ Cloud Run:", e);
  }

  // Tạo bản xem trước nội dung thô cào được
  markdownPreview = markdown.substring(0, 1000);

  try {
    const ai = getGeminiAI();
    // 🟢 KIỂM TRA BẢO VỆ: Nếu không cào được dữ liệu thật, không cho AI phân tích mò số liệu sai
    if (engine === "crawl4ai-fallback") {
      aiResponse = "⚠️ Hệ thống không thể kết nối tới máy chủ cào dữ liệu thật. Vui lòng kiểm tra lại log Cloud Run.";
    } else {
      const resp = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Hãy phân tích dữ liệu bảng giá đối thủ cho Nha Khoa Tâm Đức Smile sau đây: \n\n${markdown}`,
        config: {
          systemInstruction: "Bạn là chuyên gia phân tích đối thủ cho Nha Khoa Tâm Đức Smile. Hãy đọc văn bản cào được và lập bảng so sánh giá dịch vụ chi tiết.",
          temperature: 0.2,
        }
      });
      aiResponse = resp.text || "AI không thể trích xuất dữ liệu.";
    }
  } catch (err) {
    console.error("Lỗi gọi Gemini API:", err);
    aiResponse = "❌ Lỗi kết nối tới trí tuệ nhân tạo Gemini.";
  }

  return {
    success: true,
    engine,
    url: targetUrl,
    title: "Nha Khoa Đối Thủ",
    aiResponse,
    markdownPreview
  };
}
