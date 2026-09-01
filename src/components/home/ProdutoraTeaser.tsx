import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ProdutoraTeaser = () => {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Imagem/vídeo placeholder — 40% */}
          <div className="lg:col-span-2 relative group">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50 border border-white/10 relative">
              {/* Placeholder: substitua por <img> ou <video> da produtora */}
              <div className="absolute inset-0 bg-secondary" />
            </div>
          </div>

          {/* Conteúdo — 60% */}
          <div className="lg:col-span-3">
            <span className="text-sm uppercase tracking-widest text-primary font-medium mb-4 block">
              Racun Filmes
            </span>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Histórias com estética de <span className="text-gradient-neon">cinema.</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Vídeos com propósito que conectam, emocionam e convertem. Do roteiro à entrega, sua marca merece produção de alto nível.
            </p>

            <Link to="/produtora" className="btn-primary inline-flex items-center gap-2">
              Ver Produtora
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProdutoraTeaser;
