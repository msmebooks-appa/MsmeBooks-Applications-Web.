import React, { useState } from 'react';
import { X, Check, Copy, Share2 } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const shareWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} - ${url}`)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-[#0B1E30] rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 dark:border-[#1A3852] overflow-hidden relative p-6 space-y-5 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#162D42]">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#0A3D62] dark:text-sky-300" />
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Share Success Story</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#122A3F] rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
          {title}
        </p>

        {/* Share Destination Buttons */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            onClick={shareLinkedIn}
            className="p-3 bg-[#0077b5]/10 dark:bg-[#0077b5]/20 text-[#0077b5] dark:text-[#38bdf8] hover:bg-[#0077b5]/20 font-bold rounded-xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-xs">LinkedIn</span>
          </button>
          <button
            onClick={shareTwitter}
            className="p-3 bg-slate-900/10 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-900/20 dark:hover:bg-slate-700 font-bold rounded-xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-xs">X / Twitter</span>
          </button>
          <button
            onClick={shareWhatsApp}
            className="p-3 bg-[#25D366]/10 dark:bg-[#25D366]/20 text-[#128C7E] dark:text-[#4ade80] hover:bg-[#25D366]/20 font-bold rounded-xl flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span className="font-semibold text-xs">WhatsApp</span>
          </button>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Direct Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-slate-50 dark:bg-[#081726] border border-slate-200 dark:border-[#17334D] rounded-lg px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-[#0A3D62] hover:bg-[#072B45] dark:bg-[#0E4B77] dark:hover:bg-[#0A3D62] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#90CF24]" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
