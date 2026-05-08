import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, ExternalLink, Youtube, Loader2 } from 'lucide-react';

interface Project {
  id: string;
  slug: string | null;
  title: string;
  category: string;
  description: string | null;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
}

const Cases = () => {
  const [filter, setFilter] = useState<string>('Todos');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('id,slug,title,category,description,image_url,video_url,is_featured,display_order')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  // Extract unique categories from projects
  const categories = ['Todos', ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = filter === 'Todos' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero */}
        <section className="pt-32 pb-20">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Nossos <span className="text-gradient-neon">Cases</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conheça alguns dos projetos que desenvolvemos e os resultados que entregamos.
            </p>
          </div>
        </section>

        {/* Filter */}
      {categories.length > 1 && (
        <section className="pb-8">
          <div className="container-custom">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    filter === category
                      ? 'bg-primary text-primary-foreground neon-glow'
                      : 'bg-white/5 text-muted-foreground hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            </div>
        </section>
      )}

        {/* Cases Grid */}
        <section className="section-padding pt-8">
          <div className="container-custom">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                {projects.length === 0 
                  ? 'Novos projetos em breve!' 
                  : 'Nenhum projeto encontrado nesta categoria.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/cases/${project.slug ?? project.id}`}
                  className="group glass-card overflow-hidden block"
                >
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden">
                    {project.image_url ? (
                      <img 
                        src={project.image_url} 
                        alt={project.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary" />
                    )}
                    {project.video_url && (
                      <div className="absolute top-3 right-3 p-2 rounded-lg bg-red-600">
                        <Youtube className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                      <span className="btn-primary flex items-center gap-2 text-sm">
                        Ver case <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                    </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h3 className="font-display font-semibold text-xl mt-2 mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    {project.description && (
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {project.description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-mesh opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Quer um case <span className="text-gradient-neon">assim?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Vamos conversar sobre como podemos criar resultados similares para o seu negócio.
                </p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
                  Solicitar proposta
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cases;
