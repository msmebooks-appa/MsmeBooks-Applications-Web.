import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqSectionProps {
  onOpenDemo: () => void;
  onOpenGetStarted: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenDemo, onOpenGetStarted }) => {
  const [openId, setOpenId] = useState<string>('faq-1');
  const { t } = useLanguage();

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? '' : id);
  };

  return (
    <section id="faqs" className="py-16 md:py-24 bg-slate-50/70 dark:bg-black border-b border-slate-200/80 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider text-[#0B4EA2] dark:text-[#38BDF8] uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]"></span>
            <span>{t.faq_eyebrow}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight text-balance">
            {t.faq_title_1}{' '}
            <span className="text-[#0B4EA2] dark:text-[#38BDF8]">{t.faq_title_2}</span>
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
            {t.faq_desc}
          </p>
        </div>

        {/* Modern Accordion */}
        <div className="space-y-3.5">
          {t.faq_items.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white dark:bg-zinc-950 rounded-2xl border border-slate-200/90 dark:border-zinc-800 shadow-xs overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8] transition-colors">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0B4EA2] dark:text-[#38BDF8] rotate-180' : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-t border-slate-100 dark:border-zinc-850 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Helpdesk Prompt */}
        <div className="mt-10 p-5 rounded-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-100 dark:bg-lime-950/60 text-[#65A30D] dark:text-lime-400 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.faq_help_title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.faq_help_desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDemo}
              className="text-xs font-semibold text-[#0B4EA2] dark:text-[#38BDF8] hover:text-[#083770] dark:hover:text-blue-300 px-3 py-2 cursor-pointer"
            >
              {t.nav_book_demo}
            </button>
            <button
              onClick={onOpenGetStarted}
              className="text-xs font-semibold px-4 py-2 bg-[#0B4EA2] text-white rounded-lg hover:bg-[#083770] transition-colors cursor-pointer"
            >
              {t.nav_get_started}
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
