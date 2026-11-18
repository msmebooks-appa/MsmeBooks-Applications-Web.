import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CommissionTiers } from './components/CommissionTiers';
import { CategoryDirectory } from './components/CategoryDirectory';
import { CommissionCalculator } from './components/CommissionCalculator';
import { HowItWorks } from './components/HowItWorks';
import { PartnerDashboardPreview } from './components/PartnerDashboardPreview';
import { PayoutTransparency } from './components/PayoutTransparency';
import { TierProgression } from './components/TierProgression';
import { SalesEnablement } from './components/SalesEnablement';
import { SuccessStories } from './components/SuccessStories';
import { ComparisonTable } from './components/ComparisonTable';
import { FAQSection } from './components/FAQSection';
import { ApplicationModal } from './components/ApplicationModal';
import { AdminControlModal } from './components/AdminControlModal';
import { PartnerAgreementModal } from './components/PartnerAgreementModal';
import { PartnerLeaderboard } from './components/PartnerLeaderboard';
import { LiveChatWidget } from './components/LiveChatWidget';
import { SideScrollButtons } from './components/SideScrollButtons';
import { PartnerOnboardingTour } from './components/PartnerOnboardingTour';
import { Footer } from './components/Footer';
import { PartnerTierId, PartnerCategory, PartnerApplication } from './types/partner';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export default function App() {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [preselectedTier, setPreselectedTier] = useState<PartnerTierId>('gold');
  const [preselectedCategory, setPreselectedCategory] = useState<string | undefined>(undefined);

  // Auto-launch partner tour on first login/visit if not previously completed
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasCompletedTour = localStorage.getItem('msme-partner-tour-completed');
      if (!hasCompletedTour) {
        const timer = setTimeout(() => {
          setIsTourOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  // Theme state with localStorage & system preference detection
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('msme-theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('msme-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('msme-theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-transition');
    setIsDark((prev) => !prev);
    window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 450);
  };

  // Initialize applications list for partner leaderboard and admin simulation
  const [applications, setApplications] = useState<PartnerApplication[]>([
    {
      id: 'MSME-APP-7801',
      fullName: 'Dr. Adeola Balogun',
      businessName: 'Balogun Tax & Financial Advisory Ltd',
      email: 'a.balogun@balogunadvisory.ng',
      phone: '+234 803 219 4412',
      country: 'Nigeria',
      city: 'Lagos (Victoria Island)',
      categoryId: 'accountants',
      preferredTier: 'platinum',
      website: 'https://balogunadvisory.ng',
      networkSize: '50–150 SMEs',
      experience: '12 years advising mid-tier manufacturing and distribution enterprises.',
      proposal: 'We manage accounting for 65 clients seeking cloud migration from desktop software.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-02',
      status: 'approved',
      monthlyConversions: 54,
      monthlyRevenueNGN: 5400000,
      monthlyCommissionNGN: 2160000,
      growthMoM: '+42%',
      flagEmoji: '🇳🇬',
      badgeTitle: '#1 Pan-African Revenue Champion',
      keyAchievement: 'Migrated 22 wholesale distributors to automated cloud inventory & VAT ledgers.'
    },
    {
      id: 'MSME-APP-7803',
      fullName: 'Kofi Mensah-Arthur',
      businessName: 'Accra Fintech & POS Solutions',
      email: 'kofi@accrafintech.com.gh',
      phone: '+233 24 456 7890',
      country: 'Ghana',
      city: 'Accra (Osu)',
      categoryId: 'pos_agents',
      preferredTier: 'platinum',
      website: 'https://accrafintech.com.gh',
      networkSize: '50–150 SMEs',
      experience: 'Leading regional hardware POS and payment terminal supplier across Greater Accra.',
      proposal: 'Deploying MsmeBooks integrated POS terminals to retail supermarket chains.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-04',
      status: 'approved',
      monthlyConversions: 46,
      monthlyRevenueNGN: 4600000,
      monthlyCommissionNGN: 1840000,
      growthMoM: '+36%',
      flagEmoji: '🇬🇭',
      badgeTitle: 'Retail Hardware Rollout Leader',
      keyAchievement: 'Onboarded 18 multi-branch grocery stores onto touch screen POS & barcode sync.'
    },
    {
      id: 'MSME-APP-7802',
      fullName: 'Brian Mwangi',
      businessName: 'Rift Retail Tech Systems',
      email: 'mwangi@riftretailtech.co.ke',
      phone: '+254 712 889 012',
      country: 'Kenya',
      city: 'Nairobi (Westlands)',
      categoryId: 'it_consultants',
      preferredTier: 'gold',
      website: 'https://riftretailtech.co.ke',
      networkSize: '10–50 SMEs',
      experience: 'Hardware POS installer supplying touchscreen cash registers and barcode systems.',
      proposal: 'Plan to bundle MsmeBooks POS Touch onto terminal shipments throughout East Africa.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-06',
      status: 'approved',
      monthlyConversions: 39,
      monthlyRevenueNGN: 3900000,
      monthlyCommissionNGN: 1170000,
      growthMoM: '+29%',
      flagEmoji: '🇰🇪',
      badgeTitle: 'East Africa Fastest Growing',
      keyAchievement: 'Connected 39 pharmacy & electronics retail outlets with cloud inventory feeds.'
    },
    {
      id: 'MSME-APP-7804',
      fullName: 'Zanele Dlamini',
      businessName: 'Apex Business Advisory Group',
      email: 'zanele@apexadvisory.co.za',
      phone: '+27 11 892 4410',
      country: 'South Africa',
      city: 'Johannesburg (Sandton)',
      categoryId: 'business_consultants',
      preferredTier: 'gold',
      website: 'https://apexadvisory.co.za',
      networkSize: '50–150 SMEs',
      experience: 'Strategic SME growth consulting firm specializing in operational governance.',
      proposal: 'Standardizing accounting and automated payroll across mid-market clients.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-09',
      status: 'approved',
      monthlyConversions: 33,
      monthlyRevenueNGN: 3300000,
      monthlyCommissionNGN: 990000,
      growthMoM: '+24%',
      flagEmoji: '🇿🇦',
      badgeTitle: 'Governance & Advisory Star',
      keyAchievement: 'Transferred 15 fabrication and logistics providers to automated PAYE & invoicing.'
    },
    {
      id: 'MSME-APP-7805',
      fullName: 'Jean-Paul Habimana',
      businessName: 'Kigali Cloud Commerce',
      email: 'habimana@kigalicommerce.rw',
      phone: '+250 788 123 456',
      country: 'Rwanda',
      city: 'Kigali (Nyarugenge)',
      categoryId: 'software_resellers',
      preferredTier: 'silver',
      website: 'https://kigalicommerce.rw',
      networkSize: '10–50 SMEs',
      experience: 'Cloud software reseller empowering hospitality and quick-service venues.',
      proposal: 'Offering MsmeBooks packages tailored to dining, cafes, and boutique retail.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-12',
      status: 'approved',
      monthlyConversions: 27,
      monthlyRevenueNGN: 2700000,
      monthlyCommissionNGN: 540000,
      growthMoM: '+31%',
      flagEmoji: '🇷🇼',
      badgeTitle: 'Hospitality Tech Specialist',
      keyAchievement: 'Streamlined table billing and kitchen ticket printing for 27 popular eateries.'
    },
    {
      id: 'MSME-APP-7806',
      fullName: 'Fatima Zahra El-Mansouri',
      businessName: 'Atlas Digital Financials',
      email: 'f.elmansouri@atlasdigital.ma',
      phone: '+212 522 345 678',
      country: 'Morocco',
      city: 'Casablanca (Maarif)',
      categoryId: 'tax_consultants',
      preferredTier: 'silver',
      website: 'https://atlasdigital.ma',
      networkSize: '10–50 SMEs',
      experience: 'Specialist tax auditing firm for commercial importers and retail chains.',
      proposal: 'Implementing electronic invoicing and real-time VAT declaration exports.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-14',
      status: 'approved',
      monthlyConversions: 22,
      monthlyRevenueNGN: 2200000,
      monthlyCommissionNGN: 440000,
      growthMoM: '+18%',
      flagEmoji: '🇲🇦',
      badgeTitle: 'North Africa Regional Leader',
      keyAchievement: 'Secured full digital compliance for 22 fast-fashion and cosmetics boutiques.'
    },
    {
      id: 'MSME-APP-7807',
      fullName: 'Chinedu Eze',
      businessName: 'Enugu SME Bookkeeping Hub',
      email: 'c.eze@enugubooks.ng',
      phone: '+234 802 334 1199',
      country: 'Nigeria',
      city: 'Enugu (Independence Layout)',
      categoryId: 'bookkeepers',
      preferredTier: 'bronze',
      website: 'https://enugubooks.ng',
      networkSize: '10–50 SMEs',
      experience: 'Community bookkeeping firm servicing local market traders and auto distributors.',
      proposal: 'Converting informal cash books into automated bank-reconciled statements.',
      agreementAccepted: true,
      privacyAccepted: true,
      submittedAt: '2026-10-21',
      status: 'under_review',
      monthlyConversions: 16,
      monthlyRevenueNGN: 1600000,
      monthlyCommissionNGN: 240000,
      growthMoM: '+14%',
      flagEmoji: '🇳🇬',
      badgeTitle: 'Community Growth Partner',
      keyAchievement: 'Digitized daily cash flows for 16 traders across motor spare parts clusters.'
    }
  ]);

  const handleOpenApply = (tierId?: PartnerTierId, categoryId?: string) => {
    if (tierId) setPreselectedTier(tierId);
    if (categoryId) setPreselectedCategory(categoryId);
    setIsApplyModalOpen(true);
  };

  const handleSelectCategory = (cat: PartnerCategory) => {
    setPreselectedCategory(cat.id);
    setPreselectedTier(cat.suggestedTier);
    setIsApplyModalOpen(true);
  };

  const handleApplyWithTier = (tierId: PartnerTierId) => {
    setPreselectedTier(tierId);
    setIsApplyModalOpen(true);
  };

  const handleNewApplication = (newApp: PartnerApplication) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleUpdateAppStatus = (id: string, status: 'approved' | 'rejected') => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, status } : app))
    );
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-[#0B1528] text-[#253247] dark:text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-200">
      {/* 1. Global Navigation Bar with Theme Toggle, Language & Currency Selectors */}
      <Navbar
        onOpenApplyModal={() => handleOpenApply('gold')}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenAgreementModal={() => setIsAgreementModalOpen(true)}
        onOpenTour={() => setIsTourOpen(true)}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection onOpenApplyModal={() => handleOpenApply('gold')} />

        {/* 3. Partner Commission Levels (Four Reward Tiers) */}
        <CommissionTiers onSelectTier={(tierId) => handleOpenApply(tierId)} />

        {/* 4. Who Can Become an MsmeBooks Partner? (18 Categories Directory) */}
        <CategoryDirectory onSelectCategory={handleSelectCategory} />

        {/* 5. Interactive Commission Calculator */}
        <CommissionCalculator onApplyWithTier={handleApplyWithTier} />

        {/* 6. How the Partner Program Works (5-Step Visual Timeline) */}
        <HowItWorks onOpenApplyModal={() => handleOpenApply('gold')} />

        {/* 7. Realistic Partner Portal & Dashboard Preview with Recharts Bar Chart */}
        <PartnerDashboardPreview />

        {/* 8. Partner Leaderboard (Top 5 Performing Partners of the Month) */}
        <PartnerLeaderboard
          applications={applications}
          onOpenApplyModal={(tierId) => handleOpenApply(tierId)}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />

        {/* 9. Commission Payouts & Payment Transparency */}
        <PayoutTransparency />

        {/* 9. Partner Tier Upgrades & Performance Rewards */}
        <TierProgression />

        {/* 10. Partner Tools, Training & Sales Enablement */}
        <SalesEnablement />

        {/* 11. Partner Success Stories (Pan-African Case Studies) */}
        <SuccessStories />

        {/* 12. Full Feature Comparison Matrix */}
        <ComparisonTable onSelectTier={(tierId) => handleOpenApply(tierId)} />

        {/* 13. Searchable Frequently Asked Questions Accordion */}
        <FAQSection />

        {/* 14. Final Pre-Conversion Action Banner (Section 15 & 21) */}
        <section className="py-20 bg-gradient-to-br from-[#142D4E] via-[#1261B5] to-[#142D4E] text-white relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#B9E51C] uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Join 1,400+ Certified Partners</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Ready to Build Recurring Revenue With MsmeBooks?
            </h2>

            <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed">
              Join a growing ecosystem of business professionals helping SMEs adopt smarter accounting, POS, inventory, and payroll management technology.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={() => handleOpenApply('gold')}
                className="px-8 py-4 text-sm font-bold text-[#142D4E] bg-[#B9E51C] hover:bg-[#aadb14] active:scale-[0.98] transition-all rounded-xl shadow-xl shadow-[#B9E51C]/25 flex items-center gap-2"
              >
                <span>Become an MsmeBooks Partner — Earn Up to 40%</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="px-6 py-4 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#B9E51C]" />
                <span>Open Admin Portal Demo</span>
              </button>
            </div>

            <div className="pt-4 text-xs text-slate-300">
              <span>Zero Registration Fees</span>
              <span className="mx-2">·</span>
              <span>15% to 40% Recurring Commission</span>
              <span className="mx-2">·</span>
              <span>14-Day Free Partner Onboarding</span>
            </div>
          </div>
        </section>
      </main>

      {/* 15. Footer */}
      <Footer
        onOpenApplyModal={() => handleOpenApply('gold')}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenAgreementModal={() => setIsAgreementModalOpen(true)}
      />

      {/* Modals */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        preselectedTier={preselectedTier}
        preselectedCategory={preselectedCategory}
        onSubmitted={handleNewApplication}
        onOpenAgreement={() => setIsAgreementModalOpen(true)}
      />

      <AdminControlModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        applications={applications}
        onUpdateAppStatus={handleUpdateAppStatus}
      />

      <PartnerAgreementModal
        isOpen={isAgreementModalOpen}
        onClose={() => setIsAgreementModalOpen(false)}
      />

      {/* Floating Partner Support Live Chat Widget */}
      <LiveChatWidget />

      {/* Floating Left Side Up & Down Navigation Controls */}
      <SideScrollButtons />

      {/* Step-by-Step Onboarding Tour Overlay */}
      <PartnerOnboardingTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onOpenApplyModal={() => handleOpenApply('gold')}
      />
    </div>
  );
}
