# FocusPond roadmap — MVP and beyond

Status: **M0 – M3a complete** (`3fa1c18`). Next up: **M3b**.

Tasks are fully editable as of M3a — title, effort, estimate, date and delete.
`taskDB.setFrog` is the last database function still without a caller; M3b gives
it one.

> **Translations needing a native check.** The "Upcoming" rename (`3fa1c18`) was
> written without a fluent speaker: `pcm` "Dey Come", `ig` "Na-abịa",
> `yo` "Tí ń bọ̀", `ha` "Mai zuwa". French "À venir" is sound. One nav label
> each, in `src/i18n/messages/<locale>/nav.json` → `tabs.week`.

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

| Capability                                   | Disposition                                                                                                                                                                                                                                                                          |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Analytics dashboard**                      | **Killed.** Nothing ever promised "analytics" — the promise was _"see your streaks and completed Frogs."_ `/analytics` becomes the Progress page. Saves ~20 hrs.                                                                                                                     |
| **Cross-device sync**                        | M9, post-MVP. Needs tombstones + conflict resolution (~14 hrs on top of auth). Requires a two-string copy edit — see below.                                                                                                                                                          |
| **Quick Notes** (own surface)                | Downscoped to a note field on a task.                                                                                                                                                                                                                                                |
| **End-of-Day Reflection** (ritual flow)      | Downscoped to one field on the Progress page.                                                                                                                                                                                                                                        |
| **Mini-Frogs**                               | **Cut.** Copy rewritten in en/pcm/fr — the term was used twice and defined nowhere, for behaviour the app already does silently.                                                                                                                                                     |
| Auto-rollover                                | **Now M2.5 — this entry was wrong.** It claimed the promise was already met because `TaskGroup` has no date, so nothing rolls _off_ "today". True only in the degenerate sense that nothing ever moves: a task filed under Today in March is still under Today in October. See M2.5. |
| Search box, Bell icon in `TopBar`            | **Delete.** Never promised anywhere, and they are dead controls.                                                                                                                                                                                                                     |
| Pricing / billing                            | Stub stays a stub. The FAQ says "completely free while we're in our early stage". Nothing is owed.                                                                                                                                                                                   |
| Collaboration, teams, sharing, notifications | Never promised anywhere. Never build.                                                                                                                                                                                                                                                |

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
milestone resumed after a gap. Week numbers count from the next unstarted
milestone, not from the start of the plan.

### M2 — Mood becomes real · ✅ done (cd0d5cb)

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

### M2.5 — "Today" becomes a date · ✅ done (087e7f3)

**Why this exists.** `TaskGroup` is a string, so "today" never changes meaning: a
task filed under Today last month is still under Today now, and the promised
_"unfinished tasks roll over automatically"_ has never been true. The count badge
compounds it — `useTasks()` returns only open tasks while `useGroupProgress()`
counts all of them, so Today can read `4/4` above an apparently empty list.

**Do this before M3.** The frog picker ranks "today's tasks". Building it on a
definition that is about to change means building it twice.

#### The model: one date replaces the label

```ts
plannedFor: Date | null; // replaces `group: TaskGroup`
```

| View          | Rule                                                     |
| ------------- | -------------------------------------------------------- |
| **Backlog**   | `plannedFor === null` — someday, no commitment           |
| **Today**     | `plannedFor <= startOfTomorrow()` — today + carried over |
| **This week** | `plannedFor` after today, within the week                |

This is the near-universal definition. Zenkit: _"all tasks … due on or before the
current date and have not yet been marked as completed."_ 2Do carries past-due
tasks forward to Today until completed. Microsoft To Do is the counter-example —
overdue tasks vanish from Today, and users complain about exactly that.

Three things fall out for free:

- **Rollover becomes real _and visible_.** A task planned for Friday still matches
  `<= today` on Saturday, so it appears in Today — and because the date is known,
  it can be marked _"carried from Friday"_ rather than blending in silently. Silent
  accumulation is the actual complaint; excluding old tasks is not the fix.
- **Week flows into Today by itself.** Plan something for Thursday and on Thursday
  it is simply in Today. Nothing to move by hand.
- **Done becomes an archive**, not the place today's completions go to hide.

#### Completed tasks: collapsed, not banished

Keep them in the group, behind a disclosure, collapsed by default:

```
▾ Today                        1 left     Add task +
  ○ Write the proposal          DEEP WORK  50m
  ▸ Done today (3)
```

The majority pattern (Todoist, Zenkit, 2Do) hides completed items from Today
entirely. That is rejected here for one product-specific reason: the marketing
promises _"End your day calmly by noting your wins"_ and _"See your streaks and
completed Frogs."_ Making today's wins reachable only from another tab throws that
away. A disclosure keeps the list clean and the wins one click away.

It also fixes the badge. The header shows **"1 left"** — what is actually in the
list — and `3/4` moves onto the disclosure, where it is self-explanatory.

#### Work

- `src/features/tasks/types/task.ts` — `plannedFor: Date | null` replaces `group`.
  Keep `TaskGroup` as a **derived view name**, not a stored field.
- `src/lib/db/indexedDB.ts` — **Dexie v3**: index `plannedFor`; `.upgrade()` maps
  `group` → a date (`today` → today, `week` → end of this week, `backlog` → null).
  Rewrite `getByGroup` as date-range queries. Add `carriedFrom` as a derived value,
  not a column.
- `src/features/tasks/hooks/useTasks.ts` — queries by date range; `useGroupProgress`
  returns `{ open, done, total }` so callers stop recomputing from a filtered list.
- `src/features/tasks/components/TaskAccordion.tsx` — the disclosure, the carried-over
  marker, header count becomes "N left".
- `AddTaskRow.tsx` — Today / This week / Someday maps to a date instead of a label.
- `src/i18n/messages/en/tasks.json` — `list.left`, `list.doneToday`, `list.carriedFrom`.
- Tests: date arithmetic is the risk. Cover midnight boundaries, a task planned 3
  days ago appearing in Today, and the v2→v3 upgrade.

**Done:** create a task for today, complete it, and it drops into "Done today (1)"
while the header reads "0 left". Change the device clock to tomorrow: the unfinished
task is in Today marked _carried from yesterday_, and the completed one is not.

### M3a — Tasks become editable · ✅ done (3fa1c18)

**Why this comes before the frog picker.** A task's title, effort, estimate and
date are all fixed at the moment it is created. Mistype a title and your only
recourse is to complete it and add another; there is no delete at all. That
blocks daily use in a way choosing a frog does not.

It also makes M3b cheaper: the per-row menu built here is the same affordance
"make this the frog" needs, so the picker arrives into a menu that already exists.

- **`AddTaskRow.tsx` → a dual-mode composer.** It already collects exactly what
  editing needs — title input, effort control, minutes chips. Give it an optional
  `task` prop: present means edit, absent means create. One component for both,
  so the two can never drift apart, and the keyboard model (Enter saves, Escape
  dismisses) is learned once. A separate edit form would be more code and a second
  thing to keep in sync.
- **Edit in place, not in a modal** — the row becomes the composer. Same reasoning
  as the original decision not to use a modal for adding: less code, less a11y
  surface, and it keeps the list as the thing you are working in.
- **`TaskAccordion.tsx` — a per-row menu** holding Edit, Delete, and the
  reschedule options. `deleteTask` and `updateTask` are exported from
  `useTasks.ts` and have never had a caller.
- **Reschedule: Today / Upcoming / Someday.** One `updateTask({ plannedFor })`
  via `plannedForView()`. This is the escape hatch M2.5 left open — a task that
  lands in Today otherwise stays there forever with its carried count climbing.
  No app in this space expires stale tasks; they all just let you re-date. Things 3:
  _"change a to-do's start date by simply dragging and dropping it on another day."_
  Remember The Milk is the neat one — clearing the date drops a task into
  Someday/Maybe automatically, which here is exactly `plannedFor = null`.
- **Rename "This week" → "Upcoming"** (~15 min). The view holds everything dated
  in the future, unbounded, so "This week" is a lie past the next seven days. The
  rule is fine — it is what Things 3 calls Upcoming. One message key in
  `src/i18n/messages/en/{nav,tasks}.json`, no logic change.
- **Tests:** editing preserves `createdAt`, `focusBlocksDone` and `isFrog`;
  changing the estimate recomputes `focusBlocks`; rescheduling moves the task
  between views; delete removes it from every view.

**Done:** mistype a task, fix the title in place, change its effort from Deep work
to Light, push it to Upcoming, then delete it — without reloading.

### M3b — Choosing a frog · 6 hrs · weeks 1–2

- `src/features/tasks/components/FrogPicker.tsx` _(new)_ — a sheet listing
  incomplete tasks, energy-fitting ones first via `suggestFrog`, calling
  `setFrog(id)`. One component serves both `onSwap` and `onChoose`.
- `TaskAccordion.tsx` — "make this the frog" joins the row menu built in M3a.
- `AddTaskRow.tsx` — the optional note field. This is the whole Quick Notes downscope.
- `home/today/page.tsx` — wire `onSwap` / `onChoose`.

**Done:** no frog → "Choose your frog" → picker opens with low-energy tasks on top
on a tired day → pick one → card shows it with the verdict → "Pick another" swaps
it and the previous frog loses its badge.

### M4 — The focus session · 12 hrs · weeks 3–5

The only milestone too big for one evening, so it is **pre-split at a demoable
seam**: **M4a** a countdown that runs and writes a session (no ring art); **M4b**
the ring, task binding, resume-after-reload. Both end shippable.

#### M4a — the clock · ✅ done

- `src/features/pomodoro/lib/timer.ts` _(new)_ — the arithmetic, pure and
  `now`-as-an-argument. **Remaining time is `startTime + duration` minus now,
  never an in-memory counter.** Resume-after-reload landed here rather than in
  M4b: with the clock derived, it is not a feature to build but a consequence —
  there is no counter that a reload could lose.
- `src/features/pomodoro/hooks/usePomodoro.ts` — replaced the stub. The running
  session is read from the `pomodoros` table (`endTime === undefined` _is_
  "running"), so nothing persists a session id outside it and a second tab sees
  the same clock. `now` is the only state the hook owns — the one value that
  _should_ be lost on reload.
- `src/features/pomodoro/components/FocusTimer.tsx` _(new)_ — idle, running,
  finished, busy and not-found. `TimerRing.tsx` is M4b.
- `home/timer/[taskId]/page.tsx` — awaits the param and hands the raw segment
  down. Nothing resolves server-side: tasks live in IndexedDB, so the server
  cannot know whether an id exists and `notFound()` would be a guess.
- `src/features/tasks/hooks/useTasks.ts` — `useTask(id)`, three states (loading
  / absent / found), because a screen routed to by id must tell "still loading"
  from "deleted".
- `src/lib/db/indexedDB.ts` — `pomodoroDB.getRunning()`, `abandon(id)`, and
  `complete(id)` made **once-only and transactional**: it writes two rows (the
  session and the task's block count) and the screen reconsiders an elapsed
  session on every tick, so an unguarded second call bought a second focus block
  with the same 25 minutes. It also records `endTime` as the _planned_ end — a
  block that ran out at 12:25 behind a closed tab is a 12:25 block.
- `src/i18n/config.ts` + `src/global.ts` — `"focus"` namespace, `en/focus.json`.

Two decisions worth keeping:

- **No auto-start.** Arriving on the screen does not begin a session; one
  deliberate click does. Auto-starting means a reload after finishing quietly
  begins another 25 minutes, and any re-opened link starts a session nobody
  asked for.
- **A grace window on unwatched sessions** (`COMPLETION_GRACE_MINUTES`, 60). A
  session that ran out behind a closed tab still counts — the time passed. One
  reopened two days later is closed as abandoned with no credit, because it is
  not evidence of anything and a focus block nobody did is worse than none.
- **No pause**, and not from laziness: pause means storing accumulated paused
  time, which `PomodoroSession` has no field for. It is a schema change, so it
  belongs in M4b or later, deliberately. Ending early and restarting covers it.

`FrogOfTheDay.tsx` needed **zero changes** — `onStart` was already a prop.

- `TaskAccordion.tsx` — **a focus button on every open row** (added right after
  M4a). The spec above named one entry point, so a timer that was never
  frog-specific shipped reachable from a single card. The copy lists "a Pomodoro
  timer, daily tasks, Frog of the Day" as three separate things, so a frog-only
  timer under-delivers on a promise already live.

  It lives **on the row, not in the ⋯ menu**: focus is the row's primary action,
  and two clicks behind a generic icon is one too many to reach the thing the
  product is for. Revealed on hover or keyboard focus, like the menu trigger, so
  a list at rest stays calm. Deliberately not in both places — one action, one
  door. A real `<Link>` (middle-clickable), hidden on completed rows, and it
  **only navigates**: focusing on a Backlog item is not a claim that it is
  today's work, and that claim is what making it the frog is for.

- `Sidebar.tsx` — **free focus in the icon rail**, a fourth destination beside
  Tasks, Progress and Mood. `/home/timer/free` worked from day one of M4a but
  nothing linked to it, so it was reachable only by typing the URL. The rail is
  its home rather than a task row, because the point of it is that it has no
  task. `IconButton` also gained `aria-current` — the active state was a
  background colour and a stroke width, so the rail announced four identical
  buttons with no sense of which one you were on.

  **Known layout bug it had to work around:** the dashboard grid reserves a
  fixed `235px` column for the detail panel and places children in order, so a
  section that drops the panel slides `main` into that column and renders the
  page 235px wide. `/analytics` does this today. The focus screen therefore
  keeps the panel, with a test guarding it. Fixing the grid is its own job.

  **Still only on desktop.** The rail is `hidden lg:grid`, so below `lg` there
  is no rail at all — free focus, like Progress, has no mobile entry point
  (`BottomNav` carries the five task filters and nothing else). That is M7's
  decision, not a focus-specific gap.

**Done:** start focus on the frog → counts down from 25:00 → **reload mid-session
and the clock is still correct** → finish → the task goes 0/2 → 1/2 focus blocks
and a row lands in `pomodoros`.

#### M4b — the ring and the rest

- ~~A running session visible outside this screen~~ — ✅ **done**, and wider
  than this entry imagined. The gap was not only that the top bar was silent:
  the frog card still said **"Start focus"** while that very session counted
  down, which is not silence but a false statement. One fact, surfaces that did
  not know it — the same family as the frog bugs.

  Three surfaces now: a top-bar pill (focus _or_ break, linking back to the
  session), the frog card reading "Resume · 18:42" when the session is that
  frog's, and the task row showing its clock in place of the start button.

  - `store/tick.ts` _(new)_ — **the Zustand store, and the reason is agreement,
    not performance.** Four surfaces can show one session at once; with an
    interval each they would hold four `now`s set milliseconds apart and read
    18:42 beside 18:41. It holds the instant and nothing else — no session, no
    task, nothing durable. The interval runs only while something counts.
  - `hooks/useSessionClock.ts` _(new)_ — the rows, the clock, and the settling
    of elapsed sessions and breaks, extracted from `usePomodoro` so both it and
    the chrome share one copy. The settling had to move: a session that runs
    out while the reader is on another page must be closed by whatever is
    watching, or the clock sits at 00:00 until someone opens the focus screen.
    Several components may settle the same session at once — safe by
    construction, because `complete`, `abandon` and `endBreak` are each
    once-only in the database.
  - `hooks/useRunningSession.ts` _(new)_ — read-only, task-agnostic. The chrome
    asks "is something running, how long left"; `usePomodoro` keeps the state
    machine and the task-relative answers.

  Found while building it: the shared instant is up to a second old, so a
  surface appearing between ticks measured its first frame against the previous
  tick and read a second high — 15:01 left on a session with 15:00 to go.
  `subscribe()` now refreshes the instant, not just the interval.

- ~~`TimerRing.tsx`~~ — ✅ **done.** Sweeps clockwise from twelve around the
  digits, fed by `elapsedFraction()`. `aria-hidden`: it says what the clock
  already says, and nobody should have to hear a circle described. The sweep
  is a stroke dash offset rather than an arc path, which would have to
  special-case the half circle, and `motion-reduce` drops the transition so a
  reader who asked for less motion still gets a moving clock.
- Pause, if it is wanted, with the schema field it needs.

### M5 — Mindful breaks · ✅ done

Six hours discharges six promises: the hero subtitle, the Focus Timer card, the
Mindful Breaks card, the pomodoro-rhythm benefit, How It Works step 3, and the
25-minute persona claim. Nothing else in this plan comes close to that ratio.

- `src/features/pomodoro/constants/breakPrompts.ts` — 12 prompts as
  `{ id, minutes, category }`, data only; every string lives in
  `focus.break.prompts.<id>`. `id` is a **literal union**, not `string`, so a
  prompt added without its copy is a build error rather than a blank break
  screen — the convention `docs/features/i18n.md` sets for data-driven lists.
- `src/features/pomodoro/lib/breaks.ts` _(new)_ — the break clock, pure.
- `src/features/pomodoro/components/BreakScreen.tsx` _(new)_ — the whole surface
  for five minutes: the win, one prompt, a clock, one way back.
- `usePomodoro.ts` — the break is a state, and `finished` is gone with it.
- `useMood.ts` — `useTodayEnergyState()`, which tells "still loading" from
  "never checked in". The simpler hooks cannot, and a prompt picked from the
  unknown-energy pool and swapped a tick later changes the suggestion under
  someone already following it.

**A break is not a row.** It is the five minutes after a completed session's
`endTime`, so its clock is a subtraction over a date already on disk —
reload-safe for the same reason the session clock is, with no table, no row and
no migration. The one thing a clock cannot say is that a break is _over_, so
`breakEndedAt` records that and nothing else. Skipping sticks across a reload;
without it, leaving a break early and reloading dropped you back into it.

Three decisions worth keeping:

- **Only a completed session earns a break.** An abandoned one ended early and
  has nothing to recover from.
- **No break is owed hours later.** A session that finished while the tab was
  closed still credits its block, but its break is long gone — coming back to a
  rest counting down for work finished before lunch is the clock inventing a
  state nobody was in.
- **Energy chooses the prompt** (low → breathe/rest, high → stretch/move), which
  is the second place the mood check-in pays for itself after task ranking.
  Unknown energy means unknown: the whole pool stays eligible rather than
  defaulting to low and offering a brisk walk to someone who never checked in.

Found while building it: the session clock could read **25:01** on a 25-minute
block. `now` is captured before the row is stamped, and the display rounds up,
so being one millisecond early added a second. `remainingMs` is now capped at
the session's own length — which also covers a second tab or a corrected system
clock, not just this one path.

**Done:** finish a session → break screen with a prompt → countdown →
"Back to focus" returns with block 2 queued.

### M6 — Progress: streaks + day's end · ✅ done

- `src/features/progress/lib/streak.ts` _(new)_ — `currentStreak(days)`; a day
  counts if ≥1 focus session completed **or** the frog was completed. **Pure, no
  DB** — the most gap-resistant thing in the plan.
- `src/features/progress/lib/streak.test.ts` _(new)_ — boundaries, gaps, timezones.
- `src/features/progress/hooks/useProgress.ts` _(new)_ — live queries over
  `db.pomodoros` plus completed tasks.
- `src/lib/db/indexedDB.ts` — **Dexie v5** (not v3; v3 was `plannedFor` and v4
  the one-frog repair): `reflections: "++id, date"`, keyed on local midnight so
  a note typed at 23:50 belongs to that evening. A blank note deletes the row —
  an empty box is not a blank reflection, it is no reflection. Also
  `getEatenFrogs` and `getAllCompleted`, both filtered rather than queried
  because booleans are not valid IndexedDB keys.
- `analytics/page.tsx` — replace `<h1>Analytics</h1>` with the Progress page:
  streak, this week's completed frogs, focus blocks today, and one
  "what went well today?" field.
- `Sidebar.tsx` — relabel the nav item (`getCurrentSection` already handles
  `/analytics`). `FrogsSummary.tsx` — replace `<div>Hello Frogs</div>`. Uncomment
  its `DashboardPanel` row.

**The rule worth keeping:** a day that has not finished cannot have been
missed. With yesterday counted and today still empty the streak stands, and the
page says _"Today is still open"_ rather than leaving a number to be read as a
warning. Counting strictly back from today would show `0` over breakfast after
twelve honest days — discouraging, and not true yet.

Everything is derived from stored rows on each render. No counter accumulates,
so none can drift, and a row written on another device later simply counts.

Two bugs found while building it, both in older code:

- `getLastCompleted` and `getRunning` resolved ties arbitrarily. Two sessions
  sharing an `endTime` to the millisecond left "most recent" to whatever order
  Dexie returned rows in — which surfaced as a _passing_ test failing once an
  unrelated test was added above it. Both tie-break on id now.
- `useTick` let a surface's **first paint** measure against the shared
  instant's last value, which is frozen whenever no one is watching the clock.
  A three-minute break rendered `03:01` for one frame. The hook now floors at
  its own mount time.

**Done:** complete a session → `/analytics` shows "1 day streak", one completed
frog, and accepts a reflection note that survives reload.

### M7 — Ship it · 8 hrs (11 with export/import) · weeks 11–13

**This is the finish line.** After this, post the link.

- ~~`src/app/offline/page.tsx`~~ — ✅ **done.** A real offline screen. It was
  already precached in `next.config.ts` and already the service worker's
  document fallback, so it had been live the whole time as
  `<div>offline page</div>`, exported from a function misnamed `LoginPage`. It
  now says the true thing — the data is in IndexedDB on the device, so almost
  everything still works — and watches the connection, so when it returns the
  page offers a way on instead of leaving the reader poking a reload button.
- ~~`src/hooks/useOnlineStatus.ts`~~ — ✅ **done.** Starts `true` and corrects
  after mount (there is no `navigator` on the server, and flashing "offline" at
  someone who isn't is the worse failure), reads the state once on mount
  because the events only fire on _changes_, and removes its listeners.
  Documented as answering a narrower question than it appears to: `onLine`
  means an interface is up, not that anything is reachable.
- ~~`TopBar.tsx` — the offline pill~~ — ✅ **done.** Deliberately quiet: muted
  ink, no red, no pulsing dot, and a tooltip that says where the work is rather
  than what has failed. Being offline is not an error in a local-first app, and
  the pill is there to explain why a _page_ might not load. `role="status"`, so
  a screen reader hears about it politely instead of not at all.

  It sits in the right-hand actions, not beside the Guest Mode pill: that block
  is `hidden md:flex`, so a connection notice placed there would have been
  missing from the device most likely to lose one. There is a test that walks
  the pill's ancestors and fails if any of them is hidden.

- `TopBar.tsx` — **delete the Bell and the Search box.** Neither is promised
  anywhere, and dead controls are the fastest way to lose a stranger's trust.
- `Sidebar.tsx` — the two bottom `IconButton`s (Sun, Settings) have no `onClick`.
  Give them destinations or remove them.
- ~~First run~~ — ✅ **done, and neither of the options here was the fix.**
  Seeding example tasks starts the relationship with a chore and a small lie;
  an inline hint on `/home/all` explains a screen that cannot teach anyway. The
  real defect was the destination: the check-in pushed to `/home/all`, a flat
  three-section list with no frog card. **It now lands on `/home/today`**,
  where the empty frog card already asks the only question that matters.
- ~~**Four aria-labels**~~ — ✅ **done, and this entry was wrong about why.**
  `Hero.tsx`, `HowItWorks.tsx`, `CtaBanner.tsx` and `ui/SignupButton.tsx` each
  carried `aria-label="Sign up for FocusPond"` over a visible "Start for free".
  Deleting them was right; the stated reason was not. They were passed to
  `<Button>`, which takes an explicit prop list and does not spread the rest, so
  **the attribute never reached the DOM** — zero occurrences in the rendered
  HTML. TypeScript did not object because JSX skips type checking on hyphenated
  attribute names, which is the trap worth remembering: a misspelled
  `aria-label` on any of our own components compiles, renders nothing, and reads
  like working code. `Button.ariaLabel` now documents it.

  The live instance was somewhere else entirely: `ui/WaitlistForm.tsx` put
  `aria-label="Submit waitlist"` on a real `<button>` whose visible text is
  "Join waitlist" — exactly the voice-control mismatch described above, on a
  control nobody had flagged. Also removed.

- ~~**`/waitlist`** — repurpose~~ — ✅ **done.** It said "be the first to
  experience FocusPond when we launch" on a site whose main button says "Start
  for free" — a contradiction on a public, indexable page, and unlinked from
  anywhere, which is how it drifted out of date unnoticed. It is now a list for
  one specific promise, accounts and backup, and says the true thing: the app
  works today and keeps everything on this device. Its copy moved into
  `marketing.json` (it was the last hardcoded English on a localised page,
  including the validation error), and the footer links it.
- ~~Mobile navigation~~ — ✅ **done.** The rail is `hidden lg:grid` and the
  bottom bar carried the five task filters, so below `lg` there was no way to
  reach Progress, Mood or a free focus session **at all**. The bottom bar now
  mirrors the rail (Tasks · Focus · Progress · Mood), and the filters moved to
  a scrollable chip row above the list, which is where a control that narrows
  what is on screen belongs.

  Both navigations and the rail now read one `sections` list and one
  `sectionFor` rule in `src/data/web-app/navigation.ts`. They each had their
  own before, which is how they came to disagree about what the app even
  contains.

- **Recommended (+3 hrs): local export/import JSON.** "Download my data" /
  "Restore from file". It answers _"what if I clear my browser?"_ with no server
  and no dishonesty, and it is what makes deferring accounts read as deliberate
  rather than unfinished.

- ~~PWA install~~ — ✅ **the two things that would have spoiled the phone
  test.** `start_url` was `/`, so tapping the home-screen icon opened the
  marketing site rather than the app; it is `/home/today` now, and precached,
  so a cold launch with no connection opens the app instead of the offline
  screen. And iOS ignores manifest icons for Add to Home Screen, so without an
  `apple-touch-icon` the installed icon was a screenshot of the page.

  **Still needs HTTPS to test.** Service workers refuse `http://192.168.x.x`,
  so a LAN address will not install — use a Vercel preview or a tunnel.

**Done:** on a phone that has never opened it — install to home screen, enable
airplane mode, check in, pick a frog, run a session, take a break, see the streak.
Every visible control does something.

### M8 — Accounts + backup · 19 hrs · weeks 14–19

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

### Later refinement: group Upcoming by day — not scheduled

Build it when the flat list starts to hurt, not before.

Upcoming holds every future-dated task in one flat list, so tomorrow's work sits
directly beside something planned for January. Renaming the view in M3 stops it
_claiming_ to be this week, but the flatness is the real defect.

Things 3 solves this without a fourth list: _"at the top of Upcoming, you'll see
the next seven days listed separately, starting with tomorrow."_ Tomorrow and
15 January land under different date headings, so they never sit side by side.
A "Later" **section inside the view**, not another nav item.

What makes it worth doing here is Cultured Code's own rationale: seeing the week
laid out _"helps to prevent overloading a single day."_ Noticing that Thursday
already holds three deep-work tasks is what stops a fourth being added. FocusPond
already matches work to the energy available **today** — capacity planning across
days is that same idea extended forward, which fits this app better than it would
a generic task manager.

Premature while Upcoming holds one or two items. Revisit when it is hard to read.

### M9 — Cross-device sync · 14 hrs · weeks 20–24 · post-MVP

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

| Reached                         | Hours left          | Calendar        |
| ------------------------------- | ------------------- | --------------- |
| Core loop complete (through M5) | 29 remaining        | ~8 weeks        |
| Progress + streaks (M6)         | 37 remaining        | ~10 weeks       |
| **Shippable to strangers (M7)** | **45–48 remaining** | **~3.5 months** |
| Accounts + backup (M8)          | 64–67 remaining     | ~5 months       |
| Cross-device (M9)               | 78–81 remaining     | ~6.5 months     |

Counted from here — M0 through M2.5 are already done. Hours left include M3a
(5) and M3b (6).

That gap — 3.5 months to shippable versus 6.5 to cross-device — **is** the argument
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
4. ~~**Auto-rollover (0 hrs)** — already satisfied by the data model.~~ **Wrong —
   see M2.5.** Nothing rolls over because nothing has a date. Just know it,
   so it doesn't get built by accident.
   screen readers and voice control together.
5. **Waitlist repurpose (~1 hr)** — turns a contradictory indexable page into the
   M8 mailing list, reusing an API route that already works.
6. **The always-zero progress bar (30 min)** — currently broken on every page.
