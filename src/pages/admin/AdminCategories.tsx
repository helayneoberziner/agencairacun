import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface Cat { id: string; name: string; slug: string; kind: string; display_order: number; }

const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const AdminCategories = () => {
  const [items, setItems] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories' as any).select('*').order('display_order');
    setItems((data ?? []) as unknown as Cat[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const add = async () => {
    if (!newName.trim()) return;
    const slug = slugify(newName);
    const { error } = await supabase.from('categories' as any).insert({ name: newName.trim(), slug, kind: 'case', display_order: items.length });
    if (error) { toast.error('Erro: ' + error.message); return; }
    setNewName('');
    toast.success('Categoria criada');
    load();
  };

  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await supabase.from('categories' as any).update({ name: editName.trim(), slug: slugify(editName) }).eq('id', id);
    setEditingId(null);
    toast.success('Atualizado');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir categoria?')) return;
    await supabase.from('categories' as any).delete().eq('id', id);
    load();
  };

  const move = async (id: string, dir: -1 | 1) => {
    const sorted = [...items].sort((a, b) => a.display_order - b.display_order);
    const idx = sorted.findIndex(c => c.id === id);
    const ni = idx + dir;
    if (ni < 0 || ni >= sorted.length) return;
    const a = sorted[idx], b = sorted[ni];
    await Promise.all([
      supabase.from('categories' as any).update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('categories' as any).update({ display_order: a.display_order }).eq('id', b.id),
    ]);
    load();
  };

  return (
    <AdminLayout title="Categorias">
      <div className="space-y-6 max-w-2xl">
        <p className="text-muted-foreground text-sm">Crie, edite e reorganize as categorias usadas em cases e portfólio.</p>

        <div className="glass-card p-4 flex gap-2">
          <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nova categoria" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())} />
          <Button onClick={add}><Plus className="w-4 h-4 mr-1" /> Adicionar</Button>
        </div>

        {loading ? <p className="text-muted-foreground">Carregando...</p> : (
          <div className="glass-card divide-y divide-border">
            {items.length === 0 && <p className="p-6 text-center text-muted-foreground text-sm">Nenhuma categoria.</p>}
            {items.map(c => (
              <div key={c.id} className="p-3 flex items-center gap-2">
                <div className="flex flex-col">
                  <button onClick={() => move(c.id, -1)} className="p-0.5 hover:text-primary"><ChevronUp className="w-3 h-3" /></button>
                  <button onClick={() => move(c.id, 1)} className="p-0.5 hover:text-primary"><ChevronDown className="w-3 h-3" /></button>
                </div>
                {editingId === c.id ? (
                  <>
                    <Input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1" autoFocus />
                    <Button size="sm" onClick={() => saveEdit(c.id)}><Check className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-xs text-muted-foreground">/{c.slug}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => { setEditingId(c.id); setEditName(c.name); }}><Pencil className="w-4 h-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCategories;