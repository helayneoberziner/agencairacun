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
    showreelYoutubeId: string;
    heroYoutubeId: string;
  };
  services: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    sectionSubtitle: string;
    items: { num: string; title: string; description: string }[];
  };
  portfolio: {
    sectionTitle: string;
    sectionSubtitle: string;
    items: { title: string; client: string; youtubeId: string }[];
  };
  segments: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    items: { title: string; description: string }[];
  };
  bastidores: {
    sectionTitle: string;
    images: string[];
  };
  faq: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    items: { question: string; answer: string }[];
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
    title: 'Vídeo com',
    titleHighlight: 'propósito.',
    subtitle: 'Não é só vídeo bonito. É vídeo que trabalha pela sua marca.',
    ctaText: 'Ver showreel',
    showreelLabel: 'Showreel 2024',
    showreelYoutubeId: 'dQw4w9WgXcQ',
    heroYoutubeId: 'dQw4w9WgXcQ',
  },
  services: {
    sectionTitle: 'O que a gente',
    sectionTitleHighlight: 'faz.',
    sectionSubtitle: 'Cada projeto é único. Aqui estão as especialidades que dominamos.',
    items: [
      { num: '01', title: 'Vídeos Institucionais', description: 'Apresente a essência da sua empresa com narrativa envolvente e produção cinematográfica.' },
      { num: '02', title: 'Campanhas Publicitárias', description: 'Criação completa de peças audiovisuais para campanhas de alto impacto.' },
      { num: '03', title: 'Conteúdo para Redes Sociais', description: 'Vídeos estratégicos pensados para engajar, converter e posicionar sua marca online.' },
      { num: '04', title: 'Vídeos Imobiliários', description: 'Tours cinematográficos que valorizam cada detalhe do seu empreendimento.' },
      { num: '05', title: 'Cobertura de Eventos', description: 'Captação profissional que transforma momentos em conteúdo memorável.' },
      { num: '06', title: 'Conteúdo para Tráfego Pago', description: 'Vídeos otimizados para performance em plataformas de anúncios.' },
    ],
  },
  portfolio: {
    sectionTitle: 'Nosso trabalho.',
    sectionSubtitle: 'Projetos que unem estética cinematográfica e estratégia de marca.',
    items: [
      { title: 'Campanha Verão 2024', client: 'Cliente', youtubeId: 'dQw4w9WgXcQ' },
      { title: 'Institucional Corporativo', client: 'Cliente', youtubeId: 'jNQXAC9IVRw' },
      { title: 'Tour Imobiliário', client: 'Cliente', youtubeId: 'M7lc1UVf-VE' },
      { title: 'Conteúdo Social', client: 'Cliente', youtubeId: '9bZkp7q19f0' },
      { title: 'Cobertura de Evento', client: 'Cliente', youtubeId: 'kJQP7kiw5Fk' },
      { title: 'Campanha Digital', client: 'Cliente', youtubeId: 'RgKAFK5djSk' },
    ],
  },
  segments: {
    sectionTitle: 'Segmentos que',
    sectionTitleHighlight: 'atendemos.',
    items: [
      { title: 'Imobiliário', description: 'Tours e lançamentos que vendem.' },
      { title: 'Empresas', description: 'Vídeos que contam sua história.' },
      { title: 'Restaurantes', description: 'Gastronomia em alta definição.' },
      { title: 'Eventos', description: 'Momentos que merecem ser vistos.' },
      { title: 'Marcas', description: 'Posicionamento visual premium.' },
    ],
  },
  bastidores: {
    sectionTitle: 'Bastidores.',
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1579762715118-a6f1d789a5b5?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&h=600&fit=crop',
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=600&h=600&fit=crop',
    ],
  },
  faq: {
    sectionTitle: 'Perguntas',
    sectionTitleHighlight: 'frequentes.',
    items: [
      { question: 'Vocês criam o roteiro?', answer: 'Sim! Desenvolvemos o roteiro do zero, alinhado ao seu objetivo e ao público da sua marca.' },
      { question: 'Qual o prazo médio de entrega?', answer: 'Depende do escopo, mas a maioria dos projetos é entregue entre 7 e 15 dias úteis após a captação.' },
      { question: 'Os vídeos podem ser usados em anúncios pagos?', answer: 'Com certeza. Entregamos nos formatos e proporções ideais para cada plataforma de mídia paga.' },
      { question: 'Vocês atendem fora de Blumenau?', answer: 'Sim, atendemos em todo o Brasil. Já produzimos em diversas cidades e estados.' },
      { question: 'Vocês trabalham com contrato?', answer: 'Sim, todos os projetos são formalizados com contrato para segurança de ambas as partes.' },
    ],
  },
  cta: {
    title: 'Vamos criar algo',
    titleHighlight: 'incrível?',
    subtitle: 'Conte com a Racun Filmes para transformar a comunicação da sua marca com vídeos de alto impacto.',
    ctaText: 'Orçar um projeto audiovisual',
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
      const saved = data.content as unknown as Partial<ProdutoraContent>;
      return {
        hero: { ...defaultProdutoraContent.hero, ...saved.hero },
        services: { ...defaultProdutoraContent.services, ...saved.services },
        portfolio: { ...defaultProdutoraContent.portfolio, ...saved.portfolio },
        segments: { ...defaultProdutoraContent.segments, ...saved.segments },
        bastidores: { ...defaultProdutoraContent.bastidores, ...saved.bastidores },
        faq: { ...defaultProdutoraContent.faq, ...saved.faq },
        cta: { ...defaultProdutoraContent.cta, ...saved.cta },
      };
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
