import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PenLine, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

export interface CaseCopy { subtitle: string; context: string; presentation: string; services: string[] }

interface Props {
  clientName: string;
  context: string;
  services: string;
  results: string;
  onApply: (c: CaseCopy) => void;
}

const CaseCopyAssistant = ({ clientName, context, services, results, onApply }: Props) => {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CaseCopy | null>(null);

  const run = async () => {
    if (details.trim().length < 10) { toast.error('Descreva os detalhes do case com algumas frases.'); return; }
    setLoading(true); setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke('write-case', {
        body: { client_name: clientName, context, services, details, results },
      });
      if (error) {
        let msg = error.message;
        try { msg = (await (error as any).context?.json())?.error || msg; } catch { /* ignore */ }
        throw new Error(typeof msg === 'string' ? msg : 'Dados inválidos');
      }
      if (data?.error) throw new Error(data.error);
      setResult(data as CaseCopy);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha ao gerar descrição');
    } finally { setLoading(false); }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-primary/40 text-left hover:bg-primary/5 transition-colors">
        <PenLine className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
        <span className="text-sm"><strong className="font-medium">Redator de case com IA</strong><br />
          <span className="text-muted-foreground">Gera uma descrição persuasiva usando só os fatos informados, sem inventar resultados.</span></span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-2"><PenLine className="w-4 h-4 text-primary" strokeWidth={1.5} /><span className="font-medium text-sm">Redator de case com IA</span></div>
      <p className="text-xs text-muted-foreground">Usa também o contexto, os serviços e os resultados já preenchidos abaixo.</p>
      <div className="space-y-2">
        <Label>Detalhes do case</Label>
        <Textarea rows={5} value={details} onChange={e => setDetails(e.target.value)} placeholder="O que foi produzido, como foi o processo, diferenciais, público, entregas." />
      </div>
      <Button type="button" onClick={run} disabled={loading} size="sm">
        {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <PenLine className="w-4 h-4 mr-1.5" />}
        {loading ? 'Escrevendo...' : 'Gerar descrição'}
      </Button>
      {result && (
        <div className="space-y-3 pt-3 border-t border-border text-sm">
          <p className="text-muted-foreground">{result.subtitle}</p>
          <p className="whitespace-pre-line">{result.context}</p>
          <p className="whitespace-pre-line text-foreground/80">{result.presentation}</p>
          <div className="flex flex-wrap gap-1.5">
            {result.services.map(s => <span key={s} className="px-2.5 py-1 rounded-full border border-primary/40 text-xs">{s}</span>)}
          </div>
          <Button type="button" size="sm" variant="outline" onClick={() => { onApply(result); toast.success('Descrição aplicada. Revise e salve.'); }}>
            <Check className="w-4 h-4 mr-1.5" /> Aplicar no case
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseCopyAssistant;
