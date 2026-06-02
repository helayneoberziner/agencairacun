import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, ChevronUp, ChevronDown, Image as ImgIcon, Video } from 'lucide-react';
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
  section: string;
  display_order: number;
}

const SECTIONS: { value: string; label: string }[] = [
  { value: 'audiovisual', label: 'Audiovisual' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'galeria', label: 'Galeria' },
  { value: 'bastidores', label: 'Bastidores' },
];

const CaseMediaEditor = ({ caseId }: { caseId: string }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [section, setSection] = useState('audiovisual');
  const [addKind, setAddKind] = useState<'image' | 'video'>('video');
  const [draftUrl, setDraftUrl] = useState('');
  const [draftCaption, setDraftCaption] = useState('');

  const load = async () => {
    const { data } = await supabase.from('case_media' as any).select('*').eq('case_id', caseId).order('display_order');
    setItems((data ?? []) as unknown as Item[]);
  };
  useEffect(() => { load(); }, [caseId]);

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
                <p className="truncate">{it.caption || '—'}</p>
                <div className="flex justify-between mt-2">
                  <div className="flex gap-1">
                    <button onClick={() => move(it.id, -1)} className="p-1 hover:bg-muted rounded"><ChevronUp className="w-3 h-3" /></button>
                    <button onClick={() => move(it.id, 1)} className="p-1 hover:bg-muted rounded"><ChevronDown className="w-3 h-3" /></button>
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