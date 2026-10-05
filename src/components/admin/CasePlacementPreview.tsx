import { Eye, EyeOff, ExternalLink } from 'lucide-react';

interface Props {
  slug: string;
  isActive: boolean;
  showOnHome: boolean;
  homeAudio: boolean;
  isFeatured: boolean;
  produtora: boolean;
  segments: string[];
  segmentList: { slug: string; label: string; path: string }[];
}

const CasePlacementPreview = ({ slug, isActive, showOnHome, homeAudio, isFeatured, produtora, segments, segmentList }: Props) => {
  const rows: { page: string; path: string; section: string; on: boolean }[] = [
    { page: 'Página do case', path: slug ? `/cases/${slug}` : '/cases', section: 'Página própria com todo o conteúdo', on: !!slug },
    { page: 'Cases', path: '/cases', section: isFeatured ? 'Lista de cases, em destaque' : 'Lista de cases', on: true },
    { page: 'Home', path: '/', section: 'Seção de Cases', on: showOnHome },
    { page: 'Home', path: '/', section: 'Bloco audiovisual (vídeos do case)', on: homeAudio },
    { page: 'Produtora', path: '/produtora', section: 'Destaques da Produtora', on: produtora },
    ...segmentList.map(s => ({
      page: s.label, path: s.path, section: 'Portfólio e filtro do segmento', on: segments.includes(s.slug),
    })),
  ];
  const visible = rows.filter(r => r.on);

  return (
    <div className="rounded-xl border border-border p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm">Prévia de exibição</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full border ${isActive ? 'border-primary/40 text-primary' : 'border-border text-muted-foreground'}`}>
          {isActive ? 'Será publicado ao salvar' : 'Inativo, não aparece no site'}
        </span>
      </div>
      <p className="text-xs text-muted-foreground">
        {isActive ? `Este case vai aparecer em ${visible.length} ${visible.length === 1 ? 'local' : 'locais'}:` : 'Ao ativar, ele vai aparecer nestes locais:'}
      </p>
      <ul className="divide-y divide-border">
        {rows.map((r, i) => (
          <li key={i} className={`flex items-center gap-3 py-2 text-sm ${r.on ? '' : 'opacity-40'}`}>
            {r.on ? <Eye className="w-4 h-4 text-primary shrink-0" strokeWidth={1.5} /> : <EyeOff className="w-4 h-4 shrink-0" strokeWidth={1.5} />}
            <span className="min-w-0 flex-1">
              <span className="font-medium">{r.page}</span>
              <span className="text-muted-foreground">, {r.section}</span>
            </span>
            {r.on && isActive && (
              <a href={r.path} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary inline-flex items-center gap-1 shrink-0">
                {r.path} <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CasePlacementPreview;
