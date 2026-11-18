import React, { useState } from 'react';
import { FAQ_ITEMS } from '../data/partnersData';
import { ChevronDown, Search, HelpCircle } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = FAQ_ITEMS.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-20 lg:py-28 bg-white dark:bg-[#061F4A] border-b border-slate-200 dark:border-blue-900/60 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-sky-300 border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-4">
            Knowledge Base & Answers
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0A3981] dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
            Everything you need to know about membership tiers, commission calculations, badge accreditations, and client referral policies.
          </p>
        </div>

        {/* Search bar inside FAQ */}
        <div className="relative max-w-xl mx-auto mb-10">
          <Search className="w-4 h-4 text-slate-400 dark:text-sky-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions (e.g. commission payout, badges, certification)..."
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm bg-slate-50 dark:bg-[#0A2552] border border-slate-300 dark:border-blue-800 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
          />
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800/80 overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left gap-4 hover:bg-slate-50 dark:hover:bg-[#0c2e64] transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#0A3981] dark:text-[#8CE600] shrink-0 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-blue-900/60 bg-slate-50/50 dark:bg-[#072147]/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-10 bg-slate-50 dark:bg-[#0A2552] rounded-2xl border border-slate-200 dark:border-blue-800 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
              No matching questions found for "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
