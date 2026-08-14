const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const esc = (v: unknown) =>
  String(v ?? '')
    .slice(0, 2000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) return json({ error: 'resend_not_configured' }, 500)

    const body = await req.json()
    const name = String(body?.name ?? '').trim().slice(0, 100)
    const email = String(body?.email ?? '').trim().slice(0, 255)
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'invalid_input' }, 400)
    }

    const rows: [string, unknown][] = [
      ['Nome', name],
      ['E-mail', email],
      ['WhatsApp', body?.phone],
      ['Empresa', body?.company],
      ['Serviço', body?.service],
      ['Origem', body?.segment],
      ['Mensagem', body?.message],
    ]

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#040d28;color:#ffffff;padding:24px">
        <h2 style="color:#FF00CC;margin:0 0 16px">Novo contato pelo site</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px">
          ${rows
            .filter(([, v]) => String(v ?? '').trim() !== '')
            .map(
              ([k, v]) =>
                `<tr><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,.12);width:130px;color:#9aa4c2">${k}</td><td style="padding:8px;border-bottom:1px solid rgba(255,255,255,.12)">${esc(v).replace(/\n/g, '<br/>')}</td></tr>`,
            )
            .join('')}
        </table>
      </div>`

    const notifyTo = Deno.env.get('CONTACT_NOTIFY_EMAIL') ?? 'racunagencia@gmail.com'
    const senderEmail = Deno.env.get('SENDER_EMAIL') ?? 'contato@agenciaracun.com'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `Racun Agência <${senderEmail}>`,
        to: [notifyTo],
        reply_to: email,
        subject: `Novo contato: ${name}`,
        html,
      }),
    })

    if (!res.ok) {
      const details = await res.text()
      console.error(`Resend failed [${res.status}]: ${details}`)
      return json({ error: 'send_failed', status: res.status, details }, res.status)
    }

    return json({ ok: true })
  } catch (e) {
    console.error('notify-contact error', e)
    return json({ error: String(e) }, 500)
  }
})
