import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustBanner } from './components/TrustBanner';
import { ServiceCatalog } from './components/ServiceCatalog';
import { IndustryOutsourcing } from './components/IndustryOutsourcing';
import { SubscriptionPlans } from './components/SubscriptionPlans';
import { PricingCalculator } from './components/PricingCalculator';
import { PaymentGatewaysSection } from './components/PaymentGatewaysSection';
import { ProfessionalMarketplace } from './components/ProfessionalMarketplace';
import { HowItWorks } from './components/HowItWorks';
import { FaqSection } from './components/FaqSection';
import { ClientTestimonials } from './components/ClientTestimonials';
import { Footer } from './components/Footer';
import { ScrollNavigationButton } from './components/ScrollNavigationButton';
import { LiveSupportChat } from './components/LiveSupportChat';

// Modals
import { ClientPortalModal } from './components/ClientPortalModal';
import { PartnerPortalModal } from './components/PartnerPortalModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { ConsultationModal } from './components/ConsultationModal';
import { CheckoutModal } from './components/CheckoutModal';

import { 
  CountryInfo, 
  CurrencyCode, 
  BillingCycle, 
  PricingPlan, 
  ProfessionalProfile, 
  IndustryItem 
} from './types';
import { COUNTRIES, PRICING_PLANS, PAYMENT_GATEWAYS } from './data/mockData';
import { formatPrice } from './utils/currency';
import { useUserLocation } from './hooks/useUserLocation';
import { useNetworkStatus } from './hooks/useNetworkStatus';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';

function MainApp() {
  const { language, setLanguage } = useLanguage();
  const { toast } = useToast();
  const networkStatus = useNetworkStatus();

  // Global country & currency state
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]); // Nigeria by default
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('NGN');

  // Automatic IP-based location detection hook
  const { isDetecting, isAutoDetected, detectedCity, detectedCountryName } = useUserLocation(
    setSelectedCountry,
    setSelectedCurrency
  );

  // Auto-sync language for Francophone Africa if user hasn't explicitly set a preference
  useEffect(() => {
    if (selectedCountry.code === 'CI') {
      const explicitPref = localStorage.getItem('msmebooks_preferred_language');
      if (!explicitPref) {
        setLanguage('fr');
      }
    }
  }, [selectedCountry.code, setLanguage]);

  // Manual country selection handler that saves preference to localStorage
  const handleSelectCountry = (country: CountryInfo) => {
    localStorage.setItem('msmebooks_manual_country_code', country.code);
    setSelectedCountry(country);
    setSelectedCurrency(country.currency);
    toast.locale('country', `${country.flag} ${country.name}`, `${country.currency} settlement (${country.currencySymbol})`);

    // If selecting Côte d'Ivoire (Francophone Africa) and no language was manually chosen yet, set to French
    if (country.code === 'CI') {
      const explicitPref = localStorage.getItem('msmebooks_preferred_language');
      if (!explicitPref) {
        setLanguage('fr');
      }
    }
  };

  // Modals state
  const [isClientPortalOpen, setIsClientPortalOpen] = useState(false);
  const [isPartnerPortalOpen, setIsPartnerPortalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Checkout configuration state
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(PRICING_PLANS[1]); // Default to Growth
  const [customPlanConfig, setCustomPlanConfig] = useState<any | null>(null);
  const [checkoutBillingCycle, setCheckoutBillingCycle] = useState<BillingCycle>('monthly');
  const [checkoutGateway, setCheckoutGateway] = useState<string | undefined>(undefined);
  const [preselectedPro, setPreselectedPro] = useState<ProfessionalProfile | null>(null);

  // Smooth scroll handler
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handlers for CTAs
  const handleSelectPlan = (plan: PricingPlan, cycle: BillingCycle) => {
    setCheckoutPlan(plan);
    setCustomPlanConfig(null);
    setCheckoutBillingCycle(cycle);
    setCheckoutGateway(undefined);
    setIsCheckoutOpen(true);
    toast.plan(plan.name, `${cycle.toUpperCase()} billing • ${formatPrice(plan.basePriceUSD[cycle], selectedCurrency)}/mo`);
  };

  const handleProceedToCheckoutWithCustomPlan = (config: any) => {
    setCustomPlanConfig(config);
    setCheckoutPlan(null);
    setCheckoutBillingCycle(config.billingCycle);
    setCheckoutGateway(undefined);
    setIsCheckoutOpen(true);
    toast.plan(config.title || 'Custom Outsourcing Plan', `${config.billingCycle?.toUpperCase() || 'ANNUAL'} billing • ${formatPrice(config.monthlyUSD, selectedCurrency)}/mo`);
  };

  const handleSelectServiceForPlan = (serviceId: string) => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCustomizePlanForIndustry = (industry: IndustryItem) => {
    const el = document.getElementById('calculator');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const [consultationPricingModel, setConsultationPricingModel] = useState<'hourly' | 'fixed' | 'free'>('hourly');

  const handleBookConsultationWithPro = (pro: ProfessionalProfile, model?: 'hourly' | 'fixed') => {
    setPreselectedPro(pro);
    if (model) {
      setConsultationPricingModel(model);
    }
    setIsConsultationOpen(true);
  };

  const handleProceedToCheckoutFromConsultation = (bookingConfig: any) => {
    setIsConsultationOpen(false);
    setCustomPlanConfig({
      title: bookingConfig.title,
      monthlyUSD: bookingConfig.baseRateUSD,
      totalPayableUSD: bookingConfig.totalPayableUSD,
      billingCycle: 'monthly',
      selectedServices: [
        `${bookingConfig.pricingModel === 'hourly' ? 'Hourly Engagement' : 'Fixed Scope Retainer'}: ${bookingConfig.serviceCategory}`,
        `Specialist: ${bookingConfig.proName} (${bookingConfig.proTitle})`,
        `Scheduled: ${bookingConfig.selectedDate} • ${bookingConfig.selectedTimeSlot}`,
      ],
      rateModelLabel: bookingConfig.pricingModel === 'hourly' ? `${bookingConfig.hours} Hours Advisory` : 'Fixed Scope Retainer',
    });
    setCheckoutPlan(null);
    setCheckoutBillingCycle('monthly');
    setCheckoutGateway(undefined);
    setIsCheckoutOpen(true);
    toast.plan(bookingConfig.title, `Proceeding to checkout with ${selectedCurrency}`);
  };

  const handleAssignProToPlan = (pro: ProfessionalProfile) => {
    setPreselectedPro(pro);
    setCheckoutPlan(PRICING_PLANS[1]);
    setCustomPlanConfig(null);
    setCheckoutGateway(undefined);
    setIsCheckoutOpen(true);
    toast.plan(`Growth Plan with ${pro.name}`, `Assigned ${pro.title}`);
  };

  const handleOpenCheckoutDemo = (gatewayName: string) => {
    const foundGw = PAYMENT_GATEWAYS.find(
      g => g.name.toLowerCase().includes(gatewayName.toLowerCase()) || 
           g.id.toLowerCase() === gatewayName.toLowerCase()
    );
    setCheckoutGateway(foundGw ? foundGw.id : undefined);
    setCheckoutPlan(PRICING_PLANS[1]);
    setCustomPlanConfig(null);
    setIsCheckoutOpen(true);
    toast.plan(foundGw ? `Simulate ${foundGw.name}` : `Simulate ${gatewayName}`, `Direct Gateway Checkout Selected`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Sticky Navigation with connection status indicator and theme toggle */}
      <Navbar
        selectedCountry={selectedCountry}
        onSelectCountry={handleSelectCountry}
        selectedCurrency={selectedCurrency}
        onSelectCurrency={setSelectedCurrency}
        isAutoDetected={isAutoDetected}
        detectedCity={detectedCity}
        networkStatus={networkStatus}
        onOpenPortal={() => setIsClientPortalOpen(true)}
        onOpenConsultation={() => {
          setPreselectedPro(null);
          setIsConsultationOpen(true);
        }}
        onOpenPartnerPortal={() => setIsPartnerPortalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCalculator={() => handleNavigateSection('calculator')}
        onNavigateSection={handleNavigateSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 1. Hero Section */}
        <Hero
          selectedCountry={selectedCountry}
          selectedCurrency={selectedCurrency}
          onExploreServices={() => handleNavigateSection('services')}
          onViewPlans={() => handleNavigateSection('pricing')}
          onBookConsultation={() => {
            setPreselectedPro(null);
            setIsConsultationOpen(true);
          }}
          onBecomePartner={() => setIsPartnerPortalOpen(true)}
          onOpenPortal={() => setIsClientPortalOpen(true)}
        />

        {/* 2. Institutional Trust & Compliance Banner */}
        <TrustBanner />

        {/* 3. Filterable Outsourcing Service Catalogue */}
        <ServiceCatalog
          selectedCurrency={selectedCurrency}
          onSelectServiceForPlan={handleSelectServiceForPlan}
          onRequestCustomQuote={() => {
            setPreselectedPro(null);
            setIsConsultationOpen(true);
          }}
        />

        {/* 4. Industry-Specific Outsourcing Blueprints */}
        <IndustryOutsourcing
          onCustomizePlanForIndustry={handleCustomizePlanForIndustry}
        />

        {/* 5. How It Works (6-Step Illustrated Journey) */}
        <HowItWorks
          onStartStep1={() => handleNavigateSection('services')}
        />

        {/* 6. Subscription Plans & Pricing Architecture */}
        <SubscriptionPlans
          selectedCurrency={selectedCurrency}
          onSelectPlan={handleSelectPlan}
          onRequestEnterpriseQuote={() => {
            setPreselectedPro(null);
            setIsConsultationOpen(true);
          }}
        />

        {/* 7. Real-Time Interactive Subscription Calculator */}
        <PricingCalculator
          selectedCountry={selectedCountry}
          selectedCurrency={selectedCurrency}
          onProceedToCheckoutWithCustomPlan={handleProceedToCheckoutWithCustomPlan}
          onSelectCurrency={setSelectedCurrency}
        />

        {/* 8. Regional & Global Payment Gateway Orchestration */}
        <PaymentGatewaysSection
          selectedCountry={selectedCountry}
          selectedCurrency={selectedCurrency}
          onOpenCheckoutDemo={handleOpenCheckoutDemo}
        />

        {/* 9. Verified Outsourcing Professionals Marketplace */}
        <ProfessionalMarketplace
          selectedCurrency={selectedCurrency}
          onBookConsultationWithPro={handleBookConsultationWithPro}
          onAssignProToPlan={handleAssignProToPlan}
        />

        {/* 10. Frequently Asked Questions (20+ questions) */}
        <FaqSection />

        {/* 11. Verified Client Testimonials & Social Proof */}
        <ClientTestimonials />

      </main>

      {/* Footer */}
      <Footer
        onOpenPortal={() => setIsClientPortalOpen(true)}
        onOpenPartnerPortal={() => setIsPartnerPortalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenConsultation={() => {
          setPreselectedPro(null);
          setIsConsultationOpen(true);
        }}
        onNavigateSection={handleNavigateSection}
      />

      {/* Floating Left-Side Up & Down Page Scroll Navigation Button */}
      <ScrollNavigationButton />

      {/* Floating Live Support Chat (Right Side of Page) */}
      <LiveSupportChat
        selectedCountry={selectedCountry}
        selectedCurrency={selectedCurrency}
        effectiveOnline={networkStatus.effectiveOnline}
        onOpenConsultation={() => {
          setPreselectedPro(null);
          setIsConsultationOpen(true);
        }}
        onOpenCalculator={() => handleNavigateSection('calculator')}
        onOpenPortal={() => setIsClientPortalOpen(true)}
      />

      {/* --- INTERACTIVE MODALS & PORTALS --- */}

      {/* 1. Client Outsourcing Portal Modal */}
      <ClientPortalModal
        isOpen={isClientPortalOpen}
        onClose={() => setIsClientPortalOpen(false)}
        selectedCurrency={selectedCurrency}
        selectedCountry={selectedCountry}
      />

      {/* 2. Partner & Outsourcing Provider Portal Modal */}
      <PartnerPortalModal
        isOpen={isPartnerPortalOpen}
        onClose={() => setIsPartnerPortalOpen(false)}
        selectedCurrency={selectedCurrency}
      />

      {/* 3. Central Admin & Operations Hub Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        selectedCurrency={selectedCurrency}
      />

      {/* 4. Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        selectedCurrency={selectedCurrency}
        selectedCountry={selectedCountry}
        preselectedPro={preselectedPro}
        initialPricingModel={consultationPricingModel}
        onProceedToCheckout={handleProceedToCheckoutFromConsultation}
      />

      {/* 5. Multi-Gateway Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={checkoutPlan}
        customPlanConfig={customPlanConfig}
        initialBillingCycle={checkoutBillingCycle}
        selectedCountry={selectedCountry}
        selectedCurrency={selectedCurrency}
        initialGateway={checkoutGateway}
        onPaymentSuccessAndEnterPortal={() => {
          setIsClientPortalOpen(true);
        }}
      />

    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <MainApp />
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
