export type MoodLevel = "very-high" | "high" | "medium" | "low";

export type EnergyLevel = "high" | "medium" | "low";

/** Stable mood ids; also the translation keys under `mood.moods`. */
export type MoodId = "energized" | "good" | "okay" | "tired";

/**
 * Colours are CSS variable references, not hex — they resolve per theme from
 * the `--mood-*` tokens in src/styles/globals.css. The previous literals were
 * light-mode pastels and turned the whole /mood screen into a white slab in
 * dark mode.
 */
interface MoodColors {
  /** Saturated mood colour: borders, label, check badge, glow. */
  accent: string;
  /** Tinted fill behind the selected card and the illustration panel. */
  soft: string;
}

export interface Mood {
  id?: MoodId;
  level: MoodLevel;
  emoji?: string;
  label: string;
  description: string;
  energyLevel: EnergyLevel;
  colors: MoodColors;
  createdAt?: Date;
  animation: string;
}

export const MOODS: Mood[] = [
  {
    id: "energized",
    level: "very-high",
    emoji: "⚡",
    label: "Energized",
    description: "Feeling unstoppable",
    energyLevel: "high",
    colors: {
      accent: "var(--mood-energized)",
      soft: "var(--mood-energized-soft)",
    },
    animation: "bounce",
  },
  {
    id: "good",
    level: "high",
    emoji: "😊",
    label: "Good",
    description: "In a good flow",
    energyLevel: "high",
    colors: {
      accent: "var(--mood-good)",
      soft: "var(--mood-good-soft)",
    },
    animation: "pulse",
  },
  {
    id: "okay",
    level: "medium",
    emoji: "😐",
    label: "Okay",
    description: "Normal energy",
    energyLevel: "medium",
    colors: {
      accent: "var(--mood-okay)",
      soft: "var(--mood-okay-soft)",
    },
    animation: "okay",
  },
  {
    id: "tired",
    level: "low",
    emoji: "😔",
    label: "Tired",
    description: "Low on energy",
    energyLevel: "low",
    colors: {
      accent: "var(--mood-tired)",
      soft: "var(--mood-tired-soft)",
    },
    animation: "slow-bounce",
  },
];

// helper to get energy level from mood
export const getEnergyLevel = (moodlevel: MoodLevel): EnergyLevel => {
  const mood = MOODS.find((m) => m.level === moodlevel);
  return mood?.energyLevel || "medium";
};

/**
 * The stable mood id for a stored level, which is also the translation key
 * under `mood.moods.<id>`.
 *
 * Stored `MoodEntry.label` is the hardcoded English from `MOODS` — it is written
 * once at check-in and never re-translated. Any surface displaying a past mood
 * must resolve the label through this instead, or every locale shows English.
 */
export const moodIdForLevel = (level: MoodLevel): MoodId | undefined =>
  MOODS.find((mood) => mood.level === level)?.id;
