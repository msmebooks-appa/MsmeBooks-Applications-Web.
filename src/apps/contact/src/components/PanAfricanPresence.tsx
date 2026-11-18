import React, { useState } from 'react';
import { Globe2, Check, ArrowRight, ShieldCheck, Landmark, Coins } from 'lucide-react';
import { PAN_AFRICAN_MARKETS } from '../data/markets';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface PanAfricanPresenceProps {
  onExploreSolutions: () => void;
}

export const PanAfricanPresence: React.FC<PanAfricanPresenceProps> = ({ onExploreSolutions }) => {
  const { currentCurrency, formatAmount } = useCurrency();
  const { tDict } = useLanguage();
  const [selectedMarket, setSelectedMarket] = useState(PAN_AFRICAN_MARKETS[0]);

  // Market coordinates on schematic map (percentage values x, y)
  const pinCoordinates: Record<string, { x: number; y: number }> = {
    Nigeria: { x: 42, y: 46 },
    Ghana: { x: 34, y: 48 },
    Kenya: { x: 67, y: 53 },
    'South Africa': { x: 57, y: 84 },
    Rwanda: { x: 61, y: 56 },
    Uganda: { x: 63, y: 51 },
    Tanzania: { x: 68, y: 60 },
    Egypt: { x: 60, y: 22 },
  };

  return (
    <section id="pan-africa" className="py-16 lg:py-24 bg-white dark:bg-[#0B1120] border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#f0f6ff] dark:bg-blue-950/60 border border-[#cbe0fb] dark:border-blue-900 text-xs font-bold text-[#0B3B82] dark:text-[#93C5FD] uppercase tracking-wider mb-3">
            <Globe2 className="w-3.5 h-3.5 text-[#70C038]" />
            {tDict.presence.badge}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0B3B82] dark:text-white tracking-tight leading-tight">
            {tDict.presence.title}
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {tDict.presence.subtitle}
          </p>
        </div>

        {/* Interactive Map & Market Specification Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#f8fafc] dark:bg-[#0F172A] rounded-2xl p-6 sm:p-8 lg:p-10 border border-slate-200 dark:border-slate-800 transition-colors">
          {/* African Schematic Map with Pins */}
          <div className="lg:col-span-6 relative flex flex-col items-center justify-center">
            <div className="relative w-full max-w-md aspect-[4/4.5] bg-white dark:bg-[#131E35] rounded-xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center overflow-hidden transition-colors">
              {/* Background Map Grid & Outline */}
              <svg
                viewBox="0 0 500 550"
                className="w-full h-full drop-shadow-sm select-none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Simplified Continental Africa Silhouette in Corporate Blue outline */}
                <path
                  d="M170 85 C220 70, 310 70, 360 110 C390 140, 410 180, 420 220 C420 250, 370 280, 360 310 C350 350, 350 390, 330 430 C300 480, 270 510, 250 510 C230 500, 220 460, 200 420 C180 390, 160 360, 150 330 C130 280, 110 240, 120 200 C125 170, 140 120, 170 85 Z"
                  className="fill-[#f0f6ff] dark:fill-[#0B182F] stroke-[#0B3B82] dark:stroke-[#3B82F6]"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                />
                {/* Horn of Africa flourish */}
                <path
                  d="M360 210 Q420 230 440 250 Q410 280 370 270"
                  className="fill-[#f0f6ff] dark:fill-[#0B182F] stroke-[#0B3B82] dark:stroke-[#3B82F6]"
                  strokeWidth="2"
                />
                {/* Madagascar */}
                <path
                  d="M400 370 Q420 420 390 460 Q380 430 400 370"
                  className="fill-[#f2f9eb] dark:fill-[#12230D] stroke-[#70C038]"
                  strokeWidth="1.5"
                />

                {/* Country Pins */}
                {PAN_AFRICAN_MARKETS.map((m) => {
                  const coords = pinCoordinates[m.country] || { x: 50, y: 50 };
                  const isSelected = selectedMarket.country === m.country;
                  const pixelX = (coords.x / 100) * 500;
                  const pixelY = (coords.y / 100) * 550;

                  return (
                    <g
                      key={m.country}
                      className="cursor-pointer transition-transform hover:scale-110"
                      onClick={() => setSelectedMarket(m)}
                    >
                      {/* Pulse Circle for Selected */}
                      {isSelected && (
                        <circle
                          cx={pixelX}
                          cy={pixelY}
                          r="16"
                          fill="#70C038"
                          fillOpacity="0.25"
                          className="animate-ping origin-center"
                        />
                      )}
                      {/* Base Pin Circle */}
                      <circle
                        cx={pixelX}
                        cy={pixelY}
                        r={isSelected ? '9' : '6.5'}
                        fill={isSelected ? '#70C038' : '#0B3B82'}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      {/* Text Label on Map */}
                      <text
                        x={pixelX + 11}
                        y={pixelY + 4}
                        fill={isSelected ? '#70C038' : '#94A3B8'}
                        fontSize="11"
                        fontWeight={isSelected ? '800' : '600'}
                        fontFamily="Plus Jakarta Sans, sans-serif"
                      >
                        {m.country}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div className="absolute bottom-3 left-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Click pin to inspect regional features & tax compliance
              </div>
            </div>

            {/* Quick Country Pill Selector */}
            <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
              {PAN_AFRICAN_MARKETS.map((m) => (
                <button
                  key={m.country}
                  onClick={() => setSelectedMarket(m)}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all ${
                    selectedMarket.country === m.country
                      ? 'bg-[#0B3B82] text-white shadow-xs'
                      : 'bg-white dark:bg-[#131E35] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {m.country}
                </button>
              ))}
            </div>
          </div>

          {/* Market Details & Capabilities Card */}
          <div className="lg:col-span-6 bg-white dark:bg-[#131E35] rounded-xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between transition-colors">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-[11px] font-bold text-[#70C038] uppercase tracking-wider block">
                    {selectedMarket.hub}
                  </span>
                  <h3 className="text-2xl font-extrabold text-[#0B3B82] dark:text-white">
                    {selectedMarket.country}
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-xl bg-[#f0f6ff] dark:bg-blue-950/60 border border-[#cbe0fb] dark:border-blue-900 flex flex-col items-center justify-center font-bold text-[#0B3B82] dark:text-[#93C5FD]">
                  <span className="text-sm">{selectedMarket.currencySymbol}</span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">
                    {selectedMarket.currency.slice(-4, -1)}
                  </span>
                </div>
              </div>

              <p className="mt-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedMarket.description}
              </p>

              <div className="mt-6 space-y-3">
                <div className="p-3.5 bg-slate-50 dark:bg-[#0B1120] rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-white mb-1">
                    <Landmark className="w-4 h-4 text-[#0B3B82] dark:text-[#93C5FD]" />
                    <span>Fiscal & Tax Compliance Standard</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{selectedMarket.taxCompliance}</p>
                </div>

                <div className="p-3.5 bg-[#f2f9eb] dark:bg-lime-950/40 rounded-lg border border-[#d2edaa] dark:border-lime-900">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#3d701a] dark:text-[#a1e670] mb-1">
                    <ShieldCheck className="w-4 h-4 text-[#70C038]" />
                    <span>Specialized Operational Focus</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-200 font-medium">
                    {selectedMarket.specialization}
                  </p>
                </div>

                {/* Global Currency Conversion Strip for This Market */}
                <div className="p-3 bg-white dark:bg-[#0B1120] rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Starter SME Cloud Plan:</span>
                    <span className="font-mono font-bold text-[#0B3B82] dark:text-[#93C5FD] tabular-nums">
                      {formatAmount(29)}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Enterprise Multi-Branch:</span>
                    <span className="font-mono font-bold text-[#3d701a] dark:text-[#a1e670] tabular-nums">
                      {formatAmount(129)}/mo
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
                    <span>Active Display Currency:</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {currentCurrency.flag} {currentCurrency.code} ({currentCurrency.name})
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Local Payment Gateways</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Dual Currency Ledgers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Multi-Warehouse Transfers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#70C038] shrink-0" />
                  <span>Offline POS Resilience</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onExploreSolutions}
                className="w-full py-3 px-5 rounded-lg text-xs font-bold text-white bg-[#0B3B82] hover:bg-[#082d64] dark:bg-[#1D4ED8] dark:hover:bg-[#1E40AF] transition-all flex items-center justify-center gap-2"
              >
                <span>Explore MsmeBooks Solutions</span>
                <ArrowRight className="w-4 h-4 text-[#70C038]" />
              </button>
            </div>
          </div>
        </div>

        {/* Supporting Photography Grid (4 African Business Scenarios as requested) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Nigerian Retail Entrepreneur using POS (from generated assets) */}
          <div className="bg-white dark:bg-[#131E35] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs group hover:shadow-md transition-all">
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/african_retailer_pos_1792327889659.jpg"
                alt="Nigerian retail entrepreneur using modern POS system in a boutique"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#0B3B82] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Nigeria · Retail POS
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-[#0B3B82] dark:text-white mb-1">
                Retail & Supermarkets
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                Barcode scanning, receipting, and instant payment sync with avg. terminal volume of{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums">
                  {formatAmount(1850)}/day
                </span>.
              </p>
            </div>
          </div>

          {/* Card 2: Kenyan Businesswoman */}
          <div className="bg-white dark:bg-[#131E35] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs group hover:shadow-md transition-all">
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/support_african_specialist_1792327888097.jpg"
                alt="Kenyan businesswoman reviewing financial reports on a laptop"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#0B3B82] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Kenya · Financial Clarity
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-[#0B3B82] dark:text-white mb-1">
                Executive Reporting
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                Real-time cash flow statements monitoring over{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums">
                  {formatAmount(42000)}/mo
                </span>{' '}
                in reconciled mobile money & bank transfers.
              </p>
            </div>
          </div>

          {/* Card 3: Ghanaian Cloud Accounting */}
          <div className="bg-white dark:bg-[#131E35] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs group hover:shadow-md transition-all">
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/hero_african_tech_team_1792327888460.jpg"
                alt="Ghanaian accountant working with cloud accounting software"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#0B3B82] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Ghana · Accounting Firms
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-[#0B3B82] dark:text-white mb-1">
                Cloud Bookkeeping
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                Automated ledgers and tax audit filing generating average savings of{' '}
                <span className="font-semibold text-[#3d701a] dark:text-[#a1e670] font-mono tabular-nums">
                  +{formatAmount(8500)}/yr
                </span>{' '}
                for regional accounting practices.
              </p>
            </div>
          </div>

          {/* Card 4: South African SME Team */}
          <div className="bg-white dark:bg-[#131E35] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs group hover:shadow-md transition-all">
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/african_executives_partnership_1792327888590.jpg"
                alt="South African SME team collaborating in modern office"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-[#0B3B82] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                South Africa · Enterprise Growth
              </div>
            </div>
            <div className="p-4">
              <h4 className="text-sm font-bold text-[#0B3B82] dark:text-white mb-1">
                Multi-Branch Scale
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal">
                Multi-warehouse inventory routing tracking over{' '}
                <span className="font-semibold text-slate-800 dark:text-slate-100 font-mono tabular-nums">
                  {formatAmount(1200000, { compact: true })}
                </span>{' '}
                in consolidated inventory assets across locations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
