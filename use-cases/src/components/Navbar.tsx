import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Menu, X, Settings, Sun, Moon, Search } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { CurrencySelector } from './CurrencySelector';
import { ConnectionStatusIndicator } from './ConnectionStatusIndicator';
import { GlobalStorySearch } from './GlobalStorySearch';
import { useLanguage } from '../context/LanguageContext';
import { SuccessStory } from '../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenDemo: () => void;
  onOpenAdmin: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  stories: SuccessStory[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectStory: (slug: string) => void;
  onApplySearchFilter: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  onOpenDemo,
  onOpenAdmin,
  isDarkMode,
  onToggleTheme,
  stories,
  searchQuery,
  onSearchChange,
  onSelectStory,
  onApplySearchFilter,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { label: t.nav.stories, path: '/use-cases-success-stories' },
    { label: t.nav.useCases, path: '/use-cases' },
    { label: t.nav.reviews, path: '/customer-reviews' },
    { label: t.nav.platform, path: '/platform' },
  ];

  const handleLinkClick = (path: string) => {
    onNavigate(path);
    setMobileMenuOpen(false);
  };

  const handleStoryPicked = (slug: string) => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    onSelectStory(slug);
  };

  const handleFilterApplied = () => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    onApplySearchFilter();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#081827]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#162D42] transition-colors duration-200">
      {/* Top Bar One-Row Three-Zone + Global Search Contract */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3 lg:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => handleLinkClick('/use-cases-success-stories')}
          className="text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0A3D62] rounded-md shrink-0"
          aria-label="MsmeBooks Home"
        >
          <BrandLogo size="md" />
        </button>

        {/* Zone 2: 4 Clean Single-Line Text Navigation Links (Desktop xl+) */}
        <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-[13px] 2xl:text-sm font-semibold text-slate-700 dark:text-slate-300 shrink-0">
          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/use-cases-success-stories' &&
                currentPath.startsWith('/use-cases-success-stories'));
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
                  isActive
                    ? 'text-[#0A3D62] dark:text-white font-bold border-b-2 border-[#7CB518] dark:border-[#90CF24]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0A3D62] dark:hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Global Success Stories Search Input (Tablet md+ and Desktop xl+) */}
        <div className="hidden md:block flex-1 max-w-xs lg:max-w-sm xl:max-w-[230px] 2xl:max-w-[270px] min-w-[175px]">
          <GlobalStorySearch
            stories={stories}
            query={searchQuery}
            onQueryChange={onSearchChange}
            onSelectStory={handleStoryPicked}
            onApplyFilterToGrid={handleFilterApplied}
          />
        </div>

        {/* Zone 3: Quick Utilities + Primary Action */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Mobile Search Toggle (< md) */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen((prev) => !prev);
              setMobileMenuOpen(false);
            }}
            aria-label={t.navSearch.ariaLabel}
            aria-expanded={mobileSearchOpen}
            className={`md:hidden p-2 rounded-lg transition-colors cursor-pointer relative ${
              mobileSearchOpen || searchQuery.trim()
                ? 'bg-[#0A3D62]/10 dark:bg-sky-500/20 text-[#0A3D62] dark:text-[#90CF24]'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#122A3F]'
            }`}
          >
            <Search className="w-4 h-4" />
            {searchQuery.trim() && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#7CB518]" />
            )}
          </button>

          {/* Visual Connection Status Indicator (Online / Offline Mode) */}
          <ConnectionStatusIndicator />

          {/* Global Multi-Currency Selector (16 Major Currencies) */}
          <CurrencySelector />

          {/* Pan-African & International Language Selector */}
          <LanguageSelector />

          {/* Theme Toggle Button (Light / Deep Navy Charcoal) */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? t.nav.themeLight : t.nav.themeDark}
            className="hidden sm:flex p-2 text-slate-500 hover:text-[#0A3D62] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-amber-400 dark:hover:bg-[#122A3F] rounded-lg transition-colors cursor-pointer items-center justify-center"
            aria-label={isDarkMode ? t.nav.themeLight : t.nav.themeDark}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-[#0A3D62]" />
            )}
          </button>

          {/* Quick Staff CMS Access */}
          <button
            onClick={onOpenAdmin}
            title={t.nav.cms}
            className="hidden sm:flex p-2 text-slate-500 hover:text-[#0A3D62] hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-[#122A3F] rounded-lg transition-colors cursor-pointer items-center justify-center"
            aria-label={t.nav.cms}
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Primary CTA */}
          <button
            onClick={onOpenDemo}
            className="px-3 sm:px-4 py-2 text-xs font-bold text-white bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] active:scale-[0.98] rounded-lg transition-all shadow-sm hover:shadow-md cursor-pointer whitespace-nowrap shrink-0"
          >
            {t.nav.bookDemo}
          </button>

          {/* Menu Hamburger (Mobile & Tablet/Small Laptop < xl) */}
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setMobileSearchOpen(false);
            }}
            className="xl:hidden p-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#122A3F] rounded-lg transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Expandable Mobile Search Strip (< md) */}
      {mobileSearchOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-[#162D42] bg-white dark:bg-[#081827] px-4 py-2.5 shadow-md">
          <GlobalStorySearch
            stories={stories}
            query={searchQuery}
            onQueryChange={onSearchChange}
            onSelectStory={handleStoryPicked}
            onApplyFilterToGrid={handleFilterApplied}
            compact
            autoFocus
          />
        </div>
      )}

      {/* Responsive Navigation Drawer (< xl) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-[#162D42] bg-white dark:bg-[#081827] px-4 pt-3 pb-5 space-y-2 shadow-lg">
          {/* Search Inside Mobile Drawer (< md) */}
          <div className="md:hidden pb-2">
            <GlobalStorySearch
              stories={stories}
              query={searchQuery}
              onQueryChange={onSearchChange}
              onSelectStory={handleStoryPicked}
              onApplyFilterToGrid={handleFilterApplied}
              compact
            />
          </div>

          {navLinks.map((link) => {
            const isActive =
              currentPath === link.path ||
              (link.path === '/use-cases-success-stories' &&
                currentPath.startsWith('/use-cases-success-stories'));
            return (
              <button
                key={link.path}
                onClick={() => handleLinkClick(link.path)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#F4F9EC] dark:bg-[#0D263B] text-[#0A3D62] dark:text-white font-bold border-l-4 border-[#7CB518] dark:border-[#90CF24]'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122A3F]'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 dark:border-[#162D42] flex flex-col gap-2">
            {/* Visual Connection Status in Mobile Drawer */}
            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#122A3F]/50">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Network:
              </span>
              <div className="w-48">
                <ConnectionStatusIndicator compact />
              </div>
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#122A3F]/50">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                {t.nav.language}:
              </span>
              <LanguageSelector compact />
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#122A3F]/50">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                Currency:
              </span>
              <CurrencySelector compact />
            </div>
            <button
              onClick={() => {
                onToggleTheme();
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122A3F] flex items-center justify-between cursor-pointer"
            >
              <span className="flex items-center gap-2">
                {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-[#0A3D62]" />}
                <span>{isDarkMode ? 'Deep Navy Charcoal' : 'Light Mode'}</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-[#122A3F] text-slate-500 dark:text-slate-400">
                {t.nav.themeSwitch}
              </span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#122A3F] flex items-center gap-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              {t.nav.cms}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
