"use client";

import { useTranslations } from "next-intl";
import { Check, Flame, Play, Shuffle, Timer } from "lucide-react";
import Button from "@/components/ui/Button";
import type { FrogState } from "../lib/taskDisplay";
import type { Frog } from "../types/task";

type FrogOfTheDayProps = {
  state: FrogState<Frog>;
  /**
   * True while the day's tasks are still being read.
   *
   * Without it the card had the same flaw the list did: an unresolved query
   * reaches `frogState` as an empty array, which is indistinguishable from a
   * day with nothing in it — so the hero surface of the app opened by asking
   * you to pick a frog you had already picked.
   */
  loading?: boolean;
  /**
   * `mm:ss` when a session is already running on *this* frog.
   *
   * Without it the card offered "Start focus" while that very session counted
   * down on another screen — not merely silent about it, but saying something
   * untrue. The same family as the frog bugs: one fact, and surfaces that do
   * not know it.
   */
  runningTime?: string;
  onStart?: () => void;
  onSwap?: () => void;
  onChoose?: () => void;
  /** Turns the current suggestion into an actual pick. */
  onAccept?: () => void;
};

/**
 * The hero surface on /home/today.
 *
 * This is the single biggest lever against "it looks like a todo app": the
 * Frog is the product's whole premise, and before this it was — at best — a row
 * in a list. It gets display type, real elevation, and the pond motif, so the
 * eye lands here first and the rest of the page reads as secondary.
 *
 * Four states, deliberately distinct. The card previously rendered a *suggested*
 * task identically to a *chosen* one, which made a guess look like a decision —
 * and after the frog was completed, quietly promoted the next-ranked task as
 * though the reader had picked it.
 *
 * The ripple sits in its own absolutely-positioned layer rather than on the
 * section itself, so it composes with the surface fill instead of replacing it.
 */
export default function FrogOfTheDay({
  state,
  loading = false,
  runningTime,
  onStart,
  onSwap,
  onChoose,
  onAccept,
}: FrogOfTheDayProps) {
  const t = useTranslations("tasks.frog");

  const eyebrow =
    state.kind === "eaten"
      ? t("eatenEyebrow")
      : state.kind === "suggested"
        ? t("suggestedEyebrow")
        : t("eyebrow");

  if (loading) {
    return (
      <section
        aria-busy
        aria-label={t("eyebrow")}
        className="relative overflow-hidden rounded-xl border border-line bg-surface-raised p-6 shadow-e2 md:p-8"
      >
        <div
          className="ripple-field pointer-events-none absolute inset-0"
          aria-hidden
        />
        {/*
          The same height the card will be, so the page below it does not jump
          when the answer arrives. Quiet bars rather than a spinner: this is the
          first thing on the screen, and a spinner on the hero surface of a calm
          app reads as something going wrong.
        */}
        <div
          className="relative flex flex-col gap-4"
          aria-hidden
        >
          <span className="h-2.5 w-28 animate-pulse rounded bg-ambient-soft" />
          <span className="h-7 w-2/3 animate-pulse rounded bg-ambient-soft md:h-8" />
          <span className="h-3.5 w-40 animate-pulse rounded bg-ambient-soft" />
          <span className="mt-2 h-9 w-56 animate-pulse rounded-lg bg-ambient-soft" />
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="frog-heading"
      className="relative overflow-hidden rounded-xl border border-line bg-surface-raised p-6 shadow-e2 md:p-8"
    >
      <div
        className="ripple-field pointer-events-none absolute inset-0"
        aria-hidden
      />

      <div className="relative">
        <p className="mb-3 flex items-center gap-2 font-sora text-[10px] font-bold tracking-[0.13em] text-accent-text uppercase">
          <span
            className="h-px w-3.5 bg-accent-text"
            aria-hidden
          />
          {eyebrow}
        </p>

        {state.kind === "none" ? (
          <>
            <h2
              id="frog-heading"
              className="max-w-[18ch] font-sora text-2xl leading-tight font-semibold tracking-[-0.026em] text-ink md:text-[1.75rem]"
            >
              {t("empty.title")}
            </h2>
            <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
              {t("empty.body")}
            </p>
            <div className="mt-6">
              <Button
                size="sm"
                onClick={onChoose}
              >
                {t("empty.action")}
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2
              id="frog-heading"
              className={`max-w-[22ch] font-sora text-2xl leading-tight font-semibold tracking-[-0.026em] md:text-[1.75rem] ${
                state.kind === "eaten"
                  ? "text-ink-subtle line-through"
                  : "text-ink"
              }`}
            >
              {state.frog.title}
            </h2>

            {state.kind === "eaten" ? (
              <>
                <p className="mt-3 flex items-center gap-2 text-sm text-ink-muted">
                  <Check
                    className="size-4 shrink-0 text-success"
                    aria-hidden
                  />
                  {t("eatenBody")}
                </p>

                {/*
                  Terminal on purpose — no actions at all.
                  One frog per day is the method, not a limit to work around, so
                  there is no second frog to offer: calling a later pick "Frog
                  of the day" would claim it was the task that made today count,
                  when that task is already done and crossed out above.
                  Swapping freely *before* finishing is supported — see the
                  "chosen" branch. The undo for a mistaken completion is
                  unchecking it in the list, which restores this card.
                  And nothing is blocked: the task list below never needed a
                  badge to work from.
                */}
              </>
            ) : (
              <>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
                  {state.frog.focusBlocks ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Timer
                        className="size-3.5"
                        aria-hidden
                      />
                      {t("blocks", { count: state.frog.focusBlocks })}
                      {state.frog.estimatedMinutes
                        ? ` · ${t("estimate", { minutes: state.frog.estimatedMinutes })}`
                        : ""}
                    </span>
                  ) : null}

                  {state.frog.energyMatch !== undefined && (
                    <span
                      className={
                        state.frog.energyMatch
                          ? "inline-flex items-center gap-1.5 text-ambient"
                          : "inline-flex items-center gap-1.5 text-warning"
                      }
                    >
                      <Flame
                        className="size-3.5"
                        aria-hidden
                      />
                      {state.frog.energyMatch
                        ? t("energyMatch")
                        : t("energyMismatch")}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  {/* A suggestion has to be accepted before it is yours. */}
                  {state.kind === "suggested" ? (
                    <Button
                      size="sm"
                      onClick={onAccept}
                      leftIcon={
                        <Flame
                          className="size-3.5"
                          aria-hidden
                        />
                      }
                    >
                      {t("accept")}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      onClick={onStart}
                      // Tabular figures: the label carries a clock, and
                      // proportional digits are different widths, so the button
                      // resized every second and shoved "Pick another" sideways
                      // with it. `formatRemaining` already pads to mm:ss, so
                      // with equal-width digits the label cannot change width.
                      className="tabular-nums"
                      leftIcon={
                        <Play
                          className="size-3.5 fill-current"
                          aria-hidden
                        />
                      }
                    >
                      {runningTime
                        ? t("resume", { time: runningTime })
                        : t("start")}
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onSwap}
                    leftIcon={
                      <Shuffle
                        className="size-3.5"
                        aria-hidden
                      />
                    }
                  >
                    {t("swap")}
                  </Button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
