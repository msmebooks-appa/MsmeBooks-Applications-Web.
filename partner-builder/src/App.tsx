/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PartnerActivityTicker } from './components/PartnerActivityTicker';
import { BadgeShowcaseSection } from './components/BadgeShowcaseSection';
import { WhyPartnerSection } from './components/WhyPartnerSection';
import { PartnerCategoriesSection } from './components/PartnerCategoriesSection';
import { AuditSoftwareSliderSection } from './components/AuditSoftwareSliderSection';
import { ComparisonTableSection } from './components/ComparisonTableSection';
import { PartnerDirectorySection } from './components/PartnerDirectorySection';
import { CommissionCalculatorSection } from './components/CommissionCalculatorSection';
import { TrainingAcademySection } from './components/TrainingAcademySection';
import { PartnerImpactSection } from './components/PartnerImpactSection';
import { SuccessStoriesSection } from './components/SuccessStoriesSection';
import { TestimonialScroll } from './components/TestimonialScroll';
import { PartnerReferralRewardsSection } from './components/PartnerReferralRewardsSection';
import { PartnerSocialWallSection } from './components/PartnerSocialWallSection';
import { LeftScrollControls } from './components/LeftScrollControls';
import { PartnerAIAssistant } from './components/PartnerAIAssistant';
import { StickyBottomCtaBar } from './components/StickyBottomCtaBar';
import { SEOHead } from './components/SEOHead';
import { HowItWorksSection } from './components/HowItWorksSection';
import { ResourcesSection } from './components/ResourcesSection';
import { FAQSection } from './components/FAQSection';
import { FinalConversionSection } from './components/FinalConversionSection';
import { Footer } from './components/Footer';

// Modals
import { ApplicationModal } from './components/ApplicationModal';
import { PartnerVerificationModal } from './components/PartnerVerificationModal';
import { PartnerPortalModal } from './components/PartnerPortalModal';
import { AdminConsoleModal } from './components/AdminConsoleModal';
import { PartnerTierId } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('msmebooks_theme');
      if (saved) return saved === 'dark';
      // Default to true or check system preferences
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('msmebooks_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('msmebooks_theme', 'light');
    }
  }, [darkMode]);

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [applyInitialCategory, setApplyInitialCategory] = useState<string | undefined>(undefined);
  const [applyInitialTier, setApplyInitialTier] = useState<PartnerTierId>('gold');

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [verifyInitialCode, setVerifyInitialCode] = useState<string>('MSME-PT-8421');

  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenApply = React.useCallback((tier?: PartnerTierId, category?: string) => {
    if (tier) setApplyInitialTier(tier);
    if (category) setApplyInitialCategory(category);
    setIsApplyOpen(true);
  }, []);

  const handleOpenVerify = React.useCallback((code?: string) => {
    if (code) setVerifyInitialCode(code);
    setIsVerifyOpen(true);
  }, []);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white dark:bg-[#061F4A] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Dynamic SEO Meta & JSON-LD Structured Data */}
      <SEOHead />

      {/* Navigation */}
      <Navbar
        onOpenApply={() => handleOpenApply('gold')}
        onOpenVerify={() => handleOpenVerify('MSME-PT-8421')}
        onOpenPortal={() => setIsPortalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenApply={() => handleOpenApply('gold')}
          onOpenVerify={() => handleOpenVerify('MSME-PT-8421')}
        />

        {/* 1b. Real-Time Partner Activity Ticker */}
        <PartnerActivityTicker />

        {/* 2. Official Badges Showcase */}
        <BadgeShowcaseSection
          onSelectTierToApply={(tier) => handleOpenApply(tier)}
          onOpenVerify={handleOpenVerify}
        />

        {/* 3. Why Partner with MsmeBooks? */}
        <WhyPartnerSection
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 4. Partner Categories — Who Can Join? */}
        <PartnerCategoriesSection
          onSelectCategoryToApply={(category) => handleOpenApply('gold', category)}
        />

        {/* 4b. Audit Software Integration Ecosystem & Dual-Direction Marquee Slider */}
        <AuditSoftwareSliderSection
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 5. Compare Partner Membership Benefits */}
        <ComparisonTableSection
          onSelectTierToApply={(tier) => handleOpenApply(tier)}
        />

        {/* 6. Find a Certified Partner (Public Directory) */}
        <PartnerDirectorySection
          onVerifyPartnerCode={handleOpenVerify}
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 7. Partner Commission Calculator */}
        <CommissionCalculatorSection
          onOpenApplyWithTier={(tier) => handleOpenApply(tier)}
        />

        {/* 8. Partner Training & Certification Academy */}
        <TrainingAcademySection
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 8b. Real-Time Partner Economic Impact Visualizer (D3 Analytics) */}
        <PartnerImpactSection />

        {/* 9. Partner Success Stories */}
        <SuccessStoriesSection />

        {/* 9b. Animated Testimonials Carousel (Framer Motion) */}
        <TestimonialScroll />

        {/* 9c. Structured Partner Referral Rewards System (P2P $250 + 5% Lifetime Override) */}
        <PartnerReferralRewardsSection
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 9d. Partner Community Social Wall (#MsmeBooksPartner) */}
        <PartnerSocialWallSection />

        {/* 10. How the Partner Programme Works */}
        <HowItWorksSection
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 11. Partner Resources Centre with Refer-a-Peer */}
        <ResourcesSection
          onOpenApply={() => handleOpenApply('gold')}
        />

        {/* 12. Partner Frequently Asked Questions */}
        <FAQSection />

        {/* 13. Final Conversion Action */}
        <FinalConversionSection
          onOpenApply={() => handleOpenApply('gold')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenApply={() => handleOpenApply('gold')}
        onOpenVerify={() => handleOpenVerify('MSME-PT-8421')}
      />

      {/* Interactive Modals */}
      <ApplicationModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        initialCategory={applyInitialCategory}
        initialTier={applyInitialTier}
      />

      <PartnerVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        initialCode={verifyInitialCode}
      />

      <PartnerPortalModal
        isOpen={isPortalOpen}
        onClose={() => setIsPortalOpen(false)}
      />

      <AdminConsoleModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />

      {/* Floating Scroll Controls on Left Side of Page */}
      <LeftScrollControls />

      {/* Floating Live AI Assistant for Partner Onboarding and Questions */}
      <PartnerAIAssistant
        onOpenApply={(tier) => handleOpenApply(tier || 'gold')}
        onOpenVerify={() => handleOpenVerify('MSME-PT-8421')}
        onOpenPortal={() => setIsPortalOpen(true)}
      />

      {/* Subtle Bottom Sticky CTA Bar (triggers past Hero section) */}
      <StickyBottomCtaBar
        onOpenApply={() => handleOpenApply('gold')}
        onOpenVerify={() => handleOpenVerify('MSME-PT-8421')}
      />
    </div>
  );
}
