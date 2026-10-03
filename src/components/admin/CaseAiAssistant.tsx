import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Suggestion {
  category: string; subcategory: string; placements: string[];
  title: string; subtitle: string; presentation: string; reason: string;
}

interface Props {
  clientName: string;
  segments: { slug: string; label: string }[];
  onApply: (s: Suggestion) => void;
}

const BASE_PLACEMENTS = [
  { value: 'home_cases', label: 'Home, seção de Cases' },
  { value: 'home_audio', label: 'Home, bloco audiovisual (vídeos)' },
  { value: 'produtora', label: 'Página Produtora' },
  { value: 'cases', label: 'Destaque na página de Cases' },
];

const CaseAiAssistant = ({ clientName, segments, onApply }: Props) => {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Suggestion | null>(null);

  const placements = [...BASE_PLACEMENTS, ...segments.map(s => ({ value: `seg:${s.slug}`, label: `Segmento ${s.label}` }))];
  const labelOf = (v: string) => placements.find(p => p.value === v)?.label ?? v;

  const run = async () => {
    if (description.trim().length < 10) { toast.error('Descreva o case com pelo menos algumas frases.'); return; }
    setLoading(true); setResult(null);
    try {
      const { data: cats } = await supabase.from('categories' as any).select('name');
      const { data, error } = await supabase.functions.invoke('suggest-case', {
        body: {
          client_name: clientName, description, materials,
          categories: ((cats ?? []) as any[]).map(c => c.name),
          placements,
        },
      });
      if (error) {
        let msg = error.message;
        try { msg = (await (error as any).context?.json())?.error || msg; } catch { /* ignore */ }
        throw new Error(typeof msg === 'string' ? msg : 'Dados inválidos');
      }
      if (data?.error) throw new Error(data.error);
      setResult(data as Suggestion);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Falha ao gerar sugestão');
    } finally { setLoading(false); }
  };

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)}
        className="w-full flex items-center gap-3 p-4 rounded-xl border border-dashed border-primary/40 text-left hover:bg-primary/5 transition-colors">
        <Sparkles className="w-5 h-5 text-primary shrink-0" strokeWidth={1.5} />
        <span className="text-sm"><strong className="font-medium">Assistente de case com IA</strong><br />
          <span className="text-muted-foreground">Descreva o projeto e receba sugestão de categoria, locais de exibição e texto de apresentação.</span></span>
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 p-4 md:p-5 space-y-4">
      <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-primary" strokeWidth={1.5} /><span className="font-medium text-sm">Assistente de case com IA</span></div>
      <div className="space-y-2">
        <Label>Descrição do projeto</Label>
        <Textarea rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="O que foi feito, para quem, objetivo e contexto." />
      </div>
      <div className="space-y-2">
        <Label>Materiais entregues</Label>
        <Textarea rows={2} value={materials} onChange={e => setMaterials(e.target.value)} placeholder="Ex.: 1 vídeo institucional, 3 reels, 40 fotos do evento" />
      </div>
      <Button type="button" onClick={run} disabled={loading} size="sm">
        {loading ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1.5" />}
        {loading ? 'Analisando...' : 'Gerar sugestão'}
      </Button>

      {result && (
        <div className="space-y-3 pt-3 border-t border-border text-sm">
          <p><span className="text-muted-foreground">Categoria:</span> {result.category}{result.subcategory ? ` / ${result.subcategory}` : ''}</p>
          <div className="flex flex-wrap gap-1.5">
            {result.placements.map(p => <span key={p} className="px-2.5 py-1 rounded-full border border-primary/40 text-xs">{labelOf(p)}</span>)}
          </div>
          <p className="font-medium">{result.title}</p>
          <p className="text-muted-foreground">{result.subtitle}</p>
          <p className="whitespace-pre-line text-foreground/80">{result.presentation}</p>
          <p className="text-xs text-muted-foreground italic">{result.reason}</p>
          <Button type="button" size="sm" variant="outline" onClick={() => { onApply(result); toast.success('Sugestão aplicada. Revise e salve.'); }}>
            <Check className="w-4 h-4 mr-1.5" /> Aplicar no case
          </Button>
        </div>
      )}
    </div>
  );
};

export default CaseAiAssistant;
