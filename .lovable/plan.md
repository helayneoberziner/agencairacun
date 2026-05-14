## Objetivo

Transformar cada item de "Segmentos que atendemos" em uma landing page premium dedicada (`/imobiliario`, `/empresas`, `/restaurantes`, `/eventos`, `/marcas`, `/politica`), totalmente gerenciável pelo admin e mantendo a identidade visual atual (dark premium, #FF00CC, DM Serif + Inter, glass-card, gradientes existentes).

---

## 1. Banco de Dados (1 migration)

Criar tabela `segment_pages` no Supabase para conteúdo dinâmico por segmento:

- `slug` (text, unique) — ex: `imobiliario`
- `name`, `is_active`, `display_order`
- `seo_title`, `seo_description`, `og_image_url`
- `content` (jsonb) — estrutura única com todos os blocos da landing:
  - `hero` { title, highlight, subtitle, ctaText, mediaType (image|video), mediaUrl }
  - `intro` { title, description }
  - `marketing` { title, subtitle, items: [{icon, title, description}] }
  - `audiovisual` { title, subtitle, items: [{icon, title, description}] }
  - `portfolio` { title, projectIds: [] } — referencia projetos da tabela `projects`
  - `gallery` { title, images: [url] }
  - `videoFeatured` { title, youtubeId }
  - `testimonialIds` []
  - `faq` { title, items: [{question, answer}] }
  - `finalCta` { title, subtitle, buttonText, whatsappMessage }

RLS: leitura pública, escrita só admin. Seed com os 6 segmentos já existentes e textos personalizados por nicho.

---

## 2. Frontend Público

**Componente compartilhado**: `src/components/segment/SegmentLandingPage.tsx` — recebe slug, busca conteúdo, renderiza:
- `<SegmentHero>` cinematográfico (mídia em destaque + CTA)
- `<SegmentIntro>` (texto + estatísticas)
- `<SegmentServices>` em duas colunas (Marketing | Audiovisual) com ícones lucide e glass-card existente
- `<SegmentPortfolio>` reutilizando `PortfolioGrid` filtrado por subcategoria
- `<SegmentGallery>` grid com hover grayscale→cor (padrão da marca)
- `<SegmentVideo>` (YouTube embed)
- `<SegmentTestimonials>` 
- `<SegmentFAQ>` accordion já existente
- `<SegmentFinalCTA>` + WhatsApp
- Header/Footer/CookieBanner

**Roteamento**: rota dinâmica `/:segmentSlug` validada por whitelist OU rotas explícitas em `App.tsx`. Usaremos rotas explícitas para previsibilidade.

**SEO**: instalar `react-helmet-async`, providar no `main.tsx`, e cada página seta title/description/canonical/OG dinamicamente.

**MarketsSection** (home + /produtora): cards inteiros viram `<Link>` clicáveis, com botão "Saiba mais" abaixo da descrição. Mapeamento `segmentTitle → slug`.

---

## 3. Admin

Nova página `/admin/segments` (`AdminSegments.tsx`):
- Lista os 6 segmentos (cards com toggle ativo/ordem)
- Editor por segmento com tabs: **Hero | Intro | Serviços | Portfólio | Galeria | Vídeo | FAQ | CTA Final | SEO**
- Reutiliza `ImageUpload`, ContentEditorFields, e seletor de projetos por subcategoria.
- Adicionar entrada no `AdminLayout` no grupo "Conteúdo".

---

## 4. Textos iniciais (seed)

Cada segmento já vem com copy personalizado (Imobiliário/Empresas/Restaurantes/Eventos/Marcas/Política) seguindo as diretrizes do briefing (sem hífens, sem números falsos, sem nomes de clientes inventados).

---

## 5. Performance & Responsivo

- `loading="lazy"` em todas imagens
- Embeds YouTube via iframe lite (clique-para-carregar)
- Mobile: hero reduzido, grids 1 col, padding reduzido
- Animações via classes existentes (`animate-fade-in`, hover scale 1.03)

---

## Detalhes técnicos

**Rotas adicionadas em App.tsx:**
```
/imobiliario  /empresas  /restaurantes  /eventos  /marcas  /politica
```
Todas renderizam `<SegmentLandingPage slug="..."/>`.

**Hooks novos:** `useSegmentContent(slug)`, `useSegments()` (lista no admin).

**Sem mudar:** identidade visual, tokens HSL, fontes, paleta. Tudo reaproveita `glass-card`, `text-gradient-neon`, `neon-glow`, `section-padding`, `container-custom`.

**Não impacta:** páginas existentes continuam funcionando; `MarketsSection` apenas ganha links e botão "Saiba mais".
