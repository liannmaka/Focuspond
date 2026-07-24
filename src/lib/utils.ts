import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export type DayPeriod = "morning" | "afternoon" | "evening" | "night";

/**
 * Returns the current day period as a translation-friendly key. The
 * user-facing question is built in the component via the `mood` message
 * catalog (`t("question", { period })`) so it localizes with the chosen vibe.
 */
export const getTimeBasedGreeting = (): DayPeriod => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  } else if (hour >= 12 && hour < 17) {
    return "afternoon";
  } else if (hour >= 17 && hour < 22) {
    return "evening";
  } else {
    return "night"; // 10pm - 5am
  }
};
