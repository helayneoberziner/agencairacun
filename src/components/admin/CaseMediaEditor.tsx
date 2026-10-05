import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronUp, ChevronDown, Image as ImgIcon, Video, Star, Sparkles, Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import VideoInput from './VideoInput';
import ImageUpload from './ImageUpload';
import { parseYouTubeId, getYouTubeThumb, isFileVideoUrl } from '@/lib/videoUtils';

interface Item {
  id: string;
  case_id: string;
  kind: string;
  url: string | null;
  youtube_id: string | null;
  caption: string | null;
  alt_text: string | null;
  visual_description: string | null;
  section: string;
  display_order: number;
}

const SECTIONS: { value: string; label: string }[] = [
  { value: 'audiovisual', label: 'Audiovisual' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'galeria', label: 'Galeria' },
  { value: 'bastidores', label: 'Bastidores' },
];

const CaseMediaEditor = ({ caseId, clientName = '', caseTitle = '' }: { caseId: string; clientName?: string; caseTitle?: string }) => {
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [items, setItems] = useState<Item[]>([]);
  const [section, setSection] = useState('audiovisual');
  const [addKind, setAddKind] = useState<'image' | 'video'>('video');
  const [draftUrl, setDraftUrl] = useState('');
  const [draftCaption, setDraftCaption] = useState('');
  const [coverId, setCoverId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from('case_media' as any).select('*').eq('case_id', caseId).order('display_order');
    setItems((data ?? []) as unknown as Item[]);
    const { data: caseRow } = await supabase.from('cases' as any).select('cover_media_id').eq('id', caseId).maybeSingle();
    setCoverId(((caseRow as any)?.cover_media_id ?? null) as string | null);
  };
  useEffect(() => { load(); }, [caseId]);

  const setAsCover = async (id: string) => {
    const { error } = await supabase.from('cases' as any).update({ cover_media_id: id }).eq('id', caseId);
    if (error) { toast.error('Erro ao definir capa'); return; }
    setCoverId(id);
    toast.success('Capa definida');
  };

  const add = async () => {
    if (!draftUrl) { toast.error('Adicione a mídia'); return; }
    const ytId = parseYouTubeId(draftUrl);
    const kind = addKind === 'image' ? 'image' : (ytId ? 'video_youtube' : 'video_file');
    const sectionItems = items.filter(i => i.section === section);
    const payload: any = {
      case_id: caseId, kind, section,
      url: addKind === 'image' || !ytId ? draftUrl : null,
      youtube_id: ytId || null,
      caption: draftCaption || null,
      display_order: sectionItems.length,
    };
    const { error } = await supabase.from('case_media' as any).insert(payload);
    if (error) { toast.error('Erro: ' + error.message); return; }
    setDraftUrl(''); setDraftCaption('');
    toast.success('Adicionado');
    load();
  };

  const describe = async (it: Item) => {
    if (!it.url) return;
    setBusy(b => ({ ...b, [it.id]: true }));
    try {
      const { data, error } = await supabase.functions.invoke('describe-image', {
        body: { image_url: it.url, client_name: clientName, case_title: caseTitle },
      });
      if (error) {
        let msg = error.message;
        try { msg = (await (error as any).context?.json())?.error || msg; } catch { /* ignore */ }
        throw new Error(typeof msg === 'string' ? msg : 'Falha');
      }
      if (data?.error) throw new Error(data.error);
      await supabase.from('case_media' as any).update({ alt_text: data.alt_text, visual_description: data.visual_description }).eq('id', it.id);
      setItems(prev => prev.map(x => x.id === it.id ? { ...x, alt_text: data.alt_text, visual_description: data.visual_description } : x));
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha ao descrever imagem');
      return false;
    } finally { setBusy(b => ({ ...b, [it.id]: false })); }
  };

  const describeMissing = async () => {
    const targets = items.filter(i => i.kind === 'image' && i.url && !i.alt_text);
    if (!targets.length) { toast.info('Todas as imagens já têm texto alternativo'); return; }
    let ok = 0;
    for (const t of targets) { if (await describe(t)) ok++; else break; }
    if (ok) toast.success(`${ok} ${ok === 1 ? 'imagem descrita' : 'imagens descritas'}`);
  };

  const saveText = async (id: string, field: 'alt_text' | 'visual_description', value: string) => {
    await supabase.from('case_media' as any).update({ [field]: value || null }).eq('id', id);
  };

  const remove = async (id: string) => {
    if (!confirm('Remover?')) return;
    await supabase.from('case_media' as any).delete().eq('id', id);
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const sec = items.filter(i => i.section === section).sort((a, b) => a.display_order - b.display_order);
    const idx = sec.findIndex(i => i.id === id);
    const ni = idx + dir;
    if (ni < 0 || ni >= sec.length) return;
    const a = sec[idx], b = sec[ni];
    await Promise.all([
      supabase.from('case_media' as any).update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('case_media' as any).update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    load();
  };

  const list = items.filter(i => i.section === section).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {SECTIONS.map(s => (
          <Button key={s.value} type="button" size="sm" variant={section === s.value ? 'default' : 'outline'} onClick={() => setSection(s.value)}>
            {s.label} ({items.filter(i => i.section === s.value).length})
          </Button>
        ))}
      </div>

      {items.some(i => i.kind === 'image') && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dashed border-primary/40 p-3">
          <span className="text-sm text-muted-foreground">
            {items.filter(i => i.kind === 'image' && !i.alt_text).length} imagens sem texto alternativo
          </span>
          <Button type="button" size="sm" variant="outline" onClick={describeMissing} disabled={Object.values(busy).some(Boolean)}>
            <Sparkles className="w-4 h-4 mr-1.5" /> Gerar descrições com IA
          </Button>
        </div>
      )}

      <div className="glass-card p-4 space-y-3">
        <div className="flex gap-2">
          <Button type="button" size="sm" variant={addKind === 'video' ? 'default' : 'outline'} onClick={() => setAddKind('video')}><Video className="w-3 h-3 mr-1" /> Vídeo</Button>
          <Button type="button" size="sm" variant={addKind === 'image' ? 'default' : 'outline'} onClick={() => setAddKind('image')}><ImgIcon className="w-3 h-3 mr-1" /> Imagem</Button>
        </div>
        {addKind === 'video' ? (
          <VideoInput label="Adicionar vídeo" value={draftUrl} onChange={setDraftUrl} folder="cases" />
        ) : (
          <ImageUpload label="Adicionar imagem" value={draftUrl} onChange={setDraftUrl} folder="cases" />
        )}
        <Input placeholder="Legenda (opcional)" value={draftCaption} onChange={e => setDraftCaption(e.target.value)} />
        <Button type="button" onClick={add}>Adicionar à seção {SECTIONS.find(s => s.value === section)?.label}</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {list.map(it => {
          const ytThumb = it.youtube_id ? getYouTubeThumb(it.youtube_id, 'hq') : null;
          const isVideo = it.kind !== 'image';
          return (
            <div key={it.id} className="glass-card overflow-hidden">
              <div className="aspect-video relative bg-muted">
                {ytThumb ? (
                  <img src={ytThumb} alt="" className="w-full h-full object-cover" />
                ) : isVideo && it.url ? (
                  <video src={it.url} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                ) : it.url ? (
                  <img src={it.url} alt="" className="w-full h-full object-cover" />
                ) : null}
                {isVideo && (
                  <span className={`absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded ${it.youtube_id ? 'bg-red-600/90 text-white' : 'bg-background/80'}`}>
                    {it.youtube_id ? 'YouTube' : 'Arquivo'}
                  </span>
                )}
              </div>
              <div className="p-2 text-xs">
                <p className="truncate">{it.caption || 'Sem legenda'}</p>
                {it.kind === 'image' && (
                  <div className="space-y-1.5 mt-2">
                    <Textarea rows={2} className="text-xs min-h-0" placeholder="Texto alternativo"
                      value={it.alt_text ?? ''}
                      onChange={e => setItems(prev => prev.map(x => x.id === it.id ? { ...x, alt_text: e.target.value } : x))}
                      onBlur={e => saveText(it.id, 'alt_text', e.target.value)} />
                    <Textarea rows={3} className="text-xs min-h-0" placeholder="Descrição visual"
                      value={it.visual_description ?? ''}
                      onChange={e => setItems(prev => prev.map(x => x.id === it.id ? { ...x, visual_description: e.target.value } : x))}
                      onBlur={e => saveText(it.id, 'visual_description', e.target.value)} />
                    <button type="button" onClick={() => describe(it)} disabled={busy[it.id]}
                      className="inline-flex items-center gap-1 text-primary hover:underline disabled:opacity-50">
                      {busy[it.id] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      {it.alt_text ? 'Gerar de novo' : 'Gerar com IA'}
                    </button>
                  </div>
                )}
                <div className="flex justify-between mt-2">
                  <div className="flex gap-1">
                    <button onClick={() => move(it.id, -1)} className="p-1 hover:bg-muted rounded"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => move(it.id, 1)} className="p-1 hover:bg-muted rounded"><ChevronDown className="w-3 h-3" /></button>
                    <button
                      type="button"
                      onClick={() => setAsCover(it.id)}
                      title={coverId === it.id ? 'Esta é a capa' : 'Definir como capa'}
                      className={`p-1 rounded ${coverId === it.id ? 'text-yellow-500 bg-yellow-500/10' : 'hover:bg-muted text-muted-foreground'}`}
                    >
                      <Star className={`w-3 h-3 ${coverId === it.id ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                  <button onClick={() => remove(it.id)} className="p-1 text-destructive hover:bg-destructive/10 rounded"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <p className="col-span-full text-center text-sm text-muted-foreground py-6">Nenhuma mídia nesta seção ainda.</p>
        )}
      </div>
    </div>
  );
};

export default CaseMediaEditor;