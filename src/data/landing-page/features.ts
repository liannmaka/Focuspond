import {
  Calendar,
  Timer,
  FileText,
  RefreshCcw,
  HeartPulse,
  Award,
  Coffee,
  BookOpen,
} from "lucide-react";
import { Feature } from "@/types/landing-page";

export const features: Feature[] = [
  {
    Icon: Calendar,
    iconColor: "text-[#ff9472]",
    title: "Daily Planner",
    description:
      "Organize your day with simple checklists and auto-roll unfinished tasks.",
  },
  {
    Icon: Timer,
    iconColor: "text-[#a8c686]",
    title: "Focus Timer",
    description:
      "Break work into Pomodoro sessions with mindful breaks to maintain energy.",
  },
  {
    Icon: FileText,
    iconColor: "text-yellow-500",
    title: "Quick Notes",
    description:
      "Jot down thoughts instantly to clear your mind, without leaving the app.",
  },
  {
    Icon: RefreshCcw,
    iconColor: "text-[#8b5e3c]",
    title: "Vibe Switcher",
    description:
      "Toggle app tone between Formal and Pidgin to match your mood.",
  },
  {
    Icon: HeartPulse,
    iconColor: "text-[#ff9472]",
    title: "Mood Check-In",
    description:
      "Reflect on your feelings with quick emoji or phrase check-ins.",
  },
  {
    Icon: Award,
    iconColor: "text-[#a8c686]",
    title: "Frog Selection",
    description:
      "Pick your most important task of the day, your ‘Frog’ and tackle it first.",
  },
  {
    Icon: Coffee,
    iconColor: "text-yellow-500",
    title: "Mindful Breaks",
    description:
      "Get gentle prompts during breaks to stretch, breathe, or hydrate.",
  },
  {
    Icon: BookOpen,
    iconColor: "text-[#8b5e3c]",
    title: "End-of-Day Reflection",
    description: "Review your wins and insights to wrap up your day calmly.",
  },
];
