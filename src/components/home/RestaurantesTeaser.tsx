import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

const RestaurantesTeaser = () => {
  const { content } = useHomeContent();
  const r = content.restaurantesTeaser;

  return (
    <section className="section-padding" style={{ background: '#080f2e' }}>
      <div className="container-custom">
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="order-2 lg:order-1">
              <span className="text-sm uppercase tracking-widest font-medium mb-4 block" style={{ color: '#FF00CC' }}>
                {r.badge}
              </span>
              <h2 className="font-display mb-6">
                {r.title}{' '}
                <em className="text-gradient-neon">{r.titleHighlight}</em>
              </h2>
              <p className="text-muted-foreground mb-8" style={{ fontSize: '18px' }}>{r.description}</p>

              <div className="space-y-4 mb-8">
                {r.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-4 py-3 border-b border-border last:border-b-0">
                    <span className="font-display text-2xl flex-shrink-0" style={{ color: '#FF00CC' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/restaurantes" className="btn-primary">
                {r.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Image */}
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] rounded-sm overflow-hidden border border-border relative" style={{ background: '#0d1540' }}>
                {r.image && <img src={r.image} alt="Restaurantes" className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-400" />}
              </div>
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default RestaurantesTeaser;
