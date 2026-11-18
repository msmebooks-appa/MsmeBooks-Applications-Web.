import React, { useState } from 'react';
import { Logo } from './Logo';
import { Menu, X, ArrowRight, PhoneCall } from 'lucide-react';
import { CurrencySelector } from './CurrencySelector';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { ConnectionStatusIndicator, OfflineNoticeBanner } from './ConnectionStatusIndicator';
import { useLanguage } from '../context/LanguageContext';

interface NavbarProps {
  onOpenDemo: () => void;
  onScrollToForm: (enquiryType?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, onScrollToForm }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { tDict } = useLanguage();

  const navLinks = [
    { label: tDict.nav.products, href: '#products-overview' },
    { label: tDict.nav.panAfrica, href: '#pan-africa' },
    { label: tDict.nav.stories, href: '#success-stories' },
    { label: tDict.nav.partnerships, href: '#partnerships' },
    { label: tDict.nav.resources, href: '#help-centre' },
    { label: tDict.nav.faqs, href: '#faqs' },
    { label: tDict.nav.contact, href: '#contact-form', active: true },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top Banner Notice: Pan-African Enterprise Reach & Direct Line */}
      <div className="bg-[#0B3B82] dark:bg-[#071936] text-white px-4 py-1.5 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-[#a1e670]">{tDict.nav.bannerTitle}</span>
            <span className="hidden sm:inline text-slate-300">·</span>
            <span className="hidden sm:inline text-slate-200">
              {tDict.nav.bannerSub}
            </span>
          </div>
          <div className="flex items-center gap-4 shrink-0 text-slate-200">
            <a
              href="tel:+2349158482622"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#70C038]" />
              <span className="font-medium">+234 915 848 2622</span>
            </a>
            <span className="hidden md:inline text-slate-400">·</span>
            <a
              href="https://www.msmebooks.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline hover:text-[#a1e670] transition-colors"
            >
              www.msmebooks.org
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation: Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          {/* Zone 1: Single Brand Wordmark Element */}
          <a
            href="#"
            className="flex items-center whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B3B82] rounded-md"
            aria-label="MsmeBooks Home"
          >
            <Logo size="md" />
          </a>

          {/* Zone 2: Single-line clean navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 dark:text-slate-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`transition-colors whitespace-nowrap py-1 relative ${
                  link.active
                    ? 'text-[#0B3B82] dark:text-[#93C5FD] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#70C038]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0B3B82] dark:hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Connection Status, Theme Toggle, Currency Selector, Language Selector & Primary Action */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <ConnectionStatusIndicator />
            <ThemeToggle />
            <CurrencySelector />
            <LanguageSelector />
            <button
              onClick={() => onScrollToForm('Sales & Pricing')}
              className="text-xs font-semibold text-[#0B3B82] dark:text-[#93C5FD] hover:text-[#082d64] dark:hover:text-white px-2 py-2 transition-colors whitespace-nowrap"
            >
              {tDict.nav.talkToSales}
            </button>
            <button
              onClick={onOpenDemo}
              className="px-3.5 py-2.5 text-xs font-bold text-white bg-[#70C038] hover:bg-[#5fa62c] rounded-lg transition-all shadow-sm hover:shadow active:scale-98 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{tDict.nav.bookDemo}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Hamburger Toggle & Quick Controls */}
          <div className="flex items-center gap-1.5 lg:hidden">
            <ConnectionStatusIndicator compact />
            <LanguageSelector compact />
            <ThemeToggle compact />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200 hover:text-[#0B3B82] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3B82]"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0F172A] border-b border-slate-200 dark:border-slate-800 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 transition-colors">
          <nav className="flex flex-col gap-1 pb-4 border-b border-slate-100 dark:border-slate-800">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick(link.href);
                }}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  link.active
                    ? 'bg-[#f0f6ff] dark:bg-blue-950/50 text-[#0B3B82] dark:text-[#93C5FD] font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Network & Preferences
              </span>
              <div className="flex items-center gap-2">
                <ConnectionStatusIndicator />
                <ThemeToggle />
                <CurrencySelector />
                <LanguageSelector compact />
              </div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDemo();
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#70C038] hover:bg-[#5fa62c] rounded-lg transition-all"
            >
              {tDict.nav.bookDemo}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onScrollToForm('General Enquiry');
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-[#0B3B82] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              {tDict.nav.contactTeam}
            </button>
          </div>
        </div>
      )}

      {/* Offline Alert Bar when connection is lost */}
      <OfflineNoticeBanner />
    </header>
  );
};
