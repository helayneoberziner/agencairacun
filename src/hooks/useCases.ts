import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CaseRow {
  id: string;
  slug: string;
  client_name: string;
  title: string;
  subtitle: string | null;
  hero_kind: string;
  hero_media_url: string | null;
  hero_youtube_id: string | null;
  hero_image_url: string | null;
  challenge: string | null;
  strategy: string | null;
  solution: string | null;
  results_text: string | null;
  metrics: Array<{ label: string; value: string }>;
  testimonial_text: string | null;
  testimonial_author: string | null;
  categories: string[];
  segments: string[];
  is_active: boolean;
  is_featured: boolean;
  show_on_home: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
}

export interface CaseMediaRow {
  id: string;
  case_id: string;
  kind: string; // image | video_youtube | video_file
  url: string | null;
  youtube_id: string | null;
  caption: string | null;
  section: string; // audiovisual | marketing | galeria | bastidores
  display_order: number;
}

export function useCases(opts: { homeOnly?: boolean } = {}) {
  return useQuery({
    queryKey: ['cases', opts.homeOnly ? 'home' : 'all'],
    queryFn: async () => {
      let q = supabase.from('cases' as any).select('*').eq('is_active', true).order('display_order', { ascending: true });
      if (opts.homeOnly) q = q.eq('show_on_home', true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as unknown as CaseRow[];
    },
  });
}

export function useCaseBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['case', slug],
    enabled: !!slug,
    queryFn: async () => {
      const { data: c, error } = await supabase
        .from('cases' as any)
        .select('*')
        .eq('slug', slug!)
        .eq('is_active', true)
        .maybeSingle();
      if (error) throw error;
      if (!c) return null;
      const { data: media } = await supabase
        .from('case_media' as any)
        .select('*')
        .eq('case_id', (c as any).id)
        .order('display_order', { ascending: true });
      return { case: c as unknown as CaseRow, media: (media ?? []) as unknown as CaseMediaRow[] };
    },
  });
}