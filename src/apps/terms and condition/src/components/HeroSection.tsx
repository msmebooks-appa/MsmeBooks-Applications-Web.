import React from 'react';
import { DOCUMENT_METADATA } from '../data/termsContent';
import { Download, Printer, History, ShieldAlert, Sparkles, Coins } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';
import { useCurrency } from '../context/CurrencyContext';

interface HeroSectionProps {
  onPrint: () => void;
  onDownloadText: () => void;
  onOpenVersions: () => void;
  onOpenChecklist: () => void;
  onOpenAcceptanceDemo: () => void;
  t: TranslationDictionary;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPrint,
  onDownloadText,
  onOpenVersions,
  onOpenChecklist,
  onOpenAcceptanceDemo,
  t
}) => {
  const { currency, currencyInfo, formatNgn } = useCurrency();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F0F7FD] via-white to-white dark:from-[#0B1E32] dark:via-[#071523] dark:to-[#07131F] pt-8 pb-10 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      {/* Subtle brand decorative accent in top right */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#84CC16]/10 to-transparent dark:from-[#84CC16]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-[#0B3558]/5 to-transparent dark:from-blue-500/5 rounded-full blur-2xl pointer-events-none -ml-20 -mb-20"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb: Home → Legal → Terms & Conditions */}
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex items-center space-x-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <li>
              <a href="https://www.msmebooks.org" target="_blank" rel="noopener noreferrer" className="hover:text-[#0B3558] dark:hover:text-[#84CC16] transition-colors">
                {t.hero.home}
              </a>
            </li>
            <li aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</li>
            <li>
              <a href="#related-documents" className="hover:text-[#0B3558] dark:hover:text-[#84CC16] transition-colors">
                {t.hero.legalBreadcrumb}
              </a>
            </li>
            <li aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</li>
            <li className="text-[#0B3558] dark:text-[#38BDF8] font-semibold" aria-current="page">
              Terms & Conditions
            </li>
          </ol>
        </nav>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-2 w-2 rounded-full bg-[#84CC16]" aria-hidden="true" />
            <span className="text-xs font-semibold tracking-wider uppercase text-[#0B3558] dark:text-[#84CC16]">
              {t.hero.agreementType}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B3558] dark:text-white tracking-tight leading-tight">
            MsmeBooks Terms & Conditions
          </h1>

          <p className="mt-2 text-lg sm:text-xl font-semibold text-[#84CC16] dark:text-[#A3E635] tracking-tight">
            {t.hero.subtitle}
          </p>

          <blockquote className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl border-l-2 border-[#84CC16] pl-4 italic">
            "{t.hero.quote}"
          </blockquote>
        </div>

        {/* Clean Metadata Strip (No pill badges, clean typography) */}
        <div className="mt-8 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-normal">{t.hero.versionLabel}</span>{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200 font-mono">{t.hero.versionValue}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-normal">{t.hero.effectiveDateLabel}</span>{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200">{DOCUMENT_METADATA.effectiveDate}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-normal">{t.hero.lastUpdatedLabel}</span>{' '}
              <span className="font-semibold text-slate-900 dark:text-slate-200">{DOCUMENT_METADATA.lastUpdated}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <div>
              <span className="text-slate-400 dark:text-slate-500 font-normal">{t.hero.scopeLabel}</span>{' '}
              <span className="font-medium text-slate-900 dark:text-slate-200">{t.hero.scopeValue}</span>
            </div>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#84CC16]" />
              <span className="text-slate-400 dark:text-slate-500 font-normal">Pricing Currency:</span>{' '}
              <span className="font-semibold text-[#0B3558] dark:text-[#84CC16] font-mono">
                {currency} ({currencyInfo.symbol}) · Growth from {formatNgn(35000)}/mo
              </span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onDownloadText}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B3558] dark:text-[#38BDF8] bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-700/80 hover:border-[#0B3558] dark:hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-[#122A44] rounded-lg shadow-2xs transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#84CC16]"
            >
              <Download className="w-3.5 h-3.5 text-[#0B3558] dark:text-[#38BDF8]" />
              <span>{t.hero.downloadPdf}</span>
            </button>

            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-[#122A44] rounded-lg shadow-2xs transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#84CC16]"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>{t.hero.printTerms}</span>
            </button>

            <button
              onClick={onOpenVersions}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0D2238] border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-[#122A44] rounded-lg shadow-2xs transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#84CC16]"
            >
              <History className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>{t.hero.versionHistory}</span>
            </button>

            <button
              onClick={onOpenChecklist}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#0B3558] dark:text-[#84CC16] bg-[#F0F7FD] dark:bg-[#0D2A4A] border border-blue-200 dark:border-blue-900/60 hover:bg-blue-100/60 dark:hover:bg-[#103358] rounded-lg transition-all whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0B3558]"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#0B3558] dark:text-[#84CC16]" />
              <span>{t.hero.counselReview}</span>
            </button>

            <button
              onClick={onOpenAcceptanceDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#072238] bg-[#84CC16] hover:bg-[#74BE14] font-bold rounded-lg transition-all shadow-2xs whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#0B3558]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#072238]" />
              <span>{t.hero.testConsent}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
