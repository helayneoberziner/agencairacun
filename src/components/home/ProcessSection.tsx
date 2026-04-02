import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const stepIcons = [Search, Lightbulb, Rocket, TrendingUp];

const ProcessSection = () => {
  const { content } = useHomeContent();
  const p = content.process;

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/20">
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      <div className="container-custom relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">{p.badge}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {p.title} <span className="text-gradient-neon">{p.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{p.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {p.steps.map((step, index) => {
            const Icon = stepIcons[index % stepIcons.length];
            return (
              <div key={index} className="relative group">
                {index < p.steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="glass-card-hover p-8 text-center h-full">
                  <span className="text-5xl font-display font-bold text-primary/20 absolute top-4 right-4">{step.number}</span>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:neon-glow transition-all duration-500">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
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
