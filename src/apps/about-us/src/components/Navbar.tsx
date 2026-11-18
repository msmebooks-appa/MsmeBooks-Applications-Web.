import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { ThemeToggle } from './ThemeToggle';
import { ConnectionStatus, OfflineAlertBanner } from './ConnectionStatus';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { Menu, X, ChevronDown, Layers, ShoppingBag, BarChart3, Building } from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenGetStarted: () => void;
  onOpenPrompt?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, onOpenGetStarted }) => {
  const { t, currentLanguage, setLanguageCode, languages } = useLanguage();
  const { currentCurrency, setCurrencyCode, currencies } = useCurrency();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <OfflineAlertBanner />
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-white/95 dark:bg-black/95 backdrop-blur-md shadow-xs border-b border-slate-200/80 dark:border-zinc-800'
            : 'bg-white dark:bg-black border-b border-slate-100 dark:border-zinc-900'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-20">
            {/* Zone 1: Brand Wordmark */}
            <div className="shrink-0">
              <a
                href="#hero"
                className="flex items-center group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B4EA2] rounded-lg"
              >
                <BrandLogo showTagline={false} />
              </a>
            </div>

            {/* Zone 2: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
              {/* Products Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setProductsOpen(true)}
                onMouseLeave={() => setProductsOpen(false)}
              >
                <button
                  onClick={() => setProductsOpen(!productsOpen)}
                  className="flex items-center gap-1 hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] transition-colors py-2 focus:outline-none cursor-pointer"
                  aria-expanded={productsOpen}
                >
                  <span className="whitespace-nowrap">{t.nav_products}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${
                      productsOpen ? 'rotate-180 text-[#0B4EA2] dark:text-[#38BDF8]' : 'text-slate-400'
                    }`}
                  />
                </button>

                {productsOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white dark:bg-zinc-950 rounded-xl shadow-xl border border-slate-100 dark:border-zinc-800 p-2 py-3 mt-0 animate-in fade-in slide-in-from-top-1 z-50">
                    <a
                      href="#what-we-do"
                      onClick={() => setProductsOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-[#0B4EA2] dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:bg-[#0B4EA2] group-hover:text-white transition-colors">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8]">
                          {t.nav_prod_accounting_title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.nav_prod_accounting_desc}
                        </div>
                      </div>
                    </a>

                    <a
                      href="#what-we-do"
                      onClick={() => setProductsOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-lime-50 dark:bg-lime-950/60 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center shrink-0 group-hover:bg-[#84CC16] group-hover:text-slate-900 transition-colors">
                        <ShoppingBag className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8]">
                          {t.nav_prod_pos_title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.nav_prod_pos_desc}
                        </div>
                      </div>
                    </a>

                    <a
                      href="#what-we-do"
                      onClick={() => setProductsOpen(false)}
                      className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 group-hover:bg-slate-800 dark:group-hover:bg-zinc-800 group-hover:text-white transition-colors">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-[#0B4EA2] dark:group-hover:text-[#38BDF8]">
                          {t.nav_prod_inventory_title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {t.nav_prod_inventory_desc}
                        </div>
                      </div>
                    </a>
                  </div>
                )}
              </div>

              {/* Solutions */}
              <a
                href="#what-we-do"
                className="hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] transition-colors whitespace-nowrap"
              >
                {t.nav_solutions}
              </a>

              {/* Industries */}
              <a
                href="#who-we-serve"
                className="hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] transition-colors whitespace-nowrap"
              >
                {t.nav_industries}
              </a>

              {/* Partners */}
              <a
                href="#partners"
                className="hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] transition-colors whitespace-nowrap"
              >
                {t.nav_partners}
              </a>

              {/* About Us (Active) */}
              <a
                href="#our-story"
                className="text-[#0B4EA2] dark:text-[#38BDF8] font-semibold border-b-2 border-[#0B4EA2] dark:border-[#38BDF8] pb-0.5 whitespace-nowrap"
              >
                {t.nav_about}
              </a>

              {/* FAQs */}
              <a
                href="#faqs"
                className="hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] transition-colors whitespace-nowrap"
              >
                {t.nav_faq}
              </a>
            </nav>

            {/* Zone 3: Connection Status, Language & Currency Selectors, ThemeToggle, Action & Primary CTA */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <ConnectionStatus variant="desktop" />
              <LanguageSelector variant="desktop" />
              <CurrencySelector variant="desktop" />
              <ThemeToggle variant="desktop" />

              <button
                onClick={onOpenDemo}
                className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0B4EA2] dark:hover:text-[#38BDF8] transition-colors whitespace-nowrap px-2 py-2 cursor-pointer"
              >
                {t.nav_book_demo}
              </button>

              <button
                onClick={onOpenGetStarted}
                className="px-4 py-2.5 text-sm font-semibold text-white bg-[#0B4EA2] rounded-xl hover:bg-[#083770] shadow-xs transition-all duration-150 whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t.nav_get_started}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]"></span>
              </button>
            </div>

            {/* Mobile Menu Button, ConnectionStatus, Language, Currency & Theme Selectors */}
            <div className="flex lg:hidden items-center gap-1.5">
              <ConnectionStatus variant="mobile" />
              <LanguageSelector variant="mobile" />
              <CurrencySelector variant="mobile" />
              <ThemeToggle variant="mobile" />
              <button
                onClick={onOpenGetStarted}
                className="px-2.5 py-1.5 text-xs font-semibold text-white bg-[#0B4EA2] rounded-lg whitespace-nowrap"
              >
                {t.nav_start_free}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-900 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-black px-4 pt-4 pb-6 space-y-3 shadow-lg">
            {/* Language quick-toggle bar inside mobile drawer */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.lang_menu_title}:
              </span>
              <div className="flex items-center gap-1.5">
                {languages.map((lang) => {
                  const active = lang.code === currentLanguage.code;
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguageCode(lang.code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#0B4EA2] text-white'
                          : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800'
                      }`}
                    >
                      {lang.flag} {lang.nativeName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currency quick-toggle bar inside mobile drawer */}
            <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 shrink-0">
                {currentCurrency.flag} {currentCurrency.code}
              </span>
              <div className="flex items-center gap-1 overflow-x-auto">
                {['NGN', 'KES', 'ZAR', 'GHS', 'USD', 'EUR'].map((code) => {
                  const cfg = currencies.find((c) => c.code === code);
                  if (!cfg) return null;
                  const active = cfg.code === currentCurrency.code;
                  return (
                    <button
                      key={cfg.code}
                      type="button"
                      onClick={() => setCurrencyCode(cfg.code)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold transition-colors cursor-pointer shrink-0 ${
                        active
                          ? 'bg-[#0B4EA2] text-white'
                          : 'bg-white dark:bg-zinc-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-zinc-800'
                      }`}
                    >
                      {cfg.code}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Connection Status card in mobile drawer */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200/70 dark:border-zinc-800">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.nav_mobile_network}
              </span>
              <ConnectionStatus variant="desktop" />
            </div>

            <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100 dark:border-zinc-800">
              <a
                href="#what-we-do"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-zinc-950 border border-transparent dark:border-zinc-800 flex items-center gap-2"
              >
                <Layers className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-[#38BDF8]" />
                {t.nav_mobile_tools}
              </a>
              <a
                href="#who-we-serve"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-zinc-950 border border-transparent dark:border-zinc-800 flex items-center gap-2"
              >
                <Building className="w-3.5 h-3.5 text-[#84CC16]" />
                {t.nav_mobile_industries}
              </a>
            </div>

            <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <a
                href="#hero"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_overview}
              </a>
              <a
                href="#our-story"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900 text-[#0B4EA2] dark:text-[#38BDF8] font-semibold"
              >
                {t.nav_mobile_story}
              </a>
              <a
                href="#mission-vision"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_mission}
              </a>
              <a
                href="#problem"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_problem}
              </a>
              <a
                href="#what-we-do"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_capabilities}
              </a>
              <a
                href="#pan-african"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_africa}
              </a>
              <a
                href="#partners"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_partners}
              </a>
              <a
                href="#trust-security"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_security}
              </a>
              <a
                href="#faqs"
                onClick={() => setMobileMenuOpen(false)}
                className="px-2 py-1.5 rounded hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_mobile_faqs}
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-900"
              >
                {t.nav_book_demo}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenGetStarted();
                }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-[#0B4EA2] rounded-xl hover:bg-[#083770]"
              >
                {t.nav_mobile_trial}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
