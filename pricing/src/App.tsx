import React, { useState, useEffect } from 'react';
import { BillingPeriod, Currency } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BillingToggle } from './components/BillingToggle';
import { PricingCards } from './components/PricingCards';
import { PlanRecommender } from './components/PlanRecommender';
import { ComparisonTable } from './components/ComparisonTable';
import { FreeTrialCta } from './components/FreeTrialCta';
import { ValueRoiSection } from './components/ValueRoiSection';
import { AiAssistantSection } from './components/AiAssistantSection';
import { AfricanBusinessFocus } from './components/AfricanBusinessFocus';
import { CustomerTrustSection } from './components/CustomerTrustSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { TrialModal } from './components/TrialModal';
import { LiveChat } from './components/LiveChat';
import { FloatingAiPricingAssistant } from './components/FloatingAiPricingAssistant';
import { BackToTop } from './components/BackToTop';
import { LeftScrollNavigation } from './components/LeftScrollNavigation';
import { ConnectionProvider } from './context/ConnectionContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { CurrencyMismatchBanner } from './components/CurrencyMismatchBanner';
import { OfflinePricingBanner } from './components/OfflinePricingBanner';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InvoiceReceiptModal } from './components/InvoiceReceiptModal';
import { SecurityTrustBar } from './components/SecurityTrustBar';
import { ImpactCounter } from './components/ImpactCounter';
import { AccessibilityToolbar } from './components/AccessibilityToolbar';
import { OnboardingTracker } from './components/OnboardingTracker';
import { MotionSection } from './components/MotionSection';
import { TotalAnnualSavingsCalculator } from './components/TotalAnnualSavingsCalculator';
import { RegionalComplianceSidebar } from './components/RegionalComplianceSidebar';
import { GrowthMilestonesModal } from './components/GrowthMilestonesModal';
import { PlanUpgradeSuggestionModal } from './components/PlanUpgradeSuggestionModal';
import { CelebrationToast, MilestoneCelebrationData } from './components/CelebrationToast';
import {
  SUPPORTED_CURRENCIES,
  detectUserCurrency,
  registerCurrencyIfMissing,
  getLiveExchangeRate,
} from './utils/currency';

export default function App() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');
  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('msmebooks-currency') as Currency | null;
      if (saved && saved in SUPPORTED_CURRENCIES) {
        return saved;
      }
    } catch {
      // Ignore
    }
    return detectUserCurrency();
  });

  const setCurrency = (newCurr: Currency) => {
    registerCurrencyIfMissing(newCurr, getLiveExchangeRate(newCurr));
    setCurrencyState(newCurr);
    try {
      localStorage.setItem('msmebooks-currency', newCurr);
    } catch {
      // Ignore
    }
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanForModal, setSelectedPlanForModal] = useState<string>('professional');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Growth & Compliance Feature Modals State
  const [isComplianceOpen, setIsComplianceOpen] = useState(false);
  const [isMilestonesOpen, setIsMilestonesOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [activeMilestoneCelebration, setActiveMilestoneCelebration] = useState<MilestoneCelebrationData | null>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem('msmebooks-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore localStorage access issues in sandboxed environments
    }
    return 'light';
  });

  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
      localStorage.setItem('msmebooks-theme', theme);
    } catch {
      // Safe fallback
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleOpenTrial = (planId: string = 'professional') => {
    setSelectedPlanForModal(planId);
    setIsDemoMode(false);
    setIsModalOpen(true);
  };

  const handleOpenDemo = () => {
    setSelectedPlanForModal('enterprise');
    setIsDemoMode(true);
    setIsModalOpen(true);
  };

  return (
    <LanguageProvider>
      <ConnectionProvider>
        <CurrencyProvider initialCurrency={currency}>
          <CartProvider>
            <div className="min-h-screen bg-white dark:bg-[#070F1B] text-slate-900 dark:text-slate-100 font-sans selection:bg-[#84CC16]/30 selection:text-[#0A4FD5] transition-colors duration-300">
            {/* Navigation Header */}
            <Navbar
              currency={currency}
              onCurrencyChange={setCurrency}
              onOpenTrialModal={handleOpenTrial}
              onOpenDemoModal={handleOpenDemo}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenCompliance={() => setIsComplianceOpen(true)}
              onOpenMilestones={() => setIsMilestonesOpen(true)}
              onOpenUpgradeAdvisor={() => setIsUpgradeModalOpen(true)}
            />

            {/* Subtle Currency Mismatch Banner (Based on detected IP location) */}
            <CurrencyMismatchBanner
              currentCurrency={currency}
              onCurrencyChange={setCurrency}
            />

            {/* Offline Service Worker Status & Pricing Cache Reassurance Banner */}
            <OfflinePricingBanner />

            {/* Accessibility Toolbar (WCAG 2.1 AA) */}
            <AccessibilityToolbar />

            <main>
              {/* 1. Pricing Hero Section with SaaS Dashboard Mockup */}
              <HeroSection
                currency={currency}
                onOpenTrialModal={() => handleOpenTrial('professional')}
                onOpenDemoModal={handleOpenDemo}
              />

              {/* Dynamic Impact Metrics Counter (15,400+ businesses, $42.8M+ processed) */}
              <MotionSection>
                <ImpactCounter />
              </MotionSection>

              {/* 2. Monthly / Yearly Billing Toggle */}
              <div className="sticky top-20 z-30 bg-white/90 dark:bg-[#070F1B]/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 shadow-xs py-2 transition-colors duration-300">
                <BillingToggle
                  billingPeriod={billingPeriod}
                  onChange={setBillingPeriod}
                  currency={currency}
                />
              </div>

              {/* 3 & 4. Pricing Plans Cards */}
              <MotionSection>
                <PricingCards
                  billingPeriod={billingPeriod}
                  currency={currency}
                  onSelectPlan={handleOpenTrial}
                  onOpenDemoModal={handleOpenDemo}
                  onOpenUpgradeAdvisor={() => setIsUpgradeModalOpen(true)}
                />
              </MotionSection>

              {/* Total Annual Savings Calculator (Fragmented SaaS vs MsmeBooks) */}
              <MotionSection>
                <TotalAnnualSavingsCalculator
                  currency={currency}
                  onSelectPlan={handleOpenTrial}
                />
              </MotionSection>

              {/* Security Compliance Trust Bar (ISO 27001, GDPR, PCI-DSS Level 1, NDPR, SOC 2 Type II) */}
              <MotionSection>
                <SecurityTrustBar />
              </MotionSection>

              {/* 5. "Which Plan Is Right For Me?" Interactive Recommendation Section */}
              <MotionSection>
                <PlanRecommender onSelectPlan={handleOpenTrial} currency={currency} />
              </MotionSection>

              {/* 6. Feature Comparison Table */}
              <MotionSection>
                <ComparisonTable onSelectPlan={handleOpenTrial} currency={currency} />
              </MotionSection>

              {/* 7. Free Trial CTA Section */}
              <MotionSection>
                <FreeTrialCta
                  onOpenTrial={() => handleOpenTrial('professional')}
                  onOpenDemo={handleOpenDemo}
                />
              </MotionSection>

              {/* 8. Value / ROI Section */}
              <MotionSection>
                <ValueRoiSection onOpenTrial={() => handleOpenTrial('professional')} />
              </MotionSection>

              {/* 9. AI Business Assistant Section */}
              <MotionSection>
                <AiAssistantSection onOpenTrial={() => handleOpenTrial('professional')} currency={currency} />
              </MotionSection>

              {/* 10. African Business Focus Section */}
              <MotionSection>
                <AfricanBusinessFocus onOpenTrial={() => handleOpenTrial('professional')} />
              </MotionSection>

              {/* 11. Customer Trust & Testimonial Section */}
              <MotionSection>
                <CustomerTrustSection onOpenTrial={handleOpenTrial} />
              </MotionSection>

              {/* 12. FAQ Accordion Section (17 questions) */}
              <MotionSection>
                <FaqSection />
              </MotionSection>

              {/* 13. Final CTA Banner */}
              <MotionSection>
                <FinalCta
                  onOpenTrial={() => handleOpenTrial('professional')}
                  onOpenDemo={handleOpenDemo}
                />
              </MotionSection>
            </main>

            {/* Footer */}
            <Footer />

            {/* Floating 24/7 Live Support Chat Dialog at bottom-right */}
            <LiveChat />

            {/* Floating AI Pricing & Plan Advisor at bottom-right */}
            <FloatingAiPricingAssistant
              currency={currency}
              billingPeriod={billingPeriod}
              onSelectPlan={handleOpenTrial}
              onOpenDemo={handleOpenDemo}
            />

            {/* Floating 'First 7 Days' Onboarding Progress Roadmap */}
            <OnboardingTracker onOpenTrial={() => handleOpenTrial('professional')} />

            {/* Floating 'Back to Top' button (appears after scrolling past pricing cards) */}
            <BackToTop />

            {/* Left-side Up and Down page navigation buttons */}
            <LeftScrollNavigation />

            {/* Interactive Free Trial / Demo Modal */}
            <TrialModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              initialPlanId={selectedPlanForModal}
              isDemoMode={isDemoMode}
              currency={currency}
            />

            {/* Shopping Cart Drawer */}
            <CartDrawer />

            {/* Comprehensive Multi-Region Checkout Modal */}
            <CheckoutModal />

            {/* Official Tax Invoice & Payment Receipt Modal */}
            <InvoiceReceiptModal />

            {/* Regional Tax Compliance Calendar Drawer */}
            <RegionalComplianceSidebar
              isOpen={isComplianceOpen}
              onClose={() => setIsComplianceOpen(false)}
              currency={currency}
              onSelectPlan={handleOpenTrial}
            />

            {/* Growth Milestones & Badges Modal */}
            <GrowthMilestonesModal
              isOpen={isMilestonesOpen}
              onClose={() => setIsMilestonesOpen(false)}
              onTriggerMilestoneDemo={(milestone) => {
                setActiveMilestoneCelebration(milestone);
              }}
            />

            {/* Plan Upgrade Suggestion Advisor Modal */}
            <PlanUpgradeSuggestionModal
              isOpen={isUpgradeModalOpen}
              onClose={() => setIsUpgradeModalOpen(false)}
              currency={currency}
              currentPlanId="starter"
              onUpgradeSuccess={() => {
                setActiveMilestoneCelebration({
                  id: 'plan_upgraded',
                  title: 'Plan Upgraded Successfully!',
                  badgeName: 'High-Growth Enterprise',
                  icon: '🚀',
                  perk: 'Unlocked all advanced modules + priority African support',
                  points: 500,
                });
              }}
            />

            {/* Celebration Toast with Confetti Animation */}
            <CelebrationToast
              milestone={activeMilestoneCelebration}
              onClose={() => setActiveMilestoneCelebration(null)}
              onViewDashboard={() => setIsMilestonesOpen(true)}
            />
          </div>
        </CartProvider>
      </CurrencyProvider>
    </ConnectionProvider>
  </LanguageProvider>
  );
}
