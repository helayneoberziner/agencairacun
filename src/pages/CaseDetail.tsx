import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';

interface Project {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  subcategory: string | null;
  description: string | null;
  context: string | null;
  actions: string | null;
  results: string | null;
  deliveries: string[] | null;
  image_url: string | null;
  video_url: string | null;
  gallery_urls: string[] | null;
  client_name: string | null;
  testimonial_text: string | null;
  testimonial_author: string | null;
  seo_description: string | null;
}

const getYoutubeEmbed = (url: string) => {
  const m = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};

const CaseDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [next, setNext] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let { data } = await supabase.from('projects').select('*').eq('slug', slug!).maybeSingle();
      if (!data) {
        const { data: byId } = await supabase.from('projects').select('*').eq('id', slug!).maybeSingle();
        if (!byId) { setNotFound(true); setLoading(false); return; }
        data = byId;
      }
      setProject(data as Project);

      const { data: others } = await supabase
        .from('projects')
        .select('*')
        .neq('id', (data as Project).id)
        .order('display_order', { ascending: true })
        .limit(1);
      setNext((others?.[0] as Project) ?? null);

      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    if (slug) load();
  }, [slug]);

  useDocumentMeta(
    project ? `${project.title} | Cases Racun` : undefined,
    project?.seo_description ?? project?.description ?? undefined,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !project) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom pt-40 pb-20 text-center">
          <p className="text-muted-foreground mb-6">Case não encontrado.</p>
          <Link to="/cases" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar aos cases
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const embed = project.video_url ? getYoutubeEmbed(project.video_url) : null;
  const gallery = project.gallery_urls ?? [];
  const heroOffset = Math.min(scrollY * 0.3, 200);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* HERO FULLSCREEN CINEMATOGRÁFICO */}
        <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
          {embed ? (
            <iframe
              src={`${embed}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&playlist=${embed.split('/').pop()}`}
              title={project.title}
              className="absolute inset-0 w-full h-full pointer-events-none"
              allow="autoplay; encrypted-media"
            />
          ) : project.image_url ? (
            <img
              src={project.image_url}
              alt={project.title}
              style={{ transform: `translateY(${heroOffset}px) scale(1.1)` }}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-100"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
          )}

          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />

          <div className="absolute inset-x-0 bottom-0 pb-16 md:pb-24">
            <div className="container-custom">
              <button
                onClick={() => navigate(-1)}
                className="text-xs uppercase tracking-[0.25em] text-foreground/70 hover:text-primary inline-flex items-center gap-2 mb-10 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar
              </button>

              <div className="flex items-center gap-4 mb-6 text-eyebrow">
                <span>{project.category}</span>
                {project.subcategory && (
                  <>
                    <span className="text-foreground/30">·</span>
                    <span className="text-foreground/60">{project.subcategory}</span>
                  </>
                )}
              </div>

              <h1 className="text-display text-5xl md:text-7xl lg:text-8xl max-w-5xl">
                {project.title}
              </h1>
            </div>
          </div>
        </section>

        {/* META BAR */}
        <section className="border-y border-white/5 py-6">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              {project.client_name && (
                <MetaItem label="Cliente" value={project.client_name} />
              )}
              <MetaItem label="Categoria" value={project.category} />
              {project.subcategory && <MetaItem label="Tipo" value={project.subcategory} />}
              {project.deliveries && project.deliveries.length > 0 && (
                <MetaItem label="Entregas" value={`${project.deliveries.length} itens`} />
              )}
            </div>
          </div>
        </section>

        {/* DESCRIÇÃO EDITORIAL */}
        {project.description && (
          <section className="py-24 md:py-40">
            <div className="container-custom">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-3">
                  <p className="text-eyebrow">Visão geral</p>
                </div>
                <div className="lg:col-span-9">
                  <p className="text-2xl md:text-4xl leading-[1.3] font-light text-foreground/95 max-w-4xl">
                    {project.description}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* GALERIA ASSIMÉTRICA */}
        {gallery.length > 0 && (
          <section className="pb-24 md:pb-40">
            <div className="space-y-6 md:space-y-12">
              {gallery.map((url, i) => {
                const pattern = i % 5;
                if (pattern === 0) {
                  return (
                    <div key={i} className="hover-grayscale overflow-hidden">
                      <img src={url} alt="" loading="lazy" className="w-full h-[60vh] md:h-[90vh] object-cover" />
                    </div>
                  );
                }
                if (pattern === 1 && gallery[i + 1]) {
                  return (
                    <div key={i} className="container-custom grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
                      <div className="hover-grayscale overflow-hidden">
                        <img src={url} alt="" loading="lazy" className="w-full aspect-[3/4] object-cover" />
                      </div>
                      <div className="hover-grayscale overflow-hidden md:mt-24">
                        <img src={gallery[i + 1]} alt="" loading="lazy" className="w-full aspect-[3/4] object-cover" />
                      </div>
                    </div>
                  );
                }
                if (pattern === 2) return null;
                return (
                  <div key={i} className="container-custom hover-grayscale overflow-hidden">
                    <img src={url} alt="" loading="lazy" className="w-full aspect-[16/9] object-cover" />
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTEXTO / AÇÕES / RESULTADOS — blocos editoriais */}
        {(project.context || project.actions || project.results) && (
          <section className="pb-24 md:pb-40">
            <div className="container-custom space-y-24 md:space-y-32">
              {project.context && <EditorialBlock label="O desafio" body={project.context} />}
              {project.actions && <EditorialBlock label="Nossa abordagem" body={project.actions} reverse />}
              {project.results && <EditorialBlock label="Resultados" body={project.results} />}
            </div>
          </section>
        )}

        {/* TESTIMONIAL */}
        {project.testimonial_text && (
          <section className="py-24 md:py-40 border-t border-white/5">
            <div className="container-custom">
              <div className="max-w-5xl mx-auto">
                <p className="text-eyebrow mb-10">Depoimento</p>
                <p className="text-display text-3xl md:text-5xl lg:text-6xl italic text-foreground/95 leading-[1.15]">
                  &ldquo;{project.testimonial_text}&rdquo;
                </p>
                {project.testimonial_author && (
                  <p className="mt-10 text-sm uppercase tracking-[0.25em] text-foreground/60">
                    {project.testimonial_author}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* PRÓXIMO CASE */}
        {next && (
          <Link
            to={`/cases/${next.slug ?? next.id}`}
            className="group relative block h-[70vh] min-h-[500px] overflow-hidden border-t border-white/5"
          >
            {next.image_url && (
              <img
                src={next.image_url}
                alt={next.title}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-50 group-hover:opacity-80"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            <div className="relative h-full flex flex-col items-center justify-center text-center container-custom">
              <p className="text-eyebrow mb-6">Próximo projeto</p>
              <h3 className="text-display text-4xl md:text-6xl lg:text-7xl mb-8 max-w-4xl">{next.title}</h3>
              <span className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-foreground group-hover:text-primary transition-colors">
                Ver projeto <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </span>
            </div>
          </Link>
        )}

        {/* CTA FINAL */}
        <section className="py-24 md:py-32">
          <div className="container-custom text-center max-w-3xl mx-auto">
            <h2 className="text-display text-3xl md:text-5xl mb-8">
              Quer um projeto <span className="italic text-primary">assim?</span>
            </h2>
            <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
              Solicitar proposta <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const MetaItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] uppercase tracking-[0.25em] text-foreground/50 mb-1.5">{label}</p>
    <p className="text-foreground/90 text-sm">{value}</p>
  </div>
);

const EditorialBlock = ({ label, body, reverse }: { label: string; body: string; reverse?: boolean }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
    <div className={`lg:col-span-3 ${reverse ? 'lg:order-last lg:col-start-10' : ''}`}>
      <p className="text-eyebrow lg:sticky lg:top-32">{label}</p>
    </div>
    <div className={`lg:col-span-8 ${reverse ? 'lg:col-start-2 lg:row-start-1' : ''}`}>
      <div className="text-xl md:text-2xl leading-[1.55] text-foreground/85 whitespace-pre-wrap font-light max-w-3xl">
        {body}
      </div>
    </div>
  </div>
);

export default CaseDetail;
