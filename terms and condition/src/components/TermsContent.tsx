import React, { useState } from 'react';
import { SectionItem } from '../types/terms';
import { Link2, Check, ChevronDown, ChevronUp, AlertCircle, Sparkles } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';
import { TransactionRevenueCalculator } from './TransactionRevenueCalculator';

interface TermsContentProps {
  sections: SectionItem[];
  searchQuery: string;
  expandedSections: Record<string, boolean>;
  onToggleSection: (id: string) => void;
  onOpenChecklist: () => void;
  onOpenAcceptanceDemo: () => void;
  t: TranslationDictionary;
}

export const TermsContent: React.FC<TermsContentProps> = ({
  sections,
  searchQuery,
  expandedSections,
  onToggleSection,
  onOpenChecklist,
  onOpenAcceptanceDemo,
  t
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (sectionId: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(sectionId);
      setTimeout(() => setCopiedId(null), 2500);
    });
  };

  // Helper to highlight matching search text
  const highlightText = (text: string, query: string) => {
    if (!query || query.trim() === '') return text;
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-[#84CC16]/30 dark:bg-[#84CC16]/40 text-slate-950 dark:text-white font-medium px-0.5 rounded-xs">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div id="legal-content" className="flex-1 min-w-0 space-y-6">
      {/* Notice box indicating review readiness */}
      <div className="no-print bg-[#F0F7FD] dark:bg-[#0D2238] border border-blue-200/80 dark:border-blue-900/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-[#0B3558] dark:bg-[#0E3F6D] text-white shrink-0 mt-0.5">
            <AlertCircle className="w-4 h-4 text-[#84CC16]" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-[#0B3558] dark:text-[#84CC16] uppercase tracking-wider">
              {t.notice.badge}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              {t.notice.text}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
          <button
            onClick={onOpenChecklist}
            className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-[#0B3558] dark:text-[#38BDF8] bg-white dark:bg-[#081829] border border-blue-200 dark:border-blue-800/80 hover:bg-blue-50 dark:hover:bg-[#0E2742] rounded-lg transition-colors whitespace-nowrap"
          >
            {t.notice.button}
          </button>
        </div>
      </div>

      {/* Render all 33 sections */}
      {sections.map((section) => {
        const isExpanded = expandedSections[section.id] ?? true;
        const isCopied = copiedId === section.id;

        return (
          <article
            key={section.id}
            id={section.id}
            className="scroll-mt-24 bg-white dark:bg-[#0A1A2C] border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-2xs hover:border-slate-300 dark:hover:border-slate-700/80 transition-all overflow-hidden"
          >
            {/* Section Header */}
            <div className="p-5 sm:p-6 bg-slate-50/50 dark:bg-[#0D2238]/60 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="font-mono text-[#84CC16] font-bold">
                    Section {section.number}
                  </span>
                  <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="text-[#0B3558] dark:text-[#84CC16] uppercase tracking-wider text-[11px] font-semibold">
                    {section.category}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#0B3558] dark:text-white tracking-tight">
                  <a
                    href={`#${section.id}`}
                    className="hover:underline underline-offset-4 decoration-[#84CC16]"
                  >
                    {highlightText(`${section.number}. ${section.title}`, searchQuery)}
                  </a>
                </h2>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
                  {highlightText(section.summary, searchQuery)}
                </p>
              </div>

              {/* Action buttons on section card: Copy Anchor & Collapse Toggle */}
              <div className="flex items-center gap-1.5 shrink-0 no-print">
                <button
                  onClick={() => handleCopyLink(section.id)}
                  title={isCopied ? t.sectionControls.copied : t.sectionControls.link}
                  className={`p-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                    isCopied
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      : 'text-slate-500 dark:text-slate-400 hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:bg-slate-100 dark:hover:bg-[#112A45]'
                  }`}
                  aria-label="Copy section link"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-[11px] font-semibold hidden sm:inline">{t.sectionControls.copied}</span>
                    </>
                  ) : (
                    <>
                      <Link2 className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">{t.sectionControls.link}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onToggleSection(section.id)}
                  className="p-2 text-slate-500 dark:text-slate-400 hover:text-[#0B3558] dark:hover:text-[#84CC16] hover:bg-slate-100 dark:hover:bg-[#112A45] rounded-lg transition-colors"
                  aria-label={isExpanded ? t.sectionControls.collapse : t.sectionControls.expand}
                  title={isExpanded ? t.sectionControls.collapse : t.sectionControls.expand}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Section Body */}
            {isExpanded && (
              <div className="p-5 sm:p-6 space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {/* Paragraphs */}
                {section.content.map((paragraph, pIdx) => (
                  <p key={pIdx} className="leading-relaxed text-slate-700 dark:text-slate-300">
                    {highlightText(paragraph, searchQuery)}
                  </p>
                ))}

                {/* Section 2: Structured Definition Table */}
                {section.definitions && section.definitions.length > 0 && (
                  <div className="mt-6 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
                    <div className="bg-[#0B3558] dark:bg-[#06182B] px-4 py-2.5 text-white flex items-center justify-between border-b dark:border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {t.sectionControls.definitionsHeader}
                      </span>
                      <span className="text-[11px] text-blue-200 dark:text-[#84CC16] font-mono">
                        {section.definitions.length} {t.sectionControls.definedCount}
                      </span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs divide-y divide-slate-200 dark:divide-slate-800">
                        <thead className="bg-slate-50 dark:bg-[#0D2238] text-slate-700 dark:text-slate-200 font-semibold">
                          <tr>
                            <th className="py-2.5 px-4 w-1/3">{t.sectionControls.termHeader}</th>
                            <th className="py-2.5 px-4 w-2/3">{t.sectionControls.meaningHeader}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-[#0A1A2C]">
                          {section.definitions.map((def, dIdx) => (
                            <tr key={dIdx} className={dIdx % 2 === 1 ? 'bg-slate-50/50 dark:bg-[#0D2238]/40' : 'bg-white dark:bg-[#0A1A2C]'}>
                              <td className="py-2.5 px-4 font-semibold text-[#0B3558] dark:text-[#38BDF8] align-top">
                                {highlightText(def.term, searchQuery)}
                              </td>
                              <td className="py-2.5 px-4 text-slate-600 dark:text-slate-300 leading-relaxed align-top">
                                {highlightText(def.definition, searchQuery)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Subsections if available */}
                {section.subsections && section.subsections.length > 0 && (
                  <div className="mt-6 space-y-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <h3 className="text-sm font-bold text-[#0B3558] dark:text-[#93C5FD] flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                          <span>{highlightText(sub.subtitle, searchQuery)}</span>
                        </h3>
                        {sub.paragraphs.map((subP, spIdx) => (
                          <p key={spIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-3.5">
                            {highlightText(subP, searchQuery)}
                          </p>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {/* Section 6 Interactive SaaS Pricing & Transaction Revenue Settlement Matrix */}
                {section.number === 6 && (
                  <div className="no-print mt-4">
                    <TransactionRevenueCalculator />
                  </div>
                )}

                {/* Section 7 interactive demo prompt */}
                {section.number === 7 && (
                  <div className="no-print mt-4 p-4 rounded-lg bg-[#F0F7FD] dark:bg-[#0D2238] border border-blue-200/80 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-[#0B3558] dark:text-slate-200">
                      <Sparkles className="w-4 h-4 text-[#84CC16] shrink-0" />
                      <span>{t.sectionControls.saasComplianceNote}</span>
                    </div>
                    <button
                      onClick={onOpenAcceptanceDemo}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#124B82] rounded-md transition-colors shrink-0"
                    >
                      {t.sectionControls.openConsentSimulator}
                    </button>
                  </div>
                )}

                {/* Section 33 official contacts card */}
                {section.number === 33 && (
                  <div className="mt-4 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-[#F0F7FD] dark:from-[#0D2238] dark:to-[#081726] border border-slate-200/90 dark:border-slate-800 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B3558] dark:text-[#84CC16]">
                      {t.sectionControls.corporateHeader}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 bg-white dark:bg-[#0A1A2C] rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">{t.sectionControls.hqLabel}</span>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">MsmeBooks Technologies Ltd</p>
                        <p className="text-slate-500 dark:text-slate-400">[Insert Corporate Headquarters Address, Lagos / Abuja, Nigeria]</p>
                      </div>
                      <div className="p-3 bg-white dark:bg-[#0A1A2C] rounded-lg border border-slate-200/60 dark:border-slate-800 space-y-1">
                        <span className="text-slate-400 dark:text-slate-500 font-medium">{t.sectionControls.commLabel}</span>
                        <p className="text-slate-700 dark:text-slate-300">{t.sectionControls.telephoneLabel} <span className="font-semibold text-[#0B3558] dark:text-[#84CC16]">+234 915 848 2622</span></p>
                        <p className="text-slate-700 dark:text-slate-300">{t.sectionControls.legalDeskLabel} <a href="mailto:legal@msmebooks.org" className="text-[#0B3558] dark:text-[#38BDF8] font-semibold underline">legal@msmebooks.org</a></p>
                        <p className="text-slate-700 dark:text-slate-300">{t.sectionControls.websiteLabel} <a href="https://www.msmebooks.org" target="_blank" rel="noopener noreferrer" className="text-[#0B3558] dark:text-[#38BDF8] font-semibold underline">www.msmebooks.org</a></p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
};
