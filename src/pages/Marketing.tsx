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
import { useMarketingContent } from '@/hooks/useMarketingContent';
import GlobalCTA from '@/components/cta/GlobalCTA';

const serviceIcons = [Megaphone, Target, Palette, BarChart3];

const Marketing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { content, isLoading } = useMarketingContent();

  if (isLoading) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Carregando...</p></div><Footer /></div>;

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
              {content.hero.badge}
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto">
              {content.hero.title}{' '}
              <span className="text-gradient-neon">{content.hero.titleHighlight}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {content.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contato" className="btn-primary flex items-center gap-2">
                {content.hero.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#servicos" className="btn-outline">
                {content.hero.secondaryCtaText}
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="servicos" className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {content.services.sectionTitle} <span className="text-gradient-neon">{content.services.sectionTitleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">{content.services.sectionSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {content.services.items.map((service, i) => {
                const Icon = serviceIcons[i % serviceIcons.length];
                return (
                  <div key={i} className="glass-card-hover p-8">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-2xl mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How we measure */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
                  {content.results.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.results.title} <span className="text-gradient-neon">{content.results.titleHighlight}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8">{content.results.subtitle}</p>

                <ul className="space-y-4">
                  {content.results.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
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
                    <h4 className="font-display font-semibold">{content.results.dashboardTitle}</h4>
                    <p className="text-sm text-muted-foreground">{content.results.dashboardSubtitle}</p>
                  </div>
                </div>
                <div className="aspect-video rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                  {content.results.dashboardImage ? (
                    <img src={content.results.dashboardImage} alt={content.results.dashboardTitle} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-muted-foreground">Preview do painel</span>
                  )}
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
                {content.modalities.sectionTitle} <span className="text-gradient-neon">{content.modalities.sectionTitleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">{content.modalities.sectionSubtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {content.modalities.items.map((modality, i) => (
                <div key={i} className="glass-card-hover p-8 text-center">
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
                {content.faqs.sectionTitle} <span className="text-gradient-neon">{content.faqs.sectionTitleHighlight}</span>
              </h2>
            </div>

            <div className="space-y-4">
              {content.faqs.items.map((faq, index) => (
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

        {/* CTA Premium */}
        <GlobalCTA
          context="Marketing"
          defaultService="Marketing Digital"
          title={<>{content.cta.title} <span className="text-gradient-neon italic">{content.cta.titleHighlight}</span></>}
          subtitle={content.cta.subtitle || 'Vamos escalar os seus resultados com estratégia, dados e criatividade.'}
        />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Marketing;
