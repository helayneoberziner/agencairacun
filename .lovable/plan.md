# Módulo "Galerias de Entrega" — plano de implementação

Módulo novo e isolado. Nenhuma rota, componente, estilo ou tabela existente será alterado. Só adiciono: novas rotas, novo item no menu admin, novas tabelas com prefixo `gallery_`, novo bucket de storage.

## Entrega em 3 fases

Priorizando o que você pediu ao final: primeiro versão simples funcional; depois venda; depois extras.

### Fase 1 — MVP funcional (acesso total liberado)
Meta: eu consigo criar galeria, subir fotos/vídeos em lote, gerar link, cliente abre pelo link (com senha opcional), visualiza em lightbox e baixa em alta.

Inclui:
- Menu admin novo "Galerias" (sem mexer nos outros itens).
- CRUD de galeria: nome, cliente, data do evento, capa, fonte/cor do título, layout (grade / mosaico / carrossel), senha opcional, data de expiração, tipo de acesso = "livre".
- Upload em lote com barra de progresso e deduplicação por hash (reaproveita `mediaLibrary.ts`).
- Bucket privado `gallery-originals` para o arquivo em alta; bucket público `gallery-preview` para a versão de exibição (imagem redimensionada no cliente antes do upload; vídeo mantém o mesmo arquivo por enquanto — sem transcodificação server-side no MVP).
- Marca d'água opcional (canvas no cliente ao gerar preview).
- Rota pública `/galeria/:slug` com senha opcional, lightbox, download individual e "baixar tudo (zip)".
- Limite de downloads e expiração aplicados por edge function que assina URL do arquivo original (signed URL curta).
- E-mail para o cliente ao publicar (via Resend, já configurado no projeto).

### Fase 2 — Venda avulsa com desconto progressivo
- Tipo de acesso "venda avulsa" com faixas de preço configuráveis (ex.: 1–5 → R$X, 6–10 → R$Y, 11+ → R$Z).
- Carrinho no cliente, cálculo em tempo real do valor com desconto.
- Checkout via **Mercado Pago** (Pix + cartão, mais simples no Brasil).
- Edge function de webhook confirma pagamento e libera downloads em alta apenas dos itens comprados.
- Notificação por e-mail para você quando houver compra ou seleção finalizada.
- Cupons de desconto (opcional, se sobrar espaço).

### Fase 3 — Extras
- Álbuns dentro da galeria (Cerimônia / Festa / Making of).
- Modo apresentação (slideshow fullscreen).
- Painel de estatísticas por galeria: visitas, favoritos, vendas.
- Estrutura preparada para upsell de produtos físicos (tabela pronta, UI depois).

## Detalhes técnicos

### Banco (novas tabelas, todas com RLS + GRANT)
- `gallery_galleries` — slug, client_name, client_email, event_date, cover_url, title_font, title_color, layout, access_type ('free'|'paid'), password_hash, expires_at, download_limit, watermark_enabled, status, price_tiers jsonb, created_by.
- `gallery_albums` — gallery_id, name, display_order.
- `gallery_items` — gallery_id, album_id, kind ('image'|'video'), original_path (bucket privado), preview_url (bucket público), width, height, size, hash, display_order.
- `gallery_orders` — gallery_id, client_email, status, subtotal, discount, total, mp_payment_id, paid_at.
- `gallery_order_items` — order_id, item_id, unit_price.
- `gallery_downloads` — item_id, order_id (nullable no modo livre), ip, downloaded_at (para limite/estatística).
- `gallery_visits` — gallery_id, visited_at, ip (estatísticas).

Políticas: admin gerencia tudo; público faz `SELECT` em galleries/items/albums só quando `status='active'` e não expirada; downloads e ordens acessados via edge function com service role.

### Storage
- Bucket privado `gallery-originals` — arquivos em alta. Download só por signed URL emitida por edge function que valida acesso (senha/pagamento/expiração).
- Bucket público `gallery-preview` — versões comprimidas com marca d'água opcional.

### Edge functions
- `gallery-access` — valida senha, gera cookie/token curto.
- `gallery-download` — recebe token + item_id, valida direito, retorna signed URL de 5 min.
- `gallery-zip` — gera zip on-the-fly (só no modo livre).
- `gallery-mp-webhook` — recebe webhook do Mercado Pago, libera pedido.
- `gallery-publish-email` — envia link ao cliente via Resend.

### Rotas front-end novas
- Admin: `/admin/galleries`, `/admin/galleries/new`, `/admin/galleries/:id`.
- Público: `/galeria/:slug` (com etapa de senha se houver), `/galeria/:slug/checkout`, `/galeria/:slug/pago`.

### Isolamento
- Todos os arquivos novos ficam em `src/pages/admin/galleries/`, `src/pages/galleries/`, `src/components/galleries/`, `src/hooks/galleries/`, `supabase/functions/gallery-*`.
- Item de menu adicionado no `AdminLayout` sem remover nenhum item existente.
- Nenhuma tabela ou rota existente é tocada.

## Ponto de atenção — custo de storage
Vídeos em alta resolução consomem muito espaço no Supabase Storage. Para fotos e vídeos curtos o Supabase resolve bem no início. Se o volume de vídeo passar de ~50–100 GB por mês, recomendo migrar `gallery-originals` para **Cloudflare R2** (egress zero) ou **Bunny.net Storage** (barato + CDN). O código já vai abstrair o caminho do arquivo para essa migração ser fácil no futuro.

## Segredos necessários
- Fase 2: `MERCADO_PAGO_ACCESS_TOKEN` (você cria no painel do Mercado Pago) e `MERCADO_PAGO_WEBHOOK_SECRET`.
- Resend já está no projeto.

## Ordem de execução após aprovação
1. Migration com tabelas + buckets + policies (Fase 1).
2. Item de menu + páginas admin de listagem e criação.
3. Upload em lote + geração de preview + marca d'água.
4. Página pública `/galeria/:slug` + lightbox + senha + download em alta via edge function.
5. Zip + limite de downloads + e-mail de publicação.
6. Ao terminar Fase 1, você testa, e só então começo a Fase 2 (venda + Mercado Pago).

Posso começar pela Fase 1?
