
# Evolução premium: Cases vivos, vídeos híbridos, CTA global

Plano consolidado dos 10 grupos de melhorias (itens 17–26). Tudo mantendo identidade dark premium da Racun (cores, tipografia DM Serif Display + Inter, gradientes, grão).

## 1. Sistema híbrido de vídeos (YouTube + upload) — item 17, 22

- Criar utilitário `src/lib/videoUtils.ts`:
  - `parseYouTube(url)` reconhece: `youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`.
  - `getYouTubeThumb(id, quality)` → `https://img.youtube.com/vi/{id}/maxresdefault.jpg` com fallback hqdefault.
  - `getEmbedUrl(id)` com `rel=0&modestbranding=1`.
- Novo componente `src/components/media/VideoPlayer.tsx`:
  - Recebe URL. Se YouTube → renderiza thumb + play overlay; ao clicar carrega iframe (lazy, facade pattern para performance).
  - Se for arquivo (mp4/webm/mov) → `<video controls preload="metadata">` com poster.
- No admin, campo de vídeo passa a ser um `VideoInput` com 2 modos:
  - **YouTube** (preferencial): input de URL + preview da thumb + título manual.
  - **Upload/Biblioteca**: abre MediaPicker filtrando vídeos.
- Thumb automática: quando há vídeo YouTube e nenhuma `image_url`, o front e o card usam a thumb do YouTube automaticamente.

## 2. Biblioteca de Mídia híbrida — item 18

Evoluir `AdminMedia.tsx` e `MediaPicker.tsx`:
- Adicionar suporte a **vídeos YouTube** como assets (sem upload de arquivo).
- Coluna `kind` no `media_assets`: `image` | `video_file` | `video_youtube`.
- Novos campos: `youtube_id`, `youtube_title`.
- Badge no card: "YouTube" / "Arquivo" / imagem normal.
- Filtros existentes (Imagens/Vídeos) + filtro por pasta (já existe).
- Botão **"Adicionar vídeo do YouTube"** no header da biblioteca → modal com URL, busca thumb automaticamente.

## 3. Cases vivos por slug — item 19

Nova arquitetura: **um cliente = um case = uma página** que evolui com o tempo.

- Tabela `cases` (nova):
  - `slug` (único), `client_name`, `title`, `subtitle`, `hero_media` (url ou youtube), `hero_kind`, `challenge`, `strategy`, `solution`, `results_text`, `metrics` (jsonb), `testimonial_text`, `testimonial_author`, `categories` (text[]), `segments` (text[]), `is_featured`, `show_on_home`, `display_order`, `seo_*`.
- Tabela `case_media` (galeria evolutiva):
  - `case_id`, `kind` (image | video_youtube | video_file), `url`, `youtube_id`, `caption`, `section` (audiovisual | marketing | bastidores | results), `display_order`.
- Página `src/pages/CaseDetail.tsx` em rota `/cases/:slug` com seções:
  1. Hero cinematográfico (vídeo ou imagem grande)
  2. "O que fizemos" (desafio + estratégia)
  3. Audiovisual (grid das mídias com `section=audiovisual`)
  4. Marketing (mídias com `section=marketing` + texto)
  5. Resultados (métricas em cards)
  6. Galeria premium (lightbox misturando vídeos + imagens)
  7. Depoimento (se houver)
  8. CTA final global

- Admin `AdminCases.tsx` (substitui/expande `AdminProjects` ou convive):
  - Lista de cases por cliente.
  - Editor com abas: Informações · Audiovisual · Marketing · Resultados · Galeria · SEO.
  - Cada aba permite adicionar múltiplas mídias (YouTube + upload + biblioteca) com drag-and-drop para reordenar.

> Decisão: manter `projects` como tabela legada/portfólio simples e introduzir `cases` como nova entidade. Migração: cases existentes em `projects` com `category='case'` podem ser portados via script (faço uma migração suave). Confirmo no chat antes de remover.

## 4. Menu "Cases" + listagem + Home automática — item 20

- Header: renomear link "Trabalhos" → "Cases" (rota `/cases`).
- Página `/cases` (Cases.tsx existente refatorada): grid premium dos cases ativos, filtros por categoria/segmento, hover sofisticado, clique → `/cases/:slug`.
- Home `CasesPreview.tsx`: query automática `cases.show_on_home=true` ordenados por `display_order`.
- Admin: checkbox **"Exibir na Home"** em cada case.

## 5. Galeria múltipla com drag-and-drop — item 21

- Componente `MediaGalleryEditor` usando `@dnd-kit/sortable` (já é padrão em React/Tailwind).
- Aceita imagens + vídeos misturados, reordenação visual, remoção, edição de caption.

## 6. Categorias dinâmicas — item 23

- Tabela `categories` (`id`, `name`, `slug`, `display_order`, `kind` = "case"|"project").
- Seed inicial: Foto, Vídeo, **Foto + Vídeo**.
- Tela `AdminCategories` (CRUD + reordenação drag-and-drop).
- Selects no editor de case/projeto puxam dessa tabela.

## 7. CTA global em todas as páginas — item 24

- Componente `src/components/cta/GlobalCTA.tsx`:
  - Props: `title`, `subtitle`, `context` (passado como `segment` no lead).
  - Formulário completo (Nome, Empresa, WhatsApp, E-mail, Serviço, Mensagem) + botão WhatsApp.
  - Reuso do `useContactForm` (já validado com zod).
- Incluído em: Home, Cases (lista), CaseDetail, Segmentos, Sobre, Marketing, Produtora, Restaurantes.

## 8. Contato com mapa ao lado — item 25

Refatorar `ContactSection.tsx` (e/ou `Contato.tsx`):
- Layout 2 colunas em desktop:
  - **Esquerda**: título "Vamos conversar sobre o seu projeto?", texto curto, botão WhatsApp grande, **abaixo do botão**: `LocationMap` premium com bordas suaves + botão "Abrir no Google Maps".
  - **Direita**: formulário premium dark.
- Mobile: empilhar (texto → WhatsApp → mapa → formulário).
- Remover o mapa solto que aparece atualmente abaixo do formulário em `Index.tsx`.

## 9. Performance + SEO — item 26

- YouTube facade (carregar iframe só no clique) — ganho enorme de LCP.
- `loading="lazy"` em imagens; `preload="metadata"` em vídeos.
- Thumbs YouTube via `i.ytimg.com` (cacheado pelo Google).
- `<link rel="preconnect" href="https://www.youtube.com">` no `index.html`.
- Meta tags (title/description/og) por case via React Helmet (já em uso? caso não, adiciono `react-helmet-async`).
- Sitemap dinâmico de cases (`/cases/*`) em arquivo estático gerado on build (opcional).

## Detalhes técnicos (apêndice)

### Migrações necessárias (em uma única chamada da migration tool)
- `media_assets`: add `kind`, `youtube_id`, `youtube_title` (nullable).
- `cases` + `case_media` + RLS + GRANTs + triggers `updated_at`.
- `categories` + RLS + GRANTs + seed.
- Trigger updated_at já existe (`update_updated_at_column`).

### Dependências novas
- `@dnd-kit/core` + `@dnd-kit/sortable` (drag-and-drop).
- `react-helmet-async` (se ainda não estiver) para SEO por case.

### Estimativa de arquivos
- Novos: ~12 (player, picker upgrade, cases pages, admin cases, categorias, CTA global, video utils, gallery editor).
- Editados: ~10 (Header, Index, ContactSection, MarketsSection, SegmentLandingPage, AdminMedia, MediaPicker, ImageUpload, App.tsx, types).

### Ordem de execução
1. Migrações DB (cases, case_media, categories, media_assets cols).
2. videoUtils + VideoPlayer + MediaPicker/AdminMedia híbridos.
3. GlobalCTA + ContactSection novo layout.
4. Cases: listagem `/cases` + página `/cases/:slug` + admin.
5. Header rename + Home `CasesPreview` automático.
6. Categorias dinâmicas.
7. Polimento de performance + SEO meta.

## Observações / confirmações antes de implementar

1. **Cases vs Projects**: posso manter `projects` para portfólio audiovisual segmentado (já usado nas páginas de segmento) e criar `cases` como entidade nova focada em clientes. OK?
2. **Migração de dados**: cases existentes hoje estão em `projects` com `category='Cases'`? Se sim, faço script de migração para `cases` preservando histórico. Confirme.
3. **Mapa**: usar embed simples do Google Maps (gratuito, sem API key) ou o componente `LocationMap` já existente? Posso seguir com o atual estilizado.
4. **Páginas a receber o GlobalCTA**: confirma a lista (Home, Cases, CaseDetail, Segmentos, Sobre, Marketing, Produtora, Restaurantes)?

Respondendo essas 4, sigo direto pelas migrações e implementação na ordem acima.
