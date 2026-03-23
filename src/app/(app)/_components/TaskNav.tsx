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
          //         <Link
          //           key={item.href}
          //           href={item.href}
          //           className={`
          //   flex items-center gap-3.5 py-3.5 px-6 relative // Increase padding
          //   transition-colors duration-150 // Add smooth
          //   ${
          //     isActive
          //       ? "bg-accent-button/5 text-dark-accent" // Tinted background when active
          //       : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          //   }
          // `}
          //         >
          //           {isActive && (
          //             <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent-button" />
          //           )}
          //           <Icon
          //             className="w-4 h-4" // Slightly larger icons
          //             strokeWidth={isActive ? 2.5 : 1.5}
          //           />
          //           <span
          //             className={`text-sm font-manrope ${isActive ? "font-semibold" : "font-medium"}`}
          //           >
          //             {item.label}
          //           </span>
          //         </Link>

          <Link
            key={item.href}
            href={item.href}
            className={`
    flex items-center gap-3.5 py-3.5 px-6 relative
    transition-colors duration-150
    ${
      isActive
        ? "bg-linear-to-r from-accent-button/8 to-accent-button/4 text-dark-accent"
        : "text-dark-accent/80 hover:bg-light-background/20 hover:text-dark-accent"
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

{
  /* <Link
            key={item.href}
            href={item.href}
            className={`
                flex items-center gap-3 py-3 px-4 relative
                ${isActive ? "bg-gray-100" : "hover:bg-gray-50"}
              `}
          >
            {isActive && (
              <span className="absolute left-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-accent-button" />
            )}
            <Icon
              className="w-3.5 h-3.5"
              strokeWidth={isActive ? 2 : 1.5}
            />
            <span
              className={`text-xs font-medium font-manrope ${isActive ? "" : ""}`}
            >
              {item.label}
            </span>
          </Link> */
}
