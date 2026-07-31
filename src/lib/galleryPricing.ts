export interface PriceTier {
  min_qty: number;
  unit_price: number;
}

export function parseTiers(raw: unknown): PriceTier[] {
  if (!Array.isArray(raw)) return [];
  return (raw as any[])
    .map(t => ({ min_qty: Number(t?.min_qty) || 1, unit_price: Number(t?.unit_price) || 0 }))
    .filter(t => t.unit_price > 0)
    .sort((a, b) => a.min_qty - b.min_qty);
}

/** Unit price for a given quantity, using the highest tier whose min_qty is reached. */
export function unitPriceFor(tiers: PriceTier[], qty: number): number {
  if (!tiers.length || qty <= 0) return 0;
  let price = tiers[0].unit_price;
  for (const t of tiers) if (qty >= t.min_qty) price = t.unit_price;
  return price;
}

export interface PriceBreakdown {
  qty: number;
  unitPrice: number;
  basePrice: number;
  subtotal: number;
  discount: number;
  total: number;
  nextTier: PriceTier | null;
  missingForNextTier: number;
}

export function computePrice(tiers: PriceTier[], qty: number): PriceBreakdown {
  const base = tiers.length ? tiers[0].unit_price : 0;
  const unitPrice = unitPriceFor(tiers, qty);
  const subtotal = base * qty;
  const total = unitPrice * qty;
  const nextTier = tiers.find(t => t.min_qty > qty) ?? null;
  return {
    qty,
    unitPrice,
    basePrice: base,
    subtotal,
    discount: Math.max(0, subtotal - total),
    total,
    nextTier,
    missingForNextTier: nextTier ? nextTier.min_qty - qty : 0,
  };
}

export function brl(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const KEY = 'racun_gallery_client_key';
export function galleryClientKey(): string {
  let k = localStorage.getItem(KEY);
  if (!k) {
    k = (crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)) + Date.now().toString(36);
    localStorage.setItem(KEY, k);
  }
  return k;
}
