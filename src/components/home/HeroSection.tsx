import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

const HeroSection = () => {
  const { content } = useHomeContent();
  const h = content.hero;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: '#040d28' }}>
      <div className="container-custom relative z-10 pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Headline with staggered lines */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              <h1 className="font-display mb-0">
                {h.headline1}{' '}
                <em className="text-gradient-neon">{h.headlineHighlight}</em>
              </h1>
            </motion.div>
            {h.headline2 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
              >
                <h1 className="font-display">{h.headline2}</h1>
              </motion.div>
            )}
          </div>

          <motion.p
            className="text-muted-foreground max-w-3xl mx-auto mb-10"
            style={{ fontSize: '18px' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {h.subtitle}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link to="/contato" className="btn-primary text-lg w-full sm:w-auto justify-center">
              {h.ctaPrimary}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/cases" className="btn-outline text-lg w-full sm:w-auto justify-center">
              {h.ctaSecondary}
            </Link>
          </motion.div>
        </div>

        {/* Pillars as numbered items */}
        <RevealSection className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border">
            {h.pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-8 border-b md:border-b-0 md:border-r border-border last:border-r-0 last:border-b-0"
              >
                <span className="font-display text-4xl" style={{ color: '#FF00CC' }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-4 mb-3">{pillar.title}</h3>
                <p className="text-muted-foreground">{pillar.description}</p>
              </div>
            ))}
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default HeroSection;
