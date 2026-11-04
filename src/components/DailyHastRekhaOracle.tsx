import React, { useState } from 'react';
import { Sun, Moon, Flame, Wind, Mountain, Droplet, Sparkles, Orbit, Compass } from 'lucide-react';

interface PlanetaryDayInfo {
  planet: string;
  sanskritName: string;
  rulingMount: string;
  mountLocation: string;
  color: string;
  mudra: string;
  mudraBenefit: string;
  elementFocus: string;
  affirmation: string;
}

const PLANETARY_DAYS: Record<number, PlanetaryDayInfo> = {
  0: { // Sunday
    planet: 'Sun (Surya)',
    sanskritName: 'Ravivar · Solar Radiance',
    rulingMount: 'Mount of Apollo / Sun',
    mountLocation: 'Base of Ring Finger',
    color: '#f59e0b',
    mudra: 'Surya Mudra (Fire & Metabolism)',
    mudraBenefit: 'Enhances energy, courage, and radiant self-confidence.',
    elementFocus: 'Fire & Vitality',
    affirmation: 'I channel radiant clarity, creative mastery, and authentic warmth into all my endeavors.',
  },
  1: { // Monday
    planet: 'Moon (Chandra)',
    sanskritName: 'Somavar · Lunar Intuition',
    rulingMount: 'Mount of Moon (Luna)',
    mountLocation: 'Lower percussion of the palm opposite thumb',
    color: '#a78bfa',
    mudra: 'Varun Mudra (Water & Mental Peace)',
    mudraBenefit: 'Balances emotional fluctuations and sharpens intuitive dreams.',
    elementFocus: 'Water & Emotional Flow',
    affirmation: 'My intuition is a calm, deep reservoir of timeless wisdom and gentle empathy.',
  },
  2: { // Tuesday
    planet: 'Mars (Mangal)',
    sanskritName: 'Mangalvar · Courage & Will',
    rulingMount: 'Mount of Mars (Plain of Mars)',
    mountLocation: 'Central plain and lower thumb junction',
    color: '#ef4444',
    mudra: 'Prana Mudra (Life Force Activation)',
    mudraBenefit: 'Fortifies inner stamina, moral courage, and decisive action.',
    elementFocus: 'Active Drive & Perseverance',
    affirmation: 'I act with courageous calm, overcoming obstacles through disciplined persistence.',
  },
  3: { // Wednesday
    planet: 'Mercury (Budha)',
    sanskritName: 'Budhavar · Eloquence & Commerce',
    rulingMount: 'Mount of Mercury',
    mountLocation: 'Base of Pinky Finger',
    color: '#06b6d4',
    mudra: 'Gyan Mudra (Intellect & Focus)',
    mudraBenefit: 'Stimulates razor-sharp articulation, commercial wit, and learning.',
    elementFocus: 'Air & Communication',
    affirmation: 'My words build bridges of understanding, honest enterprise, and lucid wisdom.',
  },
  4: { // Thursday
    planet: 'Jupiter (Guru / Brihaspati)',
    sanskritName: 'Guruvar · Expansion & Dignity',
    rulingMount: 'Mount of Jupiter',
    mountLocation: 'Base of Index Finger',
    color: '#eab308',
    mudra: 'Vayu Mudra (Wisdom & Expansion)',
    mudraBenefit: 'Calms anxious restlessness and inspires visionary leadership.',
    elementFocus: 'Ether & Moral Authority',
    affirmation: 'I guide others with generosity of spirit, humble dignity, and noble purpose.',
  },
  5: { // Friday
    planet: 'Venus (Shukra)',
    sanskritName: 'Shukravar · Harmony & Beauty',
    rulingMount: 'Mount of Venus',
    mountLocation: 'Base of Thumb',
    color: '#ec4899',
    mudra: 'Hridaya Mudra (Heart Compassion)',
    mudraBenefit: 'Deepens emotional capacity, romantic sweetness, and artistic joy.',
    elementFocus: 'Love & Aesthetic Harmony',
    affirmation: 'I cultivate beauty, heartfelt gratitude, and harmonious relationships today.',
  },
  6: { // Saturday
    planet: 'Saturn (Shani)',
    sanskritName: 'Shanivar · Structure & Patience',
    rulingMount: 'Mount of Saturn',
    mountLocation: 'Base of Middle Finger',
    color: '#8b5cf6',
    mudra: 'Shuni Mudra (Patience & Discipline)',
    mudraBenefit: 'Cultivates endurance, structural focus, and karmic discernment.',
    elementFocus: 'Earth & Stability',
    affirmation: 'I embrace patient discipline; every intentional step builds an unshakeable foundation.',
  },
};

export const DailyHastRekhaOracle: React.FC = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  const todayData = PLANETARY_DAYS[dayIndex] || PLANETARY_DAYS[0];

  const [userElement, setUserElement] = useState<'Fire' | 'Water' | 'Air' | 'Earth'>('Fire');

  const elementAdvice: Record<string, string> = {
    Fire: 'Channel today’s planetary energy into focused creation. Avoid impulsive rushes; allow natural momentum to carry your vision.',
    Water: 'Protect your emotional boundaries while honoring your deep instincts. Spend time near quiet contemplation or gentle hydration.',
    Air: 'Synthesize your ideas into tangible written notes. Share your concepts with collaborators who appreciate nuanced intellect.',
    Earth: 'Ground today’s inspiration into physical systems. Focus on step-by-step progress, decluttering, and bodily nourishment.',
  };

  return (
    <section id="daily-oracle" className="py-16 relative bg-[#060818]/80 border-t border-amber-500/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <Orbit className="w-3.5 h-3.5 text-amber-400" />
            Vedic Planetary Alignment
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
            Daily Hast Rekha <span className="text-antique-gold-shimmer">Transit Oracle</span>
          </h2>
          <p className="text-slate-300 text-sm mt-1.5 leading-relaxed">
            Ancient chiromancy aligns each day of the week with an active planetary mount and palm prana center
          </p>
        </div>

        {/* Today's Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a0d26] to-slate-900/90 border border-amber-500/30 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                {today.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
                {todayData.sanskritName}
              </h3>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-700 text-xs text-slate-300">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: todayData.color }} />
              <span>Ruling Mount: <strong>{todayData.rulingMount}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Mount Highlight */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block">
                Active Palm Mount Center
              </span>
              <p className="text-sm font-semibold text-white font-cinzel">
                {todayData.rulingMount}
              </p>
              <p className="text-xs text-slate-400">
                Location: {todayData.mountLocation}
              </p>
            </div>

            {/* Sacred Mudra */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 block">
                Harmonizing Hand Mudra
              </span>
              <p className="text-sm font-semibold text-white font-cinzel">
                {todayData.mudra}
              </p>
              <p className="text-xs text-slate-400">
                {todayData.mudraBenefit}
              </p>
            </div>

            {/* Elemental Focus */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 block">
                Planetary Focus
              </span>
              <p className="text-sm font-semibold text-white font-cinzel">
                {todayData.elementFocus}
              </p>
              <p className="text-xs text-slate-400">
                Best for strategic planning, creative balance, and noble action.
              </p>
            </div>
          </div>

          {/* Daily Palm Affirmation */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">
              Today's Sacred Chiromancy Affirmation
            </span>
            <p className="text-sm italic font-serif text-amber-200">
              "{todayData.affirmation}"
            </p>
          </div>

          {/* Tailor by Hand Element */}
          <div className="pt-2 border-t border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Your Hand Element for Tailored Daily Advice:
              </span>
              <div className="flex items-center gap-1.5">
                {(['Fire', 'Water', 'Air', 'Earth'] as const).map((el) => (
                  <button
                    key={el}
                    onClick={() => setUserElement(el)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      userElement === el
                        ? 'bg-amber-400 text-slate-950 font-semibold shadow'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {el}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-amber-300 mr-1.5">{userElement} Hand Advice Today:</span>
              <span>{elementAdvice[userElement]}</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
