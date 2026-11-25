export type MediaKind = 'film' | 'series';

export type Genre =
  | 'Sci-Fi'
  | 'Neo-Noir'
  | 'Drama'
  | 'Thriller'
  | 'Crime'
  | 'Mystery'
  | 'Historical'
  | 'Documentary'
  | 'Action'
  | 'Animation';

export interface CastMember {
  name: string;
  role: string;
  billing: string;
  notable: string;
  profileUrl?: string;
}

export interface SeasonSummary {
  seasonNumber: number;
  name: string;
  episodeCount: number;
}

export interface Episode {
  number: number;
  seasonNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  stillUrl?: string;
}

export interface TechnicalSpecs {
  cinematography: string;
  composer: string;
  aspectRatio: string;
  format: string;
  soundMix: string;
  country: string;
  language: string;
}

export interface FilmItem {
  id: string;
  tmdbId: number;
  title: string;
  subtitle?: string;
  kind: MediaKind;
  year: number;
  runtime: string;
  runtimeMinutes: number;
  rating: number;
  genres: string[];
  genreIds?: number[];
  director: string;
  logline: string;
  synopsis: string;
  curatorNote: string;
  posterUrl: string;
  backdropUrl?: string;
  accentHue: string;
  featured?: boolean;
  trending?: boolean;
  newRelease?: boolean;
  seasons?: number;
  episodeCount?: number;
  seasonsList?: SeasonSummary[];
  episodes?: Episode[];
  cast: CastMember[];
  specs: TechnicalSpecs;
  similarIds: string[];
  recommendations?: FilmItem[];
  detailsLoaded?: boolean;
}

export interface CuratedCollection {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  description: string;
  curator: string;
  filmIds: string[];
  coverUrl: string;
}

export type NavTab = 'discover' | 'films' | 'series' | 'collections' | 'watchlist';
