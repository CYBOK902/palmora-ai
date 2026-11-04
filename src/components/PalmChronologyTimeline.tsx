import React, { useState } from 'react';
import { Calendar, Compass, Sparkles, Milestone, ArrowRight } from 'lucide-react';

interface ChronologyPhase {
  minAge: number;
  maxAge: number;
  title: string;
  sanskritStage: string;
  lifeLineFocus: string;
  fateLineFocus: string;
  advice: string;
}

const CHRONOLOGY_STAGES: ChronologyPhase[] = [
  {
    minAge: 18,
    maxAge: 24,
    title: 'Youth & Foundation Forge',
    sanskritStage: 'Brahmacharya / Arising Prana',
    lifeLineFocus: 'Upper arc of Life Line emerging near Jupiter mount. High vitality exploration and emotional learning curves.',
    fateLineFocus: 'Early Fate Line roots forming; foundational education, identity crystallization, and testing ambitions.',
    advice: 'Cultivate intellectual discipline and resist premature disillusionment. Every skill learned now compounds tenfold later.',
  },
  {
    minAge: 25,
    maxAge: 32,
    title: 'Vocation Ascent & Sacred Bonds',
    sanskritStage: 'Grihastha Ascent',
    lifeLineFocus: 'Mid-sweep of Life Line around Venus. Peak reproductive and physical prana flow; major relocations or partnerships.',
    fateLineFocus: 'Fate Line gains independent velocity; breakthrough professional recognition and emergence of entrepreneurial appetite.',
    advice: 'Anchor yourself in trustworthy companions and mentors. Build sustainable daily habits before scaling external commitments.',
  },
  {
    minAge: 33,
    maxAge: 42,
    title: 'The Great Convergence (Head-Fate Crossroad)',
    sanskritStage: 'Siddhi Convergence',
    lifeLineFocus: 'Deep central contour of the Life Line. Testing of emotional resilience and physical work-rest boundaries.',
    fateLineFocus: 'Fate Line intersects the Head Line (Mastak Rekha). The most critical turning point in Hast Rekha: decisions now determine mid-life wealth.',
    advice: 'Filter out societal noise and align career with authentic dharma. The Dhan Yoga money triangle activates through focused mastery.',
  },
  {
    minAge: 43,
    maxAge: 55,
    title: 'Mastery, Authority & Sun Line Glow',
    sanskritStage: 'Vanaprastha Preparation',
    lifeLineFocus: 'Lower arch of Life Line wrapping the base of Venus. Steady, mature stamina; transition from physical force to intellectual wisdom.',
    fateLineFocus: 'Fate Line approaches the Mount of Saturn, joined by the Sun Line (Surya). Peak public reputation and mentorship authority.',
    advice: 'Shift from proving competence to building enduring systems and guiding younger successors. Your reputation precedes your effort.',
  },
  {
    minAge: 56,
    maxAge: 75,
    title: 'Sagehood, Legacy & Spiritual Peace',
    sanskritStage: 'Sannyasa Harmony',
    lifeLineFocus: 'Base curve anchoring at the wrist Rascette bracelets. Philosophical serenity, longevity grace, and holistic wellness.',
    fateLineFocus: 'Mature apex on Saturn. Deep contentment with life’s completed tapestry, ancestral peace, and legacy transmission.',
    advice: 'Honor your journey with gratitude. Share accumulated life wisdom and celebrate the freedom that comes with spiritual detachment.',
  },
];

export const PalmChronologyTimeline: React.FC = () => {
  const [selectedAge, setSelectedAge] = useState<number>(30);

  const currentStage =
    CHRONOLOGY_STAGES.find((s) => selectedAge >= s.minAge && selectedAge <= s.maxAge) ||
    CHRONOLOGY_STAGES[1];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-amber-500/20 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-cinzel">
              Hast Rekha <span className="text-antique-gold">Age Chronology Timeline</span>
            </h3>
            <p className="text-xs text-slate-400">
              Drag the age marker to explore your corresponding palm line chapter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold">
          <span>Current Target:</span>
          <span className="text-sm font-bold font-cinzel text-white">Age {selectedAge}</span>
        </div>
      </div>

      {/* Slider Control */}
      <div className="space-y-2 pt-2">
        <div className="flex justify-between text-[11px] font-semibold text-slate-400 px-1">
          <span>Age 18</span>
          <span>Age 28</span>
          <span>Age 38</span>
          <span>Age 50</span>
          <span>Age 65+</span>
        </div>

        <input
          type="range"
          min="18"
          max="72"
          step="1"
          value={selectedAge}
          onChange={(e) => setSelectedAge(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
        />

        {/* Milestone Tick Marks */}
        <div className="flex justify-between text-[10px] text-slate-500 px-1 pt-0.5">
          <span>Foundations</span>
          <span>Ascent</span>
          <span className="text-amber-400 font-medium">Head-Fate Crossing</span>
          <span>Sun Radiance</span>
          <span>Legacy</span>
        </div>
      </div>

      {/* Active Stage Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0b0e27] to-slate-900 border border-amber-500/30 space-y-4 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400">
              {currentStage.sanskritStage} (Ages {currentStage.minAge}–{currentStage.maxAge})
            </span>
            <h4 className="text-lg font-bold text-white font-cinzel">
              {currentStage.title}
            </h4>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 self-start sm:self-auto">
            Viewing Age {selectedAge}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-1">
            <span className="text-xs font-semibold text-emerald-400 block">
              Life Line (Jeevan Rekha) at Age {selectedAge}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStage.lifeLineFocus}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-purple-500/20 space-y-1">
            <span className="text-xs font-semibold text-purple-400 block">
              Fate Line (Bhagya Rekha) at Age {selectedAge}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentStage.fateLineFocus}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 leading-relaxed">
          <span className="font-semibold text-amber-300 block mb-1">
            ✦ Classical Hast Rekha Guidance for this Chapter:
          </span>
          <p>{currentStage.advice}</p>
        </div>
      </div>

    </div>
  );
};
