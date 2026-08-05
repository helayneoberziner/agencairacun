import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const { slug, password } = await req.json()
    if (!slug) return new Response(JSON.stringify({ error: 'slug required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: gallery } = await supabase
      .from('gallery_galleries')
      .select('id, password_hash, status, expires_at')
      .eq('slug', slug)
      .maybeSingle()

    if (!gallery) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (gallery.status !== 'active') return new Response(JSON.stringify({ error: 'inactive' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (gallery.expires_at && new Date(gallery.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'expired' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    if (gallery.password_hash) {
      if (!password) return new Response(JSON.stringify({ error: 'password_required' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      const hash = await sha256(password)
      if (hash !== gallery.password_hash) return new Response(JSON.stringify({ error: 'invalid_password' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // token: signed value = base64(gallery_id + ':' + expiry + ':' + hmac)
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const exp = Date.now() + 1000 * 60 * 60 * 4 // 4h
    const payload = `${gallery.id}:${exp}`
    const sig = await sha256(payload + ':' + secret)
    const token = btoa(`${payload}:${sig}`)

    // Register a server-side session so RLS-protected content can be released
    // only to callers that proved gallery access (password when required).
    await supabase.from('gallery_sessions').insert({
      gallery_id: gallery.id,
      token,
      expires_at: new Date(exp).toISOString(),
    })

    return new Response(JSON.stringify({ token, gallery_id: gallery.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})