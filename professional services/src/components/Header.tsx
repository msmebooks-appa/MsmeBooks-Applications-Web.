import React, { useState } from 'react';
import { 
  Building2, 
  MessageCircle, 
  Calendar, 
  Globe2, 
  Menu, 
  X, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';
import { ThemeToggle } from './ThemeToggle';
import { CurrencySelector } from './CurrencySelector';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../context/LanguageContext';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { NotificationCenter } from './NotificationCenter';
import {
  FileSpreadsheet,
  Coins,
  Mail,
  ChevronDown,
  UserCog,
  ScanFace,
  Fingerprint,
  User,
} from 'lucide-react';
import {
  UserProfileSettings,
  DEFAULT_USER_SETTINGS,
  getInitials,
  getModalityDisplayLabel,
} from '../utils/biometricAuth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  bookingCount: number;
  onOpenMyBookings: () => void;
  onOpenProviderPortal: () => void;
  onOpenAdminPortal: () => void;
  onOpenRegisterFirm: () => void;
  onOpenToolkit: () => void;
  onOpenEmailInbox?: () => void;
  userSettings?: UserProfileSettings;
  onOpenUserSettings?: () => void;
  onBiometricQuickAccess?: () => void;
}

export const COUNTRIES = [
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼' },
  { code: 'INT', name: 'UK / International', flag: '🌍' },
];

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  selectedCountry,
  setSelectedCountry,
  bookingCount,
  onOpenMyBookings,
  onOpenProviderPortal,
  onOpenAdminPortal,
  onOpenRegisterFirm,
  onOpenToolkit,
  onOpenEmailInbox,
  userSettings = DEFAULT_USER_SETTINGS,
  onOpenUserSettings,
  onBiometricQuickAccess,
}) => {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const profileDropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setProfileDropdownOpen(false);
      }
    };
    if (profileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [profileDropdownOpen]);

  const currentCountryObj = COUNTRIES.find(c => c.name === selectedCountry) || COUNTRIES[0];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    const element = document.getElementById(tabId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0A1727]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all">
      {/* Top Banner for Pan-African Support, Connection Status & WhatsApp Hotline */}
      <div className="bg-[#102B4E] dark:bg-[#07111D] text-white text-xs py-2 px-4 border-b border-[#1464C8]/20 dark:border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <span className="w-2 h-2 rounded-full bg-[#B7E532] animate-pulse"></span>
              {t('banner.title')}
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">
              {t('banner.officialWebsite')}: <a href="https://www.msmebooks.org" target="_blank" rel="noreferrer" className="underline hover:text-[#B7E532]">www.msmebooks.org</a>
            </span>
            {/* Visual Network Connectivity Monitor */}
            <ConnectionStatusIndicator className="ml-1" />
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            {/* Business Toolkit Quick CTA */}
            <button
              onClick={onOpenToolkit}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 hover:bg-[#B7E532] hover:text-[#102B4E] text-slate-200 font-bold transition-all cursor-pointer text-[11px]"
              title="Download Free Invoicing, P&L & Tax Templates"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>SME Toolkit</span>
            </button>

            {/* Direct Language Switcher in Banner */}
            <LanguageSelector variant="banner" />

            {/* Quick Currency Switcher in Banner */}
            <CurrencySelector variant="banner" />

            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I am inquiring about your professional services.")}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 font-semibold text-[#B7E532] hover:text-white transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('banner.directWhatsapp')}: +234 915 848 2622</span>
            </a>
            
            <div className="hidden sm:flex items-center gap-2 border-l border-slate-700 pl-3">
              <button
                onClick={onOpenProviderPortal}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Briefcase className="w-3 h-3 text-[#B7E532]" />
                {t('banner.providerPortal')}
              </button>
              <span className="text-slate-600">/</span>
              <button
                onClick={onOpenAdminPortal}
                className="text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-[#1464C8]" />
                {t('banner.adminPortal')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleNavClick('hero')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1464C8] to-[#102B4E] flex items-center justify-center text-white shadow-md relative overflow-hidden group">
              <div className="absolute inset-0 bg-[#B7E532]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="font-extrabold text-xl tracking-tight text-white">M<span className="text-[#B7E532]">B</span></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-[#102B4E] dark:text-white">
                  Msme<span className="text-[#1464C8]">Books</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B7E532]/30 text-[#102B4E] dark:text-[#B7E532] px-1.5 py-0.5 rounded">
                  Services
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-none mt-0.5">
                Professional Services & Marketplace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => handleNavClick('services-catalogue')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'services-catalogue' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => handleNavClick('firms-directory')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'firms-directory' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.firms')}
            </button>
            <button
              onClick={() => handleNavClick('subscriptions-pricing')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'subscriptions-pricing' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Plans & Modules</span>
            </button>
            <button
              onClick={() => handleNavClick('smart-matcher')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'smart-matcher' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="inline-block w-2 h-2 rounded-full bg-[#B7E532]"></span>
              {t('nav.smartMatcher')}
            </button>
            <button
              onClick={() => handleNavClick('industry-solutions')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'industry-solutions' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.industrySolutions')}
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'how-it-works' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.howItWorks')}
            </button>
            <button
              onClick={() => handleNavClick('partner-program')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'partner-program' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.partnerProgram')}
            </button>
            <button
              onClick={() => handleNavClick('service-cost-estimator')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'service-cost-estimator' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Estimator
            </button>
            <button
              onClick={() => handleNavClick('community-forum')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'community-forum' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Forum
            </button>
            <button
              onClick={() => handleNavClick('faqs')}
              className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'faqs' 
                  ? 'text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/60' 
                  : 'text-slate-700 dark:text-slate-300 hover:text-[#1464C8] dark:hover:text-[#B7E532] hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {t('nav.faqs')}
            </button>
          </nav>

          {/* Action CTAs & Language / Currency / Country Switcher */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle (Persisted in localStorage) */}
            <ThemeToggle />

            {/* Language Selector */}
            <LanguageSelector variant="header" />

            {/* Global Real-Time Currency Switcher (NGN, KES, GHS, USD + 12 more) */}
            <CurrencySelector variant="header" />

            {/* Country Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100/80 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title={t('nav.region')}
              >
                <span>{currentCountryObj.flag}</span>
                <span className="hidden xl:inline">{currentCountryObj.name}</span>
                <span className="xl:hidden">{currentCountryObj.code}</span>
              </button>

              {countryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0A1727] rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {t('nav.region')}
                  </div>
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setSelectedCountry(c.name);
                        setCountryDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                        selectedCountry === c.name ? 'font-bold text-[#1464C8] dark:text-[#B7E532] bg-blue-50/50 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.name}</span>
                      </span>
                      {selectedCountry === c.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1464C8] dark:bg-[#B7E532]"></span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Real-time Notifications Center */}
            <NotificationCenter onOpenMyBookings={onOpenMyBookings} />

            {/* Client Booking Confirmation Email Vault */}
            {onOpenEmailInbox && (
              <button
                type="button"
                onClick={onOpenEmailInbox}
                className="relative p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                title="View Booking Confirmation Emails & Receipts"
                aria-label="View Booking Confirmation Emails"
              >
                <Mail className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
              </button>
            )}

            {/* My Bookings Button */}
            <button
              onClick={onOpenMyBookings}
              className="relative flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#102B4E] dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
              <span className="hidden xl:inline">{t('nav.myBookings')}</span>
              {bookingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 bg-[#1464C8] text-white text-[10px] font-bold rounded-full">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Book via WhatsApp Direct Quick CTA */}
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I would like to book a professional service consultation.")}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#102B4E] bg-[#B7E532] hover:bg-[#a5d225] rounded-lg transition-transform hover:scale-105 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-[#102B4E]" />
              <span className="hidden xl:inline">{t('nav.whatsappBooking')}</span>
            </a>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('services-catalogue')}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#1464C8] hover:bg-[#1052a5] rounded-lg shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>{t('nav.explore')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* User Profile Dropdown & Settings */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                className="relative flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/90 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                title="Account Profile & User Settings"
                aria-label="Open profile menu"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
              >
                <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-[#102B4E] to-[#1464C8] text-[#B7E532] font-black text-[11px] flex items-center justify-center shadow-2xs">
                  {getInitials(userSettings.fullName)}
                  {userSettings.biometricEnabled && (
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-800"
                      title="Biometric Authentication Active"
                    />
                  )}
                </div>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform duration-200 ${
                    profileDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0A1727] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  role="menu"
                  aria-label="Profile options"
                >
                  {/* Profile Summary Header */}
                  <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#102B4E] to-[#1464C8] text-[#B7E532] font-black text-xs flex items-center justify-center shrink-0">
                        {getInitials(userSettings.fullName)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-black text-[#102B4E] dark:text-white truncate">
                          {userSettings.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {userSettings.businessName}
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 truncate max-w-[145px]">{userSettings.email}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-bold ${
                          userSettings.biometricEnabled
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532]'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {userSettings.biometricEnabled ? (
                          <>
                            {userSettings.biometricModality === 'fingerprint' ? (
                              <Fingerprint className="w-2.5 h-2.5" />
                            ) : (
                              <ScanFace className="w-2.5 h-2.5" />
                            )}
                            <span>{getModalityDisplayLabel(userSettings.biometricModality)}</span>
                          </>
                        ) : (
                          <span>Standard Access</span>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Primary Profile Actions */}
                  <div className="p-1.5 space-y-0.5">
                    {userSettings.biometricEnabled && onBiometricQuickAccess && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onBiometricQuickAccess();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-black bg-blue-50/90 dark:bg-blue-950/60 text-[#1464C8] dark:text-[#B7E532] hover:bg-blue-100 dark:hover:bg-blue-900/60 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          {userSettings.biometricModality === 'fingerprint' ? (
                            <Fingerprint className="w-4 h-4 shrink-0" />
                          ) : (
                            <ScanFace className="w-4 h-4 shrink-0" />
                          )}
                          <span>Biometric Dashboard Unlock</span>
                        </span>
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-[#B7E532] text-[#102B4E]">
                          Fast
                        </span>
                      </button>
                    )}

                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenMyBookings();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                        <span>Customer Dashboard</span>
                      </span>
                      {bookingCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#1464C8] text-white text-[10px] font-bold">
                          {bookingCount}
                        </span>
                      )}
                    </button>

                    {onOpenUserSettings && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenUserSettings();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-2">
                          <UserCog className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                          <div>
                            <div className="leading-tight font-bold">User Settings</div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              Biometric Auth, Profile & Alerts
                            </div>
                          </div>
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            userSettings.biometricEnabled
                              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-[#B7E532]'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                          }`}
                        >
                          {userSettings.biometricEnabled ? 'Bio On' : 'Setup'}
                        </span>
                      </button>
                    )}

                    {onOpenEmailInbox && (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenEmailInbox();
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Mail className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
                        <span>Email Receipts & Alerts</span>
                      </button>
                    )}
                  </div>

                  {/* Portal Links Footer */}
                  <div className="mt-1 pt-1.5 px-1.5 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenProviderPortal();
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Briefcase className="w-3 h-3 text-[#B7E532]" />
                      <span>Provider</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onOpenAdminPortal();
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShieldCheck className="w-3 h-3 text-[#1464C8]" />
                      <span>Admin</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle & Theme */}
          <div className="flex items-center gap-2 lg:hidden">
            <NotificationCenter onOpenMyBookings={onOpenMyBookings} />
            <ThemeToggle />
            <button
              onClick={onOpenMyBookings}
              className="relative p-2 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              title="My Bookings"
            >
              <Calendar className="w-4 h-4 text-[#1464C8] dark:text-[#B7E532]" />
              {bookingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1464C8] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {bookingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0A1727] border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          {/* Mobile Language, Currency, Theme & Region Selectors */}
          <div className="flex flex-col gap-2.5 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('nav.language')}:</span>
              <LanguageSelector variant="header" />
            </div>
            <div className="flex flex-col gap-1.5 py-1">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('nav.currency')}:</span>
              <CurrencySelector variant="mobile" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Live Alerts:</span>
              <NotificationCenter onOpenMyBookings={onOpenMyBookings} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Theme Mode:</span>
              <ThemeToggle showLabel={true} />
            </div>
            {onOpenUserSettings && (
              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                  <span>Account & Biometrics:</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenUserSettings();
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-800 text-[#102B4E] dark:text-white border border-slate-200 dark:border-slate-700 cursor-pointer"
                >
                  <UserCog className="w-3.5 h-3.5 text-[#1464C8] dark:text-[#B7E532]" />
                  <span>User Settings</span>
                  {userSettings.biometricEnabled && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  )}
                </button>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('nav.region')}:</span>
              <div className="flex gap-1.5">
                {COUNTRIES.slice(0, 4).map(c => (
                  <button
                    key={c.code}
                    onClick={() => setSelectedCountry(c.name)}
                    className={`text-xs px-2 py-1 rounded border transition-colors cursor-pointer ${
                      selectedCountry === c.name 
                        ? 'border-[#1464C8] bg-blue-50 dark:bg-blue-950/60 font-bold text-[#1464C8] dark:text-[#B7E532]' 
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {c.flag} {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <button
              onClick={() => handleNavClick('services-catalogue')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              {t('nav.services')}
            </button>
            <button
              onClick={() => handleNavClick('firms-directory')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              {t('nav.firms')}
            </button>
            <button
              onClick={() => handleNavClick('smart-matcher')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg flex items-center justify-between cursor-pointer"
            >
              <span>{t('nav.smartMatcher')}</span>
              <span className="text-[10px] bg-[#B7E532] text-[#102B4E] font-bold px-1.5 py-0.5 rounded">Smart</span>
            </button>
            <button
              onClick={() => handleNavClick('subscriptions-pricing')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer flex items-center gap-2"
            >
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Plans & Extend Modules</span>
              <span className="text-[10px] bg-[#B7E532] text-[#102B4E] font-bold px-1.5 py-0.5 rounded">New</span>
            </button>
            <button
              onClick={() => handleNavClick('industry-solutions')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              {t('nav.industrySolutions')}
            </button>
            <button
              onClick={() => handleNavClick('how-it-works')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              {t('nav.howItWorks')}
            </button>
            <button
              onClick={() => handleNavClick('partner-program')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              {t('nav.partnerProgram')}
            </button>
            <button
              onClick={() => handleNavClick('service-cost-estimator')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              Service Cost Estimator
            </button>
            <button
              onClick={() => handleNavClick('community-forum')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              Professional Forum
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenToolkit();
              }}
              className="text-left px-3 py-2 text-sm font-semibold text-[#1464C8] dark:text-[#B7E532] hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg cursor-pointer flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>SME Business Toolkit (Free Templates)</span>
            </button>
            <button
              onClick={() => handleNavClick('faqs')}
              className="text-left px-3 py-2 text-sm font-semibold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer"
            >
              {t('nav.faqs')}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            <a
              href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I would like to book a professional service.")}`}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#B7E532] text-[#102B4E] font-bold text-sm rounded-lg shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              Direct WhatsApp Booking (+234 915 848 2622)
            </a>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegisterFirm();
                }}
                className="py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                Register Your Firm
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProviderPortal();
                }}
                className="py-2 text-xs font-bold text-[#1464C8] dark:text-[#B7E532] bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg border border-blue-200 dark:border-blue-900 cursor-pointer"
              >
                Provider Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
