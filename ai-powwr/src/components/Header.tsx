import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { useI18n } from '../context/I18nContext';
import { REGIONS_DATA, RegionInfo } from '../data/productModules';
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  Settings,
  Sparkles,
  Search,
  ExternalLink,
  PhoneCall,
  Sun,
  Moon
} from 'lucide-react';

interface HeaderProps {
  currentRegion: RegionInfo;
  onSelectRegion: (region: RegionInfo) => void;
  onOpenAdmin: () => void;
  onOpenAiAssistant: () => void;
  onSearchFocus: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRegion,
  onSelectRegion,
  onOpenAdmin,
  onOpenAiAssistant,
  onSearchFocus,
  isDark,
  onToggleTheme
}) => {
  const { t, isRTL } = useI18n();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0B132B]/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-[#0B132B] border-b border-slate-100 dark:border-slate-800'
      }`}
    >
      {/* Top Banner with Telephone, Localization, Language, Currency and Quick Theme Toggle */}
      <div className="bg-[#1254B5] dark:bg-[#092B60] text-white text-xs py-1.5 px-4 sm:px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#B7E522] animate-pulse"></span>
              {t('nav.allInOneSaaS', 'All-in-One Cloud SaaS for Africa & Global Commerce')}
            </span>
            <span className="hidden md:inline text-blue-200 dark:text-blue-300">|</span>
            <a
              href="tel:+2349158482622"
              className="hidden sm:inline-flex items-center gap-1 text-white hover:text-[#B7E522] transition-colors font-medium"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#B7E522]" />
              {t('nav.directSupport', 'Direct Support')}: +234 915 848 2622
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Visual Connection Status Indicator (Online / Offline mode) */}
            <ConnectionStatusIndicator variant="topbar" />

            {/* Language Selector Dropdown (EN, FR, ES, AR) */}
            <LanguageSelector variant="topbar" />

            {/* Global Currency Selector */}
            <CurrencySelector variant="topbar" />

            {/* Theme Toggle (Top bar quick switch) */}
            <button
              onClick={onToggleTheme}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-700 dark:bg-blue-900/60 dark:hover:bg-blue-800 text-white font-medium text-xs transition cursor-pointer"
              title={isDark ? t('nav.light', 'Switch to light mode') : t('nav.dark', 'Switch to dark mode')}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-[#B7E522]" />
                  <span className="hidden sm:inline text-[#B7E522]">{t('nav.light', 'Light')}</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-blue-200" />
                  <span className="hidden sm:inline">{t('nav.dark', 'Dark')}</span>
                </>
              )}
            </button>

            {/* Quick Region Selector in Top Bar */}
            <div className="relative">
              <button
                onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-700/60 hover:bg-blue-700 dark:bg-blue-900/60 dark:hover:bg-blue-800 text-white font-medium text-xs transition"
                aria-expanded={regionDropdownOpen}
              >
                <span>{currentRegion.flag}</span>
                <span className="hidden sm:inline">{currentRegion.country}</span>
                <span className="text-[11px] text-[#B7E522] font-mono">({currentRegion.currency})</span>
                <ChevronDown className="w-3 h-3 text-white/80" />
              </button>

              {regionDropdownOpen && (
                <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-1 w-56 bg-white dark:bg-[#131E36] rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 text-slate-800 dark:text-slate-100 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                    {t('nav.selectMarket', 'Select Your Market')}
                  </div>
                  {REGIONS_DATA.map((region) => (
                    <button
                      key={region.code}
                      onClick={() => {
                        onSelectRegion(region);
                        setRegionDropdownOpen(false);
                      }}
                      className={`w-full text-left rtl:text-right px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/60 transition ${
                        currentRegion.code === region.code
                          ? 'bg-blue-50/80 dark:bg-blue-900/40 font-bold text-[#1254B5] dark:text-[#B7E522]'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{region.flag}</span>
                        <span>{region.country}</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {region.currency}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin CMS Trigger */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-white transition"
              title="Open FAQ Content Management System"
            >
              <Settings className="w-3 h-3 text-[#B7E522]" />
              <span className="hidden md:inline">{t('nav.adminCms', 'Admin CMS')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <a href="/" className="flex items-center">
            <Logo showTagline={true} />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a href="/" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.home', 'Home')}
            </a>
            
            <div className="relative group">
              <button
                onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
                className="inline-flex items-center gap-1 hover:text-[#1254B5] dark:hover:text-[#B7E522] transition py-2 cursor-pointer"
              >
                <span>{t('nav.products', 'Products & Solutions')}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-slate-400 group-hover:text-[#1254B5] dark:group-hover:text-[#B7E522]" />
              </button>
              <div className="absolute left-0 rtl:left-auto rtl:right-0 mt-0 w-64 bg-white dark:bg-[#131E36] rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 hidden group-hover:block z-50">
                <a href="#accounting" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-xs">
                  <span className="font-semibold block text-[#1254B5] dark:text-[#3B82F6]">Accounting & General Ledger</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">P&L, balance sheets, VAT & chart of accounts</span>
                </a>
                <a href="#pos" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-xs">
                  <span className="font-semibold block text-[#1254B5] dark:text-[#3B82F6]">Point of Sale (POS)</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Fast retail checkout, printers & barcode scanning</span>
                </a>
                <a href="#inventory" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-xs">
                  <span className="font-semibold block text-[#1254B5] dark:text-[#3B82F6]">Inventory & Warehousing</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Multi-warehouse stock, batches & expiry alerts</span>
                </a>
                <a href="#hotel-management" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#1254B5] dark:text-[#3B82F6]">Hotel PMS Add-on</span>
                    <span className="text-[10px] bg-[#F4FCD9] text-[#17233D] px-1.5 py-0.5 rounded font-bold">New</span>
                  </div>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Reservations, folios, housekeeping & dining</span>
                </a>
                <a href="#hr-payroll" className="block px-4 py-2 hover:bg-blue-50 dark:hover:bg-slate-700/50 text-slate-800 dark:text-slate-100 text-xs">
                  <span className="font-semibold block text-[#1254B5] dark:text-[#3B82F6]">HR & Payroll</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Wages, statutory deductions & automated payslips</span>
                </a>
              </div>
            </div>

            <a href="#industries" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.industries', 'Industries')}
            </a>
            <a href="#features" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.features', 'Features')}
            </a>
            <a href="#marketplace" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.marketplace', 'Marketplace')}
            </a>
            <a href="#pricing" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.pricing', 'Pricing')}
            </a>
            <a href="#partners" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.partners', 'Partners')}
            </a>
            
            <div className="relative">
              <a
                href="#faq-hub"
                className="inline-flex items-center gap-1.5 text-[#1254B5] dark:text-[#B7E522] font-semibold bg-blue-50/80 dark:bg-blue-950/60 px-2.5 py-1 rounded-full border border-blue-200/60 dark:border-blue-800"
              >
                <span>{t('nav.faq', 'Help & FAQ')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1254B5] dark:bg-[#B7E522]"></span>
              </a>
            </div>
            
            <a href="#about" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.about', 'About Us')}
            </a>
            <a href="#contact" className="hover:text-[#1254B5] dark:hover:text-[#B7E522] transition">
              {t('nav.contact', 'Contact')}
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Visual Connection Status Indicator */}
            <ConnectionStatusIndicator variant="navbar" />

            <button
              onClick={onSearchFocus}
              className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#1254B5] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
              title="Search FAQ Knowledge Base"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector Dropdown (Compact variant) */}
            <LanguageSelector variant="compact" />

            {/* Desktop Global Currency Selector */}
            <CurrencySelector variant="compact" />

            {/* Desktop Theme Toggle Pill */}
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-500 dark:text-slate-300 hover:text-[#1254B5] dark:hover:text-[#B7E522] hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition cursor-pointer"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#B7E522]" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#17233D] bg-[#F4FCD9] hover:bg-[#B7E522] border border-[#B7E522] transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1254B5]" />
              <span>{t('nav.askAi', 'Ask AI Assistant')}</span>
            </button>

            <a
              href="#login"
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#1254B5] dark:hover:text-white px-2 py-2 transition"
            >
              {t('nav.login', 'Login')}
            </a>

            <a
              href="#get-started"
              className="inline-flex items-center justify-center px-3.5 py-2 rounded-lg text-sm font-bold text-white bg-[#1254B5] hover:bg-[#0A3D87] shadow-sm hover:shadow transition transform active:scale-95"
            >
              {t('nav.getStarted', 'Get Started Free')}
            </a>
          </div>

          {/* Mobile menu toggle & connection indicator */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Mobile Connection Status Indicator */}
            <ConnectionStatusIndicator variant="topbar" />

            {/* Mobile Fast Currency Toggle */}
            <CurrencySelector variant="mobile-nav" />

            <button
              onClick={onToggleTheme}
              className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#B7E522]" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenAiAssistant}
              className="p-2 text-slate-700 bg-[#F4FCD9] rounded-lg border border-[#B7E522]"
              title="Ask AI"
            >
              <Sparkles className="w-4 h-4 text-[#1254B5]" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0B132B] border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            <a
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {t('nav.home', 'Home')}
            </a>
            <a
              href="#accounting"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-between"
            >
              <span>{t('nav.products', 'Products & Solutions')}</span>
              <span className="text-xs text-slate-400">Accounting, POS, PMS</span>
            </a>
            <a
              href="#industries"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {t('nav.industries', 'Industries (20 Sectors)')}
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {t('nav.pricing', 'Pricing & Free Plan')}
            </a>
            <a
              href="#partners"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 flex items-center justify-between"
            >
              <span>{t('nav.partners', 'Partners & Resellers')}</span>
              <span className="text-xs bg-[#B7E522] text-[#17233D] px-2 py-0.5 rounded font-bold">Up to 40%</span>
            </a>
            <a
              href="#faq-hub"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1254B5] dark:text-[#B7E522] font-bold"
            >
              {t('nav.faq', 'FAQ & Knowledge Centre')}
            </a>
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {t('nav.about', 'About Us')}
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100"
            >
              {t('nav.contact', 'Contact Us')}
            </a>
          </nav>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {/* Mobile Connection Status & Diagnostics */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block px-1 uppercase tracking-wider">
                {t('conn.diagnosticsTitle', 'Connection & Sync Status')}
              </span>
              <ConnectionStatusIndicator variant="drawer" />
            </div>

            {/* Mobile Language Selector */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block px-1 uppercase tracking-wider">
                {t('nav.language', 'Language')}
              </span>
              <LanguageSelector variant="drawer" />
            </div>

            {/* Mobile Global Currency Selector */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block px-1 uppercase tracking-wider">
                {t('nav.currency', 'Select Active Currency')}
              </span>
              <CurrencySelector variant="drawer" />
            </div>

            <button
              onClick={() => {
                onToggleTheme();
              }}
              className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60"
            >
              <div className="flex items-center gap-2">
                {isDark ? <Sun className="w-4 h-4 text-[#B7E522]" /> : <Moon className="w-4 h-4 text-[#1254B5]" />}
                <span>{t('nav.theme', 'Color Theme')}</span>
              </div>
              <span className="font-bold text-[#1254B5] dark:text-[#B7E522]">
                {isDark ? 'Dark Mode (Navy)' : 'Light Mode'}
              </span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800"
            >
              <Settings className="w-3.5 h-3.5 text-[#1254B5] dark:text-[#B7E522]" />
              {t('nav.adminCms', 'Manage FAQ Database (Admin CMS)')}
            </button>
            <a
              href="#login"
              className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800"
            >
              {t('nav.login', 'Login')}
            </a>
            <a
              href="#get-started"
              className="w-full text-center py-2.5 px-4 rounded-lg text-sm font-bold text-white bg-[#1254B5]"
            >
              {t('nav.getStarted', 'Get Started Free')}
            </a>
          </div>
        </div>
      )}

      {/* Visual Offline Notification Banner */}
      <ConnectionStatusIndicator variant="banner" />
    </header>
  );
};
