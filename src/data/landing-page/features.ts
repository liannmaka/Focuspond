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

// Copy lives in `marketing.features.items.<key>` in the message catalogs.
export const features: Feature[] = [
  { Icon: Calendar, iconColor: "text-[#ff9472]", key: "daily-planner" },
  { Icon: Timer, iconColor: "text-[#a8c686]", key: "focus-timer" },
  { Icon: FileText, iconColor: "text-yellow-500", key: "quick-notes" },
  { Icon: RefreshCcw, iconColor: "text-[#8b5e3c]", key: "vibe-switcher" },
  { Icon: HeartPulse, iconColor: "text-[#ff9472]", key: "mood-checkin" },
  { Icon: Award, iconColor: "text-[#a8c686]", key: "frog-selection" },
  { Icon: Coffee, iconColor: "text-yellow-500", key: "mindful-breaks" },
  { Icon: BookOpen, iconColor: "text-[#8b5e3c]", key: "reflection" },
];
