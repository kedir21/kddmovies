import { useEffect, useMemo, useRef, useState } from 'react';
import { Bookmark, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CuratedCollection, FilmItem } from '../types/cinema';
import { PosterCard, PosterCardSkeleton } from './PosterCard';

export type SortOption = 'curated' | 'rating' | 'year' | 'runtime';

interface CollectionGridViewProps {
  kicker: string;
  title: string;
  description: string;
  films: FilmItem[];
  watchlistIds: string[];
  isLoading?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
  sortOrder?: SortOption;
  onSortOrderChange?: (sort: SortOption) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
  onSelectFilm: (film: FilmItem) => void;
  onPlayFilm: (film: FilmItem) => void;
  onToggleWatchlist: (filmId: string) => void;
  showSort?: boolean;
}

export function CollectionGridView({
  kicker,
  title,
  description,
  films,
  watchlistIds,
  isLoading = false,
  hasMore = false,
  isLoadingMore = false,
  onLoadMore,
  sortOrder,
  onSortOrderChange,
  emptyTitle = 'No works match this selection',
  emptyDescription = 'Adjust your active filters or explore the full salon archive.',
  onEmptyAction,
  emptyActionLabel = 'Return to Discover',
  onSelectFilm,
  onPlayFilm,
  onToggleWatchlist,
  showSort = true,
}: CollectionGridViewProps) {
  const [localSort, setLocalSort] = useState<SortOption>('curated');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const activeSort = sortOrder ?? localSort;

  const handleSortChange = (next: SortOption) => {
    if (onSortOrderChange) {
      onSortOrderChange(next);
    } else {
      setLocalSort(next);
    }
  };

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !isLoadingMore && !isLoading) {
          onLoadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading, onLoadMore]);

  const sortedFilms = useMemo(() => {
    if (onSortOrderChange) return films;
    const copy = [...films];
    if (activeSort === 'rating') return copy.sort((a, b) => b.rating - a.rating);
    if (activeSort === 'year') return copy.sort((a, b) => b.year - a.year);
    if (activeSort === 'runtime')
      return copy.sort((a, b) => b.runtimeMinutes - a.runtimeMinutes);
    return copy;
  }, [films, activeSort, onSortOrderChange]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10"
    >
      <div className="mb-10 flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#D4AF6A]">
            {kicker}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-[#F5F2EB] text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#9C9A94] sm:text-base">
            {description}
          </p>
        </div>

        {showSort && films.length > 1 && (
          <div className="flex items-center gap-3 shrink-0">
            <label
              htmlFor="sort-order"
              className="text-xs tracking-[0.06em] uppercase text-[#8E8C86]"
            >
              Order
            </label>
            <select
              id="sort-order"
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value as SortOption)}
              className="h-10 rounded-md border border-white/[0.12] bg-[#101215] px-3.5 text-xs font-medium text-[#F5F2EB] focus:border-[#D4AF6A] focus:outline-none cursor-pointer"
            >
              <option value="curated">Popular & Curated</option>
              <option value="rating">Highest Rated</option>
              <option value="year">Release Year</option>
              {!onSortOrderChange && <option value="runtime">Duration</option>}
            </select>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-7">
          {Array.from({ length: 10 }).map((_, idx) => (
            <PosterCardSkeleton key={idx} />
          ))}
        </div>
      ) : sortedFilms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/[0.07] bg-[#0D0F12] px-6 py-20 text-center">
          <Bookmark className="mb-4 h-7 w-7 text-[#D4AF6A]/65" strokeWidth={1.35} />
          <h2 className="font-serif text-3xl font-medium text-[#F5F2EB]">
            {emptyTitle}
          </h2>
          <p className="mt-2 max-w-md text-sm text-[#8E8C86]">
            {emptyDescription}
          </p>
          {onEmptyAction && (
            <button
              type="button"
              onClick={onEmptyAction}
              className="mt-6 inline-flex h-10 items-center gap-2 rounded-md bg-[#D4AF6A] px-5 text-xs font-semibold text-[#090A0B] transition-colors hover:bg-[#E2C285] cursor-pointer"
            >
              <span>{emptyActionLabel}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-x-7 lg:gap-y-11">
            {sortedFilms.map((film, idx) => (
              <PosterCard
                key={film.id}
                film={film}
                index={idx % 10}
                size="large"
                isInWatchlist={watchlistIds.includes(film.id)}
                onSelect={onSelectFilm}
                onPlay={onPlayFilm}
                onToggleWatchlist={onToggleWatchlist}
              />
            ))}
          </div>

          {hasMore && onLoadMore && (
            <div
              ref={sentinelRef}
              className="mt-12 flex flex-col items-center justify-center gap-3"
            >
              {isLoadingMore ? (
                <div className="grid w-full grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 lg:gap-7">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <PosterCardSkeleton key={`more-${idx}`} />
                  ))}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onLoadMore}
                  className="inline-flex h-10 items-center gap-2 rounded-full border border-white/[0.14] bg-white/[0.04] px-6 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A] cursor-pointer"
                >
                  <Loader2 className="h-3.5 w-3.5 opacity-0" />
                  <span>Load More Titles</span>
                </button>
              )}
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}

interface CollectionsPageProps {
  collections: CuratedCollection[];
  allFilms: FilmItem[];
  watchlistIds: string[];
  focusedCollectionId: string | null;
  onFocusCollection: (id: string | null) => void;
  onSelectFilm: (film: FilmItem) => void;
  onPlayFilm: (film: FilmItem) => void;
  onToggleWatchlist: (filmId: string) => void;
}

export function CollectionsPage({
  collections,
  allFilms,
  watchlistIds,
  focusedCollectionId,
  onFocusCollection,
  onSelectFilm,
  onPlayFilm,
  onToggleWatchlist,
}: CollectionsPageProps) {
  const visibleCollections = focusedCollectionId
    ? collections.filter((c) => c.id === focusedCollectionId)
    : collections;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8 lg:px-10"
    >
      <div className="mb-12 flex flex-col justify-between gap-6 border-b border-white/[0.08] pb-8 sm:flex-row sm:items-end">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#D4AF6A]">
            Seasonal Archive
          </p>
          <h1 className="mt-2 font-serif text-4xl font-medium tracking-tight text-[#F5F2EB] sm:text-5xl">
            Curated Editions
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-[#9C9A94] sm:text-base">
            Thematic film programs assembled around light, architecture, and human craft.
          </p>
        </div>

        {focusedCollectionId && (
          <button
            type="button"
            onClick={() => onFocusCollection(null)}
            className="inline-flex h-10 items-center rounded-md border border-white/15 px-4 text-xs font-medium text-[#F5F2EB] transition-colors hover:border-[#D4AF6A]/60 hover:text-[#D4AF6A] cursor-pointer whitespace-nowrap shrink-0"
          >
            Show All Editions
          </button>
        )}
      </div>

      <div className="space-y-16">
        {visibleCollections.map((collection) => {
          const collectionFilms = collection.filmIds
            .map((id) => allFilms.find((f) => f.id === id))
            .filter((f): f is FilmItem => Boolean(f));

          return (
            <section
              key={collection.id}
              className="border-b border-white/[0.07] pb-14 last:border-none"
            >
              <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-end">
                <div className="lg:col-span-6">
                  <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#D4AF6A]">
                    {collection.index} · {collection.curator}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#F5F2EB] sm:text-4xl">
                    {collection.title}
                  </h2>
                </div>
                <p className="text-sm leading-relaxed text-[#9C9A94] lg:col-span-6">
                  {collection.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 lg:gap-7">
                {collectionFilms.map((film, idx) => (
                  <PosterCard
                    key={film.id}
                    film={film}
                    index={idx}
                    size="large"
                    isInWatchlist={watchlistIds.includes(film.id)}
                    onSelect={onSelectFilm}
                    onPlay={onPlayFilm}
                    onToggleWatchlist={onToggleWatchlist}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </motion.div>
  );
}
