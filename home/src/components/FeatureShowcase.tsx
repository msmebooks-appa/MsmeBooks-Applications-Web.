import React, { useState } from 'react';
import {
  Calculator,
  FileText,
  Package,
  Smartphone,
  Users,
  Receipt,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Download,
  Send,
  Sparkles,
  Bell,
  BellRing,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';
import { useNotification } from '../context/NotificationContext';

interface FeatureShowcaseProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
  onOpenBookDemo?: () => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({
  currentCurrency,
  onOpenStartFree,
  onOpenBookDemo,
}) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;

  const { sendInvoicePaymentAlert, sendLowStockAlert, openProfile } = useNotification();
  const [paymentSimulated, setPaymentSimulated] = useState(false);
  const [stockAlertTriggered, setStockAlertTriggered] = useState<string | null>(null);

  // Interactive state for Invoicing demo
  const [invoiceItems] = useState([
    { desc: 'Industrial Baking Flour (50kg)', qty: 20, price: 54000 },
    { desc: 'Refined Sugar Bags (50kg)', qty: 10, price: 62000 },
    { desc: 'Baking Yeast & Additives Carton', qty: 5, price: 38000 },
  ]);

  const invoiceSubtotal = invoiceItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const invoiceVat = invoiceSubtotal * 0.075;
  const invoiceTotal = invoiceSubtotal + invoiceVat;

  const handleSimulatePaymentReceived = async () => {
    setPaymentSimulated(true);
    await sendInvoicePaymentAlert(
      '#INV-2026-0842',
      'Savannah Retail Ltd',
      currency.format(invoiceTotal),
      'M-Pesa / Bank Transfer'
    );
    setTimeout(() => setPaymentSimulated(false), 4000);
  };

  const handleTriggerLowStockAlert = async (itemName: string, remaining: number, threshold: number) => {
    setStockAlertTriggered(itemName);
    await sendLowStockAlert(itemName, remaining, threshold, 'Branch 1 Ikeja Depot');
    setTimeout(() => setStockAlertTriggered(null), 3000);
  };

  // POS State
  const [posCart] = useState([
    { name: 'Men Linen Safari Shirt', price: 24500, qty: 1 },
    { name: 'Handcrafted Leather Slippers', price: 18000, qty: 2 },
  ]);
  const posSubtotal = posCart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div id="features" className="bg-white dark:bg-[#090E1A] divide-y divide-slate-100 dark:divide-slate-800/80 transition-colors duration-200">
      {/* 1. Accounting */}
      <section className="py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-3.5 h-3.5" />
                <span>Financial Accounting Engine</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                Know Your Numbers.{' '}
                <span className="text-[#0866FF] dark:text-blue-400">Control Your Business.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Take the guesswork out of your financial health. MsmeBooks automates your General Ledger, Profit &amp; Loss statements, Balance Sheets, and Cash Flow reconciliations in accordance with African statutory accounting standards.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 pt-2">
                {[
                  'Real-time Profit & Loss (P&L)',
                  'Automated Balance Sheets',
                  'Cash Flow Forecasting',
                  'General Ledger Audit Trails',
                  'Multi-Currency Exchange Accounting',
                  'Statutory Tax-Ready Reports',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-4">
                <button
                  onClick={onOpenStartFree}
                  className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
                >
                  <span>Explore Accounting</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                {onOpenBookDemo && (
                  <button
                    onClick={onOpenBookDemo}
                    className="px-5 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-sm transition-all"
                  >
                    Request Sample P&amp;L Demo
                  </button>
                )}
              </div>
            </div>

            {/* Right Interactive Mockup: P&L Statement */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div>
                    <span className="text-[11px] font-mono text-[#B7F000] uppercase tracking-wider">
                      Statement of Comprehensive Income
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Automated Profit &amp; Loss</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Currency</span>
                    <div className="text-xs font-mono font-bold text-[#B7F000]">{currency.code}</div>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-mono">
                  {/* Revenue Block */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 pb-1 border-b border-slate-800">
                      <span>1. OPERATING REVENUE</span>
                      <span className="text-white">{currency.format(14850000)}</span>
                    </div>
                    <div className="pl-3 pt-1.5 space-y-1 text-slate-400 text-[11px]">
                      <div className="flex justify-between">
                        <span>POS In-Store Sales (Branch 1 &amp; 2)</span>
                        <span>{currency.format(9250000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Corporate Invoicing &amp; Retainers</span>
                        <span>{currency.format(5600000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* COGS Block */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 pb-1 border-b border-slate-800">
                      <span>2. COST OF GOODS SOLD (COGS)</span>
                      <span className="text-amber-400">-{currency.format(6200000)}</span>
                    </div>
                    <div className="pl-3 pt-1.5 space-y-1 text-slate-400 text-[11px]">
                      <div className="flex justify-between">
                        <span>Wholesale Inventory Purchases</span>
                        <span>{currency.format(5400000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Direct Freight &amp; Port Clearing</span>
                        <span>{currency.format(800000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gross Profit */}
                  <div className="flex justify-between font-bold text-emerald-400 py-1.5 px-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60">
                    <span>GROSS PROFIT</span>
                    <span>{currency.format(8650000)} (58.2%)</span>
                  </div>

                  {/* Opex */}
                  <div>
                    <div className="flex justify-between font-bold text-slate-300 pb-1 border-b border-slate-800">
                      <span>3. OPERATING EXPENSES (OPEX)</span>
                      <span className="text-rose-400">-{currency.format(2900000)}</span>
                    </div>
                    <div className="pl-3 pt-1.5 space-y-1 text-slate-400 text-[11px]">
                      <div className="flex justify-between">
                        <span>Staff Salaries &amp; Statutory Pensions</span>
                        <span>{currency.format(1800000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store Utilities &amp; Generator Fuel</span>
                        <span>{currency.format(650000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Marketing &amp; Digital Storefront</span>
                        <span>{currency.format(450000)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Profit */}
                  <div className="flex justify-between font-black text-sm text-[#B7F000] py-2 px-3 rounded-xl bg-slate-800/90 border border-[#B7F000]/40">
                    <span>NET OPERATING PROFIT</span>
                    <span className="text-base">{currency.format(5750000)} (38.7%)</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Reconciled with GTBank, Access &amp; M-Pesa</span>
                  <span className="text-emerald-400 font-bold">100% Tax-Audit Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Invoicing */}
      <section className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#0B1120] overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Mockup: Live Interactive Invoice */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 dark:border-slate-800 relative">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#0866FF] text-white flex items-center justify-center font-bold text-xs">
                      MB
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">INVOICE #INV-2026-0842</span>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Due on receipt &bull; WhatsApp link ready</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#0866FF] dark:text-[#B7F000] bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full">
                    Active Preview
                  </span>
                </div>

                {/* Bill To & Dates */}
                <div className="grid grid-cols-2 gap-3 text-xs mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Billed To:</span>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">Savannah Retail Ltd</div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px]">Nairobi &bull; info@savannah.co.ke</div>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Payment Link:</span>
                    <div className="font-bold text-[#0866FF] dark:text-blue-400 mt-0.5 flex items-center gap-1">
                      <span>M-Pesa / Card / Transfer</span>
                    </div>
                    <div className="text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">Verified Instant Payout</div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="space-y-2 mb-4">
                  {invoiceItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 text-xs transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{item.desc}</div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Qty: {item.qty} &bull; Unit: {currency.format(item.price)}
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {currency.format(item.qty * item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-mono">{currency.format(invoiceSubtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>VAT (7.5%)</span>
                    <span className="font-mono">{currency.format(invoiceVat)}</span>
                  </div>
                  <div className="flex justify-between font-black text-sm sm:text-base text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Total Due</span>
                    <span className="text-[#0866FF] dark:text-[#B7F000] font-mono">{currency.format(invoiceTotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-5 space-y-2">
                  <div className="grid grid-cols-2 gap-2.5">
                    <button className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                      <Send className="w-3.5 h-3.5" />
                      <span>Send via WhatsApp</span>
                    </button>
                    <button className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>

                  {/* Browser Notification Trigger: Simulate Payment Received */}
                  <button
                    onClick={handleSimulatePaymentReceived}
                    className={`w-full py-2.5 px-3 rounded-xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      paymentSimulated
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md scale-[0.99]'
                        : 'bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    }`}
                  >
                    <BellRing className={`w-3.5 h-3.5 ${paymentSimulated ? 'animate-bounce' : 'text-emerald-600 dark:text-emerald-400'}`} />
                    <span>
                      {paymentSimulated
                        ? 'Payment Alert Triggered to Browser!'
                        : 'Simulate Client Payment (Triggers Alert)'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>Instant Invoicing &amp; Estimates</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                Create Professional Invoices{' '}
                <span className="text-[#0866FF] dark:text-blue-400">in Seconds.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Bill clients in Naira, Kenyan Shillings, Cedis, Rand, or USD. Receive payments instantly via direct Paystack, Flutterwave, and M-Pesa links embedded right inside your invoices.
              </p>

              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Estimates &amp; Quotes:</strong> Convert accepted proposals into finalized invoices with one tap.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Automated Reminders:</strong> Polite SMS and WhatsApp payment reminders before and on due dates.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Recurring Retainers:</strong> Automate subscriptions and monthly client retainers hands-free.</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenStartFree}
                  className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
                >
                  <span>Create Your First Invoice</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Inventory */}
      <section className="py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Package className="w-3.5 h-3.5" />
                <span>Multi-Warehouse Inventory Control</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                Know What You Have.{' '}
                <span className="text-[#0866FF] dark:text-blue-400">Know What You Need.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Eliminate stock shrinkage, out-of-stock losses, and dead stock. MsmeBooks monitors your product levels across multiple branches, warehouses, and storage depots in real time.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 pt-2">
                {[
                  'Live Stock Depletion at Checkout',
                  'Low-Stock Automated Alerts',
                  'Inter-Branch Stock Transfer Logs',
                  'Purchase Orders (PO) Generation',
                  'Batch & Expiry Date Management',
                  'Product Variants (Sizes, Colors, Units)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenStartFree}
                  className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
                >
                  <span>Explore Inventory</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Mockup: Live Inventory Table */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Stock Inventory Matrix</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Branch 1 &bull; Ikeja Depot</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>3 Items Below Threshold</span>
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 font-semibold uppercase text-[10px]">
                        <th className="py-2">Item Name</th>
                        <th className="py-2">In Stock</th>
                        <th className="py-2">Reorder Level</th>
                        <th className="py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                      <tr>
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">Golden Penny Flour 50kg</td>
                        <td className="py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">142 bags</td>
                        <td className="py-2.5 text-slate-400 dark:text-slate-500">30 bags</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">Healthy</span>
                        </td>
                      </tr>
                      <tr className="bg-amber-50/50 dark:bg-amber-950/20 group">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                          <div>Grand Pure Soya Oil 5L</div>
                          <span className="text-[10px] text-slate-400">SKU: OIL-SOYA-5L</span>
                        </td>
                        <td className="py-2.5 font-mono text-amber-600 dark:text-amber-400 font-bold">8 bottles</td>
                        <td className="py-2.5 text-slate-400 dark:text-slate-500">20 bottles</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => handleTriggerLowStockAlert('Grand Pure Soya Oil 5L', 8, 20)}
                            title="Click to trigger Low Stock browser alert"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-800 dark:text-amber-200 font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            <Bell className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span>{stockAlertTriggered === 'Grand Pure Soya Oil 5L' ? 'Alert Sent!' : 'Low Stock'}</span>
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">Ankara African Wax 6-Yds</td>
                        <td className="py-2.5 font-mono text-slate-900 dark:text-white font-bold">85 bundles</td>
                        <td className="py-2.5 text-slate-400 dark:text-slate-500">25 bundles</td>
                        <td className="py-2.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">Healthy</span>
                        </td>
                      </tr>
                      <tr className="bg-red-50/40 dark:bg-red-950/20 group">
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">
                          <div>Basmati Premium Rice 25kg</div>
                          <span className="text-[10px] text-slate-400">SKU: RICE-BASM-25</span>
                        </td>
                        <td className="py-2.5 font-mono text-red-600 dark:text-red-400 font-bold">2 bags</td>
                        <td className="py-2.5 text-slate-400 dark:text-slate-500">15 bags</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => handleTriggerLowStockAlert('Basmati Premium Rice 25kg', 2, 15)}
                            title="Click to trigger Critical Low Stock browser alert"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-100 hover:bg-red-200 dark:bg-red-900/60 dark:hover:bg-red-800 text-red-700 dark:text-red-300 font-bold text-[10px] transition-colors cursor-pointer animate-pulse"
                          >
                            <BellRing className="w-3 h-3 text-red-600 dark:text-red-400" />
                            <span>{stockAlertTriggered === 'Basmati Premium Rice 25kg' ? 'Alert Sent!' : 'Critical Alert'}</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Auto-stock alerts enabled</span>
                    <button
                      onClick={() => openProfile('notifications')}
                      className="text-[#0866FF] dark:text-[#B7F000] font-semibold underline ml-1 cursor-pointer"
                    >
                      Configure Thresholds
                    </button>
                  </div>
                  <button className="text-xs font-bold text-[#0866FF] dark:text-[#B7F000] hover:underline flex items-center gap-1">
                    <span>Create Inter-Branch Transfer</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. POS (Point of Sale) */}
      <section className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#0B1120] overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Interactive POS Terminal */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-5 h-5 text-[#B7F000]" />
                    <div>
                      <div className="text-xs font-bold text-white">MsmeBooks POS &bull; Terminal 02</div>
                      <div className="text-[10px] text-slate-400">Cashier: Blessing &bull; Offline Sync ON</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#B7F000] text-slate-950">
                    Fast Checkout
                  </span>
                </div>

                {/* Items in Cart */}
                <div className="space-y-2 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Current Order (2 items):</span>
                  {posCart.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 text-xs">
                      <div>
                        <div className="font-bold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.qty} x {currency.format(item.price)}</div>
                      </div>
                      <span className="font-mono font-bold text-[#B7F000]">
                        {currency.format(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total + Payment Methods */}
                <div className="p-3 bg-slate-800 rounded-xl space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span>Payable Total</span>
                    <span className="text-xl font-black text-[#B7F000] font-mono">
                      {currency.format(posSubtotal)}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-[11px] font-semibold text-center">
                    <button className="p-2 rounded-lg bg-[#0866FF] text-white hover:bg-blue-600 transition-colors">
                      Card / POS
                    </button>
                    <button className="p-2 rounded-lg bg-emerald-700 text-white hover:bg-emerald-600 transition-colors">
                      M-Pesa / MoMo
                    </button>
                    <button className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                      Bank Transfer
                    </button>
                    <button className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 transition-colors">
                      Cash
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Digital Receipt dispatched to WhatsApp</span>
                  <span className="text-[#B7F000]">&bull; Stock Auto-Deducted</span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Modern Point of Sale</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                Turn Every Sale Into a{' '}
                <span className="text-[#0866FF] dark:text-blue-400">Seamless Experience.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether on a tablet, laptop, barcode counter or Android phone, MsmeBooks POS processes sales in milliseconds. Even during internet outages, it saves every transaction locally and reconciles as soon as you reconnect.
              </p>

              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Multi-Payment Splits:</strong> Allow customers to pay part cash, part mobile money, and part card.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Staff Cashier Drawers:</strong> Eliminate discrepancies with end-of-shift cash drawer reconciliations.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Thermal Printers &amp; E-Receipts:</strong> Print physical receipts or send instant SMS/WhatsApp e-receipts.</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenStartFree}
                  className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
                >
                  <span>Launch POS Simulator</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Customers & CRM */}
      <section className="py-20 lg:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>Customer Retention &amp; Ledgers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                Build Stronger{' '}
                <span className="text-[#0866FF] dark:text-blue-400">Customer Relationships.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Know who your highest-value customers are, track outstanding credit limits, view purchase histories, and reward customer loyalty with automated points and WhatsApp birthday notes.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 pt-2">
                {[
                  'Customer Ledger Statements',
                  'Credit Limits & Aging Debt Alerts',
                  'Purchase History by Branch',
                  'WhatsApp & SMS Broadcasts',
                  'Loyalty Reward Points',
                  'Customer Tier Discounting',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenStartFree}
                  className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
                >
                  <span>Explore Customer CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Card: Customer Profile Preview */}
            <div className="lg:col-span-6">
              <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#0866FF] to-blue-400 text-white font-bold flex items-center justify-center text-lg">
                      CA
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-base">Chief Chidi Adeleke</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">VIP Wholesale Buyer &bull; 4 Years with Us</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-[#B7F000] px-3 py-1 rounded-full">
                    Platinum Tier
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Lifetime Purchases</div>
                    <div className="text-sm font-black text-slate-900 dark:text-white mt-0.5">{currency.format(12400000)}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Current Balance</div>
                    <div className="text-sm font-black text-amber-600 dark:text-amber-400 mt-0.5">{currency.format(350000)}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500">Loyalty Points</div>
                    <div className="text-sm font-black text-[#0866FF] dark:text-[#B7F000] mt-0.5">2,850 pts</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-[#0866FF] dark:text-blue-300">Credit Limit Status:</span>
                    <span className="ml-1 text-slate-600 dark:text-slate-400">35% used of {currency.format(1000000)} allowance</span>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    Good Standing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Expenses */}
      <section className="py-20 lg:py-28 bg-[#F8FAFD] dark:bg-[#0B1120] overflow-hidden transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Mockup: Expense Approval & OCR */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="bg-white dark:bg-[#0E172A] rounded-3xl p-6 shadow-xl border border-slate-200/90 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#0866FF] dark:text-blue-400" />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Petty Cash &amp; Expense Claims</span>
                  </div>
                  <span className="text-xs font-bold text-[#0866FF] dark:text-[#B7F000] bg-blue-50 dark:bg-blue-950/80 px-2.5 py-1 rounded-full">
                    Approval Workflow
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Generator Diesel Purchase (200L)</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">Branch 2 &bull; Lekki Outlet &bull; Receipt Attached</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{currency.format(185000)}</div>
                      <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950 px-1.5 py-0.5 rounded">
                        Approved by Manager
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white">Air Freight Logistics &bull; DHL</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500">Head Office &bull; Supplier Restock</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900 dark:text-white">{currency.format(94000)}</div>
                      <span className="text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        Pending Review
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-gradient-to-r from-blue-900 to-slate-900 text-white text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#B7F000]" />
                    <span>Receipt OCR Auto-Scan</span>
                  </div>
                  <span className="text-[10px] text-blue-200">99.2% Extraction Accuracy</span>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
                <Receipt className="w-3.5 h-3.5" />
                <span>Expense Tracking &amp; Cash Leak Prevention</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight leading-tight">
                Track Every Expense.{' '}
                <span className="text-[#0866FF] dark:text-blue-400">Protect Every Naira.</span>
              </h2>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Cash leaks and unaccounted petty expenses bleed small businesses dry. MsmeBooks requires photo proof, categorized tags, and manager approvals for every outflow of company funds.
              </p>

              <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Mobile Receipt Capture:</strong> Staff snap receipts with their phone; AI extracts the amount, vendor, and VAT.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Multi-Level Approvals:</strong> Set spending limits where expenses above a threshold require founder sign-off.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#0866FF] dark:text-[#B7F000] shrink-0" />
                  <span><strong>Statutory Tax Deductions:</strong> Automatically isolate deductible business expenses for tax savings.</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={onOpenStartFree}
                  className="px-6 py-3.5 rounded-xl bg-[#0866FF] hover:bg-[#0752D4] text-white font-bold text-sm shadow-md shadow-blue-500/25 inline-flex items-center gap-2 transition-all"
                >
                  <span>Start Tracking Expenses</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
