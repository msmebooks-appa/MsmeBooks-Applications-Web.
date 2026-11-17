import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQS } from '../data/partnerData';

export const FAQSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQS[0]?.id || null);

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section id="faq" className="py-20 lg:py-28 bg-[#F7FAFC] dark:bg-[#0B1528] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1261B5] dark:text-[#B9E51C] uppercase tracking-wider">
            <span>Frequently Asked Questions</span>
            <span aria-hidden="true">·</span>
            <span>Policy & Guidelines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#142D4E] dark:text-white tracking-tight">
            Got Questions? We Have Transparent Answers.
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Everything you need to know about the MsmeBooks Partner Commission Program, tier rates, payment cycles, attribution policies, and eligibility terms.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions by keyword (e.g. payout, recurring, tax, tiers, upgrades)..."
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#14233c] text-[#142D4E] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]/30 focus:border-[#1261B5] shadow-xs transition-all"
          />
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#1261B5] text-white'
                : 'bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Questions ({FAQS.length})
          </button>
          <button
            onClick={() => setSelectedCategory('general')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'general'
                ? 'bg-[#1261B5] text-white'
                : 'bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            General & Eligibility
          </button>
          <button
            onClick={() => setSelectedCategory('earnings')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'earnings'
                ? 'bg-[#1261B5] text-white'
                : 'bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Commissions & Calculations
          </button>
          <button
            onClick={() => setSelectedCategory('payouts')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'payouts'
                ? 'bg-[#1261B5] text-white'
                : 'bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Payouts & Banking
          </button>
          <button
            onClick={() => setSelectedCategory('operations')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === 'operations'
                ? 'bg-[#1261B5] text-white'
                : 'bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Referrals & Operations
          </button>
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-[#14233c] rounded-2xl border border-slate-200 dark:border-slate-700 p-8">
            <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No matching questions found.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] hover:underline"
            >
              Clear search and view all FAQs
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;

              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700/80 rounded-xl overflow-hidden shadow-2xs transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-4 px-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-[#142D4E] dark:text-white hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1261B5] dark:text-[#B9E51C]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 bg-slate-50/40 dark:bg-[#0e1b30]">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className="mt-12 bg-white dark:bg-[#14233c] border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
          <MessageSquare className="w-8 h-8 text-[#1261B5] dark:text-[#B9E51C] mx-auto" />
          <h3 className="text-lg font-bold text-[#142D4E] dark:text-white">Still Have Questions Regarding Partnership?</h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            Our partner enablement team is ready to discuss bespoke arrangements for accounting federations, regional distributors, and large advisory firms.
          </p>
          <div className="pt-2">
            <a
              href="mailto:partners@msmebooks.org"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] transition-colors"
            >
              <span>Contact Partner Desk: partners@msmebooks.org</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
