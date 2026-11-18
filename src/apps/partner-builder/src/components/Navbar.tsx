import React, { useState } from 'react';
import { Menu, X, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { LanguageSwitcher } from './LanguageSwitcher';
import { CurrencySelector } from './CurrencySelector';
import { HeaderCurrencyToggle } from './HeaderCurrencyToggle';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { ThemeToggle } from './ThemeToggle';
import { AccessibilitySettingsMenu } from './AccessibilitySettingsMenu';
import { PartnerNotificationsSlideOver } from './PartnerNotificationsSlideOver';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenApply: () => void;
  onOpenVerify: () => void;
  onOpenPortal: () => void;
  onOpenAdmin: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenApply,
  onOpenVerify,
  onOpenPortal,
  onOpenAdmin,
  darkMode,
  onToggleDarkMode
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#061F4A]/95 backdrop-blur-md border-b border-slate-200 dark:border-blue-900/60 transition-colors duration-200">
      {/* Offline Alert Banner (Renders automatically when disconnected or simulated) */}
      <ConnectionStatusIndicator showBanner={true} className="hidden" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <a href="#" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-[#0A3981] dark:bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-md border border-[#0A3981]/20 dark:border-blue-400/30">
            <span className="text-white">M</span>
            <span className="text-[#8CE600] -ml-0.5">b</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-[#0A3981] dark:text-white leading-tight">
              {t('nav.brand_name', 'MsmeBooks')}
            </span>
            <span className="text-xs font-semibold tracking-wider text-slate-500 dark:text-blue-200 uppercase">
              {t('nav.partner_programme', 'Partner Programme')}
            </span>
          </div>
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <a href="#tiers" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.tiers', 'Tiers & Badges')}
          </a>
          <a href="#benefits" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.benefits', 'Benefits')}
          </a>
          <a href="#integrations" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            {t('nav.integrations', 'Audit Integrations')}
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#8CE600]/20 text-[#0A3981] dark:text-[#8CE600]">
              25+
            </span>
          </a>
          <a href="#directory" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.directory', 'Partner Directory')}
          </a>
          <a href="#calculator" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.calculator', 'Commission Calculator')}
          </a>
          <a href="#academy" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.academy', 'Certification Academy')}
          </a>
          <a href="#impact" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5">
            <span>{t('nav.impact', 'Partner Impact')}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </a>
          <a href="#partner-rewards" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
            <span>{t('nav.rewards', 'P2P Rewards')}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600]">
              $150+
            </span>
          </a>
          <a href="#resources" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.resources', 'Resources')}
          </a>
          <a href="#faq" className="hover:text-[#0A3981] dark:hover:text-[#8CE600] transition-colors whitespace-nowrap shrink-0">
            {t('nav.faq', 'FAQ')}
          </a>
        </nav>

        {/* Zone 3: Controls, Selectors & Actions */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {/* Visual Connection Status Indicator */}
          <ConnectionStatusIndicator showBanner={false} />

          {/* Dynamic Header Currency Toggle (USD, EUR, GBP, INR + 16 Currencies Dropdown) */}
          <HeaderCurrencyToggle />

          {/* Language Switcher (EN, FR, PT, ES, SW, AR, HA, YO) */}
          <LanguageSwitcher />

          {/* Partner Notifications Bell & Slide-Over Panel */}
          <PartnerNotificationsSlideOver
            variant="navbar"
            onNavigateToTab={() => onOpenPortal()}
          />

          {/* Dark / Light Theme Toggle */}
          <ThemeToggle
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
          />

          {/* WCAG 2.1 AA Accessibility Settings Menu */}
          <AccessibilitySettingsMenu />

          <button
            onClick={onOpenVerify}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] hover:bg-slate-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            title="Verify partner accreditation"
          >
            <ShieldCheck className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
            <span className="hidden xl:inline">{t('nav.verify_partner', 'Verify Partner')}</span>
          </button>

          <button
            onClick={onOpenPortal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/70 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            title="Open Partner Dashboard Portal Demo"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>{t('nav.partner_portal', 'Partner Portal')}</span>
          </button>

          <button
            onClick={onOpenApply}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0A3981] hover:bg-[#072c66] active:bg-[#051f47] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-xl shadow-sm transition-all transform hover:-translate-y-0.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            {t('nav.become_partner', 'Become a Partner')}
          </button>

          <button
            onClick={onOpenAdmin}
            className="text-[11px] font-medium text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-white px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer"
            title="Demo Admin Console"
          >
            {t('nav.admin_console', 'Admin')}
          </button>
        </div>

        {/* Mobile Controls: Connection Status, Currency, Language, Notifications, Theme, Menu */}
        <div className="flex lg:hidden items-center gap-1.5">
          <ConnectionStatusIndicator showBanner={false} />
          <HeaderCurrencyToggle className="hidden sm:flex" />
          <div className="sm:hidden">
            <CurrencySelector />
          </div>
          <LanguageSwitcher />

          <PartnerNotificationsSlideOver
            variant="navbar"
            onNavigateToTab={() => onOpenPortal()}
          />

          <ThemeToggle
            darkMode={darkMode}
            onToggleDarkMode={onToggleDarkMode}
          />

          <AccessibilitySettingsMenu />

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-blue-900/50 cursor-pointer border border-slate-200 dark:border-blue-800/60"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-blue-900/60 bg-white dark:bg-[#061F4A] px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Header Currency Toggle */}
          <div className="pb-3 border-b border-slate-100 dark:border-blue-900/60">
            <div className="text-xs font-bold text-slate-500 dark:text-blue-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Currency Toggle (Updates Calculator)</span>
              <span className="text-[10px] text-emerald-600 dark:text-[#8CE600] font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                Live Sync
              </span>
            </div>
            <HeaderCurrencyToggle className="w-full justify-between" />
          </div>

          {/* Mobile Language Switcher Selector Grid */}
          <div className="pb-3 border-b border-slate-100 dark:border-blue-900/60">
            <LanguageSwitcher variant="mobile" />
          </div>

          {/* Mobile Accessibility Settings */}
          <div className="pb-3 border-b border-slate-100 dark:border-blue-900/60">
            <AccessibilitySettingsMenu variant="mobile" />
          </div>

          <a
            href="#tiers"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.tiers', 'Tiers & Badges')}
          </a>
          <a
            href="#benefits"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.benefits', 'Benefits')}
          </a>
          <a
            href="#integrations"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] flex items-center justify-between"
          >
            <span>{t('nav.integrations', 'Audit Integrations')}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#8CE600]/20 text-[#0A3981] dark:text-[#8CE600]">
              25+ Software
            </span>
          </a>
          <a
            href="#directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.directory', 'Partner Directory')}
          </a>
          <a
            href="#calculator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.calculator', 'Commission Calculator')}
          </a>
          <a
            href="#academy"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.academy', 'Certification Academy')}
          </a>
          <a
            href="#impact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] flex items-center justify-between"
          >
            <span>{t('nav.impact', 'Partner Impact')}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600]">
              $2.4M+ Paid
            </span>
          </a>
          <a
            href="#partner-rewards"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600] flex items-center justify-between"
          >
            <span>{t('nav.rewards', 'P2P Rewards')}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600]">
              $150+ Bounty
            </span>
          </a>
          <a
            href="#resources"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.resources', 'Resources')}
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0A3981] dark:hover:text-[#8CE600]"
          >
            {t('nav.faq', 'FAQ')}
          </a>

          <div className="pt-3 border-t border-slate-100 dark:border-blue-900/60 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVerify();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-blue-950 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              {t('nav.verify_partner', 'Verify Partner')}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenPortal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-sm font-semibold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800 rounded-lg"
            >
              <LayoutDashboard className="w-4 h-4" />
              {t('nav.partner_portal', 'Partner Portal')}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply();
              }}
              className="w-full py-2.5 text-sm font-bold text-white bg-[#0A3981] dark:bg-blue-600 rounded-lg shadow-sm"
            >
              {t('nav.become_partner', 'Become a Partner')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

