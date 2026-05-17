import { useCallback, useEffect, useRef, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Upload, Trash2, Copy, Loader2, Search, FolderPlus, Image as ImgIcon, Video } from 'lucide-react';
import { uploadWithDedup, publicUrl } from '@/lib/mediaLibrary';

interface AssetRow {
  id: string;
  path: string;
  folder: string;
  name: string;
  size: number;
  mime_type: string | null;
  is_video: boolean;
  created_at: string;
}

const AdminMedia = () => {
  const [items, setItems] = useState<AssetRow[]>([]);
  const [folders, setFolders] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [activeFolder, setActiveFolder] = useState<string>('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [newFolder, setNewFolder] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: assets }, { data: fds }] = await Promise.all([
        supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(2000),
        supabase.from('media_folders').select('name').order('name'),
      ]);
      setItems((assets ?? []) as AssetRow[]);
      setFolders((fds ?? []).map((f: any) => f.name));
    } catch (e) {
      console.error(e);
      toast.error('Erro ao carregar biblioteca');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleFiles = async (files: FileList | File[]) => {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true);
    const target = activeFolder || 'home';
    let dedup = 0;
    try {
      for (const f of list) {
        const r = await uploadWithDedup(f, target);
        if (r.deduped) dedup++;
      }
      if (dedup > 0) toast.info(`${dedup} arquivo(s) já existiam — reutilizados.`);
      toast.success(`${list.length - dedup} arquivo(s) enviado(s)`);
      fetchAll();
    } catch (err: any) {
      console.error(err);
      toast.error('Erro ao enviar: ' + (err.message || ''));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    if (e.dataTransfer.files?.length) await handleFiles(e.dataTransfer.files);
  };

  const deleteAsset = async (a: AssetRow) => {
    if (!confirm(`Excluir "${a.name}"?`)) return;
    await supabase.storage.from('media').remove([a.path]);
    await supabase.from('media_assets').delete().eq('id', a.id);
    setItems(prev => prev.filter(i => i.id !== a.id));
    toast.success('Arquivo excluído');
  };

  const createFolder = async () => {
    const v = newFolder.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    if (!v) return;
    const { error } = await supabase.from('media_folders').insert({ name: v });
    if (error) { toast.error('Erro ao criar pasta'); return; }
    toast.success('Pasta criada');
    setNewFolder(''); setCreatingFolder(false);
    setActiveFolder(v);
    fetchAll();
  };

  const deleteFolder = async (name: string) => {
    const inFolder = items.filter(i => i.folder === name);
    if (inFolder.length > 0) {
      toast.error(`Pasta "${name}" contém ${inFolder.length} arquivo(s). Esvazie antes de excluir.`);
      return;
    }
    if (!confirm(`Excluir pasta "${name}"?`)) return;
    await supabase.from('media_folders').delete().eq('name', name);
    if (activeFolder === name) setActiveFolder('');
    fetchAll();
  };

  const filtered = items.filter(i =>
    (!activeFolder || i.folder === activeFolder) &&
    (filterType === 'all' || (filterType === 'video' ? i.is_video : !i.is_video)) &&
    (!search || i.name.toLowerCase().includes(search.toLowerCase()))
  );

  const fmtSize = (b: number) => {
    if (!b) return '0 B';
    const k = 1024;
    const u = ['B','KB','MB','GB'];
    const i = Math.floor(Math.log(b)/Math.log(k));
    return parseFloat((b/Math.pow(k,i)).toFixed(1)) + ' ' + u[i];
  };

  const copyUrl = (path: string) => {
    navigator.clipboard.writeText(publicUrl(path));
    toast.success('URL copiada');
  };

  return (
    <AdminLayout title="Biblioteca de Mídia">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar pastas */}
        <aside className="lg:w-64 shrink-0 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pastas</h3>
            <Button size="sm" variant="ghost" onClick={() => setCreatingFolder(v => !v)}>
              <FolderPlus className="w-4 h-4" />
            </Button>
          </div>
          {creatingFolder && (
            <div className="flex gap-1">
              <Input autoFocus value={newFolder} onChange={e => setNewFolder(e.target.value)} placeholder="nome-da-pasta" className="h-8 text-sm" />
              <Button size="sm" onClick={createFolder}>OK</Button>
            </div>
          )}
          <div className="space-y-1">
            <button onClick={() => setActiveFolder('')} className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${!activeFolder ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
              Toda a biblioteca ({items.length})
            </button>
            {folders.map(f => {
              const count = items.filter(i => i.folder === f).length;
              return (
                <div key={f} className={`group flex items-center justify-between rounded text-sm transition-colors ${activeFolder === f ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
                  <button onClick={() => setActiveFolder(f)} className="flex-1 text-left px-3 py-2">
                    {f} <span className="opacity-60">({count})</span>
                  </button>
                  <button onClick={() => deleteFolder(f)} className="px-2 opacity-0 group-hover:opacity-100 transition-opacity" title="Excluir pasta">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Conteúdo */}
        <section className="flex-1 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Buscar arquivo..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value as any)} className="px-3 py-2 rounded-md bg-background border border-input text-sm">
              <option value="all">Todos</option>
              <option value="image">Imagens</option>
              <option value="video">Vídeos</option>
            </select>
            <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
              Upload
            </Button>
            <input ref={inputRef} type="file" multiple accept="image/*,video/*" onChange={(e) => e.target.files && handleFiles(e.target.files)} className="hidden" />
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`min-h-[400px] rounded-xl p-4 transition-colors ${dragOver ? 'bg-primary/5 ring-2 ring-primary/40' : 'bg-secondary/10 ring-1 ring-border'}`}
          >
            {dragOver && (
              <div className="text-center py-3 text-primary font-medium text-sm">Solte os arquivos para enviar para "{activeFolder || 'home'}"</div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground text-sm">
                Nenhum arquivo. Arraste e solte aqui ou use o botão Upload.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                {filtered.map(a => {
                  const url = publicUrl(a.path);
                  return (
                    <div key={a.id} className="glass-card overflow-hidden group">
                      <div className="aspect-square relative bg-muted">
                        {a.is_video ? (
                          <video src={url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                        ) : (
                          <img src={url} alt={a.name} loading="lazy" className="w-full h-full object-cover" />
                        )}
                        {a.is_video && <div className="absolute top-1 right-1 p-1 rounded bg-black/60"><Video className="w-3 h-3 text-white" /></div>}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => copyUrl(a.path)} className="p-2 rounded bg-white/10 hover:bg-white/20" title="Copiar URL"><Copy className="w-4 h-4 text-white" /></button>
                          <button onClick={() => deleteAsset(a)} className="p-2 rounded bg-destructive/60 hover:bg-destructive" title="Excluir"><Trash2 className="w-4 h-4 text-white" /></button>
                        </div>
                      </div>
                      <div className="p-2">
                        <p className="text-xs truncate" title={a.name}>{a.name}</p>
                        <p className="text-[10px] text-muted-foreground">{a.folder} · {fmtSize(a.size)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;