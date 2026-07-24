"use client";

import Link from "next/link";
import { BrandLogo, SectionDivider } from "@/components/ui";
import { footerNavLinks } from "@/data/landing-page/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/features/i18n/components/LanguageSwitcher";

const Footer = () => {
  const pathName = usePathname();
  const t = useTranslations("marketing.footer");

  return (
    <footer className="py-10 px-10">
      <div className="max-w-360 mx-auto rounded-3xl bg-white/80 backdrop-blur-md ring-1 ring-white/10 shadow-md">
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

          <div className="flex flex-col items-center gap-5 md:flex-row md:gap-8">
            <nav className="flex flex-wrap justify-center gap-6 text-sm font-sora">
              {footerNavLinks.map(({ href, key }, idx: number) => (
                <Link
                  key={idx}
                  href={href}
                  className={`link-animation ${pathName === href ? "text-accent-button font-medium" : "text-dark-accent"}`}
                >
                  {t(key)}
                </Link>
              ))}
            </nav>

            {/* Vibe Switcher: choose the language/tone FocusPond speaks in. */}
            <LanguageSwitcher align="up" />
          </div>
        </div>
        <div className="px-4">
          <SectionDivider />
        </div>
        <div className="px-8 pb-7">
          <p className="text-xs text-[#5a3a24] text-center font-sora py-1">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
