# FocusPond

A calm productivity + wellness app: plan your day, tackle your most important
task (your "Frog of the Day"), take mindful breaks, and check in on your mood.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS 4** · CVA + `clsx` + `tailwind-merge` for component variants
- **Dexie** / IndexedDB (local-first persistence, the source of truth) · **Supabase**
  (marketing forms only — no app-data sync or auth yet) · **Zustand** (exactly one
  store: the shared clock in `features/pomodoro/store/tick.ts`. Not used for any
  stored data — see below)
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
- `src/features/{mood,tasks,pomodoro,progress,theme,i18n}/` — feature modules
  (components, hooks, lib, store, constants, types).
- `src/components/ui/` — shared design-system primitives (Button, Card, Badge…).
- `src/components/system/` — app-wide plumbing with a face: `WriteFailureToaster`
  (mounted once at the root), `StorageNotice`.
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
- **Data:** IndexedDB (`src/lib/db/indexedDB.ts`) is the source of truth. Read it
  through `useLiveQuery` (`dexie-react-hooks`) — see `src/features/tasks/hooks/useTasks.ts`
  for the pattern. **Do not add a Zustand store mirroring stored data**: it would be
  a second copy needing manual invalidation, and `useLiveQuery` already updates across
  tabs. Pages import the hooks, never `taskDB`/`moodDB` directly.
  Gotcha: IndexedDB keys can't be booleans, so `completed`/`isFrog` are filtered,
  never indexed or queried with `.where()`. Schema is at **v5**
  (`tasks`, `moods`, `pomodoros`, `reflections`); v3 dated tasks, v4 repaired
  days holding two frogs, v5 added reflections.
- **Every write goes through `guardWrite`** (`src/lib/db/writeGuard.ts`). Storage
  refuses sometimes — a full disk, an origin over quota, site data blocked — and
  with no server copy a silent failure does not degrade into a stale screen: the
  work is gone at the next reload with nobody told. `guardWrite` never throws and
  never swallows; `WriteFailureToaster` turns the report into something readable.
  A new mutation that calls `taskDB` directly reintroduces exactly that hole, so
  `useTasks.guard.test.ts` checks each one is wired.
- **`undefined` is not empty.** Live queries return `undefined` while resolving,
  which is a third state, not a slow `[]`. Collapsing it with `?? []` is how every
  page load came to flash "nothing here yet" over tasks that were about to appear.
  Pass it through and render a skeleton; see `TaskAccordion` and
  `useTodayEnergyState` for the two shapes this takes.
- **Ask before destroying, don't offer an undo.** Deletion is final here (no
  trash, no server copy), and an undo in a toast is only as good as the reader's
  chance of reaching it before it disappears. Use `ConfirmDialog`, which focuses
  Cancel, not the destructive button.
- **Two traps that fail silently**, both already paid for:
  `<Button>` takes an explicit prop list and **does not forward a ref or spread
  the rest** — JSX skips type checking on hyphenated attribute names, so
  `aria-label="…"` on it compiles, renders nothing and reads like working code
  (use `ariaLabel`). And next-intl **splits message keys on dots**, so a flat
  catalog key like `"task.add"` renders as the raw path; nest it instead.
- **Testing:** Vitest + Testing Library; tests live beside code as `*.test.ts(x)`.
  Components need the intl provider — render them with `renderWithIntl` from
  `@/test/renderWithIntl` (it loads the real English catalog). DB tests import
  `fake-indexeddb/auto`, since jsdom ships no IndexedDB.
- **Testing the second action, not just the first.** Every bug that reached the
  browser in this project passed through code with green tests, because the
  tests only ever walked the first action from the obvious starting state. None
  involved invalid input. So for each user action, also test:
  1. **Twice** — a second mood check-in was ignored for a day (`.first()` vs
     `.last()`); every test wrote exactly one row, where the two are identical.
  2. **Elsewhere** — promoting a task to frog worked from Today and silently
     destroyed the current frog from Backlog or Upcoming.
  3. **After** — once the frog was completed the card promoted an unchosen task
     as though the reader had picked it.
  4. **Undo** — unchecking has to restore the prior state, not a near-miss of it.
- **A fifth question: which other surface shows this?** Four frog bugs and the
  navigation one were a single rule enforced in one place and ignored in
  another — one fact, surfaces that did not know it. When a rule turns on
  stored state, find every surface that reads it and test them together.
- **If a test asserts on a settled state, check the transient one.** Three bugs
  this project shipped lived in a single frame: a clock reading 25:01 before the
  first tick, a note overwritten by an empty box before the query resolved.
  `renderHook`'s `result` and `findBy*` both report the settled value, so the
  frame that holds the bug is already gone. Collect every render, or assert
  inside `waitFor`.
- **Timezones only exist in CI.** This project is developed in `Africa/Lagos`,
  which has no DST, so every daylight-saving case passes locally whatever the
  code does. CI runs the suite under `TZ=Europe/London` for that reason — a
  date test that matters is one you have seen fail there.
- **Prove a regression test bites.** After fixing a bug, revert the fix and
  confirm the new test _fails_, then restore it. A regression test that passes
  against the bug is worse than none: it reports coverage that does not exist.
- **Commits:** conventional-commit house style (`type(scope): subject`, ≤60 chars,
  imperative). **Never** add a `Co-Authored-By` or other trailer. Main branch is
  `development`. Don't bypass hooks (lint-staged runs Prettier/ESLint on commit).

## Docs

**[`docs/roadmap.md`](docs/roadmap.md) is the plan of record** — MVP scope, what is
deliberately cut, milestones M2→M9 with hour estimates, and the copy commitments the
marketing site has already made. Read it before proposing new features or "finishing"
an existing stub; several stubs are cut on purpose, and one promised feature
(auto-rollover) is already satisfied by the data model.

Per-feature references live in **`docs/features/`** — read the relevant one before
extending a feature:

- [`docs/features/i18n.md`](docs/features/i18n.md) — multi-language "Vibe Switcher"
  (6 locales, next-intl, cookie-based, English fallback).
- [`docs/features/focus.md`](docs/features/focus.md) — the session clock, the
  break that follows it, and the shared tick. **Read before touching
  `features/pomodoro/`**: remaining time is derived from a stored date, a break
  is not a row, and the clock has reported more time than was left three times.
- [`docs/features/sync.md`](docs/features/sync.md) — why there's no backend sync or
  auth yet, what the `synced` flags are for, and the prerequisites before building it.
