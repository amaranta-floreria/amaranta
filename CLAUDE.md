# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint via next lint
```

There are no tests.

## Environment variables

Required in `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_ADMIN_EMAILS    # comma-separated list of authorized admin emails (case-insensitive)
BLOB_READ_WRITE_TOKEN       # Vercel Blob token for image uploads
```

## Architecture

**Next.js 14 App Router** — all routes live under `src/app/`. Font (`avenir_next.ttf`) is loaded via `next/font/local` inside each page rather than a shared layout; no global font wrapper exists.

**Two separate data layers:**

- `src/data/catalog.ts` and `src/data/catalog-mothers-day.ts` — static TypeScript arrays (legacy; kept for seeding). New content comes from Firestore.
- `src/lib/firestore.ts` — all live data access. Two Firestore collections: `catalogs` and `products`. Products reference catalogs via a `catalogIds: string[]` field (slugs, not Firestore IDs), enabling many-to-many assignment.

**Auth flow:**

- `src/contexts/AuthContext.tsx` exposes `useAuth()` with `{ user, isAdmin, logout }`. Admin check is `NEXT_PUBLIC_ADMIN_EMAILS.includes(user.email)` (comma-separated list, case-insensitive). Falls back to legacy `NEXT_PUBLIC_ADMIN_EMAIL` if the new var is unset.
- `src/app/admin/layout.tsx` wraps every admin route in `<AuthProvider>` and an `AuthGuard` that redirects unauthenticated users to `/admin/login`.

**Image uploads:**

- `src/app/api/upload/route.ts` — POST stores files in Vercel Blob under `products/`, returns `{ url }`. DELETE removes a Blob URL. Only called from the admin UI.

**Public-facing routes:**

- `/` — landing with animated `CatalogList` fetching active catalogs from Firestore.
- `/catalogo/[slug]` — dynamic catalog page; resolves slug → Firestore catalog + filtered active products.
- `/catalogo/[slug]/[productId]` — product detail page.
- Hardcoded seasonal routes exist at `/catalogo/dia-de-las-madres/2026/` and `/catalogo/flores-amarillas/2026/` (static pages with their own data files).
- `/informacion-bancaria`, `/cuidados-de-ramos`, `/cuidados-de-cajas` — static info pages.

**Admin routes (`/admin/*`):**

- `AdminPage` (`src/app/admin/page.tsx`) is a single large client component with two tabs: Catálogos and Productos. All admin sub-components (forms, editable cells, image cells) live in that file.
- Inline editing: `EditableCell`, `ImageCell`, and `CatalogChipsCell` handle optimistic local updates then persist to Firestore.

## Design tokens

All colors are inline Tailwind or hardcoded hex — no CSS variables. Core palette: `#fdf8f5` (background), `#2d1f1a` (text), `#b5606a` / `#d89f94` (rose accent), `#e8c4b8` (border/divider). Animations use `motion/react` with a shared `ease = [0.16, 1, 0.3, 1]` spring curve defined per-file.
