import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Sparkles,
  Hand,
  CheckCircle2,
  RefreshCw,
  Globe2,
  HelpCircle,
  X,
  FileImage,
} from 'lucide-react';
import { prepareImage } from '../utils/prepareImage';

interface PalmUploadSectionProps {
  onAnalyze: (payload: {
    dominantImage: string;
    secondaryImage?: string;
    dominantHand: 'left' | 'right';
    focus: string;
    language: string;
    userNotes: string;
  }) => void;
  isLoading: boolean;
}

export const PalmUploadSection: React.FC<PalmUploadSectionProps> = ({
  onAnalyze,
  isLoading,
}) => {
  const [dominantHand, setDominantHand] = useState<'left' | 'right'>('right');
  const [dominantImage, setDominantImage] = useState<string | null>(null);
  const [secondaryImage, setSecondaryImage] = useState<string | null>(null);
  const [showSecondaryUpload, setShowSecondaryUpload] = useState<boolean>(false);
  const [focus, setFocus] = useState<string>('Comprehensive Full Reading');
  const [language, setLanguage] = useState<string>('English');
  const [userNotes, setUserNotes] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraTarget, setCameraTarget] = useState<'dominant' | 'secondary'>('dominant');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const fileInputDominantRef = useRef<HTMLInputElement>(null);
  const fileInputSecondaryRef = useRef<HTMLInputElement>(null);

  // Quick preset sample palm for instant testing!
  const loadSamplePalm = async () => {
    try {
      const response = await fetch('/assets/aistudio/media_1793731253462_a26aed84_79caa7fd.jpg');
      if (!response.ok) throw new Error('Sample palm image could not be loaded.');
      const blob = await response.blob();
      setDominantImage(await prepareImage(blob));
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Sample palm image could not be loaded.');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, target: 'dominant' | 'secondary') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const preparedImage = await prepareImage(file);
      if (target === 'dominant') {
        setDominantImage(preparedImage);
      } else {
        setSecondaryImage(preparedImage);
      }
      setUploadError(null);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'The selected image could not be processed.');
    } finally {
      e.target.value = '';
    }
  };

  // Camera capture handlers
  const startCamera = async (target: 'dominant' | 'secondary') => {
    setCameraTarget(target);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Unable to access camera. Please check permissions or upload a photo instead.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setUploadError('The camera image could not be processed.');
          return;
        }
        try {
          const preparedImage = await prepareImage(blob);
          if (cameraTarget === 'dominant') setDominantImage(preparedImage);
          else setSecondaryImage(preparedImage);
          setUploadError(null);
        } catch (error) {
          setUploadError(error instanceof Error ? error.message : 'The camera image could not be processed.');
        }
      }, 'image/jpeg', 0.82);
    }
    stopCamera();
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dominantImage) {
      alert('Please upload or snap a photo of your dominant palm first.');
      return;
    }
    onAnalyze({
      dominantImage,
      secondaryImage: secondaryImage || undefined,
      dominantHand,
      focus,
      language,
      userNotes,
    });
  };

  return (
    <section id="upload-section" className="py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-purple-600/20 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-[0.2em] mb-3 shadow-md shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>INSTANT AI PALM VISION ANALYSIS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight font-cinzel">
            Submit Your <span className="text-antique-gold-shimmer">Palm Picture</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base mt-2.5 max-w-xl mx-auto leading-relaxed">
            No registration needed. Upload a photo or snap one live. Our vision model maps your lines, mounts, and signs into high-resolution 3D coordinates.
          </p>
        </div>

        {/* Live Camera Modal Overlay if active */}
        {isCameraActive && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg aspect-[3/4] bg-slate-900 rounded-3xl overflow-hidden border border-amber-400/40 shadow-2xl flex flex-col items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Hand silhouette guide overlay */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-dashed border-amber-400/50 rounded-[40px] flex items-center justify-center bg-amber-400/5">
                  <span className="text-xs text-amber-200 bg-slate-950/80 px-3 py-1 rounded-full border border-amber-400/30">
                    Align your open palm inside
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-950/80 text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Shutter Button */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 rounded-full border-4 border-amber-400 bg-white/90 hover:bg-amber-300 flex items-center justify-center shadow-xl active:scale-95 transition-transform"
                >
                  <Camera className="w-7 h-7 text-slate-950" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Card */}
        <form
          onSubmit={handleSubmit}
          className="bg-[#090b1c]/95 rounded-3xl border border-amber-500/20 p-6 sm:p-8 shadow-2xl space-y-8"
        >
          {uploadError && (
            <p role="alert" className="rounded-xl border border-rose-500/40 bg-rose-950/40 px-4 py-3 text-xs text-rose-200">
              {uploadError}
            </p>
          )}
          {/* Step 1: Dominant Hand Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              1. Which hand is your dominant (writing) hand?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setDominantHand('right')}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                  dominantHand === 'right'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Hand className="w-4 h-4 text-amber-400" />
                <span>Right Hand (Active / Manifested)</span>
              </button>

              <button
                type="button"
                onClick={() => setDominantHand('left')}
                className={`py-3 px-4 rounded-xl text-sm font-semibold border transition-all flex items-center justify-center gap-2 ${
                  dominantHand === 'left'
                    ? 'bg-amber-400/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Hand className="w-4 h-4 text-amber-400 transform scale-x-[-1]" />
                <span>Left Hand (Subconscious / Blueprint)</span>
              </button>
            </div>
          </div>

          {/* Step 2: Main Palm Upload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>2. Upload Dominant Palm Photo ({dominantHand.toUpperCase()} HAND)</span>
                <span className="text-amber-400 text-[11px] font-normal">*Required</span>
              </label>

              {/* Instant sample button */}
              <button
                type="button"
                onClick={loadSamplePalm}
                className="text-xs text-amber-300 hover:text-amber-200 underline underline-offset-4 flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Load Celestial Sample Palm</span>
              </button>
            </div>

            {dominantImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/40 bg-slate-950 p-4 flex flex-col sm:flex-row items-center gap-5 shadow-xl">
                {/* 3D Holographic Scanning Viewfinder */}
                <div className="relative w-36 h-48 sm:w-40 sm:h-52 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-lg bg-slate-950 shrink-0 group">
                  <img
                    src={dominantImage}
                    alt="Uploaded palm"
                    className="w-full h-full object-cover filter contrast-110"
                  />
                  {/* Hologram LiDAR coordinate grid */}
                  <div className="absolute inset-0 hologram-grid opacity-30 pointer-events-none" />
                  
                  {/* 3D Laser Scanning Beam */}
                  <div className="absolute left-0 right-0 h-14 pointer-events-none animate-laser-3d z-10">
                    <div className="w-full h-8 bg-gradient-to-b from-transparent to-amber-400/25" />
                    <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-amber-300 to-transparent shadow-[0_0_12px_#f59e0b]" />
                  </div>

                  {/* Corner reticles */}
                  <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-amber-400 pointer-events-none" />
                  <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-amber-400 pointer-events-none" />
                  <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-amber-400 pointer-events-none" />
                  <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-amber-400 pointer-events-none" />

                  <span className="absolute bottom-2 left-2 right-2 text-[8px] font-mono tracking-widest text-amber-300 bg-slate-950/85 px-1.5 py-0.5 rounded text-center border border-amber-400/30">
                    3D_CALIBRATION_OK
                  </span>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2.5">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Dominant Palm 3D Model Calibrated</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Surface topography, finger joints, and major line channels are detected. Ready for deep Hast Rekha chiromancy synthesis.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setDominantImage(null)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retake / Change Photo</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-700/80 hover:border-amber-500/50 rounded-2xl p-8 bg-slate-900/40 text-center transition-colors">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 mx-auto flex items-center justify-center mb-4">
                  <Upload className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">
                  Upload your palm photo or take a live picture
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                  Keep palm flat under natural light with fingers open. JPG, PNG, or WebP.
                </p>

                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputDominantRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white border border-slate-700 transition-colors flex items-center gap-2"
                  >
                    <FileImage className="w-4 h-4 text-amber-400" />
                    <span>Browse Image</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => startCamera('dominant')}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-medium text-amber-200 border border-amber-500/40 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-4 h-4 text-amber-300" />
                    <span>Use Camera</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => document.getElementById('photo-guide')?.scrollIntoView({ behavior: 'smooth' })}
                  className="text-[11px] text-slate-500 hover:text-amber-300 mt-4 underline underline-offset-4 flex items-center justify-center gap-1 mx-auto cursor-pointer"
                >
                  <span>Need photo tips? See guide below ↓</span>
                </button>

                <input
                  ref={fileInputDominantRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'dominant')}
                />
              </div>
            )}
          </div>

          {/* Optional Step 2B: Second Palm for Left vs Right Comparison */}
          <div className="pt-2 border-t border-slate-800">
            {!showSecondaryUpload ? (
              <button
                type="button"
                onClick={() => setShowSecondaryUpload(true)}
                className="text-xs text-purple-300 hover:text-purple-200 flex items-center gap-1.5 transition-colors"
              >
                <span>+ Add {dominantHand === 'right' ? 'Left' : 'Right'} Hand for Dual-Hand Comparison (Optional)</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-purple-300">
                    Secondary Hand ({dominantHand === 'right' ? 'LEFT' : 'RIGHT'} HAND - Subconscious Blueprint)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setSecondaryImage(null);
                      setShowSecondaryUpload(false);
                    }}
                    className="text-xs text-slate-500 hover:text-slate-300"
                  >
                    Remove
                  </button>
                </div>

                {secondaryImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-purple-500/40 bg-slate-950 p-2.5 flex items-center gap-3">
                    <img
                      src={secondaryImage}
                      alt="Secondary palm"
                      className="w-20 h-24 object-cover rounded-lg border border-slate-800"
                    />
                    <div className="text-xs text-slate-300">
                      <p className="text-purple-300 font-medium">Secondary Palm Attached</p>
                      <button
                        type="button"
                        onClick={() => setSecondaryImage(null)}
                        className="text-xs text-slate-400 hover:text-white mt-1 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                      Upload your other palm to analyze karma vs. current action.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputSecondaryRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-200 hover:bg-slate-700"
                      >
                        Browse
                      </button>
                      <button
                        type="button"
                        onClick={() => startCamera('secondary')}
                        className="px-3 py-1.5 rounded-lg bg-purple-900/40 text-xs text-purple-200 border border-purple-500/30 hover:bg-purple-900/60"
                      >
                        Camera
                      </button>
                    </div>
                    <input
                      ref={fileInputSecondaryRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, 'secondary')}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Customization Options (Focus, Language, Notes) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800">
            {/* Focus */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Reading Focus
              </label>
              <select
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="Comprehensive Full Reading">Comprehensive Full Reading (All 6 Dimensions)</option>
                <option value="Love, Relationships & Marriage">Love, Relationships & Marriage (Heart Line)</option>
                <option value="Career, Ambition & Success">Career, Ambition & Success (Fate & Sun Lines)</option>
                <option value="Wealth, Finance & Dhan Yoga">Wealth, Finance & Dhan Yoga (Money Triangle)</option>
                <option value="Vitality & Prana Energy">Vitality & Prana Energy (Life Line)</option>
                <option value="Destiny & Spiritual Signs">Destiny & Spiritual Signs (Mystic Cross & Karma)</option>
              </select>
            </div>

            {/* Language Selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Reading Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="English">English</option>
                <option value="Hindi (हिंदी)">Hindi (हिंदी)</option>
                <option value="Nepali (नेपाली)">Nepali (नेपाली)</option>
                <option value="Spanish (Español)">Spanish (Español)</option>
                <option value="French (Français)">French (Français)</option>
                <option value="German (Deutsch)">German (Deutsch)</option>
              </select>
            </div>
          </div>

          {/* Optional specific question */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1">
              <span>Specific Question or Life Context (Optional)</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
            </label>
            <input
              type="text"
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="e.g. Will I start a business? When is marriage indicated? Tell me about my Fate line branch."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !dominantImage}
              className={`w-full py-4 rounded-full font-semibold text-slate-950 text-base tracking-wide flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                isLoading || !dominantImage
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.01] active:scale-[0.99]'
              }`}
            >
              <Sparkles className="w-5 h-5 text-slate-950" />
              <span>{isLoading ? 'Analyzing Palm Lines...' : 'Reveal My Palm Reading'}</span>
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-2.5">
              Images are uploaded to the server and Gemini for analysis.{' '}
              <a href="/privacy.html" target="_blank" rel="noreferrer" className="text-amber-300 underline underline-offset-2">
                Read the privacy notice
              </a>
            </p>
          </div>
        </form>

      </div>
    </section>
  );
};
