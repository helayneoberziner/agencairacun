import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Play } from 'lucide-react';

interface Props {
  open: boolean;
  onClose: () => void;
  gallery: any;
  items: any[];
}

/** In-admin preview of how the client will see the gallery. */
const GalleryPreview = ({ open, onClose, gallery, items }: Props) => (
  <Dialog open={open} onOpenChange={v => !v && onClose()}>
    <DialogContent className="max-w-4xl p-0 overflow-hidden">
      <DialogHeader className="px-5 pt-5">
        <DialogTitle>Pré-visualização da galeria</DialogTitle>
      </DialogHeader>
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="relative h-56 md:h-72 overflow-hidden">
          {gallery?.cover_url && <img src={gallery.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-background" />
          <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
            <h2 className="text-3xl md:text-5xl" style={{ fontFamily: gallery?.title_font, color: gallery?.title_color }}>{gallery?.name}</h2>
            {gallery?.client_name && <p className="mt-2 text-white/80 text-sm">{gallery.client_name}</p>}
            <span className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs">
              <Play className="w-3 h-3" /> Modo apresentação
            </span>
          </div>
        </div>
        <div className="p-4 grid grid-cols-3 md:grid-cols-5 gap-2">
          {items.slice(0, 20).map(it => (
            <div key={it.id} className="aspect-square rounded-md overflow-hidden bg-muted">
              {it.kind === 'video'
                ? <video src={it.preview_url ?? ''} className="w-full h-full object-cover" muted />
                : <img src={it.preview_url ?? ''} alt="" className="w-full h-full object-cover" />}
            </div>
          ))}
          {items.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-8">Sem arquivos ainda.</p>}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

export default GalleryPreview;
