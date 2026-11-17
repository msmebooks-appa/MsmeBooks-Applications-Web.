import React, { useState } from 'react';
import { X, Globe, Plus, Check, Sparkles, AlertCircle, Coins, ArrowRight } from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { CurrencyConfig } from '../types/currency';

interface AddCountryCurrencyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddCountryCurrencyModal: React.FC<AddCountryCurrencyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { addCustomCurrency, setCurrency } = useCurrency();

  const [country, setCountry] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [ratePerUSD, setRatePerUSD] = useState('');
  const [region, setRegion] = useState<'Africa' | 'Americas' | 'Europe' | 'Asia' | 'Middle East' | 'Oceania' | 'Global'>('Africa');
  const [flag, setFlag] = useState('🌐');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset suggestions for rapid country adding
  const quickCountryPresets = [
    { country: 'Barbados', code: 'BBD', symbol: 'Bds$', name: 'Barbadian Dollar', flag: '🇧🇧', rate: 2.0, region: 'Americas' as const },
    { country: 'Belize', code: 'BZD', symbol: 'BZ$', name: 'Belize Dollar', flag: '🇧🇿', rate: 2.0, region: 'Americas' as const },
    { country: 'Grenada', code: 'XCD', symbol: 'EC$', name: 'East Caribbean Dollar', flag: '🇬🇩', rate: 2.7, region: 'Americas' as const },
    { country: 'Monaco', code: 'EUR', symbol: '€', name: 'Euro (Monaco)', flag: '🇲🇨', rate: 0.92, region: 'Europe' as const },
    { country: 'Bermuda', code: 'BMD', symbol: '$', name: 'Bermudian Dollar', flag: '🇧🇲', rate: 1.0, region: 'Americas' as const },
    { country: 'Seychelles', code: 'SCR', symbol: 'SR', name: 'Seychellois Rupee', flag: '🇸🇨', rate: 13.5, region: 'Africa' as const },
  ];

  const handleApplyPreset = (preset: typeof quickCountryPresets[0]) => {
    setCountry(preset.country);
    setCode(preset.code);
    setName(preset.name);
    setSymbol(preset.symbol);
    setRatePerUSD(preset.rate.toString());
    setRegion(preset.region);
    setFlag(preset.flag);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCode = code.trim().toUpperCase();
    const cleanCountry = country.trim();
    const cleanName = name.trim() || `${cleanCountry} Currency`;
    const cleanSymbol = symbol.trim() || cleanCode;
    const rateNum = parseFloat(ratePerUSD);

    if (!cleanCountry) {
      setError('Please provide a Country Name.');
      return;
    }
    if (!cleanCode || cleanCode.length < 2 || cleanCode.length > 5) {
      setError('Currency Code must be 2 to 5 characters (e.g. BBD, NGN, USD).');
      return;
    }
    if (isNaN(rateNum) || rateNum <= 0) {
      setError('Please provide a valid positive exchange rate per 1 USD (e.g. 1550, 1.0, 2.7).');
      return;
    }

    const newConfig: CurrencyConfig = {
      code: cleanCode,
      symbol: cleanSymbol,
      name: cleanName,
      country: cleanCountry,
      region,
      ratePerUSD: rateNum,
      flag: flag.trim() || '🌐',
      fractionDigits: rateNum > 100 ? 0 : 2,
    };

    addCustomCurrency(newConfig);
    setSuccessMsg(`Successfully added ${cleanCountry} (${cleanCode} ${cleanSymbol}) and set as active billing currency!`);

    setTimeout(() => {
      onClose();
      setSuccessMsg(null);
    }, 1200);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/65 backdrop-blur-sm flex justify-center items-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white dark:bg-[#131D35] rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden my-auto flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#14243A] via-[#1B3050] to-[#0066CC] dark:from-[#091122] dark:via-[#131E3D] dark:to-[#0A4585] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[#B5E61D] shrink-0">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#B5E61D]">
                Global Currency Expansion
              </span>
              <h2 className="text-lg font-extrabold text-white leading-tight">
                Add Any Country & Currency
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
            aria-label="Close add country modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-5 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          {/* Quick presets */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5 uppercase tracking-wider">
              Quick Country Presets:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {quickCountryPresets.map((p) => (
                <button
                  key={p.country}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#1A284A] hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-300 font-semibold text-[11px] border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                >
                  {p.flag} {p.country} ({p.code})
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold animate-in fade-in">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Country Name *
                </label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Barbados, Monaco, Fiji"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Currency Code (ISO) *
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. BBD, NGN, EUR"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] uppercase font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Currency Symbol *
                </label>
                <input
                  type="text"
                  required
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g. ₦, $, €, £"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Country Flag Emoji
                </label>
                <input
                  type="text"
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  placeholder="e.g. 🇧🇧, 🇳🇬, 🇬🇭"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] text-center"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Global Region
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
                >
                  <option value="Africa">Africa</option>
                  <option value="Americas">Americas</option>
                  <option value="Europe">Europe</option>
                  <option value="Middle East">Middle East</option>
                  <option value="Asia">Asia</option>
                  <option value="Oceania">Oceania</option>
                  <option value="Global">Global</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Currency Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Barbadian Dollar, Central African Franc"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Exchange Rate (Units per 1 USD) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  min="0.0001"
                  required
                  value={ratePerUSD}
                  onChange={(e) => setRatePerUSD(e.target.value)}
                  placeholder="e.g. 1550 for NGN, 2.0 for BBD, 0.92 for EUR"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0D1527] text-slate-900 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-[#0066CC] font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Tip: If 1 USD = 1,550 local units, enter 1550. If 1 USD = 0.92 units, enter 0.92.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#0066CC] hover:bg-[#0052A3] text-white rounded-xl font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Country & Set Active</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
