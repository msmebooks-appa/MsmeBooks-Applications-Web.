import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  ChevronRight, 
  Menu, 
  X, 
  ArrowRight, 
  Globe, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenApplyModal: (tier?: string) => void;
  onOpenCategoryModal?: (categoryId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenApplyModal }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Ecosystem', href: '#ecosystem' },
    { label: 'Partner Program', href: '#commission-tiers' },
    { label: 'Comparison', href: '#comparison' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Partner Dashboard', href: '#partner-dashboard' },
    { label: 'Community', href: '#community' },
    { label: 'Success Stories', href: '#success-stories' },
    { label: 'FAQ', href: '#faqs' },
  ];

  return (
    <>
      {/* Top Pan-African Trust Bar */}
      <div id="top-announcement-bar" className="bg-[#0A192F] text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#84CC16]/20 text-[#84CC16] border border-[#84CC16]/40">
              New
            </span>
            <span>Pan-African MSME Partner Program: Up to 40% Recurring Revenue Share</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#84CC16]" />
              Nigeria • Kenya • Ghana • Rwanda • South Africa • Tanzania
            </span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <a 
              href="#faqs" 
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Partner Support
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header
        id="main-navbar"
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
            : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#0A2540] flex items-center justify-center shadow-md shadow-[#0F4C81]/20 group-hover:scale-105 transition-transform duration-200">
                <div className="relative">
                  <Briefcase className="w-5 h-5 text-white" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#84CC16] border-2 border-[#0A2540]" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center tracking-tight">
                  <span className="text-xl font-extrabold text-[#0A192F] font-display">Msme</span>
                  <span className="text-xl font-extrabold text-[#0F4C81] font-display">Books</span>
                  <span className="w-2 h-2 rounded-full bg-[#84CC16] ml-0.5 inline-block"></span>
                </div>
                <span className="text-[10px] tracking-wider uppercase text-slate-500 font-semibold -mt-1">
                  Partner Ecosystem
                </span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-[#0F4C81] hover:bg-slate-50 rounded-lg transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop Action CTAs */}
            <div className="hidden md:flex items-center gap-3">
              <button
                id="nav-partner-login-btn"
                onClick={() => onOpenApplyModal('login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#0F4C81] transition-colors"
              >
                Partner Login
              </button>
              <button
                id="nav-become-partner-btn"
                onClick={() => onOpenApplyModal()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#0F4C81] to-[#1E40AF] hover:from-[#0A3861] hover:to-[#172554] shadow-md shadow-[#0F4C81]/25 hover:shadow-lg hover:shadow-[#0F4C81]/30 transition-all duration-200 active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-[#84CC16]" />
                <span>Become a Partner</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 mt-3 shadow-xl">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-[#0F4C81] rounded-lg"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenApplyModal('login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-slate-700 border border-slate-300 rounded-xl"
                >
                  Partner Portal Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenApplyModal();
                  }}
                  className="w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#0F4C81] rounded-xl shadow-md"
                >
                  <span>Become a MsmeBooks Partner</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
