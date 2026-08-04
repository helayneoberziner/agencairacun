import { Building2, Utensils, CalendarDays, Tag, Camera, Landmark, Vote, ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProdutoraContent } from '@/hooks/useProdutoraContent';
import { useSegmentsList } from '@/hooks/useSegmentPage';

const iconMap = [Landmark, Building2, Utensils, CalendarDays, Tag, Vote, Camera, Briefcase, Sparkles];

const staticSlugs = ['imobiliario', 'empresas', 'restaurantes', 'eventos', 'marcas', 'politica'];

const MarketsSection = () => {
  const { content } = useProdutoraContent();
  const { segments } = content;
  const { data: dbSegments = [] } = useSegmentsList();

  const shortDescriptions: Record<string, string> = {
    Institucional: 'Vídeos que fortalecem a autoridade da sua empresa.',
  };

  // Build dynamic list from active segment_pages; fallback description from produtora content items by title
  const items = dbSegments
    .filter(s => s.is_active)
    .map(s => {
      const match = segments.items.find(it => it.title.toLowerCase() === s.name.toLowerCase());
      const description = shortDescriptions[s.name] || match?.description || s.content?.intro?.description || s.content?.hero?.subtitle || '';
      const path = staticSlugs.includes(s.slug) ? `/${s.slug}` : `/s/${s.slug}`;
      return { title: s.name, description, path };
    });

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            Mercados
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            {segments.sectionTitle} <span className="text-gradient-neon">{segments.sectionTitleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experiência em diferentes segmentos com entendimento das necessidades de cada mercado.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {items.map((seg, i) => {
            const Icon = iconMap[i % iconMap.length];
            const path = seg.path;
            return (
              <Link
                key={i}
                to={path}
                className="glass-card p-4 md:p-6 text-left hover:border-primary/40 transition-all duration-300 group flex flex-col"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:neon-glow transition-all duration-500">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-sm md:text-lg mb-1 md:mb-2">{seg.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-5 flex-1 line-clamp-2 md:line-clamp-none">{seg.description}</p>
                <span className="inline-flex items-center gap-1 text-xs md:text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketsSection;
