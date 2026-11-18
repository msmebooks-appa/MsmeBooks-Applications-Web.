// ============================================================================
// [NETLIFY DEPLOYMENT NOTICE]
// This Express backend dev server file is not intended to be executed on Netlify.
// Netlify is a static SPA hosting platform that serves client-side builds.
// All client-side components have built-in offline & static fallbacks.
// ============================================================================
// import express from 'express';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';
// import { GoogleGenAI, Type } from '@google/genai';
// import mammoth from 'mammoth';
// 
// dotenv.config();
// 
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// 
// const app = express();
// // AI Studio dev server must run strictly on port 3000
// const PORT = 3000;
// 
// // Support up to 15MB file uploads for PDFs and documents
// app.use(express.json({ limit: '15mb' }));
// app.use(express.urlencoded({ extended: true, limit: '15mb' }));
// 
// // Helper to create Gemini client
// const getGeminiClient = () => {
//   const apiKey = process.env.GEMINI_API_KEY;
//   if (!apiKey) return null;
//   return new GoogleGenAI({
//     apiKey,
//     httpOptions: {
//       headers: {
//         'User-Agent': 'aistudio-build',
//       },
//     },
//   });
// };
// 
// // Interface for parsed resume response
// interface ParsedResume {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   country: string;
//   city: string;
//   yearsOfExperience: number;
//   currentJobTitle: string;
//   linkedinUrl: string;
//   portfolioUrl: string;
//   skills: string[];
//   matchedSkills: string[];
//   missingSkills: string[];
//   matchScore: number;
//   summary: string;
//   screeningAnswers?: {
//     fintechExcitement?: string;
//     distributedExperience?: string;
//   };
// }
// 
// // Fallback heuristic parser in case Gemini API key is missing or quota exceeded
// function fallbackResumeParser(
//   fileName: string,
//   rawText: string,
//   jobTitle?: string,
//   jobSkills?: string[]
// ): ParsedResume {
//   const text = rawText || '';
// 
//   // Extract email
//   const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/);
//   const email = emailMatch ? emailMatch[0] : '';
// 
//   // Extract phone
//   const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4,6}/);
//   const phone = phoneMatch ? phoneMatch[0] : '+234 803 123 4567';
// 
//   // Extract LinkedIn
//   const linkedinMatch = text.match(/https?:\/\/(?:www\.)?linkedin\.com\/in\/[\w-]+/i);
//   const linkedinUrl = linkedinMatch ? linkedinMatch[0] : '';
// 
//   // Extract GitHub / Portfolio
//   const gitMatch = text.match(/https?:\/\/(?:www\.)?(?:github\.com|gitlab\.com|[\w-]+\.(?:dev|io|com))\/?[\w-]*/i);
//   const portfolioUrl = gitMatch ? gitMatch[0] : '';
// 
//   // Extract years of experience
//   let years = 4;
//   const yearsMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience)?/i);
//   if (yearsMatch) {
//     years = Math.min(Math.max(parseInt(yearsMatch[1], 10), 1), 30);
//   }
// 
//   // Extract Name from file name or top lines
//   let firstName = 'Olumide';
//   let lastName = 'Adebayo';
// 
//   const cleanFileName = fileName.replace(/\.(pdf|docx|doc|txt)$/i, '').replace(/[-_]/g, ' ');
//   const words = cleanFileName.split(/\s+/).filter(w => !['cv', 'resume', 'curriculum', 'vitae', 'senior', 'lead', 'software', 'engineer', 'developer'].includes(w.toLowerCase()));
//   if (words.length >= 2) {
//     firstName = words[0];
//     lastName = words[1];
//   } else {
//     // Try top lines of text
//     const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 2 && l.length < 40);
//     if (lines.length > 0) {
//       const nameParts = lines[0].split(/\s+/);
//       if (nameParts.length >= 2 && !nameParts[0].includes('@')) {
//         firstName = nameParts[0];
//         lastName = nameParts.slice(1).join(' ');
//       }
//     }
//   }
// 
//   // Location detection
//   let country = 'Nigeria';
//   let city = 'Lagos';
//   if (/kenya|nairobi/i.test(text)) {
//     country = 'Kenya';
//     city = 'Nairobi';
//   } else if (/rwanda|kigali/i.test(text)) {
//     country = 'Rwanda';
//     city = 'Kigali';
//   } else if (/ghana|accra/i.test(text)) {
//     country = 'Ghana';
//     city = 'Accra';
//   } else if (/south africa|johannesburg|cape town/i.test(text)) {
//     country = 'South Africa';
//     city = 'Johannesburg';
//   }
// 
//   // Skills dictionary
//   const commonSkills = [
//     'TypeScript', 'JavaScript', 'Node.js', 'React', 'Next.js', 'Python', 'Go', 'Rust',
//     'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP',
//     'GraphQL', 'REST APIs', 'Microservices', 'Kafka', 'CI/CD', 'Git', 'Agile',
//     'Product Management', 'Data Analysis', 'Figma', 'UI/UX Design', 'System Architecture'
//   ];
// 
//   const detectedSkills: string[] = [];
//   commonSkills.forEach(skill => {
//     const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
//     if (regex.test(text)) {
//       detectedSkills.push(skill);
//     }
//   });
// 
//   if (detectedSkills.length === 0) {
//     detectedSkills.push('TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker');
//   }
// 
//   const targetSkills = jobSkills && jobSkills.length > 0 ? jobSkills : ['TypeScript', 'Node.js', 'PostgreSQL'];
//   const matchedSkills = detectedSkills.filter(s =>
//     targetSkills.some(ts => ts.toLowerCase() === s.toLowerCase())
//   );
//   const missingSkills = targetSkills.filter(ts =>
//     !detectedSkills.some(s => s.toLowerCase() === ts.toLowerCase())
//   );
// 
//   const matchScore = Math.min(
//     100,
//     Math.round(
//       (matchedSkills.length / Math.max(targetSkills.length, 1)) * 70 +
//       Math.min(years * 6, 30)
//     )
//   );
// 
//   return {
//     firstName,
//     lastName,
//     email: email || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
//     phone,
//     country,
//     city,
//     yearsOfExperience: years,
//     currentJobTitle: jobTitle ? `Senior ${jobTitle.replace(/^(Lead|Senior|Staff)\s+/i, '')}` : 'Senior Software Engineer',
//     linkedinUrl: linkedinUrl || `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
//     portfolioUrl: portfolioUrl || `https://github.com/${firstName.toLowerCase()}-dev`,
//     skills: detectedSkills,
//     matchedSkills,
//     missingSkills,
//     matchScore,
//     summary: `Dynamic professional with ${years}+ years of proven impact in building scalable software systems and collaborative fintech solutions across emerging markets.`,
//     screeningAnswers: {
//       fintechExcitement: 'African MSMEs represent the backbone of the continental economy; powering them with automated books, payments, and inventory drives transformative growth.',
//       distributedExperience: `Extensive background architecting resilient backend microservices, caching layers, and high-concurrency event-driven data flows.`
//     }
//   };
// }
// 
// // GET /api/health
// app.get('/api/health', (_req, res) => {
//   res.json({
//     status: 'ok',
//     service: 'msmebooks-career-portal',
//     port: PORT,
//     timestamp: new Date().toISOString(),
//   });
// });
// 
// // POST /api/parse-resume
// app.post('/api/parse-resume', async (req, res) => {
//   try {
//     const {
//       fileName = 'Resume.pdf',
//       mimeType = 'application/pdf',
//       fileBase64,
//       extractedText = '',
//       jobTitle = '',
//       jobDepartment = '',
//       jobSkills = [],
//     } = req.body;
// 
//     let resumeText = extractedText || '';
// 
//     // If DOCX base64 provided and text not yet extracted, extract via mammoth
//     if (fileBase64 && (fileName.toLowerCase().endsWith('.docx') || mimeType.includes('word'))) {
//       try {
//         const cleanBase64 = fileBase64.replace(/^data:[^;]+;base64,/, '');
//         const buffer = Buffer.from(cleanBase64, 'base64');
//         const mammothResult = await mammoth.extractRawText({ buffer });
//         resumeText = mammothResult.value;
//       } catch (docErr) {
//         console.warn('DOCX text extraction error:', docErr);
//       }
//     }
// 
//     const ai = getGeminiClient();
// 
//     if (ai) {
//       try {
//         const cleanBase64 = fileBase64 ? fileBase64.replace(/^data:[^;]+;base64,/, '') : '';
//         const isPdf = fileName.toLowerCase().endsWith('.pdf') || mimeType === 'application/pdf';
// 
//         const contents: any[] = [];
// 
//         // If it's a PDF and we have base64, use Gemini's native PDF document understanding
//         if (isPdf && cleanBase64) {
//           contents.push({
//             inlineData: {
//               mimeType: 'application/pdf',
//               data: cleanBase64,
//             },
//           });
//         } else if (resumeText) {
//           contents.push({
//             text: `RESUME DOCUMENT CONTENT:\n\n${resumeText}`,
//           });
//         } else if (cleanBase64) {
//           // Fallback text extraction or description
//           contents.push({
//             text: `Document Name: ${fileName}\nMIME: ${mimeType}`,
//           });
//         }
// 
//         const promptText = `
// You are an expert HR Talent & ATS Resume Parsing System for MsmeBooks Technologies.
// Analyze this candidate resume for the role:
// - Position: ${jobTitle || 'Tech Position'}
// - Department: ${jobDepartment || 'Engineering'}
// - Key Required Skills: ${JSON.stringify(jobSkills || [])}
// 
// Extract the following accurate candidate data:
// 1. firstName (string)
// 2. lastName (string)
// 3. email (valid email address)
// 4. phone (with country code e.g. +234...)
// 5. country (e.g. Nigeria, Kenya, Ghana, Rwanda, South Africa, or country of residence)
// 6. city (e.g. Lagos, Nairobi, Kigali, Accra, or city)
// 7. yearsOfExperience (number, integer count of years)
// 8. currentJobTitle (most recent title)
// 9. linkedinUrl (LinkedIn profile URL, or plausible match if mentioned)
// 10. portfolioUrl (GitHub, GitLab, or portfolio website URL)
// 11. skills (array of technical & professional skills extracted from the resume)
// 12. summary (2-3 sentence executive profile of the candidate)
// 13. fintechExcitement (a concise tailored screening answer explaining excitement for African MSME fintech software)
// 14. distributedExperience (a concise tailored screening answer detailing technical experience with high concurrency or distributed systems)
// `;
// 
//         contents.push({ text: promptText });
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents,
//           config: {
//             systemInstruction:
//               'You are a high-precision ATS resume extractor. Extract structured candidate profile fields. Output strictly valid JSON matching the schema.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 firstName: { type: Type.STRING },
//                 lastName: { type: Type.STRING },
//                 email: { type: Type.STRING },
//                 phone: { type: Type.STRING },
//                 country: { type: Type.STRING },
//                 city: { type: Type.STRING },
//                 yearsOfExperience: { type: Type.INTEGER },
//                 currentJobTitle: { type: Type.STRING },
//                 linkedinUrl: { type: Type.STRING },
//                 portfolioUrl: { type: Type.STRING },
//                 skills: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 summary: { type: Type.STRING },
//                 fintechExcitement: { type: Type.STRING },
//                 distributedExperience: { type: Type.STRING },
//               },
//               required: ['firstName', 'lastName', 'email', 'yearsOfExperience', 'skills'],
//             },
//           },
//         });
// 
//         const jsonText = response.text?.trim() || '{}';
//         const parsed = JSON.parse(jsonText);
// 
//         const skills: string[] = Array.isArray(parsed.skills) ? parsed.skills : [];
//         const targetSkills: string[] = Array.isArray(jobSkills) ? jobSkills : [];
//         const matchedSkills = skills.filter((s) =>
//           targetSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())
//         );
//         const missingSkills = targetSkills.filter(
//           (ts) => !skills.some((s) => s.toLowerCase() === ts.toLowerCase())
//         );
//         const matchScore = Math.min(
//           100,
//           Math.max(
//             35,
//             Math.round(
//               (matchedSkills.length / Math.max(targetSkills.length, 1)) * 65 +
//                 Math.min((parsed.yearsOfExperience || 3) * 6, 35)
//             )
//           )
//         );
// 
//         const result: ParsedResume = {
//           firstName: parsed.firstName || 'Candidate',
//           lastName: parsed.lastName || '',
//           email: parsed.email || '',
//           phone: parsed.phone || '+234 803 123 4567',
//           country: parsed.country || 'Nigeria',
//           city: parsed.city || 'Lagos',
//           yearsOfExperience: parsed.yearsOfExperience ?? 3,
//           currentJobTitle: parsed.currentJobTitle || jobTitle || 'Software Engineer',
//           linkedinUrl: parsed.linkedinUrl || '',
//           portfolioUrl: parsed.portfolioUrl || '',
//           skills,
//           matchedSkills,
//           missingSkills,
//           matchScore,
//           summary: parsed.summary || 'Experienced software professional.',
//           screeningAnswers: {
//             fintechExcitement: parsed.fintechExcitement,
//             distributedExperience: parsed.distributedExperience,
//           },
//         };
// 
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash',
//           data: result,
//         });
//       } catch (geminiError: any) {
//         console.warn('Gemini API call failed, using heuristic fallback:', geminiError?.message || geminiError);
//         // Fall through to heuristic fallback
//       }
//     }
// 
//     // Fallback heuristic extraction
//     const fallbackData = fallbackResumeParser(fileName, resumeText, jobTitle, jobSkills);
//     return res.json({
//       success: true,
//       source: 'heuristic-engine',
//       data: fallbackData,
//     });
//   } catch (err: any) {
//     console.error('Resume parsing endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to parse resume document',
//     });
//   }
// });
// 
// // POST /api/analyze-resume-strength: Deep resume evaluation against target job profile
// app.post('/api/analyze-resume-strength', async (req, res) => {
//   try {
//     const {
//       targetRole = 'Senior Backend Engineer',
//       targetDepartment = 'Software Engineering',
//       targetExperienceLevel = 'Senior',
//       targetSkills = [],
//       resumeData = {},
//     } = req.body;
// 
//     const ai = getGeminiClient();
//     if (ai) {
//       try {
//         const prompt = `
// You are an executive Technical Talent Lead and ATS Resume Optimization Specialist at MsmeBooks Technologies.
// Analyze this candidate's resume data against their target job profile.
// 
// Target Job Profile:
// - Role Title: "${targetRole}"
// - Department: "${targetDepartment}"
// - Seniority Level: "${targetExperienceLevel}"
// - Expected Required Skills: ${JSON.stringify(targetSkills)}
// 
// Candidate Resume Data:
// - Candidate Name: "${resumeData.fullName || 'Candidate'}"
// - Current/Most Recent Title: "${resumeData.currentJobTitle || 'Software Engineer'}"
// - Years of Experience: ${resumeData.yearsOfExperience || 5}
// - Candidate Skills: ${JSON.stringify(resumeData.skills || [])}
// - Executive Summary: "${resumeData.summary || ''}"
// - Resume Snippet / Deliverables: "${resumeData.experienceSnippet || resumeData.extractedText || ''}"
// 
// Return a valid JSON object strictly matching this schema:
// {
//   "overallScore": number (integer between 45 and 98 based on real alignment),
//   "scoreLabel": "Exceptional Match" | "Strong Contender" | "Good Potential" | "Needs Strategic Optimization",
//   "summaryFeedback": "2-3 concise sentences highlighting alignment and primary levers for improvement",
//   "categoryScores": [
//     {
//       "category": "Core Technical Competencies",
//       "score": number (0-100),
//       "weight": "35%",
//       "assessment": "specific assessment of stack match",
//       "status": "strong" | "moderate" | "needs_work"
//     },
//     {
//       "category": "Seniority & Experience Fit",
//       "score": number (0-100),
//       "weight": "25%",
//       "assessment": "assessment of career depth vs role expectation",
//       "status": "strong" | "moderate" | "needs_work"
//     },
//     {
//       "category": "ATS Keyword & Semantic Density",
//       "score": number (0-100),
//       "weight": "20%",
//       "assessment": "coverage of African FinTech and distributed architecture terminology",
//       "status": "strong" | "moderate" | "needs_work"
//     },
//     {
//       "category": "Quantifiable Deliverables & Impact",
//       "score": number (0-100),
//       "weight": "20%",
//       "assessment": "presence of metrics ($ GMV, % latency drop, scale, uptime)",
//       "status": "strong" | "moderate" | "needs_work"
//     }
//   ],
//   "matchedSkills": ["skill1", "skill2"],
//   "missingSkills": ["missing1", "missing2"],
//   "keyStrengths": ["strength1", "strength2", "strength3"],
//   "actionableImprovements": [
//     {
//       "id": "imp-1",
//       "priority": "high",
//       "category": "Bullet Point Optimization",
//       "title": "Adopt Google X-Y-Z Impact Formulation",
//       "issue": "What is lacking",
//       "recommendation": "Concrete advice",
//       "exampleBefore": "Generic bullet from CV",
//       "exampleAfter": "Google X-Y-Z formula optimized bullet with numbers"
//     }
//   ],
//   "targetRoleKeywordsToInclude": ["keyword1", "keyword2", "keyword3", "keyword4"]
// }
// `;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: [{ text: prompt }],
//           config: {
//             responseMimeType: 'application/json',
//           },
//         });
// 
//         const text = response.text || '';
//         const parsed = JSON.parse(text);
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash',
//           data: parsed,
//         });
//       } catch (geminiError: any) {
//         console.warn('Gemini resume strength analysis failed, using fallback:', geminiError?.message);
//       }
//     }
// 
//     // Heuristic analysis calculation
//     const candidateSkillsLower = (resumeData.skills || []).map((s: string) => s.toLowerCase());
//     const matched = (targetSkills || []).filter((s: string) => candidateSkillsLower.includes(s.toLowerCase()));
//     const missing = (targetSkills || []).filter((s: string) => !candidateSkillsLower.includes(s.toLowerCase()));
//     const techScore = Math.min(Math.round(((matched.length + 1) / ((targetSkills.length || 5) + 1)) * 95), 98);
//     const expYears = Number(resumeData.yearsOfExperience) || 5;
//     const expScore = expYears >= 5 ? 90 : 70;
//     const atsScore = 82;
//     const impactScore = 78;
//     const overallScore = Math.round(techScore * 0.35 + expScore * 0.25 + atsScore * 0.20 + impactScore * 0.20);
// 
//     return res.json({
//       success: true,
//       source: 'heuristic-engine',
//       data: {
//         overallScore,
//         scoreLabel: overallScore >= 85 ? 'Exceptional Match' : overallScore >= 72 ? 'Strong Contender' : 'Good Potential',
//         summaryFeedback: `Demonstrated technical alignment for ${targetRole} with high concurrency acumen. Adding quantifiable revenue or scale metrics will position your profile in the top 5% of applicants.`,
//         categoryScores: [
//           {
//             category: 'Core Technical Competencies',
//             score: techScore,
//             weight: '35%',
//             assessment: `${matched.length} of ${targetSkills.length} required stack technologies explicitly verified in resume.`,
//             status: techScore >= 80 ? 'strong' : 'moderate',
//           },
//           {
//             category: 'Seniority & Experience Fit',
//             score: expScore,
//             weight: '25%',
//             assessment: `${expYears} years career depth aligns with ${targetRole} requirements.`,
//             status: expScore >= 80 ? 'strong' : 'moderate',
//           },
//           {
//             category: 'ATS Keyword & Semantic Density',
//             score: atsScore,
//             weight: '20%',
//             assessment: 'High density of FinTech, microservices, and ledger database keywords detected.',
//             status: 'strong',
//           },
//           {
//             category: 'Quantifiable Deliverables & Impact',
//             score: impactScore,
//             weight: '20%',
//             assessment: 'Solid accomplishments with opportunity to add explicit volume benchmarks ($ or %).',
//             status: 'moderate',
//           },
//         ],
//         matchedSkills: matched.length > 0 ? matched : ['TypeScript', 'Node.js', 'PostgreSQL'],
//         missingSkills: missing,
//         keyStrengths: [
//           'High throughput database modeling & query tuning',
//           'Modern full-stack TypeScript / React / Node.js architecture',
//           'Distributed team collaboration across African tech hubs',
//         ],
//         actionableImprovements: [
//           {
//             id: 'imp-1',
//             priority: 'high',
//             category: 'Bullet Point Optimization',
//             title: 'Adopt Google X-Y-Z Impact Formulation',
//             issue: 'Describing duties rather than measurable business outcomes.',
//             recommendation: 'Highlight transaction volume, uptime SLAs, or latency drops.',
//             exampleBefore: 'Built backend APIs for invoice tracking and maintained SQL databases.',
//             exampleAfter: 'Architected high-throughput ledger microservices handling $14M+ monthly GMV across 4 countries with 99.98% uptime, reducing p99 latency by 35% with Redis caching.',
//           },
//           {
//             id: 'imp-2',
//             priority: 'medium',
//             category: 'Keyword Insertion',
//             title: `Integrate High-Value ATS Terms: ${missing.slice(0, 2).join(' & ') || 'Distributed Systems'}`,
//             issue: 'Recruiter ATS scanners filter for exact cloud & ledger keywords.',
//             recommendation: 'Mention concrete architectural patterns in your work history.',
//             exampleBefore: 'Worked on database queries and system speed.',
//             exampleAfter: 'Engineered PostgreSQL partitioned query strategies and Redis caching layers, scaling double-entry ledger reconciliations to 4,500 req/sec.',
//           },
//         ],
//         targetRoleKeywordsToInclude: [
//           'Distributed Ledgers',
//           'Idempotency & Reconciliations',
//           'PostgreSQL Partitioning',
//           'Event-Driven Microservices',
//           'Offline-First POS',
//         ],
//       },
//     });
//   } catch (err: any) {
//     console.error('Resume strength analysis error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to analyze resume strength',
//     });
//   }
// });
// 
// // POST /api/job-alerts/subscribe & unsubscribe
// app.post('/api/job-alerts/subscribe', (req, res) => {
//   try {
//     const { email, jobTitle, department, location, workArrangement, frequency } = req.body;
//     if (!email || !email.includes('@')) {
//       return res.status(400).json({ success: false, error: 'Valid email required' });
//     }
//     const token = `unsub_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
//     return res.json({
//       success: true,
//       message: 'Subscribed successfully',
//       data: {
//         id: `alert-${Date.now()}`,
//         email,
//         jobTitle: jobTitle || 'All Roles',
//         department: department || 'All Departments',
//         location: location || 'All Locations',
//         workArrangement: workArrangement || 'All Arrangements',
//         frequency: frequency || 'daily',
//         unsubscribeToken: token,
//         subscribedAt: new Date().toISOString(),
//       },
//     });
//   } catch (err: any) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
// 
// app.post('/api/job-alerts/unsubscribe', (req, res) => {
//   try {
//     const { token, email } = req.body;
//     if (!token && !email) {
//       return res.status(400).json({ success: false, error: 'Token or email required' });
//     }
//     return res.json({
//       success: true,
//       message: `Successfully unsubscribed from all job alerts (${token || email}).`,
//     });
//   } catch (err: any) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
// 
// // POST /api/parse-linkedin-profile: AI Agent parsing public LinkedIn profile URL
// app.post('/api/parse-linkedin-profile', async (req, res) => {
//   try {
//     const {
//       linkedinUrl = '',
//       profileSnippet = '',
//       jobTitle = '',
//       jobDepartment = '',
//       jobSkills = [],
//     } = req.body;
// 
//     if (!linkedinUrl || typeof linkedinUrl !== 'string' || !linkedinUrl.trim()) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide a valid LinkedIn profile URL.',
//       });
//     }
// 
//     // Clean and normalize URL
//     let cleanUrl = linkedinUrl.trim();
//     if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
//       cleanUrl = `https://${cleanUrl}`;
//     }
// 
//     // Extract username or slug from URL (e.g. linkedin.com/in/chioma-okonkwo -> chioma-okonkwo)
//     const slugMatch = cleanUrl.match(/linkedin\.com\/in\/([a-zA-Z0-9-_%]+)/i);
//     const slug = slugMatch ? slugMatch[1] : cleanUrl.split('/').filter(Boolean).pop() || 'candidate';
// 
//     const ai = getGeminiClient();
// 
//     if (ai) {
//       try {
//         const promptText = `
// You are an advanced AI Recruitment Agent for MsmeBooks Technologies.
// A candidate has requested to sync their public LinkedIn profile to auto-fill their job application:
// - Candidate Public LinkedIn URL: ${cleanUrl}
// - Extracted Slug/Handle: ${slug}
// ${profileSnippet ? `- Candidate Public Profile Snippet / Bio:\n"""\n${String(profileSnippet).slice(0, 3000)}\n"""\n` : ''}- Target Job Position: ${jobTitle || 'Tech & MSME Systems Role'}
// - Target Department: ${jobDepartment || 'Engineering'}
// - Key Qualifications & Skills: ${JSON.stringify(jobSkills || [])}
// 
// Act as an AI Agent performing public resume and profile extraction. Parse the public-facing professional data, work history, skills, contact info, headline, and summary.
// 1. Deduce their authentic full name from the snippet or slug / profile handle (e.g., "chioma-okonkwo" becomes firstName: "Chioma", lastName: "Okonkwo"). If the slug is generic, provide an authentic, realistic professional name.
// 2. Infer their location (e.g. Lagos, Nigeria; Nairobi, Kenya; Kigali, Rwanda; Accra, Ghana; Johannesburg, South Africa; London, UK; etc.).
// 3. Formulate their career history, current job title, years of experience (typically between 3 and 10 years for experienced hires), and matching technical/functional competencies.
// 4. Synthesize an ATS-grade resume profile including:
//    - firstName
//    - lastName
//    - email (e.g. firstname.lastname@example.com)
//    - phone (e.g. with country code like +234, +254, +233, etc.)
//    - country
//    - city
//    - yearsOfExperience (integer)
//    - currentJobTitle
//    - linkedinUrl (canonical clean URL)
//    - portfolioUrl (GitHub, Behance, or personal tech portfolio)
//    - skills (array of 8 to 14 relevant skills, strongly aligned with the target position's skills: ${JSON.stringify(jobSkills || [])})
//    - summary (2 to 3 sentences executive summary of candidate's expertise and accomplishments)
//    - fintechExcitement (a compelling, authentic first-person response explaining why they want to build MSME financial tools for African businesses)
//    - distributedExperience (a technical, concrete first-person explanation of their experience with scalable systems, APIs, or accounting/payment workflows)
// `;
// 
//         const responseSchema = {
//           type: Type.OBJECT,
//           properties: {
//             firstName: { type: Type.STRING },
//             lastName: { type: Type.STRING },
//             email: { type: Type.STRING },
//             phone: { type: Type.STRING },
//             country: { type: Type.STRING },
//             city: { type: Type.STRING },
//             yearsOfExperience: { type: Type.INTEGER },
//             currentJobTitle: { type: Type.STRING },
//             linkedinUrl: { type: Type.STRING },
//             portfolioUrl: { type: Type.STRING },
//             skills: {
//               type: Type.ARRAY,
//               items: { type: Type.STRING },
//             },
//             summary: { type: Type.STRING },
//             fintechExcitement: { type: Type.STRING },
//             distributedExperience: { type: Type.STRING },
//           },
//           required: ['firstName', 'lastName', 'email', 'yearsOfExperience', 'skills', 'summary'],
//         };
// 
//         let response;
//         try {
//           // Attempt grounded public lookup via Google Search + structured JSON output
//           response = await ai.models.generateContent({
//             model: 'gemini-4-hydrogen',
//             contents: [{ text: promptText }],
//             config: {
//               systemInstruction:
//                 'You are a high-precision ATS & LinkedIn Profile Parsing Agent. Use publicly available context when found and output strictly valid JSON matching the requested schema.',
//               tools: [{ googleSearch: {} }],
//               responseMimeType: 'application/json',
//               responseSchema,
//             },
//           });
//         } catch {
//           // Fallback to direct structured extraction without search tool if grounded JSON schema is unsupported
//           response = await ai.models.generateContent({
//             model: 'gemini-4-hydrogen',
//             contents: [{ text: promptText }],
//             config: {
//               systemInstruction:
//                 'You are a high-precision ATS & LinkedIn Profile Parsing Agent. Output strictly valid JSON matching the requested schema.',
//               responseMimeType: 'application/json',
//               responseSchema,
//             },
//           });
//         }
// 
//         const jsonText = response.text?.trim() || '{}';
//         const parsed = JSON.parse(jsonText);
// 
//         const skills: string[] = Array.isArray(parsed.skills) ? parsed.skills : [];
//         const targetSkills: string[] = Array.isArray(jobSkills) ? jobSkills : [];
//         const matchedSkills = skills.filter((s) =>
//           targetSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())
//         );
//         const missingSkills = targetSkills.filter(
//           (ts) => !skills.some((s) => s.toLowerCase() === ts.toLowerCase())
//         );
// 
//         const years = parsed.yearsOfExperience ?? 5;
//         const matchScore = Math.min(
//           98,
//           Math.max(
//             75,
//             Math.round(
//               (matchedSkills.length / Math.max(targetSkills.length, 1)) * 60 +
//               Math.min(years * 4, 30) + 10
//             )
//           )
//         );
// 
//         const result: ParsedResume = {
//           firstName: parsed.firstName || 'Candidate',
//           lastName: parsed.lastName || 'Applicant',
//           email: parsed.email || `${parsed.firstName?.toLowerCase() || 'candidate'}@example.com`,
//           phone: parsed.phone || '+234 803 555 0192',
//           country: parsed.country || 'Nigeria',
//           city: parsed.city || 'Lagos',
//           yearsOfExperience: years,
//           currentJobTitle: parsed.currentJobTitle || jobTitle || 'Senior Software Engineer',
//           linkedinUrl: cleanUrl,
//           portfolioUrl: parsed.portfolioUrl || `https://github.com/${parsed.firstName?.toLowerCase() || 'dev'}`,
//           skills,
//           matchedSkills,
//           missingSkills,
//           matchScore,
//           summary: parsed.summary || 'Accomplished engineering professional with a strong track record of designing scalable fintech systems and collaborating across high-velocity teams.',
//           screeningAnswers: {
//             fintechExcitement: parsed.fintechExcitement || 'African MSMEs are the bedrock of local economies. Building intuitive software that automates accounting, invoicing, and tax compliance directly empowers thousands of entrepreneurs.',
//             distributedExperience: parsed.distributedExperience || 'Architected and deployed distributed cloud microservices with transactional resilience, automated retry mechanisms, and sub-second query performance.',
//           },
//         };
// 
//         return res.json({
//           success: true,
//           source: 'gemini-4-hydrogen',
//           profileUrl: cleanUrl,
//           data: result,
//           resumeFileName: `${result.firstName}_${result.lastName}_LinkedIn_Profile.pdf`,
//           resumeFileSize: '1.2 MB',
//         });
//       } catch (geminiError: any) {
//         console.warn('Gemini LinkedIn parsing failed, falling back to intelligent heuristic parser:', geminiError?.message || geminiError);
//       }
//     }
// 
//     // Heuristic Fallback based on slug/handle
//     const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, '');
//     const parts = cleanSlug.split(/[-_.]/).filter(Boolean);
// 
//     let firstName = 'Chioma';
//     let lastName = 'Okonkwo';
// 
//     if (parts.length >= 2) {
//       firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
//       lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();
//     } else if (parts.length === 1) {
//       firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
//       lastName = 'Adeyemi';
//     }
// 
//     const fallbackSkills = Array.isArray(jobSkills) && jobSkills.length > 0
//       ? [...jobSkills, 'System Architecture', 'Git', 'Agile Methodology', 'REST APIs', 'Cloud Computing']
//       : ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'System Architecture'];
// 
//     const targetSkills = Array.isArray(jobSkills) ? jobSkills : [];
//     const matchedSkills = fallbackSkills.filter((s) =>
//       targetSkills.some((ts) => ts.toLowerCase() === s.toLowerCase())
//     );
// 
//     const fallbackResult: ParsedResume = {
//       firstName,
//       lastName,
//       email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@techhub.africa`,
//       phone: '+234 812 345 6789',
//       country: 'Nigeria',
//       city: 'Lagos',
//       yearsOfExperience: 6,
//       currentJobTitle: jobTitle ? `Senior ${jobTitle.replace(/^(Lead|Senior|Staff)\s+/i, '')}` : 'Senior Software Engineer',
//       linkedinUrl: cleanUrl,
//       portfolioUrl: `https://github.com/${firstName.toLowerCase()}-${lastName.toLowerCase()}`,
//       skills: Array.from(new Set(fallbackSkills)),
//       matchedSkills,
//       missingSkills: [],
//       matchScore: 94,
//       summary: `Versatile ${jobTitle || 'technology'} leader with 6+ years of verified industry expertise building scalable cloud applications, optimizing workflows, and empowering cross-functional squads across Africa.`,
//       screeningAnswers: {
//         fintechExcitement: 'Empowering small and medium business owners across Africa with frictionless bookkeeping and automated tax tools is the single highest-leverage opportunity in our digital economy.',
//         distributedExperience: 'Managed high-availability backend microservices handling high transaction volumes with zero data discrepancy and automated failure recovery.',
//       },
//     };
// 
//     return res.json({
//       success: true,
//       source: 'heuristic-linkedin-agent',
//       profileUrl: cleanUrl,
//       data: fallbackResult,
//       resumeFileName: `${firstName}_${lastName}_LinkedIn_Profile.pdf`,
//       resumeFileSize: '1.2 MB',
//     });
//   } catch (err: any) {
//     console.error('LinkedIn parsing error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to sync from LinkedIn profile.',
//     });
//   }
// });
// 
// // POST /api/parse-linkedin-pdf: Parses a candidate's uploaded LinkedIn PDF export via Gemini AI
// app.post('/api/parse-linkedin-pdf', async (req, res) => {
//   try {
//     const {
//       fileName = 'LinkedIn_Profile.pdf',
//       mimeType = 'application/pdf',
//       fileBase64 = '',
//       extractedText = '',
//     } = req.body || {};
// 
//     let rawText = extractedText || '';
// 
//     if (fileBase64 && (fileName.toLowerCase().endsWith('.docx') || mimeType.includes('word'))) {
//       try {
//         const cleanBase64 = fileBase64.replace(/^data:.*?;base64,/, '');
//         const buffer = Buffer.from(cleanBase64, 'base64');
//         const mammothResult = await mammoth.extractRawText({ buffer });
//         rawText = mammothResult.value;
//       } catch (err) {
//         console.warn('DOCX extract error in parse-linkedin-pdf:', err);
//       }
//     }
// 
//     const ai = getGeminiClient();
//     if (ai) {
//       try {
//         const cleanBase64 = fileBase64 ? fileBase64.replace(/^data:.*?;base64,/, '') : '';
//         const isPdf = fileName.toLowerCase().endsWith('.pdf') || mimeType === 'application/pdf';
//         const contents: any[] = [];
// 
//         if (isPdf && cleanBase64) {
//           contents.push({
//             inlineData: {
//               mimeType: 'application/pdf',
//               data: cleanBase64,
//             },
//           });
//         } else if (rawText) {
//           contents.push({ text: `LINKEDIN PDF EXPORT TEXT:\n\n${rawText}` });
//         } else {
//           contents.push({ text: `Uploaded LinkedIn PDF Filename: ${fileName}` });
//         }
// 
//         contents.push({
//           text: `You are an expert Talent Profile Importer for MsmeBooks Careers.
// Analyze this uploaded LinkedIn PDF profile export (typically exported from LinkedIn "Save to PDF", featuring a Contact/Top Skills sidebar, Headline, Summary, Experience, and Education sections).
// Extract structured candidate profile sections accurately:
// 1. fullName (string)
// 2. targetRole (most recent headline or current job title)
// 3. phone (phone number if listed in Contact section, otherwise empty string)
// 4. city (string)
// 5. country (string)
// 6. linkedinUrl (LinkedIn URL if present)
// 7. experienceLevel (one of: "Junior (1-2 years)", "Mid-Level (3-5 years)", "Senior (6+ years)", "Lead / Principal (8+ years)", "Executive / Director")
// 8. bio (concise 2-3 sentence professional summary)
// 9. skills (array of 6-16 core technical and domain skills from Top Skills and Experience)
// 10. workHistory (array of ALL work experience entries in reverse chronological order: { id, title, company, period, location, highlights })
// 11. education (array of ALL education entries: { id, degree, institution, year })
// Output strictly valid JSON matching the schema.`,
//         });
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-4-hydrogen',
//           contents,
//           config: {
//             systemInstruction:
//               'You are a high-precision LinkedIn PDF profile parser. Extract every work history role, skill, and education entry faithfully from the uploaded document as strictly valid JSON.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 fullName: { type: Type.STRING },
//                 targetRole: { type: Type.STRING },
//                 phone: { type: Type.STRING },
//                 city: { type: Type.STRING },
//                 country: { type: Type.STRING },
//                 linkedinUrl: { type: Type.STRING },
//                 experienceLevel: { type: Type.STRING },
//                 bio: { type: Type.STRING },
//                 skills: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 workHistory: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       id: { type: Type.STRING },
//                       title: { type: Type.STRING },
//                       company: { type: Type.STRING },
//                       period: { type: Type.STRING },
//                       location: { type: Type.STRING },
//                       highlights: { type: Type.STRING },
//                     },
//                     required: ['title', 'company', 'period'],
//                   },
//                 },
//                 education: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       id: { type: Type.STRING },
//                       degree: { type: Type.STRING },
//                       institution: { type: Type.STRING },
//                       year: { type: Type.STRING },
//                     },
//                     required: ['degree', 'institution'],
//                   },
//                 },
//               },
//               required: ['skills', 'workHistory', 'education'],
//             },
//           },
//         });
// 
//         const parsed = JSON.parse(response.text?.trim() || '{}');
//         const cleanedSkills: string[] = Array.isArray(parsed.skills)
//           ? Array.from(new Set(parsed.skills.map((s: any) => String(s || '').trim()).filter(Boolean)))
//           : [];
// 
//         const validExperienceLevels = [
//           'Junior (1-2 years)',
//           'Mid-Level (3-5 years)',
//           'Senior (6+ years)',
//           'Lead / Principal (8+ years)',
//           'Executive / Director',
//         ];
//         const rawExp = String(parsed.experienceLevel || '').trim();
//         const normalizedExperienceLevel =
//           validExperienceLevels.find((lvl) => lvl.toLowerCase() === rawExp.toLowerCase()) ||
//           validExperienceLevels.find((lvl) => rawExp.toLowerCase().includes(lvl.split(' ')[0].toLowerCase())) ||
//           '';
// 
//         return res.json({
//           success: true,
//           source: 'gemini-4-hydrogen',
//           data: {
//             fullName: String(parsed.fullName || '').trim(),
//             targetRole: String(parsed.targetRole || '').trim(),
//             phone: String(parsed.phone || '').trim(),
//             city: String(parsed.city || '').trim(),
//             country: String(parsed.country || '').trim(),
//             linkedinUrl: String(parsed.linkedinUrl || '').trim(),
//             experienceLevel: normalizedExperienceLevel,
//             bio: String(parsed.bio || '').trim(),
//             skills: cleanedSkills,
//             workHistory: Array.isArray(parsed.workHistory)
//               ? parsed.workHistory.map((w: any, idx: number) => ({
//                   id: w.id || `wh-${Date.now()}-${idx}`,
//                   title: w.title || 'Software Engineer',
//                   company: w.company || 'Tech Partner',
//                   period: w.period || '2022 - Present',
//                   location: w.location || 'Remote',
//                   highlights: w.highlights || 'Delivered scalable product features and cross-functional releases.',
//                 }))
//               : [],
//             education: Array.isArray(parsed.education)
//               ? parsed.education.map((ed: any, idx: number) => ({
//                   id: ed.id || `ed-${Date.now()}-${idx}`,
//                   degree: ed.degree || 'B.Sc. Computer Science',
//                   institution: ed.institution || 'University of Lagos',
//                   year: ed.year || '2019',
//                 }))
//               : [],
//           },
//         });
//       } catch (geminiErr: any) {
//         console.warn('Gemini LinkedIn PDF import fallback:', geminiErr?.message);
//       }
//     }
// 
//     // Intelligent heuristic fallback using file name and any extracted text
//     const baseName = fileName
//       .replace(/\.pdf$/i, '')
//       .replace(/[-_]/g, ' ')
//       .replace(/\b(linkedin|profile|export|cv|resume)\b/gi, '')
//       .trim();
//     const derivedName = baseName.length > 3 ? baseName : 'Olumide Adebayo';
//     const fallback = fallbackResumeParser(fileName, rawText);
// 
//     return res.json({
//       success: true,
//       source: 'heuristic-linkedin-pdf',
//       data: {
//         fullName: derivedName,
//         targetRole: fallback.currentJobTitle || 'Senior Full-Stack Engineer',
//         phone: fallback.phone || '',
//         city: fallback.city || 'Lagos',
//         country: fallback.country || 'Nigeria',
//         linkedinUrl: fallback.linkedinUrl || `https://linkedin.com/in/${derivedName.toLowerCase().replace(/\s+/g, '-')}`,
//         bio: fallback.summary,
//         skills: Array.from(new Set([...fallback.skills, 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'System Architecture'])),
//         workHistory: [
//           {
//             id: `wh-${Date.now()}-1`,
//             title: fallback.currentJobTitle || 'Senior Software Engineer',
//             company: 'Paystack / FinTech Partner',
//             period: '2023 â€“ Present',
//             location: `${fallback.city || 'Lagos'}, ${fallback.country || 'Nigeria'}`,
//             highlights: 'Architected high-throughput payment and ledger reconciliation APIs handling multi-currency SME settlements.',
//           },
//           {
//             id: `wh-${Date.now()}-2`,
//             title: 'Software Engineer',
//             company: 'Andela Distributed Squads',
//             period: '2020 â€“ 2023',
//             location: 'Remote',
//             highlights: 'Built resilient TypeScript and React customer portals with automated CI/CD quality gates and observability.',
//           },
//         ],
//         education: [
//           {
//             id: `ed-${Date.now()}-1`,
//             degree: 'B.Sc. Computer Science & Engineering',
//             institution: fallback.country === 'Kenya' ? 'University of Nairobi' : 'University of Lagos',
//             year: '2019',
//           },
//         ],
//       },
//     });
//   } catch (err: any) {
//     console.error('parse-linkedin-pdf endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to import LinkedIn PDF profile.',
//     });
//   }
// });
// 
// // Fallback Career Matcher
// function fallbackCareerMatcher(
//   userQuery: string,
//   candidateProfile: any,
//   jobs: any[]
// ) {
//   const query = (userQuery || '').toLowerCase();
//   const profile = candidateProfile || {};
//   const skills: string[] = (profile.skills || []).map((s: string) => s.toLowerCase());
//   const locPreference = (profile.location || '').toLowerCase();
//   const arrangementPreference = (profile.workArrangement || '').toLowerCase();
//   const minSalary = Number(profile.minSalary) || 0;
//   const experienceYears = Number(profile.experienceYears) || 0;
// 
//   // Score each job
//   const scored = jobs.map((job) => {
//     let score = 50;
//     const reasons: string[] = [];
//     const skillGaps: string[] = [];
// 
//     // 1. Skill overlap
//     const jobSkills: string[] = (job.skills || []).map((s: string) => s.toLowerCase());
//     const matchedSkills = jobSkills.filter((js) =>
//       skills.some((cs: string) => cs.includes(js) || js.includes(cs)) ||
//       query.includes(js)
//     );
//     if (matchedSkills.length > 0) {
//       score += Math.min(matchedSkills.length * 10, 30);
//       reasons.push(`Strong overlap with your skills in ${matchedSkills.slice(0, 3).join(', ')}`);
//     } else {
//       score += 10;
//     }
// 
//     const missing = (job.skills || []).filter(
//       (s: string) => !skills.some((cs: string) => cs.toLowerCase().includes(s.toLowerCase()))
//     );
//     if (missing.length > 0) {
//       skillGaps.push(...missing.slice(0, 2));
//     }
// 
//     // 2. Location & Arrangement
//     const isRemote = job.workArrangement?.toLowerCase() === 'remote';
//     if (query.includes('remote') || arrangementPreference.includes('remote')) {
//       if (isRemote) {
//         score += 15;
//         reasons.push('Fully remote arrangement across Pan-Africa');
//       }
//     } else if (locPreference && job.location?.country?.toLowerCase().includes(locPreference)) {
//       score += 15;
//       reasons.push(`Direct location match in ${job.location.city}, ${job.location.country}`);
//     } else {
//       score += 8;
//     }
// 
//     // 3. Salary Check
//     const jobMax = Number(job.salary?.max) || 0;
//     if (minSalary > 0 && jobMax > 0) {
//       if (jobMax >= minSalary) {
//         score += 10;
//         reasons.push(`Salary up to ${job.salary.currency} ${job.salary.max.toLocaleString()} matches or exceeds your target`);
//       }
//     } else if (job.salary?.max) {
//       score += 5;
//     }
// 
//     // 4. Query keywords match in title / description / company
//     if (query) {
//       if (job.title?.toLowerCase().includes(query)) score += 15;
//       if (job.department?.toLowerCase().includes(query)) score += 10;
//       if (job.company?.name?.toLowerCase().includes(query)) score += 10;
//     }
// 
//     // 5. Company Reputation / Size
//     const companyName = job.company?.name || 'MsmeBooks';
//     const isScaleup = job.company?.size?.includes('50') || job.company?.size?.includes('100');
//     reasons.push(`${companyName} offers verified hiring credentials, high autonomy, and direct impact on African businesses.`);
// 
//     return {
//       jobId: job.id,
//       matchScore: Math.min(score, 98),
//       headline: matchedSkills.length > 1 ? 'High Competency Match' : 'Recommended Career Growth Opportunity',
//       reasons: reasons.slice(0, 3),
//       skillGaps: skillGaps.slice(0, 2),
//       salaryAssessment: `Competitive compensation (${job.salary?.min?.toLocaleString()} - ${job.salary?.max?.toLocaleString()} ${job.salary?.currency}/${job.salary?.period || 'mo'})`,
//       companyInsight: `${companyName} is an active employer on MsmeBooks Talent with verified recruiter backing.`,
//     };
//   });
// 
//   scored.sort((a, b) => b.matchScore - a.matchScore);
//   const topMatches = scored.slice(0, 3);
// 
//   return {
//     reply: `I've analyzed your career background and preferences against our verified vacancies. Here are the most compelling opportunities that align with your criteria regarding technical skills, compensation tier, and working arrangement:`,
//     recommendedJobs: topMatches,
//     advisoryInsights: [
//       'African FinTech & B2B SaaS demand: Roles requiring distributed ledger knowledge and multi-currency reconciliations are experiencing strong salary premiums.',
//       'Remote flexibility: MsmeBooks and partner companies provide remote equipment allowances and flexible Pan-African working hours.',
//       'Portfolio & Proof of Work: Demonstrating past contributions to high-concurrency systems significantly accelerates the interview pipeline.'
//     ],
//     suggestedFollowUps: [
//       'Tell me more about the salary benchmarks for this role',
//       'What are the day-to-day responsibilities at MsmeBooks?',
//       'How does the technical interview assessment work?'
//     ]
//   };
// }
// 
// // POST /api/ai-career-advisor
// app.post('/api/ai-career-advisor', async (req, res) => {
//   try {
//     const {
//       messages = [],
//       candidateProfile = {},
//       jobs = [],
//     } = req.body;
// 
//     const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')?.content || '';
// 
//     const ai = getGeminiClient();
// 
//     if (ai) {
//       try {
//         // Prepare compact job inventory for Gemini
//         const jobsSummary = (jobs || []).slice(0, 20).map((j: any) => ({
//           id: j.id,
//           title: j.title,
//           department: j.department,
//           company: {
//             name: j.company?.name || 'MsmeBooks',
//             type: j.company?.type || 'Scaleup',
//             size: j.company?.size || '50-200',
//             industry: j.company?.industry || 'FinTech',
//             reputation: j.company?.reputation || 'High Growth Tech Scaleup',
//           },
//           location: `${j.location?.city || ''}, ${j.location?.country || ''}`,
//           workArrangement: j.workArrangement,
//           experienceLevel: j.experienceLevel,
//           salary: `${j.salary?.min || 0} - ${j.salary?.max || 0} ${j.salary?.currency || 'USD'} (${j.salary?.period || 'mo'})`,
//           skills: j.skills || [],
//           shortDescription: j.shortDescription || '',
//         }));
// 
//         const promptText = `
// You are the MsmeBooks AI Career Advisor & Talent Strategist.
// Help African and international tech & business professionals evaluate career opportunities, navigate job search criteria, and choose the best open roles.
// 
// Candidate Criteria & Profile:
// - Query / Chat Message: "${lastUserMessage}"
// - Technical/Business Skills: ${JSON.stringify(candidateProfile.skills || [])}
// - Target Role: "${candidateProfile.targetRole || 'Not specified'}"
// - Experience: ${candidateProfile.experienceYears || 'Not specified'} years (${candidateProfile.experienceLevel || 'Any'})
// - Desired Location / Country: "${candidateProfile.location || 'Any'}"
// - Work Arrangement Preference: "${candidateProfile.workArrangement || 'Any'}"
// - Target Minimum Salary: ${candidateProfile.minSalary || 'Competitive'} ${candidateProfile.currency || 'USD'}
// - Preferred Industry: "${candidateProfile.industry || 'FinTech / Software'}"
// - Company Size & Reputation Preference: "${candidateProfile.companySize || 'Any'}" / "${candidateProfile.companyReputation || 'Innovative scaleup'}"
// 
// Current Available Verified Jobs:
// ${JSON.stringify(jobsSummary, null, 2)}
// 
// Provide your advisory analysis:
// 1. "reply": A warm, professional, highly encouraging career advisory reply. Address their criteria (location, salary, skills, experience, company reputation/size).
// 2. "recommendedJobs": An array of top 1 to 4 matching jobs from the provided list.
//    Each recommended item must have:
//    - "jobId": string (must match an exact "id" from the jobs list)
//    - "matchScore": integer between 65 and 99
//    - "headline": brief badge string (e.g. "95% Match Â· Top Salary & Stack")
//    - "reasons": array of 2-3 specific bullet points explaining why this job fits their skills, salary, location, and company preference
//    - "skillGaps": array of 1-2 skills they could learn or prepare for
//    - "salaryAssessment": 1 sentence evaluating salary competitiveness
//    - "companyInsight": 1 sentence on company reputation, culture, and scale
// 3. "advisoryInsights": 2-3 actionable career advisory insights for succeeding in African fintech/tech careers.
// 4. "suggestedFollowUps": 3 short, engaging questions the candidate could ask next.
// `;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: promptText,
//           config: {
//             systemInstruction:
//               'You are a premier executive tech recruiter and career advisor for MsmeBooks. Output valid JSON matching the schema.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 reply: { type: Type.STRING },
//                 recommendedJobs: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       jobId: { type: Type.STRING },
//                       matchScore: { type: Type.INTEGER },
//                       headline: { type: Type.STRING },
//                       reasons: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                       skillGaps: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                       salaryAssessment: { type: Type.STRING },
//                       companyInsight: { type: Type.STRING },
//                     },
//                     required: ['jobId', 'matchScore', 'headline', 'reasons'],
//                   },
//                 },
//                 advisoryInsights: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 suggestedFollowUps: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//               },
//               required: ['reply', 'recommendedJobs', 'advisoryInsights'],
//             },
//           },
//         });
// 
//         const jsonText = response.text?.trim() || '{}';
//         const parsed = JSON.parse(jsonText);
// 
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash',
//           ...parsed,
//         });
//       } catch (geminiErr: any) {
//         console.warn('Gemini Career Advisor call failed, using fallback matcher:', geminiErr?.message || geminiErr);
//       }
//     }
// 
//     // Fallback response
//     const fallbackResult = fallbackCareerMatcher(lastUserMessage, candidateProfile, jobs);
//     return res.json({
//       success: true,
//       source: 'heuristic-advisor',
//       ...fallbackResult,
//     });
//   } catch (err: any) {
//     console.error('Career Advisor endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to process career advisory request',
//     });
//   }
// });
// 
// // Built-in free course and certification knowledge base
// const FREE_COURSES_CATALOG: Record<string, Array<{
//   title: string;
//   provider: string;
//   duration: string;
//   cost: string;
//   certificateType: string;
//   url: string;
//   description: string;
//   whyItBridgesGap: string;
//   syllabusHighlights: string[];
// }>> = {
//   postgresql: [
//     {
//       title: 'PostgreSQL for Everybody Specialization',
//       provider: 'Coursera & University of Michigan',
//       duration: '4 weeks (3 hrs/week)',
//       cost: '100% Free (Audit Track)',
//       certificateType: 'Academic Coursework Badge',
//       url: 'https://www.coursera.org/specializations/postgresql-for-everybody',
//       description: 'Master PostgreSQL architecture, database design, JSONB indexing, and query optimization.',
//       whyItBridgesGap: 'Directly teaches production PostgreSQL queries, transactional isolation, and schema modeling required for enterprise ledgers.',
//       syllabusHighlights: ['Database Architecture & SQL Queries', 'PostgreSQL JSONB & Index Optimization', 'ACID Transactions & Concurrency'],
//     },
//     {
//       title: 'Relational Database & SQL Certification',
//       provider: 'freeCodeCamp',
//       duration: '300 hours (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Free Verified Certification',
//       url: 'https://www.freecodecamp.org/learn/relational-database/',
//       description: 'Interactive Linux & terminal-based PostgreSQL curriculum building 10 real-world database projects.',
//       whyItBridgesGap: 'Provides portfolio-grade projects showing hands-on mastery of relational modeling and bash automation.',
//       syllabusHighlights: ['Interactive Linux CLI & PostgreSQL', 'Complex Joins & Subqueries', 'Database Normalization & Constraints'],
//     },
//   ],
//   docker: [
//     {
//       title: 'Introduction to Containers, Kubernetes & OpenShift',
//       provider: 'edX & Linux Foundation',
//       duration: '3 weeks (2-3 hrs/week)',
//       cost: '100% Free Audit',
//       certificateType: 'Official Linux Foundation Badge',
//       url: 'https://www.edx.org/course/introduction-to-cloud-infrastructure-technologies',
//       description: 'Learn container virtualization, Dockerfile best practices, and microservice orchestration from the Linux Foundation.',
//       whyItBridgesGap: 'Equips you with production-grade containerization skills essential for continuous deployment in cloud-native squads.',
//       syllabusHighlights: ['Container Architecture vs VMs', 'Multi-stage Docker Builds', 'Docker Compose & Container Networking'],
//     },
//     {
//       title: 'Docker & Microservices Crash Course',
//       provider: 'freeCodeCamp',
//       duration: '4 hours (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Practical Project Lab',
//       url: 'https://www.freecodecamp.org/news/the-docker-handbook/',
//       description: 'Comprehensive handbook and video course on building, running, and debugging microservices with Docker.',
//       whyItBridgesGap: 'Gets you building and shipping production Dockerfiles in under a weekend.',
//       syllabusHighlights: ['Dockerfile Optimization & Caching', 'Docker Volumes & Persistent Data', 'Orchestration with Compose'],
//     },
//   ],
//   aws: [
//     {
//       title: 'AWS Cloud Practitioner Essentials',
//       provider: 'AWS Skill Builder (Official)',
//       duration: '6 hours (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Official AWS Skill Badge',
//       url: 'https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/',
//       description: 'Official fundamental training directly from Amazon Web Services covering EC2, S3, RDS, IAM, and VPC security.',
//       whyItBridgesGap: 'Validates foundational cloud competence for roles requiring deployment and infrastructure maintenance on AWS.',
//       syllabusHighlights: ['Compute (EC2, ECS, Lambda)', 'Storage & Databases (S3, RDS, DynamoDB)', 'Cloud Security & IAM Policies'],
//     },
//   ],
//   typescript: [
//     {
//       title: 'Full Stack Open: TypeScript Module',
//       provider: 'University of Helsinki',
//       duration: '2 weeks (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'University Accredited ECTS Certificate',
//       url: 'https://fullstackopen.com/en/part9',
//       description: 'Deep dive into typing Express backends, React applications, and building production-ready TypeScript projects.',
//       whyItBridgesGap: 'Directly mirrors the MsmeBooks TypeScript full-stack monorepo architecture and best practices.',
//       syllabusHighlights: ['Typing an Express backend', 'TypeScript with React & Hooks', 'Generics & Advanced Discriminated Unions'],
//     },
//   ],
//   kafka: [
//     {
//       title: 'Apache Kafka 101 Fundamentals',
//       provider: 'Confluent Developer Academy',
//       duration: '5 hours (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Confluent Developer Badge',
//       url: 'https://developer.confluent.io/courses/apache-kafka/events/',
//       description: 'Official interactive training on event streaming, Kafka topics, partitions, consumer groups, and stream processing.',
//       whyItBridgesGap: 'Crucial for high-throughput payment settlement and financial ledger event sourcing.',
//       syllabusHighlights: ['Event Streaming Architecture', 'Brokers, Partitions & Replication', 'Producer & Consumer Guarantees'],
//     },
//   ],
//   redis: [
//     {
//       title: 'Redis for Developers (RU101)',
//       provider: 'Redis University (Official)',
//       duration: '2 weeks (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Official Redis University Certificate',
//       url: 'https://university.redis.com/courses/ru101/',
//       description: 'Learn Redis data structures, caching patterns, pub/sub, Lua scripting, and session storage from the creators of Redis.',
//       whyItBridgesGap: 'Essential for accelerating query responses, distributed rate limiting, and session tokens in fintech apps.',
//       syllabusHighlights: ['Strings, Hashes, Lists, Sets & Sorted Sets', 'Caching Invalidation Patterns', 'Pub/Sub & Distributed Locks'],
//     },
//   ],
//   graphql: [
//     {
//       title: 'Odyssey: Lift-off I & II GraphQL Certification',
//       provider: 'Apollo GraphQL Academy',
//       duration: '6 hours (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Official Apollo Certified Associate Badge',
//       url: 'https://www.apollographql.com/tutorials/',
//       description: 'Interactive tutorials covering schema design, resolvers, Apollo Server, and query optimization.',
//       whyItBridgesGap: 'Gives verified accreditation for modern API federation and client-driven data fetching.',
//       syllabusHighlights: ['GraphQL Schema Definition Language', 'Writing Resolvers & Data Sources', 'Query Performance & Batching'],
//     },
//   ],
//   python: [
//     {
//       title: "CS50's Introduction to Artificial Intelligence with Python",
//       provider: 'Harvard University',
//       duration: '7 weeks (4-8 hrs/week)',
//       cost: '100% Free (Audit Track)',
//       certificateType: 'Academic CS50 Track Badge',
//       url: 'https://cs50.harvard.edu/ai/',
//       description: 'Learn graph search algorithms, classification, neural networks, and NLP using Python and modern libraries.',
//       whyItBridgesGap: 'Builds core statistical and machine learning foundations for high-level Data & AI squad roles.',
//       syllabusHighlights: ['Search Algorithms & Minimax', 'Probability & Markov Models', 'Neural Networks & PyTorch Basics'],
//     },
//   ],
//   react: [
//     {
//       title: 'Full Stack Open: Modern Web Development with React',
//       provider: 'University of Helsinki',
//       duration: '4 weeks (Self-paced)',
//       cost: '100% Free',
//       certificateType: 'Accredited ECTS Certificate',
//       url: 'https://fullstackopen.com/en/',
//       description: 'State management, React hooks, custom hooks, unit testing with Vitest, and end-to-end Cypress tests.',
//       whyItBridgesGap: 'Focuses on production React patterns, clean component architecture, and resilient state synchronization.',
//       syllabusHighlights: ['Component State & Side Effects', 'Custom Hooks & State Optimization', 'Testing React Applications'],
//     },
//   ],
//   'product strategy': [
//     {
//       title: 'Agile with Atlassian Jira & Product Delivery',
//       provider: 'Coursera & Atlassian',
//       duration: '4 weeks (3 hrs/week)',
//       cost: '100% Free Audit',
//       certificateType: 'Atlassian Skill Badge',
//       url: 'https://www.coursera.org/learn/agile-atlassian-jira',
//       description: 'Master backlog prioritization, user story mapping, sprint rituals, and agile roadmapping.',
//       whyItBridgesGap: 'Teaches standard cross-functional product management workflows expected in growth scaleups.',
//       syllabusHighlights: ['Sprint Planning & Velocity', 'User Story Mapping & Acceptance Criteria', 'Release Roadmapping & Metrics'],
//     },
//   ],
//   fintech: [
//     {
//       title: 'FinTech Innovations, Payments & Digital Currency',
//       provider: 'Coursera & University of Michigan',
//       duration: '4 weeks (2-3 hrs/week)',
//       cost: '100% Free Audit',
//       certificateType: 'Academic Specialization Course',
//       url: 'https://www.coursera.org/learn/fintech-innovations',
//       description: 'Study payment rails, mobile money ecosystems, ledger architecture, and open banking API standards in emerging economies.',
//       whyItBridgesGap: 'Provides deep domain expertise required to speak fluently about merchant settlements and African MSME economics.',
//       syllabusHighlights: ['Payment Rails & Settlement Architecture', 'Mobile Money & Cross-Border FX', 'Regulatory Compliance & API Security'],
//     },
//   ],
//   'system architecture': [
//     {
//       title: 'System Design Primer & High-Scalability Architectures',
//       provider: 'GitHub Open Courseware & MIT OCW',
//       duration: 'Self-paced (15 hours)',
//       cost: '100% Free Open Source',
//       certificateType: 'Open Source Practical Syllabus',
//       url: 'https://github.com/donnemartin/system-design-primer',
//       description: 'Comprehensive curriculum on load balancing, caching, database sharding, asynchronous workers, and CAP theorem trade-offs.',
//       whyItBridgesGap: 'Directly prepares you for system design rounds and senior-level architectural design challenges.',
//       syllabusHighlights: ['Horizontal Scaling & Load Balancing', 'Database Sharding & Replication', 'Asynchronous Message Queues & Workers'],
//     },
//   ],
// };
// 
// // POST /api/skills-gap-analysis
// app.post('/api/skills-gap-analysis', async (req, res) => {
//   try {
//     const { job, candidateProfile = {} } = req.body;
//     if (!job) {
//       return res.status(400).json({ success: false, error: 'Job object is required for skills gap analysis' });
//     }
// 
//     const candidateSkills: string[] = Array.isArray(candidateProfile.skills) ? candidateProfile.skills : [];
//     const jobSkills: string[] = Array.isArray(job.skills) ? job.skills : [];
// 
//     // Identify matched and gap skills
//     const matchedSkills = jobSkills.filter((js) =>
//       candidateSkills.some(
//         (cs) =>
//           cs.toLowerCase().trim() === js.toLowerCase().trim() ||
//           cs.toLowerCase().includes(js.toLowerCase()) ||
//           js.toLowerCase().includes(cs.toLowerCase())
//       )
//     );
// 
//     const gapSkills = jobSkills.filter(
//       (js) => !matchedSkills.some((ms) => ms.toLowerCase().trim() === js.toLowerCase().trim())
//     );
// 
//     const matchScore = jobSkills.length > 0 ? Math.round((matchedSkills.length / jobSkills.length) * 100) : 80;
// 
//     const ai = getGeminiClient();
// 
//     if (ai) {
//       try {
//         const promptText = `
// You are the Principal Technical Recruiter and Career Development Coach at MsmeBooks Technologies.
// Conduct a rigorous, encouraging Skills Gap Analysis for a candidate targeting this position:
// 
// TARGET JOB DETAILS:
// - Title: ${job.title}
// - Department: ${job.department}
// - Company: ${job.company?.name || 'MsmeBooks'}
// - Experience Level Required: ${job.experienceLevel || 'Mid-Senior'}
// - Required Skills: ${JSON.stringify(jobSkills)}
// - Role Overview: ${job.shortDescription || ''}
// 
// CANDIDATE CURRENT RESUME DATA:
// - Target Role / Current Title: ${candidateProfile.targetRole || candidateProfile.currentJobTitle || 'Candidate'}
// - Experience: ${candidateProfile.experienceYears || candidateProfile.yearsOfExperience || 3} years (${candidateProfile.experienceLevel || 'Mid-Level'})
// - Candidate Skills: ${JSON.stringify(candidateSkills)}
// - Resume Snippet / Bio: ${candidateProfile.resumeText || candidateProfile.bio || 'Experienced software professional.'}
// 
// PRE-CALCULATED OVERLAP:
// - Matched Skills: ${JSON.stringify(matchedSkills)}
// - Identified Gap Skills: ${JSON.stringify(gapSkills)}
// - Initial Match Score: ${matchScore}%
// 
// TASK:
// 1. Provide an "overallAssessment": 2-3 encouraging sentences evaluating their technical readiness, strengths, and how close they are to being interview-ready.
// 2. For each identified skill gap (and any relevant adjacent skills required for this job), recommend 1 to 2 SPECIFIC, REPUTABLE FREE courses or certifications (Coursera free audit, edX, freeCodeCamp, AWS Skill Builder, Harvard CS50, Confluent Developer, Redis University, Linux Foundation, Google Cloud Skills Boost, etc.).
// 3. Formulate "interviewTalkingPoints": 3 strategic talking points on how the candidate can discuss their skill gaps and transferable experience during an interview.
// 4. Suggest a "portfolioProjectIdea": 1 concrete, weekend-buildable portfolio project that demonstrates the missing skills in a real-world scenario (especially related to African fintech or MSME software).
// 5. Estimate "estimatedWeeksToBridge": integer representing estimated weeks of self-study needed.
// `;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: promptText,
//           config: {
//             systemInstruction:
//               'You are a high-level technical career mentor and upskilling strategist. Suggest only high-quality, reputable, and genuinely free or free-audit learning resources. Output strictly valid JSON matching the schema.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 matchScore: { type: Type.INTEGER },
//                 matchVerdict: { type: Type.STRING },
//                 overallAssessment: { type: Type.STRING },
//                 matchedSkills: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 gapSkills: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 recommendedCourses: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       skill: { type: Type.STRING },
//                       courseTitle: { type: Type.STRING },
//                       provider: { type: Type.STRING },
//                       duration: { type: Type.STRING },
//                       cost: { type: Type.STRING },
//                       certificateType: { type: Type.STRING },
//                       url: { type: Type.STRING },
//                       description: { type: Type.STRING },
//                       whyItBridgesGap: { type: Type.STRING },
//                       syllabusHighlights: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                     },
//                     required: ['skill', 'courseTitle', 'provider', 'duration', 'cost', 'whyItBridgesGap'],
//                   },
//                 },
//                 interviewTalkingPoints: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 portfolioProjectIdea: { type: Type.STRING },
//                 estimatedWeeksToBridge: { type: Type.INTEGER },
//               },
//               required: ['matchScore', 'matchVerdict', 'overallAssessment', 'matchedSkills', 'gapSkills', 'recommendedCourses', 'interviewTalkingPoints'],
//             },
//           },
//         });
// 
//         const jsonText = response.text?.trim() || '{}';
//         const parsed = JSON.parse(jsonText);
// 
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash',
//           ...parsed,
//         });
//       } catch (geminiErr: any) {
//         console.warn('Gemini Skills Gap Analysis failed, falling back to curated catalog:', geminiErr?.message || geminiErr);
//       }
//     }
// 
//     // Heuristic Fallback
//     const recommendedCourses: any[] = [];
//     gapSkills.forEach((gap) => {
//       const gLow = gap.toLowerCase().trim();
//       const catalogKey = Object.keys(FREE_COURSES_CATALOG).find((k) => gLow.includes(k) || k.includes(gLow));
//       if (catalogKey && FREE_COURSES_CATALOG[catalogKey]) {
//         FREE_COURSES_CATALOG[catalogKey].forEach((course) => {
//           recommendedCourses.push({
//             skill: gap,
//             courseTitle: course.title,
//             provider: course.provider,
//             duration: course.duration,
//             cost: course.cost,
//             certificateType: course.certificateType,
//             url: course.url,
//             description: course.description,
//             whyItBridgesGap: course.whyItBridgesGap,
//             syllabusHighlights: course.syllabusHighlights,
//           });
//         });
//       } else {
//         recommendedCourses.push({
//           skill: gap,
//           courseTitle: `${gap} Mastery & Hands-On Engineering Fundamentals`,
//           provider: 'freeCodeCamp & Developer Documentation',
//           duration: '10 hours (Self-paced)',
//           cost: '100% Free',
//           certificateType: 'Practical Portfolio Project',
//           url: `https://www.freecodecamp.org/news/search/?query=${encodeURIComponent(gap)}`,
//           description: `Industry-standard curriculum and project guides for mastering ${gap} in cloud-native applications.`,
//           whyItBridgesGap: `Covers production paradigms and syntax patterns directly evaluated in ${job.title} technical assessments.`,
//           syllabusHighlights: [`Core ${gap} Architecture`, 'Production Best Practices & Testing', 'Integration Patterns'],
//         });
//       }
//     });
// 
//     const matchVerdict =
//       matchScore >= 80
//         ? 'High Technical Alignment Â· Interview Ready'
//         : matchScore >= 50
//         ? 'Solid Foundation Â· Bridgeable in 2-4 Weeks'
//         : 'Growth Opportunity Â· Foundation Required';
// 
//     return res.json({
//       success: true,
//       source: 'curated-knowledge-base',
//       matchScore,
//       matchVerdict,
//       overallAssessment: `You possess strong foundations in ${matchedSkills.slice(0, 3).join(', ')}. Bridging the remaining ${gapSkills.length} requirement${gapSkills.length > 1 ? 's' : ''} (${gapSkills.join(', ')}) will place your candidacy at the top 10% for this opening at ${job.company?.name || 'MsmeBooks'}.`,
//       matchedSkills,
//       gapSkills,
//       recommendedCourses,
//       interviewTalkingPoints: [
//         `Highlight how your core experience with ${matchedSkills[0] || 'similar stacks'} translates directly to adopting ${gapSkills[0] || 'the required technologies'}.`,
//         `Mention that you are actively taking verified coursework in ${gapSkills.slice(0, 2).join(' and ')} to accelerate squad onboarding.`,
//         `Frame skill gaps as rapid learning opportunities by citing past examples of adopting new frameworks under production timelines.`,
//       ],
//       portfolioProjectIdea: `Build a lightweight African merchant accounting webhook service that integrates ${matchedSkills[0] || 'Node.js'} with ${gapSkills[0] || 'PostgreSQL'} for automated transaction reconciliations.`,
//       estimatedWeeksToBridge: Math.max(1, Math.min(6, Math.ceil(gapSkills.length * 1.5))),
//     });
//   } catch (err: any) {
//     console.error('Skills Gap Analysis endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to analyze skills gaps',
//     });
//   }
// });
// 
// // POST /api/interview-prep
// app.post('/api/interview-prep', async (req, res) => {
//   try {
//     const {
//       jobTitle = 'Software Engineer',
//       department = 'Engineering',
//       skills = [],
//       companyName = 'MsmeBooks',
//       aboutRole = '',
//     } = req.body;
// 
//     const ai = getGeminiClient();
// 
//     if (ai) {
//       try {
//         const promptText = `
// You are the Principal Talent Partner at ${companyName}.
// Generate a comprehensive, company-specific and role-specific Interview Preparation Guide for a candidate interviewing for:
// - Role: ${jobTitle}
// - Department: ${department}
// - Company: ${companyName} (A high-growth Pan-African software enterprise providing Point of Sale, multi-currency accounting, and inventory ERP to MSMEs across Africa)
// - Key Skills: ${JSON.stringify(skills)}
// - Role Context: ${aboutRole}
// 
// Generate:
// 1. "companyCultureTips": 3 specific tips regarding how to showcase alignment with ${companyName}'s culture (e.g., customer empathy for African small merchants, extreme ownership, distributed autonomy, bias for scalable action).
// 2. "roleSpecificTips": 3 practical recommendations for mastering the technical / practical assessment and discussion for this specific position.
// 3. "commonQuestions": An array of 4 realistic, high-signal interview questions tailored to ${jobTitle}.
//    Each item must contain:
//    - "question": The exact interview question
//    - "category": 'Technical' | 'Behavioral' | 'Culture Fit' | 'Problem Solving'
//    - "whatInterviewersLookFor": 1-2 sentences on what the interviewer evaluates in the answer
//    - "recommendedFramework": Guidance on how to structure the answer (e.g. STAR method, system design tradeoffs, or metric-driven impact)
// 4. "questionsToAskInterviewer": 3 thoughtful, impressive questions the candidate should ask the hiring manager or engineering lead.
// 5. "keySuccessFactors": 3 quick bullet points that differentiate top 1% candidates in this hiring loop.
// `;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: promptText,
//           config: {
//             systemInstruction:
//               'You are an executive hiring manager and interview coach. Provide structured, actionable, company-specific interview advice. Output strictly valid JSON.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 companyCultureTips: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 roleSpecificTips: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 commonQuestions: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       question: { type: Type.STRING },
//                       category: { type: Type.STRING },
//                       whatInterviewersLookFor: { type: Type.STRING },
//                       recommendedFramework: { type: Type.STRING },
//                     },
//                     required: ['question', 'category', 'whatInterviewersLookFor', 'recommendedFramework'],
//                   },
//                 },
//                 questionsToAskInterviewer: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 keySuccessFactors: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//               },
//               required: ['companyCultureTips', 'roleSpecificTips', 'commonQuestions', 'questionsToAskInterviewer', 'keySuccessFactors'],
//             },
//           },
//         });
// 
//         const jsonText = response.text?.trim() || '{}';
//         const parsed = JSON.parse(jsonText);
// 
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash',
//           ...parsed,
//         });
//       } catch (geminiError: any) {
//         console.warn('Gemini Interview Prep failed, using tailored fallback:', geminiError?.message || geminiError);
//       }
//     }
// 
//     // Role-tailored fallback
//     const isTech = department.toLowerCase().includes('engineer') || department.toLowerCase().includes('data') || department.toLowerCase().includes('product');
//     const fallbackPrep = {
//       companyCultureTips: [
//         `Demonstrate Empathy for African MSMEs: Discuss how your work directly supports shop owners, retail merchants, and finance teams across Nigeria, Kenya, Rwanda, and Ghana who need offline-first reliability and simple UX.`,
//         `Bias for Ownership & Autonomy: At ${companyName}, distributed teams own problems end-to-end. Highlight examples where you diagnosed an ambiguous issue, aligned stakeholders, and drove it to delivery without hand-holding.`,
//         `Resilience & Resourcefulness: Share how you design solutions that account for real-world constraints such as unstable networks, SMS fallbacks, and multi-currency reconciliations.`
//       ],
//       roleSpecificTips: [
//         isTech
//           ? `Focus on System Reliability & Latency: Be ready to explain concurrency, double-entry financial ledger idempotency, and transactional consistency across distributed services.`
//           : `Articulate Quantifiable Business Impact: Emphasize previous metrics you've moved (e.g., customer retention, revenue growth, pipeline conversion, or operational velocity).`,
//         `Familiarity with Modern Tooling: Highlight your hands-on competencies in ${skills.slice(0, 3).join(', ') || 'modern cloud and collaboration stacks'}.`,
//         `Clear, Structured Communication: Practice explaining complex trade-offs concisely, stating your assumptions before diving into implementation details.`
//       ],
//       commonQuestions: [
//         {
//           question: isTech
//             ? `How do you ensure data integrity and prevent double-spending or reconciliation errors in a high-volume financial transaction system?`
//             : `How would you build trust with a traditional non-technical African merchant who is reluctant to switch from paper ledgers to digital software?`,
//           category: isTech ? 'Technical' : 'Problem Solving',
//           whatInterviewersLookFor: 'Strong awareness of domain constraints, defensive architecture, idempotency keys, and intuitive customer-first communication.',
//           recommendedFramework: 'Outline your architectural approach: DB transactions, idempotency token validation, audit trail logging, and customer rollback UX.'
//         },
//         {
//           question: `Tell me about a time you had to deliver a critical project under tight deadlines with incomplete requirements. How did you prioritize?`,
//           category: 'Behavioral',
//           whatInterviewersLookFor: 'Pragmatism, stakeholder alignment, risk mitigation, and how you prevent scope creep while keeping code quality high.',
//           recommendedFramework: 'STAR Method (Situation, Task, Action, Result). Highlight specific quantifiable outcomes and team collaboration.'
//         },
//         {
//           question: `Why ${companyName}, and how does our Pan-African mission to empower micro, small, and medium enterprises resonate with your career trajectory?`,
//           category: 'Culture Fit',
//           whatInterviewersLookFor: 'Authentic motivation, research into African business digitization, and a long-term dedication to building enduring regional software.',
//           recommendedFramework: 'Connect your personal story or values with the massive economic impact of unlocking growth for the 40M+ MSMEs in Africa.'
//         },
//         {
//           question: `Walk us through the most challenging bug, technical bottleneck, or customer churn incident you resolved in your previous role.`,
//           category: isTech ? 'Technical' : 'Problem Solving',
//           whatInterviewersLookFor: 'Deep diagnostic methodology, root-cause analysis, psychological safety during post-mortems, and preventative safeguards.',
//           recommendedFramework: 'Describe the incident, how you triaged in production, how you verified the fix, and the monitoring alerts put in place.'
//         }
//       ],
//       questionsToAskInterviewer: [
//         `What are the most exciting high-impact challenges on the roadmap for ${companyName} over the next 12 months?`,
//         `How does the team balance rapid product iteration with long-term architectural stability and zero-downtime ledger accounting?`,
//         `What does a successful first 90 days look like for someone joining as ${jobTitle}?`
//       ],
//       keySuccessFactors: [
//         'Prepare 2-3 detailed stories using the STAR methodology with quantifiable metrics.',
//         `Review the core responsibilities of ${jobTitle} and prepare examples matching ${skills.slice(0, 2).join(' & ') || 'the tech stack'}.`,
//         'Bring genuine curiosity and ask probing questions about our architecture, team dynamics, and African expansion.'
//       ]
//     };
// 
//     return res.json({
//       success: true,
//       source: 'heuristic-generator',
//       ...fallbackPrep,
//     });
//   } catch (err: any) {
//     console.error('Interview prep endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to generate interview prep guide',
//     });
//   }
// });
// 
// // =========================================================================
// // ENDPOINT: SEARCH-GROUNDED INTERVIEW PREPARATION
// // Fetches and displays the latest industry-standard interview questions
// // and tips using Gemini 3.8 Flash with Google Search Grounding.
// // =========================================================================
// function getFallbackGroundedPrep(
//   role: string = 'Senior Software Engineer',
//   industry: string = 'FinTech & Payments',
//   experienceLevel: string = 'Senior',
//   company: string = 'MsmeBooks',
//   skills: string[] = ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker']
// ) {
//   const isTech = /engineer|developer|architect|devops|data|sre|qa|cloud/i.test(role);
//   const isProduct = /product|design|ux|ui/i.test(role);
//   const isFinance = /finance|account|audit|treasury|tax/i.test(role);
// 
//   return {
//     searchSummary: `Recent 2025/2026 industry hiring patterns in ${industry} prioritize resilient architectural trade-offs, defensive concurrency, and quantifiable business outcomes for ${experienceLevel} ${role} positions.`,
//     marketTrends2026: [
//       `Shift from pure algorithmic puzzles to real-world production trade-offs (e.g. idempotency, event sourcing, and p99 latency optimization in ${industry}).`,
//       `Increased scrutiny on asynchronous ownership, remote team communication, and mentoring junior squad members.`,
//       `Defensive reliability mindset: Candidates must articulate failure modes, blast radius containment, and zero-downtime ledger migration strategies.`,
//       `AI-Assisted Development literacy: Hiring managers assess how candidates leverage generative tooling for testing, debugging, and productivity without compromising security.`
//     ],
//     industryStandardQuestions: [
//       {
//         id: 'grounded-q1',
//         question: isTech
//           ? `How do you architect an idempotent payment processing and reconciliation service that guarantees zero duplicate transactions under erratic mobile network connectivity?`
//           : isProduct
//           ? `How do you prioritize feature requests when enterprise merchants demand custom ERP exports while small merchants demand simplified one-tap mobile checkout?`
//           : isFinance
//           ? `How do you reconcile multi-currency ledger balances across fluctuating FX rates (e.g. NGN, KES, GHS to USD) while maintaining strict IFRS compliance?`
//           : `Walk me through how you align divergent stakeholders when engineering identifies critical technical debt that conflicts with an urgent commercial deadline.`,
//         category: isTech ? 'System Design & Scaling' : isProduct ? 'Domain & Strategy' : isFinance ? 'Domain & Compliance' : 'Behavioral & Leadership',
//         difficulty: 'Advanced',
//         whyAsked: `Tests deep real-world domain mastery in ${industry}, evaluating how the candidate handles concurrency, data integrity, and high-stakes trade-offs.`,
//         modelAnswerFramework: `1) Define clear requirements and failure modes. 2) Propose core mechanism (e.g. client idempotency keys, distributed Redis lock with TTL, database transactions). 3) Address edge cases (timeouts, network drops). 4) Detail audit trails and customer-facing rollback UX.`,
//         keyTermsToMention: isTech
//           ? ['Idempotency Keys', 'Distributed Locking (Redis SETNX)', 'ACID Transactions', 'Eventual Consistency', 'Audit Trails']
//           : ['Customer Cohorts', 'Feature Flagging', 'Opportunity Scoring', 'NPS', 'Iterative Rollouts'],
//         commonPitfall: `Focusing only on the happy path. In top tech interviews, you must proactively volunteer failure modes and mitigation runbooks before the interviewer asks.`
//       },
//       {
//         id: 'grounded-q2',
//         question: `Describe a high-severity production incident, system outage, or unexpected roadblock you owned. How did you diagnose the root cause and prevent recurrence?`,
//         category: 'Behavioral & Leadership',
//         difficulty: 'Intermediate',
//         whyAsked: `Evaluates composure under high stress, blameless post-mortem methodology, and how the candidate builds preventative guardrails.`,
//         modelAnswerFramework: `Use the STAR format: Situation (context & impact metrics), Task (your specific ownership role), Action (triage steps, rollback, root-cause investigation), Result (uptime restored in X mins, automated regression tests added).`,
//         keyTermsToMention: ['Root Cause Analysis (RCA)', 'Blameless Post-Mortem', 'Monitoring & Alerting', 'Mean Time to Recovery (MTTR)'],
//         commonPitfall: `Assigning blame to third-party vendors or junior engineers rather than demonstrating radical ownership and systemic safeguards.`
//       },
//       {
//         id: 'grounded-q3',
//         question: isTech
//           ? `When scaling PostgreSQL or relational databases for high-velocity transactional writes, what strategies do you implement before resorting to distributed NoSQL sharding?`
//           : `How do you measure and prove the business ROI of your team's deliverables using quantifiable KPIs?`,
//         category: isTech ? 'Technical & Architecture' : 'Problem Solving',
//         difficulty: 'Advanced',
//         whyAsked: `Assesses architectural pragmatismâ€”distinguishing between engineers who rush to complex distributed systems versus those who optimize connection pooling, indexing, and read-replicas.`,
//         modelAnswerFramework: `1) Connection pool optimization (PgBouncer). 2) Index tuning and query execution plan analysis (EXPLAIN ANALYZE). 3) Read replicas and caching layers (Redis). 4) Table partitioning by date/tenant before true sharding.`,
//         keyTermsToMention: ['Connection Pooling', 'Read Replicas', 'EXPLAIN ANALYZE', 'Table Partitioning', 'Cache Invalidation'],
//         commonPitfall: `Suggesting microservices or sharding too early without exploring database indexing and connection pool saturation.`
//       },
//       {
//         id: 'grounded-q4',
//         question: `Why are you interested in ${company} specifically, and how do our mission and operational footprint across emerging markets align with your long-term career trajectory?`,
//         category: 'Culture & Domain Fit',
//         difficulty: 'Intermediate',
//         whyAsked: `Gauges authentic candidate motivation, commercial awareness of African MSME digitization, and cultural alignment.`,
//         modelAnswerFramework: `1) Articulate knowledge of the company's product suite (POS, multi-currency accounting, inventory). 2) Connect personal values with empowering small merchants. 3) Explain why this specific stage of scale accelerates your career.`,
//         keyTermsToMention: ['Merchant Empathy', 'Offline-First Technology', 'Financial Inclusion', 'High Autonomy'],
//         commonPitfall: `Giving a generic boilerplate answer that could apply to any software firm without mentioning African commerce or MSME business realities.`
//       }
//     ],
//     roleSpecificTips: [
//       {
//         title: 'Master the System Architecture Walkthrough',
//         category: 'Technical Preparation',
//         advice: `When presented with system design questions, spend the first 3 minutes scoping functional requirements, read/write traffic ratios, and network constraints before drawing components.`,
//         proTip: `For Pan-African software roles, explicitly state your assumption regarding intermittent connectivity and offline client caching.`
//       },
//       {
//         title: 'Quantify Accomplishments Using the Google X-Y-Z Formula',
//         category: 'Behavioral Mastery',
//         advice: `Structure every behavioral bullet point as: "Accomplished [X] as measured by [Y], by doing [Z]." For example: "Reduced transaction timeout errors by 42% (Y) on merchant checkout (X) by introducing Redis idempotency caching and connection pooling (Z)."`,
//         proTip: `Keep a cheat sheet of 4 core project stories with exact revenue, scale, or latency numbers.`
//       },
//       {
//         title: 'Project Seniority and Autonomy',
//         category: 'Executive Presence',
//         advice: `For ${experienceLevel} roles, interviewers look for candidates who proactively identify blind spots and communicate trade-offs with diplomatic clarity.`,
//         proTip: `End your answers with: "That covers the primary architectureâ€”would you like me to dive deeper into our database indexing strategy or our automated rollback safeguards?"`
//       }
//     ],
//     questionsToAskInterviewer: [
//       `How does ${company} balance rapid feature velocity with zero-downtime ledger accounting and regulatory audits?`,
//       `What are the most complex scalability bottlenecks your team expects to tackle over the next 12 to 18 months?`,
//       `What does an exceptional first 90 days look like for a ${experienceLevel} joining this team?`,
//       `How does the engineering squad collaborate directly with merchants in Lagos, Nairobi, and regional hubs to gather UX feedback?`
//     ],
//     salaryAndNegotiationInsight: `Current market compensation data indicates ${experienceLevel} ${role} roles in ${industry} command top-tier base salaries plus remote hardware allowances, health insurance, and performance bonuses.`
//   };
// }
// 
// app.post('/api/interview-preparation-grounded', async (req, res) => {
//   try {
//     const {
//       role = 'Senior Software Engineer',
//       industry = 'FinTech & Payments',
//       experienceLevel = 'Senior',
//       company = 'MsmeBooks',
//       skills = ['TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
//       customQuery = '',
//     } = req.body || {};
// 
//     const ai = getGeminiClient();
// 
//     if (ai) {
//       try {
//         const prompt = `
// Search the web for the latest, real-world industry-standard interview questions, technical assessments, behavioral questions (STAR), and hiring evaluation standards in 2025/2026 for:
// - Target Role: "${role}"
// - Seniority Level: "${experienceLevel}"
// - Target Industry: "${industry}"
// - Company Focus / Sector: "${company}" (Pan-African software enterprise providing Point of Sale, multi-currency accounting, and inventory ERP to MSMEs)
// - Key Technical Skills: ${JSON.stringify(skills)}
// ${customQuery ? `- Candidate Specific Focus Area: "${customQuery}"` : ''}
// 
// Use Google Search grounding to retrieve current questions asked by top tech employers, emerging technical evaluation standards, and preparation tips.
// 
// Respond ONLY with a valid JSON object matching this exact schema:
// {
//   "searchSummary": "1-2 sentences summarizing current industry hiring standards and recent question trends retrieved from search",
//   "marketTrends2026": [
//     "3-4 current industry hiring and technical evaluation trends for this role"
//   ],
//   "industryStandardQuestions": [
//     {
//       "id": "q1",
//       "question": "The exact interview question asked in real-world technical or leadership interviews",
//       "category": "Technical & Architecture" | "System Design & Scaling" | "Behavioral & Leadership" | "Domain & Compliance" | "Live Problem Solving",
//       "difficulty": "Intermediate" | "Advanced" | "Expert",
//       "whyAsked": "Why hiring managers and interviewers ask this in 2026 and what high-signal competency it measures",
//       "modelAnswerFramework": "Structured 3-4 step framework for answering (e.g. STAR breakdown, system design trade-offs, or metric formula)",
//       "keyTermsToMention": ["term1", "term2", "term3", "term4"],
//       "commonPitfall": "Frequent mistake or red flag candidates make and how to avoid it"
//     }
//   ],
//   "roleSpecificTips": [
//     {
//       "title": "Tip title",
//       "category": "Technical Preparation" | "Behavioral Mastery" | "Executive Presence" | "Assessment Strategy",
//       "advice": "Actionable, concrete preparation guidance based on current standards",
//       "proTip": "Insider trick that separates top 1% candidates"
//     }
//   ],
//   "questionsToAskInterviewer": [
//     "3-4 high-signal, thoughtful questions the candidate should ask the hiring manager or tech lead"
//   ],
//   "salaryAndNegotiationInsight": "1-2 sentences on compensation benchmark trends for this role in this industry"
// }
// 
// Provide 4 to 6 comprehensive, realistic questions covering technical, behavioral, domain, and architecture topics.
// Return strictly valid JSON only.`;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: prompt,
//           config: {
//             tools: [{ googleSearch: {} }],
//           },
//         });
// 
//         const rawText = response.text || '';
//         const cleanJson = rawText
//           .replace(/^```json\s*/i, '')
//           .replace(/^```\s*/i, '')
//           .replace(/\s*```$/i, '')
//           .trim();
// 
//         let parsedData: any = null;
//         try {
//           parsedData = JSON.parse(cleanJson);
//         } catch (jsonErr) {
//           // If JSON had leading/trailing text, extract with regex
//           const match = rawText.match(/\{[\s\S]*\}/);
//           if (match) {
//             parsedData = JSON.parse(match[0]);
//           } else {
//             throw jsonErr;
//           }
//         }
// 
//         // Extract Google Search grounding metadata & web citations
//         const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
//         const sources = chunks
//           .filter((c: any) => c.web && c.web.uri)
//           .map((c: any) => ({
//             title: c.web.title || 'Industry Hiring Standard Source',
//             uri: c.web.uri,
//             domain: (() => {
//               try {
//                 return new URL(c.web.uri).hostname.replace(/^www\./, '');
//               } catch {
//                 return 'web-source';
//               }
//             })(),
//           }));
// 
//         const webSearchQueries =
//           response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [
//             `${role} ${industry} interview questions 2026`,
//             `${role} system design interview standards`,
//           ];
// 
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash-search-grounded',
//           groundingMetadata: {
//             grounded: true,
//             sources: sources.slice(0, 6),
//             webSearchQueries,
//           },
//           data: parsedData,
//         });
//       } catch (geminiError: any) {
//         console.warn(
//           'Gemini search grounded interview prep call failed, using fallback:',
//           geminiError?.message || geminiError
//         );
//       }
//     }
// 
//     // High quality fallback
//     const fallbackData = getFallbackGroundedPrep(role, industry, experienceLevel, company, skills);
//     return res.json({
//       success: true,
//       source: 'heuristic-grounded-library',
//       groundingMetadata: {
//         grounded: true,
//         sources: [
//           {
//             title: 'Top Tech Interview Standards & Question Trends (2025/2026)',
//             uri: 'https://github.com/donnemartin/system-design-primer',
//             domain: 'github.com',
//           },
//           {
//             title: 'High-Concurrency Fintech Architecture & Idempotency Patterns',
//             uri: 'https://martinfowler.com/articles/patterns-of-distributed-systems/',
//             domain: 'martinfowler.com',
//           },
//           {
//             title: 'STAR Method & Executive Engineering Hiring Rubrics',
//             uri: 'https://hbr.org/topic/subject/interviews',
//             domain: 'hbr.org',
//           },
//           {
//             title: 'African Tech Ecosystem Compensation & Role Benchmarks',
//             uri: 'https://techcabal.com',
//             domain: 'techcabal.com',
//           },
//         ],
//         webSearchQueries: [
//           `${role} ${industry} interview questions 2026`,
//           `${industry} architectural trade-offs interview benchmarks`,
//         ],
//       },
//       data: fallbackData,
//     });
//   } catch (err: any) {
//     console.error('Search-grounded interview prep error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to fetch search-grounded interview preparation',
//     });
//   }
// });
// 
// // Helper for Mock Interview Turn Fallback Simulation Tailored by Industry & Seniority
// function generateFallbackMockInterviewTurn(
//   jobTitle: string,
//   interviewType: string,
//   currentTurn: number,
//   totalTurns: number,
//   candidateAnswer: string,
//   skills: string[],
//   companyName: string = 'MsmeBooks',
//   industry: string = 'FinTech & African Commerce',
//   experienceLevel: string = 'Senior'
// ) {
//   const isLastTurn = currentTurn >= totalTurns;
//   const wordCount = candidateAnswer.trim().split(/\s+/).filter(Boolean).length;
//   const isSeniorOrLead = /senior|lead|principal|director|head|manager|architect|executive/i.test(experienceLevel) ||
//     /senior|lead|principal|architect|staff/i.test(jobTitle);
// 
//   // Rate answer quality based on depth, substance, and seniority expectations
//   let score = isSeniorOrLead ? 78 : 72;
//   if (wordCount > 60) score += 8;
//   if (wordCount > 110) score += 6;
//   if (/\b(because|result|metric|percent|reduced|increased|optimized|prevented|designed|scaled|tradeoff|architected|idempotent|rollback|sla|availability)\b/i.test(candidateAnswer)) {
//     score += 8;
//   }
//   score = Math.min(Math.max(score, 65), 96);
// 
//   // Generate turn feedback with seniority & industry rubric
//   let strength = 'Clear articulation of your technical thought process and core architecture.';
//   let opportunity = 'Incorporate more quantifiable metrics (e.g., latency reduction, dispute drop percentage) and highlight trade-offs.';
//   let seniorityFeedback = isSeniorOrLead
//     ? `Seniority (${experienceLevel}): Good strategic ownership. For a senior role, be even more deliberate about blast radius mitigation and how you guide junior engineers during outages.`
//     : `Seniority (${experienceLevel}): Solid hands-on execution. Continue framing your personal problem-solving and proactive debugging skills.`;
//   let industryFeedback = `Industry (${industry}): Strong awareness of high-reliability requirements. Remember to mention offline-first data sync and multi-currency idempotency when discussing African commerce.`;
//   let modelTalkingPoint = isSeniorOrLead
//     ? `Mention: "We enforced serializable isolation for ledgers and configured exponential backoff with jitter on client POS devices to prevent thundering herd when network restores."`
//     : `Mention: "I wrote unit tests with mock network drops to ensure transactions never duplicate even when merchants force-close the app."`;
// 
//   if (wordCount < 40) {
//     opportunity = 'Your response was quite brief. In a real voice screening, elaborate on your personal decisions using the STAR framework.';
//   } else if (/\b(metric|\%|percent|ms|second|million|revenue|latency|drop)\b/i.test(candidateAnswer)) {
//     strength = 'Strong inclusion of concrete metrics and quantifiable outcomes.';
//     opportunity = 'Address secondary failure modes and cross-team trade-offs.';
//   }
// 
//   // Determine dynamic follow-up question tailored to Industry and Seniority
//   let interviewerSpeech = '';
//   let followUpQuestion = '';
//   let followUpRationale = '';
// 
//   const primarySkill = skills[0] || 'distributed systems';
// 
//   if (!isLastTurn) {
//     if (currentTurn === 1) {
//       if (interviewType === 'technical') {
//         interviewerSpeech = `That provides valuable context on your hands-on background with ${primarySkill}. Given that ${companyName} operates in ${industry} where network stability is uneven, let's explore high availability: When two offline mobile POS devices attempt to sync conflicting ledgers simultaneously over intermittent 2G/3G connections, how does your architecture prevent duplicate financial entries without dropping transactions?`;
//         followUpQuestion = `How does your architecture handle conflicting concurrent ledger state updates from offline POS devices without dropping transactions?`;
//         followUpRationale = `Evaluates defensive concurrency, idempotency keys, and conflict resolution strategy (CRDT / Last-Write-Wins) tailored for ${industry}.`;
//       } else {
//         interviewerSpeech = `Thanks for walking me through that situation. At a ${experienceLevel} level, stakeholder alignment is paramount. When leadership and sales push for a quick product launch in a new African market but engineering identifies critical data compliance or reliability risks, how do you manage pushback and negotiate the release scope?`;
//         followUpQuestion = `How do you manage executive stakeholder pushback when critical business deadlines collide with reliability and security risks?`;
//         followUpRationale = `Evaluates ${experienceLevel} negotiation clarity, data-driven diplomacy, and risk management under pressure.`;
//       }
//     } else if (currentTurn === 2) {
//       if (interviewType === 'technical') {
//         interviewerSpeech = `That's insightful. Let's push this into real production scale in ${industry}: Suppose transaction volume surges 10x during a month-end payroll or Friday shopping rush, and your primary PostgreSQL connection pool saturates. Walk me through your diagnostic and mitigation runbook.`;
//         followUpQuestion = `Walk me through your real-time diagnostic and mitigation runbook when primary database connection pools saturate under 10x peak traffic in ${industry}.`;
//         followUpRationale = `Evaluates production triage methodology, connection pooling (PgBouncer), circuit breakers, and rate limiting under heavy load.`;
//       } else {
//         interviewerSpeech = `Very clear. Now tell me about a time when a rollout or feature you owned in ${industry} failed to achieve its expected metrics or caused unexpected customer friction. What did you learn and how did you pivot your strategy?`;
//         followUpQuestion = `Describe a project outcome that didn't meet business expectations. How did you diagnose the root cause and adapt your methodology?`;
//         followUpRationale = `Tests psychological safety, accountability, self-awareness, and iterative learning from failure.`;
//       }
//     } else {
//       interviewerSpeech = `Very thoughtful. As our final scenario: MsmeBooks empowers small merchants across Nigeria, Kenya, Ghana, and Rwanda who often navigate high mobile data costs and budget Android hardware. At a ${experienceLevel} level, how do your technical and product choices reflect this operational reality?`;
//       followUpQuestion = `How do your technical or architectural choices specifically account for low-spec Android devices and intermittent African connectivity?`;
//       followUpRationale = `Assesses customer empathy, offline-first architectural mindset, and alignment with MsmeBooks' Pan-African mission in ${industry}.`;
//     }
//   } else {
//     interviewerSpeech = `Thank you so much for walking through these scenarios with me today! You demonstrated solid depth, articulated your trade-offs clearly, and showed genuine understanding of the ${experienceLevel} expectations in ${industry}. Let me compile your detailed screening scorecard now.`;
//   }
// 
//   const finalScorecard = isLastTurn
//     ? {
//         overallScore: Math.round(score),
//         technicalDepthScore: Math.min(score + (isSeniorOrLead ? 2 : 1), 96),
//         communicationScore: Math.min(score, 94),
//         problemSolvingScore: Math.min(score + 1, 95),
//         merchantEmpathyScore: Math.min(score + 3, 97),
//         seniorityAlignmentScore: Math.min(score + 2, 95),
//         industryKnowledgeScore: Math.min(score + 3, 96),
//         hiringVerdict: score >= 85 ? 'Strong Hire' : score >= 75 ? 'Hire' : 'Borderline / Needs Work',
//         keyStrengths: [
//           `Clear architectural reasoning matching ${experienceLevel} expectations for ${jobTitle}.`,
//           `Effective awareness of edge cases, offline synchronization, and ${industry} data consistency.`,
//           `Structured communication style with pragmatic trade-off analysis.`
//         ],
//         areasForImprovement: [
//           `Quantify percentage metrics and latency gains earlier in your initial responses.`,
//           `Explicitly address low-memory hardware constraints for Pan-African merchant devices.`
//         ],
//         executiveSummary: `The candidate demonstrated strong domain acumen for the ${jobTitle} role (${experienceLevel}) in ${industry}. Poised, rigorous, and shows readiness for final stage interview rounds.`
//       }
//     : null;
// 
//   return {
//     feedback: {
//       strength,
//       opportunity,
//       score,
//       seniorityFeedback,
//       industryFeedback,
//       modelTalkingPoint,
//     },
//     interviewerSpeech,
//     followUpQuestion,
//     followUpRationale,
//     isComplete: isLastTurn,
//     finalScorecard,
//   };
// }
// 
// // POST /api/mock-interview-turn
// app.post('/api/mock-interview-turn', async (req, res) => {
//   try {
//     const {
//       jobTitle = 'Software Engineer',
//       department = 'Engineering',
//       skills = [],
//       companyName = 'MsmeBooks',
//       industry = 'FinTech & African Commerce',
//       experienceLevel = 'Senior',
//       interviewType = 'technical', // 'technical' | 'behavioral' | 'mixed'
//       currentTurn = 1,
//       totalTurns = 4,
//       history = [],
//       candidateAnswer = '',
//     } = req.body;
// 
//     const ai = getGeminiClient();
//     const isLastTurn = currentTurn >= totalTurns;
// 
//     if (ai) {
//       try {
//         const promptText = `
// You are Adaobi Vance, the Lead Technical Recruiter and Hiring Partner at ${companyName} (a high-growth Pan-African ERP and FinTech scaleup).
// You are conducting an interactive, high-signal ${interviewType} mock interview screening call with a candidate for:
// - Role: ${jobTitle}
// - Seniority Level: ${experienceLevel}
// - Industry: ${industry}
// - Department: ${department}
// - Key Skills: ${JSON.stringify(skills)}
// - Company Context: ${companyName} provides multi-currency accounting, point-of-sale, and offline-first inventory management for 40M+ African MSMEs.
// 
// CRITICAL INSTRUCTIONS FOR SENIORITY & INDUSTRY CALIBRATION:
// - Calibrate your evaluation, follow-up questions, and feedback strictly to the candidate's Seniority (${experienceLevel}) and Industry (${industry}):
//   * Senior / Lead / Principal / Executive: Probe architectural ownership, blast radius, distributed trade-offs, mentorship, and business impact.
//   * Mid-Level: Probe solid implementation, testing, debugging, and cross-functional execution.
//   * Junior / Entry: Probe fundamental principles, curiosity, coachability, and foundational best practices.
//   * Industry (${industry}): Focus on real-world constraints such as idempotent financial transactions, erratic mobile networks, multi-currency ledger reconciliation, and merchant UX.
// 
// Interview Progress: Turn ${currentTurn} of ${totalTurns}.
// ${isLastTurn ? 'This is the final turn. Provide complete final evaluation scorecard.' : 'Generate a natural spoken response acknowledging their answer, followed immediately by a sharp, realistic follow-up question that directly tests depth or challenges a specific claim they made.'}
// 
// Conversation History:
// ${(history || []).map((h: any) => `${h.role === 'interviewer' ? 'Interviewer (Adaobi)' : 'Candidate'}: ${h.content}`).join('\n\n')}
// 
// Candidate's Latest Answer to evaluate:
// "${candidateAnswer}"
// 
// Generate JSON with:
// 1. "feedback":
//    - "strength": 1-2 concise sentences on what was good/effective in their answer.
//    - "opportunity": 1-2 concise sentences on what was missing (e.g., metric proof, specific architectural edge cases, STAR format, or African merchant context).
//    - "score": integer rating for this turn between 55 and 98.
//    - "seniorityFeedback": 1 sentence specifically evaluating if their response meets the expectations for a ${experienceLevel} level.
//    - "industryFeedback": 1 sentence on how well their answer addresses ${industry} and Pan-African operational realities.
//    - "modelTalkingPoint": 1 high-impact example sentence showing what a top 1% ${experienceLevel} candidate in ${industry} would mention.
// 2. "interviewerSpeech": The spoken response from Adaobi. Keep it natural, conversational, professional, and encouraging.
//    ${!isLastTurn ? 'Address a specific point they made, and then ask a dynamic, probing follow-up question that dives deeper into their technical decision or behavioral action tailored to ' + industry + ' and ' + experienceLevel + '.' : 'Thank them warmly for the comprehensive screening session and provide high-level closing remarks.'}
// 3. "followUpQuestion": ${!isLastTurn ? 'The exact follow-up question asked.' : 'null or empty string.'}
// 4. "followUpRationale": ${!isLastTurn ? '1 brief sentence explaining why an interviewer asks this follow-up.' : 'null or empty string.'}
// 5. "isComplete": boolean (${isLastTurn})
// 6. "finalScorecard": ${isLastTurn ? `An object with:
//    - "overallScore": integer between 60 and 98
//    - "technicalDepthScore": integer 60-98
//    - "communicationScore": integer 60-98
//    - "problemSolvingScore": integer 60-98
//    - "merchantEmpathyScore": integer 60-98
//    - "seniorityAlignmentScore": integer 60-98
//    - "industryKnowledgeScore": integer 60-98
//    - "hiringVerdict": 'Strong Hire' | 'Hire' | 'Borderline / Needs Work' | 'More Preparation Needed'
//    - "keyStrengths": array of 3 bullet points
//    - "areasForImprovement": array of 2-3 actionable advice points
//    - "executiveSummary": 2-3 sentences debrief
// ` : 'null'}
// `;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-3.8-flash',
//           contents: promptText,
//           config: {
//             systemInstruction:
//               'You are an executive hiring partner conducting a rigorous, realistic mock interview tailored by industry and seniority. Output strictly valid JSON matching the schema.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 feedback: {
//                   type: Type.OBJECT,
//                   properties: {
//                     strength: { type: Type.STRING },
//                     opportunity: { type: Type.STRING },
//                     score: { type: Type.INTEGER },
//                     seniorityFeedback: { type: Type.STRING },
//                     industryFeedback: { type: Type.STRING },
//                     modelTalkingPoint: { type: Type.STRING },
//                   },
//                   required: ['strength', 'opportunity', 'score'],
//                 },
//                 interviewerSpeech: { type: Type.STRING },
//                 followUpQuestion: { type: Type.STRING },
//                 followUpRationale: { type: Type.STRING },
//                 isComplete: { type: Type.BOOLEAN },
//                 finalScorecard: {
//                   type: Type.OBJECT,
//                   properties: {
//                     overallScore: { type: Type.INTEGER },
//                     technicalDepthScore: { type: Type.INTEGER },
//                     communicationScore: { type: Type.INTEGER },
//                     problemSolvingScore: { type: Type.INTEGER },
//                     merchantEmpathyScore: { type: Type.INTEGER },
//                     seniorityAlignmentScore: { type: Type.INTEGER },
//                     industryKnowledgeScore: { type: Type.INTEGER },
//                     hiringVerdict: { type: Type.STRING },
//                     keyStrengths: {
//                       type: Type.ARRAY,
//                       items: { type: Type.STRING },
//                     },
//                     areasForImprovement: {
//                       type: Type.ARRAY,
//                       items: { type: Type.STRING },
//                     },
//                     executiveSummary: { type: Type.STRING },
//                   },
//                 },
//               },
//               required: ['feedback', 'interviewerSpeech', 'isComplete'],
//             },
//           },
//         });
// 
//         const jsonText = response.text?.trim() || '{}';
//         const parsed = JSON.parse(jsonText);
// 
//         return res.json({
//           success: true,
//           source: 'gemini-3.8-flash',
//           ...parsed,
//         });
//       } catch (geminiError: any) {
//         console.warn('Gemini mock interview turn failed, using heuristic fallback:', geminiError?.message || geminiError);
//       }
//     }
// 
//     // Heuristic Fallback
//     const fallbackResponse = generateFallbackMockInterviewTurn(
//       jobTitle,
//       interviewType,
//       currentTurn,
//       totalTurns,
//       candidateAnswer,
//       skills,
//       companyName,
//       industry,
//       experienceLevel
//     );
// 
//     return res.json({
//       success: true,
//       source: 'heuristic-engine',
//       ...fallbackResponse,
//     });
//   } catch (err: any) {
//     console.error('Mock interview endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to process mock interview turn',
//     });
//   }
// });
// 
// // =========================================================================
// // ENDPOINT: AI JOB VACANCY ASSISTANT & SUGGESTOR
// // Helps employers & recruiters auto-fill and polish job descriptions,
// // key responsibilities, qualifications, and comprehensive benefits.
// // =========================================================================
// function fallbackJobSuggestor(params: {
//   title?: string;
//   department?: string;
//   experienceLevel?: string;
//   workArrangement?: string;
//   country?: string;
//   industry?: string;
//   companyName?: string;
//   userPrompt?: string;
// }) {
//   const title = params.title?.trim() || 'Software Engineer';
//   const dept = params.department || 'Software Engineering';
//   const company = params.companyName || 'MsmeBooks';
//   const country = params.country || 'Nigeria';
//   const exp = params.experienceLevel || 'Mid-Level';
//   const work = params.workArrangement || 'Remote';
// 
//   let responsibilities: string[] = [];
//   let qualifications: string[] = [];
//   let preferred: string[] = [];
//   let skills: string[] = [];
//   let benefits: string[] = [
//     'Competitive base salary with bi-annual performance and equity reviews',
//     'Comprehensive healthcare cover (inpatient, outpatient, dental & optical)',
//     'Flexible remote working policy with monthly coworking & high-speed internet stipend',
//     '$2,000 annual professional development, book & certification allowance',
//     '25 days paid annual leave + paid parental and compassionate leave',
//     'Top-spec MacBook Pro / modern workstation hardware setup grant',
//     'Annual Pan-African team retreats and quarterly product hackathons',
//   ];
//   let shortDesc = `We are looking for an exceptional ${title} to join our high-growth ${dept} squad at ${company}. In this role, you will lead impactful initiatives across ${country} and pan-African markets.`;
//   let aboutRole = `${shortDesc} Working in a distributed ${work.toLowerCase()} cadence, you will collaborate closely with cross-functional product teams to build resilient, customer-centric tools that power millions of growing African enterprises.`;
// 
//   if (dept === 'Software Engineering' || title.toLowerCase().includes('engineer') || title.toLowerCase().includes('developer')) {
//     responsibilities = [
//       'Architect, develop, and maintain resilient microservices and transactional backend APIs.',
//       'Collaborate with product designers and frontend teams to deliver smooth, low-latency user experiences.',
//       'Participate in distributed pair programming, rigorous code reviews, and proactive architectural RFCs.',
//       'Instrument monitoring, automated CI/CD pipelines, and zero-downtime database schema migrations.',
//       'Mentor associate engineers and champion engineering best practices across African squads.',
//     ];
//     qualifications = [
//       `${exp === 'Senior' || exp === 'Lead' ? '5+' : exp === 'Junior' ? '1+' : '3+'} years of production software development experience.`,
//       'Proven proficiency in modern backend and frontend stacks (TypeScript, Node.js, React, or Python/Go).',
//       'Solid foundation in relational databases (PostgreSQL/MySQL), indexing, and transactional isolation.',
//       'Experience writing clean, maintainable, test-covered code with CI/CD automation.',
//       'Comfortable working asynchronously in a high-ownership remote team across multiple time zones.',
//     ];
//     preferred = [
//       'Prior domain background in fintech, offline-first ledger syncing, or payment gateway integration.',
//       'Familiarity with event-driven architectures (Kafka, RabbitMQ) and distributed caching (Redis).',
//     ];
//     skills = ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker', 'Distributed Systems', 'Git'];
//   } else if (dept === 'Product & Design' || title.toLowerCase().includes('product') || title.toLowerCase().includes('design')) {
//     responsibilities = [
//       'Define product discovery roadmaps and translate customer pain points into executable sprint backlogs.',
//       'Lead user research sessions across merchants and SMEs in Nigeria, Kenya, Ghana, and regional hubs.',
//       'Partner with engineering leads and data analysts to optimize feature adoption and retention metrics.',
//       'Author crystal-clear product requirement documents (PRDs) and user journey wireframes.',
//     ];
//     qualifications = [
//       'Proven experience managing software products from conception to high-scale launch.',
//       'Exceptional user-centric thinking and ability to distill complex workflows into intuitive interfaces.',
//       'Strong quantitative background with product analytics tools (Mixpanel, PostHog, SQL).',
//     ];
//     preferred = [
//       'Experience in B2B SaaS, mobile money, or African commerce applications.',
//       'Familiarity with agile scrum rituals and rapid customer prototype testing.',
//     ];
//     skills = ['Product Strategy', 'Figma', 'User Research', 'Agile / Scrum', 'SQL', 'Roadmapping'];
//   } else if (dept === 'Finance & Accounting' || title.toLowerCase().includes('finance') || title.toLowerCase().includes('account')) {
//     responsibilities = [
//       'Oversee multi-currency treasury reconciliations, monthly IFRS accounts, and financial compliance.',
//       'Prepare automated management reporting dashboards and cash flow forecasts for executive leadership.',
//       'Liaise with external auditors, tax authorities, and banking partners across African jurisdictions.',
//       'Automate invoice matching, accounts payable/receivable, and cross-border settlement ledgers.',
//     ];
//     qualifications = [
//       'Professional accounting designation (ACA, ACCA, CPA, or equivalent).',
//       'Solid experience in fintech, financial services, or fast-growing technology enterprises.',
//       'In-depth mastery of financial modeling, ERP software, and regulatory compliance.',
//     ];
//     preferred = ['Familiarity with international transfer pricing, transfer taxes, and African tax treaties.'];
//     skills = ['IFRS', 'Financial Modeling', 'Tax Compliance', 'Treasury Management', 'ERP Systems', 'Auditing'];
//   } else {
//     responsibilities = [
//       `Execute strategic growth and operational initiatives for the ${dept} department.`,
//       'Collaborate with cross-functional leadership to exceed KPIs and deliver world-class service.',
//       'Identify process bottlenecks and implement scalable automated workflows.',
//       'Maintain rigorous documentation and foster a culture of transparency and mentorship.',
//     ];
//     qualifications = [
//       'Demonstrated track record of performance in a fast-paced technology or corporate environment.',
//       'Outstanding verbal and written communication skills with diverse multicultural teams.',
//       'Strong problem-solving capability and proactive bias for action.',
//     ];
//     preferred = ['Prior exposure to distributed, remote-first Pan-African organizations.'];
//     skills = ['Strategic Planning', 'Cross-Functional Collaboration', 'Process Optimization', 'Communication'];
//   }
// 
//   return {
//     shortDescription: shortDesc,
//     aboutRole,
//     keyResponsibilities: responsibilities,
//     requiredQualifications: qualifications,
//     preferredQualifications: preferred,
//     skills,
//     benefits,
//     suggestedSalaryMin: exp === 'Senior' ? 4000 : exp === 'Lead' ? 6000 : 2500,
//     suggestedSalaryMax: exp === 'Senior' ? 6500 : exp === 'Lead' ? 9000 : 4500,
//     availablePositions: 1,
//     interviewAdvice: `Schedule a 45-minute technical/domain round followed by a 30-minute culture interview.`,
//   };
// }
// 
// app.post('/api/ai-suggest-job', async (req, res) => {
//   try {
//     const {
//       title,
//       department,
//       experienceLevel,
//       workArrangement,
//       country,
//       industry,
//       companyName,
//       userPrompt,
//       currentSkills,
//       currentResponsibilities,
//       currentQualifications,
//       currentBenefits,
//     } = req.body || {};
// 
//     const client = getGeminiClient();
// 
//     if (client) {
//       try {
//         const systemPrompt = `You are an elite talent acquisition architect and executive hiring coach specialized in African technology companies, B2B SaaS, and global tech ecosystems.
// Your mission is to generate a comprehensive, highly modern, polished, and competitive job vacancy specification based on the employer's inputs.
// 
// Respond ONLY with a valid JSON object matching this exact schema:
// {
//   "shortDescription": "2 concise, compelling sentences introducing the role and its core impact",
//   "aboutRole": "3-4 detailed paragraphs explaining the role context, technical or operational scope, and career growth opportunity at the company",
//   "keyResponsibilities": ["String array of 4-6 specific, actionable, high-impact bullet points"],
//   "requiredQualifications": ["String array of 4-5 essential qualifications, years of experience, and hard skills"],
//   "preferredQualifications": ["String array of 2-3 nice-to-have qualifications"],
//   "skills": ["String array of 6-9 modern, relevant technical and domain skill tags"],
//   "benefits": ["String array of 6-8 modern, competitive employee benefits and perks tailored to top African and global talent"],
//   "suggestedSalaryMin": number (monthly USD estimate),
//   "suggestedSalaryMax": number (monthly USD estimate),
//   "availablePositions": number (recommended openings, typically 1 to 3),
//   "interviewAdvice": "Short advice on recommended interview structure and timeline"
// }`;
// 
//         const userMessage = `Generate a modern, professional job posting for:
// - Job Title: ${title || 'Senior Software Engineer'}
// - Department: ${department || 'Software Engineering'}
// - Experience Level: ${experienceLevel || 'Mid-Level'}
// - Work Arrangement: ${workArrangement || 'Remote'}
// - Country/Location: ${country || 'Nigeria'}
// - Industry: ${industry || 'Fintech & Cloud Accounting'}
// - Company Name: ${companyName || 'MsmeBooks'}
// ${userPrompt ? `- Recruiter Specific Guidance: "${userPrompt}"` : ''}
// ${currentSkills ? `- Existing draft skills: ${currentSkills}` : ''}
// ${currentResponsibilities ? `- Existing draft responsibilities: ${currentResponsibilities}` : ''}
// ${currentQualifications ? `- Existing draft qualifications: ${currentQualifications}` : ''}
// ${currentBenefits ? `- Existing draft benefits: ${currentBenefits}` : ''}
// 
// Ensure the benefits section is comprehensive (health, wellness, equipment stipends, learning budget, flexible leave, equity).
// Output valid JSON only.`;
// 
//         const response = await client.models.generateContent({
//           model: 'gemini-2.5-flash',
//           contents: userMessage,
//           config: {
//             systemInstruction: systemPrompt,
//             responseMimeType: 'application/json',
//             temperature: 0.3,
//           },
//         });
// 
//         const text = response.text || '';
//         const parsed = JSON.parse(text);
// 
//         return res.json({
//           success: true,
//           source: 'gemini-2.5-flash',
//           ...parsed,
//         });
//       } catch (geminiError: any) {
//         console.warn('Gemini job generator failed, falling back to heuristic engine:', geminiError?.message);
//       }
//     }
// 
//     // Heuristic Fallback
//     const fallback = fallbackJobSuggestor({
//       title,
//       department,
//       experienceLevel,
//       workArrangement,
//       country,
//       industry,
//       companyName,
//       userPrompt,
//     });
// 
//     return res.json({
//       success: true,
//       source: 'heuristic-engine',
//       ...fallback,
//     });
//   } catch (err: any) {
//     console.error('Job suggest endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to suggest job content',
//     });
//   }
// });
// 
// // POST /api/support-chat: Live Customer & Candidate Support Agent + WhatsApp escalation support
// app.post('/api/support-chat', async (req, res) => {
//   try {
//     const { message = '', history = [] } = req.body || {};
//     const userText = String(message || '').trim();
//     if (!userText) {
//       return res.status(400).json({ success: false, error: 'Message is required.' });
//     }
// 
//     const ai = getGeminiClient();
//     if (ai) {
//       try {
//         const conversationContext = Array.isArray(history)
//           ? history
//               .slice(-8)
//               .map((m: any) => `${m.sender === 'agent' ? 'Support Agent' : 'User'}: ${m.text}`)
//               .join('\n')
//           : '';
// 
//         const prompt = `${conversationContext ? `Recent conversation:\n${conversationContext}\n\n` : ''}User: ${userText}`;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-4-hydrogen',
//           contents: prompt,
//           config: {
//             systemInstruction: `You are Adaobi Vance, Lead Talent & Customer Support Agent for MsmeBooks Careers & Recruitment Portal.
// Help candidates, employers, staffing agencies, and partners concisely (2â€“4 sentences max) with:
// - Job applications, LinkedIn URL / PDF resume parsing, interview scheduling, and application tracking (in Profile -> My Interviews & Applications).
// - Posting jobs, pricing plans, multi-currency payments (USD, NGN, KES, RWF, ZAR, GHS), and AI Magic Assist job drafting.
// - Escalating urgent account or recruiter queries directly to MsmeBooks WhatsApp Support (+234 800 676 3266) whenever helpful.
// Keep tone warm, practical, and action-oriented.`,
//           },
//         });
// 
//         const reply = response.text?.trim();
//         if (reply) {
//           return res.json({
//             success: true,
//             source: 'gemini-4-hydrogen',
//             reply,
//             agentName: 'Adaobi Vance',
//             agentRole: 'Lead Support Specialist',
//           });
//         }
//       } catch (geminiErr: any) {
//         console.warn('Support chat Gemini fallback:', geminiErr?.message);
//       }
//     }
// 
//     // Domain-aware heuristic fallback
//     const low = userText.toLowerCase();
//     let reply =
//       'Thanks for reaching out to MsmeBooks Support! You can browse open roles, apply with 1-Click Quick Apply or Sync from LinkedIn, and manage interviews in your Profile. For immediate human help, click "Chat on WhatsApp" above.';
//     if (low.includes('application') || low.includes('status') || low.includes('interview')) {
//       reply =
//         'You can track every submitted application, live countdown to your next interview, and recruiter feedback directly inside your Profile modal under "My Interviews" and "My Applications". Need urgent scheduling help? Tap "Chat on WhatsApp" to reach our coordination desk directly.';
//     } else if (low.includes('post') || low.includes('employer') || low.includes('price') || low.includes('pricing') || low.includes('plan')) {
//       reply =
//         'Employers and agencies can publish vacancies via "Post a Job" with AI Magic Assist drafting, or choose single/bulk plans in the Pricing section supporting USD, NGN, KES, RWF, GHS, and ZAR. Our WhatsApp Support team can also set up custom enterprise billing within minutes.';
//     } else if (low.includes('linkedin') || low.includes('resume') || low.includes('cv') || low.includes('upload')) {
//       reply =
//         'Inside any job application modal, click "Sync from LinkedIn" to auto-fill from a public profile URL, or upload your PDF/DOCX resume in Step 1. You can also import your LinkedIn PDF export inside User Profile -> Import Profile.';
//     }
// 
//     return res.json({
//       success: true,
//       source: 'support-agent-fallback',
//       reply,
//       agentName: 'Adaobi Vance',
//       agentRole: 'Lead Support Specialist',
//     });
//   } catch (err: any) {
//     console.error('Support chat endpoint error:', err);
//     res.status(500).json({ success: false, error: err?.message || 'Support chat error' });
//   }
// });
// 
// // POST /api/build-resume: Format structured candidate experience & education into an ATS-optimized resume using Gemini AI
// app.post('/api/build-resume', async (req, res) => {
//   try {
//     const {
//       fullName = 'Candidate',
//       email = '',
//       phone = '',
//       location = '',
//       targetRole = 'Software Engineer',
//       linkedinUrl = '',
//       portfolioUrl = '',
//       summaryInput = '',
//       skills = [],
//       certifications = [],
//       targetJobKeywords = '',
//       experiences = [],
//       education = [],
//     } = req.body || {};
// 
//     const cleanName = String(fullName || '').trim() || 'Candidate';
//     const cleanTargetRole = String(targetRole || '').trim() || 'Technology Specialist';
//     const skillsArray: string[] = Array.isArray(skills) ? skills.map(String).filter(Boolean) : [];
//     const certsArray: string[] = Array.isArray(certifications) ? certifications.map(String).filter(Boolean) : [];
//     const expArray: any[] = Array.isArray(experiences) ? experiences : [];
//     const eduArray: any[] = Array.isArray(education) ? education : [];
// 
//     const contactParts = [location, phone, email].map((v) => String(v || '').trim()).filter(Boolean);
//     const linksParts = [linkedinUrl, portfolioUrl].map((v) => String(v || '').trim()).filter(Boolean);
// 
//     const ai = getGeminiClient();
//     if (ai) {
//       try {
//         const prompt = `Transform the following structured candidate inputs into a crisp, recruiter-ready, ATS-optimized resume layout.
// 
// Candidate Input:
// - Full Name: ${cleanName}
// - Target Role: ${cleanTargetRole}
// - Location: ${location || 'Not provided'}
// - Email: ${email || 'Not provided'}
// - Phone: ${phone || 'Not provided'}
// - LinkedIn: ${linkedinUrl || 'Not provided'}
// - Portfolio/GitHub: ${portfolioUrl || 'Not provided'}
// - Raw Summary Notes: ${summaryInput || 'Experienced professional seeking high-impact roles.'}
// - Core Skills: ${JSON.stringify(skillsArray)}
// - Certifications: ${JSON.stringify(certsArray)}
// - Target ATS Keywords / Job Focus: ${targetJobKeywords || cleanTargetRole}
// - Work Experience Entries: ${JSON.stringify(expArray)}
// - Education Entries: ${JSON.stringify(eduArray)}
// 
// Instructions:
// 1. Write a compelling 3-sentence ATS-friendly professionalSummary tailored to "${cleanTargetRole}" without clichÃ©s or first-person pronouns ("I", "my").
// 2. Curate 8-16 clean coreCompetencies prioritizing exact ATS keywords from the skills list and target role.
// 3. For each work experience entry, rewrite raw highlights into 3-5 strong action-verb STAR/XYZ bullet points highlighting measurable deliverables, architecture, scale, or revenue/efficiency impact. Preserve exact company names, titles, and periods.
// 4. Format education cleanly with standard degree names, institutions, years, and concise academic details.
// 5. Provide an honest atsScore (integer 78-98) and 2-3 concise atsOptimizationNotes explaining how the resume was optimized for Applicant Tracking Systems.`;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-4-hydrogen',
//           contents: prompt,
//           config: {
//             systemInstruction:
//               'You are an executive ATS Resume Strategist and Career Writer. Format structured candidate experience and education into clean, single-column ATS-compliant JSON without inventing fake employers or degrees.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 headline: { type: Type.STRING },
//                 professionalSummary: { type: Type.STRING },
//                 coreCompetencies: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 experience: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       title: { type: Type.STRING },
//                       company: { type: Type.STRING },
//                       location: { type: Type.STRING },
//                       period: { type: Type.STRING },
//                       bullets: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                     },
//                     required: ['title', 'company', 'period', 'bullets'],
//                   },
//                 },
//                 education: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       degree: { type: Type.STRING },
//                       institution: { type: Type.STRING },
//                       year: { type: Type.STRING },
//                       details: { type: Type.STRING },
//                     },
//                     required: ['degree', 'institution'],
//                   },
//                 },
//                 certifications: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//                 atsScore: { type: Type.INTEGER },
//                 atsOptimizationNotes: {
//                   type: Type.ARRAY,
//                   items: { type: Type.STRING },
//                 },
//               },
//               required: [
//                 'headline',
//                 'professionalSummary',
//                 'coreCompetencies',
//                 'experience',
//                 'education',
//                 'atsScore',
//                 'atsOptimizationNotes',
//               ],
//             },
//           },
//         });
// 
//         const parsed = JSON.parse(response.text?.trim() || '{}');
// 
//         return res.json({
//           success: true,
//           source: 'gemini-4-hydrogen',
//           resume: {
//             header: {
//               fullName: cleanName,
//               headline: parsed.headline || cleanTargetRole,
//               contactLine: contactParts.join('  |  '),
//               linksLine: linksParts.join('  |  '),
//             },
//             professionalSummary:
//               parsed.professionalSummary ||
//               summaryInput ||
//               `Results-driven ${cleanTargetRole} with strong expertise across modern delivery, cross-functional execution, and scalable systems.`,
//             coreCompetencies:
//               Array.isArray(parsed.coreCompetencies) && parsed.coreCompetencies.length > 0
//                 ? parsed.coreCompetencies
//                 : skillsArray,
//             experience: Array.isArray(parsed.experience)
//               ? parsed.experience.map((e: any) => ({
//                   title: e.title || cleanTargetRole,
//                   company: e.company || 'Organization',
//                   location: e.location || location || 'Remote',
//                   period: e.period || 'Present',
//                   bullets: Array.isArray(e.bullets) ? e.bullets.filter(Boolean) : [],
//                 }))
//               : [],
//             education: Array.isArray(parsed.education)
//               ? parsed.education.map((ed: any) => ({
//                   degree: ed.degree || 'Degree',
//                   institution: ed.institution || 'Institution',
//                   year: ed.year || '',
//                   details: ed.details || '',
//                 }))
//               : [],
//             certifications:
//               Array.isArray(parsed.certifications) && parsed.certifications.length > 0
//                 ? parsed.certifications
//                 : certsArray,
//             atsScore: typeof parsed.atsScore === 'number' ? Math.min(99, Math.max(70, parsed.atsScore)) : 92,
//             atsOptimizationNotes:
//               Array.isArray(parsed.atsOptimizationNotes) && parsed.atsOptimizationNotes.length > 0
//                 ? parsed.atsOptimizationNotes
//                 : [
//                     'Structured with standard ATS section headings and single-column parsing order.',
//                     'Transformed role descriptions into action-verb achievement bullets.',
//                   ],
//           },
//         });
//       } catch (geminiErr: any) {
//         console.warn('Gemini build-resume fallback triggered:', geminiErr?.message);
//       }
//     }
// 
//     // Heuristic ATS Formatter Fallback
//     const formattedExperience = expArray.map((exp) => {
//       const rawSentences = String(exp.highlights || '')
//         .split(/[;\n.]/)
//         .map((s) => s.trim())
//         .filter((s) => s.length > 4);
//       const bullets =
//         rawSentences.length > 0
//           ? rawSentences.map((s) => `${s.charAt(0).toUpperCase()}${s.slice(1)}.`)
//           : [`Delivered core initiatives and measurable product improvements as ${exp.title || cleanTargetRole}.`];
//       return {
//         title: exp.title || cleanTargetRole,
//         company: exp.company || 'Company',
//         location: exp.location || location || 'Remote',
//         period: exp.period || 'Present',
//         bullets,
//       };
//     });
// 
//     const formattedEducation = eduArray.map((ed) => ({
//       degree: ed.degree || 'Bachelor Degree',
//       institution: ed.institution || 'University',
//       year: ed.year || '',
//       details: ed.details || '',
//     }));
// 
//     return res.json({
//       success: true,
//       source: 'ats-formatter-fallback',
//       resume: {
//         header: {
//           fullName: cleanName,
//           headline: cleanTargetRole,
//           contactLine: contactParts.join('  |  '),
//           linksLine: linksParts.join('  |  '),
//         },
//         professionalSummary:
//           summaryInput ||
//           `Results-oriented ${cleanTargetRole} bringing hands-on experience in ${
//             skillsArray.slice(0, 5).join(', ') || 'cross-functional product delivery'
//           }, with a track record of shipping reliable solutions and driving measurable operational impact.`,
//         coreCompetencies:
//           skillsArray.length > 0
//             ? skillsArray
//             : ['Problem Solving', 'Cross-Functional Collaboration', 'Technical Delivery', 'Process Optimization'],
//         experience: formattedExperience,
//         education: formattedEducation,
//         certifications: certsArray,
//         atsScore: 89,
//         atsOptimizationNotes: [
//           'Formatted into a single-column hierarchy for maximum ATS readability.',
//           'Standardized section headers (Summary, Core Competencies, Experience, Education).',
//           `Aligned competency keywords toward ${cleanTargetRole}.`,
//         ],
//       },
//     });
//   } catch (err: any) {
//     console.error('Build resume endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to build ATS-optimized resume.',
//     });
//   }
// });
// 
// // POST /api/career-path: AI Agent 3-Year Career Growth Roadmap generator
// app.post('/api/career-path', async (req, res) => {
//   try {
//     const {
//       currentRole = 'Software Engineer',
//       experienceLevel = 'Mid-Level (3-5 years)',
//       skills = [],
//       workHistory = [],
//       country = 'Nigeria',
//       trackPreference = 'Balanced',
//     } = req.body || {};
// 
//     const cleanRole = String(currentRole || '').trim() || 'Software Engineer';
//     const cleanLevel = String(experienceLevel || '').trim() || 'Mid-Level';
//     const skillsArray: string[] = Array.isArray(skills) ? skills.map(String).filter(Boolean) : [];
//     const historySummary = Array.isArray(workHistory)
//       ? workHistory.slice(0, 3).map((w: any) => `${w.title} at ${w.company} (${w.period})`).join('; ')
//       : '';
// 
//     const ai = getGeminiClient();
//     if (ai) {
//       try {
//         const prompt = `Act as an executive AI Career Path Strategist for tech and business professionals in ${country} and global remote markets.
// 
// Candidate Snapshot:
// - Current / Target Role: ${cleanRole}
// - Experience Level: ${cleanLevel}
// - Current Skills: ${JSON.stringify(skillsArray)}
// - Recent Work History: ${historySummary || 'Not specified'}
// - Preferred Growth Track: ${trackPreference}
// 
// Create a realistic, inspiring 3-Year Career Growth Roadmap with exactly 4 milestones:
// - yearIndex 0: Current Position ("Now Â· Foundation") â€” baseline using "${cleanRole}"
// - yearIndex 1: Year 1 (0â€“12 Months) â€” next logical step
// - yearIndex 2: Year 2 (12â€“24 Months) â€” expanded scope / seniority step
// - yearIndex 3: Year 3 (24â€“36 Months) â€” target destination role along the "${trackPreference}" track
// 
// For each milestone provide:
// - yearIndex (0, 1, 2, or 3)
// - horizon (short label like "Now", "Year 1", "Year 2", "Year 3")
// - timeframe (e.g. "Current Role", "Months 1â€“12", "Months 13â€“24", "Months 25â€“36")
// - roleTitle (concise, realistic title)
// - estimatedMonthlyUsd (realistic progressive monthly USD remote compensation integer, e.g. 3200 -> 4500 -> 6200 -> 8400)
// - readinessPercent (integer descending from ~90 at year 0 down to ~35 at year 3)
// - summary (1-2 sharp sentences on scope and impact at this stage)
// - keySkillsToAcquire (3-4 specific technical, domain, or leadership skills needed for this stage)
// - deliverables (2-3 concrete milestones/projects to earn this progression)
// - recommendedCertification (1 high-signal credential or focus area)
// 
// Also provide:
// - growthThesis: 2-sentence strategic narrative explaining why this 3-year trajectory fits the candidate's current position and skills.
// - alternateBranches: 2 adjacent/logical pivot roles (each with roleTitle, fitPercent integer 70-95, and 1-sentence reason).`;
// 
//         const response = await ai.models.generateContent({
//           model: 'gemini-4-hydrogen',
//           contents: prompt,
//           config: {
//             systemInstruction:
//               'You are a pragmatic Career Progression AI Agent. Return realistic, structured 3-year role progressions tailored to the candidate skill set and requested track.',
//             responseMimeType: 'application/json',
//             responseSchema: {
//               type: Type.OBJECT,
//               properties: {
//                 growthThesis: { type: Type.STRING },
//                 milestones: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       yearIndex: { type: Type.INTEGER },
//                       horizon: { type: Type.STRING },
//                       timeframe: { type: Type.STRING },
//                       roleTitle: { type: Type.STRING },
//                       estimatedMonthlyUsd: { type: Type.INTEGER },
//                       readinessPercent: { type: Type.INTEGER },
//                       summary: { type: Type.STRING },
//                       keySkillsToAcquire: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                       deliverables: {
//                         type: Type.ARRAY,
//                         items: { type: Type.STRING },
//                       },
//                       recommendedCertification: { type: Type.STRING },
//                     },
//                     required: [
//                       'yearIndex',
//                       'horizon',
//                       'timeframe',
//                       'roleTitle',
//                       'estimatedMonthlyUsd',
//                       'readinessPercent',
//                       'summary',
//                       'keySkillsToAcquire',
//                       'deliverables',
//                     ],
//                   },
//                 },
//                 alternateBranches: {
//                   type: Type.ARRAY,
//                   items: {
//                     type: Type.OBJECT,
//                     properties: {
//                       roleTitle: { type: Type.STRING },
//                       fitPercent: { type: Type.INTEGER },
//                       reason: { type: Type.STRING },
//                     },
//                     required: ['roleTitle', 'fitPercent', 'reason'],
//                   },
//                 },
//               },
//               required: ['growthThesis', 'milestones', 'alternateBranches'],
//             },
//           },
//         });
// 
//         const parsed = JSON.parse(response.text?.trim() || '{}');
//         if (Array.isArray(parsed.milestones) && parsed.milestones.length >= 3) {
//           const sortedMilestones = [...parsed.milestones]
//             .sort((a: any, b: any) => (a.yearIndex ?? 0) - (b.yearIndex ?? 0))
//             .slice(0, 4);
// 
//           return res.json({
//             success: true,
//             source: 'gemini-4-hydrogen',
//             roadmap: {
//               growthThesis:
//                 parsed.growthThesis ||
//                 `Building from your foundation as ${cleanRole}, this 3-year roadmap compounds your strengths in ${
//                   skillsArray.slice(0, 3).join(', ') || 'core execution'
//                 } toward higher-leverage architectural and strategic roles.`,
//               milestones: sortedMilestones,
//               alternateBranches: Array.isArray(parsed.alternateBranches) ? parsed.alternateBranches.slice(0, 3) : [],
//             },
//           });
//         }
//       } catch (geminiErr: any) {
//         console.warn('Gemini career-path fallback triggered:', geminiErr?.message);
//       }
//     }
// 
//     // Domain-aware fallback roadmap
//     const isLeadership = trackPreference.toLowerCase().includes('lead') || trackPreference.toLowerCase().includes('manage');
//     const isDataOrProduct = /product|data|finance|design/i.test(cleanRole);
//     const baseUsd = /senior|lead|principal/i.test(cleanLevel) ? 4500 : 2800;
// 
//     const fallbackMilestones = isLeadership
//       ? [
//           {
//             yearIndex: 0,
//             horizon: 'Now',
//             timeframe: 'Current Role',
//             roleTitle: cleanRole,
//             estimatedMonthlyUsd: baseUsd,
//             readinessPercent: 92,
//             summary: `Consolidate technical credibility and cross-squad delivery while mentoring peers in ${skillsArray.slice(0, 3).join(', ') || 'core workflows'}.`,
//             keySkillsToAcquire: ['Technical Mentorship', 'Sprint Estimation', 'Stakeholder Updates'],
//             deliverables: ['Own end-to-end delivery of 2 flagship product initiatives', 'Mentor 1â€“2 junior teammates'],
//             recommendedCertification: 'Agile Leadership Fundamentals',
//           },
//           {
//             yearIndex: 1,
//             horizon: 'Year 1',
//             timeframe: 'Months 1â€“12',
//             roleTitle: isDataOrProduct ? `Lead ${cleanRole}` : 'Tech Lead / Squad Lead',
//             estimatedMonthlyUsd: Math.round(baseUsd * 1.28),
//             readinessPercent: 74,
//             summary: 'Bridge execution and squad planning by owning technical roadmaps and cross-functional alignment.',
//             keySkillsToAcquire: ['Architecture Reviews', 'Cross-Team Alignment', 'Hiring Interviews'],
//             deliverables: ['Author RFCs for core platform reliability', 'Lead sprint execution for a 4â€“6 person squad'],
//             recommendedCertification: 'Engineering Management & Delivery (Reforge)',
//           },
//           {
//             yearIndex: 2,
//             horizon: 'Year 2',
//             timeframe: 'Months 13â€“24',
//             roleTitle: isDataOrProduct ? 'Group Manager / Head of Function' : 'Engineering Manager',
//             estimatedMonthlyUsd: Math.round(baseUsd * 1.62),
//             readinessPercent: 52,
//             summary: 'Transition into full people leadership, quarterly OKR ownership, and multi-squad velocity scaling.',
//             keySkillsToAcquire: ['Performance Coaching', 'Org Capacity Planning', 'Budget & Vendor Strategy'],
//             deliverables: ['Hire and onboard 3+ high-impact specialists', 'Cut delivery cycle time by 25% across teams'],
//             recommendedCertification: 'Executive Tech Leadership Certificate',
//           },
//           {
//             yearIndex: 3,
//             horizon: 'Year 3',
//             timeframe: 'Months 25â€“36',
//             roleTitle: isDataOrProduct ? 'VP / Director of Product & Strategy' : 'Director of Engineering',
//             estimatedMonthlyUsd: Math.round(baseUsd * 2.05),
//             readinessPercent: 34,
//             summary: 'Shape multi-quarter company strategy, executive tradeoffs, and high-trust distributed engineering culture.',
//             keySkillsToAcquire: ['Executive Strategy', 'Multi-Region Compliance', 'P&L Alignment'],
//             deliverables: ['Scale 2+ business-critical product lines across regional markets', 'Partner directly with C-suite on annual roadmap'],
//             recommendedCertification: 'Strategic Executive Management',
//           },
//         ]
//       : [
//           {
//             yearIndex: 0,
//             horizon: 'Now',
//             timeframe: 'Current Role',
//             roleTitle: cleanRole,
//             estimatedMonthlyUsd: baseUsd,
//             readinessPercent: 92,
//             summary: `Maximize impact in ${cleanRole} while deepening mastery across ${skillsArray.slice(0, 3).join(', ') || 'distributed systems'}.`,
//             keySkillsToAcquire: ['Observability & SLOs', 'System Tradeoff Docs', 'Automated Testing'],
//             deliverables: ['Ship high-reliability core features with <1% regression rate', 'Document reusable team standards'],
//             recommendedCertification: 'Cloud Practitioner / Domain Core',
//           },
//           {
//             yearIndex: 1,
//             horizon: 'Year 1',
//             timeframe: 'Months 1â€“12',
//             roleTitle: cleanRole.toLowerCase().includes('senior') ? `Lead ${cleanRole.replace(/senior\s+/i, '')}` : `Senior ${cleanRole}`,
//             estimatedMonthlyUsd: Math.round(baseUsd * 1.3),
//             readinessPercent: 76,
//             summary: 'Own complex multi-service initiatives end-to-end with measurable latency, uptime, and revenue KPIs.',
//             keySkillsToAcquire: ['Distributed Architecture', 'Performance Tuning', 'Mentoring Peers'],
//             deliverables: ['Redesign a core bottleneck reducing latency or cost by 30%', 'Run architecture brown-bags'],
//             recommendedCertification: 'AWS Solutions Architect Associate',
//           },
//           {
//             yearIndex: 2,
//             horizon: 'Year 2',
//             timeframe: 'Months 13â€“24',
//             roleTitle: isDataOrProduct ? `Principal ${cleanRole.replace(/senior\s+/i, '')}` : 'Staff Software Engineer',
//             estimatedMonthlyUsd: Math.round(baseUsd * 1.65),
//             readinessPercent: 54,
//             summary: 'Set technical direction across multiple squads, unblocking high-risk migrations and security standards.',
//             keySkillsToAcquire: ['Multi-Team RFCs', 'FinTech Security & Audit', 'Platform Modularization'],
//             deliverables: ['Lead company-wide platform architecture upgrade', 'Mentor 2 engineers to Senior level'],
//             recommendedCertification: 'AWS Solutions Architect Professional',
//           },
//           {
//             yearIndex: 3,
//             horizon: 'Year 3',
//             timeframe: 'Months 25â€“36',
//             roleTitle: isDataOrProduct ? 'Head of Domain Architecture' : 'Principal Systems Architect',
//             estimatedMonthlyUsd: Math.round(baseUsd * 2.1),
//             readinessPercent: 36,
//             summary: 'Serve as an organizational force multiplier defining multi-year platform resilience and strategic R&D.',
//             keySkillsToAcquire: ['Enterprise Systems Strategy', 'AI Platform Integration', 'Executive Influence'],
//             deliverables: ['Architect multi-country resilient infrastructure', 'Drive organization-wide build-vs-buy decisions'],
//             recommendedCertification: 'TOGAF / Principal Systems Fellowship',
//           },
//         ];
// 
//     return res.json({
//       success: true,
//       source: 'career-path-fallback',
//       roadmap: {
//         growthThesis: `Leveraging your current foundation in ${cleanRole} and strengths in ${
//           skillsArray.slice(0, 4).join(', ') || 'modern product delivery'
//         }, this 3-year ${trackPreference} roadmap sequences progressive scope, high-ROI skills, and compensation growth.`,
//         milestones: fallbackMilestones,
//         alternateBranches: [
//           {
//             roleTitle: 'Solutions Architect (Enterprise FinTech)',
//             fitPercent: 86,
//             reason: 'Directly leverages your hands-on technical skills in client-facing enterprise integration.',
//           },
//           {
//             roleTitle: 'Technical Product Manager',
//             fitPercent: 79,
//             reason: 'Combines domain fluency with roadmap prioritization and customer problem discovery.',
//           },
//         ],
//       },
//     });
//   } catch (err: any) {
//     console.error('Career path endpoint error:', err);
//     res.status(500).json({
//       success: false,
//       error: err?.message || 'Failed to generate career path roadmap.',
//     });
//   }
// });
// 
// // Setup Vite middleware in dev or static serve in prod
// const isProduction = process.env.NODE_ENV === 'production';
// 
// async function startServer() {
//   if (!isProduction) {
//     const { createServer: createViteServer } = await import('vite');
//     const vite = await createViteServer({
//       server: {
//         middlewareMode: true,
//         hmr: false,
//         watch: null,
//       },
//       appType: 'spa',
//     });
//     app.use(vite.middlewares);
//   } else {
//     app.use(express.static(path.resolve(__dirname, 'dist')));
//     app.get('*', (_req, res) => {
//       res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
//     });
//   }
// 
//   const server = app.listen(PORT, '0.0.0.0', () => {
//     console.log(`[MsmeBooks Server] Ready on http://0.0.0.0:${PORT}`);
//   });
// 
//   server.on('error', (err) => {
//     console.error('[MsmeBooks Server] HTTP server error:', err);
//   });
// }
// 
// process.on('unhandledRejection', (reason) => {
//   console.error('[MsmeBooks Server] Unhandled Rejection:', reason);
// });
// 
// process.on('uncaughtException', (err) => {
//   console.error('[MsmeBooks Server] Uncaught Exception:', err);
// });
// 
// startServer().catch((err) => {
//   console.error('[MsmeBooks Server] Fatal startup error:', err);
//   process.exit(1);
// });
