import { Building2, Utensils, CalendarDays, Tag, Camera, Landmark, Vote, ArrowRight, Briefcase, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeading from '@/components/SectionHeading';
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
    <section className="section-padding border-t border-border">
      <div className="container-custom">
        <SectionHeading
          eyebrow="Mercados"
          title={segments.sectionTitle}
          highlight={segments.sectionTitleHighlight}
          subtitle="Experiência em diferentes segmentos com entendimento das necessidades de cada mercado."
        />

        <div className="grid-cards-3">
          {items.map((seg, i) => {
            const Icon = iconMap[i % iconMap.length];
            const path = seg.path;
            return (
              <Link
                key={i}
                to={path}
                className="border border-border rounded-xl p-4 md:p-6 text-left hover:border-primary/40 transition-colors duration-300 group flex flex-col"
              >
                <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary mb-3 md:mb-4" strokeWidth={1.5} />
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
