import React, { lazy, Suspense, useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import type { SavedReadingRecord } from './components/SavedReadingsDrawer';
import { PalmReading } from './types/palm';
import { AlertCircle, X, Sparkles, RefreshCw } from 'lucide-react';

const PhotoGuide = lazy(() => import('./components/PhotoGuide').then(({ PhotoGuide }) => ({ default: PhotoGuide })));
const PalmUploadSection = lazy(() => import('./components/PalmUploadSection').then(({ PalmUploadSection }) => ({ default: PalmUploadSection })));
const ReadingLoadingState = lazy(() => import('./components/ReadingLoadingState').then(({ ReadingLoadingState }) => ({ default: ReadingLoadingState })));
const ReadingReport = lazy(() => import('./components/ReadingReport').then(({ ReadingReport }) => ({ default: ReadingReport })));
const HastRekhaEncyclopedia = lazy(() => import('./components/HastRekhaEncyclopedia').then(({ HastRekhaEncyclopedia }) => ({ default: HastRekhaEncyclopedia })));
const DailyHastRekhaOracle = lazy(() => import('./components/DailyHastRekhaOracle').then(({ DailyHastRekhaOracle }) => ({ default: DailyHastRekhaOracle })));
const SacredSignsLibrary = lazy(() => import('./components/SacredSignsLibrary').then(({ SacredSignsLibrary }) => ({ default: SacredSignsLibrary })));
const CompatibilityModal = lazy(() => import('./components/CompatibilityModal').then(({ CompatibilityModal }) => ({ default: CompatibilityModal })));
const SavedReadingsDrawer = lazy(() => import('./components/SavedReadingsDrawer').then(({ SavedReadingsDrawer }) => ({ default: SavedReadingsDrawer })));
const Footer = lazy(() => import('./components/Footer').then(({ Footer }) => ({ default: Footer })));

const STORAGE_KEY = 'palmora_saved_readings';

export default function App() {
  const [reading, setReading] = useState<PalmReading | null>(null);
  const [dominantImage, setDominantImage] = useState<string | null>(null);
  const [dominantHand, setDominantHand] = useState<'left' | 'right'>('right');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isCompatibilityOpen, setIsCompatibilityOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [savedReadings, setSavedReadings] = useState<SavedReadingRecord[]>([]);
  const [lastPayload, setLastPayload] = useState<any>(null);

  const [isSharedView, setIsSharedView] = useState<boolean>(false);

  // Check for ?share= parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareId = params.get('share');
    if (shareId) {
      setIsLoading(true);
      fetch(`/api/share/${shareId}`)
        .then(async (response) => {
          const result = await response.json();
          if (!response.ok) throw new Error(result.error || 'This shared reading is unavailable.');
          if (result.success && result.data) {
            setReading(result.data.reading);
            setDominantImage(result.data.dominantImage);
            setDominantHand(result.data.dominantHand || 'right');
            setIsSharedView(true);
          }
        })
        .catch((err) => {
          console.warn('Error loading shared reading:', err);
          setErrorMessage(err instanceof Error ? err.message : 'This shared reading is unavailable.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  // Load saved readings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const records = JSON.parse(stored);
        if (Array.isArray(records)) {
          setSavedReadings(records.filter((record) =>
            record && typeof record.id === 'string' && typeof record.imageUrl === 'string' &&
            (record.dominantHand === 'left' || record.dominantHand === 'right') &&
            record.reading && typeof record.reading === 'object'
          ).slice(0, 3));
        }
      }
    } catch (e) {
      console.warn('Could not read saved readings from localStorage:', e);
    }
  }, []);

  const saveReadingRecord = (img: string, hand: 'left' | 'right', r: PalmReading) => {
    try {
      const newRecord: SavedReadingRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        imageUrl: img,
        dominantHand: hand,
        reading: r,
      };
      const updated = [newRecord, ...savedReadings.slice(0, 2)];
      setSavedReadings(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  };

  const handleDeleteRecord = (id: string) => {
    const updated = savedReadings.filter((r) => r.id !== id);
    setSavedReadings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleClearAllHistory = () => {
    setSavedReadings([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleSelectPastReading = (record: SavedReadingRecord) => {
    setReading(record.reading);
    setDominantImage(record.imageUrl);
    setDominantHand(record.dominantHand);
    setErrorMessage(null);
    setNoticeMessage(null);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartReading = () => {
    scrollToSection('upload-section');
  };

  const handleLearnMore = () => {
    scrollToSection('photo-guide');
  };

  const handleAnalyzePalm = async (payload: {
    dominantImage: string;
    secondaryImage?: string;
    dominantHand: 'left' | 'right';
    focus: string;
    language: string;
    userNotes: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setNoticeMessage(null);
    setLastPayload(payload);
    setDominantImage(payload.dominantImage);
    setDominantHand(payload.dominantHand);

    // Scroll to analysis viewport
    window.scrollTo({ top: 120, behavior: 'smooth' });

    try {
      const response = await fetch('/api/analyze-palm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze palm. Please ensure the palm is clear and well lit.');
      }

      setReading(data.reading);
      saveReadingRecord(payload.dominantImage, payload.dominantHand, data.reading);

      if (data.notice) {
        setNoticeMessage(data.notice);
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || 'An unexpected error occurred while analyzing the palm. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLast = () => {
    if (lastPayload) {
      handleAnalyzePalm(lastPayload);
    }
  };

  const handleResetReading = () => {
    setReading(null);
    setDominantImage(null);
    setErrorMessage(null);
    setNoticeMessage(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#05060f] text-slate-200 selection:bg-amber-500/30 selection:text-amber-200 flex flex-col font-sans">
      {/* Navigation Header */}
      <Header
        onNavigate={scrollToSection}
        onOpenCompatibility={() => setIsCompatibilityOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={savedReadings.length}
        activeReading={!!reading}
        onResetReading={handleResetReading}
      />

      {/* Shared View Notification Banner */}
      {isSharedView && (
        <div className="bg-gradient-to-r from-purple-950/90 via-amber-950/70 to-purple-950/90 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs text-amber-200 flex flex-wrap items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>You are viewing a shared Hast Rekha Palm Reading on Palmora AI</span>
          </span>
          <button
            onClick={() => {
              setIsSharedView(false);
              handleResetReading();
              window.history.replaceState({}, '', window.location.pathname);
            }}
            className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-semibold hover:bg-amber-300 transition-colors cursor-pointer text-[11px]"
          >
            Scan Your Own Palm
          </button>
        </div>
      )}

      {/* Global Error Banner with Retry */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-6 w-full">
          <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-200 flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <div className="flex items-center gap-2">
              {lastPayload && (
                <button
                  onClick={handleRetryLast}
                  className="px-3 py-1 rounded-lg bg-rose-900/60 hover:bg-rose-900 text-rose-100 flex items-center gap-1 border border-rose-400/40 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Retry</span>
                </button>
              )}
              <button
                onClick={() => setErrorMessage(null)}
                className="p-1 rounded-lg hover:bg-rose-900/50 text-rose-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Notice Banner */}
      {noticeMessage && (
        <div className="max-w-4xl mx-auto px-4 mt-4 w-full">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{noticeMessage}</span>
            </div>
            <button
              onClick={() => setNoticeMessage(null)}
              className="text-amber-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {isLoading ? (
          <Suspense fallback={<div className="w-full min-h-64" aria-busy="true" />}>
            <ReadingLoadingState
              palmImageUrl={dominantImage || undefined}
              dominantHand={dominantHand}
            />
          </Suspense>
        ) : reading && dominantImage ? (
          <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
            <ReadingReport
              reading={reading}
              imageUrl={dominantImage}
              dominantHand={dominantHand}
              onReset={handleResetReading}
              onOpenCompatibility={() => setIsCompatibilityOpen(true)}
            />
          </Suspense>
        ) : (
          <>
            <Hero onStartReading={handleStartReading} onLearnMore={handleLearnMore} />
            <Suspense fallback={<div className="min-h-[32rem]" aria-busy="true" />}>
              <PalmUploadSection
                onAnalyze={handleAnalyzePalm}
                isLoading={isLoading}
              />
            </Suspense>
            <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
              <PhotoGuide />
            </Suspense>
            <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
              <DailyHastRekhaOracle />
            </Suspense>
            <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
              <SacredSignsLibrary />
            </Suspense>
            <Suspense fallback={<div className="min-h-96" aria-busy="true" />}>
              <HastRekhaEncyclopedia />
            </Suspense>
          </>
        )}
      </main>

      {/* Couple Compatibility Modal */}
      {isCompatibilityOpen && (
        <Suspense fallback={null}>
          <CompatibilityModal
            isOpen={isCompatibilityOpen}
            onClose={() => setIsCompatibilityOpen(false)}
          />
        </Suspense>
      )}

      {/* Saved Readings History Drawer */}
      {isHistoryOpen && (
        <Suspense fallback={null}>
          <SavedReadingsDrawer
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            savedReadings={savedReadings}
            onSelectReading={handleSelectPastReading}
            onDeleteReading={handleDeleteRecord}
            onClearAll={handleClearAllHistory}
          />
        </Suspense>
      )}

      {/* Footer */}
      <Suspense fallback={<div className="min-h-80" aria-busy="true" />}>
        <Footer
          onNavigate={scrollToSection}
          onOpenCompatibility={() => setIsCompatibilityOpen(true)}
        />
      </Suspense>
    </div>
  );
}
