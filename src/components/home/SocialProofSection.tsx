import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClientLogos } from '@/hooks/useClientLogos';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useHomeContent } from '@/hooks/useHomeContent';
import RevealSection from '../RevealSection';

const SocialProofSection = () => {
  const { logos } = useClientLogos();
  const { testimonials } = useTestimonials();
  const { content } = useHomeContent();
  const sp = content.socialProof;
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const goNext = () => {
    if (testimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

  const goPrev = () => {
    if (testimonials.length > 0) {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  return (
    <section className="section-padding" style={{ background: '#080f2e' }}>
      <div className="container-custom">
        <RevealSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left */}
            <div>
              <span className="text-sm font-medium uppercase tracking-wider mb-4 block" style={{ color: '#FF00CC' }}>
                {sp.badge}
              </span>
              <h2 className="font-display mb-8">
                {sp.title} <em className="text-gradient-neon">{sp.titleHighlight}</em>
              </h2>

              <div className="space-y-4 mb-8">
                {sp.proofs.map((proof) => (
                  <p key={proof} className="text-muted-foreground">{proof}</p>
                ))}
              </div>

              {logos.length > 0 && (
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-4">Clientes que confiam na Racun:</p>
                  <div className="flex flex-wrap gap-4">
                    {logos.map((logo) => (
                      <div key={logo.id} className="w-24 h-12 rounded-sm border border-border flex items-center justify-center p-2 bg-secondary/30">
                        <img src={logo.image_url} alt={logo.name} className="max-h-full max-w-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Link to="/contato" className="btn-primary">
                {sp.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right — Testimonials */}
            <div>
              {testimonials.length > 0 ? (
                <div className="relative">
                  {/* Typographic quote mark */}
                  <span className="font-display absolute -top-8 left-0 select-none" style={{ fontSize: '120px', color: '#FF00CC', opacity: 0.4, lineHeight: 1 }}>
                    &ldquo;
                  </span>

                  <div className="pt-16">
                    <p className="font-display text-foreground mb-6" style={{ fontSize: 'clamp(20px, 2.5vw, 28px)', lineHeight: 1.3, fontStyle: 'normal' }}>
                      {testimonials[currentTestimonial]?.quote}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonials[currentTestimonial]?.name}
                      {testimonials[currentTestimonial]?.role && ` · ${testimonials[currentTestimonial].role}`}
                    </p>
                  </div>

                  {testimonials.length > 1 && (
                    <div className="flex gap-6 mt-8">
                      <button onClick={goPrev} className="text-foreground text-2xl hover:opacity-70 transition-opacity">&larr;</button>
                      <button onClick={goNext} className="text-foreground text-2xl hover:opacity-70 transition-opacity">&rarr;</button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-12 text-center text-muted-foreground">
                  <p>Depoimentos em breve.</p>
                </div>
              )}
            </div>
          </div>
        </RevealSection>
      </div>
    </section>
  );
};

export default SocialProofSection;
