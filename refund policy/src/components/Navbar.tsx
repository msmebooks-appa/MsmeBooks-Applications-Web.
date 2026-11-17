import React, { useState } from 'react';
import { ShieldCheck, Menu, X, ArrowUpRight } from 'lucide-react';
import { POLICY_METADATA } from '../data/policyData';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { OfflineBanner } from './OfflineBanner';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onRequestRefundClick: () => void;
  onAdminClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRequestRefundClick, onAdminClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 sm:gap-6 h-18">
          {/* Zone 1: Single brand wordmark element */}
          <a
            href="https://www.msmebooks.org"
            className="flex items-center gap-2.5 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 transition-transform duration-150 active:scale-95 shrink-0"
            aria-label="MsmeBooks Home"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-900 dark:bg-blue-800 flex items-center justify-center text-white shadow-sm ring-1 ring-lime-400/60">
              <span className="font-extrabold text-lg tracking-tighter text-white">
                M<span className="text-lime-400">B</span>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-blue-950 dark:text-white font-sans leading-none">
                Msme<span className="text-lime-600 dark:text-lime-400">Books</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-0.5">
                {t('nav.businessCloud', 'Business Cloud')}
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300" aria-label="Main Navigation">
            <a
              href="#overview"
              className="hover:text-blue-900 dark:hover:text-white transition-colors py-1 hover:border-b-2 hover:border-lime-500 whitespace-nowrap shrink-0"
            >
              {t('nav.overview', 'Overview')}
            </a>
            <a
              href="#subscriptions"
              className="hover:text-blue-900 dark:hover:text-white transition-colors py-1 hover:border-b-2 hover:border-lime-500 whitespace-nowrap shrink-0"
            >
              {t('nav.subscriptions', 'Subscriptions')}
            </a>
            <a
              href="#eligibility-matrix"
              className="hover:text-blue-900 dark:hover:text-white transition-colors py-1 hover:border-b-2 hover:border-lime-500 whitespace-nowrap shrink-0"
            >
              {t('nav.matrix', 'Eligibility Matrix')}
            </a>
            <a
              href="#refund-tracker"
              className="hover:text-blue-900 dark:hover:text-white transition-colors py-1 hover:border-b-2 hover:border-lime-500 whitespace-nowrap shrink-0"
            >
              {t('nav.tracker', 'Track Request')}
            </a>
            <a
              href="#faq-section"
              className="hover:text-blue-900 dark:hover:text-white transition-colors py-1 hover:border-b-2 hover:border-lime-500 whitespace-nowrap shrink-0"
            >
              {t('nav.faqs', 'FAQs')}
            </a>
          </nav>

          {/* Zone 3: Connection Status + Language Selector + Currency Selector + Theme Toggle + Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Visual Connection Status Indicator */}
            <ConnectionStatusIndicator />

            {/* Currency Selector */}
            <CurrencySelector />

            {/* Language Selector */}
            <LanguageSelector />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            <button
              onClick={onAdminClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
              title="Access simulated internal billing desk"
            >
              <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>{t('nav.staffPortal', 'Staff Portal')}</span>
            </button>

            <button
              onClick={onRequestRefundClick}
              className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 active:bg-blue-950 dark:bg-blue-800 dark:hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap shrink-0 border border-blue-950/20 dark:border-blue-700/50"
            >
              <span>{t('nav.requestRefund', 'Request Refund')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-lime-400" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Offline Alert Banner under main bar */}
      <OfflineBanner />

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 transition-colors duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Settings & Regional</span>
            <div className="flex items-center gap-1.5 flex-wrap justify-end">
              <ConnectionStatusIndicator compact />
              <CurrencySelector compact />
              <LanguageSelector compact />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <a
              href="#overview"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('nav.overview', 'Overview')}
            </a>
            <a
              href="#subscriptions"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('nav.subscriptions', 'Subscriptions')}
            </a>
            <a
              href="#addons"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('addons.title', 'Add-ons & Modules')}
            </a>
            <a
              href="#eligibility-matrix"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('nav.matrix', 'Eligibility Matrix')}
            </a>
            <a
              href="#cancellation-procedure"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('cancellation.title', 'Cancellation Guide')}
            </a>
            <a
              href="#refund-tracker"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('nav.tracker', 'Track Request')}
            </a>
            <a
              href="#refund-processing"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('gateways.title', 'Gateways & Timelines')}
            </a>
            <a
              href="#faq-section"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-white transition-colors"
            >
              {t('nav.faqs', 'FAQs')}
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onAdminClick();
              }}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              <span>{t('nav.staffPortal', 'Staff Portal')}</span>
            </button>
            <a
              href={`https://wa.me/${POLICY_METADATA.officialWhatsAppNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-blue-900 dark:text-lime-400 flex items-center gap-1"
            >
              <span>WhatsApp Support</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

