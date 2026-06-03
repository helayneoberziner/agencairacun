import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  image_url?: string;
  rating?: number;
}

const SECTION_KEY = 'testimonials';

export const useTestimonials = () => {
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();
      if (error) throw error;
      if (!data) return [];
      const content = data.content as unknown;
      if (Array.isArray(content)) return content as Testimonial[];
      return [];
    },
  });

  const { mutateAsync: updateTestimonials, isPending: isUpdating } = useMutation({
    mutationFn: async (items: Testimonial[]) => {
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_content')
          .update({ content: JSON.parse(JSON.stringify(items)) })
          .eq('section_key', SECTION_KEY);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert([{ section_key: SECTION_KEY, content: JSON.parse(JSON.stringify(items)) }]);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  const addTestimonial = async (t: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = { ...t, id: crypto.randomUUID() };
    await updateTestimonials([...testimonials, newItem]);
    return newItem;
  };

  const deleteTestimonial = async (id: string) => {
    await updateTestimonials(testimonials.filter(t => t.id !== id));
  };

  const editTestimonial = async (id: string, updates: Partial<Omit<Testimonial, 'id'>>) => {
    await updateTestimonials(testimonials.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  return { testimonials, isLoading, isUpdating, addTestimonial, deleteTestimonial, editTestimonial, updateTestimonials };
};
