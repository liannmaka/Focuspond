import { Calendar, Timer, HeartPulse, BookOpen } from "lucide-react";
import { HowItWork } from "@/types/landing-page";

export const steps: HowItWork[] = [
  {
    Icon: HeartPulse,
    title: "1.  Check Your Mood",
    description:
      "Start your day with a quick mood check-in to tune into your energy.",
  },
  {
    Icon: Calendar,
    title: "2.  Plan Your Day",
    description:
      "Choose your Frog, your most important task and set your focus for the day.",
  },
  {
    Icon: Timer,
    title: "3.  Start a Sprint",
    description:
      "Work in calm, focused sprints with gentle breaks that recharge your mind.",
  },
  {
    Icon: BookOpen,
    title: "4.  Reflect & Grow",
    description:
      "End your day with calm reflection. Celebrate your wins and reset for tomorrow.",
  },
];
