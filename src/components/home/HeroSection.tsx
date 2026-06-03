import { Link } from 'react-router-dom';
import { ArrowRight, Target, Sparkles, TrendingUp, Play } from 'lucide-react';
import ParticlesBackground from '../ParticlesBackground';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useHomeContent } from '@/hooks/useHomeContent';

const iconMap = [Target, Sparkles, TrendingUp];

const HeroSection = () => {
  const { content } = useHomeContent();
  const h = content.hero;
  const showreel = h.showreelYoutubeId?.trim();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      {h.backgroundImage ? (
        <>
          <img src={h.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-background/60" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 gradient-mesh" />
          <div className="absolute inset-0 grid-overlay opacity-30" />
        </>
      )}
      <ParticlesBackground />

      {/* Glow orbs */}
      <div className="hidden md:block absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
      <div className="hidden md:block absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[128px] animate-float delay-300" />

      <div className="container-custom relative z-10 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="text-center max-w-5xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm mb-6 md:mb-8 animate-fade-in">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            {h.badge}
          </div>

          {/* Main headline */}
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-4 md:mb-6 animate-fade-in delay-100">
            {h.headline1}{' '}
            <span className="text-gradient-neon">{h.headlineHighlight}</span>
            {' '}{h.headline2}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 md:mb-10 animate-fade-in delay-200">
            {h.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 animate-fade-in delay-300">
            <Link to="/contato" className="btn-primary flex items-center gap-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto justify-center group">
              {h.ctaPrimary}
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/cases" className="btn-outline flex items-center gap-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto justify-center group">
              <Play className="w-4 h-4 fill-current" />
              {h.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Optional showreel */}
        {showreel && (
          <div className="max-w-4xl mx-auto mb-10 md:mb-16 animate-fade-in delay-300">
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.45)]">
              <VideoPlayer url={`https://www.youtube.com/watch?v=${showreel}`} title="Showreel Racun" aspect="aspect-video" />
            </div>
          </div>
        )}

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-10 md:mt-16 animate-fade-in delay-400">
          {h.pillars.map((pillar, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <div
                key={index}
                className="glass-card-hover p-6 md:p-8 text-center group"
                style={{ animationDelay: `${(index + 4) * 100}ms` }}
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:neon-glow transition-all duration-500">
                  <Icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
