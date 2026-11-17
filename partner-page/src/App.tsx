import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { EcosystemSection } from './components/EcosystemSection';
import { CommissionTiers } from './components/CommissionTiers';
import { ComparisonTable } from './components/ComparisonTable';
import { HowItWorks } from './components/HowItWorks';
import { DashboardPreview } from './components/DashboardPreview';
import { WhyPartner } from './components/WhyPartner';
import { EventsCommunity } from './components/EventsCommunity';
import { VideoSection } from './components/VideoSection';
import { Testimonials } from './components/Testimonials';
import { SuccessStories } from './components/SuccessStories';
import { PartnerCta } from './components/PartnerCta';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';

// Modals
import { 
  ApplyPartnerModal, 
  VideoModal, 
  DashboardTourModal, 
  ContactModal, 
  CaseStudyModal 
} from './components/Modals';
import { LiveChatWidget } from './components/LiveChatWidget';

import { VideoItem, CaseStudy, EventItem } from './types';

export default function App() {
  // Modal states
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('partner');

  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const [isDashboardTourOpen, setIsDashboardTourOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const [activeCaseStudy, setActiveCaseStudy] = useState<CaseStudy | null>(null);
  const [isCaseStudyModalOpen, setIsCaseStudyModalOpen] = useState(false);

  const handleOpenApplyModal = (tierId?: string) => {
    if (tierId) setSelectedTier(tierId);
    setIsApplyModalOpen(true);
  };

  const handlePlayVideo = (video: VideoItem) => {
    setActiveVideo(video);
    setIsVideoModalOpen(true);
  };

  const handleOpenCaseStudy = (study: CaseStudy) => {
    setActiveCaseStudy(study);
    setIsCaseStudyModalOpen(true);
  };

  const handleRegisterEvent = (event: EventItem) => {
    // Open apply/onboarding modal with event pre-context
    handleOpenApplyModal();
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#84CC16] selection:text-[#0A192F] font-sans antialiased">
      
      {/* 1. Header & Sticky Navbar */}
      <Navbar onOpenApplyModal={() => handleOpenApplyModal()} />

      {/* 2. Hero Section */}
      <main>
        <HeroSection onOpenApplyModal={() => handleOpenApplyModal()} />

        {/* 3. The MsmeBooks Ecosystem (Who is it for?) */}
        <EcosystemSection onOpenApplyModal={handleOpenApplyModal} />

        {/* 4. Commission Tiers (Bronze, Silver, Partner, Platinum) + Revenue Calculator */}
        <CommissionTiers onOpenApplyModal={handleOpenApplyModal} />

        {/* 5. Detailed Commission & Capability Comparison Matrix */}
        <ComparisonTable onOpenApplyModal={handleOpenApplyModal} />

        {/* 6. How the Partner Program Works (4-step timeline) */}
        <HowItWorks onOpenApplyModal={() => handleOpenApplyModal()} />

        {/* 7. Realistic Multi-Tenant Partner Dashboard */}
        <DashboardPreview 
          onOpenDashboardTour={() => setIsDashboardTourOpen(true)}
          onOpenApplyModal={() => handleOpenApplyModal()}
        />

        {/* 8. Why Partner with MsmeBooks? (6 Core Strategic Pillars) */}
        <WhyPartner onOpenApplyModal={() => handleOpenApplyModal()} />

        {/* 9. Event & Pan-African Community Section */}
        <EventsCommunity onOpenEventRegister={handleRegisterEvent} />

        {/* 10. Video Showcase in Action */}
        <VideoSection onPlayVideoModal={handlePlayVideo} />

        {/* 11. Partner Testimonials (Realistic African Case Quotes) */}
        <Testimonials />

        {/* 12. Partner Success Stories (Before, Solution, Outcome) */}
        <SuccessStories onOpenCaseStudyModal={handleOpenCaseStudy} />

        {/* 13. Blue-to-Lemon-Green Gradient Partner CTA */}
        <PartnerCta 
          onOpenApplyModal={() => handleOpenApplyModal()}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />

        {/* 14. Expandable FAQ Accordion */}
        <FaqSection onOpenContactModal={() => setIsContactModalOpen(true)} />

        {/* 15. Final Conversion CTA */}
        <FinalCta 
          onOpenApplyModal={() => handleOpenApplyModal()}
          onOpenContactModal={() => setIsContactModalOpen(true)}
        />
      </main>

      {/* 16. Comprehensive Footer */}
      <Footer 
        onOpenApplyModal={() => handleOpenApplyModal()}
        onOpenContactModal={() => setIsContactModalOpen(true)}
      />

      {/* Interactive Modals */}
      <ApplyPartnerModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        initialTier={selectedTier}
      />

      <VideoModal
        video={activeVideo}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      <DashboardTourModal
        isOpen={isDashboardTourOpen}
        onClose={() => setIsDashboardTourOpen(false)}
        onApply={() => handleOpenApplyModal()}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      <CaseStudyModal
        caseStudy={activeCaseStudy}
        isOpen={isCaseStudyModalOpen}
        onClose={() => setIsCaseStudyModalOpen(false)}
        onApply={() => handleOpenApplyModal()}
      />

      {/* Floating Live Chat Widget */}
      <LiveChatWidget onOpenPartnerApplication={() => handleOpenApplyModal()} />

    </div>
  );
}
