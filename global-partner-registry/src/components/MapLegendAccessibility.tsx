import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Volume2, 
  Eye, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Info, 
  Compass,
  Star,
  Building,
  LocateFixed,
  Flame,
  CheckCircle2
} from 'lucide-react';

export interface MapTierSymbolInfo {
  tier: string;
  symbol: string;
  shapeDescription: string;
  colorName: string;
  hexCode: string;
  wcagContrast: string;
  description: string;
  criteria: string;
}

export const PARTNER_TIER_SYMBOLS: MapTierSymbolInfo[] = [
  {
    tier: 'Platinum Partner',
    symbol: '◆',
    shapeDescription: 'Diamond symbol with double violet glow halo',
    colorName: 'Royal Purple / Violet',
    hexCode: '#c084fc',
    wcagContrast: '7.2:1 (AAA accessible on dark canvas)',
    description: 'Premier elite tier with multi-country deployment capability, 5-star rating, and dedicated technical architects.',
    criteria: '15+ certified staff, 50+ successful implementations, verified regulatory compliance.',
  },
  {
    tier: 'Gold Partner',
    symbol: '★',
    shapeDescription: 'Five-pointed star within amber concentric gold ring',
    colorName: 'Warm Amber / Gold',
    hexCode: '#fbbf24',
    wcagContrast: '8.4:1 (AAA accessible on dark canvas)',
    description: 'Senior certified audit and accounting advisors specializing in complex ERP and tax compliance.',
    criteria: '8+ certified advisors, 4.8+ client satisfaction rating, annual audit validation.',
  },
  {
    tier: 'Silver Partner',
    symbol: '●',
    shapeDescription: 'Solid circular dot within sky-blue beacon ring',
    colorName: 'Sky Blue / Cyan',
    hexCode: '#38bdf8',
    wcagContrast: '6.9:1 (AA accessible on dark canvas)',
    description: 'Certified practitioners providing SME accounting, bookkeeping, and payroll implementation.',
    criteria: '3+ certified staff, validated client references, passed MsmeBooks proficiency exam.',
  },
  {
    tier: 'Verified Certified Badge',
    symbol: '✓',
    shapeDescription: 'Emerald shield badge with white checkmark',
    colorName: 'Emerald Green',
    hexCode: '#34d399',
    wcagContrast: '8.1:1 (AAA accessible on dark canvas)',
    description: 'Active verification seal confirming business registration, identity checks, and professional insurance.',
    criteria: 'Identity, CAC/Companies House validation, and active professional indemnity insurance.',
  },
  {
    tier: 'Country Trade Hub',
    symbol: '◎',
    shapeDescription: 'Dual concentric pulsating rings with partner count numeral',
    colorName: 'Deep Cobalt / Cyan',
    hexCode: '#0284c7',
    wcagContrast: '6.5:1 (AA accessible on dark canvas)',
    description: 'Regional metropolitan commercial hub aggregating multiple partner practices in a single country.',
    criteria: 'National capital or major financial center with verified partner presence.',
  },
  {
    tier: 'Underserved Opportunity',
    symbol: '▲',
    shapeDescription: 'Warning triangle beacon with radiant amber-coral pulse',
    colorName: 'Deep Coral / Flame Orange',
    hexCode: '#f97316',
    wcagContrast: '5.8:1 (AA accessible on dark canvas)',
    description: 'High-growth market with surging client demand but fewer than 3 verified partners—prime for expansion.',
    criteria: 'High monthly inquiry volume with low partner density ratio.',
  },
];

interface MapLegendAccessibilityProps {
  onAnnounce: (msg: string) => void;
  selectedTierFilter?: string | null;
  onSelectTierFilter?: (tier: string | null) => void;
  highContrastMode?: boolean;
}

export const MapLegendAccessibility: React.FC<MapLegendAccessibilityProps> = ({
  onAnnounce,
  selectedTierFilter,
  onSelectTierFilter,
  highContrastMode = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'visual' | 'screen-reader'>('visual');

  const handleReadLegendOutLoud = () => {
    const text = PARTNER_TIER_SYMBOLS.map(
      (item) => `${item.tier}: Represented by ${item.shapeDescription} in ${item.colorName}. ${item.description}`
    ).join(' ');
    onAnnounce(`Map Legend Guide: ${text}`);
  };

  return (
    <div 
      id="map-legend-accessibility-container"
      role="region"
      aria-label="Map Marker Legend and Partner Tier Symbol Guide"
      className="bg-slate-900/95 dark:bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden transition-all text-slate-200"
    >
      {/* Legend Header with Collapse & Screen Reader Quick Buttons */}
      <div className="p-3 sm:p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-lime-500/10 border border-lime-500/30 text-lime-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-2">
              <span>Partner Tiers & Marker Symbols</span>
              {highContrastMode && (
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-yellow-400 text-slate-950 font-black">
                  High Contrast Active
                </span>
              )}
            </h4>
            <p className="text-[11px] text-slate-400">
              Symbols, color codes, and verification tiers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Read Aloud Button for Accessibility */}
          <button
            type="button"
            id="btn-announce-legend-rules"
            data-testid="btn-announce-legend-rules"
            onClick={handleReadLegendOutLoud}
            className="p-1.5 rounded-lg text-slate-400 hover:text-lime-400 hover:bg-slate-800 transition-colors"
            title="Read tier symbols and color-coding rules aloud via screen reader"
            aria-label="Read Map Legend out loud via screen reader"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            id="btn-toggle-legend-drawer"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Collapse tier symbol legend" : "Expand tier symbol legend"}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick compact pill preview when collapsed */}
      {!isOpen && (
        <div className="p-2.5 sm:px-4 flex items-center justify-between gap-2 overflow-x-auto text-[11px]">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1">
              <span className="text-purple-400 font-black text-sm">◆</span>
              <span className="text-slate-300 font-semibold">Platinum</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-black text-sm">★</span>
              <span className="text-slate-300 font-semibold">Gold</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sky-400 font-black text-sm">●</span>
              <span className="text-slate-300 font-semibold">Silver</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-emerald-400 font-black text-sm">✓</span>
              <span className="text-slate-300 font-semibold">Verified</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="text-[11px] text-lime-400 hover:underline shrink-0 font-medium"
          >
            Details & Criteria →
          </button>
        </div>
      )}

      {/* Expanded Comprehensive Screen-Reader Friendly Legend Content */}
      {isOpen && (
        <div className="p-4 space-y-4 max-h-[380px] overflow-y-auto">
          
          {/* Segmented View Mode Tabs: Visual Cards vs Screen-Reader Semantic List */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('visual')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'visual' ? 'bg-slate-800 text-lime-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Visual Symbols
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('screen-reader')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                activeTab === 'screen-reader' ? 'bg-slate-800 text-sky-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Screen Reader Description List &lt;dl&gt;
            </button>
          </div>

          {activeTab === 'visual' ? (
            <div className="space-y-3">
              {PARTNER_TIER_SYMBOLS.map((item, idx) => {
                const isSelected = selectedTierFilter === item.tier;
                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-slate-800/90 border-lime-400 shadow-lg' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Distinctive Visual Glyph Container */}
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-inner font-black text-lg"
                          style={{
                            backgroundColor: `${item.hexCode}20`,
                            borderColor: item.hexCode,
                            borderWidth: '1.5px',
                            color: item.hexCode,
                          }}
                          aria-hidden="true"
                        >
                          {item.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs sm:text-sm text-white">
                              {item.tier}
                            </span>
                            <span 
                              className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                              style={{ color: item.hexCode, backgroundColor: `${item.hexCode}15` }}
                            >
                              {item.hexCode}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="mt-1.5 text-[11px] text-slate-400 flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400">Shape:</span>
                            <span>{item.shapeDescription}</span>
                          </div>
                          <div className="mt-0.5 text-[10.5px] text-slate-400 flex items-center gap-1.5">
                            <span className="font-semibold text-slate-400">WCAG AA:</span>
                            <span className="text-emerald-400 font-mono">{item.wcagContrast}</span>
                          </div>
                        </div>
                      </div>

                      {onSelectTierFilter && (
                        <button
                          type="button"
                          onClick={() => onSelectTierFilter(isSelected ? null : item.tier)}
                          className={`shrink-0 px-2 py-1 rounded-lg text-[10.5px] font-bold transition-colors ${
                            isSelected 
                              ? 'bg-lime-500 text-slate-950' 
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                          aria-pressed={isSelected}
                        >
                          {isSelected ? 'Filtered' : 'Filter Pins'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Semantic HTML Description List for Screen Readers */
            <dl className="space-y-4 text-xs text-slate-300" aria-label="Semantic Partner Tier Glossary">
              {PARTNER_TIER_SYMBOLS.map((item, idx) => (
                <div key={idx} className="pb-3 border-b border-slate-800/80">
                  <dt className="font-black text-sm text-white flex items-center gap-2">
                    <span aria-hidden="true" style={{ color: item.hexCode }}>{item.symbol}</span>
                    <span>{item.tier}</span>
                    <span className="text-[11px] font-normal text-slate-400">({item.colorName})</span>
                  </dt>
                  <dd className="mt-1 space-y-1 text-slate-300 text-xs">
                    <p><strong className="text-slate-200">Visual Symbol:</strong> {item.shapeDescription}</p>
                    <p><strong className="text-slate-200">Role & Capabilities:</strong> {item.description}</p>
                    <p><strong className="text-slate-200">Verification Criteria:</strong> {item.criteria}</p>
                    <p><strong className="text-slate-200">Color & Contrast:</strong> {item.hexCode} — {item.wcagContrast}</p>
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Accessibility Tips Callout */}
          <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block">Keyboard Navigation Tip</span>
              Use the <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-lime-400">←</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-lime-400">→</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-lime-400">↑</kbd> <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-lime-400">↓</kbd> arrow keys to jump directly between partner pins on the map canvas. Audio cues announce location and verification status automatically.
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
