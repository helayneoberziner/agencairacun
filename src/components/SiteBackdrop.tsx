import { useSiteSettings } from '@/hooks/useSiteSettings';
import defaultBackdrop from '@/assets/hero-backdrop.jpg';

interface SiteBackdropProps {
  /** Override image (ex: imagem de fundo do hero definida no painel) */
  image?: string;
  /** Intensidade da imagem (0 a 100) */
  intensity?: number;
  className?: string;
}

/**
 * Fundo padrão da marca: imagem editável no painel (Configurações > Imagem de fundo)
 * com fallback para o backdrop Racun (preto com traço azul).
 */
const SiteBackdrop = ({ image, intensity = 35, className = '' }: SiteBackdropProps) => {
  const { settings } = useSiteSettings();
  const src = image?.trim() || settings.backgroundImage?.trim() || defaultBackdrop;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <img
        src={src}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: intensity / 100 }}
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 gradient-mesh" />
    </div>
  );
};

export default SiteBackdrop;
