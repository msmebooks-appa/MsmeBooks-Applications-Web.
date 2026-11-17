import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  CreditCard, 
  Boxes, 
  Store, 
  Utensils, 
  Building2, 
  Users, 
  FileText, 
  ShoppingCart, 
  BarChart3, 
  Cpu, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Database, 
  Briefcase,
  Landmark,
  Receipt,
  FileCheck,
  Stethoscope,
  Building,
  Factory,
  Wheat,
  Fuel,
  Banknote,
  Truck,
  HardHat,
  GraduationCap,
  HeartHandshake,
  Layers,
  Search,
  ArrowRight
} from 'lucide-react';
import { CATEGORIES_LIST } from '../data/mockData';
import { BusinessSector } from '../types';

interface CategoryGridProps {
  onSelectCategory: (categoryName: string) => void;
  selectedCategory: string;
}

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case 'Landmark': return <Landmark className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Receipt': return <Receipt className="w-5 h-5 text-[#0B4F9C]" />;
    case 'FileCheck': return <FileCheck className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Stethoscope': return <Stethoscope className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Building': return <Building className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Factory': return <Factory className="w-5 h-5 text-[#72B01D]" />;
    case 'Wheat': return <Wheat className="w-5 h-5 text-[#72B01D]" />;
    case 'Fuel': return <Fuel className="w-5 h-5 text-[#72B01D]" />;
    case 'Banknote': return <Banknote className="w-5 h-5 text-[#72B01D]" />;
    case 'Truck': return <Truck className="w-5 h-5 text-[#72B01D]" />;
    case 'HardHat': return <HardHat className="w-5 h-5 text-[#72B01D]" />;
    case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-[#72B01D]" />;
    case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-[#72B01D]" />;
    case 'Calculator': return <Calculator className="w-5 h-5 text-[#0B4F9C]" />;
    case 'CreditCard': return <CreditCard className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Boxes': return <Boxes className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Store': return <Store className="w-5 h-5 text-[#72B01D]" />;
    case 'Utensils': return <Utensils className="w-5 h-5 text-[#72B01D]" />;
    case 'Building2': return <Building2 className="w-5 h-5 text-[#72B01D]" />;
    case 'Users': return <Users className="w-5 h-5 text-[#0B4F9C]" />;
    case 'FileText': return <FileText className="w-5 h-5 text-[#0B4F9C]" />;
    case 'ShoppingCart': return <ShoppingCart className="w-5 h-5 text-[#72B01D]" />;
    case 'BarChart3': return <BarChart3 className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Cpu': return <Cpu className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Award': return <Award className="w-5 h-5 text-[#72B01D]" />;
    case 'TrendingUp': return <TrendingUp className="w-5 h-5 text-[#72B01D]" />;
    case 'Sparkles': return <Sparkles className="w-5 h-5 text-[#72B01D]" />;
    case 'Database': return <Database className="w-5 h-5 text-[#0B4F9C]" />;
    case 'Briefcase': return <Briefcase className="w-5 h-5 text-[#72B01D]" />;
    default: return <Calculator className="w-5 h-5 text-[#0B4F9C]" />;
  }
};

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  selectedCategory
}) => {
  const [activeSector, setActiveSector] = useState<BusinessSector>('All Sectors');
  const [categorySearch, setCategorySearch] = useState('');

  // Sector counts
  const sectorCounts = useMemo(() => {
    return {
      'All Sectors': CATEGORIES_LIST.length,
      'Private Sector': CATEGORIES_LIST.filter((c) => c.sector === 'Private Sector').length,
      'Government & Public Sector': CATEGORIES_LIST.filter((c) => c.sector === 'Government & Public Sector').length,
      'Core SaaS Operations': CATEGORIES_LIST.filter((c) => c.sector === 'Core SaaS Operations').length,
    };
  }, []);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return CATEGORIES_LIST.filter((cat) => {
      const matchesSector =
        activeSector === 'All Sectors' || cat.sector === activeSector;
      const matchesSearch =
        !categorySearch.trim() ||
        cat.name.toLowerCase().includes(categorySearch.trim().toLowerCase()) ||
        (cat.description && cat.description.toLowerCase().includes(categorySearch.trim().toLowerCase()));
      return matchesSector && matchesSearch;
    });
  }, [activeSector, categorySearch]);

  const sectorDescriptions: Record<BusinessSector, string> = {
    'All Sectors': 'Explore full spectrum certification curriculums spanning private enterprise sectors, government & municipal administration, and core SaaS business tools.',
    'Private Sector': 'Tailored accounting, costing, and inventory workflows for private industries including Manufacturing, Commercial Agribusiness, Oil & Gas, Transport, Education, and Non-Profits.',
    'Government & Public Sector': 'Standardized public financial management for Ministries, Departments, and Agencies (MDAs), State Revenue Boards (IGR), Public Hospitals, and Municipal Councils aligned with IPSAS accrual standards.',
    'Core SaaS Operations': 'Core software mastery of MsmeBooks foundational ledgers, high-speed point of sale, multi-warehouse stock replenishment, and automated tax compliance.'
  };

  return (
    <section className="py-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0B4F9C] dark:text-blue-400 mb-1 flex items-center gap-1.5">
              <span>Curated Industry &amp; Public Sector Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore Training Categories
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              {sectorDescriptions[activeSector]}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            {selectedCategory !== 'All' && (
              <button
                onClick={() => onSelectCategory('All')}
                className="text-xs font-semibold text-[#0B4F9C] dark:text-blue-400 hover:underline cursor-pointer"
              >
                Reset active course filter ({selectedCategory})
              </button>
            )}
          </div>
        </div>

        {/* Business Sector Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
            <button
              onClick={() => setActiveSector('All Sectors')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSector === 'All Sectors'
                  ? 'bg-[#0B4F9C] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-750'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Sectors</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                activeSector === 'All Sectors' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {sectorCounts['All Sectors']}
              </span>
            </button>

            <button
              onClick={() => setActiveSector('Private Sector')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSector === 'Private Sector'
                  ? 'bg-[#0B4F9C] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-750'
              }`}
            >
              <Factory className="w-3.5 h-3.5 text-[#72B01D]" />
              <span>Private Business Sectors</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                activeSector === 'Private Sector' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {sectorCounts['Private Sector']}
              </span>
            </button>

            <button
              onClick={() => setActiveSector('Government & Public Sector')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSector === 'Government & Public Sector'
                  ? 'bg-[#0B4F9C] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-750'
              }`}
            >
              <Landmark className="w-3.5 h-3.5 text-blue-300" />
              <span>Government &amp; Public Sector</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                activeSector === 'Government & Public Sector' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {sectorCounts['Government & Public Sector']}
              </span>
            </button>

            <button
              onClick={() => setActiveSector('Core SaaS Operations')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeSector === 'Core SaaS Operations'
                  ? 'bg-[#0B4F9C] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-750'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Core SaaS Operations</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                activeSector === 'Core SaaS Operations' ? 'bg-white/20 text-white' : 'bg-slate-200/70 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}>
                {sectorCounts['Core SaaS Operations']}
              </span>
            </button>
          </div>

          {/* Quick Category Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Filter categories (e.g. IPSAS, Farm, BOM)..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="w-full pl-9 pr-7 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-750 focus:bg-white dark:focus:bg-slate-750 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0B4F9C] transition-all"
            />
            {categorySearch && (
              <button
                onClick={() => setCategorySearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-850 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            No training categories match "{categorySearch}" in {activeSector}.
            <button
              onClick={() => { setCategorySearch(''); setActiveSector('All Sectors'); }}
              className="block mx-auto mt-2 text-[#0B4F9C] dark:text-blue-400 font-semibold hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              const isGov = cat.sector === 'Government & Public Sector';
              const isPrivate = cat.sector === 'Private Sector';

              return (
                <button
                  key={cat.name}
                  onClick={() => onSelectCategory(cat.name)}
                  className={`text-left p-4 rounded-xl border transition-all text-xs cursor-pointer group flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0B4F9C] bg-blue-50/70 dark:bg-blue-950/60 shadow-sm ring-1 ring-[#0B4F9C]'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-slate-50/70 dark:hover:bg-slate-800 hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <div className={`p-2 rounded-lg ${
                        isSelected 
                          ? 'bg-blue-100 dark:bg-blue-900/60' 
                          : isGov
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0B4F9C] dark:text-blue-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/80'
                            : isPrivate
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#72B01D] group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/80'
                              : 'bg-slate-100 dark:bg-slate-800 text-[#0B4F9C] dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-slate-700'
                      }`}>
                        {getCategoryIcon(cat.icon)}
                      </div>
                      
                      <div className="flex flex-col items-end">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isGov 
                            ? 'bg-blue-100/70 dark:bg-blue-900/60 text-[#0B4F9C] dark:text-blue-300' 
                            : isPrivate 
                              ? 'bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                        }`}>
                          {isGov ? 'Public Sector' : isPrivate ? 'Private Sector' : 'Core SaaS'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium tabular-nums mt-0.5">
                          {cat.count} courses
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400 transition-colors line-clamp-1 leading-snug">
                      {cat.name}
                    </h3>
                    
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {cat.description || 'Hands-on operational software workflows & verifiable certification'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-[#0B4F9C] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform">
                    <span>View Courses</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B4F9C] dark:group-hover:text-blue-400" />
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
