import React, { useState } from 'react';
import { Sparkles, Shield, Award, Landmark, Eye, Heart, Compass } from 'lucide-react';

interface SacredSign {
  id: string;
  name: string;
  sanskritName: string;
  symbol: string;
  location: string;
  rarity: 'Very Rare' | 'Auspicious' | 'Extraordinary';
  meaning: string;
  traditionalBlessing: string;
}

const SACRED_SIGNS: SacredSign[] = [
  {
    id: 'matsya',
    name: 'The Fish Sign (Matsya Rekha)',
    sanskritName: 'Matsya Yoga (मत्स्य योग)',
    symbol: '𓆟',
    location: 'Usually found near the base of the Life Line, Ketu mount, or beneath Apollo.',
    rarity: 'Very Rare',
    meaning: 'One of the most revered symbols in Vedic palmistry. Formed by two intersecting curves resembling the sacred fish avatar of Vishnu.',
    traditionalBlessing: 'Confers immense spiritual peace, protection during ocean/overseas travel, philanthropic fortune, and enduring wealth in mature life.',
  },
  {
    id: 'trishul',
    name: 'The Trident (Trishula Sign)',
    sanskritName: 'Trishula (त्रिशूल)',
    symbol: 'Ψ',
    location: 'Apex of Fate Line terminating on Mount of Saturn, or on Mount of Jupiter.',
    rarity: 'Extraordinary',
    meaning: 'A three-pronged spear symbol of Lord Shiva. Marks individuals destined for profound leadership, triumph over adversaries, and divine grace.',
    traditionalBlessing: 'Blesses the bearer with extraordinary reputation, authority, spiritual fortitude, and unassailable integrity in public duty.',
  },
  {
    id: 'chakra',
    name: 'The Sacred Chakra (Whorl)',
    sanskritName: 'Sudarshana Chakra (चक्र)',
    symbol: '◎',
    location: 'Concentric circular ridges on the fingertips, especially the thumb or index finger.',
    rarity: 'Auspicious',
    meaning: 'Dermatoglyphic whorl pattern denoting royal independence, self-sovereignty, and sharp analytical command.',
    traditionalBlessing: 'Traditionally signifies independent wealth, refusal to serve unworthy masters, and self-made worldly success.',
  },
  {
    id: 'shankha',
    name: 'The Sacred Conch (Shankha)',
    sanskritName: 'Shankha Rekha (शंख)',
    symbol: '🐚',
    location: 'Loop dermatoglyphic pattern curving smoothly like a conch shell.',
    rarity: 'Auspicious',
    meaning: 'Associated with Goddess Lakshmi and Lord Vishnu. Symbolizes sacred speech, educational mastery, and aesthetic eloquence.',
    traditionalBlessing: 'Endows the person with persuasive voice, musical appreciation, charitable generosity, and widespread social affection.',
  },
  {
    id: 'padma',
    name: 'The Lotus Sign (Padma)',
    sanskritName: 'Kamala Yoga (कमल योग)',
    symbol: '🪷',
    location: 'Formed by fine triangular petals on the Mount of Venus or Mount of Jupiter.',
    rarity: 'Very Rare',
    meaning: 'The sacred lotus blooming untarnished above muddy waters. Signifies moral purity, spiritual devotion, and artistic refinement.',
    traditionalBlessing: 'Brings serenity of mind, spiritual intuition, harmonious family lineage, and divine protection in times of crisis.',
  },
  {
    id: 'temple',
    name: 'The Temple / Shrine Sign (Mandir Rekha)',
    sanskritName: 'Prasada Rekha (मंदिर)',
    symbol: '🏛️',
    location: 'Base of the palm or on the upper Mount of Jupiter, resembling a dome or triangle tower.',
    rarity: 'Extraordinary',
    meaning: 'Marks a builder of enduring institutions, temple endowments, major real-estate ownership, and ancestral prestige.',
    traditionalBlessing: 'Signifies acquisition of prominent land and estates, philanthropic endowments, and high civic honors.',
  },
];

export const SacredSignsLibrary: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState<SacredSign>(SACRED_SIGNS[0]);

  return (
    <section id="sacred-signs" className="py-16 relative bg-[#07091c] border-t border-amber-500/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-amber-400 font-semibold mb-2">
            RARE HAST REKHA FORMATIONS
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-cinzel">
            Sacred Signs & <span className="text-antique-gold-shimmer">Dermatoglyphics</span>
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            Ancient texts celebrate specific auspicious palm marks that indicate divine protection and exceptional fortune
          </p>
        </div>

        {/* Grid of Sign Cards */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Sign List */}
          <div className="md:col-span-5 space-y-2">
            {SACRED_SIGNS.map((sign) => {
              const isSelected = selectedSign.id === sign.id;
              return (
                <div
                  key={sign.id}
                  onClick={() => setSelectedSign(sign)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-400/10 border-amber-400 text-white shadow-lg shadow-amber-500/10'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-8 h-8 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-800">
                      {sign.symbol}
                    </span>
                    <div>
                      <h4 className="text-sm font-semibold font-cinzel text-white">
                        {sign.name}
                      </h4>
                      <p className="text-[11px] text-amber-300/80">{sign.sanskritName}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    sign.rarity === 'Extraordinary'
                      ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                      : sign.rarity === 'Very Rare'
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                      : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {sign.rarity}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Selected Sign Detailed Inspection */}
          <div className="md:col-span-7 p-6 sm:p-8 rounded-3xl bg-[#0a0d24] border border-amber-500/30 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <span className="text-3xl w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  {selectedSign.symbol}
                </span>
                <div>
                  <h3 className="text-2xl font-bold text-white font-cinzel">
                    {selectedSign.name}
                  </h3>
                  <p className="text-xs text-amber-300 font-medium">
                    {selectedSign.sanskritName}
                  </p>
                </div>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {selectedSign.rarity}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Typical Palm Location:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedSign.location}
              </p>
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 block mb-1">
                Traditional Shastra Description:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {selectedSign.meaning}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-1">
              <span className="text-xs font-semibold text-amber-300 block">
                ✦ Sacred Chiromancy Blessing:
              </span>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                {selectedSign.traditionalBlessing}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
              Tip: When analyzing your palm with Palmora AI, our vision model specifically scans for these geometry signatures in the palm quadrangle and major mount apexes.
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
