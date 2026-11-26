// Copy lives in `marketing.waitlist.items.<key>` — the same split the other
// landing-page data files use.
import { Waitlist } from "@/types/landing-page";

import { Calendar, Timer, FileText } from "lucide-react";

export const waitlist: Waitlist[] = [
  { Icon: Calendar, key: "focused-sessions" },
  { Icon: Timer, key: "mindful-breaks" },
  { Icon: FileText, key: "clarity" },
];
