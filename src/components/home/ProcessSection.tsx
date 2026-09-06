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
                {index < p.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="glass-card-hover p-4 md:p-8 text-center h-full">
                  <span className="text-2xl md:text-5xl font-display font-bold text-primary/20 absolute top-2 right-3 md:top-4 md:right-4">{step.number}</span>
                  <div className="w-10 h-10 md:w-16 md:h-16 mx-auto mb-3 md:mb-6 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center group-hover:neon-glow transition-all duration-500">
                    <Icon className="w-5 h-5 md:w-8 md:h-8 text-primary" />
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
