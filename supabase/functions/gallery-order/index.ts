import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

interface Tier { min_qty: number; unit_price: number }

function unitPriceFor(tiers: Tier[], qty: number) {
  if (!tiers.length || qty <= 0) return 0
  let price = tiers[0].unit_price
  for (const t of tiers) if (qty >= t.min_qty) price = t.unit_price
  return price
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })
  try {
    const { slug, item_ids, client_email, client_name } = await req.json()
    if (!slug || !Array.isArray(item_ids) || !item_ids.length || !client_email) return json({ error: 'missing_params' }, 400)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { data: gallery } = await supabase
      .from('gallery_galleries')
      .select('id, status, expires_at, price_tiers')
      .eq('slug', slug)
      .maybeSingle()

    if (!gallery) return json({ error: 'not_found' }, 404)
    if (gallery.status !== 'active') return json({ error: 'inactive' }, 403)
    if (gallery.expires_at && new Date(gallery.expires_at) < new Date()) return json({ error: 'expired' }, 403)

    const tiers: Tier[] = (Array.isArray(gallery.price_tiers) ? gallery.price_tiers : [])
      .map((t: any) => ({ min_qty: Number(t?.min_qty) || 1, unit_price: Number(t?.unit_price) || 0 }))
      .filter((t: Tier) => t.unit_price > 0)
      .sort((a: Tier, b: Tier) => a.min_qty - b.min_qty)
    if (!tiers.length) return json({ error: 'sale_not_configured' }, 400)

    // Only accept items that really belong to this gallery
    const { data: items } = await supabase
      .from('gallery_items')
      .select('id')
      .eq('gallery_id', gallery.id)
      .in('id', item_ids)
    const validIds = (items ?? []).map((i: { id: string }) => i.id)
    if (!validIds.length) return json({ error: 'invalid_items' }, 400)

    const qty = validIds.length
    const unit = unitPriceFor(tiers, qty)
    const base = tiers[0].unit_price
    const subtotal = Number((base * qty).toFixed(2))
    const total = Number((unit * qty).toFixed(2))
    const discount = Number((subtotal - total).toFixed(2))

    const { data: order, error: orderErr } = await supabase
      .from('gallery_orders')
      .insert({
        gallery_id: gallery.id,
        client_email,
        client_name: client_name ?? null,
        status: 'pending',
        subtotal, discount, total,
      })
      .select('id')
      .single()
    if (orderErr || !order) return json({ error: orderErr?.message ?? 'order_failed' }, 500)

    const { error: itemsErr } = await supabase
      .from('gallery_order_items')
      .insert(validIds.map(id => ({ order_id: order.id, item_id: id, unit_price: unit })))
    if (itemsErr) return json({ error: itemsErr.message }, 500)

    return json({ order_id: order.id, qty, unit_price: unit, subtotal, discount, total })
  } catch (e) {
    return json({ error: (e as Error).message }, 500)
  }
})
