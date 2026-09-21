import type { MoodLevel, EnergyLevel } from "@/features/mood/constants/moods";

/**
 * One mood check-in. Stored in the Dexie `moods` table.
 *
 * `energyLevel` is what the rest of the app actually consumes — it is the
 * single value that reaches the tasks feature, via `useTodayEnergy()`.
 */
export interface MoodEntry {
  id?: number;
  level: MoodLevel;
  label: string;
  /** Free-form context, e.g. 'user_skipped', 'onboarding_flow'. */
  note?: string;
  energyLevel: EnergyLevel;
  createdAt?: Date;
  /** False = still needs to reach the backend. See docs/features/sync.md. */
  synced?: boolean;
}
