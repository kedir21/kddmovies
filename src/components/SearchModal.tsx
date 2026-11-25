import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, ArrowUpRight, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { CATALOG, GENRES } from '../data/catalog';
import {
  FILTER_TO_TMDB_MOVIE_GENRE,
  fetchTmdbBrowse,
  searchTmdbCatalog,
} from '../services/tmdb';
import { FilmItem } from '../types/cinema';
import { CinemaImage } from './CinemaImage';

interface SearchModalProps {
  tmdbConfigured: boolean;
  onClose: () => void;
  onSelectFilm: (film: FilmItem) => void;
}

export function SearchModal({
  tmdbConfigured,
  onClose,
  onSelectFilm,
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [quickGenre, setQuickGenre] = useState<string>('All');
  const [remoteResults, setRemoteResults] = useState<FilmItem[] | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
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

  // Initial / debounced page 1 fetch when query or quickGenre changes
  useEffect(() => {
    if (!tmdbConfigured) {
      setRemoteResults(null);
      setPage(1);
      setTotalPages(1);
      setIsSearching(false);
      return;
    }

    const trimmed = query.trim();
    let cancelled = false;
    setIsSearching(true);

    const timer = window.setTimeout(async () => {
      try {
        const res = trimmed
          ? await searchTmdbCatalog(trimmed, 1)
          : quickGenre === 'Series'
            ? await fetchTmdbBrowse('tv', undefined, 'popularity', 1)
            : await fetchTmdbBrowse(
                'movie',
                FILTER_TO_TMDB_MOVIE_GENRE[quickGenre],
                'popularity',
                1
              );

        if (!cancelled) {
          setRemoteResults(res.items);
          setPage(res.page);
          setTotalPages(res.totalPages);
        }
      } catch {
        if (!cancelled) {
          setRemoteResults(null);
          setPage(1);
          setTotalPages(1);
        }
      } finally {
        if (!cancelled) setIsSearching(false);
      }
    }, trimmed ? 260 : 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, quickGenre, tmdbConfigured]);

  const loadNextPage = useCallback(async () => {
    if (!tmdbConfigured || isSearching || isLoadingMore || page >= totalPages) {
      return;
    }

    const nextPage = page + 1;
    const trimmed = query.trim();
    setIsLoadingMore(true);

    try {
      const res = trimmed
        ? await searchTmdbCatalog(trimmed, nextPage)
        : quickGenre === 'Series'
          ? await fetchTmdbBrowse('tv', undefined, 'popularity', nextPage)
          : await fetchTmdbBrowse(
              'movie',
              FILTER_TO_TMDB_MOVIE_GENRE[quickGenre],
              'popularity',
              nextPage
            );

      setRemoteResults((prev) => {
        const base = prev || [];
        const seen = new Set(base.map((item) => item.id));
        const uniqueNew = res.items.filter((item) => !seen.has(item.id));
        return [...base, ...uniqueNew];
      });
      setPage(res.page);
      setTotalPages(res.totalPages);
    } catch {
      // Keep existing results on transient error
    } finally {
      setIsLoadingMore(false);
    }
  }, [
    tmdbConfigured,
    isSearching,
    isLoadingMore,
    page,
    totalPages,
    query,
    quickGenre,
  ]);

  // Infinite scroll IntersectionObserver inside search modal
  useEffect(() => {
    const root = scrollContainerRef.current;
    const sentinel = sentinelRef.current;
    if (!root || !sentinel || !tmdbConfigured) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadNextPage();
        }
      },
      { root, rootMargin: '180px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage, tmdbConfigured]);

  const results = useMemo(() => {
    const base = remoteResults !== null ? remoteResults : CATALOG;
    const q = query.trim().toLowerCase();

    return base.filter((item) => {
      const matchesGenre =
        quickGenre === 'All'
          ? true
          : quickGenre === 'Series'
            ? item.kind === 'series'
            : item.genres.includes(quickGenre);

      if (!matchesGenre) return false;
      if (remoteResults !== null || !q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.director.toLowerCase().includes(q) ||
        item.genres.some((g) => g.toLowerCase().includes(q)) ||
        item.specs.country.toLowerCase().includes(q) ||
        item.cast.some((c) => c.name.toLowerCase().includes(q)) ||
        item.logline.toLowerCase().includes(q)
      );
    });
  }, [query, quickGenre, remoteResults]);

  const hasMore = tmdbConfigured && page < totalPages;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label="Search KD Movies archive"
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-4 pt-16 pb-10 backdrop-blur-xl sm:pt-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0E1013] shadow-[0_32px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] px-5 py-4">
          <Search className="h-5 w-5 shrink-0 text-[#D4AF6A]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any movie or series via TMDB..."
            className="flex-1 bg-transparent text-base text-[#F5F2EB] placeholder:text-[#706E69] focus:outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-xs text-[#8E8C86] hover:text-[#F5F2EB] cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#9C9A94] hover:text-[#F5F2EB] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Genre Quick Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-white/[0.06] px-5 py-3">
          {GENRES.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => setQuickGenre(genre)}
              className={`h-8 rounded-md px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                quickGenre === genre
                  ? 'bg-[#D4AF6A] text-[#090A0B]'
                  : 'bg-white/[0.04] text-[#9C9A94] hover:bg-white/[0.08] hover:text-[#F5F2EB]'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Infinite Search Results */}
        <div ref={scrollContainerRef} className="overflow-y-auto p-4 sm:p-5">
          {isSearching ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton-shimmer h-20 rounded-xl" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-serif text-2xl text-[#F5F2EB]">
                No matching works found
              </p>
              <p className="mt-1.5 text-sm text-[#8E8C86]">
                Try a different movie title, series name, or reset the genre filter.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {results.map((film) => (
                  <button
                    key={film.id}
                    type="button"
                    onClick={() => {
                      onSelectFilm(film);
                      onClose();
                    }}
                    className="group flex items-center gap-4 rounded-xl border border-transparent p-2.5 text-left transition-colors hover:border-white/[0.08] hover:bg-white/[0.04] cursor-pointer"
                  >
                    <div className="aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-md bg-[#16191D]">
                      <CinemaImage
                        src={film.posterUrl}
                        alt={film.title}
                        title={film.title}
                        className="h-full w-full"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-medium text-[#F5F2EB] group-hover:text-[#D4AF6A]">
                          {film.title}
                        </h3>
                        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-[#6E6C67] group-hover:text-[#D4AF6A]" />
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#9C9A94]">
                        {film.kind === 'series' ? 'TV Series' : 'Feature Film'}
                      </p>
                      <p className="mt-1 text-[11px] text-[#7D7B75] tabular-nums">
                        {film.year} · {film.genres[0]} · ★ {film.rating.toFixed(1)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Infinite scroll sentinel & status */}
              {hasMore && (
                <div
                  ref={sentinelRef}
                  className="mt-5 flex items-center justify-center py-2"
                >
                  {isLoadingMore ? (
                    <span className="inline-flex items-center gap-2 text-xs text-[#9C9A94]">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#D4AF6A]" />
                      Loading more results...
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={loadNextPage}
                      className="rounded-full border border-white/12 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-[#C8C4BA] transition-colors hover:border-[#D4AF6A]/50 hover:text-[#F5F2EB] cursor-pointer"
                    >
                      Load More Results
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
