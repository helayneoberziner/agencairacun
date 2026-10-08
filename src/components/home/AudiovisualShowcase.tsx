import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import VideoPlayer from '@/components/media/VideoPlayer';
import SectionHeading from '@/components/SectionHeading';
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
      const [{ data }, { data: cases }] = await Promise.all([
        supabase
          .from('projects')
          .select('id,title,category,subcategory,image_url,video_url,is_featured,display_order')
          .eq('is_featured', true)
          .order('display_order', { ascending: true }),
        supabase
          .from('cases' as any)
          .select('id,client_name,title,hero_media_url,hero_youtube_id,hero_image_url,appears_in,category,subcategory,display_order')
          .eq('is_active', true)
          .contains('appears_in', ['home_audio'])
          .order('display_order', { ascending: true }),
      ]);
      const list = ((data ?? []) as any[]).filter(p => !!p.video_url);
      const caseList = (cases ?? []) as any[];
      // Cases marked "Home audiovisual" bring their hero video, or first video in the gallery.
      const missing = caseList.filter(c => !c.hero_youtube_id && !c.hero_media_url).map(c => c.id);
      let firstVideo: Record<string, any> = {};
      if (missing.length) {
        const { data: media } = await supabase
          .from('case_media' as any)
          .select('case_id,kind,url,youtube_id,display_order')
          .in('case_id', missing)
          .neq('kind', 'image')
          .order('display_order', { ascending: true });
        for (const m of (media ?? []) as any[]) if (!firstVideo[m.case_id]) firstVideo[m.case_id] = m;
      }
      const seen = new Set(list.map(p => (p.title || '').trim().toLowerCase()));
      for (const c of caseList) {
        const m = firstVideo[c.id];
        const video = c.hero_youtube_id
          ? `https://www.youtube.com/watch?v=${c.hero_youtube_id}`
          : c.hero_media_url || (m ? (m.youtube_id ? `https://www.youtube.com/watch?v=${m.youtube_id}` : m.url) : null);
        const key = (c.client_name || c.title || '').trim().toLowerCase();
        if (!video || seen.has(key) || seen.has((c.title || '').trim().toLowerCase())) continue;
        seen.add(key);
        list.push({ id: `case-${c.id}`, title: c.client_name || c.title, category: c.category, subcategory: c.subcategory, image_url: c.hero_image_url, video_url: video, display_order: c.display_order });
      }
      return list.sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0) || a.id.localeCompare(b.id));
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
          <div className="mb-8 md:mb-10 rounded-xl overflow-hidden border border-border">
            <VideoPlayer url={`https://www.youtube.com/watch?v=${featured}`} aspect="aspect-video" />
          </div>
        )}

        {projects.length > 0 && (
          <div className="grid-cards-wide">
            {projects.map((p: any) => (
              <div key={p.id} className="group rounded-xl overflow-hidden border border-border bg-secondary/20 transition-colors hover:border-primary/40">
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

        <div className="mt-10 md:hidden">
          <Link to={a.ctaLink || '/produtora'} className="btn-primary inline-flex items-center gap-2 text-sm">
            {a.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AudiovisualShowcase;