import { ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { CuratedCollection } from '../types/cinema';
import { CinemaImage } from './CinemaImage';

interface CuratedCollectionsProps {
  collections: CuratedCollection[];
  onOpenCollection: (collection: CuratedCollection) => void;
}

export function CuratedCollections({
  collections,
  onOpenCollection,
}: CuratedCollectionsProps) {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-12 sm:px-8 lg:px-10">
      <div className="mb-8 flex flex-col justify-between gap-3 border-b border-white/[0.08] pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-[#D4AF6A]">
            Curatorial Programs
          </p>
          <h2 className="mt-1.5 font-serif text-3xl font-medium tracking-tight text-[#F5F2EB] sm:text-4xl">
            Thematic Editions
          </h2>
        </div>
        <p className="max-w-sm text-sm text-[#8E8C86]">
          Double and triple features sequenced by visual tone, atmosphere, and architectural setting.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {collections.map((collection, idx) => (
          <motion.button
            key={collection.id}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.45,
              delay: idx * 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            onClick={() => onOpenCollection(collection)}
            className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#0F1114] text-left transition-all duration-300 hover:border-[#D4AF6A]/45 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#D4AF6A]"
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden">
              <CinemaImage
                src={collection.coverUrl}
                alt={collection.title}
                title={collection.title}
                className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1114] via-[#0F1114]/30 to-transparent"
              />
              <span className="absolute bottom-3 left-5 text-xs font-medium tracking-[0.1em] uppercase text-[#D4AF6A]">
                {collection.index}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
              <div>
                <h3 className="font-serif text-2xl font-medium tracking-tight text-[#F5F2EB] transition-colors group-hover:text-[#D4AF6A]">
                  {collection.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#9C9A94]">
                  {collection.description}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4 text-xs text-[#8E8C86]">
                <span className="tabular-nums">
                  {collection.filmIds.length} Works · {collection.curator}
                </span>
                <ArrowRight className="h-4 w-4 text-[#C8C4BA] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#D4AF6A]" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
