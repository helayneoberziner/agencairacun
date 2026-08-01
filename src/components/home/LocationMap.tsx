import { MapPin, ExternalLink } from 'lucide-react';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const LocationMap = () => {
  const { settings } = useSiteSettings();
  const query = encodeURIComponent(settings.address || 'Agência Racun, Blumenau, SC');
  const embedSrc = `https://www.google.com/maps?q=${query}&output=embed`;
  const openLink = `https://www.google.com/maps/search/?api=1&query=${query}`;

  return (
    <section className="section-padding pt-0">
      <div className="container-custom">
        <div className="glass-card overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-2 p-6 md:p-10 flex flex-col justify-center">
              <span className="text-primary text-xs md:text-sm font-medium uppercase tracking-[0.25em] mb-4 block">
                Onde estamos
              </span>
              <h3 className="text-[1.5rem] md:text-4xl font-display font-bold mb-4 leading-tight">
                Venha nos <span className="text-gradient-neon italic">visitar.</span>
              </h3>
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">{settings.address}</p>
              </div>
              <a
                href={openLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 self-start btn-outline"
              >
                Abrir no Google Maps
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <div className="lg:col-span-3 relative min-h-[280px] md:min-h-[400px]">
              <iframe
                src={embedSrc}
                title="Localização Agência Racun"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full border-0 grayscale-[0.6] contrast-110 hover:grayscale-0 transition-all duration-700"
                style={{ filter: 'invert(0.92) hue-rotate(180deg) grayscale(0.4) contrast(0.95)' }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background/60 via-transparent to-transparent lg:block hidden" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;