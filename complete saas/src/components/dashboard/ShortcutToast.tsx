import React from 'react';
import { Zap } from 'lucide-react';

interface ShortcutToastProps {
  shortcutText: string;
  actionText: string;
  visible: boolean;
}

export const ShortcutToast: React.FC<ShortcutToastProps> = ({
  shortcutText,
  actionText,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-50 pointer-events-none flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#072644]/95 text-white border border-[#84CC16]/60 shadow-xl backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200"
      role="status"
      aria-live="polite"
    >
      <div className="w-5 h-5 rounded-full bg-[#84CC16]/20 flex items-center justify-center text-[#9AE61C]">
        <Zap className="w-3 h-3" />
      </div>
      <div className="flex items-center gap-1.5 text-xs">
        <kbd className="px-1.5 py-0.5 rounded bg-black/40 border border-white/20 font-mono font-bold text-[10px] text-[#9AE61C]">
          {shortcutText}
        </kbd>
        <span className="text-slate-300 font-medium">→</span>
        <span className="font-semibold text-white">{actionText}</span>
      </div>
    </div>
  );
};
