import { useEffect, useRef, useState } from 'react';
import {
  X,
  Play,
  Bookmark,
  Check,
  Share2,
  ArrowLeft,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';
import { Episode, FilmItem } from '../types/cinema';
import { getSimilarFilms } from '../data/catalog';
import { fetchTmdbDetails, fetchTmdbSeasonEpisodes } from '../services/tmdb';
import { CinemaImage } from './CinemaImage';
import { PosterCard } from './PosterCard';

interface FilmDetailViewProps {
  film: FilmItem;
  watchlistIds: string[];
  tmdbConfigured: boolean;
  onClose: () => void;
  onSelectFilm: (film: FilmItem) => void;
  onPlayFilm: (
    film: FilmItem,
    season?: number,
    episode?: number,
    episodeTitle?: string
  ) => void;
  onToggleWatchlist: (filmId: string) => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('');
}

export function FilmDetailView({
  film: initialFilm,
  watchlistIds,
  tmdbConfigured,
  onClose,
  onSelectFilm,
  onPlayFilm,
  onToggleWatchlist,
}: FilmDetailViewProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [film, setFilm] = useState<FilmItem>(initialFilm);
  const [activeSeason, setActiveSeason] = useState<number>(1);
  const [episodes, setEpisodes] = useState<Episode[]>(initialFilm.episodes || []);
  const [loadingEpisodes, setLoadingEpisodes] = useState(false);
  const [copied, setCopied] = useState(false);

  const isInWatchlist = watchlistIds.includes(film.id);
  const similarFilms = getSimilarFilms(film);

  // Sync when user picks a different film
  useEffect(() => {
    setFilm(initialFilm);
    setActiveSeason(1);
    setEpisodes(initialFilm.episodes || []);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

    if (!tmdbConfigured) return;

    let cancelled = false;
    fetchTmdbDetails(initialFilm.kind, initialFilm.tmdbId)
      .then((hydrated) => {
        if (!cancelled && hydrated) {
          setFilm(hydrated);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [initialFilm, tmdbConfigured]);

  // Fetch season episodes for series when TMDB is configured
  useEffect(() => {
    if (film.kind !== 'series' || !tmdbConfigured) return;
    let cancelled = false;
    setLoadingEpisodes(true);

    fetchTmdbSeasonEpisodes(film.tmdbId, activeSeason)
      .then((eps) => {
        if (!cancelled) {
          setEpisodes(eps);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingEpisodes(false);
      });

    return () => {
      cancelled = true;
    };
  }, [film.tmdbId, film.kind, activeSeason, tmdbConfigured]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/#film=${film.id}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const seasonsList =
    film.seasonsList && film.seasonsList.length > 0
      ? film.seasonsList
      : film.kind === 'series'
        ? Array.from({ length: Math.max(film.seasons || 1, 1) }).map((_, i) => ({
            seasonNumber: i + 1,
            name: `Season ${i + 1}`,
            episodeCount: 0,
          }))
        : [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      role="dialog"
      aria-modal="true"
      aria-label={`${film.title} film dossier`}
      ref={scrollContainerRef}
      className="fixed inset-0 z-50 overflow-y-auto bg-[#090A0B]"
    >
      {/* Top sticky navigation inside Details View */}
      <div className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#090A0B]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8 lg:px-10">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 items-center gap-2 text-sm font-medium text-[#C8C4BA] transition-colors hover:text-[#F5F2EB] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Collection</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dossier"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] text-[#F5F2EB] transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Immersive Backdrop Header */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] overflow-hidden">
          <CinemaImage
            src={film.backdropUrl || film.posterUrl}
            alt=""
            className="h-full w-full scale-105 opacity-35 blur-sm"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#090A0B]/40 via-[#090A0B]/75 to-[#090A0B]" />
        </div>

        {/* Main Film Monograph Content */}
        <div className="relative z-10 mx-auto max-w-[1320px] px-5 pt-10 pb-16 sm:px-8 lg:px-10 lg:pt-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Left Column: Crisp Portrait Poster */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto w-full max-w-[340px] lg:col-span-4 lg:max-w-none"
            >
              <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#121417] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.85)] aspect-[3/4]">
                <CinemaImage
                  src={film.posterUrl}
                  alt={`${film.title} poster`}
                  title={film.title}
                  loading="eager"
                  className="h-full w-full"
                />
              </div>
            </motion.div>

            {/* Right Column: Editorial Title, Synopsis, Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-center lg:col-span-8"
            >
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#D4AF6A]">
                {film.kind === 'series'
                  ? `Series · ${film.seasons || 1} ${(film.seasons || 1) === 1 ? 'Season' : 'Seasons'}`
                  : `Feature Film · ${film.specs.aspectRatio}`}
              </p>

              <h1 className="mt-3 font-serif text-4xl font-medium leading-[1.04] tracking-tight text-[#F5F2EB] text-balance sm:text-5xl lg:text-6xl">
                {film.title}
              </h1>

              {film.subtitle && (
                <p className="mt-2 font-serif text-xl italic text-[#B8B4AA]">
                  {film.subtitle}
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-sm text-[#C8C4BA] tabular-nums">
                <span>{film.director}</span>
                <span aria-hidden="true">·</span>
                <span>{film.year}</span>
                <span aria-hidden="true">·</span>
                <span>{film.runtime}</span>
                <span aria-hidden="true">·</span>
                <span>{film.genres.join(' / ')}</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#E2C285]">★ {film.rating.toFixed(1)} TMDB</span>
              </div>

              {/* Action Controls */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    onPlayFilm(
                      film,
                      activeSeason,
                      1,
                      episodes[0]?.title
                    )
                  }
                  className="inline-flex h-11 items-center gap-2.5 rounded-md bg-[#D4AF6A] px-6 text-sm font-semibold text-[#090A0B] transition-colors hover:bg-[#E2C285] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF6A] whitespace-nowrap"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>
                    {film.kind === 'series'
                      ? `Watch S${activeSeason} · E1`
                      : 'Watch Film'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleWatchlist(film.id)}
                  className={`inline-flex h-11 items-center gap-2 rounded-md border px-5 text-sm font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A] whitespace-nowrap ${
                    isInWatchlist
                      ? 'border-[#D4AF6A]/60 bg-[#D4AF6A]/15 text-[#E2C285]'
                      : 'border-white/20 bg-white/[0.04] text-[#F5F2EB] hover:border-white/40 hover:bg-white/[0.08]'
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4" />
                      <span>Add to Watchlist</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleShare}
                  className="inline-flex h-11 items-center gap-2 rounded-md border border-white/15 bg-white/[0.03] px-4 text-sm font-medium text-[#C8C4BA] transition-colors hover:border-white/35 hover:text-[#F5F2EB] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A] whitespace-nowrap"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{copied ? 'Link Copied' : 'Share'}</span>
                </button>
              </div>

              {/* Synopsis */}
              <div className="mt-8 max-w-2xl space-y-5 border-t border-white/[0.08] pt-6">
                <p className="text-[15.5px] leading-[1.72] text-[#E6E2D8]">
                  {film.synopsis}
                </p>

                <div className="rounded-lg border border-white/[0.08] bg-[#101215] p-5">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#D4AF6A]">
                    Editorial Note
                  </p>
                  <p className="mt-2 font-serif text-lg italic leading-relaxed text-[#D8D4CA]">
                    “{film.curatorNote}”
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Series Episode Guide */}
          {film.kind === 'series' && (
            <section className="mt-16 border-t border-white/[0.08] pt-10">
              <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[#F5F2EB]">
                    Episode Guide
                  </h2>
                  <p className="mt-1 text-xs text-[#8E8C86] tabular-nums">
                    Select any episode to launch playback
                  </p>
                </div>

                {seasonsList.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                    {seasonsList.map((s) => (
                      <button
                        key={s.seasonNumber}
                        type="button"
                        onClick={() => setActiveSeason(s.seasonNumber)}
                        className={`h-9 rounded-md px-3.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          activeSeason === s.seasonNumber
                            ? 'bg-[#D4AF6A] text-[#090A0B]'
                            : 'bg-white/[0.05] text-[#B8B4AA] hover:bg-white/[0.1] hover:text-[#F5F2EB]'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="divide-y divide-white/[0.07] rounded-xl border border-white/[0.08] bg-[#0F1114]">
                {loadingEpisodes ? (
                  <div className="space-y-3 p-6">
                    <div className="skeleton-shimmer h-14 w-full rounded-lg" />
                    <div className="skeleton-shimmer h-14 w-full rounded-lg" />
                    <div className="skeleton-shimmer h-14 w-full rounded-lg" />
                  </div>
                ) : episodes.length === 0 ? (
                  <div className="p-8 text-center text-sm text-[#8E8C86]">
                    No episode metadata available for Season {activeSeason}.
                  </div>
                ) : (
                  episodes.map((ep) => (
                    <div
                      key={`${activeSeason}-${ep.number}`}
                      onClick={() =>
                        onPlayFilm(film, activeSeason, ep.number, ep.title)
                      }
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onPlayFilm(film, activeSeason, ep.number, ep.title);
                        }
                      }}
                      className="group flex flex-col justify-between gap-4 p-5 transition-colors hover:bg-white/[0.03] sm:flex-row sm:items-center cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        {ep.stillUrl ? (
                          <div className="hidden aspect-[16/9] w-28 shrink-0 overflow-hidden rounded-md bg-[#16191D] sm:block">
                            <CinemaImage
                              src={ep.stillUrl}
                              alt={ep.title}
                              className="h-full w-full"
                            />
                          </div>
                        ) : (
                          <span className="font-mono text-sm text-[#D4AF6A] tabular-nums pt-0.5">
                            {String(ep.number).padStart(2, '0')}
                          </span>
                        )}

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-[#D4AF6A] tabular-nums">
                              E{String(ep.number).padStart(2, '0')}
                            </span>
                            <h3 className="text-base font-medium text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A]">
                              {ep.title}
                            </h3>
                          </div>
                          <p className="mt-1 max-w-2xl text-sm text-[#9C9A94] line-clamp-2">
                            {ep.synopsis}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-center shrink-0">
                        <span className="inline-flex items-center gap-1.5 text-xs text-[#8E8C86] tabular-nums">
                          <Clock className="h-3.5 w-3.5" />
                          {ep.duration}
                        </span>
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[#F5F2EB] transition-colors group-hover:border-[#D4AF6A] group-hover:bg-[#D4AF6A] group-hover:text-[#090A0B]">
                          <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* Cast & Technical Exhibition Specs */}
          <section className="mt-16 grid grid-cols-1 gap-12 border-t border-white/[0.08] pt-10 lg:grid-cols-12">
            {/* Cast Gallery (7 cols) */}
            <div className="lg:col-span-7">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[#F5F2EB]">
                Principal Cast
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {film.cast.map((member) => (
                  <div
                    key={`${member.name}-${member.role}`}
                    className="flex items-center gap-4 rounded-lg border border-white/[0.07] bg-[#0F1114] p-4"
                  >
                    {member.profileUrl ? (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/15 bg-[#15181C]">
                        <CinemaImage
                          src={member.profileUrl}
                          alt={member.name}
                          className="h-full w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#D4AF6A]/35 bg-[#15181C] font-serif text-lg font-medium text-[#D4AF6A]">
                        {getInitials(member.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-[#F5F2EB]">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-[#A8A6A0]">
                        as {member.role}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-[#777570]">
                        {member.billing} · {member.notable}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Specs Dossier (5 cols) */}
            <div className="lg:col-span-5">
              <h2 className="font-serif text-3xl font-medium tracking-tight text-[#F5F2EB]">
                Exhibition Specs
              </h2>
              <dl className="mt-6 divide-y divide-white/[0.07] border-y border-white/[0.07] text-sm">
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#8E8C86]">Cinematography</dt>
                  <dd className="text-right font-medium text-[#F5F2EB]">
                    {film.specs.cinematography}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#8E8C86]">Original Score</dt>
                  <dd className="text-right font-medium text-[#F5F2EB]">
                    {film.specs.composer}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#8E8C86]">Aspect Ratio</dt>
                  <dd className="text-right font-medium text-[#F5F2EB] tabular-nums">
                    {film.specs.aspectRatio}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#8E8C86]">Master Format</dt>
                  <dd className="text-right font-medium text-[#F5F2EB]">
                    {film.specs.format}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#8E8C86]">Sound Mix</dt>
                  <dd className="text-right font-medium text-[#F5F2EB]">
                    {film.specs.soundMix}
                  </dd>
                </div>
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-[#8E8C86]">Origin & Language</dt>
                  <dd className="text-right font-medium text-[#F5F2EB]">
                    {film.specs.country} · {film.specs.language}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Refined Similar Curations */}
          {similarFilms.length > 0 && (
            <section className="mt-16 border-t border-white/[0.08] pt-10">
              <div className="mb-7 flex items-baseline justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-medium tracking-tight text-[#F5F2EB]">
                    Paired Curations
                  </h2>
                  <p className="mt-1 text-sm text-[#8E8C86]">
                    Recommended companions from the archive
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
                {similarFilms.map((item, idx) => (
                  <PosterCard
                    key={item.id}
                    film={item}
                    index={idx}
                    size="large"
                    isInWatchlist={watchlistIds.includes(item.id)}
                    onSelect={onSelectFilm}
                    onPlay={(selected) => onPlayFilm(selected, 1, 1)}
                    onToggleWatchlist={() => onToggleWatchlist(item.id)}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </motion.div>
  );
}
