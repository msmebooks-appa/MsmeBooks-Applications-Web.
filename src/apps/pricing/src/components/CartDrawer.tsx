import React from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Tag,
  Building,
  Layers,
  PhoneCall,
  Check,
  Calendar,
  Globe,
  FileDown,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';
import { FEATURED_PROMO_OFFERS } from '../data/promoCodes';
import { PRICING_PLANS } from '../data/pricingData';
import { CartCurrencySelector } from './CartCurrencySelector';
import { generateQuoteDocument } from '../utils/generateQuotePdf';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    openCheckout,
    removeItem,
    updateQuantity,
    updateBillingPeriod,
    updateAddOns,
    clearCart,
    promoCodeInput,
    setPromoCodeInput,
    appliedPromo,
    promoMessage,
    applyPromoCode,
    removePromoCode,
    subtotalNgn,
    planSavingsNgn,
    promoDiscountNgn,
    netTaxableAmountNgn,
    vatRatePercent,
    vatAmountNgn,
    totalPayableNgn,
  } = useCart();

  const { format, currency, activeCurrency } = useCurrency();

  const handleDownloadQuote = () => {
    const quoteNumber = `QUO-2025-${Math.floor(10000 + Math.random() * 90000)}`;
    const today = new Date();
    const validUntilDate = new Date();
    validUntilDate.setDate(today.getDate() + 30);

    generateQuoteDocument({
      quoteNumber,
      date: today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      validUntil: validUntilDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      customer: {
        businessName: 'Prospective Client Organization',
        contactName: 'Finance / Managing Director',
        country: activeCurrency.country || 'Nigeria',
      },
      items,
      subtotalNgn,
      savingsNgn: planSavingsNgn,
      promoDiscountNgn,
      netTaxableNgn: netTaxableAmountNgn,
      vatRatePercent,
      vatAmountNgn,
      totalPayableNgn,
      activeCurrency,
      formatCurrencyFn: format,
    });
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      {/* Background click to dismiss */}
      <div className="absolute inset-0" onClick={closeCart} />

      {/* Drawer Panel */}
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0B192C] h-full shadow-2xl flex flex-col border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#0B192C] to-[#0A4FD5] text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lime-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black flex items-center gap-2">
                Subscription Cart
                <span className="text-[10px] bg-lime-400 text-slate-950 font-bold px-2 py-0.5 rounded-full">
                  {items.length} {items.length === 1 ? 'Plan' : 'Plans'}
                </span>
              </h2>
              <p className="text-[11px] text-blue-200">
                Transparent Pan-African Billing in {activeCurrency.code} ({activeCurrency.symbol})
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closeCart}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body: Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* World Payment Currency Selector with Nigeria as Default */}
          <CartCurrencySelector />

          {items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
                Your cart is empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select a plan from our pricing table to subscribe or add branch licenses.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#0A4FD5] text-white rounded-xl text-xs font-bold hover:bg-[#073AA0] cursor-pointer"
              >
                <span>Browse Pricing Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Item Cards */}
              <div className="space-y-3">
                {items.map((item) => {
                  const planObj = PRICING_PLANS.find((p) => p.id === item.planId);
                  const isYearly = item.billingPeriod === 'yearly';

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-50 dark:bg-[#071324] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 relative space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-slate-900 dark:text-white">
                              {item.planName} Plan
                            </span>
                            {isYearly && (
                              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-300/40">
                                Save 20%
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {planObj?.bestFor || 'Business management & POS'}
                          </p>
                          {item.volumeDetails && (
                            <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md border border-emerald-200/60 dark:border-emerald-800/50">
                              <span>
                                {item.volumeDetails.users} {item.volumeDetails.users === 1 ? 'Seat' : 'Seats'} • Unlimited Tx (₦0 fees)
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Billing Period Toggle (Monthly: 1 qty, Yearly: 12 qty) */}
                      <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          Billing Plan Cycle:
                        </span>
                        <div className="inline-flex bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px]">
                          <button
                            type="button"
                            onClick={() => updateBillingPeriod(item.id, 'monthly')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                              !isYearly
                                ? 'bg-[#0A4FD5] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            Monthly (1 Mo)
                          </button>
                          <button
                            type="button"
                            onClick={() => updateBillingPeriod(item.id, 'yearly')}
                            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
                              isYearly
                                ? 'bg-[#0A4FD5] text-white shadow-xs'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                            }`}
                          >
                            <span>Annual (12 Mos)</span>
                            <span className="text-[9px] bg-lime-400 text-slate-950 px-1 rounded font-black">
                              -20%
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Subscription Plan Duration & Quantity Stepper */}
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#0A4FD5]" />
                              <span>Subscription Duration:</span>
                            </div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400">
                              {isYearly
                                ? `${item.quantity} Months (${item.quantity / 12} ${item.quantity === 12 ? 'Year' : 'Years'}) • ${format(item.basePriceNgn)}/mo`
                                : `${item.quantity} ${item.quantity === 1 ? 'Month' : 'Months'} • ${format(item.basePriceNgn)}/mo`}
                            </div>
                          </div>

                          {/* Stepper with 1 for monthly and 12 for yearly */}
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                if (isYearly) {
                                  updateQuantity(item.id, Math.max(12, item.quantity - 12));
                                } else {
                                  updateQuantity(item.id, Math.max(1, item.quantity - 1));
                                }
                              }}
                              disabled={isYearly ? item.quantity <= 12 : item.quantity <= 1}
                              className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                              title={isYearly ? 'Reduce by 12 months (1 year)' : 'Reduce by 1 month'}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>

                            <div className="text-center min-w-[54px] px-1 py-0.5 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-200/60 dark:border-slate-700">
                              <span className="font-black text-sm text-[#0B192C] dark:text-white block">
                                {item.quantity}
                              </span>
                              <span className="text-[9px] text-slate-500 font-bold block -mt-0.5">
                                {isYearly
                                  ? (item.quantity === 12 ? '12 Mos (1 Yr)' : `${item.quantity} Mos`)
                                  : (item.quantity === 1 ? '1 Month' : `${item.quantity} Mos`)}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                if (isYearly) {
                                  updateQuantity(item.id, item.quantity + 12);
                                } else {
                                  updateQuantity(item.id, item.quantity + 1);
                                }
                              }}
                              className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/70 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-[#0A4FD5] dark:text-blue-300 flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                              title={isYearly ? 'Add 12 months (1 year)' : 'Add 1 month'}
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets for Duration */}
                        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px]">
                          <span className="text-slate-400 font-medium shrink-0">Duration:</span>
                          {isYearly ? (
                            <>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 12)}
                                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                                  item.quantity === 12
                                    ? 'bg-[#0A4FD5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                12 Months (1 Yr)
                              </button>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 24)}
                                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                                  item.quantity === 24
                                    ? 'bg-[#0A4FD5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                24 Months (2 Yrs)
                              </button>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 36)}
                                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                                  item.quantity === 36
                                    ? 'bg-[#0A4FD5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                36 Months (3 Yrs)
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 1)}
                                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                                  item.quantity === 1
                                    ? 'bg-[#0A4FD5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                1 Month
                              </button>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 3)}
                                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                                  item.quantity === 3
                                    ? 'bg-[#0A4FD5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                3 Months
                              </button>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.id, 6)}
                                className={`px-2 py-0.5 rounded-md font-bold transition-colors cursor-pointer ${
                                  item.quantity === 6
                                    ? 'bg-[#0A4FD5] text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                                }`}
                              >
                                6 Months
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Add-ons for the plan */}
                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 space-y-2">
                        <div className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Optional Scale Add-ons
                        </div>

                        {/* Extra branches */}
                        <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <Building className="w-3.5 h-3.5 text-[#0A4FD5]" />
                            <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                              Extra Branch POS (+{format(5000)}/mo)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateAddOns(item.id, {
                                  extraBranches: Math.max(0, (item.addOns?.extraBranches || 0) - 1),
                                })
                              }
                              className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.addOns?.extraBranches || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateAddOns(item.id, {
                                  extraBranches: (item.addOns?.extraBranches || 0) + 1,
                                })
                              }
                              className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Extra warehouses */}
                        <div className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                          <div className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-lime-500" />
                            <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                              Warehouse Depot Sync (+{format(8000)}/mo)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateAddOns(item.id, {
                                  extraWarehouses: Math.max(0, (item.addOns?.extraWarehouses || 0) - 1),
                                })
                              }
                              className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold w-4 text-center">
                              {item.addOns?.extraWarehouses || 0}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateAddOns(item.id, {
                                  extraWarehouses: (item.addOns?.extraWarehouses || 0) + 1,
                                })
                              }
                              className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 flex items-center justify-center text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Dedicated SLA */}
                        <label className="flex items-center justify-between text-xs bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200/60 dark:border-slate-800/60 cursor-pointer">
                          <div className="flex items-center gap-2">
                            <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-slate-700 dark:text-slate-300 text-[11px]">
                              24/7 Priority Phone SLA (+{format(12000)}/mo)
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={!!item.addOns?.priorityPhoneSla}
                            onChange={(e) =>
                              updateAddOns(item.id, { priorityPhoneSla: e.target.checked })
                            }
                            className="w-4 h-4 rounded text-[#0A4FD5] focus:ring-[#0A4FD5] cursor-pointer"
                          />
                        </label>
                      </div>

                      {/* Line Item Total */}
                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 font-medium">Plan Line Subtotal:</span>
                          <span className="text-[10px] text-slate-400 block">
                            {format(item.basePriceNgn)}/mo × {item.quantity} {item.quantity === 1 ? 'Month' : 'Months'}
                          </span>
                        </div>
                        <span className="font-extrabold text-sm text-[#0B192C] dark:text-white">
                          {format(item.basePriceNgn * item.quantity)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Promotion Codes Section */}
              <div className="bg-slate-50 dark:bg-[#071324] rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                    <Tag className="w-3.5 h-3.5 text-[#0A4FD5]" />
                    <span>Promotion Code & Discounts</span>
                  </div>
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={removePromoCode}
                      className="text-[10px] text-red-500 hover:underline font-semibold cursor-pointer"
                    >
                      Remove Code
                    </button>
                  )}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter code (e.g. PANAFRICA25)"
                    className="flex-1 uppercase font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0A4FD5]"
                  />
                  <button
                    type="button"
                    onClick={() => applyPromoCode(promoCodeInput)}
                    className="px-4 py-2 bg-[#0B192C] dark:bg-slate-800 hover:bg-[#0A4FD5] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p
                    className={`text-[11px] font-medium ${
                      appliedPromo ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                    }`}
                  >
                    {promoMessage}
                  </p>
                )}

                {/* Quick Promotion Code Chips */}
                <div className="space-y-1.5 pt-1 border-t border-slate-200/60 dark:border-slate-800/60">
                  <span className="text-[10px] text-slate-400 block font-semibold">
                    Available Offers (Tap to apply):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {FEATURED_PROMO_OFFERS.map((offer) => (
                      <button
                        key={offer.code}
                        type="button"
                        onClick={() => {
                          setPromoCodeInput(offer.code);
                          applyPromoCode(offer.code);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                          appliedPromo?.code === offer.code
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-400/30'
                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400'
                        }`}
                      >
                        <Sparkles className="w-2.5 h-2.5 text-lime-500" />
                        <span>{offer.code}</span>
                        <span className="text-slate-400 font-normal">({offer.tag})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 7.5% Exclusive VAT Section & Tax Breakdown */}
              <div className="bg-blue-50/70 dark:bg-[#08172c] rounded-2xl p-4 border border-blue-200/80 dark:border-blue-900/60 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-blue-200/60 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                    <ShieldCheck className="w-4 h-4 text-[#84CC16]" />
                    <span>Statutory Tax & Summary</span>
                  </div>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-[#0A4FD5] dark:text-blue-300 px-2 py-0.5 rounded-full font-bold">
                    TIN: 24810932-0001
                  </span>
                </div>

                {/* Subtotal */}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Gross Subtotal:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {format(subtotalNgn)}
                  </span>
                </div>

                {/* Annual Savings if any */}
                {planSavingsNgn > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <span>Annual Billing Savings (20% OFF):</span>
                    </span>
                    <span>-{format(planSavingsNgn)}</span>
                  </div>
                )}

                {/* Promo Code Savings */}
                {appliedPromo && promoDiscountNgn > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/80 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800/40">
                    <span className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span>Promotion Discount ({appliedPromo.code}):</span>
                    </span>
                    <span>Amount Saved: -{format(promoDiscountNgn)}</span>
                  </div>
                )}

                {/* Net Taxable Amount */}
                <div className="flex justify-between text-slate-700 dark:text-slate-300 font-medium pt-1 border-t border-blue-200/40 dark:border-slate-800">
                  <span>Net Taxable Amount:</span>
                  <span>{format(netTaxableAmountNgn)}</span>
                </div>

                {/* 7.5% Exclusive VAT line item */}
                <div className="flex justify-between items-center text-slate-900 dark:text-white font-bold bg-white dark:bg-slate-900 p-2 rounded-xl border border-blue-200 dark:border-slate-800">
                  <div>
                    <span className="block text-xs font-black text-[#0A4FD5] dark:text-blue-400">
                      Exclusive VAT ({vatRatePercent}%)
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                      Statutory Value Added Tax for electronic services
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    +{format(vatAmountNgn)}
                  </span>
                </div>

                {/* Grand Total */}
                <div className="flex justify-between items-baseline pt-2 border-t border-blue-200 dark:border-slate-800">
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    Total Payable:
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-black text-[#0A4FD5] dark:text-blue-400">
                      {format(totalPayableNgn)}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Includes all 7.5% VAT and statutory invoice charges
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer: Actions */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B192C] space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => openCheckout()}
                className="w-full py-3.5 px-4 bg-[#0A4FD5] hover:bg-[#073AA0] text-white rounded-xl font-black text-xs shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleDownloadQuote}
                className="w-full py-3 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Generate printable PDF quote for internal procurement sign-off"
              >
                <FileDown className="w-4 h-4 text-[#0A4FD5] dark:text-blue-400" />
                <span>Download PDF Quote</span>
              </button>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                23 Regional Gateways Supported
              </span>
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-red-500 transition-colors cursor-pointer"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
