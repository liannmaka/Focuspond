"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { moodDB } from "@/lib/db/indexedDB";
import type { EnergyLevel } from "@/features/mood/constants/moods";
import type { MoodEntry } from "@/features/mood/types/mood";

/**
 * Today's mood, read back live.
 *
 * This is the seam the product's whole premise runs through: the check-in at
 * `/mood` has always written to IndexedDB, but nothing ever read it, so
 * "mood-aware productivity" was a dead write. Everything the tasks feature knows
 * about how the reader feels arrives through here.
 *
 * Like the task hooks, these return `undefined` on first render (the query has
 * not resolved) and re-run on any write to the moods table, including from
 * another tab.
 */

/** The day's first check-in, or `undefined` if they haven't checked in today. */
export function useTodayMood(): MoodEntry | undefined {
  return useLiveQuery(() => moodDB.getToday(), []);
}

/**
 * Today's energy, or `undefined` when no mood is recorded.
 *
 * `undefined` means "don't know", never "low" — callers must treat the two
 * differently. Guessing low would quietly hide every demanding task from
 * someone who simply hasn't checked in yet.
 */
export function useTodayEnergy(): EnergyLevel | undefined {
  return useTodayMood()?.energyLevel;
}
