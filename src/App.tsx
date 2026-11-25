import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  CATALOG,
  CURATED_COLLECTIONS,
} from './data/catalog';
import {
  FILTER_TO_TMDB_MOVIE_GENRE,
  fetchHealthStatus,
  fetchTmdbBrowse,
  fetchTmdbDiscover,
} from './services/tmdb';
import { CuratedCollection, FilmItem, NavTab } from './types/cinema';
import { KDLogoMark, Navbar } from './components/Navbar';
import { HeroSpotlight } from './components/HeroSpotlight';
import { GenreBar, GenreFilter } from './components/GenreBar';
import { PosterCarousel } from './components/PosterCarousel';
import { AsymmetricShowcase } from './components/AsymmetricShowcase';
import { CuratedCollections } from './components/CuratedCollections';
import {
  CollectionGridView,
  CollectionsPage,
  SortOption,
} from './components/CollectionGridView';
import { FilmDetailView } from './components/FilmDetailView';
import { ScreeningPlayer } from './components/ScreeningPlayer';
import { SearchModal } from './components/SearchModal';

const WATCHLIST_ITEMS_STORAGE_KEY = 'kd_movies_watchlist_v1';
const DEFAULT_WATCHLIST_ITEMS = CATALOG.slice(0, 2);

function mergeUniqueFilms(existing: FilmItem[], incoming: FilmItem[]): FilmItem[] {
  const seen = new Set(existing.map((f) => f.id));
  const appended = incoming.filter((f) => !seen.has(f.id));
  return [...existing, ...appended];
}

function mapSortOptionToTmdb(
  sort: SortOption
): 'popularity' | 'rating' | 'year' {
  if (sort === 'rating') return 'rating';
  if (sort === 'year') return 'year';
  return 'popularity';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('discover');
  const [selectedGenre, setSelectedGenre] = useState<GenreFilter>('All');
  const [isFiltering, setIsFiltering] = useState(false);

  const [tmdbConfigured, setTmdbConfigured] = useState(false);
  const [spotlightFilms, setSpotlightFilms] = useState<FilmItem[]>(() =>
    CATALOG.filter((f) => f.featured)
  );
  const [queueFilms, setQueueFilms] = useState<FilmItem[]>(() =>
    CATALOG.slice(3, 6)
  );
  const [trendingFilms, setTrendingFilms] = useState<FilmItem[]>(() =>
    CATALOG.filter((f) => f.trending)
  );
  const [newAndSeriesFilms, setNewAndSeriesFilms] = useState<FilmItem[]>(() =>
    CATALOG.filter((f) => f.newRelease || f.kind === 'series')
  );

  // Infinite scroll state: Films
  const [featureFilms, setFeatureFilms] = useState<FilmItem[]>(() =>
    CATALOG.filter((f) => f.kind === 'film')
  );
  const [filmsPage, setFilmsPage] = useState(1);
  const [filmsTotalPages, setFilmsTotalPages] = useState(1);
  const [filmsSort, setFilmsSort] = useState<SortOption>('curated');
  const [isLoadingFilms, setIsLoadingFilms] = useState(false);
  const [isLoadingMoreFilms, setIsLoadingMoreFilms] = useState(false);

  // Infinite scroll state: Series
  const [seriesItems, setSeriesItems] = useState<FilmItem[]>(() =>
    CATALOG.filter((f) => f.kind === 'series')
  );
  const [seriesPage, setSeriesPage] = useState(1);
  const [seriesTotalPages, setSeriesTotalPages] = useState(1);
  const [seriesSort, setSeriesSort] = useState<SortOption>('curated');
  const [isLoadingSeries, setIsLoadingSeries] = useState(false);
  const [isLoadingMoreSeries, setIsLoadingMoreSeries] = useState(false);

  // Infinite scroll state: Genre filter in Discover
  const [genreFilteredFilms, setGenreFilteredFilms] = useState<FilmItem[]>(
    CATALOG
  );
  const [genrePage, setGenrePage] = useState(1);
  const [genreTotalPages, setGenreTotalPages] = useState(1);
  const [isLoadingMoreGenre, setIsLoadingMoreGenre] = useState(false);

  const [watchlistItems, setWatchlistItems] = useState<FilmItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(WATCHLIST_ITEMS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage read failures
    }
    return DEFAULT_WATCHLIST_ITEMS;
  });

  const [selectedFilm, setSelectedFilm] = useState<FilmItem | null>(null);
  const [playingState, setPlayingState] = useState<{
    film: FilmItem;
    season?: number;
    episode?: number;
    episodeTitle?: string;
  } | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [focusedCollectionId, setFocusedCollectionId] = useState<string | null>(
    null
  );

  const knownFilmsRef = useRef<Map<string, FilmItem>>(new Map());

  const registerFilms = useCallback((items: FilmItem[]) => {
    items.forEach((item) => {
      knownFilmsRef.current.set(item.id, item);
    });
  }, []);

  useEffect(() => {
    registerFilms(CATALOG);
    registerFilms(watchlistItems);
  }, [registerFilms, watchlistItems]);

  // Bootstrap live TMDB discovery when TMDB_API_KEY is configured on server
  useEffect(() => {
    let cancelled = false;

    fetchHealthStatus()
      .then(async (health) => {
        if (cancelled || !health.tmdbConfigured) return;
        setTmdbConfigured(true);

        const [bundle, browseMovies, browseSeries] = await Promise.all([
          fetchTmdbDiscover(),
          fetchTmdbBrowse('movie', undefined, 'popularity', 1),
          fetchTmdbBrowse('tv', undefined, 'popularity', 1),
        ]);
        if (cancelled) return;

        registerFilms([
          ...bundle.spotlight,
          ...bundle.queue,
          ...bundle.trending,
          ...bundle.newAndSeries,
          ...browseMovies.items,
          ...browseSeries.items,
        ]);

        if (bundle.spotlight.length > 0) setSpotlightFilms(bundle.spotlight);
        if (bundle.queue.length > 0) setQueueFilms(bundle.queue);
        if (bundle.trending.length > 0) setTrendingFilms(bundle.trending);
        if (bundle.newAndSeries.length > 0)
          setNewAndSeriesFilms(bundle.newAndSeries);

        if (browseMovies.items.length > 0) {
          setFeatureFilms(browseMovies.items);
          setFilmsPage(browseMovies.page);
          setFilmsTotalPages(browseMovies.totalPages);
        }
        if (browseSeries.items.length > 0) {
          setSeriesItems(browseSeries.items);
          setSeriesPage(browseSeries.page);
          setSeriesTotalPages(browseSeries.totalPages);
        }
      })
      .catch(() => {
        // Keep fallback catalog active seamlessly
      });

    return () => {
      cancelled = true;
    };
  }, [registerFilms]);

  // Persist watchlist
  useEffect(() => {
    try {
      window.localStorage.setItem(
        WATCHLIST_ITEMS_STORAGE_KEY,
        JSON.stringify(watchlistItems)
      );
    } catch {
      // Ignore storage write failures
    }
  }, [watchlistItems]);

  // Global Cmd+K / Ctrl+K shortcut for search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const watchlistIds = useMemo(
    () => watchlistItems.map((item) => item.id),
    [watchlistItems]
  );

  const handleToggleWatchlist = useCallback((filmId: string) => {
    setWatchlistItems((prev) => {
      if (prev.some((f) => f.id === filmId)) {
        return prev.filter((f) => f.id !== filmId);
      }
      const found =
        knownFilmsRef.current.get(filmId) ||
        CATALOG.find((f) => f.id === filmId);
      if (!found) return prev;
      return [found, ...prev];
    });
  }, []);

  const handleSelectFilm = useCallback(
    (film: FilmItem) => {
      registerFilms([film]);
      setSelectedFilm(film);
    },
    [registerFilms]
  );

  const handlePlayFilm = useCallback(
    (
      film: FilmItem,
      season = 1,
      episode = 1,
      episodeTitle?: string
    ) => {
      registerFilms([film]);
      setPlayingState({ film, season, episode, episodeTitle });
    },
    [registerFilms]
  );

  const handleFilmsSortChange = async (nextSort: SortOption) => {
    setFilmsSort(nextSort);
    if (!tmdbConfigured) return;

    setIsLoadingFilms(true);
    try {
      const res = await fetchTmdbBrowse(
        'movie',
        undefined,
        mapSortOptionToTmdb(nextSort),
        1
      );
      registerFilms(res.items);
      setFeatureFilms(res.items);
      setFilmsPage(res.page);
      setFilmsTotalPages(res.totalPages);
    } catch {
      // Retain existing list
    } finally {
      setIsLoadingFilms(false);
    }
  };

  const handleLoadMoreFilms = useCallback(async () => {
    if (!tmdbConfigured || isLoadingMoreFilms || filmsPage >= filmsTotalPages) {
      return;
    }
    setIsLoadingMoreFilms(true);
    try {
      const res = await fetchTmdbBrowse(
        'movie',
        undefined,
        mapSortOptionToTmdb(filmsSort),
        filmsPage + 1
      );
      registerFilms(res.items);
      setFeatureFilms((prev) => mergeUniqueFilms(prev, res.items));
      setFilmsPage(res.page);
      setFilmsTotalPages(res.totalPages);
    } catch {
      // Keep current items
    } finally {
      setIsLoadingMoreFilms(false);
    }
  }, [tmdbConfigured, isLoadingMoreFilms, filmsPage, filmsTotalPages, filmsSort, registerFilms]);

  const handleSeriesSortChange = async (nextSort: SortOption) => {
    setSeriesSort(nextSort);
    if (!tmdbConfigured) return;

    setIsLoadingSeries(true);
    try {
      const res = await fetchTmdbBrowse(
        'tv',
        undefined,
        mapSortOptionToTmdb(nextSort),
        1
      );
      registerFilms(res.items);
      setSeriesItems(res.items);
      setSeriesPage(res.page);
      setSeriesTotalPages(res.totalPages);
    } catch {
      // Retain existing list
    } finally {
      setIsLoadingSeries(false);
    }
  };

  const handleLoadMoreSeries = useCallback(async () => {
    if (!tmdbConfigured || isLoadingMoreSeries || seriesPage >= seriesTotalPages) {
      return;
    }
    setIsLoadingMoreSeries(true);
    try {
      const res = await fetchTmdbBrowse(
        'tv',
        undefined,
        mapSortOptionToTmdb(seriesSort),
        seriesPage + 1
      );
      registerFilms(res.items);
      setSeriesItems((prev) => mergeUniqueFilms(prev, res.items));
      setSeriesPage(res.page);
      setSeriesTotalPages(res.totalPages);
    } catch {
      // Keep current items
    } finally {
      setIsLoadingMoreSeries(false);
    }
  }, [tmdbConfigured, isLoadingMoreSeries, seriesPage, seriesTotalPages, seriesSort, registerFilms]);

  const handleGenreSelect = async (genre: GenreFilter) => {
    if (genre === selectedGenre) return;
    setSelectedGenre(genre);

    if (genre === 'All') {
      setGenreFilteredFilms(CATALOG);
      setGenrePage(1);
      setGenreTotalPages(1);
      return;
    }

    setIsFiltering(true);

    if (tmdbConfigured) {
      try {
        const res =
          genre === 'Series'
            ? await fetchTmdbBrowse('tv', undefined, 'popularity', 1)
            : await fetchTmdbBrowse(
                'movie',
                FILTER_TO_TMDB_MOVIE_GENRE[genre],
                'popularity',
                1
              );
        registerFilms(res.items);
        setGenreFilteredFilms(res.items);
        setGenrePage(res.page);
        setGenreTotalPages(res.totalPages);
      } catch {
        const pool = Array.from(knownFilmsRef.current.values());
        setGenreFilteredFilms(
          genre === 'Series'
            ? pool.filter((f) => f.kind === 'series')
            : pool.filter((f) => f.genres.includes(genre))
        );
      } finally {
        setIsFiltering(false);
      }
      return;
    }

    window.setTimeout(() => {
      setGenreFilteredFilms(
        genre === 'Series'
          ? CATALOG.filter((f) => f.kind === 'series')
          : CATALOG.filter((f) => f.genres.includes(genre))
      );
      setIsFiltering(false);
    }, 180);
  };

  const handleLoadMoreGenre = useCallback(async () => {
    if (
      !tmdbConfigured ||
      selectedGenre === 'All' ||
      isLoadingMoreGenre ||
      genrePage >= genreTotalPages
    ) {
      return;
    }
    setIsLoadingMoreGenre(true);
    try {
      const res =
        selectedGenre === 'Series'
          ? await fetchTmdbBrowse('tv', undefined, 'popularity', genrePage + 1)
          : await fetchTmdbBrowse(
              'movie',
              FILTER_TO_TMDB_MOVIE_GENRE[selectedGenre],
              'popularity',
              genrePage + 1
            );
      registerFilms(res.items);
      setGenreFilteredFilms((prev) => mergeUniqueFilms(prev, res.items));
      setGenrePage(res.page);
      setGenreTotalPages(res.totalPages);
    } catch {
      // Keep current items
    } finally {
      setIsLoadingMoreGenre(false);
    }
  }, [tmdbConfigured, selectedGenre, isLoadingMoreGenre, genrePage, genreTotalPages, registerFilms]);

  const handleTabSelect = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab !== 'collections') {
      setFocusedCollectionId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCollection = (collection: CuratedCollection) => {
    setFocusedCollectionId(collection.id);
    setActiveTab('collections');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const discoverResultCount = useMemo(() => {
    if (selectedGenre === 'All') {
      return tmdbConfigured
        ? featureFilms.length + seriesItems.length
        : CATALOG.length;
    }
    return genreFilteredFilms.length;
  }, [
    selectedGenre,
    tmdbConfigured,
    featureFilms.length,
    seriesItems.length,
    genreFilteredFilms.length,
  ]);

  const monographFilm = featureFilms[0] ?? CATALOG[0];
  const verticalFilm = featureFilms[1] ?? CATALOG[2];
  const secondaryFilm = featureFilms[2] ?? CATALOG[3];
  const artisanFilm = featureFilms[3] ?? CATALOG[4];

  const allCollectionPool = useMemo(() => {
    const merged = new Map<string, FilmItem>();
    CATALOG.forEach((f) => merged.set(f.id, f));
    featureFilms.forEach((f) => merged.set(f.id, f));
    seriesItems.forEach((f) => merged.set(f.id, f));
    return Array.from(merged.values());
  }, [featureFilms, seriesItems]);

  return (
    <div className="min-h-screen bg-[#090A0B] text-[#F5F2EB]">
      {/* Subtle atmospheric top glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 h-[440px] bg-[radial-gradient(ellipse_at_top,_rgba(212,175,106,0.06),_rgba(22,52,58,0.08)_45%,_transparent_75%)]"
      />

      <Navbar
        activeTab={activeTab}
        onSelectTab={handleTabSelect}
        onOpenSearch={() => setSearchOpen(true)}
        watchlistCount={watchlistItems.length}
      />

      <main className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'discover' && (
            <motion.div
              key="discover-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HeroSpotlight
                spotlightFilms={spotlightFilms}
                queueFilms={queueFilms}
                watchlistIds={watchlistIds}
                onSelectFilm={handleSelectFilm}
                onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
                onToggleWatchlist={handleToggleWatchlist}
              />

              <GenreBar
                selected={selectedGenre}
                onSelect={handleGenreSelect}
                resultCount={discoverResultCount}
              />

              {selectedGenre !== 'All' ? (
                <CollectionGridView
                  kicker="Filtered Selection"
                  title={
                    selectedGenre === 'Series'
                      ? 'Prestige Series & Limited Editions'
                      : `${selectedGenre} Cinema`
                  }
                  description="Curated works matching your selected tone and genre."
                  films={genreFilteredFilms}
                  watchlistIds={watchlistIds}
                  isLoading={isFiltering}
                  hasMore={tmdbConfigured && genrePage < genreTotalPages}
                  isLoadingMore={isLoadingMoreGenre}
                  onLoadMore={handleLoadMoreGenre}
                  onSelectFilm={handleSelectFilm}
                  onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
                  onToggleWatchlist={handleToggleWatchlist}
                  showSort={true}
                />
              ) : (
                <>
                  <PosterCarousel
                    title="Trending in the Salon"
                    subtitle="Most screened features and series this week"
                    films={trendingFilms}
                    watchlistIds={watchlistIds}
                    onSelectFilm={handleSelectFilm}
                    onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onViewAll={() => handleTabSelect('films')}
                  />

                  <AsymmetricShowcase
                    monographFilm={monographFilm}
                    verticalFilm={verticalFilm}
                    secondaryFilm={secondaryFilm}
                    artisanFilm={artisanFilm}
                    onSelectFilm={handleSelectFilm}
                  />

                  <PosterCarousel
                    title="New Arrivals & Limited Series"
                    subtitle="Now playing features and acclaimed episodic cinema"
                    films={newAndSeriesFilms}
                    watchlistIds={watchlistIds}
                    onSelectFilm={handleSelectFilm}
                    onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
                    onToggleWatchlist={handleToggleWatchlist}
                    onViewAll={() => handleTabSelect('series')}
                  />

                  <CuratedCollections
                    collections={CURATED_COLLECTIONS}
                    onOpenCollection={handleOpenCollection}
                  />
                </>
              )}
            </motion.div>
          )}

          {activeTab === 'films' && (
            <CollectionGridView
              key="films-view"
              kicker="Feature Archive"
              title="Feature Films"
              description="Explore the full theatrical archive—scroll continuously to discover more films."
              films={featureFilms}
              watchlistIds={watchlistIds}
              isLoading={isLoadingFilms}
              hasMore={tmdbConfigured && filmsPage < filmsTotalPages}
              isLoadingMore={isLoadingMoreFilms}
              onLoadMore={handleLoadMoreFilms}
              sortOrder={tmdbConfigured ? filmsSort : undefined}
              onSortOrderChange={
                tmdbConfigured ? handleFilmsSortChange : undefined
              }
              onSelectFilm={handleSelectFilm}
              onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
              onToggleWatchlist={handleToggleWatchlist}
            />
          )}

          {activeTab === 'series' && (
            <CollectionGridView
              key="series-view"
              kicker="Episodic Cinema"
              title="Series & Limited Editions"
              description="Long-form auteur storytelling—scroll continuously to browse all series."
              films={seriesItems}
              watchlistIds={watchlistIds}
              isLoading={isLoadingSeries}
              hasMore={tmdbConfigured && seriesPage < seriesTotalPages}
              isLoadingMore={isLoadingMoreSeries}
              onLoadMore={handleLoadMoreSeries}
              sortOrder={tmdbConfigured ? seriesSort : undefined}
              onSortOrderChange={
                tmdbConfigured ? handleSeriesSortChange : undefined
              }
              onSelectFilm={handleSelectFilm}
              onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
              onToggleWatchlist={handleToggleWatchlist}
            />
          )}

          {activeTab === 'collections' && (
            <CollectionsPage
              key="collections-view"
              collections={CURATED_COLLECTIONS}
              allFilms={allCollectionPool}
              watchlistIds={watchlistIds}
              focusedCollectionId={focusedCollectionId}
              onFocusCollection={setFocusedCollectionId}
              onSelectFilm={handleSelectFilm}
              onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
              onToggleWatchlist={handleToggleWatchlist}
            />
          )}

          {activeTab === 'watchlist' && (
            <CollectionGridView
              key="watchlist-view"
              kicker="Personal Archive"
              title="Your Watchlist"
              description="Films and series reserved for your next private screening."
              films={watchlistItems}
              watchlistIds={watchlistIds}
              emptyTitle="Your screening queue is empty"
              emptyDescription="Save any film or series from KD Movies to keep it ready for screening."
              onEmptyAction={() => handleTabSelect('discover')}
              emptyActionLabel="Browse Discover"
              onSelectFilm={handleSelectFilm}
              onPlayFilm={(film) => handlePlayFilm(film, 1, 1)}
              onToggleWatchlist={handleToggleWatchlist}
              showSort={watchlistItems.length > 1}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Restrained Editorial Footer */}
      <footer className="border-t border-white/[0.07] bg-[#090A0B]">
        <div className="mx-auto flex max-w-[1400px] flex-col justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center sm:px-8 lg:px-10">
          <div>
            <div className="inline-flex items-center gap-2.5">
              <KDLogoMark />
              <span className="font-serif text-xl font-medium text-[#F5F2EB]">
                KD Movies
              </span>
            </div>
            <p className="mt-1.5 text-xs text-[#7D7B75]">
              Digital Film Collection · Powered by TMDB
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-[#8E8C86]">
            <button
              type="button"
              onClick={() => handleTabSelect('discover')}
              className="hover:text-[#F5F2EB] cursor-pointer"
            >
              Discover
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('films')}
              className="hover:text-[#F5F2EB] cursor-pointer"
            >
              Films
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('series')}
              className="hover:text-[#F5F2EB] cursor-pointer"
            >
              Series
            </button>
            <button
              type="button"
              onClick={() => handleTabSelect('collections')}
              className="hover:text-[#F5F2EB] cursor-pointer"
            >
              Collections
            </button>
            <span className="text-[#5C5A55]">© 2026 KD Movies</span>
          </div>
        </div>
      </footer>

      {/* Film Dossier / Details View */}
      <AnimatePresence>
        {selectedFilm && (
          <FilmDetailView
            film={selectedFilm}
            watchlistIds={watchlistIds}
            tmdbConfigured={tmdbConfigured}
            onClose={() => setSelectedFilm(null)}
            onSelectFilm={handleSelectFilm}
            onPlayFilm={handlePlayFilm}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}
      </AnimatePresence>

      {/* Screening Room Video Player */}
      <AnimatePresence>
        {playingState && (
          <ScreeningPlayer
            film={playingState.film}
            initialSeason={playingState.season}
            initialEpisode={playingState.episode}
            episodeTitle={playingState.episodeTitle}
            onClose={() => setPlayingState(null)}
          />
        )}
      </AnimatePresence>

      {/* Command Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <SearchModal
            tmdbConfigured={tmdbConfigured}
            onClose={() => setSearchOpen(false)}
            onSelectFilm={handleSelectFilm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
