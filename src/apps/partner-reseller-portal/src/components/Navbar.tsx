import React, { useState } from 'react';
import { MsmeLogo } from './MsmeLogo';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X, ArrowUpRight, ShieldCheck, UserCheck } from 'lucide-react';

interface NavbarProps {
  onOpenApply: () => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
  activeView: 'landing' | 'portal' | 'admin';
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApply,
  onOpenPortal,
  onOpenAdmin,
  activeView
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 lg:gap-6 h-20">
          {/* Zone 1: Brand wordmark */}
          <a
            href="/"
            className="flex items-center focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0046B8] dark:focus-visible:ring-lime-400 rounded-md shrink-0"
            aria-label="MsmeBooks Home"
          >
            <MsmeLogo size="md" />
          </a>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#categories"
              className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('nav.categories', 'Categories')}
            </a>
            <a
              href="#commission-tiers"
              className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('nav.commissionTiers', 'Commission Tiers')}
            </a>
            <a
              href="#calculator"
              className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('nav.calculator', 'Earnings Calculator')}
            </a>
            <a
              href="#agreement"
              className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('nav.agreement', 'Partner Agreement')}
            </a>
            <a
              href="#faq"
              className="hover:text-[#0046B8] dark:hover:text-lime-400 transition-colors whitespace-nowrap shrink-0 py-1"
            >
              {t('nav.faq', 'FAQ')}
            </a>
          </nav>

          {/* Zone 3: Global Language Selector, Currency Selector, Theme Toggle, Interactive Portals & Primary CTA */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2 shrink-0">
            {/* Global Language Selector Dropdown */}
            <LanguageSelector />

            {/* Global Currency Selector Dropdown */}
            <CurrencySelector />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Quick Portal Access */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-xs font-semibold transition-colors">
              <button
                type="button"
                onClick={onOpenPortal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  activeView === 'portal'
                    ? 'bg-white dark:bg-slate-900 text-[#0046B8] dark:text-lime-400 shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="View Live Partner Dashboard"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                <span className="whitespace-nowrap">{t('nav.partnerPortal', 'Partner Portal')}</span>
              </button>
              <button
                type="button"
                onClick={onOpenAdmin}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
                  activeView === 'admin'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Administrator Approval Desk"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span className="whitespace-nowrap">{t('nav.adminDesk', 'Admin Desk')}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onOpenApply}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 lg:px-4 py-2 text-sm font-bold text-white bg-[#0046B8] hover:bg-[#003893] active:scale-[0.98] rounded-xl transition-all shadow-sm hover:shadow whitespace-nowrap shrink-0"
            >
              <span>{t('nav.becomePartner', 'Become a Partner')}</span>
              <ArrowUpRight className="w-4 h-4 text-lime-300" />
            </button>
          </div>

          {/* Mobile Menu & Selector Triggers */}
          <div className="flex sm:hidden items-center gap-1">
            <LanguageSelector />
            <CurrencySelector compact />
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 dark:text-slate-200 hover:text-[#0046B8] dark:hover:text-lime-400 rounded-lg"
              aria-label={mobileMenuOpen ? t('nav.closeMenu', 'Close menu') : t('nav.openMenu', 'Open menu')}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3 transition-colors duration-200">
          <nav className="flex flex-col space-y-2 text-base font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#categories"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('nav.categories', 'Partner Categories')}
            </a>
            <a
              href="#commission-tiers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('nav.commissionTiers', 'Commission Tiers')}
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('nav.calculator', 'Earnings Calculator')}
            </a>
            <a
              href="#agreement"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('nav.agreement', 'Partner Agreement')}
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2.5 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              {t('nav.faq', 'FAQ')}
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <div className="flex items-center justify-between py-1 px-2.5 text-xs text-slate-500 dark:text-slate-400">
              <span>Color Theme</span>
              <ThemeToggle showLabel />
            </div>

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-[#0046B8] dark:text-lime-400 bg-blue-50 dark:bg-slate-800 rounded-xl"
            >
              <UserCheck className="w-4 h-4 text-[#84CC16]" />
              <span>{t('nav.partnerPortal', 'Partner Portal')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 rounded-xl"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t('nav.adminDesk', 'Admin Desk')}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply();
              }}
              className="w-full py-3 text-center text-sm font-bold text-white bg-[#0046B8] rounded-xl shadow"
            >
              {t('nav.becomePartner', 'Become a Partner Today')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
