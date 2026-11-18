import React, { useState } from 'react';
import { 
  Trophy, 
  Award, 
  TrendingUp, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  Medal, 
  Globe, 
  Flame, 
  Sparkles,
  ExternalLink,
  ChevronUp,
  Filter
} from 'lucide-react';
import { PartnerTierId } from '../types';

interface LeaderboardEntry {
  rank: number;
  partnerName: string;
  firmType: string;
  country: string;
  city: string;
  tier: PartnerTierId;
  activeClients: number;
  mrrGenerated: number;
  monthlyCommission: number;
  points: number;
  growth: string;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  {
    rank: 1,
    partnerName: 'Gold Coast FinTech & Advisory',
    firmType: 'Accounting & Systems Integrator',
    country: 'Ghana',
    city: 'Accra',
    tier: 'platinum',
    activeClients: 142,
    mrrGenerated: 12450,
    monthlyCommission: 4980,
    points: 9850,
    growth: '+42% MoM'
  },
  {
    rank: 2,
    partnerName: 'Adeyemi & Co. Chartered Accountants',
    firmType: 'ICAN Chartered Accounting Firm',
    country: 'Nigeria',
    city: 'Lagos',
    tier: 'gold',
    activeClients: 98,
    mrrGenerated: 8900,
    monthlyCommission: 2670,
    points: 8420,
    growth: '+28% MoM',
    isCurrentUser: true
  },
  {
    rank: 3,
    partnerName: 'Rift Valley Retail POS Systems',
    firmType: 'POS Hardware & Retail Integrator',
    country: 'Kenya',
    city: 'Nairobi',
    tier: 'gold',
    activeClients: 84,
    mrrGenerated: 7560,
    monthlyCommission: 2268,
    points: 7910,
    growth: '+35% MoM'
  },
  {
    rank: 4,
    partnerName: 'Mzansi Cloud ERP Specialists',
    firmType: 'Enterprise ERP Implementation',
    country: 'South Africa',
    city: 'Johannesburg',
    tier: 'platinum',
    activeClients: 76,
    mrrGenerated: 9120,
    monthlyCommission: 3648,
    points: 7450,
    growth: '+19% MoM'
  },
  {
    rank: 5,
    partnerName: 'Kigali Smart Commerce Hub',
    firmType: 'Fintech Software Consultant',
    country: 'Rwanda',
    city: 'Kigali',
    tier: 'silver',
    activeClients: 63,
    mrrGenerated: 5350,
    monthlyCommission: 1070,
    points: 6200,
    growth: '+51% MoM'
  },
  {
    rank: 6,
    partnerName: 'Abidjan Solutions Fiscales',
    firmType: 'Certified Tax & Audit Consultant',
    country: "Côte d'Ivoire",
    city: 'Abidjan',
    tier: 'silver',
    activeClients: 51,
    mrrGenerated: 4200,
    monthlyCommission: 840,
    points: 5400,
    growth: '+22% MoM'
  },
  {
    rank: 7,
    partnerName: 'Nile Delta Business Systems',
    firmType: 'ERP & Multi-Store Accounting',
    country: 'Egypt',
    city: 'Cairo',
    tier: 'gold',
    activeClients: 49,
    mrrGenerated: 4650,
    monthlyCommission: 1395,
    points: 5120,
    growth: '+14% MoM'
  },
  {
    rank: 8,
    partnerName: 'AfriDiaspora Cloud Accounting UK',
    firmType: 'UK-Africa Diaspora Advisory',
    country: 'United Kingdom',
    city: 'London',
    tier: 'silver',
    activeClients: 42,
    mrrGenerated: 3950,
    monthlyCommission: 790,
    points: 4800,
    growth: '+31% MoM'
  }
];

export const PartnerLeaderboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [celebratedPartner, setCelebratedPartner] = useState<string | null>(null);

  const filteredData = LEADERBOARD_DATA.filter((p) => {
    if (selectedRegion === 'all') return true;
    if (selectedRegion === 'west' && ['Nigeria', 'Ghana', "Côte d'Ivoire"].includes(p.country)) return true;
    if (selectedRegion === 'east' && ['Kenya', 'Rwanda'].includes(p.country)) return true;
    if (selectedRegion === 'south' && ['South Africa'].includes(p.country)) return true;
    if (selectedRegion === 'diaspora' && ['United Kingdom', 'Egypt'].includes(p.country)) return true;
    return true;
  });

  const getTierBadge = (tier: PartnerTierId) => {
    switch (tier) {
      case 'platinum':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-900 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-700">
            ★ Platinum (40%)
          </span>
        );
      case 'gold':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            ★ Gold (30%)
          </span>
        );
      case 'silver':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700">
            ★ Silver (20%)
          </span>
        );
      case 'bronze':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-900 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-300 dark:border-orange-700">
            ★ Bronze (15%)
          </span>
        );
    }
  };

  const handleCelebrate = (name: string) => {
    setCelebratedPartner(name);
    setTimeout(() => setCelebratedPartner(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0A3981] via-[#0D47A1] to-[#061F4A] rounded-2xl p-6 text-white shadow-lg relative overflow-hidden border border-blue-700/60">
        <div className="absolute right-0 top-0 -mr-10 -mt-10 w-60 h-60 rounded-full bg-[#8CE600]/15 filter blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8CE600]/20 text-[#8CE600] text-xs font-bold uppercase tracking-wider mb-2 border border-[#8CE600]/40">
              <Trophy className="w-3.5 h-3.5" />
              Pan-African & Global Ecosystem Rankings
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white">
              Global Partner Leaderboard
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 max-w-xl mt-1">
              Celebrating top-performing accounting practices, retail POS distributors, and ERP system integrators scaling recurring commissions across 12 countries.
            </p>
          </div>

          {/* Timeframe Filter Pills */}
          <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl self-start md:self-auto border border-blue-500/40">
            {(['month', 'quarter', 'year'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedPeriod === period
                    ? 'bg-[#8CE600] text-[#061F4A] shadow'
                    : 'text-blue-200 hover:text-white'
                }`}
              >
                {period === 'month' ? 'This Month' : period === 'quarter' ? 'Q4 2026' : 'Full Year 2026'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 5 Performers Ranking Card UI (Ranked by Monthly Commission Earnings) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8CE600] animate-pulse" />
            <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
              Top 5 Performers of the Month
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-[#8CE600] border border-emerald-300 dark:border-emerald-800">
              Ranked by Commission Earnings
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            Updated Daily · November 2026 Cycle
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {[...LEADERBOARD_DATA]
            .sort((a, b) => b.monthlyCommission - a.monthlyCommission)
            .slice(0, 5)
            .map((partner, index) => {
              const rank = index + 1;
              const initials = partner.partnerName
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('');

              const rankStyles = {
                1: {
                  badge: 'bg-amber-400 text-amber-950 font-black border-amber-300 shadow-amber-500/20',
                  border: 'border-2 border-amber-400 dark:border-amber-500 shadow-lg',
                  bg: 'bg-gradient-to-b from-amber-50/80 via-white to-amber-50/20 dark:from-amber-950/30 dark:via-[#072457] dark:to-[#051c44]',
                  avatarBg: 'from-amber-400 to-amber-600 text-amber-950',
                  icon: '🥇'
                },
                2: {
                  badge: 'bg-slate-200 text-slate-900 font-bold border-slate-300',
                  border: 'border-2 border-slate-300 dark:border-slate-600 shadow-md',
                  bg: 'bg-gradient-to-b from-slate-50 via-white to-slate-50/20 dark:from-slate-900/40 dark:via-[#072457] dark:to-[#051c44]',
                  avatarBg: 'from-slate-400 to-slate-600 text-white',
                  icon: '🥈'
                },
                3: {
                  badge: 'bg-orange-200 text-orange-950 font-bold border-orange-300',
                  border: 'border-2 border-orange-300 dark:border-orange-600/70 shadow-md',
                  bg: 'bg-gradient-to-b from-orange-50/60 via-white to-orange-50/20 dark:from-orange-950/30 dark:via-[#072457] dark:to-[#051c44]',
                  avatarBg: 'from-orange-400 to-orange-600 text-white',
                  icon: '🥉'
                },
                4: {
                  badge: 'bg-sky-100 text-sky-950 font-bold border-sky-300 dark:bg-sky-950 dark:text-sky-300',
                  border: 'border border-slate-200 dark:border-blue-800 shadow-sm',
                  bg: 'bg-white dark:bg-[#072457]',
                  avatarBg: 'from-sky-500 to-blue-600 text-white',
                  icon: '4'
                },
                5: {
                  badge: 'bg-emerald-100 text-emerald-950 font-bold border-emerald-300 dark:bg-emerald-950 dark:text-[#8CE600]',
                  border: 'border border-slate-200 dark:border-blue-800 shadow-sm',
                  bg: 'bg-white dark:bg-[#072457]',
                  avatarBg: 'from-emerald-500 to-teal-700 text-white',
                  icon: '5'
                }
              }[rank as 1 | 2 | 3 | 4 | 5];

              return (
                <div
                  key={partner.partnerName}
                  className={`rounded-2xl p-4.5 flex flex-col justify-between transition-all hover:-translate-y-1 relative ${rankStyles.bg} ${rankStyles.border}`}
                >
                  {/* Top Rank Badge & Growth */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-xl text-xs font-black shadow-xs ${rankStyles.badge}`}
                    >
                      {rankStyles.icon}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-[#8CE600] flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                      <TrendingUp className="w-3 h-3" />
                      {partner.growth}
                    </span>
                  </div>

                  {/* Avatar Placeholder & Partner Identity */}
                  <div className="text-center flex flex-col items-center">
                    <div className="relative mb-2.5">
                      <div
                        className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${rankStyles.avatarBg} font-black text-base flex items-center justify-center shadow-md`}
                      >
                        {initials}
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-[#072457] flex items-center justify-center" title="Active on platform">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      </span>
                    </div>

                    <h5 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 leading-snug">
                      {partner.partnerName}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {partner.city}, {partner.country}
                    </p>
                    <div className="mt-1.5">{getTierBadge(partner.tier)}</div>
                  </div>

                  {/* Monthly Commission Earning Callout */}
                  <div className="mt-3.5 pt-3 border-t border-slate-200/80 dark:border-blue-900/60 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                      Monthly Commission
                    </span>
                    <div className="text-base sm:text-lg font-black font-mono text-emerald-600 dark:text-[#8CE600] mt-0.5">
                      ${partner.monthlyCommission.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      {partner.activeClients} Active MSMEs
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCelebrate(partner.partnerName)}
                      className="mt-2.5 w-full py-1 text-[11px] font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-lg transition-colors cursor-pointer"
                    >
                      👏 Cheer
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Region Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Filter className="w-3.5 h-3.5" />
          <span>Region Filter:</span>
          {['all', 'west', 'east', 'south', 'diaspora'].map((reg) => (
            <button
              key={reg}
              onClick={() => setSelectedRegion(reg)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedRegion === reg
                  ? 'bg-[#0A3981] text-white dark:bg-[#8CE600] dark:text-[#061F4A]'
                  : 'bg-white dark:bg-[#072457] border border-slate-200 dark:border-blue-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              {reg === 'all' ? 'All Regions' : reg === 'west' ? 'West Africa' : reg === 'east' ? 'East Africa' : reg === 'south' ? 'Southern Africa' : 'Diaspora & MENA'}
            </button>
          ))}
        </div>

        {celebratedPartner && (
          <div className="text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-950/80 px-3 py-1 rounded-lg animate-bounce flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Cheer sent to {celebratedPartner}! 🎉
          </div>
        )}
      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-white dark:bg-[#072457] rounded-2xl border border-slate-200 dark:border-blue-800/80 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-[#051c44] border-b border-slate-200 dark:border-blue-800 text-slate-500 dark:text-slate-300 font-bold uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Partner Firm</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4 text-center">Active MSMEs</th>
                <th className="py-3 px-4 text-right">MRR Generated</th>
                <th className="py-3 px-4 text-right">Est. Commission</th>
                <th className="py-3 px-4 text-center">Growth</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-blue-900/40">
              {filteredData.map((row) => (
                <tr
                  key={row.rank}
                  className={`transition-colors ${
                    row.isCurrentUser
                      ? 'bg-blue-50/70 dark:bg-blue-950/50 font-semibold border-l-4 border-[#0A3981] dark:border-[#8CE600]'
                      : 'hover:bg-slate-50/60 dark:hover:bg-[#092b63]'
                  }`}
                >
                  <td className="py-3.5 px-4 font-black">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                        row.rank === 1
                          ? 'bg-amber-400 text-amber-950 font-black'
                          : row.rank === 2
                          ? 'bg-slate-300 text-slate-900 font-bold'
                          : row.rank === 3
                          ? 'bg-orange-200 text-orange-950 font-bold'
                          : 'text-slate-500 dark:text-slate-400 font-mono'
                      }`}
                    >
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {row.partnerName}
                          {row.isCurrentUser && (
                            <span className="text-[10px] bg-[#8CE600] text-[#061F4A] px-1.5 py-0.2 rounded font-black uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {row.city}, {row.country} · {row.firmType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {getTierBadge(row.tier)}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                    {row.activeClients}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ${row.mrrGenerated.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-[#8CE600]">
                    ${row.monthlyCommission.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-600 dark:text-[#8CE600]">
                      <ChevronUp className="w-3.5 h-3.5" />
                      {row.growth}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleCelebrate(row.partnerName)}
                      className="px-2.5 py-1 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] bg-blue-50 dark:bg-blue-900/50 hover:bg-blue-100 rounded-lg transition-colors cursor-pointer"
                      title="Cheer and congratulate partner"
                    >
                      👏 Cheer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const CrownIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5m14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
  </svg>
);
