import React, { useState, useMemo } from 'react';
import { ChevronDown, Search, HelpCircle, MessageSquare } from 'lucide-react';
import { PRIVACY_FAQS, POLICY_METADATA } from '../data/privacyPolicyData';
import { useLanguage } from '../context/LanguageContext';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqSearch, setFaqSearch] = useState('');
  const { t, getFaqs } = useLanguage();
  const allFaqs = getFaqs();

  const filteredFaqs = useMemo(() => {
    if (!faqSearch.trim()) return allFaqs;
    const q = faqSearch.toLowerCase();
    return allFaqs.filter(
      item => item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)
    );
  }, [faqSearch, allFaqs]);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 bg-white dark:bg-[#0D1726] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#1455C0] dark:text-[#5B95FF] mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>{t('faq.kicker', 'Common Questions Answered')}</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#172B4D] dark:text-white tracking-tight">
            {t('faq.title', 'Frequently Asked Privacy Questions')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
            {t('faq.subtitle', 'Direct, legally verified answers regarding customer records, cloud hosting, AI features, and data ownership.')}
          </p>

          {/* Search FAQ */}
          <div className="relative mt-6 max-w-md mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('faq.searchPlaceholder', 'Search privacy questions...')}
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 dark:bg-[#111C30] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:border-[#1455C0] dark:focus:border-[#5B95FF] focus:ring-1 focus:ring-[#1455C0]"
            />
          </div>
        </div>

        {/* Accordion list */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-[#F7FAFC] dark:bg-[#111C30] rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
              No privacy questions match &quot;{faqSearch}&quot;. You can submit a direct query to our DPO desk below.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4.5 text-left bg-white dark:bg-[#111C30] hover:bg-slate-50/80 dark:hover:bg-[#16233B] transition-colors flex items-center justify-between gap-4"
                  >
                    <span className="text-sm font-semibold text-[#172B4D] dark:text-white">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#1455C0] dark:text-[#5B95FF]' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 bg-white dark:bg-[#111C30] border-t border-slate-100 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still have questions footer */}
        <div className="mt-10 p-5 bg-gradient-to-r from-blue-50 to-slate-50 dark:from-[#111C30] dark:to-[#0D1726] border border-blue-100 dark:border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1455C0] text-white flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-[#172B4D] dark:text-white">
                {t('faq.calloutTitle', 'Need specific clarification for your enterprise audit?')}
              </h4>
              <p className="text-slate-600 dark:text-slate-300">
                {t('faq.calloutDesc', 'Our Data Protection Officer and compliance counsel are available for direct review.')}
              </p>
            </div>
          </div>
          <a
            href={`mailto:${POLICY_METADATA.dpoEmail}?subject=Enterprise Data Privacy Inquiry`}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] rounded-lg transition-colors shrink-0 shadow-xs"
          >
            {t('faq.emailDpo', 'Email DPO Team')}
          </a>
        </div>
      </div>
    </section>
  );
};
