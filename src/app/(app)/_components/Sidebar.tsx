"use client";

import { usePathname } from "next/navigation";
import { House, Smile, ChartNoAxesCombined } from "lucide-react";
// Restored with the Settings and Profile buttons at the foot of the rail:
// import { Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";

import LanguageSwitcher from "@/features/i18n/components/LanguageSwitcher";
import ThemeToggle from "@/features/theme/components/ThemeToggle";
import DashboardPanel from "../_layouts/DashboardPanel";
import IconButton from "./IconButton";

const getCurrentSection = (pathname: string) => {
  if (pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/analytics")) return "analytics";
  if (pathname.startsWith("/mood")) return "mood";
  return "others";
};

/** `labelKey` resolves under `nav.rail` — icon-only buttons need a name. */
const PRIMARY_NAV_ITEMS = [
  { icon: House, href: "/home/all", tab: "home", labelKey: "tasks" },
  {
    icon: ChartNoAxesCombined,
    href: "/analytics",
    tab: "analytics",
    labelKey: "progress",
  },
  // /tools was here and routed to a page that has never existed. /mood is the
  // real third destination. Smile, not Sun — the theme toggle owns the sun at
  // the foot of this rail, and two identical icons in one 56px column meaning
  // different things is a coin toss. It also matches the TopBar's mood pill.
  { icon: Smile, href: "/mood", tab: "mood", labelKey: "mood" },
] as const;

export default function SideBar() {
  const pathname = usePathname();

  const currentSection = getCurrentSection(pathname);

  return (
    <>
      <IconRail currentSection={currentSection} />
      {currentSection === "home" && <DetailPanel />}
    </>
  );
}

const IconRail = memo(({ currentSection }: { currentSection: string }) => {
  const router = useRouter();
  const t = useTranslations("nav.rail");

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  return (
    <nav className="h-full border-r border-line px-2 py-2 flex flex-col justify-between bg-surface-overlay">
      <div className="space-y-1">
        {PRIMARY_NAV_ITEMS.map(({ icon, href, tab, labelKey }) => (
          <IconButton
            key={tab}
            icon={icon}
            label={t(labelKey)}
            isActive={currentSection === tab}
            onClick={() => handleNavigation(href)}
          />
        ))}
      </div>

      {/*
        Preferences, at the foot of the rail where this pattern is read
        fluently. Both menus open as flyouts to the right — a dropdown hanging
        off a 56px column would run off the screen.
      */}
      <div className="flex flex-col items-center space-y-1">
        {/* divider */}
        <div className="h-px w-full bg-dark-accent/20 mb-2" />
        <LanguageSwitcher compact />
        <ThemeToggle compact />

        {/* Settings — there is no settings surface in the MVP, and no milestone
            currently owns one. Theme and language, the two preferences that do
            exist, are the controls directly above.
        <IconButton icon={Settings} label={t("settings")} />
        */}

        {/* Profile — returns with Supabase auth in M8. There is no account to
            open until then.
        <IconButton icon={User} label={t("profile")} />
        */}
      </div>
    </nav>
  );
});

IconRail.displayName = "IconRail";

const DetailPanel = () => {
  return (
    <div className="h-full border-r border-dark-accent/15">
      <DashboardPanel />
    </div>
  );
};
