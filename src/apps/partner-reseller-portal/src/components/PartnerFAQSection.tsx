import React, { useState, useMemo } from 'react';
import { FAQ_ITEMS } from '../data/faqData';
import { Search, ChevronDown, ChevronUp, HelpCircle, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PartnerFAQSectionProps {
  onOpenApply: () => void;
  onContactSupport: () => void;
}

export const PartnerFAQSection: React.FC<PartnerFAQSectionProps> = ({
  onOpenApply,
  onContactSupport
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-6', 'faq-7']);

  const categories = ['all', 'General', 'Commissions', 'Legal & Compliance', 'Implementation'];

  const filteredFaqs = useMemo(() => {
    return FAQ_ITEMS.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-20 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-blue-400">
            <span>Section 06</span>
            <span aria-hidden="true">·</span>
            <span>{t('faq.badge', 'Partner Intelligence & Support')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('faq.title', 'Frequently Asked Questions')}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            {t(
              'faq.subtitle',
              'Everything you need to know about joining, onboarding, marketing support, billing mechanisms, and regional bank payouts across Africa and global markets.'
            )}
          </p>
        </div>

        {/* Search & Topic Tabs */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder', 'Search questions regarding onboarding, payouts, commissions...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400"
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Questions (20)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 pt-2">
          {filteredFaqs.map(faq => {
            const isOpen = openIds.includes(faq.id);

            return (
              <div
                key={faq.id}
                className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-all bg-white dark:bg-slate-900"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-bold text-[#0046B8] dark:text-blue-400 uppercase tracking-wider">
                      {faq.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className="text-slate-400 dark:text-slate-500 shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No matching questions found</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs font-bold text-[#0046B8] dark:text-lime-400 hover:underline cursor-pointer"
            >
              Reset search
            </button>
          </div>
        )}

        {/* Still Have Questions Box */}
        <div className="bg-blue-50/70 dark:bg-slate-900 border border-blue-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Have specific questions regarding enterprise distributor agreements?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Our partner management and legal desk provides bespoke consultation for large multi-branch networks.
            </p>
          </div>

          <button
            type="button"
            onClick={onContactSupport}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            Contact Partnership Team
          </button>
        </div>

      </div>
    </section>
  );
};
