import React, { useState, useEffect, useRef, useId } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Building2, 
  MapPin, 
  Subtitles,
  Share2,
  Check
} from 'lucide-react';
import { Testimonial } from '../types';

interface VideoTestimonialPlayerProps {
  testimonial: Testimonial;
  isActive?: boolean;
  onSelect?: () => void;
  onOpenDetails?: (testimonial: Testimonial) => void;
}

export const VideoTestimonialPlayer: React.FC<VideoTestimonialPlayerProps> = ({
  testimonial,
  isActive = false,
  onSelect,
  onOpenDetails,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const duration = testimonial.videoDurationSec || 10;
  const loopStartTimeRef = useRef<number>(Date.now());
  const pausedTimeOffsetRef = useRef<number>(0);

  // Load portrait image for canvas rendering
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = testimonial.videoPoster || testimonial.image;
    img.onload = () => {
      imageObjRef.current = img;
      setIsImageLoaded(true);
    };
  }, [testimonial.videoPoster, testimonial.image]);

  // Audio Speech synthesis narration when unmuted and playing
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    if (isPlaying && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        `Hi, I'm ${testimonial.name} from ${testimonial.business} in ${testimonial.city}. ${testimonial.quote}`
      );
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      
      // Select appropriate voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const preferredVoice = voices.find(v => 
          v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('English'))
        );
        if (preferredVoice) utterance.voice = preferredVoice;
      }

      utteranceRef.current = utterance;
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

  // Canvas 60fps render loop with 10-second seamless timeline
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let localStartTime = Date.now() - pausedTimeOffsetRef.current * 1000;
    loopStartTimeRef.current = localStartTime;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      let progress = 0;
      if (isPlaying) {
        const elapsed = (Date.now() - localStartTime) / 1000;
        const loopedSec = elapsed % duration;
        progress = loopedSec / duration;
        setCurrentTime(loopedSec);
        pausedTimeOffsetRef.current = loopedSec;
      } else {
        progress = (pausedTimeOffsetRef.current || 0) / duration;
        setCurrentTime(pausedTimeOffsetRef.current || 0);
      }

      ctx.clearRect(0, 0, width, height);

      // 1. Draw base photo with cinematic Ken Burns effect (pan & subtle zoom)
      if (imageObjRef.current && isImageLoaded) {
        const zoom = 1.05 + 0.08 * Math.sin(progress * Math.PI);
        const panX = 15 * Math.sin(progress * Math.PI * 2);
        const panY = 8 * Math.cos(progress * Math.PI);

        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(zoom, zoom);
        ctx.translate(-width / 2 + panX, -height / 2 + panY);

        // Aspect ratio cover
        const img = imageObjRef.current;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;
        let renderW = width;
        let renderH = height;
        let offX = 0;
        let offY = 0;

        if (canvasRatio > imgRatio) {
          renderH = width / imgRatio;
          offY = (height - renderH) / 2;
        } else {
          renderW = height * imgRatio;
          offX = (width - renderW) / 2;
        }

        ctx.drawImage(img, offX, offY, renderW, renderH);
        ctx.restore();
      } else {
        // Fallback dark gradient
        const bgGrad = ctx.createLinearGradient(0, 0, width, height);
        bgGrad.addColorStop(0, '#0F172A');
        bgGrad.addColorStop(1, '#020617');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Cinematic vignette & lighting overlay
      const vignette = ctx.createRadialGradient(
        width / 2, height / 2, width * 0.25,
        width / 2, height / 2, width * 0.75
      );
      vignette.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vignette.addColorStop(1, 'rgba(11, 25, 44, 0.75)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Dark gradient at bottom for text legibility
      const bottomGrad = ctx.createLinearGradient(0, height * 0.45, 0, height);
      bottomGrad.addColorStop(0, 'rgba(11, 25, 44, 0)');
      bottomGrad.addColorStop(0.7, 'rgba(11, 25, 44, 0.7)');
      bottomGrad.addColorStop(1, 'rgba(7, 15, 27, 0.95)');
      ctx.fillStyle = bottomGrad;
      ctx.fillRect(0, height * 0.4, width, height * 0.6);

      // 3. Simulated MsmeBooks UI HUD overlay in top corner
      // Shows live synchronized activity: POS checkout / stock transfer
      ctx.save();
      const hudX = 14;
      const hudY = 14;
      const hudW = 210;
      const hudH = 34;

      // HUD glass background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
      ctx.beginPath();
      ctx.roundRect(hudX, hudY, hudW, hudH, 6);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Flashing live recording beacon
      const pulseOpacity = 0.5 + 0.5 * Math.sin(Date.now() / 250);
      ctx.fillStyle = isPlaying ? `rgba(16, 185, 129, ${pulseOpacity})` : 'rgba(239, 68, 68, 0.8)';
      ctx.beginPath();
      ctx.arc(hudX + 14, hudY + hudH / 2, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // HUD Label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 10px Inter, sans-serif';
      ctx.fillText(isPlaying ? 'MSMEBOOKS LIVE STREAM' : 'PAUSED • 10.0s LOOP', hudX + 26, hudY + 16);

      ctx.fillStyle = '#94A3B8';
      ctx.font = '9px Inter, sans-serif';
      const branchText = `${testimonial.city} • ${testimonial.planUsed || 'Verified User'}`;
      ctx.fillText(branchText.slice(0, 28), hudX + 26, hudY + 27);
      ctx.restore();

      // 4. Live Audio Equalizer bars in top-right when playing
      if (isPlaying && !isMuted) {
        ctx.save();
        const eqX = width - 75;
        const eqY = 22;
        const bars = 5;
        for (let i = 0; i < bars; i++) {
          const barH = 5 + 14 * Math.abs(Math.sin((Date.now() / 150) + i * 0.8));
          ctx.fillStyle = '#84CC16'; // Lime primary
          ctx.fillRect(eqX + i * 6, eqY + (16 - barH) / 2, 3, barH);
        }
        ctx.restore();
      }

      // 5. Active quote closed caption (CC) ticker if enabled
      if (showCaptions) {
        ctx.save();
        const ccBoxY = height - 58;
        const ccBoxH = 28;
        const words = testimonial.quote.split(' ');
        const totalWords = words.length;
        const wordsPerSegment = 6;
        const totalSegments = Math.ceil(totalWords / wordsPerSegment);
        const currentSegmentIndex = Math.floor(progress * totalSegments);
        const currentSegmentWords = words.slice(
          currentSegmentIndex * wordsPerSegment,
          (currentSegmentIndex + 1) * wordsPerSegment
        );
        const currentCaption = currentSegmentWords.join(' ');

        if (currentCaption) {
          ctx.font = 'bold 12px Inter, sans-serif';
          const textMetrics = ctx.measureText(`"${currentCaption}..."`);
          const boxW = Math.min(width - 24, textMetrics.width + 24);
          const boxX = (width - boxW) / 2;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
          ctx.beginPath();
          ctx.roundRect(boxX, ccBoxY, boxW, ccBoxH, 6);
          ctx.fill();
          ctx.strokeStyle = 'rgba(132, 204, 22, 0.4)';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#F8FAFC';
          ctx.textAlign = 'center';
          ctx.fillText(`"${currentCaption}..."`, width / 2, ccBoxY + 18);
        }
        ctx.restore();
      }

      // 6. Seamless loop point marker indicator on the right side
      ctx.save();
      const loopPillW = 56;
      const loopPillH = 20;
      const loopPillX = width - loopPillW - 14;
      const loopPillY = 14;
      ctx.fillStyle = 'rgba(10, 79, 213, 0.85)';
      ctx.beginPath();
      ctx.roundRect(loopPillX, loopPillY, loopPillW, loopPillH, 10);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 9px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${(currentTime).toFixed(1)}s / 10s`, loopPillX + loopPillW / 2, loopPillY + 13);
      ctx.restore();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, isMuted, showCaptions, isImageLoaded, duration, testimonial]);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const toggleCaptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCaptions(!showCaptions);
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = ratio * duration;
    pausedTimeOffsetRef.current = targetSec;
    loopStartTimeRef.current = Date.now() - targetSec * 1000;
    setCurrentTime(targetSec);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Watch how ${testimonial.name} transformed ${testimonial.business} with MsmeBooks: ${window.location.origin}/#testimonials`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div 
      className={`group relative bg-white dark:bg-[#0B192C] rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs hover:shadow-xl flex flex-col justify-between ${
        isActive 
          ? 'border-[#0A4FD5] ring-2 ring-[#0A4FD5]/20 shadow-md' 
          : 'border-slate-200/90 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onSelect}
    >
      {/* 16:9 Video Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 overflow-hidden select-none cursor-pointer">
        <canvas 
          ref={canvasRef} 
          width={480} 
          height={270} 
          className="w-full h-full object-cover block"
        />

        {/* Big Center Play / Pause Floating Overlay */}
        {(!isPlaying || isHovered) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-[1px] transition-all duration-200">
            <button
              onClick={togglePlay}
              className="w-13 h-13 rounded-full bg-[#0A4FD5]/90 hover:bg-[#0A4FD5] text-white flex items-center justify-center shadow-lg transform hover:scale-110 active:scale-95 transition-all duration-200 border-2 border-white/40"
              aria-label={isPlaying ? 'Pause 10s video' : 'Play 10s video'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white text-white" />
              ) : (
                <Play className="w-5 h-5 fill-white text-white ml-0.5" />
              )}
            </button>
          </div>
        )}

        {/* Video Scrubber & Playback Controls Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-2.5 pt-6 flex flex-col gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Interactive 10s timeline bar */}
          <div 
            onClick={handleScrub}
            className="w-full h-1.5 bg-white/30 hover:h-2 rounded-full cursor-pointer relative overflow-hidden transition-all"
            title="Click to scrub 10-second loop"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#0A4FD5] via-blue-400 to-[#84CC16] rounded-full transition-all duration-75"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Controls line */}
          <div className="flex items-center justify-between text-white text-[11px] font-medium pt-0.5">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="hover:text-blue-300 transition-colors p-1"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={toggleMute}
                className={`p-1 transition-colors ${!isMuted ? 'text-[#84CC16]' : 'hover:text-blue-300'}`}
                aria-label={isMuted ? 'Unmute voiceover narration' : 'Mute'}
                title={isMuted ? 'Click to hear entrepreneur audio' : 'Mute audio'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={toggleCaptions}
                className={`p-1 text-[10px] font-bold rounded transition-colors ${showCaptions ? 'text-[#84CC16]' : 'text-white/60 hover:text-white'}`}
                title="Toggle Subtitles"
              >
                <Subtitles className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] text-slate-300 font-mono">
                00:0{Math.floor(currentTime)} / 00:{duration}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleShare}
                className="p-1 hover:text-blue-300 transition-colors"
                title="Share entrepreneur story"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </button>

              {onOpenDetails && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetails(testimonial);
                  }}
                  className="p-1 hover:text-blue-300 transition-colors flex items-center gap-1 text-[10px]"
                  title="Expand to full screen case study"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card Info Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Tag with Country Flag & Growth Metric */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400">
              <span className="text-base">{testimonial.flagEmoji || '🌍'}</span>
              <span>{testimonial.city}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {testimonial.growthStat}
            </span>
          </div>

          {/* Video Vignette Headline */}
          <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-[#0A4FD5] dark:group-hover:text-blue-400 transition-colors">
            {testimonial.videoHeadline || testimonial.quote}
          </h3>

          {/* Testimonial Quote */}
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3 leading-relaxed">
            "{testimonial.quote}"
          </p>

          {/* Key Highlights checklist */}
          {testimonial.videoHighlights && testimonial.videoHighlights.length > 0 && (
            <div className="mt-3.5 space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              {testimonial.videoHighlights.slice(0, 2).map((item, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#84CC16]" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Entrepreneur Identity */}
        <div className="mt-5 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {testimonial.name}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                {testimonial.business}
              </div>
            </div>
          </div>

          {testimonial.planUsed && (
            <span className="shrink-0 text-[10px] font-semibold text-[#0A4FD5] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded border border-blue-200/50 dark:border-blue-900/50">
              {testimonial.planUsed.split(' ')[0]} Plan
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
