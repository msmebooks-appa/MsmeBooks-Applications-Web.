import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight, Search } from 'lucide-react';
import { FAQ_DATA } from '../data/faq';
import { EnquiryType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface FaqSectionProps {
  onFaqAction: (enquiryType: EnquiryType) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onFaqAction }) => {
  const { tDict } = useLanguage();
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sales' | 'support' | 'partnerships'>('all');

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faqs" className="py-16 lg:py-24 bg-[#f8fafc] dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#f2f9eb] dark:bg-lime-950/40 border border-[#d2edaa] dark:border-lime-900 text-xs font-bold text-[#4d8b20] dark:text-[#a1e670] uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#70C038]" />
            {tDict.faq.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight">
            {tDict.faq.title}
          </h2>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {tDict.faq.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-lg mx-auto relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={tDict.faq.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#131E35] text-sm text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-[#0B3B82] dark:focus:border-blue-500 focus:ring-1 focus:ring-[#0B3B82] shadow-xs"
            />
          </div>

          {/* Category Tabs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: tDict.faq.allCat },
              { id: 'sales', label: tDict.faq.salesCat },
              { id: 'support', label: tDict.faq.supportCat },
              { id: 'partnerships', label: tDict.faq.partnersCat },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeCategory === tab.id
                    ? 'bg-[#0B3B82] dark:bg-[#1D4ED8] text-white shadow-xs'
                    : 'bg-white dark:bg-[#131E35] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-[#131E35] rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No questions found</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching with different keywords or switch categories.
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`bg-white dark:bg-[#131E35] rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-[#0B3B82]/50 dark:border-blue-500/60 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B82]"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white pr-2">
                      {faq.question}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? 'bg-[#f0f6ff] dark:bg-blue-950/60 rotate-180' : 'bg-slate-100 dark:bg-slate-800'
                      }`}
                    >
                      <ChevronDown
                        className={`w-4 h-4 ${isOpen ? 'text-[#0B3B82] dark:text-[#93C5FD]' : 'text-slate-500 dark:text-slate-400'}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
                      <p>{faq.answer}</p>

                      {faq.actionLabel && faq.actionEnquiryType && (
                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-start">
                          <button
                            onClick={() => onFaqAction(faq.actionEnquiryType!)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] hover:text-[#082d64] dark:hover:text-white group"
                          >
                            <span>{faq.actionLabel}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-[#70C038] group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions prompt */}
        <div className="mt-10 p-5 rounded-xl bg-white dark:bg-[#131E35] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left transition-colors">
          <div>
            <h4 className="text-sm font-bold text-[#0B3B82] dark:text-white">Have a question not listed here?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Our Pan-African customer support and solutions team is available to assist you.
            </p>
          </div>
          <button
            onClick={() => onFaqAction('General Enquiry')}
            className="px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-[#1D4ED8] dark:hover:bg-[#1E40AF] shrink-0 transition-colors"
          >
            Ask Our Team
          </button>
        </div>
      </div>
    </section>
  );
};
