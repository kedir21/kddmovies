import { CuratedCollection, FilmItem } from '../types/cinema';

export const GENRES: Array<
  | 'All'
  | 'Sci-Fi'
  | 'Drama'
  | 'Thriller'
  | 'Crime'
  | 'Mystery'
  | 'Historical'
  | 'Documentary'
  | 'Action'
  | 'Series'
> = [
  'All',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Crime',
  'Mystery',
  'Historical',
  'Documentary',
  'Action',
  'Series',
];

export const CATALOG: FilmItem[] = [
  {
    id: 'film-27205',
    tmdbId: 27205,
    title: 'Inception',
    subtitle: 'Your Mind Is the Scene of the Crime',
    kind: 'film',
    year: 2010,
    runtime: '2h 28m',
    runtimeMinutes: 148,
    rating: 8.4,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    director: 'Christopher Nolan',
    logline:
      'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets, is offered a chance to regain his old life.',
    synopsis:
      'Dom Cobb is a thief with the rare ability to enter people’s dreams and steal their secrets from their subconscious. Offered one final impossible task—planting an idea rather than stealing one—Cobb assembles a specialized team across layered dream architectures.',
    curatorNote:
      'Shot on 65mm and VistaVision formats, Inception turns architectural paradoxes and rotating corridors into visceral cinema.',
    posterUrl: '/src/assets/images/poster_solaris_drift_1795625169656.jpg',
    backdropUrl: '/src/assets/images/hero_solaris_drift_1795625169046.jpg',
    accentHue: '#C98A4B',
    featured: true,
    trending: true,
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Dom Cobb', billing: 'Lead', notable: 'The Revenant' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur', billing: 'Principal', notable: 'Looper' },
      { name: 'Elliot Page', role: 'Ariadne', billing: 'Principal', notable: 'Juno' },
      { name: 'Tom Hardy', role: 'Eames', billing: 'Supporting', notable: 'Dunkirk' },
    ],
    specs: {
      cinematography: 'Wally Pfister',
      composer: 'Hans Zimmer',
      aspectRatio: '2.39:1 Anamorphic',
      format: '4K Dolby Vision · 65mm Transfer',
      soundMix: 'Dolby Atmos',
      country: 'United States / United Kingdom',
      language: 'EN',
    },
    similarIds: ['film-157336', 'film-438631', 'film-155'],
  },
  {
    id: 'series-1399',
    tmdbId: 1399,
    title: 'Game of Thrones',
    subtitle: 'Winter Is Coming',
    kind: 'series',
    year: 2011,
    runtime: '73 Episodes',
    runtimeMinutes: 58,
    rating: 8.4,
    genres: ['Drama', 'Action', 'Mystery'],
    director: 'David Benioff & D.B. Weiss',
    seasons: 8,
    episodeCount: 73,
    seasonsList: [
      { seasonNumber: 1, name: 'Season 1', episodeCount: 10 },
      { seasonNumber: 2, name: 'Season 2', episodeCount: 10 },
      { seasonNumber: 3, name: 'Season 3', episodeCount: 10 },
      { seasonNumber: 4, name: 'Season 4', episodeCount: 10 },
    ],
    logline:
      'Seven noble families fight for control of the mythical land of Westeros while an ancient enemy awakens beyond the northern Wall.',
    synopsis:
      'Across the continents of Westeros and Essos, royal houses weave alliances and betrayals for the Iron Throne while an ancient winter gathers in the north.',
    curatorNote:
      'Landmark epic television blending intimate chamber intrigue with sprawling northern cinematography.',
    posterUrl: '/src/assets/images/poster_cartographers_dream_1795625173436.jpg',
    backdropUrl: '/src/assets/images/hero_glass_archipelago_1795625170240.jpg',
    accentHue: '#5A8D9A',
    featured: true,
    trending: true,
    episodes: [
      { number: 1, seasonNumber: 1, title: 'Winter Is Coming', duration: '62m', synopsis: 'Lord Eddard Stark is summoned south to serve as Hand of the King.' },
      { number: 2, seasonNumber: 1, title: 'The Kingsroad', duration: '56m', synopsis: 'Bran recovers from his fall while Ned journeys toward King’s Landing.' },
      { number: 3, seasonNumber: 1, title: 'Lord Snow', duration: '58m', synopsis: 'Jon Snow begins his watch at Castle Black while Ned confronts court politics.' },
      { number: 4, seasonNumber: 1, title: 'Cripples, Bastards, and Broken Things', duration: '56m', synopsis: 'Ned investigates the mysterious passing of the former Hand.' },
    ],
    cast: [
      { name: 'Peter Dinklage', role: 'Tyrion Lannister', billing: 'Lead', notable: 'Cyrano' },
      { name: 'Lena Headey', role: 'Cersei Lannister', billing: 'Principal', notable: '300' },
      { name: 'Emilia Clarke', role: 'Daenerys Targaryen', billing: 'Principal', notable: 'Last Christmas' },
      { name: 'Kit Harington', role: 'Jon Snow', billing: 'Principal', notable: 'Testament of Youth' },
    ],
    specs: {
      cinematography: 'Fabian Wagner',
      composer: 'Ramin Djawadi',
      aspectRatio: '1.78:1 Widescreen',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['series-94997', 'film-438631', 'film-27205'],
  },
  {
    id: 'film-157336',
    tmdbId: 157336,
    title: 'Interstellar',
    subtitle: 'Mankind Was Born on Earth',
    kind: 'film',
    year: 2014,
    runtime: '2h 49m',
    runtimeMinutes: 169,
    rating: 8.4,
    genres: ['Sci-Fi', 'Drama'],
    director: 'Christopher Nolan',
    logline:
      'A team of explorers travels through a wormhole in space in an attempt to ensure humanity’s survival.',
    synopsis:
      'As Earth’s biosphere collapses, former pilot Cooper joins a deep-space endurance voyage through a newly discovered wormhole near Saturn, racing against relativistic time dilation to find a habitable world.',
    curatorNote:
      '70mm IMAX grandeur anchored by an intimate father-daughter elegy and Hans Zimmer’s cathedral organ score.',
    posterUrl: '/src/assets/images/poster_silent_orbit_1795625228964.jpg',
    backdropUrl: '/src/assets/images/hero_solaris_drift_1795625169046.jpg',
    accentHue: '#7BA0C7',
    featured: true,
    trending: true,
    cast: [
      { name: 'Matthew McConaughey', role: 'Joseph Cooper', billing: 'Lead', notable: 'True Detective' },
      { name: 'Anne Hathaway', role: 'Dr. Amelia Brand', billing: 'Principal', notable: 'Les Misérables' },
      { name: 'Jessica Chastain', role: 'Murphy Cooper', billing: 'Principal', notable: 'Zero Dark Thirty' },
    ],
    specs: {
      cinematography: 'Hoyte van Hoytema',
      composer: 'Hans Zimmer',
      aspectRatio: '2.39:1 / 1.43:1 IMAX',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States / United Kingdom',
      language: 'EN',
    },
    similarIds: ['film-27205', 'film-438631', 'film-329865'],
  },
  {
    id: 'film-438631',
    tmdbId: 438631,
    title: 'Dune',
    subtitle: 'Beyond Fear, Destiny Awaits',
    kind: 'film',
    year: 2021,
    runtime: '2h 35m',
    runtimeMinutes: 155,
    rating: 7.8,
    genres: ['Sci-Fi', 'Drama'],
    director: 'Denis Villeneuve',
    logline:
      'Paul Atreides travels to the most dangerous planet in the universe to ensure the future of his family and his people.',
    synopsis:
      'Entrusted with stewardship of the desert world Arrakis—the sole source of the spice melange—House Atreides walks into a galactic trap amidst colossal sandworms and desert prophecy.',
    curatorNote:
      'Monumental brutalist architecture meets sun-scorched desert minimalism in Greig Fraser’s luminous frames.',
    posterUrl: '/src/assets/images/poster_echoes_of_palermo_1795625174056.jpg',
    backdropUrl: '/src/assets/images/hero_glass_archipelago_1795625170240.jpg',
    accentHue: '#D49B4B',
    trending: true,
    newRelease: true,
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', billing: 'Lead', notable: 'Call Me by Your Name' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', billing: 'Principal', notable: 'Silo' },
      { name: 'Oscar Isaac', role: 'Duke Leto Atreides', billing: 'Principal', notable: 'Inside Llewyn Davis' },
    ],
    specs: {
      cinematography: 'Greig Fraser',
      composer: 'Hans Zimmer',
      aspectRatio: '2.39:1 Scope',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['film-157336', 'film-27205', 'film-335984'],
  },
  {
    id: 'film-496243',
    tmdbId: 496243,
    title: 'Parasite',
    subtitle: 'Act Like You Own the Place',
    kind: 'film',
    year: 2019,
    runtime: '2h 13m',
    runtimeMinutes: 133,
    rating: 8.5,
    genres: ['Thriller', 'Drama'],
    director: 'Bong Joon Ho',
    logline:
      'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    synopsis:
      'One by one, the cunning members of the Kim family insinuate themselves into the modernist hillside estate of the affluent Park family, unaware of a hidden secret beneath the house.',
    curatorNote:
      'Razor-sharp spatial storytelling where staircases, glass walls, and rainstorms chart class divides.',
    posterUrl: '/src/assets/images/poster_glass_archipelago_1795625171712.jpg',
    backdropUrl: '/src/assets/images/hero_velvet_nocturne_1795625170120.jpg',
    accentHue: '#5A8D9A',
    trending: true,
    cast: [
      { name: 'Song Kang-ho', role: 'Kim Ki-taek', billing: 'Lead', notable: 'Memories of Murder' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik', billing: 'Principal', notable: 'My Mister' },
      { name: 'Cho Yeo-jeong', role: 'Choi Yeon-gyo', billing: 'Principal', notable: 'Obsessed' },
    ],
    specs: {
      cinematography: 'Hong Kyung-pyo',
      composer: 'Jung Jae-il',
      aspectRatio: '2.39:1 Scope',
      format: '4K HDR',
      soundMix: 'Dolby Atmos',
      country: 'South Korea',
      language: 'KO',
    },
    similarIds: ['film-155', 'film-329865', 'film-27205'],
  },
  {
    id: 'film-329865',
    tmdbId: 329865,
    title: 'Arrival',
    subtitle: 'Why Are They Here',
    kind: 'film',
    year: 2016,
    runtime: '1h 56m',
    runtimeMinutes: 116,
    rating: 7.6,
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    director: 'Denis Villeneuve',
    logline:
      'Taking place after alien crafts land around the globe, an expert linguist is recruited by the military to determine whether they come in peace or are a threat.',
    synopsis:
      'Linguistics professor Louise Banks enters a towering obsidian monolith in Montana to decode a non-linear visual language that alters her perception of time.',
    curatorNote:
      'Quiet, deeply humane science fiction framed in misty Montana light and Jóhann Jóhannsson’s haunting strings.',
    posterUrl: '/src/assets/images/poster_amber_monsoon_1795625173368.jpg',
    accentHue: '#C48A3E',
    trending: true,
    cast: [
      { name: 'Amy Adams', role: 'Dr. Louise Banks', billing: 'Lead', notable: 'Nocturnal Animals' },
      { name: 'Jeremy Renner', role: 'Ian Donnelly', billing: 'Principal', notable: 'Wind River' },
    ],
    specs: {
      cinematography: 'Bradford Young',
      composer: 'Jóhann Jóhannsson',
      aspectRatio: '2.39:1',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['film-157336', 'film-438631', 'film-27205'],
  },
  {
    id: 'film-335984',
    tmdbId: 335984,
    title: 'Blade Runner 2049',
    subtitle: 'The Key to the Future Is Finally Unearthed',
    kind: 'film',
    year: 2017,
    runtime: '2h 44m',
    runtimeMinutes: 164,
    rating: 7.6,
    genres: ['Sci-Fi', 'Drama', 'Mystery'],
    director: 'Denis Villeneuve',
    logline:
      'Young Blade Runner K’s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard.',
    synopsis:
      'Thirty years after the events of the first film, LAPD Officer K unearths a long-buried secret that threatens to plunge what remains of society into chaos.',
    curatorNote:
      'Roger Deakins’ Academy Award-winning study in amber dust, neon rain, and brutalist shadow.',
    posterUrl: '/src/assets/images/poster_velvet_nocturne_1795625171563.jpg',
    accentHue: '#D4AF6A',
    trending: true,
    newRelease: true,
    cast: [
      { name: 'Ryan Gosling', role: 'K', billing: 'Lead', notable: 'Drive' },
      { name: 'Harrison Ford', role: 'Rick Deckard', billing: 'Principal', notable: 'Blade Runner' },
      { name: 'Ana de Armas', role: 'Joi', billing: 'Principal', notable: 'Knives Out' },
    ],
    specs: {
      cinematography: 'Roger Deakins',
      composer: 'Hans Zimmer & Benjamin Wallfisch',
      aspectRatio: '2.39:1',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['film-438631', 'film-27205', 'film-157336'],
  },
  {
    id: 'film-155',
    tmdbId: 155,
    title: 'The Dark Knight',
    subtitle: 'Welcome to a World Without Rules',
    kind: 'film',
    year: 2008,
    runtime: '2h 32m',
    runtimeMinutes: 152,
    rating: 8.5,
    genres: ['Crime', 'Action', 'Thriller'],
    director: 'Christopher Nolan',
    logline:
      'Batman raises the stakes in his war on crime as the Joker unleashes chaos upon the citizens of Gotham.',
    synopsis:
      'With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague Gotham’s streets.',
    curatorNote:
      'Pioneering 70mm IMAX urban crime epic paced like a nocturnal Michael Mann thriller.',
    posterUrl: '/src/assets/images/poster_iron_symphony_1795625172792.jpg',
    accentHue: '#D4AF6A',
    trending: true,
    cast: [
      { name: 'Christian Bale', role: 'Bruce Wayne', billing: 'Lead', notable: 'The Prestige' },
      { name: 'Heath Ledger', role: 'The Joker', billing: 'Principal', notable: 'Brokeback Mountain' },
    ],
    specs: {
      cinematography: 'Wally Pfister',
      composer: 'Hans Zimmer & James Newton Howard',
      aspectRatio: '2.39:1 / 1.43:1 IMAX',
      format: '4K Dolby Vision',
      soundMix: '5.1 DTS-HD Master',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['film-27205', 'film-496243', 'series-1399'],
  },
  {
    id: 'series-94997',
    tmdbId: 94997,
    title: 'House of the Dragon',
    subtitle: 'Fire Will Reign',
    kind: 'series',
    year: 2022,
    runtime: '18 Episodes',
    runtimeMinutes: 60,
    rating: 8.4,
    genres: ['Drama', 'Action', 'Sci-Fi'],
    director: 'Ryan Condal',
    seasons: 2,
    episodeCount: 18,
    seasonsList: [
      { seasonNumber: 1, name: 'Season 1', episodeCount: 10 },
      { seasonNumber: 2, name: 'Season 2', episodeCount: 8 },
    ],
    episodes: [
      { number: 1, seasonNumber: 1, title: 'The Heirs of the Dragon', duration: '66m', synopsis: 'King Viserys hosts a tournament to celebrate the birth of his second child.' },
      { number: 2, seasonNumber: 1, title: 'The Rogue Prince', duration: '54m', synopsis: 'Princess Rhaenyra oversteps at the Small Council while Daemon seizes Dragonstone.' },
    ],
    logline:
      'The story of the Targaryen civil war that took place about 200 years before events portrayed in Game of Thrones.',
    synopsis:
      'Set two centuries before the events of Game of Thrones, House Targaryen stands at the height of its power—until a succession crisis fractures the realm.',
    curatorNote:
      'Lush candlelight interiors and operatic court drama framed with widescreen theatrical scale.',
    posterUrl: '/src/assets/images/poster_alpine_requiem_1795625228281.jpg',
    accentHue: '#A84448',
    newRelease: true,
    cast: [
      { name: 'Emma D’Arcy', role: 'Rhaenyra Targaryen', billing: 'Lead', notable: 'Truth Seekers' },
      { name: 'Matt Smith', role: 'Daemon Targaryen', billing: 'Principal', notable: 'The Crown' },
    ],
    specs: {
      cinematography: 'Fabian Wagner',
      composer: 'Ramin Djawadi',
      aspectRatio: '2.00:1',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['series-1399', 'series-100088', 'film-438631'],
  },
  {
    id: 'series-100088',
    tmdbId: 100088,
    title: 'The Last of Us',
    subtitle: 'When You’re Lost in the Darkness',
    kind: 'series',
    year: 2023,
    runtime: '9 Episodes',
    runtimeMinutes: 55,
    rating: 8.6,
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    director: 'Craig Mazin & Neil Druckmann',
    seasons: 1,
    episodeCount: 9,
    seasonsList: [{ seasonNumber: 1, name: 'Season 1', episodeCount: 9 }],
    episodes: [
      { number: 1, seasonNumber: 1, title: 'When You’re Lost in the Darkness', duration: '81m', synopsis: 'Twenty years after a fungal pandemic, Joel takes on a perilous smuggling job.' },
      { number: 2, seasonNumber: 1, title: 'Infected', duration: '53m', synopsis: 'Joel, Tess, and Ellie cross a flooded Boston museum.' },
    ],
    logline:
      'Twenty years after modern civilization has been destroyed, Joel is hired to smuggle Ellie out of an oppressive quarantine zone.',
    synopsis:
      'What starts as a small job soon becomes a brutal, heartbreaking journey across a reclaimed American landscape as Joel and Ellie depend on each other for survival.',
    curatorNote:
      'Naturalistic overgrown cities and Gustavo Santaolalla’s spare acoustic guitar create rare emotional gravity.',
    posterUrl: '/src/assets/images/poster_kiln_and_ash_1795625228925.jpg',
    accentHue: '#D97736',
    newRelease: true,
    cast: [
      { name: 'Pedro Pascal', role: 'Joel Miller', billing: 'Lead', notable: 'Narcos' },
      { name: 'Bella Ramsey', role: 'Ellie', billing: 'Lead', notable: 'Catherine Called Birdy' },
    ],
    specs: {
      cinematography: 'Ksenia Sereda',
      composer: 'Gustavo Santaolalla',
      aspectRatio: '1.78:1',
      format: '4K Dolby Vision',
      soundMix: 'Dolby Atmos',
      country: 'United States',
      language: 'EN',
    },
    similarIds: ['series-1399', 'series-94997', 'film-329865'],
  },
];

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: 'architects-of-time',
    index: 'Collection 01',
    title: 'Architects of Time & Scale',
    subtitle: 'Sci-Fi & Cerebral Cinema',
    description:
      'Monumental visions of space, memory, and non-linear time—crafted on large-format stock for widescreen immersion.',
    curator: 'Curated by Vespera Salon',
    filmIds: ['film-27205', 'film-157336', 'film-438631', 'film-329865'],
    coverUrl: '/src/assets/images/poster_solaris_drift_1795625169656.jpg',
  },
  {
    id: 'nocturnes-and-intrigue',
    index: 'Collection 02',
    title: 'Nocturnes & Shadow',
    subtitle: 'Neo-Noir & Modern Thrillers',
    description:
      'Taut inquiries into ambition, double lives, and urban twilight across Seoul, Gotham, and futuristic Los Angeles.',
    curator: 'Curated by Vespera Salon',
    filmIds: ['film-335984', 'film-496243', 'film-155'],
    coverUrl: '/src/assets/images/poster_velvet_nocturne_1795625171563.jpg',
  },
  {
    id: 'prestige-epics',
    index: 'Collection 03',
    title: 'Prestige Episodic Worlds',
    subtitle: 'Landmark Limited & Ongoing Series',
    description:
      'Long-form television crafted with theatrical scale, rich world-building, and multi-season narrative arcs.',
    curator: 'Curated by Vespera Salon',
    filmIds: ['series-1399', 'series-94997', 'series-100088'],
    coverUrl: '/src/assets/images/poster_cartographers_dream_1795625173436.jpg',
  },
];

export function getFilmById(id: string): FilmItem | undefined {
  return CATALOG.find((f) => f.id === id);
}

export function getSimilarFilms(film: FilmItem): FilmItem[] {
  if (film.recommendations && film.recommendations.length > 0) {
    return film.recommendations;
  }
  return film.similarIds
    .map((id) => getFilmById(id))
    .filter((item): item is FilmItem => Boolean(item));
}
