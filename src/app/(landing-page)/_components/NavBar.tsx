"use client";

import SignupButton from "./ui/SignupButton";
import Link from "next/link";
import clsx from "clsx";
import {
  Menu,
  X,
  LayoutGrid,
  PlayCircle,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState, ReactNode } from "react";

interface NavLink {
  href: string;
  linkLabel: string;
  icon: ReactNode;
}

const navLinks: NavLink[] = [
  {
    href: "#features",
    linkLabel: "Features",
    icon: <LayoutGrid size={16} />,
  },
  {
    href: "#how-it-works",
    linkLabel: "How It Works",
    icon: <PlayCircle size={16} />,
  },
  {
    href: "#benefits",
    linkLabel: "Why FocusPond?",
    icon: <Lightbulb size={16} />,
  },
  {
    href: "#faq",
    linkLabel: "FAQ",
    icon: <HelpCircle size={16} />,
  },
];

const NavBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const linkStyles =
    "group inline-flex items-center px-2 rounded-md hover:text-accent-button transition-colors duration-200";

  const iconStyles =
    "text-base group-hover:scale-110 transition-transform duration-200";

  const linkLabelStyles = "font-sora font-normal text-sm tracking-wide";

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const controlNavBar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", controlNavBar);

    return () => window.removeEventListener("scroll", controlNavBar);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-4 left-4 right-4 z-50 backdrop-blur-md rounded-xl px-6 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0 shadow-md" : "-translate-y-full shadow-none"
      )}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center h-[var(--header-height)]">
        {/* Logo and App name */}
        <div>
          <Link
            href="/"
            className="flex items-center text-walnut-brown tracking-tighter"
            title="Go to the homepage"
            aria-label="Go to the homepage"
          >
            <span className="font-manrope text-2xl md:text-3xl font-bold flex items-center">
              Focus
            </span>
            <span className="font-sora text-accent-button text-sm font-bold self-end">
              Pond
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden space-x-4 lg:flex">
          {navLinks.map(({ href, linkLabel, icon }) => (
            <Link
              href={href}
              key={href}
              className={clsx(linkStyles, "py-1")}
            >
              <div className="flex items-center">
                <span className={clsx(iconStyles, "mr-1")}>{icon}</span>
                <span className={clsx(linkLabelStyles)}>{linkLabel}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="hidden lg:flex">
          <SignupButton />
        </div>

        {/* Hamburger menu*/}
        <div className="flex items-center lg:hidden">
          <button
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle navigation menu"
            className="cursor-pointer bg-light-background text-dark-accent p-1 rounded-md hover:scale-[1.04]"
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile View */}
      <div
        id="mobile-menu"
        className={clsx(
          "lg:hidden transition-all duration-300 ease-in-out",
          isOpen
            ? "max-h-80 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none overflow-hidden"
        )}
      >
        {/* Mobile Navigation */}
        <div className="flex flex-col pb-7 pt-5 space-y-4.5">
          {navLinks.map(({ href, linkLabel, icon }) => (
            <Link
              href={href}
              key={href}
              className={clsx(linkStyles, "py-2 border border-dark-accent")}
            >
              <div className="flex items-center">
                <span className={clsx(iconStyles, "mr-2")}>{icon}</span>
                <span className={clsx(linkLabelStyles)}>{linkLabel}</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Button */}
        <div className="items-center gap-4 flex pb-5">
          <SignupButton />
        </div>
      </div>
    </header>
  );
};

export default NavBar;
