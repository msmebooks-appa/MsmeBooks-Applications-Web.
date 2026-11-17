import React, { useState } from 'react';
import {
  BookOpen,
  Building2,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Shield,
  Video,
  DollarSign,
  Copy,
  Check,
  Search,
  ExternalLink,
} from 'lucide-react';

export interface IndustryKnowledgeBase {
  id: string;
  name: string;
  tagline: string;
  etiquette: {
    title: string;
    points: string[];
    proTip: string;
  };
  commonQuestions: {
    question: string;
    category: string;
    whyAsked: string;
    modelAnswerOutline: string;
    keyBuzzwords: string[];
  }[];
  negotiationStrategies: {
    tacticTitle: string;
    description: string;
    suggestedScript: string;
  }[];
}

const KNOWLEDGE_BASE: Record<string, IndustryKnowledgeBase> = {
  FinTech: {
    id: 'fintech',
    name: 'FinTech & Payments',
    tagline: 'High-concurrency systems, regulatory compliance (CBN/BOG/SARB/PCI-DSS), and ledger accuracy.',
    etiquette: {
      title: 'Fintech Leadership & Engineering Etiquette',
      points: [
        'Demonstrate zero tolerance for financial inaccuracy; refer to double-entry ledgers, idempotency, and audit trails early.',
        'Address regulatory and multi-currency compliance naturally: mention AML/KYC checks, PCI-DSS compliance, and central bank reporting.',
        'High bandwidth resilience: in remote interviews across Pan-Africa, have a backup mobile hotspot ready and announce your screen setup proactively.',
        'Keep answers outcome-driven: focus on transaction volume ($ processed), uptime (99.99%), and fraud mitigation percentage.',
      ],
      proTip: 'Fintech VPs look for candidates who balance high shipping velocity with paranoid engineering safety.',
    },
    commonQuestions: [
      {
        question: 'How do you prevent duplicate charges in distributed payments under network drops?',
        category: 'System Architecture',
        whyAsked: 'Tests understanding of idempotency keys, distributed locking, and ledger consistency.',
        modelAnswerOutline: '1) Generate client-side idempotency keys. 2) Acquire Redis lock with TTL. 3) Execute atomic database transaction. 4) Return existing transaction record if key exists.',
        keyBuzzwords: ['Idempotency Key', 'Redis SETNX', 'ACID Transactions', 'Ledger Integrity'],
      },
      {
        question: 'Tell me about a high-severity incident affecting live customer balances.',
        category: 'Incident Response & STAR',
        whyAsked: 'Gauges composure under fire and systematic RCA (Root Cause Analysis).',
        modelAnswerOutline: 'Situation: Payment gateway returned ambiguous timeout. Task: Isolate affected accounts. Action: Paused outgoing webhooks, reconciled pending ledger states with provider raw logs. Result: Zero lost funds, updated retry logic with exponential backoff.',
        keyBuzzwords: ['Post-Mortem', 'Exponential Backoff', 'Reconciliation Pipeline', 'SLA'],
      },
    ],
    negotiationStrategies: [
      {
        tacticTitle: 'Currency Protection / USD Benchmark Clause',
        description: 'Protect against local currency depreciation (NGN, GHS, KES) by requesting compensation pegged to USD or dual-currency split.',
        suggestedScript: '"Given current FX market volatility, I would appreciate exploring either a USD-denominated contract or a quarterly FX adjustment clause to ensure our compensation terms remain stable."',
      },
      {
        tacticTitle: 'Sign-on Bonus to Offset Unvested Equity',
        description: 'Ask for upfront cash compensation if walking away from unvested bonuses at your previous employer.',
        suggestedScript: '"I have $10,000 in unvested bonus payable in Q4. Would your team be open to a one-time sign-on bonus to help bridge that gap?"',
      },
    ],
  },

  SaaS: {
    id: 'saas',
    name: 'SaaS & Enterprise Cloud',
    tagline: 'Multi-tenant scalability, churn reduction, API first architectures, and ARR expansion.',
    etiquette: {
      title: 'Enterprise SaaS Interview Nuances',
      points: [
        'Emphasize customer empathy: explain how your code directly influences Customer Retention and Net Promoter Score (NPS).',
        'Multi-tenant architecture: always highlight data isolation, tenant rate-limiting, and RBAC security.',
        'Product-led growth mindset: discuss telemetry, observability (Datadog/Sentry), and feature flagging (LaunchDarkly).',
      ],
      proTip: 'Ask intelligent questions at the end about their Annual Recurring Revenue (ARR) growth targets and sales cycle length.',
    },
    commonQuestions: [
      {
        question: 'How do you handle schema migrations in a zero-downtime multi-tenant database?',
        category: 'Database Engineering',
        whyAsked: 'Tests practical experience scaling databases without locking critical tables.',
        modelAnswerOutline: 'Use expand and contract pattern: 1) Add new column/table nullable. 2) Deploy code writing to both. 3) Backfill historical data in background chunks. 4) Switch reads to new format. 5) Drop old column.',
        keyBuzzwords: ['Expand & Contract', 'Backfill Script', 'Tenant Isolation', 'Zero Downtime'],
      },
    ],
    negotiationStrategies: [
      {
        tacticTitle: 'Equity Grant Acceleration & Refreshers',
        description: 'Negotiate for early single or double-trigger vesting acceleration upon acquisition.',
        suggestedScript: '"I am extremely excited about the long-term enterprise valuation. Could we discuss expanding the option pool grant or introducing annual performance refresher grants?"',
      },
    ],
  },

  Ecommerce: {
    id: 'ecommerce',
    name: 'E-Commerce & Retail Tech',
    tagline: 'Black Friday flash sales, inventory locking, checkout funnel conversion, and logistics fulfillment.',
    etiquette: {
      title: 'E-Commerce Interview Culture',
      points: [
        'Demonstrate understanding of checkout conversion drop-off rates and page speed latency impacts.',
        'Discuss inventory locking: overselling avoidance during flash sales is a prime test topic.',
        'Respect supply chain reality: acknowledge field logistics and offline-first mobile app constraints in emerging markets.',
      ],
      proTip: 'Highlight how milliseconds in page performance translate directly into gross merchandise value (GMV).',
    },
    commonQuestions: [
      {
        question: 'How do you prevent overselling when 5,000 customers try to purchase the last 10 items?',
        category: 'Concurrency & Locking',
        whyAsked: 'Assesses race condition resolution and distributed queue design.',
        modelAnswerOutline: 'Use Redis atomic decrement with rollback timers: allocate a 10-minute cart lock. If payment succeeds, commit DB inventory; otherwise release lock.',
        keyBuzzwords: ['Redis DECR', 'Cart Expiry Lock', 'Optimistic Locking', 'GMV'],
      },
    ],
    negotiationStrategies: [
      {
        tacticTitle: 'Performance Bonus Tied to GMV or System Uptime',
        description: 'Propose milestone-based bonuses if base salary is constrained by budget brackets.',
        suggestedScript: '"If the base salary is capped at the top of band, I would be happy to agree on a performance-based quarterly bonus tied directly to platform uptime and checkout throughput."',
      },
    ],
  },

  Banking: {
    id: 'banking',
    name: 'Banking & Financial Services',
    tagline: 'Legacy core banking integration, strict compliance, regulatory stress tests, and institutional security.',
    etiquette: {
      title: 'Banking & Institutional Etiquette',
      points: [
        'Formal and professional communication: wear crisp business casual or business formal on video calls.',
        'Thorough documentation emphasis: show respect for RFCs, change control boards, and disaster recovery drills.',
        'Punctuality is non-negotiable: log in 3-5 minutes prior to the scheduled start time.',
      ],
      proTip: 'Never dismiss legacy software as "bad" — frame modernization as strategic risk mitigation.',
    },
    commonQuestions: [
      {
        question: 'How do you integrate modern cloud microservices with legacy core banking mainframe systems?',
        category: 'Enterprise Integration',
        whyAsked: 'Tests practical patience and API gateway facade architecture experience.',
        modelAnswerOutline: 'Implement the Strangler Fig pattern: introduce an API Gateway facade that intercepts incoming calls, routing new capabilities to microservices while proxies route core ledger transactions.',
        keyBuzzwords: ['Strangler Fig Pattern', 'API Gateway', 'ISO 8583', 'Disaster Recovery'],
      },
    ],
    negotiationStrategies: [
      {
        tacticTitle: 'Institutional Benefits & Retainer Package',
        description: 'Leverage banking perks: low-interest home loans, comprehensive family health coverage, and pension contributions.',
        suggestedScript: '"Could we review the comprehensive benefits package, specifically executive health cover and institutional pension matching, to complete the total package?"',
      },
    ],
  },
};

export const InterviewTipsLibrarySection: React.FC<{
  onSelectPracticeQuestion?: (q: string) => void;
}> = ({ onSelectPracticeQuestion }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('FinTech');
  const [activeCategory, setActiveCategory] = useState<'all' | 'etiquette' | 'questions' | 'negotiation'>('all');
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currentKB = KNOWLEDGE_BASE[selectedIndustry] || KNOWLEDGE_BASE.FinTech;

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedScriptIndex(idx);
    setTimeout(() => setCopiedScriptIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Industry Selector */}
      <div className="p-4 bg-gradient-to-r from-[#14243A] via-[#1A2E4D] to-indigo-900 text-white rounded-2xl border border-indigo-700/50 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#B5E61D] border border-white/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold flex items-center gap-2">
                <span>Context-Aware Interview Tips & Playbook</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B5E61D]/20 text-[#B5E61D] border border-[#B5E61D]/40 font-bold uppercase">
                  Curated Knowledge Base
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Industry-specific etiquette, high-frequency interview questions, and offer negotiation scripts.
              </p>
            </div>
          </div>
        </div>

        {/* Industry Pill Selector */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
          {Object.keys(KNOWLEDGE_BASE).map((indKey) => {
            const kb = KNOWLEDGE_BASE[indKey];
            const isSelected = selectedIndustry === indKey;
            return (
              <button
                key={indKey}
                type="button"
                onClick={() => setSelectedIndustry(indKey)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-[#0066CC] text-white shadow-xs border border-white/30'
                    : 'bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 border border-white/10'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{kb.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#0D1527] p-1 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All Sections
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('etiquette')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'etiquette'
                ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Etiquette & Presence
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('questions')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'questions'
                ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Common Questions
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('negotiation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              activeCategory === 'negotiation'
                ? 'bg-white dark:bg-[#1A284A] text-[#0066CC] dark:text-[#38BDF8] shadow-2xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Negotiation Scripts
          </button>
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions & tips..."
            className="pl-8 pr-3 py-1.5 bg-white dark:bg-[#0D1527] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-xs outline-none focus:border-[#0066CC]"
          />
        </div>
      </div>

      {/* SECTION 1: Etiquette */}
      {(activeCategory === 'all' || activeCategory === 'etiquette') && (
        <div className="p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {currentKB.etiquette.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Key professional expectations and behavioral poise expected by hiring committees in {currentKB.name}.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {currentKB.etiquette.points.map((pt, i) => (
              <div
                key={i}
                className="p-3 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                  {pt}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Executive Pro-Tip:</strong> {currentKB.etiquette.proTip}
            </span>
          </div>
        </div>
      )}

      {/* SECTION 2: Common Questions & Winning Outlines */}
      {(activeCategory === 'all' || activeCategory === 'questions') && (
        <div className="p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  High-Frequency Interview Questions in {currentKB.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real technical and behavioral questions asked by hiring teams with answer outlines.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {currentKB.commonQuestions.map((q, idx) => (
              <div
                key={idx}
                className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">
                    "{q.question}"
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      {q.category}
                    </span>
                    {onSelectPracticeQuestion && (
                      <button
                        type="button"
                        onClick={() => onSelectPracticeQuestion(q.question)}
                        className="px-2.5 py-1 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <span>Practice with Timer</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                  <strong>Why they ask:</strong> {q.whyAsked}
                </div>

                <div className="p-3 bg-white dark:bg-[#131D35] rounded-lg border border-slate-200 dark:border-slate-700 space-y-1">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    Recommended Answer Framework:
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-mono text-[11px]">
                    {q.modelAnswerOutline}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-slate-400 font-medium">Keywords:</span>
                  {q.keyBuzzwords.map((kw) => (
                    <span
                      key={kw}
                      className="px-1.5 py-0.5 bg-slate-100 dark:bg-[#1A284A] text-slate-700 dark:text-slate-300 rounded text-[10px] font-medium"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: Negotiation Playbook */}
      {(activeCategory === 'all' || activeCategory === 'negotiation') && (
        <div className="p-5 bg-white dark:bg-[#111A30] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Salary & Offer Negotiation Playbook ({currentKB.name})
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tactics and word-for-word scripts to maximize your compensation and contract protections.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentKB.negotiationStrategies.map((strat, i) => (
              <div
                key={i}
                className="p-4 bg-slate-50 dark:bg-[#0D1527] rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">
                      {strat.tacticTitle}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {strat.description}
                  </p>

                  <div className="p-3 bg-white dark:bg-[#131D35] rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">
                      Word-For-Word Script:
                    </span>
                    <p className="italic text-slate-800 dark:text-slate-200 leading-relaxed font-serif text-[11px]">
                      {strat.suggestedScript}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleCopy(strat.suggestedScript, i)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedScriptIndex === i ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Script Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
