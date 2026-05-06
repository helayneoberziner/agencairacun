import { Building2, Utensils, CalendarDays, Tag, Camera, Landmark, Vote } from 'lucide-react';
import { useProdutoraContent } from '@/hooks/useProdutoraContent';

const iconMap = [Landmark, Building2, Utensils, CalendarDays, Tag, Vote, Camera];

const MarketsSection = () => {
  const { content } = useProdutoraContent();
  const { segments } = content;

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

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {segments.items.map((seg, i) => {
            const Icon = iconMap[i % iconMap.length];
            return (
              <div
                key={i}
                className="glass-card p-6 text-center hover:border-primary/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:neon-glow transition-all duration-500">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-sm mb-1">{seg.title}</h4>
                <p className="text-xs text-muted-foreground">{seg.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MarketsSection;
