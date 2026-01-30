import { Link } from 'react-router-dom';
import { Megaphone, Video, Palette, BarChart3, ArrowRight } from 'lucide-react';

const ServicesSection = () => {
  const services = [
    {
      icon: Megaphone,
      title: 'Tráfego Pago',
      description: 'Campanhas em Meta, Google e TikTok com foco em leads e vendas. Otimização contínua para máximo ROI.',
      features: ['Meta Ads', 'Google Ads', 'TikTok Ads'],
    },
    {
      icon: Video,
      title: 'Criação de Conteúdo',
      description: 'Reels, fotos, vídeos curtos e roteiros. Conteúdo estratégico que conecta e engaja seu público.',
      features: ['Reels e Stories', 'Vídeos curtos', 'Roteiros'],
    },
    {
      icon: BarChart3,
      title: 'Funil e Campanha',
      description: 'Landing pages, criativos e testes A/B. Estruturas de funil que convertem visitantes em clientes.',
      features: ['Landing Pages', 'Criativos', 'Testes A/B'],
    },
    {
      icon: Palette,
      title: 'Branding e Social',
      description: 'Linha editorial, calendário de conteúdo e identidade visual. Posicionamento que diferencia.',
      features: ['Linha Editorial', 'Calendário', 'Identidade'],
    },
  ];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
            O que fazemos
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            Marketing de <span className="text-gradient-neon">alta performance</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Combinamos estratégia, criatividade e dados para entregar resultados reais. 
            Cada ação é pensada para gerar crescimento.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="glass-card-hover p-8 group"
            >
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:neon-glow transition-all duration-500">
                  <service.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-xl mb-3">{service.title}</h3>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {service.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-3 py-1 text-xs rounded-full bg-white/5 text-muted-foreground border border-white/10"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link to="/marketing" className="btn-outline inline-flex items-center gap-2">
            Saiba mais sobre marketing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
