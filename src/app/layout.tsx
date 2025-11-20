import type { Metadata } from "next";
import localFont from "next/font/local";
import { Toaster } from "sonner";
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

export const metadata: Metadata = {
  title: "Focuspond ~ Your calm space to plan, focus, and reflect.",
  description:
    "Focuspond is a mindful productivity space that helps you plan your day, focus deeply, take mindful breaks, and end with calm reflection ~ all in one quiet flow.",
  metadataBase: new URL("https://focuspond.vercel.app/"),
  openGraph: {
    title: "Focuspond ~ Your calm space to plan, focus, and reflect.",
    description:
      "Focuspond is a mindful productivity space that helps you plan your day, focus deeply, take mindful breaks, and end with calm reflection ~ all in one quiet flow.",
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
    title: "Focuspond ~ Your calm space to plan, focus, and reflect.",
    description:
      "Focuspond is a mindful productivity space that helps you plan your day, focus deeply, take mindful breaks, and end with calm reflection ~ all in one quiet flow.",
    images: ["https://focuspond.vercel.app/images/preview-card.png"],
    creator: "@filix_lillyann",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${sora.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          closeButton
          richColors
        />
      </body>
    </html>
  );
}
