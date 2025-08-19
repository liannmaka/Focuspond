import { Calendar, Timer, HeartPulse, BookOpen } from "lucide-react";
import { HowItWork } from "@/types/landing-page";

export const steps: HowItWork[] = [
  {
    Icon: HeartPulse,
    title: "1.  Check Your Mood",
    description: "Log how you feel to stay aware of your energy.",
  },
  {
    Icon: Calendar,
    title: "2.  Plan Your Day",
    description: "Pick your Frog of the Day to focus on what matters most.",
  },
  {
    Icon: Timer,
    title: "3.  Start a Sprint",
    description: "Use the Pomodoro timer to work deeply and rest mindfully.",
  },
  {
    Icon: BookOpen,
    title: "4.  Reflect & Grow",
    description: "Review your wins and lessons to reset for tomorrow.",
  },
];
