"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/ui";
import { CloudOff, Coffee, Smile, Timer } from "lucide-react";
// Non-MVP imports, restored alongside their controls below:
// import { User, Bell, Search, MoreVertical } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/features/i18n/components/LanguageSwitcher";
import ThemeToggle from "@/features/theme/components/ThemeToggle";
import { moodIdForLevel } from "@/features/mood/constants/moods";
import { useTodayMood } from "@/features/mood/hooks/useMood";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useRunningSession } from "@/features/pomodoro/hooks/useRunningSession";

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

/**
 * Shown only while the connection is down.
 *
 * Deliberately quiet: muted ink, no red, no pulsing dot. Being offline is not
 * an error in this app — the tasks, the frog and the timer are all in
 * IndexedDB on the device, so almost nothing is lost. The pill exists to
 * explain why a page might not load, not to raise an alarm about it, which is
 * also why the tooltip says where the work is rather than what has failed.
 *
 * `role="status"` so a screen reader hears about it when it appears, politely,
 * rather than either announcing nothing or interrupting with an alert.
 *
 * Renders nothing while online, and `useOnlineStatus` starts optimistic, so the
 * server and the first client paint agree on an empty space — no flash of
 * "offline" at someone who isn't.
 */
function OfflinePill() {
  const t = useTranslations("common.offline");
  const online = useOnlineStatus();

  if (online) return null;

  return (
    <div
      role="status"
      title={t("pillHint")}
      className="flex items-center gap-1.5 rounded-full border border-line bg-surface-sunken px-2.5 py-1"
    >
      <CloudOff
        className="size-3 shrink-0 text-ink-subtle"
        aria-hidden
      />
      <span className="font-manrope text-[11px] font-medium text-ink-muted">
        {t("pill")}
      </span>
    </div>
  );
}

/**
 * The session running right now, wherever you are in the app.
 *
 * Without it a started session vanishes the moment you leave the focus screen:
 * the frog card still offers to start one, the task sits there looking
 * untouched, and the only way to find out whether 25 minutes is counting down
 * is to go and look. A clock you have to go and look for is not a clock.
 *
 * A link, not a notice — the thing you want when you see it is to go back.
 * Breaks count too: the five minutes after a session have a clock and a screen
 * of their own, and leaving them out would make them feel like a dead end.
 */
function SessionPill() {
  const t = useTranslations("common.session");
  const session = useRunningSession();

  if (!session) return null;

  const label =
    session.kind === "focus"
      ? t("focus", { time: session.display })
      : t("break", { time: session.display });

  return (
    <Link
      href={session.href}
      aria-label={t("resume")}
      className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 transition-colors hover:bg-accent/20"
    >
      {session.kind === "focus" ? (
        <Timer
          className="size-3 shrink-0 text-accent-text"
          aria-hidden
        />
      ) : (
        <Coffee
          className="size-3 shrink-0 text-ambient"
          aria-hidden
        />
      )}
      <span className="font-manrope text-[11px] font-medium text-ink tabular-nums">
        {label}
      </span>
    </Link>
  );
}

/**
 * Controls commented out below are deliberate, not forgotten — each is outside
 * the MVP (see docs/roadmap.md) and was showing as a button that did nothing.
 * Every block names the milestone that brings it back.
 *
 * They are commented rather than deleted because they are all returning. Keep
 * the milestone tags: this codebase has already had 34 lines of commented-out
 * sync code rot for six months (docs/features/sync.md), and an untagged comment
 * is how that happens.
 */
export default function TopBar({ className }: { className?: string }) {
  const t = useTranslations("common.app");

  // --- Search state — returns in M7 as a ⌘K command palette ---
  // const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  // const searchRef = useRef<HTMLDivElement>(null);
  //
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       searchRef.current &&
  //       !searchRef.current.contains(event.target as Node)
  //     ) {
  //       setIsSearchOpen(false);
  //     }
  //   };
  //
  //   if (isSearchOpen) {
  //     document.addEventListener("mousedown", handleClickOutside);
  //   }
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, [isSearchOpen]);

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
          {/* Profile + Sign In — both return with Supabase auth in M8.
              Until accounts exist these are buttons that do nothing.
          <div className="flex items-center gap-3 p-2 md:p-0">
            <div className="w-8.5 h-8.5 bg-linear-to-br from-accent-button/20 to-secondary-accent/20 rounded-full flex justify-center items-center ring-2 ring-dark-accent/20 active:scale-95 transition-transform cursor-pointer lg:hidden">
              <User size={18} className="text-dark-accent" />
            </div>

            <button className="px-3 py-1.5 bg-accent-button text-accent-ink rounded-lg font-sora text-xs font-medium active:scale-95 transition-transform cursor-pointer hover:-translate-y-0.5">
              {t("signIn")}
            </button>
          </div>
          */}

          {/* Right Actions */}
          <div className="relative flex items-center gap-1 md:gap-3">
            {/*
              Here rather than beside the Guest Mode pill, which is inside a
              `hidden md:flex` block — a connection notice that only appears on
              a desktop would be missing from the device most likely to lose one.
            */}
            <SessionPill />
            <OfflinePill />
            {/* Search — returns in M7 as a ⌘K command palette. Uncomment the
                state and effect at the top of this file alongside it.
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="topbar-icon-button tap-target"
            >
              <Search size={18} />
            </button>

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
            */}

            {/* Notifications — nothing in the product generates one yet, and
                none are promised anywhere in the marketing copy. No milestone
                owns this; it needs a reason to exist before it returns.
            <button className="topbar-icon-button tap-target">
              <Bell size={18} />
            </button>
            */}

            {/* Vibe Switcher + light/dark — below lg only; the side rail owns
                them on desktop. */}
            <ThemeToggle className="lg:hidden" />
            <LanguageSwitcher className="hidden sm:block lg:hidden" />

            {/* More Menu — no menu was ever specified for this, in the roadmap
                or the marketing copy. It needs contents before it returns.
            <button className="topbar-icon-button tap-target">
              <MoreVertical size={18} />
            </button>
            */}
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
