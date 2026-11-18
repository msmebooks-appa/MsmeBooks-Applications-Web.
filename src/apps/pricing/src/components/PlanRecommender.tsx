import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, HelpCircle, Layers, Store, Building, Briefcase, ShoppingBag, CreditCard } from 'lucide-react';
import { PRICING_PLANS } from '../data/pricingData';
import { PricingPlan, Currency } from '../types';
import { formatCurrency } from '../utils/currency';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface PlanRecommenderProps {
  onSelectPlan: (planId: string) => void;
  currency?: Currency;
}

const BUSINESS_SIZES = [
  { id: 'just-starting', label: 'Just starting', desc: 'Solo or 1–2 founders launched recently' },
  { id: 'small-business', label: 'Small business', desc: '1 physical shop, 2–5 employees' },
  { id: 'growing-business', label: 'Growing business', desc: 'High daily transaction volume, team of 5–15' },
  { id: 'multiple-branches', label: 'Multiple branches', desc: '2 or more retail stores, depots or warehouses' },
  { id: 'large-org', label: 'Large organization', desc: 'Extensive multi-location or wholesale enterprise' },
];

const PRIMARY_NEEDS = [
  { id: 'accounting', label: 'Accounting', icon: '📊', desc: 'Invoicing, expenses, VAT, cash flow & P&L' },
  { id: 'pos', label: 'POS', icon: '💳', desc: 'Fast barcode checkout, receipts & offline mode' },
  { id: 'inventory', label: 'Inventory', icon: '📦', desc: 'Stock alerts, item valuation & purchase orders' },
  { id: 'multi-branch', label: 'Multi-branch management', icon: '🏬', desc: 'Inter-branch stock transfers & consolidated reports' },
  { id: 'ecommerce', label: 'E-commerce', icon: '🌐', desc: 'Online storefront synced with physical inventory' },
  { id: 'full-mgmt', label: 'Full business management', icon: '⚡', desc: 'All tools integrated with AI business assistant' },
];

export const PlanRecommender: React.FC<PlanRecommenderProps> = ({ onSelectPlan, currency = 'NGN' }) => {
  const [selectedSize, setSelectedSize] = useState('small-business');
  const [selectedNeed, setSelectedNeed] = useState('full-mgmt');
  const { t, language } = useLanguage();
  const { addItem, openCheckout } = useCart();

  // Compute recommendation
  const getRecommendation = (): { plan: PricingPlan; reason: string; keyHighlights: string[] } => {
    if (selectedSize === 'large-org') {
      const plan = PRICING_PLANS.find((p) => p.id === 'enterprise') || PRICING_PLANS[3];
      const planTrans = (t.pricing as any).enterprise;
      return {
        plan,
        reason: language === 'fr'
          ? 'Pour les grandes organisations et réseaux multi-dépôts, la formule Entreprise offre des succursales illimitées, des intégrations ERP personnalisées et un contrat de niveau de service SLA.'
          : language === 'pt'
          ? 'Para grandes empresas e operações complexas, o plano Enterprise disponibiliza filiais ilimitadas, integrações customizadas e SLA com suporte corporativo.'
          : language === 'es'
          ? 'Para grandes organizaciones y operativas complejas, el plan Enterprise proporciona sedes ilimitadas, integraciones a medida y SLA con soporte corporativo.'
          : 'For large organizations and complex enterprise operations, the Enterprise plan delivers unlimited branches, custom integrations, dedicated account management, and enterprise security SLA.',
        keyHighlights: planTrans?.features?.slice(1, 4) || ['Unlimited branches & warehouses', 'Dedicated account manager & migration', 'Custom ERP & banking integrations'],
      };
    }

    if (selectedSize === 'multiple-branches' || selectedNeed === 'multi-branch' || selectedNeed === 'ecommerce') {
      const plan = PRICING_PLANS.find((p) => p.id === 'business') || PRICING_PLANS[2];
      const planTrans = (t.pricing as any).business;
      return {
        plan,
        reason: language === 'fr'
          ? 'La gestion de plusieurs magasins, entrepôts ou d’une boutique e-commerce nécessite notre formule Business avec transferts de stock automatisés, suivi des marges et limites de crédit clients.'
          : language === 'pt'
          ? 'Gerir múltiplos locais, armazéns ou uma loja virtual integrada exige o plano Business com transferências automáticas, balancete por filial e limites de crédito.'
          : language === 'es'
          ? 'Gestionar múltiples tiendas, almacenes o un e-commerce integrado requiere el plan Business con traslados automáticos de stock y límites de crédito comercial.'
          : 'Managing multiple locations, warehouses, or an integrated e-commerce shop requires our Business plan with automated stock transfers, branch P&L, and customer credit limits.',
        keyHighlights: planTrans?.features?.slice(1, 4) || ['Multi-branch & multi-warehouse tracking', 'Inter-branch inventory transfers', 'Built-in e-commerce storefront & API access'],
      };
    }

    if (selectedSize === 'just-starting' && (selectedNeed === 'accounting' || selectedNeed === 'pos')) {
      const plan = PRICING_PLANS.find((p) => p.id === 'starter') || PRICING_PLANS[0];
      const planTrans = (t.pricing as any).starter;
      return {
        plan,
        reason: language === 'fr'
          ? 'Pour les commerces à point de vente unique recherchant une facturation simple, des reçus de caisse et un suivi des recettes, la formule Starter est la passerelle idéale et économique.'
          : language === 'pt'
          ? 'Para pontos de venda únicos focados em faturas, recibos e contabilidade básica, o plano Starter é o ponto de partida mais acessível e eficaz.'
          : language === 'es'
          ? 'Para locales únicos enfocados en facturas, tickets de caja y control básico, el plan Starter es el punto de partida más accesible y eficaz.'
          : 'For single-location startups focusing on basic invoicing, sales receipts, and simple bookkeeping, the Starter plan gives you an easy, affordable launching pad.',
        keyHighlights: planTrans?.features?.slice(1, 4) || ['Essential invoicing & receipts', 'Basic cloud POS & income tracking', 'Accessible mobile-ready ledger'],
      };
    }

    // Default best match for most growing SMEs: Premium (10 Users)
    const plan = PRICING_PLANS.find((p) => p.id === 'premium') || PRICING_PLANS.find((p) => p.id === 'growth') || PRICING_PLANS[1];
    const planTrans = (t.pricing as any)[plan.id] || (t.pricing as any).professional;
    return {
      plan,
      reason: language === 'fr'
        ? 'Pour la majorité des PME africaines en croissance, la formule Professionnel est le choix parfait. Elle débloque la comptabilité complète, la caisse POS avancée, les déclarations de TVA et l’assistant IA.'
        : language === 'pt'
        ? 'Para a maioria das PMEs africanas em expansão, o plano Profissional é a escolha ideal. Inclui contabilidade completa, POS avançado, reconciliação bancária, IVA e assistente de negócios com IA.'
        : language === 'es'
        ? 'Para la mayoría de las pymes africanas en expansión, el plan Profesional es la mejor opción. Incluye contabilidad completa, TPV avanzado, conciliación bancaria, IVA y asistente comercial con IA.'
        : 'For most growing African businesses, the Professional plan is the sweet spot. It unlocks full double-entry accounting, advanced cloud POS, bank reconciliation, tax reports, multi-user permissions, and the AI business assistant.',
      keyHighlights: planTrans?.features?.slice(1, 4) || ['Full double-entry accounting & VAT filing', 'Advanced cloud POS with barcode support', 'AI Business Assistant & team permissions'],
    };
  };

  const recommendation = getRecommendation();
  const planTranslation = (t.pricing as any)[recommendation.plan.id] || {};
  const recommendedPlanName = planTranslation.name || recommendation.plan.name;

  return (
    <section id="plan-matcher" className="py-16 lg:py-24 bg-[#F8FAFC] dark:bg-[#060D17] border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 text-[#0A4FD5] dark:text-blue-300 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
            {t.planMatcher.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {t.planMatcher.title}
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t.planMatcher.subtitle}
          </p>
        </div>

        {/* 2-Step Selector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Questions */}
          <div className="lg:col-span-7 bg-white dark:bg-[#0B192C] p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-8">
            
            {/* Question 1 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[#0A4FD5] text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <label className="text-base font-bold text-slate-900 dark:text-white">
                  How big is your business?
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {BUSINESS_SIZES.map((size) => {
                  const isSelected = selectedSize === size.id;
                  return (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSize(size.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0A4FD5] bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-2 ring-[#0A4FD5]/20 dark:ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1C30] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-bold ${isSelected ? 'text-[#0A4FD5] dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                          {size.label}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{size.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 2 */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-[#0A4FD5] text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <label className="text-base font-bold text-slate-900 dark:text-white">
                  What do you need most?
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {PRIMARY_NEEDS.map((need) => {
                  const isSelected = selectedNeed === need.id;
                  return (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => setSelectedNeed(need.id)}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#0A4FD5] bg-blue-50/70 dark:bg-blue-950/40 shadow-xs ring-2 ring-[#0A4FD5]/20 dark:ring-blue-500/30'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D1C30] hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/80'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{need.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold ${isSelected ? 'text-[#0A4FD5] dark:text-blue-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {need.label}
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{need.desc}</div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Recommendation Output */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0B192C] to-[#0A4FD5] dark:from-[#050D18] dark:to-[#0A3280] text-white p-7 sm:p-9 rounded-2xl sm:rounded-3xl shadow-xl flex flex-col justify-between relative overflow-hidden">
            {/* Background geometric accents */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="relative">
              <div className="inline-flex items-center gap-1.5 bg-lime-400/20 text-lime-300 text-xs font-bold px-3 py-1 rounded-full border border-lime-400/30 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-lime-400" />
                {t.planMatcher.recommendationTitle}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {language === 'fr'
                  ? 'Nous recommandons la formule '
                  : language === 'pt'
                  ? 'Recomendamos o plano '
                  : language === 'es'
                  ? 'Le recomendamos el plan '
                  : 'We recommend the '}
                <span className="text-[#84CC16] underline decoration-lime-400/60 decoration-wavy">
                  {recommendedPlanName}
                </span>
              </h3>

              <div className="mt-2 text-xs font-bold text-slate-300 flex items-center gap-2 flex-wrap">
                <span className="text-lime-300 font-extrabold text-sm">
                  {recommendation.plan.customPricing
                    ? (planTranslation.customPricingText || t.common.customPricing)
                    : `Flat ${formatCurrency(recommendation.plan.monthlyPrice, currency)} / month`}
                </span>
                {!recommendation.plan.customPricing && (
                  <span className="text-slate-400 font-normal">
                    (or {formatCurrency(recommendation.plan.yearlyPricePerMonth, currency)}/mo {t.common.billedAnnually})
                  </span>
                )}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Unlimited Tx • ₦0 Fees
                </span>
              </div>

              <p className="mt-4 text-sm text-slate-200 leading-relaxed">
                {recommendation.reason}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-700/80">
                <div className="text-xs font-bold uppercase tracking-wider text-lime-400 mb-3">
                  {t.planMatcher.whyThisPlan}
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  {recommendation.keyHighlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#84CC16] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* CTA action */}
            <div className="mt-8 pt-6 border-t border-slate-700/80 relative space-y-2.5">
              <button
                type="button"
                onClick={() => openCheckout(recommendation.plan.id, 'yearly')}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] font-black text-sm py-3.5 px-6 rounded-xl shadow-lg shadow-lime-500/20 hover:shadow-lime-500/30 transition-all cursor-pointer group"
              >
                <CreditCard className="w-4 h-4" />
                <span>Subscribe to {recommendedPlanName} Plan</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => addItem(recommendation.plan.id, 'yearly')}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-600 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-lime-400" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => onSelectPlan(recommendation.plan.id)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Risk-Free Trial</span>
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-300 mt-1">
                23 Regional Gateways Supported • 7.5% Exclusive VAT Itemized • Instant Digital Invoices
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
