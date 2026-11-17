/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToastProvider } from './components/Toast';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { ConnectionProvider } from './context/ConnectionContext';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { HeroSection } from './components/HeroSection';
import { QuickContactCards } from './components/QuickContactCards';
import { SecurityComplianceSection } from './components/SecurityComplianceSection';
import { ContactFormSection } from './components/ContactFormSection';
import { DirectContactInfo } from './components/DirectContactInfo';
import { PanAfricanPresence } from './components/PanAfricanPresence';
import { ClientSuccessStories } from './components/ClientSuccessStories';
import { SalesAndPartnerships } from './components/SalesAndPartnerships';
import { HelpCentreResources } from './components/HelpCentreResources';
import { FaqSection } from './components/FaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { DemoModal } from './components/DemoModal';
import { LiveChatWidget } from './components/LiveChatWidget';
import { PageScrollNav } from './components/PageScrollNav';
import { EnquiryType } from './types';

export default function App() {
  const [selectedEnquiryType, setSelectedEnquiryType] = useState<EnquiryType>('General Enquiry');
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  const scrollToForm = (type?: string) => {
    if (type) {
      setSelectedEnquiryType(type as EnquiryType);
    }
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectQuickOption = (type: EnquiryType) => {
    setSelectedEnquiryType(type);
    const formElement = document.getElementById('contact-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ThemeProvider>
      <ToastProvider>
        <CurrencyProvider>
          <LanguageProvider>
            <ConnectionProvider>
              <div className="min-h-screen bg-white dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-[#70C038]/20 selection:text-[#0B3B82] transition-colors duration-200">
                {/* Viewport Top Scroll Progress Indicator */}
                <ScrollProgressBar />

                {/* Navigation Bar (Top Bar Contract) */}
                <Navbar
                onOpenDemo={() => setDemoModalOpen(true)}
                onScrollToForm={scrollToForm}
              />

          <main className="flex-1">
            {/* Section 3: Hero Section — Let's Grow Your Business Together */}
            <HeroSection
              onContactClick={() => scrollToForm('General Enquiry')}
              onDemoClick={() => setDemoModalOpen(true)}
            />

            {/* Section 4: Quick Contact Options */}
            <QuickContactCards
              onSelectOption={handleSelectQuickOption}
              onOpenDemo={() => setDemoModalOpen(true)}
            />

            {/* Security and Compliance Standards & Trust Badges */}
            <SecurityComplianceSection
              onScrollToForm={scrollToForm}
            />

            {/* Section 5: Contact Form — Send Us a Message */}
            <ContactFormSection
              selectedEnquiryType={selectedEnquiryType}
              onEnquiryTypeChange={setSelectedEnquiryType}
            />

            {/* Section 6: Direct Contact Information */}
            <DirectContactInfo />

            {/* Section 7: Pan-African Presence — Built for Africa, Ready for the World */}
            <PanAfricanPresence
              onExploreSolutions={() => scrollToForm('Accounting & Bookkeeping')}
            />

            {/* Client Success Stories — African Business Owners Carousel */}
            <ClientSuccessStories
              onOpenDemo={() => setDemoModalOpen(true)}
              onScrollToForm={scrollToForm}
            />

            {/* Section 8: Dedicated Sales and Partnership Enquiries */}
            <SalesAndPartnerships
              onSalesClick={() => scrollToForm('Sales & Pricing')}
              onPartnerClick={() => scrollToForm('Reseller / Distributor Partnership')}
            />

            {/* Section 9: Product Support & Help Centre */}
            <HelpCentreResources
              onTechnicalSupportClick={() => scrollToForm('Technical Support')}
              onOpenDemo={() => setDemoModalOpen(true)}
            />

            {/* Section 10: Frequently Asked Questions */}
            <FaqSection
              onFaqAction={(type) => scrollToForm(type)}
            />

            {/* Section 11: Final Call-to-Action Section */}
            <FinalCtaSection
              onGetStartedClick={() => setDemoModalOpen(true)}
              onTalkToExpertClick={() => scrollToForm('Sales & Pricing')}
            />
          </main>

          {/* Section 12: Professional Footer */}
          <Footer
            onScrollToForm={scrollToForm}
            onOpenDemo={() => setDemoModalOpen(true)}
          />

          {/* Interactive Free Demo Booking Modal */}
          <DemoModal
            isOpen={demoModalOpen}
            onClose={() => setDemoModalOpen(false)}
          />

          {/* Floating Left-Side Up & Down Navigation Widget */}
          <PageScrollNav />

          {/* Floating Live Chat Widget */}
          <LiveChatWidget
            onOpenDemo={() => setDemoModalOpen(true)}
            onScrollToForm={scrollToForm}
          />
        </div>
      </ConnectionProvider>
    </LanguageProvider>
    </CurrencyProvider>
  </ToastProvider>
</ThemeProvider>
  );
}
