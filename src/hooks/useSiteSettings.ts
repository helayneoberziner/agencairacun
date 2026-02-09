import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  linkedin: string;
  youtube: string;
}

const defaultSettings: SiteSettings = {
  phone: '(47) 3209-6098',
  whatsapp: '554732096098',
  email: 'contato@racun.com.br',
  address: 'Rua Pontes de Miranda, 22 – Blumenau, SC',
  instagram: 'https://instagram.com/racunagency',
  linkedin: 'https://linkedin.com/company/racun',
  youtube: 'https://youtube.com/@racun',
};

export function useSiteSettings() {
  const queryClient = useQueryClient();

  const { data: settings = defaultSettings, isLoading } = useQuery({
    queryKey: ['site-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', 'site_settings')
        .maybeSingle();

      if (error) throw error;
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...(data.content as unknown as Partial<SiteSettings>) };
    },
    staleTime: 1000 * 60 * 5,
  });

  const updateMutation = useMutation({
    mutationFn: async (newSettings: SiteSettings) => {
      const { error } = await supabase
        .from('site_content')
        .update({
          content: JSON.parse(JSON.stringify(newSettings)),
          updated_at: new Date().toISOString(),
        })
        .eq('section_key', 'site_settings');

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-settings'] });
    },
  });

  return { settings, isLoading, updateSettings: updateMutation.mutateAsync, isUpdating: updateMutation.isPending };
}
