import React, { useState, useEffect } from 'react';
import {
  Shield,
  Menu,
  X,
  FileText,
  Phone,
  ExternalLink,
  SlidersHorizontal,
  Search,
  Sun,
  Moon,
  WifiOff
} from 'lucide-react';
import { POLICY_METADATA } from '../data/privacyPolicyData';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { LanguageSelector } from './LanguageSelector';
import { ConnectionStatus } from './ConnectionStatus';
import { CurrencySelector } from './CurrencySelector';

interface HeaderProps {
  onOpenPromptModal: () => void;
  onOpenCookieModal: () => void;
  onOpenRightsModal: (type?: string) => void;
  onOpenSearchFocus: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenPromptModal,
  onOpenCookieModal,
  onOpenRightsModal,
  onOpenSearchFocus,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { currencyMeta, exchangeRateNotice } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, scrolled)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top of screen Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-[3.5px] bg-slate-100/70 dark:bg-slate-800/70 overflow-hidden z-50 pointer-events-none"
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Document scroll progress through MsmeBooks 25-section privacy policy"
      >
        <div
          className="h-full bg-gradient-to-r from-[#1455C0] via-[#1455C0] to-[#B8E62E] transition-[width] duration-75 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#111C30]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
        {/* Top Banner Notice: Official Legal Document */}
        <div className="bg-[#172B4D] dark:bg-[#09101d] text-white py-1.5 px-4 text-xs font-normal border-b border-[#1455C0]/30 hidden sm:block">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#B8E62E]" aria-hidden="true" />
              <span>{t('header.banner', 'Official Pan-African & Global SaaS Data Privacy Governance & Trust Center')}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-300">{t('header.complianceNotice', 'Nigeria Data Protection Act (NDPA 2023) Aligned')}</span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <a
                href={`tel:${POLICY_METADATA.phone}`}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Phone className="w-3 h-3 text-[#B8E62E]" />
                <span>{POLICY_METADATA.phone}</span>
              </a>
              <span>·</span>
              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>{POLICY_METADATA.website}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Offline Mode Alert Banner */}
        {!isOnline && (
          <div
            role="status"
            aria-live="polite"
            className="bg-amber-500/15 dark:bg-amber-950/70 border-b border-amber-300/80 dark:border-amber-700/70 text-amber-950 dark:text-amber-200 py-1.5 px-4 text-xs font-medium transition-colors"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span>
                  {t(
                    'connection.offlineBanner',
                    'Operating in Offline Mode — All 25 policy sections, rights forms, and legal schedules are locally cached and fully accessible.'
                  )}
                </span>
              </div>
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-amber-200/90 dark:bg-amber-900/90 text-amber-950 dark:text-amber-200 px-2 py-0.5 rounded font-bold shrink-0">
                Offline Cache Active
              </span>
            </div>
          </div>
        )}

        {/* Main Top Bar adhering to 3-zone contract */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4 lg:gap-8">
          {/* Zone 1: Brand wordmark / single element */}
          <a href="#hero" className="flex items-center gap-2.5 text-slate-900 dark:text-white group shrink-0">
            <div className="w-9 h-9 rounded-lg bg-[#1455C0] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1 text-xl font-bold tracking-tight text-[#172B4D] dark:text-white">
                <span>Msme</span>
                <span className="text-[#1455C0] dark:text-[#5B95FF]">Books</span>
                <span className="w-2 h-2 rounded-full bg-[#B8E62E] inline-block mb-1" />
              </div>
            </div>
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#policy-content"
              className="hover:text-[#1455C0] dark:hover:text-[#5B95FF] transition-colors whitespace-nowrap"
            >
              {t('header.navPolicy', 'Privacy Policy')}
            </a>
            <a
              href="#rights-center"
              className="hover:text-[#1455C0] dark:hover:text-[#5B95FF] transition-colors whitespace-nowrap"
            >
              {t('header.navRights', 'Rights Centre')}
            </a>
            <a
              href="#security-pillars"
              className="hover:text-[#1455C0] dark:hover:text-[#5B95FF] transition-colors whitespace-nowrap"
            >
              {t('header.navTrust', 'Trust & Security')}
            </a>
            <a
              href="#legal-resources"
              className="hover:text-[#1455C0] dark:hover:text-[#5B95FF] transition-colors whitespace-nowrap"
            >
              {t('header.navLegal', 'Legal Hub')}
            </a>
            <a
              href="#faq"
              className="hover:text-[#1455C0] dark:hover:text-[#5B95FF] transition-colors whitespace-nowrap"
            >
              {t('header.navFaq', 'FAQ')}
            </a>
          </nav>

          {/* Zone 3: Actions + Language Selector + Theme Toggle */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 shrink-0">
            {scrollProgress > 1 && (
              <span
                className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-slate-100/90 dark:bg-slate-800/90 px-2 py-1 rounded-md border border-slate-200/80 dark:border-slate-700/80 transition-opacity"
                title="Reading progress through the policy"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1455C0] dark:bg-[#5B95FF]" />
                <span>{Math.round(scrollProgress)}% {t('header.read', 'read')}</span>
              </span>
            )}

            {/* Visual Connection Status Indicator */}
            <ConnectionStatus onStatusChange={setIsOnline} />

            {/* Global Currency Selector Dropdown */}
            <CurrencySelector />

            {/* Language Selector Dropdown */}
            <LanguageSelector />

            <button
              onClick={onOpenSearchFocus}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#1455C0] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              title={t('header.searchPolicy', 'Search Policy Sections')}
              aria-label={t('header.searchPolicy', 'Search Policy Sections')}
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Dark Mode Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 dark:text-slate-300 hover:text-[#1455C0] dark:hover:text-[#B8E62E] hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent dark:border-slate-700/60 rounded-lg transition-colors"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#B8E62E]" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => onOpenRightsModal()}
              className="px-3 py-2 text-xs font-semibold text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('header.privacyRequest', 'Privacy Request')}</span>
            </button>

            <button
              onClick={onOpenPromptModal}
              className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              title="Inspect & Copy the Master Prompt used for this system"
            >
              <FileText className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#B8E62E]" />
              <span>{t('header.masterPrompt', 'Master Prompt')}</span>
            </button>
          </div>

          {/* Mobile Menu Button + Quick Theme Switch + Connection Status */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ConnectionStatus isMobile={false} onStatusChange={setIsOnline} />
            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#B8E62E]" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onOpenRightsModal()}
              className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#1455C0] rounded-lg"
            >
              {t('header.privacyRequest', 'Rights')}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111C30] px-4 pt-3 pb-5 space-y-3 shadow-lg">
            {/* Mobile Connection Status, Currency & Language Selectors */}
            <div className="space-y-2.5">
              <ConnectionStatus isMobile={true} onStatusChange={setIsOnline} />
              <CurrencySelector isMobile={true} />
              <LanguageSelector isMobile={true} />
            </div>

            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200 pt-1">
              <a
                href="#policy-content"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-[#1455C0] dark:hover:text-[#5B95FF]"
              >
                {t('header.navPolicy', 'Privacy Policy (25 Sections)')}
              </a>
              <a
                href="#rights-center"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-[#1455C0] dark:hover:text-[#5B95FF]"
              >
                {t('header.navRights', 'Privacy & Data Rights Centre')}
              </a>
              <a
                href="#security-pillars"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-[#1455C0] dark:hover:text-[#5B95FF]"
              >
                {t('header.navTrust', 'Trust & Security Pillars')}
              </a>
              <a
                href="#legal-resources"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-[#1455C0] dark:hover:text-[#5B95FF]"
              >
                {t('header.navLegal', 'Related Legal Documents')}
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-[#1455C0] dark:hover:text-[#5B95FF]"
              >
                {t('header.navFaq', 'Privacy FAQ')}
              </a>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRightsModal();
                }}
                className="w-full py-2.5 px-4 text-xs font-semibold text-center text-white bg-[#1455C0] rounded-lg"
              >
                {t('rights.title', 'Submit Data Rights Request')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenCookieModal();
                }}
                className="w-full py-2 px-4 text-xs font-medium text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center gap-2"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#B8E62E]" />
                {t('policy.cookieBtn', 'Manage Cookie Preferences')}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPromptModal();
                }}
                className="w-full py-2 px-4 text-xs font-medium text-center text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-[#1455C0] dark:text-[#B8E62E]" />
                {t('header.masterPrompt', 'View Master Developer Prompt')}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
