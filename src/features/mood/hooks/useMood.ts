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

/**
 * The day's most recent check-in, or `undefined` if they haven't checked in
 * today. Checking in again replaces what every surface shows — energy changes
 * through a day, and saying so is the whole point of the control.
 */
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

/**
 * Today's energy with "still loading" told apart from "never checked in".
 *
 * `useTodayEnergy` cannot distinguish them — both are `undefined` — which is
 * fine where the answer only ranks or annotates something, and the UI can
 * simply say nothing until it knows. It is not fine where the answer *chooses*
 * what to show: picking a break prompt from the unknown-energy pool and then
 * swapping it a tick later, once the mood arrives, changes the suggestion under
 * someone who has already started following it.
 *
 * Added alongside the simpler hooks rather than changing them, so existing
 * callers keep the shape they were written against.
 */
export type EnergyState =
  | { status: "loading" }
  | { status: "unknown" }
  | { status: "known"; energy: EnergyLevel };

export function useTodayEnergyState(): EnergyState {
  const mood = useLiveQuery(async () => (await moodDB.getToday()) ?? null, []);

  if (mood === undefined) return { status: "loading" };
  if (mood === null) return { status: "unknown" };

  return { status: "known", energy: mood.energyLevel };
}
