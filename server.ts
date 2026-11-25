import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const CACHE_TTL_MS = 5 * 60 * 1000;

interface CacheEntry {
  expiresAt: number;
  data: unknown;
}

const cache = new Map<string, CacheEntry>();

function getTmdbApiKey(): string | undefined {
  const key = process.env.TMDB_API_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

async function fetchTmdb(
  endpointPath: string,
  params: Record<string, string | number> = {}
): Promise<unknown> {
  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    const err = new Error('TMDB_API_KEY is not configured') as Error & {
      status?: number;
    };
    err.status = 503;
    throw err;
  }

  const url = new URL(`${TMDB_BASE_URL}${endpointPath}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'en-US');
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  const cacheKey = `${endpointPath}?${new URLSearchParams(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  ).toString()}`;

  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.data;
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    const err = new Error(`TMDB upstream error: ${response.status}`) as Error & {
      status?: number;
    };
    err.status = response.status >= 500 ? 502 : response.status;
    throw err;
  }

  const data = await response.json();
  cache.set(cacheKey, {
    expiresAt: Date.now() + CACHE_TTL_MS,
    data,
  });

  return data;
}

function isPositiveInt(val: string): boolean {
  return /^\d+$/.test(val) && Number(val) > 0;
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Health & config status (never exposes key value)
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      ok: true,
      tmdbConfigured: Boolean(getTmdbApiKey()),
    });
  });

  // Aggregated Discovery feed
  app.get('/api/tmdb/discover', async (_req: Request, res: Response) => {
    try {
      const [
        trendingAll,
        popularMovies,
        topRatedMovies,
        popularSeries,
        movieGenres,
        tvGenres,
      ] = await Promise.all([
        fetchTmdb('/trending/all/week', { page: 1 }),
        fetchTmdb('/movie/now_playing', { page: 1 }),
        fetchTmdb('/movie/top_rated', { page: 1 }),
        fetchTmdb('/tv/top_rated', { page: 1 }),
        fetchTmdb('/genre/movie/list'),
        fetchTmdb('/genre/tv/list'),
      ]);

      res.json({
        trendingAll,
        popularMovies,
        topRatedMovies,
        popularSeries,
        movieGenres,
        tvGenres,
      });
    } catch (err) {
      const status = (err as { status?: number }).status || 500;
      res.status(status).json({
        error:
          status === 503
            ? 'TMDB_API_KEY is not configured on the server.'
            : 'Failed to load discovery feed from TMDB.',
      });
    }
  });

  // Browse Movies or TV by genre/sort/page
  app.get('/api/tmdb/browse', async (req: Request, res: Response) => {
    try {
      const mediaType = req.query.type === 'tv' ? 'tv' : 'movie';
      const rawPage = String(req.query.page || '1');
      const page = isPositiveInt(rawPage) ? Math.min(Number(rawPage), 100) : 1;

      const rawGenre = typeof req.query.genreId === 'string' ? req.query.genreId : '';
      const genreId = /^\d+$/.test(rawGenre) ? rawGenre : '';

      const sortMap: Record<string, string> = {
        popularity: 'popularity.desc',
        rating: 'vote_average.desc',
        year:
          mediaType === 'tv'
            ? 'first_air_date.desc'
            : 'primary_release_date.desc',
      };
      const sortKey =
        typeof req.query.sort === 'string' && req.query.sort in sortMap
          ? req.query.sort
          : 'popularity';

      const params: Record<string, string | number> = {
        page,
        sort_by: sortMap[sortKey],
        'vote_count.gte': sortKey === 'rating' ? 300 : 100,
        include_adult: 'false',
      };
      if (genreId) {
        params.with_genres = genreId;
      }

      const data = await fetchTmdb(`/discover/${mediaType}`, params);
      res.json(data);
    } catch (err) {
      const status = (err as { status?: number }).status || 500;
      res.status(status).json({
        error: 'Failed to browse TMDB catalog.',
      });
    }
  });

  // Multi-search across Movies & TV
  app.get('/api/tmdb/search', async (req: Request, res: Response) => {
    try {
      const rawQuery = typeof req.query.q === 'string' ? req.query.q.trim() : '';
      if (!rawQuery || rawQuery.length > 100) {
        res.status(400).json({ error: 'Invalid search query.' });
        return;
      }
      const rawPage = String(req.query.page || '1');
      const page = isPositiveInt(rawPage) ? Math.min(Number(rawPage), 100) : 1;

      const data = await fetchTmdb('/search/multi', {
        query: rawQuery,
        page,
        include_adult: 'false',
      });
      res.json(data);
    } catch (err) {
      const status = (err as { status?: number }).status || 500;
      res.status(status).json({
        error: 'Failed to search TMDB.',
      });
    }
  });

  // Full details (credits, recommendations, videos) for Movie or TV
  app.get(
    '/api/tmdb/details/:mediaType/:id',
    async (req: Request, res: Response) => {
      try {
        const mediaType = req.params.mediaType;
        const id = req.params.id;
        if (
          (mediaType !== 'movie' && mediaType !== 'tv') ||
          !isPositiveInt(id)
        ) {
          res.status(400).json({ error: 'Invalid media type or ID.' });
          return;
        }

        const data = await fetchTmdb(`/${mediaType}/${id}`, {
          append_to_response: 'credits,recommendations,videos',
        });
        res.json(data);
      } catch (err) {
        const status = (err as { status?: number }).status || 500;
        res.status(status).json({
          error: 'Failed to fetch TMDB title details.',
        });
      }
    }
  );

  // TV Season episodes
  app.get(
    '/api/tmdb/tv/:id/season/:seasonNumber',
    async (req: Request, res: Response) => {
      try {
        const { id, seasonNumber } = req.params;
        if (!isPositiveInt(id) || !/^\d+$/.test(seasonNumber)) {
          res.status(400).json({ error: 'Invalid series or season number.' });
          return;
        }

        const data = await fetchTmdb(`/tv/${id}/season/${seasonNumber}`);
        res.json(data);
      } catch (err) {
        const status = (err as { status?: number }).status || 500;
        res.status(status).json({
          error: 'Failed to fetch TV season episodes.',
        });
      }
    }
  );

  // Vite dev middleware or static dist serving
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Vespera server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
