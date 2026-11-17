import React from 'react';
import { AGREEMENT_SCHEDULES, AGREEMENT_META } from '../data/agreementData';
import { X, Printer, Download, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

interface AgreementSchedulesModalProps {
  scheduleLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | null;
  onClose: () => void;
  onOpenApply: () => void;
}

export const AgreementSchedulesModal: React.FC<AgreementSchedulesModalProps> = ({
  scheduleLetter,
  onClose,
  onOpenApply
}) => {
  if (!scheduleLetter) return null;

  const schedule = AGREEMENT_SCHEDULES.find(s => s.letter === scheduleLetter) || AGREEMENT_SCHEDULES[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh] transition-colors duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold bg-[#84CC16] text-slate-900 px-2.5 py-0.5 rounded">
              Schedule {schedule.letter}
            </span>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">
                {schedule.title}
              </h3>
              <p className="text-[11px] text-slate-400">
                Annexure to MsmeBooks Master Partner Agreement ({AGREEMENT_META.version})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Print Schedule"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/60 rounded-xl space-y-1">
            <p className="text-xs font-bold text-[#0046B8] dark:text-blue-400 uppercase tracking-wider">
              Legal Scope & Authority
            </p>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              {schedule.summary}
            </p>
          </div>

          <div className="space-y-6">
            {schedule.sections.map((sec, idx) => (
              <div key={idx} className="space-y-2 border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0">
                <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-lime-600 dark:text-lime-400 font-mono text-xs">§{idx + 1}</span>
                  <span>{sec.heading}</span>
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-5 whitespace-pre-line">
                  {sec.body}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Version Control & Invariant Authority</span>
            </div>
            <p>
              This schedule is an integral part of the Master Agreement. Modifications require formal electronic publication or written bilateral addendum executed by authorized representatives of MsmeBooks Enterprise Technologies Limited.
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
          
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenApply();
            }}
            className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Apply Under Schedule {schedule.letter}</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-300" />
          </button>
        </div>

      </div>
    </div>
  );
};
