import React from 'react';
import { LEGAL_CHECKLIST_ITEMS } from '../data/termsContent';
import { X, ShieldAlert, Copy, Check } from 'lucide-react';
import { TranslationDictionary } from '../data/translations';

interface LegalChecklistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToSection: (sectionNumber: number) => void;
  t: TranslationDictionary;
}

export const LegalChecklistDrawer: React.FC<LegalChecklistDrawerProps> = ({
  isOpen,
  onClose,
  onJumpToSection,
  t
}) => {
  const [copiedAll, setCopiedAll] = React.useState(false);

  if (!isOpen) return null;

  const handleCopyChecklist = () => {
    const text = LEGAL_CHECKLIST_ITEMS.map((item, idx) =>
      `${idx + 1}. [Section ${item.sectionNumber}] ${item.topic}\n   Placeholder: ${item.placeholderText}\n   Required Action: ${item.description}\n   Notes: ${item.notes}\n`
    ).join('\n');

    navigator.clipboard.writeText(`MSMEBOOKS LEGAL COUNSEL PRE-PUBLICATION CHECKLIST\n\n${text}`).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0A1A2C] rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#0B3558] dark:bg-[#06182B] text-white flex items-center justify-between border-b dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/10 text-[#84CC16]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold">
                {t.modals.checklistTitle}
              </h3>
              <p className="text-xs text-blue-200 dark:text-blue-300">
                {t.modals.checklistSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-blue-200 hover:text-white rounded-lg transition-colors"
            aria-label="Close checklist"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <span className="font-bold text-amber-800 dark:text-amber-400 shrink-0 mt-0.5">Note:</span>
          <p className="leading-relaxed">
            {t.modals.checklistBanner}
          </p>
        </div>

        {/* Checklist Items */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs divide-y divide-slate-100 dark:divide-slate-800 flex-1">
          {LEGAL_CHECKLIST_ITEMS.map((item, idx) => (
            <div key={item.id} className="pt-3 first:pt-0 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <span className="font-mono font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                    0{idx + 1}.
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.topic}
                    </h4>
                    <span className="text-[11px] text-[#0B3558] dark:text-[#84CC16] font-semibold">
                      Referenced in Section {item.sectionNumber}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onJumpToSection(item.sectionNumber);
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-[#0B3558] dark:text-[#38BDF8] bg-[#F0F7FD] dark:bg-[#0D2A4A] hover:bg-blue-100 dark:hover:bg-[#10345C] rounded-md transition-colors shrink-0"
                >
                  {t.modals.viewInSecBtn.replace('{num}', String(item.sectionNumber))} →
                </button>
              </div>

              <div className="pl-6 space-y-1.5">
                <div className="p-2 rounded bg-slate-50 dark:bg-[#07131F] border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-[#0B3558] dark:text-[#84CC16] font-medium">
                  Placeholder: {item.placeholderText}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.description}
                </p>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Counsel Guidance: {item.notes}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 dark:bg-[#0D2238] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={handleCopyChecklist}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0A1A2C] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#112A45] rounded-lg transition-colors"
          >
            {copiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-emerald-700 dark:text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.modals.exportChecklistBtn}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0B3558] dark:bg-[#0E3F6D] hover:bg-[#072238] dark:hover:bg-[#124B82] rounded-lg transition-colors"
          >
            {t.modals.dismissBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
