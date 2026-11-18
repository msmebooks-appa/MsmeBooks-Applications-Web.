import React from 'react';
import { ShieldCheck, Lock, Award, CheckCircle, Globe2, FileBadge } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const TrustBanner: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800/80 py-6 px-4 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-semibold">
            {t.trust.title}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center justify-center text-center">
          
          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-2xs flex flex-col items-center justify-center gap-1 transition-colors duration-200">
            <Award className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{language === 'fr' ? 'ONECCA & ACCA' : 'ICAN & ACCA'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{language === 'fr' ? 'Experts-Comptables' : 'Certified Accountants'}</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-2xs flex flex-col items-center justify-center gap-1 transition-colors duration-200">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{language === 'fr' ? 'OHADA & CPA' : 'CPA & SAICA'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{language === 'fr' ? 'Praticiens Agréés' : 'Accredited Fellows'}</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-2xs flex flex-col items-center justify-center gap-1 transition-colors duration-200">
            <FileBadge className="w-5 h-5 text-sky-600 dark:text-sky-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{language === 'fr' ? 'OHADA & RGPD' : 'NDPR & POPIA'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{language === 'fr' ? 'Conforme Protection' : 'Data Privacy Compliant'}</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-2xs flex flex-col items-center justify-center gap-1 transition-colors duration-200">
            <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">256-Bit TLS</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{language === 'fr' ? 'Coffre Crypté' : 'Encrypted Document Vault'}</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-2xs flex flex-col items-center justify-center gap-1 transition-colors duration-200">
            <Globe2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">Multi-Devises</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{language === 'fr' ? 'XOF, XAF, EUR, USD, NGN' : 'NGN, KES, ZAR, USD, GHS'}</span>
          </div>

          <div className="p-3 bg-white dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 shadow-2xs flex flex-col items-center justify-center gap-1 transition-colors duration-200">
            <CheckCircle className="w-5 h-5 text-lime-600 dark:text-lime-400" />
            <span className="text-xs font-bold text-slate-900 dark:text-white">{language === 'fr' ? 'SLA Garanti' : 'Guaranteed SLA'}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">{language === 'fr' ? 'Zéro Pénalité Fiscale' : 'Zero Statutory Penalties'}</span>
          </div>

        </div>
      </div>
    </div>
  );
};
