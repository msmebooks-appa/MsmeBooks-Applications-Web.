import React from 'react';
import {
  ShoppingCart,
  UtensilsCrossed,
  Hotel,
  PackageCheck,
  FileSpreadsheet,
  Shirt,
  Smartphone,
  Pill,
  Globe,
  Truck,
  Sparkles,
  Network,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';

interface StoryVisualProps {
  theme: 'supermarket' | 'restaurant' | 'hotel' | 'warehouse' | 'accounting' | 'fashion' | 'electronics' | 'pharmacy' | 'ecommerce' | 'logistics' | 'beauty' | 'enterprise';
  compact?: boolean;
}

export const StoryVisual: React.FC<StoryVisualProps> = ({ theme, compact = false }) => {
  const { formatUSD } = useCurrency();

  // Renders a high-fidelity MsmeBooks Software UI screen appropriate to the industry
  switch (theme) {
    case 'supermarket':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          {/* Top Bar of POS */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">MsmeBooks POS &middot; Till 02</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Live Stock Synced
            </span>
          </div>

          {/* POS Cart Simulation */}
          <div className="my-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded border border-slate-700">
              <div>
                <p className="font-semibold text-slate-100">Sunflower Cooking Oil 2L</p>
                <p className="text-[10px] text-slate-400 font-mono">SKU: 60098001 &middot; Barcode Scanned</p>
              </div>
              <span className="font-mono font-bold text-[#7CB518]">{formatUSD(4.80)}</span>
            </div>

            <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded border border-slate-700">
              <div>
                <p className="font-semibold text-slate-100">Premium Long Grain Rice 5kg</p>
                <p className="text-[10px] text-slate-400 font-mono">SKU: 50021004 &middot; Stock: 42 left</p>
              </div>
              <span className="font-mono font-bold text-[#7CB518]">{formatUSD(9.50)}</span>
            </div>

            {!compact && (
              <div className="flex justify-between items-center bg-slate-800/50 p-2 rounded border border-slate-700/60">
                <div>
                  <p className="font-semibold text-slate-200">Fresh Whole Milk 1L</p>
                  <p className="text-[10px] text-slate-400 font-mono">Lot #B49 &middot; Auto-decrementing</p>
                </div>
                <span className="font-mono font-bold text-[#7CB518]">{formatUSD(1.40)}</span>
              </div>
            )}
          </div>

          {/* Subtotal & Journal Post Trigger */}
          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-300 uppercase font-semibold">Ledger Output</span>
              <p className="font-bold text-white">Auto-posted to VAT &amp; COGS</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-300">Total Tender</span>
              <p className="font-mono font-extrabold text-sm text-[#90CF24]">{formatUSD(15.70)}</p>
            </div>
          </div>
        </div>
      );

    case 'restaurant':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <UtensilsCrossed className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Restaurant KDS &middot; Dining Floor</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Tables 1-12 Active
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 my-3 text-xs">
            <div className="bg-emerald-950/60 border border-emerald-700/70 p-2 rounded text-center">
              <p className="font-bold text-emerald-300">Table 04</p>
              <p className="text-[10px] text-emerald-400">Main Course Sent</p>
              <p className="font-mono text-[11px] mt-1 font-bold">{formatUSD(42.50)}</p>
            </div>
            <div className="bg-amber-950/50 border border-amber-700/70 p-2 rounded text-center">
              <p className="font-bold text-amber-300">Table 07</p>
              <p className="text-[10px] text-amber-400">Split Bill / Mobile</p>
              <p className="font-mono text-[11px] mt-1 font-bold">{formatUSD(78.00)}</p>
            </div>
            <div className="bg-slate-800/80 border border-slate-700 p-2 rounded text-center">
              <p className="font-bold text-slate-300">Table 11</p>
              <p className="text-[10px] text-slate-400">Order Fired</p>
              <p className="font-mono text-[11px] mt-1 font-bold">{formatUSD(29.00)}</p>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#7CB518]" />
              <div>
                <p className="font-bold text-white text-[11px]">Today Food Cost</p>
                <p className="text-[10px] text-slate-300">Target: 28% &middot; Actual: 26.4%</p>
              </div>
            </div>
            <span className="font-mono font-bold text-xs text-[#90CF24] bg-slate-900/60 px-2 py-1 rounded">
              Balanced
            </span>
          </div>
        </div>
      );

    case 'hotel':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Hotel className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Hotel Revenue Consolidation</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Night Audit OK
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded border border-slate-700">
              <div>
                <span className="font-semibold text-slate-100">Rooms &amp; Suites (45 Keys)</span>
                <p className="text-[10px] text-slate-400">Occupancy: 84% &middot; ADR {formatUSD(110)}</p>
              </div>
              <span className="font-mono font-bold text-white">{formatUSD(4158)}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800/80 p-2 rounded border border-slate-700">
              <div>
                <span className="font-semibold text-slate-100">F&amp;B + Conference Banquets</span>
                <p className="text-[10px] text-slate-400">Billed straight to folios</p>
              </div>
              <span className="font-mono font-bold text-[#7CB518]">{formatUSD(2340)}</span>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-slate-200">Consolidated Daily Turnover</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">{formatUSD(6498)}</span>
          </div>
        </div>
      );

    case 'warehouse':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <PackageCheck className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Multi-Warehouse Stock Ledger</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/60">
              4 Depots Live
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
              <div className="flex justify-between font-semibold mb-1">
                <span>SKU #4029 Construction Cement (Cartons)</span>
                <span className="font-mono text-[#90CF24]">1,450 Units</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-700/60">
                <div>Central Hub: 900</div>
                <div>Regional 1: 350</div>
                <div>In-Transit: 200</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-slate-300">Landed Cost Engine</span>
              <p className="font-semibold text-white text-[11px]">Freight + Duties Included</p>
            </div>
            <span className="font-mono font-bold text-xs text-[#7CB518]">Margin: 24.5%</span>
          </div>
        </div>
      );

    case 'accounting':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Practice Console &middot; 45 Clients</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              VAT Month Locked
            </span>
          </div>

          <div className="my-3 space-y-1.5 text-xs">
            <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded border border-slate-700">
              <div>
                <p className="font-semibold text-slate-100">Auto-Bank Rule: Merchant Card Payouts</p>
                <p className="text-[10px] text-slate-400">Classified to 1020 Clearing Account</p>
              </div>
              <CheckCircle2 className="w-4 h-4 text-[#7CB518]" />
            </div>
            <div className="flex justify-between items-center bg-slate-800/80 p-2 rounded border border-slate-700">
              <div>
                <p className="font-semibold text-slate-100">Financial Pack: Summit Holding Ltd</p>
                <p className="text-[10px] text-slate-400">Trial Balance, P&amp;L, Balance Sheet</p>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 font-bold">Ready</span>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Bookkeeping Speed Gain</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">70% Faster</span>
          </div>
        </div>
      );

    case 'fashion':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Shirt className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Variant Matrix &middot; Ready-to-Wear</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Omnichannel Sync
            </span>
          </div>

          <div className="my-3 text-xs bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <p className="font-semibold text-slate-200 mb-1.5">Silk Maxi Dress &middot; Emerald Green</p>
            <div className="grid grid-cols-4 gap-1.5 text-center font-mono text-[11px]">
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-[9px] text-slate-400 block">S</span>
                <span className="text-[#7CB518] font-bold">12 in st.</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-[9px] text-slate-400 block">M</span>
                <span className="text-[#7CB518] font-bold">8 in st.</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-[9px] text-slate-400 block">L</span>
                <span className="text-amber-400 font-bold">2 in st.</span>
              </div>
              <div className="bg-slate-900 p-1.5 rounded">
                <span className="text-[9px] text-slate-400 block">XL</span>
                <span className="text-rose-400 font-bold">0 (Held)</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Online Overselling Rate</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">Zero Incident</span>
          </div>
        </div>
      );

    case 'electronics':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">IMEI Traceability &middot; Warranty Desk</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Verified Legit
            </span>
          </div>

          <div className="my-3 space-y-1.5 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-200">Pro Smartphone 256GB</span>
                <span className="font-mono text-[#7CB518] font-bold">{formatUSD(740)}</span>
              </div>
              <p className="text-[10px] font-mono text-slate-400 mt-1">IMEI: 358291048291048 &middot; Sold Jan 2026</p>
              <p className="text-[10px] text-emerald-400 mt-0.5">Warranty Active (10 Months Remaining)</p>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Warranty Lookup Speed</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">&lt; 30 Seconds</span>
          </div>
        </div>
      );

    case 'pharmacy':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">FEFO Dispensary &middot; Batch Guard</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Expiry Alert Active
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-100">Amoxicillin / Clavulanic 625mg</p>
                <p className="text-[10px] font-mono text-slate-400">Batch #AX209 &middot; Exp: 12/2027 (FEFO Priority 1)</p>
              </div>
              <span className="font-mono text-emerald-400 font-bold">140 boxes</span>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Expired Medication Losses</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">Near Zero</span>
          </div>
        </div>
      );

    case 'ecommerce':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Omnichannel Shared Pool</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/70 px-2 py-0.5 rounded border border-cyan-800/60">
              Web &plus; Store Live
            </span>
          </div>

          <div className="my-3 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Web Store Orders</span>
              <p className="font-bold text-white text-sm mt-0.5">84 Dispatched</p>
              <p className="text-[10px] text-emerald-400 mt-1 font-mono">Gateway Settled</p>
            </div>
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Experience Store</span>
              <p className="font-bold text-white text-sm mt-0.5">62 Purchases</p>
              <p className="text-[10px] text-cyan-400 mt-1 font-mono">14 In-store Pickups</p>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Catalog Sync Latency</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">&lt; 1 Second</span>
          </div>
        </div>
      );

    case 'logistics':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Fleet Asset Cost Center</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              18 Trucks Tracked
            </span>
          </div>

          <div className="my-3 text-xs bg-slate-800/80 p-2.5 rounded border border-slate-700">
            <div className="flex justify-between font-semibold">
              <span>Haulage Truck KBZ 941P</span>
              <span className="font-mono text-[#7CB518]">Net: &plus;{formatUSD(3140)}</span>
            </div>
            <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-400 font-mono mt-2 pt-1 border-t border-slate-700">
              <div>Freight: {formatUSD(6200)}</div>
              <div>Fuel: {formatUSD(2100)}</div>
              <div>Spares: {formatUSD(960)}</div>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Digital Freight Invoice</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">Same-Day Billing</span>
          </div>
        </div>
      );

    case 'beauty':
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Beauty Studio &middot; Unified Checkout</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              Commission Auto
            </span>
          </div>

          <div className="my-3 space-y-1.5 text-xs">
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-100">Balayage &amp; Style Service</p>
                <p className="text-[10px] text-slate-400">Stylist: Sarah &middot; Backbar Bleach Logged</p>
              </div>
              <span className="font-mono font-bold text-white">{formatUSD(85)}</span>
            </div>
            <div className="bg-slate-800/80 p-2 rounded border border-slate-700 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-100">Argan Oil Hair Mask 250ml</p>
                <p className="text-[10px] text-slate-400">Retail Shelf &middot; 10% Retail Bonus</p>
              </div>
              <span className="font-mono font-bold text-[#7CB518]">{formatUSD(28)}</span>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Total Client Bill</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">{formatUSD(113)}</span>
          </div>
        </div>
      );

    case 'enterprise':
    default:
      return (
        <div className="w-full h-full bg-[#072B45] text-white p-4 sm:p-5 flex flex-col justify-between select-none font-sans relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#7CB518]" />
              <span className="text-xs font-bold text-slate-200">Consolidated Executive Grid</span>
            </div>
            <span className="text-[11px] font-mono text-[#90CF24] bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/60">
              6 Branches Active
            </span>
          </div>

          <div className="my-3 space-y-2 text-xs">
            <div className="bg-slate-800/80 p-2.5 rounded border border-slate-700">
              <div className="flex justify-between font-semibold mb-1">
                <span>Enterprise Consolidated Turnover</span>
                <span className="font-mono text-[#90CF24] font-bold">{formatUSD(184200)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[10px] text-slate-300 font-mono mt-2 pt-1 border-t border-slate-700">
                <div>HQ Lagos: {formatUSD(68000, { compact: true })}</div>
                <div>Nairobi: {formatUSD(54000, { compact: true })}</div>
                <div>Accra: {formatUSD(42000, { compact: true })}</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0A3D62] p-2.5 rounded-lg border border-sky-800/70 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-200">Consolidation Turnaround</span>
            <span className="font-mono font-extrabold text-sm text-[#90CF24]">Instant / Single Click</span>
          </div>
        </div>
      );
  }
};
