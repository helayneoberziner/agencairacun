import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight } from 'lucide-react';
import { useHomeContent } from '@/hooks/useHomeContent';

const CasesPreview = () => {
  const { content } = useHomeContent();
  const c = content.casesPreview;

  const { data: cases = [] } = useQuery({
    queryKey: ['cases-preview'],
    queryFn: async () => {
      const { data } = await supabase
        .from('projects')
        .select('id,slug,title,category,description,image_url')
        .order('display_order', { ascending: true })
        .limit(4);
      return data ?? [];
    },
  });

  if (cases.length === 0) return null;

  return (
    <section className="section-padding border-t border-white/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 md:mb-28">
          <div className="lg:col-span-3">
            <p className="text-eyebrow">{c.badge}</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-display text-4xl md:text-6xl lg:text-7xl max-w-3xl">
              {c.title} <span className="italic text-primary">{c.titleHighlight}</span>
            </h2>
            <p className="text-foreground/70 text-lg mt-6 max-w-2xl font-light">{c.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16 md:gap-y-24">
          {cases.map((caseItem, idx) => (
            <Link
              key={caseItem.id}
              to={`/cases/${caseItem.slug ?? caseItem.id}`}
              className={`group block ${idx % 2 === 1 ? 'md:mt-24' : ''}`}
            >
              <div className="overflow-hidden mb-6 aspect-[4/5]">
                {caseItem.image_url ? (
                  <img
                    src={caseItem.image_url}
                    alt={caseItem.title}
                    loading="lazy"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.04] transition-all duration-1000 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/5" />
                )}
              </div>
              <p className="text-eyebrow mb-3">{caseItem.category}</p>
              <h3 className="text-display text-2xl md:text-4xl group-hover:text-primary transition-colors duration-500 mb-3">
                {caseItem.title}
              </h3>
              {caseItem.description && (
                <p className="text-foreground/60 font-light max-w-md">{caseItem.description}</p>
              )}
              <span className="inline-flex items-center gap-2 mt-4 text-xs uppercase tracking-[0.25em] text-foreground/60 group-hover:text-primary transition-colors">
                Ver projeto <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>

        <div className="text-center mt-24 md:mt-32">
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
