import React from 'react';
import { Layers, X, ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../data/servicesData';

interface CompareFloatingBarProps {
  selectedServices: ServiceItem[];
  onRemoveService: (serviceId: string) => void;
  onClearAll: () => void;
  onOpenCompareModal: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  selectedServices,
  onRemoveService,
  onClearAll,
  onOpenCompareModal,
}) => {
  if (selectedServices.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-[#102B4E]/95 backdrop-blur-md text-white p-3 sm:p-4 rounded-2xl shadow-2xl border border-white/20 animate-in fade-in slide-in-from-bottom duration-300">
      <div className="flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: Selected Service Chips */}
        <div className="flex items-center gap-2 overflow-x-auto min-w-0 flex-1">
          <div className="flex items-center gap-1.5 shrink-0 text-xs font-black text-[#B7E532]">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Compare:</span>
            <span>({selectedServices.length}/3)</span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {selectedServices.map((srv) => (
              <div
                key={srv.id}
                className="flex items-center gap-1.5 bg-white/10 text-white text-xs px-2.5 py-1 rounded-xl border border-white/15 shrink-0"
              >
                <div className="w-4 h-4 rounded-full bg-[#1464C8] text-[#B7E532] text-[8px] font-black flex items-center justify-center shrink-0 border border-white/20">
                  {srv.title.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()}
                </div>
                <span className="max-w-[110px] sm:max-w-[140px] truncate font-medium">
                  {srv.title}
                </span>
                <button
                  onClick={() => onRemoveService(srv.id)}
                  className="text-slate-400 hover:text-white ml-0.5"
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onClearAll}
            className="text-[11px] font-bold text-slate-300 hover:text-white px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            Clear
          </button>

          <button
            onClick={onOpenCompareModal}
            className="px-4 py-2 bg-[#B7E532] hover:bg-[#a6d628] text-[#102B4E] font-black text-xs rounded-xl shadow-md transition-all hover:scale-105 flex items-center gap-1.5 cursor-pointer"
          >
            <span>Compare Side-by-Side</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#102B4E]" />
          </button>
        </div>

      </div>
    </div>
  );
};
