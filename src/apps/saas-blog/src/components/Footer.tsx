import React from 'react';
import { Logo } from './Logo';
import { useLanguage, LanguageSelector } from '../context/LanguageContext';
import {
  Phone,
  Globe,
  Mail,
  MapPin,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface FooterProps {
  onNavigateHome: () => void;
  onSelectCategory?: (category: string) => void;
  onOpenAdmin?: () => void;
  onOpenLiveChat?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateHome,
  onSelectCategory,
  onOpenAdmin,
  onOpenLiveChat,
}) => {
  const { dict, t } = useLanguage();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Info & Mission (Spans 2 columns) */}
          <div className="lg:col-span-2 space-y-5">
            <button onClick={onNavigateHome} className="focus:outline-none">
              <Logo variant="light" size="md" />
            </button>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {dict.footer.mission}
            </p>

            <div className="space-y-2.5 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-lime-400 shrink-0" />
                <a
                  href="https://www.msmebooks.org"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  www.msmebooks.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-lime-400 shrink-0" />
                <a
                  href="tel:+2349158482622"
                  className="hover:text-white transition-colors font-medium text-slate-200"
                >
                  +2349158482622
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-lime-400 shrink-0" />
                <span>support@msmebooks.org</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-lime-400 shrink-0" />
                <span>Lagos · Nairobi · Accra · London</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="X (Twitter)"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.productTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory?.('Accounting')}
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.accountingLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('POS')}
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.posLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Inventory')}
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.inventoryLink}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Business Management')}
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.businessMgmtLink}
                </button>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/#addons"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  Add-ons & Hardware
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/#integrations"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  Integrations & APIs
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/#pricing"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors font-medium text-slate-300"
                >
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Solutions
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onSelectCategory?.('Retail')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Retail & Supermarkets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Restaurants')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Restaurants & Bars
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Pharmacy')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Pharmacy & Health
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Wholesale')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Wholesale & Distribution
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Fashion')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Fashion Boutiques
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Services')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Professional Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('Hotels & Hospitality')}
                  className="hover:text-lime-400 transition-colors"
                >
                  Hotels & Hospitality
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCategory?.('E-commerce')}
                  className="hover:text-lime-400 transition-colors"
                >
                  E-commerce Brands
                </button>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.resourcesTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-lime-400 transition-colors text-slate-200 font-semibold"
                >
                  {dict.nav.blog}
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.resourceDropdown.businessGuides}
                </button>
              </li>
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.resourceDropdown.customerStories}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLiveChat}
                  className="hover:text-lime-300 transition-colors flex items-center gap-1.5 text-lime-400 font-semibold"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-lime-400 animate-pulse" />
                  <span>{dict.liveChat.title}</span>
                </button>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/faqs"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.faqsLink}
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/help"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.helpLink}
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-lime-400 transition-colors flex items-center gap-1 text-slate-400"
                >
                  <span>{dict.nav.cmsStats}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              {dict.footer.companyTitle}
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a
                  href="https://www.msmebooks.org/about"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.aboutLink}
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/contact"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.contactLink}
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/partners"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.partnersLink}
                </a>
              </li>
              <li>
                <a
                  href="https://www.msmebooks.org/careers"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-lime-400 transition-colors"
                >
                  {dict.footer.careersLink}
                </a>
              </li>
            </ul>

            <div className="mt-6 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-[10px] font-extrabold text-lime-400 uppercase tracking-wider">
                {dict.footer.supportLine}
              </span>
              <div className="text-xs font-bold text-white mt-1">
                +2349158482622
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {dict.footer.hours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Terms */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MsmeBooks. {dict.common.allRightsReserved}. Built for African & Global Enterprise Resilience.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a
              href="https://www.msmebooks.org/privacy"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              {dict.footer.privacyPolicy}
            </a>
            <a
              href="https://www.msmebooks.org/terms"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              {dict.footer.termsOfService}
            </a>
            <a
              href="https://www.msmebooks.org/security"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              {dict.footer.security}
            </a>
            <LanguageSelector variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
};
