import type { Metadata } from "next";
import localFont from "next/font/local";
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
  title: "FocusPond",
  description:
    "Focuspond is a calm, frog-inspired Pomodoro app that blends Eat the Frog and mindfulness. Built for real humans who are tired, overwhelmed, or neurodivergent. It helps you tackle tasks with gentle focus and playful flow.",
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
      </body>
    </html>
  );
}
