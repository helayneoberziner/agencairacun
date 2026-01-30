import { Search, Lightbulb, Rocket, TrendingUp } from 'lucide-react';

const ProcessSection = () => {
  const steps = [
    {
      icon: Search,
      number: '01',
      title: 'Diagnóstico',
      description: 'Entendemos seu negócio, público, concorrência e objetivos para criar uma estratégia personalizada.',
    },
    {
      icon: Lightbulb,
      number: '02',
      title: 'Estratégia',
      description: 'Desenvolvemos o plano de ação com canais, conteúdos e campanhas alinhados às suas metas.',
    },
    {
      icon: Rocket,
      number: '03',
      title: 'Execução',
      description: 'Colocamos a mão na massa com criação, produção e gestão de campanhas de alta qualidade.',
    },
    {
      icon: TrendingUp,
      number: '04',
      title: 'Otimização e escala',
      description: 'Analisamos os dados, otimizamos o que funciona e escalamos os resultados.',
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/20">
      <div className="absolute inset-0 grid-overlay opacity-20" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            Nosso processo
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Simples, direto e <span className="text-gradient-neon">eficiente</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Um processo claro para transformar sua marca em uma máquina de resultados.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+40px)] w-[calc(100%-80px)] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
              )}

              <div className="glass-card-hover p-8 text-center h-full">
                {/* Number */}
                <span className="text-5xl font-display font-bold text-primary/20 absolute top-4 right-4">
                  {step.number}
                </span>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:neon-glow transition-all duration-500">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="font-display font-semibold text-xl mb-3">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
