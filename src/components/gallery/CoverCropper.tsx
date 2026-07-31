import { useCallback, useEffect, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Loader2, Move } from 'lucide-react';

const OUT_W = 1920;
const OUT_H = 1080; // 16:9 cover

interface Props {
  open: boolean;
  imageUrl: string | null;
  onClose: () => void;
  onSave: (blob: Blob) => Promise<void> | void;
}

/** Crop and reframe a cover image (16:9) with pan and zoom so nothing gets distorted. */
const CoverCropper = ({ open, imageUrl, onClose, onSave }: Props) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0.5, y: 0.5 }); // focal point 0..1
  const [saving, setSaving] = useState(false);
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  useEffect(() => {
    if (!open || !imageUrl) return;
    setLoaded(false); setZoom(1); setOffset({ x: 0.5, y: 0.5 });
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => { imgRef.current = img; setLoaded(true); };
    img.onerror = () => { imgRef.current = null; setLoaded(false); };
    img.src = imageUrl;
  }, [open, imageUrl]);

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current || !boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const dx = (e.clientX - drag.current.x) / rect.width;
    const dy = (e.clientY - drag.current.y) / rect.height;
    setOffset({
      x: Math.min(1, Math.max(0, drag.current.ox - dx)),
      y: Math.min(1, Math.max(0, drag.current.oy - dy)),
    });
  };
  const onPointerUp = () => { drag.current = null; };

  const save = useCallback(async () => {
    const img = imgRef.current;
    if (!img) return;
    setSaving(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = OUT_W; canvas.height = OUT_H;
      const ctx = canvas.getContext('2d')!;
      // cover-fit the source into the output, then apply zoom and focal point
      const scale = Math.max(OUT_W / img.width, OUT_H / img.height) * zoom;
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (OUT_W - dw) * offset.x;
      const dy = (OUT_H - dh) * offset.y;
      ctx.fillStyle = '#040d28';
      ctx.fillRect(0, 0, OUT_W, OUT_H);
      ctx.drawImage(img, dx, dy, dw, dh);
      const blob: Blob = await new Promise(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.9));
      await onSave(blob);
      onClose();
    } finally { setSaving(false); }
  }, [zoom, offset, onSave, onClose]);

  const bgSize = `${100 * zoom}%`;

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Enquadrar capa</DialogTitle></DialogHeader>
        <div
          ref={boxRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted cursor-grab active:cursor-grabbing select-none touch-none"
          style={imageUrl ? {
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: bgSize,
            backgroundPosition: `${offset.x * 100}% ${offset.y * 100}%`,
            backgroundRepeat: 'no-repeat',
          } : undefined}
        >
          {!loaded && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin" /></div>}
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 rounded bg-black/60 text-white text-[11px]">
            <Move className="w-3 h-3" /> arraste para reposicionar
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Zoom</span><span>{zoom.toFixed(2)}x</span>
          </div>
          <Slider min={1} max={3} step={0.01} value={[zoom]} onValueChange={v => setZoom(v[0])} />
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={save} disabled={!loaded || saving}>
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Definir como capa
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoverCropper;
