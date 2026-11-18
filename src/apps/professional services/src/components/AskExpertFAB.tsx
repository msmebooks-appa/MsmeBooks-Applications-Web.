import React, { useState } from 'react';
import { MessageSquare, Mic, Sparkles } from 'lucide-react';

interface AskExpertFABProps {
  onClick: () => void;
}

export const AskExpertFAB: React.FC<AskExpertFABProps> = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-2.5 bg-gradient-to-r from-[#1464C8] to-[#102B4E] hover:from-[#1052a5] hover:to-[#0c223e] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 border-2 border-white/20 cursor-pointer"
        aria-label="Ask an Expert"
        title="Ask a Technical Question to Verified Consultants"
      >
        {/* Glow & pulse */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B7E532] border-2 border-[#102B4E] animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#B7E532] border-2 border-[#102B4E]"></span>

        <div className="relative flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-[#B7E532]" />
          <Mic className="w-2.5 h-2.5 text-white absolute -bottom-0.5 -right-0.5" />
        </div>

        <span className="hidden sm:inline font-black text-xs tracking-tight pr-1">
          Ask an Expert
        </span>

        {/* Tooltip on mobile / expansion */}
        <span className="sm:hidden text-[11px] font-bold">
          Ask
        </span>
      </button>
    </div>
  );
};
