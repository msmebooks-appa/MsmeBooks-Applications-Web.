import React, { useState, useEffect, useRef } from 'react';
import {
  QrCode,
  Download,
  Copy,
  Check,
  X,
  Sparkles,
  ExternalLink,
  Printer,
  Share2,
  Smartphone,
  ShieldCheck,
  Store,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import QRCode from 'qrcode';

interface ReferralQRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  partnerCode?: string;
  partnerName?: string;
  partnerTier?: string;
}

export const ReferralQRCodeModal: React.FC<ReferralQRCodeModalProps> = ({
  isOpen,
  onClose,
  partnerCode = 'MSME-ACE-781',
  partnerName = 'Ace Advisory',
  partnerTier = 'Gold Partner (30%)'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [destination, setDestination] = useState<'signup' | 'pos-demo' | 'landing'>('signup');
  const [colorTheme, setColorTheme] = useState<'brand' | 'classic' | 'emerald'>('brand');
  const [campaignTag, setCampaignTag] = useState<string>('Client Desk Stand');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Compute final referral URL based on destination and campaign tag
  const getDestinationUrl = () => {
    const baseDomain = 'https://www.msmebooks.org';
    const tagParam = campaignTag.trim() ? `&campaign=${encodeURIComponent(campaignTag.trim().toLowerCase().replace(/\s+/g, '-'))}` : '';
    
    switch (destination) {
      case 'signup':
        return `${baseDomain}/register?ref=${partnerCode}${tagParam}&utm_source=partner_qr`;
      case 'pos-demo':
        return `${baseDomain}/demo/pos?ref=${partnerCode}${tagParam}&utm_source=partner_qr`;
      case 'landing':
        return `${baseDomain}/partner/ace-consulting?ref=${partnerCode}${tagParam}&utm_source=partner_qr`;
    }
  };

  const finalUrl = getDestinationUrl();

  // Colors config
  const getColors = () => {
    switch (colorTheme) {
      case 'brand':
        return { dark: '#142D4E', light: '#FFFFFF' };
      case 'emerald':
        return { dark: '#0F5132', light: '#FFFFFF' };
      case 'classic':
      default:
        return { dark: '#000000', light: '#FFFFFF' };
    }
  };

  // Generate QR Code on canvas
  useEffect(() => {
    if (!isOpen) return;

    setIsGenerating(true);
    const colors = getColors();

    const generate = async () => {
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, finalUrl, {
            width: 240,
            margin: 2,
            errorCorrectionLevel: 'H',
            color: colors
          });
        }

        const dataUrl = await QRCode.toDataURL(finalUrl, {
          width: 512,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: colors
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code', err);
      } finally {
        setIsGenerating(false);
      }
    };

    generate();
  }, [isOpen, finalUrl, colorTheme]);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // Download raw QR code PNG
  const handleDownloadQrPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = `MsmeBooks-QR-${partnerCode}-${destination}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  // Generate and download a branded print-ready counter tent / desk flyer
  const handleDownloadBrandedFlyer = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGradient.addColorStop(0, '#142D4E');
    bgGradient.addColorStop(0.5, '#0E213B');
    bgGradient.addColorStop(1, '#0B1528');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 800, 1000);

    // Decorative Lemon Accent Top Bar
    ctx.fillStyle = '#B9E51C';
    ctx.fillRect(0, 0, 800, 14);

    // Logo & Header
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('MsmeBooks Accounting & POS', 400, 90);

    ctx.fillStyle = '#B9E51C';
    ctx.font = '600 18px sans-serif';
    ctx.fillText('OFFICIAL CERTIFIED PARTNER DESK', 400, 125);

    // Headline
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText('Scan to Setup Your Business Books', 400, 200);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '20px sans-serif';
    ctx.fillText('Free 30-Day Automated Cloud Invoicing & Inventory Trial', 400, 235);

    // QR White Box Card
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(175, 280, 450, 470, 24);
    ctx.fill();

    // Draw QR code image in the center
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 235, 310, 330, 330);

      // Card Caption inside white box
      ctx.fillStyle = '#142D4E';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('Point Smartphone Camera to Scan', 400, 680);

      ctx.fillStyle = '#64748B';
      ctx.font = '16px monospace';
      ctx.fillText(`Attribution ID: ${partnerCode}`, 400, 715);

      // Partner Credential Badge at bottom
      ctx.fillStyle = '#1E3A5F';
      ctx.beginPath();
      ctx.roundRect(100, 790, 600, 130, 16);
      ctx.fill();

      ctx.strokeStyle = 'rgba(185, 229, 28, 0.4)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText(`Advised by ${partnerName}`, 400, 835);

      ctx.fillStyle = '#B9E51C';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${partnerTier} · Dedicated Client Onboarding Rail`, 400, 870);

      ctx.fillStyle = '#64748B';
      ctx.font = '13px sans-serif';
      ctx.fillText('Compliant with Nigerian Tax Regulations, VAT Schedules & Multi-Branch POS', 400, 960);

      // Download the composite flyer
      const flyerUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `MsmeBooks-Desk-Display-${partnerCode}.png`;
      link.href = flyerUrl;
      link.click();
    };
    img.src = qrDataUrl;
  };

  const handleCopyQrImage = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2000);
    } catch (err) {
      console.warn('Clipboard write image not supported in this browser context, copying URL instead', err);
      handleCopyUrl();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#101e35] rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-700 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#142D4E] text-white p-6 rounded-t-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close QR modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-9 h-9 rounded-xl bg-[#1261B5] text-[#B9E51C] flex items-center justify-center shadow-inner">
              <QrCode className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-[#B9E51C] text-[#142D4E]">
                Partner Sales Tool
              </span>
              <h3 className="text-xl font-extrabold text-white">
                Generate Referral QR Code
              </h3>
            </div>
          </div>
          <p className="text-xs text-slate-200 max-w-lg leading-relaxed">
            Create an instant smartphone-scannable QR code encoded with your unique partner identifier ({partnerCode}). Print it for your consulting office desk, client meetings, or digital brochures to onboard SMEs in seconds.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: QR Code Display Card */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 dark:bg-[#0c182c] border border-slate-200 dark:border-slate-700/80 shadow-xs">
              <div className="p-4 bg-white rounded-2xl shadow-md border border-slate-200/80 relative group">
                <canvas ref={canvasRef} className="rounded-lg w-48 h-48 mx-auto" />

                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                    <span className="text-xs font-bold text-[#142D4E] animate-pulse">Generating QR...</span>
                  </div>
                )}
              </div>

              {/* Tag below QR */}
              <div className="mt-3.5 space-y-1">
                <span className="font-mono text-xs font-bold text-[#142D4E] dark:text-[#B9E51C] bg-[#142D4E]/5 dark:bg-white/5 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 block">
                  Partner ID: {partnerCode}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block">
                  Permanent lifetime 30% commission binding
                </span>
              </div>

              {/* Instant Actions under QR */}
              <div className="flex items-center gap-2 mt-4 w-full">
                <button
                  type="button"
                  onClick={handleDownloadQrPng}
                  className="flex-1 py-2 px-3 bg-[#1261B5] hover:bg-[#0e4e94] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Download standard PNG QR code"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQrImage}
                  className="py-2 px-3 bg-white dark:bg-[#14233c] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                  title="Copy QR image to clipboard"
                >
                  {copiedImage ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedImage ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Customization Controls */}
            <div className="space-y-4 text-xs">
              {/* Destination Selector */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  1. SME Landing Destination
                </label>
                <div className="space-y-2">
                  <label
                    onClick={() => setDestination('signup')}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      destination === 'signup'
                        ? 'border-[#1261B5] dark:border-[#B9E51C] bg-blue-50/50 dark:bg-[#14233c] ring-1 ring-[#1261B5]/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#101e35]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="qr-destination"
                      checked={destination === 'signup'}
                      onChange={() => setDestination('signup')}
                      className="mt-0.5 text-[#1261B5]"
                    />
                    <div>
                      <strong className="text-slate-800 dark:text-white block">Direct Registration & Trial</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Opens the quick SME onboarding form with code pre-filled.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setDestination('pos-demo')}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      destination === 'pos-demo'
                        ? 'border-[#1261B5] dark:border-[#B9E51C] bg-blue-50/50 dark:bg-[#14233c] ring-1 ring-[#1261B5]/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#101e35]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="qr-destination"
                      checked={destination === 'pos-demo'}
                      onChange={() => setDestination('pos-demo')}
                      className="mt-0.5 text-[#1261B5]"
                    />
                    <div>
                      <strong className="text-slate-800 dark:text-white block">POS & Retail Hardware Demo</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Best for retail store owners, supermarkets, and pharmacies.
                      </span>
                    </div>
                  </label>

                  <label
                    onClick={() => setDestination('landing')}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      destination === 'landing'
                        ? 'border-[#1261B5] dark:border-[#B9E51C] bg-blue-50/50 dark:bg-[#14233c] ring-1 ring-[#1261B5]/30'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#101e35]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="qr-destination"
                      checked={destination === 'landing'}
                      onChange={() => setDestination('landing')}
                      className="mt-0.5 text-[#1261B5]"
                    />
                    <div>
                      <strong className="text-slate-800 dark:text-white block">Partner Co-Branded Landing Page</strong>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Showcases Ace Advisory credentials and specialized SME accounting services.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Color Style */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                  2. QR Color Palette
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setColorTheme('brand')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      colorTheme === 'brand'
                        ? 'border-[#142D4E] dark:border-[#B9E51C] bg-slate-100 dark:bg-[#14233c] font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#142D4E] inline-block mr-1.5" />
                    <span>Navy Blue</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('emerald')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      colorTheme === 'emerald'
                        ? 'border-emerald-600 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-emerald-700 inline-block mr-1.5" />
                    <span>Forest</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setColorTheme('classic')}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      colorTheme === 'classic'
                        ? 'border-black dark:border-white bg-slate-100 dark:bg-[#14233c] font-bold'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-black inline-block mr-1.5" />
                    <span>Monochrome</span>
                  </button>
                </div>
              </div>

              {/* Campaign Tag Label */}
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  3. Attribution Campaign Tag (Optional)
                </label>
                <input
                  type="text"
                  value={campaignTag}
                  onChange={(e) => setCampaignTag(e.target.value)}
                  placeholder="e.g. Lagos Office Stand, Expo Flyer, Print Card"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-[#0c182c] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1261B5]"
                />
              </div>

              {/* Encoded URL Box */}
              <div className="pt-1">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-medium text-slate-500 dark:text-slate-400">Encoded Scan Link:</span>
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="text-[#1261B5] dark:text-[#B9E51C] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {copiedUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy Link'}</span>
                  </button>
                </div>
                <p className="font-mono text-[11px] bg-slate-100 dark:bg-[#0c182c] p-2 rounded-lg text-slate-600 dark:text-slate-400 truncate select-all border border-slate-200/60 dark:border-slate-700/60">
                  {finalUrl}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Branded Desk Display Download Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-emerald-50/50 dark:from-[#0e213b] dark:to-[#0f2824] p-4 sm:p-5 rounded-2xl border border-blue-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#142D4E] text-[#B9E51C] flex items-center justify-center shrink-0 shadow-sm">
                <Printer className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-[#142D4E] dark:text-white block font-bold">
                  Print-Ready Desk Display & Table Tent Flyer
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  Generates an 800x1000 branded flyer with your partner credentials, client instructions, and official MsmeBooks seal.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadBrandedFlyer}
              className="px-4 py-2 bg-[#142D4E] dark:bg-[#1261B5] hover:bg-[#0e213b] dark:hover:bg-[#0e4e94] text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#B9E51C]" />
              <span>Download Printable Stand</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-[#0c182c] border-t border-slate-200 dark:border-slate-700/80 rounded-b-2xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-[#B9E51C]" />
            <span>Encrypted QR attribution tracking verified</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
