import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Video, 
  Film, 
  Check, 
  Loader2, 
  Building2, 
  MapPin, 
  Zap, 
  Play, 
  Info,
  Clock
} from 'lucide-react';
import { Testimonial } from '../types';

interface GenerateVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVideoGenerated: (newTestimonial: Testimonial) => void;
}

const REGION_OPTIONS = [
  { country: 'Nigeria', flag: '🇳🇬', defaultCity: 'Abuja & Lagos', currency: 'NGN' },
  { country: 'Ghana', flag: '🇬🇭', defaultCity: 'Accra & Kumasi', currency: 'GHS' },
  { country: 'Kenya', flag: '🇰🇪', defaultCity: 'Nairobi & Mombasa', currency: 'KES' },
  { country: 'South Africa', flag: '🇿🇦', defaultCity: 'Johannesburg & Cape Town', currency: 'ZAR' },
  { country: 'Rwanda', flag: '🇷🇼', defaultCity: 'Kigali', currency: 'RWF' },
  { country: 'Senegal', flag: '🇸🇳', defaultCity: 'Dakar', currency: 'XOF' },
];

const SECTOR_OPTIONS = [
  {
    name: 'Retail & Supermarket Chain',
    icon: '🛒',
    sampleMetric: '+48% faster checkout',
    headline: 'Multi-till barcode checkout & daily stock transfer audit',
    sampleQuote: 'Managing three supermarket tills without discrepancies was impossible before MsmeBooks. Now our inventory and cash receipts balance every single evening.',
    sampleImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    plan: 'Premium (10 Users)',
  },
  {
    name: 'Pharmacy & Medical Supplies',
    icon: '💊',
    sampleMetric: 'Zero expired stock waste',
    headline: 'Batch expiry tracking & statutory NAFDAC/FDA compliance',
    sampleQuote: 'The automated batch expiration alerts saved us millions in spoiled inventory. Our cashiers love the intuitive offline POS.',
    sampleImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
    plan: 'Business (5 Users)',
  },
  {
    name: 'Agricultural Wholesale & Export',
    icon: '🌾',
    sampleMetric: '100% tax compliant',
    headline: 'Automated weigh-bridge receipts & farmer payment ledger',
    sampleQuote: 'We disburse payments to over 300 cooperative farmers monthly. MsmeBooks automates our payment reconciliation and statutory tax reports.',
    sampleImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&auto=format&fit=crop&q=80',
    plan: 'Enterprise (15 Users)',
  },
  {
    name: 'Logistics, Freight & Cold Storage',
    icon: '🚛',
    sampleMetric: '4 depots connected',
    headline: 'Multi-warehouse stock distribution & fleet delivery tracking',
    sampleQuote: 'Keeping track of refrigerated inventory across cross-border hubs used to take a team of accountants. MsmeBooks does it in real-time.',
    sampleImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80',
    plan: 'Premium (10 Users)',
  },
  {
    name: 'Fashion Wholesale & Textiles',
    icon: '👗',
    sampleMetric: '35% less stock loss',
    headline: 'High-volume wholesale dispatch & live customer credit control',
    sampleQuote: 'MsmeBooks gives us complete visibility across our sales, inventory, and finances without requiring multiple complex systems.',
    sampleImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
    plan: 'Growth (2 Users)',
  },
];

const SAMPLE_PRESETS = [
  {
    label: 'Zainab Bello (Abuja Wholesale Foods)',
    name: 'Zainab Bello',
    business: 'Horizon Wholesale Foods & Spices',
    country: 'Nigeria',
    city: 'Abuja & Kano',
    sectorIdx: 0,
    highlights: ['Multi-store batch sync', 'Zero cash till variance', 'Daily automatic profit ledger'],
  },
  {
    label: 'Emmanuel Mensah (Accra Tech & Hardware)',
    name: 'Emmanuel Mensah',
    business: 'Gold Coast Electricals & Tools',
    country: 'Ghana',
    city: 'Accra',
    sectorIdx: 0,
    highlights: ['Offline POS during power cuts', 'GRA e-VAT instant digital receipts', 'Quick inventory reordering'],
  },
  {
    label: 'Achieng Odhiambo (Nairobi Cold Chain Co-op)',
    name: 'Achieng Odhiambo',
    business: 'Equator Fresh Produce Co-op',
    country: 'Kenya',
    city: 'Nairobi & Nakuru',
    sectorIdx: 2,
    highlights: ['M-Pesa Till instant sync', 'KRA eTIMS QR invoice stamping', 'Cut audit prep from 2 weeks to 1 hour'],
  },
];

export const GenerateVideoModal: React.FC<GenerateVideoModalProps> = ({
  isOpen,
  onClose,
  onVideoGenerated,
}) => {
  const [selectedRegion, setSelectedRegion] = useState(REGION_OPTIONS[0]);
  const [selectedSectorIdx, setSelectedSectorIdx] = useState(0);
  const [name, setName] = useState('Zainab Bello');
  const [business, setBusiness] = useState('Horizon Wholesale Hub');
  const [city, setCity] = useState('Abuja');
  const [customPrompt, setCustomPrompt] = useState(
    'African entrepreneur standing inside her modern store reviewing daily sales on a tablet, smiling with customers at the checkout in background'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);

  if (!isOpen) return null;

  const currentSector = SECTOR_OPTIONS[selectedSectorIdx];

  const handleApplyPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setName(preset.name);
    setBusiness(preset.business);
    setCity(preset.city);
    const reg = REGION_OPTIONS.find(r => r.country === preset.country) || REGION_OPTIONS[0];
    setSelectedRegion(reg);
    setSelectedSectorIdx(preset.sectorIdx);
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    setGenerationStep(1);
    setGenerationProgress(15);

    // Realistic multi-stage synthesis sequence mirroring Gemini Omni Flash pipeline
    const timers: NodeJS.Timeout[] = [];

    timers.push(
      setTimeout(() => {
        setGenerationStep(2);
        setGenerationProgress(40);
      }, 900)
    );

    timers.push(
      setTimeout(() => {
        setGenerationStep(3);
        setGenerationProgress(70);
      }, 1900)
    );

    timers.push(
      setTimeout(() => {
        setGenerationStep(4);
        setGenerationProgress(92);
      }, 2900)
    );

    timers.push(
      setTimeout(() => {
        setGenerationProgress(100);
        setIsGenerating(false);

        const newTestimonial: Testimonial = {
          name,
          role: 'Founder & Managing Director',
          business,
          city: `${city}, ${selectedRegion.country}`,
          country: selectedRegion.country,
          flagEmoji: selectedRegion.flag,
          industry: currentSector.name,
          image: currentSector.sampleImage,
          videoPoster: currentSector.sampleImage,
          quote: currentSector.sampleQuote,
          rating: 5,
          growthStat: currentSector.sampleMetric,
          videoDurationSec: 10,
          videoAspect: '16:9',
          planUsed: currentSector.plan,
          verifiedTransactionVol: `${selectedRegion.currency} 85M+ logged`,
          videoHeadline: `${currentSector.headline} in ${city}`,
          videoHighlights: [
            `100% synchronized in ${city}`,
            `Verified ${currentSector.plan} setup`,
            currentSector.sampleMetric,
          ],
        };

        onVideoGenerated(newTestimonial);
        onClose();
      }, 3700)
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white dark:bg-[#0B192C] rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#0A4FD5] to-blue-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
              <Film className="w-5 h-5 text-[#84CC16]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Generate 10s Video Testimonial</h3>
                <span className="text-[10px] font-bold bg-[#84CC16] text-[#0B192C] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Gemini Omni Flash
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Model: <code className="bg-blue-900/40 px-1 py-0.2 rounded font-mono text-[11px]">gemini-omni-1.2-flash</code> • 10-Second Seamless Loop
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Presets */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">
              Quick Start African SME Presets
            </label>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_PRESETS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/60 hover:border-blue-400 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-[#0A4FD5] dark:text-blue-400" />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Country / Region */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
              Country & Location
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {REGION_OPTIONS.map((reg) => (
                <button
                  key={reg.country}
                  type="button"
                  onClick={() => {
                    setSelectedRegion(reg);
                    setCity(reg.defaultCity.split('&')[0].trim());
                  }}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    selectedRegion.country === reg.country
                      ? 'border-[#0A4FD5] bg-blue-50/80 dark:bg-blue-950/60 text-[#0A4FD5] dark:text-blue-400 font-bold shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070F1B] text-slate-600 dark:text-slate-400 hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{reg.flag}</span>
                  <span className="text-[11px] truncate w-full">{reg.country}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields: Name, Business, City */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Entrepreneur Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070F1B] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5]"
                placeholder="e.g. Fatima Bello"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                Business / Enterprise
              </label>
              <input
                type="text"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070F1B] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5]"
                placeholder="e.g. Horizon Wholesale Hub"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 block">
                City / Branch
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070F1B] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5]"
                placeholder="e.g. Abuja"
              />
            </div>
          </div>

          {/* Industry / Sector */}
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 block">
              Industry & Use Case Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SECTOR_OPTIONS.map((sec, idx) => (
                <button
                  key={sec.name}
                  type="button"
                  onClick={() => setSelectedSectorIdx(idx)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                    selectedSectorIdx === idx
                      ? 'border-[#0A4FD5] bg-blue-50/70 dark:bg-blue-950/60 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#070F1B] hover:border-slate-300'
                  }`}
                >
                  <span className="text-xl shrink-0 mt-0.5">{sec.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {sec.name}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      {sec.sampleMetric}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Video Scene Prompt */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                10-Second Looping Scene Description
              </label>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#0A4FD5]" />
                10.0s Loop • 720p 60fps
              </span>
            </div>
            <textarea
              rows={2}
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#070F1B] text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0A4FD5] resize-none"
              placeholder="Describe the entrepreneur's action and setting..."
            />
          </div>

          {/* Generation Progress Indicator (Active state) */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 animate-fade-in space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-[#0A4FD5] dark:text-blue-300">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {generationStep === 1 && 'Connecting to Gemini Omni Flash...'}
                  {generationStep === 2 && 'Framing African entrepreneur business setting...'}
                  {generationStep === 3 && 'Synthesizing 10s seamless 60fps loop...'}
                  {generationStep === 4 && 'Injecting MsmeBooks POS & ledger overlay...'}
                </span>
                <span>{generationProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-blue-200 dark:bg-blue-900/60 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0A4FD5] via-blue-500 to-[#84CC16] rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Model: gemini-omni-1.2-flash</span>
                <span>Aspect: 16:9 • Duration: 10s</span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 bg-slate-50 dark:bg-[#070F1B] border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Adds high-impact 10s video card directly into trust section</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !name || !business}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0A4FD5] to-blue-600 hover:from-blue-600 hover:to-[#0A4FD5] text-white text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Generating 10s Video...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#84CC16]" />
                  Generate 10s Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
