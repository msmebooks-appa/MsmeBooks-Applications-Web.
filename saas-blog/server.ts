// ============================================================================
// [NETLIFY DEPLOYMENT NOTICE]
// This Express backend dev server file is not intended to be executed on Netlify.
// Netlify is a static SPA hosting platform that serves client-side builds.
// All client-side components have built-in offline & static fallbacks.
// ============================================================================
// import express, { Request, Response } from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import { GoogleGenAI } from '@google/genai';
// 
// dotenv.config();
// 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// 
// const app = express();
// const PORT = process.env.PORT || 3000;
// const isProduction = process.env.NODE_ENV === 'production';
// 
// app.use(express.json());
// 
// // Initialize GoogleGenAI server-side with telemetry header
// const apiKey = process.env.GEMINI_API_KEY;
// const isRealApiKey = apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.length > 10;
// let aiClient: GoogleGenAI | null = null;
// if (isRealApiKey) {
//   aiClient = new GoogleGenAI({
//     apiKey: apiKey,
//     httpOptions: {
//       headers: {
//         'User-Agent': 'aistudio-build',
//       },
//     },
//   });
// }
// 
// // In-memory state for subscribers, comments, analytics
// const newsletterSubscribers: Set<string> = new Set([
//   'founder@lagosmarket.com',
//   'finance@nairobigrocery.co.ke',
//   'operations@accraretail.gh',
// ]);
// 
// const userComments: Array<{
//   id: string;
//   articleId: string;
//   authorName: string;
//   email: string;
//   comment: string;
//   createdAt: string;
//   status: 'approved' | 'pending';
// }> = [
//   {
//     id: 'comm-1',
//     articleId: 'art-001',
//     authorName: 'Emeka Nwosu',
//     email: 'emeka@nwosugroup.ng',
//     comment: 'Separating personal and corporate bank accounts was the single biggest turning point for our wholesale business in Onitsha. Great breakdown!',
//     createdAt: 'September 23, 2026',
//     status: 'approved',
//   },
//   {
//     id: 'comm-2',
//     articleId: 'art-001',
//     authorName: 'Keziah Wanjiru',
//     email: 'keziah@savannahretail.co.ke',
//     comment: 'The comparison table between Excel and MsmeBooks is spot on. We used to spend 4 days on month-end bank reconciliation; now it takes 20 minutes.',
//     createdAt: 'September 24, 2026',
//     status: 'approved',
//   },
// ];
// 
// let totalViews = 84320;
// let ctaClicks = 3120;
// const searchQueriesLog: Array<{ query: string; count: number }> = [
//   { query: 'pos system retail', count: 142 },
//   { query: 'inventory shrinkage', count: 98 },
//   { query: 'withholding tax compliance', count: 87 },
//   { query: 'cash flow forecasting', count: 76 },
//   { query: 'recipe costing restaurant', count: 64 },
//   { query: 'barcode scanner setup', count: 53 },
// ];
// 
// // Fallback intelligent domain answers if API key is unconfigured or rate limited
// function getFallbackAssistantAnswer(prompt: string, contextTitle?: string): string {
//   const p = prompt.toLowerCase();
//   if (p.includes('summar') || p.includes('summary')) {
//     if (contextTitle) {
//       return `Here is a concise executive summary of "${contextTitle}":\n\n1. **Core Problem**: Manual spreadsheets and paper ledger books create critical financial blind spots that disguise inventory leakage and cash drain.\n2. **The Modern Fix**: Transitioning to an integrated cloud platform (connecting POS, inventory, and accounting in real time) reduces manual reconciliation by over 65% and cuts stockout incidents.\n3. **Immediate Action**: Separate business and personal accounts, automate barcode checkouts at the till, and perform weekly 20-minute financial health reviews with MsmeBooks.`;
//     }
//     return `MsmeBooks articles focus on practical, actionable SME business principles: closing the gap between cash receipts and true net profit, automating multi-store inventory to stop stockouts, using offline-first POS for rapid checkouts, and keeping audit-ready tax books across Africa and globally.`;
//   }
//   if (p.includes('pos') || p.includes('point of sale') || p.includes('checkout')) {
//     return `MsmeBooks Point of Sale (POS) is engineered for fast, reliable retail and hospitality operations:\n\nâ€¢ **Offline-First Resilience**: Keep scanning barcodes, billing customers, and printing receipts even if cellular or broadband internet drops.\nâ€¢ **Instant Inventory Depletion**: Every sale immediately updates stock levels across all your branches and warehouses.\nâ€¢ **Multi-Tender Payments**: Accept cards, bank transfers, QR codes, and cash in seconds.\nâ€¢ **Cashier Accountability**: Till shift auditing prevents unauthorized discounts, price alterations, or till skimming.`;
//   }
//   if (p.includes('inventory') || p.includes('stock') || p.includes('shrinkage') || p.includes('warehouse')) {
//     return `To effectively manage inventory and reduce shrinkage:\n\n1. **Shift to Cycle Counting**: Audit fast-moving or high-value items weekly instead of relying on an annual shutdown count.\n2. **Automate Reorder Points**: Calculate reorder thresholds as: (Average Daily Usage Ã— Lead Time) + Safety Buffer. MsmeBooks drafts purchase orders automatically when stock is low.\n3. **Batch & Expiry Control**: Use First-In, First-Out (FIFO) tracking to discount perishables 30â€“60 days before expiration, avoiding complete write-offs.`;
//   }
//   if (p.includes('accounting') || p.includes('bookkeeping') || p.includes('reconciliation')) {
//     return `The foundation of solid SME accounting with MsmeBooks:\n\nâ€¢ **Daily Bank Feeds**: Match sales to bank deposits daily in under 2 minutes rather than scrambling at month-end.\nâ€¢ **Double-Entry Without Complexity**: Cashiers ring up sales; MsmeBooks automatically generates the underlying debits, credits, and tax schedules.\nâ€¢ **P&L vs Cash Flow**: Track real gross margins by deducting Cost of Goods Sold immediately from billed revenue.`;
//   }
//   if (p.includes('tax') || p.includes('vat') || p.includes('wht') || p.includes('compliance')) {
//     return `For African tax compliance (e.g. FIRS, KRA, GRA, SARS):\n\n1. Maintain a clean digital audit trail for every sales invoice and purchase receipt.\n2. Tag Withholding Tax (WHT) credit notes on corporate invoices so you can offset them against annual Company Income Tax.\n3. MsmeBooks auto-generates monthly VAT and PAYE schedules ready for statutory upload.`;
//   }
//   return `Welcome to MsmeBooks! We help African and global businesses automate accounting, POS checkout, inventory replenishment, and business intelligence. You can ask me any question about retail operations, cash flow management, inventory control, or how to implement MsmeBooks in your business.`;
// }
// 
// // Health check and connection latency endpoint
// app.get('/api/health', (_req: Request, res: Response) => {
//   res.json({
//     status: 'online',
//     timestamp: Date.now(),
//     service: 'msmebooks-core-api',
//     region: 'europe-west2',
//     offlineEngineSupported: true,
//   });
// });
// 
// // 1. AI Business Assistant API endpoint
// app.post('/api/ai/assistant', async (req: Request, res: Response) => {
//   try {
//     const { prompt, articleTitle, articleContent, currency } = req.body;
//     if (!prompt || typeof prompt !== 'string') {
//       res.status(400).json({ error: 'Prompt is required' });
//       return;
//     }
// 
//     if (aiClient) {
//       try {
//         const systemInstruction = `You are the MsmeBooks Business Assistant, an expert AI advisor for MsmeBooks (www.msmebooks.org, phone: +2349158482622), an all-in-one Accounting, POS, Inventory and Business Management platform built specifically for micro, small and medium enterprises (MSMEs) in Africa and worldwide.
// Your tone is professional, warm, encouraging, authoritative, and practical.
// You specialize in:
// - Small business accounting and bookkeeping (double-entry, bank reconciliation, financial statements)
// - Point of Sale (POS) operations, cashier shift audits, offline-first reliability, retail queue busting
// - Inventory management, stock shrinkage prevention, FIFO batch tracking, automated reorder triggers
// - Cash flow management, working capital buffers, reducing debtor days
// - African tax compliance (VAT, Withholding Tax WHT, PAYE, statutory audit readiness)
// - Industry specifics: supermarkets, restaurants, fashion boutiques, pharmacy, wholesale distribution, hardware, beauty salons, e-commerce.
// Always provide concrete, actionable advice without jargon. When relevant, reference how MsmeBooks helps solve the problem. If the user asks about the current article, synthesize insights directly from the article context provided.${currency ? `\nThe visitor has selected ${currency} as their active global currency. When mentioning currency, use ${currency} as appropriate.` : ''}`;
// 
//         let contents = prompt;
//         if (articleTitle) {
//           contents = `Context: The visitor is currently reading the MsmeBooks article titled: "${articleTitle}".\n${articleContent ? `Article excerpt/content:\n${articleContent.slice(0, 1500)}...\n\n` : ''}${currency ? `Visitor Preferred Currency: ${currency}\n\n` : ''}Visitor Question: ${prompt}`;
//         } else if (currency) {
//           contents = `Context: Visitor Preferred Currency is ${currency}.\n\nVisitor Question: ${prompt}`;
//         }
// 
//         const timeoutPromise = new Promise((_, reject) =>
//           setTimeout(() => reject(new Error('AI response timed out')), 6000)
//         );
// 
//         const generatePromise = aiClient.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: contents,
//           config: {
//             systemInstruction: systemInstruction,
//             temperature: 0.7,
//           },
//         });
// 
//         const response: any = await Promise.race([generatePromise, timeoutPromise]);
//         const reply = response.text || getFallbackAssistantAnswer(prompt, articleTitle);
//         res.json({ reply, source: 'gemini' });
//         return;
//       } catch (geminiError) {
//         console.warn('Gemini API call failed, falling back to built-in knowledge base:', geminiError);
//         const reply = getFallbackAssistantAnswer(prompt, articleTitle);
//         res.json({ reply, source: 'knowledge-base-fallback' });
//         return;
//       }
//     } else {
//       // If no GEMINI_API_KEY is provided in environment, use the domain knowledge base
//       const reply = getFallbackAssistantAnswer(prompt, articleTitle);
//       res.json({ reply, source: 'knowledge-base' });
//       return;
//     }
//   } catch (error) {
//     console.error('Error in /api/ai/assistant:', error);
//     res.status(500).json({ error: 'Failed to process AI assistant request' });
//   }
// });
// 
// // 2. Newsletter Subscription endpoint
// app.post('/api/newsletter', (req: Request, res: Response) => {
//   const { email } = req.body;
//   if (!email || typeof email !== 'string' || !email.includes('@')) {
//     res.status(400).json({ error: 'Please provide a valid email address.' });
//     return;
//   }
//   const cleanEmail = email.trim().toLowerCase();
//   const isNew = !newsletterSubscribers.has(cleanEmail);
//   newsletterSubscribers.add(cleanEmail);
// 
//   res.json({
//     success: true,
//     message: isNew
//       ? 'Welcome to the MsmeBooks Insights community! Check your inbox for our latest guide.'
//       : 'You are already subscribed to MsmeBooks insights.',
//     totalSubscribers: newsletterSubscribers.size,
//   });
// });
// 
// // 3. Comments endpoint
// app.get('/api/comments/:articleId', (req: Request, res: Response) => {
//   const { articleId } = req.params;
//   const list = userComments.filter((c) => c.articleId === articleId && c.status === 'approved');
//   res.json(list);
// });
// 
// app.post('/api/comments', (req: Request, res: Response) => {
//   const { articleId, authorName, email, comment } = req.body;
//   if (!articleId || !authorName || !email || !comment) {
//     res.status(400).json({ error: 'All fields are required.' });
//     return;
//   }
// 
//   // Basic anti-spam check
//   if (comment.length < 5 || comment.length > 2000) {
//     res.status(400).json({ error: 'Comment must be between 5 and 2000 characters.' });
//     return;
//   }
// 
//   const newComment = {
//     id: `comm-${Date.now()}`,
//     articleId,
//     authorName: authorName.trim(),
//     email: email.trim(),
//     comment: comment.trim(),
//     createdAt: 'Just now',
//     status: 'approved' as const,
//   };
// 
//   userComments.push(newComment);
//   res.status(201).json({
//     success: true,
//     comment: newComment,
//     message: 'Your comment has been published!',
//   });
// });
// 
// // 4. Analytics endpoint
// app.get('/api/analytics', (_req: Request, res: Response) => {
//   totalViews += Math.floor(Math.random() * 3) + 1;
//   res.json({
//     totalViews,
//     uniqueVisitors: Math.floor(totalViews * 0.68),
//     newsletterSubscribers: newsletterSubscribers.size + 1420,
//     ctaClicks,
//     topArticles: [
//       { title: 'How Better Financial Management Can Transform Your Small Business', views: 14280, category: 'Accounting' },
//       { title: 'How AI Is Changing Business Management for African SMEs', views: 12430, category: 'AI & Automation' },
//       { title: 'How a Modern POS System Can Improve Retail Operations', views: 11850, category: 'POS' },
//       { title: 'Why SMEs Need an All-in-One Business Management Platform', views: 10420, category: 'Business Management' },
//       { title: '7 Accounting Mistakes Small Businesses Should Avoid in 2026', views: 9410, category: 'Accounting' },
//     ],
//     searchQueries: searchQueriesLog,
//     categoryDistribution: [
//       { category: 'Accounting', count: 34 },
//       { category: 'POS Systems', count: 28 },
//       { category: 'Inventory', count: 22 },
//       { category: 'Business Management', count: 19 },
//       { category: 'AI & Automation', count: 14 },
//       { category: 'Retail & Grocery', count: 12 },
//     ],
//     trafficSources: [
//       { source: 'Organic Search (Google / Bing)', percentage: 54 },
//       { source: 'Direct & Bookmarks', percentage: 22 },
//       { source: 'LinkedIn & Social Media', percentage: 14 },
//       { source: 'Partner Portals & Referral', percentage: 10 },
//     ],
//   });
// });
// 
// app.post('/api/analytics/cta-click', (_req: Request, res: Response) => {
//   ctaClicks++;
//   res.json({ success: true, ctaClicks });
// });
// 
// // Start server with Vite middleware in dev or static files in production
// async function startServer() {
//   if (!isProduction) {
//     const { createServer: createViteServer } = await import('vite');
//     const vite = await createViteServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   } else {
//     app.use(express.static(path.resolve(__dirname, 'dist')));
//     app.get('*', (_req: Request, res: Response) => {
//       res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
//     });
//   }
// 
//   app.listen(PORT, () => {
//     console.log(`MsmeBooks platform running on port ${PORT}`);
//   });
// }
// 
// startServer().catch((err) => {
//   console.error('Failed to start server:', err);
//   process.exit(1);
// });
