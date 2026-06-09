import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parseYouTubeId } from '@/lib/videoUtils';

/**
 * Cinematic audiovisual showcase. Lead section after the hero/clients
 * strip — establishes the agency's strongest differentiator.
 */
const AudiovisualShowcase = () => {
  const { content } = useHomeContent();
  const a = content.audiovisual;

  // Featured video projects (star toggle in Admin → Projetos).
  const { data: projects = [] } = useQuery({
    queryKey: ['home-audiovisual-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id,title,subcategory,category,image_url,video_url,is_featured,display_order')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data ?? []).filter((p: any) => {
        const id = p.video_url ? parseYouTubeId(p.video_url) : null;
        return !!id;
      });
    },
  });

  const featured = a.featuredYoutubeId?.trim();

  const cleanEmbed = (id: string) =>
    `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1`;

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
            <div className="relative aspect-video bg-black">
              <iframe
                src={cleanEmbed(featured)}
                title="Vídeo em destaque"
                className="absolute inset-0 w-full h-full pointer-events-none"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {projects.map((p: any) => {
              const ytId = parseYouTubeId(p.video_url);
              return (
              <div key={p.id} className="group rounded-xl overflow-hidden border border-white/10 bg-secondary/30">
                <div className="relative aspect-video bg-black overflow-hidden">
                  {ytId && (
                    <iframe
                      src={cleanEmbed(ytId)}
                      title={p.title}
                      className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35]"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>
                <div className="p-4">
                  {(p.subcategory || p.category) && (
                    <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-primary mb-1 font-medium">
                      {p.subcategory || p.category}
                    </span>
                  )}
                  <h3 className="font-display text-lg md:text-xl text-foreground">
                    {p.title}
                  </h3>
                </div>
              </div>
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