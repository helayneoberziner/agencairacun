# Reestruturação Premium do Home da Racun

Reorganização completa do Home priorizando audiovisual como protagonista, mantendo 100% a identidade visual atual (dark premium, glow magenta/roxo, DM Serif + Inter, italic em #FF00CC).

## Nova ordem de seções

```
1. Hero (cinematográfico + partículas leves + showreel lazy)
2. Clientes que confiam (marquee infinito)            ← NOVO no topo
3. Audiovisual em destaque (protagonista)             ← SUBIDO
4. Marketing de performance (com métricas/visual)     ← DEPOIS
5. Cases / Projetos (slider premium)
6. Segmentos que atendemos (com botão "Saiba mais")
7. Prova social (depoimentos + logos marquee)         ← JÁ FEITO
8. Processo da Racun
9. Contato (form + mapa lateral)                      ← JÁ FEITO
```

## O que muda em cada seção

**1. HeroSection**
- Mantém estrutura/copy, evolui visualmente
- Adiciona `ParticlesBackground` já existente, modo discreto
- Slot opcional `hero.showreelYoutubeId` (CMS) → `VideoPlayer` facade lazy
- CTAs mais sólidos ("Solicitar proposta" / "Ver nossos cases")

**2. ClientsStrip (novo componente)**
- Faixa de logos com marquee infinito (reaproveita lógica de `useInfiniteMarquee` da `SocialProofSection`)
- Hover/touch pausa, grayscale → cor
- Usa `useClientLogos` + fallback com nomes (Prisma, Assadão, Scottini, Kaj Club, Calafate, Braseiro, Parceiros Internet)
- Extrai hook reutilizável para `src/hooks/useInfiniteMarquee.ts`

**3. AudiovisualShowcase (novo, substitui posição atual do ProdutoraTeaser)**
- Título "Histórias com estética de cinema"
- Grid cinematográfico: 1 vídeo grande + cards menores (institucional, reels, drone, fotos, gastronomia, eventos, política)
- Cards usam `VideoPlayer` facade (lazy YouTube)
- Hover: zoom 1.03 + glow magenta
- Botão "Ver produções" → /produtora
- Todo conteúdo (título, subtítulo, tags, lista de mídias com YouTube ID/imagem/categoria/CTA) editável via CMS em `home_content.audiovisual`

**4. ServicesSection (Marketing)**
- Continua, mas reposicionado depois do audiovisual
- Reescreve o cabeçalho para puxar "Marketing de performance"
- Pequenos chips de métricas/resultados acima dos cards (editáveis via CMS, sem números fake — placeholders genéricos tipo "ROAS acompanhado", "Otimização semanal")

**5. CasesPreview**
- Mantém componente, ajusta layout: cards maiores, mais respiro, hover cinematográfico
- Reusa o mesmo Card que já busca `cases` ativos

**6. MarketsSection (Segmentos)**
- Adiciona botão "Saiba mais" em cada card linkando para /segmentos/:slug

**7. SocialProofSection** — já feita, mantém

**8. ProcessSection** — refino visual sutil (numeração com glow, linha conectora premium, sem mudar copy)

**9. ContactSection** — já feita com mapa lateral

## Bug de scroll
Criar `src/components/ScrollToTop.tsx` que escuta `useLocation` e faz `window.scrollTo(0, 0)` em cada mudança de rota. Montar dentro do `BrowserRouter` no `App.tsx`.

## CMS (sem quebrar nada)
Estender `useHomeContent.ts` com novos campos opcionais (mantendo defaults):
- `hero.showreelYoutubeId`
- `audiovisual`: { badge, title, titleHighlight, subtitle, featuredYoutubeId, items: [{ title, category, youtubeId?, imageUrl?, link? }], cta, ctaLink }
- `services.metrics`: string[] (chips acima dos cards)

Adicionar no `AdminHome.tsx` blocos de edição correspondentes seguindo o mesmo padrão dos existentes (ContentEditorFields).

## Mobile premium
- Tipografia responsiva (`text-3xl md:text-5xl`)
- Marquees com largura de cards menores em < 640px
- Particles desativadas em mobile (perf)
- Padding consistente (`section-padding`)
- Auditoria: Hero, ClientsStrip, Audiovisual, Services, Cases, Markets, SocialProof, Process, Contact

## Arquivos

**Novos**
- `src/components/ScrollToTop.tsx`
- `src/hooks/useInfiniteMarquee.ts` (extraído da SocialProofSection)
- `src/components/home/ClientsStrip.tsx`
- `src/components/home/AudiovisualShowcase.tsx`

**Modificados**
- `src/App.tsx` (montar ScrollToTop)
- `src/pages/Index.tsx` (nova ordem)
- `src/components/home/HeroSection.tsx` (particles + showreel slot + CTA)
- `src/components/home/SocialProofSection.tsx` (usa hook extraído)
- `src/components/home/ServicesSection.tsx` (header reescrito + chips)
- `src/components/home/MarketsSection.tsx` (botão "Saiba mais")
- `src/components/home/ProcessSection.tsx` (refino visual)
- `src/components/home/CasesPreview.tsx` (respiro/cards maiores)
- `src/hooks/useHomeContent.ts` (novos campos + defaults)
- `src/pages/admin/AdminHome.tsx` (editores novos)

**Removido do fluxo do Home** (mas arquivo preservado):
- `ProdutoraTeaser` (substituído por AudiovisualShowcase, fica disponível caso queira reusar em outra página)

## Sem migration
Nenhuma alteração de schema. Tudo persistido em `site_content.home_content` (JSON) que já existe e é editável.

## Confirmar antes de implementar
1. **Showreel do hero**: posso deixar o campo do YouTube ID vazio por padrão (você cola depois no admin), ou tem um link agora?
2. **Audiovisual em destaque**: começo com placeholders (você popula depois pelo admin) ou quer que eu já preencha com itens existentes na tabela `cases` que tenham mídia audiovisual?
3. **ProdutoraTeaser atual**: posso aposentar do Home (mantendo o arquivo) já que o novo `AudiovisualShowcase` cumpre o papel com mais força?