import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Menu,
  X,
  Calculator,
  FileText,
  Smartphone,
  Package,
  Users,
  Receipt,
  Landmark,
  Coins,
  ShieldCheck,
  BarChart3,
  Globe,
  PieChart,
  Sparkles,
  ArrowRight,
  Building2,
  Store,
  UtensilsCrossed,
  Hotel,
  Briefcase,
  Layers,
  ShoppingBag,
  Truck,
  Check,
  Bell,
} from 'lucide-react';
import { CurrencyCode, CurrencyConfig } from '../types';
import { CURRENCIES } from '../data/mockData';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { GlobalCurrencySelector } from './GlobalCurrencySelector';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useNotification } from '../context/NotificationContext';
import { LANGUAGES } from '../data/languages';

interface NavbarProps {
  currentCurrency?: CurrencyCode;
  onCurrencyChange?: (currency: CurrencyCode) => void;
  onSelectCurrency?: (currency: CurrencyCode) => void;
  onOpenStartFree: () => void;
  onOpenBookDemo: () => void;
  onOpenSignIn?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCurrency: propCurrency,
  onCurrencyChange,
  onSelectCurrency,
  onOpenStartFree,
  onOpenBookDemo,
  onOpenSignIn,
}) => {
  const { theme } = useTheme();
  const { language, setLanguage, langConfig, t, isRTL } = useLanguage();
  const { currentCurrency: contextCurrency, setCurrency: setContextCurrency, currencies } = useCurrency();
  const { unreadCount, openProfile, permission } = useNotification();
  const currentCurrency = propCurrency || contextCurrency;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const handleCurrencySelect = (code: CurrencyCode) => {
    setContextCurrency(code);
    if (onSelectCurrency) onSelectCurrency(code);
    if (onCurrencyChange) onCurrencyChange(code);
  };

  const handleSignInClick = () => {
    if (onOpenSignIn) {
      onOpenSignIn();
    } else {
      onOpenStartFree();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productList = [
    { title: t.products.accounting.title, desc: t.products.accounting.desc, icon: Calculator },
    { title: t.products.invoicing.title, desc: t.products.invoicing.desc, icon: FileText },
    { title: t.products.pos.title, desc: t.products.pos.desc, icon: Smartphone },
    { title: t.products.inventory.title, desc: t.products.inventory.desc, icon: Package },
    { title: t.products.crm.title, desc: t.products.crm.desc, icon: Users },
    { title: t.products.expenses.title, desc: t.products.expenses.desc, icon: Receipt },
    { title: t.products.banking.title, desc: t.products.banking.desc, icon: Landmark },
    { title: t.products.payroll.title, desc: t.products.payroll.desc, icon: Coins },
    { title: t.products.tax.title, desc: t.products.tax.desc, icon: ShieldCheck },
    { title: t.products.reports.title, desc: t.products.reports.desc, icon: BarChart3 },
    { title: t.products.bi.title, desc: t.products.bi.desc, icon: PieChart },
    { title: t.products.ai.title, desc: t.products.ai.desc, icon: Sparkles, highlight: true },
  ];

  const solutionList = [
    { title: t.solutions.micro.title, desc: t.solutions.micro.desc, icon: Store },
    { title: t.solutions.growing.title, desc: t.solutions.growing.desc, icon: Layers },
    { title: t.solutions.multibranch.title, desc: t.solutions.multibranch.desc, icon: Building2 },
    { title: t.solutions.retail.title, desc: t.solutions.retail.desc, icon: ShoppingBag },
    { title: t.solutions.restaurants.title, desc: t.solutions.restaurants.desc, icon: UtensilsCrossed },
    { title: t.solutions.hotels.title, desc: t.solutions.hotels.desc, icon: Hotel },
    { title: t.solutions.realEstate.title, desc: t.solutions.realEstate.desc, icon: Building2 },
    { title: t.solutions.services.title, desc: t.solutions.services.desc, icon: Briefcase },
    { title: t.solutions.accountingFirms.title, desc: t.solutions.accountingFirms.desc, icon: Calculator },
    { title: t.solutions.wholesale.title, desc: t.solutions.wholesale.desc, icon: Truck },
    { title: t.solutions.ecommerce.title, desc: t.solutions.ecommerce.desc, icon: Globe },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#090E1A]/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 dark:border-slate-800/80 py-2.5'
          : 'bg-white/85 dark:bg-[#090E1A]/85 backdrop-blur-sm py-3.5 border-b border-slate-100 dark:border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#0866FF] flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200 relative overflow-hidden">
              <span className="font-extrabold text-lg tracking-tight font-display">M</span>
              {/* Lemon accent dot */}
              <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#B7F000] border-2 border-[#0866FF]"></div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#B7F000]/20 rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display flex items-center">
                Msme<span className="text-[#0866FF]">Books</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-500 dark:text-slate-400 uppercase font-semibold -mt-1">
                {t.nav.tagline}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductsOpen(true)}
              onMouseLeave={() => setProductsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  productsOpen
                    ? 'text-[#0866FF] dark:text-[#B7F000] bg-blue-50/70 dark:bg-slate-800/70'
                    : 'hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{t.nav.products}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    productsOpen ? 'rotate-180 text-[#0866FF] dark:text-[#B7F000]' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
              </button>

              {/* Mega Dropdown */}
              {productsOpen && (
                <div
                  className={`absolute top-full w-[640px] pt-2 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isRTL ? '-right-20' : '-left-20'
                  }`}
                >
                  <div className="bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-5 grid grid-cols-2 gap-3">
                    <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {t.nav.allInOneModules}
                      </span>
                      <span className="text-xs font-medium text-[#0866FF] dark:text-[#B7F000] flex items-center gap-1">
                        {t.nav.builtForAfrica}
                      </span>
                    </div>
                    {productList.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.title}
                          href="#features"
                          onClick={() => setProductsOpen(false)}
                          className={`flex items-start gap-3 p-2.5 rounded-xl transition-all duration-150 ${
                            item.highlight
                              ? 'bg-gradient-to-r from-blue-50/80 to-[#B7F000]/20 dark:from-blue-950/40 dark:to-lime-950/20 border border-blue-200/60 dark:border-blue-800/60'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-850 border border-transparent'
                          }`}
                        >
                          <div
                            className={`p-2 rounded-lg shrink-0 ${
                              item.highlight
                                ? 'bg-[#0866FF] text-white'
                                : 'bg-blue-50 dark:bg-blue-950/50 text-[#0866FF] dark:text-blue-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {item.title}
                              {item.highlight && (
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#B7F000] text-slate-950">
                                  {t.nav.aiPowered}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{item.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Solutions Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setSolutionsOpen(true)}
              onMouseLeave={() => setSolutionsOpen(false)}
            >
              <button
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  solutionsOpen
                    ? 'text-[#0866FF] dark:text-[#B7F000] bg-blue-50/70 dark:bg-slate-800/70'
                    : 'hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span>{t.nav.solutions}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    solutionsOpen ? 'rotate-180 text-[#0866FF] dark:text-[#B7F000]' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
              </button>

              {solutionsOpen && (
                <div
                  className={`absolute top-full w-[620px] pt-2 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isRTL ? '-right-28' : '-left-28'
                  }`}
                >
                  <div className="bg-white dark:bg-[#0E172A] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 p-5 grid grid-cols-2 gap-2.5">
                    <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        {t.nav.tailoredByType}
                      </span>
                    </div>
                    {solutionList.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.title}
                          href="#industries"
                          onClick={() => setSolutionsOpen(false)}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                          <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 shrink-0">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{item.title}</div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{item.desc}</p>
                          </div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <a
              href="#features"
              className="px-3 py-2 rounded-lg hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              {t.nav.features}
            </a>
            <a
              href="#industries"
              className="px-3 py-2 rounded-lg hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              {t.nav.industries}
            </a>
            <a
              href="#multibranch"
              className="px-3 py-2 rounded-lg hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              {t.nav.multiBranch}
            </a>
            <a
              href="#testimonials"
              className="px-3 py-2 rounded-lg hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
            >
              Reviews
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-2.5">
            {/* Visual Connection Status Indicator (Online / Offline Mode) */}
            <ConnectionStatusIndicator isMobile={false} />

            {/* Theme Toggle Button (Light / Deep Navy Mode) */}
            <ThemeToggle />

            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {/* Global Currency Selector Dropdown */}
            <GlobalCurrencySelector />

            {/* Notification Bell & Critical Alerts Trigger */}
            <button
              onClick={() => openProfile('notifications')}
              title="Business Alerts & Notifications"
              aria-label="Open Business Alerts"
              className="relative p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-[#0866FF] dark:hover:text-[#B7F000] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-mono font-bold flex items-center justify-center animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar with Alert Preference Access */}
            <button
              onClick={() => openProfile('profile')}
              title="Manage User Profile & Alert Preferences"
              aria-label="Open User Profile"
              className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#0866FF] to-[#B7F000] p-0.5">
                <div className="w-full h-full rounded-[6px] bg-slate-900 flex items-center justify-center text-[11px] font-black text-white font-display">
                  AA
                </div>
              </div>
            </button>

            {/* Sign In */}
            <button
              onClick={handleSignInClick}
              className="text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0866FF] dark:hover:text-[#B7F000] px-2.5 py-2 rounded-lg transition-colors"
            >
              {t.nav.signIn}
            </button>

            {/* Secondary CTA: Request Demo */}
            <button
              onClick={onOpenBookDemo}
              className="text-sm font-semibold text-[#0866FF] dark:text-blue-400 hover:text-[#074EC9] bg-blue-50/80 dark:bg-blue-950/40 hover:bg-blue-100/70 dark:hover:bg-blue-900/50 px-3.5 py-2 rounded-xl transition-all border border-blue-200/60 dark:border-blue-800/60"
            >
              {t.nav.requestDemo}
            </button>

            {/* Primary CTA: Start Free */}
            <button
              onClick={onOpenStartFree}
              className="group relative inline-flex items-center gap-2 px-4.5 py-2 rounded-xl font-bold text-sm text-white bg-[#0866FF] hover:bg-[#0752D4] shadow-md shadow-blue-500/25 transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/35 active:scale-[0.98] overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-1.5">
                {t.nav.startFree}
                <ArrowRight
                  className={`w-4 h-4 group-hover:translate-x-0.5 transition-transform ${
                    isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : ''
                  }`}
                />
              </span>
              <div className="absolute top-0 right-0 w-2 h-full bg-[#B7F000]/70 group-hover:w-full transition-all duration-300 opacity-20"></div>
            </button>
          </div>

          {/* Mobile Right Bar: Connection Indicator + Theme Toggle + Language + Currency + Menu Button */}
          <div className="flex lg:hidden items-center gap-1.5">
            {/* Mobile Connection Status Indicator */}
            <ConnectionStatusIndicator isMobile={true} />

            {/* Mobile Theme Toggle */}
            <ThemeToggle isCompact={true} />

            {/* Mobile Language Selector Dropdown */}
            <LanguageSelector isMobileCompact={true} />

            {/* Mobile Global Currency Selector */}
            <GlobalCurrencySelector isMobileCompact={true} />

            {/* Mobile Notification Bell */}
            <button
              onClick={() => openProfile('notifications')}
              className="relative p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Open Business Alerts"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-6 border-t border-slate-200/80 dark:border-slate-800 space-y-4 animate-in fade-in duration-200">
            {/* Quick Connection & Theme Telemetry Row in Mobile Drawer */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{t.nav.connectionMode}</span>
                <div className="mt-1.5 flex items-center">
                  <ConnectionStatusIndicator isMobile={true} />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">{t.nav.theme}</span>
                  <span className="text-xs font-bold text-slate-900 dark:text-white capitalize">{theme}</span>
                </div>
                <ThemeToggle isCompact={true} />
              </div>
            </div>

            {/* Dedicated African Language Selector in Mobile Drawer */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#0866FF] dark:text-[#B7F000]" />
                  {t.nav.selectLanguage}
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">{langConfig.nativeName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.values(LANGUAGES).map((item) => (
                  <button
                    key={item.code}
                    onClick={() => {
                      setLanguage(item.code);
                    }}
                    className={`px-2.5 py-2 rounded-lg text-xs font-semibold flex items-center justify-between border transition-all ${
                      item.code === language
                        ? 'bg-[#0866FF] text-white border-[#0866FF] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{item.flag}</span>
                      <span>{item.nativeName}</span>
                    </span>
                    {item.code === language && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Dedicated Currency Provider Selector in Mobile Drawer */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-[#0866FF] dark:text-[#B7F000]" />
                  Global Currency Provider
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  Active: {currentCurrency}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-0.5">
                {(Object.values(currencies) as CurrencyConfig[]).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleCurrencySelect(c.code)}
                    className={`px-1.5 py-1.5 rounded-lg text-xs font-semibold flex flex-col items-center justify-center border transition-all ${
                      c.code === currentCurrency
                        ? 'bg-[#0866FF] text-white border-[#0866FF] shadow-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-sm">{c.flag}</span>
                    <span className="text-[10px] font-bold mt-0.5">{c.code}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {t.nav.features}
              </a>
              <a
                href="#industries"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {t.nav.industries}
              </a>
              <a
                href="#multibranch"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold"
              >
                {t.nav.multiBranch}
              </a>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 font-semibold"
              >
                Reviews
              </a>
              <a
                href="#ai-assistant"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-[#B7F000]/30 dark:from-blue-950/40 dark:to-lime-950/20 text-[#0866FF] dark:text-[#B7F000] font-semibold col-span-2 flex items-center justify-between border border-blue-200/40 dark:border-blue-800/40"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> {t.nav.aiAssistant}
                </span>
                <span className="text-[10px] bg-[#B7F000] text-slate-900 font-bold px-2 py-0.5 rounded">
                  {t.nav.live}
                </span>
              </a>
            </div>

            <div className="pt-2 flex flex-col gap-2.5">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStartFree();
                }}
                className="w-full py-3 rounded-xl bg-[#0866FF] text-white font-bold text-center text-sm shadow-md"
              >
                {t.nav.startFreeTrial}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenBookDemo();
                }}
                className="w-full py-2.5 rounded-xl border border-blue-200 dark:border-blue-800 text-[#0866FF] dark:text-blue-400 font-semibold text-center text-sm bg-blue-50/50 dark:bg-blue-950/40"
              >
                {t.nav.requestDemo1on1}
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignInClick();
                }}
                className="text-center text-sm font-semibold text-slate-600 dark:text-slate-400 py-1"
              >
                {t.nav.signInAccount}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
