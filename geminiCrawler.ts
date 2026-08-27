import { GoogleGenAI } from '@google/genai';
import type { Interactions } from '@google/genai';

const ai = new GoogleGenAI({
    apiKey: process.env['GEMINI_API_KEY'],
});

const tools: Interactions.Tool[] = [
    {
        name: 'crawl_nha_khoa',
        type: 'function',
        description: 'Sử dụng công cụ này khi người dùng yêu cầu cào dữ liệu, đọc thông tin bài viết, hoặc xem bảng giá từ một đường link website bất kỳ.',
    },
];

const generationConfig = {
    temperature: 1,
    max_output_tokens: 65536,
    topP: 0.95,
    thinkingLevel: 'high',
};

async function handleDashboardChat(userPrompt: string) {
  // 1. Gửi tin nhắn của người dùng lên Gemini
  const interaction = await ai.interactions.create({
    model: 'models/gemini-2.5-flash', // Dùng bản ổn định mới nhất của Google
    input: userPrompt,
    tools: tools,
    generation_config: generationConfig,
  });

  // 2. Kiểm tra xem Gemini có ra lệnh gọi hàm cào web hay không
  const lastStep = interaction.steps?.at(-1);
  if (lastStep?.functionCalls && lastStep.functionCalls[0]?.name === 'crawl_nha_khoa') {
    const urlCanCao = lastStep.functionCalls[0].args.url;
    console.log("Đang kích hoạt Crawl4AI cào dữ liệu trang: " + urlCanCao);

    try {
      // 3. Gọi trực tiếp về link ngrok công khai chạy ở máy tính của bạn
      const crawlRes = await fetch(`https://ngrok-free.dev{encodeURIComponent(urlCanCao)}`);
      const duLieu = await crawlRes.json();

      // 4. Gửi ngược nội dung chữ sạch đã cào được về cho Gemini đọc tiếp
      const finalInteraction = await ai.interactions.create({
        model: 'models/gemini-2.5-flash',
        input: `Đây là nội dung trang web cào được: ${duLieu.markdown}. Hãy dựa vào đây để trả lời câu hỏi của người dùng.`,
      });

      // Trả kết quả câu trả lời cuối cùng ra màn hình Dashboard
      return finalInteraction.steps?.at(-1)?.textContent || "Không có phản hồi từ AI.";
    } catch (error) {
      console.error("Lỗi kết nối máy chủ cào dữ liệu:", error);
      return "Không thể kết nối đến robot cào dữ liệu ở máy chủ.";
    }
  }

  // Nếu là câu chat bình thường không cần cào web, trả về chữ thông thường
  return lastStep?.textContent || "Không có phản hồi từ AI.";
}

// Xuất hàm này ra ngoài để giao diện ô chat Dashboard của bạn có thể gọi dùng chung
export { handleDashboardChat };



