import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  Inbox,
  CheckCircle,
  LayoutGrid,
} from "lucide-react";

export default function TaskNav() {
  const pathname = usePathname();
  const mainNavItems = [
    { href: "/home/all", label: "All Tasks", icon: LayoutGrid },
    { href: "/home/today", label: "Today", icon: Calendar },
    { href: "/home/week", label: "This Week", icon: CalendarDays },
    { href: "/home/backlog", label: "Backlog", icon: Inbox },
    { href: "/home/completed", label: "Completed", icon: CheckCircle },
  ];
  return (
    <div>
      {mainNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`my-2
    flex items-center gap-3.5 py-3.5 px-6 relative
    transition-colors duration-150
    ${
      isActive
        ? "bg-dark-accent/5 text-dark-accent"
        : "text-dark-accent/80 hover:bg-dark-accent/5 hover:text-dark-accent"
    }
  `}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-linear-to-b from-accent-button to-accent-button/80 shadow-sm" />
            )}
            <Icon
              className="w-4 h-4"
              strokeWidth={isActive ? 2.5 : 1.5}
            />
            <span
              className={`text-sm font-manrope ${isActive ? "font-semibold" : "font-medium"}`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

