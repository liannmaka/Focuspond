"use client";

import { User, Bell, Search, CircleSmall } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TopBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close on click outside
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
    <header className="sticky top-0 z-30">
      <div className="flex items-center justify-between h-[70px] px-4 md:px-6 md:justify-end">
        {/* Mobile: Profile + login/sign up */}
        <div className="flex items-center gap-3 cursor-pointer p-2 md:hidden">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex justify-center items-center ring-2 ring-gray-100">
            <User
              size={20}
              color="#fff"
            />
          </div>
          <button className="text-accent-button font-sora text-sm">
            Sign In | Sign Up
          </button>
        </div>

        {/* Right Actions */}
        <div
          className="flex items-center gap-2 relative"
          ref={searchRef}
        >
          {/* Search */}
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer text-dark-accent"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={20} />
          </button>

          {/* Search Dropdown - Works at ALL sizes */}
          {isSearchOpen && (
            <div className="absolute top-12 right-0 w-[calc(100vw-2rem)] max-w-md bg-white rounded-xl shadow-xl border border-gray-100 p-4 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-2 mb-3">
                <Search className="w-4 h-4 text-dark-accent" />
                <input
                  type="text"
                  placeholder="Search tasks"
                  autoFocus
                  className="flex-1 outline-none text-darker-accent placeholder:text-gray-500 font-sora text-[13px]"
                />
              </div>
            </div>
          )}

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 text-dark-accent rounded-lg transition-colors cursor-pointer">
            <Bell size={20} />
          </button>

          <button className="flex cursor-pointer items-center p-2 hover:bg-gray-100 text-dark-accent rounded-lg transition-colors">
            <CircleSmall
              strokeWidth={4}
              size={8}
            />
            <CircleSmall
              strokeWidth={4}
              size={8}
            />
            <CircleSmall
              strokeWidth={4}
              size={8}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
