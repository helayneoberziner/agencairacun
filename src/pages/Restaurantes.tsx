import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import RevealSection from '@/components/RevealSection';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useRestaurantesContent } from '@/hooks/useRestaurantesContent';
import { motion } from 'framer-motion';

const Restaurantes = () => {
  const { content } = useRestaurantesContent();

  return (
    <div className="min-h-screen bg-background grain">
      <CustomCursor />
      <Header />

      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20" style={{ background: '#040d28' }}>
          <div className="container-custom relative z-10 py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                  <h1 className="font-display mb-6">
                    {content.hero.title}{' '}
                    <em className="text-gradient-neon">{content.hero.titleHighlight}</em>
                  </h1>
                </motion.div>
                <motion.p className="text-muted-foreground mb-10" style={{ fontSize: '18px' }}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                  {content.hero.subtitle}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <Link to="/contato" className="btn-primary">
                    {content.hero.ctaText} <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </div>
              <div className="aspect-square rounded-sm overflow-hidden border border-border" style={{ background: '#0d1540' }}>
                {/* Placeholder: substitua por imagem */}
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="max-w-3xl mb-16">
                <h2 className="font-display mb-6">
                  {content.deliverables.sectionTitle} <em className="text-gradient-neon">{content.deliverables.sectionTitleHighlight}</em>
                </h2>
                <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{content.deliverables.sectionSubtitle}</p>
              </div>
            </RevealSection>
            <RevealSection>
              <div className="divide-y divide-border">
                {content.deliverables.items.map((item, index) => (
                  <div key={index} className="py-8 flex items-start gap-8 group transition-colors duration-200 hover:bg-secondary/30 px-4 -mx-4 rounded-sm">
                    <span className="font-display text-4xl flex-shrink-0" style={{ color: '#FF00CC' }}>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display mb-3">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Month Flow */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom">
            <RevealSection>
              <div className="max-w-3xl mb-16">
                <h2 className="font-display mb-6">
                  {content.monthFlow.sectionTitle} <em className="text-gradient-neon">{content.monthFlow.sectionTitleHighlight}</em>
                </h2>
                <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{content.monthFlow.sectionSubtitle}</p>
              </div>
            </RevealSection>
            <RevealSection>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-border">
                {content.monthFlow.items.map((step, index) => (
                  <div key={index} className="p-8 border-b lg:border-b-0 lg:border-r border-border last:border-r-0 last:border-b-0">
                    <span className="text-xs font-medium uppercase tracking-wider" style={{ color: '#FF00CC' }}>{step.week}</span>
                    <h4 className="font-display mt-2 mb-2" style={{ fontSize: '18px' }}>{step.title}</h4>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Content Pillars & Traffic */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                  <h2 className="font-display mb-6">
                    {content.contentPillars.title} <em className="text-gradient-neon">{content.contentPillars.titleHighlight}</em>
                  </h2>
                  <p className="text-muted-foreground mb-8" style={{ fontSize: '18px' }}>{content.contentPillars.subtitle}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {content.contentPillars.items.map((pillar, index) => (
                      <div key={index} className="p-4 border border-border rounded-sm">
                        <h4 className="font-medium text-foreground mb-1">{pillar.title}</h4>
                        <p className="text-sm text-muted-foreground">{pillar.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="font-display mb-6">
                    {content.trafficBenefits.title} <em className="text-gradient-neon">{content.trafficBenefits.titleHighlight}</em>
                  </h2>
                  <p className="text-muted-foreground mb-8" style={{ fontSize: '18px' }}>{content.trafficBenefits.subtitle}</p>
                  <ul className="space-y-3">
                    {content.trafficBenefits.items.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: '#FF00CC' }} />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom">
            <RevealSection>
              <div className="border border-border rounded-sm p-12 text-center" style={{ background: '#0d1540' }}>
                <h2 className="font-display mb-6">
                  {content.cta.title} <em className="text-gradient-neon">{content.cta.titleHighlight}</em>
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto" style={{ fontSize: '18px' }}>{content.cta.subtitle}</p>
                <Link to="/contato" className="btn-primary">
                  {content.cta.ctaText} <ArrowRight className="w-4 h-4" />
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

export default Restaurantes;
