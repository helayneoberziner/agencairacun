import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useClientLogos } from '@/hooks/useClientLogos';
import { useTestimonials } from '@/hooks/useTestimonials';
import { useHomeContent } from '@/hooks/useHomeContent';

const SocialProofSection = () => {
  const { logos } = useClientLogos();
  const { testimonials } = useTestimonials();
  const { content } = useHomeContent();
  const sp = content.socialProof;
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % testimonials.length), 7000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  const current = testimonials[active];

  return (
    <section className="section-padding border-t border-white/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20">
          <div className="lg:col-span-3">
            <p className="text-eyebrow">{sp.badge}</p>
          </div>
          <div className="lg:col-span-9">
            <h2 className="text-display text-4xl md:text-6xl max-w-3xl">
              {sp.title} <span className="italic text-primary">{sp.titleHighlight}</span>
            </h2>
          </div>
        </div>

        {/* Depoimento em destaque */}
        {current && (
          <div className="max-w-5xl mx-auto text-center mb-24 md:mb-32">
            <span className="text-display text-7xl md:text-9xl text-primary/30 leading-none block mb-4">&ldquo;</span>
            <p className="text-display italic text-2xl md:text-4xl lg:text-5xl leading-[1.25] text-foreground/95 mb-10">
              {current.quote}
            </p>
            <div className="flex flex-col items-center">
              <p className="text-sm uppercase tracking-[0.25em] text-foreground">{current.name}</p>
              {current.role && (
                <p className="text-xs text-foreground/50 mt-2">{current.role}</p>
              )}
            </div>

            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Depoimento ${i + 1}`}
                    className={`h-px transition-all duration-500 ${
                      i === active ? 'w-12 bg-primary' : 'w-6 bg-foreground/20'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logos clientes */}
        {logos.length > 0 && (
          <div>
            <p className="text-eyebrow text-center mb-10">Marcas que confiam na Racun</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              {logos.map((logo) => (
                <div key={logo.id} className="h-10 opacity-50 hover:opacity-100 transition-opacity duration-500">
                  <img src={logo.image_url} alt={logo.name} className="h-full w-auto object-contain grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-20 text-center">
          <Link to="/contato" className="btn-primary inline-flex items-center gap-2">
            {sp.cta} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
