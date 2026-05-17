import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Upload, Image as ImageIcon, Video } from 'lucide-react';
import { toast } from 'sonner';

interface MediaItem {
  name: string;
  url: string;
  folder: string;
  size: number;
  isVideo: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  /** Optional folder to default uploads to */
  folder?: string;
  /** Filter to only images or only videos */
  accept?: 'image' | 'video' | 'all';
}

const FOLDERS = ['', 'home', 'segments', 'cases', 'produtora', 'marketing', 'restaurantes', 'sobre', 'institucional'];
const IMG_EXT = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'avif'];
const VID_EXT = ['mp4', 'webm', 'mov', 'm4v'];

const MediaPicker = ({ open, onClose, onSelect, folder = 'home', accept = 'image' }: Props) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('');

  const listFolder = async (path: string): Promise<MediaItem[]> => {
    const { data, error } = await supabase.storage.from('media').list(path || '', {
      limit: 500,
      sortBy: { column: 'created_at', order: 'desc' },
    });
    if (error) throw error;
    const out: MediaItem[] = [];
    for (const f of data ?? []) {
      if (f.name === '.emptyFolderPlaceholder') continue;
      // Folders have no metadata.size
      if (!f.metadata) continue;
      const full = path ? `${path}/${f.name}` : f.name;
      const ext = f.name.split('.').pop()?.toLowerCase() || '';
      const isVideo = VID_EXT.includes(ext);
      const isImage = IMG_EXT.includes(ext);
      if (accept === 'image' && !isImage) continue;
      if (accept === 'video' && !isVideo) continue;
      out.push({
        name: f.name,
        folder: path,
        url: supabase.storage.from('media').getPublicUrl(full).data.publicUrl,
        size: f.metadata?.size ?? 0,
        isVideo,
      });
    }
    return out;
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      if (activeFolder) {
        setItems(await listFolder(activeFolder));
      } else {
        // Aggregate root + known folders for a unified library view
        const results = await Promise.all([listFolder(''), ...FOLDERS.filter(Boolean).map(listFolder)]);
        const merged = results.flat();
        // Dedup by url
        const seen = new Set<string>();
        setItems(merged.filter(i => (seen.has(i.url) ? false : (seen.add(i.url), true))));
      }
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar a biblioteca');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeFolder]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const target = activeFolder || folder || 'home';
      const fileName = `${target}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file, { upsert: false });
      if (error) throw error;
      const url = supabase.storage.from('media').getPublicUrl(fileName).data.publicUrl;
      toast.success('Arquivo enviado e salvo na biblioteca');
      onSelect(url);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar arquivo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const filtered = items.filter(i =>
    !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.folder.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[88vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Biblioteca de mídia</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou pasta..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select
            value={activeFolder}
            onChange={e => setActiveFolder(e.target.value)}
            className="px-3 py-2 rounded-md bg-background border border-input text-sm"
          >
            <option value="">Toda a biblioteca</option>
            {FOLDERS.filter(Boolean).map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <label className="inline-flex">
            <input type="file" accept={accept === 'video' ? 'video/*' : accept === 'image' ? 'image/*' : 'image/*,video/*'} onChange={handleUpload} className="hidden" />
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploading ? 'Enviando...' : 'Enviar novo'}
              </span>
            </Button>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto -mx-2 px-2">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Nenhum arquivo encontrado nesta biblioteca.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filtered.map(item => (
                <button
                  key={item.url}
                  type="button"
                  onClick={() => { onSelect(item.url); onClose(); }}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-all bg-muted"
                  title={item.name}
                >
                  {item.isVideo ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/40 text-muted-foreground">
                      <Video className="w-8 h-8 mb-1" />
                      <span className="text-[10px] px-1 truncate w-full text-center">{item.name}</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.name} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  )}
                  {item.folder && (
                    <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider bg-background/70 px-1.5 py-0.5 rounded">{item.folder}</span>
                  )}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-full transition-opacity">
                      Selecionar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;