import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  ChevronDown, 
  Globe, 
  Menu, 
  X, 
  PhoneCall, 
  ShieldCheck, 
  Calculator, 
  Briefcase, 
  Users, 
  LayoutDashboard, 
  Sparkles, 
  CreditCard,
  FileText,
  Languages,
  Sun,
  Moon,
  Wifi,
  WifiOff,
  RefreshCw,
  Info
} from 'lucide-react';
import { CountryInfo, CurrencyCode } from '../types';
import { COUNTRIES } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { NetworkStatus } from '../hooks/useNetworkStatus';
import { LanguageSwitcher } from './LanguageSwitcher';
import { GlobalSearchBar } from './GlobalSearchBar';

interface NavbarProps {
  selectedCountry: CountryInfo;
  onSelectCountry: (country: CountryInfo) => void;
  selectedCurrency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  isAutoDetected?: boolean;
  detectedCity?: string | null;
  networkStatus: NetworkStatus;
  onOpenPortal: () => void;
  onOpenConsultation: () => void;
  onOpenPartnerPortal: () => void;
  onOpenAdmin: () => void;
  onOpenCalculator: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCountry,
  onSelectCountry,
  selectedCurrency,
  onSelectCurrency,
  isAutoDetected,
  detectedCity,
  networkStatus,
  onOpenPortal,
  onOpenConsultation,
  onOpenPartnerPortal,
  onOpenAdmin,
  onOpenCalculator,
  onNavigateSection,
}) => {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [networkPopoverOpen, setNetworkPopoverOpen] = useState(false);

  const { effectiveOnline, isSimulatedOffline, toggleSimulatedOffline, checkConnection } = networkStatus;

  const handleCountryChange = (c: CountryInfo) => {
    onSelectCountry(c);
    onSelectCurrency(c.currency);
    setCountryDropdownOpen(false);
  };

  const navTo = (id: string) => {
    onNavigateSection(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white shadow-sm dark:shadow-xl transition-colors duration-200">
      
      {/* Offline Alert Ribbon when app is operating in offline mode */}
      {!effectiveOnline && (
        <div className="bg-amber-500/15 dark:bg-amber-950/80 border-b border-amber-500/30 px-4 py-1.5 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-4xl">
            <WifiOff className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <strong className="font-bold">{t.network.offlineAlertTitle}:</strong> {t.network.offlineAlertDesc}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => checkConnection()}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] rounded-md transition cursor-pointer"
            >
              {t.network.reconnectBtn}
            </button>
          </div>
        </div>
      )}

      {/* Top micro bar for Connection Status, Region, Currency, Language, Helpline & Theme */}
      <div className="bg-slate-100 dark:bg-slate-950/80 px-4 py-1.5 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800/60 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Left: Hub Tag & Connection Status Indicator */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-slate-900 dark:text-lime-400">
              <span className="w-2 h-2 rounded-full bg-lime-500 dark:bg-lime-400 animate-pulse"></span>
              {t.nav.hubTag}
            </span>

            <span className="hidden sm:inline text-slate-400 dark:text-slate-600">|</span>

            {/* Visual Connection Status Indicator */}
            <div className="relative">
              <button
                onClick={() => setNetworkPopoverOpen(!networkPopoverOpen)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition cursor-pointer shadow-2xs ${
                  effectiveOnline
                    ? 'bg-emerald-500/10 dark:bg-emerald-950/50 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20'
                    : 'bg-amber-500/20 dark:bg-amber-950/70 border-amber-500/50 text-amber-700 dark:text-amber-300 animate-pulse'
                }`}
                title={effectiveOnline ? 'Status: Online (Cloud Sync Active)' : 'Status: Offline Mode (Cached Data Active)'}
                aria-label="Network Connection Status"
              >
                {effectiveOnline ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                    <Wifi className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.network.online}</span>
                    <span className="hidden md:inline font-normal text-[10px] text-emerald-600 dark:text-emerald-300/80">· {t.network.cloudSync}</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span className="font-bold">{t.network.offlineMode}</span>
                    <span className="hidden md:inline font-normal text-[10px]">({t.network.cachedData})</span>
                  </>
                )}
                <ChevronDown className="w-2.5 h-2.5 opacity-60 ml-0.5" />
              </button>

              {/* Network Details Popover */}
              {networkPopoverOpen && (
                <div className="absolute left-0 mt-1.5 w-76 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-slate-800 dark:text-slate-200 text-xs animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800 mb-2">
                    <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-blue-500" />
                      {t.network.networkStatus}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      effectiveOnline ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}>
                      {effectiveOnline ? t.network.online : t.network.offlineMode}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                    {effectiveOnline
                      ? 'Live connection to Pan-African cloud infrastructure. Real-time pricing calculations, consultations, and portal synchronizations are active.'
                      : 'Internet connectivity intermittent. Operating safely on local browser cached catalogs and regional pricing data.'}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-col gap-2">
                    <button
                      onClick={toggleSimulatedOffline}
                      className={`w-full py-1.5 px-2.5 text-xs rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        isSimulatedOffline
                          ? 'bg-blue-600 hover:bg-blue-500 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <WifiOff className="w-3.5 h-3.5 text-amber-500" />
                      <span>{isSimulatedOffline ? t.network.simulateOnline : t.network.simulateOffline}</span>
                    </button>

                    <button
                      onClick={() => {
                        checkConnection();
                        setNetworkPopoverOpen(false);
                      }}
                      className="w-full py-1 px-2 text-[11px] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center gap-1 transition"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{t.network.reconnectBtn}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <span className="hidden lg:inline-flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              {t.nav.verifiedPractitioners}
            </span>
          </div>

          {/* Right: Partner/Ops quicklinks, Language, Market, Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Switchers */}
            <div className="hidden xl:flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
              <button 
                onClick={onOpenPartnerPortal}
                className="hover:text-lime-600 dark:hover:text-lime-400 transition-colors cursor-pointer flex items-center gap-1"
                title="Open Partner & Provider Portal"
              >
                <Users className="w-3 h-3 text-lime-500 dark:text-lime-400" />
                {t.nav.partnerPortal}
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <button 
                onClick={onOpenAdmin}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer flex items-center gap-1"
                title="Open Admin Operations Console"
              >
                <LayoutDashboard className="w-3 h-3 text-blue-500 dark:text-blue-400" />
                {t.nav.operationsHub}
              </button>
              <span className="text-slate-300 dark:text-slate-700">•</span>
            </div>

            {/* Language Switcher Component */}
            <LanguageSwitcher />

            {/* Country / Currency Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCountryDropdownOpen(!countryDropdownOpen);
                  setNetworkPopoverOpen(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md border border-slate-200 dark:border-slate-700 transition text-xs font-medium cursor-pointer shadow-2xs"
                title={isAutoDetected ? `Auto-detected location: ${detectedCity ? detectedCity + ', ' : ''}${selectedCountry.name}` : t.nav.selectMarket}
              >
                <span className="text-sm">{selectedCountry.flag}</span>
                <span className="hidden sm:inline">{selectedCountry.name}</span>
                <span className="px-1.5 py-0.2 bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded font-semibold text-[10px]">
                  {selectedCurrency}
                </span>
                {isAutoDetected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-500 dark:bg-lime-400" title="Location auto-detected via IP"></span>
                )}
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {countryDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-68 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-800 dark:text-slate-200 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-[10px] font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400 px-2 py-1 border-b border-slate-100 dark:border-slate-800 mb-1">
                    <span>{t.nav.selectMarket}</span>
                    {isAutoDetected && (
                      <span className="text-lime-600 dark:text-lime-400 font-bold lowercase">{t.nav.autoDetected}</span>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {COUNTRIES.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryChange(country)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer text-left ${
                          selectedCountry.code === country.code ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{country.flag}</span>
                          <span>{country.name}</span>
                        </div>
                        <span className="text-[11px] font-bold text-lime-600 dark:text-lime-400">
                          {country.currency} ({country.currencySymbol})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button with Smooth Icon Animation */}
            <button
              onClick={toggleTheme}
              className="relative overflow-hidden w-7 h-7 rounded-lg bg-white dark:bg-slate-800/90 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-center hover:scale-105 active:scale-95"
              title={theme === 'dark' ? t.theme.toggleLight : t.theme.toggleDark}
              aria-label="Toggle Theme Mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center justify-center"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.55)]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* WhatsApp Link */}
            <a 
              href="https://wa.me/2348000000000" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hidden md:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 text-xs font-medium"
            >
              <PhoneCall className="w-3 h-3" />
              {t.nav.whatsappHotline}
            </a>

          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navTo('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 via-blue-600 to-slate-900 border border-blue-400/40 flex items-center justify-center shadow-lg shadow-blue-900/30 relative overflow-hidden group">
              <span className="text-white font-extrabold text-xl tracking-tight">M</span>
              <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-400 rounded-full border-2 border-slate-900"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-grotesk">Msme</span>
                <span className="text-xl font-extrabold tracking-tight text-blue-600 dark:text-blue-400 font-grotesk">Books</span>
                <span className="ml-1 w-1.5 h-1.5 rounded-full bg-lime-500 dark:bg-lime-400 inline-block"></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] tracking-widest font-semibold text-lime-700 dark:text-lime-400 uppercase bg-lime-100 dark:bg-lime-950/80 px-1.5 py-0.2 rounded border border-lime-300 dark:border-lime-800/60">
                  OUTSOURCING
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 font-normal hidden sm:inline">Professional Services</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 2xl:gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
            <button 
              onClick={() => navTo('services')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center gap-1 cursor-pointer"
            >
              {t.nav.services}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button 
              onClick={() => navTo('industries')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
            >
              {t.nav.industries}
            </button>
            <button 
              onClick={() => navTo('how-it-works')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
            >
              {t.nav.howItWorks}
            </button>
            <button 
              onClick={() => navTo('pricing')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer text-lime-600 dark:text-lime-400 font-semibold"
            >
              {t.nav.subscriptionPlans}
            </button>
            <button 
              onClick={() => navTo('calculator')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {t.nav.calculator}
            </button>
            <button 
              onClick={() => navTo('marketplace')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
            >
              {t.nav.marketplace}
            </button>
            <button 
              onClick={() => navTo('faqs')}
              className="px-3 py-2 rounded-lg hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80 transition cursor-pointer"
            >
              {t.nav.faqs}
            </button>
          </nav>

          {/* Global Search Bar (Desktop) */}
          <div className="hidden lg:flex items-center mx-2">
            <GlobalSearchBar onNavigateSection={onNavigateSection} />
          </div>

          {/* Primary Action Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={onOpenPortal}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
              title="Access your live client outsourcing portal"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              {t.nav.clientPortal}
            </button>

            <button
              onClick={onOpenConsultation}
              className="px-3.5 py-2 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200 dark:border-blue-700/60 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              {t.nav.bookConsultation}
            </button>

            <button
              onClick={() => navTo('pricing')}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 rounded-lg shadow-md shadow-lime-500/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              {t.nav.getStarted}
            </button>
          </div>

          {/* Mobile menu and controls */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            <GlobalSearchBar onNavigateSection={onNavigateSection} />

            {/* Mobile quick theme toggle with smooth animation */}
            <button
              onClick={toggleTheme}
              className="relative overflow-hidden w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center justify-center active:scale-95"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center justify-center"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-700" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>

            {/* Mobile quick language toggle */}
            <LanguageSwitcher variant="compact" />

            <button
              onClick={onOpenPortal}
              className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-lime-600 dark:text-lime-400 rounded-md border border-slate-200 dark:border-slate-700 flex items-center gap-1"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Portal
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={onOpenPortal}
              className="w-full py-2.5 px-3 bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              {t.nav.clientPortal}
            </button>
            <button
              onClick={onOpenConsultation}
              className="w-full py-2.5 px-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t.nav.bookConsultation}
            </button>
          </div>

          {/* Theme selector in mobile drawer */}
          <div className="py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
              {t.theme.themeLabel}:
            </span>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 transition cursor-pointer active:scale-95"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.22, ease: "easeInOut" }}
                  className="flex items-center justify-center"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 text-slate-700" />
                  )}
                </motion.div>
              </AnimatePresence>
              <span>{theme === 'dark' ? t.theme.dark : t.theme.light}</span>
            </button>
          </div>

          {/* Language selector in mobile drawer */}
          <div className="py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
              Langue / Language:
            </span>
            <div className="flex items-center gap-1.5">
              {availableLanguages.map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLanguage(item.code)}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold transition ${
                    language === item.code
                      ? 'bg-lime-400 text-slate-950'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {item.flag} {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Network status in mobile drawer */}
          <div className="py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
              {effectiveOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-500" /> : <WifiOff className="w-3.5 h-3.5 text-amber-500" />}
              {t.network.networkStatus}:
            </span>
            <button
              onClick={toggleSimulatedOffline}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                effectiveOnline
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              }`}
            >
              {effectiveOnline ? t.network.online : t.network.offlineMode} ({isSimulatedOffline ? 'Simulated' : 'Live'})
            </button>
          </div>

          <div className="flex flex-col space-y-1 text-sm font-medium text-slate-700 dark:text-slate-200">
            <button onClick={() => navTo('services')} className="text-left py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              {t.nav.services}
            </button>
            <button onClick={() => navTo('industries')} className="text-left py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              {t.nav.industries}
            </button>
            <button onClick={() => navTo('how-it-works')} className="text-left py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              {t.nav.howItWorks}
            </button>
            <button onClick={() => navTo('pricing')} className="text-left py-2 px-3 rounded text-lime-600 dark:text-lime-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800">
              {t.nav.subscriptionPlans}
            </button>
            <button onClick={() => navTo('calculator')} className="text-left py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t.nav.calculator}
            </button>
            <button onClick={() => navTo('marketplace')} className="text-left py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              {t.nav.marketplace}
            </button>
            <button onClick={() => navTo('faqs')} className="text-left py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
              {t.nav.faqs}
            </button>
            <button onClick={onOpenPartnerPortal} className="text-left py-2 px-3 rounded text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
              <Users className="w-4 h-4 text-lime-600 dark:text-lime-400" />
              {t.nav.partnerPortal}
            </button>
            <button onClick={onOpenAdmin} className="text-left py-2 px-3 rounded text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {t.nav.operationsHub}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => navTo('pricing')}
              className="w-full py-3 bg-gradient-to-r from-lime-400 to-lime-500 text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-lime-500/20 text-center"
            >
              {t.nav.getStarted}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
