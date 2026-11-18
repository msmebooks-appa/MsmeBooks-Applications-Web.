import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Flame, 
  Filter, 
  Calendar,
  Building,
  MapPin,
  Briefcase,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { PartnerApplication, PartnerTierId } from '../types/partner';
import { useCurrency } from '../context/CurrencyContext';
import { useLanguage } from '../context/LanguageContext';

interface PartnerLeaderboardProps {
  applications: PartnerApplication[];
  onOpenApplyModal: (tierId?: PartnerTierId) => void;
  onOpenAdminModal?: () => void;
}

export const PartnerLeaderboard: React.FC<PartnerLeaderboardProps> = ({
  applications,
  onOpenApplyModal,
  onOpenAdminModal
}) => {
  const { formatFromNGN, currencyConfig } = useCurrency();
  const { t } = useLanguage();
  const [metricSort, setMetricSort] = useState<'conversions' | 'commission' | 'growth'>('conversions');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'top5' | 'all'>('top5');

  // Compute and rank partners based on applications and performance metrics
  const rankedPartners = useMemo(() => {
    // Filter by sector if specified
    let list = applications.filter((app) => {
      if (selectedSector === 'all') return true;
      if (selectedSector === 'accounting') {
        return app.categoryId === 'accountants' || app.categoryId === 'bookkeepers' || app.categoryId === 'tax_consultants';
      }
      if (selectedSector === 'pos') {
        return app.categoryId === 'pos_agents' || app.categoryId === 'retail_consultants';
      }
      if (selectedSector === 'tech') {
        return app.categoryId === 'it_consultants' || app.categoryId === 'erp_integrators' || app.categoryId === 'software_resellers';
      }
      if (selectedSector === 'advisory') {
        return app.categoryId === 'business_consultants' || app.categoryId === 'financial_advisors';
      }
      return true;
    });

    // Sort according to chosen metric
    list = [...list].sort((a, b) => {
      if (metricSort === 'conversions') {
        return (b.monthlyConversions || 0) - (a.monthlyConversions || 0);
      }
      if (metricSort === 'commission') {
        return (b.monthlyCommissionNGN || 0) - (a.monthlyCommissionNGN || 0);
      }
      if (metricSort === 'growth') {
        const growthA = parseInt(a.growthMoM?.replace(/[^0-9]/g, '') || '0', 10);
        const growthB = parseInt(b.growthMoM?.replace(/[^0-9]/g, '') || '0', 10);
        return growthB - growthA;
      }
      return (b.monthlyConversions || 0) - (a.monthlyConversions || 0);
    });

    return list;
  }, [applications, selectedSector, metricSort]);

  // Extract top 5
  const top5 = rankedPartners.slice(0, 5);
  const podiumTop3 = top5.slice(0, 3);
  const ranks4and5 = top5.slice(3, 5);

  const getTierBadge = (tier: PartnerTierId) => {
    switch (tier) {
      case 'platinum':
        return {
          label: 'Platinum (40%)',
          bg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800/60'
        };
      case 'gold':
        return {
          label: 'Gold (30%)',
          bg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
        };
      case 'silver':
        return {
          label: 'Silver (20%)',
          bg: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700'
        };
      default:
        return {
          label: 'Bronze (15%)',
          bg: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60'
        };
    }
  };

  return (
    <section id="leaderboard" className="py-20 bg-slate-50 dark:bg-[#0c182c] border-y border-slate-200 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1261B5]/10 dark:bg-[#1261B5]/20 text-[#1261B5] dark:text-[#B9E51C] text-xs font-bold uppercase tracking-wider border border-[#1261B5]/20">
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('leaderboard.badge')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#142D4E] dark:text-white leading-tight">
              {t('leaderboard.title')}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed">
              {t('leaderboard.subtitle')}
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#142D4E] rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 shadow-xs">
              <Calendar className="w-4 h-4 text-[#1261B5] dark:text-[#B9E51C]" />
              <span>Current Cycle: <strong className="text-slate-900 dark:text-white">Oct 1 – Oct 31</strong></span>
            </div>
            <button
              onClick={() => onOpenApplyModal('gold')}
              className="px-5 py-2.5 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#1261B5]/20 flex items-center gap-2 group whitespace-nowrap"
            >
              <span>{t('leaderboard.join')}</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Filter and Metric Control Toolbar */}
        <div className="bg-white dark:bg-[#142D4E] p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Sector Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Sector:
            </span>
            {[
              { id: 'all', label: 'All Sectors' },
              { id: 'accounting', label: 'Accounting & Tax' },
              { id: 'pos', label: 'POS & Retail' },
              { id: 'tech', label: 'IT & Software' },
              { id: 'advisory', label: 'Management Advisory' }
            ].map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSector(sec.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  selectedSector === sec.id
                    ? 'bg-[#1261B5] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {sec.label}
              </button>
            ))}
          </div>

          {/* Metric Sort Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Rank by:
            </span>
            <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
              <button
                onClick={() => setMetricSort('conversions')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metricSort === 'conversions'
                    ? 'bg-white dark:bg-[#101e35] text-[#1261B5] dark:text-[#B9E51C] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Conversions
              </button>
              <button
                onClick={() => setMetricSort('commission')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metricSort === 'commission'
                    ? 'bg-white dark:bg-[#101e35] text-[#1261B5] dark:text-[#B9E51C] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Commission Paid
              </button>
              <button
                onClick={() => setMetricSort('growth')}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  metricSort === 'growth'
                    ? 'bg-white dark:bg-[#101e35] text-[#1261B5] dark:text-[#B9E51C] shadow-xs'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                MoM Growth
              </button>
            </div>
          </div>
        </div>

        {/* Podium: Top 3 Champions of the Month */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 items-stretch">
          {podiumTop3.map((partner, index) => {
            const rank = index + 1;
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;
            const tierBadge = getTierBadge(partner.preferredTier);

            return (
              <div
                key={partner.id}
                className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                  isFirst
                    ? 'bg-gradient-to-b from-[#142D4E] to-[#0c1a2e] text-white border-2 border-[#B9E51C] shadow-xl shadow-[#1261B5]/15 md:-translate-y-2'
                    : 'bg-white dark:bg-[#142D4E] text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 shadow-md'
                }`}
              >
                {/* Top Badge & Trophy Ribbon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {isFirst && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#B9E51C] text-[#142D4E] text-xs font-black uppercase tracking-wider shadow-sm">
                        <Trophy className="w-3.5 h-3.5 fill-[#142D4E]" />
                        <span>{t('leaderboard.champion')}</span>
                      </span>
                    )}
                    {isSecond && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold uppercase tracking-wider">
                        <Medal className="w-3.5 h-3.5 text-slate-500 dark:text-slate-300" />
                        <span>{t('leaderboard.silver')}</span>
                      </span>
                    )}
                    {isThird && (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
                        <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>{t('leaderboard.bronze')}</span>
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${tierBadge.bg}`}>
                    {tierBadge.label}
                  </span>
                </div>

                {/* Partner Name, Business & Flag */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`text-lg font-bold tracking-tight ${isFirst ? 'text-white' : 'text-[#142D4E] dark:text-white'}`}>
                        {partner.businessName}
                      </h3>
                      <p className={`text-xs ${isFirst ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'} flex items-center gap-1.5 mt-0.5`}>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{partner.fullName}</span>
                        <span>·</span>
                        <span className="text-base" title={partner.country}>{partner.flagEmoji || '🌍'}</span>
                        <span>{partner.city}, {partner.country}</span>
                      </p>
                    </div>
                  </div>

                  {partner.badgeTitle && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#B9E51C] bg-[#B9E51C]/10 dark:bg-white/5 px-2.5 py-1 rounded-md">
                      <Sparkles className="w-3 h-3 text-[#B9E51C]" />
                      <span>{partner.badgeTitle}</span>
                    </div>
                  )}

                  {partner.keyAchievement && (
                    <p className={`text-xs italic leading-relaxed pt-1 ${isFirst ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                      "{partner.keyAchievement}"
                    </p>
                  )}
                </div>

                {/* Core Performance Numbers Grid */}
                <div className={`grid grid-cols-2 gap-3 p-3.5 rounded-xl mb-4 ${
                  isFirst ? 'bg-white/10 border border-white/10' : 'bg-slate-50 dark:bg-[#101e35] border border-slate-200/80 dark:border-slate-700/60'
                }`}>
                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isFirst ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                      Conversions
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-xl font-extrabold ${isFirst ? 'text-[#B9E51C]' : 'text-[#1261B5] dark:text-[#B9E51C]'}`}>
                        {partner.monthlyConversions || 0}
                      </span>
                      <span className={`text-xs ${isFirst ? 'text-slate-300' : 'text-slate-500'}`}>SMEs</span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isFirst ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                      Monthly Commission
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className={`text-base font-extrabold ${isFirst ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {formatFromNGN(partner.monthlyCommissionNGN || 0, { compact: true })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isFirst ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                      Referred Volume
                    </span>
                    <span className={`text-xs font-bold ${isFirst ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      {formatFromNGN(partner.monthlyRevenueNGN || 0, { compact: true })}
                    </span>
                  </div>

                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isFirst ? 'text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                      MoM Growth
                    </span>
                    <span className="text-xs font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{partner.growthMoM || '+20%'}</span>
                    </span>
                  </div>
                </div>

                {/* Footer status */}
                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/20 dark:border-slate-700/60">
                  <span className="flex items-center gap-1.5 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified Partner SLA</span>
                  </span>
                  <span className={`text-[11px] font-mono ${isFirst ? 'text-slate-400' : 'text-slate-500'}`}>
                    ID: {partner.id}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detailed Leaderboard Table for Ranks 4 to 5 & Beyond */}
        <div className="bg-white dark:bg-[#142D4E] rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-8">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <h3 className="text-sm font-bold text-[#142D4E] dark:text-white uppercase tracking-wider">
                Ranks #4 & #5 · Monthly Contenders & Rising All-Stars
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Disbursed in {currencyConfig.code} ({currencyConfig.name})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-[#0c1a2e] text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Rank</th>
                  <th className="py-3 px-4 sm:px-6">Partner & Practice</th>
                  <th className="py-3 px-4 sm:px-6">Location</th>
                  <th className="py-3 px-4 sm:px-6">Reward Tier</th>
                  <th className="py-3 px-4 sm:px-6 text-center">Conversions</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Commission Paid</th>
                  <th className="py-3 px-4 sm:px-6 text-center">Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {ranks4and5.map((partner, idx) => {
                  const rank = idx + 4;
                  const tierBadge = getTierBadge(partner.preferredTier);

                  return (
                    <tr
                      key={partner.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300 text-xs">
                          #{rank}
                        </span>
                      </td>

                      {/* Partner Name & Business */}
                      <td className="py-4 px-4 sm:px-6">
                        <div>
                          <div className="font-bold text-[#142D4E] dark:text-white text-sm">
                            {partner.businessName}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            {partner.fullName}
                          </div>
                          {partner.keyAchievement && (
                            <div className="text-[11px] text-slate-400 italic mt-0.5 truncate max-w-xs">
                              {partner.keyAchievement}
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                          <span className="text-base">{partner.flagEmoji || '🌍'}</span>
                          <span>{partner.city}, {partner.country}</span>
                        </div>
                      </td>

                      {/* Tier */}
                      <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${tierBadge.bg}`}>
                          {tierBadge.label}
                        </span>
                      </td>

                      {/* Conversions */}
                      <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                        <div className="font-bold text-[#1261B5] dark:text-[#B9E51C] text-sm">
                          {partner.monthlyConversions || 0}
                        </div>
                        <div className="text-[10px] text-slate-400">SME clients</div>
                      </td>

                      {/* Commission */}
                      <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm">
                          {formatFromNGN(partner.monthlyCommissionNGN || 0)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Volume: {formatFromNGN(partner.monthlyRevenueNGN || 0, { compact: true })}
                        </div>
                      </td>

                      {/* Velocity */}
                      <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                          <TrendingUp className="w-3 h-3" />
                          <span>{partner.growthMoM || '+22%'}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Engagement Motivation Callout Banner */}
        <div className="bg-gradient-to-r from-[#142D4E] via-[#1261B5] to-[#142D4E] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[#B9E51C] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Earn Your Spot on Next Month's Leaderboard</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Ready to Accelerate Your SME Advisory Revenue?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Certified partners earn up to 40% recurring monthly commissions, lifetime client attribution, free client migration support, and priority regional lead sharing.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 relative z-10">
            <button
              onClick={() => onOpenApplyModal('gold')}
              className="px-6 py-3.5 bg-[#B9E51C] hover:bg-[#aadb14] text-[#142D4E] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg shadow-[#B9E51C]/25 flex items-center gap-2"
            >
              <span>Apply for Partnership</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#B9E51C]" />
                <span>Simulate Admin Approvals</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};
