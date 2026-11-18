import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { Language, TranslationDictionary } from '../data/translations';

interface HeaderProps {
  onOpenAcceptanceDemo: () => void;
  onOpenChecklist: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  t: TranslationDictionary;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAcceptanceDemo, 
  onOpenChecklist,
  theme,
  onToggleTheme,
  language,
  onLanguageChange,
  t
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#07131F]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/90 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strictly compliant 3-zone Top Bar Contract */}
        <div className="flex items-center justify-between gap-4 lg:gap-8 h-18">
          {/* Zone 1: Brand Wordmark */}
          <a
            href="/"
            className="flex items-center whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
            aria-label="MsmeBooks Home"
          >
            <Logo size="md" />
          </a>

          {/* Zone 2: Concise single-line navigation links */}
          <nav className="hidden xl:flex items-center gap-6 xl:gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#section-4"
              className="hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.platform}
            </a>
            <a
              href="#section-11"
              className="hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.solutions}
            </a>
            <a
              href="#section-5"
              className="hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.pricing}
            </a>
            <a
              href="#related-documents"
              className="hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:underline underline-offset-8 transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.resources}
            </a>
            <a
              href="#legal-content"
              className="text-[#0B3558] dark:text-[#84CC16] font-semibold underline underline-offset-8 decoration-[#84CC16] decoration-2 whitespace-nowrap shrink-0"
            >
              {t.nav.legal}
            </a>
          </nav>

          {/* Zone 3: Connection Status Indicator + Currency Selector + Language Selector + Theme Toggle + Actions */}
          <div className="hidden sm:flex items-center gap-2 lg:gap-2.5 shrink-0">
            {/* Connection Status Indicator */}
            <ConnectionStatusIndicator variant="navbar" />

            {/* Global Currency Selector */}
            <CurrencySelector />

            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />

            {/* Theme Toggle Button */}
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />

            <button
              onClick={onOpenChecklist}
              className="px-2.5 lg:px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-[#0D2238] hover:bg-slate-200 dark:hover:bg-[#102A44] border border-transparent dark:border-slate-700/80 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3558]"
              title="View unresolved placeholders for qualified legal counsel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0B3558] dark:text-[#84CC16]" />
              <span className="hidden lg:inline">{t.nav.checklist}</span>
            </button>

            <button
              onClick={onOpenAcceptanceDemo}
              className="px-3 lg:px-3.5 py-2 text-xs font-semibold text-white bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#104A7F] border border-transparent dark:border-blue-800/60 rounded-lg transition-all shadow-xs whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#84CC16]"
            >
              {t.nav.consentSimulator}
            </button>
          </div>

          {/* Mobile hamburger button + Connection Indicator + Currency + Language Selector + Theme Toggle */}
          <div className="flex sm:hidden items-center gap-1.5">
            <ConnectionStatusIndicator variant="compact" />
            <CurrencySelector />
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:text-[#0B3558] dark:hover:text-[#84CC16] focus-visible:outline-2 focus-visible:outline-[#84CC16] rounded-lg"
              aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0A1A2C] px-4 pt-3 pb-6 space-y-3 shadow-xl transition-colors">
          <nav className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="#section-4"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#0D2238] hover:text-[#0B3558] dark:hover:text-[#84CC16]"
            >
              {t.nav.platform}
            </a>
            <a
              href="#section-11"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#0D2238] hover:text-[#0B3558] dark:hover:text-[#84CC16]"
            >
              {t.nav.solutions}
            </a>
            <a
              href="#section-5"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#0D2238] hover:text-[#0B3558] dark:hover:text-[#84CC16]"
            >
              {t.nav.pricing}
            </a>
            <a
              href="#related-documents"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#0D2238] hover:text-[#0B3558] dark:hover:text-[#84CC16]"
            >
              {t.nav.resources}
            </a>
            <a
              href="#legal-content"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-[#0D2238] hover:text-[#0B3558] dark:hover:text-[#84CC16] font-semibold text-[#0B3558] dark:text-[#84CC16]"
            >
              {t.nav.legal}
            </a>
          </nav>
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2.5">
            {/* Connection Status Indicator in mobile drawer */}
            <div className="px-1">
              <ConnectionStatusIndicator variant="full" />
            </div>

            <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Currency</span>
              <CurrencySelector variant="full" />
            </div>

            <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Language</span>
              <LanguageSelector
                currentLanguage={language}
                onLanguageChange={onLanguageChange}
                variant="full"
              />
            </div>

            <div className="flex items-center justify-between px-3 py-1 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-medium">Color Theme</span>
              <ThemeToggle theme={theme} onToggle={onToggleTheme} variant="segmented" />
            </div>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChecklist();
              }}
              className="w-full py-2.5 px-3 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#0D2238] border border-transparent dark:border-slate-700/60 rounded-lg text-center flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-[#0B3558] dark:text-[#84CC16]" />
              {t.nav.checklist}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAcceptanceDemo();
              }}
              className="w-full py-2.5 px-3 text-xs font-semibold text-white bg-[#0B3558] dark:bg-[#0E3F6D] rounded-lg text-center"
            >
              {t.nav.consentSimulator}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
