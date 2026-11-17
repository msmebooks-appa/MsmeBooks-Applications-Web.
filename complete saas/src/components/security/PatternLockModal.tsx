import React, { useState } from 'react';
import {
  X,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Zap,
  Lock,
  Eye,
  Sliders,
} from 'lucide-react';
import { PatternLock } from './PatternLock';
import { PrimaryButton, SecondaryButton } from '../common/Buttons';

export interface PatternLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPattern: number[] | null;
  onSavePattern: (pattern: number[]) => void;
  onClearPattern?: () => void;
  showTrail: boolean;
  onToggleShowTrail: (show: boolean) => void;
  hapticEnabled: boolean;
  onToggleHaptic: (enabled: boolean) => void;
  initialTab?: 'setup' | 'test';
}

export const PatternLockModal: React.FC<PatternLockModalProps> = ({
  isOpen,
  onClose,
  savedPattern,
  onSavePattern,
  onClearPattern,
  showTrail,
  onToggleShowTrail,
  hapticEnabled,
  onToggleHaptic,
  initialTab,
}) => {
  const [activeTab, setActiveTab] = useState<'setup' | 'test'>(
    initialTab || (savedPattern && savedPattern.length > 0 ? 'test' : 'setup')
  );
  const [tempPattern, setTempPattern] = useState<number[] | null>(null);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab || (savedPattern && savedPattern.length > 0 ? 'test' : 'setup'));
      setTempPattern(null);
      setTestSuccess(false);
      setIsSavedSuccess(false);
    }
  }, [isOpen, initialTab, savedPattern]);

  if (!isOpen) return null;

  const handlePatternRecorded = (pattern: number[]) => {
    setTempPattern(pattern);
  };

  const handleConfirmSave = () => {
    if (!tempPattern) return;
    onSavePattern(tempPattern);
    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pattern-modal-title"
    >
      <div
        className="w-full max-w-md bg-white dark:bg-[#0B1E33] border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        id="pattern-lock-modal"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/80 dark:bg-[#081726]/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0F4C81] text-[#9AE61C] flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3
                  id="pattern-modal-title"
                  className="text-base font-bold text-[#072644] dark:text-white"
                >
                  Pattern Lock 2FA
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16]">
                  Mobile & POS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Alternative secondary verification for touchscreens and quick POS approvals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch between 'Set New Pattern' and 'Test Pattern' */}
        {savedPattern && savedPattern.length > 0 && (
          <div className="flex border-b border-slate-200 dark:border-slate-800 px-4 bg-slate-50 dark:bg-[#091C30]">
            <button
              type="button"
              onClick={() => {
                setActiveTab('setup');
                setTempPattern(null);
                setTestSuccess(false);
              }}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'setup'
                  ? 'border-[#0F4C81] dark:border-[#9AE61C] text-[#0F4C81] dark:text-[#9AE61C]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Reset / Configure Pattern
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('test');
                setTestSuccess(false);
              }}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === 'test'
                  ? 'border-[#0F4C81] dark:border-[#9AE61C] text-[#0F4C81] dark:text-[#9AE61C]'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Test Existing Pattern
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-center">
          {isSavedSuccess ? (
            <div className="py-8 space-y-3 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-full bg-[#84CC16]/20 text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
              <h4 className="text-base font-bold text-[#072644] dark:text-white">
                Pattern Lock Activated!
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Your 3x3 gesture unlock pattern is saved and ready for mobile 2FA verifications.
              </p>
            </div>
          ) : activeTab === 'setup' ? (
            <div className="space-y-4">
              <div className="text-left text-xs text-slate-600 dark:text-slate-300 space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold flex items-center gap-1.5 text-[#072644] dark:text-white">
                  <Zap className="w-3.5 h-3.5 text-[#84CC16]" />
                  Setup Instructions:
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  1. Drag your finger or mouse across the 3x3 grid connecting at least 4 dots.
                  <br />
                  2. Draw the exact same pattern a second time to confirm.
                </p>
              </div>

              {/* Pattern Lock interactive canvas in 'record' mode */}
              <PatternLock
                size={260}
                minNodes={4}
                mode="record"
                showTrail={showTrail}
                onSuccess={handlePatternRecorded}
                promptText="Draw your unlock pattern"
              />

              {tempPattern && (
                <div className="p-3 rounded-xl bg-[#84CC16]/10 border border-[#84CC16]/30 text-xs font-bold text-[#072644] dark:text-[#9AE61C] flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#65A30D]" />
                    Pattern recorded ({tempPattern.length} nodes)
                  </span>
                  <button
                    type="button"
                    onClick={handleConfirmSave}
                    className="px-3 py-1 bg-[#0F4C81] hover:bg-[#072644] text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Save & Enable
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Test Tab */
            <div className="space-y-4">
              <div className="text-left text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                <span className="font-bold block text-[#072644] dark:text-white mb-1">
                  Test Your Pattern Gesture:
                </span>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">
                  Draw your saved pattern to verify it matches. Real-time feedback will simulate 2FA authorization.
                </p>
              </div>

              <PatternLock
                size={260}
                minNodes={4}
                mode="verify"
                targetPattern={savedPattern || []}
                showTrail={showTrail}
                onSuccess={() => setTestSuccess(true)}
                onError={() => setTestSuccess(false)}
                promptText="Draw saved pattern to verify"
              />

              {testSuccess && (
                <div className="p-3 rounded-xl bg-[#84CC16]/15 border border-[#84CC16]/40 text-xs font-bold text-[#65A30D] dark:text-[#84CC16] flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Pattern Verified! Quick login authorized.</span>
                </div>
              )}
            </div>
          )}

          {/* Quick preferences toggles */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <span className="font-bold text-slate-700 dark:text-slate-200 block text-[11px] uppercase tracking-wider">
              Pattern Lock Preferences:
            </span>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTrail}
                  onChange={(e) => onToggleShowTrail(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                />
                <span>Make pattern visible while drawing (trail)</span>
              </label>
              <Eye className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hapticEnabled}
                  onChange={(e) => onToggleHaptic(e.target.checked)}
                  className="rounded border-slate-300 text-[#0F4C81] focus:ring-[#0F4C81]"
                />
                <span>Vibrate on touch (tactile haptic pulse)</span>
              </label>
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#081726]/50 flex items-center justify-between gap-3">
          {savedPattern && onClearPattern ? (
            <button
              type="button"
              onClick={() => {
                onClearPattern();
                setTempPattern(null);
                setActiveTab('setup');
              }}
              className="text-xs text-red-500 hover:text-red-700 font-bold transition-colors cursor-pointer"
            >
              Remove Pattern Lock
            </button>
          ) : (
            <span className="text-[11px] text-slate-400">At least 4 connected dots</span>
          )}

          <div className="flex items-center gap-2">
            <SecondaryButton onClick={onClose} size="sm">
              Done
            </SecondaryButton>
          </div>
        </div>
      </div>
    </div>
  );
};
