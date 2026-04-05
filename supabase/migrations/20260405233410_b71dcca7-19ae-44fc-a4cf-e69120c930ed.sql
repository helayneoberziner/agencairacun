
CREATE TABLE public.proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL DEFAULT '[Nome do Cliente]',
  validity_days INTEGER NOT NULL DEFAULT 7,
  whatsapp_number TEXT NOT NULL DEFAULT '5547999999999',
  is_active BOOLEAN NOT NULL DEFAULT true,

  marketing_price TEXT NOT NULL DEFAULT '[VALOR]',
  marketing_includes TEXT[] NOT NULL DEFAULT ARRAY['Gestão de redes sociais (Instagram + Facebook)', 'Planejamento de conteúdo mensal', 'Criação de artes e copies', 'Relatório mensal de performance', 'Gestão de tráfego pago'],
  marketing_bonus TEXT[] NOT NULL DEFAULT ARRAY['Consultoria inicial de posicionamento', 'Análise de concorrência'],
  marketing_differentials TEXT[] NOT NULL DEFAULT ARRAY['Estratégia personalizada baseada em dados reais da sua marca.', 'Equipe dedicada com reuniões quinzenais de alinhamento.', 'Acesso a relatórios transparentes e métricas reais.'],

  audiovisual_price TEXT NOT NULL DEFAULT '[VALOR]',
  audiovisual_includes TEXT[] NOT NULL DEFAULT ARRAY['Roteiro criativo alinhado ao briefing', 'Captação em alta resolução (4K)', 'Direção de arte e fotografia', 'Edição e pós-produção profissional', 'Entrega otimizada para cada plataforma'],
  audiovisual_bonus TEXT[] NOT NULL DEFAULT ARRAY['Making of do projeto incluso', 'Versão vertical para stories/reels'],
  audiovisual_differentials TEXT[] NOT NULL DEFAULT ARRAY['Produção cinematográfica com equipamento profissional.', 'Processo criativo colaborativo do briefing à entrega.', 'Revisões ilimitadas até a aprovação final.'],

  complete_price TEXT NOT NULL DEFAULT '[VALOR]',
  complete_includes TEXT[] NOT NULL DEFAULT ARRAY['Tudo do plano Marketing Digital', 'Tudo do plano Audiovisual', 'Estratégia integrada de conteúdo', 'Planejamento de campanhas completas', 'Suporte prioritário'],
  complete_bonus TEXT[] NOT NULL DEFAULT ARRAY['Sessão fotográfica trimestral', 'Vídeo institucional incluso no primeiro mês'],
  complete_differentials TEXT[] NOT NULL DEFAULT ARRAY['Solução 360° que une marketing e audiovisual.', 'Um único ponto de contato para toda a comunicação.', 'Resultados mensuráveis com relatórios integrados.'],

  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- Qualquer pessoa pode ver propostas ativas (acesso público pelo link)
CREATE POLICY "Anyone can view active proposals"
  ON public.proposals FOR SELECT
  USING (is_active = true);

-- Admins podem fazer tudo
CREATE POLICY "Admins can manage proposals"
  ON public.proposals FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_proposals_updated_at
  BEFORE UPDATE ON public.proposals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
