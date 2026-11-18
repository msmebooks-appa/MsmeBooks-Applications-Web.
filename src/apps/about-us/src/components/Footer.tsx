import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { BrandLogo } from './BrandLogo';
import { Phone, Mail, Globe, MapPin, ArrowUp, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  onOpenPartnerModal: () => void;
  onOpenDemo: () => void;
  onOpenPrompt?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPartnerModal, onOpenDemo, onOpenPrompt }) => {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 dark:bg-black text-slate-400 pt-16 pb-12 border-t border-slate-900 dark:border-zinc-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: 5 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <BrandLogo variant="white" showTagline={true} />
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {t.footer_desc}
            </p>

            {/* Direct Contact Details */}
            <div className="space-y-2.5 pt-2 text-xs">
              <a
                href="tel:+2349158482622"
                className="flex items-center gap-2.5 text-slate-300 hover:text-lime-400 transition-colors"
              >
                <Phone className="w-4 h-4 text-lime-400 shrink-0" />
                <span>+234 915 848 2622</span>
              </a>

              <a
                href="mailto:support@msmebooks.org"
                className="flex items-center gap-2.5 text-slate-300 hover:text-lime-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-lime-400 shrink-0" />
                <span>support@msmebooks.org</span>
              </a>

              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-slate-300 hover:text-lime-400 transition-colors"
              >
                <Globe className="w-4 h-4 text-lime-400 shrink-0" />
                <span>www.msmebooks.org</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-3">
              <a
                href="https://www.linkedin.com/company/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0B4EA2] hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0B4EA2] hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/msmebooks"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-[#0B4EA2] hover:text-white flex items-center justify-center transition-colors text-slate-400"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Company (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer_col_company}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#our-story" className="text-lime-400 font-semibold hover:underline">
                  {t.footer_link_about}
                </a>
              </li>
              <li>
                <a href="#mission-vision" className="hover:text-white transition-colors">
                  {t.footer_link_mission}
                </a>
              </li>
              <li>
                <a href="#people-and-thinking" className="hover:text-white transition-colors">
                  {t.footer_link_thinking}
                </a>
              </li>
              <li>
                <button onClick={onOpenPartnerModal} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.footer_link_partners}
                </button>
              </li>
              <li>
                <a href="#success-stories" className="hover:text-white transition-colors">
                  {t.footer_link_stories}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  {t.footer_link_contact}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Solutions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer_col_solutions}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  {t.footer_link_accounting}
                </a>
              </li>
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  {t.footer_link_pos}
                </a>
              </li>
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  {t.footer_link_inventory}
                </a>
              </li>
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  {t.footer_link_multibranch}
                </a>
              </li>
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  {t.footer_link_hospitality}
                </a>
              </li>
              <li>
                <a href="#what-we-do" className="hover:text-white transition-colors">
                  {t.footer_link_analytics}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Resources (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer_col_resources}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  {t.footer_link_faqs}
                </a>
              </li>
              <li>
                <a href="#who-we-serve" className="hover:text-white transition-colors">
                  {t.footer_link_playbooks}
                </a>
              </li>
              <li>
                <button onClick={onOpenDemo} className="hover:text-white transition-colors text-left cursor-pointer">
                  {t.footer_link_tour}
                </button>
              </li>
              <li>
                {onOpenPrompt && (
                  <button 
                    onClick={onOpenPrompt} 
                    className="text-lime-400 hover:text-lime-300 font-semibold transition-colors text-left cursor-pointer flex items-center gap-1"
                  >
                    <span>{t.footer_link_prompt}</span>
                  </button>
                )}
              </li>
              <li>
                <a href="#documentation" className="hover:text-white transition-colors">
                  {t.footer_link_docs}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & Security (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{t.footer_col_legal}</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  {t.footer_link_privacy}
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors">
                  {t.footer_link_terms}
                </a>
              </li>
              <li>
                <a href="#refund" className="hover:text-white transition-colors">
                  {t.footer_link_refund}
                </a>
              </li>
              <li>
                <a href="#trust-security" className="hover:text-white transition-colors">
                  {t.footer_link_security}
                </a>
              </li>
              <li>
                <a href="#responsible-data" className="hover:text-white transition-colors">
                  {t.footer_link_governance}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Closing Brand Statement & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="text-white font-semibold">
              {t.closing_statement}
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="text-slate-500">
              © {new Date().getFullYear()} {t.footer_copyright}
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors p-1 text-xs cursor-pointer"
          >
            <span>{t.back_to_top}</span>
            <ArrowUp className="w-3.5 h-3.5 text-lime-400" />
          </button>

        </div>

      </div>
    </footer>
  );
};
