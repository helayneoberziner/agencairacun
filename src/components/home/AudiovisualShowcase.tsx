import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useHomeContent } from '@/hooks/useHomeContent';
import { parseYouTubeId, getYouTubeThumb } from '@/lib/videoUtils';

/**
 * Cinematic audiovisual showcase. Lead section after the hero/clients
 * strip — establishes the agency's strongest differentiator.
 */
const AudiovisualShowcase = () => {
  const { content } = useHomeContent();
  const a = content.audiovisual;

  const featured = a.featuredYoutubeId?.trim();
  const items = a.items.filter(i => i.youtubeId?.trim() || i.imageUrl?.trim());

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[160px]" aria-hidden />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[140px]" aria-hidden />

      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 text-primary text-sm font-medium uppercase tracking-wider mb-4">
            <Film className="w-4 h-4" />
            {a.badge}
          </span>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-5 leading-tight">
            {a.title} <span className="text-gradient-neon italic">{a.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-base md:text-lg">{a.subtitle}</p>
        </div>

        {featured && (
          <div className="mb-8 md:mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)]">
            <VideoPlayer url={`https://www.youtube.com/watch?v=${featured}`} aspect="aspect-video" />
          </div>
        )}

        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {items.map((item, i) => {
              const ytId = item.youtubeId ? parseYouTubeId(`https://www.youtube.com/watch?v=${item.youtubeId}`) : null;
              const cover = item.imageUrl || (ytId ? getYouTubeThumb(ytId) : '');
              const inner = (
                <div className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-secondary/30">
                  {cover ? (
                    <img
                      src={cover}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    {item.category && (
                      <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-primary mb-2 font-medium">
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-display text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-500">
                      {item.title}
                    </h3>
                  </div>
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ boxShadow: 'inset 0 0 80px hsl(var(--primary) / 0.25)' }}
                    aria-hidden
                  />
                </div>
              );
              return item.link ? (
                <Link key={i} to={item.link}>{inner}</Link>
              ) : (
                <div key={i}>{inner}</div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link to={a.ctaLink || '/produtora'} className="btn-primary inline-flex items-center gap-2">
            {a.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AudiovisualShowcase;