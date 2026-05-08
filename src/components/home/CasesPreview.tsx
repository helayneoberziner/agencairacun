import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ArrowRight, ExternalLink } from 'lucide-react';
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
    <section className="section-padding relative overflow-hidden">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-primary text-sm font-medium uppercase tracking-wider mb-4 block">{c.badge}</span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
            {c.title} <span className="text-gradient-neon">{c.titleHighlight}</span>
          </h2>
          <p className="text-muted-foreground text-lg">{c.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cases.map((caseItem) => (
            <Link key={caseItem.id} to={`/cases/${caseItem.slug ?? caseItem.id}`} className="group glass-card overflow-hidden">
              <div className="aspect-video relative overflow-hidden">
                {caseItem.image_url ? (
                  <img src={caseItem.image_url} alt={caseItem.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary" />
                )}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                  <span className="btn-primary flex items-center gap-2">Ver case <ExternalLink className="w-4 h-4" /></span>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs text-primary font-medium uppercase tracking-wider">{caseItem.category}</span>
                <h3 className="font-display font-semibold text-xl mt-2 mb-2 group-hover:text-primary transition-colors">{caseItem.title}</h3>
                {caseItem.description && <p className="text-muted-foreground text-sm">{caseItem.description}</p>}
              </div>
            </Link>
          ))}
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
