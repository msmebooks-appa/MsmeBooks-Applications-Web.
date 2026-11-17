import React from 'react';
import { Logo } from './Logo';
import { Phone, Mail, Globe, MessageCircle, ArrowUp } from 'lucide-react';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onScrollToForm: (enquiryType?: string) => void;
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToForm, onOpenDemo }) => {
  const currentYear = new Date().getFullYear();
  const { showToast } = useToast();
  const { tDict } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkNotice = (label: string) => {
    showToast('Navigation', `Opening ${label} section`, 'info');
  };

  return (
    <footer id="footer" className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 5-Column Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: MsmeBooks Brand & Bio (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Logo variant="light" size="md" className="mb-4" />
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pr-4 mb-6">
              {tDict.footer.bio}
            </p>
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">{tDict.footer.panAfricanOps}</p>
              <p>Nigeria · Ghana · Kenya · South Africa · Rwanda · Uganda · Tanzania · Egypt</p>
            </div>
          </div>

          {/* Column 2: Products (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-1">
              {tDict.footer.products}
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                'Accounting',
                'Point of Sale',
                'Inventory Management',
                'Business Management',
                'Hotel & Hospitality',
                'Integrations',
                'Marketplace',
              ].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      onScrollToForm(item);
                      handleLinkNotice(item);
                    }}
                    className="text-slate-400 hover:text-[#a1e670] transition-colors text-left"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-1">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { name: 'About Us', href: '#pan-africa' },
                { name: 'Contact Us', href: '#contact-form' },
                { name: 'Partners', href: '#partnerships' },
                { name: 'Success Stories', href: '#pan-africa' },
                { name: 'Blog', href: '#help-centre' },
                { name: 'Careers', href: '#contact-form' },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Resources (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-1">
              Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#help-centre" className="text-slate-400 hover:text-white transition-colors">
                  Help Centre
                </a>
              </li>
              <li>
                <a href="#help-centre" className="text-slate-400 hover:text-white transition-colors">
                  Knowledge Base
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenDemo}
                  className="text-slate-400 hover:text-[#a1e670] transition-colors text-left"
                >
                  Product Demos
                </button>
              </li>
              <li>
                <a href="#faqs" className="text-slate-400 hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <button
                  onClick={() =>
                    showToast('Privacy Policy', 'MsmeBooks complies with African & global data protection laws (NDPR, POPIA, GDPR).', 'info')
                  }
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    showToast('Terms of Service', 'Standard enterprise service terms apply to all MsmeBooks deployments.', 'info')
                  }
                  className="text-slate-400 hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800 pb-1">
              Connect
            </h4>
            <div className="space-y-3 text-xs">
              <a
                href="tel:+2349158482622"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#70C038]" />
                <span>+234 915 848 2622</span>
              </a>

              <a
                href="mailto:support@msmebooks.org"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#70C038]" />
                <span className="truncate">support@msmebooks.org</span>
              </a>

              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-[#70C038]" />
                <span>www.msmebooks.org</span>
              </a>

              <a
                href="https://wa.me/2349158482622"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#70C038]/20 text-[#a1e670] border border-[#70C038]/40 hover:bg-[#70C038]/30 transition-colors text-xs font-semibold"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#70C038]" />
                <span>WhatsApp Business</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} MsmeBooks Technologies. All rights reserved. Built for African Businesses, Ready for Global Growth.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Strictly Corporate Blue & Lemon Green Branding</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Scroll back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
