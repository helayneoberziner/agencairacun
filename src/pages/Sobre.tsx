import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, Target, Heart, Zap, Users } from 'lucide-react';
import { useSobreContent } from '@/hooks/useSobreContent';
import GlobalCTA from '@/components/cta/GlobalCTA';
import TeamSection from '@/components/TeamSection';

const iconMap = [Target, Heart, Zap, Users];

const Sobre = () => {
  const { content, isLoading } = useSobreContent();

  if (isLoading) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Carregando...</p></div><Footer /></div>;

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
                {content.hero.title} <span className="text-gradient-neon">{content.hero.titleHighlight}</span>
              </h1>
              <p className="text-xl text-muted-foreground">{content.hero.subtitle}</p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">
                  {content.story.label}
                </span>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.story.title}{' '}
                  <span className="text-gradient-neon">{content.story.titleHighlight}</span>
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  {content.story.paragraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </div>

              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent" />
                <div className="relative z-10">
                  <div className="grid grid-cols-2 gap-6">
                    {content.story.stats.map((stat, i) => (
                      <div key={i} className="text-center p-6 rounded-xl bg-white/5">
                        <div className="text-4xl font-display font-bold text-primary">{stat.value}</div>
                        <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                      </div>
                    ))}
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
                {content.values.title} <span className="text-gradient-neon">{content.values.titleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg">{content.values.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {content.values.items.map((value, i) => {
                const Icon = iconMap[i % iconMap.length];
                return (
                  <div key={i} className="glass-card-hover p-8 flex items-start gap-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-xl mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Equipe */}
        <TeamSection />

        {/* CTA Premium */}
        <GlobalCTA
          context="Sobre"
          title={<>{content.cta.title} <span className="text-gradient-neon italic">{content.cta.titleHighlight}</span></>}
          subtitle={content.cta.subtitle || 'Fale com a Racun e descubra o que podemos construir juntos.'}
        />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Sobre;
