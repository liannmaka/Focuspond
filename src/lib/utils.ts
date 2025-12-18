import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const getTimeBasedGreeting = (): string => {
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

export const getTimeBasedQuestion = (): string => {
  const greeting = getTimeBasedGreeting();
  return `How are you feeling this ${greeting}?`;
};
