import {
  Calendar,
  CalendarDays,
  Inbox,
  CheckCircle,
  LayoutGrid,
} from "lucide-react";

export const tabs = [
  { href: "/home/all", label: "All", icon: LayoutGrid },
  { href: "/home/today", label: "Today", icon: Calendar },
  { href: "/home/week", label: "Week", icon: CalendarDays },
  { href: "/home/backlog", label: "Backlog", icon: Inbox },
  { href: "/home/completed", label: "Done", icon: CheckCircle },
];
