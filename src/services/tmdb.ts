import {
  CastMember,
  Episode,
  FilmItem,
  MediaKind,
  SeasonSummary,
} from '../types/cinema';

const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/w1280';
const TMDB_PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';
const TMDB_STILL_BASE = 'https://image.tmdb.org/t/p/w500';

export const TMDB_MOVIE_GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'Historical',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export const TMDB_TV_GENRE_MAP: Record<number, string> = {
  10759: 'Action',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  9648: 'Mystery',
  10765: 'Sci-Fi',
  10768: 'Historical',
  37: 'Western',
};

export const FILTER_TO_TMDB_MOVIE_GENRE: Record<string, number | undefined> = {
  All: undefined,
  'Sci-Fi': 878,
  Drama: 18,
  Thriller: 53,
  Crime: 80,
  Mystery: 9648,
  Historical: 36,
  Documentary: 99,
  Action: 28,
  Animation: 16,
};

interface RawTmdbEntry {
  id: number;
  media_type?: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  tagline?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  origin_country?: string[];
  original_language?: string;
  production_countries?: Array<{ name: string }>;
  created_by?: Array<{ name: string }>;
  seasons?: Array<{
    season_number: number;
    name: string;
    episode_count: number;
  }>;
  credits?: {
    cast?: Array<{
      name: string;
      character?: string;
      profile_path?: string | null;
      known_for_department?: string;
    }>;
    crew?: Array<{
      name: string;
      job?: string;
      department?: string;
    }>;
  };
  recommendations?: {
    results?: RawTmdbEntry[];
  };
}

interface RawTmdbSeason {
  episodes?: Array<{
    episode_number: number;
    season_number: number;
    name: string;
    runtime?: number | null;
    overview?: string;
    still_path?: string | null;
  }>;
}

function mapGenres(
  raw: RawTmdbEntry,
  kind: MediaKind
): string[] {
  if (raw.genres && raw.genres.length > 0) {
    return raw.genres.map((g) =>
      g.name === 'Science Fiction'
        ? 'Sci-Fi'
        : g.name === 'History'
          ? 'Historical'
          : g.name
    );
  }
  const map = kind === 'series' ? TMDB_TV_GENRE_MAP : TMDB_MOVIE_GENRE_MAP;
  const resolved = (raw.genre_ids || [])
    .map((id) => map[id])
    .filter((g): g is string => Boolean(g));
  return resolved.length > 0 ? resolved : [kind === 'series' ? 'Drama' : 'Cinema'];
}

function formatRuntime(minutes: number): string {
  if (!minutes || minutes <= 0) return 'Feature';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs === 0) return `${mins}m`;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export function normalizeTmdbItem(
  raw: RawTmdbEntry,
  forcedKind?: MediaKind
): FilmItem | null {
  if (raw.media_type === 'person') return null;
  if (!raw.poster_path) return null;

  const kind: MediaKind =
    forcedKind ?? (raw.media_type === 'tv' || (!raw.title && Boolean(raw.name)) ? 'series' : 'film');
  const title = raw.title || raw.name || 'Untitled';
  const dateStr = raw.release_date || raw.first_air_date || '';
  const year = dateStr ? Number(dateStr.slice(0, 4)) || 2025 : 2025;
  const rating = raw.vote_average ? Number(raw.vote_average.toFixed(1)) : 7.5;
  const genres = mapGenres(raw, kind);

  const runtimeMinutes =
    raw.runtime ||
    (raw.episode_run_time && raw.episode_run_time[0]) ||
    (kind === 'series' ? 52 : 120);

  const runtime =
    kind === 'series'
      ? raw.number_of_episodes
        ? `${raw.number_of_episodes} Episodes`
        : `${formatRuntime(runtimeMinutes)} / ep`
      : formatRuntime(runtimeMinutes);

  const director =
    raw.credits?.crew?.find((c) => c.job === 'Director')?.name ||
    raw.created_by?.[0]?.name ||
    (kind === 'series' ? 'Series Anthology' : 'Featured Auteur');

  const cinematographer =
    raw.credits?.crew?.find(
      (c) =>
        c.job === 'Director of Photography' ||
        c.department === 'Camera'
    )?.name || 'Principal Photography';

  const composer =
    raw.credits?.crew?.find(
      (c) =>
        c.job === 'Original Music Composer' ||
        c.department === 'Sound'
    )?.name || 'Original Score';

  const cast: CastMember[] = (raw.credits?.cast || [])
    .slice(0, 8)
    .map((member, index) => ({
      name: member.name,
      role: member.character || 'Cast',
      billing: index < 2 ? 'Lead' : 'Principal',
      notable: member.known_for_department || 'Acting',
      profileUrl: member.profile_path
        ? `${TMDB_PROFILE_BASE}${member.profile_path}`
        : undefined,
    }));

  const seasonsList: SeasonSummary[] | undefined = raw.seasons
    ?.filter((s) => s.season_number > 0)
    .map((s) => ({
      seasonNumber: s.season_number,
      name: s.name || `Season ${s.season_number}`,
      episodeCount: s.episode_count,
    }));

  const recommendations: FilmItem[] | undefined = raw.recommendations?.results
    ?.map((rec) => normalizeTmdbItem(rec, kind))
    .filter((item): item is FilmItem => Boolean(item))
    .slice(0, 4);

  const overview =
    raw.overview?.trim() ||
    'A curated motion picture from the international cinema archive.';

  return {
    id: `${kind}-${raw.id}`,
    tmdbId: raw.id,
    title,
    subtitle: raw.tagline || undefined,
    kind,
    year,
    runtime,
    runtimeMinutes,
    rating,
    genres,
    genreIds: raw.genre_ids,
    director,
    logline:
      overview.length > 165 ? `${overview.slice(0, 162).trim()}...` : overview,
    synopsis: overview,
    curatorNote: raw.tagline
      ? raw.tagline
      : `${title} (${year}) — presented in high-definition mastering from the TMDB archive.`,
    posterUrl: `${TMDB_POSTER_BASE}${raw.poster_path}`,
    backdropUrl: raw.backdrop_path
      ? `${TMDB_BACKDROP_BASE}${raw.backdrop_path}`
      : undefined,
    accentHue: '#D4AF6A',
    seasons: raw.number_of_seasons,
    episodeCount: raw.number_of_episodes,
    seasonsList,
    cast,
    specs: {
      cinematography: cinematographer,
      composer,
      aspectRatio: kind === 'series' ? '2.00:1 / 16:9' : '2.39:1 Widescreen',
      format: 'HD / 4K Digital Stream',
      soundMix: 'Surround Stereo',
      country:
        raw.production_countries?.[0]?.name ||
        raw.origin_country?.[0] ||
        'International',
      language: (raw.original_language || 'en').toUpperCase(),
    },
    similarIds: [],
    recommendations,
    detailsLoaded: Boolean(raw.credits || raw.recommendations),
  };
}

export interface DiscoverBundle {
  tmdbConfigured: boolean;
  spotlight: FilmItem[];
  queue: FilmItem[];
  trending: FilmItem[];
  newAndSeries: FilmItem[];
  allMovies: FilmItem[];
  allSeries: FilmItem[];
}

export async function fetchHealthStatus(): Promise<{
  ok: boolean;
  tmdbConfigured: boolean;
}> {
  const res = await fetch('/api/health');
  if (!res.ok) return { ok: false, tmdbConfigured: false };
  return res.json();
}

export async function fetchTmdbDiscover(): Promise<DiscoverBundle> {
  const res = await fetch('/api/tmdb/discover');
  if (!res.ok) {
    throw new Error('TMDB discover unavailable');
  }
  const data = await res.json();

  const trendingAll = ((data.trendingAll?.results || []) as RawTmdbEntry[])
    .map((item) => normalizeTmdbItem(item))
    .filter((item): item is FilmItem => Boolean(item));

  const nowPlayingMovies = ((data.popularMovies?.results || []) as RawTmdbEntry[])
    .map((item) => normalizeTmdbItem(item, 'film'))
    .filter((item): item is FilmItem => Boolean(item));

  const topMovies = ((data.topRatedMovies?.results || []) as RawTmdbEntry[])
    .map((item) => normalizeTmdbItem(item, 'film'))
    .filter((item): item is FilmItem => Boolean(item));

  const topSeries = ((data.popularSeries?.results || []) as RawTmdbEntry[])
    .map((item) => normalizeTmdbItem(item, 'series'))
    .filter((item): item is FilmItem => Boolean(item));

  const spotlight = trendingAll.filter((f) => Boolean(f.backdropUrl)).slice(0, 4);
  const queue = nowPlayingMovies
    .filter((m) => !spotlight.some((s) => s.id === m.id))
    .slice(0, 3);

  const uniqueMoviesMap = new Map<string, FilmItem>();
  [...nowPlayingMovies, ...topMovies].forEach((m) => uniqueMoviesMap.set(m.id, m));

  return {
    tmdbConfigured: true,
    spotlight: spotlight.length > 0 ? spotlight : trendingAll.slice(0, 3),
    queue: queue.length > 0 ? queue : topSeries.slice(0, 3),
    trending: trendingAll.slice(0, 14),
    newAndSeries: [...topSeries.slice(0, 7), ...nowPlayingMovies.slice(0, 7)],
    allMovies: Array.from(uniqueMoviesMap.values()),
    allSeries: topSeries,
  };
}

export interface PaginatedTmdbResult {
  items: FilmItem[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export async function fetchTmdbBrowse(
  type: 'movie' | 'tv',
  genreId?: number,
  sort: 'popularity' | 'rating' | 'year' = 'popularity',
  page = 1
): Promise<PaginatedTmdbResult> {
  const params = new URLSearchParams({
    type,
    sort,
    page: String(page),
  });
  if (genreId) params.set('genreId', String(genreId));

  const res = await fetch(`/api/tmdb/browse?${params.toString()}`);
  if (!res.ok) throw new Error('TMDB browse failed');
  const data = await res.json();
  const kind: MediaKind = type === 'tv' ? 'series' : 'film';
  const items = ((data.results || []) as RawTmdbEntry[])
    .map((item) => normalizeTmdbItem(item, kind))
    .filter((item): item is FilmItem => Boolean(item));

  return {
    items,
    page: Number(data.page) || page,
    totalPages: Math.min(Number(data.total_pages) || 1, 100),
    totalResults: Number(data.total_results) || items.length,
  };
}

export async function searchTmdbCatalog(
  query: string,
  page = 1
): Promise<PaginatedTmdbResult> {
  const params = new URLSearchParams({ q: query, page: String(page) });
  const res = await fetch(`/api/tmdb/search?${params.toString()}`);
  if (!res.ok) throw new Error('TMDB search failed');
  const data = await res.json();
  const items = ((data.results || []) as RawTmdbEntry[])
    .map((item) => normalizeTmdbItem(item))
    .filter((item): item is FilmItem => Boolean(item));

  return {
    items,
    page: Number(data.page) || page,
    totalPages: Math.min(Number(data.total_pages) || 1, 100),
    totalResults: Number(data.total_results) || items.length,
  };
}

export async function fetchTmdbDetails(
  kind: MediaKind,
  tmdbId: number
): Promise<FilmItem | null> {
  const mediaType = kind === 'series' ? 'tv' : 'movie';
  const res = await fetch(`/api/tmdb/details/${mediaType}/${tmdbId}`);
  if (!res.ok) throw new Error('TMDB details failed');
  const raw = (await res.json()) as RawTmdbEntry;
  return normalizeTmdbItem(raw, kind);
}

export async function fetchTmdbSeasonEpisodes(
  tmdbId: number,
  seasonNumber: number
): Promise<Episode[]> {
  const res = await fetch(`/api/tmdb/tv/${tmdbId}/season/${seasonNumber}`);
  if (!res.ok) throw new Error('TMDB season failed');
  const data = (await res.json()) as RawTmdbSeason;
  return (data.episodes || []).map((ep) => ({
    number: ep.episode_number,
    seasonNumber: ep.season_number,
    title: ep.name || `Episode ${ep.episode_number}`,
    duration: ep.runtime ? `${ep.runtime}m` : '48m',
    synopsis: ep.overview || 'Episode synopsis unavailable.',
    stillUrl: ep.still_path ? `${TMDB_STILL_BASE}${ep.still_path}` : undefined,
  }));
}
