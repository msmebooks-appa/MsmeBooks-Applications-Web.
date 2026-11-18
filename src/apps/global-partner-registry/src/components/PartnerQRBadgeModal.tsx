import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Download,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Camera,
  Share2,
  Building,
  MapPin,
  Sparkles
} from 'lucide-react';
import { Partner } from '../types';
import { generatePartnerQRUrl } from '../utils/qrPartnerResolver';
import { TrustBadge } from './TrustBadge';

interface PartnerQRBadgeModalProps {
  partner: Partner | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenScanner?: () => void;
}

export const PartnerQRBadgeModal: React.FC<PartnerQRBadgeModalProps> = ({
  partner,
  isOpen,
  onClose,
  onOpenScanner,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const badgeCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!partner || !isOpen) {
      setQrDataUrl('');
      return;
    }

    const qrUrl = generatePartnerQRUrl(partner);
    QRCode.toDataURL(qrUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a', // Slate-900
        light: '#ffffff',
      },
    })
      .then((url: string) => {
        setQrDataUrl(url);
      })
      .catch((err: unknown) => {
        console.error('Failed to generate QR code data URL', err);
      });
  }, [partner, isOpen]);

  const handleCopyLink = () => {
    if (!partner) return;
    const url = generatePartnerQRUrl(partner);
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl || !partner) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `MsmeBooks-Badge-${partner.slug || partner.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isOpen || !partner) return null;

  const qrUrl = generatePartnerQRUrl(partner);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-qr-badge-title"
    >
      <div className="relative w-full max-w-md bg-white dark:bg-[#0c1e38] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0a1b32]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-600 dark:text-lime-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 id="partner-qr-badge-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                Official Digital Badge & QR Card
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                MsmeBooks Verified Partner Identity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Badge Card Container */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Printable Business Card / Conference Badge Layout */}
          <div
            ref={badgeCardRef}
            className="relative bg-gradient-to-br from-slate-900 via-[#0a192f] to-[#071324] border-2 border-lime-400/40 rounded-2xl p-5 text-white shadow-xl overflow-hidden"
          >
            {/* Top Security Hologram / Watermark Pattern */}
            <div className="absolute top-0 right-0 w-36 h-36 bg-lime-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Badge Brand Top Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white text-xs border border-blue-400/40">
                  M
                </div>
                <div>
                  <span className="font-extrabold text-xs tracking-tight text-white">
                    Msme<span className="text-lime-400">Books</span>
                  </span>
                  <span className="ml-1 text-[9px] uppercase tracking-wider text-slate-400">
                    Registry
                  </span>
                </div>
              </div>

              <TrustBadge
                level={partner.level}
                partnerId={partner.id}
                variant="pill"
              />
            </div>

            {/* Partner Info & QR Code Row */}
            <div className="py-4 flex flex-col sm:flex-row items-center gap-4 relative z-10">
              
              {/* High-Resolution QR Code */}
              <div className="p-2.5 bg-white rounded-2xl shadow-lg border border-slate-200 shrink-0">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${partner.name}`}
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                    Generating QR...
                  </div>
                )}
              </div>

              {/* Partner Details */}
              <div className="flex-1 text-center sm:text-left min-w-0">
                <h4 className="text-base font-bold text-white leading-tight">
                  {partner.name}
                </h4>
                
                <p className="text-xs text-lime-400 font-medium mt-0.5">
                  Certified {partner.level} Implementation Partner
                </p>

                <p className="text-xs text-slate-300 mt-2 flex items-center justify-center sm:justify-start gap-1">
                  <span>{partner.countryFlag}</span>
                  <span>{partner.city}, {partner.country}</span>
                </p>

                <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-center sm:justify-start gap-1.5">
                  <span className="text-slate-500">ID:</span>
                  <span className="text-lime-300 font-bold">{partner.id}</span>
                </div>
              </div>
            </div>

            {/* Badge Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 relative z-10">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Verified Active Credential</span>
              </span>
              <span>msmebooks.org</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleDownloadQr}
              className="py-2.5 px-3 rounded-xl bg-lime-500 hover:bg-lime-400 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download QR</span>
            </button>
          </div>

          {/* Switch to Camera Scanner Option */}
          {onOpenScanner && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Camera className="w-4 h-4 text-blue-500" />
                <span>Need to scan another partner badge or card? Open Camera</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
