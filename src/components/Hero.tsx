import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowDown,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onStartReading: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartReading, onLearnMore }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isSlowMo, setIsSlowMo] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isCinemaMode, setIsCinemaMode] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleSlowMo = () => {
    if (!videoRef.current) return;
    const newRate = isSlowMo ? 1 : 0.5;
    videoRef.current.playbackRate = newRate;
    setIsSlowMo(!isSlowMo);
  };

  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <section
      ref={containerRef}
      id="hero"
      className={`relative w-full overflow-hidden bg-[#03040c] transition-all select-none ${
        isFullscreen ? 'h-screen w-screen' : 'min-h-[100vh] lg:h-screen flex flex-col justify-between'
      }`}
    >
      {/* ========================================================
          FULL-SCREEN VIDEO (Clean, edge-to-edge, no line overlays)
          ======================================================== */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          ref={videoRef}
          src="/assets/aistudio/acfa1f29-96e2-4504-8de7-d3eb787b9cf3_8c5074a6.mp4"
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover object-center filter contrast-[1.08] brightness-[0.96] saturate-[1.12] transition-transform duration-1000"
        />

        {/* Cinematic Scrims: Enhances text legibility on left while keeping right side clean */}
        {!isCinemaMode && (
          <>
            <div className="absolute inset-0 bg-gradient-to-r from-[#03040c]/90 via-[#03040c]/55 to-transparent w-full lg:w-[60%] pointer-events-none transition-opacity duration-500" />
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#03040c]/85 via-[#03040c]/30 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#03040c] via-[#03040c]/50 to-transparent pointer-events-none" />
          </>
        )}

        {/* Astrolabe Zodiac Depth Rings in Background */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-[4%] lg:pr-[10%] opacity-30">
          <div className="w-[580px] h-[580px] sm:w-[720px] sm:h-[720px] rounded-full border border-dashed border-amber-400/35 animate-astrolabe-cw" />
          <div className="absolute w-[460px] h-[460px] sm:w-[560px] sm:h-[560px] rounded-full border border-purple-500/35 animate-astrolabe-ccw" />
          <div className="absolute w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] rounded-full border border-cyan-400/25 animate-astrolabe-cw" />
        </div>
      </div>

      {/* ========================================================
          TOP UTILITY BAR OVER FULLSCREEN VIDEO
          ======================================================== */}
      <div className="relative z-30 pt-4 px-4 sm:px-8 flex items-center justify-between">
        {/* Subtle Vedic Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/70 border border-amber-500/30 backdrop-blur-md text-[11px] font-medium text-amber-300">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          <span>Vedic Hast Rekha Shastra</span>
        </div>

        {/* Right Controls: Cinema Mode & Fullscreen */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCinemaMode(!isCinemaMode)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border backdrop-blur-md transition-all cursor-pointer flex items-center gap-1.5 ${
              isCinemaMode
                ? 'bg-amber-400 text-slate-950 font-bold border-white shadow-lg shadow-amber-400/30'
                : 'bg-slate-950/80 text-slate-300 border-slate-700 hover:border-amber-400 hover:text-white'
            }`}
            title="Toggle Cinema Mode (Hide overlay cards for unobstructed full-screen video)"
          >
            {isCinemaMode ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isCinemaMode ? 'Show Content' : 'Cinema Mode'}</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-amber-500/40 text-amber-300 hover:text-white backdrop-blur-md cursor-pointer transition-all shadow-lg"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ========================================================
          MAIN HERO TYPOGRAPHY & CALL TO ACTION
          ======================================================== */}
      <div className="relative z-20 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col justify-center py-8">
        <AnimatePresence>
          {!isCinemaMode && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="max-w-2xl space-y-6 text-left"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-600/20 to-amber-500/15 border border-amber-500/35 text-amber-300 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase shadow-lg shadow-amber-500/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>ANCIENT VEDIC PALMISTRY · HAST REKHA SHASTRA</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                Your Hands Hold a Story.{' '}
                <span className="block mt-2 text-antique-gold-shimmer">
                  Discover Yours.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-md">
                Discover what your Heart, Head, Life, and Fate lines reveal about your path, purpose, and destiny through the timeless wisdom of Vedic Hast Rekha Shastra.
              </p>

              {/* Primary Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <button
                  onClick={onStartReading}
                  className="w-full sm:w-auto px-8 py-4 rounded-full font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-xl shadow-amber-500/40 hover:shadow-amber-500/70 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer text-base tracking-wide border border-amber-200/50"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  <span>Get Your Reading</span>
                </button>

                <button
                  onClick={onLearnMore}
                  className="w-full sm:w-auto px-7 py-4 rounded-full font-semibold text-slate-200 border border-amber-400/40 bg-slate-900/80 hover:bg-slate-800/90 hover:border-amber-400 transition-all flex items-center justify-center gap-2 cursor-pointer text-base shadow-lg hover:text-amber-200 group backdrop-blur-md"
                >
                  <Compass className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
                  <span>Photo Guide & Tips</span>
                </button>

                <button
                  onClick={toggleFullscreen}
                  className="hidden lg:flex px-4 py-4 rounded-full font-medium text-slate-300 border border-slate-700 bg-slate-950/70 hover:bg-slate-900 hover:text-white transition-all items-center justify-center gap-2 cursor-pointer text-sm backdrop-blur-md"
                  title="Experience in full-screen monitor view"
                >
                  <Maximize2 className="w-4 h-4 text-amber-400" />
                  <span>Fullscreen</span>
                </button>
              </div>

              {/* Vedic Micro Badges */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300 font-medium drop-shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">✦</span>
                  <span>Zero registration required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">✦</span>
                  <span>Authentic Vedic Interpretation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">✦</span>
                  <span>100% In-Browser Privacy</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================
          CLEAN MEDIA CONTROLS DOCK (BOTTOM DOCK)
          ======================================================== */}
      <div className="relative z-30 pb-4 px-4 flex items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 bg-slate-950/90 border border-amber-500/30 rounded-full px-3 py-1.5 backdrop-blur-md shadow-2xl">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="p-1.5 text-slate-300 hover:text-amber-300 transition-colors cursor-pointer"
            title={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          {/* Slow Motion */}
          <button
            onClick={toggleSlowMo}
            className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer border transition-all ${
              isSlowMo
                ? 'bg-amber-400/25 text-amber-300 border-amber-400/50'
                : 'text-slate-400 border-transparent hover:text-white'
            }`}
            title="Toggle 0.5x Slow Motion"
          >
            0.5x Slow-Mo
          </button>

          {/* Restart */}
          <button
            onClick={restartVideo}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Restart video"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <span className="w-px h-3.5 bg-slate-800" />

          {/* Sound / Mute Toggle */}
          <button
            onClick={toggleMute}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              !isMuted ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
            }`}
            title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* True Fullscreen Toggle */}
          <button
            onClick={toggleFullscreen}
            className="p-1.5 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Floating subtle scroll indicator */}
        {!isFullscreen && (
          <div
            onClick={onLearnMore}
            className="cursor-pointer flex items-center gap-1.5 text-slate-400 hover:text-amber-300 transition-colors text-xs font-medium"
          >
            <span>Discover Sacred Palm Secrets</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </div>
        )}
      </div>
    </section>
  );
};
