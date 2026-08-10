import { Link } from 'react-router-dom';
import { UtensilsCrossed, Camera, Megaphone, Calendar, ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const featureIcons = [Camera, Megaphone, Calendar];

const RestaurantesTeaser = () => {
  const { content } = useHomeContent();
  const r = content.restaurantesTeaser;

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/20">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <div className="grid-split items-center">
          {/* Content */}
          <div className="order-2 lg:order-1">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <UtensilsCrossed className="w-4 h-4" />
              {r.badge}
            </span>
            
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              {r.title}{' '}
              <span className="text-gradient-neon">{r.titleHighlight}</span>
            </h2>
            
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">{r.description}</p>

            <div className="space-y-4 mb-8">
              {r.features.map((feature, index) => {
                const Icon = featureIcons[index % featureIcons.length];
                return (
                  <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link to="/restaurantes" className="btn-primary inline-flex items-center gap-2">
              {r.cta}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Image Placeholder */}
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50 border border-white/10 relative">
                {r.image && <img src={r.image} alt="Restaurantes" className="absolute inset-0 w-full h-full object-cover" />}
                {!r.image && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/10" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <UtensilsCrossed className="w-24 h-24 text-white/10" />
                    </div>
                  </>
                )}
                <div className="absolute bottom-4 left-4 px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-white/10 text-sm">
                  {r.badgeText}
                </div>
              </div>

              <div className="absolute -top-4 -right-4 glass-card p-4 animate-float">
                <div className="text-2xl font-display font-bold text-primary">{r.floatingStat}</div>
                <div className="text-xs text-muted-foreground">{r.floatingLabel}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantesTeaser;
