import React, { useState, useRef } from 'react';
import { CompatibilityData } from '../types/palm';
import {
  X,
  HeartHandshake,
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  Orbit,
  Heart,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { prepareImage } from '../utils/prepareImage';

interface CompatibilityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CompatibilityModal: React.FC<CompatibilityModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [nameA, setNameA] = useState('You');
  const [nameB, setNameB] = useState('Partner');
  const [palmA, setPalmA] = useState<string | null>(null);
  const [palmB, setPalmB] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CompatibilityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileRefA = useRef<HTMLInputElement>(null);
  const fileRefB = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, target: 'A' | 'B') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const image = await prepareImage(file);
      if (target === 'A') setPalmA(image);
      else setPalmB(image);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'The selected image could not be processed.');
    } finally {
      e.target.value = '';
    }
  };

  const loadSamplePair = async () => {
    try {
      const response = await fetch('/assets/aistudio/media_1793731253462_a26aed84_79caa7fd.jpg');
      if (!response.ok) throw new Error('Sample palm image could not be loaded.');
      const blob = await response.blob();
      const image = await prepareImage(blob);
      setPalmA(image);
      setPalmB(image);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Sample palm image could not be loaded.');
    }
  };

  const handleAnalyzeCompatibility = async () => {
    if (!palmA || !palmB) {
      alert('Please provide photos of both palms.');
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const resp = await fetch('/api/compatibility-reading', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          palmA,
          palmB,
          nameA,
          nameB,
          language: 'English',
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        throw new Error(data.error || 'Failed to analyze palm compatibility.');
      }
      setResult(data.compatibility);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error running compatibility analysis');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-[#090b1c] border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Hast Rekha <span className="text-rose-400">Couple Compatibility</span>
              </h3>
              <p className="text-xs text-slate-400">
                Compare Heart lines, elemental hands & emotional resonance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200">
            {error}
          </div>
        )}

        {/* Results Screen if analyzed */}
        {result ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Score Banner */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/50 via-slate-900 to-purple-950/50 border border-rose-500/30 text-center space-y-2">
              <span className="text-xs uppercase tracking-widest text-rose-400 font-semibold">
                Harmonic Palmistry Resonance
              </span>
              <div className="text-5xl font-extrabold text-white font-cinzel">
                {result.overallCompatibilityScore}%
              </div>
              <p className="text-sm font-medium text-rose-200">
                {result.elementalSynergy}
              </p>
            </div>

            {/* Emotional and Intellectual harmony */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-semibold uppercase">
                  <Heart className="w-4 h-4" />
                  <span>Emotional Harmony (Heart Lines)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.emotionalHarmony}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-semibold uppercase">
                  <Brain className="w-4 h-4" />
                  <span>Intellectual Rhythm (Head Lines)</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.intellectualRhythm}
                </p>
              </div>
            </div>

            {/* Strengths and Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block mb-2">
                  Bond Strengths
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.sharedStrengths.map((s, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-emerald-400">✓</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-2">
                  Growth & Harmony Advice
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {result.relationshipGrowthTips.map((t, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <span className="text-amber-400">✦</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verdict */}
            <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-slate-300 leading-relaxed">
              <span className="font-semibold text-purple-300 block mb-1">
                Chiromantic Long-Term Destiny:
              </span>
              <p>{result.longTermDestinyVerdict}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setResult(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700"
              >
                Test Other Palms
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-xs font-semibold text-white shadow-md shadow-rose-500/20"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          /* Form for Uploading Two Palms */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Upload clear palm photos for both partners</span>
              <button
                type="button"
                onClick={loadSamplePair}
                className="text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fill with Sample Pair</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Partner A */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <input
                  type="text"
                  value={nameA}
                  onChange={(e) => setNameA(e.target.value)}
                  placeholder="Partner 1 Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />

                {palmA ? (
                  <div className="relative rounded-xl overflow-hidden border border-rose-500/40 aspect-[4/5] bg-slate-950">
                    <img src={palmA} alt={nameA} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPalmA(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 text-[10px]"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRefA.current?.click()}
                    className="border-2 border-dashed border-slate-700 rounded-xl aspect-[4/5] flex flex-col items-center justify-center p-4 cursor-pointer hover:border-rose-400/50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-slate-500 mb-1" />
                    <span className="text-xs text-slate-300 font-medium">Upload {nameA}'s Palm</span>
                    <span className="text-[10px] text-slate-500">Tap to select photo</span>
                  </div>
                )}
                <input
                  ref={fileRefA}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e, 'A')}
                />
              </div>

              {/* Partner B */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <input
                  type="text"
                  value={nameB}
                  onChange={(e) => setNameB(e.target.value)}
                  placeholder="Partner 2 Name"
                  className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />

                {palmB ? (
                  <div className="relative rounded-xl overflow-hidden border border-rose-500/40 aspect-[4/5] bg-slate-950">
                    <img src={palmB} alt={nameB} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setPalmB(null)}
                      className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 text-[10px]"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileRefB.current?.click()}
                    className="border-2 border-dashed border-slate-700 rounded-xl aspect-[4/5] flex flex-col items-center justify-center p-4 cursor-pointer hover:border-rose-400/50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-slate-500 mb-1" />
                    <span className="text-xs text-slate-300 font-medium">Upload {nameB}'s Palm</span>
                    <span className="text-[10px] text-slate-500">Tap to select photo</span>
                  </div>
                )}
                <input
                  ref={fileRefB}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFile(e, 'B')}
                />
              </div>
            </div>

            <button
              onClick={handleAnalyzeCompatibility}
              disabled={isLoading || !palmA || !palmB}
              className={`w-full py-3.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all ${
                isLoading || !palmA || !palmB
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40'
              }`}
            >
              {isLoading ? (
                <>
                  <Orbit className="w-4 h-4 animate-spin" />
                  <span>Aligning Heart & Head Lines...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Reveal Compatibility Reading</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500">
              Both photos and the entered names are sent to the server and Gemini for analysis.{' '}
              <a href="/privacy.html" target="_blank" rel="noreferrer" className="text-amber-300 underline underline-offset-2">
                Privacy notice
              </a>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
