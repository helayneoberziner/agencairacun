import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useGalleries() {
  return useQuery({
    queryKey: ['galleries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_galleries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useGallery(id: string | undefined) {
  return useQuery({
    queryKey: ['gallery', id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_galleries')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useGalleryItems(galleryId: string | undefined) {
  return useQuery({
    queryKey: ['gallery-items', galleryId],
    enabled: !!galleryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('gallery_id', galleryId!)
        .order('display_order', { ascending: true })
        .order('created_at', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}