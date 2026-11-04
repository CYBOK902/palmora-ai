import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';

interface AudioReadingPlayerProps {
  textToRead: string;
  title: string;
}

export const AudioReadingPlayer: React.FC<AudioReadingPlayerProps> = ({
  textToRead,
  title,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [rate, setRate] = useState(0.95); // slightly contemplative pace

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isSupported) return null;

  const handleTogglePlay = () => {
    if (!('speechSynthesis' in window)) return;

    if (isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    } else {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        setIsPlaying(true);
      } else {
        window.speechSynthesis.cancel(); // clear queue
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.rate = rate;
        utterance.pitch = 0.95; // warm, resonant pitch

        // Select an expressive English voice if available
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(
          (v) =>
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Serena')) &&
            v.lang.startsWith('en')
        );
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);

        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleRestart = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setTimeout(() => {
      handleTogglePlay();
    }, 150);
  };

  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
          <Volume2 className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white font-cinzel">
              Sacred Voice Narration
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-medium">
              Audio Reading
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Listen to {title} read aloud in a reflective chiromantic cadence
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-auto">
        {/* Speed adjustment */}
        <select
          value={rate}
          onChange={(e) => {
            const newRate = parseFloat(e.target.value);
            setRate(newRate);
            if (isPlaying) {
              window.speechSynthesis.cancel();
              setIsPlaying(false);
            }
          }}
          className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-[11px] text-slate-300 focus:outline-none"
        >
          <option value={0.85}>0.85x (Serene)</option>
          <option value={0.95}>0.95x (Natural)</option>
          <option value={1.1}>1.1x (Brisk)</option>
        </select>

        <button
          onClick={handleRestart}
          title="Restart narration"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleTogglePlay}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-semibold shadow flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Listen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
