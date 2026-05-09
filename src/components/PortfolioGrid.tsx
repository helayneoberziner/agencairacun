import { useState, useMemo } from 'react';
import { Play, X, Camera } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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
  title = 'Nossos melhores',
  titleHighlight = 'trabalhos',
  subtitle = 'Projetos selecionados que demonstram nosso padrão de qualidade.',
  badge = 'PORTFÓLIO',
}: PortfolioGridProps) => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [photoModal, setPhotoModal] = useState<{ src: string; title: string } | null>(null);

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
    const subs = projects
      .map(p => p.subcategory)
      .filter((s): s is string => !!s);
    return ['Todos', ...Array.from(new Set(subs))];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === 'Todos') return projects;
    return projects.filter(p => p.subcategory === activeFilter);
  }, [projects, activeFilter]);

  if (projects.length === 0) return null;

  return (
    <>
      <section className="section-padding">
        <div className="container-custom">
          {/* Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16 md:mb-24">
            <div className="lg:col-span-3">
              {badge && <p className="text-eyebrow">{badge}</p>}
            </div>
            <div className="lg:col-span-9">
              <h2 className="text-display text-4xl md:text-6xl lg:text-7xl max-w-3xl">
                {title} <span className="italic text-primary">{titleHighlight}</span>
              </h2>
              {subtitle && <p className="text-foreground/70 text-lg mt-6 max-w-2xl font-light">{subtitle}</p>}
            </div>
          </div>

          {/* Filter tabs */}
          {showFilters && subcategories.length > 2 && (
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-16">
              {subcategories.map(sub => (
                <button
                  key={sub}
                  onClick={() => setActiveFilter(sub)}
                  className={`text-xs uppercase tracking-[0.25em] transition-all duration-300 pb-1 border-b ${
                    activeFilter === sub
                      ? 'text-primary border-primary'
                      : 'text-foreground/60 border-transparent hover:text-foreground hover:border-white/30'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="group cursor-pointer relative overflow-hidden aspect-[4/5]"
                >
                  {thumbnail ? (
                    <img
                      src={thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-1000 ease-out"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Camera className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />

                  {/* Title */}
                  <div className="absolute bottom-6 left-6 right-16">
                    {project.subcategory && (
                      <span className="text-[10px] uppercase tracking-[0.25em] text-white/60 mb-2 block">{project.subcategory}</span>
                    )}
                    <h3 className="font-display text-2xl md:text-3xl text-white leading-tight">
                      {project.title}
                    </h3>
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
