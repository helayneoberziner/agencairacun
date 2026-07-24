import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyToken(token: string, expectedGalleryId: string): Promise<boolean> {
  try {
    const decoded = atob(token)
    const parts = decoded.split(':')
    if (parts.length !== 3) return false
    const [gid, exp, sig] = parts
    if (gid !== expectedGalleryId) return false
    if (Number(exp) < Date.now()) return false
    const secret = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const expectedSig = await sha256(`${gid}:${exp}:${secret}`)
    return expectedSig === sig
  } catch { return false }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const { token, item_id } = await req.json()
    if (!token || !item_id) return new Response(JSON.stringify({ error: 'missing_params' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: item } = await supabase
      .from('gallery_items')
      .select('id, gallery_id, original_path, file_name')
      .eq('id', item_id)
      .maybeSingle()
    if (!item) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const ok = await verifyToken(token, item.gallery_id)
    if (!ok) return new Response(JSON.stringify({ error: 'invalid_token' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const { data: gallery } = await supabase
      .from('gallery_galleries')
      .select('status, expires_at, download_limit, access_type')
      .eq('id', item.gallery_id)
      .maybeSingle()
    if (!gallery || gallery.status !== 'active') return new Response(JSON.stringify({ error: 'inactive' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    if (gallery.expires_at && new Date(gallery.expires_at) < new Date()) return new Response(JSON.stringify({ error: 'expired' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    if (gallery.access_type !== 'free') {
      return new Response(JSON.stringify({ error: 'purchase_required' }), { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    if (gallery.download_limit) {
      const { count } = await supabase
        .from('gallery_downloads')
        .select('*', { count: 'exact', head: true })
        .eq('gallery_id', item.gallery_id)
      if ((count ?? 0) >= gallery.download_limit) {
        return new Response(JSON.stringify({ error: 'limit_reached' }), { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
      }
    }

    const { data: signed, error } = await supabase.storage
      .from('gallery-originals')
      .createSignedUrl(item.original_path, 60 * 5, { download: item.file_name ?? undefined })
    if (error || !signed) return new Response(JSON.stringify({ error: error?.message ?? 'sign_failed' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

    const ip = req.headers.get('x-forwarded-for') ?? null
    await supabase.from('gallery_downloads').insert({ gallery_id: item.gallery_id, item_id: item.id, ip })

    return new Response(JSON.stringify({ url: signed.signedUrl }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
  }
})