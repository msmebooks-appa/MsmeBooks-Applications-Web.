import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { ImpactCountersSection } from './components/sections/ImpactCountersSection';
import { StorySection } from './components/sections/StorySection';
import { MissionVisionSection } from './components/sections/MissionVisionSection';
import { ProblemSolvingSection } from './components/sections/ProblemSolvingSection';
import { WhatWeDoSection } from './components/sections/WhatWeDoSection';
import { PanAfricanSection } from './components/sections/PanAfricanSection';
import { WhoWeServeSection } from './components/sections/WhoWeServeSection';
import { CoreValuesSection } from './components/sections/CoreValuesSection';
import { PeopleCultureSection } from './components/sections/PeopleCultureSection';
import { PartnerEcosystemSection } from './components/sections/PartnerEcosystemSection';
import { CommitmentSection } from './components/sections/CommitmentSection';
import { TrustSecuritySection } from './components/sections/TrustSecuritySection';
import { SuccessStoriesSection } from './components/sections/SuccessStoriesSection';
import { FaqSection } from './components/sections/FaqSection';
import { FinalCtaSection } from './components/sections/FinalCtaSection';
import { Footer } from './components/Footer';

// Modals
import { DemoModal } from './components/modals/DemoModal';
import { GetStartedModal } from './components/modals/GetStartedModal';
import { PartnerModal } from './components/modals/PartnerModal';
import { SolutionDetailModal, SolutionItem } from './components/modals/SolutionDetailModal';
import { StoryDetailModal, StoryItem } from './components/modals/StoryDetailModal';
import { PromptBlueprintModal } from './components/modals/PromptBlueprintModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { LeftScrollNav } from './components/LeftScrollNav';
import { ScrollToTopButton } from './components/ScrollToTopButton';

export default function App() {
  // Modal states
  const [demoOpen, setDemoOpen] = useState(false);
  const [getStartedOpen, setGetStartedOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [partnerCategory, setPartnerCategory] = useState<string>('Accountants & Bookkeepers');
  const [selectedSolution, setSelectedSolution] = useState<SolutionItem | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);

  const handleOpenPartnerModal = (category?: string) => {
    if (category) setPartnerCategory(category);
    setPartnerOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200 selection:bg-lime-400 selection:text-slate-900">
      
      {/* 1. Sticky Navigation */}
      <Navbar
        onOpenDemo={() => setDemoOpen(true)}
        onOpenGetStarted={() => setGetStartedOpen(true)}
        onOpenPrompt={() => setPromptOpen(true)}
      />

      <main className="flex-1">
        {/* Section 1: Hero */}
        <HeroSection
          onOpenDemo={() => setDemoOpen(true)}
          onOpenGetStarted={() => setGetStartedOpen(true)}
        />

        {/* Dynamic Impact Counters */}
        <ImpactCountersSection />

        {/* Section 2: Our Story */}
        <StorySection onOpenDemo={() => setDemoOpen(true)} />

        {/* Section 3: Mission, Vision & Purpose */}
        <MissionVisionSection />

        {/* Section 4: The Problem We Are Solving */}
        <ProblemSolvingSection onOpenDemo={() => setDemoOpen(true)} />

        {/* Section 5: What We Do */}
        <WhatWeDoSection onSelectSolution={(sol) => setSelectedSolution(sol)} />

        {/* Section 6: Built in Africa. Ready for the World. */}
        <PanAfricanSection />

        {/* Section 7: Who We Serve */}
        <WhoWeServeSection onOpenDemo={() => setDemoOpen(true)} />

        {/* Section 8: Our Core Values */}
        <CoreValuesSection />

        {/* Section 9: The People and Thinking Behind MsmeBooks */}
        <PeopleCultureSection />

        {/* Section 10: Our Partner Ecosystem */}
        <PartnerEcosystemSection
          onOpenPartnerModal={(cat) => handleOpenPartnerModal(cat)}
        />

        {/* Section 11: Our Commitment to Business Growth */}
        <CommitmentSection />

        {/* Section 12: Trust, Security & Reliability */}
        <TrustSecuritySection />

        {/* Section 13: Customer Success Stories */}
        <SuccessStoriesSection
          onSelectStory={(story) => setSelectedStory(story)}
          onOpenDemo={() => setDemoOpen(true)}
        />

        {/* Section 14: Frequently Asked Questions */}
        <FaqSection
          onOpenDemo={() => setDemoOpen(true)}
          onOpenGetStarted={() => setGetStartedOpen(true)}
        />

        {/* Section 15: Final Conversion CTA */}
        <FinalCtaSection
          onOpenDemo={() => setDemoOpen(true)}
          onOpenGetStarted={() => setGetStartedOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPartnerModal={() => handleOpenPartnerModal()}
        onOpenDemo={() => setDemoOpen(true)}
        onOpenPrompt={() => setPromptOpen(true)}
      />

      {/* Interactive Functional Modals */}
      <DemoModal
        isOpen={demoOpen}
        onClose={() => setDemoOpen(false)}
      />

      <GetStartedModal
        isOpen={getStartedOpen}
        onClose={() => setGetStartedOpen(false)}
      />

      <PartnerModal
        isOpen={partnerOpen}
        defaultCategory={partnerCategory}
        onClose={() => setPartnerOpen(false)}
      />

      <PromptBlueprintModal
        isOpen={promptOpen}
        onClose={() => setPromptOpen(false)}
      />

      {/* Floating Live Chat Support Widget */}
      <LiveChatWidget />

      {/* Floating Left Side Up & Down Navigation Widget */}
      <LeftScrollNav />

      {/* Floating Scroll-to-Top Button */}
      <ScrollToTopButton />

      <SolutionDetailModal
        solution={selectedSolution}
        isOpen={!!selectedSolution}
        onClose={() => setSelectedSolution(null)}
        onOpenDemo={() => {
          setSelectedSolution(null);
          setDemoOpen(true);
        }}
      />

      <StoryDetailModal
        story={selectedStory}
        isOpen={!!selectedStory}
        onClose={() => setSelectedStory(null)}
        onOpenDemo={() => {
          setSelectedStory(null);
          setDemoOpen(true);
        }}
      />

    </div>
  );
}
