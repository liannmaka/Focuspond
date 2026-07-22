export type MoodLevel = "very-high" | "high" | "medium" | "low";

export type EnergyLevel = "high" | "medium" | "low";

interface MoodColors {
  light: string;
  dark: string;
  emoji: string;
}

export interface Mood {
  id?: string;
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
      light: "#FFF4E6", // Light peach (your brand)
      dark: "#FF9472", // Coral (your brand)
      emoji: "#FF9472",
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
      light: "#F0F7ED", // Light sage (expanded from your #A8C686)
      dark: "#A8C686", // Sage green (your brand)
      emoji: "#6B8E4E",
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
      light: "#F5F5F0", // Light gray (neutral)
      dark: "#B5A896", // Medium gray
      emoji: "#8B8174",
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
      light: "#F2F4F7", // Light blue (cool tone)
      dark: "#B5C4D6", // Soft blue
      emoji: "#8096AD",
    },
    animation: "slow-bounce",
  },
];

// helper to get energy level from mood
export const getEnergyLevel = (moodlevel: MoodLevel): EnergyLevel => {
  const mood = MOODS.find((m) => m.level === moodlevel);
  return mood?.energyLevel || "medium";
};
