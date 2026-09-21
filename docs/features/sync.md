# Sync (not yet built)

FocusPond is **local-first**. IndexedDB (`src/lib/db/indexedDB.ts`) is the source
of truth for tasks, moods and focus sessions. There is currently no backend sync
for app data, and no auth — the app runs in guest mode.

Supabase _is_ used, but only for the marketing surfaces:
`src/app/api/waitlist/route.ts` and `src/app/api/contact-form/route.ts`.

## Why there's no sync yet

An earlier attempt (`src/features/mood/lib/moodSync.ts` plus a `MoodSyncListener`
mounted in the root layout) was removed in the M0 cleanup. It was real, working
code for a milestone that hadn't arrived: nothing called it — its only importer
was a commented-out line — and it authenticated with the _anon_ client against a
`user_id` fabricated in `localStorage`, which would fail under any real RLS
policy. It has been deleted rather than left to rot; this file records the one
thing in it worth keeping.

## The `synced` flag

Every stored record carries `synced?: boolean`, written as `false` on insert and
on every update. Nothing reads it yet. It is maintained now so that whenever sync
is built, the backlog of un-pushed records is already correctly marked rather
than needing a one-off backfill.

## Recovered schema: the `moods` table

The intended Supabase shape, upserted on `onConflict: "user_id,client_id"`:

| Supabase column | Source (`MoodEntry`)                                      |
| --------------- | --------------------------------------------------------- |
| `user_id`       | the authenticated user (was a fabricated localStorage id) |
| `client_id`     | `mood.id` — the Dexie auto-increment key                  |
| `level`         | `mood.level` (`very-high \| high \| medium \| low`)       |
| `label`         | `mood.label`                                              |
| `energy_level`  | `mood.energyLevel` (`high \| medium \| low`)              |
| `note`          | `mood.note`                                               |
| `created_at`    | `mood.createdAt?.toISOString()`                           |

`(user_id, client_id)` as the conflict target is what makes the push idempotent:
a device can re-send its whole unsynced backlog without creating duplicates.

## When sync gets built (M6)

Prerequisites, in order:

1. **Supabase Auth**, not NextAuth. Add `@supabase/ssr` for cookie-based sessions,
   a `src/middleware.ts` to guard `/home/*`, `/analytics` and `/mood`, and a real
   submit handler in `src/app/(auth)/_components/AuthForm.tsx` (currently
   `onSubmit={handleSubmit(() => {})}`).
2. **RLS policies** keyed on `auth.uid() = user_id` for `moods`, `tasks` and
   `pomodoros`.
3. **Guest-to-account migration** — a reader will already have local data before
   they ever sign up, so the first sync must adopt existing rows rather than
   assume an empty account.
4. Only then: rebuild the push/pull layer and `src/hooks/useSync.ts`.

Do not start this until the core loop (tasks, frog, timer) is in daily use.
