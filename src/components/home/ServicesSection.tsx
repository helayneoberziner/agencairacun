import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useReveal } from '@/hooks/useReveal';

const ServicesSection = () => {
  const { content } = useHomeContent();
  const s = content.services;

  return (
    <section className="section-padding relative">
      <div className="container-custom">
        {/* Header editorial */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 md:mb-32">
          <div className="lg:col-span-3">
            <p className="text-eyebrow">{s.badge}</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-display text-4xl md:text-6xl lg:text-7xl mb-8 max-w-4xl">
              {s.title} <span className="italic text-primary">{s.titleHighlight}</span>
            </h2>
            <p className="text-foreground/70 text-lg md:text-xl font-light max-w-2xl">{s.subtitle}</p>
          </div>
        </div>

        {/* Lista editorial */}
        <div>
          {s.items.map((service, index) => (
            <ServiceRow key={index} index={index} total={s.items.length} service={service} />
          ))}
        </div>

        <div className="mt-20 md:mt-28 text-center">
          <Link to="/marketing" className="btn-outline inline-flex items-center gap-2">
            {s.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const ServiceRow = ({
  service,
  index,
  total,
}: {
  service: { title: string; description: string; features: string[] };
  index: number;
  total: number;
}) => {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`group grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 py-10 md:py-14 border-t border-white/5 ${index === total - 1 ? 'border-b' : ''}`}
    >
      <div className="lg:col-span-1">
        <span className="text-eyebrow">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="lg:col-span-5">
        <h3 className="text-display text-3xl md:text-4xl lg:text-5xl group-hover:text-primary transition-colors duration-500">
          {service.title}
        </h3>
      </div>
      <div className="lg:col-span-6">
        <p className="text-foreground/70 text-lg md:text-xl font-light leading-relaxed mb-6">
          {service.description}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {service.features.map((feature) => (
            <span key={feature} className="text-sm text-foreground/50">
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;
