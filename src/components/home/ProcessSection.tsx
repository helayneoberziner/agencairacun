import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

const ProcessSection = () => {
  const { content } = useHomeContent();
  const p = content.process;

  return (
    <section className="section-padding" style={{ background: '#080f2e' }}>
      <div className="container-custom">
        <RevealSection>
          <div className="max-w-3xl mb-16">
            <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>{p.badge}</span>
            <h2 className="font-display mb-6">
              {p.title} <em className="text-gradient-neon">{p.titleHighlight}</em>
            </h2>
            <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{p.subtitle}</p>
          </div>
        </RevealSection>

        <RevealSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-border">
            {p.steps.map((step, index) => (
              <div key={index} className="p-8 border-b lg:border-b-0 lg:border-r border-border last:border-r-0 last:border-b-0">
                <span className="font-display text-5xl block mb-4" style={{ color: '#FF00CC', opacity: 0.3 }}>{step.number}</span>
                <h3 className="font-display mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default ProcessSection;
