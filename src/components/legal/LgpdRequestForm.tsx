import { useState } from 'react';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const schema = z.object({
  nome: z.string().trim().min(2, 'Informe seu nome').max(100),
  email: z.string().trim().email('E-mail inválido').max(255),
  telefone: z.string().trim().max(30).optional().or(z.literal('')),
  tipo_solicitacao: z.string().min(1, 'Selecione o tipo'),
  mensagem: z.string().trim().min(10, 'Descreva sua solicitação').max(2000),
});

const TIPOS = [
  'Acesso aos dados',
  'Correção de dados',
  'Exclusão de dados',
  'Portabilidade',
  'Revogação de consentimento',
  'Outro',
];

const LgpdRequestForm = () => {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', tipo_solicitacao: '', mensagem: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('lgpd_requests').insert({
        nome: parsed.data.nome,
        email: parsed.data.email,
        telefone: parsed.data.telefone || null,
        tipo_solicitacao: parsed.data.tipo_solicitacao,
        mensagem: parsed.data.mensagem,
      });
      if (error) throw error;
      toast.success('Solicitação enviada! Responderemos em breve.');
      setForm({ nome: '', email: '', telefone: '', tipo_solicitacao: '', mensagem: '' });
    } catch (err) {
      console.error(err);
      toast.error('Erro ao enviar solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="solicitacao-lgpd" className="glass-card p-6 md:p-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-2xl font-display font-semibold">Exercer seus direitos (LGPD)</h2>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        Use este formulário para exercer qualquer direito previsto na Lei Geral de Proteção de Dados.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lgpd-nome">Nome</Label>
            <Input id="lgpd-nome" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lgpd-email">E-mail</Label>
            <Input id="lgpd-email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lgpd-telefone">Telefone</Label>
            <Input id="lgpd-telefone" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lgpd-tipo">Tipo de solicitação</Label>
            <Select value={form.tipo_solicitacao} onValueChange={(v) => setForm({ ...form, tipo_solicitacao: v })}>
              <SelectTrigger id="lgpd-tipo"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {TIPOS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lgpd-msg">Mensagem</Label>
          <Textarea id="lgpd-msg" rows={5} value={form.mensagem} onChange={e => setForm({ ...form, mensagem: e.target.value })} required />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar solicitação'}
        </Button>
      </form>
    </section>
  );
};

export default LgpdRequestForm;