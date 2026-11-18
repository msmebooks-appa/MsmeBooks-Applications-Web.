import React, { useState } from 'react';
import { RELATED_LEGAL_DOCUMENTS } from '../data/termsContent';
import { RelatedLegalDoc } from '../types/terms';
import { FileText, ArrowUpRight, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';

interface RelatedDocumentsProps {
  t: TranslationDictionary;
}

export const RelatedDocuments: React.FC<RelatedDocumentsProps> = ({ t }) => {
  const [selectedDoc, setSelectedDoc] = useState<RelatedLegalDoc | null>(null);

  return (
    <section id="related-documents" className="pt-12 pb-16 bg-slate-50 dark:bg-[#06111C] border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#84CC16]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0B3558] dark:text-[#84CC16]">
              {t.relatedDocs.frameworkTag}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3558] dark:text-white tracking-tight">
            {t.relatedDocs.heading}
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.relatedDocs.description}
          </p>
        </div>

        {/* Grid of Legal Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {RELATED_LEGAL_DOCUMENTS.map((doc) => (
            <div
              key={doc.id}
              className="bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-2xs hover:border-[#0B3558]/40 dark:hover:border-[#84CC16]/60 hover:shadow-xs transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-lg bg-[#F0F7FD] dark:bg-[#0D2238] text-[#0B3558] dark:text-[#84CC16] group-hover:bg-[#0B3558] dark:group-hover:bg-[#84CC16] group-hover:text-white dark:group-hover:text-[#072238] transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                      doc.status === 'Published'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/80'
                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/80'
                    }`}
                  >
                    {doc.status === 'Published' ? t.relatedDocs.statusPublished : t.relatedDocs.statusPending}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-[#0B3558] dark:group-hover:text-[#84CC16] transition-colors">
                  {doc.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t.relatedDocs.updatedPrefix} {doc.lastUpdated}
                </span>

                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0B3558] dark:text-[#38BDF8] group-hover:text-[#84CC16] dark:group-hover:text-[#84CC16] transition-colors"
                >
                  <span>{t.relatedDocs.quickView}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick View Modal for Related Documents */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-[#0A1A2C] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col transition-colors">
            <div className="p-5 bg-[#0B3558] dark:bg-[#06182B] text-white flex items-center justify-between border-b dark:border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#84CC16]" />
                <h3 className="font-bold text-base">{selectedDoc.title}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 text-blue-200 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700 dark:text-slate-300">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <span>{t.relatedDocs.statusLabel} <strong className="text-slate-800 dark:text-slate-200">{selectedDoc.status}</strong></span>
                <span>{t.relatedDocs.lastUpdatedLabel} <strong className="text-slate-800 dark:text-slate-200">{selectedDoc.lastUpdated}</strong></span>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">{t.relatedDocs.summaryHeading}</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{selectedDoc.previewSummary}</p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-[#0D2238] rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedDoc.description}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#112A45] rounded-lg transition-colors"
                >
                  {t.relatedDocs.closeButton}
                </button>
                <a
                  href={`mailto:legal@msmebooks.org?subject=Inquiry regarding ${selectedDoc.title}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#124B82] rounded-lg transition-colors"
                >
                  <span>{t.relatedDocs.requestCopy}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
