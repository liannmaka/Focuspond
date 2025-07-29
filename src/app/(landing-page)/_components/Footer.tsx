import { SectionDivider } from "@/components/ui";
import Link from "next/link";
import { FooterNavLinks } from "@/types/landing-page";

const footerNavLinks: FooterNavLinks[] = [
  {
    href: "/pricing",
    linkLabel: "Pricing",
  },
  {
    href: "/contact",
    linkLabel: "Contact Us",
  },
  {
    href: "/signup",
    linkLabel: "Login or Sign Up",
  },
];

const Footer = () => {
  return (
    <footer className="py-10 px-10 bg-[#a8c686]/10">
      <div className="max-w-[90rem] mx-auto rounded-3xl bg-white/80 backdrop-blur-md ring-1 ring-white/10 shadow-md">
        <div className="flex flex-col space-y-6 md:space-y-0 items-center md:flex-row md:justify-between px-8 pt-7">
          {/* Appname */}
          <div>
            <Link
              href="/"
              className="flex items-center text-walnut-brown tracking-tighter"
              title="Go to the homepage"
              aria-label="Go to the homepage"
            >
              <span className="font-manrope text-2xl md:text-3xl font-bold flex items-center text-[#6f472d]">
                Focus
              </span>
              <span className="font-sora text-accent-button text-sm font-bold self-end">
                Pond
              </span>
            </Link>
          </div>
          {/* language change this will come later*/}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#5a3a24] font-medium font-sora">
            {footerNavLinks.map(
              ({ href, linkLabel }: FooterNavLinks, idx: number) => (
                <Link
                  key={idx}
                  href={href}
                  className="hover:underline"
                >
                  {linkLabel}
                </Link>
              )
            )}
          </nav>
        </div>
        <div className="px-4">
          <SectionDivider />
        </div>
        <div className="px-8 pb-7">
          <p className="text-xs text-[#5a3a24] text-center font-sora py-1">
            &copy; {new Date().getFullYear()} FocusPond - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
