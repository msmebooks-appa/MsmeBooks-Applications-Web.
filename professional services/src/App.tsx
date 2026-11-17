import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SmartServiceMatcher } from './components/SmartServiceMatcher';
import { ServiceMarketplace } from './components/ServiceMarketplace';
import { FirmDirectory } from './components/FirmDirectory';
import { IndustrySolutionsSection } from './components/IndustrySolutionsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { WhyChooseSection } from './components/WhyChooseSection';
import { BecomeProviderSection } from './components/BecomeProviderSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { ConversionBanner } from './components/ConversionBanner';
import { Footer } from './components/Footer';
import { LiveChatWidget } from './components/LiveChatWidget';
import { SocialProofToast } from './components/SocialProofToast';
import { LeftScrollControls } from './components/LeftScrollControls';

import { ServiceDetailModal } from './components/ServiceDetailModal';
import { BookingModal } from './components/BookingModal';
import { CustomerDashboardModal } from './components/CustomerDashboardModal';
import { ProviderPortalModal } from './components/ProviderPortalModal';
import { AdminPortalModal } from './components/AdminPortalModal';
import { PartnerRegistrationModal } from './components/PartnerRegistrationModal';
import { BusinessToolkitModal } from './components/BusinessToolkitModal';
import { ServiceCostEstimator } from './components/ServiceCostEstimator';
import { CommunityForumSection } from './components/CommunityForumSection';
import { AskExpertFAB } from './components/AskExpertFAB';
import { AskExpertModal } from './components/AskExpertModal';
import { SubscriptionPricingSection } from './components/SubscriptionPricingSection';
import { EmailInboxModal } from './components/EmailInboxModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { BiometricAuthModal } from './components/BiometricAuthModal';
import { autoDetectUserCountry } from './utils/geolocation';
import { syncAutoInvoicesForCompletedBookings } from './utils/autoInvoiceService';
import {
  UserProfileSettings,
  USER_SETTINGS_CHANGED_EVENT,
  getUserSettings,
} from './utils/biometricAuth';

import { ServiceItem, ServicePackage, SERVICES_CATALOGUE } from './data/servicesData';
import { ProfessionalFirm, PROFESSIONAL_FIRMS } from './data/firmsData';
import { BookingRecord, INITIAL_DEMO_BOOKINGS } from './types/booking';

export default function App() {
  const [activeTab, setActiveTab] = useState('hero');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    try {
      return localStorage.getItem('msmebooks_selected_country') || 'Nigeria';
    } catch {
      return 'Nigeria';
    }
  });
  const [geoDetectedToast, setGeoDetectedToast] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [searchFilter, setSearchFilter] = useState({
    query: '',
    category: 'All',
    mode: 'All Modes',
  });

  // Modal Visibility States
  const [selectedServiceForDetail, setSelectedServiceForDetail] = useState<ServiceItem | null>(null);
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingService, setBookingService] = useState<ServiceItem | null>(null);
  const [bookingPackage, setBookingPackage] = useState<ServicePackage | null>(null);
  const [bookingFirm, setBookingFirm] = useState<ProfessionalFirm | null>(null);
  const [bookingDate, setBookingDate] = useState<string | undefined>(undefined);
  const [bookingTimeSlot, setBookingTimeSlot] = useState<string | undefined>(undefined);
  const [bookingNotes, setBookingNotes] = useState<string | undefined>(undefined);

  const [isMyBookingsOpen, setIsMyBookingsOpen] = useState(false);
  const [isProviderPortalOpen, setIsProviderPortalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isRegisterFirmOpen, setIsRegisterFirmOpen] = useState(false);
  const [isToolkitOpen, setIsToolkitOpen] = useState(false);
  const [isAskExpertOpen, setIsAskExpertOpen] = useState(false);
  const [isEmailInboxOpen, setIsEmailInboxOpen] = useState(false);
  const [isUserSettingsOpen, setIsUserSettingsOpen] = useState(false);
  const [isBiometricPromptOpen, setIsBiometricPromptOpen] = useState(false);
  const [userSettings, setUserSettings] = useState<UserProfileSettings>(() => getUserSettings());
  const [viewEmailId, setViewEmailId] = useState<string | undefined>(undefined);
  const [lastUserBooking, setLastUserBooking] = useState<BookingRecord | null>(null);

  // Bookings list stored in state & localStorage
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const stored = localStorage.getItem('msmebooks_client_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasPending = parsed.some((b: BookingRecord) => 
            b.status === 'Pending Review' || 
            (b.status as string) === 'Pending' || 
            b.paymentStatus === 'Pending Payment'
          );
          if (!hasPending) {
            const demoPending = INITIAL_DEMO_BOOKINGS.find(b => b.status === 'Pending Review');
            if (demoPending && !parsed.some((b: BookingRecord) => b.id === demoPending.id)) {
              return [demoPending, ...parsed];
            }
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEMO_BOOKINGS;
  });

  const hasSyncedAutoInvoicesRef = useRef(false);

  useEffect(() => {
    try {
      localStorage.setItem('msmebooks_client_bookings', JSON.stringify(bookings));
    } catch (e) {
      console.error(e);
    }
    syncAutoInvoicesForCompletedBookings(bookings, {
      notify: hasSyncedAutoInvoicesRef.current,
    });
    hasSyncedAutoInvoicesRef.current = true;
  }, [bookings]);

  useEffect(() => {
    const handleSyncBookings = () => {
      try {
        const stored = localStorage.getItem('msmebooks_client_bookings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setBookings(parsed);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };

    window.addEventListener('msmebooks_bookings_changed', handleSyncBookings);
    window.addEventListener('storage', handleSyncBookings);
    return () => {
      window.removeEventListener('msmebooks_bookings_changed', handleSyncBookings);
      window.removeEventListener('storage', handleSyncBookings);
    };
  }, []);

  useEffect(() => {
    const syncUserSettings = () => {
      setUserSettings(getUserSettings());
    };
    window.addEventListener(USER_SETTINGS_CHANGED_EVENT, syncUserSettings);
    window.addEventListener('storage', syncUserSettings);
    return () => {
      window.removeEventListener(USER_SETTINGS_CHANGED_EVENT, syncUserSettings);
      window.removeEventListener('storage', syncUserSettings);
    };
  }, []);

  const handleOpenCustomerDashboard = () => {
    if (userSettings.biometricEnabled && userSettings.requireBiometricOnDashboardOpen) {
      setIsBiometricPromptOpen(true);
      return;
    }
    setIsMyBookingsOpen(true);
  };

  const handleBiometricQuickAccess = () => {
    if (userSettings.biometricEnabled) {
      setIsBiometricPromptOpen(true);
    } else {
      setIsUserSettingsOpen(true);
    }
  };

  // Service Worker notification click listener (opens Customer Dashboard modal)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('openBookings=true')) {
      setIsMyBookingsOpen(true);
    }

    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const handleSwMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'OPEN_CUSTOMER_BOOKINGS') {
          setIsMyBookingsOpen(true);
        }
      };

      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      };
    }
  }, []);

  // Browser Geolocation auto-detection on mount if no preference previously chosen
  useEffect(() => {
    try {
      const storedCountry = localStorage.getItem('msmebooks_selected_country');
      if (!storedCountry) {
        autoDetectUserCountry().then((detected) => {
          if (detected && detected.country) {
            setSelectedCountry(detected.country);
            localStorage.setItem('msmebooks_selected_country', detected.country);
            setGeoDetectedToast(`📍 Auto-detected location: ${detected.country}. Regional currency & compliance calendar synced.`);
            const timer = setTimeout(() => {
              setGeoDetectedToast(null);
            }, 6000);
            return () => clearTimeout(timer);
          }
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSelectCountry = (country: string) => {
    setSelectedCountry(country);
    try {
      localStorage.setItem('msmebooks_selected_country', country);
    } catch (e) {
      console.error(e);
    }
  };

  // Handler for Hero Search Submit
  const handleHeroSearch = (query: string, category: string, mode: string) => {
    setSearchFilter({ query, category, mode });
    if (category && category !== 'All') {
      setSelectedCategory(category);
    }
    setActiveTab('services-catalogue');
  };

  // Open Service Detail
  const handleOpenServiceDetail = (service: ServiceItem) => {
    setSelectedServiceForDetail(service);
  };

  // Open Booking Workflow
  const handleOpenBooking = (
    service: ServiceItem,
    selectedPkg?: ServicePackage,
    selectedFirm?: ProfessionalFirm,
    prefilledDate?: string,
    prefilledTimeSlot?: string,
    userNotes?: string
  ) => {
    setBookingService(service);
    setBookingPackage(selectedPkg || service.packages[0]);
    setBookingFirm(selectedFirm || null);
    setBookingDate(prefilledDate);
    setBookingTimeSlot(prefilledTimeSlot);
    setBookingNotes(userNotes);
    setIsBookingModalOpen(true);
    setSelectedServiceForDetail(null);
  };

  // Open Booking with Firm from Directory
  const handleBookWithFirm = (
    service: ServiceItem,
    firm: ProfessionalFirm,
    prefilledDate?: string,
    prefilledTimeSlot?: string
  ) => {
    setBookingService(service);
    setBookingPackage(service.packages[0]);
    setBookingFirm(firm);
    setBookingDate(prefilledDate);
    setBookingTimeSlot(prefilledTimeSlot);
    setIsBookingModalOpen(true);
  };

  // Save Confirmed Booking
  const handleBookingConfirmed = (newBooking: BookingRecord) => {
    setBookings(prev => [newBooking, ...prev]);
    setLastUserBooking(newBooking);
  };

  // Reschedule Booking Date (without canceling)
  const handleRescheduleBooking = (bookingId: string, newDate: string, newTimeSlot?: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          appointmentDate: newDate,
          ...(newTimeSlot ? { timeSlot: newTimeSlot } : {}),
        };
      }
      return b;
    }));
  };

  // Cancel Booking
  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => prev.filter(b => b.id !== bookingId));
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] flex flex-col antialiased transition-[background-color,color] duration-[var(--theme-transition-duration)] ease-[cubic-bezier(0.4,0,0.2,1)]">
      {/* Global Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCountry={selectedCountry}
        setSelectedCountry={handleSelectCountry}
        bookingCount={bookings.filter(b => b.status !== 'Completed').length}
        onOpenMyBookings={handleOpenCustomerDashboard}
        onOpenProviderPortal={() => setIsProviderPortalOpen(true)}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
        onOpenRegisterFirm={() => setIsRegisterFirmOpen(true)}
        onOpenToolkit={() => setIsToolkitOpen(true)}
        onOpenEmailInbox={() => {
          setViewEmailId(undefined);
          setIsEmailInboxOpen(true);
        }}
        userSettings={userSettings}
        onOpenUserSettings={() => setIsUserSettingsOpen(true)}
        onBiometricQuickAccess={handleBiometricQuickAccess}
      />

      <main className="flex-1">
        {/* Section 3: Hero Section */}
        <HeroSection
          onSearch={handleHeroSearch}
          onExploreClick={() => scrollToSection('services-catalogue')}
          onFindFirmClick={() => scrollToSection('firms-directory')}
          onQuickBookClick={() => handleOpenBooking(SERVICES_CATALOGUE[0])}
        />

        {/* Section 23: Smart AI Service Recommendation Assistant */}
        <SmartServiceMatcher
          onSelectService={handleOpenServiceDetail}
          onBookWithFirm={handleBookWithFirm}
        />

        {/* Section 4 & 5: Services Catalogue & Marketplace */}
        <ServiceMarketplace
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedCountry={selectedCountry}
          onSelectService={handleOpenServiceDetail}
          onBookService={handleOpenBooking}
          searchFilter={searchFilter}
        />

        {/* Section 7: Professional Firms & Consultant Directory */}
        <FirmDirectory
          onBookWithFirm={handleBookWithFirm}
          selectedCountry={selectedCountry}
        />

        {/* Section: Professional Business & Partner Showcase Subscriptions */}
        <SubscriptionPricingSection
          selectedCountry={selectedCountry}
          onOpenMyBookings={handleOpenCustomerDashboard}
        />

        {/* Section 4 Category I: Industry-Specific Solutions */}
        <IndustrySolutionsSection
          onSelectService={handleOpenServiceDetail}
          onBookService={handleOpenBooking}
        />

        {/* Section 11: How It Works (4-Step Workflow) */}
        <HowItWorksSection
          onExploreClick={() => scrollToSection('services-catalogue')}
        />

        {/* Section 12: Why Choose MsmeBooks? */}
        <WhyChooseSection />

        {/* Interactive Service Cost Estimator */}
        <div id="service-cost-estimator">
          <ServiceCostEstimator onBookEstimatedService={(srv) => handleOpenBooking(srv)} />
        </div>

        {/* Professional Community Forum & Technical Q&A */}
        <div id="community-forum">
          <CommunityForumSection onAskQuestionClick={() => setIsAskExpertOpen(true)} />
        </div>

        {/* Section 13: Become a Service Provider & Partner Tiers */}
        <BecomeProviderSection
          onRegisterClick={() => setIsRegisterFirmOpen(true)}
        />

        {/* Section 15: Authentic SME Testimonials & Success Stories */}
        <TestimonialsSection />

        {/* Section 16: Comprehensive FAQs (25 Questions) */}
        <FAQSection />

        {/* Section 17: Final Conversion Section */}
        <ConversionBanner
          onExploreClick={() => scrollToSection('services-catalogue')}
          onFindFirmClick={() => scrollToSection('firms-directory')}
        />
      </main>

      {/* Global Footer */}
      <Footer
        onNavClick={scrollToSection}
        onOpenRegisterFirm={() => setIsRegisterFirmOpen(true)}
        onOpenProviderPortal={() => setIsProviderPortalOpen(true)}
        selectedCountry={selectedCountry}
      />

      {/* Floating Live Chat & Support Agent Help Dialog */}
      <LiveChatWidget onNavigateToServices={() => scrollToSection('services-catalogue')} />

      {/* Persistent 'Ask an Expert' Floating Action Button (FAB) with Audio Voice Recording */}
      <AskExpertFAB onClick={() => setIsAskExpertOpen(true)} />

      {/* Floating Left Side Scroll Up & Down Controls */}
      <LeftScrollControls />

      {/* Real-Time Social Proof Booking Toast Alert */}
      <SocialProofToast lastUserBooking={lastUserBooking} />

      {/* MODALS */}

      {/* 1. Service Detail Modal */}
      <ServiceDetailModal
        service={selectedServiceForDetail}
        onClose={() => setSelectedServiceForDetail(null)}
        onBookService={handleOpenBooking}
        onSelectFirm={(firm) => {
          if (selectedServiceForDetail) {
            handleBookWithFirm(selectedServiceForDetail, firm);
          }
        }}
      />

      {/* 2. Interactive 5-Step Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialService={bookingService}
        initialPackage={bookingPackage}
        initialFirm={bookingFirm}
        initialDate={bookingDate}
        initialTimeSlot={bookingTimeSlot}
        initialRequirements={bookingNotes}
        onBookingConfirmed={handleBookingConfirmed}
        onViewConfirmationEmail={(emailId) => {
          setViewEmailId(emailId);
          setIsEmailInboxOpen(true);
        }}
      />

      {/* 3. Customer Dashboard Modal ("My Bookings") */}
      <CustomerDashboardModal
        isOpen={isMyBookingsOpen}
        onClose={() => setIsMyBookingsOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onRescheduleBooking={handleRescheduleBooking}
        userCountry={selectedCountry}
        onNewBookingClick={() => {
          setIsMyBookingsOpen(false);
          handleOpenBooking(SERVICES_CATALOGUE[0]);
        }}
      />

      {/* 4. Provider Management Portal Modal */}
      <ProviderPortalModal
        isOpen={isProviderPortalOpen}
        onClose={() => setIsProviderPortalOpen(false)}
      />

      {/* 5. MsmeBooks Platform Admin Portal Modal */}
      <AdminPortalModal
        isOpen={isAdminPortalOpen}
        onClose={() => setIsAdminPortalOpen(false)}
      />

      {/* 6. Partner Firm Registration Modal */}
      <PartnerRegistrationModal
        isOpen={isRegisterFirmOpen}
        onClose={() => setIsRegisterFirmOpen(false)}
      />

      {/* 7. Ask an Expert Technical Inquiry Modal */}
      <AskExpertModal
        isOpen={isAskExpertOpen}
        onClose={() => setIsAskExpertOpen(false)}
      />

      {/* 8. Downloadable SME Business Toolkit Modal */}
      <BusinessToolkitModal
        isOpen={isToolkitOpen}
        onClose={() => setIsToolkitOpen(false)}
      />

      {/* 9. Booking Confirmation Email Notification & Transaction Vault Modal */}
      <EmailInboxModal
        isOpen={isEmailInboxOpen}
        onClose={() => setIsEmailInboxOpen(false)}
        initialSelectedEmailId={viewEmailId}
      />

      {/* 10. User Settings & Biometric Security Modal */}
      <UserSettingsModal
        isOpen={isUserSettingsOpen}
        onClose={() => setIsUserSettingsOpen(false)}
        settings={userSettings}
        onSettingsChange={setUserSettings}
        onOpenCustomerDashboardWithBiometrics={() => setIsBiometricPromptOpen(true)}
      />

      {/* 11. Biometric FaceID / Fingerprint Verification Modal */}
      <BiometricAuthModal
        isOpen={isBiometricPromptOpen}
        onClose={() => setIsBiometricPromptOpen(false)}
        settings={userSettings}
        mode="unlock-dashboard"
        onVerified={(updated) => {
          setUserSettings(updated);
          setIsBiometricPromptOpen(false);
          setIsMyBookingsOpen(true);
        }}
        onFallbackStandard={() => {
          setIsBiometricPromptOpen(false);
          setIsMyBookingsOpen(true);
        }}
      />

      {/* Geolocation Auto-Detection Toast Banner */}
      {geoDetectedToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-[#102B4E] dark:bg-[#060F1A] text-white p-3.5 rounded-2xl shadow-2xl border border-[#B7E532]/40 flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2.5">
            <span className="text-lg">🌍</span>
            <p className="text-xs font-semibold leading-relaxed">
              {geoDetectedToast}
            </p>
          </div>
          <button
            onClick={() => setGeoDetectedToast(null)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer shrink-0"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
