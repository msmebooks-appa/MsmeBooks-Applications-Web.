import React, { useState } from 'react';
import {
  MapPin,
  Coins,
  ChevronDown,
  Sparkles,
  Globe2,
  Check,
  RotateCcw,
  SlidersHorizontal,
  Info,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { COUNTRIES_LIST } from '../data/partnersData';
import { setUserLocationPreference } from '../utils/userLocation';

interface LocationPricingBannerProps {
  className?: string;
  onFilterCountrySelect?: (country: string) => void;
}

export const LocationPricingBanner: React.FC<LocationPricingBannerProps> = ({
  className = '',
  onFilterCountrySelect,
}) => {
  const {
    currency,
    currentCurrency,
    detectedLocation,
    geographicProfile,
    useRegionalParity,
    setUseRegionalParity,
    autoLocationSync,
    setAutoLocationSync,
    syncWithLocation,
    formatAmount,
    isLocationAdjusted,
  } = useCurrency();

  const [isOpen, setIsOpen] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const sampleHourlyUSD = 60;
  const sampleSetupUSD = 400;

  const popularCountries = [
    { country: 'Nigeria', code: 'NG', flag: '🇳🇬', city: 'Lagos', currency: 'NGN' },
    { country: 'Kenya', code: 'KE', flag: '🇰🇪', city: 'Nairobi', currency: 'KES' },
    { country: 'South Africa', code: 'ZA', flag: '🇿🇦', city: 'Johannesburg', currency: 'ZAR' },
    { country: 'Ghana', code: 'GH', flag: '🇬🇭', city: 'Accra', currency: 'GHS' },
    { country: 'Rwanda', code: 'RW', flag: '🇷🇼', city: 'Kigali', currency: 'RWF' },
    { country: 'Egypt', code: 'EG', flag: '🇪🇬', city: 'Cairo', currency: 'EGP' },
    { country: 'United Kingdom', code: 'GB', flag: '🇬🇧', city: 'London', currency: 'GBP' },
    { country: 'United States', code: 'US', flag: '🇺🇸', city: 'New York', currency: 'USD' },
    { country: 'Canada', code: 'CA', flag: '🇨🇦', city: 'Toronto', currency: 'CAD' },
    { country: 'UAE', code: 'AE', flag: '🇦🇪', city: 'Dubai', currency: 'AED' },
  ];

  const handleSelectCountry = (item: { country: string; code: string; flag: string; city: string }) => {
    setUserLocationPreference({
      country: item.country,
      city: item.city,
      countryFlag: item.flag,
      countryCode: item.code,
    });
    syncWithLocation({
      country: item.country,
      city: item.city,
      countryCode: item.code,
    });
    if (onFilterCountrySelect) {
      onFilterCountrySelect(item.country);
    }
    setIsOpen(false);
  };

  const parityPercent = Math.round((geographicProfile.parityMultiplier - 1) * 100);

  return (
    <div
      id="location-pricing-banner"
      data-testid="location-pricing-banner"
      className={`rounded-2xl border transition-all ${
        isLocationAdjusted
          ? 'bg-gradient-to-r from-slate-900 via-[#0a1c35] to-[#071d2b] border-lime-500/30 shadow-md text-white'
          : 'bg-slate-900 border-slate-800 text-white'
      } p-3 sm:p-4 ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Location context and live rate notice */}
        <div className="flex items-start sm:items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-lime-500/15 border border-lime-500/30 text-lime-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 shadow-inner">
            <MapPin className="w-5 h-5 text-lime-400" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-extrabold text-white flex items-center gap-1.5">
                <span>Location-Aware Pricing Active:</span>
                <span className="text-lime-400 font-black">
                  {detectedLocation.countryFlag} {detectedLocation.country}
                </span>
              </span>

              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Adjusted in {currentCurrency.code} ({currentCurrency.symbol})</span>
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-1.5">
              <span>{geographicProfile.regionName}</span>
              <span className="text-slate-500">•</span>
              <span>
                {useRegionalParity && parityPercent !== 0 ? (
                  <span className="text-lime-300 font-semibold inline-flex items-center gap-0.5">
                    <TrendingDown className="w-3 h-3 inline" />
                    <span>
                      {parityPercent < 0 ? `${Math.abs(parityPercent)}% local SME economic parity discount applied` : `+${parityPercent}% global tier`}
                    </span>
                  </span>
                ) : (
                  <span>Standard nominal exchange conversion</span>
                )}
              </span>
            </p>
          </div>
        </div>

        {/* Right: Controls & Interactive Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
          {/* Change Location Picker Button */}
          <div className="relative">
            <button
              type="button"
              id="btn-location-pricing-change-country"
              data-testid="btn-location-pricing-change-country"
              onClick={() => setIsOpen(!isOpen)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <span>{detectedLocation.countryFlag}</span>
              <span className="truncate max-w-[100px] sm:max-w-none">{detectedLocation.country}</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Country Switcher Dropdown */}
            {isOpen && (
              <div
                id="location-pricing-dropdown"
                className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
              >
                <div className="px-2 py-1.5 border-b border-slate-800 mb-2">
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>Select Client Geography</span>
                    <span className="text-[10px] text-lime-400 font-mono">Auto-Adjusts Rates</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    Adjusts partner hourly rates and service packages based on local purchasing index.
                  </p>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1">
                  {popularCountries.map((c) => {
                    const isSelected = detectedLocation.country.toLowerCase() === c.country.toLowerCase();
                    return (
                      <button
                        key={c.country}
                        type="button"
                        onClick={() => handleSelectCountry(c)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-lime-500 text-slate-950 font-black shadow-sm'
                            : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{c.flag}</span>
                          <span className="font-semibold">{c.country}</span>
                        </div>
                        <span
                          className={`font-mono text-[10.5px] font-bold ${
                            isSelected ? 'text-slate-950' : 'text-lime-400'
                          }`}
                        >
                          {c.currency}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 px-1 flex items-center justify-between text-[11px] text-slate-400">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoLocationSync}
                      onChange={(e) => setAutoLocationSync(e.target.checked)}
                      className="rounded text-lime-500 focus:ring-lime-400 accent-lime-500 w-3 h-3"
                    />
                    <span>Auto-sync currency</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={useRegionalParity}
                      onChange={(e) => setUseRegionalParity(e.target.checked)}
                      className="rounded text-lime-500 focus:ring-lime-400 accent-lime-500 w-3 h-3"
                    />
                    <span>PPP Parity</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Why Location-Aware? Info Button */}
          <button
            type="button"
            id="btn-location-pricing-info"
            data-testid="btn-location-pricing-info"
            onClick={() => setShowInfoModal(!showInfoModal)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
            title="How Location-Aware Pricing works"
          >
            <Info className="w-4 h-4 text-lime-400" />
          </button>
        </div>
      </div>

      {/* Expandable Explanation Drawer */}
      {showInfoModal && (
        <div className="mt-3 pt-3 border-t border-slate-800 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-lime-400 block mb-1">1. Automatic Geography Detection</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                We detect your market geography (via timezone / selection) and match the native currency ({currentCurrency.code}).
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-amber-400 block mb-1">2. Local Purchasing Parity</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                SME consultation rates & setups are adjusted to domestic market benchmarks ({Math.round(geographicProfile.parityMultiplier * 100)}% economic index) so local firms avoid inflated international premiums.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span className="font-bold text-sky-400 block mb-1">3. In-Country Partner Synergy</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                When hiring a partner in your same country, cross-border forex fees are eliminated and domestic collaboration efficiency is prioritized.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
