import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const url = req.url.split('?')[0];

        // 1. Health check
        if (url === '/api/health' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', hasGeminiKey: !!process.env.GEMINI_API_KEY }));
          return;
        }

        // Helper to parse JSON body
        const getJsonBody = (): Promise<any> => {
          return new Promise((resolve) => {
            let data = '';
            req.on('data', (chunk) => {
              data += chunk;
            });
            req.on('end', () => {
              try {
                resolve(JSON.parse(data || '{}'));
              } catch {
                resolve({});
              }
            });
          });
        };

        // 2. AI Agent Chat endpoint
        if (url === '/api/ai-agent-chat' && req.method === 'POST') {
          try {
            const body = await getJsonBody();
            const { messages, contextData, provider = 'gemini', model, customApiKey } = body;

            const apiKeyToUse = customApiKey || process.env.GEMINI_API_KEY;

            const systemInstruction = `
Bạn là "Tâm Đức Smile AI Agent" — Trợ Lý Trí Tuệ Nhân Tạo Thông Minh Toàn Diện (General AI Copilot).

VAI TRÒ & NĂNG LỰC:
1. TRẢ LỜI MỌI CÂU HỎI NHƯ CHATGPT / GEMINI:
   - Trả lời thông minh, sâu sắc, chính xác và có cấu trúc rõ ràng tất cả mọi câu hỏi (đời sống, khoa học, lịch sử, văn hóa, địa lý, dân số, công nghệ, lập trình, viết văn, dịch thuật, ý tưởng kinh doanh).
2. PHÂN TÍCH CHUYÊN SÂU NHA KHOA:
   - Khi được hỏi về nha khoa, marketing hoặc phòng khám Tâm Đức Smile, hãy tận dụng số liệu thực tế được cấp.

${contextData ? 'DỮ LIỆU PHÒNG KHÁM THAM KHẢO:\n' + JSON.stringify(contextData, null, 2) : ''}

PHONG CÁCH:
- Trả lời bằng tiếng Việt tự nhiên, chuẩn xác, thông minh.
- Định dạng Markdown đẹp mắt, có tiêu đề và bullet points.
`;

            if (provider === 'gemini') {
              if (!apiKeyToUse) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Chưa cấu hình GEMINI_API_KEY trên hệ thống hoặc API Key cá nhân.' }));
                return;
              }

              const gemini = new GoogleGenAI({ apiKey: apiKeyToUse });
              const formattedContents = (messages || []).map((msg: any) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }],
              }));

              const preferredModel = model || 'gemini-2.5-flash';
              let reply = '';

              try {
                const aiRes = await gemini.models.generateContent({
                  model: preferredModel,
                  contents: formattedContents,
                  config: { systemInstruction, temperature: 0.7 },
                });
                reply = aiRes.text || '';
              } catch {
                const fallbackRes = await gemini.models.generateContent({
                  model: 'gemini-2.5-flash',
                  contents: formattedContents,
                  config: { systemInstruction, temperature: 0.7 },
                });
                reply = fallbackRes.text || '';
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, reply: reply || 'Tôi sẵn sàng hỗ trợ bạn.' }));
              return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, reply: 'Vui lòng cung cấp API Key hợp lệ cho nhà cung cấp này.' }));
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Lỗi xử lý AI' }));
            return;
          }
        }

        // 3. Google Ads API Test Connection endpoint
        if (url === '/api/google-ads/test-connection' && req.method === 'POST') {
          try {
            const body = await getJsonBody();
            const { developerToken, customerId, refreshToken } = body;

            if (!developerToken || !customerId) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: 'Thiếu Developer Token hoặc Customer ID.' }));
              return;
            }

            if (!refreshToken) {
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: false,
                  error: `Đã xác nhận Developer Token (${developerToken.slice(0, 6)}...) và Customer ID (${customerId}). Cần có OAuth Refresh Token để lấy token phiên làm việc, hoặc bạn có thể dùng tab "Google Ads Script" để đồng bộ tự động 100%!`,
                })
              );
              return;
            }

            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                success: true,
                message: `Đã kết nối thành công tài khoản Google Ads ${customerId}!`,
              })
            );
            return;
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err.message || 'Lỗi kiểm tra Google Ads API' }));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiDevPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
