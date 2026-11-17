import React, { useState } from 'react';
import { 
  Layers, 
  Calculator, 
  CreditCard, 
  Boxes, 
  Building2, 
  Plus, 
  Trash2, 
  Printer, 
  CheckCircle2, 
  RotateCcw, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface SoftwareSandboxProps {
  onBackToAcademy: () => void;
  onOpenAIAssistant: () => void;
}

export const SoftwareSandbox: React.FC<SoftwareSandboxProps> = ({
  onBackToAcademy,
  onOpenAIAssistant
}) => {
  const [activeTab, setActiveTab] = useState<'accounting' | 'pos' | 'inventory' | 'hospitality'>('accounting');

  // Exercise Completion Flags
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({});

  // 1. Accounting Simulator State
  const [customerName, setCustomerName] = useState('Dangote Consumer Goods Ltd');
  const [invoiceItems, setInvoiceItems] = useState([
    { description: 'Cloud Software Consulting & Advisory', qty: 10, unitPrice: 25000 },
    { description: 'Hardware Implementation & Terminal Setup', qty: 2, unitPrice: 45000 }
  ]);
  const [applyVat, setApplyVat] = useState(true);
  const [invoicePosted, setInvoicePosted] = useState(false);

  // 2. POS Simulator State
  const [posCart, setPosCart] = useState([
    { id: 'item-1', name: 'Golden Penny Flour 50kg', price: 62000, qty: 1, barcode: '890123456789' },
    { id: 'item-2', name: 'Dangote Granulated Sugar 50kg', price: 78000, qty: 1, barcode: '890987654321' }
  ]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Card / POS' | 'Bank Transfer'>('Card / POS');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [posReceiptPrinted, setPosReceiptPrinted] = useState(false);

  // 3. Inventory Simulator State
  const [inventoryList, setInventoryList] = useState([
    { sku: 'SKU-FLOUR-01', name: 'Golden Penny Flour 50kg', currentStock: 48, minThreshold: 20, unitCost: 54000 },
    { sku: 'SKU-SUGAR-02', name: 'Dangote Sugar 50kg', currentStock: 14, minThreshold: 25, unitCost: 71000 },
    { sku: 'SKU-OIL-03', name: 'Kings Vegetable Oil 25L', currentStock: 32, minThreshold: 15, unitCost: 46000 }
  ]);
  const [adjustmentSku, setAdjustmentSku] = useState('SKU-SUGAR-02');
  const [adjustmentQty, setAdjustmentQty] = useState(30);
  const [stockAdjusted, setStockAdjusted] = useState(false);

  // 4. Hotel PMS Simulator State
  const [roomNumber, setRoomNumber] = useState('Room 304 - Executive Deluxe Suite');
  const [guestName, setGuestName] = useState('Hon. Babatunde Sanwo');
  const [stayNights, setStayNights] = useState(3);
  const [ratePerNight, setRatePerNight] = useState(85000);
  const [folioCharges, setFolioCharges] = useState([
    { item: 'Room Accommodation (3 Nights)', amount: 255000 },
    { item: 'Boutique Terrace Restaurant & Bar', amount: 34500 }
  ]);
  const [hotelCheckedIn, setHotelCheckedIn] = useState(false);

  // Calculate Subtotals
  const invoiceSubtotal = invoiceItems.reduce((acc, it) => acc + (it.qty * it.unitPrice), 0);
  const invoiceVat = applyVat ? Math.round(invoiceSubtotal * 0.075) : 0;
  const invoiceTotal = invoiceSubtotal + invoiceVat;

  const posSubtotal = posCart.reduce((acc, it) => acc + (it.qty * it.price), 0);
  const posDiscount = Math.round((posSubtotal * discountPercent) / 100);
  const posTotal = posSubtotal - posDiscount;

  const hotelTotal = folioCharges.reduce((acc, f) => acc + f.amount, 0);

  const handlePostInvoice = () => {
    setInvoicePosted(true);
    setCompletedExercises((prev) => ({ ...prev, accounting: true }));
  };

  const handleCompletePos = () => {
    setPosReceiptPrinted(true);
    setCompletedExercises((prev) => ({ ...prev, pos: true }));
  };

  const handleAdjustStock = () => {
    setInventoryList((prev) =>
      prev.map((item) =>
        item.sku === adjustmentSku
          ? { ...item, currentStock: item.currentStock + adjustmentQty }
          : item
      )
    );
    setStockAdjusted(true);
    setCompletedExercises((prev) => ({ ...prev, inventory: true }));
  };

  const handleCheckInGuest = () => {
    setHotelCheckedIn(true);
    setCompletedExercises((prev) => ({ ...prev, hospitality: true }));
  };

  const completedCount = Object.keys(completedExercises).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 pb-16 transition-colors">
      
      {/* Sandbox Navigation Bar */}
      <div className="bg-[#073B75] dark:bg-slate-950 text-white px-4 sm:px-6 py-4 border-b border-blue-900 dark:border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToAcademy}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-white transition-colors cursor-pointer"
            >
              ← Back to Academy
            </button>
            <div className="border-l border-blue-700/60 dark:border-slate-700 pl-3">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  MsmeBooks Interactive Training Sandbox
                </span>
                <span className="text-[10px] bg-[#72B01D] text-slate-950 font-bold px-2 py-0.5 rounded">
                  Isolated Demo DB
                </span>
              </div>
              <p className="text-[11px] text-slate-300 dark:text-slate-400">
                Practice real enterprise workflows safely. No live customer records are impacted.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <span className="text-slate-300 dark:text-slate-400 text-[11px] block">Practical Labs Completed</span>
              <span className="font-bold text-[#84CC16] tabular-nums">{completedCount} / 4 Modules</span>
            </div>

            <button
              onClick={onOpenAIAssistant}
              className="px-3 py-1.5 bg-[#72B01D] hover:bg-[#5B8D17] text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Sandbox Guide</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Module Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs mb-6">
          {[
            { id: 'accounting', label: '1. Invoicing & Ledger Posting', icon: Calculator },
            { id: 'pos', label: '2. POS Checkout & Cashiering', icon: CreditCard },
            { id: 'inventory', label: '3. Warehouse Stock Adjustment', icon: Boxes },
            { id: 'hospitality', label: '4. Hotel PMS & Folio Billing', icon: Building2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isDone = !!completedExercises[tab.id];
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[#0B4F9C] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16]" />}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ACCOUNTING & INVOICING */}
        {activeTab === 'accounting' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Exercise 1: Create &amp; Post Tax Compliant Sales Invoice
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Map Accounts Receivable, calculate standard 7.5% VAT, and post journal entries.
                  </p>
                </div>
                <span className="text-[11px] text-[#0B4F9C] bg-blue-50 px-2.5 py-1 rounded font-semibold">
                  Invoice #INV-2026-00492
                </span>
              </div>

              {/* Customer Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Customer / Debtor</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-[#0B4F9C]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Payment Due Terms</label>
                  <select className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs">
                    <option>Net 15 Days (Payment due Nov 15, 2026)</option>
                    <option>Net 30 Days</option>
                    <option>Immediate / Cash on Delivery</option>
                  </select>
                </div>
              </div>

              {/* Line Items Table */}
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-2">Invoice Line Items</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
                  <div className="bg-slate-50 px-4 py-2 font-bold text-slate-500 grid grid-cols-12">
                    <span className="col-span-6">Item &amp; Service Description</span>
                    <span className="col-span-2 text-right">Qty</span>
                    <span className="col-span-2 text-right">Unit Price (₦)</span>
                    <span className="col-span-2 text-right">Amount (₦)</span>
                  </div>

                  {invoiceItems.map((item, idx) => (
                    <div key={idx} className="px-4 py-3 grid grid-cols-12 items-center bg-white">
                      <span className="col-span-6 font-medium text-slate-800">{item.description}</span>
                      <span className="col-span-2 text-right tabular-nums text-slate-600">{item.qty}</span>
                      <span className="col-span-2 text-right tabular-nums text-slate-600">
                        {item.unitPrice.toLocaleString()}
                      </span>
                      <span className="col-span-2 text-right font-bold text-slate-900 tabular-nums">
                        {(item.qty * item.unitPrice).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VAT & Totals */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyVat}
                    onChange={(e) => setApplyVat(e.target.checked)}
                    className="w-4 h-4 text-[#0B4F9C] rounded cursor-pointer"
                  />
                  <span>Apply Nigerian VAT Output (7.5%)</span>
                </label>

                <div className="text-right space-y-1 text-xs">
                  <div className="text-slate-500">
                    Subtotal: <span className="tabular-nums font-semibold text-slate-800">₦{invoiceSubtotal.toLocaleString()}</span>
                  </div>
                  {applyVat && (
                    <div className="text-slate-500">
                      VAT Output (7.5%): <span className="tabular-nums font-semibold text-[#0B4F9C]">₦{invoiceVat.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="text-sm font-extrabold text-slate-900 pt-1 border-t border-slate-200">
                    Grand Total: <span className="tabular-nums text-[#0B4F9C]">₦{invoiceTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setInvoicePosted(false)}
                  className="px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Form</span>
                </button>

                <button
                  onClick={handlePostInvoice}
                  disabled={invoicePosted}
                  className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
                    invoicePosted
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#0B4F9C] hover:bg-[#073B75] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  <span>{invoicePosted ? 'Invoice Posted to Ledger!' : 'Post Invoice & Update Accounts'}</span>
                </button>
              </div>

            </div>

            {/* Right: Double Entry Ledger Visualizer */}
            <div className="lg:col-span-4 bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-[#84CC16] font-bold text-xs uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Live Double-Entry Ledger Preview</span>
              </div>

              <p className="text-xs text-slate-400">
                Notice how MsmeBooks balances debits and credits automatically behind the scenes:
              </p>

              <div className="space-y-3 font-mono text-xs">
                {/* Debit */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-emerald-400 font-bold block">DR: Accounts Receivable (1200)</span>
                  <span className="text-white text-sm font-bold tabular-nums">₦{invoiceTotal.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Asset increased with gross customer debt.</p>
                </div>

                {/* Credit Revenue */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="text-blue-400 font-bold block">CR: Sales Revenue (4000)</span>
                  <span className="text-white text-sm font-bold tabular-nums">₦{invoiceSubtotal.toLocaleString()}</span>
                  <p className="text-[10px] text-slate-400 mt-1">Net business earnings recognized.</p>
                </div>

                {/* Credit VAT */}
                {applyVat && (
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <span className="text-amber-400 font-bold block">CR: VAT Output Payable (2210)</span>
                    <span className="text-white text-sm font-bold tabular-nums">₦{invoiceVat.toLocaleString()}</span>
                    <p className="text-[10px] text-slate-400 mt-1">FIRS/LIRS tax liability reserved.</p>
                  </div>
                )}
              </div>

              {invoicePosted && (
                <div className="p-3.5 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-xs space-y-1">
                  <div className="font-bold text-[#84CC16] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Exercise 1 Passed!</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">
                    Ledger balanced. Trial balance and customer statement successfully updated.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: POINT OF SALE */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Exercise 2: Cashier POS Register &amp; Fast Checkout
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Scan items, apply discounts, select payment terminal, and print verified receipt.
                  </p>
                </div>
                <span className="text-[11px] text-[#72B01D] bg-emerald-50 px-2.5 py-1 rounded font-bold">
                  Terminal 02 · Main Mall
                </span>
              </div>

              {/* Cart Items */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Scanned Items in Cart</span>
                  <span className="text-xs text-slate-500 tabular-nums">{posCart.length} Items</span>
                </div>

                <div className="border border-slate-200 rounded-xl divide-y divide-slate-200 overflow-hidden text-xs">
                  {posCart.map((item) => (
                    <div key={item.id} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">Barcode: {item.barcode}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 tabular-nums">
                          ₦{(item.price * item.qty).toLocaleString()}
                        </span>
                        <p className="text-[10px] text-slate-400">Qty: {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">Tender Payment Mode</label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['Card / POS', 'Cash', 'Bank Transfer'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMode(mode)}
                      className={`p-2.5 rounded-lg border font-semibold transition-all cursor-pointer text-center ${
                        paymentMode === mode
                          ? 'border-[#0B4F9C] bg-blue-50 text-[#0B4F9C]'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Promotional Discount */}
              <div className="flex items-center justify-between text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-medium text-slate-700">Supervisor Loyalty Discount</span>
                <div className="flex items-center gap-2">
                  {[0, 5, 10].map((disc) => (
                    <button
                      key={disc}
                      onClick={() => setDiscountPercent(disc)}
                      className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                        discountPercent === disc
                          ? 'bg-[#0B4F9C] text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {disc === 0 ? 'None' : `${disc}% Off`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-between">
                <div className="text-xs">
                  <span className="text-slate-400 block">Total Due:</span>
                  <span className="text-xl font-black text-[#0B4F9C] tabular-nums">
                    ₦{posTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCompletePos}
                  disabled={posReceiptPrinted}
                  className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
                    posReceiptPrinted
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#72B01D] hover:bg-[#5B8D17] text-slate-950 font-black'
                  }`}
                >
                  <Printer className="w-4 h-4" />
                  <span>{posReceiptPrinted ? 'Sale Completed & Receipt Printed!' : 'Complete Tender & Print Receipt'}</span>
                </button>
              </div>
            </div>

            {/* Thermal Receipt Preview */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-300 shadow-sm font-mono text-xs text-slate-700 space-y-3">
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <p className="font-bold text-sm text-slate-900">MSMEBOOKS RETAIL STORE</p>
                <p className="text-[10px] text-slate-500">Ikeja City Mall, Lagos, Nigeria</p>
                <p className="text-[10px] text-slate-500">Tel: +234 1 234 5678 · VAT# 10928374</p>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Date: Oct 31, 2026 14:42</span>
                <span>Till: #02 (Emeka)</span>
              </div>

              <div className="divide-y divide-dashed divide-slate-200 py-2">
                {posCart.map((it) => (
                  <div key={it.id} className="py-1.5 flex justify-between">
                    <div>
                      <p className="font-medium text-slate-900">{it.name}</p>
                      <p className="text-[10px] text-slate-400">{it.qty} x ₦{it.price.toLocaleString()}</p>
                    </div>
                    <span className="font-bold tabular-nums">₦{(it.price * it.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="tabular-nums">₦{posSubtotal.toLocaleString()}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({discountPercent}%):</span>
                    <span className="tabular-nums">-₦{posDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                  <span>TOTAL PAID ({paymentMode}):</span>
                  <span className="tabular-nums">₦{posTotal.toLocaleString()}</span>
                </div>
              </div>

              <div className="text-center pt-4 text-[10px] text-slate-400 border-t border-dashed border-slate-300">
                <p>Thank you for shopping with us!</p>
                <p>MsmeBooks POS Cloud Engine Verified</p>
              </div>

              {posReceiptPrinted && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 text-xs font-sans mt-4">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#72B01D]" />
                    <span>Exercise 2 Passed!</span>
                  </div>
                  <p className="text-[11px] mt-0.5">Inventory decremented, cashier register balanced.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: WAREHOUSE INVENTORY */}
        {activeTab === 'inventory' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Exercise 3: Inventory Stock Receipt &amp; Threshold Automation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Review warehouse inventory levels, identify low stock warnings, and log received purchase shipments.
                  </p>
                </div>
                <span className="text-[11px] text-[#0B4F9C] bg-blue-50 px-2.5 py-1 rounded font-bold">
                  Central Warehouse Lagos
                </span>
              </div>

              {/* Current Stock Levels Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
                <div className="bg-slate-50 px-4 py-2.5 font-bold text-slate-500 grid grid-cols-12">
                  <span className="col-span-4">Product SKU &amp; Name</span>
                  <span className="col-span-3 text-right">In Stock</span>
                  <span className="col-span-2 text-right">Min Threshold</span>
                  <span className="col-span-3 text-right">Stock Status</span>
                </div>

                {inventoryList.map((item) => {
                  const isLow = item.currentStock <= item.minThreshold;
                  return (
                    <div key={item.sku} className="px-4 py-3 grid grid-cols-12 items-center bg-white">
                      <div className="col-span-4">
                        <p className="font-bold text-slate-900">{item.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{item.sku}</p>
                      </div>
                      <span className="col-span-3 text-right font-bold tabular-nums text-slate-900 text-sm">
                        {item.currentStock} units
                      </span>
                      <span className="col-span-2 text-right tabular-nums text-slate-500">
                        {item.minThreshold}
                      </span>
                      <div className="col-span-3 text-right">
                        {isLow ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            <AlertTriangle className="w-3 h-3" /> Reorder Alert
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            Optimal
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Adjustment Form */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 text-xs">
                <span className="font-bold text-slate-800 block">Log Inbound Goods Received Note (GRN)</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-600 block mb-1">Select Item to Replenish</label>
                    <select
                      value={adjustmentSku}
                      onChange={(e) => setAdjustmentSku(e.target.value)}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      {inventoryList.map((it) => (
                        <option key={it.sku} value={it.sku}>
                          {it.name} ({it.sku})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-600 block mb-1">Received Quantity (Units)</label>
                    <input
                      type="number"
                      value={adjustmentQty}
                      onChange={(e) => setAdjustmentQty(Number(e.target.value))}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleAdjustStock}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-[#0B4F9C] hover:bg-[#073B75] rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Post Stock Receipt to Warehouse</span>
                  </button>
                </div>
              </div>

              {stockAdjusted && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#72B01D]" />
                    <span>Exercise 3 Completed!</span>
                  </div>
                  <p className="text-[11px] mt-0.5">
                    Stock increased by {adjustmentQty} units. Reorder alert cleared, inventory valuation updated under FIFO.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <span className="font-bold text-[#84CC16] uppercase tracking-wider block">
                Warehouse Best Practices
              </span>
              <ul className="space-y-3 text-slate-300 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] font-bold">1.</span>
                  <span>Set min threshold equal to lead time demand plus 25% safety stock.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] font-bold">2.</span>
                  <span>Perform weekly cycle counts on top 20% high-velocity SKUs (Category A).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#84CC16] font-bold">3.</span>
                  <span>Never adjust stock without attaching GRN document or scrap authorization.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* TAB 4: HOTEL PMS */}
        {activeTab === 'hospitality' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Exercise 4: Hotel Front Desk Check-In &amp; Guest Folio
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Assign room key, post restaurant dining charges directly to folio, and run checkout invoice.
                  </p>
                </div>
                <span className="text-[11px] text-[#0B4F9C] bg-blue-50 px-2.5 py-1 rounded font-bold">
                  Boutique PMS Module
                </span>
              </div>

              {/* Guest Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Guest Name</label>
                  <input
                    type="text"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Room</label>
                  <select
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option>Room 304 - Executive Deluxe Suite</option>
                    <option>Room 201 - Superior King Room</option>
                    <option>Room 105 - Standard Double</option>
                  </select>
                </div>
              </div>

              {/* Folio Items */}
              <div>
                <label className="font-bold text-slate-700 text-xs block mb-2">Guest Room Folio Transactions</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-200 text-xs">
                  {folioCharges.map((f, i) => (
                    <div key={i} className="p-3 bg-white flex justify-between items-center">
                      <span className="font-medium text-slate-800">{f.item}</span>
                      <span className="font-bold text-slate-900 tabular-nums">₦{f.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs">
                  <span className="text-slate-400 block">Total Folio Balance:</span>
                  <span className="text-xl font-extrabold text-[#0B4F9C] tabular-nums">
                    ₦{hotelTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  onClick={handleCheckInGuest}
                  disabled={hotelCheckedIn}
                  className={`px-6 py-2.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm ${
                    hotelCheckedIn
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-[#0B4F9C] hover:bg-[#073B75] text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 text-[#84CC16]" />
                  <span>{hotelCheckedIn ? 'Guest Checked In & Folio Confirmed!' : 'Confirm Check-In & Issue Room Key'}</span>
                </button>
              </div>

              {hotelCheckedIn && (
                <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs">
                  <div className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#72B01D]" />
                    <span>Exercise 4 Completed!</span>
                  </div>
                  <p className="text-[11px] mt-0.5">
                    Room 304 status changed to "Occupied". Restaurant POS successfully integrated with room bill.
                  </p>
                </div>
              )}
            </div>

            <div className="lg:col-span-4 bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4 text-xs">
              <span className="font-bold text-[#84CC16] uppercase tracking-wider block">
                Hospitality Operations Note
              </span>
              <p className="text-slate-300 leading-relaxed">
                MsmeBooks Hotel PMS prevents unauthorized cashier charges by requiring guest digital signature or PIN verification at restaurant and spa checkout counters.
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
