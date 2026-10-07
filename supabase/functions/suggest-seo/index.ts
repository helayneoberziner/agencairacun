import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const Body = z.object({
  page_name: z.string().max(200).default(''),
  content: z.string().min(30).max(12000),
  keywords: z.string().max(500).default(''),
});
const json = (b: unknown, status = 200) =>
  new Response(JSON.stringify(b), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const auth = req.headers.get('Authorization') ?? '';
    const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: auth } },
    });
    const { data: u } = await sb.auth.getUser(auth.replace('Bearer ', ''));
    if (!u?.user) return json({ error: 'Não autorizado' }, 401);
    const { data: isAdmin } = await sb.rpc('has_role', { _user_id: u.user.id, _role: 'admin' });
    if (!isAdmin) return json({ error: 'Acesso restrito' }, 403);

    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const b = parsed.data;
    const schema = {
      type: 'object', additionalProperties: false,
      required: ['options', 'keywords'],
      properties: {
        options: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['title', 'description', 'angle'],
          properties: { title: { type: 'string' }, description: { type: 'string' }, angle: { type: 'string' } } } },
        keywords: { type: 'array', items: { type: 'string' } },
      },
    };

    const prompt = `Você é especialista em SEO e AIO da Agência Racun (marketing e produtora audiovisual em Blumenau, SC). Gere metadados para a página abaixo.
Regras: português do Brasil; NUNCA use o caractere hífen "-" em nenhum texto (use "·" ou "|" como separador); não invente números, métricas, clientes ou prêmios; use só fatos do conteúdo.
Gere exatamente 3 opções com ângulos diferentes. title com no máximo 60 caracteres, contendo a palavra chave principal no início e terminando com "| Racun" quando couber. description entre 120 e 160 caracteres, clara, com benefício e chamada para ação. angle descreve o foco em poucas palavras. keywords: 5 a 8 termos de busca relevantes.
Página: ${b.page_name || 'não informado'}
Palavras chave desejadas: ${b.keywords || 'não informado'}
Conteúdo:
${b.content}`;

    const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
      method: 'POST',
      signal: req.signal,
      headers: {
        'Content-Type': 'application/json',
        'Lovable-API-Key': Deno.env.get('LOVABLE_API_KEY')!,
        'X-Lovable-AIG-SDK': 'fetch',
      },
      body: JSON.stringify({
        model: 'openai/gpt-6-astra',
        input: [{ role: 'user', content: prompt }],
        stream: true,
        store: false,
        reasoning: { effort: 'low', summary: 'auto' },
        include: ['reasoning.encrypted_content'],
        text: { format: { type: 'json_schema', name: 'seo_suggestion', strict: true, schema } },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      let msg = 'Falha ao gerar sugestão';
      try { msg = JSON.parse(t)?.error?.message || JSON.parse(t)?.message || msg; } catch { /* ignore */ }
      if (res.status === 402) msg = 'Créditos de IA esgotados. Adicione créditos no workspace.';
      if (res.status === 429) msg = 'Muitas solicitações. Tente novamente em instantes.';
      return json({ error: msg }, res.status);
    }

    const reader = res.body!.getReader();
    const dec = new TextDecoder();
    let buf = '', text = '', err = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.startsWith('data:')) continue;
        const d = line.slice(5).trim();
        if (!d || d === '[DONE]') continue;
        try {
          const ev = JSON.parse(d);
          if (ev.type === 'response.output_text.delta') text += ev.delta;
          if (ev.type === 'error' || ev.type === 'response.failed') err = ev.error?.message || ev.response?.error?.message || 'Erro na IA';
        } catch { /* ignore */ }
      }
    }
    if (err) return json({ error: err }, 502);
    if (!text) return json({ error: 'A IA não retornou sugestão' }, 502);
    const out = JSON.parse(text);
    const clean = (x: string) => x.replace(/\s*[-–—]\s*/g, ' · ').trim();
    out.options = out.options.map((o: any) => ({ title: clean(o.title), description: clean(o.description), angle: clean(o.angle) }));
    out.keywords = out.keywords.map(clean);
    return json(out);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    return json({ error: e instanceof Error ? e.message : 'Erro' }, 500);
  }
});
