import React from 'react';
import {
  ShoppingBag,
  Utensils,
  Hotel,
  Building2,
  Briefcase,
  Calculator,
  Truck,
  Globe,
  Sparkles,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const TrustBar: React.FC = () => {
  const businessLogos = [
    { name: 'Afrimart Supermarkets', category: 'Retail Chain', icon: ShoppingBag, location: 'Lagos & Abuja' },
    { name: 'Savannah Grill & Lounge', category: 'Hospitality', icon: Utensils, location: 'Nairobi' },
    { name: 'GoldCoast Grand Hotel', category: 'Hotels', icon: Hotel, location: 'Accra' },
    { name: 'PrimeApex Properties', category: 'Real Estate', icon: Building2, location: 'Kigali' },
    { name: 'Sithole Advisory Partners', category: 'Professional Services', icon: Briefcase, location: 'Johannesburg' },
    { name: 'Beacon Chartered Accountants', category: 'Accounting Firm', icon: Calculator, location: 'Lagos' },
    { name: 'Trans-Sahara Distributors', category: 'Wholesale Depot', icon: Truck, location: 'Kampala' },
    { name: 'Zuri Essentials Lifestyle', category: 'E-commerce Brand', icon: Globe, location: 'Dar es Salaam' },
  ];

  return (
    <section className="py-12 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0866FF] dark:text-blue-400">
            Verified Traction Across the Continent
          </p>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white font-display mt-1">
            Trusted by Businesses, Entrepreneurs and Professionals
          </h2>
        </div>

        {/* Business Categories Logo Carousel / Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-12">
          {businessLogos.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="group p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-[#0E172A] hover:bg-white dark:hover:bg-[#131D31] hover:border-blue-200 dark:hover:border-blue-900 hover:shadow-md transition-all duration-200 flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-slate-800 shadow-xs border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 group-hover:text-[#0866FF] dark:group-hover:text-[#B7F000] group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors mb-2">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-[#0866FF] dark:group-hover:text-[#B7F000] transition-colors">
                  {b.name}
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{b.category}</span>
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.2 rounded mt-1">
                  {b.location}
                </span>
              </div>
            );
          })}
        </div>

        {/* Statistic Strip with Blue and Lemon-Green Accents */}
        <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-[#0A1E4A] to-slate-900 text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-slate-800/80">
          {/* Subtle glow circle */}
          <div className="absolute top-0 right-1/4 w-64 h-64 bg-[#B7F000]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
            {/* Stat 1 */}
            <div className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:px-4">
              <div className="text-3xl sm:text-4xl font-black text-white font-display flex items-center gap-1">
                <span>10,000</span>
                <span className="text-[#B7F000]">+</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">Active Businesses</div>
              <p className="text-xs text-slate-400 mt-0.5">Managing daily sales &amp; stock</p>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:px-4">
              <div className="text-3xl sm:text-4xl font-black text-white font-display flex items-center gap-1">
                <span>50,000</span>
                <span className="text-[#0866FF]">+</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">Empowered Users</div>
              <p className="text-xs text-slate-400 mt-0.5">Founders, cashiers, accountants</p>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:px-4">
              <div className="text-3xl sm:text-4xl font-black text-white font-display flex items-center gap-1">
                <span>Millions</span>
              </div>
              <div className="text-sm font-bold text-[#B7F000] mt-1">Transactions Processed</div>
              <p className="text-xs text-slate-400 mt-0.5">Over $450M+ in volume reconciled</p>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center text-center pt-4 sm:pt-0 sm:px-4">
              <div className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-1.5">
                <span className="text-[#B7F000]">Built for</span>
                <span className="text-[#0866FF]">Africa</span>
              </div>
              <div className="text-sm font-bold text-slate-200 mt-1">14+ African Markets</div>
              <p className="text-xs text-slate-400 mt-0.5">Mobile money, VAT &amp; local banking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
