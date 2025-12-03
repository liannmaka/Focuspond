import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";
import { execSync } from "child_process";

// git commit hash as cache version
const revision = execSync("git rev-parse HEAD", { encoding: "utf8" })
  .trim()
  .slice(0, 7);

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

export default withSerwist(nextConfig);
