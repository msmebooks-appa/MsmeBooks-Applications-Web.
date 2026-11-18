import React, { useState } from 'react';
import {
  FileText,
  Shield,
  FileCheck,
  Scale,
  RefreshCw,
  Server,
  Handshake,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { RELATED_LEGAL_DOCUMENTS } from '../data/privacyPolicyData';
import { useLanguage } from '../context/LanguageContext';

export const RelatedDocuments: React.FC = () => {
  const [selectedDoc, setSelectedDoc] = useState<(typeof RELATED_LEGAL_DOCUMENTS)[0] | null>(null);
  const { t } = useLanguage();

  const getDocIcon = (id: string) => {
    switch (id) {
      case 'terms':
        return Scale;
      case 'dpa':
        return FileCheck;
      case 'security':
        return Shield;
      case 'refund':
        return RefreshCw;
      case 'subprocessors':
        return Server;
      case 'reseller':
        return Handshake;
      case 'aup':
        return AlertCircle;
      default:
        return FileText;
    }
  };

  return (
    <section id="legal-resources" className="py-16 bg-[#F7FAFC] dark:bg-[#09111e] border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#1455C0] dark:text-[#5B95FF]">
            {t('legal.kicker', 'Comprehensive Governance Suite')}
          </p>
          <h2 className="text-3xl font-extrabold text-[#172B4D] dark:text-white tracking-tight mt-1">
            {t('legal.title', 'Legal Information & Trust Resources')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {t('legal.subtitle', 'Our Privacy Policy works in tandem with our Master Services Agreement, Data Processing Agreement (DPA), and cybersecurity whitepapers to provide enterprise-grade commercial clarity.')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RELATED_LEGAL_DOCUMENTS.map((doc) => {
            const Icon = getDocIcon(doc.id);
            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="group cursor-pointer bg-white dark:bg-[#111C30] hover:bg-slate-50/80 dark:hover:bg-[#16233B] border border-slate-200 hover:border-[#1455C0]/40 dark:border-slate-800 dark:hover:border-[#1455C0]/60 rounded-xl p-5 transition-all duration-200 hover:shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-[#16233B] text-[#1455C0] dark:text-[#5B95FF] flex items-center justify-center group-hover:bg-[#1455C0] group-hover:text-white dark:group-hover:bg-[#155de0] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40 px-2 py-0.5 rounded">
                      {doc.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#172B4D] dark:text-white group-hover:text-[#1455C0] dark:group-hover:text-[#5B95FF] transition-colors leading-snug">
                      {t(`legal.doc.${doc.id}.title`, doc.title)}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                      {t(`legal.doc.${doc.id}.desc`, doc.description)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-medium text-[#1455C0] dark:text-[#5B95FF]">
                  <span>{t('legal.viewDetails', 'View Details')}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1455C0] dark:group-hover:text-[#5B95FF] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111C30] rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#1455C0] dark:bg-[#155de0] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#B8E62E]" />
                <h3 className="text-sm font-bold">{t(`legal.doc.${selectedDoc.id}.title`, selectedDoc.title)}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-slate-500 dark:text-slate-400">Document Status:</span>
                <span className="font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  {selectedDoc.status} ({selectedDoc.version})
                </span>
              </div>

              <div>
                <h4 className="font-bold text-[#172B4D] dark:text-white mb-1">Executive Summary</h4>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                  {t(`legal.doc.${selectedDoc.id}.summary`, selectedDoc.summary)}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-[#0D1627] border border-slate-200 dark:border-slate-800 rounded-xl space-y-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Legal Governance Scope</span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  {t(`legal.doc.${selectedDoc.id}.desc`, selectedDoc.description)} Full text repository access is maintained for all subscribed tenant administrators under their master enterprise portal.
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg font-medium"
                >
                  Close
                </button>
                <a
                  href={`mailto:legal@msmebooks.org?subject=Inquiry regarding ${encodeURIComponent(selectedDoc.title)}`}
                  className="px-4 py-2 text-white bg-[#1455C0] hover:bg-[#0f449e] dark:bg-[#155de0] dark:hover:bg-[#114ebc] font-semibold rounded-lg shadow-sm transition-colors"
                >
                  Request Official Legal Copy
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
