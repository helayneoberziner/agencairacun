import { useState } from 'react';
import { Link } from 'react-router-dom'; 
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ExternalLink, Loader2 } from 'lucide-react';
import GlobalCTA from '@/components/cta/GlobalCTA';
import { useCases } from '@/hooks/useCases';
import { resolveVideoCover } from '@/lib/videoUtils';
import SEO from '@/components/seo/SEO';
import { useSegmentsList } from '@/hooks/useSegmentPage';
import { normalizeSegment } from '@/lib/segments';

const Cases = () => {
  const [filter, setFilter] = useState<string>('todos');
  const { data: cases = [], isLoading } = useCases();
  const { data: dbSegments = [] } = useSegmentsList();

  // Build filter list dynamically from active segments in the admin panel.
  // Only shows segments that actually have at least one case linked to them,
  // so the UI stays clean while remaining fully dynamic.
  const usedSegs = new Set(cases.flatMap(c => (c.segments || []).map(normalizeSegment)));
  const filterOptions = [
    { slug: 'todos', label: 'Todos' },
    ...dbSegments
      .filter(s => s.is_active && usedSegs.has(s.slug))
      .map(s => ({ slug: s.slug, label: s.name })),
  ];
  const filtered = filter === 'todos'
    ? cases
    : cases.filter(c => (c.segments || []).map(normalizeSegment).includes(filter));

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Cases · Projetos e Resultados · Racun"
        description="Conheça os cases da Agência Racun: projetos de marketing e produções audiovisuais que entregaram resultado real para marcas."
        path="/cases"
      />
      <Header />
      
      <main>
        <section className="pt-32 pb-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Nossos <span className="text-gradient-neon italic">Cases</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cada cliente, uma história viva. Conheça os projetos que construímos junto com nossos parceiros.
            </p>
          </div>
        </section>

        {filterOptions.length > 1 && (
          <section className="pb-8">
            <div className="container-custom">
              <div className="flex flex-wrap justify-center gap-3">
                {filterOptions.map(opt => (
                  <button
                    key={opt.slug}
                    onClick={() => setFilter(opt.slug)}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      filter === opt.slug
                        ? 'bg-primary text-primary-foreground neon-glow'
                        : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section-padding pt-8">
          <div className="container-custom">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  {cases.length === 0
                    ? 'Novos cases em breve!'
                    : 'Nenhum case encontrado nesta categoria.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((c) => {
                  const cover = c.hero_image_url || resolveVideoCover({ videoUrl: c.hero_media_url, youtubeId: c.hero_youtube_id });
                  return (
                    <Link
                      key={c.id}
                      to={`/cases/${c.slug}`}
                      className="group glass-card overflow-hidden"
                    >
                      <div className="aspect-video relative overflow-hidden bg-muted">
                        {cover ? (
                          <img src={cover} alt={c.title} loading="lazy"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                          <span className="btn-primary flex items-center gap-2 text-sm">
                            Ver case <ExternalLink className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="text-xs text-primary font-medium uppercase tracking-wider">{c.client_name}</span>
                        <h3 className="font-display font-semibold text-xl mt-2 mb-2 group-hover:text-primary transition-colors">{c.title}</h3>
                        {c.subtitle && <p className="text-muted-foreground text-sm line-clamp-2">{c.subtitle}</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <GlobalCTA context="Cases" title={<>Quer um case <span className="text-gradient-neon italic">assim?</span></>} />
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cases;
