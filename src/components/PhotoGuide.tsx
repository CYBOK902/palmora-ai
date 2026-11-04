import React from 'react';
import { Sun, Scan, Hand, Smartphone } from 'lucide-react';

export const PhotoGuide: React.FC = () => {
  const steps = [
    {
      num: 1,
      icon: Sun,
      title: 'Use natural light',
      body: 'Daylight near a window beats any lamp. Flash and harsh overhead light throw shadows that hide the finer lines, so let soft, even light fall across your palm.',
    },
    {
      num: 2,
      icon: Scan,
      title: 'Hold your palm flat, shoot from directly above',
      body: 'Open your hand fully, fingers relaxed and slightly apart, and hold the camera straight above your palm so it fills the frame. Shooting at an angle distorts the lines.',
    },
    {
      num: 3,
      icon: Hand,
      title: 'Scan your dominant hand',
      body: 'Photograph the hand you write with, in the same flat, well-lit position. Palmists read it as your current story.',
    },
    {
      num: 4,
      icon: Smartphone,
      title: 'Your phone camera is enough',
      body: 'Almost all our users read from their phones, so no special gear is needed. Use the rear camera, tap your palm on screen to focus, hold steady for a second, and skip filters and zoom.',
    },
  ];

  return (
    <section id="photo-guide" className="py-20 relative bg-[#050614] border-y border-amber-500/15">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header directly matching user screenshot */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-amber-400 mb-3 font-mono">
            BEFORE YOUR READING
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4 font-cinzel">
            How to Take the <span className="text-antique-gold-shimmer">Perfect Palm</span> Photo
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            A clear photo means a clearer reading. Four simple habits make every line count.
          </p>
        </div>

        {/* 4 Cards Grid - Pixel-perfect match to screenshot with elevated luxury styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-8 rounded-3xl bg-[#080a1c]/90 border border-slate-800/90 hover:border-amber-400/40 transition-all duration-300 hover:-translate-y-1.5 group flex flex-col justify-between shadow-xl shadow-black/60"
              >
                <div>
                  {/* Top Row: Icon on left, Step number on right */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-center text-amber-300 group-hover:border-amber-400/60 group-hover:text-amber-200 transition-colors shadow-inner">
                      <Icon className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <span className="font-cinzel text-3xl font-bold text-amber-400/35 group-hover:text-amber-400/80 transition-colors">
                      {step.num}
                    </span>
                  </div>

                  {/* Title & Body */}
                  <h3 className="text-lg font-semibold text-white mb-3.5 leading-snug group-hover:text-amber-200 transition-colors">
                    {step.title}
                  </h3>

                  <p className="text-sm text-slate-400 leading-relaxed font-normal">
                    {step.body}
                  </p>
                </div>

                <div className="pt-5 border-t border-slate-800/70 mt-7 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span>STEP 0{step.num} / 04</span>
                  <span className="text-amber-400/80 uppercase tracking-wider">Recommended</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
