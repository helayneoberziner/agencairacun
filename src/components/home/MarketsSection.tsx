import { Building2, Utensils, CalendarDays, Tag, Camera, Landmark, Vote, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProdutoraContent } from '@/hooks/useProdutoraContent';

const iconMap = [Landmark, Building2, Utensils, CalendarDays, Tag, Vote, Camera];

const slugMap: Record<string, string> = {
  'Imobiliário': '/imobiliario',
  'Empresas': '/empresas',
  'Restaurantes': '/restaurantes',
  'Eventos': '/eventos',
  'Marcas': '/marcas',
  'Política e Eleição': '/politica',
  'Política': '/politica',
};

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {segments.items.map((seg, i) => {
            const Icon = iconMap[i % iconMap.length];
            const path = slugMap[seg.title] || '/';
            return (
              <Link
                key={i}
                to={path}
                className="glass-card p-6 text-left hover:border-primary/40 transition-all duration-300 group flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:neon-glow transition-all duration-500">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-display font-semibold text-lg mb-2">{seg.title}</h4>
                <p className="text-sm text-muted-foreground mb-5 flex-1">{seg.description}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2.5 transition-all">
                  Saiba mais <ArrowRight className="w-4 h-4" />
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
