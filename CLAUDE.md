# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (localhost:3000)
npm run build    # production build
npm run lint     # ESLint
npm run start    # serve production build
```

No test suite is configured.

## Architecture

Next.js 14 App Router project (TypeScript + Tailwind CSS) for **Amaranta Florería**, a Mexican flower shop. Prices are in MXN.

### Routes

| Path | Purpose |
|---|---|
| `/` | Landing page — logo, links to social and info pages |
| `/informacion-bancaria` | Bank transfer details (OXXO & BBVA), Swiper carousel |
| `/cuidados-de-ramos` | Bouquet care instructions |
| `/cuidados-de-cajas` | Box arrangement care instructions |
| `/catalogo/flores-amarillas/2026` | Yellow flowers catalog grid |
| `/catalogo/flores-amarillas/2026/[productId]` | Product detail |
| `/catalogo/dia-de-las-madres/2026` | Mother's Day catalog grid |
| `/catalogo/dia-de-las-madres/2026/[productId]` | Product detail |

### Data layer

Products are defined as static TypeScript arrays — no database or API calls:

- `src/data/catalog.ts` — flores amarillas catalog, exports `catalog`
- `src/data/catalog-mothers-day.ts` — día de las madres catalog, also exports `catalog` (same name, different file)
- `src/types/product.ts` — `Product` interface (`id`, `name`, `price`, `description`, `longDescription`, `imageUrl`)

Product images are hosted on **Vercel Blob Storage** (`cns8nmi1edqdsaeg.public.blob.vercel-storage.com`). When adding new products, upload the image to Vercel Blob and use the resulting URL.

### Component locations

- `src/app/components/` — current shared components: `Header`, `HeaderImage`, `ProductCard`, `ProductGrid`
- `src/components/Carousel.tsx` — older custom carousel (used in informacion-bancaria; Swiper is used elsewhere)

### Adding a new seasonal catalog

Follow the existing pattern:
1. Create `src/data/catalog-<season>.ts` exporting a `catalog` array of `Product[]`
2. Add routes `src/app/catalogo/<slug>/<year>/page.tsx` and `[productId]/page.tsx` mirroring the flores-amarillas pages
3. Update the landing page `/` if you want to surface a link

### Fonts

- **Inter** (Google Fonts) — loaded in `layout.tsx`, used globally
- **Avenir Next** (local) — loaded per-page via `localFont({ src: '../../public/fonts/avenir_next.ttf' })` on pages that need it (landing page, informacion-bancaria)
