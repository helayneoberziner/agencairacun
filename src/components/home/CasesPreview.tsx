import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

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
    <section className="section-padding">
      <div className="container-custom">
        <RevealSection>
          <div className="max-w-3xl mb-16">
            <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>{c.badge}</span>
            <h2 className="font-display mb-6">
              {c.title} <em className="text-gradient-neon">{c.titleHighlight}</em>
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{c.subtitle}</p>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cases.map((caseItem) => (
              <Link
                key={caseItem.id}
                to={`/cases/${caseItem.id}`}
                className="group block overflow-hidden border border-border rounded-sm"
              >
                <div className="aspect-video relative overflow-hidden" style={{ background: '#0d1540' }}>
                  {/* Placeholder: substitua por imagem real com grayscale */}
                  <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-400" style={{ background: 'linear-gradient(135deg, #1a2560 0%, #0d1540 100%)' }} />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="btn-primary flex items-center gap-2 text-sm">Ver case <ExternalLink className="w-4 h-4" /></span>
                  </div>
                </div>
                <div className="p-6">
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#FF00CC' }}>{caseItem.category}</span>
                  <h3 className="font-display mt-2 mb-2 group-hover:text-primary transition-colors">{caseItem.title}</h3>
                  <p className="text-muted-foreground text-sm">{caseItem.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="text-center mt-12">
          <Link to="/cases" className="btn-outline">
            {c.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </RevealSection>
      </div>
    </section>
  );
};

export default CasesPreview;
