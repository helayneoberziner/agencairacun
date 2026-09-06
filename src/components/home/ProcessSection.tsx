import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { useHomeContent } from '@/hooks/useHomeContent';

const stepIcons = [Search, Lightbulb, Rocket, TrendingUp];

const ProcessSection = () => {
  const { content } = useHomeContent();
  const p = content.process;

  return (
    <section className="section-padding relative overflow-hidden border-t border-border bg-secondary/10">
      <div className="container-custom relative z-10">
        <SectionHeading
          eyebrow={p.badge}
          title={p.title}
          highlight={p.titleHighlight}
          subtitle={p.subtitle}
        />

        <div className="grid-cards-4">
          {p.steps.map((step, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            return (
              <div key={index} className="relative group">
                <div className="border-t border-border pt-4 md:pt-6 h-full">
                  <div className="flex items-center justify-between mb-3 md:mb-5">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-primary" strokeWidth={1.5} />
                    <span className="text-[11px] md:text-xs font-medium tracking-[0.2em] text-muted-foreground">{step.number}</span>
                  </div>
                  <h3 className="font-display font-semibold text-sm md:text-xl mb-1.5 md:mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-xs md:text-sm">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
