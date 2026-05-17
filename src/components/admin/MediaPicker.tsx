import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Upload, Video, FolderPlus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { uploadWithDedup, publicUrl } from '@/lib/mediaLibrary';

interface AssetRow {
  id: string;
  path: string;
  folder: string;
  name: string;
  size: number;
  mime_type: string | null;
  is_video: boolean;
  hash: string | null;
  created_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  folder?: string;
  accept?: 'image' | 'video' | 'all';
  multiple?: boolean;
  onSelectMany?: (urls: string[]) => void;
}

const MediaPicker = ({ open, onClose, onSelect, folder = 'home', accept = 'image', multiple = false, onSelectMany }: Props) => {
  const [items, setItems] = useState<AssetRow[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFolder, setActiveFolder] = useState<string>('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: assets }, { data: fds }] = await Promise.all([
        supabase
          .from('media_assets')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1000),
        supabase.from('media_folders').select('name').order('name'),
      ]);
      let filtered = (assets ?? []) as AssetRow[];
      if (accept === 'image') filtered = filtered.filter(a => !a.is_video);
      else if (accept === 'video') filtered = filtered.filter(a => a.is_video);
      setItems(filtered);
      setFolders((fds ?? []).map((f: any) => f.name));
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar biblioteca');
    } finally {
      setLoading(false);
    }
  }, [accept]);

  useEffect(() => {
    if (open) {
      setSelected(new Set());
      fetchAll();
    }
  }, [open, fetchAll]);

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    const targetFolder = activeFolder || folder || 'home';
    let dedupCount = 0;
    let lastUrl = '';
    const urls: string[] = [];
    try {
      for (const f of list) {
        if (accept === 'image' && !f.type.startsWith('image/')) continue;
        if (accept === 'video' && !f.type.startsWith('video/')) continue;
        const res = await uploadWithDedup(f, targetFolder);
        if (res.deduped) dedupCount++;
        lastUrl = res.url;
        urls.push(res.url);
      }
      if (dedupCount > 0) toast.info(`${dedupCount} arquivo(s) já existiam — reutilizados sem duplicar.`);
      toast.success(`${list.length - dedupCount} novo(s) enviado(s).`);
      await fetchAll();
      // If single-mode and a single file was processed, auto-select it
      if (!multiple && list.length === 1 && lastUrl) {
        onSelect(lastUrl);
        onClose();
      } else if (multiple && onSelectMany && urls.length > 0) {
        // Don't auto-close on multi-upload; let user confirm
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao enviar: ' + (err.message || ''));
    } finally {
      setUploading(false);
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) await handleFiles(e.dataTransfer.files);
  };

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) await handleFiles(e.target.files);
    e.target.value = '';
  };

  const createFolder = async () => {
    const v = newFolder.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!v) return;
    const { error } = await supabase.from('media_folders').insert({ name: v });
    if (error) { toast.error('Erro ao criar pasta'); return; }
    toast.success('Pasta criada');
    setNewFolder(''); setCreatingFolder(false);
    setActiveFolder(v);
    await fetchAll();
  };

  const deleteAsset = async (a: AssetRow, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Excluir "${a.name}"? Essa ação não pode ser desfeita.`)) return;
    await supabase.storage.from('media').remove([a.path]);
    await supabase.from('media_assets').delete().eq('id', a.id);
    toast.success('Arquivo excluído');
    fetchAll();
  };

  const filtered = items.filter(i =>
    (!activeFolder || i.folder === activeFolder) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()) || i.folder.toLowerCase().includes(search.toLowerCase()))
  );

  const toggleSelect = (a: AssetRow) => {
    if (!multiple) {
      onSelect(publicUrl(a.path));
      onClose();
      return;
    }
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(a.id)) next.delete(a.id); else next.add(a.id);
      return next;
    });
  };

  const confirmMulti = () => {
    if (!onSelectMany) return;
    const urls = items.filter(a => selected.has(a.id)).map(a => publicUrl(a.path));
    onSelectMany(urls);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Biblioteca de mídia</DialogTitle>
        </DialogHeader>

        <div className="px-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Buscar por nome ou pasta..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <select
            value={activeFolder}
            onChange={e => setActiveFolder(e.target.value)}
            className="px-3 py-2 rounded-md bg-background border border-input text-sm"
          >
            <option value="">Toda a biblioteca</option>
            {folders.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <Button type="button" variant="outline" size="sm" onClick={() => setCreatingFolder(v => !v)}>
            <FolderPlus className="w-4 h-4 mr-1" /> Nova pasta
          </Button>
          <label className="inline-flex">
            <input type="file" multiple={multiple} accept={accept === 'video' ? 'video/*' : accept === 'image' ? 'image/*' : 'image/*,video/*'} onChange={handleInput} className="hidden" />
            <Button asChild disabled={uploading}>
              <span className="cursor-pointer">
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploading ? 'Enviando...' : 'Enviar novo'}
              </span>
            </Button>
          </label>
        </div>

        {creatingFolder && (
          <div className="px-6 flex gap-2">
            <Input autoFocus placeholder="nome-da-pasta" value={newFolder} onChange={e => setNewFolder(e.target.value)} className="max-w-xs" />
            <Button type="button" size="sm" onClick={createFolder}>Criar</Button>
            <Button type="button" size="sm" variant="ghost" onClick={() => setCreatingFolder(false)}>Cancelar</Button>
          </div>
        )}

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`flex-1 overflow-y-auto px-6 pb-4 transition-colors ${dragOver ? 'bg-primary/5 ring-2 ring-primary/40 ring-inset' : ''}`}
        >
          {dragOver && (
            <div className="text-center py-4 text-primary font-medium text-sm">Solte os arquivos para enviar...</div>
          )}
          {loading ? (
            <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Nenhum arquivo encontrado. Arraste e solte aqui para enviar.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-2">
              {filtered.map(a => {
                const url = publicUrl(a.path);
                const isSel = selected.has(a.id);
                return (
                  <div
                    key={a.id}
                    onClick={() => toggleSelect(a)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border cursor-pointer transition-all bg-muted ${isSel ? 'border-primary ring-2 ring-primary' : 'border-border hover:border-primary'}`}
                    title={a.name}
                  >
                    {a.is_video ? (
                      <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                    ) : (
                      <img src={url} alt={a.name} loading="lazy" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    )}
                    {a.is_video && (
                      <div className="absolute top-1 right-1 p-1 rounded bg-black/60 text-white"><Video className="w-3.5 h-3.5" /></div>
                    )}
                    {a.folder && (
                      <span className="absolute top-1 left-1 text-[9px] uppercase tracking-wider bg-background/70 px-1.5 py-0.5 rounded">{a.folder}</span>
                    )}
                    <button type="button" onClick={(e) => deleteAsset(a, e)} className="absolute bottom-1 right-1 p-1 rounded bg-destructive/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3 text-white" />
                    </button>
                    {!multiple && (
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-full transition-opacity">Selecionar</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {multiple && (
          <div className="px-6 py-3 border-t border-border flex justify-between items-center">
            <span className="text-sm text-muted-foreground">{selected.size} selecionado(s)</span>
            <Button type="button" disabled={selected.size === 0} onClick={confirmMulti}>Usar selecionados</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MediaPicker;