"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import Button from "@/components/ui/Button";
import type { EnergyLevel } from "@/features/mood/constants/moods";
import { addTask } from "../hooks/useTasks";
import {
  ENERGY_LEVELS,
  MINUTE_PRESETS,
  energyTagKey,
} from "../lib/taskDisplay";
import type { TaskGroup } from "../types/task";

type AddTaskRowProps = {
  group: TaskGroup;
  /** Called after a successful save, and when the reader dismisses the row. */
  onDone: () => void;
};

/**
 * Inline composer, deliberately not a modal — adding a task should cost one
 * keystroke and no context switch. Enter saves, Escape dismisses.
 *
 * The energy and estimate default to the middle option, so the fast path is
 * "type a title, press Enter" and the controls are there only when the reader
 * wants them.
 */
export default function AddTaskRow({ group, onDone }: AddTaskRowProps) {
  const t = useTranslations("tasks");
  const [title, setTitle] = useState("");
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [minutes, setMinutes] = useState<number>(25);
  const [saving, setSaving] = useState(false);

  const canSave = title.trim().length > 0 && !saving;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSave) return;

    setSaving(true);
    try {
      await addTask({
        title: title.trim(),
        group,
        energyRequired: energy,
        estimatedMinutes: minutes,
      });
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
        // The row only ever mounts in response to an explicit "Add task", so
        // taking focus is what the reader just asked for.
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
            {t("add.save")}
          </Button>
        </div>
      </div>
    </form>
  );
}
