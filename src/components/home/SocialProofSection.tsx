import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Quote } from 'lucide-react';

const SocialProofSection = () => {
  const proofs = [
    'Resultados acompanhados semanalmente',
    'Criativos feitos para performance',
    'Rotina de otimização e testes',
    'Relatórios transparentes e claros',
  ];

  const testimonials = [
    {
      quote: 'A Racun transformou nossa presença digital. Em poucos meses, triplicamos o engajamento e as vendas cresceram junto.',
      name: 'Cliente do segmento de moda',
      role: 'E-commerce',
    },
    {
      quote: 'Profissionalismo e resultados. A equipe entende de verdade o que funciona para restaurantes.',
      name: 'Cliente do segmento gastronômico',
      role: 'Restaurante',
    },
    {
      quote: 'O filme institucional superou todas as expectativas. Qualidade de cinema com entendimento de marca.',
      name: 'Cliente do segmento corporativo',
      role: 'Indústria',
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden bg-secondary/20">
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left - Stats and Proof */}
          <div>
            <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
              Por que escolher a Racun
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
              Resultados que você pode <span className="text-gradient-neon">acompanhar</span>
            </h2>
            
            <div className="space-y-4 mb-8">
              {proofs.map((proof) => (
                <div key={proof} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{proof}</span>
                </div>
              ))}
            </div>

            {/* Client Logos Placeholder */}
            <div className="mb-8">
              <p className="text-sm text-muted-foreground mb-4">Clientes que confiam na Racun:</p>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-24 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground text-xs"
                  >
                    Logo {i}
                  </div>
                ))}
              </div>
            </div>

            <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
              Quero um diagnóstico
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right - Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="glass-card p-6 relative"
              >
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />
                <p className="text-foreground mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-medium text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
