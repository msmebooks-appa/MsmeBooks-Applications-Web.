import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Building2, 
  MapPin, 
  TrendingUp, 
  ShieldCheck, 
  Layers, 
  ArrowRight,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { Testimonial } from '../types';

interface VideoDetailModalProps {
  testimonial: Testimonial | null;
  onClose: () => void;
  onStartTrial?: (planId?: string) => void;
}

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  testimonial,
  onClose,
  onStartTrial,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const duration = testimonial?.videoDurationSec || 10;
  const loopStartTimeRef = useRef<number>(Date.now());
  const pausedOffsetRef = useRef<number>(0);

  // Load portrait image
  useEffect(() => {
    if (!testimonial) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = testimonial.videoPoster || testimonial.image;
    img.onload = () => {
      imageObjRef.current = img;
      setIsImageLoaded(true);
    };
  }, [testimonial]);

  // Audio speech synthesis
  useEffect(() => {
    if (!testimonial || typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hello, I'm ${testimonial.name}, ${testimonial.role} at ${testimonial.business} in ${testimonial.city}. ${testimonial.quote}`
      );
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      window.speechSynthesis.cancel();
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying, isMuted, testimonial]);

  // Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !testimonial) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let start = Date.now() - pausedOffsetRef.current * 1000;
    loopStartTimeRef.current = start;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;

      let progress = 0;
      if (isPlaying) {
        const elapsed = (Date.now() - start) / 1000;
        const loopedSec = elapsed % duration;
        progress = loopedSec / duration;
        setCurrentTime(loopedSec);
        pausedOffsetRef.current = loopedSec;
      } else {
        progress = (pausedOffsetRef.current || 0) / duration;
        setCurrentTime(pausedOffsetRef.current || 0);
      }

      ctx.clearRect(0, 0, w, h);

      // Base image with pan & zoom
      if (imageObjRef.current && isImageLoaded) {
        const zoom = 1.04 + 0.06 * Math.sin(progress * Math.PI);
        const panX = 18 * Math.sin(progress * Math.PI * 2);

        ctx.save();
        ctx.translate(w / 2, h / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-w / 2 + panX, -h / 2);

        const img = imageObjRef.current;
        const imgRatio = img.width / img.height;
        const cRatio = w / h;
        let rW = w;
        let rH = h;
        let offX = 0;
        let offY = 0;
        if (cRatio > imgRatio) {
          rH = w / imgRatio;
          offY = (h - rH) / 2;
        } else {
          rW = h * imgRatio;
          offX = (w - rW) / 2;
        }
        ctx.drawImage(img, offX, offY, rW, rH);
        ctx.restore();
      } else {
        ctx.fillStyle = '#0B192C';
        ctx.fillRect(0, 0, w, h);
      }

      // Gradients
      const grad = ctx.createLinearGradient(0, h * 0.5, 0, h);
      grad.addColorStop(0, 'rgba(11, 25, 44, 0)');
      grad.addColorStop(1, 'rgba(7, 15, 27, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);

      // HUD overlay: Time and Loop status
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(16, 16, 180, 32, 6);
      ctx.fill();

      ctx.fillStyle = '#84CC16';
      ctx.beginPath();
      ctx.arc(30, 32, 4.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px Inter, sans-serif';
      ctx.fillText(`10s VIGNETTE • ${(currentTime).toFixed(1)}s`, 42, 36);

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isPlaying, isImageLoaded, duration, testimonial]);

  if (!testimonial) return null;

  const togglePlay = () => setIsPlaying(!isPlaying);
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#0B192C] rounded-3xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Video Theater (16:9) */}
        <div className="relative md:w-3/5 bg-slate-950 flex flex-col justify-between overflow-hidden">
          <div className="relative aspect-video w-full flex-1">
            <canvas 
              ref={canvasRef} 
              width={640} 
              height={360} 
              className="w-full h-full object-cover block"
            />

            {/* Play/Pause center overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="w-16 h-16 rounded-full bg-[#0A4FD5] text-white flex items-center justify-center shadow-xl border-2 border-white/50 transform hover:scale-110 active:scale-95 transition-all"
                >
                  <Play className="w-6 h-6 fill-white ml-1" />
                </button>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 flex flex-col gap-2">
              {/* 10s Scrubber */}
              <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#0A4FD5] via-blue-400 to-[#84CC16]"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="hover:text-blue-300">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={toggleMute} className="hover:text-blue-300 flex items-center gap-1.5">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[#84CC16]" />}
                    <span className="text-[10px] text-slate-300">{isMuted ? 'Muted' : 'Narrating'}</span>
                  </button>
                </div>

                <span className="text-[11px] font-mono text-slate-300">
                  00:0{Math.floor(currentTime)} / 00:{duration}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Full Case Study & Entrepreneur Breakdown */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Top Close & Tag */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0A4FD5] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-2.5 py-1 rounded-md border border-blue-200/50 dark:border-blue-800/50">
                <ShieldCheck className="w-3.5 h-3.5 text-[#84CC16]" />
                Verified SME Story
              </span>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Entrepreneur Profile Header */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-md"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {testimonial.name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {testimonial.role}
                </p>
                <p className="text-xs font-semibold text-[#0A4FD5] dark:text-blue-400 flex items-center gap-1 mt-0.5">
                  <span>{testimonial.flagEmoji || '🌍'}</span>
                  <span>{testimonial.business}</span>
                  <span className="text-slate-300">•</span>
                  <span>{testimonial.city}</span>
                </p>
              </div>
            </div>

            {/* Verified Impact Stat Banner */}
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 mb-4 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-800 dark:text-emerald-400 tracking-wider">
                  Verified Result
                </div>
                <div className="text-sm font-extrabold text-emerald-900 dark:text-emerald-200">
                  {testimonial.growthStat}
                </div>
              </div>

              {testimonial.verifiedTransactionVol && (
                <div className="text-right">
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">
                    Volume Logged
                  </div>
                  <div className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {testimonial.verifiedTransactionVol}
                  </div>
                </div>
              )}
            </div>

            {/* Full Quote */}
            <div className="mb-4">
              <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Full Experience
              </h5>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed bg-slate-50/70 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                "{testimonial.quote}"
              </p>
            </div>

            {/* Key Implementation Highlights */}
            {testimonial.videoHighlights && testimonial.videoHighlights.length > 0 && (
              <div className="mb-5 space-y-1.5">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Key Capabilities Deployed
                </h5>
                {testimonial.videoHighlights.map((hl, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#84CC16] shrink-0" />
                    <span>{hl}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* CTA Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => {
                onClose();
                if (onStartTrial) {
                  onStartTrial(testimonial.planUsed?.toLowerCase().split(' ')[0] || 'business');
                }
              }}
              className="w-full py-3 px-4 rounded-xl bg-[#0A4FD5] hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all transform active:scale-98"
            >
              <span>Start Free Trial on {testimonial.planUsed?.split(' ')[0] || 'Business'} Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="text-[10px] text-center text-slate-500 dark:text-slate-400 mt-2">
              No credit card required • Instant 14-day full access
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
