import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Search, 
  BarChart3, 
  ShieldAlert, 
  Sparkles, 
  ArrowUpRight, 
  X, 
  CheckCircle2, 
  Info,
  Layers,
  Globe2
} from 'lucide-react';
import { CountryRegionalInsight, getRegionalInsight } from '../data/regionalInsightsData';

interface RegionalInsightPopoverProps {
  country: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (serviceName: string) => void;
  anchorPosition?: { x: number; y: number } | null;
}

export const RegionalInsightPopover: React.FC<RegionalInsightPopoverProps> = ({
  country,
  isOpen,
  onClose,
  onSelectService,
}) => {
  const insight: CountryRegionalInsight = getRegionalInsight(country);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full bg-slate-900/95 dark:bg-[#07192f]/98 text-slate-100 rounded-2xl border border-lime-500/50 shadow-2xl backdrop-blur-md overflow-hidden z-30"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-lime-950/60 via-slate-900 to-blue-950/60 p-4 border-b border-lime-500/30 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl p-1 bg-slate-800/80 rounded-xl border border-slate-700 shadow-sm shrink-0">
              {insight.countryFlag}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-lime-500 text-slate-950 flex items-center gap-1 shadow-xs">
                  <TrendingUp className="w-3 h-3" />
                  Regional Search Insight
                </span>
                <span className="text-[11px] font-mono text-lime-400 font-bold">
                  {insight.quarterlyGrowth} Growth
                </span>
              </div>
              <h4 className="text-sm font-extrabold text-white mt-1">
                {insight.country} Directory Demand Trends
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close insights popover"
            aria-label="Close insight"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Demand Metrics Ribbon */}
        <div className="grid grid-cols-2 gap-2 px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/80 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
              Monthly Directory Inquiries
            </span>
            <span className="font-extrabold text-white text-xs font-mono">
              ~{insight.totalMonthlySearches.toLocaleString()} inquiries
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase tracking-wider font-semibold">
              Primary SME Sector
            </span>
            <span className="font-semibold text-lime-300 truncate block">
              {insight.primaryIndustryNeed}
            </span>
          </div>
        </div>

        {/* Top 3 Most Requested Services List */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              Top 3 Most Requested Services
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              By verified search volume
            </span>
          </div>

          <div className="space-y-2">
            {insight.topRequestedServices.map((srv, idx) => {
              const rankColors = [
                'bg-lime-500 text-slate-950 ring-lime-400',
                'bg-blue-500 text-white ring-blue-400',
                'bg-amber-500 text-slate-950 ring-amber-400',
              ];

              return (
                <div
                  key={srv.service}
                  className="group relative p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-lime-500/50 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 shadow-xs ring-1 ${rankColors[idx]}`}>
                        #{idx + 1}
                      </span>
                      <div>
                        <span className="font-bold text-xs text-white group-hover:text-lime-300 transition-colors">
                          {srv.service}
                        </span>
                        <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
                          {srv.category}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-lime-400">
                        {srv.sharePercentage}%
                      </span>
                      <span className="text-[10px] text-emerald-400 ml-1 font-mono">
                        ({srv.growthRate})
                      </span>
                    </div>
                  </div>

                  {/* Percentage Progress Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        idx === 0 
                          ? 'bg-gradient-to-r from-lime-500 to-emerald-400' 
                          : idx === 1 
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-400' 
                            : 'bg-gradient-to-r from-amber-500 to-orange-400'
                      }`}
                      style={{ width: `${srv.sharePercentage}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                    <span>~{srv.monthlySearches.toLocaleString()} searches/mo</span>
                    {onSelectService && (
                      <button
                        type="button"
                        onClick={() => onSelectService(srv.service)}
                        className="text-lime-400 hover:text-lime-300 font-semibold flex items-center gap-0.5 hover:underline"
                      >
                        Filter partners
                        <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Key Market Driver Callout */}
          <div className="mt-3 p-2.5 rounded-xl bg-lime-500/10 border border-lime-500/25 flex items-start gap-2 text-[11px] text-slate-300">
            <Info className="w-3.5 h-3.5 text-lime-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Market Regulatory & Tech Catalyst:</strong>
              <span>{insight.keyMarketDriver}</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
          <span>Source: Anonymized MsmeBooks Search Trends</span>
          <span className="flex items-center gap-1 text-slate-400">
            <CheckCircle2 className="w-3 h-3 text-lime-400" />
            Updated Weekly
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
