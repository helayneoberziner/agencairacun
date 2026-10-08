import { useEffect, useRef, useState } from 'react';
import { useCases } from '@/hooks/useCases';
import { useSegmentsList } from '@/hooks/useSegmentPage';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ImageUpload from './ImageUpload';
import { RefreshCw, Image as ImageIcon, ExternalLink } from 'lucide-react';

const PAGES = [
  { path: '/', name: 'Página inicial' }, { path: '/marketing', name: 'Marketing' },
  { path: '/produtora', name: 'Produtora' }, { path: '/cases', name: 'Cases' },
  { path: '/sobre', name: 'Sobre e contato' }, { path: '/restaurantes', name: 'Restaurantes' },
  { path: '/contato', name: 'Contato' },
];

export default function SocialSharingPreview({ suggestion }: { suggestion?: { title: string; description: string } }) {
  const { data: segments = [] } = useSegmentsList();
  const { data: cases = [] } = useCases();
  const [path, setPath] = useState('/');
  const [reload, setReload] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState('Carregando metadados');
  const frame = useRef<HTMLIFrameElement>(null);
  const url = `https://agenciaracun.com${path}`;
  const pages = [...PAGES,
    ...segments.filter(s => s.is_active).map(s => ({ name: s.name, path: ['imobiliario', 'empresas', 'eventos', 'marcas', 'politica'].includes(s.slug) ? `/${s.slug}` : `/s/${s.slug}` })),
    ...cases.map(c => ({ name: c.client_name, path: `/cases/${c.slug}` })),
  ].filter((p, i, all) => all.findIndex(x => x.path === p.path) === i);

  useEffect(() => {
    if (suggestion) { setTitle(suggestion.title); setDescription(suggestion.description); }
  }, [suggestion]);

  useEffect(() => {
    setTitle(''); setDescription(''); setImage(''); setStatus('Carregando metadados');
    let observer: MutationObserver | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const read = () => {
      const doc = frame.current?.contentDocument;
      if (!doc || doc.location.pathname !== path) return;
      const meta = (selector: string) => doc.querySelector<HTMLMetaElement>(selector)?.content || '';
      const pageTitle = meta('meta[property="og:title"]') || doc.title;
      if (!pageTitle) return;
      setTitle(pageTitle);
      setDescription(meta('meta[property="og:description"]') || meta('meta[name="description"]'));
      setImage(meta('meta[property="og:image"]'));
      setStatus('Metadados atuais da página · simulação de compartilhamento');
    };
    const onLoad = () => {
      observer?.disconnect();
      const doc = frame.current?.contentDocument;
      if (!doc) { setStatus('Não foi possível carregar esta página'); return; }
      read();
      observer = new MutationObserver(() => { clearTimeout(timeout); timeout = setTimeout(read, 300); });
      observer.observe(doc.head, { childList: true, subtree: true, attributes: true });
    };
    const element = frame.current;
    element?.addEventListener('load', onLoad);
    return () => { element?.removeEventListener('load', onLoad); observer?.disconnect(); clearTimeout(timeout); };
  }, [path, reload]);

  return (
    <section className="space-y-5 border-t border-border pt-6">
      <h2 className="text-lg font-display font-semibold">Prévia de compartilhamento</h2>
      <div className="flex items-end gap-2">
        <div className="space-y-2 flex-1 min-w-0">
          <Label htmlFor="sharing-page">Página</Label>
          <select id="sharing-page" value={path} onChange={e => setPath(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            {pages.map(p => <option key={p.path} value={p.path}>{p.name}</option>)}
          </select>
        </div>
        <Button variant="outline" size="icon" title="Atualizar metadados" aria-label="Atualizar metadados" onClick={() => setReload(r => r + 1)}><RefreshCw className="h-4 w-4" /></Button>
        <Button asChild variant="outline" size="icon"><a href={path} target="_blank" rel="noreferrer" aria-label="Abrir página" title="Abrir página"><ExternalLink className="h-4 w-4" /></a></Button>
      </div>
      <p role="status" className="text-xs text-muted-foreground">{status}</p>
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2"><Label htmlFor="sharing-title">Título da prévia</Label><Input id="sharing-title" value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div className="space-y-2"><Label htmlFor="sharing-description">Descrição da prévia</Label><Textarea id="sharing-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} /></div>
          <ImageUpload label="Imagem da prévia" value={image} onChange={setImage} folder="seo" />
        </div>
        <div className="space-y-5 min-w-0">
          <div className="space-y-2"><h3 className="text-sm text-muted-foreground">WhatsApp e redes sociais</h3>
            <div className="rounded-lg border border-border overflow-hidden bg-card">
              <div className="aspect-[1.91/1] bg-muted flex items-center justify-center overflow-hidden">
                {image ? <img src={image} alt="Imagem de compartilhamento da página" className="w-full h-full object-cover" /> : <ImageIcon className="h-8 w-8 text-muted-foreground" />}
              </div>
              <div className="p-4 space-y-2 break-words"><p className="text-xs text-muted-foreground">agenciaracun.com</p><p className="font-semibold line-clamp-2">{title}</p><p className="text-sm text-muted-foreground line-clamp-3">{description}</p></div>
            </div>
          </div>
          <div className="space-y-2 break-words"><h3 className="text-sm text-muted-foreground">Google</h3><p className="text-xs text-muted-foreground">{url}</p><p className="text-lg text-accent">{title}</p><p className="text-sm text-muted-foreground">{description}</p></div>
        </div>
      </div>
      <iframe ref={frame} key={`${path}:${reload}`} src={path} title="Leitura dos metadados" className="hidden" aria-hidden="true" tabIndex={-1} />
    </section>
  );
}