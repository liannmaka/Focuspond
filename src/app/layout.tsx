import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { MoodSyncListener } from "@/features/mood/components/MoodSyncListener";
import { ThemeProvider } from "@/features/theme/components/ThemeProvider";
import { ThemedToaster } from "@/features/theme/components/ThemedToaster";
import "@/styles/globals.css";

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
});

const sora = localFont({
  src: [
    {
      path: "../../public/fonts/sora-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sora-500.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/sora-600.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/sora-700.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sora",
});

const APP_NAME = "FocusPond - Mood-Aware Productivity";
const APP_DESCRIPTION =
  "Stay focused and productive with mood-based task suggestions";

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: "%s | FocusPond",
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://focuspond.vercel.app/"),
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: "https://focuspond.vercel.app/",
    siteName: "Focuspond",
    images: [
      {
        url: "https://focuspond.vercel.app/images/preview-card.png",
        width: 1200,
        height: 627,
        alt: "Focuspond social preview card",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["https://focuspond.vercel.app/images/preview-card.png"],
    creator: "@filix_lillyann",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Matches --surface in src/styles/globals.css for each theme, so the browser
// chrome blends into the page instead of announcing the accent colour.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1f4f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1211" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Locale is resolved server-side from the cookie (see src/i18n/request.ts), so
  // the first paint already renders in the reader's chosen language — no flash.
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    // suppressHydrationWarning is required on <html>: next-themes stamps the
    // theme class here before React hydrates, so server and client markup
    // legitimately differ on first paint.
    <html
      lang={locale}
      suppressHydrationWarning
    >
      {/* Separately suppressed from <html>: the flag only covers the element it
          sits on, and browser extensions routinely inject attributes here. */}
      <body
        className={`${manrope.variable} ${sora.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}
          >
            {children}
            <MoodSyncListener />
            <ThemedToaster />
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
