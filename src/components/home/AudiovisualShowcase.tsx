import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Film, Play, X } from 'lucide-react';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useHomeContent } from '@/hooks/useHomeContent';
import { parseYouTubeId, getYouTubeThumb } from '@/lib/videoUtils';
import { useCases } from '@/hooks/useCases';

/**
 * Cinematic audiovisual showcase. Lead section after the hero/clients
 * strip — establishes the agency's strongest differentiator.
 */
const AudiovisualShowcase = () => {
  const { content } = useHomeContent();
  const a = content.audiovisual;
  const [playing, setPlaying] = useState<string | null>(null);
  const { data: cases = [] } = useCases({ homeOnly: true });

  // Cases marked with the star (show_on_home) become the cinematic grid.
  const caseItems = cases
    .map(c => {
      const ytId = c.hero_youtube_id || parseYouTubeId(c.hero_media_url || '');
      const cover = c.hero_image_url || (ytId ? getYouTubeThumb(ytId) : '');
      if (!ytId && !cover) return null;
      return {
        slug: c.slug,
        title: c.title,
        category: c.client_name,
        youtubeId: ytId,
        cover,
      };
    })
    .filter(Boolean) as Array<{ slug: string; title: string; category: string; youtubeId: string | null; cover: string }>;

  const featured = a.featuredYoutubeId?.trim();
  // Fallback to legacy CMS items if no case is marked yet
  const legacyItems = a.items.filter(i => i.youtubeId?.trim() || i.imageUrl?.trim());
  const useCaseItems = caseItems.length > 0;

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

        {useCaseItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {caseItems.map((item) => {
              const inner = (
                <div className="group relative aspect-[4/5] overflow-hidden rounded-xl border border-white/10 bg-secondary/30">
                  {item.cover ? (
                    <img
                      src={item.cover}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  {item.youtubeId && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)] group-hover:scale-110 transition-transform duration-500">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-primary mb-2 font-medium">
                      {item.category}
                    </span>
                    <h3 className="font-display text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-500">
                      {item.title}
                    </h3>
                  </div>
                </div>
              );
              if (item.youtubeId) {
                return (
                  <button key={item.slug} type="button" onClick={() => setPlaying(item.youtubeId!)} className="text-left">
                    {inner}
                  </button>
                );
              }
              return <Link key={item.slug} to={`/cases/${item.slug}`}>{inner}</Link>;
            })}
          </div>
        ) : legacyItems.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {legacyItems.map((item, i) => {
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
                  {ytId && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur shadow-[0_10px_40px_-10px_hsl(var(--primary)/0.8)] group-hover:scale-110 transition-transform duration-500">
                        <Play className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
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
              if (ytId) {
                return (
                  <button key={i} type="button" onClick={() => setPlaying(ytId)} className="text-left">
                    {inner}
                  </button>
                );
              }
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

      {playing && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPlaying(null)}
        >
          <div className="relative w-full max-w-5xl" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setPlaying(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-background/70 flex items-center justify-center text-foreground hover:bg-background"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="aspect-video rounded-2xl overflow-hidden bg-black border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0&modestbranding=1`}
                className="w-full h-full"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                title="Vídeo"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AudiovisualShowcase;