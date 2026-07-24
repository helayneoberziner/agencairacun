import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { useGalleries } from '@/hooks/useGalleries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, ExternalLink, Trash2, Copy, ImageIcon } from 'lucide-react';
import { slugify } from '@/lib/galleryLib';
import { useQueryClient } from '@tanstack/react-query';

const AdminGalleries = () => {
  const { data: list, isLoading } = useGalleries();
  const qc = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [client, setClient] = useState('');

  const create = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const base = slugify(name);
      let slug = base;
      let n = 1;
      while (true) {
        const { data } = await supabase.from('gallery_galleries').select('id').eq('slug', slug).maybeSingle();
        if (!data) break;
        n++; slug = `${base}-${n}`;
      }
      const { data, error } = await supabase.from('gallery_galleries').insert({
        name, slug, client_name: client || '', status: 'draft',
      }).select().single();
      if (error) throw error;
      toast.success('Galeria criada');
      setName(''); setClient('');
      qc.invalidateQueries({ queryKey: ['galleries'] });
      window.location.href = `/admin/galleries/${data.id}`;
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao criar galeria');
    } finally { setCreating(false); }
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir esta galeria e todos os arquivos vinculados?')) return;
    const { error } = await supabase.from('gallery_galleries').delete().eq('id', id);
    if (error) toast.error(error.message);
    else { toast.success('Galeria excluída'); qc.invalidateQueries({ queryKey: ['galleries'] }); }
  };

  return (
    <AdminLayout title="Galerias de Entrega">
      <div className="max-w-5xl space-y-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-display text-lg mb-3">Nova galeria</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Nome da galeria" value={name} onChange={e => setName(e.target.value)} />
            <Input placeholder="Cliente" value={client} onChange={e => setClient(e.target.value)} />
            <Button onClick={create} disabled={creating || !name.trim()}>
              <Plus className="w-4 h-4 mr-2" /> Criar
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-border font-medium">Suas galerias</div>
          {isLoading ? (
            <div className="p-6 text-muted-foreground">Carregando...</div>
          ) : !list || list.length === 0 ? (
            <div className="p-6 text-muted-foreground flex items-center gap-2"><ImageIcon className="w-4 h-4" /> Nenhuma galeria ainda.</div>
          ) : (
            <ul className="divide-y divide-border">
              {list.map((g: any) => (
                <li key={g.id} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    {g.cover_url ? <img src={g.cover_url} alt="" className="w-full h-full object-cover" /> : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{g.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {g.client_name || '—'} · /galeria/{g.slug} · {g.status}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {g.status === 'active' && (
                      <>
                        <a href={`/galeria/${g.slug}`} target="_blank" rel="noopener noreferrer" className="text-sm text-primary flex items-center gap-1 hover:underline">
                          <ExternalLink className="w-4 h-4" /> Abrir
                        </a>
                        <button
                          onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/galeria/${g.slug}`); toast.success('Link copiado'); }}
                          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                        >
                          <Copy className="w-4 h-4" /> Link
                        </button>
                      </>
                    )}
                    <Link to={`/admin/galleries/${g.id}`} className="text-sm px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition">Editar</Link>
                    <button onClick={() => remove(g.id)} className="text-sm text-destructive hover:bg-destructive/10 rounded-lg p-2">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminGalleries;