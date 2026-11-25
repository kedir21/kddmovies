import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { FilmItem } from '../types/cinema';
import { CinemaImage } from './CinemaImage';

interface AsymmetricShowcaseProps {
  monographFilm: FilmItem;
  verticalFilm: FilmItem;
  secondaryFilm: FilmItem;
  artisanFilm: FilmItem;
  onSelectFilm: (film: FilmItem) => void;
}

export function AsymmetricShowcase({
  monographFilm,
  verticalFilm,
  secondaryFilm,
  artisanFilm,
  onSelectFilm,
}: AsymmetricShowcaseProps) {
  return (
    <section
      aria-label="Editorial monograph showcase"
      className="relative mx-auto my-8 max-w-[1400px] px-5 sm:px-8 lg:px-10"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0A1416] via-[#0B0F12] to-[#12100E] p-6 sm:p-10 lg:p-12">
        {/* Subtle atmospheric backlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/3 h-80 w-96 rounded-full bg-[#1F4A4F]/20 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/4 h-72 w-80 rounded-full bg-[#D4AF6A]/10 blur-[110px]"
        />

        {/* Editorial Section Header */}
        <div className="relative z-10 mb-8 flex flex-col justify-between gap-4 border-b border-white/[0.08] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#D4AF6A]">
              Editorial Composition
            </p>
            <h2 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#F5F2EB] sm:text-4xl">
              The Auteur Monograph
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-[#A4A8A9]">
            Architectural pairings from this season’s festival circuit—selected for tactile cinematography and spatial stillness.
          </p>
        </div>

        {/* Asymmetric 4-Column Architectural Composition */}
        <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-12 lg:items-stretch">
          {/* Column 1: Tall Vertical Typographic Spine (2 cols) */}
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectFilm(verticalFilm)}
            className="group relative flex min-h-[340px] flex-col justify-between overflow-hidden rounded-lg border border-white/[0.1] bg-[#0D1A1C]/70 p-5 text-left transition-colors duration-300 hover:border-[#D4AF6A]/45 lg:col-span-2 lg:min-h-[460px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <div className="flex items-center justify-between text-[11px] tracking-[0.08em] text-[#8FA2A5] tabular-nums">
              <span>{verticalFilm.runtime}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#D4AF6A]" />
            </div>

            <div className="my-6 flex flex-1 items-center justify-center">
              <span className="font-serif text-3xl font-medium tracking-tight text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A] lg:[writing-mode:vertical-rl] lg:rotate-180 lg:text-[2rem]">
                {verticalFilm.title}
              </span>
            </div>

            <div className="flex items-center justify-between border-t border-white/[0.08] pt-3 text-[11px] text-[#9EB0B2] tabular-nums">
              <span>{verticalFilm.year}</span>
              <span>{verticalFilm.genres[0]}</span>
            </div>
          </motion.button>

          {/* Column 2: Split Typographic Header + Portrait Poster (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectFilm(secondaryFilm)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectFilm(secondaryFilm);
              }
            }}
            className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-white/[0.1] bg-[#0F191C]/80 transition-colors duration-300 hover:border-[#D4AF6A]/45 lg:col-span-3 focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <div className="flex items-end justify-between gap-3 p-5">
              <div>
                <p className="text-[11px] tracking-[0.1em] uppercase text-[#8FA2A5]">
                  {secondaryFilm.director}
                </p>
                <h3 className="mt-1.5 font-serif text-2xl font-medium leading-tight text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A]">
                  {secondaryFilm.title}
                </h3>
              </div>
              <span className="text-[11px] text-[#8FA2A5] tabular-nums shrink-0">
                {secondaryFilm.year}
              </span>
            </div>

            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <CinemaImage
                src={secondaryFilm.posterUrl}
                alt={secondaryFilm.title}
                title={secondaryFilm.title}
                className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </div>
          </motion.div>

          {/* Column 3: Editorial Text Block + Artisan Portrait Frame (3 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-5 lg:col-span-3"
          >
            <button
              type="button"
              onClick={() => onSelectFilm(artisanFilm)}
              className="group flex flex-col justify-between rounded-lg border border-white/[0.1] bg-[#111518]/85 p-5 text-left transition-colors duration-300 hover:border-[#D4AF6A]/45 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
            >
              <div className="flex items-center justify-between text-[11px] tracking-[0.08em] uppercase text-[#D4AF6A]">
                <span>{artisanFilm.genres[0]}</span>
                <span className="tabular-nums text-[#8E8C86]">
                  ★ {artisanFilm.rating.toFixed(1)}
                </span>
              </div>
              <h3 className="mt-3 font-serif text-2xl font-medium leading-snug text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A]">
                {artisanFilm.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#9FA4A6]">
                {artisanFilm.logline}
              </p>
            </button>

            <button
              type="button"
              onClick={() => onSelectFilm(artisanFilm)}
              aria-label={`Inspect ${artisanFilm.title}`}
              className="group relative flex-1 overflow-hidden rounded-lg border border-white/[0.1] bg-[#101215] min-h-[240px] cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
            >
              <CinemaImage
                src={artisanFilm.posterUrl}
                alt={artisanFilm.title}
                title={artisanFilm.title}
                className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
            </button>
          </motion.div>

          {/* Column 4: Dominant Showcase Monograph Card (4 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => onSelectFilm(monographFilm)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectFilm(monographFilm);
              }
            }}
            className="group flex cursor-pointer flex-col justify-between overflow-hidden rounded-lg border border-white/[0.1] bg-[#0D1013] transition-colors duration-300 hover:border-[#D4AF6A]/45 lg:col-span-4 focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <div className="relative aspect-[4/4.2] w-full overflow-hidden">
              <CinemaImage
                src={monographFilm.posterUrl}
                alt={monographFilm.title}
                title={monographFilm.title}
                className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D1013] via-transparent to-transparent"
              />
            </div>

            <div className="flex flex-1 flex-col justify-between p-6">
              <div>
                <div className="flex items-center justify-between text-xs text-[#9C9A94] tabular-nums">
                  <span>{monographFilm.director}</span>
                  <span>
                    {monographFilm.year} · {monographFilm.runtime}
                  </span>
                </div>
                <h3 className="mt-2 font-serif text-3xl font-medium tracking-tight text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A]">
                  {monographFilm.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#B0B2B4]">
                  {monographFilm.curatorNote}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4 text-xs font-medium tracking-[0.08em] uppercase text-[#D4AF6A]">
                <span>Inspect Dossier</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
