import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, Play, X, ChevronDown, Camera } from 'lucide-react';
import { useProdutoraContent } from '@/hooks/useProdutoraContent';

const processSteps = ['Briefing', 'Roteiro', 'Captação', 'Direção', 'Pós-produção', 'Entrega'];

const Produtora = () => {
  const { content, isLoading } = useProdutoraContent();
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [openService, setOpenService] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<number | null>(null);
  const [fotoModal, setFotoModal] = useState<number | null>(null);

  if (isLoading) return null;

  const { hero, services, portfolio, fotos, segments, bastidores, faq, cta } = content;

  return (
    <div className="min-h-screen bg-background">
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

        {/* ═══ SERVIÇOS ═══ */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              {services.sectionTitle} <span className="text-gradient-neon">{services.sectionTitleHighlight}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12">{services.sectionSubtitle}</p>
            <div className="divide-y divide-white/10">
              {services.items.map((s, i) => (
                <div key={i}>
                  <button onClick={() => setOpenService(openService === i ? null : i)} className="w-full flex items-center justify-between py-6 text-left group">
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-mono text-primary">{s.num}</span>
                      <span className="text-xl md:text-2xl font-display font-semibold group-hover:text-primary transition-colors">{s.title}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openService === i ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openService === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                    <p className="text-muted-foreground pl-14 pr-8">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PORTFÓLIO ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-center">
              <span className="text-gradient-neon">{portfolio.sectionTitle}</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 text-center max-w-2xl mx-auto">{portfolio.sectionSubtitle}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.items.map((item, i) => (
                <div key={i} onClick={() => setPortfolioModal(i)} className="group cursor-pointer glass-card overflow-hidden">
                  <div className="aspect-video relative overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/40 backdrop-blur-sm">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-medium group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FOTOS ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
                <Camera className="w-4 h-4" />
                Fotografia
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
                <span className="text-gradient-neon">{fotos.sectionTitle}</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">{fotos.sectionSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {fotos.items.filter(item => item.image).map((item, i) => (
                <div key={i} onClick={() => setFotoModal(i)} className="group cursor-pointer glass-card overflow-hidden">
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-medium group-hover:text-primary transition-colors">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SEGMENTOS ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              {segments.sectionTitle} <span className="text-gradient-neon">{segments.sectionTitleHighlight}</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {segments.items.map((seg, i) => (
                <div key={i} className="glass-card p-6 text-center hover:border-primary/30 transition-colors">
                  <h4 className="font-display font-semibold text-lg mb-2">{seg.title}</h4>
                  <p className="text-sm text-muted-foreground">{seg.description}</p>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
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

        {/* ═══ CTA FINAL ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                  {cta.title} <span className="text-gradient-neon">{cta.titleHighlight}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{cta.subtitle}</p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                  {cta.ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
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

      {/* ═══ MODAL PORTFÓLIO ═══ */}
      {portfolioModal !== null && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPortfolioModal(null)}>
          <div className="relative w-full max-w-4xl aspect-video bg-secondary rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPortfolioModal(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${portfolio.items[portfolioModal]?.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
              frameBorder="0"
              title={portfolio.items[portfolioModal]?.title}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtora;
