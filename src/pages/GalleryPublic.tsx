import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Download, X, ChevronLeft, ChevronRight, Lock, Loader2 } from 'lucide-react';
import SEO from '@/components/seo/SEO';

interface GalleryMeta {
  id: string; slug: string; name: string; client_name: string;
  cover_url: string | null; title_font: string; title_color: string;
  layout: string; access_type: string; has_password: boolean;
  event_date: string | null; watermark_enabled: boolean; watermark_text: string | null;
  expires_at: string | null;
}

const GalleryPublic = () => {
  const { slug = '' } = useParams();
  const [meta, setMeta] = useState<GalleryMeta | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);

  const requestAccess = async (m: GalleryMeta, pw: string) => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('gallery-access', { body: { slug: m.slug, password: pw || undefined } });
      if (error) throw error;
      if ((data as any).error) throw new Error((data as any).error);
      setToken((data as any).token);
      setNeedsPassword(false);
      supabase.from('gallery_visits').insert({ gallery_id: m.id }).then(() => {});
      const { data: its } = await supabase
        .from('gallery_items').select('*').eq('gallery_id', m.id)
        .order('display_order', { ascending: true }).order('created_at', { ascending: true });
      setItems(its ?? []);
    } catch (e: any) {
      toast.error(e.message === 'invalid_password' ? 'Senha incorreta' : e.message ?? 'Falha ao acessar');
    } finally { setChecking(false); setLoading(false); }
  };

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.rpc('get_gallery_by_slug', { _slug: slug });
      if (error || !data || !data.length) { setNotFound(true); setLoading(false); return; }
      const m = data[0] as GalleryMeta;
      setMeta(m);
      setNeedsPassword(m.has_password);
      if (!m.has_password) await requestAccess(m, '');
      else setLoading(false);
    })();
     
  }, [slug]);

  const download = async (itemId: string) => {
    if (!token) return;
    setDownloading(itemId);
    try {
      const { data, error } = await supabase.functions.invoke('gallery-download', { body: { token, item_id: itemId } });
      if (error) throw error;
      if ((data as any).error) throw new Error((data as any).error);
      const url = (data as any).url;
      const a = document.createElement('a');
      a.href = url; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
    } catch (e: any) {
      toast.error(e.message ?? 'Falha ao baixar');
    } finally { setDownloading(null); }
  };

  const gridClass = useMemo(() => {
    if (!meta) return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    if (meta.layout === 'mosaic') return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';
    if (meta.layout === 'carousel') return 'grid-cols-1';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  }, [meta]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin w-6 h-6" /></div>;
  if (notFound) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">Galeria não encontrada.</div>;
  if (!meta) return null;

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SEO title={`${meta.name} — Galeria`} description="Galeria de entrega" path={`/galeria/${meta.slug}`} />
        <div className="max-w-sm w-full text-center space-y-6">
          <Lock className="w-8 h-8 mx-auto text-primary" />
          <div>
            <h1 className="text-2xl" style={{ fontFamily: meta.title_font, color: meta.title_color }}>{meta.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">Esta galeria é protegida por senha.</p>
          </div>
          <form onSubmit={e => { e.preventDefault(); requestAccess(meta, password); }} className="space-y-3">
            <Input type="password" placeholder="Senha" value={password} onChange={e => setPassword(e.target.value)} autoFocus />
            <Button type="submit" className="w-full" disabled={checking}>{checking ? 'Verificando...' : 'Entrar'}</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${meta.name} — Galeria`} description={`Galeria de entrega para ${meta.client_name || meta.name}`} path={`/galeria/${meta.slug}`} />
      <header className="relative h-[52vh] min-h-[320px] w-full overflow-hidden">
        {meta.cover_url && (
          <img src={meta.cover_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-background" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl" style={{ fontFamily: meta.title_font, color: meta.title_color }}>{meta.name}</h1>
          {meta.client_name && <p className="mt-3 text-white/80">{meta.client_name}</p>}
          {meta.event_date && <p className="text-sm text-white/60 mt-1">{new Date(meta.event_date).toLocaleDateString('pt-BR')}</p>}
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className={`grid gap-2 ${gridClass}`}>
          {items.map((it, idx) => (
            <button key={it.id} onClick={() => setLightbox(idx)} className="group relative overflow-hidden rounded-lg bg-muted aspect-square">
              {it.kind === 'video' ? (
                <video src={it.preview_url} className="w-full h-full object-cover" muted />
              ) : (
                <img src={it.preview_url} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              )}
            </button>
          ))}
        </div>
        {items.length === 0 && <p className="text-center text-muted-foreground py-16">Ainda não há arquivos nesta galeria.</p>}
      </main>

      {lightbox !== null && items[lightbox] && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white p-2" onClick={() => setLightbox(null)}><X /></button>
          <button className="absolute left-4 text-white/80 hover:text-white p-3" onClick={e => { e.stopPropagation(); setLightbox(i => (i! > 0 ? i! - 1 : items.length - 1)); }}><ChevronLeft /></button>
          <button className="absolute right-4 text-white/80 hover:text-white p-3" onClick={e => { e.stopPropagation(); setLightbox(i => (i! < items.length - 1 ? i! + 1 : 0)); }}><ChevronRight /></button>
          <div className="max-w-[90vw] max-h-[80vh]" onClick={e => e.stopPropagation()}>
            {items[lightbox].kind === 'video' ? (
              <video src={items[lightbox].preview_url} controls className="max-w-[90vw] max-h-[80vh]" />
            ) : (
              <img src={items[lightbox].preview_url} alt="" className="max-w-[90vw] max-h-[80vh] object-contain" />
            )}
            <div className="mt-4 flex justify-center">
              <Button onClick={() => download(items[lightbox].id)} disabled={downloading === items[lightbox].id}>
                {downloading === items[lightbox].id ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                Baixar em alta
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPublic;