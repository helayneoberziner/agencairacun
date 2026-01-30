import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, X, ExternalLink } from 'lucide-react';

interface CaseItem {
  id: number;
  title: string;
  objective: string;
  service: string;
  category: 'Conteúdo' | 'Tráfego' | 'Filme' | 'Restaurantes';
  context: string;
  whatWeDid: string[];
  deliverables: string[];
  learnings: string;
}

const Cases = () => {
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [filter, setFilter] = useState<string>('Todos');

  const cases: CaseItem[] = [
    {
      id: 1,
      title: 'Lançamento de Coleção',
      objective: 'Aumentar awareness e vendas da nova coleção',
      service: 'Conteúdo + Tráfego',
      category: 'Conteúdo',
      context: 'Marca de moda precisava lançar sua nova coleção de verão com impacto nas redes sociais.',
      whatWeDid: [
        'Sessão de fotos e vídeos com modelo',
        'Criação de 30 peças de conteúdo para Instagram',
        'Campanha de tráfego pago segmentada',
        'Landing page para a coleção',
      ],
      deliverables: ['20 fotos editoriais', '10 reels', 'Campanha Meta Ads', 'Landing page'],
      learnings: 'O conteúdo em formato reels teve 3x mais engajamento que fotos estáticas. A landing page dedicada aumentou significativamente a conversão.',
    },
    {
      id: 2,
      title: 'Filme Institucional',
      objective: 'Apresentar a empresa para investidores e parceiros',
      service: 'Filme',
      category: 'Filme',
      context: 'Indústria de grande porte precisava de um filme institucional premium para apresentações.',
      whatWeDid: [
        'Roteiro e direção criativa',
        'Captação em 4K nas instalações',
        'Entrevistas com diretoria',
        'Pós-produção completa',
      ],
      deliverables: ['Filme de 3 minutos', 'Versão resumida de 1 minuto', 'Cortes para redes sociais'],
      learnings: 'Mostrar os bastidores e o processo produtivo humanizou a marca e gerou mais conexão com o público.',
    },
    {
      id: 3,
      title: 'Campanha de Delivery',
      objective: 'Aumentar pedidos via aplicativo de delivery',
      service: 'Tráfego + Conteúdo',
      category: 'Restaurantes',
      context: 'Rede de hamburguerias queria aumentar os pedidos de delivery em 50%.',
      whatWeDid: [
        'Sessão de food photography',
        'Campanha de tráfego local',
        'Criativos para Meta Ads',
        'Promoções exclusivas para delivery',
      ],
      deliverables: ['15 fotos de pratos', '8 reels', 'Campanha Meta Ads', 'Material para apps de delivery'],
      learnings: 'Promoções com tempo limitado e gatilho de escassez geraram picos de pedidos significativos.',
    },
    {
      id: 4,
      title: 'Rebranding Digital',
      objective: 'Renovar a presença digital da marca',
      service: 'Conteúdo',
      category: 'Conteúdo',
      context: 'Marca de cosméticos precisava renovar sua identidade visual nas redes sociais.',
      whatWeDid: [
        'Nova linha editorial',
        'Templates e identidade visual',
        'Calendário de conteúdo mensal',
        'Diretrizes de marca para social',
      ],
      deliverables: ['Manual de identidade social', 'Calendário editorial', 'Templates editáveis', 'Primeiros 30 posts'],
      learnings: 'Uma identidade visual consistente aumentou o reconhecimento de marca e o engajamento.',
    },
    {
      id: 5,
      title: 'Evento Corporativo',
      objective: 'Documentar convenção anual da empresa',
      service: 'Filme',
      category: 'Filme',
      context: 'Empresa de tecnologia realizou sua convenção anual e precisava de registro completo.',
      whatWeDid: [
        'Cobertura completa do evento',
        'Entrevistas com participantes',
        'Fotos do evento',
        'Vídeo aftermovie',
      ],
      deliverables: ['Aftermovie de 5 minutos', '200+ fotos', 'Cortes para LinkedIn', 'Teaser para próximo ano'],
      learnings: 'Capturar depoimentos espontâneos dos participantes gerou conteúdo autêntico para comunicação interna.',
    },
    {
      id: 6,
      title: 'Geração de Leads B2B',
      objective: 'Gerar leads qualificados para software',
      service: 'Tráfego',
      category: 'Tráfego',
      context: 'Startup de SaaS precisava gerar leads qualificados para seu time comercial.',
      whatWeDid: [
        'Criação de landing page',
        'Campanha Google Ads',
        'Campanha LinkedIn Ads',
        'Automação de e-mails',
      ],
      deliverables: ['Landing page', 'Campanha Google Ads', 'Campanha LinkedIn Ads', 'Fluxo de automação'],
      learnings: 'LinkedIn Ads gerou leads mais qualificados que Google Ads para este segmento B2B específico.',
    },
  ];

  const categories = ['Todos', 'Conteúdo', 'Tráfego', 'Filme', 'Restaurantes'];

  const filteredCases = filter === 'Todos' 
    ? cases 
    : cases.filter(c => c.category === filter);

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

        {/* Cases Grid */}
        <section className="section-padding pt-8">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((caseItem) => (
                <div
                  key={caseItem.id}
                  onClick={() => setSelectedCase(caseItem)}
                  className="group glass-card overflow-hidden cursor-pointer"
                >
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-secondary" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/50 backdrop-blur-sm">
                      <span className="btn-primary flex items-center gap-2 text-sm">
                        Ver case <ExternalLink className="w-4 h-4" />
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <span className="text-xs text-primary font-medium uppercase tracking-wider">
                      {caseItem.service}
                    </span>
                    <h3 className="font-display font-semibold text-xl mt-2 mb-2 group-hover:text-primary transition-colors">
                      {caseItem.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {caseItem.objective}
                    </p>
                  </div>
                </div>
              ))}
            </div>
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

      {/* Case Modal */}
      {selectedCase && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setSelectedCase(null)}
        >
          <div 
            className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-6 border-b border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-primary font-medium uppercase tracking-wider">
                  {selectedCase.service}
                </span>
                <h2 className="font-display font-bold text-2xl">{selectedCase.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedCase(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {/* Context */}
              <div>
                <h3 className="font-display font-semibold text-lg mb-2 text-primary">Contexto</h3>
                <p className="text-muted-foreground">{selectedCase.context}</p>
              </div>

              {/* What we did */}
              <div>
                <h3 className="font-display font-semibold text-lg mb-3 text-primary">O que fizemos</h3>
                <ul className="space-y-2">
                  {selectedCase.whatWeDid.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Deliverables */}
              <div>
                <h3 className="font-display font-semibold text-lg mb-3 text-primary">Entregas</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.deliverables.map((item, i) => (
                    <span 
                      key={i} 
                      className="px-3 py-1 text-sm rounded-full bg-white/5 border border-white/10"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Learnings */}
              <div>
                <h3 className="font-display font-semibold text-lg mb-2 text-primary">Aprendizados</h3>
                <p className="text-muted-foreground">{selectedCase.learnings}</p>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-white/10">
                <Link 
                  to="/contato" 
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  onClick={() => setSelectedCase(null)}
                >
                  Quero um case assim
                  <ArrowRight className="w-4 h-4" />
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
