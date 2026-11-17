import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  MessageCircle, 
  ShieldCheck, 
  Star,
  RefreshCw,
  Clock
} from 'lucide-react';
import { SERVICES_CATALOGUE, ServiceItem } from '../data/servicesData';
import { PROFESSIONAL_FIRMS, ProfessionalFirm } from '../data/firmsData';
import { buildWhatsAppBookingUrl } from '../utils/whatsapp';
import { useCurrency } from '../context/CurrencyContext';

interface SmartServiceMatcherProps {
  onSelectService: (service: ServiceItem) => void;
  onBookWithFirm: (service: ServiceItem, firm: ProfessionalFirm) => void;
}

export const SmartServiceMatcher: React.FC<SmartServiceMatcherProps> = ({
  onSelectService,
  onBookWithFirm,
}) => {
  const { formatPriceString } = useCurrency();
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchedResults, setMatchedResults] = useState<{
    services: ServiceItem[];
    firms: ProfessionalFirm[];
    summary: string;
    recommendedPackage: string;
  } | null>(null);

  const samplePrompts = [
    "I run three retail supermarkets and need help with inventory control, POS setup, and monthly bookkeeping.",
    "I have an outpatient clinic and pharmacy in Abuja, needing drug expiry tracking, cashier auditing, and PAYE tax.",
    "We are a boutique hotel in Accra with 30 rooms and a lounge needing front-desk PMS and restaurant KOT printers.",
    "Need urgent cleanup of 2 years of backlog accounts and tax clearance for a Bank of Industry loan application.",
  ];

  const handleDiagnose = (inputQuery: string) => {
    if (!inputQuery.trim()) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      const lower = inputQuery.toLowerCase();

      let matchedServices: ServiceItem[] = [];
      let matchedFirms: ProfessionalFirm[] = [];
      let summaryText = '';
      let packageRec = 'Business Essentials';

      if (lower.includes('supermarket') || lower.includes('retail') || lower.includes('pos')) {
        matchedServices = SERVICES_CATALOGUE.filter(s => 
          s.id === 'srv-supermarket-package' || s.id === 'srv-pos-retail-setup' || s.id === 'srv-bookkeeping-monthly'
        );
        matchedFirms = PROFESSIONAL_FIRMS.filter(f => f.id === 'firm-apex' || f.id === 'firm-msme-direct');
        summaryText = "Based on your supermarket / retail requirements, we recommend an on-site Turnkey Supermarket POS rollout with barcode scanners, multi-checkout lanes, and ongoing monthly bookkeeping.";
        packageRec = "Business Essentials / Growth Turnkey";
      } else if (lower.includes('pharmacy') || lower.includes('clinic') || lower.includes('health') || lower.includes('drug')) {
        matchedServices = SERVICES_CATALOGUE.filter(s => 
          s.id === 'srv-pharmacy-healthcare' || s.id === 'srv-payroll-outsourcing' || s.id === 'srv-pos-cashier-staff-training'
        );
        matchedFirms = PROFESSIONAL_FIRMS.filter(f => f.id === 'firm-apex' || f.id === 'firm-bodman');
        summaryText = "For healthcare & pharmacy operations, we prioritized strict Batch Number & Expiry Date tracking to prevent expired shelf drugs, combined with automated PAYE payroll.";
        packageRec = "Business Essentials Batch Setup";
      } else if (lower.includes('hotel') || lower.includes('pms') || lower.includes('restaurant') || lower.includes('lounge')) {
        matchedServices = SERVICES_CATALOGUE.filter(s => 
          s.id === 'srv-hotel-pms-implementation' || s.id === 'srv-restaurant-hospitality'
        );
        matchedFirms = PROFESSIONAL_FIRMS.filter(f => f.id === 'firm-apex' || f.id === 'firm-msme-direct');
        summaryText = "For your hospitality property, we matched MsmeBooks Hotel PMS (room reservations + night audits) integrated directly with Kitchen Order Ticket (KOT) bar/restaurant printers.";
        packageRec = "Boutique Hotel Setup Package";
      } else if (lower.includes('tax') || lower.includes('cleanup') || lower.includes('loan') || lower.includes('boi') || lower.includes('audit')) {
        matchedServices = SERVICES_CATALOGUE.filter(s => 
          s.id === 'srv-financial-cleanup' || s.id === 'srv-tax-advisory' || s.id === 'srv-startup-funding-advisory'
        );
        matchedFirms = PROFESSIONAL_FIRMS.filter(f => f.id === 'firm-cedar' || f.id === 'firm-pointview');
        summaryText = "To prepare for financing or tax clearance, we recommend our Historical Accounting Reconstruction followed by corporate tax filing and a bankable loan financial model.";
        packageRec = "Reconstruction & Funding Package";
      } else {
        matchedServices = [SERVICES_CATALOGUE[0], SERVICES_CATALOGUE[3]];
        matchedFirms = [PROFESSIONAL_FIRMS[0], PROFESSIONAL_FIRMS[1]];
        summaryText = "We matched our Core Cloud Setup & Monthly Bookkeeping package with certified implementation partners to get your business structured.";
        packageRec = "Business Essentials";
      }

      setMatchedResults({
        services: matchedServices,
        firms: matchedFirms,
        summary: summaryText,
        recommendedPackage: packageRec,
      });
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <section id="smart-matcher" className="py-14 bg-gradient-to-br from-[#102B4E] to-[#0A1D36] text-white relative overflow-hidden">
      {/* Decorative glows */}
      <div className="absolute -top-24 -left-24 w-80 h-80 bg-[#1464C8]/30 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#B7E532]/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B7E532]/20 text-[#B7E532] text-xs font-extrabold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI Service Recommendation & Professional Matcher
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Describe Your Business Challenge. We Match the Right Solution.
          </h2>
          <p className="mt-3 text-slate-300 text-sm sm:text-base">
            Tell us about your industry, branch count, or operational bottlenecks in plain language. Our system diagnoses your requirements and connects you with verified African firms.
          </p>
        </div>

        {/* Input Interactive Box */}
        <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/20 shadow-2xl">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., I operate 2 supermarkets in Port Harcourt with 6 cashiers and need barcode setup, stock reconciliation, and monthly bookkeeping..."
              className="w-full p-4 text-sm sm:text-base text-white placeholder-slate-400 bg-black/20 rounded-xl border border-white/15 focus:outline-none focus:ring-2 focus:ring-[#B7E532] focus:border-transparent resize-none font-medium"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-[#B7E532] font-bold">Try an example:</span>
            </div>

            <button
              onClick={() => handleDiagnose(query)}
              disabled={isAnalyzing || !query.trim()}
              className="px-6 py-2.5 bg-[#B7E532] hover:bg-[#a4d227] disabled:opacity-50 text-[#102B4E] font-black text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ml-auto"
            >
              {isAnalyzing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#102B4E]" />
                  <span>Matching Solutions...</span>
                </>
              ) : (
                <>
                  <span>Match My Service</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          {/* Quick Click Prompts */}
          <div className="mt-3 flex flex-wrap gap-2">
            {samplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(promptText);
                  handleDiagnose(promptText);
                }}
                className="text-left text-xs bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-lg border border-white/10 transition-colors line-clamp-1"
              >
                "{promptText.slice(0, 55)}..."
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        {matchedResults && (
          <div className="mt-8 max-w-4xl mx-auto bg-white dark:bg-[#0A1727] text-slate-800 dark:text-slate-100 rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-bottom duration-300">
            
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#1464C8] dark:text-[#B7E532]">
                  Tailored Recommendation
                </div>
                <h3 className="text-xl font-black text-[#102B4E] dark:text-white mt-0.5">
                  Recommended Strategy: {matchedResults.recommendedPackage}
                </h3>
              </div>
              <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" /> High Compatibility Match
              </span>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0D1D31] p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 font-medium">
              {matchedResults.summary}
            </p>

            {/* Matched Services Grid */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                Matching MsmeBooks Services ({matchedResults.services.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedResults.services.map((srv) => (
                  <div key={srv.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0E2036] hover:border-[#1464C8] dark:hover:border-[#B7E532] hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-[#1464C8] dark:text-[#388bfd]">{srv.category}</span>
                        <span className="text-xs font-bold text-[#1464C8] dark:text-[#B7E532] flex items-center gap-1 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                          <Clock className="w-3 h-3 text-[#1464C8] dark:text-[#B7E532]" />
                          Per Hour / Fixed
                        </span>
                      </div>
                      <h5 className="font-extrabold text-[#102B4E] dark:text-white text-sm">{srv.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">{srv.shortOverview}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                      <button
                        onClick={() => onSelectService(srv)}
                        className="flex-1 py-1.5 px-3 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#1464C8] dark:text-[#B7E532] font-bold text-xs rounded-lg transition-colors cursor-pointer"
                      >
                        View Service Details
                      </button>
                      <a
                        href={buildWhatsAppBookingUrl({
                          serviceName: srv.title,
                          packageName: srv.packages[1]?.name || 'Business Essentials',
                        })}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1.5 px-3 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Book via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Verified Firms */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
                Recommended Verified Professional Firms ({matchedResults.firms.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchedResults.firms.map((firm) => (
                  <div key={firm.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#0E2036] flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl ${firm.avatarBg} text-white font-black text-sm flex items-center justify-center shrink-0`}>
                      {firm.logoText}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-[#102B4E] dark:text-white truncate">{firm.name}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-[#B7E532] shrink-0" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="flex items-center text-amber-500 font-bold">
                          <Star className="w-3 h-3 fill-current mr-0.5" /> {firm.rating}
                        </span>
                        <span>•</span>
                        <span>{firm.city}, {firm.country}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (matchedResults.services[0]) {
                              onBookWithFirm(matchedResults.services[0], firm);
                            }
                          }}
                          className="px-3 py-1.5 bg-[#1464C8] hover:bg-[#1052a5] text-white font-bold text-xs rounded-lg shadow-sm cursor-pointer"
                        >
                          Book with {firm.name.split(' ')[0]}
                        </button>
                        <a
                          href={buildWhatsAppBookingUrl({
                            serviceName: matchedResults.services[0]?.title || 'Professional Consultation',
                            providerName: firm.name,
                            location: `${firm.city}, ${firm.country}`,
                          })}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-emerald-700 dark:text-[#B7E532] border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold cursor-pointer"
                          title="WhatsApp Consultation"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </section>
  );
};
