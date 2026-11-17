import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TableOfContents } from './components/TableOfContents';
import { TermsContent } from './components/TermsContent';
import { RelatedDocuments } from './components/RelatedDocuments';
import { Footer } from './components/Footer';
import { AcceptanceModal } from './components/AcceptanceModal';
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { LegalChecklistDrawer } from './components/LegalChecklistDrawer';
import { LeftNavigationButtons } from './components/LeftNavigationButtons';
import { LiveChatWidget } from './components/LiveChatWidget';
import { TERMS_SECTIONS, DOCUMENT_METADATA } from './data/termsContent';
import { 
  Language, 
  TRANSLATIONS, 
  getLocalizedSections, 
  getLocalizedCategories 
} from './data/translations';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { OfflineBanner } from './components/OfflineBanner';
import { ArrowUp, Coins } from 'lucide-react';

function AppContent() {
  const { currency, currencyInfo, formatNgn } = useCurrency();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSectionId, setActiveSectionId] = useState('section-1');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    TERMS_SECTIONS.forEach(s => { initial[s.id] = true; });
    return initial;
  });
  const [expandedAll, setExpandedAll] = useState(true);
  const [readProgress, setReadProgress] = useState(0);

  // Language state (en, fr, pt, es) with localStorage persistence
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_lang');
      if (saved === 'en' || saved === 'fr' || saved === 'pt' || saved === 'es') {
        return saved as Language;
      }
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('msmebooks_lang', language);
    document.documentElement.lang = language;
  }, [language]);

  // Active translation dictionary
  const t = useMemo(() => TRANSLATIONS[language] || TRANSLATIONS.en, [language]);

  // Localized sections & categories based on selected language
  const localizedSections = useMemo(() => getLocalizedSections(language), [language]);
  const localizedCategories = useMemo(() => getLocalizedCategories(language), [language]);

  // Theme state: light or dark (with persistent storage & system preference detection)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('msmebooks_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Modals state
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [isChecklistDrawerOpen, setIsChecklistDrawerOpen] = useState(false);

  // ScrollSpy & Reading Progress Tracker
  useEffect(() => {
    const handleScroll = () => {
      // Calculate reading progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)));
        setReadProgress(currentProgress);
      }

      // Find current section in view
      const scrollPosition = window.scrollY + 160;
      for (let i = localizedSections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(localizedSections[i].id);
        if (sectionEl) {
          const top = sectionEl.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(localizedSections[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [localizedSections]);

  // Handle URL hash on initial load
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
          setActiveSectionId(targetId);
        }, 300);
      }
    }
  }, []);

  const handleSelectSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.replaceState(null, '', `#${id}`);
    }
  };

  const handleToggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleExpandAll = () => {
    const nextState = !expandedAll;
    setExpandedAll(nextState);
    const updated: Record<string, boolean> = {};
    localizedSections.forEach(s => { updated[s.id] = nextState; });
    setExpandedSections(updated);
  };

  // Print terms functionality
  const handlePrint = () => {
    // Ensure all sections are expanded before printing
    const allExpanded: Record<string, boolean> = {};
    localizedSections.forEach(s => { allExpanded[s.id] = true; });
    setExpandedSections(allExpanded);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  // Download PDF/Text export with active currency schedule
  const handleDownloadText = () => {
    let docText = `${DOCUMENT_METADATA.title.toUpperCase()} (${language.toUpperCase()})\n`;
    docText += `${t.hero.subtitle}\n`;
    docText += `Official Master SaaS Agreement - Version ${DOCUMENT_METADATA.version}\n`;
    docText += `Effective Date: ${DOCUMENT_METADATA.effectiveDate} | Last Updated: ${DOCUMENT_METADATA.lastUpdated}\n`;
    docText += `Website: ${DOCUMENT_METADATA.brandWebsite} | Support: ${DOCUMENT_METADATA.supportPhone}\n`;
    docText += `Active Global Billing Currency: ${currency} (${currencyInfo.symbol} - ${currencyInfo.name})\n`;
    docText += `SaaS Plan Pricing Schedule: Free (${currencyInfo.symbol} 0) | Growth (${formatNgn(35000)}/mo) | Enterprise (${formatNgn(95000)}/mo)\n`;
    docText += `Conversion Benchmark: 1 USD ≈ ${currencyInfo.ratePerUsd} ${currency}\n`;
    docText += `------------------------------------------------------------------------\n\n`;

    localizedSections.forEach(sec => {
      docText += `SECTION ${sec.number}: ${sec.title.toUpperCase()}\n`;
      docText += `Category: ${sec.category}\n`;
      docText += `Summary: ${sec.summary}\n\n`;
      sec.content.forEach(p => {
        docText += `${p}\n\n`;
      });

      if (sec.definitions) {
        docText += `DEFINITIONS:\n`;
        sec.definitions.forEach(d => {
          docText += ` - ${d.term}: ${d.definition}\n`;
        });
        docText += `\n`;
      }

      if (sec.subsections) {
        sec.subsections.forEach(sub => {
          docText += `${sub.subtitle}\n`;
          sub.paragraphs.forEach(sp => {
            docText += `  ${sp}\n`;
          });
          docText += `\n`;
        });
      }
      docText += `------------------------------------------------------------------------\n\n`;
    });

    const blob = new Blob([docText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MsmeBooks-Terms-and-Conditions-${language}-${currency}-v${DOCUMENT_METADATA.version}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleJumpToSectionFromChecklist = (sectionNum: number) => {
    const sec = localizedSections.find(s => s.number === sectionNum);
    if (sec) {
      handleSelectSection(sec.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#07131F] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Header
        onOpenAcceptanceDemo={() => setIsAcceptanceModalOpen(true)}
        onOpenChecklist={() => setIsChecklistDrawerOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        language={language}
        onLanguageChange={setLanguage}
        t={t}
      />

      {/* Visual Offline Mode Notification Banner */}
      <OfflineBanner />

      {/* Global Currency & Exchange Rate Bar */}
      <aside aria-label="Global currency notification" className="no-print bg-[#0B3558]/5 dark:bg-[#0D2238]/60 border-b border-blue-200/50 dark:border-slate-800 py-1.5 px-4 text-xs transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-[11px] text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 truncate">
            <Coins className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
            <span className="font-semibold text-[#0B3558] dark:text-[#84CC16]">
              Active Billing Currency:
            </span>
            <span className="inline-flex items-center gap-1 font-mono font-bold text-slate-900 dark:text-slate-100 bg-white dark:bg-[#0A1A2C] px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/80 shadow-2xs">
              <span aria-hidden="true">{currencyInfo.flag}</span>
              <span>{currency}</span>
              <span className="text-slate-400 dark:text-slate-500 font-normal">({currencyInfo.symbol})</span>
            </span>
            <span className="hidden md:inline text-slate-400 dark:text-slate-600">·</span>
            <span className="hidden md:inline text-slate-500 dark:text-slate-400 truncate">
              Growth Tier: <strong className="text-slate-800 dark:text-slate-200">{formatNgn(35000)}/mo</strong> | Enterprise: <strong className="text-slate-800 dark:text-slate-200">{formatNgn(95000)}/mo</strong>
            </span>
          </div>

          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 shrink-0">
            1 USD ≈ {currencyInfo.ratePerUsd} {currency}
          </div>
        </div>
      </aside>

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection
          onPrint={handlePrint}
          onDownloadText={handleDownloadText}
          onOpenVersions={() => setIsVersionModalOpen(true)}
          onOpenChecklist={() => setIsChecklistDrawerOpen(true)}
          onOpenAcceptanceDemo={() => setIsAcceptanceModalOpen(true)}
          t={t}
        />

        {/* Content Area: Sticky Table of Contents (Left) + Full Terms (Right) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
            {/* Table of Contents */}
            <TableOfContents
              sections={localizedSections}
              categories={localizedCategories}
              activeSectionId={activeSectionId}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectSection={handleSelectSection}
              expandedAll={expandedAll}
              onToggleExpandAll={handleToggleExpandAll}
              readProgress={readProgress}
              t={t}
            />

            {/* Terms and Conditions Main Content Area */}
            <TermsContent
              sections={localizedSections}
              searchQuery={searchQuery}
              expandedSections={expandedSections}
              onToggleSection={handleToggleSection}
              onOpenChecklist={() => setIsChecklistDrawerOpen(true)}
              onOpenAcceptanceDemo={() => setIsAcceptanceModalOpen(true)}
              t={t}
            />
          </div>
        </div>

        {/* Related Legal Documents Section */}
        <RelatedDocuments t={t} />

        {/* Floating Quick Action: Back to Top (positioned above Live Chat) */}
        <div className="fixed bottom-22 right-6 z-30 no-print hidden sm:block">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:border-[#84CC16] shadow-md rounded-xl transition-all group focus-visible:outline-2 focus-visible:outline-[#84CC16]"
            aria-label={t.toc.backToTop}
            title={t.toc.backToTop}
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

        {/* Floating Up & Down Buttons at the Left Side of the Landing Page */}
        <LeftNavigationButtons
          sections={localizedSections}
          activeSectionId={activeSectionId}
          onSelectSection={handleSelectSection}
          t={t}
        />

        {/* Floating Live Chat at the Bottom-Right of the Screen */}
        <LiveChatWidget t={t} />
      </main>

      {/* Global Enterprise Footer */}
      <Footer t={t} />

      {/* Interactive SaaS Registration Consent Workflow Simulator */}
      <AcceptanceModal
        isOpen={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
        onViewTerms={() => {
          setIsAcceptanceModalOpen(false);
          const el = document.getElementById('section-1');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        t={t}
      />

      {/* Version History Archive Modal */}
      <VersionHistoryModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        t={t}
      />

      {/* Legal Counsel Pre-Publication Checklist Drawer */}
      <LegalChecklistDrawer
        isOpen={isChecklistDrawerOpen}
        onClose={() => setIsChecklistDrawerOpen(false)}
        onJumpToSection={handleJumpToSectionFromChecklist}
        t={t}
      />
    </div>
  );
}

export default function App() {
  return (
    <ConnectionProvider>
      <CurrencyProvider>
        <AppContent />
      </CurrencyProvider>
    </ConnectionProvider>
  );
}
