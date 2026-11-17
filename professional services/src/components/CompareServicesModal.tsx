import React from 'react';
import { 
  X, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  MessageCircle, 
  Calendar,
  Layers,
  HelpCircle,
  FileText,
  DollarSign,
  AlertTriangle,
  Trash2
} from 'lucide-react';
import { ServiceItem, ServicePackage } from '../data/servicesData';
import { getServiceSavingsData } from '../utils/savingsCalculator';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';

interface CompareServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceItem[];
  selectedCountry: string;
  onRemoveService: (serviceId: string) => void;
  onBookService: (service: ServiceItem, selectedPackage?: ServicePackage) => void;
}

export const CompareServicesModal: React.FC<CompareServicesModalProps> = ({
  isOpen,
  onClose,
  services,
  selectedCountry,
  onRemoveService,
  onBookService,
}) => {
  const { formatPriceString, currentCurrency } = useCurrency();
  if (!isOpen || services.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 max-h-[94vh] flex flex-col text-slate-800 dark:text-slate-100">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#B7E532]">
                Side-by-Side Comparison Matrix
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-xs text-slate-300">
                Comparing {services.length} of 3 Services
              </span>
            </div>
            <h2 className="text-xl font-black text-white mt-0.5">
              Service Features, Pricing Tiers & Estimated Annual Savings
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Table Body */}
        <div className="overflow-y-auto overflow-x-auto p-6 sm:p-8 flex-1 bg-slate-50/50 dark:bg-[#08121E]">
          <div className="min-w-[720px]">
            
            {/* COMPARISON TABLE */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-[#0D1D31]">
              
              {/* ROW 1: SERVICE HEADER CARDS */}
              <div className="grid grid-cols-12 bg-slate-50/80 dark:bg-[#0A1727] items-stretch">
                <div className="col-span-3 p-5 flex flex-col justify-end border-r border-slate-200 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Selected Services
                  </span>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Side-by-side breakdown of scope, packages, and ROI.
                  </p>
                </div>

                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-5 flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 last:border-r-0 relative group`}>
                    <button
                      onClick={() => onRemoveService(srv.id)}
                      className="absolute top-3 right-3 text-slate-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div>
                      <img
                        src={srv.imageUrl}
                        alt={srv.title}
                        className="w-full h-28 object-cover rounded-xl mb-3 bg-slate-100 dark:bg-slate-800 shadow-2xs"
                      />
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/50 text-[#1464C8] dark:text-blue-300 text-[10px] font-extrabold rounded-md uppercase">
                        {srv.category}
                      </span>
                      <h3 className="font-black text-sm text-[#102B4E] dark:text-slate-100 mt-1.5 leading-snug line-clamp-2">
                        {srv.title}
                      </h3>
                      <div className="text-xs font-black text-[#1464C8] dark:text-[#B7E532] mt-1.5 flex items-center gap-1 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded w-fit">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Per Hour or Fixed Price</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                      <button
                        onClick={() => onBookService(srv)}
                        className="w-full py-2 bg-[#1464C8] hover:bg-[#1052a5] text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                      >
                        Book This Service
                      </button>
                      <a
                        href={buildWhatsAppBookingUrl({
                          serviceName: srv.title,
                          packageName: srv.packages[0]?.name,
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-1.5 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] text-xs font-black rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* ROW 2: ESTIMATED ANNUAL COMPLIANCE SAVINGS */}
              <div className="grid grid-cols-12 items-center bg-blue-50/40 dark:bg-[#081729]">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-blue-100/40 dark:bg-[#071322]">
                  <span className="text-xs font-black text-[#102B4E] dark:text-slate-200 uppercase tracking-wider block">
                    Estimated Annual Savings
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">
                    Fines avoided + staff overhead savings
                  </span>
                </div>
                {services.map((srv) => {
                  const savings = getServiceSavingsData(srv, selectedCountry, { symbol: currentCurrency.symbol, rateMultiplier: currentCurrency.rateFromNGN });
                  return (
                    <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0`}>
                      <div className="text-lg font-black text-emerald-700 dark:text-[#B7E532]">
                        {savings.annualSavingsFormatted}
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold"> / yr</span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
                        {savings.primaryBenefit}
                      </p>
                      <div className="mt-2 text-[10px] font-bold text-[#1464C8] dark:text-blue-300 bg-white dark:bg-slate-800/80 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-900 inline-block">
                        ~{savings.hoursSaved} Admin Hours Reclaimed
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ROW 3: DELIVERY MODE & TIMELINE */}
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0A1727] font-bold text-xs text-slate-700 dark:text-slate-300">
                  Delivery Mode & Turnaround
                </div>
                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-xs`}>
                    <div className="flex items-center gap-1.5 font-bold text-[#102B4E] dark:text-slate-100">
                      <span className={`w-2 h-2 rounded-full ${
                        srv.deliveryMode === 'Remote' ? 'bg-blue-600' : srv.deliveryMode === 'On-site' ? 'bg-emerald-500' : 'bg-purple-500'
                      }`}></span>
                      <span>{srv.deliveryMode} Availability</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{srv.estimatedTimeline}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ROW 4: PRICING TIERS COMPARISON */}
              <div className="grid grid-cols-12 items-start bg-slate-50/30 dark:bg-[#071322]/50">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0A1727] font-bold text-xs text-slate-700 dark:text-slate-300">
                  Pricing Tiers & Scope
                </div>
                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0 space-y-3 text-xs`}>
                    {srv.packages.map((pkg) => (
                      <div key={pkg.id} className="p-2.5 bg-white dark:bg-[#0E2036] rounded-xl border border-slate-200 dark:border-slate-700/60 shadow-2xs">
                        <div className="flex items-center justify-between font-extrabold text-[#102B4E] dark:text-slate-100">
                          <span className="text-[11px] uppercase tracking-wide">{pkg.name}</span>
                          <span className="text-xs text-[#1464C8] dark:text-[#B7E532]">{formatPriceString(pkg.priceDisplay)}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">{pkg.subtitle}</p>
                        <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">Duration: {pkg.duration}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ROW 5: SCOPE & DELIVERABLES */}
              <div className="grid grid-cols-12 items-start">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0A1727] font-bold text-xs text-slate-700 dark:text-slate-300">
                  Key Deliverables
                </div>
                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-xs space-y-2`}>
                    {srv.deliverables.map((del, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-700 dark:text-slate-300 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-[#B7E532] shrink-0 mt-0.5" />
                        <span className="text-[11px]">{del}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ROW 6: PROBLEMS SOLVED */}
              <div className="grid grid-cols-12 items-start bg-slate-50/30 dark:bg-[#071322]/50">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0A1727] font-bold text-xs text-slate-700 dark:text-slate-300">
                  Problems Solved
                </div>
                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-xs space-y-1.5`}>
                    {srv.challengesSolved.map((chal, idx) => (
                      <div key={idx} className="flex items-start gap-1.5 text-slate-600 dark:text-slate-300 leading-snug">
                        <span className="text-red-500 font-bold text-xs">•</span>
                        <span className="text-[11px]">{chal}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* ROW 7: MSMEBOOKS MODULE INTEGRATION */}
              <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0A1727] font-bold text-xs text-slate-700 dark:text-slate-300">
                  MsmeBooks Modules
                </div>
                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-xs`}>
                    <div className="flex flex-wrap gap-1">
                      {srv.relatedModules.map((mod, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-[#1464C8] dark:text-blue-300 text-[10px] font-bold rounded">
                          {mod}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* ROW 8: VERIFIED PROVIDERS COUNT */}
              <div className="grid grid-cols-12 items-center bg-slate-50/50 dark:bg-[#081729]">
                <div className="col-span-3 p-4 border-r border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-[#0A1727] font-bold text-xs text-slate-700 dark:text-slate-300">
                  Verified Providers
                </div>
                {services.map((srv) => (
                  <div key={srv.id} className={`${services.length === 2 ? 'col-span-4' : 'col-span-3'} p-4 border-r border-slate-200 dark:border-slate-800 last:border-r-0 text-xs`}>
                    <span className="text-emerald-700 dark:text-[#B7E532] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {srv.verifiedProviderIds.length} Verified Firms Available
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 dark:bg-[#07111D] px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span>* Estimated savings calculated using statutory revenue penalty schedules and average regional accounting labor costs.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#102B4E] dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
