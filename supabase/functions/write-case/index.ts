import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { z } from 'npm:zod@3';

const Body = z.object({
  client_name: z.string().max(200).default(''),
  context: z.string().max(6000).default(''),
  services: z.string().max(2000).default(''),
  details: z.string().min(10).max(8000),
  results: z.string().max(4000).default(''),
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
      required: ['subtitle', 'context', 'presentation', 'services'],
      properties: {
        subtitle: { type: 'string' },
        context: { type: 'string' },
        presentation: { type: 'string' },
        services: { type: 'array', items: { type: 'string' } },
      },
    };

    const prompt = `Você é redator sênior da Agência Racun (marketing e produtora audiovisual). Escreva a descrição persuasiva de um case.
Regras OBRIGATÓRIAS: português do Brasil; NUNCA use o caractere hífen "-"; use SOMENTE os fatos fornecidos; NÃO invente números, métricas, resultados, prazos, prêmios ou depoimentos; se resultados não forem informados, não mencione resultados, foque no trabalho e na experiência; tom premium, direto e confiante.
Cliente: ${b.client_name || 'não informado'}
Contexto: ${b.context || 'não informado'}
Serviços: ${b.services || 'não informado'}
Detalhes do projeto: ${b.details}
Resultados informados pela equipe: ${b.results || 'nenhum'}
Retorne: subtitle (uma linha), context (1 parágrafo sobre o cliente e o cenário), presentation (2 a 3 parágrafos persuasivos sobre o que foi feito), services (lista curta de serviços realizados, apenas os citados).`;

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
        text: { format: { type: 'json_schema', name: 'case_description', strict: true, schema } },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      let msg = 'Falha ao gerar descrição';
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
    if (!text) return json({ error: 'A IA não retornou descrição' }, 502);
    const out = JSON.parse(text);
    const clean = (t: string) => t.replace(/\s*[-–—]\s*/g, ', ').replace(/, ,/g, ',');
    out.subtitle = clean(out.subtitle); out.context = clean(out.context);
    out.presentation = out.presentation.replace(/[-–—]/g, ' ');
    out.services = (out.services as string[]).map(clean).filter(Boolean);
    return json(out);
  } catch (e) {
    if (req.signal.aborted) return new Response(null, { status: 499, headers: corsHeaders });
    return json({ error: e instanceof Error ? e.message : 'Erro' }, 500);
  }
});
