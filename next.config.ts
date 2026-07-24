import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import createNextIntlPlugin from "next-intl/plugin";
import { execSync } from "child_process";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Cache-busting revision for the service worker precache.
// Prefer the platform-provided commit SHA (Vercel), fall back to a local git
// lookup, and finally to "dev" — so builds never fail in environments without
// a .git directory (Docker images, some CI runners, copied artifacts).
const revision = (() => {
  const fromCI = process.env.VERCEL_GIT_COMMIT_SHA;
  if (fromCI) return fromCI.slice(0, 7);
  try {
    return execSync("git rev-parse HEAD", { encoding: "utf8" })
      .trim()
      .slice(0, 7);
  } catch {
    return "dev";
  }
})();

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  cacheOnNavigation: true,
  reloadOnOnline: false,
  register: true,
  additionalPrecacheEntries: [
    { url: "/", revision },
    { url: "/offline", revision },
  ],
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Your existing config here
};

export default withSerwist(withNextIntl(nextConfig));
