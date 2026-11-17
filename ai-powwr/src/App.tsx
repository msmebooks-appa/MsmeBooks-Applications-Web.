import React, { useState, useEffect } from 'react';
import { INITIAL_FAQS } from './data/faqs';
import { REGIONS_DATA, RegionInfo } from './data/productModules';
import { FaqItemData } from './types/faq';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryGrid } from './components/CategoryGrid';
import { PopularFaqs } from './components/PopularFaqs';
import { FaqExplorer } from './components/FaqExplorer';
import { IndustryFaqDirectory } from './components/IndustryFaqDirectory';
import { SharedFaqShowcase } from './components/SharedFaqShowcase';
import { PricingRevenueShowcase } from './components/PricingRevenueShowcase';
import { StillNeedHelp } from './components/StillNeedHelp';
import { Footer } from './components/Footer';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LiveChatSupportModal } from './components/LiveChatSupportModal';
import { AdminCmsModal } from './components/AdminCmsModal';
import { PageNavigationControls } from './components/PageNavigationControls';
import { FAQ_TRANSLATIONS } from './data/faqTranslations';
import { Sparkles, ArrowUp, MessageCircle } from 'lucide-react';

export function App() {
  const [faqs, setFaqs] = useState<FaqItemData[]>(() => {
    // Attempt to load from localStorage if previously updated in CMS
    try {
      const stored = localStorage.getItem('msmebooks_faqs_v1');
      if (stored) {
        const parsed: FaqItemData[] = JSON.parse(stored);
        return parsed.map((item) => ({
          ...item,
          relatedFaqIds: Array.isArray(item.relatedFaqIds) ? item.relatedFaqIds : [],
          translations: {
            ...(FAQ_TRANSLATIONS[item.id] || {}),
            ...(item.translations || {})
          }
        }));
      }
    } catch (e) {
      // fallback to initial
    }
    return INITIAL_FAQS.map((item) => ({
      ...item,
      relatedFaqIds: Array.isArray(item.relatedFaqIds) ? item.relatedFaqIds : [],
      translations: {
        ...(FAQ_TRANSLATIONS[item.id] || {}),
        ...(item.translations || {})
      }
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'all' | 'popular' | 'recent'>('all');
  const [explorerOpenFaqId, setExplorerOpenFaqId] = useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = useState<RegionInfo>(REGIONS_DATA[0]);

  // Modals
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Theme state with localStorage persistence & system preference detection
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('msmebooks_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('msmebooks_theme', 'light');
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('msmebooks_faqs_v1', JSON.stringify(faqs));
    } catch (e) {
      // ignore quota errors
    }
  }, [faqs]);

  // Handle URL Hash anchor on load
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#faq-')) {
        const targetEl = document.querySelector(hash);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('hashchange', handleHash);
    const timer = setTimeout(handleHash, 500);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('hashchange', handleHash);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Helpful voting handler
  const handleVoteHelpful = (faqId: string, helpful: boolean) => {
    setFaqs((prev) =>
      prev.map((f) => {
        if (f.id === faqId) {
          return {
            ...f,
            helpfulVotes: helpful ? f.helpfulVotes + 1 : f.helpfulVotes,
            unhelpfulVotes: !helpful ? f.unhelpfulVotes + 1 : f.unhelpfulVotes
          };
        }
        return f;
      })
    );
  };

  // CMS Save FAQ
  const handleSaveFaq = (savedFaq: FaqItemData) => {
    setFaqs((prev) => {
      const exists = prev.some((f) => f.id === savedFaq.id);
      if (exists) {
        return prev.map((f) => (f.id === savedFaq.id ? savedFaq : f));
      }
      return [savedFaq, ...prev];
    });
  };

  // CMS Delete FAQ
  const handleDeleteFaq = (faqId: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== faqId));
  };

  // CMS Bulk Import
  const handleBulkImport = (newFaqs: FaqItemData[]) => {
    setFaqs(newFaqs);
  };

  // Quick Suggested Chip handler
  const handleSelectSuggestedChip = (chip: string) => {
    setSearchQuery(chip);
    const el = document.getElementById('faq-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Navigate to hub with specific pre-filters
  const handleNavigateWithFilters = (catId: string | null, indId: string | null) => {
    setSelectedCategory(catId);
    setSelectedIndustry(indId);
    setSearchQuery('');
    const el = document.getElementById('faq-explorer');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open a specific FAQ inside the main explorer (used when clicking a related article outside current section subset)
  const handleOpenFaqInExplorer = (faqId: string) => {
    const target = faqs.find((f) => f.id === faqId);
    if (target) {
      setSearchQuery('');
      setSelectedCategory(target.categoryId || null);
      setSelectedIndustry(null);
      setSelectedModule(null);
      setExplorerOpenFaqId(faqId);
      const el = document.getElementById('faq-explorer');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleFocusSearch = () => {
    const input = document.getElementById('faq-hero-search-input');
    if (input) {
      input.focus();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8FC] dark:bg-[#070D1B] text-[#17233D] dark:text-slate-100 transition-colors duration-300">
      {/* 1. Global Navigation Header */}
      <Header
        currentRegion={currentRegion}
        onSelectRegion={setCurrentRegion}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onSearchFocus={handleFocusSearch}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* 2. Hero Section with Intelligent Search */}
      <Hero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectSuggestedChip={handleSelectSuggestedChip}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        totalFaqCount={faqs.length}
      />

      {/* 3. Category Navigation Grid (All 24 Categories) */}
      <CategoryGrid
        faqs={faqs}
        selectedCategoryId={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId || null);
        }}
      />

      {/* 4. Most Frequently Asked Questions (Featured & Popular) */}
      <PopularFaqs
        faqs={faqs}
        onVoteHelpful={handleVoteHelpful}
        onExploreAll={() => {
          const el = document.getElementById('faq-explorer');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFaqInExplorer={handleOpenFaqInExplorer}
      />

      {/* 5. Interactive 2-Column FAQ Explorer with Live Filters */}
      <FaqExplorer
        faqs={faqs}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedIndustry={selectedIndustry}
        onSelectIndustry={setSelectedIndustry}
        selectedModule={selectedModule}
        onSelectModule={setSelectedModule}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        onVoteHelpful={handleVoteHelpful}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        openFaqId={explorerOpenFaqId}
        onOpenFaqIdChange={setExplorerOpenFaqId}
      />

      {/* 6. Dedicated 20-Industry FAQ Directory */}
      <IndustryFaqDirectory
        faqs={faqs}
        onVoteHelpful={handleVoteHelpful}
        onFilterIndustryInExplorer={(indId) => {
          setSelectedIndustry(indId);
          const el = document.getElementById('faq-explorer');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenFaqInExplorer={handleOpenFaqInExplorer}
      />

      {/* 7. Centralized Syndication Showcase (Section 29) */}
      <SharedFaqShowcase
        faqs={faqs}
        onVoteHelpful={handleVoteHelpful}
        onNavigateToHubWithFilter={handleNavigateWithFilters}
        onOpenFaqInExplorer={handleOpenFaqInExplorer}
      />

      {/* 8. Live Global Currency Pricing & Revenue Showcase (#pricing) */}
      <PricingRevenueShowcase />

      {/* 9. Still Need Help Conversion Section */}
      <StillNeedHelp
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenLiveChat={() => setIsLiveChatOpen(true)}
      />

      {/* 10. Global SaaS Footer */}
      <Footer />

      {/* Up and Down Navigation Buttons at the Left Side of Landing Page */}
      <PageNavigationControls />

      {/* Floating Action Controls at Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2.5 rounded-full bg-white dark:bg-[#131E36] text-slate-700 dark:text-slate-200 shadow-md hover:bg-slate-50 dark:hover:bg-[#1C2C4E] border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Scroll to top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        {/* Secondary: Ask AI Assistant */}
        <button
          onClick={() => setIsAiAssistantOpen(true)}
          className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 dark:bg-[#131E36]/95 backdrop-blur-sm text-slate-700 dark:text-slate-200 shadow-md hover:shadow-lg hover:border-[#1254B5] dark:hover:border-[#B7E522] border border-slate-200 dark:border-slate-700 transition-all transform hover:scale-102 cursor-pointer text-xs font-semibold"
          title="Ask MsmeBooks AI Assistant"
        >
          <div className="w-4 h-4 rounded-full bg-[#F4FCD9] text-[#1254B5] flex items-center justify-center font-bold">
            <Sparkles className="w-2.5 h-2.5 text-[#1254B5]" />
          </div>
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Primary: Floating 'Live Chat' Icon for Support Agents */}
        <button
          onClick={() => setIsLiveChatOpen(true)}
          className="group relative inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#1254B5] hover:bg-[#0A3D87] text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-white/20 cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-400/30"
          aria-label="Open Live Chat to contact support agents"
          title="Live Chat — Contact Support Agents"
        >
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[#B7E522]" />
            </div>
            {/* Animated Online Pulsing Dot */}
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
            </span>
          </div>

          <div className="flex flex-col items-start leading-tight text-left">
            <span className="text-xs sm:text-sm font-bold tracking-tight">Live Chat</span>
            <span className="text-[10px] text-blue-200 font-medium">3 Agents Online</span>
          </div>
        </button>
      </div>

      {/* Live Chat Support Modal / Help Dialog */}
      <LiveChatSupportModal
        isOpen={isLiveChatOpen}
        onClose={() => setIsLiveChatOpen(false)}
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
      />

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        faqs={faqs}
        onSelectFaqSlug={(slug) => {
          const el = document.getElementById(`faq-${slug}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Admin FAQ Content Management System Modal */}
      <AdminCmsModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        faqs={faqs}
        onSaveFaq={handleSaveFaq}
        onDeleteFaq={handleDeleteFaq}
        onBulkImport={handleBulkImport}
      />
    </div>
  );
}

export default App;
