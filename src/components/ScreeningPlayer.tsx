import { useEffect, useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  ShieldOff,
  Server,
} from 'lucide-react';
import { motion } from 'motion/react';
import { FilmItem } from '../types/cinema';

type StreamSource = 'thugtv' | 'vidstuck';

interface ScreeningPlayerProps {
  film: FilmItem;
  initialSeason?: number;
  initialEpisode?: number;
  episodeTitle?: string;
  onClose: () => void;
}

const STREAM_SOURCES: Array<{ id: StreamSource; label: string }> = [
  { id: 'thugtv', label: 'ThugTV' },
  { id: 'vidstuck', label: 'VidStuck' },
];

export function ScreeningPlayer({
  film,
  initialSeason = 1,
  initialEpisode = 1,
  episodeTitle,
  onClose,
}: ScreeningPlayerProps) {
  const [season, setSeason] = useState(initialSeason);
  const [episode, setEpisode] = useState(initialEpisode);
  const [source, setSource] = useState<StreamSource>('thugtv');
  const [adblockEnabled, setAdblockEnabled] = useState(true);

  useEffect(() => {
    setSeason(initialSeason);
    setEpisode(initialEpisode);
  }, [film.tmdbId, initialSeason, initialEpisode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // Block unexpected popup windows triggered from parent context while Ad-Shield is active
  useEffect(() => {
    if (!adblockEnabled) return;
    const originalOpen = window.open;
    window.open = () => null;
    return () => {
      window.open = originalOpen;
    };
  }, [adblockEnabled]);

  const isSeries = film.kind === 'series';

  const embedUrl =
    source === 'vidstuck'
      ? isSeries
        ? `https://vidstuck.cc/embed/tv/${film.tmdbId}/${season}/${episode}`
        : `https://vidstuck.cc/embed/movie/${film.tmdbId}`
      : isSeries
        ? `https://embed.thugtv.st/tv/${film.tmdbId}/${season}/${episode}`
        : `https://embed.thugtv.st/movie/${film.tmdbId}`;

  const totalSeasons = Math.max(film.seasons || film.seasonsList?.length || 1, 1);

  // Sandbox omits allow-popups, allow-popups-to-escape-sandbox, and allow-top-navigation
  // to block pop-under ads and forced ad redirects.
  const sandboxPolicy = adblockEnabled
    ? 'allow-scripts allow-same-origin allow-forms allow-presentation allow-encrypted-media'
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={`KD Movies player: ${film.title}`}
      className="fixed inset-0 z-[60] flex flex-col justify-between bg-[#040506] p-4 sm:p-6 lg:p-8"
    >
      {/* Top Bar inside Screening Room */}
      <div className="mx-auto flex w-full max-w-[1160px] flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#D4AF6A]">
            {isSeries
              ? `KD Movies · Season ${season} · Episode ${episode}`
              : 'KD Movies · Feature Presentation'}
          </p>
          <h2 className="truncate font-serif text-2xl font-medium text-[#F5F2EB]">
            {film.title}
            {episodeTitle ? ` — ${episodeTitle}` : ''}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Source Selector (ThugTV / VidStuck) */}
          <div
            role="group"
            aria-label="Stream source"
            className="flex items-center gap-1 rounded-full border border-white/12 bg-white/[0.04] p-1"
          >
            <Server className="ml-2 mr-1 h-3.5 w-3.5 text-[#D4AF6A]" />
            {STREAM_SOURCES.map((item) => {
              const active = source === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSource(item.id)}
                  className={`h-7 rounded-full px-3 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#D4AF6A] text-[#090A0B]'
                      : 'text-[#B8B4AA] hover:text-[#F5F2EB]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Ad-Shield Toggle */}
          <button
            type="button"
            onClick={() => setAdblockEnabled((prev) => !prev)}
            title={
              adblockEnabled
                ? 'Popup & redirect blocker active. Click to switch to unrestricted mode if a source needs it.'
                : 'Ad-Shield disabled. Click to block embed popups and redirects.'
            }
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
              adblockEnabled
                ? 'border-[#D4AF6A]/60 bg-[#D4AF6A]/15 text-[#E2C285]'
                : 'border-white/15 bg-white/[0.04] text-[#9C9A94] hover:text-[#F5F2EB]'
            }`}
          >
            {adblockEnabled ? (
              <ShieldCheck className="h-3.5 w-3.5" />
            ) : (
              <ShieldOff className="h-3.5 w-3.5" />
            )}
            <span>{adblockEnabled ? 'Adblock On' : 'Adblock Off'}</span>
          </button>

          {/* TV Season & Episode Controls */}
          {isSeries && (
            <div className="flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3 py-1.5 text-xs">
              <label htmlFor="player-season" className="text-[#8E8C86]">
                S
              </label>
              <select
                id="player-season"
                value={season}
                onChange={(e) => {
                  setSeason(Number(e.target.value));
                  setEpisode(1);
                }}
                className="bg-transparent font-mono text-[#F5F2EB] focus:outline-none cursor-pointer"
              >
                {Array.from({ length: totalSeasons }).map((_, idx) => (
                  <option
                    key={idx + 1}
                    value={idx + 1}
                    className="bg-[#0E1013] text-[#F5F2EB]"
                  >
                    {idx + 1}
                  </option>
                ))}
              </select>

              <span className="text-white/20">/</span>

              <button
                type="button"
                onClick={() => setEpisode((e) => Math.max(1, e - 1))}
                disabled={episode <= 1}
                aria-label="Previous episode"
                className="text-[#C8C4BA] hover:text-[#D4AF6A] disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              <span className="font-mono text-[#F5F2EB] tabular-nums">
                E{episode}
              </span>

              <button
                type="button"
                onClick={() => setEpisode((e) => e + 1)}
                aria-label="Next episode"
                className="text-[#C8C4BA] hover:text-[#D4AF6A] cursor-pointer"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Exit screening room"
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-4 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A] cursor-pointer"
          >
            <X className="h-4 w-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>
      </div>

      {/* Center Video Embed Viewport */}
      <div className="mx-auto my-auto flex w-full max-w-[1160px] items-center justify-center py-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/[0.1] bg-black shadow-[0_32px_90px_rgba(0,0,0,0.9)]">
          <iframe
            key={`${embedUrl}-${adblockEnabled ? 'shield' : 'open'}`}
            src={embedUrl}
            title={`${film.title} stream`}
            width="960"
            height="540"
            frameBorder="0"
            sandbox={sandboxPolicy}
            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
            allowFullScreen
            referrerPolicy="origin"
            className="h-full w-full border-0"
          />
        </div>
      </div>

      {/* Subtle Footer */}
      <div className="mx-auto flex w-full max-w-[1160px] flex-wrap items-center justify-between gap-2 text-xs text-[#7D7B75]">
        <span>
          {film.director} · {film.year} · Source:{' '}
          {source === 'vidstuck' ? 'VidStuck' : 'ThugTV'}
        </span>
        <span className="font-mono tabular-nums">
          TMDB #{film.tmdbId}
        </span>
      </div>
    </motion.div>
  );
}
