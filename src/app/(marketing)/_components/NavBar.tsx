"use client";

import SignupButton from "./ui/SignupButton";
import Link from "next/link";
import clsx from "clsx";
import { BrandLogo } from "@/components/ui";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { navLinks } from "@/data/landing-page/navigation";

const NavBar = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const linkStyles = "group inline-flex items-center px-2 font-normal";

  const iconStyles =
    "text-base group-hover:scale-110 transition-transform duration-200";

  const linkLabelStyles = "font-sora text-sm tracking-wide";

  const activeLink = "font-medium text-accent-button";

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

  // useEffect for active section highlight as you scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      let found = false;

      // Loop through navLinks to find which section is in view
      for (const { href } of navLinks) {
        const section = document.getElementById(href);
        if (section) {
          const { offsetTop, offsetHeight } = section;

          if (
            scrollY >= offsetTop - 100 &&
            scrollY < offsetTop + offsetHeight - 100
          ) {
            setActiveSection(href);
            found = true;
            break;
          }
        }
      }

      if (!found) {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Set initial active section

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // toggle for Hamburger menu
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <header
      className={clsx(
        "bg-base-background/80 fixed top-4 left-4 right-4 z-50 rounded-xl backdrop-blur-md px-6 transition-transform duration-300 ease-in-out",
        isVisible
          ? "translate-y-0 shadow-md"
          : "-translate-y-[calc(100%+1rem)] shadow-none"
      )}
    >
      <nav className="max-w-360 mx-auto flex justify-between items-center h-(--header-height)">
        {/* Logo and App name */}
        <div className="flex items-center">
          <div className="-ml-4">
            <BrandLogo />
          </div>
          <Link
            href="/"
            className="font-sora text-2xl font-semibold tracking-tight -ml-2 pt-1"
            title="Go to the homepage"
            aria-label="Go to the homepage"
          >
            <span>Focus</span>
            <span className="text-accent-button">Pond</span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden space-x-4 lg:flex">
          {navLinks.map(({ href, linkLabel, Icon }) => (
            <Link
              key={href}
              href={`/#${href}`}
              onClick={() => {
                setActiveSection(href);
                setIsOpen(false);
              }}
              className={clsx(
                linkStyles,
                "link-animation py-4 cursor-pointer",
                activeSection === href ? activeLink : ""
              )}
              aria-label={linkLabel}
            >
              <div className="flex items-center">
                <span className={clsx(iconStyles, "mr-1")}>
                  <Icon size={16} />
                </span>
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
          "lg:hidden overflow-hidden transition-all duration-700 ease-in-out",
          isOpen
            ? "max-h-80 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Mobile Navigation */}
        <div
          className={clsx(
            "transition-transform duration-500 delay-300 ease-in-out",
            isOpen ? "translate-y-0" : "-translate-y-2"
          )}
        >
          <div className="flex flex-col pb-7 pt-5 space-y-4.5">
            {navLinks.map(({ href, linkLabel, Icon }) => (
              <Link
                key={href}
                href={`/#${href}`}
                onClick={() => {
                  setActiveSection(href);
                  setIsOpen(false);
                }}
                className={clsx(
                  linkStyles,
                  "link-animation py-2 rounded-md border border-dark-accent cursor-pointer",
                  activeSection === href ? activeLink : ""
                )}
                aria-label={linkLabel}
              >
                <div className="flex items-center">
                  <span className={clsx(iconStyles, "mr-2")}>
                    <Icon size={16} />
                  </span>
                  <span className={clsx(linkLabelStyles)}>{linkLabel}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Button */}
          <div className="pb-5">
            <SignupButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
