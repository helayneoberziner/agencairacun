import { useSiteSettings, BackdropSection } from '@/hooks/useSiteSettings';
import defaultBackdrop from '@/assets/hero-agency.jpg';

interface SiteBackdropProps {
  /** Override direto (ex: imagem definida no conteúdo da seção) */
  image?: string;
  /** Seção correspondente no painel (Fundos das seções) */
  section?: BackdropSection;
  /** Intensidade da imagem (0 a 100) */
  intensity?: number;
  className?: string;
  /** Imagem principal da dobra (evita lazy load no LCP) */
  priority?: boolean;
}

/**
 * Fundo padrão da marca: foto editável no painel (Configurações > Fundos das seções)
 * com fallback para a foto da agência. As trocas refletem sem recarregar a página,
 * pois o cache de site_settings é invalidado em realtime.
 */
const SiteBackdrop = ({ image, section, intensity = 35, className = '', priority = false }: SiteBackdropProps) => {
  const { settings } = useSiteSettings();
  const sectionImage = section ? settings.sectionBackgrounds?.[section]?.trim() : '';
  const src = image?.trim() || sectionImage || settings.backgroundImage?.trim() || defaultBackdrop;

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`} aria-hidden="true">
      <img
        key={src}
        src={src}
        alt=""
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        className="absolute inset-0 w-full h-full object-cover animate-fade-in"
        style={{ opacity: intensity / 100 }}
      />
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 gradient-mesh" />
    </div>
  );
};

export default SiteBackdrop;
