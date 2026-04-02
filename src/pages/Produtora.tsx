import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { ArrowRight, Play, X, ChevronDown } from 'lucide-react';

/* ──────────────────────────────────────────────
   Dados estáticos — substitua placeholders aqui
   ────────────────────────────────────────────── */

const services = [
  { num: '01', title: 'Vídeos Institucionais', desc: 'Apresente a essência da sua empresa com narrativa envolvente e produção cinematográfica.' },
  { num: '02', title: 'Campanhas Publicitárias', desc: 'Criação completa de peças audiovisuais para campanhas de alto impacto.' },
  { num: '03', title: 'Conteúdo para Redes Sociais', desc: 'Vídeos estratégicos pensados para engajar, converter e posicionar sua marca online.' },
  { num: '04', title: 'Vídeos Imobiliários', desc: 'Tours cinematográficos que valorizam cada detalhe do seu empreendimento.' },
  { num: '05', title: 'Cobertura de Eventos', desc: 'Captação profissional que transforma momentos em conteúdo memorável.' },
  { num: '06', title: 'Conteúdo para Tráfego Pago', desc: 'Vídeos otimizados para performance em plataformas de anúncios.' },
];

const segments = [
  { title: 'Imobiliário', desc: 'Tours e lançamentos que vendem.' },
  { title: 'Empresas', desc: 'Vídeos que contam sua história.' },
  { title: 'Restaurantes', desc: 'Gastronomia em alta definição.' },
  { title: 'Eventos', desc: 'Momentos que merecem ser vistos.' },
  { title: 'Marcas', desc: 'Posicionamento visual premium.' },
];

const processSteps = ['Briefing', 'Roteiro', 'Captação', 'Direção', 'Pós-produção', 'Entrega'];

/* Placeholder: substitua por URLs reais */
const portfolioItems = [
  { title: 'Campanha Verão 2024', client: 'Cliente' },
  { title: 'Institucional Corporativo', client: 'Cliente' },
  { title: 'Tour Imobiliário', client: 'Cliente' },
  { title: 'Conteúdo Social', client: 'Cliente' },
  { title: 'Cobertura de Evento', client: 'Cliente' },
  { title: 'Campanha Digital', client: 'Cliente' },
];

const faqItems = [
  { q: 'Vocês criam o roteiro?', a: 'Sim! Desenvolvemos o roteiro do zero, alinhado ao seu objetivo e ao público da sua marca.' },
  { q: 'Qual o prazo médio de entrega?', a: 'Depende do escopo, mas a maioria dos projetos é entregue entre 7 e 15 dias úteis após a captação.' },
  { q: 'Os vídeos podem ser usados em anúncios pagos?', a: 'Com certeza. Entregamos nos formatos e proporções ideais para cada plataforma de mídia paga.' },
  { q: 'Vocês atendem fora de Blumenau?', a: 'Sim, atendemos em todo o Brasil. Já produzimos em diversas cidades e estados.' },
  { q: 'Vocês trabalham com contrato?', a: 'Sim, todos os projetos são formalizados com contrato para segurança de ambas as partes.' },
];

/* Placeholder: substitua por URLs reais de bastidores */
const bastidoresCount = 6;

const Produtora = () => {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [openService, setOpenService] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* ═══ HERO — vídeo fullscreen ═══ */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Placeholder: substitua pelo <video> com src do showreel */}
          <div className="absolute inset-0 bg-secondary/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
              Vídeo com <span className="text-gradient-neon">propósito.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Não é só vídeo bonito. É vídeo que trabalha pela sua marca.
            </p>
            <button
              onClick={() => setShowreelOpen(true)}
              className="btn-primary inline-flex items-center gap-3 text-lg px-8 py-4"
            >
              <Play className="w-5 h-5" />
              Ver showreel
            </button>
          </div>
        </section>

        {/* ═══ SERVIÇOS — accordion numerado ═══ */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
              O que a gente <span className="text-gradient-neon">faz.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12">
              Cada projeto é único. Aqui estão as especialidades que dominamos.
            </p>

            <div className="divide-y divide-white/10">
              {services.map((s, i) => (
                <div key={i}>
                  <button
                    onClick={() => setOpenService(openService === i ? null : i)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <div className="flex items-center gap-6">
                      <span className="text-sm font-mono text-primary">{s.num}</span>
                      <span className="text-xl md:text-2xl font-display font-semibold group-hover:text-primary transition-colors">
                        {s.title}
                      </span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openService === i ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openService === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                    <p className="text-muted-foreground pl-14 pr-8">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PORTFÓLIO — grid grayscale → color ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-center">
              <span className="text-gradient-neon">Nosso trabalho.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-12 text-center max-w-2xl mx-auto">
              Projetos que unem estética cinematográfica e estratégia de marca.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setPortfolioModal(i)}
                  className="group cursor-pointer glass-card overflow-hidden"
                >
                  <div className="aspect-video relative overflow-hidden">
                    {/* Placeholder: substitua por <img> com thumbnail real */}
                    <div className="absolute inset-0 bg-gradient-to-br from-muted/40 to-secondary grayscale group-hover:grayscale-0 transition-all duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/40 backdrop-blur-sm">
                      <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center">
                        <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-display font-medium group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.client}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SEGMENTOS ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              Segmentos que <span className="text-gradient-neon">atendemos.</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {segments.map((seg, i) => (
                <div key={i} className="glass-card p-6 text-center hover:border-primary/30 transition-colors">
                  <h4 className="font-display font-semibold text-lg mb-2">{seg.title}</h4>
                  <p className="text-sm text-muted-foreground">{seg.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ PROCESSO — timeline ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              Nosso <span className="text-gradient-neon">processo.</span>
            </h2>
            <div className="relative">
              {/* Linha horizontal desktop */}
              <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {processSteps.map((step, i) => (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center mb-4 relative z-10">
                      <span className="text-sm font-bold text-primary">{i + 1}</span>
                    </div>
                    <span className="font-display font-medium text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BASTIDORES — grid grayscale ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              <span className="text-gradient-neon">Bastidores.</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: bastidoresCount }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-secondary/40 border border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
                  {/* Placeholder: substitua por <img> com foto de bastidores */}
                  <div className="w-full h-full bg-gradient-to-br from-muted/30 to-secondary/60" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ — accordion clean ═══ */}
        <section className="section-padding bg-secondary/20">
          <div className="container-custom max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-12 text-center">
              Perguntas <span className="text-gradient-neon">frequentes.</span>
            </h2>
            <div>
              {faqItems.map((faq, i) => (
                <div key={i} className="border-b border-white/10">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between py-5 text-left group"
                  >
                    <span className="text-lg font-medium group-hover:text-primary transition-colors pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-primary' : ''}`} />
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ CTA FINAL ═══ */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="glass-card p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-accent/10" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                  Vamos criar algo <span className="text-gradient-neon">incrível?</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                  Conte com a Racun Filmes para transformar a comunicação da sua marca com vídeos de alto impacto.
                </p>
                <Link to="/contato" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
                  Orçar um projeto audiovisual
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* ═══ MODAL SHOWREEL ═══ */}
      {showreelOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setShowreelOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video bg-secondary rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowreelOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
            {/* Placeholder: substitua por <iframe> ou <video> com o showreel real */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Play className="w-16 h-16" />
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL PORTFÓLIO ═══ */}
      {portfolioModal !== null && (
        <div className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setPortfolioModal(null)}>
          <div className="relative w-full max-w-4xl aspect-video bg-secondary rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPortfolioModal(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-background/50 flex items-center justify-center text-foreground hover:bg-background/80 transition-colors">
              <X className="w-5 h-5" />
            </button>
            {/* Placeholder: substitua por player de vídeo real */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground flex-col gap-2">
              <Play className="w-12 h-12" />
              <span className="text-sm">{portfolioItems[portfolioModal]?.title}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Produtora;
