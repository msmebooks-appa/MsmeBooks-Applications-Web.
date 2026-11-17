import React, { useState } from 'react';
import { Phone, Menu, X, CheckCircle2, ArrowRight, ShieldCheck, Globe, ShoppingBag, Award, Zap, Calendar } from 'lucide-react';
import { Currency } from '../types';
import { ThemeToggle } from './ThemeToggle';
import { ConnectionStatus } from './ConnectionStatus';
import { OfflineBanner } from './OfflineBanner';
import { CurrencySelector } from './CurrencySelector';
import { RealTimeCurrencyWidget } from './RealTimeCurrencyWidget';
import { CurrencyTrendTooltip } from './CurrencyTrendTooltip';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface NavbarProps {
  currency: Currency;
  onCurrencyChange: (currency: Currency) => void;
  onOpenTrialModal: (planId?: string) => void;
  onOpenDemoModal: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenCompliance?: () => void;
  onOpenMilestones?: () => void;
  onOpenUpgradeAdvisor?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currency,
  onCurrencyChange,
  onOpenTrialModal,
  onOpenDemoModal,
  theme,
  onToggleTheme,
  onOpenCompliance,
  onOpenMilestones,
  onOpenUpgradeAdvisor,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();
  const { itemCount, openCart } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#070F1B]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      {/* Top micro-bar for trust and phone contact */}
      <div className="bg-[#0B192C] dark:bg-[#050B14] text-slate-300 text-xs py-2 px-4 sm:px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-lime-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pan-African Cloud Architecture
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-300">Over 15,000+ African SMEs Trust MsmeBooks</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-emerald-300 font-medium bg-emerald-950/70 px-2 py-0.5 rounded-md border border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Real-Time Public FX Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:+2349158482622"
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-lime-400" />
              <span className="font-semibold">+234 915 848 2622</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noreferrer"
              className="text-slate-300 hover:text-white transition-colors"
            >
              www.msmebooks.org
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#0A4FD5] to-[#1E60E5] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              {/* Custom MsmeBooks monogram logo */}
              <div className="relative flex items-center justify-center">
                <span className="text-white font-black text-xl tracking-tight">M</span>
                <span className="absolute -top-1 -right-2 w-2.5 h-2.5 bg-[#84CC16] rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold tracking-tight text-[#0B192C] dark:text-white flex items-center">
                Msme<span className="text-[#0A4FD5] dark:text-blue-400">Books</span>
                <span className="ml-1.5 inline-block w-1.5 h-1.5 bg-[#84CC16] rounded-full"></span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
                African Business Platform
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#plans" className="hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.pricingPlans}
            </a>
            <a href="#plan-matcher" className="hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors py-1 flex items-center gap-1.5">
              {t.nav.planMatcher}
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">{t.nav.quizBadge}</span>
            </a>
            <a href="#comparison" className="hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.featureMatrix}
            </a>
            <a href="#ai-assistant" className="hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors py-1 flex items-center gap-1.5">
              {t.nav.aiAssistant}
              <span className="text-[10px] bg-lime-100 dark:bg-lime-950/80 text-lime-800 dark:text-lime-300 font-bold px-1.5 py-0.5 rounded-md">{t.nav.newBadge}</span>
            </a>
            <a href="#african-focus" className="hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.africanFocus}
            </a>
            <a href="#faq" className="hover:text-[#0A4FD5] dark:hover:text-blue-400 transition-colors py-1">
              {t.nav.faqs}
            </a>
          </nav>

          {/* Right Action Area */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Visual Connection Status Indicator */}
            <ConnectionStatus />

            {/* Real-Time Currency Conversion & Quick Plan Pricing Widget */}
            <div className="flex items-center gap-1">
              <RealTimeCurrencyWidget currentCurrency={currency} onCurrencyChange={onCurrencyChange} />
              <CurrencyTrendTooltip currency={currency} showInlineBadge={true} align="right" />
            </div>

            {/* Global Language Selector (EN, FR, PT, ES) */}
            <LanguageSelector />

            {/* Theme Toggle Component */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            {/* Shopping Cart Button */}
            <button
              type="button"
              onClick={openCart}
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-[#0A4FD5] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="View Shopping Cart"
              title="View Cart & Subscriptions"
            >
              <ShoppingBag className="w-5 h-5 text-[#0A4FD5] dark:text-blue-400" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#84CC16] text-slate-950 text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-in zoom-in-50">
                  {itemCount}
                </span>
              )}
              <span className="text-xs font-bold hidden lg:inline">Cart</span>
            </button>

            {/* Milestones Gamification Badge Trigger */}
            {onOpenMilestones && (
              <button
                type="button"
                onClick={onOpenMilestones}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100/80 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="View Growth Milestones & Badges"
              >
                <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden xl:inline">Milestones</span>
                <span className="px-1.5 py-0.2 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-950 dark:text-amber-100 text-[10px] font-black">
                  3/6
                </span>
              </button>
            )}

            {/* Regional Tax Compliance Calendar Drawer Trigger */}
            {onOpenCompliance && (
              <button
                type="button"
                onClick={onOpenCompliance}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100/80 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-800 text-[#0A4FD5] dark:text-blue-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Statutory Tax Deadlines (VAT, WHT, PAYE, Bank Holidays)"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <Calendar className="w-3.5 h-3.5 text-[#0A4FD5] dark:text-blue-400" />
                <span className="hidden xl:inline">Tax Calendar</span>
              </button>
            )}

            {/* Plan Upgrade Advisor Trigger */}
            {onOpenUpgradeAdvisor && (
              <button
                type="button"
                onClick={onOpenUpgradeAdvisor}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-lime-50 dark:bg-lime-950/60 hover:bg-lime-100/80 dark:hover:bg-lime-900/50 border border-lime-300 dark:border-lime-800 text-lime-900 dark:text-lime-300 text-xs font-bold transition-all cursor-pointer shadow-xs"
                title="Plan Upgrade Advisor based on actual usage"
              >
                <Zap className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span className="hidden xl:inline">Upgrade Advisor</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenDemoModal}
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A4FD5] dark:hover:text-blue-400 px-2.5 py-2 transition-colors cursor-pointer"
            >
              {t.nav.talkToSales}
            </button>

            <button
              type="button"
              onClick={() => onOpenTrialModal('professional')}
              className="inline-flex items-center gap-2 text-sm font-bold bg-[#0A4FD5] hover:bg-[#07389B] text-white px-4 py-2.5 rounded-xl shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 transition-all cursor-pointer group"
            >
              <span>{t.nav.startTrial}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile right controls: Cart + Language + Currency + Status + Theme + menu button */}
          <div className="flex sm:hidden items-center gap-1">
            <button
              type="button"
              onClick={openCart}
              className="relative p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#84CC16] text-slate-950 text-[9px] font-black flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <LanguageSelector compact={true} />
            <RealTimeCurrencyWidget currentCurrency={currency} onCurrencyChange={onCurrencyChange} compact={true} />
            <ConnectionStatus compactOnMobile={true} />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0B192C] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-in slide-in-from-top-2">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.nav.statusDisplay}</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <ConnectionStatus />
              <LanguageSelector />
              <RealTimeCurrencyWidget currentCurrency={currency} onCurrencyChange={onCurrencyChange} />
              <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            </div>
          </div>

          <div className="flex flex-col space-y-3 text-base font-semibold text-slate-700 dark:text-slate-200">
            <a
              href="#plans"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#0A4FD5] dark:hover:text-blue-400"
            >
              {t.nav.pricingPlans}
            </a>
            <a
              href="#plan-matcher"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#0A4FD5] dark:hover:text-blue-400 flex items-center justify-between"
            >
              {t.nav.planMatcher}
              <span className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full">{t.nav.quizBadge}</span>
            </a>
            <a
              href="#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#0A4FD5] dark:hover:text-blue-400"
            >
              {t.nav.featureMatrix}
            </a>
            <a
              href="#ai-assistant"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#0A4FD5] dark:hover:text-blue-400"
            >
              {t.nav.aiAssistant}
            </a>
            <a
              href="#african-focus"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#0A4FD5] dark:hover:text-blue-400"
            >
              {t.nav.africanFocus}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#0A4FD5] dark:hover:text-blue-400"
            >
              {t.nav.faqs}
            </a>

            {/* Mobile Quick Action Tools */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {onOpenMilestones && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenMilestones();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-semibold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    Growth Milestones & Badges
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 dark:bg-amber-800 text-xs font-black">
                    3/6
                  </span>
                </button>
              )}

              {onOpenCompliance && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCompliance();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#0A4FD5] dark:text-blue-300 font-semibold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0A4FD5]" />
                    Tax & Statutory Calendar
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </button>
              )}

              {onOpenUpgradeAdvisor && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenUpgradeAdvisor();
                  }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-lime-50 dark:bg-lime-950/40 text-lime-900 dark:text-lime-300 font-semibold text-sm"
                >
                  <span className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-lime-600" />
                    Plan Upgrade Advisor (ROI)
                  </span>
                  <span className="text-xs bg-lime-200 dark:bg-lime-800 px-1.5 py-0.5 rounded font-bold">1-Click</span>
                </button>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTrialModal('professional');
              }}
              className="w-full text-center bg-[#0A4FD5] hover:bg-[#07389B] text-white font-bold py-3 px-4 rounded-xl shadow-md"
            >
              {t.common.startFreeTrial}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemoModal();
              }}
              className="w-full text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold py-2.5 px-4 rounded-xl"
            >
              {t.nav.talkToSales}
            </button>
          </div>
        </div>
      )}

      {/* Visual notification banner when operating in offline mode */}
      <OfflineBanner />
    </header>
  );
};

