import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FilmItem } from '../types/cinema';
import { PosterCard } from './PosterCard';

interface PosterCarouselProps {
  title: string;
  subtitle?: string;
  films: FilmItem[];
  watchlistIds: string[];
  onSelectFilm: (film: FilmItem) => void;
  onPlayFilm: (film: FilmItem) => void;
  onToggleWatchlist: (filmId: string) => void;
  onViewAll?: () => void;
}

export function PosterCarousel({
  title,
  subtitle,
  films,
  watchlistIds,
  onSelectFilm,
  onPlayFilm,
  onToggleWatchlist,
  onViewAll,
}: PosterCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const updateScrollState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanScrollPrev(el.scrollLeft > 8);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [films.length]);

  const scrollByAmount = (direction: 'prev' | 'next') => {
    const el = trackRef.current;
    if (!el) return;
    const distance = Math.max(el.clientWidth * 0.72, 320);
    el.scrollBy({
      left: direction === 'next' ? distance : -distance,
      behavior: 'smooth',
    });
  };

  if (films.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-medium tracking-tight text-[#F5F2EB] sm:text-[2.15rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-[#8E8C86]">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onViewAll && (
            <button
              type="button"
              onClick={onViewAll}
              className="mr-2 hidden text-xs font-medium tracking-[0.06em] uppercase text-[#C8C4BA] transition-colors hover:text-[#D4AF6A] sm:inline-block cursor-pointer whitespace-nowrap"
            >
              View All
            </button>
          )}

          <button
            type="button"
            onClick={() => scrollByAmount('prev')}
            disabled={!canScrollPrev}
            aria-label={`Scroll ${title} left`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#101215] text-[#F5F2EB] transition-all duration-200 hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => scrollByAmount('next')}
            disabled={!canScrollNext}
            aria-label={`Scroll ${title} right`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.12] bg-[#101215] text-[#F5F2EB] transition-all duration-200 hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A] disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        onScroll={updateScrollState}
        className="no-scrollbar flex gap-5 overflow-x-auto pb-4 pt-2 sm:gap-6"
      >
        {films.map((film, idx) => (
          <PosterCard
            key={film.id}
            film={film}
            index={idx}
            isInWatchlist={watchlistIds.includes(film.id)}
            onSelect={onSelectFilm}
            onPlay={onPlayFilm}
            onToggleWatchlist={onToggleWatchlist}
          />
        ))}
      </div>
    </section>
  );
}
