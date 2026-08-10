import { Link } from 'react-router-dom';
import { Megaphone, Video, Palette, BarChart3, ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const iconMap = [Megaphone, Video, BarChart3, Palette];

const ServicesSection = () => {
  const { content } = useHomeContent();
  const s = content.services;

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            {s.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {s.title} <span className="text-gradient-neon">{s.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{s.subtitle}</p>
        </div>

        <div className="grid-cards-2">
          {s.items.map((service, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <div key={index} className="glass-card-hover p-3 md:p-8 group">
                <div className="flex flex-col md:flex-row items-start gap-2.5 md:gap-6">
                  <div className="w-9 h-9 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:neon-glow transition-all duration-500">
                    <Icon className="w-4 h-4 md:w-7 md:h-7 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold text-sm md:text-xl mb-1 md:mb-3">{service.title}</h3>
                    <p className="text-xs md:text-base text-muted-foreground mb-2 md:mb-4 line-clamp-3 md:line-clamp-none">{service.description}</p>
                    <div className="hidden md:flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature) => (
                        <span key={feature} className="px-3 py-1 text-xs rounded-full bg-white/5 text-muted-foreground border border-white/10">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/marketing" className="btn-outline inline-flex items-center gap-2">
            {s.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
