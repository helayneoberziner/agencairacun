import { useEffect, useRef, useState, useCallback, PointerEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Quote, Star } from 'lucide-react';
import { useClientLogos } from '@/hooks/useClientLogos';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { useHomeContent } from '@/hooks/useHomeContent';

/**
 * Infinite, pause-on-interaction marquee. Resumes from the exact point.
 * pxPerSecond controls speed; direction can be 'left' or 'right'.
 */
function useInfiniteMarquee(pxPerSecond = 40) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const dragRef = useRef<{ active: boolean; startX: number; startOffset: number } | null>(null);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // Track contains two identical groups; half = one group width
    halfWidthRef.current = el.scrollWidth / 2;
  }, []);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      if (!pausedRef.current && !dragRef.current?.active && halfWidthRef.current > 0) {
        offsetRef.current -= pxPerSecond * dt;
        if (offsetRef.current <= -halfWidthRef.current) {
          offsetRef.current += halfWidthRef.current;
        }
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [pxPerSecond]);

  const onPointerEnter = () => { pausedRef.current = true; };
  const onPointerLeave = () => {
    pausedRef.current = false;
    dragRef.current = null;
  };
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    pausedRef.current = true;
    dragRef.current = { active: true, startX: e.clientX, startOffset: offsetRef.current };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current?.active) return;
    const dx = e.clientX - dragRef.current.startX;
    let next = dragRef.current.startOffset + dx;
    const hw = halfWidthRef.current;
    if (hw > 0) {
      // keep within [-hw, 0] for seamless loop
      next = ((next % hw) - hw) % hw;
      if (next > 0) next -= hw;
    }
    offsetRef.current = next;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${next}px, 0, 0)`;
    }
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current) dragRef.current.active = false;
    pausedRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  return {
    trackRef,
    handlers: {
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}

const TestimonialCard = ({ t }: { t: Testimonial }) => {
  const initials = t.name?.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase() || '•';
  return (
    <article
      className="group relative w-[320px] sm:w-[380px] md:w-[420px] shrink-0 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md p-7 transition-all duration-500 hover:border-primary/40 hover:bg-white/[0.05] hover:-translate-y-1"
      style={{ boxShadow: '0 10px 40px -20px hsl(var(--primary) / 0.15)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: '0 0 60px -10px hsl(var(--primary) / 0.35)' }}
        aria-hidden
      />
      <Quote className="absolute top-5 right-5 w-7 h-7 text-primary/25" aria-hidden />

      {typeof t.rating === 'number' && t.rating > 0 && (
        <div className="flex gap-1 mb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < (t.rating ?? 0) ? 'fill-primary text-primary' : 'text-white/15'}`}
            />
          ))}
        </div>
      )}

      <p className="text-foreground/90 leading-relaxed mb-6 line-clamp-6 min-h-[120px]">
        "{t.quote}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        {t.image_url ? (
          <img
            src={t.image_url}
            alt={t.name}
            loading="lazy"
            className="w-11 h-11 rounded-full object-cover border border-white/10"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border border-white/10 flex items-center justify-center text-sm font-medium text-foreground">
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
    <section className="section-padding relative overflow-hidden bg-secondary/20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[140px]" aria-hidden />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[128px]" aria-hidden />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            {sp.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-5">
            {sp.title} <span className="text-gradient-neon italic">{sp.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Marcas que confiam na Racun para crescer com estratégia, conteúdo e performance.
          </p>
        </div>

        {/* DEPOIMENTOS — carrossel infinito premium */}
        <div className="relative mb-16">
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
