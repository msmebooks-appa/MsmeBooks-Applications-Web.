import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { CmsAdminDrawer } from './components/CmsAdminDrawer';
import { LiveChatWidget } from './components/LiveChatWidget';
import { SuccessStoriesLanding } from './pages/SuccessStoriesLanding';
import { StoryDetailPage } from './pages/StoryDetailPage';
import { IndustryUseCasesPage } from './pages/IndustryUseCasesPage';
import { CustomerReviewsPage } from './pages/CustomerReviewsPage';
import { INITIAL_STORIES } from './data/stories';
import { INITIAL_REVIEWS } from './data/reviews';
import { SuccessStory, CustomerReview } from './types';
import { LanguageProvider } from './context/LanguageContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { OfflineBanner } from './components/OfflineBanner';

export default function App() {
  // 1. Stories State with LocalStorage Persistence
  const [stories, setStories] = useState<SuccessStory[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_stories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((p: SuccessStory) => {
            const def = INITIAL_STORIES.find((s) => s.id === p.id || s.slug === p.slug);
            if (!p.chartMetrics && def?.chartMetrics) {
              return { ...p, chartMetrics: def.chartMetrics };
            }
            return p;
          });
        }
      }
    } catch (e) {
      console.error('Error loading stories from localStorage', e);
    }
    return INITIAL_STORIES;
  });

  // 2. Reviews State with LocalStorage Persistence
  const [reviews, setReviews] = useState<CustomerReview[]>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading reviews from localStorage', e);
    }
    return INITIAL_REVIEWS;
  });

  // 3. Routing State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      if (pathname && pathname !== '/' && pathname !== '') {
        return pathname;
      }
    }
    return '/use-cases-success-stories';
  });

  // Modals & Global Search state
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoIndustry, setDemoIndustry] = useState<string>('Retail & Supermarkets');
  const [adminCmsOpen, setAdminCmsOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState<string>('');

  // 4. Dark Mode Theme State with LocalStorage Persistence
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const savedTheme = localStorage.getItem('msmebooks_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      if (typeof window !== 'undefined' && window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // Apply dark class to document root
  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('msmebooks_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('msmebooks_theme', 'light');
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Sync route changes with browser history
  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname;
      if (pathname && pathname !== '/') {
        setCurrentPath(pathname);
      } else {
        setCurrentPath('/use-cases-success-stories');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync stories to localStorage
  const handleSaveStory = (updatedStory: SuccessStory) => {
    setStories((prev) => {
      const exists = prev.some((s) => s.id === updatedStory.id);
      let newStories: SuccessStory[];
      if (exists) {
        newStories = prev.map((s) => (s.id === updatedStory.id ? updatedStory : s));
      } else {
        newStories = [updatedStory, ...prev];
      }
      try {
        localStorage.setItem('msmebooks_stories', JSON.stringify(newStories));
      } catch (e) {
        console.error(e);
      }
      return newStories;
    });
  };

  const handleDeleteStory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this story?')) {
      setStories((prev) => {
        const newStories = prev.filter((s) => s.id !== id);
        try {
          localStorage.setItem('msmebooks_stories', JSON.stringify(newStories));
        } catch (e) {
          console.error(e);
        }
        return newStories;
      });
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all stories back to the 12 official initial templates?')) {
      setStories(INITIAL_STORIES);
      try {
        localStorage.removeItem('msmebooks_stories');
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleAddNewReview = (reviewData: any) => {
    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      customerName: reviewData.customerName,
      role: reviewData.role,
      companyName: reviewData.companyName,
      industry: reviewData.industry,
      region: reviewData.region,
      businessSize: 'Verified Small Business',
      modulesUsed: reviewData.modulesUsed,
      rating: reviewData.rating,
      quote: reviewData.quote,
      detailedFeedback: reviewData.detailedFeedback,
      isVerified: true,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews((prev) => {
      const updated = [newRev, ...prev];
      try {
        localStorage.setItem('msmebooks_reviews', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectStory = (slug: string) => {
    navigateTo(`/use-cases-success-stories/${slug}`);
  };

  const handleOpenDemo = (industry?: string) => {
    if (industry) {
      setDemoIndustry(industry);
    }
    setDemoModalOpen(true);
  };

  const handleApplySearchFilter = () => {
    const isLanding =
      currentPath === '/use-cases-success-stories' ||
      currentPath === '/' ||
      currentPath === '';

    if (!isLanding) {
      setCurrentPath('/use-cases-success-stories');
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', '/use-cases-success-stories');
      }
      setTimeout(() => {
        const el = document.getElementById('story-grid');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    } else if (typeof document !== 'undefined') {
      const el = document.getElementById('story-grid');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Route Dispatcher
  const renderCurrentView = () => {
    // 1. Single story detail route: /use-cases-success-stories/[slug]
    if (currentPath.startsWith('/use-cases-success-stories/')) {
      const slug = currentPath.replace('/use-cases-success-stories/', '');
      const foundStory = stories.find((s) => s.slug === slug);

      if (foundStory) {
        return (
          <StoryDetailPage
            story={foundStory}
            allStories={stories}
            onSelectStory={handleSelectStory}
            onNavigate={navigateTo}
            onOpenDemo={handleOpenDemo}
          />
        );
      } else {
        // Fallback if slug not found
        return (
          <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Story Profile Not Found</h2>
            <p className="text-sm text-slate-600">The requested success story may have moved or been updated.</p>
            <button
              onClick={() => navigateTo('/use-cases-success-stories')}
              className="px-6 py-2.5 bg-[#0A3D62] text-white font-bold text-xs rounded-lg cursor-pointer"
            >
              Back to Success Stories
            </button>
          </div>
        );
      }
    }

    // 2. Dedicated Industry Use Cases Page: /use-cases
    if (currentPath === '/use-cases') {
      return (
        <IndustryUseCasesPage
          stories={stories}
          onSelectStory={handleSelectStory}
          onNavigate={navigateTo}
          onOpenDemo={handleOpenDemo}
        />
      );
    }

    // 3. Customer Reviews Page: /customer-reviews
    if (currentPath === '/customer-reviews') {
      return (
        <CustomerReviewsPage
          reviews={reviews}
          stories={stories}
          onSelectStory={handleSelectStory}
          onOpenDemo={() => handleOpenDemo()}
          onAddNewReview={handleAddNewReview}
        />
      );
    }

    // 4. Platform Overview route: /platform
    if (currentPath === '/platform') {
      return (
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A3D62]">
              The MsmeBooks Architecture
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              One Unified Business Operating System
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              Connect checkout tills, warehouse shelves, banking ledgers, and executive decisions without fragmented software silos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-lg">Point of Sale (POS)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Superfast barcoded tills, split tender, restaurant table layouts, mobile payments, and offline receipt caching.
              </p>
              <button
                onClick={() => navigateTo('/use-cases')}
                className="text-xs font-bold text-[#0A3D62] hover:underline"
              >
                Explore POS Use Cases &rarr;
              </button>
            </div>

            <div className="bg-white dark:bg-[#0B1E30] p-6 rounded-2xl border border-slate-200 dark:border-[#17334D] shadow-xs space-y-3 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Inventory &amp; Warehousing</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Serial/IMEI tracking, batch FEFO expiry alerts, multi-warehouse in-transit transfers, and landed cost computation.
              </p>
              <button
                onClick={() => navigateTo('/use-cases')}
                className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 hover:underline"
              >
                Explore Inventory Workflows &rarr;
              </button>
            </div>

            <div className="bg-white dark:bg-[#0B1E30] p-6 rounded-2xl border border-slate-200 dark:border-[#17334D] shadow-xs space-y-3 transition-colors">
              <h3 className="font-bold text-slate-900 dark:text-white text-lg">Accounting &amp; Consolidation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Automated journal posting, VAT schedules, locked period audits, and instant multi-branch consolidation.
              </p>
              <button
                onClick={() => navigateTo('/use-cases')}
                className="text-xs font-bold text-[#0A3D62] dark:text-sky-300 hover:underline"
              >
                Explore Accounting Solutions &rarr;
              </button>
            </div>
          </div>

          <div className="text-center pt-6">
            <button
              onClick={() => handleOpenDemo()}
              className="px-8 py-3 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer transition-all"
            >
              Book a Comprehensive Platform Demo
            </button>
          </div>
        </div>
      );
    }

    // Default: Main Success Stories Landing Page (/use-cases-success-stories or root)
    return (
      <SuccessStoriesLanding
        stories={stories}
        onSelectStory={handleSelectStory}
        onNavigate={navigateTo}
        onOpenDemo={handleOpenDemo}
        searchQuery={globalSearchQuery}
        onSearchChange={setGlobalSearchQuery}
      />
    );
  };

  return (
    <LanguageProvider>
      <ConnectionProvider>
        <CurrencyProvider>
          <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-[#07131F] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#7CB518]/30 selection:text-[#0A3D62] transition-colors duration-200 ${isDarkMode ? 'dark' : ''}`}>
            {/* Universal Top Bar with Global Search, Visual Connection Status Indicator & Global Currency Selector */}
            <Navbar
              currentPath={currentPath}
              onNavigate={navigateTo}
              onOpenDemo={() => handleOpenDemo()}
              onOpenAdmin={() => setAdminCmsOpen(true)}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
              stories={stories}
              searchQuery={globalSearchQuery}
              onSearchChange={setGlobalSearchQuery}
              onSelectStory={handleSelectStory}
              onApplySearchFilter={handleApplySearchFilter}
            />

            {/* Offline Mode Alert Banner (renders when offline) */}
            <OfflineBanner />

            {/* Main Routed Page Content */}
            <main className="flex-1">
              {renderCurrentView()}
            </main>

            {/* Universal Brand Footer */}
            <Footer
              onNavigate={navigateTo}
              onOpenDemo={() => handleOpenDemo()}
            />

            {/* Interactive Global Demo Modal */}
            <DemoModal
              isOpen={demoModalOpen}
              onClose={() => setDemoModalOpen(false)}
              preselectedIndustry={demoIndustry}
            />

            {/* Interactive CMS Admin Drawer */}
            <CmsAdminDrawer
              isOpen={adminCmsOpen}
              onClose={() => setAdminCmsOpen(false)}
              stories={stories}
              onSaveStory={handleSaveStory}
              onDeleteStory={handleDeleteStory}
              onResetToDefaults={handleResetToDefaults}
              onViewStory={(slug) => handleSelectStory(slug)}
            />

            {/* Floating Live Chat & Support Help Dialog */}
            <LiveChatWidget
              onOpenDemo={handleOpenDemo}
              onNavigate={navigateTo}
            />
          </div>
        </CurrencyProvider>
      </ConnectionProvider>
    </LanguageProvider>
  );
}
