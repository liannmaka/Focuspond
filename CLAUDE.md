# FocusPond

A calm productivity + wellness app: plan your day, tackle your most important
task (your "Frog of the Day"), take mindful breaks, and check in on your mood.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS 4** · CVA + `clsx` + `tailwind-merge` for component variants
- **Zustand** (state) · **Dexie** / IndexedDB (offline persistence) · **Supabase** (backend/auth)
- **react-hook-form** + **Zod** (forms/validation) · **framer-motion** · **sonner** (toasts)
- **next-intl** (i18n) · **Serwist** (PWA/service worker)
- Package manager: **pnpm** (`pnpm@9.1.1`)

## Commands

```bash
pnpm dev            # dev server
pnpm build          # production build (needs .env.local — see .env.example)
pnpm start          # serve the production build
pnpm typecheck      # tsc --noEmit
pnpm test           # vitest run
pnpm lint           # eslint
pnpm format         # prettier --write
```

## Structure

- `src/app/` — App Router with route groups: **`(marketing)`** (landing, pricing,
  contact, waitlist), **`(app)`** (authenticated product: mood, home/tasks, timer,
  analytics), **`(auth)`** (login/signup). `_components/` folders are route-local.
- `src/features/{mood,tasks,pomodoro,i18n}/` — feature modules (components, hooks,
  lib, store, constants, types).
- `src/components/ui/` — shared design-system primitives (Button, Card, Badge…).
- `src/data/` — static content data (landing-page copy structure, nav).
- `src/i18n/` — localization config, request loader, message catalogs.
- `src/lib/` — `env.ts` (Zod-validated env), `utils.ts`, `config/` (Supabase), `auth/`.
- `src/types/`, `src/hooks/`, `src/styles/globals.css`.

## Conventions & gotchas

- **Environment:** never read `process.env` directly — use `src/lib/env.ts`
  (`clientEnv`, `getServerEnv()`), which validates with Zod and fails fast. Build
  requires Supabase vars in a local `.env.local` (copy from `.env.example`).
- **Path aliases** (no `baseUrl`): `@/components/*`, `@/features/*`, `@/data/*`,
  `@/lib/*`, `@/types/*`, `@/hooks/*`, `@/i18n/*`, `@/styles/*`.
- **i18n:** copy is not hardcoded in most marketing/mood/nav surfaces — it lives in
  `src/i18n/messages/{locale}/`. English is the source of truth; other locales fall
  back to it. See **`docs/features/i18n.md`** before touching translations.
- **Testing:** Vitest + Testing Library; tests live beside code as `*.test.ts(x)`.
- **Commits:** conventional-commit house style (`type(scope): subject`, ≤60 chars,
  imperative). **Never** add a `Co-Authored-By` or other trailer. Main branch is
  `development`. Don't bypass hooks (lint-staged runs Prettier/ESLint on commit).

## Feature docs

Per-feature references live in **`docs/features/`** — read the relevant one before
extending a feature:

- [`docs/features/i18n.md`](docs/features/i18n.md) — multi-language "Vibe Switcher"
  (6 locales, next-intl, cookie-based, English fallback).
