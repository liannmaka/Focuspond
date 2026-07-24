import {
  Calendar,
  CalendarDays,
  Inbox,
  CheckCircle,
  LayoutGrid,
} from "lucide-react";

// Labels live in `nav.tabs.<key>` in the message catalogs.
export const tabs = [
  { href: "/home/all", key: "all", icon: LayoutGrid },
  { href: "/home/today", key: "today", icon: Calendar },
  { href: "/home/week", key: "week", icon: CalendarDays },
  { href: "/home/backlog", key: "backlog", icon: Inbox },
  { href: "/home/completed", key: "completed", icon: CheckCircle },
] as const;
