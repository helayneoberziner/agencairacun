import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import RevealSection from '@/components/RevealSection';
import { ArrowRight, X, ExternalLink, Youtube, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  category: string;
  description: string | null;
  context: string | null;
  actions: string | null;
  results: string | null;
  deliveries: string[] | null;
  image_url: string | null;
  video_url: string | null;
  is_featured: boolean;
}

const Cases = () => {
  const [selectedCase, setSelectedCase] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>('Todos');

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('display_order', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  const categories = ['Todos', ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = filter === 'Todos' ? projects : projects.filter(p => p.category === filter);

  const getYoutubeEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  return (
    <div className="min-h-screen bg-background grain">
      <CustomCursor />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20" style={{ background: '#040d28' }}>
          <div className="container-custom text-center">
            <motion.h1 className="font-display mb-6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              Nossos <em className="text-gradient-neon">Cases</em>
            </motion.h1>
            <motion.p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: '18px' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              Conheça alguns dos projetos que desenvolvemos e os resultados que entregamos.
            </motion.p>
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
                    className="px-6 py-2 rounded-sm text-sm font-medium transition-all duration-200"
                    style={{
                      background: filter === category ? '#FF00CC' : 'transparent',
                      color: filter === category ? '#040d28' : 'hsl(215 16% 55%)',
                      border: filter === category ? 'none' : '1px solid hsl(225 15% 15%)',
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grid */}
        <section className="section-padding pt-8">
          <div className="container-custom">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#FF00CC' }} />
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground" style={{ fontSize: '18px' }}>
                  {projects.length === 0 ? 'Novos projetos em breve!' : 'Nenhum projeto encontrado nesta categoria.'}
                </p>
              </div>
            ) : (
              <RevealSection>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedCase(project)}
                      className="group cursor-pointer border border-border rounded-sm overflow-hidden transition-colors duration-200 hover:bg-secondary/40"
                    >
                      <div className="aspect-video relative overflow-hidden">
                        {project.image_url ? (
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-400"
                          />
                        ) : (
                          <div className="absolute inset-0" style={{ background: '#0d1540' }} />
                        )}
                        {project.video_url && (
                          <div className="absolute top-3 right-3 p-2 rounded-sm bg-red-600">
                            <Youtube className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50">
                          <span className="btn-primary text-sm"><ExternalLink className="w-4 h-4" /> Ver case</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#FF00CC' }}>{project.category}</span>
                        <h3 className="font-display mt-2 mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                        {project.description && <p className="text-muted-foreground text-sm line-clamp-2">{project.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </RevealSection>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="border border-border rounded-sm p-12 text-center" style={{ background: '#080f2e' }}>
                <h2 className="font-display mb-6">
                  Quer um case <em className="text-gradient-neon">assim?</em>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
                  Vamos conversar sobre como podemos criar resultados similares para o seu negócio.
                </p>
                <Link to="/contato" className="btn-primary">
                  Solicitar proposta
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setSelectedCase(null)}>
          <div className="max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-border rounded-sm" style={{ background: '#080f2e' }} onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 p-6 border-b border-border flex items-center justify-between" style={{ background: '#080f2eee' }}>
              <div>
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#FF00CC' }}>{selectedCase.category}</span>
                <h2 className="font-display" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)' }}>{selectedCase.title}</h2>
              </div>
              <button onClick={() => setSelectedCase(null)} className="p-2 hover:bg-white/10 rounded-sm transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-8">
              {selectedCase.video_url && (
                <div className="aspect-video rounded-sm overflow-hidden bg-black">
                  {getYoutubeEmbedUrl(selectedCase.video_url) ? (
                    <iframe src={getYoutubeEmbedUrl(selectedCase.video_url)!} title={selectedCase.title} className="w-full h-full" allowFullScreen />
                  ) : (
                    <a href={selectedCase.video_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center h-full text-primary hover:underline">Ver vídeo</a>
                  )}
                </div>
              )}
              {selectedCase.context && <div><h3 className="font-display mb-2" style={{ color: '#FF00CC' }}>Contexto</h3><p className="text-muted-foreground">{selectedCase.context}</p></div>}
              {selectedCase.actions && <div><h3 className="font-display mb-3" style={{ color: '#FF00CC' }}>O que fizemos</h3><p className="text-muted-foreground whitespace-pre-wrap">{selectedCase.actions}</p></div>}
              {selectedCase.deliveries && selectedCase.deliveries.length > 0 && (
                <div><h3 className="font-display mb-3" style={{ color: '#FF00CC' }}>Entregas</h3>
                  <div className="flex flex-wrap gap-2">{selectedCase.deliveries.map((item, i) => <span key={i} className="px-3 py-1 text-sm rounded-sm border border-border">{item}</span>)}</div>
                </div>
              )}
              {selectedCase.results && <div><h3 className="font-display mb-2" style={{ color: '#FF00CC' }}>Resultados</h3><p className="text-muted-foreground whitespace-pre-wrap">{selectedCase.results}</p></div>}
              <div className="pt-4 border-t border-border">
                <Link to="/contato" className="btn-primary w-full justify-center" onClick={() => setSelectedCase(null)}>
                  Quero um case assim <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Cases;
