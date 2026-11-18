import React from 'react';
import {
  Smartphone,
  Download,
  WifiOff,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  CreditCard,
  QrCode,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface MobileExperienceProps {
  onOpenStartFree: () => void;
}

export const MobileExperience: React.FC<MobileExperienceProps> = ({ onOpenStartFree }) => {
  const { formatAmount } = useCurrency();
  return (
    <section className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#090E1A] border-b border-slate-200/70 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile-First Pan-African Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Your Business. In Your Pocket.
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Manage your business from anywhere, anytime. Whether you are at a supplier warehouse, traveling between branches, or resting at home, stay in absolute control.
          </p>
        </div>

        {/* 3 Smartphones Mockup Display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto mb-12">
          {/* Phone 1: Dashboard */}
          <div className="bg-slate-950 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 flex flex-col justify-between">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Screen Content: Live Mobile Dashboard */}
            <div className="bg-slate-900 rounded-[26px] p-4 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Executive App</span>
                <span className="text-[#B7F000] text-[10px] font-bold">● ONLINE</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Today's Sales</span>
                <div className="text-xl font-black text-white font-mono mt-0.5">{formatAmount(485200)}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-1">+18.2% vs yesterday</div>
              </div>

              <div className="p-2.5 bg-slate-800/60 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Cash in Drawers</span>
                  <span className="font-bold text-white">{formatAmount(142000)}</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Mobile Money / POS</span>
                  <span className="font-bold text-[#B7F000]">{formatAmount(343200)}</span>
                </div>
              </div>

              <div className="text-center py-2 bg-[#0866FF] rounded-xl text-xs font-bold text-white">
                View All Branch Reports
              </div>
            </div>

            <div className="mt-3 text-center text-xs font-bold text-slate-400 pb-1">
              Screen 1: Live Dashboard
            </div>
          </div>

          {/* Phone 2: POS Mobile */}
          <div className="bg-slate-950 p-3 rounded-[36px] shadow-2xl border-4 border-[#0866FF] flex flex-col justify-between transform md:-translate-y-3">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Screen Content: Mobile POS */}
            <div className="bg-slate-900 rounded-[26px] p-4 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">MsmeBooks POS</span>
                <span className="bg-[#B7F000] text-slate-950 text-[10px] font-bold px-1.5 py-0.2 rounded">
                  Quick Pay
                </span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total to Charge</span>
                <div className="text-2xl font-black text-[#B7F000] font-mono mt-0.5">{formatAmount(34500)}</div>
                <span className="text-[10px] text-slate-300">Customer: Adaeze Nwosu</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <div className="p-2.5 rounded-xl bg-[#0866FF] text-center text-white">
                  Tap to Pay
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-700 text-center text-white">
                  M-Pesa / USSD
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-800 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
                <WifiOff className="w-3 h-3 text-[#B7F000]" />
                <span>Offline transactions cached automatically</span>
              </div>
            </div>

            <div className="mt-3 text-center text-xs font-bold text-[#B7F000] pb-1">
              Screen 2: Mobile Point of Sale
            </div>
          </div>

          {/* Phone 3: Invoicing */}
          <div className="bg-slate-950 p-3 rounded-[36px] shadow-2xl border-4 border-slate-800 flex flex-col justify-between">
            {/* Phone Notch */}
            <div className="w-24 h-4 bg-slate-900 rounded-b-xl mx-auto mb-3 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>

            {/* Screen Content: Mobile Invoicing */}
            <div className="bg-slate-900 rounded-[26px] p-4 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300">Invoice Dispatch</span>
                <span className="text-blue-400 text-[10px] font-bold">#INV-8910</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl">
                <div className="text-xs font-bold text-white">Billed to: Westland Tech</div>
                <div className="text-lg font-black text-white font-mono mt-1">{formatAmount(650000)}</div>
                <div className="text-[10px] text-amber-400 mt-1">Due in 7 days &bull; Link Generated</div>
              </div>

              <div className="p-2.5 bg-emerald-800/80 rounded-xl text-center text-xs font-bold text-white">
                Share via WhatsApp
              </div>

              <div className="text-center py-2 bg-slate-800 rounded-xl text-[11px] text-slate-300 font-semibold">
                Download PDF Receipt
              </div>
            </div>

            <div className="mt-3 text-center text-xs font-bold text-slate-400 pb-1">
              Screen 3: Instant WhatsApp Invoice
            </div>
          </div>
        </div>

        {/* Store Badges and CTA */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenStartFree}
            className="px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm shadow-md flex items-center gap-2.5 transition-colors"
          >
            <span>Google Play (Android)</span>
          </button>
          <button
            onClick={onOpenStartFree}
            className="px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-sm shadow-md flex items-center gap-2.5 transition-colors"
          >
            <span>Apple App Store (iOS)</span>
          </button>
          <button
            onClick={onOpenStartFree}
            className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 flex items-center gap-2 transition-all"
          >
            <span>Explore Mobile App</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
