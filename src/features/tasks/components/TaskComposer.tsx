"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import type { EnergyLevel } from "@/features/mood/constants/moods";
import { addTask, updateTask } from "../hooks/useTasks";
import { plannedForView } from "../lib/planning";
import {
  ENERGY_LEVELS,
  MINUTE_PRESETS,
  energyTagKey,
  focusBlocksFor,
} from "../lib/taskDisplay";
import type { Task, TaskGroup } from "../types/task";

type TaskComposerProps = {
  /** Which list a *new* task lands in. Ignored when editing. */
  group: TaskGroup;
  /** Present means edit that task; absent means create a new one. */
  task?: Task;
  /** Called after a successful save, and when the reader dismisses the row. */
  onDone: () => void;
};

/**
 * Inline composer for both creating and editing, deliberately not a modal —
 * adding a task should cost one keystroke and no context switch, and fixing a
 * typo should cost less than that. Enter saves, Escape dismisses.
 *
 * One component for both modes on purpose. Editing needs exactly the fields
 * creating collects, so a separate edit form would be a second place to keep
 * the controls, the keyboard handling and the validation in sync — and they
 * would drift.
 *
 * For a new task, energy and estimate default to the middle option, so the fast
 * path stays "type a title, press Enter".
 */
export default function TaskComposer({
  group,
  task,
  onDone,
}: TaskComposerProps) {
  const t = useTranslations("tasks");
  const isEditing = task !== undefined;

  const [title, setTitle] = useState(task?.title ?? "");
  const [energy, setEnergy] = useState<EnergyLevel>(
    task?.energyRequired ?? "medium"
  );
  const [minutes, setMinutes] = useState<number>(task?.estimatedMinutes ?? 25);
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && !saving;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    setSaving(true);
    try {
      if (isEditing && task.id !== undefined) {
        /**
         * Only the three fields this form owns. `createdAt`, `completed`,
         * `completedAt`, `focusBlocksDone`, `isFrog` and `plannedFor` all
         * survive untouched — editing a title must not silently un-frog a task,
         * reset the focus blocks already worked, or move it to another day.
         *
         * `focusBlocks` is derived, so it has to be recomputed here or a task
         * edited from 50 to 15 minutes would keep claiming two blocks.
         */
        await updateTask(task.id, {
          title: title.trim(),
          energyRequired: energy,
          estimatedMinutes: minutes,
          focusBlocks: focusBlocksFor(minutes),
        });
      } else {
        await addTask({
          title: title.trim(),
          // The view the reader is adding into becomes a date; which list it
          // then appears in is derived from that date, not stored.
          plannedFor: plannedForView(group),
          energyRequired: energy,
          estimatedMinutes: minutes,
        });
      }
      onDone();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          onDone();
        }
      }}
      className="-mx-2.5 rounded-lg border border-line-strong bg-surface-raised px-2.5 py-2.5 shadow-e1"
    >
      <input
        // The row only ever mounts from an explicit Add or Edit, so taking
        // focus is what the reader just asked for.
        autoFocus
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder={t("add.placeholder")}
        aria-label={t("add.placeholder")}
        className="w-full bg-transparent px-1 font-manrope text-sm text-ink placeholder:text-ink-subtle focus:outline-none"
      />

      <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 px-1">
        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">{t("add.energyLabel")}</legend>
          {ENERGY_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setEnergy(level)}
              aria-pressed={energy === level}
              className={`cursor-pointer rounded-md px-2 py-1 font-sora text-[10.5px] font-semibold tracking-[0.04em] uppercase transition-colors ${
                energy === level
                  ? "bg-ambient-soft text-ink"
                  : "text-ink-subtle hover:bg-ambient-soft/60 hover:text-ink-muted"
              }`}
            >
              {t(energyTagKey(level))}
            </button>
          ))}
        </fieldset>

        <fieldset className="flex items-center gap-1">
          <legend className="sr-only">{t("add.minutes")}</legend>
          {MINUTE_PRESETS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setMinutes(preset)}
              aria-pressed={minutes === preset}
              className={`cursor-pointer rounded-md px-2 py-1 font-sora text-[11px] font-semibold tabular-nums transition-colors ${
                minutes === preset
                  ? "bg-ambient-soft text-ink"
                  : "text-ink-subtle hover:bg-ambient-soft/60 hover:text-ink-muted"
              }`}
            >
              {preset}m
            </button>
          ))}
        </fieldset>

        <div className="ml-auto flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onDone}
          >
            {t("add.cancel")}
          </Button>
          <Button
            type="submit"
            size="xs"
            disabled={!canSave}
          >
            {isEditing ? t("add.update") : t("add.save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
