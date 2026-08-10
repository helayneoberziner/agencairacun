import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Play, X } from 'lucide-react';
import { parseYouTubeId, getYouTubeThumb, resolveVideoCover } from '@/lib/videoUtils';
import { normalizeSegment } from '@/lib/segments';

interface Props {
  slug: string;
  segmentLabel: string;
  title?: string;
  highlight?: string;
}

type Tile = {
  key: string;
  thumb: string | null;
  isVideo: boolean;
  youtubeId: string | null;
  fileVideo: string | null;
  fullImage: string | null;
  caption: string;
  sub: string;
};

const SegmentPortfolioGallery = ({ slug, segmentLabel, title = 'Portfólio do segmento', highlight = 'ao vivo' }: Props) => {
  const [lightbox, setLightbox] = useState<Tile | null>(null);

  const { data: tiles = [], isLoading } = useQuery({
    queryKey: ['segment-gallery', slug],
    queryFn: async (): Promise<Tile[]> => {
      const segNorm = normalizeSegment(slug);

      const { data: cases } = await supabase
        .from('cases' as any)
        .select('id,slug,client_name,title,subtitle,hero_kind,hero_media_url,hero_youtube_id,hero_image_url,segments,appears_in,categories')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      const list = (cases ?? []) as any[];

      const matched = list.filter(c => {
        const segs = (c.segments || []).map((s: string) => normalizeSegment(s));
        const appears = (c.appears_in || []) as string[];
        return segs.includes(segNorm) || appears.includes(`seg:${segNorm}`);
      });

      let mediaTiles: Tile[] = [];
      if (matched.length > 0) {
        const ids = matched.map(m => m.id);
        const { data: mediaRows } = await supabase
          .from('case_media' as any)
          .select('*')
          .in('case_id', ids)
          .order('display_order', { ascending: true });
        const media = (mediaRows ?? []) as any[];

        mediaTiles = media.map((m): Tile | null => {
          const isVideo = m.kind !== 'image';
          const yid = m.youtube_id as string | null;
          const thumb = yid ? getYouTubeThumb(yid, 'hq') : (isVideo ? null : m.url);
          if (!thumb && !m.url) return null;
          const c = matched.find(x => x.id === m.case_id);
          return {
            key: `m-${m.id}`,
            thumb: thumb || m.url,
            isVideo,
            youtubeId: yid,
            fileVideo: isVideo && !yid ? m.url : null,
            fullImage: !isVideo ? m.url : null,
            caption: m.caption || c?.title || c?.client_name || '',
            sub: c?.client_name || '',
          };
        }).filter(Boolean) as Tile[];

        // Add hero of each case as the first tile per case if no media exists for it
        for (const c of matched) {
          const hasMedia = mediaTiles.some(t => t.key.startsWith('m-') && t.sub === c.client_name);
          if (hasMedia) continue;
          const yid = c.hero_youtube_id;
          const thumb = c.hero_image_url || resolveVideoCover({ videoUrl: c.hero_media_url, youtubeId: yid });
          if (!thumb && !c.hero_media_url) continue;
          mediaTiles.unshift({
            key: `h-${c.id}`,
            thumb,
            isVideo: c.hero_kind === 'video',
            youtubeId: yid,
            fileVideo: c.hero_kind === 'video' && !yid ? c.hero_media_url : null,
            fullImage: c.hero_kind === 'image' ? c.hero_image_url : null,
            caption: c.title,
            sub: c.client_name,
          });
        }
      }

      // Fallback to legacy projects if no case media yet
      if (mediaTiles.length === 0) {
        const { data: projects } = await supabase
          .from('projects')
          .select('id,title,subcategory,image_url,video_url')
          .order('display_order', { ascending: true });
        const all = (projects ?? []) as any[];
        const filtered = all.filter(p => {
          const sub = normalizeSegment(p.subcategory || '');
          return sub === segNorm;
        });
        mediaTiles = filtered.map((p): Tile => {
          const yid = p.video_url ? parseYouTubeId(p.video_url) : null;
          const thumb = p.image_url || (yid ? getYouTubeThumb(yid, 'hq') : null);
          return {
            key: `p-${p.id}`,
            thumb,
            isVideo: !!p.video_url,
            youtubeId: yid,
            fileVideo: p.video_url && !yid ? p.video_url : null,
            fullImage: p.image_url || null,
            caption: p.title,
            sub: p.subcategory || '',
          };
        });
      }

      return mediaTiles;
    },
  });

  const grid = useMemo(() => tiles.slice(0, 24), [tiles]);

  if (isLoading || grid.length === 0) return null;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-4 block">Portfólio</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold">
            {title} <span className="text-gradient-neon italic">{highlight}</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Trabalhos reais realizados para clientes do segmento de {segmentLabel}.
          </p>
        </div>

        <div className="grid-cards-4">
          {grid.map((t, i) => {
            const tall = i % 7 === 0 || i % 11 === 0;
            return (
              <button
                key={t.key}
                onClick={() => setLightbox(t)}
                className={`group relative overflow-hidden rounded-xl bg-secondary border border-white/5 ${tall ? 'row-span-2 aspect-[3/4]' : 'aspect-square'}`}
              >
                {t.thumb ? (
                  <img
                    src={t.thumb}
                    alt={t.caption}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                {t.isVideo && (
                  <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur">
                    <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <p className="font-display text-sm md:text-base text-white leading-tight line-clamp-2">{t.caption}</p>
                  {t.sub && <p className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider mt-1">{t.sub}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)} className="absolute top-2 right-2 z-10 w-10 h-10 rounded-full bg-background/70 flex items-center justify-center text-foreground hover:bg-background">
              <X className="w-5 h-5" />
            </button>
            {lightbox.youtubeId ? (
              <div className="aspect-video rounded-2xl overflow-hidden bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${lightbox.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  title={lightbox.caption}
                />
              </div>
            ) : lightbox.fileVideo ? (
              <video src={lightbox.fileVideo} controls autoPlay className="w-full max-h-[85vh] rounded-2xl bg-black" />
            ) : lightbox.fullImage || lightbox.thumb ? (
              <img src={lightbox.fullImage || lightbox.thumb!} alt={lightbox.caption} className="w-full max-h-[85vh] object-contain rounded-2xl" />
            ) : null}
            {lightbox.caption && (
              <div className="mt-3 text-center">
                <p className="font-display text-lg">{lightbox.caption}</p>
                {lightbox.sub && <p className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{lightbox.sub}</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default SegmentPortfolioGallery;