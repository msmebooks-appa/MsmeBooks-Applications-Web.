import React from 'react';
import { PartnerTierId } from '../types';

interface OfficialPartnerBadgeProps {
  tier: PartnerTierId;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  partnerCode?: string;
  showId?: boolean;
  className?: string;
  interactive?: boolean;
  onClick?: () => void;
}

export const OfficialPartnerBadge: React.FC<OfficialPartnerBadgeProps> = ({
  tier,
  size = 'md',
  partnerCode = 'MSME-PT-8421',
  showId = true,
  className = '',
  interactive = false,
  onClick
}) => {
  // Dimension definitions
  const dimensions = {
    sm: { width: 140, height: 160, viewBox: '0 0 280 320' },
    md: { width: 220, height: 250, viewBox: '0 0 280 320' },
    lg: { width: 300, height: 342, viewBox: '0 0 280 320' },
    xl: { width: 420, height: 480, viewBox: '0 0 280 320' }
  }[size];

  // Metallic styling configs matching exact namesake metals
  const tierConfigs = {
    bronze: {
      name: 'BRONZE',
      commission: '15%',
      ring1: '#CD7F32',
      ring2: '#A0522D',
      metallicGradId: 'bronzeMetal',
      shieldFill: '#0A2540',
      accentColor: '#CD7F32',
      bannerGrad: 'url(#bronzeBanner)',
      stars: 3,
      starsColor: '#CD7F32'
    },
    silver: {
      name: 'SILVER',
      commission: '20%',
      ring1: '#E2E8F0',
      ring2: '#94A3B8',
      metallicGradId: 'silverMetal',
      shieldFill: '#0A2540',
      accentColor: '#94A3B8',
      bannerGrad: 'url(#silverBanner)',
      stars: 4,
      starsColor: '#E2E8F0'
    },
    gold: {
      name: 'GOLD',
      commission: '30%',
      ring1: '#FFD700',
      ring2: '#F59E0B',
      metallicGradId: 'goldMetal',
      shieldFill: '#0A2540',
      accentColor: '#FFD700',
      bannerGrad: 'url(#goldBanner)',
      stars: 5,
      starsColor: '#FFD700'
    },
    platinum: {
      name: 'PLATINUM',
      commission: '40%',
      ring1: '#E0E7FF',
      ring2: '#6366F1',
      metallicGradId: 'platMetal',
      shieldFill: '#061F4A',
      accentColor: '#38BDF8',
      bannerGrad: 'url(#platBanner)',
      stars: 5,
      starsColor: '#38BDF8'
    }
  }[tier];

  return (
    <div
      onClick={interactive ? onClick : undefined}
      className={`relative inline-block transition-transform duration-300 ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      } ${className}`}
      title={`MsmeBooks Official ${tierConfigs.name} Partner Badge`}
    >
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={dimensions.viewBox}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="filter drop-shadow-md select-none"
      >
        <defs>
          {/* Metallic Gradients - Exact namesake metallic luster */}
          {/* Bronze: Warm antique metallic bronze (#CD7F32 / #A0522D) */}
          <linearGradient id="bronzeMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E89758" />
            <stop offset="25%" stopColor="#CD7F32" />
            <stop offset="50%" stopColor="#FBD5B5" />
            <stop offset="75%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#6E3314" />
          </linearGradient>

          {/* Silver: Bright sterling metallic silver (#E2E8F0 / #94A3B8) */}
          <linearGradient id="silverMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#F8FAFC" />
            <stop offset="75%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>

          {/* Gold: Radiant 24k gold (#FFD700 / #F59E0B) */}
          <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9C4" />
            <stop offset="25%" stopColor="#FFD700" />
            <stop offset="50%" stopColor="#FFFDF0" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Platinum: Icy titanium/platinum sheen (#E0E7FF / #38BDF8 / #6366F1) */}
          <linearGradient id="platMetal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E0E7FF" />
            <stop offset="50%" stopColor="#BAE6FD" />
            <stop offset="75%" stopColor="#38BDF8" />
            <stop offset="90%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#312E81" />
          </linearGradient>

          {/* Banner Gradients */}
          <linearGradient id="bronzeBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A0522D" />
            <stop offset="100%" stopColor="#5C2C0E" />
          </linearGradient>
          <linearGradient id="silverBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>
          <linearGradient id="goldBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
          <linearGradient id="platBanner" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Subtle Inner Glow */}
          <radialGradient id="msmeBlueGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#061F4A" stopOpacity="0.95" />
          </radialGradient>
        </defs>

        {/* Outer Laurel / Star Rays Accents */}
        <g opacity="0.6">
          <circle cx="140" cy="150" r="132" stroke={`url(#${tierConfigs.metallicGradId})`} strokeWidth="1.5" strokeDasharray="4 6" />
        </g>

        {/* Outer Shield Boundary */}
        <path
          d="M140 12 L245 48 C245 160 215 240 140 286 C65 240 35 160 35 48 L140 12 Z"
          fill={`url(#${tierConfigs.metallicGradId})`}
          filter="drop-shadow(0 6px 12px rgba(0,0,0,0.2))"
        />

        {/* Outer Ridge Line */}
        <path
          d="M140 18 L238 52 C238 156 210 232 140 276 C70 232 42 156 42 52 L140 18 Z"
          fill="#061F4A"
          stroke={`url(#${tierConfigs.metallicGradId})`}
          strokeWidth="3"
        />

        {/* Inner Shield Body with Deep MsmeBooks Corporate Blue */}
        <path
          d="M140 24 L230 56 C230 152 204 224 140 266 C76 224 50 152 50 56 L140 24 Z"
          fill="url(#msmeBlueGlow)"
        />

        {/* MsmeBooks Custom Logo Vector Mark */}
        <g transform="translate(108, 48)">
          {/* Books / Financial Ledger Open Pages */}
          <path
            d="M5 28 C15 22 28 22 32 26 C36 22 49 22 59 28 L59 8 C49 4 36 4 32 8 C28 4 15 4 5 8 Z"
            fill="#FFFFFF"
            opacity="0.95"
          />
          {/* Central Binding */}
          <line x1="32" y1="8" x2="32" y2="26" stroke="#0A3981" strokeWidth="2" />
          {/* Lemon Green Growth Trajectory Arrow */}
          <path
            d="M12 20 L24 12 L36 17 L52 6"
            stroke="#8CE600"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="52,4 54,9 49,8" fill="#8CE600" />
        </g>

        {/* MsmeBooks Text */}
        <text
          x="140"
          y="92"
          textAnchor="middle"
          fill="#FFFFFF"
          fontSize="17"
          fontWeight="800"
          letterSpacing="0.08em"
          fontFamily="'Outfit', sans-serif"
        >
          MsmeBooks
        </text>

        {/* Tier Label (BRONZE, SILVER, GOLD, PLATINUM) */}
        <g transform="translate(0, 102)">
          <rect
            x="60"
            y="2"
            width="160"
            height="26"
            rx="4"
            fill={`url(#${tierConfigs.metallicGradId})`}
            filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
          />
          <text
            x="140"
            y="20"
            textAnchor="middle"
            fill={tier === 'silver' ? '#0F172A' : tier === 'gold' ? '#451A03' : tier === 'platinum' ? '#082F49' : '#FFFFFF'}
            fontSize="14"
            fontWeight="900"
            letterSpacing="0.18em"
            fontFamily="'Outfit', sans-serif"
          >
            {tierConfigs.name}
          </text>
        </g>

        {/* Official Partner Ribbon Banner */}
        <g transform="translate(0, 138)">
          {/* Ribbon ends */}
          <path d="M30 20 L48 2 L48 38 Z" fill={tierConfigs.ring2} />
          <path d="M250 20 L232 2 L232 38 Z" fill={tierConfigs.ring2} />
          {/* Ribbon Main */}
          <path
            d="M45 4 L235 4 L225 36 L55 36 Z"
            fill={tierConfigs.bannerGrad}
            stroke={`url(#${tierConfigs.metallicGradId})`}
            strokeWidth="1.5"
          />
          <text
            x="140"
            y="24"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="12.5"
            fontWeight="800"
            letterSpacing="0.15em"
            fontFamily="'Outfit', sans-serif"
          >
            OFFICIAL PARTNER
          </text>
        </g>

        {/* Commission Badge Callout */}
        <g transform="translate(140, 192)">
          <circle cx="0" cy="0" r="19" fill="#061F4A" stroke={`url(#${tierConfigs.metallicGradId})`} strokeWidth="2" />
          <text
            x="0"
            y="4"
            textAnchor="middle"
            fill={tier === 'platinum' ? '#8CE600' : '#FFFFFF'}
            fontSize="11.5"
            fontWeight="800"
            fontFamily="'Outfit', sans-serif"
          >
            {tierConfigs.commission}
          </text>
          <text
            x="0"
            y="13"
            textAnchor="middle"
            fill="#94A3B8"
            fontSize="7"
            fontWeight="600"
            letterSpacing="0.05em"
            fontFamily="'Outfit', sans-serif"
          >
            REV SHARE
          </text>
        </g>

        {/* Star Rating Crest */}
        <g transform="translate(140, 224)">
          {Array.from({ length: 5 }).map((_, i) => {
            const offset = (i - 2) * 16;
            const isFilled = i < tierConfigs.stars;
            return (
              <polygon
                key={i}
                points={`${offset},0 ${offset + 3},6 ${offset + 9},6 ${offset + 4},10 ${offset + 6},16 ${offset},12 ${offset - 6},16 ${offset - 4},10 ${offset - 9},6 ${offset - 3},6`}
                fill={isFilled ? tierConfigs.starsColor : '#334155'}
                opacity={isFilled ? 1 : 0.4}
              />
            );
          })}
        </g>

        {/* Verification Icon Shield */}
        <g transform="translate(140, 246)">
          <path
            d="M-7 -4 L7 -4 L5 4 L0 7 L-5 4 Z"
            fill={tier === 'platinum' ? '#8CE600' : '#38BDF8'}
          />
          <path
            d="M-2.5 1 L-1 2.5 L3 -1.5"
            stroke="#0A2540"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* Partner Identification Code or Accreditation text */}
        {showId && (
          <g transform="translate(140, 305)">
            <rect
              x="-70"
              y="-12"
              width="140"
              height="20"
              rx="10"
              fill="#061F4A"
              stroke={`url(#${tierConfigs.metallicGradId})`}
              strokeWidth="1"
            />
            <text
              x="0"
              y="2"
              textAnchor="middle"
              fill="#E2E8F0"
              fontSize="9"
              fontWeight="700"
              letterSpacing="0.08em"
              fontFamily="'Space Mono', monospace"
            >
              {partnerCode}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

export const downloadBadgeSvg = (tier: PartnerTierId, partnerCode: string = 'MSME-PT-8421') => {
  const badgeElement = document.getElementById(`badge-svg-${tier}`);
  let svgContent = '';
  if (badgeElement) {
    svgContent = badgeElement.outerHTML;
  } else {
    // Generate clean standalone SVG content
    svgContent = `<?xml version="1.0" encoding="utf-8"?>
<svg width="400" height="460" viewBox="0 0 280 320" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- MsmeBooks Official ${tier.toUpperCase()} Partner Badge -->
  <!-- Verification ID: ${partnerCode} -->
  <!-- Issued by MsmeBooks Inc. (www.msmebooks.org) -->
  <defs>
    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="#FDE68A" />
      <stop offset="50%" stopColor="#D97706" />
      <stop offset="100%" stopColor="#78350F" />
    </linearGradient>
  </defs>
  <path d="M140 12 L245 48 C245 160 215 240 140 286 C65 240 35 160 35 48 L140 12 Z" fill="#0A3981" stroke="#F59E0B" stroke-width="4"/>
  <text x="140" y="80" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="bold" font-family="sans-serif">MsmeBooks</text>
  <text x="140" y="115" text-anchor="middle" fill="#FBBF24" font-size="14" font-weight="900" font-family="sans-serif">${tier.toUpperCase()} PARTNER</text>
  <text x="140" y="145" text-anchor="middle" fill="#8CE600" font-size="11" font-weight="bold" font-family="sans-serif">OFFICIAL ACCREDITATION</text>
  <text x="140" y="270" text-anchor="middle" fill="#CBD5E1" font-size="10" font-family="monospace">${partnerCode}</text>
</svg>`;
  }

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `MsmeBooks_${tier}_Partner_Badge_${partnerCode}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
};
