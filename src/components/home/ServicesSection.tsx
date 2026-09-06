import { Link } from 'react-router-dom';
import { Megaphone, Video, Palette, BarChart3, ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { useHomeContent } from '@/hooks/useHomeContent';

const iconMap = [Megaphone, Video, BarChart3, Palette];

const ServicesSection = () => {
  const { content } = useHomeContent();
  const s = content.services;

  return (
    <section className="section-padding relative overflow-hidden border-t border-border">
      <div className="container-custom relative z-10">
        <SectionHeading
          eyebrow={s.badge}
          title={s.title}
          highlight={s.titleHighlight}
          subtitle={s.subtitle}
          action={
            <Link to="/marketing" className="hidden md:inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors group">
              {s.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="grid-cards-2">
          {s.items.map((service, index) => {
            const Icon = iconMap[index % iconMap.length];
            return (
              <div key={index} className="rounded-xl border border-border bg-secondary/10 p-3 md:p-8 group transition-colors hover:border-primary/40">
                <div className="flex flex-col md:flex-row items-start gap-2.5 md:gap-6">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 md:w-6 md:h-6 text-primary" strokeWidth={1.5} />
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
