import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SegmentServiceItem {
  icon: string;
  title: string;
  description: string;
}

export interface SegmentContent {
  hero: {
    title: string;
    highlight: string;
    subtitle: string;
    ctaText: string;
    mediaType: 'image' | 'video';
    mediaUrl: string;
  };
  intro: { title: string; description: string };
  marketing: { title: string; subtitle: string; items: SegmentServiceItem[] };
  audiovisual: { title: string; subtitle: string; items: SegmentServiceItem[] };
  portfolio: { title: string; projectIds: string[] };
  gallery: { title: string; images: string[] };
  videoFeatured: { title: string; youtubeId: string };
  testimonialIds: string[];
  faq: { title: string; items: { question: string; answer: string }[] };
  finalCta: { title: string; subtitle: string; buttonText: string; whatsappMessage: string };
}

export interface SegmentPage {
  id: string;
  slug: string;
  name: string;
  is_active: boolean;
  display_order: number;
  seo_title: string | null;
  seo_description: string | null;
  og_image_url: string | null;
  content: SegmentContent;
}

export const useSegmentPage = (slug: string) => {
  return useQuery({
    queryKey: ['segment-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('segment_pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();
      if (error) throw error;
      return data as unknown as SegmentPage | null;
    },
  });
};

export const useSegmentsList = () => {
  return useQuery({
    queryKey: ['segment-pages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('segment_pages')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return (data ?? []) as unknown as SegmentPage[];
    },
  });
};

export const useUpdateSegmentPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (page: SegmentPage) => {
      const { error } = await supabase
        .from('segment_pages')
        .update({
          name: page.name,
          is_active: page.is_active,
          display_order: page.display_order,
          seo_title: page.seo_title,
          seo_description: page.seo_description,
          og_image_url: page.og_image_url,
          content: JSON.parse(JSON.stringify(page.content)),
        })
        .eq('id', page.id);
      if (error) throw error;
    },
    onSuccess: (_, page) => {
      qc.invalidateQueries({ queryKey: ['segment-pages'] });
      qc.invalidateQueries({ queryKey: ['segment-page', page.slug] });
    },
  });
};

const emptyContent = () => ({
  hero: { title: 'Novo segmento', highlight: '', subtitle: '', ctaText: 'Falar com a Racun', mediaType: 'image' as const, mediaUrl: '' },
  intro: { title: '', description: '' },
  marketing: { title: 'Marketing Digital', subtitle: '', items: [] },
  audiovisual: { title: 'Audiovisual', subtitle: '', items: [] },
  portfolio: { title: 'Portfólio', projectIds: [] },
  gallery: { title: 'Galeria', images: [] },
  videoFeatured: { title: 'Vídeo em destaque', youtubeId: '' },
  testimonialIds: [],
  faq: { title: 'Perguntas frequentes', items: [] },
  finalCta: { title: 'Vamos conversar?', subtitle: '', buttonText: 'Falar agora', whatsappMessage: 'Olá! Quero conhecer os serviços da Racun.' },
});

export const useCreateSegmentPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { slug: string; name: string }) => {
      const { data, error } = await supabase.from('segment_pages').insert({
        slug: input.slug,
        name: input.name,
        is_active: true,
        display_order: 999,
        content: emptyContent() as any,
      }).select().single();
      if (error) throw error;
      return data as unknown as SegmentPage;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['segment-pages'] }),
  });
};

export const useDeleteSegmentPage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('segment_pages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['segment-pages'] }),
  });
};