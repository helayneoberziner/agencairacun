import { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Download, Heart, ShoppingBag, Loader2 } from 'lucide-react';

export interface SlideItem {
  id: string;
  kind: string;
  preview_url: string | null;
  file_name?: string | null;
}

interface Props {
  items: SlideItem[];
  index: number;
  onIndexChange: (i: number) => void;
  onClose: () => void;
  presentation?: boolean;
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
  selected?: Set<string>;
  onToggleSelected?: (id: string) => void;
  onDownload?: (id: string) => void;
  downloadingId?: string | null;
  sellEnabled?: boolean;
}

const GallerySlideshow = ({
  items, index, onIndexChange, onClose, presentation = false,
  favorites, onToggleFavorite, selected, onToggleSelected,
  onDownload, downloadingId, sellEnabled,
}: Props) => {
  const [playing, setPlaying] = useState(presentation);
  const item = items[index];

  const next = useCallback(() => onIndexChange(index < items.length - 1 ? index + 1 : 0), [index, items.length, onIndexChange]);
  const prev = useCallback(() => onIndexChange(index > 0 ? index - 1 : items.length - 1), [index, items.length, onIndexChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === ' ') { e.preventDefault(); setPlaying(p => !p); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, onClose]);

  useEffect(() => {
    if (!playing || items.length < 2) return;
    const t = setTimeout(next, item?.kind === 'video' ? 12000 : 4500);
    return () => clearTimeout(t);
  }, [playing, next, index, items.length, item?.kind]);

  if (!item) return null;
  const isFav = favorites?.has(item.id);
  const isSel = selected?.has(item.id);

  return (
    <div className="fixed inset-0 z-[60] bg-black flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 text-white/70">
        <span className="text-xs tracking-widest uppercase">
          {presentation ? 'Apresentação' : 'Visualização'} · {index + 1}/{items.length}
        </span>
        <div className="flex items-center gap-1">
          <button onClick={() => setPlaying(p => !p)} className="p-2 hover:text-white" aria-label="Reproduzir">
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button onClick={onClose} className="p-2 hover:text-white" aria-label="Fechar"><X className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center px-4">
        <button onClick={prev} className="absolute left-2 md:left-6 p-3 text-white/60 hover:text-white" aria-label="Anterior"><ChevronLeft className="w-8 h-8" /></button>
        {item.kind === 'video' ? (
          <video key={item.id} src={item.preview_url ?? ''} controls autoPlay className="max-h-[76vh] max-w-[88vw]" />
        ) : (
          <img key={item.id} src={item.preview_url ?? ''} alt={item.file_name ?? ''} className="max-h-[76vh] max-w-[88vw] object-contain animate-in fade-in duration-500" />
        )}
        <button onClick={next} className="absolute right-2 md:right-6 p-3 text-white/60 hover:text-white" aria-label="Próximo"><ChevronRight className="w-8 h-8" /></button>
      </div>

      <div className="flex items-center justify-center gap-2 px-4 py-4">
        {onToggleFavorite && (
          <button onClick={() => onToggleFavorite(item.id)} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${isFav ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} /> Favorito
          </button>
        )}
        {sellEnabled && onToggleSelected && (
          <button onClick={() => onToggleSelected(item.id)} className={`px-3 py-2 rounded-lg text-sm flex items-center gap-2 ${isSel ? 'bg-primary text-primary-foreground' : 'bg-white/10 text-white hover:bg-white/20'}`}>
            <ShoppingBag className="w-4 h-4" /> {isSel ? 'Selecionada' : 'Selecionar'}
          </button>
        )}
        {onDownload && (
          <button onClick={() => onDownload(item.id)} disabled={downloadingId === item.id} className="px-3 py-2 rounded-lg text-sm bg-white/10 text-white hover:bg-white/20 flex items-center gap-2">
            {downloadingId === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />} Baixar em alta
          </button>
        )}
      </div>
    </div>
  );
};

export default GallerySlideshow;
