"use client";

import { usePathname } from "next/navigation";
// Restored with the Settings and Profile buttons at the foot of the rail:
// import { Settings, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { memo } from "react";

import LanguageSwitcher from "@/features/i18n/components/LanguageSwitcher";
import ThemeToggle from "@/features/theme/components/ThemeToggle";
import DashboardPanel from "../_layouts/DashboardPanel";
import { sectionFor, sections } from "@/data/web-app/navigation";
import IconButton from "./IconButton";

export default function SideBar() {
  const pathname = usePathname();

  const currentSection = sectionFor(pathname);

  return (
    <>
      <IconRail currentSection={currentSection} />
      {/*
        The focus screen drops the panel: a screen whose whole job is one task
        and a clock should not sit beside a list of everything else you could
        be doing. It briefly kept the panel because the grid rendered a
        panel-less page 235px wide — that is fixed in the layout now, so this
        can be what it should have been.
      */}
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
        {sections.map(({ icon, href, section, key }) => (
          <IconButton
            key={key}
            icon={icon}
            label={t(key)}
            isActive={currentSection === section}
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
    // Carries its own 235px rather than inheriting it from a fixed grid column.
    // The column is `auto` so it collapses when this is not rendered.
    <div className="h-full w-[235px] border-r border-dark-accent/15">
      <DashboardPanel />
    </div>
  );
};
