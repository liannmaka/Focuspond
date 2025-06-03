"use client";

import Button from "@/components/ui/Button";
import Link from "next/link";
import clsx from "clsx";
import { Menu, X, HelpingHand, Gift, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // const pathName = usePathname();
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = [
    {
      href: "#pitch",
      linkLabel: "How It Helps",
      icon: <HelpingHand size={18} />,
    },
    {
      href: "#audience",
      linkLabel: "Made For you",
      icon: <Gift size={18} />,
    },
    {
      href: "#benefits",
      linkLabel: "Standout Benefits",
      icon: <Sparkles size={18} />,
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
            <div className=" tracking-tight text-walnut-brown">
              <span className="font-manrope text-2xl md:text-3xl font-bold">
                Focus
              </span>
              <span className="font-sora text-accent-button text-sm font-bold">
                Pond
              </span>
            </div>
            {/* <div>Logo</div> */}
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
        <div className="hidden items-center gap-4 lg:flex">
          <Button
            href="/login"
            variant="outline"
            size="sm"
          >
            Login
          </Button>
          <Button
            href="/signup"
            size="sm"
            className="hover:brightness-110 border border-accent-button"
          >
            Get started for free
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
        <div className="flex flex-col py-8 space-y-4.5">
          {navLinks.map(({ href, linkLabel, icon }) => (
            <Link
              href={href}
              key={href}
              className="group inline-flex items-center px-2 py-2 rounded-md hover:text-accent-button transition-colors duration-200 border border-dark-accent"
            >
              <div className="flex">
                {/* className="self-center mr-2.5" */}
                <span className="mr-2 text-base group-hover:scale-110 transition-transform duration-200">
                  {icon}
                </span>
                {/* className="font-manrope text-sm" */}
                <span className="font-sora font-normal text-sm tracking-wide">
                  {linkLabel}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Buttons */}
        <div className="items-center gap-4 flex pb-3">
          <Button
            href="/login"
            variant="outline"
            size="sm"
          >
            Login
          </Button>
          <Button
            href="/signup"
            size="sm"
            className="hover:brightness-110 border border-accent-button"
          >
            Get started for free
          </Button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
