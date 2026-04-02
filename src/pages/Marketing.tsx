import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import RevealSection from '@/components/RevealSection';
import { ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useMarketingContent } from '@/hooks/useMarketingContent';
import { motion } from 'framer-motion';

const Marketing = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { content, isLoading } = useMarketingContent();

  if (isLoading) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Carregando...</p></div><Footer /></div>;

  return (
    <div className="min-h-screen bg-background grain">
      <CustomCursor />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20" style={{ background: '#040d28' }}>
          <div className="container-custom relative z-10 text-center py-20">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="font-display mb-6 max-w-4xl mx-auto">
                {content.hero.title}{' '}
                <em className="text-gradient-neon">{content.hero.titleHighlight}</em>
              </h1>
            </motion.div>
            <motion.p className="text-muted-foreground max-w-2xl mx-auto mb-10" style={{ fontSize: '18px' }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
              {content.hero.subtitle}
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <Link to="/contato" className="btn-primary">
                {content.hero.ctaText}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#servicos" className="btn-outline">{content.hero.secondaryCtaText}</a>
            </motion.div>
          </div>
        </section>

        {/* Services */}
        <section id="servicos" className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="max-w-3xl mb-16">
                <h2 className="font-display mb-6">
                  {content.services.sectionTitle} <em className="text-gradient-neon">{content.services.sectionTitleHighlight}</em>
                </h2>
                <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{content.services.sectionSubtitle}</p>
              </div>
            </RevealSection>

            <RevealSection>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {content.services.items.map((service, i) => (
                  <div key={i} className="border border-border rounded-sm p-8 transition-colors duration-200 hover:bg-secondary/40">
                    <span className="font-display text-4xl block mb-4" style={{ color: '#FF00CC' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, fi) => (
                        <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4" style={{ color: '#FF00CC' }} />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Results */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom">
            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>
                    {content.results.label}
                  </span>
                  <h2 className="font-display mb-6">
                    {content.results.title} <em className="text-gradient-neon">{content.results.titleHighlight}</em>
                  </h2>
                  <p className="text-muted-foreground mb-8" style={{ fontSize: '18px' }}>{content.results.subtitle}</p>
                  <ul className="space-y-4">
                    {content.results.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-foreground">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#FF00CC' }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-border rounded-sm p-8" style={{ background: '#0d1540' }}>
                  <h4 className="font-display mb-1">{content.results.dashboardTitle}</h4>
                  <p className="text-sm text-muted-foreground mb-6">{content.results.dashboardSubtitle}</p>
                  <div className="aspect-video rounded-sm border border-border flex items-center justify-center" style={{ background: '#040d28' }}>
                    <span className="text-muted-foreground text-sm">Preview do painel</span>
                  </div>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Modalities */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="max-w-3xl mx-auto text-center mb-16">
                <h2 className="font-display mb-6">
                  {content.modalities.sectionTitle} <em className="text-gradient-neon">{content.modalities.sectionTitleHighlight}</em>
                </h2>
                <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{content.modalities.sectionSubtitle}</p>
              </div>
            </RevealSection>
            <RevealSection>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border">
                {content.modalities.items.map((modality, i) => (
                  <div key={i} className="p-8 border-b md:border-b-0 md:border-r border-border last:border-r-0 last:border-b-0 text-center">
                    <h3 className="font-display mb-4">{modality.title}</h3>
                    <p className="text-muted-foreground">{modality.description}</p>
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
              <div className="mb-16">
                <h2 className="font-display mb-6">
                  {content.faqs.sectionTitle} <em className="text-gradient-neon">{content.faqs.sectionTitleHighlight}</em>
                </h2>
              </div>
            </RevealSection>
            <RevealSection>
              <div>
                {content.faqs.items.map((faq, index) => (
                  <div key={index} className="border-b border-border">
                    <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full py-5 flex items-center justify-between text-left group">
                      <span className="font-medium group-hover:text-primary transition-colors pr-4">{faq.question}</span>
                      <ChevronDown className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-40 pb-5' : 'max-h-0'}`}>
                      <p className="text-muted-foreground">{faq.answer}</p>
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
              <div className="border border-border rounded-sm p-12 text-center" style={{ background: '#080f2e' }}>
                <h2 className="font-display mb-6">
                  {content.cta.title} <em className="text-gradient-neon">{content.cta.titleHighlight}</em>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>{content.cta.subtitle}</p>
                <Link to="/contato" className="btn-primary">
                  {content.cta.ctaText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealSection>
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Marketing;
