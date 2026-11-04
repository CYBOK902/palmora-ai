import React, { useState } from 'react';
import { TRADITIONAL_LINES, PLANETARY_MOUNTS } from '../data/hastRekhaData';
import { BookOpen, Sparkles, Orbit, Compass, ChevronRight } from 'lucide-react';

export const HastRekhaEncyclopedia: React.FC = () => {
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'lines' | 'mounts'>('lines');

  const currentLine = TRADITIONAL_LINES[activeLineIndex];

  return (
    <section id="hast-rekha-guide" className="py-20 relative bg-[#060818]/60 border-t border-amber-500/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-cyan-400 font-semibold mb-2">
            ANCIENT KNOWLEDGE BASE
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-cinzel">
            Hast Rekha <span className="text-antique-gold-shimmer">Wisdom Guide</span>
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Explore the traditional principles governing the sacred palm lines and planetary mounts
          </p>

          {/* Toggle between Lines and Mounts */}
          <div className="inline-flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-full mt-6">
            <button
              onClick={() => setViewMode('lines')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'lines'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              The 6 Major Lines
            </button>
            <button
              onClick={() => setViewMode('mounts')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === 'mounts'
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              The 7 Planetary Mounts
            </button>
          </div>
        </div>

        {viewMode === 'lines' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Line Navigation */}
            <div className="lg:col-span-5 space-y-2">
              {TRADITIONAL_LINES.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                return (
                  <div
                    key={line.id}
                    onClick={() => setActiveLineIndex(idx)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-slate-900 border-amber-400/50 shadow-lg shadow-amber-500/10'
                        : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: line.elementColor }}
                      />
                      <div>
                        <h4 className="text-sm font-semibold text-white font-cinzel">
                          {line.name}
                        </h4>
                        <p className="text-xs text-slate-400">{line.hindiName}</p>
                      </div>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isActive ? 'text-amber-400 translate-x-1' : 'text-slate-600'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Right Column: Deep Line Inspection */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-amber-500/30 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentLine.elementColor }}
                  />
                  <div>
                    <h3 className="text-2xl font-bold text-white font-cinzel">
                      {currentLine.name}
                    </h3>
                    <p className="text-sm text-amber-300 font-medium">
                      {currentLine.hindiName}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                  Classical Anatomical Location
                </span>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {currentLine.description}
                </p>
              </div>

              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                  Core Chiromantic Significance
                </span>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {currentLine.significance}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 block mb-3">
                  Traditional Hast Rekha Formations
                </span>
                <div className="space-y-2.5">
                  {currentLine.traditionalRules.map((rule, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5"
                    >
                      <span className="text-amber-400 font-bold">✦</span>
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* Mounts Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLANETARY_MOUNTS.map((m, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#090b1c] border border-slate-800 hover:border-amber-500/30 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Planet {m.planet}
                  </span>
                  <Orbit className="w-4 h-4 text-slate-500" />
                </div>
                <h4 className="text-lg font-bold text-white font-cinzel">
                  {m.name}
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {m.meaning}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
