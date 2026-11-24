/**
 * One day's reflection. Stored in the Dexie `reflections` table.
 *
 * This is the downscoped End-of-Day Reflection: one field, not a ritual flow
 * (see docs/roadmap.md). The marketing promise is "end your day calmly by
 * noting your wins and insights" — a text box honours that; a multi-step
 * wizard would be a second product.
 *
 * `date` is **local midnight** of the day it belongs to, which makes it the
 * natural key: one reflection per day, found by the day rather than by
 * scanning timestamps. A note typed at 23:50 belongs to that evening, which a
 * UTC-keyed date would file under tomorrow east of Greenwich.
 */
export interface Reflection {
  id?: number;
  /** Local midnight of the day this belongs to. Indexed. */
  date: Date;
  /** What went well. Trimmed; an empty note is stored as no note at all. */
  note: string;
  createdAt: Date;
  updatedAt?: Date;
  /** False = still needs to reach the backend. See docs/features/sync.md. */
  synced?: boolean;
}
