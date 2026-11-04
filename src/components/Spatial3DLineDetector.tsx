import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Compass,
  Sparkles,
  Layers,
  Activity,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Info,
  ChevronRight,
  Eye,
  Sliders,
  Crosshair,
  ShieldCheck,
  Zap
} from 'lucide-react';

export interface Spatial3DLine {
  id: string;
  name: string;
  sanskritName: string;
  color: string;
  glowColor: string;
  depthMm: number;
  curvatureDeg: number;
  significance: string;
  vedicInsight: string;
  coordinates: { x: number; y: number; z: number }[];
}

export const SPATIAL_LINES: Spatial3DLine[] = [
  {
    id: 'heart',
    name: 'Heart Line',
    sanskritName: 'Hridaya Rekha',
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.85)',
    depthMm: 2.8,
    curvatureDeg: 142.4,
    significance: 'Emotional resonance, empathy, devotion, and karmic bonds.',
    vedicInsight: 'A gentle upward sweep toward the Mount of Guru (Jupiter) indicates noble intentions, spiritual warmth, and steadfast devotion in love.',
    coordinates: [
      { x: 38, y: 44, z: 24 },
      { x: 48, y: 45, z: 28 },
      { x: 60, y: 48, z: 26 },
      { x: 74, y: 53, z: 22 },
      { x: 84, y: 60, z: 18 },
    ],
  },
  {
    id: 'head',
    name: 'Head Line',
    sanskritName: 'Mastak Rekha',
    color: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.85)',
    depthMm: 2.1,
    curvatureDeg: 164.2,
    significance: 'Intellect, discernment, cognitive focus, and strategic vision.',
    vedicInsight: 'A clear, deep line curving toward the Moon mount harmonizes analytical intellect with profound intuitive creativity.',
    coordinates: [
      { x: 36, y: 54, z: 20 },
      { x: 48, y: 56, z: 26 },
      { x: 62, y: 60, z: 24 },
      { x: 76, y: 66, z: 19 },
      { x: 86, y: 73, z: 15 },
    ],
  },
  {
    id: 'life',
    name: 'Life Line',
    sanskritName: 'Jeevan Rekha',
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.95)',
    depthMm: 3.4,
    curvatureDeg: 128.6,
    significance: 'Prana, vitality, biological endurance, and worldly journey.',
    vedicInsight: 'A wide, unbroken arc encompassing the Mount of Shukra (Venus) reflects abundant vitality, physical resilience, and strong grounding.',
    coordinates: [
      { x: 36, y: 54, z: 22 },
      { x: 42, y: 63, z: 32 },
      { x: 46, y: 73, z: 35 },
      { x: 52, y: 83, z: 30 },
      { x: 58, y: 92, z: 24 },
    ],
  },
  {
    id: 'fate',
    name: 'Fate Line',
    sanskritName: 'Bhagya Rekha',
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.85)',
    depthMm: 2.4,
    curvatureDeg: 178.5,
    significance: 'Karmic trajectory, vocation, discipline, and Saturnian dharma.',
    vedicInsight: 'Ascending vertically toward the Mount of Shani (Saturn), this line signifies purposeful destiny and steady career breakthroughs.',
    coordinates: [
      { x: 56, y: 92, z: 18 },
      { x: 55, y: 76, z: 24 },
      { x: 54, y: 61, z: 28 },
      { x: 53, y: 48, z: 25 },
      { x: 52, y: 36, z: 20 },
    ],
  },
  {
    id: 'sun',
    name: 'Sun Line',
    sanskritName: 'Surya Rekha',
    color: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.85)',
    depthMm: 1.6,
    curvatureDeg: 174.0,
    significance: 'Prestige, artistic brilliance, public renown, and solar aura.',
    vedicInsight: 'Presence of Surya Rekha indicates natural magnetism, public appreciation for one’s craft, and favorable recognition.',
    coordinates: [
      { x: 66, y: 64, z: 16 },
      { x: 66, y: 50, z: 22 },
      { x: 67, y: 36, z: 19 },
    ],
  },
  {
    id: 'dhanyoga',
    name: 'Dhan Yoga Triangle',
    sanskritName: 'Lakshmi Dhan Trikona',
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.9)',
    depthMm: 2.9,
    curvatureDeg: 60.0,
    significance: 'Sacred Money Triangle: closed reservoir of accumulated wealth and stability.',
    vedicInsight: 'Formed by the precise convergence of Head, Fate, and Mercury vectors. A fully enclosed triangle indicates extraordinary financial retention.',
    coordinates: [
      { x: 54, y: 61, z: 28 },
      { x: 63, y: 61, z: 25 },
      { x: 58, y: 74, z: 27 },
      { x: 54, y: 61, z: 28 },
    ],
  },
];

interface Spatial3DLineDetectorProps {
  onStartReading?: () => void;
  className?: string;
}

export const Spatial3DLineDetector: React.FC<Spatial3DLineDetectorProps> = ({
  onStartReading,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [activeLineId, setActiveLineId] = useState<string>('heart');
  const [viewMode, setViewMode] = useState<'spatial-lines' | 'lidar-mesh' | 'cinematic' | 'all'>('all');
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'ortho' | 'profile'>('perspective');
  const [tilt, setTilt] = useState({ x: 6, y: -8 });
  const [liveRayPos, setLiveRayPos] = useState<number>(38); // vertical percentage
  const [isRayActive, setIsRayActive] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const activeLine = SPATIAL_LINES.find((l) => l.id === activeLineId) || SPATIAL_LINES[0];

  useEffect(() => {
    const handleFS = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFS);
    return () => document.removeEventListener('fullscreenchange', handleFS);
  }, []);

  const toggleFullscreen = async () => {
    if (!canvasRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await canvasRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

  // Synthesize ethereal cosmic chime on line selection
  const playCosmicChime = (freq = 528) => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch (e) {
      // AudioContext policy safe fallback
    }
  };

  // Toggle video play/pause
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

  // Toggle slow motion (0.5x vs 1x)
  const toggleSlowMo = () => {
    if (!videoRef.current) return;
    const newRate = playbackRate === 1 ? 0.5 : 1;
    videoRef.current.playbackRate = newRate;
    setPlaybackRate(newRate);
  };

  // Rewind to 0
  const restartVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play();
    setIsPlaying(true);
  };

  // Dynamic 3D tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraPreset !== 'perspective') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 24;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cameraPreset === 'perspective') {
      setTilt({ x: 6, y: -8 });
    }
  };

  const applyPreset = (preset: 'perspective' | 'ortho' | 'profile') => {
    setCameraPreset(preset);
    if (preset === 'perspective') setTilt({ x: 6, y: -8 });
    if (preset === 'ortho') setTilt({ x: 0, y: 0 });
    if (preset === 'profile') setTilt({ x: 26, y: -22 });
  };

  // Continuous sweeping 3D spatial ray
  useEffect(() => {
    if (!isRayActive) return;
    const interval = setInterval(() => {
      setLiveRayPos((prev) => (prev > 88 ? 32 : prev + 0.8));
    }, 45);
    return () => clearInterval(interval);
  }, [isRayActive]);

  // Convert points array to a smooth SVG path
  const makeSmoothPath = (coords: { x: number; y: number }[]) => {
    if (!coords || coords.length === 0) return '';
    if (coords.length === 1) return `M ${coords[0].x} ${coords[0].y}`;

    let path = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i - 1];
      const curr = coords[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      path += ` Q ${prev.x} ${prev.y}, ${midX} ${midY}`;
    }
    const last = coords[coords.length - 1];
    path += ` T ${last.x} ${last.y}`;
    return path;
  };

  return (
    <div className={`relative w-full ${className}`}>
      
      {/* Container Frame with 3D Spatial Staging */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: 3D Spatial Video Canvas with Interactive Coordinate Geometry */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-8 relative aspect-[16/10] sm:aspect-[16/9] perspective-1500 select-none group"
        >
          {/* Ambient Cosmic Aura */}
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/25 via-purple-600/20 to-cyan-500/25 rounded-[32px] blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

          {/* 3D Tilted Glass Card Platform */}
          <motion.div
            animate={{
              rotateX: tilt.x,
              rotateY: tilt.y,
              scale: isHovered ? 1.012 : 1,
            }}
            transition={{
              type: 'spring',
              stiffness: 140,
              damping: 18,
              mass: 0.8,
            }}
            className="w-full h-full relative preserve-3d rounded-3xl overflow-hidden border-2 border-amber-400/40 bg-[#040614] shadow-2xl shadow-purple-950/80"
          >
            
            {/* Background Astrolabe Zodiac Rings in 3D Depth */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30"
              style={{ transform: 'translateZ(-40px)' }}
            >
              <div className="w-[120%] h-[120%] rounded-full border border-dashed border-amber-400/35 animate-astrolabe-cw" />
              <div className="absolute w-[95%] h-[95%] rounded-full border border-purple-500/35 animate-astrolabe-ccw" />
              <div className="absolute w-[75%] h-[75%] rounded-full border border-cyan-400/30 animate-astrolabe-cw" />
            </div>

            {/* Embedded Video: Hand opening and golden lines igniting */}
            <div className="absolute inset-0 preserve-3d">
              <video
                ref={videoRef}
                src="/assets/aistudio/acfa1f29-96e2-4504-8de7-d3eb787b9cf3_8c5074a6.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover object-center filter contrast-110 brightness-100"
              />

              {/* Edge Vignette & Smooth Cosmic Border Blend */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#03040c]/80 via-transparent to-[#03040c]/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#03040c] via-transparent to-[#03040c]/30 pointer-events-none" />
            </div>

            {/* Holographic LiDAR Depth Grid Overlay */}
            {(viewMode === 'lidar-mesh' || viewMode === 'all') && (
              <div className="absolute inset-0 hologram-grid opacity-25 mix-blend-screen pointer-events-none" />
            )}

            {/* ========================================================
                3D SPATIAL LINE DETECTION VECTOR OVERLAY (SVG + translateZ)
                ======================================================== */}
            {(viewMode === 'spatial-lines' || viewMode === 'all') && (
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 w-full h-full pointer-events-none z-20 preserve-3d"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Glowing line filters */}
                  <filter id="glow-gold" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="glow-intense" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="blur1" />
                    <feGaussianBlur stdDeviation="1" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur1" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Render All Spatial Detected Lines */}
                {SPATIAL_LINES.map((line) => {
                  const isActive = line.id === activeLineId;
                  const pathD = makeSmoothPath(line.coordinates);

                  return (
                    <g
                      key={line.id}
                      className="transition-all duration-300"
                      style={{
                        transform: `translateZ(${line.depthMm * 8}px)`,
                      }}
                    >
                      {/* Background Diffuse Aura */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={line.color}
                        strokeWidth={isActive ? 3.5 : 1.8}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isActive ? 0.6 : 0.25}
                        filter="url(#glow-intense)"
                      />

                      {/* Sharp Core Vector Spline */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={isActive ? '#ffffff' : line.color}
                        strokeWidth={isActive ? 1.6 : 1}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={isActive ? 1 : 0.85}
                        filter="url(#glow-gold)"
                        className={isActive ? 'animate-pulse' : ''}
                      />

                      {/* Spatial Point Vertices on Active Line */}
                      {line.coordinates.map((pt, pIdx) => (
                        <g key={pIdx}>
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r={isActive ? 1.4 : 0.9}
                            fill={isActive ? '#ffffff' : line.color}
                            stroke={line.color}
                            strokeWidth="0.5"
                          />
                          {isActive && pIdx === 2 && (
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="3.2"
                              fill="none"
                              stroke="#ffffff"
                              strokeWidth="0.4"
                              strokeDasharray="1,1"
                              className="animate-spin origin-center"
                            />
                          )}
                        </g>
                      ))}
                    </g>
                  );
                })}
              </svg>
            )}

            {/* ========================================================
                3D SPATIAL RAY-CAST DETECTION SCANNER (Sweeping Depth Beam)
                ======================================================== */}
            {isRayActive && (
              <div
                className="absolute left-0 right-0 pointer-events-none z-30 preserve-3d"
                style={{
                  top: `${liveRayPos}%`,
                  transform: 'translateZ(26px)',
                  transition: 'top 0.05s linear',
                }}
              >
                {/* Projected Optical Volumetric Laser Sheet */}
                <div className="w-full h-12 laser-sheet-fan opacity-70 transform -rotate-x-45 origin-bottom" />
                
                {/* Razor-sharp Laser Line */}
                <div className="w-full h-[2.5px] laser-beam-core shadow-[0_0_15px_#f59e0b,0_0_30px_#fbbf24]" />
                
                {/* Cyan Coherence Sub-Beam */}
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#06b6d4] mt-[1px]" />

                {/* Laser Ray Real-Time Telemetry Marker */}
                <div className="absolute -top-4 right-6 px-2 py-0.5 rounded bg-black/90 border border-amber-400/40 text-[9px] font-mono text-amber-300 tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>3D RAY // Z: +{(1.8 + Math.sin(liveRayPos) * 1.4).toFixed(2)}mm</span>
                </div>
              </div>
            )}

            {/* Interactive Biometric Labels overlaying the hand */}
            <div className="absolute inset-0 z-30 pointer-events-none">
              {SPATIAL_LINES.map((line) => {
                const isActive = line.id === activeLineId;
                const mid = line.coordinates[Math.floor(line.coordinates.length / 2)];

                return (
                  <div
                    key={line.id}
                    style={{
                      top: `${mid.y}%`,
                      left: `${mid.x}%`,
                      transform: `translate(-50%, -50%) translateZ(${line.depthMm * 10}px)`,
                    }}
                    className="absolute pointer-events-auto"
                  >
                    <button
                      onClick={() => {
                        setActiveLineId(line.id);
                        playCosmicChime(432 + line.depthMm * 40);
                      }}
                      className={`group/btn px-2 py-0.5 rounded-full border text-[9px] font-mono whitespace-nowrap transition-all duration-300 flex items-center gap-1 cursor-pointer shadow-lg backdrop-blur-md ${
                        isActive
                          ? 'bg-amber-400 text-slate-950 font-bold border-white scale-110 shadow-amber-400/50'
                          : 'bg-slate-950/80 text-slate-300 border-slate-700/80 hover:border-amber-400/60 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: line.color }}
                      />
                      <span>{line.name}</span>
                      <span className="opacity-70 text-[8px]">{line.depthMm}mm</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Top HUD Status Bar */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between text-[10px] font-mono text-slate-300">
              <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-amber-300 uppercase tracking-wider font-semibold">
                  3D Spatial Line Detection
                </span>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <span className="text-cyan-300 hidden sm:inline">6 VECTORS ACTIVE</span>
              </div>

              {/* Angle Preset Switchers */}
              <div className="flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => applyPreset('perspective')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                    cameraPreset === 'perspective'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  3D Tilt
                </button>
                <button
                  onClick={() => applyPreset('ortho')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                    cameraPreset === 'ortho'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Top-Down
                </button>
                <button
                  onClick={() => applyPreset('profile')}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer transition-colors ${
                    cameraPreset === 'profile'
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Profile
                </button>
              </div>
            </div>

            {/* Bottom HUD Media Controls */}
            <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-lg text-[11px]">
                <button
                  onClick={togglePlay}
                  className="p-1 hover:text-amber-300 transition-colors text-white cursor-pointer"
                  title={isPlaying ? 'Pause video' : 'Play video'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={toggleSlowMo}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                    playbackRate === 0.5
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50'
                      : 'text-slate-400 border-slate-700 hover:text-white'
                  }`}
                  title="Toggle 0.5x Slow Motion to inspect line emergence"
                >
                  0.5x Slow
                </button>

                <button
                  onClick={restartVideo}
                  className="p-1 hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                  title="Rewind video"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setIsRayActive(!isRayActive)}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono cursor-pointer border ${
                    isRayActive
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                      : 'text-slate-500 border-slate-800'
                  }`}
                >
                  {isRayActive ? 'Ray: ON' : 'Ray: OFF'}
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1 hover:text-amber-300 transition-colors text-slate-400 cursor-pointer"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Active Selected Line Pill */}
              <div className="bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-[10px] font-mono text-amber-300 hidden sm:flex items-center gap-2 shadow-lg">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeLine.color }} />
                <span className="font-bold">{activeLine.name}</span>
                <span className="text-slate-400 font-sans italic">({activeLine.sanskritName})</span>
              </div>
            </div>

            {/* Reticle Corner Brackets */}
            <div className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
            <div className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
            <div className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
            <div className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

          </motion.div>
        </div>

        {/* Right: 3D Spatial Telemetry & Line Insight Inspector */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Line Inspector Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0c102a] to-[#070918] border border-amber-500/30 shadow-xl shadow-purple-950/40 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block">
                  3D Spatial Vector Analysis
                </span>
                <h3 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: activeLine.color, color: activeLine.color }}
                  />
                  <span>{activeLine.name}</span>
                </h3>
                <p className="text-xs text-amber-300/90 font-serif italic">
                  {activeLine.sanskritName}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 block">ELEVATION</span>
                <span className="text-sm font-black font-mono text-amber-300">
                  +{activeLine.depthMm}mm
                </span>
              </div>
            </div>

            {/* Depth Profile Cross-Section Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>Spatial Curvature Arc</span>
                <span className="text-amber-300 font-bold">{activeLine.curvatureDeg}° Radius</span>
              </div>
              <div className="h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800 p-0.5">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    backgroundColor: activeLine.color,
                    boxShadow: `0 0 10px ${activeLine.color}`,
                  }}
                  animate={{
                    width: `${Math.min(100, (activeLine.depthMm / 4) * 100)}%`,
                  }}
                  transition={{ type: 'spring', stiffness: 100 }}
                />
              </div>
            </div>

            {/* Traditional Significance & Vedic Insight */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  Biometric Chiromancy
                </span>
                <p className="text-slate-200 leading-relaxed">
                  {activeLine.significance}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25">
                <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5 mb-1 font-semibold">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Hast Rekha Shastra Sutra</span>
                </span>
                <p className="text-amber-100/90 leading-relaxed italic font-serif">
                  {activeLine.vedicInsight}
                </p>
              </div>
            </div>

            {/* Interactive Line Selector Tabs */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                Select Line to Inspect:
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {SPATIAL_LINES.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      setActiveLineId(l.id);
                      playCosmicChime(432 + l.depthMm * 40);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-medium text-left transition-all cursor-pointer flex items-center justify-between ${
                      l.id === activeLineId
                        ? 'bg-amber-400/20 border-amber-400 text-amber-200 font-bold shadow-md shadow-amber-500/15'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="truncate">{l.name}</span>
                    <span
                      className="w-2 h-2 rounded-full shrink-0 ml-1"
                      style={{ backgroundColor: l.color }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* CTA: Get Full Palm Reading */}
            {onStartReading && (
              <button
                onClick={onStartReading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer text-xs uppercase tracking-wider border border-amber-200/50"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>Scan Your Own Palm</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

          </div>

          {/* Precision Security & LiDAR Spec */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Real-time LiDAR 3D Spatial Vector Mapping</span>
            </span>
            <span className="font-mono text-amber-400 text-[10px]">3D_HAST_V4</span>
          </div>

        </div>

      </div>

    </div>
  );
};
