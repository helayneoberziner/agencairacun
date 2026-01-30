import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, Target, Heart, Zap, Users } from 'lucide-react';

const Sobre = () => {
  const values = [
    {
      icon: Target,
      title: 'Resultados primeiro',
      description: 'Cada ação é pensada para gerar impacto real no seu negócio. Métricas e dados guiam nossas decisões.',
    },
    {
      icon: Heart,
      title: 'Parceria de verdade',
      description: 'Não somos só fornecedores, somos parte do seu time. Seu sucesso é o nosso sucesso.',
    },
    {
      icon: Zap,
      title: 'Execução ágil',
      description: 'Processos enxutos e comunicação direta para entregar com qualidade e velocidade.',
    },
    {
      icon: Users,
      title: 'Time especializado',
      description: 'Cada área com profissionais dedicados: estratégia, conteúdo, tráfego e produção.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20 relative overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          
          <div className="container-custom relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                Sobre a <span className="text-gradient-neon">Racun</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Somos uma agência de marketing digital, produtora audiovisual e especialistas 
                em restaurantes. Unimos estratégia, criatividade e performance para 
                transformar marcas em experiências memoráveis.
              </p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
                  Nossa história
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Nascemos da vontade de fazer{' '}
                  <span className="text-gradient-neon">diferente</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    A Racun nasceu da união de profissionais apaixonados por marketing, 
                    audiovisual e resultados. Cansados de ver empresas investindo em 
                    ações que não geram retorno, decidimos criar uma agência que 
                    entrega o que promete.
                  </p>
                  <p>
                    Hoje, atendemos empresas de diversos segmentos com uma proposta clara: 
                    marketing que funciona, conteúdo que conecta e campanhas que convertem.
                  </p>
                  <p>
                    Nossa especialização em restaurantes surgiu da paixão pelo setor 
                    e da percepção de que faltava um parceiro que entendesse as 
                    particularidades do negócio de alimentação.
                  </p>
                </div>
              </div>

              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="text-center p-6 rounded-xl bg-white/5">
                      <div className="text-4xl font-display font-bold text-primary">50+</div>
                      <div className="text-sm text-muted-foreground mt-1">Clientes atendidos</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/5">
                      <div className="text-4xl font-display font-bold text-primary">3</div>
                      <div className="text-sm text-muted-foreground mt-1">Frentes de atuação</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/5">
                      <div className="text-4xl font-display font-bold text-primary">100%</div>
                      <div className="text-sm text-muted-foreground mt-1">Foco em resultados</div>
                    </div>
                    <div className="text-center p-6 rounded-xl bg-white/5">
                      <div className="text-4xl font-display font-bold text-primary">∞</div>
                      <div className="text-sm text-muted-foreground mt-1">Ideias por projeto</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Nossos <span className="text-gradient-neon">valores</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Os princípios que guiam cada projeto e cada decisão.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <div key={value.title} className="glass-card-hover p-8 flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </div>
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
                  Vamos trabalhar <span className="text-gradient-neon">juntos?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Conte sobre seu projeto e descubra como podemos ajudar sua marca a crescer.
                </p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  Entrar em contato
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

export default Sobre;
