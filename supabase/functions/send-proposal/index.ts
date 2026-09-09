import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

const esc = (v: unknown) =>
  String(v ?? '')
    .slice(0, 3000)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) return json({ error: 'resend_not_configured' }, 500)

    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader) return json({ error: 'unauthorized' }, 401)

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } }, auth: { persistSession: false } },
    )
    const { data: userData } = await userClient.auth.getUser()
    const user = userData?.user
    if (!user) return json({ error: 'unauthorized' }, 401)

    const { data: isAdmin } = await userClient.rpc('has_role', { _user_id: user.id, _role: 'admin' })
    if (!isAdmin) return json({ error: 'forbidden' }, 403)

    const body = await req.json()
    const proposalId = body?.proposal_id ? String(body.proposal_id) : null
    const clientName = String(body?.client_name ?? '').trim().slice(0, 120)
    const clientEmail = String(body?.client_email ?? '').trim().slice(0, 255)
    const link = String(body?.link ?? '').trim().slice(0, 500)
    const customMessage = String(body?.message ?? '').trim().slice(0, 3000)
    const subject = (String(body?.subject ?? '').trim() || `Sua proposta personalizada | Racun Agência`).slice(0, 180)

    if (!clientName || !link || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) {
      return json({ error: 'invalid_input' }, 400)
    }
    if (!/^https?:\/\//.test(link)) return json({ error: 'invalid_link' }, 400)

    const firstName = clientName.split(' ')[0]
    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;background:#040d28;color:#ffffff;padding:32px">
        <div style="max-width:600px;margin:0 auto">
          <h2 style="color:#FF00CC;margin:0 0 16px;font-size:24px">Olá, ${esc(firstName)}!</h2>
          <p style="line-height:1.7;color:#dfe4f2;margin:0 0 16px">
            Preparamos uma proposta personalizada para você. Basta acessar o link abaixo para ver todos
            os detalhes, valores e o que está incluído.
          </p>
          ${customMessage ? `<p style="line-height:1.7;color:#dfe4f2;margin:0 0 20px;white-space:pre-line">${esc(customMessage)}</p>` : ''}
          <p style="margin:0 0 28px">
            <a href="${esc(link)}" style="display:inline-block;background:#FF00CC;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:10px;font-weight:bold">
              Ver minha proposta
            </a>
          </p>
          <p style="line-height:1.7;color:#9aa4c2;margin:0 0 24px;font-size:13px">
            Ou copie este endereço: <span style="color:#ffffff">${esc(link)}</span>
          </p>
          <p style="margin:0;color:#FF00CC;font-weight:bold">Racun Agência</p>
          <p style="margin:4px 0 0;color:#9aa4c2;font-size:13px">agenciaracun.com</p>
        </div>
      </div>`

    const notifyTo = Deno.env.get('CONTACT_NOTIFY_EMAIL') ?? 'racunagencia@gmail.com'
    const senderEmail = Deno.env.get('SENDER_EMAIL') ?? 'contato@agenciaracun.com'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: `Racun Agência <${senderEmail}>`,
        to: [clientEmail],
        bcc: [notifyTo],
        reply_to: notifyTo,
        subject,
        html,
      }),
    })

    const admin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    if (!res.ok) {
      const details = await res.text()
      console.error(`Resend failed [${res.status}]: ${details}`)
      await admin.from('proposal_sends').insert({
        proposal_id: proposalId,
        client_name: clientName,
        client_email: clientEmail,
        link,
        subject,
        message: customMessage || null,
        status: 'failed',
        error: details.slice(0, 500),
      })
      return json({ error: 'send_failed', status: res.status }, 502)
    }

    const resendData = await res.json().catch(() => null)
    await admin.from('proposal_sends').insert({
      proposal_id: proposalId,
      client_name: clientName,
      client_email: clientEmail,
      link,
      subject,
      message: customMessage || null,
      status: 'sent',
      resend_email_id: resendData?.id ? String(resendData.id) : null,
    })

    return json({ ok: true })
  } catch (e) {
    console.error('send-proposal error', e)
    return json({ error: String(e) }, 500)
  }
})
