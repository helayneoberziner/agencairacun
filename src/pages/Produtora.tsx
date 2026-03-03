import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, Film, Play, Camera, Video, Clapperboard } from 'lucide-react';
import { useProdutoraContent } from '@/hooks/useProdutoraContent';

const iconMap: Record<string, React.ElementType> = { Film, Clapperboard, Video, Camera };
const iconList = [Film, Clapperboard, Video, Camera];

const Produtora = () => {
  const { content } = useProdutoraContent();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-background to-background" />
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-6xl aspect-video mx-4 rounded-2xl overflow-hidden bg-secondary/30 border border-white/10 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-transparent" />
              <button className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                <div className="w-24 h-24 rounded-full bg-primary/90 flex items-center justify-center neon-glow">
                  <Play className="w-10 h-10 text-primary-foreground ml-1" />
                </div>
              </button>
              <div className="absolute bottom-6 left-6 flex items-center gap-2 text-white/80">
                <Film className="w-5 h-5" />
                {content.hero.showreelLabel}
              </div>
            </div>
          </div>

          <div className="container-custom relative z-10 text-center py-20 mt-[40vh]">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm mb-8">
              <Film className="w-4 h-4" />
              {content.hero.badge}
            </span>
            
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 max-w-4xl mx-auto">
              {content.hero.title}{' '}
              <span className="text-gradient-neon">{content.hero.titleHighlight}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              {content.hero.subtitle}
            </p>

            <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
              {content.hero.ctaText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Services */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                {content.services.sectionTitle} <span className="text-gradient-neon">{content.services.sectionTitleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {content.services.sectionSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.services.items.map((service, index) => {
                const Icon = iconList[index % iconList.length];
                return (
                  <div key={index} className="glass-card-hover p-8 flex items-start gap-6">
                    <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-3">{service.title}</h3>
                      <p className="text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Portfolio */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                <span className="text-gradient-neon">{content.portfolio.sectionTitle}</span>
              </h2>
              <p className="text-muted-foreground text-lg">
                {content.portfolio.sectionSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.portfolio.items.map((item, index) => (
                <div key={index} className="group glass-card overflow-hidden cursor-pointer">
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-primary/10 to-secondary" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-medium group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.client}</p>
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
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10" />
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

export default Produtora;
