import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, Target, Heart, Zap, Users } from 'lucide-react';
import { useSobreContent } from '@/hooks/useSobreContent';
import { useTeamMembers } from '@/hooks/useTeamMembers';
import { getSocialIcon } from '@/lib/socialIcons';

const iconMap = [Target, Heart, Zap, Users];

const Sobre = () => {
  const { content, isLoading } = useSobreContent();
  const { members } = useTeamMembers(true);

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

        {/* Team */}
        {members.length > 0 && (
          <section className="section-padding">
            <div className="container-custom">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="text-primary text-sm font-medium uppercase tracking-[0.2em] mb-4 block">Equipe</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
                  Quem está <span className="italic text-primary">por trás</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {members.map((m) => (
                  <div key={m.id} className="group">
                    <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-secondary/40 mb-5">
                      {m.photo_url ? (
                        <img src={m.photo_url} alt={m.name}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10" />
                      )}
                    </div>
                    <h3 className="font-display text-2xl mb-1">{m.name}</h3>
                    <p className="text-primary text-sm italic mb-3">{m.role}</p>
                    {m.bio && <p className="text-muted-foreground text-sm leading-relaxed mb-4">{m.bio}</p>}
                    {m.social_links.length > 0 && (
                      <div className="flex gap-3">
                        {m.social_links.filter(s => s.url).map((s, i) => {
                          const Icon = getSocialIcon(s.platform);
                          return (
                            <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all">
                              <Icon className="w-4 h-4" />
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  {content.cta.title} <span className="text-gradient-neon">{content.cta.titleHighlight}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{content.cta.subtitle}</p>
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

export default Sobre;
