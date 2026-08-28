import { handleDashboardChat } from '../src/geminiCrawler';

export const maxDuration = 60;

export default async function handler(req: any, res: any) {
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
  const targetUrl = req.body?.url || req.query?.url || '';
  const ngrokHost = req.body?.crawl4aiHost || req.query?.crawl4aiHost || '';

  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'Thiếu URL cần cào' });
  }

  try {
    const result = await handleDashboardChat(targetUrl, ngrokHost);
    return res.status(200).json({
      ...result,
      executionTimeMs: Date.now() - startTime
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
