import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import RevealSection from '../RevealSection';

const ProdutoraTeaser = () => {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            {/* Image placeholder — 40% */}
            <div className="lg:col-span-2">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-border" style={{ background: '#0d1540' }}>
                {/* Placeholder: substitua por imagem/vídeo real */}
              </div>
            </div>

            {/* Content — 60% */}
            <div className="lg:col-span-3">
              <span className="text-sm uppercase tracking-widest font-medium mb-4 block" style={{ color: '#FF00CC' }}>
                Racun Filmes
              </span>
              <h2 className="font-display mb-6">
                Histórias com estética de <em className="text-gradient-neon">cinema.</em>
              </h2>
              <p className="text-muted-foreground mb-8" style={{ fontSize: '18px' }}>
                Vídeos com propósito que conectam, emocionam e convertem. Do roteiro à entrega, sua marca merece produção de alto nível.
              </p>
              <Link to="/produtora" className="btn-primary">
                Ver Produtora
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default ProdutoraTeaser;
