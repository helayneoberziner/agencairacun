import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Edit, Copy, ExternalLink, X, Save } from 'lucide-react';
import TagAutocompleteInput from '@/components/admin/TagAutocompleteInput';
import { SuggestionCategory } from '@/hooks/useProposalSuggestions';

interface Proposal {
  id: string;
  slug: string;
  client_name: string;
  validity_days: number;
  whatsapp_number: string;
  is_active: boolean;
  marketing_price: string;
  marketing_includes: string[];
  marketing_bonus: string[];
  marketing_differentials: string[];
  audiovisual_price: string;
  audiovisual_includes: string[];
  audiovisual_bonus: string[];
  audiovisual_differentials: string[];
  complete_price: string;
  complete_includes: string[];
  complete_bonus: string[];
  complete_differentials: string[];
  created_at: string;
}

const emptyProposal: Omit<Proposal, 'id' | 'created_at'> = {
  slug: '',
  client_name: '',
  validity_days: 7,
  whatsapp_number: '5547999999999',
  is_active: true,
  marketing_price: '',
  marketing_includes: [''],
  marketing_bonus: [''],
  marketing_differentials: [''],
  audiovisual_price: '',
  audiovisual_includes: [''],
  audiovisual_bonus: [''],
  audiovisual_differentials: [''],
  complete_price: '',
  complete_includes: [''],
  complete_bonus: [''],
  complete_differentials: [''],
};

type ArrayField = 'marketing_includes' | 'marketing_bonus' | 'marketing_differentials' |
  'audiovisual_includes' | 'audiovisual_bonus' | 'audiovisual_differentials' |
  'complete_includes' | 'complete_bonus' | 'complete_differentials';

const AdminProposals = () => {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [editing, setEditing] = useState<Omit<Proposal, 'id' | 'created_at'> | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'marketing' | 'audiovisual' | 'complete'>('marketing');
  const { toast } = useToast();

  const fetchProposals = async () => {
    const { data } = await supabase
      .from('proposals')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setProposals(data);
  };

  useEffect(() => { fetchProposals(); }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'proposta';

  const handleSave = async () => {
    if (!editing) return;
    setLoading(true);

    // Clean empty strings from arrays
    const cleaned = { ...editing };
    const arrayFields: ArrayField[] = [
      'marketing_includes', 'marketing_bonus', 'marketing_differentials',
      'audiovisual_includes', 'audiovisual_bonus', 'audiovisual_differentials',
      'complete_includes', 'complete_bonus', 'complete_differentials',
    ];
    arrayFields.forEach(f => {
      (cleaned as any)[f] = (cleaned as any)[f].filter((s: string) => s.trim() !== '');
    });

    if (editingId) {
      const { error } = await supabase
        .from('proposals')
        .update(cleaned)
        .eq('id', editingId);
      if (error) {
        toast({ title: 'Erro ao salvar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Proposta atualizada!' });
      }
    } else {
      const { error } = await supabase
        .from('proposals')
        .insert(cleaned);
      if (error) {
        toast({ title: 'Erro ao criar', description: error.message, variant: 'destructive' });
      } else {
        toast({ title: 'Proposta criada!' });
      }
    }

    setLoading(false);
    setEditing(null);
    setEditingId(null);
    fetchProposals();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) return;
    await supabase.from('proposals').delete().eq('id', id);
    toast({ title: 'Proposta excluída' });
    fetchProposals();
  };

  const handleArrayChange = (field: ArrayField, index: number, value: string) => {
    if (!editing) return;
    const arr = [...(editing as any)[field]];
    arr[index] = value;
    setEditing({ ...editing, [field]: arr });
  };

  const addArrayItem = (field: ArrayField) => {
    if (!editing) return;
    setEditing({ ...editing, [field]: [...(editing as any)[field], ''] });
  };

  const removeArrayItem = (field: ArrayField, index: number) => {
    if (!editing) return;
    const arr = [...(editing as any)[field]];
    arr.splice(index, 1);
    setEditing({ ...editing, [field]: arr });
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/proposta/${slug}`;
    navigator.clipboard.writeText(url);
    toast({ title: 'Link copiado!' });
  };

  const renderArrayEditor = (label: string, field: ArrayField) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      {((editing as any)?.[field] || []).map((item: string, i: number) => (
        <div key={i} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => handleArrayChange(field, i, e.target.value)}
            placeholder={`Item ${i + 1}`}
          />
          <Button variant="ghost" size="icon" onClick={() => removeArrayItem(field, i)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={() => addArrayItem(field)}>
        <Plus className="w-3 h-3 mr-1" /> Adicionar
      </Button>
    </div>
  );

  if (editing) {
    const sections = [
      { key: 'marketing' as const, label: 'Marketing Digital' },
      { key: 'audiovisual' as const, label: 'Audiovisual' },
      { key: 'complete' as const, label: 'Solução Completa' },
    ];

    return (
      <AdminLayout title={editingId ? 'Editar Proposta' : 'Nova Proposta'}>
        <div className="max-w-4xl space-y-6">
          {/* General info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Informações Gerais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome do Cliente</Label>
                <Input
                  value={editing.client_name}
                  onChange={(e) => {
                    const newEditing = { ...editing, client_name: e.target.value };
                    if (!editingId) newEditing.slug = generateSlug(e.target.value);
                    setEditing(newEditing);
                  }}
                />
              </div>
              <div>
                <Label>Slug (URL)</Label>
                <Input
                  value={editing.slug}
                  onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                  placeholder="nome-do-cliente"
                />
                <p className="text-xs text-muted-foreground mt-1">/proposta/{editing.slug || '...'}</p>
              </div>
              <div>
                <Label>Dias de Validade</Label>
                <Input
                  type="number"
                  value={editing.validity_days}
                  onChange={(e) => setEditing({ ...editing, validity_days: parseInt(e.target.value) || 7 })}
                />
              </div>
              <div>
                <Label>WhatsApp</Label>
                <Input
                  value={editing.whatsapp_number}
                  onChange={(e) => setEditing({ ...editing, whatsapp_number: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={editing.is_active}
                  onCheckedChange={(v) => setEditing({ ...editing, is_active: v })}
                />
                <Label>Proposta ativa</Label>
              </div>
            </div>
          </div>

          {/* Tabs for each plan */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex gap-2 border-b border-border mb-6">
              {sections.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setActiveSection(s.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeSection === s.key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              <div>
                <Label>Valor do Investimento</Label>
                <Input
                  value={(editing as any)[`${activeSection}_price`]}
                  onChange={(e) => setEditing({ ...editing, [`${activeSection}_price`]: e.target.value })}
                  placeholder="2.500,00"
                />
              </div>
              <TagAutocompleteInput
                label="Itens Inclusos"
                category={activeSection as SuggestionCategory}
                values={(editing as any)[`${activeSection}_includes`].filter((s: string) => s.trim() !== '')}
                onChange={(vals) => setEditing({ ...editing, [`${activeSection}_includes`]: vals })}
              />
              {renderArrayEditor('Diferenciais', `${activeSection}_differentials` as ArrayField)}
              {renderArrayEditor('Bônus', `${activeSection}_bonus` as ArrayField)}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Salvando...' : 'Salvar Proposta'}
            </Button>
            <Button variant="outline" onClick={() => { setEditing(null); setEditingId(null); }}>
              Cancelar
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Propostas">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Gerencie propostas personalizadas para cada cliente.</p>
          <Button onClick={() => { setEditing({ ...emptyProposal }); setEditingId(null); }}>
            <Plus className="w-4 h-4 mr-2" /> Nova Proposta
          </Button>
        </div>

        {proposals.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <p>Nenhuma proposta criada ainda.</p>
            <p className="text-sm mt-1">Clique em "Nova Proposta" para começar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.id} className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{p.client_name}</h3>
                    {!p.is_active && (
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">Inativa</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">/proposta/{p.slug}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => copyLink(p.slug)} title="Copiar link">
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" asChild title="Visualizar">
                    <a href={`/proposta/${p.slug}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const { id, created_at, ...rest } = p;
                      setEditing(rest);
                      setEditingId(id);
                    }}
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)} title="Excluir">
                    <Trash2 className="w-4 h-4 text-destructive" />
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

export default AdminProposals;
