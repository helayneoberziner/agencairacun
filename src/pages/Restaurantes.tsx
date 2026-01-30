import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { 
  ArrowRight, 
  UtensilsCrossed, 
  Camera, 
  Megaphone, 
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';

const Restaurantes = () => {
  const deliverables = [
    {
      icon: Camera,
      title: 'Conteúdo Visual Premium',
      description: 'Fotos e vídeos que dão água na boca. Captação profissional dos seus pratos e ambiente.',
    },
    {
      icon: Megaphone,
      title: 'Gestão de Tráfego Pago',
      description: 'Campanhas otimizadas para alcance local, promoções e aumento de pedidos delivery.',
    },
    {
      icon: Calendar,
      title: 'Calendário Editorial',
      description: 'Planejamento mensal de conteúdo alinhado com datas comemorativas e promoções.',
    },
    {
      icon: MapPin,
      title: 'Alcance Local',
      description: 'Estratégias para aparecer para quem está perto e pronto para pedir ou visitar.',
    },
  ];

  const monthFlow = [
    {
      week: 'Semana 1',
      title: 'Captação',
      description: 'Sessão de fotos e vídeos dos pratos, ambiente e bastidores.',
    },
    {
      week: 'Semana 2',
      title: 'Edição',
      description: 'Produção de reels, fotos e materiais para o mês.',
    },
    {
      week: 'Semana 3',
      title: 'Postagem',
      description: 'Publicação do conteúdo de acordo com o calendário editorial.',
    },
    {
      week: 'Semana 4',
      title: 'Campanhas',
      description: 'Lançamento e otimização de campanhas de tráfego pago.',
    },
  ];

  const contentPillars = [
    { title: 'Pratos', description: 'Os destaques do cardápio em close e com movimento' },
    { title: 'Bastidores', description: 'Preparo, cozinha e o dia a dia do restaurante' },
    { title: 'Prova Social', description: 'Clientes satisfeitos e o movimento da casa' },
    { title: 'Ofertas', description: 'Promoções, combos e novidades do menu' },
  ];

  const trafficBenefits = [
    'Alcance local segmentado por bairro',
    'Campanhas para promoções e eventos',
    'Remarketing para quem já visitou',
    'Anúncios em mapas e rotas',
    'Campanhas de delivery e retirada',
    'Aumento de avaliações positivas',
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-background to-background" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
          
          <div className="container-custom relative z-10 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
                  <UtensilsCrossed className="w-4 h-4" />
                  Marketing para Restaurantes
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                  Lote a casa e aumente os{' '}
                  <span className="text-gradient-neon">pedidos delivery</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-10">
                  Marketing especializado para restaurantes com foco em conteúdo 
                  que dá fome e tráfego pago que traz clientes para a mesa.
                </p>

                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  Quero um plano para meu restaurante
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-white/10 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/10 to-yellow-500/10" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UtensilsCrossed className="w-32 h-32 text-white/10" />
                  </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 glass-card p-4 animate-float">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="text-sm">Casa cheia</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass-card p-4 animate-float delay-200">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-sm">Pedidos subindo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What we deliver */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                O que <span className="text-gradient-neon">entregamos</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Conteúdo + Tráfego: a combinação perfeita para restaurantes que querem crescer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deliverables.map((item) => (
                <div key={item.title} className="glass-card-hover p-8 flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Month Flow */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Como funciona o <span className="text-gradient-neon">mês</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                Um fluxo organizado para garantir conteúdo constante e campanhas otimizadas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {monthFlow.map((step, index) => (
                <div key={step.week} className="glass-card p-6 relative">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {step.week}
                  </span>
                  <h4 className="font-display font-semibold text-lg mt-2 mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {index < monthFlow.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-primary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Pillars */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Pilares de <span className="text-gradient-neon">conteúdo</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Uma estratégia de conteúdo completa que mostra o melhor do seu restaurante 
                  e engaja seu público.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {contentPillars.map((pillar) => (
                    <div key={pillar.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="font-medium text-foreground mb-1">{pillar.title}</h4>
                      <p className="text-sm text-muted-foreground">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Tráfego pago para <span className="text-gradient-neon">restaurantes</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Campanhas específicas para o segmento de alimentação que trazem 
                  clientes para a mesa e para o app.
                </p>

                <ul className="space-y-3">
                  {trafficBenefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-primary/10 to-orange-500/10" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Pronto para <span className="text-gradient-neon">lotar a casa?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Vamos criar uma estratégia personalizada para o seu restaurante 
                  crescer com conteúdo e tráfego pago.
                </p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  Quero um plano para meu restaurante
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

export default Restaurantes;
