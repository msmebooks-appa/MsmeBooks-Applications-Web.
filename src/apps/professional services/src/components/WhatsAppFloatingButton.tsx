import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { OFFICIAL_WHATSAPP_NUMBER } from '../utils/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-end gap-2">
      {/* Tooltip speech bubble */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#102B4E] text-white py-2 px-3.5 rounded-2xl shadow-xl border border-slate-700 text-xs animate-in fade-in slide-in-from-right duration-300">
          <div>
            <div className="font-extrabold text-[#B7E532]">Need assistance?</div>
            <div className="text-[11px] text-slate-300">Chat with MsmeBooks Concierge</div>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white p-0.5 ml-1"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={`https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello MsmeBooks, I am inquiring about professional services.")}`}
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-[#B7E532] hover:bg-[#a5d527] text-[#102B4E] shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 lemon-glow group relative"
        title="Direct WhatsApp Consultation: +234 915 848 2622"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white"></span>
        <MessageCircle className="w-7 h-7 text-[#102B4E] group-hover:rotate-12 transition-transform" />
      </a>
    </div>
  );
};
