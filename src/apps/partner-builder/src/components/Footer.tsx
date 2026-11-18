import React from 'react';
import { ShieldCheck, MessageCircle, Phone, Globe, Mail } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FooterProps {
  onOpenApply: () => void;
  onOpenVerify: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenApply, onOpenVerify }) => {
  const { t } = useLanguage();
  const whatsappNumber = '+2349158482622';

  return (
    <footer className="bg-slate-900 dark:bg-[#031129] text-slate-300 pt-16 pb-12 border-t border-slate-800 dark:border-blue-950 transition-colors duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800 dark:border-blue-900/60 transition-colors duration-300 ease-in-out">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0A3981] dark:bg-[#061F4A] flex items-center justify-center text-white font-black text-xl border border-blue-400/30 dark:border-[#8CE600]/40">
                <span>M</span>
                <span className="text-[#8CE600] -ml-0.5">b</span>
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white leading-tight">
                  MsmeBooks
                </span>
                <span className="block text-[11px] font-semibold text-slate-400 dark:text-slate-400 tracking-wider uppercase">
                  Partner Programme Ecosystem
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('footer.tagline', 'The all-in-one Accounting, POS, Inventory, and Business Management platform for Africa and beyond.')}
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8CE600]" />
                <a href="https://www.msmebooks.org" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  www.msmebooks.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <a href={`https://wa.me/2349158482622`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Support: {whatsappNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:partners@msmebooks.org" className="hover:text-white transition-colors">
                  partners@msmebooks.org
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Col 1: Programme */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Partner Programme
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="#tiers" className="hover:text-white transition-colors">Membership Tiers</a></li>
              <li><a href="#benefits" className="hover:text-white transition-colors">Partner Benefits</a></li>
              <li><a href="#categories" className="hover:text-white transition-colors">Who Can Join</a></li>
              <li><a href="#compare" className="hover:text-white transition-colors">Benefit Comparison</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Commission Calculator</a></li>
            </ul>
          </div>

          {/* Navigation Col 2: Directory & Badges */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Credentials & Trust
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li><a href="#directory" className="hover:text-white transition-colors">Find a Certified Partner</a></li>
              <li><button onClick={onOpenVerify} className="hover:text-white transition-colors text-left cursor-pointer">Verify Partner Badge</button></li>
              <li><a href="#academy" className="hover:text-white transition-colors">Training Academy</a></li>
              <li><a href="#resources" className="hover:text-white transition-colors">Resource Centre</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Navigation Col 3: Actions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Get Started
            </h4>
            <div className="space-y-3">
              <button
                onClick={onOpenApply}
                className="w-full py-2.5 px-4 text-xs font-bold text-white dark:text-[#061F4A] bg-[#0A3981] dark:bg-[#8CE600] hover:bg-[#0d47a1] dark:hover:bg-[#9be81c] rounded-xl transition-colors shadow-sm text-center cursor-pointer"
              >
                {t('nav.become_partner', 'Become a Partner')}
              </button>
              <button
                onClick={onOpenVerify}
                className="w-full py-2 px-4 text-xs font-semibold text-slate-300 bg-slate-800 dark:bg-[#0A2552] hover:bg-slate-700 dark:hover:bg-[#0e316a] rounded-xl transition-colors text-center cursor-pointer border border-transparent dark:border-blue-900"
              >
                {t('nav.verify_partner', 'Verify Partner')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} MsmeBooks Inc. {t('footer.rights', 'All rights reserved. MsmeBooks is registered across Africa and the United Kingdom.')}
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Partner Agreement</span>
            <span className="hover:text-slate-400 cursor-pointer">Commission Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
