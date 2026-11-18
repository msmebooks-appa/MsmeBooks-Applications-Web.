import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface FooterProps {
  onNavigate: (path: string) => void;
  onOpenDemo: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDemo }) => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#072B45] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-750/60">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo lightMode size="lg" showTagline />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-300">{t.footer.website}</span>
              <a
                href="https://www.msmebooks.org"
                target="_blank"
                rel="noreferrer"
                className="text-[#90CF24] hover:underline flex items-center gap-1 font-mono"
              >
                www.msmebooks.org
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
            <div className="pt-2">
              <LanguageSelector compact />
            </div>
          </div>

          {/* Use Cases by Industry */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t.footer.industryHeader}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.filters.retail}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.filters.hospitality}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.filters.logistics}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.filters.healthcare}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.filters.services}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-[#90CF24] transition-colors cursor-pointer text-left font-medium"
                >
                  {t.footer.viewAllIndustries}
                </button>
              </li>
            </ul>
          </div>

          {/* Resources & Stories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t.footer.storiesHeader}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <button
                  onClick={() => onNavigate('/use-cases-success-stories')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.customerStories}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/customer-reviews')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.reviewsTestimonials}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/use-cases')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.implementationJourneys}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/customer-reviews')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.submitCaseStudy}
                </button>
              </li>
            </ul>
          </div>

          {/* Product & Action */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              {t.footer.getStartedHeader}
            </h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              {t.footer.getStartedDesc}
            </p>
            <button
              onClick={onOpenDemo}
              className="w-full px-4 py-2.5 text-xs font-bold text-[#072B45] bg-[#7CB518] hover:bg-[#90CF24] rounded-lg transition-colors cursor-pointer text-center"
            >
              {t.footer.bookDemoBtn}
            </button>
          </div>
        </div>

        {/* Verification Policy & Legal Note */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7CB518] shrink-0" />
            <p>
              <strong className="text-slate-300">{t.footer.integrityTitle}</strong> {t.footer.integrityNote}
            </p>
          </div>
          <div className="flex items-center gap-6 shrink-0 text-slate-400">
            <span>&copy; {new Date().getFullYear()} {t.footer.copyright}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
