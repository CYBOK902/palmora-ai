import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Orbit,
  Compass,
  Activity,
  ShieldCheck,
  Scan,
  Radio,
  Crosshair,
  Layers,
  Cpu,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { PalmScanner3D } from './PalmScanner3D';

interface ReadingLoadingStateProps {
  palmImageUrl?: string;
  dominantHand?: 'left' | 'right';
}

export const ReadingLoadingState: React.FC<ReadingLoadingStateProps> = ({
  palmImageUrl,
  dominantHand = 'right',
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(14);
  const [telemetryLog, setTelemetryLog] = useState<string[]>([
    'Calibrating 532nm solid-state laser profilometry...',
    'Triangulating palm planar boundaries and knuckle landmarks...',
  ]);

  const steps = [
    {
      title: 'LiDAR Contour & Hand Topology Calibration',
      detail: 'Analyzing 3D palm curvature, micro-relief ridge elevation, and elemental archetype (Fire/Earth/Air/Water)...',
      code: 'TOPOLOGY_MESH_CALIBRATED',
    },
    {
      title: 'Tracing Major Hast Rekha Coordinate Paths',
      detail: 'Mapping Hridaya (Heart), Mastak (Head), and Jeevan (Life) line trajectories with sub-millimeter precision...',
      code: 'VECTORS_TRACED_3D',
    },
    {
      title: 'Triangulating Planetary Mount Elevations',
      detail: 'Scanning Mounts of Guru (Jupiter), Shani (Saturn), Surya (Sun), Budh (Mercury), and Shukra (Venus)...',
      code: 'MOUNTS_ELEVATION_MAPPED',
    },
    {
      title: 'Isolating Auspicious Signs & Dhan Yoga Nexus',
      detail: 'Detecting the Great Money Triangle, Mystic Cross (Kavacha), and secondary auspicious marks...',
      code: 'DHAN_YOGA_TRIANGULATED',
    },
    {
      title: 'Synthesizing Vedic Chiromancy Report',
      detail: 'Harmonizing sacred Hast Rekha Shastra wisdom with multimodal neural vision insights...',
      code: 'SYNTHESIS_FINALIZING',
    },
  ];

  const vedicWisdom = [
    '“Kara agre vasate Lakshmi, kara madhye Saraswati, kara moole tu Govinda — prabhate kara darshanam.”',
    '“The lines on the hand are written by our karma, yet awareness reshapes our destiny.”',
    '“A deep, unbroken Life Line signifies enduring prana, vitality, and inner resilience.”',
    '“The Dhan Yoga triangle between Head, Fate, and Mercury lines reflects one’s capacity to retain wealth.”',
  ];
  const [wisdomIndex, setWisdomIndex] = useState<number>(0);

  // Smoothly increment progress percent and step index
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          const next = prev + 1;
          setTelemetryLog((logs) => [
            `Completed: ${steps[prev].code}`,
            `Initiating: ${steps[next].code}`,
            ...logs.slice(0, 4),
          ]);
          return next;
        }
        return prev;
      });
    }, 2800);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 98) {
          return prev + Math.floor(Math.random() * 3) + 1;
        }
        return 98;
      });
    }, 320);

    const wisdomInterval = setInterval(() => {
      setWisdomIndex((prev) => (prev + 1) % vedicWisdom.length);
    }, 4500);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearInterval(wisdomInterval);
    };
  }, [steps.length, vedicWisdom.length]);

  return (
    <div className="py-6 px-4 sm:px-6 max-w-6xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Banner & Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-purple-600/20 to-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em] shadow-lg shadow-amber-500/10"
        >
          <Orbit className="w-3.5 h-3.5 text-amber-400 animate-spin" />
          <span>Multimodal 3D Vision Profilometry Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </motion.div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-cinzel tracking-wide">
          Scanning Sacred <span className="text-antique-gold-shimmer">Palm Coordinates</span>
        </h2>

        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Calibrating volumetric laser sheets and optical LiDAR contours to map epidermal ridges, planetary mounts, and major Hast Rekha paths.
        </p>
      </div>

      {/* Main Grid: Left = 3D Laser Sheet Scanner, Right = Real-Time Processing HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 3D Holographic Laser Scanner (Framer Motion + CSS 3D) */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <PalmScanner3D
            palmImageUrl={palmImageUrl}
            isAnalyzing={true}
            dominantHand={dominantHand}
            showControls={true}
          />

          {/* Under-Scanner Quick Metrics */}
          <div className="w-full max-w-[520px] mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-[#090b1c]/80 border border-slate-800/80">
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Wavelength</span>
              <span className="text-xs font-bold text-amber-300 font-mono">532nm Gold</span>
            </div>
            <div className="p-2 rounded-xl bg-[#090b1c]/80 border border-slate-800/80">
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Micro-Relief</span>
              <span className="text-xs font-bold text-cyan-300 font-mono">0.02mm Res</span>
            </div>
            <div className="p-2 rounded-xl bg-[#090b1c]/80 border border-slate-800/80">
              <span className="block text-[9px] font-mono text-slate-400 uppercase">Dominance</span>
              <span className="text-xs font-bold text-purple-300 font-mono capitalize">{dominantHand} Hand</span>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Chiromancy HUD & Steps */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Progress Card with Smooth Motion Progress Bar */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0c102a] to-[#070918] border border-amber-500/30 shadow-xl shadow-purple-950/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Activity className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Neural Hast Rekha Core
                  </h4>
                  <p className="text-[10px] text-slate-400 font-mono">
                    STAGE {currentStep + 1} OF {steps.length} · 4096 DPI SENSOR
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono text-amber-300">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Glowing Motion Progress Bar */}
            <div className="relative w-full h-2.5 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-300 to-cyan-400 shadow-[0_0_15px_#f59e0b]"
                animate={{ width: `${progressPercent}%` }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
              />
            </div>

            {/* Active Telemetry Snippet */}
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Radio className="w-3 h-3 animate-ping" />
                <span>Sweeping laser fan across epidermal plane</span>
              </span>
              <span className="text-slate-500">LATENCY: 18ms</span>
            </div>
          </div>

          {/* Sequential Steps List */}
          <div className="space-y-2.5">
            {steps.map((s, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <motion.div
                  key={idx}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  className={`p-3.5 rounded-2xl border transition-all duration-500 flex items-start gap-3.5 ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500/15 via-[#0c102a] to-slate-900 border-amber-400/50 shadow-xl shadow-amber-500/10 text-white'
                      : isDone
                      ? 'bg-slate-900/50 border-slate-800 text-slate-400'
                      : 'bg-slate-950/30 border-slate-900/60 text-slate-600 opacity-60'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-xs font-bold shadow">
                        ✓
                      </span>
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400 flex items-center justify-center shadow-lg shadow-amber-400/30">
                        <Orbit className="w-3.5 h-3.5 animate-spin" />
                      </div>
                    ) : (
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center text-[10px] font-mono">
                        {idx + 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-semibold ${isCurrent ? 'text-amber-200 font-cinzel text-sm' : isDone ? 'text-slate-300' : 'text-slate-500'}`}>
                        {s.title}
                      </p>
                      {isCurrent && (
                        <span className="text-[9px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 animate-pulse">
                          PROCESSING
                        </span>
                      )}
                    </div>
                    {isCurrent && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[11px] text-slate-300 mt-1.5 leading-relaxed"
                      >
                        {s.detail}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Rotating Vedic Hast Rekha Wisdom Card */}
          <div className="p-4 rounded-2xl bg-[#080a1c] border border-amber-500/25 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400/80 block mb-1">
                  Hast Rekha Shastra Wisdom
                </span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={wisdomIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="text-xs text-slate-300 italic font-serif leading-relaxed"
                  >
                    {vedicWisdom[wisdomIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Security & Privacy Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Encrypted 3D stream · Zero biometric retention without consent</span>
            </span>
            <span className="font-mono text-slate-500 text-[10px]">HAST_REKHA_3D_V3</span>
          </div>

        </div>

      </div>

    </div>
  );
};
