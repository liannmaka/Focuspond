import Link from "next/link";
import { BrandLogo } from "@/components/ui";
import { ReactNode } from "react";

export default function WaitlistLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen px-8">
      {/* Logo and App name */}
      <div className="flex items-center pt-4">
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
      <main className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-lg">{children}</div>
      </main>
    </div>
  );
}
