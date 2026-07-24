import { useCallback, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useGallery, useGalleryItems } from '@/hooks/useGalleries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload, Trash2, Copy, ExternalLink, Video, Image as ImgIcon, Loader2 } from 'lucide-react';
import { uploadGalleryFile, hashPassword, isImage, isVideo } from '@/lib/galleryLib';
import { useQueryClient } from '@tanstack/react-query';

const AdminGalleryEdit = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: gallery, isLoading } = useGallery(id);
  const { data: items } = useGalleryItems(id);
  const [form, setForm] = useState<any>({});
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const g: any = { ...(gallery ?? {}), ...form };
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!gallery) return;
    const patch: any = { ...form };
    if (password) patch.password_hash = await hashPassword(password);
    const { error } = await supabase.from('gallery_galleries').update(patch).eq('id', gallery.id);
    if (error) { toast.error(error.message); return; }
    toast.success('Salvo');
    setPassword('');
    setForm({});
    qc.invalidateQueries({ queryKey: ['gallery', gallery.id] });
    qc.invalidateQueries({ queryKey: ['galleries'] });
  };

  const clearPassword = async () => {
    if (!gallery) return;
    await supabase.from('gallery_galleries').update({ password_hash: null }).eq('id', gallery.id);
    toast.success('Senha removida');
    qc.invalidateQueries({ queryKey: ['gallery', gallery.id] });
  };

  const setStatus = async (status: string) => {
    if (!gallery) return;
    await supabase.from('gallery_galleries').update({ status }).eq('id', gallery.id);
    toast.success(status === 'active' ? 'Galeria publicada' : 'Galeria despublicada');
    qc.invalidateQueries({ queryKey: ['gallery', gallery.id] });
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    if (!gallery) return;
    const list = Array.from(files).filter(f => isImage(f) || isVideo(f));
    if (!list.length) return;
    setUploading(true);
    setProgress({ done: 0, total: list.length });
    try {
      for (let i = 0; i < list.length; i++) {
        const file = list[i];
        try {
          const buf = await file.arrayBuffer();
          const hashBytes = new Uint8Array(await crypto.subtle.digest('SHA-256', buf));
          const hash = Array.from(hashBytes).map(b => b.toString(16).padStart(2, '0')).join('');
          const { data: dup } = await supabase.from('gallery_items').select('id').eq('gallery_id', gallery.id).eq('hash', hash).maybeSingle();
          if (dup) { setProgress(p => ({ ...p, done: p.done + 1 })); continue; }
          const up = await uploadGalleryFile(file, gallery.slug, {
            watermark: gallery.watermark_enabled ? (gallery.watermark_text || 'RACUN') : null,
          });
          await supabase.from('gallery_items').insert({
            gallery_id: gallery.id,
            kind: up.kind,
            original_path: up.original_path,
            preview_url: up.preview_url,
            file_name: up.file_name,
            mime_type: up.mime_type,
            size: up.size,
            width: up.width, height: up.height,
            hash: up.hash,
            display_order: i,
          });
        } catch (e: any) {
          console.error(e);
          toast.error(`Falha em ${file.name}: ${e.message ?? e}`);
        } finally {
          setProgress(p => ({ ...p, done: p.done + 1 }));
        }
      }
      toast.success('Upload concluído');
      qc.invalidateQueries({ queryKey: ['gallery-items', gallery.id] });
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
    }
  }, [gallery, qc]);

  const removeItem = async (item: any) => {
    if (!confirm('Remover este arquivo?')) return;
    await supabase.storage.from('gallery-originals').remove([item.original_path]).catch(() => {});
    await supabase.from('gallery_items').delete().eq('id', item.id);
    qc.invalidateQueries({ queryKey: ['gallery-items', gallery!.id] });
  };

  const setAsCover = async (url: string) => {
    if (!gallery || !url) return;
    await supabase.from('gallery_galleries').update({ cover_url: url }).eq('id', gallery.id);
    toast.success('Capa atualizada');
    qc.invalidateQueries({ queryKey: ['gallery', gallery.id] });
  };

  if (isLoading || !gallery) return <AdminLayout title="Galeria"><div className="p-6">Carregando...</div></AdminLayout>;

  const publicUrl = `${window.location.origin}/galeria/${gallery.slug}`;

  return (
    <AdminLayout title={gallery.name}>
      <div className="sticky top-0 z-30 -mx-6 -mt-6 mb-6 px-6 py-3 bg-background/95 backdrop-blur border-b border-border flex items-center gap-3">
        <Link to="/admin/galleries" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex-1" />
        {gallery.status === 'active' ? (
          <>
            <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
              <ExternalLink className="w-4 h-4" /> Ver
            </a>
            <button onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success('Link copiado'); }} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              <Copy className="w-4 h-4" /> Copiar link
            </button>
            <Button variant="secondary" onClick={() => setStatus('draft')}>Despublicar</Button>
          </>
        ) : (
          <Button variant="secondary" onClick={() => setStatus('active')}>Publicar</Button>
        )}
        <Button onClick={save}><Save className="w-4 h-4 mr-2" /> Salvar</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <div><Label>Nome</Label><Input value={g.name ?? ''} onChange={e => set('name', e.target.value)} /></div>
            <div><Label>Cliente</Label><Input value={g.client_name ?? ''} onChange={e => set('client_name', e.target.value)} /></div>
            <div><Label>E-mail do cliente</Label><Input type="email" value={g.client_email ?? ''} onChange={e => set('client_email', e.target.value)} /></div>
            <div><Label>Data do evento</Label><Input type="date" value={g.event_date ?? ''} onChange={e => set('event_date', e.target.value)} /></div>
            <div>
              <Label>Slug (URL)</Label>
              <Input value={g.slug ?? ''} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} />
              <p className="text-xs text-muted-foreground mt-1">{window.location.origin}/galeria/{g.slug}</p>
            </div>
            <div>
              <Label>Expira em</Label>
              <Input type="datetime-local" value={g.expires_at ? new Date(g.expires_at).toISOString().slice(0, 16) : ''} onChange={e => set('expires_at', e.target.value ? new Date(e.target.value).toISOString() : null)} />
            </div>
            <div>
              <Label>Limite de downloads (total)</Label>
              <Input type="number" min={0} value={g.download_limit ?? ''} onChange={e => set('download_limit', e.target.value ? Number(e.target.value) : null)} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-medium">Aparência</h3>
            <div>
              <Label>Layout</Label>
              <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={g.layout ?? 'grid'} onChange={e => set('layout', e.target.value)}>
                <option value="grid">Grade</option>
                <option value="mosaic">Mosaico</option>
                <option value="carousel">Carrossel</option>
              </select>
            </div>
            <div>
              <Label>Fonte do título</Label>
              <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={g.title_font ?? 'DM Serif Display'} onChange={e => set('title_font', e.target.value)}>
                <option>DM Serif Display</option>
                <option>Inter</option>
                <option>Cormorant Garamond</option>
              </select>
            </div>
            <div>
              <Label>Cor do título</Label>
              <Input type="color" value={g.title_color ?? '#FF00CC'} onChange={e => set('title_color', e.target.value)} />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 space-y-4">
            <h3 className="font-medium">Segurança</h3>
            <div className="flex items-center justify-between">
              <Label>Marca d'água</Label>
              <Switch checked={!!g.watermark_enabled} onCheckedChange={v => set('watermark_enabled', v)} />
            </div>
            {g.watermark_enabled && (
              <div>
                <Label>Texto da marca d'água</Label>
                <Input value={g.watermark_text ?? ''} onChange={e => set('watermark_text', e.target.value)} placeholder="RACUN" />
                <p className="text-xs text-muted-foreground mt-1">Aplicada apenas nas previews. Originais ficam limpos.</p>
              </div>
            )}
            <div>
              <Label>Nova senha (opcional)</Label>
              <Input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Deixe em branco para não alterar" />
              {gallery.password_hash && (
                <button className="text-xs text-destructive mt-1" onClick={clearPassword}>Remover senha atual</button>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center transition ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
          >
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
            <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Arraste fotos e vídeos aqui, ou</p>
            <Button variant="secondary" className="mt-3" onClick={() => fileRef.current?.click()} disabled={uploading}>
              {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando {progress.done}/{progress.total}</> : 'Selecionar arquivos'}
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {(items ?? []).map((it: any) => (
              <div key={it.id} className="group relative aspect-square bg-muted rounded-lg overflow-hidden">
                {it.kind === 'video' ? (
                  <video src={it.preview_url ?? ''} className="w-full h-full object-cover" muted />
                ) : (
                  <img src={it.preview_url ?? ''} alt="" loading="lazy" className="w-full h-full object-cover" />
                )}
                <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] rounded bg-black/60 text-white flex items-center gap-1">
                  {it.kind === 'video' ? <Video className="w-3 h-3" /> : <ImgIcon className="w-3 h-3" />}
                  {it.kind}
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                  <button onClick={() => setAsCover(it.preview_url)} className="text-xs px-2 py-1 rounded bg-white/90 text-black">Usar como capa</button>
                  <button onClick={() => removeItem(it)} className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground flex items-center gap-1">
                    <Trash2 className="w-3 h-3" /> Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGalleryEdit;