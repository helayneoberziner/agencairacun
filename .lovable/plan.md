# Refinamento Visual Premium — Agência Racun

## Objetivo
Transformar o site em experiência cinematográfica de agência high ticket. Eliminar aparência de template/WordPress/blog. Foco principal: páginas de Cases e Home.

## Princípios de Design
- **Tipografia editorial**: DM Serif Display (já em uso nas memórias) para títulos grandes, Inter light para corpo. Escala maior e mais arejada.
- **Espaçamento generoso**: section-padding aumentado (py-32 desktop, py-20 mobile). Margens internas amplas.
- **Minimalismo cromático**: reduzir glow/neon excessivo. Manter primary #FF00CC apenas como acento pontual (italic em palavras chave, micro-detalhes). BG #040d28 dominante.
- **Sem cards quadrados padrão**: bordas sutis (1px white/5), sem glassmorphism pesado, sem múltiplas sombras coloridas.
- **Motion discreto**: fade/slide on scroll via IntersectionObserver, parallax leve no hero (translateY com scroll), hover scale 1.02 com transition 700ms.

## 1. CaseDetail (`/cases/:slug`) — Reformulação cinematográfica

```text
┌─────────────────────────────────────────┐
│  HERO FULLSCREEN                         │
│  imagem/vídeo 100vh                      │
│  título serif gigante sobreposto         │
│  cliente + categoria em caps tracking    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  META BAR sticky                         │
│  cliente · categoria · ano · serviços    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  DESAFIO (texto editorial 2 colunas)    │
│  título lateral + parágrafo respirado    │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  GALERIA fullbleed alternada             │
│  imagem 100vw → grid 2col → imagem solo │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  TESTIMONIAL grande, serif italic        │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  PRÓXIMO CASE (full hover)               │
└─────────────────────────────────────────┘
```

- Remover qualquer aparência de "artigo": sem caixas, sem sidebar, sem listas com bullets padrão.
- Hero: imagem cobrindo viewport com overlay gradiente sutil bottom→top, título em DM Serif 6xl-8xl posicionado bottom-left.
- Galeria: layout assimétrico (alternando full-width / 2-col / full-width). Imagens com lazy loading e aspect ratios variados.
- Navegação "próximo case" como bloco visual fullwidth com hover grayscale-to-color.

## 2. Home — Reformulação por seção

### Header
- Transparente no topo, ao scroll > 50px → background `#040d28/80` com backdrop-blur e border-bottom sutil.
- Logo menor, links com underline animado (story-link).
- CTA "Área do Cliente" mais discreto (ghost). WhatsApp como ícone circular minimal.

### HeroSection
- Reduzir orbs/glow (remover ou deixar muito sutil opacity 5%).
- Tipografia: headline em DM Serif 7xl, subtitle Inter font-light.
- Pillars: remover cards "glass-card-hover" — substituir por linhas horizontais com número 01/02/03 + título serif + descrição. Sem ícones coloridos chamativos.
- Adicionar parallax leve no background image.

### ServicesSection
- Redesign: lista vertical editorial em vez de grid de cards. Cada serviço = bloco fullwidth com número grande, título serif, descrição, imagem lateral (alternando left/right).
- Hover: imagem ganha cor (grayscale→color), título move-se sutilmente.

### CasesPreview / PortfolioGrid
- Grid maior (1-2 colunas em vez de 2-3). Thumbs cinematográficas aspect-[4/3] ou [16/9].
- Hover: zoom 1.03 + reveal de overlay com título serif e CTA "Ver projeto".
- Remover badge "btn-primary" no centro do hover (genérico). Usar tipografia.

### SocialProofSection (Depoimentos)
- Card único centralizado em destaque (rotativo ou um grande). Aspas serif gigantes decorativas. Sem glass-card.

### MarketsSection / ProcessSection
- Aumentar padding, simplificar visualmente.

### Footer
- Layout mais arejado, 4 colunas com tipografia menor e tracking maior.
- Logo + tagline serif. Redes sociais como ícones outline minimal sem fundo.
- Reduzir altura geral, remover elementos decorativos.

## 3. Design System (index.css)

Novos utilitários:
- `.text-display` — DM Serif Display, leading tight
- `.text-eyebrow` — uppercase, tracking widest, text-xs, primary
- `.section-divider` — linha 1px white/10 com fade nas pontas
- `.editorial-grid` — 12 col grid com gap generoso
- Reduzir `glass-card`: background mais sutil (white/2), border mais discreta (white/5), sem shadow colorida.
- Atualizar `btn-primary` para versão mais minimal: sem glow no hover, apenas translateY sutil.
- Adicionar `.hover-grayscale` (grayscale → color em 700ms).
- IntersectionObserver hook `useReveal` aplicando `animate-fade-in` quando entra no viewport.

## 4. Tipografia
- Importar DM Serif Display + Inter (300, 400, 500) no index.css.
- Tailwind config: `font-display: ['DM Serif Display']`, `font-sans: ['Inter']`.
- Substituir `font-display font-bold` por `font-display` puro (serif não precisa bold).

## 5. Mobile
- Spacings reduzidos mas ainda generosos (py-20).
- Hero CaseDetail: 70vh com título 4xl.
- Header mobile: drawer fullscreen com tipografia grande serif.
- Garantir hit targets ≥ 44px.

## 6. Performance
- `loading="lazy"` em todas imagens não-hero.
- Reduzir backdrop-blur (caro). Substituir por background sólido com alpha.
- Animações via CSS transform/opacity apenas.
- Evitar re-renders no scroll (passive listeners).

## Arquivos a modificar
- `src/index.css` — tokens, novos utilitários, redução de efeitos
- `src/pages/CaseDetail.tsx` — reescrita completa cinematográfica
- `src/components/Header.tsx` — scroll effect, refinamento
- `src/components/Footer.tsx` — redesign minimal
- `src/components/home/HeroSection.tsx` — pillars editoriais, menos glow
- `src/components/home/ServicesSection.tsx` — layout editorial alternado
- `src/components/home/CasesPreview.tsx` — grid cinematográfico
- `src/components/home/SocialProofSection.tsx` — depoimento destaque
- `src/components/PortfolioGrid.tsx` — refinamento hover
- `src/hooks/useReveal.ts` — novo, IntersectionObserver
- `tailwind.config.ts` — fontes display/sans

## Não-mudanças
- Banco de dados intocado.
- Rotas preservadas.
- Funcionalidades admin preservadas.
- Conteúdo dinâmico preservado.

## Ordem de execução
1. Design system (index.css + tailwind + useReveal)
2. CaseDetail cinematográfico
3. Header + Footer
4. Hero + Services + CasesPreview + SocialProof
5. PortfolioGrid refinements
6. QA mobile/desktop visual
