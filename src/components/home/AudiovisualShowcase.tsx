import { Link } from 'react-router-dom';
import { ArrowRight, Film } from 'lucide-react';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { parseYouTubeId, resolveVideoCover, getYouTubeThumb } from '@/lib/videoUtils';

/**
 * Cinematic audiovisual showcase. Lead section after the hero/clients
 * strip — establishes the agency's strongest differentiator.
 */
const AudiovisualShowcase = () => {
  const { content } = useHomeContent();
  const a = content.audiovisual;

  // Featured cases marked to appear on "Home audiovisual".
  // Pulls both the case hero (if it's a video) and any videos from the
  // case's evolving media library so newly added footage shows up
  // automatically without an extra manual toggle.
  const { data: projects = [] } = useQuery({
    queryKey: ['home-audiovisual-cases'],
    queryFn: async () => {
      const { data: cases } = await supabase
        .from('cases' as any)
        .select('id,slug,client_name,title,subtitle,subcategory,category,hero_kind,hero_media_url,hero_youtube_id,hero_image_url,appears_in,show_on_home,display_order')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      const list = ((cases ?? []) as any[]).filter(c =>
        (c.appears_in || []).includes('home_audio') || c.show_on_home
      );
      if (list.length === 0) return [] as any[];

      const ids = list.map(c => c.id);
      const { data: mediaRows } = await supabase
        .from('case_media' as any)
        .select('*')
        .in('case_id', ids)
        .eq('section', 'audiovisual')
        .order('display_order', { ascending: true });
      const media = (mediaRows ?? []) as any[];

      const tiles: any[] = [];
      for (const c of list) {
        const heroVideo = c.hero_kind === 'video' && (c.hero_youtube_id || c.hero_media_url);
        if (heroVideo) {
          tiles.push({
            id: `hero-${c.id}`,
            title: c.title,
            subcategory: c.subcategory,
            category: c.category,
            image_url: c.hero_image_url || resolveVideoCover({ videoUrl: c.hero_media_url, youtubeId: c.hero_youtube_id }),
            video_url: c.hero_youtube_id ? `https://www.youtube.com/watch?v=${c.hero_youtube_id}` : c.hero_media_url,
          });
        }
        for (const m of media.filter(x => x.case_id === c.id && x.kind !== 'image')) {
          const yid = m.youtube_id as string | null;
          tiles.push({
            id: `m-${m.id}`,
            title: m.caption || c.title,
            subcategory: c.subcategory,
            category: c.category,
            image_url: yid ? getYouTubeThumb(yid, 'hq') : resolveVideoCover({ videoUrl: m.url, youtubeId: yid }),
            video_url: yid ? `https://www.youtube.com/watch?v=${yid}` : m.url,
          });
        }
      }
      return tiles;
    },
  });

  const featured = a.featuredYoutubeId?.trim();

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

        {projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {projects.map((p: any) => (
              <div key={p.id} className="group rounded-xl overflow-hidden border border-white/10 bg-secondary/30">
                <VideoPlayer url={p.video_url} poster={p.image_url} title={p.title} aspect="aspect-video" />
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