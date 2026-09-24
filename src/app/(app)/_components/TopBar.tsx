"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui";
import { User, Bell, Search, MoreVertical, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/features/i18n/components/LanguageSwitcher";
import ThemeToggle from "@/features/theme/components/ThemeToggle";
import { moodIdForLevel } from "@/features/mood/constants/moods";
import { useTodayMood } from "@/features/mood/hooks/useMood";

/**
 * Today's mood, or an invitation to record one. The single place in the app
 * chrome that reflects how the reader said they feel.
 *
 * The label is resolved from the mood's *level* through the catalog, never from
 * the stored `MoodEntry.label` — that field is written once in English at
 * check-in and would show English in every locale.
 */
function MoodPill({ className = "" }: { className?: string }) {
  const t = useTranslations("common.app");
  const tMood = useTranslations("mood");
  const mood = useTodayMood();
  const moodId = mood ? moodIdForLevel(mood.level) : undefined;

  return (
    <Link
      href="/mood"
      className={`mood-button rounded-full px-3 transition-all hover:bg-light-background/20 ${className}`}
    >
      <Smile
        size={14}
        className="text-dark-accent"
      />
      <span className="font-manrope text-xs font-medium text-dark-accent">
        {moodId ? tMood(`moods.${moodId}.label`) : t("setMood")}
      </span>
    </Link>
  );
}

export default function TopBar({ className }: { className?: string }) {
  const t = useTranslations("common.app");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header
      className={`bg-surface-overlay border-b border-line pt-[env(safe-area-inset-top)] ${className}`}
    >
      <div className="px-4 flex items-center md:justify-between">
        {/* left column */}
        <div className="flex items-center">
          {/* first left div */}
          {/* Desktop */}
          <div className="hidden md:flex items-center">
            <div className="-ml-3.5">
              <BrandLogo />
            </div>

            {/* Vertical Slash Separator */}
            <div className="h-4 w-px bg-dark-accent/50 rotate-20 mr-4 ml-2" />

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-light-background/30 rounded-full border border-dark-accent/30">
              <div className="w-1.5 h-1.5 bg-secondary-accent rounded-full animate-pulse" />
              <span className="text-[11px] font-manrope font-medium text-dark-accent">
                {t("guestMode")}
              </span>
            </div>

            {/* Vertical Slash Separator */}
            <div className="h-4 w-px bg-dark-accent/50 rotate-20 mx-4" />
          </div>

          <MoodPill className="hidden md:flex" />
        </div>

        {/* right column */}
        <div className="flex justify-between w-full md:flex-row-reverse md:justify-end md:gap-4 md:w-auto">
          {/* Mobile: Profile + Sign In */}
          <div className="flex items-center gap-3 p-2 md:p-0">
            <div className="w-8.5 h-8.5 bg-linear-to-br from-accent-button/20 to-secondary-accent/20 rounded-full flex justify-center items-center ring-2 ring-dark-accent/20 active:scale-95 transition-transform cursor-pointer">
              <User
                size={18}
                className="text-dark-accent"
              />
            </div>

            <button className="px-3 py-1.5 bg-accent-button text-accent-ink rounded-lg font-sora text-xs font-medium active:scale-95 transition-transform cursor-pointer hover:-translate-y-0.5">
              {t("signIn")}
            </button>
          </div>

          {/* Right Actions */}
          <div
            className="flex items-center gap-1 md:gap-3 relative"
            ref={searchRef}
          >
            {/* Search */}

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="topbar-icon-button tap-target"
            >
              <Search size={18} />
            </button>

            {/* Search Dropdown */}

            {isSearchOpen && (
              <div className="absolute top-14 right-0 w-[calc(100vw-2rem)] max-w-md bg-surface-raised rounded-xl shadow-e3 border border-line p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 my-1">
                  <Search className="w-4 h-4 text-dark-accent" />
                  <input
                    type="text"
                    placeholder={t("searchTask")}
                    autoFocus
                    className="flex-1 outline-none text-dark-accent placeholder:text-dark-accent/40 text-[13px] placeholder:font-manrope placeholder:font-light"
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            <button className="topbar-icon-button tap-target">
              <Bell size={18} />
            </button>

            {/* Vibe Switcher + light/dark */}
            <ThemeToggle />
            <LanguageSwitcher className="hidden sm:block" />

            {/* More Menu */}
            <button className="topbar-icon-button tap-target">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Mood Indicator Bar */}
      <div className="md:hidden border-t border-dark-accent/10 px-4 py-2">
        <MoodPill className="flex w-full justify-center" />
      </div>
    </header>
  );
}
