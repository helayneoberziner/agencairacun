import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

function decodeSecret(secret: string): Uint8Array {
  const prefix = 'whsec_'
  if (!secret.startsWith(prefix)) throw new Error('invalid_webhook_secret_format')
  const base64 = secret.slice(prefix.length)
  const bin = atob(base64)
  return Uint8Array.from(bin, c => c.charCodeAt(0))
}

async function verifySignature(payload: string, secret: string, headers: Headers): Promise<boolean> {
  const id = headers.get('svix-id') ?? headers.get('svixid') ?? ''
  const timestamp = headers.get('svix-timestamp') ?? headers.get('svixtimestamp') ?? ''
  const signatureHeader = headers.get('svix-signature') ?? headers.get('svixsignature') ?? ''
  if (!id || !timestamp || !signatureHeader) return false

  const ts = Number(timestamp)
  if (Number.isNaN(ts)) return false

  // Avoid replay attacks: timestamp must be within 5 minutes
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - ts) > 300) {
    console.error('Webhook timestamp too old', { now, ts })
    return false
  }

  const key = await crypto.subtle.importKey(
    'raw',
    decodeSecret(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signedContent = `${id}.${timestamp}.${payload}`
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedContent))
  const signatureHex = Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  const signatures = signatureHeader.split(' ').map(s => s.trim())
  return signatures.some(s => s === `v1,${signatureHex}`)
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  const secret = Deno.env.get('RESEND_WEBHOOK_SECRET')
  if (!secret) {
    console.error('RESEND_WEBHOOK_SECRET not configured')
    return json({ error: 'webhook_secret_not_configured' }, 500)
  }

  const payload = await req.text()
  if (!(await verifySignature(payload, secret, req.headers))) {
    console.error('Webhook signature verification failed')
    return json({ error: 'invalid_signature' }, 401)
  }

  try {
    const event = JSON.parse(payload)
    const emailId = event?.data?.email_id ?? event?.email_id ?? null
    const eventType = event?.type ?? 'unknown'

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } },
    )

    const { error: insertErr } = await supabase.from('resend_events').insert({
      email_id: emailId,
      event_type: eventType,
      payload: event,
    })

    if (insertErr) {
      console.error('Failed to store resend event:', insertErr)
      return json({ error: 'store_failed' }, 500)
    }

    if (emailId) {
      const statusMap: Record<string, string> = {
        'email.bounced': 'bounced',
        'email.complained': 'complained',
        'email.delivered': 'delivered',
        'email.opened': 'opened',
        'email.clicked': 'clicked',
      }

      if (statusMap[eventType]) {
        const { error: updateErr } = await supabase
          .from('contact_messages')
          .update({ status: statusMap[eventType] })
          .eq('resend_email_id', emailId)

        if (updateErr) {
          console.error('Failed to update contact message status:', updateErr)
        }
      }
    }

    return json({ ok: true })
  } catch (e) {
    console.error('resend-webhook error:', e)
    return json({ error: String(e) }, 500)
  }
})
