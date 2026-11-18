import React, { useState } from 'react';
import { 
  Link2, 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  HelpCircle, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight, 
  CreditCard, 
  QrCode, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';
import { downloadBadgeSvg } from './OfficialPartnerBadge';

interface PartnerQuickActionsGridProps {
  onNavigateTab: (tab: 'overview' | 'leaderboard' | 'referrals' | 'analytics' | 'generator' | 'commissions' | 'payouts' | 'support') => void;
  onScheduleCall: () => void;
  partnerCode?: string;
  referralLink?: string;
  onShowToast?: (message: string) => void;
  className?: string;
}

export const PartnerQuickActionsGrid: React.FC<PartnerQuickActionsGridProps> = ({
  onNavigateTab,
  onScheduleCall,
  partnerCode = 'MSME-PT-8421',
  referralLink = 'https://www.msmebooks.org/signup?ref=MSME-PT-8421',
  onShowToast,
  className = ''
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadingBadge, setDownloadingBadge] = useState(false);

  const handleCopyReferralLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    if (onShowToast) {
      onShowToast(`Referral URL copied to clipboard: ${referralLink}`);
    }
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadBadge = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloadingBadge(true);
    downloadBadgeSvg('gold', partnerCode);
    if (onShowToast) {
      onShowToast(`Official Gold Partner Badge SVG downloaded! (ID: ${partnerCode})`);
    }
    setTimeout(() => setDownloadingBadge(false), 2500);
  };

  const actions = [
    {
      id: 'referral-link',
      title: 'Generate Referral Link',
      desc: '1-click copy tracking link or launch dynamic QR Code Studio',
      icon: Link2,
      iconColor: 'text-[#0A3981] dark:text-[#8CE600]',
      iconBg: 'bg-blue-100 dark:bg-blue-900/60',
      badge: copiedLink ? 'Copied to Clipboard!' : '1-Click Copy',
      badgeColor: copiedLink 
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-[#8CE600] border-emerald-300 dark:border-emerald-700' 
        : 'bg-blue-50 text-[#0A3981] dark:bg-blue-950 dark:text-sky-300 border-blue-200 dark:border-blue-800',
      onClick: handleCopyReferralLink,
      secondaryAction: {
        label: 'Open QR Studio →',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onNavigateTab('generator');
        }
      }
    },
    {
      id: 'brand-assets',
      title: 'Download Brand Assets',
      desc: 'High-res vector badges, transparent PNG logos & marketing pack',
      icon: Download,
      iconColor: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-100 dark:bg-amber-950/70',
      badge: downloadingBadge ? 'Downloaded SVG!' : 'Gold SVG Badge',
      badgeColor: downloadingBadge 
        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-[#8CE600] border-emerald-300' 
        : 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      onClick: handleDownloadBadge,
      secondaryAction: {
        label: 'Co-Branded Kit →',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          // Scroll or trigger assets download
          downloadBadgeSvg('gold', partnerCode);
          if (onShowToast) onShowToast('Master Partner Assets Kit triggered!');
        }
      }
    },
    {
      id: 'commission-statements',
      title: 'Commission Statements',
      desc: 'Inspect monthly 30% rev-share calculations & wire payout ledger',
      icon: FileText,
      iconColor: 'text-emerald-600 dark:text-[#8CE600]',
      iconBg: 'bg-emerald-100 dark:bg-emerald-950/70',
      badge: '$1,440.00 Approved',
      badgeColor: 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/80 dark:text-[#8CE600] border-emerald-300 dark:border-emerald-800',
      onClick: () => onNavigateTab('commissions'),
      secondaryAction: {
        label: 'Payout History →',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onNavigateTab('payouts');
        }
      }
    },
    {
      id: 'schedule-call',
      title: 'Schedule Discovery Call',
      desc: 'Book 25-min onboarding session with the Channel Director',
      icon: Calendar,
      iconColor: 'text-sky-600 dark:text-sky-300',
      iconBg: 'bg-sky-100 dark:bg-sky-950/70',
      badge: 'Priority Booking',
      badgeColor: 'bg-sky-50 text-sky-800 dark:bg-sky-950 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      onClick: onScheduleCall,
      secondaryAction: {
        label: 'Reserve Slot →',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onScheduleCall();
        }
      }
    },
    {
      id: 'lead-pipeline',
      title: 'Track Lead Pipeline',
      desc: 'Monitor prospect stages, demo requests & 14-day client trials',
      icon: Users,
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-100 dark:bg-indigo-950/70',
      badge: '5 Active Deals',
      badgeColor: 'bg-indigo-50 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      onClick: () => onNavigateTab('referrals'),
      secondaryAction: {
        label: 'Open Pipeline →',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onNavigateTab('referrals');
        }
      }
    },
    {
      id: 'support-desk',
      title: 'Priority Support Desk',
      desc: 'Escalate hardware pairing, migration tickets & compliance help',
      icon: HelpCircle,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-950/70',
      badge: '< 4hr Partner SLA',
      badgeColor: 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      onClick: () => onNavigateTab('support'),
      secondaryAction: {
        label: 'Submit Ticket →',
        onClick: (e: React.MouseEvent) => {
          e.stopPropagation();
          onNavigateTab('support');
        }
      }
    }
  ];

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0A3981] dark:bg-[#8CE600] animate-pulse" />
          <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>Partner Quick Actions</span>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-400 normal-case">
              (One-Click Shortcuts)
            </span>
          </h4>
        </div>
        <span className="text-[11px] text-slate-400 dark:text-slate-400 hidden sm:inline">
          Fast-path access for daily operations
        </span>
      </div>

      {/* Grid of Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((act) => {
          const IconComponent = act.icon;
          return (
            <div
              key={act.id}
              onClick={act.onClick}
              className="bg-white dark:bg-[#072457] hover:bg-blue-50/50 dark:hover:bg-[#0a2f70] rounded-2xl p-4 border border-slate-200 dark:border-blue-800/80 hover:border-[#0A3981] dark:hover:border-[#8CE600]/80 shadow-xs hover:shadow-md dark:shadow-[0_0_12px_rgba(10,57,129,0.25)] dark:hover:shadow-[0_0_18px_rgba(140,230,0,0.18)] transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Top icon and badge pill */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className={`w-9 h-9 rounded-xl ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-4 h-4" />
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${act.badgeColor} whitespace-nowrap`}>
                    {act.badge}
                  </span>
                </div>

                {/* Title & Desc */}
                <h5 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white group-hover:text-[#0A3981] dark:group-hover:text-[#8CE600] transition-colors leading-tight">
                  {act.title}
                </h5>
                <p className="text-[11px] text-slate-500 dark:text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                  {act.desc}
                </p>
              </div>

              {/* Bottom secondary link */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-blue-900/60 flex items-center justify-between text-xs">
                <span className="text-[10px] font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                  Tap to launch
                </span>
                {act.secondaryAction && (
                  <button
                    type="button"
                    onClick={act.secondaryAction.onClick}
                    className="text-[11px] font-extrabold text-[#0A3981] dark:text-[#8CE600] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{act.secondaryAction.label}</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
