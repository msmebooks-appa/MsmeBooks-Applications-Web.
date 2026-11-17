import React, { useState } from 'react';
import { 
  BookOpen, 
  PieChart, 
  Users, 
  UserCheck, 
  FileCheck, 
  Layers, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Sparkles, 
  ShieldAlert, 
  HelpCircle,
  FileText,
  Clock,
  Building
} from 'lucide-react';
import { CurrencyCode, ServiceCategoryItem } from '../types';
import { SERVICE_CATEGORIES } from '../data/mockData';
import { formatPrice } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';

interface ServiceCatalogProps {
  selectedCurrency: CurrencyCode;
  onSelectServiceForPlan: (serviceId: string) => void;
  onRequestCustomQuote: (serviceName: string) => void;
}

export const ServiceCatalog: React.FC<ServiceCatalogProps> = ({
  selectedCurrency,
  onSelectServiceForPlan,
  onRequestCustomQuote,
}) => {
  const { t } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<'all' | 'bookkeeping' | 'accounting' | 'payroll' | 'hr' | 'tax' | 'bpo'>('all');
  const [selectedServiceModal, setSelectedServiceModal] = useState<ServiceCategoryItem | null>(null);

  const filteredServices = activeFilter === 'all' 
    ? SERVICE_CATEGORIES 
    : SERVICE_CATEGORIES.filter(s => s.category === activeFilter);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'PieChart': return <PieChart className="w-6 h-6 text-lime-600 dark:text-lime-400" />;
      case 'Users': return <Users className="w-6 h-6 text-sky-600 dark:text-sky-400" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'FileCheck': return <FileCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Layers': return <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      default: return <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
    }
  };

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-900/60 relative border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400" />
            {t.services.pill}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-grotesk tracking-tight">
            {t.services.title}
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
            {t.services.subtitle}
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {[
            { id: 'all', label: t.services.filterAll },
            { id: 'bookkeeping', label: t.services.filterBookkeeping },
            { id: 'accounting', label: t.services.filterAccounting },
            { id: 'payroll', label: t.services.filterPayroll },
            { id: 'hr', label: t.services.filterHr },
            { id: 'tax', label: t.services.filterTax },
            { id: 'bpo', label: t.services.filterBpo },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-md shadow-blue-900/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-xs hover:shadow-xl hover:border-blue-400 dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-6 space-y-4">
                
                {/* Card Icon & Header */}
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700/70 border border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                    {getIcon(service.iconName)}
                  </div>
                  <div className="text-right bg-slate-100 dark:bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700/70">
                    <span className="block text-[11px] font-bold text-slate-900 dark:text-white font-mono">
                      {formatPrice(service.baseStartingPriceUSD, selectedCurrency)}/mo fixed
                    </span>
                    <span className="text-[10px] font-bold text-lime-600 dark:text-lime-400 font-mono">
                      or {formatPrice(Math.round(service.baseStartingPriceUSD / 4), selectedCurrency)}/hr ad-hoc
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-grotesk group-hover:text-blue-700 dark:group-hover:text-lime-400 transition">
                    {service.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 line-clamp-2">
                    {service.shortDesc}
                  </p>
                </div>

                {/* Deliverables snippet */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Core Deliverables Included:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {service.deliverables.slice(0, 4).map((d, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{d}</span>
                      </li>
                    ))}
                  </ul>
                  {service.deliverables.length > 4 && (
                    <button
                      onClick={() => setSelectedServiceModal(service)}
                      className="text-xs font-semibold text-blue-700 dark:text-lime-400 hover:underline inline-block cursor-pointer"
                    >
                      +{service.deliverables.length - 4} more deliverables →
                    </button>
                  )}
                </div>

                {/* SLA & Scope Tags */}
                <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    SLA: {service.sla}
                  </span>
                </div>

              </div>

              {/* Bottom Card Actions */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                <button
                  onClick={() => setSelectedServiceModal(service)}
                  className="flex-1 py-2.5 px-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700 transition text-center cursor-pointer"
                >
                  {t.services.viewDetails}
                </button>
                <button
                  onClick={() => onSelectServiceForPlan(service.id)}
                  className="flex-1 py-2.5 px-3 bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition text-center shadow-sm cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>{t.services.subscribe}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Deep-Dive Service Scope Modal */}
      {selectedServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-700">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-900 text-white p-6 rounded-t-2xl flex items-start justify-between border-b border-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                  Service Scope & Deliverables
                </span>
                <h3 className="text-2xl font-bold font-grotesk">
                  {selectedServiceModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedServiceModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-slate-800 dark:text-slate-200">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Service Overview
                </h4>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedServiceModal.fullDesc}
                </p>
              </div>

              {/* Indicative Scope */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/60 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-100 dark:border-blue-900">
                <div>
                  <div className="text-[11px] font-bold uppercase text-blue-900 dark:text-blue-300 tracking-wider">
                    Indicative Volume Scope
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    {selectedServiceModal.indicativeScope}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase text-blue-900 dark:text-blue-300 tracking-wider">
                    Service Turnaround SLA
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 mt-1">
                    {selectedServiceModal.sla}
                  </div>
                </div>
              </div>

              {/* Full Deliverables List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Comprehensive Deliverables Matrix ({selectedServiceModal.deliverables.length})
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedServiceModal.deliverables.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700/60">
                      <Check className="w-4 h-4 text-lime-600 dark:text-lime-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Country-specific regulatory note */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/50 rounded-xl border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Strict Regulatory Governance: </span>
                  All statutory tax filings and audit services are delivered exclusively through appropriately licensed in-country professionals (e.g. ICAN/CITN in Nigeria, ICPAK in Kenya, SAICA in South Africa, ONECCA in Côte d'Ivoire).
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Available Contracting Models</div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5">
                    <span className="text-base font-extrabold text-blue-700 dark:text-blue-400 font-grotesk">
                      {formatPrice(selectedServiceModal.baseStartingPriceUSD, selectedCurrency)}/mo <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">Fixed</span>
                    </span>
                    <span className="text-slate-400 hidden sm:inline">•</span>
                    <span className="text-base font-extrabold text-lime-600 dark:text-lime-400 font-grotesk">
                      {formatPrice(Math.round(selectedServiceModal.baseStartingPriceUSD / 4), selectedCurrency)}/hr <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">Hourly Ad-Hoc</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      onRequestCustomQuote(selectedServiceModal.name);
                      setSelectedServiceModal(null);
                    }}
                    className="px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
                  >
                    Request Custom Quote
                  </button>
                  <button
                    onClick={() => {
                      onSelectServiceForPlan(selectedServiceModal.id);
                      setSelectedServiceModal(null);
                    }}
                    className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-lime-400 hover:bg-lime-500 rounded-xl transition shadow-md shadow-lime-400/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Subscribe to this Service</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
