import type { EnergyLevel } from "@/features/mood/constants/moods";

/**
 * Mindful break suggestions.
 *
 * Data only — every string lives in `focus.break.prompts.<id>` in the message
 * catalogs, the same split `src/data/landing-page/features.ts` uses. A prompt
 * here is a stable id, a suggested length and a category; the words are copy,
 * and copy gets translated.
 *
 * `minutes` is the prompt's own suggested length, not the break's. The break is
 * five minutes either way; a one-minute prompt leaves four to do nothing with,
 * which is the point of a break.
 */

export type BreakCategory = "breathe" | "rest" | "stretch" | "move";

/**
 * A literal union, not `string`, so `t(`break.prompts.${id}.title`)` is checked
 * against the English catalog at compile time — the convention
 * `docs/features/i18n.md` sets for every data-driven list. A prompt added here
 * without its copy is a build error rather than a blank break screen.
 */
export type BreakPromptId =
  | "box-breathing"
  | "long-exhale"
  | "one-breath"
  | "eyes-off-screen"
  | "window-gaze"
  | "water"
  | "do-nothing"
  | "shoulder-roll"
  | "neck-release"
  | "stand-and-reach"
  | "walk-it-out"
  | "shake-it-off";

export type BreakPrompt = {
  /** Stable key into `focus.break.prompts.<id>`. Never reorder-dependent. */
  id: BreakPromptId;
  /** Suggested length of the prompt itself, in minutes. */
  minutes: number;
  category: BreakCategory;
};

export const BREAK_PROMPTS: readonly BreakPrompt[] = [
  { id: "box-breathing", minutes: 2, category: "breathe" },
  { id: "long-exhale", minutes: 1, category: "breathe" },
  { id: "one-breath", minutes: 1, category: "breathe" },
  { id: "eyes-off-screen", minutes: 2, category: "rest" },
  { id: "window-gaze", minutes: 2, category: "rest" },
  { id: "water", minutes: 1, category: "rest" },
  { id: "do-nothing", minutes: 5, category: "rest" },
  { id: "shoulder-roll", minutes: 1, category: "stretch" },
  { id: "neck-release", minutes: 2, category: "stretch" },
  { id: "stand-and-reach", minutes: 1, category: "stretch" },
  { id: "walk-it-out", minutes: 3, category: "move" },
  { id: "shake-it-off", minutes: 1, category: "move" },
] as const;

/**
 * Which kinds of break suit which energy.
 *
 * Low energy gets breathing and rest — telling someone who has just told you
 * they are drained to go and do star jumps is the opposite of the product's
 * promise. High energy gets movement, because sitting still is the harder ask
 * when there is energy to burn. Medium gets everything.
 *
 * This is the second place the mood check-in pays for itself: the same
 * `energyLevel` that ranks tasks also chooses how you rest.
 */
export const BREAK_CATEGORIES_FOR_ENERGY: Record<
  EnergyLevel,
  readonly BreakCategory[]
> = {
  low: ["breathe", "rest"],
  medium: ["breathe", "rest", "stretch", "move"],
  high: ["stretch", "move"],
} as const;
