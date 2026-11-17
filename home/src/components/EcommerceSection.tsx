import React from 'react';
import {
  Globe,
  ShoppingBag,
  CreditCard,
  Truck,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Sparkles,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';

interface EcommerceSectionProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
}

export const EcommerceSection: React.FC<EcommerceSectionProps> = ({ currentCurrency, onOpenStartFree }) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;

  const onlineProducts = [
    { name: 'Heritage Ankara Jacket', price: 34000, img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80', stock: '14 left in Lagos Depot' },
    { name: 'Cold Pressed Coconut Oil 1L', price: 6800, img: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=300&q=80', stock: '48 left in Warehouse' },
    { name: 'Artisan African Coffee Beans', price: 9200, img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80', stock: '22 left in Nairobi Depot' },
  ];

  return (
    <section id="ecommerce" className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#090E1A] border-b border-slate-200/70 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>Integrated Digital Storefront</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
              Take Your Business{' '}
              <span className="text-[#0866FF] dark:text-blue-400">Online.</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Launch a branded online storefront in minutes that directly links to your physical store inventory. When a customer buys on your website or WhatsApp, stock depletes instantly in your warehouse so you never oversell.
            </p>

            <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span><strong>Instant Product Catalogue:</strong> Turn your existing inventory into a beautiful digital e-commerce store with one click.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span><strong>African Payment Gateways:</strong> Pre-integrated with Paystack, Flutterwave, M-Pesa, and Card rails with zero coding.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                <span><strong>Courier &amp; Delivery Integration:</strong> Generate waybills and calculate shipping rates automatically.</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenStartFree}
                className="px-7 py-4 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
              >
                <span>Launch Your Online Store</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Storefront UI Mockup */}
          <div className="lg:col-span-6">
            <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200/90 dark:border-slate-800 space-y-5 relative">
              {/* Storefront Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-[#B7F000] font-black flex items-center justify-center text-xs">
                    MB
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">store.afrimart.com</div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Live E-commerce Storefront</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#0866FF] dark:text-[#B7F000]" />
                    <span>Cart (2)</span>
                  </div>
                </div>
              </div>

              {/* Product Grid Mockup */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {onlineProducts.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900 flex flex-col justify-between">
                    <div className="rounded-lg overflow-hidden aspect-square mb-2 bg-slate-200 dark:bg-slate-800 relative">
                      <img
                        src={p.img}
                        alt={p.name}
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to high-availability product image if external CDN throttles
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</div>
                      <div className="text-xs font-black text-[#0866FF] dark:text-[#B7F000] font-mono mt-0.5">
                        {currency.format(p.price)}
                      </div>
                      <div className="text-[9px] text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                        {p.stock}
                      </div>
                    </div>
                    <button className="mt-2 w-full py-1.5 rounded-lg bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:text-[#0866FF] dark:hover:text-[#B7F000] transition-colors">
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>

              {/* Real-time sync badge */}
              <div className="p-3 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Two-way warehouse inventory sync active
                  </span>
                </div>
                <span className="text-[10px] font-bold text-[#0866FF] dark:text-[#B7F000]">Zero Overselling</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
