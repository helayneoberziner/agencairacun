import { useClientLogos } from '@/hooks/useClientLogos';
import { useInfiniteMarquee } from '@/hooks/useInfiniteMarquee';

const FALLBACK_CLIENTS = [
  'Prisma', 'Assadão', 'Scottini', 'Kaj Club', 'Calafate',
  'Braseiro da Vila', 'Parceiros Internet', 'Empreenda SC', 'Vitech',
];

/**
 * Premium infinite marquee of client logos. Sits right under the hero
 * to immediately establish authority.
 */
const ClientsStrip = () => {
  const { logos } = useClientLogos();
  const items = logos.length > 0
    ? logos.map(l => ({ id: l.id, name: l.name, image_url: l.image_url }))
    : FALLBACK_CLIENTS.map(name => ({ id: name, name, image_url: '' }));
  const filled = items.length < 8 ? [...items, ...items, ...items] : items;
  const doubled = [...filled, ...filled];

  const { trackRef, handlers } = useInfiniteMarquee(45);

  return (
    <section className="relative py-12 md:py-20 border-y border-border bg-secondary/10">
      <div className="container-custom mb-8 md:mb-12">
        <span className="block text-[11px] md:text-xs font-medium uppercase tracking-[0.28em] text-primary mb-3 md:mb-4">
          Clientes
        </span>
        <h2 className="font-display font-bold tracking-tight text-[1.5rem] leading-[1.15] sm:text-3xl md:text-4xl max-w-2xl">
          Empresas que confiam na <span className="text-primary">Racun</span>
        </h2>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-background to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-background to-transparent" aria-hidden />

        <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none" {...handlers}>
          <div
            ref={trackRef}
            className="flex items-center gap-8 md:gap-16 py-2 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {doubled.map((c, i) => (
              <div
                key={`${c.id}-${i}`}
                className="shrink-0 h-10 md:h-14 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity duration-500"
                title={c.name}
              >
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={c.name}
                    loading="lazy"
                    className="max-h-full max-w-[140px] md:max-w-[180px] object-contain grayscale hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <span className="font-display text-xl md:text-3xl text-foreground/60 hover:text-primary transition-colors duration-500 whitespace-nowrap px-2">
                    {c.name}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsStrip;