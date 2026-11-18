import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FilterState, Partner, SuccessStoryScale } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustStats } from './components/TrustStats';
import { GlobalMapSection } from './components/GlobalMapSection';
import { DirectorySection } from './components/DirectorySection';
import { SmartMatchSection } from './components/SmartMatchSection';
import { IndustryDirectorySection } from './components/IndustryDirectorySection';
import { CountryDirectorySection } from './components/CountryDirectorySection';
import { ClientSpotlight } from './components/ClientSpotlight';
import { ReviewsAndStoriesSection } from './components/ReviewsAndStoriesSection';
import { WhyWorkWithPartnerSection } from './components/WhyWorkWithPartnerSection';
import { BecomePartnerSection } from './components/BecomePartnerSection';
import { PartnerDashboardPreview } from './components/PartnerDashboardPreview';
import { PartnerReferralSection } from './components/PartnerReferralSection';
import { VideoAndAfricanDesignSection } from './components/VideoAndAfricanDesignSection';
import { CtaAndFaqSection } from './components/CtaAndFaqSection';
import { Footer } from './components/Footer';
import { PartnerProfileModal } from './components/PartnerProfileModal';
import { 
  BecomePartnerModal, 
  ContactPartnerModal, 
  RequestConsultationModal 
} from './components/InteractiveModals';
import { PartnerInquiryChatModal } from './components/PartnerInquiryChatModal';
import { FloatingAiChatAssistant } from './components/FloatingAiChatAssistant';
import { LiveSupportChat } from './components/LiveSupportChat';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { PartnerComparisonModal } from './components/PartnerComparisonModal';
import { PartnerComparisonDock } from './components/PartnerComparisonDock';
import { PARTNERS_DATA } from './data/partnersData';
import { ThemeProvider } from './context/ThemeContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LiveSchedulingProvider } from './context/LiveSchedulingContext';
import { OfflineStatusIndicator } from './components/OfflineStatusIndicator';
import { recordPartnerInteraction, recordCategoryFilter } from './utils/browsingHistory';
import { PartnerQRScannerModal } from './components/PartnerQRScannerModal';
import { PartnerQRBadgeModal } from './components/PartnerQRBadgeModal';
import { AuditSoftwareIntegrationSection } from './components/AuditSoftwareIntegrationSection';
import { AccessibilityDevTreeSidebar, AnnouncementLogEntry } from './components/AccessibilityDevTreeSidebar';
import { LeftScrollNavigator } from './components/LeftScrollNavigator';
import { filterAndSortPartners } from './utils/partnerFiltering';

function DirectoryApp() {
  // Global filter state for partner discovery
  const initialFilters: FilterState = {
    search: '',
    country: '',
    city: '',
    partnerType: '',
    industry: '',
    service: '',
    level: '',
    language: '',
    businessSize: '',
    remoteOnly: false,
    verifiedOnly: false,
    availability: '',
    sortBy: 'recommended',
    quickFilters: [],
    successStoryScale: '',
    skill: '',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [directoryFilteredSync, setDirectoryFilteredSync] = useState<{
    partners: Partner[];
    isFiltered: boolean;
  } | null>(null);

  const handleDirectoryFilteredChange = useCallback((partners: Partner[], isFiltered: boolean) => {
    setDirectoryFilteredSync({ partners, isFiltered });
  }, []);

  const activeFilteredPartners = useMemo(() => {
    return directoryFilteredSync?.partners ?? filterAndSortPartners(PARTNERS_DATA, filters);
  }, [directoryFilteredSync, filters]);

  const isDirectoryFiltered = useMemo(() => {
    if (directoryFilteredSync) return directoryFilteredSync.isFiltered;
    return Boolean(
      filters.search?.trim() ||
        filters.country ||
        filters.city ||
        filters.partnerType ||
        filters.industry ||
        filters.service ||
        filters.level ||
        filters.language ||
        filters.businessSize ||
        filters.remoteOnly ||
        filters.verifiedOnly ||
        filters.availability ||
        filters.successStoryScale ||
        filters.skill ||
        (filters.quickFilters && filters.quickFilters.length > 0)
    );
  }, [directoryFilteredSync, filters]);

  // Modal states
  const [selectedPartnerForProfile, setSelectedPartnerForProfile] = useState<Partner | null>(null);
  const [selectedPartnerForContact, setSelectedPartnerForContact] = useState<Partner | null>(null);
  const [selectedPartnerForConsultation, setSelectedPartnerForConsultation] = useState<Partner | null>(null);
  const [selectedPartnerForChat, setSelectedPartnerForChat] = useState<Partner | null>(null);
  const [becomePartnerModalOpen, setBecomePartnerModalOpen] = useState<boolean>(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState<boolean>(false);
  const [qrBadgePartner, setQrBadgePartner] = useState<Partner | null>(null);

  // Side-by-side comparison state (up to 3 partners)
  const [selectedComparePartners, setSelectedComparePartners] = useState<Partner[]>([]);
  const [isComparisonModalOpen, setIsComparisonModalOpen] = useState<boolean>(false);

  // Deep-link from shared URL (?partner=slug-or-id or ?p=id)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const partnerKey = params.get('partner') || params.get('p');
      if (partnerKey) {
        const target = PARTNERS_DATA.find(
          (p) => p.id.toLowerCase() === partnerKey.toLowerCase() || p.slug.toLowerCase() === partnerKey.toLowerCase()
        );
        if (target) {
          setSelectedPartnerForProfile(target);
          recordPartnerInteraction(target, 'view');
        }
      }
    }
  }, []);

  // Accessible Keyboard Navigation & Internal Dev Inspector State
  const [focusedMarkerId, setFocusedMarkerId] = useState<string | null>(null);
  const [announcementLogs, setAnnouncementLogs] = useState<AnnouncementLogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString(),
      message: 'System loaded: 20 partner pins ready for keyboard arrow navigation.',
      type: 'assertive',
    },
  ]);

  const handleLogAnnouncement = (msg: string) => {
    setAnnouncementLogs((prev) => [
      ...prev,
      {
        id: `ann-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: new Date().toLocaleTimeString(),
        message: msg,
        type: 'assertive',
      },
    ]);
  };

  const handleToggleComparePartner = (partner: Partner) => {
    recordPartnerInteraction(partner, 'compare');
    setSelectedComparePartners((prev) => {
      const exists = prev.some((p) => p.id === partner.id);
      if (exists) {
        return prev.filter((p) => p.id !== partner.id);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, partner];
    });
  };

  const handleRemoveComparePartner = (partnerId: string) => {
    setSelectedComparePartners((prev) => prev.filter((p) => p.id !== partnerId));
  };

  const handleAddComparePartner = (partner: Partner) => {
    recordPartnerInteraction(partner, 'compare');
    setSelectedComparePartners((prev) => {
      if (prev.some((p) => p.id === partner.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, partner];
    });
  };

  const handleClearComparison = () => {
    setSelectedComparePartners([]);
  };

  const handleSelectPartnerForProfile = (partner: Partner) => {
    recordPartnerInteraction(partner, 'view');
    setSelectedPartnerForProfile(partner);
  };

  const handleSelectPartnerForContact = (partner: Partner) => {
    recordPartnerInteraction(partner, 'contact');
    setSelectedPartnerForContact(partner);
  };

  const handleSelectPartnerForConsultation = (partner: Partner) => {
    recordPartnerInteraction(partner, 'consultation');
    setSelectedPartnerForConsultation(partner);
  };

  const handleSelectPartnerForChat = (partner: Partner) => {
    recordPartnerInteraction(partner, 'contact');
    setSelectedPartnerForChat(partner);
  };

  // Filter handlers
  const handleUpdateFilters = (newFilters: Partial<FilterState>) => {
    if (newFilters.partnerType) {
      recordCategoryFilter(newFilters.partnerType);
    }
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const scrollToDirectory = () => {
    const el = document.getElementById('directory');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCountry = (countryName: string) => {
    setFilters(prev => ({ ...prev, country: countryName }));
    scrollToDirectory();
  };

  const handleSelectIndustry = (industryName: string) => {
    setFilters(prev => ({ ...prev, industry: industryName }));
    scrollToDirectory();
  };

  const handleFilterBySuccessScale = (scale: SuccessStoryScale) => {
    setFilters(prev => ({ ...prev, successStoryScale: scale }));
    scrollToDirectory();
  };

  const handleSelectPartnerByName = (partnerName: string) => {
    const matched = PARTNERS_DATA.find((p) => 
      p.name.toLowerCase().includes(partnerName.toLowerCase()) || 
      partnerName.toLowerCase().includes(p.name.toLowerCase())
    );
    if (matched) {
      handleSelectPartnerForProfile(matched);
    } else {
      setFilters((prev) => ({ ...prev, search: partnerName }));
      scrollToDirectory();
    }
  };

  const { currentLanguage, setLanguage } = useLanguage();

  const scrollToSection = (sectionId: string) => {
    let el = document.getElementById(sectionId);
    if (!el && sectionId === 'partner-referrals') {
      el = document.getElementById('partner-referral');
    }
    if (!el && sectionId === 'partner-referral') {
      el = document.getElementById('partner-referrals');
    }
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHeroSearchSubmit = (searchParams: {
    query: string;
    country: string;
    city: string;
    industry: string;
  }) => {
    setFilters(prev => ({
      ...prev,
      search: searchParams.query,
      country: searchParams.country || prev.country,
      city: searchParams.city || prev.city,
      industry: searchParams.industry || prev.industry,
    }));
    scrollToDirectory();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07162b] text-slate-900 dark:text-slate-100 font-sans selection:bg-lime-400 selection:text-slate-950 flex flex-col antialiased transition-colors duration-300">
      
      {/* 1. Header / Sticky Navbar */}
      <Navbar 
        onOpenBecomePartner={() => setBecomePartnerModalOpen(true)}
        onNavigateSection={scrollToSection}
        currentLanguage={currentLanguage}
        onChangeLanguage={setLanguage}
        onOpenQRScanner={() => setIsQrScannerOpen(true)}
      />

      {/* 2. Hero Section with Search Panel & Autocomplete */}
      <HeroSection
        onSearchSubmit={handleHeroSearchSubmit}
        onOpenSmartMatch={() => scrollToSection('smart-match')}
        activeCountry={filters.country}
        activeCity={filters.city}
        onLocateNearMe={(country, city) => {
          setFilters((prev) => ({
            ...prev,
            country,
            city,
          }));
          scrollToDirectory();
        }}
      />

      {/* 3. Trust Statistics Strip */}
      <TrustStats />

      {/* 4. Global Partner Interactive Map */}
      <GlobalMapSection
        filteredPartners={activeFilteredPartners}
        isDirectoryFiltered={isDirectoryFiltered}
        onResetDirectoryFilters={handleResetFilters}
        onSelectCountry={handleSelectCountry}
        onSelectPartner={handleSelectPartnerForProfile}
        onContactPartner={handleSelectPartnerForContact}
        onOpenBecomePartner={() => setBecomePartnerModalOpen(true)}
        focusedPartnerId={focusedMarkerId}
        onFocusedPartnerChange={setFocusedMarkerId}
        onLogAnnouncement={handleLogAnnouncement}
        onSyncLocationFilters={(country, city) => {
          setFilters((prev) => ({ ...prev, country, city }));
        }}
      />

      {/* 4b. Audit Software Integration Dual Sliding Logo Showcase (25 software platforms) */}
      <AuditSoftwareIntegrationSection />

      {/* 5, 6, 7. Core Directory, Partner Levels & Cards Grid */}
      <DirectorySection
        filters={filters}
        onUpdateFilters={handleUpdateFilters}
        onApplyFilters={(preset) => {
          if (preset.partnerType) {
            recordCategoryFilter(preset.partnerType);
          }
          setFilters(preset);
          scrollToDirectory();
        }}
        onResetFilters={handleResetFilters}
        onSelectPartner={handleSelectPartnerForProfile}
        onContactPartner={handleSelectPartnerForContact}
        onRequestConsultation={handleSelectPartnerForConsultation}
        selectedComparePartners={selectedComparePartners}
        onToggleComparePartner={handleToggleComparePartner}
        onOpenComparisonModal={() => setIsComparisonModalOpen(true)}
        onOpenQrBadge={(partner) => setQrBadgePartner(partner)}
        onOpenQRScanner={() => setIsQrScannerOpen(true)}
        onAskQuestion={handleSelectPartnerForChat}
        onFilteredPartnersChange={handleDirectoryFilteredChange}
      />

      {/* 8. Smart "Best Match" Matching Engine */}
      <SmartMatchSection
        onSelectPartner={handleSelectPartnerForProfile}
        onContactPartner={handleSelectPartnerForContact}
      />

      {/* 9. Industry Directory (18 visual categories) */}
      <IndustryDirectorySection onSelectIndustry={handleSelectIndustry} />

      {/* 10. Country Directory Grid */}
      <CountryDirectorySection onSelectCountry={handleSelectCountry} />

      {/* 11 & 12. Client Spotlight: SME Success Stories & Video Testimonials */}
      <ClientSpotlight
        onOpenDirectory={scrollToDirectory}
        onSelectPartnerByName={handleSelectPartnerByName}
      />

      {/* 13 & 14. Reviews & Success Transformation Stories */}
      <ReviewsAndStoriesSection 
        onOpenDirectory={scrollToDirectory} 
        onFilterByScale={handleFilterBySuccessScale}
      />

      {/* 15. Why Work With A Partner */}
      <WhyWorkWithPartnerSection
        onOpenDirectory={scrollToDirectory}
        onOpenBecomePartner={() => setBecomePartnerModalOpen(true)}
      />

      {/* 16 & 17. Become a Partner & Benefits */}
      <BecomePartnerSection
        onOpenBecomePartnerModal={() => setBecomePartnerModalOpen(true)}
      />

      {/* 18. Partner Dashboard Preview */}
      <PartnerDashboardPreview />

      {/* 18b. Partner Referral & Rewards Dashboard */}
      <PartnerReferralSection onOpenDirectory={scrollToDirectory} />

      {/* 19 & 20. Video Section & African-First Global Design */}
      <VideoAndAfricanDesignSection />

      {/* 21 & 22. Full-Width CTA & FAQ Section */}
      <CtaAndFaqSection
        onOpenDirectory={scrollToDirectory}
        onOpenBecomePartner={() => setBecomePartnerModalOpen(true)}
      />

      {/* 23. Comprehensive Footer */}
      <Footer
        onOpenDirectory={scrollToDirectory}
        onOpenBecomePartner={() => setBecomePartnerModalOpen(true)}
      />

      {/* Modals */}
      <PartnerProfileModal
        partner={selectedPartnerForProfile}
        onClose={() => setSelectedPartnerForProfile(null)}
        onContactPartner={(p) => {
          setSelectedPartnerForProfile(null);
          setSelectedPartnerForContact(p);
        }}
        onRequestConsultation={(p) => {
          setSelectedPartnerForProfile(null);
          setSelectedPartnerForConsultation(p);
        }}
        onOpenQrBadge={(p) => setQrBadgePartner(p)}
        onAskQuestion={(p) => {
          setSelectedPartnerForProfile(null);
          handleSelectPartnerForChat(p);
        }}
      />

      <BecomePartnerModal
        isOpen={becomePartnerModalOpen}
        onClose={() => setBecomePartnerModalOpen(false)}
      />

      <ContactPartnerModal
        partner={selectedPartnerForContact}
        onClose={() => setSelectedPartnerForContact(null)}
      />

      <RequestConsultationModal
        partner={selectedPartnerForConsultation}
        onClose={() => setSelectedPartnerForConsultation(null)}
      />

      {/* Dedicated Partner Inquiry Chat Modal */}
      <PartnerInquiryChatModal
        partner={selectedPartnerForChat}
        isOpen={Boolean(selectedPartnerForChat)}
        onClose={() => setSelectedPartnerForChat(null)}
        onRequestConsultation={(p) => {
          setSelectedPartnerForChat(null);
          handleSelectPartnerForConsultation(p);
        }}
        onViewProfile={(p) => {
          setSelectedPartnerForChat(null);
          handleSelectPartnerForProfile(p);
        }}
      />

      {/* Side-by-Side Partner Comparison Modal */}
      <PartnerComparisonModal
        isOpen={isComparisonModalOpen}
        onClose={() => setIsComparisonModalOpen(false)}
        selectedPartners={selectedComparePartners}
        allPartners={PARTNERS_DATA}
        activeFilterCategory={filters.partnerType}
        onRemovePartner={handleRemoveComparePartner}
        onAddPartner={handleAddComparePartner}
        onClearAll={handleClearComparison}
        onSelectPartnerForProfile={(p) => {
          setIsComparisonModalOpen(false);
          handleSelectPartnerForProfile(p);
        }}
        onContactPartner={(p) => {
          setIsComparisonModalOpen(false);
          handleSelectPartnerForContact(p);
        }}
        onRequestConsultation={(p) => {
          setIsComparisonModalOpen(false);
          handleSelectPartnerForConsultation(p);
        }}
      />

      {/* Persistent Bottom Comparison Dock */}
      <PartnerComparisonDock
        selectedPartners={selectedComparePartners}
        onRemovePartner={handleRemoveComparePartner}
        onClearAll={handleClearComparison}
        onOpenModal={() => setIsComparisonModalOpen(true)}
      />

      {/* Partner Physical Badge & Business Card QR Scanner Modal */}
      <PartnerQRScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onSelectPartner={(partner) => {
          handleSelectPartnerForProfile(partner);
        }}
        onSearchDirectory={(term) => {
          setFilters((prev) => ({ ...prev, search: term }));
          scrollToDirectory();
        }}
      />

      {/* Partner Scannable Digital Badge / QR Business Card Modal */}
      <PartnerQRBadgeModal
        partner={qrBadgePartner}
        isOpen={Boolean(qrBadgePartner)}
        onClose={() => setQrBadgePartner(null)}
        onOpenScanner={() => {
          setQrBadgePartner(null);
          setIsQrScannerOpen(true);
        }}
      />

      {/* Floating AI Chat Assistant */}
      <FloatingAiChatAssistant
        partners={PARTNERS_DATA}
        onSelectPartner={handleSelectPartnerForProfile}
        onContactPartner={handleSelectPartnerForContact}
        onRequestConsultation={handleSelectPartnerForConsultation}
        onApplyFilters={(newFilters) => {
          handleUpdateFilters(newFilters);
          scrollToDirectory();
        }}
      />

      {/* Floating Live Chat Support Desk Icon & Help Dialog */}
      <LiveSupportChat
        onSelectPartner={handleSelectPartnerForProfile}
        onContactPartner={handleSelectPartnerForContact}
        onRequestConsultation={handleSelectPartnerForConsultation}
        onOpenBecomePartner={() => setBecomePartnerModalOpen(true)}
        onScrollToDirectory={scrollToDirectory}
      />

      {/* Floating Scroll to Top Button (Appears past Hero section) */}
      <ScrollToTopButton heroElementId="hero" targetElementId="navbar" />

      {/* Floating Left-Side Up & Down Navigation Controller */}
      <LeftScrollNavigator />

      {/* Offline Status Connectivity Banner */}
      <OfflineStatusIndicator />

      {/* Internal Development Debugging Tool: Accessible Navigation Tree & Sequence Inspector */}
      <AccessibilityDevTreeSidebar
        onFocusMarker={(partnerId) => {
          setFocusedMarkerId(partnerId);
          scrollToSection('map-section');
        }}
        onSelectPartner={handleSelectPartnerForProfile}
        announcementLogs={announcementLogs}
        onClearLogs={() => setAnnouncementLogs([])}
        currentFocusedMarkerId={focusedMarkerId}
        filteredPartners={activeFilteredPartners}
      />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <LiveSchedulingProvider>
            <DirectoryApp />
          </LiveSchedulingProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
