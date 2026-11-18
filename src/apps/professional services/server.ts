// ============================================================================
// [NETLIFY DEPLOYMENT NOTICE]
// This Express backend dev server file is not intended to be executed on Netlify.
// Netlify is a static SPA hosting platform that serves client-side builds.
// All client-side components have built-in offline & static fallbacks.
// ============================================================================
// import express from 'express';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { GoogleGenAI, Type } from '@google/genai';
// 
// dotenv.config();
// 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// 
// const app = express();
// const PORT = parseInt(process.env.PORT || '3000', 10);
// 
// app.use(express.json());
// 
// // Initialize server-side Gemini client
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
//   httpOptions: {
//     headers: {
//       'User-Agent': 'aistudio-build',
//     },
//   },
// });
// 
// // AI Quick Book Suggestion API
// app.post('/api/quick-book-suggest', async (req, res) => {
//   try {
//     const { 
//       userNotes, 
//       serviceTitle, 
//       serviceCategory, 
//       packages = [], 
//       firms = [], 
//       currentDate = new Date().toISOString().split('T')[0] 
//     } = req.body;
// 
//     if (!userNotes || typeof userNotes !== 'string' || !userNotes.trim()) {
//       return res.status(400).json({ error: 'User notes are required for AI analysis' });
//     }
// 
//     const packageDescriptions = packages.map((p: any) => 
//       `- ID: "${p.id}", Name: "${p.name}", Subtitle: "${p.subtitle || ''}", Duration: "${p.duration || ''}", Deliverables: ${(p.deliverables || []).join(', ')}`
//     ).join('\n');
// 
//     const firmDescriptions = firms.map((f: any) =>
//       `- ID: "${f.id}", Name: "${f.name}", Location: "${f.city}, ${f.country}", Category: "${f.category}", Rating: ${f.rating || 5}`
//     ).join('\n');
// 
//     const prompt = `You are the lead client matching AI for MsmeBooks, a pan-African professional services marketplace.
// Analyze the user's requirements notes to recommend the single most appropriate service package, appointment date, time slot, and qualified firm.
// 
// Current Context:
// - Today's Date: ${currentDate}
// - Service: "${serviceTitle}" (Category: "${serviceCategory || 'Accounting & Tax'}")
// - Available Packages:
// ${packageDescriptions}
// - Qualified Verified Partner Firms:
// ${firmDescriptions}
// 
// Client Notes / Scope:
// """${userNotes}"""
// 
// Instructions:
// 1. Select the most appropriate package from the available list based on client size, complexity, urgency, and deliverables requested.
// 2. Recommend an appointment date (in YYYY-MM-DD format). If the user mentions urgency or a specific timeframe (e.g., 'tomorrow', 'next week', 'urgent', 'by Tuesday'), calculate an appropriate date starting from ${currentDate}. If standard, suggest an appointment within 2-4 business days.
// 3. Recommend a time slot from: ['09:00 AM - 10:30 AM', '10:30 AM - 12:00 PM', '01:00 PM - 02:30 PM', '02:30 PM - 04:00 PM', '04:30 PM - 06:00 PM'].
// 4. Select the most qualified partner firm from the available list.
// 5. Provide a clear, professional 2-3 sentence rationale highlighting why this package and date best solve the client's needs.
// 6. Return structured JSON matching the schema.`;
// 
//     const response = await ai.models.generateContent({
//       model: 'gemini-3.8-flash',
//       contents: prompt,
//       config: {
//         systemInstruction: 'You are an expert commercial accountant and advisory operations director for MsmeBooks. Deliver concise, high-value, highly specific client service recommendations.',
//         responseMimeType: 'application/json',
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             suggestedPackageId: { type: Type.STRING, description: 'ID of the selected package' },
//             suggestedPackageName: { type: Type.STRING, description: 'Name of the selected package' },
//             confidenceScore: { type: Type.INTEGER, description: 'Match confidence percentage (75 to 99)' },
//             suggestedDate: { type: Type.STRING, description: 'Recommended appointment date YYYY-MM-DD' },
//             suggestedTimeSlot: { type: Type.STRING, description: 'Selected time slot' },
//             suggestedFirmId: { type: Type.STRING, description: 'ID of recommended firm' },
//             suggestedFirmName: { type: Type.STRING, description: 'Name of recommended firm' },
//             reasoning: { type: Type.STRING, description: 'Clear 2-3 sentence explanation of the match' },
//             urgencyLevel: { type: Type.STRING, description: 'Urgent, High Priority, or Standard' },
//             keyHighlights: {
//               type: Type.ARRAY,
//               items: { type: Type.STRING },
//               description: '2 to 3 bullet points of matching scope points',
//             },
//           },
//           required: [
//             'suggestedPackageId',
//             'suggestedPackageName',
//             'confidenceScore',
//             'suggestedDate',
//             'suggestedTimeSlot',
//             'reasoning',
//             'urgencyLevel',
//             'keyHighlights'
//           ],
//         },
//       },
//     });
// 
//     const jsonText = response.text?.trim() || '{}';
//     const parsed = JSON.parse(jsonText);
//     return res.json({ success: true, suggestion: parsed });
//   } catch (error: any) {
//     console.error('Error in /api/quick-book-suggest:', error);
//     return res.status(500).json({ 
//       error: 'Failed to analyze notes with AI', 
//       details: error?.message || 'Internal server error' 
//     });
//   }
// });
// 
// // Mount Vite or serve static files
// async function startServer() {
//   if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.resolve(__dirname, 'dist')));
//     app.get('*', (req, res) => {
//       res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
//     });
//   } else {
//     const { createServer } = await import('vite');
//     const vite = await createServer({
//       server: { middlewareMode: true },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   }
// 
//   app.listen(PORT, '0.0.0.0', () => {
//     console.log(`Server listening on http://0.0.0.0:${PORT}`);
//   });
// }
// 
// startServer();
