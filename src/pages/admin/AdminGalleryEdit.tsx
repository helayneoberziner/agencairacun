import { useCallback, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useGallery, useGalleryItems, useGalleryAlbums } from '@/hooks/useGalleries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Save, Upload, Trash2, Copy, ExternalLink, Video, Image as ImgIcon, Loader2, Plus, Crop, Eye, FolderPlus } from 'lucide-react';
import { uploadGalleryFile, hashPassword, isImage, isVideo } from '@/lib/galleryLib';
import { brl, parseTiers, computePrice } from '@/lib/galleryPricing';
import CoverCropper from '@/components/gallery/CoverCropper';
import GalleryPreview from '@/components/gallery/GalleryPreview';
import GalleryStatsPanel from '@/components/gallery/GalleryStatsPanel';
import { useQueryClient } from '@tanstack/react-query';

const AdminGalleryEdit = () => {
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: gallery, isLoading } = useGallery(id);
  const { data: items } = useGalleryItems(id);
  const { data: albums } = useGalleryAlbums(id);
  const [form, setForm] = useState<any>({});
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [dragOver, setDragOver] = useState(false);
  const [uploadAlbum, setUploadAlbum] = useState<string>('');
  const [newAlbum, setNewAlbum] = useState('');
  const [cropUrl, setCropUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const g: any = { ...(gallery ?? {}), ...form };
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const tiers = useMemo(() => parseTiers(g.price_tiers), [g.price_tiers]);

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
            album_id: uploadAlbum || null,
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
  }, [gallery, qc, uploadAlbum]);

  const removeItem = async (item: any) => {
    if (!confirm('Remover este arquivo?')) return;
    await supabase.storage.from('gallery-originals').remove([item.original_path]);
    await supabase.from('gallery_items').delete().eq('id', item.id);
    qc.invalidateQueries({ queryKey: ['gallery-items', gallery!.id] });
  };

  const moveToAlbum = async (itemId: string, albumId: string) => {
    await supabase.from('gallery_items').update({ album_id: albumId || null }).eq('id', itemId);
    qc.invalidateQueries({ queryKey: ['gallery-items', gallery!.id] });
  };

  const createAlbum = async () => {
    if (!gallery || !newAlbum.trim()) return;
    const { error } = await supabase.from('gallery_albums').insert({
      gallery_id: gallery.id, name: newAlbum.trim(), display_order: (albums?.length ?? 0),
    });
    if (error) { toast.error(error.message); return; }
    setNewAlbum('');
    qc.invalidateQueries({ queryKey: ['gallery-albums', gallery.id] });
  };

  const removeAlbum = async (albumId: string) => {
    if (!confirm('Excluir este álbum? Os arquivos voltam para a galeria principal.')) return;
    await supabase.from('gallery_items').update({ album_id: null }).eq('album_id', albumId);
    await supabase.from('gallery_albums').delete().eq('id', albumId);
    qc.invalidateQueries({ queryKey: ['gallery-albums', gallery!.id] });
    qc.invalidateQueries({ queryKey: ['gallery-items', gallery!.id] });
  };

  const saveCover = async (blob: Blob) => {
    if (!gallery) return;
    const path = `gallery-covers/${gallery.slug}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('media').upload(path, blob, { contentType: 'image/jpeg', upsert: true });
    if (error) { toast.error(error.message); return; }
    const url = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
    await supabase.from('gallery_galleries').update({ cover_url: url }).eq('id', gallery.id);
    toast.success('Capa atualizada');
    qc.invalidateQueries({ queryKey: ['gallery', gallery.id] });
    qc.invalidateQueries({ queryKey: ['galleries'] });
  };

  const setTier = (idx: number, key: 'min_qty' | 'unit_price', value: number) => {
    const next = tiers.map((t, i) => (i === idx ? { ...t, [key]: value } : t));
    set('price_tiers', next);
  };
  const addTier = () => set('price_tiers', [...tiers, { min_qty: tiers.length ? tiers[tiers.length - 1].min_qty + 5 : 1, unit_price: 0 }]);
  const removeTier = (idx: number) => set('price_tiers', tiers.filter((_, i) => i !== idx));

  if (isLoading || !gallery) return <AdminLayout title="Galeria"><div className="p-6">Carregando...</div></AdminLayout>;

  const publicUrl = `${window.location.origin}/galeria/${gallery.slug}`;
  const sample = computePrice(tiers, 10);

  return (
    <AdminLayout title={gallery.name}>
      <div className="sticky top-0 z-30 -mx-6 -mt-6 mb-6 px-6 py-3 bg-background/95 backdrop-blur border-b border-border flex items-center gap-3">
        <Link to="/admin/galleries" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>
        <div className="flex-1" />
        <button onClick={() => setShowPreview(true)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <Eye className="w-4 h-4" /> Pré-visualizar
        </button>
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

      <div className="max-w-6xl space-y-6">
        <GalleryStatsPanel galleryId={gallery.id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <div>
                <Label>Capa</Label>
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted">
                  {gallery.cover_url
                    ? <img src={gallery.cover_url} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Sem capa</div>}
                </div>
                <Button variant="secondary" className="w-full mt-2" disabled={!gallery.cover_url} onClick={() => setCropUrl(gallery.cover_url)}>
                  <Crop className="w-4 h-4 mr-2" /> Reenquadrar capa
                </Button>
                <p className="text-xs text-muted-foreground mt-1">Passe o mouse em qualquer foto abaixo e use "Usar como capa" para escolher e enquadrar.</p>
              </div>
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
              <h3 className="font-medium">Venda avulsa</h3>
              <p className="text-xs text-muted-foreground">
                Defina faixas de quantidade. O cliente seleciona as fotos e o valor unitário cai automaticamente ao atingir cada faixa.
              </p>
              {tiers.map((t, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label className="text-xs">A partir de</Label>
                    <Input type="number" min={1} value={t.min_qty} onChange={e => setTier(i, 'min_qty', Number(e.target.value))} />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Valor unitário (R$)</Label>
                    <Input type="number" min={0} step="0.01" value={t.unit_price} onChange={e => setTier(i, 'unit_price', Number(e.target.value))} />
                  </div>
                  <button onClick={() => removeTier(i)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
              <Button variant="secondary" size="sm" onClick={addTier}><Plus className="w-4 h-4 mr-2" /> Adicionar faixa</Button>
              {tiers.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  Exemplo com 10 itens: {brl(sample.unitPrice)} cada, total {brl(sample.total)}
                  {sample.discount > 0 && ` (economia de ${brl(sample.discount)})`}.
                </p>
              )}
              {tiers.length === 0 && (
                <p className="text-xs text-muted-foreground">Sem faixas configuradas: a galeria funciona como entrega gratuita com download liberado.</p>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-5 space-y-4">
              <h3 className="font-medium">Aparência</h3>
              <div>
                <Label>Layout</Label>
                <select className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm" value={g.layout ?? 'grid'} onChange={e => set('layout', e.target.value)}>
                  <option value="grid">Grade</option>
                  <option value="mosaic">Mosaico</option>
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
            <div className="bg-card border border-border rounded-xl p-5 space-y-3">
              <h3 className="font-medium flex items-center gap-2"><FolderPlus className="w-4 h-4" /> Álbuns</h3>
              <div className="flex gap-2">
                <Input placeholder="Nome do álbum (ex: Cerimônia)" value={newAlbum} onChange={e => setNewAlbum(e.target.value)} onKeyDown={e => e.key === 'Enter' && createAlbum()} />
                <Button onClick={createAlbum} disabled={!newAlbum.trim()}><Plus className="w-4 h-4" /></Button>
              </div>
              {(albums ?? []).length > 0 && (
                <ul className="divide-y divide-border">
                  {(albums ?? []).map((a: any) => (
                    <li key={a.id} className="py-2 flex items-center gap-2 text-sm">
                      <span className="flex-1">{a.name}</span>
                      <span className="text-xs text-muted-foreground">{(items ?? []).filter((i: any) => i.album_id === a.id).length} itens</span>
                      <button onClick={() => removeAlbum(a.id)} className="text-destructive p-1 rounded hover:bg-destructive/10"><Trash2 className="w-4 h-4" /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div
              className={`rounded-xl border-2 border-dashed p-8 text-center transition ${dragOver ? 'border-primary bg-primary/5' : 'border-border'}`}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
            >
              <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden" onChange={e => e.target.files && handleFiles(e.target.files)} />
              <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Arraste fotos e vídeos aqui, ou</p>
              {(albums ?? []).length > 0 && (
                <select className="mt-3 rounded-md border border-input bg-background px-3 py-2 text-sm" value={uploadAlbum} onChange={e => setUploadAlbum(e.target.value)}>
                  <option value="">Enviar para: galeria principal</option>
                  {(albums ?? []).map((a: any) => <option key={a.id} value={a.id}>Enviar para: {a.name}</option>)}
                </select>
              )}
              <div>
                <Button variant="secondary" className="mt-3" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Enviando {progress.done}/{progress.total}</> : 'Selecionar arquivos'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
              {(items ?? []).map((it: any) => (
                <div key={it.id} className="group relative bg-muted rounded-lg overflow-hidden">
                  <div className="aspect-square">
                    {it.kind === 'video' ? (
                      <video src={it.preview_url ?? ''} className="w-full h-full object-cover" muted />
                    ) : (
                      <img src={it.preview_url ?? ''} alt="" loading="lazy" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="absolute top-1 left-1 px-1.5 py-0.5 text-[10px] rounded bg-black/60 text-white flex items-center gap-1">
                    {it.kind === 'video' ? <Video className="w-3 h-3" /> : <ImgIcon className="w-3 h-3" />}
                    {it.favorite_count > 0 ? `${it.favorite_count} fav` : it.kind}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-1 bg-background/90">
                    <select className="w-full text-[11px] rounded border border-input bg-background px-1 py-1" value={it.album_id ?? ''} onChange={e => moveToAlbum(it.id, e.target.value)}>
                      <option value="">Galeria principal</option>
                      {(albums ?? []).map((a: any) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>
                  <div className="absolute inset-0 bottom-8 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-2">
                    {it.kind === 'image' && (
                      <button onClick={() => setCropUrl(it.preview_url)} className="text-xs px-2 py-1 rounded bg-white/90 text-black flex items-center gap-1">
                        <Crop className="w-3 h-3" /> Usar como capa
                      </button>
                    )}
                    <button onClick={() => removeItem(it)} className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground flex items-center gap-1">
                      <Trash2 className="w-3 h-3" /> Remover
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CoverCropper open={!!cropUrl} imageUrl={cropUrl} onClose={() => setCropUrl(null)} onSave={saveCover} />
      <GalleryPreview open={showPreview} onClose={() => setShowPreview(false)} gallery={g} items={items ?? []} />
    </AdminLayout>
  );
};

export default AdminGalleryEdit;
