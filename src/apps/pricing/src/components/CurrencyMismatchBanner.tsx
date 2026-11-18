import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ArrowRight,
  X,
  Check,
  Globe,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Currency } from '../types';
import { SUPPORTED_CURRENCIES } from '../utils/currency';
import {
  detectIpLocation,
  IpLocationData,
  setSimulatedLocation,
} from '../services/ipLocationService';

interface CurrencyMismatchBannerProps {
  currentCurrency: Currency;
  onCurrencyChange: (currency: Currency) => void;
}

const DISMISSED_STORAGE_KEY = 'msmebooks_dismissed_currency_banner';

const TEST_LOCATIONS = [
  { code: 'GB', name: 'United Kingdom', currency: 'GBP', flag: '🇬🇧' },
  { code: 'KE', name: 'Kenya', currency: 'KES', flag: '🇰🇪' },
  { code: 'GH', name: 'Ghana', currency: 'GHS', flag: '🇬🇭' },
  { code: 'ZA', name: 'South Africa', currency: 'ZAR', flag: '🇿🇦' },
  { code: 'US', name: 'United States', currency: 'USD', flag: '🇺🇸' },
  { code: 'CA', name: 'Canada', currency: 'CAD', flag: '🇨🇦' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
];

export const CurrencyMismatchBanner: React.FC<CurrencyMismatchBannerProps> = ({
  currentCurrency,
  onCurrencyChange,
}) => {
  const [detectedData, setDetectedData] = useState<IpLocationData | null>(null);
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISSED_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [isSwitching, setIsSwitching] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  // Run IP location detection on mount
  useEffect(() => {
    let isMounted = true;
    detectIpLocation().then((data) => {
      if (isMounted) {
        setDetectedData(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // When currency changes, check if it now matches detected currency
  useEffect(() => {
    if (detectedData && detectedData.currency === currentCurrency) {
      // Already matching, no banner needed
    }
  }, [currentCurrency, detectedData]);

  const handleDismiss = () => {
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
  };

  const handleSwitchCurrency = () => {
    if (!detectedData) return;
    setIsSwitching(true);
    onCurrencyChange(detectedData.currency);

    // Auto dismiss after switching
    setTimeout(() => {
      setIsDismissed(true);
      try {
        sessionStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
      } catch {
        // Ignore
      }
      setIsSwitching(false);
    }, 400);
  };

  const handleSimulateCountry = async (countryCode: string) => {
    setSimulatedLocation(countryCode);
    setIsDismissed(false);
    try {
      sessionStorage.removeItem(DISMISSED_STORAGE_KEY);
    } catch {
      // Ignore
    }
    const freshData = await detectIpLocation();
    setDetectedData(freshData);
    setShowSimulator(false);
  };

  // Do not render if not yet detected, dismissed, or if the detected currency is already active
  if (!detectedData) return null;
  if (isDismissed) return null;
  if (detectedData.currency === currentCurrency) return null;

  const detectedCurrencyInfo =
    SUPPORTED_CURRENCIES[detectedData.currency] || SUPPORTED_CURRENCIES.USD;
  const currentCurrencyInfo =
    SUPPORTED_CURRENCIES[currentCurrency] || SUPPORTED_CURRENCIES.NGN;

  return (
    <div
      role="region"
      aria-label="Currency detection suggestion"
      className="relative bg-gradient-to-r from-[#0B1E38] via-[#0D2648] to-[#0A1A2E] text-white border-b border-blue-500/30 py-2.5 px-4 sm:px-6 shadow-md transition-all duration-300 z-40 animate-in slide-in-from-top-2"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Left message with location pill */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center md:justify-start">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 font-bold text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-lime-400 animate-bounce" />
            <span>{detectedData.flag} {detectedData.country}</span>
            {detectedData.city && <span className="opacity-75 font-normal">({detectedData.city})</span>}
          </span>

          <p className="text-slate-200 leading-tight text-center md:text-left">
            We noticed you are visiting from <strong>{detectedData.country}</strong>. Currently viewing prices in{' '}
            <span className="font-bold text-slate-300">{currentCurrencyInfo.name} ({currentCurrencyInfo.code})</span>.
            Would you like to switch to{' '}
            <span className="font-extrabold text-lime-400 underline decoration-lime-400/40 underline-offset-2">
              {detectedCurrencyInfo.name} ({detectedCurrencyInfo.symbol.trim()})
            </span>
            ?
          </p>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {/* One-Click Switch Button */}
          <button
            type="button"
            onClick={handleSwitchCurrency}
            disabled={isSwitching}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#84CC16] hover:bg-lime-500 text-slate-950 font-black text-xs shadow-sm hover:shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            title={`Switch site pricing to ${detectedData.currency}`}
          >
            {isSwitching ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            )}
            <span>Switch to {detectedData.currency} ({detectedCurrencyInfo.symbol.trim()})</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          {/* Keep Current / Dismiss */}
          <button
            type="button"
            onClick={handleDismiss}
            className="px-2.5 py-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors font-semibold text-xs cursor-pointer"
            title="Keep current currency and close banner"
          >
            Keep {currentCurrency}
          </button>

          {/* Test/Simulate Country Location */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSimulator(!showSimulator)}
              className="text-[10px] text-blue-300 hover:text-white underline decoration-dotted px-1.5 py-1 cursor-pointer"
              title="Test banner with different simulated visitor locations"
            >
              Test country
            </button>
            {showSimulator && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-150">
                <div className="text-[10px] font-bold text-slate-400 mb-1 px-1 uppercase tracking-wider">
                  Simulate visitor IP:
                </div>
                <div className="space-y-1">
                  {TEST_LOCATIONS.map((loc) => (
                    <button
                      key={loc.code}
                      type="button"
                      onClick={() => handleSimulateCountry(loc.code)}
                      className={`w-full text-left px-2 py-1 rounded-md flex items-center justify-between text-xs hover:bg-slate-800 cursor-pointer ${
                        detectedData.countryCode === loc.code ? 'bg-blue-900/60 font-bold text-white' : 'text-slate-300'
                      }`}
                    >
                      <span>{loc.flag} {loc.name}</span>
                      <span className="font-mono text-lime-400 font-bold text-[10px]">{loc.currency}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            type="button"
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
