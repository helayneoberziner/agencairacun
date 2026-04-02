import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

const ServicesSection = () => {
  const { content } = useHomeContent();
  const s = content.services;

  return (
    <section className="section-padding">
      <div className="container-custom">
        <RevealSection>
          <div className="max-w-3xl mb-16">
            <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>
              {s.badge}
            </span>
            <h2 className="font-display mb-6">
              {s.title} <em className="text-gradient-neon">{s.titleHighlight}</em>
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{s.subtitle}</p>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="divide-y divide-border">
            {s.items.map((service, index) => (
              <div
                key={index}
                className="group py-8 flex items-start gap-8 transition-colors duration-200 hover:bg-secondary/40 px-4 -mx-4 rounded-sm"
              >
                <span className="font-display text-4xl flex-shrink-0" style={{ color: '#FF00CC' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display mb-2">{service.title}</h3>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{service.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature) => (
                      <span key={feature} className="text-xs text-muted-foreground border border-border px-3 py-1 rounded-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-2 transition-transform duration-200 group-hover:translate-x-1.5 group-hover:text-primary" />
              </div>
            ))}
          </div>
        </RevealSection>

        <RevealSection className="text-center mt-12">
          <Link to="/marketing" className="btn-outline">
            {s.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </RevealSection>
      </div>
    </section>
  );
};

export default ServicesSection;
