import React, { useState } from 'react';
import { 
  ChevronDown, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Search, 
  CheckCircle2, 
  Globe2,
  ShieldCheck 
} from 'lucide-react';
import { FAQS_DATA } from '../data/faqs';

interface CtaAndFaqSectionProps {
  onOpenDirectory: () => void;
  onOpenBecomePartner: () => void;
}

export const CtaAndFaqSection: React.FC<CtaAndFaqSectionProps> = ({
  onOpenDirectory,
  onOpenBecomePartner,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number>(0);
  const [faqCategory, setFaqCategory] = useState<string>('All');
  const [faqSearch, setFaqSearch] = useState<string>('');

  const categories = ['All', 'Finding a Partner', 'Services & Support', 'Becoming a Partner'];

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    if (faqCategory !== 'All' && faq.category !== faqCategory) return false;
    if (faqSearch) {
      const q = faqSearch.toLowerCase();
      return faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(prev => (prev === idx ? -1 : idx));
  };

  return (
    <>
      {/* SECTION 21: GLOBAL PARTNER NETWORK FULL-WIDTH CTA */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-r from-[#061933] via-[#092b57] to-[#061933] text-white border-b border-slate-800">
        
        {/* Glow Accent */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.08),transparent_70%)] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/30 text-lime-400 text-xs font-bold">
            <Globe2 className="w-3.5 h-3.5" />
            <span>Pan-African & Global Expansion</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Your Business. Your Market. <br className="hidden sm:inline" />
            <span className="text-lime-400">Your MsmeBooks Partner.</span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Whether you need hands-on local help modernizing your bookkeeping, rolling out barcode POS across 10 branches, or want to earn recurring revenue as an authorized partner, we have the network ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenDirectory}
              className="w-full sm:w-auto px-8 py-4 bg-lime-500 hover:bg-lime-400 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-lime-500/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <span>Find a Certified Partner</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenBecomePartner}
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700 hover:border-lime-400/50 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply to Become a Partner</span>
              <Sparkles className="w-4 h-4 text-lime-400" />
            </button>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>500+ Verified Certified Partners</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Free Consultation Matching</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-lime-400" />
              <span>Up to 40% Recurring Commission</span>
            </span>
          </div>
        </div>
      </section>

      {/* SECTION 22: FAQ SECTION (13 Comprehensive FAQs) */}
      <section id="faq" className="py-20 bg-slate-100/70 dark:bg-[#07162b] text-slate-900 dark:text-white relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-lime-400 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Got Questions? We Have Answers.
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Everything you need to know about finding a partner or growing your advisory business with MsmeBooks.
            </p>
          </div>

          {/* FAQ Search & Category Filters */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search FAQ questions (e.g. commission, certification, POS, pricing)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-400 shadow-sm"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    faqCategory === cat
                      ? 'bg-lime-500 text-slate-950 shadow'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* FAQ Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#091e38] overflow-hidden transition-all shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-slate-800 flex items-center justify-center text-blue-700 dark:text-lime-400 text-xs font-bold shrink-0">
                        ?
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-lime-600 dark:text-lime-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/40">
                      <p className="mt-2">{faq.answer}</p>
                      <div className="mt-3 text-[11px] text-lime-600 dark:text-lime-400/80 font-bold">
                        Category: {faq.category}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ Footer Card */}
          <div className="mt-10 p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 text-center space-y-3 shadow-sm transition-colors duration-300">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Still have questions?</h4>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Our partner ecosystem team is available on WhatsApp and phone at <strong>+2349158482622</strong>
            </p>
            <a
              href="https://wa.me/2349158482622"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-lime-400 transition-all"
            >
              <span>Chat with Partner Desk on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </section>
    </>
  );
};
