import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Home, Megaphone, Film, Layers, Info, Briefcase, UtensilsCrossed, ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmbeddedAdminContext } from '@/components/admin/EmbeddedAdminContext';
import AdminHome from './AdminHome';
import AdminMarketing from './AdminMarketing';
import AdminProdutora from './AdminProdutora';
import AdminCases from './AdminCases';
import AdminSegments from './AdminSegments';
import AdminSobre from './AdminSobre';
import AdminRestaurantes from './AdminRestaurantes';

const EDITORS = { home: AdminHome, marketing: AdminMarketing, produtora: AdminProdutora, cases: AdminCases, segments: AdminSegments, sobre: AdminSobre, restaurantes: AdminRestaurantes };

interface EditorTab {
  key: string;
  label: string;
  icon: any;
  adminPath: string;
  previewPath: string;
}

const TABS: EditorTab[] = [
  { key: 'home',        label: 'Página Inicial', icon: Home,            adminPath: '/admin/home',        previewPath: '/' },
  { key: 'marketing',   label: 'Marketing',      icon: Megaphone,       adminPath: '/admin/marketing',   previewPath: '/marketing' },
  { key: 'produtora',   label: 'Produtora',      icon: Film,            adminPath: '/admin/produtora',   previewPath: '/produtora' },
  { key: 'cases',       label: 'Cases',          icon: Briefcase,       adminPath: '/admin/cases',       previewPath: '/cases' },
  { key: 'segments',    label: 'Segmentos',      icon: Layers,          adminPath: '/admin/segments',    previewPath: '/imobiliario' },
  { key: 'sobre',       label: 'Sobre & Contato',icon: Info,            adminPath: '/admin/sobre',       previewPath: '/sobre' },
  { key: 'restaurantes',label: 'Restaurantes',   icon: UtensilsCrossed, adminPath: '/admin/restaurantes',previewPath: '/restaurantes' },
];

const AdminEditor = () => {
  const [active, setActive] = useState<EditorTab>(TABS[0]);
  const [previewKey, setPreviewKey] = useState(0);
  const Editor = EDITORS[active.key as keyof typeof EDITORS];

  return (
    <AdminLayout title="Editor de Site">
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        {/* Top tab bar */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TABS.map(t => {
            const isActive = t.key === active.key;
            return (
              <Button
                key={t.key}
                onClick={() => setActive(t)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs md:text-sm font-medium transition ${
                  isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground border border-border hover:border-primary/40'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </Button>
            );
          })}
        </div>

        {/* Split view */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 flex-1 min-h-0">
          {/* Left: Editor */}
          <div className="rounded-2xl border border-border overflow-hidden bg-card min-h-[520px] flex flex-col">
            <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Edição · {active.label}</span>
              <a href={active.adminPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary">
                Abrir <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex-1 overflow-auto min-w-0">
              <EmbeddedAdminContext.Provider value={true}>
                <Editor key={active.key} />
              </EmbeddedAdminContext.Provider>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="rounded-2xl border border-border overflow-hidden bg-card min-h-[520px] flex flex-col">
            <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Preview ao vivo · {active.previewPath}</span>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={() => setPreviewKey(k => k + 1)} className="inline-flex items-center gap-1 text-primary">
                  <RefreshCw className="w-3 h-3" /> Atualizar
                </Button>
                <a href={active.previewPath} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary">
                  Abrir <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
            <iframe
              key={`preview-${active.key}-${previewKey}`}
              src={active.previewPath}
              className="flex-1 w-full bg-background"
              title={`Preview: ${active.label}`}
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditor;