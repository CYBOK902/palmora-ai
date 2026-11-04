import React from 'react';
import { Hand, Sparkles, HeartHandshake, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenCompatibility: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCompatibility }) => {
  return (
    <footer className="bg-[#04050d] border-t border-slate-900 pt-16 pb-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#241a05] via-[#100b24] to-[#1e1302] border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <div className="absolute inset-[-3px] rounded-xl border border-dashed border-amber-400/35 animate-astrolabe-cw pointer-events-none" />
                <Hand className="w-5 h-5 text-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.7)]" />
              </div>
              <div>
                <span className="font-cinzel text-xl font-black tracking-widest text-antique-gold-shimmer">
                  PALMORA
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-400/40 ml-2">
                  3D AI
                </span>
              </div>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Bridging the timeless wisdom of Vedic Hast Rekha Shastra and classical chiromancy with state-of-the-art computer vision and multimodal intelligence.
            </p>
            <div className="flex items-center gap-2 text-amber-300/80 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Images go to the server and Gemini for analysis; shared readings expire after 30 days.</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <p className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Explore Platform
            </p>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('upload-section')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Scan Your Palm
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('photo-guide')}
                  className="hover:text-amber-300 transition-colors"
                >
                  How to Take Palm Photos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('hast-rekha-guide')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Hast Rekha Encyclopedia
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenCompatibility}
                  className="hover:text-rose-300 transition-colors"
                >
                  Couple Compatibility
                </button>
              </li>
              <li>
                <a href="/privacy.html" className="hover:text-amber-300 transition-colors">
                  Privacy Notice
                </a>
              </li>
              <li>
                <a href="/terms.html" className="hover:text-amber-300 transition-colors">
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>

          {/* Lines & Shastra */}
          <div className="space-y-3">
            <p className="text-slate-200 font-semibold uppercase tracking-wider text-[11px]">
              Hast Rekha Tradition
            </p>
            <ul className="space-y-1.5 text-slate-400 text-[11px]">
              <li>Hridaya Rekha (Heart Line)</li>
              <li>Mastak Rekha (Head Line)</li>
              <li>Jeevan Rekha (Life Line)</li>
              <li>Bhagya Rekha (Fate Line)</li>
              <li>Surya Rekha (Sun Line)</li>
              <li>Vivah Rekha (Marriage Lines)</li>
            </ul>
          </div>
        </div>

        {/* Ethical Palmistry Disclaimer */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900 text-[11px] text-slate-500 leading-relaxed text-center sm:text-left">
          <strong>Cultural & Ethical Notice:</strong> Palmistry (Hast Rekha Shastra) is a traditional contemplative belief system rooted in self-reflection and philosophical insight. It is not an empirical or predictive science, nor a substitute for licensed medical, psychological, legal, or financial counseling. Your future is shaped by your daily consciousness, intentions, and deeds.
        </div>

        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} Palmora AI. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Vedic & Western Chiromancy</span>
            <span>·</span>
            <span>High-Fidelity Vision Analytics</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
