# Atualização Premium - Agência Racun

Plano dividido em 7 frentes. Vou executar tudo em sequência, mantendo rotas, banco e identidade visual.

## 1. Páginas individuais de Cases (`/cases/:slug`)

- Adicionar coluna `slug` na tabela `projects` (migration segura, geração automática a partir do título nos existentes).
- Adicionar campos opcionais usados na página: `client_name`, `testimonial_text`, `testimonial_author`, `gallery_urls` (array de imagens), `seo_description`.
- Criar `src/pages/CaseDetail.tsx` com layout cinematográfico:
  - Hero grande com imagem/vídeo de capa, título display em DM Serif, categoria como tag.
  - Blocos: Contexto, O que foi feito, Resultados (com números destacados), Entregas (lista refinada), Galeria em grid editorial, Vídeo embed (YouTube), Depoimento, CTA final.
  - Animações suaves (fade/slide on scroll), tipografia respirada, muito espaço em branco.
  - SEO via `<title>` e `<meta>` dinâmicos (helmet leve via document head manipulation).
- Atualizar `App.tsx`: rota `/cases/:slug` → `CaseDetail`.
- Atualizar `Cases.tsx` e `CasesPreview.tsx`: cards e botões "Ver Case" navegam para `/cases/:slug`.
- Atualizar `AdminProjects.tsx`: editor inclui novos campos + galeria múltipla + slug auto-gerado editável.

## 2. Equipe na página Sobre

- Nova tabela `team_members` com: `name`, `role`, `bio`, `photo_url`, `social_links` (jsonb), `display_order`, `is_active`.
- RLS: leitura pública, escrita admin.
- Hook `useTeamMembers`.
- Seção "Equipe" em `Sobre.tsx`: grid responsivo de cards premium, foto em grayscale → cor no hover (regra do projeto), nome serif, cargo italic primary, ícones sociais.
- Nova página admin `AdminTeam.tsx` com CRUD completo (criar, editar, remover, reordenar, upload de foto via storage).
- Adicionar rota `/admin/team` e item no menu lateral (grupo Conteúdo).

## 3. Refinar visual (remover "cara de IA")

Foco em ajustes de presentation:
- Espaçamentos verticais mais generosos em seções (`section-padding` revisado).
- Tipografia: títulos display maiores e respirados, line-height refinado.
- Reduzir uso excessivo de glow/borders nos componentes home (`HeroSection`, `ServicesSection`, `CasesPreview`, `MarketsSection`).
- Hover states mais discretos (translate sutil + escala 1.02 em vez de glow forte).
- Transições suaves em links e botões.
- Melhor contraste e hierarquia: subtítulos eyebrow, separadores discretos, números grandes em resultados.
- Microinterações em revelar-on-scroll (intersection observer leve, sem libs novas).

## 4. Propostas: itens com autocomplete

- Nova tabela `proposal_suggestions` com: `category` ('marketing' | 'audiovisual' | 'completo'), `text`, `usage_count`. RLS pública leitura, admin escrita.
- Seed inicial com os exemplos do briefing (Gestão de tráfego, Social Media, Captação, Drone, Edição, etc.).
- Componente novo `TagAutocompleteInput.tsx`: input com dropdown de sugestões filtradas por categoria, Enter adiciona, item novo é salvo no banco automaticamente, item existente apenas adicionado.
- Substituir nos campos `marketing_includes`, `audiovisual_includes`, `complete_includes` em `AdminProposals.tsx`.

## 5. Telefone → WhatsApp em todo o site

- Buscar todas ocorrências de `tel:` e substituir por `https://wa.me/{whatsapp}`.
- Locais: `Footer.tsx`, `Header.tsx`, `Contato.tsx`, `Proposta.tsx`, qualquer card/CTA.
- Manter exibição visual do número de telefone (apenas o link muda).

## 6. Redes sociais dinâmicas

- Estender `site_settings` para incluir `socialLinks: Array<{ id, platform, url, isActive, order }>`.
- Migrar Instagram/YouTube existentes para o novo formato (preservando valores).
- Map de ícones automático: Instagram, YouTube, TikTok, LinkedIn, Facebook, Behance, Vimeo, X/Twitter, Pinterest, fallback `Link`.
- Detecção pela URL ou pelo `platform` selecionado.
- Em `AdminSettings.tsx`: editor com adicionar/remover/reordenar (drag handle simples com setas), select de plataforma, toggle ativo.
- `Footer.tsx` e qualquer outro lugar exibem apenas redes ativas, ordenadas.

## 7. Polish do admin

- Inputs com padding e foco mais refinados (variant via classe utilitária no `Input` quando aplicável).
- Espaçamento vertical maior em formulários longos.
- Loaders em botões de salvar (Loader2 spinner consistente).
- Toasts de sucesso/erro padronizados.
- Cards de listagem com hover discreto.
- Sem mudanças estruturais no layout já reorganizado.

## Detalhes técnicos

- Migrations separadas, idempotentes onde possível (`IF NOT EXISTS`).
- Geração de slug: função utilitária client + backfill SQL para projetos existentes.
- Storage: usar bucket `media` já existente para fotos da equipe e galerias.
- SEO dinâmico: hook `useDocumentMeta` simples manipulando `document.title` e meta tags (sem adicionar `react-helmet`).
- Sem novas dependências npm (autocomplete usa `Command` do shadcn já instalado; ícones do `lucide-react`).
- Mantém GitHub Pages compatível (sem SSR, tudo client-side).
- Compatível com tipos auto-gerados do Supabase após migrations.

## Ordem de execução

1. Migrations (projects+slug, team_members, proposal_suggestions, seed).
2. Backend hooks (useTeamMembers, useProposalSuggestions, useSiteSettings estendido).
3. CaseDetail + atualizações em Cases/CasesPreview/AdminProjects.
4. Sobre + AdminTeam + rota.
5. TagAutocompleteInput + AdminProposals.
6. Substituição tel: → WhatsApp.
7. Redes sociais dinâmicas (Settings + Footer).
8. Polish visual (Hero/Services/Cases preview/etc.).