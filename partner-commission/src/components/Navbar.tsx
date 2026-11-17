import React, { useState } from 'react';
import { Menu, X, ShieldCheck, ChevronRight, Sun, Moon, Compass, Sparkles } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenApplyModal: () => void;
  onOpenAdminModal: () => void;
  onOpenAgreementModal: () => void;
  onOpenTour?: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApplyModal,
  onOpenAdminModal,
  onOpenAgreementModal,
  onOpenTour,
  isDark,
  onToggleTheme
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1528]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-[#1261B5] flex items-center justify-center text-white shadow-sm shadow-[#1261B5]/20 group-hover:scale-105 transition-transform">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 7H16" stroke="#B9E51C" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M8 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="16.5" cy="15.5" r="1.5" fill="#B9E51C"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#142D4E] dark:text-white leading-none">
                  Msme<span className="text-[#1261B5] dark:text-[#B9E51C]">Books</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1">
                  Partner Ecosystem
                </span>
              </div>
            </a>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-[14px] font-medium text-slate-600 dark:text-slate-300">
            <a href="#tiers" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap">
              {t('nav.tiers')}
            </a>
            <a href="#categories" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap">
              {t('nav.categories')}
            </a>
            <a href="#calculator" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap">
              {t('nav.calculator')}
            </a>
            <a href="#dashboard" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap">
              {t('nav.dashboard')}
            </a>
            <a href="#leaderboard" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap flex items-center gap-1">
              <span>{t('nav.leaderboard')}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B9E51C]"></span>
            </a>
            <a href="#payouts" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap">
              {t('nav.payouts')}
            </a>
            <a href="#faq" className="hover:text-[#1261B5] dark:hover:text-[#B9E51C] transition-colors whitespace-nowrap">
              {t('nav.faq')}
            </a>
          </nav>

          {/* Zone 3: Actions + Connectivity + Language + Currency Selector + Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Visual Offline/Online Connection Status Indicator */}
            <ConnectionStatusIndicator />

            {/* Global Language Selector (EN, FR, PT, ES) */}
            <LanguageSelector align="right" />

            {/* Global Currency Selector */}
            <CurrencySelector align="right" />

            {/* Partner Tour Guide Button */}
            {onOpenTour && (
              <button
                type="button"
                onClick={onOpenTour}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-[#1261B5] dark:text-[#B9E51C] bg-[#1261B5]/10 dark:bg-[#1261B5]/20 hover:bg-[#1261B5]/20 dark:hover:bg-[#1261B5]/30 transition-colors flex items-center gap-1.5 border border-[#1261B5]/20"
                title="Take interactive partner onboarding tour"
              >
                <Compass className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">{t('nav.takeTour')}</span>
              </button>
            )}

            {/* Theme Toggle Button with Smooth Icon Transition */}
            <button
              onClick={onToggleTheme}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition-all duration-300 group overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#1261B5] dark:focus:ring-[#B9E51C] cursor-pointer"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Sun
                  className={`w-4 h-4 text-[#B9E51C] absolute transition-all duration-500 transform ${
                    isDark
                      ? 'rotate-0 scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(185,229,28,0.5)]'
                      : '-rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 text-[#142D4E] absolute transition-all duration-500 transform ${
                    isDark
                      ? 'rotate-90 scale-0 opacity-0'
                      : 'rotate-0 scale-100 opacity-100'
                  }`}
                />
              </div>
            </button>

            <button
              onClick={onOpenAdminModal}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#1261B5] dark:hover:text-[#B9E51C] px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
              title="Admin Partner Commission Control Panel"
            >
              <ShieldCheck className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
              <span className="hidden lg:inline">{t('nav.adminDemo')}</span>
            </button>

            <button
              onClick={onOpenApplyModal}
              className="px-3.5 py-2 text-xs font-bold text-white bg-[#1261B5] hover:bg-[#0e4e94] active:scale-[0.98] transition-all rounded-lg shadow-sm shadow-[#1261B5]/25 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{t('nav.apply')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <ConnectionStatusIndicator compact />
            <LanguageSelector align="right" compact />
            <CurrencySelector align="right" compact />

            <button
              onClick={onToggleTheme}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none cursor-pointer"
              aria-label="Toggle theme"
            >
              <div className="relative w-4 h-4 flex items-center justify-center">
                <Sun
                  className={`w-4 h-4 text-[#B9E51C] absolute transition-all duration-500 transform ${
                    isDark
                      ? 'rotate-0 scale-100 opacity-100 drop-shadow-[0_0_8px_rgba(185,229,28,0.5)]'
                      : '-rotate-90 scale-0 opacity-0'
                  }`}
                />
                <Moon
                  className={`w-4 h-4 text-[#142D4E] absolute transition-all duration-500 transform ${
                    isDark
                      ? 'rotate-90 scale-0 opacity-0'
                      : 'rotate-0 scale-100 opacity-100'
                  }`}
                />
              </div>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1528] px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#tiers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C]"
            >
              {t('nav.tiers')}
            </a>
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C]"
            >
              {t('nav.categories')}
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C]"
            >
              {t('nav.calculator')}
            </a>
            <a
              href="#dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C]"
            >
              {t('nav.dashboard')}
            </a>
            <a
              href="#leaderboard"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C] flex items-center justify-between"
            >
              <span>{t('nav.leaderboard')}</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#B9E51C]/20 text-emerald-800 dark:text-[#B9E51C]">Top 5</span>
            </a>
            <a
              href="#payouts"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C]"
            >
              {t('nav.payouts')}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-[#1261B5] dark:hover:text-[#B9E51C]"
            >
              {t('nav.faq')}
            </a>
            {onOpenTour && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTour();
                }}
                className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-[#1261B5] dark:text-[#B9E51C] font-semibold flex items-center gap-2"
              >
                <Compass className="w-4 h-4" />
                <span>{t('nav.takeTour')}</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAgreementModal();
              }}
              className="text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs"
            >
              {t('nav.agreement')}
            </button>
          </nav>

          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('nav.language')}:</span>
              <LanguageSelector align="left" />
            </div>

            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{t('nav.currency')}:</span>
              <CurrencySelector align="left" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApplyModal();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#1261B5] rounded-lg shadow-sm"
            >
              {t('nav.apply')}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="w-full py-2 text-center text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
              <span>{t('nav.adminDemo')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
