import { useRef, useState, MouseEvent } from 'react';
import { Play, Bookmark, Check, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { FilmItem } from '../types/cinema';
import { CinemaImage } from './CinemaImage';

interface PosterCardProps {
  film: FilmItem;
  index?: number;
  isInWatchlist: boolean;
  onSelect: (film: FilmItem) => void;
  onPlay: (film: FilmItem) => void;
  onToggleWatchlist: (filmId: string) => void;
  size?: 'default' | 'compact' | 'large';
}

export function PosterCard({
  film,
  index = 0,
  isInWatchlist,
  onSelect,
  onPlay,
  onToggleWatchlist,
  size = 'default',
}: PosterCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTilt((prev) => ({ ...prev, hovered: true }));
      return;
    }
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const ry = (x - 0.5) * 10;
    const rx = (0.5 - y) * 10;
    setTilt({
      rx,
      ry,
      gx: x * 100,
      gy: y * 100,
      hovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 50, hovered: false });
  };

  const widthClass =
    size === 'compact'
      ? 'w-[164px] sm:w-[184px]'
      : size === 'large'
        ? 'w-full'
        : 'w-[196px] sm:w-[218px] lg:w-[232px]';

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.05, 0.3),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group shrink-0 select-none ${widthClass}`}
    >
      {/* 3D Perspective Poster Container */}
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(film)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect(film);
          }
        }}
        aria-label={`Open details for ${film.title}`}
        style={{
          transform: tilt.hovered
            ? `perspective(950px) rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) scale3d(1.028, 1.028, 1.028)`
            : 'perspective(950px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: tilt.hovered
            ? 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease'
            : 'transform 420ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 420ms ease',
          boxShadow: tilt.hovered
            ? '0 24px 48px -12px rgba(0, 0, 0, 0.78), 0 0 0 1px rgba(212, 175, 106, 0.24)'
            : '0 10px 24px -10px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        }}
        className="relative aspect-[3/4] w-full cursor-pointer overflow-hidden rounded-lg bg-[#121417] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF6A]"
      >
        <div className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
          <CinemaImage
            src={film.posterUrl}
            alt={`${film.title} cinema poster`}
            title={film.title}
            className="h-full w-full"
          />
        </div>

        {/* Subtle pointer specular sheen */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            opacity: tilt.hovered ? 1 : 0,
            background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.03) 38%, transparent 70%)`,
          }}
        />

        {/* Measured bottom scrim & refined controls revealed strictly on hover/focus */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col justify-end bg-gradient-to-t from-[#090A0B]/95 via-[#090A0B]/65 to-transparent p-3.5 pt-16 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
          <div className="mb-2.5 flex items-center justify-between text-[11px] tracking-[0.04em] text-[#D8D4CA]">
            <span>{film.genres[0]}</span>
            <span className="tabular-nums text-[#D4AF6A]">
              ★ {film.rating.toFixed(1)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlay(film);
              }}
              aria-label={`Watch ${film.title}`}
              className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md bg-[#D4AF6A] px-3 text-xs font-semibold text-[#090A0B] transition-colors hover:bg-[#E2C285] cursor-pointer whitespace-nowrap"
            >
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Watch</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleWatchlist(film.id);
              }}
              aria-label={
                isInWatchlist
                  ? `Remove ${film.title} from watchlist`
                  : `Add ${film.title} to watchlist`
              }
              title={isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
              className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                isInWatchlist
                  ? 'border-[#D4AF6A]/60 bg-[#D4AF6A]/20 text-[#E2C285]'
                  : 'border-white/20 bg-black/50 text-[#F5F2EB] hover:border-white/40 hover:bg-black/75'
              }`}
            >
              {isInWatchlist ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Bookmark className="h-3.5 w-3.5" />
              )}
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(film);
              }}
              aria-label={`Details for ${film.title}`}
              title="Open dossier"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-black/50 text-[#F5F2EB] transition-colors hover:border-white/40 hover:bg-black/75 cursor-pointer"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Minimal unboxed typography below poster */}
      <div className="mt-3 space-y-1 px-0.5">
        <button
          type="button"
          onClick={() => onSelect(film)}
          className="block w-full truncate text-left text-[15px] font-medium tracking-[0.01em] text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A] cursor-pointer"
        >
          {film.title}
        </button>
        <div className="flex items-center gap-1.5 text-[12px] text-[#8E8C86] tabular-nums">
          <span>{film.year}</span>
          <span aria-hidden="true">·</span>
          <span>{film.runtime}</span>
          <span aria-hidden="true">·</span>
          <span className="text-[#B8B4AA]">★ {film.rating.toFixed(1)}</span>
        </div>
      </div>
    </motion.article>
  );
}

export function PosterCardSkeleton() {
  return (
    <div className="w-full">
      <div className="skeleton-shimmer aspect-[3/4] w-full rounded-lg border border-white/[0.05]" />
      <div className="mt-3 space-y-2 px-0.5">
        <div className="skeleton-shimmer h-4 w-3/4 rounded" />
        <div className="skeleton-shimmer h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
