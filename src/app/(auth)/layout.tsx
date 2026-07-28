import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/ui";
import LanguageSwitcher from "@/features/i18n/components/LanguageSwitcher";
import ThemeToggle from "@/features/theme/components/ThemeToggle";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("common.auth");

  return (
    <div className="relative flex min-h-screen flex-col bg-surface text-ink">
      {/* The drop lands off the top-left, so the rings read across the page. */}
      <div
        className="ripple-field pointer-events-none absolute inset-0 [--ripple-origin:12%_-10%]"
        aria-hidden
      />

      <header className="relative flex items-center justify-between gap-4 px-6 py-5 md:px-10">
        <Link
          href="/"
          className="link-animation inline-flex items-center gap-2 font-sora text-sm font-medium text-ink-muted"
        >
          <ArrowLeft
            className="size-4"
            aria-hidden
          />
          {t("backHome")}
        </Link>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <LanguageSwitcher className="hidden sm:block" />
        </div>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-95">
          <div className="mb-8 flex flex-col items-center text-center">
            <BrandLogo
              size={44}
              title="FocusPond"
            />
            <p className="mt-1 font-sora text-xl font-semibold tracking-tight">
              <span>Focus</span>
              <span className="text-accent-text">Pond</span>
            </p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
