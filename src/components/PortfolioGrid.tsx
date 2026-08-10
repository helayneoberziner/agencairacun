import { useState, useMemo } from 'react';
import { Play, X, Camera } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSegmentsList } from '@/hooks/useSegmentPage';
import { normalizeSegment } from '@/lib/segments';

interface Project {
  id: string;
  title: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
  display_order: number;
}

interface PortfolioGridProps {
  /** Filter projects by category (system field). If omitted, shows all. */
  filterCategory?: string | string[];
  /** Only show featured projects */
  featuredOnly?: boolean;
  /** Max number of items to display */
  limit?: number;
  /** Show subcategory filter tabs */
  showFilters?: boolean;
  /** Use dynamic segment list from admin (segment_pages) as filters */
  segmentFilters?: boolean;
  /** Section title */
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  badge?: string;
}

function extractYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&]+)/);
  return match ? match[1] : null;
}

const PortfolioGrid = ({
  filterCategory,
  featuredOnly = false,
  limit,
  showFilters = true,
  segmentFilters = false,
  title = 'Nossos melhores',
  titleHighlight = 'trabalhos',
  subtitle = 'Projetos selecionados que demonstram nosso padrão de qualidade.',
  badge = 'PORTFÓLIO',
}: PortfolioGridProps) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [photoModal, setPhotoModal] = useState<{ src: string; title: string } | null>(null);
  const { data: dbSegments = [] } = useSegmentsList();

  const { data: projects = [] } = useQuery({
    queryKey: ['portfolio-projects', filterCategory, featuredOnly],
    queryFn: async () => {
      let query = supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (featuredOnly) {
        query = query.eq('is_featured', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      let results = (data ?? []) as unknown as Project[];

      if (filterCategory) {
        const cats = Array.isArray(filterCategory) ? filterCategory : [filterCategory];
        results = results.filter(p => cats.includes(p.category));
      }

      return limit ? results.slice(0, limit) : results;
    },
  });

  const subcategories = useMemo(() => {
    if (segmentFilters) {
      const present = new Set(projects.map(p => normalizeSegment(p.subcategory || '')).filter(Boolean));
      const active = dbSegments.filter(s => s.is_active && present.has(s.slug));
      return ['Todos', ...active.map(s => s.name)];
    }
    const subs = projects
      .map(p => p.subcategory)
      .filter((s): s is string => !!s);
    return ['Todos', ...Array.from(new Set(subs))];
  }, [projects, segmentFilters, dbSegments]);

  const filtered = useMemo(() => {
    if (activeFilter === 'Todos') return projects;
    if (segmentFilters) {
      const target = normalizeSegment(activeFilter);
      return projects.filter(p => normalizeSegment(p.subcategory || '') === target);
    }
    return projects.filter(p => p.subcategory === activeFilter);
  }, [projects, activeFilter, segmentFilters]);

  if (projects.length === 0) return null;

  return (
    <>
      <section className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-12">
            {badge && (
              <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
                {badge}
              </span>
            )}
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              {title} <span className="text-gradient-neon">{titleHighlight}</span>
            </h2>
            {subtitle && <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{subtitle}</p>}
          </div>

          {/* Filter tabs */}
          {showFilters && subcategories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveFilter(sub)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === sub
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-white/5 text-muted-foreground border border-white/10 hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid-cards-wide">
            {filtered.map(project => {
              const youtubeId = project.video_url ? extractYoutubeId(project.video_url) : null;
              const isVideo = !!youtubeId;
              const thumbnail = project.image_url || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null);

              return (
                <div
                  key={project.id}
                  onClick={() => {
                    if (isVideo && youtubeId) setVideoModal(youtubeId);
                    else if (thumbnail) setPhotoModal({ src: thumbnail, title: project.title });
                  }}
                  className="group cursor-pointer relative rounded-xl overflow-hidden aspect-video"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Title */}
                  <div className="absolute bottom-4 left-4 right-14">
                    <h3 className="font-display font-bold text-base md:text-lg text-white leading-tight uppercase">
                      {project.title}
                    </h3>
                    {project.subcategory && (
                      <span className="text-xs text-white/60 mt-1 block">{project.subcategory}</span>
                    )}
                  </div>

                  {/* Play button */}
                  {isVideo && (
                    <div className="absolute bottom-3 right-3">
                      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                        <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {videoModal && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setVideoModal(null)}
        >
          <div
            className="relative w-full max-w-5xl aspect-video bg-secondary rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoModal(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${videoModal}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
              title="Vídeo do projeto"
            />
          </div>
        </div>
      )}

      {/* Photo Modal */}
      {photoModal && (
        <div
          className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setPhotoModal(null)}
        >
          <div
            className="relative w-full max-w-5xl bg-secondary rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setPhotoModal(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={photoModal.src}
              alt={photoModal.title}
              className="w-full max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
              <h3 className="font-display font-semibold text-lg">{photoModal.title}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioGrid;
