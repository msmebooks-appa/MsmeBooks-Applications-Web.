import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  CheckCircle2, 
  ShieldCheck, 
  Search, 
  Filter, 
  Sparkles, 
  Calendar, 
  Building2, 
  Share2, 
  ArrowRight,
  HelpCircle,
  TrendingUp,
  Tag
} from 'lucide-react';
import { PROFESSIONAL_FIRMS } from '../data/firmsData';

interface ForumQuestion {
  id: string;
  topic: string;
  title: string;
  body: string;
  author: string;
  businessType: string;
  date: string;
  views: number;
  upvotes: number;
  answer: {
    firmId: string;
    firmName: string;
    firmTier: string;
    firmCategory: string;
    answeredBy: string;
    accreditation: string;
    body: string;
    date: string;
    upvotes: number;
  };
}

const INITIAL_FORUM_QUESTIONS: ForumQuestion[] = [
  {
    id: 'q-1',
    topic: 'Tax Law & Compliance',
    title: 'How does the new withholding tax (WHT) deduction exemption apply to retail MSMEs in Nigeria?',
    body: 'We operate a multi-branch supermarket in Ikeja and purchase wholesale goods from various suppliers. Do we deduct WHT on wholesale inventory purchases, and what is the current threshold under the 2024–2026 gazetted regulations?',
    author: 'Emeka O.',
    businessType: 'Retail Supermarket',
    date: '2026-10-19',
    views: 412,
    upvotes: 38,
    answer: {
      firmId: 'firm-cedar',
      firmName: 'Cedar Professional Services Limited',
      firmTier: 'Platinum Partner',
      firmCategory: 'Chartered Accounting Firm',
      answeredBy: 'Tunde Bakare, FCA, FCTI',
      accreditation: 'ICAN Practice License No. 4218',
      body: 'Under the revised Nigerian Withholding Tax Regulations, transactions involving goods manufactured or purchased in the ordinary course of business (such as wholesale grocery inventory) are explicitly exempt from WHT deductions. Furthermore, small businesses with annual turnover under ₦50M are exempted from deducting WHT on eligible vendor invoices. Always maintain electronic proof of purchase within MsmeBooks to substantiate exemptions during state/FIRS desk audits.',
      date: '2026-10-20',
      upvotes: 45,
    }
  },
  {
    id: 'q-2',
    topic: 'Cloud POS & Hardware',
    title: 'Which thermal receipt printer and barcode scanner pair best with MsmeBooks offline checkout mode?',
    body: 'We experience frequent telecom internet fluctuations in our retail branch. If our connection drops, will the USB barcode scanner and 80mm ESC/POS printer continue printing customer receipts offline without duplicate order numbers?',
    author: 'Faith K.',
    businessType: 'Pharmacy & Supermarket',
    date: '2026-10-15',
    views: 298,
    upvotes: 27,
    answer: {
      firmId: 'firm-apex',
      firmName: 'Apex Cloud Systems & Implementations',
      firmTier: 'Certified Implementation Partner',
      answeredBy: 'Chinedu Eze, Lead Hardware Systems Architect',
      accreditation: 'Certified POS Hardware Engineer',
      firmCategory: 'Certified Implementation Partner',
      body: 'Yes. MsmeBooks Cloud POS utilizes an IndexedDB local offline cache. Standard USB or Ethernet ESC/POS 80mm printers (Epson, Xprinter, Sunmi) continue generating offline sequential receipt numbers. As soon as connectivity is restored, the local buffer automatically syncs back with the cloud inventory ledger, preventing duplicate serials.',
      date: '2026-10-16',
      upvotes: 32,
    }
  },
  {
    id: 'q-3',
    topic: 'Payroll & Pensions',
    title: 'What are the employer statutory remittance deadlines for PAYE and PenCom in Lagos and Kenya?',
    body: 'We have 14 full-time staff and casual inventory stockers. What are the strict monthly calendar deadlines to avoid statutory non-compliance fines?',
    author: 'Kofi Mensah',
    businessType: 'Logistics & FMCG Distribution',
    date: '2026-10-10',
    views: 520,
    upvotes: 49,
    answer: {
      firmId: 'firm-msme-direct',
      firmName: 'MsmeBooks In-House Advisory Team',
      firmTier: 'Official Core Team',
      answeredBy: 'Amina Bello, Head of Payroll Regulatory Services',
      accreditation: 'Chartered Institute of Taxation (CITN)',
      firmCategory: 'Tax & Regulatory Advisory',
      body: 'In Nigeria (Lagos LIRS), PAYE remittances must be paid on or before the 10th day of the following month, while PenCom pensions (10% employer + 8% employee) must be remitted within 7 business days of salary payment. In Kenya, KRA PAYE and NSSF/SHIF must be remitted by the 9th of every month. MsmeBooks Payroll module automates these schedules with 48-hour email & WhatsApp threshold alerts.',
      date: '2026-10-11',
      upvotes: 58,
    }
  },
  {
    id: 'q-4',
    topic: 'Audit & Financial Reporting',
    title: 'What documents are required to turn an unorganized SME bank statement into audit-ready financial statements?',
    body: 'We have 2 years of bank PDF statements, POS settlement reports, and paper supplier receipts. Can a partner firm rebuild our balance sheet for a commercial bank credit line?',
    author: 'David Omondi',
    businessType: 'Manufacturing & Agro-processing',
    date: '2026-10-05',
    views: 340,
    upvotes: 31,
    answer: {
      firmId: 'firm-cedar',
      firmName: 'Cedar Professional Services Limited',
      firmTier: 'Platinum Partner',
      answeredBy: 'Tunde Bakare, FCA',
      accreditation: 'ICAN Registered Forensic Auditor',
      firmCategory: 'Chartered Accounting Firm',
      body: 'Yes, this is our core specialization in "Books Reconstruction". We ingest the bank statement CSVs into MsmeBooks, match POS settlement batches against daily gross receipts, classify expense vouchers, and prepare an IFRS for SMEs compliant Statement of Financial Position, Profit & Loss, and Cash Flows that commercial lenders and tax authorities accept.',
      date: '2026-10-06',
      upvotes: 39,
    }
  }
];

export const CommunityForumSection: React.FC<{ onAskQuestionClick: () => void }> = ({ onAskQuestionClick }) => {
  const [questions, setQuestions] = useState<ForumQuestion[]>(INITIAL_FORUM_QUESTIONS);
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userUpvoted, setUserUpvoted] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const topics = ['All', 'Tax Law & Compliance', 'Cloud POS & Hardware', 'Payroll & Pensions', 'Audit & Financial Reporting'];

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      if (selectedTopic !== 'All' && q.topic !== selectedTopic) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = q.title.toLowerCase().includes(query);
        const matchesBody = q.body.toLowerCase().includes(query);
        const matchesAnswer = q.answer.body.toLowerCase().includes(query);
        return matchesTitle || matchesBody || matchesAnswer;
      }
      return true;
    });
  }, [questions, selectedTopic, searchQuery]);

  const handleUpvoteAnswer = (qId: string) => {
    if (userUpvoted[qId]) return;
    setQuestions(prev => prev.map(q => {
      if (q.id === qId) {
        return {
          ...q,
          answer: {
            ...q.answer,
            upvotes: q.answer.upvotes + 1,
          }
        };
      }
      return q;
    }));
    setUserUpvoted(prev => ({ ...prev, [qId]: true }));
  };

  const handleShareQuestion = (q: ForumQuestion) => {
    const text = `${q.title} - Answered by ${q.answer.firmName} on MsmeBooks Professional Community`;
    if (navigator.share) {
      navigator.share({
        title: q.title,
        text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setCopiedId(q.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <section id="community-forum" className="py-16 bg-[#F8FAFC] dark:bg-[#060F1A] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/70 text-[#1464C8] dark:text-[#B7E532] text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Pan-African Knowledge Base & SEO Hub
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
              Professional Community Forum
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base mt-1.5 max-w-2xl font-normal">
              Direct technical and regulatory answers authored by accredited chartered accountants, tax attorneys, and certified cloud ERP engineers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAskQuestionClick}
              className="px-5 py-3 rounded-xl bg-[#1464C8] hover:bg-[#1052a5] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer shrink-0"
            >
              <MessageSquare className="w-4 h-4 text-[#B7E532]" />
              <span>Ask a Technical Question</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-[#0A1727] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Topic Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {topics.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedTopic === t
                    ? 'bg-[#1464C8] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tax, POS, CIT, payroll..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#1464C8]"
            />
          </div>

        </div>

        {/* Questions & Verified Answers Cards */}
        <div className="space-y-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#0A1727] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">No matching forum questions found</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Be the first to ask this question! Submit your inquiry to our verified partner firms.
              </p>
              <button
                onClick={onAskQuestionClick}
                className="mt-4 px-4 py-2 bg-[#1464C8] text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Submit New Technical Question
              </button>
            </div>
          ) : (
            filteredQuestions.map((q) => (
              <div
                key={q.id}
                className="bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs hover:shadow-md transition-shadow"
              >
                {/* Question Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] px-2.5 py-0.5 rounded-full">
                      {q.topic}
                    </span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Asked by <strong className="text-slate-700 dark:text-slate-200">{q.author}</strong> ({q.businessType})
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span>{q.views} views</span>
                    <button
                      onClick={() => handleShareQuestion(q)}
                      className="hover:text-[#1464C8] dark:hover:text-[#B7E532] flex items-center gap-1 cursor-pointer"
                      title="Share this answer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedId === q.id ? 'Copied Link' : 'Share'}</span>
                    </button>
                  </div>
                </div>

                <h3 className="text-base sm:text-lg font-black text-[#102B4E] dark:text-white leading-snug">
                  {q.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed font-normal">
                  {q.body}
                </p>

                {/* Verified Partner Firm's Answer Box */}
                <div className="mt-5 p-5 rounded-2xl bg-slate-50 dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#1464C8] text-white font-black text-xs flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#B7E532]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <strong className="text-[#102B4E] dark:text-white">{q.answer.answeredBy}</strong>
                          <span className="text-slate-400">•</span>
                          <span className="font-semibold text-slate-600 dark:text-slate-300">{q.answer.firmName}</span>
                          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.2 rounded">
                            Verified Firm
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                          {q.answer.accreditation}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Answered on {q.answer.date}
                    </div>
                  </div>

                  {/* Answer Text */}
                  <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-normal">
                    {q.answer.body}
                  </p>

                  {/* Upvote & Action Row */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleUpvoteAnswer(q.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        userUpvoted[q.id]
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-[#1464C8] dark:text-[#B7E532]'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>Helpful Answer ({q.answer.upvotes})</span>
                    </button>

                    <button
                      onClick={onAskQuestionClick}
                      className="text-xs text-[#1464C8] dark:text-[#B7E532] font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Ask Follow-up to this Firm</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </section>
  );
};
