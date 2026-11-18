import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PartnerCategoriesDirectory } from './components/PartnerCategoriesDirectory';
import { CommissionTiersSection } from './components/CommissionTiersSection';
import { CommissionCalculator } from './components/CommissionCalculator';
import { PartnerAgreementViewer } from './components/PartnerAgreementViewer';
import { AgreementSchedulesModal } from './components/AgreementSchedulesModal';
import { PartnerOnboardingModal } from './components/PartnerOnboardingModal';
import { PartnerDashboardModal } from './components/PartnerDashboardModal';
import { PartnerAdminModal } from './components/PartnerAdminModal';
import { SignedCertificateModal } from './components/SignedCertificateModal';
import { ContactPartnershipModal } from './components/ContactPartnershipModal';
import { PartnerResourcesSection } from './components/PartnerResourcesSection';
import { PartnerFAQSection } from './components/PartnerFAQSection';
import { FinalCTASection } from './components/FinalCTASection';
import { Footer } from './components/Footer';
import { LiveChatWidget } from './components/LiveChatWidget';
import { ScrollNavigationWidget } from './components/ScrollNavigationWidget';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

import { INITIAL_CATEGORY_GROUPS } from './data/categoriesData';
import {
  INITIAL_SIGNED_PARTNER,
  INITIAL_REFERRALS,
  INITIAL_PAYOUTS,
  INITIAL_RESOURCES,
  INITIAL_PENDING_APPLICATIONS,
  INITIAL_AUDIT_LOG
} from './data/mockPartnerData';
import { SignedAgreementRecord, PartnerLevelType, PartnerCategoryGroup } from './types/partner';

export default function App() {
  // Navigation & Modal States
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [activeScheduleLetter, setActiveScheduleLetter] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null>(null);

  // Prefilled category when clicking "Join this category"
  const [prefilledCategory, setPrefilledCategory] = useState<string>('');
  const [prefilledGroupTitle, setPrefilledGroupTitle] = useState<string>('');

  // Core Data State (Dynamic updates support admin operations)
  const [categoryGroups, setCategoryGroups] = useState<PartnerCategoryGroup[]>(INITIAL_CATEGORY_GROUPS);
  const [signedPartner, setSignedPartner] = useState<SignedAgreementRecord>(INITIAL_SIGNED_PARTNER);
  const [pendingApplications, setPendingApplications] = useState<SignedAgreementRecord[]>(INITIAL_PENDING_APPLICATIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOG);
  const [referrals, setReferrals] = useState(INITIAL_REFERRALS);
  const [payouts, setPayouts] = useState(INITIAL_PAYOUTS);

  // Application Handlers
  const handleOpenApply = (catName?: string, grpTitle?: string) => {
    if (catName) {
      setPrefilledCategory(catName);
      setPrefilledGroupTitle(grpTitle || '');
    } else {
      setPrefilledCategory('Professional Accountants');
      setPrefilledGroupTitle('Accounting & Financial Professionals');
    }
    setIsApplyModalOpen(true);
  };

  const handleApplicationCompleted = (newRecord: SignedAgreementRecord) => {
    // Add to pending applications and set as current active partner
    setPendingApplications(prev => [newRecord, ...prev]);
    setSignedPartner(newRecord);
    setAuditLogs(prev => [
      {
        timestamp: new Date().toUTCString(),
        action: 'Agreement Signed & Submitted',
        actor: `${newRecord.partnerName} (${newRecord.businessName})`,
        target: newRecord.applicationId,
        details: `Classification: ${newRecord.primaryCategory} · Initial Tier: Bronze (15%)`
      },
      ...prev
    ]);
  };

  // Admin Handlers
  const handleApproveApplication = (appId: string, assignedTier: PartnerLevelType) => {
    setPendingApplications(prev =>
      prev.map(a =>
        a.applicationId === appId
          ? { ...a, status: 'Verified Active', assignedTier }
          : a
      )
    );
    setAuditLogs(prev => [
      {
        timestamp: new Date().toUTCString(),
        action: 'Application Approved & Verified',
        actor: 'Admin Review Desk',
        target: appId,
        details: `Assigned Tier: ${assignedTier}`
      },
      ...prev
    ]);
  };

  const handleRejectApplication = (appId: string) => {
    setPendingApplications(prev =>
      prev.map(a => (a.applicationId === appId ? { ...a, status: 'Declined' } : a))
    );
    setAuditLogs(prev => [
      {
        timestamp: new Date().toUTCString(),
        action: 'Application Declined',
        actor: 'Admin Compliance Desk',
        target: appId,
        details: 'Insufficient documentation or territory restriction'
      },
      ...prev
    ]);
  };

  // Smooth scroll helpers
  const scrollToTiers = () => {
    const el = document.getElementById('commission-tiers');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAgreement = () => {
    const el = document.getElementById('agreement');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCalculator = () => {
    const el = document.getElementById('calculator');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <ThemeProvider>
      <CurrencyProvider>
        <LanguageProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-lime-300 dark:selection:bg-lime-400 selection:text-slate-900 transition-colors duration-200">
      
      {/* Top Navigation Bar with 3-Zone Contract */}
      <Navbar
        onOpenApply={() => handleOpenApply()}
        onOpenPortal={() => setIsPortalModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        activeView="landing"
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Section 1: Hero Section */}
        <HeroSection
          onOpenApply={() => handleOpenApply()}
          onScrollToTiers={scrollToTiers}
          onScrollToAgreement={scrollToAgreement}
          onOpenPortalDemo={() => setIsPortalModalOpen(true)}
        />

        {/* Section 2: Partner Categories Directory */}
        <PartnerCategoriesDirectory
          categoryGroups={categoryGroups}
          onSelectCategoryForApply={(cat, grp) => handleOpenApply(cat, grp)}
          onUpdateCategoryGroups={setCategoryGroups}
        />

        {/* Section 3: Commission Tiers Comparison Matrix */}
        <CommissionTiersSection
          onOpenApply={() => handleOpenApply()}
          onScrollToCalculator={scrollToCalculator}
        />

        {/* Section 4: Interactive Commission Calculator */}
        <CommissionCalculator
          onOpenApply={() => handleOpenApply()}
        />

        {/* Section 5: Master Partner Agreement Viewer (30 Articles & Schedules A-G) */}
        <PartnerAgreementViewer
          onOpenApply={() => handleOpenApply()}
          onOpenSchedule={(letter) => setActiveScheduleLetter(letter)}
        />

        {/* Section 6: Partner Enablement & Resource Centre */}
        <PartnerResourcesSection
          onOpenApply={() => handleOpenApply()}
        />

        {/* Section 7: Partner Programme FAQ */}
        <PartnerFAQSection
          onOpenApply={() => handleOpenApply()}
          onContactSupport={() => setIsContactModalOpen(true)}
        />

        {/* Section 8: Final Premium Call To Action */}
        <FinalCTASection
          onOpenApply={() => handleOpenApply()}
          onScrollToAgreement={scrollToAgreement}
          onOpenContact={() => setIsContactModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenApply={() => handleOpenApply()}
        onOpenPortal={() => setIsPortalModalOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onOpenSchedule={(letter) => setActiveScheduleLetter(letter)}
      />

      {/* MODALS */}

      {/* 1. 7-Step Onboarding & E-Signature Modal */}
      <PartnerOnboardingModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        categoryGroups={categoryGroups}
        prefilledCategory={prefilledCategory}
        prefilledGroupTitle={prefilledGroupTitle}
        onApplicationCompleted={handleApplicationCompleted}
      />

      {/* 2. Agreement Schedules Modal */}
      <AgreementSchedulesModal
        scheduleLetter={activeScheduleLetter}
        onClose={() => setActiveScheduleLetter(null)}
        onOpenApply={() => handleOpenApply()}
      />

      {/* 3. Partner Dashboard Modal */}
      <PartnerDashboardModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        partnerRecord={signedPartner}
        referrals={referrals}
        payouts={payouts}
        resources={INITIAL_RESOURCES}
        onOpenCertificate={() => {
          setIsCertificateModalOpen(true);
        }}
      />

      {/* 4. Partner Administration Desk Modal */}
      <PartnerAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        pendingApplications={pendingApplications}
        onApproveApplication={handleApproveApplication}
        onRejectApplication={handleRejectApplication}
        auditLogs={auditLogs}
      />

      {/* 5. Official Signed Certificate Modal */}
      <SignedCertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        partnerRecord={signedPartner}
      />

      {/* 6. Contact Partnership Team Modal */}
      <ContactPartnershipModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Floating Scroll Up & Down Widget (Left-Side) */}
      <ScrollNavigationWidget />

      {/* Floating Live Chat Help Desk Widget (Bottom-Right) */}
      <LiveChatWidget />

          </div>
        </LanguageProvider>
      </CurrencyProvider>
    </ThemeProvider>
  );
}
