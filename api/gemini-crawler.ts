import { handleDashboardChat } from '../geminiCrawler';

export const maxDuration = 60; // Hỗ trợ Vercel Serverless Function chạy tối đa 60 giây

export default async function handler(req: any, res: any) {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const startTime = Date.now();
  const urlOrPrompt = (req.body?.url || req.body?.prompt || req.query?.url || req.query?.prompt || '') as string;
  const customNgrokUrl = (req.body?.ngrokUrl || req.body?.crawl4aiHost || req.query?.ngrokUrl || req.query?.crawl4aiHost || '') as string;

  if (!urlOrPrompt || typeof urlOrPrompt !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Vui lòng cung cấp link website hoặc câu lệnh cần phân tích.'
    });
  }

  try {
    const result = await handleDashboardChat(urlOrPrompt, customNgrokUrl);
    return res.status(200).json({
      ...result,
      executionTimeMs: Date.now() - startTime
    });
  } catch (error: any) {
    console.error('Lỗi trong /api/gemini-crawler (Vercel):', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Lỗi khi phân tích dữ liệu qua geminiCrawler.ts'
    });
  }
}
