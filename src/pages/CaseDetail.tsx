import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, ArrowLeft, Loader2, Quote } from 'lucide-react';
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
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await supabase.from('projects').select('*').eq('slug', slug!).maybeSingle();
      if (!data) {
        // Fallback: try by id (legacy links)
        const { data: byId } = await supabase.from('projects').select('*').eq('id', slug!).maybeSingle();
        if (!byId) { setNotFound(true); setLoading(false); return; }
        setProject(byId as Project);
      } else {
        setProject(data as Project);
      }
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="pt-32 pb-16 md:pt-40 md:pb-24">
          <div className="container-custom">
            <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-2 mb-8 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </button>
            <div className="max-w-4xl">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">{project.category}</span>
                {project.subcategory && (
                  <>
                    <span className="text-muted-foreground/40">·</span>
                    <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{project.subcategory}</span>
                  </>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-8">
                {project.title}
              </h1>
              {project.description && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl">
                  {project.description}
                </p>
              )}
              {project.client_name && (
                <p className="mt-6 text-sm text-muted-foreground">
                  Cliente: <span className="text-foreground font-medium">{project.client_name}</span>
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Hero media */}
        {(project.image_url || embed) && (
          <section className="pb-16 md:pb-24">
            <div className="container-custom">
              <div className="rounded-2xl overflow-hidden bg-secondary/40 aspect-video">
                {embed ? (
                  <iframe src={embed} title={project.title} className="w-full h-full" allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" />
                ) : (
                  <img src={project.image_url!} alt={project.title} className="w-full h-full object-cover" />
                )}
              </div>
            </div>
          </section>
        )}

        {/* Body */}
        <section className="pb-20 md:pb-28">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-6xl mx-auto">
              <div className="lg:col-span-8 space-y-12">
                {project.context && (
                  <Block label="Contexto" body={project.context} />
                )}
                {project.actions && (
                  <Block label="O que fizemos" body={project.actions} />
                )}
                {project.results && (
                  <Block label="Resultados" body={project.results} />
                )}
              </div>
              <aside className="lg:col-span-4 space-y-8 lg:border-l lg:border-white/10 lg:pl-10">
                {project.deliveries && project.deliveries.length > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">Entregas</p>
                    <ul className="space-y-3">
                      {project.deliveries.map((d, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                          <span className="text-foreground/90">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* Gallery */}
        {gallery.length > 0 && (
          <section className="pb-20 md:pb-28">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
                {gallery.map((url, i) => (
                  <div key={i} className={`overflow-hidden rounded-2xl bg-secondary/40 ${i % 3 === 0 ? 'md:col-span-2 aspect-[16/9]' : 'aspect-[4/5]'}`}>
                    <img src={url} alt={`${project.title} ${i + 1}`} loading="lazy"
                      className="w-full h-full object-cover grayscale hover:grayscale-0 hover:scale-[1.03] transition-all duration-700" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonial */}
        {project.testimonial_text && (
          <section className="pb-20 md:pb-28">
            <div className="container-custom">
              <div className="max-w-3xl mx-auto text-center">
                <Quote className="w-10 h-10 text-primary mx-auto mb-6 opacity-60" />
                <p className="font-display text-2xl md:text-3xl leading-relaxed mb-6">
                  "{project.testimonial_text}"
                </p>
                {project.testimonial_author && (
                  <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                    {project.testimonial_author}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="pb-24 md:pb-32">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-5xl leading-tight mb-6">
                Quer um case <span className="italic text-primary">assim?</span>
              </h2>
              <p className="text-muted-foreground text-lg mb-8">
                Vamos conversar sobre como criar resultados similares para o seu negócio.
              </p>
              <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                Solicitar proposta <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

const Block = ({ label, body }: { label: string; body: string }) => (
  <div>
    <p className="text-xs uppercase tracking-[0.2em] text-primary mb-4">{label}</p>
    <div className="text-lg md:text-xl leading-relaxed text-foreground/85 whitespace-pre-wrap">{body}</div>
  </div>
);

export default CaseDetail;