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
import { useRestaurantesContent } from '@/hooks/useRestaurantesContent';
import SEO from '@/components/seo/SEO';

const deliverableIcons = [Camera, Megaphone, Calendar, MapPin];

const Restaurantes = () => {
  const { content } = useRestaurantesContent();

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Marketing para Restaurantes · Conteúdo e Tráfego · Racun"
        description="Marketing especializado para restaurantes: conteúdo que dá fome, anúncios para lotar a casa e campanhas para vender mais delivery."
        path="/restaurantes"
      />
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-secondary/30" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[128px]" />
          
          <div className="container-custom relative z-10 py-20">
            <div className="grid-split items-center">
              <div>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8">
                  <UtensilsCrossed className="w-4 h-4" />
                  {content.hero.badge}
                </span>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                  {content.hero.title}{' '}
                  <span className="text-gradient-neon">{content.hero.titleHighlight}</span>
                </h1>
                
                <p className="text-xl text-muted-foreground mb-10">
                  {content.hero.subtitle}
                </p>

                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  {content.hero.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-secondary/50 border border-white/10 relative">
                  <div className="absolute inset-0 bg-secondary" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <UtensilsCrossed className="w-32 h-32 text-white/10" />
                  </div>
                </div>
                
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
                {content.deliverables.sectionTitle} <span className="text-gradient-neon">{content.deliverables.sectionTitleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {content.deliverables.sectionSubtitle}
              </p>
            </div>

            <div className="grid-cards-2">
              {content.deliverables.items.map((item, index) => {
                const Icon = deliverableIcons[index % deliverableIcons.length];
                return (
                  <div key={index} className="glass-card-hover p-4 md:p-8 flex flex-col md:flex-row items-start gap-2.5 md:gap-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Month Flow */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {content.monthFlow.sectionTitle} <span className="text-gradient-neon">{content.monthFlow.sectionTitleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {content.monthFlow.sectionSubtitle}
              </p>
            </div>

            <div className="grid-cards-4">
              {content.monthFlow.items.map((step, index) => (
                <div key={index} className="glass-card p-3 md:p-6 relative">
                  <span className="text-xs text-primary font-medium uppercase tracking-wider">
                    {step.week}
                  </span>
                  <h4 className="font-display font-semibold text-lg mt-2 mb-2">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {index < content.monthFlow.items.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[2px] bg-primary/30" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Pillars & Traffic */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid-split items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.contentPillars.title} <span className="text-gradient-neon">{content.contentPillars.titleHighlight}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {content.contentPillars.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {content.contentPillars.items.map((pillar, index) => (
                    <div key={index} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <h4 className="font-medium text-foreground mb-1">{pillar.title}</h4>
                      <p className="text-sm text-muted-foreground">{pillar.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.trafficBenefits.title} <span className="text-gradient-neon">{content.trafficBenefits.titleHighlight}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">
                  {content.trafficBenefits.subtitle}
                </p>

                <ul className="space-y-3">
                  {content.trafficBenefits.items.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
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
              <div className="absolute inset-0 bg-secondary/40" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.cta.title} <span className="text-gradient-neon">{content.cta.titleHighlight}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  {content.cta.subtitle}
                </p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  {content.cta.ctaText}
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
