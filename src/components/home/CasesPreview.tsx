import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useCases } from '@/hooks/useCases';
import { resolveVideoCover } from '@/lib/videoUtils';

const CasesPreview = () => {
  const { content } = useHomeContent();
  const c = content.casesPreview;
  const { data: cases = [] } = useCases({ homeOnly: true });
  if (cases.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">{c.badge}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {c.title} <span className="text-gradient-neon">{c.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {cases.slice(0, 4).map((caseItem) => {
            const cover = caseItem.hero_image_url || resolveVideoCover({ videoUrl: caseItem.hero_media_url, youtubeId: caseItem.hero_youtube_id });
            return (
              <Link key={caseItem.id} to={`/cases/${caseItem.slug}`} className="group glass-card overflow-hidden">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {cover ? (
                    <img src={cover} alt={caseItem.title} loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                    <span className="btn-primary flex items-center gap-2">Ver case <ExternalLink className="w-4 h-4" /></span>
                  </div>
                </div>
                <div className="p-3 md:p-6">
                  <span className="text-[10px] md:text-xs text-primary font-medium uppercase tracking-wider">{caseItem.client_name}</span>
                  <h3 className="font-display font-semibold text-sm md:text-xl mt-1 md:mt-2 mb-1 md:mb-2 group-hover:text-primary transition-colors line-clamp-2">{caseItem.title}</h3>
                  {caseItem.subtitle && <p className="text-muted-foreground text-xs md:text-sm line-clamp-2">{caseItem.subtitle}</p>}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <Link to="/cases" className="btn-outline inline-flex items-center gap-2">
            {c.cta}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CasesPreview;
