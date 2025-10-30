import Link from "next/link";
import { BrandLogo, SectionDivider } from "@/components/ui";
import { footerNavLinks } from "@/data/landing-page/navigation";

const Footer = () => {
  return (
    <footer className="py-10 px-10">
      <div className="max-w-[90rem] mx-auto rounded-3xl bg-white/80 backdrop-blur-md ring-1 ring-white/10 shadow-md">
        <div className="flex flex-col space-y-6 md:space-y-0 items-center md:flex-row md:justify-between px-8 pt-7">
          {/* Appname */}
          <div className="flex items-center">
            <div className="-ml-4">
              <BrandLogo />
            </div>
            <Link
              href="/"
              className="text-walnut-brown font-sora text-2xl font-semibold tracking-tight -ml-2 pt-1"
              title="Go to the homepage"
              aria-label="Go to the homepage"
            >
              <span>Focus</span>
              <span className="text-accent-button">Pond</span>
            </Link>
          </div>

          {/* language change: this will come later*/}
          <nav className="flex flex-wrap justify-center gap-6 text-sm text-[#5a3a24] font-medium font-sora">
            {footerNavLinks.map(({ href, linkLabel }, idx: number) => (
              <Link
                key={idx}
                href={href}
                className="link-animation"
              >
                {linkLabel}
              </Link>
            ))}
          </nav>
        </div>
        <div className="px-4">
          <SectionDivider />
        </div>
        <div className="px-8 pb-7">
          <p className="text-xs text-[#5a3a24] text-center font-sora py-1">
            &copy; {new Date().getFullYear()} Focuspond - All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
