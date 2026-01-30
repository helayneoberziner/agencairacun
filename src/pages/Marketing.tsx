import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ParticlesBackground from '@/components/ParticlesBackground';
import { 
  ArrowRight, 
  Megaphone, 
  Target, 
  BarChart3, 
  Palette, 
  LineChart, 
  CheckCircle2,
  ChevronDown 
} from 'lucide-react';
import { useState } from 'react';

const Marketing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const services = [
    {
      icon: Megaphone,
      title: 'Tráfego Pago',
      description: 'Gestão completa de campanhas em Meta Ads, Google Ads e TikTok Ads. Foco em leads qualificados e vendas com otimização constante.',
      features: ['Meta Ads (Facebook e Instagram)', 'Google Ads (Search e Display)', 'TikTok Ads', 'Remarketing inteligente'],
    },
    {
      icon: Target,
      title: 'Estratégia Digital',
      description: 'Diagnóstico completo, definição de persona, posicionamento de marca e planejamento de canais.',
      features: ['Análise de mercado', 'Definição de persona', 'Posicionamento', 'Planejamento de canais'],
    },
    {
      icon: Palette,
      title: 'Criação de Conteúdo',
      description: 'Produção de conteúdo para redes sociais: reels, fotos, vídeos curtos, roteiros e legendas.',
      features: ['Reels e Stories', 'Sessões de fotos', 'Vídeos curtos', 'Roteiros e copies'],
    },
    {
      icon: BarChart3,
      title: 'Funil e Conversão',
      description: 'Criação de landing pages, criativos, testes A/B e otimização de funis para maximizar conversões.',
      features: ['Landing pages', 'Criativos para ads', 'Testes A/B', 'Otimização de funil'],
    },
  ];

  const results = [
    'Painel de acompanhamento em tempo real',
    'Relatórios semanais e mensais',
    'Reuniões de alinhamento periódicas',
    'Otimização contínua baseada em dados',
    'Transparência total nos resultados',
  ];

  const modalities = [
    {
      title: 'Gestão de Tráfego',
      description: 'Foco exclusivo em campanhas pagas com otimização constante e relatórios detalhados.',
    },
    {
      title: 'Conteúdo Mensal',
      description: 'Produção recorrente de conteúdo para redes sociais com planejamento editorial.',
    },
    {
      title: 'Combo Conteúdo + Tráfego',
      description: 'A solução completa: conteúdo estratégico integrado com campanhas de performance.',
    },
  ];

  const faqs = [
    {
      question: 'Quanto tempo leva para ver resultados?',
      answer: 'Depende do seu mercado e objetivo, mas geralmente começamos a ver resultados consistentes entre 30 e 90 dias. Campanhas de tráfego pago podem trazer resultados mais rápidos, enquanto estratégias de conteúdo orgânico levam mais tempo para maturar.',
    },
    {
      question: 'Vocês trabalham com qualquer segmento?',
      answer: 'Trabalhamos com diversos segmentos, mas temos expertise especial em e-commerce, serviços, restaurantes e empresas B2B. Analisamos cada caso para garantir que podemos entregar resultados.',
    },
    {
      question: 'Qual o investimento mínimo em mídia?',
      answer: 'Recomendamos um investimento mínimo em mídia que varia conforme o objetivo e mercado. Isso é definido durante o diagnóstico inicial para garantir que o investimento seja adequado aos seus objetivos.',
    },
    {
      question: 'Como funciona o acompanhamento?',
      answer: 'Você terá acesso a um painel em tempo real, relatórios semanais, reuniões de alinhamento e um canal direto de comunicação com nosso time. Transparência é fundamental.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 gradient-mesh" />
          <ParticlesBackground />
          
          <div className="container-custom relative z-10 text-center py-20">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
              <Megaphone className="w-4 h-4" />
              Marketing Digital
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto">
              Marketing de performance para{' '}
              <span className="text-gradient-neon">escalar seu negócio</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Estratégia, conteúdo e tráfego pago integrados para transformar sua marca 
              em uma máquina de aquisição e vendas.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contato" className="btn-primary flex items-center gap-2">
                Solicitar proposta
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#servicos" className="btn-outline">
                Ver serviços
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicos" className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Serviços de <span className="text-gradient-neon">marketing digital</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Soluções completas para cada etapa da sua estratégia digital.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {services.map((service) => (
                <div key={service.title} className="glass-card-hover p-8">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                    <service.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-2xl mb-4">{service.title}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How we measure */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
                  Transparência
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Como medimos <span className="text-gradient-neon">resultados</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Você acompanha tudo em tempo real. Sem surpresas, sem achismos. 
                  Dados claros para decisões inteligentes.
                </p>

                <ul className="space-y-4">
                  {results.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-display font-semibold">Dashboard em tempo real</h4>
                    <p className="text-sm text-muted-foreground">Acesso 24/7 aos seus dados</p>
                  </div>
                </div>
                <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <span className="text-muted-foreground">Preview do painel</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modalities */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Formatos de <span className="text-gradient-neon">trabalho</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Escolha o modelo que melhor se adapta às suas necessidades.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modalities.map((modality) => (
                <div key={modality.title} className="glass-card-hover p-8 text-center">
                  <h3 className="font-display font-semibold text-xl mb-4">{modality.title}</h3>
                  <p className="text-muted-foreground">{modality.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Perguntas <span className="text-gradient-neon">frequentes</span>
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="glass-card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 flex items-center justify-between text-left"
                  >
                    <span className="font-medium">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Pronto para <span className="text-gradient-neon">escalar?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Vamos conversar sobre como podemos ajudar seu negócio a crescer 
                  com estratégias de marketing de alta performance.
                </p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  Solicitar proposta
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Marketing;
