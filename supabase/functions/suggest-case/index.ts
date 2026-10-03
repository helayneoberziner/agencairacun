import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const Body = z.object({
  client_name: z.string().max(200).default(''),
  description: z.string().min(10).max(6000),
  materials: z.string().max(4000).default(''),
  categories: z.array(z.string().max(100)).max(50).default([]),
  placements: z.array(z.object({ value: z.string().max(100), label: z.string().max(200) })).max(60),
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
    const values = b.placements.map(p => p.value);

    const schema = {
      type: 'object', additionalProperties: false,
      required: ['category', 'subcategory', 'placements', 'title', 'subtitle', 'presentation', 'reason'],
      properties: {
        category: { type: 'string' },
        subcategory: { type: 'string' },
        placements: { type: 'array', items: { type: 'string', enum: values } },
        title: { type: 'string' },
        subtitle: { type: 'string' },
        presentation: { type: 'string' },
        reason: { type: 'string' },
      },
    };

    const prompt = `Você é estrategista da Agência Racun (marketing e produtora audiovisual). Analise o case e sugira onde ele deve aparecer no site.
Regras: escreva em português do Brasil; NUNCA use o caractere hífen "-" em nenhum texto; não invente números, métricas ou depoimentos; tom premium e direto.
Categorias existentes (prefira uma delas): ${b.categories.join(', ') || 'nenhuma'}
Locais de exibição possíveis (value = label): ${b.placements.map(p => `${p.value} = ${p.label}`).join('; ')}
Escolha só os locais que fazem sentido (vídeos fortes: home_audio e produtora; segmento do cliente: seg:*; cases para histórias completas).
Cliente: ${b.client_name}
Descrição: ${b.description}
Materiais: ${b.materials || 'não informado'}
Retorne title curto, subtitle de uma linha, presentation com 2 a 3 parágrafos e reason explicando em uma frase as escolhas.`;

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
        text: { format: { type: 'json_schema', name: 'case_suggestion', strict: true, schema } },
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
    const strip = (s: string) => s.replace(/\s*[-–—]\s*/g, ', ').replace(/, ,/g, ',');
    out.title = strip(out.title); out.subtitle = strip(out.subtitle); out.presentation = out.presentation.replace(/[-–—]/g, ' ');
    out.placements = (out.placements as string[]).filter(v => values.includes(v));
    return json(out);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    return json({ error: e instanceof Error ? e.message : 'Erro' }, 500);
  }
});
