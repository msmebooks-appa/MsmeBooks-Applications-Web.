import React, { useState, useEffect } from 'react';
import {
  Search,
  Sparkles,
  Globe,
  ExternalLink,
  Copy,
  Check,
  BookOpen,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Mic,
  TrendingUp,
  Briefcase,
  Layers,
  Lightbulb,
  RefreshCw,
  SlidersHorizontal,
  ArrowRight,
  Award,
  Filter,
  DollarSign,
  Share2,
} from 'lucide-react';

interface GroundedQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  whyAsked: string;
  modelAnswerFramework: string;
  keyTermsToMention: string[];
  commonPitfall: string;
}

interface RoleSpecificTip {
  title: string;
  category: string;
  advice: string;
  proTip: string;
}

interface GroundingSource {
  webSearchUrl?: string;
  title?: string;
  domain?: string;
}

interface InterviewPreparationData {
  searchSummary: string;
  marketTrends2026: string[];
  industryStandardQuestions: GroundedQuestion[];
  roleSpecificTips: RoleSpecificTip[];
  questionsToAskInterviewer: string[];
  salaryAndNegotiationInsight: string;
}

interface InterviewPreparationSectionProps {
  onSelectPracticeQuestion: (question: string) => void;
  defaultRole?: string;
  defaultIndustry?: string;
}

const POPULAR_ROLES = [
  'Senior Fullstack Engineer',
  'Principal Backend Architect',
  'Lead Product Manager',
  'Staff Cloud & DevOps Engineer',
  'FinTech Accounting Specialist',
  'Mobile Android / Flutter Lead',
];

const INDUSTRIES = [
  'FinTech & Payments',
  'B2B SaaS & ERP',
  'Digital Commerce & Retail',
  'Supply Chain & Logistics',
  'Banking & Financial Services',
  'HealthTech & InsurTech',
];

const SENIORITY_LEVELS = ['Junior', 'Mid-Level', 'Senior', 'Staff / Principal', 'Engineering Manager'];

export const InterviewPreparationSection: React.FC<InterviewPreparationSectionProps> = ({
  onSelectPracticeQuestion,
  defaultRole = 'Senior Software Engineer',
  defaultIndustry = 'FinTech & Payments',
}) => {
  const [role, setRole] = useState(defaultRole);
  const [industry, setIndustry] = useState(defaultIndustry);
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [company, setCompany] = useState('MsmeBooks');
  const [customQuery, setCustomQuery] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'System Architecture',
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<InterviewPreparationData | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [webSearchQueries, setWebSearchQueries] = useState<string[]>([]);
  const [isGrounded, setIsGrounded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Filters & search for questions list
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [questionSearch, setQuestionSearch] = useState('');
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showConfigDrawer, setShowConfigDrawer] = useState(false);

  // Initial load
  useEffect(() => {
    fetchInterviewPrep();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInterviewPrep = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/interview-preparation-grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          industry,
          experienceLevel,
          company,
          skills: selectedSkills,
          customQuery,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
        setIsGrounded(Boolean(json.groundingMetadata?.grounded));
        setGroundingSources(json.groundingMetadata?.sources || []);
        setWebSearchQueries(json.groundingMetadata?.webSearchQueries || []);
        setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        // Expand first question by default
        if (json.data.industryStandardQuestions?.length > 0) {
          setExpandedQuestionId(json.data.industryStandardQuestions[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch grounded interview prep:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !selectedSkills.includes(newSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skillToRemove));
  };

  // Filtered questions
  const filteredQuestions = (data?.industryStandardQuestions || []).filter((q) => {
    const matchesCategory =
      selectedCategory === 'all' || q.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      !questionSearch.trim() ||
      q.question.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.modelAnswerFramework.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.keyTermsToMention?.some((t) => t.toLowerCase().includes(questionSearch.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = Array.from(
    new Set((data?.industryStandardQuestions || []).map((q) => q.category))
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Search Grounding Indicator & Target Selector */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/30 dark:from-[#0B1528] dark:to-[#142342] p-5 rounded-2xl border border-blue-200/50 dark:border-blue-900/40 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-[#0066CC] dark:bg-blue-950 dark:text-[#38BDF8] border border-blue-300 dark:border-blue-800">
                <Globe className="w-3.5 h-3.5" />
                <span>Google Search Grounded</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#B5E61D]/20 text-emerald-800 dark:text-[#B5E61D] border border-[#B5E61D]/40">
                <Sparkles className="w-3 h-3" />
                <span>2025/2026 Hiring Evaluation Standards</span>
              </span>
              {lastUpdated && (
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Updated at {lastUpdated}
                </span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Industry-Standard Interview Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
              Live web-grounded technical questions, high-signal evaluation rubrics, STAR frameworks, and company-specific tips for <strong className="text-slate-900 dark:text-white font-semibold">{role}</strong> in <strong className="text-slate-900 dark:text-white font-semibold">{industry}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowConfigDrawer(!showConfigDrawer)}
              className="px-3 py-2 text-xs font-bold rounded-xl bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#20325A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Target Role Setup</span>
              {showConfigDrawer ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              onClick={fetchInterviewPrep}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0066CC] hover:bg-[#0052A3] disabled:opacity-50 text-white shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Grounding Web Data...' : 'Re-Ground with Live Web'}</span>
            </button>
          </div>
        </div>

        {/* Quick Role Badges */}
        <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 shrink-0">
            Fast Select:
          </span>
          {POPULAR_ROLES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                setRole(r);
                if (r.includes('Product')) setIndustry('FinTech & Payments');
                if (r.includes('Accounting')) setIndustry('B2B SaaS & ERP');
              }}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                role === r
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Target Configuration Collapsible Drawer */}
      {showConfigDrawer && (
        <div className="p-5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md animate-in fade-in duration-150 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
              <span>Customize Search Grounding Parameters</span>
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Refines search grounding query to retrieve exact questions
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Role */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Backend Engineer"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Industry
              </label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind}
                  </option>
                ))}
              </select>
            </div>

            {/* Seniority */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Seniority Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              >
                {SENIORITY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            {/* Target Company */}
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Company Context
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. MsmeBooks / Paystack / Flutterwave"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
            </div>
          </div>

          {/* Skills Chips Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Technologies & Evaluation Focus
            </label>
            <div className="flex flex-wrap gap-1.5 items-center mb-2">
              {selectedSkills.map((sk) => (
                <span
                  key={sk}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span>{sk}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(sk)}
                    className="text-slate-400 hover:text-red-500 transition-colors ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-md">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Add skill (e.g. Kafka, Redis, Docker)..."
                className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 text-xs font-bold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Custom Search Query Override */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Custom Focus Area (Optional)
            </label>
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder="e.g. Focus on distributed event sourcing and multi-tenant ledger security"
              className="w-full px-3 py-2 text-xs bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => {
                setShowConfigDrawer(false);
                fetchInterviewPrep();
              }}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-[#0066CC] hover:bg-[#0052A3] text-white transition-colors cursor-pointer"
            >
              Apply & Search Live Web
            </button>
          </div>
        </div>
      )}

      {/* Grounding Sources & Search Queries Verified Citations */}
      {(groundingSources.length > 0 || webSearchQueries.length > 0) && (
        <div className="p-3.5 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-bold">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              <span>Grounding Sources & Queries Executed:</span>
            </div>
            {webSearchQueries.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                {webSearchQueries.map((q, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-[#0066CC] dark:text-[#38BDF8] border border-blue-200 dark:border-blue-900"
                  >
                    "{q}"
                  </span>
                ))}
              </div>
            )}
          </div>

          {groundingSources.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
              <span className="text-[11px] text-slate-400 shrink-0">Live Citations:</span>
              {groundingSources.map((src, idx) => (
                <a
                  key={idx}
                  href={src.webSearchUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-[#1A284A] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-[#0066CC] dark:hover:text-[#38BDF8] hover:border-[#0066CC] transition-colors shrink-0 font-medium text-[11px]"
                >
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                  <span className="max-w-[180px] truncate">{src.title || src.domain || 'Tech Industry Report'}</span>
                  {src.domain && (
                    <span className="text-[10px] text-slate-400 font-mono">({src.domain})</span>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Market Trends 2026 & Search Summary */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Search Summary */}
          <div className="lg:col-span-2 p-4 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#B5E61D]" />
              <span>Current Evaluation Landscape</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {data.searchSummary}
            </p>

            {data.salaryAndNegotiationInsight && (
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <DollarSign className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-snug">{data.salaryAndNegotiationInsight}</span>
              </div>
            )}
          </div>

          {/* 2026 Market Trends */}
          <div className="p-4 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 mb-2">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>2026 Hiring Priorities</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {(data.marketTrends2026 || []).map((trend, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span className="leading-tight">{trend}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Questions Section */}
      <div className="space-y-4">
        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#0066CC] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Questions ({data?.industryStandardQuestions?.length || 0})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-[#0066CC] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={questionSearch}
              onChange={(e) => setQuestionSearch(e.target.value)}
              placeholder="Search questions or terms..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-[#131D35] border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-16 text-center bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="inline-flex p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8] animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              Searching Google for latest {role} interview standards...
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Scanning real-world questions, architecture trade-offs, and 2026 recruiter assessment signals across global and Pan-African tech hubs.
            </p>
          </div>
        )}

        {/* Question Cards List */}
        {!isLoading && filteredQuestions.length === 0 && (
          <div className="p-8 text-center bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-900 dark:text-white">
              No questions found matching your filter
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Try changing category or clearing your search query.
            </p>
          </div>
        )}

        {!isLoading &&
          filteredQuestions.map((q, idx) => {
            const isExpanded = expandedQuestionId === q.id;
            const isCopied = copiedId === q.id;

            return (
              <div
                key={q.id || idx}
                className="bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800/90 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Question Header Card */}
                <div
                  onClick={() => setExpandedQuestionId(isExpanded ? null : q.id)}
                  className="p-5 flex items-start justify-between gap-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-[#111A30] transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 dark:bg-blue-950 text-[#0066CC] dark:text-[#38BDF8]">
                        {q.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
                          q.difficulty === 'Expert'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300'
                            : q.difficulty === 'Advanced'
                            ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                            : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-slate-400">Question #{idx + 1}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      "{q.question}"
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                      <strong className="font-semibold text-slate-700 dark:text-slate-300">Why Asked:</strong>{' '}
                      {q.whyAsked}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyText(q.id, q.question);
                      }}
                      className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Copy Question"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <div className="p-1 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details: Model Framework, Key Signals, Pitfalls & Practice CTA */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-[#0A1020] space-y-4 text-xs">
                    {/* Why this is high signal */}
                    <div className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                      <div className="font-bold text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        <span>Why Interviewers Ask This in 2026:</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                        {q.whyAsked}
                      </p>
                    </div>

                    {/* Model Answer Framework */}
                    <div className="p-3.5 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-200/70 dark:border-blue-900/60">
                      <div className="font-bold text-[#0066CC] dark:text-[#38BDF8] mb-1.5 flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Structured Model Answer Framework:</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-normal">
                        {q.modelAnswerFramework}
                      </p>
                    </div>

                    {/* Key Terms To Mention & Common Pitfall */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Key Terms */}
                      <div className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                        <div className="font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Key Terms & Signals to Mention:</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {(q.keyTermsToMention || []).map((term, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                            >
                              {term}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Common Pitfall */}
                      <div className="p-3 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                        <div className="font-bold text-rose-700 dark:text-rose-300 mb-1 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Frequent Pitfall / Red Flag:</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                          {q.commonPitfall}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Actions: Practice in Mock Interview */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <span className="text-[11px] text-slate-400">
                        Ready to rehearse your delivery under realistic conditions?
                      </span>

                      <button
                        type="button"
                        onClick={() => onSelectPracticeQuestion(q.question)}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Practice in AI Mock Interview (Timer + Mic)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Role-Specific Preparation Tips & Pro Insights */}
      {data && data.roleSpecificTips?.length > 0 && (
        <div className="p-5 bg-white dark:bg-[#0D1527] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0066CC] dark:text-[#38BDF8]" />
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Industry Standard Preparation Strategies ({role})
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {data.roleSpecificTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-[#111A30] rounded-xl border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#0066CC] dark:text-[#38BDF8]">
                      {tip.category}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">Tip #{idx + 1}</span>
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1.5">
                    {tip.title}
                  </h5>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                    {tip.advice}
                  </p>
                </div>

                {tip.proTip && (
                  <div className="p-2.5 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg border border-amber-200/80 dark:border-amber-900/50">
                    <span className="font-extrabold text-amber-800 dark:text-amber-300 block mb-0.5 text-[11px]">
                      ⚡ Top 1% Pro Tip:
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-snug">
                      {tip.proTip}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* High-Signal Questions to Ask the Interviewer */}
      {data && data.questionsToAskInterviewer?.length > 0 && (
        <div className="p-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white rounded-2xl border border-slate-700/80 shadow-md">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B5E61D]" />
              <h4 className="text-sm sm:text-base font-extrabold">
                Questions You Should Ask the Interviewer
              </h4>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
              High-Signal Reverse Interviewing
            </span>
          </div>

          <p className="text-xs text-slate-300 mb-4">
            Demonstrate strategic product thinking and engineering seniority by asking these questions when the interviewer asks: "Do you have any questions for us?"
          </p>

          <div className="space-y-2.5">
            {data.questionsToAskInterviewer.map((q, idx) => (
              <div
                key={idx}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 flex items-start justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#B5E61D] text-slate-900 font-bold flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200 leading-relaxed font-medium">"{q}"</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyText(`rev-${idx}`, q)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors shrink-0 cursor-pointer"
                  title="Copy question"
                >
                  {copiedId === `rev-${idx}` ? (
                    <Check className="w-4 h-4 text-[#B5E61D]" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
