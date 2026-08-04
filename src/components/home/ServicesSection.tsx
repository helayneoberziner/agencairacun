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
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            {s.badge}
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {s.title} <span className="text-gradient-neon">{s.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{s.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {s.items.map((service, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <Link
                key={index}
                to="/marketing"
                className="glass-card p-4 md:p-5 text-left hover:border-primary/40 transition-all duration-300 group flex flex-col"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:neon-glow transition-all duration-500">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-sm md:text-lg mb-2">{service.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4 flex-1">{service.description}</p>
                <span className="inline-flex items-center gap-1 text-xs md:text-sm text-primary font-medium group-hover:gap-2 transition-all">
                  Saiba mais <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
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
