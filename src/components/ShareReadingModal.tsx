import React, { useState, useEffect, useRef } from 'react';
import type { PalmReading } from '../types/palm';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  Smartphone,
  Layout,
  ExternalLink,
  MessageCircle,
  Twitter,
  Send,
  Flame,
  Droplet,
  Mountain,
  Wind,
  CheckCircle2,
} from 'lucide-react';

interface ShareReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  reading: PalmReading;
  imageUrl: string;
  dominantHand: 'left' | 'right';
}

type CardFormat = 'landscape' | 'square' | 'story';
type CardTheme = 'gold' | 'violet' | 'emerald';

export const ShareReadingModal: React.FC<ShareReadingModalProps> = ({
  isOpen,
  onClose,
  reading,
  imageUrl,
  dominantHand,
}) => {
  const [format, setFormat] = useState<CardFormat>('landscape');
  const [theme, setTheme] = useState<CardTheme>('gold');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [shareId, setShareId] = useState<string>('');
  const [revokeToken, setRevokeToken] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isGeneratingLink, setIsGeneratingLink] = useState<boolean>(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const cardPreviewRef = useRef<HTMLDivElement>(null);
  const shareReadingRef = useRef<PalmReading | null>(null);
  const shareRevokedRef = useRef(false);

  // Generate share link on mount or open
  useEffect(() => {
    if (!isOpen) return;

    if (shareReadingRef.current !== reading) {
      shareReadingRef.current = reading;
      shareRevokedRef.current = false;
      setShareUrl('');
      setShareId('');
      setRevokeToken('');
    }
    if (shareUrl && revokeToken) return;
    if (shareRevokedRef.current) return;

    let isMounted = true;
    setIsGeneratingLink(true);
    setShareError(null);
    setShareUrl('');
    setShareId('');
    setRevokeToken('');

    const createShare = async () => {
      try {
        const resp = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reading,
            dominantHand,
            dominantImage: imageUrl,
          }),
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || 'Could not create a share link.');
        if (isMounted && data.shareId && data.revokeToken) {
          const base = window.location.origin + window.location.pathname;
          setShareId(data.shareId);
          setRevokeToken(data.revokeToken);
          setShareUrl(`${base}?share=${data.shareId}`);
        } else {
          throw new Error('The server did not return a share link.');
        }
      } catch (error) {
        if (isMounted) {
          setShareError(error instanceof Error ? error.message : 'Could not create a share link.');
        }
      } finally {
        if (isMounted) setIsGeneratingLink(false);
      }
    };

    createShare();

    return () => {
      isMounted = false;
    };
  }, [isOpen, reading, dominantHand, imageUrl]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      setShareError('Clipboard access was denied. Copy the link from the field instead.');
    }
  };

  const handleNativeShare = async () => {
    const shareText = `Check out my Hast Rekha palm reading on Palmora AI: I have an ${reading.handShape.element} Hand archetype!`;
    if (!shareUrl) return;
    const url = shareUrl;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Palmora AI Palm Reading',
          text: shareText,
          url,
        });
      } catch (err) {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleRevokeLink = async () => {
    if (!shareId) return;
    try {
      const response = await fetch(`/api/share/${shareId}`, {
        method: 'DELETE',
        headers: { 'X-Share-Revoke-Token': revokeToken },
      });
      if (!response.ok) throw new Error('Could not revoke this share link.');
      setShareId('');
      setRevokeToken('');
      setShareUrl('');
      shareRevokedRef.current = true;
      setShareError('Share link revoked.');
    } catch (error) {
      setShareError(error instanceof Error ? error.message : 'Could not revoke this share link.');
    }
  };

  const shareTextEncoded = encodeURIComponent(
    `Check out my Hast Rekha palm reading from Palmora AI! My archetype is ${reading.handShape.element} Hand with ${reading.handShape.temperament}. Discover yours:`
  );
  const encodedUrl = encodeURIComponent(shareUrl);

  const getElementIcon = (element: string) => {
    const el = element.toLowerCase();
    if (el.includes('fire')) return <Flame className="w-4 h-4 text-amber-500" />;
    if (el.includes('water')) return <Droplet className="w-4 h-4 text-cyan-400" />;
    if (el.includes('earth')) return <Mountain className="w-4 h-4 text-emerald-400" />;
    return <Wind className="w-4 h-4 text-purple-400" />;
  };

  // High-res canvas export of the social card
  const handleDownloadCard = () => {
    setIsDownloadingImage(true);
    const canvas = document.createElement('canvas');
    let width = 1200;
    let height = 630;

    if (format === 'square') {
      width = 1080;
      height = 1080;
    } else if (format === 'story') {
      width = 1080;
      height = 1920;
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsDownloadingImage(false);
      return;
    }

    // 1. Dark celestial cosmic background
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (theme === 'violet') {
      bgGrad.addColorStop(0, '#050414');
      bgGrad.addColorStop(0.5, '#130c2a');
      bgGrad.addColorStop(1, '#070617');
    } else if (theme === 'emerald') {
      bgGrad.addColorStop(0, '#030e0e');
      bgGrad.addColorStop(0.5, '#071d18');
      bgGrad.addColorStop(1, '#040d0f');
    } else {
      bgGrad.addColorStop(0, '#070815');
      bgGrad.addColorStop(0.5, '#191209');
      bgGrad.addColorStop(1, '#050610');
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Astrological border
    ctx.strokeStyle = theme === 'violet' ? 'rgba(168, 85, 247, 0.35)' : theme === 'emerald' ? 'rgba(16, 185, 129, 0.35)' : 'rgba(234, 179, 8, 0.35)';
    ctx.lineWidth = Math.round(width * 0.008);
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // Inner hairline border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.strokeRect(42, 42, width - 84, height - 84);

    // 3. Load palm image thumbnail
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      // Draw thumbnail
      const thumbW = width * 0.28;
      const thumbH = thumbW * 1.25;
      const thumbX = width - thumbW - 70;
      const thumbY = (height - thumbH) / 2;

      ctx.save();
      // Rounded clipping path
      const r = 24;
      ctx.beginPath();
      ctx.moveTo(thumbX + r, thumbY);
      ctx.arcTo(thumbX + thumbW, thumbY, thumbX + thumbW, thumbY + thumbH, r);
      ctx.arcTo(thumbX + thumbW, thumbY + thumbH, thumbX, thumbY + thumbH, r);
      ctx.arcTo(thumbX, thumbY + thumbH, thumbX, thumbY, r);
      ctx.arcTo(thumbX, thumbY, thumbX + thumbW, thumbY, r);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, thumbX, thumbY, thumbW, thumbH);
      ctx.restore();

      // Border around palm
      ctx.strokeStyle = theme === 'violet' ? '#c084fc' : theme === 'emerald' ? '#34d399' : '#f59e0b';
      ctx.lineWidth = 3;
      ctx.strokeRect(thumbX, thumbY, thumbW, thumbH);

      // 4. Branding & Typography
      ctx.fillStyle = theme === 'violet' ? '#e9d5ff' : theme === 'emerald' ? '#a7f3d0' : '#fde68a';
      ctx.font = 'bold 22px Cinzel, serif';
      ctx.fillText('PALMORA AI · HAST REKHA SHASTRA', 80, 100);

      // Hand Element Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Cinzel, serif';
      ctx.fillText(`${reading.handShape.element} Hand Archetype`, 80, 170);

      // Dominant Hand & Temperament
      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px system-ui, sans-serif';
      ctx.fillText(
        `${dominantHand.toUpperCase()} HAND · ${reading.handShape.temperament}`,
        80,
        215
      );

      // Core Traits bullets
      ctx.fillStyle = theme === 'violet' ? '#c084fc' : theme === 'emerald' ? '#34d399' : '#fbbf24';
      ctx.font = 'bold 20px system-ui, sans-serif';
      ctx.fillText('CORE PERSONALITY SIGNS', 80, 275);

      ctx.fillStyle = '#e2e8f0';
      ctx.font = '20px system-ui, sans-serif';
      const traits = reading.personality.coreTraits.slice(0, 3);
      traits.forEach((t, i) => {
        ctx.fillText(`✦  ${t}`, 80, 315 + i * 36);
      });

      // Money Triangle & Love indicators
      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px system-ui, sans-serif';
      ctx.fillText(`Dhan Yoga (Money Triangle): ${reading.wealthAndProsperity.moneyTriangle.substring(0, 60)}...`, 80, 440);

      // Proverb Quote Banner at bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(80, height - 140, width - 160, 64);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.strokeRect(80, height - 140, width - 160, 64);

      ctx.fillStyle = '#fef08a';
      ctx.font = 'italic 18px Georgia, serif';
      ctx.fillText(`"${reading.blessingQuote}"`, 105, height - 100);

      // Watermark URL
      ctx.fillStyle = '#64748b';
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillText('Get your free palm reading at Palmora AI', 80, height - 48);

      // Export file
      const link = document.createElement('a');
      link.download = `Palmora_AI_${reading.handShape.element}_Hand_Reading.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloadingImage(false);
    };

    img.onerror = () => {
      setIsDownloadingImage(false);
      alert('Could not render image onto card.');
    };
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-[#090b1c] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white font-cinzel">
                Share <span className="text-antique-gold">Your Palm Reading</span>
              </h3>
              <p className="text-xs text-slate-400">
                Generate a social preview card or shareable deep link to post on your channels
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Customization Controls: Layout & Theme */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          {/* Format selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Format:</span>
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setFormat('landscape')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  format === 'landscape'
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Feed (16:9)
              </button>
              <button
                onClick={() => setFormat('square')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  format === 'square'
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Square (1:1)
              </button>
              <button
                onClick={() => setFormat('story')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  format === 'story'
                    ? 'bg-amber-400 text-slate-950 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Story (9:16)
              </button>
            </div>
          </div>

          {/* Theme selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aura:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTheme('gold')}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  theme === 'gold' ? 'border-white scale-110' : 'border-transparent'
                } bg-gradient-to-tr from-amber-600 to-amber-300`}
                title="Antique Gold"
              />
              <button
                onClick={() => setTheme('violet')}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  theme === 'violet' ? 'border-white scale-110' : 'border-transparent'
                } bg-gradient-to-tr from-purple-800 to-purple-400`}
                title="Cosmic Violet"
              />
              <button
                onClick={() => setTheme('emerald')}
                className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                  theme === 'emerald' ? 'border-white scale-110' : 'border-transparent'
                } bg-gradient-to-tr from-emerald-800 to-emerald-400`}
                title="Prana Emerald"
              />
            </div>
          </div>
        </div>

        {/* Live Social Card Preview */}
        <div className="flex justify-center">
          <div
            ref={cardPreviewRef}
            className={`w-full rounded-2xl border transition-all duration-300 overflow-hidden relative p-6 sm:p-7 flex flex-col justify-between shadow-2xl select-none ${
              format === 'landscape'
                ? 'aspect-[1.91/1] max-w-xl'
                : format === 'square'
                ? 'aspect-square max-w-md'
                : 'aspect-[9/16] max-w-xs'
            } ${
              theme === 'violet'
                ? 'bg-gradient-to-br from-[#07051a] via-[#150d32] to-[#08061c] border-purple-500/40 text-purple-100 shadow-purple-950/50'
                : theme === 'emerald'
                ? 'bg-gradient-to-br from-[#020f0d] via-[#07241e] to-[#041210] border-emerald-500/40 text-emerald-100 shadow-emerald-950/50'
                : 'bg-gradient-to-br from-[#070817] via-[#1a1207] to-[#080a1c] border-amber-500/40 text-slate-100 shadow-amber-950/50'
            }`}
          >
            {/* Top Brand Tag */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-xs sm:text-sm font-bold tracking-wider text-antique-gold">
                  PALMORA AI
                </span>
                <span className="text-[9px] uppercase tracking-widest text-slate-400">
                  · Hast Rekha Shastra
                </span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-slate-300">
                {dominantHand.toUpperCase()} HAND
              </span>
            </div>

            {/* Middle Content */}
            <div className="grid grid-cols-12 gap-4 items-center my-auto">
              <div className="col-span-8 space-y-2">
                <div className="flex items-center gap-2">
                  {getElementIcon(reading.handShape.element)}
                  <h4 className="font-cinzel text-base sm:text-xl font-bold text-white leading-tight">
                    {reading.handShape.element} Hand Archetype
                  </h4>
                </div>
                <p className="text-[11px] text-slate-300 font-medium">
                  {reading.handShape.temperament}
                </p>

                <div className="pt-2 space-y-1 text-[11px] text-slate-300">
                  {reading.personality.coreTraits.slice(0, 3).map((t, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="text-amber-400">✦</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Palm Thumbnail */}
              <div className="col-span-4 flex justify-end">
                <div className="w-20 h-24 sm:w-24 sm:h-32 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-lg bg-slate-950 shrink-0">
                  <img
                    src={imageUrl}
                    alt="Palm preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Quote Banner */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
              <p className="italic text-amber-200/90 font-serif truncate max-w-[280px]">
                "{reading.blessingQuote}"
              </p>
              <span className="text-[9px] text-slate-500 font-mono">{window.location.host}</span>
            </div>
          </div>
        </div>

        {/* Action 1: Download Card Image */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleDownloadCard}
            disabled={isDownloadingImage}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-950" />
            <span>{isDownloadingImage ? 'Generating PNG...' : 'Download Card Image'}</span>
          </button>

          {/* Native Share on supported mobile */}
          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              onClick={handleNativeShare}
              disabled={!shareUrl}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smartphone className="w-4 h-4 text-purple-300" />
              <span>Share to Stories & Apps</span>
            </button>
          )}
        </div>

        {/* Action 2: Shareable Deep Link Box */}
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Shareable Deep Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl || (isGeneratingLink ? 'Generating shareable link...' : 'Share link unavailable')}
              className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none"
            />
            <button
              onClick={handleCopyLink}
              disabled={isGeneratingLink || !shareUrl}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-amber-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
          {shareError && <p role="alert" className="text-[11px] text-rose-300">{shareError}</p>}
          <div className="flex items-start justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              Anyone with the link can view this reading and palm image. It expires after 30 days; you can also revoke it here.
            </p>
            {shareId && revokeToken && (
              <button onClick={handleRevokeLink} className="shrink-0 text-[11px] text-rose-300 underline underline-offset-2">
                Revoke link
              </button>
            )}
          </div>
        </div>

        {/* Action 3: 1-Click Social Media Intention Links */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-medium text-slate-400">Post directly to:</span>
          <div className="flex items-center gap-2">
            {/* WhatsApp */}
            <a
              href={shareUrl ? `https://api.whatsapp.com/send?text=${shareTextEncoded}%20${encodedUrl}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!shareUrl}
              className={`px-3 py-1.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 text-xs font-medium flex items-center gap-1.5 transition-colors ${!shareUrl ? 'pointer-events-none opacity-50' : ''}`}
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* X / Twitter */}
            <a
              href={shareUrl ? `https://twitter.com/intent/tweet?text=${shareTextEncoded}&url=${encodedUrl}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!shareUrl}
              className={`px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors ${!shareUrl ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Twitter className="w-3.5 h-3.5 text-cyan-400" />
              <span>X (Twitter)</span>
            </a>

            {/* Telegram */}
            <a
              href={shareUrl ? `https://t.me/share/url?url=${encodedUrl}&text=${shareTextEncoded}` : undefined}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!shareUrl}
              className={`px-3 py-1.5 rounded-xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#0088cc] border border-[#0088cc]/40 text-xs font-medium flex items-center gap-1.5 transition-colors ${!shareUrl ? 'pointer-events-none opacity-50' : ''}`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
