import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import ImageUpload from '@/components/admin/ImageUpload';
import { useTeam, useTeamMutations, TeamMember } from '@/hooks/useTeam';
import { Plus, Trash2, Pencil, X, Save, GripVertical, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

const emptyForm = { name: '', role: '', bio: '', photo_url: '', display_order: 0, is_active: true };

const AdminTeam = () => {
  const { data: team = [], isLoading } = useTeam({});
  const { create, update, remove } = useTeamMutations();
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const openModal = (m?: TeamMember) => {
    if (m) {
      setEditing(m);
      setForm({ name: m.name, role: m.role, bio: m.bio || '', photo_url: m.photo_url || '', display_order: m.display_order, is_active: m.is_active });
    } else {
      setEditing(null);
      setForm({ ...emptyForm, display_order: team.length });
    }
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await update.mutateAsync({ ...editing, ...form, bio: form.bio || null, photo_url: form.photo_url || null });
        toast.success('Atualizado');
      } else {
        await create.mutateAsync({ ...form, bio: form.bio || null, photo_url: form.photo_url || null });
        toast.success('Criado');
      }
      setOpen(false);
    } catch (err: any) {
      toast.error('Erro: ' + (err.message || ''));
    }
  };

  const toggleActive = async (m: TeamMember) => {
    await update.mutateAsync({ ...m, is_active: !m.is_active });
  };

  return (
    <AdminLayout title="Equipe">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">Membros da equipe exibidos na página Sobre.</p>
          <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" /> Novo membro</Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : team.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-muted-foreground mb-4">Nenhum membro cadastrado.</p>
            <Button onClick={() => openModal()}><Plus className="w-4 h-4 mr-2" /> Adicionar primeiro</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map(m => (
              <div key={m.id} className="glass-card overflow-hidden">
                <div className="aspect-[3/4] bg-muted">
                  {m.photo_url ? <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-secondary" />}
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold">{m.name}</h3>
                  <p className="text-primary text-xs uppercase tracking-wider">{m.role}</p>
                  {m.bio && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{m.bio}</p>}
                  <div className="flex items-center gap-2 mt-3">
                    <Button size="sm" variant="outline" onClick={() => openModal(m)}><Pencil className="w-3 h-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => toggleActive(m)}>{m.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</Button>
                    <Button size="sm" variant="destructive" onClick={() => { if (confirm('Excluir?')) remove.mutate(m.id); }}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 bg-card/95 backdrop-blur-sm p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-xl font-display font-semibold">{editing ? 'Editar membro' : 'Novo membro'}</h2>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-muted rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={save} className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cargo *</Label>
                <Input required value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bio (opcional)</Label>
                <Textarea rows={3} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
              </div>
              <ImageUpload label="Foto" value={form.photo_url} onChange={v => setForm({ ...form, photo_url: v })} folder="team" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input type="number" value={form.display_order} onChange={e => setForm({ ...form, display_order: Number(e.target.value) })} />
                </div>
                <label className="flex items-center gap-2 self-end pb-2 text-sm">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} /> Ativo
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit"><Save className="w-4 h-4 mr-2" />Salvar</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminTeam;