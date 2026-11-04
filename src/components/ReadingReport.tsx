import React, { useState } from 'react';
import { PalmReading } from '../types/palm';
import { InteractivePalmOverlay } from './InteractivePalmOverlay';
import { AudioReadingPlayer } from './AudioReadingPlayer';
import { PalmChronologyTimeline } from './PalmChronologyTimeline';
import { ShareReadingModal } from './ShareReadingModal';
import {
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  Activity,
  Compass,
  Printer,
  Copy,
  Check,
  RefreshCw,
  Flame,
  Droplet,
  Mountain,
  Wind,
  ShieldAlert,
  HeartHandshake,
  Share2,
  Milestone,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReadingReportProps {
  reading: PalmReading;
  imageUrl: string;
  dominantHand: 'left' | 'right';
  onReset: () => void;
  onOpenCompatibility: () => void;
}

export const ReadingReport: React.FC<ReadingReportProps> = ({
  reading,
  imageUrl,
  dominantHand,
  onReset,
  onOpenCompatibility,
}) => {
  const [activeTab, setActiveTab] = useState<
    'personality' | 'love' | 'career' | 'wealth' | 'health' | 'destiny' | 'comparison' | 'timeline'
  >('personality');
  const [copied, setCopied] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Trigger celebration confetti on mount
  React.useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#eab308', '#a855f7', '#06b6d4'],
      });
    } catch {
      // ignore
    }
  }, []);

  const handleCopySummary = () => {
    const summaryText = `Palmora AI Palm Reading Summary:
Element: ${reading.handShape.element} Hand (${reading.handShape.temperament})
Dominant Hand: ${dominantHand.toUpperCase()}
Blessing: "${reading.blessingQuote}"

Personality: ${reading.personality.summary}
Love & Marriage: ${reading.loveAndRelationships.summary}
Career & Ambition: ${reading.careerAndAmbition.summary}
Wealth & Money Triangle: ${reading.wealthAndProsperity.summary}
Vitality: ${reading.healthAndVitality.summary}
Destiny: ${reading.destinyAndSpirituality.summary}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const getElementIcon = (element: string) => {
    const el = element.toLowerCase();
    if (el.includes('fire')) return <Flame className="w-5 h-5 text-amber-500" />;
    if (el.includes('water')) return <Droplet className="w-5 h-5 text-cyan-400" />;
    if (el.includes('earth')) return <Mountain className="w-5 h-5 text-emerald-400" />;
    return <Wind className="w-5 h-5 text-purple-400" />;
  };

  const fullNarrationText = `Your palm reveals an ${reading.handShape.element} Hand archetype with a ${reading.handShape.temperament} temperament. ${reading.personality.summary} In love, ${reading.loveAndRelationships.summary} In your career, ${reading.careerAndAmbition.summary} Your wealth indicators show ${reading.wealthAndProsperity.summary} Your vitality prana energy reflects ${reading.healthAndVitality.summary} Remember the ancient Vedic proverb: ${reading.blessingQuote}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-10 animate-fadeIn">
      
      {/* Top Controls & Print Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 no-print">
        <div>
          <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
            Hast Rekha Shastra · Chiromancy Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-cinzel">
            Your Personalized <span className="text-antique-gold-shimmer">Palm Report</span>
          </h2>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400/20 to-purple-500/20 hover:from-amber-400/30 hover:to-purple-500/30 text-xs font-semibold text-amber-200 border border-amber-400/40 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5 text-amber-300" />
            <span>Share Card</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Summary Copied!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Print / PDF</span>
          </button>

          <button
            onClick={onReset}
            className="px-4 py-2 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-xs font-semibold text-amber-200 border border-amber-400/40 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another</span>
          </button>
        </div>
      </div>

      {/* Interactive Line Tracer Feature */}
      <div className="no-print">
        <InteractivePalmOverlay
          imageUrl={imageUrl}
          majorLines={reading.majorLines}
          mounts={reading.mounts}
          dominantHand={dominantHand}
        />
      </div>

      {/* Audio Narration Feature */}
      <div className="no-print">
        <AudioReadingPlayer
          textToRead={fullNarrationText}
          title="Your Palmora Reading"
        />
      </div>

      {/* Elemental Hand Archetype Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-[#0d1028] to-slate-900/90 border border-amber-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-lg">
              {getElementIcon(reading.handShape.element)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl sm:text-2xl font-bold text-white">
                  {reading.handShape.element} Hand Archetype
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 font-medium">
                  {dominantHand === 'right' ? 'Right (Dominant)' : 'Left (Dominant)'}
                </span>
              </div>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                {reading.handShape.temperament}
              </p>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {reading.handShape.description}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-right max-w-xs self-stretch md:self-auto flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
              Ancient Hast Rekha Proverb
            </span>
            <p className="text-xs italic text-amber-200/90 font-serif">
              "{reading.blessingQuote}"
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation for 7 Dimensions + Timeline */}
      <div className="border-b border-slate-800 flex items-center gap-2 overflow-x-auto pb-2 no-print">
        <button
          onClick={() => setActiveTab('personality')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'personality'
              ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Personality & Archetype</span>
        </button>

        <button
          onClick={() => setActiveTab('love')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'love'
              ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Love & Marriage</span>
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'career'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Career & Milestones</span>
        </button>

        <button
          onClick={() => setActiveTab('wealth')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'wealth'
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Wealth & Dhan Yoga</span>
        </button>

        <button
          onClick={() => setActiveTab('health')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'health'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Vitality & Prana</span>
        </button>

        <button
          onClick={() => setActiveTab('destiny')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'destiny'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Destiny & Signs</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'timeline'
              ? 'bg-gradient-to-r from-amber-400 to-purple-500 text-slate-950 shadow-md shadow-purple-500/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Milestone className="w-4 h-4" />
          <span>Age Chronology (18–75)</span>
        </button>

        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'comparison'
              ? 'bg-slate-200 text-slate-950 shadow-md shadow-slate-200/20'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <span>Dual Hand Karma</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="space-y-8">
        
        {/* Tab 1: Personality */}
        {activeTab === 'personality' && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-amber-500/20">
              <h3 className="text-xl font-bold text-white font-cinzel mb-3">
                Core Personality Matrix
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {reading.personality.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
                {/* Core Traits */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs uppercase font-semibold text-amber-300 tracking-wider block mb-2.5">
                    Defining Traits
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {reading.personality.coreTraits.map((trait, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-amber-400">✦</span>
                        <span>{trait}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Natural Strengths */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs uppercase font-semibold text-emerald-400 tracking-wider block mb-2.5">
                    Natural Strengths
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {reading.personality.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-emerald-400">✓</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Growth Areas */}
                <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <span className="text-xs uppercase font-semibold text-purple-400 tracking-wider block mb-2.5">
                    Growth & Evolution
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {reading.personality.growthAreas.map((g, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="text-purple-400">◆</span>
                        <span>{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-slate-900/40 border border-slate-800">
                <span className="text-xs font-semibold text-cyan-300 block mb-1">
                  Communication & Social Flow
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.personality.communicationStyle}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Love & Marriage */}
        {activeTab === 'love' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-rose-500/20 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-xl font-bold text-white font-cinzel">
                  Love, Emotional Harmony & Marriage Lines
                </h3>
                <p className="text-xs text-rose-300">Derived from Hridaya Rekha & Vivah Rekha</p>
              </div>
              <button
                onClick={onOpenCompatibility}
                className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Test Compatibility</span>
              </button>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {reading.loveAndRelationships.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 block">
                  Romantic Temperament
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.loveAndRelationships.romanticNature}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-pink-400 block">
                  Marriage & Commitment Indications
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.loveAndRelationships.marriageIndication}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-400 block">
                  Relationship Dynamics & Tendencies
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.loveAndRelationships.relationshipPatterns}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                  Hast Rekha Advice for Harmony
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.loveAndRelationships.adviceForHarmony}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Career & Ambition */}
        {activeTab === 'career' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-purple-500/20 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Career, Vocation & Life Milestones
              </h3>
              <p className="text-xs text-purple-300">Governed by Fate Line (Bhagya) & Jupiter Mount</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {reading.careerAndAmbition.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-2">
                  Leadership Style
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.careerAndAmbition.leadershipQuality}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 block mb-2">
                  Business vs Employment
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.careerAndAmbition.businessVsEmployment}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-2">
                  Milestone Turning Points
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.careerAndAmbition.peakAges}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-3">
                Naturally Aligned Professional Fields
              </span>
              <div className="flex flex-wrap gap-2">
                {reading.careerAndAmbition.suitableFields.map((field, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 font-medium"
                  >
                    ✦ {field}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Wealth & Dhan Yoga */}
        {activeTab === 'wealth' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-amber-500/20 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Wealth, Dhan Yoga & Prosperity Markers
              </h3>
              <p className="text-xs text-amber-300">Examining the Sacred Money Triangle & Sun Line</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {reading.wealthAndProsperity.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Money Triangle Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 mb-1">
                  <Coins className="w-5 h-5" />
                  <span className="text-sm font-bold font-cinzel">Dhan Yoga (Money Triangle)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.wealthAndProsperity.moneyTriangle}
                </p>
              </div>

              {/* Financial Discipline */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-1">
                  Financial Discipline & Retention
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.wealthAndProsperity.financialDiscipline}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                Wealth Generation Archetype
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {reading.wealthAndProsperity.wealthCreationTendency}
              </p>
            </div>
          </div>
        )}

        {/* Tab 5: Vitality & Prana */}
        {activeTab === 'health' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-emerald-500/20 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Vitality, Prana & Energy Reserves
              </h3>
              <p className="text-xs text-emerald-300">Traditional Chiromantic Readings of Jeevan Rekha (Life Line)</p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Traditional Hast Rekha Note:</strong> The Life Line indicates vitality, stamina, and energy flow in classical chiromancy—never medical diagnoses or deterministic lifespans.
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {reading.healthAndVitality.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                  Vitality & Prana Flow
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.healthAndVitality.vitalityFlow}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block">
                  Stress Buffer & Nervous Energy
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.healthAndVitality.stressManagement}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-1">
                Holistic Lifestyle Harmonization
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {reading.healthAndVitality.wellnessRecommendation}
              </p>
            </div>
          </div>
        )}

        {/* Tab 6: Destiny & Spiritual Signs */}
        {activeTab === 'destiny' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-cyan-500/20 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Destiny, Spiritual Signs & Karmic Guidance
              </h3>
              <p className="text-xs text-cyan-300">Mystic Cross, Intuition Lines, and Soul Transitions</p>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {reading.destinyAndSpirituality.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 block">
                  Spiritual & Occult Markers
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.destinyAndSpirituality.spiritualSigns}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block">
                  Major Transitions & Evolutions
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.destinyAndSpirituality.majorTransitions}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 block mb-1">
                Karmic Lesson & Soul Direction
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {reading.destinyAndSpirituality.karmicGuidance}
              </p>
            </div>
          </div>
        )}

        {/* Tab 7: Timeline & Age Milestones */}
        {activeTab === 'timeline' && (
          <div className="space-y-6 animate-fadeIn">
            <PalmChronologyTimeline />
          </div>
        )}

        {/* Tab 8: Dual Hand Karma Comparison */}
        {activeTab === 'comparison' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#090b1c] border border-slate-700/60 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Dual Hand Philosophy: Destiny vs. Free Will
              </h3>
              <p className="text-xs text-slate-400">Comparing the Subconscious Blueprint with Current Manifestation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-purple-300 block">
                  Left Hand (Birth Blueprint & Subconscious)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.handComparison.nonDominantRole}
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block">
                  Right Hand (Free Will & Manifested Reality)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {reading.handComparison.dominantHandRole}
                </p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 block mb-1">
                Hast Rekha Synthesis of Free Will
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {reading.handComparison.freeWillVsDestiny}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Footer Disclaimer & Share */}
      <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          Palmistry is an ancient art of character reflection and contemplation. Lines evolve over time with your thoughts and actions.
        </p>
        <button
          onClick={() => setIsShareModalOpen(true)}
          className="text-amber-300 hover:text-amber-200 bg-amber-400/10 hover:bg-amber-400/20 px-4 py-2 rounded-xl border border-amber-400/30 flex items-center gap-2 cursor-pointer font-medium transition-all"
        >
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>Share Reading Card</span>
        </button>
      </div>

      {/* Share Reading Modal */}
      <ShareReadingModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        reading={reading}
        imageUrl={imageUrl}
        dominantHand={dominantHand}
      />

    </div>
  );
};
