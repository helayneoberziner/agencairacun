import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ClientLogo {
  id: string;
  name: string;
  image_url: string;
  segments?: string[];
}

export function useClientLogos() {
  const queryClient = useQueryClient();

  const { data: logos = [], isLoading } = useQuery({
    queryKey: ['client-logos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'client_logos')
        .maybeSingle();

      if (error) throw error;
      if (!data) return [];
      return (data.content as unknown as ClientLogo[]) || [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateLogos = useMutation({
    mutationFn: async (newLogos: ClientLogo[]) => {
      // Try update first
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section_key', 'client_logos')
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('site_content')
          .update({ content: JSON.parse(JSON.stringify(newLogos)), updated_at: new Date().toISOString() })
          .eq('section_key', 'client_logos');
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('site_content')
          .insert({ section_key: 'client_logos', content: JSON.parse(JSON.stringify(newLogos)) });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-logos'] });
    },
  });

  const uploadLogo = async (file: File, name: string): Promise<ClientLogo> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('client-logos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('client-logos')
      .getPublicUrl(fileName);

    return { id: crypto.randomUUID(), name, image_url: publicUrl, segments: [] };
  };

  const deleteLogo = async (logo: ClientLogo, currentLogos: ClientLogo[]) => {
    // Extract file path from URL
    const urlParts = logo.image_url.split('/client-logos/');
    if (urlParts[1]) {
      await supabase.storage.from('client-logos').remove([urlParts[1]]);
    }
    const newLogos = currentLogos.filter(l => l.id !== logo.id);
    await updateLogos.mutateAsync(newLogos);
  };

  return { logos, isLoading, updateLogos: updateLogos.mutateAsync, uploadLogo, deleteLogo, isUpdating: updateLogos.isPending };
}
