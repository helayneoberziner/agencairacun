import { Link } from 'react-router-dom';
import { Play, ArrowRight, Film } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const ProdutoraTeaser = () => {
  const { content } = useHomeContent();
  const p = content.produtoraTeaser;

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 gradient-mesh opacity-50" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Video Placeholder */}
          <div className="relative group">
            <div className="aspect-video rounded-2xl overflow-hidden bg-secondary/50 border border-white/10 relative">
              {p.image && <img src={p.image} alt="Produtora" className="absolute inset-0 w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent" />
              <button className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center neon-glow">
                  <Play className="w-8 h-8 text-primary-foreground ml-1" />
                </div>
              </button>
              <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white/80 text-sm">
                <Film className="w-4 h-4" />
                {p.showreelLabel}
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-6">
              <Film className="w-4 h-4" />
              {p.badge}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {p.title}{' '}
              <span className="text-gradient-neon">{p.titleHighlight}</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{p.description}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              {p.tags.map((item) => (
                <span key={item} className="px-4 py-2 rounded-full bg-white/5 text-muted-foreground text-sm border border-white/10">
                  {item}
                </span>
              ))}
            </div>

            <a 
              href={p.ctaLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-primary inline-flex items-center gap-2"
            >
              {p.cta}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProdutoraTeaser;
