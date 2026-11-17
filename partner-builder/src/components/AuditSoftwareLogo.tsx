import React from 'react';

interface AuditSoftwareLogoProps {
  id: string;
  name: string;
  className?: string;
}

export const AuditSoftwareLogo: React.FC<AuditSoftwareLogoProps> = ({ id, name, className = 'w-9 h-9' }) => {
  switch (id) {
    case 'draftworx':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm font-black text-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h16M14 6l6 6-6 6" />
          </svg>
        </div>
      );

    case 'caseware':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center text-white shadow-sm font-black select-none`}>
          <div className="flex items-center -space-x-1">
            <div className="w-3.5 h-3.5 rounded-sm border-2 border-white transform rotate-12" />
            <div className="w-3.5 h-3.5 rounded-sm bg-[#8CE600] transform -rotate-6" />
          </div>
        </div>
      );

    case 'sap-audit':
      return (
        <div className={`${className} rounded-xl bg-[#0070F2] flex items-center justify-center text-white shadow-sm font-black text-xs select-none tracking-tighter`}>
          <span className="font-serif font-black tracking-normal">SAP</span>
        </div>
      );

    case 'auditboard':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-900 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 text-indigo-200">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
      );

    case 'tickmark':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      );

    case 'teammate':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-blue-600 to-blue-900 flex items-center justify-center text-white shadow-sm font-black text-sm select-none`}>
          <span className="text-[#8CE600] font-black text-base mr-0.5">T</span>
          <span className="text-white font-black text-xs">M+</span>
        </div>
      );

    case 'metricstream':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <circle cx="12" cy="12" r="3" />
            <path strokeLinecap="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
          </svg>
        </div>
      );

    case 'servicenow':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-[#8CE600]">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
      );

    case 'pinkr':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white shadow-sm font-black select-none text-xs`}>
          <span className="font-extrabold text-sm tracking-tight">Pk</span>
        </div>
      );

    case 'greatsoft':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center text-white shadow-sm font-black text-sm select-none`}>
          <span className="text-white font-extrabold">G</span>
          <span className="text-[#8CE600] font-black text-xs">S</span>
        </div>
      );

    case 'datagrow':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <line x1="18" y1="20" x2="18" y2="10" strokeLinecap="round" />
            <line x1="12" y1="20" x2="12" y2="4" strokeLinecap="round" />
            <line x1="6" y1="20" x2="6" y2="14" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'arbutus':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-red-600 to-rose-800 flex items-center justify-center text-white shadow-sm font-black text-sm select-none`}>
          <span className="text-white font-black text-base">A</span>
        </div>
      );

    case 'exclaim':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-sky-500 to-cyan-700 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5 text-white">
            <line x1="12" y1="5" x2="12" y2="15" strokeLinecap="round" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </div>
      );

    case 'surtech':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-indigo-500 to-blue-800 flex items-center justify-center text-white shadow-sm font-bold text-xs select-none`}>
          <span className="tracking-tighter font-black">SUR</span>
        </div>
      );

    case 'icabinet':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
        </div>
      );

    case 'trullion':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white shadow-sm select-none`}>
          <div className="w-4 h-4 bg-white transform rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-[#0A3981] transform -rotate-45" />
          </div>
        </div>
      );

    case 'inflo':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-teal-500 to-emerald-700 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      );

    case 'diligent':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-violet-600 to-purple-900 flex items-center justify-center text-white shadow-sm font-black text-sm select-none`}>
          <span className="text-[#8CE600] font-black text-base">D</span>
          <span className="text-white text-[10px] font-bold">1</span>
        </div>
      );

    case 'onspring':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
            <circle cx="12" cy="12" r="8" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8" />
          </svg>
        </div>
      );

    case 'asd-audit':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-teal-600 to-slate-800 flex items-center justify-center text-white shadow-sm font-black text-xs select-none tracking-tighter`}>
          ASD
        </div>
      );

    case 'mindbridge':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-blue-600 to-indigo-900 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="w-5 h-5 text-[#8CE600]">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </div>
      );

    case 'intelex':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center text-white shadow-sm font-bold text-xs select-none`}>
          <span className="text-white font-black text-sm">i</span>
          <span className="text-[#8CE600] font-black text-xs">x</span>
        </div>
      );

    case 'datasnipper':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-rose-600 to-red-800 flex items-center justify-center text-white shadow-sm select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-5 h-5">
            <circle cx="12" cy="12" r="8" />
            <line x1="12" y1="2" x2="12" y2="6" strokeLinecap="round" />
            <line x1="12" y1="18" x2="12" y2="22" strokeLinecap="round" />
            <line x1="2" y1="12" x2="6" y2="12" strokeLinecap="round" />
            <line x1="18" y1="12" x2="22" y2="12" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'mastercontrol':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-cyan-600 to-teal-800 flex items-center justify-center text-white shadow-sm font-black text-xs select-none tracking-tighter`}>
          MC
        </div>
      );

    case 'netwrix':
      return (
        <div className={`${className} rounded-xl bg-gradient-to-br from-indigo-700 to-slate-900 flex items-center justify-center text-white shadow-sm font-black text-xs select-none`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" className="w-5 h-5 text-indigo-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      );

    default:
      return (
        <div className={`${className} rounded-xl bg-slate-700 flex items-center justify-center text-white font-bold text-xs select-none`}>
          {name.slice(0, 2).toUpperCase()}
        </div>
      );
  }
};
