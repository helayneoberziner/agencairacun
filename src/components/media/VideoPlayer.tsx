import { useState } from 'react';
import { Play } from 'lucide-react';
import { parseYouTubeId, getYouTubeThumb, getYouTubeEmbedUrl, isFileVideoUrl } from '@/lib/videoUtils';

interface Props {
  url: string;
  poster?: string | null;
  title?: string;
  className?: string;
  aspect?: string; // tailwind aspect class
}

/**
 * Hybrid video player. YouTube videos use a facade pattern: thumb + play
 * overlay; iframe loads only on click (much better LCP/CLS).
 */
const VideoPlayer = ({ url, poster, title, className = '', aspect = 'aspect-video' }: Props) => {
  const [active, setActive] = useState(false);
  const ytId = parseYouTubeId(url);

  if (ytId) {
    const cover = poster || getYouTubeThumb(ytId);
    return (
      <div className={`relative ${aspect} bg-black rounded-xl overflow-hidden ${className}`}>
        {!active ? (
          <button
            type="button"
            onClick={() => setActive(true)}
            className="group absolute inset-0 w-full h-full"
            aria-label={title ? `Reproduzir ${title}` : 'Reproduzir vídeo'}
          >
            <img
              src={cover}
              alt={title || 'Vídeo'}
              loading="lazy"
              onError={(e) => { (e.target as HTMLImageElement).src = getYouTubeThumb(ytId, 'hq'); }}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center neon-glow transition-transform group-hover:scale-110">
                <Play className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground fill-current ml-1" />
              </span>
            </div>
          </button>
        ) : (
          <iframe
            src={getYouTubeEmbedUrl(ytId, { autoplay: true })}
            title={title || 'YouTube video'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    );
  }

  if (isFileVideoUrl(url)) {
    return (
      <video
        src={url}
        poster={poster || undefined}
        controls
        playsInline
        preload="metadata"
        className={`w-full ${aspect} object-cover rounded-xl bg-black ${className}`}
      />
    );
  }

  // Fallback: try as iframe
  return (
    <div className={`${aspect} rounded-xl overflow-hidden bg-black ${className}`}>
      <iframe src={url} title={title || 'Vídeo'} className="w-full h-full" allowFullScreen />
    </div>
  );
};

export default VideoPlayer;