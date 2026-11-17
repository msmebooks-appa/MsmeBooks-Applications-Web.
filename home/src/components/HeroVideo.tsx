import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface HeroVideoProps {
  onOpenStartFree: () => void;
  onOpenBookDemo: () => void;
}

const VIDEO_CHAPTERS = [
  { id: 'dash', title: '1. Dashboard Overview', duration: '0:08', desc: 'Real-time revenue, expense & profit tracking' },
  { id: 'inv', title: '2. Create Invoice', duration: '0:16', desc: 'Instant WhatsApp payment link dispatch' },
  { id: 'pos', title: '3. Process POS Sale', duration: '0:25', desc: 'Fast checkout & mobile money scan' },
  { id: 'stock', title: '4. Inventory Alerts', duration: '0:34', desc: 'Multi-branch stock & re-orders' },
  { id: 'exp', title: '5. Record Expense', duration: '0:42', desc: 'Scan receipts with AI auto-categorization' },
  { id: 'rep', title: '6. Business Reports', duration: '0:50', desc: 'P&L, VAT & cash flow audits' },
  { id: 'mob', title: '7. Mobile App & Scale', duration: '0:58', desc: 'Manage your operations anywhere' },
];

export const HeroVideo: React.FC<HeroVideoProps> = ({ onOpenStartFree, onOpenBookDemo }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 1;
          const chapterIdx = Math.min(
            Math.floor((next / 100) * VIDEO_CHAPTERS.length),
            VIDEO_CHAPTERS.length - 1
          );
          setCurrentChapterIndex(chapterIdx);
          return next;
        });
      }, 550);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <section className="py-12 lg:py-16 bg-white dark:bg-[#0B1120] border-y border-slate-100 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0866FF] dark:text-[#B7F000]" />
            <span>Interactive Product Demonstration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-display">
            Watch MsmeBooks in 58 Seconds
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            See how African entrepreneurs manage accounting, invoicing, inventory, and point-of-sale from one connected screen.
          </p>
        </div>

        {/* Video Screen Container */}
        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-950 group">
          {/* Main Visual Frame (Simulating cinematic product capture with African business context) */}
          <div className="relative aspect-video sm:aspect-[21/9] w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1600&q=85"
              alt="African entrepreneur working with MsmeBooks"
              loading="eager"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80';
              }}
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlaying ? 'scale-105 filter brightness-75' : 'filter brightness-90'
              }`}
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            {/* Live Interactive Simulation Overlay when playing */}
            {isPlaying && (
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-between text-white animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/15 text-xs font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B7F000] animate-ping" />
                    <span>Live Product Workflow Simulation</span>
                  </div>
                  <div className="text-xs font-mono text-[#B7F000] bg-slate-900/80 px-2.5 py-1 rounded-lg">
                    {VIDEO_CHAPTERS[currentChapterIndex].duration} / 0:58
                  </div>
                </div>

                {/* Center Chapter Card Highlight */}
                <div className="max-w-md bg-slate-900/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/20 shadow-2xl space-y-1.5">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#B7F000]">
                    {VIDEO_CHAPTERS[currentChapterIndex].title}
                  </div>
                  <div className="text-sm sm:text-base font-semibold text-white">
                    {VIDEO_CHAPTERS[currentChapterIndex].desc}
                  </div>
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F000]" />
                    <span>Automated synchronization across branches</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>MsmeBooks Platform Engine v4.2</span>
                  <span className="hidden sm:inline">Built for Lagos, Nairobi, Accra &amp; Pan-Africa</span>
                </div>
              </div>
            )}

            {/* Big Center Play Button if paused */}
            {!isPlaying && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#0866FF] hover:bg-[#0752D4] text-white flex items-center justify-center shadow-2xl shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 relative group/btn"
                >
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  <div className="absolute -inset-2 rounded-full border-2 border-[#B7F000]/60 animate-ping" />
                </button>

                <div className="mt-4 bg-slate-900/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-white text-xs sm:text-sm font-semibold flex items-center gap-2">
                  <span>See How MsmeBooks Powers African Businesses</span>
                  <span className="text-[#B7F000] font-bold">&bull; 58s Demo</span>
                </div>
              </div>
            )}
          </div>

          {/* Video Controller Bar */}
          <div className="bg-slate-900 text-white px-4 py-3 sm:px-6 flex flex-col gap-2.5">
            {/* Scrubber / Progress Bar */}
            <div
              className="w-full bg-slate-800 h-1.5 rounded-full cursor-pointer relative overflow-hidden group/bar"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = (e.clientX - rect.left) / rect.width;
                setProgress(Math.round(clickPos * 100));
                const chapterIdx = Math.min(
                  Math.floor(clickPos * VIDEO_CHAPTERS.length),
                  VIDEO_CHAPTERS.length - 1
                );
                setCurrentChapterIndex(chapterIdx);
              }}
            >
              <div
                style={{ width: `${progress}%` }}
                className="bg-gradient-to-r from-[#0866FF] to-[#B7F000] h-full rounded-full transition-all duration-150"
              />
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs">
                <button
                  onClick={togglePlay}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-white transition-colors"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <span className="text-slate-400 font-mono text-[11px]">
                  0:{progress < 10 ? `0${Math.floor((progress * 58) / 100)}` : Math.floor((progress * 58) / 100)} / 0:58
                </span>
                <span className="hidden md:inline-block text-slate-400 font-medium">
                  &bull; {VIDEO_CHAPTERS[currentChapterIndex].title}
                </span>
              </div>

              {/* Quick Chapter Selector */}
              <div className="hidden lg:flex items-center gap-1 text-[11px]">
                {VIDEO_CHAPTERS.slice(0, 4).map((ch, idx) => (
                  <button
                    key={ch.id}
                    onClick={() => {
                      setCurrentChapterIndex(idx);
                      setProgress(Math.round((idx / VIDEO_CHAPTERS.length) * 100) + 5);
                      setIsPlaying(true);
                    }}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      currentChapterIndex === idx
                        ? 'bg-[#0866FF] text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {ch.title.split('. ')[1]}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenStartFree}
                  className="text-xs font-bold text-slate-900 bg-[#B7F000] hover:bg-[#A4D900] px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Try It Free</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
