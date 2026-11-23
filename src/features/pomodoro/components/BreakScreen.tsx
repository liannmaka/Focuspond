"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";

import Button from "@/components/ui/Button";
import { useTodayEnergyState } from "@/features/mood/hooks/useMood";
import { promptFor } from "../lib/breaks";
import type { PomodoroSession } from "../types/pomodoro";

/**
 * The five minutes after a finished session.
 *
 * It reports the win and then gets out of the way: one suggestion, a clock, and
 * one button back. The suggestion is chosen by today's energy — the second
 * place the mood check-in pays for itself, after task ranking — because telling
 * someone who has just said they are drained to go for a brisk walk is the
 * opposite of what this product promises.
 *
 * Nothing here is required. A break you have to *complete* is another task, so
 * "Back to focus" is always available and the prompt is phrased as an offer.
 */
export default function BreakScreen({
  session,
  display,
  taskTitle,
  onBackToFocus,
}: {
  session: PomodoroSession;
  /** `mm:ss` of break left, already formatted. */
  display: string;
  /** Omitted for a free session, which has no task to name. */
  taskTitle?: string;
  onBackToFocus: () => void;
}) {
  const t = useTranslations("focus");
  const energy = useTodayEnergyState();

  // Waiting for the mood query rather than guessing: picking from the
  // unknown-energy pool and swapping a tick later would change the suggestion
  // under someone already following it.
  const prompt =
    energy.status === "loading"
      ? undefined
      : promptFor(
          session,
          energy.status === "known" ? energy.energy : undefined
        );

  return (
    <>
      <p className="mb-3 flex items-center gap-2 font-sora text-[10px] font-bold tracking-[0.13em] text-ambient uppercase">
        <span
          className="h-px w-3.5 bg-ambient"
          aria-hidden
        />
        {t("break.eyebrow")}
      </p>

      <h1 className="flex items-center gap-2.5 font-sora text-2xl leading-tight font-semibold tracking-[-0.026em] text-ink md:text-[1.75rem]">
        <Check
          className="size-5 shrink-0 text-success"
          aria-hidden
        />
        {t("break.done")}
      </h1>
      <p className="mt-2.5 text-sm text-ink-muted">
        {t("break.credited")}
        {taskTitle ? ` ${t("break.task", { title: taskTitle })}` : ""}
      </p>

      <div className="mt-7 rounded-xl border border-line bg-surface-sunken p-5">
        {prompt ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="font-sora text-base font-semibold tracking-[-0.01em] text-ink">
                {t(`break.prompts.${prompt.id}.title`)}
              </h2>
              <span className="font-sora text-[11px] font-semibold text-ink-subtle tabular-nums">
                {t("break.suggested", { minutes: prompt.minutes })}
              </span>
            </div>
            <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-ink-muted">
              {t(`break.prompts.${prompt.id}.body`)}
            </p>
          </>
        ) : (
          <div
            className="h-16 animate-pulse rounded-lg bg-ambient-soft"
            aria-hidden
          />
        )}
      </div>

      <div className="mt-7">
        <p className="font-sora text-[10px] font-bold tracking-[0.13em] text-ink-subtle uppercase">
          {t("break.label")}
        </p>
        <p
          // A clock that announces itself every second is unusable with a
          // screen reader, so the live region is off and the element is
          // labelled as a timer instead.
          role="timer"
          aria-live="off"
          className="mt-1 font-sora text-4xl leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums"
        >
          {display}
        </p>
      </div>

      <div className="mt-7">
        <Button
          size="sm"
          variant="outline"
          onClick={onBackToFocus}
          rightIcon={
            <ArrowRight
              className="size-3.5"
              aria-hidden
            />
          }
        >
          {t("break.action")}
        </Button>
      </div>
    </>
  );
}
