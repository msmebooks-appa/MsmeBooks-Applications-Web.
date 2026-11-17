import React, { useState, useEffect } from 'react';
import { CurrencyCode } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider, useCurrency } from './context/CurrencyContext';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { OfflineGlobalBanner } from './components/ConnectionStatusIndicator';
import { Hero } from './components/Hero';
import { TrustBar } from './components/TrustBar';
import { Ecosystem } from './components/Ecosystem';
import { HeroVideo } from './components/HeroVideo';
import { FeatureShowcase } from './components/FeatureShowcase';
import { AfricanStorytelling } from './components/AfricanStorytelling';
import { Industries } from './components/Industries';
import { MultiBranch } from './components/MultiBranch';
import { EcommerceSection } from './components/EcommerceSection';
import { AiAssistant } from './components/AiAssistant';
import { BusinessIntelligence } from './components/BusinessIntelligence';
import { MobileExperience } from './components/MobileExperience';
import { VideoStorySection } from './components/VideoStorySection';
import { Testimonials } from './components/Testimonials';
import { SecuritySection } from './components/SecuritySection';
import { IntegrationsSection } from './components/IntegrationsSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { Modals } from './components/Modals';
import { LiveChatWidget } from './components/LiveChatWidget';
import { FloatingScrollNav } from './components/FloatingScrollNav';
import { UserProfileModal } from './components/UserProfileModal';

function AppContent() {
  const { currentCurrency, setCurrency } = useCurrency();
  const { isProfileOpen, closeProfile, profileInitialTab } = useNotification();
  const [isStartFreeOpen, setIsStartFreeOpen] = useState(false);
  const [isBookDemoOpen, setIsBookDemoOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Close modals on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStartFreeOpen(false);
        setIsBookDemoOpen(false);
        setIsVideoOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#090E1A] text-slate-900 dark:text-slate-100 selection:bg-[#B7F000] selection:text-slate-950 font-sans antialiased transition-colors duration-200">
      {/* 1. Navbar with Theme Toggle, Language & Global Currency Selector */}
      <Navbar
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrency}
        onOpenStartFree={() => setIsStartFreeOpen(true)}
        onOpenBookDemo={() => setIsBookDemoOpen(true)}
      />

      {/* Floating Offline Notification Banner */}
      <OfflineGlobalBanner />

      {/* Main Page Sections */}
      <main id="main-content">
        {/* 2. Hero Section */}
        <Hero
          currentCurrency={currentCurrency}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
          onOpenVideo={() => setIsVideoOpen(true)}
        />

        {/* 3. Trust Bar & Pan-African Metrics */}
        <TrustBar />

        {/* 4. Interactive All-In-One Ecosystem & Real-Time Currency Converter */}
        <Ecosystem
          currentCurrency={currentCurrency}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
        />

        {/* 5. Interactive Demo Video & Walkthrough */}
        <HeroVideo
          onOpenStartFree={() => setIsStartFreeOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
        />

        {/* 6. Feature Showcase */}
        <FeatureShowcase
          currentCurrency={currentCurrency}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
        />

        {/* 7. African Storytelling & Case Studies */}
        <AfricanStorytelling />

        {/* 8. Tailored Industry Blueprints */}
        <Industries
          onOpenStartFree={() => setIsStartFreeOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
        />

        {/* 9. Multi-Branch & Head-Office Architecture */}
        <MultiBranch
          currentCurrency={currentCurrency}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
        />

        {/* 10. Integrated Digital Storefront & E-commerce */}
        <EcommerceSection
          currentCurrency={currentCurrency}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
        />

        {/* 11. AI Business Assistant */}
        <AiAssistant
          onOpenStartFree={() => setIsStartFreeOpen(true)}
        />

        {/* 12. Business Intelligence & Predictive Analytics */}
        <BusinessIntelligence
          currentCurrency={currentCurrency}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
        />

        {/* 13. Mobile Experience & Offline Engine */}
        <MobileExperience
          onOpenStartFree={() => setIsStartFreeOpen(true)}
        />

        {/* 14. Cinematic Video Case Study */}
        <VideoStorySection
          onOpenVideo={() => setIsVideoOpen(true)}
          onOpenStartFree={() => setIsStartFreeOpen(true)}
        />

        {/* 15. Customer Reviews & Social Proof */}
        <Testimonials />

        {/* 16. Security & Infrastructure */}
        <SecuritySection />

        {/* 17. Pan-African Integrations */}
        <IntegrationsSection />

        {/* 18. Final Conversion CTA */}
        <FinalCta
          onOpenStartFree={() => setIsStartFreeOpen(true)}
          onOpenBookDemo={() => setIsBookDemoOpen(true)}
        />
      </main>

      {/* 21. Pan-African Global Footer */}
      <Footer
        currentCurrency={currentCurrency}
        onSelectCurrency={setCurrency}
      />

      {/* Modal Overlays */}
      <Modals
        isStartFreeOpen={isStartFreeOpen}
        isBookDemoOpen={isBookDemoOpen}
        isVideoOpen={isVideoOpen}
        onCloseStartFree={() => setIsStartFreeOpen(false)}
        onCloseBookDemo={() => setIsBookDemoOpen(false)}
        onCloseVideo={() => setIsVideoOpen(false)}
      />

      {/* Floating Live Chat & Help Desk Widget */}
      <LiveChatWidget />

      {/* Floating Left Side Scroll Up/Down & Landmark Navigation */}
      <FloatingScrollNav />

      {/* User Profile & Alert Notification Settings Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={closeProfile}
        initialTab={profileInitialTab}
      />
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
