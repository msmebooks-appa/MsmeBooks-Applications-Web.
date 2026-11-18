import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, HelpCircle, Phone, MessageSquare, Mail, X, CheckCircle2 } from 'lucide-react';
import { FAQ_ITEMS } from '../data/pricingData';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const { t, language } = useLanguage();
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { id: 'All', label: t.common.all },
    { id: 'Billing & Plans', label: t.faq.filterBilling },
    { id: 'Features', label: t.faq.filterFeatures },
    { id: 'Security & Multi-branch', label: t.faq.filterSecurity },
    { id: 'Onboarding', label: t.faq.filterOnboarding },
  ];

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="faq" className="py-16 lg:py-24 bg-white dark:bg-[#070F1B] transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
            {t.faq.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {t.faq.title}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t.faq.subtitle}
          </p>
          <div className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 dark:bg-emerald-950/60 border border-emerald-200/70 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Cached for offline access via Service Worker</span>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Category pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-white dark:bg-[#0D1C30] text-[#0A4FD5] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search bar with clear button */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search answers, taxes, offline mode..."
              className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-[#0B192C] border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]/20 focus:border-[#0A4FD5] dark:focus:border-blue-500 shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Results Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-4 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-bold">{filteredFaqs.length}</strong> of {FAQ_ITEMS.length} questions
            {searchQuery && (
              <span> for query &ldquo;<span className="text-[#0A4FD5] dark:text-blue-400 font-semibold">{searchQuery}</span>&rdquo;</span>
            )}
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
              className="text-[#0A4FD5] dark:text-blue-400 font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#0A4FD5] dark:border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm ring-2 ring-[#0A4FD5]/10 dark:ring-blue-500/20'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-4 px-5 sm:px-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm sm:text-base font-bold text-[#0B192C] dark:text-white">
                      {faq.question}
                    </span>
                    <span className="hidden md:inline text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {faq.category}
                    </span>
                  </div>
                  <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    )}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-12 bg-slate-50 dark:bg-[#0B192C] rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-sm">
              No questions found matching "{searchQuery}". Please contact our support team directly.
            </div>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-12 p-6 bg-slate-50 dark:bg-[#0B192C] rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              Still have questions or need a customized deployment?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Our African business specialists are ready to chat with you right now.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="tel:+2349158482622"
              className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
              <span>+234 915 848 2622</span>
            </a>
            <a
              href="https://wa.me/2349158482622?text=Hello%20MsmeBooks%20team,%20I%20have%20a%20question%20about%20your%20pricing%20plans"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
