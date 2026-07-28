"use client";

import { useTranslations } from "next-intl";
import { Flame, Play, Shuffle, Timer } from "lucide-react";
import Button from "@/components/ui/Button";
import type { Frog } from "../types/task";

type FrogOfTheDayProps = {
  frog?: Frog | null;
  onStart?: () => void;
  onSwap?: () => void;
  onChoose?: () => void;
};

/**
 * The hero surface on /home/today.
 *
 * This is the single biggest lever against "it looks like a todo app": the
 * Frog is the product's whole premise, and before this it was — at best — a row
 * in a list. It gets display type, real elevation, and the pond motif, so the
 * eye lands here first and the rest of the page reads as secondary.
 *
 * The ripple sits in its own absolutely-positioned layer rather than on the
 * section itself, so it composes with the surface fill instead of replacing it.
 */
export default function FrogOfTheDay({
  frog,
  onStart,
  onSwap,
  onChoose,
}: FrogOfTheDayProps) {
  const t = useTranslations("tasks.frog");

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
          {t("eyebrow")}
        </p>

        {frog ? (
          <>
            <h2
              id="frog-heading"
              className="max-w-[22ch] font-sora text-2xl leading-tight font-semibold tracking-[-0.026em] text-ink md:text-[1.75rem]"
            >
              {frog.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-muted">
              {frog.focusBlocks ? (
                <span className="inline-flex items-center gap-1.5">
                  <Timer
                    className="size-3.5"
                    aria-hidden
                  />
                  {t("blocks", { count: frog.focusBlocks })}
                  {frog.estimateMinutes
                    ? ` · ${t("estimate", { minutes: frog.estimateMinutes })}`
                    : ""}
                </span>
              ) : null}

              {frog.energyMatch !== undefined && (
                <span
                  className={
                    frog.energyMatch
                      ? "inline-flex items-center gap-1.5 text-ambient"
                      : "inline-flex items-center gap-1.5 text-warning"
                  }
                >
                  <Flame
                    className="size-3.5"
                    aria-hidden
                  />
                  {frog.energyMatch ? t("energyMatch") : t("energyMismatch")}
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
        ) : (
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
        )}
      </div>
    </section>
  );
}
