import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface RestaurantesContent {
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
  };
  deliverables: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    sectionSubtitle: string;
    items: { title: string; description: string }[];
  };
  monthFlow: {
    sectionTitle: string;
    sectionTitleHighlight: string;
    sectionSubtitle: string;
    items: { week: string; title: string; description: string }[];
  };
  contentPillars: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  trafficBenefits: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    items: string[];
  };
  cta: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    ctaText: string;
  };
}

export const defaultRestaurantesContent: RestaurantesContent = {
  hero: {
    badge: 'Marketing para Restaurantes',
    title: 'Lote a casa e aumente os',
    titleHighlight: 'pedidos delivery',
    subtitle: 'Marketing especializado para restaurantes com foco em conteúdo que dá fome e tráfego pago que traz clientes para a mesa.',
    ctaText: 'Quero um plano para meu restaurante',
  },
  deliverables: {
    sectionTitle: 'O que',
    sectionTitleHighlight: 'entregamos',
    sectionSubtitle: 'Conteúdo + Tráfego: a combinação perfeita para restaurantes que querem crescer.',
    items: [
      { title: 'Conteúdo Visual Premium', description: 'Fotos e vídeos que dão água na boca. Captação profissional dos seus pratos e ambiente.' },
      { title: 'Gestão de Tráfego Pago', description: 'Campanhas otimizadas para alcance local, promoções e aumento de pedidos delivery.' },
      { title: 'Calendário Editorial', description: 'Planejamento mensal de conteúdo alinhado com datas comemorativas e promoções.' },
      { title: 'Alcance Local', description: 'Estratégias para aparecer para quem está perto e pronto para pedir ou visitar.' },
    ],
  },
  monthFlow: {
    sectionTitle: 'Como funciona o',
    sectionTitleHighlight: 'mês',
    sectionSubtitle: 'Um fluxo organizado para garantir conteúdo constante e campanhas otimizadas.',
    items: [
      { week: 'Semana 1', title: 'Captação', description: 'Sessão de fotos e vídeos dos pratos, ambiente e bastidores.' },
      { week: 'Semana 2', title: 'Edição', description: 'Produção de reels, fotos e materiais para o mês.' },
      { week: 'Semana 3', title: 'Postagem', description: 'Publicação do conteúdo de acordo com o calendário editorial.' },
      { week: 'Semana 4', title: 'Campanhas', description: 'Lançamento e otimização de campanhas de tráfego pago.' },
    ],
  },
  contentPillars: {
    title: 'Pilares de',
    titleHighlight: 'conteúdo',
    subtitle: 'Uma estratégia de conteúdo completa que mostra o melhor do seu restaurante e engaja seu público.',
    items: [
      { title: 'Pratos', description: 'Os destaques do cardápio em close e com movimento' },
      { title: 'Bastidores', description: 'Preparo, cozinha e o dia a dia do restaurante' },
      { title: 'Prova Social', description: 'Clientes satisfeitos e o movimento da casa' },
      { title: 'Ofertas', description: 'Promoções, combos e novidades do menu' },
    ],
  },
  trafficBenefits: {
    title: 'Tráfego pago para',
    titleHighlight: 'restaurantes',
    subtitle: 'Campanhas específicas para o segmento de alimentação que trazem clientes para a mesa e para o app.',
    items: [
      'Alcance local segmentado por bairro',
      'Campanhas para promoções e eventos',
      'Remarketing para quem já visitou',
      'Anúncios em mapas e rotas',
      'Campanhas de delivery e retirada',
      'Aumento de avaliações positivas',
    ],
  },
  cta: {
    title: 'Pronto para',
    titleHighlight: 'lotar a casa?',
    subtitle: 'Vamos criar uma estratégia personalizada para o seu restaurante crescer com conteúdo e tráfego pago.',
    ctaText: 'Quero um plano para meu restaurante',
  },
};

const SECTION_KEY = 'restaurantes_content';

export const useRestaurantesContent = () => {
  const queryClient = useQueryClient();

  const { data: content = defaultRestaurantesContent, isLoading } = useQuery({
    queryKey: ['restaurantes-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('content')
        .eq('section_key', SECTION_KEY)
        .maybeSingle();
      if (error) throw error;
      if (!data) return defaultRestaurantesContent;
      return { ...defaultRestaurantesContent, ...(data.content as unknown as Partial<RestaurantesContent>) };
    },
  });

  const { mutateAsync: updateContent, isPending: isUpdating } = useMutation({
    mutationFn: async (newContent: RestaurantesContent) => {
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['restaurantes-content'] }),
  });

  return { content, isLoading, updateContent, isUpdating };
};
