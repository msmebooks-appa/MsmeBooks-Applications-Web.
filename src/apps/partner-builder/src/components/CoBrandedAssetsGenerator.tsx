import React, { useState, useRef } from 'react';
import { 
  Download, 
  Sparkles, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  RefreshCw, 
  Award, 
  Share2, 
  Eye, 
  Palette, 
  Sliders, 
  Copy,
  Layout,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { PartnerTierId } from '../types';
import { PARTNER_TIERS } from '../data/partnersData';
import { useLanguage } from '../context/LanguageContext';

type TemplateFormat = 'linkedin_banner' | 'square_social' | 'proposal_header' | 'window_plaque';
type ColorTheme = 'deep_blue' | 'dark_gold' | 'clean_white' | 'pan_african';

export const CoBrandedAssetsGenerator: React.FC = () => {
  const { t } = useLanguage();
  
  // Customization State
  const [companyName, setCompanyName] = useState('Adeyemi Financial & Tax Advisory');
  const [partnerTier, setPartnerTier] = useState<PartnerTierId>('gold');
  const [partnerCode, setPartnerCode] = useState('MSME-PT-8421');
  const [tagline, setTagline] = useState('Certified Cloud Accounting & Multi-Store POS Implementation Partner');
  const [format, setFormat] = useState<TemplateFormat>('linkedin_banner');
  const [theme, setTheme] = useState<ColorTheme>('deep_blue');
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const [selectedPresetLogo, setSelectedPresetLogo] = useState<number>(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Preset Logos (SVG Data URIs or clean Monograms)
  const presetLogos = [
    { id: 0, name: 'Crest Shield', label: '🛡️ Chartered Shield', icon: '🛡️', text: 'AF' },
    { id: 1, name: 'Modern Tech', label: '⚡ Apex Systems', icon: '⚡', text: 'AP' },
    { id: 2, name: 'Growth Ledger', label: '📊 Ledger Advisory', icon: '📊', text: 'LA' },
    { id: 3, name: 'Corporate Diamond', label: '💎 Meridian Global', icon: '💎', text: 'MG' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCustomLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTierInfo = PARTNER_TIERS[partnerTier];

  // Aspect ratio and container dimensions based on format
  const getFormatDimensions = () => {
    switch (format) {
      case 'linkedin_banner':
        return { width: 1200, height: 630, aspect: 'aspect-[1200/630]', label: 'LinkedIn & Social Landscape (1200 × 630)' };
      case 'square_social':
        return { width: 1080, height: 1080, aspect: 'aspect-square', label: 'Instagram & WhatsApp Square (1080 × 1080)' };
      case 'proposal_header':
        return { width: 1200, height: 420, aspect: 'aspect-[1200/420]', label: 'Proposal & Document Header (1200 × 420)' };
      case 'window_plaque':
        return { width: 900, height: 900, aspect: 'aspect-square', label: 'Storefront & Wall Plaque Decal (900 × 900)' };
    }
  };

  const getThemeStyles = () => {
    switch (theme) {
      case 'deep_blue':
        return {
          bg: 'bg-gradient-to-br from-[#061F4A] via-[#0A3981] to-[#041535]',
          textColor: 'text-white',
          subColor: 'text-blue-100',
          accentColor: '#8CE600',
          border: 'border-blue-500/40',
          badgeBg: 'bg-blue-900/60'
        };
      case 'dark_gold':
        return {
          bg: 'bg-gradient-to-br from-[#1A1305] via-[#2A1D0A] to-[#0D0902]',
          textColor: 'text-amber-100',
          subColor: 'text-amber-200/80',
          accentColor: '#F59E0B',
          border: 'border-amber-500/40',
          badgeBg: 'bg-amber-950/60'
        };
      case 'clean_white':
        return {
          bg: 'bg-gradient-to-br from-white via-slate-50 to-blue-50/40',
          textColor: 'text-slate-900',
          subColor: 'text-slate-600',
          accentColor: '#0A3981',
          border: 'border-slate-300',
          badgeBg: 'bg-blue-50'
        };
      case 'pan_african':
        return {
          bg: 'bg-gradient-to-br from-[#032314] via-[#053B22] to-[#02180E]',
          textColor: 'text-emerald-100',
          subColor: 'text-emerald-200/80',
          accentColor: '#8CE600',
          border: 'border-emerald-500/40',
          badgeBg: 'bg-emerald-950/60'
        };
    }
  };

  const themeStyle = getThemeStyles();
  const dim = getFormatDimensions();

  // Instant SVG Canvas Image Download
  const handleDownloadAsset = () => {
    setIsDownloading(true);

    try {
      // Build high-res SVG artwork based on current inputs
      const svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${dim.width}" height="${dim.height}" viewBox="0 0 ${dim.width} ${dim.height}">
          <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${theme === 'clean_white' ? '#FFFFFF' : theme === 'dark_gold' ? '#1A1305' : theme === 'pan_african' ? '#032314' : '#061F4A'}"/>
              <stop offset="50%" stop-color="${theme === 'clean_white' ? '#F8FAFC' : theme === 'dark_gold' ? '#2A1D0A' : theme === 'pan_african' ? '#053B22' : '#0A3981'}"/>
              <stop offset="100%" stop-color="${theme === 'clean_white' ? '#EFF6FF' : theme === 'dark_gold' ? '#0D0902' : theme === 'pan_african' ? '#02180E' : '#041535'}"/>
            </linearGradient>
            <linearGradient id="goldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#D97706"/>
              <stop offset="50%" stop-color="#FBBF24"/>
              <stop offset="100%" stop-color="#78350F"/>
            </linearGradient>
          </defs>

          <!-- Background Rect -->
          <rect width="100%" height="100%" fill="url(#bgGrad)"/>

          <!-- Decorative Grid Dots -->
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="${theme === 'clean_white' ? '#0A3981' : '#FFFFFF'}" opacity="0.08"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)"/>

          <!-- Glowing Borders -->
          <rect x="24" y="24" width="${dim.width - 48}" height="${dim.height - 48}" rx="24" fill="none" stroke="${themeStyle.accentColor}" stroke-width="3" opacity="0.4"/>

          <!-- Top Badge: Official Partnership -->
          <rect x="${dim.width / 2 - 220}" y="50" width="440" height="42" rx="21" fill="${theme === 'clean_white' ? '#0A3981' : '#8CE600'}" opacity="0.15"/>
          <text x="${dim.width / 2}" y="77" fill="${theme === 'clean_white' ? '#0A3981' : '#8CE600'}" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" letter-spacing="2">
            OFFICIAL ACCREDITED PARTNER · MSMEBOOKS
          </text>

          <!-- Partner Name Headline -->
          <text x="${dim.width / 2}" y="${dim.height * 0.36}" fill="${theme === 'clean_white' ? '#0A3981' : '#FFFFFF'}" font-family="system-ui, sans-serif" font-size="${format === 'proposal_header' ? '38' : '48'}" font-weight="900" text-anchor="middle">
            ${companyName.replace(/&/g, '&amp;')}
          </text>

          <!-- Tagline -->
          <text x="${dim.width / 2}" y="${dim.height * 0.45}" fill="${theme === 'clean_white' ? '#475569' : '#93C5FD'}" font-family="system-ui, sans-serif" font-size="20" font-weight="500" text-anchor="middle">
            ${tagline.replace(/&/g, '&amp;')}
          </text>

          <!-- Center Metallic Badge Representation -->
          <circle cx="${dim.width / 2}" cy="${dim.height * 0.65}" r="64" fill="url(#goldMetallic)" stroke="#FFFFFF" stroke-width="4"/>
          <text x="${dim.width / 2}" y="${dim.height * 0.64}" fill="#0A3981" font-family="system-ui, sans-serif" font-size="22" font-weight="900" text-anchor="middle">
            ${currentTierInfo.name.toUpperCase()}
          </text>
          <text x="${dim.width / 2}" y="${dim.height * 0.68}" fill="#0A3981" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle">
            30% COMMISSION TIER
          </text>

          <!-- Bottom Footer Details -->
          <text x="${dim.width * 0.1}" y="${dim.height - 60}" fill="${theme === 'clean_white' ? '#64748B' : '#94A3B8'}" font-family="monospace" font-size="16" font-weight="bold">
            PARTNER ID: ${partnerCode}
          </text>
          <text x="${dim.width * 0.9}" y="${dim.height - 60}" fill="${theme === 'clean_white' ? '#0A3981' : '#8CE600'}" font-family="system-ui, sans-serif" font-size="16" font-weight="bold" text-anchor="end">
            VERIFIED AT WWW.MSMEBOOKS.ORG
          </text>
        </svg>
      `;

      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `MsmeBooks_CoBranded_${companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${format}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div id="co-branded-studio" className="w-full mt-12 bg-white dark:bg-[#072457] rounded-3xl border-2 border-blue-200 dark:border-blue-800 p-6 sm:p-10 shadow-xl transition-all">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-blue-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-[#0A3981] dark:text-[#8CE600] border border-blue-200 dark:border-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0A3981] dark:text-[#8CE600]" />
            Self-Serve Creative Studio
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Co-Branded Marketing Assets Generator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-blue-100/80 mt-1 max-w-2xl">
            Input your firm's name and logo to instantly generate customized, high-resolution co-branded banners, client proposal covers, and social graphics featuring your official MsmeBooks metallic tier badge.
          </p>
        </div>

        <button
          onClick={handleDownloadAsset}
          disabled={isDownloading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0A3981] hover:bg-[#072c66] dark:bg-[#8CE600] dark:hover:bg-[#9be81c] text-white dark:text-[#061F4A] font-bold text-xs sm:text-sm transition-all shadow-md shrink-0 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400 dark:text-[#061F4A]" />
              <span>Asset Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating...' : 'Download Co-Branded Asset'}</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
        {/* Left Column: Customization Controls */}
        <div className="lg:col-span-5 space-y-5">
          {/* Company Name & Tagline */}
          <div className="bg-slate-50 dark:bg-[#061F4A] p-4 rounded-2xl border border-slate-200 dark:border-blue-900/80 space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                Your Practice / Company Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Adeyemi Financial & Advisory"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#072457] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                Tagline / Service Specialisation
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Certified Cloud Accounting & POS Implementation"
                className="w-full px-3 py-2 text-xs sm:text-sm bg-white dark:bg-[#072457] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600]"
              />
            </div>

            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Partner Tier Badge
                </label>
                <select
                  value={partnerTier}
                  onChange={(e) => setPartnerTier(e.target.value as PartnerTierId)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-[#072457] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] cursor-pointer font-bold"
                >
                  <option value="bronze">Bronze Partner (15%)</option>
                  <option value="silver">Silver Partner (20%)</option>
                  <option value="gold">Gold Partner (30%)</option>
                  <option value="platinum">Platinum Partner (40%)</option>
                </select>
              </div>

              <div className="w-36">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-1">
                  Accreditation ID
                </label>
                <input
                  type="text"
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs font-mono font-bold bg-white dark:bg-[#072457] text-slate-900 dark:text-white border border-slate-300 dark:border-blue-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0A3981] dark:focus:ring-[#8CE600] text-center"
                />
              </div>
            </div>
          </div>

          {/* Logo Selection: Custom Upload or Presets */}
          <div className="bg-slate-50 dark:bg-[#061F4A] p-4 rounded-2xl border border-slate-200 dark:border-blue-900/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Partner Firm Logo
              </label>
              {customLogoUrl && (
                <button
                  type="button"
                  onClick={() => setCustomLogoUrl(null)}
                  className="text-[11px] text-red-500 hover:underline cursor-pointer"
                >
                  Remove Uploaded Logo
                </button>
              )}
            </div>

            {/* Upload Button */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-white dark:bg-[#072457] border border-dashed border-blue-400 dark:border-blue-700 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/40 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Custom Logo (.PNG / .SVG)</span>
              </button>
            </div>

            {/* Preset Logos Selector */}
            <div className="pt-2 border-t border-slate-200 dark:border-blue-900/60">
              <div className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-bold tracking-wider mb-1.5">
                Or Select Professional Monogram Preset:
              </div>
              <div className="grid grid-cols-4 gap-2">
                {presetLogos.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetLogo(preset.id);
                      setCustomLogoUrl(null);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedPresetLogo === preset.id && !customLogoUrl
                        ? 'bg-blue-100 dark:bg-blue-900/80 border-[#0A3981] dark:border-[#8CE600] ring-1 ring-[#0A3981] dark:ring-[#8CE600]'
                        : 'bg-white dark:bg-[#072457] border-slate-200 dark:border-blue-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="text-lg select-none">{preset.icon}</div>
                    <div className="text-[10px] font-bold truncate mt-0.5">{preset.name}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Format & Dimensions Selector */}
          <div className="bg-slate-50 dark:bg-[#061F4A] p-4 rounded-2xl border border-slate-200 dark:border-blue-900/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Asset Format & Dimensions
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'linkedin_banner' as const, label: 'LinkedIn Banner', dim: '1200 × 630' },
                { id: 'square_social' as const, label: 'Instagram / WhatsApp', dim: '1080 × 1080' },
                { id: 'proposal_header' as const, label: 'Proposal Cover Header', dim: '1200 × 420' },
                { id: 'window_plaque' as const, label: 'Office Plaque / Decal', dim: '900 × 900' }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    format === f.id
                      ? 'bg-[#0A3981] dark:bg-blue-600 text-white border-[#0A3981] shadow-xs'
                      : 'bg-white dark:bg-[#072457] border-slate-200 dark:border-blue-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{f.label}</div>
                  <div className="text-[10px] opacity-75 font-mono">{f.dim}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Palette Selector */}
          <div className="bg-slate-50 dark:bg-[#061F4A] p-4 rounded-2xl border border-slate-200 dark:border-blue-900/80 space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
              Color Palette Theme
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'deep_blue' as const, name: 'Deep Blue', colors: 'from-[#0A3981] to-[#041535]' },
                { id: 'dark_gold' as const, name: 'Metallic Gold', colors: 'from-[#2A1D0A] to-[#0D0902]' },
                { id: 'clean_white' as const, name: 'Minimal White', colors: 'from-white to-blue-50' },
                { id: 'pan_african' as const, name: 'Pan-African', colors: 'from-[#053B22] to-[#02180E]' }
              ].map((th) => (
                <button
                  key={th.id}
                  type="button"
                  onClick={() => setTheme(th.id)}
                  className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    theme === th.id
                      ? 'border-[#0A3981] dark:border-[#8CE600] ring-2 ring-[#0A3981]/20 dark:ring-[#8CE600]/40'
                      : 'border-slate-200 dark:border-blue-900'
                  }`}
                >
                  <div className={`w-full h-4 rounded-md bg-gradient-to-r ${th.colors} mb-1 border border-black/10`} />
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-200 truncate">{th.name}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Dynamic Live Canvas Artwork Preview */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-white">
              <Eye className="w-4 h-4 text-[#0A3981] dark:text-[#8CE600]" />
              Live Artwork Preview ({dim.label})
            </span>
            <span className="text-[11px] font-mono text-emerald-600 dark:text-[#8CE600]">
              ✓ Ready for instant vector export
            </span>
          </div>

          {/* Visual Container */}
          <div 
            ref={previewRef}
            className={`w-full ${dim.aspect} max-h-[500px] rounded-3xl ${themeStyle.bg} border-4 ${themeStyle.border} shadow-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300`}
          >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#8CE600_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.05] pointer-events-none" />

            {/* Top Bar: Official Collaboration Indicator */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-white/10 backdrop-blur-md text-white border border-white/20">
                  Official Partnership
                </span>
                <span className="text-[10px] font-mono text-white/80">
                  ID: {partnerCode}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-wider text-[#8CE600]">
                <ShieldCheck className="w-4 h-4" />
                <span>VERIFIED ACCREDITED</span>
              </div>
            </div>

            {/* Center Content: Co-Branded Dual Wordmark & Badge */}
            <div className="relative z-10 text-center my-auto space-y-3 sm:space-y-4">
              {/* Dual Brand Logos Row */}
              <div className="flex items-center justify-center gap-4 sm:gap-6">
                {/* Partner Firm Logo Slot */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/95 shadow-md flex items-center justify-center p-2 border border-white/30 overflow-hidden">
                  {customLogoUrl ? (
                    <img src={customLogoUrl} alt="Partner Logo" className="w-full h-full object-contain" />
                  ) : (
                    <div className="text-center">
                      <div className="text-xl">{presetLogos[selectedPresetLogo].icon}</div>
                      <div className="text-[9px] font-black text-[#0A3981] font-mono leading-none">
                        {presetLogos[selectedPresetLogo].text}
                      </div>
                    </div>
                  )}
                </div>

                {/* Harmonious Connector */}
                <span className="text-2xl sm:text-3xl font-black text-[#8CE600] select-none">
                  +
                </span>

                {/* MsmeBooks Wordmark & Brand Badge */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0A3981] shadow-md flex items-center justify-center font-black text-xl text-white border border-white/30">
                  <span>M<span className="text-[#8CE600] -ml-0.5">b</span></span>
                </div>
              </div>

              {/* Partner Name Typography */}
              <div>
                <h4 className={`text-xl sm:text-3xl lg:text-4xl font-black ${themeStyle.textColor} tracking-tight leading-tight`}>
                  {companyName}
                </h4>
                <p className={`text-xs sm:text-sm font-medium ${themeStyle.subColor} max-w-lg mx-auto mt-1 line-clamp-2`}>
                  {tagline}
                </p>
              </div>

              {/* Metallic Badge Centerpiece Tag */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-400/30 to-amber-600/20 border border-amber-300/40 text-amber-200 text-xs font-bold uppercase tracking-wider backdrop-blur-sm shadow-sm">
                <Award className="w-4 h-4 text-amber-300" />
                <span>{currentTierInfo.name}</span>
                <span>·</span>
                <span className="text-white font-mono">{currentTierInfo.commissionRate}% Commission Tier</span>
              </div>
            </div>

            {/* Bottom Bar: Website & Footnote */}
            <div className="flex items-center justify-between text-[11px] text-white/70 relative z-10 pt-2 border-t border-white/10">
              <span className="font-mono">www.msmebooks.org/verify?id={partnerCode}</span>
              <span className="font-semibold text-[#8CE600]">Pan-African Cloud Accounting & POS</span>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Vector resolution SVG · 100% Crisp for print flyers, web headers & social media
            </div>

            <button
              onClick={handleDownloadAsset}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-blue-900/60 hover:bg-slate-200 dark:hover:bg-blue-800 text-xs font-bold text-[#0A3981] dark:text-[#8CE600] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export {format.replace('_', ' ').toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
