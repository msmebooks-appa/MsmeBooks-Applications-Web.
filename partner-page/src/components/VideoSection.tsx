import React, { useState } from 'react';
import { 
  VIDEO_SHOWCASE_ITEMS, 
  ASSET_IMAGES 
} from '../data/partnerData';
import { 
  Play, 
  Clock, 
  Sparkles, 
  Volume2, 
  Maximize2, 
  CheckCircle2, 
  ArrowRight,
  Tv
} from 'lucide-react';
import { VideoItem } from '../types';

interface VideoSectionProps {
  onPlayVideoModal: (video: VideoItem) => void;
}

export const VideoSection: React.FC<VideoSectionProps> = ({ onPlayVideoModal }) => {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isPlayingSimulation, setIsPlayingSimulation] = useState<boolean>(false);

  const currentVideo = VIDEO_SHOWCASE_ITEMS[activeVideoIndex];

  return (
    <section id="videos" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#84CC16]/20 text-[#365314] text-xs font-bold uppercase tracking-wider mb-3">
            <Tv className="w-3.5 h-3.5 text-[#65A30D]" />
            Video Showcase
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0A192F] tracking-tight font-display">
            See MsmeBooks in Action
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Watch how African accountants, IT resellers, and SME business owners streamline their books, expand their businesses, and build sustainable recurring partner revenue.
          </p>
        </div>

        {/* Cinematic Main Video Player Mockup */}
        <div className="rounded-3xl bg-[#0A192F] border border-slate-800 shadow-2xl overflow-hidden mb-10 max-w-5xl mx-auto relative group">
          
          <div className="relative h-72 sm:h-96 md:h-[480px] w-full flex items-center justify-center overflow-hidden">
            <img
              src={currentVideo.thumbnail}
              alt={currentVideo.title}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isPlayingSimulation ? 'scale-105 filter brightness-75' : 'group-hover:scale-102'
              }`}
            />
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />

            {/* Big Play Button with Lemon-Green Accent (Mandate) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
              <button
                id={`play-video-btn-${currentVideo.id}`}
                onClick={() => {
                  setIsPlayingSimulation(!isPlayingSimulation);
                  onPlayVideoModal(currentVideo);
                }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#84CC16] hover:bg-[#9BE22D] text-[#0A192F] shadow-2xl shadow-[#84CC16]/40 flex items-center justify-center group/btn hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label={`Play ${currentVideo.title}`}
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-[#0A192F] ml-1 transition-transform group-hover/btn:scale-105" />
              </button>

              <span className="mt-4 text-xs sm:text-sm font-extrabold uppercase tracking-widest text-white drop-shadow-md bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
                Click to Watch: {currentVideo.tag} ({currentVideo.duration})
              </span>
            </div>

            {/* Video Meta Info Bar at Bottom of Player */}
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10 text-white">
              <div className="max-w-xl">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-extrabold bg-[#0F4C81] text-sky-200 border border-sky-400/30 inline-block mb-1.5">
                  {currentVideo.tag}
                </span>
                <h3 className="text-lg sm:text-2xl font-bold font-display leading-tight">
                  {currentVideo.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                  Presented by: {currentVideo.presenter}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-black/50 px-3 py-1.5 rounded-lg border border-white/10 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#84CC16]" />
                  {currentVideo.duration}
                </span>
              </div>
            </div>

          </div>

          {/* Player controls bottom strip */}
          <div className="bg-slate-900/95 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#84CC16] animate-pulse" />
              <span className="font-mono text-[11px] text-slate-300">HD 1080p African Business Broadcast</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => onPlayVideoModal(currentVideo)}
                className="text-[#84CC16] hover:underline font-bold"
              >
                Open Fullscreen Player
              </button>
            </div>
          </div>

        </div>

        {/* 5 Video Selector Cards (Mandate: Partner Stories, Product Demo, Accountant Experience, SME Success Stories, Partner Events) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 max-w-5xl mx-auto">
          {VIDEO_SHOWCASE_ITEMS.map((video, idx) => {
            const isSelected = activeVideoIndex === idx;

            return (
              <button
                key={video.id}
                onClick={() => {
                  setActiveVideoIndex(idx);
                  setIsPlayingSimulation(false);
                }}
                className={`text-left rounded-xl p-3.5 transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-50 border-[#0F4C81] shadow-md ring-1 ring-[#0F4C81]'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                      isSelected ? 'bg-[#0F4C81] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {video.tag}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-slate-400">
                      {video.duration}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug">
                    {video.title}
                  </h4>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className={`font-semibold ${isSelected ? 'text-[#0F4C81]' : 'text-slate-500'}`}>
                    {isSelected ? 'Now Viewing' : 'Select Video'}
                  </span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    isSelected ? 'bg-[#84CC16] text-[#0A192F]' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
