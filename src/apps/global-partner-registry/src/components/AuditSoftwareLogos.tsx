import React from 'react';

interface AuditLogoProps {
  id: string;
  className?: string;
  size?: number;
}

export const AuditSoftwareLogo: React.FC<AuditLogoProps> = ({ id, className = '', size = 38 }) => {
  switch (id) {
    case 'draftworx':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Draftworx Logo">
          <rect width="40" height="40" rx="10" fill="#0284c7" />
          <path d="M11 11H22C26.4183 11 30 14.5817 30 19C30 23.4183 26.4183 27 22 27H11V11Z" fill="#ffffff" />
          <path d="M16 16H21.5C23.1569 16 24.5 17.3431 24.5 19C24.5 20.6569 23.1569 22 21.5 22H16V16Z" fill="#0284c7" />
          <path d="M25 24L31 30" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 'caseware':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Caseware Logo">
          <rect width="40" height="40" rx="10" fill="#1d4ed8" />
          <path d="M10 20L20 13L30 20L20 27L10 20Z" fill="#60a5fa" />
          <path d="M10 20L20 27V34L10 27V20Z" fill="#2563eb" />
          <path d="M30 20L20 27V34L30 27V20Z" fill="#93c5fd" />
          <circle cx="20" cy="13" r="3" fill="#ffffff" />
        </svg>
      );

    case 'sap-audit-mgt':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="SAP Audit Management Logo">
          <rect width="40" height="40" rx="10" fill="#0369a1" />
          <path d="M8 14H32V26H8V14Z" fill="#0284c7" />
          <text x="20" y="24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="900" fontFamily="sans-serif">
            SAP
          </text>
          <circle cx="30" cy="12" r="3" fill="#facc15" />
        </svg>
      );

    case 'auditboard':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="AuditBoard Logo">
          <rect width="40" height="40" rx="10" fill="#6d28d9" />
          <path d="M20 9L31 15V26L20 32L9 26V15L20 9Z" stroke="#c084fc" strokeWidth="2" fill="#581c87" />
          <path d="M14 20L18 24L26 16" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'tickmark':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Tickmark Logo">
          <rect width="40" height="40" rx="10" fill="#059669" />
          <circle cx="20" cy="20" r="13" stroke="#a7f3d0" strokeWidth="2" strokeDasharray="3 2" />
          <path d="M13 20.5L18 25.5L28 14.5" stroke="#ffffff" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'teammate':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="TeamMate Logo">
          <rect width="40" height="40" rx="10" fill="#0c4a6e" />
          <path d="M10 20C10 14.4772 14.4772 10 20 10C25.5228 10 30 14.4772 30 20" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
          <path d="M14 24C14 20.6863 16.6863 18 20 18C23.3137 18 26 20.6863 26 24" stroke="#a5f3fc" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="20" cy="28" r="3" fill="#ffffff" />
        </svg>
      );

    case 'metric-stream':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="MetricStream Logo">
          <rect width="40" height="40" rx="10" fill="#c2410c" />
          <path d="M20 8L31 14.5V26.5L20 33L9 26.5V14.5L20 8Z" fill="#ea580c" />
          <path d="M15 22L19 16L22 20L26 13" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="26" cy="13" r="2" fill="#fef08a" />
        </svg>
      );

    case 'servicenow':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="ServiceNow Logo">
          <rect width="40" height="40" rx="10" fill="#15803d" />
          <circle cx="20" cy="20" r="12" stroke="#86efac" strokeWidth="2.8" strokeDasharray="18 6" />
          <path d="M15 21C16 17 24 17 25 21C25 24 16 23 16 26" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="20" cy="13" r="2" fill="#facc15" />
        </svg>
      );

    case 'pinkr':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Pinkr Auditrack Logo">
          <rect width="40" height="40" rx="10" fill="#be185d" />
          <path d="M12 28V12H21C24.3137 12 27 14.6863 27 18C27 21.3137 24.3137 24 21 24H12" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="27" cy="27" r="4" fill="#f472b6" />
          <path d="M25 27H29M27 25V29" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 'greatsoft':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="GreatSoft Logo">
          <rect width="40" height="40" rx="10" fill="#b45309" />
          <path d="M26 15C24.5 13 22 12 19 12C14.5 12 11 15.5 11 20C11 24.5 14.5 28 19 28C23.5 28 26.5 25 27 21H19" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="27" cy="14" r="2.5" fill="#fde68a" />
        </svg>
      );

    case 'datagrow':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="DataGrow Logo">
          <rect width="40" height="40" rx="10" fill="#4d7c0f" />
          <path d="M20 28V15M20 15C20 15 15 13 14 19C13 25 20 28 20 28ZM20 15C20 15 25 13 26 19C27 25 20 28 20 28Z" fill="#a3e635" />
          <line x1="12" y1="31" x2="28" y2="31" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case 'arbutus':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Arbutus Logo">
          <rect width="40" height="40" rx="10" fill="#047857" />
          <path d="M20 9L29 27H11L20 9Z" stroke="#6ee7b7" strokeWidth="2.2" fill="#065f46" />
          <path d="M15 23H25" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="18" r="2.5" fill="#ffffff" />
        </svg>
      );

    case 'exclaim-innovation':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Exclaim Innovation Logo">
          <rect width="40" height="40" rx="10" fill="#4338ca" />
          <path d="M20 9L23 18H29L24 22L26 30L20 25L14 30L16 22L11 18H17L20 9Z" fill="#a5b4fc" />
          <circle cx="20" cy="20" r="3" fill="#ffffff" />
        </svg>
      );

    case 'surtech':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Surtech Logo">
          <rect width="40" height="40" rx="10" fill="#0369a1" />
          <path d="M13 16C15 12 25 12 27 16C28 19 22 21 20 22C17 23 12 25 13 28C14 31 23 32 27 28" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="20" cy="20" r="2" fill="#facc15" />
        </svg>
      );

    case 'icabinet':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="iCabinet Logo">
          <rect width="40" height="40" rx="10" fill="#0f766e" />
          <rect x="10" y="14" width="20" height="16" rx="3" fill="#14b8a6" />
          <path d="M10 17H30" stroke="#042f2e" strokeWidth="1.5" />
          <path d="M17 14V11C17 9.89543 17.8954 9 19 9H21C22.1046 9 23 9.89543 23 11V14" stroke="#5eead4" strokeWidth="2" />
          <circle cx="20" cy="22" r="2" fill="#ffffff" />
        </svg>
      );

    case 'trullion':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Trullion Logo">
          <rect width="40" height="40" rx="10" fill="#0891b2" />
          <circle cx="20" cy="20" r="10" stroke="#a5f3fc" strokeWidth="2" />
          <path d="M14 15L26 25M26 15L14 25" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="20" cy="20" r="3" fill="#38bdf8" />
        </svg>
      );

    case 'inflo':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Inflo Logo">
          <rect width="40" height="40" rx="10" fill="#1d4ed8" />
          <path d="M12 26V14M17 26V18M23 26V12M28 26V20" stroke="#93c5fd" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="23" cy="12" r="2" fill="#ffffff" />
        </svg>
      );

    case 'diligent-one':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Diligent One Logo">
          <rect width="40" height="40" rx="10" fill="#a16207" />
          <path d="M20 9L29 13V21C29 26 25 29 20 31C15 29 11 26 11 21V13L20 9Z" fill="#ca8a04" stroke="#fef08a" strokeWidth="1.5" />
          <text x="20" y="24" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
            1
          </text>
        </svg>
      );

    case 'onspring':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Onspring Logo">
          <rect width="40" height="40" rx="10" fill="#0f766e" />
          <path d="M11 25C11 18 16 12 23 12C26 12 28 14 28 17C28 20 25 22 21 22C16 22 14 26 18 28C22 30 27 28 28 25" stroke="#2dd4bf" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="28" cy="15" r="2" fill="#ffffff" />
        </svg>
      );

    case 'asd-audit':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="ASD Audit Logo">
          <rect width="40" height="40" rx="10" fill="#c2410c" />
          <path d="M12 28L20 11L28 28H12Z" stroke="#fdba74" strokeWidth="2" fill="#9a3412" />
          <text x="20" y="24" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="900" fontFamily="sans-serif">
            ASD
          </text>
        </svg>
      );

    case 'mindbridge-ai':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Mindbridge AI Logo">
          <rect width="40" height="40" rx="10" fill="#6d28d9" />
          <circle cx="15" cy="15" r="3" fill="#c084fc" />
          <circle cx="25" cy="15" r="3" fill="#c084fc" />
          <circle cx="20" cy="25" r="3.5" fill="#ffffff" />
          <line x1="15" y1="15" x2="25" y2="15" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="15" y1="15" x2="20" y2="25" stroke="#a855f7" strokeWidth="1.5" />
          <line x1="25" y1="15" x2="20" y2="25" stroke="#a855f7" strokeWidth="1.5" />
        </svg>
      );

    case 'intelex':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Intelex Logo">
          <rect width="40" height="40" rx="10" fill="#047857" />
          <path d="M12 12H28M20 12V28M15 28H25" stroke="#34d399" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="26" cy="18" r="2.5" fill="#facc15" />
        </svg>
      );

    case 'datasnipper':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="DataSnipper Logo">
          <rect width="40" height="40" rx="10" fill="#4338ca" />
          <circle cx="20" cy="20" r="10" stroke="#818cf8" strokeWidth="1.8" />
          <line x1="20" y1="7" x2="20" y2="13" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
          <line x1="20" y1="27" x2="20" y2="33" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
          <line x1="7" y1="20" x2="13" y2="20" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
          <line x1="27" y1="20" x2="33" y2="20" stroke="#c7d2fe" strokeWidth="2" strokeLinecap="round" />
          <circle cx="20" cy="20" r="2.5" fill="#38bdf8" />
        </svg>
      );

    case 'master-control-audit':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="MasterControl Audit Logo">
          <rect width="40" height="40" rx="10" fill="#991b1b" />
          <path d="M12 28V12L20 20L28 12V28" stroke="#fca5a5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="25" r="2.5" fill="#ffffff" />
        </svg>
      );

    case 'netwrix-audit':
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className} aria-label="Netwrix Audit Logo">
          <rect width="40" height="40" rx="10" fill="#075985" />
          <path d="M12 28V12L28 28V12" stroke="#38bdf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="20" cy="20" r="2" fill="#facc15" />
        </svg>
      );

    default:
      return (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" className={className}>
          <rect width="40" height="40" rx="10" fill="#334155" />
          <circle cx="20" cy="20" r="8" stroke="#94a3b8" strokeWidth="2" />
        </svg>
      );
  }
};
