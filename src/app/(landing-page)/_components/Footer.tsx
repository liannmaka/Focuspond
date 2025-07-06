import SectionDivider from "@/components/ui/SectionDivider";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="rounded-xl px-7">
      <div>
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
        {/* language change */}
        <div>language</div>
      </div>
      <SectionDivider />
      <div>
        <p>&copy; 2025 FocusPond – All rights reserved.</p>

        <nav className="flex flex-wrap justify-center gap-6 text-sm text-dark-accent/90 font-medium">
          <Link
            href="/pricing"
            className="hover:underline"
          >
            Pricing
          </Link>
          <Link
            href="/contact"
            className="hover:underline"
          >
            Contact Us
          </Link>
          <Link
            href="/login"
            className="hover:underline"
          >
            Login or Sign Up
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
