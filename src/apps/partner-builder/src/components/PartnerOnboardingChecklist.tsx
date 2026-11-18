import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Upload, 
  FileCheck, 
  Calendar, 
  CreditCard, 
  Link2, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  ArrowRight, 
  Trophy, 
  HelpCircle, 
  X, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  actionLabel: string;
  actionType: 'upload_logo' | 'quiz' | 'schedule' | 'payout' | 'referral' | 'profile';
  category: 'Branding' | 'Certification' | 'Meeting' | 'Setup';
  xp: number;
}

interface PartnerOnboardingChecklistProps {
  onScheduleMeeting: () => void;
  onNavigateTab: (tab: string) => void;
  partnerCode?: string;
  className?: string;
}

export const PartnerOnboardingChecklist: React.FC<PartnerOnboardingChecklistProps> = ({
  onScheduleMeeting,
  onNavigateTab,
  partnerCode = 'MSME-PT-8421',
  className = ''
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [uploadedLogo, setUploadedLogo] = useState<string | null>(null);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 'step-profile',
      title: 'Submit Practice Business & Entity Registration',
      description: 'Corporate registry documentation and tax residency details verified by compliance.',
      isCompleted: true,
      actionLabel: 'Verified',
      actionType: 'profile',
      category: 'Setup',
      xp: 100
    },
    {
      id: 'step-logo',
      title: 'Upload Practice Logo for Co-Branded Collateral',
      description: 'Upload your high-res SVG or PNG logo to generate co-branded sales brochures and client decks.',
      isCompleted: false,
      actionLabel: 'Upload Logo',
      actionType: 'upload_logo',
      category: 'Branding',
      xp: 150
    },
    {
      id: 'step-quiz',
      title: 'Complete First Academy Certification Quiz',
      description: 'Test your product knowledge on cloud POS offline syncing and statutory e-invoicing.',
      isCompleted: false,
      actionLabel: 'Start Quiz (3 Qs)',
      actionType: 'quiz',
      category: 'Certification',
      xp: 250
    },
    {
      id: 'step-meeting',
      title: 'Schedule Partner Strategy & Onboarding Call',
      description: 'Reserve a 25-minute 1-on-1 discovery session with the MsmeBooks Channel Director.',
      isCompleted: false,
      actionLabel: 'Schedule Call',
      actionType: 'schedule',
      category: 'Meeting',
      xp: 200
    },
    {
      id: 'step-payout',
      title: 'Configure Commission Payout Settlement Account',
      description: 'Set direct bank wire (NGN / KES / GHS / ZAR) or international SWIFT wire destination.',
      isCompleted: true,
      actionLabel: 'First Bank Nigeria (•••8821)',
      actionType: 'payout',
      category: 'Setup',
      xp: 100
    },
    {
      id: 'step-referral',
      title: 'Generate Custom Referral Link & Deploy First Client',
      description: 'Share your tracking URL with an SME client to unlock lifetime recurring rev-share.',
      isCompleted: false,
      actionLabel: 'Copy Link',
      actionType: 'referral',
      category: 'Setup',
      xp: 200
    }
  ]);

  const completedCount = items.filter((i) => i.isCompleted).length;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const toggleItemCompletion = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isCompleted;
          if (nextState) {
            showToast(`Completed "${item.title}"! (+${item.xp} XP earned)`);
          }
          return { ...item, isCompleted: nextState };
        }
        return item;
      })
    );
  };

  const handleSimulatedLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedLogo(event.target?.result as string);
        setItems((prev) =>
          prev.map((item) =>
            item.id === 'step-logo' ? { ...item, isCompleted: true } : item
          )
        );
        showToast('Practice logo uploaded successfully! Co-branded collateral ready.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAction = (item: ChecklistItem) => {
    switch (item.actionType) {
      case 'upload_logo': {
        const fileInput = document.getElementById('partner-logo-upload-input');
        fileInput?.click();
        break;
      }
      case 'quiz': {
        setIsQuizModalOpen(true);
        break;
      }
      case 'schedule': {
        onScheduleMeeting();
        // Mark as completed when scheduled
        setItems((prev) =>
          prev.map((i) => (i.id === 'step-meeting' ? { ...i, isCompleted: true } : i))
        );
        break;
      }
      case 'referral': {
        navigator.clipboard.writeText(`https://www.msmebooks.org/signup?ref=${partnerCode}`);
        setItems((prev) =>
          prev.map((i) => (i.id === 'step-referral' ? { ...i, isCompleted: true } : i))
        );
        showToast('Referral link copied to clipboard! Step marked as complete.');
        break;
      }
      case 'payout': {
        onNavigateTab('payouts');
        break;
      }
      case 'profile': {
        showToast('Entity documentation CAC-1492041 verified active.');
        break;
      }
    }
  };

  // Sample quiz questions
  const quizQuestions = [
    {
      q: 'How does MsmeBooks Retail POS handle offline internet disconnections?',
      options: [
        'Transactions freeze until connection returns',
        'Caches sales locally with automatic cloud background reconciliation upon reconnect',
        'Requires manual end-of-day CSV export only',
        'Deletes pending transactions after 1 hour'
      ],
      correct: 1
    },
    {
      q: 'What is the Gold Tier partner recurring commission rate on monthly software subscriptions?',
      options: ['15%', '20%', '30%', '40%'],
      correct: 2
    },
    {
      q: 'Which African statutory tax compliance standards are supported natively?',
      options: [
        'Only standard US GAAP',
        'ZIMRA, GRA, KRA, TIMS, EBM v2, OHADA, and FIRS e-tax engines',
        'Manual spreadsheet calculation only',
        'VAT only in Europe'
      ],
      correct: 1
    }
  ];

  const handleCompleteQuiz = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });

    const percent = Math.round((score / quizQuestions.length) * 100);
    setQuizScore(percent);

    if (percent >= 66) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === 'step-quiz' ? { ...item, isCompleted: true } : item
        )
      );
      showToast(`Passed Academy Certification Quiz with ${percent}%! (+250 XP earned)`);
      setTimeout(() => {
        setIsQuizModalOpen(false);
      }, 1500);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-blue-50/90 via-white to-blue-50/40 dark:from-[#072457] dark:via-[#061F4A] dark:to-[#051c44] rounded-3xl p-5 sm:p-6 border border-blue-200/90 dark:border-blue-700/80 shadow-md transition-all duration-300 ${className}`}>
      {/* Hidden file input for logo upload */}
      <input
        type="file"
        id="partner-logo-upload-input"
        accept="image/png, image/jpeg, image/svg+xml"
        className="hidden"
        onChange={handleSimulatedLogoUpload}
      />

      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100 dark:border-blue-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] flex items-center justify-center font-black shadow-sm shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                New Partner Onboarding Checklist
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600] border border-emerald-300 dark:border-emerald-800">
                {completedCount} of {totalCount} Steps Done
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-blue-100/70 mt-0.5">
              Complete onboarding tasks to activate your public directory listing and claim official welcome perks.
            </p>
          </div>
        </div>

        {/* Action / Minimize buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-xs text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-blue-900/40 cursor-pointer flex items-center gap-1 font-semibold"
          >
            <span>{isCollapsed ? 'Show Checklist' : 'Collapse'}</span>
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="pt-3 pb-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            <span>Overall Readiness:</span>
          </span>
          <span className="text-[#0A3981] dark:text-[#8CE600] font-mono">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-[#051838] h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300 dark:border-blue-900/80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#0A3981] via-[#0284C7] to-[#8CE600] transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Interactive Checklist Items (Expanded) */}
      {!isCollapsed && (
        <div className="mt-4 space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                item.isCompleted
                  ? 'bg-white/80 dark:bg-[#061F4A]/70 border-emerald-200/80 dark:border-emerald-900/50'
                  : 'bg-white dark:bg-[#072457] border-slate-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-600 shadow-xs'
              }`}
            >
              {/* Checkbox & Item Info */}
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggleItemCompletion(item.id)}
                  className="mt-0.5 text-slate-400 hover:text-emerald-600 dark:hover:text-[#8CE600] cursor-pointer transition-colors shrink-0"
                  title={item.isCompleted ? 'Mark incomplete' : 'Mark completed'}
                >
                  {item.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-[#8CE600]" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs sm:text-sm font-extrabold leading-tight ${
                        item.isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-blue-900/60 text-slate-500 dark:text-blue-200 font-bold">
                      +{item.xp} XP
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-0.5 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button & Thumbnail */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {item.id === 'step-logo' && uploadedLogo && (
                  <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-300 dark:border-blue-700 bg-white p-0.5 shrink-0">
                    <img src={uploadedLogo} alt="Uploaded Practice Logo" className="w-full h-full object-contain" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => handleAction(item)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    item.isCompleted
                      ? 'bg-slate-100 dark:bg-blue-900/40 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                      : 'bg-[#0A3981] dark:bg-[#8CE600] text-white dark:text-[#061F4A] hover:bg-[#072c66] dark:hover:bg-[#9be81c] shadow-xs'
                  }`}
                >
                  {item.actionType === 'upload_logo' && <Upload className="w-3.5 h-3.5" />}
                  {item.actionType === 'quiz' && <FileCheck className="w-3.5 h-3.5" />}
                  {item.actionType === 'schedule' && <Calendar className="w-3.5 h-3.5" />}
                  {item.actionType === 'referral' && <Link2 className="w-3.5 h-3.5" />}
                  {item.actionType === 'payout' && <CreditCard className="w-3.5 h-3.5" />}
                  <span>{item.actionLabel}</span>
                </button>
              </div>
            </div>
          ))}

          {/* 100% Completion Badge Banner */}
          {progressPercent === 100 && (
            <div className="mt-3 p-4 bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-emerald-500/20 rounded-2xl border border-emerald-300 dark:border-emerald-700 flex items-center justify-between gap-3 text-xs animate-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🎉</span>
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white">
                    Onboarding 100% Complete!
                  </div>
                  <div className="text-[11px] text-emerald-800 dark:text-[#8CE600]">
                    Your practice is fully certified, unlocked 30% rev-share, and listed in the Pan-African Directory.
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shrink-0 shadow-xs">
                Accredited
              </span>
            </div>
          )}
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="mt-3 p-3 bg-slate-900 text-white dark:bg-[#051c44] border border-slate-700 dark:border-blue-700 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-[#8CE600]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Certification Quick Quiz Modal */}
      {isQuizModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#072457] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-blue-800 relative">
            <button
              onClick={() => setIsQuizModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white p-2 rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-[#0A3981] dark:text-[#8CE600] text-xs font-bold uppercase tracking-wider mb-2">
                <FileCheck className="w-3.5 h-3.5" />
                <span>Academy Fast-Track Assessment</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Partner Product & Compliance Quiz
              </h3>
              <p className="text-xs text-slate-600 dark:text-blue-100/80 mt-1">
                Answer these 3 technical questions to prove practice readiness. Score 66% or higher to pass.
              </p>
            </div>

            <div className="space-y-4 my-5 max-h-[60vh] overflow-y-auto pr-1">
              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#061F4A] border border-slate-200 dark:border-blue-900 text-xs">
                  <div className="font-extrabold text-slate-900 dark:text-white mb-2">
                    {qIdx + 1}. {q.q}
                  </div>
                  <div className="space-y-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === oIdx;
                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                          className={`w-full p-2.5 rounded-xl text-left font-medium transition-all cursor-pointer flex items-center justify-between border ${
                            isSelected
                              ? 'bg-blue-100/70 dark:bg-blue-900/80 border-[#0A3981] dark:border-[#8CE600] text-[#0A3981] dark:text-white font-bold'
                              : 'bg-white dark:bg-[#072457] border-slate-200 dark:border-blue-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {quizScore !== null && (
              <div className={`p-3 rounded-xl text-xs font-bold text-center mb-3 ${
                quizScore >= 66
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600]'
                  : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
              }`}>
                {quizScore >= 66 ? `Passed! Score: ${quizScore}% 🎉` : `Score: ${quizScore}%. Please review and retry.`}
              </div>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsQuizModalOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-blue-900/40 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCompleteQuiz}
                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-[#0A3981] dark:bg-[#8CE600] dark:text-[#061F4A] hover:bg-[#072c66] disabled:opacity-50 rounded-xl shadow cursor-pointer transition-all"
              >
                Submit Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
