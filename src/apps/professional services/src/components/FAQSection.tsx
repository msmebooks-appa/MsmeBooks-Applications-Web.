import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  X, 
  MessageCircle,
  ArrowRight
} from 'lucide-react';
import { FAQS_DATA, FAQItem } from '../data/faqData';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

export const FAQSection: React.FC = () => {
  const [faqSearch, setFaqSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-3': true,
    'faq-4': true,
  });

  const categories = ['All', 'General & Services', 'Booking & WhatsApp', 'Firms & Verification', 'Pricing & Payments', 'Provider Partnership'];

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    if (activeCategory !== 'All' && faq.category !== activeCategory) {
      return false;
    }
    if (faqSearch.trim()) {
      const q = faqSearch.toLowerCase();
      const matchQ = faq.question.toLowerCase().includes(q);
      const matchA = faq.answer.toLowerCase().includes(q);
      if (!matchQ && !matchA) return false;
    }
    return true;
  });

  return (
    <section id="faqs" className="py-20 bg-[#F5F9FD]/80 dark:bg-[#07111D] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Clear Answers to Every Question
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#102B4E] dark:text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm sm:text-base font-normal">
            Everything you need to know about booking accountants, software implementation, WhatsApp consultations, pricing, and partner registration.
          </p>
        </div>

        {/* Search & Category Pills */}
        <div className="space-y-4 mb-10">
          {/* Search Box */}
          <div className="relative max-w-xl mx-auto">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search FAQs (e.g. WhatsApp, QuickBooks migration, pricing, refund, ICAN)..."
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm bg-white dark:bg-[#0A1727] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-[#1464C8] text-slate-800 dark:text-slate-100"
            />
            {faqSearch && (
              <button
                onClick={() => setFaqSearch('')}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 min-w-max">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#1464C8] text-white shadow-xs'
                    : 'bg-white dark:bg-[#0A1727] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#132842] border border-slate-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-[#0A1727] rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-6">
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">No matching questions found for "{faqSearch}".</p>
              <a
                href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello MsmeBooks, I have a question: ${faqSearch}`)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#B7E532] text-[#102B4E] font-bold text-xs rounded-xl shadow-xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ask Us Directly on WhatsApp
              </a>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openIds[faq.id];
              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/70 dark:hover:bg-[#0E2036] transition-colors"
                  >
                    <span className="font-extrabold text-sm sm:text-base text-[#102B4E] dark:text-white leading-snug">
                      {faq.question}
                    </span>
                    <span className={`w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-blue-50 dark:bg-blue-950/80 text-[#1464C8] dark:text-[#B7E532]' : ''
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-[#08121E]/60">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Still Have Questions CTA */}
        <div className="mt-12 text-center p-6 bg-white dark:bg-[#0A1727] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-black text-sm text-[#102B4E] dark:text-white">Still have a specific question about your business?</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Our pan-African concierge is online to guide your requirements.</p>
          </div>
          <a
            href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I have an inquiry regarding professional services for my business.")}`}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs rounded-xl shadow-xs transition-transform hover:scale-105 flex items-center gap-1.5 shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-[#102B4E]" />
            <span>Chat on WhatsApp (+234 915 848 2622)</span>
          </a>
        </div>

      </div>
    </section>
  );
};
