# FocusPond roadmap — MVP and beyond

Status: **M0–M1 complete** (`374011f`). Next up: **M2**.

This is the plan of record. It supersedes any earlier milestone numbering.

---

## Why this plan looks like this

An earlier milestone sequence was reverse-engineered from which stub files
happened to exist in the repo — archaeology, not product design. This one is
built from two things that genuinely constrain FocusPond:

**1. The marketing site has already made commitments.** The meta title and PWA
name are `"FocusPond - Mood-Aware Productivity"`, and the meta description
promises _"mood-based task suggestions."_ That is the brand, not a feature — and
`moodDB.getToday()` currently has **zero call sites**, so the defining claim is a
dead write. Mindful breaks appear on **seven** surfaces including the hero
subtitle. Streaks are promised twice at benefit-card prominence.

Before cutting anything, check `src/i18n/messages/en/marketing.json`. Cutting a
promise usually costs more than building a small version of it, because the cut
means editing copy across up to six locales.

**2. Time is the binding constraint.** ~4 hrs/week, with gaps of weeks. So every
milestone ends demoable, no schema change is split across milestones, and the
hard logic is pure and unit-tested — `pnpm test` is what re-establishes the truth
after a month away.

### The tension, and how it resolves

The goal is "strangers can sign up and use it" on ~4 hrs/week. Auth plus sync is
the most expensive item on the list.

The marketing settles it. The CTA banner promises _"No account needed. Works
offline. Zero pressure."_ — four surfaces, headline prominence. Accounts appear
in exactly one collapsed FAQ item. So for FocusPond, **"strangers can use it"
means: a stranger opens the URL, installs the PWA, and completes the whole loop
offline without hitting a dead control or a lie.**

That is a real product, reachable in ~4 months. Accounts land after, and are
worth more then — an account containing one mood row is not worth creating.

---

## MVP scope

### In

| Capability                          | Why it earns its place                                                        |
| ----------------------------------- | ----------------------------------------------------------------------------- |
| Mood → energy → task matching       | The meta title. Currently a dead write. Non-negotiable.                       |
| Energy-aware frog selection         | Step 2 of the committed loop. `taskDB.setFrog` already works transactionally. |
| Focus timer writing real sessions   | Step 3. `pomodoroDB.start/complete` exist with zero call sites.               |
| Mindful breaks                      | Promised 7×. A countdown and a list of strings. Best value in the plan.       |
| Streaks + a one-field reflection    | Step 4. Promised twice. A pure function and one text input.                   |
| Offline, installable, honest chrome | Serwist already works; the offline page is a stub.                            |
| Copy + a11y fixes                   | ~1.5 hrs. Four broken aria-labels, one contradictory public page.             |

### Out

| Capability                                   | Disposition                                                                                                                                                                                                    |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Analytics dashboard**                      | **Killed.** Nothing ever promised "analytics" — the promise was _"see your streaks and completed Frogs."_ `/analytics` becomes the Progress page. Saves ~20 hrs.                                               |
| **Cross-device sync**                        | M9, post-MVP. Needs tombstones + conflict resolution (~14 hrs on top of auth). Requires a two-string copy edit — see below.                                                                                    |
| **Quick Notes** (own surface)                | Downscoped to a note field on a task.                                                                                                                                                                          |
| **End-of-Day Reflection** (ritual flow)      | Downscoped to one field on the Progress page.                                                                                                                                                                  |
| **Mini-Frogs** (feature)                     | Shipped as a label + sort order.                                                                                                                                                                               |
| Auto-rollover                                | **Already true — zero hours.** `TaskGroup` is a planning horizon with no date, so nothing rolls _off_ "today". The data model already satisfies _"unfinished tasks roll over automatically."_ Do not build it. |
| Search box, Bell icon in `TopBar`            | **Delete.** Never promised anywhere, and they are dead controls.                                                                                                                                               |
| Pricing / billing                            | Stub stays a stub. The FAQ says "completely free while we're in our early stage". Nothing is owed.                                                                                                             |
| Collaboration, teams, sharing, notifications | Never promised anywhere. Never build.                                                                                                                                                                          |

### Standing decisions

- **Launch bar: demo-credible, not full public launch.** Signup works and data
  persists; FocusPond is not promising uptime, password reset, email verification
  or deletion tooling. A full launch roughly triples M8. Revisit once people
  actually use it.
- **Breaks are a screen with prompts**, and the prompt is chosen by today's
  energy (low → breathe/rest, high → stretch). Fifteen extra minutes, and it
  makes both differentiators reinforce each other.
- **Prefer the cheap version over the cut.** `Task.notes` and `NewTaskInput.notes`
  already exist with nothing writing them, so Quick Notes is a field, not a
  feature. Reflection stays because it is step 4 of a 4-step loop shown at
  headline prominence.

---

## Milestones

Hours assume ~4 hrs/week solo and include a re-entry tax (~30 min) for any
milestone resumed after a gap.

### M2 — Mood becomes real · 5 hrs · weeks 1–2

The highest ratio of visible change to hours in the plan, because most of it is
connecting things that already exist: `energyRank()`, `energyTagKey()`,
`Frog.energyMatch`, `moodDB.getToday()`, and **both rendered branches of
`FrogOfTheDay`**. `tasks.json` already ships `frog.energyMatch` ("Matches your
energy"), `frog.energyMismatch` and `energy.{high,medium,low}` as unreachable copy.

- `src/features/mood/hooks/useMood.ts` — replace the stub. `useTodayMood()` and
  `useTodayEnergy()` via `useLiveQuery(() => moodDB.getToday(), [])`. Follow the
  conventions already set in `src/features/tasks/hooks/useTasks.ts`.
- `src/features/tasks/lib/taskDisplay.ts` — add `energyFits(required, available)`
  (`energyRank(required) <= energyRank(available)`) and a pure
  `suggestFrog(tasks, energy)`.
- `src/features/tasks/lib/taskDisplay.test.ts` — extend. Pure, cheap, and the part
  that survives a three-week gap.
- `src/app/(app)/(dashboard-layout)/home/today/page.tsx` — replace `frog={null}`
  with the real frog carrying `energyMatch`; delete the M2 TODO comment there.
- `src/app/(app)/_components/TopBar.tsx` — the two dead "Set mood" buttons become
  links to `/mood`, showing today's mood when one exists.
- `src/app/(app)/_components/EnergyOverview.tsx` — replace `<div>Hello Energy</div>`.
- `src/app/(app)/_layouts/DashboardPanel.tsx` — uncomment the `EnergyOverview` row.

**Bug to fix here (~30 min).** `useTasks(group)` returns only _incomplete_ tasks
(`taskDB.getByGroup` filters `!task.completed`), so
`tasks.filter(t => t.completed).length` is structurally always `0` in
`home/today/page.tsx`, `home/week/page.tsx` and `TaskAccordion.tsx`. Every
`PageHeader` progress bar reads `0 / N` and every accordion done-count is dead.
Add a `useGroupProgress(group)` that counts across both states.

**Done:** check in as Tired → the frog card reads _"Heavier than today's energy"_,
TopBar shows Tired, the sidebar says how many tasks fit. Re-check in as Energized
→ every surface updates live, no reload.

### M3 — Choosing a frog · 6 hrs · weeks 3–4

- `src/features/tasks/components/FrogPicker.tsx` _(new)_ — a sheet listing
  incomplete tasks, energy-fitting ones first via `suggestFrog`, calling
  `setFrog(id)`. One component serves both `onSwap` and `onChoose`.
- `TaskAccordion.tsx` — per-row "make this the frog", plus delete (`deleteTask` is
  exported from `useTasks.ts` and has no caller).
- `AddTaskRow.tsx` — the optional note field. This is the whole Quick Notes downscope.
- `home/today/page.tsx` — wire `onSwap` / `onChoose`.

**Mini-Frogs, ~1 hr of the above:** when `useTodayEnergy() === "low"`, the picker
headline and the `FrogOfTheDay` eyebrow read "Mini-frog", and `suggestFrog`
prefers short low-energy tasks. That honours the _"mood check-ins and mini-Frogs…
even on tough days"_ paragraph on the Mood-Aware Productivity card with no copy change.

**Done:** no frog → "Choose your frog" → picker opens with low-energy tasks on top
on a tired day → pick one → card shows it with the verdict → "Pick another" swaps
it and the previous frog loses its badge.

### M4 — The focus session · 12 hrs · weeks 5–8

The only milestone too big for one evening, so it is **pre-split at a demoable
seam**: **M4a** a countdown that runs and writes a session (no ring art); **M4b**
the ring, task binding, resume-after-reload. Both end shippable.

- `src/features/pomodoro/hooks/usePomodoro.ts` — replace the stub. **Derive
  remaining time from `startTime + duration`, never an in-memory counter** — the
  `PomodoroSession` doc comment already mandates this, and it is what makes a
  backgrounded tab, a throttled interval or a reload safe. Persist the running
  session id to resume.
- `src/features/pomodoro/components/FocusTimer.tsx`, `TimerRing.tsx` _(new)_.
- `home/timer/[taskId]/page.tsx` — actually read the param (it currently does
  not), load the task, render the timer. Support `taskId === "free"`;
  `pomodoroDB.start` already accepts `undefined`.
- `src/features/tasks/hooks/useTasks.ts` — add `useTask(id)`.
- `src/lib/db/indexedDB.ts` — add `pomodoroDB.abandon(id)` (sets `endTime`, leaves
  `completed: false`) so a cancelled session is not an orphan. No schema change.
- `src/i18n/config.ts` — add `"focus"` to `namespaces`; new `en/focus.json`.

`FrogOfTheDay.tsx` needs **zero changes** — `onStart` is already a prop.

**Done:** start focus on the frog → counts down from 25:00 → **reload mid-session
and the clock is still correct** → finish → the task goes 0/2 → 1/2 focus blocks
and a row lands in `pomodoros`.

### M5 — Mindful breaks · 6 hrs · weeks 9–10

Six hours discharges six promises: the hero subtitle, the Focus Timer card, the
Mindful Breaks card, the pomodoro-rhythm benefit, How It Works step 3, and the
25-minute persona claim. Nothing else in this plan comes close to that ratio.

- `src/features/pomodoro/constants/breakPrompts.ts` — replace the stub. ~12 prompts
  as `{ id, minutes, category }`. Keep the file data-only and put the strings in
  `focus.json` — the same split `src/data/landing-page/features.ts` already uses.
- `src/features/pomodoro/components/BreakScreen.tsx` _(new)_ — a 5-minute break
  after a completed session, with the prompt chosen by today's energy.
- `usePomodoro.ts` — break ends → offer the next block on the same task.

**Done:** finish a session (temporarily set the duration to 1 min) → break screen
with a prompt → countdown → "Back to focus" returns with block 2 queued.

### M6 — Progress: streaks + day's end · 8 hrs · weeks 11–13

- `src/features/progress/lib/streak.ts` _(new)_ — `currentStreak(days)`; a day
  counts if ≥1 focus session completed **or** the frog was completed. **Pure, no
  DB** — the most gap-resistant thing in the plan.
- `src/features/progress/lib/streak.test.ts` _(new)_ — boundaries, gaps, timezones.
- `src/features/progress/hooks/useProgress.ts` _(new)_ — live queries over
  `db.pomodoros` plus completed tasks.
- `src/lib/db/indexedDB.ts` — **Dexie v3**: add `reflections: "++id, date"`. Follow
  the existing `.version(n).stores().upgrade()` pattern.
- `analytics/page.tsx` — replace `<h1>Analytics</h1>` with the Progress page:
  streak, this week's completed frogs, focus blocks today, and one
  "what went well today?" field.
- `Sidebar.tsx` — relabel the nav item (`getCurrentSection` already handles
  `/analytics`). `FrogsSummary.tsx` — replace `<div>Hello Frogs</div>`. Uncomment
  its `DashboardPanel` row.

**Done:** complete a session → `/analytics` shows "1 day streak", one completed
frog, and accepts a reflection note that survives reload.

### M7 — Ship it · 8 hrs (11 with export/import) · weeks 14–16

**This is the finish line.** After this, post the link.

- `src/app/offline/page.tsx` — a real offline screen. It is already precached in
  `next.config.ts` and is the service worker's navigation fallback, but currently
  renders `<div>offline page</div>` from a function misnamed `LoginPage`.
- `src/hooks/useOnlineStatus.ts` — implement the stub; drive a small offline pill.
- `TopBar.tsx` — **delete the Bell and the Search box.** Neither is promised
  anywhere, and dead controls are the fastest way to lose a stranger's trust.
- `Sidebar.tsx` — the two bottom `IconButton`s (Sun, Settings) have no `onClick`.
  Give them destinations or remove them.
- First run: a stranger lands on an empty `/home/all`. Seed 2–3 example tasks on
  an empty DB, or add an inline hint. `tasks.list.empty` copy already exists.
- **Four aria-labels** — `Hero.tsx:36`, `HowItWorks.tsx:58`, `CtaBanner.tsx:21`
  and `_components/ui/SignupButton.tsx:11` all carry
  `aria-label="Sign up for FocusPond"` over a visible "Start for free" that points
  at `/mood`. **Delete the attribute**, do not rewrite it — the visible text is
  already a correct accessible name, and a mismatched aria-label also breaks voice
  control ("click Start for free" will not match the element).
- **`/waitlist`** — repurpose, do not delete. It says _"Be the first to experience
  FocusPond when we launch"_ on a site that says "Start for free", and it is
  publicly reachable and indexable. Rewrite as _"Get notified when accounts and
  backup land."_ Link it from `Footer.tsx`. That keeps the already-working
  `src/app/api/waitlist/route.ts` earning its keep and builds the M8 list.
- **Recommended (+3 hrs): local export/import JSON.** "Download my data" /
  "Restore from file". It answers _"what if I clear my browser?"_ with no server
  and no dishonesty, and it is what makes deferring accounts read as deliberate
  rather than unfinished.

**Done:** on a phone that has never opened it — install to home screen, enable
airplane mode, check in, pick a frog, run a session, take a break, see the streak.
Every visible control does something.

### M8 — Accounts + backup · 19 hrs · weeks 17–22

Makes the FAQ's _"back up your progress"_ true. Read
[`docs/features/sync.md`](features/sync.md) first — it is the spec, including the
`client_id` defect and its fix. Six separately-shippable steps, so a gap never
lands mid-refactor:

1. **Dexie v4: `uuid` on every row** (2h) — backfill with `crypto.randomUUID()` in
   `.upgrade()`, as the v2 upgrade already does. This fixes the
   `(user_id, client_id)` defect **before any row reaches a server**. Dexie `++id`
   restarts per browser, so two devices' row `1` would silently overwrite each
   other. Doing this first is the difference between M9 being possible and M9
   being a data-loss bug.
2. **Supabase auth** (4h) — add `@supabase/ssr` (the repo has `supabase-js` only).
   `src/middleware.ts` for **session refresh only, not route protection** —
   `/home` must stay reachable by guests. That is the advertised position.
3. **Wire `AuthForm`** (2h) — replace `onSubmit={handleSubmit(() => {})}`; delete
   the `common.auth.notWired` string and the `<p>` rendering it.
4. **Tables with RLS on from day one** (3h) — `auth.uid() = user_id`. `sync.md`
   warns explicitly that enabling RLS after the fact is the trap.
5. **Adoption** (5h) — phase 2 in `sync.md`. On first successful auth, walk local
   rows, stamp `user_id`, push, `markAsSynced`. Every `getUnsynced()` /
   `markAsSynced()` helper in `indexedDB.ts` already exists and has never been
   called; this is what finally gives them a purpose.
6. **Restore on a fresh device** (3h) — pull rows by `user_id`, insert any `uuid`
   not already local. **One-directional.** Enough for "back up your progress"; it
   is not "sync across devices", and the copy must not claim otherwise.

**Done:** use as a guest for a week → sign up → all existing data appears in
Supabase under your uid → log in on a different browser → tasks, moods and streak
are there.

### M9 — Cross-device sync · 14 hrs · weeks 23–27 · post-MVP

`updatedAt` on every row. `deletedAt` tombstones — `taskDB.delete()` is currently
a hard delete, so a second device will resurrect it. Debounced push-on-write,
pull-on-focus/online, last-write-wins per row (`sync.md` blesses LWW for this
data). Restore the FAQ copy trimmed in M7.

---

## Copy changes required

Only one deferral needs copy edited — cross-device sync:

- `marketing.faqs.items.offline.answer` — _"will sync online when you create an
  account"_ → _"will back up online when you create an account."_
- `marketing.faqs.items.no-account.answer` — drop the trailing _"and sync across
  devices"_.

**Files: `src/i18n/messages/{en,fr,pcm}/marketing.json` — three only.** `ig`, `yo`
and `ha` have no `faqs` block and fall back to English. Restore both strings at M9.

All new in-app copy is **English-only**. `src/i18n/request.ts` deep-merges English
underneath every locale, and `messages.test.ts` only forbids _extra_ keys in a
locale, never missing ones. Six locales therefore cost nothing per feature.

---

## The real timeline (4 hrs/week)

| Reached                         | Hours     | Calendar      |
| ------------------------------- | --------- | ------------- |
| Core loop complete (M2–M5)      | 29        | ~10 weeks     |
| Progress + streaks (M6)         | 37        | ~13 weeks     |
| **Shippable to strangers (M7)** | **45–48** | **~4 months** |
| Accounts + backup (M8)          | 64–67     | ~5.5 months   |
| Cross-device (M9)               | 78–81     | ~7 months     |

That gap — 4 months to shippable versus 7 to cross-device — **is** the argument
for this ordering. Three extra months before anyone can use anything is not a
trade worth making for a feature promised in one collapsed accordion item.

---

## Verification

Each milestone has its own "Done" test above. Across the whole plan:

```bash
pnpm typecheck && pnpm lint && pnpm test
pnpm dev
```

The end-to-end acceptance test for M7, on a device that has never run it:

1. Open the deployed URL on a phone; install to home screen.
2. Enable airplane mode.
3. Mood check-in → lands on Today with an energy-matched frog.
4. Add a task, make it the frog, start focus.
5. Reload mid-session — the clock is still correct.
6. Finish → break screen with a prompt suited to that energy.
7. `/analytics` shows a 1-day streak and accepts a reflection.
8. Every visible control does something. No dead buttons, no lies.

---

## Cheapest wins, ranked

1. **M2 (5 hrs)** — lights up copy that is already written _and already
   translated_ but currently unreachable, plus both `FrogOfTheDay` branches and
   two stub panels. It is also the meta title.
2. **M5 mindful breaks (6 hrs, 7 promised surfaces)** — a countdown and a list of
   strings. Best promise-per-hour in the product, by a wide margin.
3. **Streaks (~3 of M6's 8 hrs)** — a pure function over rows already stored. The
   analytics dashboard it replaces would be ~20 hrs and was never promised.
4. **Auto-rollover (0 hrs)** — already satisfied by the data model. Just know it,
   so it doesn't get built by accident.
5. **Mini-Frogs as a label (~1 hr inside M3)** — discharges a paragraph on the
   defining benefit card without building a feature.
6. **The four aria-labels (15 min)** — delete one attribute in four files. Fixes
   screen readers and voice control together.
7. **Waitlist repurpose (~1 hr)** — turns a contradictory indexable page into the
   M8 mailing list, reusing an API route that already works.
8. **The always-zero progress bar (30 min)** — currently broken on every page.
