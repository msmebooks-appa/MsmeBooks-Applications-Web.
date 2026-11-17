import React, { useState } from 'react';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  ShieldCheck, 
  CheckCircle2, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  RefreshCw,
  Zap
} from 'lucide-react';
import { CountryInfo, CurrencyCode, RegionKey } from '../types';
import { PAYMENT_GATEWAYS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

interface PaymentGatewaysSectionProps {
  selectedCountry: CountryInfo;
  selectedCurrency: CurrencyCode;
  onOpenCheckoutDemo: (gatewayName: string) => void;
}

export const PaymentGatewaysSection: React.FC<PaymentGatewaysSectionProps> = ({
  selectedCountry,
  selectedCurrency,
  onOpenCheckoutDemo,
}) => {
  const { t } = useLanguage();
  const [activeRegionTab, setActiveRegionTab] = useState<RegionKey>('west_africa');

  const regionGateways = PAYMENT_GATEWAYS.filter(g => g.regions.includes(activeRegionTab));

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-lime-100 dark:bg-lime-950/80 border border-lime-300 dark:border-lime-800 text-lime-900 dark:text-lime-400 text-xs font-bold tracking-wide uppercase">
            <Zap className="w-3.5 h-3.5 text-lime-700 dark:text-lime-400" />
            {t.gateways.pill}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            {t.gateways.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300">
            {t.gateways.subtitle}
          </p>
        </div>

        {/* Regional Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'west_africa', label: '🇳🇬 🇨🇮 🇧🇯 🇧🇫 West Africa (Paystack, FedaPay, CinetPay, LigdiCash)' },
            { id: 'east_africa', label: '🇰🇪 🇷🇼 East Africa (M-Pesa, Pesapal, Airtel)' },
            { id: 'southern_africa', label: '🇿🇦 🇿🇼 Southern Africa (Ozow, PayFast, Paynow)' },
            { id: 'other_africa', label: '🇪🇬 North Africa (Payfort / Amazon, Meeza, Fawry)' },
            { id: 'global', label: '🌐 Global & Diaspora (Stripe, PayPal)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveRegionTab(tab.id as RegionKey)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeRegionTab === tab.id
                  ? 'bg-lime-400 text-slate-950 shadow-lg shadow-lime-400/20'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gateway Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionGateways.map((gw) => (
            <div
              key={gw.id}
              className="bg-white dark:bg-slate-800/80 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-xs dark:shadow-md hover:border-lime-500 dark:hover:border-lime-400/80 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                      {gw.logo}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold font-grotesk text-slate-900 dark:text-white">
                        {gw.name}
                      </h3>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Supported: {gw.supportedCurrencies.join(', ')}
                      </span>
                    </div>
                  </div>
                  {gw.badge && (
                    <span className="text-[10px] font-bold text-lime-700 dark:text-lime-400 bg-lime-100 dark:bg-lime-950 px-2 py-0.5 rounded border border-lime-300 dark:border-lime-800">
                      {gw.badge}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Eligible Payment Methods:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                    {gw.paymentMethods.map((m, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Instant Tax Receipt</span>
                </div>
                <button
                  onClick={() => onOpenCheckoutDemo(gw.name)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-600 transition cursor-pointer flex items-center gap-1"
                >
                  <span>{t.gateways.simulateBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Security & Multi-Currency Guarantee */}
        <div className="mt-12 bg-white dark:bg-slate-950/60 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
          <ShieldCheck className="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0" />
          <div>
            <span className="font-bold text-slate-900 dark:text-slate-200">Zero FX Currency Conversion Friction: </span>
            {t.gateways.zeroCardPolicy}
          </div>
        </div>

      </div>
    </section>
  );
};
