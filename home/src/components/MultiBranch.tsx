import React, { useState } from 'react';
import {
  Building2,
  Store,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCIES } from '../data/mockData';

interface MultiBranchProps {
  currentCurrency: CurrencyCode;
  onOpenStartFree: () => void;
}

export const MultiBranch: React.FC<MultiBranchProps> = ({ currentCurrency, onOpenStartFree }) => {
  const currency = CURRENCIES[currentCurrency] || CURRENCIES.NGN;
  const [selectedBranchId, setSelectedBranchId] = useState('hq');

  const branches = [
    {
      id: 'hq',
      name: 'Central Head Office',
      location: 'Victoria Island, Lagos',
      type: 'Head Office',
      sales: 18450000,
      expenses: 4200000,
      inventory: 'All Nodes',
      staff: 34,
      customers: 2420,
      profit: 14250000,
      status: 'Online',
    },
    {
      id: 'b1',
      name: 'Branch 1: Ikeja Superstore',
      location: 'Ikeja City Mall, Lagos',
      type: 'Retail Branch',
      sales: 6850000,
      expenses: 1450000,
      inventory: '1,420 SKUs',
      staff: 12,
      customers: 840,
      profit: 5400000,
      status: 'Online',
    },
    {
      id: 'b2',
      name: 'Branch 2: Lekki Phase 1',
      location: 'Admiralty Way, Lekki',
      type: 'Retail Branch',
      sales: 5420000,
      expenses: 1120000,
      inventory: '980 SKUs',
      staff: 8,
      customers: 620,
      profit: 4300000,
      status: 'Online',
    },
    {
      id: 'b3',
      name: 'Branch 3: Abuja Mega Outlet',
      location: 'Wuse II, Abuja',
      type: 'Retail Branch',
      sales: 4950000,
      expenses: 980000,
      inventory: '890 SKUs',
      staff: 7,
      customers: 550,
      profit: 3970000,
      status: 'Online',
    },
    {
      id: 'b4',
      name: 'Branch 4: Port Harcourt Outlet',
      location: 'GRA Phase 2, PH',
      type: 'Retail Branch',
      sales: 3850000,
      expenses: 740000,
      inventory: '640 SKUs',
      staff: 6,
      customers: 410,
      profit: 3110000,
      status: 'Online',
    },
    {
      id: 'wh',
      name: 'Central Distribution Warehouse',
      location: 'Ibafo Industrial Zone, Ogun',
      type: 'Warehouse',
      sales: 0,
      expenses: 2850000,
      inventory: '18,500 units',
      staff: 18,
      customers: 0,
      profit: 0,
      status: 'Online',
    },
  ];

  const activeBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  return (
    <section id="multibranch" className="py-20 lg:py-28 bg-white dark:bg-[#0B1120] border-b border-slate-200/70 dark:border-slate-800 relative transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0866FF] dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>Enterprise Multi-Location Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 dark:text-white font-display tracking-tight">
            Manage Multiple Branches From One Place
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
            Monitor sales, expenses, cash drawers, and stock transfers across all your stores and warehouses in real time. Never lose track of a single location again.
          </p>
        </div>

        {/* Dashboard + Africa Hub Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Branch List Selector */}
          <div className="lg:col-span-5 space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-1">
              Select Branch or Warehouse Node:
            </span>
            {branches.map((b) => (
              <button
                key={b.id}
                onClick={() => setSelectedBranchId(b.id)}
                className={`w-full p-3.5 rounded-xl border text-left transition-all duration-200 flex items-center justify-between ${
                  selectedBranchId === b.id
                    ? 'bg-[#0866FF] text-white border-[#0866FF] shadow-lg shadow-blue-500/20'
                    : 'bg-slate-50 dark:bg-[#0E172A] hover:bg-slate-100/80 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      selectedBranchId === b.id ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-950 text-[#0866FF] dark:text-blue-300'
                    }`}
                  >
                    {b.type === 'Warehouse' ? <Warehouse className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-snug">{b.name}</div>
                    <div className={`text-[10px] ${selectedBranchId === b.id ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>
                      {b.location}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold">
                    {b.sales > 0 ? currency.format(b.sales) : 'Stock Depot'}
                  </div>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      selectedBranchId === b.id
                        ? 'bg-[#B7F000] text-slate-950'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                    }`}
                  >
                    Live
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Detailed Node Dashboard & African Map Connections */}
          <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-800 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B7F000]">
                  Location Telemetry
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">{activeBranch.name}</h3>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0866FF]" />
                  <span>{activeBranch.location}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B7F000] animate-ping" />
                <span className="text-xs font-bold text-emerald-400 font-mono">100% RECONCILED</span>
              </div>
            </div>

            {/* Branch Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Sales</span>
                <div className="text-lg font-black text-white font-mono mt-1">
                  {activeBranch.sales > 0 ? currency.format(activeBranch.sales) : 'Depot Only'}
                </div>
                <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>+18.4% vs last week</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Operating Expenses</span>
                <div className="text-lg font-black text-white font-mono mt-1">
                  {currency.format(activeBranch.expenses)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">Rent, power, salaries</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Net Contribution</span>
                <div className="text-lg font-black text-[#B7F000] font-mono mt-1">
                  {activeBranch.profit > 0 ? currency.format(activeBranch.profit) : 'Central Depot'}
                </div>
                <div className="text-[10px] text-[#B7F000] font-bold mt-0.5">Positive Unit Margin</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Inventory SKUs</span>
                <div className="text-base font-bold text-white mt-1">{activeBranch.inventory}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Auto-synced with HQ</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Active Staff</span>
                <div className="text-base font-bold text-white mt-1">{activeBranch.staff} Team Members</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Role-based POS pins</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cashier Drawers</span>
                <div className="text-base font-bold text-emerald-400 mt-1">Balanced (0 Var)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Day Shift Closed</div>
              </div>
            </div>

            {/* Inter-Branch Stock Transfer Action Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/60 to-slate-800 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0866FF] flex items-center justify-center text-white shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Inter-Branch Stock Balancing</div>
                  <div className="text-[11px] text-blue-200">
                    Need to transfer 50 units from Central Warehouse to {activeBranch.name}?
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenStartFree}
                className="px-4 py-2 rounded-xl bg-[#B7F000] hover:bg-[#a6d900] text-slate-950 font-bold text-xs shrink-0 transition-colors"
              >
                Initiate Waybill
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
