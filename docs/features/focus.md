# Focus sessions and breaks

The timer, the break that follows it, and the clock they share. Read this before
changing anything under `src/features/pomodoro/`.

## The one rule everything rests on

**Remaining time is derived from a stored date. Nothing counts down.**

A session row has `startTime` and `duration`; remaining time is
`startTime + duration − now`. A break has no row at all: it is the five minutes
after a completed session's `endTime`.

This is not a style preference. A decremented counter drifts whenever the tab is
backgrounded (intervals are throttled), the laptop sleeps (they stop), or the
page reloads (they are gone). A subtraction cannot drift, which is why "reload
mid-session and the clock is still right" needed no feature work.

| Thing           | Where it lives                 | How its clock is found                |
| --------------- | ------------------------------ | ------------------------------------- |
| Session         | `pomodoros` row                | `startTime + duration`                |
| Break           | no row                         | completed session's `endTime + 5 min` |
| "Break is over" | `breakEndedAt` on that session | the one fact a clock cannot state     |

`breakEndedAt` exists only because skipping a break is invisible to arithmetic —
without it, leaving a break early and reloading dropped you back into it.

## The pieces

```
store/tick.ts         one shared `now`, one interval, refcounted
hooks/useSessionClock.ts   the rows + the clock + settling what has elapsed
hooks/usePomodoro.ts       the focus screen's state machine (needs a taskId)
hooks/useRunningSession.ts read-only, task-agnostic, for the app chrome
lib/timer.ts               session arithmetic, pure, `now` as an argument
lib/breaks.ts              break arithmetic + prompt choice, same shape
```

**Why Zustand is here, and only here.** Four surfaces can show the same session
at once — the focus screen, the top bar, the frog card, a task row. With an
interval each they would hold four `now`s set milliseconds apart and read 18:42
beside 18:41. The store holds the instant and nothing else: no session, no task,
nothing durable. That all still comes from IndexedDB through `useLiveQuery`.

**Why settling lives in `useSessionClock` and not the screen.** A session that
runs out while the reader is on another page has to be closed by whatever is
watching it. When this lived in `usePomodoro`, the top bar would sit at 00:00
until someone happened to open the focus screen. Several components now settle
the same session at once, which is safe only because `complete`, `abandon` and
`endBreak` are each **once-only** in the database.

## Rules you will otherwise rediscover the hard way

- **Only a completed session earns a break.** An abandoned one ended early and
  has nothing to recover from.
- **No break is owed hours later.** A session that finished behind a closed tab
  still credits its block (`COMPLETION_GRACE_MINUTES`, 60), but its break is
  gone. A rest counting down for work finished before lunch is the clock
  inventing a state nobody was in.
- **Energy chooses the break prompt** (low → breathe/rest, high → stretch/move).
  Unknown energy means unknown: the whole pool stays eligible rather than
  defaulting to low and offering a brisk walk to someone who never checked in.
- **One session at a time**, enforced in `usePomodoro.start`, not just hidden in
  the UI.
- **The screen does not auto-start.** Arriving is not starting: otherwise a
  reload after finishing quietly begins another 25 minutes, and any shared link
  starts a session nobody asked for.

## The bug this code keeps almost having

Three times now, a clock has reported **more time than was left** — `25:01` on a
25-minute block, `15:01`, `03:01` on a three-minute break. Always the same
cause: `now` sitting a hair _before_ the instant being measured, and a display
that rounds up.

Two defences, both load-bearing:

1. `remainingMs` and `breakRemainingMs` **cap at their own length**. A
   25-minute session can never report more than 25 minutes left, whatever the
   clock does — which also covers a second tab or a corrected system clock.
2. `useTick` **floors at the subscriber's mount time**. `subscribe()` refreshes
   the shared instant, but it runs in an effect, after the first paint; without
   the floor that paint measures against whatever the store last held, which is
   frozen whenever nobody is watching the clock.

If you add a surface that shows time, it inherits both. If you compute a
duration somewhere new, assume you have met this bug and write the test for it.

## Testing notes

- The pure arithmetic (`lib/timer.ts`, `lib/breaks.ts`) takes `now` as an
  argument, so boundaries are constructed, never waited for. Prefer adding
  cases there over driving the UI.
- Component tests seed sessions with a past `startTime` and let the derived
  clock do the rest — see `BreakScreen.test.tsx`.
- Do not assert an exact second on a rendered clock. The shared tick is up to a
  second behind by design, so `/^(14:5\d|15:00)$/` is the honest assertion; an
  exact match is a flake waiting for a slow machine.
- `resetTickStore()` exists for tests: the store is module-level, so a stale
  instant survives between tests in a file.
