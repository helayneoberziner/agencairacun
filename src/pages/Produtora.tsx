import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import RevealSection from '@/components/RevealSection';
import { ArrowRight, Play, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

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

const bastidoresCount = 6;

const Produtora = () => {
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [openService, setOpenService] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [portfolioModal, setPortfolioModal] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background grain">
      <CustomCursor />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#040d28' }}>
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <motion.h1 className="font-display mb-6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              Vídeo com <em className="text-gradient-neon">propósito.</em>
            </motion.h1>
            <motion.p className="text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ fontSize: '18px' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              Não é só vídeo bonito. É vídeo que trabalha pela sua marca.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <button onClick={() => setShowreelOpen(true)} className="btn-primary text-lg px-8 py-4">
                <Play className="w-5 h-5" /> Ver showreel
              </button>
            </motion.div>
          </div>
        </section>

        {/* Services accordion */}
        <section className="section-padding">
          <div className="container-custom max-w-4xl">
            <RevealSection>
              <h2 className="font-display mb-4">
                O que a gente <em className="text-gradient-neon">faz.</em>
              </h2>
              <p className="text-muted-foreground mb-12" style={{ fontSize: '18px' }}>
                Cada projeto é único. Aqui estão as especialidades que dominamos.
              </p>
              <div className="divide-y divide-border">
                {services.map((s, i) => (
                  <div key={i}>
                    <button onClick={() => setOpenService(openService === i ? null : i)} className="w-full flex items-center justify-between py-6 text-left group">
                      <div className="flex items-center gap-6">
                        <span className="font-display text-sm" style={{ color: '#FF00CC' }}>{s.num}</span>
                        <span className="font-display group-hover:text-primary transition-colors" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)' }}>{s.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openService === i ? 'rotate-180' : ''}`} style={openService === i ? { color: '#FF00CC' } : {}} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openService === i ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                      <p className="text-muted-foreground pl-14 pr-8">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Portfolio */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom">
            <RevealSection>
              <h2 className="font-display mb-4 text-center">
                Nosso <em className="text-gradient-neon">trabalho.</em>
              </h2>
              <p className="text-muted-foreground mb-12 text-center max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
                Projetos que unem estética cinematográfica e estratégia de marca.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolioItems.map((item, i) => (
                  <div key={i} onClick={() => setPortfolioModal(i)} className="group cursor-pointer border border-border rounded-sm overflow-hidden">
                    <div className="aspect-video relative overflow-hidden" style={{ background: '#0d1540' }}>
                      {/* Placeholder: substitua por thumbnail real */}
                      <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-400" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-background/40">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#FF00CC' }}>
                          <Play className="w-6 h-6 ml-0.5" style={{ color: '#040d28' }} />
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-display group-hover:text-primary transition-colors" style={{ fontSize: '18px' }}>{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.client}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Segments */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <h2 className="font-display mb-12 text-center">
                Segmentos que <em className="text-gradient-neon">atendemos.</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 border-t border-l border-border">
                {segments.map((seg, i) => (
                  <div key={i} className="p-6 text-center border-b border-r border-border">
                    <h4 className="font-display mb-2" style={{ fontSize: '18px' }}>{seg.title}</h4>
                    <p className="text-sm text-muted-foreground">{seg.desc}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Process */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom">
            <RevealSection>
              <h2 className="font-display mb-12 text-center">
                Nosso <em className="text-gradient-neon">processo.</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0 border-t border-border">
                {processSteps.map((step, i) => (
                  <div key={i} className="p-6 text-center border-b lg:border-b-0 lg:border-r border-border last:border-r-0 last:border-b-0">
                    <span className="font-display text-3xl block mb-3" style={{ color: '#FF00CC', opacity: 0.4 }}>{i + 1}</span>
                    <span className="font-display text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Bastidores */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <h2 className="font-display mb-12 text-center">
                <em className="text-gradient-neon">Bastidores.</em>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Array.from({ length: bastidoresCount }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-sm overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-400" style={{ background: '#0d1540' }}>
                    {/* Placeholder: substitua por foto de bastidores */}
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom max-w-3xl">
            <RevealSection>
              <h2 className="font-display mb-12 text-center">
                Perguntas <em className="text-gradient-neon">frequentes.</em>
              </h2>
              <div>
                {faqItems.map((faq, i) => (
                  <div key={i} className="border-b border-border">
                    <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between py-5 text-left group">
                      <span className="font-medium group-hover:text-primary transition-colors pr-4" style={{ fontSize: '18px' }}>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} style={openFaq === i ? { color: '#FF00CC' } : {}} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="border border-border rounded-sm p-12 md:p-16 text-center" style={{ background: '#080f2e' }}>
                <h2 className="font-display mb-6">
                  Vamos criar algo <em className="text-gradient-neon">incrível?</em>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>
                  Conte com a Racun Filmes para transformar a comunicação da sua marca com vídeos de alto impacto.
                </p>
                <Link to="/contato" className="btn-primary text-lg px-8 py-4">
                  Orçar um projeto audiovisual
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />

      {/* Showreel Modal */}
      {showreelOpen && (
        <div className="fixed inset-0 z-[100] bg-background/90 flex items-center justify-center p-4" onClick={() => setShowreelOpen(false)}>
          <div className="relative w-full max-w-5xl aspect-video rounded-sm overflow-hidden border border-border" style={{ background: '#040d28' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowreelOpen(false)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-sm flex items-center justify-center text-foreground hover:bg-white/10 transition-colors" style={{ background: '#040d28cc' }}>
              <X className="w-5 h-5" />
            </button>
            {/* Placeholder: substitua por player de vídeo */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              <Play className="w-16 h-16" />
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Modal */}
      {portfolioModal !== null && (
        <div className="fixed inset-0 z-[100] bg-background/90 flex items-center justify-center p-4" onClick={() => setPortfolioModal(null)}>
          <div className="relative w-full max-w-4xl aspect-video rounded-sm overflow-hidden border border-border" style={{ background: '#040d28' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPortfolioModal(null)} className="absolute top-4 right-4 z-10 w-10 h-10 rounded-sm flex items-center justify-center text-foreground hover:bg-white/10 transition-colors" style={{ background: '#040d28cc' }}>
              <X className="w-5 h-5" />
            </button>
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
