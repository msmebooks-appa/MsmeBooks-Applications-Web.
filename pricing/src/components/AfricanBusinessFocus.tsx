import React from 'react';
import { CheckCircle2, ShieldCheck, Smartphone, Landmark, Store, Globe, ArrowRight, Zap, ShoppingBag, Truck, Utensils, Pill } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AfricanBusinessFocus: React.FC<{ onOpenTrial: () => void }> = ({ onOpenTrial }) => {
  const { t, language } = useLanguage();

  const highlights = [
    {
      title: language === 'fr' ? 'Conçu pour les PME Africaines' : language === 'pt' ? 'Concebido para PMEs Africanas' : language === 'es' ? 'Diseñado para Pymes Africanas' : 'Designed for African SMEs',
      desc: language === 'fr' ? 'Adapté aux flux de trésorerie réels, aux délais d’encaissement et à la gestion de stock en Afrique.' : language === 'pt' ? 'Ajustado à realidade do fluxo de caixa e cobrança no comércio africano.' : language === 'es' ? 'Adaptado a los flujos reales de caja y cobro del comercio africano.' : 'Crafted around the unique cash flow, credit collection, and inventory realities of African commerce.',
    },
    {
      title: language === 'fr' ? 'Caisse POS Hors-Ligne 100%' : language === 'pt' ? 'POS 100% Offline' : language === 'es' ? 'TPV 100% Sin Conexión' : 'Uncompromised Offline POS',
      desc: language === 'fr' ? 'Continuez d’encaisser les ventes et d’imprimer les reçus même lors des coupures de courant ou de réseau.' : language === 'pt' ? 'Continue a vender e imprimir recibos mesmo sem internet ou durante falhas elétricas.' : language === 'es' ? 'Siga cobrando e imprimiendo tickets incluso ante apagones o caídas de internet.' : 'Keep checking out customers and issuing printed receipts when power or 4G drops. Auto-syncs securely.',
    },
    {
      title: language === 'fr' ? 'Paiements Mobiles & Mobile Money' : language === 'pt' ? 'Mobile Money e Pagamentos Locais' : language === 'es' ? 'Mobile Money y Pagos Locales' : 'Flexible Mobile Money & Gateways',
      desc: language === 'fr' ? 'Orange Money, Wave, MTN MoMo, Paystack, Flutterwave et virements bancaires instantanés intégrés.' : language === 'pt' ? 'Multicaixa Express, M-Pesa, E-Mola, Unitel Money e transferências bancárias integradas.' : language === 'es' ? 'Orange Money, Wave, M-Pesa, Paystack y transferencias bancarias directas integradas.' : 'Direct integrations with M-Pesa, MTN MoMo, Wave, Paystack, Flutterwave, and bank transfers.',
    },
    {
      title: language === 'fr' ? 'Gestion Multi-Devises' : language === 'pt' ? 'Multi-Moeda Pan-Africano' : language === 'es' ? 'Multidivisa Panafricana' : 'Pan-African Multi-Currency',
      desc: language === 'fr' ? 'Comptabilisez en FCFA (XAF/XOF), NGN, GHS, KES, USD, EUR avec taux de conversion en temps réel.' : language === 'pt' ? 'Controle em Kz, Meticais, NGN, KES, USD, EUR com taxas de câmbio dinâmicas.' : language === 'es' ? 'Facture en FCFA, NGN, GHS, KES, USD, EUR con tipos de cambio dinámicos.' : 'Price and reconcile in NGN, GHS, KES, ZAR, XAF, USD, EUR and 10+ regional currencies.',
    },
    {
      title: language === 'fr' ? 'Conformité Fiscale & TVA Locale' : language === 'pt' ? 'Conformidade Fiscal e IVA Local' : language === 'es' ? 'Fiscalidad Local e IVA' : 'Local Statutory Tax & Audit',
      desc: language === 'fr' ? 'Calcul automatisé de la TVA, retenues à la source et états comptables certifiés conformes.' : language === 'pt' ? 'Apuramento automático de IVA, retenções na fonte e mapas oficiais para o fisco.' : language === 'es' ? 'Cálculo automatizado de IVA, retenciones en origen e informes oficiales para auditoría.' : 'Automatic computation for VAT, Withholding Tax (WHT), and statutory audit reports.',
    },
  ];

  const industries = [
    { name: language === 'fr' ? 'Supermarchés & Détail' : language === 'pt' ? 'Supermercados e Retalho' : language === 'es' ? 'Supermercados y Comercio' : 'Supermarkets & Retail', icon: Store, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=600&auto=format&fit=crop&q=80', metric: '10,000+ Barcodes' },
    { name: language === 'fr' ? 'Pharmacies & Santé' : language === 'pt' ? 'Farmácias e Saúde' : language === 'es' ? 'Farmacias y Salud' : 'Pharmacies & Health', icon: Pill, image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=600&auto=format&fit=crop&q=80', metric: 'Batch & Expiry Tracking' },
    { name: language === 'fr' ? 'Grossistes & FMCG' : language === 'pt' ? 'Grossistas e Logística' : language === 'es' ? 'Mayoristas y Distribución' : 'Wholesale & FMCG', icon: Truck, image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80', metric: 'Multi-Warehouse Transfers' },
    { name: language === 'fr' ? 'Restaurants & Traiteurs' : language === 'pt' ? 'Restauração e Cafés' : language === 'es' ? 'Restaurantes y Cafeterías' : 'Restaurants & Bistros', icon: Utensils, image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80', metric: 'Offline POS & Tables' },
    { name: language === 'fr' ? 'Mode & Textiles' : language === 'pt' ? 'Moda e Tecidos' : language === 'es' ? 'Moda y Confección' : 'Fashion & Textiles', icon: ShoppingBag, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80', metric: 'Variants & Color Grids' },
  ];

  return (
    <section id="african-focus" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-[#070F1B] dark:via-[#091525] dark:to-[#070F1B] border-y border-slate-200/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-3">
            <Globe className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
            {t.africanFocus.badge}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B192C] dark:text-white tracking-tight">
            {t.africanFocus.title}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            {t.africanFocus.subtitle}
          </p>
        </div>

        {/* 10 Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {highlights.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#0B192C] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-[#0A4FD5] dark:hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-lime-100 dark:bg-lime-950/80 text-[#65A30D] dark:text-lime-400 flex items-center justify-center mb-3 font-black text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#65A30D] dark:text-lime-400" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* African SME Business Verticals Gallery */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[#0B192C] dark:text-white">
              Powering Every Type of African Enterprise
            </h3>
            <span className="text-xs text-[#0A4FD5] dark:text-blue-400 font-semibold hidden sm:inline">
              Over 15,000 active businesses across 8 African countries
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs bg-slate-900 aspect-4/3 flex flex-col justify-end p-4 transition-transform hover:-translate-y-1"
                >
                  <img
                    src={ind.image}
                    alt={ind.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-1.5 text-lime-400 text-xs font-bold mb-1">
                      <Icon className="w-3.5 h-3.5" />
                      <span>{ind.metric}</span>
                    </div>
                    <div className="text-sm font-black text-white">
                      {ind.name}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Local Payment Integration Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-blue-900 to-[#0A4FD5] dark:from-[#061838] dark:to-[#0A4FD5] text-white rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
              Payment Integrations
            </span>
            <h3 className="text-xl sm:text-2xl font-black mt-1">
              Connect Paystack, Flutterwave, NIBSS Direct Bank Transfer & POS Terminals
            </h3>
            <p className="text-sm text-slate-200 mt-2 max-w-2xl">
              Automatic payment link reconciliation ensures whenever customers pay via transfer or card, your invoice marks as paid and ledger updates instantly.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenTrial}
            className="shrink-0 bg-[#84CC16] hover:bg-[#65A30D] text-[#0B192C] font-black text-sm px-6 py-3.5 rounded-xl shadow-md transition-all cursor-pointer"
          >
            Start Risk-Free Trial
          </button>
        </div>

      </div>
    </section>
  );
};
