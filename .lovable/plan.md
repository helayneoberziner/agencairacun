## Auditoria do que existe hoje

**Conteúdo / mídia**
- `projects` (Supabase): 1 `image_url`, 1 `video_url`, `subcategory`, `is_featured`, `gallery_urls` (não usado em formulário), `client_name`, `testimonial_*`. CMS em `AdminProjects.tsx` só edita 1 imagem + 1 vídeo.
- `cases` + `case_media` (estrutura nova, multi-mídia já existe). `case_media` aceita várias imagens e vídeos por seções (`audiovisual`, `marketing`, `galeria`, `bastidores`). CMS em `AdminCases.tsx` + `CaseMediaEditor.tsx`.
- `media_assets` / `media_folders` / bucket `media`: biblioteca pronta.
- `site_content` JSON: `client_logos` (`useClientLogos`), `testimonials` (`useTestimonials`) — nenhum tem campo `segments`.

**Portfólio nos segmentos** (`SegmentLandingPage.tsx`)
- Query `segment-portfolio` lê só `projects` (id, title, subcategory, image_url, video_url) e filtra por `subcategory` ou IDs manuais. Clicar abre 1 imagem/1 vídeo.
- Logos por segmento: NÃO existe (`ClientLogo` é só `id|name|image_url`).
- Depoimentos por segmento: já filtra por `c.testimonialIds?.includes(t.id)` no JSON do segment_pages — funciona, mas exige cadastrar lista manualmente.

**Cases / Produtora**
- `/cases` mostra todos `cases` ativos. `is_featured` no `cases` controla destaque.
- `/produtora` usa `PortfolioGrid` de `projects` (categoria Vídeo/Filme).
- Hoje `is_featured` em `projects` faz aparecer em /produtora (na verdade qualquer projeto Vídeo já aparece, e featured só vira badge). Comportamento confuso.

**Marquees** (`useInfiniteMarquee`)
- `onPointerEnter` pausa no hover. Precisa parar de pausar em hover, só pausar em pointer down/touch.

**CTA**
- `GlobalCTA.tsx` já existe e está usado em Cases. Falta em `/marketing`, `/produtora`, `/sobre`, segmentos (segmentos têm `SegmentLeadForm` — manter, mas pode substituir).

**Rotas / 404**
- Lovable hosting já tem fallback SPA automático. 404 em URLs diretas geralmente é configuração antiga. Conferir `index.html`, `BrowserRouter`, e qualquer `vite.config` com `base`.

**Equipe (Sobre)**
- Tabela `team_members` já existe. `AdminSobre` provavelmente não edita.

---

## Plano de implementação

### 1. Múltiplas mídias por projeto + unificação Projeto = Case

Reaproveitar a tabela `cases` + `case_media` como o "Projeto". A tabela `projects` (legada) continua existindo só para leitura nas páginas antigas; novos cadastros usam `cases`.

- **Estender `cases`**: adicionar colunas
  - `category` text (Vídeo / Fotografia / Marketing / Branding)
  - `subcategory` text
  - `appears_in` text[] (`['home_audio','home_mkt','produtora','cases','seg:imobiliario',...]`) — controla onde aparece
  - `cover_kind` text + `cover_media_id` uuid (referência opcional a um `case_media.id` que vira capa, ou usa `hero_*` existente)
- **`case_media`**: já suporta N itens. Mostrar UI no admin para múltiplas imagens + vídeos misturados, escolher capa.
- **AdminProjects**: aposentar UI de criação (manter listagem em modo "Projetos legados") e redirecionar "Novo projeto" para `/admin/cases`.
- **AdminCases (evoluir)**: adicionar
  - Galeria com upload múltiplo + add YouTube
  - Botão "Definir como capa" por item
  - Checkboxes "Aparecer em": Home Audiovisual / Home Marketing / Produtora / Cases / Segmento X / Y / Z
  - Toggle "Destacar em Cases" (já = `is_featured`)
  - Toggle "Destacar na Home produtora" (novo flag `home_featured`)

### 2. Comportamento de destaque

- Todo `case` ativo → automaticamente listado em `/produtora` (não depende de `is_featured`).
- `is_featured = true` → entra na seção destaque da Home produtora (não vai para `/produtora` exclusivamente).
- `show_on_home` continua para Home geral.
- Filtros das páginas usarão `appears_in` quando preenchido; fallback para `segments`/`category`.

### 3. Portfólio dos segmentos — galeria viva

Reescrever a seção "Portfólio" em `SegmentLandingPage.tsx`:
- Buscar `cases` cujo `segments` contém o slug **+** todos os `case_media` desses cases.
- Renderizar grade misturada (vídeos + imagens) tipo masonry/grid premium. Sem "abrir cliente". Clique abre lightbox de vídeo ou imagem inline.
- Manter fallback: se segmento ainda não tem cases, usar `projects` legados (comportamento atual).

### 4. Logos e depoimentos por segmento

- **Logos**: estender `ClientLogo` com `segments: string[]`. Editor em `AdminSettings` ganha checkbox de segmentos por logo. Nova seção "Clientes" em `SegmentLandingPage` (logos do segmento, marquee infinita).
- **Depoimentos**: estender `Testimonial` com `segments: string[]`. `SegmentLandingPage` filtra automaticamente (`t.segments.includes(slug)`), mantendo fallback para `testimonialIds` manuais existentes.
- CMS `AdminTestimonials` e logos: adicionar multi-select de segmentos.

### 5. Marquees: pausar só em click/drag, não em hover

Atualizar `useInfiniteMarquee.ts`: remover pausa em `onPointerEnter`/`Leave`. Manter pausa só durante `pointerdown` ativo (drag). Soltar = volta a rodar. Usado em logos home, depoimentos home e novos marquees de logos segmento.

### 6. CTA premium em todas as páginas

`GlobalCTA` já existe. Adicionar em:
- `/marketing` (final)
- `/produtora` (substituir CTA atual)
- `/sobre` (final)
- Segmentos: substituir `SegmentLeadForm` por `GlobalCTA` + texto personalizado vindo do JSON `content.finalCta`.
Texto customizado por página, lido do CMS quando disponível, com defaults sugeridos.

### 7. Página Sobre — equipe

Já existe `team_members`. Adicionar seção "Equipe" em `Sobre.tsx` (foto, nome, cargo, bio curta). Criar `AdminTeam.tsx` (ou subaba em `AdminSobre`) com CRUD: upload foto, nome, cargo, bio, ordem, ativo.

### 8. Bug 404 em URLs diretas

- Confirmar `BrowserRouter` ativo (já está).
- Conferir `vite.config.ts` (sem `base` customizado quebrando).
- Adicionar `<base href="/" />` no `index.html` se necessário.
- Garantir que `agenciaracun.com` (domínio custom) usa hosting Lovable (sem `_redirects`). Documentar para o usuário se precisar reconectar domínio.

### 9. Capa do projeto

No editor de mídia do case: cada item ganha botão estrela "Definir como capa". Salva em `cover_media_id`. `resolveVideoCover` continua como fallback. Capa também pode ser thumb do YouTube ou imagem da biblioteca via picker.

### 10. CMS geral

Tudo via painel:
- `/admin/cases` (unifica projetos)
- `/admin/projects` → modo legado/leitura (banner avisa para usar Cases)
- `/admin/testimonials` → ganha multi-select de segmentos
- `/admin/settings` (logos) → ganha multi-select de segmentos
- `/admin/sobre` → ganha aba equipe
- `/admin/segments` → mantém edição de página + agora puxa portfolio automático

---

## Mudanças técnicas (resumo)

**Migração SQL** (uma só):
- `cases`: + `category text`, `subcategory text`, `appears_in text[] default '{}'`, `home_featured bool default false`, `cover_media_id uuid`.

**Hooks / tipos**:
- `useClientLogos`: + `segments: string[]`
- `useTestimonials`: + `segments: string[]`
- `useCases`: novos filtros (`appears_in`, segment slug)
- novo `useTeam` para `team_members`

**Componentes novos**:
- `SegmentPortfolioGallery.tsx` (grade viva de mídia)
- `SegmentClientsStrip.tsx` (marquee logos do segmento)
- `TeamSection.tsx` + `AdminTeam.tsx`
- `CaseMediaPicker` capa toggle

**Componentes editados**:
- `useInfiniteMarquee` (pausa só drag)
- `SegmentLandingPage` (portfolio + logos)
- `AdminCases` + `CaseMediaEditor` (capa, appears_in, multi-mídia)
- `AdminProjects` (banner legado)
- `AdminTestimonials` (segmentos)
- `AdminSettings` (logos com segmentos)
- `AdminSobre` (equipe)
- `Marketing.tsx`, `Produtora.tsx`, `Sobre.tsx` (GlobalCTA final)

**Sem quebrar**: tabela `projects` mantida intacta; `cases` apenas ganha colunas opcionais; JSONs ganham campos opcionais com fallback.

---

## Perguntas antes de partir

1. **Migração projetos → cases**: posso deixar os projetos antigos como leitura (banner "Use Cases para novos cadastros") ou prefere que eu rode um script de migração automática copiando todos os `projects` existentes para `cases` + `case_media`?
2. **Domínio**: o site está rodando em `agenciaracun.com` hoje? Algum 404 específico que você consegue reproduzir agora (qual URL)? Isso ajuda a confirmar se é fallback SPA ou rota inexistente.
3. **CTA dos segmentos**: substituo o `SegmentLeadForm` atual pelo `GlobalCTA` premium (mesmo visual do Home) ou mantenho os dois (form curto + CTA grande final)?