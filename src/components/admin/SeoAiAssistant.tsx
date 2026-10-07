import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';

interface SeoOption { title: string; description: string; angle: string }

interface Props {
  pageName?: string;
  initialContent?: string;
  onApply?: (o: { title: string; description: string }) => void;
}

const SeoAiAssistant = ({ pageName = '', initialContent = '', onApply }: Props) => {
  const [name, setName] = useState(pageName);
  const [content, setContent] = useState(initialContent);
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<SeoOption[]>([]);
  const [terms, setTerms] = useState<string[]>([]);

  const generate = async () => {
    if (content.trim().length < 30) { toast.error('Escreva pelo menos algumas frases sobre a página.'); return; }
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('suggest-seo', {
      body: { page_name: name, content, keywords },
    });
    setLoading(false);
    if (error || data?.error) {
      let msg = data?.error;
      try { msg = msg || (await (error as any)?.context?.json())?.error; } catch { /* ignore */ }
      toast.error(typeof msg === 'string' ? msg : 'Não foi possível gerar as sugestões.');
      return;
    }
    setOptions(data.options || []);
    setTerms(data.keywords || []);
  };

  const copy = (o: SeoOption) => {
    navigator.clipboard.writeText(`${o.title}\n${o.description}`);
    toast.success('Copiado');
  };

  return (
    <div className="space-y-4 rounded-lg border border-border p-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-display font-semibold">Gerar SEO com IA</h3>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Nome da página</Label>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Ex.: Produtora audiovisual" />
        </div>
        <div className="space-y-1.5">
          <Label>Palavras chave (opcional)</Label>
          <Input value={keywords} onChange={e => setKeywords(e.target.value)} placeholder="Ex.: vídeo institucional Blumenau" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Conteúdo da página</Label>
        <Textarea rows={8} value={content} onChange={e => setContent(e.target.value)} placeholder="Cole aqui os textos da página: o que ela oferece, para quem, diferenciais..." />
      </div>
      <Button onClick={generate} disabled={loading} className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
        {loading ? 'Gerando...' : 'Gerar sugestões'}
      </Button>

      {options.length > 0 && (
        <div className="space-y-3">
          {options.map((o, i) => (
            <div key={i} className="space-y-2 rounded-md border border-border p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{o.angle}</p>
              <p className="font-medium text-primary">{o.title} <span className="text-xs text-muted-foreground">({o.title.length}/60)</span></p>
              <p className="text-sm text-muted-foreground">{o.description} <span className="text-xs">({o.description.length}/160)</span></p>
              <div className="flex gap-2">
                {onApply && (
                  <Button size="sm" onClick={() => { onApply(o); toast.success('Aplicado. Lembre de salvar.'); }} className="gap-1">
                    <Check className="h-3.5 w-3.5" /> Aplicar
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => copy(o)} className="gap-1">
                  <Copy className="h-3.5 w-3.5" /> Copiar
                </Button>
              </div>
            </div>
          ))}
          {terms.length > 0 && (
            <p className="text-xs text-muted-foreground">Termos sugeridos: {terms.join(' · ')}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SeoAiAssistant;
