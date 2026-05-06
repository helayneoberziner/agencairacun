import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Eye, Trash2, Shield } from 'lucide-react';

interface LgpdRequest {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_solicitacao: string;
  mensagem: string;
  status: string;
  created_at: string;
}

const STATUSES = ['pendente', 'em_analise', 'concluida', 'recusada'];

const AdminLgpd = () => {
  const [items, setItems] = useState<LgpdRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<LgpdRequest | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('lgpd_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Erro ao carregar solicitações');
    else setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from('lgpd_requests').update({ status }).eq('id', id);
    if (error) return toast.error('Erro ao atualizar');
    toast.success('Status atualizado');
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Excluir esta solicitação?')) return;
    const { error } = await supabase.from('lgpd_requests').delete().eq('id', id);
    if (error) return toast.error('Erro ao excluir');
    toast.success('Excluída');
    load();
  };

  return (
    <AdminLayout title="Solicitações LGPD">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <p className="text-muted-foreground text-sm">{items.length} solicitação(ões)</p>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Carregando...</p>
        ) : items.length === 0 ? (
          <div className="glass-card p-8 text-center text-muted-foreground">Nenhuma solicitação até o momento.</div>
        ) : (
          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className="glass-card p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold">{item.nome}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">{item.tipo_solicitacao}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{item.email}{item.telefone ? ` · ${item.telefone}` : ''}</p>
                  <p className="text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString('pt-BR')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={item.status} onValueChange={(v) => updateStatus(item.id, v)}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" onClick={() => setSelected(item)}><Eye className="w-4 h-4" /></Button>
                  <Button variant="outline" size="icon" onClick={() => remove(item.id)}><Trash2 className="w-4 h-4" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Solicitação LGPD</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">Nome:</span> {selected.nome}</div>
              <div><span className="text-muted-foreground">E-mail:</span> {selected.email}</div>
              <div><span className="text-muted-foreground">Telefone:</span> {selected.telefone || '—'}</div>
              <div><span className="text-muted-foreground">Tipo:</span> {selected.tipo_solicitacao}</div>
              <div><span className="text-muted-foreground">Status:</span> {selected.status}</div>
              <div><span className="text-muted-foreground">Data:</span> {new Date(selected.created_at).toLocaleString('pt-BR')}</div>
              <div>
                <p className="text-muted-foreground mb-1">Mensagem:</p>
                <p className="whitespace-pre-wrap p-3 rounded bg-muted/50">{selected.mensagem}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLgpd;