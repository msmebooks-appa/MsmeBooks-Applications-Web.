import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Clock, 
  ExternalLink, 
  Scale, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  Layers,
  HelpCircle,
  PhoneCall,
  MessageCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NetworkProvider, useNetworkStatus } from './context/NetworkContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TableOfContents } from './components/TableOfContents';
import { SubscriptionCards } from './components/SubscriptionCards';
import { AddonsAndServices } from './components/AddonsAndServices';
import { EligibilityTable } from './components/EligibilityTable';
import { CancellationWalkthrough } from './components/CancellationWalkthrough';
import { RefundSubmissionAndTracker } from './components/RefundSubmissionAndTracker';
import { RefundRequestModal } from './components/RefundRequestModal';
import { PaymentGatewaysSection } from './components/PaymentGatewaysSection';
import { PartnersAndDisputes } from './components/PartnersAndDisputes';
import { FaqSection } from './components/FaqSection';
import { SupportSection } from './components/SupportSection';
import { AdminRefundModal } from './components/AdminRefundModal';
import { ClosingCta } from './components/ClosingCta';
import { Footer } from './components/Footer';
import { PageScrollNav } from './components/PageScrollNav';
import { INITIAL_REFUND_REQUESTS, POLICY_METADATA } from './data/policyData';
import { RefundRequest } from './types/policy';

const SECTIONS_LIST = [
  'overview',
  'subscriptions',
  'addons',
  'professional-services',
  'eligibility-matrix',
  'cancellation-procedure',
  'refund-tracker',
  'refund-processing',
  'partners-resellers',
  'payment-disputes',
  'data-retention',
  'statutory-rights',
  'faq-section',
  'customer-support',
];

function PolicyAppContent() {
  const [requests, setRequests] = useState<RefundRequest[]>(INITIAL_REFUND_REQUESTS);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const { t } = useLanguage();
  const { registerSyncCallback } = useNetworkStatus();

  // Register offline sync callback to merge synced claims into state
  useEffect(() => {
    const unregister = registerSyncCallback((syncedRequests) => {
      setRequests((prev) => {
        const existingIds = new Set(prev.map((r) => r.id));
        const newItems = syncedRequests.filter((r) => !existingIds.has(r.id));
        const updatedExisting = prev.map((r) => {
          const match = syncedRequests.find((sr) => sr.id === r.id);
          return match || r;
        });
        return [...newItems, ...updatedExisting];
      });
    });
    return unregister;
  }, [registerSyncCallback]);

  // Handle active section scrolling highlight
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of SECTIONS_LIST) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSectionClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleAddNewRequest = (newRequest: RefundRequest) => {
    setRequests((prev) => [newRequest, ...prev]);
  };

  const handleUpdateRequest = (updatedRequest: RefundRequest) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === updatedRequest.id ? updatedRequest : r))
    );
  };

  const handleContactSupport = () => {
    const element = document.getElementById('customer-support');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onRequestRefundClick={() => setIsRequestModalOpen(true)}
        onAdminClick={() => setIsAdminModalOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onContactSupportClick={handleContactSupport}
        onRequestRefundClick={() => setIsRequestModalOpen(true)}
      />

      {/* Main Content Area with Sticky Sidebar */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Sticky Table of Contents (Desktop only) */}
          <div className="hidden lg:block lg:col-span-3 sticky top-24">
            <TableOfContents
              activeSection={activeSection}
              onSectionClick={handleSectionClick}
            />
          </div>

          {/* Right Column: Policy Content Flow */}
          <div className="lg:col-span-9 space-y-16">
            
            {/* Section 01: Policy Overview */}
            <section id="overview" className="scroll-mt-24 space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-lime-700 dark:text-lime-400 tracking-wider uppercase mb-1">
                  <span>{t('overview.tag', '01. Foundation & Scope')}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-950 dark:text-white tracking-tight">
                  {t('overview.title', 'Policy Overview & Commercial Transparency')}
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {t('overview.subtitle', 'Our operational contract with enterprise operators across Nigeria, West Africa, East Africa, and global commercial territories.')}
                </p>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-4">
                <p>
                  {t('overview.p1', 'At MsmeBooks Technologies (operating through www.msmebooks.org), we recognize that mission-critical business software—encompassing general ledger accounting, retail point of sale, inventory warehouse tracking, and payroll compliance—requires complete billing transparency, predictable renewal expectations, and prompt financial accountability.')}
                </p>
                <p>
                  {t('overview.p2', 'This Refund & Cancellation Policy delineates the exact criteria under which subscriptions, one-time add-on modules, professional onboarding services, and marketplace purchases are billed, cancelled, renewed, or refunded. By accessing or subscribing to MsmeBooks, you acknowledge this commercial governance framework.')}
                </p>

                {/* 3 Core Tenets */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 not-prose">
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                    <span className="text-xs font-bold text-blue-950 dark:text-white block">
                      {t('overview.tenet1Title', 'No Hidden Charges')}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('overview.tenet1Desc', 'All subscription fees, payment processing costs, and module prices are explicitly itemized prior to invoice authorization.')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                    <span className="text-xs font-bold text-blue-950 dark:text-white block">
                      {t('overview.tenet2Title', 'Zero Cancellation Traps')}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('overview.tenet2Desc', 'Subscribers can pause or cancel recurring subscription renewals at any time with a single click inside the administrative dashboard.')}
                    </p>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
                    <span className="text-xs font-bold text-blue-950 dark:text-white block">
                      {t('overview.tenet3Title', 'Human Review Desk')}
                    </span>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t('overview.tenet3Desc', 'Every disputed invoice or duplicate debit is inspected by verified accounting specialists rather than automated rejection bots.')}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 02: Subscription Plans */}
            <SubscriptionCards />

            {/* Section 03 & 04: Add-ons & Professional Services */}
            <AddonsAndServices />

            {/* Section 05: Eligibility Matrix */}
            <EligibilityTable />

            {/* Section 06: Cancellation Procedures */}
            <CancellationWalkthrough />

            {/* Section 08: Direct Refund Submission Form & 4-Stage Visual Progress Tracker */}
            <RefundSubmissionAndTracker
              requests={requests}
              onAddNewRequest={handleAddNewRequest}
              onUpdateRequest={handleUpdateRequest}
            />

            {/* Section 08: Payment Gateways & Timelines */}
            <PaymentGatewaysSection />

            {/* Section 09, 12, 13: Partners, Disputes & Data Protection */}
            <PartnersAndDisputes />

            {/* Section 16: FAQs */}
            <FaqSection onContactSupportClick={handleContactSupport} />

            {/* Section 17: Support & Statutory Rights */}
            <SupportSection />

            {/* Closing CTA */}
            <ClosingCta onContactSupportClick={handleContactSupport} />

          </div>

        </div>
      </main>

      {/* Left-Side Up & Down Page Scroll Navigation */}
      <PageScrollNav sections={SECTIONS_LIST} />

      {/* Global Footer */}
      <Footer />

      {/* Public Refund Request Submission Modal */}
      <RefundRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSubmit={handleAddNewRequest}
      />

      {/* Internal Staff Billing Compliance Modal */}
      <AdminRefundModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        requests={requests}
        onUpdateRequest={handleUpdateRequest}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <NetworkProvider>
            <PolicyAppContent />
          </NetworkProvider>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

