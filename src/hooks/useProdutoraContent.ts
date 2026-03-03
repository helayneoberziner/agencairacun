import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ProdutoraContent {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
    showreelLabel: string;
  };
  services: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    sectionSubtitle: string;
    items: { title: string; description: string }[];
  };
  portfolio: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: { title: string; client: string }[];
  };
  cta: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
  };
}

export const defaultProdutoraContent: ProdutoraContent = {
  hero: {
    badge: 'Produtora Audiovisual',
    title: 'Filmes e campanhas com',
    titleHighlight: 'estética de cinema',
    subtitle: 'Produzimos conteúdo audiovisual premium para marcas que querem se destacar e contar histórias memoráveis.',
    ctaText: 'Orçar um filme',
    showreelLabel: 'Showreel 2024',
  },
  services: {
    sectionTitle: 'O que',
    sectionTitleHighlight: 'produzimos',
    sectionSubtitle: 'Do conceito à entrega final, cuidamos de cada detalhe da sua produção.',
    items: [
      { title: 'Filmes Institucionais', description: 'Conte a história da sua empresa com qualidade cinematográfica. Ideal para apresentações, sites e eventos.' },
      { title: 'Campanhas Publicitárias', description: 'Comerciais e vídeos para campanhas de mídia. Do roteiro à entrega final.' },
      { title: 'Reels Premium', description: 'Conteúdo de alta qualidade para redes sociais. Reels e vídeos curtos com produção profissional.' },
      { title: 'Cobertura de Eventos', description: 'Registro completo de eventos corporativos, lançamentos e convenções.' },
    ],
  },
  portfolio: {
    sectionTitle: 'Portfólio',
    sectionSubtitle: 'Alguns dos nossos trabalhos mais recentes.',
    items: [
      { title: 'Filme Institucional', client: 'Indústria' },
      { title: 'Campanha Digital', client: 'Varejo' },
      { title: 'Evento Corporativo', client: 'Tecnologia' },
      { title: 'Comercial TV', client: 'Alimentos' },
      { title: 'Documentário', client: 'ONG' },
      { title: 'Reels Série', client: 'Moda' },
    ],
  },
  cta: {
    title: 'Vamos criar algo',
    titleHighlight: 'incrível juntos?',
    subtitle: 'Conte sua ideia e vamos transformar em um filme que vai impactar seu público.',
    ctaText: 'Orçar um filme',
  },
};

const SECTION_KEY = 'produtora_content';

export const useProdutoraContent = () => {
  const queryClient = useQueryClient();

  const { data: content = defaultProdutoraContent, isLoading } = useQuery({
    queryKey: ['produtora-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultProdutoraContent;
      return { ...defaultProdutoraContent, ...(data.content as unknown as Partial<ProdutoraContent>) };
    },
  });

  const { mutateAsync: updateContent, isPending: isUpdating } = useMutation({
    mutationFn: async (newContent: ProdutoraContent) => {
      const { data: existing } = await supabase
        .from('site_content')
        .select('id')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();

      const payload = JSON.parse(JSON.stringify(newContent));
      if (existing) {
        const { error } = await supabase.from('site_content').update({ content: payload }).eq('section_key', SECTION_KEY);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_content').insert([{ section_key: SECTION_KEY, content: payload }]);
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['produtora-content'] }),
  });

  return { content, isLoading, updateContent, isUpdating };
};
