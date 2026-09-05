import { Link } from 'react-router-dom';
import { ArrowRight, Target, Sparkles, TrendingUp, Film, Play } from 'lucide-react';

import VideoPlayer from '@/components/media/VideoPlayer';
import HeroVideoBackdrop from '@/components/home/HeroVideoBackdrop';
import { useHomeContent } from '@/hooks/useHomeContent';

const iconMap = [Target, Sparkles, TrendingUp, Film];

const HeroSection = () => {
  const { content } = useHomeContent();
  const h = content.hero;
  const showreel = h.showreelYoutubeId?.trim();

  return (
    <section className="relative min-h-[100svh] flex items-end overflow-hidden">
      {/* Vídeo de fundo em loop com foto como fallback */}
      <HeroVideoBackdrop youtubeId={h.backgroundVideoYoutubeId} image={h.backgroundImage} />

      <div className="container-custom relative z-10 pt-24 md:pt-40 pb-8 md:pb-20 w-full">
        <div className="max-w-3xl">
          {/* Headline principal */}
          <h1 className="text-[2rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight mb-4 md:mb-7 animate-fade-in delay-100">
            {h.headline1}{' '}
            <span className="text-primary">{h.headlineHighlight}</span>
            {' '}{h.headline2}
          </h1>

          {/* Subtítulo */}
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-xl mb-6 md:mb-10 animate-fade-in delay-200">
            {h.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-row items-center gap-2.5 md:gap-4 animate-fade-in delay-300">
            <Link to="/contato" className="btn-primary inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-base px-4 py-2.5 sm:px-7 sm:py-3.5 md:px-8 md:py-4 justify-center group">
              {h.ctaPrimary}
              <ArrowRight className="w-3.5 h-3.5 md:w-5 md:h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/cases" className="inline-flex items-center gap-1.5 md:gap-2 text-xs sm:text-base text-foreground/80 hover:text-primary transition-colors px-2 py-2.5 group">
              <Play className="w-3 h-3 md:w-4 md:h-4 fill-current" />
              {h.ctaSecondary}
            </Link>
          </div>
        </div>

        {/* Showreel opcional */}
        {showreel && (
          <div className="max-w-3xl mt-8 md:mt-14 animate-fade-in delay-300">
            <div className="rounded-xl overflow-hidden border border-border">
              <VideoPlayer url={`https://www.youtube.com/watch?v=${showreel}`} title="Showreel Racun" aspect="aspect-video" />
            </div>
          </div>
        )}

        {/* Pilares */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mt-8 md:mt-16 pt-5 md:pt-8 border-t border-border animate-fade-in delay-400">
          {h.pillars.map((pillar, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <div key={index} className="group">
                <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary mb-1.5 md:mb-3" strokeWidth={1.5} />
                <h3 className="font-display font-semibold text-[11px] md:text-base mb-0.5 md:mb-1.5">{pillar.title}</h3>
                <p className="text-[10px] md:text-sm text-muted-foreground line-clamp-2 hero-pillar-desc">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
