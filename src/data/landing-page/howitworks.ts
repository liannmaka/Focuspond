import { Calendar, Timer, HeartPulse, BookOpen } from "lucide-react";
import { HowItWork } from "@/types/landing-page";

// Copy lives in `marketing.howItWorks.items.<key>` in the message catalogs.
export const steps: HowItWork[] = [
  { Icon: HeartPulse, key: "check-mood" },
  { Icon: Calendar, key: "plan-day" },
  { Icon: Timer, key: "start-sprint" },
  { Icon: BookOpen, key: "reflect" },
];
