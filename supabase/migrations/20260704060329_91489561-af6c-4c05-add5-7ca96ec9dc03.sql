
UPDATE public.segment_pages
SET
  seo_title = 'Vídeo Institucional para Empresas · Racun',
  seo_description = 'Produção de vídeos institucionais que traduzem a essência, os valores e a credibilidade da sua empresa. Roteiro, direção, filmagem e edição com padrão cinematográfico.',
  content = jsonb_set(
    jsonb_set(
      jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              jsonb_set(
                content::jsonb,
                '{hero}',
                jsonb_build_object(
                  'title', 'A imagem da sua empresa em',
                  'highlight', 'formato cinematográfico',
                  'subtitle', 'Vídeos institucionais que comunicam quem você é, o que faz e por que merece confiança. Produção completa, do roteiro à entrega final.',
                  'ctaText', 'Quero um vídeo institucional',
                  'mediaType', COALESCE(content->'hero'->>'mediaType','image'),
                  'mediaUrl', COALESCE(content->'hero'->>'mediaUrl','')
                )
              ),
              '{intro}',
              jsonb_build_object(
                'title', 'O cartão de visitas mais poderoso da sua marca',
                'description', 'Um vídeo institucional bem feito abre portas, encurta caminhos comerciais e fortalece a autoridade da sua empresa. Cuidamos de cada etapa da produção com atenção à narrativa, direção de arte e qualidade de imagem para que a sua história seja contada da forma certa.'
              )
            ),
            '{marketing}',
            jsonb_build_object(
              'title', 'Estratégia e distribuição',
              'subtitle', 'Além de produzir, ajudamos você a fazer o vídeo chegar nas pessoas certas.',
              'items', jsonb_build_array(
                jsonb_build_object('icon','Target','title','Posicionamento de marca','description','Definição de mensagem central, tom de voz e diferenciais para o seu vídeo comunicar exatamente o que sua empresa é.'),
                jsonb_build_object('icon','LineChart','title','Distribuição estratégica','description','Uso do vídeo em campanhas pagas, redes sociais, site, apresentações comerciais e propostas.'),
                jsonb_build_object('icon','FileText','title','Versões e cortes','description','Entrega em múltiplos formatos: institucional longo, versão comercial, cortes para redes e reels.')
              )
            )
          ),
          '{audiovisual}',
          jsonb_build_object(
            'title', 'Produção audiovisual completa',
            'subtitle', 'Roteiro, direção, captação e pós produção com padrão cinematográfico.',
            'items', jsonb_build_array(
              jsonb_build_object('icon','Video','title','Vídeo institucional','description','Produção do zero: briefing, roteiro, filmagem, edição, trilha e finalização.'),
              jsonb_build_object('icon','Mic','title','Depoimentos e cases','description','Entrevistas com clientes, sócios e colaboradores registradas com qualidade profissional.'),
              jsonb_build_object('icon','Camera','title','Bastidores e cultura','description','Registro do dia a dia, da equipe e dos valores que fazem sua empresa única.'),
              jsonb_build_object('icon','Plane','title','Imagens aéreas','description','Captação com drone para valorizar sede, fábrica, operação e localização.'),
              jsonb_build_object('icon','Film','title','Cobertura de eventos','description','Convenções, inaugurações, treinamentos e encontros corporativos registrados por completo.'),
              jsonb_build_object('icon','Sparkles','title','Motion e finalização','description','Vinhetas, legendas, animações de logo e tratamento de cor para um resultado premium.')
            )
          )
        ),
        '{faq}',
        jsonb_build_object(
          'title','Perguntas frequentes',
          'items', jsonb_build_array(
            jsonb_build_object('question','Quanto tempo leva para produzir um vídeo institucional?','answer','Em média de duas a quatro semanas, considerando alinhamento, roteiro, gravação e edição. Prazos podem variar conforme a complexidade.'),
            jsonb_build_object('question','Vocês cuidam do roteiro?','answer','Sim. Fazemos briefing, pesquisa e construção do roteiro junto com você para garantir que o vídeo diga exatamente o que precisa dizer.'),
            jsonb_build_object('question','Podemos usar o vídeo em redes sociais e anúncios?','answer','Sim. Entregamos cortes verticais, quadrados e horizontais para redes, site, apresentações e mídia paga.'),
            jsonb_build_object('question','Vocês atendem empresas fora de Cuiabá?','answer','Sim, atendemos em todo o Brasil. Deslocamentos são combinados no orçamento.')
          )
        )
      ),
      '{finalCta}',
      jsonb_build_object(
        'title','Pronto para mostrar quem sua empresa realmente é?',
        'subtitle','Fale com a Racun e vamos criar juntos o vídeo institucional que a sua marca merece.',
        'buttonText','Falar com a Racun',
        'whatsappMessage','Olá! Quero um vídeo institucional produzido pela Racun.'
      )
    ),
    '{portfolio}',
    jsonb_build_object(
      'title','Institucionais que já produzimos',
      'projectIds', COALESCE(content->'portfolio'->'projectIds','[]'::jsonb)
    )
  )
WHERE slug = 'institucional';
