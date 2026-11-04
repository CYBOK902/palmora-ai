import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Hand,
  Compass,
  HeartHandshake,
  BookOpen,
  History,
  Orbit,
  Star,
  Menu,
  X,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  onOpenCompatibility: () => void;
  onOpenHistory: () => void;
  savedCount: number;
  activeReading: boolean;
  onResetReading?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  isAction?: boolean;
  badge?: string;
  description?: string;
  action?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onNavigate,
  onOpenCompatibility,
  onOpenHistory,
  savedCount,
  activeReading,
  onResetReading,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('');

  // Track active section via scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'upload-section',
        'hast-rekha-guide',
        'photo-guide',
        'daily-oracle',
        'sacred-signs',
      ];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
      if (window.scrollY < 300) {
        setActiveSection('');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navItems: NavItem[] = [
    {
      id: 'upload-section',
      label: 'Read Palm',
      icon: Sparkles,
      color: 'text-amber-400',
      description: 'Upload your palm image for instant AI Hast Rekha interpretation',
    },
    {
      id: 'hast-rekha-guide',
      label: 'Wisdom Guide',
      icon: BookOpen,
      color: 'text-cyan-400',
      description: 'Explore the 6 major palm lines, mounts & Vedic chiromancy rules',
    },
    {
      id: 'photo-guide',
      label: 'Photo Guide',
      icon: Compass,
      color: 'text-purple-400',
      description: 'Lighting, framing, and positioning tips for optimal scan precision',
    },
    {
      id: 'daily-oracle',
      label: 'Daily Oracle',
      icon: Orbit,
      color: 'text-amber-300',
      description: 'Daily planetary alignment insights & auspicious palm focus',
    },
    {
      id: 'sacred-signs',
      label: 'Sacred Signs',
      icon: Star,
      color: 'text-emerald-400',
      description: 'Identify Matsya (Fish), Padma (Lotus), Trishula, and Temple signs',
    },
    {
      id: 'couple-synergy',
      label: 'Couple Synergy',
      icon: HeartHandshake,
      color: 'text-rose-400',
      isAction: true,
      badge: 'Synergy',
      description: 'Dual-palm relationship resonance & emotional compatibility analysis',
      action: onOpenCompatibility,
    },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.isAction && item.action) {
      item.action();
    } else {
      onNavigate(item.id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#04050e]/90 border-b border-amber-500/20 shadow-2xl shadow-black/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo with 3D Astrolabe & Sacred Palm Glyph */}
          <div
            onClick={() => {
              if (activeReading && onResetReading) onResetReading();
              onNavigate('hero');
            }}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            {/* 3D Astrolabe Medallion */}
            <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#241a05] via-[#100b24] to-[#1e1302] border border-amber-400/50 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:border-amber-300 transition-all duration-300 group-hover:shadow-amber-500/35">
              {/* Outer Rotating Astrolabe Constellation Ring */}
              <div className="absolute inset-[-4px] rounded-2xl border border-dashed border-amber-400/35 animate-astrolabe-cw pointer-events-none" />
              
              {/* Inner Counter-Rotating Orbit Ring */}
              <div className="absolute inset-[2px] rounded-xl border border-dotted border-purple-400/30 animate-astrolabe-ccw pointer-events-none" />
              
              {/* Sacred Palm Glyph with Specular Core */}
              <div className="relative z-10 flex items-center justify-center">
                <Hand className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]" />
                <div className="absolute w-2 h-2 rounded-full bg-white blur-[1.5px] animate-ping pointer-events-none" />
              </div>

              {/* Micro Gold Corner Accents */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-300" />
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-amber-300" />
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-amber-300" />
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-300" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel text-xl sm:text-2xl font-black tracking-widest text-antique-gold-shimmer">
                  PALMORA
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-amber-200 bg-gradient-to-r from-amber-500/25 via-purple-500/20 to-amber-500/25 px-2 py-0.5 rounded-full border border-amber-400/40 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  3D AI
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-slate-400 hidden sm:flex items-center gap-1.5 font-medium mt-0.5">
                <span className="text-amber-400/90">✦</span>
                <span className="text-slate-300">Vedic Hast Rekha</span>
                <span className="text-amber-400/60">·</span>
                <span className="text-amber-200/80">Chiromancy</span>
              </p>
            </div>
          </div>

          {/* Optimized Desktop Navigation Island */}
          <nav className="hidden lg:flex items-center p-1.5 rounded-full bg-slate-950/70 border border-slate-800/80 backdrop-blur-md shadow-inner shadow-black/50">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 flex items-center gap-1.5 cursor-pointer relative group ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 text-amber-200 border border-amber-400/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.color} group-hover:scale-110 transition-transform`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Area: History, Get Your Reading CTA, and Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* History Button */}
            <button
              onClick={onOpenHistory}
              title="View saved palm reading history"
              className="p-2 sm:px-3 sm:py-2 rounded-full bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700/80 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm hover:border-amber-400/50 hover:text-white active:scale-95"
            >
              <History className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline font-medium">History</span>
              {savedCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {savedCount}
                </span>
              )}
            </button>

            {/* Primary CTA Button: Get Your Reading */}
            <button
              onClick={() => onNavigate('upload-section')}
              className="px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer border border-amber-200/50 shrink-0"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Get Your Reading</span>
            </button>

            {/* Mobile / Tablet Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-200 hover:text-amber-300 hover:border-amber-400/50 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE & TABLET SLIDING NAVIGATION DRAWER
          ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            {/* Backdrop Blur Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#020308]/85 backdrop-blur-md"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 280 }}
              className="absolute top-20 right-0 bottom-0 w-full sm:w-[380px] bg-[#050612] border-l border-amber-500/20 shadow-2xl flex flex-col justify-between p-6 overflow-y-auto"
            >
              {/* Drawer Top Header & Navigation Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-cinzel">
                    Navigation Menu
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Sacred Vedic Chiromancy
                  </span>
                </div>

                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item)}
                        className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                          isActive
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-200 shadow-md'
                            : 'bg-slate-900/60 border-slate-800/80 text-slate-200 hover:bg-slate-800/80 hover:border-amber-400/40'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-amber-400/50 transition-colors">
                            <Icon className={`w-4 h-4 ${item.color}`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold tracking-wide text-white group-hover:text-amber-200 transition-colors">
                                {item.label}
                              </span>
                              {item.badge && (
                                <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-medium">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            {item.description && (
                              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                                {item.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                      </button>
                    );
                  })}

                  {/* Mobile History Link */}
                  <button
                    onClick={() => {
                      onOpenHistory();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full p-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:bg-slate-800/80 text-left transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                        <History className="w-4 h-4 text-amber-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold tracking-wide text-white group-hover:text-amber-200 transition-colors">
                            Saved History
                          </span>
                          {savedCount > 0 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold">
                              {savedCount} {savedCount === 1 ? 'Reading' : 'Readings'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          View and review past analyzed palm readings
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                </div>
              </div>

              {/* Drawer Bottom Actions: Primary CTA */}
              <div className="pt-6 border-t border-slate-800/80 space-y-3">
                <button
                  onClick={() => {
                    onNavigate('upload-section');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3.5 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Get Your Reading</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>

                <p className="text-[10px] text-center text-slate-500 tracking-wider uppercase font-medium">
                  100% In-Browser Privacy · No Registration Required
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
