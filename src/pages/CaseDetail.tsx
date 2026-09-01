import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import GlobalCTA from '@/components/cta/GlobalCTA';
import VideoPlayer from '@/components/media/VideoPlayer';
import { useCaseBySlug, CaseMediaRow } from '@/hooks/useCases';
import { Loader2, ArrowLeft, Quote } from 'lucide-react';
import { resolveVideoCover } from '@/lib/videoUtils';
import SEO from '@/components/seo/SEO';

const SectionGroup = ({ title, items }: { title: string; items: CaseMediaRow[] }) => {
  if (items.length === 0) return null;
  return (
    <section className="section-padding">
      <div className="container-custom">
        <h2 className="text-2xl md:text-4xl font-display font-bold mb-8">
          {title}
        </h2>
        <div className="grid-cards-2">
          {items.map(m => (
            <div key={m.id} className="glass-card overflow-hidden">
              {m.kind === 'image' ? (
                <img src={m.url || ''} alt={m.caption || ''} loading="lazy" className="w-full aspect-video object-cover" />
              ) : (
                <VideoPlayer url={m.url || (m.youtube_id ? `https://youtu.be/${m.youtube_id}` : '')} title={m.caption || undefined} />
              )}
              {m.caption && <p className="px-4 py-3 text-sm text-muted-foreground">{m.caption}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CaseDetail = () => {
  const { slug } = useParams();
  const { data, isLoading } = useCaseBySlug(slug);

  useEffect(() => {
    if (data?.case) {
      document.title = data.case.seo_title || `${data.case.title} — Racun`;
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data?.case) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container-custom pt-40 pb-20 text-center">
          <h1 className="text-3xl font-display font-bold mb-4">Case não encontrado</h1>
          <Link to="/cases" className="btn-primary inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Ver todos os cases</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const c = data.case;
  const media = data.media;
  const audiovisual = media.filter(m => m.section === 'audiovisual');
  const marketing = media.filter(m => m.section === 'marketing');
  const galeria = media.filter(m => m.section === 'galeria' || m.section === 'bastidores');

  const heroVideoUrl = c.hero_kind === 'video'
    ? (c.hero_media_url || (c.hero_youtube_id ? `https://youtu.be/${c.hero_youtube_id}` : null))
    : null;
  const heroCover = c.hero_image_url || resolveVideoCover({
    imageUrl: c.hero_image_url,
    videoUrl: c.hero_media_url,
    youtubeId: c.hero_youtube_id,
  });

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={c.seo_title || `${c.title} · Case Racun`}
        description={c.seo_description || c.subtitle || `Case ${c.title} da Agência Racun.`}
        path={`/cases/${c.slug}`}
      />
      <Header />
      <main>
        {/* Hero cinematográfico */}
        <section className="pt-32 pb-12">
          <div className="container-custom">
            <Link to="/cases" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Todos os cases
            </Link>
            <div className="max-w-4xl">
              <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-4 block">
                {c.client_name}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                {c.title}
              </h1>
              {c.subtitle && <p className="text-lg md:text-xl text-muted-foreground max-w-3xl">{c.subtitle}</p>}
            </div>

            <div className="mt-10 rounded-2xl overflow-hidden">
              {heroVideoUrl ? (
                <VideoPlayer url={heroVideoUrl} poster={heroCover} title={c.title} aspect="aspect-[16/9]" />
              ) : heroCover ? (
                <img src={heroCover} alt={c.title} className="w-full aspect-[16/9] object-cover rounded-2xl" />
              ) : (
                <div className="w-full aspect-[16/9] bg-secondary rounded-2xl" />
              )}
            </div>
          </div>
        </section>

        {/* O que fizemos */}
        {(c.challenge || c.strategy || c.solution) && (
          <section className="section-padding">
            <div className="container-custom">
              <h2 className="text-2xl md:text-4xl font-display font-bold mb-10">
                O que <span className="text-gradient-neon italic">fizemos</span>
              </h2>
              <div className="grid-cards-3">
                {c.challenge && (
                  <div className="glass-card p-4 md:p-8">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Desafio</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{c.challenge}</p>
                  </div>
                )}
                {c.strategy && (
                  <div className="glass-card p-4 md:p-8">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Estratégia</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{c.strategy}</p>
                  </div>
                )}
                {c.solution && (
                  <div className="glass-card p-4 md:p-8">
                    <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Solução</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{c.solution}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <SectionGroup title="Audiovisual" items={audiovisual} />
        <SectionGroup title="Marketing" items={marketing} />

        {/* Resultados */}
        {(c.results_text || (c.metrics && c.metrics.length > 0)) && (
          <section className="section-padding">
            <div className="container-custom">
              <h2 className="text-2xl md:text-4xl font-display font-bold mb-8">
                Resultados
              </h2>
              {c.metrics && c.metrics.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {c.metrics.map((m, i) => (
                    <div key={i} className="glass-card p-3 md:p-6 text-center">
                      <div className="text-3xl md:text-4xl font-display font-bold text-gradient-neon mb-2">{m.value}</div>
                      <div className="text-sm text-muted-foreground uppercase tracking-wider">{m.label}</div>
                    </div>
                  ))}
                </div>
              )}
              {c.results_text && (
                <p className="text-muted-foreground text-lg whitespace-pre-wrap max-w-3xl">{c.results_text}</p>
              )}
            </div>
          </section>
        )}

        <SectionGroup title="Galeria" items={galeria} />

        {/* Depoimento */}
        {c.testimonial_text && (
          <section className="section-padding">
            <div className="container-custom max-w-4xl">
              <div className="glass-card p-4 md:p-8 md:p-12 relative">
                <Quote className="w-12 h-12 text-primary/30 mb-6" />
                <p className="text-xl md:text-2xl font-display leading-relaxed mb-6">"{c.testimonial_text}"</p>
                {c.testimonial_author && (
                  <p className="text-sm text-primary font-medium uppercase tracking-wider">— {c.testimonial_author}</p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA Final */}
        <GlobalCTA
          context={`Case ${c.client_name}`}
          title={<>Quer um case como o da <span className="text-gradient-neon italic">{c.client_name}?</span></>}
          subtitle="Fale com a Racun e descubra o que podemos construir juntos para a sua marca."
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default CaseDetail;