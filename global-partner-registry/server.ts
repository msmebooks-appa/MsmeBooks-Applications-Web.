// ============================================================================
// [NETLIFY DEPLOYMENT NOTICE]
// This Express backend dev server file is not intended to be executed on Netlify.
// Netlify is a static SPA hosting platform that serves client-side builds.
// All client-side components have built-in offline & static fallbacks.
// ============================================================================
// import express from 'express';
// import path from 'path';
// import { createServer as createViteServer } from 'vite';
// import dotenv from 'dotenv';
// import { GoogleGenAI } from '@google/genai';
// import { PARTNERS_DATA } from './src/data/partnersData';
// 
// dotenv.config();
// 
// // Partner summary catalog for Gemini context (concise for rapid inference)
// const PARTNER_CATALOG_SUMMARY = PARTNERS_DATA.map(p => ({
//   id: p.id,
//   name: p.name,
//   level: p.level,
//   location: `${p.city}, ${p.country}`,
//   startingBudget: p.startingBudget || '$500',
//   budgetTier: p.budgetTier || 'Mid-range',
//   rating: p.rating,
//   responseTime: p.responseTime,
//   remote: p.remoteSupport,
//   specialties: p.specialties.slice(0, 4),
//   services: p.services.slice(0, 3),
// }));
// 
// /**
//  * Intelligent fallback matcher when GEMINI_API_KEY is not configured or in case of transient API error.
//  */
// function matchPartnersFallback(params: {
//   query?: string;
//   businessNeed?: string;
//   budget?: string;
//   location?: string;
// }) {
//   const query = (params.query || '').toLowerCase().trim();
//   const need = (params.businessNeed || '').toLowerCase().trim();
//   const budget = (params.budget || '').toLowerCase().trim();
//   const location = (params.location || '').toLowerCase().trim();
// 
//   // Score each partner
//   const scored = PARTNERS_DATA.map(p => {
//     let score = 0;
//     const pCountry = p.country.toLowerCase();
//     const pCity = p.city.toLowerCase();
//     const pIndustries = p.industries.map(i => i.toLowerCase()).join(' ');
//     const pServices = p.services.map(s => s.toLowerCase()).join(' ');
//     const pSpecialties = p.specialties.map(s => s.toLowerCase()).join(' ');
//     const pAbout = p.about.toLowerCase();
//     const pType = p.partnerType.toLowerCase();
// 
//     // Location matching
//     if (location) {
//       if (pCountry.includes(location) || location.includes(pCountry)) score += 30;
//       if (pCity.includes(location) || location.includes(pCity)) score += 35;
//       if (location.includes('remote') && p.remoteSupport) score += 20;
//     } else if (query) {
//       if (pCountry.split(' ').some(w => query.includes(w)) || pCity.split(' ').some(w => query.includes(w))) {
//         score += 25;
//       }
//     }
// 
//     // Business need matching
//     const searchNeed = need || query;
//     if (searchNeed) {
//       const keywords = searchNeed.split(/\s+/).filter(w => w.length > 2);
//       for (const kw of keywords) {
//         if (pIndustries.includes(kw)) score += 15;
//         if (pServices.includes(kw)) score += 15;
//         if (pSpecialties.includes(kw)) score += 12;
//         if (pType.includes(kw)) score += 10;
//         if (pAbout.includes(kw)) score += 5;
//       }
//     }
// 
//     // Budget matching
//     const searchBudget = budget || query;
//     if (searchBudget) {
//       const minUSD = p.minBudgetUSD || 500;
//       if (searchBudget.includes('under 500') || searchBudget.includes('< 500') || searchBudget.includes('budget') || searchBudget.includes('300') || searchBudget.includes('400')) {
//         if (minUSD <= 500) score += 25;
//         else score -= 10;
//       } else if (searchBudget.includes('1000') || searchBudget.includes('1,000') || searchBudget.includes('mid') || searchBudget.includes('600') || searchBudget.includes('700') || searchBudget.includes('800')) {
//         if (minUSD >= 400 && minUSD <= 1500) score += 20;
//       } else if (searchBudget.includes('enterprise') || searchBudget.includes('1500') || searchBudget.includes('2000') || searchBudget.includes('2,500') || searchBudget.includes('growth')) {
//         if (minUSD >= 1200) score += 20;
//       }
//     }
// 
//     // Fast response bonus if user mentions speed/fast
//     if ((query.includes('fast') || query.includes('quick') || query.includes('urgent')) && (p.responseTime.includes('min') || p.responseTime.includes('1 hour') || p.responseTime.includes('2 hours'))) {
//       score += 15;
//     }
// 
//     // Platinum / Gold rating baseline
//     if (p.level === 'Platinum') score += 5;
//     else if (p.level === 'Gold') score += 3;
//     score += (p.rating - 4.5) * 10;
// 
//     return { partner: p, score };
//   });
// 
//   scored.sort((a, b) => b.score - a.score);
//   const topMatches = scored.slice(0, 3).map(s => s.partner);
// 
//   // Generate clear conversational response
//   const partnerNames = topMatches.map(m => m.name).join(', ');
//   const replyText = topMatches.length > 0
//     ? `Based on your request, I found ${topMatches.length} highly qualified certified partner${topMatches.length > 1 ? 's' : ''} matching your business needs, budget, and location:\n\n` +
//       topMatches.map((m, idx) => `**${idx + 1}. ${m.name}** (${m.city}, ${m.country} â€¢ ${m.level} Partner)\n- **Starting Budget:** ${m.startingBudget}\n- **Specialties:** ${m.specialties.slice(0, 4).join(', ')}\n- **Response Time:** ${m.responseTime} (${m.availabilityStatus})`).join('\n\n') +
//       `\n\nYou can click on any partner below to review their full verified credentials, request a free discovery consultation, or contact them directly.`
//     : `I searched our certified partner network for your criteria, but didn't find an exact match. Here are our top-rated partners who support remote onboarding across all regions.`;
// 
//   return {
//     assistantReply: replyText,
//     recommendedPartnerIds: topMatches.map(m => m.id),
//     extractedCriteria: {
//       businessNeed: params.businessNeed || (query.match(/(pos|inventory|retail|accounting|tax|audit|manufacturing|healthcare|supermarket|hotel|restaurant)/i)?.[0] || ''),
//       budget: params.budget || (query.match(/(\$?\d+[\d,]*|\bunder\s+\$?\d+|\bbudget\b|\bcheap\b|\baffordable\b|\benterprise\b)/i)?.[0] || ''),
//       location: params.location || (query.match(/(nigeria|lagos|kenya|nairobi|ghana|accra|rwanda|kigali|egypt|cairo|south africa|johannesburg|uganda|kampala|uk|london|us|usa|remote)/i)?.[0] || ''),
//     },
//     suggestedQuestions: [
//       'Would you like to schedule a free 30-min discovery consultation?',
//       'Do you require on-site staff training or remote cloud deployment?',
//       'Would you like to filter the main directory by these partners?'
//     ]
//   };
// }
// 
// async function startServer() {
//   const app = express();
//   const PORT = 3000;
// 
//   app.use(express.json());
// 
//   // Health check endpoint
//   app.get('/api/health', (req, res) => {
//     res.json({ 
//       status: 'ok', 
//       geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
//       partnersCount: PARTNERS_DATA.length 
//     });
//   });
// 
//   // Partner AI Query Assistant Endpoint
//   app.post('/api/ai/query-partners', async (req, res) => {
//     try {
//       const { query = '', businessNeed = '', budget = '', location = '', conversationHistory = [] } = req.body;
// 
//       if (!query && !businessNeed && !budget && !location) {
//         return res.status(400).json({ error: 'Please provide a search query or criteria.' });
//       }
// 
//       const apiKey = process.env.GEMINI_API_KEY;
//       const hasValidKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);
// 
//       if (!hasValidKey) {
//         // High-precision intelligent matcher when GEMINI_API_KEY is not yet attached
//         const fallbackResult = matchPartnersFallback({ query, businessNeed, budget, location });
//         return res.json({
//           ...fallbackResult,
//           mode: 'smart-matcher-catalog',
//         });
//       }
// 
//       // Initialize Gemini Client
//       const ai = new GoogleGenAI({
//         apiKey: apiKey,
//         httpOptions: {
//           headers: {
//             'User-Agent': 'aistudio-build',
//           },
//         },
//       });
// 
//       const systemPrompt = `You are the MsmeBooks Partner AI Advisor, an expert enterprise directory assistant for MsmeBooks (a leading accounting, POS, and inventory software platform for emerging markets and global SMBs).
// Your goal is to guide users to the best certified partner from our official registry based on:
// 1. Specific Business Need / Industry (e.g. Retail POS, Multi-branch inventory, Supermarket, Pharmacy, Manufacturing costing, GRA/KRA/FIRS tax compliance, Data migration from legacy systems)
// 2. Budget requirements (e.g. Budget < $500, Mid-range $500 - $1.5k, Growth/Enterprise $1.5k - $3k+)
// 3. Location requirements (e.g. Nigeria/Lagos, Kenya/Nairobi, Ghana/Accra, Rwanda/Kigali, Egypt/Cairo, South Africa, UK, US, Remote, etc.)
// 
// Here is the verified partner catalog you MUST select from (use exact partner IDs):
// ${JSON.stringify(PARTNER_CATALOG_SUMMARY, null, 2)}
// 
// You MUST respond strictly in valid JSON format matching this schema:
// {
//   "assistantReply": "Friendly, professional, concise explanation of which partners are the best fit and why their capabilities, budget, and location match the user's needs. Highlight their specific strengths (e.g. M-Pesa integration, GRA compliance, fast response time under 1-2 hours, starting budget).",
//   "recommendedPartnerIds": ["id1", "id2"], // Pick 1 to 3 best matching partner IDs strictly from the catalog
//   "extractedCriteria": {
//     "businessNeed": "Extracted business need/industry or empty string",
//     "budget": "Extracted budget requirement or empty string",
//     "location": "Extracted location requirement or empty string"
//   },
//   "suggestedQuestions": [
//     "Relevant follow up question 1",
//     "Relevant follow up question 2"
//   ]
// }
// Do NOT output markdown code blocks (like \`\`\`json). Output pure JSON only.`;
// 
//       const userPrompt = `User Query: "${query}"
// Specific Business Need: "${businessNeed}"
// Budget Requirement: "${budget}"
// Location Requirement: "${location}"
// Conversation History Context: ${JSON.stringify(conversationHistory.slice(-4))}`;
// 
//       // Query Gemini with a generous 15 second timeout and max tokens limit
//       const geminiPromise = ai.models.generateContent({
//         model: 'gemini-3.8-flash',
//         contents: userPrompt,
//         config: {
//           systemInstruction: systemPrompt,
//           temperature: 0.1,
//           maxOutputTokens: 800,
//           responseMimeType: 'application/json',
//         },
//       });
// 
//       const timeoutPromise = new Promise((_, reject) => {
//         setTimeout(() => reject(new Error('Gemini API timed out after 15s')), 15000);
//       });
// 
//       const response: any = await Promise.race([geminiPromise, timeoutPromise]);
// 
//       const rawText = response.text || '';
//       try {
//         const parsed = JSON.parse(rawText);
//         return res.json({
//           assistantReply: parsed.assistantReply,
//           recommendedPartnerIds: parsed.recommendedPartnerIds || [],
//           extractedCriteria: parsed.extractedCriteria || { businessNeed, budget, location },
//           suggestedQuestions: parsed.suggestedQuestions || [
//             'Would you like to schedule a consultation?',
//             'Do you need on-site hardware setup or remote configuration?'
//           ],
//           mode: 'gemini-3.8-flash'
//         });
//       } catch (parseError) {
//         console.warn('Could not parse Gemini JSON response, utilizing resilient catalog matcher', parseError);
//         const fallbackResult = matchPartnersFallback({ query, businessNeed, budget, location });
//         return res.json({
//           ...fallbackResult,
//           mode: 'gemini-fallback',
//         });
//       }
// 
//     } catch (err: any) {
//       console.warn('Notice: Gemini API query redirected to resilient catalog matcher:', err?.message || err);
//       // Fallback seamlessly so user never sees a broken chat UI
//       const fallbackResult = matchPartnersFallback({
//         query: req.body?.query,
//         businessNeed: req.body?.businessNeed,
//         budget: req.body?.budget,
//         location: req.body?.location
//       });
//       return res.json({
//         ...fallbackResult,
//         mode: 'resilient-catalog-match',
//       });
//     }
//   });
// 
//   // Setup Vite middleware in dev mode
//   if (process.env.NODE_ENV !== 'production') {
//     const vite = await createViteServer({
//       server: {
//         middlewareMode: true,
//         hmr: false,
//       },
//       appType: 'spa',
//     });
// 
//     // Intercept @vite/client to neutralize WebSocket connection and prevent "WebSocket closed without opened" in iframe
//     app.use((req, res, next) => {
//       if (req.url && req.url.includes('@vite/client')) {
//         const origWrite = res.write.bind(res);
//         const origEnd = res.end.bind(res);
//         const chunks: Buffer[] = [];
// 
//         res.write = ((chunk: any) => {
//           if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
//           return true;
//         }) as any;
// 
//         res.end = ((chunk: any, ...args: any[]) => {
//           if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
//           let body = Buffer.concat(chunks).toString('utf8');
//           // Replace reject("WebSocket closed without opened.") with safe resolution
//           body = body.replace(
//             /reject\(\/\* @__PURE__ \*\/ new Error\("WebSocket closed without opened\."\)\);/g,
//             'resolve();'
//           );
//           body = body.replace(
//             /reject\(new Error\("WebSocket closed without opened\."\)\);/g,
//             'resolve();'
//           );
//           // Suppress websocket connection errors
//           body = body.replace(
//             /console\.error\(`\[vite\] failed to connect to websocket \(\$\{e\}\)\. `\);/g,
//             '/* silenced vite hmr websocket notice */'
//           );
//           res.setHeader('Content-Length', Buffer.byteLength(body));
//           origWrite(body);
//           return origEnd(...args);
//         }) as any;
//       }
//       next();
//     });
// 
//     app.use(vite.middlewares);
//   } else {
//     const distPath = path.join(process.cwd(), 'dist');
//     app.use(express.static(distPath));
//     app.get('*', (req, res) => {
//       res.sendFile(path.join(distPath, 'index.html'));
//     });
//   }
// 
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server listening on http://0.0.0.0:${PORT}`);
//   });
// }
// 
// startServer();
