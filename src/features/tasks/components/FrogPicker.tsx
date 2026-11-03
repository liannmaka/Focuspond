"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Check, Flame, Timer, X } from "lucide-react";

import Button from "@/components/ui/Button";
import type { EnergyLevel } from "@/features/mood/constants/moods";
import { setFrog } from "../hooks/useTasks";
import { energyFits, energyTagKey, rankCandidates } from "../lib/taskDisplay";
import type { Task } from "../types/task";

type FrogPickerProps = {
  open: boolean;
  tasks: Task[];
  /** Today's energy, or undefined when there has been no check-in. */
  energy?: EnergyLevel;
  onClose: () => void;
};

/**
 * Choosing today's frog.
 *
 * One component serves both entry points — "Choose your frog" from the empty
 * card and "Pick another" from a card that already has one. They are the same
 * question asked twice, so they get the same answer surface.
 *
 * Order comes from `rankCandidates`: work that fits today's energy first, then
 * shortest on a tired day or heaviest on a good one, oldest as the tiebreak.
 * The ordering is a *suggestion* — every task stays pickable, because the point
 * is to help the reader decide, not to decide for them.
 */
export default function FrogPicker({
  open,
  tasks,
  energy,
  onClose,
}: FrogPickerProps) {
  const t = useTranslations("tasks");
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes, and focus moves into the sheet so a keyboard reader is not
  // left behind on the button that opened it.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const ranked = rankCandidates(tasks, energy);

  async function choose(id: number | undefined) {
    if (id === undefined) return;
    await setFrog(id);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/20 p-0 sm:items-center sm:p-6"
      // A click on the backdrop is a dismissal; one inside the sheet is not.
      onClick={(event) => {
        if (!panelRef.current?.contains(event.target as Node)) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="frog-picker-heading"
        className="max-h-[80vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-line bg-surface-raised p-5 shadow-e3 sm:rounded-2xl"
      >
        <div className="mb-1 flex items-start justify-between gap-4">
          <h2
            id="frog-picker-heading"
            className="font-sora text-lg font-semibold text-ink"
          >
            {t("frog.picker.heading")}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={t("frog.picker.close")}
            className="-mt-1 -mr-1 flex size-8 cursor-pointer items-center justify-center rounded-lg text-ink-subtle transition-colors hover:bg-ambient-soft hover:text-ink"
          >
            <X
              className="size-4"
              aria-hidden
            />
          </button>
        </div>

        <p className="mb-4 text-sm text-ink-muted">
          {energy ? t("frog.picker.ranked") : t("frog.picker.noMood")}
        </p>

        {ranked.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-subtle">
            {t("frog.picker.empty")}
          </p>
        ) : (
          <ul className="space-y-1">
            {ranked.map((task) => {
              const fits = energy
                ? energyFits(task.energyRequired, energy)
                : undefined;

              return (
                <li key={task.id}>
                  <button
                    type="button"
                    onClick={() => choose(task.id)}
                    className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-line hover:bg-ambient-soft"
                  >
                    <span className="flex-1 text-sm text-ink">
                      {task.title}
                      {task.isFrog && (
                        <span className="ml-2 inline-flex items-center gap-1 font-sora text-[10px] font-semibold text-accent-text uppercase">
                          <Check
                            className="size-3"
                            aria-hidden
                          />
                          {t("frog.picker.current")}
                        </span>
                      )}
                    </span>

                    {/* Only shown when a mood exists — with no check-in there
                        is no verdict to give, and guessing would be worse than
                        saying nothing. */}
                    {fits !== undefined && (
                      <span
                        className={
                          fits
                            ? "inline-flex items-center gap-1 text-ambient"
                            : "inline-flex items-center gap-1 text-ink-subtle"
                        }
                        title={
                          fits
                            ? t("frog.energyMatch")
                            : t("frog.energyMismatch")
                        }
                      >
                        <Flame
                          className="size-3.5"
                          aria-hidden
                        />
                        <span className="sr-only">
                          {fits
                            ? t("frog.energyMatch")
                            : t("frog.energyMismatch")}
                        </span>
                      </span>
                    )}

                    <span className="hidden font-sora text-[10.5px] font-semibold tracking-[0.04em] text-ink-subtle uppercase sm:inline">
                      {t(energyTagKey(task.energyRequired))}
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs tabular-nums text-ink-subtle">
                      <Timer
                        className="size-3"
                        aria-hidden
                      />
                      {task.estimatedMinutes}m
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            {t("add.cancel")}
          </Button>
        </div>
      </div>
    </div>
  );
}
