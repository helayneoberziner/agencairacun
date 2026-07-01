# Plano de Implementação

Mudanças amplas em navegação, admin e mobile. Vou dividir em blocos.

## 1. Navegação e páginas
- Unificar **Sobre + Contato** em uma única página `/sobre` (com seção de contato ao final). Remover rota `/contato` (redirecionar para `/sobre#contato`).
- Remover submenu **Serviços** do Header. Colocar `Marketing` e `Produtora` como itens diretos, lado a lado no menu desktop.
- Centralizar sempre a seção **Equipe** (`TeamSection`) — hoje alinha à esquerda quando poucos membros.

## 2. Admin — Segmentos dinâmicos
- Hoje `SEGMENTS` é hardcoded em `src/lib/segments.ts` e páginas são rotas fixas.
- Adicionar em `AdminSegments`: criar novo segmento (slug, nome) e excluir. Refletir no site público via rota dinâmica `/:segmentSlug` que consulta `segment_pages`.
- Manter as 6 atuais funcionando; novas passam a ser servidas pela rota dinâmica.
- Menu público de segmentos passa a ler de `segment_pages` (ativos).

## 3. Admin — "Editor de Site" unificado
- Criar página `/admin/editor` com layout de duas colunas: à esquerda abas (Home, Marketing, Produtora, Sobre, Restaurantes, Segmentos, Cases, Configurações, etc.), à direita `iframe` de preview do site na rota correspondente com refresh automático.
- Sidebar do admin: substituir os múltiplos itens de "editar X" por um único **Editor de Site**. Manter apart: Cases, Projetos, Depoimentos, Equipe, Mensagens, Mídia, LGPD, Configurações.

## 4. Cases — botão salvar fixo + auto-rascunho
- No editor de case (`AdminCases`), tornar botão **Salvar** fixo no topo direito (`sticky top-4 right-4 z-50`), sempre visível ao rolar.
- Ao desmontar/sair da edição sem salvar, gravar automaticamente o estado atual como **rascunho** (`is_active=false` ou campo `is_draft`). Usar `beforeunload` + cleanup do effect.

## 5. Adicionar todos os projetos aos Cases
- Script one-shot: para cada linha em `projects` sem case correspondente, criar um `case` com dados básicos (slug, título, cliente, hero_youtube_id). Rodar como migration SQL.

## 6. Home
- Aumentar logo no header desktop (h-10 → h-14/h-16).
- Mobile: ajustar padding do container para não cortar (`px-4` mínimo) e reduzir logo se necessário.

## 7. Mobile — app-like
- Substituir menu hambúrguer por **bottom navigation bar** fixa estilo Instagram, com ícones: Home, Cases, Serviços (abre sheet com Marketing/Produtora/Segmentos), Sobre, WhatsApp.
- Remover botão flutuante de WhatsApp no mobile (fica na bottom bar).
- Reduzir padding/tamanho dos cards de serviços/segmentos no mobile (imagem anexa mostra cards ocupando altura excessiva): menor padding, ícone menor, layout mais denso — sensação de feed.
- Padding-bottom global no mobile para não sobrepor conteúdo com a bottom bar.
- **Nenhuma alteração no layout desktop.**

## Notas técnicas
- Rota dinâmica de segmentos: novo `<Route path="/s/:slug" element={<SegmentDynamic/>}>` para novos; manter rotas legadas.
- Auto-draft: usar `useRef` do form + `useEffect` cleanup chamando upsert com `is_active=false` se `isDirty`.
- Bottom nav: novo componente `MobileBottomNav.tsx`, renderizado em `App.tsx` fora do admin, escondido em `lg:hidden`.
- WhatsAppButton: retornar `null` também em mobile (`useIsMobile`).
- Preview no editor admin: `iframe src={previewUrl}` + botão "Recarregar preview" após salvar.
