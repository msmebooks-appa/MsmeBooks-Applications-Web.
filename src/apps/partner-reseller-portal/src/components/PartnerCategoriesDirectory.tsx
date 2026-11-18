import React, { useState, useMemo } from 'react';
import { PartnerCategoryGroup, PartnerSubcategory } from '../types/partner';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  CheckCircle,
  Plus,
  ToggleLeft,
  ToggleRight,
  Calculator,
  Server,
  TrendingUp,
  GraduationCap,
  Globe,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

interface PartnerCategoriesDirectoryProps {
  categoryGroups: PartnerCategoryGroup[];
  onSelectCategoryForApply: (categoryName: string, groupTitle: string) => void;
  onUpdateCategoryGroups?: (updated: PartnerCategoryGroup[]) => void;
}

export const PartnerCategoriesDirectory: React.FC<PartnerCategoriesDirectoryProps> = ({
  categoryGroups,
  onSelectCategoryForApply,
  onUpdateCategoryGroups
}) => {
  const { t } = useLanguage();
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminManageOpen, setIsAdminManageOpen] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState({
    targetGroupId: 'accounting',
    name: '',
    description: '',
    idealProfile: '',
    permittedActivities: '',
    potentialBenefits: ''
  });

  // Icon mapping
  const renderGroupIcon = (iconName: string) => {
    switch (iconName) {
      case 'Calculator':
        return <Calculator className="w-5 h-5 text-[#0046B8] dark:text-blue-400" />;
      case 'Server':
        return <Server className="w-5 h-5 text-[#0046B8] dark:text-blue-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-[#0046B8] dark:text-blue-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-[#0046B8] dark:text-blue-400" />;
      case 'Globe':
      default:
        return <Globe className="w-5 h-5 text-[#0046B8] dark:text-blue-400" />;
    }
  };

  // Filter logic
  const filteredSubcategories = useMemo(() => {
    const list: { groupTitle: string; groupId: string; subcategory: PartnerSubcategory }[] = [];

    categoryGroups.forEach(group => {
      if (selectedGroup !== 'all' && group.id !== selectedGroup) return;

      group.subcategories.forEach(sub => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            sub.name.toLowerCase().includes(q) ||
            sub.description.toLowerCase().includes(q) ||
            sub.idealProfile.toLowerCase().includes(q) ||
            group.title.toLowerCase().includes(q);
          if (!matches) return;
        }

        list.push({
          groupTitle: group.title,
          groupId: group.id,
          subcategory: sub
        });
      });
    });

    return list;
  }, [categoryGroups, selectedGroup, searchQuery]);

  // Toggle active status (admin feature)
  const handleToggleSubcategory = (groupId: string, subId: string) => {
    if (!onUpdateCategoryGroups) return;
    const updated = categoryGroups.map(g => {
      if (g.id !== groupId) return g;
      return {
        ...g,
        subcategories: g.subcategories.map(s => {
          if (s.id !== subId) return s;
          return { ...s, isActive: !s.isActive };
        })
      };
    });
    onUpdateCategoryGroups(updated);
  };

  // Add new subcategory (admin feature)
  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubcategory.name.trim() || !onUpdateCategoryGroups) return;

    const newId = newSubcategory.name.toLowerCase().replace(/\s+/g, '-');
    const created: PartnerSubcategory = {
      id: newId,
      name: newSubcategory.name,
      description: newSubcategory.description || 'Professional MsmeBooks channel partner.',
      idealProfile: newSubcategory.idealProfile || 'Qualified business or technology professional.',
      permittedActivities: newSubcategory.permittedActivities
        ? newSubcategory.permittedActivities.split(',').map(s => s.trim())
        : ['Customer onboarding', 'Service advisory'],
      potentialBenefits: newSubcategory.potentialBenefits
        ? newSubcategory.potentialBenefits.split(',').map(s => s.trim())
        : ['Commission revenue', 'Partner dashboard', 'Certificates'],
      isActive: true
    };

    const updated = categoryGroups.map(g => {
      if (g.id === newSubcategory.targetGroupId) {
        return {
          ...g,
          subcategories: [...g.subcategories, created]
        };
      }
      return g;
    });

    onUpdateCategoryGroups(updated);
    setNewSubcategory({
      targetGroupId: 'accounting',
      name: '',
      description: '',
      idealProfile: '',
      permittedActivities: '',
      potentialBenefits: ''
    });
  };

  return (
    <section id="categories" className="py-20 bg-slate-50/70 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0046B8] dark:text-blue-400">
              <span>Section 01</span>
              <span aria-hidden="true">·</span>
              <span>{t('categories.badge', '10 Specialised Partner Categories')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {t('categories.title', 'Tailored Tracks for Every Industry Professional')}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              {t(
                'categories.subtitle',
                'From licensed chartered accountants and enterprise ERP advisors to frontline retail POS distributors, choose the partnership track structured for your business model.'
              )}
            </p>
          </div>

          {/* Quick Admin Category Configurator Toggle */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAdminManageOpen(!isAdminManageOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              <span>{isAdminManageOpen ? 'Close Category Config' : 'Admin Category Config'}</span>
            </button>
          </div>
        </div>

        {/* Admin Category Manager Panel (if toggled) */}
        {isAdminManageOpen && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-blue-200 dark:border-slate-700 shadow-md space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Category Administrator Manager</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add, toggle, or deactivate partnership tracks in real time without altering source code.
                </p>
              </div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800 font-mono">
                Live Dynamic Sync
              </span>
            </div>

            <form onSubmit={handleAddSubcategory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Parent Category Group</label>
                <select
                  value={newSubcategory.targetGroupId}
                  onChange={e => setNewSubcategory({ ...newSubcategory, targetGroupId: e.target.value })}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0046B8]"
                >
                  {categoryGroups.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Subcategory Name</label>
                <input
                  type="text"
                  placeholder="e.g. Healthcare Accounting Specialist"
                  value={newSubcategory.name}
                  onChange={e => setNewSubcategory({ ...newSubcategory, name: e.target.value })}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Ideal Partner Profile</label>
                <input
                  type="text"
                  placeholder="e.g. Firms serving clinics and hospitals"
                  value={newSubcategory.idealProfile}
                  onChange={e => setNewSubcategory({ ...newSubcategory, idealProfile: e.target.value })}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Permitted Activities (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Clinical billing setup, Pharmacy POS integration, Tax advisory"
                  value={newSubcategory.permittedActivities}
                  onChange={e => setNewSubcategory({ ...newSubcategory, permittedActivities: e.target.value })}
                  className="w-full text-xs border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8]"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#0046B8] hover:bg-[#003893] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Category</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filter Controls Bar */}
        <div className="space-y-4">
          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={t('categories.searchPlaceholder', 'Search category, service, or partner profile...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0046B8] dark:focus:ring-lime-400 focus:border-transparent transition-all shadow-xs"
            />
          </div>

          {/* Interactive Group Filter Segmented Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedGroup('all')}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                selectedGroup === 'all'
                  ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {t('categories.filterAll', 'All Categories')} ({categoryGroups.reduce((acc, g) => acc + g.subcategories.length, 0)})
            </button>

            {categoryGroups.map(group => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroup(group.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
                  selectedGroup === group.id
                    ? 'bg-[#0046B8] dark:bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{group.title.split('&')[0].trim()}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                  selectedGroup === group.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}>
                  {group.subcategories.length}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubcategories.map(({ groupTitle, groupId, subcategory }) => {
            const isInactive = subcategory.isActive === false;

            return (
              <div
                key={subcategory.id}
                className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 flex flex-col justify-between p-6 ${
                  isInactive
                    ? 'border-slate-200 dark:border-slate-800 opacity-60 bg-slate-50 dark:bg-slate-950/60'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 hover:shadow-lg dark:hover:shadow-black/40'
                }`}
              >
                <div className="space-y-4">
                  
                  {/* Category Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#0046B8] dark:text-blue-400 uppercase tracking-wider">
                        {groupTitle}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                        {subcategory.name}
                      </h3>
                    </div>

                    {isAdminManageOpen && (
                      <button
                        type="button"
                        onClick={() => handleToggleSubcategory(groupId, subcategory.id)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                        title={isInactive ? 'Activate Track' : 'Deactivate Track'}
                      >
                        {isInactive ? (
                          <ToggleLeft className="w-6 h-6 text-slate-400 dark:text-slate-600" />
                        ) : (
                          <ToggleRight className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {subcategory.description}
                  </p>

                  {/* Ideal Partner Profile */}
                  <div className="bg-slate-50 dark:bg-slate-950/70 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 text-xs space-y-1">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Ideal Partner Profile</p>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{subcategory.idealProfile}</p>
                  </div>

                  {/* Permitted Activities */}
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Permitted Activities:</p>
                    <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                      {subcategory.permittedActivities.map((act, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-lime-600 dark:text-lime-400 shrink-0" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Benefits */}
                  <div className="space-y-1 text-xs pt-1 border-t border-slate-100 dark:border-slate-800">
                    <p className="font-bold text-slate-800 dark:text-slate-200">Key Benefits:</p>
                    <p className="text-slate-600 dark:text-slate-400">
                      {subcategory.potentialBenefits.join(' · ')}
                    </p>
                  </div>

                </div>

                {/* Card Action Button */}
                <div className="pt-5 mt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={isInactive}
                    onClick={() => onSelectCategoryForApply(subcategory.name, groupTitle)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      isInactive
                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                        : 'bg-[#0046B8] hover:bg-[#003893] dark:bg-blue-600 dark:hover:bg-blue-500 text-white shadow-xs hover:shadow'
                    }`}
                  >
                    <span>{isInactive ? 'Category Inactive' : t('categories.joinCategory', 'Join this Category')}</span>
                    {!isInactive && <ArrowRight className="w-3.5 h-3.5 text-lime-300" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSubcategories.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No matching categories found</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Try adjusting your search keywords or clear your group filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGroup('all');
              }}
              className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
