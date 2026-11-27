import {
  Calendar,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle,
  House,
  Inbox,
  LayoutGrid,
  Smile,
  Timer,
} from "lucide-react";

// Labels live in `nav.tabs.<key>` in the message catalogs.
export const tabs = [
  { href: "/home/all", key: "all", icon: LayoutGrid },
  { href: "/home/today", key: "today", icon: Calendar },
  { href: "/home/week", key: "week", icon: CalendarDays },
  { href: "/home/backlog", key: "backlog", icon: Inbox },
  { href: "/home/completed", key: "completed", icon: CheckCircle },
] as const;

/**
 * The four places the app goes. Labels live in `nav.rail.<key>`.
 *
 * Shared by the desktop rail and the mobile bottom bar, because they are the
 * same navigation drawn twice. They were not: the rail held these four and the
 * bottom bar held the five task filters, so below `lg` there was no way to
 * reach Progress, Mood or a free focus session at all — the rail is
 * `hidden lg:grid`, and nothing replaced it.
 *
 * `section` is what the current route resolves to, so both surfaces highlight
 * the same item from the same rule.
 */
export const sections = [
  { href: "/home/all", key: "tasks", section: "home", icon: House },
  { href: "/home/timer/free", key: "focus", section: "focus", icon: Timer },
  {
    href: "/analytics",
    key: "progress",
    section: "analytics",
    icon: ChartNoAxesCombined,
  },
  { href: "/mood", key: "mood", section: "mood", icon: Smile },
] as const;

export type Section = (typeof sections)[number]["section"] | "others";

/**
 * Which section a path belongs to.
 *
 * Most specific first: `/home/timer` lives under `/home` but is its own place,
 * and the general test would swallow it.
 *
 * Lives beside the data it reads rather than in either navigation component —
 * when each kept its own copy, the rail and the bottom bar could disagree
 * about where you were, which is the kind of thing nobody notices until the
 * wrong tab is lit on one of them.
 */
export function sectionFor(pathname: string): Section {
  if (pathname.startsWith("/home/timer")) return "focus";
  if (pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/mood")) return "mood";

  return "others";
}
