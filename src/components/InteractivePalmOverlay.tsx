import React, { useState, useRef } from 'react';
import { MajorLine, Mount } from '../types/palm';
import { Eye, EyeOff, Layers, Download, Sparkles, Info, Sliders, Scan, Orbit } from 'lucide-react';

interface InteractivePalmOverlayProps {
  imageUrl: string;
  majorLines: MajorLine[];
  mounts: Mount[];
  dominantHand: 'left' | 'right';
}

type PalmImageFilter = 'natural' | 'enhanced' | 'monochrome' | 'celestial' | 'inkprint';

export const InteractivePalmOverlay: React.FC<InteractivePalmOverlayProps> = ({
  imageUrl,
  majorLines,
  mounts,
  dominantHand,
}) => {
  const [activeLineId, setActiveLineId] = useState<string | null>(null);
  const [visibleLines, setVisibleLines] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    majorLines.forEach((l) => (initial[l.id] = true));
    initial['mounts'] = true;
    return initial;
  });
  const [glowIntensity, setGlowIntensity] = useState<number>(0.9);
  const [showMounts, setShowMounts] = useState<boolean>(true);
  const [imageFilter, setImageFilter] = useState<PalmImageFilter>('natural');
  const [is3DMode, setIs3DMode] = useState<boolean>(false);
  const [tilt, setTilt] = useState({ x: 5, y: -5 });
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLine = (id: string) => {
    setVisibleLines((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAll = (visible: boolean) => {
    const updated: Record<string, boolean> = {};
    majorLines.forEach((l) => (updated[l.id] = visible));
    updated['mounts'] = visible;
    setVisibleLines(updated);
    setShowMounts(visible);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is3DMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
    const y = ((e.clientX - rect.left) / rect.width - 0.5) * 22;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    if (is3DMode) setTilt({ x: 5, y: -5 });
  };

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

  const activeLine = majorLines.find((l) => l.id === activeLineId);

  // Compute CSS filter string for palm image
  const getFilterStyle = () => {
    switch (imageFilter) {
      case 'enhanced':
        return 'contrast(1.4) brightness(0.95) saturate(1.1)';
      case 'monochrome':
        return 'grayscale(1) contrast(1.4) brightness(0.9)';
      case 'celestial':
        return 'hue-rotate(220deg) contrast(1.25) brightness(0.9)';
      case 'inkprint':
        return 'grayscale(1) contrast(2.8) brightness(1.05) sepia(0.2)';
      default:
        return 'none';
    }
  };

  // Download snapshot with lines overlaid
  const handleExportAnnotatedPalm = () => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 1000;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Apply filter if selected
      ctx.filter = getFilterStyle();
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      ctx.filter = 'none';

      // Draw active lines
      majorLines.forEach((line) => {
        if (!visibleLines[line.id] || !line.coordinates || line.coordinates.length < 2) return;
        ctx.strokeStyle = line.color || '#fbbf24';
        ctx.lineWidth = Math.max(4, canvas.width * 0.007);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = line.color || '#fbbf24';
        ctx.shadowBlur = 15;

        ctx.beginPath();
        line.coordinates.forEach((pt, idx) => {
          const px = (pt.x / 100) * canvas.width;
          const py = (pt.y / 100) * canvas.height;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.stroke();
      });

      // Export canvas
      const link = document.createElement('a');
      link.download = `Palmora_AI_${dominantHand}_palm_lines.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
  };

  return (
    <div className="bg-[#080a1c] rounded-3xl border border-amber-500/25 p-4 sm:p-6 shadow-2xl relative">
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
              Interactive Palm-Line Tracer
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Click on any line to highlight and inspect authentic Hast Rekha interpretations
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
          {/* 3D Holographic Perspective Toggle */}
          <button
            onClick={() => setIs3DMode(!is3DMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
              is3DMode
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 font-bold'
                : 'bg-slate-900 hover:bg-slate-800 text-amber-300 border-amber-500/30'
            }`}
          >
            <Scan className="w-3.5 h-3.5" />
            <span>{is3DMode ? '3D Hologram: ON' : '3D Hologram: OFF'}</span>
          </button>

          {/* Image Line Enhancement Filter */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <select
              value={imageFilter}
              onChange={(e) => setImageFilter(e.target.value as PalmImageFilter)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="natural" className="bg-slate-900">Natural Light</option>
              <option value="enhanced" className="bg-slate-900">Line Contrast</option>
              <option value="monochrome" className="bg-slate-900">Monochrome Chiromancy</option>
              <option value="inkprint" className="bg-slate-900">Ayurvedic Ink Print</option>
              <option value="celestial" className="bg-slate-900">Celestial Glow</option>
            </select>
          </div>

          {/* Opacity slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <span>Glow:</span>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={glowIntensity}
              onChange={(e) => setGlowIntensity(parseFloat(e.target.value))}
              className="w-16 sm:w-20 accent-amber-400 cursor-pointer"
            />
          </div>

          <button
            onClick={() => toggleAll(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            Show All
          </button>
          <button
            onClick={() => toggleAll(false)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-800 transition-colors cursor-pointer"
          >
            Hide All
          </button>
          <button
            onClick={handleExportAnnotatedPalm}
            title="Download Palm with glowing lines"
            className="px-3 py-1.5 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-xs text-amber-200 border border-amber-400/40 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save Image</span>
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        
        {/* Palm Canvas Frame with optional 3D Holographic Perspective Tilt */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className={`lg:col-span-7 flex justify-center ${is3DMode ? 'perspective-1500 cursor-crosshair' : ''}`}
        >
          <div
            ref={containerRef}
            style={
              is3DMode
                ? {
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                    transition: 'transform 0.15s ease-out',
                  }
                : undefined
            }
            className={`relative w-full max-w-[480px] aspect-[4/5] rounded-3xl overflow-hidden border border-amber-500/35 shadow-2xl bg-slate-950 group select-none ${
              is3DMode ? 'preserve-3d shadow-purple-950/70' : ''
            }`}
          >
            {/* The Raw Palm Image with optional filter */}
            <img
              src={imageUrl}
              alt="Analyzed Palm"
              style={{ filter: getFilterStyle() }}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* 3D Holographic Grid & Laser Scanning Animation when 3D mode is active */}
            {is3DMode && (
              <>
                <div className="absolute inset-0 hologram-grid opacity-30 mix-blend-screen pointer-events-none" />
                
                {/* 3D Laser Scanning Beam */}
                <div className="absolute left-0 right-0 h-24 pointer-events-none animate-laser-3d z-20">
                  <div className="w-full h-10 bg-gradient-to-b from-transparent to-amber-400/25" />
                  <div className="w-full h-[2.5px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_18px_#f59e0b,0_0_30px_#fbbf24]" />
                  <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_10px_#06b6d4] mt-[1px]" />
                  <div className="w-full h-8 bg-gradient-to-b from-amber-400/20 to-transparent" />
                </div>
              </>
            )}

            {/* SVG Visualizer Overlay */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className={`absolute inset-0 w-full h-full pointer-events-auto ${is3DMode ? 'translate-z-24' : ''}`}
              style={{ opacity: glowIntensity }}
            >
              <defs>
                <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Render Major Lines */}
              {majorLines.map((line) => {
                if (!visibleLines[line.id]) return null;
                const pathD = makeSmoothPath(line.coordinates);
                const isSelected = activeLineId === line.id;

                return (
                  <g key={line.id} className="cursor-pointer" onClick={() => setActiveLineId(line.id)}>
                    {/* Wider transparent stroke for easier hover/click target */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="transparent"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />

                    {/* Outer ambient glow path */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={line.color || '#eab308'}
                      strokeWidth={isSelected ? '2.8' : '1.8'}
                      strokeOpacity={isSelected ? '0.6' : '0.35'}
                      strokeLinecap="round"
                      filter="url(#glow-gold)"
                    />

                    {/* Core crisp line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isSelected ? '#ffffff' : line.color || '#eab308'}
                      strokeWidth={isSelected ? '1.4' : '0.9'}
                      strokeLinecap="round"
                      strokeDasharray={line.clarity.toLowerCase().includes('broken') ? '1, 1' : 'none'}
                    />

                    {/* First point indicator */}
                    {line.coordinates?.[0] && (
                      <circle
                        cx={line.coordinates[0].x}
                        cy={line.coordinates[0].y}
                        r={isSelected ? '1.5' : '1'}
                        fill={line.color}
                        stroke="#ffffff"
                        strokeWidth="0.4"
                      />
                    )}
                  </g>
                );
              })}

              {/* Render Mounts */}
              {showMounts &&
                visibleLines['mounts'] &&
                mounts.map((mount, index) => (
                  <g key={index} className="cursor-pointer">
                    <circle
                      cx={mount.location.x}
                      cy={mount.location.y}
                      r="1.8"
                      fill="#eab308"
                      fillOpacity="0.25"
                      stroke="#fbbf24"
                      strokeWidth="0.5"
                    />
                    <circle
                      cx={mount.location.x}
                      cy={mount.location.y}
                      r="0.7"
                      fill="#ffffff"
                    />
                  </g>
                ))}
            </svg>

            {/* Hand orientation tag & HUD */}
            <div className="absolute top-3 left-3 px-3 py-1 rounded-md bg-slate-950/85 backdrop-blur-sm border border-amber-400/30 text-[11px] font-mono font-medium text-amber-300 flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>{dominantHand === 'right' ? 'Right Palm (Active)' : 'Left Palm (Blueprint)'}</span>
            </div>

            {is3DMode && (
              <div className="absolute bottom-3 left-3 right-3 text-center text-[10px] font-mono text-amber-300/90 bg-slate-950/80 px-2 py-1 rounded-lg border border-amber-500/30 pointer-events-none">
                ✦ Move cursor over palm to tilt 3D spatial contours
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Interactive Line Legend & Selected Line Details */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Line Selectors Container */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <p className="text-xs font-semibold text-slate-300 mb-2.5 uppercase tracking-wider">
              Select Line to Trace & Read
            </p>
            <div className="flex flex-wrap gap-2">
              {majorLines.map((line) => {
                const isSelected = activeLineId === line.id;
                const isVis = visibleLines[line.id];
                return (
                  <div
                    key={line.id}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 border-amber-300 font-semibold shadow-md shadow-amber-500/20'
                        : isVis
                        ? 'bg-slate-800/90 text-slate-200 border-slate-700 hover:border-slate-500'
                        : 'bg-slate-950/40 text-slate-500 border-slate-800 hover:text-slate-400'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setActiveLineId(line.id);
                        if (!isVis) toggleLine(line.id);
                      }}
                      className="flex items-center gap-2 cursor-pointer focus:outline-none"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: line.color }}
                      />
                      <span>{line.name}</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLine(line.id);
                      }}
                      className="text-slate-400 hover:text-white p-0.5 ml-0.5 cursor-pointer rounded focus:outline-none"
                      title={isVis ? `Hide ${line.name}` : `Show ${line.name}`}
                    >
                      {isVis ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() => setShowMounts(!showMounts)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border cursor-pointer ${
                  showMounts
                    ? 'bg-purple-900/40 text-purple-200 border-purple-500/40'
                    : 'bg-slate-950/40 text-slate-500 border-slate-800'
                }`}
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>Planetary Mounts ({mounts.length})</span>
              </button>
            </div>
          </div>

          {/* Active Line Detail Card */}
          {activeLine ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900/90 via-[#0a0d24] to-slate-900 border border-amber-500/30 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: activeLine.color }}
                  />
                  <div>
                    <h4 className="text-base font-bold text-white font-cinzel">
                      {activeLine.name}
                    </h4>
                    <p className="text-xs text-amber-300/80">{activeLine.sanskritName}</p>
                  </div>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-medium">
                  {activeLine.clarity}
                </span>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-slate-300">
                <div>
                  <span className="font-semibold text-slate-400 block mb-0.5">Observed Path:</span>
                  <p>{activeLine.pathDescription}</p>
                </div>

                <div>
                  <span className="font-semibold text-amber-300 block mb-0.5">Traditional Meaning:</span>
                  <p className="text-slate-200 leading-normal">{activeLine.traditionalMeaning}</p>
                </div>

                {activeLine.specialMarkings && activeLine.specialMarkings.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80">
                    <span className="font-semibold text-purple-300 block mb-1">Notable Signs & Marks:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeLine.specialMarkings.map((mark, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-[10px] text-purple-200 font-medium"
                        >
                          ✦ {mark}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-center flex flex-col items-center justify-center min-h-[180px]">
              <Info className="w-6 h-6 text-slate-500 mb-2" />
              <p className="text-xs text-slate-400">
                Tap on any line pill or trace on the palm image above to inspect its traditional Hast Rekha significance.
              </p>
            </div>
          )}

          {/* Mounts Quick View if enabled */}
          {showMounts && mounts.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 max-h-[160px] overflow-y-auto">
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Planetary Mounts Detected
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {mounts.slice(0, 4).map((m, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                    <p className="font-medium text-amber-300">{m.name}</p>
                    <p className="text-[10px] text-slate-400">{m.prominence} development</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
