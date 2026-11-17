import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe2, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Phone, 
  ExternalLink,
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  WifiOff,
  Database,
  QrCode,
  Camera
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { CurrencyToggle } from './CurrencyToggle';
import { PWAInstallButton } from './PWAInstallButton';
import { ConnectionStatusBadge } from './ConnectionStatusBadge';
import { useOnlineStatus } from '../hooks/usePWA';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenBecomePartner: () => void;
  onNavigateSection: (sectionId: string) => void;
  currentLanguage?: string;
  onChangeLanguage?: (lang: string) => void;
  onOpenQRScanner?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenBecomePartner,
  onNavigateSection,
  onChangeLanguage,
  onOpenQRScanner,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const { t, currentLanguage, currentLanguageInfo, languages, setLanguage, direction } = useLanguage();

  const handleLocaleSelect = (langCode: string) => {
    setLanguage(langCode);
    onChangeLanguage?.(langCode);
    setLangDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!langDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLangDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [langDropdownOpen]);

  const isOnline = useOnlineStatus();

  return (
    <>
      {/* Offline Alert Ribbon (When offline mode is triggered) */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 font-bold text-xs py-1.5 px-4 border-b border-amber-400 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-950/20 text-slate-950 animate-pulse">
                <WifiOff className="w-3.5 h-3.5" />
              </span>
              <span>
                <strong>Offline Mode Active:</strong> You are browsing in offline mode. The entire MsmeBooks Partner Directory and cached verified credentials remain fully operational.
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-[11px] bg-slate-950/20 px-2 py-0.5 rounded-lg border border-slate-950/20">
              <Database className="w-3 h-3" />
              <span>Offline Cache Synced</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner Notice */}
      <div className="bg-slate-100 dark:bg-[#0b1b32] text-slate-700 dark:text-slate-300 text-xs py-2 px-4 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-lime-500/10 text-lime-600 dark:text-lime-400 font-medium text-[11px] border border-lime-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-lime-500 dark:bg-lime-400 animate-pulse"></span>
              {t('nav.registryBadge')}
            </span>
            <span className="hidden sm:inline text-slate-600 dark:text-slate-300">
              {t('nav.tagline')}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[12px]">
            <a 
              href="tel:+2349158482622" 
              className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              <span>+234 915 848 2622</span>
            </a>
            <span className="text-slate-400 dark:text-slate-600 hidden md:inline">|</span>
            <a 
              href="https://www.msmebooks.org" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden md:flex items-center gap-1 text-slate-700 dark:text-slate-300 hover:text-lime-600 dark:hover:text-lime-400 transition-colors"
            >
              <span>www.msmebooks.org</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header 
        id="navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 dark:bg-[#0a192f]/95 backdrop-blur-md shadow-md dark:shadow-lg border-b border-slate-200/80 dark:border-slate-800/80 py-3' 
            : 'bg-white dark:bg-[#0a192f] border-b border-slate-200 dark:border-slate-800/60 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => onNavigateSection('hero')}
                className="flex items-center gap-2.5 text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-[#0d2238] border border-blue-500/40 p-2 flex items-center justify-center shadow-md shadow-blue-950/20 dark:shadow-blue-950/50 group-hover:border-lime-500 dark:group-hover:border-lime-400 transition-all">
                  <div className="relative">
                    <span className="text-white font-extrabold text-xl tracking-tight">M</span>
                    <span className="absolute -bottom-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-lime-400 border-2 border-white dark:border-[#0a192f]"></span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-900 dark:text-white font-extrabold text-xl tracking-tight">
                      Msme<span className="text-lime-600 dark:text-lime-400">Books</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30 rounded">
                      Partners
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                    Global Registry & Directory
                  </p>
                </div>
              </button>
            </div>

            {/* Middle: Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <button 
                onClick={() => onNavigateSection('hero')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                Home
              </button>
              
              <button 
                onClick={() => onNavigateSection('directory')} 
                className="px-3 py-1.5 rounded-lg text-lime-700 dark:text-lime-400 bg-lime-500/10 font-semibold border border-lime-500/30 dark:border-lime-500/20 hover:bg-lime-500/20 transition-all"
              >
                {t('nav.directory')}
              </button>

              <button 
                onClick={() => onNavigateSection('smart-match')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.bestMatch')}
              </button>

              <button 
                onClick={() => onNavigateSection('global-map')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.globalMap')}
              </button>

              <button 
                onClick={() => onNavigateSection('industries')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.industries')}
              </button>

              <button 
                onClick={() => onNavigateSection('countries')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.countries')}
              </button>

              <button 
                onClick={() => onNavigateSection('client-spotlight')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors flex items-center gap-1.5"
              >
                <span>{t('nav.spotlight')}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 animate-pulse" />
              </button>

              <button 
                onClick={() => onNavigateSection('partner-levels')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.tiers')}
              </button>

              <button 
                onClick={() => onNavigateSection('partner-referrals')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.referEarn')}
              </button>

              <button 
                onClick={() => onNavigateSection('faqs')} 
                className="px-3 py-1.5 rounded-lg hover:text-lime-600 dark:hover:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
              >
                {t('nav.faqs')}
              </button>
            </nav>

            {/* Right: Theme Toggle, Connection Status, Language, Login & Primary CTA */}
            <div className="flex items-center gap-2 sm:gap-3">
              
              {/* Visual Connection Status Indicator (Shows Online / Offline Mode) */}
              <ConnectionStatusBadge />

              {/* PWA Install Button */}
              <PWAInstallButton />

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Quick QR Scanner Trigger Button */}
              {onOpenQRScanner && (
                <button
                  type="button"
                  id="navbar-btn-scan-qr"
                  data-testid="navbar-btn-scan-qr"
                  onClick={onOpenQRScanner}
                  className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors shadow-2xs"
                  title="Scan Partner Physical Business Card or Conference Badge"
                  aria-label="Scan Partner QR Code"
                >
                  <QrCode className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                  <span>{t('nav.scanQr')}</span>
                </button>
              )}

              {/* Multiple Currency Toggle */}
              <CurrencyToggle idPrefix="navbar-currency" />

              {/* Language Switcher Dropdown */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  type="button"
                  id="navbar-btn-language"
                  data-testid="navbar-btn-language"
                  onClick={() => setLangDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/70 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer"
                  aria-label={`${t('nav.selectLanguage')}: ${currentLanguageInfo.nativeName}`}
                  aria-haspopup="listbox"
                  aria-expanded={langDropdownOpen}
                  aria-controls="navbar-language-listbox"
                >
                  <Globe2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                  <span className="flex items-center gap-1">
                    <span className="select-none">{currentLanguageInfo.flag}</span>
                    <span className="hidden sm:inline font-bold">{currentLanguageInfo.nativeName}</span>
                    <span className="sm:hidden font-bold uppercase">{currentLanguage}</span>
                  </span>
                  <ChevronDown className={`w-3 h-3 text-slate-500 dark:text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {langDropdownOpen && (
                  <div
                    id="navbar-language-listbox"
                    data-testid="navbar-language-dropdown"
                    role="listbox"
                    aria-label={t('nav.selectLanguage')}
                    className={`absolute ${direction === 'rtl' ? 'left-0' : 'right-0'} mt-2 w-72 bg-white dark:bg-[#0f223a] border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95`}
                  >
                    <div className="px-3 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider">
                        {t('nav.selectLanguage')} · {currentLanguage.toUpperCase()} ({direction.toUpperCase()})
                      </span>
                      <span className="text-[10px] text-lime-600 dark:text-lime-400 font-bold">
                        {languages.length} Locales
                      </span>
                    </div>

                    <div className="max-h-72 overflow-y-auto space-y-0.5">
                      {languages.map((lang) => {
                        const isActive = currentLanguage === lang.code;
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            role="option"
                            aria-selected={isActive}
                            id={`lang-option-${lang.code}`}
                            data-testid={`lang-option-${lang.code}`}
                            onClick={() => handleLocaleSelect(lang.code)}
                            className={`w-full px-3 py-2 flex items-center justify-between text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer ${
                              isActive
                                ? 'text-lime-600 dark:text-lime-400 font-bold bg-lime-500/10'
                                : 'text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-base select-none shrink-0">{lang.flag}</span>
                              <div className="min-w-0">
                                <div className="font-bold flex items-center gap-1.5 flex-wrap">
                                  <span>{lang.nativeName}</span>
                                  <span className="text-[10px] font-normal text-slate-400">({lang.name})</span>
                                  <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                    {lang.code}
                                  </span>
                                  {lang.dir === 'rtl' && (
                                    <span className="text-[9px] font-mono uppercase px-1 py-0.2 rounded bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                                      RTL
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                                  {lang.regionHint}
                                </div>
                              </div>
                            </div>
                            {isActive && (
                              <CheckCircle2 className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 ml-1.5" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Login Button */}
              <button 
                onClick={onOpenBecomePartner}
                className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
              >
                {t('nav.partnerLogin')}
              </button>

              {/* Become a Partner - Primary Lemon-Green CTA */}
              <button 
                onClick={onOpenBecomePartner}
                className="inline-flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl shadow-md shadow-lime-500/20 hover:shadow-lime-500/30 transition-all transform active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-slate-950 fill-slate-950" />
                <span>{t('nav.becomePartner')}</span>
              </button>

              {/* Mobile Hamburger Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-lime-600 dark:hover:text-lime-400 focus:outline-none"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1e36] px-4 pt-3 pb-6 space-y-2 shadow-lg">
            {/* Prominent Mobile QR Code Scanner CTA Card */}
            {onOpenQRScanner && (
              <button
                type="button"
                id="mobile-nav-btn-scan-qr"
                data-testid="mobile-nav-btn-scan-qr"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQRScanner();
                }}
                className="w-full mb-3 flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-blue-900/50 via-[#0c223c] to-slate-900 border border-lime-500/40 text-left hover:border-lime-400 group transition-all shadow-md active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-lime-500/20 border border-lime-400/40 flex items-center justify-center text-lime-400 shrink-0 shadow-inner">
                    <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold text-xs sm:text-sm">Scan Partner QR Badge</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-lime-500 text-slate-950 font-black uppercase">
                        Camera
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Scan physical business cards or badges
                    </p>
                  </div>
                </div>
                <Camera className="w-4 h-4 text-lime-400 shrink-0" />
              </button>
            )}

            <button 
              onClick={() => { onNavigateSection('hero'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              Home
            </button>
            <button 
              onClick={() => { onNavigateSection('directory'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-lime-700 dark:text-lime-400 font-semibold bg-lime-500/10 text-sm"
            >
              {t('nav.directory')}
            </button>
            <button 
              onClick={() => { onNavigateSection('smart-match'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.bestMatch')}
            </button>
            <button 
              onClick={() => { onNavigateSection('global-map'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.globalMap')}
            </button>
            <button 
              onClick={() => { onNavigateSection('industries'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.industries')}
            </button>
            <button 
              onClick={() => { onNavigateSection('countries'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.countries')}
            </button>
            <button 
              onClick={() => { onNavigateSection('client-spotlight'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-lime-700 dark:text-lime-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-sm font-bold flex items-center justify-between"
            >
              <span>{t('nav.spotlight')}</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-lime-500 text-slate-950 font-black uppercase">
                New
              </span>
            </button>
            <button 
              onClick={() => { onNavigateSection('partner-levels'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.tiers')}
            </button>
            <button 
              onClick={() => { onNavigateSection('partner-referrals'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.referEarn')}
            </button>
            <button 
              onClick={() => { onNavigateSection('faqs'); setMobileMenuOpen(false); }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-lime-600 dark:hover:text-lime-400 text-sm font-medium"
            >
              {t('nav.faqs')}
            </button>

            {/* Mobile Language Switcher Row */}
            <div className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
                <span>{t('nav.selectLanguage')}:</span>
              </span>
              <select
                id="mobile-language-select"
                data-testid="mobile-language-select"
                aria-label={t('nav.selectLanguage')}
                value={currentLanguage}
                onChange={(e) => handleLocaleSelect(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white rounded-lg px-2 py-1 font-semibold focus:outline-none focus:ring-1 focus:ring-lime-500"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.flag} {l.nativeName} ({l.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Connection Status Row */}
            <div className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Network Status:</span>
              <ConnectionStatusBadge />
            </div>

            {/* Mobile Currency Switcher */}
            <div className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Currency:</span>
              <CurrencyToggle idPrefix="mobile-currency" />
            </div>

            {/* Mobile Theme Switcher Bar */}
            <div className="py-2.5 px-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Display Theme:</span>
              <ThemeToggle showLabel />
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-3 py-1">
                <span>Support Line:</span>
                <span className="text-lime-600 dark:text-lime-400 font-semibold">+234 915 848 2622</span>
              </div>
              <button 
                onClick={() => { onOpenBecomePartner(); setMobileMenuOpen(false); }}
                className="w-full py-2.5 bg-lime-500 text-slate-950 font-bold rounded-xl text-center text-sm shadow-md"
              >
                {t('nav.becomePartner')}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
