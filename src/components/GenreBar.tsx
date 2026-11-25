import { GENRES } from '../data/catalog';

export type GenreFilter = (typeof GENRES)[number];

interface GenreBarProps {
  selected: GenreFilter;
  onSelect: (genre: GenreFilter) => void;
  resultCount: number;
}

export function GenreBar({ selected, onSelect, resultCount }: GenreBarProps) {
  return (
    <section
      aria-label="Filter by genre"
      className="mx-auto max-w-[1400px] px-5 py-4 sm:px-8 lg:px-10"
    >
      <div className="flex flex-col gap-3 border-y border-white/[0.07] py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <span className="text-xs font-medium tracking-[0.1em] uppercase text-[#8E8C86] whitespace-nowrap shrink-0 mr-1">
            Explore by Mood
          </span>

          <div
            role="tablist"
            aria-label="Cinema genres"
            className="flex items-center gap-1.5"
          >
            {GENRES.map((genre) => {
              const isActive = selected === genre;
              return (
                <button
                  key={genre}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelect(genre)}
                  className={`h-9 rounded-md px-3.5 text-[13px] font-medium transition-all duration-200 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A] ${
                    isActive
                      ? 'bg-[#D4AF6A] text-[#090A0B]'
                      : 'bg-white/[0.04] text-[#B8B4AA] hover:bg-white/[0.09] hover:text-[#F5F2EB]'
                  }`}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-xs text-[#8E8C86] tabular-nums whitespace-nowrap shrink-0">
          {resultCount} {resultCount === 1 ? 'work' : 'works'}
        </div>
      </div>
    </section>
  );
}
