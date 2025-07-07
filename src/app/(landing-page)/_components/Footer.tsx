import SectionDivider from "@/components/ui/SectionDivider";
import Link from "next/link";

interface FooterNavLinks {
  href: string;
  linkLabel: string;
}

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
    <footer className="my-11 px-10">
      <div className="max-w-7xl mx-auto rounded-3xl border border-light-background/40">
        <div className="flex flex-col space-y-6 md:space-y-0 items-center md:flex-row md:justify-between px-8 pt-7">
          {/* Appname */}
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
          {/* language change this will come later*/}
          {/* <div>language</div> */}
        </div>
        <div className="px-4">
          <SectionDivider />
        </div>
        <div className="flex flex-col space-y-6 md:space-y-0 md:flex-row md:justify-between px-8 pb-7">
          <p className="text-xs text-dark-accent/80 text-center font-sora">
            &copy; 2025 FocusPond – All rights reserved.
          </p>

          <nav className="flex flex-wrap justify-center gap-6 text-sm text-dark-accent/90 font-medium font-sora">
            {footerNavLinks.map(({ href, linkLabel }, idx) => (
              <Link
                key={idx}
                href={href}
                className="hover:underline"
              >
                {linkLabel}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
