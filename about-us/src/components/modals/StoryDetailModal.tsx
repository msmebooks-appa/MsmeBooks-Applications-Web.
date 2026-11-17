import { useCurrency } from '../../context/CurrencyContext';
import { X, ArrowRight, Building2, MapPin, TrendingUp, CheckCircle, Coins } from 'lucide-react';

export interface StoryItem {
  id: string;
  name: string;
  category: string;
  country: string;
  flag: string;
  monthlyNgnVolume?: number;
  volumeLabel?: string;
  businessChallenge: string;
  solutionUsed: string;
  customerOutcome: string;
  quote: string;
  fullNarrative: string;
  keyMetrics: { label: string; value: string }[];
}

interface StoryDetailModalProps {
  story: StoryItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDemo: () => void;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  isOpen,
  onClose,
  onOpenDemo,
}) => {
  const { formatFromNGN } = useCurrency();
  if (!isOpen || !story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 rounded-2xl shadow-2xl border border-slate-100 dark:border-zinc-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#0B4EA2] px-6 py-5 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-lime-400">
              <span className="bg-lime-400/20 text-lime-300 px-2 py-0.5 rounded text-[10px]">Illustrative Case Study</span>
              <span>{story.category}</span>
            </div>
            <h3 className="text-xl font-bold mt-1">{story.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto space-y-6">
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" />
              {story.country}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-[#0B4EA2] dark:text-sky-400" />
              {story.category}
            </span>
          </div>

          {/* Converted Volume Badge */}
          {story.monthlyNgnVolume && (
            <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-[#0B4EA2] dark:text-sky-400" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{story.volumeLabel || 'Processed Business Volume'}</span>
              </div>
              <span className="text-base font-bold font-mono text-[#0B4EA2] dark:text-sky-300 tabular-nums">
                {formatFromNGN(story.monthlyNgnVolume)}
              </span>
            </div>
          )}

          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {story.keyMetrics.map((metric, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-200/80 dark:border-zinc-800 text-center">
                <span className="block text-xl font-bold font-mono text-[#0B4EA2] dark:text-sky-300 tabular-nums">
                  {metric.value}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  {metric.label}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
                The Business Challenge
              </h5>
              <p className="bg-slate-50 dark:bg-zinc-900 p-3.5 rounded-xl border border-slate-200/70 dark:border-zinc-800 text-slate-600 dark:text-slate-300">
                {story.businessChallenge}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
                The MsmeBooks Solution
              </h5>
              <p className="bg-blue-50/50 dark:bg-blue-950/30 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/60 text-slate-700 dark:text-slate-300">
                {story.solutionUsed}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1">
                Operational Outcome & Impact
              </h5>
              <p className="p-3.5 rounded-xl border border-lime-200 dark:border-lime-800/80 bg-lime-50/40 dark:bg-lime-950/30 text-slate-800 dark:text-lime-200">
                {story.customerOutcome}
              </p>
            </div>

            {story.fullNarrative && (
              <div className="pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-1.5">
                  Detailed Case Narrative
                </h5>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-xs">
                  {story.fullNarrative}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <button
              onClick={() => {
                onClose();
                onOpenDemo();
              }}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0B4EA2] hover:bg-[#083770] text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Schedule Workflow Demo</span>
              <ArrowRight className="w-4 h-4 text-lime-300" />
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 border border-slate-300 dark:border-zinc-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
            >
              Close Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
