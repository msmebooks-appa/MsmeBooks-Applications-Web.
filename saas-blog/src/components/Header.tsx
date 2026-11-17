import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { ThemeToggle } from '../context/ThemeContext';
import { ConnectionStatusBadge, OfflineAlertBanner } from './ConnectionStatus';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';
import { useCurrency, CurrencySelector } from '../context/CurrencyContext';
import {
  ChevronDown,
  Menu,
  X,
  BookOpen,
  Layers,
  Calculator,
  ScanLine,
  Boxes,
  TrendingUp,
  HelpCircle,
  Award,
  Phone,
  BarChart3,
  ExternalLink
} from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'article' | 'guide';
  onNavigateHome: () => void;
  onOpenAdmin: () => void;
  onSelectCategory?: (category: string) => void;
  onScrollToSection?: (sectionId: string) => void;
  onOpenLiveChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onOpenAdmin,
  onSelectCategory,
  onScrollToSection,
  onOpenLiveChat
}) => {
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t, dict } = useLanguage();
  const { formatFromNGN, currentCurrencyInfo } = useCurrency();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resourceLinks = [
    {
      name: dict.resourceDropdown.blogArticles,
      desc: dict.resourceDropdown.blogArticlesDesc,
      icon: BookOpen,
      action: () => {
        onNavigateHome();
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.businessGuides,
      desc: dict.resourceDropdown.businessGuidesDesc,
      icon: Layers,
      action: () => {
        onNavigateHome();
        onScrollToSection?.('business-guides');
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.accountingResources,
      desc: dict.resourceDropdown.accountingResourcesDesc,
      icon: Calculator,
      action: () => {
        onSelectCategory?.('Accounting');
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.posResources,
      desc: dict.resourceDropdown.posResourcesDesc,
      icon: ScanLine,
      action: () => {
        onSelectCategory?.('POS');
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.inventoryManagement,
      desc: dict.resourceDropdown.inventoryManagementDesc,
      icon: Boxes,
      action: () => {
        onSelectCategory?.('Inventory');
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.smeGrowth,
      desc: dict.resourceDropdown.smeGrowthDesc,
      icon: TrendingUp,
      action: () => {
        onSelectCategory?.('SME Growth');
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.faqsSupport,
      desc: dict.resourceDropdown.faqsSupportDesc,
      icon: HelpCircle,
      action: () => {
        if (onOpenLiveChat) {
          onOpenLiveChat();
        } else {
          window.open('https://www.msmebooks.org', '_blank');
        }
        setResourcesOpen(false);
      }
    },
    {
      name: dict.resourceDropdown.customerStories,
      desc: dict.resourceDropdown.customerStoriesDesc,
      icon: Award,
      action: () => {
        onNavigateHome();
        onScrollToSection?.('case-studies');
        setResourcesOpen(false);
      }
    }
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-[#0B1E36]/95 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800'
          : 'bg-white dark:bg-[#0B1E36] border-b border-slate-100 dark:border-slate-800/80'
      }`}
    >
      {/* Offline Alert & Reconnect Status Banner */}
      <OfflineAlertBanner />

      {/* Top micro bar for telephone, platform assurance & dynamic revenue metrics */}
      <div className="bg-slate-900 dark:bg-[#050E1A] text-slate-300 text-xs py-1.5 px-4 hidden md:block border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Phone className="w-3.5 h-3.5 text-lime-400" />
              {t('nav.directSupport')}: <a href="tel:+2349158482622" className="text-slate-200 hover:text-white font-medium">+2349158482622</a>
            </span>
            <span className="text-slate-400">
              {t('nav.trustedBy')}
            </span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-400 border-l border-slate-800 pl-4">
              <TrendingUp className="w-3.5 h-3.5 text-lime-400" />
              <span>Platform Volume:</span>
              <span className="font-mono font-bold text-lime-300">
                {formatFromNGN(4850000000, { compact: true })}
              </span>
              <span className="text-[11px] text-slate-500">processed</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-[11px] font-mono text-slate-400 hidden xl:inline">
              1 USD ≈ {currentCurrencyInfo.rateToUSD.toLocaleString()} {currentCurrencyInfo.code}
            </span>
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-lime-400 flex items-center gap-1 transition-colors"
            >
              <span>{t('nav.mainWebsite')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-400 rounded-lg p-1"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <button
              onClick={onNavigateHome}
              className={`text-sm font-semibold transition-colors ${
                currentView === 'home'
                  ? 'text-blue-700 dark:text-lime-400'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t('nav.home')}
            </button>

            <a
              href="https://www.msmebooks.org/#features"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('nav.features')}
            </a>

            <button
              onClick={() => {
                onNavigateHome();
                onScrollToSection?.('industry-resources');
              }}
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('nav.solutions')}
            </button>

            <a
              href="https://www.msmebooks.org/#pricing"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              {t('nav.pricing')}
            </a>

            {/* Resources Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-2 ${
                  resourcesOpen
                    ? 'text-blue-700 dark:text-lime-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                aria-expanded={resourcesOpen}
              >
                <span>{t('nav.resources')}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    resourcesOpen ? 'rotate-180 text-blue-700 dark:text-lime-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {resourcesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[540px] bg-white dark:bg-[#0B1E36] rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700/80 p-4 grid grid-cols-2 gap-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  {resourceLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={item.action}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#102A4C] text-left transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-lime-400 transition-colors">
                            {item.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                            {item.desc}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={onNavigateHome}
              className="text-sm font-semibold text-blue-700 dark:text-lime-400 relative py-1"
            >
              {t('nav.blog')}
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-lime-500 rounded-full" />
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Global Currency Selector */}
            <CurrencySelector variant="navbar" />

            {/* Language Selector */}
            <LanguageSelector variant="navbar" />

            {/* Visual Connection Status Indicator */}
            <ConnectionStatusBadge variant="navbar" />

            {/* Theme Toggle (Light <-> Deep Navy) */}
            <ThemeToggle />

            {/* CMS / Analytics trigger */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#102A4C] hover:bg-slate-200 dark:hover:bg-[#15345E] rounded-lg transition-colors border border-transparent dark:border-slate-700/60"
              title="Admin CMS & Blog Analytics"
            >
              <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-lime-400" />
              <span>{t('nav.cmsStats')}</span>
            </button>

            <a
              href="https://www.msmebooks.org/login"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-white px-3 py-2 transition-colors"
            >
              {t('nav.login')}
            </a>

            <a
              href="https://www.msmebooks.org/register"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('nav.startFree')}
            </a>
          </div>

          {/* Mobile Menu & Theme Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden">
            {/* Mobile Currency Selector */}
            <CurrencySelector variant="navbar" />

            {/* Mobile Language Selector */}
            <LanguageSelector variant="navbar" />

            {/* Mobile Connection Status */}
            <ConnectionStatusBadge variant="navbar" />
            <ThemeToggle variant="compact" />
            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#102A4C] rounded-lg"
              title="Admin & Analytics"
            >
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-lime-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#102A4C] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1E36] px-4 pt-2 pb-6 space-y-3 shadow-xl">
          <div className="space-y-1">
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#102A4C]"
            >
              {t('nav.home')}
            </button>
            <a
              href="https://www.msmebooks.org/#features"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#102A4C]"
            >
              {t('nav.features')}
            </a>
            <button
              onClick={() => {
                onNavigateHome();
                onScrollToSection?.('industry-resources');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#102A4C]"
            >
              {t('nav.solutions')}
            </button>
            <a
              href="https://www.msmebooks.org/#pricing"
              target="_blank"
              rel="noreferrer"
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#102A4C]"
            >
              {t('nav.pricing')}
            </a>
            <button
              onClick={() => {
                onNavigateHome();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-3 py-2 rounded-lg text-base font-bold text-blue-700 dark:text-lime-400 bg-blue-50 dark:bg-blue-950/40"
            >
              {t('nav.blog')}
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              {t('nav.resources')}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {resourceLinks.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    item.action();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#102A4C] rounded-lg text-left"
                >
                  <item.icon className="w-4 h-4 text-blue-600 dark:text-lime-400" />
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
            {/* Currency Selector in Mobile Drawer */}
            <CurrencySelector variant="drawer" />

            {/* Language Selector in Mobile Drawer */}
            <LanguageSelector variant="drawer" />

            {/* Connection Diagnostics in Mobile Drawer */}
            <ConnectionStatusBadge variant="drawer" />

            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 dark:bg-[#102A4C]">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Theme</span>
              <ThemeToggle variant="pill" />
            </div>

            <a
              href="https://www.msmebooks.org/login"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 text-center text-sm font-semibold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-[#102A4C] rounded-xl"
            >
              {t('nav.login')}
            </a>
            <a
              href="https://www.msmebooks.org/register"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 text-center text-sm font-bold text-slate-950 bg-lime-400 hover:bg-lime-500 rounded-xl shadow-sm"
            >
              {t('nav.startFree')}
            </a>
            <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-1">
              {t('nav.directSupport')}: +2349158482622
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
