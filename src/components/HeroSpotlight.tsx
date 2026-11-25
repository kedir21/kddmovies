import { useEffect, useRef, useState } from 'react';
import { Play, Bookmark, Check, Info, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { FilmItem } from '../types/cinema';
import { CinemaImage } from './CinemaImage';

interface HeroSpotlightProps {
  spotlightFilms: FilmItem[];
  queueFilms: FilmItem[];
  watchlistIds: string[];
  onSelectFilm: (film: FilmItem) => void;
  onPlayFilm: (film: FilmItem) => void;
  onToggleWatchlist: (filmId: string) => void;
}

export function HeroSpotlight({
  spotlightFilms,
  queueFilms,
  watchlistIds,
  onSelectFilm,
  onPlayFilm,
  onToggleWatchlist,
}: HeroSpotlightProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % spotlightFilms.length);
    }, 8500);
    return () => window.clearInterval(timer);
  }, [spotlightFilms.length]);

  const activeFilm = spotlightFilms[activeIndex] ?? spotlightFilms[0];
  if (!activeFilm) return null;

  const isInWatchlist = watchlistIds.includes(activeFilm.id);

  return (
    <section
      ref={heroRef}
      aria-label="Featured cinema spotlight"
      className="mx-auto max-w-[1400px] px-5 pt-6 pb-8 sm:px-8 lg:px-10 lg:pt-8"
    >
      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
        {/* Dominant Focal Anchor (Left 8 columns) */}
        <div className="relative min-h-[430px] overflow-hidden rounded-xl border border-white/[0.08] bg-[#101215] sm:min-h-[480px] lg:col-span-8 lg:min-h-[520px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilm.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              style={{ y: imageY }}
              className="absolute inset-0"
            >
              <CinemaImage
                src={activeFilm.backdropUrl || activeFilm.posterUrl}
                alt={`${activeFilm.title} widescreen still`}
                title={activeFilm.title}
                loading="eager"
                className="h-full w-full"
              />
            </motion.div>
          </AnimatePresence>

          {/* Measured multi-stop cinema scrims */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#090A0B] via-[#090A0B]/45 to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#090A0B]/90 via-[#090A0B]/35 to-transparent"
          />

          {/* Top slide navigation markers */}
          <div className="relative z-10 flex items-center justify-between px-6 pt-6 sm:px-8">
            <div className="flex items-center gap-2.5">
              {spotlightFilms.map((film, idx) => (
                <button
                  key={film.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Show spotlight ${idx + 1}: ${film.title}`}
                  className="group py-2 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
                >
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-300 ${
                      idx === activeIndex
                        ? 'w-8 bg-[#D4AF6A]'
                        : 'w-4 bg-white/30 group-hover:bg-white/60'
                    }`}
                  />
                </button>
              ))}
            </div>

            <span className="font-mono text-[11px] tracking-[0.14em] text-[#C8C4BA] tabular-nums">
              0{activeIndex + 1} / 0{spotlightFilms.length}
            </span>
          </div>

          {/* Bottom Editorial Title & Actions */}
          <div className="relative z-10 flex h-[calc(100%-3.5rem)] flex-col justify-end p-6 sm:p-8 lg:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilm.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
              >
                <p className="mb-2 text-xs font-medium tracking-[0.12em] uppercase text-[#D4AF6A]">
                  Featured Screening · {activeFilm.director}
                </p>

                <h1 className="font-serif text-4xl font-medium leading-[1.03] tracking-tight text-[#F5F2EB] text-balance sm:text-5xl lg:text-[3.5rem]">
                  {activeFilm.title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[13px] text-[#C8C4BA] tabular-nums">
                  <span>{activeFilm.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeFilm.genres.join(' / ')}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeFilm.runtime}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#E2C285]">
                    ★ {activeFilm.rating.toFixed(1)} IMDb
                  </span>
                </div>

                <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-[#D8D4CA]/90 sm:text-[15px]">
                  {activeFilm.logline}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onPlayFilm(activeFilm)}
                    className="inline-flex h-11 items-center gap-2.5 rounded-md bg-[#D4AF6A] px-6 text-sm font-semibold text-[#090A0B] transition-colors duration-200 hover:bg-[#E2C285] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF6A] cursor-pointer whitespace-nowrap"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    <span>Watch Film</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectFilm(activeFilm)}
                    className="inline-flex h-11 items-center gap-2 rounded-md border border-white/20 bg-black/40 px-5 text-sm font-medium text-[#F5F2EB] backdrop-blur-md transition-colors duration-200 hover:border-white/40 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF6A] cursor-pointer whitespace-nowrap"
                  >
                    <Info className="h-4 w-4 text-[#D4AF6A]" />
                    <span>Film Dossier</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWatchlist(activeFilm.id)}
                    aria-label={
                      isInWatchlist
                        ? 'Remove from watchlist'
                        : 'Save to watchlist'
                    }
                    className={`inline-flex h-11 w-11 items-center justify-center rounded-md border backdrop-blur-md transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A] ${
                      isInWatchlist
                        ? 'border-[#D4AF6A]/60 bg-[#D4AF6A]/20 text-[#E2C285]'
                        : 'border-white/20 bg-black/40 text-[#F5F2EB] hover:border-white/40'
                    }`}
                  >
                    {isInWatchlist ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Companion Rail: Now Screening / Curator's Queue (Right 4 columns) */}
        <aside
          aria-label="Now screening queue"
          className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#0F1114] p-6 lg:col-span-4"
        >
          <div>
            <div className="flex items-baseline justify-between border-b border-white/[0.08] pb-4">
              <h2 className="font-serif text-2xl font-medium tracking-tight text-[#F5F2EB]">
                Now Screening
              </h2>
              <span className="text-xs text-[#8E8C86]">Salon Queue</span>
            </div>

            <div className="divide-y divide-white/[0.07]">
              {queueFilms.map((film) => (
                <div
                  key={film.id}
                  onClick={() => onSelectFilm(film)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectFilm(film);
                    }
                  }}
                  className="group flex cursor-pointer items-center gap-4 py-4 transition-colors focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
                >
                  <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-md bg-[#16191D]">
                    <CinemaImage
                      src={film.backdropUrl || film.posterUrl}
                      alt={film.title}
                      title={film.title}
                      className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayFilm(film);
                      }}
                      aria-label={`Play ${film.title}`}
                      className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100 cursor-pointer"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F5F2EB]/90 text-[#090A0B]">
                        <Play className="ml-0.5 h-3.5 w-3.5 fill-current" />
                      </span>
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="truncate text-[15px] font-medium text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A]">
                        {film.title}
                      </h3>
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#6F6D68] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#D4AF6A]" />
                    </div>
                    <p className="mt-1 truncate text-xs text-[#9C9A94]">
                      {film.director}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[11.5px] text-[#8E8C86] tabular-nums">
                      <span>{film.kind === 'series' ? 'Series' : 'Film'}</span>
                      <span aria-hidden="true">·</span>
                      <span>{film.runtime}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-[#C8C4BA]">
                        ★ {film.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-[#8E8C86]">
            Restored 4K masters and original-language cinema curated weekly for home projection.
          </div>
        </aside>
      </div>
    </section>
  );
}
