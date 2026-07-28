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
// Colours cycle accent → ambient → warning so the grid reads as a rhythm; all
// four are theme tokens, never raw hex (see src/styles/globals.css).
export const features: Feature[] = [
  { Icon: Calendar, iconColor: "text-accent-text", key: "daily-planner" },
  { Icon: Timer, iconColor: "text-ambient", key: "focus-timer" },
  { Icon: FileText, iconColor: "text-warning", key: "quick-notes" },
  { Icon: RefreshCcw, iconColor: "text-ink-muted", key: "vibe-switcher" },
  { Icon: HeartPulse, iconColor: "text-accent-text", key: "mood-checkin" },
  { Icon: Award, iconColor: "text-ambient", key: "frog-selection" },
  { Icon: Coffee, iconColor: "text-warning", key: "mindful-breaks" },
  { Icon: BookOpen, iconColor: "text-ink-muted", key: "reflection" },
];
