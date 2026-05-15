import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight, Play, X, ChevronDown,
  Target, MapPin, Users, Repeat, MessageSquare, LineChart,
  Search, FileText, Globe, Mic, Camera, Plane, Video, Film,
  Building2, Sparkles, ShoppingBag,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import SegmentLeadForm from '@/components/segment/SegmentLeadForm';
import { useSegmentPage } from '@/hooks/useSegmentPage';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { useTestimonials } from '@/hooks/useTestimonials';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, any> = {
  Target, MapPin, Users, Repeat, MessageSquare, LineChart,
  Search, FileText, Globe, Mic, Camera, Plane, Video, Film,
  Building2, Sparkles, ShoppingBag,
};

function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^?&]+)/);
  return match ? match[1] : null;
}

interface Props { slug: string }

const SegmentLandingPage = ({ slug }: Props) => {
  const { data: page, isLoading } = useSegmentPage(slug);
  const { settings } = useSiteSettings();
  const { testimonials } = useTestimonials();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [photoModal, setPhotoModal] = useState<string | null>(null);

  const { data: portfolioProjects = [] } = useQuery({
    queryKey: ['segment-portfolio', page?.id, page?.name, page?.content?.portfolio?.projectIds],
    enabled: !!page,
    queryFn: async () => {
      const ids = page?.content?.portfolio?.projectIds ?? [];
      const { data } = await supabase
        .from('projects')
        .select('id,title,subcategory,image_url,video_url')
        .order('display_order', { ascending: true });
      const all = data ?? [];
      // Manual selection wins
      if (ids.length > 0) {
        const set = new Set(ids);
        return all.filter((p: any) => set.has(p.id));
      }
      // Auto filter by subcategory matching the segment (name or slug)
      const norm = (s: string) =>
        (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
      const targets = [norm(page?.name || ''), norm(slug)];
      return all.filter((p: any) => p.subcategory && targets.includes(norm(p.subcategory)));
    },
  });

  // SEO
  useEffect(() => {
    if (!page) return;
    const title = page.seo_title || `${page.name} | Agência Racun`;
    const desc = page.seo_description || '';
    document.title = title;
    const setMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };
    setMeta('description', desc);
    setMeta('og:title', title, 'property');
    setMeta('og:description', desc, 'property');
    setMeta('og:type', 'website', 'property');
    setMeta('og:url', `https://agenciaracun.lovable.app/${slug}`, 'property');
    if (page.og_image_url) setMeta('og:image', page.og_image_url, 'property');

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://agenciaracun.lovable.app/${slug}`;

    const schemaId = 'segment-jsonld';
    let schema = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!schema) {
      schema = document.createElement('script');
      schema.type = 'application/ld+json';
      schema.id = schemaId;
      document.head.appendChild(schema);
    }
    schema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.name,
      description: desc,
      provider: { '@type': 'Organization', name: 'Agência Racun' },
    });
  }, [page, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!page || !page.is_active) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-custom section-padding text-center">
          <h1 className="font-display text-4xl mb-4">Segmento não encontrado</h1>
          <Link to="/" className="text-primary">Voltar para o início</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const c = page.content;
  const heroYouTubeId = c.hero.mediaType === 'video' ? extractYoutubeId(c.hero.mediaUrl) : null;
  const featuredYouTubeId = extractYoutubeId(c.videoFeatured?.youtubeId || '');
  const whatsappLink = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(c.finalCta.whatsappMessage || `Olá! Quero falar sobre ${page.name}.`)}`;
  const segmentTestimonials = testimonials.filter(t => c.testimonialIds?.includes(t.id));

  const renderServiceCard = (item: any, i: number) => {
    const Icon = iconMap[item.icon] || Sparkles;
    return (
      <div key={i} className="glass-card p-6 hover:border-primary/30 transition-all duration-300 group">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:neon-glow transition-all duration-500">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* HERO */}
        <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {heroYouTubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${heroYouTubeId}?autoplay=1&mute=1&loop=1&playlist=${heroYouTubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
                className="w-full h-full pointer-events-none"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '177.78vh', height: '100vh', minWidth: '100%', minHeight: '100%' }}
                allow="autoplay; encrypted-media"
                title="Hero"
              />
            ) : c.hero.mediaUrl ? (
              <img src={c.hero.mediaUrl} alt={page.name} className="w-full h-full object-cover" loading="eager" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-accent/20 via-background to-primary/10" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/60 to-background" />
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto py-20">
            <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-6 block">{page.name}</span>
            <h1 className="text-4xl md:text-7xl font-display font-bold mb-6 leading-tight">
              {c.hero.title} <span className="text-gradient-neon italic">{c.hero.highlight}</span>
            </h1>
            <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">{c.hero.subtitle}</p>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-3 text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
              {c.hero.ctaText}
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </section>

        {/* INTRO */}
        {(c.intro?.title || c.intro?.description) && (
          <section className="section-padding">
            <div className="container-custom max-w-4xl text-center">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight">
                {c.intro.title}
              </h2>
              <p className="text-muted-foreground text-lg md:text-xl">{c.intro.description}</p>
            </div>
          </section>
        )}

        {/* COMO AJUDAMOS — MARKETING + AUDIOVISUAL */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">Como ajudamos</span>
              <h2 className="text-3xl md:text-5xl font-display font-bold">
                Marketing e <span className="text-gradient-neon italic">Audiovisual</span> integrados.
              </h2>
            </div>

            {/* Marketing */}
            {c.marketing?.items?.length > 0 && (
              <div className="mb-16">
                <div className="mb-8 max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">{c.marketing.title}</h3>
                  <p className="text-muted-foreground">{c.marketing.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {c.marketing.items.map(renderServiceCard)}
                </div>
              </div>
            )}

            {/* Audiovisual */}
            {c.audiovisual?.items?.length > 0 && (
              <div>
                <div className="mb-8 max-w-2xl">
                  <h3 className="text-2xl md:text-3xl font-display font-bold mb-2">{c.audiovisual.title}</h3>
                  <p className="text-muted-foreground">{c.audiovisual.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {c.audiovisual.items.map(renderServiceCard)}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* VÍDEO EM DESTAQUE */}
        {featuredYouTubeId && (
          <section className="section-padding">
            <div className="container-custom max-w-5xl">
              {c.videoFeatured.title && (
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-10 text-center">
                  <span className="text-gradient-neon italic">{c.videoFeatured.title}</span>
                </h2>
              )}
              <div onClick={() => setVideoOpen(true)} className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group">
                <img src={`https://img.youtube.com/vi/${featuredYouTubeId}/maxresdefault.jpg`} alt={c.videoFeatured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-primary-foreground ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* PORTFÓLIO DO SEGMENTO */}
        {portfolioProjects.length > 0 && (
          <section className="section-padding bg-secondary/20">
            <div className="container-custom">
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">Portfólio</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold">
                  <span className="text-gradient-neon italic">{c.portfolio.title}</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioProjects.map((p: any) => {
                  const yid = p.video_url ? extractYoutubeId(p.video_url) : null;
                  const thumb = p.image_url || (yid ? `https://img.youtube.com/vi/${yid}/hqdefault.jpg` : null);
                  return (
                    <div key={p.id} onClick={() => yid ? setPhotoModal(`yt:${yid}`) : thumb && setPhotoModal(thumb)} className="group cursor-pointer relative rounded-xl overflow-hidden aspect-video grayscale hover:grayscale-0 transition-all duration-500">
                      {thumb && <img src={thumb} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" loading="lazy" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="font-display font-bold text-white uppercase">{p.title}</h3>
                        {p.subcategory && <span className="text-xs text-white/60">{p.subcategory}</span>}
                      </div>
                      {yid && (
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                          <Play className="w-4 h-4 text-primary-foreground ml-0.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* GALERIA */}
        {c.gallery?.images?.length > 0 && (
          <section className="section-padding">
            <div className="container-custom">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
                <span className="text-gradient-neon italic">{c.gallery.title}</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {c.gallery.images.filter(Boolean).map((src, i) => (
                  <div key={i} onClick={() => setPhotoModal(src)} className="aspect-square rounded-xl overflow-hidden border border-white/5 cursor-pointer grayscale hover:grayscale-0 transition-all duration-500">
                    <img src={src} alt={`Galeria ${i + 1}`} className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.03]" loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DEPOIMENTOS */}
        {segmentTestimonials.length > 0 && (
          <section className="section-padding bg-secondary/20">
            <div className="container-custom">
              <div className="text-center mb-12">
                <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">Depoimentos</span>
                <h2 className="text-3xl md:text-5xl font-display font-bold">
                  Quem já <span className="text-gradient-neon italic">confiou.</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {segmentTestimonials.map(t => (
                  <div key={t.id} className="glass-card p-6">
                    <p className="text-muted-foreground italic mb-4">"{t.quote}"</p>
                    <div className="border-t border-white/10 pt-4">
                      <div className="font-display font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {c.faq?.items?.length > 0 && (
          <section className="section-padding">
            <div className="container-custom max-w-3xl">
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
                <span className="text-gradient-neon italic">{c.faq.title}</span>
              </h2>
              <div>
                {c.faq.items.map((item, i) => (
                  <div key={i} className="border-b border-white/10">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left group">
                      <span className="text-base md:text-lg font-medium group-hover:text-primary transition-colors pr-4">{item.question}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-60 pb-5' : 'max-h-0'}`}>
                      <p className="text-muted-foreground">{item.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-8 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                  {c.finalCta.title?.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-gradient-neon italic">{c.finalCta.title?.split(' ').slice(-1)}</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">{c.finalCta.subtitle}</p>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                  {c.finalCta.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* FORMULÁRIO DE CONVERSÃO */}
        <SegmentLeadForm segmentName={page.name} />
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Video featured modal */}
      {videoOpen && featuredYouTubeId && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setVideoOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video bg-secondary rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setVideoOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center"><X className="w-5 h-5" /></button>
            <iframe src={`https://www.youtube.com/embed/${featuredYouTubeId}?autoplay=1&rel=0`} className="w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen title="Vídeo" />
          </div>
        </div>
      )}

      {/* Photo / video modal */}
      {photoModal && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPhotoModal(null)}>
          <div className="relative w-full max-w-5xl bg-secondary rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <button onClick={() => setPhotoModal(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center"><X className="w-5 h-5" /></button>
            {photoModal.startsWith('yt:') ? (
              <div className="aspect-video">
                <iframe src={`https://www.youtube.com/embed/${photoModal.slice(3)}?autoplay=1&rel=0`} className="w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen title="Vídeo" />
              </div>
            ) : (
              <img src={photoModal} alt="" className="w-full max-h-[85vh] object-contain" />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SegmentLandingPage;