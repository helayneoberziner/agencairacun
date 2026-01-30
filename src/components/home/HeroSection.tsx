import { Link } from 'react-router-dom';
import { ArrowRight, Target, Sparkles, TrendingUp } from 'lucide-react';
import ParticlesBackground from '../ParticlesBackground';

const HeroSection = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Estratégia e posicionamento',
      description: 'Posicionamos sua marca para dominar o mercado',
    },
    {
      icon: Sparkles,
      title: 'Conteúdo que conecta',
      description: 'Criamos narrativas que engajam e convertem',
    },
    {
      icon: TrendingUp,
      title: 'Tráfego pago que escala',
      description: 'Campanhas otimizadas para máximo retorno',
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 gradient-mesh" />
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <ParticlesBackground />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-[128px] animate-float delay-300" />

      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Marketing • Produtora • Restaurantes
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-fade-in delay-100">
            Crescimento real com{' '}
            <span className="text-gradient-neon">estratégia, conteúdo</span>
            {' '}e <span className="text-gradient-neon">performance</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in delay-200">
            Somos uma agência de marketing digital, produtora audiovisual e especialistas 
            em restaurantes. Transformamos atenção em vendas.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in delay-300">
            <Link to="/contato" className="btn-primary flex items-center gap-2 text-lg px-8 py-4">
              Solicitar proposta
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/cases" className="btn-outline flex items-center gap-2 text-lg px-8 py-4">
              Ver cases
            </Link>
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 animate-fade-in delay-400">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="glass-card-hover p-8 text-center group"
              style={{ animationDelay: `${(index + 4) * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:neon-glow transition-all duration-500">
                <pillar.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
