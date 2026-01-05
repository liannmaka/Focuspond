"use client";

import { BrandLogo } from "@/components/ui";
import { User, Bell, Search, MoreVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100 pt-[env(safe-area-inset-top)]">
      <div className="h-16 px-4 flex items-center md:justify-between md:px-6">
        {/* left column */}
        <div className="-ml-2 hidden md:block">
          <BrandLogo />
        </div>

        {/* right column */}
        <div className="flex justify-between w-full md:flex-row-reverse md:justify-end md:gap-3.5 md:w-auto">
          {/* Mobile: Profile + Sign In */}
          <div className="flex items-center gap-3 p-2">
            <div className="w-9 h-9 bg-linear-to-br from-accent-button/20 to-secondary-accent/20 rounded-full flex justify-center items-center ring-2 ring-gray-100 active:scale-95 transition-transform cursor-pointer">
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
            className="flex items-center gap-1 md:gap-2 relative"
            ref={searchRef}
          >
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:w-10 md:h-10 md:border-[1.5px] md:border-gray-100 md:rounded-full md:flex md:justify-center md:items-center rounded-lg p-2 md:p-0 hover:bg-gray-50 active:bg-gray-100 active:scale-90 transition-all text-dark-accent tap-target cursor-pointer"
            >
              <Search size={18} />
            </button>

            {/* Search Dropdown */}
            {isSearchOpen && (
              <div className="absolute top-14 right-0 w-[calc(100vw-2rem)] max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex items-center gap-2 my-1">
                  <Search className="w-4 h-4 text-dark-accent" />
                  <input
                    type="text"
                    placeholder="Search task"
                    autoFocus
                    className="flex-1 outline-none text-dark-accent placeholder:text-gray-400 text-[13px] placeholder:font-manrope placeholder:font-light"
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            <button className="md:w-10 md:h-10 md:border-[1.5px] md:border-gray-100 md:rounded-full md:flex md:justify-center md:items-center rounded-lg p-2 md:p-0 hover:bg-gray-50 active:bg-gray-100 active:scale-90 text-dark-accent transition-all tap-target relative cursor-pointer">
              <Bell size={18} />
              {/* <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-button rounded-full" /> */}
            </button>

            {/* More Menu */}
            <button className="md:w-10 md:h-10 md:border-[1.5px] md:border-gray-100 md:rounded-full md:flex md:justify-center md:items-center rounded-lg p-2 md:p-0 hover:bg-gray-50 active:bg-gray-100 active:scale-90 text-dark-accent transition-all tap-target cursor-pointer">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
