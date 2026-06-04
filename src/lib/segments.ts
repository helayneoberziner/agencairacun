export interface SegmentDef {
  slug: string;
  label: string;
  path: string;
}

export const SEGMENTS: SegmentDef[] = [
  { slug: 'imobiliario', label: 'Imobiliário', path: '/imobiliario' },
  { slug: 'empresas', label: 'Empresas', path: '/empresas' },
  { slug: 'eventos', label: 'Eventos', path: '/eventos' },
  { slug: 'marcas', label: 'Marcas', path: '/marcas' },
  { slug: 'restaurantes', label: 'Restaurantes', path: '/restaurantes' },
  { slug: 'politica', label: 'Política', path: '/politica' },
];

export const APPEARS_OPTIONS: { value: string; label: string }[] = [
  { value: 'home_audio', label: 'Home audiovisual' },
  { value: 'home_mkt', label: 'Home marketing' },
  { value: 'produtora', label: 'Página Produtora' },
  { value: 'cases', label: 'Página de Cases' },
  ...SEGMENTS.map(s => ({ value: `seg:${s.slug}`, label: `Segmento ${s.label}` })),
];

export function segmentLabel(slug: string): string {
  return SEGMENTS.find(s => s.slug === slug)?.label ?? slug;
}

export function normalizeSegment(value: string): string {
  const v = (value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const direct = SEGMENTS.find(s => s.slug === v || s.label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === v);
  return direct?.slug ?? v;
}