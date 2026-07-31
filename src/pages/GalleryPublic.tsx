import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Download, Lock, Loader2, Heart, Play, ShoppingBag, Check, X } from 'lucide-react';
import SEO from '@/components/seo/SEO';
import GallerySlideshow from '@/components/gallery/GallerySlideshow';
import { brl, computePrice, galleryClientKey, parseTiers } from '@/lib/galleryPricing';

interface GalleryMeta {
  id: string; slug: string; name: string; client_name: string;
  cover_url: string | null; title_font: string; title_color: string;
  layout: string; access_type: string; has_password: boolean;
  event_date: string | null; watermark_enabled: boolean; watermark_text: string | null;
  expires_at: string | null; price_tiers: unknown;
}

const GalleryPublic = () => {
  const { slug = '' } = useParams();
  const [meta, setMeta] = useState<GalleryMeta | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [albumId, setAlbumId] = useState<string | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [needsPassword, setNeedsPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [viewer, setViewer] = useState<{ index: number; presentation: boolean } | null>(null);
  const [downloading, setDownloading] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showCart, setShowCart] = useState(false);
  const [orderEmail, setOrderEmail] = useState('');
  const [orderName, setOrderName] = useState('');
  const [placing, setPlacing] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const tiers = useMemo(() => parseTiers(meta?.price_tiers), [meta?.price_tiers]);
  const sellEnabled = tiers.length > 0;

  const loadContent = useCallback(async (m: GalleryMeta) => {
    const clientKey = galleryClientKey();
    const [its, albs, favs] = await Promise.all([
      supabase.from('gallery_items').select('*').eq('gallery_id', m.id)
        .order('display_order', { ascending: true }).order('created_at', { ascending: true }),
      supabase.from('gallery_albums').select('*').eq('gallery_id', m.id).order('display_order', { ascending: true }),
      supabase.from('gallery_favorites').select('item_id').eq('gallery_id', m.id).eq('client_key', clientKey),
    ]);
    setItems(its.data ?? []);
    setAlbums(albs.data ?? []);
    setFavorites(new Set((favs.data ?? []).map((f: any) => f.item_id)));
  }, []);

  const requestAccess = useCallback(async (m: GalleryMeta, pw: string) => {
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('gallery-access', { body: { slug: m.slug, password: pw || undefined } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      setToken((data as any).token);
      setNeedsPassword(false);
      const visitFlag = `racun_gallery_visit_${m.id}`;
      if (!sessionStorage.getItem(visitFlag)) {
        sessionStorage.setItem(visitFlag, '1');
        await supabase.from('gallery_visits').insert({ gallery_id: m.id });
      }
      await loadContent(m);
    } catch (e: any) {
      const msg = e?.message === 'invalid_password' ? 'Senha incorreta' : e?.message ?? 'Falha ao acessar';
      toast.error(msg);
      if (e?.message === 'invalid_password') setNeedsPassword(true);
    } finally { setChecking(false); setLoading(false); }
  }, [loadContent]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true); setNotFound(false); setToken(null); setItems([]); setAlbums([]);
      const { data, error } = await supabase.rpc('get_gallery_by_slug', { _slug: slug });
      if (!active) return;
      if (error || !data || !(data as any[]).length) { setNotFound(true); setLoading(false); return; }
      const m = (data as any[])[0] as GalleryMeta;
      setMeta(m);
      if (m.has_password) { setNeedsPassword(true); setLoading(false); }
      else await requestAccess(m, '');
    })();
    return () => { active = false; };
  }, [slug, requestAccess]);

  const visible = useMemo(() => {
    let list = items;
    if (albumId !== 'all') list = list.filter(i => i.album_id === albumId);
    if (onlyFavorites) list = list.filter(i => favorites.has(i.id));
    return list;
  }, [items, albumId, onlyFavorites, favorites]);

  const toggleFavorite = async (itemId: string) => {
    if (!meta) return;
    const clientKey = galleryClientKey();
    const isFav = favorites.has(itemId);
    setFavorites(prev => {
      const n = new Set(prev);
      isFav ? n.delete(itemId) : n.add(itemId);
      return n;
    });
    if (isFav) {
      await supabase.from('gallery_favorites').delete().eq('item_id', itemId).eq('client_key', clientKey);
    } else {
      const { error } = await supabase.from('gallery_favorites').insert({ gallery_id: meta.id, item_id: itemId, client_key: clientKey });
      if (error) toast.error('Não foi possível favoritar');
    }
  };

  const toggleSelected = (itemId: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(itemId) ? n.delete(itemId) : n.add(itemId);
      return n;
    });
  };

  const price = useMemo(() => computePrice(tiers, selected.size), [tiers, selected.size]);

  const placeOrder = async () => {
    if (!meta || !selected.size) return;
    if (!orderEmail.trim()) { toast.error('Informe seu e-mail'); return; }
    setPlacing(true);
    try {
      const { data, error } = await supabase.functions.invoke('gallery-order', {
        body: { slug: meta.slug, token, item_ids: Array.from(selected), client_email: orderEmail.trim(), client_name: orderName.trim() || null },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success('Pedido registrado. A Racun enviará o link de pagamento para o seu e-mail.');
      setSelected(new Set()); setShowCart(false);
    } catch (e: any) {
      toast.error(e?.message ?? 'Falha ao registrar pedido');
    } finally { setPlacing(false); }
  };

  const download = async (itemId: string) => {
    if (!token) return;
    setDownloading(itemId);
    try {
      const { data, error } = await supabase.functions.invoke('gallery-download', { body: { token, item_id: itemId } });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      const a = document.createElement('a');
      a.href = (data as any).url; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
    } catch (e: any) {
      const map: Record<string, string> = { purchase_required: 'Esta galeria é de venda avulsa. Selecione as fotos para comprar.', limit_reached: 'Limite de downloads atingido.' };
      toast.error(map[e?.message] ?? e?.message ?? 'Falha ao baixar');
    } finally { setDownloading(null); }
  };

  const gridClass = useMemo(() => {
    if (meta?.layout === 'mosaic') return 'columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3';
    return '';
  }, [meta?.layout]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin w-6 h-6 text-primary" /></div>;
  if (notFound) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <h1 className="font-display text-3xl mb-2">Galeria não encontrada</h1>
      <p className="text-muted-foreground text-sm">O link pode ter expirado ou a galeria ainda não foi publicada.</p>
    </div>
  );
  if (!meta) return null;

  if (needsPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <SEO title={`${meta.name} | Galeria Racun`} description="Galeria de entrega protegida." path={`/galeria/${meta.slug}`} noindex />
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

  const isMosaic = meta.layout === 'mosaic';

  return (
    <div className="min-h-screen bg-background">
      <SEO title={`${meta.name} | Galeria Racun`} description={`Galeria de entrega para ${meta.client_name || meta.name}`} path={`/galeria/${meta.slug}`} noindex />

      <header className="relative h-[60vh] min-h-[340px] w-full overflow-hidden">
        {meta.cover_url && <img src={meta.cover_url} alt={meta.name} className="absolute inset-0 w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/55 to-background" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-7xl leading-tight" style={{ fontFamily: meta.title_font, color: meta.title_color }}>{meta.name}</h1>
          {meta.client_name && <p className="mt-3 text-white/80">{meta.client_name}</p>}
          {meta.event_date && <p className="text-sm text-white/60 mt-1">{new Date(meta.event_date).toLocaleDateString('pt-BR')}</p>}
          {items.length > 0 && (
            <Button className="mt-8" onClick={() => setViewer({ index: 0, presentation: true })}>
              <Play className="w-4 h-4 mr-2" /> Modo apresentação
            </Button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {albums.length > 0 && (
            <>
              <button onClick={() => setAlbumId('all')} className={`px-4 py-2 rounded-full text-sm transition ${albumId === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
                Todas ({items.length})
              </button>
              {albums.map(a => (
                <button key={a.id} onClick={() => setAlbumId(a.id)} className={`px-4 py-2 rounded-full text-sm transition ${albumId === a.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
                  {a.name} ({items.filter(i => i.album_id === a.id).length})
                </button>
              ))}
            </>
          )}
          <div className="flex-1" />
          <button onClick={() => setOnlyFavorites(v => !v)} className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition ${onlyFavorites ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'}`}>
            <Heart className={`w-4 h-4 ${onlyFavorites ? 'fill-current' : ''}`} /> Favoritas ({favorites.size})
          </button>
        </div>

        <div className={isMosaic ? gridClass : 'grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}>
          {visible.map((it, idx) => (
            <div key={it.id} className={`group relative overflow-hidden rounded-lg bg-muted ${isMosaic ? 'mb-3 break-inside-avoid' : 'aspect-square'}`}>
              <button onClick={() => setViewer({ index: idx, presentation: false })} className="block w-full h-full">
                {it.kind === 'video' ? (
                  <video src={it.preview_url ?? ''} className="w-full h-full object-cover" muted playsInline />
                ) : (
                  <img src={it.preview_url ?? ''} alt={it.file_name ?? ''} loading="lazy" className={`w-full ${isMosaic ? 'h-auto' : 'h-full'} object-cover grayscale-0 transition-transform duration-500 group-hover:scale-[1.03]`} />
                )}
              </button>
              <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition">
                <button onClick={() => toggleFavorite(it.id)} aria-label="Favoritar"
                  className={`p-2 rounded-full backdrop-blur ${favorites.has(it.id) ? 'bg-primary text-primary-foreground' : 'bg-black/50 text-white hover:bg-black/70'}`}>
                  <Heart className={`w-4 h-4 ${favorites.has(it.id) ? 'fill-current' : ''}`} />
                </button>
                {sellEnabled && (
                  <button onClick={() => toggleSelected(it.id)} aria-label="Selecionar para compra"
                    className={`p-2 rounded-full backdrop-blur ${selected.has(it.id) ? 'bg-primary text-primary-foreground' : 'bg-black/50 text-white hover:bg-black/70'}`}>
                    {selected.has(it.id) ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </button>
                )}
                {!sellEnabled && (
                  <button onClick={() => download(it.id)} aria-label="Baixar" disabled={downloading === it.id}
                    className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 backdrop-blur">
                    {downloading === it.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  </button>
                )}
              </div>
              {favorites.has(it.id) && (
                <div className="absolute top-2 left-2 p-1.5 rounded-full bg-primary/90 text-primary-foreground md:group-hover:opacity-0 transition">
                  <Heart className="w-3 h-3 fill-current" />
                </div>
              )}
            </div>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            {onlyFavorites ? 'Você ainda não marcou favoritas.' : 'Ainda não há arquivos nesta galeria.'}
          </p>
        )}
      </main>

      {sellEnabled && selected.size > 0 && !showCart && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[min(94vw,560px)] rounded-2xl border border-border bg-card/95 backdrop-blur px-5 py-4 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-medium">{selected.size} {selected.size === 1 ? 'item selecionado' : 'itens selecionados'}</p>
              <p className="text-xs text-muted-foreground">
                {brl(price.unitPrice)} cada · total {brl(price.total)}
                {price.discount > 0 && <span className="text-primary"> · economia de {brl(price.discount)}</span>}
              </p>
              {price.nextTier && (
                <p className="text-xs text-primary mt-1">
                  Selecione {price.missingForNextTier} {price.missingForNextTier === 1 ? 'item' : 'itens'} a mais e pague {brl(price.nextTier.unit_price)} cada.
                </p>
              )}
            </div>
            <Button onClick={() => setShowCart(true)}>Finalizar</Button>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-end md:items-center justify-center p-4" onClick={() => setShowCart(false)}>
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Resumo da seleção</h2>
              <button onClick={() => setShowCart(false)} className="text-muted-foreground hover:text-foreground"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Itens</span><span>{price.qty}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Valor unitário</span><span>{brl(price.unitPrice)}</span></div>
              {price.discount > 0 && (
                <div className="flex justify-between text-primary"><span>Desconto por quantidade</span><span>{brl(price.discount)}</span></div>
              )}
              <div className="flex justify-between text-lg pt-2 border-t border-border mt-2"><span>Total</span><span className="font-medium">{brl(price.total)}</span></div>
            </div>
            <div className="space-y-2">
              <Input placeholder="Seu nome" value={orderName} onChange={e => setOrderName(e.target.value)} />
              <Input type="email" placeholder="Seu e-mail" value={orderEmail} onChange={e => setOrderEmail(e.target.value)} />
            </div>
            <Button className="w-full" onClick={placeOrder} disabled={placing}>
              {placing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Confirmar pedido
            </Button>
            <p className="text-xs text-muted-foreground text-center">A Racun envia o link de pagamento e a liberação dos arquivos em alta por e-mail.</p>
          </div>
        </div>
      )}

      {viewer && visible.length > 0 && (
        <GallerySlideshow
          items={visible}
          index={Math.min(viewer.index, visible.length - 1)}
          presentation={viewer.presentation}
          onIndexChange={i => setViewer(v => (v ? { ...v, index: i } : v))}
          onClose={() => setViewer(null)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          selected={selected}
          onToggleSelected={toggleSelected}
          sellEnabled={sellEnabled}
          onDownload={sellEnabled ? undefined : download}
          downloadingId={downloading}
        />
      )}
    </div>
  );
};

export default GalleryPublic;
