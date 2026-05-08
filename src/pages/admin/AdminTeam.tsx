import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import ImageUpload from '@/components/admin/ImageUpload';
import { useTeamMembers, TeamMember, SocialLink } from '@/hooks/useTeamMembers';
import { socialPlatforms, getSocialLabel, getSocialIcon } from '@/lib/socialIcons';
import { Plus, Pencil, Trash2, X, Save, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

type FormState = Omit<TeamMember, 'id'> & { id?: string };

const empty: FormState = {
  name: '', role: '', bio: '', photo_url: '',
  social_links: [], display_order: 0, is_active: true,
};

const AdminTeam = () => {
  const { members, isLoading, upsert, remove } = useTeamMembers();
  const [editing, setEditing] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!editing || !editing.name || !editing.role) {
      toast.error('Nome e cargo são obrigatórios');
      return;
    }
    setSaving(true);
    try {
      await upsert(editing as any);
      toast.success('Salvo!');
      setEditing(null);
    } catch (e: any) {
      toast.error(e.message ?? 'Erro ao salvar');
    } finally { setSaving(false); }
  };

  const updateSocial = (i: number, patch: Partial<SocialLink>) => {
    if (!editing) return;
    const links = [...editing.social_links];
    links[i] = { ...links[i], ...patch };
    setEditing({ ...editing, social_links: links });
  };

  if (editing) {
    return (
      <AdminLayout title={editing.id ? 'Editar integrante' : 'Novo integrante'}>
        <div className="max-w-3xl space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-5">
            <ImageUpload label="Foto" value={editing.photo_url ?? ''} onChange={(url) => setEditing({ ...editing, photo_url: url })} folder="team" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cargo *</Label>
                <Input value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Descrição curta</Label>
              <Textarea rows={3} value={editing.bio ?? ''} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ordem</Label>
                <Input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
                <Label>Ativo</Label>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Redes sociais</Label>
              {editing.social_links.map((s, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <select
                    value={s.platform}
                    onChange={(e) => updateSocial(i, { platform: e.target.value })}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {socialPlatforms.map(p => <option key={p} value={p}>{getSocialLabel(p)}</option>)}
                  </select>
                  <Input value={s.url} onChange={(e) => updateSocial(i, { url: e.target.value })} placeholder="https://..." />
                  <Button variant="ghost" size="icon" onClick={() => setEditing({ ...editing, social_links: editing.social_links.filter((_, idx) => idx !== i) })}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setEditing({ ...editing, social_links: [...editing.social_links, { platform: 'instagram', url: '' }] })}>
                <Plus className="w-3 h-3 mr-1" /> Adicionar rede
              </Button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={save} disabled={saving}>
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancelar</Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Equipe">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Gerencie os integrantes exibidos na página Sobre.</p>
          <Button onClick={() => setEditing({ ...empty, display_order: members.length })}>
            <Plus className="w-4 h-4 mr-2" /> Novo integrante
          </Button>
        </div>

        {isLoading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : members.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border border-dashed border-border rounded-xl">
            Nenhum integrante cadastrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map(m => (
              <div key={m.id} className="bg-card border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-start gap-3">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-muted" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{m.name}</h3>
                    <p className="text-sm text-muted-foreground truncate">{m.role}</p>
                    {!m.is_active && <span className="text-xs text-muted-foreground">(inativo)</span>}
                  </div>
                </div>
                {m.bio && <p className="text-sm text-muted-foreground line-clamp-2">{m.bio}</p>}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button variant="outline" size="sm" onClick={() => setEditing(m)}>
                    <Pencil className="w-3 h-3 mr-1" /> Editar
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => {
                    if (confirm('Remover integrante?')) remove(m.id);
                  }}>
                    <Trash2 className="w-3 h-3 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTeam;