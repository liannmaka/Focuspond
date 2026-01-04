"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  CalendarDays,
  Inbox,
  CheckCircle,
  LayoutGrid,
} from "lucide-react";

export default function BottomNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/dashboard/all", label: "All", icon: LayoutGrid },
    { href: "/dashboard/today", label: "Today", icon: Calendar },
    { href: "/dashboard/week", label: "Week", icon: CalendarDays },
    { href: "/dashboard/backlog", label: "Backlog", icon: Inbox },
    { href: "/dashboard/completed", label: "Done", icon: CheckCircle },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100 z-50 shadow-lg pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full relative active:scale-95 transition-transform tap-target"
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-accent-button rounded-full" />
              )}

              <div className="flex flex-col items-center justify-center gap-0.5">
                <div
                  className="p-2 rounded-xl transition-all duration-200"
                >
                  <Icon
                    className={`transition-all duration-200 ${
                      isActive
                        ? "w-6 h-6 text-accent-button"
                        : "w-5 h-5 text-gray-500"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-all font-manrope ${
                    isActive
                      ? "text-accent-button font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
