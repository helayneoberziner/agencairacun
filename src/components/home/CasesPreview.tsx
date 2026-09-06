import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';
import { useHomeContent } from '@/hooks/useHomeContent';
import { useCases } from '@/hooks/useCases';
import { resolveVideoCover } from '@/lib/videoUtils';

const CasesPreview = () => {
  const { content } = useHomeContent();
  const c = content.casesPreview;
  const { data: cases = [] } = useCases({ homeOnly: true });
  if (cases.length === 0) return null;

  return (
    <section className="section-padding relative overflow-hidden border-t border-border">
      <div className="container-custom">
        <SectionHeading
          eyebrow={c.badge}
          title={c.title}
          highlight={c.titleHighlight}
          subtitle={c.subtitle}
          action={
            <Link to="/cases" className="hidden md:inline-flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors group">
              {c.cta}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          }
        />

        <div className="grid-cards-2">
          {cases.slice(0, 4).map((caseItem) => {
            const cover = caseItem.hero_image_url || resolveVideoCover({ videoUrl: caseItem.hero_media_url, youtubeId: caseItem.hero_youtube_id });
            return (
              <Link key={caseItem.id} to={`/cases/${caseItem.slug}`} className="group rounded-xl border border-border overflow-hidden transition-colors hover:border-primary/40">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {cover ? (
                    <img src={cover} alt={caseItem.title} loading="lazy"
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="absolute inset-0 bg-secondary" />
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
