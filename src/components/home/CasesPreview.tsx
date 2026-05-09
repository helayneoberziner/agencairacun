import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const CasesPreview = () => {
  const { content } = useHomeContent();
  const c = content.casesPreview;

  const cases = [
    { id: 1, title: 'Lançamento de produto', category: 'Conteúdo + Tráfego', description: 'Campanha completa para lançamento no mercado de moda.' },
    { id: 2, title: 'Filme institucional', category: 'Filme', description: 'Produção audiovisual para empresa do setor industrial.' },
    { id: 3, title: 'Campanha de delivery', category: 'Restaurantes', description: 'Estratégia de tráfego pago para rede de restaurantes.' },
    { id: 4, title: 'Rebranding digital', category: 'Conteúdo', description: 'Nova identidade visual e linha editorial para marca de beleza.' },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">{c.badge}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {c.title} <span className="text-gradient-neon">{c.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} to={`/cases/${caseItem.id}`} className="group glass-card overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                  <span className="btn-primary flex items-center gap-2">Ver case <ExternalLink className="w-4 h-4" /></span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs text-primary font-medium uppercase tracking-wider">{caseItem.category}</span>
                <h3 className="font-display font-semibold text-xl mt-2 mb-2 group-hover:text-primary transition-colors">{caseItem.title}</h3>
                <p className="text-muted-foreground text-sm">{caseItem.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/cases" className="btn-outline inline-flex items-center gap-2">
            {c.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CasesPreview;
