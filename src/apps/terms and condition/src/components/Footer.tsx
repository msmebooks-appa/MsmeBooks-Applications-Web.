import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, Globe, MapPin } from 'lucide-react';
import { DOCUMENT_METADATA } from '../data/termsContent';
import { TranslationDictionary } from '../data/translations';

interface FooterProps {
  t: TranslationDictionary;
}

export const Footer: React.FC<FooterProps> = ({ t }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B3558] dark:bg-[#061424] text-white pt-16 pb-12 border-t border-slate-800 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid: Brand + 4 Nav Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 pb-12 border-b border-white/10 dark:border-slate-800">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-[#0A1A2C] border dark:border-slate-800 p-2.5 rounded-xl inline-block shadow-sm">
              <Logo size="md" />
            </div>
            <p className="text-xs text-blue-200/90 dark:text-slate-300 leading-relaxed max-w-sm">
              {t.footer.mission}
            </p>
            <div className="space-y-2 text-xs text-blue-200 dark:text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#84CC16] shrink-0" />
                <a href="https://www.msmebooks.org" target="_blank" rel="noopener noreferrer" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">
                  {DOCUMENT_METADATA.brandWebsite}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#84CC16] shrink-0" />
                <a href={`tel:${DOCUMENT_METADATA.supportPhone}`} className="hover:text-white dark:hover:text-[#84CC16] transition-colors">
                  {DOCUMENT_METADATA.supportPhone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#84CC16] shrink-0" />
                <a href={`mailto:${DOCUMENT_METADATA.legalEmail}`} className="hover:text-white dark:hover:text-[#84CC16] transition-colors">
                  {DOCUMENT_METADATA.legalEmail}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1 text-slate-300 dark:text-slate-400">
                <MapPin className="w-4 h-4 text-[#84CC16] shrink-0 mt-0.5" />
                <span>{t.footer.serving}</span>
              </div>
            </div>
          </div>

          {/* Group 1: Platform Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              {t.footer.platformTitle}
            </h4>
            <ul className="space-y-2 text-xs text-blue-200/80 dark:text-slate-400">
              <li><a href="#section-4" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Accounting & Ledgers</a></li>
              <li><a href="#section-11" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Point of Sale (POS)</a></li>
              <li><a href="#section-12" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Multi-Store Inventory</a></li>
              <li><a href="#section-13" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Payroll & HR</a></li>
              <li><a href="#section-14" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Hospitality Operations</a></li>
              <li><a href="#section-15" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">E-commerce Sync</a></li>
              <li><a href="#section-16" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">APIs & Integrations</a></li>
            </ul>
          </div>

          {/* Group 2: Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              {t.footer.companyTitle}
            </h4>
            <ul className="space-y-2 text-xs text-blue-200/80 dark:text-slate-400">
              <li><a href="#section-1" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">About MsmeBooks</a></li>
              <li><a href="#section-22" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Partner Network</a></li>
              <li><a href="#section-23" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Professional Services</a></li>
              <li><a href="#section-29" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Pan-African Operations</a></li>
              <li><a href="#section-33" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Contact Our Team</a></li>
            </ul>
          </div>

          {/* Group 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              {t.footer.resourcesTitle}
            </h4>
            <ul className="space-y-2 text-xs text-blue-200/80 dark:text-slate-400">
              <li><a href="#section-21" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Help Center & Docs</a></li>
              <li><a href="#section-2" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Glossary & Definitions</a></li>
              <li><a href="#section-17" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">AI & Automation Guide</a></li>
              <li><a href="#section-9" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Security Whitepaper</a></li>
              <li><a href="#section-10" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Tax Compliance Notes</a></li>
            </ul>
          </div>

          {/* Group 4: Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#84CC16]">
              {t.footer.legalTitle}
            </h4>
            <ul className="space-y-2 text-xs text-blue-200/80 dark:text-slate-400">
              <li><a href="#legal-content" className="text-white font-semibold">Terms & Conditions</a></li>
              <li><a href="#related-documents" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Privacy Policy</a></li>
              <li><a href="#related-documents" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Refund & Cancellation</a></li>
              <li><a href="#related-documents" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Acceptable Use Policy</a></li>
              <li><a href="#related-documents" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Data Processing (NDPA/GDPR)</a></li>
              <li><a href="#related-documents" className="hover:text-white dark:hover:text-[#84CC16] transition-colors">Service Level Agreement</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer: Copyright, Standards, Disclaimer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-blue-300/70 dark:text-slate-400">
          <p>
            © {currentYear} {t.footer.rights}
          </p>
          <div className="flex items-center gap-4 text-xs">
            <span>{t.footer.ndpaTag}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.sslTag}</span>
            <span aria-hidden="true">·</span>
            <span>{t.footer.cloudTag}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
