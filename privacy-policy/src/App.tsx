/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { TrustCards } from './components/TrustCards';
import { PolicyLayout } from './components/PolicyLayout';
import { PrivacyRightsCentre } from './components/PrivacyRightsCentre';
import { RelatedDocuments } from './components/RelatedDocuments';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PrivacyRightsModal } from './components/PrivacyRightsModal';
import { CookiePreferencesModal } from './components/CookiePreferencesModal';
import { PromptInspectorModal } from './components/PromptInspectorModal';
import { FloatingScrollControls } from './components/FloatingScrollControls';
import { LiveChatWidget } from './components/LiveChatWidget';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { POLICY_SECTIONS, POLICY_METADATA } from './data/privacyPolicyData';

export default function App() {
  const [promptModalOpen, setPromptModalOpen] = useState(false);
  const [cookieModalOpen, setCookieModalOpen] = useState(false);
  const [rightsModalOpen, setRightsModalOpen] = useState(false);
  const [rightsDefaultType, setRightsDefaultType] = useState('access');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const handleOpenRightsModal = (type = 'access') => {
    setRightsDefaultType(type);
    setRightsModalOpen(true);
  };

  const handlePrintPolicy = () => {
    window.print();
  };

  const handleDownloadPolicy = () => {
    let doc = `# MsmeBooks Privacy Policy\n`;
    doc += `Official Corporate Policy for www.msmebooks.org\n`;
    doc += `Effective Date: ${POLICY_METADATA.effectiveDate} | Last Updated: ${POLICY_METADATA.lastUpdatedDate}\n`;
    doc += `Version: ${POLICY_METADATA.version}\n`;
    doc += `Official Contact: ${POLICY_METADATA.phone} | ${POLICY_METADATA.dpoEmail}\n\n`;
    doc += `---\n\n`;

    POLICY_SECTIONS.forEach((sec) => {
      doc += `## Section ${sec.number}: ${sec.title}\n\n`;
      doc += `${sec.content}\n\n`;

      if (sec.tableData) {
        doc += `| ${sec.tableData.headers.join(' | ')} |\n`;
        doc += `| ${sec.tableData.headers.map(() => '---').join(' | ')} |\n`;
        sec.tableData.rows.forEach((row) => {
          doc += `| ${row.join(' | ')} |\n`;
        });
        doc += `\n`;
      }

      if (sec.subsections) {
        sec.subsections.forEach((sub) => {
          doc += `### ${sub.title}\n`;
          doc += `${sub.body}\n\n`;
          if (sub.items) {
            sub.items.forEach((item) => {
              doc += `- ${item}\n`;
            });
            doc += `\n`;
          }
        });
      }

      if (sec.highlightNote) {
        doc += `> Note: ${sec.highlightNote}\n\n`;
      }
    });

    const blob = new Blob([doc], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'MsmeBooks_Official_Privacy_Policy_2026.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleContactDpo = () => {
    const el = document.getElementById('section-25');
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    } else {
      handleOpenRightsModal('contact');
    }
  };

  const handleSelectSection = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleOpenSearchFocus = () => {
    const policyEl = document.getElementById('policy-content');
    if (policyEl) {
      const yOffset = -90;
      const y = policyEl.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 400);
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <CurrencyProvider>
          <div className="min-h-screen flex flex-col bg-[#F7FAFC] dark:bg-[#09111e] text-[#172B4D] dark:text-slate-100 transition-colors duration-200">
            {/* 3-Zone Top Navigation Header */}
            <Header
              onOpenPromptModal={() => setPromptModalOpen(true)}
              onOpenCookieModal={() => setCookieModalOpen(true)}
              onOpenRightsModal={handleOpenRightsModal}
              onOpenSearchFocus={handleOpenSearchFocus}
            />

            {/* Main Page Flow */}
            <main className="flex-1">
              {/* Hero Section */}
              <Hero
                onDownloadPolicy={handleDownloadPolicy}
                onPrintPolicy={handlePrintPolicy}
                onContactDpo={handleContactDpo}
              />

              {/* 3 Pillars of Trust Cards (Transparency, Data Control, Security) */}
              <TrustCards onSelectCategory={handleSelectSection} />

              {/* 2-Column Sticky Policy Layout (All 25 Sections + Sidebar) */}
              <PolicyLayout
                onOpenCookieModal={() => setCookieModalOpen(true)}
                onOpenRightsModal={handleOpenRightsModal}
                searchRef={searchInputRef}
              />

              {/* Interactive Privacy Rights Centre */}
              <PrivacyRightsCentre
                onOpenRightsModal={handleOpenRightsModal}
                onOpenCookieModal={() => setCookieModalOpen(true)}
              />

              {/* Related Legal Documents & Trust Resources */}
              <RelatedDocuments />

              {/* Privacy Policy FAQ (All 15 Questions) */}
              <FaqSection />
            </main>

            {/* Corporate Pan-African Footer */}
            <Footer
              onOpenCookieModal={() => setCookieModalOpen(true)}
              onOpenRightsModal={() => handleOpenRightsModal('access')}
              onOpenPromptModal={() => setPromptModalOpen(true)}
            />

            {/* Floating Left Side Scroll Controls */}
            <FloatingScrollControls />

            {/* Floating Right Side Live Chat Widget */}
            <LiveChatWidget />

            {/* Interactive Modals */}
            <PrivacyRightsModal
              isOpen={rightsModalOpen}
              onClose={() => setRightsModalOpen(false)}
              defaultType={rightsDefaultType}
            />

            <CookiePreferencesModal
              isOpen={cookieModalOpen}
              onClose={() => setCookieModalOpen(false)}
            />

            <PromptInspectorModal
              isOpen={promptModalOpen}
              onClose={() => setPromptModalOpen(false)}
            />
          </div>
        </CurrencyProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
