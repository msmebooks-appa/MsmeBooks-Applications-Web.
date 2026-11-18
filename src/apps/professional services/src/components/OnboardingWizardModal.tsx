import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  AlertTriangle, 
  ShieldCheck, 
  TrendingUp, 
  Check, 
  FileText, 
  Clock, 
  ShoppingCart, 
  RotateCcw
} from 'lucide-react';
import { ALL_WORLD_COUNTRIES } from '../data/countries';
import { SERVICES_CATALOGUE, ServiceItem, ServicePackage } from '../data/servicesData';
import { OnboardingProfile } from '../types/booking';
import { useCurrency } from '../context/CurrencyContext';

interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBookService: (service: ServiceItem, selectedPackage?: ServicePackage) => void;
  onAddToCart?: (service: ServiceItem, selectedPackage?: ServicePackage) => void;
}

const INDUSTRIES = [
  { id: 'retail', name: 'Retail, Supermarkets & E-commerce', icon: '🛒', desc: 'POS systems, high inventory turnover, supplier accounts' },
  { id: 'tech', name: 'Tech Startups & SaaS', icon: '💻', desc: 'Subscription revenue, investor reporting, cross-border invoicing' },
  { id: 'agri', name: 'Agriculture & Agro-Processing', icon: '🌾', desc: 'Seasonal cash flow, biological asset tracking, farm payroll' },
  { id: 'healthcare', name: 'Healthcare, Clinics & Pharmacy', icon: '🏥', desc: 'NHIS insurance claims, prescription inventory, compliance' },
  { id: 'logistics', name: 'Logistics, Freight & Transport', icon: '🚚', desc: 'Fleet maintenance cost center, fuel logs, waybill tracking' },
  { id: 'hospitality', name: 'Hotels, Bars & Restaurants', icon: '🍽️', desc: 'Daily night audits, kitchen food cost variance, tips/VAT' },
  { id: 'construction', name: 'Construction & Real Estate', icon: '🏗️', desc: 'Project-based job costing, retention bonds, subcontractor WHT' },
  { id: 'services', name: 'Professional & Creative Services', icon: '👔', desc: 'Time billing, retainer agreements, client reimbursables' },
  { id: 'manufacturing', name: 'Light Manufacturing & Assembly', icon: '⚙️', desc: 'Bill of materials (BOM), WIP costing, factory overheads' },
];

const CHALLENGES_OPTIONS = [
  { id: 'tax_compliance', label: 'Tax & VAT/WHT compliance penalties risk', serviceId: 'srv-tax-advisory', severity: 'high' },
  { id: 'backlog_books', label: 'Unrecorded transactions & months of backlog books', serviceId: 'srv-backlog-bookkeeping', severity: 'high' },
  { id: 'pos_inventory', label: 'POS checkout & stock discrepancy in store', serviceId: 'srv-pos-retail-setup', severity: 'medium' },
  { id: 'erp_spreadsheets', label: 'Tired of messy Excel files; need modern cloud ERP', serviceId: 'srv-erp-migration', severity: 'medium' },
  { id: 'payroll_paye', label: 'Complex payroll, PAYE deductions & pension calculations', serviceId: 'srv-payroll-management', severity: 'medium' },
  { id: 'audit_prep', label: 'External statutory audit readiness and documentation', serviceId: 'srv-audit-preparation', severity: 'high' },
  { id: 'cfo_advisory', label: 'Lack CFO financial strategy & investor-ready reporting', serviceId: 'srv-fractional-cfo', severity: 'high' },
  { id: 'multi_currency', label: 'International client invoicing & multi-currency banking', serviceId: 'srv-payment-gateway-setup', severity: 'medium' },
];

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onBookService,
  onAddToCart,
}) => {
  const { formatPriceString } = useCurrency();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [addedCartIds, setAddedCartIds] = useState<string[]>([]);

  // Profile Form State
  const [profile, setProfile] = useState<OnboardingProfile>(() => {
    try {
      const saved = localStorage.getItem('msmebooks_onboarding_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      businessName: '',
      structure: 'Private Limited (LLC / Ltd)',
      revenueRange: '$50,000 - $250,000 (₦60m - ₦300m)',
      country: 'Nigeria',
      city: 'Lagos',
      industry: 'Retail, Supermarkets & E-commerce',
      challenges: ['tax_compliance', 'backlog_books'],
      teamSize: '5-15 Employees',
      softwareUsed: ['Excel Spreadsheets', 'Physical Paper Invoices'],
    };
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
    }
  };

  const handleToggleChallenge = (challengeId: string) => {
    setProfile(prev => {
      const exists = prev.challenges.includes(challengeId);
      const updated = exists 
        ? prev.challenges.filter(c => c !== challengeId)
        : [...prev.challenges, challengeId];
      return { ...prev, challenges: updated };
    });
  };

  const handleSaveProfile = () => {
    try {
      localStorage.setItem('msmebooks_onboarding_profile', JSON.stringify(profile));
      localStorage.setItem('msmebooks_onboarding_completed', 'true');
    } catch (e) {
      console.error(e);
    }
  };

  // Compute Personalized Recommendations
  const recommendedServices = React.useMemo(() => {
    const list: { service: ServiceItem; score: number; rationale: string; priorityPkg: ServicePackage }[] = [];
    
    // 1. Matched by selected challenges
    profile.challenges.forEach(chId => {
      const chObj = CHALLENGES_OPTIONS.find(c => c.id === chId);
      if (chObj?.serviceId) {
        const srv = SERVICES_CATALOGUE.find(s => s.id === chObj.serviceId);
        if (srv && !list.some(item => item.service.id === srv.id)) {
          list.push({
            service: srv,
            score: chObj.severity === 'high' ? 98 : 94,
            rationale: `Directly resolves your challenge: "${chObj.label}".`,
            priorityPkg: srv.packages[1] || srv.packages[0],
          });
        }
      }
    });

    // 2. Industry specific fallback/boost
    if (profile.industry.includes('Retail') && !list.some(i => i.service.id === 'srv-pos-retail-setup')) {
      const posSrv = SERVICES_CATALOGUE.find(s => s.id === 'srv-pos-retail-setup');
      if (posSrv) {
        list.push({
          service: posSrv,
          score: 95,
          rationale: 'Essential for retail and supermarket sales operations and inventory controls.',
          priorityPkg: posSrv.packages[1] || posSrv.packages[0],
        });
      }
    }

    // 3. Fallback monthly bookkeeping
    if (list.length < 3) {
      const bkp = SERVICES_CATALOGUE.find(s => s.id === 'srv-bookkeeping-monthly');
      if (bkp && !list.some(i => i.service.id === bkp.id)) {
        list.push({
          service: bkp,
          score: 90,
          rationale: 'Baseline monthly management accounts and P&L financial compliance.',
          priorityPkg: bkp.packages[1] || bkp.packages[0],
        });
      }
    }

    return list.slice(0, 4);
  }, [profile]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#0A1727] rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 dark:border-slate-800 flex flex-col text-slate-800 dark:text-slate-100 max-h-[92vh]">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#102B4E] dark:bg-[#060F1A] text-white px-6 py-4 flex items-center justify-between border-b border-slate-700 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1464C8] to-[#B7E532] flex items-center justify-center text-[#102B4E] shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#B7E532]">
                  Client Onboarding & Diagnostic Wizard
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300 font-semibold">Step {currentStep} of 4</span>
              </div>
              <h2 className="text-lg font-black text-white">
                {currentStep === 1 && 'Business Profile & Legal Structure'}
                {currentStep === 2 && 'Select Your Industry & Business Model'}
                {currentStep === 3 && 'Identify Key Accounting & Operational Challenges'}
                {currentStep === 4 && 'Your Personalized Services & Compliance Roadmap'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-slate-100 dark:bg-[#0D1D31] px-6 py-2 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
          {[
            { step: 1, label: 'Profile' },
            { step: 2, label: 'Industry' },
            { step: 3, label: 'Challenges' },
            { step: 4, label: 'Recommendations' },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-1.5">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors ${
                currentStep === item.step
                  ? 'bg-[#1464C8] text-white shadow-xs'
                  : currentStep > item.step
                  ? 'bg-emerald-500 text-white'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
              }`}>
                {currentStep > item.step ? '✓' : item.step}
              </span>
              <span className={`hidden sm:inline font-bold ${
                currentStep === item.step ? 'text-[#1464C8] dark:text-[#B7E532]' : 'text-slate-500'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 space-y-6">
          
          {/* STEP 1: BUSINESS PROFILE */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/40 flex items-start gap-3">
                <Building2 className="w-5 h-5 text-[#1464C8] dark:text-[#B7E532] shrink-0 mt-0.5" />
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  Provide your business profile to match verified chartered accountants and systems engineers licensed in your jurisdiction.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Business / Trading Name *
                  </label>
                  <input
                    type="text"
                    value={profile.businessName}
                    onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                    placeholder="e.g., Apex Global Ventures Ltd"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1D31] text-xs font-semibold focus:ring-2 focus:ring-[#1464C8] outline-hidden text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Legal Business Structure
                  </label>
                  <select
                    value={profile.structure}
                    onChange={(e) => setProfile({ ...profile, structure: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1D31] text-xs font-semibold focus:ring-2 focus:ring-[#1464C8] outline-hidden text-slate-800 dark:text-slate-100"
                  >
                    <option value="Sole Proprietorship">Sole Proprietorship / Enterprise</option>
                    <option value="Private Limited (LLC / Ltd)">Private Limited Company (LLC / Ltd)</option>
                    <option value="Partnership">Partnership / LLP</option>
                    <option value="Non-Profit / NGO">Non-Profit / NGO / Incorporated Trustees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Country (All World Countries) *
                  </label>
                  <select
                    value={profile.country}
                    onChange={(e) => {
                      const c = ALL_WORLD_COUNTRIES.find(x => x.name === e.target.value);
                      setProfile({ 
                        ...profile, 
                        country: e.target.value,
                        city: c?.majorCities[0] || 'Capital City'
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1D31] text-xs font-semibold focus:ring-2 focus:ring-[#1464C8] outline-hidden text-slate-800 dark:text-slate-100"
                  >
                    {ALL_WORLD_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.region})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    State or City *
                  </label>
                  <input
                    type="text"
                    value={profile.city}
                    onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    placeholder="e.g., Lagos, Nairobi, London, Johannesburg"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1D31] text-xs font-semibold focus:ring-2 focus:ring-[#1464C8] outline-hidden text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Annual Turnover / Revenue Bracket
                  </label>
                  <select
                    value={profile.revenueRange}
                    onChange={(e) => setProfile({ ...profile, revenueRange: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1D31] text-xs font-semibold focus:ring-2 focus:ring-[#1464C8] outline-hidden text-slate-800 dark:text-slate-100"
                  >
                    <option value="Pre-revenue / Startup">Pre-revenue / Startup</option>
                    <option value="Under $50,000 (₦60m)">Under $50,000 (Under ₦60m)</option>
                    <option value="$50,000 - $250,000 (₦60m - ₦300m)">$50,000 - $250,000 (₦60m - ₦300m)</option>
                    <option value="$250,000 - $1,000,000 (₦300m - ₦1.2b)">$250,000 - $1,000,000 (₦300m - ₦1.2b)</option>
                    <option value="Over $1,000,000+ (₦1.2b+)">Over $1,000,000+ (Enterprise)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Company Team Size
                  </label>
                  <select
                    value={profile.teamSize}
                    onChange={(e) => setProfile({ ...profile, teamSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0D1D31] text-xs font-semibold focus:ring-2 focus:ring-[#1464C8] outline-hidden text-slate-800 dark:text-slate-100"
                  >
                    <option value="1-4 Employees">1-4 Employees (Micro)</option>
                    <option value="5-15 Employees">5-15 Employees (Small)</option>
                    <option value="16-50 Employees">16-50 Employees (Medium)</option>
                    <option value="51-200+ Employees">51-200+ Employees (Mid-Market)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: INDUSTRY & SECTOR */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Choose the industry that most closely describes your primary business activities:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INDUSTRIES.map((ind) => {
                  const isSelected = profile.industry === ind.name;
                  return (
                    <button
                      key={ind.id}
                      type="button"
                      onClick={() => setProfile({ ...profile, industry: ind.name })}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/70 dark:bg-blue-950/50 shadow-md ring-2 ring-[#1464C8]/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-2xl mb-2">{ind.icon}</div>
                        <h4 className="text-xs font-black text-[#102B4E] dark:text-white leading-tight">
                          {ind.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                          {ind.desc}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-end">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-[#1464C8] text-white' : 'border border-slate-300 dark:border-slate-600'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: ACCOUNTING CHALLENGES */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                  Select all the bottlenecks, risks, or upcoming projects your business is facing:
                </p>
                <span className="text-[11px] font-bold text-[#1464C8] dark:text-[#B7E532]">
                  {profile.challenges.length} selected
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CHALLENGES_OPTIONS.map((ch) => {
                  const isChecked = profile.challenges.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => handleToggleChallenge(ch.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isChecked
                          ? 'border-[#1464C8] dark:border-[#B7E532] bg-blue-50/70 dark:bg-blue-950/40 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1D31] hover:bg-slate-50 dark:hover:bg-[#132842]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs mt-0.5 shrink-0 ${
                        isChecked 
                          ? 'bg-[#1464C8] text-white' 
                          : 'border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-[#102B4E] dark:text-white leading-snug">
                            {ch.label}
                          </p>
                          {ch.severity === 'high' && (
                            <span className="text-[9px] font-black uppercase px-1.5 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded shrink-0">
                              Urgent
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: RECOMMENDATIONS ENGINE */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-gradient-to-r from-[#102B4E] to-[#1464C8] p-5 rounded-2xl text-white shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-[#B7E532] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Diagnostic Summary for {profile.businessName || 'Your Business'}
                </div>
                <h3 className="text-base sm:text-lg font-black mt-1">
                  Tailored Service & Implementation Roadmap
                </h3>
                <p className="text-xs text-slate-200 mt-1 max-w-xl leading-relaxed">
                  Based on your {profile.industry} operation in {profile.city}, {profile.country}, we recommend the following verified services to safeguard compliance and increase profits.
                </p>
              </div>

              <div className="space-y-3">
                {recommendedServices.map(({ service, score, rationale, priorityPkg }) => {
                  const isCartAdded = addedCartIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      className="bg-white dark:bg-[#0D1D31] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-[#1464C8] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        <img
                          src={service.imageUrl}
                          alt={service.title}
                          className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-[#B7E532] text-[10px] font-black">
                              {score}% Compatibility Match
                            </span>
                            <span className="text-xs text-slate-400">•</span>
                            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                              {service.category}
                            </span>
                          </div>

                          <h4 className="text-sm font-black text-[#102B4E] dark:text-white mt-1 leading-tight">
                            {service.title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                            {rationale}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Package:</span>
                            <span className="font-bold text-[#102B4E] dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                              {priorityPkg.name} ({formatPriceString(priorityPkg.priceDisplay)})
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                        {onAddToCart && (
                          <button
                            type="button"
                            onClick={() => {
                              onAddToCart(service, priorityPkg);
                              setAddedCartIds(prev => [...prev, service.id]);
                            }}
                            className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                              isCartAdded
                                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-[#B7E532] border-emerald-300 dark:border-emerald-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>{isCartAdded ? 'In Batch Cart' : 'Add to Cart'}</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            handleSaveProfile();
                            onClose();
                            onBookService(service, priorityPkg);
                          }}
                          className="w-full sm:w-auto px-4 py-2 bg-[#1464C8] hover:bg-[#1052a5] text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Book Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Modal Navigation Footer */}
        <div className="sticky bottom-0 bg-slate-50 dark:bg-[#060F1A] px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-[#0D1D31] border border-slate-200 dark:border-slate-700 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div className="text-[11px] text-slate-500">Takes only 2 minutes</div>
          )}

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 text-xs font-black text-white bg-[#1464C8] hover:bg-[#1052a5] rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleSaveProfile();
                  onClose();
                }}
                className="px-6 py-2.5 text-xs font-black text-[#102B4E] bg-[#B7E532] hover:bg-[#a6d628] rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <span>Save Diagnostic & Close</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
