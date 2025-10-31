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
      "Plan your day with calm clarity, unfinished tasks roll over automatically.",
  },
  {
    Icon: Timer,
    iconColor: "text-[#a8c686]",
    title: "Focus Timer",
    description:
      "Stay focused with Pomodoro sessions and mindful breaks to recharge.",
  },
  {
    Icon: FileText,
    iconColor: "text-yellow-500",
    title: "Quick Notes",
    description:
      "Capture thoughts instantly, clear your mind without losing flow.",
  },
  {
    Icon: RefreshCcw,
    iconColor: "text-[#8b5e3c]",
    title: "Vibe Switcher",
    description:
      "Switch between Formal and Pidgin tones, work the way you feel.",
  },
  {
    Icon: HeartPulse,
    iconColor: "text-[#ff9472]",
    title: "Mood Check-In",
    description: "Check in on your mood, express how you feel in seconds.",
  },
  {
    Icon: Award,
    iconColor: "text-[#a8c686]",
    title: "Frog Selection",
    description:
      "Choose your day's “Frog”, the one task that moves you forward.",
  },
  {
    Icon: Coffee,
    iconColor: "text-yellow-500",
    title: "Mindful Breaks",
    description:
      "Pause with intention, stretch, breathe, or hydrate during breaks.",
  },
  {
    Icon: BookOpen,
    iconColor: "text-[#8b5e3c]",
    title: "End-of-Day Reflection",
    description:
      "Reflect on your wins and insights, end your day feeling grounded.",
  },
];
