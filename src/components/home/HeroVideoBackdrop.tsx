import { useEffect, useState } from 'react';
import SiteBackdrop from '@/components/SiteBackdrop';

interface HeroVideoBackdropProps {
  /** ID do vídeo do YouTube usado como plano de fundo (sem som, em loop) */
  youtubeId?: string;
  /** Imagem usada como fallback e como pôster enquanto o vídeo carrega */
  image?: string;
}

/**
 * Plano de fundo do hero: vídeo em loop silencioso cobrindo a tela inteira,
 * com a foto configurada no painel como pôster/fallback.
 */
const HeroVideoBackdrop = ({ youtubeId, image }: HeroVideoBackdropProps) => {
  const id = youtubeId?.trim();
  const [ready, setReady] = useState(false);
  const [allowVideo, setAllowVideo] = useState(false);

  useEffect(() => {
    if (!id) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const t = window.setTimeout(() => setAllowVideo(true), 400);
    return () => window.clearTimeout(t);
  }, [id]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <SiteBackdrop image={image} section="hero" intensity={ready ? 30 : 85} priority />

      {id && allowVideo && (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}
        >
          <iframe
            title="Plano de fundo"
            onLoad={() => setReady(true)}
            src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&playsinline=1&rel=0&modestbranding=1&showinfo=0&disablekb=1&iv_load_policy=3`}
            allow="autoplay; encrypted-media"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 min-w-[100vw] min-h-[100svh] w-[177.78svh] h-[56.25vw] pointer-events-none"
          />
        </div>
      )}

      {/* Camadas de leitura sobre o vídeo */}
      <div className="absolute inset-0 bg-background/72" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--background))_0%,hsl(var(--background)/0.85)_38%,hsl(var(--background)/0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
};

export default HeroVideoBackdrop;
