import React from 'react';
import { Clock, Coins, Star, X, SlidersHorizontal, ArrowDownWideNarrow, Zap, Check } from 'lucide-react';

export type QuickFilterMode = 'none' | 'fastest_delivery' | 'lowest_cost' | 'highest_rated';

interface FloatingQuickFilterBarProps {
  activeFilter: QuickFilterMode;
  onToggleFilter: (filter: QuickFilterMode) => void;
  onReset: () => void;
  resultCount: number;
  hasOtherFloatingBars?: boolean;
}

export const FloatingQuickFilterBar: React.FC<FloatingQuickFilterBarProps> = ({
  activeFilter,
  onToggleFilter,
  onReset,
  resultCount,
  hasOtherFloatingBars = false,
}) => {
  const isFilterActive = activeFilter !== 'none';

  return (
    <aside
      aria-label="Marketplace Quick Filter"
      className={`fixed left-1/2 -translate-x-1/2 z-35 transition-all duration-300 pointer-events-auto ${
        hasOtherFloatingBars ? 'bottom-24 sm:bottom-24' : 'bottom-6 sm:bottom-7'
      } w-auto max-w-[96vw] sm:max-w-2xl animate-in fade-in slide-in-from-bottom-3 duration-250`}
    >
      <div className="bg-[#102B4E]/95 dark:bg-[#071322]/95 backdrop-blur-md text-white p-2 sm:p-2.5 rounded-2xl sm:rounded-full shadow-2xl border border-white/20 dark:border-slate-700/80 ring-1 ring-black/20 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        
        {/* Quick Filter Label / Indicator */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-black text-slate-200 shrink-0">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isFilterActive ? 'bg-[#B7E532]' : 'bg-blue-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              isFilterActive ? 'bg-[#B7E532]' : 'bg-blue-400'
            }`}></span>
          </span>
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#B7E532]" />
          <span className="hidden md:inline font-extrabold tracking-wide uppercase text-[11px] text-[#B7E532]">
            Quick Filter:
          </span>
        </div>

        {/* Divider for desktop */}
        <div className="h-5 w-px bg-white/15 hidden sm:block" />

        {/* Filter Toggle Buttons Group */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* 1. Fastest Delivery */}
          <button
            type="button"
            onClick={() => onToggleFilter('fastest_delivery')}
            className={`px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'fastest_delivery'
                ? 'bg-[#B7E532] text-[#102B4E] font-black shadow-md ring-2 ring-[#B7E532]/40 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white'
            }`}
            title="Sort immediately by shortest turnaround time and firms with slots open &lt; 48 hours"
          >
            {activeFilter === 'fastest_delivery' ? (
              <Check className="w-3.5 h-3.5 text-[#102B4E] stroke-[3]" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
            )}
            <span>Fastest Delivery</span>
            {activeFilter === 'fastest_delivery' && (
              <span className="text-[10px] bg-[#102B4E]/15 px-1 rounded font-black hidden xs:inline">
                Active
              </span>
            )}
          </button>

          {/* 2. Lowest Cost */}
          <button
            type="button"
            onClick={() => onToggleFilter('lowest_cost')}
            className={`px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'lowest_cost'
                ? 'bg-[#B7E532] text-[#102B4E] font-black shadow-md ring-2 ring-[#B7E532]/40 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white'
            }`}
            title="Sort immediately from lowest starter package price to highest"
          >
            {activeFilter === 'lowest_cost' ? (
              <Check className="w-3.5 h-3.5 text-[#102B4E] stroke-[3]" />
            ) : (
              <Coins className="w-3.5 h-3.5 text-amber-300" />
            )}
            <span>Lowest Cost</span>
            {activeFilter === 'lowest_cost' && (
              <span className="text-[10px] bg-[#102B4E]/15 px-1 rounded font-black hidden xs:inline">
                Active
              </span>
            )}
          </button>

          {/* 3. Highest Rated */}
          <button
            type="button"
            onClick={() => onToggleFilter('highest_rated')}
            className={`px-3 py-1.5 rounded-xl sm:rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeFilter === 'highest_rated'
                ? 'bg-[#B7E532] text-[#102B4E] font-black shadow-md ring-2 ring-[#B7E532]/40 scale-[1.02]'
                : 'bg-white/10 hover:bg-white/20 text-slate-100 hover:text-white'
            }`}
            title="Sort immediately by highest verified partner review rating and client review volume"
          >
            {activeFilter === 'highest_rated' ? (
              <Check className="w-3.5 h-3.5 text-[#102B4E] stroke-[3]" />
            ) : (
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            )}
            <span>Highest Rated</span>
            {activeFilter === 'highest_rated' && (
              <span className="text-[10px] bg-[#102B4E]/15 px-1 rounded font-black hidden xs:inline">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Clear/Reset Button when an active filter is engaged */}
        {isFilterActive && (
          <div className="flex items-center gap-1.5 pl-1 shrink-0 animate-in fade-in">
            <span className="text-[11px] font-bold text-[#B7E532] hidden lg:inline px-1">
              {resultCount} sorted
            </span>
            <button
              type="button"
              onClick={onReset}
              className="p-1 sm:px-2 sm:py-1 rounded-lg sm:rounded-full bg-white/15 hover:bg-white/25 text-slate-200 hover:text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Reset to default sorting order"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        )}

      </div>
    </aside>
  );
};
