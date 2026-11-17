import React from 'react';
import { DOCUMENT_VERSIONS } from '../data/termsContent';
import { X, History, CheckCircle2, Calendar } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: TranslationDictionary;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose,
  t
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0A1A2C] rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#0B3558] dark:bg-[#06182B] text-white flex items-center justify-between border-b dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 text-[#84CC16]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                {t.modals.versionTitle}
              </h3>
              <p className="text-xs text-blue-200 dark:text-blue-300">
                {t.modals.versionSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-700 dark:text-slate-300 flex-1">
          {DOCUMENT_VERSIONS.map((ver) => (
            <div
              key={ver.version}
              className={`p-4 rounded-xl border ${
                ver.isCurrent
                  ? 'border-[#84CC16] bg-[#84CC16]/5 dark:bg-[#84CC16]/10'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0D2238]/60'
              } space-y-2.5`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-[#0B3558] dark:text-[#84CC16]">
                    {ver.version}
                  </span>
                  {ver.isCurrent && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full border dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {t.modals.currentActiveTag}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                  <Calendar className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>{t.modals.effectiveLabel}: {ver.effectiveDate}</span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
                {ver.summary}
              </p>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  {t.modals.keyModificationsLabel}
                </div>
                <ul className="space-y-1 list-disc list-inside text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ver.changes.map((ch, cIdx) => (
                    <li key={cIdx}>{ch}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D2238] border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#124B82] rounded-lg transition-colors"
          >
            {t.modals.closeVersionBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
