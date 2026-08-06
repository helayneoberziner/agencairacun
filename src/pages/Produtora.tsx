import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import PortfolioGrid from '@/components/PortfolioGrid';
import { ArrowRight, Play, X, ChevronDown, Camera } from 'lucide-react';
import { useProdutoraContent } from '@/hooks/useProdutoraContent';
import { Video, Megaphone, Building2, CalendarDays, Clapperboard, Target } from 'lucide-react';
import GlobalCTA from '@/components/cta/GlobalCTA';
import SEO from '@/components/seo/SEO';

const processSteps = ['Briefing', 'Roteiro', 'Captação', 'Direção', 'Pós-produção', 'Entrega'];
const serviceIcons = [Video, Megaphone, Target, Building2, CalendarDays, Clapperboard];

const Produtora = () => {
  const { content, isLoading } = useProdutoraContent();
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [fotoModal, setFotoModal] = useState<number | null>(null);

  if (isLoading) return null;

  const { hero, services, portfolio, fotos, segments, bastidores, faq, cta } = content;

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Produtora Audiovisual · Filmes, Reels e Campanhas · Racun"
        description="Produtora audiovisual da Racun: filmes institucionais, reels premium, campanhas, drone e cobertura completa com estética cinematográfica."
        path="/produtora"
      />
      <Header />

      <main>
        {/* ═══ HERO ═══ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <iframe
              src={`https://www.youtube.com/embed/${hero.heroYoutubeId}?autoplay=1&mute=1&loop=1&playlist=${hero.heroYoutubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              className="w-full h-full object-cover pointer-events-none"
              style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '100%' }}
              allow="autoplay; encrypted-media"
              frameBorder="0"
              title="Hero Background"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              {hero.title} <span className="text-gradient-neon">{hero.titleHighlight}</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">{hero.subtitle}</p>
            <button onClick={() => setShowreelOpen(true)} className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4">
              <Play className="w-5 h-5" />
              {hero.ctaText}
            </button>
          </div>
        </section>

        {/* ═══ PORTFÓLIO (from DB) ═══ */}
        <PortfolioGrid
          filterCategory={['Vídeo', 'Filme']}
          showFilters
          badge="PORTFÓLIO"
          title={portfolio.sectionTitle}
          titleHighlight=""
          subtitle={portfolio.sectionSubtitle}
        />

        {/* ═══ SERVIÇOS (cards like reference) ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">Serviços</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                {services.sectionTitle} <span className="text-gradient-neon">{services.sectionTitleHighlight}</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{services.sectionSubtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {services.items.map((s, i) => {
                const Icon = serviceIcons[i % serviceIcons.length];
                return (
                  <div key={i} className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:neon-glow transition-all duration-500">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{s.title}</h3>
                    <p className="text-sm text-muted-foreground">{s.description}</p>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-10">
              <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                Solicitar Orçamento
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ SEGMENTOS ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">Mercados</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                {segments.sectionTitle} <span className="text-gradient-neon">{segments.sectionTitleHighlight}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {segments.items.map((seg, i) => {
                const slugMap: Record<string, string> = {
                  'Imobiliário': '/imobiliario','Empresas': '/empresas','Restaurantes': '/restaurantes',
                  'Eventos': '/eventos','Marcas': '/marcas','Política e Eleição': '/politica','Política': '/politica',
                };
                const path = slugMap[seg.title] || '/';
                return (
                  <Link key={i} to={path} className="glass-card p-6 text-left hover:border-primary/40 transition-all duration-300 group flex flex-col">
                    <h4 className="font-display font-semibold text-lg mb-2">{seg.title}</h4>
                    <p className="text-sm text-muted-foreground mb-5 flex-1">{seg.description}</p>
                    <span className="inline-flex items-center gap-1.5 text-sm text-primary font-medium group-hover:gap-2.5 transition-all">
                      Saiba mais <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ FOTOS ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">Fotografia</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                Imagens que <span className="text-gradient-neon">contam histórias</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{fotos.sectionSubtitle}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
              {fotos.items.filter(item => item.image).map((item, i) => (
                <div key={i} onClick={() => setFotoModal(i)} className="group cursor-pointer rounded-xl overflow-hidden aspect-[4/3] relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h4 className="font-display font-semibold text-white text-sm">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROCESSO ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              Nosso <span className="text-gradient-neon">processo.</span>
            </h2>
            <div className="relative">
              <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-8">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <span className="font-display font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BASTIDORES ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              <span className="text-gradient-neon">{bastidores.sectionTitle}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {bastidores.images.filter(Boolean).map((src, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden border border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
                  <img src={src} alt={`Bastidores ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              {faq.sectionTitle} <span className="text-gradient-neon">{faq.sectionTitleHighlight}</span>
            </h2>
            <div>
              {faq.items.map((item, i) => (
                <div key={i} className="border-b border-white/10">
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left group">
                    <span className="text-lg font-medium group-hover:text-primary transition-colors pr-4">{item.question}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL PREMIUM ═══ */}
        <GlobalCTA
          context="Produtora"
          defaultService="Produtora Audiovisual"
          title={<>{cta.title} <span className="text-gradient-neon italic">{cta.titleHighlight}</span></>}
          subtitle={cta.subtitle || 'Vamos criar algo cinematográfico para a sua marca?'}
        />
      </main>

      <Footer />
      <WhatsAppButton />

      {/* ═══ MODAL SHOWREEL ═══ */}
      {showreelOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowreelOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video bg-secondary rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowreelOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${hero.showreelYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
              title="Showreel"
            />
          </div>
        </div>
      )}

      {/* ═══ MODAL FOTO ═══ */}
      {fotoModal !== null && fotos.items[fotoModal] && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setFotoModal(null)}>
          <div className="relative w-full max-w-5xl bg-secondary rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setFotoModal(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <img
              src={fotos.items[fotoModal].image}
              alt={fotos.items[fotoModal].title}
              className="w-full max-h-[85vh] object-contain"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/80 to-transparent">
              <h3 className="font-display font-semibold text-lg">{fotos.items[fotoModal].title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtora;
