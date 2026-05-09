import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const HeroSection = () => {
  const { content } = useHomeContent();
  const h = content.hero;
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const parallax = Math.min(scrollY * 0.25, 160);

  return (
    <section className="relative min-h-[100vh] flex items-end overflow-hidden">
      {/* Background */}
      {h.backgroundImage ? (
        <>
          <img
            src={h.backgroundImage}
            alt=""
            style={{ transform: `translateY(${parallax}px) scale(1.15)` }}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 gradient-mesh opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />
        </>
      )}

      <div className="container-custom relative z-10 pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-5xl">
          <p className="text-eyebrow mb-8 animate-fade-in">{h.badge}</p>

          <h1 className="text-display text-5xl md:text-7xl lg:text-8xl mb-10 animate-fade-in delay-100">
            {h.headline1}{' '}
            <span className="italic text-primary">{h.headlineHighlight}</span>{' '}
            {h.headline2}
          </h1>

          <p className="text-lg md:text-2xl text-foreground/70 max-w-2xl mb-12 font-light leading-relaxed animate-fade-in delay-200">
            {h.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in delay-300">
            <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
              {h.ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/cases" className="btn-outline inline-flex items-center gap-2">
              {h.ctaSecondary}
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-3 text-foreground/40">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-foreground/40 to-transparent" />
      </div>
    </section>
  );
};

export default HeroSection;
