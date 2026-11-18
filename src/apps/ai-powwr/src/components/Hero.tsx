import React, { useRef, useState, useEffect } from 'react';
import { useCurrency } from '../context/CurrencyContext';
import { useI18n } from '../context/I18nContext';
import { Search, Sparkles, ArrowRight, HelpCircle, CheckCircle2, ChevronRight, Zap, Coins, TrendingUp } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectSuggestedChip: (chipText: string) => void;
  onOpenAiAssistant: () => void;
  totalFaqCount: number;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  onSearchChange,
  onSelectSuggestedChip,
  onOpenAiAssistant,
  totalFaqCount
}) => {
  const { currencyInfo, formatFromUSD } = useCurrency();
  const { t } = useI18n();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const suggestedChips = [
    'How do I get started?',
    'Is there a free plan?',
    'How does POS work?',
    'Can I manage multiple branches?',
    'Does MsmeBooks support hotels?',
    'How do I migrate my data?',
    'Can I use MsmeBooks in my country?'
  ];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const explorerEl = document.getElementById('faq-explorer');
    if (explorerEl) {
      explorerEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-section" className="relative overflow-hidden bg-gradient-to-b from-[#EBF2FE]/60 via-[#F5F8FC] to-[#F5F8FC] dark:from-[#0B132B] dark:via-[#0E1726] dark:to-[#0B132B] pt-8 pb-14 border-b border-slate-200/60 dark:border-slate-800 transition-colors duration-300">
      {/* Decorative Brand Background Glyphs */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-[#1254B5]/5 dark:bg-[#1254B5]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 translate-y-12 w-80 h-80 bg-[#B7E522]/15 dark:bg-[#B7E522]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb & Currency Indicator (Section 4) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <nav
            className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400"
            aria-label="Breadcrumb"
          >
            <a href="/" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">Home</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <a href="#resources" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">Resources</a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
            <span className="text-[#1254B5] dark:text-[#B7E522] font-semibold bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200/50 dark:border-blue-900/50">
              Frequently Asked Questions
            </span>
          </nav>

          {/* Active Live Currency Anchor Badge */}
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white/80 dark:bg-[#131E36]/90 backdrop-blur-xs px-3 py-1 rounded-full border border-slate-200/90 dark:border-slate-700 shadow-2xs self-start sm:self-auto">
            <Coins className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
            <span>{t('hero.activeCurrency', 'Active Currency')}:</span>
            <strong className="text-[#1254B5] dark:text-[#B7E522] font-mono">
              {currencyInfo.flag} {currencyInfo.code} ({currencyInfo.symbol})
            </strong>
            <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden md:inline">
              • 1$ = {currencyInfo.rateAgainstUSD.toLocaleString()} {currencyInfo.code}
            </span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-700 text-[#1254B5] dark:text-blue-300 text-xs font-bold tracking-wider uppercase mb-5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#1254B5] dark:bg-[#B7E522]" />
            {t('hero.badge', 'MSMEBOOKS HELP & KNOWLEDGE CENTRE')}
          </div>

          {/* Headlines */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#17233D] dark:text-white tracking-tight leading-tight sm:leading-none">
            {t('hero.title', "Questions? We've Got Answers.")}
          </h1>

          <p className="mt-3 text-lg sm:text-xl font-semibold text-slate-700 dark:text-slate-200">
            {t('hero.subtitle', 'Everything You Need to Know About Running Your Business with MsmeBooks.')}
          </p>

          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t('hero.description', 'Explore helpful answers about accounting, point of sale, inventory, payroll, business management, integrations, industry solutions, pricing, security, and more — all in one centralized hub.')}
          </p>

          {/* Search Box Component (Prominent Intelligent Search Field) */}
          <div className="mt-8 max-w-3xl mx-auto">
            <form
              onSubmit={handleFormSubmit}
              className="relative flex items-center bg-white dark:bg-[#131E36] p-2 rounded-2xl shadow-xl shadow-blue-900/5 dark:shadow-none border-2 border-[#1254B5]/30 dark:border-blue-500/40 focus-within:border-[#1254B5] dark:focus-within:border-[#3B82F6] focus-within:ring-4 focus-within:ring-[#1254B5]/15 dark:focus-within:ring-blue-500/20 transition duration-200"
            >
              <div className="pl-3 pr-2 text-slate-400">
                <Search className="w-5 h-5 text-[#1254B5] dark:text-[#B7E522]" />
              </div>

              <input
                id="faq-hero-search-input"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('hero.searchPlaceholder', 'Search questions, features, industries or topics...')}
                className="w-full py-2.5 px-2 text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 text-sm sm:text-base bg-transparent border-0 focus:outline-none focus:ring-0 font-medium"
                aria-label="Search questions, features, industries or topics"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="px-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-medium cursor-pointer"
                >
                  {t('hero.clear', 'Clear')}
                </button>
              )}

              <button
                type="submit"
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#1254B5] hover:bg-[#0A3D87] text-white font-bold text-sm shadow-md hover:shadow-lg transition cursor-pointer"
              >
                <span>{t('hero.findAnswers', 'Find Answers')}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            </form>

            {/* Quick Live Search Feedback Pill */}
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-2.5 px-3">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {t('hero.verifiedIndexed', 'Indexed across verified questions & 20 industries')} ({totalFaqCount}+)
              </span>
              <button
                onClick={onOpenAiAssistant}
                className="inline-flex items-center gap-1 text-[#1254B5] dark:text-[#B7E522] hover:underline font-semibold cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#B7E522]" />
                {t('hero.askAiPrompt', 'Prefer natural conversation? Ask AI')}
              </button>
            </div>
          </div>

          {/* Suggested Search Chips */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#1254B5] dark:text-[#B7E522]" />
              {t('hero.popular', 'Popular')}:
            </span>
            {suggestedChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestedChip(chip)}
                className="text-xs font-medium px-3 py-1.5 rounded-full bg-white dark:bg-[#162038] hover:bg-blue-50 dark:hover:bg-[#1E2D4A] text-slate-700 dark:text-slate-200 hover:text-[#1254B5] dark:hover:text-[#B7E522] border border-slate-200 dark:border-slate-700 shadow-2xs transition active:scale-95 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Two Hero CTA Buttons (Section 4) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#get-started"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#1254B5] hover:bg-[#0A3D87] shadow-md hover:shadow-lg transition transform active:scale-95"
            >
              <span>{t('hero.getStartedFree', 'Get Started Free')}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </a>

            <a
              href="#pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-[#17233D] bg-[#B7E522] hover:bg-[#a5cf1e] shadow-sm hover:shadow transition transform active:scale-95 border border-[#a2cf1c]"
            >
              <span>{t('hero.viewPricing', 'View Pricing')} ({currencyInfo.code})</span>
              <HelpCircle className="w-4 h-4 text-[#17233D]" />
            </a>
          </div>

          {/* Live Global Commerce & Revenue Benchmarks Bar */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/70 dark:bg-[#131E36]/80 backdrop-blur-xs p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition">
              <div className="text-xl sm:text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6]">
                {formatFromUSD(1450000, { compact: true })}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {t('hero.metricDailyPos', 'Daily POS Volume')} ({currencyInfo.code})
              </div>
            </div>

            <div className="bg-white/70 dark:bg-[#131E36]/80 backdrop-blur-xs p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition">
              <div className="text-xl sm:text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6]">
                {formatFromUSD(4250, { compact: false })}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {t('hero.metricMonthlyTurnover', 'Avg. Monthly SME Turnover')}
              </div>
            </div>

            <div className="bg-white/70 dark:bg-[#131E36]/80 backdrop-blur-xs p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition">
              <div className="text-xl sm:text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6]">
                from {formatFromUSD(15, { compact: false })}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {t('hero.metricStartingPlan', 'Starting Plan / Month')}
              </div>
            </div>

            <div className="bg-white/70 dark:bg-[#131E36]/80 backdrop-blur-xs p-3 rounded-xl border border-slate-100 dark:border-slate-800 transition">
              <div className="text-xl sm:text-2xl font-extrabold text-[#1254B5] dark:text-[#3B82F6]">
                {formatFromUSD(3850, { compact: true })}/mo
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
                {t('hero.metricPartnerPayout', 'Top Partner Payout (40%)')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
