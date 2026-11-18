import React from 'react';
import {
  Shield,
  Phone,
  Mail,
  Globe,
  MapPin,
  ArrowUp,
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { POLICY_METADATA } from '../data/privacyPolicyData';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenCookieModal: () => void;
  onOpenRightsModal: () => void;
  onOpenPromptModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCookieModal,
  onOpenRightsModal,
  onOpenPromptModal,
}) => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#172B4D] dark:bg-[#070D17] text-white pt-16 pb-12 border-t-4 border-[#1455C0] dark:border-[#155de0] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1455C0] flex items-center justify-center text-white">
                <Shield className="w-5 h-5 text-[#B8E62E]" />
              </div>
              <div className="flex items-center gap-1 text-2xl font-bold tracking-tight text-white">
                <span>Msme</span>
                <span className="text-[#B8E62E]">Books</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              {t('footer.desc', 'MsmeBooks is the all-in-one cloud accounting, Point of Sale (POS), inventory, and business management SaaS platform empowering micro, small, and medium enterprises across Africa and globally.')}
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#B8E62E] shrink-0" />
                <a
                  href={`https://${POLICY_METADATA.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {POLICY_METADATA.website}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B8E62E] shrink-0" />
                <a
                  href={`tel:${POLICY_METADATA.phone}`}
                  className="hover:text-white transition-colors"
                >
                  {POLICY_METADATA.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B8E62E] shrink-0" />
                <a
                  href={`mailto:${POLICY_METADATA.dpoEmail}`}
                  className="hover:text-white transition-colors"
                >
                  {POLICY_METADATA.dpoEmail} (DPO Office)
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B8E62E] shrink-0 mt-0.5" />
                <span className="text-[11px] text-slate-400">
                  Lagos Corporate Operations & Pan-African Cloud Data Cluster
                </span>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t('footer.products', 'Products & Modules')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#policy-content" className="hover:text-white transition-colors">Cloud Accounting & Ledgers</a></li>
              <li><a href="#policy-content" className="hover:text-white transition-colors">Point of Sale (POS) Systems</a></li>
              <li><a href="#policy-content" className="hover:text-white transition-colors">Real-Time Inventory Control</a></li>
              <li><a href="#policy-content" className="hover:text-white transition-colors">Payroll & PAYE Compliance</a></li>
              <li><a href="#policy-content" className="hover:text-white transition-colors">Hospitality & Hotel PMS</a></li>
              <li><a href="#policy-content" className="hover:text-white transition-colors">E-Commerce & Digital Invoicing</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t('footer.resources', 'Resources & Trust')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#faq" className="hover:text-white transition-colors">{t('header.navFaq', 'Privacy FAQ')}</a></li>
              <li><a href="#rights-center" className="hover:text-white transition-colors">{t('header.navRights', 'Data Rights Portal')}</a></li>
              <li><a href="#security-pillars" className="hover:text-white transition-colors">{t('header.navTrust', 'Security Architecture')}</a></li>
              <li>
                <button
                  onClick={onOpenCookieModal}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <SlidersHorizontal className="w-3 h-3 text-[#B8E62E]" />
                  <span>{t('policy.cookieBtn', 'Cookie Preferences')}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPromptModal}
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3 h-3 text-[#B8E62E]" />
                  <span>{t('header.masterPrompt', 'Master Prompt Blueprint')}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {t('footer.legal', 'Legal Governance')}
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li><a href="#hero" className="text-[#B8E62E] font-medium">{t('header.navPolicy', 'Privacy Policy')}</a></li>
              <li><a href="#legal-resources" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#legal-resources" className="hover:text-white transition-colors">Data Processing Agreement (DPA)</a></li>
              <li><a href="#legal-resources" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#legal-resources" className="hover:text-white transition-colors">Subprocessor Registry</a></li>
              <li><a href="#legal-resources" className="hover:text-white transition-colors">Acceptable Use Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Back to Top, NDPA reference */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-center sm:text-left">
            <span>&copy; {new Date().getFullYear()} MsmeBooks Technologies Limited. {t('footer.rightsReserved', 'All rights reserved.')}</span>
            <span className="hidden sm:inline">·</span>
            <span>{t('footer.ndpaCompliant', 'Nigeria Data Protection Act 2023 Compliant')}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onOpenRightsModal()}
              className="hover:text-white transition-colors"
            >
              {t('footer.submitRequest', 'Submit Privacy Request')}
            </button>
            <span>·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-[#B8E62E] hover:underline"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{t('footer.backToTop', 'Back to Top')}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
