import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Send, Copy, ExternalLink, CheckCircle2, AlertCircle, Mail } from 'lucide-react';

const PUBLIC_BASE = 'https://agenciaracun.com';

interface ProposalRow {
  id: string;
  slug: string;
  client_name: string;
  client_email: string | null;
  is_active: boolean;
}

interface SendRow {
  id: string;
  client_name: string;
  client_email: string;
  link: string;
  status: string;
  sent_at: string;
}

const AdminProposalSend = () => {
  const { toast } = useToast();
  const [proposals, setProposals] = useState<ProposalRow[]>([]);
  const [sends, setSends] = useState<SendRow[]>([]);
  const [proposalId, setProposalId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Sua proposta personalizada | Racun Agência');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const selected = useMemo(() => proposals.find(p => p.id === proposalId) || null, [proposals, proposalId]);
  const link = selected ? `${PUBLIC_BASE}/orcamento/${selected.slug}` : '';

  const load = async () => {
    const [{ data: props }, { data: log }] = await Promise.all([
      supabase.from('proposals').select('id, slug, client_name, client_email, is_active').order('created_at', { ascending: false }),
      supabase.from('proposal_sends').select('id, client_name, client_email, link, status, sent_at').order('sent_at', { ascending: false }).limit(30),
    ]);
    if (props) setProposals(props as ProposalRow[]);
    if (log) setSends(log as SendRow[]);
  };

  useEffect(() => { load(); }, []);

  const onSelect = (id: string) => {
    setProposalId(id);
    const p = proposals.find(x => x.id === id);
    if (p) {
      setName(p.client_name || '');
      setEmail(p.client_email || '');
    }
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast({ title: 'Link copiado!' });
  };

  const handleSend = async () => {
    if (!selected) return toast({ title: 'Escolha uma proposta', variant: 'destructive' });
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return toast({ title: 'Informe nome e e-mail válidos', variant: 'destructive' });
    }
    setSending(true);
    try {
      // guarda o e-mail no cadastro da proposta para os próximos envios
      await supabase.from('proposals').update({ client_email: email.trim() } as any).eq('id', selected.id);

      const { data, error } = await supabase.functions.invoke('send-proposal', {
        body: {
          proposal_id: selected.id,
          client_name: name.trim(),
          client_email: email.trim(),
          link,
          subject: subject.trim(),
          message: message.trim(),
        },
      });
      if (error || (data as any)?.error) throw new Error((data as any)?.error || error?.message);

      toast({ title: 'Proposta enviada!', description: `E-mail enviado para ${email.trim()}` });
      setMessage('');
      load();
    } catch (e: any) {
      toast({ title: 'Erro ao enviar', description: e?.message || 'Tente novamente', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <AdminLayout title="Enviar Propostas">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary" /> Envio por e-mail
            </h2>

            <div>
              <Label>Proposta</Label>
              <select
                value={proposalId}
                onChange={(e) => onSelect(e.target.value)}
                className="w-full mt-1 px-3 py-2 rounded-lg bg-background border border-border text-sm"
              >
                <option value="">Selecione uma proposta...</option>
                {proposals.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.client_name} ({p.slug}){p.is_active ? '' : ' — inativa'}
                  </option>
                ))}
              </select>
            </div>

            {selected && (
              <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg bg-muted/40 border border-border">
                <span className="text-sm break-all flex-1">{link}</span>
                <Button variant="outline" size="sm" onClick={copyLink}>
                  <Copy className="w-3.5 h-3.5 mr-1" /> Copiar
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`/orcamento/${selected.slug}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1" /> Abrir
                  </a>
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome do cliente</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do cliente" />
              </div>
              <div>
                <Label>E-mail do cliente</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="cliente@email.com" />
              </div>
            </div>

            <div>
              <Label>Assunto</Label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>

            <div>
              <Label>Mensagem (opcional)</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Escreva uma mensagem pessoal para o cliente..."
              />
            </div>

            <Button onClick={handleSend} disabled={sending || !selected}>
              <Send className="w-4 h-4 mr-2" /> {sending ? 'Enviando...' : 'Enviar proposta'}
            </Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-3 h-fit">
          <h2 className="text-lg font-semibold">Últimos envios</h2>
          {sends.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum envio registrado ainda.</p>
          ) : (
            <div className="space-y-3">
              {sends.map(s => (
                <div key={s.id} className="border border-border rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    {s.status === 'sent'
                      ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                      : <AlertCircle className="w-4 h-4 text-destructive shrink-0" />}
                    <span className="text-sm font-medium truncate">{s.client_name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{s.client_email}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(s.sent_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProposalSend;
