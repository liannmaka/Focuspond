# Sync (not yet built)

FocusPond is **local-first**. IndexedDB (`src/lib/db/indexedDB.ts`) is the source
of truth for tasks, moods and focus sessions. There is currently no backend sync
for app data, and no auth — the app runs in guest mode.

Supabase _is_ used, but only for the marketing surfaces:
`src/app/api/waitlist/route.ts` and `src/app/api/contact-form/route.ts`.

## Why there's no sync yet

Mood sync existed once and genuinely worked. `src/features/mood/lib/moodSync.ts`
pushed unsynced moods to Supabase, and `MoodSyncListener` (mounted in the root
layout) drove it — debounced on save, again on `online`, on tab visibility, and
every five minutes. It was live and verified in **`e3cef73` (2025-12-18)**.

It stopped running in **`3c46ee5` "chore: code restructure" (2026-03-23)**, which
converted 34 of its lines to comments. The reason is still visible in the file: it
read the user from `useSession` in `@supabase/auth-helpers-react`, which is Pages
Router. The App Router migration left it no session to read, so the calls were
commented out — and never restored.

By the M0 cleanup (2026-09-21) it had been inert for six months. It was deleted
then, not because it was bad code, but because it was dead code whose one live
behaviour was minting a fake `mood_user_id` in `localStorage` on every page load,
including every marketing page. Both files remain in history:

```bash
git show 374011f~1:src/features/mood/lib/moodSync.ts
git show 374011f~1:src/features/mood/components/MoodSyncListener.tsx
```

### The rule: identity is assigned, never invented

Guest data stays on the device. Do not sync it, even when it would be easy.

The flaw in the old implementation was not the fabricated id as such — it was
carrying an owner field _at all_ while there was no owner. A guest's rows should
hold no `user_id`, because the device is the entire scope. Ownership is stamped on
at the moment identity actually exists. A guessed answer to "who owns this row?"
is worse than no answer, because downstream code cannot tell the two apart.

Pushed to a shared table, guest rows become records no account can ever claim:
nobody can log in and find them, a deletion request cannot be honoured for them,
every cleared cache mints another phantom user, and whenever real auth lands you
inherit a table of orphans to migrate by guesswork or drop. Guest sync does not
get you a head start on sync; it gets you a cleanup job.

So sync is a feature of _having an account_. This is the substantive reason the
old implementation should not simply be switched back on, independent of how well
it ran.

### The three phases

1. **Guest — where the app is now.** IndexedDB only. No `user_id` anywhere, no
   network. `synced: false` on every row, which is already correct: nothing has
   been synced. The app is fully usable and owes the server nothing.
2. **Adoption — the interesting half of M6.** Signing up is an upgrade, not a
   wall; the reader has been using the app for days and must not lose that. On
   first successful auth, walk every local row, stamp `user_id = auth.uid()`,
   push, mark synced. That step is simple _only because_ phase 1 assigned no
   owner — had guest rows been synced under a phantom id, this becomes
   reconciling two identities instead of assigning one.
3. **Ongoing sync — two devices, both writing.** Where the genuinely hard
   problems live: conflict resolution, deletes (tombstones are required — a row
   that merely vanishes locally gets resurrected by the other device), clock
   skew. Last-write-wins is likely sufficient here; this is personal data with
   near-zero real conflict.

Cross-device continuity is a **phase 3** capability. No amount of work on mood
sync alone reaches it.

### RLS and the anon client

`moodSync.ts` wrote through the **anon** client (`src/lib/config/supabaseClient.ts`)
using that fabricated `user_id`. That it worked in testing implies RLS was not
enabled on the `moods` table (unverified from the repo — the policy lives in the
Supabase project, not here; check it there before relying on either answer).

Either way the constraint is the same: the moment RLS is on with the usual
`auth.uid() = user_id` policy, a `user_1734...` string is not an auth uid and the
write is rejected. Real auth has to land before, or with, RLS — not after.

## The `synced` flag

Every stored record carries `synced?: boolean`, written as `false` on insert and
on every update. Nothing reads it yet. It is maintained now so that whenever sync
is built, the backlog of un-pushed records is already correctly marked rather
than needing a one-off backfill.

## Recovered schema: the `moods` table

Recorded from the deleted `moodSync.ts` for reference. **Do not treat this as the
design to build** — see the defect below the table.

The shape it upserted, on `onConflict: "user_id,client_id"`:

| Supabase column | Source (`MoodEntry`)                                      |
| --------------- | --------------------------------------------------------- |
| `user_id`       | the authenticated user (was a fabricated localStorage id) |
| `client_id`     | `mood.id` — the Dexie auto-increment key                  |
| `level`         | `mood.level` (`very-high \| high \| medium \| low`)       |
| `label`         | `mood.label`                                              |
| `energy_level`  | `mood.energyLevel` (`high \| medium \| low`)              |
| `note`          | `mood.note`                                               |
| `created_at`    | `mood.createdAt?.toISOString()`                           |

### Defect: `(user_id, client_id)` is single-device only

That conflict target makes a re-send idempotent _from one browser_, which is as
far as the original design went. It breaks as soon as one account has two devices.

`client_id` is the Dexie `++id`, and auto-increment keys restart per browser. The
work laptop's mood `1` and the home laptop's mood `1` are different records
sharing a key, so the upsert silently overwrites one with the other — no error,
no duplicate, just lost data.

The fix is a client-generated UUID per row (`crypto.randomUUID()` at insert)
used as `client_id` instead of the auto-increment key, giving every record an
identity that is stable across devices and across adoption.

**Do not add it yet.** It is only needed in phase 3, and retrofitting it is a
Dexie version bump with a backfill over a single person's local rows — genuinely
cheap. Adding it now would be building for a milestone that has not arrived,
which is the mistake this document exists to prevent.

## When sync gets built (M6)

Prerequisites, in order. Steps 1–3 deliver phase 2 (adoption); step 5 is phase 3.

1. **Supabase Auth**, not NextAuth. Add `@supabase/ssr` for cookie-based sessions,
   a `src/middleware.ts` to guard `/home/*`, `/analytics` and `/mood`, and a real
   submit handler in `src/app/(auth)/_components/AuthForm.tsx` (currently
   `onSubmit={handleSubmit(() => {})}`). Keep guest mode working — signup is an
   upgrade, not a gate.
2. **RLS policies** keyed on `auth.uid() = user_id` for `moods`, `tasks` and
   `pomodoros`. Enable these _with_ auth, never before it.
3. **Adoption, not migration.** The reader will already have local data before
   they ever sign up. On first successful auth, stamp `user_id` onto existing
   local rows and push them. Do not assume an empty account, and do not discard
   local rows in favour of server state.
4. **Then stop and use it.** One device, backed up. That is most of the value,
   and it is a natural place to pause.
5. **Only if cross-device is actually wanted:** switch `client_id` to a
   client-generated UUID (see the defect above), add tombstones so deletes
   propagate, pick a conflict rule (last-write-wins is fine here), and rebuild
   `src/hooks/useSync.ts`. This step is substantially harder than 1–4 combined;
   do not start it by accident.

Do not start this until the core loop (tasks, frog, timer) is in daily use.
