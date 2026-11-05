"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, Check, Play, Square } from "lucide-react";

import Button from "@/components/ui/Button";
import { useTask } from "@/features/tasks/hooks/useTasks";
import { usePomodoro } from "../hooks/usePomodoro";
import {
  DEFAULT_DURATION_MINUTES,
  formatRemaining,
  MINUTE_MS,
} from "../lib/timer";

/**
 * The focus screen: one task, one clock, nothing else on it.
 *
 * Takes the raw route segment rather than a parsed id, because the segment is
 * whatever the address bar says — `free` for an untethered session, a number
 * for a task, and anything at all if someone edits the URL. Deciding what that
 * string means is this screen's job; the page above it only awaits the param.
 *
 * It deliberately does **not** start a session on mount. Auto-starting would
 * mean a reload after finishing quietly began another 25 minutes, and a shared
 * or re-opened link would start a session nobody asked for. The frog card's
 * "Start focus" brings you here; starting is one deliberate click.
 */
export default function FocusTimer({ taskId }: { taskId: string }) {
  const t = useTranslations("focus");

  const parsed = taskId === "free" ? undefined : Number(taskId);
  const id =
    parsed !== undefined && Number.isInteger(parsed) && parsed > 0
      ? parsed
      : undefined;
  // A segment that is neither "free" nor a usable id points at nothing.
  const unusable = taskId !== "free" && id === undefined;

  const task = useTask(id);
  const { state, start, abandon } = usePomodoro(id);

  // `task === null` only means "not here" when an id was actually asked for —
  // a free session has no task to find, and `useTask(undefined)` answers null.
  if (unusable || (id !== undefined && task === null)) {
    return (
      <Shell>
        <h1 className="font-sora text-2xl font-semibold tracking-[-0.02em] text-ink">
          {t("missing.title")}
        </h1>
        <p className="mt-3 max-w-[48ch] text-sm leading-relaxed text-ink-muted">
          {t("missing.body")}
        </p>
        <BackLink label={t("back")} />
      </Shell>
    );
  }

  const title = id === undefined ? t("freeTitle") : (task?.title ?? "");

  return (
    <Shell>
      <p className="mb-3 flex items-center gap-2 font-sora text-[10px] font-bold tracking-[0.13em] text-accent-text uppercase">
        <span
          className="h-px w-3.5 bg-accent-text"
          aria-hidden
        />
        {t("eyebrow")}
      </p>

      <h1 className="max-w-[22ch] font-sora text-2xl leading-tight font-semibold tracking-[-0.026em] text-ink md:text-[1.75rem]">
        {title}
      </h1>

      {task && task.focusBlocks > 0 && (
        <p className="mt-2.5 text-sm text-ink-muted">
          {t("blocks", {
            done: task.focusBlocksDone ?? 0,
            total: task.focusBlocks,
          })}
        </p>
      )}

      <div className="mt-8">
        {state.kind === "loading" && (
          <div
            className="h-20 w-48 animate-pulse rounded-xl bg-ambient-soft"
            aria-hidden
          />
        )}

        {state.kind === "idle" && (
          <>
            <p className="max-w-[46ch] text-sm leading-relaxed text-ink-muted">
              {t("idle.body", { minutes: DEFAULT_DURATION_MINUTES })}
            </p>
            <div className="mt-6">
              <Button
                size="sm"
                onClick={() => void start()}
                leftIcon={
                  <Play
                    className="size-3.5 fill-current"
                    aria-hidden
                  />
                }
              >
                {t("idle.action", { minutes: DEFAULT_DURATION_MINUTES })}
              </Button>
            </div>
          </>
        )}

        {state.kind === "running" && (
          <>
            <p className="font-sora text-[10px] font-bold tracking-[0.13em] text-ink-subtle uppercase">
              {t("running.label")}
            </p>
            <p
              // A clock that announces itself every second is unusable with a
              // screen reader, so the live region is off and the element is
              // labelled as a timer instead.
              role="timer"
              aria-live="off"
              className="mt-1 font-sora text-6xl leading-none font-semibold tracking-[-0.03em] text-ink tabular-nums md:text-7xl"
            >
              {state.display}
            </p>
            <p className="mt-4 text-sm text-ink-muted">{t("running.hint")}</p>

            <div className="mt-7">
              <Button
                size="sm"
                variant="outline"
                onClick={() => void abandon()}
                leftIcon={
                  <Square
                    className="size-3.5"
                    aria-hidden
                  />
                }
              >
                {t("running.abandon")}
              </Button>
            </div>
          </>
        )}

        {state.kind === "finished" && (
          <>
            <h2 className="flex items-center gap-2.5 font-sora text-xl font-semibold tracking-[-0.02em] text-ink">
              <Check
                className="size-5 shrink-0 text-success"
                aria-hidden
              />
              {t("finished.title")}
            </h2>
            <p className="mt-2.5 text-sm text-ink-muted">
              {t("finished.body")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <Button
                size="sm"
                onClick={() => void start()}
                leftIcon={
                  <Play
                    className="size-3.5 fill-current"
                    aria-hidden
                  />
                }
              >
                {t("finished.again")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                href="/home/today"
              >
                {t("back")}
              </Button>
            </div>
          </>
        )}

        {state.kind === "busy" && (
          <>
            <h2 className="font-sora text-xl font-semibold tracking-[-0.02em] text-ink">
              {t("busy.title")}
            </h2>
            <p className="mt-2.5 max-w-[46ch] text-sm leading-relaxed text-ink-muted">
              {t("busy.body")}
            </p>
            <p className="mt-4 font-sora text-3xl font-semibold text-ink-muted tabular-nums">
              {formatRemaining(
                Math.max(
                  0,
                  state.session.startTime.getTime() +
                    state.session.duration * MINUTE_MS -
                    Date.now()
                )
              )}
            </p>

            <div className="mt-6">
              <Button
                size="sm"
                variant="outline"
                onClick={() => void abandon()}
              >
                {t("busy.abandon")}
              </Button>
            </div>
          </>
        )}
      </div>

      {state.kind !== "finished" && <BackLink label={t("back")} />}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <section className="relative overflow-hidden rounded-xl border border-line bg-surface-raised p-6 shadow-e2 md:p-8">
        <div
          className="ripple-field pointer-events-none absolute inset-0"
          aria-hidden
        />
        <div className="relative">{children}</div>
      </section>
    </div>
  );
}

function BackLink({ label }: { label: string }) {
  return (
    <div className="mt-8">
      <Button
        size="xs"
        variant="ghost"
        href="/home/today"
        leftIcon={
          <ArrowLeft
            className="size-3.5"
            aria-hidden
          />
        }
      >
        {label}
      </Button>
    </div>
  );
}
