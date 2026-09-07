import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { useClientLogos } from '@/hooks/useClientLogos';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useInfiniteMarquee } from '@/hooks/useInfiniteMarquee';

const TestimonialCard = ({ t }: { t: Testimonial }) => {
  const initials = t.name?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '•';
  return (
    <article
      className="group relative flex flex-col w-[280px] sm:w-[360px] md:w-[420px] shrink-0 rounded-2xl border border-border p-5 md:p-7 transition-colors duration-300 hover:border-primary/40"
    >
      <Quote className="absolute top-4 right-4 w-5 h-5 md:w-7 md:h-7 text-primary/25" strokeWidth={1.5} aria-hidden />

      {typeof t.rating === 'number' && t.rating > 0 && (
        <div className="flex gap-1 mb-3 md:mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 md:w-4 md:h-4 ${i < (t.rating ?? 0) ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
            />
          ))}
        </div>
      )}

      <p className="text-sm md:text-base text-foreground/90 leading-relaxed mb-5 md:mb-6 line-clamp-6 pr-6">
        "{t.quote}"
      </p>

      <div className="mt-auto flex items-center gap-3 pt-4 border-t border-border">
        {t.image_url ? (
          <img
            src={t.image_url}
            alt={t.name}
            loading="lazy"
            className="w-11 h-11 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-secondary border border-white/10 flex items-center justify-center text-sm font-medium text-foreground">
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{t.name}</p>
          <p className="text-sm text-muted-foreground truncate">{t.role}</p>
        </div>
      </div>
    </article>
  );
};

const FALLBACK_CLIENTS = [
  'Prisma', 'Assadão', 'Scottini', 'Kaj Club', 'Braseiro da Vila',
  'Empreenda SC', 'Calafate', 'Vitech', 'Parceiros Internet',
];

const SocialProofSection = () => {
  const { logos } = useClientLogos();
  const { testimonials } = useTestimonials();
  const { content } = useHomeContent();
  const sp = content.socialProof;

  // Need enough items for a seamless loop
  const tList = testimonials.length > 0
    ? (testimonials.length < 4 ? [...testimonials, ...testimonials, ...testimonials] : testimonials)
    : [];
  const tDouble = [...tList, ...tList];

  const logoItems = logos.length > 0
    ? logos.map(l => ({ id: l.id, name: l.name, image_url: l.image_url }))
    : FALLBACK_CLIENTS.map(name => ({ id: name, name, image_url: '' }));
  const logoList = logoItems.length < 8 ? [...logoItems, ...logoItems, ...logoItems] : logoItems;
  const logoDouble = [...logoList, ...logoList];

  const testimonialsMarquee = useInfiniteMarquee(35);
  const logosMarquee = useInfiniteMarquee(50);

  return (
    <section className="section-padding relative overflow-hidden border-t border-border bg-secondary/10">
      <div className="container-custom relative z-10">
        <div className="max-w-2xl mb-8 md:mb-14">
          <span className="block text-[10px] md:text-xs font-medium uppercase tracking-[0.28em] text-primary mb-2.5 md:mb-5">
            {sp.badge}
          </span>
          <h2 className="font-display font-bold tracking-tight text-[1.5rem] leading-[1.1] sm:text-4xl md:text-5xl mb-3 md:mb-5">
            {sp.title} <span className="text-primary">{sp.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-lg">
            Marcas que confiam na Racun para crescer com estratégia, conteúdo e performance.
          </p>
        </div>

        {/* DEPOIMENTOS — carrossel infinito */}
        <div className="relative mb-10 md:mb-16">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10 bg-gradient-to-r from-background to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10 bg-gradient-to-l from-background to-transparent" aria-hidden />

          <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none" {...testimonialsMarquee.handlers}>
            {tDouble.length > 0 ? (
              <div
                ref={testimonialsMarquee.trackRef}
                className="flex gap-6 py-4 will-change-transform"
                style={{ width: 'max-content' }}
              >
                {tDouble.map((t, i) => (
                  <TestimonialCard key={`${t.id}-${i}`} t={t} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Quote className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p>Depoimentos em breve.</p>
              </div>
            )}
          </div>
        </div>

        {/* CLIENTES — faixa infinita de logos */}
        <div className="relative mb-12">
          <p className="text-center text-sm text-muted-foreground uppercase tracking-[0.2em] mb-8">
            Clientes atendidos
          </p>

          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32 z-10 bg-gradient-to-r from-background to-transparent" aria-hidden />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32 z-10 bg-gradient-to-l from-background to-transparent" aria-hidden />

          <div className="overflow-hidden cursor-grab active:cursor-grabbing select-none" {...logosMarquee.handlers}>
            <div
              ref={logosMarquee.trackRef}
              className="flex items-center gap-10 md:gap-16 py-4 will-change-transform"
              style={{ width: 'max-content' }}
            >
              {logoDouble.map((logo, i) => (
                <div
                  key={`${logo.id}-${i}`}
                  className="shrink-0 h-14 md:h-16 flex items-center justify-center transition-all duration-500 opacity-50 hover:opacity-100"
                  title={logo.name}
                >
                  {logo.image_url ? (
                    <img
                      src={logo.image_url}
                      alt={logo.name}
                      loading="lazy"
                      className="max-h-full max-w-[160px] object-contain grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <span className="font-display text-2xl md:text-3xl text-foreground/60 hover:text-primary transition-colors duration-500 whitespace-nowrap px-2">
                      {logo.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
            {sp.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
