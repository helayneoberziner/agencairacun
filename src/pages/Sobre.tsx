import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import CustomCursor from '@/components/CustomCursor';
import RevealSection from '@/components/RevealSection';
import { ArrowRight } from 'lucide-react';
import { useSobreContent } from '@/hooks/useSobreContent';
import { motion } from 'framer-motion';

const Sobre = () => {
  const { content, isLoading } = useSobreContent();

  if (isLoading) return <div className="min-h-screen bg-background"><Header /><div className="flex items-center justify-center h-96"><p className="text-muted-foreground">Carregando...</p></div><Footer /></div>;

  return (
    <div className="min-h-screen bg-background grain">
      <CustomCursor />
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-32 pb-20" style={{ background: '#040d28' }}>
          <div className="container-custom">
            <div className="max-w-4xl">
              <motion.h1 className="font-display mb-6" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                {content.hero.title} <em className="text-gradient-neon">{content.hero.titleHighlight}</em>
              </motion.h1>
              <motion.p className="text-muted-foreground" style={{ fontSize: '18px' }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
                {content.hero.subtitle}
              </motion.p>
            </div>
          </div>
        </section>

        {/* Story */}
        <section className="section-padding">
          <div className="container-custom">
            <RevealSection>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                  <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>
                    {content.story.label}
                  </span>
                  <h2 className="font-display mb-6">
                    {content.story.title}{' '}
                    <em className="text-gradient-neon">{content.story.titleHighlight}</em>
                  </h2>
                  <div className="space-y-4 text-muted-foreground">
                    {content.story.paragraphs.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {content.story.stats.map((stat, i) => (
                    <div key={i} className="p-6 border border-border rounded-sm text-center">
                      <div className="font-display text-4xl" style={{ color: '#FF00CC' }}>{stat.value}</div>
                      <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </RevealSection>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding" style={{ background: '#080f2e' }}>
          <div className="container-custom">
            <RevealSection>
              <div className="max-w-3xl mb-16">
                <h2 className="font-display mb-6">
                  {content.values.title} <em className="text-gradient-neon">{content.values.titleHighlight}</em>
                </h2>
                <p className="text-muted-foreground" style={{ fontSize: '18px' }}>{content.values.subtitle}</p>
              </div>
            </RevealSection>
            <RevealSection>
              <div className="divide-y divide-border">
                {content.values.items.map((value, i) => (
                  <div key={i} className="py-8 flex items-start gap-8 group transition-colors duration-200 hover:bg-secondary/30 px-4 -mx-4 rounded-sm">
                    <span className="font-display text-4xl flex-shrink-0" style={{ color: '#FF00CC' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-display mb-3">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
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

export default Sobre;
