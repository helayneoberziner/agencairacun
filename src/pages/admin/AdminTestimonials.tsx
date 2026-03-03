import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useTestimonials, Testimonial } from '@/hooks/useTestimonials';
import { Plus, Trash2, Edit2, Quote, Save, X } from 'lucide-react';

const AdminTestimonials = () => {
  const { testimonials, isLoading, isUpdating, addTestimonial, deleteTestimonial, editTestimonial } = useTestimonials();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ quote: '', name: '', role: '' });

  const resetForm = () => {
    setForm({ quote: '', name: '', role: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.quote || !form.name || !form.role) {
      toast.error('Preencha todos os campos');
      return;
    }
    try {
      if (editingId) {
        await editTestimonial(editingId, form);
        toast.success('Depoimento atualizado!');
      } else {
        await addTestimonial(form);
        toast.success('Depoimento adicionado!');
      }
      resetForm();
    } catch {
      toast.error('Erro ao salvar depoimento');
    }
  };

  const startEdit = (t: Testimonial) => {
    setForm({ quote: t.quote, name: t.name, role: t.role });
    setEditingId(t.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTestimonial(id);
      toast.success('Depoimento removido!');
    } catch {
      toast.error('Erro ao remover depoimento');
    }
  };

  return (
    <AdminLayout title="Depoimentos">
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-sm">
            Gerencie os depoimentos exibidos na home do site.
          </p>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Novo depoimento
            </Button>
          )}
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <h3 className="font-display font-semibold">
              {editingId ? 'Editar depoimento' : 'Novo depoimento'}
            </h3>
            <div className="space-y-2">
              <Label htmlFor="quote">Depoimento</Label>
              <Textarea
                id="quote"
                value={form.quote}
                onChange={e => setForm(p => ({ ...p, quote: e.target.value }))}
                placeholder="O que o cliente disse..."
                rows={3}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome / Identificação</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ex: Cliente do segmento de moda"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Segmento</Label>
                <Input
                  id="role"
                  value={form.role}
                  onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
                  placeholder="Ex: E-commerce"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={isUpdating}>
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Salvando...' : 'Salvar'}
              </Button>
              <Button type="button" variant="ghost" onClick={resetForm}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : testimonials.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            <Quote className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p>Nenhum depoimento cadastrado ainda.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="glass-card p-5 relative group">
                <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/20" />
                <p className="text-foreground mb-3 leading-relaxed pr-8">"{t.quote}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => startEdit(t)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTestimonials;
