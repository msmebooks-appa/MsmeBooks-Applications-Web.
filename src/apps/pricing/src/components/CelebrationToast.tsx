import React, { useEffect, useState } from 'react';
import { Award, Sparkles, X, CheckCircle, ArrowRight } from 'lucide-react';

export interface MilestoneCelebrationData {
  id: string;
  title: string;
  badgeName: string;
  icon: string;
  perk: string;
  points: number;
}

interface CelebrationToastProps {
  milestone: MilestoneCelebrationData | null;
  onClose: () => void;
  onViewDashboard?: () => void;
}

export const CelebrationToast: React.FC<CelebrationToastProps> = ({
  milestone,
  onClose,
  onViewDashboard,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);

  useEffect(() => {
    if (!milestone) return;

    // Generate confetti sparkle particles
    const colors = ['#84CC16', '#0A4FD5', '#F59E0B', '#EC4899', '#3B82F6', '#10B981'];
    const newParticles = Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      x: Math.random() * 260 - 130,
      y: Math.random() * -140 - 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 4,
    }));
    setParticles(newParticles);

    // Auto-dismiss after 7 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 7000);

    return () => clearTimeout(timer);
  }, [milestone, onClose]);

  if (!milestone) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-300">
      {/* Floating Confetti Particle Animation */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none overflow-visible flex items-center justify-center">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute rounded-full animate-ping opacity-75"
              style={{
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                transform: `translate(${p.x}px, ${p.y}px)`,
                animationDuration: '1.2s',
                animationIterationCount: 2,
              }}
            />
          ))}
        </div>

        {/* Celebratory Card */}
        <div className="relative bg-gradient-to-r from-slate-900 via-[#0A4FD5] to-slate-900 text-white rounded-2xl p-4 shadow-2xl border-2 border-lime-400/80 shadow-lime-500/20">
          
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20 shadow-inner shrink-0">
                {milestone.icon}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-lime-400 text-slate-950 font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Growth Milestone!</span>
                  </span>
                  <span className="text-[10px] font-extrabold text-lime-300">
                    +{milestone.points} pts
                  </span>
                </div>
                <h4 className="text-sm font-black text-white mt-0.5 tracking-tight">
                  {milestone.title}
                </h4>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Close milestone notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Perk Unlocked */}
          <div className="mt-3 p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs">
            <div className="flex items-center gap-1.5 text-lime-300 font-bold text-[11px] mb-0.5">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Perk Unlocked:</span>
            </div>
            <p className="text-[11px] text-blue-100 font-medium">
              {milestone.perk}
            </p>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-white/15">
            <span className="text-[10px] text-white/70 font-medium">
              Saved to your MsmeBooks Profile
            </span>
            {onViewDashboard && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onViewDashboard();
                }}
                className="text-[11px] font-bold text-lime-300 hover:text-lime-200 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>View All Badges</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
