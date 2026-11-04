import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scan,
  Orbit,
  Compass,
  Activity,
  ShieldCheck,
  Eye,
  Layers,
  Sparkles,
  Maximize2,
  Sliders,
  Crosshair,
  Volume2
} from 'lucide-react';

interface PalmScanner3DProps {
  palmImageUrl?: string;
  isAnalyzing?: boolean;
  dominantHand?: 'left' | 'right';
  className?: string;
  showControls?: boolean;
}

export const PalmScanner3D: React.FC<PalmScanner3DProps> = ({
  palmImageUrl = '/assets/aistudio/media_1793731253462_a26aed84_79caa7fd.jpg',
  isAnalyzing = true,
  dominantHand = 'right',
  className = '',
  showControls = true,
}) => {
  // 3D Spatial orientation
  const [rotation, setRotation] = useState({ x: 8, y: -10 });
  const [activeMode, setActiveMode] = useState<'laser-sheet' | 'vedic-mesh' | 'lidar-points'>('laser-sheet');
  const [cameraPreset, setCameraPreset] = useState<'perspective' | 'ortho' | 'profile'>('perspective');
  const [scanSpeed, setScanSpeed] = useState<number>(3.6); // seconds per cycle
  const [liveCoords, setLiveCoords] = useState({ x: 48.2, y: 52.8, z: 2.4 });
  const [activeZone, setActiveZone] = useState<string>('Jeevan Rekha (Life Line)');
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Dynamic live coordinates simulation for biometric LiDAR
  useEffect(() => {
    if (!isAnalyzing) return;

    const zones = [
      'Hridaya Rekha (Heart Line)',
      'Mastak Rekha (Head Line)',
      'Jeevan Rekha (Life Line)',
      'Guru Parvat (Jupiter Mount)',
      'Shukra Parvat (Venus Mount)',
      'Dhan Yoga Convergence Triangle',
      'Chandra Parvat (Moon Mount)',
    ];

    const coordInterval = setInterval(() => {
      setLiveCoords({
        x: +(32 + Math.random() * 36).toFixed(1),
        y: +(25 + Math.random() * 50).toFixed(1),
        z: +(0.8 + Math.random() * 3.4).toFixed(2),
      });
    }, 480);

    const zoneInterval = setInterval(() => {
      setActiveZone(zones[Math.floor(Math.random() * zones.length)]);
    }, 2400);

    return () => {
      clearInterval(coordInterval);
      clearInterval(zoneInterval);
    };
  }, [isAnalyzing]);

  // Dynamic 3D interactive tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (cameraPreset !== 'perspective') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -22;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 26;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (cameraPreset === 'perspective') {
      setRotation({ x: 8, y: -10 });
    }
  };

  // Switch camera presets
  const applyPreset = (preset: 'perspective' | 'ortho' | 'profile') => {
    setCameraPreset(preset);
    if (preset === 'perspective') setRotation({ x: 8, y: -10 });
    if (preset === 'ortho') setRotation({ x: 0, y: 0 });
    if (preset === 'profile') setRotation({ x: 28, y: -24 });
  };

  return (
    <div className={`relative w-full max-w-[520px] mx-auto select-none ${className}`}>
      
      {/* 3D Scanning Canvas Viewport */}
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative aspect-[4/5] perspective-1500 cursor-crosshair group"
      >
        {/* Ambient Outer Halo */}
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/20 via-purple-600/15 to-cyan-500/20 rounded-[32px] blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

        {/* 3D Tilted Card Platform with Preserve-3D */}
        <motion.div
          animate={{
            rotateX: rotation.x,
            rotateY: rotation.y,
            scale: isHovered ? 1.015 : 1,
          }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 18,
            mass: 0.8,
          }}
          className="w-full h-full relative preserve-3d rounded-3xl overflow-hidden border border-amber-500/35 bg-[#050614] shadow-2xl shadow-purple-950/70"
        >
          
          {/* Background Rotating Astrolabe Rings in Deep 3D Space */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-35" style={{ transform: 'translateZ(-50px)' }}>
            <div className="w-[125%] h-[125%] rounded-full border border-dashed border-amber-400/30 animate-astrolabe-cw" />
            <div className="absolute w-[100%] h-[100%] rounded-full border border-purple-500/30 animate-astrolabe-ccw" />
            <div className="absolute w-[80%] h-[80%] rounded-full border border-cyan-400/25 animate-astrolabe-cw" />
            <div className="absolute w-[60%] h-[60%] rounded-full border border-dashed border-amber-300/20 animate-astrolabe-ccw" />
          </div>

          {/* The Uploaded Palm Image Texture or Video */}
          <div className="absolute inset-0 preserve-3d">
            {palmImageUrl && palmImageUrl.endsWith('.mp4') ? (
              <video
                src={palmImageUrl}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-center filter contrast-125 brightness-95"
              />
            ) : (
              <img
                src={palmImageUrl}
                alt="Uploaded Palm 3D Scan"
                className="w-full h-full object-cover object-center filter contrast-125 brightness-95 transform transition-transform duration-500"
              />
            )}
            
            {/* Dark Vignette & Edge Shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#03040c] via-transparent to-[#03040c]/50" />
            <div className="absolute inset-0 bg-radial from-transparent via-[#03040c]/20 to-[#03040c]/70" />
          </div>

          {/* Holographic Grid Overlays */}
          {activeMode === 'laser-sheet' && (
            <div className="absolute inset-0 hologram-grid opacity-30 mix-blend-screen pointer-events-none" />
          )}

          {activeMode === 'vedic-mesh' && (
            <div className="absolute inset-0 hologram-polar-grid opacity-40 mix-blend-screen pointer-events-none" />
          )}

          {activeMode === 'lidar-points' && (
            <div className="absolute inset-0 hologram-cyan-grid opacity-45 mix-blend-screen pointer-events-none" />
          )}

          {/* ========================================================
              HIGH-FIDELITY 3D VOLUMETRIC LASER SHEET SWEEP (Framer Motion)
              ======================================================== */}
          {isAnalyzing && (
            <div className="absolute inset-0 pointer-events-none preserve-3d overflow-hidden">
              
              {/* Animated Laser Sheet Sweeping Vertically */}
              <motion.div
                animate={{
                  top: ['2%', '96%', '2%'],
                }}
                transition={{
                  duration: scanSpeed,
                  repeat: Infinity,
                  ease: [0.45, 0.05, 0.55, 0.95],
                }}
                className="absolute left-0 right-0 z-30 preserve-3d"
                style={{
                  height: '140px',
                  marginTop: '-70px',
                  transform: 'translateZ(28px)',
                }}
              >
                {/* 1. Volumetric Angled Sheet Fan (The 3D Projected Optical Sheet) */}
                <div
                  className="w-full h-24 laser-sheet-fan opacity-85"
                  style={{
                    transform: 'rotateX(58deg)',
                    transformOrigin: 'bottom center',
                    filter: 'blur(0.5px)',
                  }}
                />

                {/* 2. Primary Blazing Laser Intersection Line (Contact with palm surface) */}
                <div className="relative w-full h-[3.5px] laser-beam-core shadow-[0_0_20px_#f59e0b,0_0_40px_#fbbf24,0_0_70px_#fef08a]" />

                {/* 3. Secondary Cyan Coherence Beam Line */}
                <div className="w-full h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_15px_#06b6d4] mt-[1px]" />

                {/* 4. Downward Volumetric Light Cast & Surface Refraction */}
                <div className="w-full h-16 bg-gradient-to-b from-amber-400/25 via-amber-400/10 to-transparent opacity-75" />

                {/* 5. Dynamic Surface Reflection Sheen across the palm */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-20 laser-reflection-sheen pointer-events-none" />

                {/* 6. Real-time Optical Laser Sparks / Photon Emitters */}
                <motion.div
                  animate={{
                    x: ['-20%', '30%', '-10%', '20%'],
                    opacity: [0.6, 1, 0.4, 0.9],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-1/2 left-1/3 w-3 h-3 rounded-full bg-white blur-[1px] shadow-[0_0_12px_#ffffff]"
                />
                <motion.div
                  animate={{
                    x: ['30%', '-25%', '15%', '-20%'],
                    opacity: [0.8, 0.3, 0.95, 0.5],
                  }}
                  transition={{
                    duration: 2.1,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute top-1/2 right-1/4 w-2.5 h-2.5 rounded-full bg-amber-300 blur-[1px] shadow-[0_0_10px_#f59e0b]"
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-16 h-1 bg-cyan-200 blur-[2px] opacity-75" />

                {/* Horizontal Coordinates Label on Laser Line */}
                <div className="absolute -top-5 right-4 px-2 py-0.5 rounded bg-black/85 border border-amber-400/50 text-[9px] font-mono text-amber-300 tracking-wider flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>532nm LIDAR // Z:{liveCoords.z}mm</span>
                </div>
              </motion.div>

              {/* Secondary Light Sheet Wavefront (Soft Ambient Sweep) */}
              <div className="absolute inset-0 pointer-events-none animate-light-sheet opacity-30 bg-gradient-to-b from-transparent via-amber-400/10 to-transparent" />
            </div>
          )}

          {/* ========================================================
              BIOMETRIC HAST REKHA VEDIC NODES & OVERLAYS
              ======================================================== */}
          <div className="absolute inset-0 pointer-events-none z-20 preserve-3d">
            
            {/* Mount of Jupiter (Index base - Guru) */}
            <div
              className="absolute top-[23%] left-[27%] flex items-center gap-1.5"
              style={{ transform: 'translateZ(18px)' }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-4 h-4 rounded-full border border-amber-400/80 bg-amber-400/20 flex items-center justify-center shadow-lg shadow-amber-400/50">
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </div>
                <div className="absolute w-7 h-7 rounded-full border border-dashed border-amber-300/40 animate-spin [animation-duration:8s]" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-amber-200 bg-slate-950/85 px-1.5 py-0.5 rounded border border-amber-400/30 backdrop-blur-sm shadow">
                GURU · JUPITER
              </span>
            </div>

            {/* Mount of Saturn (Middle base - Shani) */}
            <div
              className="absolute top-[21%] left-[45%] flex items-center gap-1.5"
              style={{ transform: 'translateZ(18px)' }}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-purple-400/80 bg-purple-400/20 flex items-center justify-center shadow-lg shadow-purple-400/50">
                <div className="w-1 h-1 rounded-full bg-white" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-purple-200 bg-slate-950/85 px-1.5 py-0.5 rounded border border-purple-400/30 backdrop-blur-sm shadow">
                SHANI · SATURN
              </span>
            </div>

            {/* Mount of Sun (Ring finger base - Surya) */}
            <div
              className="absolute top-[22%] right-[32%] flex items-center gap-1.5"
              style={{ transform: 'translateZ(18px)' }}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-amber-300/80 bg-amber-300/20 flex items-center justify-center shadow-lg shadow-amber-300/50">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-amber-200 bg-slate-950/85 px-1.5 py-0.5 rounded border border-amber-400/30 backdrop-blur-sm shadow">
                SURYA · SUN
              </span>
            </div>

            {/* Dhan Yoga Convergence Triangle Core (Center Palm) */}
            <div
              className="absolute top-[48%] left-[47%] transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              style={{ transform: 'translateZ(26px) translate(-50%, -50%)' }}
            >
              <div className="w-10 h-10 rounded-full border border-dashed border-amber-300/70 animate-spin [animation-duration:12s] flex items-center justify-center relative">
                <div className="w-4 h-4 rounded-full bg-amber-400/35 border border-amber-200 animate-pulse shadow-[0_0_15px_#f59e0b]" />
                <div className="absolute inset-0 border-t border-r border-amber-400/50 rotate-45" />
              </div>
              <span className="text-[8px] font-mono uppercase tracking-widest text-amber-300 bg-slate-950/90 px-2 py-0.5 rounded border border-amber-400/40 mt-1 shadow-lg backdrop-blur-md">
                DHAN_YOGA_NEXUS
              </span>
            </div>

            {/* Mount of Venus (Thumb Base - Shukra Prana) */}
            <div
              className="absolute top-[65%] left-[23%] flex items-center gap-1.5"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-rose-400/80 bg-rose-400/20 flex items-center justify-center shadow-lg shadow-rose-400/40">
                <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-rose-200 bg-slate-950/85 px-1.5 py-0.5 rounded border border-rose-400/30 backdrop-blur-sm shadow">
                SHUKRA · VENUS
              </span>
            </div>

            {/* Mount of Moon (Percussion - Chandra Intuition) */}
            <div
              className="absolute top-[72%] right-[22%] flex items-center gap-1.5"
              style={{ transform: 'translateZ(20px)' }}
            >
              <div className="w-3.5 h-3.5 rounded-full border border-cyan-400/80 bg-cyan-400/20 flex items-center justify-center shadow-lg shadow-cyan-400/40">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <span className="text-[8px] font-mono tracking-widest text-cyan-200 bg-slate-950/85 px-1.5 py-0.5 rounded border border-cyan-400/30 backdrop-blur-sm shadow">
                CHANDRA · MOON
              </span>
            </div>

            {/* Dynamic Real-Time Crosshair Tracking Node */}
            <motion.div
              animate={{
                top: `${liveCoords.y}%`,
                left: `${liveCoords.x}%`,
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 15,
              }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ transform: 'translateZ(30px)' }}
            >
              <div className="relative flex items-center justify-center">
                <div className="w-12 h-12 border border-amber-400/50 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-6 h-6 border-t-2 border-l-2 border-amber-300" />
                </div>
                <div className="absolute w-2 h-2 rounded-full bg-amber-300 animate-ping" />
              </div>
              <div className="text-[8px] font-mono text-amber-300 whitespace-nowrap bg-black/90 px-1.5 py-0.5 rounded border border-amber-400/30 shadow mt-1 text-center">
                X:{liveCoords.x} Y:{liveCoords.y}
              </div>
            </motion.div>

          </div>

          {/* Top HUD Status Bar */}
          <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between text-[10px] font-mono text-slate-300">
            <div className="flex items-center gap-2 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-amber-300 uppercase tracking-wider font-semibold">
                3D Laser Profilometry
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <div className="bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700 text-slate-300 uppercase text-[10px]">
                {dominantHand} Hand
              </div>
              <div className="bg-amber-400/15 border border-amber-400/40 text-amber-300 px-2 py-1.5 rounded-xl text-[10px] font-semibold">
                4096 DPI
              </div>
            </div>
          </div>

          {/* Bottom HUD Active Trajectory Banner */}
          <div className="absolute bottom-3 left-3 right-3 z-30">
            <div className="p-3 rounded-2xl bg-slate-950/90 backdrop-blur-md border border-amber-500/35 flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/35 flex items-center justify-center text-amber-300 shadow">
                  <Scan className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-semibold text-white font-cinzel">
                      Scanning: {activeZone}
                    </p>
                  </div>
                  <p className="text-[9px] font-mono text-amber-400/80">
                    OPTICAL DEPTH: {liveCoords.z}mm · SAMPLING: 60 FPS
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>EPHEMERAL</span>
              </div>
            </div>
          </div>

          {/* Corner Precision Reticles */}
          <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-amber-400/70 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-amber-400/70 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-amber-400/70 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-amber-400/70 pointer-events-none" />

        </motion.div>
      </div>

      {/* Interactive HUD Controls (Below 3D Canvas) */}
      {showControls && (
        <div className="mt-4 p-3 rounded-2xl bg-[#090b1c]/90 border border-slate-800/80 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase font-mono text-slate-400 hidden sm:inline mr-1">
              View Mode:
            </span>
            <button
              onClick={() => setActiveMode('laser-sheet')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'laser-sheet'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Scan className="w-3 h-3" />
              <span>Laser Sheet</span>
            </button>

            <button
              onClick={() => setActiveMode('vedic-mesh')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'vedic-mesh'
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Compass className="w-3 h-3" />
              <span>Vedic Mesh</span>
            </button>

            <button
              onClick={() => setActiveMode('lidar-points')}
              className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMode === 'lidar-points'
                  ? 'bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-400/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>LiDAR Points</span>
            </button>
          </div>

          {/* Perspective Preset Angles */}
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-[10px] uppercase font-mono text-slate-400 hidden sm:inline mr-1">
              Angle:
            </span>
            <button
              onClick={() => applyPreset('perspective')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                cameraPreset === 'perspective'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title="3D Tilt View"
            >
              3D Tilt
            </button>
            <button
              onClick={() => applyPreset('ortho')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                cameraPreset === 'ortho'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title="Top Down Flat View"
            >
              Top-Down
            </button>
            <button
              onClick={() => applyPreset('profile')}
              className={`px-2 py-1 rounded-lg text-[10px] font-mono cursor-pointer transition-colors ${
                cameraPreset === 'profile'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
              title="Depth Profile View"
            >
              Profile
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
