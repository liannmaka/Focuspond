"use client";

import { useTranslations } from "next-intl";
import { Check, Flame, Play, Shuffle, Timer } from "lucide-react";
import Button from "@/components/ui/Button";
import type { FrogState } from "../lib/taskDisplay";
import type { Frog } from "../types/task";

type FrogOfTheDayProps = {
  state: FrogState<Frog>;
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
                      leftIcon={
                        <Play
                          className="size-3.5 fill-current"
                          aria-hidden
                        />
                      }
                    >
                      {t("start")}
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
