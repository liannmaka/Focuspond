"use client";

import { BrandLogo } from "@/components/ui";
import { User, Bell, Search, MoreVertical, Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopBar({ className }: { className?: string }) {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);
  console.log("top", searchRef.current);

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
      className={`bg-white/95 border-b border-dark-accent/15 pt-[env(safe-area-inset-top)] ${className}`}
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
                Guest Mode
              </span>
            </div>

            {/* Vertical Slash Separator */}
            <div className="h-4 w-px bg-dark-accent/50 rotate-20 mx-4" />
          </div>

          <button className="mood-button hidden px-3 rounded-full transition-all hover:bg-light-background/20 md:flex">
            <Smile
              size={14}
              className="text-dark-accent"
            />
            <span className="text-xs font-manrope font-medium text-dark-accent">
              Set your mood
            </span>
          </button>
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

            <button className="px-3 py-1.5 bg-accent-button text-white rounded-lg font-sora text-xs font-medium active:scale-95 transition-transform cursor-pointer hover:-translate-y-0.5">
              Sign In
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
              <div className="absolute top-14 right-0 w-[calc(100vw-2rem)] max-w-md bg-white rounded-xl shadow-xl border border-dark-accent/15 p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 my-1">
                  <Search className="w-4 h-4 text-dark-accent" />
                  <input
                    type="text"
                    placeholder="Search task"
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

            {/* More Menu */}
            <button className="topbar-icon-button tap-target">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: Mood Indicator Bar */}
      <div className="md:hidden border-t border-dark-accent/10 px-4 py-2">
        <button className="mood-button flex w-full justify-center rounded-lg">
          <Smile
            size={14}
            className="text-dark-accent"
          />
          <span className="text-xs font-manrope font-medium text-dark-accent">
            Set your mood
          </span>
        </button>
      </div>
    </header>
  );
}
