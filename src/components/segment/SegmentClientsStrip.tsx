import { useMemo } from 'react';
import { useClientLogos } from '@/hooks/useClientLogos';
import { useInfiniteMarquee } from '@/hooks/useInfiniteMarquee';
import { normalizeSegment } from '@/lib/segments';

const SegmentClientsStrip = ({ slug }: { slug: string }) => {
  const { logos } = useClientLogos();
  const segNorm = normalizeSegment(slug);

  const filtered = useMemo(
    () => logos.filter(l => (l.segments || []).map(normalizeSegment).includes(segNorm)),
    [logos, segNorm],
  );

  const { trackRef, handlers } = useInfiniteMarquee(35);

  if (filtered.length === 0) return null;

  const doubled = [...filtered, ...filtered];

  return (
    <section className="py-14 md:py-20 border-y border-white/5 bg-background/50 overflow-hidden">
      <div className="container-custom mb-8 text-center">
        <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-3 block">Clientes do segmento</span>
        <h3 className="text-2xl md:text-3xl font-display font-bold">
          Marcas que <span className="text-gradient-neon italic">confiam</span> na Racun.
        </h3>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" {...handlers}>
          <div ref={trackRef} className="flex gap-10 md:gap-16 items-center will-change-transform select-none">
            {doubled.map((l, i) => (
              <div key={`${l.id}-${i}`} className="flex-shrink-0 h-14 md:h-20 flex items-center justify-center px-4">
                <img
                  src={l.image_url}
                  alt={l.name}
                  loading="lazy"
                  className="h-full w-auto max-w-[160px] object-contain opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentClientsStrip;