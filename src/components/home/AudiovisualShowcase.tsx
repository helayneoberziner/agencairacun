import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { resolveVideoCover } from '@/lib/videoUtils';

/**
 * Cinematic audiovisual showcase. Lead section after the hero/clients
 * strip — establishes the agency's strongest differentiator.
 */
const AudiovisualShowcase = () => {
  const { content } = useHomeContent();
  const a = content.audiovisual;

  // Featured video portfolio pulled from the `projects` table.
  // Marked in Admin → Projetos with the ⭐ star (is_featured).
  // Independent from the Cases section on the home.
  const { data: projects = [] } = useQuery({
    queryKey: ['home-audiovisual-projects'],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('id,title,category,subcategory,image_url,video_url,is_featured,display_order')
        .eq('is_featured', true)
        .order('display_order', { ascending: true });
      return ((data ?? []) as any[]).filter(p => !!p.video_url);
    },
  });

  const featured = a.featuredYoutubeId?.trim();

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom relative z-10">
        <SectionHeading
          eyebrow={a.badge}
          title={a.title}
          highlight={a.titleHighlight}
          subtitle={a.subtitle}
          action={
            <Link to={a.ctaLink || '/produtora'} className="hidden md:inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors group">
              {a.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        {featured && (
          <div className="mb-8 md:mb-10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_80px_-30px_hsl(var(--primary)/0.4)]">
            <VideoPlayer url={`https://www.youtube.com/watch?v=${featured}`} aspect="aspect-video" />
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid-cards-wide">
            {projects.map((p: any) => (
              <div key={p.id} className="group rounded-xl overflow-hidden border border-white/10 bg-secondary/30">
                <VideoPlayer
                  url={p.video_url}
                  poster={p.image_url || resolveVideoCover({ videoUrl: p.video_url })}
                  title={p.title}
                  aspect="aspect-video"
                />
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
            ))}
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