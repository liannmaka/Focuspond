"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import {
  Menu,
  X,
  LayoutGrid,
  PlayCircle,
  Lightbulb,
  HelpCircle,
} from "lucide-react";
import { useEffect, useState } from "react";

const NavBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = [
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
  }, [isVisible]);

  return (
    <header
      className={clsx(
        "fixed top-4 left-4 right-4 z-50 backdrop-blur-md rounded-xl px-6 transition-transform duration-300 ease-in-out",
        isVisible ? "translate-y-0 shadow-md" : "-translate-y-full shadow-none"
      )}
    >
      <nav className="max-w-7xl mx-auto flex justify-between items-center h-[69px]">
        {/* Logo and App name */}
        <div>
          <Link
            href="/"
            className="flex"
            title="Go to the homepage"
            aria-label="Go to the homepage"
          >
            <div className=" tracking-tighter text-walnut-brown flex">
              <span className="font-manrope text-2xl md:text-3xl font-bold flex">
                F
                <span className="inline-flex justify-center">
                  <Image
                    src="/svgs/brand-logo.png"
                    alt="brand logo"
                    width={35}
                    height={35}
                    priority
                  />
                </span>
                cus
              </span>
              <span className="font-sora text-accent-button text-sm font-bold self-end">
                Pond
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden space-x-4 lg:flex">
          {navLinks.map(({ href, linkLabel, icon }) => (
            <Link
              href={href}
              key={href}
              className="group inline-flex items-center px-2 py-1 rounded-md hover:text-accent-button transition-colors duration-200"
            >
              <div className="flex items-center">
                <span className="mr-1 text-base group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </span>
                <span className="font-sora font-normal text-sm tracking-wide">
                  {linkLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden lg:flex">
          <Button
            href="/signup"
            size="sm"
            className="border border-accent-button"
          >
            Get started
          </Button>
        </div>

        {/* Hamburger menu*/}
        <div className="flex items-center lg:hidden">
          <div
            onClick={toggleMenu}
            className="cursor-pointer bg-light-background text-dark-accent p-1 rounded-md hover:scale-[1.04]"
          >
            {isOpen ? <X /> : <Menu />}
          </div>
        </div>
      </nav>

      {/* Mobile View */}
      <div
        className={clsx(
          "lg:hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
        )}
      >
        {/* Navigation */}
        <div className="flex flex-col pb-7 pt-5 space-y-4.5">
          {navLinks.map(({ href, linkLabel, icon }) => (
            <Link
              href={href}
              key={href}
              className="group inline-flex items-center px-2 py-2 rounded-md hover:text-accent-button transition-colors duration-200 border border-dark-accent"
            >
              <div className="flex">
                <span className="mr-2 text-base group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </span>
                <span className="font-sora font-normal text-sm tracking-wide">
                  {linkLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="items-center gap-4 flex pb-5">
          <Button
            href="/signup"
            size="sm"
            className="border border-accent-button"
          >
            Get started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
